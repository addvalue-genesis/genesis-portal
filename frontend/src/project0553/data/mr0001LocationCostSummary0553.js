// MR0001 site cost projection used by the system-location MTO overview.
// Preserve each source scenario and currency; do not treat unselected vendor quotes as cost.
import {WORKING_BOM_BY_LOCATION_0553} from "./workingBomByLocation";
import {deriveZWP20SiteCost0553} from "./zwp20SiteCost0553";
import {deriveSevenLocationCostLedger0553} from "./sevenLocationCostCalculations0553";
import {ZWP8_TAG_WORKING_LEDGER_0553} from "./mr0001TagCostLedger0553";
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
 const itemAllocations=site==="ZWP8"?ZWP8_TAG_WORKING_LEDGER_0553.filter(x=>x.countedInWorkingTotal):[];
 const allocatedUSD=round(itemAllocations.reduce((n,x)=>n+x.extended,0));
 const siteBulk=bulk.find(x=>x.wp===site);
 const scadaBulk=siteBulk?.rows.filter(x=>x.system==="SCADA_RADIO"&&Number.isFinite(x.extendedTHB))||[];
 if(scadaBulk.length)scenarios.push({name:"SCADA field bulk planning (separate)",currency:"THB",
  amount:round(scadaBulk.reduce((n,x)=>n+x.extendedTHB,0)),
  status:"SEPARATE_BULK_PROJECTION_NOT_POSTED_TO_EQUIPMENT",source:"SEVEN_LOCATION_BULK_LEDGER"});
 return {site,sourceCount,costedRows:costed.length+itemAllocations.length,remaining:Math.max(0,sourceCount-costed.length-itemAllocations.length),
  allocatedUSD,allocatedTHB,selectedBasis:site==="ZWP8"?"ZWP8_MTO_ROW43_TAG_LEVEL_PRELIMINARY":"MTO_CISCO_PROVISIONAL_ALLOCATION",
  itemAllocations,
  additionalScenarios:scenarios,completeness:"PARTIAL_VENDOR_EVIDENCE_NOT_SELECTED"};
}
