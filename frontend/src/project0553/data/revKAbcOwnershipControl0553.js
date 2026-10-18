// PJ2608-0553 / Rev.K B1-B3-B9 Activity-Based Commercial Cost Control.
// READ ONLY: this is a reconciliation/crosswalk, not a new cost or SELL posting.
// Source hierarchy: BOD-C2 + DTS-C1 + SPE-C2 + MR-C1 -> Rev.K -> Activity/Owner -> Ledger.
import {selectB1RevKMilestoneCoverage0553} from "./b1RevKMilestoneCoverage0553";
import {selectB3RequirementWbsTrace0553} from "./b3RequirementWbsTrace0553";
import {selectB9ChinaWorkingBudget0553} from "./b9ChinaWorkingBudget0553";

const roundRevKAbc0553=n=>Math.roundRevKAbc0553((n+Number.EPSILON)*100)/100;
export function selectRevKAbcOwnershipControl0553(working){
 if(!working?.byCode)throw Error("Rev.K ABC requires canonical 10.2 Working Sell projection");
 const b1=selectB1RevKMilestoneCoverage0553();
 const trace=selectB3RequirementWbsTrace0553();
 const b9=selectB9ChinaWorkingBudget0553();
 const current={B1:working.byCode.B1?.workingSellTHB,B3:working.byCode.B3?.workingSellTHB,B9:working.byCode.B9?.workingSellTHB};
 if(current.B1!==510000||current.B3!==1965600||current.B9!==226200||working.knownWorkingSellTHB!==4234390.69)
  throw Error("Rev.K ABC canonical B1/B3/B9/Part B Working Sell diverged");
 if(working.byCode.B9.qtyDriver!==1||!working.byCode.B9.unit.startsWith("LS"))
  throw Error("Rev.K B9 customer Working Sell must display one FAT Base LS; Yard LS separate");
 const pmRateTHBPerHour=b1.rate.thbPerPersonDay/8;
 const pmEvents=b1.rows.filter(x=>x.chargeableHere).map(x=>Object.freeze({
  id:"ABC-"+x.chargeEventKey,wbs:x.stage,owner:"B1",costObject:"OFFICE_PM_EVENT",
  activity:x.what,site:"Office / management",source:x.deliverable,
  quantity:x.planningPmHours,unit:"MH",workingSellRateTHB:pmRateTHBPerHour,
  modeledSellTHB:roundRevKAbc0553(x.planningPmHours*pmRateTHBPerHour),directCostTHB:null,
  posting:"NON_POSTING_PROXY__INSIDE_UNCHANGED_B1_BASELINE",chargeKey:x.chargeEventKey
 }));
 const satObligations=trace.B3.map(x=>Object.freeze({
  id:"ABC-"+x.id,wbs:x.wbs,owner:"B3",costObject:"TEST_REQUIREMENT_NOT_EXPENSE",
  activity:x.activity,site:x.location,source:x.requirementRef,
  quantity:null,unit:"TEST_ID_SITE_TAG_PENDING",workingSellRateTHB:null,modeledSellTHB:null,directCostTHB:null,
  posting:"NON_POSTING_REQUIREMENT__B3_SELL_IS_AGGREGATE",chargeKey:null
 }));
 const chinaExpenses=b9.rows.map(x=>Object.freeze({
  id:"ABC-"+x.id,wbs:x.wbs,owner:"B9",costObject:"CHINA_EXPENSE_EVENT",
  activity:x.description,site:x.optional?"JUTAL Zhuhai Yard; separate conditional trip":"MGW China FAT; base trip",
  source:x.evidence,quantity:x.qty,unit:x.unit,workingSellRateTHB:x.unitRateTHB,
  modeledSellTHB:x.workingSellTHB,directCostTHB:null,
  posting:x.optional?"CONDITIONAL_1LS__NOT_IN_BASE":"LINKED_TO_CANONICAL_B9_BASE__NOT_ADDITIVE",
  chargeKey:x.expenseKey
 }));
 const rows=Object.freeze([...pmEvents,...satObligations,...chinaExpenses]);
 const keys=[...pmEvents,...chinaExpenses].map(x=>x.chargeKey);
 if(keys.length!==new Set(keys).size||rows.length!==new Set(rows.map(x=>x.id)).size)
  throw Error("Rev.K ABC duplicate unique expense-event or obligation identity");
 const pmProxyTHB=roundRevKAbc0553(pmEvents.reduce((v,x)=>v+x.modeledSellTHB,0));
 const fatTHB=roundRevKAbc0553(chinaExpenses.filter(x=>x.posting.startsWith("LINKED")).reduce((v,x)=>v+x.modeledSellTHB,0));
 const yardTHB=roundRevKAbc0553(chinaExpenses.filter(x=>x.posting.startsWith("CONDITIONAL")).reduce((v,x)=>v+x.modeledSellTHB,0));
 if(pmEvents.length!==12||b1.rows.length!==19||trace.rows.length!==19||pmProxyTHB!==132300||
    fatTHB!==current.B9||yardTHB!==233600||b9.selectedYardWorkingDays!==7||b9.yardCallOutCrew!==1)
  throw Error("Rev.K ABC unique PM / FAT / conditional Yard reconciliation failed");
 if(rows.some(x=>x.directCostTHB!==null))throw Error("Unverified Direct Cost must not be posted");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.revk-abc-control",
  rows,pmEvents,satObligations,chinaExpenses,
  currentWorkingSellTHB:Object.freeze({...current}),
  currentB1B3B9BaseTHB:roundRevKAbc0553(current.B1+current.B3+current.B9),
  partBBaseTHB:working.knownWorkingSellTHB,
  b1PmProxyTHB:pmProxyTHB,
  b9FatBaseTHB:fatTHB,b9YardConditionalLumpSumTHB:yardTHB,
  b9YardRole:b9.selectedYardRole,b9YardWorkdays:b9.selectedYardWorkingDays,
  b9YardTravelDays:b9.selectedYardTravelDays,b9YardCrew:b9.yardCallOutCrew,
  tracedObligations:trace.rows.length,
  verifiedDirectCostTHB:null,
  costState:"NOT_ESTABLISHED__SOURCE_QUANTITY_RATE_COST_OWNER_RACI_PENDING",
  postedWorkingSellDeltaTHB:0,
  postingAllowed:false,customerReleaseAllowed:false,
  sourceTrace:"BOD-C2/DTS-C1/SPE-C2/MR-C1 -> Rev.K K00-K18 -> 10.2 B1/B3/B9",
  gates:Object.freeze([
   "SPE §7.3.2 Yard SAT is mandatory, ADDVALUE attendance is conditional upon signed RACI or written call-out",
   "Offshore B3 execution requires site/TAG/Test-ID acceptance and approved manpower/crew trip calendar",
   "B1 56 MH proxy is within existing 510,000 THB and must not be added again",
   "B9 7-day 1-person Senior Engineer Yard LS is separate trip, excluded from base",
   "Direct Cost requires unique ExpenseID/TripID/PersonID, verified hours/quantity/rates and real supplier evidence"
  ])
 });
}
