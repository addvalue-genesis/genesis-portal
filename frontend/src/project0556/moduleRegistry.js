import {L3_TABS_0556,TAB_IDENTITY_0556} from "./lifecycleNavigation";
export const BUDGET_MODULES_0556=Object.freeze([
 ["10.1","bid.budget.bom","Engineering Basis & Required BOM"],
 ["10.2","bid.budget.working.bc","Services, Rental & Lifecycle Working Costs"],
 ["10.3","bid.budget.pricing","Working / Budgetary / Release"],
 ["10.4","bid.budget.mapping","Estimate → Customer Bid Mapping"],
 ["10.5","bid.budget.scope","Scope of Service, Equipment & SLA"],
 ["10.6","bid.budget.customer-output","Customer Proposal Preview / Export"],
 ["10.7","bid.budget.internal","Internal Budget Review & Audit"]
].map(([number,id,title])=>Object.freeze({number,id,title,projectId:"PJ2610-0556",status:"UI_SCAFFOLD"})));
export const MODULE_REGISTRY_0556=Object.freeze([
 ...L3_TABS_0556.map(([route,title])=>({route,title,id:"bid."+route,projectId:"PJ2610-0556",semanticCode:TAB_IDENTITY_0556.tabs.find(x=>x.route===route).semanticCode,status:"UI_SCAFFOLD"})),
 ...BUDGET_MODULES_0556
]);
export const assertUniqueModuleIds0556=()=>{
 const ids=MODULE_REGISTRY_0556.map(x=>x.projectId+"/"+x.id);
 if(ids.length!==new Set(ids).size)throw Error("0556 duplicate module identity");
 return true;
};
