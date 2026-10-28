import React from "react";
import {COMMERCIAL_POLICY,CORE_TEAM,DATA_LAYER_META,PROJECT_0550,SERVICE_EQUATIONS} from "./data";
import {useBidWorkspace} from "./BidWorkspaceContext";
export function BidInheritedBasis({onNavigate}) {
 const {data}=useBidWorkspace();
 return <div className="p55-inherited-basis">
 <h3>ค่าเริ่มต้นและวิธีคิดจาก 01–08</h3>
 <p>ใช้ฐานเดิมกับรายการใหม่ผ่านตัวเลือกใน Working editor · ค่าที่บันทึกไว้แล้วคงเดิม · ค่าเฉพาะ Quote ใช้สกุลเงินและหน่วยของ Quote · ฐานอ้างอิง {DATA_LAYER_META.snapshotDate}</p>
 <div className="p55-table-wrap"><table className="p55-table" aria-label="Inherited project basis"><thead><tr><th>ฐาน</th><th>ค่าหรือวิธีคิดที่มีอยู่</th><th>นำไปใช้</th></tr></thead><tbody>
 <tr><td>Currency</td><td>Working / Budget: THB · Customer form: USD · Vendor: ตามใบเสนอราคา</td><td>FX รอบนี้: {data?.fx?.thbPerUSD??"OPEN"} THB/USD · {data?.fx?.date||"วันที่ OPEN"} · {data?.fx?.source||"แหล่งอ้างอิง OPEN"}</td></tr>
 <tr><td>01 · FX อ้างอิงเดิม</td><td>{PROJECT_0550.fxThbUsd} THB/USD · {PROJECT_0550.priceDate}</td><td>Snapshot เดิม; ตรวจเลือกก่อนบันทึกเป็น FX รอบนี้</td></tr>
 {COMMERCIAL_POLICY.map(p=><tr key={p.title}><td>{p.title}</td><td>{p.formula}</td><td>{p.state} · เลือกใช้ฐานใน editor; ยังต้อง review รอบนี้</td></tr>)}
 <tr><td>02 · สมการและ Inputs</td><td>{SERVICE_EQUATIONS.map(e=>e.id).join(" / ")}</td><td>เลือกผลที่บันทึกไว้เป็น Quantity / MH / MD โดยอ้าง Calculation ID</td></tr>
 <tr><td>06 · Resource rates</td><td>{CORE_TEAM.length} บทบาท · ADDVALUE selling rate เป็น USD/MD</td><td>เลือกบทบาทใน editor; ไม่ใช้เรตขายแทนต้นทุน</td></tr>
 </tbody></table></div>
 {onNavigate&&<div className="p55-review-toolbar">{[["bid.engineering.equations","02 สมการ / Inputs"],["bid.architecture","03 Architecture"],["bid.systems","04 ขอบเขตระบบ"],["bid.execution.core-team-continuity","06 Resource rates"],["bid.vendor.offers","07 Vendor quotes"],["bid.risk","08 Risk / Gates"]].map(([id,label])=><button type="button" key={id} onClick={()=>onNavigate(id)}>{label}</button>)}</div>}
 </div>;
}
