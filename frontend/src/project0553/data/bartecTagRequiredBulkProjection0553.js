// PJ2608-0553 — READ ONLY MR0001 Bulk Material TAG/row stage-01 evidence.
// Reuse selected BARTEC GA dimensions and existing gland/cable working schedule.
// Drilled holes, initially fitted plugs/locknuts, planned reserves, installed
// active glands and purchase quantities are DIFFERENT engineering quantities.
// No acceptance of historical OEM/SKU price or mutation of working-cost ledger.
import {deriveBartecGlandBulkSchedule0553} from "./bartecGlandBulkSchedule0553";
import {selectBartecEnclosureBasis0553} from "./bartecEnclosureBasis0553";
import {ZWP20_BULK_SCOPE_AUDIT_0553} from "./zwp20BulkScopeAudit0553";

const bartecSource="BARTEC 21G1048t-BA-GA-100X_Z0: GA-1001/1002/1003 BOM, pp.2/5/8";
const mrSource="MR-0001 C1 / MTO Rev04 Bulk Material / Z1F DTS-0001 C1 and SPE-0001 C2";
const pending="CABLE_END_OD_AND_CERTIFIED_GLAND_CONFIGURATION_PENDING";
const row=(id,fn,qty,unit,qtyClass,source,owner,driver,proof,status="DOCUMENTED_PHYSICAL_BASIS_NOT_PURCHASE")=>({
 id:"BARTEC-"+id,functionId:fn,quantityDriver:driver,
 approvedSkuQty:null,derivedWorkingQty:qtyClass==="WORKING_BUDGET_ALLOWANCE"?qty:null,
 documentedQty:qtyClass==="WORKING_BUDGET_ALLOWANCE"?null:qty,
 documentedUnit:unit,qtyClass,quantityEvidence:source,
 qtyState:status,qtyProof:proof,costOwner:owner,
 requirementState:qtyClass==="WORKING_BUDGET_ALLOWANCE"?"BUDGETARY_ONLY_NOT_REQUIRED_QTY":
  qty===null?pending:"BARTEC_GA_USER_SELECTED_WORKING_PHYSICAL_BASIS",
 selectionStatus:"NO_NEW_AUTO_PRICING_OR_PROCUREMENT",candidateCount:0
});
export function deriveBartecTagRequiredBulkProjection0553(site,tag,sourceRow){
 if(!site||!/^bulk material$/i.test(String(tag||"").trim())||
    sourceRow?.equipmentFamily!=="Bulk Materials"||sourceRow.platform!==site||
    sourceRow.sourceRowIndex!==sourceRow?.sourceRowIndex)return null;
 const schedule=deriveBartecGlandBulkSchedule0553();
 const assembly=schedule.allEnclosures.find(x=>x.site===site&&x.system==="SCADA_RADIO");
 const p=selectBartecEnclosureBasis0553("SCADA_EXE_TYPE_1_2_3");
 if(!assembly||!p)return null;
 const factoryOwner="SCADA_TCAB_ASSEMBLY_INCLUDED__NOT_ADDITIVE_ROW11";
 const bulkOwner="MR0001_BULK_MTO_ROW_"+sourceRow.sourceRowIndex+"__PARTIAL_WORKING_COST_ONLY";
 const items=[
  row("M20-ENTRY-TOP","BARTEC_SCADA_M20_DRILLED_ENTRY_TOP",p.entries.top,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY",bartecSource,factoryOwner,
   "12 drilled M20 top holes per selected SCADA Ex e cabinet","Per SCADA enclosure, not active glands"),
  row("M20-ENTRY-LEFT","BARTEC_SCADA_M20_DRILLED_ENTRY_LEFT",p.entries.left,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY",bartecSource,factoryOwner,
   "2 drilled M20 left-side holes","Physical capacity only"),
  row("M20-ENTRY-RIGHT","BARTEC_SCADA_M20_DRILLED_ENTRY_RIGHT",p.entries.right,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY",bartecSource,factoryOwner,
   "2 drilled M20 right-side holes","Physical capacity only"),
  row("M20-ENTRY-TOTAL","BARTEC_SCADA_M20_TOTAL_CABLE_ENTRY_HOLES",p.entryCount,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY",bartecSource,factoryOwner,
   "12 top + 2 left + 2 right; row is TOTAL OF HOLES ABOVE, do not add again","DTS requires 18 minimum; selected BARTEC 16-hole working basis has open deviation","TECHNICAL_DEVIATION_16_VS_18_ENTRIES"),
  row("M20-STOPPING-PLUG","BARTEC_SCADA_M20_FACTORY_STOPPING_PLUGS",p.originalStoppingPlugs,"pcs","GA_FACTORY_INCLUDED_ACCESSORY",bartecSource,factoryOwner,
   "Factory supplied PLG1MON stopping plugs","Initially fitted; used entries replace plugs, remaining plugs must be re-counted"),
  row("M20-LOCKNUT","BARTEC_SCADA_M20_FACTORY_LOCKNUTS",p.originalLocknuts,"pcs","GA_FACTORY_INCLUDED_ACCESSORY",bartecSource,factoryOwner,
   "Factory supplied DL1MON locknuts","As-built BARTEC assembled supply; verify replacement gland/thread requirements"),
  row("M20-DRAIN","BARTEC_SCADA_SEPARATE_M20_DRAIN_VALVE",p.drainValveCount,"set","GA_FACTORY_INCLUDED_ACCESSORY",bartecSource,factoryOwner,
   "One additional bottom drain valve ECDE1MX per enclosure","Dedicated extra drain hole is not available for cable entries"),
  row("M20-SPARE","BARTEC_SCADA_RESERVED_CABLE_ENTRY_CAPACITY",p.spareEntryPlanningQty,"hole","PARAMETRIC_SPARE_CAPACITY_NOT_PURCHASE",mrSource,factoryOwner,
   "Preliminary conservative max(2, ceil(0.20 × 16))","4 reserved holes for planning; not 4 extra purchased glands; verify final SPE interpretation","PARAMETRIC_CAPACITY_ONLY"),
  row("M20-GLAND-WORKING","SCADA_M20_ACTIVE_GLAND_BOOKED_BUDGETARY_ALLOWANCE",1,"set","WORKING_BUDGET_ALLOWANCE","INNOVA QA24-0604 line4 / ZWP20 row11 controlled ledger",bulkOwner,
   "Historical 1 indoor M20 gland cost allocation per site","1 is NOT final active gland quantity; size, cable OD, Ex certificate and Vendor inclusion remain unverified","PARTIAL_WORKING_QTY_ONLY"),
  row("M20-GLAND-REQUIRED","SCADA_M20_ACTIVE_GLANDS_REQUIRED_BY_CABLE_OD",assembly.verifiedActiveGlands,"pcs","ACTIVE_INSTALLED_COUNT_NOT_YET_DERIVED",
   "Z1F WIR/TER + cable OD datasheets + "+bartecSource,bulkOwner,
   "Sum of unique verified cables terminating inside TCAB with compatible M20 Ex glands","Do not set equal to drilled holes or automatically use 1 booked gland",pending),
  row("M20-GLAND-BUY","SCADA_M20_ADDITIONAL_GLANDS_PURCHASE_BY_SIZE",assembly.purchaseGlandsBySize,"pcs","NET_PROCUREMENT_COUNT_NOT_YET_DERIVED",
   "Z1F cable-end register + BARTEC gland sizes + supplier assembly inclusion",bulkOwner,
   "max(0, Required matching M20 Ex gland − vendor supplied matching gland − approved reuse)","Must split by cable OD/sealing range, armour and certified SKU",pending)
 ];
 // Enumerate source-first outstanding requirements using original 16-function
 // audit. No duplicate known-price row or altered actual ledger.
 const remaining=ZWP20_BULK_SCOPE_AUDIT_0553.checks
  .filter(x=>!["PANEL_M20","GLAND_PLUG","ODU_CAT6A"].includes(x.id))
  .map(x=>row("REQ-"+x.id,"SCADA_BULK_"+x.id+"_FUNCTION",x.qty??null,x.unit||"as designed",
   Number.isFinite(x.qty)?"EVIDENCED_WORKING_DRIVER":"UNRESOLVED_FUNCTION",
   "ZWP20 engineering 16-function audit / "+mrSource,x.owner,
   x.basis,"Review active cable/Ex/route/vendor included cost ownership",x.pricing));
 const cable=ZWP20_BULK_SCOPE_AUDIT_0553.checks.find(x=>x.id==="ODU_CAT6A");
 if(cable)items.push(row("CAT6A-WORKING","SCADA_OUTDOOR_CAT6A_PROCUREMENT_ALLOWANCE",cable.qty,"m",
  "WORKING_BUDGET_ALLOWANCE","INNOVA QA24-0604 / approved internal 60m+15%/run",
  bulkOwner,"60m budget route + 15% material allowance = 69m (NOT measured)","No extra cable runs assumed","PARTIAL_WORKING_QTY_ONLY"));
 return {
  projectId:"PJ2608-0553",site,tag,row:sourceRow.sourceRowIndex,modelId:"SCADA_EXE_TYPE_1_2_3",
  recordedMtoQty:sourceRow.sourceQty,recordedMtoUnit:sourceRow.sourceUnit,
  requirements:[...items,...remaining],
  holeCount:p.entryCount,initialFactoryPlugs:p.originalStoppingPlugs,
  recordedActiveGlandAllowance:1,installedGlandRequired:null,netAdditionalGlandPurchase:null,
  source:bartecSource,siteSource:mrSource,
  deviation:"BARTEC 16 entries vs Z1F DTS minimum 18 — client disposition required",
  commercialRule:"Confirmed assembly components are already in BARTEC TCAB enclosure cost owner; 1 M20 gland and 69m CAT6A are working partial Row11 cost, not complete procurement.",
  relatedOtherMr:"MR0003 Ex IP Phone JB: BARTEC GA-1004 has 8 M20 entries and 8 factory stopping plugs, 1 separate drain per JB. This is a separate telephone scope/cost owner, NOT to be booked under MR0001 Row11.",
  released:false,mutatedLedger:false
 };
}
