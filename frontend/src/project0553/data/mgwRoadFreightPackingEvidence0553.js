// PJ2608-0553: new WhatsApp / navigation screenshot from MGW 20-Oct-2026.
// SOURCE VERBATIM: "2500 usd road transport to Jutal site include packing",
// "Nantong to Jutal". Treat as clarified supplier scope, not signed new pricing.
// Navigation is indicative driving-car route, not certified transport/logistics quote.
import {MGW_R2_COVER_20261020_0553 as cover} from "./mgwP26058R2Cover20261020";
const quotedPacking=cover.services.find(x=>x.id==="SERV-3");
const quotedFreight=cover.services.find(x=>x.id==="SERV-5");
if(!quotedPacking||!quotedFreight)throw Error("MGW new packing/freight evidence requires 20-Oct cover");
export const MGW_ROAD_FREIGHT_PACKING_EVIDENCE_0553=Object.freeze({
 id:"MGW-ROAD-FREIGHT-PACKING-20261020",
 sourceClass:"MGW_WHATSAPP_MESSAGE_AND_CHINESE_NAVIGATION_SCREENSHOTS",
 receivedDate:"2026-10-20",
 quoteRef:cover.id,quoteUrl:cover.sourceUrl,
 messageTimeShown:"16:53 / 16:54; map shared 16:57, timezone not verified",
 originalStatements:Object.freeze([
  "2500 usd road transport to Jutal site include packing",
  "Nantong to Jutal"
 ]),
 deliveryOriginText:"Nantong (supplier message)",
 mapDestinationCompanyChinese:"珠海巨涛海洋石油服务有限公司",
 destinationWorkingInterpretation:"Zhuhai Jutal Offshore Oil Services Co., Ltd.",
 destinationType:"DESTINATION_COMPANY_IDENTIFIED__EXACT_GATE_AND_DELIVERY_TERMS_OPEN",
 navigationMap:Object.freeze({
  routeDistanceKmIndicative:1639,
  drivingTimeDisplay:"17h47m",
  routeTollCNYDisplay:826,
  alternateDistanceKmIndicative:1650,
  routeType:"CONSUMER_DRIVING_NAVIGATION__NOT_TRUCK_LOGISTICS_AUTHORITY",
  roadFreightTripCountVerified:null,
  tractorTrailerTollCNYVerified:null,
  transitTimeForCargoVerified:null,
  routeRiskAndPermitsVerified:false
 }),
 coverPackingUSD:quotedPacking.usd,
 coverFreightUSD:quotedFreight.usd,
 supplierMessageRoadFreightUSD:2500,
 supplierConfirmsRoadFreightIncludesPacking:true,
 packagingOverlapStatus:"COVER_PACKING_USD500_VS_CHAT_FREIGHT_INCLUDES_PACKING__RECONCILE",
 possibleOverlapUSD:quotedPacking.usd,
 confirmedCreditUSD:null,
 vendorQuoteTotalUSD:cover.overallTotalUSD,
 adjustedSupplierTotalUSD:null,
 quotedSupplierTotalUnchanged:true,
 confirmedNoExtraRoadFreightBeyondCover:true,
 supplierWrittenRevisedPackingPriceReceived:false,
 freightCostOwner:"B6",
 packingCostOwner:"B5",
 moduleIds:Object.freeze({
  B5:"bid.budget.working.bc.b5.mgw-road-freight-packing-inclusion",
  B6:"bid.budget.working.bc.b6.mgw-road-freight-packing-inclusion"
 }),
 unresolved:Object.freeze([
  "Ask MGW whether cover SERV-3 USD500 packing is a DUPLICATE of the packing included in SERV-5 USD2500 or a DIFFERENT export/marking service",
  "Ask MGW to clarify whether USD2500 includes complete shipment export-grade packing, marking, loading, road freight, insurance and unloading",
  "Identify exact JUTAL Zhuhai yard delivery gate and Incoterm named place; Oct20 Cover still says DAP Nantong",
  "Confirm truck/vehicle type, total cargo, loading constraints, road carriage schedule and document handling",
  "Confirm customs/export formalities, China-to-Myanmar onward shipping, taxes/duties, and buyer/supplier financial owner"
 ]),
 directCostPostingAllowed:false,
 b5WorkingSellOverrideAllowed:false,
 b6WorkingSellOverrideAllowed:false,
 approvedCostBaselineChangeAllowed:false,
 customerReleaseAllowed:false
});
const x=MGW_ROAD_FREIGHT_PACKING_EVIDENCE_0553;
if(x.coverFreightUSD!==2500||x.coverPackingUSD!==500||
 x.supplierMessageRoadFreightUSD!==x.coverFreightUSD||
 x.vendorQuoteTotalUSD!==368841||
 x.confirmedCreditUSD!==null||
 x.directCostPostingAllowed||x.b5WorkingSellOverrideAllowed||x.b6WorkingSellOverrideAllowed)
 throw Error("MGW freight/packing must reconcile to quoted USD2500/500 without speculative credit");
