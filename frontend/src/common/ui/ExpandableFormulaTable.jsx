import React,{useMemo,useState} from "react";
// Presentation-only taxonomy: never changes canonical formula IDs/equations.
const TITLES={
 "RF-PROP":["01","RF / การแพร่กระจายคลื่น","RF Propagation · ระยะส่ง / กำลัง / สายอากาศ"],
 "ACOUSTIC":["02","เสียงและระบบ PAGA","Acoustic · ระดับเสียงและการครอบคลุม"],
 "OPTICAL":["03","Fiber Optic / สายใยแก้ว","Optical · การสูญเสียและระยะสาย"],
 "POWER":["04","ไฟฟ้าและกำลังไฟ","Electrical / Power · แรงดัน / โหลด"],
 "VIDEO":["05","CCTV / วิดีโอ","Video · ภาพ / พื้นที่ครอบคลุม"],
 "NET-CAP":["06","Network / Capacity","Bandwidth · ปริมาณข้อมูล"],
 "RELIABILITY":["07","ความพร้อมใช้งานและระบบสำรอง","Reliability · Availability / Redundancy"],
 "MECH":["08","โครงสร้างและงานติดตั้ง","Mechanical · แรง / การติดตั้ง"],
 "SERVICE_COST":["09","บริการและต้นทุนโครงการ","Service / Cost · MH / Rate / Price"]
};
const STATUS={
 EXECUTABLE_PRELIMINARY:["คำนวณเบื้องต้นได้","มี Function บางส่วน ต้องยืนยันข้อมูลโครงการ"],
 EXECUTABLE_PARTIAL:["คำนวณได้บางส่วน","ยังไม่ครบ Engineering-to-Price"],
 FORMULA_ONLY:["มีสมการ","ยังไม่ได้ผูก Function ใช้งานเต็มรูปแบบ"]
};
export function ExpandableFormulaTable({rows=[]}){
 const groups=useMemo(()=>[...new Set(rows.map(x=>x.domain))].map((domain,i)=>({domain,items:rows.filter(x=>x.domain===domain),title:TITLES[domain]||[String(i+1).padStart(2,"0"),domain,"Engineering equation group"]})),[rows]);
 const [expanded,setExpanded]=useState(new Set());
 const [details,setDetails]=useState(new Set());
 const toggle=(id,set)=>set(old=>{const n=new Set(old);n.has(id)?n.delete(id):n.add(id);return n;});
 const expandAll=()=>setExpanded(new Set(groups.map(x=>x.domain)));
 const collapseAll=()=>{setExpanded(new Set());setDetails(new Set());};
 const groupsOpen=groups.filter(g=>expanded.has(g.domain)).length;
 return <section aria-label="Formula coverage hierarchy">
  <div className="p55-formula-toolbar">
   <div><strong>หมวดหลัก {groups.length} หมวด · สมการ {rows.length} รายการ</strong><small>เลือก <b>＋</b> ที่หมวดเพื่อดูสมการ และเลือก <b>＋</b> ที่สมการเพื่อดูคำอธิบาย / ที่มา / เงื่อนไข</small></div>
   <div className="p55-formula-actions"><button type="button" onClick={expandAll}>แสดงทุกหมวด</button><button type="button" onClick={collapseAll}>ยุบทั้งหมด</button></div>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget p55-formula-table">
   <thead><tr><th style={{width:"8%"}}>เปิด/ปิด</th><th style={{width:"37%"}}>หมวดวิชา / หัวข้อสมการ</th><th>สมการ / หลักการ</th><th style={{width:"19%"}}>สถานะ</th></tr></thead>
   <tbody>{groups.map(group=><React.Fragment key={group.domain}>
    <tr className="p55-formula-group">
     <td><button type="button" className="p55-row-toggle" aria-label={(expanded.has(group.domain)?"ยุบ ":"ขยาย ")+group.title[1]} aria-expanded={expanded.has(group.domain)} onClick={()=>toggle(group.domain,setExpanded)}>{expanded.has(group.domain)?"−":"+"}</button></td>
     <td><strong>{group.title[0]}. {group.title[1]}</strong><small>{group.domain} · {group.title[2]}</small></td>
     <td><span className="p55-formula-count">{group.items.length} สมการย่อย</span></td>
     <td><span className="p55-formula-category">หมวดหลัก</span></td>
    </tr>
    {expanded.has(group.domain)&&group.items.map((eq,i)=><React.Fragment key={eq.id}>
     <tr className="p55-formula-item">
      <td><button type="button" className="p55-row-toggle" aria-label={(details.has(eq.id)?"ยุบ ":"ขยาย ")+eq.name} aria-expanded={details.has(eq.id)} onClick={()=>toggle(eq.id,setDetails)}>{details.has(eq.id)?"−":"+"}</button></td>
      <td><strong className="p55-formula-subtitle">↳ {group.title[0]}.{String(i+1).padStart(2,"0")} {eq.name}</strong><small>Formula ID: {eq.id}</small></td>
      <td><code className="p55-formula-expression">{eq.formula}</code></td>
      <td><span className="p55-formula-state">{(STATUS[eq.implementationState]||[eq.implementationState])[0]}</span><small>{(STATUS[eq.implementationState]||[])[1]}</small></td>
     </tr>
     {details.has(eq.id)&&<tr className="p55-formula-detail"><td></td><td colSpan={3}>
       <div className="p55-formula-detail-title">รายละเอียดสมการ {eq.id} — {eq.name}</div>
       <dl className="p55-formula-dl"><dt>ใช้ทำอะไร</dt><dd>{eq.role||"ไม่มีคำอธิบายใน Registry"}</dd>
        <dt>ไฟล์ต้นทาง</dt><dd><code>{eq.source}</code></dd>
        <dt>เงื่อนไขควบคุม</dt><dd>{eq.controls?.length?<ul>{eq.controls.map((c,j)=><li key={j}>{c}</li>)}</ul>:"ไม่ระบุ"}</dd>
        <dt>ผลลัพธ์ที่คาดหวัง</dt><dd>{eq.output||"ไม่ระบุ"}</dd></dl>
       <small>สถานะสมการไม่ใช่การยืนยันว่าผลคำนวณของโครงการผ่าน OEM/มาตรฐานแล้ว</small>
     </td></tr>}
    </React.Fragment>)}
   </React.Fragment>)}</tbody>
  </table></div>
  <p className="p55-note">กำลังแสดง {groupsOpen} จาก {groups.length} หมวด · ข้อมูลสูตรและสถานะอ้างอิง Registry เดิมโดยตรง</p>
 </section>;
}
