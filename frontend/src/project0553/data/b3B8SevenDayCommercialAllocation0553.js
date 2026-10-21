// 10.2 / B3+B8 — 7 on-site calendar workdays with 2-person team,
// 2 iFAT / 2 parallel training-readiness / 3 witnessed customer FAT days.
// Derived from management Rev.K witness and Rev00 integrated B3/B8 test branch.
// This is a PROPOSED non-posting allocation. No customer-approved China training,
// ITP compression or decision to omit current B8 44-MH preparation has been shown.
import {ONSHORE_WORKING_SELL_RATE_0553 as rate} from "./onshoreWorkingRate0553";
import {MGW_R2_COVER_20261020_0553 as cover} from "./mgwP26058R2Cover20261020";
import {makeWorkingFinancialIdentity0553,validateCostVsCommercialIdentity0553} from "./workingCostCommercialIdentity0553";

const round=v=>Math.round((v+Number.EPSILON)*100)/100;
const ROOT="bid.budget.working.bc.";
export function selectB3B8SevenDayCommercialAllocation0553({b3,b8}){
 if(!b3||b3.code!=="B3"||!b8||b8.code!=="B8")return null;
 const fat=b3.b3ChinaFatBudget,rows=fat?.rows.filter(x=>x.costOwner==="B3"&&!x.optional)||[];
 const src=id=>{const v=rows.find(r=>r.id==="B3-"+id);
  if(!v)throw Error("Missing current B3 source expense "+id);return v;};
 const staff=src("FAT-STAFF"),travel=src("TRAVEL-DAYS"),hotel=src("HOTEL");
 if(b3.workingSellTHB!==2750525||b8.workingSellTHB!==30000||
  b3.b3MgwPurchasedFatWorkingSell?.selectedIncrementalWorkingSellTHB!==307125||
  fat.fatWorkingSellTHB!==397400||rows.length!==8||
  rate.usdPerPersonDay!==600||rate.thbPerUsd!==31.5||
  staff.qty!==12||staff.unitRateTHB!==18900||
  travel.qty!==4||travel.unitRateTHB!==18900||
  hotel.qty!==14||hotel.unitRateTHB!==2500||
  b8.qtyDriver!==44||cover.FAT.internalFatDays!==2||
  cover.FAT.facilityEndUserDaysMinimum!==5)
  throw Error("B3/B8 7-day scenario diverged from prior canonical input; do not quietly update price");
 const program=Object.freeze([
  {day:1,stage:"MGW Internal iFAT 1/2",b3MD:2,b8MD:0,notes:"Readiness / internal testing with MGW"},
  {day:2,stage:"MGW Internal iFAT 2/2",b3MD:2,b8MD:0,notes:"Readiness, punch corrections, MGW documents"},
  {day:3,stage:"Training batch 1 + FAT Readiness",b3MD:1,b8MD:1,notes:"One ADDVALUE trainer; one engineer stays with MGW"},
  {day:4,stage:"Training batch 2 + FAT Readiness",b3MD:1,b8MD:1,notes:"Second batch; parallel MGW/ADDVALUE FAT setup"},
  {day:5,stage:"Formal customer FAT 1/3",b3MD:2,b8MD:0,notes:"Witnessed FAT, 4-MR ITP approval REQUIRED"},
  {day:6,stage:"Formal customer FAT 2/3",b3MD:2,b8MD:0,notes:"Witnessed functional testing"},
  {day:7,stage:"Formal customer FAT 3/3",b3MD:2,b8MD:0,notes:"Interface, punch, as-left, signing"}
 ].map(x=>Object.freeze({...x,costPostingAllowed:false})));
 const b3OnsitePersonDays=program.reduce((a,x)=>a+x.b3MD,0);
 const b8OnsitePersonDays=program.reduce((a,x)=>a+x.b8MD,0);
 const travelPersonDays=travel.qty;
 const hotelRoomNightsFor7OnsiteDays=2*(7+1);
 const hotelExtraNights=hotelRoomNightsFor7OnsiteDays-hotel.qty;
 const hotelExtraSellTHB=round(hotelExtraNights*hotel.unitRateTHB);
 const trainingAssignedSellTHB=round(b8OnsitePersonDays*rate.thbPerPersonDay);
 const newB3FatSellTHB=round(fat.fatWorkingSellTHB+hotelExtraSellTHB);
 const newB3OverallSellTHB=round(b3.workingSellTHB+hotelExtraSellTHB);
 const newB8OverallSellTHB=trainingAssignedSellTHB;
 const oldCombined=round(b3.workingSellTHB+b8.workingSellTHB);
 const newCombined=round(newB3OverallSellTHB+newB8OverallSellTHB);
 const newGrossFatTrainingTripSellTHB=round(newB3FatSellTHB+newB8OverallSellTHB);
 const identities=Object.freeze([
  makeWorkingFinancialIdentity0553("B3",{activity:"FAT"}),
  makeWorkingFinancialIdentity0553("B8",{activity:"TRN"})
 ]);
 validateCostVsCommercialIdentity0553(identities);
 if(program.length!==7||b3OnsitePersonDays!==12||b8OnsitePersonDays!==2||
  b3OnsitePersonDays+b8OnsitePersonDays!==14||
  travelPersonDays!==4||hotelExtraNights!==2||hotelExtraSellTHB!==5000||
  trainingAssignedSellTHB!==37800||newB3FatSellTHB!==402400||
  newGrossFatTrainingTripSellTHB!==440200||
  newB3OverallSellTHB!==2755525||newB8OverallSellTHB!==37800||
  oldCombined!==2780525||newCombined!==2793325||
  round(newCombined-oldCombined)!==12800||
  b3.directCostTHB!==null||b8.directCostTHB!==null)
  throw Error("B3/B8 7-day allocation math / no-extra-travel / no-double-count failed");
 return Object.freeze({
  moduleIds:Object.freeze({
   B3:ROOT+"b3.fat-training-7d-allocation",
   B8:ROOT+"b8.integrated-fat-training-7d"
  }),
  identities,program,
  sourceEventId:"MGW_FAT_TRAINING_ONE_CHINA_VISIT_7_WORKDAYS",
  sourceAuthority:"MANAGEMENT_7_DAY_INTERNAL_PROPOSAL__NOT_CUSTOMER_ACCEPTED",
  onSiteDays:7,crew:2,onsitePersonDays:14,
  b3OnsitePersonDays,b8OnsitePersonDays,
  travelDaysPerPerson:2,travelPersonDays,
  travelLabourExistingIncludedB3THB:travel.workingSellTHB,
  hotelRoomNights:hotelRoomNightsFor7OnsiteDays,
  additionalHotelNights:hotelExtraNights,
  additionalHotelSellTHB:hotelExtraSellTHB,
  b3FatWorkingSellCurrentTHB:fat.fatWorkingSellTHB,
  proposedB3FatWorkingSellTHB:newB3FatSellTHB,
  b3CurrentFatIncludingMgwPurchasedTHB:round(fat.fatWorkingSellTHB+307125),
  b3ProposedFatIncludingMgwPurchasedTHB:round(newB3FatSellTHB+307125),
  proposedB8TrainingWorkingSellTHB:newB8OverallSellTHB,
  b3CurrentWorkingSellTHB:b3.workingSellTHB,
  b8CurrentWorkingSellTHB:b8.workingSellTHB,
  b3ProposedWorkingSellTHB:newB3OverallSellTHB,
  b8ProposedWorkingSellTHB:newB8OverallSellTHB,
  currentCombinedWorkingSellTHB:oldCombined,
  proposedCombinedWorkingSellTHB:newCombined,
  currentToProposedDeltaTHB:round(newCombined-oldCombined),
  grossTripProposedWorkingSellTHB:newGrossFatTrainingTripSellTHB,
  b8SourceOriginalTrainingMH:44,
  b8TrainingContactHours:2*8,
  b8PreparationAndOtherMHToReconcile:44-16,
  mgwQuotedIFATUSD:cover.FAT.internalFatUSD,
  mgwQuotedFatFacilityUSD:cover.FAT.facilityEndUserUSD,
  vendorQuoteAlreadyInMGWCover:true,
  vendorMgwPurchasedSellAlreadyInCanonicalB3THB:307125,
  noDuplicateVendorPurchasedOnScenario:true,
  customerTrainingLocationAndTwoBatchAcceptanceConfirmed:false,
  threeDayWitnessITPAccepted:false,
  preFATSequenceAndNoticeConfirmed:false,
  hotelsAndTravelActualCostVerified:false,
  commercialFixed7DayOverrunTermConfirmed:false,
  rateHasApprovedDirectCost:false,
  verifiedDirectCostTHB:null,
  releaseAllowed:false,
  financialPostingAllowed:false,
  workingSellChangeAllowed:false,
  scenarioOnly:true,
  noDuplicateTravel:true,
  unapprovedGates:Object.freeze([
   "BOD asks Training BEFORE formal FAT and SPE expects two training batches in Yangon; on-site China integration requires written deviation/approval",
   "Customer FAT ITP original 48 test-hours vs 3 days of formal witnessed FAT; MGW pretest/test evidence and witness hold-points must be accepted",
   "B8 original 44 MH scope includes 28 MH preparation/admin outside 16 on-site contact hours; do not silently eliminate",
   "Four travel person-days and return airfare/insurance appear ONCE in B3; they are additional to 7 on-site days",
   "MGW iFAT 2 days and end-user FAT facility min 5 days are supplier costs already inside MGW overall cover; assign cost owner before any new price posting",
   "No additional personnel-day charge for overrun is a PROPOSED customer offer clause, not confirmed by contract"
  ])
 });
}
