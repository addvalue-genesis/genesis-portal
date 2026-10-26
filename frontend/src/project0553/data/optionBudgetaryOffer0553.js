// PJ2608-0553 — MANAGEMENT-REQUESTED conditional priced Part C options.
// This is the one authoritative budgetary OPTION BID basis, independent from
// the unverified OEM direct-COST posting ledger and the base A+B quotation.
// User requested explicitly on 26-Oct-2026: "ต้องให้เสนอราคามาเลย".
import {selectSparePricedBudgetReview0553} from "./sparePricedBudgetReview0553";
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
