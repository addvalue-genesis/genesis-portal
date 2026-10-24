import React, { useRef } from "react";
import { ControlledModuleSection0553 } from "./ControlledModuleSection0553";
import { COST_INTEGRITY_0553 as audit } from "./data/costIntegrity0553";
const money=n=>Number(n).toLocaleString("en-US",{maximumFractionDigits:2});
export function CostIntegrityReview0553(){
 const container=useRef(null);
 const setAll=open=>container.current?.querySelectorAll("details").forEach(node=>{node.open=open;});
 const mrs=["MR-0001","MR-0002","MR-0003","MR-0004"];
 const states=Object.entries(audit.steps.reduce((counts,step)=>({...counts,[step.state]:(counts[step.state]||0)+1}),{}))
  .map(([state,count])=>`${state}: ${count}`).join(" · ");
 return <div ref={container} className="p553-integrity-review">
  <div className="p553-integrity-controls" role="group" aria-label="Cost integrity disclosure controls">
   <button type="button" onClick={()=>setAll(true)}>+ ขยายทั้งหมด / Expand All</button>
   <button type="button" onClick={()=>setAll(false)}>− หุบทั้งหมด / Collapse All</button>
  </div>
  <ControlledModuleSection0553 moduleKey="bid.budget.integrity"
   title="Project-wide legacy cost audit — INTERNAL ONLY"
   description={`${audit.steps.length} verification steps · ${audit.sourceQuoteCount} quotations · NO VERIFIED TOTAL PROJECT COST`}
   className="p553-integrity-root">
  <p className="p55-note">สีแยกหมวดข้อมูล · สถานะตรวจสอบแสดงเป็นข้อความ · ยอดใบเสนอราคาอาจซ้ำข้าม MR จึงไม่รวมเป็นต้นทุนโครงการ</p>
  <ControlledModuleSection0553 moduleKey="bid.budget.integrity.steps"
   title="1. ภาพรวมโครงการเดิม / Legacy project evidence"
   description={states}
   className="p553-integrity-steps">
  <p className="p55-note"><strong>Current Working TAG Ledger (MR-0001):</strong> {audit.currentWorkingEvidence.siteCount} locations · {audit.currentWorkingEvidence.allocatedWorkingRows}/{audit.currentWorkingEvidence.sourceRows} source TAGs carry working allocations · original USD {money(audit.currentWorkingEvidence.originalUSD)} + THB {money(audit.currentWorkingEvidence.originalTHB)}. No FX or mixed-currency total is invented here. Budgetary allocation is not OEM approval.</p>
  <p className="p55-note">ผลตรวจ A1 ปัจจุบันให้ดูตารางผลตรวจทานภายใน SI ที่ System × Location × MTO. ตารางด้านล่างเป็นสถานะภาพรวมโครงการเดิม ไม่ใช่ผลตรวจ A1 ราย TAG. กระบวนการ 1–8 เป็น internal re-check; การอนุมัติ OEM ราคา และการออกเอกสารแยกจากผลตรวจภายใน.</p>
  <p className="p55-note"><strong>NO VERIFIED TOTAL PROJECT COST.</strong> THB {money(audit.knownCiscoSubtotalTHB)} is the LEGACY Cisco-only MR0001 control scenario, NOT a project or all-system BOM total. No Next G, MGW, remaining equipment, bulk or services are included in that amount.</p>
  {audit.integrityIssues.length>0&&<p role="alert" className="p55-note"><strong>RECONCILIATION EXCEPTION — NOT VERIFIED:</strong> {audit.integrityIssues.join("; ")}. Cisco quote original: {audit.ciscoQuoteAmount==null?"UNKNOWN":"THB "+money(audit.ciscoQuoteAmount)}; working subtotal: THB {money(audit.knownCiscoSubtotalTHB)}; variance: {audit.ciscoVarianceTHB==null?"UNKNOWN":"THB "+money(audit.ciscoVarianceTHB)}. Values must not be promoted to a complete budget.</p>}
  <p className="p55-note">Evidence coverage: {audit.mr0001AcceptedPhysicalRows}/{audit.mr0001RequiredSourceRows} MR0001 required source rows have accepted physical SKU/quantities. Registered quotations: {audit.sourceQuoteCount}; unallocated/references: {audit.unallocatedQuoteCount}. A+B+C and customer sell: NOT ESTABLISHED.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Step</th><th>Method / evidence</th><th>State</th><th>Why not verified</th></tr></thead><tbody>
    {audit.steps.map(s=><tr key={s.step}><td>{s.step}</td><td><strong>{s.name}</strong><small>{s.evidence}</small><small>Workflow {s.workflow||"REVIEW"} · Source: {s.sourceModules.join(", ")||"Source review required"}</small></td><td>{s.state}</td><td>{s.reason}</td></tr>)}
  </tbody></table></div>
  </ControlledModuleSection0553>
  <ControlledModuleSection0553 moduleKey="bid.budget.integrity.mr-coverage"
   title="2. หลักฐานแยกตาม MR / MR-level Quote Coverage"
   description={`${mrs.length} MRs · quotation evidence, NOT summed cost`}
   className="p553-integrity-coverage">
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>MR</th><th>Quote evidence</th><th>Allocated physical BOM</th><th>Location A+B+C</th></tr></thead><tbody>{mrs.map(m=><tr key={m}><td><strong>{m}</strong></td><td>{audit.quotes.filter(q=>q.mr.split("/").includes(m)).map(q=><div key={q.id}>{q.vendor} · {q.currency} {money(q.amount)}<small>{q.allocation} — full quotation, possible overlap</small></div>)}</td><td>NOT VERIFIED</td><td>NOT ESTABLISHED</td></tr>)}</tbody></table></div>
  <p className="p55-note">Multi-MR vendor quotations appear in multiple MR rows for traceability only; never add repeated quote totals. Prices remain in original currencies.</p>
  </ControlledModuleSection0553>
  <ControlledModuleSection0553 moduleKey="bid.budget.integrity.vendor-register"
   title="3. ทะเบียนใบเสนอราคา / Vendor quote register"
   description={`${audit.sourceQuoteCount} quotations · classification before cost aggregation`}
   className="p553-integrity-vendors">
  <p className="p55-note"><strong>Legacy quote-register audit:</strong> Original quote totals are not a current project cost ledger. Current working site allocations may exist for some vendor packages, but an accepted OEM configuration and complete turnkey cost still require independent review. Never add full Next G/MGW quote totals to site allocations: package inclusion, alternatives, scope owners, revision and FX must be checked.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Vendor / quote</th><th>MR</th><th>Quoted total (original currency)</th><th>Classification</th><th>Source status / action</th></tr></thead><tbody>
    {audit.quotes.map(q=><tr key={q.id}><td>{q.vendor}<small>{q.id}</small></td><td>{q.mr}</td><td>{q.currency} {money(q.amount)}</td><td>{q.allocation}</td><td>{q.status}<small>{q.note}</small></td></tr>)}
  </tbody></table></div></ControlledModuleSection0553>
  <p className="p55-note"><strong>Budgetary rule:</strong> An assumption-based range may be published internally only after every step has a documented basis, calculation, uncertainty and risk allowance. A pending confirmation does not mean zero. No customer release permitted.</p>
 </ControlledModuleSection0553></div>;
}

