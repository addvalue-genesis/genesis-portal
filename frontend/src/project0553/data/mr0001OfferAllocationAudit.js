// PJ2608-0553 audit: source quote totals stay immutable; site-specific allocations require proof.
// Ledger is non-exclusive FUNCTIONAL CANDIDACY, not supplier fulfilment nor a cost distribution.
import { MR0001_PACKAGE_COMPOSITION } from "./mr0001PackageComposition";
import { MR0001_RADIO_ROLE_MATRIX } from "./mr0001RadioRoleMatrix";
import { MR0001_SCOPE_OWNERSHIP_AUDIT } from "./mr0001ScopeOwnershipAudit";
import { AVIAT_0553_TECHNICAL_EVALUATION } from "./aviatTechnicalBidEvaluation";

const candidates=AVIAT_0553_TECHNICAL_EVALUATION.rows.map(q=>{
 const matching=MR0001_PACKAGE_COMPOSITION.packages.flatMap(p=>
  p.components.filter(c=>c.candidateQuotes.some(x=>x.quoteLine===q.quoteLine))
   .map(c=>({packageId:p.id,sourceMtoRow:p.sourceRowIndex,site:p.platform,componentId:c.id,
    functionId:c.functionId,requiredQty:c.requiredQty,allocatedQty:null})));
 return {quoteLine:q.quoteLine,partNumber:q.partNumber,offeredQty:q.sourceQty,group:q.group,
  offeredRole:q.offeredRole,functionId:q.functionId,possibleConsumers:matching,
  siteAllocatedQty:null,unallocatedQuoteQty:null,acceptedQty:null,approvedUnitCost:null,
  pricingAllocation:null,requiredQty:null,
  state:q.offeredRole==="SPARE_OPTION_SEPARATE"?"SPARE_SEPARATE_NO_BASE_ALLOCATION":"MULTIPLE_POSSIBLE_CONSUMERS_NO_ALLOCATION",
  sourceId:q.sourceId};
});
export const MR0001_OFFER_ALLOCATION_AUDIT=Object.freeze({
 projectId:"PJ2608-0553",mr:"MR-0001",sourceQuote:AVIAT_0553_TECHNICAL_EVALUATION.quoteNumber,
 status:"CANDIDATE_COVERAGE_NO_ACCEPTED_ALLOCATION",
 sourceLineCount:candidates.length,sourceBaseLines:candidates.filter(x=>x.offeredRole!=="SPARE_OPTION_SEPARATE").length,
 sourceSpareLines:candidates.filter(x=>x.offeredRole==="SPARE_OPTION_SEPARATE").length,
 allocationRules:[
  "Every accepted physical component requires an approved site and equipment owner",
  "Offered quote-wide quantity cannot be assigned to every candidate consumer",
  "Require Σ approved site allocations <= offered quoted quantity by quote line",
  "Required quantities derive from MR/BLD/CAL/OEM, never offered values",
  "Spare D/E quote lines remain isolated from installed A/B/C scope",
  "Brownfield reuse, owner-by-others and optional supply must be resolved before purchase or cost allocation",
  "Missing and unverified quantity is null, not zero"
 ],
 sourceContext:{rptLinks:MR0001_RADIO_ROLE_MATRIX.links,siteCount:MR0001_RADIO_ROLE_MATRIX.sites.length,
  openOwnershipGates:MR0001_SCOPE_OWNERSHIP_AUDIT.checks.length},
 candidates,acceptedEquipmentCost:null,serviceCost:null,sellingPrice:null,releaseAllowed:false
});
export function validateAllocatedQuoteLines(rows=[]){
 const errors=[];
 for(const row of rows){
  if(!Number.isFinite(row.offeredQty)||row.offeredQty<0)errors.push(row.quoteLine+":invalid quoted qty");
  if(!Array.isArray(row.approvedAllocations)) {errors.push(row.quoteLine+":allocation not approved");continue;}
  if(row.approvedAllocations.some(x=>!Number.isInteger(x.qty)||x.qty<0||!x.site||!x.componentId||x.engineeringApproval!=="VERIFIED"))
   errors.push(row.quoteLine+":invalid allocation evidence");
  const used=row.approvedAllocations.reduce((sum,x)=>sum+x.qty,0);
  if(used>row.offeredQty)errors.push(row.quoteLine+":over allocated");
  if(row.offeredRole==="SPARE_OPTION_SEPARATE"&&row.approvedAllocations.some(x=>x.scope==="INSTALLED"))
   errors.push(row.quoteLine+":spare counted as installed");
 }
 return {status:errors.length?"HOLD":"REVIEW_REQUIRED",errors,releaseAllowed:false};
}
