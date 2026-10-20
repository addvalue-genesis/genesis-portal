import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB3LeanSatScenario0553} from "./data/b3LeanSatScenario0553";

// Internal-only scenario shown alongside the unchanged current B3 40-day basis.
// Never write this proposal into canonical pricing, customer scope or release.
const cash=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";

export function B3LeanSatScenario0553({workingRow=null}){
 const plan=selectB3LeanSatScenario0553(workingRow);
 return <section className="p55-panel" data-component-key={plan.moduleId} style={{padding:14,marginTop:12}}>
  <div className="p55-eyebrow">INTERNAL SCENARIO — NONPOSTING / NOT RELEASED</div>
  <h4>B3 — Lean Offshore SAT/SIT Campaign WBS · 28 + 2 Team-days</h4>
  <p className="p55-note">Module ID: <ComponentCopyId projectId="PJ2608-0553" componentKey={plan.moduleId}/>.
   ใช้ข้อมูล Z1D และ WBS Rev.K K15–K18 เพื่อวางแผนทีม 2 คนทำงานครบ 7 Locations; ไม่ใช่การแก้ Current Working SELL หรือแผนที่ PTTEP/JUTAL อนุมัติแล้ว.</p>
  <div className="p55-metric-grid">
   <div><strong>Base Work</strong><p>28 team-days</p><small>2 people × 28 = 56 person-days / MD</small></div>
   <div><strong>Internal Risk Allowance</strong><p>2 team-days</p><small>4 additional MD · activation requires approval</small></div>
   <div><strong>Management Reserve</strong><p>2 team-days</p><small>Not included in indicative customer LS; nonposting</small></div>
   <div><strong>Historical / Current B3 Basis</strong><p>40 team-days</p><small>80 MD retained unchanged for source and pricing audit</small></div>
  </div>
  <h4>Revised 7-Location WBS — One shared two-person crew</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:890,width:"100%"}}>
   <thead><tr><th>WBS</th><th>Site / Test Scope</th><th>Current Days</th><th>Proposed Team-days</th><th>MD (2 persons)</th><th>Illustrative Labour SELL</th><th>Work / Acceptance Evidence</th></tr></thead>
   <tbody>{plan.rows.map(r=><tr key={r.id}>
    <td><strong>{r.wbs}</strong></td>
    <td><strong>{r.site}</strong><small>{r.mrs.join(" / ")}</small></td>
    <td>{r.originalDays}</td><td><strong>{r.days}</strong></td><td>{r.plannedPersonDays}</td>
    <td><strong>{cash(r.illustrativeLabourSellTHB)}</strong><small>Nonposting price comparison</small></td>
    <td>{r.work}</td>
   </tr>)}</tbody>
   <tfoot><tr><th colSpan={2}>BASE — 7 sites + SIT + Punch</th><th>{plan.oldTeamDays}</th>
    <th>{plan.baseTeamDays}</th><th>{plan.basePersonDays}</th>
    <th>{cash(plan.baseLabourReferenceTHB)}</th><th>Keep all 19 site/MR test groups and two SIT/Punch test IDs</th></tr></tfoot>
  </table></div>
  <h4>Internal LS Comparison — Same canonical selected FAT and VeEX</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:700,width:"100%"}}>
   <thead><tr><th>Internal pricing comparison only</th><th>Basis</th><th>Indicative SELL THB</th></tr></thead>
   <tbody>
    <tr><td>Offshore SAT/SIT Base Labour</td><td>28 team-days × {cash(plan.rateTHBPerTeamDay)}</td><td>{cash(plan.baseLabourReferenceTHB)}</td></tr>
    <tr><td>Internal Risk Allowance</td><td>2 team-days × same 2-person team rate</td><td>{cash(plan.internalRiskReferenceTHB)}</td></tr>
    <tr><td>Temporary VeEX Rental</td><td>Same existing 30 rental-day allowance; possession period to verify</td><td>{cash(plan.rentalReferenceTHB)}</td></tr>
    <tr><td>MGW China FAT Witness</td><td>Current selected B3 source only; separate B3/B8 proposed FAT/Training not added</td><td>{cash(plan.fatReferenceTHB)}</td></tr>
    <tr><th>INDICATIVE B3 · 1 LS · 28+2</th><th>Scenario, not released quotation</th><th>{cash(plan.illustrativeWholeB3THB)}</th></tr>
    <tr><td>Current Canonical B3</td><td>40-day source retained until promotion approval</td><td>{cash(plan.currentWorkingSellTHB)}</td></tr>
    <tr><td>Scenario reduction vs current</td><td>Nonposting comparison, NOT proven Direct Cost saving</td><td>{cash(plan.comparisonSavingTHB)}</td></tr>
   </tbody>
  </table></div>
  <p className="p55-note"><strong>Commercial rule:</strong> Customer submission must present only
   "B3 Inspection, Testing and Certification as per ITP — 1 LS".
   No separate standby, OT, MOB/DEMOB, MR-specific or site-by-site price lines. Direct COST remains NOT ESTABLISHED.
   Two further management-reserve days are not posted or added to LS.</p>
  <details style={{marginTop:12}}><summary><strong>Execution / logistics prerequisites and risk controls</strong></summary>
   <ul>{plan.executionGates.map((x,i)=><li key={i}>{x}</li>)}</ul>
   <ul>{plan.riskConditions.map((x,i)=><li key={"risk-"+i}>{x}</li>)}</ul>
  </details>
  <p className="p55-note"><strong>Pricing/Release Gate:</strong> Original 40-day B3 remains selected in
   bid.budget.working.bc.b3; 10.5 Scope and 10.3 CFO/Customer Release remain untouched.
   Update only after schedule, POB/transfers, actual Direct Cost, FAT/B8 independence and management price approval.</p>
 </section>;
}
