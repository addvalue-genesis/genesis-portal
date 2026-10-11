import React from "react";
import { COST_INTEGRITY_0553 as audit } from "./data/costIntegrity0553";
const money=n=>Number(n).toLocaleString("en-US",{maximumFractionDigits:2});
export function CostIntegrityReview0553(){
 return <section className="p55-panel" data-component-key="bid.budget.integrity">
  <h3>Cost integrity / 8-step verification — INTERNAL ONLY</h3>
  <p className="p55-note"><strong>NO VERIFIED TOTAL PROJECT COST.</strong> THB {money(audit.knownCiscoSubtotalTHB)} is a Cisco-only MR0001 working scenario, NOT a project or all-system BOM total. No Next G, MGW, remaining equipment, bulk or services are included in that amount.</p>
  <p className="p55-note">Evidence coverage: {audit.mr0001AcceptedPhysicalRows}/{audit.mr0001RequiredSourceRows} MR0001 required source rows have accepted physical SKU/quantities. Registered quotations: {audit.sourceQuoteCount}; unallocated/references: {audit.unallocatedQuoteCount}. A+B+C and customer sell: NOT ESTABLISHED.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Step</th><th>Method / evidence</th><th>State</th><th>Why not verified</th></tr></thead><tbody>
    {audit.steps.map(s=><tr key={s.step}><td>{s.step}</td><td><strong>{s.name}</strong><small>{s.evidence}</small></td><td>{s.state}</td><td>{s.reason}</td></tr>)}
  </tbody></table></div>
  <details><summary><strong>Vendor quote register — classification before cost aggregation</strong></summary>
  <p className="p55-note">Each quote remains in its source currency. Rows are not additive; MGW packaged components may already contain feeder, JB and services.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Vendor / quote</th><th>MR</th><th>Quoted total (original currency)</th><th>Classification</th><th>Source status / action</th></tr></thead><tbody>
    {audit.quotes.map(q=><tr key={q.id}><td>{q.vendor}<small>{q.id}</small></td><td>{q.mr}</td><td>{q.currency} {money(q.amount)}</td><td>{q.allocation}</td><td>{q.status}<small>{q.note}</small></td></tr>)}
  </tbody></table></div></details>
  <p className="p55-note"><strong>Budgetary rule:</strong> An assumption-based range may be published internally only after every step has a documented basis, calculation, uncertainty and risk allowance. A pending confirmation does not mean zero. No customer release permitted.</p>
 </section>;
}
