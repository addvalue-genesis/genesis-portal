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
const ADR="ADR-URGENT-SAMTEL-CIF-20261024";
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
// 24-Oct internal allocation of the EXISTING B5/B6 envelopes, not freight quotations.
// One allowance lot per activity; no fabricated crate count, weight, duty exemption or market rate.
export function selectSamtelLogisticsEnvelope0553(){
 const definitions={
  B5:[
   ["RECEIVE-PRESERVE","Receiving/unpacking/protection of reusable OEM cases at SAMTEL",40000],
   ["MR1-SEA-PACK","MR0001 all seven locations: cabinets/radios/Cisco/antennas export protection",64000],
   ["MR2-SEA-PACK","MR0002 three BDA locations: reusable-case protection/repack",24000],
   ["MR3-SEA-UPGRADE","MR0003 four phone/sounder locations: upgrade EXION inland packing",32000],
   ["MR4-CASE-REUSE","MR0004 three RACON locations: inspect/reuse included MDS sea cases",24000],
   ["SPARE-TOOL-CASES","Selected B10/B11/B13 spares/tools/consumables separate marked cases",28000],
   ["MARK-PRESERVATION","Shipping marks, desiccants, wood/IPPC compliance and preservation",30000],
   ["POST-FAT-PACK","Post-FAT dismantle/protection/seal/physical repacking labour",40000],
   ["WEIGH-MEASURE","Physical package measurement, weighing and label data; B2 controls documents",9184],
   ["PACK-RISK","Unallocated packing damage/upgrade contingency within existing envelope",20000]
  ],
  B6:[
   ["MR1-TH-IN","NextG/VST/Thai assembly to SAMTEL incl destination-change allowance",35000],
   ["MR2-CN-TH","MGW RF equipment China origin → Thailand; EXW/DAP discrepancy remains",60000],
   ["MR3-TH-IN","EXION Nonthaburi → actual SAMTEL address, local delivery reserve",8000],
   ["MR4-FCA-TH","MDS named FCA factory → Thailand; pickup place/cargo dimensions open",65000],
   ["TH-IMPORT-BROKER","Thailand inbound broker/permit processing, excluding unknown statutory duty/VAT",12000],
   ["SAMTEL-EXPORT","SAMTEL dispatch loading, truck to port, export broker/terminal handling",25000],
   ["CIF-ZHUHAI-SEA","Thailand port → Zhuhai Port sea freight, all four MR consolidated",80000],
   ["CARGO-RISK","Cargo insurance plus unallocated route-price contingency",22584]
  ]
 };
 const byCode=Object.fromEntries(Object.entries(definitions).map(([code,list])=>[code,freeze(list.map(([id,activity,amount])=>freeze({
  id:code+"-SAMTEL-"+id,code,activity,qty:1,unit:"internal allowance lot",unitRateTHB:amount,
  workingSellTHB:amount,sourceModuleId:ROOT+"."+code.toLowerCase()+".price-trace.work-scope",
  status:"INTERNAL_ENVELOPE_ALLOCATION_NOT_VENDOR_QUOTE_OR_VERIFIED_ADEQUACY",
  verifiedDirectCostTHB:null,independentPostingAllowed:false
 })))]));
 const totals=Object.fromEntries(Object.entries(byCode).map(([code,rows])=>[code,round(rows.reduce((n,r)=>n+r.workingSellTHB,0))]));
 if(totals.B5!==311184||totals.B6!==307584)throw Error("Existing packing/CIF envelopes allocated more than once");
 return freeze({byCode:freeze(byCode),totals:freeze(totals),adequacyVerified:false,
  coverage:"All MR0001/2/3/4 7+3+4+3 scope and selected spares; equipment location counts are not shipment package counts",
  statutoryThaiDutyVATTHB:null,clientTravelHotelTHB:null,
  unpricedExposures:freeze(["Thailand import duty/tax regime and recoverable VAT cash flow: amount/payer not established, no exemption assumed", "Actual dimensions/weights/freight surcharges and OEM included freight/packing netting", "Cargo ICC(A) insurance to Yard versus CIF Port: broker extent/premium unconfirmed", "China clearance/duty/VAT/port-to-yard Purchaser per COM-D02; any changed responsibility must be repriced"]),
  customerReleaseAllowed:false});
}
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
   "Thai enclosure/Cisco: deliver to SAMTEL; sea-export protection after FAT",4,"assembled equipment sets",
   documents.mr0001,"THAI_PACK_VENDOR_QUOTE_AND_ACTUAL_CRATES_OPEN",{
   planningScenarioLowTHB:thaiPackReference.lowTHB,
   planningScenarioHighTHB:thaiPackReference.highTHB,
   scenarioSource:"Earlier B6 four-set comparison allowance (4 × THB1,500–3,000); same physical packaging, NEVER add to B6 or Working SELL",
   sourceAuthority:"ADR-68 / Thai assembly owner decision"
  }),
  row("B5","NEXTG-OEM-PACK","NEXTG-ORIGIN","MR-0001",
   "B6-MR1-NEXTG-IDU|B6-MR1-NEXTG-ODU|B6-MR1-NEXTG-ANT",
   "NextG factory protection before Thailand SAMTEL receiving; no assumed free reroute",13,"equipment units (4+4+5), NOT crates",
   route.nextg.sourceUrl,"NEXTG_AMENDED_OEM_PACK_INCLUSION_AND_CRATE_LIST_PENDING",{
   sourceAuthority:"ADR-68 / NextG expired DAP Ranong is NOT an approved MGW delivery quote"
  }),
  row("B5","MGW-MR234-OEM-PACK","OEM-TO-MGW","MR-0002/0003/0004",
   "B6-MGW-MR234-INTERNAL",
   "MGW MR0002 inbound packing; EXION inland-only protection; MDS sea packing included, net new B5 work only",null,"physical packages",
   MGW.sourceUrl,"MGW_OEM_ORIGIN_PACKING_INCLUSION_PENDING"),
  row("B5","MGW-POST-FAT-REPACK","SAMTEL-AFTER-FAT","MR-0001..0004",
   "B6-MGW-JUTAL-OUT",
   "Unpack, inspect, reuse/reseal or replace crates after SAMTEL FAT; charge only net new work",null,"repacked physical packages",
   documents.annex4,"FAT_OPENED_PKG_IDS_REUSE_QTY_AND_NEW_PACK_RATE_PENDING",{
   sourceAuthority:"SAMTEL FAT and crate reuse gate; B3 test labour separately"
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
   outbound?"CIF_SEA_FREIGHT_UNQUOTED__MGW_ROAD_QUOTE_NOT_TRANSFERABLE":
    "FREIGHT_RATE_IMPORTER_CARGO_DIMENSIONS_AND_REVISED_TERM_PENDING",{
    supplierQuoteUSD:null,
    supplierQuoteTHBReference:null,
    supplierQuoteId:null,
    quotedFreightAlreadyInVendorCover:false,
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
  b6.length!==8||b5.length!==7||b7.length!==3||
  round(Object.values(selectedWorkingSellByCode).reduce((a,b)=>a+b,0))!==648768||
  all.some(x=>x.postingAllowed||x.verifiedDirectCostTHB!==null||x.allocatedWorkingSellTHB!==null))
  throw Error("B5/B6/B7 line identity or unpriced-source nonposting reconciliation failed");
 return freeze({
  moduleId:"bid.budget.working.bc.logistics-linked-audit",
  envelope:selectSamtelLogisticsEnvelope0553(),
  approvedRoutingId:route.approvedDecisionId,routeStatus:route.physicalRoutingStatus,
  MGWFatLocation:"SAMTEL Warehouse, Thailand — selected working venue; customer acceptance open",
  yardOwnerRoute:"CIF Zhuhai Port China, COM-D02 port→yard by Purchaser",
  yardUserDescription:"CIF Zhuhai Port, not JUTAL Yard",
  destinationConflict:"CCL CIF port versus contract ICC(A) insurance to Yard: resolve insurance extent; China clearance and port→yard remain Purchaser under COM-D02",
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
   ...route.decisionGates,
   "Sea export packaging after SAMTEL FAT: reuse MDS included sea crates where sound, upgrade EXION inland packing only as needed; no assumed free repack",
   "MGW SERV-3/5 remain historical source references, not actual CIF outbound quote or agreed credit",
   "B7 one-month reserve remains conditional beyond included storage; B5 embedded storage excluded",
   "B2 documents / B3 test labour / B5 packing / B6 freight-cargo insurance / B7 storage / B14 corporate cover are separate owners"

  ])
 });
}
