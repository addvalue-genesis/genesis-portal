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
  description:code==="B3"?"Inspection / Site Survey / FAT / SAT":description, // working display alias only; Rev08 numeric evidence and native B3 source text unchanged.
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

// LIVE 10.1/10.2 -> 10.3/10.5 -> native XLSX contract PARITY AUDIT.
// This supplements, but does not magically complete, the above estimate-line
// allocation registry. It NEVER computes price, FX, quantity, profit, or markup.
// A5 is a NON-ADDITIVE display reclassification of A1 bulk, not an extra
// MR bundle to be invoiced in the four-package Native Working Draft.
export function auditCurrentCustomerProjection0553({canonical,release,scope}={}){
 if(!canonical?.byCode||!Array.isArray(release?.a)||!Array.isArray(release?.b)||
  !Array.isArray(release?.c))throw Error("10.4 parity requires current 10.2 and 10.3 models");
 const eq=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=0.01;
 const sameSelectedValue=(a,b)=>eq(a,b)||(a===null&&b===null);
 const codes=ESTIMATE_TO_BID_0553.records.map(r=>r.customerLine);
 const seen=new Set(),rows=[];
 for(const code of codes){
  if(seen.has(code))throw Error("Duplicate original customer mapping "+code);
  seen.add(code);
  const part=code.charAt(0);
  const cell=part==="B"?Number(code.slice(1))+23:
   part==="A"&&code!=="A5"?Number(code.slice(1))+7:null;
  const sourceOwner=part==="A"?"bid.budget.bom.system-location-mto":
   "bid.budget.working.bc."+code.toLowerCase();
  let parity=true,amount=null,status="SOURCE_LINE_PARITY_NOT_PRICE_APPROVAL";
  let originalCell=cell===null?null:"G"+cell;
  if(part==="A"){
   if(code==="A5"){status="A5_BULK_NONADDITIVE_DISPLAY_RECLASS__NO_SEPARATE_NATIVE_GROUP";originalCell=null;}
   else {
    const a=release.a.find(x=>x.code===code);
    parity=Boolean(a&&a.sourceModuleId===sourceOwner&&
     (a.previewSellTHB===null||Number.isFinite(a.previewSellTHB)));
    amount=a?.previewSellTHB??null;
   }
  }else if(part==="B"){
   const owner=canonical.byCode[code],priced=release.b.find(x=>x.code===code);
   const scoped=scope?.lines?.[code];
   // Null must remain null where the contractual owner has no selected price
   // (for example B4/B12/B14). B9 is a selected nonzero 1 LS, while field execution needs call-out.
   const sameSelected=Boolean(owner&&priced&&(
    eq(owner.workingSellTHB,priced.customerSellTHB)||
    (owner.workingSellTHB===null&&priced.customerSellTHB===null)));
   const sameScope=!scope||Boolean(scoped&&(
    eq(scoped.workingSellTHB,owner?.workingSellTHB)||
    (scoped.workingSellTHB===null&&owner?.workingSellTHB===null)));
   parity=Boolean(owner&&priced&&sameSelected&&sameScope&&
    priced.sourceModuleId===owner.moduleId);
   amount=owner?.workingSellTHB??null;
   if(code==="B9"){
    const sourceYardSell=owner?.b9ChinaBudget?.b9BaseWorkingSellTHB;
    parity=parity&&Number.isFinite(sourceYardSell)&&
     eq(owner?.b9ChinaBudget?.conditionalYardSellTHB,sourceYardSell)&&
     eq(priced?.conditionalOptionWorkingSellTHB,sourceYardSell)&&
     priced?.conditionalOptionIncludedInBase===true&&
     eq(amount,sourceYardSell);
    status="B9_QUOTED_BASE_ONE_LS__NATIVE_G32__ON_CALL_EXECUTION_NONADDITIVE";
   }
  }else if(part==="C"){
   const owner=canonical.byCode[code],priced=release.c.find(x=>x.code===code);
   const scoped=scope?.lines?.[code];
   parity=Boolean(owner&&priced&&sameSelectedValue(owner.workingSellTHB,priced.workingReferenceTHB)&&
    priced.customerSellTHB===null&&priced.sourceModuleId===owner.moduleId&&
    (!scope||scoped&&sameSelectedValue(scoped.workingSellTHB,owner.workingSellTHB)));
   originalCell=code==="C1"?"G41":"G42";
   amount=null;status="C_OPTION_REFERENCE_ONLY__NO_VERIFIED_CUSTOMER_PRICE";
  }else throw Error("Unknown native customer scope "+code);
  rows.push(Object.freeze({code,sourceOwner,customerModuleId:"bid.budget.pricing.release",
   sourceScopeModuleId:"bid.budget.scope",originalWorkbook:"4-Scope of Supply.xlsx",
   sheet:"Scope of supply",originalCell,sourceWorkingSellTHB:amount,
   mappedValueParity:parity,status,releaseAllowed:false,postingAllowed:false}));
 }
 const bCount=rows.filter(r=>r.code.startsWith("B")).length;
 const aCount=rows.filter(r=>r.code.startsWith("A")).length;
 const cCount=rows.filter(r=>r.code.startsWith("C")).length;
 const unique=seen.size===codes.length;
 const selectedValueParity=unique&&bCount===14&&aCount===5&&cCount===2&&
  rows.every(r=>r.mappedValueParity);
 const unresolvedEstimateLines=validateEstimateToBid0553().unreconciled;
 return Object.freeze({moduleId:"bid.budget.mapping",rows,
  selectedValueParity,originalWorkbookLayoutCheckedAgainstActualBinary:false,
  declaredMappingCount:rows.length,unresolvedEstimateLines,
  a5Nonadditive:true,customerReleaseAllowed:false,
  state:selectedValueParity?"LIVE_READ_PARITY_ONLY__ALLOCATION_AND_RELEASE_HOLD":
   "SOURCE_PROJECTION_PARITY_MISMATCH__HOLD",
  decision:"10.4 validates current adapters but is NOT the Release pricing transformation; no independent price source"
 });
}
