// PJ2608-0553 MR0003/0004 selected MGW Rev2 field BULK read-only projection.
// Supersedes the legacy EXION/PROSPER and MDS/ORGA *display assumptions* only.
// No new quantities/prices are booked. Approved cable schedule is still open.
import {deriveWpSystemBulkBudget0553} from "./wpSystemBulkBudget0553";
import {deriveRaconTerminationBudget0553} from "./raconTerminationBudget0553";
import {MGW_P26_058_R2_SELECTED_0553 as mgw} from "./mgwP26058R2Selected0553";
const phoneSite=new Set(mgw.sitesByMR["MR-0003"]);
const raconSite=new Set(mgw.sitesByMR["MR-0004"]);
const unpriced=(id,item,source,status,qty=null,unit=null)=>({
 id,item,qty,unit,rateTHB:null,extendedTHB:null,
 source,owner:"MGW_R2_FIELD_BULK__RATE_AND_TAKEOFF_OPEN",status,
 pricePostingAllowed:false});
export function deriveMGWSelectedWpSystemBulk0553(){
 const historic=deriveWpSystemBulkBudget0553();
 const routes=deriveRaconTerminationBudget0553();
 return historic.map(w=>({
  ...w,
  systems:w.systems.map(sys=>{
   if(sys.id==="EX_IP_PHONE"&&phoneSite.has(w.wp)){
    return {...sys,name:"Gai-Tronics Auteldac 6 / EATON DB3B / WAROM BXJ-S",
     items:[
      unpriced("MGW-R2-WAROM-JB","WAROM BXJ-S Ex e SS316L junction box and one vendor-quoted Ex-P gland — INCLUDED IN PHONE-1",
       mgw.id,"QUOTE_INCLUDED_IN_PHONE1_NON_ADDITIVE",1,"included set"),
      unpriced("MGW-R2-PHONE-POE","Ex VoIP telephone PoE/CAT6A route, armoured cable and termination; source Qty/route pending",
       "MR0003/DTS0003/BLD/LAY; "+mgw.id,"CABLE_SPEC_AND_ROUTE_NOT_ESTABLISHED"),
      unpriced("MGW-R2-SOUNDER-DC","EATON DB3B horn 24VDC / relay control cable, as-left termination and MCT",
       "MR0003/DTS0003; "+mgw.id,"HORN_VARIANT_AND_CABLE_ROUTE_NOT_ESTABLISHED"),
      unpriced("MGW-R2-EX-GLANDS","Site Ex field cable glands, blanking plugs and earthing NET OF WAROM package included gland",
       "WAROM BXJ-S MGW quote plus site WIR/TER","INSTALLED_ENTRIES_CABLE_OD_AND_VENDOR_CREDIT_PENDING")
     ],
     selectedSupplier:"MGW",selectedPackage:"PHONE-1",bulkStatus:"NOT_ESTABLISHED__NO_DUPLICATE_WAROM" };
   }
   if(sys.id==="MARINE_RACON"&&raconSite.has(w.wp)){
    const basis=routes.find(r=>r.wp===w.wp);
    return {...sys,name:"Tideland SeaBeacon 2 System 6 / MGW R2",
     items:[
      unpriced("MGW-R2-DB5P","DB-5P Ex d junction box — INCLUDED IN MGW RACON-1",
       mgw.id,"QUOTE_INCLUDED_IN_RACON1_NON_ADDITIVE",1,"included set"),
      unpriced("MGW-R2-CONTROL","RACON separate Ex control box TCAB-514-002, OEM assembly scope unknown",
       "MR0004/DTS0004/SPE + "+mgw.id,"NOT_EXPLICIT_IN_MGW_QUOTE__PRICE_PENDING"),
      ...((basis?.rows||[]).map(x=>unpriced("MGW-R2-"+x.id,
       x.from+" to "+x.to+" / "+x.kind+" — candidate gross field cable purchase",
       "MGW R2 quote no stated BFOU cable credit; old ORGA inclusions NOT selected",
       "GROSS_ROUTE_CANDIDATE__CABLE_INCLUSION_AND_RATE_PENDING",x.procurementM,"m"))),
      unpriced("MGW-R2-GLANDS","RACON field cable Ex glands, termination and bonding, vendor inclusion unconfirmed",
       "MGW "+mgw.quoteNumber+"; approved site cable end register","FIELD_EX_ENTRIES_GLAND_SKU_AND_PRICE_OPEN")
     ],
     selectedSupplier:"MGW",selectedPackage:"RACON-1",bulkStatus:"NOT_ESTABLISHED__NO_ORGA_CABLE_CREDIT"};
   }
   return sys;
  }),
  selectedBulkSource:mgw.source,workingPricingClass:"TECHNICAL_BULK_ONLY__NO_NEW_COST_POSTING"
 }));
}
