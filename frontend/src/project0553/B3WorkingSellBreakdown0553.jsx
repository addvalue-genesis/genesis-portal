import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB3WorkingSellBreakdown0553} from "./data/b3WorkingSellBreakdown0553";
const cash=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
export function B3WorkingSellBreakdown0553({workingRow}){
 const m=selectB3WorkingSellBreakdown0553(workingRow);
 if(!m)return null;
 return <section className="p55-panel" data-component-key={m.moduleId} style={{padding:12,marginTop:12}}>
  <h4>B3 — Current Working SELL Breakdown · {cash(m.totalWorkingSellTHB)}</h4>
  <p className="p55-note"><strong>Module ID:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={m.moduleId}/> · <strong>Parent Cost Owner:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={m.ownerModuleId}/></p>
  <p className="p55-note"><strong>กำลังคน 40 วันในฐานราคาขาย SAT/SIT เดิม (ไม่ใช่กำหนดการไปทำงานจริง):</strong> {m.offshore.people} คนทำงานเป็นทีมเดียวกัน × {m.offshore.workdays} วันทำงาน = <strong>{m.offshore.personDays} Man-days</strong> (ไม่ใช่ 40 วันต่อระบบ MR). อัตรา USD {m.offshore.rateUSD}/คน/วัน × FX {m.offshore.workingFx} = {cash(m.offshore.laborWorkingSellTHB)} ค่าแรง. แจกแจงวันและราคาต่อ Site อยู่ที่ <code>bid.budget.working.bc.b3.site-mr-sat-matrix</code>.</p>
  <p className="p55-note"><strong>ตรวจตาม BOD/SPE:</strong>
   BOD Rev.C2 §8 มีผล BF survey ที่ ZPQ, ZWP8 และ ZWP11 อยู่แล้ว;
   SPE Rev.C2 §7.3.2 แยก GF SAT ที่ JUTAL Zhuhai Fabrication Yard,
   และ §7.3.3 แยก GF Offshore Commissioning หลังติดตั้ง.
   <strong>40 team-days / 80 MD เป็นฐาน Working SELL เดิม ไม่ใช่จำนวนวันเดินทางที่อนุมัติ.</strong>
   GF Yard/Offshore ADDVALUE people/days และ BF revisit ยังไม่มีอนุมัติหรือ Verified Direct Cost.</p>
  <p className="p55-note"><strong>ราคาใน B3 นี้เป็น Working SELL ไม่ใช่ Direct Cost.</strong> B3 ครอบคลุม MGW Purchased iFAT/Facility (ต้นทุนซื้อ × 20% SAMTEL + 5% ADDVALUE + 5% Reserve), ADDVALUE China FAT witnesses, Offshore SAT/SIT 40 workdays และ VeEX rental. ตาราง Contract Requirement กับ Site-MR SAT เป็นเอกสาร Coverage/Verification แยกต่างหาก ไม่คิดราคาบวกเพิ่ม.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Current B3 Cost Owner / Copy ID</th><th>Price driver / Quantity</th><th>Working SELL (THB)</th><th>Pricing / Source status</th></tr></thead>
   <tbody>{m.summary.map(x=><tr key={x.id} data-component-key={m.moduleId+".component-preview."+x.id.toLowerCase()}>
    <td><strong>{x.activity}</strong><ComponentCopyId projectId="PJ2608-0553" componentKey={x.moduleId}/></td>
    <td>{x.driver}</td><td><strong>{cash(x.workingSellTHB)}</strong></td><td>ALREADY INCLUDED IN B3 — DO NOT ADD AGAIN</td>
   </tr>)}
   <tr><td colSpan={2}><strong>B3 — Inspection, Testing and Certification / Total Working SELL</strong></td><td><strong>{cash(m.totalWorkingSellTHB)}</strong></td><td>DIRECT COST NOT ESTABLISHED · RELEASE HOLD</td></tr>
   </tbody></table></div>
  <details className="p55-panel" style={{padding:10,marginTop:12}}>
   <summary><strong>MGW China FAT Witness — Eight source-priced expense lines ({cash(m.fat.workingSellTHB)})</strong></summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Expense / Module ID</th><th>Qty / Unit</th><th>Working SELL Unit THB</th><th>Working SELL THB</th><th>Source/Status</th></tr></thead>
    <tbody>{m.fat.rows.map(x=><tr key={x.id} data-component-key={m.moduleId+".fat-expense-preview."+x.id.toLowerCase()}>
     <td><strong>{x.description}</strong><ComponentCopyId projectId="PJ2608-0553" componentKey={x.moduleId}/></td>
     <td>{x.qty} {x.unit}</td><td>{cash(x.unitRateTHB)}</td><td>{cash(x.workingSellTHB)}</td><td>{x.status}<small>{x.evidence}</small></td>
    </tr>)}
    <tr><td colSpan={3}><strong>FAT China base · B3 only</strong></td><td><strong>{cash(m.fat.workingSellTHB)}</strong></td><td>MGW purchased services selected separately in B3.1.1; no B9 FAT duplication</td></tr>
    </tbody></table></div>
  </details>
  <p className="p55-note"><strong>Scope / Commercial exclusions:</strong> {m.excluded.join(" · ")}. Retained site/SIT PRICE-ONLY allocation appears separately under <code>bid.budget.working.bc.b3.site-mr-sat-matrix</code>. Source values are read-only mirrors of the CURRENT selected B3 Working SELL. Purchased quote is priced once in B3.1; Direct Cost paid invoice and Customer Release remain unverified.</p>
 </section>;
}
