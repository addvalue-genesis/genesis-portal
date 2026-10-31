import React from 'react';
import {nativeSchedule0550,nativeExhibitProblems0550,nativeFormCss0550,nativeExhibitHtml0550,downloadNativeExhibit0550} from './exhibitCNative0550';
import {MgwScheduleSource0550} from './WorkingSchedulePreview0550';

export function NativeExhibitC0550({view,id,onAllocate,onNavigate,disabled=false}){
 const form=nativeSchedule0550(view,id),count=id==='A1'?view.bindings.filter(b=>b.line&&b.treatment==='BASE').length:id==='A2'?view.bindings.filter(b=>b.line&&b.treatment==='OPTION').length:view.scheduleRows(id).length;
 const problems=nativeExhibitProblems0550(view).filter(p=>p.startsWith(id+' / '));
 const print=()=>{
  const frame=document.createElement('iframe');frame.style.cssText='position:fixed;width:1px;height:1px;left:-10000px';
  frame.onload=()=>{frame.contentWindow.focus();frame.contentWindow.print();setTimeout(()=>frame.remove(),60000);};
  frame.srcdoc=nativeExhibitHtml0550(view,id);document.body.appendChild(frame);
 };
 return <section aria-label={'Native Exhibit C Schedule '+id}>
  <style>{nativeFormCss0550}</style>
  <div className="p55-native-toolbar"><button type="button" disabled={disabled} onClick={()=>downloadNativeExhibit0550(view,'docx',id)}>Export Schedule {id} Word (.docx)</button><button type="button" disabled={disabled} onClick={print}>พิมพ์ Schedule {id} / PDF</button><button type="button" disabled={disabled} onClick={()=>downloadNativeExhibit0550(view,'docx')}>Export Exhibit C Word ทั้งชุด</button></div>
  <p className="p55-native-help">แบบฟอร์มจาก Exhibit C rev-0 · {count} รายการจาก Working · {view.workingPreview?'ร่างพร้อมการจัดหมวดแนะนำ / ราคาที่ยังรอทบทวน':'ข้อมูลที่บันทึก / ราคาที่ผ่านการทบทวน'} · ข้อมูลที่ขาดคง OPEN</p>
  {view.unallocated.length>0&&<p className="p55-native-issues">Working อีก {view.unallocated.length} รายการยังไม่ได้ระบุช่องปลายทาง <button type="button" onClick={()=>onAllocate?.()}>จัดรายการลงแบบฟอร์ม 11.M</button></p>}
  {problems.length>0&&<ul className="p55-native-issues">{problems.map((p,i)=><li key={i}>{p}</li>)}</ul>}
  {id==='C1'&&view.workingPreview&&<MgwScheduleSource0550 view={view} onNavigate={onNavigate} disabled={disabled}/>}
  <div className="p55-native-scroll" dangerouslySetInnerHTML={{__html:form.html}}/>
  {view.scheduleRows(id).length>0&&<details><summary>รายการ Working ที่ใช้ในแบบฟอร์มนี้</summary>{view.scheduleRows(id).map(b=><p key={b.id}>{b.lineId} · {b.line.description} · {b.state} <button type="button" onClick={()=>onAllocate?.(b.id)}>แก้รายละเอียดลงแบบฟอร์ม</button></p>)}</details>}
 </section>;
}
