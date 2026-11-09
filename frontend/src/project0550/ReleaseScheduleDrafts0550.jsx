import React,{useMemo,useState} from 'react';
import {useBidWorkspace} from './BidWorkspaceContext';
import {SYSTEMS} from './data';
import {downloadNativeExhibit0550} from './exhibitCNative0550';
import {draftSubtotal0550,releaseScheduleArchive0550,releaseScheduleChecks0550,releaseScheduleDraftView0550} from './releaseScheduleDrafts0550';

export function ReleaseScheduleDrafts0550({onNavigate}){
 const {data,model,reviewDate}=useBidWorkspace();
 const [open,setOpen]=useState(false);
 const documents=useMemo(()=>open&&data&&model
  ?releaseScheduleChecks0550(releaseScheduleDraftView0550(data,model,SYSTEMS,reviewDate)):[],[open,data,model,reviewDate]);
 const download=()=>{
  const url=URL.createObjectURL(new Blob([releaseScheduleArchive0550(documents)],{type:'application/zip'}));
  const link=document.createElement('a');
  link.href=url;link.download='PJ2608-0550_A_C1-C8_DRAFT_R'+data.revision+'.zip';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 return <details className="p55-panel" onToggle={event=>{if(event.target===event.currentTarget)setOpen(event.currentTarget.open);}}>
  <summary>ออกและตรวจเอกสารร่าง Schedule A และ C1–C8</summary>
  {documents.length>0&&<>
   <p>ออกได้จาก Working ปัจจุบัน · ยอดที่เห็นเป็นเฉพาะรายการที่มีราคา · ดูรายการที่ต้องตรวจแยกตามเอกสาร</p>
   <button type="button" onClick={download}>ดาวน์โหลด Word 9 แบบพร้อมรายการตรวจ (.zip)</button>
   <div className="p55-table-wrap"><table className="p55-table" aria-label="Draft Schedule review">
    <thead><tr><th>แบบฟอร์ม</th><th>ราคาจาก Working</th><th>รายการที่ต้องตรวจ</th><th>เปิดหรือส่งออก</th></tr></thead>
    <tbody>{documents.map(({id,title,amounts,checks,formView})=><tr key={id}>
     <th scope="row">11.{id} · {title}</th>
     <td>{amounts.length?amounts.map(result=><p key={result.treatment}>{result.treatment} · {draftSubtotal0550(result)}</p>):'OPEN'}</td>
     <td>{checks.length?<details><summary>{checks.length} หัวข้อ</summary><ul>{checks.map(({label,refs})=><li key={label}>
      {label}{refs.length>0&&<details><summary>{refs.length} รายการอ้างอิง</summary><ul>{refs.map(ref=><li key={ref}>{ref}</li>)}</ul></details>}
     </li>)}</ul></details>:'ตรวจรายการในแบบฟอร์มได้'}</td>
     <td><button type="button" onClick={()=>downloadNativeExhibit0550(formView,'docx',id)}>Word {id}</button>
      {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.quotation.'+id)}>เปิด 11.{id}</button>}</td>
    </tr>)}</tbody>
   </table></div>
  </>}
 </details>;
}
