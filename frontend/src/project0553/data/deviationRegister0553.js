// PJ2608-0553 Deviation & TC Register (read-only derivation from 04, 07, 08, 10, 10B).
// Formal DEVIATION = only items where AVS offers a different design from MR (currently 1: MR-0002 BDA vs LNA).
// Other open JUTAL / engineering items are classified as TC (Technical / Commercial Clarifications).
import { RFI_BDA_SELECTION_0553 } from "./rfiBdaSelected0553";
import { RFI_LNA_PRICE_DECISION_0553 } from "./rfiLnaPriceDecision0553";
import { MGW_P26_058_R2_UHF_0553 } from "./mgwP26058R2Uhf0553";
import { MR0002_BDA_DEVIATION_REV00_0553 } from "./mr0002DeviationBdaRev00_0553";
import { BARTEC_ENCLOSURE_BASIS_0553 } from "./bartecEnclosureBasis0553";
import { FAT_EXECUTION_BASIS_0553 } from "./fatExecutionBasis0553";
import { selectCurrentReleaseRev03_0553 } from "./officialUsdRelease0553";
import { selectBcTurnkeyWorkingCost0553 } from "./bcTurnkeyWorkingCost0553";
import { selectB11MinimumTools0553 } from "./b11MinimumTools0553";

export function selectDeviationRegister0553() {
  const rev03 = selectCurrentReleaseRev03_0553();
  const bc = selectBcTurnkeyWorkingCost0553();
  const b11 = selectB11MinimumTools0553();
  const rev03Row = (code) => rev03.rows.find((r) => r.code === code);

  const records = Object.freeze([
    {
      id: "DEV-TECH-01",
      kind: "DEVIATION",
      category: "TECHNICAL_DEVIATION",
      mr: "MR-0002",
      code: "A2 / C1",
      title: "Trunk Radio: UHF BDA offered in lieu of LNA (RAD-508-001)",
      mrRequirement: "MR-0002 / DTS specifies LNA receive chain (RFI RX3852-2002-11, NF <= 2 dB).",
      offeredBasis: `3 sets RFI BD4345-00N0-AC + WAROM HRMD95-VIIIB Ex d enclosure at ${RFI_BDA_SELECTION_0553.siteAllocation.join(", ")} (Rev03 A2 USD ${rev03Row("A2")?.amountUSD?.toLocaleString("en-US")}).`,
      customerComment: "C1 line 4 clouded: 'DMR is designed on based scope, it is not require BDA'; B10 2.01-2.03 BDA spares struck through.",
      justification: `Owner decision (2026-11-18): retain Rev03 A2 BDA pricing pending SAMTEL/MOT LNA quotation (${RFI_LNA_PRICE_DECISION_0553.status}); C1 line 4 withdrawn.`,
      vendorRef: `${MGW_P26_058_R2_UHF_0553.id} (${MGW_P26_058_R2_UHF_0553.supplier}) · MOT LNA vendorQuoted=${RFI_LNA_PRICE_DECISION_0553.vendorQuoted}`,
      brownfieldRef: `10B B3-BF (${Object.keys(MR0002_BDA_DEVIATION_REV00_0553.originalRequirement.afcLnaTagBySite).length} brownfield LNA sites tracked separately)`,
      status: "FORMAL_DEVIATION__REV03_BDA_RETAINED",
      links: [
        { label: "07 VND (MGW / LNA)", tab: "documents", moduleId: "bid.vendor.products.supplier.quote-lines" },
        { label: "10.3.4 Rev03 (A2)", tab: "budget", moduleId: "bid.budget.pricing.official" },
        { label: "10B B3-BF", tab: "b3bf", moduleId: "bid.b3bf" },
      ],
    },
    {
      id: "TC-TECH-01",
      kind: "TC",
      category: "TECHNICAL_CLARIFICATION",
      mr: "MR-0001",
      code: "A1",
      title: "SCADA Enclosure Cable Entries (GA Sheet13 vs DTS min 18)",
      mrRequirement: "DTS-0001 C1 requires minimum 18 cable entries.",
      offeredBasis: `${BARTEC_ENCLOSURE_BASIS_0553.customerDeviationStatus || "BARTEC 16 M20 entries"} (Rev03 A1 USD ${rev03Row("A1")?.amountUSD?.toLocaleString("en-US")}).`,
      customerComment: "Technical clarification on physical cable-end count & GA Sheet13 reconciliation.",
      justification: "Clarify physical cable-end count against GA Sheet13 and DTS-0001 C1 before procurement (TC, not a formal Deviation).",
      vendorRef: "07 Vendor / BARTEC EJB-6 reference",
      brownfieldRef: "ZWP20 Row 11 / 10.1 Required BOM",
      status: "TC_OPEN",
      links: [
        { label: "10.1 Required BOM", tab: "budget", moduleId: "bid.budget.bom" },
        { label: "04 MR Systems", tab: "systems", moduleId: "bid.systems" },
      ],
    },
    {
      id: "TC-TECH-02",
      kind: "TC",
      category: "TECHNICAL_CLARIFICATION",
      mr: "MR-0001 / MR-0004",
      code: "B11",
      title: "Special Tools Compliance (MMC25-5001 EXA-A8 5.0)",
      mrRequirement: "EXA-A8 5.0 minimum list (5 items incl. SCADA SW, TETRA SW, RACON SW/charging kit).",
      offeredBasis: `B11 Rev03 N/A (included tools only). Code holds ${b11.rows.length} EXA-A8 items; TETRA SW not applicable (DMR selected).`,
      customerComment: "Email: EXA-A8 5.0 required; TETRA voice gateway struck through.",
      justification: "Comply with EXA-A8 items 1, 2, 4, 5 (Part A inclusion confirming with OEM); TETRA gateway N/A.",
      vendorRef: "07 Vendor / Next G & ORGA OEM package",
      brownfieldRef: "—",
      status: "TC_OEM_CONFIRMATION",
      links: [
        { label: "10.2 B11", tab: "budget", moduleId: "bid.budget.working.bc" },
        { label: "07 VND", tab: "documents", moduleId: "bid.documents" },
      ],
    },
    {
      id: "TC-COMM-01",
      kind: "TC",
      category: "COMMERCIAL_CLARIFICATION",
      mr: "ALL",
      code: "B6",
      title: "Delivery Term Clarification: CIF Zhuhai Port vs DDP Purchaser's Yard",
      mrRequirement: "Original Scope of Supply template specifies DDP Purchaser's Yard.",
      offeredBasis: "Proposed delivery: CIF Zhuhai Port, China (Incoterms 2020); Purchaser handles China import clearance, duty, VAT and port-to-yard.",
      customerComment: "Highlighted on Scope of Supply row 45.",
      justification: "Commercial delivery clarification reflected in B6 scope.",
      vendorRef: "06 Execution & 10.2 B6",
      brownfieldRef: "—",
      status: "TC_COMMERCIAL_OPEN",
      links: [
        { label: "06 Execution", tab: "execution", moduleId: "bid.execution" },
        { label: "10.3.4 Official", tab: "budget", moduleId: "bid.budget.pricing.official" },
      ],
    },
    {
      id: "TC-COMM-02",
      kind: "TC",
      category: "COMMERCIAL_CLARIFICATION",
      mr: "ALL",
      code: "B3",
      title: "B3 FAT Location / Duration (2+1 vs 5 days) & SAT Move to Services",
      mrRequirement: "JUTAL comment: Item 1 (FAT) recommend 5 days; Item 2 (Offshore SAT 28d + rates) move to Proposal of Services.",
      offeredBasis: `${FAT_EXECUTION_BASIS_0553.integratedFat.location} (2+1 days FAT + 28d SAT, Rev03 B3 USD ${rev03Row("B3")?.amountUSD?.toLocaleString("en-US")}).`,
      customerComment: "Scope of Supply K26: Item 1 base (5 days FAT recommended); Item 2 move to Proposal of Services.",
      justification: "Commercial clarification: no Rev03 split between FAT and SAT; pending owner decision.",
      vendorRef: "06 Execution / SAMTEL Warehouse Thailand",
      brownfieldRef: "10B B3-BF (separate brownfield proposal)",
      status: "TC_COMMERCIAL_OPEN",
      links: [
        { label: "10.2 B3 Working", tab: "budget", moduleId: "bid.budget.working.bc" },
        { label: "10B B3-BF", tab: "b3bf", moduleId: "bid.b3bf" },
        { label: "06 Execution", tab: "execution", moduleId: "bid.execution" },
      ],
    },
    {
      id: "TC-COMM-03",
      kind: "TC",
      category: "COMMERCIAL_CLARIFICATION",
      mr: "ALL",
      code: "B4 / B8 / B12",
      title: "Commercial Clarifications (B4 Painting, B8 Training, B12 First-filling)",
      mrRequirement: "B4 painting, B8 SAMTEL 1+1d training, B12 first-filling.",
      offeredBasis: `B4: ${bc.byCode.B4.offerTreatment?.status}; B8: Rev03 USD ${rev03Row("B8")?.amountUSD?.toLocaleString("en-US")}; B12: ${bc.byCode.B12.offerTreatment?.status}.`,
      customerComment: "B4 not accepted; B8 drop SAMTEL 1+1d & move rest to Proposal of Services; B12 clarify concern.",
      justification: "B12: telecom equipment requires no oils/lubricants/fluids; B4/B8 commercial disposition pending owner decision.",
      vendorRef: "10.2 B4/B8/B12",
      brownfieldRef: "—",
      status: "TC_COMMERCIAL_OPEN",
      links: [
        { label: "10.2 B/C", tab: "budget", moduleId: "bid.budget.working.bc" },
        { label: "08 Risk", tab: "risk", moduleId: "bid.risk" },
      ],
    },
  ]);

  return Object.freeze({
    moduleId: "bid.deviations",
    projectId: "PJ2608-0553",
    records,
    counts: {
      total: records.length,
      deviations: records.filter((r) => r.kind === "DEVIATION").length,
      tc: records.filter((r) => r.kind === "TC").length,
    },
  });
}
