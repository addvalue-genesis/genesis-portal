import React, { useRef, useState } from "react";
import { REQUIREMENT_COVERAGE, REQUIREMENT_COMPLETENESS, SERVICE_EQUATIONS, ENGINEERING_LAW_LIBRARY } from "./data";
import { EQUATION_REUSE_CROSSWALK, REUSE_COMPATIBILITY } from "./coverageModel";

const show = value => value || "OPEN — ยังไม่มีข้อมูลยืนยัน";

export function CoverageMatrix() {
  const [selected, setSelected] = useState("TEL-PAGA");
  const detailRef = useRef(null);
  const coverage = REQUIREMENT_COVERAGE;
  const row = coverage.rows.find(r => r.systemToken === selected);
  return <section className="p55-panel" data-module-id={coverage.moduleId} data-testid="coverage-matrix">
    <div className="p55-section-title"><div>
      <div className="p55-eyebrow">{coverage.moduleId} · READ-ONLY</div>
      <h2>19 Systems — Requirement → Release Coverage</h2>
      <p>ตรวจเส้นทางข้อมูลจาก Snapshot เดิม ไม่ใช่การอนุมัติ Requirement, ปริมาณ หรือราคา</p>
    </div></div>
    <div className="p55-callout p55-callout--warning">
      <strong>Final Release: HOLD · Requirement coverage: ยังคำนวณ % ไม่ได้</strong>
      <p>{coverage.summary.systems} systems · {coverage.summary.componentRecords} component records · {coverage.summary.systemsWithOpenRequirementExtraction} systems ยังไม่มี Requirement รายข้อครบชุด · {coverage.summary.systemsRequiringKernelReview} systems ต้องทบทวน Kernel</p>
      <p>{coverage.summary.systemsWithoutLinkedQuoteRecord} systems ยังไม่มีใบเสนอราคาแบบ structured ที่เชื่อมในทะเบียนนี้ — ไม่ได้หมายความว่าไม่มีใบเสนอราคาในโครงการ</p>
      <small>{coverage.sourceRevision}</small>
    </div>
    <div className="p55-table-wrap" style={{marginTop:16}}>
      <table className="p55-table p55-table--compact" aria-label="19-system coverage inventory">
        <thead><tr><th>ระบบ / ต้นทาง</th><th>Engineering / E binding</th><th>BOM / TAG / Owner</th><th>Working → Output</th><th>ช่องว่าง</th></tr></thead>
        <tbody>{coverage.rows.map(r => <tr key={r.systemToken} data-system-token={r.systemToken}>
          <td><button type="button" aria-pressed={selected === r.systemToken} onClick={() => {setSelected(r.systemToken); detailRef.current?.scrollIntoView({block:"start"});}}>{String(r.no).padStart(2,"0")} · {r.systemToken}</button><small>{r.name}</small><small>{r.sourceRef}</small></td>
          <td>{r.kernelIds.join(" / ") || "KERNEL_REVIEW_REQUIRED"}<small>{r.kernelState}</small><small>{r.systemToken === "TEL-PAGA" ? "E01–E18 runtime available; controlled BOM bindings / inputs OPEN" : "E binding: OPEN"}</small></td>
          <td>{r.components.length} component records<small>TAG / unique cost owner: OPEN</small><small>{r.quantityState}</small></td>
          <td>{r.workingSourceRowIds.join(", ") || "OPEN"}<small>→ {show(r.releaseRowId)} · {r.traceState}</small><small>Final: {r.finalReleaseGate}</small></td>
          <td>{r.open}<small>Source audit: {r.requirementAuditState}</small></td>
        </tr>)}</tbody>
      </table>
    </div>

    <div className="p55-filterbar" style={{marginTop:20}}>
      <label><span>ตรวจรายละเอียดระบบ</span><select aria-label="Coverage system" value={selected} onChange={e => setSelected(e.target.value)}>
        {coverage.rows.map(r => <option key={r.systemToken} value={r.systemToken}>{r.systemToken} — {r.name}</option>)}
      </select></label>
    </div>
    <section ref={detailRef} style={{scrollMarginTop:80}} data-testid="coverage-detail" data-system-token={row.systemToken}>
      <h3>{row.systemToken} · {row.systemToken === "TEL-PAGA" ? "PAGA Pilot" : "Coverage inventory"}</h3>
      <p>Scope owner ตามต้นทาง: {row.scopeOwner} · Cost owner ราย Requirement: OPEN</p>
      <p>Quote record: {row.quoteSourceIds.join(", ") || "OPEN"} · Authority: {row.pricingAuthority}</p>
      <p className="p55-note">มี Component / Quote ไม่เท่ากับมี Requirement ที่ยืนยันแล้ว ข้อมูล Qty, TAG, SKU และ Cost Owner รายข้อยังไม่ถูกผูก จึงไม่มีการคำนวณเพิ่มหรือจัดสรรงบ</p>
      <details className="p55-group" open><summary>Source → Working → Frozen / Release — เส้นทางใน Snapshot</summary>
        <dl className="p55-detail-grid">
          <div><dt>System source</dt><dd>{row.systemPointer}</dd></div>
          <div><dt>Working · MOD-BUDGET-WORKING</dt><dd>{show(row.workingPointer)}</dd></div>
          <div><dt>Frozen mapping · MOD-BUDGET-FROZEN</dt><dd>{show(row.tracePointer)} → {show(row.issuedPointer)}</dd></div>
          <div><dt>Release view · MOD-RELEASED-SELL</dt><dd>{show(row.releasePointer)} · {row.releaseState}</dd></div>
        </dl>
        <p>Mapping: {row.traceState} · รายการที่รวมหลายระบบยังไม่ใช่ Cost Owner แยกรายข้อ · Original RFQ native-sheet roundtrip: NOT_IMPLEMENTED · New Working ↔ Release rows: available in Bidding</p>
      </details>
      {row.unmappedReviewIds.length > 0 && <p role="alert">OPEN — ไม่พบ component ต้นทาง: {row.unmappedReviewIds.join(", ")}</p>}
      <div className="p55-table-wrap" style={{marginTop:16}}>
        <table className="p55-table p55-table--compact" aria-label="Component coverage review">
          <thead><tr><th>Component / Source</th><th>Engineering / Service equation candidates</th><th>หลักฐานที่ต้องปิด</th><th>สถานะ</th></tr></thead>
          <tbody>{row.components.map(c => <tr key={c.coverageId} data-source-row-id={c.sourceRowId}>
            <td><strong>{c.title}</strong><small>{c.sourceRowId}</small><small>{show(c.sourceRef)}</small><small>{c.sourceState}</small>
              <details><summary>Source pointer</summary><p>{c.sourcePointer}</p><p>Requirement ID: {show(c.requirementId)}</p></details>
            </td>
            <td>{c.engineeringKernel.join(" / ") || "Kernel applicability: OPEN"}<small>{c.bindingState}</small>
              {c.engineeringKernel.length > 0 && <details><summary>Engineering equations / controls</summary>
                {c.engineeringKernel.map(id => {const kernel = ENGINEERING_LAW_LIBRARY.kernels.find(k => k.id === id); return <div key={id}>
                  <strong>{id} · {kernel.name}</strong>
                  {kernel.equations.map(e => <p key={e.name}>{e.name}<small>{e.formula}</small></p>)}
                  <p>{kernel.controls.join(" · ")}</p>
                  <small>Inputs / calculation record: OPEN — ยังไม่ใช่ผลคำนวณที่รับรอง</small>
                </div>;})}
              </details>}
              <details><summary>Service owners / E formulas ({c.equationIds.length})</summary>
                <p>ขอบเขตที่ต้องตรวจการรวมราคา/ซ้ำซ้อน ยังไม่ใช่ Cost Owner ที่อนุมัติ</p>
                {c.serviceLines.map(s => <p key={s.code}><strong>{s.code}</strong> · {s.equationIds.join(", ")}<small>{s.sourceModel}</small></p>)}
                {c.equationIds.map(id => {const e = SERVICE_EQUATIONS.find(e => e.id === id); return <p key={id}><strong>{id} · {e.purpose}</strong><small>{e.equation}</small><small>{e.control}</small></p>;})}
              </details>
            </td>
            <td>{c.deliverable}<small>Qty / installed TAG / cost owner: OPEN</small></td>
            <td>{c.status}<small>Output {show(c.releaseRowId)} — system mapping only</small></td>
          </tr>)}</tbody>
        </table>
      </div>
      <details className="p55-group" style={{marginTop:16}}><summary>Cross-system obligations — ต้องผูกกับระบบนี้ต่อ</summary>
        <ul className="p55-rule-list">{(REQUIREMENT_COMPLETENESS.crossSystemObligations || []).map(o => <li key={o.id}><strong>{o.id} · {o.title}</strong><p>{o.source} · {o.mappingState}</p></li>)}</ul>
      </details>
    </section>
    <details className="p55-group" style={{marginTop:16}}><summary>GEQ / PEQ / GMR / GKR / GPE — Reuse compatibility</summary>
      <table className="p55-table p55-table--compact"><thead><tr><th>Family</th><th>Status</th><th>ผลตรวจ / งานต่อ</th></tr></thead>
        <tbody>{REUSE_COMPATIBILITY.map(r => <tr key={r.family}><td>{r.family}</td><td>{r.status}</td><td>{r.decision}</td></tr>)}</tbody></table>
      <p>Crosswalk ตาม PR #45: เป็น method reference ยังไม่ใช่ runtime equivalence หรือ parameter approval</p>
      <table className="p55-table p55-table--compact"><thead><tr><th>0550 equation</th><th>GEQ reference</th><th>Control</th></tr></thead>
        <tbody>{EQUATION_REUSE_CROSSWALK.map(e => <tr key={e.equationId}><td>{e.equationId} · {e.status}</td><td>{e.geqReferences.join(", ") || "No dedicated GEQ verified; retain E17"}</td><td>{e.control}</td></tr>)}</tbody></table>
    </details>
  </section>;
}
