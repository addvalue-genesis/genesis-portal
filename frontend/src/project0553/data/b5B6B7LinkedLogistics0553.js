// PJ2608-0553 — 10.2 B5/B6/B7 one physical logistics chain, three cost owners.
// Read-only source trace. It NEVER posts vendor quotes, guessed crates,
// storage fees, customs costs or historical estimate fragments to Working SELL.
// Route: ADR-68 (22-Oct-2026); original BKK integrated FAT route is superseded.
import {selectB6FourMrRoutingDecision0553} from "./b6FourMrRoutingDecision0553";
import {selectB6Mr0001ChinaInboundScenario0553} from "./b6Mr0001ChinaInboundScenario0553";
import {selectB7ThreeMonthStorageEvidence0553} from "./b7ThreeMonthStorageEvidence0553";
import {selectBcB5HistoricalPriceBridge0553} from "./bcB5HistoricalPriceBridge0553";
import {MGW_R2_COVER_20261020_0553 as MGW} from "./mgwP26058R2Cover20261020";
import {MGW_ROAD_FREIGHT_PACKING_EVIDENCE_0553 as road} from "./mgwRoadFreightPackingEvidence0553";
import {B5_SOURCE_URLS_0553 as documents} from "./bcB5PackingEvidence0553";

const freeze=Object.freeze;
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const fx=31.5; // Working preview planning assumption, NOT current BOT / actual invoice FX
const ROOT="bid.budget.working.bc";
const ADR="ADR-68-B6-MR0001-DIRECT-MGW-20261022";
const row=(code,id,stage,mr,cargoId,activity,sourceEquipmentQty,sourceEquipmentUnit,sourceUrl,status,extra={})=>freeze({
 code,id,stage,mr,cargoId,activity,sourceEquipmentQty,sourceEquipmentUnit,
 moduleId:ROOT+"."+code.toLowerCase()+".price-trace.work-scope."+id.toLowerCase(),
 physicalPackageQty:null, // Source equipment SET qty is NOT crate count.
 physicalPackageId:null,unitPackingOrFreightRateTHB:null,
 supplierQuoteUSD:null,supplierQuoteTHBReference:null,
 planningScenarioLowTHB:null,planningScenarioHighTHB:null,
 allocatedWorkingSellTHB:null,verifiedDirectCostTHB:null,
 postingAllowed:false,customerReleaseAllowed:false,
 sourceUrl,status,...extra
});
export function selectB5B6B7LinkedLogistics0553(){
 const route=selectB6FourMrRoutingDecision0553({selectedB6WorkingSellTHB:307584});
 const earlier=selectB6Mr0001ChinaInboundScenario0553();
 const storage=selectB7ThreeMonthStorageEvidence0553();
 const legacy=selectBcB5HistoricalPriceBridge0553();
 const quotePacking=MGW.services.find(x=>x.id==="SERV-3");
 const quoteFreight=MGW.services.find(x=>x.id==="SERV-5");
 const thaiPackReference=earlier.components.find(x=>x.id==="B6-MR1-IN-01");
 const leg=id=>route.sourceLegs.find(x=>x.id===id);
 if(route.approvedDecisionId!==ADR||route.ownerApprovedAntennaCount!==5||
  !route.siteAssembly.enclosureAndCiscoFourSetsFromThailandApproved||
  quotePacking?.usd!==500||quoteFreight?.usd!==2500||
  road.confirmedCreditUSD!==null||!road.supplierConfirmsRoadFreightIncludesPacking||
  thaiPackReference?.lowTHB!==6000||thaiPackReference?.highTHB!==12000||
  legacy.originalB5PackingOnlySellTHB!==311184||
  storage.currentSelectedOneMonthWorkingSellTHB!==30000)
  throw Error("B5/B6/B7 selected route, quote and historic/nonposting identity mismatch");
 const b5=[
  row("B5","TH-ENC-CISCO-PACK","TH-WORKSHOP","MR-0001","B6-MR1-TH-ENC-CISCO",
   "Thailand preassembled Enclosure + Cisco: preserve/pack for export to MGW",4,"assembled equipment sets",
   documents.mr0001,"THAI_PACK_VENDOR_QUOTE_AND_ACTUAL_CRATES_OPEN",{
   planningScenarioLowTHB:thaiPackReference.lowTHB,
   planningScenarioHighTHB:thaiPackReference.highTHB,
   scenarioSource:"Earlier B6 four-set comparison allowance (4 × THB1,500–3,000); same physical packaging, NEVER add to B6 or Working SELL",
   sourceAuthority:"ADR-68 / Thai assembly owner decision"
  }),
  row("B5","NEXTG-OEM-PACK","NEXTG-ORIGIN","MR-0001",
   "B6-MR1-NEXTG-IDU|B6-MR1-NEXTG-ODU|B6-MR1-NEXTG-ANT",
   "NextG factory export protection of 4 IDU, 4 ODU and ALL 5 antennas before direct MGW dispatch",13,"equipment units (4+4+5), NOT crates",
   route.nextg.sourceUrl,"NEXTG_AMENDED_OEM_PACK_INCLUSION_AND_CRATE_LIST_PENDING",{
   sourceAuthority:"ADR-68 / NextG expired DAP Ranong is NOT an approved MGW delivery quote"
  }),
  row("B5","MGW-MR234-OEM-PACK","OEM-TO-MGW","MR-0002/0003/0004",
   "B6-MGW-MR234-INTERNAL",
   "MR0002–MR0004 vendor original protection while delivering to MGW office",null,"physical packages",
   MGW.sourceUrl,"MGW_OEM_ORIGIN_PACKING_INCLUSION_PENDING"),
  row("B5","MGW-POST-FAT-REPACK","MGW-AFTER-FAT","MR-0001..0004",
   "B6-MGW-JUTAL-OUT",
   "Unpack, inspect, reuse/reseal or replace crates after MGW FAT; charge only net new work",null,"repacked physical packages",
   documents.annex4,"FAT_OPENED_PKG_IDS_REUSE_QTY_AND_NEW_PACK_RATE_PENDING",{
   sourceAuthority:"MGW FAT and crate reuse gate; B3 test labour separately"
  }),
  row("B5","MGW-SERV3-PACK","MGW-OUTBOUND","MR-0001..0004",
   "B6-MGW-JUTAL-OUT",
   "MGW SERV-3 packing, marking and delivery preparation — quoted ONCE; check SERV-5 overlap",1,"supplier service LS (NOT crate quantity)",
   quotePacking.sourceUrl,"QUOTED_SUPPLIER_REFERENCE__USD500_OVERLAP_OPEN",{
   supplierQuoteUSD:quotePacking.usd,
   supplierQuoteTHBReference:round(quotePacking.usd*fx),
   supplierQuoteId:"SERV-3",vendorPriceAuthority:"MGW P26-058_R2 cover 20-Oct-2026",
   commercialScopeConflict:"MGW message states SERV-5 USD2,500 includes packing; USD500 is NOT an approved vendor credit or separate verified direct cost"
  }),
  row("B5","EXPORT-MARK-IPPC","BEFORE-FINAL-DISPATCH","MR-0001..0004",
   "B6-MGW-JUTAL-OUT",
   "Accepted packing-list physical labels, waterproof marks, moisture protection and ISPM15 wood only as applicable",null,"verified physical packages",
   documents.std006,"PHYSICAL_MARKS_AND_OEM_INCLUDED_CREDIT_NOT_VERIFIED"),
  row("B5","SPARE-CASE-PRESERVE","EQUIPMENT-AND-SPARES","MR-0001..0004",
   "B6-MGW-JUTAL-OUT",
   "Separate spare cases and preservation when awarded; no double charge against B10/C1/C2",null,"awarded spare cases",
   documents.annex42,"AWARDED_OEM_SPARE_KIT_AND_CASES_OPEN")
 ].map(freeze);
 const b6=route.sourceLegs.map(x=>{
  const outbound=x.id==="B6-MGW-JUTAL-OUT";
  return row("B6",x.id,"TRANSPORT-LANE",x.mr,x.id,
   x.cargo,null,"actual freight consignment / cartons",
   outbound?quoteFreight.sourceUrl:x.id==="B6-MGW-MR234-INTERNAL"?MGW.sourceUrl:
    x.id==="B6-MR1-TH-ENC-CISCO"?documents.mr0001:route.nextg.sourceUrl,
   outbound?"MGW_SERV5_QUOTED_ONCE__CARGO_AND_PACKING_OVERLAP_PENDING":
    "FREIGHT_RATE_IMPORTER_CARGO_DIMENSIONS_AND_REVISED_TERM_PENDING",{
    supplierQuoteUSD:outbound?quoteFreight.usd:null,
    supplierQuoteTHBReference:outbound?round(quoteFreight.usd*fx):null,
    supplierQuoteId:outbound?"SERV-5":null,
    quotedFreightAlreadyInVendorCover:outbound,
    logisticsOwner:"B6 FREIGHT/BROKER/CUSTOMS/TRANSIT INSURANCE, not physical packing B5"
   });
 }).map(freeze);
 const b7=[
  row("B7","MGW-WORKSHOP-FREE-3MO","MGW-BEFORE-FAT-AND-DISPATCH",
   "MR-0001..0004","B6-MGW-MR234-INTERNAL|B6-MGW-JUTAL-OUT",
   "Contract requires three months FREE at vendor workshop; MGW inclusion in signed quote NOT confirmed",
   3,"contract-required free months (not storage bill)",
   storage.sourceMGWQuote,"FREE_PERIOD_VENDOR_CONFIRMATION_PENDING",{
    contractFreeMonths:3,monthlyPaidRateTHB:null
   }),
  row("B7","CONDITIONAL-ONE-MONTH","EXTRA-STORAGE-ONLY",
   "MR-0001..0004","B6-MGW-JUTAL-OUT",
   "Existing one-month management storage Working SELL reserve: only if genuinely chargeable outside free period",1,"conditional reserve month",
   storage.sourceMGWQuote,"SELECTED_WS_THB30000__VENDOR_COST_AND_TRIGGER_OPEN",{
    selectedReserveWorkingSellTHB:storage.currentSelectedOneMonthWorkingSellTHB
   }),
  row("B7","TH-OR-TRANSIT-HOLD","TH-WORKSHOP-OR-TRANSIT",
   "MR-0001","B6-MR1-TH-ENC-CISCO",
   "Thailand/pre-export temporary holding only if not covered by assembly or freight handling",null,"pallet-days / package-days",
   documents.annex4,"HANDLING_STORAGE_BOUNDARY_B5_B6_INCLUSION_OPEN")
 ].map(freeze);
 const selectedWorkingSellByCode=freeze({
  B5:legacy.originalB5PackingOnlySellTHB,
  B6:route.selectedB6WorkingSellTHB,
  B7:storage.currentSelectedOneMonthWorkingSellTHB
 });
 const all=[...b5,...b6,...b7];
 if(new Set(all.map(x=>x.moduleId)).size!==all.length||
  b6.length!==6||b5.length!==7||b7.length!==3||
  round(Object.values(selectedWorkingSellByCode).reduce((a,b)=>a+b,0))!==648768||
  all.some(x=>x.postingAllowed||x.verifiedDirectCostTHB!==null||x.allocatedWorkingSellTHB!==null))
  throw Error("B5/B6/B7 line identity or unpriced-source nonposting reconciliation failed");
 return freeze({
  moduleId:"bid.budget.working.bc.logistics-linked-audit",
  approvedRoutingId:route.approvedDecisionId,routeStatus:route.physicalRoutingStatus,
  MGWFatLocation:"MGW office / Nantong, China (route evidence; named FAT venue acceptance OPEN)",
  yardOwnerRoute:"JUTAL Zhuhai Yard, China per ADR-68",
  yardUserDescription:"JUTAL Zhuhai Yard, China (user-corrected 2026-10-22)",
  destinationConflict:"CONFIRMED CITY: MGW Office Nantong = FAT/dispatch; JUTAL Zhuhai Yard = receiving destination (user corrected). Exact consignee gate/address and supplier Incoterm still require written confirmation; no extra Nantong-to-Nantong JUTAL leg.",
  fxTHBPerUSD:fx,fxClass:"INTERNAL_PLANNING_FX_NOT_OFFICIAL_VENDOR_THB_INVOICE",
  selectedWorkingSellByCode,selectedThreeOwnerWorkingSellTHB:648768,
  totalCurrentVerifiedDirectCostTHB:null,
  currentRouteCostReconciled:false,sourcePriceComplete:false,
  independentNewPricingAuthorized:false,customerReleaseAllowed:false,
  rowsByCode:freeze({B5:freeze(b5),B6:freeze(b6),B7:freeze(b7)}),
  rows:freeze(all),cargoLegIds:freeze(route.sourceLegs.map(x=>x.id)),
  historicalB5:freeze({
   packingOnlySellTHB:legacy.originalB5PackingOnlySellTHB,
   oldGrossSellTHB:legacy.originalB5HistoricalSellTHB,
   oldEmbeddedB7StorageTHB:legacy.originalB5EmbeddedStorageSellTHB,
   noLegacyRepackEvidence:true
  }),
  quotePackingUSD:quotePacking.usd,quoteFreightUSD:quoteFreight.usd,
  vendorPackingPossiblyIncludedInFreight:true,confirmedPackingCreditUSD:null,
  referencePricingNotActualDirectCost:true,routeB6SourceId:route.sourceId,
  nonpostingThaiPackingReferenceLowTHB:thaiPackReference.lowTHB,
  nonpostingThaiPackingReferenceHighTHB:thaiPackReference.highTHB,
  gates:freeze([
   "MR0001 4 Thai assembled sets: packing lists, net/new crates, exporter and TH→MGW vendor packing quote",
   "NextG 4 IDU + 4 ODU + 5 antennas direct MGW: amended DAP Ranong quotation, included crate/transport credits and incoming customs",
   "MR0002–0004 OEM original crates: inclusion and MGW receiving/inspection; no Thailand return loop",
   "MGW post-FAT crate reuse/reseal and physical marks: list actual opened crates and qualified replacement works",
   "MGW SERV-3 USD500 vs SERV-5 USD2500 packing overlap: require written distinct scope/credit, no automatic minus USD500",
   "MGW outbound SERV-5 USD2500: obtain all four MR cargo manifest, transport/delivery condition and verified insurance",
   "B7 three-month FREE vendor workshop storage: written inclusion and actual duration; THB30000 additional month is conditional Working SELL reserve, not verified Cost",
   "JUTAL receiving yard is Zhuhai; verify exact receiving gate, consignee, handover Incoterm and release milestone in supplier confirmation",
   "B2 owns packing-list document creation; B3 FAT labour; B5 physical protection/marking; B6 freight/customs; B7 physical storage; B13 preservation consumables not double billed"
  ])
 });
}
