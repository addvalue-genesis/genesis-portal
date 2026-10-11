// ZWP8 grouped-row 43 quote-rate worksheet. No inferred site allocation or OEM approval.
import MTO from "./snapshots/mr0001.mto.rev04.sourceRows.json";
import NEXTG from "./quotes/NG-260916-ADV-DAP1.full.json";
const source=MTO.itemRows.find(r=>r.platform==="ZWP8"&&r.sourceRowIndex===43);
const lines=new Map(NEXTG.lines.map(q=>[q.code,q]));
const families={
 "MR-502-003":{role:"Radio ODU candidate",codes:["B-1","C-1"]},
 "MR-502-003A":{role:"Radio IDU requirement",codes:[]},
 "ANT-502-002":{role:"Antenna; 4ft/6ft design conflict",codes:["B-11","B-12","B-13","C-11","C-12"]},
 "MR-502-004":{role:"Radio ODU candidate",codes:["B-1","C-1"]},
 "MR-502-004A":{role:"Radio IDU requirement",codes:[]},
 "ANT-502-003":{role:"Antenna; 4ft/6ft design conflict",codes:["B-11","B-12","B-13","C-11","C-12"]}
};
if(!source||source.sourceItemCodes.length!==6)throw Error("ZWP8 source row 43 must have six codes");
export const ZWP8_ROW43_COST_TRACE=Object.freeze({
 site:"ZWP8",mr:"MR-0001",sourceRow:43,sourceQtyText:source.sourceQuantityText,
 sourceRevision:"MTO Rev04",quote:NEXTG.quoteNumber,
 items:source.sourceItemCodes.map((tag,i)=>({
  id:"PJ2608-0553 / bid.budget.bom.zwp8."+tag.toLowerCase()+".43",
  tag,role:families[tag].role,sourceScopeText:source.sourceQuantityText.split("\n")[i]||null,
  sourceQty:1,sourceUnit:"Set",physicalQty:null,selectedSKU:null,selectedRate:null,
  candidates:families[tag].codes.map(code=>lines.get(code)).filter(Boolean).map(q=>({
   quoteLine:q.code,sku:q.partNumber,quoteQty:q.qty,unitPriceUSD:q.unitPrice,
   quotedExtendedUSD:q.quotedTotal,pricingState:q.pricingState
  })),
  provisionalExtendedUSD:null,verifiedExtendedUSD:null,
  decision:tag.endsWith("A")?"Determine whether IDU is integrated or separately supplied; never double count":"Verify RF topology, antenna dimensions, capacity, included accessories and site ownership",
  state:"REQUIRES_ENGINEERING_ALLOCATION"
 })),
 quotedTotalUSD:NEXTG.quotedGrandTotal,allocatedSiteTotalUSD:null,
 caution:"Quote group quantities are global, not per-ZWP8 site; candidate antenna diameters are mutually exclusive."
});
