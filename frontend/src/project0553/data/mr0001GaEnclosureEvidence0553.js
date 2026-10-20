// Project PJ2608-0553. Read-only, source-versioned EX enclosure evidence.
// Z1F GA Sheet 13 vs BARTEC 2022 Type 1/2/3 and 2024 Prosper quote.
// Factory-drilled entries are NOT commissioned active Ex glands.
// NEVER use this adapter to post A1/Bulk price or overwrite approved Rev02/03.
export const MR0001_GA_ENCLOSURE_EVIDENCE_0553=Object.freeze({
  revisionStatus:"ENGINEERING_COMPARISON_ONLY__NO_OEM_APPROVAL_NO_COST_MUTATION",
  z1fGa:{
    source:"MM-ZTK-1F-GEN-SCADA-TEL-GA-0001_All.pdf sheet 13 of 22 (Rev00, issued for bidding 05-Sep-2026)",
    partNumber:"07-56D1-5831",family:"A7-3136 control panel assembly",sizeMm:[600,400,210],
    material:"SS316L",ip:"IP66",quantityForDrawing:1,
    entry:{bottom:10,top:0,left:0,right:0,normalTotal:10,drainSeparate:1,initialStoppingPlugs:10,initialLocknuts:10,verifiedActiveGlands:null},
    installedOptions:[{id:"POE_INJECTOR",qty:1,pn:"RPM-POE-INJ-DC"},{id:"CISCO_SWITCH",qty:1,pn:"IE3200/3300/3400-8T"},{id:"ETHERNET_SURGE",qty:1,pn:"ZB24597"},{id:"RJ45_PATCH",qty:1,pn:"FL-PP-RJ45-SC"}],
    inclusion:"BOM says TO BE SUPPLIED BY CUSTOMER AND TO BE INSTALLED BY CUSTOMER for items 1a–4a; do not include in BARTEC bare-panel rate without current written quote",
    status:"Z1F_DRAWING_CONFIGURATION__NOT_ACCEPTED_OEM_AND_HOLE_COUNT_DEVIATION_OPEN"
  },
  historicalBartec:{
    source:"21G1048t-BA-GA-100X_Z0.pdf BARTEC AS-BUILT 19-Jul-2022; GA-1001 pp.1-2, GA-1002 pp.4-5, GA-1003 pp.7-8",
    partNumber:"07-56D1-9811",sizeMm:[600,400,210],material:"SS316L",ip:"IP66",
    entry:{top:12,left:2,right:2,bottom:0,normalTotal:16,drainSeparate:1,initialStoppingPlugs:16,initialLocknuts:16},
    configurations:[
      {id:"TYPE_1",sourcePages:[1,2],radioSets:1,cisco:1,poeInjectors:1,surgeProtectors:1,rj45PatchPanels:1,phoenixUT25:6,phoenixEndCovers:1,jumperCount:2,jumperPn:"3030174",heatWatts:8.8},
      {id:"TYPE_2",sourcePages:[4,5],radioSets:2,cisco:1,poeInjectors:2,surgeProtectors:2,rj45PatchPanels:2,phoenixUT25:8,phoenixEndCovers:4,jumperCount:2,jumperPn:"3030187",heatWatts:12.2},
      {id:"TYPE_3",sourcePages:[7,8],radioSets:2,cisco:2,poeInjectors:2,surgeProtectors:2,rj45PatchPanels:2,phoenixUT25:10,phoenixEndCovers:6,jumperCount:2,jumperPn:"3030190",heatWatts:12.6}
    ],
    status:"HISTORICAL_2022_AS_BUILT_NOT_Z1F_APPROVED"
  },
  prosperity:{
    source:"Q-PROSRY-24051 Add Value Zawtika 1E_Communication.pdf pp.1-2; 12-Jul-2024 Rev0",
    item1:{quoteCode:"1",assembliesQuoted:4,unitPriceTHB:39200,partNumber:"A7-3136-4121/Bxxx",normalEntryTop:10,normalEntryBottom:0,initialStoppingPlugs:10,installation:"2024 historical ZWP16/17/18/19",customerFurnished:["REDLINE POE","CISCO SWITCH","MTL ZB24597","PHOENIX PATCH"],status:"REFERENCE_NOT_CURRENT_1F_OEM_QUOTE"},
    item2:{quoteCode:"2",assembliesQuoted:4,unitPriceTHB:38800,partNumber:"A7-3136-4121/Bxxx",normalEntryTop:10,installation:"2024 historical ZWP11/ZWP5/ZWP6/ZWQ",status:"UNSELECTED_HISTORICAL_ALTERNATIVE"},
    status:"EXPIRED_DIFFERENT_GA_ENTRY_CONFIGURATION"
  },
  requiredDtsEntries:18,
  spareRule:"SPE C2 20% or minimum two spare entries; verify interpretation against DTS 18 minimum and certified assembly",
  ratesNotComparableWithoutRequote:true,
  customerSellChanged:false
});
const ga=MR0001_GA_ENCLOSURE_EVIDENCE_0553;
const evidenceRow=(id,desc,qty,unit,pn,make,where,classification="GA_FACTORY_COMPONENT_NON_ADDITIVE")=>Object.freeze({
 id,description:desc,documentedQty:qty,unit,partNumber:pn||null,manufacturer:make||null,
 costOwner:where,classification,source:"Z1F GA-0001 sheet13; factory assembly quote and installed component inclusion need OEM confirmation",
 unitTHB:null,extendedTHB:null,technicalApproved:false
});
export const ZWP20_Z1F_GA_FACTORY_BOM_0553=Object.freeze([
 evidenceRow("ENCLOSURE","Ex eb enclosure with hinged door 600x400x210mm SS316L IP66",1,"set","07-56D1-5831","BARTEC","TCAB_ROW9"),
 evidenceRow("MOUNTING","GI mounting plate + mounting bracket + silicone gasket + M10 internal/external earth hardware",1,"lot",null,"BARTEC","TCAB_ROW9"),
 evidenceRow("FUSE_BLOCK","Fuse terminal block UT4-TG-EX",6,"ea","3046143","PHOENIX CONTACT","TCAB_ROW9"),
 evidenceRow("FUSE_2A","Fuse plug P-FU 5X20-EX with sand-filled fuse 2A",2,"ea","3036807","PHOENIX CONTACT","TCAB_ROW9"),
 evidenceRow("FUSE_4A","Fuse plug P-FU 5X20-EX with sand-filled fuse 4A",4,"ea","3036807","PHOENIX CONTACT","TCAB_ROW9"),
 evidenceRow("JUMPER","Jumper link FBS 3-6",2,"ea","3030242","PHOENIX CONTACT","TCAB_ROW9"),
 evidenceRow("END_BRACKET","CLIPFIX 35 end bracket",2,"ea","3022218","PHOENIX CONTACT","TCAB_ROW9"),
 evidenceRow("MARKER","KLM-A terminal marker",1,"ea","1004348","PHOENIX CONTACT","TCAB_ROW9"),
 evidenceRow("SUPPORT","AB/SS-EX support bracket",2,"ea","0404415","PHOENIX CONTACT","TCAB_ROW9"),
 evidenceRow("BUSBAR","NLS-CU 3/10 SN nickel copper busbar",1,"ea","402174","PHOENIX CONTACT","TCAB_ROW9"),
 evidenceRow("PE_TERMINAL","AKG 4 GNYE-EX earthing terminal block",10,"ea","421045","PHOENIX CONTACT","TCAB_ROW9"),
 evidenceRow("M20_BOTTOM","M20 drilled cable entry bottom",10,"hole",null,"BARTEC","TCAB_ROW9","ENCLOSURE_CAPACITY_NOT_PURCHASED_GLAND"),
 evidenceRow("STOPPING_PLUGS","M20 nickel-plated plugs with O-ring and locknut (combined drawing BOM row)",10,"ea","PLG1MON+DL1MON","BARTEC FEAM","TCAB_ROW9","INITIAL_FACTORY_STOPPING_PLUG_NOT_ACTIVE_GLAND"),
 evidenceRow("DRAIN_HOLE","M20 bottom entry for separate drain",1,"hole",null,"BARTEC","TCAB_ROW9","SEPARATE_DRAIN_ENTRY_NOT_CABLE_GLAND"),
 evidenceRow("DRAIN_VALVE","M20 SS316 drain valve",1,"ea","ECDE1MX","BARTEC FEAM","TCAB_ROW9"),
 evidenceRow("EX_LABELS","Thermo Ex label outside + inside",2,"ea",null,"BARTEC","TCAB_ROW9"),
 evidenceRow("ZONE_WARNING","Yellow Zone-2 Traffolyte warning label",1,"ea",null,"BARTEC","TCAB_ROW9"),
 evidenceRow("NAME_PLATE","Nameplate with stainless rivets",1,"ea",null,"BARTEC","TCAB_ROW9"),
 evidenceRow("INTERNAL_WIRING","Internal wiring no special material",1,"lot",null,"BARTEC","TCAB_ROW9"),
 evidenceRow("CUSTOMER_POE","DC-DC PoE injector",1,"ea","RPM-POE-INJ-DC","REDLINE","IDU_RADIO_PACKAGE_FIRST","CUSTOMER_SUPPLIED_INSTALL_BY_CUSTOMER_DO_NOT_INCLUDE_PANEL_RATE"),
 evidenceRow("CUSTOMER_CISCO","Industrial managed Ethernet switch",1,"ea","IE3200/3300/3400-8T","CISCO","LAN_ROW7","CUSTOMER_SUPPLIED_INSTALL_BY_CUSTOMER_DO_NOT_INCLUDE_PANEL_RATE"),
 evidenceRow("CUSTOMER_SURGE","MTL Ethernet data surge protector",1,"ea","ZB24597","EATON MTL","SA_ROW10","CUSTOMER_SUPPLIED_INSTALL_BY_CUSTOMER_DO_NOT_INCLUDE_PANEL_RATE"),
 evidenceRow("CUSTOMER_PATCH","RJ45 patch panel",1,"ea","FL-PP-RJ45-SC","PHOENIX CONTACT","DATO_ROW8_OR_FACTORY_WIRING","CUSTOMER_SUPPLIED_INSTALL_BY_CUSTOMER_DO_NOT_INCLUDE_PANEL_RATE")
]);
const requirement=(id,description,owner,proof)=>Object.freeze({id,description,owner,proof,requiredQty:null,unitPriceTHB:null,costPosted:false,approved:false});
export const ZWP20_SCADA_BULK_PHYSICAL_GAPS_0553=Object.freeze([
 requirement("EX_GLAND_INDOOR","Certified active M20 glands for actual unique external cable ends entering TCAB; deduct factory installed certified glands after reconciliation","BULK_ROW11_IF_NOT_VENDOR_FITTED","Cable-end schedule; 12mm outer + 8.6mm inner Tecnikabel; armor, gland Ex e/de IP66 matching"),
 requirement("ODU_3_4_NPT","3/4-inch NPT outdoor ODU union, Ex cable gland, 3/4-to-M20 adapters only where actual OEM GA calls for them","ODU_PACKAGE_OR_BULK_ROW11","Z1F GA sheets5,8–10 show ODU 3/4 NPT interface; do not substitute indoor M20 gland"),
 requirement("ETHERNET_FIELD","Outdoor armored CAT6A ODU Ethernet cable length, one physical drop per actual termination route","BULK_ROW11","Cable routing and all endpoint patches; booked 69m only management assumption; IEC60331 proof OPEN"),
 requirement("MCT_FIRE_SEAL","E&I Room Multi Cable Transit (MCT), sizing blocks, fire/Ex penetration seals and restoration","C1_OR_BULK_ROW11_CONDITIONAL","SPE 6.6.5; field cable OD + route penetration ownership"),
 requirement("RJ45_FIELD","Certified outdoor RJ45 plug, shielded termination, field socket/weather boot, patch lead and any Ex connector","ODU_PACKAGE_DATO_ROW8_OR_BULK","Confirm distinct connectors vs DATO and GA customer-supplied patch panel"),
 requirement("DC_FEED","External 24VDC feeder, lugs, fuses/breaker, gland and tested power termination","ELECTRICAL_BY_OTHERS_OR_BULK","Power SLD/GA/WIR/TER; 65W supply and 24VDC load current"),
 requirement("RF_CONNECTOR","RF coax/filter-to-ODU jumpers, N connectors, RF surge, grounding kit","ODU_ROW4_ANT_ROW6_OR_BULK","Z1F GA sheets3–6,8–10; check vendor included and antenna distance >5m rule"),
 requirement("SS_SUPPORT","Outdoor SS316 supports, cable clamps/cleats, UV ties and identification","C1_OR_BULK","Mezzanine route installation detail / count per physical support"),
 requirement("EARTHING_BONDS","Ground wire/bond straps, glands' armour bonding, surge and external ODU earthing","C1_OR_BULK","Field bonding terminals and cable lengths; do not duplicate GA earth busbar")
]);
export function getMR0001EnclosureGaEvidence0553(site,tag,row){
 const isZwp20=site==="ZWP20"&&tag==="TCAB-500-001"&&row===9;
 const isZwp8=site==="ZWP8"&&tag==="TCAB-500-003"&&row===46;
 if(!isZwp20&&!isZwp8)return null;
 return {site,tag,row,z1f:ga.z1fGa,historical:ga.historicalBartec,
  historicalType:ga.historicalBartec.configurations.find(x=>x.id===(isZwp8?"TYPE_2":"TYPE_1")),
  quote:ga.prosperity,
  selectedDesignState:"ENGINEERING_CANDIDATE_ONLY__REQUIRES_OEM_REQUOTE",
  factoryBom:isZwp20?ZWP20_Z1F_GA_FACTORY_BOM_0553:[],
  isZwp8,sourceEnclosureMtoQty:1,
  proposedReferenceModel:isZwp8?ga.historicalBartec.partNumber:ga.z1fGa.partNumber,
  designComparisonRequired:true,unverifiedPurchaseQty:null,
  costsAdditive:false,actualGlandQty:null,
  deviations:[
   "Z1F GA sheet 13 bottom 10 M20 vs historical 2022 16 top/left/right, Prosper 2024 item1 top 10; must choose one exact approved Z1F panel assembly",
   "DTS-0001 C1 minimum 18 cable entries is not satisfied by 10 or 16; seek documented customer approval/engineering disposition",
   "GA sheet 13 customer-supplied Cisco, PoE, surge and patch units are outside factory panel price until verified supplier inclusions",
   ...(isZwp8?["ZWP8 MR0001 has TWO radio ODU and TWO IDU scope tags but only ONE TCAB-500-003 Set; historical BARTEC Type2 with two PoE + two surge is a candidate, NOT two separate new enclosures","ZWP8 existing ZPQ PTP service remains; budgetary second radio is additional-link candidate pending NEW/REUSE confirmation"] :[])
  ]};
}
