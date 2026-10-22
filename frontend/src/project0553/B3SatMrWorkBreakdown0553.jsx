import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {ControlledModuleSection0553} from "./ControlledModuleSection0553";
import {selectB3SatMrWorkBreakdown0553} from "./data/b3SatMrWorkBreakdown0553";

const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";

export function B3SatMrWorkBreakdown0553({testRow,timebox,priceProof,leanTimebox=null,defaultOpen=false}){
 const m=selectB3SatMrWorkBreakdown0553(testRow,timebox,priceProof);
 return <ControlledModuleSection0553 moduleKey={m.moduleId}
  title={m.site+" / "+m.mr+" — "+m.testId+" · Engineering Work Breakdown"}
  description={m.taskRows.length+" verification activities · Individual MR price NOT ESTABLISHED · shared Site budget "+money(m.sharedSiteWorkingSellTHB)}
  defaultOpen={defaultOpen}>
  <p className="p55-note">
   <strong>Test Module:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={m.ownerModuleId}/>
   <strong> Detail Module:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={m.moduleId}/>
  </p>
  <p className="p55-note"><strong>Source basis:</strong> {m.activitySource}.
   The items below describe proposed technical verification work, not an approved per-MR ITP, exact installed TAG takeoff, or sourced per-activity man-hours.
  </p>
  {leanTimebox&&<p className="p55-note"><strong>Latest Lean execution: {leanTimebox.days} productive two-person TEAM-days at {leanTimebox.site}</strong>
   {" "}({leanTimebox.plannedPersonDays} productive MD); <strong>retained 40-day pricing source for this shared timebox = {m.siteTeamDays} team-days</strong>.
   The 2 risk team-days are pooled across the project and 2 further management-reserve team-days are nonposting;
   neither is allocated to this MR/Test ID. Do not infer per-MR Test Duration or reprice B3 from this activity view.</p>}
  <h4>1. Retained Shared Site SELL Baseline — ไม่ใช่ราคาหรือจำนวนวันของ MR นี้โดยเฉพาะ</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Cost / Evidence Owner</th><th>Team</th><th>Site team-days</th><th>Site person-days</th><th>Planning SELL rate</th><th>Site Working SELL THB</th><th>MR allocation status</th></tr></thead>
   <tbody><tr><td><strong>{m.siteTimeboxId}</strong><small>{m.priceSourceModuleId}</small></td>
    <td>{m.siteCrew} people together</td><td>{m.siteTeamDays}</td><td>{m.sitePersonDays}</td>
    <td>USD {m.personDayRateUSD} /person-day × FX {m.fxTHBPerUSD}<small>{money(m.personDayRateTHB)} /MD · {money(m.siteTeamDaySellTHB)} /team-day</small></td>
    <td><strong>{money(m.sharedSiteWorkingSellTHB)}</strong><small>ONE shared timebox covers {m.sharedMrTestIds.length} Test IDs: {m.sharedMrTestIds.join(", ")}</small></td>
    <td><strong>INDIVIDUAL MR WORKING SELL: NOT ESTABLISHED</strong><small>No approved split of {m.siteTeamDays} Site days across the MR tests</small></td>
   </tr></tbody>
  </table></div>
  <h4>2. {m.mr} — Specific Activities / Verification Deliverables</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1020,width:"100%",tableLayout:"fixed"}}>
   <thead><tr><th>Activity / Sub-Module ID</th><th>Technical work / Required measurement</th><th>Responsible resource</th><th>Acceptance evidence</th><th>Allocated team hours / MD</th><th>Additional Working SELL</th></tr></thead>
   <tbody>{m.taskRows.map((x,i)=><tr key={x.id} data-component-key={x.moduleId}>
    <td><strong>{i+1}. {x.activity}</strong><ComponentCopyId projectId="PJ2608-0553" componentKey={x.moduleId}/></td>
    <td>{x.verification}</td><td>{x.owner}<small>Assignment/RACI requires approval</small></td><td>{x.deliverable}</td>
    <td><strong>NOT ESTABLISHED</strong><small>Team-hours: {x.estimatedTeamHours??"TBC"} · MD: {x.allocatedManDays??"TBC"}</small></td>
    <td><strong>NOT ALLOCATED</strong><small>No additional posting · Actual direct cost pending</small></td>
   </tr>)}</tbody>
  </table></div>
  <h4>3. Evidence required before individual MR pricing</h4>
  <p className="p55-note">{m.pendingProof.join(" · ")}.</p>
  <p className="p55-note"><strong>Price reconciliation:</strong> Current {m.site} allowance = {m.siteTeamDays} team-days × {m.siteCrew} people × USD {m.personDayRateUSD} × {m.fxTHBPerUSD} = <strong>{money(m.sharedSiteWorkingSellTHB)}</strong>.
   That Site allowance is already included ONCE under <code>bid.budget.working.bc.b3.40-day-abc</code>.
   No independent MR or subtask price is released or added to the B3 Working SELL.
  </p>
 </ControlledModuleSection0553>;
}
