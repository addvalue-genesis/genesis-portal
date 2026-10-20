// PJ2608-0553 / MR0003: selected MGW P26-058_R2 Gai-Tronics + EATON + WAROM.
// One PHONE-1 package USD 6,400 per quoted WP (20,21,22,23); internal BOM
// projection only, NOT an approved customer sell / confirmed installed TAG.
// External FIELD BULK remains unpriced pending approved LIS/WIR/routing and Ex OD.
import {MGW_P26_058_R2_SELECTED_0553 as quote,selectMGWR2Selected0553} from "./mgwP26058R2Selected0553";
const parent=selectMGWR2Selected0553("PHONE-1");
if(!parent||parent.mr!=="MR-0003"||parent.quantity!==4||parent.unitPriceUSD!==6400||
 parent.extendedUSD!==25600)throw Error("Selected MGW R2 PHONE-1 quote diverged");
const sites=quote.sitesByMR["MR-0003"].map(site=>{
 const packageId=site+"-MGW-PHONE-1";
 const primary={id:packageId,site,mr:"MR-0003",tag:null,
  quoteLine:"PHONE-1",manufacturer:"Gai-Tronics / EATON / WAROM",
  sku:"212-02-6008-410 + DB3B + BXJ-S",
  description:"MGW P26-058_R2 Gai-Tronics Auteldac 6 Ex VoIP phone + EATON DB3B horn + WAROM BXJ-S Ex e junction box with Ex cable gland",
  qty:1,sourceQty:1,unit:"set",sourceUnit:"set",currency:"USD",
  unitCost:parent.unitPriceUSD,extended:parent.unitPriceUSD,
  source:quote.id,sourceUrl:quote.source,sourceQuotedQty:4,
  owner:"MGW_PHONE1_4SITE_PACKAGE",countedInWorkingTotal:true,
  status:"MANAGEMENT_SELECTED_MGW_R2_PHONE1__INSTALLED_TAG_AND_EX_VARIANT_VERIFY",
  releaseAllowed:false};
 const included=[
  {suffix:"PHONE",sku:"212-02-6008-410",description:"Gai-Tronics Auteldac 6 Ex VoIP/SIP PoE telephone IP66",tag:null},
  {suffix:"HORN",sku:"DB3B",description:"EATON DB3B Ex d 122dB horn sounder (24VDC/duty and Ex certificates confirm)",tag:null},
  {suffix:"JB",sku:"BXJ-S",description:"WAROM BXJ-S SS316L Ex e telephone junction box c/w Ex-P SS316L cable gland",tag:null}
 ].map(c=>({id:site+"-MGW-PHONE1-"+c.suffix,site,mr:"MR-0003",...c,qty:1,
   unit:"included in PHONE-1",currency:"USD",unitCost:null,extended:null,
   source:quote.id,sourceUrl:quote.source,quoteLine:"PHONE-1",
   parentPackage:packageId,priceInclusion:"INCLUDED_IN_MGW_R2_PHONE1",
   owner:"MGW_PHONE1_INCLUDED_NON_ADDITIVE",countedInWorkingTotal:false,
   status:"QUOTE_INCLUDED__EQUIPMENT_CERTIFICATION_SITE_TAG_VERIFY"}));
 const bulk=[
  {id:"PHONE-IP-POWER-CABLE",description:"Phone PoE/Cat6A power/data field cable and terminations",driver:"site cable route and approved Cat6A/armour/fire rating"},
  {id:"HORN-DC-SIGNAL-CABLE",description:"Sounder DC/control/relay cable and MCT/terminals",driver:"24VDC circuit and E&I power/sounder ITP"},
  {id:"FIELD-EX-GLANDS",description:"Field Ex glands, blanking, grounding, bonding; net of WAROM vendor-included gland",driver:"actual active entries, cable OD/armour/Ex installation"},
  {id:"FIELD-BULK-ACCESSORIES",description:"External trays, supports, MCT, terminations and certified connections",driver:"approved field routing, installed TAG and OEM inclusions"}
 ].map(x=>({id:site+"-MR0003-BULK-"+x.id,site,mr:"MR-0003",tag:null,
   sku:null,description:x.description,qty:null,unit:null,currency:null,
   unitCost:null,extended:null,owner:"MR0003_FIELD_BULK_PENDING_VERIFIED_TAKEOFF",
   source:"MR0003 C1; DTS0003 C1; SPE C2; Tel LAY/BLD; "+quote.id,
   status:"NOT_PRICED__FIELD_BULK_VERIFY_NON_DUPLICATION",budgetBasis:x.driver,
   countedInWorkingTotal:false,priceInclusion:null,
   note:"Not zero and not already vendor included unless identified in selected MGW PHONE-1 bundle"}));
 return Object.freeze({site,mr:"MR-0003",
  items:[primary,...included,...bulk],controlledTotalUSD:6400,
  status:"SELECTED_MGW_R2_4SITE_QUOTED_SCOPE__TECH_AND_FIELD_BULK_PENDING",
  gaps:["MR0003 Installed TAG/LIS confirmation per Site; ZWP20 drawing equipment symbol not fully established",
    "EATON DB3B 24VDC horn variant and Ex/IECEx ATEX certificate",
    "WAROM BXJ-S JB Ex cert, number of factory-provided glands and approved physical cable entries",
    "External PoE, DC/control, MCT, field termination bulk priced separately only net of inclusions"]});
});
if(sites.length!==4||sites.reduce((n,s)=>n+s.controlledTotalUSD,0)!==25600)throw Error("MR0003 MGW four-site BOM mismatch");
export const MR0003_MGW_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0003-MGW-R2-WORKING-BOM",mr:"MR-0003",
 manufacturer:"Gai-Tronics / EATON / WAROM",supplier:quote.supplier,
 selectedQuote:quote.id,quoteUrl:quote.source,quoteNumber:quote.quoteNumber,
 sites,siteCount:4,budgetTotalUSD:25600,
 status:"MGW_R2_SELECTED__TECHNICAL_AND_SITE_BULK_GATED",
 directCostApproved:false,releaseAllowed:false
});
