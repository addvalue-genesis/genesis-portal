import React, { useEffect, useMemo, useState } from "react";
import { useBidWorkspace, downloadBidFile } from "./BidWorkspaceContext";
import { SYSTEMS, SOURCE_REGISTER, validateSourceIntake, applySourceIntake, deriveSourceIntake, safeSourceUrl } from "./data";
import { Module } from "./BidControls";
import { ComponentCopyId } from "../common/ui/ComponentCopyId";

const TOKENS = SYSTEMS.map(s => s.token);
export function SourceLink({ source }) {
  const url = safeSourceUrl(source?.url);
  return url ? <a href={url} target="_blank" rel="noopener noreferrer">{source.title}</a> : <span>{source?.title || "OPEN"}</span>;
}
function SourceRefs({ ids, sources }) {
  return ids.map(id => <div key={id}><SourceLink source={sources.find(s => s.id === id)} /></div>);
}
export function SourceFindings({ compact = false, navigationTarget }) {
  const { data } = useBidWorkspace();
  const [system, setSystem] = useState("ALL");
  useEffect(() => { if (navigationTarget?.startsWith("bid.documents.finding.")) setSystem("ALL"); }, [navigationTarget]);
  const intake = data?.sourceIntake;
  if (!intake) return null;
  const findings = intake.findings.filter(f => system === "ALL" || f.systemTokens.includes(system));
  return <Module id={compact ? "bid.risk.source-findings" : "bid.documents.source-findings"} title="หลักฐาน → ข้อกำหนด / ผลกระทบ / ประเด็นรอปิด">
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
  const { data, busy, change, reviewDate } = useBidWorkspace();
  const [pending, setPending] = useState(null), [error, setError] = useState(""), [query, setQuery] = useState(""), [provider, setProvider] = useState("ALL");
  const intake = data?.sourceIntake;
  useEffect(() => { if (navigationTarget?.startsWith("bid.documents.source.")) { setQuery(""); setProvider("ALL"); } }, [navigationTarget]);
  const model = useMemo(() => deriveSourceIntake(intake, reviewDate), [intake, reviewDate]);
  const rows = model.sources.filter(s => (provider === "ALL" || s.provider === provider) && (s.title + " " + s.documentNo + " " + s.id + " " + s.note).toLowerCase().includes(query.toLowerCase()));
  async function preview(file) {
    setPending(null); setError(""); if (!file) return;
    try { if (file.size > 5 * 1024 * 1024) throw Error("Source intake exceeds 5 MiB"); setPending(validateSourceIntake(JSON.parse(await file.text()), TOKENS)); } catch (e) { setError(e.message); }
  }
  async function apply() {
    const ok = await change(current => applySourceIntake(current, pending, TOKENS), "Import source inventory / " + pending.batchId);
    if (ok) setPending(null);
  }
  return <div className="p55-stack">
    <Module id="bid.documents.controlled-source-inventory" title="Controlled source inventory">
      <p>ทะเบียน GDrive / Gmail ที่ตรวจอ่านล่าสุด พร้อมเอกสารย้อนหลังและข้อมูลที่ยังอ่านไม่ครบ</p>
      <p>นำเข้าชุดข้อมูลหลังตรวจอ่านต้นทาง ข้อมูลบันทึกในเบราว์เซอร์นี้และรวมใน workspace backup · ไม่ใช่ live sync กับ GDrive/Gmail</p>
      <label>Import source intake <input aria-label="Import source intake" type="file" accept=".json,application/json" disabled={!data || busy} onChange={e => { preview(e.target.files[0]); e.target.value = ""; }}/></label>
      {error && <p role="alert">{error}</p>}
      {pending && <div className="p55-panel" role="region" aria-label="Source import preview"><strong>{pending.batchId} · ตรวจวันที่ {pending.reviewedOn}</strong><p>{pending.sources.length} แหล่ง · {pending.findings.length} ข้อค้นพบ · {pending.milestones.length} กำหนดส่ง</p><p>{pending.coverageNote}</p><p>อัปเดตทะเบียนปัจจุบัน {intake?.sources.length || 0} รายการเป็นชุดนี้ เก็บ revision ก่อนหน้าไว้ ราคา/FX/Working เดิมคงเดิม</p><button type="button" disabled={busy} onClick={apply}>Apply source intake</button><button type="button" disabled={busy} onClick={() => setPending(null)}>Cancel source import</button></div>}
      {intake ? <><p><strong>ตรวจล่าสุด: {intake.reviewedOn}</strong> · {model.sources.length} แหล่ง · อ่านข้อความ {model.readCount} · รออ่าน/ตรวจภาพ {model.unreadCount} · ประเด็น OPEN/CONFLICT {model.openCount}</p><p>{intake.coverageNote}</p><button type="button" onClick={() => downloadBidFile(intake, "PJ2608-0550_Source_Intake_" + intake.reviewedOn + ".json")}>Export source intake</button></> : <p>ยังไม่ได้นำเข้าทะเบียนล่าสุด — รายการเดิมอยู่ใน Historical source register ด้านล่าง</p>}
      <div className="p55-bid-form"><label>ค้นหาเอกสาร <input aria-label="Search source inventory" value={query} onChange={e => setQuery(e.target.value)}/></label><label>แหล่ง <select aria-label="Source provider" value={provider} onChange={e => setProvider(e.target.value)}><option value="ALL">ทั้งหมด</option><option value="GDRIVE">GDrive</option><option value="GMAIL">Gmail</option></select></label></div>
      <div className="p55-table-wrap"><table className="p55-table" aria-label="Controlled source inventory"><thead><tr><th>Source / เอกสาร</th><th>Revision / วันที่</th><th>Authority / อ่านถึงไหน</th><th>รายละเอียดต้นทาง</th></tr></thead><tbody>{rows.map(s => <tr key={s.id} data-component-key={"bid.documents.source." + s.id}><td><SourceLink source={s}/><small>{s.id} · {s.provider}</small><ComponentCopyId componentKey={"bid.documents.source." + s.id}/></td><td>{s.revision || "ไม่ระบุ"}<small>{s.issuedDate || "วันที่ออกไม่ยืนยัน"}</small></td><td>{s.effectiveAuthority}<small>{s.readState}</small></td><td>{s.note}{s.replaces.length > 0 && <small>แทนที่: {s.replaces.join(", ")}</small>}{s.content && <details><summary>อ่านข้อความต้นทางที่ดึงมา</summary><pre className="p55-source-text">{s.content}</pre></details>}</td></tr>)}</tbody></table></div>
      <details><summary>Historical source register — controlled snapshot (read-only)</summary><div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>ID</th><th>Source</th><th>Use / historical state</th></tr></thead><tbody>{SOURCE_REGISTER.map(s => <tr key={s.id}><td>{s.id}</td><td>{s.name}</td><td>{s.use}<small>{s.state}</small></td></tr>)}</tbody></table></div></details>
    </Module>
    <SourceFindings navigationTarget={navigationTarget}/>
  </div>;
}
