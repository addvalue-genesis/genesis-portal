import {deriveRaconTerminationBudget0553} from "./raconTerminationBudget0553";
import {APPROVED_0553_BUDGET_BASIS,approvedCablePurchaseM} from "./approvedBudgetBasis0553";
import {RACON_VENDOR_SCOPE_0553} from "./raconVendorScope0553";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {deriveZ1FTelBulkRoutes0553} from "./z1fParametricBulkRoutes0553";
import {DTRS_RFI_BULK_0553} from "./dtrsRfiBulk0553";
import {MR0001_SITE_CLASSIFICATION} from "./mr0001SiteClassification";

// Working budget allocation; not a final measured cable schedule or customer priced BOM.
// A priced row requires a compatible unit rate. Enclosure and specialist equipment costs
// remain with their existing MTO owners and must not be added to this Bulk view twice.
export function deriveWpSystemBulkBudget0553(){
 const routeModel=deriveZ1FTelBulkRoutes0553();
 const newSites=Z1F_TEL_LAYOUT_INDEX_0553.byWP.map(w=>{
  const found=(sys)=>w.equipment.filter(e=>e.system===sys);
  const cableRoute=(sys)=>routeModel.rows.find(r=>r.wp===w.wp&&r.system===sys);
  const systems=[
   {id:"SCADA_RADIO",name:"SCADA Radio",equipment:found("SCADA_RADIO"),route:cableRoute("SCADA_RADIO"),
    items:[{id:"SCADA-RJ45-WEIDMULLER",item:"Weidmuller IE-PS-RJ45-FH-BK RJ45 plug-in connector",unit:"pcs",qty:w.wp==="ZWP20"?1:null,rateTHB:1176.68,source:"RS Thailand online indicative 741-7317, MPN 1963600000, THB1176.68 ex VAT; INNOVA QA24-0604 N/A",owner:"DATO_ROW8_INCLUDED_IN_BUDGET__NOT_ADDITIVE",status:"RS_RETAIL_BUDGET_RATE__DATO_ROW8_OWNER",note:"ZWP20 DATO Row8 owns and costs this connector (THB1176.68); this bulk drilldown mirrors it and must NOT be added to bulk scenario total. Reconcile actual terminated Ethernet ports and vendor inclusion for other WPs; not an extra Row11 cost."},{id:"SCADA-RF-JUMPER",item:"ODU to antenna RF jumper",unit:"set",qty:found("SCADA_RADIO").filter(e=>/^MR-502-/.test(e.tag)).length||null,rateTHB:null,source:"Z1F layout ODU tags; Next G B-5 package check",owner:"ODU_ROW4_PACKAGE_FIRST",status:"ONE_PER_ODU_PROVISIONAL_INCLUDED_KIT_CHECK",note:"Count one per ODU provisionally; verify physical RF port count. If included in ODU kit do not charge twice."},{id:"SCADA-CAT6A",item:"Outdoor CAT6A S/FTP",unit:"m",qty:cableRoute("SCADA_RADIO")?approvedCablePurchaseM(APPROVED_0553_BUDGET_BASIS.greenfield.baseRouteM):null,
     rateTHB:524,source:"INNOVA QA24-0604, historical; scenario base",owner:"BULK_ROW11",
     status:w.wp==="ZWP20"?"MIRROR_ZWP20_ROW11_69M":"APPROVED_60M_PLUS_15PCT_BUDGETARY",
     note:w.wp==="ZWP20"?"Active ZWP20 Row 11 owns 69m (60m + 15pct): this row mirrors cost, do not add twice.":"60m budget base + 15pct purchasing allowance = 69m per evidenced physical field-to-TC-room run"}]},
   {id:"EX_IP_PHONE",name:"EX IP Phone",equipment:found("EX_IP_PHONE"),
    route:null,items:[
     {id:"EX-PHONE-JB",item:"Dedicated certified Ex e Telephone Junction Box assembly, terminals, earth studs, bracket, labels and blanking plugs",unit:"set",qty:null,rateTHB:24500,
      source:"Prosper Q-PROSRY-24051 Rev0 2024-07-12 item3 Exe JB for Telephone 300x300x160, THB24500/set; historical Zawtika 1E only",
      owner:"EX_PHONE_JB_ASSEMBLY",status:"HISTORICAL_UNIT_RATE_VERIFIED__QUANTITY_BY_PHONE_LOCATION",
      note:"Historical 300x300x160 Ex e JB has 4 M20 stopping plugs and patch panels customer free-issued. Alternative item4 200x200x120 telephone terminal box with relay is THB22000/set, NOT same specification. Do not multiply original 4 quoted units into Z1F."},
     {id:"EX-PHONE-JB-ENTRIES",item:"Certified glands, stopping plugs and interface accessories for telephone JB",unit:"entry",qty:null,rateTHB:null,
      source:"BARTEC telephone JB historical GA and IEC/EN 60079-14 installation requirement",owner:"EX_PHONE_JB_ASSEMBLY_OR_EXTERNAL_BULK",
      status:"DEDUCT_VENDOR_INCLUDED_FITTINGS",note:"Count cable entries by incoming/outgoing telephone and sounder circuits; never multiply historical blanking plug count"},
     {id:"EX-PHONE-CABLE",item:"Telephone voice/data/PoE and associated sounder wiring by selected phone DTS",unit:"route",qty:null,
      rateTHB:null,source:"Z1F MR0003 MTO, telephone DTS, BLD and LAY location/endpoint",owner:"PHONE_FIELD_BULK",
      status:"ENDPOINT_CABLE_TYPE_NOT_EVIDENCED",note:"LSE-504-001 is EX Sounder, NOT an IP Phone; verify actual phone/JB tag and cabling first"}]},
   {id:"DTRS_TRUNK_RADIO",name:"DTRS / Trunk Radio",equipment:found("DTRS_TRUNK_RADIO"),route:cableRoute("DTRS_TRUNK_RADIO"),
    items:(DTRS_RFI_BULK_0553.byWP.find(x=>x.wp===w.wp)?.functions||[]).map((v,i)=>({
     id:"DTRS-"+i,item:v.fn,unit:v.unit,qty:v.qty,rateTHB:null,source:v.source,owner:v.tag,
     status:"MOT_RFI_LNA_INTERFACE__NO_MATCHED_RATE",note:"RFI LNA 380-520MHz; 50 ohm SMA(F). Feeder requires RF attenuation and proper topology"}))},
   {id:"MARINE_RACON",name:"Marine RACON",equipment:found("MARINE_RACON"),route:cableRoute("MARINE_RACON"),
    items:(raconBudget.find(x=>x.wp===w.wp)?.rows||[]).map(v=>({
     id:"RACON-"+v.id,item:v.from+" to "+v.to+" / "+v.kind,unit:"m",qty:v.additionalPurchaseM,
     rateTHB:null,source:"ORGA QTORG2609244 p4 included 5m/5m/10m and CMP glands; Tideland 070.1016-DWG p3",
     owner:"FIELD_RACON_BULK_NET_OF_VENDOR_INCLUSION",
     status:"REPLACEMENT_SCENARIO__RATE_PENDING",
     note:"Gross "+v.procurementM+"m; ORGA cut length "+v.vendorIncludedM+"m; shortfall "+v.extensionShortfallM+"m; full-run replacement "+v.replacementFullRunM+"m. No field splice presumed."
    }))}
  ];
  return {wp:w.wp,systems:systems.map(sys=>({...sys,items:sys.items.map(it=>({
   ...it,extendedTHB:it.owner==="DATO_ROW8_INCLUDED_IN_BUDGET__NOT_ADDITIVE"?null:Number.isFinite(it.qty)&&Number.isFinite(it.rateTHB)?Math.round(it.qty*it.rateTHB*100)/100:null
  }))})),source:"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 AFC",raconPackage:RACON_VENDOR_SCOPE_0553,
   warning:"ZWP20 SCADA cable mirrors active Row11 (69m), never add twice. Other WP cable costs are new planning projections, not included in existing allocated location cost."};
 });
 const brownfieldSites=["ZPQ","ZWP8","ZWP11"].map(wp=>({
  wp,siteClass:"BROWNFIELD",
  systems:["SCADA_RADIO","EX_IP_PHONE","DTRS_TRUNK_RADIO","MARINE_RACON"].map(id=>({
   id,name:id.replaceAll("_"," "),equipment:[],route:null,
   items:[{id:id+"-BF-SURVEY",item:"Existing/new/reuse tie-in and cable interface survey",unit:"interface",
     qty:null,rateTHB:null,extendedTHB:null,source:"BLD-0001 Rev.C1 + MR0001 MTO Rev04; individual tie-in schedule required",
     owner:"BROWNFIELD_SCOPE_BY_SYSTEM",status:"BROWNFIELD_NEW_REUSE_BY_OTHERS_UNRESOLVED",
     note:"No automatic 50m greenfield cable; separate added branch length, existing cable testing, termination, demolition and outage requirements"}]
  })),
  source:"BLD-0001 Rev.C1 + MR0001 MTO Rev04; no Brownfield dimensioned route proven here",
  warning:"Brownfield tie-in allowance requires field endpoint and ownership review. No invented supplier rates, no add-on to Cisco-only site totals."
 }));
 return [...newSites.map(w=>({...w,siteClass:"GREENFIELD"})),...brownfieldSites];

}
