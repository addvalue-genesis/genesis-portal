// PJ2608-0553 — standard for future 10.2 B1–B14 / C1–C2 table Modules.
// Read source code and inspect the existing Cost Owner, pricing and Navigator
// BEFORE adding any row. IDs are immutable. Only INCLUDED_WORKING_SELL contributes
// to selected SELL; vendor quote/historical/audit references NEVER become postings.
// Do not convert unknown price/actual cost NULL to THB0.
const C=Object.freeze({
 INCLUDED_WORKING_SELL:"INCLUDED_WORKING_SELL",
 PURCHASED_SERVICE_WORKING_SELL:"PURCHASED_SERVICE_WORKING_SELL",
 SUPPLIER_QUOTE_REFERENCE:"SUPPLIER_QUOTE_REFERENCE",
 HISTORICAL_REFERENCE:"HISTORICAL_REFERENCE",
 NON_POSTING_AUDIT:"NON_POSTING_AUDIT"
});
export const WORKING_PRICE_ROW_CLASSES_0553=C;
const n=v=>typeof v==="number"&&Number.isFinite(v);
const round=v=>Math.round((v+Number.EPSILON)*100)/100;
export function validateWorkingHierarchyPriceTable0553({ownerModuleId,groups,expectedSellTHB,
 knownSupplierReferenceUSD=null}){
 if(!/bid\.budget\.working\.bc\.(?:b(?:[1-9]|1[0-4])|c[12])$/.test(ownerModuleId)||
  !Array.isArray(groups)||groups.length===0||!n(expectedSellTHB)||expectedSellTHB<0)
  throw Error("B/C price-table contract invalid parent, groups or selected Working SELL");
 const modules=new Set(),owners=new Set(),rows=[];
 for(const group of groups){
  if(!group.moduleId?.startsWith(ownerModuleId+".")||!group.kind||!group.title||
   !Array.isArray(group.items)||!group.items.length||modules.has(group.moduleId))
   throw Error("Hierarchical Working Cost group needs unique Module ID, name and child rows");
  modules.add(group.moduleId);
  let ownSell=0;
  for(const child of group.items){
   if(!child.moduleId?.startsWith(ownerModuleId+".")||
    modules.has(child.moduleId)||!Object.values(C).includes(child.priceClass)||
    !child.title||!child.owner||!child.status||!child.driver||
    [child.workingSellTHB,child.vendorQuoteUSD,child.historicalTHB,
     child.referenceTHB].some(x=>x!==null&&(!n(x)||x<0)))
    throw Error("Hierarchical Working Cost child missing source, status, owner, or unique Module ID");
   modules.add(child.moduleId);
   rows.push(child);
   if([C.INCLUDED_WORKING_SELL,C.PURCHASED_SERVICE_WORKING_SELL].includes(child.priceClass)){
    if(!n(child.workingSellTHB))throw Error("Included Working SELL requires source-derived THB amount");
    ownSell+=child.workingSellTHB;
   }else if(child.workingSellTHB!==null)
    throw Error("Supplier, historical or audit line cannot post current Working SELL: "+child.moduleId);
   if([C.SUPPLIER_QUOTE_REFERENCE,C.PURCHASED_SERVICE_WORKING_SELL].includes(child.priceClass)&&
    child.vendorQuoteUSD===null)
    throw Error("Supplier source purchased/ref rows must show original USD quote");
   if(child.priceClass===C.PURCHASED_SERVICE_WORKING_SELL&&
     child.workingSellTHB<=0)
    throw Error("Purchased service selected Working SELL must have positive cost markup source");
  }
  if(round(ownSell)!==group.workingSellTHB)
   throw Error("Cost Owner group subtotal does not equal its unique included children: "+group.moduleId);
  owners.add(group.kind);
 }
 const selected=round(groups.reduce((sum,g)=>sum+g.workingSellTHB,0));
 const supplier=round(rows.filter(x=>Number.isFinite(x.vendorQuoteUSD))
  .reduce((sum,x)=>sum+x.vendorQuoteUSD,0));
 if(selected!==round(expectedSellTHB)||
  knownSupplierReferenceUSD!==null&&supplier!==round(knownSupplierReferenceUSD))
  throw Error("B/C table total/quoted supplier reference diverges from canonical source");
 return Object.freeze({
  ownerModuleId,selectedWorkingSellTHB:selected,
  supplierReferenceUSD:supplier,groupCount:groups.length,childModuleCount:rows.length,
  moduleIds:Object.freeze([...modules]),
  noDuplicateModuleIds:modules.size===groups.length+rows.length,
  noSupplierReferenceOrHistoricalAuditDoublePosting:true,
  purchasedSupplierSellClassesValidated:true,customerReleaseAllowed:false
 });
}
