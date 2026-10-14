import {COMMERCIAL_TEMPLATE_0553} from "./commercialWorkbookControl";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
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
 records:REV08_BASELINE.summary.map(([code,description])=>Object.freeze({
  ...(() => {const m=COMMERCIAL_TEMPLATE_0553.mappings.find(x=>x.code===code);return m||{code,source:"Customer scope / WBS evidence not yet mapped",driver:"required WBS or OEM evidence",sheet:"Scope of supply"};})(),
  description,
  id:"PJ2608-0553:MAP:"+code,customerLine:code,customerSheet:(COMMERCIAL_TEMPLATE_0553.mappings.find(x=>x.code===code)?.sheet||"Scope of supply"),
  engineeringSource:(COMMERCIAL_TEMPLATE_0553.mappings.find(x=>x.code===code)?.source||"Source allocation required"),quantityDriver:(COMMERCIAL_TEMPLATE_0553.mappings.find(x=>x.code===code)?.driver||"WBS / vendor schedule"),
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
  if(!REV08_BASELINE.summary.some(x=>x[0]===row.customerLine))issues.push("UNKNOWN_CUSTOMER_CODE");
  if(!Array.isArray(row.estimateLineIds)||!row.estimateLineIds.length)issues.push("UNMAPPED_ESTIMATE_LINES");
  if(!row.allocationRule)issues.push("ALLOCATION_UNVERIFIED");
  for(const field of FORBIDDEN_SOURCE_FIELDS)if(Object.prototype.hasOwnProperty.call(row,field))issues.push("UNAUTHORIZED_DERIVATION:"+field);
  return {id:row.id,customerLine:row.customerLine,issues,status:issues.length?"HOLD":"REVIEW_REQUIRED"};
 });
 return {releaseAllowed:false,checks,unreconciled:checks.filter(x=>x.issues.length).length};
}
