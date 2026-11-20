// PJ2608-0553 | 10.2 B3 Offshore mobilization economic scenario kernel.
// No default labor COST, no vendor freight price and no hypothetical
// scenario may be promoted into the B3/B9 direct-cost ledger.
// First Principles: required site work -> crew effort -> physical rotations ->
// travel/embarkation/standby -> auditable economics, subject to access gates.
import {selectBcExecutionComplianceAudit0553} from "./bcExecutionComplianceAudit0553";

const finiteNonnegative=x=>Number.isFinite(x)&&x>=0;
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const requiredSites=Object.freeze(["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"]);

export function evaluateOffshoreMobDemobEconomics0553({
 crewCostTHBPerMD=null,
 travelTHBPerPersonRoundTrip=null,
 extraMobDemobMDPerRotation=null,
 mobDemobAlreadyIncludedIn39=null,
 options=[]
}={}){
 const audit=selectBcExecutionComplianceAudit0553();
 const base=Object.freeze({crew:audit.offshore.crew,teamDays:audit.offshore.teamDays,
  personDays:audit.offshore.personDays,sites:requiredSites.slice(),
  source:"Rev05 23_SAT_TRIP_VALIDATION; site HUC/SIMOPS approval required"});
 const validRates=finiteNonnegative(crewCostTHBPerMD)&&
  finiteNonnegative(travelTHBPerPersonRoundTrip)&&
  Number.isFinite(extraMobDemobMDPerRotation)&&extraMobDemobMDPerRotation>=0 &&
  typeof mobDemobAlreadyIncludedIn39==="boolean";
 const evaluated=options.map(option=>{
  const covered=new Set(option?.coveredSites||[]);
  const completeCoverage=requiredSites.every(x=>covered.has(x));
  const approved=option?.hucApproved===true&&option?.simopsApproved===true&&
   option?.pobApproved===true&&option?.marineTransfersApproved===true&&
   typeof option?.approvedScheduleRef==="string"&&option.approvedScheduleRef.trim().length>0;
  const qtyValid=Number.isInteger(option?.rotationCount)&&option.rotationCount>0&&
   finiteNonnegative(option?.transferAndAdditionalCostTHB);
  const eligible=completeCoverage&&approved&&qtyValid;
  if(!eligible||!validRates)
   return Object.freeze({id:option?.id||"UNNAMED",eligible:false,
    rotationCount:option?.rotationCount??null,
    status:!eligible?"HUC_POB_SIMOPS_ROUTE_AND_SOURCE_APPROVAL_REQUIRED":"VERIFIED_COST_INPUTS_REQUIRED",
    scenarioTotalDirectCostTHB:null,derivedIncrementalCostTHB:null});
  const laborCostTHB=base.personDays*crewCostTHBPerMD;
  const roundTripCostTHB=option.rotationCount*base.crew*travelTHBPerPersonRoundTrip;
  const extraMobCostTHB=mobDemobAlreadyIncludedIn39?0:
   option.rotationCount*extraMobDemobMDPerRotation*crewCostTHBPerMD;
  const scenarioTotalDirectCostTHB=round(laborCostTHB+roundTripCostTHB+
   extraMobCostTHB+option.transferAndAdditionalCostTHB);
  return Object.freeze({id:option.id,eligible:true,rotationCount:option.rotationCount,
   status:"SCENARIO_EVALUATED_NOT_APPROVED_BUDGET",
   laborCostTHB:round(laborCostTHB),roundTripCostTHB:round(roundTripCostTHB),
   extraMobCostTHB:round(extraMobCostTHB),
   scenarioTotalDirectCostTHB,derivedIncrementalCostTHB:round(roundTripCostTHB+extraMobCostTHB+option.transferAndAdditionalCostTHB),
   source:option.approvedScheduleRef,
   includedInCurrentCostLedger:false});
 });
 const allCompared=options.length>=2&&evaluated.every(r=>r.eligible);
 const ranked=allCompared?[...evaluated].sort((a,b)=>a.scenarioTotalDirectCostTHB-b.scenarioTotalDirectCostTHB):[];
 return Object.freeze({moduleId:"bid.budget.working.bc.b3.mob-demob-economics",
  baseline:base,scenarios:evaluated,
  recommendation:ranked[0]||null,
  state:allCompared?"COMPARABLE_COST_SCENARIOS_PENDING_MANAGEMENT_RELEASE":"INSUFFICIENT_VERIFIED_COST_OR_ACCESS_DATA",
  workingB3SellReferenceTHB:audit.offshore.activeB3WorkingSellTHB,
  directCostPostingAllowed:false,
  note:"Economic minimum is conditional on approved HUC/POB/SIMOPS and verified input rates. WBS 39 days and 5 trips are provisional; do not reuse 44-day superseded MOB allowances."});
}
