import {COMMERCIAL_TEMPLATE_0553} from "./commercialWorkbookControl";
// PROJECT-SPECIFIC commercial destination registry only.
// First Principles / Telecom Constraints / CAL / BOM / selected vendor / cost derivation
// remain owned by upstream engineering and the shared parametric cost kernel.
export const ESTIMATE_TO_BID_0553=Object.freeze({
 project:"PJ2608-0553",revision:"WORKING-REV00",state:"MAPPING_REVIEW",
 ownership:Object.freeze({
  engineering:"UPSTREAM_ENGINEERING_AND_COST_MODEL",
  mapping:"READ_ONLY_ALLOCATION_REFERENCES",
  sellingPrice:"SEPARATE_APPROVED_COMMERCIAL_PRICING"
 }),
 customerTemplate:COMMERCIAL_TEMPLATE_0553.id,
 records:COMMERCIAL_TEMPLATE_0553.mappings.map(m=>Object.freeze({
  id:"PJ2608-0553:MAP:"+m.code,customerLine:m.code,customerSheet:m.sheet,
  engineeringSource:m.source,quantityDriver:m.driver,
  estimateLineIds:Object.freeze([]),allocationRule:null,
  status:"UNRECONCILED",releaseAllowed:false
 }))
});
// Mapping may cite existing verified estimate lines, but must never originate
// equipment quantities, vendor unit costs, commercial margin, or selling prices.
const FORBIDDEN_SOURCE_FIELDS=["internalCost","sellingPrice","unitCost","unitPrice","qty","quantity","margin","markup"];
export function validateEstimateToBid0553(records=ESTIMATE_TO_BID_0553.records){
 const seen=new Set();
 const checks=records.map(row=>{
  const issues=[];
  if(!row.id||seen.has(row.id))issues.push("MISSING_OR_DUPLICATE_ID");
  seen.add(row.id);
  if(!row.customerLine||!row.customerSheet)issues.push("MISSING_CUSTOMER_TARGET");
  if(!Array.isArray(row.estimateLineIds)||!row.estimateLineIds.length)issues.push("UNMAPPED_ESTIMATE_LINES");
  if(!row.allocationRule)issues.push("ALLOCATION_UNVERIFIED");
  for(const field of FORBIDDEN_SOURCE_FIELDS)if(Object.prototype.hasOwnProperty.call(row,field))issues.push("UNAUTHORIZED_DERIVATION:"+field);
  return {id:row.id,customerLine:row.customerLine,issues,status:issues.length?"HOLD":"REVIEW_REQUIRED"};
 });
 return {releaseAllowed:false,checks,unreconciled:checks.filter(x=>x.issues.length).length};
}
