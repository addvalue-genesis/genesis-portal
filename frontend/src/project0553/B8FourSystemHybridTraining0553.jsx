import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB8FourSystemHybridTraining0553} from "./data/b8FourSystemHybridTraining0553";
const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const qty=n=>Number.isFinite(n)?n.toLocaleString("en-US",{maximumFractionDigits:2}):"—";
const copy=id=><ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>;
export function B8FourSystemHybridTraining0553({workingRow}){
 const m=selectB8FourSystemHybridTraining0553(workingRow);
 const holder=React.useRef(null);
 const toggleAll=open=>holder.current?.querySelectorAll("details.p553-b8-hybrid-group").forEach(node=>{node.open=open;});
 return <section ref={holder} className="p55-panel p553-bc-price-trace p553-bc-price-trace--services p553-b8-hybrid"
  data-component-key={m.moduleId} style={{padding:12,marginTop:10}}>
  <div className="p553-bc-price-head">
   <div><h4>B8 — Onsite Practical Training + Remote Manufacturer Instructor</h4>
    <p className="p55-note">{copy(m.moduleId)} · 4 systems / 8 customer trainees / 2 training days.
     Selected HYBRID working estimate; no direct payroll cost or signed OEM quote.</p></div>
   <div className="p553-bc-main-actions">
    <button type="button" className="p553-detail-button" onClick={()=>toggleAll(true)}>＋ Expand All</button>
    <button type="button" className="p553-detail-button" onClick={()=>toggleAll(false)}>− Collapse All</button></div>
  </div>
  <div className="p55-metric-grid">
   <div><strong>Selected B8 Working SELL · ONE LS</strong><p>{money(m.selectedWorkingSellTHB)}</p>
    <small>10.2 WS-B8 → 10.3 CP-B8 → 10.5 SOW-B8 · Release HOLD</small></div>
   <div><strong>End Users / Duration</strong><p>{m.trainees} people · {m.onsiteTrainingDays} days</p>
    <small>Four disciplines · four half-day live sessions (16 contact hours)</small></div>
   <div><strong>Onsite ADDVALUE Resource</strong><p>1 Senior Telecom Engineer</p>
    <small>2 session days + 1 preparation day + 2 reserve travel days at USD700/MD</small></div>
   <div><strong>OEM Teaching</strong><p>Online · Pending Confirmation</p>
    <small>Four remote instructors/sessions · USD400/session parametric allowance, NOT vendor quote</small></div>
  </div>
  <p className="p55-note"><strong>Working venue:</strong> {m.assumedBudgetaryVenue}.
   Physical classroom, live equipment demonstrations, test access and an ADDVALUE engineer MUST be onsite.
   OEM lecturer may deliver theoretical content and Q&amp;A remotely. Factory FAT activities B3 and Yard support B9 are separate cost owners.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Day / Timebox</th><th>MR / System</th><th>Audience</th><th>Onsite Delivery</th><th>OEM Instructor</th></tr></thead>
   <tbody>{m.systems.map(x=><tr key={x.mr}>
    <td><strong>Day {x.day} — {x.slot}</strong><small>{x.hours} hours</small></td>
    <td><strong>{x.mr}</strong> · {x.name}</td>
    <td>8 purchaser/end-user attendees (same cohort)</td>
    <td>ADDVALUE Sr Engineer — demonstration, hands-on, attendance and assessment</td>
    <td>Manufacturer online · awaiting quotation and availability</td>
   </tr>)}</tbody>
   <tfoot><tr><th colSpan={4}>Four systems / total classroom training 2 days × 8 attendees</th>
    <th>16 contact hours · no fourfold multiplication of days</th></tr></tfoot>
  </table></div>
  {m.groups.map((g,i)=><details key={g.id} className={"p553-bc-price-doc-group p553-b8-hybrid-group p553-b8-hybrid-group--"+g.key}
    data-component-key={g.id} open={i===0}>
   <summary className="p553-bc-price-leaf-head">
    <span className="p553-bc-price-num">B8.G{i+1}</span>
    <span className="p553-bc-price-leaf-label"><strong>{g.name}</strong>
     <small>{g.rows.length} source estimate activities · {money(g.workingSellTHB)} · attribution once</small>
     <code>{g.id}</code></span>{copy(g.id)}
   </summary>
   <div className="p553-bc-price-leaf-body">
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1280}}>
     <thead><tr><th>Activity / Module</th><th>Role / Cost Driver</th><th>Qty × Unit</th>
      <th>USD / Unit</th><th>FX</th><th>THB / Unit</th>
      <th>Working COST</th><th>Selected Working SELL THB</th><th>Evidence / Owner / Gate</th></tr></thead>
     <tbody>{g.rows.map(r=><tr key={r.id} data-component-key={r.id}>
      <td><strong>{r.sourceId}</strong><small>{r.id}</small>{copy(r.id)}</td>
      <td>{r.activity}</td><td>{qty(r.qty)} {r.unit}</td>
      <td>{Number.isFinite(r.rateUSDPerUnit)?"USD "+qty(r.rateUSDPerUnit):"—"}</td>
      <td>{Number.isFinite(r.fxTHBPerUSD)?qty(r.fxTHBPerUSD):"—"}</td>
      <td>{money(r.unitRateTHB)}</td><td>NOT ESTABLISHED</td>
      <td><strong>{money(r.workingSellTHB)}</strong></td>
      <td>{r.verifiedSourceRate}<small>WS-B8 · single owner, no extra CP row</small>
       {r.sharedTripReconciliation&&<small>Potential B3/B9 shared-trip credit — NO reduction without approved itinerary</small>}</td>
     </tr>)}</tbody>
     <tfoot><tr><th colSpan={7}>B8.G{i+1} selected Working SELL subtotal</th>
      <th>{money(g.workingSellTHB)}</th><th>No separate customer line</th></tr></tfoot>
    </table></div>
   </div>
  </details>)}
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Source-to-Release & Reconciliation</th><th>THB</th><th>Status</th></tr></thead>
   <tbody><tr><th>B8 source → WS-B8 · ONE LS</th><th>{money(m.selectedWorkingSellTHB)}</th>
    <td>Selected Working SELL, quoted OEM & Direct COST not verified</td></tr>
    <tr><td>10.3 CP-B8 / 10.5 SOW-B8 preview</td><td>{money(m.selectedWorkingSellTHB)}</td>
     <td>Same canonical source; Customer Release HOLD</td></tr>
    <tr><td>Old Rev05 B8 training WBS / 44 MH</td><td>{money(m.originalRev05WorkingSellReferenceTHB)}</td>
     <td>SUPERSEDED historical reference only; NO current posting</td></tr>
    <tr><td>Possible same-trip credit B3/B9 (not selected)</td>
     <td>{money(m.possibleSharedB3B9TripCreditTHB)}</td>
     <td>NONPOSTING: only credit after proven personnel/travel event overlap</td></tr></tbody>
  </table></div>
  <p className="p55-note"><strong>Approval gaps:</strong> {m.gates.join(" · ")}.</p>
  <p className="p55-note"><strong>Full OEM onsite instructor alternative:</strong>
   not priced and not selected; require four discipline quotations, logistics and owner approval.
   B3/B8 seven-day FAT+training comparisons remain historical/nonposting, not the selected B8 plan.</p>
 </section>;
}
