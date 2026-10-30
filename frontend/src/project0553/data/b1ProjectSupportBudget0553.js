// Owner selected 30-Oct-2026: nine-month B1 lifecycle + Instrument licence SELL100k.
// Historical account/role IDs retained; only B1 is repriced. Actual costs/RACI remain open.
import {selectB1ProjectSupportBaseline0553,B1_SUPPORT_ROLE_RATES_0553} from "./b1ProjectSupportBaseline0553";
import {evaluateB1LifecycleReview0553} from "./b1LifecycleReview0553";
export {B1_SUPPORT_ROLE_RATES_0553};
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const sum=(rows,key)=>round(rows.reduce((n,r)=>n+(r[key]??0),0));
const completeCost=rows=>rows.every(r=>Number.isFinite(r.workingCostTHB))?sum(rows,"workingCostTHB"):null;
export function selectB1ProjectSupportBudget0553(){
 const prior=selectB1ProjectSupportBaseline0553(),s=evaluateB1LifecycleReview0553({months:9});
 const targets=[...s.support,s.regulatory];
 const roleLines=targets.flatMap(t=>{
  const old=prior.roleLines.filter(r=>r.role===t.key),oldHours=sum(old,"qty");
  let usedHours=0,usedCost=0,usedSell=0;
  return old.map((r,i)=>{
   const last=i===old.length-1;
   const qty=last?round(t.hours-usedHours):round(t.hours*r.qty/oldHours);
   const cost=last?round(t.planningCostTHB-usedCost):round(qty*t.monthlyTHB*prior.employerLoadFactor/prior.workHoursPerMonth);
   const sell=last?round(t.candidateSellTHB-usedSell):round(cost/(1-prior.laborGrossMarginTarget));
   usedHours=round(usedHours+qty);usedCost=round(usedCost+cost);usedSell=round(usedSell+sell);
   return Object.freeze({...r,qty,unitCostTHB:round(t.monthlyTHB*prior.employerLoadFactor/prior.workHoursPerMonth),
    workingCostTHB:cost,workingSellTHB:sell,monthlySalaryTHB:t.monthlyTHB,
    originalHours:r.qty,lifecycleMonths:9,weeklyHours:t.hoursPerWeek??null,
    activity:r.roleName+" — nine-month lifecycle allocation / "+r.wbs,
    verification:"Owner-selected planning hours replace old milestone hours; allocated by prior role event weights with final-line rounding reconciliation. Office work only; actual payroll and schedule open."});
  });
 });
 const technicalLines=s.engineering.map((r,i)=>{
  const last=i===s.engineering.length-1,previous=s.engineering.slice(0,i);
  const cost=last?round(s.technical.planningCostTHB-previous.reduce((n,x)=>n+round(x.hours*s.technical.monthlyTHB*prior.employerLoadFactor/prior.workHoursPerMonth),0)):
   round(r.hours*s.technical.monthlyTHB*prior.employerLoadFactor/prior.workHoursPerMonth);
  const sell=last?round(s.technical.candidateSellTHB-previous.reduce((n,x)=>n+round(x.hours*s.technical.monthlyTHB*prior.employerLoadFactor/prior.workHoursPerMonth/(1-prior.laborGrossMarginTarget)),0)):
   round(r.hours*s.technical.monthlyTHB*prior.employerLoadFactor/prior.workHoursPerMonth/(1-prior.laborGrossMarginTarget));
  return Object.freeze({id:"B1-"+r.id,account:"B1.1",wbs:"SI/"+r.id,activity:r.title,qty:r.hours,unit:"MH",
   unitCostTHB:round(s.technical.monthlyTHB*prior.employerLoadFactor/prior.workHoursPerMonth),
   workingCostTHB:cost,workingSellTHB:sell,role:"PM",roleName:"SI Engineering — PM salary proxy",
   monthlySalaryTHB:s.technical.monthlyTHB,isTechnical:true,conditional:false,costOwner:"B1",directCostTHB:null,
   workingCostClass:"OWNER_SELECTED_BUDGET_PROXY_NOT_VERIFIED_SI_COST",verification:r.boundary+"; budget selected, per-deliverable RACI/overlap and actual SI rate remain open."});
 });
 const allRoleLines=Object.freeze([...roleLines,...technicalLines]);
 const expenseLines=Object.freeze([...s.expenses.map(r=>Object.freeze({...r,workingCostTHB:r.planningCostTHB,workingSellTHB:r.candidateSellTHB})),
  Object.freeze({id:"B1-MM-INSTRUMENT",account:"B1.6",wbs:"K02,K13,K15",activity:s.instrumentAllowance.scope,
   qty:1,unit:"provisional SELL allowance",unitCostTHB:null,workingCostTHB:null,workingSellTHB:s.instrumentExtraSellTHB,
   role:"EXTERNAL_OR_ALLOWANCE",costOwner:"B1",conditional:false,directCostTHB:null,
   verification:"Owner-selected incremental SELL THB100000, replaces illustrative USD1600. Partner cost/quote, model, qty, serials and official fees open. No extra10% uplift or automatic original-reserve credit."})]);
 const lines=Object.freeze([...allRoleLines,...expenseLines]);
 const accounts=Object.freeze(prior.accounts.map(a=>{
  const rows=Object.freeze(lines.filter(r=>r.account===a.account));
  return Object.freeze({...a,label:a.account==="B1.1"?"SI Engineering, Project Management & Coordination":a.label,
   rows,qtyRows:rows.length,baseWorkingCostTHB:completeCost(rows),knownPlanningCostTHB:sum(rows,"workingCostTHB"),
   baseWorkingSellTHB:sum(rows,"workingSellTHB"),conditionalWorkingCostTHB:0,conditionalWorkingSellTHB:0});
 }));
 const displayGroups=Object.freeze(prior.displayGroups.map(g=>{
  const selected=accounts.filter(a=>g.accounts.includes(a.account));
  return Object.freeze({...g,baseWorkingCostTHB:selected.every(a=>a.baseWorkingCostTHB!==null)?sum(selected,"baseWorkingCostTHB"):null,
   knownPlanningCostTHB:sum(selected,"knownPlanningCostTHB"),baseWorkingSellTHB:sum(selected,"baseWorkingSellTHB")});
 }));
 const milestones=Object.freeze(prior.milestones.map(k=>{
  const rows=Object.freeze(roleLines.filter(r=>r.wbs===k.stage));
  return Object.freeze({...k,phase:k.stage==="K01"?"SAMTEL Warehouse FAT coordination":k.stage==="K02"?"CIF Zhuhai delivery coordination":k.phase,executionCostOwner:k.stage==="K01"?"B3 local FAT / A OEM equipment":k.executionCostOwner,rows,estimatedMH:sum(rows,"qty"),budgetaryCostTHB:sum(rows,"workingCostTHB"),workingSellTHB:sum(rows,"workingSellTHB")});
 }));
 if(sum(lines,"workingSellTHB")!==862675.74||sum(allRoleLines,"qty")!==905.5||sum(lines,"workingCostTHB")!==647996.59||new Set(lines.map(r=>r.id)).size!==lines.length)
  throw Error("Selected B1 lifecycle account reconciliation failed");
 return Object.freeze({...prior,accounts,displayGroups,milestones,lines,roleLines:allRoleLines,expenseLines,
  labourHours:905.5,labourWorkingCostTHB:sum(allRoleLines,"workingCostTHB"),labourWorkingSellTHB:sum(allRoleLines,"workingSellTHB"),
  baseExpenseWorkingCostTHB:null,baseExpenseWorkingSellTHB:sum(expenseLines,"workingSellTHB"),
  baseWorkingCostTHB:null,knownPlanningCostTHB:647996.59,unpricedPlanningCostIds:Object.freeze(["B1-MM-INSTRUMENT"]),
  baseWorkingSellTHB:862675.74,canonicalB1WorkingSellTHB:862675.74,proposedB1BaseWorkingSellTHB:862675.74,
  selectedMonths:9,selected:true,selectionAuthority:"USER_SELECT_B1_ONLY_9_MONTHS_INSTRUMENT_SELL100000_20261030",
  technicalBudgetSellTHB:s.technical.candidateSellTHB,lifecycleDecision:s,
  canonicalPriceSource:"OWNER_SELECTED_9_MONTH_LIFECYCLE_AND_INSTRUMENT_ALLOWANCE_20261030",
  pricingStatus:"OWNER_SELECTED_BUDGETARY_WORKING_SELL__ACTUAL_COST_RACI_AND_SCHEDULE_OPEN",
  policy:"Nine-month lifecycle replaces old labour; SI144h proxy budget selected with overlap/RACI unresolved. Existing Myanmar200k cost package counted once; Instrument100k SELL counted once; actual total planning cost incomplete. Other price owners unchanged.",
  actualDirectCostTHB:null,customerReleasedSellTHB:null,postingAllowed:false});
}
