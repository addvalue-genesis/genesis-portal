// Read-only summary of displayed customer cost lines. No engineering calculations or FX.
export const moneySummary0553=(lines,selector)=>({
 ...["THB","USD"].reduce((o,currency)=>{
  const values=lines.map(selector).filter(Boolean);
  const present=values.filter(v=>Number.isFinite(v[currency]));
  o[currency]=present.length?Math.round(present.reduce((n,v)=>n+v[currency],0)*100)/100:null;
  return o;
 },{}),
 lineCount:lines.length,
 missing:lines.filter(line=>{const v=selector(line);return !v||(!Number.isFinite(v.THB)&&!Number.isFinite(v.USD));}).map(x=>x.customerLine),
 complete:lines.every(line=>{const v=selector(line);return Boolean(v)&&(Number.isFinite(v.THB)||Number.isFinite(v.USD));})
});
export function mappingDisplaySummary0553(records,equipment,working,{part="ALL",query=""}={}){
 const shown=records.filter(row=>(part==="ALL"||row.customerLine.startsWith(part))&&(!query||[row.customerLine,row.description,row.engineeringSource,row.customerSheet].some(v=>String(v||"").toLowerCase().includes(query.trim().toLowerCase()))));
 const cost=moneySummary0553(shown,row=>{
  const x=equipment[row.customerLine];
  return x?{THB:x.thb,USD:x.usd}:null;
 });
 const sell=moneySummary0553(shown,row=>{
  const x=working.get(row.customerLine);
  return x?{THB:x.sellTHB,USD:null}:null;
 });
 return {shown,cost,sell};
}
export function grossMr0001Bridge0553(equipment){
 const a1=equipment.A1,a5=equipment.A5;
 const gross=a1?.grossMrTHB;
 const complete=Number.isFinite(gross)&&Number.isFinite(a1?.thb)&&Number.isFinite(a5?.thb);
 const allocated=complete?Math.round((a1.thb+a5.thb)*100)/100:null;
 return {grossTHB:Number.isFinite(gross)?gross:null,allocatedTHB:allocated,
  varianceTHB:complete?Math.round((allocated-gross)*100)/100:null,
  status:complete?(allocated===Math.round(gross*100)/100?"MATCH":"MISMATCH"):"UNRECONCILED"};
}
