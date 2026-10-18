// PJ2608-0553 — management-authorized B1 reprice: 27 role-engineering WBS + distinct
// Rev.K office management events. This replaces—not adds to—old THB510,000.
// Historical 964 MH and role cost seeds are WBS evidence, NOT verified payroll;
// planning office commercial factor is the Rev05 control, not fabricated current margin.
// K00 PM 8h specifically excluded: legacy engineering WBS first item already contains
// project kickoff/design-basis review. Remaining PM stage coordination is unique.
import {B1_WBS_ACTIVITIES} from "./bcWorkCostLines0553";
import {selectB1RevKMilestoneCoverage0553} from "./b1RevKMilestoneCoverage0553";
import {ONSHORE_WORKING_SELL_RATE_0553} from "./onshoreWorkingRate0553";
const roleRateSeed=Object.freeze({Lead:341.625,Senior:250,Engineer:137.5,Drafter:116.625,DocumentControl:104.125});
const officeSellFactor=2.8228342959766093;
const roundB1Activity0553=n=>Math.round((n+Number.EPSILON)*100)/100;
export function selectB1ActivityWorkingSell0553(){
 const eng=B1_WBS_ACTIVITIES.map(([group,activity,lead,sr,eng,draft,dc,historicalCostProxy],i)=>{
  const roleMH=Object.freeze({Lead:lead,Senior:sr,Engineer:eng,Drafter:draft,DocumentControl:dc});
  const q=lead+sr+eng+draft+dc;
  const seedTHB=roundB1Activity0553(lead*roleRateSeed.Lead+sr*roleRateSeed.Senior+eng*roleRateSeed.Engineer+draft*roleRateSeed.Drafter+dc*roleRateSeed.DocumentControl);
  return Object.freeze({id:"B1-ENG-"+String(i+1).padStart(2,"0"),group,activity,roleMH,quantityMH:q,
   legacyCostSeedTHB:seedTHB,workingSellTHB:roundB1Activity0553(seedTHB*officeSellFactor),
   status:"REV05_ENGINEERING_WORKLOAD_AND_RATE_CALIBRATION__PRE_AWARD",
   costOwner:"B1",directCostTHB:null,postingType:"CANONICAL_B1_REPLACEMENT_COMPONENT"});
 });
 const historicalHours=eng.reduce((a,x)=>a+x.quantityMH,0);
 const historicalSeed=roundB1Activity0553(eng.reduce((a,x)=>a+x.legacyCostSeedTHB,0));
 const engineeringSellTHB=roundB1Activity0553(historicalSeed*officeSellFactor);
 // Do NOT sum individually rounded per-work-item currency values to force a total.
 if(eng.length!==27||historicalHours!==964||historicalSeed!==180892.75||engineeringSellTHB!==510630.26)
  throw Error("B1 27-line engineering baseline evidence does not reconcile");
 const revk=selectB1RevKMilestoneCoverage0553();
 const pmEvents=revk.rows.filter(x=>x.chargeableHere).map(x=>{
  const overlappingKickoff=x.stage==="K00";
  const billMH=overlappingKickoff?0:x.planningPmHours;
  return Object.freeze({id:"B1-PM-"+x.stage,wbs:x.stage,activity:x.what,
    requirement:x.deliverable,quantityMH:billMH,costOwner:"B1",
    workingSellRateTHB:ONSHORE_WORKING_SELL_RATE_0553.thbPerPersonDay/8,
    workingSellTHB:roundB1Activity0553(billMH*ONSHORE_WORKING_SELL_RATE_0553.thbPerPersonDay/8),
    directCostTHB:null,postingType:overlappingKickoff?
      "NON_POSTING_DUPLICATE_KICKOFF_IN_LEGACY_ENGINEERING":
      "CANONICAL_B1_REPLACEMENT_COMPONENT",
    source:"Rev.K unique PM gate; office non-field work only"});
 });
 const pmUniqueHours=pmEvents.reduce((v,x)=>v+x.quantityMH,0);
 const officePmWorkingSellTHB=roundB1Activity0553(pmEvents.reduce((v,x)=>v+x.workingSellTHB,0));
 const workingSellTHB=roundB1Activity0553(engineeringSellTHB+officePmWorkingSellTHB);
 if(pmEvents.length!==12||pmUniqueHours!==48||officePmWorkingSellTHB!==113400||workingSellTHB!==624030.26)
  throw Error("B1 updated engineering plus distinct PM budget inconsistent");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b1.current-abc",workingSellTHB,
  engineeringSellTHB,officePmWorkingSellTHB,engineeringMH:historicalHours,
  uniquePmHours:pmUniqueHours,legacyB1WorkingSellTHB:510000,
  replacedLegacyDeltaTHB:roundB1Activity0553(workingSellTHB-510000),
  engineeringRows:eng,pmRows:pmEvents,uniquePostedEvents:eng.length+pmEvents.filter(x=>x.quantityMH>0).length,
  rateBasis:"Rev05 27 engineering activity / 964 MH role seeds × Rev05 office factor; 11 nonduplicate Rev.K PM gates × USD600 onshore SELL × 31.5/8",
  duplicatedK00PmExcluded:true,
  noDoubleCount:"B1 excludes K01 witness travel (B9), Yard specialist (B9), offshore SAT (B3), document-control (B2) and OEM engineering (Part A)",
  costState:"WORKING_SELL_BUDGETARY__INTERNAL_PAYROLL_RATE_NOT_VERIFIED",
  directCostTHB:null,releaseAllowed:false,customerReleaseAllowed:false
 });
}
