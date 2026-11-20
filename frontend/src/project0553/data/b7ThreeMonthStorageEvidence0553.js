// 10.2 B7 — customer original 3 MONTHS FREE storage at vendor workshop.
// Neither SERV-1..5 nor commercial MGW P26-058_R2 cover quotes a storage fee
// or explicitly promises included three-month storage. Inclusion must be asked.
// Public China 2026 standard pallet market benchmarks ≠ specialized MGW workshop price.
// Existing 10.2 selected Working SELL 30000 for 1-month conditional allowance is
// preserved; 3-month sensitivity is NONPOSTING, NOT another invoice.
import {MGW_R2_COVER_20261020_0553 as quote} from "./mgwP26058R2Cover20261020";
const round=v=>Math.round((v+Number.EPSILON)*100)/100;
export function selectB7ThreeMonthStorageEvidence0553(){
 const sourceServices=quote.services.map(x=>x.id);
 if(sourceServices.some(x=>/storage/i.test(x))||sourceServices.length!==5)
  throw Error("B7 storage supplier evidence needs review after MGW quote revision");
 const cnyToThbReference=5.03;
 const qtyScenario=4,days=90,marketLowCnyPalletDay=2.5,marketHighCnyPalletDay=4.5;
 const low=round(qtyScenario*days*marketLowCnyPalletDay*cnyToThbReference);
 const high=round(qtyScenario*days*marketHighCnyPalletDay*cnyToThbReference);
 if(low!==4527||high!==8148.6)throw Error("B7 public pallet reference reconciliation failed");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b7",
  sourceId:"B7-MGW-STORAGE-3MO-EVIDENCE-SC-20261021",
  sourceMGWQuote:quote.sourceUrl,
  vendorStorageLinePresent:false,
  vendorThreeMonthsFreeStorageConfirmed:false,
  originalCustomerScope:"3 months Free Storage in Vendor’s Workshop",
  customerRequiredFreeMonths:3,
  currentSelectedOneMonthWorkingSellTHB:30000,
  currentlySelectedReserveMonths:1,
  illustrativeFullThreeMonthManagementAllowanceTHB:90000,
  illustrativeAdditionalTwoMonthsTHB:60000,
  referencePalletQty:qtyScenario,
  palletCountVerified:false,referenceDays:days,
  publicCnyRateLow:marketLowCnyPalletDay,publicCnyRateHigh:marketHighCnyPalletDay,
  currencySourceDate:"2026-10-21",cnyToThbReference,
  marketThreeMonthBarePalletTHBLow:low,marketThreeMonthBarePalletTHBHigh:high,
  marketCostExcludes:"handling, minimum monthly workshop charges, insurance, preserved Ex electronics protection, electricity, VAT and dangerous goods restrictions",
  referenceSourceUrls:Object.freeze([
   "https://www.ittx.com.cn/article/third-party-warehouse-storage-fee-calculation-bms.html",
   "https://wise.com/us/currency-converter/cny-to-thb-rate/history"
  ]),
  recommendedPolicy:"Ask MGW for written 3-month free storage inclusion at Nantong. Maintain current 30k selected until supplier confirmation; three-month 90k sensitivity is nonposting and should NOT replace it automatically.",
  quoteAdditionalStorageDirectCostTHB:null,verifiedDirectCostTHB:null,
  additionalSelectedWorkingSellTHB:null,
  postingAllowed:false,releaseAllowed:false
 });
}
