// MR0001 site cost projection used by the system-location MTO overview.
// Preserve each source scenario and currency; do not treat unselected vendor quotes as cost.
import {WORKING_BOM_BY_LOCATION_0553} from "./workingBomByLocation";
import {deriveZWP20SiteCost0553} from "./zwp20SiteCost0553";
import {deriveSevenLocationCostLedger0553} from "./sevenLocationCostCalculations0553";
import {ZWP8_ROW43_COST_TRACE} from "./zwp8Row43CostTrace";
const site20=deriveZWP20SiteCost0553();
const bulk=deriveSevenLocationCostLedger0553();
const round=v=>Math.round(v*100)/100;
export function getMR0001LocationCost0553(site){
 const items=WORKING_BOM_BY_LOCATION_0553.locations.find(g=>g.site===site)?.items||[];
 const sourceCount=items.length;
 if(site==="ZWP20")return {site,sourceCount,costedRows:site20.pricedRows,
  remaining:Math.max(0,sourceCount-site20.pricedRows),
  allocatedUSD:site20.subtotals.USD||0,allocatedTHB:site20.subtotals.THB||0,
  selectedBasis:"ZWP20_DETAILED_ROW_LEDGER",additionalScenarios:[],
  completeness:"PARTIAL_BUDGETARY__NOT_COMPLETE_A_B_C"};
 const costed=items.filter(x=>Number.isFinite(x.indicativePackageCostTHB));
 const allocatedTHB=round(costed.reduce((n,x)=>n+x.indicativePackageCostTHB,0));
 const scenarios=[];
 if(site==="ZWP8"){
  const choice=ZWP8_ROW43_COST_TRACE.referenceScenarios.find(x=>x.id===ZWP8_ROW43_COST_TRACE.preferredScenarioId);
  if(Number.isFinite(choice?.partialEquipmentUSD))
   scenarios.push({name:"ZWP8 selected 4ft radio/antenna reference",currency:"USD",amount:choice.partialEquipmentUSD,
    status:"PREFERRED_BUDGETARY_PARTIAL_NOT_APPROVED",source:"ZWP8_ROW43_COST_TRACE"});
 }
 const siteBulk=bulk.find(x=>x.wp===site);
 const scadaBulk=siteBulk?.rows.filter(x=>x.system==="SCADA_RADIO"&&Number.isFinite(x.extendedTHB))||[];
 if(scadaBulk.length)scenarios.push({name:"SCADA field bulk planning (separate)",currency:"THB",
  amount:round(scadaBulk.reduce((n,x)=>n+x.extendedTHB,0)),
  status:"SEPARATE_BULK_PROJECTION_NOT_POSTED_TO_EQUIPMENT",source:"SEVEN_LOCATION_BULK_LEDGER"});
 return {site,sourceCount,costedRows:costed.length,remaining:sourceCount-costed.length,
  allocatedUSD:0,allocatedTHB,selectedBasis:"MTO_CISCO_PROVISIONAL_ALLOCATION",
  additionalScenarios:scenarios,completeness:"PARTIAL_VENDOR_EVIDENCE_NOT_SELECTED"};
}
