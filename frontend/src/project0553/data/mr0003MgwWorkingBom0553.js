// Existing canonical owner and stable row IDs retained; 24-Oct selection is EXION.
// The legacy export/row name is an identifier, not the selected supplier.
import {MR0003_SELECTED_PRICE_0553 as selectedPrice} from "./mr0003SelectedPrice0553";
const sourceUrl="https://drive.google.com/file/d/13iGJllNfjuw8iME2mXcddnmRTt4ov-mk/view";
const source="EXION-1260576-REV0";
const sites=["ZWP20","ZWP21","ZWP22","ZWP23"].map(site=>{
 const packageId=site+"-MGW-PHONE-1";
 const primary={id:packageId,site,mr:"MR-0003",tag:null,quoteLine:"EXION-1+2",
  manufacturer:"Gai-Tronics / EATON",sku:"212-02-6008-510 + DB3BDG048N2BNR12-48VDC2xM20",
  description:"EXION 1260576 Rev0: Auteldac 6 -510 telephone + DB3B sounder; JB allowance counted separately",
  qty:1,sourceQty:1,sourceQuotedQty:4,unit:"set",sourceUnit:"set",currency:"THB",
  unitCost:selectedPrice.phoneTHB+selectedPrice.sounderTHB,extended:selectedPrice.phoneTHB+selectedPrice.sounderTHB,source,sourceUrl,
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
 const fieldRows=[
  ["JB","Telephone junction box: owner-selected PROSPER historical budget allowance; MTO assembly/configuration verification pending"],
  ["PHONE-IP-POWER-CABLE","Phone PoE/CAT6A field cable and terminations"],
  ["HORN-DC-SIGNAL-CABLE","Sounder DC/control cable and power interface"],
  ["FIELD-EX-GLANDS","Certified cable glands, plugs and bonding; no inherited MGW credit"],
  ["FIELD-BULK-ACCESSORIES","External supports, MCT, terminations and connections"]
 ].map(([id,description])=>({id:id==="JB"?site+"-MGW-PHONE1-JB":site+"-MR0003-BULK-"+id,
  site,mr:"MR-0003",tag:id==="JB"?"TCAB-504-001":null,sku:null,description,qty:id==="JB"?1:null,unit:id==="JB"?"set":null,currency:id==="JB"?"THB":null,
  unitCost:id==="JB"?selectedPrice.jbTHB:null,extended:id==="JB"?selectedPrice.jbTHB:null,
  source:id==="JB"?selectedPrice.quoteProsper:source,
  sourceUrl:id==="JB"?"https://drive.google.com/file/d/19XSRRU_p8S-2JlSin82T4pdoOD4QOMGh/view":sourceUrl,priceInclusion:null,
  owner:id==="JB"?"MR0003_TELEPHONE_JB_BUDGET_ALLOWANCE":"MR0003_FIELD_BULK_PENDING_VERIFIED_TAKEOFF",countedInWorkingTotal:id==="JB",
  status:id==="JB"?"OWNER_SELECTED_HISTORICAL_BUDGET__MTO_CONFIGURATION_OPEN":"NOT_PRICED__NOT_ZERO__EXION_SCOPE_GAP",
  ...(id==="JB"?{requiredQtySource:"MTO-0001 C1 29-Oct-2026 p3 A-3: four JB, one per ZWP20/21/22/23",
   priceBasis:"OWNER_RECONFIRMED_EXISTING_INTERNAL_BUDGET_20261103",
   budgetAllowance:{unitCostTHB:selectedPrice.jbTHB,source:selectedPrice.quoteProsper,
    sourceLine:"3",selected:true,additive:true,currentSupplierQuoteVerified:false,
    technicalApproval:false,note:"Restore existing internal allowance once per site; historical 300x300x160 / four-entry comparable is not proof of the MTO 200x120x200 / four-plus-one-entry assembly. Additional glands remain unpriced."},
   requiredDimensionsMm:[200,120,200],requiredMaterial:"SS316L",requiredProtection:"Ex eb IP66",
   requiredCableEntries:4,requiredSpareEntries:1,
   budgetReference:{quote:"Q-PROSRY-24051 Rev0",date:"2024-07-12",line:"4",sku:"07-56D2-0411",
    unitCostTHB:22000,sourceDimensionsMm:[200,200,120],sourceCableEntries:3,sourceDrainEntries:1,
    sourceUrl:"https://drive.google.com/file/d/19XSRRU_p8S-2JlSin82T4pdoOD4QOMGh/view",
    sourceQuoteQty:3,requiredProjectQty:4,selected:false,additive:false,
    state:"ENVELOPE_COMPARABLE__ENTRY_CONFIGURATION_AND_CURRENT_PRICE_UNVERIFIED",
    note:"Same three nominal dimensions with different axis order; confirm approved GA orientation. Historical box has three M20 cable entries plus dedicated drain, while MTO requires four entries plus one spare. Drain is not a spare cable entry. Do not post this rate as a completed MTO assembly or inherit old 3-set quantity."}}:{})}));
 return Object.freeze({site,mr:"MR-0003",items:[primary,...components,...fieldRows],
  controlledTotalTHB:primary.extended+fieldRows.find(r=>r.tag==="TCAB-504-001").extended,controlledTotalUSD:null,
  gaps:["JB allowance THB24500 is counted from existing owner-selected PROSPER item3 budget; current MTO size/entry configuration, supplier price and Ex assembly remain unverified. Additional glands are unpriced.",
   "-510 replaces quoted MGW -410; technical variant and certification not declared equivalent",
   "DDP Nonthaburi is not proof of delivery to exact SAMTEL Warehouse address",
   "30-day validity expired; 16 weeks ARO excludes December shutdown; THB/GBP adjustment clause retained",
   "EXION inland packing only; sea export repacking B5 and freight B6 separate"]});
});
export const MR0003_MGW_WORKING_BOM_0553=Object.freeze({
 id:"P553-MR0003-MGW-R2-WORKING-BOM",mr:"MR-0003",manufacturer:"Gai-Tronics / EATON",
 supplier:"EXION Thailand",selectedQuote:source,quoteUrl:sourceUrl,quoteNumber:"1260576 Rev0",
 sites,siteCount:4,budgetTotalTHB:sites.reduce((sum,s)=>sum+s.controlledTotalTHB,0),budgetTotalUSD:null,
 exionQuotedTotalTHB:828000,jbBudgetAllowanceTHB:sites.length*selectedPrice.jbTHB,
 historicalAlternative:{supplier:"MGW",quote:"P26-058_R2",packageUSD:6400,totalUSD:25600,selected:false,additive:false},
 status:"EXION_SELECTED__JB_GLANDS_VARIANT_AND_LOGISTICS_OPEN",directCostApproved:false,releaseAllowed:false
});
