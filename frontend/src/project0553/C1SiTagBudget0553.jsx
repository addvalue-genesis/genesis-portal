import React,{useMemo} from "react";
import {selectC1SiTagBudget0553} from "./data/c1SiTagBudget0553";
const money=n=>n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
export function C1SiTagBudget0553(){
 const model=useMemo(()=>selectC1SiTagBudget0553(),[]);
 return <section className="p55-panel p553-c1c2-engineering-review" data-c1-si-tag-budget="CALCULATED" style={{padding:12,marginTop:12}}>
  <h4>C1 — ซ้าย Requirement / TAG → ขวา Supplier → SI คำนวณงบ</h4>
  <p className="p55-note"><strong>งบคำนวณใหม่ USD {money(model.proposedQuoteUSD)}</strong>
   {" "}· {model.groups.length} กลุ่ม / {model.rows.length} รายการราคา · ต้นทุนอุปกรณ์ฐานงบ THB {money(model.equipmentCostTHB)}
   {" "}· SELL THB {money(model.budgetSellTHB)} · ยังไม่ใช่ต้นทุนจัดซื้อหรือราคา supplier ที่ยืนยันใหม่</p>
  <p className="p55-note">ใช้ราคาอะไหล่ D/E ที่ Next G เสนอโดยตรงก่อน ส่วน L3, BDA และ RACON ใช้ราคาชุดที่เลือกไว้ของ TAG เดิม
   โดย SI ตั้งสมมติฐานสำรองอย่างละ 1 ชุดสำหรับงบโครงการ จำนวนนี้ยังไม่ใช่จำนวนที่ลูกค้าหรือ OEM อนุมัติ</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>กลุ่ม / รายการสำรอง</th><th>ซ้าย — MR / TAG ที่ต้องรองรับ</th><th>ขวา — ราคาอ้างอิง</th><th>จำนวนสำรอง</th><th>ต้นทุนฐานงบ</th><th>SELL ฐานงบ THB</th><th>SI decision</th></tr></thead>
   <tbody>{model.rows.map(r=><tr key={r.id} data-c1-si-price-row={r.id}>
    <td><strong>{r.group}. {r.groupTitle}</strong><small>{r.description}</small></td>
    <td>{r.left.map(x=><p key={x.key}><strong>{x.site} · {x.tag}</strong><small>{x.mr} · source item {x.id}</small><small>{x.source}</small></p>)}</td>
    <td><strong>{r.rateBasis}</strong><details><summary>{r.right.length} quoted component(s)</summary>
     {r.right.map(x=><p key={x.quote+'|'+x.quoteLine}>{x.quote} · {x.quoteLine}<small>{x.partNo}</small><small>{x.quantity} × {x.currency} {money(x.unitCost)}</small></p>)}</details></td>
    <td>{r.quantity} {r.unit}<small>{r.quantityAuthority}</small></td>
    <td>{r.currency} {money(r.equipmentCost)}<small>THB {money(r.equipmentCostTHB)}</small></td>
    <td>{money(r.budgetSellTHB)}</td><td>{r.siDecision}</td>
   </tr>)}</tbody>
   <tfoot><tr><th colSpan={4}>C1 equipment-budget total</th><th>THB {money(model.equipmentCostTHB)}</th><th>{money(model.budgetSellTHB)}</th><th>USD {money(model.proposedQuoteUSD)}</th></tr></tfoot>
  </table></div>
  <p className="p55-note">สมการเดิม: Σ(จำนวนสำรอง × ราคาอ้างอิง × FX) × {model.priceFactor.toFixed(2)}
   {" "}→ ÷ {model.fxTHBPerUSD} → ปัดขึ้น USD100 ที่ยอดรวมครั้งเดียว
   {" "}· ผลต่างการปัดเศษรายแถวกับยอดรวม THB {money(model.rowRoundingResidualTHB)}</p>
  <p className="p55-note"><strong>ราคาเสนอเดิม USD {money(model.priorQuotedUSD)} / งบใหม่เพิ่ม USD {money(model.deltaUSD)}.</strong>
   {" "}งบใหม่แสดงให้ตรวจทานก่อนเลือกแทนราคาข้อเสนอเดิม จึงไม่เปลี่ยน Excel ใบเสนอราคาเดิมโดยอัตโนมัติ</p>
  <details><summary>รายการที่ยังต้องยืนยัน โดยไม่ปิดกั้นการคำนวณงบที่มีฐานราคาแล้ว</summary>
   <p className="p55-note">{model.qualification}</p>
   <ul>{model.openSourceLines.map(x=><li key={x.code}>{x.code} · {x.partNo}: ยังไม่มีราคาแยก ไม่ใช่ราคายืนยันศูนย์</li>)}</ul>
   <p className="p55-note">Extended warranty เป็นทางเลือก ยังไม่บวกทั้งสองระยะเวลาพร้อมกัน:</p>
   <ul>{model.unselectedWarrantyLines.map(x=><li key={x.code}>{x.code} · {x.description} · USD {money(x.unitPrice)}</li>)}</ul>
   <p className="p55-note">PoE/cord ของ D/E อยู่เฉพาะกลุ่ม indoor interface ไม่คิดซ้ำใน ODU;
    {" "}BDA enclosure และ RACON control/distribution boxes ที่รวมในชุด ไม่เพิ่มเป็นอะไหล่ซ้ำอีก</p>
  </details>
 </section>;
}
