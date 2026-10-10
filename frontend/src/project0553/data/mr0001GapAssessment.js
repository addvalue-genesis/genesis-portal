// Evidence-gated MR0001 gap assessment. No candidate equals an accepted offer.
import { MR0001_PACKAGE_COMPOSITION } from "./mr0001PackageComposition";
import { MR0001_OFFER_ALLOCATION_AUDIT } from "./mr0001OfferAllocationAudit";
import { MR0001_SCOPE_OWNERSHIP_AUDIT } from "./mr0001ScopeOwnershipAudit";
import { AVIAT_0553_TECHNICAL_EVALUATION } from "./aviatTechnicalBidEvaluation";

const requirementRows=MR0001_PACKAGE_COMPOSITION.packages.flatMap(p=>p.components.map(c=>{
 const sourceOfferRefs=c.candidateQuotes.map(q=>q.quoteLine);
 const status=!sourceOfferRefs.length?"NO_CANDIDATE_IN_NEXTG":candidatesHaveMultipleOwners(sourceOfferRefs)?"SHARED_OR_OVERLAP_REVIEW":"CANDIDATE_TECH_REVIEW";
 return {id:c.id,packageId:p.id,site:p.platform,mtoRow:p.sourceRowIndex,requirement:p.sourceCodes,
  functionId:c.functionId,requiredQty:c.requiredQty,proof:c.proofRequired,
  offerLines:sourceOfferRefs,offeredAllocatedQty:null,gapQty:null,technicalApproval:"OPEN",
  issueStatus:status,acceptedCost:null,commercialExposure:null};
}));
function candidatesHaveMultipleOwners(codes){
 return codes.some(code=>MR0001_OFFER_ALLOCATION_AUDIT.candidates.find(x=>x.quoteLine===code)?.possibleConsumers.length>1);
}
const supplierRows=MR0001_OFFER_ALLOCATION_AUDIT.candidates.map(q=>({
 quoteLine:q.quoteLine,partNumber:q.partNumber,offeredQty:q.offeredQty,group:q.group,
 possibleConsumers:q.possibleConsumers.length,allocatedQty:null,
 risk:q.offeredRole==="SPARE_OPTION_SEPARATE"?"SPARE_SEPARATE":
 q.possibleConsumers.length===0?"NO_CANDIDATE_CONSUMER":
 q.possibleConsumers.length>1?"MULTI_CONSUMER_ALLOCATION_OPEN":"UNAPPROVED_SINGLE_CANDIDATE",
 scopeDecision:"OPEN",financialExposure:null
}));
export const MR0001_GAP_ASSESSMENT=Object.freeze({
 projectId:"PJ2608-0553",mr:"MR-0001",status:"PRELIMINARY_REQUIREMENT_AND_OFFER_GAP_REGISTER",
 requirements:requirementRows,supplierLines:supplierRows,
 ownershipHolds:MR0001_SCOPE_OWNERSHIP_AUDIT.checks.map(x=>({id:x.id,site:x.site,state:x.state})),
 technicalHolds:AVIAT_0553_TECHNICAL_EVALUATION.holds.map(x=>({id:x.id,state:x.state})),
 quantitiesApproved:false,spareApproved:false,commercialReady:false,releaseAllowed:false
});
export function assessApprovedQuantityGap({requiredQty,allocatedQty,engineeringApproval,scopeApproval}={}){
 if(!Number.isInteger(requiredQty)||requiredQty<0||!Number.isInteger(allocatedQty)||allocatedQty<0||
    engineeringApproval!=="VERIFIED"||scopeApproval!=="VERIFIED")
  return {status:"HOLD_MISSING_PROOF",requiredQty:null,allocatedQty:null,gapQty:null};
 const gapQty=requiredQty-allocatedQty;
 return {status:gapQty>0?"SHORTFALL":gapQty<0?"SURPLUS_REVIEW":"QUANTITY_MATCH_TECH_REVIEW",
  requiredQty,allocatedQty,gapQty};
}
