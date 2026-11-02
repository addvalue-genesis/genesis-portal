import React,{useMemo} from "react";
import {selectC2TagReview0553} from "./data/c2TagReview0553";
const money=n=>n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4});
export function C2TagReview0553(){
 const model=useMemo(()=>selectC2TagReview0553(),[]);
 return <section className="p55-panel p553-spare-tag-preview p553-c1c2-engineering-review" style={{padding:12,marginTop:12}} data-c2-tag-review="REFERENCE_ONLY">
  <h4>C2 — TAG / OEM part / stock review · 12 existing price references</h4>
  <p className="p55-note">แสดง TAG อุปกรณ์ที่เกี่ยวข้องพร้อมสถานที่และ OEM Part No. เท่าที่มีหลักฐาน
   {" "}อะไหล่ย่อยใช้ TAG ตู้แม่ และสายใช้ TAG ของอุปกรณ์ปลายทาง; ไม่สร้าง TAG ใหม่ให้ fuse, gland หรือสาย
   {" "}TAG เป็นจุดอ้างอิง ยังไม่ยืนยันว่าอะไหล่หนึ่งชิ้นใช้ร่วมทุก TAG ได้</p>
  <p className="p55-note">พบ {model.b10PotentialRows} รายการที่ต้องตรวจ B10 และ {model.c1PotentialRows} รายการที่ต้องตรวจ C1
   {" "}ไม่หักราคา/จำนวนอัตโนมัติ ตารางนี้ยังไม่ยืนยันความครบทุกระบบหรือจำนวน stock สำหรับสองปี
   {" "}ราคาเดิม C2 USD {money(model.currentOfferUSD)} คงไว้</p>
  <div className="p553-b10-commercial-scroll"><table className="p553-customer-table p553-b10-native-annex-table">
   <thead><tr>{["Item","Reference Tag No. / Site","Description","Detail Specification / OEM part reference","Required review / C1-B10 ownership","Historical QTY","UNIT THB / historical","TOTAL THB / historical"].map(h=><th key={h}>{h}</th>)}</tr></thead>
   <tbody>{model.rows.map(r=><tr key={r.id} data-c2-tag-row={r.id}>
    <td>{r.item}</td><td><strong>{[...new Set(r.tagRefs.map(x=>x.tag))].join("; ")}</strong>
     <details className="p553-c2-tag-list"><summary>{r.tagRefs.length} exact MR / Site / TAG references</summary>
      {r.tagRefs.map(x=><small key={x.key}>{x.mr} · {x.site} / {x.tag}<br/>{x.source}</small>)}</details></td>
    <td>{r.description}<small>Original source: {r.historicalDescription}</small></td>
    <td>{r.partReference.partNo||"Exact OEM part number pending"}<small>{r.partReference.source}</small><small>{r.partReference.note}</small></td>
    <td>{r.action}<small>{[...r.b10Refs,...r.c1Refs].join(" / ")||"OEM scope / stock review"}</small></td>
    <td>{r.quantity} {r.unit}<small>Quantity unapproved</small></td>
    <td className="p553-price-cell">{money(r.unitPriceTHB)}</td><td className="p553-price-cell">{money(r.extendedTHB)}</td>
   </tr>)}</tbody>
   <tfoot><tr><th colSpan={7}>HISTORICAL PRICE REFERENCE ONLY — THB</th><th>{money(model.historicalSubtotalTHB)}</th></tr></tfoot>
  </table></div>
  <p className="p55-note">ราคาในตารางเป็น SELL อ้างอิงเดิม ไม่ใช่ต้นทุน Supplier ปัจจุบัน และห้ามคูณ 1.30 ซ้ำ
   {" "}ต้องตรวจ C2 ทุกระบบต่อจากตาราง Quantity &amp; Price Control ด้านล่าง; การมี C1 ให้เลือกซื้อไม่ยืนยันว่า C2 ครบแล้ว</p>
 </section>;
}
