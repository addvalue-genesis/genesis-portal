// PJ2608-0553 / B10 PRE-AWARD item schedule.
// ONE 14-function MR Attachment 5 selection source drives native Excel and
// JSX Preview. Original Part A equipment is NOT an additional B10 spare line.
// The 4 MR kit financial envelopes remain the ONLY selected Working price owner.
import {selectB10StageSpareSelection0553} from "./b10StageSpareSelection0553";
import {selectB10ItemizedPurchaseEvidence0553} from "./b10ItemizedPurchaseEvidence0553";
import {selectSpareCustomerSchedule0553} from "./spareCustomerSchedule0553";
const freeze=Object.freeze;
const PHASE=freeze(["MR-0001","MR-0002","MR-0003","MR-0004"]);
const STAGE_LABEL=freeze({ERECTION:"Erection",PRE_COMMISSIONING:"Pre-commissioning",
 COMMISSIONING:"Commissioning",START_UP:"Start-up"});
export function selectB10NativeAnnexReview0553(){
 const selection=selectB10StageSpareSelection0553();
 const evidence=selectB10ItemizedPurchaseEvidence0553();
 const finance=selectSpareCustomerSchedule0553().currentByCode.B10;
 const sourceQuotes=new Map(evidence.supplierRows.map(x=>[x.id,x]));
 const ordinal=new Map();
 const rows=freeze(selection.stageRows.map(x=>{
  if(!PHASE.includes(x.mr)||!finance.some(z=>z.id===x.parentSourceId&&z.sourceRowModuleId===x.sourceRowModuleId))
   throw Error("0553 B10 Annex item no canonical Working/Release owner: "+x.id);
  const seq=(ordinal.get(x.mr)||0)+1;ordinal.set(x.mr,seq);
  const quoteCandidates=(x.quotedSupplierSpareRows||[]).map(id=>{
   const q=sourceQuotes.get(id);if(!q)throw Error("B10 vendor quote identity changed "+id);
   return freeze({id:q.id,sourceQuoteLine:q.sourceQuoteLine,partNo:q.proposedSku,
    vendorOfferedQty:q.vendorOfferedQty,unitCostUSD:q.quotedUnitPriceUSD,
    quoteExpired:!q.quotedSupplierCostIsCurrent,selectedSpareSkuVerified:q.selectedSpareSkuVerified});
  });
  const supportedSkus=[...new Set(quoteCandidates.map(q=>q.partNo).filter(Boolean))];
  const candidateSku=supportedSkus.length===1?supportedSkus[0]:null;
  const originalItem=x.id;
  const stages=x.phaseApplicability.map(s=>STAGE_LABEL[s]);
  const tags=x.installedEquipmentTagCandidates;
  return freeze({
   id:x.id,sourceId:x.id,parentSourceId:x.parentSourceId,
   parentTraceId:x.traceId,traceId:x.traceId,sourceRowModuleId:x.sourceRowModuleId,
   mr:x.mr,item:x.id.replace(/^B10-PTTEP-(\d\d)-F(\d\d)$/,(_m,g,n)=>Number(g)+"."+String(Number(n)).padStart(2,"0")),
   originalItemSource:originalItem,
   // Related Installed TAG — may be shared; not independently certified interchangeability.
   tag:tags.length?tags.join("; "):x.mr+" / OEM TAG MATCH PENDING",
   description:x.requirementFunction,
   partNo:null,proposedPartNo:candidateSku,
   sourceQuoteEvidence:freeze(quoteCandidates),
   physicalStageNames:freeze(stages),
   why:x.engineeringJustification,
   requirementGate:x.validationRule,
   // Exactly the original native B10 B-I columns, no invented price entry.
   specification:"Stages: "+stages.join(", ")+" | OEM spare Part No.: PENDING"+
    (candidateSku?" | Candidate vendor SKU (not approved): "+candidateSku:"")+
    " | Authority: MR Attachment 5 / Installed Required BOM / SPE 8.1",
   materials:"OEM certified/rated as applicable — technical selection pending",
   referenceQty:null,referenceCurrency:null,referenceUnit:null,referenceUnitUSD:null,
   referenceExtendedUSD:null,
   b10PurchaseQty:null,b10UnitSellUSD:null,b10ExtendedSellUSD:null,
   customerIssueAllowed:false,approvedB10PartNo:false,sourceTotalIsB10Cost:false,
   isRequirementFamily:true,postingAllowed:false,
   owner:"B10_SCOPE_CANDIDATE__OEM_SPIR_AND_DELIVERED_QUANTITY_PENDING",
   // Side review only: vendor D/E offered stock is not same as approved spare Qty.
   verification:x.validationRule,stageEvidence:x.docTrace,relatedSites:x.projectSites,
   includedPartAExcluded:true,c2DuplicateProofPending:true
  });
 }));
 const countByMr=PHASE.map(mr=>rows.filter(x=>x.mr===mr).length);
 if(rows.length!==14||countByMr.some((n,i)=>n!==[4,3,4,3][i])||
  new Set(rows.map(x=>x.id)).size!==14)
  throw Error("0553 14 B10 Article functions changed — do not export an unreviewed Annex");
 if(rows.some(x=>x.b10PurchaseQty!==null||x.b10UnitSellUSD!==null||x.b10ExtendedSellUSD!==null))
  throw Error("0553 B10 unconfirmed spare quantity or rate posted");
 const sum=finance.reduce((t,x)=>t+x.extendedTHB,0);
 if(Math.abs(sum-509827.5)>0.01)throw Error("0553 B10 selected Working kit financial owner changed");
 return freeze({
  moduleId:"bid.budget.working.bc.b10.original-annex-item-map",
  sourceModuleId:selection.moduleId,
  originalSheet:"B10 CommSpares",layoutColumns:freeze(["B","C","D","E","F","G","H","I"]),
  dataFirstRow:6,originalDataCapacity:13,totalRow:6+rows.length,
  standardDocumentHeader:"ERECTION, PRECOMMISSIONNING, COMMISSIONNING, START UP SPARE PARTS LISTS",
  commercialOfferTerm:"CIF Zhuhai Port, China (Incoterms 2020) — proposed, purchaser acceptance required",
  customerOriginalIncoterm:"DDP site — original purchaser form",
  rows,requiredPartFamilies:14,selectedMRKitQty:14,selectedMRKitWorkingSellTHB:sum,
  sourceQuoteStatus:"NextG D/E offer expired 2026-10-01; not selected as B10 part rate",
  b10CifUnitSellConfirmedCount:0,sourceTotalUSD:null,sourceTotalIsB10Cost:false,
  sourceToReleaseParentIds:freeze(finance.map(x=>x.id)),
  customerReleaseAllowed:false,
  note:"Only 14 requirement-derived B10 article candidates, not 35 mixed Part A items. Source vendor prices are NOT IFC/OEM spare CIF SELL. Do not infer B10 SKU quantity from one kit per platform."
 });
}