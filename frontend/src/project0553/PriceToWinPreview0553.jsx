import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {evaluatePriceToWin0553} from "./data/priceToWinScenario0553";

// PJ2608-0553 Internal strategy simulation. Zero writes to pricing ledgers or exports.
const money=x=>Number.isFinite(x)?x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const pct=x=>Number.isFinite(x)?x.toLocaleString("en-US",{maximumFractionDigits:2})+"%":"—";
export function PriceToWinPreview0553({model}){
 const [discount,setDiscount]=useState("3");
 const [allInCost,setAllInCost]=useState("");
 const result=evaluatePriceToWin0553({
  releaseModel:model,discountPct:discount,
  allInCostAssumptionTHB:allInCost.trim()===""?null:allInCost
 });
 const sourceGaps=result.sourceGaps||[];
 return <section className="p55-panel" data-component-key="bid.budget.strategy.price-to-win">
  <div className="p55-eyebrow">
   10.3.A — INTERNAL / PRICE-TO-WIN DECISION SANDBOX
   <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.strategy.price-to-win"/>
  </div>
  <h3>Price-to-Win · Competitive Bid Strategy (ทดลอง)</h3>
  <p className="p55-note"><strong>NON-POSTING / NO RELEASE:</strong> คำนวณ sensitivity จาก A+B เฉพาะยอดที่มีราคาใน Working→Release ปัจจุบัน ไม่ใช่ราคาทั้งสัญญาหรือราคาประเมินของ JUTAL. C1/C2 เป็น Option แยก. ไม่มีการเดาราคาของ Fusion Asia/Omega และไม่มีการคำนวณโอกาสชนะจากข้อมูลที่ไม่เพียงพอ</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>ที่มาจาก Source</th><th>Working Customer SELL · THB</th><th>สถานะ</th></tr></thead>
   <tbody>
    <tr><td>A Equipment · 10.1</td><td>{money(result.knownA_THB)}</td><td>Provisional / TAG cost coverage gate</td></tr>
    <tr><td>B Services · 10.2</td><td>{money(result.knownB_THB)}</td><td>Working SELL / direct cost incomplete</td></tr>
    <tr><th>Known A+B subtotal</th><th>{money(result.knownAB_THB)}</th>
      <td><strong>{result.sourceCoverageComplete?"Coverage checks passed":"HOLD — ยังไม่ใช่ราคาสุดท้าย"}</strong></td></tr>
   </tbody>
  </table></div>
  <div className="p55-filterbar p55-filterbar--simple">
   <label>ช่วงทดสอบส่วนลด (%) — สมมติฐาน ไม่ใช่ราคาแนะนำ
    <input type="number" min="0" max="100" step="0.5" value={discount}
      onChange={event=>setDiscount(event.target.value)} aria-label="Scenario discount percent"/>
   </label>
   <label>All-in cost สมมติฐาน (THB) — ไม่บันทึกใน Cost Ledger
    <input type="number" min="0" step="any" value={allInCost}
      onChange={event=>setAllInCost(event.target.value)}
      placeholder="เว้นว่างจนกว่าจะมีฐานต้นทุนครบ" aria-label="Hypothetical all-in execution cost"/>
   </label>
  </div>
  {!result.validDiscount&&<p className="p55-note"><strong>Invalid input:</strong> ส่วนลดต้องอยู่ระหว่าง 0–100%; ยังไม่สร้าง Scenario เพิ่ม</p>}
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Test Case</th><th>Discount</th><th>ยอดลดจาก Known A+B · THB</th>
      <th>Scenario Priced Subtotal · THB</th><th>Illustrative Surplus · THB</th></tr></thead>
   <tbody>{result.scenarios.map((row,index)=><tr key={row.key}>
    <td>{index===0?"Baseline — ไม่ลด":index===1?"Scenario A — ทดสอบ":"Scenario B — ทดสอบเพิ่ม"}</td>
    <td>{pct(row.discountPct)}</td><td>{money(row.reductionTHB)}</td>
    <td>{money(row.knownPricedAmountTHB)}</td><td>{money(row.illustrativeNetTHB)}</td>
   </tr>)}</tbody>
  </table></div>
  <p className="p55-note"><strong>Illustrative Surplus ≠ Approved Profit:</strong> ช่องนี้จะคำนวณเมื่อกรอกต้นทุนสมมติฐานเองเท่านั้น (Scenario subtotal − all-in cost). ต้องรวม Supplier Cost, SAMTEL, Logistics, Duties/Tax Treatment, Bonds, FX, Execution Risk และทุก Scope ก่อนใช้ตัดสินจริง; การลดราคาในตารางไม่ได้ลดต้นทุนตามไปด้วย. ช่องว่างคือข้อมูลไม่พร้อม ไม่ใช่ศูนย์</p>
  <details>
   <summary><strong>Evidence &amp; Decision Gates</strong> — {sourceGaps.length} source gaps / บันทึกคู่แข่งแยกจากต้นทุน</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Control</th><th>ต้องมีอะไร</th><th>สถานะขณะนี้</th></tr></thead>
    <tbody>
     <tr><td>JUTAL award stage</td><td>ยืนยันว่าเป็น Subcontract Package procurement ไม่ใช่ PTTEP EPC tender</td><td>Owner-award context; RFQ-specific authority requires evidence</td></tr>
     <tr><td>Evaluation criterion</td><td>Commercial / technical evaluation rule และฐาน Incoterm/Tax เดียวกัน</td><td>ยังไม่ verified</td></tr>
     <tr><td>Competitor intelligence</td><td>Historical awarded bid/debrief ที่ได้มาอย่างถูกต้อง พร้อมวันที่/เอกสาร</td><td>Fusion Asia = past winner per management; Omega = potential bidder; no prices verified</td></tr>
     <tr><td>Floor approval</td><td>Verified all-in cost + finance risk + authorized discount floor</td><td>HOLD / input สมมติฐานไม่ใช่ Approval</td></tr>
     {sourceGaps.map((gap,i)=><tr key={i}><td>Source gap {i+1}</td><td>{gap}</td><td>OPEN</td></tr>)}
    </tbody>
   </table></div>
  </details>
  <p className="p55-note"><strong>Guardrails:</strong> Module นี้อ่าน canonical Release Model เท่านั้น, ไม่แก้ 10.1/10.2, ไม่เขียนฐานข้อมูล/Working SELL, ไม่เปลี่ยน 10.3.3/10.3.4 และไม่แตะ Native Excel. ต้องผ่าน Final Cost + Bid Approval Gate ก่อนนำ Scenario ไปใช้เสนอราคา</p>
 </section>;
}
