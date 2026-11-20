export const PROJECT_0553_FACTS = {
  projectId: "PJ2608-0553",
  packageId: "ZM169-RFQ-TE-001",
  title: "Zawtika Development Project Phase 1F — Telecom Package",
  customerChain: ["JUTAL", "PTTEPI"],
  method: "First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model + Evidence Control",
  state: "INTERNAL_WORKING",
  isolationRule: "PJ2608-0550 architecture may be reused; PJ2608-0550 facts, quantities and prices must never be inherited.",
  systems: [
    { id: "SYS-001", mr: "MR-0001", name: "SCADA Radio", status: "OPEN_TECHNICAL_CHECKS",
      rfqSource:{title:"MM-ZTK-1F-GEN-TEL-MR-0001",revision:"Rev.C1",date:"2026-08-28",driveId:"1XMDolhzCvw2kQnahlFBwxTujkW22pQSm"} },
    { id: "SYS-002", mr: "MR-0002", name: "DMR Trunk Radio", status: "OPEN_TECHNICAL_CHECKS",
      rfqSource:{title:"MM-ZTK-1F-GEN-TEL-MR-0002",revision:"Rev.C1",date:"2026-08-28",driveId:"1BbpBxKCuv0w8Khruw5flIhSPlIWXw6Mx"} },
    { id: "SYS-003", mr: "MR-0003", name: "Explosion-Proof Telephone & Sounder", status: "OPEN_TECHNICAL_CHECKS",
      rfqSource:{title:"MM-ZTK-1F-GEN-TEL-MR-0003",revision:"Rev.C1",date:"2026-08-28",driveId:"1Y0Xh4BpfHZBV_MxOSuWmr-I9r-7DNkB1"} },
    { id: "SYS-004", mr: "MR-0004", name: "Marine RACON", status: "OPEN_TECHNICAL_CHECKS",
      rfqSource:{title:"MM-ZTK-1F-GEN-TEL-MR-0004",revision:"Rev.C1",date:"2026-08-28",driveId:"1Iq0DGmHlVP8dXvwKED-co00TGlM7NGp7"} }
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
