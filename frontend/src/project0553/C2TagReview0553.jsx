import React,{useMemo} from "react";
import {selectOptionBudgetaryOffer0553} from "./data/optionBudgetaryOffer0553";
import {selectC2TagReview0553} from "./data/c2TagReview0553";
const money=n=>n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4});
export function C2TagReview0553(){
 const model=useMemo(()=>selectC2TagReview0553(),[]);
 const offer=useMemo(()=>selectOptionBudgetaryOffer0553().offers.C2,[]);
 const quoted=new Map(offer.rows.map(x=>[x.id,x]));
 return <section className="p55-panel p553-spare-tag-preview p553-c1c2-engineering-review" style={{padding:12,marginTop:12}} data-c2-tag-review="REFERENCE_ONLY">
  <h4>C2 — TAG / OEM part / stock review · {offer.rows.length} selected / {model.rows.length} historical references</h4>
  <p className="p55-note">แสดง TAG อุปกรณ์ที่เกี่ยวข้องพร้อมสถานที่และ OEM Part No. เท่าที่มีหลักฐาน
   {" "}อะไหล่ย่อยใช้ TAG ตู้แม่ และสายใช้ TAG ของอุปกรณ์ปลายทาง; ไม่สร้าง TAG ใหม่ให้ fuse, gland หรือสาย
   {" "}TAG เป็นจุดอ้างอิง ยังไม่ยืนยันว่าอะไหล่หนึ่งชิ้นใช้ร่วมทุก TAG ได้</p>
  <p className="p55-note">พบ {model.b10PotentialRows} รายการที่ต้องตรวจ B10 และ {model.c1PotentialRows} รายการที่ต้องตรวจ C1
   {" "}ไม่หักราคา/จำนวนอัตโนมัติ ตารางนี้ยังไม่ยืนยันความครบทุกระบบหรือจำนวน stock สำหรับสองปี
   {" "}ยอด C2 ปัจจุบัน USD {money(model.currentOfferUSD)}</p>
  <p className="p55-note">ตัด DB-5P สำรองเพิ่มเติมออกจาก C2 ตามคำสั่งเจ้าของโครงการแล้ว
   กล่องที่รวมในชุด RACON ของ Part A และ C1 ยังคงอยู่; รายการอื่นยังต้องตรวจรุ่น จำนวนสองปี และ B10</p>
  <div className="p553-b10-commercial-scroll"><table className="p553-customer-table p553-b10-native-annex-table">
   <thead><tr>{["Item","Reference Tag No. / Site","Description","Detail Specification / OEM part reference","Required review / C1-B10 ownership","Budget QTY","UNIT USD","TOTAL USD"].map(h=><th key={h}>{h}</th>)}</tr></thead>
   <tbody>{model.rows.filter(r=>quoted.has(r.id)).map(r=><tr key={r.id} data-c2-tag-row={r.id}>
    <td>{r.item}</td><td><strong>{[...new Set(r.tagRefs.map(x=>x.tag))].join("; ")}</strong>
     <details className="p553-c2-tag-list"><summary>{r.tagRefs.length} exact MR / Site / TAG references</summary>
      {r.tagRefs.map(x=><small key={x.key}>{x.mr} · {x.site} / {x.tag}<br/>{x.source}</small>)}</details></td>
    <td>{r.description}<small>Original source: {r.historicalDescription}</small></td>
    <td>{r.partReference.partNo||"Exact OEM part number pending"}<small>{r.partReference.source}</small><small>{r.partReference.note}</small></td>
    <td>{r.action}{r.rateReconciliation&&<small>Next G มีราคา PoE USD {money(r.rateReconciliation.poeCostUSD)} และสาย USD {money(r.rateReconciliation.cordCostUSD)} เป็นข้อมูลเทียบ; ราคา C2 ปัจจุบันยังเป็นงบเดิมที่ต้องตรวจเงื่อนไขก่อนเลือกอัตราใหม่</small>}{quoted.get(r.id).budgetDecision&&<small>Owner budget: {quoted.get(r.id).budgetDecision.totalLengthM}m × THB {money(quoted.get(r.id).budgetDecision.budgetCostTHBPerM)}/m = Cost THB {money(quoted.get(r.id).extendedCostTHB)}; existing Release factor ×1.30 once. Historical supplier rate THB{money(quoted.get(r.id).budgetDecision.historicalRateTHBPerM)}/m; selected cost basis: {quoted.get(r.id).budgetDecision.costBasis}. No current vendor price is confirmed. Factory drum size, final SKU, packing/freight and technical compliance remain unconfirmed.</small>}<small>{r.suitabilityStatus==="INDEPENDENT_JUSTIFICATION_REQUIRED"?"ต้องขอ OEM ยืนยันความจำเป็นเพิ่มเติม":"อะไหล่บำรุงรักษาที่ต้องยืนยันรุ่นและจำนวน"}</small><small>{[...r.b10Refs,...r.c1Refs].join(" / ")||"OEM scope / stock review"}</small></td>
    <td>{quoted.get(r.id).quantity} {quoted.get(r.id).unit}<small>{quoted.get(r.id).budgetDecision?<>{quoted.get(r.id).budgetDecision.totalLengthM}m continuous length; owner budget quantity, OEM packing pending</>:"Quantity unapproved"}</small></td>
    <td className="p553-price-cell">{money(quoted.get(r.id).unitUSD)}</td><td className="p553-price-cell">{money(quoted.get(r.id).totalUSD)}</td>
   </tr>)}</tbody>
   <tfoot><tr><th colSpan={7}>C2 BUDGET TOTAL — USD</th><th>{money(offer.budgetaryQuoteUSD)}</th></tr></tfoot>
  </table></div>
  <details><summary>Historical source rates — THB / audit only</summary>
   <table className="p553-customer-table"><thead><tr><th>Item</th><th>Unit THB</th><th>Total THB</th></tr></thead>
    <tbody>{model.rows.map(r=><tr key={r.id}><td>{r.item} · {r.historicalDescription}{r.ownerExcluded&&" — excluded from current C2"}</td><td>{money(r.unitPriceTHB)}</td><td>{money(r.extendedTHB)}</td></tr>)}</tbody>
    <tfoot><tr><th colSpan={2}>Historical source total THB</th><th>{money(model.historicalSubtotalTHB)}</th></tr></tfoot>
   </table></details>
  <details><summary>CSS RF cable quotations — INTERNAL reference only</summary>
   <table className="p553-customer-table"><thead><tr><th>Quote / Customer</th><th>Cable</th><th>Quoted quantity / unit</th><th>Unit THB, ex VAT</th><th>Use</th></tr></thead>
    <tbody>{model.rfCableReferences.map(x=><tr key={x.quote}><td><a href={x.url} target="_blank" rel="noreferrer">{x.quote}</a><small>{x.date} / {x.customer}</small></td><td>{x.manufacturer} {x.partNo} / {x.diameter}</td><td>{x.quantity} {x.unit}</td><td>{money(x.unitPriceTHB)}</td><td>{x.sourceNote} Historical reference; current price, purchase and technical equivalence unconfirmed. The selected CSS1/2-inch drum budget is shown above; this raw reference adds no second charge.</td></tr>)}</tbody>
   </table>
  </details>
  <p className="p55-note">ราคาที่เสนอด้านบนปัดราคาต่อหน่วยขึ้นเป็นหลักสิบ USDและรวม USD {money(offer.budgetaryQuoteUSD)}; CAT6A300m และ RF305m คิดทั้ง Drum ตามงบเจ้าของโครงการ ×สมการ Release ครั้งเดียว รายการอื่นคงราคาขายเดิม ห้ามคูณ 1.30 ซ้ำ ฐานราคาเก่า THB อยู่ใน audit
   {" "}ต้องตรวจ C2 ทุกระบบต่อจากตาราง Quantity &amp; Price Control ด้านล่าง; การมี C1 ให้เลือกซื้อไม่ยืนยันว่า C2 ครบแล้ว</p>
 </section>;
}
