import {COMMERCIAL_TEMPLATE_0553} from "./commercialWorkbookControl";
// Estimate-to-Bid mapping registry: source references only; no prices are synthesized.
// A mapping row is NOT an adopted priced estimate or approved bid allocation.
export const ESTIMATE_TO_BID_0553=Object.freeze({
 project:"PJ2608-0553",revision:"WORKING-REV00",state:"MAPPING_REVIEW",
 customerTemplate:COMMERCIAL_TEMPLATE_0553.id,
 records:COMMERCIAL_TEMPLATE_0553.mappings.map(m=>Object.freeze({
  id:"PJ2608-0553:MAP:"+m.code,customerLine:m.code,customerSheet:m.sheet,
  engineeringSource:m.source,quantityDriver:m.driver,
  estimateLineIds:[],allocationRule:null,internalCost:null,sellingPrice:null,
  status:"UNRECONCILED",releaseAllowed:false
 }))
});
export function validateEstimateToBid0553(records=ESTIMATE_TO_BID_0553.records){
 const seen=new Set();
 const checks=records.map(row=>{
  const issues=[];
  if(!row.id||seen.has(row.id))issues.push("MISSING_OR_DUPLICATE_ID");
  seen.add(row.id);
  if(!row.customerLine||!row.customerSheet)issues.push("MISSING_CUSTOMER_TARGET");
  if(!Array.isArray(row.estimateLineIds)||!row.estimateLineIds.length)issues.push("UNMAPPED_ESTIMATE_LINES");
  if(!row.allocationRule)issues.push("ALLOCATION_UNVERIFIED");
  if(!Number.isFinite(row.internalCost))issues.push("COST_UNVERIFIED");
  if(!Number.isFinite(row.sellingPrice))issues.push("SELLING_PRICE_UNVERIFIED");
  return {id:row.id,customerLine:row.customerLine,issues,status:issues.length?"HOLD":"REVIEW_REQUIRED"};
 });
 return {releaseAllowed:false,checks,unreconciled:checks.filter(x=>x.issues.length).length};
}
