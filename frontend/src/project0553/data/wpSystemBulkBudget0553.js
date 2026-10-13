import {deriveRaconTerminationBudget0553} from "./raconTerminationBudget0553";
import {APPROVED_0553_BUDGET_BASIS,approvedCablePurchaseM} from "./approvedBudgetBasis0553";
import {RACON_VENDOR_SCOPE_0553} from "./raconVendorScope0553";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {deriveZ1FTelBulkRoutes0553} from "./z1fParametricBulkRoutes0553";
import {DTRS_RFI_BULK_0553} from "./dtrsRfiBulk0553";
import {MR0001_SITE_CLASSIFICATION} from "./mr0001SiteClassification";
import {deriveBartecGlandBulkSchedule0553} from "./bartecGlandBulkSchedule0553";
import {findZwp20WebRate0553} from "./zwp20WebBulkRates0553";

// Working budget allocation; not a final measured cable schedule or customer priced BOM.
// A priced row requires a compatible unit rate. Enclosure and specialist equipment costs
// remain with their existing MTO owners and must not be added to this Bulk view twice.
export function deriveWpSystemBulkBudget0553(){
 const routeModel=deriveZ1FTelBulkRoutes0553();
 const raconBudget=deriveRaconTerminationBudget0553();
 const glandBudget=deriveBartecGlandBulkSchedule0553();
 const getGland=(wp,system)=>glandBudget.allEnclosures.find(x=>x.site===wp&&x.system===system);
 const newSites=Z1F_TEL_LAYOUT_INDEX_0553.byWP.map(w=>{
  const found=(sys)=>w.equipment.filter(e=>e.system===sys);
  const cableRoute=(sys)=>routeModel.rows.find(r=>r.wp===w.wp&&r.system===sys);
  const systems=[
   {id:"SCADA_RADIO",name:"SCADA Radio",equipment:found("SCADA_RADIO"),route:cableRoute("SCADA_RADIO"),
    items:[{id:"SCADA-RJ45-WEIDMULLER",item:"Weidmuller IE-PS-RJ45-FH-BK RJ45 plug-in connector",unit:"pcs",qty:w.wp==="ZWP20"?1:null,rateTHB:1176.68,source:"RS Thailand online indicative 741-7317, MPN 1963600000, THB1176.68 ex VAT; INNOVA QA24-0604 N/A",owner:"DATO_ROW8_INCLUDED_IN_BUDGET__NOT_ADDITIVE",status:"RS_RETAIL_BUDGET_RATE__DATO_ROW8_OWNER",note:"ZWP20 DATO Row8 owns and costs this connector (THB1176.68); this bulk drilldown mirrors it and must NOT be added to bulk scenario total. Reconcile actual terminated Ethernet ports and vendor inclusion for other WPs; not an extra Row11 cost."},{id:"SCADA-RF-JUMPER",item:"ODU to antenna RF jumper",unit:"set",qty:found("SCADA_RADIO").filter(e=>/^MR-502-/.test(e.tag)).length||null,rateTHB:null,source:"Z1F layout ODU tags; Next G B-5 package check",owner:"ODU_ROW4_PACKAGE_FIRST",status:"ONE_PER_ODU_PROVISIONAL_INCLUDED_KIT_CHECK",note:"Count one per ODU provisionally; verify physical RF port count. If included in ODU kit do not charge twice."},{id:"SCADA-CAT6A",item:"Outdoor CAT6A S/FTP",unit:"m",qty:cableRoute("SCADA_RADIO")?approvedCablePurchaseM(APPROVED_0553_BUDGET_BASIS.greenfield.baseRouteM):null,
     rateTHB:524,source:"INNOVA QA24-0604, historical; scenario base",owner:"BULK_ROW11",
     status:w.wp==="ZWP20"?"MIRROR_ZWP20_ROW11_69M":"APPROVED_60M_PLUS_15PCT_BUDGETARY",
     note:w.wp==="ZWP20"?"Active ZWP20 Row 11 owns 69m (60m + 15pct): this row mirrors cost, do not add twice.":"60m budget base + 15pct purchasing allowance = 69m per evidenced physical field-to-TC-room run"},
     {id:"SCADA-BARTEC-M20-GLAND-SIZE-QTY",item:"BARTEC SCADA enclosure M20 glands — certified size and qty by field cable OD",unit:"pcs",qty:getGland(w.wp,"SCADA_RADIO")?.verifiedActiveGlands??null,rateTHB:w.wp==="ZWP20"?findZwp20WebRate0553("HAWKE-A").rateTHB:null,
      source:"BARTEC 21G1048t GA-1001/2/3 / Z1F MR0001 / cable end register; 16 existing M20 holes per enclosure, drain separate",
      owner:"SCADA_TCAB_ASSEMBLY_OR_FIELD_BULK__NON_ADDITIVE_PENDING",
      status:"16_DRILLED_M20_HOLES_CONFIRMED__CABLE_OD_GLAND_SKU_QTY_OPEN__DTS_18_CONFLICT",
      note:"16 holes/16 original plugs are physical capacity, NOT 16 glands; original 1 priced gland/site remains provisional ledger allowance. Online Hawke A M20 retail candidate THB1925.10/ea, seal 8.4–14.3mm; not a finalized cable OD/Ex selection."},
     ...(w.wp==="ZWP20"?[
      {id:"SCADA-EXTERNAL-EARTH-WIRE-6MM",item:"6mm2 green/yellow tinned copper bonding wire — external field earthing",unit:"m",qty:null,rateTHB:findZwp20WebRate0553("EARTH-6MM").rateTHB,source:findZwp20WebRate0553("EARTH-6MM").url,owner:"BULK_EXTERNAL_EARTHING_ONLY__PANEL_EARTH_TERMINALS_INCLUDED",status:"RETAIL_RATE_VERIFIED__ROUTE_QTY_PENDING",note:"LAPP 100m reel retail price; not guaranteed O&G project-spec/fire suitability; no automatic qty or cost posted"},
      {id:"SCADA-SS316-CABLE-TIES",item:"SS316 marine cable support ties 300mm",unit:"ea",qty:null,rateTHB:findZwp20WebRate0553("TIE-316").rateTHB,source:findZwp20WebRate0553("TIE-316").url,owner:"BULK_EXTERNAL_SUPPORT__VENDOR_PACKAGE_DEDUCT",status:"RETAIL_RATE_VERIFIED__INSTALLATION_SPACING_QTY_PENDING",note:"RS 100pc package; actual installation quantity from cable supports and tray routing, not guessed"}
     ]:[])]},
   {id:"EX_IP_PHONE",name:"EX IP Phone",equipment:found("EX_IP_PHONE"),
    route:null,items:[
     {id:"EX-PHONE-JB",item:"Dedicated certified Ex e Telephone Junction Box assembly, terminals, earth studs, bracket, labels and blanking plugs",unit:"set",qty:null,rateTHB:24500,
      source:"Prosper Q-PROSRY-24051 Rev0 2024-07-12 item3 Exe JB for Telephone 300x300x160, THB24500/set; historical Zawtika 1E only",
      owner:"EX_PHONE_JB_ASSEMBLY",status:"HISTORICAL_UNIT_RATE_VERIFIED__QUANTITY_BY_PHONE_LOCATION",
      note:"Selected BARTEC GA-1004 (300x300x160) has 8 M20 drilled cable entries and 8 fitted stopping plugs; historic Prosper Q-PROSRY-24051 may describe a different 4-plug assembly. Reconcile quote/GA before mapping. MGW PHONE-1 package includes a WAROM JB/gland, NOT BARTEC; exclude or resolve variant, do not double count."},
     {id:"EX-PHONE-JB-ENTRIES",item:"Certified glands, stopping plugs and interface accessories for telephone JB",unit:"entry",qty:null,rateTHB:null,
      source:"BARTEC telephone JB historical GA and IEC/EN 60079-14 installation requirement",owner:"EX_PHONE_JB_ASSEMBLY_OR_EXTERNAL_BULK",
      status:"BARTEC_GA_8_HOLES__ACTIVE_GLAND_SIZE_QTY_PENDING",note:"Confirmed BARTEC 8×M20 top holes with 8 factory stopping plugs; gland model and count must follow cable-end schedule for TPH-504, LSE-504 and JB uplink. MGW PHONE-1 includes WAROM JB and a certified gland, no automatic credit against BARTEC."},
     {id:"EX-PHONE-BARTEC-M20-GLAND-SIZE-QTY",item:"BARTEC Ex Telephone JB certified M20 glands, selected by actual cable OD",unit:"pcs",qty:getGland(w.wp,"EX_IP_PHONE")?.verifiedActiveGlands??null,rateTHB:null,
      source:"BARTEC GA-1004 (8×M20, 8 plugs, separate drain); Z1F MR0003; approved WIR/TER and selected cable DTS",
      owner:"EX_PHONE_JB_ASSEMBLY_OR_FIELD_BULK__VENDOR_INCLUDED_CHECK",
      status:"CABLE_OD_SEAL_RANGE_EX_CERT_END_QTY_AND_PACKAGE_SCOPE_PENDING",
      note:"Gland thread M20 does not establish OD/seal clamping. Check PHONE-1 WAROM inclusive package vs user-selected BARTEC JB; count only distinct Z1F cable ends and separately purchased fittings."},
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
     note:"No automatic 50m greenfield cable; separate added branch length, existing cable testing, termination, demolition and outage requirements"},
   ...(id==="SCADA_RADIO"?[{id:"SCADA-BARTEC-M20-GLAND-SIZE-QTY",item:"BARTEC SCADA Ex enclosure 16×M20 hole capacity; assess replacement/new termination gland by selected cable OD",unit:"pcs",
    qty:getGland(wp,id)?.verifiedActiveGlands??null,rateTHB:null,extendedTHB:null,
    source:"Z1F MR0001 Brownfield and BARTEC GA-1001/2/3; brownfield active reuse/new survey required",
    owner:"BROWNFIELD_TCAB_BULK__NOT_ASSUMED_NEW",status:"REUSE_NEW_GLAND_SIZE_AND_QUANTITY_TAKEOFF_REQUIRED",note:"Do not book 16 glands or charge again against existing/reused Ex assembly"}]:[])]
  })),
  source:"BLD-0001 Rev.C1 + MR0001 MTO Rev04; no Brownfield dimensioned route proven here",
  warning:"Brownfield tie-in allowance requires field endpoint and ownership review. No invented supplier rates, no add-on to Cisco-only site totals."
 }));
 return [...newSites.map(w=>({...w,siteClass:"GREENFIELD"})),...brownfieldSites];

}
