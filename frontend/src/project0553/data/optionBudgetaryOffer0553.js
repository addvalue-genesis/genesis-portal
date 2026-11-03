import {selectC2CustomerSchedule0553} from "./c2CustomerSchedule0553";
// PJ2608-0553 — MANAGEMENT-REQUESTED conditional priced Part C options.
// This is the one authoritative budgetary OPTION BID basis, independent from
// the unverified OEM direct-COST posting ledger and the base A+B quotation.
// User requested explicitly on 26-Oct-2026: "ต้องให้เสนอราคามาเลย".
import {selectSparePricedBudgetReview0553} from "./sparePricedBudgetReview0553";
import {selectMGWR2Selected0553} from "./mgwP26058R2Selected0553";
import {selectC1SiTagBudget0553,roundAnnexUnitPrices0553} from "./c1SiTagBudget0553";
const freeze=Object.freeze;
const round2=n=>Math.round((n+Number.EPSILON)*100)/100;
export const OPTION_BUDGETARY_QUOTE_POLICY_0553=freeze({
 fxTHBPerUSD:31.5,summaryRoundingUSD:100,
 basis:"OWNER_SELECTED_CONDITIONAL_BUDGETARY_OFFER_2026_10_26",
 authority:"MANAGEMENT_BUDGETARY_OPTION_FOR_PRICE_SUBMISSION",
 incorporatedInBase:false,firmOemOffer:false
});
// Owner 03-Nov-2026: no additional DB-5P operating spare in C2.
// Keep the historical reference and included Part A / C1 package scope intact.
export const C2_OWNER_STOCK_DECISION_0553=freeze({date:"2026-11-03",
 excludedHistoricalIds:freeze(["C2-REV08-07"]),
 authority:"OWNER_EXCLUDES_ADDITIONAL_DB5P_FROM_C2",
 reason:"Additional RACON DB-5P spare not required by owner. Included Part A and C1 package components remain included.",
 source:"Owner reply: ไม่ต้อง — additional DB-5P in C2"});
const round4=n=>Math.round((n+Number.EPSILON)*10000)/10000;
function allocateOptionByWeights(rows,totalUSD){
 const cents=Math.round(totalUSD*100),weights=rows.map(x=>x.extendedTHB);
 const base=weights.reduce((s,v)=>s+v,0);
 if(base<=0||weights.some(x=>!Number.isFinite(x)||x<=0))throw Error("0553 option reference rate unavailable");
 const raw=weights.map((v,i)=>{const exact=cents*v/base;return {i,cents:Math.floor(exact),frac:exact-Math.floor(exact)};});
 let remain=cents-raw.reduce((s,x)=>s+x.cents,0);
 for(const x of [...raw].sort((a,b)=>b.frac-a.frac||a.i-b.i).slice(0,remain))x.cents++;
 return rows.map((x,i)=>{
  const total=raw[i].cents/100,unit=round4(total/x.quantity);
  if(round2(unit*x.quantity)!==total)throw Error("0553 priced C2 Qty×Unit USD rounding mismatch "+x.id);
  return freeze({...x,qty:x.quantity,unitUSD:unit,totalUSD:total});
 });
}
export function selectOptionBudgetaryOffer0553(){
 const review=selectSparePricedBudgetReview0553();
 const selectedC1=selectC1SiTagBudget0553();
 const c2Technical=selectC2CustomerSchedule0553();
 const excludedC2=review.rows.C2.filter(x=>C2_OWNER_STOCK_DECISION_0553.excludedHistoricalIds.includes(x.id));
 const selectedC2=review.rows.C2.filter(x=>!C2_OWNER_STOCK_DECISION_0553.excludedHistoricalIds.includes(x.id));
 if(excludedC2.length!==1||selectedC2.length!==11)throw Error("C2 owner exclusion/source identities diverged");
 const selectedC2THB=round2(selectedC2.reduce((n,x)=>n+x.extendedTHB,0));
 const feeder=selectMGWR2Selected0553("UHF-4");
 if(!feeder||!feeder.model.includes('1/2"')||!feeder.includedComponents.some(x=>x.includes('50-ohm')))
  throw Error("C2 feeder substitution must be reconciled to the selected MGW UHF-4 evidence");
 const sources=freeze({
  C1:freeze({thb:round2(selectedC1.annexSubtotalUSD*31.5),
   rawSellTHB:selectedC1.budgetSellTHB,roundingTHB:round2(selectedC1.annexSubtotalUSD*31.5-selectedC1.budgetSellTHB),
   evidence:"Owner selected 2026-11-02: six C1 SI/TAG rows, existing release factor once, USD100 unit rounding reconciled to USD181100; prior RACON-only option retained in audit",
   sourceModuleId:"bid.budget.working.bc.c1.spare-line.c1-pttep-01",
   sourceId:"C1-PTTEP-01",technicalGate:"Confirm independent OEM capital spare variant, Ex compatibility, accessories, CIF uplift and offered stock count"}),
  C2:freeze({thb:selectedC2THB,historicalReferenceTHB:review.totals.C2,
   excludedRows:freeze(excludedC2),ownerStockDecision:C2_OWNER_STOCK_DECISION_0553,
   evidence:"11 selected operating-spare references at existing FX31.5; owner excludes additional DB-5P (C2-REV08-07), retained in history; 7/8-inch feeder not the current selected feeder and B10 shared-function duplicates OPEN",
   sourceModuleId:"bid.budget.working.bc.c2",sourceId:"C2-OPTION-REV08-12",
   technicalGate:"Replace incompatible feeder with technically compliant current OEM SKU, exclude proven B10 duplicate stock, verify two-year quantities and rates"})
 });
 const offers=Object.fromEntries(Object.entries(sources).map(([code,r])=>{
  const thb=round2(r.thb),usd=Math.ceil(thb/OPTION_BUDGETARY_QUOTE_POLICY_0553.fxTHBPerUSD/
   OPTION_BUDGETARY_QUOTE_POLICY_0553.summaryRoundingUSD-1e-10)*
   OPTION_BUDGETARY_QUOTE_POLICY_0553.summaryRoundingUSD;
  const offer={...r,code,sourceSellTHB:thb,
   // A separate offer projection preserves every historical/current source ID.
   // Technical substitution changes the proposal wording, never the source rate.
   rows:code==="C1"?freeze(selectedC1.annexRows.map(x=>freeze({...x,tag:x.tagNo,quantity:x.quantity,
    sourceId:r.sourceId,sourceRowModuleId:r.sourceModuleId,sourceSelectionId:x.id,
    traceId:"C1::"+r.sourceId,unitPriceTHB:round2(x.unitUSD*31.5),extendedTHB:round2(x.totalUSD*31.5),
    sourceDocument:r.evidence,leadTime:"To be confirmed"}))):freeze((code==="C2"?selectedC2:review.rows[code]).map(x=>freeze({...x,
    historicalSourceId:code==="C2"?x.id:null,
    description:/7\/8-inch RF cable/i.test(x.description)?
     "RF feeder service cable — "+feeder.model+" (m)":x.description,
    specification:code==="C1"?
     "Complete marine RACON spare assembly; independent OEM configuration and CIF quote subject to confirmation.":
     /7\/8-inch RF cable/i.test(x.description)?
      "1/2-inch, 50-ohm RF feeder to match selected MGW UHF-4 ("+feeder.manufacturer+"); exact OEM SKU, connectors and service length subject to approval.":
      "Two-year operating spare compatible with installed equipment; OEM SKU/quantity and exclusion of B10 identical stock subject to confirmation.",
    technicalSourceId:/7\/8-inch RF cable/i.test(x.description)?feeder.id:null,
    technicalSourceUrl:/7\/8-inch RF cable/i.test(x.description)?feeder.source:null,
    materials:code==="C1"?"Marine-certified beacon and compatible service accessories":
     "OEM replacement component or compatible service material",
    ...(code==="C2"?c2Technical[x.id]:{})
   }))),
   budgetaryQuoteUSD:usd,priceState:"CONDITIONAL_BUDGETARY_OFFER",quotePrepared:true,
   includedInAPlusB:false,customerAccepted:false,supplierOemConfirmed:false,
   subjectToExclusionAndSubstitution:true,offeredQty:1,unit:"LOT"};
  if(code==="C2"){
   const raw=allocateOptionByWeights(offer.rows,usd);
   offer.rows=roundAnnexUnitPrices0553(raw.map(x=>({...x,sourceTotalUSD:x.totalUSD})),usd,1,{residualMetric:"squared"});
   offer.unitRoundingUSD=1;offer.rawPriceRows=freeze(raw);
  }
  return [code,freeze(offer)];
 }));
 if(offers.C1.sourceSellTHB!==5704650||offers.C2.sourceSellTHB!==436595.65||
  offers.C1.budgetaryQuoteUSD!==181100||offers.C2.budgetaryQuoteUSD!==13900)
  throw Error("0553 chosen Part C Budgetary Sell source/FX/rounding changed");
 return freeze({
  moduleId:"bid.budget.working.bc.option-budgetary-offer",
  policy:OPTION_BUDGETARY_QUOTE_POLICY_0553,
  offers:freeze(offers),
  totalOptionalUSD:offers.C1.budgetaryQuoteUSD+offers.C2.budgetaryQuoteUSD,
  totalBaseDeltaUSD:0,
  quotePrepared:true,quoteIssued:false,technicallyFirm:false,
  notice:"CONDITIONAL BUDGETARY OFFER: priced C1 and C2 OPTIONS only. Subject to OEM technical approval, revised spare SKU/quantities, B10 physical stock exclusions, and accepted CIF Zhuhai terms. Not a confirmed OEM firm price."
 });
}
