import React,{useMemo} from "react";
import {selectC1C2EngineeringControl0553} from "./data/c1c2EngineeringControl0553";

const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"OPEN — ยังไม่มีข้อมูลยืนยัน";
const labels={CLASSIFICATION_DECISION:"เลือก C1/C2 หรือไม่เสนอ",CLASSIFICATION_REASON_AND_SOURCE:"เหตุผลและข้อกำหนดอ้างอิง",
 INSTALLED_PHYSICAL_COUNT:"จำนวนติดตั้ง",INSTALLED_CONFIGURATION_VERIFIED:"รุ่นและจำนวนติดตั้งที่ใช้ฐานเดียวกัน",
 OEM_PART_NUMBER_AND_SOURCE:"OEM Part No. และหลักฐาน",EX_RATING_VARIANT_AND_INTERCHANGEABILITY:"รุ่น/Ex/การใช้แทนกัน",
 STOCK_LOCATION_AND_POOLING_POLICY:"สถานที่เก็บและการใช้ stock ร่วมกัน",INDEPENDENT_PHYSICAL_STOCK_OWNER:"เจ้าของ stock แยกจากของติดตั้ง",
 QUANTITY_METHOD:"วิธีคำนวณจำนวน",SOURCED_QUANTITY:"จำนวนพร้อมแหล่งอ้างอิง",SPQ_002_INPUT_EVIDENCE:"อัตราเสีย/ระยะเวลา/ความมั่นใจพร้อมหลักฐาน",
 C2_TWO_YEAR_HORIZON:"ช่วงเวลา C2 ต้องเป็น 2 ปี",DOCUMENT_MINIMUM_SOURCE:"ขั้นต่ำรายชิ้นตามเอกสาร",DOCUMENT_MINIMUM_MET:"จำนวนต้องไม่น้อยกว่าขั้นต่ำ",
 ITEM_SELL_RATE_AND_SOURCE:"ราคาขายรายชิ้นพร้อมฐานราคา",OEM_SPARE_LEAD_TIME:"lead time ของอะไหล่",DELIVERY_TERMS_RECONCILED:"เงื่อนไขส่งมอบ",
 B10_PHYSICAL_LIST_RECONCILED:"รายการจริง B10 ที่ตรวจแล้ว",C2_EXCLUDES_IDENTICAL_B10_ITEM:"ตัดรายการ C2 ที่ซ้ำ B10",
 B10_DISTINCT_PHYSICAL_STOCK:"ไม่ใช้ stock B10 ชุดเดิมซ้ำ",C1_C2_DISTINCT_STOCK:"ไม่ใช้ stock เดียวกันซ้ำ C1/C2"};
export function C1C2EngineeringControl0553({code,onOpenSource=null,open=true}){
 const model=useMemo(()=>selectC1C2EngineeringControl0553(),[]);
 const item=model.codes[code];
 if(!item)return null;
 return <details className="p55-panel p553-c1c2-engineering-review" open={open} style={{padding:12,marginTop:12}}
   data-c1c2-engineering-control={code}>
  <summary><strong>{code} — ตรวจครบทุกระบบ / Quantity & Price Control</strong>
   <small>{item.openCount}/{item.totalFamilies} equipment families OPEN · งบเดิม USD {money(item.currentOfferUSD)} · ไม่ใช่หลักฐานครบทุกระบบ</small></summary>
  <p className="p55-note"><strong>INTERNAL ENGINEERING REVIEW — NOT AN ADDITIONAL OFFER.</strong>
   {" "}ตารางนี้ตรวจ SCADA, L3 switch, BDA, IP phone, sounder และ RACON จาก Source เดิม
   โดยยังไม่กำหนดอะไหล่หนึ่งเครื่องต่อระบบหรือรวมจำนวนข้ามสถานที่เอง
   การแสดงรายการในตารางไม่ใช่การเพิ่ม scope หรือราคาใน C1/C2 ที่เสนอแล้ว</p>
  <p className="p55-note"><strong>ฐานราคาที่เสนอปัจจุบัน:</strong> {item.currentPriceBasis}
   {" "}· {item.currentOfferLines} price reference line(s) · Excluded from A+B.
   {typeof onOpenSource==="function"&&<button type="button" className="p553-detail-button"
    onClick={()=>onOpenSource({code,sourceModuleId:item.offerSourceModuleId,
     ...(code==="C1"?{sourceId:item.offerSourceId}:{})})}>↗ Current price Source</button>}</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>MR / ระบบ</th><th>Installed source / สถานที่</th><th>รายการราคาเดิมที่เกี่ยวข้อง</th>
    <th>จำนวนสำรอง / Part No.</th><th>ราคาที่คำนวณจากหลักฐานครบ</th><th>สิ่งที่ยังต้องยืนยัน</th></tr></thead>
   <tbody>{item.rows.map(row=><tr key={row.key} data-c1c2-family={row.key}>
    <td><strong>{row.label}</strong><small>{row.mr}</small></td>
    <td>{row.installedCount??"OPEN"} source quantity<small>ไม่ใช่จำนวนอะไหล่ที่ต้องซื้อ</small><small>{row.installedSites.join(" / ")}</small>
     <details><summary>{row.installedRecordCount} exact source records</summary>
      {row.sourceRows.map(s=><p key={s.key}><code>{s.site} · {s.tag}</code><small>{s.source} · {s.authority}</small></p>)}
     </details></td>
    <td>{row.offeredReferenceIds.length?row.offeredReferenceIds.join(" / "):"ไม่มีรายการราคาเดิมรองรับกลุ่มนี้"}
     <small>Reference only; ไม่ยืนยัน compatible SKU หรือความครบถ้วน และห้ามรวมราคาอ้างอิงซ้ำ</small></td>
    <td>{row.assessment.reviewQuantity??"OPEN"}<small>{row.assessment.partNo||"OEM Part No. ยังไม่ยืนยัน"}</small></td>
    <td>{money(row.assessment.reviewSellTHB)}<small>THB · Qty × evidence-backed SELL rate</small></td>
    <td><strong>{row.assessment.status}</strong><small>{row.assessment.missing.map(k=>labels[k]||k).join(" · ")}</small></td>
   </tr>)}</tbody>
  </table></div>
  <p className="p55-note"><strong>ยอดคำนวณใหม่ที่ตรวจหลักฐานครบ:</strong> THB {money(item.evidencedReviewSellTHB)}
   {" "}· ไม่แทนที่งบเดิม USD {money(item.currentOfferUSD)} จนกว่าจะตรวจครบและเลือกราคาโดยผู้รับผิดชอบ</p>
  <details><summary>สมการเดิม / ขอบเขตและการไม่คิดซ้ำ</summary>
   <p className="p55-note">{model.existingEquationIds.join(" · ")} — Requirement → equipment/TAG → C1/C2 decision → sourced quantity → unique physical stock → Qty × rate → one total FX/rounding.</p>
   <p className="p55-note">SPQ-002: μ = N × failure rate/year × horizon years; choose the smallest q with Poisson CDF ≥ confidence.
    C2 uses 2 years. Failure data, confidence, compatible models and stock-location policy need evidence.
    {" "}SPQ-001 remains a commissioning budget scenario; its assumed one unit is not the C1/C2 accepted quantity.
    A design minimum MTBF or installed redundancy is not a measured spare-demand input.</p>
   <p className="p55-note">C2 ต้องตรวจรายการจริงกับ B10 ตาม MR Attachment 7 ข้อ 6;
    {" "}ไม่หักราคาเพียงเพราะชื่อคล้ายกัน และ C1/C2 ต้องไม่ใช้ physical stock ชุดเดียวกันซ้ำ</p>
   <ul>{model.potentialB10C2Overlaps.map(x=><li key={x.family}>{x.family}: {x.b10Id} ↔ {x.c2Id} — exact SKU/stock evidence OPEN</li>)}</ul>
  </details>
  <details><summary>ข้อกำหนดต้นฉบับ — อ่านทบทวน {model.evidenceReviewedOn}</summary>
   <ul>{model.requirements.map(r=><li key={r.id}><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a> — {r.requirement}</li>)}</ul>
  </details>
 </details>;
}
