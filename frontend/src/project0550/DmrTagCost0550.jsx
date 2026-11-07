import React,{useMemo,useState} from 'react';
import {amount} from './BidControls';
import {MR_WORKING_CATALOG_0550} from './data/mrWorkingBasis0550';
import {CERAGON_LINK_OWNER_0550,CERAGON_R11_0550,CERAGON_R12_0550,CERAGON_R11_BOQ_REVIEW_0550,DMR_MR_0550,ceragonR11RequirementSite0550,
 ceragonR11Dts0550,ceragonR11ScopeCheck0550,dmrDtsEquipment0550,dmrMrAdditionalScope0550} from './data/ceragonSelection0550';

const workRoute='bid.budget.working.line.';
const partTitles={A:'อุปกรณ์และสายตามตำแหน่ง / TAG',B:'วิศวกรรม บริการ และต้นทุนโครงการ',C:'ทางเลือกและอะไหล่ระยะใช้งาน'};
const physicalClauses=new Set([1,2,14,15,16,23]);
const qty=(value,unit)=>value==null?'OPEN':value+' '+unit;

export function dmrTagCostView0550(data,integration,working,lineId){
 const mrRows=MR_WORKING_CATALOG_0550.rows.filter(r=>r.systemToken==='TEL-DMR'&&r.wbs==='A'&&/^MR-B1-15-/.test(r.id));
 const requirements=(integration?.requirements||[]).filter(ceragonR11RequirementSite0550);
 const dts=ceragonR11Dts0550(data);
 const owners=new Map((working?.lines||[]).map(l=>[l.id,l]));
 const owner=owners.get(CERAGON_LINK_OWNER_0550);
 const activePackage=owner?.selected&&owner.offerId===CERAGON_R11_0550;
 const sites=lineId?mrRows.filter(r=>'REQ-'+r.id===lineId).map(r=>r.site):['APF','ACP'];
 const allEquipment=mrRows.flatMap(mr=>{
  const id='REQDEF-'+mr.id;
  const requirement=requirements.find(r=>r.id===id)||{id,site:mr.site,systemToken:mr.systemToken,offerIds:[],workLineIds:[]};
  const checks=requirement.dmrChecks||ceragonR11ScopeCheck0550(requirement,mr,null,dts,[]);
  return checks.map(check=>{
   const packageRef=activePackage&&check.vendorReference?.parts.length>0;
   const bindings=(requirement.tagBindings||[]).filter(b=>check.tag&&b.tag===check.tag&&b.site===check.site);
   const boundRefs=[...new Set(bindings.flatMap(b=>b.workLineIds).filter(id=>requirement.workLineIds.includes(id)&&id!==CERAGON_LINK_OWNER_0550&&owners.get(id)?.wbs==='A'))];
   const location=check.tag?(check.location||'ตำแหน่งติดตั้ง OPEN'):'แนวสายและจุดต่อ · ตรวจ Cable LIS รายช่วง';
   return {...check,id:id+'/'+check.component,requirementId:id,mrLineId:'REQ-'+mr.id,location,packageRef,
    tagQuantityOpen:check.tag&&check.source&&check.required>1,
    workLineIds:[...(packageRef?[CERAGON_LINK_OWNER_0550]:[]),...boundRefs],
    label:check.tag&&(!check.source||!check.location)?'ตรวจ TAG / ตำแหน่ง':
     check.component==='IDU'?'ทางเลือก Full Outdoor · ตรวจหน้าที่ IDU':
     check.component==='สายและ Interface'?'ตรวจชนิดสาย / ความยาว / ของประกอบ':
     check.state==='DEVIATION_PENDING'?'พบใน R11 บางจำนวน · ตรวจส่วนต่าง':
     packageRef?'พบรายการใน R11 · ตรวจขอบเขต':'ตรวจผู้จัดหาและฐานราคา'};
  });
 });
 const equipment=allEquipment.filter(r=>!lineId||r.mrLineId===lineId);
 const cabinet=dmrDtsEquipment0550(dts,'MR-320','Microwave System Cabinet');
 const locationRef=(site,component)=>{
  const row=allEquipment.find(r=>r.site===site&&r.component===component);
  return row?.source&&row.location&&row.location!=='ตำแหน่งติดตั้ง OPEN'?`${row.tag} · ${row.location}`:'ตำแหน่ง / TAG รอยืนยัน';
 };
 for(const row of equipment.filter(r=>r.mrComponents?.length)){
  row.routes=row.mrComponents.map(title=>{
   const endpoints=title.match(/from Microwave (IDU|ODU) to (?:Microwave )?(ODU|Antenna)$/i);
   return {title,endpoints:endpoints?.slice(1).map(c=>locationRef(row.site,c)).join(' → ')};
  });
 }
 const scope=dmrMrAdditionalScope0550(mrRows.map(r=>({id:'REQDEF-'+r.id,site:r.site})));
 const additional=scope.filter(r=>!r.requirementId||!lineId||'REQ-'+r.requirementId.slice(7)===lineId).map(r=>{
  const part=r.bullets?.includes(11)?'C':r.bullets&&!physicalClauses.has(r.bullets[0])?'B':'A';
  const site=ceragonR11RequirementSite0550({id:r.requirementId||''})||'APF–ACP';
  return {...r,part,site,workLineIds:(r.workLineIds||[]).filter(id=>owners.get(id)?.wbs.startsWith(part)),
   location:r.requirement?.startsWith('Microwave Cabinet')?cabinet.location||'ตำแหน่งติดตั้ง OPEN':
    site==='ACP'?locationRef('ACP','IDU'):r.requirement?.startsWith('Access Switch')?'ตำแหน่งติดตั้ง / TAG OPEN':null,
    source:r.requirement?.startsWith('Microwave Cabinet')?cabinet.source:
     site==='ACP'?allEquipment.find(row=>row.site==='ACP'&&row.component==='IDU')?.source:null};
 });
 const capitalId='REQ-MR-ACT-C2-D02';
 const capital=owners.get(capitalId);
 const spareId=CERAGON_R12_0550;
 additional.push({part:'C',site:'APF–ACP',title:'Capital Spares · ODU สำรอง 2 ตัว',reference:'CERAGON Rev.A1 R12 / C2',
  action:'เชื่อมกับรุ่น ODU ของลิงก์ · ตรวจรายการอะไหล่ที่ต้องจัดซื้อและความเข้ากันได้ · คิดราคา 1 Lot ตาม Working',
  workLineIds:capital?.offerId===spareId?[capitalId]:[],offerIds:[spareId]});
 const projectCostRefs=[
  {part:'B',title:'Site Survey / ตรวจจุดติดตั้ง',reference:'Working B7',workLineIds:['REQ-MR-ACT-B7-D01'],action:'ตรวจพื้นที่ติดตั้งและเส้นทางสาย APF/ACP'},
  {part:'B',title:'RF Licence / ค่าธรรมเนียมที่เกี่ยวข้อง',reference:'Working B8',workLineIds:['REQ-MR-ACT-B8-D05'],action:'ตรวจฐานความถี่และส่วนที่จัดสรรให้ลิงก์นี้'},
  {part:'C',title:'Installation Option',reference:'Working C1',workLineIds:['REQ-MR-ACT-C1-D01','REQ-MR-ACT-C1-D02'],action:'ตรวจแยกจาก Assistance และ Commissioning ใน Base'},
 ];
 additional.push(...projectCostRefs.map(r=>({...r,site:'APF–ACP',workLineIds:r.workLineIds.filter(id=>owners.has(id))})));
 return {equipment,additional,owners,sites,affectedTags:allEquipment.filter(r=>r.source&&r.tag).map(r=>r.tag),offerIds:new Set(data.offers.map(o=>o.id))};
}

export function DmrTagCost0550({data,integration,working,lineId,onNavigate,onOpenSource=onNavigate}){
 const [part,setPart]=useState('A'),[site,setSite]=useState('');
 const view=useMemo(()=>dmrTagCostView0550(data,integration,working,lineId),[data,integration,working,lineId]);
 const selectedSite=view.sites.includes(site)?site:'';
 const equipment=part==='A'?view.equipment.filter(r=>!selectedSite||r.site===selectedSite)
  .sort((a,b)=>a.site.localeCompare(b.site)||a.location.localeCompare(b.location)):[];
 const additional=view.additional.filter(r=>r.part===part&&(!selectedSite||r.site===selectedSite||r.site==='APF–ACP'));
 const ids=[...new Set([...equipment,...additional].flatMap(r=>r.workLineIds))];
 const jump=(id,label,action=onNavigate)=><button type="button" disabled={!action} onClick={()=>action?.(id)}>{label}</button>;
 const source=r=>r.source&&jump('bid.documents.source.'+r.source.id,r.source.locator,onOpenSource);
 const refs=r=>r.workLineIds.map(id=><div key={id}>{jump(workRoute+id,id===CERAGON_LINK_OWNER_0550?'R11 · เจ้าของต้นทุนลิงก์':view.owners.get(id)?.description||id)}</div>);
 return <section className="p55-panel" aria-label="DMR TAG cost coverage">
  <h4>DMR · ตรวจความครบของต้นทุนตาม TAG / Location</h4>
  <p>{lineId?`รายการ Working ${lineId} · B/C แสดงงานร่วมของลิงก์`:'APF–ACP · ตรวจจาก MR และจุดติดตั้งก่อนกำหนดต้นทุน'} · OPEN = รอหลักฐานหรือฐานราคา</p>
  <div className="p55-bid-areas" role="group" aria-label="DMR cost part">
   {Object.entries(partTitles).map(([key,title])=><button type="button" key={key} aria-pressed={part===key} onClick={()=>setPart(key)}>Part {key} · {title}</button>)}
  </div>
  {part==='A'&&view.sites.length>1&&<div className="p55-bid-areas" role="group" aria-label="DMR site filter">
   {['',...view.sites].map(key=><button type="button" key={key} aria-pressed={selectedSite===key} onClick={()=>setSite(key)}>{key||'ทุกไซต์'}</button>)}
  </div>}
  <div className="p55-review-toolbar">{jump('bid.working-preview.step.7','WP.7 · ตรวจ Mapping')}
   <a href={DMR_MR_0550} target="_blank" rel="noreferrer">MR Rev.B1</a>
   <a href={CERAGON_R11_BOQ_REVIEW_0550.url} target="_blank" rel="noreferrer">CERAGON BoQ</a>
  </div>
  {part!=='A'&&<p>ขอบเขตงานอ้างอิงลิงก์ APF–ACP · TAG ที่พบใน DTS {view.affectedTags.join(' · ')||'OPEN'} · ปริมาณและต้นทุนงานร่วมใช้ฐานกิจกรรมหรือแพ็กเกจเดิม</p>}
  {part==='A'&&<p>MR และตำแหน่งจาก DTS ใช้ตรวจขอบเขต · P/N และจำนวน R11 ใช้ตรวจว่าผู้ขายเสนออะไร · ช่องว่างที่พบต้องมีเจ้าของงานหรือฐานจัดหาเพิ่ม</p>}
  {part==='A'&&<div className="p55-table-wrap"><table className="p55-table" aria-label="DMR TAG and location cost rows">
   <thead><tr><th>ไซต์ / ตำแหน่ง</th><th>TAG / รายการตาม MR</th><th>CUS Qty</th><th>R11 Qty / BOM</th><th>สถานะและต้นทุน Working</th></tr></thead>
   <tbody>{equipment.map(r=><tr key={r.id}><td>{r.site}<small>{r.location}</small></td>
    <td><strong>{r.tag?(r.source?r.tag:`TAG รอยืนยัน · ${r.tag}`):'Interface รายไซต์'}</strong><small>{r.component}</small>
     {r.routes?.length>0&&<ul>{r.routes.map(route=><li key={route.title}>{route.title}{route.endpoints&&<small>{route.endpoints}</small>}</li>)}</ul>}
     {source(r)}{r.cusReference&&<small><a href={r.cusReference.url} target="_blank" rel="noreferrer">{r.cusReference.label}</a></small>}
    </td><td>{qty(r.required,r.unit)}{r.tagQuantityOpen&&<small>แถวนี้อ้าง 1 TAG จาก DTS · รอยืนยันจำนวนที่ TAG ครอบคลุม</small>}
     {r.routes&&<small>ยอดรวมต่อไซต์ · ความยาวรายช่วง OPEN</small>}</td>
    <td>{qty(r.offered,r.offerUnit)}{r.routes&&r.offered!=null&&<small>ระยะที่ Offer ระบุสำหรับจุดต่อแบบ Full Outdoor</small>}{r.vendorReference?.parts.length>0&&<details><summary>ชิ้นส่วน / License / อุปกรณ์ประกอบ</summary>
     <ul>{r.vendorReference.parts.map(p=><li key={p.locator}>{p.part} · {p.locator}{p.quantity!=null&&` · Qty ${p.quantity}`}{p.note&&` · ${p.note}`}</li>)}</ul></details>}</td>
    <td><strong>{r.label}</strong><small>{r.reason}</small>{r.packageRef&&<small>อ้างต้นทุน R11 ทั้งลิงก์ · ยอดในทะเบียนเจ้าของด้านล่าง</small>}
     {refs(r)}{jump('bid.working-preview.requirement.'+r.requirementId,'เปิดข้อกำหนด')}</td></tr>)}</tbody>
  </table></div>}
  <div className="p55-table-wrap"><table className="p55-table" aria-label={'DMR additional cost scope '+part}>
   <thead><tr><th>ไซต์ / หลักฐาน</th><th>ขอบเขตประกอบ</th><th>สิ่งที่ต้องตรวจเพื่อคิดต้นทุน</th></tr></thead>
   <tbody>{additional.map(r=><tr key={r.title}><td>{r.site}<small>{r.reference}</small>{source(r)}</td>
    <td><strong>{r.title}</strong>{r.requirement&&<small>{r.requirement}</small>}{r.location&&<small>{r.location}</small>}</td>
    <td><strong>OPEN · ตรวจความครอบคลุม</strong><small>{r.action}</small>{refs(r)}
     {r.requirementId&&jump('bid.working-preview.requirement.'+r.requirementId,'เปิดข้อกำหนด')}
     {r.offerIds?.filter(id=>view.offerIds.has(id)).map(id=><div key={id}>{jump('bid.vendor.offer.'+id,'CERAGON '+id.split('-').at(-1))}</div>)}</td></tr>)}</tbody>
  </table></div>
  {ids.length>0&&<details><summary>ต้นทุน Working ตามเจ้าของเดิม · {ids.length} รายการอ้างอิง</summary>
   <p>ยอดต่อเจ้าของ แสดงครั้งเดียวในมุมมองนี้ · งาน COMMON เป็นยอดร่วมโครงการ · ตรวจส่วนที่ครอบคลุม DMR ก่อนจัดสรร</p>
   <ul>{ids.map(id=>{const line=view.owners.get(id);return <li key={id}>{jump(workRoute+id,line.description)}
    <small>{line.wbs} · {line.systemToken} · {qty(line.quantity,line.unit)} · {line.selected?amount(line.provisionalCostNative,line.currency):'รอเลือกใช้'}{line.offerId?' · Offer':' · ฐานภายใน / ประมาณการ'}</small></li>;})}</ul>
  </details>}
 </section>;
}

export function DmrTagCostDetails0550(props){
 const [open,setOpen]=useState(false);
 return <details onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}>
  <summary>ตรวจ TAG / Location และต้นทุนประกอบ</summary>
  {open&&<DmrTagCost0550 {...props}/>}
 </details>;
}
