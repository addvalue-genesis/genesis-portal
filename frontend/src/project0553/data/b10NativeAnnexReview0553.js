// PJ2608-0553 — ONE mapping for original B10 native form and browser preview.
// Part A/expired optional-source quote Qty is NOT B10 delivered Spare Qty.
// Quoted source prices are internal comparables, never an issued CIF spare SELL.
import {selectB10PhysicalComposition0553} from "./b10PhysicalComposition0553";
const fixed=Object.freeze,round4=n=>Math.round((n+Number.EPSILON)*10000)/10000;
const PHASE=["MR-0001","MR-0002","MR-0003","MR-0004"];
const status=x=>x.owner==="B10_SPARE_CANDIDATE_NOT_SELECTED"?"OPTIONAL_VENDOR_SPARE_OFFER_UNSELECTED":
 x.owner==="PART_A_INSTALLED_REFERENCE_NOT_B10_SPARE"?"PART_A_INSTALLED_NOT_B10":"OEM_SPIR_REQUIREMENT_UNPRICED";
export function selectB10NativeAnnexReview0553(){
 const composition=selectB10PhysicalComposition0553();
 const all=[...composition.installedComponents,...composition.requiredSpareFamilies];
 const rows=fixed(PHASE.flatMap((mr,mri)=>{
  const group=all.filter(x=>x.mr===mr);
  return group.map((x,i)=>{
   const originalQty=Number.isFinite(x.referenceQty)?x.referenceQty:null;
   const originalCurrency=x.referenceCurrency;
   const originalUnit=Number.isFinite(x.referenceUnitPrice)?x.referenceUnitPrice:null;
   const referenceUSD=originalUnit===null?null:originalCurrency==="USD"?originalUnit:
    originalCurrency==="THB"?round4(originalUnit/31.5):null;
   const candidate=x.owner==="B10_SPARE_CANDIDATE_NOT_SELECTED";
   const owner=status(x);
   return fixed({
    id:x.id,sourceId:x.id,parentSourceId:x.parentSourceId,
    sourceRowModuleId:composition.parentRows[mri].sourceRowModuleId,
    traceId:composition.parentRows[mri].traceId,mr,
    item:(mri+1)+"."+String(i+1).padStart(2,"0"),
    originalItemSource:x.source,tag:x.relatedTags?.[0]||mr+" / Related TAG pending",
    description:x.item,partNo:x.sku||null,materials:owner,
    specification:"Make / Model / Part No.: "+(x.sku||"OEM PART NUMBER PENDING")+
     " | Source: "+x.source+" | "+(x.evidence||x.status),
    referenceQty:originalQty,referenceCurrency:originalCurrency||null,
    referenceUnit:originalUnit,referenceUnitUSD:referenceUSD,
    referenceExtendedUSD:referenceUSD!==null&&originalQty!==null?round4(referenceUSD*originalQty):null,
    b10PurchaseQty:x.sparePurchaseQty??null,
    b10UnitSellUSD:x.spareUnitSellUSD??null,
    b10ExtendedSellUSD:null,
    sourceQuoteBasis:"MIXED_SUPPLIER_QUOTATION__NOT_CIF_ZHUHAI",
    owner,status:x.status,approvedB10PartNo:false,
    candidateB10: candidate||x.owner==="SPIR_COMPONENT_QTY_SKU_PRICE_OPEN",
    postedToPartA:false,postedToB10:false,postedToC2:false,
    customerIssueAllowed:false
   });
  });
 }));
 if(rows.length<=13)throw Error("B10 Annex expansion regression: more than 13 source composition rows expected");
 if(rows.length!==all.length||new Set(rows.map(x=>x.id)).size!==rows.length||
  rows.some(x=>x.b10PurchaseQty!==null||x.b10UnitSellUSD!==null))
  throw Error("0553 B10 native candidate count/price guard failed");
 if(rows.filter(x=>x.owner==="OEM_SPIR_REQUIREMENT_UNPRICED").length!==composition.requiredSpareFamilies.length)
  throw Error("0553 B10 native review omitted required spare functions");
 return fixed({
  moduleId:"bid.budget.working.bc.b10.original-annex-item-map",
  originalSheet:"B10 CommSpares",layoutColumns:fixed(["B","C","D","E","F","G","H","I"]),
  dataFirstRow:6,originalDataCapacity:13,totalRow:6+rows.length,
  standardDocumentHeader:"ERECTION, PRECOMMISSIONNING, COMMISSIONNING, START UP SPARE PARTS LISTS",
  commercialOfferTerm:"CIF Zhuhai Port, China — Incoterms 2020 (commercial basis to qualify with purchaser)",
  referenceCurrency:"USD",sourceFXTHBPerUSD:31.5,
  rows,sourceTotalUSD:round4(rows.reduce((n,x)=>n+(x.referenceExtendedUSD||0),0)),
  sourceTotalIsB10Cost:false,
  b10CifUnitSellConfirmedCount:0,
  customerReleaseAllowed:false,
  note:"Internal reference prices are Source vendor quoted COST/installed equipment comparisons; not B10 delivered spare SELL, not CIF. Customer-form H/I remains To be quoted until OEM SPIR and commercial CIF costs selected."
 });
}
