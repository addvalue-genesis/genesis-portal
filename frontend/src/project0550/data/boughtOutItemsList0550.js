/**
 * PJ2608-0550 · SDRL A04 Bought out items list
 * Projects Working Preview → Schedule C1 appendix equipment/components into a
 * procurement register (no commercial prices). Prices stay on Exhibit C / C1.
 */
import { C1_APPENDICES_0550, deriveC1Appendix0550, cleanCustomerText0550 } from './c1Appendix0550';
import { workingOffers0550 } from './workingOffers0550';
import { VDRL_READY_SYSTEMS_0550 } from './vdrlGenerator0550';
import { formatPttepFileName0550 } from './pttepDocControl0550';

export const A04_CODE_0550 = 'A04';
export const A04_TITLE_0550 = 'Bought out items list';
export const A04_DOC_TYPE_0550 = 'MTO';
export const A04_DOC_SEQ_0550 = '0002';
export const A04_SCHEMA_0550 = 'genesis.0550.a04-bought-out.v1';

/** Primary OEM / channel labels for A04 when a Working offer brand is not yet bound. */
export const A04_SYSTEM_VENDOR_0550 = Object.freeze({
  ...Object.fromEntries(VDRL_READY_SYSTEMS_0550.map((s) => [s.token, s.primaryVendor])),
  'TEL-PAGA': 'INDUSTRONIC',
  'TEL-RADIO-DTRS': 'MGW / Motorola',
  'TEL-RADIO-MARINE': 'MGW / Sailor',
  'TEL-RADIO-SSB': 'MGW / Sailor',
  'TEL-RADIO-AERO': 'MGW / Jotron',
  'TEL-TELT': 'IDIE / Master Tower',
  'TEL-VSAT': 'OPEN / TBE (VSAT OEM)',
  'TEL-VSAT-KU': 'OPEN / TBE (KU OEM)',
  'TEL-LAN': 'MGW',
  'TEL-IPP': 'MGW / Putian',
  'TEL-PABX': 'CHEVALIER / Avaya',
  'TEL-CCTV': 'MGW / Hikvision',
  'TEL-MET': 'MGW / Vaisala',
  'TEL-DMR': 'CERAGON',
  'TEL-ES': 'MGW',
  'TEL-LAN-VCS': 'MGW',
  'TEL-NDB': 'MGW / Nautel-class',
  'TEL-FO': 'MGW / FO bulk',
});

const APPENDIX_TOKENS = new Map(C1_APPENDICES_0550.map((a) => [a.id, a.systems || []]));

const cell = (value) =>
  String(value ?? '—')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim() || '—';

const isVendorId = (value) => /^VENDOR-/i.test(String(value || ''));

function tokensForRow(row, linesById, systemNameToToken) {
  const tokens = [];
  const seen = new Set();
  const push = (token) => {
    if (!token || seen.has(token)) return;
    seen.add(token);
    tokens.push(token);
  };
  for (const id of [...(row.ownerIds || []), ...(row.priceOwners || []).map((b) => b.lineId).filter(Boolean)]) {
    const line = linesById.get(id) || (row.priceOwners || []).find((b) => b.lineId === id)?.line;
    if (line?.systemToken) push(line.systemToken);
  }
  const named = systemNameToToken.get(String(row.system || '').toLowerCase());
  if (named) push(named);
  const desc = `${row.description || ''} ${row.system || ''}`.toLowerCase();
  if (/marine|vhf-fm/.test(desc)) push('TEL-RADIO-MARINE');
  if (/\bssb\b|mf\/hf/.test(desc)) push('TEL-RADIO-SSB');
  if (/aero|vhf-am/.test(desc)) push('TEL-RADIO-AERO');
  if (/\bdmr\b|dtrs|tetra/.test(desc)) push('TEL-RADIO-DTRS');
  if (/paga|intron/.test(desc)) push('TEL-PAGA');
  if (/ceragon|microwave|ip-50/.test(desc)) push('TEL-DMR');
  if (/pabx|avaya|chevalier/.test(desc)) push('TEL-PABX');
  if (/cctv|hikvision/.test(desc)) push('TEL-CCTV');
  if (/\bmet\b|vaisala|weather/.test(desc)) push('TEL-MET');
  if (/\bndb\b|beacon/.test(desc)) push('TEL-NDB');
  if (/\bfoc\b|fibre|fiber|cable/.test(desc)) push('TEL-FO');
  const appendixTokens = APPENDIX_TOKENS.get(row.appendix) || [];
  if (appendixTokens.length === 1) push(appendixTokens[0]);
  else for (const token of appendixTokens) push(token);
  return tokens;
}

function manufacturerForRow(row, data, linesById, commercialBySystem, systemNameToToken) {
  const brands = new Set();
  const ownerIds = [
    ...(row.ownerIds || []),
    ...(row.priceOwners || []).map((b) => b.lineId).filter(Boolean),
  ];
  for (const id of ownerIds) {
    const line = linesById.get(id) || (row.priceOwners || []).find((b) => b.lineId === id)?.line;
    if (!line) continue;
    if (line.brand && !isVendorId(line.brand)) brands.add(line.brand);
    for (const offer of workingOffers0550(data || { offers: [], lines: [] }, line)) {
      if (offer.brand && !isVendorId(offer.brand)) brands.add(offer.brand);
    }
  }
  if (brands.size) return [...brands].join(' / ');
  for (const token of tokensForRow(row, linesById, systemNameToToken)) {
    if (A04_SYSTEM_VENDOR_0550[token]) return A04_SYSTEM_VENDOR_0550[token];
    const commercial = commercialBySystem.get(token);
    if (commercial?.size) return [...commercial][0];
  }
  return 'OPEN / TBE';
}

function remarkForRow(row) {
  const parts = [row.note, ...(row.notes || [])]
    .map((part) => cleanCustomerText0550(part))
    .filter(Boolean);
  if (row.excluded) parts.unshift('By COMPANY / excluded from TSI bought-out');
  return parts.join('; ') || '—';
}

/**
 * Flatten C1 appendix groups into A04 bought-out rows (packages + components).
 * @param {object} view Working / bid-volume view with scheduleRows('C1')
 * @param {{data?: object, model?: object}} [context]
 */
export function deriveBoughtOutItems0550(view, context = {}) {
  const c1 = deriveC1Appendix0550(view);
  const data = context.data || view?.c1Context || { offers: [], lines: [] };
  const lines = context.model?.lines || data.lines || view?.c1Context?.lines || [];
  const linesById = new Map(lines.map((line) => [line.id, line]));
  const commercialBySystem = new Map();
  for (const source of context.commercialSources || data.commercialSources || []) {
    if (!source?.systemToken || !source.vendor) continue;
    if (!commercialBySystem.has(source.systemToken)) commercialBySystem.set(source.systemToken, new Set());
    commercialBySystem.get(source.systemToken).add(source.vendor);
  }
  const systemNameToToken = new Map();
  for (const system of context.systems || data.systems || []) {
    for (const label of [system.name, system.label, system.token]) {
      if (label) systemNameToToken.set(String(label).toLowerCase(), system.token);
    }
  }
  // C1 display system labels that differ from SYSTEMS.name
  for (const [label, token] of [
    ['vhf and mf/hf', 'TEL-RADIO-DTRS'],
    ['public address and general alarm (paga) system', 'TEL-PAGA'],
    ['paga', 'TEL-PAGA'],
    ['microwave communication system', 'TEL-DMR'],
    ['satellite communication system', 'TEL-VSAT'],
    ['network system, pabx, cctv and met', 'TEL-LAN'],
    ['entertainment system', 'TEL-ES'],
    ['non-directional beacon', 'TEL-NDB'],
    ['foc and cables', 'TEL-FO'],
    ['roip dispatch console', 'TEL-RADIO-DTRS'],
    ['antenna cables', 'TEL-RADIO-DTRS'],
  ]) systemNameToToken.set(label, token);

  const items = [];
  for (const group of c1.groups || []) {
    for (const system of group.systems || []) {
      for (const site of system.sites || []) {
        for (const row of site.rows || []) {
          const manufacturer = manufacturerForRow(row, data, linesById, commercialBySystem, systemNameToToken);
          const sourceKey = row.mr?.id || row.key || '—';
          items.push({
            sn: row.sn,
            level: 'package',
            appendix: group.id,
            appendixTitle: group.title,
            system: system.name,
            site: site.name,
            description: row.description,
            manufacturer,
            quantity: row.quantity ?? '—',
            unit: row.unit || '—',
            sourceKey,
            remark: remarkForRow(row),
            excluded: !!row.excluded,
          });
          (row.components || []).forEach((component, index) => {
            items.push({
              sn: `${row.sn}.${index + 1}`,
              level: 'component',
              appendix: group.id,
              appendixTitle: group.title,
              system: system.name,
              site: site.name,
              description: component.description,
              manufacturer,
              quantity: component.quantity ?? '—',
              unit: component.unit || '—',
              sourceKey,
              remark: cleanCustomerText0550(component.note) || 'Included in package',
              excluded: !!row.excluded,
            });
          });
        }
      }
    }
  }

  const packages = items.filter((item) => item.level === 'package' && !item.excluded);
  const components = items.filter((item) => item.level === 'component' && !item.excluded);
  return {
    schema: A04_SCHEMA_0550,
    code: A04_CODE_0550,
    title: A04_TITLE_0550,
    problems: c1.problems || [],
    stats: {
      packages: packages.length,
      components: components.length,
      excludedPackages: items.filter((item) => item.level === 'package' && item.excluded).length,
      openManufacturer: packages.filter((item) => item.manufacturer === 'OPEN / TBE').length,
    },
    items,
  };
}

/**
 * Build A04 markdown from a Working / bid-volume view.
 */
export function boughtOutItemsMarkdown0550(view, context = {}) {
  const derived = deriveBoughtOutItems0550(view, context);
  const revision = context.revision || view?.proposal?.revision || 'INT-00';
  const documentNo =
    context.documentNo ||
    `MM-ASK-00-GEN-TEQ-TEL-${A04_DOC_TYPE_0550}-${A04_DOC_SEQ_0550}`;
  const fileName = formatPttepFileName0550({
    docType: A04_DOC_TYPE_0550,
    seq: A04_DOC_SEQ_0550,
    rev: revision,
    ext: 'md',
    internal: /^INT-/i.test(revision),
  });
  const today = context.today || new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push(`# ${A04_TITLE_0550} (SDRL ${A04_CODE_0550})`);
  lines.push('');
  lines.push('**DRAFT — NOT FOR SUBMISSION**');
  lines.push('');
  lines.push(`- **Project:** PJ2608-0550 · ASK Telecommunication & Security System`);
  lines.push(`- **Document No.:** ${documentNo}`);
  lines.push(`- **Revision:** ${revision}`);
  lines.push(`- **File:** ${fileName}`);
  lines.push(`- **SDRL:** ${A04_CODE_0550} · PROJECT DOSSIER · Submission P+3 · Review R`);
  lines.push(`- **Basis:** Working Preview → Schedule C1 appendix (equipment packages + components)`);
  lines.push(`- **Generated:** ${today} (Asia/Bangkok project calendar; machine stamp may be UTC)`);
  lines.push(`- **Counts:** ${derived.stats.packages} packages · ${derived.stats.components} components · ${derived.stats.openManufacturer} packages with manufacturer OPEN/TBE`);
  lines.push('');
  lines.push('## Purpose');
  lines.push('');
  lines.push(
    'Procurement / project-dossier register of TSI bought-out supply items for Volume II planning. ' +
      'Commercial unit rates and totals remain on Exhibit C Schedule C1 / A1 and are intentionally omitted here.'
  );
  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('- Package rows follow C1 display SN; component rows use `SN.n`.');
  lines.push('- Manufacturer is taken from Working offer brand when present; otherwise ready-system / commercial-source vendor; otherwise `OPEN / TBE`.');
  lines.push('- COMPANY-excluded rows stay listed and marked in Remarks.');
  lines.push('- This draft does not authorise purchase, AVL selection, or customer issue.');
  lines.push('');

  let currentAppendix = null;
  let currentSystem = null;
  let currentSite = null;
  let tableOpen = false;

  const closeTable = () => {
    if (tableOpen) {
      lines.push('');
      tableOpen = false;
    }
  };

  for (const item of derived.items) {
    if (item.appendix !== currentAppendix) {
      closeTable();
      currentAppendix = item.appendix;
      currentSystem = null;
      currentSite = null;
      const title =
        item.appendix === 'OTHER'
          ? item.appendixTitle || 'Other Base Supply'
          : `APPENDIX ${item.appendix} · ${item.appendixTitle || ''}`.trim();
      lines.push(`## ${title}`);
      lines.push('');
    }
    if (item.system !== currentSystem) {
      closeTable();
      currentSystem = item.system;
      currentSite = null;
      lines.push(`### ${item.system}`);
      lines.push('');
    }
    if (item.site !== currentSite) {
      closeTable();
      currentSite = item.site;
      lines.push(`#### ${item.site}`);
      lines.push('');
      lines.push('| SN | Description | Manufacturer | Qty | Unit | Source | Remarks |');
      lines.push('| --- | --- | --- | ---: | --- | --- | --- |');
      tableOpen = true;
    }
    lines.push(
      `| ${cell(item.sn)} | ${cell(item.description)} | ${cell(item.manufacturer)} | ${cell(item.quantity)} | ${cell(item.unit)} | ${cell(item.sourceKey)} | ${cell(item.remark)} |`
    );
  }
  closeTable();

  if (derived.problems.length) {
    lines.push('## Open C1 mapping notes (non-blocking for this draft list)');
    lines.push('');
    for (const problem of derived.problems.slice(0, 40)) lines.push(`- ${problem}`);
    if (derived.problems.length > 40) lines.push(`- … ${derived.problems.length - 40} more`);
    lines.push('');
  }

  lines.push('## Control');
  lines.push('');
  lines.push(`Schema \`${A04_SCHEMA_0550}\`. Regenerate from \`boughtOutItemsMarkdown0550(view)\` after Working/C1 changes. ADR-0550-001 principles 5–6, 10–12 apply: no invented prices, quantities, or With-Bid marks.`);
  lines.push('');

  return {
    markdown: lines.join('\n'),
    documentNo,
    revision,
    fileName,
    derived,
  };
}
