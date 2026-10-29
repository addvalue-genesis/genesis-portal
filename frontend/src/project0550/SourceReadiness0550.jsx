import React,{useState,useMemo,useRef,useEffect} from "react";
import {useBidWorkspace,downloadBidFile} from "./BidWorkspaceContext";
import {Field,Select,Save} from "./BidControls";
import {Multi} from "./WorkingPreview0550";
import {deriveSourceReadiness0550,emptySourceControl0550,bindUniqueSourceInputs0550,stampSourceControl0550} from "./data/sourceReadiness0550";
import {newId} from "./data/bidWorkspaceModel";
import {blankDocumentReview0550,stampIntegration0550,emptyIntegration0550} from "./data/integrationWorkspace0550";
import {DELIVERY_KINDS_0550} from "./workingPreviewStages0550";

// Part of the existing A controlled-source-inventory module, not a new module ID.
export function SourceReadiness0550({onOpenSource=()=>{}}){
 const {data,model,busy,change,reviewDate}=useBidWorkspace();
 const [query,setQuery]=useState(""),[openOnly,setOpenOnly]=useState(false),[edit,setEdit]=useState(null),[extra,setExtra]=useState(null),[review,setReview]=useState(null),[doc,setDoc]=useState(null),[message,setMessage]=useState("");
 const editor=useRef(null);
 useEffect(()=>{editor.current?.scrollIntoView({block:"start"});},[edit?.inputId,extra?.id,doc?.id,Boolean(review)]);
 const readiness=useMemo(()=>model?.sourceReadiness||(data?deriveSourceReadiness0550(data,model?.integration,reviewDate):null),[data,model,reviewDate]);
 if(!readiness)return null;
 const control=data.sourceControl||emptySourceControl0550(),sources=data.sourceIntake?.sources||[];
 const rows=readiness.rows.filter(r=>(!openOnly||r.problems.length)&&(r.id+" "+r.documentNo+" "+r.title+" "+r.revision).toLowerCase().includes(query.toLowerCase()));
 const save=async(transform,action)=>{const ok=await change(d=>({...d,sourceControl:transform(d)}),"A input control / "+action);if(ok)setMessage("บันทึกแล้ว · ตรวจสถานะ A ด้านล่าง; ยังไม่ใช่การอนุมัติ Engineering หรือ Release");return ok;};
 const showSource=s=>onOpenSource("bid.documents.source."+s.id);
 const blankExtra=()=>({id:newId("RFQ-EXTRA"),kind:"DOCUMENT",documentNo:"",revision:"",title:"",requiredBy:"",locator:"",sourceExcerpt:""});
 return <section className="p55-a-readiness" aria-label="A RFQ input readiness">
  <h3>A · เอกสารที่ RFQ ต้องมี → เอกสารที่ได้รับ → พร้อมให้ B ใช้</h3>
  <p><strong>{readiness.state}</strong> · ต้องมี {readiness.expected} รายการ · พบเลข/ฉบับตรง {readiness.matched} · ผูกต้นฉบับผ่าน {readiness.bound} · ตรวจอ่านผ่าน {readiness.reviewed}</p>
  <p>ฐาน MR Appendix 2 มี 78 รายการเลขเอกสาร/ฉบับ พร้อม SDRL/ITR ที่ฝังใน MR และเอกสารประกวดราคาเพิ่มเติม · ตัวหารนี้เป็นฐานเริ่มต้น ต้องตรวจ RFQ และ cross-references เพิ่ม ไม่ใช่การยืนยันว่าครบทั้งโครงการ</p>
  <p>78 รายการข้างต้นมีทุกประเภทตาม MR รวม PHI/SPE/DTS/BLD/LAY/STD/LIS ไม่จำกัดเฉพาะ MR, PHI และ LIS · เอกสารส่งมอบภายหลัง เช่น FAT/SAT report ตาม SDRL เป็นงานของ B ไม่ถูกนับเป็นไฟล์ลูกค้าที่ขาดใน A</p>
  <details><summary>หลักการ / เกณฑ์ความพร้อม A</summary><p>ต้องผูกไฟล์ที่ได้รับกับเอกสารที่ RFQ ระบุ ตรวจเลข/ฉบับ/authority อ่านครบตาม Document reading ledger และทบทวนรายการเอกสารทั้งหมดรวมเอกสารอ้างอิง · พบไฟล์หรือมี TEXT_READ อย่างเดียวไม่เท่ากับพร้อม · ไม่เลือก revision ที่สูงกว่า หรือเปลี่ยน 10006 เป็น 10008 ให้อัตโนมัติ</p><p>{readiness.catalog.coverageNote}</p></details>
  <div role="status" aria-live="polite">{message}</div>
  <div className="p55-review-toolbar">
   <button type="button" disabled={busy||!sources.length} onClick={()=>save(bindUniqueSourceInputs0550,"bind unique exact document/version candidates")}>ผูกเฉพาะเลข/ฉบับที่ตรงและมีต้นฉบับปัจจุบันเดียว</button>
   <button type="button" disabled={busy} onClick={()=>setExtra(blankExtra())}>เพิ่มเอกสารที่ RFQ / เอกสารอ้างอิงกำหนด</button>
   <button type="button" disabled={busy} onClick={()=>setReview({...control.review})}>ทบทวนความครบของ A</button>
   <button type="button" onClick={()=>downloadBidFile({projectId:data.projectId,revision:data.revision,sourceBatchId:data.sourceIntake?.batchId,state:readiness.state,basisKey:readiness.basisKey,checks:readiness.problems,expectedInputs:readiness.rows.map(({bound,candidates,related,...r})=>({...r,boundSourceIds:bound.map(s=>s.id),candidateSourceIds:candidates.map(s=>s.id),relatedSourceIds:related.map(s=>s.id)}))},`PJ2608-0550_A_Input_Review_R${data.revision}.json`)}>Export A input review</button>
  </div>
  {readiness.problems.length>0&&<p><strong>ยังส่งต่อเป็นฐานที่พร้อมไม่ได้:</strong> {readiness.problems.join(" / ")}</p>}
  {(edit||extra||review||doc)&&<div ref={editor}/>}
  {doc&&<form onSubmit={async e=>{e.preventDefault();const ok=await change(d=>{const w={...emptyIntegration0550(),...d.integrationWorkspace};return {...d,integrationWorkspace:{...w,documentReviews:[...w.documentReviews.filter(r=>r.id!==doc.id),stampIntegration0550(d,"documentReviews",doc)]}};},"A document reading / "+doc.id);if(ok){setDoc(null);setMessage("บันทึกการอ่านในทะเบียนกลางแล้ว · A และ B ใช้ผลตรวจเดียวกัน");}}}>
   <h4>ตรวจอ่านต้นฉบับใน A · {sources.find(s=>s.id===doc.id)?.title}</h4>
   <div className="p55-bid-fields"><Multi label="A document applicable systems" value={doc.systemTokens} onChange={v=>setDoc(f=>({...f,systemTokens:v}))} options={(model?.integration?.scopes||[]).map(s=>[s.id,s.id])}/>
   <Field label="A document total PDF pages" type="number" min="1" value={doc.expectedPages} onChange={v=>setDoc(f=>({...f,expectedPages:v}))}/><Field label="A reviewed PDF pages / ranges" value={doc.reviewedPages} onChange={v=>setDoc(f=>({...f,reviewedPages:v}))}/>
   <Multi label="A document obligation categories reviewed" value={doc.categories} onChange={v=>setDoc(f=>({...f,categories:v}))} options={DELIVERY_KINDS_0550.map(k=>[k,k])}/>
   <Field label="A document review basis / exceptions" value={doc.basis} onChange={v=>setDoc(f=>({...f,basis:v}))}/>
   {[["notesReviewed","ตรวจ notes / ข้อความท้ายตาราง"],["colourReviewed","ตรวจภาพ สี ไฮไลต์ และ annotations"],["appendicesReviewed","ตรวจ appendix / attachments และอ้างอิง"]].map(([k,label])=><label key={k}><input type="checkbox" checked={doc[k]} onChange={e=>setDoc(f=>({...f,[k]:e.target.checked}))}/>{label}</label>)}
   <Select label="A document review status" value={doc.status} onChange={v=>setDoc(f=>({...f,status:v,reviewedOn:f.reviewedOn||reviewDate}))} options={["DRAFT","REVIEWED"]}/><Field label="A document reviewer" value={doc.reviewer} onChange={v=>setDoc(f=>({...f,reviewer:v}))}/><Field label="A document review date" type="date" value={doc.reviewedOn} onChange={v=>setDoc(f=>({...f,reviewedOn:v}))}/></div>
   <p>บันทึกใน documentReviews เดียวกับ B · ไม่เปลี่ยน readState ของ intake อัตโนมัติ หากต้นฉบับยัง TEXT_PARTIAL / METADATA_ONLY ต้องตรวจและอัปเดตทะเบียนเนื้อหาก่อนจึงผ่าน</p>
   <Save busy={busy}>บันทึกการอ่านเอกสารใน A</Save><button type="button" onClick={()=>setDoc(null)}>ปิด</button>
  </form>}
  {edit&&<form onSubmit={async e=>{e.preventDefault();if(await save(d=>{const c=d.sourceControl||emptySourceControl0550();return {...c,bindings:[...c.bindings.filter(b=>b.inputId!==edit.inputId),edit]};},"bind "+edit.inputId))setEdit(null);}}>
   <h4>ผูกต้นฉบับ {edit.inputId}</h4>
   <Multi label="A received source IDs" value={edit.sourceIds} onChange={v=>setEdit(f=>({...f,sourceIds:v}))} options={sources.map(s=>[s.id,`${s.documentNo||s.title} / ${s.revision||"?"} / ${s.authority}`])}/>
   <Field label="A binding page / clause / sheet / archive member" value={edit.locator} onChange={v=>setEdit(f=>({...f,locator:v}))}/>
   <p>เลือกเอกสารจริงและตำแหน่งที่ตรวจ ไม่ถือว่าผ่านเพราะเลือกในรายการ; เลข/ฉบับ/การอ่านและ Document review ยังถูกตรวจจากข้อมูลกลาง</p>
   <Save busy={busy}>บันทึกการผูกเอกสาร</Save><button type="button" onClick={()=>setEdit(null)}>ปิด</button>
  </form>}
  {extra&&<form onSubmit={async e=>{e.preventDefault();if(await save(d=>{const c=d.sourceControl||emptySourceControl0550();return {...c,extraInputs:[...c.extraInputs,extra]};},"add expected input "+extra.id))setExtra(null);}}>
   <h4>เพิ่ม expected input จากข้อกำหนดจริง</h4><div className="p55-bid-fields">
   <Select label="A expected input kind" value={extra.kind} onChange={v=>setExtra(f=>({...f,kind:v}))} options={[["DOCUMENT","เอกสารมีเลข/ฉบับ"],["EMBEDDED","ส่วนที่ฝังในเอกสาร"],["ATTACHMENT","เอกสารแนบ/ชุดเอกสารไม่มีเลข"]]}/>
   {[["title","A expected document title"],["documentNo","A expected document number"],["revision","A expected revision"],["requiredBy","A requirement defining this input"],["locator","A requirement page / clause"],["sourceExcerpt","A embedded section text"]].map(([key,label])=><Field key={key} label={label} value={extra[key]} onChange={v=>setExtra(f=>({...f,[key]:v}))}/>)}</div>
   <Save busy={busy}>เพิ่มเอกสารในตัวหาร A</Save><button type="button" onClick={()=>setExtra(null)}>ปิด</button>
  </form>}
  {review&&<form onSubmit={async e=>{e.preventDefault();if(await save(d=>stampSourceControl0550(d,{...(d.sourceControl||emptySourceControl0550()),review}),"review RFQ input denominator"))setReview(null);}}>
   <h4>ทบทวนรายการและขอบเขต A</h4><div className="p55-bid-fields">
   <Select label="A manifest review status" value={review.status} onChange={v=>setReview(f=>({...f,status:v,reviewedOn:f.reviewedOn||reviewDate}))} options={["DRAFT","REVIEWED"]}/>
   <Field label="A manifest reviewer" value={review.reviewer} onChange={v=>setReview(f=>({...f,reviewer:v}))}/><Field label="A manifest review date" type="date" value={review.reviewedOn} onChange={v=>setReview(f=>({...f,reviewedOn:v}))}/>
   <Field label="A RFQ / received set / reference reconciliation basis" value={review.basis} onChange={v=>setReview(f=>({...f,basis:v}))}/>
   {[["rfqReviewed","ตรวจรายการตาม RFQ / contract / procurement instructions ครบ"],["receivedSetReviewed","ตรวจทุกชุดที่ได้รับ รวมโฟลเดอร์ย่อยและไฟล์ใน archive"],["referencesReviewed","ตรวจเอกสารอ้างอิงและเพิ่มรายการที่ต้องใช้ครบแล้ว"]].map(([key,label])=><label key={key}><input type="checkbox" checked={review[key]} onChange={e=>setReview(f=>({...f,[key]:e.target.checked}))}/>{label}</label>)}</div>
   <p>บันทึกการทบทวนไม่ข้ามเอกสารขาด/ฉบับผิด/ยังอ่านไม่ครบ · เมื่อ intake หรือ bindings เปลี่ยน การทบทวนเดิมจะเป็น STALE</p>
   <Save busy={busy}>บันทึกผลทบทวน A</Save><button type="button" onClick={()=>setReview(null)}>ปิด</button>
  </form>}
  <div className="p55-review-toolbar"><Field label="Search A expected inputs" value={query} onChange={setQuery}/><label><input type="checkbox" checked={openOnly} onChange={e=>setOpenOnly(e.target.checked)}/>เฉพาะรายการยังไม่ครบ</label></div>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="A expected versus received inputs"><thead><tr><th>เอกสารที่ต้องมี / เหตุผล</th><th>พบต้นฉบับ / ฉบับใกล้เคียง</th><th>ต้นฉบับที่ผูก / อ่าน</th><th>สถานะ / ทำต่อ</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}>
   <td><strong>{r.documentNo||r.title} {r.revision}</strong><small>{r.title} / {r.id}</small><small>ต้องมีเพราะ: {r.requiredBy} / {r.locator}</small></td>
   <td>{r.candidates.length?`${r.candidates.length} ต้นฉบับเลข/ฉบับตรง`:(r.kind==="ATTACHMENT"?"ต้องเลือกเอกสารแนบจริง":"ยังไม่พบเลข/ฉบับตรง")}{r.related.length>0&&<details><summary>มีฉบับ/เลขอื่นให้ตรวจ {r.related.length}</summary>{r.related.map(s=><p key={s.id}><button type="button" onClick={()=>showSource(s)}>{s.title}</button> {s.revision} / {s.authority}</p>)}</details>}</td>
   <td>{r.bound.map(s=><div key={s.id}><button type="button" onClick={()=>showSource(s)}>{s.title}</button><small>{s.readState} / {s.effectiveAuthority}</small><button type="button" onClick={()=>setDoc(data.integrationWorkspace?.documentReviews.find(r=>r.id===s.id)||blankDocumentReview0550(s.id))}>ตรวจอ่านทุกหน้าใน A</button></div>)}{!r.bound.length&&"ยังไม่ผูกต้นฉบับ"}<small>{r.binding?.locator}</small></td>
   <td>{r.state}<details><summary>เหตุผล</summary>{r.problems.length?<ul>{r.problems.map(p=><li key={p}>{p}</li>)}</ul>:<p>ผ่าน receipt และการอ่านตามข้อมูลที่ผูก; ยังต้องผ่าน manifest review และ SI</p>}</details><button type="button" disabled={busy} onClick={()=>setEdit(r.binding?{...r.binding,sourceIds:[...r.binding.sourceIds]}:{inputId:r.id,sourceIds:[],locator:r.kind==="EMBEDDED"?r.locator:r.kind==="DOCUMENT"?"Document cover / document identity":""})}>ผูก / ตรวจต้นฉบับ</button></td>
  </tr>)}</tbody></table></div>
  <p>การอ่านใน A ใช้ Document reading ledger กลางเดียวกับ B → System Particular · {readiness.documentGaps.length} current source records ยังไม่มีผลอ่านครบ · เมื่อ A พร้อม B ยังต้องทำ SI 1–8 จึงไปถึง Release ได้</p>
 </section>;
}
