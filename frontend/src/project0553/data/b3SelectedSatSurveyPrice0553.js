// B3 selected working-budget labour basis: user decision 22 Oct 2026.
// SAT 28 productive two-person TEAM-days (56 MD), plus independent 3 BF
// on-site Survey TEAM-days and two mobilization TEAM-days (10 MD).
// SAT pooled risk +2 TEAM-days and management reserve +2 are NOT priced.
// 40-day original basis kept strictly in b3FortyDayWorkingSell0553.js
// for audit; not a selected-priced field schedule. No verified payroll Cost.
// Engineer allocation of BF/GF SAT workfront days is still subject to RACI/ITP.
import {selectB3LeanSatScenario0553} from "./b3LeanSatScenario0553";
import {selectB3SiteSurveyScope0553} from "./b3SiteSurveyScope0553";
import {selectB3FortyDayWorkingSell0553} from "./b3FortyDayWorkingSell0553";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
// User-confirmed SAT WORKING SELL role rate revision (22 Oct 2026).
// These are not payroll or verified direct-cost rates. BF Survey is NOT repriced.
export const B3_SAT_ROLE_WORKING_SELL_RATES_0553=Object.freeze([
 Object.freeze({role:"Senior Telecom Systems Integration Engineer",usdPerPersonDay:1000,
  priceClass:"USER_SELECTED_SAT_WORKING_SELL_ONLY",directCostTHB:null}),
 Object.freeze({role:"Senior RF/Telecom Field Specialist",usdPerPersonDay:800,
  priceClass:"UNCHANGED_SAT_WORKING_SELL_ONLY",directCostTHB:null})
]);
export function selectB3SelectedSatSurveyPrice0553(){
 const old=selectB3FortyDayWorkingSell0553();
 const lean=selectB3LeanSatScenario0553(); // selected qty from latest engineering WBS
 const survey=selectB3SiteSurveyScope0553();
 const roles=old.team,people=old.persons,rate=old.rateUSDPerPersonDay*old.fxTHBPerUSD;
 const satRoleRates=Object.freeze(B3_SAT_ROLE_WORKING_SELL_RATES_0553.map(x=>
  Object.freeze({...x,fxTHBPerUSD:old.fxTHBPerUSD,
   thbPerPersonDay:round(x.usdPerPersonDay*old.fxTHBPerUSD)})));
 if(satRoleRates.length!==people||satRoleRates.some((x,i)=>x.role!==roles[i]))
  throw Error("SAT working rate revision must preserve two existing Role identities");
 const satTeamDaySellTHB=round(satRoleRates.reduce((n,x)=>n+x.thbPerPersonDay,0));
 const satRows=Object.freeze(lean.rows.map(x=>Object.freeze({
  id:x.id,site:x.site,wbs:x.wbs,days:x.days,
  mrs:x.mrs,workfront:x.id.startsWith("BF-")?"BF FIELD SAT / INTERFACE TEST":
   x.id.startsWith("GF-")?"GF FABRICATION YARD SAT + OFFSHORE COMMISSIONING POOLED PRICE; NO PHASE DUPLICATION":
   "CROSS-SITE SIT / PUNCH — EXACT EXECUTION PHASE PENDING RACI",
  executionPhaseAssigned:false,
  crew:people,plannedPersonDays:x.days*people,
  workingSellTHB:round(x.days*satTeamDaySellTHB),
  linkedTestIds:x.testIds,work:x.work,
  priceClass:"CURRENT_SELECTED_28DAY_SAT_WORKING_SELL",
  executionLocationGate:"BF / GF Fabrication Yard / Offshore Commissioning RACI requires verification",
  directCostTHB:null
 })));
 const bf=["ZPQ","ZWP8","ZWP11"];
 const surveyRows=Object.freeze([
  ...bf.map((site,i)=>Object.freeze({
   id:"SUR-"+site,site,days:1,crew:2,plannedPersonDays:2,
   workingSellTHB:round(2*rate),wbs:"BOD C2 §8",
   work:"Physical verification reserve ONLY IF JUTAL requests BF revisit",
   conditionalExecution:true,directCostTHB:null,
   priceClass:"SELECTED_WORKING_BUDGET_CONDITIONAL_BF_EXECUTION"
  })),
  Object.freeze({id:"SUR-TRAVEL",site:"BF joint survey mobilisation",days:2,crew:2,
   plannedPersonDays:4,workingSellTHB:round(4*rate),wbs:"BOD C2 §8",
   work:"Survey mobilisation/demobilisation labour planning reserve",
   conditionalExecution:true,directCostTHB:null,
   priceClass:"SELECTED_BUDGETARY_ALLOWANCE_CONDITIONAL_EXECUTION"})
 ]);
 const satDays=satRows.reduce((s,r)=>s+r.days,0);
 const satWorkingSellTHB=round(satRows.reduce((s,r)=>s+r.workingSellTHB,0));
 const surveyDays=surveyRows.reduce((s,r)=>s+r.days,0);
 const surveyWorkingSellTHB=round(surveyRows.reduce((s,r)=>s+r.workingSellTHB,0));
 const laborWorkingSellTHB=round(satWorkingSellTHB+surveyWorkingSellTHB);
 const veexWorkingSellTHB=old.veex.workingSellTHB;
 const includedB3SatSurveyToolsWorkingSellTHB=round(laborWorkingSellTHB+veexWorkingSellTHB);
 if(satDays!==28||surveyDays!==5||lean.basePersonDays!==56||
    satRoleRates[0].usdPerPersonDay!==1000||satRoleRates[1].usdPerPersonDay!==800||
    satRoleRates[0].thbPerPersonDay!==31500||satRoleRates[1].thbPerPersonDay!==25200||
    satWorkingSellTHB!==1587600||surveyWorkingSellTHB!==252000||
    laborWorkingSellTHB!==1839600||includedB3SatSurveyToolsWorkingSellTHB!==1869600||
    old.laborWorkingSellTHB!==2016000||bf.some(site=>!survey.rows.some(r=>r.site===site))||
    lean.riskTeamDays!==undefined)
  throw Error("B3 selected 28 SAT +5 BF Survey working-price day arithmetic/source changed");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b3.selected-sat-survey-28plus5",
  satRows,siteSurveyRows:surveyRows,satRoleRates,satTeamDaySellTHB,
  satSeniorRateUSDPerPersonDay:1000,satSpecialistRateUSDPerPersonDay:800,
  satSeniorRateRevisionDeltaTHB:round(28*(1000-800)*old.fxTHBPerUSD),
  satPriorTwoAt800ReferenceTHB:1411200,
  rateTHBPerPersonDay:rate, // BF survey reference ONLY (two roles USD800); NOT SAT uniform rate
  sourceRateUSDPerPersonDay:old.rateUSDPerPersonDay,fxTHBPerUSD:old.fxTHBPerUSD,
  satTeamDays:28,satPersonDays:56,satWorkingSellTHB,
  siteSurveyTeamDays:5,siteSurveyPersonDays:10,siteSurveyWorkingSellTHB:surveyWorkingSellTHB,
  pricedLaborTeamDays:33,pricedLaborPersonDays:66,laborWorkingSellTHB,
  veex:old.veex,veexWorkingSellTHB,
  includedB3SatSurveyToolsWorkingSellTHB,
  retainedHistorical40DayWorkingSellTHB:old.laborWorkingSellTHB,
  retainedHistorical40DayTeamDays:old.workdays,
  riskTeamDaysNotIncluded:lean.internalRiskTeamDays,
  managementReserveTeamDaysNotIncluded:lean.managementReserveTeamDays,
  B3FatAndPurchasedOutsideThisModel:true,
  siteSurveyBudgetAllowanceSelected:true,siteSurveyPhysicalVisitConfirmed:false,
  siteSurveyAllowanceExecutionConditional:true,
  siteSurveyActualTravelPOBInsuranceCostTHB:null,
  siteSurveyAllowanceIncludedInSelectedWorkingBudget:true,
  directCostTHB:null,customerReleaseAllowed:false,
  sourceAuthority:"USER_SELECTED_SAT28_SENIOR_USD1000_SPECIALIST_USD800_BF_SURVEY_2XUSD800_20261022",
  satRateRevisionApprovedForWorkingBudget:true,satRateRevisionCustomerReleaseApproved:false
 });
}
