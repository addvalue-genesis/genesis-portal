import {currentSupplierOffers0550} from "./data/mgwVendorBasis0550";
import React,{useMemo,useState} from 'react';
import {SYSTEMS} from './data';
import {useBidWorkspace} from './BidWorkspaceContext';
import {deriveControlledTagMapping0550} from './data/controlledTagMapping0550';
import {customerTagCatalogue0550,tagCandidatesForRequirement0550} from './data/tagEvidence0550';
import {TAG_MAPPING_RULE_VERSION} from '../common/engineering/controlledTagMappingV2';
import {amount} from './BidControls';
import {newId} from './data/bidWorkspaceModel';

export function ControlledTagMapping0550({system='ALL',onNavigate,summaryOnly=false}){
 const {data,model,reviewDate}=useBidWorkspace(),[query,setQuery]=useState(''),[limit,setLimit]=useState(25);
 const view=useMemo(()=>data&&model?deriveControlledTagMapping0550(data,model,SYSTEMS,reviewDate):null,[data,model,reviewDate]);
 if(!view)return null;
 const rows=view.rows.filter(r=>(system==='ALL'||r.systemToken===system||r.systemToken==='COMMON')&&[r.id,r.title,r.site,...r.links.map(t=>t.tag)].join(' ').toLowerCase().includes(query.toLowerCase()));
 const download=()=>{const report={projectId:'PJ2608-0550',ruleVersion:view.ruleVersion,pricingPolicy:view.pricingPolicy,internalReview:true,issueAuthorized:false,uniqueOwners:view.uniqueOwners,knownUSD:view.knownUSD,systems:view.systems,rows:view.rows.map(({requirement,candidates,...r})=>({...r,candidates:candidates.map(({source,...t})=>t)}))};const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='PJ2608-0550_Internal_MAP_Tag_Review.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 return <section className="p55-panel" aria-label={summaryOnly?"Customer TAG Supplier mapping summary":"Customer TAG Supplier mapping"}>
  <h3>รายการลูกค้า ↔ TAG ↔ Supplier Item ↔ แบบลูกค้า / VDRL</h3>
  <p>ใช้กฎ MAP-01–10 รุ่น {view.ruleVersion} · สมการราคาและนโยบายปัดเศษเดิม · ตารางนี้คำนวณผลตรวจให้แล้ว การเปิดดูไม่เขียนข้อมูลหรืออนุมัติแทนผู้ทบทวน</p>
  <p><strong>ราคาที่มีจาก {view.uniqueOwners} เจ้าของต้นทุน · ขาดฐานตัวเลข {view.priceOpen} เจ้าของ · ยอดที่ทราบ {amount(view.knownUSD,'USD')}</strong><br/>ยอดรายระบบอาจอ้างเจ้าของร่วม ห้ามบวกรวมตารางระบบซ้ำ · TAG ยังไม่ยืนยันไม่ทำให้ราคาที่มีหายไป</p>
  <div className="p55-review-toolbar"><button type="button" onClick={download}>Export Internal Mapping Review</button><button type="button" onClick={()=>onNavigate('bid.quotation')}>แบบราคาลูกค้า Volume I</button><button type="button" onClick={()=>onNavigate('bid.technical.vdrl')}>เอกสารส่งมอบ / VDRL</button></div>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Nineteen-system mapping readiness"><thead><tr><th>ระบบ</th><th>ฐานราคาเดิม</th><th>TAG ลูกค้า / ผล Mapping</th></tr></thead><tbody>{view.systems.map(s=><tr key={s.token} data-tag-system={s.token}><td>{s.name}<small>{s.token}</small></td><td>{s.pricedOwners} เจ้าของมีราคา · ฐานขาด {s.priceOpen}<small>{amount(s.knownUSD,'USD')} · อ้างอิง ห้ามบวกซ้ำ</small></td><td>อุปกรณ์ {s.physical} ข้อ · TAG ที่ผูก/หลักฐานปัจจุบัน {s.tagLinked}<small>แถวอ้างอิง TAG ที่ค้นพบ {s.candidateTags} · ผ่าน Mapping {s.mappingComplete}/{s.requirements}</small><button type="button" onClick={()=>onNavigate(s.token==='COMMON'?'bid.budget.working.lines':'bid.budget.working.group.'+s.token)}>เปิด Working เดิม</button></td></tr>)}</tbody></table></div>
  {!summaryOnly&&<><label>ค้นหารายการลูกค้า / TAG<input aria-label="Search customer TAG mapping" value={query} onChange={e=>{setQuery(e.target.value);setLimit(25);}}/></label>
  <p>แสดง {Math.min(limit,rows.length)} / {rows.length} รายการ · แถวเอกสาร/บริการไม่ถูกสร้างเป็น TAG อุปกรณ์</p>
  {rows.slice(0,limit).map(r=><details key={r.id} data-tag-mapping={r.id}><summary>{r.site} · {r.title} · {r.mappingComplete?'Mapping ผ่านผลตรวจ':'ตรวจหลักฐาน Mapping'} · {r.priceAvailable?'มีฐานราคาเดิม':'ตรวจฐานราคา'}</summary><p>เจ้าของราคา: {r.ownerIds.join(' / ')||'ยังไม่ผูก'}<br/>แบบลูกค้า: {r.customerRowCodes.join(' / ')||'ยังไม่ผูก'} · VDRL: {r.vdrlIds.join(' / ')||'ตรวจเอกสารที่เกี่ยวข้อง'}</p><ul>{r.stages.map(c=><li key={c.id}>{c.id} · {c.state} · {c.reason}</li>)}</ul>{r.links.map(b=><p key={b.id}>{b.site} / {b.tag} · {b.quantity} {b.unit} · {b.locator}</p>)}<p>TAG อ้างอิงที่พบ {r.candidates.length} แถว · ฉบับย้อนหลัง/ชื่อคล้ายกันเป็นเพียงข้อมูลให้ตรวจ</p><button type="button" onClick={()=>onNavigate('bid.working-preview.requirement.'+r.id)}>เปิด Mapping เดิม / หลักฐาน TAG</button></details>)}
  {rows.length>limit&&<button type="button" onClick={()=>setLimit(n=>n+25)}>แสดงอีก 25 รายการ</button>}</>}
 </section>;
}

export function RequirementTagBindings0550({data,requirement,onChange,onOpenSource}){
 const catalogue=useMemo(()=>customerTagCatalogue0550(data),[data]),candidates=tagCandidatesForRequirement0550(requirement,catalogue),bindings=requirement.tagBindings||[];
 const offers=currentSupplierOffers0550(data,requirement.systemToken),parents=offers.filter(o=>requirement.offerIds.includes(o.id)),supplierOptions=offers.filter(o=>parents.some(p=>p.id===o.id||o.supplierQuoteRow?.parentOfferId===p.id));
 const set=(id,key,value)=>onChange(bindings.map(b=>b.id===id?{...b,[key]:value}:b));
 const add=t=>onChange([...bindings,{id:newId('TAGMAP'),tag:t.tag,site:t.site,sourceId:t.sourceId,locator:t.locator,excerpt:t.excerpt,quantity:t.quantity,unit:t.unit,offerIds:[],workLineIds:[],vdrlIds:[],basis:'DRAFT / source row reference; verify function, current revision, supplier items and unique ownership.',ruleVersion:TAG_MAPPING_RULE_VERSION}]);
 const multi=(label,value,options,change)=><label>{label}<select aria-label={label} multiple value={value} onChange={e=>change([...e.target.selectedOptions].map(o=>o.value))}>{options.map(o=><option key={o.id} value={o.id}>{o.label||o.description||o.title||o.id}</option>)}</select></label>;
 return <fieldset aria-label="Customer TAG evidence bindings"><legend>รายการลูกค้า ↔ TAG · เก็บใน Mapping เดิม</legend><p>APF/ACP เป็นสถานที่ ไม่ใช่หลักฐานยืนยัน TAG · การอ้างแถวเป็นร่าง ไม่ยืนยันสเปกหรือเปลี่ยนราคา</p>
  <details><summary>แถว TAG ในเอกสารลูกค้าที่ค้นพบ {candidates.length} รายการ</summary>{candidates.slice(0,150).map(t=><div key={t.id}><strong>{t.site} / {t.tag} · {t.quantity} {t.unit}</strong><p>{t.description}</p><small>{t.revision} · {t.authority} · {t.locator}</small><button type="button" onClick={()=>onOpenSource('bid.documents.source.'+t.sourceId)}>เปิดต้นฉบับ TAG</button><button type="button" disabled={bindings.some(b=>b.sourceId===t.sourceId&&b.tag===t.tag&&b.locator===t.locator)} onClick={()=>add(t)}>อ้างแถวนี้เป็นร่าง TAG</button></div>)}{candidates.length>150&&<p>แสดง150แถวแรก · ระบุ TAG/หลักฐานให้ตรงข้อกำหนด ไม่เลือกจากชื่อคล้ายกันอย่างเดียว</p>}</details>
  {bindings.map(b=><div className="p55-panel" key={b.id} data-tag-binding={b.id}><strong>{b.site} / {b.tag}</strong><p>{b.quantity} {b.unit} · {b.locator}</p><p style={{whiteSpace:'pre-wrap'}}>{b.excerpt}</p><label>TAG mapping basis<input aria-label="TAG mapping basis" value={b.basis} onChange={e=>set(b.id,'basis',e.target.value)}/></label>{multi('TAG supplier Item IDs',b.offerIds,supplierOptions,v=>set(b.id,'offerIds',v))}{multi('TAG Working references',b.workLineIds,data.lines.filter(l=>requirement.workLineIds.includes(l.id)),v=>set(b.id,'workLineIds',v))}{multi('TAG VDRL document IDs',b.vdrlIds,data.bidVolumes?.vdrl||[],v=>set(b.id,'vdrlIds',v))}<button type="button" onClick={()=>onChange(bindings.filter(x=>x.id!==b.id))}>ลบการเชื่อม TAG นี้</button></div>)}
  {!bindings.length&&<p>ยังไม่มี TAG ที่บันทึกกับรายการนี้ · ใช้ฐานราคาเดิมเตรียมร่างต่อพร้อมตรวจ Mapping ได้</p>}
 </fieldset>;
}
