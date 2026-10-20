// PJ2608-0553 / 10.2 B3+B8 7-day integrated FAT and customer training.
// Management planning strategy only: one trainer + one FAT readiness engineer on days 3/4.
// ALL 7 on-site days are already priced in existing proposed B3 FAT package.
// B8 receives an ownership RECLASS of two person-days, not two extra charged days.
// Contract holds: BOD training before FAT; SPE two Yangon training batches.
// This model NEVER overwrites canonical Working SELL, payroll COST or Customer Release.
import {selectB3Fat2Plus5PricingScenario0553} from "./b3Fat2Plus5PricingScenario0553";
import {ONSHORE_WORKING_SELL_RATE_0553 as rate} from "./onshoreWorkingRate0553";
import {selectB3RequirementWbsTrace0553} from "./b3RequirementWbsTrace0553";
import {selectBcExecutionComplianceAudit0553} from "./bcExecutionComplianceAudit0553";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const B3="bid.budget.working.bc.b3",B8="bid.budget.working.bc.b8";
export function selectB3B8IntegratedFatTraining0553(b3,b8){
 if(!b3||!b8||b3.code!=="B3"||b8.code!=="B8")return null;
 const gross=selectB3Fat2Plus5PricingScenario0553(b3);
 const requirement=selectB3RequirementWbsTrace0553().rows.find(r=>r.id==="RQM-18");
 const audit=selectBcExecutionComplianceAudit0553();
 const beforeFat=audit.requirements.find(r=>r.id==="AUD-023");
 if(!requirement||requirement.costOwner!=="B8"||!requirement.requiredResult.includes("2 batches")||
  !requirement.requiredResult.includes("Yangon")||
  !beforeFat||beforeFat.code!=="B8"||!beforeFat.finding.includes("before FAT"))
  throw Error("B8 contractual training-before-FAT / Yangon 2-batch gate was not preserved");
 const program=Object.freeze([
  {day:1,stage:"Internal iFAT 1/2",b3PersonDays:2,b8PersonDays:0,
   work:"MGW and ADDVALUE internal test execution, configuration and punch correction"},
  {day:2,stage:"Internal iFAT 2/2",b3PersonDays:2,b8PersonDays:0,
   work:"MGW and ADDVALUE internal readiness verification before customer invitation"},
  {day:3,stage:"Training batch 1 / Customer FAT window",b3PersonDays:1,b8PersonDays:1,
   work:"One ADDVALUE trainer; second engineer handles FAT readiness/ITP evidence with MGW"},
  {day:4,stage:"Training batch 2 / Customer FAT window",b3PersonDays:1,b8PersonDays:1,
   work:"Second training batch; second engineer completes FAT readiness and bench retests"},
  {day:5,stage:"Customer FAT 1/3",b3PersonDays:2,b8PersonDays:0,
   work:"Customer witness functional systems FAT per agreed compressed ITP and test evidence"},
  {day:6,stage:"Customer FAT 2/3",b3PersonDays:2,b8PersonDays:0,
   work:"Customer witness remaining MR0001–MR0004 test points with MGW/OEM support"},
  {day:7,stage:"Customer FAT 3/3 / handover",b3PersonDays:2,b8PersonDays:0,
   work:"Cross-MR interfaces, punch, signoff, as-left documentation; ship to JUTAL after FAT acceptance"}
 ].map(x=>Object.freeze({...x,postingAllowed:false})));
 const sum=(k)=>program.reduce((n,x)=>n+x[k],0);
 const b3MD=sum("b3PersonDays"),b8MD=sum("b8PersonDays");
 const trainingContactHours=2*rate.workingHoursPerDay;
 const trainingExistingBasisMH=b8.qtyDriver;
 const trainingPreparationOrOtherMHToVerify=trainingExistingBasisMH-trainingContactHours;
 const assignedTrainingSell=round(b8MD*rate.thbPerPersonDay);
 const proposedB3Fat=round(gross.proposalFatSellTHB-assignedTrainingSell);
 const proposedB3Overall=round(b3.workingSellTHB+(proposedB3Fat-gross.currentFatSellTHB));
 const proposedB8Overall=assignedTrainingSell;
 const combinedCurrent=round(b3.workingSellTHB+b8.workingSellTHB);
 const combinedProposed=round(proposedB3Overall+proposedB8Overall);
 const netChange=round(combinedProposed-combinedCurrent);
 const totalOnsiteMD=b3MD+b8MD;
 if(gross.onsiteDays!==7||gross.onsitePersonDays!==14||
  rate.usdPerPersonDay!==600||rate.thbPerUsd!==31.5||
  b8.workingSellTHB!==30000||b3.workingSellTHB!==2443400||
  gross.proposalFatSellTHB!==440200||gross.travelPersonDays!==4||
  program.length!==7||totalOnsiteMD!==14||b3MD!==12||b8MD!==2||
  assignedTrainingSell!==37800||proposedB3Fat!==402400||
  proposedB3Overall!==2448400||proposedB8Overall!==37800||
  combinedCurrent!==2473400||combinedProposed!==2486200||netChange!==12800||
  trainingExistingBasisMH!==44||trainingContactHours!==16||
  trainingPreparationOrOtherMHToVerify!==28||b3.directCostTHB!==null||b8.directCostTHB!==null)
  throw Error("B3/B8 seven-day single-staff-hour price and contractual source did not reconcile");
 return Object.freeze({
  moduleIds:Object.freeze({B3:B3+".fat-training-7d-allocation",B8:B8+".integrated-fat-training-7d"}),
  program:Object.freeze(program),
  personnel:2,onsiteDays:7,internalIFATDays:2,customerWindowDays:5,
  trainingWithinCustomerWindowDays:2,formalCustomerFATDays:3,
  b3PersonDays:b3MD,b8PersonDays:b8MD,totalPersonDays:totalOnsiteMD,
  rateUSD:rate.usdPerPersonDay,rateTHB:rate.thbPerPersonDay,fxTHBPerUSD:rate.thbPerUsd,
  onsiteLabourSellTHB:round(totalOnsiteMD*rate.thbPerPersonDay),
  travelPersonDays:gross.travelPersonDays,travelSeparate:true,
  hotelNightsPerPerson:gross.hotelNightsPerPerson,
  originalGrossPackageScenarioTHB:gross.proposalFatSellTHB,
  proposedB3FatTHB:proposedB3Fat,
  proposedB8TrainingTHB:proposedB8Overall,
  proposedB3OverallTHB:proposedB3Overall,proposedB8OverallTHB:proposedB8Overall,
  currentB3THB:b3.workingSellTHB,currentB8THB:b8.workingSellTHB,
  currentCombinedTHB:combinedCurrent,proposedCombinedTHB:combinedProposed,
  combinedDeltaTHB:netChange,
  originalB8TrainingBasisMH:trainingExistingBasisMH,
  proposedOnsiteTrainingContactHours:trainingContactHours,
  trainingPrepOtherMHNeedReconciliation:trainingPreparationOrOtherMHToVerify,
  pricingRule:"ONE_TEAM_SEVEN_ONSITE_DAYS_RECLASS_TWO_TRAINER_PERSONDAYS_TO_B8__NO_DUPLICATE_B3",
  customerFixedLumpSumWorkingProposal:true,
  inScopeDayOverrunNoExtraPersonnelDayBillingProposed:true,
  extraScopeChangeRequiresWrittenApproval:true,
  siteLocationChangeRequiresContractClarification:true,
  trainingBeforeCustomerFatSequencePlanned:true,
  twoYangonBatchesContractSatisfied:false,
  customerAcceptanceOfChinaOrRemoteTrainingConfirmed:false,
  shortenedFormalFATITPAccepted:false,
  signedTrainingAttendanceAndMaterialsConfirmed:false,
  trainingPreparationHoursPricedCompletenessConfirmed:false,
  noSupplierServiceCostAdded:true,
  actualDirectCostTHB:null,postedToCanonicalWorkingSell:false,
  customerReleaseAllowed:false,
  gates:Object.freeze([
   {id:"B8-BOD-BEFORE-FAT",source:"AUD-023 / BOD-C2 §10.1",state:"REQUIRES_CLIENT_SEQUENCE_ACCEPTANCE",detail:"Place training before formal Customer FAT, not merely after signoff; source wording relative to internal iFAT must be confirmed"},
   {id:"B8-YANGON-2BATCH",source:"RQM-18 / SPE §7.4 and §9",state:"REQUIRES_CLIENT_LOCATION_ACCEPTANCE",detail:"Contract cites two Yangon training batches; China FAT-room or remote training is NOT automatically equivalent"},
   {id:"B3-ITP-48H",source:"fatWbsFourMr0553 / FAT 12 tasks 48h",state:"REQUIRES_AGREED_COMPRESSED_ITP",detail:"Historical 48h test plan must be covered by MGW pretest evidence + 3 days witnessed FAT; no mandatory hold point may be omitted"},
   {id:"B8-44MH",source:"partBCWorkingWbs0553 / B8",state:"TRAINING_PREPARATION_SCOPE_RECONCILE",detail:"44MH historical training basis vs 16h onsite teaching; 28MH document development/preparation/administration not automatically eliminated"},
   {id:"FAT-FIXED-7D",source:"Management no-additional-fee direction",state:"PROPOSED_COMMERCIAL_POLICY",detail:"No extra ADDVALUE personnel day charges for in-scope overrun; scope/customer change needs written approval; project overrun direct cost risk remains ADDVALUE"}
  ])
 });
}
