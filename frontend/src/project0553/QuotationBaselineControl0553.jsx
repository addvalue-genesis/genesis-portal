import React,{useEffect,useRef,useState} from "react";
import {addBaseline,recordBaselineEvent,emptyBaselineRegister,serializeBaselineRegister,parseBaselineRegister,restoreBaselineRegister,baselineDifferences,base64ToBytes,MAX_BACKUP_BYTES} from "../common/governance/quotationBaseline";
import {loadBaselineRegister,commitBaselineRegister} from "../common/governance/quotationBaselineStore";
import {captureQuotation0553,QUOTATION_SCOPE_0553,QUOTATION_POLICY_BINDINGS_0553} from "./data/quotationBaseline0553";
const now=()=>new Date().toISOString();
export function downloadBaselineBlob(blob,filename){
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
}
export function QuotationBaselineControl0553({mode,reference,source,onSelectRecord,controllerRef=null}){
 const [register,setRegister]=useState(null),[actor,setActor]=useState(""),[label,setLabel]=useState("Rev03 — selected quotation"),[purpose,setPurpose]=useState("ใช้เป็นฐานข้อเสนอ"),[usedDate,setUsedDate]=useState("");
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[message,setMessage]=useState(""),[diff,setDiff]=useState(null);
 const callback=useRef(onSelectRecord);callback.current=onSelectRecord;
 const fileInput=useRef(null);
 const panel=useRef(null);
 useEffect(()=>{if(mode!=="RECORDED")setLabel(mode==="WORKING_DRAFT"?"Working draft — "+new Date().toISOString().slice(0,10):(reference?.revision||"Reference")+" — selected quotation");},[mode,reference?.revision]);
 useEffect(()=>{let cancelled=false;
  loadBaselineRegister(QUOTATION_SCOPE_0553).then(value=>{if(!cancelled){setRegister(value);const selected=value.records.find(r=>r.id===value.selectedRevisionId);if(selected)callback.current(selected);}}).catch(e=>{if(!cancelled)setError(e.message);});
  return()=>{cancelled=true;};
 },[]);
 const selected=register?.records.find(r=>r.id===register.selectedRevisionId);
 const lastUsed=register?.records.find(r=>r.id===register.lastUsedRevisionId);
 const lastUseEvent=register?.events.filter(e=>e.type==="OWNER_ATTESTED_USED").slice(-1)[0];
 const backup=async value=>{
  const content=await serializeBaselineRegister(value);
  downloadBaselineBlob(new Blob([content],{type:"application/json"}),"PJ2608-0553_QuotationRegister_INTERNAL_"+new Date().toISOString().replace(/[:.]/g,"-")+".json");
 };
 const perform=async work=>{if(busy)return;if(panel.current)panel.current.open=true;setBusy(true);setError("");setMessage("");try{await work();}catch(e){setError(e.message||String(e));}finally{setBusy(false);}};
 const persist=async(next,withBackup=true)=>{
  // Reject an unportable/oversized register before the database commit.
  const backupContent=await serializeBaselineRegister(next);
  await commitBaselineRegister(QUOTATION_SCOPE_0553,register.version,next);setRegister(next);setDiff(null);
  if(!withBackup){setMessage("บันทึกเหตุการณ์เริ่มดาวน์โหลดแล้ว สามารถดาวน์โหลดทะเบียนสำรองล่าสุดเพิ่มเติมได้");return;}
  try{downloadBaselineBlob(new Blob([backupContent],{type:"application/json"}),"PJ2608-0553_QuotationRegister_INTERNAL_"+new Date().toISOString().replace(/[:.]/g,"-")+".json");setMessage("บันทึกในเบราว์เซอร์แล้ว และเริ่มดาวน์โหลดไฟล์สำรอง โปรดเก็บไฟล์ INTERNAL นี้เพื่อย้ายเครื่อง/กู้คืน");}
  catch(e){setError("บันทึกในเบราว์เซอร์แล้ว แต่สำรองไม่สำเร็จ: "+e.message+" — กดดาวน์โหลดสำรองอีกครั้ง");}
 };
 const capture=()=>perform(async()=>{
  if(!actor.trim()||!label.trim())throw Error("กรอกชื่อผู้บันทึกและชื่อฉบับก่อน");
  const record=await captureQuotation0553({mode,reference,source,label,actor,createdAt:now()});
  let next=await addBaseline(register,record);
  next=await recordBaselineEvent(next,{type:"SELECTED",revisionId:record.id,actor,recordedAt:now(),purpose:"เลือกฉบับที่ตรึง: "+label});
  await persist(next);callback.current(record);
 });
 const select=id=>perform(async()=>{
  if(!actor.trim())throw Error("กรอกชื่อผู้บันทึกก่อนเปลี่ยนฉบับที่เลือก");
  const next=await recordBaselineEvent(register,{type:"SELECTED",revisionId:id,actor,recordedAt:now(),purpose:"เลือกฉบับอ้างอิงจากประวัติ"});
  await persist(next);callback.current(next.records.find(r=>r.id===id));
 });
 const attest=()=>perform(async()=>{
  if(!selected)throw Error("เลือกฉบับที่บันทึกแล้วก่อน");
  const next=await recordBaselineEvent(register,{type:"OWNER_ATTESTED_USED",revisionId:selected.id,actor,recordedAt:now(),occurredAt:usedDate||null,purpose});
  await persist(next);callback.current(next.records.find(r=>r.id===selected.id));
 });
 const downloadArtifact=artifact=>perform(async()=>{
  if(!actor.trim())throw Error("กรอกชื่อผู้บันทึกก่อนดาวน์โหลดไฟล์ที่ตรึงไว้");
  const next=await recordBaselineEvent(register,{type:"DOWNLOAD_STARTED",revisionId:selected.id,artifactId:artifact.id,actor,recordedAt:now(),purpose:"เริ่มดาวน์โหลด "+artifact.filename});
  await persist(next,false);
  downloadBaselineBlob(new Blob([base64ToBytes(artifact.base64)],{type:artifact.mimeType}),artifact.filename);
 });
 // Official's normal export/download path must freeze first; it cannot silently
 // produce an unregistered file. The second explicit click downloads exact bytes.
 useEffect(()=>{if(controllerRef)controllerRef.current={capture};return()=>{if(controllerRef)controllerRef.current=null;};});
 const restore=event=>{const file=event.target.files?.[0];event.target.value="";if(!file)return;
  perform(async()=>{
   if(file.size>MAX_BACKUP_BYTES)throw Error("ไฟล์สำรองเกิน64MiB");
   const incoming=await parseBaselineRegister(await file.text(),QUOTATION_SCOPE_0553);
   const next=await restoreBaselineRegister(register||emptyBaselineRegister(QUOTATION_SCOPE_0553),incoming);
   await persist(next);const chosen=next.records.find(r=>r.id===next.selectedRevisionId);if(chosen)callback.current(chosen);
  });
 };
 const compare=()=>{setError("");const prior=selected?.snapshot.workingSource;
  if(!prior){setError("ฉบับย้อนหลังนี้ไม่มี Working เดิมให้เปรียบเทียบ; ไม่สร้างข้อมูลย้อนหลังแทน");return;}
  const buildCommit=typeof __PJ0553_BUILD_REVISION__!=="undefined"?__PJ0553_BUILD_REVISION__:"UNAVAILABLE";
  setDiff(baselineDifferences({source:prior,policy:selected.snapshot.policyBindings,build:selected.snapshot.buildCommit},
   {source:JSON.parse(JSON.stringify(source)),policy:QUOTATION_POLICY_BINDINGS_0553,build:buildCommit}));
 };
 return <details ref={panel} className="p55-panel p553-quotation-baseline">
  <summary><strong>ฉบับที่เลือกใช้จริง / ประวัติราคา</strong> · {lastUsed?"ใช้จริง: "+lastUsed.label:selected?"เลือกไว้: "+selected.label:"ยังไม่ได้บันทึกฉบับใช้จริง"}</summary>
  <p>เก็บในเบราว์เซอร์นี้ พร้อมไฟล์สำรอง INTERNAL สำหรับย้ายเครื่อง ยังไม่ซิงก์ฐานข้อมูลกลาง การบันทึก/ดาวน์โหลดไม่ใช่การส่งหรืออนุมัติข้อเสนอ</p>
  <p>ฉบับที่เลือก: <strong>{selected?selected.label:"ยังไม่มีรายการบันทึก"}</strong><br/>
   ใช้จริงล่าสุดที่บันทึก: <strong>{lastUsed?lastUsed.label:"ยังไม่ได้ยืนยัน"}</strong>
   {lastUseEvent&&<> · ผู้บันทึก {lastUseEvent.actor} · วันใช้จริง {lastUseEvent.occurredAt||"ไม่ทราบ"} · บันทึกเมื่อ {lastUseEvent.recordedAt}</>}</p>
  {selected&&<p>Revision ID: <code>{selected.id}</code><br/>Snapshot SHA-256: <code>{selected.snapshotHash}</code><br/>
   Software build ที่ตรึง: <code>{selected.snapshot.buildCommit}</code> · ฉบับที่แสดงตอนนี้: <strong>{mode==="RECORDED"?"ฉบับที่บันทึกแล้ว":mode==="WORKING_DRAFT"?"Working ที่ยังแก้ต่อได้":reference?.revision}</strong></p>}
  <div className="p553-baseline-fields">
   <label>ชื่อผู้บันทึก <input value={actor} onChange={e=>setActor(e.target.value)} disabled={busy} maxLength={120}/></label>
   <label>ชื่อฉบับใหม่ <input value={label} onChange={e=>setLabel(e.target.value)} disabled={busy} maxLength={160}/></label>
   <button type="button" className="p553-detail-button" onClick={capture} disabled={busy||!register||mode==="RECORDED"}>ตรึงฉบับที่เปิดอยู่ + สำรอง</button>
  </div>
  <div className="p553-baseline-fields">
   <label>ฉบับที่บันทึกแล้ว <select value={selected?.id||""} disabled={busy||!register?.records.length} onChange={e=>select(e.target.value)}>
    <option value="" disabled>เลือกฉบับ</option>{register?.records.map(r=><option key={r.id} value={r.id}>{r.label} · {r.createdAt} · {r.id.slice(0,10)}</option>)}
   </select></label>
   <button type="button" className="p553-detail-button" disabled={busy||!selected} onClick={()=>callback.current(selected)}>เปิดฉบับที่บันทึกแล้ว</button>
   <button type="button" className="p553-detail-button" disabled={busy||!selected} onClick={compare}>เทียบ Working กับฉบับนี้</button>
  </div>
  <div className="p553-baseline-fields">
   <label>วันใช้จริง (ถ้าทราบ) <input type="date" value={usedDate} onChange={e=>setUsedDate(e.target.value)} disabled={busy}/></label>
   <label>ใช้เพื่ออะไร <input value={purpose} onChange={e=>setPurpose(e.target.value)} maxLength={400} disabled={busy}/></label>
   <button type="button" className="p553-detail-button" disabled={busy||!selected||mode!=="RECORDED"} onClick={attest}>ยืนยันว่าใช้ฉบับที่เลือกนี้จริง + สำรอง</button>
  </div>
  <p><button type="button" className="p553-detail-button" disabled={busy||!register} onClick={()=>perform(()=>backup(register))}>ดาวน์โหลดทะเบียนสำรอง INTERNAL</button>{" "}
   <button type="button" className="p553-detail-button" disabled={busy||!register} onClick={()=>fileInput.current.click()}>นำเข้าทะเบียนจากไฟล์สำรอง</button>
   <input ref={fileInput} type="file" accept=".json,application/json" onChange={restore} style={{display:"none"}}/>
   {busy&&" กำลังตรวจและบันทึก…"}</p>
  {message&&<p role="status">{message}</p>}{error&&<p role="alert">{error}</p>}
  {diff&&<div><p>Working input / policy / software build ต่างจากตอนตรึง <strong>{diff.count}</strong> จุด ฉบับที่บันทึกยังคงเดิม{diff.truncated?" · แสดง100จุดแรก":""}</p>
   {!!diff.changes.length&&<div className="p553-sheet-scroll"><table className="p553-customer-table"><thead><tr><th>ตำแหน่ง</th><th>ตอนตรึง</th><th>Working ปัจจุบัน</th></tr></thead><tbody>{diff.changes.map((d,i)=><tr key={i}><td>{d.path}</td><td>{d.before?.slice(0,180)}</td><td>{d.after?.slice(0,180)}</td></tr>)}</tbody></table></div>}</div>}
  {selected&&<details open><summary>ไฟล์เดิมที่ตรึงไว้ / ประวัติการเลือกและใช้</summary>
   <p>ไฟล์ที่ระบุ INTERNAL และทะเบียนสำรองมีข้อมูลต้นทุน/บริบทภายใน ไม่ใช่เอกสารสำหรับลูกค้า</p>
   {selected.artifacts.map(a=><p key={a.id}><button type="button" className="p553-detail-button" disabled={busy} onClick={()=>downloadArtifact(a)}>{a.audience} · {a.filename}</button><br/><small>SHA-256: <code>{a.sha256}</code></small></p>)}
   <table className="p553-customer-table"><thead><tr><th>เหตุการณ์</th><th>ฉบับ</th><th>ผู้บันทึก / เวลา</th><th>วันใช้ / เหตุผล</th></tr></thead><tbody>{register.events.map(e=><tr key={e.id}><td>{e.type}</td><td>{register.records.find(r=>r.id===e.revisionId)?.label}</td><td>{e.actor}<br/>{e.recordedAt}</td><td>{e.occurredAt||"ไม่ระบุ"}<br/>{e.purpose}</td></tr>)}</tbody></table>
  </details>}
 </details>;
}
