// PJ2608-0553 | 10.2 B1–B14 + C1/C2 evidence-first derivation.
// Distinguishes source-backed quantities, historical *cost proxies*, current
// working SELL, and approved internal DIRECT COST (none established here).
// Never post a source-derived SELL amount as internal COST.
import PARTICULAR from "./documentParticularRequirements0553.json";
import {PART_BC_WBS_SOURCE_0553,derivePartBcWorkingWbs0553} from "./partBCWorkingWbs0553";
import {FAT_EXECUTION_BASIS_0553} from "./fatExecutionBasis0553";
import {BC_CUSTOMER_CODES_0553} from "./bcWorkingModuleRoutes0553";
import {REV08_BASELINE} from "./rev08CommercialBaseline";

const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const SOURCE_URL=PART_BC_WBS_SOURCE_0553.url;
const workbooks=Object.freeze({
 B1:"08_B1_ENGINEERING",B2:"09_B2_DOCUMENTATION",B3:"10_B3_CAMPAIGN_PRICE",
 B8:"11_B8_B9",B9:"11_B8_B9"
});
const gaps=Object.freeze({
 B1:["Verify 964 engineering MH against MR/DWG/interface changes and scope of pre-design site survey","Obtain controlled internal payroll/subcontract rate by role and actual allocation","Confirm client acceptance of engineering deliverables and review cycles"],
 B2:["Verify 143 VDRL source rows / 38 unique document titles and number of issue/review cycles","Separate document-control MH from technical authorship B1 and test activity B3","Obtain current Document Controller/reviewer cost rates and final dossier workload"],
 B3:["Approve SAMTEL Bangkok integrated FAT test matrix, facilities/instruments, crew and days for all 4 MR","Obtain actual internal FAT and offshore crew payroll, travel, offshore allowance and subcontract cost rates","Confirm offshore HUC/SIMOPS, site/trip plan, 39 team-days and 78 MD working allowance; keep distinct from China Yard B9"],
 B4:["Check whether coating/painting is already included in OEM Part A vendor supply","If separate, require technical surface area, supplier scope and coating price"],
 B5:["Confirm OEM packing/marking included in Part A and export packing requirements","Price incremental FAT-to-China packing only when not already included"],
 B6:["Quote every MR-specific transport leg including China-origin MR0002 → Thailand → China","Confirm Thai customs/temporary admission eligibility, China importer of record, broker, duty, VAT and delivery named place","Reconcile RFQ DDP purchaser yard versus WBS CIF China-port reference before customer release"],
 B7:["Confirm 3-month workshop storage requirement and each vendor's included allowance","Record a charge only after establishing excluded/incremental storage days and source rate"],
 B8:["Check training sessions, participants, course duration and OEM trainer inclusion","Obtain actual trainer personnel, venue, materials and travel direct costs"],
 B9:["Confirm ADDVALUE 2-person Nantong installation supervision scope and 12 team-days working allowance","Obtain actual salary/subcontract, allowance, insurance, international travel, hotel and local transport rates","Exclude construction labor performed by JUTAL and test tasks already covered in B3"],
 B10:["Obtain vendor-approved commissioning/startup spare SKU schedule by MR/site","Verify required quantities and rates net of Part A included spares"],
 B11:["Obtain OEM special tool list by system and inclusion/exclusion from equipment package","Price only separately required tools and certificates"],
 B12:["Confirm first-filling applicability to supplied telecom equipment with OEM","Do not assume N/A until resolved"],
 B13:["Obtain distinct consumables list for preservation, operation and maintenance","Exclude items included with supplier packages and B10 commissioning spares"],
 B14:["Confirm required performance/warranty bonds, insured value and responsible contracting party","Obtain insurance/bank rate evidence rather than applying an invented percentage"],
 C1:["Obtain OEM capital spare SKUs, required stock quantities and options","Keep separate from equipment and commissioning spares"],
 C2:["Obtain OEM two-year normal-operation spare schedule and failure-rate/MTBF basis","Keep separate from capital spares C1 and Part A included quantities"]
});
const extraRequirements=Object.freeze({
 B1:["REQ0553-011","REQ0553-032","REQ0553-088"],
 B3:["REQ0553-012","REQ0553-013","REQ0553-016","REQ0553-048","REQ0553-080"],
 B6:["REQ0553-005","REQ0553-009"],
 B9:["REQ0553-010"]
});
const row=(id,activity,quantity,unit,rateTHB,amountTHB,valueClass,status,evidence)=>{
 if(Number.isFinite(rateTHB)&&(!Number.isFinite(quantity)||quantity<0))
  throw Error("Invalid quantity for rate-backed line "+id);
 if(Number.isFinite(amountTHB)&&!Number.isFinite(quantity)&&valueClass==="WORKING_SELL_DERIVED")
  throw Error("Unexplained working sell amount for "+id);
 return Object.freeze({id,activity,quantity,unit,rateTHB,amountTHB,valueClass,status,evidence});
};
const r=(id,activity,quantity,unit,evidence)=>row(id,activity,quantity,unit,null,null,"QUANTITY_OR_REQUIREMENT_ONLY","RATE_OR_BASIS_PENDING",evidence);
const fact=(id,activity,quantity,unit,rateTHB,amountTHB,evidence)=>
 row(id,activity,quantity,unit,rateTHB,amountTHB,"WORKING_SELL_DERIVED","WORKING_RATE_NOT_INTERNAL_COST",evidence);
const hist=(id,activity,amountTHB,evidence)=>
 row(id,activity,null,"THB",null,amountTHB,"HISTORICAL_COST_PROXY_ONLY","NOT_APPROVED_DIRECT_COST",evidence);
function forCode(code,working){
 const sheet=workbooks[code]||"00_EXEC_QUOTE / 12_B4_B14_DETAIL";
 const e=sheet+" · "+PART_BC_WBS_SOURCE_0553.revision;
 switch(code){
  case "B1":{
   const historic=180892.75,calibration=2.8228342959766093;
   const implied=round(historic*calibration);
   if(implied!==510630.26||working.sellTHB!==510000)throw Error("B1 historical calibration/quote reconciliation failed");
   return {sheet,
    lines:[r("B1-ROLE-MH","Engineering by work object and role (Lead/Senior/Engineer/Drafter/DC)",964,"MH",e),
     hist("B1-REV05-ROLE-COST","Rev05 role-rate historical cost proxy (NOT today's payroll)",historic,e),
     row("B1-HISTORIC-CALIBRATION","Historical commercial factor × proxy",1,"factor",null,implied,
      "HISTORICAL_SELL_CALIBRATION_ONLY","NOT_APPROVED_COST_OR_PRICE",e)],
    reconciliation:{workingSellTHB:working.sellTHB,historicalImpliedSellTHB:implied,quotedVsImpliedDeltaTHB:round(working.sellTHB-implied)}};
  }
  case "B2":{
   if(working.sellTHB!==580000)throw Error("B2 WBS working quote has changed");
   return {sheet,lines:[
    r("B2-VDRL-ROWS","MR1 37 + MR2 36 + MR3 35 + MR4 35 VDRL source rows",143,"VDRL rows",e),
    r("B2-UNIQUE-TITLES","Project-unique document title types (not 143 independent authoring tasks)",38,"document titles",e),
    hist("B2-REV04-LOW","Rev04 bounded direct-cost proxy lower end",202717.25,e),
    hist("B2-REV04-HIGH","Rev04 bounded direct-cost proxy upper end",208217.25,e)
   ],reconciliation:{workingSellTHB:working.sellTHB,historicalCostProxyRangeTHB:[202717.25,208217.25]}};
  }
  case "B3":{
   const fatTeamDays=8,thaiFatWorkingTeamRate=18000,offshoreTeamDays=39,crew=2;
   const offshoreWorkingSellRateTHB=round(800*31.5);
   const fat=round(fatTeamDays*thaiFatWorkingTeamRate);
   const offshore=round(offshoreTeamDays*crew*offshoreWorkingSellRateTHB);
   const total=round(fat+offshore);
   if(fat!==144000||offshore!==1965600||total!==working.sellTHB)
    throw Error("B3 FAT + offshore working SELL evidence must reconcile to Rev05");
   if(FAT_EXECUTION_BASIS_0553.integratedFat.location!=="SAMTEL Warehouse, Thailand")
    throw Error("B3 must follow approved integrated FAT location");
   return {sheet,lines:[
    fact("B3-TH-INTEGRATED-FAT","SAMTEL Bangkok Integrated FAT — Rev05 8 team-day allowance (MR1–MR4 test scope to reconfirm)",fatTeamDays,"team-day",thaiFatWorkingTeamRate,fat,e+"; 18_TH_FAT_WBS; selected location approved; duration not approved"),
    fact("B3-OFFSHORE-SAT-COMM","Offshore SAT/commissioning — 39 team-days × 2 persons; 5 trips working only",offshoreTeamDays*crew,"MD",offshoreWorkingSellRateTHB,offshore,e+"; 23_SAT_TRIP_VALIDATION; USD800/MD × working FX31.5; NOT internal payroll"),
    r("B3-TRIP-SCENARIO","Offshore physical trips, not an agreed HUC/SIMOPS movement plan",5,"trips","23_SAT_TRIP_VALIDATION; WORKING_ASSUMPTION"),
    r("B3-TEST-EVIDENCE","Approved ITP/Factory pretest, client witness and integrated cross-MR test sign-off",null,"test matrix",FAT_EXECUTION_BASIS_0553.id)
   ],reconciliation:{workingSellTHB:total,fatWorkingSellTHB:fat,offshoreWorkingSellTHB:offshore,approvedLocation:FAT_EXECUTION_BASIS_0553.integratedFat.location}};
  }
  case "B6":{
   const historical=REV08_BASELINE.summary.find(x=>x[0]==="B6");
   if(!historical||historical[2]!==9764.5714||REV08_BASELINE.currency!=="USD")throw Error("B6 Rev08 historical freight evidence changed");
   const planningFxTHBPerUSD=31.5; // Rev05 WBS working planning FX; NOT verified BOT FX.
   const historicalDisplayTHB=round(historical[2]*planningFxTHBPerUSD);
   return {sheet,lines:FAT_EXECUTION_BASIS_0553.mrPaths.map(x=>r(
    "B6-"+x.mr,x.mr+" — "+x.routing,null,"shipments / customs",
    x.source+"; "+x.logistics
   )),reconciliation:{requiredMRs:4,coveredMRs:FAT_EXECUTION_BASIS_0553.mrPaths.length,namedFinalDestination:FAT_EXECUTION_BASIS_0553.yard.location,
    historicalRev08TransportSellTHB:historicalDisplayTHB,displayCurrency:"THB",planningFxTHBPerUSD,fxBasis:"REV05_WORKING_PLANNING_FX_NOT_BOT_VERIFIED",historicalBasis:"4-Scope of Supply.xlsx Rev08 / B6 Transportation — HISTORICAL SELL ONLY; not freight quotation or direct cost",
    historicToCurrentAllocation:"NOT_ALLOWED_WITHOUT_FREIGHT_QUOTE_AND_SCOPE_RECONCILIATION"}};
  }
  case "B9":{
   if(working.sellTHB!==574560)throw Error("B9 WBS sell has changed");
   return {sheet,lines:[
    r("B9-YARD-DAYS","JUTAL Nantong supervision; 12 team-days × 2 ADDVALUE staff",12,"team-days",e+"; "+FAT_EXECUTION_BASIS_0553.id),
    r("B9-MAN-DAYS","Staff effort at China yard (not construction crew)",24,"MD",FAT_EXECUTION_BASIS_0553.id),
    r("B9-TRAVEL","Airfare, accommodation and local China transport; excluded/actual in Rev05",null,"trip cost",e),
    r("B9-WORK-SCOPE","Supervise JUTAL erection/pre-commissioning; no duplicate B3 physical FAT",null,"approved responsibility matrix",FAT_EXECUTION_BASIS_0553.id)
   ],reconciliation:{workingSellTHB:working.sellTHB,crew:2,workingTeamDays:12}};
  }
  case "B8":return {sheet,lines:[r("B8-TRAIN-MH","Working training content and delivery",44,"MH",e)],reconciliation:{workingSellTHB:working.sellTHB}};
  case "B7":return {sheet,lines:[r("B7-STORAGE","Vendor workshop storage requested; package inclusion unconfirmed",3,"months",e)],reconciliation:null};
  default:return {sheet,lines:[r(code+"-SCOPE",working.driver,Number.isFinite(working.qty)?working.qty:null,working.unit,e)],reconciliation:null};
 }
}
export function selectBcCostEvidenceDerivation0553(){
 const wbs=derivePartBcWorkingWbs0553();
 const byCode=new Map(wbs.rows.map(v=>[v.code,v]));
 const requirements=Array.isArray(PARTICULAR.records)?PARTICULAR.records:[];
 const rows=BC_CUSTOMER_CODES_0553.map(code=>{
  const working=byCode.get(code);
  if(!working||!gaps[code])throw Error("Missing B/C evidence row "+code);
  const proof=forCode(code,working);
  const explicit=new Set(extraRequirements[code]||[]);
  const matched=requirements.filter(q=>explicit.has(q.id)||
   new RegExp("(^|[^A-Z0-9])"+code+"([^A-Z0-9]|$)").test(q.costDriver||""));
  const unique=[...new Map(matched.map(q=>[q.id,q])).values()];
  const requirementRecords=unique.map(q=>({
   id:q.id,topic:q.topic,sourceClass:q.document||"RFQ/MR",
   section:q.section||null,requirement:q.requirement,
   state:"SOURCE_REGISTERED_NOT_AUTOMATIC_TECHNICAL_ACCEPTANCE"
  }));
  const stages=[
   {id:"01",name:"Governance / Contract Scope",state:"SOURCE_REGISTERED",basis:"Customer 4-Scope of Supply; cost ownership / package split"},
   {id:"02",name:"First Principles / Constraints",state:"METHOD_ESTABLISHED_NOT_FULL_COST",basis:"Activity / resource / function derivation (cost rates not verified)"},
   {id:"03",name:"System Architecture / Interfaces",state:"WORKING_SYSTEM_SCOPE",basis:"MR0001–MR0004 interfaces; common tasks must be counted once"},
   {id:"04",name:"MR & Documents",state:requirementRecords.length?"REQUIREMENT_LINKS_PRESENT":"SOURCE_COVERAGE_REVIEW",basis:requirementRecords.length?requirementRecords.map(q=>q.id).join(", "):"Check MR/ITP and customer workbook against this category"},
   {id:"05.3",name:"DWG / BOM / Site Engineering",state:"BOUNDARY_CHECK_REQUIRED",basis:"Link site/TAG/bulk only where physically attributable; avoid A/B double-count"},
   {id:"06",name:"Execution WBS",state:"WBS_REV05_WORKING_BASIS",basis:proof.sheet+" — "+PART_BC_WBS_SOURCE_0553.revision},
   {id:"07",name:"Vendor & Internal Cost Rates",state:"CONTROLLED_DIRECT_COST_INPUT_MISSING",basis:"Current payroll/subcontract/freight/OEM quote + inclusion proof needed"},
   {id:"08",name:"Risk / Project Logistics",state:"QUALIFICATIONS_OPEN",basis:"SAMTEL Bangkok FAT, JUTAL Nantong delivery, SAT/POB and discipline-specific scope gates"}
  ];
  if(proof.lines.some(x=>x.valueClass==="WORKING_SELL_DERIVED") &&
    round(proof.lines.filter(x=>x.valueClass==="WORKING_SELL_DERIVED")
       .reduce((sum,x)=>sum+x.amountTHB,0))!==working.sellTHB)
   throw Error("Derived sell components fail reconciliation at "+code);
  return Object.freeze({
   code,moduleId:"bid.budget.working.bc."+code.toLowerCase(),sourceUrl:SOURCE_URL,
   sourceSheet:proof.sheet,sourceRevision:PART_BC_WBS_SOURCE_0553.revision,
   lines:proof.lines,stages,requirementRecords,
   requiredInputs:gaps[code],reconciliation:proof.reconciliation,
   workingSellTHB:code==="B6"?proof.reconciliation.historicalRev08TransportSellTHB:working.sellTHB,
   workingSellApproval:code==="B6"?"MANAGEMENT_APPROVED_PRE_AWARD_BUDGETARY_SELL_2026_10_15":null,
   directCostTHB:null,commercialSellTHB:null,
   costPostingAllowed:false,customerReleaseAllowed:false,
   evidenceState:"SOURCE_DRIVERS_TRACED__DIRECT_COST_NOT_VERIFIED",
   noDoubleCountRule:"Do not add WBS SELL to cost; OEM FAT vs Bangkok FAT vs yard witness vs offshore SAT are distinct cost owners."
  });
 });
 if(rows.length!==16||new Set(rows.map(r=>r.code)).size!==16)
  throw Error("Incomplete B/C evidence cost owner coverage");
 return Object.freeze({moduleId:"bid.budget.working.bc",
  rows,byCode:Object.fromEntries(rows.map(r=>[r.code,r])),
  complete:false,releaseAllowed:false,
  verifiedDirectCostTHB:null,workingSellReferenceTHB:wbs.subtotalTHB,
  sourceUrl:SOURCE_URL,executionDecisionId:FAT_EXECUTION_BASIS_0553.id
 });
}
