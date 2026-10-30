import React,{useState,useMemo} from "react";
import {useBidWorkspace,downloadBidFile} from "./BidWorkspaceContext";
import {SYSTEMS} from "./data";
import {emptyIntegration0550} from "./data/integrationWorkspace0550";
import {searchSourceEvidence0550,requirementFromSourceHit0550} from "./data/sourceEvidence0550";

// A and B inspect the same source and requirement IDs; no shadow search database.
export function SourceEvidenceSearch0550({onOpenSource=()=>{},initialQuery=""}){
 const {data,busy,change}=useBidWorkspace();
 const [input,setInput]=useState(initialQuery),[query,setQuery]=useState(initialQuery),[authority,setAuthority]=useState("CURRENT_TENDER"),[system,setSystem]=useState(""),[message,setMessage]=useState("");
 const result=useMemo(()=>searchSourceEvidence0550(data||{},query,{authority}),[data,query,authority]);
 const tokens=SYSTEMS.map(s=>s.token);
 async function prepare(hit){
  try{const r=requirementFromSourceHit0550(data,hit,system,tokens);
   const ok=await change(d=>{const row=requirementFromSourceHit0550(d,hit,system,tokens),w={...emptyIntegration0550(),...d.integrationWorkspace};if(w.requirements.some(r=>r.id===row.id))return d;return {...d,integrationWorkspace:{...w,requirements:[...w.requirements,row]}};},"Prepare requirement from A / "+r.id);
   if(ok)setMessage("เตรียม "+r.id+" ในข้อกำหนดกลางแล้ว · เปิด B / Working Preview 4 เพื่อตรวจความหมายและทำ SI ต่อ");
  }catch(e){setMessage(e.message);}
 }
 return <details className="p55-a-evidence-search" aria-label="Search A source evidence"><summary>ค้นเนื้อหาเอกสาร A → เตรียมข้อกำหนดให้ B</summary>
  <p>ค้นข้อความที่มีอยู่จริงในทะเบียนทั้งหมด รวมเอกสารนอก MR/PHI/LIS · ผลค้นเป็นหลักฐานให้ตรวจต่อ การพบคำ เช่น AIS ยังต้องตรวจว่าเป็น Automatic Identification System หรือคำย่ออื่น และงานร่วมต้องพิจารณาด้วย</p>
  <form onSubmit={e=>{e.preventDefault();setQuery(input);setMessage("");}} className="p55-review-toolbar">
   <label>คำหรือวลีในต้นฉบับ <input aria-label="A source text query" value={input} maxLength={200} onChange={e=>setInput(e.target.value)}/></label>
   <label>ชุดเอกสาร <select aria-label="A evidence authority" value={authority} onChange={e=>setAuthority(e.target.value)}><option value="CURRENT_TENDER">Current Tender</option><option value="ALL">ทุก authority รวมประวัติและ Supplier</option></select></label>
   <button type="submit" disabled={!data||input.trim().length<2}>ค้นหลักฐานใน A</button>
  </form>
  <label>ระบบสำหรับข้อกำหนดร่าง <select aria-label="A evidence requirement system" value={system} onChange={e=>setSystem(e.target.value)}><option value="">เลือกระบบหลังตรวจบริบท</option><option value="COMMON">COMMON / งานร่วม</option>{SYSTEMS.map(s=><option key={s.token} value={s.token}>{s.name}</option>)}</select></label>
  <p role="status">{message||`พบ ${result.total} ตำแหน่ง จาก ${result.sources} source records · แสดง ${result.rows.length} ตำแหน่งแรก`}</p>
  {query&&<p>พบข้อความเฉพาะไฟล์ที่มีเนื้อหาในทะเบียน · ไฟล์ METADATA_ONLY รูป/สี และข้อความที่สกัดไม่ได้ยังต้องเปิดต้นฉบับตรวจ · ไม่พบคำไม่ได้แปลว่าไม่มีข้อกำหนด</p>}
  {!!result.rows.length&&<><button type="button" onClick={()=>downloadBidFile({projectId:data.projectId,sourceBatchId:data.sourceIntake.batchId,query,authority,state:"DISCOVERY_DRAFT",total:result.total,rows:result.rows},"PJ2608-0550_A_Evidence_Search.json")}>Export หลักฐานที่ค้นพบ</button>
   <div className="p55-table-wrap"><table className="p55-table" aria-label="A source text results"><thead><tr><th>ต้นฉบับ / ฉบับ / สถานะ</th><th>ข้อความจริง / ตำแหน่ง</th><th>ส่งต่อ B</th></tr></thead><tbody>{result.rows.map(h=><tr key={h.id}><td><button type="button" onClick={()=>onOpenSource("bid.documents.source."+h.sourceId)}>{h.title}</button><small>{h.documentNo} {h.revision} / {h.family}</small><small>{h.authority} / {h.readState}</small></td><td><pre className="p55-source-text">{h.excerpt}</pre><small>{h.locator}</small></td><td>DISCOVERY / DRAFT<button type="button" disabled={busy||!system||h.authority!=="CURRENT_TENDER"} onClick={()=>prepare(h)}>เตรียมข้อกำหนดใน B</button></td></tr>)}</tbody></table></div></>}
 </details>;
}
