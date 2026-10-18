import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
const thb=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
export function B9ChinaBudgetDetail0553({budget}){
 if(!budget)return null;
 return <section className="p55-panel" data-component-key="bid.budget.working.bc.b9.revk-china-budget" style={{padding:14,marginTop:12}}>
  <h4>B9 — MGW China FAT + Zhuhai Yard / Onshore Work &amp; Travel Working SELL</h4>
  <div className="p55-metric-grid">
   <div><strong>Working SELL — B9</strong><p>{thb(budget.workingSellTHB)}</p><small>PRE-AWARD budget; not a vendor quotation</small></div>
   <div><strong>China Onshore labor</strong><p>{thb(budget.laborWorkingSellTHB)}</p><small>{budget.qtyDerivedManDays} person-days: {budget.fatDaysEstimate} FAT + {budget.yardTeamDaysWorking} Yard team-days</small></div>
   <div><strong>Travel, Visa &amp; Insurance</strong><p>{thb(budget.travelAndInsuranceWorkingSellTHB)}</p><small>One BKK–China–BKK combined crew trip assumed</small></div>
   <div><strong>Per Diem</strong><p>Not separately charged</p><small>No legacy USD 270/day team allowance added</small></div>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget" style={{width:"100%",minWidth:1050,tableLayout:"fixed"}}>
   <colgroup><col style={{width:"13%"}}/><col style={{width:"29%"}}/><col style={{width:"12%"}}/><col style={{width:"13%"}}/><col style={{width:"13%"}}/><col style={{width:"20%"}}/></colgroup>
   <thead><tr><th>Module ID / WBS</th><th>Expense (Cost Owner B9 only)</th><th>Qty / Unit</th><th>Unit Working SELL</th><th>Total THB</th><th>Basis / Conditions</th></tr></thead>
   <tbody>{budget.rows.map(x=><tr key={x.id} data-component-key={x.moduleId} style={{verticalAlign:"top",overflowWrap:"anywhere"}}>
     <td><strong>{x.id}</strong><small>{x.moduleId}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={x.moduleId}/></td>
     <td><strong>{x.description}</strong><small>{x.status}</small></td>
     <td>{x.qty} {x.unit}</td><td>{thb(x.unitRateTHB)}</td><td><strong>{thb(x.workingSellTHB)}</strong></td>
     <td>{x.evidence}<small>{x.rateAuthority}</small></td>
    </tr>)}
    <tr><td colSpan={4}><strong>TOTAL B9 — Revised Working Sell (no separate Per Diem)</strong></td><td><strong>{thb(budget.workingSellTHB)}</strong></td><td>Cost owner B9 only; not added to B1 or B3</td></tr>
   </tbody></table></div>
  <p className="p55-note"><strong>Estimating control:</strong> Rev.K establishes 2 ADDVALUE FAT attendees and MGW as OEM FAT executor, but not FAT duration. Two FAT days, 12 Yard days, 15 nights/employee and one continuous China trip are working assumptions. Reconfirm MGW FAT venue/date, Zhuhai availability, hotel route, visa/work authorisation, occupational accident cover and insurer endorsements. Travel insurance alone may not cover onsite technical work; both insurance allowances are included but are not proof of coverage. No Direct Cost is asserted.</p>
 </section>;
}
