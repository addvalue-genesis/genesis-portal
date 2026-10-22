import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB3SurveySatExecutionPlan0553} from "./data/b3SurveySatExecutionPlan0553";

const thb=v=>Number.isFinite(v)?"THB "+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const ROOT="bid.budget.working.bc.b3.field-execution-plan";
export function B3SurveySatExecutionPlan0553({workingRow,compact=false}){
 if(!workingRow||workingRow.code!=="B3")return null;
 const p=selectB3SurveySatExecutionPlan0553(workingRow);
 const bf=p.survey,legacy=p.sat,summary=p.phaseSummary;
 return <section className="p55-panel p553-b3-field-plan" style={{padding:12,margin:"10px 0"}}
  data-component-key={compact?undefined:ROOT}>
  <h4>{compact?"B3.2.1 — BF Verification / GF Yard SAT / Offshore Commissioning":
   "B3 — ต้องไปไหน กี่คน กี่วัน? แยก BF / Zhuhai Yard / Offshore"}</h4>
  <p className="p55-note"><strong>ข้อสรุปจาก BOD/SPE:</strong>
   {" "}<a href={p.sources.bod} target="_blank" rel="noreferrer">{p.sources.brownfieldClause}</a>
   {" "}มีผล Survey ของ BF ZPQ, ZWP8, ZWP11 อยู่แล้ว —
   <strong> การเข้าไปสำรวจใหม่ต้องมีเหตุผลและคำสั่งงานเพิ่มเติม</strong>.
   {" "}<a href={p.sources.spe} target="_blank" rel="noreferrer">{p.sources.yardClause}</a>
   {" "}กำหนด SAT ที่ Fabrication Yard;
   {p.sources.offshoreClause} กำหนด Offshore Commissioning หลังติดตั้ง.
   <strong> ADDVALUE จำนวนคน/วันของงาน Yard และ Offshore ยังไม่ได้รับ RACI ยืนยัน</strong>.</p>
  <div className="p55-metric-grid">
   <div><strong>BF Field Verification</strong><p>3 BF Sites</p>
    <small>2 คน × (3 วันหน้างาน + 2 วันเดินทาง) เฉพาะ What-if หากถูกเรียก</small></div>
   <div><strong>GF Fabrication Yard SAT</strong><p>4 GF Platforms</p>
    <small>JUTAL Zhuhai · จำนวนคน/วันของ ADDVALUE ยังไม่มีอนุมัติ</small></div>
   <div><strong>GF Offshore Commissioning</strong><p>4 GF Platforms</p>
    <small>หลังติดตั้ง · ผู้รับผิดชอบและระยะเวลาของ ADDVALUE ยัง OPEN</small></div>
   <div><strong>Current Selected B3 Working SELL</strong><p>{thb(summary.selectedB3WorkingSellTHB)}</p>
    <small>Current Working SELL: SAT 28 team-days + BF Survey 3 onsite +2 travel; 40d is historical audit only</small></div>
  </div>
  <h4>A. BF — Brownfield Field Verification / Re-survey เฉพาะที่จำเป็น</h4>
  <p className="p55-note">ข้อมูลต้นทาง BOD §8 ได้บันทึก Survey ที่เคยทำแล้วสำหรับ 3 BF.
   ต้องตรวจเอกสารเดิมก่อน หากมีเพียงงาน Review แบบ Desk-based ยังไม่สามารถกล่าวว่า ADDVALUE ต้องเดินทางจริง.
   <strong> ไม่มีแผนสำรวจหน้างาน GF เพิ่มอีก 4 แห่ง</strong>; Engineering readiness ของ GF ตรวจจาก AFC/GA/MTO ก่อน.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1010}}>
   <thead><tr><th>Site</th><th>สถานะผล Survey เดิม</th><th>กิจกรรมที่ต้องตรวจ</th><th>ถ้าเรียกลงพื้นที่</th>
    <th>Verified Cost / Approval</th></tr></thead>
   <tbody>{bf.rows.map(x=><tr key={x.id}
     data-component-key={compact?undefined:ROOT+".survey."+x.site.toLowerCase()}>
    <td><strong>{x.site}</strong><small>{x.sourceClause}</small></td>
    <td>ผล Survey เดิมใน BOD §8<small>Revisit Required: NOT ESTABLISHED</small></td>
    <td>{x.recommendedWork}<small>Related Test IDs: {x.linkedTestIds.join(", ")}</small></td>
    <td>2 คน × {x.provisionalTeamDaysIfCalled} วัน / {x.provisionalMDIfCalled} MD
     <small>Assumption ONLY; not allocated/ordered</small></td>
    <td><strong>NOT ESTABLISHED</strong><small>New travel/call-out, RACI, permit, POB open</small></td>
   </tr>)}</tbody>
  </table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>BF Survey Working Budget — Selected (physical revisit conditional)</th><th>ทีม × วัน</th>
    <th>Existing SELL rate reference</th><th>Illustrative SELL</th><th>Actual Cost</th></tr></thead>
   <tbody>
    <tr><td>3 BF Site verifications if explicitly requested</td>
     <td>2 คน × 3 team-days = 6 MD</td><td>{thb(bf.planningRateTHBPerPersonDay)} / MD</td>
     <td>{thb(bf.onsiteLabourSellReferenceTHB)}</td><td>NOT ESTABLISHED</td></tr>
    <tr><td>Assumed separate BF trip MOB/DEMOB, only if needed</td>
     <td>2 คน × 2 team-days = 4 MD</td><td>{thb(bf.planningRateTHBPerPersonDay)} / MD</td>
     <td>{thb(bf.travelLabourSellReferenceTHB)}</td><td>NOT ESTABLISHED</td></tr>
    <tr><th>BF Survey 5-team-day Working SELL allowance (selected)</th>
     <th>5 team-days / 10 MD</th><th>No verified payroll or journey rates</th>
     <th>{thb(bf.conditionalLabourSellReferenceTHB)}</th><th>INCLUDED IN WS-B3 budget allowance · physical visit not authorized</th></tr>
   </tbody>
  </table></div>
  <p className="p55-note"><strong>ยกเลิกการใช้ Survey 7-Site THB453,600 เป็นราคาเสนอเพิ่มเติม</strong>.
   BF Survey 3 วันหน้างาน +2 วันเดินทาง THB252,000 ได้รวมอยู่ใน B3 Working SELL ใหม่แล้ว ไม่ใช่ Verified Direct Cost และยังต้องมีหนังสือสั่งงานก่อนเข้าสำรวจจริง.</p>
  <h4>B. GF — Fabrication Yard SAT ที่ JUTAL Zhuhai</h4>
  <p className="p55-note"><strong>สถานที่:</strong> JUTAL Zhuhai Fabrication Yard, China.
   งานนี้ต่างจาก MGW OEM Factory FAT ใน B3.1; ตาม SPE §7.3.2 ผู้เกี่ยวข้องต้องทำ SAT
   โดยขั้นตอน OEM และลงนามผลทดสอบ. ADDVALUE เข้าร่วมกี่วันกี่คนยังต้องยืนยันก่อนคิดราคา.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1010}}>
   <thead><tr><th>GF Platform</th><th>สถานที่</th><th>ต้องทำงานอะไร</th>
    <th>คน</th><th>วัน / MD</th><th>Source / Owner Gate</th></tr></thead>
   <tbody>{p.yardSat.rows.map(x=><tr key={x.id}
    data-component-key={compact?undefined:ROOT+".yard."+x.site.toLowerCase()}>
    <td><strong>{x.site}</strong></td><td>{x.location}</td><td>{x.activity}
     <small>{x.linkedTestIds.join(", ")}</small></td>
    <td>TO VERIFY</td><td>NOT ESTABLISHED</td>
    <td>{x.sourceClause}<small>ADDVALUE RACI / ITP / manpower / rate HOLD</small></td>
   </tr>)}</tbody></table></div>
  <h4>C. GF — Offshore Commissioning หลังติดตั้ง Platform</h4>
  <p className="p55-note"><strong>สถานที่:</strong> Offshore ZWP20–ZWP23 หลังติดตั้งและ Commissioned.
   ตาม SPE §7.3.3 เป็น Vendor Offshore Commissioning Scope.
   ไม่สามารถสมมติว่าทีม ADDVALUE 2 คนจะออกไป 4 GF ครบทุก Site และทำวันเท่ากับ Yard SAT.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1010}}>
   <thead><tr><th>GF Platform</th><th>สถานที่</th><th>งานที่ต้องตรวจ/ส่งมอบ</th>
    <th>ADDVALUE คน</th><th>วัน / MD</th><th>Gate</th></tr></thead>
   <tbody>{p.offshore.rows.map(x=><tr key={x.id}
    data-component-key={compact?undefined:ROOT+".offshore."+x.site.toLowerCase()}>
    <td><strong>{x.site}</strong></td><td>{x.location}</td><td>{x.activity}
     <small>Linked source test: {x.linkedTestIds.join(", ")}</small></td>
    <td>TO VERIFY</td><td>NOT ESTABLISHED</td>
    <td>{x.sourceClause}<small>Offshore access, POB, vessel, witness & OEM RACI open</small></td>
   </tr>)}</tbody></table></div>
  <h4>D. SAT 28 productive team-days — CURRENT Working Budget + 2 risk days unpriced</h4>
  <p className="p55-note"><strong>ข้อมูลล่าสุดที่เคยวางแผนร่วมกัน:</strong>
   28 productive Team-days × 2 คน = 56 MD; บวก Risk 2 Team-days = 60 MD;
   Management Reserve อีก 2 Team-days ยังไม่ Post.
   <strong> ตัวเลขนี้ยังไม่ได้แยกว่าเป็น BF Verification, Zhuhai Yard SAT หรือ Offshore Commissioning กี่วัน</strong>
   จึงยังไม่ใช่ระยะเวลาปฏิบัติงานฉบับอนุมัติ.</p>
  <details className="p55-panel" style={{padding:10,marginTop:9}}>
   <summary><strong>ดู Site allocation ของ SAT 28 วันตาม Working Budget (งานแต่ละ GF ต้องยืนยัน Yard/Offshore RACI)</strong></summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Original Timebox</th><th>Old Team-days</th><th>2-person MD</th>
     <th>Work</th><th>Current stage allocation</th></tr></thead>
    <tbody>{legacy.rows.map(x=><tr key={x.id}
      data-component-key={compact?undefined:ROOT+".sat."+x.id.toLowerCase()}>
     <td>{x.wbs} / {x.site}</td><td>{x.oldLeanTeamDays}</td><td>{x.oldLeanMD}</td>
     <td>{x.work}</td><td>YARD / OFFSHORE / BF: NOT ESTABLISHED</td></tr>)}</tbody>
    <tfoot><tr><th>Current SAT selected</th><th>28 +2 risk (unpriced)</th><th>56 MD selected +4 risk MD excluded</th>
     <th>2 management reserve days excluded</th><th>No new allocation</th></tr></tfoot>
   </table></div>
  </details>
  <h4>E. Price Reconciliation / การอนุมัติ</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Budget Owner / Stage</th><th>ข้อมูลจำนวนวัน</th><th>ราคา / ตัวเลขอ้างอิง</th><th>อนุมัติหรือไม่</th></tr></thead>
   <tbody>
    <tr><td>BF Survey Working Budget — physical callout conditional</td><td>3 field +2 transit days / 2 persons</td>
     <td>{thb(bf.conditionalLabourSellReferenceTHB)} selected budgetary Working SELL</td><td>Cost unknown / work order open</td></tr>
    <tr><td>GF Zhuhai Fabrication Yard SAT</td><td>ADDVALUE days and people UNKNOWN</td><td>NOT ESTABLISHED</td><td>RACI/ITP pending</td></tr>
    <tr><td>GF Offshore Commissioning</td><td>ADDVALUE days and people UNKNOWN</td><td>NOT ESTABLISHED</td><td>RACI/ITP pending</td></tr>
    <tr><td>Selected SAT 28 productive team-days</td><td>28 team-days / 56 MD (2 risk days not included)</td>
     <td>{thb(28*2*25200)} CURRENT SAT Labour Working SELL</td>
     <td>NOT allocated to phases</td></tr>
    <tr><th>Current B3 Working SELL / SAT 28d + BF Survey 5d</th><th>33 labour team-days / 66MD plus FAT and VeEX</th>
     <th>{thb(summary.selectedB3WorkingSellTHB)}</th><th>Updated Working Budget / Release HOLD</th></tr>
   </tbody></table></div>
  <p className="p55-note"><strong>Cost Owner:</strong> B3 MGW Factory FAT, Yard SAT and offshore commissioning must remain separate activities.
   B9 is conditional Senior Specialist Yard assistance only when the contractual assistance scope applies;
   B2 document-control and B11 permanently delivered O&amp;M tools are not extra SAT day postings.
   No rate/crew/transport was invented for unapproved Yard or Offshore work.</p>
  {!compact&&<details className="p55-panel" style={{padding:10}}>
   <summary><strong>Outstanding evidence before any cost/schedule approval ({p.gates.length})</strong></summary>
   {p.gates.map((x,i)=><p key={i} className="p55-note">{i+1}. {x}</p>)}
   <ComponentCopyId projectId="PJ2608-0553" componentKey={p.satModuleId}/>
   <ComponentCopyId projectId="PJ2608-0553" componentKey={p.legacyPricingModuleId}/>
  </details>}
 </section>;
}
