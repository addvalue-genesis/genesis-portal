import {deriveC1Appendix0550,c1Display0550,cleanCustomerText0550} from './c1Appendix0550';
import {
  APF_DMR_MR_12_ITEMS_0550,
  APF_MARINE_MR_6_ITEMS_0550,
  ACP_MARINE_MR_4_ITEMS_0550,
  APF_AERO_MR_5_ITEMS_0550,
  APF_ROIP_MR_7_ITEMS_0550,
  ACP_CONSOLE_BOM_0550,
  APF_TOWER_60M_BOM_0550,
  ACP_TOWER_30M_BOM_0550,
} from './radioLotComponents0550';
import {
  APF_VSAT_1_BOM_0550,
  APF_VSAT_2_BOM_0550,
  YANGON_VSAT_BOM_0550,
  APF_VSAT_CABLE_BOM_0550,
  YANGON_VSAT_CABLE_BOM_0550,
  APF_VSAT_OFFSHORE_BOM_0550,
  APF_KU_BOM_0550,
  ACP_KU_BOM_0550,
} from './satelliteScope0550';
import {
  APF_CCTV_PTZ_EX_BOM_0550,
  APF_CCTV_PTZ_EX_2_BOM_0550,
  APF_CCTV_CABINET_BOM_0550,
  APF_CCTV_MON_27_BOM_0550,
  APF_CCTV_MON_75_BOM_0550,
  CCTV_CAMERA_BOMS_BY_MR_0550,
} from './mgwCctvEntBudget0550';
import {
  APPENDIX_13_TO_18_BOMS_BY_MR_0550,
  resolveAppendix18Bom0550,
} from './appendix13To18Boms0550';

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function resolveStaticBomForWord(r) {
  if (r.sn === '1.1.1' || r.key === 'MR-B1-11-APF-01') return APF_DMR_MR_12_ITEMS_0550;
  if (r.sn === '1.1.9' || r.key === 'MR-B1-11-ACP-01') return APF_DMR_MR_12_ITEMS_0550.slice(0, 6);
  if (r.sn === '1.1.15' || r.key === 'MR-B1-11-ABV01-01') return APF_DMR_MR_12_ITEMS_0550.slice(0, 4);
  if (r.key === 'OWNER:LINE-MGW-CURRENT-RADIO-016' || (r.appendix === '1.1' && r.site === 'AMS01' && /dmr/i.test(r.description || ''))) return APF_DMR_MR_12_ITEMS_0550.slice(0, 4);
  if (r.sn === '1.1.2' || r.key === 'MR-B1-11-APF-02') return APF_MARINE_MR_6_ITEMS_0550;
  if (r.sn === '1.1.10' || r.key === 'MR-B1-11-ACP-02') return ACP_MARINE_MR_4_ITEMS_0550;
  if (r.sn === '1.1.4' || r.key === 'MR-B1-11-APF-04') return APF_AERO_MR_5_ITEMS_0550;
  if (r.sn === '1.1.6' || r.key === 'MR-B1-11-APF-06') return APF_ROIP_MR_7_ITEMS_0550;
  if (r.sn === '1.1.13' || r.key === 'MR-B1-11-ACP-05') return ACP_CONSOLE_BOM_0550;
  if (r.sn === '1.1.8' || r.key === 'MR-B1-11-APF-08') return APF_TOWER_60M_BOM_0550;
  if (r.sn === '1.1.14' || r.key === 'MR-B1-11-ACP-06') return ACP_TOWER_30M_BOM_0550;
  if (r.key === 'MR-B1-12-APF-01' || r.sn === '1.2.1') return APF_VSAT_1_BOM_0550;
  if (r.key === 'MR-B1-12-APF-02' || r.sn === '1.2.2') return APF_VSAT_2_BOM_0550;
  if (r.key === 'MR-B1-12-APF-03' || r.sn === '1.2.3') return APF_VSAT_CABLE_BOM_0550;
  if (r.key === 'MR-B1-12-APF-04' || r.sn === '1.2.4') return APF_VSAT_OFFSHORE_BOM_0550;
  if (r.key === 'MR-B1-12-APF-05' || r.sn === '1.2.5') return APF_KU_BOM_0550;
  if (r.key === 'MR-B1-12-YANGON-01' || r.sn === '1.2.6') return YANGON_VSAT_BOM_0550;
  if (r.key === 'MR-B1-12-YANGON-02' || r.sn === '1.2.7') return YANGON_VSAT_CABLE_BOM_0550;
  if (r.key === 'MR-B1-12-ACP-01' || r.sn === '1.2.8') return ACP_KU_BOM_0550;
  if (r.key === 'MR-B1-13-APF-01' || r.sn === '1.3.1') return APF_CCTV_PTZ_EX_BOM_0550;
  if (r.key === 'MR-B1-13-APF-02' || r.sn === '1.3.2') return APF_CCTV_PTZ_EX_2_BOM_0550;
  if (r.key === 'MR-B1-13-APF-11' || r.sn === '1.3.11') return APF_CCTV_CABINET_BOM_0550;
  if (r.key === 'MR-B1-13-APF-12' || r.sn === '1.3.12') return APF_CCTV_MON_27_BOM_0550;
  if (r.key === 'MR-B1-13-APF-13' || r.sn === '1.3.13') return APF_CCTV_MON_75_BOM_0550;
  if (CCTV_CAMERA_BOMS_BY_MR_0550[r.key]) return CCTV_CAMERA_BOMS_BY_MR_0550[r.key];
  if (APPENDIX_13_TO_18_BOMS_BY_MR_0550[r.key]) return APPENDIX_13_TO_18_BOMS_BY_MR_0550[r.key];
  const app18 = resolveAppendix18Bom0550(r);
  if (app18) return app18;
  if (r.appendix === '1.1' && /antenna cable/i.test(r.description || '')) {
    return [{
      tagNo: 'Per Appendix 2 Drawing',
      offeredEquipment: '1/2" RF Coaxial Feeder Cable & Jumpers (per Appendix 2)',
      brand: 'Yongding / Amphenol',
      model: '1/2" Flexible RF Foam Dielectric Cable',
      partNo: 'HCAAYZ-50-12',
      quantity: Number(r.quantity) || 500,
      unit: r.unit || 'm',
      remarks: 'Included in Base Scope of Supply',
    }];
  }
  return null;
}

const cleanOfficialNote = text => {
  if (!text) return '';
  const filtered = String(text)
    .split(/\s*;\s*|\s*·\s*/)
    .filter(p => p && !/\bOPEN\b|Working owner|Working draft|Draft|KNOWN SUBTOTAL|allocation pending|PROJECT\s*·|owner ledger|NOT FOR SUBMISSION|CIF\/FOB pending|Customer delivery term|priced items|priced;|11\.[A-Z0-9]|รอตรวจขอบเขต|อ้างอิงชุด|reconcile|MGW|Full Outdoor|Hot Standby|Cable material supply|Shared supply for|Includes two R660|RITTAL Microwave|PAGA package with the OEM|One tower with quoted/i.test(p))
    .join('; ');
  return cleanCustomerText0550(filtered);
};

export function officialC1Word0550(view) {
  const c1 = deriveC1Appendix0550(view);
  const p = (text, bold = false, sz = '16') =>
    `<w:p><w:pPr><w:spacing w:before="20" w:after="20" w:line="220" w:lineRule="auto"/></w:pPr><w:r><w:rPr>${bold ? '<w:b/>' : ''}<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/></w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
  const row = (values, header = false, span = false, bold = false) =>
    `<w:tr><w:trPr>${header ? '<w:tblHeader/>' : '<w:cantSplit/>'}</w:trPr>${values
      .map((v, i) => {
        const noWrap = !span && (i === 0 || i === 2 || i === 3 || i === 4 || i === 5) ? '<w:noWrap/>' : '';
        return `<w:tc><w:tcPr>${span && i === 0 ? '<w:gridSpan w:val="7"/>' : ''}${noWrap}${header ? '<w:shd w:fill="EAF2F6"/>' : ''}</w:tcPr>${p(v, header || bold)}</w:tc>`;
      })
      .join('')}</w:tr>`;
  const headerCell = (text, properties = '') =>
    `<w:tc><w:tcPr>${properties}<w:shd w:fill="EAF2F6"/></w:tcPr>${p(text, true)}</w:tc>`;

  const header =
    '<w:tr><w:trPr><w:tblHeader/></w:trPr>' +
    ['SN', 'Item Description', 'Unit', 'Qty.'].map(t => headerCell(t, '<w:vMerge w:val="restart"/>')).join('') +
    headerCell('CIF or FOB (USD)', '<w:gridSpan w:val="2"/>') +
    headerCell('Notes', '<w:vMerge w:val="restart"/>') +
    '</w:tr><w:tr><w:trPr><w:tblHeader/></w:trPr>' +
    Array.from({ length: 4 }, () => headerCell('', '<w:vMerge/>')).join('') +
    headerCell('Unit Rate') +
    headerCell('Total Price') +
    headerCell('', '<w:vMerge/>') +
    '</w:tr>';

  const widths = [950, 5600, 750, 750, 1350, 1350, 2600];
  let xml =
    p('SCHEDULE C1 - BREAKDOWN OF LUMP SUM INITIAL CONTRACT PRICE FOR BASE SCOPE OF SUPPLY', true, '20') +
    p('Currency: USD', false, '18') +
    '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>' +
    ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(n => `<w:${n} w:val="single" w:sz="4" w:color="8097A7"/>`).join('') +
    '</w:tblBorders></w:tblPr><w:tblGrid>' +
    widths.map(w => `<w:gridCol w:w="${w}"/>`).join('') +
    '</w:tblGrid>' +
    header;

  for (const g of c1.groups) {
    xml += row([`${g.number || ''} ${g.title || ''}`.trim()], false, true, true);
    for (const s of g.systems || []) {
      if (s.name) xml += row([s.name], false, true, true);
      for (const site of s.sites || []) {
        const mrRows = (site.rows || []).filter(r => !String(r.key || '').startsWith('OWNER:'));
        if (!mrRows.length) continue;
        if (site.name) xml += row([site.name], false, true, true);
        for (const r of mrRows) {
          const priceUnit = r.unitPrice > 0 ? c1Display0550(r.unitPrice) : 'Included';
          const priceTotal = r.amount > 0 ? c1Display0550(r.amount) : 'Included';
          xml += row([r.sn, r.description, r.unit || '—', r.quantity ?? '—', priceUnit, priceTotal, cleanOfficialNote(r.note)], false, false, true);
          const bom = resolveStaticBomForWord(r);
          if (bom && bom.length) {
            bom.forEach((b, idx) => {
              const tag = b.tagNo && !/Per Appendix 2 Drawing/i.test(b.tagNo) ? ` [Tag: ${b.tagNo}]` : '';
              const modelPart = [b.brand, b.model, b.partNo ? `P/N: ${b.partNo}` : ''].filter(Boolean).join(' · ');
              const desc = `${b.offeredEquipment || b.description || ''} (${modelPart})${tag}`;
              xml += row([`${r.sn}.${idx + 1}`, desc, b.unit || 'SET', b.quantity ?? 1, '—', 'Included', cleanOfficialNote(b.remarks || '')]);
            });
          } else if (r.components && r.components.length) {
            r.components.forEach((c, idx) => {
              xml += row([`${r.sn}.${idx + 1}`, c.description, c.unit || '—', c.quantity ?? '—', '—', 'Included', cleanOfficialNote(c.note || '')]);
            });
          }
        }
      }
    }
    const subAmt = g.amount ?? g.draftSubtotal;
    xml += row([`Subtotal — ${g.title || g.number || ''}`, '', '', '', '', Number.isFinite(subAmt) ? c1Display0550(subAmt) : 'TBA', ''], false, false, true);
  }

  return (
    xml +
    row(['TOTAL — BASE SCOPE OF SUPPLY (USD)', '', '', '', '', Number.isFinite(c1.amount) ? c1Display0550(c1.amount) : 'TBA', ''], false, false, true) +
    '</w:tbl>' +
    p('Schedule C1 — Base Scope of Supply', false, '16')
  );
}
