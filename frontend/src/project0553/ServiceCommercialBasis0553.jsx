import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectServiceCommercialBasis0553} from "./data/serviceCommercialBasis0553";
const amount=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"TBC";
export function ServiceCommercialBasis0553({workingRow=null,basis=null,customer=false}){
 const m=basis||selectServiceCommercialBasis0553(workingRow);
 if(!m)return null;
 const teamOT=m.roles.every(r=>Number.isFinite(r.proposedOtUSDPerHour))?m.roles.reduce((n,r)=>n+r.proposedOtUSDPerHour,0):null;
 return <details className="p55-panel p553-service-basis" data-cost-owner={m.code}
  open={!workingRow} data-service-basis={m.code} data-component-key={workingRow?m.moduleId:undefined}>
  <summary><strong>{m.label}</strong><small>{m.workDays} วันทำงาน × {m.crew} คน{m.travelDays!==null?" + เดินทาง "+m.travelDays+" วัน/คน":" · ฐาน offshore 12 ชม./วัน"} · DRAFT</small></summary>
  {workingRow&&<ComponentCopyId projectId="PJ2608-0553" componentKey={m.moduleId}/>}
  <p><strong>DRAFT / PROPOSED — subject to written agreement; not included as an additional lump sum.</strong></p>
  <p><strong>{m.location}</strong> · {m.includedText}</p>
  <p>Included allocation: THB {amount(m.includedWorkingSellTHB)} · อยู่ในยอด {m.code} THB {amount(m.ownerTotalWorkingSellTHB)} แล้ว ไม่บวกอีกครั้ง.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <colgroup>{[28,20,12,20,20].map((width,i)=><col key={i} style={{width:width+"%"}}/>)}</colgroup>
   <thead><tr><th>Role / คน</th><th>Additional working day · labour USD/คน/วัน</th><th>Normal hours/day</th><th>Proposed OT USD/คน/ชั่วโมง</th><th>Proposed Standby USD/คน/วัน</th></tr></thead>
   <tbody>{m.roles.map(r=><tr key={r.role}><td>{r.role}</td><td>{amount(r.dayUSD)}<small>THB {amount(r.dayTHB)} · current planning rate</small></td>
    <td>{m.normalHoursPerDay??"TBC — onshore"}</td>
    <td>{amount(r.proposedOtUSDPerHour)}<small>{m.normalHoursPerDay?"เสนอ: day rate ÷ 12 × 1.5; ยังไม่อนุมัติ":"เสนอสูตร day rate ÷ ชั่วโมงปกติ × 1.5; รอฐานชั่วโมง"}</small></td>
    <td>{amount(r.proposedStandbyUSDPerDay)}<small>เสนอ 100% day rate; ยังไม่อนุมัติ</small></td></tr>)}</tbody>
   <tfoot><tr><th>ทีม {m.crew} คน · Proposed rates</th><th>USD {amount(m.teamDayUSD)}/วัน</th><th>{m.normalHoursPerDay??"TBC"}</th><th>{Number.isFinite(teamOT)?"USD "+amount(teamOT)+"/ชั่วโมง":"TBC"}</th><th>USD {amount(m.teamDayUSD)}/วัน</th></tr>
    <tr><td colSpan={5}>Day rate THB {amount(m.teamDayTHB)} · แรงงานเท่านั้น ไม่รวมค่าเดินทาง/ที่พักเพิ่มที่ยังไม่ตกลง</td></tr></tfoot>
  </table></div>
  <ul>{m.controls.map(s=><li key={s}>{s}</li>)}</ul>
  <p className="p55-note"><strong>Release qualification — DRAFT:</strong> {m.qualificationText}</p>
 </details>;
}
