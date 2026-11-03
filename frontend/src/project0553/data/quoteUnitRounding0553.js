// Owner03-Nov2026: round quoted USD units UP to tens, then sum children.
export const QUOTE_UNIT_INCREMENT_USD_0553=10;
export function roundQuoteUnitUp0553(value){
 if(value===null||value===undefined)return null;
 if(value===0)return 0;
 if(!Number.isFinite(value)||value<0)throw Error("Invalid quoted unit price");
 return Math.ceil(value/QUOTE_UNIT_INCREMENT_USD_0553-1e-10)*QUOTE_UNIT_INCREMENT_USD_0553;
}
export function roundQuotedRowsUp0553(rows,{quantityKey="qty",amountKey="totalUSD"}={}){
 return rows.map(r=>{
  if(r.unitUSD===null||r.unitUSD===undefined)return {...r};
  const qty=r[quantityKey];if(!Number.isFinite(qty)||qty<=0)throw Error("Quoted rounding requires known quantity "+(r.id||r.key));
  const unitUSD=roundQuoteUnitUp0553(r.unitUSD),total=Math.round(qty*unitUSD*100)/100;
  return {...r,preTensUnitUSD:r.unitUSD,preTensTotalUSD:r[amountKey],unitUSD,[amountKey]:total,
   unitRoundingUSD:QUOTE_UNIT_INCREMENT_USD_0553,
   ...(Number.isFinite(r.sourceTotalUSD)?{roundingAdjustmentUSD:Math.round((total-r.sourceTotalUSD)*100)/100}:{}),upwardRoundingUSD:Math.round((total-r[amountKey])*100)/100};
 });
}
