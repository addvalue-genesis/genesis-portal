// PJ2608-0553 / MR0001 & MR0003 — BARTEC gland sizing and counting in A5 BULK.
// Controlled stage 03→07 physical interface projection. Nothing here posts prices.
// M20 = enclosure THREAD, not verified cable OD / gland sealing range or procurement qty.
import {selectBartecEnclosureBasis0553} from "./bartecEnclosureBasis0553";

const SCADA_SITES=["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"];
const PHONE_SITES=["ZWP20","ZWP21","ZWP22","ZWP23"];

const EVIDENCE=Object.freeze({
 scadaMR:"MM-ZTK-1F-GEN-TEL-MR-0001 Rev.C1 / MTO Rev04",
 phoneMR:"MM-ZTK-1F-GEN-TEL-MR-0003 Rev.C1 / MTO Rev04",
 bartec:"21G1048t-BA-GA-100X_Z0.pdf (GA-1001/1002/1003 and GA-1004, 2022 as-built)",
 cable:"MM-ZTK-1F-GEN-TEL-SPE-0001 Rev.C2 §6.6.2/6.6.3/6.6.4/6.6.5",
 supplier:"Selected EXION QT_1260576 + PROSPER Q-PROSRY-24051 item4 historical; MGW PHONE-1 excluded"
});
const cableCandidate=(id,description,from,to,cableType,designSource,ownership)=>Object.freeze({
 id,description,from,to,cableType,designSource,ownership,
 numberOfPhysicalCableEnds:null, // resolve from WIR/termination schedule, NOT 1 per diagram line
 cableOuterDiameterMm:null,
 cableODSource:null,
 armouring:"REQUIRE_CABLE_DATASHEET_CONFIRMATION",
 entryThread:"M20",
 glandExProtection:"EX_EB__ASSEMBLY_COMPATIBILITY_REVIEW",
 glandManufacturer:null,glandPartNumber:null,
 sealingRangeMinMm:null,sealingRangeMaxMm:null,
 activeGlandQty:null,verifiedVendorIncludedGlandQty:null,
 purchaseGlandQty:null,unitCost:null,currency:null,
 state:"CABLE_END_OD_AND_GLAND_MATCH_NOT_YET_VERIFIED"
});
const SCADA_CABLES=Object.freeze([
 cableCandidate("SCADA-ETHERNET","Outdoor armoured CAT6A Ethernet to SCADA panel","MR-502 ODU / outdoor","TCAB-500 / E&I","CAT6A outdoor steel braid armoured / LSZH",EVIDENCE.scadaMR+"; SPE §6.6.2","MR0001 BULK row / fitted gland source compare"),
 cableCandidate("SCADA-DC","SCADA enclosure external DC feeder","DCDB 24VDC","TCAB-500 / E&I","DC power multicore — selected cable spec pending","ZWP20 Schematic and electrical SLD; SPE §6.6.4","PANEL_POWER_INTERFACE_OR_BY_OTHERS"),
 cableCandidate("SCADA-DATA","SCADA panel uplink/field data interface(s)","E&I / PLC / telecom","TCAB-500 / E&I","Ethernet/fibre/control — verify actual interface topology",EVIDENCE.scadaMR+"; BLD/WIR/TER","PANEL/DATO_ASSEMBLY_OR_FIELD_BULK")
]);
const PHONE_CABLES=Object.freeze([
 cableCandidate("PHONE-DEVICE","Ex IP Phone / handset circuit to Telephone JB","TPH-504-001","TCAB-504-001","Voice/data/power — confirm approved Ex IP Phone cable","MR0003; DTS/BLD/WIR/TER; selected telephone vendor","PHONE_JB_OR_VENDOR_PHONE_PACKAGE"),
 cableCandidate("PHONE-SOUNDER","Ex Sounder / Strobe circuit to Telephone JB","LSE-504-001","TCAB-504-001","Sounder control/power — cable type per DTS","MR0003; ZWP20 schematic; WIR/TER; selected sounder vendor","PHONE_JB_OR_VENDOR_SOUNDER_PACKAGE"),
 cableCandidate("PHONE-UPLINK","Telephone JB external uplink to PABX/gateway/TC room","TCAB-504-001","E&I / telecom SIP-PABX interface","Voice/data/control — actual topology pending","MR0003; SPE §6.2; BLD/WIR/TER","PHONE_FIELD_BULK_OR_BY_OTHERS")
]);
const wpSort=(a,b)=>SCADA_SITES.indexOf(a)-SCADA_SITES.indexOf(b);
export const BARTEC_GLAND_BULK_POLICY_0553=Object.freeze({
 projectId:"PJ2608-0553",
 moduleId:"bid.budget.bulk.bartec-gland-size-quantity",
 status:"INTERNAL_ENGINEERING_TAKEOFF__NOT_RELEASED",
 sources:EVIDENCE,
 scopePolicy:"Bartec pre-drilled M20 hole patterns confirmed 2026-10-13; no alterations without OEM/client approval.",
 counting:"One certified active gland per verified cable end entering a particular BARTEC enclosure, subject to OEM fitting, multi-cable sealing specification and junction topology; do NOT infer from hole count or line drawing alone.",
 fittingSelection:"M20 entry thread + selected cable OD (mm) + armouring/inner sheath + Ex e/eb rating + seal/clamp range + IP66 + approved certificate/assembly; type/size cannot be selected from thread alone.",
 exclusion:"Drain entry and factory stopping plugs do not become additional active cable glands. Vendor-supplied gland shall be deducted only after exact inclusion is proven.",
 sparePolicy:"Keep 20%/min 2 entries as conservative capacity planning per previous approved internal model; validate final SPE interpretation by engineering.",
 prices:"No provisional gland retail price is applied without a selected model compatible with cable OD and hazardous-area classification.",
 freeze:"No change to original A1/A5 booked 69m CAT6A and 1 M20 gland allowance per site; historical SCADA one-M20-price/site is an incomplete partial allowance, NOT final requirement.",
 deviation:"SCADA 16 pre-drilled holes vs Z1F DTS-0001 C1 minimum 18: formal client disposition required; not approved compliance."
});
export function deriveBartecGlandBulkSchedule0553(){
 const siteRows=SCADA_SITES.slice().sort(wpSort).map(site=>{
  const scada=selectBartecEnclosureBasis0553("SCADA_EXE_TYPE_1_2_3");
  const phone=selectBartecEnclosureBasis0553("PHONE_EXE_JB");
  const rows=[{
   id:site+"-SCADA",site,mr:"MR-0001",system:"SCADA_RADIO",
   enclosureTag:"TCAB-500 series (exact TAG per site MTO)",
   enclosureQtyBasis:"ONE_SET_PER_SCADA_LOCATION__CURRENT_MR_MTO_VERIFY",
   modelId:scada.id,model:scada.model,entryThread:"M20",holeCapacity:scada.entryCount,
   initialStoppingPlugs:scada.originalStoppingPlugs,
   spareEntryPlanningQty:scada.spareEntryPlanningQty,
   plannedMaximumActive:scada.maxActiveEntryPlanningQty,
   drainSeparate:scada.drainEntryCount,
   interfaceRows:SCADA_CABLES,
   verifiedUsedEntries:null,verifiedActiveGlands:null,verifiedSparePlugs:null,
   requiredGlandsBySize:null,purchaseGlandsBySize:null,
   includedPackageSource:"BARTEC factory plugs; confirm final fitted active glands per actual vendor assembly",
   source:EVIDENCE.scadaMR+" + "+EVIDENCE.bartec,
   status:"16_M20_HOLES_CONFIRMED__CABLE_SIZES_AND_ACTIVE_QTY_PENDING__DTS_18_CONFLICT"
  }];
  if(PHONE_SITES.includes(site))rows.push({
   id:site+"-PHONE-JB",site,mr:"MR-0003",system:"EX_IP_PHONE",
   enclosureTag:"TCAB-504-001",enclosureQtyBasis:"ONE_TELEPHONE_SYSTEM_PER_WP__JB_SINGULAR_MR_SCOPE",
   modelId:phone.id,model:phone.model,entryThread:"M20",holeCapacity:phone.entryCount,
   initialStoppingPlugs:phone.originalStoppingPlugs,
   spareEntryPlanningQty:phone.spareEntryPlanningQty,
   plannedMaximumActive:phone.maxActiveEntryPlanningQty,
   drainSeparate:phone.drainEntryCount,
   interfaceRows:PHONE_CABLES,
   verifiedUsedEntries:null,verifiedActiveGlands:null,verifiedSparePlugs:null,
   requiredGlandsBySize:null,purchaseGlandsBySize:null,
   includedPackageSource:"Selected PROSPER historical item4 07-56D2-0411 has 3 M20 bottom entries + 3 factory stopping plugs and separate drain; fitted active Ex glands NOT quoted as separate equipment. GA-1004 eight top-hole drawing is a distinct conflicting arrangement. EXION phone/sounder separate; MGW excluded.",
   source:EVIDENCE.phoneMR+" + "+EVIDENCE.bartec+" + "+EVIDENCE.supplier,
   status:"BUDGETARY_3_ENDS__PROSPER_ITEM4_3_BOTTOM_M20_VS_GA_8_TOP_M20_CONFLICT__GLAND_SKU_PENDING"
  });
  return {site,enclosures:rows};
 });
 const all=siteRows.flatMap(w=>w.enclosures);
 return {
  projectId:"PJ2608-0553",moduleId:BARTEC_GLAND_BULK_POLICY_0553.moduleId,
  sites:siteRows,allEnclosures:all,
  rollup:{
   scadaEnclosuresByMr:SCADA_SITES.length,phoneJbSystemsByMr:PHONE_SITES.length,
   knownEntryCapacityForScope:all.reduce((n,x)=>n+x.holeCapacity,0),
   knownFactoryPlugsForScope:all.reduce((n,x)=>n+x.initialStoppingPlugs,0),
   plannedReservedEntryCapacity:all.reduce((n,x)=>n+x.spareEntryPlanningQty,0),
   verifiedActiveGlandQty:null,verifiedPurchaseGlandQty:null,
   actualGlandSizeBreakdown:null,
   note:"Hole and plug capacity assume one selected physical SCADA enclosure per MR0001 site and one Ex telephone JB per MR0003 site; these are NOT final gland procurement totals."
  },
  policy:BARTEC_GLAND_BULK_POLICY_0553,pricePosted:false,customerApproved:false
 };
}
/** Feed subsequently verified cable-end entries. Reject malformed size/count evidence. */
export function reconcileBartecVerifiedCableEnds0553({site,enclosureId,ends=[],vendorIncludedQty=null}={}){
 const model=deriveBartecGlandBulkSchedule0553().allEnclosures.find(x=>x.site===site&&x.id===enclosureId);
 if(!model)return {status:"UNKNOWN_SITE_ENCLOSURE",required:null,purchase:null,bySize:[]};
 if(!Array.isArray(ends)||ends.length===0)return {status:"NO_VERIFIED_CABLE_ENDS",required:null,purchase:null,bySize:[],capacity:model.holeCapacity};
 const ids=new Set(),bySku=new Map();
 for(const e of ends){
  if(!e||!e.cableId||!e.evidenceSource||!e.verifiedCableEnd||ids.has(e.cableId))return {status:"MISSING_OR_DUPLICATE_VERIFIED_CABLE_END",required:null,purchase:null,bySize:[]};
  ids.add(e.cableId);
  if(e.entryThread!=="M20"||!Number.isFinite(e.cableODmm)||e.cableODmm<=0||!e.glandSku||
     !e.glandCertificate||!e.glandExVerified||!e.glandArmourMatchVerified||
     !Number.isFinite(e.sealMinMm)||!Number.isFinite(e.sealMaxMm)||
     e.sealMinMm>e.cableODmm||e.sealMaxMm<e.cableODmm){
    return {status:"CABLE_OD_SEAL_RANGE_THREAD_ARMOUR_OR_EX_CERT_NOT_VERIFIED",required:null,purchase:null,bySize:[]};
  }
  const key=e.glandSku+"|"+e.entryThread+"|"+e.sealMinMm+"-"+e.sealMaxMm;
  const current=bySku.get(key)||{sku:e.glandSku,thread:e.entryThread,sealRangeMm:[e.sealMinMm,e.sealMaxMm],requiredQty:0};
  current.requiredQty++;
  bySku.set(key,current);
 }
 if(ends.length>model.plannedMaximumActive)return {status:"ENTRY_CAPACITY_SPARE_RULE_EXCEEDED",required:null,purchase:null,bySize:[...bySku.values()],capacity:model.plannedMaximumActive};
 const required=ends.length;
 // If seller supplied an unspecified qty of glands, never treat it as zero/known.
 const verifiedIncluded=Number.isInteger(vendorIncludedQty)&&vendorIncludedQty>=0&&vendorIncludedQty<=required;
 const purchase=verifiedIncluded?required-vendorIncludedQty:null;
 return {status:verifiedIncluded?"VERIFIED_SIZE_COUNTS_WITH_PACKAGE_DEDUCTION":"VERIFIED_SIZE_COUNTS__VENDOR_INCLUDED_QTY_UNKNOWN",
  required,purchase,bySize:[...bySku.values()],remainingFactoryPlugs:model.holeCapacity-required,
  capacity:model.holeCapacity,spareCapacity:model.spareEntryPlanningQty};
}
