/*
PJ2608-0550 — MODULE CONTRACT / SINGLE-SOURCE-OF-TRUTH ARCHITECTURE

No module owns an independent copy of project truth.

Canonical project state lives in controlled DB objects / JSON snapshots.
Modules are one of:
- PROJECTION: read-only/read-mostly view of canonical state
- POLICY: human-approved policy/authority input
- ENGINE: reusable method/equation execution
- ORCHESTRATOR: validates dependencies/readiness and creates findings/proposals
- CONTROL_VIEW: edits controlled dispositions/statuses that are themselves canonical state
- OUTPUT: renders/generates customer/internal artifacts from canonical state
- GOVERNANCE: permissions/review policy

Graphs/charts are always PROJECTIONs. They never own price/cost/engineering data.
*/

export const PROJECT0550_CANONICAL_DOMAINS = [
  "DOCUMENT_REVISION",
  "EVIDENCE_ASSERTION",
  "REQUIREMENT",
  "CONSTRAINT_INTERFACE_CONTEXT",
  "ENGINEERING_INPUT",
  "CAL_STUDY_RPT_PROOF",
  "ARCHITECTURE_OBJECT_QUANTITY",
  "REQUIRED_MTO_BULK",
  "VENDOR_OFFER_RECONCILIATION",
  "WORK_RESOURCE_ACTIVITY",
  "VDRL_DOCUMENT_QA",
  "TEST_LIFECYCLE_LOGISTICS_REGULATORY",
  "COST_RISK_SCHEDULE",
  "COMMERCIAL_POLICY_TREATMENT",
  "BID_RESPONSE_DEVIATION",
  "OUTPUT_REVISION"
];

export const PROJECT0550_MODULE_CONTRACTS = {
  "1.0":{
    role:"PROJECTION",
    writesCanonical:false,
    purpose:"Executive/bid overview of current controlled state.",
    reads:["DOCUMENT_REVISION","REQUIREMENT","BID_RESPONSE_DEVIATION","OUTPUT_REVISION"],
    writes:[],
    rule:"No hard-coded project truth; summary must be derived from canonical state."
  },
  "2.0":{
    role:"POLICY",
    writesCanonical:true,
    purpose:"Commercial authority / approved pricing policy and bid-position decisions.",
    reads:["COST_RISK_SCHEDULE","COMMERCIAL_POLICY_TREATMENT"],
    writes:["COMMERCIAL_POLICY_TREATMENT"],
    rule:"May write approved policy/authority decisions only; must not duplicate cost facts."
  },
  "3.0":{
    role:"ENGINE",
    writesCanonical:false,
    purpose:"Reusable First-Principles / CBE / Parametric methods and equations.",
    reads:["EVIDENCE_ASSERTION","REQUIREMENT","CONSTRAINT_INTERFACE_CONTEXT","ENGINEERING_INPUT"],
    writes:[],
    rule:"Method library defines how to derive; project facts stay outside the method definition."
  },
  "4.0":{
    role:"ORCHESTRATOR",
    writesCanonical:true,
    purpose:"Evaluate canonical dependencies, blockers, stale state and release readiness.",
    reads:PROJECT0550_CANONICAL_DOMAINS.filter(x=>x!=="OUTPUT_REVISION"),
    writes:["BID_RESPONSE_DEVIATION"],
    rule:"May create findings/proposals/readiness/impact states; must not silently rewrite upstream facts."
  },
  "5.0":{
    role:"CONTROL_VIEW",
    writesCanonical:true,
    purpose:"Bid response/form projection over canonical requirements and responses.",
    reads:["DOCUMENT_REVISION","REQUIREMENT","CAL_STUDY_RPT_PROOF","REQUIRED_MTO_BULK","COST_RISK_SCHEDULE","BID_RESPONSE_DEVIATION"],
    writes:["BID_RESPONSE_DEVIATION"],
    rule:"Requirement/source text must come from canonical requirement state; only bidder response/disposition is editable here."
  },
  "6.0":{
    role:"CONTROL_VIEW",
    writesCanonical:true,
    purpose:"Scope/compliance resolution view over canonical requirements, evidence and response dispositions.",
    reads:["DOCUMENT_REVISION","EVIDENCE_ASSERTION","REQUIREMENT","CAL_STUDY_RPT_PROOF","VENDOR_OFFER_RECONCILIATION","BID_RESPONSE_DEVIATION"],
    writes:["BID_RESPONSE_DEVIATION"],
    rule:"Compliance/deviation status is controlled state; underlying requirement/evidence is not copied into a separate truth set."
  },
  "7.0":{
    role:"OUTPUT",
    writesCanonical:false,
    purpose:"ASK-TSI priced breakdown renderer/export.",
    reads:["REQUIRED_MTO_BULK","VENDOR_OFFER_RECONCILIATION","WORK_RESOURCE_ACTIVITY","VDRL_DOCUMENT_QA","TEST_LIFECYCLE_LOGISTICS_REGULATORY","COST_RISK_SCHEDULE","COMMERCIAL_POLICY_TREATMENT","OUTPUT_REVISION"],
    writes:[],
    rule:"No independent cost/price logic. Render mapped controlled price state only."
  },
  "7.1":{
    role:"PROJECTION",
    writesCanonical:false,
    purpose:"Internal cost / commercial analysis, system drilldown and graphs.",
    reads:["ARCHITECTURE_OBJECT_QUANTITY","REQUIRED_MTO_BULK","VENDOR_OFFER_RECONCILIATION","WORK_RESOURCE_ACTIVITY","VDRL_DOCUMENT_QA","TEST_LIFECYCLE_LOGISTICS_REGULATORY","COST_RISK_SCHEDULE","COMMERCIAL_POLICY_TREATMENT","OUTPUT_REVISION"],
    writes:[],
    rule:"Read the same canonical cost/price bindings as 7.0. Charts and outline rows are views only; no independent cost, price or allocation facts."
  },
  "8.0":{
    role:"OUTPUT",
    writesCanonical:true,
    purpose:"Deviation register/output generated from unresolved/accepted requirement-response exceptions.",
    reads:["DOCUMENT_REVISION","REQUIREMENT","CAL_STUDY_RPT_PROOF","VENDOR_OFFER_RECONCILIATION","BID_RESPONSE_DEVIATION"],
    writes:["BID_RESPONSE_DEVIATION"],
    rule:"Deviation records have their own closure workflow but must reference canonical requirement/source objects."
  },
  "9.0":{
    role:"CONTROL_VIEW",
    writesCanonical:true,
    purpose:"VDRL/document production and revision-control projection.",
    reads:["DOCUMENT_REVISION","REQUIREMENT","WORK_RESOURCE_ACTIVITY","VDRL_DOCUMENT_QA","CAL_STUDY_RPT_PROOF"],
    writes:["VDRL_DOCUMENT_QA","OUTPUT_REVISION"],
    rule:"Document obligations derive from requirements; issue/review/revision status is canonical document-production state."
  },
  "10.0":{
    role:"OUTPUT",
    writesCanonical:false,
    purpose:"Submission package assembly from released controlled outputs.",
    reads:["BID_RESPONSE_DEVIATION","VDRL_DOCUMENT_QA","COMMERCIAL_POLICY_TREATMENT","OUTPUT_REVISION"],
    writes:[],
    rule:"Package assembler only. It must not create new engineering/commercial truth."
  },
  "11.0":{
    role:"GOVERNANCE",
    writesCanonical:true,
    purpose:"Team access / permissions / governance.",
    reads:[],
    writes:[],
    rule:"Controls who may change canonical state."
  },
  "12.0":{
    role:"CONTROL_VIEW",
    writesCanonical:true,
    purpose:"19-system engineering workbench over the canonical First-Principles/CBE/Parametric chain.",
    reads:["DOCUMENT_REVISION","EVIDENCE_ASSERTION","REQUIREMENT","CONSTRAINT_INTERFACE_CONTEXT","ENGINEERING_INPUT","CAL_STUDY_RPT_PROOF","ARCHITECTURE_OBJECT_QUANTITY","REQUIRED_MTO_BULK","VENDOR_OFFER_RECONCILIATION","WORK_RESOURCE_ACTIVITY","VDRL_DOCUMENT_QA","TEST_LIFECYCLE_LOGISTICS_REGULATORY","COST_RISK_SCHEDULE"],
    writes:["EVIDENCE_ASSERTION","REQUIREMENT","CONSTRAINT_INTERFACE_CONTEXT","ENGINEERING_INPUT","CAL_STUDY_RPT_PROOF","ARCHITECTURE_OBJECT_QUANTITY","REQUIRED_MTO_BULK","VENDOR_OFFER_RECONCILIATION","WORK_RESOURCE_ACTIVITY","VDRL_DOCUMENT_QA","TEST_LIFECYCLE_LOGISTICS_REGULATORY","COST_RISK_SCHEDULE"],
    rule:"System-specific working surface; all writes go to canonical controlled state with revision/evidence."
  },
  "13.0":{
    role:"GOVERNANCE",
    writesCanonical:true,
    purpose:"Independent review/audit comments and dispositions.",
    reads:PROJECT0550_CANONICAL_DOMAINS,
    writes:["BID_RESPONSE_DEVIATION"],
    rule:"Review layer does not fork project truth."
  }
};

export const PROJECT0550_OUTPUT_MODULES = ["7.0","8.0","9.0","10.0"];
export const PROJECT0550_PROJECTION_MODULES = ["1.0","5.0","6.0","7.0","7.1","8.0","9.0","10.0"];

export const PROJECT0550_GRAPH_POLICY = {
  role:"PROJECTION",
  source:"CANONICAL_DB_STATE",
  mayPersistUiPreference:true,
  mayPersistEngineeringOrCommercialFact:false,
  rule:"A graph/chart is another view of the same controlled state. It cannot have an independent data model."
};

export function moduleContract(id){
  if(PROJECT0550_MODULE_CONTRACTS[id]) return PROJECT0550_MODULE_CONTRACTS[id];
  if(String(id).startsWith("12.")) return {...PROJECT0550_MODULE_CONTRACTS["12.0"],role:"CONTROL_VIEW"};
  return null;
}
