import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB3Fat2Plus5PricingScenario0553} from "./data/b3Fat2Plus5PricingScenario0553";
const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
export function B3Fat2Plus5Pricing0553({workingRow}){
 const s=selectB3Fat2Plus5PricingScenario0553(workingRow);
 if(!s)return null;
 return <section className="p55-panel" data-component-key={s.moduleId} style={{padding:12,marginTop:10}}>
  <h4>B3.1 — Gross 2-day iFAT + 5-day Customer FAT On-site Crew Estimate, BEFORE B3/B8 Training Allocation · Onshore USD 600</h4>
  <p className="p55-note">Module ID: <ComponentCopyId projectId="PJ2608-0553" componentKey={s.moduleId}/> ·
   Source: <ComponentCopyId projectId="PJ2608-0553" componentKey={s.sourceModuleId}/></p>
  <p className="p55-note"><strong>Pricing basis:</strong> 2 MGW/ADDVALUE iFAT days + 5 Customer FAT days =
   7 ON-SITE days × 2 paid ADDVALUE staff = 14 person-days at USD {s.rateUSDPerPersonDay}/person-day
   (FX {s.planningFxTHBPerUSD} planning). <strong>Travel is NOT included in those 7 days:</strong>
   2 additional travel days/person = 4 travel person-days. One trip and 8 assumed hotel nights/person.</p>
  <div className="p55-metric-grid">
   <div><strong>Current B3.1 Working SELL (6 on-site days)</strong><p>{money(s.currentFatSellTHB)}</p><small>Unchanged canonical / already included in current B3</small></div>
   <div><strong>Gross 7-day Shared FAT + Training Package</strong><p>{money(s.proposalFatSellTHB)}</p><small>Scenario only · not posted</small></div>
   <div><strong>Impact to B3.1</strong><p>+{money(s.deltaTHB)}</p><small>1 extra on-site team-day + two extra room-nights</small></div>
   <div><strong>Gross Pre-Allocation B3 Scenario (NOT the current B3/B8 split)</strong><p>{money(s.proposedB3TotalTHB)}</p><small>Current {money(s.currentB3WorkingSellTHB)} remains unchanged pending approval</small></div>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Expense / Source Module</th><th>Revised Qty</th><th>Unit SELL THB</th><th>Current SELL THB</th><th>Proposed SELL THB</th><th>Delta THB</th></tr></thead>
   <tbody>{s.rows.map(x=><tr key={x.expenseId}>
    <td><strong>{x.description}</strong><small>{x.sourceModuleId}</small></td>
    <td>{x.qty} {x.unit}{x.changedQuantity&&<small>{x.note}</small>}</td>
    <td>{money(x.unitRateTHB)}</td>
    <td>{money(x.currentWorkingSellTHB)}</td>
    <td><strong>{money(x.proposedWorkingSellTHB)}</strong></td>
    <td>{x.deltaTHB?("+"+money(x.deltaTHB)):"UNCHANGED"}</td>
   </tr>)}
   <tr><td colSpan={3}><strong>Total B3.1 / MGW China ADDVALUE Witness & Travel</strong></td>
    <td>{money(s.currentFatSellTHB)}</td><td><strong>{money(s.proposalFatSellTHB)}</strong></td>
    <td><strong>+{money(s.deltaTHB)}</strong></td></tr>
   </tbody></table></div>
  <p className="p55-note"><strong>Split ownership control:</strong> The gross seven-day amount below includes TWO B8 trainer person-days. It is NOT the final B3-exclusive allocation. Use the adjacent B3/B8 shared allocation table to prevent double counting; current B3 and customer release remain unchanged.</p>
  <p className="p55-note"><strong>MGW vendor separation:</strong> SERV-2 iFAT USD 5,000 and SERV-4 Customer FAT premises USD 2,500
   are different quoted scopes and already included once in the MGW USD {s.supplierTotalUSD.toLocaleString("en-US")} offer.
   The USD {s.supplierFATIncludedUSD.toLocaleString("en-US")} vendor portion is not another ADDVALUE B3 SELL item.</p>
  <p className="p55-note"><strong>Governance:</strong> Working Direct COST NOT ESTABLISHED · current Working SELL remains
   {money(s.currentB3WorkingSellTHB)} · revised estimate is for management approval only · Customer Release HOLD.
   Hotel nights, attendance and exact FAT calendar remain to be confirmed; no automatic price posting.</p>
 </section>;
}
