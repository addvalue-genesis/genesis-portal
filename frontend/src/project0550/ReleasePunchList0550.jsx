import React,{useState} from 'react';
import {BidPunch0550} from './BidPunch0550';
export function ReleasePunchList0550({punch,onNavigate,onOpenSource=onNavigate}){
 const [open,setOpen]=useState(false);
 return <div className="p55-release-punch" aria-label="Release stages and punch list">
  <p>10.7 ใช้ต้นเหตุและแผน Punch ชุดเดียวกับ WP.8 · รายการตรวจเดิม {punch.backlog.length} ระเบียนยังอยู่ครบใน Export Internal Release Review · จำนวนต้นเหตุที่รวมแล้วไม่ใช่จำนวนข้อผิดพลาดหรือเปอร์เซ็นต์ความครบ</p>
  <p>{punch.authorization.ready?'ผ่านตรวจความพร้อมแล้ว · ตรวจอนุมัติ/ตรึงฉบับและหลักฐานการส่งต่อ':'HOLD ขวางการอนุมัติและตรึงฉบับ'} · ยังทำราคา Working และตรวจ Draft ต่อได้ · บันทึกแผนจัดการได้ที่นี่หรือ WP.8 โดยใช้ข้อมูลชุดเดียวกัน</p>
  <BidPunch0550 showStages providedView={punch.common} onNavigate={onNavigate} onOpenSource={onOpenSource}/>
  <details onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}><summary>เงื่อนไข Release ตามระบบเดิม · {punch.gateRows.length} รายการตรวจ · ไม่ใช่งานเพิ่ม</summary>{open&&<ul data-release-raw-gates>{punch.gateRows.map(g=><li key={g.code}>{g.code}</li>)}</ul>}</details>
 </div>;
}
