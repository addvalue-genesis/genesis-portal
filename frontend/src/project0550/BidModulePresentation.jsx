import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {SiOperatingPrinciples0550} from "./SiOperatingPrinciples0550";
import {BID_SECTIONS_0550,BID_GROUPS_0550,BID_MODULE_COLORS_0550,bidOwnerStyle,bidSection0550,bidModuleProps0550} from "./bidPresentation0550";

export function BidHeading({id,title,number}){
 const meta=bidSection0550(id),label=title||meta?.title||id,n=number||meta?.number;
 return <span className="p55-module-heading"><span className="p55-module-heading__title">{n&&<strong className="p55-module-number">{n}</strong>}<strong>{label}</strong></span><span className="p55-module-copy" onClick={e=>e.stopPropagation()}><ComponentCopyId projectId="PJ2608-0550" componentKey={id}/></span></span>;
}
export function BidPrinciples({id}){
 const meta=bidSection0550(id);if(!meta)return null;
 return <details className="p55-module-principles" data-component-key={id+".principles"} data-module-number={meta.number+".0"} {...bidModuleProps0550(id)}><summary><BidHeading id={id+".principles"} number={meta.number+".0"} title="หลักการของโมดูล"/></summary><div className="p55-table-wrap"><table className="p55-table" aria-label={"หลักการ "+meta.number}><tbody>{[["หน้าที่ / ทำไมต้องมี",meta.purpose],["ข้อมูลต้นทาง",meta.inputs],["วิธีคิด / กติกา",meta.method],["ผลลัพธ์",meta.outputs],["ข้อจำกัด",meta.limits],["เชื่อมไป",meta.next]].map(([label,text])=><tr key={label}><th>{label}</th><td>{text}</td></tr>)}</tbody></table></div></details>;
}
export function BidStructureGuide({onNavigate}){
 const sections=[...BID_SECTIONS_0550].sort((a,b)=>a.number.localeCompare(b.number,"en",{numeric:true})).filter(r=>!["bid.budget.guide","bid.budget.working.editor.review"].includes(r.id));
 return <details className="p55-panel p55-bid-module p55-structure-guide" data-component-key="bid.budget.guide" data-module-number="10.0" {...bidModuleProps0550("bid.budget.guide")}><summary><BidHeading id="bid.budget.guide"/></summary>
 <p>หัวข้อ 10.0–10.8 เรียงตามลำดับงานและแสดงครบเสมอ · WP.P / WP.1–WP.8 เป็นขั้นตอนภายใน 10.2 · Module ID เป็นที่อยู่ถาวร · กด Copy ID ที่จุดที่ติดปัญหา แล้วส่งพร้อมคำถามหรือภาพหน้าจอ</p>
 <SiOperatingPrinciples0550 onNavigate={onNavigate} compact/>
 <p>10.1 ฐานข้อเสนอ → 10.2 Particular / WP.1–WP.8 / รายการ A/B/C → 10.3 ตรวจขอบเขต → 10.4 ช่องว่าง → 10.5 สรุป → 10.6 THB → 10.7 USD → 10.8 เทียบ History · ใช้ปุ่มกลับ Source เพื่อตรวจที่มา</p>
 <div className="p55-table-wrap"><table className="p55-table" aria-label="แผนผังโมดูล 0550"><thead><tr><th>เลข / เปิดหัวข้อ</th><th>หน้าที่</th><th>Module ID</th></tr></thead><tbody>{sections.map(r=><tr key={r.id} {...bidModuleProps0550(r.id)}><td><button type="button" onClick={()=>onNavigate(r.id)}>{r.number} · {r.title}</button></td><td>{r.purpose}</td><td><ComponentCopyId projectId="PJ2608-0550" componentKey={r.id}/></td></tr>)}</tbody></table></div>
 <details data-component-key="bid.budget.guide.colors" data-module-number="10.0.1" {...bidModuleProps0550("bid.budget.guide.colors")}><summary><BidHeading id="bid.budget.guide.colors"/></summary><div className="p55-colour-key">{Object.entries(BID_MODULE_COLORS_0550).map(([key,c])=><div key={key} className="p55-owner-key" style={{"--bid-accent":c.accent,"--bid-tint":c.tint}}><strong>{c.label}</strong></div>)}</div><p>สีแถบหัว module และแท็บบอกขั้นตอนงาน; หัวข้อย่อยในขั้นตอนเดียวกันใช้สีต่อเนื่อง แท็บที่เลือกใช้พื้นเข้ม ส่วนแท็บอื่นใช้พื้นอ่อน สีในกลุ่ม A/B/C และแถวราคาบอกเจ้าของต้นทุนตามคู่มือด้านล่าง</p><p>หัวกลุ่ม → หัวข้อย่อย → ตาราง → แถว → ยอดรวม ใช้สีต่อเนื่องตามหมวดที่กำลังแสดง; อ่านรหัสหมวดควบคู่เสมอ เพราะสีอาจใช้ซ้ำ สีไม่แปลว่าผ่านอนุมัติ สถานะ OPEN / STALE / HOLD แสดงเป็นข้อความ</p><p>Customer row อาจรวมหลายเจ้าของ WBS: หัว Lot ที่มีเจ้าของเดียวใช้สีเดียวกับต้นทาง; หากรวมหลายเจ้าของใช้สี Part A/B/C ส่วนแถวย่อยคงสีเจ้าของต้นทาง สีภายในไม่เปลี่ยนแบบ Excel ลูกค้า</p><div className="p55-colour-key">{BID_GROUPS_0550.map(g=><div key={g.code} className="p55-owner-key" style={bidOwnerStyle(g.code)}><strong>{g.number} · {g.code}</strong><span>{g.title}</span></div>)}</div></details>
 <p>OFF-03 / HIS-01 เป็นบริบทข้อมูล ไม่ใช่ลำดับหัวข้อ · 10.O / 10.H ในทะเบียนเป็นรหัสบริบทเดิม · ขั้นตอน WP.P / WP.1–WP.8 อยู่ภายใน 10.2</p>
 <p>เลขรายการ R01/R02 เป็นลำดับแสดงผลและอาจเปลี่ยนเมื่อจัดรายการใหม่; ใช้ Copy ID อ้างอิงแถวเดิมเสมอ · ชื่อสั้น HIS-01/RFQ-02/OFF-03/REL-04 ไม่แทนเลขหัวข้อหรือ Module ID</p>
 </details>;
}
