import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {buildReleaseCommercialModel0553} from "./data/releaseCommercialModel0553";
import "./releaseWorkbook0553.css";
const cash=value=>Number.isFinite(value)?"THB "+value.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
function Stat({label,amount,detail}){return <div className="p553-cfo-stat">
 <small>{label}</small><strong>{cash(amount)}</strong><span>{detail}</span></div>;}
export function PricingCfoDashboard0553({model=null,thbPerUsd=null}){
 const data=model||buildReleaseCommercialModel0553({thbPerUsd}),s=data.summary;
 return <section className="p55-panel p553-release-dash" data-component-key="bid.budget.pricing.cfo">
  <div className="p55-eyebrow">10.3 · INTERNAL CFO DASHBOARD <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.pricing.cfo"/></div>
  <h3>ราคาที่ลูกค้าเห็น · SAMTEL · ADDVALUE · Reserve</h3>
  <p className="p55-note"><strong>PROVISIONAL / NOT FOR SUBMISSION.</strong> ตัวเลขที่มีเป็นส่วนที่มีหลักฐานราคา Working เท่านั้น ไม่ใช่ยอดรวมโครงการ ไม่ใช้ Historical เป็น Direct Cost และยังไม่คำนวณกำไรสุทธิทั้งโครงการจนกว่า Direct Cost จะครบ</p>
  <div className="p553-cfo-grid">
   <Stat label="A · ราคาลูกค้า (Priced floor only)" amount={s.aProvisionalCustomerSellTHB} detail="10.1 Cost × 1.30 · incomplete TAG/rates excluded"/>
   <Stat label="B · ราคาลูกค้า (Working Sell)" amount={s.bProvisionalCustomerSellTHB} detail="10.2 B1–B14 · C options excluded"/>
   <Stat label="B · SAMTEL หัก 5%" amount={s.bProvisionalSamTelDeductionTHB} detail="หักจาก B Working Sell ไม่เพิ่มราคาที่ลูกค้าเห็น"/>
   <Stat label="B · ADDVALUE ได้รับก่อนหักต้นทุน" amount={s.bProvisionalNetReceivableTHB} detail="B Customer Sell − SAMTEL 5%"/>
   <Stat label="A · SAMTEL 20% ของต้นทุน" amount={s.aProvisionalSamTelShareTHB} detail="ไม่ใช่ 20% ของราคาขาย"/>
   <Stat label="A · ADDVALUE เป้ากำไร 5%" amount={s.aProvisionalAddvalueTargetProfitTHB} detail="ยังไม่รวม 5% Reserve"/>
   <Stat label="A · ADDVALUE Reserve 5%" amount={s.aProvisionalReserveTHB} detail="สำรองตกหล่น แยกจากกำไร"/>
   <Stat label="กำไรสุทธิ ADDVALUE ทั้งโครงการ" amount={s.addvalueRealizedProfitTHB} detail="PENDING VERIFIED B/C DIRECT COST + FINAL A COST"/>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Scope</th><th>Customer Price THB</th><th>SAMTEL</th><th>ADDVALUE</th><th>Cost / Gate</th></tr></thead>
   <tbody>
    <tr><td><strong>A — Base Equipment</strong><small>10.1 / bid.budget.bom.system-location-mto</small></td><td>{cash(s.aProvisionalCustomerSellTHB)}</td><td>{cash(s.aProvisionalSamTelShareTHB)}</td><td>5% target + 5% reserve; each based on Cost</td><td>{data.sourceCoverage.aReady?"Engineering working complete; approval pending":"PARTIAL — unresolved TAG/rates/FX"}</td></tr>
    <tr><td><strong>B — Base Services</strong><small>10.2 / bid.budget.working.bc</small></td><td>{cash(s.bProvisionalCustomerSellTHB)}</td><td>{cash(s.bProvisionalSamTelDeductionTHB)}</td><td>{cash(s.bProvisionalNetReceivableTHB)} before actual cost</td><td>{data.sourceCoverage.bCostReady?"Direct cost recorded":"Direct Cost NOT established for all B"}</td></tr>
    <tr><td><strong>C — Optional Spares</strong><small>10.2 / bid.budget.working.bc.c1,c2</small></td><td>{cash(s.cOptionalCustomerSellTHB)}</td><td>20% of verified Cost</td><td>5% target + 5% reserve</td><td>{data.sourceCoverage.cCostReady?"Optional cost established":"DO NOT markup C Working Sell by 30%"}</td></tr>
    <tr><td><strong>Base A+B</strong></td><td><strong>{cash(s.baseCustomerSellTHB)}</strong></td><td>—</td><td>—</td><td>{s.baseCustomerSellTHB===null?"HOLD — A cost and B basis not fully reconciled":"Not approved; final snapshot still required"}</td></tr>
   </tbody></table></div>
  <details><summary>ตรวจเงื่อนไขความพร้อม / Source Coverage ({data.sourceCoverage.gaps.length})</summary>
   <ul>{data.sourceCoverage.gaps.map((reason,i)=><li key={i}>{reason}</li>)}</ul>
  </details>
 </section>;
}
