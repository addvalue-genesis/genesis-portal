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
    items:[{id:"SCADA-CAT6A",item:"Outdoor CAT6A S/FTP",unit:"m",qty:cableRoute("SCADA_RADIO")?.scenarios.base??null,
     rateTHB:524,source:"INNOVA QA24-0604, historical; scenario base",owner:"BULK_ROW11",
     status:"PARAMETRIC_BASE_ONLY__NOT_VENDOR_CONFIRMED",
     note:"SCADA route from ODU to TC Room; scenario base of 60m is NOT ZWP20 active BOM 50m"}]},
   {id:"EX_IP_PHONE",name:"EX IP Phone",equipment:found("EX_IP_PHONE"),
    route:null,items:[{id:"EX-PHONE-CABLE",item:"Phone network cable / PoE or manufacturer specified",unit:"route",qty:null,
     rateTHB:null,source:"TEL-LAY symbol and Z1F MR plus phone DTS needed",owner:"PHONE_BULK",
     status:"ENDPOINT_CABLE_TYPE_NOT_EVIDENCED",note:"LSE-504-001 is EX Sounder, NOT an IP Phone; do not substitute"}]},
   {id:"DTRS_TRUNK_RADIO",name:"DTRS / Trunk Radio",equipment:found("DTRS_TRUNK_RADIO"),route:cableRoute("DTRS_TRUNK_RADIO"),
    items:(DTRS_RFI_BULK_0553.byWP.find(x=>x.wp===w.wp)?.functions||[]).map((v,i)=>({
     id:"DTRS-"+i,item:v.fn,unit:v.unit,qty:v.qty,rateTHB:null,source:v.source,owner:v.tag,
     status:"MOT_RFI_LNA_INTERFACE__NO_MATCHED_RATE",note:"RFI LNA 380-520MHz; 50 ohm SMA(F). Feeder requires RF attenuation and proper topology"}))},
   {id:"MARINE_RACON",name:"Marine RACON",equipment:found("MARINE_RACON"),route:cableRoute("MARINE_RACON"),
    items:found("MARINE_RACON").length?[{id:"RACON-POWER-CONTROL",item:"Power/control interface cable to RACON DB/JB",unit:"route",qty:null,rateTHB:null,
     source:"LAY sheet "+w.sheets.upper+" tags MAR-514-001, TCAB-514-001/002",owner:"RACON_BULK",
     status:"POWER_CONTROL_DTS_REQUIRED",note:"Do not use SCADA CAT6A rate; verify box interconnections and power supply"}]:[]}
  ];
  return {wp:w.wp,systems:systems.map(sys=>({...sys,items:sys.items.map(it=>({
   ...it,extendedTHB:Number.isFinite(it.qty)&&Number.isFinite(it.rateTHB)?Math.round(it.qty*it.rateTHB*100)/100:null
  }))})),source:"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 AFC",
   warning:"Scenario amounts displayed for planning only. Not additive with current ZWP20 working BOM or other vendor package costs."};
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
