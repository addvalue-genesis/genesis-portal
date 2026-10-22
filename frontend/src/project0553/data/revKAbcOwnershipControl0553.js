// PJ2608-0553 / READ-ONLY CFO bridge from current 10.2 B1/B3/B9 to source WBS.
// A current budget component is shown once. This overlay NEVER posts extra sell.
// Evidence: BOD-C2 + SPE-C2 + DTS-C1 + MR1..4 -> Rev.K -> role/owner/qty -> SELL.
// True internal Direct Cost remains absent until verified payroll/third party rates.
import {selectB1ProjectSupportBudget0553} from "./b1ProjectSupportBudget0553";
import {selectB3FortyDayWorkingSell0553} from "./b3FortyDayWorkingSell0553";
import {selectB3SelectedSatSurveyPrice0553} from "./b3SelectedSatSurveyPrice0553";
import {selectB3RequirementWbsTrace0553} from "./b3RequirementWbsTrace0553";
import {selectB9ChinaWorkingBudget0553} from "./b9ChinaWorkingBudget0553";
import {selectFourMrFatWbs0553} from "./fatWbsFourMr0553";
const roundRevKAbc0553=n=>Math.round((n+Number.EPSILON)*100)/100;
export function selectRevKAbcOwnershipControl0553(working){
 if(!working?.byCode)throw Error("Rev.K ABC needs current canonical 10.2 Working Sell");
 const b1=selectB1ProjectSupportBudget0553();
 const historicalB3=selectB3FortyDayWorkingSell0553();
 const b3=selectB3SelectedSatSurveyPrice0553();
 const trace=selectB3RequirementWbsTrace0553();
 const b9=selectB9ChinaWorkingBudget0553();
 const fat=selectFourMrFatWbs0553();
 const current={B1:working.byCode.B1?.workingSellTHB,B3:working.byCode.B3?.workingSellTHB,B9:working.byCode.B9?.workingSellTHB};
 if(current.B1!==b1.baseWorkingSellTHB||current.B3!==roundRevKAbc0553(b3.includedB3SatSurveyToolsWorkingSellTHB+b9.fatWorkingSellTHB+307125)||current.B9!==b9.b9BaseWorkingSellTHB||
    working.knownWorkingSellTHB!==4262586.82 ||
    working.byCode.B3?.workingSellTHB!==2599325 ||
    working.byCode.B2?.workingSellTHB!==237121.13)
  throw Error("Rev.K B1/B3/B9 / Part B canonical Working Sell divergence");
 if(working.byCode.B9.qtyDriver!==1||!working.byCode.B9.unit.startsWith("LS"))
  throw Error("B9 quoted Base must be one LS with on-call execution; no second optional posting");
 // Rev05 Engineering price/hours are not a present B1 price; retain names only
 // for technical ownership checks against B2 VDRL, B3 ITP and OEM Part A.
 const b1Engineering=b1.engineeringScopeReview.map(x=>Object.freeze({
  id:"ABC-"+x.id,wbs:x.group,owner:"B1_REVIEW",costObject:"ENGINEERING_SCOPE_OWNER_REVIEW",
  activity:x.activity,site:"Engineering responsibility TBC",source:x.source,
  quantity:null,unit:"TBC only if independently assigned",workingSellRateTHB:null,
  modeledSellTHB:null,directCostTHB:null,
  posting:"NON_POSTING_SCOPE_REVIEW__B2_B3_OEM_OVERLAP_UNRESOLVED",chargeKey:null
 }));
 const pmEvents=b1.roleLines.map(x=>Object.freeze({
  id:"ABC-"+x.id,wbs:x.wbs,owner:"B1",costObject:"ROLE_BASED_PM_ADMIN_ACCOUNTING_PROCUREMENT",
  activity:x.activity,site:"ADDVALUE project office",source:x.verification,
  quantity:x.qty,unit:"MH",workingSellRateTHB:roundRevKAbc0553(x.workingSellTHB/x.qty),
  modeledSellTHB:x.workingSellTHB,directCostTHB:null,
  posting:"INCLUDED_IN_NEW_CANONICAL_B1_SUPPORT_SELL__NOT_ADDITIVE",chargeKey:x.id
 }));
 const supportExpenses=b1.expenseLines.map(x=>Object.freeze({
  id:"ABC-"+x.id,wbs:x.wbs,owner:"B1",costObject:"PROJECT_SUPPORT_NONLABOR_EXPENSE",
  activity:x.activity,site:"Project management / office",source:x.verification,
  quantity:x.qty,unit:x.unit,workingSellRateTHB:roundRevKAbc0553(x.workingSellTHB/x.qty),
  modeledSellTHB:x.workingSellTHB,directCostTHB:null,
  posting:x.conditional?"CONDITIONAL_B1__EXCLUDED_FROM_BASE":"INCLUDED_IN_NEW_CANONICAL_B1_SUPPORT_SELL__NOT_ADDITIVE",
  chargeKey:x.id
 }));
 const satSiteLines=b3.satRows.map(x=>Object.freeze({
  id:"ABC-"+x.id,wbs:x.wbs,owner:"B3",costObject:"CURRENT_SELECTED_SAT28_TEAM_DAY",
  activity:x.work,site:x.site,source:x.wbs,
  quantity:x.days,unit:"two-person team workday",workingSellRateTHB:b3.satTeamDaySellTHB,
  modeledSellTHB:x.workingSellTHB,directCostTHB:null,
  posting:"SELECTED_28DAY_SAT_WORKING_SELL__NOT_ADDITIVE",chargeKey:x.id
 }));
 const surveyLines=b3.siteSurveyRows.map(x=>Object.freeze({
  id:"ABC-B3-"+x.id,wbs:x.wbs,owner:"B3",
  costObject:"SELECTED_BF_SURVEY_AND_TRAVEL_ALLOWANCE",activity:x.work,
  site:x.site,source:"User 2026-10-22 BF3+Travel2",quantity:x.days,unit:"two-person team workday",
  workingSellRateTHB:50400,modeledSellTHB:x.workingSellTHB,directCostTHB:null,
  posting:"SELECTED_BF_SURVEY_WORKING_BUDGET__PHYSICAL_VISIT_CONDITIONAL",
  chargeKey:x.id
 }));
 const satTool=Object.freeze({
  id:"ABC-B3-VEEX",wbs:"K16",owner:"B3",costObject:"TEMPORARY_TEST_TOOL_RENTAL",
  activity:"VeEX VePAL MX100+ test instrument 30-day rental",site:"Offshore test campaign",
  source:b3.veex.rateSource,quantity:30,unit:"rental-day",workingSellRateTHB:1000,
  modeledSellTHB:30000,directCostTHB:null,
  posting:"INCLUDED_IN_B3_SELL__NOT_B11_SPECIAL_TOOL",chargeKey:"B3-VEEX-MX100"
 });
 const satObligations=trace.B3.map(x=>Object.freeze({
  id:"ABC-"+x.id,wbs:x.wbs,owner:"B3",costObject:"TECHNICAL_REQUIREMENT_ONLY",
  activity:x.activity,site:x.location,source:x.requirementRef,
  quantity:null,unit:"TAG/Test-ID pending",workingSellRateTHB:null,modeledSellTHB:null,directCostTHB:null,
  posting:"NO_SECOND_SELL__COVERED_BY_B3_SITE_TIMEBOXES",chargeKey:null
 }));
 const fatTasks=fat.rows.map(x=>Object.freeze({
  id:"ABC-"+x.id,wbs:"K01/"+x.day,owner:"A",costObject:"OEM_FAT_TECHNICAL_TEST",
  activity:x.activity,site:"MGW facility China",source:x.requirement,
  quantity:x.hours,unit:"agenda hour",workingSellRateTHB:null,modeledSellTHB:null,directCostTHB:null,
  posting:"MGW_VENDOR_TEST_PURCHASED_ONCE_AS_B3_SERV_2_4__NOT_A_COST_POST",chargeKey:null
 }));
 const chinaExpenses=b9.rows.map(x=>Object.freeze({
  id:"ABC-"+x.id,wbs:x.wbs,owner:x.costOwner,costObject:x.optional?"YARD_SPECIALIST_OPTION":"FAT_WITNESS_DIRECT_COST_ACTIVITY",
  activity:x.description,site:x.optional?"JUTAL Zhuhai Yard (quoted Base, on-call trip)":"MGW China FAT base trip",
  source:x.evidence,quantity:x.qty,unit:x.unit,workingSellRateTHB:x.unitRateTHB,
  modeledSellTHB:x.workingSellTHB,directCostTHB:null,
  posting:x.optional?"INCLUDED_IN_CANONICAL_B9_1LS__ON_CALL_EXECUTION_NONADDITIVE":"INCLUDED_IN_CANONICAL_B3_FAT__NOT_ADDITIVE",
  chargeKey:x.expenseKey
 }));
 const rows=Object.freeze([...b1Engineering,...pmEvents,...supportExpenses,...satSiteLines,...surveyLines,satTool,...satObligations,...fatTasks,...chinaExpenses]);
 const chargeRows=[...pmEvents,...supportExpenses,...satSiteLines,...surveyLines,satTool,...chinaExpenses];
 const keys=chargeRows.map(x=>x.chargeKey);
 if(keys.length!==new Set(keys).size||rows.length!==new Set(rows.map(x=>x.id)).size||
   rows.some(x=>x.directCostTHB!==null))throw Error("Rev.K ABC duplicate Cost Object or unverified Direct Cost");
 const pmWorkingSellTHB=b1.labourWorkingSellTHB;
 const fatTHB=roundRevKAbc0553(chinaExpenses.filter(x=>x.owner==="B3").reduce((v,x)=>v+x.modeledSellTHB,0));
 const yardTHB=roundRevKAbc0553(chinaExpenses.filter(x=>x.owner==="B9").reduce((v,x)=>v+x.modeledSellTHB,0));
 if(b1Engineering.length!==27||pmEvents.length!==41||supportExpenses.length!==9||b1.labourHours!==242||trace.rows.length!==19||
   fatTasks.length!==12||fat.estimatedFatWitnessDays!==6||satSiteLines.length!==9||
   b3.satTeamDays!==28||b3.siteSurveyTeamDays!==5||historicalB3.workdays!==40||pmWorkingSellTHB!==100500||fatTHB!==422600||yardTHB!==261950)
  throw Error("Rev.K activity reconciliation mismatch");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.revk-abc-control",
  rows,pmEvents,b1Engineering,supportExpenses,satSiteLines,surveyLines,satTool,satObligations,fatTasks,chinaExpenses,
  currentWorkingSellTHB:Object.freeze({...current}),
  currentB1B3B9BaseTHB:roundRevKAbc0553(current.B1+current.B3+current.B9),
  partBBaseTHB:working.knownWorkingSellTHB,b1PmProxyTHB:0,
  b1EngineeringSellTHB:0,b1OfficePmIncludedTHB:pmWorkingSellTHB,
  b1SupportSellTHB:b1.baseWorkingSellTHB,b1SupportCostTHB:b1.baseWorkingCostTHB,
  b1ConditionalSellTHB:b1.conditionalWorkingSellTHB,b1LegacyEngineeringCarriedTHB:0,
  b3LaborSellTHB:b3.satWorkingSellTHB,b3SurveySellTHB:b3.siteSurveyWorkingSellTHB,
   b3Historical40DayLabourTHB:historicalB3.laborWorkingSellTHB,b3ToolSellTHB:b3.veexWorkingSellTHB,
  b3MgwPurchasedFatWorkingSellTHB:307125,
  b9FatBaseTHB:0,b3FatWitnessSellTHB:fatTHB,b3FatWitnessDays:fat.estimatedFatWitnessDays,b9FatWitnessDays:fat.estimatedFatWitnessDays,
  b9YardConditionalLumpSumTHB:yardTHB,b9YardQuotedInBaseTHB:current.B9,
  b9YardRole:b9.selectedYardRole,b9YardWorkdays:b9.selectedYardWorkingDays,
  b9YardTravelDays:b9.selectedYardTravelDays,b9YardCrew:b9.yardCallOutCrew,
  tracedObligations:trace.rows.length,
  verifiedDirectCostTHB:null,costState:"SOURCE_RATE_BUDGETARY_SELL__PAYROLL_VENDOR_COST_OPEN",
  postedWorkingSellDeltaTHB:0,postingAllowed:false,customerReleaseAllowed:false,
  sourceTrace:"BOD-C2/DTS-C1/SPE-C2/MR-C1 -> Rev.K K00-K18 -> 10.2 B1/B3/B9",
  gates:Object.freeze([
   "SPE §7.3.2 Yard SAT mandatory under CONTRACTOR/VENDOR RACI; ADDVALUE one Sr Engineer 7d LS included in B9 customer Base, field attendance on signed call-out only, standby labour not charged",
   "B3 owns MGW FAT 6-day / 2-witness travel and engineering-cost events; manufacturer execution remains A. Signed ITP/TAG repetition pending",
   "Use 14d for management planning per SPE; BOD 30d notice conflict remains unresolved contract precedence HOLD",
   "Post Yard SAT loose-equipment transfer to ZPQ under SPE §7.3.2 conflicts with as-installed WH assumption; seek written TQ",
   "B1 contains fresh role-based management/admin/accounting/procurement expenses ONLY; legacy B1 engineering price excluded, technical engineering ownership review nonposting; B3 owns FAT Witness",
   "B3 selected SAT28 plus BF Survey3+2 two-person team-days, FAT Witness, VeEX30 rental counted once; old 40d historic audit only, physical BF visit conditional",
   "Yard Field Telecom Specialist travels as an unbilled companion; THB48,500 minimum cash risk allowance remains nonposting until cost/margin evidence",
   "Verified Direct Cost needs actual salary, supplier receipts, Trip/Person keys; no automatic historical posting"
  ])
 });
}
