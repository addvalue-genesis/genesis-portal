import React from 'react';
import {a1SummarySlot0550} from './exhibitCNative0550';
import {scheduleBindingTHB0550,scheduleRollup0550} from './data/scheduleRollup0550';

const inspectionSlot=a1SummarySlot0550({schedule:'A1',summary:'INSPECTION'});
const money=value=>Number.isFinite(value)?value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'OPEN';
export const a1InspectionRows0550=view=>view.bindings.filter(b=>b.line&&b.treatment==='BASE'&&!b.nonAdditive&&a1SummarySlot0550(b)===inspectionSlot);

export function A1InspectionBreakdown0550({view,currency}){
 const bindings=a1InspectionRows0550(view);
 const rows=currency==='THB'?bindings.map(scheduleBindingTHB0550):bindings;
 const subtotal=scheduleRollup0550(rows);
 const amount=view.workingPreview?subtotal.knownUSD:subtotal.totalUSD;
 return <article aria-label="A1 S/N 2 supporting breakdown">
  <h3>11.D · Supporting Breakdown</h3>
  <p><strong>DRAFT — NOT FOR SUBMISSION</strong></p>
  <h4>Schedule A1 S/N 2 · Inspection and tests with witness by COMPANY and PURCHASER</h4>
  <p>Supporting detail for the 1 Lot price under Schedule A1 S/N 2.</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Inspection and tests breakdown">
   <thead><tr><th>S/N</th><th>Service description</th><th>Qty.</th><th>Unit</th><th>Unit rate ({currency})</th><th>Amount ({currency})</th></tr></thead>
   <tbody>{rows.length?rows.map((b,index)=><tr key={b.lineId}>
    <td>2.{index+1}</td><td>{b.line.description}</td><td>{b.quantity??'OPEN'}</td><td>{b.unit||'OPEN'}</td><td>{money(b.unitPrice)}</td><td>{money(b.amount)}</td>
   </tr>):<tr><td colSpan={6}>No inspection or testing service is allocated to Schedule A1 S/N 2.</td></tr>}</tbody>
   <tfoot><tr><th colSpan={5}>{view.workingPreview&&subtotal.open?'Priced items subtotal':'Schedule A1 S/N 2 · 1 Lot'}</th><td>{money(amount)}</td></tr></tfoot>
  </table></div>
  {subtotal.open>0&&<p>{subtotal.priced}/{subtotal.count} items priced · {subtotal.open} OPEN</p>}
 </article>;
}
