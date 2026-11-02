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
  <p className="p55-note" data-c1-owner-scope="2026-11-02"><strong>ฐานงานที่เจ้าของโครงการเลือก:</strong>
   {" "}L3 Switch {model.ownerDecisions.l3.selectedCopperPorts} copper ports + {model.ownerDecisions.l3.selectedSfpPorts} SFP ตาม TC-0001 Item 13;
   {" "}MDS ไม่รวม FAT สายเชื่อมต่อ/สายภาคสนาม และ Cable glands — ADDVALUE ดำเนินการ FAT ใน B3 ที่ SAMTEL Thailand และจัดหาวัสดุผ่าน MR0004 field bulk
   {" "}ต้องตรวจงบเดิมก่อนเพิ่มค่าใช้จ่าย จำนวนสำรองทุกแถวรวม D/E ยังต้องผ่าน SI ตรวจซ้ำ</p>
  <div className="p553-b10-original-annex p553-spare-tag-preview" data-c1-annex-preview="DRAFT">
   <div className="p553-native-title">SUPPLIER RECOMMENDATION FOR CAPITAL SPARE PARTS — C1 REVIEW PREVIEW</div>
   <p className="p55-note">Reference equipment TAG / site only; not a new spare asset TAG or confirmation of interchangeability.
    {" "}QTY is project spare stock, not quantity per reference TAG. Conditional budgetary preview; excluded from A+B.</p>
   <div className="p553-b10-commercial-scroll"><table className="p553-customer-table p553-b10-native-annex-table">
    <thead><tr>{["Item","Tag No. / Reference site","Description","Detail Specification","Materials","QTY","UNIT PRICE (USD)","TOTAL PRICE (USD)"].map(h=><th key={h}>{h}</th>)}</tr></thead>
    <tbody>{model.annexRows.map(r=><tr key={r.id} data-c1-si-price-row={r.id}>
     <td>{r.item}</td><td>{r.tagNo}</td><td>{r.description}</td><td>{r.specification}</td><td>{r.materials}</td>
     <td>{r.quantity} {r.unit}{r.quantity>1?"s":""}</td><td className="p553-price-cell">{money(r.unitUSD)}</td><td className="p553-price-cell">{money(r.totalUSD)}</td>
    </tr>)}</tbody>
    <tfoot><tr><th colSpan={7}>TOTAL C1 PROPOSED BUDGET (USD)</th><th>{money(model.proposedQuoteUSD)}</th></tr></tfoot>
   </table></div>
   <p className="p55-note">Unit prices rounded to USD {model.annexUnitIncrementUSD}; Qty × Unit = Total on every row.
    {" "}Rounded rows reconcile to the category total; no additional rounding charge.</p>
   <p className="p55-note">Item 5 retained. MDS field/interconnection cables, cable glands and FAT are excluded;
    {" "}ADDVALUE supplies/executes through field bulk and B3. Applicability and existing budget coverage must be reconciled before any additional charge.</p>
  </div>
  <details><summary>Source → TAG → SI calculation / ฐานต้นทุนและการตรวจย้อนกลับ</summary>
  <p className="p55-note">ก่อนปัด USD {money(model.annexSourceSubtotalUSD)} → ยอดหมวด USD {money(model.proposedQuoteUSD)}
   {" "}· ส่วนต่าง USD {money(model.annexRoundingUSD)} กระจายในราคาย่อยแล้ว ไม่บวกซ้ำท้ายตาราง
   {" "}· ส่วนต่างที่ยังไม่กระจาย USD {money(model.annexUnallocatedRoundingUSD)}</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" data-c1-rounding-audit="USD100_UNIT">
   <thead><tr><th>Item</th><th>Source unit USD</th><th>Source amount USD</th><th>Rounded unit USD</th><th>Rounded amount USD</th><th>Adjustment USD</th></tr></thead>
   <tbody>{model.annexRows.map(r=><tr key={r.id}><td>{r.item}</td><td>{money(r.sourceUnitUSD)}</td><td>{money(r.sourceTotalUSD)}</td>
    <td>{money(r.unitUSD)}</td><td>{money(r.totalUSD)}</td><td>{money(r.roundingAdjustmentUSD)}</td></tr>)}</tbody>
  </table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>กลุ่ม / รายการสำรอง</th><th>ซ้าย — MR / TAG ที่ต้องรองรับ</th><th>ขวา — ราคาอ้างอิง</th><th>จำนวนสำรอง</th><th>ต้นทุนฐานงบ</th><th>SELL ฐานงบ THB</th><th>SI decision</th></tr></thead>
   <tbody>{model.rows.map(r=><tr key={r.id} data-c1-si-audit-row={r.id}>
    <td><strong>{r.group}. {r.groupTitle}</strong><small>{r.description}</small></td>
    <td>{r.left.map(x=><p key={x.key}><strong>{x.site} · {x.tag}</strong><small>{x.mr} · source item {x.id}</small><small>{x.source}</small></p>)}</td>
    <td><strong>{r.rateBasis}</strong><details><summary>{r.right.length} quoted component(s)</summary>
     {r.right.map(x=><p key={x.quote+'|'+x.quoteLine}>{x.quote} · {x.quoteLine}<small>{x.partNo}</small><small>{x.quantity} × {x.currency} {money(x.unitCost)}</small></p>)}</details></td>
    <td>{r.quantity} {r.unit}<small>{r.quantityAuthority}</small></td>
    <td>{r.currency} {money(r.equipmentCost)}<small>THB {money(r.equipmentCostTHB)}</small></td>
    <td>{money(r.budgetSellTHB)}</td><td>{r.siDecision}</td>
   </tr>)}</tbody>
   <tfoot><tr><th colSpan={4}>C1 equipment-budget total</th><th>THB {money(model.equipmentCostTHB)}</th><th>{money(model.budgetSellTHB)}</th><th>USD {money(model.proposedQuoteUSD)}</th></tr></tfoot>
  </table></div></details>
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
