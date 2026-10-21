import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB3B8SevenDayCommercialAllocation0553} from "./data/b3B8SevenDayCommercialAllocation0553";

// Read-only INTERNAL scenario (unapproved); customer SOW codes remain B3/B8.
const money=v=>Number.isFinite(v)?"THB "+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const copy=id=><ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>;
export function B3B8SevenDayAllocation0553({b3,b8,owner="B3"}){
 const m=selectB3B8SevenDayCommercialAllocation0553({b3,b8});
 if(!m)return null;
 const moduleId=m.moduleIds[owner];
 if(!moduleId)throw Error("Unknown integrated FAT/Training owner "+owner);
 return <section className="p55-panel p553-fat7-allocation"
  data-component-key={moduleId} style={{padding:12,marginTop:12}}>
  <div className="p55-eyebrow">INTERNAL SCENARIO ONLY / NOT OFFICIAL CUSTOMER PROPOSAL</div>
  <h4>FAT + Training — Shared 7 On-site Days / Separate B3 and B8 Owners</h4>
  <p className="p55-note">Module ID: {copy(moduleId)}.
   One ADDVALUE 2-person team × 7 on-site days = 14 unique paid person-days.
   Travel 4 person-days is SEPARATE and already included ONCE in B3
   ({money(m.travelLabourExistingIncludedB3THB)}).</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Contract Line / Internal WS</th><th>Internal Cost Activity</th>
    <th>On-site MD</th><th>Current Working SELL</th><th>Scenario SELL</th>
    <th>Variance</th><th>Customer Proposal</th></tr></thead>
   <tbody>{m.identities.map((id,i)=>{
    const fat=i===0,current=fat?m.b3CurrentWorkingSellTHB:m.b8CurrentWorkingSellTHB;
    const proposed=fat?m.b3ProposedWorkingSellTHB:m.b8ProposedWorkingSellTHB;
    return <tr key={id.contractLineId}>
     <td><strong>{id.contractLineId}</strong><small>Contract SOW Code</small>
      <small>{id.internalWorkingSellId} — INTERNAL WORKING SELL</small></td>
     <td><strong>{id.internalCostActivityId}</strong>
      <small>Estimate only, not verified Direct Cost</small></td>
     <td>{fat?m.b3OnsitePersonDays:m.b8OnsitePersonDays}</td>
     <td>{money(current)}</td><td><strong>{money(proposed)}</strong></td>
     <td>{money(proposed-current)}</td>
     <td><strong>{id.customerProposalLineId}</strong>
      <small>RESERVED — NOT ISSUED / Release HOLD</small></td>
    </tr>;
   })}</tbody>
   <tfoot><tr><th colSpan={3}>Seven-day programme: one team, no duplicate hours</th>
    <th>{money(m.currentCombinedWorkingSellTHB)}</th>
    <th>{money(m.proposedCombinedWorkingSellTHB)}</th>
    <th>{money(m.currentToProposedDeltaTHB)}</th>
    <th>NON-POSTING SCENARIO</th></tr></tfoot>
  </table></div>
  <p className="p55-note"><strong>Price bridge:</strong>
   B3 FAT Trip {money(m.b3FatWorkingSellCurrentTHB)}
   → {money(m.proposedB3FatWorkingSellTHB)}:
   additional {m.additionalHotelNights} hotel room-nights = {money(m.additionalHotelSellTHB)};
   B8 2 on-site training person-days = {money(m.proposedB8TrainingWorkingSellTHB)}.
   Travel labour of {m.travelPersonDays} MD = {money(m.travelLabourExistingIncludedB3THB)}
   is already in B3 once, NOT another B8 charge.</p>
  <details className="p55-panel" style={{padding:10,marginTop:12}}>
   <summary><strong>SC-B3-FAT — 7-day integrated work programme / MD allocation</strong></summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Day</th><th>Activity</th><th>B3 FAT MD</th>
     <th>B8 Training MD</th><th>Total Team MD</th><th>Remarks</th></tr></thead>
    <tbody>{m.program.map(x=><tr key={x.day}>
     <td>{x.day}</td><td>{x.stage}</td><td>{x.b3MD}</td><td>{x.b8MD}</td>
     <td><strong>{x.b3MD+x.b8MD}</strong></td><td>{x.notes}</td></tr>)}</tbody>
    <tfoot><tr><th colSpan={2}>7 On-site Days / 2 Persons</th>
     <th>{m.b3OnsitePersonDays}</th><th>{m.b8OnsitePersonDays}</th>
     <th>{m.onsitePersonDays}</th><th>ONE person-day = ONE owner</th></tr></tfoot>
   </table></div>
  </details>
  <details className="p55-panel" style={{padding:10,marginTop:12}}>
   <summary><strong>Approval Gates / Contract Deviations — NOT yet accepted</strong></summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Gate</th><th>Unresolved scope / client acceptance</th></tr></thead>
    <tbody>{m.unapprovedGates.map((x,i)=><tr key={i}>
     <td>OPEN-{String(i+1).padStart(2,"0")}</td><td>{x}</td></tr>)}</tbody>
   </table></div>
  </details>
  <p className="p55-note"><strong>Identity rule:</strong>
   SOW-B3/SOW-B8 = original customer contract categories;
   IC-FAT-001/IC-TRN-001 = internal costing activity (not actual paid cost);
   WS-B3/WS-B8 = internal Working SELL;
   CP-B3/CP-B8 = customer quotation item names, RESERVED and NOT ISSUED.
   MGW VQ-MGW-SERV-2 and VQ-MGW-SERV-4 are separate supplier quote evidence.
   The existing B3/B8 canonical working prices are NOT modified by this scenario.</p>
 </section>;
}
