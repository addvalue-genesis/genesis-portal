/*
PJ2608-0550 — CHANGE / REVISION IMPACT MODEL

One dependency graph, one canonical state.

Example:
MR new revision
-> evidence assertions affected
-> requirements affected
-> constraints / proof inputs affected
-> proof / architecture / MTO / bulk affected
-> vendor reconciliation affected
-> work / VDRL / lifecycle affected
-> cost / risk affected
-> commercial treatment affected
-> outputs 5/7/8/9/10 become STALE until rebuilt/reviewed.

The graph does not mean every change affects every object.
Trace edges determine actual impact.
*/

import { PROJECT0550_ENGINEERING_DOCTRINE } from "./Project0550EngineeringDoctrine";
import {
  PROJECT0550_OUTPUT_MODULES,
  PROJECT0550_PROJECTION_MODULES
} from "./Project0550ModuleContract";

export const PROJECT0550_REVISION_PROPAGATION = {
  canonicalStages:PROJECT0550_ENGINEERING_DOCTRINE.fullChain.map(([id,label],index)=>({
    order:index+1,id,label
  })),
  outputModules:PROJECT0550_OUTPUT_MODULES,
  projectionModules:PROJECT0550_PROJECTION_MODULES,
  sourceChangePolicy:{
    createChangeEvent:true,
    preserveOldRevision:true,
    autoDeleteOldFacts:false,
    autoAcceptNewRequirement:false,
    markAffectedDownstreamStale:true,
    regenerateOutputOnlyAfterRevalidation:true
  }
};

export const PROJECT0550_OBJECT_PROPAGATION = {
  DOCUMENT_REVISION:["EVIDENCE_ASSERTION","REQUIREMENT"],
  EVIDENCE_ASSERTION:["REQUIREMENT","REQUIREMENT_RESOLUTION_RESEARCH","CONSTRAINT_INTERFACE_CONTEXT"],
  REQUIREMENT:["REQUIREMENT_RESOLUTION_RESEARCH","EQUATION_REGISTRY_BINDING","CONSTRAINT_INTERFACE_CONTEXT","ENGINEERING_INPUT","CAL_STUDY_RPT_PROOF","BID_RESPONSE_DEVIATION"],
  REQUIREMENT_RESOLUTION_RESEARCH:["EVIDENCE_ASSERTION","CONSTRAINT_INTERFACE_CONTEXT","ENGINEERING_INPUT"],
  EQUATION_REGISTRY_BINDING:["CAL_STUDY_RPT_PROOF","REQUIRED_MTO_BULK","WORK_RESOURCE_ACTIVITY","COST_RISK_SCHEDULE"],
  CONSTRAINT_INTERFACE_CONTEXT:["ENGINEERING_INPUT","CAL_STUDY_RPT_PROOF","ARCHITECTURE_OBJECT_QUANTITY"],
  ENGINEERING_INPUT:["CAL_STUDY_RPT_PROOF"],
  CAL_STUDY_RPT_PROOF:["ARCHITECTURE_OBJECT_QUANTITY","REQUIRED_MTO_BULK","BID_RESPONSE_DEVIATION"],
  ARCHITECTURE_OBJECT_QUANTITY:["REQUIRED_MTO_BULK","VENDOR_OFFER_ITEM_BINDING","VENDOR_OFFER_RECONCILIATION"],
  REQUIRED_MTO_BULK:["VENDOR_OFFER_ITEM_BINDING","VENDOR_OFFER_RECONCILIATION","WORK_RESOURCE_ACTIVITY","VDRL_DOCUMENT_QA","TEST_LIFECYCLE_LOGISTICS_REGULATORY","COST_RISK_SCHEDULE"],
  VENDOR_OFFER_ITEM_BINDING:["VENDOR_OFFER_RECONCILIATION","COST_RISK_SCHEDULE"],
  VENDOR_OFFER_CONDITION:["TEST_LIFECYCLE_LOGISTICS_REGULATORY","COST_RISK_SCHEDULE","BID_RESPONSE_DEVIATION"],
  VENDOR_OFFER_RECONCILIATION:["WORK_RESOURCE_ACTIVITY","VDRL_DOCUMENT_QA","TEST_LIFECYCLE_LOGISTICS_REGULATORY","COST_RISK_SCHEDULE","BID_RESPONSE_DEVIATION"],
  WORK_RESOURCE_ACTIVITY:["COST_RISK_SCHEDULE"],
  VDRL_DOCUMENT_QA:["WORK_RESOURCE_ACTIVITY","COST_RISK_SCHEDULE","OUTPUT_REVISION"],
  TEST_LIFECYCLE_LOGISTICS_REGULATORY:["WORK_RESOURCE_ACTIVITY","COST_RISK_SCHEDULE","BID_RESPONSE_DEVIATION"],
  COST_RISK_SCHEDULE:["COMMERCIAL_POLICY_TREATMENT","PRICE_LAYER_STATE"],
  COMMERCIAL_POLICY_TREATMENT:["PRICE_LAYER_STATE"],
  PRICE_LAYER_STATE:["OUTPUT_REVISION"],
  BID_RESPONSE_DEVIATION:["PRICE_LAYER_STATE","OUTPUT_REVISION"],
  OUTPUT_REVISION:[]
};

export function downstreamDomains(domain,seen=new Set()){
  if(seen.has(domain)) return [];
  seen.add(domain);
  const direct=PROJECT0550_OBJECT_PROPAGATION[domain]||[];
  const all=[...direct];
  for(const child of direct){
    for(const nested of downstreamDomains(child,seen)){
      if(!all.includes(nested)) all.push(nested);
    }
  }
  return all;
}

export function impactPlanForSourceRevision({
  sourceType="DOCUMENT_REVISION",
  sourceRef,
  previousRevision,
  newRevision
}={}){
  const impacted=downstreamDomains(sourceType);
  return {
    source:{type:sourceType,ref:sourceRef||null,previousRevision:previousRevision||null,newRevision:newRevision||null},
    impactedDomains:impacted,
    outputModules:PROJECT0550_OUTPUT_MODULES,
    projectionModules:PROJECT0550_PROJECTION_MODULES,
    actions:[
      "REGISTER_NEW_REVISION_AND_PRESERVE_SUPERSEDED_REVISION",
      "CREATE_CHANGE_EVENT",
      "TRAVERSE_CONTROLLED_TRACE_EDGES",
      "MARK_AFFECTED_CANONICAL_OBJECTS_REVIEW_OR_RECALCULATE",
      "MARK_AFFECTED_MODULE_PROJECTIONS_STALE",
      "REVALIDATE_FIRST_PRINCIPLES_CBE_PARAMETRIC_CHAIN",
      "REBUILD_GRAPHS_FROM_CANONICAL_STATE",
      "REGENERATE_OUTPUTS_WITH_NEW_INPUT_SNAPSHOT",
      "ISSUE_NEW_OUTPUT_REVISION_ONLY_AFTER_RELEASE_GATES"
    ],
    autoRelease:false
  };
}
