// PJ2608-0553 MR0004 — selected MGW P26-058_R2 Tideland SeaBeacon 2.
// MDS/ORGA USD75,000 is a HISTORICAL ALTERNATIVE for price/scope comparison,
// not additive to MGW package USD75,059. Only explicitly listed MGW items
// qualify for quote-included credit; no assumption of ORGA BFOU/cable/glands.
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
import {MGW_P26_058_R2_SELECTED_0553 as quote,selectMGWR2Selected0553} from "./mgwP26058R2Selected0553";
import {RACON_TERMINATION_POLICY_0553} from "./raconTerminationBudget0553";
const offered=selectMGWR2Selected0553("RACON-1");
if(!offered||offered.quantity!==3||offered.unitPriceUSD!==75059||
 offered.extendedUSD!==225177)throw Error("MGW P26-058_R2 RACON quote mismatch");
const locations=Z1F_TEL_LAYOUT_INDEX_0553.byWP.filter(w=>
 w.equipment.some(e=>e.system==="MARINE_RACON"&&e.tag==="MAR-514-001"));
const sites=locations.map(w=>{
 const site=w.wp,mainId=site+"-MGW-RACON-1";
 const packageRow={id:mainId,site,mr:"MR-0004",tag:"MAR-514-001",
  quoteLine:"RACON-1",manufacturer:"Tideland",sku:"SeaBeacon 2 System 6",
  description:"Tideland SeaBeacon 2 System 6 X/S Band Ex RACON with quoted DB-5P Ex d junction box",
  qty:1,sourceQty:1,sourceUnit:"set",unit:"set",
  currency:"USD",unitCost:75059,extended:75059,
  source:quote.id,sourceUrl:quote.source,sourceQuotedQty:3,
  status:"MGW_R2_SELECTED_TIDELAND_SEABEACON2__EX_AND_SYSTEM_SCOPE_GATED",
  owner:"MGW_RACON1_SELECTED_VENDOR_PACKAGE",countedInWorkingTotal:true,
  priceBasis:"MGW_P26_058_R2_RACON1_FIRM_QUOTED_UNIT_REFERENCE",
  releaseAllowed:false};
 const included={id:site+"-MGW-DB5P",site,mr:"MR-0004",tag:"TCAB-514-001",
  sku:"DB-5P",description:"MGW R2: Ex d copper-free aluminium DB-5P junction box included with Tideland RACON",
  qty:1,sourceQty:1,unit:"included in RACON-1",currency:"USD",
  unitCost:null,extended:null,parentPackage:mainId,
  priceInclusion:"INCLUDED_IN_MGW_R2_RACON1",quoteLine:"RACON-1",
  source:quote.id,owner:"MGW_RACON1_INCLUDED_DB5P_NON_ADDITIVE",
  status:"QUOTED_INCLUDED__EX_CERTIFICATE_AND_INTERFACE_VERIFY",
  countedInWorkingTotal:false};
 const uncertain=[{
  id:"CONTROL-JB",tag:"TCAB-514-002",sku:null,
  description:"Separate RACON Ex e control/junction box: not separately identified in MGW R2; request explicit inclusion or separate priced offer",
  scope:"CONTROL_BOX_NOT_EXPLICITLY_QUOTED__COMPLETE_RACON_ASSEMBLY_VERIFY"
 },{
  id:"BFOU-CABLE",tag:null,sku:"BFOU 12C x 1.5mm2 candidate",
  description:"RACON-to-control/DB field BFOU cable and indoor 24VDC/control/alarms; quantity derived from site routing, no MGW cable credit proven",
  scope:"FIELD_BULK_ROUTE_AND_OEM_CABLE_INCLUSION_OPEN"
 },{
  id:"FIELD-GLANDS",tag:null,sku:null,
  description:"Ex-rated glands, plugs, earthing, bonding and field RF/signal interfaces, net of documented vendor inclusion",
  scope:"EX_BULK_ENTRY_QTY_AND_INCLUDED_DELIVERY_OPEN"
 },{
  id:"TOOLS-TEST",tag:null,sku:null,
  description:"Purge/charging adapter if protection method needs it, programming cable, vessel/marine radar/operator acceptance arrangements",
  scope:"RACON_SPECIAL_TOOL_SAT_SUPPORT_VENDOR_INCLUSION_OPEN"
 }].map(x=>({
  ...x,id:site+"-MR0004-"+x.id,site,mr:"MR-0004",qty:null,unit:null,
  currency:null,unitCost:null,extended:null,
  source:"MGW "+quote.quoteNumber+" + MR0004/DTS0004/SPE/BDL",
  countedInWorkingTotal:false,owner:"MR0004_FIELD_BULK_OR_CONTROL_PENDING",
  status:"COST_NOT_ESTABLISHED__BULK_CONTROL_TOOL_SCOPE_VERIFY",
  priceInclusion:null,priceBasis:x.scope}));
 return Object.freeze({site,mr:"MR-0004",items:[packageRow,included,...uncertain],
  controlledTotalUSD:75059,
  gaps:["MGW R2 names Tideland SeaBeacon 2 and DB-5P only; confirm separate control box TCAB-514-002, internal control/purge and programming kit",
   "No ORGA QTORG2609244 cable/gland/FAT/packing scope inclusion may be copied into MGW quote",
   "Check actual field routing, BFOU/24VDC cable, glands, Ex d assembly, X/S response and Morse code D-vs-Q deviation",
   "No confirmed EXW freight/DDP JUTAL Yard landed cost or FAT/site technical compliance"]});
});
if(sites.length!==3||sites.reduce((n,s)=>n+s.controlledTotalUSD,0)!==225177)
 throw Error("MR0004 three-site MGW R2 quote allocation mismatch");
export const MR0004_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0004-WORKING-BOM",mr:"MR-0004",manufacturer:"Tideland",
 supplier:quote.supplier,quoteNumber:quote.quoteNumber,quotePackageUSD:75059,
 quoteTotalUSD:225177,selectedSource:quote.id,selectedSourceUrl:quote.source,sites,
 budgetSiteCount:sites.length,budgetTotalUSD:225177,
 historicalAlternative:Object.freeze({supplier:"MDS / ORGA",quote:RACON_TERMINATION_POLICY_0553.quotation.number,
  packageUSD:RACON_TERMINATION_POLICY_0553.quotation.packageUSD,
  selected:false,additive:false}),
 releaseAllowed:false,status:"MANAGEMENT_SELECTED_MGW_R2_TIDELAND__CONTROL_BULK_AND_COMPLIANCE_PENDING"
});
