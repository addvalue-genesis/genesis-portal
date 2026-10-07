/*
PJ2608-0550 — SMART GAP / RESEARCH RESOLUTION ENGINE

Converts SmartControl findings into research/resolution jobs.
Internal evidence is always searched before external research.
External evidence may propose a particular engineering basis but cannot override governing project sources.
*/

export const PROJECT0550_RESEARCH_AUTHORITY_LADDER = [
  {tier:"A_PROJECT_GOVERNING",priority:100,scope:"INTERNAL",sources:["Contract","MR","PHI","BOD","SPE","Project STD","Approved TC/TQ","Approved project decisions"]},
  {tier:"B_COMPANY_STANDARD_VENDOR_APPROVED",priority:90,scope:"INTERNAL",sources:["Company standards","AVL/approved vendor data","Current selected vendor evidence"]},
  {tier:"C_INTERNATIONAL_STANDARD",priority:80,scope:"EXTERNAL",sources:["IEC","ISO","ITU","ETSI","IEEE","ICAO","NFPA","API or other applicable authority"]},
  {tier:"D_OEM_ENGINEERING",priority:70,scope:"EXTERNAL",sources:["OEM engineering manual","OEM application guide","OEM validated calculation method"]},
  {tier:"E_PEER_REVIEWED_RESEARCH",priority:60,scope:"EXTERNAL",sources:["Peer-reviewed research","Recognised engineering publication"]},
  {tier:"F_HISTORICAL_CALIBRATION",priority:35,scope:"INTERNAL",sources:["Approved actual/history","Comparable project calibration"]},
  {tier:"G_ASSUMPTION",priority:10,scope:"INTERNAL",sources:["Explicit controlled assumption only"]}
];

const STAGE_SEARCH_HINTS = {
  SOURCE_EVIDENCE:["MR","PHI","BOD","SPE","STD","TC/TQ","vendor submissions"],
  REQUIREMENT:["MR","PHI","BOD","SPE","contract clause","approved TC/TQ"],
  FUNDAMENTAL_NEED:["PHI","BOD","system philosophy","functional requirement"],
  CONSTRAINT:["SPE","STD","BOD","drawing","site data","regulatory requirement"],
  INTERFACE_CONTEXT:["PHI","BOD","interface drawing","cause & effect","LIS","network architecture"],
  ENGINEERING_INPUT:["DWG","LAY","LIS","MTO","survey","datasheet","vendor engineering data"],
  CAL_STUDY_RPT:["project CAL/SDY/RPT","STD method","OEM validated calculation method"],
  PROOF:["CAL/SDY/RPT result","test criteria","acceptance criteria"],
  ARCHITECTURE:["BOD","PHI","SPE","approved vendor architecture","interface constraints"],
  PHYSICAL_OBJECT:["required architecture","equipment schedule","vendor datasheet"],
  QUANTITY_DRIVER:["layout/location count","topology","route","interface count","calculation output"],
  REQUIRED_MTO:["proof output","LIS/MTO","physical object register"],
  BULK:["route/topology","cable schedule","JB/termination schedule","mounting schedule"],
  VENDOR_RECONCILIATION:["required MTO","vendor offer items","TBE","deviation/clarification"],
  WORK_RESOURCE:["required activity","event","document","approved UMH/rate history"],
  DOCUMENT_QA:["MR Appendix / SDRL","VDRL","document review cycles"],
  FAT_IFAT:["MR","SPE","ITP","vendor service quote","test procedure"],
  LOGISTICS_REGULATORY:["Incoterm","shipping requirement","permit/licence","authority requirement"],
  SITE_READINESS:["survey","site access","power/interface readiness","civil completion"],
  INSTALL_PRECOM:["method statement","installation scope","vendor boundary"],
  SAT_COMMISSIONING:["SAT criteria","commissioning method","OEM warranty condition"],
  HANDOVER_WARRANTY:["warranty clause","handover requirement","spares/support"],
  COST_SCHEDULE_RISK:["cost item","vendor condition","rate","lead time","risk condition"],
  COMMERCIAL_TREATMENT:["customer price form","commercial policy","accepted condition"],
  RELEASE:["all mandatory upstream gates"]
};

function unique(values=[]){ return [...new Set(values.filter(Boolean))]; }

export function resolutionJobFromFinding(finding={},context={}){
  const stage=String(finding.stage||"SOURCE_EVIDENCE").toUpperCase();
  const internalTiers=PROJECT0550_RESEARCH_AUTHORITY_LADDER.filter(x=>x.scope==="INTERNAL" && x.tier!=="G_ASSUMPTION");
  const externalTiers=PROJECT0550_RESEARCH_AUTHORITY_LADDER.filter(x=>x.scope==="EXTERNAL");
  return {
    caseCode:"RES-"+(context.systemToken||"COMMON")+"-"+(finding.code||stage),
    projectCode:"PJ2608-0550",
    systemToken:context.systemToken||null,
    requirementCode:context.requirementCode||null,
    blockingStage:stage,
    severity:finding.severity||"WARN",
    problemStatement:finding.message||"Open engineering/control issue",
    currentAction:finding.action||null,
    searchHints:unique([...(STAGE_SEARCH_HINTS[stage]||[]),...(context.searchHints||[])]),
    searchPlan:{
      step1:{mode:"INTERNAL_FIRST",tiers:internalTiers.map(x=>x.tier),instruction:"Search current 0550 project sources, controlled DB/evidence, approved project decisions and selected vendor evidence before external research."},
      step2:{mode:"EXTERNAL_IF_INTERNAL_INSUFFICIENT",tiers:externalTiers.map(x=>x.tier),instruction:"Use applicable international standards, OEM engineering references and recognised research only when internal evidence is insufficient. Do not override governing project sources."},
      step3:{mode:"ASSUMPTION_LAST_RESORT",tiers:["G_ASSUMPTION"],instruction:"If no authoritative answer exists, create an explicit preliminary assumption with closure action; never convert uncertainty to zero."}
    },
    expectedResult:["evidence candidate(s)","authority/applicability assessment","recommended particular resolution","downstream impact list","human review/approval state"],
    autoApply:false
  };
}

export function buildProject0550ResolutionPlan(findings=[],context={}){
  const jobs=(findings||[]).map(f=>resolutionJobFromFinding(f,context));
  return {
    architecture:"INTERNAL_FIRST -> EXTERNAL_AUTHORITY_IF_NEEDED -> PROPOSAL -> HUMAN_GATE -> CONTROLLED_STATE -> RECALCULATE",
    authorityLadder:PROJECT0550_RESEARCH_AUTHORITY_LADDER,
    jobs,
    summary:{total:jobs.length,blockers:jobs.filter(x=>x.severity==="BLOCKER").length,internalFirst:jobs.length,externalEligible:jobs.length},
    autoApply:false
  };
}

export function firstBlockingStage(findings=[]){
  const order=["SOURCE_EVIDENCE","REQUIREMENT","FUNDAMENTAL_NEED","CONSTRAINT","INTERFACE_CONTEXT","ENGINEERING_INPUT","CAL_STUDY_RPT","PROOF","ARCHITECTURE","PHYSICAL_OBJECT","QUANTITY_DRIVER","REQUIRED_MTO","BULK","VENDOR_RECONCILIATION","WORK_RESOURCE","DOCUMENT_QA","FAT_IFAT","LOGISTICS_REGULATORY","SITE_READINESS","INSTALL_PRECOM","SAT_COMMISSIONING","HANDOVER_WARRANTY","COST_SCHEDULE_RISK","COMMERCIAL_TREATMENT","RELEASE"];
  for(const stage of order){
    const hit=(findings||[]).find(x=>String(x.stage).toUpperCase()===stage);
    if(hit) return hit;
  }
  return null;
}
