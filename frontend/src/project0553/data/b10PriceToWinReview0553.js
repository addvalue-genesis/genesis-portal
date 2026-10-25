// PJ2608-0553 / B10 Price-to-Win PROPOSAL REVIEW ONLY.
// No change to canonical Working SELL, Release authority or native Excel.
// Source: NextG D/E quoted spare-accessory rows + remaining current B10 MR
// parametric COST envelopes. Those envelopes are NOT verified OEM SKU costs.
// Each supplier source line and every residual MR is counted at most once.
import {selectB10ItemizedPurchaseEvidence0553} from "./b10ItemizedPurchaseEvidence0553";
import {OFFICIAL_USD_POLICY_0553,quoteUsd0553} from "./officialUsdRelease0553";

const freeze=Object.freeze, round2=n=>Math.round((n+Number.EPSILON)*100)/100;
const n=x=>Number.isFinite(x);
const named=freeze([
 freeze({id:"RETAIL-MR2-POLYPHASER-20261025",mr:"MR-0002",name:"RF surge protector",brand:"PolyPhaser",partNo:"IS-B50LN-C2",quantity:null,usdUnit:118.17,thbUnit:null,
  source:"Richardson RFPD online unit-price listing (retail)",url:"https://shop.richardsonrfpd.com/Products/Product/IS-B50LN-C2",
  relevance:"Exact model appears in MGW UHF-2 included installed RF package; independent spare Ex rating, available quantity and interconnection must be verified",
  owner:"B10_RESEARCH_NONPOSTING",quoteType:"PUBLIC_RETAIL_INDICATIVE__NO_STOCK_AT_DISTRIBUTOR",additionalCostUSD:0}),
 freeze({id:"RETAIL-MR2-HAWKE-20261025",mr:"MR-0002",name:"Ex M20 armoured gland",brand:"Hawke",partNo:"501/453/UNIV/A/M20/NP/KIT",quantity:null,usdUnit:null,thbUnit:2002.09,
  source:"RS Thailand online listing (ex VAT)",url:"https://th.rs-online.com/web/p/cable-glands/0716022",
  relevance:"Comparable Ex M20 gland only; exact cable outside diameter, certified installation, selected OEM part variant and included gland count not proven",
  owner:"B10_RESEARCH_NONPOSTING",quoteType:"PUBLIC_RETAIL_COMPARABLE__NOT_INSTALLED_SKU_PROVEN",additionalCostUSD:0}),
 freeze({id:"RETAIL-MR3-EATON-20261025",mr:"MR-0003",name:"Ex sounder — different variant",brand:"Eaton",partNo:"DB3BDGD048N2BPNR",quantity:null,usdUnit:null,thbUnit:56108.77,
  source:"RS Thailand online listing (ex VAT)",url:"https://th.rs-online.com/web/p/electronic-sounders/2299717",
  relevance:"Different suffix from EXION DB3BDG048N2BNR. Evidence of price order-of-magnitude ONLY, not interchangeable and not an approved B10 spare.",
  owner:"B10_RESEARCH_NONPOSTING",quoteType:"DIFFERENT_SKU_COMPARABLE__DO_NOT_SELECT",additionalCostUSD:0})
]);
const marketPriceComparables=freeze(named);
function costForKit(row){
 if(!n(row.internalParametricUnitCostUSD)||!Number.isInteger(row.qty)||row.qty<=0)
  throw Error("B10 selected source parametric cost/kit missing: "+row.id);
 return round2(row.qty*row.internalParametricUnitCostUSD);
}
export function selectB10PriceToWinReview0553({targetGrossProfitOfSellPct=20,riskCostPct=5,samtelSellDeductionPct=5,includeNorthAmericanCord=false,includeWholeRadio=false}={}){
 for(const [k,v] of Object.entries({targetGrossProfitOfSellPct,riskCostPct,samtelSellDeductionPct}))
  if(!n(v)||v<0||v>=100)throw Error("Invalid proposal review assumption "+k);
 const denom=1-(targetGrossProfitOfSellPct+samtelSellDeductionPct)/100;
 if(denom<=0)throw Error("Impossible B10 target profit / SAMTEL allocation");
 const multiplier=(1+riskCostPct/100)/denom;
 const b10=selectB10ItemizedPurchaseEvidence0553();
 const entries=b10.budgetEnvelopeRows;
 if(entries.length!==4||b10.originalB10WorkingSellTHB!==509827.5)throw Error("Current B10 policy baseline changed");
 // B10 source cost assumptions are persisted in existing spareCustomerSchedule.
 // The single MR1 historical parametric envelope is *replaced* by NextG
 // accessory scenario, not added on top. MR2-4 remain a shared UNITEMIZED
 // budget reserve; no one may present their amounts as per-SKU quotations.
 const sourceCosts=b10.budgetEnvelopeRows.map(x=>({
  ...x,parametricUnitCostUSD:round2(x.workingUnitSellTHB/(31.5*1.30))
 }));
 const priorByMr=new Map(sourceCosts.map(x=>[x.mr,round2(x.contractKitCount*x.parametricUnitCostUSD)]));
 if(priorByMr.get("MR-0001")!==5600||priorByMr.get("MR-0002")!==2100||
  priorByMr.get("MR-0003")!==2200||priorByMr.get("MR-0004")!==2550)
  throw Error("B10 source parametric input/rate checkpoint changed");
 const accessories=b10.supplierRows.filter(x=>x.sourceGroup==="D"||x.sourceGroup==="E")
  .filter(x=>x.articleClass.startsWith("RF_FILTER__")||
    x.articleClass.startsWith("POWER_INJECTOR__")||
    (includeNorthAmericanCord&&x.articleClass.startsWith("POWER_CORD__")));
 const radios=includeWholeRadio?b10.supplierRows.filter(x=>x.articleClass.startsWith("RADIO_ASSEMBLY__")):[];
 const distinct=new Set();
 const selected=[...accessories,...radios].map(x=>{
  if(distinct.has(x.id))throw Error("Duplicate B10 supplier line "+x.id);
  distinct.add(x.id);
  if(!n(x.quotedUnitPriceUSD)||!n(x.quotedExtendedUSD)||!Number.isInteger(x.vendorOfferedQty))
   throw Error("Unpriced or invalid NextG source cannot enter scenario "+x.id);
  return freeze({
   id:x.id,sourceQuoteLine:x.sourceQuoteLine,sku:x.proposedSku,description:x.articleDescription,
   quotedOfferedQty:x.vendorOfferedQty,scenarioQty:x.vendorOfferedQty,
   scenarioQtyAuthority:"WHAT_IF_ASSUMES_ORIGINAL_VENDOR_OFFER_QTY__NOT_APPROVED_PURCHASE_QTY",
   estimatedUnitCostUSD:x.quotedUnitPriceUSD,estimatedLineCostUSD:x.quotedExtendedUSD,
   indicativeUnitSellUSD:Math.round(x.quotedUnitPriceUSD*multiplier*10000)/10000,
   indicativeLineSellUSD:round2(x.quotedExtendedUSD*multiplier),
   originalSupplierEvidenceStatus:x.status,addedToBase:false,
   exactSkuInNextGQuote:true,installedSiteTagCompatible:false,
   distinctStockOwner:"B10_REVIEW_ONLY",noSupplierRefresh:true,customerReleaseAllowed:false
  });
 });
 const mr1QuoteCostUSD=round2(selected.reduce((s,r)=>s+r.estimatedLineCostUSD,0));
 const residual=freeze(["MR-0002","MR-0003","MR-0004"].map(mr=>freeze({
  mr,sourceOwner:entries.find(x=>x.mr===mr)?.id,
  subtotalCostUSD:priorByMr.get(mr),
  basis:"LEGACY_CURRENT_2026_PARAMETRIC_COST_ENVELOPE__NOT_OEM_PURCHASABLE_SKU",
  skuItemized:false,qtyVerified:false,rateVerified:false,
  additiveToCurrentBase:false
 })));
 const residualUSD=round2(residual.reduce((s,r)=>s+r.subtotalCostUSD,0));
 const costUSD=round2(mr1QuoteCostUSD+residualUSD);
 const sellBeforeUsdRoundUSD=round2(costUSD*multiplier);
 const sellBeforeUsdRoundTHB=round2(costUSD*OFFICIAL_USD_POLICY_0553.thbPerUsd*multiplier);
 const proposedMainOfficialUSD=quoteUsd0553(sellBeforeUsdRoundTHB,OFFICIAL_USD_POLICY_0553);
 const originalOfficialUSD=quoteUsd0553(b10.originalB10WorkingSellTHB,OFFICIAL_USD_POLICY_0553);
 const originalSourceUSD=round2([...priorByMr.values()].reduce((s,v)=>s+v,0));
 const sourceCreditUSD=priorByMr.get("MR-0001");
 const sourceScenarioReconciled=round2(originalSourceUSD-sourceCreditUSD+mr1QuoteCostUSD)===costUSD;
 const assumptions=freeze({riskCostPct,samtelSellDeductionPct,targetGrossProfitOfSellPct,
  targetProfitAfterRiskAndSamtelPct:targetGrossProfitOfSellPct,
  multiplier:Math.round(multiplier*1000000)/1000000,
  includeNorthAmericanCord,includeWholeRadio,workingFxTHBPerUSD:OFFICIAL_USD_POLICY_0553.thbPerUsd,
  scenarioQtyAuthority:"D/E offered quantities only; no B10 physical required SPIR qty was invented"});
 return freeze({
  moduleId:"bid.budget.working.bc.b10.price-to-win-review",
  parentOwner:"B10",sourceModuleId:b10.moduleId,
  sourceStatus:"INTERNAL_EXPIRED_VENDOR_QUOTE_PLUS_UNITEMIZED_PARAMETRIC_ENVELOPES",
  selectedSourceQuoteLines:freeze(selected),otherMrCostEnvelopes:residual,
  marketPriceComparables,
  trace:{originalParametricCostUSD:originalSourceUSD,creditSupersededMr1USD:sourceCreditUSD,
    replacementQuotedAccessoryCostUSD:mr1QuoteCostUSD,remainingCostMr234USD:residualUSD,
    sourceScenarioReconciled,overlapOwnerCounts:{B10:1,A1:0,B5:0,B6:0,B11:0,C1:0,C2:0}},
  scenario:{sourceCostUSD:costUSD,sourceCostTHB:round2(costUSD*31.5),
   riskCostUSD:round2(costUSD*riskCostPct/100),
   sellBeforeUsdRoundUSD,sellBeforeUsdRoundTHB,roundedOfficialSummaryUSD:proposedMainOfficialUSD,
   existingWorkingSellTHB:b10.originalB10WorkingSellTHB,existingOfficialSummaryUSD:originalOfficialUSD,
   proposedVsExistingTHB:round2(sellBeforeUsdRoundTHB-b10.originalB10WorkingSellTHB),
   proposedVsExistingOfficialUSD:proposedMainOfficialUSD-originalOfficialUSD},
  assumptions,releaseAllowed:false,postedToWorking:false,postedToOfficial:false,
  pricesDoNotIncludeReconfirmedOEMPO:false,
  sourceQtyComplete:false,sourceUnitPricesComplete:false,installedSkuCompatibilityComplete:false,
  readiness:"NOT_CUSTOMER_ISSUABLE__ITEMIZED_REQUIRED_SPARES_UNCLOSED",
  gapSummary:"Four MR1 hardware-quote lines are priced but cannot establish 4 platform kit contents. MR2-MR4 are parametric cost envelopes, not itemized cost. B5/B6 freight/insurance remain separate; validity and selected stock quantities not evidenced."
 });
}
export const B10_PRICE_TO_WIN_MARKET_COMPARABLES_0553=marketPriceComparables;
