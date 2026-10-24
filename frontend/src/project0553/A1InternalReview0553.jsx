import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectWorkingBomProjection0553} from "./data/workingBomReviewedProjection0553";
const stateTH={COMMENT:"มี comment",NOT_REVIEWED:"ยังไม่ได้ตรวจ",REVIEWED_NO_COMMENT:"ตรวจแล้วไม่มี comment"};
export function A1InternalReview0553({review=null,placement="WORKING"}){
 const [openRows,setOpenRows]=useState({});
 const current=review||selectWorkingBomProjection0553({mr:"MR-0001"}).internalReview;
 if(!current)return null;
 const comments=current.comments.filter(c=>c.kind!=="COMMERCIAL_CONFIRMATION");
 const confirmations=current.comments.filter(c=>c.kind==="COMMERCIAL_CONFIRMATION");
 const id=current.moduleId+"."+placement.toLowerCase();
 return <section className="p55-panel p553-a1-review" data-component-key={id} data-testid={"a1-review-"+placement.toLowerCase()}>
  <h4>A1 — ผลตรวจทานภายใน SI · {placement} <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/></h4>
  <p className="p55-note">{current.principleTH}</p>
  <details><summary>＋ เอกสารลูกค้า / Revision ที่บันทึกในระบบ</summary>{Object.entries(current.sourceDocuments).map(([key,d])=><p key={key}><strong>{key}: {d.documentNo} Rev.{d.revision}</strong> · {d.title}</p>)}<p className="p55-note">DWG / LAY และ revision ปัจจุบันให้ยืนยันตาม A1-C07; รายการนี้เป็นทะเบียนอ้างอิง ไม่ใช่การอนุมัติเอกสารต้นฉบับ</p></details>
  <p className="p55-note"><strong>ฐานข้อกำหนดลูกค้า:</strong> {current.customerBasis.join(" / ")} · <strong>Source:</strong> Working Preview → Budgetary → Release · Revision {current.revision}</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>การตรวจ 1–8</th><th>ไม่มี comment</th><th>มี comment</th><th>ยังไม่ได้ตรวจ</th></tr></thead><tbody>
   {current.steps.map(s=><tr key={s.step}><td>{s.step}. {s.nameTH}</td><td>{s.noComment}</td><td>{s.comment}</td><td>{s.notReviewed}</td></tr>)}
  </tbody></table></div>
  <p className="p55-note" role="status"><strong>ตรวจครบและไม่มี comment ค้าง {current.reviewedNoCommentRows}/{current.sourceRows} TAG/รายการ.</strong> {current.complete?"การตรวจภายในครบตามหลักฐานที่บันทึก":"ยังต้องจัดการ comment หรือบันทึกผลตรวจตามรายการด้านล่าง"} · การยืนยัน OEM/ราคา และการอนุมัติออกเอกสารเป็นคนละสถานะ ไม่เปลี่ยนยอดต้นทุนจากหน้านี้</p>
  {current.issues.length>0&&<p role="alert">Source identity / allocation error: {current.issues.map(x=>x.sourceId+" "+x.errors.join(", ")).join("; ")}</p>}
  <details><summary>＋ Comment / งานตรวจค้าง ({comments.length})</summary>
   {comments.map(c=>{const linked=current.rows.filter(r=>r.commentIds.includes(c.id));return <div className="p55-panel" key={c.id}>
    <strong>{c.id} · {c.status==="NOT_REVIEWED"?"ยังไม่ได้ตรวจ":"มี comment"} · ขั้น {c.steps.join(", ")}</strong>
    <p>{c.textTH}</p><p><strong>การดำเนินการ:</strong> {c.actionTH}</p>
    <small>Owner: {c.owner} · {linked.length} source rows · Sites: {[...new Set(linked.map(r=>r.site))].join(", ")}</small>
    <p className="p55-note">หลักฐาน: {c.evidence.join(" · ")}</p>
   </div>;})}
  </details>
  {confirmations.length>0&&<details><summary>＋ การยืนยันราคา / Commercial confirmation (แยกจากผลตรวจ 1–8)</summary>{confirmations.map(c=><p key={c.id}><strong>{c.id}</strong> {c.textTH} {c.actionTH}</p>)}</details>}
  <details><summary>＋ ผลตรวจแยก Site / TAG ({current.sourceRows})</summary>
   {current.rows.map(r=><details key={r.sourceId} onToggle={e=>{const open=e.currentTarget.open;setOpenRows(v=>v[r.sourceId]===open?v:{...v,[r.sourceId]:open});}}><summary>{r.site} · {r.tag} · MTO row {r.row} · {r.internalReviewComplete?"ตรวจครบ":"ดูผลตรวจ"}</summary>
    {openRows[r.sourceId]&&<><p className="p55-note">Source ID: {r.sourceId} · Qty {r.qty} · Comment: {r.commentIds.join(", ")||"ไม่มีบันทึก comment; ต้องมีหลักฐานผลตรวจก่อนถือว่าผ่าน"}</p>
    <details><summary>＋ ข้อกำหนดลูกค้าที่ต้องตรวจ ({r.requirements.length})</summary>{r.requirements.map(q=><p key={q.id}><strong>{q.id} · {q.document} · {q.section} · หน้า {q.page||"—"}</strong><br/>{q.requirement}<small>SI action: {q.siAction}</small></p>)}</details>
    <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>ขั้น</th><th>ผลตรวจ</th><th>หลักฐาน / Comment</th></tr></thead><tbody>{r.checks.map(c=><tr key={c.step}><td>{c.step}. {c.name}</td><td>{stateTH[c.state]}{c.staleReview&&" · SOURCE CHANGED"}</td><td>{c.commentIds.join(", ")||c.evidence.join(" · ")||"ยังไม่มีบันทึกผลตรวจ"}{c.reviewScope&&<small>ขอบเขตการตรวจ: {c.reviewScope}</small>}{c.reviewer&&<small>{c.reviewer}</small>}</td></tr>)}</tbody></table></div></>}
   </details>)}
  </details>
 </section>;
}
