// Existing MR0004 owner; MDS one-system quote extrapolated to 3 required sites.
// Quote quantity is ONE, never described as a firm three-system offer.
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./z1fTelLayoutIndex0553";
const source="MDS-QTORG2609244-20260922";
const sourceUrl="https://drive.google.com/file/d/1Wjod3tJNvte2Wrc3p0fmj8-9i664pEMW/view";
// Owner's bid-planning disposition; the supplier's contradictory PDF remains
// unchanged. This is not a newly confirmed OEM offer or a new cost posting.
export const MDS_SCOPE_DECISION_0553=Object.freeze({
 date:"2026-11-02",authority:"PROJECT_MANAGEMENT_USER",
 evidence:"Owner: L3 8 ports per TC-0001 Item 13; MDS exclusions — ไม่รวมเราจัดหา",
 status:"OWNER_SELECTED_EXCLUSIONS__ADDVALUE_SUPPLY",
 supplierConfirmed:false,
 vendorCableCreditM:0,vendorGlandCreditQty:0,vendorFatCreditTHB:0,
 cableOwner:"ADDVALUE_MR0004_FIELD_BULK",glandOwner:"ADDVALUE_MR0004_FIELD_BULK",
 fatOwner:"ADDVALUE_B3_INTEGRATED_FAT_SAMTEL_THAILAND",
 included:Object.freeze(["RACON","Ex control box","DB-5P","Purge kit","Programming cable","Packing","Documentation"]),
 excluded:Object.freeze(["FAT","Field/interconnection cables","Field cable glands"]),
 cableCostTHB:null,glandCostTHB:null,additionalFatCostTHB:null,
 pricePostingAllowed:false,customerReleaseAllowed:false
});
const sites=Z1F_TEL_LAYOUT_INDEX_0553.byWP.filter(w=>w.equipment.some(e=>e.system==="MARINE_RACON"&&e.tag==="MAR-514-001")).map(w=>{
 const site=w.wp,mainId=site+"-MGW-RACON-1";
 const main={id:mainId,site,mr:"MR-0004",tag:"MAR-514-001",quoteLine:"MDS-FINANCIAL-SUMMARY",
  manufacturer:"ORGA / Tideland",sku:"SeaBeacon-2 System 6 Ex (024439)",
  description:"MDS QTORG2609244 complete RACON system; one-set quoted rate extrapolated per required site",
  qty:1,sourceQty:1,sourceQuotedQty:1,sourceUnit:"set",unit:"set",currency:"USD",
  unitCost:75000,extended:75000,source,sourceUrl,owner:"MDS_RACON_SELECTED_PACKAGE",
  countedInWorkingTotal:true,priceBasis:"ONE_SET_BUDGETARY_QUOTE_EXTRAPOLATED_TO_THREE__NOT_CONFIRMED_LOT",
  status:"MDS_SELECTED__OWNER_EXCLUDES_FAT_CABLE_GLAND__COST_RECONCILIATION_OPEN",releaseAllowed:false};
 const included=[
  ["DB5P","TCAB-514-001","DB-5P","DB-5P interface/distribution box; bracket and DC-DC converter"],
  ["CONTROL-JB","TCAB-514-002",null,"Ex db eb GRP control box"],
  ["PROGRAMMING-KIT",null,null,"Purge kit and USB-to-flying-lead programming cable; phase adapter/charger equivalence remains open"]
 ].map(([id,tag,sku,description])=>({id:site+"-MGW-"+(id==="DB5P"?id:"RACON-"+id),site,mr:"MR-0004",tag,sku,description,
  qty:1,unit:"included in quoted system",currency:"USD",unitCost:null,extended:null,
  parentPackage:mainId,priceInclusion:"MDS_FINANCIAL_SUMMARY_INCLUDED_NON_ADDITIVE",source,sourceUrl,
  owner:"MDS_INCLUDED_NON_ADDITIVE",countedInWorkingTotal:false}));
 const gaps=[
  ["BFOU-CABLE","Owner selects cable exclusion: ADDVALUE supplies interconnection/field cables; supplier cable credit zero; measured takeoff and price pending"],
  ["FIELD-GLANDS","Owner selects gland exclusion: ADDVALUE supplies field cable glands; supplier gland credit zero; Ex/cable OD and price pending"],
  ["TOOLS-TEST","Owner selects FAT exclusion: ADDVALUE executes integrated FAT at SAMTEL Thailand under B3; no supplier FAT credit or second automatic FAT budget"]
 ].map(([id,description])=>({id:site+"-MR0004-"+id,site,mr:"MR-0004",tag:null,sku:null,description,
  qty:null,unit:null,currency:null,unitCost:null,extended:null,source,sourceUrl,
  countedInWorkingTotal:false,owner:id==="TOOLS-TEST"?MDS_SCOPE_DECISION_0553.fatOwner:MDS_SCOPE_DECISION_0553.cableOwner,priceInclusion:"EXCLUDED_FROM_MDS__ADDVALUE_OWNER",
  status:"OWNER_SCOPE_RESOLVED__TAKEOFF_RATE_AND_BUDGET_RECONCILIATION_OPEN"}));
 return Object.freeze({site,mr:"MR-0004",items:[main,...included,...gaps],controlledTotalUSD:75000,
  gaps:["Quote quantity 1; project 3 is budget extrapolation", "FCA Factory named pickup place unconfirmed; inbound to Thailand in B6",
   "Morse Q versus project code and complete Ex assembly review pending", "Owner selected FAT/cable/gland exclusions; ADDVALUE B3/field-bulk owners; existing budgets require reconciliation, no duplicate charge"]});
});
if(sites.length!==3)throw Error("MR0004 required location quantity changed");
export const MR0004_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0004-WORKING-BOM",mr:"MR-0004",manufacturer:"ORGA / Tideland",supplier:"MDS / ORGA",
 quoteNumber:"QTORG2609244",quotePackageUSD:75000,quoteTotalUSD:75000,sourceQuotedQty:1,
 selectedSource:source,selectedSourceUrl:sourceUrl,sites,budgetSiteCount:sites.length,budgetTotalUSD:sites.length*75000,
 scopeDecision:MDS_SCOPE_DECISION_0553,
 historicalAlternative:Object.freeze({supplier:"MGW",quote:"P26-058_R2",packageUSD:75059,selected:false,additive:false}),
 releaseAllowed:false,status:"MDS_ONE_SET_QUOTE_THREE_SITE_EXTRAPOLATION__COMMERCIAL_TECHNICAL_GAPS"
});
