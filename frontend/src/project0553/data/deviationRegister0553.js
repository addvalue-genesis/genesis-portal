// PJ2608-0553 Single-Source Deviation & TC/CCL Register.
// Reads from snapshots/jutal.comments.response.20261118.json (derived from Rev03, never mutating Rev03)
// and enriches with live 04, 06, 07 VND, 08 Risk, 10 Budget, and 10B Brownfield module links.
import JUTAL_RESPONSE_0553 from "./snapshots/jutal.comments.response.20261118.json";
import { RFI_LNA_PRICE_DECISION_0553 } from "./rfiLnaPriceDecision0553";
import { MGW_P26_058_R2_UHF_0553 } from "./mgwP26058R2Uhf0553";
import { MR0002_BDA_DEVIATION_REV00_0553 } from "./mr0002DeviationBdaRev00_0553";

const LINKS_BY_ID = Object.freeze({
  "DEV-TECH-01": {
    vendorRef: `${MGW_P26_058_R2_UHF_0553.id} (${MGW_P26_058_R2_UHF_0553.supplier}) · MOT LNA vendorQuoted=${RFI_LNA_PRICE_DECISION_0553.vendorQuoted}`,
    brownfieldRef: `10B B3-BF (${Object.keys(MR0002_BDA_DEVIATION_REV00_0553.originalRequirement.afcLnaTagBySite).length} brownfield LNA sites)`,
    links: [
      { label: "07 VND (MGW / LNA)", tab: "documents", moduleId: "bid.vendor.products.supplier.quote-lines" },
      { label: "10.3.4 Rev03 (A2)", tab: "budget", moduleId: "bid.budget.pricing.official" },
      { label: "10B B3-BF", tab: "b3bf", moduleId: "bid.b3bf" },
    ],
  },
  "R1-TC-01": {
    vendorRef: "07 Vendor / BARTEC EJB-6 reference",
    brownfieldRef: "ZWP20 Row 11 / 10.1 Required BOM",
    links: [
      { label: "10.1 Required BOM", tab: "budget", moduleId: "bid.budget.bom" },
      { label: "04 MR Systems", tab: "systems", moduleId: "bid.systems" },
    ],
  },
  "R1-TC-02": {
    vendorRef: "10.1 Part A (141 rows) / 10.3.4",
    brownfieldRef: "—",
    links: [
      { label: "10.3.4 Official (AVS)", tab: "budget", moduleId: "bid.budget.pricing.official" },
      { label: "04 MR Systems", tab: "systems", moduleId: "bid.systems" },
    ],
  },
  "R1-TC-03": {
    vendorRef: "07 Vendor / Next G & ORGA OEM package",
    brownfieldRef: "—",
    links: [
      { label: "10.2 B11", tab: "budget", moduleId: "bid.budget.working.bc" },
      { label: "07 VND", tab: "documents", moduleId: "bid.documents" },
    ],
  },
  "R1-TC-04": {
    vendorRef: "07 Vendor / Cisco VST-0048-RE1 (IE-3400-8P2S-E)",
    brownfieldRef: "TC-0001 Item 13 (IEM-3300-8T= excluded)",
    links: [
      { label: "10.1 Working BOM", tab: "budget", moduleId: "bid.budget.bom" },
      { label: "07 VND", tab: "documents", moduleId: "bid.documents" },
    ],
  },
  "CCL-COMM-01": {
    vendorRef: "06 Execution & 10.2 B6",
    brownfieldRef: "—",
    links: [
      { label: "06 Execution", tab: "execution", moduleId: "bid.execution" },
      { label: "10.3.4 Official", tab: "budget", moduleId: "bid.budget.pricing.official" },
    ],
  },
  "CCL-COMM-02": {
    vendorRef: "06 Execution / SAMTEL Warehouse Thailand",
    brownfieldRef: "10B B3-BF (separate brownfield proposal)",
    links: [
      { label: "10.2 B3 Working", tab: "budget", moduleId: "bid.budget.working.bc" },
      { label: "10B B3-BF", tab: "b3bf", moduleId: "bid.b3bf" },
      { label: "06 Execution", tab: "execution", moduleId: "bid.execution" },
    ],
  },
  "CCL-COMM-03": {
    vendorRef: "10.2 B4 Working",
    brownfieldRef: "—",
    links: [{ label: "10.2 B4", tab: "budget", moduleId: "bid.budget.working.bc" }],
  },
  "CCL-COMM-04": {
    vendorRef: "10.2 B8 Hybrid Training",
    brownfieldRef: "—",
    links: [{ label: "10.2 B8", tab: "budget", moduleId: "bid.budget.working.bc" }],
  },
  "CCL-COMM-05": {
    vendorRef: "10.2 B9 Zhuhai Yard",
    brownfieldRef: "—",
    links: [{ label: "10.2 B9", tab: "budget", moduleId: "bid.budget.working.bc" }],
  },
  "CCL-COMM-06": {
    vendorRef: "10.2 B10 Commissioning Spares (8 lines struck)",
    brownfieldRef: "—",
    links: [
      { label: "10.2 B10", tab: "budget", moduleId: "bid.budget.working.bc" },
      { label: "10.3.4 B10 Annex", tab: "budget", moduleId: "bid.budget.pricing.official" },
    ],
  },
  "CCL-COMM-07": {
    vendorRef: "10.2 B12 / 08 Risk",
    brownfieldRef: "—",
    links: [
      { label: "10.2 B12", tab: "budget", moduleId: "bid.budget.working.bc" },
      { label: "08 Risk", tab: "risk", moduleId: "bid.risk" },
    ],
  },
  "CCL-COMM-08": {
    vendorRef: "10.2 B13 / 10.3.4 B13 Annex",
    brownfieldRef: "—",
    links: [{ label: "10.3.4 B13 Annex", tab: "budget", moduleId: "bid.budget.pricing.official" }],
  },
  "CCL-COMM-09": {
    vendorRef: "10.2 C1 / 10.3.4 C1 Annex",
    brownfieldRef: "—",
    links: [
      { label: "10.3.4 C1 Annex", tab: "budget", moduleId: "bid.budget.pricing.official" },
      { label: "14 Deviations", tab: "deviations", moduleId: "bid.deviations" },
    ],
  },
  "CCL-COMM-10": {
    vendorRef: "10.2 C2 / 10.3.4 C2 Annex",
    brownfieldRef: "—",
    links: [{ label: "10.3.4 C2 Annex", tab: "budget", moduleId: "bid.budget.pricing.official" }],
  },
});

export function selectDeviationRegister0553() {
  const records = Object.freeze(
    JUTAL_RESPONSE_0553.items.map((item) => {
      const meta = LINKS_BY_ID[item.id] || { vendorRef: item.sourceCell, brownfieldRef: "—", links: [] };
      return {
        ...item,
        customerComment: item.jutalComment,
        justification: item.response,
        vendorRef: meta.vendorRef,
        brownfieldRef: meta.brownfieldRef,
        links: meta.links,
      };
    })
  );

  return Object.freeze({
    moduleId: "bid.deviations",
    projectId: "PJ2608-0553",
    responseRound: JUTAL_RESPONSE_0553.responseRound,
    jutalEmailDate: JUTAL_RESPONSE_0553.jutalEmailDate,
    records,
    counts: {
      total: records.length,
      deviations: records.filter((r) => r.kind === "DEVIATION").length,
      tc: records.filter((r) => r.kind === "TC").length,
      technicalClarifications: records.filter((r) => r.category === "TECHNICAL_CLARIFICATION").length,
      commercialClarifications: records.filter((r) => r.category === "COMMERCIAL_CLARIFICATION").length,
    },
  });
}
