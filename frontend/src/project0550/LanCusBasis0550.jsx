import React from 'react';
import {mgwCurrentOffer0550,MGW_CURRENT_PREFIX_0550} from './data/mgwQuoteSelection0550';

const standards=[
 ['10008-STD-6-TEL-001','R00','§7.2.3, §7.7.1','โครงสร้าง LAN, Firewall แยกเครือข่าย และรายการอะไหล่แยก C2 / C3'],
 ['10008-STD-6-TEL-011','R00','§7.2.1.3, §7.2.2.2, §7.3.2','Core / Distribution / Access, Firewall / DMZ และทดสอบเครือข่ายจริงหรือจำลอง'],
 ['10006-STD-6-ICT-003','R00','§8.6, §9.2','สเปกสายข้อมูลใน/นอกอาคารและการทดสอบสาย ใช้กับแถวสาย LAN'],
 ['10008-STD-6-INT-001','R00','§7.2.1','ITP รายอุปกรณ์และกิจกรรม ระบุขั้นตอน เกณฑ์รับและหลักฐาน'],
];
const phi=['MM-ASK-1A-APF-TEL-PHI-0001','B1','Table 7-7'];
const dts=['MM-ASK-1A-APF-TEL-DTS-0001','B1','Sheets 7–8, 10'];
const mr=['MM-ASK-1A-APF-TEL-MR-0001','B1','Appendix 10'];

function CusRefs({data,refs,onNavigate}){
 const sources=data.sourceIntake?.sources||[];
 const replaced=new Set(sources.flatMap(source=>source.replaces||[]));
 return <ul>{refs.map(([documentNo,revision,locator,note])=>{
  const matches=sources.filter(source=>source.documentNo===documentNo&&source.revision===revision&&source.authority==='CURRENT_TENDER'&&!replaced.has(source.id)&&source.content);
  const label=`${documentNo} ${revision} · ${locator}`;
  return <li key={documentNo}><button type="button" onClick={()=>onNavigate?.(matches.length===1?'bid.documents.source.'+matches[0].id:'l3.original')}>{label}</button>{note&&<> · {note}</>}</li>;
 })}</ul>;
}

export function LanCusStandards0550({data,onNavigate}){
 return <details><summary>ข้อกำหนด LAN จากทะเบียน CUS</summary><CusRefs data={data} refs={standards} onNavigate={onNavigate}/></details>;
}

export function LanCusLine0550({data,line,offer,onNavigate,showQuote=false}){
 const key=offer?.id.slice(MGW_CURRENT_PREFIX_0550.length);
 if(!mgwCurrentOffer0550(offer)||!['LAN-APF-9-02','LAN-APF-9-07'].includes(key)||line.id!=='LINE-MGW-CURRENT-'+key)return null;
 const firewall=key==='LAN-APF-9-02';
 return <details>
  <summary>เทียบ MGW กับ CUS · {firewall?'Firewall IT/OT และ throughput':'Wireless Controller และสิทธิ์ AP'} · OPEN</summary>
  {showQuote&&<><p>รายการทั้งชุดตาม {offer.quoteEvidence.locator}</p><ul>{(offer.quoteEvidence.terms||[]).map((term,i)=><li key={i}>{term}</li>)}</ul></>}
  {firewall?<p>MGW ให้ PA-460 สองชุด ระบุ Firewall 4.2 Gbps และ Threat Prevention 1.8 Gbps ส่วน PHI แยก Firewall IT และ OT ที่ APF อย่างละสองเครื่องแบบ redundant โดย IT ต้องมากกว่า 10 Gbps และ DTS ระบุ Threat Prevention ของ OT 2.2 และ IT 2.6 Gbps ตรวจ TAG, บทบาท, เกณฑ์ทดสอบและขอบเขต HA/DMZ ก่อนยืนยันการใช้งาน</p>:
   <p>MGW ให้ Catalyst 9800-L สองชุด โดยระบุ 50 AP license ต่อชุด ส่วน DTS ระบุรองรับอย่างน้อย 200 AP, 2,000 clients และ 5 Gbps ต้องยืนยันสิทธิ์ AP และความจุใน topology ที่เสนอ รวมถึงการทำงานระหว่าง failover ก่อนใช้ผลประเมินสต็อกกำหนดจำนวน C2</p>}
  <CusRefs data={data} refs={[...(firewall?[phi]:[]),dts,standards[1],standards[3],mr]} onNavigate={onNavigate}/>
 </details>;
}
