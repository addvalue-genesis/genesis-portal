// Working priced scope, driven by MTO Rev04 source Set counts, NOT a verified OEM physical BOM.
// Non-grouped source Set rows close documentary quantities. Grouped rows expand per explicit code,
// requiring native Excel cell verification. Cisco package is a provisional equipment composition.
import MTO from "./snapshots/mr0001.mto.rev04.sourceRows.json";
import { SUPPLIER_QUOTE_LINES_0553 } from "./supplierQuoteLines";
const quotes=new Map(SUPPLIER_QUOTE_LINES_0553.map(q=>[q.id,q]));
const lines=(id)=>quotes.get(id)?.lines||[];
const pricedSource=(id,code)=>{
 const q=quotes.get(id),row=lines(id).find(x=>x[0]===code);
 if(!q||!row)return null;
 return {quoteId:id,quoteLine:code,sku:row[1],description:row[2],quoteQty:row[3],
  unitPrice:Number.isFinite(row[4])?row[4]:null,currency:q.currency,sourceStatus:q.status};
};
const switchTags=new Set(["LAN-502-001","LAN-502-002"]);
const switchCodes=["1.0","1.0.1","1.1","1.2","1.3","1.4","1.5","1.6","1.6.1","2.0","2.0.1"];
const switchOffers=switchCodes.map(code=>pricedSource("VST-0048-RE1",code));
const lineQtyText=r=>r.sourceQuantityText.split(/\n/).map(s=>s.trim()).filter(Boolean);
const rows=MTO.itemRows.flatMap(r=>{
 const tags=r.sourceItemCodes.length?r.sourceItemCodes:[r.sourcePartText];
 const qtyTokens=lineQtyText(r);
 return tags.map((tag,i)=>{
  const textual=r.groupedRow?qtyTokens[i]||null:r.sourceQuantityText;
  const matched=String(textual||"").trim().match(/^(\d+)\s+(Set|Lot)$/i);
  const quantity=matched?Number(matched[1]):null;
  const unit=matched?matched[2]:null;
  const switchRow=switchTags.has(tag);
  const related=switchRow?switchOffers.filter(Boolean):[];
  return {id:r.sourceRowIndex+"-"+i,site:r.platform,sourceRow:r.sourceRowIndex,
   sourceTag:tag,description:r.sourceDescription,sourceQtyText:textual,
   sourceScopeQty:quantity,sourceScopeUnit:unit,
   sourceState:quantity===null?"SOURCE_QTY_REVIEW":r.groupedRow?"GROUPED_MTO_SPLIT_PRELIMINARY":"MTO_QTY_RECORDED",
   bomType:switchRow?"L3_SWITCH_CISCO_BUNDLE_CANDIDATE":"REQUIRED_SCOPE_OBJECT",
   configuration:switchRow?related:[],requiredPackageQty:quantity,
   engineeringRequiredSkuQty:null,acceptedPrice:null,
   indicativePackageCostTHB:switchRow&&quantity!==null&&related.every(x=>Number.isFinite(x.unitPrice))?
    related.reduce((sum,x)=>sum+x.unitPrice,0)*quantity:null,
   costStatus:switchRow?"PROVISIONAL_PRICE_SOURCE_PACKAGE_NOT_OEM_APPROVED":"AWAITING_PHYSICAL_OEM_TAKEOFF",
   releaseAllowed:false};
 });
});
const scoped=rows.filter(r=>r.bomType==="L3_SWITCH_CISCO_BUNDLE_CANDIDATE");
const perSwitch=switchOffers.reduce((n,x)=>n+(x?.unitPrice||0),0);
export const MR0001_WORKING_PRICED_BOM=Object.freeze({
 projectId:"PJ2608-0553",source:"MTO Rev04",status:"WORKING_PRELIMINARY_SCOPE_WITH_PRICED_CISCO_PACKAGE",
 items:rows,sourceRowCount:MTO.itemRows.length,sourceItemCount:rows.length,
 cisco:{siteCount:scoped.length,sourceScopeSets:scoped.reduce((n,r)=>n+(r.sourceScopeQty||0),0),
  sourceQuote:"A-0048/2026_Re1",quoteQty:5,currency:"THB",
  items:switchOffers,unitPackageQuotedSumTHB:perSwitch,
  indicativeExtendedTHB:scoped.reduce((n,r)=>n+(r.indicativePackageCostTHB||0),0),
  sourceTotalTHB:quotes.get("VST-0048-RE1").quotedTotal,
  status:"MTO_SET_QTY_AND_QUOTE_TOTAL_MATCH__CONFIGURATION_REVIEW"},
 assumptions:["Cisco 11 quote codes represent one potential switch procurement bundle, including subscriptions and source zero-price codes",
  "One quoted group per MTO LAN Set is a working package scenario, not an approved OEM design",
  "5 existing Cisco quote quantities reconcile with four new ZWP20-23 plus one ZWP8 LAN source Set",
  "No multiplication of radio or accessories by unverified OEM SKU quantities",
  "Grouped source tag splits require checking native Excel cells",
  "Historical/customer sell prices not used as equipment cost"],
 customerReleaseAllowed:false
});
