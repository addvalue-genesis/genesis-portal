import React from 'react';
import {latestPagaVendorPackage0550} from './data/vendorRegister0550';
import {COMMERCIAL_POLICY,CORE_TEAM} from './data';
import {PAGA_IDIE_WORKING_0550} from './data/alieIntake0550';
import {pagaMobWorking0550} from './data/pagaMobWorking0550';
import {PAGA_REVISION_OPEN_0550,pagaRevisionCandidate0550,pagaRevisionSelected0550,pagaCommercialChanges0550,pagaIncludedScope0550,pagaIncludedServices0550,pagaIncludedKit0550,pagaTrainingOption0550,pagaTwoYearSpareEvidence0550} from './data/supplierRevision0550';

const scopeNotes={
 A:'Working A1-05 ใช้ NET 1 Lot อ้างอิง MR Rev.B1 Appendix 1.4 และ WP.7 · Access Panel 4 ตัวตามใบเสนอราคา · ตรวจ TAG ตัวที่สี่กับ MR และวงจร XBC ที่ APF/ACP',
 B:'เอกสาร OEM, FAT ที่ Wertheim และ Packing รวมใน NET · ตรวจงวดจ่ายลูกค้ากับ Advance Payment ของผู้ขายแยกกัน',
 C:'Commissioning Kit item 18020 รวม 1 ชุดใน NET · แยกอะไหล่เพิ่มตามจำนวนที่ต้องการและราคา OEM · ยังต้องยืนยัน Site Service, SAT และ Training',
 C2:'Kit item 18020 รวม 1 ชุดใน NET · รายการอะไหล่ Commissioning อื่นและจำนวนแนะนำยังต้องยืนยัน',
 C3:'แยกราคาอะไหล่สองปีจากประมาณการ Working · รอรายการ OEM และจำนวนแนะนำ',
 C4:'รอรายการ Capital Spares และราคา OEM',
 C5:'Kit item 18020 อยู่ใน NET · ตรวจ Special Tools ที่ต้องจัดหาเพิ่ม',
 C6:'ตรวจชนิดและจำนวนวัสดุสิ้นเปลืองที่ต้องจัดหาเพิ่ม',
 C7:'ID-IE ควบคุมงานหน้างาน · ทีม ADDVALUE ปฏิบัติงาน · Bangkok Local FAT อยู่ที่ A1 S/N 2 / 11.D',
 C8:'ตรวจรายการ Facilities ที่ผู้ซื้อต้องจัดหาและผู้รับผิดชอบรายไซต์',
 D:'Bangkok Local FAT/iFAT อยู่ที่ A1 S/N 2 · OEM FAT ที่ Wertheim รวมใน NET · ตรวจขอบเขต witness และการเดินทาง',
 E:'ตรวจขนส่งจาก FCA Wertheim, อากรและใบอนุญาตตามขอบเขต TSI · แยกจาก Packing ของ OEM ใน NET',
 F:'ตรวจประกันขนส่งหลังรับของที่ FCA Wertheim และจุดโอนความเสี่ยงของสัญญาลูกค้า',
 mapping:'A1-05 → C1 / GOODS / BASE · ใช้ Working owner เดียว รายการ OEM ใน NET เป็นหลักฐานขอบเขต',
 technical:'ตรวจ Controller Redundancy Activation item 20030 กับ Hardware, network topology และ Failover test · ตรวจ TAG และ XBC แยก APF/ACP',
 avl:'อ้าง Annex 2_1 หมวด PAGA ระบุ GAI-Tronics · ร่างขออนุมัติ INDUSTRONIC ต้องอ้างฉบับที่เลือกใน Working',
};

const pagaTsiRateRoles=['Senior Telecom Engineer','Chief Telecom Technician'];
const formatRate=rate=>Number.isFinite(rate)?rate.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'OPEN';

export function PagaQuoteScope0550({data,section,onNavigate,disabled=false}){
 const selected=pagaRevisionSelected0550(data);
 const vendorView=section==='vendor';
 const candidate=pagaRevisionCandidate0550(data),net=selected?.net,owner=selected?.owner;
 const latestVendorQuote=vendorView?(latestPagaVendorPackage0550(data.offers)||candidate):null;
 const received=candidate&&candidate.id!==net?.id&&['A','commercial'].includes(section)?candidate:null;
 const display=latestVendorQuote||net||received;
 if(!display)return null;
 const services=net?pagaIncludedServices0550(data,net):{};
 const kit=net&&pagaIncludedKit0550(data,net);
 const scopeNote=net?.quoteRef==='A20261632-005'&&['C','C2','C5'].includes(section)?
  [kit&&('Item '+kit.supplierQuoteRow.itemCode+' · Commissioning spare kit รวมอยู่ใน NET'), 'ตรวจรายการและปริมาณที่ต้องจัดหาเพิ่มจาก OEM'].filter(Boolean).join(' · '):
  scopeNotes[section];
 const spares=section==='C3'?pagaTwoYearSpareEvidence0550(data,net):null;
 const training=['C7','mapping'].includes(section)?pagaTrainingOption0550(data,net):null;
 const mr=(data.sourceIntake?.sources||[]).find(s=>s.documentNo==='MM-ASK-1A-APF-TEL-MR-0001'&&s.revision==='B1'&&s.authority==='CURRENT_TENDER');
 const terms=display.quoteEvidence.terms.filter(term=>/^(FCA|Advance payment|Validity|Lead time|Warranty|Freight pickup)/i.test(term));
 const changes=section==='commercial'?pagaCommercialChanges0550(data,received||display):[];
 const showServiceRates=['B','C7','D','release'].includes(section);
 const mobilization=['B','C7','D','release','mapping','preview'].includes(section)?
  pagaMobWorking0550(data,CORE_TEAM,COMMERCIAL_POLICY):null;
 const idie=showServiceRates?PAGA_IDIE_WORKING_0550.map(service=>({...service,
  offer:data.offers.find(o=>o.id===service.offerId),
  line:data.lines.find(l=>l.selected&&l.systemToken==='TEL-PAGA'&&l.wbs==='B4'&&l.offerId===service.offerId),
 })):[];
 const addvalue=showServiceRates?pagaTsiRateRoles.map(role=>CORE_TEAM.find(r=>r.role===role)).filter(Boolean):[];
 const links=[
  ...(mr?[['bid.documents.source.'+mr.id,'CUS · MR Rev.B1']]:[]),
  ['bid.vendor.offer.'+display.id,'07 · VND'],
  ['bid.working-preview.step.7','SI · WP.7'],
  ...(owner?[['bid.budget.working.line.'+owner.id,'Working A1-05'],['bid.quotation.line.'+owner.id,'11.M']]:[]),
 ];
 if(section==='preview'&&!mobilization)return null;
 return <aside className="p55-panel" aria-label="PAGA current quote scope">
  <h4>PAGA · INDUSTRONIC {display.quoteRef} · {vendorView?'ใบเสนอราคาหลักในทะเบียน':net?'Working Draft':'Received'}</h4>
  {vendorView&&net&&net.id!==display.id&&<p>ฐานที่เลือกใน Working A1-05 · {net.quoteRef}</p>}
  {received&&<p>{received.quoteRef} · ได้รับแล้ว · เลือกฉบับในเจ้าของราคา Working A1-05 เมื่อตรวจฐานราคาและขอบเขตแล้ว {onNavigate&&<button type="button" disabled={disabled} onClick={()=>onNavigate('bid.vendor.offer.'+received.id)}>07 · เปิดใบเสนอราคา</button>}</p>}
  {net&&!vendorView&&<p>{spares?`OEM SP2 ของ -002 มี ${spares.recommended.length} รายการพร้อมจำนวนแนะนำและราคาต้นทาง และ ${spares.options.length} รายการทางเลือก · ตรวจความเข้ากันกับฉบับที่เลือก รายการซ้ำกับ Commissioning Kit และ Base/Option ก่อนใช้แทนวงเงิน Working`:scopeNote||pagaIncludedScope0550(data,net)}</p>}
  {net&&['B','C','C7','D','mapping','release'].includes(section)&&services.acoustic&&<p>Item 23050 · Acoustic Study รวมอยู่ใน NET · ระยะเวลาศึกษาแยกจาก lead time ของอุปกรณ์</p>}
  {net&&['B','C','C7','mapping','release'].includes(section)&&services.classroom&&<p>Item 23070 · Classroom / Virtual Classroom Training รวมอยู่ใน NET · ตรวจจำนวนผู้เข้าอบรม ระยะเวลา และ On-site Training ตาม Annex ก่อนจัดสรรส่วนเพิ่ม</p>}
  {spares&&onNavigate&&<button type="button" disabled={disabled} onClick={()=>onNavigate('bid.vendor.offer.'+(spares.recommended[0]||spares.options[0]).id)}>07 · เปิดหลักฐาน SP2</button>}
  {training&&<p>{net.quoteRef} · Item 23060 · Onshore Training คิดตามจริงแยกจาก NET · รอวัน/ชั่วโมงผู้สอนและค่าใช้จ่าย</p>}
  {showServiceRates&&<details><summary>ฐานเรตบริการ PAGA · ID-IE / ADDVALUE</summary>
   <div className="p55-table-wrap"><table className="p55-table">
    <thead><tr><th>ผู้ปฏิบัติงาน / ขอบเขต</th><th>ฐานเรตต่อหน่วย</th><th>วัน / คน-วัน</th><th>แหล่งอ้างอิง</th></tr></thead>
    <tbody>
     {idie.map(({offerId,label,offer,line})=><tr key={offerId}><td>ID-IE · {label}</td>
      <td>{offer?formatRate(offer.unitCost)+' '+offer.currency+'/'+offer.unit+' · ต้นทุนผู้ขาย':'OPEN'}</td>
      <td>{line?.quantity??'OPEN'}</td><td>{offer?.quoteRef||'รอข้อมูล 07.2'}
       {offer&&onNavigate&&<button type="button" disabled={disabled} onClick={()=>onNavigate(line?'bid.budget.working.line.'+line.id:'bid.vendor.offer.'+offer.id)}>{line?'Working B4':'07.2 Offer'}</button>}</td></tr>)}
     {addvalue.map(role=><tr key={role.role}><td>ADDVALUE · {role.role}</td>
      <td>{formatRate(role.protectedUsdDay)} USD/MD · เรตขาย ADDVALUE</td><td>OPEN</td><td>06 Execution · CORE_TEAM</td></tr>)}
    </tbody>
   </table></div>
  <p>ใช้เรต ADDVALUE จากระบบสำหรับทีมเตรียมงานและปฏิบัติงานหน้างาน ตรวจคน-วันตามแผนและยอดร่วมใน Working B4 ก่อนจัดสรร</p>
  </details>}
  {mobilization&&<details open={section==='B'}>
   <summary>PAGA · แผน 4 MOB และ FAT/iFAT กรุงเทพฯ</summary>
   <p>Early Buildings · {mobilization.plan.earlyBuildings.join(', ')} · ส่งมอบ {mobilization.plan.earlyHandover}</p>
   <div className="p55-table-wrap"><table className="p55-table">
    <thead><tr><th>รอบ / สถานที่</th><th>ADDVALUE</th><th>ID-IE</th><th>ต้นทุน (THB)</th><th>ราคาขายร่าง (USD)</th></tr></thead>
    <tbody>{mobilization.rows.map(row=><tr key={row.id}>
     <td>{row.id} · {row.location}</td>
     <td>{row.engineers} วิศวกร + {row.technicians} ช่าง · {row.days} วัน{row.travelDays>0?' + เดินทาง '+row.travelDays+' วัน/คน':''}<br/>{row.work}</td>
     <td>{row.fatDays>0?row.fatDays+' วันตามแพ็กเกจ · ':row.supervisorDays>0?
      row.supervisorDays+' คน-วัน + เดินทาง '+row.supervisorTravelDays+' วัน · ':''}{row.supervision}</td>
     <td>{formatRate(row.costTHB)}</td><td>{formatRate(row.customerUSD)}</td>
    </tr>)}</tbody>
   </table></div>
   <p>ค่าใช้จ่ายบุคลากรครั้งเดียว THB {formatRate(mobilization.personnelTHB)} · ต้นทุนรวม USD {formatRate(mobilization.costUSD)} ·
    ราคาขายร่าง USD {formatRate(mobilization.customerUSD)} ก่อนหักงบส่วนกลาง</p>
   <p>ยอดสุทธิรอกระทบยอด B1/B4/B7/D และค่าเดินทางร่วม · ยังต้องยืนยันวันเดินทางและ OT กับ ID-IE · Training และ post-start attendance ยังเปิดอยู่</p>
   <small>{mobilization.plan.source} · {mobilization.plan.references}</small>
  </details>}
  {section==='commercial'&&<><p>เงื่อนไขจัดซื้อ OEM · {terms.join(' · ')}</p>
   {changes.length>0&&<><p>{(received||display).quoteRef} เทียบกับ -002</p><ul aria-label="PAGA commercial comparison">{changes.map(term=><li key={term.label}>{term.label} · {term.state==='SAME'?'ตรงกัน':term.state==='CHANGED'?'เปลี่ยนจาก '+term.prior+' เป็น '+term.current:'รอยืนยันเงื่อนไข'}</li>)}</ul></>}
   <p>เทียบกับ Schedule B และเงื่อนไขของลูกค้าก่อนบันทึก Commercial Deviation · เอกสารคุณสมบัติและผล AVL ตรวจใน 13 และ 14</p></>}
  {net&&section==='release'&&<p>{PAGA_REVISION_OPEN_0550}</p>}
  {onNavigate&&<div className="p55-review-toolbar">{links.map(([id,label])=><button type="button" key={id} disabled={disabled} onClick={()=>onNavigate(id)}>{label}</button>)}</div>}
 </aside>;
}
