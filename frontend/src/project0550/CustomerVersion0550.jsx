import React,{useMemo,useState} from 'react';
import {customerHtml0550,customerReadiness0550,downloadCustomerDocx0550,printCustomer0550} from './customerExhibit0550';

export function CustomerVersion0550({view,disabled,onAllocate}){
 const gate=useMemo(()=>customerReadiness0550(view),[view]);
 const [showPreview,setShowPreview]=useState(false),[error,setError]=useState('');
 const canExport=gate.ready&&!disabled;
 const preview=useMemo(()=>showPreview&&canExport?customerHtml0550(view,disabled):null,[showPreview,canExport,view,disabled]);
 const action=fn=>{
  setError('');
  try{fn(view,disabled);}catch(e){setError(e.message);}
 };
 return <section className="p55-panel" aria-label="Exhibit C Customer Version">
  <h3>Exhibit C · Customer Version</h3>
  <p role="status">{gate.ready?'แบบฟอร์มผ่านการตรวจความพร้อม':'ยังส่งออกไม่ได้ · ตรวจรายการด้านล่าง'}{disabled&&' · มีการแก้ไขที่ยังไม่บันทึก'}</p>
  <details open={!gate.ready}>
   <summary>ตรวจความพร้อม Schedule A–C8</summary>
   <ul>{gate.items.map(({id,problems})=><li key={id}><strong>{id}</strong> · {problems.length?problems.join(' / '):'ผ่าน'}</li>)}</ul>
   <button type="button" disabled={disabled} onClick={onAllocate}>เปิด 11.M Schedule allocation</button>
  </details>
  <div className="p55-review-toolbar">
   <button type="button" disabled={!canExport} onClick={()=>action(downloadCustomerDocx0550)}>Export Word</button>
   <button type="button" disabled={!canExport} onClick={()=>action(printCustomer0550)}>Print / Save as PDF</button>
   <button type="button" disabled={!canExport} aria-expanded={Boolean(preview)} onClick={()=>setShowPreview(open=>!open)}>{preview?'ปิดตัวอย่าง':'ดูตัวอย่างสำหรับลูกค้า'}</button>
  </div>
  {error&&<p role="alert">{error}</p>}
  {preview&&<iframe title="Exhibit C customer preview" sandbox="" srcDoc={preview} style={{width:'100%',height:'75vh',border:'1px solid #b1c0cb'}}/>}
 </section>;
}
