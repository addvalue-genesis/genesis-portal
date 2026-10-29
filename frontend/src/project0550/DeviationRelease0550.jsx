import React,{useState} from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {Module,Field} from "./BidControls";
import {deviationReleaseMetadata0550,deriveDeviationRelease0550,exportDeviationRelease0550,DEVIATION_RELEASE_LAYOUT_0550 as layout} from "./data/deviationRelease0550";
const labels={projectNo:"Project No.",project:"Project",requisition:"Requisition",description:"REQ Description",vendor:"Vendor"};
export function DeviationRelease0550({onEdit,selection,onSelectionChange}){
 const {data,model,change,busy}=useBidWorkspace();
 const [metadata,setMetadata]=useState(()=>deviationReleaseMetadata0550(data));
 const [localSelection,setLocalSelection]=useState(()=>model.integration.deviations.map(d=>d.id));
 const selected=selection??localSelection,setSelected=update=>onSelectionChange?onSelectionChange(update(selected)):setLocalSelection(update);
 const [message,setMessage]=useState("");
 const saved=deviationReleaseMetadata0550(data),dirty=JSON.stringify(saved)!==JSON.stringify(metadata);
 const release=deriveDeviationRelease0550(data,model.integration,selected);
 const exportFile=()=>{try{exportDeviationRelease0550(release);setMessage("สร้างไฟล์ Deviation List DRAFT แล้ว · สถานะส่ง/อนุมัติในทะเบียนคงเดิม");}catch(e){setMessage(e.message);}};
 return <Module id="bid.deviations.release" title="Release · Deviation List — English / Draft">
 <div className="p55-deviation-release-actions"><p><strong>DRAFT / NOT ISSUED</strong> · {release.count} รายการที่เลือก · Workspace revision {data.revision}</p><button type="button" className="p55-export-button" onClick={exportFile} disabled={busy||dirty||Boolean(release.issues.length)}>Export Excel — Deviation List</button></div>
 <p>ใช้ข้อมูลที่บันทึกในทะเบียน · รูปแบบ 11 คอลัมน์ตาม 5-Deviation List.xls · ดาวน์โหลดเป็น .xlsx · การส่งคำขอพิจารณาไม่ต้องรอการอนุมัติ Deviation</p>
 <details><summary>หัวเอกสาร / เลือกรายการที่จะส่งออก</summary>
 <div className="p55-bid-fields">{Object.entries(labels).map(([key,label])=><Field key={key} label={label} value={metadata[key]} onChange={v=>setMetadata(m=>({...m,[key]:v}))}/>)}</div>
 <button type="button" disabled={busy||!dirty} onClick={async()=>{if(await change(d=>({...d,deviationRelease:{...metadata}}),"Save deviation release document header"))setMessage("บันทึกหัวเอกสารแล้ว");}}>บันทึกหัวเอกสาร</button>
 {model.integration.deviations.map(d=><div key={d.id}><label><input type="checkbox" checked={selected.includes(d.id)} onChange={e=>setSelected(ids=>e.target.checked?[...ids,d.id]:ids.filter(id=>id!==d.id))}/> {d.systemToken} / {d.vendorQuoteRef||d.id} / {d.vendorDeviation}</label><button type="button" onClick={()=>onEdit(d.id)}>แก้รายการต้นทาง</button></div>)}
 </details>
 {dirty&&<p role="status">หัวเอกสารมีการแก้ไข · บันทึกก่อน Preview / Export ใช้ค่าที่บันทึกแล้ว</p>}
 <div role="status" aria-live="polite">{message}</div>
 {release.issues.length>0&&<div role="alert"><strong>ก่อนส่งออก:</strong><ul>{release.issues.map(x=><li key={x}>{x}</li>)}</ul></div>}
 <section className="p55-deviation-release-paper" aria-label="Deviation List customer preview">
 <dl>{Object.entries(labels).map(([k,label])=><React.Fragment key={k}><dt>{label}:</dt><dd>{saved[k]}</dd></React.Fragment>)}</dl>
 <p className="p55-deviation-release-draft">DRAFT - NOT ISSUED / Workspace revision {data.revision}</p>
 <h3>{layout.title}</h3><p className="p55-deviation-release-note">{layout.note}</p>
 <div className="p55-table-wrap"><table className="p55-table p55-deviation-release-table" aria-label="Deviation release eleven-column preview"><thead><tr>{layout.columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{release.groups.map(g=><React.Fragment key={g.document}><tr className="p55-deviation-release-section"><td>{g.number}.0</td><td colSpan={10}>{g.document}</td></tr>{g.rows.map(r=><tr key={r.id}>{r.cells.map((v,i)=><td key={i}>{v}</td>)}</tr>)}</React.Fragment>)}</tbody></table></div>
 </section>
 </Module>;
}
