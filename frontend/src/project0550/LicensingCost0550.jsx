import React from "react";
import {amount} from "./BidControls";
import {LICENSING_SCOPE_0550} from "./data/licensingScope0550";
import {sumMoney0550} from "./data/money0550";

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
 </section>;
}
