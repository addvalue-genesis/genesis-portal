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
    sourceRow?.equipmentFamily!=="Bulk Materials"||sourceRow.platform!==site)return null;
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
  row("SCADA-EARTH-TERMINALS","BARTEC_SCADA_FACTORY_EX_EARTH_TERMINALS",10,"pcs","GA_FACTORY_INCLUDED_ACCESSORY",bartecSource,factoryOwner,
   "Common across BARTEC SCADA GA-1001/2/3: 10 Phoenix AKG4 GNYE-EX earth connection terminals per enclosure","Factory panel component, NOT 10 new loose field bulk terminals"),
  row("SCADA-EARTH-BUSBAR","BARTEC_SCADA_FACTORY_EARTH_BUSBAR",1,"pcs","GA_FACTORY_INCLUDED_ACCESSORY",bartecSource,factoryOwner,
   "One Phoenix earth busbar per SCADA assembly (GA BOM line 10)","Already included inside the BARTEC assembly; external earthing kit remains to size"),
  row("SCADA-MOUNT","BARTEC_SCADA_FACTORY_MOUNTING_BRACKET_SET",1,"set","GA_FACTORY_INCLUDED_ACCESSORY",bartecSource,factoryOwner,
   "One mounting bracket set per factory enclosure","Field supports/extra stainless hardware are a separate route/takeoff requirement"),
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


// TCAB is the enclosure assembly's own TAG. Unlike "Bulk Material" Row11,
// these quantities are factory physical contents/capacities, not separately
// purchased cable ends or additional field material costs.
// Limit this historical GA-based comparison to the named ZWP20 source TAG;
// no automatic substitution into ZWP8/Brownfield or other site assemblies.
export function deriveBartecTcabRequiredBom0553(site,tag,sourceRow){
 if(site!=="ZWP20"||tag!=="TCAB-500-001"||
    sourceRow?.platform!==site||sourceRow?.sourceRowIndex!==9||
    sourceRow?.equipmentFamily!=="Enclosure"||
    !sourceRow.sourceCodes?.includes(tag))return null;
 const p=selectBartecEnclosureBasis0553("SCADA_EXE_TYPE_1_2_3");
 if(!p)return null;
 const owner="TCAB-500-001.9 / FACTORY_ASSEMBLY_INCLUDED__NON_ADDITIVE";
 const evidence=bartecSource+"; MR0001 MTO Rev04 ZWP20 Row9";
 const req=[
  row("TCAB-ASSY","SCADA_EX_E_PANEL_ASSEMBLY",sourceRow.sourceSetCount??1,"Set","MTO_SOURCE_SET",
   "MR0001 MTO Rev04 ZWP20 Row9; "+bartecSource,owner,
   "1 required TCAB-500-001 Set; BARTEC working panel family "+p.model+"; SS316L; "+p.sizeMm.join("x")+" mm",
   "Exact Ex certification, final drawing, component fit and vendor supply to confirm",
   "WORKING_ENCLOSURE_FAMILY__OEM_RELEASE_PENDING"),
  row("TCAB-M20-TOP","SCADA_TCAB_M20_TOP_ENTRIES",p.entries.top,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY",evidence,owner,
   "12 pre-drilled M20 holes on top","Included hole capacity, not 12 field cable glands"),
  row("TCAB-M20-LEFT","SCADA_TCAB_M20_LEFT_ENTRIES",p.entries.left,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY",evidence,owner,
   "2 pre-drilled M20 holes on left","Included hole capacity, not an additional purchase"),
  row("TCAB-M20-RIGHT","SCADA_TCAB_M20_RIGHT_ENTRIES",p.entries.right,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY",evidence,owner,
   "2 pre-drilled M20 holes on right","Included hole capacity, not an additional purchase"),
  row("TCAB-M20-TOTAL","SCADA_TCAB_TOTAL_M20_ENTRIES",p.entryCount,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY",evidence,owner,
   "Total 12+2+2; a roll-up ONLY, not additive to directional rows",
   "DTS-0001 C1 requests minimum 18, selected basis has 16; client disposition required",
   "TECHNICAL_DEVIATION_16_VS_18_ENTRIES"),
  row("TCAB-PLUGS","SCADA_TCAB_FACTORY_STOPPING_PLUGS",p.originalStoppingPlugs,"pcs","GA_FACTORY_INCLUDED_ACCESSORY",evidence,owner,
   "Factory supplied PLG1MON plugs","Installed plugs do not equal active cable glands"),
  row("TCAB-LOCKNUTS","SCADA_TCAB_FACTORY_M20_LOCKNUTS",p.originalLocknuts,"pcs","GA_FACTORY_INCLUDED_ACCESSORY",evidence,owner,
   "Factory supplied DL1MON locknuts","Already part of panel factory BOM"),
  row("TCAB-EARTH-TERMINALS","SCADA_TCAB_FACTORY_EX_EARTH_TERMINALS",10,"pcs","GA_FACTORY_INCLUDED_ACCESSORY",evidence,owner,
   "Phoenix AKG4 GNYE-EX terminals per GA","Factory contents, not 10 extra field terminals"),
  row("TCAB-EARTH-BUSBAR","SCADA_TCAB_FACTORY_EARTH_BUSBAR",1,"pcs","GA_FACTORY_INCLUDED_ACCESSORY",evidence,owner,
   "Factory earth busbar from GA","External earthing remains a separate measured interface"),
  row("TCAB-MOUNT","SCADA_TCAB_FACTORY_MOUNTING_BRACKET",1,"set","GA_FACTORY_INCLUDED_ACCESSORY",evidence,owner,
   "GA mounting bracket assembly","Field supporting structures are not automatically included"),
  row("TCAB-DRAIN","SCADA_TCAB_SEPARATE_DRAIN_VALVE",p.drainValveCount,"set","GA_FACTORY_INCLUDED_ACCESSORY",evidence,owner,
   "Factory drain uses separate hole","Cannot be counted among 16 cable entries"),
  row("TCAB-SPARE","SCADA_TCAB_RESERVED_HOLE_CAPACITY",p.spareEntryPlanningQty,"hole","PARAMETRIC_SPARE_CAPACITY_NOT_PURCHASE",mrSource,owner,
   "20% / minimum two holes held as internal planning reserve",
   "Planning allowance; no additional purchased spare glands",
   "PARAMETRIC_CAPACITY_ONLY"),
  row("TCAB-GLAND-ENDS","SCADA_TCAB_ACTIVE_M20_GLANDS_BY_VERIFIED_CABLE_ENDS",null,"pcs",
   "ACTIVE_INSTALLED_COUNT_NOT_YET_DERIVED",mrSource+" / cable OD and WIR/TER",
   "MR0001 BULK ROW11 / OEM_FITTED_GLAND_INCLUSION_TO_VERIFY",
   "Only distinct cable entries verified from termination schedule and cable outside diameter",
   "Do not equate factory holes or plugs with field gland purchase",pending)
 ];
 return {
  site,tag,sourceRow:sourceRow.sourceRowIndex,
  selectedModel:p.model,material:p.material,sizeMm:p.sizeMm.slice(),
  entryCount:p.entryCount,entries:{...p.entries},factoryStoppingPlugs:p.originalStoppingPlugs,
  factoryLocknuts:p.originalLocknuts,drainValveCount:p.drainValveCount,
  reservedCapacity:p.spareEntryPlanningQty,requiredEntriesByDts:18,
  source:evidence,requirements:req,
  deviation:"Z1F DTS-0001 C1 minimum 18 entries versus selected BARTEC 16-hole basis — client technical disposition open",
  includedCostOwner:"TCAB-500-001.9",
  fieldBulkCostOwner:"ZWP20 Bulk Material Row11; no added panel cost",
  priceBasis:"PROSPER Q-PROSRY-24051 Item1 historical Zawtika 1E THB39,200 per assembly; not verified Phase 1F quote",
  approvalState:"ENGINEERING_ASSEMBLY_LAYOUT_AND_DTS_ENTRY_DEVIATION_OPEN",
  customerSellChanged:false,mutatedCostLedger:false
 };
}
