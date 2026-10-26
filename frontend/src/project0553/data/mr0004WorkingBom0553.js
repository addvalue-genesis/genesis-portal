// Existing MR0004 owner; MDS one-system quote extrapolated to 3 required sites.
// Quote quantity is ONE, never described as a firm three-system offer.
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
const source="MDS-QTORG2609244-20260922";
const sourceUrl="https://drive.google.com/file/d/1Wjod3tJNvte2Wrc3p0fmj8-9i664pEMW/view";
const sites=Z1F_TEL_LAYOUT_INDEX_0553.byWP.filter(w=>w.equipment.some(e=>e.system==="MARINE_RACON"&&e.tag==="MAR-514-001")).map(w=>{
 const site=w.wp,mainId=site+"-MGW-RACON-1";
 const main={id:mainId,site,mr:"MR-0004",tag:"MAR-514-001",quoteLine:"MDS-FINANCIAL-SUMMARY",
  manufacturer:"ORGA / Tideland",sku:"SeaBeacon-2 System 6 Ex (024439)",
  description:"MDS QTORG2609244 complete RACON system; one-set quoted rate extrapolated per required site",
  qty:1,sourceQty:1,sourceQuotedQty:1,sourceUnit:"set",unit:"set",currency:"USD",
  unitCost:75000,extended:75000,source,sourceUrl,owner:"MDS_RACON_SELECTED_PACKAGE",
  countedInWorkingTotal:true,priceBasis:"ONE_SET_BUDGETARY_QUOTE_EXTRAPOLATED_TO_THREE__NOT_CONFIRMED_LOT",
  status:"MDS_SELECTED__FCA_PLACE_FAT_CABLE_GLAND_CONFLICT_OPEN",releaseAllowed:false};
 const included=[
  ["DB5P","TCAB-514-001","DB-5P","DB-5P interface/distribution box; bracket and DC-DC converter"],
  ["CONTROL-JB","TCAB-514-002",null,"Ex db eb GRP control box"],
  ["PROGRAMMING-KIT",null,null,"Purge kit and USB-to-flying-lead programming cable; phase adapter/charger equivalence remains open"]
 ].map(([id,tag,sku,description])=>({id:site+"-MGW-"+(id==="DB5P"?id:"RACON-"+id),site,mr:"MR-0004",tag,sku,description,
  qty:1,unit:"included in quoted system",currency:"USD",unitCost:null,extended:null,
  parentPackage:mainId,priceInclusion:"MDS_FINANCIAL_SUMMARY_INCLUDED_NON_ADDITIVE",source,sourceUrl,
  owner:"MDS_INCLUDED_NON_ADDITIVE",countedInWorkingTotal:false}));
 const gaps=[
  ["BFOU-CABLE","Financial summary lists BFOU 5+5+10m; notes exclude cables. No automatic field-cable credit"],
  ["FIELD-GLANDS","Financial summary lists six CMP glands; notes exclude glands. No automatic purchase credit"],
  ["TOOLS-TEST","Factory FAT included in summary, excluded in standard terms; SAMTEL integration is separate"]
 ].map(([id,description])=>({id:site+"-MR0004-"+id,site,mr:"MR-0004",tag:null,sku:null,description,
  qty:null,unit:null,currency:null,unitCost:null,extended:null,source,sourceUrl,
  countedInWorkingTotal:false,owner:"MR0004_FIELD_BULK_OR_CONTROL_PENDING",priceInclusion:null,
  status:"MDS_QUOTATION_CONFLICT__NO_UNPROVEN_CREDIT"}));
 return Object.freeze({site,mr:"MR-0004",items:[main,...included,...gaps],controlledTotalUSD:75000,
  gaps:["Quote quantity 1; project 3 is budget extrapolation", "FCA Factory named pickup place unconfirmed; inbound to Thailand in B6",
   "Morse Q versus project code and complete Ex assembly review pending", "FAT/cable/gland internal quote contradictions retained; no duplicate B3/B11/A bulk credit"]});
});
if(sites.length!==3)throw Error("MR0004 required location quantity changed");
export const MR0004_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0004-WORKING-BOM",mr:"MR-0004",manufacturer:"ORGA / Tideland",supplier:"MDS / ORGA",
 quoteNumber:"QTORG2609244",quotePackageUSD:75000,quoteTotalUSD:75000,sourceQuotedQty:1,
 selectedSource:source,selectedSourceUrl:sourceUrl,sites,budgetSiteCount:sites.length,budgetTotalUSD:sites.length*75000,
 historicalAlternative:Object.freeze({supplier:"MGW",quote:"P26-058_R2",packageUSD:75059,selected:false,additive:false}),
 releaseAllowed:false,status:"MDS_ONE_SET_QUOTE_THREE_SITE_EXTRAPOLATION__COMMERCIAL_TECHNICAL_GAPS"
});
