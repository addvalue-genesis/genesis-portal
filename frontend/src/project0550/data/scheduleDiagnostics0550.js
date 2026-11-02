// ADR 3,5,6,8,10–12: diagnose the existing projection; never price or allocate.
import {scheduleRollup0550} from './scheduleRollup0550';

export const customerPriceColumn0550=b=>/\bCIF\b/i.test(b.deliveryTerm)&&!/\bFOB\b/i.test(b.deliveryTerm)?'CIF':/\bFOB\b/i.test(b.deliveryTerm)&&!/\bCIF\b/i.test(b.deliveryTerm)?'FOB':'';
export function schedulePriceDiagnostics0550(view,id){
 const bindings=['A1','A2'].includes(id)?view.bindings.filter(b=>b.line&&b.treatment===(id==='A1'?'BASE':'OPTION')):view.scheduleRows(id);
 const splitColumns=['A2','C2','C3','C4','C5','C6'].includes(id);
 const rows=bindings.filter(b=>!b.nonAdditive).map(b=>{
  const gap=view.priceGaps?.find(g=>g.id===b.lineId),problems=[];
  if(!(Number.isFinite(b.quantity)&&b.quantity>0))problems.push('ยังไม่มีจำนวนที่ใช้ตั้งราคา');
  if(!Number.isFinite(b.amount))problems.push(view.workingPreview?'Working ยังไม่มีราคาขายที่คำนวณได้':'ยังไม่มีราคาที่ผ่านการทบทวน');
  if(Number.isFinite(b.amount)&&!Number.isFinite(b.unitPrice))problems.push('ยังคำนวณราคาต่อหน่วยไม่ได้');
  if(splitColumns&&!customerPriceColumn0550(b))problems.push('ยังไม่กำหนดช่องราคาลูกค้า CIF / FOB');
  return {binding:b,lineId:b.lineId,description:b.line.description,quantity:b.quantity,unit:b.unit,amount:b.amount,unitPrice:b.unitPrice,column:customerPriceColumn0550(b),problems,workingProblems:gap?.problems||[],workingTarget:'bid.budget.working.line.'+b.lineId,allocationTarget:'bid.quotation.line.'+b.lineId};
 });
 return {id,rows,...scheduleRollup0550(bindings),quantityOpen:rows.filter(r=>!(Number.isFinite(r.quantity)&&r.quantity>0)).length,columnOpen:splitColumns?rows.filter(r=>!r.column).length:0};
}
