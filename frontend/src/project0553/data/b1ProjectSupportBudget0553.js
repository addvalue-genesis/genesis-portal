// PJ2608-0553 / B1.1–B1.8: internal project support, management and residual expense PLANNING ledger.
// Customer's original B1 label remains "Engineering and design" (1 Lot).
// This is a separately reviewable B1 Working Cost / Working Sell SCENARIO,
// not verified direct cost or an additional post to the canonical 10.2 total.
// Role/month rates are THB 2026 Thailand indicative salary assumptions,
// not ADDVALUE payroll. 22 workdays x 8h, 20% employer-cost loading;
// 20% target gross margin on labor; 10% handling uplift on non-labor.
// K groups are unique events (K03-07 and K08-11 shared); physical B2/B3/B5/B6/B9 excluded.
import {selectB1RevKMilestoneCoverage0553} from "./b1RevKMilestoneCoverage0553";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const load=1.20,workingHoursPerMonth=176,laborSellDivider=0.80,expenseSellFactor=1.10;
export const B1_SUPPORT_ROLE_RATES_0553=Object.freeze({
 PM:{name:"Project Manager",monthlyTHB:90000,account:"B1.1"},
 COORD:{name:"Project Coordinator",monthlyTHB:42000,account:"B1.1"},
 ADMIN:{name:"Administration Officer",monthlyTHB:25000,account:"B1.4"},
 ACCOUNTANT:{name:"Accounting / Finance Officer",monthlyTHB:35000,account:"B1.4"},
 PROCUREMENT:{name:"Procurement Officer",monthlyTHB:38000,account:"B1.4"},
 REGULATORY:{name:"Regulatory Coordinator",monthlyTHB:55000,account:"B1.5"},
 FINANCE_MANAGER:{name:"Finance Manager",monthlyTHB:85000,account:"B1.1"}
});
// Labor is only the support/coordination function, NEVER actual OEM/FAT/SAT/testing,
// VDRL drafting, freight, packing or Yard Specialist deployment.
const ROLE_BY_K=Object.freeze({
 K00:{COORD:4,ADMIN:4},
 K01:{PM:4,COORD:6,ADMIN:2},
 K02:{PM:4,COORD:6,PROCUREMENT:8,ACCOUNTANT:4},
 K03:{PM:4,COORD:10,ADMIN:4},
 K08:{PM:4,COORD:10,ADMIN:4},
 K12:{PM:4,COORD:6,ADMIN:4},
 K13:{PM:2,COORD:6,PROCUREMENT:4,ACCOUNTANT:2},
 K14:{PM:4,COORD:10,ADMIN:6},
 K15:{PM:4,COORD:8,REGULATORY:12,ADMIN:4},
 K16:{PM:6,COORD:16,ADMIN:8,ACCOUNTANT:4},
 K17:{PM:4,COORD:8,ADMIN:4},
 K18:{PM:8,COORD:8,ACCOUNTANT:10,ADMIN:8,FINANCE_MANAGER:4}
});
const NON_LABOR=Object.freeze([
 {id:"B1-EXP-MEET",account:"B1.2",wbs:"K00,K01,K02,K18",activity:"Documented lawful business meetings and hospitality",qty:4,unit:"meeting",unitCostTHB:2500,conditional:false,gate:"Business purpose, receipts, approval and anti-bribery policy"},
 {id:"B1-EXP-AIR",account:"B1.3",wbs:"K02,K13,K18",activity:"Management-only commercial/coordination airfare; distinct Trip IDs",qty:2,unit:"person-trip",unitCostTHB:18000,conditional:false,gate:"No FAT witnesses, B9 Yard specialist or B3 field SAT airfare"},
 {id:"B1-EXP-HOTEL",account:"B1.3",wbs:"K02,K13,K18",activity:"Management accommodation for distinct commercial trips",qty:6,unit:"room-night",unitCostTHB:2800,conditional:false,gate:"Trip IDs, room-night itinerary; no B3/B9 duplicates"},
 {id:"B1-EXP-LOCAL",account:"B1.3",wbs:"K02,K13,K18",activity:"Management local transport / airport transfer",qty:2,unit:"trip",unitCostTHB:4000,conditional:false,gate:"Management commercial trip only"},
 {id:"B1-EXP-OFFICE",account:"B1.4",wbs:"K00–K18",activity:"Project-assigned telecom/office/printing/communication allowance",qty:6,unit:"planning month",unitCostTHB:2500,conditional:false,gate:"Six months is a budget assumption, NOT a confirmed project duration or duplicated loaded rate"},
 {id:"B1-EXP-FILING",account:"B1.5",wbs:"K02,K13,K15",activity:"Permit file translation / courier / administrative application preparation",qty:4,unit:"file",unitCostTHB:1800,conditional:false,gate:"Exclude customs broker freight in B6; no statutory charges here"},
 {id:"B1-EXP-LEGAL",account:"B1.6",wbs:"K02,K13,K15",activity:"Licensed local legal / consultant filing service allowance",qty:1,unit:"LS",unitCostTHB:35000,conditional:true,gate:"Only if ADDVALUE is payer; written engagement, deliverable, due diligence and invoice"},
 {id:"B1-EXP-GOV",account:"B1.7",wbs:"K13,K15",activity:"Official published statutory licensing / permit fee allowance",qty:2,unit:"application",unitCostTHB:6000,conditional:true,gate:"Only where legally payable by ADDVALUE; authority fee schedule and official receipt"},
 {id:"B1-EXP-MISC",account:"B1.8",wbs:"K00–K18",activity:"Documented small project expenses not allocated to A/B2–B14",qty:1,unit:"LS",unitCostTHB:8000,conditional:false,gate:"Evidence required and uniqueness check against office and travel allowances"}
]);
const ACCOUNTS=Object.freeze([
 ["B1.1","Project Management & Coordination"],
 ["B1.2","Business Meetings & Representation"],
 ["B1.3","Management Travel & Accommodation"],
 ["B1.4","Project Administration, Procurement & Finance"],
 ["B1.5","Regulatory / Permit Coordination"],
 ["B1.6","Legal & Local Consultant Services (conditional)"],
 ["B1.7","Official Licence / Permit Fees (conditional)"],
 ["B1.8","Miscellaneous Project Expenses"]
]);
export function selectB1ProjectSupportBudget0553(){
 const coverage=selectB1RevKMilestoneCoverage0553();
 const owners=coverage.rows.filter(x=>x.chargeableHere);
 if(owners.length!==12||Object.keys(ROLE_BY_K).length!==12)throw Error("B1 unique Rev.K milestone events changed");
 const milestones=coverage.rows.map(row=>{
  const assigned=Object.entries(ROLE_BY_K[row.stage]||{}).map(([role,mh])=>{
   const info=B1_SUPPORT_ROLE_RATES_0553[role];
   if(!info||!Number.isInteger(mh)||mh<=0)throw Error("B1 unsupported role/hours "+row.stage+"/"+role);
   const loadedRateTHB=round(info.monthlyTHB*load/workingHoursPerMonth);
   const exactWorkingCostTHB=info.monthlyTHB*load/workingHoursPerMonth*mh;
   return Object.freeze({
    id:"B1-ROLE-"+row.stage+"-"+role,wbs:row.stage,chargeEventKey:row.chargeEventKey,
    account:info.account,activity:row.phase+" — "+info.name+" support",
    role,roleName:info.name,monthlySalaryTHB:info.monthlyTHB,qty:mh,unit:"MH",
    unitCostTHB:loadedRateTHB,workingCostTHB:round(exactWorkingCostTHB),
    workingSellTHB:round(exactWorkingCostTHB/laborSellDivider),conditional:false,
    costOwner:"B1",workingCostClass:"PLANNING_EMPLOYER_LOADED_COST_NOT_VERIFIED_PAYROLL",
    directCostTHB:null,verification:"Distinct office support only; "+row.directOwner+" remains separate"
   });
  });
  return Object.freeze({stage:row.stage,moduleId:row.moduleId,phase:row.phase,
   chargeOwnerStage:row.chargeOwnerStage,chargeableHere:row.chargeableHere,
   sharedStages:coverage.rows.filter(x=>x.chargeOwnerStage===row.stage).map(x=>x.stage),
   rows:assigned,estimatedMH:assigned.reduce((n,x)=>n+x.qty,0),
   budgetaryCostTHB:round(assigned.reduce((n,x)=>n+x.workingCostTHB,0)),
   workingSellTHB:round(assigned.reduce((n,x)=>n+x.workingSellTHB,0)),
   executionCostOwner:row.directOwner,deliverable:row.deliverable});
 });
 const roleLines=milestones.flatMap(x=>x.rows);
 const expenseLines=NON_LABOR.map(x=>Object.freeze({...x,costOwner:"B1",role:"EXTERNAL_OR_ALLOWANCE",
  workingCostTHB:round(x.qty*x.unitCostTHB),
  workingSellTHB:round(x.qty*x.unitCostTHB*expenseSellFactor),
  directCostTHB:null,workingCostClass:"PLANNING_PROJECT_EXPENSE_NOT_VERIFIED",
  verification:x.gate}));
 const lines=Object.freeze([...roleLines,...expenseLines]);
 const labourHours=roleLines.reduce((n,x)=>n+x.qty,0);
 const labourWorkingCostTHB=round(roleLines.reduce((n,x)=>n+x.monthlySalaryTHB*load/workingHoursPerMonth*x.qty,0));
 const labourWorkingSellTHB=round(labourWorkingCostTHB/laborSellDivider);
 const baseExpenses=expenseLines.filter(x=>!x.conditional);
 const optionExpenses=expenseLines.filter(x=>x.conditional);
 const baseExpenseWorkingCostTHB=round(baseExpenses.reduce((n,x)=>n+x.workingCostTHB,0));
 const baseExpenseWorkingSellTHB=round(baseExpenses.reduce((n,x)=>n+x.workingSellTHB,0));
 const conditionalWorkingCostTHB=round(optionExpenses.reduce((n,x)=>n+x.workingCostTHB,0));
 const conditionalWorkingSellTHB=round(optionExpenses.reduce((n,x)=>n+x.workingSellTHB,0));
 const baseWorkingCostTHB=round(labourWorkingCostTHB+baseExpenseWorkingCostTHB);
 const baseWorkingSellTHB=round(labourWorkingSellTHB+baseExpenseWorkingSellTHB);
 const byAccount=Object.freeze(ACCOUNTS.map(([account,label])=>{
  const rows=lines.filter(x=>x.account===account);
  return Object.freeze({account,label,rows,qtyRows:rows.length,
   baseWorkingCostTHB:round(rows.filter(x=>!x.conditional).reduce((n,x)=>n+x.workingCostTHB,0)),
   baseWorkingSellTHB:round(rows.filter(x=>!x.conditional).reduce((n,x)=>n+x.workingSellTHB,0)),
   conditionalWorkingCostTHB:round(rows.filter(x=>x.conditional).reduce((n,x)=>n+x.workingCostTHB,0)),
   conditionalWorkingSellTHB:round(rows.filter(x=>x.conditional).reduce((n,x)=>n+x.workingSellTHB,0))});
 }));
 const unique=new Set(lines.map(x=>x.id));
 if(unique.size!==lines.length||milestones.length!==19||labourHours!==242 ||
  Math.abs(labourWorkingCostTHB-80400)>0.01 || baseExpenseWorkingCostTHB!==101000 ||
  conditionalWorkingCostTHB!==47000 || baseWorkingSellTHB!==211600 ||
  conditionalWorkingSellTHB!==51700)throw Error("B1 role/activity scenario arithmetic or unique owner mismatch");
 if(roleLines.some(x=>x.wbs!=="K00"&&!coverage.rows.some(s=>s.stage===x.wbs&&s.chargeableHere)))
  throw Error("B1 support charged to duplicated K shared gate");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b1.revk-pm-milestones",
  costOwner:"B1",category:"INTERNAL_RESIDUAL_PROJECT_SUPPORT_NOT_CUSTOMER_SCOPE_RENAME",
  customerB1Description:"Engineering and design / 1 Lot — ORIGINAL CUSTOMER SCOPE UNCHANGED",
  pricingStatus:"MANAGEMENT_REQUESTED_INITIAL_ESTIMATE__CFO_REVIEW_BEFORE_CANONICAL_B1_REPLACEMENT",
  accounts:byAccount,milestones,lines,roleLines,expenseLines,roleRates:B1_SUPPORT_ROLE_RATES_0553,
  uniqueKChargeEvents:12,coveredMilestones:19,labourHours,
  employerLoadFactor:load,workHoursPerMonth:workingHoursPerMonth,
  laborGrossMarginTarget:0.20,expenseHandlingSellFactor:expenseSellFactor,
  labourWorkingCostTHB,labourWorkingSellTHB,baseExpenseWorkingCostTHB,
  baseExpenseWorkingSellTHB,baseWorkingCostTHB,baseWorkingSellTHB,
  conditionalWorkingCostTHB,conditionalWorkingSellTHB,
  engineeringBaselineWorkingSellTHB:510630.26,
  proposedB1BaseWorkingSellTHB:round(510630.26+baseWorkingSellTHB),
  previousCanonicalB1WorkingSellTHB:624030.26,
  budgetaryVsCanonicalDeltaTHB:round(510630.26+baseWorkingSellTHB-624030.26),
  actualDirectCostTHB:null,customerReleasedSellTHB:null,postingAllowed:false,
  policy:"No USD600 office-admin rate; support is role-based THB; no double posting with existing A/B2–B14; conditional legal/permit fees excluded from base; no unverified cost becomes Actual Direct Cost",
  evidence:"Rev.K K00–K18; MGW/JUTAL/ZPQ/ZWP SAT coordination; Thailand 2026 salary benchmarks; management provisional trip/transaction allowances"
 });
}
