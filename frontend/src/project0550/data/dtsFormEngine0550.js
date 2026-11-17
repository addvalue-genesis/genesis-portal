import {
  DTS_SYSTEM_PACKAGE_MAP_0550,
  generateDtsDocument0550,
  sanitizeDtsCustomerText0550,
} from './dtsGenerator0550';
import {
  PTTEP_DOC_STANDARD_0550,
  PTTEP_REVISION_CATALOG_0550,
  customerRevisionHistory0550,
  formatPttepFileName0550,
  isInternalPttepRevision0550,
  normalizePttepRev0550,
} from './pttepDocControl0550';

export const DTS_FORM_AREAS_0550 = ['APF', 'ACP', 'ABV01', 'AMS01'];

export const DTS_FORM_REVISIONS_0550 = [
  { code: 'INT-00', label: 'INT-00 (Internal WIP)' },
  { code: 'R1', label: 'R1 (IDC)' },
  { code: 'A1', label: 'A1 (IFR/IFI)' },
  { code: 'B1', label: 'B1 (IFA/IFT)' },
  { code: 'C1', label: 'C1 (AFC)' },
  { code: '00', label: '00 (As-Built)' },
];

export const DTS_FORM_SECTIONS_0550 = [
  'General',
  'Equipment / Antenna Specification',
  'Radio / Network / Functional Specification',
  'Power / Enclosure / Hazardous Area Specification',
];

export const FORBIDDEN_DTS_FORM_PLACEHOLDERS_RE =
  /\bCatalog Standard\b|\bManufacturer Model per MR\b|\bDraft\b|\bMGW\b|\bSI budget estimate\b|\bOEM Standard\b|\bPer Specification\b|\[INTERNAL TRACE\]|\bWorking owner\b|\bWorking draft\b/i;

export function sanitizeDtsFormText0550(text) {
  const base = sanitizeDtsCustomerText0550(String(text ?? ''));
  return base
    .replace(/\bCatalog Standard\b/gi, 'Manufacturer Datasheet')
    .replace(/\bManufacturer Model per MR\b/gi, 'Per Vendor Technical Proposal')
    .replace(/\bDraft\b/gi, 'Issued')
    .replace(/\bMGW\b/gi, 'Vendor Package')
    .replace(/\s*\[DEV-[^\]]+\]/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function formatDateDmy(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '').trim());
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '17/11/2026';
}

function mapToFourSections(row, idx) {
  const sec = String(row.section || '');
  if (/antenna/i.test(sec) || /^A\./i.test(String(row.item || ''))) {
    return 'Equipment / Antenna Specification';
  }
  if (/functional|rf|network|radio|odu|idu/i.test(sec)) {
    return 'Radio / Network / Functional Specification';
  }
  if (/electrical|mechanical|power|enclosure|hazard|standard/i.test(sec)) {
    return 'Power / Enclosure / Hazardous Area Specification';
  }
  if (/general/i.test(sec)) {
    return 'General';
  }
  return DTS_FORM_SECTIONS_0550[idx % DTS_FORM_SECTIONS_0550.length];
}

function normalizeComplianceBadge(compliance) {
  const s = String(compliance || '').trim().toUpperCase();
  if (s === 'COMPLY') return { label: 'COMPLY', cls: 'sb-c' };
  if (s.includes('PARTIAL')) return { label: 'PARTIAL COMPLY', cls: 'sb-p' };
  if (s.includes('DEVIATE') || s.includes('VTA') || s.includes('CLARIFY')) {
    return { label: 'PARTIAL COMPLY', cls: 'sb-p' };
  }
  return { label: 'HOLD / OPEN', cls: 'sb-o' };
}

function buildAuthoritativeNotes({ systemToken, area, dts }) {
  const notes = [
    {
      text: 'Telecom equipment shall be certified by a recognized independent certifying authority according to ATEX Directive 2014/34/EU, IECEx or updated version. All active radio equipment and accessories in hazardous areas shall be Zone-2 classified as minimum with IP66.',
      devTag: '[DEV-002]',
    },
    {
      text: `Final operating frequency, channel plan, and Myanmar PTD Type Approval for ${dts.systemTitle} (${area}) shall be subject to approval by Myanmar authority and assigned frequency spectrum from COMPANY.`,
      devTag: '[DEV-003]',
    },
  ];
  if (systemToken === 'TEL-DMR') {
    notes.push({
      text: 'Ceragon FibeAir IP-50CX is a Full-Outdoor 2+0 XPIC architecture; separate indoor IDU slots are eliminated and user Ethernet interfaces are terminated via the Telecom Access Switch inside the Rittal cabinet.',
      devTag: '[DEV-DMR-001]',
    });
  } else if (systemToken === 'TEL-CCTV') {
    notes.push({
      text: 'Unclassified indoor monitoring workstation and non-AVL auxiliary switch selections are documented in Deviation List MM-ASK-1A-WP01-TEQ-TEL-LIS-0004.',
      devTag: '[DEV-CCTV-001]',
    });
  } else {
    notes.push({
      text: `Equipment quantities, physical dimensions, and tag allocations align with Volume I Schedule C1 and Appendix 2 Master Evidence (${area}).`,
      devTag: `[DEV-${dts.pkg}-001]`,
    });
  }
  return notes;
}

export function buildDtsFormModel0550({
  data,
  model,
  systems = [],
  systemToken = 'TEL-DMR',
  area = 'APF',
  revision = 'A1',
  mode = 'customer',
  today = '2026-11-17',
} = {}) {
  const isInternal = mode === 'internal';
  const safeArea = DTS_FORM_AREAS_0550.includes(area) ? area : 'APF';
  const normRev = normalizePttepRev0550(revision, 'A1');
  const displayRev = !isInternal && isInternalPttepRevision0550(normRev) ? 'A1' : normRev;
  const sysMeta = DTS_SYSTEM_PACKAGE_MAP_0550[systemToken] || {
    pkg: 'TEQ',
    seq: '0001',
    clientDts: `MM-ASK-1A-${safeArea}-TEL-DTS-0001`,
    title: systems.find(s => s.token === systemToken)?.name || systemToken,
  };

  // Generate authoritative Single Source of Truth DTS from SI-SYNTH-EQ / C1 / 7 VND / 10.2 SI / Appendix 2
  const dts = generateDtsDocument0550({
    data,
    model,
    systems,
    systemToken,
    area: safeArea,
    workflow: systemToken === 'TEL-DMR' ? 'WORKFLOW_A' : 'WORKFLOW_B',
    revision: normRev,
    today,
  });

  const clean = text => (isInternal ? String(text ?? '') : sanitizeDtsFormText0550(text));
  const systemNameClean = clean(dts.systemTitle);
  const systemNameUpper = systemNameClean.toUpperCase();
  const dateDmy = formatDateDmy(today);

  const revMeta = PTTEP_REVISION_CATALOG_0550.find(r => r.code === displayRev) || {
    code: displayRev,
    purpose: 'Issued for Review',
  };

  const statusCode = /^C/i.test(displayRev)
    ? 'C'
    : /^B/i.test(displayRev)
      ? 'B'
      : /^A/i.test(displayRev)
        ? 'A'
        : '—';

  // Revision history (auto-hides INT-XX in Customer Preview)
  const rawHistory = dts.revisionHistory || [];
  const filteredHistory = isInternal ? rawHistory : customerRevisionHistory0550(rawHistory);
  const revisionHistory = filteredHistory.map(r => ({
    rev: r.rev,
    page: 'ALL',
    date: formatDateDmy(r.date || today),
    description: clean(r.description || r.purpose),
    by: clean(r.prepared || 'TSI Telecom Eng.'),
    checked: clean(r.checked || 'SI Lead'),
    approved: clean(r.approved || ''),
  }));

  // Combine specRows + antennaRows into 4 canonical Datasheet sections
  const combinedRows = [...(dts.specRows || []), ...(dts.antennaRows || [])];
  const groupedSpecs = new Map(DTS_FORM_SECTIONS_0550.map(sec => [sec, []]));

  combinedRows.forEach((r, idx) => {
    const secName = mapToFourSections(r, idx);
    const badge = normalizeComplianceBadge(r.compliance);
    const srcTrace = r.remarks ? String(r.remarks).slice(0, 32) : 'C1 / 7 VND';
    groupedSpecs.get(secName).push({
      item: r.item || String(idx + 1),
      parameter: clean(r.parameter),
      requirement: clean(r.requirement),
      offered: clean(r.offered),
      src: isInternal ? srcTrace : '',
      badge,
      remarks: clean(r.remarks),
    });
  });

  const sections = DTS_FORM_SECTIONS_0550.map(secName => ({
    title: secName,
    rows: groupedSpecs.get(secName) || [],
  })).filter(s => s.rows.length > 0);

  // Page 4 Equipment Tag list
  const tagList = (dts.tagRows || []).map(t => ({
    items: clean(t.service || dts.systemTitle),
    tagNumber: clean(t.tagNo || 'Per Appendix 2 Drawing'),
    location: clean(t.location || `${safeArea} / Telecom Equipment Room`),
    remarks: clean(
      isInternal
        ? `${t.model || ''} ${t.partNo ? `(${t.partNo})` : ''} · ${t.vdbRef || ''}`.trim()
        : `${t.model || 'Per Vendor Technical Proposal'}${t.partNo && !/OPEN/i.test(t.partNo) ? ` (${t.partNo})` : ''}`
    ),
  }));

  const tagSummary = tagList
    .slice(0, 3)
    .map(t => t.tagNumber)
    .filter(Boolean)
    .join(' · ') || 'Per Appendix 2';

  const notes = buildAuthoritativeNotes({ systemToken, area: safeArea, dts }).map(n => ({
    text: clean(n.text),
    devTag: isInternal ? n.devTag : '',
  }));

  const docFileNameDocx = formatPttepFileName0550({
    area: safeArea,
    pkg: dts.pkg,
    discipline: 'TEL',
    docType: 'DTS',
    seq: dts.seq,
    rev: displayRev,
    ext: 'docx',
    internal: isInternal,
  });

  const docFileNamePdf = formatPttepFileName0550({
    area: safeArea,
    pkg: dts.pkg,
    discipline: 'TEL',
    docType: 'DTS',
    seq: dts.seq,
    rev: displayRev,
    ext: 'pdf',
    internal: isInternal,
  });

  return {
    projectTitle:
      'EPC OF WELLHEAD PLATFORMS & ONSHORE PROCESSING FACILITIES FOR AUNG SINKHA DEVELOPMENT PROJECT PHASE 1A (PJ2608-0550)',
    clientName: 'PTT Exploration and Production Public Company Limited',
    vendorName: 'ADD VALUE SYSTEM CO., LTD.',
    standard: PTTEP_DOC_STANDARD_0550,
    docId: dts.docId,
    clientDtsRef: sysMeta.clientDts,
    systemToken,
    systemTitle: systemNameClean,
    systemTitleUpper: systemNameUpper,
    area: safeArea,
    pkg: dts.pkg,
    seq: dts.seq,
    revision: displayRev,
    revisionPurpose: revMeta.purpose,
    statusCode,
    dateDmy,
    mode,
    isInternal,
    tagSummary,
    poNo: '—',
    vendorDocNo: '—',
    totalPages: 4,
    c1SyncCount: dts.c1SyncCount || 0,
    internalNotes: isInternal ? dts.internalNotes || [] : [],
    revisionHistory,
    sections,
    tagList,
    notes,
    docFileNameDocx,
    docFileNamePdf,
  };
}

/**
 * Exact port of template fixWidths(): resolves % colgroups to fixed cm widths against widthCm (17cm).
 */
export function fixWidths(root, widthCm = 17) {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  root.querySelectorAll('table').forEach(tb => {
    const cols = tb.querySelectorAll('colgroup col');
    if (!cols.length || tb.getAttribute('data-cm')) return;
    const pct = [];
    let ok = true;
    cols.forEach(c => {
      const m = /([\d.]+)%/.exec(c.getAttribute('style') || '');
      if (m) pct.push(parseFloat(m[1]));
      else ok = false;
    });
    if (!ok) return;
    const sum = pct.reduce((a, b) => a + b, 0) || 100;
    const w = [];
    cols.forEach((c, i) => {
      const cm = (widthCm * pct[i]) / sum;
      w.push(cm.toFixed(2));
      c.setAttribute('style', `width:${cm.toFixed(2)}cm`);
    });
    tb.setAttribute('data-cm', w.join(','));
    tb.style.tableLayout = 'fixed';
    tb.style.width = `${widthCm}cm`;
  });
}

/**
 * Exact port of template wordify(): converts .cv-sp/.cv-sp2 spacers, .cv-frame to 1-cell bordered table,
 * .page wrappers to explicit page-break-before:always, and .foot to plain margin blocks for MS Word.
 */
export function wordify(root, doc, widthCm = 17) {
  if (!root || !doc) return;
  root.querySelectorAll('.cv-sp').forEach(e => {
    e.setAttribute('style', 'display:block;height:38mm;font-size:1pt;line-height:1');
  });
  root.querySelectorAll('.cv-sp2').forEach(e => {
    e.setAttribute('style', 'display:block;height:34mm;font-size:1pt;line-height:1');
  });
  root.querySelectorAll('.cv-bsp').forEach(e => {
    e.setAttribute('style', 'display:block;height:26mm;font-size:1pt;line-height:1');
  });

  root.querySelectorAll('.cv-frame').forEach(f => {
    const t = doc.createElement('table');
    const tr = doc.createElement('tr');
    const td = doc.createElement('td');
    t.setAttribute('style', `width:${widthCm}cm;border-collapse:collapse`);
    td.setAttribute('style', 'border:1pt solid #000;padding:1.0cm 1.2cm 0.8cm;vertical-align:top');
    while (f.firstChild) td.appendChild(f.firstChild);
    tr.appendChild(td);
    t.appendChild(tr);
    f.parentNode.replaceChild(t, f);
  });

  root.querySelectorAll('.page').forEach((p, i) => {
    p.setAttribute('style', `width:${widthCm}cm${i ? ';page-break-before:always' : ''}`);
    const inner = p.querySelector('.inner');
    if (inner) inner.setAttribute('style', 'display:block;margin:0');
  });

  root.querySelectorAll('.foot').forEach(e => {
    e.setAttribute(
      'style',
      'display:block;margin-top:6mm;border-top:.5pt solid #999;padding-top:3px;font-size:7pt;color:#555'
    );
  });
  root.querySelectorAll('.tblk').forEach(e => {
    e.setAttribute('style', 'width:100%;border-collapse:collapse;font-size:7pt;margin-top:6mm');
  });
}

export function buildDtsFormWordDocumentHtml0550({ rootElement, title, cssText = '', widthCm = 17 }) {
  if (!rootElement || typeof document === 'undefined') return '';
  const clone = rootElement.cloneNode(true);
  fixWidths(clone, widthCm);
  wordify(clone, document, widthCm);

  const wordCss = String(cssText || '')
    .replace(/display:\s*flex/g, 'display:block')
    .replace(/flex:\s*[^;}]+;?/g, '');
  const pageCss = '@page{size:21cm 29.7cm;margin:2cm 2cm}';
  const safeTitle = String(title || 'DTS Form').replace(/[<>&"]/g, '');

  return (
    '<html xmlns:o="urn:schemas-microsoft-com:office:office"' +
    ' xmlns:w="urn:schemas-microsoft-com:office:word"' +
    ' xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8">' +
    `<title>${safeTitle}</title><style>${pageCss} ${wordCss}` +
    ' .page{min-height:0 !important;border:0 !important;box-shadow:none !important;margin:0 !important}' +
    ' .cv-frame{border:0} table{border-collapse:collapse} td,th{vertical-align:top}' +
    `</style></head><body>${clone.innerHTML}</body></html>`
  );
}

export function exportDtsFormWord0550({ rootElement, formModel, cssText = '' }) {
  const docHtml = buildDtsFormWordDocumentHtml0550({
    rootElement,
    title: `${formModel.docId} Rev.${formModel.revision}`,
    cssText,
    widthCm: 17,
  });
  if (!docHtml) return formModel.docFileNameDocx;
  const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = formModel.docFileNameDocx;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return formModel.docFileNameDocx;
}
