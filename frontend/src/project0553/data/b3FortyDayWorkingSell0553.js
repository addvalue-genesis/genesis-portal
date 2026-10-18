// PJ2608-0553 | user selected 40 Offshore SAT/SIT WORKING days x 2 specialists
// at USD800 per person-day, planning THB/USD 31.50. Office/travel days outside
// 40 productive SAT/SIT days and remain separately scoped/unpriced.
// Rev.K K15-18 and earlier Rev.J/Rev.H are distribution guides, not measured work days.
// Includes 30-day VeEX MX100+ provisional rental THB1,000/day ex VAT as bare
// pass-through SELL estimate (zero markup assumption; verify contract/rental terms).
const roundB3FortyDay0553=n=>Math.round((n+Number.EPSILON)*100)/100;
export const B3_40DAY_ACTIVITY_SCENARIO_0553=Object.freeze([
 {id:"BF-ZPQ",site:"ZPQ",mr:"MR0001/2/3/4 host",wbs:"K15",days:3,reason:"Central NMS/PLC/PABX and host interface validation"},
 {id:"BF-ZWP8",site:"ZWP8",mr:"MR0001 BF",wbs:"K15",days:2,reason:"Existing host network, RF path and site interface"},
 {id:"BF-ZWP11",site:"ZWP11",mr:"MR0001 BF",wbs:"K15",days:2,reason:"Existing host network, RF path and site interface"},
 {id:"GF-ZWP20",site:"ZWP20",mr:"MR0001–0004",wbs:"K16",days:8,reason:"WiMAX, RFI BDA, Ex phone/sounder and RACON, joint E2E"},
 {id:"GF-ZWP21",site:"ZWP21",mr:"MR0001–0004",wbs:"K16",days:7,reason:"WiMAX, RFI BDA, Ex phone/sounder and RACON"},
 {id:"GF-ZWP22",site:"ZWP22",mr:"MR0001–0004",wbs:"K16",days:7,reason:"WiMAX, RFI BDA, Ex phone/sounder and RACON"},
 {id:"GF-ZWP23",site:"ZWP23",mr:"MR0001 & 3 (existing radio coverage)",wbs:"K16",days:5,reason:"WiMAX, Ex phone/sounder; no new BDA and no new RACON"},
 {id:"SIT",site:"Cross-site / ZPQ",mr:"Integrated MR0001–0004",wbs:"K17",days:4,reason:"NMS/PLC/voice/radio/alarm recovery and endurance witness"},
 {id:"PUNCH",site:"As-left / offshore",mr:"All",wbs:"K18",days:2,reason:"Re-test, SAT record verification and witnessed punch close"}
]);
export function selectB3FortyDayWorkingSell0553(){
 const rows=B3_40DAY_ACTIVITY_SCENARIO_0553.map(x=>Object.freeze({
  ...x,costOwner:"B3",crew:2,plannedPersonDays:x.days*2,
  priceClass:"CURRENT_OFFSHORE_SAT_SELL_ALLOWANCE",directCostTHB:null,
  postingType:"INCLUDED_IN_CURRENT_B3_WORKING_SELL",
  workingSellTHB:roundB3FortyDay0553(x.days*2*800*31.5)
 }));
 const workdays=rows.reduce((v,x)=>v+x.days,0);
 if(workdays!==40||rows.filter(x=>x.site.startsWith("ZWP")||x.site==="ZPQ").length!==7)
  throw Error("B3 seven-site + SIT/Punch 40-day workload mismatch");
 const laborWorkingSellTHB=roundB3FortyDay0553(rows.reduce((v,x)=>v+x.workingSellTHB,0));
 const veex=Object.freeze({id:"B3-VEEX-MX100",quantity:30,unit:"rental-day",rateTHB:1000,
  workingSellTHB:30000,verifiedDirectCostTHB:null,costOwner:"B3",
  rateSource:"User-confirmed VeEX VePAL MX100+ THB1,000/rental-day ex VAT; 30-day Rev.P rental scenario",
  pricing:"PRE_AWARD_BUDGETARY_PASS_THROUGH_NO_MARKUP__EX_VAT",nonAdditiveToB11:true});
 const workingSellTHB=roundB3FortyDay0553(laborWorkingSellTHB+veex.workingSellTHB);
 if(laborWorkingSellTHB!==2016000||workingSellTHB!==2046000)
  throw Error("B3 40-day working sell calculation changed");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b3.40-day-abc",rows,veex,
  team:["Senior Telecom Systems Integration Engineer","Senior RF/Telecom Field Specialist"],
  workdays,persons:2,personDays:80,rateUSDPerPersonDay:800,fxTHBPerUSD:31.5,
  laborWorkingSellTHB,toolRentalWorkingSellTHB:veex.workingSellTHB,workingSellTHB,
  excludedCostDrivers:["Airfare/MOB/DEMOB outside 40 productive SAT days","Offshore access/POB/medical/visa/insurance costs",
   "RF signal generator, calibrated analyzer and sound meter rental prices unknown",
   "RACON marine vessel/radar/operator and testing witness payment owner OPEN",
   "Weather/site-readiness delay and unplanned re-test contingency"],
  noDuplicate:"40 days apply once to 2-person crew; site allocations are timeboxes; SAT instruments temporary B3, permanent O&M tools B11",
  condition:"Working Sell budgetary scope accepted by user; schedule and suppliers not yet verified",
  directCostTHB:null,releaseAllowed:false
 });
}
