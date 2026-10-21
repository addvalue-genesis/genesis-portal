// PJ2608-0553 BULK engineering evidence register for 10.1.1.2 / 10.1.1.3.
// Read only: never re-post A5, MGW included accessories, alternative vendors or price candidates.
import {deriveMGWSelectedWpSystemBulk0553} from "./mgwR2SelectedFieldBulk0553";
import {deriveScadaBulkVerification0553} from "./scadaBulkQuantityVerification0553";
import {deriveA5BulkAttribution0553} from "./a5BulkAttribution0553";
import {deriveRaconTerminationBudget0553} from "./raconTerminationBudget0553";
import {MGW_P26_058_R2_SELECTED_0553 as MGW} from "./mgwP26058R2Selected0553";

export const BULK_MR_SITE_ORDER_0553=Object.freeze(["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"]);
export const BULK_MR_LIST_0553=Object.freeze(["MR-0001","MR-0002","MR-0003","MR-0004"]);
const scadaRow=Object.freeze({ZWP20:11,ZWP21:20,ZWP22:29,ZWP23:36,ZPQ:41,ZWP8:47,ZWP11:52});
const sources=Object.freeze({
 historical:"ATT6-Price Schedule for Equipments TEL--20260122 Rev.02 SAMART (historical comparator; not a Z1F procurement approval)",
 innova:"https://drive.google.com/file/d/1I4LhJY-heANsoV21uWMO6kUVioeokMUS/view",
 nextg:"https://drive.google.com/file/d/1dwU6mkjm0JOKvbw3fMeCH8alQtKufEyd/view",
 mgw:MGW.source,
 bartec:"https://drive.google.com/file/d/1Wai_2lQiiRVNiUkg27bVNmBlOgCJFeX4/view",
 racon:"https://drive.google.com/file/d/1T3c0Cbh2Sw134ddTibe8QEXt1nW_UpXM/view",
 orga:"https://drive.google.com/file/d/1JRZ-Ex0gHg120fwpbfmYJEuhTzU4EJva/view"
});
const make=(id,item,state,owner,source,detail="",qty=null,unit="to derive",rateTHB=null,category="FIELD_BULK")=>({
 id,item,state,owner,source,detail,qty,unit,rateTHB,category,
 bookedIncrementalTHB:0,approvedProcurement:false
});
const review=(id,item,owner,source,detail="",qty=null,unit="to derive")=>
 make(id,item,"SCOPE_REVIEW",owner,source,detail,qty,unit);
const field=(id,item,owner,source,detail="",qty=null,unit="to derive",rate=null)=>
 make(id,item,qty===null?"NEEDS_QUANTITY":rate===null?"NEEDS_RATE":"SCOPE_REVIEW",owner,source,detail,qty,unit,rate);
const included=(id,item,owner,source,detail="",qty=null,unit="included")=>
 make(id,item,"VENDOR_INCLUDED",owner,source,detail,qty,unit,null,"PACKAGE_INCLUDED");
const scadaAdditions=[
 ["MCT-PENETRATION","E&I room outdoor-to-indoor MCT / penetration sealing","BULK_OR_CONSTRUCTION_C1","Confirm penetration type and tray routing from ELE-LAY-0002; do not include under CAT6A meter rate"],
 ["POWER-TERMINALS","Panel DC feeder and externally installed protection/termination","ELECTRICAL_OR_FIELD_BULK","Verify supply SLD, fuse/MCB and vendor-fitted DIN-rail/terminal allocations"],
 ["FIBER-SFP","SFP / fibre / PLC / router network physical interfaces","LAN_DATO_OR_BULK","Count only distinct copper/fibre cables proven by BLD/WIR/TER; do not count logical links"],
 ["SS316-FIXINGS","SS316 cable cleats / ties / tray fasteners","FIELD_SUPPORT_C1_OR_BULK","Count according to actual route/support spacing and remove supplier included fixings"],
 ["TAG-PLATES","Equipment nameplates, cable tags and ferrules","FIELD_IDENTIFICATION_OR_ASSEMBLY","Old SAMART/INNOVA reference; package-fitted TCAB tags are not a second purchase"]
];
function scadaItems(site,bulkAudit,a5Row){
 const row=scadaRow[site];
 const rows=bulkAudit?.rows||[];
 const base=rows.map(x=>{
  const isFloor=["ODU_CAT6A","PANEL_M20"].includes(x.id);
  const isOther=["CABLE_TEST","START_SPARES"].includes(x.id);
  const qty=isFloor?(x.id==="ODU_CAT6A"?69:1):(x.derivedQty??null);
  const rate=isFloor?(x.id==="ODU_CAT6A"?524:1020):(x.unitRateTHB??null);
  const status=isOther?"OTHER_WBS":isFloor?"BOOKED_PARTIAL":x.decision==="VENDOR_INCLUDED_FIRST_CHECK"?"SCOPE_REVIEW":qty===null?"NEEDS_QUANTITY":"NEEDS_RATE";
  const owner=isFloor?"MR0001_BULK_SOURCE_ROW_"+row+"__A5_RECLASSIFICATION":x.id==="CABLE_TEST"?"PRECOM_SERVICE_NOT_FIELD_MATERIAL":x.id==="START_SPARES"?"STARTUP_SPARES_NOT_INSTALL_MATERIAL":x.owner||x.budgetBucket||"FIELD_BULK";
  return {...make(x.id,x.item,status,owner,isFloor?sources.innova:sources.historical,
   (x.basis||"")+"; "+(x.caveat||"")+"; "+(isFloor?"Original source Qty is a budgetary floor only, not an AFC measured route/active gland count; already booked.":"Check current OEM pack before purchase."),
   qty,x.unit||"set",rate,isOther?"OTHER_WBS":isFloor?"A5_BOOKED":"ENGINEERING_FIELD_CANDIDATE"),
   sourceMtoRow:row,derivedCandidateQty:x.derivedQty??null,
   existingBookedTHB:isFloor?qty*rate:null};
 });
 const extra=scadaAdditions.map(([id,item,owner,note])=>field(id,item,owner,
  sources.historical+"; MR0001 BLD/LAY/SPE",note));
 const total=a5Row?.workingCostTHB??null;
 return {items:[...base,...extra],bookedA5THB:total,sourceMtoRow:row};
}
const mgwIncluded=(id,description,lineId,detail,qty=null,unit="included")=>{
 const quote=MGW.lines.find(x=>x.id===lineId);
 return included(id,description,"MGW_R2_"+lineId+"_PACKAGE",sources.mgw,
  "Selected "+MGW.quoteNumber+" / "+lineId+"; "+detail+
  ". Existing USD "+(quote?.unitPriceUSD??"NOT QUOTED")+" per package is NOT an additional accessory rate.",
  qty,unit);
};
function dmrItems(){
 return [
  mgwIncluded("BDA-WAROM","RFI BD4345-00N0-AC BDA / WAROM HRMD95-VIIIB Ex d housing","UHF-1","Assembly Ex certification, RF penetrations, thermal and AC/DC compatibility pending",1,"set"),
  mgwIncluded("YAGI-EX-RF","RFI Yagi / UNV2 clamp / PolyPhaser IS-B50LN-C2 / Solexy RXNMS0200JX0","UHF-2","Full combined Rev2 selected, not older UHF-only Rev2; PolyPhaser and Solexy bundled",1,"set"),
  mgwIncluded("OMNI","KBT TQJ-400AD5 omni antenna","UHF-3","N-female mating connection to be confirmed",1,"set"),
  mgwIncluded("FEEDER-KIT","FORLLER 1/2-inch RF low loss feeder 100 m per quoted site kit","UHF-4","Cable included, actual installation route and suitable cable type/length require proof",100,"m"),
  mgwIncluded("FEEDER-CONNECTORS","Six 1/2-inch 50-ohm male RF feeder connectors per site kit","UHF-4","Do not reprice the six included fittings",6,"ea"),
  review("BDA-RF-PORTS","Certified Ex d RF bulkheads / feedthrough / 2-port donor and service paths","MGW_UHF1_OEM_ASSEMBLY_FIRST",sources.mgw,"Ex d assembly approval and antenna-side interface cannot be assumed included from plain BDA line"),
  field("BDA-POWER-CABLE","Field DC power feeder, protective device and terminals","FIELD_POWER_OR_ELECTRICAL","MR0002 DTS / MGW R2","Redesign for selected BDA; do not reuse superseded MOT LNA 11–28V assumption"),
  field("BDA-ALARM-CABLE","Alarm and remote supervision control cable","FIELD_CONTROL_BULK","MR0002 DTS / WIR/TER","Confirm BDA actual alarm outputs and monitor connections"),
  field("BDA-EX-GLANDS","Ex-rated cable glands / adaptors / stopping plugs NET of WAROM supplied","FIELD_BULK_NET_OF_MGW_UHF1",sources.mgw,"Count distinct active cable ends by OD/armour and Ex certificate; N-type feedthroughs are separate"),
  field("BDA-GROUND","External RF earth grounding kit / bonding, lugs and clamps","FIELD_RF_EARTH",sources.historical,"Verify RF feeder grounding per route and surge earthing"),
  field("BDA-CABLE-PROTECTION","UV/SS316 cable ties, support clamps, weatherproofing / self-amalgamating tape","FIELD_INSTALLATION_BULK",sources.historical,"Confirm installed path/spacing and OEM included supports"),
  field("BDA-RF-EXTENSION","Net additional RF feeder, jumpers or mating adapters beyond MGW UHF-4","FIELD_RF_BULK_NET_VENDOR",sources.mgw,"Do not buy 100m/6 connectors again; validate RF loss and physical interfaces"),
  field("BDA-TAGS","Cable labels, stainless tagplates and ferrules","FIELD_IDENTIFICATION",sources.historical,"Only field items not included by MGW / assembly")
 ];
}
function phoneItems(){
 return [
  mgwIncluded("PHONE-SET","Gai-Tronics Auteldac 6 / EATON DB3B horn / WAROM BXJ-S JB","PHONE-1","Four complete quoted sets across ZWP20–23; do not separately buy EXION/PROSPER alternatives",1,"set"),
  mgwIncluded("PHONE-GLAND-CREDIT","WAROM BXJ-S supplied Ex-P SS316L gland","PHONE-1","Supplier says c/w gland, exact installed number/type remains to be confirmed",null,"included (qty open)"),
  field("PHONE-VOIP-CABLE","Ex VoIP SIP/PoE telephone to JB field cable and connector","MR0003_FIELD_CABLE","MR0003 DTS / BLD / WIR/TER","Check Ethernet/PoE DC topology, armour, IEC 60331 and actual physical route"),
  field("PHONE-SOUNDER-CABLE","EATON horn sounder power/trigger control cable","MR0003_FIELD_CONTROL","MR0003 DTS / EATON DB3B datasheet","Sounder cable is not CAT6A by default; verify selected DC voltage and terminal configuration"),
  field("PHONE-UPLINK","JB to E&I/telecom SIP-PABX uplink and separate supply if needed","MR0003_FIELD_NETWORK_POWER","MR0003 BLD / WIR/TER","Count actual individual Ethernet/DC/control circuits; 3 schematic functions do not equal 3 equal cable lengths"),
  field("PHONE-EX-GLANDS","Additional certified active Ex cable glands/net external entries","MR0003_FIELD_GLAND_NET_WAROM",sources.mgw,"Vendor JB+fitted gland included; cable ends and OD/armour/Ex type must govern purchase"),
  review("PHONE-JB-TERMINATION","JB Phoenix/terminal blocks, fitted plugs, drain, earth terminals","PHONE1_PACKAGE_FIRST",sources.mgw,
   "Old BARTEC GA 8×M20 and Prosper 4×M20 are alternative configurations, not selected MGW WAROM components"),
  field("PHONE-MCT","Ex field MCT / conduit / junction-to-room penetration","MR0003_FIELD_BULK","MR0003 SPE / LAY / ELE-LAY","Confirm segregated route/penetrations and installation owner"),
  field("PHONE-BONDING","External earth, stainless fixing, cable support, tags and ferrules","MR0003_FIELD_SUPPORT",sources.historical,"Subtract factory-provided supports, earth studs and labels")
 ];
}
function raconItems(site,routes){
 const route=routes.find(x=>x.wp===site);
 return [
  mgwIncluded("RACON-SET","Tideland SeaBeacon 2 System 6 X/S marine RACON","RACON-1","Three quoted sets across ZWP20–22",1,"set"),
  mgwIncluded("RACON-DB5P","DB-5P Ex d junction/distribution box listed in MGW package","RACON-1","Not a second separately posted enclosure",1,"set"),
  review("RACON-EX-CONTROL","Separate RACON Ex control box / TCAB-514-002","RACON_VENDOR_CLARIFICATION",sources.mgw,
   "Not explicit in MGW combined Rev2; ORGA alternate includes, but not transferrable as MGW credit"),
  review("RACON-PURGE-PROGRAM","Purge kit and USB communication/programming cable","RACON_VENDOR_CLARIFICATION",sources.mgw,
   "ORGA alternate includes these; MGW Rev2 line does not state inclusions"),
  ...(route?.rows||[]).map(x=>field("RACON-"+x.id,x.from+" → "+x.to+" / "+x.kind,
    "RACON_FIELD_CABLE_NET_MGW",sources.racon+"; "+sources.mgw,
    "Gross cable procurement is preliminary routing assumption, NOT measured; ORGA 5+5+10m cable credit is not applicable to MGW.",x.procurementM,"m")),
  field("RACON-GLANDS","Ex certified field cable glands / adapters / blank plugs","RACON_FIELD_EX_ENTRIES",sources.mgw,
   "MGW Rev2 does not commit 6 CMP glands unlike ORGA alternate; count terminations/Ex/cable OD"),
  field("RACON-EARTH","External earthing / bonding, marine SS fixing and supports","RACON_FIELD_SUPPORT","MR0004 SPE / LAY / "+sources.racon,
   "Verify actual rooftop mounting, earth points and tray attachment"),
  field("RACON-TAGS","External cables tags, ferrules and identification labels","RACON_FIELD_IDENTIFICATION",sources.historical,
   "Only field labels not fitted in MGW OEM package"),
  field("RACON-MCT","Cable tray / MCT and power/ICSS wall penetrations","RACON_FIELD_INSTALLATION","MR0004 SPE / WIR/TER",
   "Check purchaser/E&I boundary and field installation route")
 ];
}
const summarize=(items)=>({
 lines:items.length,missingQty:items.filter(x=>x.state==="NEEDS_QUANTITY").length,
 missingRate:items.filter(x=>x.state==="NEEDS_RATE").length,
 scopeReview:items.filter(x=>x.state==="SCOPE_REVIEW").length,
 vendorIncluded:items.filter(x=>x.state==="VENDOR_INCLUDED").length,
 bookedFloor:items.filter(x=>x.state==="BOOKED_PARTIAL").length
});
export function deriveBulkMrLocationCoverage0553(){
 const existing=deriveMGWSelectedWpSystemBulk0553();
 const scada=deriveScadaBulkVerification0553();
 const a5=deriveA5BulkAttribution0553();
 const racon=deriveRaconTerminationBudget0553();
 const sites=BULK_MR_SITE_ORDER_0553.map(site=>{
  const byMr=BULK_MR_LIST_0553.map(mr=>{
   const isActive=mr==="MR-0001"||MGW.sitesByMR[mr]?.includes(site)===true;
   let result={items:[],sourceMtoRow:null,bookedA5THB:null};
   if(mr==="MR-0001") result=scadaItems(site,scada.find(x=>x.site===site),a5.rows.find(x=>x.site===site));
   else if(isActive&&mr==="MR-0002") result={...result,items:dmrItems()};
   else if(isActive&&mr==="MR-0003") result={...result,items:phoneItems()};
   else if(isActive&&mr==="MR-0004") result={...result,items:raconItems(site,racon)};
   const sourceSystem=existing.find(x=>x.wp===site)?.systems.find(x=>({
    "MR-0001":"SCADA_RADIO","MR-0002":"DTRS_TRUNK_RADIO",
    "MR-0003":"EX_IP_PHONE","MR-0004":"MARINE_RACON"
   })[mr]===x.id);
   return {site,mr,active:isActive,items:result.items.map(x=>({...x,site,mr,
    sourceMtoRow:result.sourceMtoRow,
    moduleId:"bid.budget.bom."+site.toLowerCase()+"."+mr.toLowerCase().replace("-","")+".bulk."+x.id.toLowerCase().replace(/[^a-z0-9-]/g,"-")
   })),sourceMtoRow:result.sourceMtoRow,
   moduleId:mr==="MR-0001"?"bid.budget.bom."+site.toLowerCase()+".bulk-material."+result.sourceMtoRow:
    "bid.budget.bom."+site.toLowerCase()+"."+mr.toLowerCase().replace("-","")+".bulk-material",
   bookedA5THB:result.bookedA5THB,
   selectedPackage:mr==="MR-0001"?"SCADA MTO source Bulk 1 Lot / A5 (partial)":isActive?MGW.quoteNumber:"NOT APPLICABLE / SCOPE CHECK",
   originalProjectionCount:sourceSystem?.items?.length??0,
   ...summarize(result.items)};
  });
  return {site,byMr};
 });
 const flat=sites.flatMap(x=>x.byMr);
 return {projectId:"PJ2608-0553",moduleId:"bid.budget.bom.system-location-mto.bulk-material",
  sites,groups:flat,source:sources,selectedVendorAuthority:MGW.id,
  originalA5BookedTHB:a5.a5PriceTHB,postAdditionalTHB:0,
  customerReleased:false,costMutationAllowed:false,
  rules:["Use actual MR–Location scope, not 28 automatic new purchases",
   "Legacy SAMART/ORGA/EXION evidence is a comparison, not selected Z1F vendor authority",
   "Never double count A5 booked source, MGW inclusions, or factory-installed components",
   "Unknown cable-end quantity/route/rate is NULL, never zero",
   "MR0001 seven MTO Bulk rows retain independent source ID and partial cost owner"]};
}
export const selectBulkMrLocationCoverage0553=({mr="ALL",site="ALL",state="ALL"}={})=>{
 const m=deriveBulkMrLocationCoverage0553();
 return {...m,groups:m.groups.filter(g=>(mr==="ALL"||g.mr===mr)&&(site==="ALL"||g.site===site))
  .map(g=>({...g,visibleItems:g.items.filter(i=>state==="ALL"||i.state===state)}))};
};
