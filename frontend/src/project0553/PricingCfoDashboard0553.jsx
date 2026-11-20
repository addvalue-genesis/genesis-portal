import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {buildReleaseCommercialModel0553} from "./data/releaseCommercialModel0553";
import "./releaseWorkbook0553.css";

// 10.3 CFO is intentionally TABLE FIRST: no KPI tiles and no bullet lists.
// Missing actual costs stay null; B net receivable MUST NOT be labeled profit.
const money=x=>Number.isFinite(x)?x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const subtract=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)?round(a-b):null;
const plus=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)?round(a+b):null;
const allAmount=(rows,key)=>rows.length&&rows.every(x=>Number.isFinite(x[key]))?
 round(rows.reduce((n,x)=>n+x[key],0)):null;

const riskModule=reason=>{
 const prefix=String(reason).match(/^(A[1-5]|B(?:1[0-4]|[1-9])|C[12])\b/);
 if(prefix){
  const code=prefix[1];
  return code.startsWith("A")?"10.1 · bid.budget.bom.system-location-mto":
   "10.2 · bid.budget.working.bc."+code.toLowerCase();
 }
 return "10.3 · bid.budget.pricing";
};

function Currency({value}){return <span className="p553-cfo-number">{money(value)}</span>;}
function CfoRow({label,source,cost,customer,samtel,receivable,profit,reserve,state,subtotal=false}){
 return <tr className={subtotal?"p553-cfo-subtotal":""}>
  <th scope="row"><strong>{label}</strong><small>{source}</small></th>
  <td><Currency value={cost}/></td>
  <td><Currency value={customer}/></td>
  <td><Currency value={samtel}/></td>
  <td><Currency value={receivable}/></td>
  <td><Currency value={profit}/></td>
  <td><Currency value={reserve}/></td>
  <td className="p553-cfo-state">{state}</td>
 </tr>;
}

export function PricingCfoDashboard0553({model=null,thbPerUsd=null}){
 const data=model||buildReleaseCommercialModel0553({thbPerUsd}),s=data.summary;
 const optional=data.c;
 const cCost=allAmount(optional,"verifiedDirectCostTHB");
 const cPrice=s.cOptionalCustomerSellTHB;
 const cSamTel=allAmount(optional,"samTelShareTHB");
 const cProfit=allAmount(optional,"addvalueTargetProfitTHB");
 const cReserve=allAmount(optional,"reserveTHB");
 const aAfterSamTel=subtract(s.aProvisionalCustomerSellTHB,s.aProvisionalSamTelShareTHB);
 const cAfterSamTel=subtract(cPrice,cSamTel);
 // Known-price A+B SUBTOTAL, explicitly incomplete. Never publish as final client price.
 const preliminaryBase=plus(s.aProvisionalCustomerSellTHB,s.bProvisionalCustomerSellTHB);
 const preliminarySamTel=plus(s.aProvisionalSamTelShareTHB,s.bProvisionalSamTelDeductionTHB);
 const preliminaryReceivable=plus(aAfterSamTel,s.bProvisionalNetReceivableTHB);
 return <section className="p55-panel p553-release-dash" data-component-key="bid.budget.pricing.cfo">
  <div className="p55-eyebrow">10.3 — INTERNAL CFO PRICING TABLE <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.pricing.cfo"/></div>
  <h3>สรุปต้นทุน · ราคาลูกค้า · ส่วนแบ่ง SAMTEL · กำไร ADDVALUE</h3>
  <p className="p55-note"><strong>WORKING / ยังไม่ใช่ราคาเสนอที่อนุมัติ</strong> · สกุลเงิน THB · ตารางนี้แสดงยอด A ที่มีต้นทุน Working แล้วบางส่วน และยอด B Working Sell จาก 10.2; C เป็น Option แยกจาก A+B</p>
  <div className="p55-table-wrap p553-cfo-table-wrap">
   <table className="p55-table p55-table--compact p553-cfo-table">
    <thead><tr>
     <th scope="col">หมวด / Module</th>
     <th scope="col">ต้นทุนฐาน<br/>Cost</th>
     <th scope="col">ราคาขายลูกค้า<br/>Customer Sell</th>
     <th scope="col">SAMTEL<br/>ส่วนแบ่ง / หัก</th>
     <th scope="col">ADDVALUE ได้รับ<br/>ก่อนหักต้นทุน</th>
     <th scope="col">กำไรเป้าหมาย<br/>ADDVALUE</th>
     <th scope="col">สำรองตกหล่น<br/>Reserve</th>
     <th scope="col">ความครบถ้วน</th>
    </tr></thead>
    <tbody>
     <CfoRow label="A — Equipment" source="10.1 · bid.budget.bom.system-location-mto"
      cost={s.aProvisionalCostTHB} customer={s.aProvisionalCustomerSellTHB}
      samtel={s.aProvisionalSamTelShareTHB} receivable={aAfterSamTel}
      profit={s.aProvisionalAddvalueTargetProfitTHB} reserve={s.aProvisionalReserveTHB}
      state={data.sourceCoverage.aReady?"ต้นทุน Working ครบ · รออนุมัติ":"เฉพาะรายการที่มีราคา · TAG/FX ยังไม่ครบ"}/>
     <CfoRow label="B — Services" source="10.2 · bid.budget.working.bc.b1–b14"
      cost={s.bVerifiedCostTHB} customer={s.bProvisionalCustomerSellTHB}
      samtel={s.bProvisionalSamTelDeductionTHB} receivable={s.bProvisionalNetReceivableTHB}
      profit={s.bProfitTHB} reserve={null}
      state={data.sourceCoverage.bCostReady?"มีต้นทุน Direct Cost แล้ว":"แสดง Working Sell ตรง ๆ · รอต้นทุนจริงสำหรับกำไร"}/>
     <CfoRow label="รวม A+B (เบื้องต้น)" source="ผลรวมเฉพาะยอดที่มีราคาปัจจุบัน · ไม่ใช่ Final Customer Bid"
      cost={null} customer={preliminaryBase} samtel={preliminarySamTel}
      receivable={preliminaryReceivable} profit={null} reserve={null}
      state="HOLD · ต้นทุนรวมและกำไรจริงยังไม่ครบ" subtotal/>
     <CfoRow label="C — Optional Spares" source="10.2 · bid.budget.working.bc.c1 / c2 · ไม่รวมใน A+B"
      cost={cCost} customer={cPrice} samtel={cSamTel} receivable={cAfterSamTel}
      profit={cProfit} reserve={cReserve}
      state={data.sourceCoverage.cCostReady?"รออนุมัติราคา Option":"ยังไม่มี Verified Direct Cost · ห้ามนำ Working Sell ไปบวก 30%"}/>
    </tbody>
   </table>
  </div>
  <p className="p55-note"><strong>การอ่านตาราง:</strong> A/C = ต้นทุน × 1.30 (SAMTEL 20% + กำไรเป้าหมาย ADDVALUE 5% + เงินสำรอง 5% ของต้นทุน); B = ราคาขาย Internal Working SELL ปัจจุบัน; SAMTEL หัก 5% เฉพาะ B Services ปกติ. ข้อยกเว้น B3: MGW Purchased iFAT/Facility มูลค่า Cost Quote THB236,250 ได้บวก SAMTEL 20% (THB47,250), ADDVALUE 5% และ Omission 5% ลงใน WS-B3 THB307,125 แล้ว จึงไม่หัก SAMTEL 5% ซ้ำบนส่วน Purchased นี้. <strong>ช่อง “ADDVALUE ได้รับ” ยังไม่ใช่กำไร</strong> เพราะรวมเงินต้นทุนที่จะต้องจ่ายด้วย. เครื่องหมาย — คือข้อมูลยังไม่ครบ ไม่ใช่ 0 บาท</p>
  <details className="p553-cfo-detail">
   <summary>ตรวจสอบ Source / รายการที่ยังไม่ครบ ({data.sourceCoverage.gaps.length})</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>No.</th><th>Module ID</th><th>ข้อมูลที่ต้องตรวจสอบก่อน Release</th></tr></thead>
    <tbody>{data.sourceCoverage.gaps.map((reason,i)=><tr key={i}>
     <td>{i+1}</td><td>{riskModule(reason)}</td><td>{reason}</td>
    </tr>)}</tbody>
   </table></div>
  </details>
 </section>;
}
