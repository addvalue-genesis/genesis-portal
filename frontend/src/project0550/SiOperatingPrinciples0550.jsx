import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {SI_EQUATION_0550,SI_MODULE_LINKS_0550,siOperatingChecks0550} from "./siOperatingModel0550";

export function SiOperatingPrinciples0550({onNavigate,compact=false}) {
 const {model}=useBidWorkspace();
 const checks=siOperatingChecks0550(model);
 const open=id=>onNavigate?.(id);
 return <section className="p55-si-principles" aria-label="หลักการทำงาน System Integrator 0550">
  <h3>หลักการทำงาน Web App 0550 · A → System Integrator → 10.7</h3>
  <p className="p55-si-equation">{SI_EQUATION_0550}</p>
  <div className="p55-si-roles">
   <div><strong>A · Customer Sources</strong><p>โจทย์และข้อกำหนดลูกค้า</p><button type="button" onClick={()=>open("l3.original")}>เปิด A · ต้นทางลูกค้า</button></div>
   <div><strong>F_SI · งานของเราในเมนู B</strong><p>อ่าน → วิเคราะห์ → ออกแบบและพิสูจน์ → กำหนดปริมาณและงาน → คำนวณราคา → ตรวจครบ</p><button type="button" onClick={()=>open("bid.working-preview.step.1")}>เปิด Working Preview 1–8</button></div>
   <div><strong>S · Supplier Sources</strong><p>Offer / Catalog / Datasheet / เงื่อนไขผู้ขาย</p><button type="button" onClick={()=>open("bid.vendor.offers")}>เปิดข้อมูล Supplier</button></div>
  </div>
  <p>K = วิธีวิศวกรรมและมาตรฐาน · D = การตัดสินใจพร้อมหลักฐาน · Θ = ฐานปริมาณ หน่วย Rate วิธีขาย Prime FX พร้อมวันที่ และนโยบายปัดเศษ · เมนู B รวมงาน Integrator และการใช้ข้อมูล Supplier; Part A/B/C ของราคาเป็นอีกความหมายหนึ่ง</p>
  <p>Cost → ADDVALUE Sell → Customer Sell (รวม Prime ตามฐานที่เลือก) → 10.6 THB → 10.7 USD · งาน COMMON นับปริมาณจริงและต้นทุนครั้งเดียว · ทุกผลย้อนกลับถึง Source/Version ได้ · EQ ต้องรักษาเกณฑ์เดิม ไม่เปลี่ยนเพื่อให้ผ่าน</p>
  <details><summary>ฐานราคาและการทบทวนเมื่อวิธีปัดเศษเปลี่ยน</summary><p>ปัดจำนวนเงิน 2 ตำแหน่งแบบ Decimal Half-up ต่อบรรทัด THB → USD แล้วรวมยอด Lot · วิธีขาย Quantity Rate Prime และ FX ที่บันทึกไว้ยังเป็นฐานเดิม ผลทบทวน Official จากวิธีปัดเดิมต้องตรวจใหม่ ไม่อนุมัติให้อัตโนมัติ · การคำนวณก่อนจุดปัดยังใช้สมการเดิม จึงไม่ได้รับรองความแม่นยำทศนิยมทุกขั้น</p></details>
  <details open={!compact}><summary>เงื่อนไขควบคุมจากข้อมูลรอบปัจจุบัน</summary>
   {!model?<p>กำลังโหลดฐาน Working…</p>:<div className="p55-table-wrap"><table className="p55-table" aria-label="SI runtime controls"><thead><tr><th>สิ่งที่ตรวจ</th><th>สถานะ / จำนวนรายการที่มีปัญหา</th><th>กลับไปทำงาน</th></tr></thead><tbody>{checks.map(c=><tr key={c.label}><td>{c.label}</td><td>{c.state}{c.count!==undefined?" · "+c.count:""}</td><td><button type="button" onClick={()=>open(c.target)}>เปิดจุดตรวจ</button></td></tr>)}</tbody></table></div>}
   <p>CLEAR หมายถึงไม่พบปัญหาในรายการตรวจแถวนั้น ไม่รับรองว่าค้นพบข้อกำหนดลูกค้าครบแล้ว จำนวนแต่ละแถวอาจทับกันจึงไม่บวกรวม · READY/REVIEWED ไม่ใช่การอนุมัติ Release</p>
  </details>
  {compact?<button type="button" onClick={()=>open("bid.architecture")}>เปิด 03 Architecture · สมการและการเชื่อมโมดูลทั้งหมด</button>:<div className="p55-table-wrap"><table className="p55-table" aria-label="SI module responsibilities"><thead><tr><th>โมดูล / เปิดทำงาน</th><th>หน้าที่ในสมการ</th><th>Module ID</th></tr></thead><tbody>{SI_MODULE_LINKS_0550.map(m=><tr key={m.id}><td><button type="button" onClick={()=>open(m.id)}>{m.title}</button></td><td>{m.purpose}</td><td><ComponentCopyId projectId="PJ2608-0550" componentKey={m.id}/></td></tr>)}</tbody></table></div>}
  <p>10.7 มีการตรวจความพร้อม ตรึงฉบับพร้อมฐานข้อมูลและราคา เก็บบันทึกผู้อนุมัติ และบันทึกหลักฐานส่งแยกกันแล้ว · ยังต้องตรวจจริง: ข้อกำหนดและ engineering ทั้งโครงการ รายการผลกระทบหลายชั้น Shared Proof/Activity Mapping และ Tolerance ที่ยอมรับ · บันทึกชื่อไม่ใช่ลายเซ็นยืนยันตัวตน และโปรแกรมไม่ได้ส่งอีเมลให้</p>
 </section>;
}
