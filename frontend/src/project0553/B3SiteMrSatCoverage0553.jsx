import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB3SiteMrSatCoverage0553} from "./data/b3SiteMrSatCoverage0553";
const fmt=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
export function B3SiteMrSatCoverage0553(){
 const model=selectB3SiteMrSatCoverage0553();
 return <details className="p55-panel" data-component-key={model.moduleId} style={{padding:12,marginTop:12}}>
  <summary><strong>B3 — Seven-Site / Four-MR SAT Test Coverage</strong> <small>19 site-MR functions + 2 integrated/closeout objects; included in 40 working days</small><small><code>{model.moduleId}</code></small></summary>
  <p className="p55-note"><strong>Module ID:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={model.moduleId}/> <strong>40-Day B3 working scope:</strong> Two ADDVALUE offshore specialists × 40 workdays, with {model.rows.length} traceable Test-ID groups; {fmt(model.coveredB3SellTHB)} current B3 Working Sell INCLUDING 30-day VeEX hire. No line below posts a second price. These are test-scope groups, NOT verified counts of installed TAGs or approval of numeric acceptance thresholds.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1100,width:"100%",tableLayout:"fixed"}}>
   <thead><tr><th>Site / MR / Test ID</th><th>WBS / Function</th><th>Measurement / Technical Work</th><th>Needed instruments</th><th>Output evidence</th><th>Gate / Owner</th></tr></thead>
   <tbody>{model.rows.map(r=><tr key={r.id} data-component-key={r.moduleId} style={{verticalAlign:"top",overflowWrap:"anywhere"}}>
    <td><strong>{r.site}</strong><small>{r.mr} · {r.id}</small><small>{r.siteScopeNote}</small></td>
    <td><strong>{r.wbs}</strong><small>{r.system}</small></td><td>{r.requiredFunction}</td>
    <td>{r.testInstruments}</td><td>{r.signoffEvidence}</td><td>{r.gate}<small>{r.costOwner} · No additional posting</small></td>
   </tr>)}</tbody>
  </table></div>
  <h4>Schedule / Quantity Timebox — two-person team days</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Location / Scope</th><th>Rev.K</th><th>Team workdays</th><th>Included Labour Sell</th><th>Planning rationale</th></tr></thead>
   <tbody>{model.budgetarySiteTimeboxes.map(r=><tr key={r.id}><td>{r.site}</td><td>{r.wbs}</td><td>{r.days}</td><td>{fmt(r.workingSellTHB)}</td><td>{r.reason}</td></tr>)}</tbody>
   <tfoot><tr><th>TOTAL</th><th>40-day scenario</th><th>{model.plannedWorkingDays}</th><th>Labour included in B3</th><th>Test groups shown above are not individually billable days</th></tr></tfoot>
  </table></div>
  <p className="p55-note"><strong>Hold points:</strong> {model.technicalHolds.join(" · ")}.</p>
 </details>;
}
