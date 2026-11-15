import reference from './sdrlReference0550.json';
import {blankVdrl0550} from './bidVolumes0550';
import {sdrlDraft0550} from '../SdrlReference0550';

/** Priority SDRL codes for Volume II bidding support and post-award VDRL. */
export const VDRL_PRIORITY_CODES_0550 = ['A04', 'B03', 'B04', 'B05', 'B07', 'B08', 'B09', 'B11', 'C02', 'C06'];

/** Systems with usable vendor / atomic-line / offer evidence already present. */
export const VDRL_READY_SYSTEMS_0550 = [
  {token: 'TEL-PAGA', label: 'PAGA', primaryVendor: 'INDUSTRONIC', evidence: 'atomic lines A20261632-005 + IDIE service quotes'},
  {token: 'TEL-RADIO-DTRS', label: 'RADIO / DTRS / DMR', primaryVendor: 'MGW / Motorola', evidence: 'MGW Q26-063 RADIO + DTS TAGs'},
  {token: 'TEL-PABX', label: 'PABX', primaryVendor: 'CHEVALIER', evidence: 'CITT-QT-392-2026'},
  {token: 'TEL-DMR', label: 'DMR (Digital Microwave Radio)', primaryVendor: 'CERAGON', evidence: 'CERAGON 26-30029 RevA1 R11 (IP-50CX 7 GHz 2+0, ACP-APF link) + DTS-0010 TAGs'},
  {token: 'TEL-LAN', label: 'LAN', primaryVendor: 'MGW', evidence: 'bulk + stock basis'},
  {token: 'TEL-CCTV', label: 'CCTV', primaryVendor: 'MGW', evidence: 'MGW CCTV offer'},
];

const codeIndex = new Map(reference.rows.map(r => [r.code, r]));

function enrichDraft(base, system, code) {
  const row = codeIndex.get(code);
  if (!row) return null;
  const id = `VDRL-${system.token}-${code}`;
  return {
    ...base,
    id,
    systemToken: system.token,
    title: `${code} / ${row.title} — ${system.label}`,
    phase: 'POST_AWARD',
    sectionIds: code.startsWith('B') ? ['description', 'parameters'] : code.startsWith('C') ? ['equipment'] : [],
    reason: [
      base.reason,
      `System: ${system.token} (${system.label}).`,
      `Primary evidence: ${system.evidence}.`,
      'Generated from native SDRL Appendix 3 (With Bid unmarked).',
      'Invitation Volume II 3(1)–3(5) remains the separate bid-plan basis.',
      'Confirm actual deliverable, owner, document number, revision and attachment. Gaps stay OPEN.'
    ].join(' '),
    deliverableRef: `SDRL-${code} / ${system.token}`,
  };
}

/**
 * Generate VDRL drafts for the given system tokens (defaults to ready systems).
 * Only adds records that do not already exist. Returns a new data object.
 * Does not invent With Bid marks, calendar dates, or overwrite authored records.
 */
export function generateSystemVdrlDrafts0550(data, systemTokens) {
  const tokens = systemTokens || VDRL_READY_SYSTEMS_0550.map(s => s.token);
  const systems = VDRL_READY_SYSTEMS_0550.filter(s => tokens.includes(s.token));
  const existing = new Set((data.bidVolumes?.vdrl || []).map(v => v.id));
  const additions = [];

  for (const system of systems) {
    for (const code of VDRL_PRIORITY_CODES_0550) {
      const row = codeIndex.get(code);
      if (!row) continue;
      const draft = enrichDraft(sdrlDraft0550(row, data), system, code);
      if (draft && !existing.has(draft.id)) {
        additions.push(draft);
        existing.add(draft.id);
      }
    }
  }

  if (!additions.length) return data;

  const volumes = data.bidVolumes || {
    schema: 'genesis.0550.bid-volumes.v1',
    documentNo: '',
    revision: 'Rev00',
    records: [],
    bindings: [],
    vdrl: [],
    commercialDeviations: []
  };
  return {
    ...data,
    bidVolumes: {
      ...volumes,
      vdrl: [...(volumes.vdrl || []), ...additions],
    },
  };
}

export function generateReadySystemVdrl0550(data) {
  return generateSystemVdrlDrafts0550(data);
}
