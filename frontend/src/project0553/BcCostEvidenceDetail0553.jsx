import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";

// Read-only drill-down inside existing 10.2. Numeric value types must never
// imply that historical payroll cost or the WBS SELL is verified direct COST.
const thb=x=>Number.isFinite(x)?"THB "+x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const qty=x=>Number.isFinite(x)?x.toLocaleString("en-US"):"TBC";
const readableKind=Object.freeze({
 QUANTITY_OR_REQUIREMENT_ONLY:"Engineering driver / Qty only",
 WORKING_SELL_DERIVED:"WBS Working SELL calculation — NOT cost",
 HISTORICAL_COST_PROXY_ONLY:"Historical cost proxy — NOT approved",
 HISTORICAL_SELL_CALIBRATION_ONLY:"Historical sell calibration — NOT approved"
});

export function BcCostEvidenceDetail0553({workingRow}){
 if(!workingRow?.costEvidence)return null;
 const e=workingRow.costEvidence;
 return <section className="p55-panel p553-bc-evidence" data-component-key={e.moduleId+".cost-evidence"} style={{padding:"14px",marginTop:12}}>
  <div className="p55-eyebrow">10.2 / EVIDENCE-TO-COST TRACE — WORKING ONLY</div>
  <h3>{e.code} — {workingRow.requirement}</h3>
  <p className="p55-note">Module ID: <ComponentCopyId projectId="PJ2608-0553" componentKey={e.moduleId}/></p>
  <div className="p55-metric-grid">
   <div><strong>Turnkey Direct Cost</strong><p>NOT ESTABLISHED</p><small>อัตราต้นทุนจริงยังไม่ได้อนุมัติ ห้ามนำ Working SELL มาแทน</small></div>
   <div><strong>WBS Working SELL (THB)</strong><p>{thb(e.workingSellTHB)}</p><small>อ้างอิง Rev05 เท่านั้น</small></div>
   <div><strong>MR / RFQ Evidence Links</strong><p>{e.requirementRecords.length}</p><small>Source requirement ≠ technical approval</small></div>
  </div>
  {e.code==="B6"&&e.reconciliation?.historicalRev08TransportSellUSD!==undefined&&<p className="p55-note"><strong>Previously supplied transport price evidence:</strong> USD {e.reconciliation.historicalRev08TransportSellUSD.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4})} · 4-Scope of Supply.xlsx Rev08, B6 Transportation (historical customer SELL). This is not a current freight/broker quotation, is not THB Direct Cost, and must not be added to the current B/C cost subtotal. Reconcile four MR shipment legs and the Bangkok FAT routing before pricing.</p>}
  <p className="p55-note">SOURCE: <a href={e.sourceUrl} target="_blank" rel="noreferrer">{e.sourceSheet} · {e.sourceRevision}</a>. ต้องใช้ Internal Rate Card / Vendor Rate ที่ควบคุมได้ก่อนคำนวณ Direct Cost</p>
  <h4>1. Working Drivers &amp; Calculation Evidence — ต้นทางปริมาณและสมการ</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Activity / Physical Work</th><th>Quantity</th><th>Rate THB</th><th>Evidence Amount THB</th><th>ประเภท / แหล่งข้อมูล</th></tr></thead>
   <tbody>{e.lines.map(line=><tr key={line.id}>
    <td><strong>{line.activity}</strong><small>{line.id}</small></td>
    <td>{qty(line.quantity)} {line.unit}</td>
    <td>{thb(line.rateTHB)}</td>
    <td>{thb(line.amountTHB)}</td>
    <td><strong>{readableKind[line.valueClass]||line.valueClass}</strong><small>{line.status}</small><small>{line.evidence}</small></td>
   </tr>)}</tbody>
  </table></div>
  {e.reconciliation&&<p className="p55-note"><strong>Source Reconciliation:</strong> {Object.entries(e.reconciliation).map(([k,v])=>k+": "+(typeof v==="number"?v.toLocaleString("en-US"):Array.isArray(v)?v.join(" – "):v)).join(" · ")}</p>}
  <h4>2. Input / Cost Gaps — ข้อมูลที่ต้องยืนยันก่อนคิดต้นทุน</h4>
  <ul>{e.requiredInputs.map((g,i)=><li key={i}>{g}</li>)}</ul>
  <details className="p55-panel" style={{padding:12,marginTop:10}}>
   <summary><strong>3. Workflow 01–08 — Source &amp; Engineering Verification Trail</strong> (เปิดดู 8 ขั้นตอน)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Step</th><th>Principle / Source Owner</th><th>Verification State</th><th>Evidence / Remaining Action</th></tr></thead>
    <tbody>{e.stages.map(stage=><tr key={stage.id}><td>{stage.id}</td><td>{stage.name}</td><td>{stage.state}</td><td>{stage.basis}</td></tr>)}</tbody>
   </table></div>
  </details>
  {e.requirementRecords.length>0&&<details className="p55-panel" style={{padding:12,marginTop:10}}>
   <summary><strong>4. RFQ/MR Source Requirement IDs</strong> ({e.requirementRecords.length} linked)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>ID</th><th>Document</th><th>Subject / Requirement</th><th>Source State</th></tr></thead><tbody>
    {e.requirementRecords.map(r=><tr key={r.id}><td>{r.id}</td><td>{r.sourceClass} §{r.section||"N/A"}</td><td><strong>{r.topic}</strong><small>{r.requirement}</small></td><td>{r.state}</td></tr>)}
   </tbody></table></div>
  </details>}
  <p className="p55-note"><strong>NO DOUBLE COUNT:</strong> {e.noDoubleCountRule} · Direct Cost / Risk / Customer Sell จะยังไม่ถูก Post จนกว่า Cost Evidence จะครบและผ่านการอนุมัติ</p>
 </section>;
}
