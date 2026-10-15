import React from "react";
import { COST_INTEGRITY_0553 as audit } from "./data/costIntegrity0553";
const money=n=>Number(n).toLocaleString("en-US",{maximumFractionDigits:2});
export function CostIntegrityReview0553(){
 const mrs=["MR-0001","MR-0002","MR-0003","MR-0004"];
 return <section className="p55-panel" data-component-key="bid.budget.integrity">
  <h3>Cost integrity / 8-step verification — INTERNAL ONLY</h3>
  <p className="p55-note"><strong>Current Working TAG Ledger (MR-0001):</strong> {audit.currentWorkingEvidence.siteCount} locations · {audit.currentWorkingEvidence.allocatedWorkingRows}/{audit.currentWorkingEvidence.sourceRows} source TAGs carry working allocations · original USD {money(audit.currentWorkingEvidence.originalUSD)} + THB {money(audit.currentWorkingEvidence.originalTHB)}. No FX or mixed-currency total is invented here. Budgetary allocation is not OEM approval.</p>
  <p className="p55-note">Steps 1–8 below are customer/RFQ-to-release evidence gates; their REVIEW/PARTIAL states do not erase current provisional budget calculations. A blocked release gate does not mean that the working model has no cost evidence.</p>
  <p className="p55-note"><strong>NO VERIFIED TOTAL PROJECT COST.</strong> THB {money(audit.knownCiscoSubtotalTHB)} is the LEGACY Cisco-only MR0001 control scenario, NOT a project or all-system BOM total. No Next G, MGW, remaining equipment, bulk or services are included in that amount.</p>
  {audit.integrityIssues.length>0&&<p role="alert" className="p55-note"><strong>RECONCILIATION EXCEPTION — NOT VERIFIED:</strong> {audit.integrityIssues.join("; ")}. Cisco quote original: {audit.ciscoQuoteAmount==null?"UNKNOWN":"THB "+money(audit.ciscoQuoteAmount)}; working subtotal: THB {money(audit.knownCiscoSubtotalTHB)}; variance: {audit.ciscoVarianceTHB==null?"UNKNOWN":"THB "+money(audit.ciscoVarianceTHB)}. Values must not be promoted to a complete budget.</p>}
  <p className="p55-note">Evidence coverage: {audit.mr0001AcceptedPhysicalRows}/{audit.mr0001RequiredSourceRows} MR0001 required source rows have accepted physical SKU/quantities. Registered quotations: {audit.sourceQuoteCount}; unallocated/references: {audit.unallocatedQuoteCount}. A+B+C and customer sell: NOT ESTABLISHED.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Step</th><th>Method / evidence</th><th>State</th><th>Why not verified</th></tr></thead><tbody>
    {audit.steps.map(s=><tr key={s.step}><td>{s.step}</td><td><strong>{s.name}</strong><small>{s.evidence}</small><small>Workflow {s.workflow||"REVIEW"} · Source: {s.sourceModules.join(", ")||"Source review required"}</small></td><td>{s.state}</td><td>{s.reason}</td></tr>)}
  </tbody></table></div>
  <h4>MR-level Quote Coverage (quotation evidence, NOT summed cost)</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>MR</th><th>Quote evidence</th><th>Allocated physical BOM</th><th>Location A+B+C</th></tr></thead><tbody>{mrs.map(m=><tr key={m}><td><strong>{m}</strong></td><td>{audit.quotes.filter(q=>q.mr.split("/").includes(m)).map(q=><div key={q.id}>{q.vendor} · {q.currency} {money(q.amount)}<small>{q.allocation} — full quotation, possible overlap</small></div>)}</td><td>NOT VERIFIED</td><td>NOT ESTABLISHED</td></tr>)}</tbody></table></div>
  <p className="p55-note">Multi-MR vendor quotations appear in multiple MR rows for traceability only; never add repeated quote totals. Prices remain in original currencies.</p>
  <details open><summary><strong>Vendor quote register — classification before cost aggregation</strong></summary>
  <p className="p55-note"><strong>Legacy quote-register audit:</strong> Original quote totals are not a current project cost ledger. Current working site allocations may exist for some vendor packages, but an accepted OEM configuration and complete turnkey cost still require independent review. Never add full Next G/MGW quote totals to site allocations: package inclusion, alternatives, scope owners, revision and FX must be checked.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Vendor / quote</th><th>MR</th><th>Quoted total (original currency)</th><th>Classification</th><th>Source status / action</th></tr></thead><tbody>
    {audit.quotes.map(q=><tr key={q.id}><td>{q.vendor}<small>{q.id}</small></td><td>{q.mr}</td><td>{q.currency} {money(q.amount)}</td><td>{q.allocation}</td><td>{q.status}<small>{q.note}</small></td></tr>)}
  </tbody></table></div></details>
  <p className="p55-note"><strong>Budgetary rule:</strong> An assumption-based range may be published internally only after every step has a documented basis, calculation, uncertainty and risk allowance. A pending confirmation does not mean zero. No customer release permitted.</p>
 </section>;
}
