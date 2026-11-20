// Source-anchored engineering evidence, not invented MR clause numbers or OEM approvals.
import { MR0001_GAP_ASSESSMENT } from "./mr0001GapAssessment";
const MR="https://drive.google.com/file/d/1UiabYMc178_X5_AkQsBe6kA0hUJAG5f8/view";
const BLD="https://drive.google.com/file/d/1ilsnWSfMlFZh8nD29rra4YRWizadovl-/view";
const RPT="https://drive.google.com/file/d/1DKLRk2xsCrxVU14UdSrpbHu4IjWiYQeJ/view";
const evidence=[
 {id:"EV-MR-SPARE",type:"MR_SOURCE",url:MR,locator:"MR-0001 Rev.C1 review comments, comments 3 and 6",fact:"Commissioning spares and special tools must be supplied, not only listed",applicability:["WARRANTY","RADIO_EQUIPMENT"],proof:"Confirm physical spares, special tools and SPIR, with separate D/E commercial scope",state:"SOURCE_EXTRACT_CONFIRMED_SCOPE_NOT_VALIDATED"},
 {id:"EV-MR-PRIORITY",type:"MR_SOURCE",url:MR,locator:"MR-0001 Rev.C1 order-of-precedence paragraph",fact:"Applicable laws, rules and regulations of the operating country take precedence",applicability:["REGION_KEY","CAPACITY_KEY"],proof:"Obtain Myanmar frequency/licence authority and OEM regional entitlement",state:"SOURCE_EXTRACT_CONFIRMED_COMPLIANCE_OPEN"},
 {id:"EV-BLD-EXISTING",type:"BLD_SOURCE",url:BLD,locator:"BLD-0001 Rev.C1 drawing notes 1 and 9, ZWP20 sheet",fact:"Dashed line represents existing installation; existing ZWP8–ZPQ link to be reused for ZWP20",applicability:["RADIO_EQUIPMENT","ANTENNA_RF","MOUNT_FEEDER"],proof:"Graphically inspect original line style and allocate reused/new hardware and interface MH",state:"SOURCE_EXTRACT_CONFIRMED_OWNERSHIP_OPEN"},
 {id:"EV-BLD-NEW",type:"BLD_SOURCE",url:BLD,locator:"BLD-0001 Rev.C1 drawing note 8, ZWP20 sheet",fact:"New IDU and surge arrestor in a new Ex 'e' enclosure",applicability:["RADIO_IDU_INTERFACE","ETHERNET_SURGE","ENCLOSURE_CERTIFICATION"],proof:"Reconcile tags, Qty, Ex 'e' drawings, power, earthing and cable entries",state:"SOURCE_EXTRACT_CONFIRMED_QUANTITY_OPEN"},
 {id:"EV-RPT-RF",type:"RPT_SOURCE",url:RPT,locator:"RPT-0001 Rev.C1 Table 6-1 and link profiles",fact:"Five SCADA paths with report RF models and sector/dish antenna assumptions",applicability:["RADIO_EQUIPMENT","ANTENNA_RF","RF_FILTER","FEEDER_ROUTE"],proof:"Check BLD sector and OEM radio plan, Fresnel/link margin/availability and 60 vs 90 degree design",state:"RPT_REFERENCE_ONLY_OEM_RECALC_OPEN"}
];
export const MR0001_REQUIREMENT_EVIDENCE_MATRIX=Object.freeze({
 projectId:"PJ2608-0553",mr:"MR-0001",revision:"SOURCE_REVIEW_STAGE",
 sources:evidence,requirementRows:MR0001_GAP_ASSESSMENT.requirements.map(r=>{
  const related=evidence.filter(e=>e.applicability.includes(r.functionId));
  return {...r,evidenceIds:related.map(e=>e.id),
   exactClauseVerification:related.length?"SOURCE_LOCATOR_NEEDS_NATIVE_VERIFICATION":"NO_DIRECT_CLAUSE_MAPPED",
   quantityProofStatus:"OPEN",oemAcceptance:"OPEN",releasedQty:null,acceptedCost:null};
 }),
 approval:"HOLD",releaseAllowed:false
});
