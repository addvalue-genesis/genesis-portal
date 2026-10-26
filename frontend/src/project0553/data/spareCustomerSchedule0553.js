import {selectSparesPriceEvidence0553} from "./sparePriceEvidence0553";
import {MR0004_WORKING_BOM_0553} from "./mr0004WorkingBom0553";
// PJ2608-0553 — customer-style 5-category pre-award read model.
// Current rows use the locked 2026 parametric checkpoint; rows/byCode retain
// Rev08 exclusively for historical audit. Actual installed TAG identities
// are from MR/ MTO / AFC scoped tag model, never guessed. Candidate tag links are
// engineering associations, not verified OEM interchangeable spare part numbers.
// SPQ spare cost scenarios are NON-POSTING and separate from price-controlled base.
import {selectUnifiedSpareConsumables0553} from "./unifiedSpareConsumables0553";

import {selectSpareCoverageEngineering0553} from "./spareCoverageEngineering0553";
import {MR0002_WORKING_BOM_0553} from "./mr0002WorkingBom0553";
import {deriveSpareRiskQuantity0553,deriveConsumableBudgetQuantity0553} from "./spareRiskQuantity0553";
import {selectB11MinimumTools0553} from "./b11MinimumTools0553";
import {MGW_P26_058_R2_SELECTED_0553} from "./mgwP26058R2Selected0553";
import {MGW_PAUL_EMAIL_CLARIFICATIONS_0553} from "./mgwPaulEmailClarifications0553";
// PJ2608-0553 — customer terminology belongs to the EXISTING spare source selector.
// Rev08 descriptions, quantities, prices and candidate installed-TAG identities
// remain untouched. No claim that different TAGs share interchangeable OEM SKUs.
// "Material TBC" is deliberate: a function/type does not prove an OEM material.
const freeze=Object.freeze;
const examples=freeze([
 ["Spare DC PoE injector","DC PoE injector — spare unit","Replacement power injector for network-connected equipment","Match OEM model, input voltage, PoE output power and connector","OEM electrical module — material/model TBC","อะไหล่จ่ายไฟผ่านสาย LAN"],
 ["Spare Cisco power module","Cisco power supply — spare module","Replacement power module for the installed Cisco switch","Match switch model, PSU part number, DC input and power rating","OEM power module — material/part no. TBC","โมดูลจ่ายไฟสำรองของ Cisco"],
 ["RF surge spare","RF surge protector — spare","Replacement surge protector for an RF antenna/feed line","Match RF frequency, impedance, connector, surge rating and Ex suitability","OEM RF surge assembly — material TBC","อุปกรณ์ป้องกันไฟกระชากสาย RF"],
 ["Ethernet surge spare","Ethernet surge protector — spare","Replacement surge protection for the LAN/PoE circuit","Match Ethernet speed, PoE power, ports and surge rating","OEM Ethernet surge assembly — material TBC","อุปกรณ์ป้องกันไฟกระชากสาย LAN"],
 ["RF Type N male spare connector","Type N male RF connector — spare","Connector for the matching RF cable","Match Type N male, cable size/type and 50-ohm impedance","Metal connector body — alloy/plating TBC","หัวต่อสาย RF ชนิด Type N"],
 ["M20 gland spare complete set","M20 cable gland — spare set","Spare cable entry gland for Ex equipment","Match M20 thread, cable diameter, seal and Ex certificate","Ex cable gland assembly — metal/seal grade TBC","ชุดเคเบิลแกลนด์ขนาด M20"],
 ["M25 gland spare complete set","M25 cable gland — spare set","Spare cable entry gland for Ex equipment","Match M25 thread, cable diameter, seal and Ex certificate","Ex cable gland assembly — metal/seal grade TBC","ชุดเคเบิลแกลนด์ขนาด M25"],
 ["Protection fuse spare","Electrical protection fuse — spare","Replacement protective fuse for the matching circuit","Match fuse type, voltage, current, trip characteristic and dimensions","OEM-rated fuse — cartridge material TBC","ฟิวส์ป้องกันวงจร"],
 ["Interposing relay spare with socket","Interface relay with socket — spare","Replacement relay and matching socket for control signals","Match coil voltage, contacts, socket pins and ratings","Relay + socket assembly — material TBC","รีเลย์พร้อมฐานสำรอง"],
 ["RACON programming and adapter/charging tool set","RACON programming/interface tool set","Tool set used to configure and maintain RACON","Confirm selected OEM interface, software/license, adapters and included tools","OEM tool/adapter set — contents/material TBC","ชุดเครื่องมือโปรแกรม RACON"],
 ["RF connector torque tool set","RF connector torque tool set","Tools for tightening RF connectors correctly","Match connector sizes and required tightening torque","Calibration/tool grade TBC","เครื่องมือขันหัวต่อ RF"],
 ["Cable termination tool set","Cable termination tool set","Tools for preparing and terminating cables","Match installed cable/gland/connector types","Tool set material/contents TBC","ชุดเครื่องมือเข้าหัวสาย"],
 ["System configuration tools and maintenance access","System configuration and access tools","Software/access tools needed for maintenance","Confirm software license, access rights and OEM compatibility","Software/licenses + hardware if required (TBC)","ซอฟต์แวร์และสิทธิ์เข้าระบบ"],
 ["Replacement preservation desiccant packs","Moisture-absorbing packs — spare","Extra packs used to keep stored equipment dry","Specify pack size, absorption capacity and shelf life","Desiccant composition TBC","ซองสารดูดความชื้น"],
 ["Replacement moisture barrier bags","Moisture-barrier bags — spare","Extra sealed bags for equipment preservation","Match bag size, thickness and moisture barrier grade","Barrier film type/grade TBC","ถุงป้องกันความชื้น"],
 ["Electrical maintenance cleaning kits","Electrical equipment cleaning kits","Consumable kits for routine electrical cleaning","Confirm approved cleaning agents and safe-use compatibility","Consumables and packaging — contents TBC","ชุดน้ำยาทำความสะอาดงานไฟฟ้า"],
 ["Preservation inspection labels","Storage inspection labels","Labels to record preservation and inspection status","Specify label size, durability and writable fields","Label/adhesive type TBC","ป้ายบันทึกการตรวจสภาพ"],
 ["Spare SCADA remote radio","SCADA remote radio — spare unit","Replacement of the installed SCADA radio","Match OEM radio model, frequency, configuration and interfaces","OEM radio assembly — material/model TBC","วิทยุ SCADA สำรอง"],
 ["Spare RACON complete unit","RACON — complete spare system","One replacement RACON system as an optional stock item","Match installed OEM, X/S band, Ex rating and complete required accessories","OEM complete RACON package — contents/material TBC","ระบบ RACON สำรองทั้งชุด"],
 ["SCADA DC PoE operating spare","DC PoE injector — 2-year spare","Replacement injector for operation/maintenance stock","Match installed injector OEM, voltage, PoE power and connector","OEM electrical module — material/model TBC","PoE Injector สำหรับอะไหล่ 2 ปี"],
 ["Cisco power operating spare","Cisco power module — 2-year spare","Replacement Cisco power module for operating stock","Match installed switch and OEM PSU part number/ratings","OEM power module — material/model TBC","โมดูลจ่ายไฟ Cisco สำหรับอะไหล่ 2 ปี"],
 ["Explosion-proof IP phone spare","Ex IP telephone — spare","Replacement hazardous-area VoIP telephone","Match selected OEM model, Ex certification, power and SIP interface","OEM Ex telephone enclosure — material/certification TBC","โทรศัพท์กันระเบิดสำรอง"],
 ["Sounder spare","Ex sounder — spare","Replacement hazardous-area warning sounder","Match model, Ex certificate, voltage and sound output","OEM sounder enclosure — material/certification TBC","ไซเรนหรือเสียงแจ้งเตือนสำรอง"],
 ["RF surge operating spares","RF surge protector — 2-year spares","Replacement RF surge protectors for operation","Match RF band, impedance, connectors and surge rating","OEM RF surge assembly — material TBC","อุปกรณ์ป้องกันไฟกระชาก RF สำหรับอะไหล่ 2 ปี"],
 ["Ethernet surge operating spares","Ethernet surge protector — 2-year spares","Replacement LAN/PoE surge protectors for operation","Match Ethernet/PoE ratings, ports and surge level","OEM Ethernet surge assembly — material TBC","อุปกรณ์ป้องกันไฟกระชาก LAN สำหรับอะไหล่ 2 ปี"],
 ["RACON distribution box spare","RACON junction box — spare","Replacement distribution/interface box for the RACON","Match OEM DB model, Ex certification, entries and internal terminals","OEM Ex junction box — enclosure alloy/certificate TBC","กล่องเชื่อมต่อระบบ RACON สำรอง"],
 ["Operating fuse spares","Electrical protection fuse — 2-year spares","Replacement protective fuses for operation","Match installed fuse model, current, voltage and time characteristic","OEM-rated fuse — material TBC","ฟิวส์สำรองสำหรับการใช้งาน 2 ปี"],
 ["7/8-inch RF cable operating spare (m)","7/8-inch RF cable — spare length","Replacement RF feeder cable (priced per metre)","Match 7/8-inch type, 50-ohm impedance and approved cable construction","RF cable conductor/dielectric/jacket — grade TBC","สาย RF ขนาด 7/8 นิ้ว หน่วยเป็นเมตร"],
 ["CAT6A data cable operating spare (m)","CAT6A data cable — spare length","Replacement CAT6A network cable (priced per metre)","Match CAT6A category, shielding and environmental rating","Cable conductor/jacket grade TBC","สาย LAN CAT6A หน่วยเป็นเมตร"],
 ["N-male termination spares","Type N male RF connector — 2-year spare","Replacement Type N male termination for RF cable","Match cable type, 50-ohm impedance and termination method","Metal connector body — alloy/plating TBC","หัวต่อ RF Type N สำหรับอะไหล่ 2 ปี"],
 ["M20 complete gland spares","M20 cable gland — 2-year spares","Replacement M20 glands for Ex equipment","Match M20 thread, cable OD, Ex certification and sealing","Ex gland assembly — metal/seal grade TBC","เคเบิลแกลนด์ M20 สำหรับอะไหล่ 2 ปี"]
]);
const labels=Object.freeze(Object.fromEntries(examples.map(([key,...values])=>[key.toLowerCase(),freeze(values)])));
function selectSparePlainLanguage0553(original){
 const text=String(original||"").trim();
 const row=labels[text.toLowerCase()];
 return freeze({
  name:row?.[0]||text,
  purpose:row?.[1]||"Replacement or service item for the relevant installed system",
  specification:row?.[2]||"Confirm exact OEM part number, rating and compatibility",
  materials:row?.[3]||"Selected OEM material/part number — TBC",
  explanationTH:row?.[4]||"รายการอุปกรณ์หรืออะไหล่สำหรับระบบที่เกี่ยวข้อง",
  originalDescription:text,
  oemVerified:false
 });
}

const CODES=Object.freeze(["B10","B11","B13","C1","C2"]);
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const unique=items=>[...new Set(items)];
function fits(category,description,x){
 const d=description.toLowerCase(),m=x.mr,t=x.tag.toUpperCase();
 if(category==="B11"){
  if(/racon/.test(d))return m==="MR-0004"&&t.startsWith("MAR-");
  if(/rf connector/.test(d))return (m==="MR-0001"||m==="MR-0002")&&t.startsWith("ANT-");
  if(/cable termination/.test(d))return t.startsWith("TCAB-");
  return false; // Configuration software is project COMMON and cannot be assigned a single TAG.
 }
 if(category==="B13")return false; // Common preservation consumables, NOT installed SKUs.
 if(/racon/.test(d))return m==="MR-0004"&&(/racon complete/.test(d)?t.startsWith("MAR-"):t.startsWith("TCAB-"));
 if(/scada remote radio/.test(d))return m==="MR-0001"&&t.startsWith("MR-")&&!t.endsWith("A");
 if(/scada|poe/.test(d))return m==="MR-0001"&&t.startsWith("MR-");
 if(/cisco/.test(d))return m==="MR-0001"&&t.startsWith("LAN-");
 if(/ethernet/.test(d))return m==="MR-0001"&&(/^(LAN|SA)-/.test(t));
 if(/telephone|phone/.test(d))return m==="MR-0003"&&t.startsWith("TPH-");
 if(/sounder/.test(d))return m==="MR-0003"&&t.startsWith("LSE-");
 if(/rf surge/.test(d))return m==="MR-0001"&&t.startsWith("SA-")||m==="MR-0002"&&x.functionRole==="RF_SURGE_EXD";
 if(/rf |n-male|7\/8-inch/.test(d))return (m==="MR-0001"||m==="MR-0002")&&t.startsWith("ANT-");
 if(/gland|fuse|relay/.test(d))return t.startsWith("TCAB-")||/fuse/.test(d)&&m==="MR-0001"&&t.startsWith("LAN-");
 if(/cat6a/.test(d))return m==="MR-0001"&&t.startsWith("LAN-");
 return false;
}
const hint=(description)=>{
 const d=description.toLowerCase();
 if(/gland/.test(d))return "Ex certification, thread and installed cable OD must match";
 if(/surge/.test(d))return "Surge rating, RF frequency/impedance or Ethernet PoE ratings must match";
 if(/power|poe/.test(d))return "Match OEM part number, rated input/output voltage and power";
 if(/radio|bda/.test(d))return "Match frequency band, radio configuration, interface and Ex assembly";
 if(/racon/.test(d))return "Match selected RACON manufacturer system configuration";
 if(/software|configuration/.test(d))return "Confirm license/access rights and OEM package inclusions";
 if(/connector|feeder/.test(d))return "Match cable type, impedance and termination series";
 if(/telephone|sounder/.test(d))return "Match Ex certification, voltage, interface and approved model";
 if(/preservation|desiccant|moisture|cleaning|labels/.test(d))return "Preservation/maintenance consumption and handover stock, not installed equipment";
 return "Confirm actual OEM SKU, rating and delivery quantity against MR/DTS/SPIR";
};
const rowStatus=(code)=>code==="B11"?"BUDGETARY_REFERENCE_NOT_POSTED":"EXISTING_REV08_WORKING_SELL_BUDGET";
const budgetUnitFromDescription=d=>{
 const s=d.toLowerCase();
 if(/cable.*\(m\)|cable.*\(meter\)/.test(s))return "m";
 if(/desiccant pack/.test(s))return "pack";
 if(/barrier bag/.test(s))return "bag";
 if(/kit/.test(s))return "kit";
 if(/set|tools and maintenance access|programming and adapter/.test(s))return "set";
 if(/gland.*set|relay.*socket/.test(s))return "set";
 return "ea";
};

const physicalFamily=d=>{
 const v=d.toLowerCase();
 if(/poe/.test(v))return "SCADA_POE";
 if(/cisco power/.test(v))return "CISCO_POWER";
 if(/rf surge/.test(v))return "RF_SURGE";
 if(/ethernet surge/.test(v))return "ETHERNET_SURGE";
 if(/m20/.test(v))return "M20_GLAND";
 if(/fuse/.test(v))return "FUSE";
 if(/n-male/.test(v))return "RF_N_CONNECTOR";
 return null;
};
// Evidence-grade analysis of EXISTING 31 Rev08 rows; no second price model.
const assessSpareLine0553=(code,description)=>{
 const s=description.toLowerCase(),option=code.startsWith("C");
 const b10c2=["SCADA_POE","CISCO_POWER","RF_SURGE","ETHERNET_SURGE","M20_GLAND","FUSE","RF_N_CONNECTOR"].includes(physicalFamily(description)||"");
 let installedCandidateSku=null,evidence="MR0001–0004 Rev.C1 / Rev08 candidate",issue="OEM spare SKU, rating, interchangeability and supplier unit price are not evidenced",
 action="Obtain OEM SPIR part number, applicable installed TAG, unit price, lead time and per-platform quantity",
 category="OEM_SPIR_REQUIRED",level="REVIEW";
 if(/rf surge/.test(s)){
  installedCandidateSku="PolyPhaser IS-B50LN-C2 quoted in MGW UHF-2 for MR0002 only";
  evidence="MGW P26-058_R2 UHF-2 + MR0001 surge MTO";
  issue="RF surge candidates span different systems; a quoted MR0002 protector is not interchangeable with all MR0001 surge TAGs";
  action="Verify by installed surge SKU, RF band, impedance, Ex protection and connector; split by actual part if models differ";level="HIGH";
 }else if(/7\/8-inch/.test(s)){
  installedCandidateSku='MGW UHF-4 quotes FORLLER 1/2-inch cable, NOT 7/8-inch';
  issue="Historical C2 7/8-inch cable does not match the quoted MR0002 1/2-inch feeder";
  action="Verify 7/8-inch is actually installed elsewhere; otherwise replace the historical candidate only after approved cable BOM update";level="HIGH";category="SIZE_MISMATCH";
 }else if(/racon.*complete/.test(s)){
  installedCandidateSku="Tideland SeaBeacon 2 System 6; MGW RACON-1 installed quotation only";
  issue="Historical ORGA option is NOT MGW/Tideland interchangeable spare, and MGW installed-system price is not spare price";
  action="Obtain separately priced Tideland spare SKU, Ex certificate, accessories and delivery basis";level="HIGH";category="UNQUOTED_CAPITAL_OPTION";
 }else if(/racon.*distribution/.test(s)){
  installedCandidateSku="DB-5P Ex d box included with MGW RACON-1 installed set";
  issue="No separately quoted DB-5P spare, and possible B10/C2 overlap";
  action="Confirm DB-5P standalone spare part, Ex/terminal spec and kit inclusion";level="HIGH";
 }else if(/racon.*programming/.test(s)){
  installedCandidateSku="MGW Paul 20-Oct email confirms RACON programming kit included; exact SKU unlisted";
  evidence="MGW Paul 20-Oct-2026 email RACON-KIT";
  issue="B11 historical tool line may overlap an already included Part A MGW programming kit";
  action="Get kit packing list, quantity, OEM software license and credit included items before independent B11 tool pricing";level="HIGH";category="VENDOR_INCLUDED_KIT_RECONCILE";
 }else if(/telephone|ip phone/.test(s)){
  installedCandidateSku="Gai-Tronics Auteldac 6 212-02-6008-410 — installed MGW PHONE-1";
  issue="Installed phone model known; independently priced compliant spare not quoted";
  action="Check identical handset model, Ex certificate, PoE/SIP settings and vendor spare rate";
 }else if(/sounder/.test(s)){
  installedCandidateSku="EATON DB3B — installed MGW PHONE-1, voltage variant unverified";
  issue="MGW installed bundle includes sounder, but correct spare voltage and Ex model not quoted";
  action="Confirm voltage, alarm output, Ex approval, independently priced spare";
 }else if(/cisco power/.test(s)){
  issue="Cisco equipment family known; exact PSU replacement part number not recorded";
  action="Verify switch PID, PSU SKU, DC voltage and redundancy per installed location";
 }else if(/poe/.test(s)){
  issue="PoE injector vendor part and rating are not established as common for all associated TAGs";
  action="Obtain installed injector model, input/output volts, power and PoE port specification";
 }else if(/gland/.test(s)){
  issue="Gland vs stopping plug are different physical items; Ex, thread and cable OD must match";
  action="Cross-check certified installed glands and plugs with MR0002 BDA and MR0003 accessories, net Part A inclusions";level="HIGH";
 }else if(/fuse|relay/.test(s)){
  evidence="EXA-A8 Att-1 relevant equipment/rating minimum; MR0001–0004";
  issue="EXA-A8 minimum depends on fuse rating/relay type; Rev08 Qty alone does not prove each type";
  action="Count installed distinct electrical ratings and apply ONLY applicable EXA-A8 minimum; identify OEM fuse/relay+socket SKU";level="HIGH";
 }else if(/n-male|rf type n/.test(s)){
  installedCandidateSku='MGW UHF-4 includes 1/2-inch feeder connectors (type/model not independently specified)';
  issue="Connector style and feeder cable size cannot be assumed interchangeable across TAGs";
  action="Reconcile each 1/2-inch vs 7/8-inch cable and required RF connector series, net MGW included accessories";level="HIGH";
 }else if(code==="B13"){
  evidence="MR Attachment 9 / EXA-A8 preservation & B5 packing owner";
  issue="Rev08 consumption has no evidenced activity count and may duplicate B5 shipment packing";
  action="Compute handover consumables from preservation/inspection events and net actual B5 packing inclusions";level="HIGH";category="B5_B13_NETTING_REQUIRED";
 }else if(code==="B11"){
  evidence="EXA-A8 Att-2 Telecom / MR Attachment 8";
  issue="Tool/license item may be included in Part A and may not serve the selected DMR/RACON";
  action="Confirm project license rights, OEM inclusion, tool compatibility and one shared phase set";level="HIGH";
 }
 if(option&&code==="C2"&&b10c2){
  category="C2_B10_ATTACHMENT7_EXCLUSION";level="HIGH";
  issue+="; MR Attachment 7 requires exclusion of physical stock items already listed in B10";
  action+="; compare B10 and C2 SKU/quantity and remove proven duplicate from C2 before release";
 }
 return Object.freeze({installedCandidateSku,quotedIndependentSpareSku:null,
  approvedReplacementSku:null,verifiedSpareQty:null,verifiedDirectCostTHB:null,
  evidence,issue,action,category,level,
  proofKind:installedCandidateSku?"INSTALLED_VENDOR_MODEL_ONLY__NOT_SPARE_SKU":"DOCUMENT_OR_FUNCTION_REFERENCE_ONLY",
  exaAtt1:"https://drive.google.com/file/d/1aFGpjocp4YUlsTEewTTvw9-BDi1mz5ZL/view",
  exaAtt2:"https://drive.google.com/file/d/1J3jkvf9e-tbFAiGwrK0s_bVIbH6pmUZ7/view",
  mgwSelectedQuote:"https://drive.google.com/file/d/1LHfQU0yg2O9GwLhHnVyBPxtfPfrI1Jzo/view",
  completeness:"PRE_AWARD_FUNCTIONAL_REVIEW_COMPLETE__OEM_SPIR_OPEN",
  stockInterchangeabilityApproved:false,extraPostingAllowed:false,releaseAllowed:false});
};
export function selectSpareCustomerSchedule0553(){
 const sparePriceEvidence=selectSparesPriceEvidence0553();
 const master=selectUnifiedSpareConsumables0553(),cover=selectSpareCoverageEngineering0553();
 const b11Requirements=selectB11MinimumTools0553();
 if(!MGW_P26_058_R2_SELECTED_0553.lines.some(r=>r.id==="UHF-2"&&r.model.includes("IS-B50LN-C2"))||
    !MGW_P26_058_R2_SELECTED_0553.lines.some(r=>r.id==="PHONE-1"&&r.model.includes("DB3B"))||
    MGW_PAUL_EMAIL_CLARIFICATIONS_0553.raconProgrammingKit.included!==true)
  throw Error("MGW installed component/e-mail source changed; spare compatibility must be reassessed");
 const rows=CODES.flatMap(code=>(master.byCode[code]||[]).map(x=>{
  const installed=cover.installed.filter(a=>fits(code,x.description,a));
  const tags=unique(installed.map(i=>i.tag)),sites=unique(installed.map(i=>i.site));
  const explain=selectSparePlainLanguage0553(x.description);
  const verification=assessSpareLine0553(code,x.description);
  const common=code==="B13"||/configuration tools and maintenance access/i.test(x.description);
  const tagSummary=tags.length>1?tags.length+" related equipment TAGs — check OEM":
   tags.length===1?tags[0]:common?"Common stock — no equipment TAG":"Equipment TAG mapping pending";
  const coveredCommon=common?cover.installed:installed;
  const applicableMRs=unique(coveredCommon.map(i=>i.mr));
  const applicableLocations=unique(coveredCommon.map(i=>i.site));
  // A shared common tool/consumable is not a claim of a physical OEM TAG number.
  return Object.freeze({
   id:x.id,code,item:x.item,
   sourceRowModuleId:"bid.budget.working.bc."+code.toLowerCase()+".spare-line."+x.id.toLowerCase(),
   sourceOwnerModuleId:"bid.budget.working.bc."+code.toLowerCase(),
   traceId:code+"::"+x.id,
   sourcePriceBasis:"REV08_HISTORICAL_PRICED_INPUT__PRE_AWARD_SELECTED_WORKING_REFERENCE",
   engineeringVerification:verification,installedCandidateSku:verification.installedCandidateSku,
   verifiedSpareSku:null,verifiedSpareQty:null,verifiedSpareDirectCostTHB:null,
   tagNo:tags.length?tags.join(", "):"COMMON",
   tagSummary,relatedEquipmentTagCount:tags.length,
   relatedTagList:tags,relatedSiteTagCount:installed.length,
   // Candidate applicability only; cannot assert one physical spare fits these TAGs.
   commonSpareInterchangeabilityVerified:false,
   displayDescription:explain.name,displayPurpose:explain.purpose,
   displaySpecification:explain.specification,displayMaterials:explain.materials,
   explanationTH:explain.explanationTH,originalDescription:explain.originalDescription,
   materialVerified:false,oemSpareSkuVerified:false,
   linkedMR:applicableMRs,
   linkedLocations:applicableLocations,installedTagKeys:unique(installed.map(i=>i.key)),
   mappingStatus:tags.length?"INSTALLED_TAG_FUNCTIONAL_ASSOCIATION__SPARE_SKU_COMPATIBILITY_OPEN":common?"COMMON_NON_EQUIPMENT_STOCK":"UNMAPPED_LEGACY_PRICE_SCOPE",
   description:x.description,detailSpecification:hint(x.description),
   materials:"As specified for the selected OEM item",qty:x.budgetQty,
   unit:budgetUnitFromDescription(x.description),unitPriceTHB:x.budgetUnitTHB,extendedTHB:x.budgetTotalTHB,
   sourcePriceUSD:x.legacyUnitUSD,sourceId:x.id,sourceRevision:"4-Scope of Supply.xlsx Rev08",workingFxTHBPerUSD:master.fxTHBPerUSD,
   workingStatus:rowStatus(code),costOwner:code,customerReleaseAllowed:false,
   activityBasedQuantityEquation:code==="B13"?deriveConsumableBudgetQuantity0553({}).equationId:null,
   activityBasedQuantityState:code==="B13"?deriveConsumableBudgetQuantity0553({}).status:null,
   possibleOverlap:code==="B13"? "B5 packing material vs separate B13 handover stock must be net reconciled":
    code==="B11"?"OEM Part A included tools/software or previously supplied RACON kit must be credited":
    "Check OEM Part A / separate category delivered-quantity register",
   leadTimeARO:null,option:code.startsWith("C")
  });
 }));
 const byCode=Object.fromEntries(CODES.map(code=>[code,rows.filter(x=>x.code===code)])); 
 // CURRENT PTTEP FIRST-PRINCIPLES WORKING ESTIMATE (not the historical 31 rows).
 // Class A: MR-confirmed contractual kit counts; Class P: explicitly assumed
 // vendor-UNQUOTED planning rates, 31.5 FX and 1.30 SELL multiplier.
 // Every physical SKU/Ex compatibility and independent OEM quote remains OPEN.
 // The four B10 kit lines are envelopes, NOT 14 approved spare part SKUs.
 const paramInputs=Object.freeze([
  // B10: one kit per new MR/platform, 4/3/4/3; the OEM must later itemize each.
  ["B10","MR-0001","SCADA radio / Cisco L3 / PoE commissioning spare kit",4,1400,
   "SCADA/L3 replacement fuses by rating, power injector and approved Ethernet/RF protection; EXA-A8 PLC scope not assumed",
   "MR0001 Rev.C1 §5 Attachment 5; GA-0001; DTS0001; PTTEP TEL-001 §7.7"],
  ["B10","MR-0002","RFI BDA RF interface commissioning spare kit",3,700,
   "RFI/WAROM OEM-approved RF surge/coupler, feeder termination, Ex seal parts; full BDA assembly is NOT included",
   "MR0002 Rev.C1 §5; DTS0002; MGW R2 UHF-1/UHF-2/UHF-4 inclusion audit"],
  ["B10","MR-0003","Ex IP telephone and sounder commissioning spare kit",4,550,
   "OEM-approved handset/sounder service parts, certified Ex glands/seals, CAT6A re-termination only",
   "MR0003 Rev.C1 §5; DTS0003; MGW R2 PHONE-1 inclusion audit"],
  ["B10","MR-0004","Marine RACON commissioning spare kit",3,850,
   "Approved fuse/control box gasket/Ex gland and OEM service materials, excluding complete SeaBeacon-2 capital spare",
   "MR0004 Rev.C1 §5; DTS0004; MGW R2 RACON-1 inclusion audit"],
  // B11: four MR-phase sets; PTTEP Annex Att-2 five telecom checks mapped
  // to SCADA licenses, TETRA vs selected DMR, and RACON charging/config tools.
  ["B11","MR-0001","SCADA configuration and network-monitoring special tools",1,2100,
   "EXA-A8 Attachment 2 §5 SCADA configuration/NMS licences; check Cisco/AVIAT licences included in Part A",
   "MMC25-5001 EXA-A8 Att-2 §5; MR0001 §5; SPE §8.2"],
  ["B11","MR-0002","RFI BDA OEM service/configuration special tool set",1,650,
   "Selected DMR/RFI BDA does NOT establish TETRA voice gateway need; seek approved OEM service method",
   "MR0002 §5; EXA-A8 Att-2 TETRA applicability hold; MGW R2 UHF-1"],
  ["B11","MR-0003","Ex phone/sounder approved service and verification tooling",1,350,
   "Only special OEM tools not already ordinary SAT tester or Part A inclusions; B3 temporary VeEX excluded",
   "MR0003 §5; DTS0003; SPE §8.2; B3 tool cost owner"],
  ["B11","MR-0004","RACON configuration/charging tool readiness reserve",1,750,
   "Conditional only: deduct OEM-supplied adapter/charging kit on written inclusion proof",
   "MR0004 §5; EXA-A8 Att-2 §5 if applicable; SPE RACON adapter; MGW tool inclusion audit"],
  // B13: preservation consumption, not supplied installation bulk or B5 packing.
  ["B13","MULTI","Replacement desiccant/preservation activity sets",4,120,
   "One tentative preservation/reinspection lot per new platform; frequency and actual event count open",
   "MR Attachment 9; BOD preservation requirement; B5 packing duplicate exclusion"],
  ["B13","MULTI","Commissioning-approved cleaning/termination consumable kits",4,95,
   "For rework consumption only; no installed CAT6A/coax lengths or permanent cable glands",
   "BOD/SPE/DTS; site SAT activity basis; A5 installed-bulk exclusion"],
  ["B13","MULTI","Replacement preservation seals/inspection label project stock",1,280,
   "Shared project stock; storage/reinspection procedure and consumed quantities need approval",
   "MR Attachment 9 / preservation procedure; B5 overlap control"]
 ]);
 const paramFx=31.5,commercialFactor=1.30;
 const mrSites=Object.freeze({
  "MR-0001":["ZWP20","ZWP21","ZWP22","ZWP23"],
  "MR-0002":["ZWP20","ZWP21","ZWP22"],
  "MR-0003":["ZWP20","ZWP21","ZWP22","ZWP23"],
  "MR-0004":["ZWP20","ZWP21","ZWP22"],
  MULTI:["ZWP20","ZWP21","ZWP22","ZWP23"]
 });
 const built=paramInputs.map(([code,mr,description,qty,rate,details,source],i)=>{
  const sameOwnerIndex=paramInputs.slice(0,i+1).filter(row=>row[0]===code).length;
  const id=code+"-PTTEP-"+String(sameOwnerIndex).padStart(2,"0");
  const soldUnitUsd=rate*commercialFactor,siteList=mrSites[mr];
  return Object.freeze({
   id,code,item:sameOwnerIndex,sourceId:id,
   sourceRowModuleId:"bid.budget.working.bc."+code.toLowerCase()+".spare-line."+id.toLowerCase(),
   sourceOwnerModuleId:"bid.budget.working.bc."+code.toLowerCase(),
   traceId:code+"::"+id,tagNo:"SYSTEM SPARES / "+mr,
   tagSummary:mr==="MULTI"?"SHARED PROJECT STOCK":mr+" kit/tool scope",
   relatedTagList:[],relatedEquipmentTagCount:0,relatedSiteTagCount:siteList.length,
   displayDescription:description,description,originalDescription:description,
   displayPurpose:details,explanationTH:"Engineering parametric price allowance: OEM SKU/rating and delivered item list remain unverified",
   displaySpecification:details,detailSpecification:details,
   displayMaterials:"OEM certified as applicable / SPIR pending",
   materials:"OEM certified as applicable / SPIR pending",
   linkedMR:mr==="MULTI"?["MR-0001","MR-0002","MR-0003","MR-0004"]:[mr],
   linkedLocations:siteList,installedTagKeys:[],
   mappingStatus:"MR_SITE_SCOPE_VERIFIED__OEM_PART_KIT_CONTENT_PENDING",
   qty,unit:"set",budgetQty:qty,unitPriceTHB:round(soldUnitUsd*paramFx),
   extendedTHB:round(qty*soldUnitUsd*paramFx),
   sourcePriceUSD:soldUnitUsd,workingFxTHBPerUSD:paramFx,
   internalParametricUnitCostUSD:rate,internalParametricCostTHB:round(rate*qty*paramFx),
   sourceRevision:"PTTEP_FIRST_PRINCIPLES_BUDGETARY_2026_10_23",
   sourcePriceBasis:"UNQUOTED_PARAMETRIC_ALLOWANCE__NOT_OEM_VERIFIED",
   evidenceSource:source,workingStatus:"PRE_AWARD_BUDGETARY_PARAMETRIC__TECHNICAL_HOLD",
   displayPriceClass:"PLANNING_SELL_ONLY__OEM_SPIR_AND_DDP_OPEN",
   customerReleaseAllowed:false,leadTimeARO:null,option:false,
   possibleOverlap:"Part A/A5, B5, B3/B11, C1/C2 physical stock crosswalk mandatory"
  });
 });
 // C1 installed MGW RACON-1 is a current OEM installed PACKAGE comparable, not
 // an independent spare quotation. Keep it OPTION and do not release its price.
 const racon={unitPriceUSD:MR0004_WORKING_BOM_0553.quotePackageUSD};
 if(racon.unitPriceUSD!==75000||MR0004_WORKING_BOM_0553.sourceQuotedQty!==1)throw Error("MDS one-system comparable changed");
 const capital=Object.freeze({
  id:"C1-PTTEP-01",code:"C1",item:1,sourceId:"C1-PTTEP-01",
  sourceRowModuleId:"bid.budget.working.bc.c1.spare-line.c1-pttep-01",
  sourceOwnerModuleId:"bid.budget.working.bc.c1",traceId:"C1::C1-PTTEP-01",
  tagNo:"MAR-514-001",tagSummary:"Marine RACON capital spare (project pool)",
  relatedTagList:[],relatedEquipmentTagCount:1,relatedSiteTagCount:3,
  description:"SeaBeacon 2 complete RACON capital spare — optional equivalent",
  originalDescription:"SeaBeacon 2 complete RACON capital spare — optional equivalent",
  displayDescription:"SeaBeacon 2 complete RACON capital spare — optional equivalent",
  displayPurpose:"Owner candidate one distinct pool unit, NOT an MR-required extra system",
  displaySpecification:"Tideland SeaBeacon 2 System 6 X/S; Ex and configuration to match selected MDS package; OEM spare quote pending",
  detailSpecification:"Tideland SeaBeacon 2 System 6 X/S; OEM spare approval required",
  displayMaterials:"Complete Ex certified compatible assembly — OEM verification pending",
  materials:"Complete Ex certified compatible assembly — OEM verification pending",
  linkedMR:["MR-0004"],linkedLocations:mrSites["MR-0004"],installedTagKeys:[],
  mappingStatus:"C1_OPTION__INDEPENDENT_SPARE_QUOTE_NOT_VERIFIED",
  qty:1,unit:"set",budgetQty:1,
  sourcePriceUSD:null,workingFxTHBPerUSD:paramFx,
  internalInstalledComparableUnitUSD:racon.unitPriceUSD,
  internalNonpostingCostReferenceTHB:round(racon.unitPriceUSD*paramFx),
  internalNonpostingSellScenarioTHB:round(racon.unitPriceUSD*paramFx*commercialFactor),
  unitPriceTHB:null,extendedTHB:null,
  sourceRevision:"MDS_QTORG2609244_INSTALLED_COMPARABLE_ONLY",
  sourcePriceBasis:"INSTALLED_PACKAGE_COMPARABLE__NOT_SPARE_VENDOR_QUOTE",
  workingStatus:"OPTION_REQUIRES_INDEPENDENT_OEM_SPARE_QUOTE",
  customerReleaseAllowed:false,leadTimeARO:null,option:true
 });
 const twoYear=["MR-0001","MR-0002","MR-0003","MR-0004"].map((mr,i)=>Object.freeze({
  id:"C2-PTTEP-"+String(i+1).padStart(2,"0"),code:"C2",item:i+1,
  sourceId:"C2-PTTEP-"+String(i+1).padStart(2,"0"),
  sourceRowModuleId:"bid.budget.working.bc.c2.spare-line.c2-pttep-"+String(i+1).padStart(2,"0"),
  sourceOwnerModuleId:"bid.budget.working.bc.c2",traceId:"C2::C2-PTTEP-"+String(i+1).padStart(2,"0"),
  tagNo:"SYSTEM SPARES / "+mr,tagSummary:mr+" two-year OEM operating spares",
  relatedTagList:[],relatedEquipmentTagCount:0,relatedSiteTagCount:mrSites[mr].length,
  description:"Two-year OEM operating spare parts list — "+mr,
  originalDescription:"Two-year OEM operating spare parts list — "+mr,
  displayDescription:"Two-year OEM operating spare parts list — "+mr,
  displayPurpose:"OEM SPIR separate quotation; must exclude physical B10 identical part stock",
  displaySpecification:"OEM part numbers, MTBF/maintenance, qty, lead time, Ex and B10 exclusion required",
  detailSpecification:"OEM recommended two-year spare part list; no duplicate B10 SKU",
  displayMaterials:"OEM material specification pending",materials:"OEM material specification pending",
  linkedMR:[mr],linkedLocations:mrSites[mr],installedTagKeys:[],
  mappingStatus:"OPTIONAL_C2_PRICE_QUOTATION_AND_SKU_CROSSWALK_REQUIRED",
  qty:null,unit:"lot",budgetQty:null,unitPriceTHB:null,extendedTHB:null,
  sourcePriceUSD:null,workingFxTHBPerUSD:paramFx,
  sourceRevision:"MR0001_0004_REV_C1_ATTACHMENT_7",
  sourcePriceBasis:"OEM_TWO_YEAR_SPARE_QUOTATION_ONLY__NO_RATE_GUESS",
  workingStatus:"OPTION_NOT_QUOTED__NO_APPROVED_SPIR",
  customerReleaseAllowed:false,leadTimeARO:null,option:true
 }));
 // Read site + TAG from the ORIGINAL engineering/MTO/AFC source register.
 // These are RELATED installed equipment references, NOT proof that one spare
 // SKU fits every TAG. No fabricated TAG or suffix-only crosswalk is allowed.
 const currentRows=Object.freeze([...built,capital,...twoYear].map(line=>{
  const related=line.linkedMR.includes("MR-0001")&&line.linkedMR.length>1?[]:
   cover.installed.filter(x=>line.linkedMR.includes(x.mr)&&line.linkedLocations.includes(x.site));
  const keys=unique(related.map(x=>x.key)),tagRefs=unique(related.map(x=>x.site+" / "+x.tag));
  // Current MR envelopes retain their own evidence; the 31 historical candidates
  // are a separate risk review, never an invented SKU-to-kit allocation.
  const controls={
   B10:["OEM_KIT_CONTENTS_OPEN","14 contractual kits do not establish approved contents, spare SKUs or Ex compatibility",
    "Provide itemized commissioning SPIR per MR/platform, installed TAG compatibility, Ex evidence, independent rates and DDP; assign each physical item one cost owner"],
   B11:["OEM_TOOL_INCLUSION_OPEN","Four MR phase sets do not establish five EXA-A8 functions or net OEM-included tools",
    "Resolve Phase 1E/1F precedence and TETRA applicability; verify five telecom functions, licenses and MDS quoted purge/programming kit; adapter/charger equivalence unresolved; exclude B3 testers and Part A inclusions before any authorized price change"],
   B13:["PRESERVATION_CONSUMPTION_OPEN","Preservation activity counts and consumed quantities remain unapproved",
    "Provide preservation/reinspection events and consumption records; exclude B5 shipment packing and A5 installed bulk; no automatic quantity or price posting"],
   C1:["OEM_REPLACEMENT_STRATEGY_OPEN","Installed RACON package is not an independently quoted capital spare",
    "Confirm OEM replacement versus repair strategy, compatible spare SKU/Ex certificate, accessories, lead time and independent DDP quotation"],
   C2:["C2_B10_SPIR_EXCLUSION_OPEN","Two-year spare quantities and rates are not established; B10 physical stock exclusion remains open",
    "Provide two-year OEM SPIR by MR, maintenance basis, SKU/quantity/lead time and independent quotation; exclude identical B10 stock under Attachment 7 instruction 6"]
  };
  const [category,issue,action]=controls[line.code];
  const installedCandidateSku=line.code==="C1"?"ORGA / Tideland SeaBeacon 2 — MDS installed package only":null;
  const engineeringVerification=Object.freeze({
   sourceId:line.id,sourceRowModuleId:line.sourceRowModuleId,
   installedCandidateSku,quotedIndependentSpareSku:null,approvedReplacementSku:null,
   verifiedSpareQty:null,verifiedDirectCostTHB:null,
   evidence:line.evidenceSource||line.sourceRevision,issue,action,category,level:"HIGH",
   proofKind:"CURRENT_MR_ENVELOPE__OEM_SPIR_NOT_VERIFIED",
   completeness:"CURRENT_REQUIREMENT_TRACE_PRESENT__OEM_PROOF_OPEN",
   stockInterchangeabilityApproved:false,extraPostingAllowed:false,releaseAllowed:false
  });
  return Object.freeze({...line,
   engineeringVerification,installedCandidateSku,
   verifiedSpareSku:null,verifiedSpareQty:null,verifiedSpareDirectCostTHB:null,
   installedTagKeys:keys,relatedTagList:tagRefs,
   relatedEquipmentTagCount:tagRefs.length,
   relatedSiteTagCount:unique(related.map(x=>x.site)).length,
   tagSummary:tagRefs.length?line.tagSummary+" · "+tagRefs.length+" related installed Site/TAG references":line.tagSummary,
   commonSpareInterchangeabilityVerified:false
  });
 }));
 const currentByCode=Object.fromEntries(CODES.map(code=>[code,
  Object.freeze(currentRows.filter(x=>x.code===code))]));
 const currentBudgetaryByCode=Object.fromEntries(CODES.map(code=>[code,
  currentByCode[code].length&&currentByCode[code].every(x=>Number.isFinite(x.extendedTHB))?
   round(currentByCode[code].reduce((n,x)=>n+x.extendedTHB,0)):null]));
 const docKits={"MR-0001":4,"MR-0002":3,"MR-0003":4,"MR-0004":3};
 if(currentByCode.B10.reduce((n,r)=>n+r.qty,0)!==14||
  Object.entries(docKits).some(([mr,qty])=>currentByCode.B10.find(r=>r.linkedMR[0]===mr)?.qty!==qty)||
  currentByCode.B11.length!==4||currentByCode.B13.length!==3||
  currentByCode.C1.length!==1||currentByCode.C2.length!==4||
  new Set(currentRows.map(x=>x.id)).size!==currentRows.length||
  currentBudgetaryByCode.C2!==null||
  !currentRows.every(x=>x.customerReleaseAllowed===false))
  throw Error("0553 PTTEP current physical-owner/kit quantity/optional gates failed");

 // Do not silently distribute the grand total across tags or add a balancing price line.
 for(const code of CODES){
  const subtotal=round(byCode[code].reduce((n,x)=>n+x.extendedTHB,0));
  const expected=master.budgetTotalsTHB[code];
  if(Math.abs(subtotal-expected)>0.12)throw Error("Rev08 line rounding/source mismatch "+code);
 }
 const site=MR0002_WORKING_BOM_0553.sites.find(s=>s.site==="ZWP20");
 // RFI BDA is installed at the ORIGINAL LNA TAG, NOT at a hardcoded TCAB
 // suffix. ZWP20 uses -002; ZWP21/22 use -001 (reverse surge positions).
 // This 10.3 risk comparison reads actual selected BOM identity without
 // altering the MGW UHF-1 vendor quotation or creating a new spare price.
 const kit=site?.items.find(x=>x.id==="ZWP20-RFI-BDA"&&
  x.tag===site.selectedBdaTag&&x.quoteLine==="UHF-1");
 if(!kit||site.selectedDesign!=="LNA_TO_RFI_BDA_ONLY_SAME_POSITION"||
    site.referenceSurgeTag===site.selectedBdaTag||
    !site.siteTags.includes(site.referenceSurgeTag)||
    kit.qty!==1||kit.currency!=="USD"||kit.unitCost!==31474||
    !site.siteTags.includes(kit.tag))
  throw Error("MR0002/ZWP20 RFI BDA selected AFC LNA-position TAG and MGW UHF-1 quote must match Working BOM");
 const rfiEvidenceRows=site.items.filter(item=>[
  "ZWP20-RFI-BDA","ZWP20-RFI-BDA-EXD-ENCLOSURE",
  "ZWP20-BDA-M20-GLANDS","ZWP20-BDA-RF-FEEDTHROUGHS",
  "ZWP20-BULK-EX-SURGE"
 ].includes(item.id)).map(item=>Object.freeze({
  id:item.id,tag:item.tag,sku:item.sku||null,description:item.description,
  qty:item.qty,unit:item.unit,source:item.source,
  referenceUnitTHB:Number.isFinite(item.unitCost)?round(item.unitCost*(item.currency==="USD"?master.fxTHBPerUSD:1)):null,
  referenceExtendedTHB:Number.isFinite(item.extended)?round(item.extended*(item.currency==="USD"?master.fxTHBPerUSD:1)):null,
  currency:item.currency||null,priceInclusion:item.priceInclusion||null,
  countedInPartA:item.countedInWorkingTotal===true,nonAdditive:item.countedInWorkingTotal!==true,
  status:item.status
 }));
 // Count selected BDA installed bundles at each site's OWN approved
 // LNA physical position, never count a similarly named surge TAG.
 const equipmentInstances=MR0002_WORKING_BOM_0553.sites.filter(w=>
  w.selectedBdaTag&&w.selectedBdaTag!==w.referenceSurgeTag&&
  w.items.some(x=>x.id===w.site+"-RFI-BDA"&&
   x.tag===w.selectedBdaTag&&x.quoteLine==="UHF-1"&&
   x.unitCost===kit.unitCost&&x.qty===1)).length;
 if(equipmentInstances!==3)
  throw Error("MR0002 spare risk installed BDA count must follow three physical BDA positions, not shared TAG suffix");
 const scenario=deriveSpareRiskQuantity0553({installedCount:equipmentInstances,critical:true,
  contractualPartMinimum:null,compatibilityProven:false});
 const riskCandidates=Object.freeze([Object.freeze({
  id:"MR0002-RFI-BDA-REPLACEMENT-RISK",mr:"MR-0002",site:"ZWP20",tagNo:kit.tag,
  moduleId:"bid.budget.bom.mr0002.zwp20.zwp20-rfi-bda.evidence",
  description:"Complete RFI BDA + WAROM Ex d assembly — replacement risk scenario",
  sku:kit.sku,partAEquipmentOwner:"MGW_UHF1_RFI_WAROM_BUNDLED_PACKAGE",
  qty:scenario.budgetQty,unit:"complete set",sourceUnitUSD:kit.unitCost,planningFxTHBPerUSD:master.fxTHBPerUSD,
  comparativeUnitTHB:round(kit.unitCost*master.fxTHBPerUSD),
  comparativeAmountTHB:round((scenario.budgetQty||0)*kit.unitCost*master.fxTHBPerUSD),
  source:kit.source,sourceQuoteLine:kit.quoteLine,
  categoryDecision:"B10_VS_C1_PHYSICAL_STOCK_OWNER_MUST_BE_SELECTED_ONCE",
  priceClass:"PART_A_VENDOR_FULL_PACKAGE_COMPARABLE__NOT_SPARE_SELL_PRICE",
  includedInWorkingSell:false,additionalCostPostedTHB:null,notionalRiskScenarioOnly:true,
  finalSpareSkuVerified:false,contractualMinimumConfirmed:false,
  originalBOM:rfiEvidenceRows,
  warnings:["A replacement spare may be only an OEM internal BDA module rather than complete WAROM assembly; rate is an upper-package comparator, NOT vendor-approved spare price.",
   "Never charge WAROM Ex d enclosure twice; full unit is priced in Part A.",
   "MR0002 Rev.C1 LNA RAD-508-001 versus selected "+site.site+" "+kit.tag+" RFI-BDA remains a technical substitution crosswalk (same original LNA position; other sites may use different TCAB suffix)."]
 })]);
 const crossCategoryDuplicates=unique(rows.map(x=>physicalFamily(x.description)).filter(Boolean)).flatMap(family=>{
  const related=rows.filter(x=>physicalFamily(x.description)===family);
  return unique(related.map(x=>x.code)).length>1?[Object.freeze({
   family,sourceIds:related.map(x=>x.id),categories:unique(related.map(x=>x.code)),
   status:related.some(x=>x.code==="B10")&&related.some(x=>x.code==="C2")?"MR_ATTACHMENT7_EXCLUDES_PRECOM_STARTUP_SPARE_LIST_ITEMS__SKU_CROSSWALK_OPEN":"POTENTIALLY_COMMON_FUNCTION_NOT_PROVEN_SAME_SKU",
   decision:related.some(x=>x.code==="B10")&&related.some(x=>x.code==="C2")?"MR0001–0004 Attachment 7 instruction 6: exclude items listed in pre-commissioning/start-up spares; confirm same OEM part before retaining any C2 item. No automatic silent removal of existing Rev08 candidate.":"Compare separately delivered stock, OEM included parts and category owner; no automatic adjustment."
  })]:[];
 });
 const critical=cover.groups.filter(x=>x.criticality==="COMMISSIONING_CRITICAL_CANDIDATE");
 const engineeringReadiness=Object.freeze({
  installedTagInstances:cover.installed.length,uniqueTagFunctionGroups:cover.groups.length,
  criticalTagFunctionGroups:critical.length,confirmedReplacementSkuGroups:0,
  minimumSpareKitsContractValidated:false,priceEvidenceReconciledToSource:true,
  finalSparePricingCalculated:false,
  b13ActivityQuantityDerived:false,majorSpareProcurementBudgetReconciled:false,
  verdict:"NOT_YET_DEMONSTRATED_FOR_ALL_FOUR_MRS",
  // Zero confirmed here means none is evidenced as confirmed in this model,
  // not that a physical vendor kit is necessarily absent in reality.
  explanation:"Rev08 reference rows priced; delivered physical spare compatibility, contractual minimum and new major-risk allowances are not yet closed."
 });
 const pricedCategorySummary=Object.fromEntries(CODES.map(code=>[code,Object.freeze({
  workingReferenceTHB:master.budgetTotalsTHB[code],
  priceStatus:code==="B11"?"BUDGETARY_CANDIDATE_NOT_IN_WORKING_SELL":"EXISTING_WORKING_BUDGET",
  lineCount:byCode[code].length,options:code.startsWith("C"),
  deltaFromDisplayedRoundedLinesTHB:round(master.budgetTotalsTHB[code]-byCode[code].reduce((n,x)=>n+x.extendedTHB,0))
 })]));
 return Object.freeze({
  moduleId:"bid.budget.working.bc.customer-spare-schedule",
  sparePriceEvidence,
  codes:CODES,rows,byCode,summary:pricedCategorySummary,riskCandidates,crossCategoryDuplicates,b11Requirements,
  currentRows,currentByCode,currentBudgetaryByCode,
  currentWorkingFxTHBPerUSD:paramFx,currentBudgetaryPricingFactor:commercialFactor,
  currentPriceAuthority:"ENGINEERING_PARAMETRIC_SCENARIO_NOT_OEM_VENDOR_QUOTE",
  installedSourceCount:cover.installed.length,engineeringReadiness,
  sourceOwnership:"MR/PTTEP requirement + Working BOM/Tag + current unquoted parametric allowance + 10.2 commercial owner; Rev08 historical audit only",
  riskQuestionAnswered:false,
  missingEngineeringProofs:["EXA-A8 applicable minimum lines by equipment","OEM spare/installed SKU replacement compatibility",
   "B10 kit-per-platform composition","B13 preservation quantity/activity consumption derivation",
   "B11 shared tools OEM-included credit and five EXA-A8 minimum requirements","C1/C2 stock ownership and 2-year repair logistics",
   "B13 activity drivers not yet established; SPQ-003 returns OPEN_INPUT while Rev08 quantity stays a controlled interim budget",
   "Repricing risk additions after management choice"],
  attachment7Control:"MR0001–0004 Rev.C1 Attachment 7 instruction 6 excludes all Pre-Commissioning / Start-up Spare Parts List items from the 2-year Operating Spare Parts List.",
  noAutomaticPricePosting:true,releaseAllowed:false
 });
}
