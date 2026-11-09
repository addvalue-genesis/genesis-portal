import React from 'react';
import {a1SummarySlot0550} from './exhibitCNative0550';
import {scheduleBindingTHB0550,scheduleRollup0550} from './data/scheduleRollup0550';
import {isLicensingCostLine0550} from './data/licensingScope0550';
import {LicensingEvidence0550} from './LicensingCost0550';

export const A1_OTHERS_PANELS_0550=[
 {id:'E',number:'11.E',title:'Licences & Other Costs'},
 {id:'F',number:'11.F',title:'Insurance Breakdown'}
];

const othersSlot=a1SummarySlot0550({schedule:'A1',summary:'OTHER'});
const money=value=>Number.isFinite(value)?value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'OPEN';
const isInsurance=b=>b.line.wbs==='B9'||b.lineId==='REQ-MR-ACT-B2-D04';
const isLicence=b=>b.line.wbs==='B8'||isLicensingCostLine0550(b.lineId);
const isLicenceFee=b=>b.lineId==='REQ-MR-ACT-B8-D05';
export const a1OthersRows0550=(view,panel)=>view.bindings.filter(b=>b.line&&b.treatment==='BASE'&&!b.nonAdditive&&
 a1SummarySlot0550(b)===othersSlot&&isInsurance(b)===(panel==='F'));

const comparisons={
 E:[
  ['B1 · Myanmar licensing and local agent', 'B8-D01–D05 · งาน TSI, type approval, import/operating licence และวงเงินค่าธรรมเนียม/ตัวแทน', 'OPEN · ยืนยันผู้ถือสิทธิ ผู้ชำระ และจำนวนคำขอ แยกค่าราชการจากค่าตัวแทนและค่าแรง TSI'],
  ['B6 · Border administration and forwarding', 'B2-D01–D03 · Freight, origin handling และ forwarder. B8-D03/D05 · งานใบอนุญาตและวงเงินค่าธรรมเนียม', 'OPEN · ตรวจ customs clearance ปลายทาง อากร/ภาษี สิทธิยกเว้น และผู้ชำระตาม shipment และเงื่อนไขส่งมอบ'],
  ['B7 · Additional storage', 'B2-D02 · มี handling และค่าคลัง/ส่งมอบที่อ้างจากใบเสนอราคา Master Tower', 'OPEN · ตรวจว่าต้องใช้คลังเพิ่มนอกช่วงและขอบเขตที่รวมแล้วหรือไม่'],
  ['B4 / B12 · Coating / First filling', 'ตรวจขอบเขตอุปกรณ์และผู้ขายสำหรับ coating และใช้ 11.C6 เป็นจุดตรวจ first filling/consumables', 'OPEN · ยืนยัน applicability ของ ASK จาก MR/OEM ก่อนจัดเข้าหมวดราคา']
 ],
 F:[
  ['B6 · Marine cargo', 'B2-D04 · เจ้าของเบี้ย Cargo. B9-D04 อ้างกลับไปที่ B2-D04 ในฐานตั้งงบเดิม', 'OPEN · ยืนยันเส้นทาง จุดโอนความเสี่ยง ทุนประกันและ deductible'],
  ['B14 · Ordinary personnel / travel / offshore risk', 'B9-D02 · Personnel travel/work-risk. B9-D03 · Medevac/medical', 'OPEN · ยืนยันคน/วัน/พื้นที่ปฏิบัติงานและกรมธรรม์ ตรวจ endorsement offshore เฉพาะงานที่เข้าข่าย และหักส่วนคุ้มครองทับซ้อน'],
  ['B14 · Contractual bonds / insurance', 'B9-D01 · Project liability/contract risk เป็นวงเงินประมาณการ', 'OPEN · ยืนยันประเภทกรมธรรม์และวงเงินตามสัญญา ตรวจ performance bond/guarantee แยกกับ SAMTEL หากอยู่ในความรับผิดชอบ']
 ]
};

function Comparison0550({panel}){
 return <details>
  <summary>เทียบหัวข้อ PJ2608-0553 · ขอบเขตที่ยังต้องยืนยันสำหรับ ASK</summary>
  <p>หัวข้อจาก 0553 ใช้ตรวจความครบถ้วน ยอดในตารางราคาอ่านจาก Working ของ 0550</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="0553 scope comparison">
   <thead><tr><th scope="col">0553</th><th scope="col">ฐานที่มีใน 0550</th><th scope="col">สิ่งที่ยังต้องตรวจ</th></tr></thead>
   <tbody>{comparisons[panel].map(([heading,basis,gap])=><tr key={heading}><th scope="row">{heading}</th><td>{basis}</td><td>{gap}</td></tr>)}</tbody>
  </table></div>
 </details>;
}

export function A1OthersBreakdown0550({panel,view,currency,onNavigate,disabled}){
 const {number,title}=A1_OTHERS_PANELS_0550.find(p=>p.id===panel);
 const insurance=panel==='F';
 const rows=a1OthersRows0550(view,panel);
 const activeRows=currency==='THB'?rows.map(scheduleBindingTHB0550):rows;
 const groups=insurance
  ?[['Insurance',activeRows]]
  :[['Import / Operating Licence and Type Approval · Application Services',activeRows.filter(b=>isLicence(b)&&!isLicenceFee(b))],
    ['Authority and Agent Fees · Working Allowance',activeRows.filter(isLicenceFee)],
    ['Other Costs',activeRows.filter(b=>!isLicence(b))]];
 const subtotal=scheduleRollup0550(groups.flatMap(([,items])=>items));
 const total=view.workingPreview?subtotal.knownUSD:subtotal.totalUSD;
 return <article aria-label={title}>
  <h3>{number} · {title}</h3>
  <p><strong>DRAFT — NOT FOR SUBMISSION</strong></p>
  <h4>Schedule A1 · Others (Please specify) · 1 Lot</h4>
  <p>11.E และ 11.F แสดงรายละเอียดของยอด 1 Lot เดียวกันจาก Working และ 11.M</p>
  <p>{insurance
   ?'ใช้คอลัมน์ Qty, Unit, Unit Price, Total และ Notes จาก 11.C1 / 11.C8 แยกประกันสินค้า ประกันโครงการ ประกันบุคลากร และ Medevac ตามหน่วยที่ใช้ใน Working'
   :'ใช้โครงรายการและเรตจาก 11.C1 แยกแรงงานเตรียมและติดตามคำขอตามแนว 11.C7 และค่าใช้จ่ายต่อหน่วยจริงตามแนว 11.C8'}</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label={title+' table'}>
   <thead><tr><th scope="col">Item / Working</th><th scope="col">Qty.</th><th scope="col">Unit</th><th scope="col">Unit price ({currency})</th><th scope="col">Amount ({currency})</th><th scope="col">Notes / Trace</th></tr></thead>
   {groups.map(([group,items])=><tbody key={group}>
    <tr><th scope="rowgroup" colSpan={6}>{group}</th></tr>
    {items.length?items.map(b=><tr key={b.lineId} data-working-line={b.lineId}>
     <td><strong>{b.line.description}</strong><small>{b.line.wbs} · {b.lineId}</small></td>
     <td>{b.quantity??'OPEN'}</td><td>{b.unit||'OPEN'}</td><td>{money(b.unitPrice)}</td><td>{money(b.amount)}</td>
     <td><small>{b.suggested?'SI draft allocation':b.state}</small>
      <button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.line.'+b.lineId)}>Working</button>{' '}
      <button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.quotation.line.'+b.lineId)}>11.M</button>
     </td>
    </tr>):<tr><td colSpan={6}>ยังไม่มีรายการจัดสรรในมุมมองนี้</td></tr>}
   </tbody>)}
   <tfoot><tr><th scope="row" colSpan={4}>{view.workingPreview&&subtotal.open?'Priced items subtotal':number+' subtotal'}</th><td>{money(total)}</td><td>{subtotal.priced}/{subtotal.count} priced · {subtotal.open} OPEN</td></tr></tfoot>
  </table></div>
  {!insurance&&<details><summary>ฐานใบอนุญาตและค่าธรรมเนียม · 19 ระบบ + COMMON</summary>
   <LicensingEvidence0550 onNavigate={onNavigate} disabled={disabled}/>
  </details>}
  <Comparison0550 panel={panel}/>
 </article>;
}
