import React,{useEffect,useRef,useState} from 'react';
import {addBaseline,recordBaselineEvent,serializeBaselineRegister,parseBaselineRegister,restoreBaselineRegister} from '../common/governance/quotationBaseline';
import {loadBaselineRegister,commitBaselineRegister} from '../common/governance/quotationBaselineStore';
import {QUOTATION_SCOPE_0550,captureWorkingBaseline0550,captureExternalBaseline0550,captureIssueBaseline0550,issueArchiveKey0550,downloadBaselineArtifact0550} from './data/quotationBaseline0550';
function downloadText(text,name){const u=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
export function useQuotationBaseline0550(){
 const [register,setRegister]=useState(null),[pending,setPending]=useState(false),[message,setMessage]=useState(''),[actor,setActor]=useState(''),[purpose,setPurpose]=useState('');
 const lock=useRef(false);
 useEffect(()=>{let mounted=true;loadBaselineRegister(QUOTATION_SCOPE_0550).then(r=>{if(mounted)setRegister(r);}).catch(e=>{if(mounted)setMessage(e.message);});return()=>{mounted=false;};},[]);
 const run=async fn=>{if(lock.current)return;lock.current=true;setPending(true);try{if(!register)throw Error('โหลดทะเบียนก่อนทำรายการ');await fn(register);setMessage('บันทึกแล้ว · ไม่เปลี่ยน Working และไม่บันทึกว่าส่งลูกค้า');}catch(e){setMessage(e.message);}finally{lock.current=false;setPending(false);}};
 const identity=()=>{if(!actor.trim()||!purpose.trim())throw Error('กรอกผู้บันทึกและเหตุผลก่อน');return {actor:actor.trim(),purpose:purpose.trim(),recordedAt:new Date().toISOString()};};
 const save=async(r,next)=>{await serializeBaselineRegister(next);await commitBaselineRegister(QUOTATION_SCOPE_0550,r.version,next);setRegister(next);};
 const select=(id,type='SELECTED')=>run(async r=>{const event=identity();await save(r,await recordBaselineEvent(r,{...event,type,revisionId:id}));});
 const capture=maker=>run(async r=>{const e=identity(),record=await maker({actor:e.actor,createdAt:e.recordedAt});const same=r.records.some(x=>x.label===record.label&&x.snapshotHash===record.snapshotHash&&JSON.stringify(x.artifacts.map(a=>[a.id,a.sha256,a.filename]))===JSON.stringify(record.artifacts.map(a=>[a.id,a.sha256,a.filename])));if(!same)await save(r,await addBaseline(r,record));});
 const download=(record,id)=>run(async r=>{const e=identity();await save(r,await recordBaselineEvent(r,{...e,type:'DOWNLOAD_STARTED',revisionId:record.id,artifactId:id}));await downloadBaselineArtifact0550(record,id);});
 const exportIssue=(issue,artifactId)=>run(async r=>{
  const e=identity(),key=await issueArchiveKey0550(issue);let record=r.records.find(x=>x.snapshot.adapter==='0550-quotation-artifacts/1'&&x.snapshot.issueKey===key),next=r;
  if(!record){record=await captureIssueBaseline0550({issue,actor:e.actor,createdAt:e.recordedAt});next=await addBaseline(next,record);}
  next=await recordBaselineEvent(next,{...e,type:'DOWNLOAD_STARTED',revisionId:record.id,artifactId});await save(r,next);await downloadBaselineArtifact0550(record,artifactId);
 });
 const backup=()=>run(async r=>downloadText(await serializeBaselineRegister(r),'PJ2608-0550_QUOTATION_ARCHIVE_INTERNAL.json'));
 const restore=file=>run(async r=>{if(!file||file.size>64*1024*1024)throw Error('Backup must be at most64MiB');const incoming=await parseBaselineRegister(await file.text(),QUOTATION_SCOPE_0550);await save(r,await restoreBaselineRegister(r,incoming));});
 const reload=async()=>{if(lock.current)return;setPending(true);try{setRegister(await loadBaselineRegister(QUOTATION_SCOPE_0550));setMessage('โหลดทะเบียนแล้ว');}catch(e){setMessage(e.message);}finally{setPending(false);}};
 return {register,pending,message,actor,setActor,purpose,setPurpose,select,capture,download,exportIssue,backup,restore,reload};
}
export function QuotationBaselineControls0550({control,data,official,busy}){
 const c=control,[label,setLabel]=useState(''),[kind,setKind]=useState('AGREED_REFERENCE'),[evidence,setEvidence]=useState(''),[file,setFile]=useState(null);
 const selected=c.register?.records.find(r=>r.id===c.register.selectedRevisionId),used=c.register?.records.find(r=>r.id===c.register.lastUsedRevisionId),disabled=busy||c.pending||!c.register;
 return <details className="p55-panel p55-quotation-baseline"><summary>ฉบับราคาอ้างอิง / เก็บไฟล์จริง · {selected?selected.label:'ยังไม่ได้เลือกฉบับ'}</summary>
  <p>Working R{data.revision} เป็นโมเดลคำนวณสด · ฉบับอ้างอิงที่เลือก: <strong>{selected?.label||'ยังไม่เลือก'}</strong> · เจ้าของยืนยันใช้จริงล่าสุด: {used?.label||'ยังไม่มีบันทึก'}</p>
  <p>เลือกฉบับอ้างอิงโดยตรง ไม่เลือกจาก Git หรือวันที่แก้ไฟล์ การเลือก การนำเข้า และดาวน์โหลดไม่ใช่หลักฐานการส่งหรือการยอมรับจากลูกค้า</p>
  <p>ทะเบียนไฟล์แยกจาก Working backup · เก็บในเบราว์เซอร์นี้ ต้อง Export Internal Archive Backup เพื่อย้ายเครื่องหรือกู้คืน</p>
  <div className="p55-bid-fields"><label>ผู้บันทึกฉบับราคา<input aria-label="Baseline recorded by" value={c.actor} onChange={e=>c.setActor(e.target.value)}/></label><label>เหตุผล / หลักฐานการใช้งาน<input aria-label="Baseline purpose" value={c.purpose} onChange={e=>c.setPurpose(e.target.value)}/></label></div>
  <div className="p55-review-toolbar"><button type="button" disabled={c.pending} onClick={c.reload}>โหลดทะเบียนอีกครั้ง</button><button type="button" disabled={disabled} onClick={c.backup}>Export Internal Archive Backup</button><label>Restore Archive Backup<input type="file" accept="application/json,.json" disabled={disabled} onChange={e=>{const f=e.target.files[0];if(f)c.restore(f);e.target.value='';}}/></label></div>
  {selected&&<article className="p55-panel"><strong>SELECTED · {selected.label} · {selected.snapshot.kind}</strong><p>Revision ID: <code>{selected.id}</code><br/>Snapshot SHA-256: <code>{selected.snapshotHash}</code></p><p>{selected.snapshot.provenance}</p>{selected.snapshot.pricingInputs===null?<p>เก็บไฟล์ต้นฉบับ ไม่สร้างราคาหรือสมมติฐานย้อนกลับจากไฟล์</p>:<p>Base USD: {selected.snapshot.baseUSD??selected.snapshot.issue?.baseUSD??'OPEN'} · Options USD: {selected.snapshot.optionsUSD??selected.snapshot.issue?.optionsUSD??'OPEN'}</p>}{selected.artifacts.map(a=><p key={a.id}><button type="button" disabled={disabled} onClick={()=>c.download(selected,a.id)}>{a.filename}</button><br/><small>SHA-256: {a.sha256} · {a.sizeBytes} bytes</small></p>)}</article>}
  <details><summary>เก็บฉบับ Working หรือไฟล์ต้นฉบับที่ยื่น/ตกลง</summary><label>ชื่อฉบับราคา<input aria-label="Baseline label" value={label} onChange={e=>setLabel(e.target.value)}/></label><button type="button" disabled={disabled||!label.trim()} onClick={()=>c.capture(meta=>captureWorkingBaseline0550({...meta,data,official,label}))}>เก็บ Working Draft พร้อม XLSX</button>
   <p>เก็บ Working ไม่อนุมัติ Release · การเก็บฉบับใหม่ไม่เปลี่ยนฉบับที่เลือก</p>
   <label>ประเภทไฟล์อ้างอิง<select aria-label="External baseline kind" value={kind} onChange={e=>setKind(e.target.value)}><option value="AGREED_REFERENCE">Agreed / Negotiated — เจ้าของระบุ</option><option value="SUBMITTED_REFERENCE">Submitted — เจ้าของระบุ</option></select></label><label>หลักฐานต้นทาง / ข้อตกลง<input aria-label="External baseline evidence" value={evidence} onChange={e=>setEvidence(e.target.value)}/></label><label>ไฟล์ต้นฉบับ PDF / XLSX / DOCX · ไม่เกิน20MiB<input aria-label="Original quotation file" type="file" accept=".pdf,.xlsx,.docx" disabled={disabled} onChange={e=>setFile(e.target.files[0]||null)}/></label><button type="button" disabled={disabled||!file||!label.trim()||!evidence.trim()} onClick={()=>c.capture(meta=>captureExternalBaseline0550({...meta,file,kind,label,evidence}))}>เก็บไฟล์ต้นฉบับพร้อม SHA-256</button>
  </details>
  <details><summary>ทะเบียนฉบับราคา · {c.register?.records.length||0} ฉบับ</summary>{c.register?.records.map(r=><article className="p55-panel" key={r.id}><strong>{r.label} · {r.snapshot.kind}</strong><p>{r.createdAt} · {r.createdBy} · {r.snapshot.provenance}</p><button type="button" disabled={disabled} onClick={()=>c.select(r.id)}>เลือกฉบับอ้างอิง · {r.label}</button> <button type="button" disabled={disabled} onClick={()=>c.select(r.id,'OWNER_ATTESTED_USED')}>ยืนยันว่าใช้จริง · {r.label}</button><p><small>{r.id}</small></p></article>)}<p>การยืนยันใช้จริงบันทึกวันที่ใช้งานเดิมเป็น “ไม่ทราบ” และเก็บเวลาที่บันทึกแยกกัน</p></details>
  <details><summary>ประวัติเลือก / ใช้ / เริ่มดาวน์โหลด · {c.register?.events.length||0}</summary>{c.register?.events.map(e=><p key={e.id}>{e.type} · {c.register.records.find(r=>r.id===e.revisionId)?.label} · {e.actor} · {e.recordedAt} · {e.purpose}</p>)}</details>
  <p role="status">{c.message}</p>
 </details>;
}
