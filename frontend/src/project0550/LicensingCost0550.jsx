import React from "react";
import {amount} from "./BidControls";
import {LICENSING_SCOPE_0550} from "./data/licensingScope0550";
import {sumMoney0550} from "./data/money0550";
import budget from "./data/licensingBudgetBasis0550.json";

function LicensingBudgetBasis0550(){
 const {workingAllowance,benchmark0553,logisticsInstruction,costChecks}=budget;
 return <details>
  <summary>รายละเอียดตั้งงบและหลักฐานเทียบจาก PJ2608-0553</summary>
  <p>ฐานประมาณการเดิมของ B8-D05 แยกตามตัวขับต้นทุนด้านล่าง ยอดที่ใช้จริงอ่านจาก Working ด้านบน</p>
  <ul>{workingAllowance.map(r=><li key={r.label}>{r.label} · {r.quantity} {r.unit} × {amount(r.rateTHB)} = <strong>{amount(r.quantity*r.rateTHB)}</strong></li>)}</ul>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Licensing cost scope"><thead><tr><th>เจ้าของต้นทุน</th><th>รายละเอียดที่ต้องตรวจ</th></tr></thead><tbody>
   {costChecks.map(r=><tr key={r.owner}><td>{r.owner}</td><td>{r.description}</td></tr>)}
  </tbody></table></div>
  <p>Table 6.1 ให้เวลาอุปกรณ์ Telecom 4–5 เดือน ส่วน §6.1.5 แยกอนุมัติด้านสื่อสาร 2–3 เดือนและ MOC อีกราว 3 เดือน ให้เผื่อ 5–6 เดือนในแผนเบื้องต้น และทวนเส้นทางอนุญาตของ VSAT/KU Band กับ COMPANY เพราะข้อกำหนด R03 ระบุข้อจำกัดการนำเข้า Satellite Systems/Phones</p>
  <p><a href={logisticsInstruction.url+"#page=10"}>Logistics Instruction R03 · {logisticsInstruction.reference}</a></p>
  <p>0553 เคยตั้งงบภายนอก {amount(sumMoney0550(benchmark0553.costs.map(r=>r.amountTHB)))} สำหรับแพ็กเกจสี่ MR ใช้เทียบโครงสร้างต้นทุนและขนาดวงเงิน</p>
  <ul>{benchmark0553.costs.map(r=><li key={r.label}>{r.label} · {amount(r.amountTHB)}</li>)}</ul>
  <p>Instrument allowance ของ 0553 {amount(benchmark0553.instrumentSellTHB)} เป็นราคาขายร่างเฉพาะงาน Instrument จึงแสดงแยกจากต้นทุนอ้างอิง</p>
  <p><a href={benchmark0553.requirementsUrl}>0553 · JSON ข้อกำหนด</a> · <a href={benchmark0553.costUrl}>0553 · ฐานประมาณการ</a> · <a href={benchmark0553.instrumentUrl}>0553 · Instrument allowance</a></p>
 </details>;
}

function OfficialLicenceFees0550(){
 const {items,rates,purchasingBasis,advanceBasis}=budget.officialFees;
 return <details>
  <summary>ค่าธรรมเนียมราชการ · ผู้ยื่น / ผู้ชำระ / รอบจ่าย</summary>
  <p>{purchasingBasis}</p>
  <p>{advanceBasis}</p>
  <p>วงเงิน Radio / Operating Licence ใน B8-D05 เป็นสมมติฐานตั้งงบ ต้องตรวจอัตราจริงและขอบเขตที่ ADDVALUE ต้องรับก่อนใช้เป็นราคา</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Official licence fee responsibility">
   <thead><tr><th>ค่าธรรมเนียม</th><th>ขอบเขตที่คิด</th><th>ผู้ดำเนินการ / ผู้ชำระ</th><th>จ่ายเมื่อไร / ถึงเมื่อไร</th></tr></thead>
   <tbody>{items.map(r=><tr key={r.fee}><td>{r.fee}</td><td>{r.scope}</td><td>{r.responsibility}</td><td>{r.timing}</td></tr>)}</tbody>
  </table></div>
  <p>ตัวอย่างอัตรา MOC ที่เผยแพร่ {rates.mocRangeMMK} ให้ตรวจค่าบริการและยอดในใบแจ้งชำระของคำขอจริง <a href={rates.mocUrl}>Myanmar National Trade Portal</a></p>
  <p>{rates.microwaveExample} <a href={rates.ptdUrl}>PTD · Link by Link</a></p>
  <p>Annex 6 §5.3.1 ให้ยื่น FaFE อย่างน้อย 6 เดือนก่อน shipment ส่วนการคืนอากรตาม EPC §31.5.2 ต้องแจ้งก่อนจ่ายและคืนตามยอดสุทธิเมื่อครบเงื่อนไข ให้ตรวจสิทธิผ่านสัญญาของ ADDVALUE แยกต่างหาก <a href={rates.contractUrl}>Attachment 2 · Annex 6 / Purchase Agreement / Exhibit F</a></p>
 </details>;
}

export function LicensingCost0550({lines, schedule, currency="THB", onNavigate, disabled=false}){
 const working=new Map(lines.map(l=>[l.id,l]));
 const bindings=new Map((schedule?.bindings||[]).map(b=>[b.lineId,b]));
 const entries=LICENSING_SCOPE_0550.map(([id,label,scope])=>{
  const line=working.get(id),binding=bindings.get(id);
  const allocated=binding?.line&&!binding.nonAdditive&&binding.treatment==="BASE"&&binding.schedule==="A1"&&binding.summary==="OTHER";
  const total=schedule?(allocated?(currency==="THB"?binding.line.customerTHB:binding.amount):null):line?.selected?line.costTHB:null;
  const status=!schedule?(line?.selected?"Working":"ยังไม่มีเจ้าของต้นทุนที่เลือก"):allocated?(binding.suggested?"ร่างจัดสรร A1 / Others":"A1 / Others · "+binding.state):binding?.line?"จัดไว้ที่ "+binding.schedule+" · ตรวจ 11.M":"ยังไม่มีการจัดสรรในมุมมองนี้";
  return {id,label,scope,line,total,status};
 });
 const known=entries.map(e=>e.total).filter(Number.isFinite);
 return <section className="p55-panel" aria-label="Telecom licensing and permit coordination">
  <h4>Telecom Licensing · Import Permit / Operating Licence</h4>
  <p>คัดกรองอุปกรณ์นำเข้าข้ามระบบ และตรวจ Frequency Assignment / Radio &amp; Operating Licence สำหรับระบบที่เข้าข่าย ใช้เจ้าของต้นทุนร่วมใน Part B8 ตามรายการด้านล่าง</p>
  <p>MR Appendix 1.0 §2.0(l) ให้ TSI เตรียมข้อมูลและเอกสาร ส่วน Microwave ให้ TSI ประสานและดำเนินการในนาม COMPANY ตาม SPE §7.1 โดยตรวจบทบาทผู้ยื่นและผู้ชำระตาม LIS Item 12 ก่อนยืนยันราคา</p>
  <p>{schedule?"11.A1 · Others (Please specify) รับราคาจากเจ้าของรายการ B8 ผ่านการจัดสรร 11.M":"ต้นทุน Working · Part B8 → Customer B1 → 11.A1 Others ตามการจัดสรร 11.M"}</p>
  <p>ยอดเฉพาะรายการที่มีราคา {known.length}/{entries.length} · <strong>{amount(sumMoney0550(known),currency)}</strong></p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>รายการใบอนุญาต / งานที่รวม</th><th>{schedule?"ราคาขายใน Schedule":"ต้นทุน Working"} ({currency})</th><th>รายการต้นทาง</th></tr></thead><tbody>
   {entries.map(({id,label,scope,line,total,status})=>{
    const target=(schedule?"bid.quotation.line.":"bid.budget.working.line.")+id;
    return <tr key={id}><td><strong>{label}</strong><small>{scope}</small></td><td>{amount(total,currency)}<small>{status}</small></td><td>{line&&<button type="button" disabled={disabled} onClick={()=>onNavigate?.(target)}>{schedule?"เปิด 11.M":"เปิด Working"} · {id.slice(-6)}</button>}</td></tr>;
   })}
  </tbody></table></div>
  {!schedule&&<><OfficialLicenceFees0550/><LicensingBudgetBasis0550/></>}
 </section>;
}
