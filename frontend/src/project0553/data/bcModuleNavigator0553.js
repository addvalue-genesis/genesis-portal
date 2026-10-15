// 0553 Project Module Navigator: discover ACTUAL 10.2 working modules from
// the controlled B/C ownership registry and canonical source contract.
// Search/route metadata only: no new prices, quantities or approval state.
import {BUDGET_BC_WORKFLOW_0553} from "../workstreamOwnership0553";
import {selectBcTurnkeyWorkingCost0553} from "./bcTurnkeyWorkingCost0553";
import {BC_WORKING_ROUTES_0553,BC_CUSTOMER_CODES_0553} from "./bcWorkingModuleRoutes0553";

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
