// 0553 Project Module Navigator: discover ACTUAL 10.2 working modules from
// the controlled B/C ownership registry and canonical source contract.
// Search/route metadata only: no new prices, quantities or approval state.
import {BUDGET_BC_WORKFLOW_0553} from "../workstreamOwnership0553";
import {selectBcTurnkeyWorkingCost0553} from "./bcTurnkeyWorkingCost0553";
import {BC_WORKING_ROUTES_0553,BC_CUSTOMER_CODES_0553} from "./bcWorkingModuleRoutes0553";
import {selectB3RequirementWbsTrace0553} from "./b3RequirementWbsTrace0553";
import {selectB3SiteMrSatCoverage0553} from "./b3SiteMrSatCoverage0553";

export function buildBcModuleNavigator0553(){
 const bc=selectBcTurnkeyWorkingCost0553();
 const parent=BUDGET_BC_WORKFLOW_0553.find(r=>r.workflowNumber==="10.2");
 if(!parent||parent.moduleId!==bc.moduleId)throw Error("10.2 Navigator parent must match canonical B/C working module");
 const groups=BUDGET_BC_WORKFLOW_0553.filter(r=>r.parent==="10.2");
 if(groups.length!==BC_WORKING_ROUTES_0553.length)throw Error("B/C Navigator group coverage mismatch");
 const entries=[
  {id:parent.moduleId,name:"10.2 — Part B/C Working Cost & Spare Requirements",
   tab:"budget",workflowNumber:"10.2",kind:"WORKING_COST_PARENT",
   keywords:"part b part c turnkey cost wbs services spares engineering pricing",
   anchorModuleId:parent.moduleId},
  ...groups.map(g=>{
   const route=BC_WORKING_ROUTES_0553.find(r=>r.workflow===g.workflowNumber);
   if(!route||route.codes.join("|")!==g.customerCodes.join("|"))
    throw Error("B/C Navigator route divergence at "+g.workflowNumber);
   return {id:g.moduleId,name:g.workflowNumber+" — "+route.name,
    tab:"budget",workflowNumber:g.workflowNumber,kind:"WORKING_SOURCE_GROUP",
    keywords:route.codes.join(" ")+" "+route.owner+" "+route.source.join(" "),
    anchorModuleId:g.moduleId};
  }),
  ...bc.rows.map(row=>({
   id:row.moduleId,
   name:row.code+" — "+row.requirement,
   tab:"budget",workflowNumber:row.workflowNumber,kind:"CUSTOMER_BC_WORKING_ROW",
   keywords:row.code+" "+row.requirement+" "+row.sourceRevision+" "+row.executionOwner,
   anchorModuleId:row.moduleId
  }))
 ];
 // Nested B3 IDs are derived from the SAME read-only source models that render
 // the B3 panel. A source ID may resolve to a distinct (unique) UI anchor.
 const req=selectB3RequirementWbsTrace0553();
 const sat=selectB3SiteMrSatCoverage0553();
 const b3=bc.byCode.B3;
 const b3Id=b3.moduleId;
 const child=(id,name,anchorModuleId=id,keywords="B3 SAT FAT ITP")=>({
  id,name,tab:"budget",workflowNumber:"10.2",kind:"WORKING_NESTED_MODULE",
  anchorModuleId,keywords
 });
 const b3Entries=[
  child(b3Id+".working-sell-breakdown","B3 — Working SELL THB 2,443,400 Breakdown"),
  child(b3Id+".40-day-abc","B3 — Offshore SAT/SIT 40-Day Working Basis",
   b3Id+".working-sell-breakdown.component-preview.offshore","offshore 40 days two specialists site SAT"),
  child(b3Id+".veex-mx100","B3 — VeEX MX100+ Temporary Test Rental",
   b3Id+".working-sell-breakdown.component-preview.veex","30 rental days tools SAT"),
  child(b3Id+".revk-china-budget","B3 — MGW China FAT Witness Expense Breakdown"),
  child(b3Id+".requirement-crosswalk","B3 — Contract Requirements × Rev.K / BOD SPE DTS MR"),
  child(req.moduleId,"B3 — Requirement Source Register (19)",
   b3Id+".requirement-crosswalk","RQM-01 RQM-19 contract trace"),
  child(sat.moduleId,"B3 — Seven-Site / Four-MR SAT Test Coverage (40 days)",
   sat.moduleId,"ZPQ ZWP8 ZWP11 ZWP20 ZWP21 ZWP22 ZWP23 matrix"),
  ...req.rows.map(r=>child(r.moduleId,r.id+" — "+r.activity,
   (r.costOwner==="B9"?"bid.budget.working.bc.b9":"bid.budget.working.bc.b3")+".requirement-crosswalk",
   "requirement "+r.system+" "+r.wbs+" "+r.requirementRef+" "+r.location)),
  ...sat.rows.map(r=>child(r.moduleId,r.id+" — "+r.site+" "+r.mr,
   r.moduleId,"SAT test "+r.site+" "+r.mr+" "+r.system)),
  ...b3.b3ChinaFatBudget.rows.map(r=>child(r.moduleId,r.description,
   r.moduleId,(r.costOwner==="B9"?"B9 optional Yard":"B3 China MGW FAT")+" "+r.id))
 ];
 // Child-level RQM rows need their own exact anchor, not just the visible
 // section parent. Their parent B3/B9 selection is supplied via owner metadata.
 for(const entry of b3Entries){
  const match=req.rows.find(x=>x.moduleId===entry.id);
  if(match){
   entry.anchorModuleId=entry.id;
   entry.parentOwner=match.costOwner==="B9"?"B9":"B3";
  }
 }
 entries.push(...b3Entries);
 const ids=entries.map(x=>x.id),all=new Set(ids);
 if(all.size!==entries.length)throw Error("Duplicate B/C Navigator Module ID");
 const leaves=entries.filter(x=>x.kind==="CUSTOMER_BC_WORKING_ROW");
 if(leaves.length!==BC_CUSTOMER_CODES_0553.length||
    BC_CUSTOMER_CODES_0553.some(code=>!leaves.some(x=>x.id==="bid.budget.working.bc."+code.toLowerCase())))
  throw Error("B/C Navigator missing customer module IDs");
 return entries;
}

export function searchBcModuleNavigator0553(query,entries=buildBcModuleNavigator0553()){
 const q=String(query||"").trim().toLowerCase();
 return q?entries.filter(x=>[x.id,x.name,x.keywords,x.workflowNumber].join(" ").toLowerCase().includes(q)):entries;
}
