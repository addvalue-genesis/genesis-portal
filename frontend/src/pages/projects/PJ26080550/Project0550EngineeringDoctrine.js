export const PROJECT0550_ENGINEERING_DOCTRINE = {
  id: "PJ2608-0550-ENGINEERING-DOCTRINE",
  revision: "Rev03",
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
  presentationGroups: [
    {
      id:"G1_FOUNDATION",
      label:"Foundation",
      stages:["SOURCE_EVIDENCE","REQUIREMENT","FUNDAMENTAL_NEED"]
    },
    {
      id:"G2_CONTEXT",
      label:"Constraint / Interface / Input",
      stages:["CONSTRAINT","INTERFACE_CONTEXT","ENGINEERING_INPUT"]
    },
    {
      id:"G3_PROOF_DESIGN",
      label:"Engineering Proof / Design",
      stages:["CAL_STUDY_RPT","PROOF","ARCHITECTURE"]
    },
    {
      id:"G4_QUANTITY",
      label:"Physical Object / Quantity",
      stages:["PHYSICAL_OBJECT","QUANTITY_DRIVER","REQUIRED_MTO","BULK"]
    },
    {
      id:"G5_VENDOR",
      label:"Vendor Reconciliation",
      stages:["VENDOR_RECONCILIATION"]
    },
    {
      id:"G6_EXECUTION",
      label:"Work / Lifecycle",
      stages:["WORK_RESOURCE","DOCUMENT_QA","FAT_IFAT","LOGISTICS_REGULATORY","SITE_READINESS","INSTALL_PRECOM","SAT_COMMISSIONING","HANDOVER_WARRANTY"]
    },
    {
      id:"G7_COST",
      label:"Cost / Schedule / Risk",
      stages:["COST_SCHEDULE_RISK"]
    },
    {
      id:"G8_COMMERCIAL_RELEASE",
      label:"Commercial / Release",
      stages:["COMMERCIAL_TREATMENT","RELEASE"]
    }
  ],
  methodControl: {
    canonicalOrder:"fullChain",
    presentationMayGroup:true,
    presentationMayReorder:false,
    sourceReadingOrderIsNotContractualPrecedence:true,
    parametricCostStartsFromControlledDrivers:true,
    note:"UI may collapse stages into groups for readability, but computation/release logic must follow fullChain dependencies."
  },
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
    ["R-012","STALE / SUPERSEDED SOURCE MUST NOT GENERATE A CURRENT OUTPUT"],
    ["R-013","UI GROUPING / VIEW ORDER MUST NOT CHANGE CANONICAL METHOD DEPENDENCIES"],
    ["R-014","SOURCE READING ORDER != CONTRACTUAL ORDER OF PRECEDENCE"],
    ["R-015","PARAMETRIC COST REQUIRES CONTROLLED QUANTITY / WORK / OWNERSHIP DRIVERS; NO DRIVER => OPEN/TBC"],
    ["R-016","VENDOR OFFER / BOM IS EVIDENCE OF OFFERED SOLUTION; IT MUST NOT DEFINE THE FUNDAMENTAL NEED OR REQUIRED QUANTITY"],
    ["R-017","ADDVALUE LABOR / PROFESSIONAL WORK MUST NOT BE BURIED IN PART A EQUIPMENT; MAP TO THE APPLICABLE PART B/C LINE"],
    ["R-018","VENDOR/OEM SERVICE MAY STAY IN THE SELECTED VENDOR PACKAGE OR BE EXPOSED IN B/C, BUT THE SAME SERVICE COST MUST NOT BE CHARGED TWICE"],
    ["R-019","LIFECYCLE EVENT RESPONSIBILITY MUST BE ROLE-BASED: CONTRACT LEAD / TECHNICAL EXECUTE / OEM SUPERVISE / WITNESS / CLOSEOUT ARE DISTINCT WORK OBJECTS"],
    ["R-020","IF OEM AUTHORISATION IS WARRANTY-CRITICAL, ADDVALUE-ONLY COMMISSIONING MUST REMAIN BLOCKED UNTIL OEM TERMS OR WRITTEN DELEGATION ARE CONTROLLED"],
    ["R-021","BULK IS A CANONICAL REQUIRED-MTO / MATERIAL CLASS; DO NOT HIDE IT INSIDE EQUIPMENT OR LABOR"],
    ["R-022","SYSTEM-DEDICATED BULK STAYS TRACEABLE TO ITS SYSTEM; SHARED BULK STAYS IN A COMMON POOL UNTIL A CAUSAL ALLOCATION DRIVER EXISTS"],
    ["R-023","ENGINEERING OWNERSHIP OF BULK AND CUSTOMER COMMERCIAL MAPPING ARE SEPARATE: BULK MAY ROLL INTO A1 WHILE REMAINING A SEPARATE COST OBJECT"],
    ["R-024","BULK MATERIAL != INSTALLATION LABOR != FREIGHT/LOGISTICS != SPARES/TOOLS; MAP EACH TO ITS OWN COMMERCIAL LINE"],
    ["R-025","REQUIREMENT THREAD = PARTICULAR PROJECT INSTANCE; COMMON/GENERIC METHOD AND EQUATIONS MUST BE REFERENCED/BINDING, NOT COPIED"],
    ["R-026","BEFORE CREATING A NEW EQUATION, SEARCH THE CANONICAL EQUATION REGISTRY; NEW PARTICULAR MATH REQUIRES SOURCE/METHOD BASIS AND REVIEW"],
    ["R-027","OPEN ENGINEERING GAP => INTERNAL-FIRST RESEARCH; IF INTERNAL EVIDENCE IS INSUFFICIENT, SEARCH APPLICABLE INTERNATIONAL STANDARD / OEM / RECOGNISED RESEARCH BEFORE FALLING BACK TO AN EXPLICIT ASSUMPTION"],
    ["R-028","VENDOR OFFER HEADER/ITEMS/CONDITIONS REMAIN WHOLE SOURCE EVIDENCE; SYSTEM VIEWS USE CONTROLLED ITEM/CONDITION BINDINGS, NOT COPIED QUOTES"],
    ["R-029","CUSTOMER PRICE OUTPUT MAY USE AUTHORISED RELEASED_SELL ONLY; SOURCE_COST / INTERNAL_COST / WORKING_SELL ARE INTERNAL SEMANTIC LAYERS"]
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
