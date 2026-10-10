// PJ2608-0553: OEM-level bid review, NOT automatic technical acceptance.
// Classifications are candidate mappings based on quotation descriptions only.
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import { SCADA_RADIO_PATH_REPORT } from "./scadaLinkEvidence";
const functions={
 "RADIO_BASE":{codes:["A-1"],requirement:"PTMP base radio and RF/Ethernet interfaces",owner:"MR-502-001 candidate; verify site/topology"},
 "RADIO_REMOTE":{codes:["B-1","C-1"],requirement:"Remote radio unit and appropriate PTP/PTMP mode",owner:"MR radio ODU candidate; verify link/site"},
 "RF_FILTER":{codes:["A-2","B-2","C-2"],requirement:"Frequency-selective protection and insertion loss",owner:"radio RF path or attributable bulk, allocate once"},
 "CAPACITY_KEY":{codes:["A-4","B-3","C-3"],requirement:"Throughput and remote-count entitlement",owner:"radio software option; capacity proof OPEN"},
 "REGION_KEY":{codes:["A-3","B-4","C-4"],requirement:"Legal frequency and country entitlement",owner:"radio licence; Myanmar authorization OPEN"},
 "MOUNT_FEEDER":{codes:["A-5","B-5","C-5"],requirement:"Mechanical mount and coax connection length",owner:"antenna/radio bulk boundary; prevent double count"},
 "POWER":{codes:["A-6","B-6","C-6"],requirement:"Available DC supply, output power and Ex interface",owner:"power interface; location proof OPEN"},
 "POWER_CORD":{codes:["A-7","B-7","C-7"],requirement:"AC/DC cord compatibility and connector",owner:"power accessory; verify North American cord applicability"},
 "ETHERNET_SURGE":{codes:["A-8","B-8","C-8"],requirement:"Ethernet protection zones and earthing",owner:"MTO SA equipment vs vendor included scope"},
 "WARRANTY":{codes:["A-9","A-10","B-9","B-10","C-9","C-10"],requirement:"Contractual warranty period, overlapping options",owner:"commercial entitlement; no additive assumption"},
 "ANTENNA_GPS":{codes:["A-11"],requirement:"GPS antenna and synchronisation coverage",owner:"radio accessory vs antenna scope"},
 "ANTENNA_SECTOR":{codes:["A-12"],requirement:"Sector azimuth/gain/pattern and link availability",owner:"ANT MTO; BOD 90° vs RPT 60° conflict"},
 "ANTENNA_PARABOLIC":{codes:["B-11","B-12","B-13","C-11","C-12"],requirement:"Diameter, gain, frequency, polarisation, wind loading and radome",owner:"ANT MTO; exact link/site assignment OPEN"}
};
// Spare D/E lines use the same source part numbers as base A/B/C lines.
 // Inherit only a FUNCTION label, never the base allocation, approval or quantity.
const baseFunctionByPart=new Map(NEXTG.lines.filter(q=>!["D","E"].includes(q.group)).map(q=>{
 const entry=Object.entries(functions).find(([,x])=>x.codes.includes(q.code));
 return [q.partNumber,entry?.[0]||"UNMAPPED"];
}));
const spareFunctionByPart=(q)=>baseFunctionByPart.get(q.partNumber)||"UNMAPPED";
const rows=NEXTG.lines.map(q=>{
 const spare=["D","E"].includes(q.group);
 const family=spare?spareFunctionByPart(q):null;
 const grp=Object.entries(functions).find(([key,x])=>x.codes.includes(q.code)||(spare&&key===family));
 const func=grp?.[0]||"UNMAPPED";
 const explicitConflict=q.code==="A-12"?"BOD_90_DEG_VS_RPT_60_DEG_NEEDS_RF_RECALC":null;
 const licence=/REGION_KEY/.test(func)?"COUNTRY_FREQUENCY_ENTITLEMENT_UNVERIFIED":null;
 const warranty=func==="WARRANTY"?"12_AND_48_MONTH_ALTERNATE_OR_CUMULATIVE_CONFIRM":null;
 const status=explicitConflict?"CONFLICT":licence||warranty?"CLARIFY":"TECHNICAL_REVIEW";
 return {quoteLine:q.code,partNumber:q.partNumber,group:q.group,sourceQty:q.qty,unitPrice:q.unitPrice,
  quotedTotal:q.quotedTotal,currency:NEXTG.currency,functionId:func,functionRequirement:grp?.[1].requirement||"Unmapped product purpose",
  allocationBoundary:grp?.[1].owner||"Technical ownership OPEN",
  offeredRole:spare?"SPARE_OPTION_SEPARATE":"BASE_CANDIDATE_NOT_ACCEPTED",
  classification:status,issues:[explicitConflict,licence,warranty].filter(Boolean),
  requiredQty:null,acceptedQty:null,allocatedMRItem:null,acceptedCost:null,technicalApproval:"OPEN",
  sourceId:NEXTG.sourceDriveId};
});
export const AVIAT_0553_TECHNICAL_EVALUATION=Object.freeze({
 projectId:"PJ2608-0553",mr:"MR-0001",quoteId:NEXTG.id,
 quoteNumber:NEXTG.quoteNumber,quotedTotal:NEXTG.quotedGrandTotal,currency:NEXTG.currency,
 sourceId:NEXTG.sourceDriveId,reportedDesign:SCADA_RADIO_PATH_REPORT.id,
 policy:{matchingDoesNotMeanCompliance:true,missingNotZero:true,noAdditiveWarrantyAssumption:true,
  spareNotBase:true,requiredBOMIndependentOfVendor:true,releaseAllowed:false},
 rows,
 holds:[
 {id:"RF-01",issue:"BOD 90-degree sector versus RPT 60-degree sector and quoted 90-degree antenna",decision:"RECALCULATE_RF_COVERAGE_AND_LINK_BUDGET",state:"CONFLICT"},
 {id:"RF-02",issue:"Myanmar frequency allocation / region codes 06 and 04, site permissions and entitlement",decision:"OBTAIN_OEM_AND_REGULATOR_CONFIRMATION",state:"HOLD"},
 {id:"RF-03",issue:"Base station count, remote count, PTP/PTMP capacity and topology",decision:"RECONCILE_ALL_FIVE_LINKS_TO_RADIO_ROLES",state:"REVIEW"},
 {id:"ELEC-01",issue:"Site power supply / PoE power budget / supplied cord type",decision:"VERIFY_VOLTAGE_POWER_AND_CONNECTOR",state:"REVIEW"},
 {id:"COM-01",issue:"12 versus 48 month warranty quotations",decision:"CONFIRM_INCLUDED_BASE_WARRANTY_AND_OPTIONS",state:"REVIEW"},
 {id:"SCOPE-01",issue:"RF filters/mount kits/surge/cables potentially overlap separate MTO items",decision:"ALLOCATE_EACH_COMPONENT_ONCE_BY_PHYSICAL_INTERFACE",state:"REVIEW"},
 {id:"COMM-01",issue:"Supplier offer expired 2026-10-01 and DAP Ranong terms",decision:"REQUOTE_AND_RECONCILE_FINAL_DELIVERY_BASIS",state:"HOLD"}
 ]
});
