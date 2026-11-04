import React,{useMemo} from 'react';
import {amount} from './BidControls';
import {vendorOfferEntries0550,groupVendorOffers0550,vendorQuoteTotals0550} from './data/vendorRegister0550';
import {activeSupply0550} from './data/workingOffers0550';

// Detail inside the existing Working group; no records, price owners or IDs are
// created here. Source item amounts never contribute to Working totals.
export function WorkingSupplierTrace0550({data,systemToken,onNavigate}){
 const quotes=useMemo(()=>{
  const entries=vendorOfferEntries0550(data).filter(e=>e.systemTokens.includes(systemToken)&&e.offer.quoteEvidence&&!e.referenceOnly);
  return groupVendorOffers0550(entries,'company',[]).flatMap(g=>g.children.flatMap(c=>c.quotes.map(q=>({...q,vendor:g.title}))));
 },[data,systemToken]);
 const native=data.lines.filter(l=>l.systemToken===systemToken&&l.wbs==='A'&&l.mrRequirementId);
 const requirements=data.integrationWorkspace?.requirements||[];
 const openLine=line=>onNavigate?.('bid.budget.working.line.'+line.id);
 const usage=entry=>{
  const byId=new Map();
  for(const line of entry.working.filter(activeSupply0550))byId.set(line.id,{line,label:'เลือกใช้ Offer โดยตรง'});
  for(const line of entry.referenceWorking.filter(activeSupply0550))if(!byId.has(line.id))byId.set(line.id,{line,label:'อ้างอิงเจ้าของราคาเดิม · ไม่บวกซ้ำ'});
  for(const u of entry.allocatedWorking.filter(u=>u.current&&activeSupply0550(u.line)))byId.set(u.line.id,{line:u.line,label:u.kind==='ESTIMATE'?'จัดสรรในต้นทุนผสมใบเสนอราคาและประมาณการ':'จัดสรรต้นทุนจากใบเสนอราคา'});
  return [...byId.values()];
 };
 return <div className="p55-supplier-trace" aria-label={'Supplier to Working trace '+systemToken}>
  <p><strong>ใบเสนอราคาต้นฉบับ {quotes.length} ใบ · ตรวจ MR → Vendor → เจ้าของราคา A/B/C</strong><br/>ยอดต้นฉบับเป็นต้นทุนผู้ขายก่อน VAT · รายการอ้างอิงไม่บวกเพิ่มในยอด Working · การจัดสรรราคาไม่ใช่การรับรอง comply</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label={'MR supplier mapping '+systemToken}><thead><tr><th>MR / สถานที่ / จำนวน</th><th>ใบเสนอราคาที่เชื่อม</th><th>เจ้าของราคา Part A</th></tr></thead><tbody>{native.map(line=>{
   const req=requirements.find(r=>r.id==='REQDEF-'+line.mrRequirementId),ids=new Set(req?.offerIds||[]),matched=quotes.filter(q=>q.entries.some(e=>ids.has(e.offer.id))),owner=data.lines.find(l=>l.id===line.coveredByLineId);
   return <tr key={line.id}><td>{line.description}<small>{line.quantity??'OPEN'} {line.unit} · {line.requirementRef}</small></td><td>{matched.length?matched.map(q=><small key={q.key}>{q.title}</small>):'OPEN · ยังไม่พบลิงก์ใบเสนอราคา'}<small>สถานะ SI: {req?.status||'OPEN'}</small></td><td>{owner?<><button type="button" onClick={()=>openLine(owner)}>{owner.description}</button><small>INCLUDED · ไม่คิดราคา MR ซ้ำ</small></>:<button type="button" onClick={()=>openLine(line)}>เปิด Working</button>}</td></tr>;
  })}</tbody></table></div>
  {!quotes.length&&<p>ยังไม่มีรายการต้นฉบับในทะเบียน Vendor สำหรับระบบนี้ · ตรวจข้อมูลโครงการที่โหลดอยู่</p>}
  {quotes.map(quote=>{
   const items=quote.entries.filter(e=>e.offer.supplierQuoteRow?.classification!=='NET_PACKAGE'),total=vendorQuoteTotals0550(quote,data.fx).base;
   const linked=items.filter(e=>usage(e).length).length;
   return <details key={quote.key} className="p55-panel" data-working-source-quote={quote.title}>
    <summary>{quote.vendor} · {quote.title} · {quote.fileName||'ต้นฉบับ'} · {items.length} รายการ · สุทธิ {total.totalTHB===null?'OPEN':amount(total.totalTHB,'THB')} · พบลิงก์ราคา {linked}/{items.length}</summary>
    <p>NET คือยอดสรุปทั้งใบ ไม่ใช่ต้นทุนเพิ่ม · แต่ละ Item ด้านล่างแสดงปลายทางจริงใน A/B/C · แถวต้นทุนผสมอาจมีประมาณการงานอื่นเพิ่ม จึงไม่เท่ากับต้นทุนจาก Item นี้เพียงรายการเดียว</p>
    <div className="p55-table-wrap"><table className="p55-table" aria-label={'Source item Working trace '+quote.title}><thead><tr><th>Item / รายการต้นฉบับ</th><th>Qty / Unit</th><th>Unit Price</th><th>Total Price</th><th>ปลายทาง Working / สถานะ</th></tr></thead><tbody>{items.map(entry=>{
     const o=entry.offer,e=o.quoteEvidence,uses=usage(entry),stale=entry.allocatedWorking.filter(u=>!u.current);
     return <tr key={o.id} data-working-source-item={o.id}><td><strong>{o.description}</strong><small>{e.locator}</small><button type="button" onClick={()=>onNavigate?.('bid.vendor.offer.'+o.id)}>เปิด Vendor Item {o.supplierQuoteRow?.itemCode||''}</button><small><a href={e.sourceUrl} target="_blank" rel="noopener noreferrer">เปิดใบเสนอราคาต้นฉบับ</a></small></td><td>{e.quotedQuantity} {e.quotedUnit}</td><td>{amount(e.quotedUnitCost,e.quotedCurrency)}</td><td>{amount(e.quotedTotal,e.quotedCurrency)}</td><td>{uses.map(u=><div key={u.line.id}><strong>Part {u.line.wbs[0]} / {u.line.wbs} → {u.line.customerRowCode||'Customer row OPEN'}</strong><button type="button" onClick={()=>openLine(u.line)}>{u.line.description}</button><small>{u.label}</small></div>)}{stale.map(u=><small key={u.line.id}>ฐานจัดสรรเปลี่ยน · ต้องทบทวน {u.line.id}</small>)}{!uses.length&&!stale.length&&'ยังไม่พบเจ้าของราคาที่เลือก · ไม่ถือว่ารวมแล้ว'}</td></tr>;
    })}</tbody></table></div>
   </details>;
  })}
 </div>;
}
