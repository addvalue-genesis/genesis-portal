import React,{useState} from "react";
import {B1_LIFECYCLE_REVIEW_0553,evaluateB1LifecycleReview0553} from "./data/b1LifecycleReview0553";
const money=n=>n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
export function B1LifecycleReview0553(){
 const [months,setMonths]=useState(9);
 const m=evaluateB1LifecycleReview0553({months});
 const cases=B1_LIFECYCLE_REVIEW_0553.durationMonths.map(months=>evaluateB1LifecycleReview0553({months}));
 return <div data-b1-lifecycle-review="NON_POSTING">
  <h4>ทบทวนงบ B1 จนปิดโครงการ — 30-Oct-2026</h4>
  <p className="p55-note"><strong>ประมาณการเพื่อพิจารณา / ยังไม่ได้เลือกราคาใหม่</strong> ครอบคลุม SI Engineering,
   PM, จัดซื้อ, ธุรการ/บัญชี และใบอนุญาตจน Final Acceptance ตามขอบเขตที่ตกลง
   ระยะเวลา 6/9/12 เดือนเป็นสมมติฐาน ไม่ใช่แผนที่ลูกค้ายืนยัน
   Working SELL เดิม THB {money(m.currentSellTHB)} / Official USD {money(m.currentOfficialUSD)} ยังใช้ตามเดิม</p>
  <p className="p55-note">ค่าแรงต่อเนื่องด้านล่าง <strong>แทน</strong> ชั่วโมง milestone เดิม {m.currentSupportHours} ชั่วโมง;
   ไม่บวกซ้ำ B2 มี {m.b2SelectedMH} MH สำหรับเอกสารและตรวจทานแล้ว
   งาน SI ที่เสนอเพิ่มต้องตรวจผู้รับผิดชอบกับ <a href={m.b2SourceUrl} target="_blank" rel="noreferrer">131 work objects ของ B2</a>,
   A/OEM และ B3/B9 รายกิจกรรมก่อนเลือกใช้</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>สมมติฐานระยะเวลา</th><th>PMO + ใบอนุญาตเดิม / USD</th><th>รวม SI 144h ตามอัตราแทน / USD</th><th>เพิ่มจาก B1 เดิม / USD</th></tr></thead>
   <tbody>{cases.map(c=><tr key={c.months}><td>{c.months} เดือน</td><td>{money(c.supportAndExistingScopeOfficialUSD)}</td>
    <td>{money(c.candidateOfficialUSD)}</td><td>{money(c.deltaOfficialUSD)}</td></tr>)}</tbody>
  </table></div>
  <p><label>ดูฐานคำนวณ: <select aria-label="B1 review duration months" value={months} onChange={e=>setMonths(Number(e.target.value))}>
   {B1_LIFECYCLE_REVIEW_0553.durationMonths.map(v=><option key={v} value={v}>{v} เดือน</option>)}</select></label>
   {" "}· {m.weeks} สัปดาห์โดยประมาณ (52/12 สัปดาห์ต่อเดือน)</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>บทบาท</th><th>ชั่วโมง/สัปดาห์ — สมมติฐาน</th><th>ชั่วโมงรวม</th><th>Planning Cost THB</th><th>Candidate SELL THB</th></tr></thead>
   <tbody>{m.support.map(r=><tr key={r.key}><td>{r.role}</td><td>{r.hoursPerWeek}</td><td>{money(r.hours)}</td>
    <td>{money(r.planningCostTHB)}</td><td>{money(r.candidateSellTHB)}</td></tr>)}</tbody>
  </table></div>
  <p className="p55-note">ใช้สมมติฐานเงินเดือนเดิม + employer load 20%, 176h/เดือน และ labour GM 20%.
   ผู้ประสานงานใบอนุญาตเฉพาะทางแยก {m.regulatory.hours}h (แทนเดิม 12h) ไม่เพิ่มซ้ำกับงาน PM/Coordinator.
   ค่าใช้จ่ายสำนักงานตามจำนวนเดือน; รับรองประชุม 1 ครั้ง/ไตรมาส; คงตั๋วบริหาร 2 คน-เที่ยว/ที่พัก 6 ห้อง-คืนรอตรวจแผน</p>
  <details><summary>ค่าใช้จ่ายโครงการและใบอนุญาตที่ใช้ในกรณี {months} เดือน</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Source ID / งาน</th><th>จำนวน</th><th>Planning Cost THB</th><th>Candidate SELL THB</th></tr></thead>
    <tbody>{m.expenses.map(r=><tr key={r.id}><td>{r.id}<small>{r.activity}</small></td><td>{r.qty} {r.unit}</td>
     <td>{money(r.planningCostTHB)}</td><td>{money(r.candidateSellTHB)}</td></tr>)}</tbody>
   </table></div>
  </details>
  <h4>SI Engineering ที่ต้องตรวจงานซ้ำก่อนใช้ — สมมติฐานใหม่ 144 ชั่วโมง</h4>
  <p className="p55-note">เฉพาะงานตัดสินใจ/แก้ interface ของ SI ที่เหลือจริง ไม่รวมการเขียนและตรวจเอกสารที่ B2 นับแล้ว,
   OEM design, FAT/SAT หรือ onsite configuration. ทุกกิจกรรมยังไม่ผ่าน RACI.
   ใช้เงินเดือน PM เดิม THB {money(m.technical.monthlyTHB)}/เดือนเป็น <strong>อัตราแทนเพื่อเปรียบเทียบ</strong>
   ไม่ใช่เงินเดือนวิศวกร SI ที่ยืนยัน และไม่ใช้ชั่วโมง/ราคา WBS 964h เดิม</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>กิจกรรมสมมติฐาน</th><th>จำนวน × ชั่วโมง</th><th>MH</th><th>ตรวจงานซ้ำกับ</th></tr></thead>
   <tbody>{m.engineering.map(r=><tr key={r.id}><td>{r.title}</td><td>{r.qty} × {r.hoursPerUnit}</td><td>{r.hours}</td><td>{r.boundary}</td></tr>)}</tbody>
  </table></div>
  <p className="p55-note"><strong>รวมกรณี {months} เดือนพร้อม SI ที่ยังรอตรวจ:</strong> Planning Cost THB {money(m.candidateCostTHB)};
   Candidate SELL THB {money(m.candidateSellTHB)}; Official comparison USD {money(m.candidateOfficialUSD)}.
   ราคา USD ใช้ FX/การปัดเดิม ไม่ใช่ราคาเสนอที่เลือกแล้วหรือกำไรจริง</p>
  <p className="p55-note"><strong>Instrument Wireless Gateway / Antenna: ยังไม่ตั้งราคาเพิ่มในกรณีนี้.</strong>
   คงแพ็กเกจเมียนมาเดิม Cost THB {money(m.existingMyanmarExternalCostTHB)} รวม reserve THB {money(m.existingMyanmarReservesCostTHB)} เพียงครั้งเดียว.
   ค่า Instrument/การต่ออายุ/ข้อกำหนดใหม่ต้องตรวจขอบเขตและใบเสนอราคา ห้ามบวก USD1600 เดิมอัตโนมัติ</p>
  <details><summary>ข้อมูลที่ต้องปิดก่อนเลือกราคา B1 ใหม่</summary><ul>{m.openGates.map(s=><li key={s}>{s}</li>)}</ul></details>
 </div>;
}
