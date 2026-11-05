import React,{useState} from 'react';
import {mgwDetailGroupBasis0550} from './data/mgwDetailPricing0550';
import {MGW_QUOTE_0550,mgwQuoteItem0550} from './data/mgwVendorBasis0550';
import {amount} from './BidControls';

export function WorkingLineSource0550({data,line,onNavigate}){
 const [open,setOpen]=useState(false);
 const basis=line.mgwDetailGroupId?mgwDetailGroupBasis0550(data,line.mgwDetailGroupId,line):null;
 if(!basis)return line.offer?.quoteRef||line.sourceRef?.length<=160?line.offer?.quoteRef||line.sourceRef:<details><summary>ฐานราคา / ต้นทาง</summary><p>{line.sourceRef}</p></details>;
 return <div data-working-mgw-basis={line.id}>
  <strong>{MGW_QUOTE_0550.quoteRef} · {basis.source.rows.length} รายการที่ใช้คำนวณ</strong>
  <details onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}><summary>รายการและปริมาณที่ใช้ในแพ็กเกจ</summary>
   {open&&<ul className="p55-working-source-items">{basis.source.rows.map((r,i)=>{
    const offers=basis.offers[i],offer=offers.length===1?offers[0]:null,native=offer&&mgwQuoteItem0550(offer);
    return <li key={r.rowId}>{r.rowId} · {offer?.description||'เรตต้นทาง OPEN'}<small>ปริมาณ Working {r.quantity} {r.unit} × {amount(offer?.unitCost,offer?.currency||'USD')}{native&&` · Qty ต้นฉบับ ${native.quantity} ${native.sourceUnit||native.unit||'OPEN'}`}</small>{offer&&<button type="button" onClick={()=>onNavigate?.('bid.vendor.offer.'+offer.id)}>ตรวจเรต {native?.sn||r.rowId}</button>}</li>;
   })}</ul>}
  </details>
  <details><summary>หลักฐานและข้อจำกัดของฐานแพ็กเกจ</summary><p>{line.sourceRef}</p><small>Source version: {basis.source.quoteVersion}</small><small>Source SHA-256: {basis.source.sourceSha256}</small></details>
 </div>;
}

// Presentation of canonical links only. A shared price owner may support many
// requirements; opening this list neither duplicates prices nor approves mapping.
export function workingRequirementIndex0550(requirements){
 const index=new Map();
 for(const requirement of requirements)for(const id of requirement.workLineIds){
  if(!index.has(id))index.set(id,[]);
  index.get(id).push(requirement);
 }
 return index;
}
export function WorkingRequirementTrace0550({requirements=[],onNavigate}){
 const [open,setOpen]=useState(false);
 if(!requirements.length)return <small>ยังไม่มีข้อกำหนดเชื่อมกับเจ้าของราคานี้</small>;
 return <details className="p55-working-requirement-trace" onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}>
  <summary>ข้อกำหนด / CAL–RPT / Supplier · {requirements.length} ข้อ</summary>
  {open&&<ul>{requirements.map(q=><li key={q.id}>
   <button type="button" onClick={()=>onNavigate?.('bid.working-preview.requirement.'+q.id)}>{q.title||q.id}</button>
   <small>{q.id} · {q.site||q.systemToken} · {q.state||q.status||'OPEN'}</small>
  </li>)}</ul>}
 </details>;
}

// Display registered alternatives as evidence to inspect, never infer that a
// higher-looking quotation number replaces the owner's saved selection.
export function WorkingQuoteBasis0550({data,line,projection,onNavigate}){
 const sources=[...projection.quotes.values()];
 const offer=data.offers.find(o=>o.id===line.offerId);
 const used=sources.filter(q=>q.owners.some(u=>u.line.id===line.id)||offer&&q.allEntries.some(e=>e.offer.id===offer.id||e.offer.quoteEvidence?.workingReferenceOfferIds?.includes(offer.id)));
 const others=offer?sources.filter(q=>!used.includes(q)&&q.systems.includes(line.systemToken)&&q.allEntries.some(e=>e.offer.vendorId===offer.vendorId)):[];
 if(!offer&&!used.length)return null;
 return <div className="p55-working-quote-basis" data-working-quote-basis={line.id}>
  {offer&&<small>Offer ที่ผูก: {offer.quoteRef||'เลขที่ OPEN'} · Revision {offer.quoteEvidence?.revision||'ไม่ระบุ'}<button type="button" onClick={()=>onNavigate?.('bid.vendor.offer.'+offer.id)}>ตรวจ Offer ที่ผูก</button></small>}
  {used.map(q=><small key={q.key}>ต้นฉบับที่เชื่อม: {q.title}{q.revision?' · Revision '+q.revision:''} · {q.fileName||'ดูทะเบียนต้นฉบับ'}</small>)}
  {others.length>0&&<details><summary>ใบอื่นของผู้ขายในระบบเดียวกัน · {others.length} ใบ · ยังไม่ใช้ในแถวนี้</summary><p>ต้องเทียบขอบเขตและฉบับก่อนเปลี่ยนราคา ใบอื่นอาจเป็นทางเลือกหรือขอบเขตต่างกัน</p>{others.map(q=>{
   const target=q.allEntries.find(e=>e.offer.supplierQuoteRow?.classification==='NET_PACKAGE')||q.allEntries[0];
   return <button type="button" key={q.key} onClick={()=>onNavigate?.('bid.vendor.offer.'+target.offer.id)}>{q.title} · Revision {q.revision||'ไม่ระบุ'}</button>;
  })}</details>}
 </div>;
}
