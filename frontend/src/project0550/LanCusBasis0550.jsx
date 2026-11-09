import React from 'react';
import {APF_LAN_BID_BASIS_0550,mgwCurrentOffer0550,MGW_CURRENT_PREFIX_0550} from './data/mgwQuoteSelection0550';
import {lanStockBasis0550} from './data/lanStockBasis0550';
import {evaluateServiceEquation} from './serviceEquationRuntime';

const standards=[
 ['10008-STD-6-TEL-001','R00','§7.2.3, §7.7.1','โครงสร้าง LAN, Firewall แยกเครือข่าย และรายการอะไหล่แยก C2 / C3'],
 ['10008-STD-6-TEL-011','R00','§7.2.1.3, §7.2.2.2, §7.3.2','Core / Distribution / Access, Firewall / DMZ และทดสอบเครือข่ายจริงหรือจำลอง'],
 ['10006-STD-6-ICT-003','R00','§8.6, §9.2','สเปกสายข้อมูลใน/นอกอาคารและการทดสอบสาย ใช้กับแถวสาย LAN'],
 ['10008-STD-6-INT-001','R00','§7.2.1','ITP รายอุปกรณ์และกิจกรรม ระบุขั้นตอน เกณฑ์รับและหลักฐาน'],
];
const phi=['MM-ASK-1A-APF-TEL-PHI-0001','B1','Table 7-7'];
const dts=['MM-ASK-1A-APF-TEL-DTS-0001','B1','Sheets 7–8, 10'];
const mr=['MM-ASK-1A-APF-TEL-MR-0001','B1','Appendix 10'];
const spe=clause=>['MM-ASK-1A-APF-TEL-SPE-0002','B1',clause];
const mrSupply=['MM-ASK-1A-APF-TEL-MR-0001','B1','Appendix 1.3 pp. 14–16'];
const sheet=n=>[dts[0],dts[1],'Sheet '+n];
const currentLines=(...ids)=>ids.map(id=>'LINE-MGW-CURRENT-LAN-'+id);
const firewallLines=currentLines('APF-9-02','ACP-6-02');
const firewallMtbf='Palo Alto Networks ระบุ MTBF ของตระกูล PA-400 ที่ 29 ปี ต้องยืนยันรุ่นที่ผ่าน throughput และหน้าที่ก่อนใช้กับ C2';
const scenarios={
 core:{partNo:'C9500-48Y4C-A',mtbf:316960,installed:4,source:'https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-9500-series-switches/nb-06-cat9500-ser-data-sheet-cte-en.html',basis:'PHI APF 2 + ACP 2 / รุ่นอ้างอิงในแพ็กเกจ'},
 industrial:{partNo:'IE-9320-24P4X-E',mtbf:489710,source:'https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-ie9300-rugged-series/catalyst-ie9300-rugged-series-ds.html',basis:'เทียบ SKU ตาม Cisco รอยืนยันอักษร I ในใบเสนอราคา'},
 router:{partNo:'C8300-1N1S-4T2X',mtbf:536060,source:'https://www.cisco.com/c/en/us/products/collateral/routers/catalyst-8300-series-edge-platforms/datasheet-c78-744088.html',basis:'รุ่น VTA ใน DTS / จำนวน Working APF เท่านั้น'},
};
const estimateStock=(installed,mtbf)=>evaluateServiceEquation('B5-SPARE-STOCK',{installed,failureRate:1/mtbf,exposureHours:720,coveragePct:99,planned:0,included:0});
const lanSpareScope=[
 {id:'ap',name:'Access Point',refs:[spe('§7.3.5'),sheet(9),mrSupply],ids:['REQ-MR-B1-13-APF-08','REQ-MR-B1-13-ACP-09','REQ-MR-B1-13-AMS01-05'],stock:true,
  action:'DTS ต้องการ 6 GHz แต่ C9105AXI รองรับ 2.4/5 GHz ให้ใช้รุ่นที่ตรง DTS หรือ Deviation ที่อนุมัติแล้วก่อนตั้งราคา C2 และตรวจตำแหน่ง Substation'},
 {id:'access',name:'Access Switch',refs:[spe('§7.3.2'),mrSupply],ids:currentLines('APF-9-05','APF-10-02','ACP-6-04','ACP-7-02','AMS01-4-02'),stock:true,
  action:'ตรวจจำนวนรายตู้, TAG, PoE และส่วนประกอบก่อนยืนยันรายการอะไหล่'},
 {id:'distribution',name:'Distribution Switch',refs:[spe('§7.3.3'),mrSupply],ids:currentLines('APF-9-04'),stock:true,
  action:'ตรวจอะไหล่ตาม ITP และ Part No. ที่เปลี่ยนทดแทนได้ เช่น PSU หรือ uplink module'},
 {id:'core',name:'Core Switch',refs:[spe('§7.3.1'),phi],ids:[],
  action:'PHI ระบุ APF 2 และ ACP 2 ให้ผูกจำนวนติดตั้งกับเจ้าของแพ็กเกจที่มีอยู่ใน Working'},
 {id:'firewall-it',name:'Firewall IT',refs:[sheet(8),phi],ids:firewallLines,shared:true,
  action:'แยกแถว IT/OT และเทียบ PHI Table 7-7 กับ MR, TAG, HA และ throughput ของ IT · '+firewallMtbf},
 {id:'firewall-ot',name:'Firewall OT',refs:[sheet(7),phi],ids:firewallLines,shared:true,
  action:'เทียบจำนวนและบทบาทที่ APF/ACP/AMS01 พร้อมระบุผู้จัดหาฝั่ง Instrument และผู้รับผิดชอบ Interface · '+firewallMtbf},
 {id:'controller',name:'Wireless Controller',refs:[spe('§7.3.4'),sheet(10),mrSupply],ids:currentLines('APF-9-07'),stock:true,
  action:'SPE กำหนด HA และ Cisco ระบุฮาร์ดแวร์รองรับ 250 AP จึงใช้ Working 2 เครื่องตั้งงบเผื่อ ตรวจสิทธิ์ AP และการทำงานระหว่าง failover ก่อนออกฉบับ'},
 {id:'industrial',name:'Industrial Ethernet Switch',refs:[spe('§7.3.8'),sheet(6)],ids:currentLines('ABV01-5-02'),
  action:'ยืนยัน Part No. ที่ ABV01 ให้ตรงกับข้อมูล OEM ก่อนใช้ MTBF'},
 {id:'router',name:'WAN Router',refs:[sheet(2)],ids:['REQ-MR-B1-12-APF-01-RTR','REQ-MR-B1-12-APF-02-RTR','REQ-MR-B1-12-YANGON-01-RTR'],
  action:'ตรวจขอบเขตและรายการอะไหล่กับเจ้าของ Working TEL-VSAT เพื่อคิดครั้งเดียว'},
 {id:'converter',name:'Media Converter',refs:[mrSupply],ids:['REQ-MR-B1-13-APF-09','REQ-MR-B1-13-APF-10','REQ-MR-B1-13-ACP-06'],parent:true,
  action:'แยกจำนวนติดตั้งและ Part No. จาก BOM ใต้ LAN Cabinet ก่อนประเมิน C2'},
];

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

export function LanCusSpareCoverage0550({data,model,onNavigate,disabled=false}){
 const working=model.provisional||model;
 const byId=new Map(working.lines.filter(line=>!line.historicalMgwPackage).map(line=>[line.id,line]));
 const {rows,stock}=lanStockBasis0550(data,model);
 const bindings=(data.bidVolumes?.bindings||[]).filter(binding=>{
  const line=byId.get(binding.lineId);
  return binding.schedule==='C2'&&line?.selected&&line.wbs==='B5'&&line.systemToken==='TEL-LAN';
 });
 return <section className="p55-panel" aria-label="TEL-LAN CUS to C2 coverage">
  <h4>TEL-LAN · ตรวจอุปกรณ์ Active จาก CUS ถึง C2</h4>
  <p>{lanSpareScope.length} รายการตรวจ แยก Firewall IT/OT · แสดงปริมาณใน Working เทียบกับผลสำรอง Start-up และรายการที่จัดเข้า C2 จริง</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="TEL-LAN equipment and C2 status">
   <thead><tr><th>ประเภท / ข้อกำหนด CUS</th><th>Working / ปริมาณติดตั้ง</th><th>ผล B5 / สถานะ C2</th><th>งานที่ต้องตรวจ</th></tr></thead>
   <tbody>{lanSpareScope.map(({id,name,refs,ids,stock:estimate,shared,parent,action})=>{
    const owners=ids.map(lineId=>byId.get(lineId)).filter(line=>line&&(line.selected||id==='router'));
    const parts=new Set(rows.filter(row=>row.selected&&ids.includes(row.line.id)&&row.partNo).map(row=>row.partNo));
    const reserves=estimate?stock.filter(item=>parts.has(item.partNo)&&Number.isSafeInteger(item.count)).map(item=>({item,result:estimateStock(item.count,item.mtbf)})):[];
    const scenario=scenarios[id];
    const scenarioOwners=id==='router'?owners.filter(line=>line.id.includes('-APF-')):owners;
    const scenarioQuantity=scenario?.installed??(scenarioOwners.length&&scenarioOwners.every(line=>line.unit==='SET'&&Number.isSafeInteger(line.quantity))?scenarioOwners.reduce((n,line)=>n+line.quantity,0):null);
    const scenarioResult=scenario&&scenarioQuantity>0?estimateStock(scenarioQuantity,scenario.mtbf):null;
    const matches=shared||parent?[]:bindings.filter(binding=>parts.has(binding.partNo));
    return <tr key={id}>
     <th scope="row">{name}<CusRefs data={data} refs={refs} onNavigate={onNavigate}/></th>
     <td>{shared&&<small>แถว Firewall รวม IT/OT · แสดงเพื่อเทียบ ห้ามบวกซ้ำ</small>}{parent&&<small>แถวตู้ที่เกี่ยวข้อง · ปริมาณตู้แยกจาก Media Converter</small>}
      {owners.length?owners.map(line=><div key={line.id}><button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.line.'+line.id)}>{line.description}</button>{!parent&&<small>{line.quantity??'OPEN'} {line.unit} · {line.systemToken}{!line.selected?' · แถวอ้างอิง':''}</small>}</div>):'OPEN · ยังไม่พบแถว Working แยกประเภท'}
     </td>
     <td>{reserves.filter(({result})=>result.state==='CALCULATED').map(({item,result})=><small key={item.partNo}>{item.partNo} · สำรอง {result.reserve} SET ที่ 30 วัน / 99%{id==='ap'?' · ผลเปรียบเทียบของรุ่นเดิมที่ไม่ตรงข้อ 6 GHz':''}</small>)}
      {scenarioResult?.state==='CALCULATED'&&<small>ประเมินเบื้องต้น {scenario.partNo} · ฐาน {scenarioQuantity} · สำรอง {scenarioResult.reserve} SET ที่ 30 วัน / 99% · {scenario.basis} · <a href={scenario.source} target="_blank" rel="noreferrer">Cisco MTBF</a></small>}
      {matches.length?matches.map(binding=>{const line=byId.get(binding.lineId);return <div key={binding.lineId}><button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.line.'+binding.lineId)}>{binding.partNo} · {line.quantity??'OPEN'} {line.unit}</button><small>จัดลง C2 แล้ว · {Number.isFinite(line.customerUSD??line.provisionalCustomerUSD)?'มีราคาขาย Working':'ราคา OPEN'}</small></div>;}):'OPEN · ยังไม่พบรายการ B5 ที่ผูกกับประเภทนี้ใน C2'}
     </td><td>{action}</td>
    </tr>;
   })}</tbody>
  </table></div>
  <p>รายการตู้, Patch Panel/ODF และสาย ให้ตรวจจาก BOM และ ITP แยกตามกิจกรรม Pre-commissioning, Commissioning และ Start-up</p>
  <div className="p55-review-toolbar">
   <button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.working-preview.step.4',{workingSystem:'TEL-LAN'})}>WP.4 · ตรวจข้อกำหนดและ Mapping</button>
   <button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.group.B5',{workingSystem:'TEL-LAN'})}>Working B5 · ตรวจรายการอะไหล่ LAN</button>
  </div>
 </section>;
}

export function LanCusLine0550({data,line,offer,onNavigate,showQuote=false}){
 const allocation=line.bidPriceAllocation;
 if(allocation?.basisId===APF_LAN_BID_BASIS_0550)return <details>
  <summary>MGW · ขอบเขตเสนอแล้วสำหรับ Working A</summary>
  <p>{allocation.basis} · Core 2 ชุดระบุ Included · Distribution 2 ชุดและ Access 1 ชุดพร้อม SFP ใช้เจ้าของราคาเดิม</p>
  <p>Media Converter ฝั่งสนามอยู่ในชุดโทรศัพท์ Ex · การจัดพอร์ตและคู่ SFP สำหรับ Tie-In 3 ลิงก์ให้ทบทวนใน SI</p>
  <button type="button" onClick={()=>onNavigate?.('bid.vendor.offer.'+MGW_CURRENT_PREFIX_0550+'LAN-APF-9-03')}>ดู Core Switch · Included</button>
  {allocation.ownerIds.map(id=><button key={id} type="button" onClick={()=>onNavigate?.('bid.budget.working.line.'+id)}>
   {data.lines.find(row=>row.id===id)?.description||id}
  </button>)}
  <button type="button" onClick={()=>onNavigate?.('bid.budget.working.line.'+allocation.fieldLineId)}>โทรศัพท์ Ex · Media Converter</button>
  <button type="button" onClick={()=>onNavigate?.('bid.working-preview.step.7',{workingSystem:'TEL-LAN'})}>ตรวจ Tie-In ใน SI WP.7</button>
 </details>;
 const key=offer?.id.slice(MGW_CURRENT_PREFIX_0550.length);
 if(!mgwCurrentOffer0550(offer)||!['LAN-APF-9-02','LAN-APF-9-07'].includes(key)||line.id!=='LINE-MGW-CURRENT-'+key)return null;
 const firewall=key==='LAN-APF-9-02';
 return <details>
  <summary>เทียบ MGW กับ CUS · {firewall?'Firewall IT/OT และ throughput':'Wireless Controller และสิทธิ์ AP'} · OPEN</summary>
  {showQuote&&<><p>รายการทั้งชุดตาม {offer.quoteEvidence.locator}</p><ul>{(offer.quoteEvidence.terms||[]).map((term,i)=><li key={i}>{term}</li>)}</ul></>}
  {firewall?<p>MGW ให้ PA-460 สองชุด ระบุ Firewall 4.2 Gbps และ Threat Prevention 1.8 Gbps ส่วน PHI แยก Firewall IT และ OT ที่ APF อย่างละสองเครื่องแบบ redundant โดย IT ต้องมากกว่า 10 Gbps และ DTS ระบุ Threat Prevention ของ OT 2.2 และ IT 2.6 Gbps ตรวจ TAG, บทบาท, เกณฑ์ทดสอบและขอบเขต HA/DMZ ก่อนยืนยันการใช้งาน</p>:
   <p>DTS กำหนดอย่างน้อย 200 AP, 2,000 clients และ 5 Gbps ส่วน SPE กำหนด High Availability ฮาร์ดแวร์ Catalyst 9800-L รองรับ 250 AP, 5,000 clients และ 5 Gbps ตาม Cisco Table 9 ใช้ Working 2 ชุดประเมินงบ C2 โดยใบ MGW ระบุ 50 AP license ต่อชุด ต้องยืนยันสิทธิ์ AP และการทำงานช่วง failover ก่อนออกฉบับ</p>}
  <CusRefs data={data} refs={[...(firewall?[phi]:[spe('§7.3.4')]),dts,standards[1],standards[3],mr]} onNavigate={onNavigate}/>
 </details>;
}
