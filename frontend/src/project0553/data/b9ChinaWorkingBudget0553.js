// PJ2608-0553 / B9 — China FAT + JUTAL Zhuhai Yard, WBS Rev.K K01–K12.
// Management selected: USD600 PERSON/day Onshore labour; NO separate per diem line.
// 2 MGW-FAT days = estimating assumption; Rev.K does not establish FAT duration.
// 12 Yard team-days = SUPERSEDED Rev05 comparison, NOT selected for new call-out.
// Management proposal: 1 Senior Telecom Systems Integration Engineer, 7 Yard workdays,
// one separate BKK-China-BKK trip (2 travel days), 1 optional Lump Sum. Rev.K does not stipulate 7 days.
// FAT base trip (2 witnesses) and Yard call-out trip (1 Sr Telecom Eng) are DISTINCT expense events.
// Never double-charge either journey; combined trip would need separate commercial reconciliation.
// All travel/insurance figures are PRE-AWARD SELL ALLOWANCES, NOT insurer/vendor quotes.
// No VAT/duties, payroll Direct Cost or ADDVALUE margin invented.
import {ONSHORE_WORKING_SELL_RATE_0553} from "./onshoreWorkingRate0553";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const r=ONSHORE_WORKING_SELL_RATE_0553;
const assumptionRows=[
 ["FAT-STAFF","K01","China MGW OEM FAT — 2 ADDVALUE paid witnesses","person-day",4,r.thbPerPersonDay,"USER_APPROVED_RATE__2_FAT_DAYS_PROVISIONAL","Rev.K K01 (2 paid attendees; 1 unbilled standby). FAT duration 2 days ASSUMED; actual MGW schedule pending"],
 ["YARD-STAFF","K08-K12","Senior Telecom Systems Integration Engineer — on-call Yard configuration/integration support","person-day",7,r.thbPerPersonDay,"CONDITIONAL_SR_TELECOM_ENGINEER__7_WORKDAYS_LS","SPE §7.3.2 / §7.3.4: vendor site support at onshore rate when requested. One Sr Telecom Engineer for maximum seven working days; verify post-FAT approved config before changing anything."],
 ["YARD-TRAVEL-DAYS","K08-K12","Senior Telecom Engineer separate Yard trip — mobilization and demobilization labor","person-day",2,r.thbPerPersonDay,"YARD_CALL_OUT_CONDITIONAL","One Sr Telecom Engineer × 2 travel days; separate from FAT witness travel and counted once."],
 ["YARD-AIRFARE","K08-K12","BKK–China–BKK return airfare, separate Yard call-out","return ticket",1,15000,"YARD_CALL_OUT_CONDITIONAL","One Senior Engineer. Budget only, not a booked flight."],
 ["TRAVEL-DAYS","K01","BKK-China-BKK mobilization/demobilization labour counted ONCE","person-day",4,r.thbPerPersonDay,"REV05_CN01_CN11_TRAVEL_DAYS_TRANSFERRED_TO_FAT_VISIT","Rev05 12 Yard team-days included 2 travel team-days; base visitor travel counted once"],
 ["AIRFARE","K01","BKK–China–BKK round trip economy airfare, both staff","return ticket",2,15000,"MARKET_COMPARABLE_PLUS_BOOKING_ALLOWANCE","BKK–Guangzhou airline round-trip indicative fares ~THB8–20k; actual itinerary/FAT location not confirmed"],
 ["HOTEL","K01","China business hotel for FAT visit (3 nights per staff)","room-night",6,2500,"BUSINESS_HOTEL_BUDGETARY_ALLOWANCE","15 nights × 2 rooms; supported as prudent planning allowance only; exact cities/stay unknown"],
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
 id:"B9-CHINA-REV-K-WORKING-SELL",sourceWbs:"Rev.K K01-K12 / Rev.L / Rev05 B9",
 crew:2,fatDaysEstimate:2,yardTeamDaysWorking:12,hotelNightsPerPerson:15,travelEvents:1,
 yardCallOutOnly:true,fatTravelTeamDays:2,yardActualOrStandbyTeamDays:10,
 selectedYardRole:"Senior Telecom Systems Integration Engineer",yardCallOutCrew:1,
 selectedYardWorkingDays:7,selectedYardTravelDays:2,selectedYardRoomNights:9,
 yardConditionalQuoteFormat:"ONE_LUMP_SUM_PACKAGE_ON_WRITTEN_CALL_OUT",
 yardTravelEventId:"B9-YARD-TRIP-01_SEPARATE_FROM_FAT_TRIP",
 travelRoute:"Base: BKK → MGW FAT China → BKK; optional: separate BKK → Zhuhai Yard → BKK for one Sr Telecom Engineer",
 travelBookingState:"FAT_AND_YARD_PRICED_AS_TWO_SEPARATE_TRIPS__RECONCILE_IF_ACTUALLY_COMBINED",
 fxSource:ONSHORE_WORKING_SELL_RATE_0553.source,
 rateUSDPerPersonDay:r.usdPerPersonDay,rateTHBPerPersonDay:r.thbPerPersonDay,
 perDiemSeparate:false,oneUnbilledStandbyExcluded:true,
 priceClass:"FAT_BASE_PLUS_CONDITIONAL_YARD_SUPPORT_SEPARATE",
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
 status,evidence,
 postingClass:id==="YARD-STAFF"||id.startsWith("YARD-")||id==="HOTEL-YARD"||id==="LOCAL-TRAVEL-YARD"?"YARD_CALL_OUT_CONDITIONAL":"FAT_BASE",
 optional:id==="YARD-STAFF"||id.startsWith("YARD-")||id==="HOTEL-YARD"||id==="LOCAL-TRAVEL-YARD"
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
 const base=round(rows.filter(x=>!x.optional).reduce((n,x)=>n+x.workingSellTHB,0));
 const conditional=round(rows.filter(x=>x.optional).reduce((n,x)=>n+x.workingSellTHB,0));
 if(base!==226200||conditional!==233600||total!==459800||rows.length!==16||source.perDiemSeparate)
  throw Error("B9 Rev.K budget/Per Diem/equipment duplicate error");
 return Object.freeze({...source,rows,workingSellTHB:base,conditionalYardSellTHB:conditional,
  fullCombinedVisitScenarioTHB:total,laborWorkingSellTHB:151200,
  travelAndInsuranceWorkingSellTHB:75000,qtyDerivedManDays:8,
  conditionalNotInBase:true,deltaVsLegacyTHB:round(base-source.legacyWbsB9SellTHB)});
}
