import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectRevKAbcOwnershipControl0553} from "./data/revKAbcOwnershipControl0553";
const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
export function RevKAbcOwnershipControl0553({working}){
 const a=selectRevKAbcOwnershipControl0553(working);
 return <details className="p55-panel" data-component-key={a.moduleId} style={{marginBottom:14,padding:12}}>
  <summary><strong>Rev.K CFO Activity-Based Cost Control — B1 / B3 / B9</strong> <small>Cross-reference only; no new Working Sell posting</small></summary>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={a.moduleId}/> <strong>Source chain:</strong> {a.sourceTrace}. Contractual test deliverables are not automatically ADDVALUE attendance. Current priced rows are THB planning SELL references, not verified payroll Direct Cost; old Engineering activities are shown unpriced for owner review.</p>
  <div className="p55-metric-grid">
   <div><strong>B1 + B3 + B9 canonical Base</strong><p>{money(a.currentB1B3B9BaseTHB)}</p><small>B1 {money(a.currentWorkingSellTHB.B1)} · B3 {money(a.currentWorkingSellTHB.B3)} · B9 {money(a.currentWorkingSellTHB.B9)}</small></div>
   <div><strong>B1 NEW Support Working Sell</strong><p>{money(a.b1SupportSellTHB)}</p><small>7 resource roles / 242 office MH + project expenses B1.1–B1.8; no legacy 964-MH Engineering sell</small></div>
   <div><strong>B9 Yard Specialist — Quoted Base (Execution Conditional)</strong><p>{money(a.b9YardConditionalLumpSumTHB)}</p><small>B9 quoted Base 1 LS included ONCE; 7 Yard workdays + 2 travel days · execution on written call-out</small></div>
  </div>
  <p className="p55-note"><strong>B1 Engineering carried from old WBS:</strong> {money(a.b1LegacyEngineeringCarriedTHB)} (NONE — 27 technical activities pending unique owner review) · <strong>B3 40-day crew:</strong> {money(a.b3LaborSellTHB)} · <strong>VeEX 30-day rental:</strong> {money(a.b3ToolSellTHB)} · <strong>B3 MGW FAT witness:</strong> {a.b3FatWitnessDays} provisional days / {money(a.b3FatWitnessSellTHB)} Working SELL (included in B3). <strong>Current Part B Base:</strong> {money(a.partBBaseTHB)} · <strong>Additional Working Sell posted by this control:</strong> {money(a.postedWorkingSellDeltaTHB)} · <strong>Verified Direct Cost:</strong> {money(a.verifiedDirectCostTHB)}. No automatic allocation of the offshore B3 LS to individual Test IDs before actual signed quantity/manpower evidence.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{width:"100%",minWidth:1050,tableLayout:"fixed"}}>
   <thead><tr><th>Cost Object / Owner</th><th>Rev.K / Work</th><th>Where / Requirement</th><th>Qty / Rate</th><th>SELL reference THB</th><th>Posting control</th></tr></thead>
   <tbody>{a.rows.map(x=><tr key={x.id} style={{verticalAlign:"top",overflowWrap:"anywhere"}}>
    <td><strong>{x.owner}</strong><small>{x.id}</small><small>{x.costObject}</small></td>
    <td>{x.wbs}<small>{x.activity}</small></td>
    <td>{x.site}<small>{x.source}</small></td>
    <td>{Number.isFinite(x.quantity)?x.quantity+" "+x.unit:x.unit}<small>Rate: {money(x.workingSellRateTHB)}</small></td>
    <td><strong>{money(x.modeledSellTHB)}</strong><small>Direct Cost: {money(x.directCostTHB)}</small></td>
    <td>{x.posting}</td>
   </tr>)}</tbody>
  </table></div>
  <p className="p55-note"><strong>Technical / CFO hold points:</strong> {a.gates.join(" · ")}. Yard responsibilities require contractual RACI; airport/crew Trip IDs must not overlap with B1/B3, and signed OEM procedures remain technical acceptance basis.</p>
 </details>;
}
