import React,{useMemo,useState} from 'react';
import {vendorOfferEntries0550,groupVendorOffers0550} from './data/vendorRegister0550';
import {mgwQuoteItem0550} from './data/mgwVendorBasis0550';
import {SYSTEMS} from './data';
import {bidOwnerStyle} from './bidPresentation0550';
import {ComponentCopyId} from '../common/ui/ComponentCopyId';
import {amount} from './BidControls';
import {activeSupply0550} from './data/workingOffers0550';

const Toggle=()=> <span className="p55-vnd-toggle" aria-hidden="true"><span>+</span><span>−</span></span>;
export function VendorOfferGroups0550({data,onEdit}){
 const [mode,setMode]=useState('company');
 const entries=useMemo(()=>vendorOfferEntries0550(data),[data]);
 const groups=useMemo(()=>groupVendorOffers0550(entries,mode,SYSTEMS),[entries,mode]);
 const anchors=new Set();
 const renderRows=quote=><div className="p55-table-wrap"><table className="p55-table" aria-label={'Vendor costs '+quote.title}><thead><tr><th>รายการ / ระบบ</th><th>จำนวน / หน่วยต้นฉบับ</th><th>ต้นทุน / หน่วยเรต</th><th>วันที่ / เงื่อนไข</th><th>Offer ID / การใช้ใน Working</th></tr></thead><tbody>{quote.entries.map(entry=>{
  const o=entry.offer,e=o.quoteEvidence,r=mgwQuoteItem0550(o),s=o.supplierQuoteRow;
  const anchor=!anchors.has(o.id);anchors.add(o.id);
  const selected=entry.working.filter(activeSupply0550);
  const sourceQty=e?.quotedQuantity??s?.quantity??r?.quantity,sourceUnit=e?.quotedUnit??s?.quotedUnit??r?.sourceUnit;
  return <tr key={o.id} data-component-key={anchor?'bid.vendor.offer.'+o.id:undefined} data-vnd-offer={o.id} tabIndex={-1}>
   <td><strong>{o.description}</strong><small>{o.brand}</small><small>{entry.systemTokens.join(' / ')||'ยังไม่ผูกระบบ'}</small>
    <details><summary>รายละเอียด / ต้นฉบับ</summary>
     {r&&<><p>{r.site} · PDF p{r.page} · item {r.sn||r.id}</p><p style={{whiteSpace:'pre-wrap'}}>{r.detail}</p>{r.issues.map(x=><p key={x}>{x}</p>)}<p>ยอดรายการในต้นฉบับ {amount(r.extended,'USD')}</p>{o.unitCost!==r.unitCost&&<p>เรตต้นฉบับ {amount(r.unitCost,'USD')} · คงเรตที่บันทึกไว้ในตาราง</p>}</>}
     {e&&<><p>{e.locator} · revision: {e.revision||'ต้นฉบับไม่ระบุ'}</p><p><a href={e.sourceUrl} target="_blank" rel="noopener noreferrer">เปิดใบเสนอราคาต้นฉบับ</a></p><small>Source ID: {e.sourceId}<br/>SHA256: {e.sourceSha256}</small></>}
     <p>{o.sourceRef}</p>
    </details>
   </td>
   <td>{sourceQty===undefined?'ไม่ระบุ':sourceQty} {sourceUnit||'หน่วยรอยืนยัน'}{e&&<small>จำนวนอ้างอิงใน Quote</small>}{r&&<small>{r.kind==='COVER_ONLY'?'ยอดเหมาหน้าสรุป':'จำนวนต้นฉบับ ไม่แทนจำนวน MR'}</small>}</td>
   <td><strong>{amount(o.unitCost,o.currency)}</strong><small>/ {o.unit}</small>{e&&<><small>{e.rateBasis}</small>{(o.unitCost!==e.quotedUnitCost||o.currency!==e.quotedCurrency)&&<small>ต้นฉบับ {amount(e.quotedUnitCost,e.quotedCurrency)} / {e.quotedUnit}</small>}</>}
    {e?.classification==='OPTION'&&<small>OPTION · ยังไม่รวมในฐานโดยอัตโนมัติ</small>}
    {s&&<small>{s.classification==='NET_PACKAGE'?'ต้นทุนสุทธิทั้งแพ็กเกจ':s.classification==='INCLUDED_REFERENCE'?'รวมใน Package · ไม่มีราคาแยก':s.classification==='OPTION'?'OPTION · อ้างอิงแยกจากฐาน':'ราคาก่อนส่วนลด · อ้าง Package เดียว'} · Item {s.itemCode}</small>}
    {s?.classification!=='NET_PACKAGE'&&s?.parentOfferId&&<small>{s.parentOfferId}</small>}
   </td>
   <td>{o.date||'วันที่ OPEN'}<small>Valid until: {o.validUntil||'ไม่ระบุวันสิ้นสุด'}</small>
    {e&&<details><summary>เงื่อนไขต้นทุน</summary>{e.terms.map((t,i)=><p key={i}>{t}</p>)}</details>}
   </td>
   <td><ComponentCopyId projectId="PJ2608-0550" componentKey={'bid.vendor.offer.'+o.id}/><button type="button" onClick={()=>onEdit(o)}>เปิด Offer / แก้ไข</button>
    <small>{selected.length?'มี Working ที่เลือกใช้ '+selected.length+' รายการ':'ยังไม่เลือกใช้ใน Working'}</small>
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
  <p>จัดกลุ่มจากระบบในทะเบียนและลิงก์ SI / Working ที่มีอยู่ · การแสดงในกลุ่มยังไม่ยืนยันว่าผ่านข้อกำหนด MR</p>
  {groups.map(g=><details key={mode+g.key} className="p55-vnd-group" data-vnd-group={g.key} style={bidOwnerStyle(g.system)}>
   <summary><Toggle/>{g.title} · {g.offerIds.size} Offer IDs</summary>
   {g.children.map(child=><details key={child.key} className="p55-vnd-group" data-vnd-subgroup={child.key} style={bidOwnerStyle(child.system||g.system)}>
    <summary><Toggle/>{child.title}</summary>
    {child.quotes.map(q=><details key={q.key} className="p55-vnd-quote">
     <summary><Toggle/>{q.title}{q.revision?' · Rev.'+q.revision:''}{q.hash?' · '+q.hash.slice(0,8):''} · {q.entries.length} รายการ</summary>
     {renderRows(q)}
    </details>)}
   </details>)}
  </details>)}
 </div>;
}
