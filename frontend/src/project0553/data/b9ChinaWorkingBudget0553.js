// PJ2608-0553 / current SAMTEL lump-sum execution B3 and separate unchanged B9 Yard package.
// Historical China trip rows remain nonposting evidence; current quantities/rates are provisional Working SELL.
// MGW supplies MR0002 equipment only. ADDVALUE executes, SAMTEL provides warehouse access.
import {ONSHORE_WORKING_SELL_RATE_0553} from "./onshoreWorkingRate0553";
import {selectFourMrFatWbs0553} from "./fatWbsFourMr0553";
import {makeInternalCostLineId0553} from "./workingCostCommercialIdentity0553";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const r=ONSHORE_WORKING_SELL_RATE_0553;
const seniorRate=r.roleRates.seniorTelecomEngineerTHBPerPersonDay;
const fieldRate=r.thbPerPersonDay; // USD600/MD × FX31.5
const sharedFatPaidRoleBlendedRate=round((seniorRate+r.thbPerPersonDay)/2); // 2 different paid roles: 700 + 600, no extra headcount
const historicalAssumptionRows=[
 ["FAT-STAFF","K01","China MGW OEM FAT — PM/Chief Engineer + Senior Telecom Engineer (2 paid witnesses)","person-day",12,sharedFatPaidRoleBlendedRate,"USER_APPROVED_ONSHORE_ROLE_RATES__6_FAT_DAYS_PRE_AWARD","4-MR detailed FAT WBS: 6 days × 2 paid witnesses, with one standby Field Telecom Specialist unbilled. MGW execution & signed ITP pending"],
 ["YARD-STAFF","K08-K12","Senior Telecom Systems Integration Engineer — on-call Yard configuration/integration support","person-day",7,seniorRate,"CONDITIONAL_SR_TELECOM_ENGINEER__7_WORKDAYS_LS","SPE §7.3.2 / §7.3.4: vendor site support at onshore rate when requested. One Sr Telecom Engineer for maximum seven working days; verify post-FAT approved config before changing anything."],
 ["YARD-TRAVEL-DAYS","K08-K12","Senior Telecom Engineer separate Yard trip — mobilization and demobilization labor","person-day",2,seniorRate,"YARD_CALL_OUT_CONDITIONAL","One Sr Telecom Engineer × 2 travel days; separate from FAT witness travel and counted once."],
 ["YARD-FIELD-STAFF","K08-K12","Field Telecom Technician — on-call Yard integration and installation support","person-day",7,fieldRate,"USER_20261022_B9_SECOND_PAID_FIELD_TECH_7_WORKDAYS","One additional Field Technician alongside Senior; 7 original Yard workdays unchanged; CCL Item31 18 Yard days is a separate open scope gap."],
 ["YARD-FIELD-TRAVEL-DAYS","K08-K12","Field Telecom Technician — same 2 Yard mobilization/demobilization travel days","person-day",2,fieldRate,"USER_20261022_B9_SECOND_PAID_FIELD_TECH_2_TRAVEL_DAYS","Same trip as Senior; 2 original travel days unchanged, no extra trip posted."],
 ["YARD-AIRFARE","K08-K12","BKK–China–BKK return airfare for Senior + Field Technician, separate Yard call-out","return ticket",2,15000,"YARD_CALL_OUT_CONDITIONAL","Two paid B9 persons on same call-out trip; budget only, not booked flights."],
 ["TRAVEL-DAYS","K01","BKK-China-BKK mobilization/demobilization labour counted ONCE","person-day",4,sharedFatPaidRoleBlendedRate,"REV05_CN01_CN11_TRAVEL_DAYS_TRANSFERRED_TO_FAT_VISIT","Rev05 12 Yard team-days included 2 travel team-days; base visitor travel counted once"],
 ["AIRFARE","K01","BKK–China–BKK round trip economy airfare, both staff","return ticket",2,15000,"MARKET_COMPARABLE_PLUS_BOOKING_ALLOWANCE","BKK–Guangzhou airline round-trip indicative fares ~THB8–20k; actual itinerary/FAT location not confirmed"],
 ["HOTEL","K01","China business hotel for six-day FAT visit (7 nights per staff)","room-night",14,2500,"BUSINESS_HOTEL_BUDGETARY_ALLOWANCE","7 nights × 2 people = 14 room-nights; six FAT witness days + travel, venue and check-in schedule provisional"],
 ["HOTEL-YARD","K08-K12","Senior + Field Technician hotel for separate 7-day Yard assignment","room-night",18,2500,"YARD_CALL_OUT_CONDITIONAL","9 nights each × 2 people; separate from MGW FAT trip; vendor price unverified"],
 ["YARD-VISA","K08-K12","Additional visa/work permit reserve for separate Yard assignment","person",2,4000,"YARD_CALL_OUT_CONDITIONAL","Only if a second authorization/fee is legally required; conditional compliance allowance"],
 ["VISA","K01","Visa/work authorisation application reserve — applicability conditional","person",2,4000,"CONDITIONAL_COMPLIANCE_ALLOWANCE","Thai ordinary passports short visits may be visa-exempt; technical on-site work may require prior authorisation. Check actual activity/status before processing"],
 ["LOCAL-TRAVEL","K01","MGW FAT venue/airport local transport","consolidated trip",1,8000,"INTERNAL_PLANNING_ALLOWANCE","No verified local ground-transport supplier quote. Include intercity transfer only once"],
 ["LOCAL-TRAVEL-YARD","K08-K12","Senior Telecom Engineer airport/Yard return transfers in China","consolidated trip",1,15000,"YARD_CALL_OUT_CONDITIONAL","One separate call-out travel event; airfare outside this line"],
 ["YARD-TRAVEL-INSURANCE","K08-K12","Business travel insurance for Yard technical assignment","person-policy",2,2000,"YARD_CALL_OUT_CONDITIONAL","Coverage, policy duration, and exclusion verification pending"],
 ["YARD-WORK-INSURANCE","K08-K12","Onshore engineering-work/occupational accident extension","person-policy",2,5000,"YARD_CALL_OUT_CONDITIONAL","Cover for technical configuration/testing in Zhuhai; insurer endorsement pending"],
 ["TRAVEL-INSURANCE","K01","Business travel accident/medical insurance for two staff","person-policy",2,2000,"INTERNAL_INSURANCE_ALLOWANCE","Vendor policy coverage/medical benefit and duration pending"],
 ["WORK-INSURANCE","K01","Technical-work accident/employer assignment insurance extension","person-policy",2,5000,"CONDITIONAL_WORK_COVERAGE_ALLOWANCE","Ordinary travel cover can exclude onsite technical work. Insurance broker MUST confirm occupational exposure endorsement"]
];
const removedFatTravel=new Set(["TRAVEL-DAYS","AIRFARE","HOTEL","VISA","TRAVEL-INSURANCE"]);
const localBaselineRows=historicalAssumptionRows.map(row=>{
 if(removedFatTravel.has(row[0]))return [row[0],row[1],row[2]+" — not selected for local SAMTEL FAT",row[3],0,row[5],
  "SUPERSEDED_CHINA_TRIP_NONPOSTING", "2026-10-24 SAMTEL Warehouse Thailand; historical quantity "+row[4]+" retained in baseline"];
 if(row[0]==="FAT-STAFF")return [row[0],row[1],"SAMTEL Warehouse Thailand FAT — ADDVALUE Senior + Field Engineer (2 formal FAT days each)",row[3],4,row[5],"OWNER_20261024_FAT_TWO_BASE_PLUS_ONE_RESERVE","ADDVALUE executes all four MR; OEM specialist support separately budgeted. MGW supplies RF equipment only."];
 if(row[0]==="LOCAL-TRAVEL")return [row[0],row[1],"SAMTEL Warehouse local transfers — retained THB8000 allowance",...row.slice(3)];
 return row;
});
// Internal 24-Oct estimator assumptions, NOT vendor quotations or new contract requirements.
// Owner-confirmed FAT 2+1 and Training 1+1: +1 means reserve, not preparation.
// Warehouse window: preparation4 + training(1+1) + FAT(2+1) =9 days.
// Closeout is within FAT2+1, never an extra paid day. B8 content preparation is separate.
export const SAMTEL_EXECUTION_PLAN_0553=Object.freeze({
 preparationDays:4,trainingDays:2,trainingBaseDays:1,trainingReserveDays:1,formalFatDays:2,closeoutDays:0,retestReserveDays:1,
 fatBudgetDays:3,dayBasis:"OWNER_CONFIRMED_FAT_2_PLUS_1_TRAINING_1_PLUS_1_RESERVE",
 facilityDays:9,fatAttendees:10,trainingAttendees:10,mealAndBreakTHBPerPersonDay:550,
 clientWitnessPlanningPlaces:8,executionCrew:2,
 status:"ESTIMATOR_PLANNING_ASSUMPTIONS_NOT_CONFIRMED_ATTENDANCE_OR_SUPPLIER_RATES",
 venue:"SAMTEL Warehouse Thailand",mgwRole:"MR0002 EQUIPMENT SUPPLY ONLY",
 schedule:["B8 training-content preparation: separate prior Senior day", "D1–D4 B3 receiving/configuration/internal pretest", "D5 B8 one-day training; D6 B8 training reserve, no B3 execution crew charge", "D7–D8 B3 formal FAT including signed handover", "D9 B3 FAT reserve for punch/retest; no extra closeout day", "B5 sea packing → B6 export/CIF Zhuhai; B2 document control"]
});
const localExecutionAdditions=[
 ["PREP-SENIOR","Senior receiving/TAG/configuration and four-MR pretest",4,"person-day",seniorRate,"Technical execution only; B2 authors/controls VDRL, B1 manages project; D1–D4"],
 ["PREP-FIELD","Field engineer assembly/interconnections and safe bench setup",4,"person-day",fieldRate,"D1–D4; check all 7+3+4+3 locations, not 4 crates"],
 ["FACILITY-OPERATIONS","SAMTEL utilities, cleaning and operating support reserve",9,"facility-day",1500,"Use of warehouse permitted; fee/inclusion unconfirmed. Internal allowance, not SAMTEL quote or building rent."],
 ["BENCH-RENTAL","Temporary benches, chairs, leads and test-area fitout rental",9,"facility-day",1000,"Shared prep/FAT/training window once; storage B7 and AV B8 excluded"],
 ["RF-TEST-POOL","Shared calibrated RF spectrum/generator/attenuator/load test setup",1,"9-day setup allowance",30000,"Includes transferred B8 RFI demo 15000; temporary rental only, no B11 permanent tools or VeEX rental duplicate"],
 ["RACON-TEST-POOL","ORGA RACON simulator/interface and OEM-controlled test access",1,"9-day setup allowance",15000,"Includes transferred B8 RACON demo 5000; capability/calibration/OEM method unconfirmed, not vessel acceptance"],
 ["PHONE-NETWORK-POOL","Phone/PABX/PoE/Cisco bench fixtures and temporary connectivity",1,"9-day setup allowance",10000,"Temporary fixtures only; no second delivered Cisco/phone or existing VeEX instrument purchase"],
 ["FAT-CATERING","FAT lunch, water and two meeting breaks: team plus PTTEP/JUTAL/SAMTEL witnesses",30,"person-day",550,"10 planning attendees × (2 formal FAT +1 reserve) days; 350 lunch + 2 × 100 breaks. No gifts, flights or hotels; separate from B1 business meetings"],
 ["PREP-CLOSEOUT-MEALS","Two execution staff meals during four preparation days",8,"person-day",350,"2 people ×4 preparation days; FAT reserve meals already in FAT-CATERING; B8 meals separate"],
 ["CLOSEOUT-CREW","Punch/backup/handover INCLUDED in FAT2+1 — no separate paid day",0,"person-day",sharedFatPaidRoleBlendedRate,"MERGED_INTO_FAT_2_PLUS_1: preserve source ID, zero extra day; records/control B2 and teaching B8 remain distinct"],
 ["RETEST-CREW","One two-person FAT +1 reserve for retest/punch",2,"person-day",sharedFatPaidRoleBlendedRate,"The owner-selected FAT +1 day, included once; no further standalone closeout/retest allowance"],
 ["OEM-FAT-SUPPORT","Remote product specialists for FAT issue diagnosis, distinct from training classes",4,"four-hour MR support block",12600,"4 MR × USD400 ×31.5 provisional allowance; MR1 Aviat/Cisco and MR3 phone/sounder split blocks. Suppliers unconfirmed; no MGW execution assumed"]
].map(([id,description,qty,unit,rate,evidence])=>[id,"K01",description,unit,qty,rate,id==="CLOSEOUT-CREW"?"MERGED_INTO_FAT_2_PLUS_1_NONPOSTING":"20261024_INTERNAL_LUMP_SUM_WORKING_SELL_ALLOWANCE_UNQUOTED",evidence]);
const assumptionRows=[...localBaselineRows.map(row=>row[0]==="LOCAL-TRAVEL"?
 [row[0],row[1],"Local crew transfers to SAMTEL — 9 preparation/training/FAT days including reserves","facility-day",9,1000,"20261024_INTERNAL_LOCAL_TRANSFER_ALLOWANCE","4 preparation + (1+1) training + (2+1) FAT; B8 has no second transport provision; no additional airport trip"]:row),...localExecutionAdditions];
export const B9_CHINA_BUDGET_SOURCE_0553=Object.freeze({
 id:"B3-FAT_B9-YARD-REV-K-WORKING-SELL",sourceWbs:"Rev.K K01-K12 / Rev.L / Rev05 B9",
 crew:2,fatDaysEstimate:3,yardTeamDaysWorking:12,hotelNightsPerPerson:0,travelEvents:1,scenarioTravelEventsWithOptionalYard:2,legacyYardTeamDaysOnlyNotSelected:true,
 yardCallOutOnly:true,fatTravelTeamDays:0,yardActualOrStandbyTeamDays:10,
 selectedYardRole:"Senior Telecom Systems Integration Engineer",selectedYardFieldRole:"Field Telecom Technician",yardCallOutCrew:2,
 selectedYardWorkingDays:7,selectedYardTravelDays:2,selectedYardRoomNights:9,
 yardConditionalQuoteFormat:"ONE_LUMP_SUM_PACKAGE_ON_WRITTEN_CALL_OUT",
 yardTravelEventId:"B9-YARD-TRIP-01_SEPARATE_FROM_FAT_TRIP",
 executionLocation:"SAMTEL Warehouse, Thailand",
 travelRoute:"Local SAMTEL Warehouse FAT; B9 remains separate BKK → Zhuhai Yard → BKK",
 travelBookingState:"LOCAL_SAMTEL_FAT__SEPARATE_B9_YARD_FOREIGN_TRIP",
 fxSource:ONSHORE_WORKING_SELL_RATE_0553.source,
 rateUSDPerPersonDay:r.usdPerPersonDay,rateTHBPerPersonDay:r.thbPerPersonDay,
 onshoreSeniorUSDPerDay:700,onshoreFieldUSDPerDay:600,
 onshoreFATTwoWitnessBlendedTHBPerMD:sharedFatPaidRoleBlendedRate,
 onshoreYardSeniorTHBPerMD:seniorRate,onshoreYardFieldTHBPerMD:fieldRate,
 fatPaidWitnessRoleRateAssumption:"ADDVALUE Senior USD700 + Field Engineer USD600; MGW equipment only; execution RACI/ITP to confirm",
 perDiemSeparate:false,oneUnbilledStandbyExcluded:false,
 fatWitnessRoles:["Senior Telecom Systems Integration Engineer","Field Telecom Engineer"],
 fatStandbyRole:"No additional unbilled execution staff assumed",
 yardStandbyRole:"Field Telecom Technician (second paid B9 Yard staff, USD600/MD)",
 yardPaidCrew:2,yardPhysicalDeploymentCrew:2,yardUnbilledFieldSpecialistIncludedInOffer:false,
 unbilledBackupCashAllowanceTHB:0,fieldTechnicianIncrementalCashAllowanceTHB:48500,
 unbilledBackupCashAllowanceBasis:"FIELD TECHNOW PRICED IN WS-B9; 2nd staff airfare 15000 + 9 hotel-nights 22500 + conditional visa 4000 + travel insurance 2000 + technical-work cover 5000 included in revised B9 1 LS",
 unbilledBackupCashAllowancePosting:"NO_UNBILLED_FIELD_BACKUP__SECOND_PAID_STAFF_IN_SELECTED_WS_B9",
 commercialNoticePlanningDays:30,contractualBodNoticeDays:30,noticePrecedenceHold:false,
 priceClass:"B3_MGW_FAT_BASE_PLUS_B9_QUOTED_BASE_YARD_CALL_OUT_SEPARATE",
 directCostVerified:false,insuranceCoverVerified:false,visaRequirementVerified:false,
 releaseAllowed:false,expenseOwner:"B3_FAT_B9_YARD_BY_ACTIVITY",legacyWbsB9SellTHB:574560,
 laborOwner:"B3_FOR_FAT_B9_FOR_YARD",clientBasePricePosting:"FAT_WORKING_SELL_B3_AND_YARD_SPECIALIST_B9_ONCE",
 marketEvidence:[
  "https://www.thaiairways.com/flights/en/flights-from-bangkok-to-guangzhou",
  "https://flights.cathaypacific.com/destinations/en_TH/flights-from-bangkok-to-guangzhou",
  "https://www.booking.com/city/cn/zhuhai.en-gb.html",
  "https://th.china-embassy.gov.cn/eng/zgqz/va/202305/t20230521_11080898.htm",
  "https://www.allianz.co.th/en_TH/travel-insurance/single-plan.html"
 ]
});
export const B9_CHINA_WORKING_ROWS_0553=Object.freeze(assumptionRows.map(([id,wbs,description,unit,qty,rateTHB,status,evidence])=>{
 const isYard=id==="YARD-STAFF"||id.startsWith("YARD-")||id==="HOTEL-YARD"||id==="LOCAL-TRAVEL-YARD";
 const owner=isYard?"B9":"B3";
 return Object.freeze({
 id:owner+"-"+id,moduleId:"bid.budget.working.bc."+owner.toLowerCase()+"."+id.toLowerCase(),
 legacySourceExpenseId:owner+"-"+id,
 internalCostLineId:makeInternalCostLineId0553(owner,id),
 financialNamespace:"IC_INTERNAL_RESOURCE_ACTIVITY_NOT_VERIFIED_COST",
 workingSellIdentity:"WS-"+owner,contractLineIdentity:"SOW-"+owner,
 proposalLineIdentity:"CP-"+owner,proposalIssued:false,
 wbs,description,unit,qty,unitRateTHB:rateTHB,
 workingSellTHB:round(qty*rateTHB),workingCostTHB:null,directCostTHB:null,
 costAccountingClass:owner==="B3"?"B3_LOCAL_EXECUTION_ALLOWANCE_COST_UNVERIFIED":"B9_DIRECT_SPECIALIST_EXPENSE_IF_CALLED_UNVERIFIED",
 costOwner:owner,expenseKey:owner+"-REV-K-"+id,
 rateAuthority:["FAT-STAFF","YARD-STAFF","YARD-TRAVEL-DAYS","YARD-FIELD-STAFF","YARD-FIELD-TRAVEL-DAYS"].includes(id)?r.source:"CFO_PRE_AWARD_ESTIMATOR_ALLOWANCE__2026_10_18",
 status,evidence,
 postingClass:isYard?"B9_YARD_CALL_OUT_CONDITIONAL":"B3_ADDVALUE_SAMTEL_EXECUTION_LUMP_SUM",
 optional:isYard
 });
}));
export function selectB9ChinaWorkingBudget0553(){
 const rows=B9_CHINA_WORKING_ROWS_0553;
 const source=B9_CHINA_BUDGET_SOURCE_0553;
 const fatWbs=selectFourMrFatWbs0553();
 if(fatWbs.estimatedFatWitnessDays!==source.fatDaysEstimate||source.hotelNightsPerPerson!==0)throw Error("B3 FAT duration/rooms not linked to four-MR WBS");
 if(new Set(rows.map(x=>x.expenseKey)).size!==rows.length)throw Error("Duplicate B9 expense item");
 if(new Set(rows.map(x=>x.internalCostLineId)).size!==rows.length||
  rows.some(x=>!x.internalCostLineId.startsWith(x.costOwner==="B3"?"IC-FAT-":"IC-YARD-")||
   x.proposalIssued||x.workingSellIdentity!=="WS-"+x.costOwner))
  throw Error("B3/B9 internal cost activity IDs conflict with customer contract line or Working SELL");
 if(rows.some(x=>x.costOwner!==(x.optional?"B9":"B3")||!Number.isFinite(x.workingSellTHB)||x.workingCostTHB!==null))
  throw Error("B9 missing price evidence or mixed cost/sell owner");
 const labor=round(rows.filter(x=>x.unit==="person-day"&&!/CATERING|MEALS/.test(x.id)).reduce((n,x)=>n+x.workingSellTHB,0));
 const travel=round(rows.filter(x=>x.unit!=="person-day"||/CATERING|MEALS/.test(x.id)).reduce((n,x)=>n+x.workingSellTHB,0));
 const total=round(labor+travel);
 const base=round(rows.filter(x=>!x.optional).reduce((n,x)=>n+x.workingSellTHB,0));
 const conditional=round(rows.filter(x=>x.optional).reduce((n,x)=>n+x.workingSellTHB,0));
 if(base!==452850||conditional!==480550||total!==933400||rows.length!==30||source.perDiemSeparate||rows.filter(x=>x.costOwner==="B3").length!==20)
  throw Error("B9 Rev.K budget/Per Diem/equipment duplicate error");
 // One quoted contract line (B9) with conditional execution. conditionalYardSellTHB
 // remains source evidence, NOT a second additional option/price posting.
 return Object.freeze({...source,fatWbs,rows,executionPlan:SAMTEL_EXECUTION_PLAN_0553,workingSellTHB:conditional,fatWorkingSellTHB:base,b3FatWorkingSellTHB:base,b9BaseWorkingSellTHB:conditional,conditionalYardSellTHB:conditional,
  fullCombinedVisitScenarioTHB:total,laborWorkingSellTHB:labor,
  nonLaborWorkingSellTHB:travel,travelAndInsuranceWorkingSellTHB:travel,qtyDerivedManDays:32,
  conditionalNotInBase:false,quotedBaseWorkingSell:true,conditionalExecutionOnWrittenCallout:true,priceAlreadyIncludedInB9Base:true,deltaVsLegacyTHB:round(conditional-source.legacyWbsB9SellTHB),
  contractCostOwnerProof:"Original 4-Scope of Supply.xlsx row 26 B3 Inspection, Testing and Certification as per ITP; row 32 B9 Specialist field assistance as per specification",
  workingDirectCostTHB:null,verifiedDirectCostTHB:null,customerReleaseAllowed:false});
}
