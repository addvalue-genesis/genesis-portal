// MR0001 controlled tag-level cost ledger: same one-owner-per-MTO-item rule as ZWP20.
// No blind quote-wide multiplication or conversion of candidate prices to approved costs.
import {ZWP8_ROW43_COST_TRACE} from "./zwp8Row43CostTrace";
import {deriveZWP20SiteCost0553} from "./zwp20SiteCost0553";
import {WORKING_BOM_BY_LOCATION_0553} from "./workingBomByLocation";
import {SCADA_LINKS_0553} from "./scadaLinkEvidence";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
const round=n=>Math.round(n*100)/100;
const quoteLines=new Map(NEXTG.lines.map(x=>[x.code,x]));
const costFunctions=(codes)=>codes.map(code=>quoteLines.get(code)).filter(Boolean).map(q=>({functionId:q.code,sku:q.partNumber,qty:1,unitPrice:q.unitPrice,currency:"USD",extended:Number.isFinite(q.unitPrice)?q.unitPrice:null,source:NEXTG.quoteNumber,status:q.pricingState}));
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
// The same lineage applies to ALL seven sites. A row with source evidence but no
// selected engineering configuration is NOT priced, regardless of quote candidates.
export function selectMR0001TagCostRows0553(site){
 const original=WORKING_BOM_BY_LOCATION_0553.locations.find(x=>x.site===site)?.items||[];
 if(site==="ZWP20")return deriveZWP20SiteCost0553().rows.map(x=>({...x,mr:"MR-0001",countedInWorkingTotal:Number.isFinite(x.extended)}));
 const detailed=site==="ZWP8"?zwp8Rows:[];
 const byKey=new Map(detailed.map(x=>[x.row+"|"+x.tag,x]));
 return original.map(item=>{
  const selected=byKey.get(item.sourceRow+"|"+item.sourceTag);
  if(selected)return selected;
  // ZWP21 has one source-evidenced PTP peer to ZWP11 in RPT-0001.
  // Group C (remote terminal) is a reversible management working configuration,
  // NOT an OEM-accepted PTP solution. Cost functions are owned by distinct MTO tags.
  const ptp=site==="ZWP21"&&SCADA_LINKS_0553.some(l=>l.mode==="PTP"&&l.from==="ZWP11"&&l.to==="ZWP21");
  const oneSet=item.sourceScopeQty===1;
  let functions=[];
  let workingStatus=null;
  if(ptp&&oneSet&&item.sourceTag==="MR-502-001"){
   functions=costFunctions(["C-1","C-2","C-3","C-5"]);
   workingStatus="PTP_PEER_GROUP_C_PROVISIONAL_RADIO_FUNCTIONS__OEM_TO_CONFIRM";
  }else if(ptp&&oneSet&&item.sourceTag==="MR-502-001A"){
   functions=costFunctions(["C-6","C-7"]);
   workingStatus="PTP_INDOOR_POWER_INTERFACE_ONLY__IDU_FUNCTION_OPEN";
  }else if(ptp&&oneSet&&/^ANT-502-/.test(item.sourceTag)){
   functions=costFunctions(["C-11"]);
   workingStatus="PTP_3FT_ANTENNA_RPT_REFERENCE__OEM_TO_CONFIRM";
  }else if(ptp&&oneSet&&/^SA-502-/.test(item.sourceTag)){
   functions=costFunctions(["C-8"]);
   workingStatus="ETHERNET_SURGE_CANDIDATE_INTERFACE__VERIFY_EX";
  }
  const pricedFunctions=functions.length>0&&functions.every(x=>Number.isFinite(x.extended));
  const functionCost=pricedFunctions?round(functions.reduce((n,x)=>n+x.extended,0)):null;
  if(functionCost!==null)return {site,mr:"MR-0001",row:item.sourceRow,tag:item.sourceTag,
   description:item.description,sourceQty:item.sourceScopeQty,sourceUnit:item.sourceScopeUnit,
   currency:"USD",unitCost:functionCost,extended:functionCost,
   vendor:"Next G / Aviat",sku:functions.map(x=>x.sku).join(" + "),
   status:workingStatus,source:"RPT-0001 C1 ZWP11↔ZWP21 PTP / "+NEXTG.quoteNumber,
   detail:functions.map(c=>({...c,requiredQty:c.qty,budgetaryUnitPrice:c.unitPrice,budgetaryExtended:c.extended,budgetarySelectedSKU:c.sku,allocationOwner:item.sourceTag+"."+item.sourceRow,quantityState:"MTO_ONE_SET_PRELIMINARY",budgetarySelectionState:"PROVISIONAL_QUOTE_RATE"})),
   quantityBasis:"MTO Rev04 1 Set and one PTP ZWP11–ZWP21 RPT endpoint; provisional one-per-function",
   components:functions,assumptions:["Group C is a provisional budget cost composition, not selected/approved OEM design",
    "Region license C-4 has no quote rate; not treated as zero or complete",
    "The separately required IDU functional compliance, antenna gain and Ex interface must be checked"],
   countedInWorkingTotal:true};
  const priced=Number.isFinite(item.indicativePackageCostTHB);
  return {site,mr:"MR-0001",row:item.sourceRow,tag:item.sourceTag,
   description:item.description,sourceQty:item.sourceScopeQty,sourceUnit:item.sourceScopeUnit,
   currency:priced?"THB":null,unitCost:priced&&item.sourceScopeQty>0?round(item.indicativePackageCostTHB/item.sourceScopeQty):null,
   extended:priced?round(item.indicativePackageCostTHB):null,
   status:priced?"CISCO_PRELIMINARY_WORKING_BUNDLE":"ENGINEERING_SELECTION_OR_PRICE_MAPPING_REQUIRED",
   source:priced?"VST-0048-RE1 / MTO Rev04":"MTO Rev04 / vendor candidates only",
   candidates:item.vendorCandidates||[],countedInWorkingTotal:priced,
   note:priced?"Cisco source quote is not OEM-accepted system BOM":"Selection must follow site-specific BLD/RPT/topology, not nearest vendor rate"};
 });
}
export function summarizeMR0001TagCost0553(site){
 const rows=selectMR0001TagCostRows0553(site);
 const subtotals={USD:0,THB:0};
 for(const x of rows)if(x.countedInWorkingTotal&&Number.isFinite(x.extended)&&x.currency in subtotals)
  subtotals[x.currency]=round(subtotals[x.currency]+x.extended);
 return {site,rows,subtotals,costedRows:rows.filter(x=>x.countedInWorkingTotal).length,
  unresolvedRows:rows.filter(x=>!x.countedInWorkingTotal),
  totalRows:rows.length,status:rows.some(x=>!x.countedInWorkingTotal)?"PARTIAL_ENGINEERING_COST_LEDGER":"BUDGETARY_PRICED_NOT_RELEASED"};
}
export const ZWP8_TAG_WORKING_LEDGER_0553=Object.freeze(zwp8Rows);
