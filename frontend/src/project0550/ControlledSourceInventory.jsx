import React, { useEffect, useMemo, useState } from "react";
import { useBidWorkspace, downloadBidFile } from "./BidWorkspaceContext";
import { SYSTEMS, SOURCE_REGISTER, validateSourceIntake, applySourceIntake, deriveSourceIntake, deriveDocumentRevisionRegister, safeSourceUrl } from "./data";
import { Module } from "./BidControls";
import { ComponentCopyId } from "../common/ui/ComponentCopyId";
import {SiWorkPackage0550} from "./SiWorkPackage0550";
import {SourceReadiness0550} from "./SourceReadiness0550";

const TOKENS = SYSTEMS.map(s => s.token);
export function SourceLink({ source }) {
  const url = safeSourceUrl(source?.url);
  return url ? <a href={url} target="_blank" rel="noopener noreferrer">{source.title}</a> : <span>{source?.title || "OPEN"}</span>;
}
function SourceText({content}) {
  const [open,setOpen]=useState(false);
  return <details onToggle={e=>setOpen(e.currentTarget.open)}><summary>อ่านข้อความต้นทางที่ดึงมา</summary>{open&&<pre className="p55-source-text">{content}</pre>}</details>;
}
function SourceRefs({ ids, sources }) {
  return ids.map(id => <div key={id}><SourceLink source={sources.find(s => s.id === id)} /></div>);
}
function RevisionSource({ source }) {
  return <div><SourceLink source={source}/><small>{source.packageName || "ชุดเอกสารไม่ระบุ"} · {source.issuedDate || "วันที่ไม่ยืนยัน"} · {source.issuePurpose || "Purpose ไม่ยืนยัน"}</small></div>;
}
export function PackageComparison({ intake }) {
  if (!intake?.packageComparisons?.length) return <section aria-label="Package comparison awaiting data"><h3>เปรียบเทียบชุดแรก → Official Tender</h3><p>{intake ? "ชุดข้อมูลที่โหลดอยู่ยังไม่มีตารางเปรียบเทียบรอบส่งเอกสาร ตรวจสถานะการโหลดจาก Drive ด้านบน" : "กำลังรอทะเบียนจาก Google Drive for Desktop เมื่อโหลดสำเร็จ ตารางเปรียบเทียบจะแสดงที่นี่"}</p></section>;
  const evidence = ids => <details><summary>หลักฐาน {ids.length} รายการ</summary><SourceRefs ids={ids} sources={intake.sources}/></details>;
  return <details open><summary>เปรียบเทียบชุดแรก → Official Tender</summary>
    <p>ตารางนี้แยกรอบส่งเอกสารออกจาก revision · รายการไฟล์และชื่อ revision ไม่ยืนยันว่าเนื้อหาเหมือนกัน · ไม่พบไฟล์ในชุดหนึ่งไม่ได้แปลว่ายกเลิกข้อกำหนด</p>
    <div className="p55-table-wrap"><table className="p55-table" aria-label="First and official package comparison"><thead><tr><th>กลุ่มเอกสาร</th><th>ชุดแรก / เอกสารธุรกิจเดิม</th><th>Official Tender</th><th>ความเปลี่ยนแปลง / ขอบเขตการตรวจ</th></tr></thead><tbody>{intake.packageComparisons.map(c => <tr key={c.id}><td>{c.title}</td><td>{c.firstSummary}{evidence(c.firstSourceIds)}</td><td>{c.officialSummary}{evidence(c.officialSourceIds)}</td><td>{c.change}<small>{c.note}</small><small>{c.basis === "SELECTED_TEXT" ? "ตรวจข้อความเฉพาะส่วน — ยังไม่ใช่ redline ทุกข้อ" : "เทียบรายการ / ชื่อไฟล์ / revision — ยังไม่ยืนยันเนื้อหาทุกหน้า"}</small></td></tr>)}</tbody></table></div>
    {intake.sourcePackages?.length > 0 && <details><summary>ตำแหน่งชุดเอกสารและขอบเขตที่ตรวจ</summary><div className="p55-table-wrap"><table className="p55-table" aria-label="Source package locations"><thead><tr><th>ชุด / รอบ</th><th>จำนวนรายการในทะเบียน</th><th>ขอบเขต</th></tr></thead><tbody>{intake.sourcePackages.map(p => <tr key={p.id}><td><SourceLink source={p}/><small>{p.stage}</small></td><td>{p.sourceIds.length}{evidence(p.sourceIds)}</td><td>{p.note}</td></tr>)}</tbody></table></div></details>}
  </details>;
}
export function DocumentRevisionRegister({ intake }) {
  const rows = deriveDocumentRevisionRegister(intake);
  if (!rows.length) return null;
  const families = [...new Set(rows.map(r => r.family))].sort();
  return <details open><summary>ทะเบียนเทียบ Revision ตามเลขเอกสาร · {rows.length} เลขเอกสาร</summary>
    <p>ฉบับใช้งานอิงชุดเอกสารที่ตรวจยืนยัน ไม่เรียงตัวอักษร revision หรือวันอัปโหลด · B/C มีความหมายตามหน้าปกแต่ละชุด · ประวัติบนหน้าปกไม่ใช่หลักฐานว่าได้อ่านเนื้อหาทุก revision</p>
    {families.map(family => <details key={family} open={family === "MR"}><summary>{family} · {rows.filter(r => r.family === family).length} เลขเอกสาร</summary>
      <div className="p55-table-wrap"><table className="p55-table" aria-label={"Document revisions " + family}><thead><tr><th>เลขเอกสาร / สถานะ</th><th>ฉบับใน Current Tender</th><th>ประวัติ Revision จากหน้าปก</th><th>ฉบับเก่า / อ้างอิง / ถูกแทนที่</th></tr></thead><tbody>{rows.filter(r => r.family === family).map(row => <tr key={row.documentNo}><td>{row.documentNo}<small>{row.status}</small></td><td>{row.current.length ? row.current.map(s => <RevisionSource key={s.id} source={s}/>) : "ยังไม่พบฉบับยืนยันสำหรับ Current Tender"}</td><td>{row.current.map(s => <div key={s.id}><strong>{s.revision || "ไม่ระบุ"}</strong>{s.revisionHistory?.length ? <ul>{s.revisionHistory.map(h => <li key={h.revision}>{h.revision} · {h.issuedDate} · {h.purpose}</li>)}</ul> : <small>ยังไม่ได้ตรวจตารางประวัติ revision</small>}<small>{s.readState}</small></div>)}</td><td>{row.reference.length ? row.reference.map(s => <div key={s.id}><RevisionSource source={s}/><small>{s.effectiveAuthority}</small></div>) : "ยังไม่ได้รับ/ลงทะเบียนฉบับเก่า"}</td></tr>)}</tbody></table></div>
    </details>)}
  </details>;
}
export function SourceFindings({ compact = false, navigationTarget }) {
  const { data } = useBidWorkspace();
  const [system, setSystem] = useState("ALL");
  useEffect(() => { if (navigationTarget?.startsWith("bid.documents.finding.")) setSystem("ALL"); }, [navigationTarget]);
  const intake = data?.sourceIntake;
  if (!intake) return null;
  const findings = intake.findings.filter(f => system === "ALL" || f.systemTokens.includes(system));
  return <Module id={compact ? "bid.risk.source-findings" : "bid.documents.source-findings"} title="หลักฐาน → ข้อกำหนด / ผลกระทบ / ประเด็นรอปิด" showToggle={!compact}>
    <label>ระบบ <select aria-label="Source finding system" value={system} onChange={e => setSystem(e.target.value)}><option value="ALL">ทุกระบบ / งานร่วม</option>{SYSTEMS.map(s => <option key={s.token} value={s.token}>{s.name}</option>)}</select></label>
    <p>การอ่านพบข้อกำหนดไม่ใช่การอนุมัติผลคำนวณ ปริมาณ หรือราคา ประเด็น OPEN/CONFLICT ยังต้องตรวจปิดก่อน Release</p>
    <div className="p55-table-wrap"><table className="p55-table" aria-label="Source findings"><thead><tr><th>ประเด็น / ระบบ</th><th>ข้อค้นพบ</th><th>ผลต่อ Engineering / WBS</th><th>หลักฐาน / Clause</th><th>สถานะ</th></tr></thead><tbody>{findings.map(f => <tr key={f.id} data-component-key={(compact ? "bid.risk.finding." : "bid.documents.finding.") + f.id}><td>{f.category}<small>{f.id} · {f.systemTokens.join(", ") || "COMMON"}</small></td><td>{f.statement}</td><td>{f.impact}</td><td><SourceRefs ids={f.sourceIds} sources={intake.sources}/><small>{f.locator}</small></td><td>{f.state}</td></tr>)}</tbody></table></div>
  </Module>;
}
export function SourceCommunications() {
  const { data, reviewDate } = useBidWorkspace();
  const intake = data?.sourceIntake, model = deriveSourceIntake(intake, reviewDate);
  const emails = model.sources.filter(s => s.provider === "GMAIL").sort((a, b) => a.issuedDate.localeCompare(b.issuedDate) || a.id.localeCompare(b.id));
  return <Module id="bid.communications.source-timeline" title="Gmail / ลำดับการสื่อสารและกำหนดส่ง">
    {!intake ? <p>ยังไม่ได้นำเข้าชุดหลักฐาน เปิด A · Original RFQ Documents → Controlled source inventory เพื่อนำเข้า</p> : <>
      <p>วันที่ต้นทางแยกจากวันที่ forward เข้า Gmail · ไม่มีการอนุมานว่าส่งงานแล้วจากอีเมลคำสั่งหรือใบรับเอกสาร</p>
      <div className="p55-table-wrap"><table className="p55-table" aria-label="Source deadlines"><thead><tr><th>กำหนดส่ง</th><th>วันที่ / เวลา / Timezone</th><th>สถานะรอบ</th><th>หลักฐาน</th></tr></thead><tbody>{model.milestones.map(m => <tr key={m.id}><td>{m.title}<small>{m.note}</small></td><td>{m.dueDate} {m.time}<small>{m.timezone || "Timezone ไม่ระบุในต้นทาง — รอยืนยัน"}</small></td><td>{m.status}{m.elapsed ? " · ผ่านวันที่กำหนด / ตรวจหลักฐานการส่ง" : ""}</td><td><SourceRefs ids={m.sourceIds} sources={model.sources}/></td></tr>)}</tbody></table></div>
      <div className="p55-table-wrap"><table className="p55-table" aria-label="Source communications"><thead><tr><th>วันที่ต้นทาง / Forward</th><th>อีเมล</th><th>เส้นทาง / ข้อค้นพบ</th></tr></thead><tbody>{emails.map(s => <tr key={s.id}><td>{s.issuedDate || "OPEN"}<small>Forward: {s.receivedDate || "OPEN"}</small></td><td><SourceLink source={s}/><small>{s.authority}</small></td><td>{s.note}</td></tr>)}</tbody></table></div>
    </>}
  </Module>;
}
export function ControlledSourceInventory({ navigationTarget }) {
  const { data, busy, change, reviewDate, reload, sourceSync } = useBidWorkspace();
  const [visibleCount,setVisibleCount]=useState(50);
  const [pending, setPending] = useState(null), [error, setError] = useState(""), [query, setQuery] = useState(""), [provider, setProvider] = useState("ALL");
  const intake = data?.sourceIntake;
  useEffect(() => { if (navigationTarget?.startsWith("bid.documents.source.")) { setQuery(""); setProvider("ALL"); setVisibleCount(Math.max(50,(data?.sourceIntake?.sources.findIndex(s=>"bid.documents.source."+s.id===navigationTarget)??0)+1)); } }, [navigationTarget]);
  const model = useMemo(() => deriveSourceIntake(intake, reviewDate), [intake, reviewDate]);
  const rows = model.sources.filter(s => (provider === "ALL" || s.provider === provider) && (s.title + " " + s.documentNo + " " + s.id + " " + s.note).toLowerCase().includes(query.toLowerCase()));
  async function preview(file) {
    setPending(null); setError(""); if (!file) return;
    try { if (file.size > 16 * 1024 * 1024) throw Error("Source intake exceeds 16 MiB"); setPending(validateSourceIntake(JSON.parse(await file.text()), TOKENS)); } catch (e) { setError(e.message); }
  }
  async function apply() {
    const ok = await change(current => applySourceIntake(current, pending, TOKENS), "Import source inventory / " + pending.batchId);
    if (ok) setPending(null);
  }
  return <div className="p55-stack">
    <Module id="bid.documents.controlled-source-inventory" title="Controlled source inventory" showToggle>
      <SourceReadiness0550 onOpenSource={id=>{setQuery("");setProvider("ALL");const index=intake?.sources.findIndex(s=>"bid.documents.source."+s.id===id)??-1;setVisibleCount(Math.max(50,index+1));setTimeout(()=>{const el=[...document.querySelectorAll("[data-component-key]")].find(e=>e.getAttribute("data-component-key")===id);el?.scrollIntoView({block:"center"});},40);}}/>
      <p>ทะเบียน GDrive / Gmail ที่ตรวจอ่านล่าสุด พร้อมเอกสารย้อนหลังและข้อมูลที่ยังอ่านไม่ครบ</p>
      <p>โหลดทะเบียนที่ตรวจแล้วจาก Google Drive for Desktop อัตโนมัติเมื่อเปิดโครงการ · ข้อมูลบันทึกใน workspace และ backup · เอกสารต้นฉบับใหม่ยังต้องผ่านการตรวจและอัปเดตทะเบียน</p>
      <div className="p55-panel" role="status" aria-label="Source intake loaded status"><p>{sourceSync?.message || "ตรวจทะเบียนจาก Google Drive for Desktop เมื่อเปิดโครงการ"}</p><button type="button" disabled={!data || busy} onClick={reload}>ตรวจข้อมูลจาก Drive อีกครั้ง</button><strong>{intake ? "Batch ที่โหลดอยู่: " + intake.batchId : "ยังไม่ได้โหลดทะเบียนเอกสารล่าสุดใน workspace นี้"}</strong><p>{intake ? `${intake.sources.length} แหล่ง · ${intake.packageComparisons?.length || 0} กลุ่มเปรียบเทียบ` : "เปิด Google Drive for Desktop และรอให้โฟลเดอร์โครงการพร้อมใช้งาน โปรแกรมจะโหลดทะเบียนใน 90_SYSTEM_WORKING/DATA"}</p></div>
      <details><summary>นำเข้าไฟล์ด้วยตนเอง / ทางเลือกสำรอง</summary><label>Import source intake <input aria-label="Import source intake" type="file" accept=".json,application/json" disabled={!data || busy} onChange={e => { preview(e.target.files[0]); e.target.value = ""; }}/></label>
      {error && <p role="alert">{error}</p>}
      {pending && <div className="p55-panel" role="region" aria-label="Source import preview"><strong>{pending.batchId} · ตรวจวันที่ {pending.reviewedOn}</strong><p>{pending.sources.length} แหล่ง · {pending.findings.length} ข้อค้นพบ · {pending.milestones.length} กำหนดส่ง</p><p>{pending.coverageNote}</p><p>อัปเดตทะเบียนปัจจุบัน {intake?.sources.length || 0} รายการเป็นชุดนี้ เก็บ revision ก่อนหน้าไว้ ราคา/FX/Working เดิมคงเดิม</p><button type="button" disabled={busy} onClick={apply}>Apply source intake</button><button type="button" disabled={busy} onClick={() => setPending(null)}>Cancel source import</button></div>}</details>
      {intake ? <><p><strong>ตรวจล่าสุด: {intake.reviewedOn}</strong> · {model.sources.length} แหล่ง · อ่านข้อความ {model.readCount} · รออ่าน/ตรวจภาพ {model.unreadCount} · ประเด็น OPEN/CONFLICT {model.openCount}</p><p>{intake.coverageNote}</p><button type="button" onClick={() => downloadBidFile(intake, "PJ2608-0550_Source_Intake_" + intake.reviewedOn + ".json")}>Export source intake</button></> : <p>ยังไม่มีทะเบียนจาก Drive ใน workspace นี้ — รายการ Historical ด้านล่างเป็นข้อมูลเดิม</p>}
      <PackageComparison intake={intake}/>
      <DocumentRevisionRegister intake={intake}/>
      <div className="p55-bid-form"><label>ค้นหาเอกสาร <input aria-label="Search source inventory" value={query} onChange={e => {setQuery(e.target.value);setVisibleCount(50);}}/></label><label>แหล่ง <select aria-label="Source provider" value={provider} onChange={e => {setProvider(e.target.value);setVisibleCount(50);}}><option value="ALL">ทั้งหมด</option><option value="GDRIVE">GDrive</option><option value="GMAIL">Gmail</option></select></label></div>
      <div className="p55-table-wrap"><table className="p55-table" aria-label="Controlled source inventory"><thead><tr><th>Source / เอกสาร</th><th>Revision / วันที่</th><th>Authority / อ่านถึงไหน</th><th>รายละเอียดต้นทาง</th></tr></thead><tbody>{!rows.length && <tr><td colSpan={4}>{!intake ? <><strong>ทะเบียนปัจจุบันว่าง — รอโหลดข้อมูลจาก Drive</strong><p>รายการ Historical ด้านล่างเป็นข้อมูลเดิม ไม่ใช่ผลตรวจเอกสารล่าสุด</p><button type="button" disabled={!data || busy} onClick={reload}>ตรวจข้อมูลจาก Drive อีกครั้ง</button></> : <><strong>{model.sources.length ? "ไม่พบเอกสารตามตัวกรอง" : "ชุดข้อมูลที่โหลดไม่มีรายการเอกสาร"}</strong>{model.sources.length > 0 && <button type="button" onClick={() => { setQuery(""); setProvider("ALL"); }}>ล้างตัวกรอง</button>}</>}</td></tr>}{rows.slice(0,visibleCount).map(s => <tr key={s.id} data-component-key={"bid.documents.source." + s.id}><td><SourceLink source={s}/><small>{s.id} · {s.provider}</small><ComponentCopyId projectId="PJ2608-0550" componentKey={"bid.documents.source." + s.id}/></td><td>{s.revision || "ไม่ระบุ"}<small>{s.issuedDate || "วันที่ออกไม่ยืนยัน"}</small></td><td>{s.effectiveAuthority}<small>{s.readState}</small></td><td>{s.note}{s.replaces.length > 0 && <small>แทนที่: {s.replaces.join(", ")}</small>}{s.content && <SourceText content={s.content}/>}</td></tr>)}</tbody></table></div>
      {rows.length>visibleCount&&<button type="button" onClick={()=>setVisibleCount(n=>n+50)}>แสดงเอกสารเพิ่มอีก 50 รายการ ({Math.min(visibleCount,rows.length)} / {rows.length})</button>}
      <details><summary>Historical source register — ทะเบียนเดิม ไม่ใช่ผลตรวจล่าสุด (read-only)</summary><div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>ID</th><th>Source</th><th>Use / historical state</th></tr></thead><tbody>{SOURCE_REGISTER.map(s => <tr key={s.id}><td>{s.id}</td><td>{s.name}</td><td>{s.use}<small>{s.state}</small></td></tr>)}</tbody></table></div></details>
    </Module>
    <SiWorkPackage0550/>
    <SourceFindings navigationTarget={navigationTarget}/>
  </div>;
}
