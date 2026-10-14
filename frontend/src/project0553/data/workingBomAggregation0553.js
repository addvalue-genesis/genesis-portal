// Shared, read-only aggregation for System × Location and customer A1–A4 projections.
// This is NOT a second engineering derivation, customer price, or released A+B+C.
import {BOM_READ_MODEL_0553} from "./bomReadModel0553";
const MRS=["MR-0001","MR-0002","MR-0003","MR-0004"];
export const CUSTOMER_EQUIPMENT_MR_0553=Object.freeze({"A1":"MR-0001","A2":"MR-0002","A3":"MR-0003","A4":"MR-0004"});
export function selectWorkingBomProjection0553({mr="ALL",site="ALL"}={}){
 const source=BOM_READ_MODEL_0553.rows.filter(r=>(mr==="ALL"||r.mr===mr)&&(site==="ALL"||r.site===site));
 const rows=source.map(r=>{
  // Mirror the current System-Location MTO precisely: detailRows first,
  // otherwise legacy evidence converted to a display/projection line.
  const items=r.detailRows?.length?r.detailRows.map(x=>({...x,scenarioEvidence:false})):
   (r.evidence||[]).map((x,i)=>({
    id:String(x.line||i),tag:x.line,description:x.description,qty:x.assumedQty,
    currency:x.currency,unitCost:x.unit,extended:x.extended,source:x.source,
    status:x.kind,owner:x.costOwner||"EVIDENCE_ONLY",
    countedInWorkingTotal:Number.isFinite(x.extended),scenarioEvidence:true
   }));
  return {...r,items};
 });
 const lines=rows.flatMap(r=>r.items.map((item,index)=>({
  mr:r.mr,site:r.site,id:item.id||item.tag||String(index),
  tag:item.tag||item.id||null,currency:item.currency||null,
  extended:item.extended,source:item.source||null,owner:item.owner||null,
  scenarioEvidence:Boolean(item.scenarioEvidence),
  counted:item.countedInWorkingTotal===true&&Number.isFinite(item.extended),
  item
 })));
 const currencies={};
 for(const x of lines)if(x.counted){
  // The UI must expose invalid/missing currencies rather than invent one.
  if(!x.currency)continue;
  currencies[x.currency]=Math.round(((currencies[x.currency]||0)+x.extended)*100)/100;
 }
 return {rows,lines,currencies,priced:lines.filter(x=>x.counted).length,
  unresolved:lines.filter(x=>!x.counted||!x.currency).length,
  scenario:lines.some(x=>x.scenarioEvidence),
  orphanCurrency:lines.filter(x=>x.counted&&!x.currency).length,
  basis:"BOM_READ_MODEL_0553 / same rows and filters as System-Location MTO",
  releaseAllowed:false};
}
export function workingBomByCustomerA0553(){
 return Object.fromEntries(Object.entries(CUSTOMER_EQUIPMENT_MR_0553).map(([code,mr])=>[code,selectWorkingBomProjection0553({mr})]));
}
export function compareAEquipmentToLocation0553(){
 return MRS.map(mr=>{
  const cost=selectWorkingBomProjection0553({mr});
  return {mr,customerLine:Object.keys(CUSTOMER_EQUIPMENT_MR_0553).find(x=>CUSTOMER_EQUIPMENT_MR_0553[x]===mr),
    currencies:cost.currencies,priced:cost.priced,unresolved:cost.unresolved,
    scenario:cost.scenario,orphanCurrency:cost.orphanCurrency};
 });
}
