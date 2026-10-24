// Existing canonical owner and stable row IDs retained; 24-Oct selection is EXION.
// The legacy export/row name is an identifier, not the selected supplier.
const sourceUrl="https://drive.google.com/file/d/13iGJllNfjuw8iME2mXcddnmRTt4ov-mk/view";
const source="EXION-1260576-REV0";
const sites=["ZWP20","ZWP21","ZWP22","ZWP23"].map(site=>{
 const packageId=site+"-MGW-PHONE-1";
 const primary={id:packageId,site,mr:"MR-0003",tag:null,quoteLine:"EXION-1+2",
  manufacturer:"Gai-Tronics / EATON",sku:"212-02-6008-510 + DB3BDG048N2BNR12-48VDC2xM20",
  description:"EXION 1260576 Rev0: Auteldac 6 -510 telephone + DB3B sounder; JB/glands NOT priced",
  qty:1,sourceQty:1,sourceQuotedQty:4,unit:"set",sourceUnit:"set",currency:"THB",
  unitCost:145000+62000,extended:145000+62000,source,sourceUrl,
  owner:"EXION_PHONE_SOUNDER_4SITE_PACKAGE",countedInWorkingTotal:true,
  priceBasis:"EXPIRED_QUOTE_RATE_SELECTED_FOR_PRE_AWARD_BUDGET_EX_VAT",
  status:"SELECTED_EXION__510_VS_410_EX_VARIANT_AND_JB_GLANDS_OPEN",releaseAllowed:false};
 const components=[
  ["PHONE","212-02-6008-510","EXION line 1 Auteldac 6 Zone 1 VoIP phone",145000],
  ["HORN","DB3BDG048N2BNR12-48VDC2xM20","EXION line 2 EATON sounder 12–48VDC; 2 x M20 entries",62000]
 ].map(([suffix,sku,description,quotedUnitTHB])=>({id:site+"-MGW-PHONE1-"+suffix,
  site,mr:"MR-0003",tag:null,sku,description,qty:1,unit:"included in EXION priced pair",
  currency:"THB",unitCost:null,extended:null,quotedUnitTHB,source,sourceUrl,
  parentPackage:packageId,priceInclusion:"EXION_PAIR_COMPONENT_NON_ADDITIVE",
  owner:"EXION_INCLUDED_NON_ADDITIVE",countedInWorkingTotal:false}));
 const missing=[
  ["JB","Ex junction box, terminals and factory-fitted glands: NOT in EXION price"],
  ["PHONE-IP-POWER-CABLE","Phone PoE/CAT6A field cable and terminations"],
  ["HORN-DC-SIGNAL-CABLE","Sounder DC/control cable and power interface"],
  ["FIELD-EX-GLANDS","Certified cable glands, plugs and bonding; no inherited MGW credit"],
  ["FIELD-BULK-ACCESSORIES","External supports, MCT, terminations and connections"]
 ].map(([id,description])=>({id:id==="JB"?site+"-MGW-PHONE1-JB":site+"-MR0003-BULK-"+id,
  site,mr:"MR-0003",tag:null,sku:null,description,qty:null,unit:null,currency:null,
  unitCost:null,extended:null,source,sourceUrl,priceInclusion:null,
  owner:"MR0003_FIELD_BULK_PENDING_VERIFIED_TAKEOFF",countedInWorkingTotal:false,
  status:"NOT_PRICED__NOT_ZERO__EXION_SCOPE_GAP"}));
 return Object.freeze({site,mr:"MR-0003",items:[primary,...components,...missing],
  controlledTotalTHB:primary.extended,controlledTotalUSD:null,
  gaps:["JB/glands have no EXION quote; existing BARTEC/PROSPER alternatives require current quantity/rate/Ex review",
   "-510 replaces quoted MGW -410; technical variant and certification not declared equivalent",
   "DDP Nonthaburi is not proof of delivery to exact SAMTEL Warehouse address",
   "30-day validity expired; 16 weeks ARO excludes December shutdown; THB/GBP adjustment clause retained",
   "EXION inland packing only; sea export repacking B5 and freight B6 separate"]});
});
export const MR0003_MGW_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0003-MGW-R2-WORKING-BOM",mr:"MR-0003",manufacturer:"Gai-Tronics / EATON",
 supplier:"EXION Thailand",selectedQuote:source,quoteUrl:sourceUrl,quoteNumber:"1260576 Rev0",
 sites,siteCount:4,budgetTotalTHB:828000,budgetTotalUSD:null,
 historicalAlternative:{supplier:"MGW",quote:"P26-058_R2",packageUSD:6400,totalUSD:25600,selected:false,additive:false},
 status:"EXION_SELECTED__JB_GLANDS_VARIANT_AND_LOGISTICS_OPEN",directCostApproved:false,releaseAllowed:false
});
