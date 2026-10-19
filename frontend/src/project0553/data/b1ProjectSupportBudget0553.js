// PJ2608-0553 / B1.1–B1.8: internal project support, management and residual expense PLANNING ledger.
// Customer's original B1 label remains "Engineering and design" (1 Lot).
// Current B1 is derived only from NEW multi-role project-support activities.
// Legacy engineering 964 MH and all legacy historical prices are EXCLUDED from B1 price.
// Independent technical engineering remains scope review only until ADDVALUE vs OEM/B2 verified.
// Role/month rates are THB 2026 Thailand indicative salary assumptions,
// not ADDVALUE payroll. 22 workdays x 8h, 20% employer-cost loading;
// 20% target gross margin on labor; 10% handling uplift on non-labor.
// K groups are unique events (K03-07 and K08-11 shared); physical B2/B3/B5/B6/B9 excluded.
import {selectB1RevKMilestoneCoverage0553} from "./b1RevKMilestoneCoverage0553";
import {B1_WBS_ACTIVITIES} from "./bcWorkCostLines0553";
const roundB1Support0553=n=>Math.roundB1Support0553((n+Number.EPSILON)*100)/100;
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
   const loadedRateTHB=roundB1Support0553(info.monthlyTHB*load/workingHoursPerMonth);
   const exactWorkingCostTHB=info.monthlyTHB*load/workingHoursPerMonth*mh;
   return Object.freeze({
    id:"B1-ROLE-"+row.stage+"-"+role,wbs:row.stage,chargeEventKey:row.chargeEventKey,
    account:info.account,activity:row.phase+" — "+info.name+" support",
    role,roleName:info.name,monthlySalaryTHB:info.monthlyTHB,qty:mh,unit:"MH",
    unitCostTHB:loadedRateTHB,workingCostTHB:roundB1Support0553(exactWorkingCostTHB),
    workingSellTHB:roundB1Support0553(exactWorkingCostTHB/laborSellDivider),conditional:false,
    costOwner:"B1",workingCostClass:"PLANNING_EMPLOYER_LOADED_COST_NOT_VERIFIED_PAYROLL",
    directCostTHB:null,verification:"Distinct office support only; "+row.directOwner+" remains separate"
   });
  });
  return Object.freeze({stage:row.stage,moduleId:row.moduleId,phase:row.phase,
   chargeOwnerStage:row.chargeOwnerStage,chargeableHere:row.chargeableHere,
   sharedStages:coverage.rows.filter(x=>x.chargeOwnerStage===row.stage).map(x=>x.stage),
   rows:assigned,estimatedMH:assigned.reduce((n,x)=>n+x.qty,0),
   budgetaryCostTHB:roundB1Support0553(assigned.reduce((n,x)=>n+x.workingCostTHB,0)),
   workingSellTHB:roundB1Support0553(assigned.reduce((n,x)=>n+x.workingSellTHB,0)),
   executionCostOwner:row.directOwner,deliverable:row.deliverable});
 });
 const roleLines=milestones.flatMap(x=>x.rows);
 const expenseLines=NON_LABOR.map(x=>Object.freeze({...x,costOwner:"B1",role:"EXTERNAL_OR_ALLOWANCE",
  workingCostTHB:roundB1Support0553(x.qty*x.unitCostTHB),
  workingSellTHB:roundB1Support0553(x.qty*x.unitCostTHB*expenseSellFactor),
  directCostTHB:null,workingCostClass:"PLANNING_PROJECT_EXPENSE_NOT_VERIFIED",
  verification:x.gate}));
 const engineeringScopeReview=Object.freeze(B1_WBS_ACTIVITIES.map(([group,activity],i)=>{
  const id="B1-ENG-REVIEW-"+String(i+1).padStart(2,"0");
  // No historical engineering MH, proxy costs or sell values are ever used here.
  const lower=activity.toLowerCase();
  const isTest=lower.includes("test technical content");
  const isVdrl=lower.includes("ga /")||lower.includes("ifc /")||lower.includes("internal check / revision");
  const status=isTest?"B3_ITP_TEST_PREPARATION_NOT_B1":
   isVdrl?"B2_VDRL_OR_OEM_DRAWING_HOLD":
   "B1_TECHNICAL_ENGINEERING_SCOPE_REVIEW_PENDING_ADDVALUE_RACI";
  return Object.freeze({id,group,activity,source:"Rev05 engineering activity TITLE only / MR/BOD/DTS review",
   proposedOwner:isTest?"B3":isVdrl?"B2_OR_A_OEM":"B1_CANDIDATE",
   status,ownerVerified:false,nonDuplicateApproval:false,
   quantityMH:null,workingCostTHB:null,workingSellTHB:null,directCostTHB:null,
   postingAllowed:false,gate:"Compare deliverable, TAG, MGW Part A inclusion and B2 VDRL + B3 test ownership before fresh B1 rate/MH pricing"});
 }));
 const lines=Object.freeze([...roleLines,...expenseLines]);
 const labourHours=roleLines.reduce((n,x)=>n+x.qty,0);
 const labourWorkingCostTHB=roundB1Support0553(roleLines.reduce((n,x)=>n+x.monthlySalaryTHB*load/workingHoursPerMonth*x.qty,0));
 const labourWorkingSellTHB=roundB1Support0553(labourWorkingCostTHB/laborSellDivider);
 const baseExpenses=expenseLines.filter(x=>!x.conditional);
 const optionExpenses=expenseLines.filter(x=>x.conditional);
 const baseExpenseWorkingCostTHB=roundB1Support0553(baseExpenses.reduce((n,x)=>n+x.workingCostTHB,0));
 const baseExpenseWorkingSellTHB=roundB1Support0553(baseExpenses.reduce((n,x)=>n+x.workingSellTHB,0));
 const conditionalWorkingCostTHB=roundB1Support0553(optionExpenses.reduce((n,x)=>n+x.workingCostTHB,0));
 const conditionalWorkingSellTHB=roundB1Support0553(optionExpenses.reduce((n,x)=>n+x.workingSellTHB,0));
 const baseWorkingCostTHB=roundB1Support0553(labourWorkingCostTHB+baseExpenseWorkingCostTHB);
 const baseWorkingSellTHB=roundB1Support0553(labourWorkingSellTHB+baseExpenseWorkingSellTHB);
 const byAccount=Object.freeze(ACCOUNTS.map(([account,label])=>{
  const rows=lines.filter(x=>x.account===account);
  const rawWorkingCost=x=>x.role==="EXTERNAL_OR_ALLOWANCE"?x.workingCostTHB:x.monthlySalaryTHB*load/workingHoursPerMonth*x.qty;
  return Object.freeze({account,label,rows,qtyRows:rows.length,
   baseWorkingCostTHB:roundB1Support0553(rows.filter(x=>!x.conditional).reduce((n,x)=>n+rawWorkingCost(x),0)),
   baseWorkingSellTHB:roundB1Support0553(rows.filter(x=>!x.conditional).reduce((n,x)=>n+x.workingSellTHB,0)),
   conditionalWorkingCostTHB:roundB1Support0553(rows.filter(x=>x.conditional).reduce((n,x)=>n+x.workingCostTHB,0)),
   conditionalWorkingSellTHB:roundB1Support0553(rows.filter(x=>x.conditional).reduce((n,x)=>n+x.workingSellTHB,0))});
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
  pricingStatus:"MANAGEMENT_REQUESTED_ROLE_BASED_WORKING_BUDGET__CANONICAL_B1_NO_LEGACY_PRICE",
  accounts:byAccount,milestones,lines,roleLines,expenseLines,roleRates:B1_SUPPORT_ROLE_RATES_0553,
  uniqueKChargeEvents:12,coveredMilestones:19,labourHours,
  employerLoadFactor:load,workHoursPerMonth:workingHoursPerMonth,
  laborGrossMarginTarget:0.20,expenseHandlingSellFactor:expenseSellFactor,
  labourWorkingCostTHB,labourWorkingSellTHB,baseExpenseWorkingCostTHB,
  baseExpenseWorkingSellTHB,baseWorkingCostTHB,baseWorkingSellTHB,
  conditionalWorkingCostTHB,conditionalWorkingSellTHB,
  engineeringScopeReview,retainedEngineeringPriceTHB:null,
  proposedB1BaseWorkingSellTHB:baseWorkingSellTHB,
  canonicalB1WorkingSellTHB:baseWorkingSellTHB,
  canonicalPriceSource:"NEW_2026_ROLE_ACTIVITY_RESOURCE_COST_ONLY",
  historicalEngineeringCarryForwardTHB:0,
  historicalPmCarryForwardTHB:0,
  actualDirectCostTHB:null,customerReleasedSellTHB:null,postingAllowed:false,
  policy:"No USD600 office-admin rate; support is role-based THB; no double posting with existing A/B2–B14; conditional legal/permit fees excluded from base; no unverified cost becomes Actual Direct Cost",
  evidence:"Rev.K K00–K18; MGW/JUTAL/ZPQ/ZWP SAT coordination; Thailand 2026 salary benchmarks; management provisional trip/transaction allowances"
 });
}
