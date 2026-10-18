// PJ2608-0553 / B9 — China FAT + JUTAL Zhuhai Yard, WBS Rev.K K01–K12.
// Management selected: USD600 PERSON/day Onshore labour; NO separate per diem line.
// 2 MGW-FAT days = estimating assumption; Rev.K does not establish FAT duration.
// 12 Yard team-days = Rev05 working allowance, not an approved JUTAL schedule.
// One combined BKK-China-BKK booking, two staff; if FAT & Yard trips split, reprice.
// All travel/insurance figures are PRE-AWARD SELL ALLOWANCES, NOT insurer/vendor quotes.
// No VAT/duties, payroll Direct Cost or ADDVALUE margin invented.
import {ONSHORE_WORKING_SELL_RATE_0553} from "./onshoreWorkingRate0553";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const r=ONSHORE_WORKING_SELL_RATE_0553;
const assumptionRows=[
 ["FAT-STAFF","K01","China MGW OEM FAT — 2 ADDVALUE paid witnesses","person-day",4,r.thbPerPersonDay,"USER_APPROVED_RATE__2_FAT_DAYS_PROVISIONAL","Rev.K K01 (2 paid attendees; 1 unbilled standby). FAT duration 2 days ASSUMED; actual MGW schedule pending"],
 ["YARD-STAFF","K02-K12","JUTAL Zhuhai Yard — ADDVALUE supervision/verification","person-day",24,r.thbPerPersonDay,"USER_APPROVED_RATE__REV05_12_TEAM_DAYS_PROVISIONAL","Rev.K K02–K12 / Rev.L; Rev05 B9 12 2-person team-days; field scope and signed RACI pending"],
 ["AIRFARE","K01-K12","BKK–China–BKK round trip economy airfare, both staff","return ticket",2,15000,"MARKET_COMPARABLE_PLUS_BOOKING_ALLOWANCE","BKK–Guangzhou airline round-trip indicative fares ~THB8–20k; actual itinerary/FAT location not confirmed"],
 ["HOTEL","K01-K12","China business hotel, separate rooms, FAT and Yard","room-night",30,2500,"BUSINESS_HOTEL_BUDGETARY_ALLOWANCE","15 nights × 2 rooms; supported as prudent planning allowance only; exact cities/stay unknown"],
 ["VISA","K01-K12","Visa/work authorisation application reserve — applicability conditional","person",2,4000,"CONDITIONAL_COMPLIANCE_ALLOWANCE","Thai ordinary passports short visits may be visa-exempt; technical on-site work may require prior authorisation. Check actual activity/status before processing"],
 ["LOCAL-TRAVEL","K01-K12","Airport transfers + MGW-to-Zhuhai ground transport (one combined trip)","consolidated trip",1,15000,"INTERNAL_PLANNING_ALLOWANCE","No verified local ground-transport supplier quote. Include intercity transfer only once"],
 ["TRAVEL-INSURANCE","K01-K12","Business travel accident/medical insurance for two staff","person-policy",2,2000,"INTERNAL_INSURANCE_ALLOWANCE","Vendor policy coverage/medical benefit and duration pending"],
 ["WORK-INSURANCE","K01-K12","Technical-work accident/employer assignment insurance extension","person-policy",2,5000,"CONDITIONAL_WORK_COVERAGE_ALLOWANCE","Ordinary travel cover can exclude onsite technical work. Insurance broker MUST confirm occupational exposure endorsement"]
];
export const B9_CHINA_BUDGET_SOURCE_0553=Object.freeze({
 id:"B9-CHINA-REV-K-WORKING-SELL",sourceWbs:"Rev.K K01-K12 / Rev.L / Rev05 B9",
 crew:2,fatDaysEstimate:2,yardTeamDaysWorking:12,hotelNightsPerPerson:15,travelEvents:1,
 travelRoute:"BKK → China MGW FAT (venue TBC) → Zhuhai Yard → BKK",
 travelBookingState:"ONE_CONTINUOUS_TRIP_ASSUMED__SEPARATE_FAT_YARD_TRIPS_REQUIRE_REPRICING",
 fxSource:ONSHORE_WORKING_SELL_RATE_0553.source,
 rateUSDPerPersonDay:r.usdPerPersonDay,rateTHBPerPersonDay:r.thbPerPersonDay,
 perDiemSeparate:false,oneUnbilledStandbyExcluded:true,
 priceClass:"PRE_AWARD_BUDGETARY_WORKING_SELL_PART_B_B9",
 directCostVerified:false,insuranceCoverVerified:false,visaRequirementVerified:false,
 releaseAllowed:false,expenseOwner:"B9",legacyWbsB9SellTHB:574560,
 laborOwner:"B9",clientBasePricePosting:"WORKING_SELL_ONLY",
 marketEvidence:[
  "https://www.thaiairways.com/flights/en/flights-from-bangkok-to-guangzhou",
  "https://flights.cathaypacific.com/destinations/en_TH/flights-from-bangkok-to-guangzhou",
  "https://www.booking.com/city/cn/zhuhai.en-gb.html",
  "https://th.china-embassy.gov.cn/eng/zgqz/va/202305/t20230521_11080898.htm",
  "https://www.allianz.co.th/en_TH/travel-insurance/single-plan.html"
 ]
});
export const B9_CHINA_WORKING_ROWS_0553=Object.freeze(assumptionRows.map(([id,wbs,description,unit,qty,rateTHB,status,evidence])=>Object.freeze({
 id:"B9-"+id,moduleId:"bid.budget.working.bc.b9."+id.toLowerCase(),
 wbs,description,unit,qty,unitRateTHB:rateTHB,
 workingSellTHB:round(qty*rateTHB),workingCostTHB:null,
 costOwner:"B9",expenseKey:"B9-REV-K-"+id,
 rateAuthority:["FAT-STAFF","YARD-STAFF"].includes(id)?r.source:"CFO_PRE_AWARD_ESTIMATOR_ALLOWANCE__2026_10_18",
 status,evidence,optional:true===false
})));
export function selectB9ChinaWorkingBudget0553(){
 const rows=B9_CHINA_WORKING_ROWS_0553;
 const source=B9_CHINA_BUDGET_SOURCE_0553;
 if(new Set(rows.map(x=>x.expenseKey)).size!==rows.length)throw Error("Duplicate B9 expense item");
 if(rows.some(x=>x.costOwner!=="B9"||!Number.isFinite(x.workingSellTHB)||x.workingCostTHB!==null))
  throw Error("B9 missing price evidence or mixed cost/sell owner");
 const labor=round(rows.filter(x=>/B9-(FAT|YARD)-STAFF/.test(x.id)).reduce((n,x)=>n+x.workingSellTHB,0));
 const travel=round(rows.filter(x=>!/B9-(FAT|YARD)-STAFF/.test(x.id)).reduce((n,x)=>n+x.workingSellTHB,0));
 const total=round(labor+travel);
 if(labor!==529200||travel!==142000||total!==671200||rows.length!==8||source.perDiemSeparate)
  throw Error("B9 Rev.K budget/Per Diem/equipment duplicate error");
 return Object.freeze({...source,rows,workingSellTHB:total,laborWorkingSellTHB:labor,
  travelAndInsuranceWorkingSellTHB:travel,qtyDerivedManDays:source.crew*(source.fatDaysEstimate+source.yardTeamDaysWorking),
  deltaVsLegacyTHB:round(total-source.legacyWbsB9SellTHB)});
}
