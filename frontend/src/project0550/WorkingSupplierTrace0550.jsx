import React,{useMemo,useState} from 'react';
import {amount} from './BidControls';
import {supplierCostProjection0550} from './data/supplierCostProjection0550';
import {mrSupplierLinks0550} from './data/mrSupplierLinks0550';
import {activeSupply0550} from './data/workingOffers0550';
import {SupplierItemSourceText0550} from './SupplierItemSourceText0550';

function SourceAmount({quote}){
 const {totals:t,printed}=quote;
 const show=(s,label)=><span><strong>{label}: {s.totalTHB!==null?amount(s.totalTHB):s.hasConverted?'ยอดที่ทราบ '+amount(s.knownTHB)+' · ยังไม่ครบ':'OPEN'}</strong>{s.native.length>0&&<small>ต้นทาง {s.native.map(n=>amount(n.value,n.currency)).join(' + ')}</small>}{s.missingPrices>0&&<small>ยอดที่ยังไม่แน่นอน / As actual {s.missingPrices} รายการ</small>}{s.missingFX.length>0&&<small>FX ยังไม่ครบ {s.missingFX.join(' / ')}</small>}{s.ambiguous&&<small>พบยอดสุทธิหลายรายการ ต้องทบทวนต้นฉบับ</small>}</span>;
 return <span className="p55-source-amount">
  {printed&&<span><strong>ยอดหน้าสรุปต้นฉบับ ({printed.currency}): {amount(printed.amount,printed.currency)}</strong><small>{printed.thb===null?'THB OPEN':amount(printed.thb)}</small><small>หน้าสรุปกับรายละเอียดขัดกัน: {printed.conflicts.join(' / ')} · ยอดเดิมก่อนตัด PAGA และ DMR จากขอบเขต MGW</small></span>}
  {show(t.base,printed?'รวมรายละเอียด MGW ในขอบเขตปัจจุบัน':t.net?'สุทธิทั้งใบตาม Supplier':'ยอดรายการทั้งใบตาม Supplier')}
  {t.option&&show(t.option,'Option ต้นฉบับแยก')}
  {t.base.rates.some(r=>r.currency!=='THB')&&<small>FX {t.base.rates.filter(r=>r.currency!=='THB').map(r=>'1 '+r.currency+' = '+r.rate+' THB').join(' · ')} · {t.fxDate} · {t.fxSource}</small>}
 </span>;
}
function SourceQuote({quote:q,onNavigate,initiallyOpen=false}){
 const [open,setOpen]=useState(initiallyOpen),[full,setFull]=useState(false),shown=full?q.items:q.relevantItems;
 const linked=q.items.filter(e=>e.uses.length).length;
 return <details className="p55-panel" open={open} data-working-source-quote={q.title} data-source-identity={q.key} onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}>
  <summary>{q.vendor} · {q.title}{q.revision?' · '+q.revision:''} · {q.fileName||'ต้นฉบับ'} · {q.items.length} รายการ{q.printed?'ในขอบเขตปัจจุบัน':'ทั้งใบ'} · พบลิงก์ราคา {linked}/{q.items.length}<SourceAmount quote={q}/><small>{q.owners.length?'พบการใช้ราคาใน Working '+q.owners.length+' เจ้าของ · ไม่ใช่อนุมัติทั้งใบ':'ยังไม่มีเจ้าของราคาที่เลือกจากใบนี้'}</small>{q.systems.length>1&&<small>อ้างอิงใบเดียวกันใน {q.systems.join(' / ')} · ยอดทั้งใบคงเดิมทุกมุมมอง ห้ามบวกรวมซ้ำระหว่างระบบ</small>}</summary>
  {open&&<>
   <p>ต้นทุน Supplier คือราคาต้นฉบับ ไม่ถูกลดลงเพราะจัดสรร A/B/C · NET รวมรายการ Gross แล้ว · Option แยกจาก Base · การใช้เรต/แพ็กเกจไม่ใช่การยืนยัน comply</p>
   {q.items.length!==q.relevantItems.length&&<button type="button" onClick={()=>setFull(v=>!v)}>{full?'ดูเฉพาะรายการที่เกี่ยวข้องกับระบบนี้':'ดูรายการทั้งใบ '+q.items.length+' รายการ'}</button>}
   <div className="p55-table-wrap"><table className="p55-table" aria-label={'Source item Working trace '+q.title}><thead><tr><th>Item / รายการต้นฉบับ</th><th>Qty / Unit</th><th>Unit Price</th><th>Total Price ต้นฉบับ</th><th>การจัดสรร / ใช้เรตใน Working</th></tr></thead><tbody>{shown.map(entry=>{
    const o=entry.offer,n=entry.native;
    return <tr key={o.id} data-working-source-item={o.id}><td><strong>{o.description}</strong><SupplierItemSourceText0550 offer={o}/>{n.option&&<small>OPTION ต้นฉบับ · ไม่รวม Base อัตโนมัติ</small>}<small>{n.locator}</small><button type="button" onClick={()=>onNavigate?.('bid.vendor.offer.'+o.id)}>เปิด Vendor Item {o.supplierQuoteRow?.itemCode||''}</button><small><a href={n.url} target="_blank" rel="noopener noreferrer">เปิดใบเสนอราคาต้นฉบับ</a></small><small>{n.basis}</small></td><td>{n.quantity??'OPEN'} {n.unit}</td><td>{amount(n.rate,n.currency)}{(o.unitCost!==n.rate||o.currency!==n.currency)&&<small>เรตที่บันทึกใน Offer: {amount(o.unitCost,o.currency)} / {o.unit} · ต่างจากต้นฉบับ</small>}</td><td>{Number.isFinite(n.total)?amount(n.total,n.currency):n.totalText||'OPEN · ต้นฉบับไม่ระบุยอดแน่นอน'}</td><td>{entry.uses.map(u=><div key={u.line.id}><strong>Part {u.line.wbs[0]} / {u.line.wbs} → {u.line.customerRowCode||'Customer row OPEN'}</strong><button type="button" onClick={()=>onNavigate?.('bid.budget.working.line.'+u.line.id)}>{u.line.description}</button><small>{u.label}</small></div>)}{entry.stale.map(u=><small key={u.line.id}>ฐานจัดสรรเปลี่ยน · ต้องทบทวน {u.line.id}</small>)}{!entry.uses.length&&!entry.stale.length&&'ยังไม่พบการจัดสรร/ใช้เรตที่เลือก · ไม่ถือว่ารวมแล้ว'}</td></tr>;
   })}</tbody></table></div>
   <details><summary>เจ้าของราคา Working ที่เชื่อมกับใบนี้ · {q.owners.length} รายการ · แยกจากยอด Supplier</summary><ul>{q.owners.map(u=><li key={u.line.id}>{u.line.wbs} · {u.line.description} <button type="button" onClick={()=>onNavigate?.('bid.budget.working.line.'+u.line.id)}>เปิด Working เดิม</button><small>{u.label}</small></li>)}</ul><p>ต้นทุนผสมอาจมีประมาณการงานอื่นเพิ่ม · การจัดสรรหรือแพ็กเกจร่วมไม่ทำให้ยอด Supplier เปลี่ยน และไม่สร้างต้นทุนอีกก้อน</p></details>
  </>}
 </details>;
}
// This is the same immutable source projection, opened beside the MR row.
// Mapping remains in the existing SI editor; no second mapping/price store.
export function WorkingMrSupplierDetails0550({data,line,projection,onNavigate}){
 const [open,setOpen]=useState(false),reqId='REQDEF-'+line.mrRequirementId;
 const {requirements}=mrSupplierLinks0550(data,line),req=requirements.find(r=>r.id===reqId)||requirements[0],offerIds=new Set(requirements.flatMap(r=>r.offerIds||[]));
 const quotes=[...projection.quotes.values()].filter(q=>q.allEntries.some(e=>offerIds.has(e.offer.id)));
 return <details open={open} data-working-mr-vendor={line.id} onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}>
  <summary>รายละเอียด Vendor ตาม Mapping ของ MR · {quotes.length} ใบ · {line.description}</summary>
  {open&&<>
   <p>{line.quantity??'OPEN'} {line.unit} · {line.requirementRef}<br/>Mapping ที่บันทึก: {req?.status||'ยังไม่มี Offer ผูกกับ MR'} · รายการต้นฉบับและการจัดสรร A/B/C อ่านจากข้อมูลเดิม</p>
   <button type="button" onClick={()=>onNavigate('bid.working-preview.requirement.'+(req?.id||reqId))}>เปิด Mapping เดิมของ MR แถวนี้</button>
   {[...offerIds].map(id=><small key={id}>Offer ที่ MR อ้าง: {id}{!data.offers.some(o=>o.id===id)&&' · OFFER MISSING'}</small>)}
   {!quotes.length&&<p>ยังไม่พบใบเสนอราคาต้นฉบับที่เชื่อมกับ MR แถวนี้ · ตรวจ Mapping/แพ็กเกจเดิม ไม่ใช้ใบอื่นแทนโดยอัตโนมัติ</p>}
   {quotes.map(q=><SourceQuote key={q.key} quote={{...q,relevantItems:q.items}} onNavigate={onNavigate} initiallyOpen/>)}
  </>}
 </details>;
}
function MrMapping({data,systemToken,onNavigate}){
 const native=data.lines.filter(l=>l.systemToken===systemToken&&l.wbs==='A'&&l.mrRequirementId),[open,setOpen]=useState(systemToken==='TEL-TELT');
 return <details className="p55-panel" open={open} onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}><summary>MR → ใบเสนอราคา → Working · {native.length} รายการ · Mapping แยกจากต้นทุน</summary>{open&&<div className="p55-table-wrap"><table className="p55-table" aria-label={'MR supplier mapping '+systemToken}><thead><tr><th>MR / สถานที่ / จำนวน</th><th>ใบเสนอราคาที่เชื่อม</th><th>เจ้าของราคา / ขอบเขต</th></tr></thead><tbody>{native.map(line=>{
  const {owner,requirements,links}=mrSupplierLinks0550(data,line);
  return <tr key={line.id}><td>{line.description}<small>{line.quantity??'OPEN'} {line.unit} · {line.requirementRef}</small></td><td>{links.length?links.map(e=><div key={e.id}>{e.offer?<button type="button" onClick={()=>onNavigate?.('bid.vendor.offer.'+e.id)}>{e.offer.quoteRef||e.id} · {e.offer.description}</button>:<small>OPEN · Offer ที่อ้างอิงไม่อยู่ในทะเบียน: {e.id}</small>}<small>{e.labels.join(' / ')} · ไม่ใช่การอนุมัติ comply</small></div>):<small>{line.responsibility==='COMPANY'?'COMPANY จัดหา · ไม่มี Offer TSI ที่เชื่อม':'OPEN · ยังไม่มี Offer เชื่อมกับรายการนี้'}</small>}{requirements.map(r=><small key={r.id}><button type="button" onClick={()=>onNavigate?.('bid.working-preview.requirement.'+r.id)}>{r.title||r.id}</button>สถานะ SI: {r.state||r.status||'OPEN'}</small>)}{!requirements.length&&<small>ยังไม่มี Requirement เชื่อม · ตรวจ WP.7</small>}</td><td>{line.responsibility==='COMPANY'?'COMPANY จัดหา · ไม่คิดราคา TSI':<button type="button" onClick={()=>onNavigate?.('bid.budget.working.line.'+(owner?.id||line.id))}>{owner?.description||'เปิด Working เดิม'}</button>}{owner&&<small>อ้างอิงเจ้าของราคา · {owner.selected?'เลือกใน Working':'ยังไม่เลือกใน Working'} · ตรวจฐานครอบคลุมก่อนยืนยัน INCLUDED</small>}</td></tr>;
 })}</tbody></table></div>}</details>;
}
// Shared across every existing Part-A system/COMMON; no financial/schema writes.
export function WorkingSupplierTrace0550({data,systemToken,onNavigate,projection}){
 const fallback=useMemo(()=>projection?null:supplierCostProjection0550(data),[data,projection]),index=projection||fallback,quotes=index.bySystem.get(systemToken)||[],candidates=index.candidateBySystem.get(systemToken)||[],references=index.referencesBySystem.get(systemToken)||[];
 const estimates=data.lines.filter(l=>l.systemToken===systemToken&&l.wbs==='A'&&activeSupply0550(l)&&!l.offerId&&!l.mgwDetailGroupId&&Number.isFinite(l.manualCost));
 return <div className="p55-supplier-trace" aria-label={'Supplier to Working trace '+systemToken}>
  <div className="p55-review-toolbar"><strong>ราคาผู้ขาย / Vendor · {systemToken}</strong><button type="button" onClick={()=>onNavigate?.('bid.vendor.offers')}>07.2 · เปิดโมดูลราคาผู้ขาย</button><button type="button" onClick={()=>onNavigate?.('bid.working-preview.step.7')}>WP.7 · ตรวจ Mapping Supplier</button></div>
  <p><strong>ต้นทุน Supplier ตามใบเสนอราคาต้นฉบับ · {quotes.length} ใบ</strong><br/>แสดงยอดทั้งใบก่อนการจัดสรร A/B/C · หลายใบ/Revision/ทางเลือกไม่ใช่ยอดจัดซื้อรวม · การแปลง THB ใช้ FX โครงการโดยคงสกุลเงินต้นฉบับ</p>
  {!quotes.length&&<p>ยังไม่มีรายการต้นฉบับในทะเบียน Vendor สำหรับระบบนี้ · Working อาจเป็นราคาอ้างอิง/ประมาณการ หรือ COMPANY จัดหา · ไม่ใช่ต้นทุน Supplier เป็นศูนย์</p>}
  {estimates.length>0&&<details className="p55-panel"><summary>ฐานราคา Working ที่ไม่มี Offer · {estimates.length} รายการ · ไม่ใช่ราคาผู้ขายต้นฉบับ</summary><p>ฐานราคาของระบบแยกจาก Mapping รายข้อ · ต้องตรวจการครอบคลุม MR ก่อนยืนยันรวมแล้ว</p>{estimates.map(l=><div key={l.id}><button type="button" onClick={()=>onNavigate?.('bid.budget.working.line.'+l.id)}>{l.description}</button><small>ต้นทุนต่อหน่วย {amount(l.manualCost,l.currency)} × {l.quantity??'OPEN'} {l.unit}</small><p>{l.sourceRef}</p></div>)}</details>}
  {quotes.map(q=><SourceQuote key={q.key} quote={q} onNavigate={onNavigate}/>)}
  {candidates.length>0&&<details className="p55-panel"><summary>ใบอ้างอิงจาก Mapping / Working · {candidates.length} ใบ · ยังไม่ใช่ใบเสนอราคาครบระบบนี้</summary><p>เป็นลิงก์ประกอบจาก SI หรือการจัดสรร ไม่ได้เปลี่ยนขอบเขตต้นฉบับของ Supplier และไม่ยืนยันว่ารวมอุปกรณ์ครบระบบ</p>{candidates.map(q=><SourceQuote key={q.key} quote={q} onNavigate={onNavigate}/>)}</details>}
  <MrMapping data={data} systemToken={systemToken} onNavigate={onNavigate}/>
  {references.length>0&&<details className="p55-panel"><summary>ฐานราคาอ้างอิงเดิม · {references.length} รายการ · ไม่ใช่ยอดต้นฉบับที่ยืนยันแล้ว</summary><ul>{references.map(e=><li key={e.offer.id}>{e.offer.quoteRef} · {e.offer.description} <button type="button" onClick={()=>onNavigate?.('bid.vendor.offer.'+e.offer.id)}>เปิดฐานเดิม</button></li>)}</ul></details>}
 </div>;
}
