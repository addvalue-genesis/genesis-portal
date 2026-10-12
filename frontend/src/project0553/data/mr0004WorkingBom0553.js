// MR-0004 RACON: canonical internal budgetary allocation, not a revised supplier quotation.
// Management directs one RACON package per MR/LAY location (ZWP20, ZWP21, ZWP22).
// ORGA QTORG2609244 USD 75,000 is one quoted package reference; x3 is an
// internal scenario subject to confirmation that vendor will honor unit pricing.
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {RACON_TERMINATION_POLICY_0553} from "./raconTerminationBudget0553";
import {RACON_VENDOR_SCOPE_0553} from "./raconVendorScope0553";
const quotation=RACON_TERMINATION_POLICY_0553.quotation;
const locations=Z1F_TEL_LAYOUT_INDEX_0553.byWP.filter(w=>
 w.equipment.some(e=>e.system==="MARINE_RACON"&&e.tag==="MAR-514-001"));
const sites=locations.map(w=>{
 const site=w.wp;
 const packageRow={
  id:site+"-ORGA-PACKAGE",site,mr:"MR-0004",tag:"MAR-514-001",
  description:"MDS / ORGA SeaBeacon-2 System 6 Ex vendor package (RACON, control and DB)",
  sku:"SEABEACON-2-SYS6-EX",qty:1,sourceQty:1,sourceUnit:"set",unit:"set",
  currency:"USD",unitCost:quotation.packageUSD,extended:quotation.packageUSD,
  status:"MANAGEMENT_BUDGETARY_ONE_PACKAGE_PER_MR_SITE__VENDOR_QTY_RECONFIRM",
  source:"MDS/ORGA "+quotation.number,owner:"MDS_ORGA_VENDOR_PACKAGE",
  countedInWorkingTotal:true,priceBasis:"ORGA_SINGLE_PACKAGE_QUOTE_RATE_APPLIED_PER_MR_SITE"
 };
 const included=RACON_VENDOR_SCOPE_0553.include.filter(x=>x.tag!==packageRow.tag).map((x,i)=>({
  id:site+"-ORGA-INCLUDED-"+i,site,mr:"MR-0004",tag:x.tag,
  description:x.item,qty:1,sourceQty:1,unit:"included",sourceUnit:"included",
  currency:"USD",unitCost:null,extended:null,
  status:"INCLUDED_IN_ORGA_PACKAGE_NOT_SEPARATELY_COSTED",source:"MDS/ORGA "+quotation.number,
  owner:"MDS_ORGA_PACKAGE_INCLUDED",countedInWorkingTotal:false
 }));
 const evidence=[{source:"MDS/ORGA "+quotation.number,line:"ORGA-PACKAGE",description:packageRow.description,
   sourceQty:null,assumedQty:1,currency:"USD",unit:quotation.packageUSD,
   extended:quotation.packageUSD,kind:packageRow.status}];
 return {site,mr:"MR-0004",items:[packageRow,...included],evidence,
  controlledTotalUSD:quotation.packageUSD,
  gaps:["Supplier quoted one package reference; three-site extension is management budget scenario requiring supplier quantity/price confirmation",
   "RACON BFOU cable/glands inclusion conflict and additional site bulk to reconcile"]};
});
export const MR0004_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0004-WORKING-BOM",mr:"MR-0004",manufacturer:"ORGA",supplier:"MDS / ORGA",
 quoteNumber:quotation.number,quotePackageUSD:quotation.packageUSD,sites,
 budgetSiteCount:sites.length,
 budgetTotalUSD:sites.reduce((n,s)=>n+s.controlledTotalUSD,0),
 releaseAllowed:false,status:"MANAGEMENT_BUDGETARY_SITE_ALLOCATION_VENDOR_RECONFIRMATION_REQUIRED"
});
