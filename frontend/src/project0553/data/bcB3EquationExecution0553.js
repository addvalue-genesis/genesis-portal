// PJ2608-0553 — Section 02 GEQ/PEQ B3 engineering execution proof -> 10.2.
// Uses existing GEQ-005 etc and existing MR source/Rev05 WBS. No GEQ-034.
// Inspection points ≠ physical tests ≠ actual visits ≠ independent billable costs.
// Source-traced gross crew duty MH is a working shift-time scenario, NOT
// verified productive test MH, approved staffing, payroll, or new SELL price.
import IRT from "./bcB3IrtSourceLedger0553.json";
import VDRL from "./bcVdrlSourceLedger0553.json";
import {selectBcExecutionComplianceAudit0553} from "./bcExecutionComplianceAudit0553";
import {FAT_EXECUTION_BASIS_0553} from "./fatExecutionBasis0553";
import {derivePartBcWorkingWbs0553,PART_BC_WBS_SOURCE_0553} from "./partBCWorkingWbs0553";
import {deriveManHours,deriveLaborCost} from "../../common/cost/derivationKernel";

const freeze=x=>Object.freeze(x),round=n=>Math.round((n+Number.EPSILON)*100)/100;
const MR_CODES=freeze(["MR-0001","MR-0002","MR-0003","MR-0004"]);
const SOURCE_MR=freeze(Object.fromEntries(IRT.sourceDocuments.map(x=>[x.mr,x])));
const STAGE=freeze([
 freeze({code:"OEM_FACTORY_TEST",section:"§7.3 / §9",technicalOwner:"OEM_VENDOR",site:"OEM FACTORY; exact locations pending",businessOwner:"PART_A_OEM_INCLUDED_OR_SEPARATE_QUOTE_PROOF_REQUIRED",priceModel:"NOT_ADDED_TO_B3_WORKING_SELL"}),
 freeze({code:"BKK_INTEGRATED_FAT",section:"§7.3 / §9",technicalOwner:"ADDVALUE_SAMTEL_TECHNICAL_TEAM",site:FAT_EXECUTION_BASIS_0553.integratedFat.location,businessOwner:"B3_TH_INTEGRATED_FAT",priceModel:"SINGLE_CROSS_MR_WBS_EVENT_NOT_FOUR_INDEPENDENT_EIGHT_DAY_CAMPAIGNS"}),
 freeze({code:"OFFSHORE_SAT",section:"§7.4 / §9",technicalOwner:"VENDOR_ADDVALUE_PER_CONTRACT",site:"ZWP / BROWNFIELD; HUC plan pending",businessOwner:"B3_OFFSHORE_TRIP_WORKING_PLAN",priceModel:"PART_OF_39_TEAMDAYS_NOT_EXTRA"}),
 freeze({code:"OFFSHORE_COMMISSIONING",section:"§7.5 / §9",technicalOwner:"VENDOR_ADDVALUE_PER_CONTRACT",site:"ZWP / BROWNFIELD; HUC plan pending",businessOwner:"B3_OFFSHORE_TRIP_WORKING_PLAN",priceModel:"PART_OF_26_TECHNICAL_TEAMDAYS_NOT_SEPARATELY_ESTABLISHED"})
]);
const events=freeze(MR_CODES.flatMap(mr=>STAGE.map(stage=>freeze({
 id:"TEST-"+mr.replace("-","")+"-"+stage.code,mr,
 stage:stage.code,sourceDocNo:"MM-ZTK-1F-GEN-TEL-"+mr,section:stage.section,
 sourceUrl:SOURCE_MR[mr].url,sourceRevision:"C1",
 occurrenceType:"CONTRACT_REQUIRED_STAGE_NOT_PHYSICAL_VISIT_COUNT",
 eventGroupKey:stage.code==="BKK_INTEGRATED_FAT"?"B3-SAMTEL-BKK-CROSS-MR":"PER_MR_STAGED_REQUIREMENT",
 countAsAdditionalPricedVisit:false,technicalOwner:stage.technicalOwner,
 costOwner:stage.businessOwner,location:stage.site,
 technicalAcceptanceEvidence:null,approvedITPRef:null,approvedProcedureRef:null,
 actualTestDates:null,clientWitnessConfirmed:null,actualManHours:null,
 quantityProofStatus:"CONTRACT_STAGE_REQUIRED_EVENT_AND_DURATION_OPEN",
 billableDirectCostTHB:null
}))));
const byStage=freeze(Object.fromEntries(STAGE.map(x=>[x.code,freeze(events.filter(e=>e.stage===x.code))])));
const workload=(id,quantity,unitHours,source)=>{
 const hours=deriveManHours({applicable:1,quantity,unitHours,factor:1,evidence:source+" (WBS working quantity; neutral factor)"});
 const cost=deriveLaborCost({hours:hours.value,loadedRate:null,evidence:source+"; internal loaded cost rate missing"});
 return freeze({id,quantity,unitHours,source,model:"GEQ-005",status:hours.status,
  grossShiftMH:hours.value,actualProductiveMH:null,roleSpecificVerifiedMH:null,
  directCostStatus:cost.status,directCostTHB:cost.value,
  paidHoursVsShiftHoursGate:"SHIFT_HOURS_NOT_APPROVED_PAYROLL_OR_PRODUCTIVITY"});
};
const INSPECTION_IDS=freeze(IRT.records.map(r=>r.id));
if(IRT.records.length!==109||new Set(INSPECTION_IDS).size!==109)throw Error("B3 IRT source count/key error");
if(IRT.sourceDocuments.map(r=>r.count).join(",")!=="28,27,27,27")throw Error("B3 IRT distribution invalid");
if(!IRT.records.every(r=>r.sourceStatus==="SOURCE_IRT_RFQ_NOT_APPROVED_ITP"&&!r.pricePostingAllowed))
 throw Error("B3 IRT incorrectly labelled approved or billable");
if(events.length!==16||events.filter(e=>e.eventGroupKey==="B3-SAMTEL-BKK-CROSS-MR").length!==4)
 throw Error("B3 physical event grouping error");
export function selectBcB3EquationExecution0553(){
 const audit=selectBcExecutionComplianceAudit0553();
 const wbs=derivePartBcWorkingWbs0553();
 const line=wbs.rows.find(x=>x.code==="B3");
 if(!line||line.sellTHB!==2109600)throw Error("B3 WBS baseline changed");
 const fatDays=8,crew=2,dayOffice=8,dayOffshore=12;
 const fatRoles=freeze([
  workload("B3-FAT-SENIOR",fatDays,dayOffice,"Rev05 18_TH_FAT_WBS: 1 Senior × 8 Bangkok team-days, 8-hour office/yard day"),
  workload("B3-FAT-ENGINEER",fatDays,dayOffice,"Rev05 18_TH_FAT_WBS: 1 Engineer × 8 Bangkok team-days, 8-hour office/yard day")
 ]);
 const trips=freeze(audit.offshore.trips.map((trip,i)=>{
  const structure=[
   {technical:5,mob:1,demob:1,transfer:0,integration:0,mr:["MR-0001","MR-0002","MR-0003","MR-0004"]},
   {technical:5,mob:1,demob:1,transfer:0,integration:0,mr:["MR-0001","MR-0002","MR-0003","MR-0004"]},
   {technical:5,mob:1,demob:1,transfer:0,integration:0,mr:["MR-0001","MR-0002","MR-0003","MR-0004"]},
   {technical:3,mob:1,demob:1,transfer:0,integration:0,mr:["MR-0001","MR-0003"]},
   {technical:8,mob:1,demob:1,transfer:1,integration:2,mr:["MR-0001","MR-0002"]}
  ][i];
  if(!structure)throw Error("Unknown B3 source trip");
  const total=structure.technical+structure.mob+structure.demob+structure.transfer+structure.integration;
  if(total!==trip.teamDays)throw Error("B3 trip decomposition does not reconcile "+trip.id);
  const effort=workload(trip.id,trip.workingPersonDays,dayOffshore,
   "Rev05 23_SAT_TRIP_VALIDATION §B/C; offshore 12h working shift convention; "+trip.location);
  return freeze({...trip,stage:"OFFSHORE_SAT_AND_COMBINED_COMMISSIONING",
   sourceMR:freeze(structure.mr),composition:freeze(structure),
   grossShiftMH:effort.grossShiftMH,workloadProof:effort,
   approvedTestScopeDays:null,approvedScheduleRef:null,
   physicalTravelCostTHB:null,approvedAccess:false,
   noAdditiveMobDemob:true});
 }));
 const roll=freeze(trips.reduce((x,t)=>({
  technical:x.technical+t.composition.technical,
  mob:x.mob+t.composition.mob,demob:x.demob+t.composition.demob,
  transfer:x.transfer+t.composition.transfer,integration:x.integration+t.composition.integration,
  teamDays:x.teamDays+t.teamDays,personDays:x.personDays+t.workingPersonDays,
  grossShiftMH:x.grossShiftMH+t.grossShiftMH,
  tripCount:x.tripCount+1
 }),{technical:0,mob:0,demob:0,transfer:0,integration:0,
  teamDays:0,personDays:0,grossShiftMH:0,tripCount:0}));
 if(roll.technical!==26||roll.mob!==5||roll.demob!==5||roll.transfer!==1||
    roll.integration!==2||roll.teamDays!==39||roll.personDays!==78||roll.grossShiftMH!==936)
  throw Error("Rev05 39-day decomposition / crew gross MH failed");
 const fatMH=fatRoles.reduce((x,r)=>x+r.grossShiftMH,0);
 if(fatMH!==128)throw Error("Rev05 FAT 8-day two-role shift workload error");
 const fatSell=8*(12000+6000),offshoreRate=800*31.5;
 const offshoreSell=roll.personDays*offshoreRate;
 if(fatSell!==144000||offshoreSell!==1965600||fatSell+offshoreSell!==line.sellTHB)
  throw Error("B3 THB working SELL reconciliation failed");
 const itrCounts=freeze(Object.fromEntries(MR_CODES.map(mr=>[mr,IRT.records.filter(r=>r.mr===mr).length])));
 const testDocuments=freeze(VDRL.records.filter(x=>/FAT Report|SAT Report|Inspection and test plan|FAT Procedure|SAT Procedure/i.test(x.title)));
 const validation=freeze([
  freeze({id:"B3-VAL-01",status:"PASS_SOURCE_IRT_ONLY",label:"MR Section 9 IRT identity",
   detail:"109 source RFQ IRT points = 28/27/27/27; not 109 billable tests; approved OEM ITP source still absent."}),
  freeze({id:"B3-VAL-02",status:"PASS_WORKING_PRICE_ONLY",label:"WBS event price conservation",
   detail:"One integrated Bangkok FAT 8 × THB18,000 plus 78 offshore MD × USD800 × THB31.5 = THB2,109,600 Working SELL; not Direct Cost."}),
  freeze({id:"B3-VAL-03",status:"PASS_INCLUDED_MOB_NOT_ADDITIVE",label:"Offshore shift composition",
   detail:"39 team-days = 26 technical + 10 MOB/DEMOB + 2 integration + 1 transfer; do not add 10 again; 44-day scenario superseded."}),
  freeze({id:"B3-VAL-04",status:"OPEN_APPROVED_ITP_AND_TEST_EVENT_KEYS",label:"Test methodology/owner",
   detail:"OEM shop vs Bangkok cross-MR test; inspection points, witness group, FAT/SAT/COMM case count, signed procedure and acceptance results require approved ITP and RACI."}),
  freeze({id:"B3-VAL-05",status:"OPEN_SAT_COM_SCHEDULE_AND_HUC",label:"Physical offshore rotations",
   detail:"5 rotations and 39 team-days are Rev05 assumptions; HUC/SIMOPS/POB, marine transfers, SAT vs COMM split, standby, equipment and actual approved hours pending."}),
  freeze({id:"B3-VAL-06",status:"OPEN_INTERNAL_COST_AND_TRANSPORT",label:"Direct cost and logistics",
   detail:"No loaded payroll, per diem, POB, travel, OEM specialist, marine transfer rate or tax input. Shift hours are gross working convention not verified productive MH or rate."}),
  freeze({id:"B3-VAL-07",status:"OPEN_WITNESS_NOTICE_30_VS_14",label:"Client witness notification",
   detail:"BOD 30 calendar days vs SPE 14 days; 30-day conservative scheduling only until formal contract precedence disposition."}),
  freeze({id:"B3-VAL-08",status:"TRACE_CROSS_OWNER_NON_ADDITIVE",label:"B1/B2/B3/B9 boundary",
   detail:"B1 technical prep/review, B2 document lifecycle, B3 physical testing and original signed evidence, B9 China-yard supervision; any overlap requires item-level owner decision."})
 ]);
 return freeze({
  moduleId:"bid.engineering.equations.b3",workflowNumber:"02",customerCode:"B3",
  sourceITRModule:IRT.moduleId,sourceAuditModule:audit.moduleId,
  kernelPath:"frontend/src/common/cost/derivationKernel.js",
  GEQ:freeze(["GEQ-001","GEQ-004","GEQ-005","GEQ-006","GEQ-007","GEQ-013","GEQ-016","GEQ-017","GEQ-018","GEQ-023","GEQ-026"]),
  PEQ:freeze(Array.from({length:11},(_,i)=>"PEQ-B3-"+String(i+1).padStart(3,"0"))),
  sourceWbsUrl:PART_BC_WBS_SOURCE_0553.url,
  mrIrtCounts:itrCounts,irtSourceCount:IRT.records.length,irtSourceRows:IRT.records,
  testStages:STAGE,stageRequirementKeys:events,stageRequirementGroups:byStage,
  testDocumentRows:testDocuments,stageRequirementCount:events.length,
  integratedFat:freeze({location:FAT_EXECUTION_BASIS_0553.integratedFat.location,
   status:FAT_EXECUTION_BASIS_0553.status,workingTeamDays:fatDays,
   crew:crew,roleWorkload:fatRoles,workingGrossShiftMH:fatMH,
   currentDirectCostTHB:null,sellTeamDayTHB:18000,workingSellTHB:fatSell,
   source:"Rev05 18_TH_FAT_WBS, FAT-EXEC-0553-20261015-BKK"}),
  offshore:freeze({crew,workingTripCount:roll.tripCount,workingTeamDays:roll.teamDays,
   workingPersonDays:roll.personDays,grossShiftMH:roll.grossShiftMH,
   tripComposition:roll,workingTrips:trips,workingRateUSDPerMD:800,
   workingFXTHBPerUSD:31.5,workingSellTHB:offshoreSell,
   approvedPhysicalTripCount:null,approvedHucPlan:null,approvedSatDays:null,approvedCommissioningDays:null,
   source:"Rev05 23_SAT_TRIP_VALIDATION; GEQ-005 on 12h offshore duty convention",
   siteWorkloadStatus:"WORKING_SCENARIO_NOT_APPROVED_OFFSHORE_EXECUTION"}),
  workingSellTHB:fatSell+offshoreSell,
  independentVerifiedSellTHB:null,independentDirectCostTHB:null,
  independentApprovedProductiveMH:null,customerReleaseAllowed:false,postToLedger:false,
  validation,noDoubleCountRule:"109 RFQ IRT source points ≠ visits; 4 Bangkok MR case groups ≠ 4 FAT campaigns; 10 MOB/DEMOB included; B1/B2/B3/B9 source ownership non-additive"
 });
}
