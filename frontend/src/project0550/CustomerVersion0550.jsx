import React,{useMemo,useState} from 'react';
import {customerReadiness0550,downloadCustomerDocx0550,printCustomer0550} from './customerExhibit0550';

const labels={
 SCHEDULE_ALLOCATION_OPEN:'มี Working line ที่ยังไม่ได้จัดลง Schedule',
 SCHEDULE_BINDING_REVIEW_OPEN:'Schedule allocation ยังรอทบทวน',
 SCHEDULE_DISPOSITION_OPEN:'Schedule ยังรอทบทวนขอบเขต',
 SCHEDULE_TOTAL_RECONCILIATION_OPEN:'ยอด Schedule ยังไม่ตรงกับยอด Official',
 VOLUME_I_RESPONSE_OPEN:'แบบฟอร์ม Volume I ยังมีคำตอบที่รอทบทวน',
 BID_DOCUMENT_CONTROL_OPEN:'ยังขาดเลขเอกสารหรือ Revision',
 MR_C1_OWNER_UNRESOLVED:'MR ยังหา Working cost owner ที่จัดลง C1 ไม่ได้',
 'Customer CIF/FOB term OPEN':'ยังไม่ได้ระบุเงื่อนไข CIF/FOB',
};

function groupProblems(problems){
 const groups=new Map();
 for(const problem of problems){
  const match=problem.match(/^(.*?)(?: \/ |: )((?:LINE-|REQ-|MR-)[\w.-]+|C[1-8])$/);
  const reason=match?.[1]||problem;
  if(!groups.has(reason))groups.set(reason,[]);
  if(match)groups.get(reason).push(match[2]);
 }
 return [...groups];
}

export function CustomerVersion0550({view,disabled,onAllocate,onOpenSchedule,onOpenDocumentControl}){
 const gate=useMemo(()=>customerReadiness0550(view),[view]);
 const [showPreview,setShowPreview]=useState(false),[error,setError]=useState('');
 const canExport=gate.ready&&!disabled;
 const preview=showPreview?gate.previewHtml:null;
 const blocked=gate.items.filter(item=>item.problems.length);
 const action=fn=>{
  setError('');
  try{fn(view,disabled);}catch(e){setError(e.message);}
 };
 return <section className="p55-panel" aria-label="Exhibit C Customer Version">
  <h3>Exhibit C · Customer Version</h3>
  <p role="status">{gate.ready?'แบบฟอร์มผ่านการตรวจความพร้อม':'ยังส่งออกไม่ได้ · เปิดตัวอย่างเพื่อตรวจแบบฟอร์ม หรือดูรายการที่ต้องแก้'}{disabled&&' · มีการแก้ไขที่ยังไม่บันทึก'}</p>
  <div className="p55-review-toolbar">
   <button type="button" disabled={!canExport} onClick={()=>action(downloadCustomerDocx0550)}>Export Word</button>
   <button type="button" disabled={!canExport} onClick={()=>action(printCustomer0550)}>Print / Save as PDF</button>
   <button type="button" disabled={!gate.previewHtml} aria-expanded={Boolean(preview)} onClick={()=>setShowPreview(open=>!open)}>{preview?'ปิดตัวอย่าง':'ดูตัวอย่างแบบฟอร์ม'}</button>
  </div>
  {blocked.length>0&&<details>
   <summary>ตรวจความพร้อม Schedule A–C8 · {blocked.length} ส่วนที่ต้องแก้</summary>
   <div className="p55-review-toolbar">
    <button type="button" disabled={disabled} onClick={()=>onAllocate()}>เปิด 11.M Schedule allocation</button>
    <button type="button" disabled={disabled} onClick={onOpenDocumentControl}>เปิด 11.0 Document Control</button>
   </div>
   {blocked.map(({id,problems})=><details key={id}>
    <summary>{id} · {problems.length} รายการ</summary>
    {/^(?:A[12]?|B|C[1-8]?)$/.test(id)&&<button type="button" disabled={disabled} onClick={()=>onOpenSchedule(id)}>เปิด 11.{id}</button>}
    <ul>{groupProblems(problems).map(([reason,refs])=><li key={reason}>
     {refs.length?<details>
      <summary>{labels[reason]||reason} · {refs.length} รายการ</summary>
      <ul>{refs.map(ref=><li key={ref}>
       {reason==='Customer CIF/FOB term OPEN'
        ?<button type="button" disabled={disabled} onClick={()=>onAllocate(ref)}>{ref} · เปิด 11.M</button>
        :ref}
      </li>)}</ul>
     </details>:labels[reason]||reason}
    </li>)}</ul>
   </details>)}
  </details>}
  {error&&<p role="alert">{error}</p>}
  {preview&&<>
   {!canExport&&<p><strong>ตัวอย่างสำหรับตรวจภายใน</strong> · แสดงข้อมูลที่บันทึกแล้วและช่องที่ยัง OPEN</p>}
   <iframe title="Exhibit C customer preview" sandbox="" srcDoc={preview} style={{width:'100%',height:'75vh',border:'1px solid #b1c0cb'}}/>
  </>}
 </section>;
}
