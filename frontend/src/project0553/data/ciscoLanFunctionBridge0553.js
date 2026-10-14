// Read-only Cisco LAN function-to-quote bridge. Does not create or post costs.
// Source: existing VST ECS quote registry; source MTO controls one working Set per TAG.
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
const mapping=Object.freeze([
 {functionId:"NETWORK_SWITCH",lines:["1.0","1.0.1"],note:"IE3400 hardware + its 3-year SmartNet. Support is costed once, not extra hardware."},
 {functionId:"NETWORK_LICENCE",lines:["1.6.1"],note:"DNA Essentials 3-year term; perpetual Network Essentials entitlement must be verified."},
 {functionId:"DC_POWER",lines:["1.1"],note:"IE65W DC power module; site power/interface suitability remains unapproved."},
 {functionId:"SFP_INTERFACE",lines:["2.0"],note:"IE3300 copper expansion module is NOT an SFP transceiver; confirm actual optical SFP need separately."},
 {functionId:"CONFIGURATION",lines:["2.0.1"],note:"1-year SmartNet for expansion, NOT installation/configuration labour; term differs from switch support."}
]);
const round=n=>Math.round(n*100)/100;
export function bridgeCiscoLan0553(site,tagRow,requiredFunctions=[]){
 if(!["LAN-502-001","LAN-502-002"].includes(tagRow.tag)||!Number.isFinite(tagRow.extended)||tagRow.currency!=="THB")return null;
 const quote=SUPPLIER_QUOTE_LINES_0553.find(q=>q.id==="VST-0048-RE1");
 if(!quote)return null;
 const sourceQty=tagRow.sourceQty;
 if(!Number.isFinite(sourceQty)||sourceQty<=0)return null;
 const byLine=new Map(quote.lines.map(line=>[line[0],line]));
 const functions=mapping.map(group=>{
  const lines=group.lines.map(code=>({code,source:byLine.get(code)}));
  if(lines.some(x=>!x.source||!Number.isFinite(x.source[4])))return null;
  const unit=round(lines.reduce((sum,x)=>sum+x.source[4],0));
  return {id:"CISCO_"+group.functionId,functionId:group.functionId,allocationOwner:tagRow.tag+"."+tagRow.row,
   requiredQty:sourceQty,quantityState:"MTO_SET_BUDGET_QTY_NOT_APPROVED_PHYSICAL_SKU",currency:"THB",
   budgetaryUnitPrice:unit,budgetaryExtended:round(unit*sourceQty),
   budgetarySelectedSKU:lines.map(x=>x.source[1]).join(" + "),budgetaryQuoteLine:lines.map(x=>x.code).join(" + "),
   priceEvidenceType:"VST_ECS_WORKING_QUOTE_RATE_EXPIRED",budgetarySelectionState:"BUDGETARY_MAPPED_NOT_TECHNICALLY_APPROVED",
   budgetaryDecision:group.note,quoteLines:lines.map(x=>({code:x.code,sku:x.source[1],description:x.source[2],
    offeredQty:x.source[3],unit:x.source[4],extended:round(x.source[4]*sourceQty)}))};
 });
 if(functions.some(x=>!x)||requiredFunctions.some(id=>!functions.some(x=>x.functionId===id)))return null;
 const mappedTotal=round(functions.reduce((s,x)=>s+x.budgetaryExtended,0));
 const delta=round(mappedTotal-tagRow.extended);
 return {functions,mappedTotal,ledgerTotal:tagRow.extended,delta,reconciled:Math.abs(delta)<=0.01,
  quotation:quote.quotation,quoteId:quote.id,sourceCurrency:"THB",sourceQty,
  source:"VST ECS / "+quote.quotation+"; quoted cost is not approved physical SKU take-off or customer sell"};
}
