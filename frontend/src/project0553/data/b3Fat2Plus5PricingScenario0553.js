// PJ2608-0553 / 10.2 B3.1 — 2-day iFAT + 5-day Customer FAT on-site pricing.
// Explicit management instruction: 7 on-site working days EXCLUDES travel days.
// Read-only proposed Working SELL scenario, not an approved 10.2/10.3 cost posting.
import {ONSHORE_WORKING_SELL_RATE_0553 as rate} from "./onshoreWorkingRate0553";
import {MGW_R2_COVER_20261020_0553 as cover} from "./mgwP26058R2Cover20261020";
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const SRC="bid.budget.working.bc.b3";
const fatRows=working=>working?.b3ChinaFatBudget?.rows.filter(x=>x.costOwner==="B3"&&!x.optional)||[];
export function selectB3Fat2Plus5PricingScenario0553(workingRow){
 if(!workingRow||workingRow.code!=="B3")return null;
 const b3=workingRow.b3ChinaFatBudget;
 const sourceRows=fatRows(workingRow);
 if(!b3||sourceRows.length!==8||!b3.fatWbs||b3.fatWbs.estimatedFatWitnessDays!==6)
  throw Error("B3 FAT revised scenario requires current six-day canonical source");
 const get=id=>{
  const line=sourceRows.find(x=>x.id==="B3-"+id);
  if(!line||!Number.isFinite(line.workingSellTHB)||!Number.isFinite(line.unitRateTHB))
   throw Error("B3 FAT budget source missing "+id);
  return line;
 };
 const crew=2,internalFatDays=cover.FAT.internalFatDays,customerFatDays=cover.FAT.facilityEndUserDaysMinimum;
 const onsiteDays=internalFatDays+customerFatDays;
 const travelDaysPerPerson=2; // Separate round-trip mobilization/demobilization; NOT within 2+5
 const hotelNightsPerPerson=onsiteDays+1; // Planning: arrival night + seven on-site workdays; confirm booking itinerary.
 if(internalFatDays!==2||customerFatDays!==5||onsiteDays!==7||
  rate.usdPerPersonDay!==600||rate.thbPerUsd!==31.5||
  rate.thbPerPersonDay!==18900||crew!==b3.crew)
  throw Error("Management 2+5 / two staff / USD600 onshore rate mismatch");
 const overrides=Object.freeze({
  "FAT-STAFF":{qty:onsiteDays*crew,reason:"2 iFAT + 5 Customer FAT = 7 ON-SITE working days, 2 paid engineers"},
  "HOTEL":{qty:hotelNightsPerPerson*crew,reason:"8 nights per engineer provisional for 7 on-site days, separate travel"}
 });
 const rows=sourceRows.map(src=>{
  const id=src.id.slice(3);
  const override=overrides[id];
  const qty=override?.qty??src.qty;
  const proposed=round(qty*src.unitRateTHB);
  return Object.freeze({
   sourceModuleId:src.moduleId,expenseId:src.id,description:src.description,
   unit:src.unit,qty,unitRateTHB:src.unitRateTHB,
   currentQty:src.qty,currentWorkingSellTHB:src.workingSellTHB,
   proposedWorkingSellTHB:proposed,deltaTHB:round(proposed-src.workingSellTHB),
   changedQuantity:Boolean(override),note:override?.reason||"Existing source allowance preserved",
   directCostTHB:null,postingAllowed:false
  });
 });
 const sum=key=>round(rows.reduce((n,x)=>n+x[key],0));
 const currentFatSellTHB=sum("currentWorkingSellTHB");
 const proposalFatSellTHB=sum("proposedWorkingSellTHB");
 const deltaTHB=round(proposalFatSellTHB-currentFatSellTHB);
 const proposedB3TotalTHB=round(workingRow.workingSellTHB+deltaTHB);
 const staff=get("FAT-STAFF"),hotel=get("HOTEL"),travel=get("TRAVEL-DAYS");
 const vendorIFat=cover.services.find(s=>s.id==="SERV-2"),vendorCustomer=cover.services.find(s=>s.id==="SERV-4");
 if(!vendorIFat||!vendorCustomer||vendorIFat.usd!==5000||vendorCustomer.usd!==2500||
  !cover.FAT.customerFATIsSeparateFromInternalIFAT||cover.overallTotalUSD!==368841||
  currentFatSellTHB!==397400||proposalFatSellTHB!==440200||deltaTHB!==42800||
  proposedB3TotalTHB!==2486200||workingRow.workingSellTHB!==2443400||
  travel.qty!==crew*travelDaysPerPerson||hotel.qty!==14||staff.qty!==12||
  rows.find(x=>x.expenseId==="B3-FAT-STAFF")?.qty!==14||
  rows.find(x=>x.expenseId==="B3-HOTEL")?.qty!==16||
  rows.filter(x=>x.changedQuantity).length!==2||rate.internalDirectCostVerified||
  rows.some(x=>x.postingAllowed)||workingRow.directCostTHB!==null)
  throw Error("B3 2+5 onshore scenario must reconcile without overriding approved SELL or supplier COST");
 return Object.freeze({
  moduleId:SRC+".fat-2plus5-pricing-scenario",
  parentModuleId:SRC+".fat",
  sourceModuleId:SRC+".revk-china-budget",
  status:"MANAGEMENT_REQUESTED_WORKING_SELL_PROPOSAL__NOT_POSTED__RELEASE_HOLD",
  currency:"THB",rateUSDPerPersonDay:rate.usdPerPersonDay,planningFxTHBPerUSD:rate.thbPerUsd,
  rateTHBPerPersonDay:rate.thbPerPersonDay,persons:crew,
  internalFatDays,customerFatDays,onsiteDays,onsitePersonDays:crew*onsiteDays,
  travelDaysPerPerson,travelPersonDays:travel.qty,hotelNightsPerPerson,
  airfareTripCount:1,allTravelSeparateFromOnsite:true,
  rows:Object.freeze(rows),
  currentFatSellTHB,proposalFatSellTHB,deltaTHB,
  currentB3WorkingSellTHB:workingRow.workingSellTHB,proposedB3TotalTHB,
  supplierFATIncludedUSD:vendorIFat.usd+vendorCustomer.usd,
  supplierTotalUSD:cover.overallTotalUSD,
  supplierServiceCostPostingAllowed:false,actualDirectCostTHB:null,
  currentWorkingSellOverwriteAllowed:false,customerReleaseAllowed:false,
  notes:Object.freeze([
   "Seven on-site working days comprise two iFAT days followed by five customer FAT days; travel is two additional days per person",
   "On-site crew: two paid ADDVALUE witnesses at USD600/person-day; no separate per diem",
   "Hotel assumes eight nights per person; one BKK-China-BKK return trip; confirm actual FAT dates and itinerary",
   "MGW SERV-2 USD5000 and SERV-4 USD2500 are separate supplier scopes already inside USD368841 vendor quote, not additive to ADDVALUE Working SELL",
   "Proposed THB440200 FAT and THB2486200 whole B3 are approval scenarios only, not a changed canonical B3 Working SELL or Customer Release"
  ])
 });
}
