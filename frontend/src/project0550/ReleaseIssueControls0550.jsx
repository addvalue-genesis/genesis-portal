import React,{useState} from "react";
import {useBidWorkspace,downloadBidFile} from "./BidWorkspaceContext";
import {Field,Save} from "./BidControls";
import {newId,deriveBidWorkspace} from "./data/bidWorkspaceModel";
import {SYSTEMS} from "./data";
import {deriveIntegration0550} from "./data/integrationWorkspace0550";
import {prepareReleaseIssue0550,recordReleaseTransmittal0550} from "./data/releaseIssue0550";
import {exportOfficialCustomerXlsx} from "./exportOriginalPriceForm";

export function ReleaseIssueControls0550({provisional=false}){
 const {data,model,busy,change,reviewDate}=useBidWorkspace();
 const [authorization,setAuthorization]=useState({number:"",authorizedBy:"",authorizedOn:reviewDate,authorizationRef:"",customerFormConfirmed:false});
 const [sent,setSent]=useState({issueId:"",sentOn:reviewDate,recipient:"",reference:"",recordedBy:""}),[message,setMessage]=useState("");
 const c=model?.releaseControl;if(!c)return null;
 const derive=(d,date)=>{const integration=deriveIntegration0550(d,SYSTEMS,date);return {...deriveBidWorkspace(d,SYSTEMS.map(s=>s.token),date,integration),integration};};
 const freeze=async e=>{e.preventDefault();if(await change(d=>prepareReleaseIssue0550(d,derive(d,reviewDate),{...authorization,id:newId("ISSUE")},reviewDate),"Authorize and freeze commercial issue / "+authorization.number)){setMessage("ตรึงฉบับที่อนุมัติแล้ว · ยังไม่ได้บันทึกว่าส่งลูกค้า");setAuthorization(a=>({...a,number:"",customerFormConfirmed:false}));}};
 const transmit=async e=>{e.preventDefault();if(await change(d=>recordReleaseTransmittal0550(d,{...sent,id:newId("TX")},reviewDate),"Record actual commercial transmittal / "+sent.reference))setMessage("บันทึกหลักฐานการส่งแล้ว · โปรแกรมไม่ได้ส่งอีเมลให้อัตโนมัติ");};
 const exportIssue=issue=>{try{exportOfficialCustomerXlsx(null,issue);setMessage("ส่งออกจากข้อมูลและราคาที่ตรึงไว้ในฉบับ "+issue.number);}catch(e){setMessage(e.message);}};
 const backlog=[
  ...(model.integration?.documentGaps||[]).map(r=>({type:"DOCUMENT",id:r.id,problems:[r.reason]})),
  ...(model.integration?.requirements||[]).filter(r=>r.problems.length).map(r=>({type:"REQUIREMENT",id:r.id,system:r.systemToken,title:r.title,sourceIds:r.sourceIds,locator:r.sourceLocator,problems:r.problems})),
  ...model.official.selected.filter(r=>r.reviewProblems.length).map(r=>({type:"PRICE",id:r.id,customerRow:r.customerRowCode,title:r.description,problems:r.reviewProblems})),
  ...model.official.schedule.filter(r=>!r.ready).map(r=>({type:"CUSTOMER_ROW",id:r.code,problems:r.problems}))
 ];
 return <section className="p55-panel" aria-label="Commercial release control">
  <h3>ตรวจความพร้อม / อนุมัติ / ตรึงฉบับ / หลักฐานการส่ง</h3>
  <p><strong>{c.state}</strong> · {c.issues.length} ฉบับที่ตรึงแล้ว · {c.transmittals.length} หลักฐานการส่ง · การกรอกชื่อผู้อนุมัติเป็นบันทึกภายใน ไม่ใช่ลายเซ็นหรือการยืนยันตัวตน</p>
  {c.problems.length>0&&<ul>{c.problems.map(p=><li key={p}>{p}</li>)}</ul>}
  <button type="button" disabled={busy} onClick={()=>downloadBidFile({projectId:data.projectId,revision:data.revision,preparedOn:reviewDate,state:c.state,checks:c.problems,backlog},`PJ2608-0550_Release_Review_R${data.revision}.json`)}>Export Internal Release Review / รายการที่ต้องปิด</button>
  <details><summary>รายละเอียดที่ยังต้องปิด · {backlog.length} รายการตรวจ</summary><p>รายการตรวจอาจอ้างประเด็นเดียวกันหลายระดับ ห้ามรวมจำนวนเป็นจำนวนข้อผิดพลาดหรือเปอร์เซ็นต์ความครบ</p><div className="p55-table-wrap"><table className="p55-table" aria-label="Release readiness backlog"><thead><tr><th>ประเภท / ID</th><th>รายละเอียด</th></tr></thead><tbody>{backlog.map((r,i)=><tr key={r.type+r.id+i}><td>{r.type} / {r.id}</td><td>{r.title}<small>{r.problems.join(" / ")}</small></td></tr>)}</tbody></table></div></details>
  <details><summary>บันทึกอนุมัติและตรึงราคาฉบับปัจจุบัน</summary>
   <p>เปิดให้บันทึกเมื่อ Integration, Customer scope, ราคาสกุล USD, FX และข้อค้นพบผ่านครบ ต้องยืนยันว่าแบบราคานี้ใช้กับ Tender รอบปัจจุบันแล้ว</p>
   {provisional&&<p>เลือกมุมมอง Official · ตรวจทบทวนแล้ว ก่อนอนุมัติฉบับ</p>}
   <form onSubmit={freeze}><div className="p55-bid-fields">{[["number","Commercial issue number"],["authorizedBy","Release authorized by"],["authorizationRef","Release authorization evidence / reference"]].map(([key,label])=><Field key={key} label={label} value={authorization[key]} required onChange={v=>setAuthorization(a=>({...a,[key]:v}))}/>)}<Field label="Release authorization date" type="date" value={authorization.authorizedOn} max={reviewDate} required onChange={v=>setAuthorization(a=>({...a,authorizedOn:v}))}/><label><input type="checkbox" checked={authorization.customerFormConfirmed} onChange={e=>setAuthorization(a=>({...a,customerFormConfirmed:e.target.checked}))}/>ตรวจยืนยันแบบราคา 8 คอลัมน์กับ Tender ปัจจุบันแล้ว</label></div><Save busy={busy||provisional||!c.ready||!authorization.customerFormConfirmed}>อนุมัติและตรึงฉบับ Commercial</Save></form>
  </details>
  <details open={c.issues.length>0}><summary>ประวัติฉบับ Commercial ที่ตรึงแล้ว</summary>
   {c.issues.map(issue=><article className="p55-panel" key={issue.id}><strong>{issue.number}</strong><p>ผู้อนุมัติ {issue.authorizedBy} · {issue.authorizedOn} · {issue.authorizationRef} · Working R{issue.snapshot.revision}</p><p>{c.transmittals.some(t=>t.issueId===issue.id)?"ISSUED — มีบันทึกหลักฐานการส่ง":"AUTHORIZED — ยังไม่มีหลักฐานการส่ง"}{c.current?.id===issue.id?" · ตรงกับ Working ปัจจุบัน":" · Working ปัจจุบันต่างจากฉบับนี้"}</p><button type="button" onClick={()=>exportIssue(issue)}>Export Frozen XLSX · {issue.number}</button> <button type="button" onClick={()=>downloadBidFile(issue,`PJ2608-0550_Issue_${issue.number.replace(/[^\w.-]/g,"_")}_INTERNAL.json`)}>Export Internal Frozen Basis · {issue.number}</button><details><summary>Source / Working / Engineering ของฉบับนี้</summary><p>ราคา {issue.baseUSD} USD · Options {issue.optionsUSD??"EXCLUDED"} USD</p><p>Source batch: {issue.snapshot.sourceIntake?.batchId} · {issue.snapshot.sourceIntake?.sources.length} source records · {issue.snapshot.lines.length} Working rows · {issue.snapshot.integrationWorkspace?.proofs.length||0} CAL/RPT</p></details></article>)}
  </details>
  {c.issues.length>0&&<details><summary>บันทึกหลักฐานที่ส่งลูกค้าแล้ว</summary><form onSubmit={transmit}><label>Commercial issue to transmit<select aria-label="Commercial issue to transmit" value={sent.issueId} required onChange={e=>setSent(s=>({...s,issueId:e.target.value}))}><option value="">เลือกฉบับที่ส่งจริง</option>{c.issues.map(i=><option key={i.id} value={i.id}>{i.number}</option>)}</select></label><div className="p55-bid-fields"><Field label="Actual sent date" type="date" max={reviewDate} value={sent.sentOn} required onChange={v=>setSent(s=>({...s,sentOn:v}))}/>{[["recipient","Actual transmittal recipient"],["reference","Actual transmittal evidence / reference"],["recordedBy","Transmittal recorded by"]].map(([key,label])=><Field key={key} label={label} required value={sent[key]} onChange={v=>setSent(s=>({...s,[key]:v}))}/>)}</div><Save busy={busy}>บันทึกหลักฐานการส่งจริง</Save></form></details>}
  {c.transmittals.map(t=><p key={t.id}>{c.issues.find(i=>i.id===t.issueId)?.number} · {t.sentOn} → {t.recipient} · {t.reference} · บันทึกโดย {t.recordedBy}</p>)}
  <p role="status">{message}</p>
 </section>;
}
