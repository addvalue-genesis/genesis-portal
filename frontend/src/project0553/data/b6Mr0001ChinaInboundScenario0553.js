// 10.2 B6 / MR0001 — earlier four-cabinet all-Thailand inbound COMPARISON (nonposting).
// Nonposting feasibility and 2026 market-envelope reference, NOT a freight offer.
// Quoted MGW SERV-5 USD2500 is Nantong -> JUTAL, NOT Thailand -> Nantong.
// Quote P26-058_R2 dated 20 Oct covers OEM iFAT/facility & outgoing road leg;
// China inbound broker/importer/taxes, IDU/Cisco 4-set intake NOT quoted.
// Unit assumptions for 5 CBM / 750kg are third-party lane examples,
// not measured 4-set weights or packaging confirmation.
import {MGW_R2_COVER_20261020_0553 as quote} from "./mgwP26058R2Cover20261020";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export function selectB6Mr0001ChinaInboundScenario0553(){
 const freight=quote.services.find(x=>x.id==="SERV-5");
 if(!freight||freight.usd!==2500||quote.freight.quotedUSD!==2500)
  throw Error("B6 MGW outgoing quoted freight identity changed");
 const fx=31.5;
 const components=Object.freeze([
  {id:"B6-MR1-IN-01",activity:"4 enclosure/IDU/Cisco-set inner/crate protection, estimated",basis:"4 sets × THB1500–3000 (planning allowance, not supplier quote)",lowTHB:6000,highTHB:12000,verified:false},
  {id:"B6-MR1-IN-02",activity:"Thailand collection/export-document/broker/terminal costs",basis:"Pre-award administrative allowance only, origin pending",lowTHB:8000,highTHB:15000,verified:false},
  {id:"B6-MR1-IN-03",activity:"Bangkok→Shanghai ocean LCL reference (not DDP)",basis:"Flexport 5 CBM / 750kg indicative USD438–488; Sep 2026 price validity expired",lowTHB:round(438*fx),highTHB:round(488*fx),verified:false},
  {id:"B6-MR1-IN-04",activity:"China import brokerage, destination terminal, Shanghai→Nantong delivery",basis:"China-side provisional lump-sum allowance; MGW importer/agent to confirm",lowTHB:15000,highTHB:30000,verified:false}
 ].map(x=>Object.freeze({...x,quotedDirectCostTHB:null,postingAllowed:false})));
 const low=round(components.reduce((s,r)=>s+r.lowTHB,0));
 const high=round(components.reduce((s,r)=>s+r.highTHB,0));
 if(low!==42797||high!==72372||components.length!==4)
  throw Error("B6 planning reference source envelope differs");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b6",
  sourceId:"B6-MR0001-CHINA-INBOUND-4-SETS-SC-20261021",
  system:"MR0001 SCADA",receivedAt:"MGW Nantong, China",
  bundleCount:4,bundleDescription:"Enclosure + IDU + Cisco integration/assembly set",
  newRoute:"ALL-THAILAND COMPARISON ONLY: Thai assembly components → Shanghai → MGW Nantong → integration/FAT → JUTAL",
  obsoleteRouteReference:"MR0001 supplier → SAMTEL Bangkok FAT → JUTAL (historical; check before removing existing source costs)",
  supplierOutgoingFreightUSD:freight.usd,supplierOutgoingFreightTHB:round(freight.usd*fx),
  supplierOutgoingFreightAlreadyInCover:true,
  supplierOutgoingFreightIncrementalUSD:null,
  supplierTermConflict:"MGW cover DAP Nantong vs SERV-5 Nantong to JUTAL; written destination/cargo scope required",
  sourceUrls:Object.freeze([quote.sourceUrl,"https://www.flexport.com/rates/bangkok-thailand/shanghai-china"]),
  referenceCBM:5,referenceGrossKG:750,referenceCargoMeasurementsConfirmed:false,
  workingFxTHBPerUSD:fx,components,
  preliminaryInboundLowTHB:low,preliminaryInboundHighTHB:high,
  customsDutyTHB:null,importVATTHB:null,bondOrGuaranteeTHB:null,
  insurancePremiumTHB:null,verifiedDirectCostTHB:null,
  alreadyCoveredInHistoricalB6SelectedTHB:null,
  comparableNetChangeVsOldRouteTHB:null, // old route components have not been allocated
  incrementToCurrentB6WorkingSellTHB:null,
  ownerOfRecord:"B6",routingSelected:false,routingScenarioStatus:"SUPERSEDED_ALL_THAILAND_REFERENCE_BY_ADR68",
  supersededAsPhysicalRouteBy:"ADR-68-B6-MR0001-DIRECT-MGW-20261022",
  pricingClass:"SCENARIO_ONLY__MARKET_AND_PARAMETRIC_ALLOWANCES",
  signedImporterOfRecord:false,motherboardCiscoLicensingAndCountryOfOriginChecked:false,
  gates:Object.freeze([
   "Confirm supplier/origin of all 4 enclosures, Cisco switches, IDUs, serial numbers and Incoterm ownership",
   "Obtain measured each-set L/W/H/GW/CBM/crate count and cargo invoice value before freight price",
   "Confirm China importer of record and processing-trade/bonded vs ordinary import, taxes and re-export procedure",
   "MGW must verify when and where Cisco/IDU are assembled, accepted and re-exported, including damage risk",
   "Do not add the USD2500 SERV-5 outgoing road quote again or double-post legacy B6 transport"
  ]),
  postingAllowed:false,releaseAllowed:false
 });
}
