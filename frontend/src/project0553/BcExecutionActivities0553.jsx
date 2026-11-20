import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectImportOperationalBudget0553} from "./data/importOperationalBudget0553";
const money=n=>n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
export function BcExecutionActivities0553({row}){
 const m=row.executionActivities;if(!m)return null;
 const plan=["B1","B6"].includes(row.code)?selectImportOperationalBudget0553():null;
 return <section className="p55-panel" data-component-key={m.moduleId} data-cost-owner={row.code} style={{padding:12}}>
  <strong>{row.code} · กิจกรรมและขอบเขต — {m.title}</strong>
  <ComponentCopyId projectId="PJ2608-0553" componentKey={m.moduleId}/>
  <ul>{m.activities.map(a=><li key={a}>{a}</li>)}</ul>
  <p className="p55-note">{m.boundary}</p>
  {plan&&<details><summary>ฐานค่าดำเนินการ / Cost → Working SELL / รายการแทนงบเดิม</summary>
   {plan.stages.filter(s=>s.owner===row.code).map(s=><p key={s.id}><strong>{s.label}: Cost {money(s.costTHB)} / SELL {money(s.workingSellTHB)} บาท</strong><br/>{s.basis}<br/><small>{s.excludes}</small></p>)}
   {row.code==="B1"?<><p>{plan.completion}</p><p>{plan.responsibility}</p><p>ค่าธรรมเนียมราชการเผื่อ 25,000 บาท ไม่บวก uplift; ค่าบริการ/เงินเผื่ออื่นใช้ 10% ตามฐานเดิม ไม่ใช่เงื่อนไขเบิกเพิ่มตามจริง</p><p>แทนค่าเตรียมแฟ้มเดิม Cost 7,200 / SELL 7,920; รายการ conditional เดิม Cost 47,000 ไม่เคยรวมฐาน จึงไม่หักจาก Base ซ้ำ</p></>:
    <p>แทน Import SELL 12,000 ด้วย 33,000; วงเงิน Export เดิม 25,000 จัดสรรใหม่เป็นงานรถ/โหลด/Terminal 10,000 และส่วนบริการเดิม 15,000 ซึ่งแทนด้วย 22,000. เพิ่มสุทธิ SELL {money(plan.b6IncrementalSellTHB)} บาท. การแบ่ง 10,000/15,000 เป็นประมาณการภายในใหม่ ไม่ใช่หลักฐานใบแจ้งหนี้; ความเพียงพอค่ารถ/Terminal ยังต้องตรวจ</p>}
   <p className="p55-note">Owner-selected planning only · ไม่ใช่ใบเสนอราคาหรือค่าธรรมเนียมที่ยืนยันแล้ว · {plan.evidence}</p>
  </details>}
 </section>;
}
