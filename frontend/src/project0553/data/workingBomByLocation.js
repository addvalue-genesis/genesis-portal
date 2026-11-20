// P553-WORKING-BOM-LOCATION / ACTIVE / read-only presentation projection.
// Purpose: location -> MTO object -> applicable vendor evidence -> priced scenario.
// Inputs: MR0001 MTO/working BOM, source-backed family candidate crossmap, quote registry.
// Never multiply quote-wide offered quantity by possible consumers or treat candidate as selected.
// Downstream: Budget Working Preview only; original document/revisions and cost spine unchanged.
import { MR0001_WORKING_PRICED_BOM } from "./mr0001WorkingPricedBom";
import { MR0001_FIRST_PRINCIPLES_DERIVATION } from "./mr0001FirstPrinciplesDerivation";
import { MR0001_PRELIMINARY_LINK_BUDGET } from "./mr0001PreliminaryLinkBudget";
import { MR0001_SITE_CLASSIFICATION } from "./mr0001SiteClassification";
import { MR0001_ENGINEERING_REQUIRED_BOM } from "./mr0001RequiredBomDerivation";
import { SUPPLIER_QUOTE_LINES_0553 } from "./supplierQuoteLines";
const quotesById=new Map(SUPPLIER_QUOTE_LINES_0553.map(q=>[q.id,q]));
const sourceRows=new Map(MR0001_ENGINEERING_REQUIRED_BOM.rows.map(r=>[r.sourceRowIndex,r]));
// Grouped MTO source rows contain separate radio/antenna tags, not one OEM family.
const groupedTagFamily=tag=>{
 const t=String(tag||"").toUpperCase();
 if(t.startsWith("ANT-"))return "ANTENNA";
 if(t.startsWith("MR-")&&t.endsWith("A"))return "IDU";
 if(t.startsWith("MR-"))return "ODU";
 return null;
};
const leafQuoteLines={
 ODU:["A-1","B-1","C-1"],
 ANTENNA:["A-12","B-11","B-12","B-13","C-11","C-12"]
};
const vendorEvidenceFor=(item)=>{
 const source=sourceRows.get(item.sourceRow);
 const family=source?.groupedRow?groupedTagFamily(item.sourceTag):null;
 const options=family?(leafQuoteLines[family]||[]).flatMap(code=>{
  const q=quotesById.get("NG-260916");
  const line=q?.lines?.find(v=>v[0]===code);
  return line?[{quoteId:q.id,quoteLine:code,vendor:q.vendor,sku:line[1],currency:q.currency,
   sourceUnitPrice:Number.isFinite(line[4])?line[4]:null,quotedQty:line[3],
   quotedSourceStatus:q.status}]:[];
 }):source?.vendorPriceCandidates||[];
 return options.map(v=>{
  const q=quotesById.get(v.quoteId);
  return {quoteId:v.quoteId,quoteLine:v.quoteLine,vendor:q?.vendor||v.vendor,
   sku:v.sku,originalCurrency:v.currency,originalUnitPrice:v.sourceUnitPrice,
   offeredQuoteQty:v.quotedQty,quoteStatus:q?.status||v.quotedSourceStatus,
   selected:false,approvedQty:null,extendedCost:null};
 });
};
const items=MR0001_WORKING_PRICED_BOM.items.map(item=>({
 ...item,system:"MR-0001",vendorCandidates:vendorEvidenceFor(item),
 pricedVendor:item.bomType==="L3_SWITCH_CISCO_BUNDLE_CANDIDATE"?"VST ECS (Thailand) / Cisco":null,
 workingPriceStatus:Number.isFinite(item.indicativePackageCostTHB)?"PRELIMINARY_SCENARIO":"SOURCE_PRICE_ONLY_OR_NOT_MAPPED"
}));
const locations=[...new Set(items.map(item=>item.site))].map(site=>({
 site,siteClass:MR0001_SITE_CLASSIFICATION.sites[site],items:items.filter(item=>item.site===site),
  rfDemand:MR0001_FIRST_PRINCIPLES_DERIVATION.locations.find(x=>x.site===site),
  rfProof:MR0001_PRELIMINARY_LINK_BUDGET.links.filter(x=>x.from===site||x.to===site)
}));
const vendorNames=[...new Set(SUPPLIER_QUOTE_LINES_0553.filter(q=>q.mr.split("/").includes("MR-0001")).map(q=>q.vendor))];
export const WORKING_BOM_BY_LOCATION_0553=Object.freeze({
 id:"P553-LOCATION-BOM",system:"MR-0001",locations,items,
 vendors:vendorNames,quoteRegistry:SUPPLIER_QUOTE_LINES_0553,
 source:"MTO Rev04 → MR0001 Engineering Required BOM → Vendor Quote Source Registry",
 currencyRule:"Vendor quoted prices retain original currency; Cisco preliminary package priced THB only.",
 status:"INTERNAL_WORKING_PRELIMINARY",releaseAllowed:false
});
