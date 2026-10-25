// PJ2608-0553 | Read-only cross-category spare lifecycle trace.
// 10.2 canonical Source -> 10.3.3 Release -> exact 10.2 Source -> 10.3.3.
// Does not allocate vendor SKUs, infer physical spare stock or modify WBS sell.
export const SPARE_LIFECYCLE_CODES_0553=Object.freeze(["B10","B11","B13","C1","C2"]);
const round=n=>Math.round(n*100)/100;
const rules=Object.freeze([
 Object.freeze({id:"B10-A",left:"B10",right:"A",title:"Installed equipment / B10 stock",
  requirement:"MR0001–0004 Attachment 5; exact OEM spare SKU and a separately delivered B10 quantity are required",
  decision:"Do not treat installed ODU/IDU/Cisco/RFI/Phone/RACON quotation quantities or installed rates as B10 spare stock"}),
 Object.freeze({id:"B10-C1",left:"B10",right:"C1",title:"Commissioning vs complete capital unit",
  requirement:"Distinct physical stock owner required for any complete ODU, BDA, telephone or RACON replacement",
  decision:"A complete Part A equipment comparable does not certify a capital spare or a B10 replacement SKU"}),
 Object.freeze({id:"B10-C2",left:"B10",right:"C2",title:"Commissioning vs two-year operating stock",
  requirement:"MR0001–0004 Attachment 7 instruction 6 expressly excludes B10-listed items from C2",
  decision:"Compare exact OEM part number, delivered quantities and stock owner before excluding or charging a C2 line"}),
 Object.freeze({id:"B11-A",left:"B11",right:"A",title:"Configuration licences / included vendor tools",
  requirement:"EXA-A8 Attachment 2 telecom minimum five functions; selected DMR vs TETRA applicability",
  decision:"Deduct OEM included configuration licences/tools, and do not price an inapplicable TETRA gateway as DMR"}),
 Object.freeze({id:"B11-B3",left:"B11",right:"B3",title:"Hand-over tools vs contractor SAT/FAT tools",
  requirement:"Permanent special tools to PTTEP vs temporary ADDVALUE testing/rental",
  decision:"Do not charge B3 VeEX/testers as B11 handover stock or vice versa"}),
 Object.freeze({id:"B13-B5",left:"B13",right:"B5",title:"Preservation consumables vs shipping/packing",
  requirement:"Differentiate one-off packing and free-issue protection from additional consumables",
  decision:"Consumables billed only for distinct events beyond B5 shipment protection"}),
 Object.freeze({id:"B13-A5",left:"B13",right:"A5",title:"Site consumables vs installed bulk",
  requirement:"Separate consumed re-termination/rework materials from permanent installed cable, gland and RF accessories",
  decision:"Do not charge permanent cable, glands or connectors twice as B13"})
]);
const sourceRowId=row=>String(row?.sourceId||row?.id||"");
export function buildSpareLifecycleTrace0553(schedule,release){
 if(!schedule?.currentByCode||!release?.annex||!release?.annexTraceAudit?.sourceToReleasePassed||
  !release?.annexTraceAudit?.releaseToSourcePassed)
  throw Error("0553 spare lifecycle requires the verified canonical Working and Release source models");
 const result=[],seen=new Set();
 for(const code of SPARE_LIFECYCLE_CODES_0553){
  const src=schedule.currentByCode[code]||[],dst=release.annex[code]||[];
  const trace=new Map((release.annexTraceAudit.rowTrace||[]).filter(x=>x.code===code).map(x=>[x.sourceId,x]));
  if(!src.length||src.length!==dst.length)throw Error(code+" lifecycle source/release row count mismatch");
  for(let i=0;i<src.length;i++){
   const row=src[i],r=dst.find(x=>x.sourceId===sourceRowId(row)),id=sourceRowId(row),t=trace.get(id);
   if(!r||!t||seen.has(id))throw Error("0553 spare lifecycle has duplicate or orphan row "+code+":"+id);
   if(id!==r.sourceId||r.sourceRowModuleId!==row.sourceRowModuleId||
    r.traceId!==row.traceId||t.sourceModuleId!==row.sourceRowModuleId||
    t.nativeSheet!==r.nativeSheet||t.nativeRow!==r.nativeRow||
    t.qty!==r.qty||t.workingTotalTHB!==r.workingTotalTHB||
    t.sourceToReleaseMatched!==true||t.releaseToSourceMatched!==true)
    throw Error("0553 lifecycle Source/Release/source mismatch "+id);
   seen.add(id);
   const expected=Number.isFinite(row.extendedTHB)?row.extendedTHB:null;
   if(r.workingTotalTHB!==expected)throw Error("0553 lifecycle cross-category working amount differs "+id);
   const category=code==="B10"?"STARTUP_SPARE_KIT_ENVELOPE":code==="B11"?"SPECIAL_TOOL_MR_PHASE_SET":
    code==="B13"?"PRESERVATION_CONSUMABLE_ALLOWANCE":code==="C1"?"UNQUOTED_CAPITAL_SPARE_OPTION":"UNQUOTED_TWO_YEAR_SPARE_OPTION";
   const relevant=rules.filter(x=>x.left===code||x.right===code).map(x=>x.id);
   result.push(Object.freeze({
    id,code,sourceId:id,traceId:r.traceId,sourceRowModuleId:r.sourceRowModuleId,
    releaseRowModuleId:"bid.budget.pricing.release.preview.annex."+code.toLowerCase()+"."+id.toLowerCase(),
    sourceRevision:row.sourceRevision,
    mr:Object.freeze([...(row.linkedMR||[])]),siteCount:(row.linkedLocations||[]).length,
    description:row.displayDescription||row.description,quantity:r.qty,unit:r.unit,
    selectedWorkingSellTHB:r.workingTotalTHB,customerUnitTHB:r.customerUnitTHB,customerTotalTHB:r.customerTotalTHB,
    parentPriceRole:category,relatedRules:Object.freeze(relevant),
    physicalSkuApproved:false,physicalQtyApproved:false,independentSpareUnitPriceApproved:false,
    // Price owner records belong only to existing 16 WBS/annex financial rows.
    countedAsAdditionalSku:false,postedToPartA:false,postedToB11:false,postedToC1:false,postedToC2:false,
    customerReleaseAllowed:false
   }));
  }
 }
 if(result.length!==16||seen.size!==16)throw Error("0553 five-category lifecycle requires 16 unique financial source records");
 const totals=Object.fromEntries(SPARE_LIFECYCLE_CODES_0553.map(code=>{
  const rows=result.filter(x=>x.code===code),quoted=rows.every(x=>Number.isFinite(x.selectedWorkingSellTHB));
  const subtotal=quoted?round(rows.reduce((s,x)=>s+x.selectedWorkingSellTHB,0)):null;
  return [code,Object.freeze({rows:rows.length,workingSellTHB:subtotal,customerReleaseAllowed:false})];
 }));
 for(const code of SPARE_LIFECYCLE_CODES_0553){
  const parent=[...release.b,...release.c].find(x=>x.code===code);
  if(!parent)throw Error("0553 missing financial owner "+code);
  if(Number.isFinite(parent.customerSellTHB)&&Math.abs(parent.customerSellTHB-totals[code].workingSellTHB)>0.01)
   throw Error("0553 lifecycle price owner changed "+code);
  if(!Number.isFinite(parent.customerSellTHB)&&code.startsWith("C")&&totals[code].workingSellTHB!==null)
   throw Error("0553 optional OEM spare cannot be silently priced "+code);
 }
 return Object.freeze({
  moduleId:"bid.budget.working.bc.spare-lifecycle-control",
  rows:Object.freeze(result),totals:Object.freeze(totals),rules,
  alertFamilies:Object.freeze([...(schedule.crossCategoryDuplicates||[])]),
  sourceToReleasePassed:true,releaseToSourcePassed:true,
  confirmedSameSkuCrossCategory:0,
  physicalSkuOwnershipComplete:false,
  completeCategoryReconciliation:false,
  noNewPosting:true,releaseAllowed:false,
  priceOwnerStatement:"16 source-owned financial rows unchanged; unverified physical SKU quantities, invoices or spare quotes NEVER posted"
 });
}
