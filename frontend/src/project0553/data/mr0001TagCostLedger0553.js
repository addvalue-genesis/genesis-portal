// MR0001 controlled tag-level cost ledger: same one-owner-per-MTO-item rule as ZWP20.
// No blind quote-wide multiplication or conversion of candidate prices to approved costs.
import {ZWP8_ROW43_COST_TRACE} from "./zwp8Row43CostTrace";
import {deriveZWP20SiteCost0553} from "./zwp20SiteCost0553";
const round=n=>Math.round(n*100)/100;
const zwp8=ZWP8_ROW43_COST_TRACE;
const scenario=zwp8.referenceScenarios.find(x=>x.id===zwp8.preferredScenarioId);
const radioTags=["MR-502-003","MR-502-004"];
const antennaTags=["ANT-502-002","ANT-502-003"];
const zwp8Rows=zwp8.items.map(item=>{
 const radio=radioTags.includes(item.tag),antenna=antennaTags.includes(item.tag);
 const rate=radio?scenario?.radioAssemblyUnitUSD:antenna?scenario?.antennaUnitUSD:null;
 const extended=Number.isFinite(rate)?round(item.sourceQty*rate):null;
 return {site:"ZWP8",mr:"MR-0001",row:43,tag:item.tag,description:item.role,
  sourceQty:item.sourceQty,sourceUnit:item.sourceUnit,currency:"USD",unitCost:rate,
  extended,status:extended===null?"NO_SELECTED_BUDGET_RATE":"MANAGEMENT_PREFERRED_4FT_PRELIMINARY__OEM_TO_CONFIRM",
  source:"ZWP8_ROW43_COST_TRACE / "+zwp8.quote,selectedScenario:zwp8.preferredScenarioId,
  countedInWorkingTotal:Number.isFinite(extended),
  note:radio?"Remote radio functional assembly; IDU and OEM entitlement remain to confirm":
    antenna?"4ft antenna budget preference, final RPT/OEM approval pending":
    "Separate IDU function not costed by this scenario"};
});
if(Number.isFinite(scenario?.partialEquipmentUSD)){
 const sum=round(zwp8Rows.filter(r=>r.countedInWorkingTotal).reduce((n,r)=>n+r.extended,0));
 if(sum!==round(scenario.partialEquipmentUSD))throw Error("ZWP8 MTO-row43 allocations do not reconcile to preferred source scenario");
}
export function selectMR0001TagCostRows0553(site){
 if(site==="ZWP20")return deriveZWP20SiteCost0553().rows;
 if(site==="ZWP8")return zwp8Rows;
 return [];
}
export const ZWP8_TAG_WORKING_LEDGER_0553=Object.freeze(zwp8Rows);
