import {SUPPLIER_REVISION_SCHEMA_0550,planSupplierRevision0550} from "./data/supplierRevision0550";
import {VENDOR_REGISTER_SCHEMA_0550,planVendorRegister0550} from "./data/vendorRegister0550";
import React,{useState} from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {SYSTEMS} from "./data";
import {Module} from "./BidControls";
import {SI_FILE_LIMIT_0550,planSiWorkPackage0550} from "./data/siWorkPackage0550";
const tokens=SYSTEMS.map(s=>s.token);
const planPackage=(data,pack)=>pack.schema===VENDOR_REGISTER_SCHEMA_0550?planVendorRegister0550(data,pack,tokens):pack.schema===SUPPLIER_REVISION_SCHEMA_0550?planSupplierRevision0550(data,pack,tokens):planSiWorkPackage0550(data,pack,tokens);
export function SiWorkPackage0550(){
 const {data,busy,change}=useBidWorkspace();
 const [pack,setPack]=useState(null),[plan,setPlan]=useState(null),[error,setError]=useState(""),[message,setMessage]=useState("");
 async function preview(file){
  setPack(null);setPlan(null);setError("");setMessage("");if(!file)return;
  try{if(file.size>SI_FILE_LIMIT_0550)throw Error(`SI work package exceeds ${SI_FILE_LIMIT_0550/1024/1024} MiB`);const p=JSON.parse(await file.text());const next=planPackage(data,p);setPack(p);setPlan(next);}catch(e){setError(e.message);}
 }
 async function apply(){
  const ok=await change(current=>planPackage(current,pack).workspace,(pack.schema===VENDOR_REGISTER_SCHEMA_0550?"Register vendor quotation / ":pack.schema===SUPPLIER_REVISION_SCHEMA_0550?"Import supplier revision drafts / ":"Import SI engineering drafts / ")+pack.batchId);
  if(ok){setMessage(pack.schema===VENDOR_REGISTER_SCHEMA_0550?"บันทึก Vendor / Offer เข้าทะเบียนแล้ว เปิด VND 07.2 เพื่อตรวจต้นทุน · ราคาและการเลือกใน Working คงเดิม":"นำเข้า DRAFT แล้ว เปิด Working Preview 1–8 และ Volume II เพื่อตรวจเนื้อหาและหลักฐาน · รายการเดิมที่เคยแก้ไขคงไว้ตามตาราง · ยังไม่อนุมัติวิศวกรรมหรือออกเอกสารลูกค้า");setPack(null);setPlan(null);}
 }
 return <Module id="bid.documents.si-work-package" title="นำเข้าผลวิเคราะห์ System Integrator">
  <p>ชุดเตรียม A จาก DATA โหลดอัตโนมัติเมื่อเปิดโครงการ · ส่วนนี้เป็นทางเลือกสำรองสำหรับนำเข้าหรือใช้ตรวจผลวิเคราะห์ SI และเนื้อหา Volume II · ใช้ workspace เดิม เติมเฉพาะรายการที่ยังไม่มี คงเนื้อหาและ ID ที่เคยบันทึกไว้ · ข้อมูลที่เพิ่มเป็น DRAFT และยังต้องผ่านเกณฑ์ของแต่ละโมดูล</p>
  <label>SI work package <input aria-label="Import SI work package" type="file" accept=".json,application/json" disabled={!data||busy} onChange={e=>{preview(e.target.files[0]);e.target.value="";}}/></label>
  {error&&<p role="alert">{error}</p>}{message&&<p role="status">{message}</p>}
  {pack&&plan&&<div className="p55-panel" aria-label="SI work package preview"><strong>{pack.batchId} · {pack.preparedOn}</strong><p>{pack.coverageNote}</p>
   {pack.schema===SUPPLIER_REVISION_SCHEMA_0550&&<p>ชุด Supplier ฉบับใหม่: เพิ่ม Offer และราคา Package ใน Working แบบยังไม่เลือก · รายการย่อย/Option เป็นหลักฐานไม่บวกซ้ำ · ราคาที่ใช้อยู่ จำนวน FX และ Issue เดิมคงไว้ · ต้องทบทวนก่อนเปลี่ยนเจ้าของต้นทุน</p>}
   {pack.schema===VENDOR_REGISTER_SCHEMA_0550?<p>เพิ่มเฉพาะ Vendor / Offer พร้อมระบบ ฉบับ และเงื่อนไขต้นฉบับ · ไม่สร้างรายการ Working หรือเปลี่ยนราคา/FX/ประวัติเดิม</p>:<p>Source: {plan.sourceState} · {(pack.sourceIntake||data.sourceIntake).sources.length} แหล่ง · เก็บการเลือก Supplier ปริมาณ เรต FX ราคา และประวัติเดิม</p>}
   <div className="p55-table-wrap"><table className="p55-table" aria-label="SI draft import changes"><thead><tr><th>ข้อมูล</th><th>เพิ่ม DRAFT</th><th>มีแล้ว</th><th>คงรายการเดิมที่ต่างกัน</th></tr></thead><tbody>{plan.stats.map(s=><tr key={s.collection}><td>{s.collection}</td><td>{s.added}{s.updated?` / ปรับ DRAFT เดิม ${s.updated}`:""}</td><td>{s.unchanged}</td><td>{s.preserved.length>0?<details><summary>{s.preserved.length} รายการ</summary>{s.preserved.join(", ")}</details>:0}</td></tr>)}</tbody></table></div>
   <button type="button" disabled={busy||!plan.changed} onClick={apply}>Apply SI work package</button> <button type="button" disabled={busy} onClick={()=>{setPack(null);setPlan(null);}}>Cancel SI import</button>
  </div>}
 </Module>;
}
