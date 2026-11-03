import React,{useMemo,useState} from 'react';
import {nativeSchedule0550,nativeExhibitProblems0550,nativeFormCss0550,nativeExhibitHtml0550,downloadNativeExhibit0550} from './exhibitCNative0550';
import {MgwScheduleSource0550} from './WorkingSchedulePreview0550';
import {SchedulePriceDiagnostics0550} from './SchedulePriceDiagnostics0550';
import {C1Appendix0550} from './C1Appendix0550';
import {C1_APPENDIX_LAYOUT_0550} from './data/c1Appendix0550';

export function LazyNativeExhibitC0550(props){
 const [open,setOpen]=useState(false);
 return <details open={open} onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}><summary>{props.label}</summary>{open&&<NativeExhibitC0550 {...props}/>}</details>;
}

export function NativeExhibitC0550({view,id,onAllocate,onNavigate,disabled=false}){
 view=useMemo(()=>id==='C1'?{...view,c1LayoutVersion:C1_APPENDIX_LAYOUT_0550}:view,[view,id]);
 const form=useMemo(()=>nativeSchedule0550(view,id),[view,id]),count=id==='A1'?view.bindings.filter(b=>b.line&&b.treatment==='BASE').length:id==='A2'?view.bindings.filter(b=>b.line&&b.treatment==='OPTION').length:view.scheduleRows(id).length;
 const problems=useMemo(()=>nativeExhibitProblems0550(view,id),[view,id]);
 const print=()=>{
  const frame=document.createElement('iframe');frame.style.cssText='position:fixed;width:1px;height:1px;left:-10000px';
  frame.onload=()=>{frame.contentWindow.focus();frame.contentWindow.print();setTimeout(()=>frame.remove(),60000);};
  frame.srcdoc=nativeExhibitHtml0550(view,id);document.body.appendChild(frame);
 };
 return <section aria-label={'Native Exhibit C Schedule '+id}>
  <style>{nativeFormCss0550}</style>
  <div className="p55-native-toolbar"><button type="button" disabled={disabled} onClick={()=>downloadNativeExhibit0550(view,'docx',id)}>Export Schedule {id} Word (.docx)</button><button type="button" disabled={disabled} onClick={print}>พิมพ์ Schedule {id} / PDF</button><button type="button" disabled={disabled} onClick={()=>downloadNativeExhibit0550(view,'docx')}>Export Exhibit C Word ทั้งชุด</button></div>
  {id==='C1'?<C1Appendix0550 view={view} onNavigate={onNavigate} disabled={disabled}/>:<p className="p55-native-help">แบบฟอร์มจาก Exhibit C rev-0 · {count} รายการจาก Working · {view.workingPreview?'ร่างพร้อมการจัดหมวดแนะนำ / ราคาที่ยังรอทบทวน':'ข้อมูลที่บันทึก / ราคาที่ผ่านการทบทวน'} · ข้อมูลที่ขาดคง OPEN</p>}
  <details className="p55-c1-internal-diagnostics" open={id!=='C1'}><summary>SI · ตรวจราคา / การจัดหมวดภายใน</summary>
  <SchedulePriceDiagnostics0550 view={view} id={id} onNavigate={onNavigate} onAllocate={onAllocate} disabled={disabled}/>
  {view.unallocated.length>0&&<p className="p55-native-issues">Working อีก {view.unallocated.length} รายการยังไม่ได้ระบุช่องปลายทาง <button type="button" onClick={()=>onAllocate?.()}>จัดรายการลงแบบฟอร์ม 11.M</button></p>}
  {problems.length>0&&<ul className="p55-native-issues">{problems.map((p,i)=><li key={i}>{p}</li>)}</ul>}
  {id==='C1'&&view.workingPreview&&<MgwScheduleSource0550 view={view} onNavigate={onNavigate} disabled={disabled}/>}
  </details>
  {id!=='C1'&&<div className="p55-native-scroll" dangerouslySetInnerHTML={{__html:form.html}}/>}
 </section>;
}
