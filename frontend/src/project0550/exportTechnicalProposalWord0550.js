import { zipStore } from './exportOriginalPriceForm';
import { TECHNICAL_AUTHORITY_0550, TECHNICAL_SECTIONS_0550 } from './data/technicalProposal0550';
import { technicalDossier0550 } from './data/technicalDossier0550';
import { sanitizeCustomerText0550 } from './data/c1Appendix0550';
import { c4CapitalSparesRows0550 } from './data/c4CapitalSpares0550';
import { c5SpecialToolsRows0550 } from './data/c5ToolsScope0550';
import { CCTV_TPLINK_DEVIATION_0550 } from './data/mgwCctvEntBudget0550';
import { DTS_SYSTEM_PACKAGE_MAP_0550 } from './data/dtsGenerator0550';
import pagaMobPlan from './data/pagaMobPlan0550.json';

const ARIAL = '<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>';
const esc = v =>
  String(v ?? '')
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ' ')
    .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Deliberate allowlist: Volume II technical Word export contains no cost, sell, margin or FX.
const cleanTech = v =>
  sanitizeCustomerText0550(String(v ?? ''))
    .replace(/\b(?:USD|THB|EUR|RMB|CNY)\s*[\d,]+(?:\.\d+)?/gi, '[COMMERCIAL REDACTED]');

const p = (text, { bold = false, sz = '19', color = '17304A', align = 'left', before = '40', after = '60', keepNext = false, pageBreak = false } = {}) =>
  `<w:p><w:pPr>${pageBreak ? '<w:pageBreakBefore/>' : ''}${keepNext ? '<w:keepNext/>' : ''}<w:spacing w:before="${before}" w:after="${after}" w:line="240" w:lineRule="auto"/><w:jc w:val="${align}"/></w:pPr><w:r><w:rPr>${ARIAL}${bold ? '<w:b/><w:bCs/>' : ''}<w:color w:val="${color}"/><w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/></w:rPr><w:t xml:space="preserve">${esc(cleanTech(text))}</w:t></w:r></w:p>`;

const h1 = (text, pageBreak = true) => p(text, { bold: true, sz: '28', color: '164F86', before: '180', after: '100', keepNext: true, pageBreak });
const h2 = text => p(text, { bold: true, sz: '23', color: '12536B', before: '140', after: '70', keepNext: true });
const h3 = text => p(text, { bold: true, sz: '20', color: '17304A', before: '100', after: '40', keepNext: true });

function makeTable(heads, rows, widths) {
  const totalW = widths.reduce((a, b) => a + b, 0);
  const tr = (cells, isHeader = false, rowIdx = 0) =>
    `<w:tr><w:trPr>${isHeader ? '<w:tblHeader/>' : '<w:cantSplit/>'}</w:trPr>${cells
      .map((v, i) => {
        const bg = isHeader ? '164F86' : rowIdx % 2 === 1 ? 'F4F8FB' : 'FFFFFF';
        const txtColor = isHeader ? 'FFFFFF' : '17304A';
        return `<w:tc><w:tcPr><w:tcW w:w="${widths[i]}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="${bg}"/><w:vAlign w:val="top"/></w:tcPr>${p(v ?? '', { bold: isHeader, sz: '16', color: txtColor, before: '20', after: '20' })}</w:tc>`;
      })
      .join('')}</w:tr>`;
  return (
    `<w:tbl><w:tblPr><w:tblW w:w="${totalW}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="50" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="50" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar><w:tblBorders>` +
    ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(n => `<w:${n} w:val="single" w:sz="4" w:color="B0C4D4"/>`).join('') +
    `</w:tblBorders></w:tblPr><w:tblGrid>${widths.map(w => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>` +
    tr(heads, true) +
    rows.map((r, idx) => tr(r, false, idx)).join('') +
    `</w:tbl>` +
    p('', { before: '0', after: '60' })
  );
}

function estimateWeightDims(eq) {
  if (eq.detail?.estimatedWeightKg > 0) {
    return [String(eq.detail.estimatedWeightKg), eq.detail.dimensions || 'OPEN', eq.detail.basis || 'Recorded'];
  }
  const d = String(eq.description || '').toLowerCase();
  const u = String(eq.unit || '').toLowerCase();
  if (/60\s*m|60\.0m|60 meter/.test(d)) return ['14500 (Est.)', '60,000 H x 4,500 Base mm', 'Est. 60m self-supporting tower'];
  if (/30\s*m|30\.0m|30 meter/.test(d)) return ['4800 (Est.)', '30,000 H x 2,800 Base mm', 'Est. 30m self-supporting tower'];
  if (/cabinet|rack/.test(d)) return ['165 (Est.)', '800 x 1000 x 2000 mm (42U)', 'Est. 42U telecom cabinet'];
  if (/speaker|horn/.test(d)) return ['4.5 (Est.)', '280 x 240 x 320 mm', 'Est. Ex-proof speaker/horn'];
  if (/beacon|flashing/.test(d)) return ['3.2 (Est.)', '180 x 180 x 310 mm', 'Est. Ex-proof status beacon'];
  if (/ptz/.test(d) && /camera/.test(d)) return ['14.0 (Est.)', '320 x 280 x 410 mm', 'Est. Ex-proof PTZ camera'];
  if (/camera/.test(d)) return ['7.5 (Est.)', '220 x 180 x 340 mm', 'Est. Ex-proof fixed camera'];
  if (/switch|router|firewall|pabx|gateway/.test(d)) return ['6.0 (Est.)', '445 x 380 x 44 mm (1U)', 'Est. 1U rackmount appliance'];
  if (/telephone|phone/.test(d)) return ['3.8 (Est.)', '220 x 150 x 320 mm', 'Est. Ex-proof / industrial IP phone'];
  if (/cable|fiber|foc/.test(d) || ['m', 'meter', 'meters'].includes(u)) return ['0.45 /m (Est.)', 'OD 12-18 mm (drum)', 'Est. armored cable per m'];
  return ['10.0 (Est.)', '400 x 350 x 250 mm (Est.)', 'Est. telecom unit; verify OEM packing list'];
}

export function buildTechnicalProposalDocx0550(view, data, model, today = '2026-11-17') {
  const prop = view.proposal || {};
  const systems = view.systems || [];
  const docNo = prop.documentNo || 'ASK-1A-TEL-VOL2-0001 (DRAFT)';
  const rev = prop.revision || 'Rev00';

  let body = '';
  // Cover
  body += p('INVITATION FOR COMPETITIVE TENDER — ASK PROJECT (TSI)', { bold: true, sz: '24', color: '12536B', align: 'center', before: '400', after: '120' });
  body += p('VOLUME II — TECHNICAL PROPOSAL', { bold: true, sz: '40', color: '164F86', align: 'center', before: '120', after: '120' });
  body += p('EPC OF ONSHORE PROCESSING FACILITIES AND ASSOCIATED ONSHORE PIPELINES FOR AUNG SINKHA DEVELOPMENT PROJECT PHASE 1A', { bold: true, sz: '20', color: '17304A', align: 'center', before: '60', after: '200' });
  body += p('DRAFT — NOT FOR SUBMISSION (No Commercial / Cost / Sell / FX Data)', { bold: true, sz: '20', color: '9A5C00', align: 'center', before: '60', after: '200' });

  body += makeTable(
    ['Document Control Field', 'Project Value / Basis'],
    [
      ['Project', 'PJ2608-0550 — Aung Sinkha Development Project Phase 1A (ASK)'],
      ['End Client / Contractor / SI', 'PTTEP International Limited / Samart Comtech Co., Ltd. / Add Value System Co., Ltd.'],
      ['Document No. / Revision', `${docNo} / ${rev}`],
      ['Tender Authority', `${TECHNICAL_AUTHORITY_0550.title} (${TECHNICAL_AUTHORITY_0550.date}) — ${TECHNICAL_AUTHORITY_0550.locator}`],
      ['Prepared Date / Status', `${today} / ${view.state || 'DRAFT_NOT_ISSUED'}`],
    ],
    [3000, 6600]
  );

  body += h2('Contents & Preparation Checklist — Volume II Items 3(1)–3(5)');
  body += makeTable(
    ['Clause', 'Required Section', 'Authored / Expected', 'Reviewed Draft'],
    TECHNICAL_SECTIONS_0550.map(s => {
      const rows = (view.records || []).filter(r => r.sectionId === s.id);
      return [s.number, s.title, `${rows.filter(r => r.content?.trim()).length} / ${rows.length}`, String(rows.filter(r => r.state === 'REVIEWED_DRAFT').length)];
    }),
    [900, 5100, 1800, 1800]
  );

  // SECTION 3(1)
  body += h1('SECTION 3(1) — TECHNICAL DESCRIPTION OF EQUIPMENT / SYSTEM, DRAWINGS & CALCULATIONS');
  body += p('System-by-system technical description, customer requirement disposition, supplier technical basis, engineering drawings, and calculations across all 19 Telecommunication Systems + COMMON.');
  systems.forEach((s, idx) => {
    const d = technicalDossier0550(data, model, view, s.token, 'description');
    const dts = DTS_SYSTEM_PACKAGE_MAP_0550[s.token];
    body += h3(`3(1).${idx + 1} ${s.token} — ${s.name}`);
    body += p(`Owner: ${d.record?.owner || 'OPEN'} · State: ${d.record?.state || 'OPEN'} · Client DTS: ${dts?.clientDts || 'Per MR Appendix 1 & 2'}`);
    if (d.record?.content) body += p(d.record.content, { sz: '18' });
    if (d.requirements?.length) {
      body += makeTable(
        ['Requirement ID', 'Customer Statement / Source', 'SI Disposition / State'],
        d.requirements.slice(0, 12).map(r => [r.id, r.statement || r.title || 'OPEN', `${r.need || 'SI ANALYSIS OPEN'} (${r.state || 'OPEN'})`]),
        [1800, 4200, 3600]
      );
    }
    if (d.proofs?.length) {
      body += makeTable(
        ['CAL/RPT ID', 'Method / Criteria', 'Result / State'],
        d.proofs.map(pr => [
          `${pr.id} / ${pr.requirementId}`,
          `${pr.method || 'METHOD OPEN'} | ${pr.criteria || 'CRITERIA OPEN'}`,
          pr.kind === 'CAL'
            ? (pr.result?.value == null ? 'CALCULATION OPEN' : /USD|THB|EUR|RMB|CNY/i.test(pr.result?.unit || '') ? 'Commercial calc (excluded from Vol II)' : `${pr.result.value} ${pr.result.unit}`)
            : `${pr.report || 'REPORT OPEN'} (${pr.state || 'OPEN'})`,
        ]),
        [2000, 4200, 3400]
      );
    }
  });

  body += h2('3(1).20 Necessary Engineering Drawings & Calculation References');
  body += makeTable(
    ['Document / Reference', 'Title / Scope', 'Basis'],
    [
      ['MM-ASK-1A-TEL-BLD-0001', 'Overall Telecommunication Schematic / Block Diagram', '1 Sheet — Overall Architecture'],
      ['MM-ASK-1A-TEL-DWG-0001-01 (Sh. 1–12)', 'Aung Sinkha Phase 1A Telecommunication Block Diagrams & Typical Installation Details', 'Tower, PAGA Beacon/Speakers, IP Telephony, CCTV, MET, DMR, VSAT'],
      ['ACP-APF IP-50CX Link Budget', 'Ceragon IP-50CX 7.5 GHz 2+2 HSB 12.06 km Link Budget Calculation', '1.2m VHLPX4-7W, 30m/60m towers, 15.23–18.73 dB fade margin'],
      ['PAGA Acoustic & PA Load Study', 'Sound Coverage Study & Amplifier / Battery Sizing Calculation', 'PPC-501-1209-200 / FLY-330-001-525 / PA Calc'],
      ['Master Tower 60m & 30m Design', 'Self-Supporting Tower Structural & PE-Endorsed Foundation Calculation', '2609.95.1 (60m) & 2609.95.2 (30m)'],
    ],
    [2600, 3600, 3400]
  );

  // SECTION 3(2)
  body += h1('SECTION 3(2) — LIST OF MAIN TECHNICAL PARAMETERS');
  body += p('Main technical parameters, proposed OEMs/models, and per-system specification BoQ summary.');
  for (const s of systems) {
    const d = technicalDossier0550(data, model, view, s.token, 'parameters');
    const boqTables = (d.tables || []).filter(t => /BoQ|Supplier technical/i.test(t.title || '') && t.rows?.length);
    if (!boqTables.length) continue;
    body += h3(`${s.token} — ${s.name}`);
    for (const t of boqTables) {
      body += p(t.title, { bold: true, sz: '18' });
      const ncols = t.heads.length;
      const w = Array.from({ length: ncols }, () => Math.floor(9600 / ncols));
      body += makeTable(t.heads, t.rows, w);
    }
  }

  // SECTION 3(3)
  body += h1('SECTION 3(3) — LIST OF EQUIPMENT AND SPARE PARTS WITH ESTIMATED WEIGHT AND OVERALL DIMENSIONS');
  body += p('Canonical Working equipment, commissioning spares, capital spares, and special tools with estimated weight (kg) and overall dimensions (mm).');
  const eqRows = (view.equipment || []).map((e, i) => {
    const [uWt, dims, basis] = estimateWeightDims(e);
    return [String(i + 1), e.systemToken, e.description, e.brand || 'OEM', `${e.quantity ?? 'OPEN'} ${e.unit || ''}`, uWt, dims, basis];
  });
  body += makeTable(
    ['SN', 'System', 'Equipment / Spares Description', 'Brand', 'Qty / Unit', 'Est. Wt (kg)', 'Dimensions (mm)', 'Basis'],
    eqRows,
    [450, 1100, 2400, 950, 850, 950, 1450, 1450]
  );

  const c4Rows = c4CapitalSparesRows0550(view);
  if (c4Rows.length) {
    body += h2('3(3).2 Capital Spare Parts (Schedule C4)');
    body += makeTable(
      ['SN', 'Main Equipment', 'Parts Description', 'Part No.', 'Qty / Unit', 'Delivery'],
      c4Rows.map((r, i) => [String(i + 1), r.mainEquipment, r.description, r.partNo, `${r.quantity} ${r.unit}`, r.delivery]),
      [500, 1800, 3200, 1600, 1200, 1300]
    );
  }
  const c5Rows = c5SpecialToolsRows0550(view);
  if (c5Rows.length) {
    body += h2('3(3).3 Special Tools & Test Equipment (Schedule C5)');
    body += makeTable(
      ['SN', 'Description', 'Brand / Model', 'Qty / Unit'],
      c5Rows.map((r, i) => [String(i + 1), r.description, `${r.brand || 'OEM'} / ${r.model || 'Standard'}`, `${r.quantity} ${r.unit}`]),
      [600, 4800, 2600, 1600]
    );
  }

  // SECTION 3(4)
  body += h1('SECTION 3(4) — DELIVERY BATCH AND SCHEDULE (WITHIN 8 MONTHS UPON CONTRACT ENTRY INTO FORCE)');
  body += makeTable(
    ['Batch', 'Scope of Supply', 'Target Schedule', 'Delivery Term', 'Inspection Gate'],
    [
      ['Batch 1', 'Engineering Submittals, VDRL/SDRL, PE Tower Foundation Design & Long-Lead POs', 'M+1 to M+3', 'Submittal / CIF', 'IFC & Foundation Approval'],
      ['Batch 2', '60m (APF) & 30m (ACP) Self-Supporting Telecom Towers & Hardware', 'M+4 (120 Days)', 'CIF / Site', 'Mill Certs & PE Sign-off'],
      ['Batch 3', 'Early Buildings Core Systems (PAGA, IP-PABX, Core LAN/Wi-Fi, DMR, Radios, VSAT)', 'M+4 to M+6', 'CIF / DDP Site', 'OEM FAT + Local iFAT'],
      ['Batch 4', 'Field Devices (CCTV, MET, NDB, AIS, ENT, FO), Commissioning & 2-Year Spares, Special Tools', 'M+6 to M+8', 'CIF / Site', 'Integrated SAT/iSAT & Dossier'],
    ],
    [900, 3600, 1400, 1500, 2200]
  );

  if (pagaMobPlan?.events?.length) {
    body += h2(`3(4).2 Field Mobilization & Testing Plan (Early Handover Target: ${pagaMobPlan.earlyHandover || '2027-07-31'})`);
    body += makeTable(
      ['Event', 'Location', 'Duration', 'Work Scope'],
      pagaMobPlan.events.map(ev => [ev.id, ev.location, `${ev.days} days`, ev.work]),
      [1100, 2000, 1100, 5400]
    );
  }

  const vdrl = data.bidVolumes?.vdrl || [];
  body += h2(`3(4).3 VDRL / Document Plan (${vdrl.length} Items)`);
  body += makeTable(
    ['Document No.', 'Title', 'System', 'Phase', 'Vol. II Sections'],
    vdrl.map(v => [v.documentNo || 'TBA', v.title, v.systemToken, v.phase, (v.sectionIds || []).join(', ')]),
    [2000, 3600, 1400, 1200, 1400]
  );

  // SECTION 3(5)
  body += h1('SECTION 3(5) — TECHNICAL DEVIATION LIST (ATTACHMENT 3)');
  const devs = (model.integration?.deviations || []).map(d => [d.id, d.systemToken, d.contractorDocument, d.vendorDeviation, d.justification, `${d.workflowStatus || 'OPEN'} / ${d.state || 'OPEN'}`]);
  devs.push([
    'DEV-CCTV-AVL-01',
    'TEL-CCTV',
    CCTV_TPLINK_DEVIATION_0550.mrRef,
    CCTV_TPLINK_DEVIATION_0550.vendorDeviation,
    CCTV_TPLINK_DEVIATION_0550.justification,
    'OPEN — AVL Clarification',
  ]);
  devs.push([
    'TQ-ACP-13-D2',
    'TEL-PABX',
    'MR Appendix 1.3 (MR-B1-13-ACP-05) / MM-ASK-1A-ACP-TEL-LIS-0001 Rev C1',
    'TQ: MR Appendix 1.3 qty 10 / LIS-0001 Rev C1 10 tags (TPH-304-001~008, 101, 201) vs Rev00 baseline qty 3',
    'Preserves Rev00 commercial ceiling; confirm final ACP indoor IP phone count at IFC',
    'OPEN — Technical Clarification',
  ]);
  devs.push([
    'TQ-ACP-13-D3',
    'TEL-LAN',
    'MR Appendix 1.3 (MR-B1-13-ACP-09) / MM-ASK-1A-ACP-TEL-LIS-0001 Rev C1',
    'TQ: MR Appendix 1.3 qty 3 / LIS-0001 Rev C1 3 tags (AP-307-001, 002, 201) vs Rev00 baseline qty 2',
    'Preserves Rev00 commercial ceiling; confirm final ACP indoor Wi-Fi AP count at IFC',
    'OPEN — Technical Clarification',
  ]);
  body += makeTable(
    ['ID', 'System', 'Contractor Document', 'Proposed Deviation', 'Justification', 'Status'],
    devs,
    [1300, 1100, 1800, 2100, 2100, 1200]
  );

  const documentXml =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}` +
    `<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1020" w:right="907" w:bottom="1020" w:left="907" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>` +
    `</w:body></w:document>`;

  const contentTypes =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
    `</Types>`;

  const rels =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>` +
    `</Relationships>`;

  return zipStore({
    '[Content_Types].xml': contentTypes,
    '_rels/.rels': rels,
    'word/document.xml': documentXml,
  });
}

export function downloadTechnicalProposalWord0550(view, data, model, today) {
  const bytes = buildTechnicalProposalDocx0550(view, data, model, today);
  const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const rev = String(view.proposal?.revision || 'DRAFT').replace(/[^\w.-]/g, '_');
  a.href = url;
  a.download = `PJ2608-0550_Volume-II_${rev}_DRAFT.docx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
