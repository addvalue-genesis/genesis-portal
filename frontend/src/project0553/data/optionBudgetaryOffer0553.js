// PJ2608-0553 — MANAGEMENT-REQUESTED conditional priced Part C options.
// This is the one authoritative budgetary OPTION BID basis, independent from
// the unverified OEM direct-COST posting ledger and the base A+B quotation.
// User requested explicitly on 26-Oct-2026: "ต้องให้เสนอราคามาเลย".
import {selectSparePricedBudgetReview0553} from "./sparePricedBudgetReview0553";
import {selectMGWR2Selected0553} from "./mgwP26058R2Selected0553";
const freeze=Object.freeze;
const round2=n=>Math.round((n+Number.EPSILON)*100)/100;
export const OPTION_BUDGETARY_QUOTE_POLICY_0553=freeze({
 fxTHBPerUSD:31.5,summaryRoundingUSD:100,
 basis:"OWNER_SELECTED_CONDITIONAL_BUDGETARY_OFFER_2026_10_26",
 authority:"MANAGEMENT_BUDGETARY_OPTION_FOR_PRICE_SUBMISSION",
 incorporatedInBase:false,firmOemOffer:false
});
export function selectOptionBudgetaryOffer0553(){
 const review=selectSparePricedBudgetReview0553();
 const feeder=selectMGWR2Selected0553("UHF-4");
 if(!feeder||!feeder.model.includes('1/2"')||!feeder.includedComponents.some(x=>x.includes('50-ohm')))
  throw Error("C2 feeder substitution must be reconciled to the selected MGW UHF-4 evidence");
 const sources=freeze({
  C1:freeze({thb:review.totals.C1,
   evidence:"MDS/ORGA installed RACON FCA USD75000 × FX31.5 × previous 1.30 working sell scenario; not OEM standalone capital spare price",
   sourceModuleId:"bid.budget.working.bc.c1.spare-line.c1-pttep-01",
   sourceId:"C1-PTTEP-01",technicalGate:"Confirm independent OEM capital spare variant, Ex compatibility, accessories, CIF uplift and offered stock count"}),
  C2:freeze({thb:review.totals.C2,
   evidence:"12 Rev08 Two-Year Spare references repriced only by existing FX31.5; 7/8-inch feeder not the current selected feeder and B10 shared-function duplicates OPEN",
   sourceModuleId:"bid.budget.working.bc.c2",sourceId:"C2-OPTION-REV08-12",
   technicalGate:"Replace incompatible feeder with technically compliant current OEM SKU, exclude proven B10 duplicate stock, verify two-year quantities and rates"})
 });
 const offers=Object.fromEntries(Object.entries(sources).map(([code,r])=>{
  const thb=round2(r.thb),usd=Math.ceil(thb/OPTION_BUDGETARY_QUOTE_POLICY_0553.fxTHBPerUSD/
   OPTION_BUDGETARY_QUOTE_POLICY_0553.summaryRoundingUSD-1e-10)*
   OPTION_BUDGETARY_QUOTE_POLICY_0553.summaryRoundingUSD;
  return [code,freeze({...r,code,sourceSellTHB:thb,
   // A separate offer projection preserves every historical/current source ID.
   // Technical substitution changes the proposal wording, never the source rate.
   rows:freeze(review.rows[code].map(x=>freeze({...x,
    historicalSourceId:code==="C2"?x.id:null,
    description:/7\/8-inch RF cable/i.test(x.description)?
     "RF feeder service cable — "+feeder.model+" (m)":x.description,
    specification:code==="C1"?
     "Complete marine RACON spare assembly; independent OEM configuration and CIF quote subject to confirmation.":
     /7\/8-inch RF cable/i.test(x.description)?
      "1/2-inch, 50-ohm RF feeder to match selected MGW UHF-4 ("+feeder.manufacturer+"); exact OEM SKU, connectors and service length subject to approval. Historical rate retained as budget only.":
      "Two-year operating spare compatible with installed equipment; OEM SKU/quantity and exclusion of B10 identical stock subject to confirmation.",
    technicalSourceId:/7\/8-inch RF cable/i.test(x.description)?feeder.id:null,
    technicalSourceUrl:/7\/8-inch RF cable/i.test(x.description)?feeder.source:null,
    materials:code==="C1"?"Marine-certified beacon and compatible service accessories":
     "OEM replacement component or compatible service material"
   }))),
   budgetaryQuoteUSD:usd,priceState:"CONDITIONAL_BUDGETARY_OFFER",quotePrepared:true,
   includedInAPlusB:false,customerAccepted:false,supplierOemConfirmed:false,
   subjectToExclusionAndSubstitution:true,offeredQty:1,unit:"LOT"})];
 }));
 if(offers.C1.sourceSellTHB!==3071250||offers.C2.sourceSellTHB!==721806.6||
  offers.C1.budgetaryQuoteUSD!==97500||offers.C2.budgetaryQuoteUSD!==23000)
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
