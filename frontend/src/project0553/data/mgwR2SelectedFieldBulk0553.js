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
    return {...sys,name:"EXION Auteldac 6 -510 / EATON DB3B; JB/glands unpriced",
     items:[
      unpriced("MGW-R2-WAROM-JB","Ex junction box and glands NOT priced by EXION; no MGW inclusion credit",
       mgw.id,"EXION_JB_GLANDS_PRICE_MISSING",1,"included set"),
      unpriced("MGW-R2-PHONE-POE","Ex VoIP telephone PoE/CAT6A route, armoured cable and termination; source Qty/route pending",
       "MR0003/DTS0003/BLD/LAY; "+mgw.id,"CABLE_SPEC_AND_ROUTE_NOT_ESTABLISHED"),
      unpriced("MGW-R2-SOUNDER-DC","EATON DB3B horn 24VDC / relay control cable, as-left termination and MCT",
       "MR0003/DTS0003; "+mgw.id,"HORN_VARIANT_AND_CABLE_ROUTE_NOT_ESTABLISHED"),
      unpriced("MGW-R2-EX-GLANDS","Site Ex field cable glands, blanking plugs and earthing without inherited MGW gland credit",
       "EXION 1260576 plus site WIR/TER","INSTALLED_ENTRIES_CABLE_OD_AND_VENDOR_CREDIT_PENDING")
     ],
     selectedSupplier:"EXION Thailand",selectedPackage:"1260576 Rev0",bulkStatus:"NOT_ESTABLISHED__NO_MGW_INCLUSION_CREDIT" };
   }
   if(sys.id==="MARINE_RACON"&&raconSite.has(w.wp)){
    const basis=routes.find(r=>r.wp===w.wp);
    return {...sys,name:"ORGA / Tideland SeaBeacon 2 / MDS",
     items:[
      unpriced("MGW-R2-DB5P","DB-5P Ex d junction box — INCLUDED IN MDS QTORG2609244",
       mgw.id,"QUOTE_INCLUDED_IN_RACON1_NON_ADDITIVE",1,"included set"),
      unpriced("MGW-R2-CONTROL","RACON separate Ex control box TCAB-514-002, included in MDS financial summary; Ex/interface review open",
       "MR0004/DTS0004/SPE + "+mgw.id,"MDS_FINANCIAL_SUMMARY_INCLUDED__NO_EXTRA_POST"),
      ...((basis?.rows||[]).map(x=>unpriced("MGW-R2-"+x.id,
       x.from+" to "+x.to+" / "+x.kind+" — candidate gross field cable purchase",
       "MDS summary BFOU 5+5+10m conflicts with notes exclusion; no unproven credit",
       "GROSS_ROUTE_CANDIDATE__CABLE_INCLUSION_AND_RATE_PENDING",x.procurementM,"m"))),
      unpriced("MGW-R2-GLANDS","RACON field cable Ex glands, termination and bonding, vendor inclusion unconfirmed",
       "MGW "+mgw.quoteNumber+"; approved site cable end register","FIELD_EX_ENTRIES_GLAND_SKU_AND_PRICE_OPEN")
     ],
     selectedSupplier:"MDS / ORGA",selectedPackage:"QTORG2609244",bulkStatus:"NOT_ESTABLISHED__MDS_CABLE_GLAND_CONFLICT"};
   }
   return sys;
  }),
  selectedBulkSource:mgw.source,workingPricingClass:"TECHNICAL_BULK_ONLY__NO_NEW_COST_POSTING"
 }));
}
