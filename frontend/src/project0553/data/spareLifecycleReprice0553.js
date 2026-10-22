// PJ2608-0553 · PTTEP requirement-first B10/B11/B13/C1/C2 technical/commercial model.
// No Rev08, historical WBS, or installed equipment quote is used to seed current prices.
// The five owners share one MR/Site/OEM register but keep one unique physical stock owner.
import register from "./spareLifecycleReprice0553.json";
import {selectDocumentSpareObligations0553} from "./documentSpareObligations0553";

const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const CODES=["B10","B11","B13","C1","C2"];
const validNum=x=>typeof x==="number"&&Number.isFinite(x)&&x>=0;
const unique=x=>[...new Set(x)];

export const SPARE_LIFECYCLE_REPRICE_DOCUMENT_0553=register;

export function selectSpareLifecycleReprice0553(){
 const document=selectDocumentSpareObligations0553();
 const count=register.documentControl.contractSpareKitsByMR;
 if(CODES.some(code=>!register.commercialOwners.some(x=>x.code===code))||
    document.totals.commissioningKitSets!==14||
    Object.entries(count).some(([mr,n])=>document.rows.find(x=>x.mr===mr)?.commissioningKitQuantity!==n)||
    register.documentControl.totalContractKits!==14||
    register.historicalCommercialInputsPermitted!==false)
  throw Error("PTTEP B10/B11/B13/C1/C2 documentary scope ownership mismatch");

 const ids=new Set(),pricedPhysicalKeys=new Set();
 const rows=register.items.map(row=>{
  if(ids.has(row.id)||!CODES.includes(row.owner)||!row.sourceReferences.length||
     row.commercialPostingApproved!==false&&row.commercialPostingApproved!==true)
   throw Error("Invalid duplicate/owner/source spare candidate "+row.id);
  ids.add(row.id);
  // Candidates are not automatically ordered physical spare items.
  // Quoting requires a separately identified OEM SKU AND explicit owner selection.
  const selected=row.commercialPostingApproved===true;
  const evidenced=selected&&Boolean(row.sparePartNumber)&&
   Number.isInteger(row.derivedRequiredQuantity)&&row.derivedRequiredQuantity>0&&
   validNum(row.independentSupplierUnitCostTHB)&&
   validNum(row.selectedWorkingSellTHB)&&
   Boolean(row.supplierQuoteId);
  if(selected&&!evidenced)
   throw Error("Spare selected for posting without Qty/SKU independent supplier quote/SELL: "+row.id);
  if(selected){
   const key=[row.sparePartNumber,row.supplierQuoteId,row.owner].join("|");
   if(pricedPhysicalKeys.has(key))
    throw Error("Double-posted physical spare item "+key);
   pricedPhysicalKeys.add(key);
  }
  return Object.freeze({...row,
   moduleId:"bid.budget.working.bc."+row.owner.toLowerCase()+".pttep-spares."+row.id.toLowerCase(),
   directCostTHB:evidenced?round(row.derivedRequiredQuantity*row.independentSupplierUnitCostTHB):null,
   workingSellTHB:evidenced?round(row.selectedWorkingSellTHB):null,
   customerReleaseAllowed:false,
   pricingStatus:evidenced?"SUPPLIER_PRICED_PENDING_TECHNICAL_AND_COMMERCIAL_APPROVAL":
    "REQUIREMENT_OR_OEM_SPIR_PRICE_NOT_ESTABLISHED"
  });
 });
 const byCode=Object.fromEntries(CODES.map(code=>{
  const owner=register.commercialOwners.find(x=>x.code===code);
  const subset=rows.filter(x=>x.owner===code);
  const priced=subset.filter(x=>Number.isFinite(x.workingSellTHB));
  // Only a frozen OEM part/kit register can establish total. Subtotal is not a
  // complete SELL; even selected candidate items remain technical review.
  const complete=false;
  return [code,Object.freeze({...owner,
   moduleId:"bid.budget.working.bc."+code.toLowerCase()+".pttep-spares",
   rows:Object.freeze(subset),candidateCount:subset.length,pricedCount:priced.length,
   directCostTHB:complete?round(priced.reduce((s,x)=>s+x.directCostTHB,0)):null,
   workingSellTHB:complete?round(priced.reduce((s,x)=>s+x.workingSellTHB,0)):null,
   historicalPriceSeedUsed:false,
   costCompleteness:"NOT_ESTABLISHED__OEM_SPIR_QUOTE_AND_KIT_CONTENT_OPEN",
   customerReleaseAllowed:false
  })];
 }));
 const physicalItems=rows.filter(x=>x.commercialPostingApproved);
 if(physicalItems.length!==new Set(physicalItems.map(x=>[x.owner,x.id].join("|"))).size)
  throw Error("Duplicate selected stock posting");
 return Object.freeze({
  moduleId:register.moduleId,version:register.schema,
  commercialOwners:register.commercialOwners,
  groups:Object.freeze(register.groups.map(g=>Object.freeze({
   ...g,moduleId:"bid.budget.working.bc."+g.code.toLowerCase()+".pttep-spares.group."+g.key,
   rows:Object.freeze(rows.filter(x=>x.owner===g.code&&x.group===g.key))
  }))),
  rows:Object.freeze(rows),byCode,
  documentControl:register.documentControl,
  commissioningKitDemand:Object.freeze(document.rows.map(x=>Object.freeze({
   mr:x.mr,sites:x.sites,requiredSets:x.commissioningKitQuantity,
   kitContentsApproved:false,kitSpirMatched:false,
   moduleId:"bid.budget.working.bc.b10.pttep-spares.kit."+x.mr.toLowerCase()
  }))),
  contractKitCount:document.totals.commissioningKitSets,
  brownfieldRequirements:document.brownfieldRows,
  missingOemItemCount:rows.filter(x=>!x.sparePartNumber).length,
  missingSupplierPriceCount:rows.filter(x=>!validNum(x.independentSupplierUnitCostTHB)).length,
  financialState:"REESTIMATION_REQUIRED__NO_LEGACY_PRICE_SEED",
  currentWorkingSellTHB:null,
  directCostTHB:null,
  mandatoryCoverageComplete:false,
  canIssueCustomerAnnex:false,
  releaseAllowed:false,
  noHistoricalPriceSeed:true,
  oneOwnerPerLine:unique(rows.map(x=>x.id)).length===rows.length
 });
}
