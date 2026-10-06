export const PROJECT0550_ENGINEERING_DOCTRINE = {
  id: "PJ2608-0550-ENGINEERING-DOCTRINE",
  revision: "Rev02",
  status: "CONTROLLED WORKING BASELINE",
  name: "First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model",
  projectCode: "PJ2608-0550",
  pillars: [
    {
      id: "FIRST_PRINCIPLES",
      title: "First Principles",
      purpose: "Resolve what the system fundamentally has to achieve before accepting equipment, quantity or price."
    },
    {
      id: "CONSTRAINT_ENGINEERING",
      title: "Telecom Constraint-Based Engineering",
      purpose: "Use technical and non-technical constraints to determine feasible architecture, proof, quantity, lifecycle work and release conditions."
    },
    {
      id: "PARAMETRIC_COST",
      title: "Parametric Cost Model",
      purpose: "Convert controlled quantity/work drivers into material, MH, duration, lifecycle cost, risk exposure and commercial outputs without collapsing unknowns to zero."
    }
  ],
  fullChain: [
    ["SOURCE_EVIDENCE","Source / Evidence"],
    ["REQUIREMENT","Requirement"],
    ["FUNDAMENTAL_NEED","Fundamental Need"],
    ["CONSTRAINT","Constraint"],
    ["INTERFACE_CONTEXT","Interface / Physical Context"],
    ["ENGINEERING_INPUT","Engineering Input"],
    ["CAL_STUDY_RPT","CAL / Study / RPT"],
    ["PROOF","Engineering Proof"],
    ["ARCHITECTURE","Architecture"],
    ["PHYSICAL_OBJECT","Physical Object"],
    ["QUANTITY_DRIVER","Quantity Driver"],
    ["REQUIRED_MTO","Required MTO"],
    ["BULK","Bulk"],
    ["VENDOR_RECONCILIATION","Vendor / Offered MTO / Reconciliation"],
    ["WORK_RESOURCE","Work / Resource / MH"],
    ["DOCUMENT_QA","Document / VDRL / QA"],
    ["FAT_IFAT","FAT / IFAT"],
    ["LOGISTICS_REGULATORY","Logistics / Regulatory"],
    ["SITE_READINESS","Site Readiness"],
    ["INSTALL_PRECOM","Installation / Pre-Commissioning"],
    ["SAT_COMMISSIONING","SAT / Integration / Commissioning"],
    ["HANDOVER_WARRANTY","Handover / Warranty"],
    ["COST_SCHEDULE_RISK","Cost / Schedule / Risk"],
    ["COMMERCIAL_TREATMENT","Commercial Treatment / Price"],
    ["RELEASE","Release"]
  ],
  uiChain: [
    "Source / Evidence",
    "Requirement / Need",
    "Constraints / Context",
    "Engineering Input",
    "CAL / Study / RPT",
    "Proof",
    "Required Object / Quantity",
    "Vendor Reconciliation",
    "Work / Lifecycle",
    "Cost / Schedule / Risk",
    "Commercial Treatment",
    "Release"
  ],
  evidenceStates: {
    FACT: "0550 source fact or approved human decision",
    DERIVED: "Result from controlled source-bound equation or rule",
    ASSUMPTION: "Explicit working basis awaiting closure",
    TBC: "Required value not yet controlled",
    SOURCE_CONFLICT: "Sources disagree; do not choose silently",
    NOT_APPLICABLE: "Closed with reason/evidence; never equivalent to blank",
    NOT_FOUND: "Evidence not found; never equivalent to zero scope"
  },
  hardRules: [
    ["R-001","NO SOURCE != ZERO SCOPE"],
    ["R-002","NO FINAL QUANTITY != ZERO QUANTITY"],
    ["R-003","TBC != ZERO COST"],
    ["R-004","VENDOR OFFERED QUANTITY != REQUIRED QUANTITY"],
    ["R-005","SELLING RATE != INTERNAL PAYROLL COST"],
    ["R-006","REQUIRED PROOF OPEN => FINAL ENGINEERING RELEASE BLOCKED"],
    ["R-007","SOURCE CONFLICT => NO SILENT SELECTION"],
    ["R-008","ONE PHYSICAL TRIP / COST OBJECT => COUNT ONCE"],
    ["R-009","0553 MAY SUPPLY METHOD ONLY; 0550 FACTS REQUIRE 0550 EVIDENCE"],
    ["R-010","NON-TECHNICAL CONSTRAINTS CAN BLOCK TECHNICAL / COMMERCIAL RELEASE"],
    ["R-011","NEW EVIDENCE MUST BE STRUCTURED / TRACEABLE BEFORE IT CHANGES CONTROLLED STATE"],
    ["R-012","STALE / SUPERSEDED SOURCE MUST NOT GENERATE A CURRENT OUTPUT"]
  ],
  releaseIntents: {
    BUDGETARY: "Allows explicit assumptions and preliminary quantities/costs if gaps remain visible and non-zero treatment is controlled.",
    ENGINEERING: "Requires required proof and quantity drivers to be sufficiently controlled for engineering issue.",
    PRICE_FREEZE: "Requires engineering, quantity, cost owner and commercial treatment to be controlled before freezing the bid price.",
    FINAL: "Requires all mandatory lifecycle and acceptance gates to be closed or formally dispositioned."
  }
};

export const PROJECT0550_CONTROL_POLICY = {
  teamWorkingRule: "MATERIAL CHAT CONCLUSION NOT SYNCED TO CONTROLLED CODE/STATE => NOT CLOSED",
  teamReadFirst: true,
  dataArchitecture: "JSX USER SURFACE → API/SERVICE → MariaDB + JSON in parallel → controlled project/source evidence",
  learningMode: "CONTROLLED_EVIDENCE_ASSIMILATION + APPROVED_CALIBRATION",
  autoChangeProjectFacts: false,
  autoChangeCommercialRate: false,
  autoRelease: false,
  humanApprovalRequiredFor: [
    "requirement change",
    "source conflict disposition",
    "final quantity release",
    "calibration factor adoption",
    "commercial treatment change",
    "price freeze",
    "final release"
  ]
};
