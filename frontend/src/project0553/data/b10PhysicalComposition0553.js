// PJ2608-0553 | B10 engineering package composition derived from existing
// Part A vendor/MTO source vs B10 startup spare requirement and quote candidates.
// READ-ONLY: never promote installed unit Qty/price to B10 spare unit price.
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";
import {MR0002_WORKING_BOM_0553} from "./mr0002WorkingBom0553";
import {MR0003_SELECTED_PRICE_0553} from "./mr0003SelectedPrice0553";
import {MR0004_WORKING_BOM_0553} from "./mr0004WorkingBom0553";
import {selectSpareCustomerSchedule0553} from "./spareCustomerSchedule0553";
import {selectB10ItemizedPurchaseEvidence0553} from "./b10ItemizedPurchaseEvidence0553";
const lock=Object.freeze;
const MR=["MR-0001","MR-0002","MR-0003","MR-0004"];
const BASE="PART_A_INSTALLED_REFERENCE_NOT_B10_SPARE";
const OPTIONAL="B10_SPARE_CANDIDATE_NOT_SELECTED";
const OPEN="SPIR_COMPONENT_QTY_SKU_PRICE_OPEN";
const section={
 "MR-0001":"SCADA WiMAX Radio / IDU / Cisco L3 / RF & Power",
 "MR-0002":"RFI BDA / RF surge / feeders / Ex enclosure",
 "MR-0003":"Explosion-proof IP telephone / sounder / Ex JB",
 "MR-0004":"Marine RACON / control / protective parts"
};
const e=(id,mr,group,item,sku,qty,rate,currency,source,extra={})=>lock({
 id,mr,group,item,sku:sku||null,referenceQty:qty??null,
 referenceUnitPrice:Number.isFinite(rate)?rate:null,referenceCurrency:currency||null,
 sparePurchaseQty:null,spareUnitSellTHB:null,spareUnitSellUSD:null,
 source,sourceType:extra.sourceType||"INSTALLED_QUOTE_REFERENCE",
 owner:extra.owner||BASE,status:extra.status||"INSTALLED_REFERENCE_ONLY",
 evidence:extra.evidence||null,relatedTags:lock(extra.relatedTags||[]),
 installedQuantityMeaning:extra.installedQuantityMeaning||"Supplier quoted installed hardware, not B10 spare stock",
 nonposting:true,releaseAllowed:false,
 parentSourceId:"B10-PTTEP-"+String(MR.indexOf(mr)+1).padStart(2,"0"),
 ...extra
});
const nextGLine=code=>{const q=NEXTG.lines.find(x=>x.code===code);
 if(!q)throw Error("NextG equipment evidence source missing "+code);
 return q;};
function nextGEntry(code,group,display,status=BASE){
 const q=nextGLine(code),mr="MR-0001",spare=["D","E"].includes(q.group);
 return e("B10-COMP-NG-"+code,mr,group,display||q.description,q.partNumber,q.qty,q.unitPrice,"USD",
  NEXTG.quoteNumber+" / "+code,{
  sourceType:spare?"NEXTG_OPTIONAL_SPARE_QUOTE_EXPIRED":"NEXTG_INSTALLED_OFFER_EXPIRED",
  owner:spare?OPTIONAL:BASE,status:spare?"OFFERED_SPARE_OPTION_NOT_APPROVED_B10":"INSTALLED_CONFIGURATION_OEM_OPEN",
  evidence:"NG/260916-ADV-DAP1 expired 2026-10-01; quote Qty not confirmed purchase or spare Qty",
  installedQuantityMeaning:spare?"Optional quote Qty, not approved B10 spare Qty":"Original installed quote Qty, site allocation not approved"
 });
}
export function selectB10PhysicalComposition0553(){
 const schedule=selectSpareCustomerSchedule0553();
 const purchase=selectB10ItemizedPurchaseEvidence0553();
 const owners=schedule.currentByCode.B10;
 if(owners.length!==4||owners.reduce((s,r)=>s+r.qty,0)!==14||
 owners.reduce((s,r)=>s+r.extendedTHB,0)!==509827.50)throw Error("B10 canonical 14-kit price owner changed");
 const cisco=SUPPLIER_QUOTE_LINES_0553.find(q=>q.id==="VST-0048-RE1");
 const vc=code=>{const a=cisco?.lines.find(x=>x[0]===code);
  if(!a)throw Error("VST Cisco installed quote missing "+code);return a;};
 const ciscoLines=["1.0","1.1","1.6.1"].map(code=>{
  const a=vc(code);return e("B10-COMP-VST-"+code,"MR-0001","SCADA NETWORK / POWER",a[2],a[1],a[3],a[4],"THB",
   cisco.quotation+" / "+code,{sourceType:"CISCO_INSTALLED_QUOTE_EXPIRED",
    evidence:"MTO Rev04 LAN-502/TC0001; 5 VST quoted quantities include ZWP8; current technical acceptance OPEN",
    status:"INSTALLED_CISCO_BUNDLE_NOT_INDIVIDUAL_B10_SPARE",
    relatedTags:MR0001_WORKING_PRICED_BOM.items.filter(x=>x.bomType==="L3_SWITCH_CISCO_BUNDLE_CANDIDATE").map(x=>x.site+" / "+x.sourceTag)});
 });
 const mr1=[
  nextGEntry("A-1","SCADA RADIO / BASE ODU","WiMAX RDL3000 Base Station ODU"),
  nextGEntry("B-1","SCADA RADIO / REMOTE ODU","WiMAX Connect-OW remote ODU (group B)"),
  nextGEntry("C-1","SCADA RADIO / REMOTE ODU","WiMAX Connect-OW remote ODU (group C)"),
  e("B10-COMP-MR1-IDU","MR-0001","SCADA INDOOR UNIT","IDU indoor PoE/RF power/interface and Ex-rated housing",null,null,null,null,
   "BOD0001 Rev.C2 indoor IDU; SPE0001 Rev.C2 radio §6; MTO Rev04 MR-502-*A",{
   owner:OPEN,sourceType:"CUSTOMER_BOD_SPE_REQUIREMENT",
   evidence:"Supplier PoE components do not establish a complete independent IDU OEM part number",
   status:"IDU_COMPLETE_FUNCTION_SKU_UNPROVEN"}),
  ...ciscoLines,
  nextGEntry("D-1","OPTIONAL MAJOR RADIO STOCK","Quoted extra base-station radio assembly",OPTIONAL),
  nextGEntry("E-1","OPTIONAL MAJOR RADIO STOCK","Quoted extra remote-station radio assembly",OPTIONAL),
  ...["D-2","D-5","D-6","E-2","E-5","E-6"].map(code=>nextGEntry(code,"OPTIONAL RF / POWER SPARE",null,OPTIONAL))
 ];
 // Selected MGW UHF1 is an installed three-site package including WAROM.
 const mr2=[
  e("B10-COMP-MGW-UHF1","MR-0002","TRUNK RADIO / BDA","RFI BD4345-00N0-AC with WAROM HRMD95-VIIIB Ex enclosure (package)", "BD4345-00N0-AC + HRMD95-VIIIB",3,31474,"USD",
   "MGW P26-058_R2 / UHF-1",{evidence:"Three site installed RFI BDA packages; Ex assembly approval and spare components outstanding"}),
  e("B10-COMP-MGW-UHF2","MR-0002","RF SURGE / INTERFACE","PolyPhaser RF surge in MGW quoted UHF-2", "IS-B50LN-C2",3,null,"USD",
   "MGW P26-058_R2 / UHF-2",{evidence:"Installed with antenna assembly; no separate supplier B10 spare unit rate",status:"INCLUDED_IN_INSTALLED_RF_PACKAGE__NOT_SPARE_QUOTE"})
 ];
 const mr3=[
  e("B10-COMP-EXION-PHONE","MR-0003","EX TELEPHONE","GAI-TRONICS Ex SIP Telephone",MR0003_SELECTED_PRICE_0553.phoneSku,4,MR0003_SELECTED_PRICE_0553.phoneTHB,"THB",
   MR0003_SELECTED_PRICE_0553.quoteExion,{evidence:"EXION installed quote; actual B10 serviceable handset/phone SKU and Qty remain OPEN"}),
  e("B10-COMP-EXION-SOUNDER","MR-0003","EX SOUNDER","Eaton DB3B Ex sounder",MR0003_SELECTED_PRICE_0553.sounderSku,4,MR0003_SELECTED_PRICE_0553.sounderTHB,"THB",
   MR0003_SELECTED_PRICE_0553.quoteExion,{evidence:"EXION source model differs from selected MGW offer suffix; not an independently priced spare"}),
  e("B10-COMP-EX-JB","MR-0003","EX JB / GLANDS","Telephone Ex Junction Box and spare gland/entry components",null,null,null,"THB",
   "MR0003 Rev.C1 / SPE0001 / GA-1004 layout",{
   owner:OPEN,sourceType:"CUSTOMER_MR_SCOPE_REFERENCE",
   status:"EX_CERTIFIED_JB_GLAND_CONFIGURATION_UNPROVEN",evidence:"Historical 4-entry JB comparable does not price current GA-1004 eight-entry configuration"})
 ];
 const mr4=[
  e("B10-COMP-RACON-SYSTEM","MR-0004","MARINE RACON SYSTEM","SeaBeacon-2 System 6 Ex X/S-band complete installed RACON (024439)",
   "SeaBeacon-2 System 6 Ex (024439)",1,75000,"USD",MR0004_WORKING_BOM_0553.quoteNumber,{
   evidence:"One installed-unit FCA supplier quotation extrapolated in Part A to three locations, NOT one B10 spare",
   status:"ONE_SYSTEM_INSTALLATION_QUOTE__THREE_SITE_BUDGET_EXTRAPOLATION"})
 ];
 const sourceInstalled=lock([...mr1,...mr2,...mr3,...mr4]);
 const requirementFamilies=lock(purchase.requirementArticleRows.map(x=>e(x.id,x.mr,"REQUIRED COMMISSIONING SPARE ARTICLE",x.articleFunction,null,null,null,null,
   x.sourceMrRequirement||x.sourceOriginalPhrase,{
   owner:OPEN,sourceType:"MR_ATTACHMENT5_FUNCTIONAL_REQUIREMENT",
   evidence:x.inclusionGate,status:"OEM_SPIR_SKU_QTY_RATE_NOT_ESTABLISHED",
   parentSourceId:x.parentB10PriceId,relatedTags:x.actualInstalledTagCandidates,
   installedQuantityMeaning:"B10 spare article function only; physical stock quantity undetermined"
 })));
 const parentRows=lock(owners.map(x=>lock({sourceId:x.id,traceId:x.traceId,sourceRowModuleId:x.sourceRowModuleId,
  mr:x.linkedMR[0],sites:x.linkedLocations,kitQty:x.qty,workingSellTHB:x.extendedTHB})));
 if(new Set([...sourceInstalled,...requirementFamilies].map(x=>x.id)).size!==sourceInstalled.length+requirementFamilies.length)
  throw Error("B10 composition source identity collision");
 if(!sourceInstalled.some(x=>x.group.includes("ODU"))||!sourceInstalled.some(x=>x.item.startsWith("IDU"))||
  !sourceInstalled.some(x=>x.sku==="IE-3400-8P2S-E"))
  throw Error("Required ODU/IDU/Cisco Part A composition evidence missing");
 return lock({moduleId:"bid.budget.working.bc.b10.physical-composition",
  sourceModuleId:schedule.moduleId,sourceDocs:lock([
   "BOD0001 Rev.C2 §SCADA and §11.1","SPE0001 Rev.C2 §6 and §8.1",
   "MR0001–0004 Rev.C1 §5 / Attachment 2 / Attachment 5 / Attachment 7",
   "EXA-A8 Attachment 1 (verify cited MMC23-5025 vs accessible MMC25-5001 edition)",
   "4-Scope of Supply.xlsx / B10 CommSpares (original 13 empty physical article rows)"
  ]),
  parentRows,installedComponents:sourceInstalled,requiredSpareFamilies:requirementFamilies,
  deliveredCommissioningKits:14,originalWorkingSellTHB:509827.5,
  procurementSkuApprovedCount:0,approvedB10SpareStockQtyCount:0,additionalPostingAllowed:false,
  allSpareSkuRatesVerified:false,sourceToReleaseParentIds:parentRows.map(x=>x.sourceId),
  quoteExpiryNote:"NextG 01-Oct-2026; VST 30-Sep-2026 expired; installed-quote component prices NOT B10 spare rates",
  note:"ODU/IDU/Cisco L3/RF/Power are installed-system composition drivers. MR requires itemized commissioning spare lists; no documentary proof of one ODU/IDU/Cisco spare each. Do not multiply by platform kits or count in C2 again."
 });
}
