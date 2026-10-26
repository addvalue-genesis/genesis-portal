// PJ2608-0553 / B3.1 / MGW P26-058_R2 20-Oct 2026 quotation
// Owner correction 24-Oct: MGW supplies equipment ONLY; service history is nonposting.
// This source amount is a quoted supplier price (not paid invoice/verified cost).
// Working SELL markup based on Purchased-Service tariff 20% SAMTEL + 5% ADDVALUE
// + 5% omission reserve applied to vendor quotation THB, additive markups on COST.
// Separate from the standard Part B SAMTEL 5% deduction; NEVER apply both.
import {MGW_R2_COVER_20261020_0553 as cover} from "./mgwP26058R2Cover20261020";
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
export const B3_MGW_PURCHASED_FAT_POLICY_0553=Object.freeze({
 id:"P553-B3-PURCHASED-SERVICES-R01",
 costBasis:"MGW_P26_058_R2_VENDOR_QUOTATION_NOT_INVOICE",
 executionLocation:"NOT_SELECTED__EQUIPMENT_SUPPLIER_ONLY",
 invoiceCurrency:"USD",workingFXTHBPerUSD:31.5,
 samTelCostMarkupPct:20,addvalueCostMarkupPct:5,omissionReserveCostMarkupPct:5,
 workingSellCostFactor:1.30,
 bStandardFivePctDeductionOnPurchasedComponentAllowed:false,
 serviceIds:Object.freeze(["SERV-2","SERV-4"]),
 scopeOwner:"SOW-B3",internalWorkingSellId:"WS-B3",
 customerProposalLineId:"CP-B3",customerProposalIssued:false,
 partAOwnerOverlapVerified:false,
 noDoubleCountRule:"MGW SERV-2/4 are withdrawn and excluded from all current service totals. Raw quote history is not a supplier award.",
 sourceUrl:cover.sourceUrl,sourceQuoteNumber:cover.quoteNumber,
 customerReleaseAllowed:false
});
export function selectB3MgwPurchasedFatWorkingSell0553(){
 const policy=B3_MGW_PURCHASED_FAT_POLICY_0553;
 const historicalQuoteLines=policy.serviceIds.map(id=>{
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
 const quoteLines=Object.freeze([]);
 const usd=round(historicalQuoteLines.reduce((n,x)=>n+x.quotedAmountUSD,0));
 const vendorCost=round(historicalQuoteLines.reduce((n,x)=>n+x.quotedCostTHB,0));
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
  identity:"IC-FAT-MGW-SERV-2-4",quoteClass:"WITHDRAWN_SERVICES__MGW_EQUIPMENT_SUPPLY_ONLY",
  selectedSupplierPurchase:false, confirmedMGWCreditTHB:null,
  reserveReason:"Owner correction: MGW supplies MR0002 equipment only. No MGW integration, FAT, facility purchase or reserve.",
  sourceAmountVerifiedFromVendorQuote:false, historicalSourceAmountVerifiedFromVendorQuote:true,
  verifiedDirectCostTHB:null,
  sourceVendorQuoteTotalUSD:cover.overallTotalUSD,
  sourceVendorQuoteServicesUSD:cover.serviceTotalUSD,
  quoteLines,policy,
  historicalQuoteLines:Object.freeze(historicalQuoteLines),
  historicalWithdrawnWorkingSellTHB:sell,
  vendorPurchasedQuoteUSD:0,
  vendorPurchasedQuoteTHB:0,
  samTelMarkupTHB:0,
  addvalueMarkupTHB:0,
  omissionReserveTHB:0,
  selectedIncrementalWorkingSellTHB:0,
  includedInB3WorkingSell:false,
  workingSellStatus:"WITHDRAWN_NONPOSTING__NO_MGW_FAT_SERVICE",
  customerReleaseAllowed:false,
  partADuplicationCheckState:"OPEN_VERIFY_A_EQUIPMENT_ONLY__COVER_SAME_VENDOR_QUOTATION",
  noDoubleCountRule:policy.noDoubleCountRule,
  noAutomaticPaidDirectCostPosting:true
 });
}
