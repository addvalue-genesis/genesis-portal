import React, {useState} from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {Module, Field, Save} from "./BidControls";
import {validateEquipmentPolicy, readEquipmentPolicyFile} from "./data/bidWorkspaceModel";

const blank=()=>({method:"SAME_COST_BASE",primePct:null,feePct:null,reservePct:null,source:"",date:""});
export function EquipmentPolicyControls(){
 const {data,change,busy}=useBidWorkspace();
 const [draft,setDraft]=useState(null),[error,setError]=useState("");
 const policy=draft||data.equipmentPolicy||blank();
 const edit=(key,value)=>setDraft({...policy,[key]:value});
 async function readFile(file){
  if(!file)return;
  try{if(file.size>32768)throw Error("Policy file exceeds 32 KiB");setDraft(readEquipmentPolicyFile(JSON.parse(await file.text())));setError("");}catch(e){setError(e.message);}
 }
 return <Module id="bid.budget.equipment-policy" title="นโยบายค่าของ — ต้นทุนเดียว แยกสามส่วน" open={!data.equipmentPolicy}>
  <p>ใช้ต้นทุนจริงหรือต้นทุนประเมินที่เลือกใน Working เพียงครั้งเดียว ทุกเปอร์เซ็นต์คิดจากต้นทุนนั้น ไม่ทบกัน เงินเผื่อ ADDVALUE แยกจากค่าตอบแทน งานบริการใช้ราคาตามแถวของงานบริการ</p>
  <p>{data.equipmentPolicy?`ใช้อยู่: SAMTEL ${data.equipmentPolicy.primePct}% · ADDVALUE ${data.equipmentPolicy.feePct}% · เงินเผื่อ ${data.equipmentPolicy.reservePct}%` : "ยังไม่ได้ตั้งนโยบาย: แถวค่าของจะเป็น OPEN จนบันทึกค่าที่ตกลง"}</p>
  <form onSubmit={async e=>{e.preventDefault();try{validateEquipmentPolicy(policy);if(await change(d=>({...d,equipmentPolicy:policy}),"Update private equipment policy")){setDraft(null);setError("");}}catch(ex){setError(ex.message);}}}>
   <label>นำเข้าค่าตั้งราคาที่เตรียมไว้ <input aria-label="Import equipment policy" type="file" accept=".json,application/json" disabled={busy} onChange={e=>{readFile(e.target.files[0]);e.target.value="";}}/></label>
   <div className="p55-bid-fields">
    {[["primePct","SAMTEL percent of cost"],["feePct","ADDVALUE fee percent of cost"],["reservePct","ADDVALUE reserve percent of cost"]].map(([key,label])=><Field key={key} label={label} type="number" min="0" max="1000" step="any" value={policy[key]} onChange={v=>edit(key,v)}/>)}
    <Field label="Policy source / decision" value={policy.source} onChange={v=>edit("source",v)} required/>
    <Field label="Policy date" type="date" value={policy.date} onChange={v=>edit("date",v)} required/>
   </div>
   <p>บันทึกแล้วคำนวณแถวค่าของทั้งหมดใน Working ใหม่ รวม Budget THB / USD Review การนำเข้าค่าตั้งนี้ไม่แทนที่ Vendor, Offer หรือแถวงานเดิม และไม่แก้ประวัติที่ออกไปแล้ว</p>
   <Save busy={busy}>ใช้ค่าตั้งนี้กับ Working</Save>
   {error&&<p role="alert">{error}</p>}
  </form>
 </Module>;
}
