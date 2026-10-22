// PJ2608-0553 / B3 China FAT Witness + B9 priced JUTAL Yard Assistance. The B9 1 LS is in customer Base pricing; physical execution remains written-call-out conditional.
// Onshore working SELL: Senior Telecom Engineer USD700/MD; Field/standard rate USD600/MD.
// Current FAT paid crew is PM/Chief (standard USD600 provisional) + Senior (USD700);
// its unbilled field standby remains UNBILLED, not a second paid staff line.
// Six MGW-FAT witness days derived from four-MR 48h agenda, not mandated by source docs.
// 12 Yard team-days = SUPERSEDED Rev05 comparison, NOT selected for new call-out.
// Management proposal: 1 Senior Telecom Systems Integration Engineer, 7 Yard workdays,
// one separate BKK-China-BKK trip (2 travel days), 1 optional Lump Sum. Rev.K does not stipulate 7 days.
// FAT base trip (2 witnesses) and Yard call-out trip (1 Sr Telecom Eng) are DISTINCT expense events.
// Never double-charge either journey; combined trip would need separate commercial reconciliation.
// All travel/insurance figures are PRE-AWARD SELL ALLOWANCES, NOT insurer/vendor quotes.
// No VAT/duties, payroll Direct Cost or ADDVALUE margin invented.
import {ONSHORE_WORKING_SELL_RATE_0553} from "./onshoreWorkingRate0553";
import {selectFourMrFatWbs0553} from "./fatWbsFourMr0553";
import {makeInternalCostLineId0553} from "./workingCostCommercialIdentity0553";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const r=ONSHORE_WORKING_SELL_RATE_0553;
const seniorRate=r.roleRates.seniorTelecomEngineerTHBPerPersonDay;
const sharedFatPaidRoleBlendedRate=round((seniorRate+r.thbPerPersonDay)/2); // 2 different paid roles: 700 + 600, no extra headcount
const assumptionRows=[
 ["FAT-STAFF","K01","China MGW OEM FAT — PM/Chief Engineer + Senior Telecom Engineer (2 paid witnesses)","person-day",12,sharedFatPaidRoleBlendedRate,"USER_APPROVED_ONSHORE_ROLE_RATES__6_FAT_DAYS_PRE_AWARD","4-MR detailed FAT WBS: 6 days × 2 paid witnesses, with one standby Field Telecom Specialist unbilled. MGW execution & signed ITP pending"],
 ["YARD-STAFF","K08-K12","Senior Telecom Systems Integration Engineer — on-call Yard configuration/integration support","person-day",7,seniorRate,"CONDITIONAL_SR_TELECOM_ENGINEER__7_WORKDAYS_LS","SPE §7.3.2 / §7.3.4: vendor site support at onshore rate when requested. One Sr Telecom Engineer for maximum seven working days; verify post-FAT approved config before changing anything."],
 ["YARD-TRAVEL-DAYS","K08-K12","Senior Telecom Engineer separate Yard trip — mobilization and demobilization labor","person-day",2,seniorRate,"YARD_CALL_OUT_CONDITIONAL","One Sr Telecom Engineer × 2 travel days; separate from FAT witness travel and counted once."],
 ["YARD-AIRFARE","K08-K12","BKK–China–BKK return airfare, separate Yard call-out","return ticket",1,15000,"YARD_CALL_OUT_CONDITIONAL","One Senior Engineer. Budget only, not a booked flight."],
 ["TRAVEL-DAYS","K01","BKK-China-BKK mobilization/demobilization labour counted ONCE","person-day",4,sharedFatPaidRoleBlendedRate,"REV05_CN01_CN11_TRAVEL_DAYS_TRANSFERRED_TO_FAT_VISIT","Rev05 12 Yard team-days included 2 travel team-days; base visitor travel counted once"],
 ["AIRFARE","K01","BKK–China–BKK round trip economy airfare, both staff","return ticket",2,15000,"MARKET_COMPARABLE_PLUS_BOOKING_ALLOWANCE","BKK–Guangzhou airline round-trip indicative fares ~THB8–20k; actual itinerary/FAT location not confirmed"],
 ["HOTEL","K01","China business hotel for six-day FAT visit (7 nights per staff)","room-night",14,2500,"BUSINESS_HOTEL_BUDGETARY_ALLOWANCE","7 nights × 2 people = 14 room-nights; six FAT witness days + travel, venue and check-in schedule provisional"],
 ["HOTEL-YARD","K08-K12","Senior Telecom Engineer hotel for separate 7-day Yard assignment","room-night",9,2500,"YARD_CALL_OUT_CONDITIONAL","9 hotel nights × one senior; separate from MGW FAT trip; vendor price unverified"],
 ["YARD-VISA","K08-K12","Additional visa/work permit reserve for separate Yard assignment","person",1,4000,"YARD_CALL_OUT_CONDITIONAL","Only if a second authorization/fee is legally required; conditional compliance allowance"],
 ["VISA","K01","Visa/work authorisation application reserve — applicability conditional","person",2,4000,"CONDITIONAL_COMPLIANCE_ALLOWANCE","Thai ordinary passports short visits may be visa-exempt; technical on-site work may require prior authorisation. Check actual activity/status before processing"],
 ["LOCAL-TRAVEL","K01","MGW FAT venue/airport local transport","consolidated trip",1,8000,"INTERNAL_PLANNING_ALLOWANCE","No verified local ground-transport supplier quote. Include intercity transfer only once"],
 ["LOCAL-TRAVEL-YARD","K08-K12","Senior Telecom Engineer airport/Yard return transfers in China","consolidated trip",1,15000,"YARD_CALL_OUT_CONDITIONAL","One separate call-out travel event; airfare outside this line"],
 ["YARD-TRAVEL-INSURANCE","K08-K12","Business travel insurance for Yard technical assignment","person-policy",1,2000,"YARD_CALL_OUT_CONDITIONAL","Coverage, policy duration, and exclusion verification pending"],
 ["YARD-WORK-INSURANCE","K08-K12","Onshore engineering-work/occupational accident extension","person-policy",1,5000,"YARD_CALL_OUT_CONDITIONAL","Cover for technical configuration/testing in Zhuhai; insurer endorsement pending"],
 ["TRAVEL-INSURANCE","K01","Business travel accident/medical insurance for two staff","person-policy",2,2000,"INTERNAL_INSURANCE_ALLOWANCE","Vendor policy coverage/medical benefit and duration pending"],
 ["WORK-INSURANCE","K01","Technical-work accident/employer assignment insurance extension","person-policy",2,5000,"CONDITIONAL_WORK_COVERAGE_ALLOWANCE","Ordinary travel cover can exclude onsite technical work. Insurance broker MUST confirm occupational exposure endorsement"]
];
export const B9_CHINA_BUDGET_SOURCE_0553=Object.freeze({
 id:"B3-FAT_B9-YARD-REV-K-WORKING-SELL",sourceWbs:"Rev.K K01-K12 / Rev.L / Rev05 B9",
 crew:2,fatDaysEstimate:6,yardTeamDaysWorking:12,hotelNightsPerPerson:7,travelEvents:1,scenarioTravelEventsWithOptionalYard:2,legacyYardTeamDaysOnlyNotSelected:true,
 yardCallOutOnly:true,fatTravelTeamDays:2,yardActualOrStandbyTeamDays:10,
 selectedYardRole:"Senior Telecom Systems Integration Engineer",yardCallOutCrew:1,
 selectedYardWorkingDays:7,selectedYardTravelDays:2,selectedYardRoomNights:9,
 yardConditionalQuoteFormat:"ONE_LUMP_SUM_PACKAGE_ON_WRITTEN_CALL_OUT",
 yardTravelEventId:"B9-YARD-TRIP-01_SEPARATE_FROM_FAT_TRIP",
 travelRoute:"Base: BKK → MGW FAT China → BKK; optional: separate BKK → Zhuhai Yard → BKK for one Sr Telecom Engineer",
 travelBookingState:"FAT_AND_YARD_PRICED_AS_TWO_SEPARATE_TRIPS__RECONCILE_IF_ACTUALLY_COMBINED",
 fxSource:ONSHORE_WORKING_SELL_RATE_0553.source,
 rateUSDPerPersonDay:r.usdPerPersonDay,rateTHBPerPersonDay:r.thbPerPersonDay,
 onshoreSeniorUSDPerDay:700,onshoreFieldUSDPerDay:600,
 onshoreFATTwoWitnessBlendedTHBPerMD:sharedFatPaidRoleBlendedRate,
 onshoreYardSeniorTHBPerMD:seniorRate,
 fatPaidWitnessRoleRateAssumption:"Senior USD700 + PM/Chief provisional standard USD600; Field standby UNBILLED; verify FAT RACI", 
 perDiemSeparate:false,oneUnbilledStandbyExcluded:true,
 fatWitnessRoles:["Project Manager / Chief Telecom Engineer","Senior Telecom Systems Integration Engineer"],
 fatStandbyRole:"Field Telecom Specialist (unbilled standby)",
 yardStandbyRole:"Field Telecom Specialist (planned accompanying backup, UNBILLED labour; actual internal field labour cost must still be recognized)",
 yardPaidCrew:1,yardPhysicalDeploymentCrew:2,yardUnbilledFieldSpecialistIncludedInOffer:true,
 unbilledBackupCashAllowanceTHB:48500,
 unbilledBackupCashAllowanceBasis:"INTERNAL CASH RISK ONLY, NOT EXTRA SELL: airfare 15000 + 9 hotel-nights 22500 + conditional visa 4000 + travel insurance 2000 + technical-work cover 5000; local transport incremental TBC; field labour payroll not estimated",
 unbilledBackupCashAllowancePosting:"NON_POSTING_RISK_WITHIN_CURRENT_B9_LS__MARGIN_REVIEW",
 commercialNoticePlanningDays:14,contractualBodNoticeDays:30,noticePrecedenceHold:true,
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
 costAccountingClass:owner==="B3"?"B3_DIRECT_FAT_WITNESS_EXPENSE_UNVERIFIED":"B9_DIRECT_SPECIALIST_EXPENSE_IF_CALLED_UNVERIFIED",
 costOwner:owner,expenseKey:owner+"-REV-K-"+id,
 rateAuthority:["FAT-STAFF","YARD-STAFF"].includes(id)?r.source:"CFO_PRE_AWARD_ESTIMATOR_ALLOWANCE__2026_10_18",
 status,evidence,
 postingClass:isYard?"B9_YARD_CALL_OUT_CONDITIONAL":"B3_MGW_FAT_WITNESS_BASE",
 optional:isYard
 });
}));
export function selectB9ChinaWorkingBudget0553(){
 const rows=B9_CHINA_WORKING_ROWS_0553;
 const source=B9_CHINA_BUDGET_SOURCE_0553;
 const fatWbs=selectFourMrFatWbs0553();
 if(fatWbs.estimatedFatWitnessDays!==source.fatDaysEstimate||fatWbs.estimatedRoomNightsPerWitness!==source.hotelNightsPerPerson)throw Error("B3 FAT duration/rooms not linked to four-MR WBS");
 if(new Set(rows.map(x=>x.expenseKey)).size!==rows.length)throw Error("Duplicate B9 expense item");
 if(new Set(rows.map(x=>x.internalCostLineId)).size!==rows.length||
  rows.some(x=>!x.internalCostLineId.startsWith(x.costOwner==="B3"?"IC-FAT-":"IC-YARD-")||
   x.proposalIssued||x.workingSellIdentity!=="WS-"+x.costOwner))
  throw Error("B3/B9 internal cost activity IDs conflict with customer contract line or Working SELL");
 if(rows.some(x=>x.costOwner!==(x.optional?"B9":"B3")||!Number.isFinite(x.workingSellTHB)||x.workingCostTHB!==null))
  throw Error("B9 missing price evidence or mixed cost/sell owner");
 const labor=round(rows.filter(x=>/^(B3-FAT|B9-YARD)-STAFF$/.test(x.id)).reduce((n,x)=>n+x.workingSellTHB,0));
 const travel=round(rows.filter(x=>!/^(B3-FAT|B9-YARD)-STAFF$/.test(x.id)).reduce((n,x)=>n+x.workingSellTHB,0));
 const total=round(labor+travel);
 const base=round(rows.filter(x=>!x.optional).reduce((n,x)=>n+x.workingSellTHB,0));
 const conditional=round(rows.filter(x=>x.optional).reduce((n,x)=>n+x.workingSellTHB,0));
 if(base!==422600||conditional!==261950||total!==684550||rows.length!==16||source.perDiemSeparate||rows.filter(x=>x.costOwner==="B3").length!==8)
  throw Error("B9 Rev.K budget/Per Diem/equipment duplicate error");
 // One quoted contract line (B9) with conditional execution. conditionalYardSellTHB
 // remains source evidence, NOT a second additional option/price posting.
 return Object.freeze({...source,fatWbs,rows,workingSellTHB:conditional,fatWorkingSellTHB:base,b3FatWorkingSellTHB:base,b9BaseWorkingSellTHB:conditional,conditionalYardSellTHB:conditional,
  fullCombinedVisitScenarioTHB:total,laborWorkingSellTHB:labor,
  travelAndInsuranceWorkingSellTHB:travel,qtyDerivedManDays:16,
  conditionalNotInBase:false,quotedBaseWorkingSell:true,conditionalExecutionOnWrittenCallout:true,priceAlreadyIncludedInB9Base:true,deltaVsLegacyTHB:round(conditional-source.legacyWbsB9SellTHB),
  contractCostOwnerProof:"Original 4-Scope of Supply.xlsx row 26 B3 Inspection, Testing and Certification as per ITP; row 32 B9 Specialist field assistance as per specification",
  workingDirectCostTHB:null,verifiedDirectCostTHB:null,customerReleaseAllowed:false});
}
