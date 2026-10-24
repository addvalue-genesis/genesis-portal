// PJ2608-0553 / 10.2 B3 — contract-separated FIELD / YARD / OFFSHORE planning.
// Evidence: BOD-0001 Rev.C2 §8, §10.4–10.5; SPE-0001 Rev.C2 §7.3.2–7.3.4.
// BOD §8 already describes prior brownfield site-survey RESULTS; this is NOT
// evidence that ADDVALUE must make a new seven-site survey trip.
// SPE §7.3.2 SAT at Fabrication Site; §7.3.3 Offshore commissioning AFTER install.
// Previous 28+2 lean "offshore SAT" grouping is historical NONPOSTING workload,
// NOT a site/yard/offshore division or an approved deployment schedule.
// Current B3 40-day/80MD SELL is a RETAINED budget number, never an execution fact.
import {selectB3LeanSatScenario0553} from "./b3LeanSatScenario0553";
import {selectB3SiteSurveyScope0553} from "./b3SiteSurveyScope0553";
import {selectB3SiteMrSatCoverage0553} from "./b3SiteMrSatCoverage0553";
import {selectB3FortyDayWorkingSell0553} from "./b3FortyDayWorkingSell0553";
const freeze=Object.freeze;
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const BF=freeze(["ZPQ","ZWP8","ZWP11"]);
const GF=freeze(["ZWP20","ZWP21","ZWP22","ZWP23"]);
const name=freeze({MR0001:"SCADA / WiMAX",MR0002:"DMR RFI BDA",MR0003:"Ex IP Phone / Sounder",MR0004:"Marine RACON"});
const source=freeze({
 bod:"https://drive.google.com/file/d/1YPVUfUIy8X5lVOHbTcQ3i6J2zc4bLTFQ/view",
 spe:"https://drive.google.com/file/d/1pa5Tlqpu65Lv1HDkNSz3XvcDCkpjVGRn/view",
 brownfieldClause:"BOD Rev.C2 §8",
 yardClause:"SPE Rev.C2 §7.3.2",
 offshoreClause:"SPE Rev.C2 §7.3.3",
 manpowerClause:"SPE Rev.C2 §7.3.4"
});
const trace=(site,matrix)=>freeze(matrix.rows.filter(x=>x.site===site).map(x=>x.id));
const detail=(site,matrix,kind,number,activity)=>freeze({
 id:(kind==="YARD"?"B3-YARD-":"B3-OFFSHORE-")+site,
 site,number,phase:kind,location:kind==="YARD"?"JUTAL Zhuhai Fabrication Yard":"Offshore "+site+" after installation",
 activity,sourceClause:kind==="YARD"?source.yardClause:source.offshoreClause,
 linkedTestIds:trace(site,matrix),
 plannedCrew:null,plannedTeamDays:null,personDays:null,
 selectedSupplierCrew:null,acceptedRaci:false,approvedITP:false,
 directCostTHB:null,plannedSellTHB:null,postingAllowed:false,
 status:kind==="YARD"?"FABRICATION_YARD_SAT_VENDOR_CONTRACTOR_RACI_DAYS_OPEN":"OFFSHORE_VENDOR_COMMISSIONING_AFTER_INSTALL__ADDVALUE_SCOPE_DAYS_OPEN"
});
export function selectB3SurveySatExecutionPlan0553(workingRow=null){
 const lean=selectB3LeanSatScenario0553(); // 28-day selected work quantity; prior 40d only historic audit
 const priorSurvey=selectB3SiteSurveyScope0553();
 const matrix=selectB3SiteMrSatCoverage0553();
 const retained=selectB3FortyDayWorkingSell0553();
 if(lean.baseTeamDays!==28||lean.internalRiskTeamDays!==2||
    lean.managementReserveTeamDays!==2||lean.crew!==2||
    retained.workdays!==40||retained.personDays!==80||
    priorSurvey.rows.length!==7||priorSurvey.alreadyPricedInCurrentSelectedB3||
    matrix.rows.length!==21)
   throw Error("B3 legacy SAT/Survey audit authorities changed; no auto-reprice");
 // New field attendance is explicitly CONDITIONAL: old BOD survey is already recorded.
 // A maximum 1 day per BF site + 2 trip-team-days is an independent estimate
 // only IF JUTAL expressly requests new ADDVALUE physical verification.
 const surveyDaysPerBF=1,surveyTripDays=2,crew=2;
 const rows=freeze(BF.map((site,i)=>{
  const orig=priorSurvey.rows.find(x=>x.site===site);
  if(!orig)throw Error("B3 BF source missing "+site);
  return freeze({
   id:"B3-SUR-PLAN-"+site,site,sequence:i+1,phase:"BF",
   location:"Existing offshore Brownfield "+site,
   purpose:orig.purpose,
   sourceId:orig.sourceId,sourceClause:source.brownfieldClause,
   previousSiteSurveyReported:true,
   physicalRevisitRequired:null,
   recommendedWork:"Review BOD §8 survey results, AFC TAG/GA, cable/radio paths and scope changes; visit only for gaps requiring physical verification",
   linkedTestIds:trace(site,matrix),
   crewProvisional:crew,provisionalTeamDaysIfCalled:surveyDaysPerBF,
   provisionalMDIfCalled:crew*surveyDaysPerBF,
   approvedCrew:null,approvedDays:null,acceptedTravelDays:null,
   siteSurveyAdditionalSellTHB:null,verifiedDirectCostTHB:null,postingAllowed:false,
   status:"PRIOR_BOD_SURVEY_EXISTS__BF_REVISIT_ON_WRITTEN_GAP_OR_CALLOUT_ONLY"
  });
 }));
 const gfExcluded=freeze(GF.map(site=>freeze({
  site,phase:"GF",activity:"AFC/GA/MTO engineering readiness review; no new separate physical survey visit established",
  separatePhysicalSurveyBudgeted:false,newPhysicalSurveyNeeded:null,
  plannedCrew:null,plannedTeamDays:null,verifiedDirectCostTHB:null,postingAllowed:false,
  status:"NO_SEPARATE_GF_PHYSICAL_SURVEY_PRICE__YARD_SAT_AND_OFFSHORE_PHASE_SEPARATE"
 })));
 const surveyProductiveDays=rows.reduce((n,r)=>n+r.provisionalTeamDaysIfCalled,0);
 const tripTeamDays=surveyTripDays;
 const rateTHBPerPersonDay=retained.rateUSDPerPersonDay*retained.fxTHBPerUSD;
 const labourRateTHBPerTeamDay=rateTHBPerPersonDay*crew;
 const onsiteLabourReferenceTHB=round(surveyProductiveDays*labourRateTHBPerTeamDay);
 const travelLabourReferenceTHB=round(tripTeamDays*labourRateTHBPerTeamDay);
 const totalSurveySellReferenceTHB=round(onsiteLabourReferenceTHB+travelLabourReferenceTHB);
 const yardRows=freeze(GF.map((s,i)=>detail(s,matrix,"YARD",i+1,
  "At Zhuhai fabrication: check telecom hardware/software, configuration, IP/VLAN, radio/voice alarms and OEM SAT ITP; signed test records. Distinct from MGW factory FAT")));
 const offshoreRows=freeze(GF.map((s,i)=>detail(s,matrix,"OFFSHORE",i+1,
  "After offshore installation: energization/readiness, RF link/coverage, Ex phone, BDA/RACON as applicable, functional performance, offshore commissioning and witnessed sign-off")));
 const historical=freeze(lean.rows.map((r,i)=>freeze({
  id:r.id,site:r.site,phase:"OLD_LEAN_REFERENCE_ONLY",wbs:r.wbs,sequence:i+1,
  oldLeanTeamDays:r.days,oldLeanMD:r.plannedPersonDays,crewAssumption:r.crew,
  work:r.work,linkedTests:r.testIds,
  approvedYardDays:null,approvedOffshoreDays:null,approvedBFFieldDays:null,
  plannedNewWorkingSellTHB:null,verifiedDirectCostTHB:null,postingAllowed:false,
  note:"Legacy 28-day global SAT estimate has NOT been divided across BF onsite, GF Yard SAT and offshore commissioning"
 })));
 const shared=freeze([
  freeze({id:"B3-INTEGRATED-SIT",activity:"Cross-site NMS/PLC/voice/radio/alarm and recovery, based on approved interface ITP",
   phase:"SIT",site:"ZPQ / network-wide",plannedTeamDays:null,crew:null,
   legacyLeanDays:3,linkedTestIds:freeze(["SAT-SIT-CROSS-MR"]),
   status:"YARD_VS_OFFSHORE_SIT_LOCATION_AND_RACI_OPEN"}),
  freeze({id:"B3-PUNCH-RETEST",activity:"Retest/corrective punch closeout and as-left signatures",
   phase:"PUNCH",site:"All applicable",plannedTeamDays:null,crew:null,
   legacyLeanDays:1,linkedTestIds:freeze(["SAT-PUNCH-RETEST"]),
   status:"AFTER_YARD_AND_OFFSHORE_ITP_ACCEPTANCE_SCOPE_OPEN"})
 ]);
 const proposedSATWithRiskSellTHB=round(lean.workingTeamDaysWithRisk*labourRateTHBPerTeamDay);
 const bfPlusOldLeanReference=round(totalSurveySellReferenceTHB+proposedSATWithRiskSellTHB);
 const currentB3=workingRow?.workingSellTHB??null;
 if(surveyProductiveDays!==3||tripTeamDays!==2||
    totalSurveySellReferenceTHB!==252000||
    historical.reduce((n,r)=>n+r.oldLeanTeamDays,0)!==28||
    yardRows.length!==4||offshoreRows.length!==4||
    shared.length!==2||lean.workingTeamDaysWithRisk!==30||
    proposedSATWithRiskSellTHB!==1512000||
    (workingRow&&currentB3!==2440425))
   throw Error("BF-only optional survey and stage-separated SAT cost/readiness boundary divergence");
 return freeze({
  moduleId:"bid.budget.working.bc.b3.field-execution-plan",
  surveyModuleId:"bid.budget.working.bc.b3.site-survey",
  satModuleId:matrix.moduleId,legacyPricingModuleId:retained.moduleId,
  basis:"BOD_C2_SECTION8_BF_OLD_SURVEY__SPE_C2_7_3_2_YARD__7_3_3_OFFSHORE",
  sources:source,
  sourceStatus:"BOD/SPE CLAUSE REQUIRED; NEW MOBILIZATION AND ADDVALUE RACI NOT ESTABLISHED",
  bfSites:BF,gfSites:GF,
  survey:freeze({
   rows,excludedGFRows:gfExcluded,crew,
   physicalRevisitApproved:false,selectedPhysicalSurveyTeamDays:3, // selected budget allowance, NOT physical work order
   provisionalPhysicalSiteDaysIfCalled:surveyProductiveDays,
   provisionalTravelTeamDaysIfCalled:tripTeamDays,
   totalTeamDaysIfCalled:surveyProductiveDays+tripTeamDays,
   totalPersonDaysIfCalled:(surveyProductiveDays+tripTeamDays)*crew,
   planningRateTHBPerPersonDay:rateTHBPerPersonDay,
   onsiteLabourSellReferenceTHB:onsiteLabourReferenceTHB,
   travelLabourSellReferenceTHB:travelLabourReferenceTHB,
   conditionalLabourSellReferenceTHB:totalSurveySellReferenceTHB,
   priorSevenSiteIllustrationTHB:453600,
   priorSevenSiteIllustrationWithdrawn:true,
   selectedWorkingSellTHB:workingRow?252000:null,verifiedDirectCostTHB:null,
   actualTravelCashCostTHB:null,releaseAllowed:false,postingAllowed:false
  }),
  yardSat:freeze({location:"JUTAL Zhuhai Fabrication Yard, China",
   rows:yardRows,applicableGF:4,confirmedAddvalueCrew:null,
   confirmedWorkingTeamDays:null,confirmedDirectCostTHB:null,
   responsibility:"CONTRACTOR/VENDOR executes per SPE §7.3.2; ADDVALUE attendance requires written scope/RACI",
   distinctFromMgwFat:true,postingAllowed:false}),
  offshore:freeze({location:"Offshore ZWP20–ZWP23 after installed and commissioned",
   rows:offshoreRows,applicableGF:4,confirmedAddvalueCrew:null,
   confirmedWorkingTeamDays:null,confirmedDirectCostTHB:null,
   responsibility:"VENDOR offshore commissioning under SPE §7.3.3; ADDVALUE subcontractor RACI/price not yet evidenced",
   postingAllowed:false}),
  shared:freeze(shared),
  sat:freeze({rows:historical,crewReference:2,
   oldLeanProductiveTeamDays:28,oldLeanProductivePersonDays:56,
   riskTeamDays:2,riskPersonDays:4,
   oldLeanWithRiskTeamDays:30,oldLeanWithRiskPersonDays:60,
   managementReserveTeamDays:2,managementReservePersonDays:4,
   noAuthoritativeNewStageTotals:true,
   actualNewDeploymentTeamDays:null,actualNewDeploymentPersonDays:null,
   scenarioLabourWithRiskReferenceTHB:proposedSATWithRiskSellTHB,
   proposedBFPlusLegacySATLabourSellReferenceTHB:bfPlusOldLeanReference,
   selectedBaselineTeamDays:40,selectedBaselinePersonDays:80,
   currentSelectedSATTeamDays:28,currentSelectedSATPersonDays:56,
   selectedBaselineLaborSellTHB:retained.laborWorkingSellTHB,
   sourceTestCount:matrix.rows.length,verifiedDirectCostTHB:null,
   postedWorkingSellTHB:null,postingAllowed:false}),
  phaseSummary:freeze({
   physicalNewSurveyRequired:null,
   confirmedNewManDays:null,
   allThreeStagesDaysEstablished:false,
   prior28Plus2IsOldPlanningComparison:false,
   sat28ProductiveSelectedWorkingBudget:true,
   includedBFSurveyBudgetAllowanceTHB:workingRow?252000:null,
   riskTwoTeamDaysNotPriced:true,
   selectedB3WorkingSellTHB:currentB3,
   BFConditionalFieldLabourReferenceTHB:totalSurveySellReferenceTHB,
   removedSevenSiteSurveyScenarioTHB:453600,
   actualVerifiedDirectCostTHB:null,
   noNewReleasePrice:true
  }),
  gates:freeze([
   "BOD §8 already contains BF survey findings. Identify a new physical verification gap before paying a second survey trip.",
   "BF ZPQ/ZWP8/ZWP11: JUTAL work permit, vessel/POB and approved scope/crew/days must precede call-out.",
   "GF ZWP20–ZWP23: no independently established physical Site Survey. Check AFC/GA/MTO remotely; perform fabrication SAT as SPE §7.3.2.",
   "GF offshore commissioning after installation is separately demanded by SPE §7.3.3; decide exactly which vendor/ADDVALUE engineers attend.",
   "Resolve whether the 28+2 previous combined SAT timebox describes Yard, Offshore, BF or duplicate interface work. Do not allocate it without signed RACI/ITP.",
   "One trip/service cost owner: B3 MGW FAT, B3 fabrication SAT, B3/B9 site support boundaries, B2 documents and B11 permanently delivered tools must not overlap.",
   "Validate actual ADDVALUE payroll, fares, vessel access, insurance and vendor costs before any Working SELL repricing."
  ]),
  quotePriceUnchanged:true,postingAllowed:false,customerReleaseAllowed:false
 });
}
