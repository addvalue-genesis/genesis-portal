import React,{useMemo,useState} from 'react';
import {a1SummarySlot0550,nativeSchedule0550,nativeExhibitProblems0550,nativeFormCss0550,nativeExhibitHtml0550,downloadNativeExhibit0550} from './exhibitCNative0550';
import {MgwScheduleSource0550} from './WorkingSchedulePreview0550';
import {SchedulePriceDiagnostics0550} from './SchedulePriceDiagnostics0550';
import {C1Appendix0550} from './C1Appendix0550';
import {C1_APPENDIX_LAYOUT_0550} from './data/c1Appendix0550';
import {scheduleRollup0550,scheduleViewTHB0550} from './data/scheduleRollup0550';

const a1DirectRows=[
 [3,'S/N 2 · Inspection and tests'],
 [4,'S/N 3 · Preservation and packing for shipment'],
 [10,'S/N 9 · Vendor Documents'],
 [11,'Others (Please specify)'],
];
const money=value=>Number.isFinite(value)?value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'OPEN';

function A1DirectReview0550({view,currency,onNavigate,onAllocate,disabled}){
 const direct=view.bindings.filter(b=>b.line&&b.schedule==='A1'&&b.treatment==='BASE');
 return <section aria-label="11.A1 internal direct allocation review">
  <h4>11.A1 · รายการย่อยสำหรับตรวจทานภายใน</h4>
  <p>เปิดตามข้อใน 11.A1 เพื่อดูรายการจาก Working ที่จัดเข้า A1 โดยตรง พร้อมฐานสำหรับเตรียมคำอธิบาย</p>
  {a1DirectRows.map(([slot,label])=>{
   const rows=direct.filter(b=>a1SummarySlot0550(b)===slot);
   const subtotal=scheduleRollup0550(rows);
   return <details key={slot}>
    <summary>{label} · {subtotal.count} รายการ{subtotal.priced>0?' · ยอดที่มีราคา '+currency+' '+money(subtotal.knownUSD):''}{subtotal.open>0?' · '+subtotal.open+' OPEN':''}</summary>
    {rows.length===0?<p>ยังไม่มีรายการจัดเข้า A1 โดยตรงในข้อนี้</p>:<div className="p55-table-wrap"><table className="p55-table" aria-label={label}>
     <thead><tr><th>รายการ Working</th><th>จำนวน / หน่วย</th><th>ราคาขาย {currency}</th><th>ฐานสำหรับเตรียมคำอธิบาย</th><th>เปิดรายการต้นทาง</th></tr></thead>
     <tbody>{rows.map(b=><tr key={b.lineId}>
      <td><strong>{b.line.description}</strong><small>{b.lineId} · {b.line.wbs}</small></td>
      <td>{b.quantity??'OPEN'} {b.unit}</td>
      <td>{money(b.amount)}</td>
      <td><small>{b.suggested?'SI แนะนำ · ยังไม่บันทึก':b.state}</small><p>{b.basis||'ยังไม่ระบุฐานการจัดหมวด'}</p>{b.locator&&<details><summary>หลักฐานอ้างอิง</summary><p>{b.locator}</p></details>}</td>
      <td><button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.line.'+b.lineId)}>เปิด Working</button> <button type="button" disabled={disabled} onClick={()=>onAllocate?.(b.lineId)}>เปิด 11.M</button></td>
     </tr>)}</tbody>
    </table></div>}
   </details>;
  })}
 </section>;
}

export function LazyNativeExhibitC0550(props){
 const [open,setOpen]=useState(false);
 return <details open={open} onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}><summary>{props.label}</summary>{open&&<NativeExhibitC0550 {...props}/>}</details>;
}

export function NativeExhibitC0550({view,id,currency='USD',onAllocate,onNavigate,disabled=false}){
 view=useMemo(()=>id==='C1'?{...view,c1LayoutVersion:C1_APPENDIX_LAYOUT_0550}:view,[view,id]);
 const screenView=useMemo(()=>currency==='THB'?scheduleViewTHB0550(view):view,[view,currency]);
 const form=useMemo(()=>id==='C1'?null:nativeSchedule0550(screenView,id,currency),[screenView,id,currency]),count=id==='A1'?view.bindings.filter(b=>b.line&&b.treatment==='BASE').length:id==='A2'?view.bindings.filter(b=>b.line&&b.treatment==='OPTION').length:view.scheduleRows(id).length;
 const problems=useMemo(()=>nativeExhibitProblems0550(view,id),[view,id]);
 const print=()=>{
  const frame=document.createElement('iframe');frame.style.cssText='position:fixed;width:1px;height:1px;left:-10000px';
  frame.onload=()=>{frame.contentWindow.focus();frame.contentWindow.print();setTimeout(()=>frame.remove(),60000);};
  frame.srcdoc=nativeExhibitHtml0550(view,id);document.body.appendChild(frame);
 };
 return <section aria-label={'Native Exhibit C Schedule '+id}>
  <style>{nativeFormCss0550}</style>
  <div className="p55-native-toolbar"><button type="button" disabled={disabled} onClick={()=>downloadNativeExhibit0550(view,'docx',id)}>Export Schedule {id} Word (.docx)</button><button type="button" disabled={disabled} onClick={print}>พิมพ์ Schedule {id} / PDF</button><button type="button" disabled={disabled} onClick={()=>downloadNativeExhibit0550(view,'docx')}>Export Exhibit C Word ทั้งชุด</button></div>
  {id==='C1'?<C1Appendix0550 view={view} currency={currency} onNavigate={onNavigate} disabled={disabled}/>:<p className="p55-native-help">แบบฟอร์มจาก Exhibit C rev-0 · Currency: {currency} · {count} รายการจาก Working · {view.workingPreview?'ร่างพร้อมการจัดหมวดแนะนำ / ราคาที่ยังรอทบทวน':'ข้อมูลที่บันทึก / ราคาที่ผ่านการทบทวน'} · ข้อมูลที่ขาดคง OPEN</p>}
  <details className="p55-c1-internal-diagnostics" open={id!=='C1'}><summary>SI · ตรวจราคา / การจัดหมวดภายใน</summary>
  {id==='A1'&&<A1DirectReview0550 view={screenView} currency={currency} onNavigate={onNavigate} onAllocate={onAllocate} disabled={disabled}/>}
  <SchedulePriceDiagnostics0550 view={screenView} id={id} currency={currency} onNavigate={onNavigate} onAllocate={onAllocate} disabled={disabled}/>
  {view.unallocated.length>0&&<p className="p55-native-issues">Working อีก {view.unallocated.length} รายการยังไม่ได้ระบุช่องปลายทาง <button type="button" onClick={()=>onAllocate?.()}>จัดรายการลงแบบฟอร์ม 11.M</button></p>}
  {problems.length>0&&<ul className="p55-native-issues">{problems.map((p,i)=><li key={i}>{p}</li>)}</ul>}
  {id==='C1'&&view.workingPreview&&<MgwScheduleSource0550 view={view} onNavigate={onNavigate} disabled={disabled}/>}
  </details>
  {id!=='C1'&&<div className="p55-native-scroll" dangerouslySetInnerHTML={{__html:form.html}}/>}
 </section>;
}
