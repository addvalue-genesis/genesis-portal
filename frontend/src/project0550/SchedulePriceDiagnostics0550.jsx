import React,{useState} from 'react';
import {SCHEDULES_0550} from './data/bidVolumes0550';
import {schedulePriceDiagnostics0550} from './data/scheduleDiagnostics0550';
import {scheduleBindingTHB0550,scheduleRollup0550,scheduleViewTHB0550} from './data/scheduleRollup0550';
import {a1InspectionRows0550} from './A1InspectionBreakdown0550';
import {a1OthersRows0550,A1_OTHERS_PANELS_0550} from './A1OthersBreakdown0550';

const money=v=>Number.isFinite(v)?v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'ยังไม่มีราคา';
const resultSchedules=SCHEDULES_0550.filter(({id})=>/^C[1-8]$/.test(id));
const supportingSchedules=[{id:'D',title:'Inspection and Tests'},...A1_OTHERS_PANELS_0550];

export function ScheduleParentResults0550({rows,id,system,currency,workingPreview,onNavigate,disabled}){
 const displayed=currency==='THB'?rows.map(scheduleBindingTHB0550):rows;
 const treatments=[
  ['BASE','11.A1 · Base','bid.quotation.A1'],
  ['OPTION',id==='C3'?'11.A2 · Option (อ้างอิงใน Notes ของ 11.A1)':'11.A2 · Option','bid.quotation.A2'],
  ['CALLOFF','Call-off · เรตตามการเรียกใช้',null]
 ];
 const results=treatments.map(([treatment,label,target])=>({treatment,label,target,...scheduleRollup0550(displayed.filter(row=>row.treatment===treatment))})).filter(result=>result.count);
 const selected=system&&scheduleRollup0550(displayed.filter(row=>row.line.systemToken===system));
 const describe=result=>result.priced?currency+' '+money(result.knownUSD)+' · มีราคา '+result.priced+'/'+result.count+' แถว'+(result.open?' · ยอดเฉพาะรายการที่มีราคา':''):'OPEN';
 return <section className="p55-panel" aria-label={'Schedule '+id+' linked price results'}>
  <h4>ผลราคา 11.{id} จาก Working ที่เชื่อมกับ A1 / A2</h4>
  <p>{workingPreview?'Working Preview · ยอดที่มีทั้งโครงการสำหรับ Schedule นี้':'ราคาที่ผ่านการทบทวนทั้งโครงการสำหรับ Schedule นี้'}</p>
  {results.length?<ul>{results.map(({treatment,label,target,...result})=><li key={treatment}>
   {target&&onNavigate?<button type="button" disabled={disabled} onClick={()=>onNavigate(target)}>{label}</button>:label}
   {' · '}<strong>{treatment==='CALLOFF'?result.count+' แถว · ดูเรตต่อหน่วยจาก Working':describe(result)}</strong>
  </li>)}</ul>:<p><strong>OPEN</strong> · ยังไม่มีรายการจัดลง Schedule นี้</p>}
  {selected&&<p>ผลเฉพาะระบบ {system} · <strong>{describe(selected)}</strong>{!selected.count&&' · ยังไม่มี Working B5 จัดลงระบบนี้'}</p>}
 </section>;
}

export function ScheduleResults0550({view,currency,onOpen,disabled}){
 const display=currency==='THB'?scheduleViewTHB0550(view):view;
 return <section className="p55-panel" aria-label="Volume I Schedule price results">
  <h3>ผลราคา 11.A1–A2, 11.C1–C8 และรายละเอียด 11.D–11.F</h3>
  <p>{view.workingPreview?'Working Preview · ยอดขายจาก Working ที่มีในแต่ละ Schedule':'เฉพาะรายการที่บันทึกและราคาที่ผ่านการทบทวน'} · D–F แจกแจงยอดใน A1</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Volume I price results">
   <thead><tr><th>Schedule</th><th>แถวมีราคา / ทั้งหมด</th><th>ยอดที่มี {currency}</th><th>ข้อมูลที่ยังขาด</th></tr></thead>
   <tbody>{[['A1','BASE'],['A2','OPTION']].map(([id,treatment])=>{
    const result=scheduleRollup0550(display.bindings.filter(b=>b.line&&b.treatment===treatment));
    const total=treatment==='BASE'?display.baseAssigned:display.optionsAssigned;
    return <tr key={id}>
     <th scope="row"><button type="button" disabled={disabled} onClick={()=>onOpen(id)}>เปิด 11.{id}</button> {treatment}</th>
     <td>{result.priced} / {result.count}</td>
     <td>{result.priced?money(result.knownUSD):'OPEN'}</td>
     <td>{!Number.isFinite(total)?'ยอดสัญญา OPEN · แสดงยอดเฉพาะรายการที่มีราคา':'ดูรายละเอียดในแบบฟอร์ม'}</td>
    </tr>;
   })}{resultSchedules.map(({id,title})=>{
    const d=schedulePriceDiagnostics0550(display,id);
    const gaps=[];
    if(!d.count)gaps.push('ยังไม่มีรายการ Working จัดลง Schedule');
    if(d.quantityOpen)gaps.push('จำนวน OPEN '+d.quantityOpen+' แถว');
    if(d.open)gaps.push('ราคา OPEN '+d.open+' แถว');
    if(d.columnOpen)gaps.push('CIF/FOB OPEN '+d.columnOpen+' แถว');
    if(id==='C7'){
     const hoursOpen=d.rows.filter(row=>row.unit!=='MH'||!Number.isFinite(row.quantity)).length;
     if(hoursOpen)gaps.push('ฐานชั่วโมงในฟอร์ม OPEN '+hoursOpen+' แถว');
    }
    return <tr key={id}>
     <th scope="row"><button type="button" disabled={disabled} onClick={()=>onOpen(id)}>เปิด 11.{id}</button> {title}</th>
     <td>{d.priced} / {d.count}</td>
     <td>{d.priced?<><strong>{money(d.knownUSD)}</strong>{d.open>0&&<small>ยอดเฉพาะรายการที่มีราคา</small>}{d.rows.some(row=>row.binding.line.spareBudget)&&<small>รวมงบประมาณร่าง</small>}</>:'OPEN'}</td>
     <td>{gaps.join(' · ')||'ดูรายละเอียดในแบบฟอร์ม'}</td>
    </tr>;
   })}{supportingSchedules.map(({id,title})=>{
    const rows=id==='D'?a1InspectionRows0550(display):a1OthersRows0550(display,id),result=scheduleRollup0550(rows);
    return <tr key={id}>
     <th scope="row"><button type="button" disabled={disabled} onClick={()=>onOpen(id)}>เปิด 11.{id}</button> {title}</th>
     <td>{result.priced} / {result.count}</td>
     <td>{result.priced?money(result.knownUSD):'OPEN'}</td>
     <td>{result.open?result.open+' แถวราคา OPEN':result.count?'ดูรายละเอียด A1':'ยังไม่มีรายการจัดสรร'}</td>
    </tr>;
   })}</tbody>
  </table></div>
  <button type="button" disabled={disabled} onClick={()=>onOpen('mapping')}>เปิด 11.M · ตรวจ Working และการจัดรายการ</button>
 </section>;
}

export function SchedulePriceDiagnostics0550({view,id,currency='USD',onNavigate,onAllocate,disabled}){
 const [open,setOpen]=useState(false),d=schedulePriceDiagnostics0550(view,id);
 if(!/^C[1-8]$|^A[12]$/.test(id))return null;
 return <section className="p55-panel" aria-label={'Schedule '+id+' price diagnostics'}>
  <h4>ต้นทางราคา Schedule {id}</h4>
  {id==='C2'&&<p>ฐาน CUS · 10008-STD-6-TEL-001 R00 §7.7.1 และ MR Rev.B1 Appendix 10 · คิดต้นทุนจากผลรวมจำนวนอะไหล่ที่ต้องจัดหาเพิ่ม × ราคาต่อหน่วยของแต่ละ OEM Part No. รายการที่อยู่ในราคาแพ็กเกจแล้วให้ตามรอยไปยังเจ้าของราคาเดิม <button type="button" disabled={disabled} onClick={()=>onNavigate?.('l3.original')}>เปิด CUS</button></p>}
  {d.rows.length?<><p>{d.count} เจ้าของราคาจาก Working · มีราคา {d.priced} · ยังไม่มีราคา {d.open} · ยังไม่มีจำนวน {d.quantityOpen}</p><p><strong>{d.priced?'ยอดราคาที่มี '+currency+' '+money(d.knownUSD):'Working ต้นทางยังไม่มีราคาที่แสดงได้'}</strong>{d.priced>0&&d.open>0?' · เป็นยอดเฉพาะรายการที่มีราคา':''} · {view.workingPreview?'Working Preview / ยังไม่อนุมัติ':'มุมมองราคาที่ทบทวน'}</p>{d.columnOpen>0&&<p>อีก {d.columnOpen} แถวยังไม่กำหนด CIF / FOB · {['C2','C3','C4','C5','C6'].includes(id)&&view.workingPreview?'ราคาขายที่คำนวณแล้วแสดงคร่อมสองช่องจนกว่าจะกำหนดเงื่อนไขลูกค้าที่ 11.M':'ตรวจจำนวนและราคาที่ Working และกำหนดเงื่อนไขลูกค้าที่ 11.M'}</p>}</>:<p>ยังไม่มีแถว Working จัดลง Schedule นี้ · ตารางว่างยังไม่ใช่ราคา 0 หรือผลยืนยันว่าไม่เกี่ยวข้อง</p>}
  {id==='C6'&&<p>ตรวจวัสดุเติมครั้งแรกและวัสดุสิ้นเปลืองตามอุปกรณ์ที่เลือก พร้อม Specification และเจ้าของราคา · ไม่ย้ายอะไหล่สองปี C3 มาแทนโดยอัตโนมัติ</p>}
  {id==='C8'&&<p>ใช้สำหรับบริการ/สิ่งอำนวยความสะดวกแก่ COMPANY / PURCHASER · ค่าเดินทางและเบี้ยเลี้ยงทีม SI ที่คิดไว้แล้วต้องมีเจ้าของราคาเดียว และไม่ถูกนำมาคิดซ้ำที่นี่</p>}
  <div className="p55-review-toolbar"><button type="button" disabled={disabled} onClick={()=>onAllocate?.()}>ตรวจการจัดรายการ 11.M</button><button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.working-preview.step.7')}>ตรวจ MR ↔ Supplier / SI</button></div>
  {d.rows.length>0&&<details open={open} onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}><summary>ตรวจจำนวน / ราคา / ต้นทาง · {d.rows.length} รายการ</summary>{open&&<div className="p55-table-wrap"><table className="p55-table" aria-label={'Schedule '+id+' Working price sources'}><thead><tr><th>Working / รายการ</th><th>จำนวน / หน่วย</th><th>ราคาขาย {currency}</th><th>เงื่อนไข / สาเหตุ</th><th>แก้ที่ต้นทาง</th></tr></thead><tbody>{d.rows.map(r=><tr key={r.lineId}><td>{r.description}<small>{r.lineId}</small></td><td>{r.quantity??'ยังไม่มีจำนวน'} {r.unit}</td><td>{money(r.amount)}</td><td>{r.binding.deliveryTerm||'ยังไม่กำหนดเงื่อนไขลูกค้า'}{r.problems.map(p=><small key={p}>{p}</small>)}{r.workingProblems.length>0&&<small>{r.workingProblems.join(' / ')}</small>}</td><td><button type="button" disabled={disabled} onClick={()=>onNavigate?.(r.workingTarget)}>เปิด Working</button><button type="button" disabled={disabled} onClick={()=>onAllocate?.(r.lineId)}>แก้การจัดรายการ 11.M</button><button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.technical.equipment.system.'+(r.binding.line.systemToken||'COMMON'))}>12 · Technical equipment</button></td></tr>)}</tbody></table></div>}</details>}
 </section>;
}
