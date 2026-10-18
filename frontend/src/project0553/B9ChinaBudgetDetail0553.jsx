import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
const thb=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
export function B9ChinaBudgetDetail0553({budget}){
 if(!budget)return null;
 return <section className="p55-panel" data-component-key="bid.budget.working.bc.b9.revk-china-budget" style={{padding:14,marginTop:12}}>
  <h4>B9 — FAT Base vs Conditional Yard Support (SPE §7.3.4)</h4>
  <div className="p55-metric-grid">
   <div><strong>Base FAT Working SELL — B9</strong><p>{thb(budget.workingSellTHB)}</p><small>ADDVALUE 2 FAT witnesses + one return journey. Provisional duration and travel allowances.</small></div>
   <div><strong>Conditional Yard Call-out</strong><p>{thb(budget.conditionalYardSellTHB)}</p><small>NOT in Base. Only on client instruction / signed ADDVALUE RACI.</small></div>
   <div><strong>Base + Conditional scenario</strong><p>{thb(budget.fullCombinedVisitScenarioTHB)}</p><small>Single China-trip planning scenario; reprice if FAT and Yard visits separate</small></div>
  </div>
  <p className="p55-note"><strong>SPE §7.3.2:</strong> Yard SAT is a required contractual test, but it does not by itself prove ADDVALUE must be on-site. <strong>SPE §7.3.4:</strong> supplier provides support Man-day rates; site attendance depends on specific request and signed responsibility. Physical installation is excluded from VENDOR scope.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget" style={{width:"100%",minWidth:1050,tableLayout:"fixed"}}>
   <colgroup><col style={{width:"13%"}}/><col style={{width:"29%"}}/><col style={{width:"12%"}}/><col style={{width:"13%"}}/><col style={{width:"13%"}}/><col style={{width:"20%"}}/></colgroup>
   <thead><tr><th>Module ID / WBS</th><th>Expense (Cost Owner B9 only)</th><th>Qty / Unit</th><th>Unit Working SELL</th><th>Total THB</th><th>Basis / Conditions / Posting</th></tr></thead>
   <tbody>{budget.rows.map(x=><tr key={x.id} data-component-key={x.moduleId} style={{verticalAlign:"top",overflowWrap:"anywhere"}}>
     <td><strong>{x.id}</strong><small>{x.moduleId}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={x.moduleId}/></td>
     <td><strong>{x.description}</strong><small>{x.status}</small><small>{x.optional?"CONDITIONAL — EXCLUDED FROM B9 BASE":"FAT BASE"}</small></td>
     <td>{x.qty} {x.unit}</td><td>{thb(x.unitRateTHB)}</td><td><strong>{thb(x.workingSellTHB)}</strong><small>{x.optional?"Not included in Base Total":"Included in Base"}</small></td>
     <td>{x.evidence}<small>{x.rateAuthority}</small></td>
    </tr>)}
    <tr><td colSpan={4}><strong>B9 Base FAT — Working SELL</strong></td><td><strong>{thb(budget.workingSellTHB)}</strong></td><td>Only base rows count; conditional Yard rows excluded</td></tr><tr><td colSpan={4}><strong>B9 Conditional Yard Call-out — separate, non-additive</strong></td><td><strong>{thb(budget.conditionalYardSellTHB)}</strong></td><td>Client request / signed RACI required, not in current B9 Base</td></tr>
   </tbody></table></div>
  <p className="p55-note"><strong>Estimating control:</strong> Rev.K establishes 2 ADDVALUE FAT attendees and MGW as OEM FAT executor, but not FAT duration. Two FAT workdays plus two travel team-days are planning assumptions. Rev05 Yard 12 team-days comprise 10 actual/standby Yard days + 2 travel days already costed in FAT visit. Yard 10-day support/12 hotel-night allowance is CONDITIONAL only. Reconfirm MGW FAT venue/date, Zhuhai availability, hotel route, visa/work authorisation, occupational accident cover and insurer endorsements. Travel insurance alone may not cover onsite technical work; both insurance allowances are included but are not proof of coverage. No Direct Cost is asserted.</p>
 </section>;
}
