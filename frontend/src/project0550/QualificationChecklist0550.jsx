import React from 'react';
import {QUALIFICATIONS_0550} from './data/bidVolumes0550';
const guidance={
 '1':'ใบอนุญาต/หนังสือจดทะเบียนของ BIDDER พร้อมนิติบุคคลและอายุเอกสาร',
 '2':'งบการเงินของ BIDDER ย้อนหลัง 3 ปี ระบุปีและเอกสารแนบแต่ละปี',
 '3':'ผลงานในประเทศที่ใกล้เคียง พร้อมขอบเขตและหนังสือรับรองจากผู้ใช้งาน',
 '4':'ผลงานต่างประเทศที่ใกล้เคียง พร้อมขอบเขตและหนังสือรับรองจากผู้ใช้งาน',
 '5':'ใบอนุญาตผลิตของผู้ผลิตที่เกี่ยวข้อง หรือเหตุผล N/A ที่มีหลักฐาน',
 '6':'หนังสือแต่งตั้งตัวแทนตรงผู้ขาย/ผู้ผลิตและขอบเขตเสนอ หรือเหตุผล N/A ที่มีหลักฐาน',
 '7':'ใบรับรอง ISO9001 ระบุนิติบุคคล ขอบเขต และวันหมดอายุ',
 '8':'สถานที่ บุคลากรและขอบเขต technical support ในไทย/เมียนมา พร้อมหลักฐาน',
 '9':'คุณสมบัติอื่นที่ใช้ประกอบข้อเสนอตาม applicability และหลักฐาน',
 '10':'คำรับรอง AVL ตามผู้ผลิตที่เลือกจริง และอ้าง Deviation ของรายการนอก AVL',
 '11':'รายการ Commercial Deviation ปัจจุบัน หรือข้อสรุปไม่มีข้อแตกต่างที่ผ่านการทบทวนพร้อมหลักฐาน'
};
export function QualificationChecklist0550({view,onOpen}){
 return <section><h3>13.0 · เอกสารคุณสมบัติ BIDDER ที่ต้องยื่น</h3><p>หลักฐานของ Supplier และคุณสมบัติของ SAMTEL ต้องระบุเจ้าของให้ตรงกัน · ลิงก์ต้นทางหรือข้อความใน MR ไม่ใช่ใบรับรองโดยตัวเอง</p><div className="p55-table-wrap"><table className="p55-table" aria-label="Bidder qualification checklist"><thead><tr><th>อ้างอิง</th><th>เอกสาร / สิ่งที่ต้องตรวจ</th><th>คำตอบ / หลักฐานที่ผูกไว้</th><th>สถานะ / เปิด</th></tr></thead><tbody>{QUALIFICATIONS_0550.map(q=>{const r=view.getRecord('III.'+q.id);return <tr key={q.id}><th>13.{q.id}</th><td>{q.title}<small>{guidance[q.id]}</small></td><td>{r.content||'OPEN · ยังไม่มีคำตอบ/เอกสารแนบที่บันทึก'}<small>{r.sourceIds.join(' / ')||'EVIDENCE OPEN'}</small></td><td>{r.state}<button type="button" onClick={()=>onOpen(q.id)}>เปิด 13.{q.id}</button></td></tr>;})}</tbody></table></div></section>;
}
export function QualificationResponse0550({record,data,onNavigate}){
 return <article aria-label="Qualification response document"><p><strong>{record.state}</strong> · Owner: {record.owner||'OPEN'} · {record.disposition}</p><p className="p55-technical-response">{record.content||'OPEN · ยังไม่ได้บันทึกคำตอบและหลักฐานของ BIDDER สำหรับหัวข้อนี้'}</p><p>{record.reason}</p><p>ตำแหน่งหลักฐาน: {record.locator||'OPEN'}</p><ul>{record.sourceIds.map(id=>{const source=data.sourceIntake?.sources?.find(s=>s.id===id);return <li key={id}><button type="button" onClick={()=>onNavigate('bid.documents.source.'+id)}>{source?.title||id}</button> · {source?.revision||'REV OPEN'} · {source?.readState||'MISSING'} / {source?.authority||'OPEN'}</li>;})}</ul><p>ต้องทบทวน: {record.problems.join(' / ')||'ไม่มีปัญหาในแบบจำลองร่าง · การอนุมัติส่งแยกต่างหาก'}</p></article>;
}
