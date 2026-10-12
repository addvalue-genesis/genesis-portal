// One MR0001 tag-level cost source for every site. No presentation-only cost math.
import {summarizeMR0001TagCost0553} from "./mr0001TagCostLedger0553";
import {deriveSevenLocationCostLedger0553} from "./sevenLocationCostCalculations0553";
const bulk=deriveSevenLocationCostLedger0553();
const round=x=>Math.round(x*100)/100;
export function getMR0001LocationCost0553(site){
 const ledger=summarizeMR0001TagCost0553(site);
 const scenarios=[];
 const entry=bulk.find(x=>x.wp===site);
 const standalone=entry?.rows.filter(x=>x.system==="SCADA_RADIO"&&Number.isFinite(x.extendedTHB))||[];
 if(standalone.length)scenarios.push({
  name:"SCADA field bulk estimate — separate cost owner",currency:"THB",
  amount:round(standalone.reduce((n,x)=>n+x.extendedTHB,0)),
  status:"SEPARATE_BULK_PROJECTION_NOT_POSTED_TO_EQUIPMENT",
  source:"SEVEN_LOCATION_BULK_LEDGER"
 });
 return {
  site,sourceCount:ledger.totalRows,costedRows:ledger.costedRows,
  remaining:ledger.unresolvedRows.length,
  allocatedUSD:ledger.subtotals.USD,allocatedTHB:ledger.subtotals.THB,
  selectedBasis:"SHARED_MR0001_TAG_COST_LEDGER",
  itemAllocations:ledger.rows.filter(x=>x.countedInWorkingTotal),
  unresolvedItems:ledger.unresolvedRows,
  additionalScenarios:scenarios,completeness:ledger.status
 };
}
