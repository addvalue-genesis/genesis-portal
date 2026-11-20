import React, { useEffect, useMemo, useRef, useState } from "react";
import { DATA_LAYER_META, SERVICE_EQUATIONS, ENGINEERING_LAW_LIBRARY } from "./data";
import { PAGA_EVIDENCE_MAX_BYTES, parsePagaEvidence, buildPagaEvidenceReview } from "./pagaEvidenceModel";

const value = n => n === null ? "OPEN" : n;
function SourceRefs({ refs, sources }) {
  return <ul className="p55-evidence-sources">{refs.map((r,i) => {
    const s = sources.find(s => s.id === r.sourceId);
    return <li key={`${r.sourceId}-${r.pdfPage}-${i}`}><a href={`${s.url.split("#")[0]}#page=${r.pdfPage}`} target="_blank" rel="noopener noreferrer">{s.documentNo} · {s.revision}</a><small>{r.clause} · Document p.{r.documentPage} / PDF p.{r.pdfPage}</small></li>;
  })}</ul>;
}

export function PagaEvidenceReview({ evidence, onEvidenceChange }) {
  const [error, setError] = useState("");
  const [site, setSite] = useState("ALL");
  const [showTags, setShowTags] = useState(false);
  const importSequence = useRef(0);
  useEffect(() => () => { ++importSequence.current; }, []);
  const review = useMemo(() => evidence ? buildPagaEvidenceReview(evidence) : null, [evidence]);
  async function load(event) {
    const file = event.target.files?.[0]; if (!file) return;
    const sequence = ++importSequence.current;
    setError(""); onEvidenceChange(null);
    try {
      if (file.size > PAGA_EVIDENCE_MAX_BYTES) throw new Error("Evidence file exceeds 2 MiB");
      const data = parsePagaEvidence(await file.text(), DATA_LAYER_META.datasetId);
      if (sequence === importSequence.current) { onEvidenceChange(data); setSite("ALL"); setShowTags(false); }
    } catch (e) { if (sequence === importSequence.current) setError(e.message); }
    event.target.value = "";
  }
  return <section className="p55-panel p55-evidence-review" data-module-id="MOD-REQ-COMPLETENESS" data-testid="paga-evidence-review">
    <div className="p55-section-title"><div><div className="p55-eyebrow">TEL-PAGA · SOURCE EVIDENCE REVIEW</div><h2>PAGA — Requirement / TAG / Quantity reconciliation</h2>
      <p>โหลดชุดหลักฐานเพื่อตรวจเอกสารต้นทางและจำนวน โดยไม่แก้ Working Budget, ราคาหรือ Release</p></div></div>
    <div className="p55-filterbar"><label><span>โหลดไฟล์ PAGA Evidence JSON</span><input aria-label="PAGA Evidence JSON" type="file" accept=".json,application/json" onChange={load} /></label>
      {evidence && <button type="button" onClick={() => {++importSequence.current; onEvidenceChange(null); setError("");}}>ล้างชุดหลักฐาน</button>}
    </div>
    {error && <p role="alert" className="p55-callout p55-callout--warning">{error}</p>}
    {!review ? <p>ยังไม่ได้โหลดชุดหลักฐาน · ข้อมูลคงอยู่ระหว่างเปลี่ยนแท็บ แต่ต้องโหลดไฟล์ใหม่เมื่อรีเฟรชหรือออกจากหน้าโครงการ</p> : <>
      <div className="p55-callout p55-callout--warning"><strong>Final Release: HOLD · Financial posting: NONE</strong>
        <p>{review.requirements.length} extracted requirement records · {review.tags.length} source TAG records · {review.reconciliation.filter(r => /CONFLICT/.test(r.status)).length} quantity conflicts</p>
        <p>{evidence.reviewScope}</p><p>Count agreement ไม่ใช่การยืนยันปริมาณติดตั้ง · การมี Requirement ไม่ได้แปลว่าผ่าน Engineering / Cost coverage</p>
        <small>Review date {evidence.reviewDate} · Baseline {evidence.baselineSnapshotId}</small>
        <p>Imported evidence is a review overlay. Fingerprints identify source files; import does not authenticate approval or supersede the frozen snapshot.</p>
        <p>Output trace: TEL-PAGA → Working Part A → Budgetary / Released line A1-05. Requirement-level cost allocation and release coverage remain OPEN.</p>
      </div>
      <h3>MR quantity ↔ Datasheet TAG count</h3>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact" aria-label="PAGA quantity reconciliation">
        <thead><tr><th>Site / Category</th><th>MR source qty</th><th>Unique source TAGs</th><th>Difference</th><th>Review state</th></tr></thead>
        <tbody>{review.reconciliation.map(r => <tr key={r.key} data-quantity-group={r.key}><td>{r.site} / {r.category}</td><td>{value(r.mrQuantity)}</td><td>{value(r.tagCount)}</td><td>{value(r.delta)}</td><td>{r.status}<small>Installed quantity: OPEN</small></td></tr>)}</tbody>
      </table></div>
      <p>TAG identity = Project / Site / TAG · {review.repeatedAcrossSites.length} TAG labels occur across sites and stay separate.</p>
      {review.duplicateKeys.length > 0 && <p role="alert">DUPLICATE_TAG_CONFLICT: {review.duplicateKeys.join(", ")}</p>}
      <details className="p55-group"><summary>MR source rows and evidence</summary><div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Source row</th><th>Quantity</th><th>Evidence</th></tr></thead><tbody>
        {evidence.quantityRows.map(q => <tr key={q.id}><td>{q.id}<small>{q.site} · {q.label}</small></td><td>{value(q.quantity)} {q.unit}</td><td><SourceRefs refs={q.sourceRefs} sources={evidence.sources}/></td></tr>)}
      </tbody></table></div></details>
      <h3>Document conflicts / required decisions — OPEN</h3>
      {evidence.issues.map(f => <details className="p55-group" key={f.id}><summary>{f.id} · {f.title}</summary><p>{f.detail}</p><SourceRefs refs={f.sourceRefs} sources={evidence.sources}/></details>)}
      <details className="p55-group"><summary>Source observations (not approval)</summary>{evidence.observations.map(f => <div key={f.id}><h4>{f.title}</h4><p>{f.detail}</p><SourceRefs refs={f.sourceRefs} sources={evidence.sources}/></div>)}</details>
      <h3>Requirement → Existing equations → Cost-owner review</h3>
      <p>Requirement IDs ด้านล่างเป็นรหัส extraction ในชุดหลักฐาน ใช้ clause/page อ้างอิงเอกสารจริง ไม่ใช่เลข Requirement ที่ลูกค้ากำหนด</p>
      {review.requirements.map(r => <details className="p55-group" key={r.id} data-requirement-id={r.id}>
        <summary>{r.id} · {r.title} · SOURCE_EXTRACTED / ENGINEERING OPEN</summary>
        <p>{r.text}</p><SourceRefs refs={r.sourceRefs} sources={evidence.sources}/>
        <p>Component bindings: {r.componentIds.join(", ")}</p>
        {r.kernelIds.map(id => {const k = ENGINEERING_LAW_LIBRARY.kernels.find(k=>k.id===id);return <div key={id}><strong>{id} · {k.name}</strong><ul>{k.equations.map(e=><li key={e.name}>{e.formula}</li>)}</ul><p>{k.controls.join(" · ")}</p></div>;})}
        {r.equationIds.map(id => {const e=SERVICE_EQUATIONS.find(e=>e.id===id);return <p key={id}><strong>{id} · {e.purpose}</strong><small>{e.equation}</small><small>{e.control}</small></p>;})}
        <p>Scope responsibility in source: {r.scopeResponsibility}</p>
        <p>Service-line review candidates: {r.serviceLineCandidates.join(", ") || "OPEN"} · Unique financial owner: OPEN</p>
        <ul>{r.requiredEvidence.map(e=><li key={e}>{e}</li>)}</ul>
        <p>Calculation inputs/results, vendor SKU matching and final installed quantities remain OPEN. No automatic price allocation.</p>
      </details>)}
      <details className="p55-group" open={showTags} onToggle={e=>setShowTags(e.currentTarget.open)}><summary>Source TAG register</summary>
        {showTags && <><label>Site <select aria-label="PAGA TAG site" value={site} onChange={e=>setSite(e.target.value)}><option value="ALL">APF + ACP</option><option value="APF">APF</option><option value="ACP">ACP</option></select></label>
          <div className="p55-table-wrap"><table className="p55-table p55-table--compact" aria-label="PAGA source TAG register"><thead><tr><th>Site / TAG</th><th>Equipment / Location</th><th>Source</th><th>Quantity state</th></tr></thead><tbody>
            {review.tags.filter(t=>site==="ALL"||t.site===site).map((t,i)=><tr key={`${t.key}-${i}`}><td>{t.site}<small>{t.tag}</small></td><td>{t.equipment}<small>{t.building} / {t.location}</small></td><td><SourceRefs refs={t.sourceRefs} sources={evidence.sources}/></td><td>{t.quantityState}<small>Installed quantity: OPEN</small></td></tr>)}
          </tbody></table></div></>}
      </details>
      <details className="p55-group"><summary>Source revisions / fingerprints</summary>{evidence.sources.map(s=><p key={s.id}><strong>{s.documentNo} {s.revision}</strong><small>{s.documentDate} · {s.status}</small><small style={{overflowWrap:"anywhere"}}>SHA-256 {s.sha256}</small></p>)}</details>
    </>}
  </section>;
}
