import React from 'react';
import {PAGA_REVISION,PAGA_REVISION_INCLUDED_0550,PAGA_REVISION_OPEN_0550,pagaRevisionSelected0550} from './data/supplierRevision0550';

const scopeNotes={
 A:'Working A1-05 ใช้ NET 1 Lot อ้างอิง MR Rev.B1 Appendix 1.4 และ WP.7 · Access Panel 4 ตัวตามใบเสนอราคา · ตรวจ TAG ตัวที่สี่กับ MR และวงจร XBC ที่ APF/ACP',
 B:'เอกสาร OEM, FAT ที่ Wertheim และ Packing รวมใน NET · ตรวจงวดจ่ายลูกค้ากับ Advance Payment ของผู้ขายแยกกัน · ADDVALUE / ID IE ยังต้องแยกขอบเขตงานหน้างาน',
 C:'Commissioning Kit item 18020 รวม 1 ชุดใน NET · แยกอะไหล่เพิ่มตามจำนวนที่ต้องการและราคา OEM · ยังต้องยืนยัน Site Service, SAT และ Training',
 C2:'Kit item 18020 รวม 1 ชุดใน NET · รายการอะไหล่ Commissioning อื่นและจำนวนแนะนำยังต้องยืนยัน',
 C3:'แยกราคาอะไหล่สองปีจากประมาณการ Working · รอรายการ OEM และจำนวนแนะนำ',
 C4:'รอรายการ Capital Spares และราคา OEM',
 C5:'Kit item 18020 อยู่ใน NET · ตรวจ Special Tools ที่ต้องจัดหาเพิ่ม',
 C6:'ตรวจชนิดและจำนวนวัสดุสิ้นเปลืองที่ต้องจัดหาเพิ่ม',
 C7:'FAT ที่ Wertheim รวมใน NET · Site Service, SAT และ Training ต้องแยกคน-ชั่วโมงและขอบเขต ADDVALUE / ID IE',
 C8:'ตรวจรายการ Facilities ที่ผู้ซื้อต้องจัดหาและผู้รับผิดชอบรายไซต์',
 D:'OEM FAT ที่ Wertheim รวมใน NET · ตรวจขอบเขต iFAT, FAT witness, การเดินทาง และ SAT แยกตามผู้รับผิดชอบ',
 E:'ตรวจขนส่งจาก FCA Wertheim, อากรและใบอนุญาตตามขอบเขต TSI · แยกจาก Packing ของ OEM ใน NET',
 F:'ตรวจประกันขนส่งหลังรับของที่ FCA Wertheim และจุดโอนความเสี่ยงของสัญญาลูกค้า',
 mapping:'A1-05 → C1 / GOODS / BASE · ใช้ Working owner เดียว รายการ OEM ใน NET เป็นหลักฐานขอบเขต',
 technical:'ตรวจ Controller Redundancy Activation item 20030 กับ Hardware, network topology และ Failover test · ตรวจ TAG และ XBC แยก APF/ACP',
 avl:'อ้าง Annex 2_1 หมวด PAGA ระบุ GAI-Tronics · ร่างขออนุมัติ INDUSTRONIC ต้องอ้างฉบับที่เลือกใน Working',
};

export function PagaQuoteScope0550({data,section,onNavigate,disabled=false}){
 const selected=pagaRevisionSelected0550(data);
 if(!selected)return null;
 const {net,owner}=selected;
 const mr=(data.sourceIntake?.sources||[]).find(s=>s.documentNo==='MM-ASK-1A-APF-TEL-MR-0001'&&s.revision==='B1'&&s.authority==='CURRENT_TENDER');
 const terms=net.quoteEvidence.terms.filter(term=>/^(FCA|Advance payment|Validity|Lead time|Warranty)/i.test(term));
 const links=[
  ...(mr?[['bid.documents.source.'+mr.id,'CUS · MR Rev.B1']]:[]),
  ['bid.vendor.offer.'+net.id,'07 · VND'],
  ['bid.working-preview.step.7','SI · WP.7'],
  ['bid.budget.working.line.'+owner.id,'Working A1-05'],
  ['bid.quotation.line.'+owner.id,'11.M'],
 ];
 return <aside className="p55-panel" aria-label="PAGA current quote scope">
  <h4>PAGA · INDUSTRONIC {PAGA_REVISION} · Working Draft</h4>
  <p>{scopeNotes[section]||PAGA_REVISION_INCLUDED_0550}</p>
  {section==='commercial'&&<><p>เงื่อนไขจัดซื้อ OEM · {terms.join(' · ')}</p><p>เทียบกับ Schedule B และเงื่อนไขของลูกค้าก่อนบันทึก Commercial Deviation · เอกสารคุณสมบัติและผล AVL ตรวจใน 13 และ 14</p></>}
  {section==='release'&&<p>{PAGA_REVISION_OPEN_0550}</p>}
  {onNavigate&&<div className="p55-review-toolbar">{links.map(([id,label])=><button type="button" key={id} disabled={disabled} onClick={()=>onNavigate(id)}>{label}</button>)}</div>}
 </aside>;
}
