// PJ2608-0553 — canonical 10.2 WORK / COST DRIVER LEDGER (B1,B2,B3,B6,B9,B10,B11).
// Each clause is linked to one unique work object; quantity and known working
// SELL rates from Rev05 are not an internal Direct COST or new customer price.
// Historical B1 proxy costs remain audit-only. Never zero-fill an unknown rate.
// This module is a 10.2 read model, not a second vendor-price system.
import {selectBcExecutionComplianceAudit0553} from "./bcExecutionComplianceAudit0553";
import {derivePartBcWorkingWbs0553,PART_BC_WBS_SOURCE_0553} from "./partBCWorkingWbs0553";
import {FAT_EXECUTION_BASIS_0553} from "./fatExecutionBasis0553";
import {selectBcB1B2EquationExecution0553} from "./bcB1B2EquationExecution0553";
import {selectBcB3EquationExecution0553} from "./bcB3EquationExecution0553";
import {selectBcB5EquationExecution0553} from "./bcB5EquationExecution0553";

const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const primaryCodes=Object.freeze(["B1","B2","B3","B5","B6","B9","B10","B11"]);
const ownerCodes=Object.freeze(["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14","C1","C2"]);
const sourceUrl=PART_BC_WBS_SOURCE_0553.url;
// 08_B1_ENGINEERING: [Scope, task, role MH: Lead/Senior/Engineer/Drafter/DC,
// historical rate-card proxy]. Source controls 964 MH and THB180,892.75;
// the historical proxy MUST NOT become today's staff cost or quote.
const B1_WBS_ACTIVITIES=Object.freeze([
 ["COMMON","Project kickoff / design-basis review",8,16,16,0,0,8933],
 ["COMMON","Cross-system interface register / BLD review",8,24,24,8,0,12966],
 ["COMMON","Vendor technical coordination / TBE support",4,16,24,0,0,8666.5],
 ["COMMON","IFC / final engineering closeout",4,12,16,8,0,7499.5],
 ["MR1","Requirement / DTS / BOD review",4,12,16,0,0,6566.5],
 ["MR1","Link budget / RF / network design",0,24,32,0,0,10400],
 ["MR1","Brownfield interface ZPQ/ZWP08/ZWP11",4,20,24,8,0,10599.5],
 ["MR1","GA / schematic / wiring / installation review",0,12,24,24,0,9099],
 ["MR1","NMS / L3 / IP integration technical content",0,16,24,0,0,7300],
 ["MR1","Internal check / revision",4,8,8,0,0,4466.5],
 ["MR2","Requirement / BOD / DTS review",4,10,14,0,0,5791.5],
 ["MR2","Radio coverage / link budget",0,20,28,0,0,8850],
 ["MR2","ZPQ DMR integration",4,16,20,0,0,8116.5],
 ["MR2","GA / schematic / wiring / installation review",0,10,18,20,0,7307.5],
 ["MR2","Talk-group / configuration technical content",0,12,20,0,0,5750],
 ["MR2","Internal check / revision",4,8,8,0,0,4466.5],
 ["MR3","Requirement / Ex compliance review",4,12,16,0,0,6566.5],
 ["MR3","Telephone / PABX interface",0,10,14,0,0,4425],
 ["MR3","Ex cable / gland / JB engineering",2,14,18,6,0,7358],
 ["MR3","GA / wiring / termination / installation review",0,8,16,20,0,6532.5],
 ["MR3","Test technical content",0,8,16,0,0,4200],
 ["MR3","Internal check / revision",4,6,6,0,0,3691.5],
 ["MR4","Requirement / marine-nav review",4,8,12,0,0,5016.5],
 ["MR4","Power / interface / hazardous review",0,8,16,0,0,4200],
 ["MR4","GA / wiring / installation detail review",0,6,12,14,0,4782.75],
 ["MR4","Test technical content",0,8,12,0,0,3650],
 ["MR4","Internal check / revision",4,6,6,0,0,3691.5]
]);
const B1_ROLE_NAMES=["Lead","Senior","Engineer","Drafter","Document Control"];

// One cost owner per physical resource. More than one source clause may cite a
// work line; never sum clauses themselves as independent priced resources.
const line=(code,id,name,quantity,unit,opts={})=>{
 const q=Number.isFinite(quantity)&&quantity>=0?quantity:null;
 const sellRate=Number.isFinite(opts.sellRateTHB)&&opts.sellRateTHB>=0?opts.sellRateTHB:null;
 const sell=Number.isFinite(opts.sellTHB)&&opts.sellTHB>=0?round(opts.sellTHB):null;
 return Object.freeze({
  id,code,moduleId:"bid.budget.working.bc."+code.toLowerCase()+".cost-line."+id.toLowerCase(),
  name,quantity:q,unit,requiredQuantityStatus:opts.quantityStatus||"WBS_WORKING_DRIVER_NOT_APPROVED",
  workingSellRateTHB:sellRate,workingSellTHB:sell,
  rateType:sell!==null||sellRate!==null?"WORKING_SELL_REFERENCE_NOT_INTERNAL_COST":"RATE_NOT_ESTABLISHED",
  historicalCostProxyTHB:Number.isFinite(opts.historicalCostProxyTHB)?opts.historicalCostProxyTHB:null,
  internalDirectCostRateTHB:null,directCostTHB:null,
  sourceRef:opts.sourceRef||PART_BC_WBS_SOURCE_0553.revision,
  quoteOrApprovalRef:null,
  equation:opts.equation||"Q_required × verified unit rate (rate pending)",
  owner:opts.owner||"ADDVALUE / nominated vendor per approved responsibility",
  includedInExistingCostOwner:opts.includedInExistingCostOwner||null,
  scopeGate:opts.scopeGate||"RATE_AND_APPROVAL_REQUIRED",
  reconciliationTag:opts.reconciliationTag||code+"-SOURCE",
  postToPricing:false,customerReleaseAllowed:false
 });
};

const B2_ROWS=[["MR0001","SCADA Radio",37],["MR0002","DMR Trunk Radio",36],["MR0003","Ex Telephone & Sounder",35],["MR0004","Marine RACON",35]];
const otherRows=(audit)=>{
 const out=[];
 const b3source="WBS Rev05 18_TH_FAT_WBS / 23_SAT_TRIP_VALIDATION";
 out.push(line("B3","B3-FAT-BKK","SAMTEL Bangkok cross-MR Integrated FAT / 2-person team",8,"team-days",{sourceRef:"WBS Rev05 18_TH_FAT_WBS; "+FAT_EXECUTION_BASIS_0553.id,
  sellRateTHB:18000,sellTHB:144000,equation:"8 team-days × (THB12,000 Senior/day + THB6,000 Engineer/day)",
  scopeGate:"OEM_FACTORY_TEST_SEPARATE__SAMTEL_BKK_ITP_AND_8_DAYS_PENDING",reconciliationTag:"B3-FAT-SELL"}));
 for(const trip of audit.offshore.trips)out.push(line("B3","B3-"+trip.id,
  "Offshore SAT / Commissioning "+trip.location,trip.workingPersonDays,"MD",{
   sellRateTHB:25200,sellTHB:trip.workingPersonDays*25200,
   sourceRef:b3source,equation:trip.teamDays+" team-days × 2 people × USD800/MD × working FX31.5",
   scopeGate:"HUC_SIMOPS_SAT_COM_SPLIT_POB_PENDING",reconciliationTag:"B3-OFFSHORE-SELL"}));
 out.push(line("B3","B3-MOB-IN-39","MOB/DEMOB already included in five Offshore trips",10,"team-days",{
  sourceRef:"Rev05 23_SAT_TRIP_VALIDATION §C (5 × 1 MOB + 5 × 1 DEMOB)",
  equation:"5 trips × (1 MOB + 1 DEMOB); INCLUDED within 39 Team-days, not additive",
  includedInExistingCostOwner:"B3-TRIP-01..05",scopeGate:"NON_ADDITIVE_INCLUDED_DRIVER",
  reconciliationTag:"INCLUDED_IN_B3_OFFSHORE_PRICE"}));
 out.push(line("B3","B3-PHYSICAL-SAT","SAT/Commissioning combined technical work already included",26,"team-days",{
  sourceRef:"Rev05 23_SAT_TRIP_VALIDATION §C",equation:"5+5+5+3+8 = 26 within 39",
  includedInExistingCostOwner:"B3-TRIP-01..05",scopeGate:"NON_ADDITIVE_INCLUDED_DRIVER"}));
 out.push(line("B3","B3-FINAL-INTEGRATION","Final integration/handover already included",2,"team-days",{
  sourceRef:"Rev05 23_SAT_TRIP_VALIDATION §C",includedInExistingCostOwner:"B3-TRIP-05",
  equation:"2 within 39 team-days; not additive",scopeGate:"NON_ADDITIVE_INCLUDED_DRIVER"}));
 out.push(line("B3","B3-BF-TRANSFER","Two Brownfield moves already included",1,"team-days",{
  sourceRef:"Rev05 23_SAT_TRIP_VALIDATION §C",
  equation:"2 moves × 0.5 team-day = 1 within 39",
  includedInExistingCostOwner:"B3-TRIP-05",scopeGate:"NON_ADDITIVE_INCLUDED_DRIVER"}));
 out.push(line("B3","B3-SPECIALIST-OEM","Additional OEM/test agency specialist support",null,"man-days",{
  owner:"OEM/SAMTEL or ADDVALUE if contracted",sourceRef:"SPE-C2 §7.3; WBS Rev05 10_B3_CAMPAIGN_PRICE",
  scopeGate:"SUPPLIER_FAT_INCLUDED_VS_ON_SITE_SPECIALIST_QUOTE_PENDING"}));
 out.push(line("B3","B3-MOB-TRAVEL","Physical round-trip travel costs outside billable offshore working time",null,"round-trips",{
  sourceRef:"Myanmar Logistics R03 §6.8; WBS Rev05 23_SAT_TRIP_VALIDATION",
  scopeGate:"POB_MOB_TRAVEL_PAYMENT_OWNER_PENDING"}));
 out.push(line("B6","B6-LICENSE-MYANMAR","Myanmar telecom type/import/operate/radio/frequency approvals",null,"authority applications",{
  owner:"Authorized Vendor/Importer/SAMTEL/COMPANY",sourceRef:"SPE-C2 §6.1.1; Myanmar Logistics R03 §6.1.5",
  scopeGate:"REPRESENTATION_AUTHORITY_LEADTIME_FEE_PENDING"}));
 out.push(line("B6","B6-THAI-EXPORT","Thailand telecommunications export authorization",null,"shipments",{
  owner:"Authorized exporter/manufacturer",sourceRef:"Myanmar Logistics R03 Thailand appendix §6.5",
  scopeGate:"EXPORTER_AUTHORIZATION_APPLICABILITY_RATE_PENDING"}));
 out.push(line("B6","B6-CHINA-BROKER","China importer/customs/bonded processing and delivery to JUTAL yard",null,"shipments",{
  owner:"SAMTEL/JUTAL nominated importer and broker",sourceRef:"ANNEX4 Part V; FAT Execution Decision",
  scopeGate:"IMPORTER_OF_RECORD_BROKER_TAX_AND_NAMED_YARD_UNCONFIRMED"}));
 out.push(line("B6","B6-REPACK","Repacking/reinspection after SAMTEL Integrated FAT",null,"packages",{
  owner:"SAMTEL / nominated packing vendor",sourceRef:"ANNEX4 Part I; ANNEX4-2 Master/Single Packing List",
  includedInExistingCostOwner:"B5-BKK-REPACK (physical packing only; B6 freight/customs separate)",
  scopeGate:"B5_PHYSICAL_REPACK_COST_OWNER__B6_FREIGHT_HANDLING_SEPARATE"}));
 for(const mr of FAT_EXECUTION_BASIS_0553.mrPaths)out.push(line("B6","B6-"+mr.mr,
  mr.mr+" — "+mr.routing,null,"transport legs",{
   owner:"Contractually approved Freight/Importer of Record",
   sourceRef:mr.source+"; "+mr.logistics,
   scopeGate:mr.mr==="MR-0002"?"CHINA_TO_TH_BKK_TO_CHINA_REIMPORT_DOUBLE_LEG_RATE_REQUIRED":"INCOTERM_ALL_LEGS_BROKER_RATE_REQUIRED"}));
 out.push(line("B9","B9-CHINA-SUPERVISION","ADDVALUE 2-person China JUTAL yard supervision",12,"team-days",{
  sourceRef:"Rev05 19_CN_YARD_WBS / 11_B8_B9; "+FAT_EXECUTION_BASIS_0553.id,
  sellRateTHB:47880,sellTHB:574560,equation:"12 Team-days × THB47,880/team-day (2 staff inclusive working per diem); source WBS base sell THB574,560",
  owner:"ADDVALUE supervision only; JUTAL installation labor excluded",
  scopeGate:"YARD_SCHEDULE_ROLE_RATE_PER_DIEM_INCLUDED_TRAVEL_NOT_INCLUDED",reconciliationTag:"B9-SELL"}));
 out.push(line("B9","B9-CHINA-RESOURCE-MD","Two-person field staffing effort already included in 12 team-day working SELL",24,"MD",{
  sourceRef:"Rev05 19_CN_YARD_WBS / 11_B8_B9",
  equation:"12 team-days × 2 persons = 24 MD (INCLUDED in B9-CHINA-SUPERVISION)",
  includedInExistingCostOwner:"B9-CHINA-SUPERVISION",
  scopeGate:"NON_ADDITIVE_RESOURCE_DRIVER"}));
 out.push(line("B9","B9-CHINA-TRAVEL","China yard team airfare/hotel/local transport",null,"trip/person",{
  sourceRef:"WBS Rev05 11_B8_B9; actual/reimbursable",
  scopeGate:"WHO_PAYS_TRAVEL_CHINA_WBS_SELL_EXCLUSION_UNCONFIRMED"}));
 for(const mr of ["MR0001","MR0002","MR0003","MR0004"])out.push(line("B10","B10-"+mr+"-SPIR",
  mr+" startup/commissioning spares: physical supply required",null,"OEM part lines",{
  owner:"Selected OEM / SAMTEL supplier",sourceRef:"MR-"+mr.slice(-4)+" Rev.C1 first review comments / SPIR",
  scopeGate:"OEM_PARTNO_QTY_UNIT_COST_PHYSICAL_DELIVERY_AND_A_PACKAGE_CREDIT_PENDING"}));
 for(const tool of audit.specialTools)out.push(line("B11",tool.id,tool.description,tool.quantity,tool.unit,{
  sourceRef:"MMC25-5001 EXA-A8 Att-2 §5 Telecom / Note-1",
  owner:"OEM / SAMTEL delivered operational tools",
  equation:"Applicability × unique supplied tool qty × source OEM unit cost net included package",
  quantityStatus:"ANNEX_MINIMUM_APPLICABILITY_NOT_CONFIRMED",
  scopeGate:tool.state}));
 return out;
};

export function selectBcWorkCostLines0553(){
 const audit=selectBcExecutionComplianceAudit0553();
 const wbs=derivePartBcWorkingWbs0553();
 const b1=B1_WBS_ACTIVITIES.map(([group,name,lead,sr,eng,draft,dc,hist],i)=>{
  const roles=[lead,sr,eng,draft,dc];
  const totalMH=roles.reduce((a,b)=>a+b,0);
  const item=line("B1","B1-WBS-"+String(i+1).padStart(2,"0"),name,totalMH,"MH",{
   sourceRef:"WBS Rev05 08_B1_ENGINEERING / "+group,
   historicalCostProxyTHB:hist,scopeGate:"ROLE_RATE_CURRENT_COST_AND_MR_DELTA_VERIFICATION_REQUIRED",
   equation:"Σ Lead/Senior/Engineer/Drafter/DC role-MH × verified role SELL or cost rate (rate class controlled)",
   reconciliationTag:"B1-964-MH"});
  return Object.freeze({...item,group,roleMH:Object.fromEntries(B1_ROLE_NAMES.map((r,j)=>[r,roles[j]]))});
 });
 const b2=B2_ROWS.map(([mr,system,qty],i)=>line("B2","B2-"+mr+"-VDRL",system+" VDRL/VDRS lifecycle",qty,"source rows",{
  sourceRef:"WBS Rev05 09_B2_DOCUMENTATION / "+mr,
  equation:"Unique document object × review/issue cycle × controlled DC/reviewer MH × role rate",
  scopeGate:"UNIQUE_38_TITLES_143_ROWS__LIFECYCLE_AND_RATE_PENDING",
  reconciliationTag:"B2-VDRL-143"}));
 b2.push(line("B2","B2-UNIQUE-TITLES","Unique document-title types across all 4 MRs (NOT additive count)",38,"types",{
  includedInExistingCostOwner:"B2-MR0001..MR0004-VDRL",
  sourceRef:"WBS Rev05 09_B2_DOCUMENTATION §PROJECT TOTAL",
  scopeGate:"NON_ADDITIVE_DEDUPLICATION_DRIVER"}));
 b2.push(line("B2","B2-PACKING-DOSSIER","ANNEX4-2 packing documentation and release records",null,"delivery dossiers",{
  sourceRef:"ANNEX4-2 MASTER/SINGLE PACKING LIST; ANNEX4 Part II",
  scopeGate:"SHIPMENT_COUNT_DOC_HOURS_AND_B5_OWNER_PENDING"}));
 const equationProof=selectBcB1B2EquationExecution0553(b1);
 const b3EquationProof=selectBcB3EquationExecution0553();
 const b5EquationProof=selectBcB5EquationExecution0553();
 const b5=b5EquationProof.physicalPackingDrivers.map(x=>line("B5",x.sourceId,x.name,null,"unique physical package",{
  sourceRef:"ANNEX4 Part I / PTTEP STD006 / Annex4-2 / 4 MR Source; "+x.sourceId,
  owner:"OEM included Part A OR separately documented B5 incremental physical packing",
  equation:"GEQ-001/004/005/012/018: unique package Qty × verified type/labor rate net confirmed OEM included credits",
  scopeGate:x.qtyStatus,
  includedInExistingCostOwner:["B5-EXPORT-MARKING","B5-PROTECT-ELECTRONICS","B5-ISPM15-WOOD","B5-SPARES-SEPARATE"].includes(x.sourceId)?
   "B5-BKK-REPACK / B5-OEM-ORIGIN (physical pack components; add incremental charges only with net exclusion proof)":null,
  reconciliationTag:"B5-PHYSICAL_PACK_QTY_RATE_NOT_ESTABLISHED"
 }));
 // Audit clause lines are trace/quantity obligations, NOT another charge for
 // B1 role MH, B3 site days, B6 shipment or B10 spare purchased objects.
 const auditedClauses=audit.requirements.map(r=>line(r.code,"COST-"+r.id,
  r.title,null,"audit requirement",{
   sourceRef:r.source+" §"+r.section+" / "+r.id,
   quantityStatus:"DERIVE_FROM_UNIQUE_PHYSICAL_OR_SERVICE_WORK_OBJECT",
   owner:r.owner,
   scopeGate:r.state,
   includedInExistingCostOwner:"COST_REQUIREMENT_TRACE_NOT_ADDITIVE_TO_PRICED_WORK",
   equation:r.costDriver,
   reconciliationTag:"AUDIT-TRACE-"+r.code
  }));
 const all=[...b1,...b2,...b5,...otherRows(audit),...auditedClauses];
 const ids=new Set(all.map(x=>x.id));
 if(ids.size!==all.length)throw Error("Duplicate 10.2 cost-line owner IDs");
 if(b1.reduce((sum,r)=>sum+r.quantity,0)!==964)throw Error("B1 detailed MH sum !=964");
 if(round(b1.reduce((sum,r)=>sum+r.historicalCostProxyTHB,0))!==180892.75)
  throw Error("B1 historical cost-proxy reconciliation failed");
 if(b2.filter(x=>x.reconciliationTag==="B2-VDRL-143").reduce((sum,x)=>sum+x.quantity,0)!==143)
  throw Error("B2 four-MR VDRL rows !=143");
 const pricedB3=all.filter(x=>x.code==="B3"&&Number.isFinite(x.workingSellTHB));
 if(round(pricedB3.reduce((sum,x)=>sum+x.workingSellTHB,0))!==2109600)
  throw Error("B3 working SELL cost-line source owners must exactly reconcile");
 if(all.find(x=>x.id==="B9-CHINA-SUPERVISION")?.workingSellTHB!==574560)
  throw Error("B9 12 day/2 staff working SELL changed");
 if(all.filter(x=>x.code==="B6"&&x.id.startsWith("B6-MR-")).length!==4)
  throw Error("Missing B6 four-MR cargo route");
 const namedOwners=new Map(all.map(x=>[x.id,x]));
 const mappedClauses=audit.requirements.map(item=>{
  const clause=all.find(x=>x.id==="COST-"+item.id);
  return Object.freeze({
   auditId:item.id,moduleId:"bid.budget.working.bc."+item.code.toLowerCase(),
   costLineId:clause?.id||null,code:item.code,
   type:"REQUIREMENT_EVIDENCE_LINK_NOT_INDEPENDENT_ADDITIVE_COST",
   source:item.source,section:item.section,owner:item.owner,requirement:item.title,
   quantityStatus:clause?.requiredQuantityStatus||"NOT_ESTABLISHED",
   costStatus:"NOT_ESTABLISHED",directCostTHB:null
  });
 });
 const byCode=Object.fromEntries(ownerCodes.map(code=>[code,all.filter(x=>x.code===code)]));
 const wbsByCode=Object.fromEntries(wbs.rows.map(x=>[x.code,x]));
 const workingSellByCode=Object.fromEntries(ownerCodes.map(code=>[code,wbsByCode[code]?.sellTHB??null]));
 for(const code of ownerCodes){
  if(Number.isFinite(workingSellByCode[code])){
   const covered=byCode[code].filter(x=>Number.isFinite(x.workingSellTHB));
   if(covered.length&&round(covered.reduce((sum,x)=>sum+x.workingSellTHB,0))!==workingSellByCode[code])
    throw Error("10.2 cost lines erroneously priced "+code+" by source fragments");
  }
 }
 if(mappedClauses.length!==audit.requirements.length)throw Error("Not all source requirements mapped");
 if(mappedClauses.some(x=>!x.costLineId||!namedOwners.has(x.costLineId)))throw Error("Missing cost-line linkage");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.cost-lines",
  name:"10.2 — B/C Traceable Cost Lines / First Principles / WBS / Rates",
  sourceModuleId:"bid.budget.working.bc.execution-audit",
  sourceUrl,sourceRevision:PART_BC_WBS_SOURCE_0553.revision,
  activeCodes:ownerCodes,primaryDetailedCodes:primaryCodes,rows:all,byCode,requirementLinks:mappedClauses,
  requiredAuditCount:mappedClauses.length,
  equationProofModuleId:equationProof.moduleId,equationProof,
  b3EquationProofModuleId:b3EquationProof.moduleId,b3EquationProof,
  b5EquationProofModuleId:b5EquationProof.moduleId,b5EquationProof,
  workingSellByCode,
  totalCostTHB:null,totalSellingPriceTHB:null,
  currentDirectCostComplete:false,releaseAllowed:false,
  policy:"Line quantity is not approved purchase Qty unless verified. Current direct cost rates and external charges unresolved. Working SELL is not a cost."
 });
}
