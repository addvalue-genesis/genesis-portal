// 0553 / 10.2 B3 readable site-work execution plan.
// Link CURRENT Lean 28+2 offshore execution to a SEPARATE proposed site-survey WBS.
// The 40-day/80MD amount is a RETAINED commercial SELL baseline, not field plan.
// Site Survey 1 visit-day/site and 2 travel TEAM-days are new PARAMETRIC
// ESTIMATOR ASSUMPTIONS, NOT contract-approved dates, vendor quotes or direct cost.
import {selectB3LeanSatScenario0553} from "./b3LeanSatScenario0553";
import {selectB3SiteSurveyScope0553} from "./b3SiteSurveyScope0553";
import {selectB3SiteMrSatCoverage0553} from "./b3SiteMrSatCoverage0553";
import {selectB3FortyDayWorkingSell0553} from "./b3FortyDayWorkingSell0553";
const freeze=Object.freeze,round=x=>Math.round((x+Number.EPSILON)*100)/100;
const siteSequence=freeze(["ZPQ","ZWP8","ZWP11","ZWP21","ZWP23","ZWP22","ZWP20"]);
const mrName=freeze({MR0001:"SCADA / WiMAX",MR0002:"DMR RFI-BDA",MR0003:"Ex IP Phone / Sounder",MR0004:"Marine RACON"});
export function selectB3SurveySatExecutionPlan0553(workingRow=null){
 const lean=selectB3LeanSatScenario0553(workingRow);
 const survey=selectB3SiteSurveyScope0553();
 const matrix=selectB3SiteMrSatCoverage0553(),retained=selectB3FortyDayWorkingSell0553();
 if(lean.baseTeamDays!==28||lean.internalRiskTeamDays!==2||
  lean.managementReserveTeamDays!==2||lean.crew!==2||
  retained.workdays!==40||retained.personDays!==80||
  survey.rows.length!==7||survey.alreadyPricedInCurrentSelectedB3)
  throw Error("B3 approved execution scenario / unpriced survey / retained SELL ownership changed");
 const plannedSurveyDaysPerSite=1,provisionalTravelTeamDays=2;
 const surveyRows=freeze(siteSequence.map((site,i)=>{
  const orig=survey.rows.find(x=>x.site===site);
  const tests=matrix.rows.filter(x=>x.site===site);
  if(!orig||!tests.length)throw Error("B3 survey site not linked to SAT source "+site);
  return freeze({
   id:"B3-SUR-PLAN-"+site,site,sequence:i+1,
   sourceId:orig.sourceId,sourceStatus:"PARAMETRIC_ESTIMATOR_SCENARIO__NOT_ACCEPTED_SURVEY_DURATION",
   crew:2,plannedOnsiteTeamDays:plannedSurveyDaysPerSite,
   plannedPersonDays:2*plannedSurveyDaysPerSite,
   purpose:orig.purpose,proposedActivity:[
    "Check actual equipment TAG/LIS/GA and as-installed layout",
    "Check cabling, RF route, hazardous-zone/Ex readiness and earthing/power",
    "Confirm workfront/access/witness/POB and identify design deviations"
   ],linkedTestIds:freeze(tests.map(x=>x.id)),
   deliverables:"Signed survey checklist / photos / cable-end evidence / SAT readiness punch list",
   directCostTHB:null,workingSellPostedTHB:null,approvedDate:null,
   postingAllowed:false
  });
 }));
 const surveyProductiveDays=surveyRows.reduce((s,x)=>s+x.plannedOnsiteTeamDays,0);
 const surveyTotalTeamDays=surveyProductiveDays+provisionalTravelTeamDays;
 const surveyPersonDays=surveyTotalTeamDays*2;
 const planningRateTHBPerPersonDay=retained.rateUSDPerPersonDay*retained.fxTHBPerUSD;
 const surveyOnsiteLabourSellReferenceTHB=round(surveyProductiveDays*2*planningRateTHBPerPersonDay);
 const surveyTravelLabourSellReferenceTHB=round(provisionalTravelTeamDays*2*planningRateTHBPerPersonDay);
 const surveyPlanningLabourSellReferenceTHB=round(surveyOnsiteLabourSellReferenceTHB+surveyTravelLabourSellReferenceTHB);
 const satRows=freeze(lean.rows.map((x,i)=>{
  const dayStart=1+lean.rows.slice(0,i).reduce((n,r)=>n+r.days,0);
  const dayEnd=dayStart+x.days-1;
  const tests=matrix.budgetarySiteTimeboxes.find(t=>t.id===x.id);
  if(!tests||x.testIds.length!==tests.testIds.length)
   throw Error("SAT lean timebox cannot drop existing MR tests "+x.id);
  return freeze({
   id:x.id,site:x.site,wbs:x.wbs,sequence:i+1,
   relativeWorkdayStart:dayStart,relativeWorkdayEnd:dayEnd,
   relativeWorkdayLabel:"SAT D"+dayStart+(dayStart===dayEnd?"":"–D"+dayEnd),
   crew:x.crew,productiveTeamDays:x.days,productivePersonDays:x.plannedPersonDays,
   work:x.work,mrs:x.mrs,linkedTests:x.testIds,
   systemNames:freeze(x.mrs.filter(mr=>mrName[mr]).map(mr=>mrName[mr])),
   oldPricingDays:x.originalDays,
   provisionalLabourSellTHB:x.illustrativeLabourSellTHB,
   verifiedDirectCostTHB:null,postingAllowed:false,
   plannedCalendarDate:null,personDaysNotDuplicatedAcrossMR:true
  });
 }));
 const satProductiveMD=lean.basePersonDays,satRiskMD=lean.internalRiskPersonDays;
 const satWorkingTeamDays=lean.workingTeamDaysWithRisk;
 const satLabourWithRiskTHB=round(satWorkingTeamDays*2*planningRateTHBPerPersonDay);
 const retainedB3WorkingSell=workingRow?.workingSellTHB??null;
 const selectedFat=workingRow?.b3ChinaFatBudget?.fatWorkingSellTHB??null;
 const mgwFat=workingRow?.b3MgwPurchasedFatWorkingSell?.selectedIncrementalWorkingSellTHB??null;
 const veex=retained.veex.workingSellTHB;
 const proposedSATAndFATSellTHB=Number.isFinite(selectedFat)&&Number.isFinite(mgwFat)?
  round(satLabourWithRiskTHB+veex+selectedFat+mgwFat):null;
 const proposedB3IncludingSurveySellTHB=Number.isFinite(proposedSATAndFATSellTHB)?
  round(proposedSATAndFATSellTHB+surveyPlanningLabourSellReferenceTHB):null;
 const sourceCostVerified=false;
 if(surveyProductiveDays!==7||surveyTotalTeamDays!==9||
  surveyPersonDays!==18||surveyPlanningLabourSellReferenceTHB!==453600||
  satRows.reduce((n,x)=>n+x.productiveTeamDays,0)!==28||
  satRows.reduce((n,x)=>n+x.productivePersonDays,0)!==56||
  satWorkingTeamDays!==30||satProductiveMD+satRiskMD!==60||
  satLabourWithRiskTHB!==1512000||
  (workingRow&&(retainedB3WorkingSell!==2750525||
    proposedSATAndFATSellTHB!==2246525||
    proposedB3IncludingSurveySellTHB!==2700125)))
  throw Error("B3 7-site survey + 28+2 SAT source and parametric comparison mismatch");
 return freeze({
  moduleId:"bid.budget.working.bc.b3.field-execution-plan",
  surveyModuleId:"bid.budget.working.bc.b3.site-survey",
  satModuleId:matrix.moduleId,
  legacyPricingModuleId:retained.moduleId,
  basis:"REV_K_K15_K18__LEAN_28_PLUS_2__SITE_SURVEY_7_PLUS_2_PARAMETRIC_NONPOSTING",
  locationAuthority:"7 site scope; exact travel sequence/visit date depends on vessel, permits, site readiness",
  survey:freeze({rows:surveyRows,crew:2,productiveTeamDays:7,travelTeamDays:2,
   totalTeamDays:surveyTotalTeamDays,personDays:surveyPersonDays,
   planningRateUSDPerPersonDay:retained.rateUSDPerPersonDay,
   planningRateTHBPerPersonDay,
   onsiteLabourSellReferenceTHB:surveyOnsiteLabourSellReferenceTHB,
   travelLabourSellReferenceTHB:surveyTravelLabourSellReferenceTHB,
   planningLabourSellReferenceTHB:surveyPlanningLabourSellReferenceTHB,
   approvedSurveyCrewDays:false,physicalVisitConfirmed:false,
   directCostTHB:null,materialTravelAccommodationCostTHB:null,
   vesselAccessInsuranceCostTHB:null,
   selectedWorkingSellTHB:null,workingSellPostingAllowed:false}),
  sat:freeze({rows:satRows,crew:2,productiveTeamDays:28,
   productivePersonDays:satProductiveMD,riskTeamDays:2,riskPersonDays:satRiskMD,
   executionTeamDays:satWorkingTeamDays,executionPersonDays:60,
   managementReserveTeamDays:2,managementReservePersonDays:4,
   managementReserveIncluded:false,planningRateTHBPerTeamDay:retained.rateUSDPerPersonDay*2*retained.fxTHBPerUSD,
   scenarioLabourWithRiskTHB:satLabourWithRiskTHB,
   selectedBaselineTeamDays:40,selectedBaselinePersonDays:80,
   selectedBaselineLaborSellTHB:retained.laborWorkingSellTHB,
   sourceTestCount:matrix.rows.length,verifiedDirectCostTHB:null,
   executionDateApproved:false,postingAllowed:false}),
  phaseSummary:freeze({
   surveyPlusSatPlannedTeamDays:surveyTotalTeamDays+satWorkingTeamDays,
   surveyPlusSatPlannedPersonDays:surveyPersonDays+60,
   satTravelMOBDEMOBExcluded:true,
   selectedB3WorkingSellTHB:retainedB3WorkingSell,
   scenarioB3SATFATPlusSurveySellTHB:proposedB3IncludingSurveySellTHB,
   includedExistingFATWitnessTHB:selectedFat,
   includedMGWPurchasedFATTHB:mgwFat,
   includedVeEXWorkingSellTHB:veex,
   verifiedDirectCostTHB:null,priceDifferenceNotApproved:true
  }),
  requiredEvidence:freeze([
   "Confirm actual physical pre-SAT Survey visit is required separately from prior BOD survey remarks",
   "Confirm 7 Site survey crew availability, 1-day/site productivity and transit/POB/marine access",
   "Obtain real airfare, vessel, accommodation, insurance, per diem, permits and tool costs",
   "Approve FAT-to-Survey-to-SAT schedule and JUTAL/PTTEPI handover/ITP witness readiness",
   "Approve priced 28+2 SAT and site survey revision before changing current 40-day Working SELL",
   "Do not mistake THB25,200/person-day existing internal Working SELL RATE for actual ADDVALUE payroll Direct COST"
  ]),
  quotePriceUnchanged:true,directCostVerified:sourceCostVerified,
  postingAllowed:false,customerReleaseAllowed:false
 });
}
