/**
 * PJ2608-0550 · Volume II / 12.V VDRL document equations — Code Revision 0.
 * WITH BID treatment defaults drive how each SDRL code is answered from Memory
 * (vendor PDF/datasheet + SI history) without inventing With-Bid marks.
 */

export const DOCUMENT_EQUATIONS_REV0 = Object.freeze({
  revision: 'Rev.0',
  projectId: 'PJ2608-0550',
  generalFormula:
    'Doc_WithBid(code) = Treatment(code) ⊗ Evidence(VND ∪ Memory) ⊗ Completeness(code); ' +
    'SAMPLE ⊂ FULL; STATEMENT asserts intent + open gaps without claiming deliverable bytes.',
  codes: Object.freeze({
    B03: Object.freeze({
      code: 'B03',
      description: 'General arrangement / Building Layout drawings',
      withBidTreatment: 'SAMPLE',
      equation:
        'B03_SAMPLE = RepresentativeLayout(sites ∈ {ABV01, AMS01, ACP, APF}) from Memory(VND layout PDF); ' +
        'full routing packages remain POST_AWARD unless FULL evidence is attached.',
    }),
    B05: Object.freeze({
      code: 'B05',
      description: 'Schematic diagrams',
      withBidTreatment: 'SAMPLE',
      equation:
        'B05_SAMPLE = TypicalSchematic(system) ∪ InstallationDetail_sample; ' +
        'tower/aerial layouts stay OPEN until site-specific Memory links are reviewed.',
    }),
    B08: Object.freeze({
      code: 'B08',
      description: 'Equipment data sheets',
      withBidTreatment: 'FULL',
      equation:
        'B08_FULL = ⋃ datasheet(i) for i ∈ SelectedEquipment(Working ∩ Offer); ' +
        'each sheet must carry Brand/Model/Part No. traceable to Memory JSON/links.',
    }),
    B11: Object.freeze({
      code: 'B11',
      description: 'Catalogues and brochures',
      withBidTreatment: 'FULL',
      equation:
        'B11_FULL = ⋃ catalogue(vendor) covering SelectedEquipment families; ' +
        'brochure set must include every FULL B08 identity used in the bid.',
    }),
    LINK_BUDGET: Object.freeze({
      code: 'LINK_BUDGET',
      description: 'RF / microwave link budget statement (DMR / Radio)',
      withBidTreatment: 'STATEMENT',
      equation:
        'LINK_BUDGET_STATEMENT = PathLoss(d, f, G_tx, G_rx, L_feeder, fade) with Memory inputs; ' +
        'availability claim stays OPEN until CAL-RPT closes the numeric budget.',
    }),
    C02: Object.freeze({
      code: 'C02',
      description: 'Inspection and test plan',
      withBidTreatment: 'STATEMENT',
      equation:
        'C02_STATEMENT = ITP_outline(FAT ∪ IFAT ∪ SAT ∪ Pre-Com) referenced to SDRL C02; ' +
        'hold/witness points remain POST_AWARD until procedure IDs are issued.',
    }),
  }),
});

/**
 * @param {string} code
 * @returns {{code:string,description:string,withBidTreatment:string,equation:string}|null}
 */
export function getEquation(code) {
  if (!code || typeof code !== 'string') return null;
  return DOCUMENT_EQUATIONS_REV0.codes[code] || null;
}

/**
 * @returns {Array<{code:string,description:string,withBidTreatment:string,equation:string}>}
 */
export function listEquations() {
  return Object.values(DOCUMENT_EQUATIONS_REV0.codes);
}
