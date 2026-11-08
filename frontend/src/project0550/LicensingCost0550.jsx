import React from "react";
import {amount} from "./BidControls";
import {SYSTEMS} from "./data";
import {LICENSING_INTERFACE_0550, LICENSING_SCOPE_0550, LICENSING_SYSTEM_REVIEW_0550} from "./data/licensingScope0550";
import {roundMoney0550, sumMoney0550} from "./data/money0550";
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

const OPERATION_REVIEW = {
 required:"CUS ระบุให้ตรวจใบอนุญาต",
 check:"ตรวจสิทธิหรือเงื่อนไขตามอุปกรณ์",
 none:"ยังไม่พบใบอนุญาต RF เฉพาะระบบ",
};

function SystemLicenceReview0550({onNavigate,disabled}){
 return <details open>
  <summary>Import Licence และ Operating Licence · ครบ {SYSTEMS.length} ระบบ + COMMON</summary>
  <p>เข้าทะเบียน Import ทุกบรรทัดที่มีสินค้านำเข้า รวมอุปกรณ์เสริมและอะไหล่ ตรวจ HS code, CIF, ผู้ยื่น และใบอนุญาตของแต่ละชุดนำเข้า รายการ COMPANY / ผู้ให้บริการ / Offshore ให้ติดตามแยกจากยอด TSI ส่วนของที่จัดหาในเมียนมาให้แยกออกจากชุดนำเข้า <a href={budget.logisticsInstruction.url+"#page=10"}>Logistics Instruction R03</a></p>
  <p>หนึ่งคำขออาจครอบคลุมหลายระบบ คิดค่าราชการตามคำขอหรือสิทธิจริงใน B8-D05 และแยกจากค่าเตรียมเอกสาร TSI</p>
  <p>ผลวิจัย Rev.01 · N/A ในตารางใช้กับค่าคลื่นเฉพาะกรณีแบบสายหรือโครงสร้างที่ระบุ ส่วน Import และ Type Approval ยังตรวจแยกตามอุปกรณ์ <a href={budget.officialFees.rates.ptdSrdUrl}>PTD · ข้อกำหนดเทคนิค SRD</a> · <a href={budget.officialFees.rates.dcaObstaclesUrl}>DCA · Control of Obstacles</a></p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Import and operating licence review by system">
   <thead><tr><th scope="col">ระบบ / Working</th><th scope="col">Import Licence · ขอบเขตและผู้ยื่น</th><th scope="col">Operating Licence · ผลอ่าน CUS</th><th scope="col">สถานะค่าธรรมเนียม</th></tr></thead>
   <tbody>{SYSTEMS.map(({token,name})=>{
    const review=LICENSING_SYSTEM_REVIEW_0550[token];
    return <tr key={token} data-licensing-system={token}><th scope="row">{name}<small>{token}</small>
     <button type="button" disabled={disabled} onClick={()=>onNavigate?.("bid.budget.working.group."+token)}>เปิด Working</button></th>
     <td>{review?.goods || "ตามรายการนำเข้า · รอทบทวนขอบเขต"}</td>
     <td><strong>{OPERATION_REVIEW[review?.operation] || "รอทบทวนเอกสาร"}</strong><small>{review?.basis}</small>
      {review&&<a href={LICENSING_INTERFACE_0550+"#page="+review.page}>LIS-0004 Rev.B1 · Item {review.item}</a>}</td>
     <td>{review?.fee || "รอยืนยันประเภทสิทธิ อัตรา และผู้ชำระ"}</td>
    </tr>;
   })}
   <tr data-licensing-common="true">
    <th scope="row">COMMON<small>อุปกรณ์ใช้ร่วมและเครื่องมือทดสอบ</small>
     <button type="button" disabled={disabled} onClick={()=>onNavigate?.("bid.budget.working.group.COMMON")}>เปิด Working</button></th>
    <td>ตรวจสาย coax/control ตู้ อะไหล่ และเครื่องมือใช้ร่วมตาม HS และชุดนำเข้าจริง แยกของติดตั้งถาวร (INVESTMENT) จากของใช้ชั่วคราวที่ต้องส่งกลับ (DRAWBACK) ตามเงื่อนไข R03</td>
    <td>ตรวจสิทธิสำหรับเครื่องมือที่ส่งคลื่นระหว่าง FAT/SAT หรือ commissioning ส่วน R03 ห้าม hand-carry อุปกรณ์สื่อสารยกเว้นโทรศัพท์มือถือส่วนตัว และห้ามติดตั้ง VHF, SSB และ walkie-talkie ในที่พักหรือยานพาหนะในเขต Yangon <a href={budget.logisticsInstruction.url+"#page=10"}>R03 §§6.1.1, 6.1.5</a></td>
    <td>รวมตามคำขอและผู้ยื่นจริงใน B8-D05 รายการที่ครอบคลุมในคำขอของระบบอื่นให้อ้างคำขอเดียวกัน</td>
   </tr></tbody>
  </table></div>
 </details>;
}

const formatMMK = new Intl.NumberFormat("en-US");

function LicenceFeeReferences0550({rates}){
 const {fx,microwave}=rates;
 const {applications,cifTierFeeMMK}=budget.importScenarioRev01;
 const comparisonMMK=applications.map(count=>count*cifTierFeeMMK);
 const rangeTHB=mmkPerTHB=>comparisonMMK.map(mmk=>amount(roundMoney0550(mmk/mmkPerTHB))).join("–");
 const annualMMK=microwave.bandwidthMHz*microwave.perMHzMMK+microwave.minimumMMK;
 const feeRows=[
  ...rates.mocImportTiers.map(({cifMMK,feeMMK})=>({label:"MOC · CIF "+cifMMK+" MMK",mmk:feeMMK})),
  ...rates.importFeeReferences,
  {label:"Microwave · ค่าแรกเข้า",mmk:microwave.initialMMK},
  {label:"Microwave · ค่าใช้คลื่นรายปี",mmk:annualMMK},
  {label:"Microwave · รวมปีแรก",mmk:microwave.initialMMK+annualMMK},
  ...rates.ptdUnitReferences,
 ];
 return <>
  <h5>ค่าธรรมเนียมอ้างอิง · MMK และยอดเทียบ THB</h5>
  <p>CBM วันที่ {fx.date} · Market Trading {fx.marketMMKPerTHB.toFixed(2)} MMK/THB เป็นฐานเทียบต้นทุน และ Reference {fx.referenceMMKPerTHB.toFixed(2)} MMK/THB แสดงคู่กัน ยอด THB = MMK ÷ MMK ต่อ 1 THB เรตชำระจริงรอยืนยัน <a href={fx.url}>Central Bank of Myanmar</a></p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Published licence fees in MMK and THB">
   <thead><tr><th scope="col">ฐานค่าธรรมเนียม</th><th scope="col">ค่าราชการต้นทาง</th><th scope="col">THB · Market Trading</th><th scope="col">THB · Reference</th></tr></thead>
   <tbody>{feeRows.map(({label,mmk})=><tr key={label}><th scope="row">{label}</th>
    <td>{formatMMK.format(mmk)} MMK</td><td>{amount(roundMoney0550(mmk/fx.marketMMKPerTHB))}</td><td>{amount(roundMoney0550(mmk/fx.referenceMMKPerTHB))}</td>
   </tr>)}</tbody>
  </table></div>
  <p>MOC แสดงค่าราชการต่อคำขอตามมูลค่า CIF ให้ยืนยันขั้น CIF ที่จุด 150,000,000 MMK และค่าบริการเพิ่มเติมจากใบแจ้งชำระจริง <a href={rates.mocUrl}>Myanmar National Trade Portal</a></p>
  <p>Myanmar แจ้ง WTO ปี 2025 ว่า PTD Recommendation Approval ไม่มีค่าธรรมเนียม และ MOC Telecom Import Licence มีค่าธรรมเนียม 90,000 MMK ให้ตรวจการจัดประเภท HS/CIF และใบแจ้งชำระจริง ค่า Type Approval การทดสอบ และค่าตัวแทนตรวจแยก <a href={rates.wtoTelecomUrl}>WTO G/LIC/N/3/MMR/3 · §19 ข้อ 12</a></p>
  <p>ค่าบริการ TradeNet อ้างอิงสรุป Newsletter 6/2025 มีผล 15 ต.ค. 2025 ตรวจว่าผู้นำเข้ามีสมาชิกอยู่แล้วหรือไม่ และคิดค่าคำขอ/แก้ไขตามที่เกิดจริง <a href={rates.tradeNetNewsletterSummaryUrl}>DFDL · สรุปประกาศและอัตรา</a></p>
  <p><strong>กรณีสมมติจาก Rev.01</strong> · {applications.join("–")} คำขอ × {formatMMK.format(cifTierFeeMMK)} MMK ในขั้น CIF สูงสุด = {comparisonMMK.map(mmk=>formatMMK.format(mmk)).join("–")} MMK · {rangeTHB(fx.marketMMKPerTHB)} ตาม Market Trading หรือ {rangeTHB(fx.referenceMMKPerTHB)} ตาม Reference ใช้เทียบเฉพาะค่าคำขอ MOC จนกว่าจะทราบจำนวนคำขอและ CIF จริง</p>
  <p>Microwave {microwave.bandGHz} GHz / {microwave.bandwidthMHz} MHz เป็นตัวอย่างสำหรับหนึ่งลิงก์ที่ต้องขอสิทธิใหม่ในหมวด Link by Link ตามตารางที่ PTD เผยแพร่ปี {microwave.publishedYear} ค่าใช้คลื่นรายปีคำนวณจาก {microwave.bandwidthMHz} × {formatMMK.format(microwave.perMHzMMK)} + {formatMMK.format(microwave.minimumMMK)} MMK ให้ยืนยันอัตราปัจจุบัน หน่วยที่ PTD คิดจริง และสิทธิเดิมของ COMPANY รวมถึงกรณี Main/Standby ว่าได้รับสิทธิช่องเดียวกันหรือแยกช่อง <a href={rates.ptdUrl}>PTD · Link by Link</a></p>
  <p>Private Network และ VSAT แสดงเฉพาะอัตราต่อหน่วยบางรายการจากตาราง PTD ปี {microwave.publishedYear} ให้ยืนยันหมวดสิทธิและจำนวนอุปกรณ์ที่คิดเงินจริง รวมค่าใช้คลื่นรายปีและค่าธรรมเนียมอื่นก่อนรวมยอด โดยตรวจสิทธิเดิมของ COMPANY หรือผู้ให้บริการด้วย</p>
  <p>อัตรา Ship Station และ Aircraft Station ใช้เทียบเคียงเท่านั้น หมวดและอัตราสำหรับ Coast/Shore, Air-band Ground Station และ NDB ของโครงการยังต้องยืนยันกับ PTD/DCA <a href={rates.ptdUrl}>PTD · Ship / Aircraft Station</a></p>
 </>;
}

function OfficialLicenceFees0550(){
 const {items,rates,purchasingBasis,advanceBasis}=budget.officialFees;
 return <details open>
  <summary>ค่าธรรมเนียมราชการ · MMK / THB · ผู้ชำระ / รอบจ่าย</summary>
  <LicenceFeeReferences0550 rates={rates}/>
  <p>{purchasingBasis}</p>
  <p>{advanceBasis}</p>
  <p>วงเงิน Radio / Operating Licence ใน B8-D05 เป็นสมมติฐานตั้งงบ ต้องตรวจอัตราจริงและขอบเขตที่ ADDVALUE ต้องรับก่อนใช้เป็นราคา</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Official licence fee responsibility">
   <thead><tr><th>ค่าธรรมเนียม</th><th>ขอบเขตที่คิด</th><th>ผู้ดำเนินการ / ผู้ชำระ</th><th>จ่ายเมื่อไร / ถึงเมื่อไร</th></tr></thead>
   <tbody>{items.map(r=><tr key={r.fee}><td>{r.fee}</td><td>{r.scope}</td><td>{r.responsibility}</td><td>{r.timing}</td></tr>)}</tbody>
  </table></div>
  <p>Annex 6 §5.3.1 ให้ยื่น FaFE อย่างน้อย 6 เดือนก่อน shipment ส่วนการคืนอากรตาม EPC §31.5.2 ต้องแจ้งก่อนจ่ายและคืนตามยอดสุทธิเมื่อครบเงื่อนไข ให้ตรวจสิทธิผ่านสัญญาของ ADDVALUE แยกต่างหาก <a href={rates.contractUrl}>Attachment 2 · Annex 6 / Purchase Agreement / Exhibit F</a></p>
 </details>;
}

export function LicensingEvidence0550({onNavigate,disabled}){
 return <><OfficialLicenceFees0550/><SystemLicenceReview0550 onNavigate={onNavigate} disabled={disabled}/><LicensingBudgetBasis0550/></>;
}

export function LicensingCost0550({lines, onNavigate, disabled=false}){
 const working=new Map(lines.map(l=>[l.id,l]));
 const entries=LICENSING_SCOPE_0550.map(([id,label,scope])=>{
  const line=working.get(id);
  return {id,label,scope,line,total:line?.selected?line.costTHB:null};
 });
 const known=entries.map(e=>e.total).filter(Number.isFinite);
 return <section className="p55-panel" aria-label="Telecom licensing and permit coordination">
  <h4>Telecom Licensing · Import Permit / Operating Licence</h4>
  <p>คัดกรองอุปกรณ์นำเข้าข้ามระบบ และตรวจ Frequency Assignment / Radio &amp; Operating Licence สำหรับระบบที่เข้าข่าย ใช้เจ้าของต้นทุนร่วมใน Part B8 ตามรายการด้านล่าง</p>
  <p>MR Appendix 1.0 §2.0(l) ให้ TSI เตรียมข้อมูลและเอกสาร ส่วน Microwave ให้ TSI ประสานและดำเนินการในนาม COMPANY ตาม SPE §7.1 โดยตรวจบทบาทผู้ยื่นและผู้ชำระตาม LIS Item 12 ก่อนยืนยันราคา</p>
  <p>ต้นทุน Working · Part B8 → Customer B1 → 11.A1 Others ตามการจัดสรร 11.M</p>
  <p>ยอดเฉพาะรายการที่มีราคา {known.length}/{entries.length} · <strong>{amount(sumMoney0550(known),"THB")}</strong></p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>รายการใบอนุญาต / งานที่รวม</th><th>ต้นทุน Working (THB)</th><th>รายการต้นทาง</th></tr></thead><tbody>
   {entries.map(({id,label,scope,line,total})=><tr key={id}><td><strong>{label}</strong><small>{scope}</small></td>
    <td>{amount(total,"THB")}<small>{line?.selected?"Working":"ยังไม่มีเจ้าของต้นทุนที่เลือก"}</small></td>
    <td>{line&&<button type="button" disabled={disabled} onClick={()=>onNavigate?.("bid.budget.working.line."+id)}>เปิด Working · {id.slice(-6)}</button>}</td>
   </tr>)}
  </tbody></table></div>
  <LicensingEvidence0550 onNavigate={onNavigate} disabled={disabled}/>
 </section>;
}
