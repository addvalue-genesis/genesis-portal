export const PROJECT_0553_FACTS = {
  projectId: "PJ2608-0553",
  packageId: "ZM169-RFQ-TE-001",
  title: "Zawtika Development Project Phase 1F — Telecom Package",
  customerChain: ["JUTAL", "PTTEPI"],
  method: "First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model + Evidence Control",
  state: "INTERNAL_WORKING",
  isolationRule: "PJ2608-0550 architecture may be reused; PJ2608-0550 facts, quantities and prices must never be inherited.",
  systems: [
    { id: "SYS-001", mr: "MR-0001", name: "SCADA Radio", status: "OPEN_TECHNICAL_CHECKS" },
    { id: "SYS-002", mr: "MR-0002", name: "DMR Trunk Radio", status: "OPEN_TECHNICAL_CHECKS" },
    { id: "SYS-003", mr: "MR-0003", name: "Explosion-Proof Telephone & Sounder", status: "OPEN_TECHNICAL_CHECKS" },
    { id: "SYS-004", mr: "MR-0004", name: "Marine RACON", status: "OPEN_TECHNICAL_CHECKS" }
  ],
  bidControl: {
    closingWorkingInput: "2026-10-14 17:00 Beijing time",
    thailandEquivalentWorkingInput: "2026-10-14 16:00 Asia/Bangkok",
    closingEvidenceState: "VERIFY_ORIGINAL_JUTAL_INSTRUCTION_OR_AMENDMENT",
    requiredPackages: [
      "Technical Proposal — UNPRICED",
      "Priced Commercial Proposal",
      "Detailed itemized quotation",
      "Spare-parts inventory and matching quotation",
      "Manufacturer authorization evidence"
    ],
    releaseRule: "No submission, customer release, deployment or PR merge without explicit approval."
  }
};
