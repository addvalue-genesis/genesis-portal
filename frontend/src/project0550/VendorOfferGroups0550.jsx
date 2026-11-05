import React,{useMemo,useState} from 'react';
import {vendorOfferEntries0550,groupVendorOffers0550,vendorQuoteTotals0550} from './data/vendorRegister0550';
import {mgwQuoteItem0550} from './data/mgwVendorBasis0550';
import {SYSTEMS} from './data';
import {bidOwnerStyle} from './bidPresentation0550';
import {ComponentCopyId} from '../common/ui/ComponentCopyId';
import {amount} from './BidControls';
import {activeSupply0550} from './data/workingOffers0550';
import {SupplierItemSourceText0550} from './SupplierItemSourceText0550';

const Toggle=()=> <span className="p55-vnd-toggle" aria-hidden="true"><span>+</span><span>−</span></span>;
function QuoteTotal({quote,fx}){
 const t=vendorQuoteTotals0550(quote,fx);
 if(t.referenceOnly)return <span className="p55-vnd-total">ฐาน Working อ้างอิง · ดูยอดในใบเสนอราคาต้นฉบับ</span>;
 const show=(s,label)=><span className="p55-vnd-total-part">
  <strong>{label}: {s.totalTHB!==null?amount(s.totalTHB,'THB')+' THB':s.hasConverted?'ยอดที่ทราบ '+amount(s.knownTHB,'THB')+' THB · ยังไม่ครบ':'OPEN'}</strong>
  {s.native.length>0&&<span>ต้นทาง {s.native.map(n=>amount(n.value,n.currency)+' '+n.currency).join(' + ')}{s.missingPrices>0?' · เฉพาะยอดที่ทราบ':''}</span>}
  {s.rates.some(r=>r.currency!=='THB')&&<span>FX {s.rates.filter(r=>r.currency!=='THB').map(r=>'1 '+r.currency+' = '+r.rate+' THB').join(' · ')} · {t.fxDate} · {t.fxSource}</span>}
  {s.missingFX.length>0&&<span>รอ FX {s.missingFX.join(' / ')} → THB พร้อมแหล่งอ้างอิงและวันที่</span>}
  {s.missingPrices>0&&<span>{s.missingPrices} รายการยังไม่มียอดแน่นอน / As actual</span>}
  {s.ambiguous&&<span>OPEN · พบยอดสุทธิหลายรายการ ต้องตรวจต้นฉบับก่อนรวม</span>}
 </span>;
 return <span className="p55-vnd-total" data-vnd-quote-total="true">{show(t.base,t.net?'รวมสุทธิใบเสนอราคา':'รวมใบเสนอราคา')}{t.option&&show(t.option,'Option แยก')}{t.fullQuote&&<span>ยอดทั้งใบ ครอบคลุมทุกระบบในใบเดียวกัน</span>}</span>;
}
export function VendorOfferGroups0550({data,onEdit}){
 const [mode,setMode]=useState('company');
 const entries=useMemo(()=>vendorOfferEntries0550(data),[data]);
 const groups=useMemo(()=>groupVendorOffers0550(entries,mode,SYSTEMS),[entries,mode]);
 const anchors=new Set();
 const renderRows=quote=><div className="p55-table-wrap"><table className="p55-table" aria-label={'Vendor costs '+quote.title}><thead><tr><th>รายการ / ระบบ</th><th>จำนวน / หน่วยต้นฉบับ</th><th>ต้นทุน / หน่วยเรต<br/>Unit Price ต้นฉบับ</th><th>Total Price ต้นฉบับ</th><th>วันที่ / เงื่อนไข</th><th>Offer ID / การใช้ใน Working</th></tr></thead><tbody>{quote.entries.map(entry=>{
  const o=entry.offer,e=o.quoteEvidence,r=mgwQuoteItem0550(o),s=o.supplierQuoteRow;
  const anchor=!anchors.has(o.id);anchors.add(o.id);
  const selected=entry.working.filter(activeSupply0550),referenceSelected=entry.referenceWorking.filter(activeSupply0550);
  const allocated=entry.allocatedWorking.filter(u=>u.current&&activeSupply0550(u.line)),stale=entry.allocatedWorking.filter(u=>!u.current);
  const sourceQty=e?.quotedQuantity??s?.quantity??r?.quantity,sourceUnit=e?.quotedUnit??s?.quotedUnit??r?.sourceUnit;
  return <tr key={o.id} data-component-key={anchor?'bid.vendor.offer.'+o.id:undefined} data-vnd-offer={o.id} tabIndex={-1}>
   <td><strong>{o.description}</strong><SupplierItemSourceText0550 offer={o}/><small>{o.brand}</small><small>{entry.systemTokens.join(' / ')||'ยังไม่ผูกระบบ'}</small>
    <details><summary>รายละเอียด / ต้นฉบับ</summary>
     {r&&<><p>{r.site} · PDF p{r.page} · item {r.sn||r.id}</p>{r.issues.map(x=><p key={x}>{x}</p>)}<p>ยอดรายการในต้นฉบับ {amount(r.extended,'USD')}</p>{o.unitCost!==r.unitCost&&<p>เรตต้นฉบับ {amount(r.unitCost,'USD')} · คงเรตที่บันทึกไว้ในตาราง</p>}</>}
     {e&&<><p>{e.locator} · revision: {e.revision||'ต้นฉบับไม่ระบุ'}</p><p><a href={e.sourceUrl} target="_blank" rel="noopener noreferrer">เปิดใบเสนอราคาต้นฉบับ</a></p><small>Source ID: {e.sourceId}<br/>SHA256: {e.sourceSha256}</small></>}
     <p>{o.sourceRef}</p>
    </details>
   </td>
   <td>{entry.referenceOnly?<>{entry.working.map(l=>(l.quantity??'OPEN')+' '+l.unit).join(' / ')||'Working basis'}<small>จำนวนที่ใช้ใน Working</small></>:<>{sourceQty===undefined?'ไม่ระบุ':sourceQty} {sourceUnit||'หน่วยรอยืนยัน'}{e&&<small>จำนวนอ้างอิงใน Quote</small>}{r&&<small>{r.kind==='COVER_ONLY'?'ยอดเหมาหน้าสรุป':'จำนวนต้นฉบับ ไม่แทนจำนวน MR'}</small>}</>}</td>
   <td><strong>{amount(e?e.quotedUnitCost:o.unitCost,e?.quotedCurrency||o.currency)}</strong><small>/ {e?.quotedUnit||o.unit}</small>{entry.referenceOnly&&<small>ฐาน Working เดิมรวมหลายใบเสนอราคา · ดูต้นฉบับแยกฉบับ</small>}{e&&<><small>{e.rateBasis}</small>{(o.unitCost!==e.quotedUnitCost||o.currency!==e.quotedCurrency||o.unit!==e.quotedUnit)&&<small>เรตที่บันทึกไว้ {amount(o.unitCost,o.currency)} / {o.unit}</small>}</>}
    {e?.classification==='OPTION'&&<small>OPTION · ยังไม่รวมในฐานโดยอัตโนมัติ</small>}
    {s&&<small>{s.classification==='NET_PACKAGE'?'ต้นทุนสุทธิทั้งแพ็กเกจ':s.classification==='INCLUDED_REFERENCE'?'รวมใน Package · ไม่มีราคาแยก':s.classification==='OPTION'?'OPTION · อ้างอิงแยกจากฐาน':'ราคาก่อนส่วนลด · อ้าง Package เดียว'} · Item {s.itemCode}</small>}
    {s?.classification!=='NET_PACKAGE'&&s?.parentOfferId&&<small>{s.parentOfferId}</small>}
   </td>
   <td>{entry.referenceOnly?'อ้างอิงยอดต้นฉบับแยกแต่ละฉบับ':e?.quotedTotal!==undefined?(e.quotedTotal===null?e.quotedTotalText||'ต้นฉบับไม่ระบุยอดแยก':amount(e.quotedTotal,e.quotedCurrency)):r?amount(r.extended,'USD'):'OPEN · ยังไม่บันทึกยอดต้นฉบับ'}{e&&<small>{e.locator}</small>}</td>
   <td>{o.date||'วันที่ OPEN'}<small>Valid until: {o.validUntil||'ไม่ระบุวันสิ้นสุด'}</small>
    {e&&<details><summary>เงื่อนไขต้นทุน</summary>{e.terms.map((t,i)=><p key={i}>{t}</p>)}</details>}
   </td>
   <td><ComponentCopyId projectId="PJ2608-0550" componentKey={'bid.vendor.offer.'+o.id}/><button type="button" onClick={()=>onEdit(o)}>เปิด Offer / แก้ไข</button>
    <small>{selected.length?'มี Working ที่เลือกใช้ '+selected.length+' รายการ':allocated.length?'จัดสรรต้นทุนใน Working แล้ว '+allocated.length+' รายการ':referenceSelected.length?'อ้างอิงเจ้าของราคา Working เดิม':stale.length?'ฐานจัดสรรเปลี่ยน · ต้องทบทวน':'ยังไม่เลือกใช้ใน Working'}</small>
    {allocated.map(u=><small key={u.line.id}>Part {u.line.wbs[0]} / {u.line.wbs} → {u.line.customerRowCode||'Customer row OPEN'} · {u.line.description}{u.kind==='ESTIMATE'?' · รวมในต้นทุนผสมใบเสนอราคาและประมาณการ':''}</small>)}
    {stale.map(u=><small key={u.line.id}>ต้องทบทวนลิงก์ {u.line.id} · ข้อมูลรายการหรือราคาต้นทางเปลี่ยน</small>)}
    {referenceSelected.length>0&&<small>อ้างอิงฐาน Working เดิม {referenceSelected.length} รายการ · ตรวจขอบเขตก่อนเปลี่ยนราคา</small>}
    {entry.systemTokens.length>1&&<small>อ้างอิง Offer เดียวกันหลายระบบ · ไม่รวมต้นทุนซ้ำ</small>}
   </td>
  </tr>;
 })}</tbody></table></div>;
 return <div className="p55-vnd-groups" aria-label="Vendor cost register">
  <div className="p55-review-toolbar" aria-label="Vendor grouping">
   <button type="button" aria-pressed={mode==='company'} onClick={()=>setMode('company')}>บริษัท → ระบบ</button>
   <button type="button" aria-pressed={mode==='system'} onClick={()=>setMode('system')}>ระบบ → บริษัท</button>
   <span>{entries.length} Offer IDs · ต้นทุนตามสกุล/หน่วยต้นฉบับ</span>
  </div>
  <p>เก็บรายการต้นฉบับทุกฉบับ รวมรายการที่ยังไม่เลือกใช้ · Qty / Unit / Unit Price / Total เป็นข้อมูล Supplier ส่วน Working เก็บจำนวนและราคาที่เลือกใช้แยกกัน · การแสดงในกลุ่มยังไม่ยืนยันว่าผ่านข้อกำหนด MR</p>
  {groups.map(g=><details key={mode+g.key} className="p55-vnd-group" data-vnd-group={g.key} style={bidOwnerStyle(g.system)}>
   <summary><Toggle/>{g.title} · {new Set(g.children.flatMap(c=>c.quotes.filter(q=>!q.referenceOnly).map(q=>q.key))).size} ใบเสนอราคา · {g.offerIds.size} Offer IDs</summary>
   {g.children.map(child=><details key={child.key} className="p55-vnd-group" data-vnd-subgroup={child.key} style={bidOwnerStyle(child.system||g.system)}>
    <summary><Toggle/>{child.title}</summary>
    {child.quotes.map(q=><details key={q.key} className="p55-vnd-quote" data-vnd-source-quote={q.referenceOnly?'false':'true'}>
     <summary><Toggle/>{q.referenceOnly?'ฐาน Working เดิม · ':''}{q.title}{q.fileName?' · '+q.fileName:''}{q.revision?' · Rev.'+q.revision:''}{q.hash?' · '+q.hash.slice(0,8):''} · {q.entries.length} รายการ<QuoteTotal quote={q} fx={data.fx}/></summary>
     {renderRows(q)}
    </details>)}
   </details>)}
  </details>)}
 </div>;
}
