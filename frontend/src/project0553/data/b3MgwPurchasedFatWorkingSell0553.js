// PJ2608-0553 / B3.1 / MGW P26-058_R2 20-Oct 2026 quotation
// User-selected CHINA FAT, ADDVALUE purchases MGW SERVICES item 3/4.
// This source amount is a quoted supplier price (not paid invoice/verified cost).
// Working SELL markup based on Purchased-Service tariff 20% SAMTEL + 5% ADDVALUE
// + 5% omission reserve applied to vendor quotation THB, additive markups on COST.
// Separate from the standard Part B SAMTEL 5% deduction; NEVER apply both.
import {MGW_R2_COVER_20261020_0553 as cover} from "./mgwP26058R2Cover20261020";
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
export const B3_MGW_PURCHASED_FAT_POLICY_0553=Object.freeze({
 id:"P553-B3-PURCHASED-SERVICES-R01",
 costBasis:"MGW_P26_058_R2_VENDOR_QUOTATION_NOT_INVOICE",
 executionLocation:"MGW Nantong China — management selected",
 invoiceCurrency:"USD",workingFXTHBPerUSD:31.5,
 samTelCostMarkupPct:20,addvalueCostMarkupPct:5,omissionReserveCostMarkupPct:5,
 workingSellCostFactor:1.30,
 bStandardFivePctDeductionOnPurchasedComponentAllowed:false,
 serviceIds:Object.freeze(["SERV-2","SERV-4"]),
 scopeOwner:"SOW-B3",internalWorkingSellId:"WS-B3",
 customerProposalLineId:"CP-B3",customerProposalIssued:false,
 partAOwnerOverlapVerified:false,
 noDoubleCountRule:"MGW Item3/4 purchased once through SOW-B3 FAT only; never add to A equipment, B1, B2, B5, B6 or B9 again",
 sourceUrl:cover.sourceUrl,sourceQuoteNumber:cover.quoteNumber,
 customerReleaseAllowed:false
});
export function selectB3MgwPurchasedFatWorkingSell0553(){
 const policy=B3_MGW_PURCHASED_FAT_POLICY_0553;
 const quoteLines=policy.serviceIds.map(id=>{
  const x=cover.services.find(row=>row.id===id);
  if(!x||!Number.isFinite(x.usd)||x.usd<=0)throw Error("Missing MGW iFAT/FAT Facility purchased-service quote "+id);
  return Object.freeze({
   serviceId:x.id,
   vendorQuoteId:"VQ-MGW-"+x.id,
   internalPurchasedCostActivityId:"IC-FAT-MGW-"+x.id,
   description:x.description,
   qty:1,unit:"supplier service LS",
   quotedUnitUSD:x.usd,quotedAmountUSD:x.usd,
   quotedCostTHB:round(x.usd*policy.workingFXTHBPerUSD),
   vendorQuoteSourceUrl:x.sourceUrl,
   verifiedPaidDirectCostTHB:null,
   customerReleaseAllowed:false
  });
 });
 const usd=round(quoteLines.reduce((n,x)=>n+x.quotedAmountUSD,0));
 const vendorCost=round(quoteLines.reduce((n,x)=>n+x.quotedCostTHB,0));
 const samtel=round(vendorCost*policy.samTelCostMarkupPct/100);
 const addvalue=round(vendorCost*policy.addvalueCostMarkupPct/100);
 const reserve=round(vendorCost*policy.omissionReserveCostMarkupPct/100);
 const sell=round(vendorCost+samtel+addvalue+reserve);
 if(cover.overallTotalUSD!==368841||cover.serviceTotalUSD!==18500||
   usd!==7500||vendorCost!==236250||samtel!==47250||addvalue!==11812.5||
   reserve!==11812.5||sell!==307125||
   policy.workingSellCostFactor!==1.30||policy.bStandardFivePctDeductionOnPurchasedComponentAllowed)
  throw Error("MGW FAT 20+5+5 source quote or commercial margin arithmetic diverged");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b3.mgw-r2-cover-20261020",
  workingModuleId:"bid.budget.working.bc.b3.fat",
  identity:"IC-FAT-MGW-SERV-2-4",quoteClass:"PURCHASED_MGW_SERVICE_QUOTATION_BASIS",
  sourceAmountVerifiedFromVendorQuote:true,
  verifiedDirectCostTHB:null,
  sourceVendorQuoteTotalUSD:cover.overallTotalUSD,
  sourceVendorQuoteServicesUSD:cover.serviceTotalUSD,
  quoteLines:Object.freeze(quoteLines),policy,
  vendorPurchasedQuoteUSD:usd,
  vendorPurchasedQuoteTHB:vendorCost,
  samTelMarkupTHB:samtel,
  addvalueMarkupTHB:addvalue,
  omissionReserveTHB:reserve,
  selectedIncrementalWorkingSellTHB:sell,
  includedInB3WorkingSell:true,
  workingSellStatus:"MANAGEMENT_SELECTED_B3_PURCHASED_FAT_PRE_AWARD__VENDOR_QUOTE_COST_UNPAID",
  customerReleaseAllowed:false,
  partADuplicationCheckState:"OPEN_VERIFY_A_EQUIPMENT_ONLY__COVER_SAME_VENDOR_QUOTATION",
  noDoubleCountRule:policy.noDoubleCountRule,
  noAutomaticPaidDirectCostPosting:true
 });
}
