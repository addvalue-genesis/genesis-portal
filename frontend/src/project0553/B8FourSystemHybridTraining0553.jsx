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
   <div><h4>B8 — OEM Online Base + ADDVALUE Onsite Training</h4>
    <p className="p55-note">{copy(m.moduleId)} · 4 systems / 8 customer trainees / 1 training day +1 reserve day.
     ADDVALUE-led HYBRID Budgetary Working SELL · Manufacturer online specialist time is an UNQUOTED allowance; shared demo setups belong to B3, not verified Direct COST.</p></div>
   <div className="p553-bc-main-actions">
    <button type="button" className="p553-detail-button" onClick={()=>toggleAll(true)}>＋ Expand All</button>
    <button type="button" className="p553-detail-button" onClick={()=>toggleAll(false)}>− Collapse All</button></div>
  </div>
  <div className="p55-metric-grid">
   <div><strong>Selected B8 Working SELL · ONE LS</strong><p>{money(m.selectedWorkingSellTHB)}</p>
    <small>10.2 WS-B8 → 10.3 CP-B8 → 10.5 SOW-B8 · Release HOLD</small></div>
   <div><strong>End Users / Duration</strong><p>{m.trainees} people · {m.baseTrainingDays} teaching + {m.trainingReserveDays} reserve day</p>
    <small>Four disciplines · 8 base contact hours +8 reserve hours</small></div>
   <div><strong>Onsite ADDVALUE Resource</strong><p>1 Senior Telecom Engineer</p>
    <small>1 teaching day +1 reserve day +1 content-preparation day at USD700/MD; NO separate travel-day labour</small></div>
   <div><strong>OEM Technical Support</strong><p>Online · Owner-selected Base</p>
    <small>Four manufacturer discipline support sessions · USD400/session estimated; ADDVALUE owns onsite instruction</small></div>
  </div>
  <p className="p55-note"><strong>ฐานเสนอราคาที่เจ้าของโครงการกำหนด 24-Oct-2026:</strong> OEM สอน Online เป็นหลัก พร้อม ADDVALUE ดูแลภาคปฏิบัติ onsite ที่ SAMTEL Warehouse.
   B8 {money(m.selectedWorkingSellTHB)} รวมใน Base; OEM onsite เป็นทางเลือกภายใน ไม่บวกเข้า Base หรือ C1/C2.</p>
  <p className="p55-note"><strong>Proposal delivery basis:</strong> {m.bidBasisDecision.proposalWording}</p>
  <p className="p55-note"><strong>Working venue:</strong> {m.assumedBudgetaryVenue}.
   Physical classroom, live equipment demonstrations, test access and an ADDVALUE engineer MUST be onsite.
   OEM expert supports remotely under provisional fees. D5 teaching, D6 reserve and the prior content-preparation day are distinct from B3 execution days.
   The two legacy RFI/RACON demo rows now post zero in B8: shared temporary instruments are budgeted in B3 once.</p>
  <p className="p55-note">Training materials cover lesson preparation, OEM manuals, exercises, configuration examples, attendee register and assessment.
   B2 owns controlled document submission. Lunch/two breaks: 10 people × (1 teaching +1 reserve) days × THB550 = THB11,000.
   Client travel/hotel responsibility remains unconfirmed; these are not assumed included or free.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Product</th><th>Base + reserve hours</th><th>Online fee allocation THB</th><th>Specialist source</th></tr></thead>
   <tbody>{m.productCoverage.map(x=><tr key={x.product}><td>{x.mr} · {x.product}</td><td>{x.hours} + {x.reserveHours}</td><td>{money(x.onlineFeeTHB)}</td><td>{x.provider}</td></tr>)}</tbody></table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Day / Timebox</th><th>MR / System</th><th>Audience</th><th>Onsite Delivery</th><th>OEM Instructor</th></tr></thead>
   <tbody>{m.systems.map(x=><tr key={x.mr}>
    <td><strong>Day {x.day} — {x.slot}</strong><small>{x.hours} base hours + {x.reserveHours} reserve hours</small></td>
    <td><strong>{x.mr}</strong> · {x.name}</td>
    <td>8 purchaser/end-user attendees (same cohort)</td>
    <td>ADDVALUE Sr Engineer — demonstration, hands-on, attendance and assessment</td>
    <td>ADDVALUE-led practical / OEM online specialist assistance allowance, awaiting vendor confirmation</td>
   </tr>)}</tbody>
   <tfoot><tr><th colSpan={4}>Four systems / 1 teaching +1 reserve day ×8 attendees</th>
    <th>8 teaching hours +8 reserve hours; reserve included once</th></tr></tfoot>
  </table></div>
  {m.groups.map((g,i)=><details key={g.id} className={"p553-bc-price-doc-group p553-b8-hybrid-group p553-b8-hybrid-group--"+g.key}
    data-component-key={g.id} open={i===0}>
   <summary className="p553-bc-price-leaf-head">
    <span className="p553-bc-price-num">B8.G{i+1}</span>
    <span className="p553-bc-price-leaf-label"><strong>{g.name}</strong>
     <small>{g.rows.length} source activities · {g.key==="travel"?"NO B8 TRAVEL POSTING · Shared B3 FAT":money(g.workingSellTHB)+" · attribution once"}</small>
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
      <td><strong>{r.transferredToB3?"MOVED TO B3 — ZERO IN B8":r.sharedTripReconciliation?"EXCLUDED — historical travel":money(r.workingSellTHB)}</strong>{r.sharedTripReconciliation&&<small>Former separate-trip planning {money(r.separateTripHistoricalReferenceTHB)} · NONPOSTING</small>}</td>
      <td>{r.verifiedSourceRate}<small>{r.sharedTripReconciliation?"Already allocated to B3 FAT trip / excluded from B8":"WS-B8 · one owner, no extra customer row"}</small>
       {r.sharedTripReconciliation&&<small>Deducted ONCE from old B8 standalone estimate; no additional B8 travel charge</small>}</td>
     </tr>)}</tbody>
     <tfoot><tr><th colSpan={7}>B8.G{i+1} selected Working SELL subtotal</th>
      <th>{g.key==="travel"?"EXCLUDED · SHARED B3":money(g.workingSellTHB)}</th><th>No separate customer line</th></tr></tfoot>
    </table></div>
   </div>
  </details>)}
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Source-to-Release & Reconciliation</th><th>THB</th><th>Status</th></tr></thead>
   <tbody><tr><th>B8 source → WS-B8 · ONE LS</th><th>{money(m.selectedWorkingSellTHB)}</th>
    <td>Selected Budgetary Working SELL · OEM support and actual Direct COST unverified</td></tr>
    <tr><td>10.3 CP-B8 / 10.5 SOW-B8 preview</td><td>{money(m.selectedWorkingSellTHB)}</td>
     <td>Same canonical source; Customer Release HOLD</td></tr>
    <tr><td>Old Rev05 B8 training WBS / 44 MH</td><td>{money(m.originalRev05WorkingSellReferenceTHB)}</td>
     <td>SUPERSEDED historical reference only; NO current posting</td></tr>
    <tr><td>Old standalone B8 price before trip sharing</td><td>{money(m.standaloneTripPreviousWorkingSellTHB)}</td>
     <td>Historical planning comparison only · not another invoice row</td></tr>
    <tr><td>B3 FAT shared-trip duplication EXCLUDED from B8</td>
     <td>− {money(m.excludedDuplicateTripWorkingSellTHB)}</td>
     <td>ALREADY DEDUCTED · B3 owns common travel, no additional credit</td></tr>
    <tr><td>B8 onsite Senior: 1 teaching +1 reserve day</td>
     <td>{money(44100)}</td>
     <td>INCLUDED on D5 teaching +D6 reserve; no B3 Senior labour posted on these training days</td></tr></tbody>
  </table></div>
  <p className="p55-note"><strong>Approval gaps:</strong> {m.gates.join(" · ")}.</p>
  <h4>Full OEM onsite alternative — NOT SELECTED / NOT ADDITIVE</h4>
  <p className="p55-note">สมมติผู้เชี่ยวชาญ 6 product มา onsite แทน online: ค่าสอนใช้วงเงินเดิม 50,400 ครั้งเดียว;
   เพิ่มค่าเดินทาง/วันเดินทาง/ที่พัก/รถ/ใบอนุญาต/ประกัน {money(m.onsiteAlternative.extraTHB)}.
   B8 ทางเลือก {money(m.onsiteAlternative.wholeB8IllustrativeTHB)} ไม่รวมในยอดที่เลือก.
   อัตราและจำนวนผู้สอนเป็นสมมติฐานประมาณการ ต้องปรับตามผู้สอนจริงและผู้ที่อยู่ไทย.</p>
  <table className="p55-table p55-table--compact"><thead><tr><th>Expense per specialist</th><th>Qty × THB</th><th>THB/person</th></tr></thead>
   <tbody>{m.onsiteAlternative.extraPerSpecialist.map(x=><tr key={x.activity}><td>{x.activity}</td><td>{x.qty} × {money(x.rateTHB)}</td><td>{money(x.amountTHB)}</td></tr>)}</tbody></table>
  <p className="p55-note">{m.onsiteAlternative.gate} B3/B8 five-/seven-day comparisons are historical only and exclude the current execution allowances.</p>
 </section>;
}
