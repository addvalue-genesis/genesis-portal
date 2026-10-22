import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB3SurveySatExecutionPlan0553} from "./data/b3SurveySatExecutionPlan0553";

const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const ROOT="bid.budget.working.bc.b3.field-execution-plan";
export function B3SurveySatExecutionPlan0553({workingRow,compact=false}){
 const plan=selectB3SurveySatExecutionPlan0553(workingRow);
 const survey=plan.survey,sat=plan.sat,sum=plan.phaseSummary;
 if(!workingRow||workingRow.code!=="B3")return null;
 const title=compact?"B3.2.1 — Site Survey + SAT Execution Plan / 40-Day Price Basis Audit":
  "B3 — ทำงานที่ไหน กี่คน กี่วัน และทำอะไร | Survey + Offshore SAT/SIT";
 return <section className="p55-panel p553-b3-field-plan"
  data-component-key={compact?undefined:ROOT} style={{padding:12,margin:"10px 0"}}>
  <h4>{title}</h4>
  <p className="p55-note"><strong>งานที่ต้องวางแผนจริง:</strong>
   ทีมวิศวกร 2 คน (Senior Telecom Systems Integration Engineer + Senior RF/Telecom Field Specialist)
   ออกปฏิบัติงาน Survey และ SAT เป็นคนละกิจกรรม
   <strong> วันที่ข้างล่างเป็นลำดับงานสมมติ ไม่ใช่วันปฏิทินที่ JUTAL อนุมัติแล้ว</strong>.
   ปัจจัยเรือ, POB, Work Permit, weather และ site readiness ต้องตรวจอีกครั้ง.</p>
  <div className="p55-metric-grid">
   <div><strong>1. Site Survey (เสนอแผนใหม่)</strong><p>{survey.crew} คน × {survey.totalTeamDays} วัน</p>
    <small>7 วันสำรวจ + 2 วันเดินทาง = {survey.personDays} MD · ยังไม่อนุมัติ</small></div>
   <div><strong>2. SAT/SIT (แผน Lean ล่าสุด)</strong><p>{sat.crew} คน × {sat.executionTeamDays} วัน</p>
    <small>28 วันงาน + 2 วัน Risk = {sat.executionPersonDays} MD</small></div>
   <div><strong>3. Management Reserve</strong><p>{sat.managementReserveTeamDays} วัน</p>
    <small>สำรอง 4 MD · ไม่ใช่งานตามแผนและไม่ Post ราคา</small></div>
   <div><strong>4. Retained Working SELL ONLY</strong><p>{sat.selectedBaselineTeamDays} วัน / {sat.selectedBaselinePersonDays} MD</p>
    <small>ฐานราคาเดิม ไม่ใช่จำนวนวันปฏิบัติงานตามแผน</small></div>
  </div>
  <h4>A. Site Survey — 7 แห่ง + Mobilization (กิจกรรมที่แยกจาก SAT)</h4>
  <p className="p55-note"><strong>เหตุผลที่ค่า Survey ยังไม่อยู่ใน B3 Working SELL:</strong>
   Source กำหนด Site Survey 7 แห่ง แต่ไม่มีอนุมัติจำนวนวันเดินทาง / จำนวนผู้ปฏิบัติงาน / ค่าเรือและค่าพักจริง.
   ผมจึงแสดง <strong>งบประมาณค่าบริการแรงงานแบบ Scenario</strong> จากอัตราขายที่ใช้อยู่ใน B3 SAT
   เท่านั้น ไม่ใช่ต้นทุนจ่ายจริงหรือราคาที่บวกเพิ่มแล้ว.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1020}}>
   <thead><tr><th>ลำดับ Survey</th><th>สถานที่</th><th>คน × วันหน้างาน</th><th>ต้องตรวจอะไร</th>
    <th>ส่งมอบอะไร</th><th>สถานะต้นทุน</th></tr></thead>
   <tbody>{survey.rows.map(r=><tr key={r.id}
    data-component-key={compact?undefined:ROOT+".survey."+r.site.toLowerCase()}>
    <td>Survey {r.sequence}</td><td><strong>{r.site}</strong><small>{r.sourceId}</small></td>
    <td><strong>2 คน × {r.plannedOnsiteTeamDays} วัน</strong><small>{r.plannedPersonDays} MD (proposed)</small></td>
    <td>{r.purpose}<small>{r.proposedActivity.join(" · ")}</small></td>
    <td>{r.deliverables}<small>SAT source Test IDs: {r.linkedTestIds.join(", ")}</small></td>
    <td><strong>Actual COST: NOT ESTABLISHED</strong><small>Survey visit/day rate not approved</small></td>
   </tr>)}</tbody>
   <tfoot><tr><th colSpan={2}>Survey 7 sites</th><th>7 team-days / 14 MD</th>
    <th colSpan={3}>+ MOB/DEMOB 2 team-days / 4 MD = 9 team-days / 18 MD (scenario)</th></tr></tfoot>
  </table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Survey Planning Price Build</th><th>Qty</th><th>Labour SELL Rate</th>
    <th>Illustrative Working SELL</th><th>Verified Direct Cost</th><th>Status</th></tr></thead>
   <tbody>
    <tr><td>7 Site Survey / field inspection</td><td>7 team-days × 2 people = 14 MD</td>
     <td>{money(survey.planningRateTHBPerPersonDay)} / MD</td>
     <td>{money(survey.onsiteLabourSellReferenceTHB)}</td><td>NOT ESTABLISHED</td>
     <td>PARAMETRIC · NOT POSTED</td></tr>
    <tr><td>Separate Survey MOB/DEMOB labour</td><td>2 travel team-days × 2 = 4 MD</td>
     <td>{money(survey.planningRateTHBPerPersonDay)} / MD</td>
     <td>{money(survey.travelLabourSellReferenceTHB)}</td><td>NOT ESTABLISHED</td>
     <td>Flight, hotel, POB, vessel & insurance costs excluded</td></tr>
    <tr><th colSpan={3}>Survey labour Working SELL SCENARIO (NOT selected 10.2 price)</th>
     <th>{money(survey.planningLabourSellReferenceTHB)}</th>
     <th>NOT ESTABLISHED</th><th>Release HOLD · no automatic posting</th></tr>
   </tbody>
  </table></div>
  <h4>B. SAT/SIT — 7 Sites + Integrated SIT + Punch (แผน 28 + 2 วัน)</h4>
  <p className="p55-note"><strong>หลักการ:</strong> 2 คนทำงานร่วมกันที่ Site เดียว จึงนับ Team-days เพียงครั้งเดียว.
   MR0001–0004 ภายใน Site เดียวกันใช้เวลาร่วมกัน ไม่ใช่ 5 วันต่อ MR.
   แผน 28 วันรวม SIT/Punch แล้ว ส่วน 2 Risk team-days เป็นกองกลาง ไม่กระจายใส่ Site.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1100}}>
   <thead><tr><th>ลำดับ SAT / WBS</th><th>Site / System</th><th>คน</th><th>วันทำงาน</th>
    <th>Man-days</th><th>ทำงานอะไร</th><th>Working SELL Reference</th></tr></thead>
   <tbody>{sat.rows.map(r=><tr key={r.id}
    data-component-key={compact?undefined:ROOT+".sat."+r.id.toLowerCase()}>
    <td><strong>{r.relativeWorkdayLabel}</strong><small>{r.wbs} · {r.id}</small></td>
    <td><strong>{r.site}</strong><small>{r.systemNames.join(", ")||r.mrs.join(", ")}</small></td>
    <td>{r.crew}</td><td><strong>{r.productiveTeamDays}</strong></td>
    <td>{r.productivePersonDays}</td>
    <td>{r.work}<small>Test IDs: {r.linkedTests.join(", ")}</small></td>
    <td>{money(r.provisionalLabourSellTHB)}<small>28d Scenario ONLY / Direct COST OPEN</small></td>
   </tr>)}</tbody>
   <tfoot>
    <tr><th colSpan={3}>SAT + SIT + Punch</th><th>{sat.productiveTeamDays}</th><th>{sat.productivePersonDays}</th>
     <th>2-person team / 21 Test IDs retained</th>
     <th>{money(sat.productiveTeamDays*sat.planningRateTHBPerTeamDay)} scenario</th></tr>
    <tr><th colSpan={3}>Central Risk reserve (SAT D29–D30 if triggered)</th><th>+ {sat.riskTeamDays}</th>
     <th>+ {sat.riskPersonDays}</th><th>Retest/access/ITP witness only if required</th>
     <th>{money(sat.riskTeamDays*sat.planningRateTHBPerTeamDay)} scenario</th></tr>
    <tr><th colSpan={3}>SAT Planned with Risk</th><th>{sat.executionTeamDays}</th><th>{sat.executionPersonDays}</th>
     <th>Management reserve 2 days EXCLUDED</th>
     <th>{money(sat.scenarioLabourWithRiskTHB)} scenario</th></tr>
   </tfoot>
  </table></div>
  <h4>C. Financial Reconciliation — เลขไหนใช้ทำอะไร</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Workstream</th><th>Scenario / Selected Budget</th><th>Direct Cost Verified?</th><th>Post to Release?</th></tr></thead>
   <tbody>
    <tr><td>New Site Survey (7 + 2 proposed days)</td><td>{money(survey.planningLabourSellReferenceTHB)} scenario only</td>
     <td>NO</td><td>NO — survey effort and travel quotation pending</td></tr>
    <tr><td>Latest lean SAT 28+2 (30 team-days / 60 MD)</td><td>{money(sat.scenarioLabourWithRiskTHB)} scenario labour</td>
     <td>NO</td><td>NO — commercial approval required</td></tr>
    <tr><td>Retained SAT labour 40 team-days / 80 MD (old price basis)</td>
     <td>{money(sat.selectedBaselineLaborSellTHB)} CURRENT SELL</td>
     <td>NO</td><td>Already inside B3 once; NOT the field plan</td></tr>
    <tr><td>MGW purchased FAT + ADDVALUE witness + VeEX rental</td>
     <td>{money((sum.includedExistingFATWitnessTHB??0)+(sum.includedMGWPurchasedFATTHB??0)+sum.includedVeEXWorkingSellTHB)} CURRENT SELL</td>
     <td>NO</td><td>Already in B3 once</td></tr>
    <tr><th>Total current canonical B3 Working SELL</th><th>{money(sum.selectedB3WorkingSellTHB)}</th>
     <th>NO</th><th>Customer Release HOLD</th></tr>
    <tr><th>What-if B3 including Survey + 28+2 SAT, FAT &amp; VeEX</th>
     <th>{money(sum.scenarioB3SATFATPlusSurveySellTHB)}</th><th>NO</th>
     <th>ILLUSTRATIVE ONLY; travel cash expenses, permits, vessel and real COST still OPEN</th></tr>
   </tbody>
  </table></div>
  <p className="p55-note"><strong>Budgeting warning:</strong> ค่า THB/MD ที่แสดงมาจาก existing B3
   <strong> Working SELL Rate</strong> (USD800/person-day × 31.5) ไม่ใช่เงินเดือนหรือต้นทุนจ่ายจริง.
   การคำนวณใหม่ยังไม่ได้ย้ายราคาเข้า 10.2/10.3/10.5.
   Survey และ SAT จะใช้เรือ/เดินทางร่วมกันได้หรือไม่ ต้องยืนยันก่อนหักค่าใช้จ่ายซ้ำ.</p>
  {!compact&&<details className="p55-panel" style={{padding:10,marginTop:12}}>
   <summary><strong>Cost Owner / Approval Gates — รายการที่ต้องยืนยันก่อนใช้จริง</strong></summary>
   {plan.requiredEvidence.map((x,i)=><p className="p55-note" key={i}>{i+1}. {x}</p>)}
   <p className="p55-note">Original Source:
    {" "}<ComponentCopyId projectId="PJ2608-0553" componentKey={plan.surveyModuleId}/>
    {" "}<ComponentCopyId projectId="PJ2608-0553" componentKey={plan.satModuleId}/>
    {" "}<ComponentCopyId projectId="PJ2608-0553" componentKey={plan.legacyPricingModuleId}/></p>
  </details>}
 </section>;
}
