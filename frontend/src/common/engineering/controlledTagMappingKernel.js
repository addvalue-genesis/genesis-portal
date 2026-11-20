// Generic deterministic engineering mapping primitives (no project facts or React).
// Caller provides requirements, approved/current evidence and owner keys.
export const roundMoney=n=>Number.isFinite(n)?Math.round(n*100)/100:null;
export const normalizedEquipmentTag=t=>String(t||"").replace(/\s+/g,"").toUpperCase();

/** Independent rate calculation. Original vendor NULL is retained, not converted to zero. */
export function deriveSourcedExtended({quantity,sourceUnitRate,currency,assumption=null}){
 if(!Number.isFinite(quantity)||quantity<0)return {amount:null,state:"ERROR_QUANTITY",sourceRate:sourceUnitRate??null};
 if(typeof currency!=="string"||!currency.trim())return {amount:null,state:"ERROR_CURRENCY",sourceRate:sourceUnitRate??null};
 if(Number.isFinite(sourceUnitRate))return {amount:roundMoney(quantity*sourceUnitRate),state:"SOURCE_RATE",sourceRate:sourceUnitRate,currency};
 if(assumption&&Number.isFinite(assumption.unitRate)&&assumption.sourceId&&assumption.status){
  return {amount:roundMoney(quantity*assumption.unitRate),state:"MANAGEMENT_ASSUMPTION_NOT_VENDOR_QUOTE",
   sourceRate:null,assumptionUnitRate:assumption.unitRate,assumptionSourceId:assumption.sourceId,
   assumptionStatus:assumption.status,currency};
 }
 return {amount:null,state:"UNKNOWN_VENDOR_RATE",sourceRate:null,currency};
}
/** Assert a quotation row is the exact same record indexed by 07 Vendor. */
export function matchQuotedSourceLine({offer,line,index,catalogRelationship,technicalRecord,expectedFunction=null}){
 const issues=[];
 if(!offer?.id||!line||!Number.isInteger(index)||index<0)issues.push("SOURCE_ROW_MISSING");
 if(catalogRelationship?.quoteId!==offer?.id||catalogRelationship?.id!==offer?.id+":"+index)issues.push("QUOTE_ROW_ID_MISMATCH");
 if(line?.partNumber!==catalogRelationship?.productKey)issues.push("SKU_MISMATCH");
 if(line?.unitPrice!==catalogRelationship?.unitPrice)issues.push("SOURCE_RATE_MISMATCH");
 if(line?.qty!==catalogRelationship?.quantity)issues.push("QUOTED_QUANTITY_MISMATCH");
 if(offer?.currency!==catalogRelationship?.currency)issues.push("CURRENCY_MISMATCH");
 if(line?.partNumber!==technicalRecord?.partNumber)issues.push("TECH_EVIDENCE_SKU_MISMATCH");
 if(expectedFunction&&technicalRecord?.functionId!==expectedFunction)issues.push("TECH_FUNCTION_MISMATCH");
 return {matched:issues.length===0,issues,originalRate:line?.unitPrice??null,
  sourceQuoteQty:line?.qty??null,currency:offer?.currency??null};
}
/** Source line may have one physical owner. Grouping by currency never merges unlike currencies. */
export function reconcileTagCostOwners({items,ledger,tolerance=0.01}){
 const problems=[],seen=new Set();
 const totals=new Map();
 for(const item of items){
  const sourceKey=String(item.sourceUsageKey||"");
  if(!sourceKey||seen.has(sourceKey)){problems.push("DUPLICATE_OR_EMPTY_SOURCE_USAGE:"+sourceKey);continue}
  seen.add(sourceKey);
  if(!item.ownerId||!item.currency||!Number.isFinite(item.amount)){
   problems.push("UNRECONCILABLE_LINE:"+sourceKey);continue;
  }
  const key=item.ownerId+"|"+item.currency;
  totals.set(key,roundMoney((totals.get(key)||0)+item.amount));
 }
 const ownerResults=ledger.map(l=>{
  const found=totals.get(l.ownerId+"|"+l.currency);
  const compatible=Number.isFinite(found)&&Number.isFinite(l.extended);
  const delta=compatible?roundMoney(found-l.extended):null;
  return {...l,mappedAmount:found??null,delta,
   pass:compatible&&Math.abs(delta)<=tolerance};
 });
 for(const item of items)if(!ledger.some(l=>l.ownerId===item.ownerId&&l.currency===item.currency)){
  problems.push("NO_LEDGER_OWNER_OR_CURRENCY:"+item.ownerId+"|"+item.currency);
 }
 return {ownerResults,problems,pass:!problems.length&&ownerResults.every(l=>l.pass),sourceUsageCount:seen.size};
}
