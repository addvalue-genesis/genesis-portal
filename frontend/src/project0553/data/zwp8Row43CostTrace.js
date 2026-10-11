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
const radioCodes=["B-1","B-2","B-3","B-5","B-6","B-7","B-8"];
const antennaAlternatives=[["4FT","B-12"],["6FT","B-11"]];
const quoteUnit=code=>{
 const line=lines.get(code);
 return line&&Number.isFinite(line.unitPrice)?line.unitPrice:null;
};
const radioEach=radioCodes.every(code=>quoteUnit(code)!==null)?
 Math.round(radioCodes.reduce((sum,code)=>sum+quoteUnit(code),0)*100)/100:null;
// Two MTO ODU Sets and two MTO antenna Sets are explicitly registered,
// but their equivalence to two physical installed OEM assemblies is an ASSUMPTION.
const referenceScenarios=antennaAlternatives.map(([label,code])=>{
 const antennaEach=quoteUnit(code);
 const subtotal=radioEach!==null&&antennaEach!==null?
 Math.round((2*radioEach+2*antennaEach)*100)/100:null;
 return {id:"ZWP8-ROW43-"+label,antennaLabel:label,antennaQuoteLine:code,
  assumedRadioAssemblies:2,assumedAntennas:2,radioCodes,
  radioAssemblyUnitUSD:radioEach,antennaUnitUSD:antennaEach,
  partialEquipmentUSD:subtotal,currency:"USD",
  assumption:"Two ODU sets and two antenna sets provisionally treated as two physical remote radio assemblies and two matching antennas; NOT engineering accepted",
  excluded:"Separate IDU/feature integration proof, licensing region, NMS, warranty, cable, feeder, gland, enclosure, FAT/SAT, site services and risk",
  state:"BUDGETARY_PARTIAL_REFERENCE_ONLY"};
});

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
 referenceScenarios,
 caution:"Quote group quantities are global, not per-ZWP8 site; candidate antenna diameters are mutually exclusive."
});
