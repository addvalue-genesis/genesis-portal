import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectServiceCommercialBasis0553} from "./data/serviceCommercialBasis0553";
const amount=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"TBC";
export function ServiceCommercialBasis0553({workingRow=null,basis=null,customer=false,compact=false}){
 const m=basis||selectServiceCommercialBasis0553(workingRow);
 if(!m)return null;
 if(compact){
  const rates=field=>m.roles.map(r=>amount(r[field])).join(" / ");
  const days=m.travelDays===null?`${m.workDays} working days; ${m.normalHoursPerDay} h/day`:`${m.workDays} working + ${m.travelDays} travel days/person`;
  return <span className="p553-service-cell-note" data-service-basis={m.code}>
   {`Included ${m.code==="B3"?"SAT":"Yard support"}: ${m.crew} persons, ${days}.\nAdditional labour (Senior / Field): USD ${rates("dayUSD")}/person/day.\n`}
   {m.normalHoursPerDay?`Proposed OT (>${m.normalHoursPerDay} h/day): USD ${rates("proposedOtUSDPerHour")}/person/hour.\n`:"Normal onshore hours / OT: TBC.\n"}
   {`Proposed standby (Senior / Field): USD ${rates("proposedStandbyUSDPerDay")}/person/day.\nDraft; rates subject to written agreement. Extra travel/accommodation excluded; no duplicate time charges.`}
  </span>;
 }

 const teamOT=m.roles.every(r=>Number.isFinite(r.proposedOtUSDPerHour))?m.roles.reduce((n,r)=>n+r.proposedOtUSDPerHour,0):null;
 return <details className="p55-panel p553-service-basis" data-cost-owner={m.code}
  open={!workingRow} data-service-basis={m.code} data-component-key={workingRow?m.moduleId:undefined}>
  <summary><strong>{m.label}</strong><small>{m.workDays} วันทำงาน × {m.crew} คน{m.travelDays!==null?" + เดินทาง "+m.travelDays+" วัน/คน":" · ฐาน offshore 12 ชม./วัน"} · DRAFT</small></summary>
  {workingRow&&<ComponentCopyId projectId="PJ2608-0553" componentKey={m.moduleId}/>}
  <p><strong>DRAFT / PROPOSED — subject to written agreement; not included as an additional lump sum.</strong></p>
  <p><strong>{m.location}</strong> · {m.includedText}</p>
  <p>Included allocation: THB {amount(m.includedWorkingSellTHB)} · อยู่ในยอด {m.code} THB {amount(m.ownerTotalWorkingSellTHB)} แล้ว ไม่บวกอีกครั้ง.</p>
  <div className="p553-service-prose">
   <p><strong>Additional working day / OT / Standby — proposed labour rates</strong></p>
   {m.roles.map(r=><p key={r.role}><strong>{r.role}.</strong> Additional working day: USD {amount(r.dayUSD)} per person/day (THB {amount(r.dayTHB)} at the current planning rate). {m.normalHoursPerDay
    ?<>Normal working day: {m.normalHoursPerDay} hours. Proposed OT beyond {m.normalHoursPerDay} hours: USD {amount(r.proposedOtUSDPerHour)} per person/hour (day rate ÷ {m.normalHoursPerDay} × 1.5).</>
    :<>Normal onshore working hours and OT rate: TBC by written agreement.</>} Proposed Standby: USD {amount(r.proposedStandbyUSDPerDay)} per person/day (100% of day rate).</p>)}
   <p><strong>Team of {m.crew} persons.</strong> Additional working day: USD {amount(m.teamDayUSD)}/day (THB {amount(m.teamDayTHB)}). Proposed OT: {Number.isFinite(teamOT)?"USD "+amount(teamOT)+"/hour for the team":"TBC"}. Proposed Standby: USD {amount(m.teamDayUSD)}/day for the team. Labour only; additional travel and accommodation require agreement.</p>
   <p>OT multiplier 1.5× and Standby 100% are proposals only — ยังไม่อนุมัติ.</p>
  </div>
  <ul>{m.controls.map(s=><li key={s}>{s}</li>)}</ul>
  <p className="p55-note"><strong>Release qualification — DRAFT:</strong> {m.qualificationText}</p>
 </details>;
}
