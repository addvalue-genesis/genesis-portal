// PJ2608-0553 — 17 applicable MR/Location physical *FUNCTION REGISTER*.
// Candidate cable-end pairs are NOT signed WIR/TER, measured lengths or POs.
// No Cost mutation. CURRENT bid design: only LNA -> BDA at SAME original position;
// keep donor/service antenna positions. Deviation Rev00 moved Omni historically, NOT selected.
import {Z1F_TEL_LAYOUT_INDEX_0553 as LAY} from "./z1fTelLayoutIndex0553";
import {MR0002_BDA_DEVIATION_REV00_0553 as DEV} from "./mr0002DeviationBdaRev00_0553";
import {deriveBulkMrLocationCoverage0553} from "./bulkMrLocationCoverage0553";
import {MGW_P26_058_R2_SELECTED_0553 as MGW} from "./mgwP26058R2Selected0553";

const POLICY=Object.freeze({
 sourcePriority:["MR/MTO/TC","Customer reference LAY/BLD positions (base design)","User-selected LNA-to-RFI-BDA-only budget design","Internal SAMART/ADDVALUE schematic Rev00 (check only)","Selected MGW R2 quote","Customer technical closure/GA/WIR/TER"],
 customerAfcLayout:"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 (AFC 04-Sep-2026)",
 customerAfcBlock:"MM-ZTK-1F-ZWPX-TEL-BLD-0001 Rev.C1 (AFC 25-Aug-2026)",
 internalCrosscheck:"MM-ZTK-1F-GEN-SCADA-TEL-DWG-0001_All.pdf Rev00",
 customerMto:"MR0001 Rev04 source; MR0002–MR0004 MR Rev.C1",
 rfSubstitution:DEV.id,
 currentDesign:DEV.workingDesign.id,
 onlyDesignChange:"LNA_TO_RFI_BDA_AT_ORIGINAL_LOCATION",
 positionRelocationApprovedInWorkingDesign:false,
 noAutomaticQtyFromOneLot:true,allowWorkingMutation:false,allowReleaseMutation:false
});
const SITE_SHEETS=Object.freeze({ZWP20:[4,3],ZWP21:[7,4],ZWP22:[10,5],ZWP23:[12,6],ZPQ:[null,null],ZWP8:[null,7],ZWP11:[null,null]});
function make(site,mr,id,fn,from,to,cableFamily,owner,options={}){
 const obj={
  id,site,mr,function:fn,
  moduleId:"bid.budget.bom."+site.toLowerCase()+"."+mr.toLowerCase().replace("-","")+".cable-end."+id.toLowerCase(),
  fromTag:from,toTag:to,
  fromAfcConfirmed:Boolean(options.fromAfcConfirmed),toAfcConfirmed:Boolean(options.toAfcConfirmed),
  afcFromDeck:options.fromDeck||null,afcToDeck:options.toDeck||null,
  proposedFromDeck:options.proposedFromDeck||null,proposedToDeck:options.proposedToDeck||null,
  selectedWorkingFromDeck:options.selectedWorkingFromDeck||options.fromDeck||null,
  selectedWorkingToDeck:options.selectedWorkingToDeck||options.toDeck||null,
  historicalDeviationProposedToDeck:options.historicalDeviationProposedToDeck||null,
  historicalDeviationNotSelected:Boolean(options.historicalDeviationNotSelected),
  cableFamily,cableTypeApproved:null,approvedSKU:null,
  circuitCount:null,verifiedInstalledLengthM:null,procurementQtyM:null,
  quantityBasis:options.quantityBasis||"FUNCTION_CANDIDATE__WIR_TER_ROUTE_AND_ENDS_REQUIRED",
  connectorGlandEvidence:options.connectorGlandEvidence||"Pending connector genders, glands, OD/armour, Ex certification and vendor inclusions",
  vendorIncluded:options.vendorIncluded??null,vendorPackageLine:options.vendorPackageLine||null,
  owner,addvalueReserveQtyM:null,unitRateTHB:null,incrementalWorkingTHB:0,
  sourceDrawing:POLICY.customerAfcLayout+"; "+POLICY.customerAfcBlock,
  drawingSheet:options.drawingSheet||null,sourceClause:options.sourceClause||null,
  scenario:options.scenario||"BASE_REFERENCE_DESIGN_UNCHANGED_POSITION",
  deviationId:options.deviationId||null,deviationStatus:options.deviationStatus||null,
  evidenceStatus:options.evidenceStatus||"FUNCTION_EVIDENCE_ONLY__NOT_AFC_CABLE_SCHEDULE",
  engineeringNote:options.note||"",
  approvedInstallation:false,approvedProcurement:false,customerReleaseAllowed:false
 };
 return Object.freeze(obj);
}
function getTag(site,tag,system){
 const w=LAY.byWP.find(x=>x.wp===site);
 return w?.equipment.find(x=>x.tag===tag&&x.system===system)||null;
}
function scada(site,row){
 const odu=getTag(site,"MR-502-001","SCADA_RADIO");
 const antenna=getTag(site,"ANT-502-001","SCADA_RADIO");
 const s=SITE_SHEETS[site],w=odu?.deck||null;
 const ref={drawingSheet:s?.[0]??null,sourceClause:"MR0001 source Rev04 MTO BULK Row "+row,
  note:"MR0001 one source 1-Lot is not installed quantity. A5 budgetary 69m CAT6A and 1 gland/site already booked in Part A; no second extension."};
 return [
  make(site,"MR-0001","SCADA-ODU-DATA","SCADA network / IDU-L3 ↔ ODU physical Ethernet",
   "TCAB-500-001 / L3 port (E&I terminal TBD)",odu?.tag||"SCADA-ODU-TAG-TBD","CAT6A / fire rated Ethernet",
   "SCADA_EQUIPMENT_VENDOR_PLUS_INSTALLATION_INTERFACE",{
    ...ref,toAfcConfirmed:Boolean(odu),toDeck:w,
    quantityBasis:"ODU_TAG_SUPPORTED__IDU_PORT_CABLE_END_AND_TRAY_ROUTE_TBD",
    note:ref.note+"; cable path E&I room requires ELE-LAY-0002/WIR-TER; BLD note relocation of well service LAN must be separately reviewed."}),
  make(site,"MR-0001","SCADA-ODU-ANT-RF","ODU ↔ SCADA parabolic antenna / RF jumper",
   odu?.tag||"SCADA-ODU-TAG-TBD",antenna?.tag||"SCADA-ANTENNA-TAG-TBD","RF jumper / coax",
   "OEM_INCLUSION_AND_FIELD_CONNECTOR_BOUNDARY_REVIEW",{
    ...ref,fromAfcConfirmed:Boolean(odu),toAfcConfirmed:Boolean(antenna),
    fromDeck:odu?.deck||null,toDeck:antenna?.deck||null,
    note:"Separate equipment ODU-to-antenna RF connection; no 69m CAT6A rate transferred to RF coax"} ),
  make(site,"MR-0001","SCADA-ODU-POWER","Outdoor radio power/PoE/DC supply circuit",
   "POWER_OR_POE_SOURCE_TBD",odu?.tag||"SCADA-ODU-TAG-TBD","DC/PoE power cable",
   "OEM_POWER_SUPPLY_OR_ELECTRICAL_BOUNDARY_REVIEW",{
    ...ref,toAfcConfirmed:Boolean(odu),toDeck:w,
    note:"Check selected AVIAT/radio actual power architecture; do not assume a separate DC cable if PoE/IDU cable is combined"}),
  make(site,"MR-0001","SCADA-GROUND-GLAND","ODU/antenna external bonding, entry glands and physical support",
   "PLATFORM_EARTH_OR_TRAY_TBD",odu?.tag||"SCADA-ODU-TAG-TBD","Grounding / glands / support",
   "OEM_AND_SITE_FIELD_BULK_NET_OF_A5",{
    ...ref,toAfcConfirmed:Boolean(odu),toDeck:w,
    note:"Count distinct earth bonds/active cable ends. One booked M20 gland/site is a budgetary source floor not proof of all glands"})
 ];
}
function dmr(site){
 const found=LAY.byWP.find(x=>x.wp===site);
 const rf=(role)=>found?.equipment.find(x=>x.functionRole===role&&x.system==="DTRS_TRUNK_RADIO");
 const lna=rf("LEGACY_LNA_ENCLOSURE"),surge=rf("RF_SURGE_EXD");
 if(!lna||!surge)throw Error("AFC DMR LNA/surge roles unresolved: "+site);
 const yagi=getTag(site,"ANT-508-001","DTRS_TRUNK_RADIO"),omni=getTag(site,"ANT-508-002","DTRS_TRUNK_RADIO");
 const info={drawingSheet:SITE_SHEETS[site][0],sourceClause:"MR0002 C1 / working design LNA→BDA only; original Rev00 Deviation still Open",
  deviationId:DEV.id,deviationStatus:DEV.status};
 const common={...info,evidenceStatus:"SELECTED_BUDGETARY_BDA_SAME_LOCATION__WIR_TER_PENDING",
  vendorIncluded:true,vendorPackageLine:"MGW Full Rev2 UHF-1/UHF-2/UHF-3/UHF-4",
  connectorGlandEvidence:"MGW FORLLER 100m + 6 male RF connectors/site included; site-specific RF genders, Ex surge, antenna, glands and IEC60331 still require confirmation."};
 return [
 make(site,"MR-0002","DMR-DONOR-RF","Yagi donor → Surge/Original LNA; proposed RFI BDA donor route",
  yagi?.tag||"ANT-508-001",surge.tag+" / RF SURGE → "+lna.tag+" / original LNA",
  "50Ω DMR RF coax / connector / surge","MGW_COMPLETE_SYSTEM",{
   ...common,fromAfcConfirmed:true,toAfcConfirmed:true,
   fromDeck:yagi?.deck,toDeck:lna.deck,
   note:"Selected working design changes ONLY LNA→RFI BDA; donor Yagi location remains as reference layout. Rev00 YBSS6 spec/elevation is historical proposed data, NOT automatically selected. Connection sequence and real terminated segments TBD."}),
 make(site,"MR-0002","DMR-SERVICE-RF","Original LNA ↔ Omni; proposed RFI BDA service → relocated Omni",
  lna.tag+" / selected RFI BDA at former LNA position",omni?.tag||"ANT-508-002",
  "50Ω DMR RF coax / surge / service antenna connector","MGW_COMPLETE_SYSTEM",{
   ...common,fromAfcConfirmed:true,toAfcConfirmed:true,
   fromDeck:lna.deck,toDeck:omni?.deck,
   proposedFromDeck:lna.deck,proposedToDeck:omni?.deck||null,
   historicalDeviationProposedToDeck:DEV.proposed.omniRelocation,
   historicalDeviationNotSelected:true,
   scenario:"SELECTED_LNA_TO_BDA_ONLY__ORIGINAL_ANTENNA_POSITIONS",
   quantityBasis:"SAME_POSITION_BUDGET_ROUTE__REAL_CABLE_PATH_TBD",
   note:"Working-design Omni remains in original reference location on Mezzanine E&I rooftop, NOT beneath Lower Deck. Rev00 lower-deck proposal is historical and NOT ADOPTED. Preliminary same-position cable budget sensitivity may be used, but actual length requires WIR/TER."}),
 make(site,"MR-0002","DMR-BDA-POWER-ALARM","Original LNA / proposed BDA DC and alarm/supervision",
  "E&I_DC_ALARM_TERMINALS_TBD",lna.tag+" / RFI BDA selected at original LNA position",
  "DC power + alarm/control, individually identify circuits","MGW_COMPLETE_SYSTEM__INTERFACE_REVIEW",{
   ...common,toAfcConfirmed:true,toDeck:lna.deck,
   vendorIncluded:null,vendorPackageLine:"MGW Full Rev2 UHF-1",
   note:"RFI BDA is SELECTED for internal budget design at unchanged enclosure location; verify footprint/Ex power/alarm and do not reuse original LNA pinout."}),
 make(site,"MR-0002","DMR-RF-BONDING","Surge/amp/antenna grounding and Ex glands",
  "PLATFORM_EARTH_POINT_TBD",surge.tag+" / Ex d RF Surge and "+lna.tag,
  "RF grounding / cable end glands / marine support","MGW_COMPLETE_SYSTEM__FIELD_BOUNDARY_REVIEW",{
   ...common,toAfcConfirmed:true,toDeck:surge.deck,
   note:"Count cable-entry and bond requirements only from approved Ex GA and cable schedule. ADDVALUE NEK is separate optional spare, NOT installed base cable."})
 ];
}
function phone(site){
 const sounder=getTag(site,"LSE-504-001","EX_SOUNDER_NOT_IP_PHONE");
 const note="MR0003 one phone/sounder/JB system/site, Special Cable IF required; never invent one separate bulk 1-Lot line. MGW PHONE-1 JB Ex glands included pending model/gland count.";
 const sheet=SITE_SHEETS[site]?.[0]||null;
 return [
 make(site,"MR-0003","PHONE-SIP-ETH","Ex Telephone ↔ SIP/PABX / E&I LAN uplink",
  "SIP_PABX_NETWORK_PORT_TBD","IP_PHONE_VOIP_TAG_TBD","Fire-rated Ethernet/CAT6A or approved special cable",
  "MGW_PHONE_COMPLETE_SYSTEM__NETWORK_HANDOFF",{
   drawingSheet:sheet,sourceClause:"MR0003 Rev.C1 / Special Cable if required",
   vendorIncluded:null,vendorPackageLine:"MGW Full Rev2 PHONE-1",note}),
 make(site,"MR-0003","PHONE-SOUNDER-CTRL","Phone/JB ↔ Ex Sounder DC/control circuit",
  "PHONE_WAROM_JB_TAG_TBD",sounder?.tag||"LSE-504-001 / Ex sounder",
  "DC/trigger/control cable (not CAT6 by default)",
  "MGW_PHONE_COMPLETE_SYSTEM__FIELD_INTERFACE_REVIEW",{
   drawingSheet:sheet,toAfcConfirmed:Boolean(sounder),toDeck:sounder?.deck||null,
   vendorIncluded:null,vendorPackageLine:"MGW Full Rev2 PHONE-1",note}),
 make(site,"MR-0003","PHONE-EX-ENTRIES","Ex JB/Telephone cable glands and field bonding",
  "PLATFORM_EARTH_OR_TRAY_TBD","PHONE_WAROM_JB_TAG_TBD",
  "Certified Ex gland, bonding/earth, ferrules and supports",
  "MGW_WAROM_SUPPLIED_GLAND_CREDIT__ADDITIONAL_ENDS_TBD",{
   drawingSheet:sheet,vendorIncluded:null,vendorPackageLine:"MGW Full Rev2 PHONE-1",
   note:"Supplier included Ex-P gland(s); count extras only net of included glands, with actual OD/armour/Ex type. "+note})
 ];
}
function racon(site){
 const wp=LAY.byWP.find(x=>x.wp===site);
 const mar=wp?.equipment.find(x=>x.tag==="MAR-514-001");
 const db=wp?.equipment.find(x=>x.tag==="TCAB-514-001");
 const jb=wp?.equipment.find(x=>x.tag==="TCAB-514-002");
 const common={drawingSheet:SITE_SHEETS[site]?.[0]||null,
  sourceClause:"MR0004 Rev.C1 + BLD Note 4 RACON fault alarm to PCS",
  vendorIncluded:null,vendorPackageLine:"MGW Full Rev2 RACON-1",
  note:"Confirm OEM package supply for DB5P/control box, Ex glands, fusing and cable connectors; one phase adapter/charging kit is separate shared noncable asset."};
 return [
 make(site,"MR-0004","RACON-SIGNAL-CONTROL","RACON / Ex d distribution to local control/JB",
  mar?.tag||"MAR-514-001",db?.tag||"TCAB-514-001",
  "RACON power/control multicore (WIR endpoints pending)","MGW_RACON_COMPLETE_SYSTEM__INTERFACE_TBD",{
   ...common,fromAfcConfirmed:Boolean(mar),toAfcConfirmed:Boolean(db),
   fromDeck:mar?.deck||null,toDeck:db?.deck||null}),
 make(site,"MR-0004","RACON-PCS-ALARM","RACON fault alarm signal ↔ PCS terminal",
  jb?.tag||"TCAB-514-002","PCS_ALARM_TERMINAL_TBD",
  "Fire/Ex appropriate fault alarm/control cable","RACON_MGW_PCS_INTERFACE__OWNER_HOLD",{
   ...common,fromAfcConfirmed:Boolean(jb),fromDeck:jb?.deck||null,
   quantityBasis:"BLD_NOTE_4_FUNCTION_CONFIRMED__TERMINATIONS_CABLE_WIR_TBD",
   note:"BLD AFC Note 4 requires RACON fault alarm to PCS. Check Ex remote alarm dry contact/output, isolation and PCS terminal; do not omit this functional interface."}),
 make(site,"MR-0004","RACON-POWER-ENTRY","RACON/Control/JB supply, Ex entry and bonding",
  "DC_POWER_SOURCE_TBD",jb?.tag||"TCAB-514-002",
  "DC power cable / certified gland / earth","MGW_RACON_POWER_SCOPE__ELECTRICAL_INTERFACE_TBD",{
   ...common,toAfcConfirmed:Boolean(jb),toDeck:jb?.deck||null,
   note:"Do not equate RACON-1 vendor system quote with approved cable-end lengths or all external Ex glands."})
 ];
}
export function derivePhysicalCableEndRegister0553(){
 const groups=deriveBulkMrLocationCoverage0553().groups.filter(g=>g.active);
 const entries=groups.flatMap(g=>{
  if(g.mr==="MR-0001")return scada(g.site,g.sourceMtoRow);
  if(g.mr==="MR-0002")return dmr(g.site);
  if(g.mr==="MR-0003")return phone(g.site);
  if(g.mr==="MR-0004")return racon(g.site);
  return [];
 });
 const unique=new Set(entries.map(e=>e.moduleId));
 if(unique.size!==entries.length)throw Error("Duplicated cable-end module IDs");
 const full=new Set(groups.map(g=>g.site+":"+g.mr));
 for(const e of entries)if(!full.has(e.site+":"+e.mr))throw Error("Cable-end outside MR/site Scope");
 const s=Object.freeze({
  phaseSharedItem:{id:"RACON-ADAPTER-CHARGING-KIT-PHASE",
   scope:"MR-0004",requirementQty:1,unit:"set/phase",physicalCable:false,
   siteAllocation:null,workingTHB:0,source:"MR0004 Rev.C1",vendorScopeConfirmed:false},
  modelId:"bid.budget.bom.physical-cable-end-register",
  releaseModuleId:"bid.budget.pricing.release.physical-cable-end-gate",
  project:"PJ2608-0553",sourcePolicy:POLICY,bdaDeviation:DEV,
  applicableGroups:groups.length,lines:entries,
  byMR:Object.fromEntries(["MR-0001","MR-0002","MR-0003","MR-0004"].map(mr=>[mr,entries.filter(e=>e.mr===mr).length])),
  registeredFunctionalCandidates:entries.length,
  measuredCableRuns:0,approvedProcurementLines:0,workingCostDeltaTHB:0,releaseCostDeltaTHB:0,
  readiness:"BUDGETARY_LNA_TO_BDA_SAME_POSITION_SELECTED__PHYSICAL_WIR_TER_OPEN",
  releaseAllowed:false
 });
 const expected=Object.freeze({"MR-0001":28,"MR-0002":12,"MR-0003":12,"MR-0004":9});
 if(groups.length!==17||entries.length!==61||Object.keys(expected).some(mr=>s.byMR[mr]!==expected[mr]))
  throw Error("Cable-end candidate register scope mismatch — expected 61 lines over 17 groups");
 if(s.phaseSharedItem.requirementQty!==1||s.phaseSharedItem.siteAllocation!==null)
  throw Error("MR0004 phase kit must not be multiplied by three sites");

 return s;
}
