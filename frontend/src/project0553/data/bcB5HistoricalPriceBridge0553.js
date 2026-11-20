// PJ2608-0553: Legacy Rev09 B5 numeric PRICE evidence. Reference ONLY.
// THIS IS NOT current Part B5 verified direct cost / approved Working SELL.
// Legacy B5 mixed physical packing with B7 storage allocation; net it explicitly.
// Supplier "RC-PACK" is historical MDS/BOQ source, not validated 2026 packing quote.
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const LEGACY_SELL_FACTOR_0553=1.2/0.95; // EXACT historic pricing (20% markup, 5% treatment); NOT controlling 10.2 current policy.
export const B5_LEGACY_PRICE_SOURCE_0553=Object.freeze({
 moduleId:"bid.budget.working.bc.b5.historical-price-reference",
 sourceTitle:"PJ2608-0553_INTERNAL_Pricing_Rev09_20260908.xlsx",
 sourceUrl:"https://docs.google.com/spreadsheets/d/1kmnY9WAiWeM-IIanARPfrzd4UNigv_QO/edit",
 sourceRevision:"Rev09 2026-09-08 / B5 rows 95–98, detailed RC-PACK/B5-BUD/B7-BUD",
 legacyScopeUrl:"https://docs.google.com/spreadsheets/d/1KSfxvPfgS8XcvwaQUeacmgdX32yobwVk/edit",
 sourceType:"HISTORICAL_INTERNAL_PRICE_SNAPSHOT__NOT_DIRECT_COST_APPROVAL",
 rateFormula:"P_legacy = SourceDirect × 1.20 / 0.95 (historical policy only)",
 sourceCurrency:"THB",
 immutableWorkingWbsB5SellTHB:null,
 lines:Object.freeze([
  Object.freeze({id:"RC-PACK",description:"RACON OEM sea packing (MDS/BOQ row45)",count:3,unit:"ea",sourceUnitCostTHB:62118,
   originalCostTHB:186354,historicalSellTHB:235394.52631578947,
   costBucket:"B5",sourceState:"LEGACY_SUPPLIER_QUOTE_REFERENCE__LATEST_QUOTE_AND_3_UNIT_SCOPE_PENDING",
   note:"MDS p2 / BOQ row45; do not confuse RC-PACK 3 supplier packages with total 4-MR crate takeoff; do not duplicate Part A included sea packing"}),
  Object.freeze({id:"B5-BUD",description:"Other export packing and marking allowance",count:4,unit:"system lot",sourceUnitCostTHB:15000,
   originalCostTHB:60000,historicalSellTHB:75789.47368421053,
   costBucket:"B5",sourceState:"ESTIMATOR_ASSUMPTION_NOT_VENDOR_QUOTATION",
   note:"Flat THB15,000/system allowance in Rev09, NOT measured box, crate, IPPC, BKK repack or confirmed excluded OEM scope"}),
  Object.freeze({id:"B7-BUD",description:"90-day storage provision originally allocated into B5",count:3,unit:"month",sourceUnitCostTHB:10000,
   originalCostTHB:30000,historicalSellTHB:37894.73684210527,
   costBucket:"B7_STORAGE_EMBEDDED_IN_LEGACY_B5",
   sourceState:"ESTIMATOR_ASSUMPTION__LEGACY_B5_INCLUDED_STORAGE",
   note:"NOT intrinsic packing B5; under new Cost Owner B7 must be reconciled net included vendor storage; no automatic separate current B7 charge"})
 ])
});
export function selectBcB5HistoricalPriceBridge0553(){
 const r=B5_LEGACY_PRICE_SOURCE_0553;
 const direct=r.lines.reduce((s,x)=>s+x.originalCostTHB,0);
 const oldSell=round(r.lines.reduce((s,x)=>s+x.historicalSellTHB,0));
 const implied=round(direct*LEGACY_SELL_FACTOR_0553);
 const packing=r.lines.filter(x=>x.costBucket==="B5");
 const packingDirect=packing.reduce((s,x)=>s+x.originalCostTHB,0);
 const packingSell=round(packing.reduce((s,x)=>s+x.historicalSellTHB,0));
 const storage=r.lines.find(x=>x.id==="B7-BUD");
 const storageSell=round(storage.historicalSellTHB);
 if(direct!==276354||oldSell!==349078.74||implied!==oldSell||packingDirect!==246354||
  packingSell!==311184||storageSell!==37894.74||round(packingSell+storageSell)!==oldSell)
  throw Error("B5 historical bridge diverged from Rev09 source or incorrectly retained B7 storage");
 return Object.freeze({
  moduleId:r.moduleId,sourceUrl:r.sourceUrl,sourceRevision:r.sourceRevision,
  legacyScopeUrl:r.legacyScopeUrl,
  currency:"THB",priceClass:"HISTORICAL_SELL_REFERENCE_ONLY_NOT_CURRENT",
  sourceLineCount:r.lines.length,sourceLines:r.lines,
  originalB5DirectCostProxyTHB:direct, // Historical workbook labelled input costs; NOT verified current Direct Cost.
  originalB5HistoricalSellTHB:oldSell,
  originalB5PackingOnlySellTHB:packingSell,
  originalB5EmbeddedStorageSellTHB:storageSell,
  originalB5PackingOnlyHistoricalCostProxyTHB:packingDirect,
  originalEmbeddedStorageHistoricalCostProxyTHB:storage.originalCostTHB,
  scenarioReferenceOnly:true,independentCurrentB5DirectCostTHB:null,
  currentB5WorkingSellTHB:null,customerB5PriceTHB:null,postToPricing:false,
  caveats:Object.freeze([
   "THB349,078.74 = historical Rev09 total B5, includes B7 storage THB37,894.74",
   "THB311,184.00 = historic packing-only portion of same older model, NOT validated current Working SELL",
   "RC-PACK THB235,394.53 sell / THB186,354 input proxy from MDS RACON 3 packs; current quotation, OEM included credit and Thailand FAT re-packing unresolved",
   "B5-BUD THB75,789.47 sell / THB60,000 input proxy assumes 4 system lots × THB15,000, not actual physical crate quantity",
   "Do not add legacy storage to new B7 until vendor inclusion and storage responsibility confirmed",
   "Current source B5 Working SELL and Direct Cost remain NOT ESTABLISHED"
  ]),
  reconciliationState:"HISTORICAL_SOURCE_RECONCILED__CURRENT_PRICE_OPEN"
 });
}
