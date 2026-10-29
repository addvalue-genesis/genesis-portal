import React,{useState} from "react";
import {SUBVENDOR_REFERENCE_0550,groupedSubvendors0550} from "./data/subvendorReference0550";

export function SubvendorReference0550({onPrepare}){
 const [showOriginal,setShowOriginal]=useState(false),catalog=SUBVENDOR_REFERENCE_0550;
 const groups=groupedSubvendors0550();
 const rows=showOriginal?catalog.rows.map(row=>({...row,sourceRows:[row.sourceRow]})):groups;
 return <section className="p55-subvendor-reference" aria-label="Subcontractors and sub-vendors source reference">
  <h3>List of Subcontractors / Sub-vendors</h3>
  <p><strong>By Vendor · รายการผู้ผลิตที่เสนอ</strong> · ต้นทาง {catalog.rows.length} แถว / {groups.length} รายการไม่ซ้ำ · เก็บคู่ซ้ำพร้อมเลขแถวเดิม</p>
  <p>ต้นทาง: {catalog.source.name} · หน้า 1 ตาราง 1 · ไม่ระบุ revision หรือรหัสโครงการ · ตรวจความเกี่ยวข้องกับ 0550 และ AVL ลูกค้าก่อนเลือกใช้</p>
  <p>Make &amp; Model ว่างทุกแถว ส่วน Country of Origin เป็นข้อความที่ระบุในเอกสาร ยังต้องตรวจประเทศของสินค้าที่เสนอจริง</p>
  <label><input type="checkbox" checked={showOriginal} onChange={e=>setShowOriginal(e.target.checked)}/> แสดงต้นฉบับทั้ง 10 แถว</label>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Subcontractors and sub-vendors declared list">
   <thead><tr>{catalog.columns.map(column=><th key={column}>{column}</th>)}<th>Source rows / Review</th><th>ทำงานต่อ</th></tr></thead>
   <tbody>{rows.map(row=><tr key={row.id} data-subvendor-row={row.id}>
    <td>{row.discipline}</td><td>{row.group}</td><td>{row.subGroup}</td><td>{row.itemDescription}</td><td>{row.vendor}</td><td>{row.makeModel||"OPEN · ไม่ระบุรุ่น"}</td><td>{row.countryOfOrigin}{row.countryOfOrigin==="ISARAEL"&&<small>สะกดตามต้นฉบับ · รอตรวจยืนยัน</small>}</td>
    <td>หน้า 1 · แถว {row.sourceRows.join(", ")}<small>Applicability / Customer AVL: OPEN</small></td>
    <td><button type="button" onClick={()=>onPrepare(row.id)}>ใช้เป็นร่างตรวจ AVL</button></td>
   </tr>)}</tbody>
  </table></div>
 </section>;
}
