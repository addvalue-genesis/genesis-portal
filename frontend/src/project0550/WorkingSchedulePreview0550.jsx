import React,{useState} from 'react';
import {MgwOfferTable} from './MgwQuoteViews';

const money=v=>Number.isFinite(v)?v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'OPEN';
export function WorkingScheduleStatus0550({view,onSave,onAllocate,onNavigate,disabled}){
 const s=view.previewStats;if(!s)return null;
 return <section className="p55-panel" aria-label="Working to Schedule status"><h3>ข้อมูลจาก Working → แบบฟอร์มข้อเสนอ</h3>
  <p>เลือกไว้ {s.active} รายการ · มีการจัดหมวดที่บันทึกแล้ว {s.saved} · ระบบแนะนำเพิ่ม {s.suggested} · ยังตัดสินใจไม่ได้ {s.unresolved}</p>
  <p><strong>ราคาขายที่คำนวณได้ USD {money(s.knownUSD)} จาก {s.priced} รายการ</strong> · อีก {s.unpriced} รายการราคายัง OPEN · ยอดที่ทราบนี้ยังไม่ใช่ราคาครบทั้งโครงการ</p>
  <p>รายการและราคามาจาก Working ปัจจุบัน รวมราคาผู้ขายที่ยังรอทบทวน · การจัดหมวดอัตโนมัติเป็นข้อเสนอของ SI · ยังไม่อนุมัติหรือออก Release</p>
  <div className="p55-review-toolbar"><button type="button" disabled={disabled||!s.suggested} onClick={onSave}>บันทึกการจัดหมวดร่าง {s.suggested} รายการ</button><button type="button" disabled={disabled} onClick={onAllocate}>ตรวจ / แก้การจัดรายการ 11.M</button></div>
  {view.priceGaps?.length>0&&<details><summary>ดูสาเหตุที่ราคาขายยัง OPEN · {view.priceGaps.length} รายการ</summary>{view.priceGaps.map(g=><p key={g.id}>{g.description} · {g.problems.join(' / ')} <button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.line.'+g.id)}>เปิด Working / แก้ที่ต้นทาง</button></p>)}</details>}
 </section>;
}
export function MgwScheduleSource0550({view,onNavigate,disabled}){
 const sections=view.mgwSections||[],[selected,setSelected]=useState('');
 const section=sections.find(s=>s.id===selected)||sections.find(s=>s.status==='TOTAL_CONFLICT')||sections[0];
 if(!section)return null;
 return <section className="p55-panel" aria-label="MGW source details for Schedule C1"><h3>MGW ที่ใช้ประกอบ C1 · ข้อมูลต้นทางภายใน</h3>
  <label>ระบบ MGW ใน C1 <select aria-label="MGW system in C1" disabled={disabled} value={section.id} onChange={e=>setSelected(e.target.value)}>{sections.map(s=><option key={s.id} value={s.id}>{s.title} · {s.offers.length} รายการ</option>)}</select></label>
  <p><strong>{section.title} · {section.offers.length} รายการจากใบเสนอราคา</strong> · ต้นทุน MGW / จำนวนตาม Quote · ตรวจ MR และราคาขาย Working แยกกัน</p>
  {section.status==='TOTAL_CONFLICT'&&<p>หน้าสรุป USD {money(section.coverTotal)} · รายละเอียดต้นฉบับ USD {money(section.detailTotal)} · แนวทางที่บันทึก 29 ต.ค. 2026 ใช้รายละเอียดในการเตรียมร่าง พร้อมเก็บประเด็นยอดต้นฉบับ</p>}
  {section.workingOwners?.map(owner=><p key={owner.id}>{owner.title} · {owner.selected?'เลือกใช้ใน Working แล้ว':'เป็นทางเลือก / ยังไม่รวมในราคาที่เลือก'} <button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.line.'+owner.id)}>เปิดแพ็กเกจใน Working</button></p>)}
  <p>ตารางต้นทุนนี้ใช้ภายใน · Word/PDF ของแบบฟอร์มส่งออกเฉพาะราคาขายและรายการประกอบที่ไม่คิดซ้ำ</p>
  <div style={{maxHeight:360,overflow:'auto'}}><MgwOfferTable showIds={false} offers={section.offers} onEdit={o=>{if(!disabled)onNavigate?.('bid.vendor.offer.'+o.id);}}/></div>
 </section>;
}
