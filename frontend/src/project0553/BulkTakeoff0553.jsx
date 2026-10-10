import React from "react";
import {BULK_TAKEOFF_0553,BULK_TAKEOFF_POLICY_0553} from "./data/bulkTakeoff0553";
export function BulkTakeoff0553(){
 return <section className="p55-panel">
  <div className="p55-eyebrow">L3.B / 05 ENGINEERING → 10 COST · SOURCE DRIVEN</div>
  <h3>Bulk, Enclosure & ATEX JB — Engineering Take-off</h3>
  <p className="p55-note">แยก SCADA Enclosure, DMR LNA Enclosure และ ATEX Telephone JB ชัดเจน — ปริมาณ/ราคาที่ยังไม่มีหลักฐานเว้นว่าง ไม่ถือเป็นศูนย์ หรือรวมเข้า Rev08</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>MR</th><th>Category</th><th>Required candidate</th><th>Quantity basis / Source</th><th>Qty</th><th>Unit Cost</th></tr></thead><tbody>
   {BULK_TAKEOFF_0553.map((r,i)=><tr key={i}><td>{r.mr}</td><td><strong>{r.category}</strong></td><td>{r.item}<small>{r.note}</small></td><td>{r.driver}<small>{r.source}</small></td><td>{r.qty??""} {r.qty===null?"":r.unit}</td><td>{r.rate===null?"":r.rate+" "+r.currency}</td></tr>)}
  </tbody></table></div>
  <p className="p55-note"><strong>Calculation:</strong> {BULK_TAKEOFF_POLICY_0553.quantityFormula}. Original vendor quotation conditions must travel with each accepted rate. Drawing/BLD/LAY verification required before final quantity/cost.</p>
 </section>;
}
