import React from 'react';
import {amount} from './BidControls';
import {sumMoney0550} from './data/money0550';
import {mgwHistoricalOffer0550} from './data/mgwVendorBasis0550';
import {
 MGW_CURRENT_BLD_0550, MGW_CURRENT_OPEN_0550, MGW_CURRENT_QUOTE_0550, MGW_MET_NDB_0550, MGW_MET_NDB_OPEN_0550,
 MGW_CCTV_ENT_0550, MGW_CCTV_ENT_SECTIONS_0550, MGW_SECTION_SUBTOTAL_0550,
 MGW_BULK_0550, MGW_BULK_OPEN_0550, mgwBulkOffer0550,
 mgwCctvEntOffer0550, mgwLanPbxFoOffer0550, mgwMetNdbOffer0550, mgwReplacementActive0550,
} from './data/mgwQuoteSelection0550';

export function MgwCurrentQuote0550({data,onNavigate,disabled=false}){
 if(!mgwReplacementActive0550(data))return null;
 const offers=data.offers.filter(mgwLanPbxFoOffer0550);
 const quote=offers[0]?.quoteEvidence;
 const metNdb=data.offers.filter(mgwMetNdbOffer0550);
 const metNdbQuote=metNdb[0]?.quoteEvidence;
 const cctvEnt=data.offers.filter(mgwCctvEntOffer0550);
 const cctvEntQuote=cctvEnt[0]?.quoteEvidence;
 const bulk=data.offers.filter(mgwBulkOffer0550);
 const bulkPriced=bulk.filter(o=>Number.isFinite(o.quoteEvidence.quotedTotal));
 const sections=MGW_CCTV_ENT_SECTIONS_0550.map(section=>{
  const rows=cctvEnt.filter(o=>o.quoteEvidence.systemTokens.includes(section.system));
  const subtotals=rows.flatMap(o=>o.quoteEvidence.terms.filter(t=>t.startsWith(MGW_SECTION_SUBTOTAL_0550)));
  const printed=subtotals.length===1?Number(subtotals[0].slice(MGW_SECTION_SUBTOTAL_0550.length)):null;
  const complete=rows.length===section.count&&rows.every(o=>Number.isFinite(o.quoteEvidence.quotedTotal));
  const total=complete?sumMoney0550(rows.map(o=>o.quoteEvidence.quotedTotal)):null;
  return {...section,rows,printed,total,delta:Number.isFinite(printed)&&complete?sumMoney0550([total,-printed]):null};
 });
 const option=offers.find(o=>o.quoteEvidence.classification==='OPTION');
 const historical=data.offers.filter(o=>mgwHistoricalOffer0550(data,o)).length;
 const conflicts=data.mgwDetailPricingImport.conflicts.filter(s=>s.includes('current MGW Offer')||s.startsWith('LINE-MGW-CURRENT-'));
 return <section className="p55-panel" aria-label="Current MGW quotation">
  <h3>MGW · ใบเสนอราคาที่ใช้ใน Working</h3>
  <p>{MGW_CURRENT_QUOTE_0550} · {quote?'มีราคา LAN, IP Telephony/PABX และ Fiber Patch Panel ตามรายการในใบเสนอราคา':'รอโหลดใบเสนอราคาจากข้อมูลโครงการ'} · ยกเลิกฐานใบราคา MGW เดิม{historical?' '+historical+' Offer IDs':''}</p>
  <p>{MGW_MET_NDB_0550.quoteRef} · {metNdbQuote?metNdb.length+' รายการที่อยู่ในทะเบียน · MET APF/ACP และ NDB · Supply / Draft':'รอโหลดใบเสนอราคาจากข้อมูลโครงการ'}</p>
  <p>{MGW_CCTV_ENT_0550.quoteRef} · {MGW_CCTV_ENT_0550.revision} · {cctvEntQuote?cctvEnt.length+' รายการในทะเบียน · Equipment Supply / Draft':'รอโหลดใบเสนอราคาจากข้อมูลโครงการ'}</p>
  <p>{MGW_BULK_0550.quoteRef} · {bulk.length?`${bulkPriced.length}/${bulk.length} รายการมีราคา · USD ${amount(sumMoney0550(bulkPriced.map(o=>o.quoteEvidence.quotedTotal)),'USD')} · Supply / Draft`:'รอโหลดใบเสนอราคาจากข้อมูลโครงการ'}</p>
  {cctvEntQuote&&sections.map(section=><p key={section.system}><strong>{section.label}</strong> · {section.rows.length}/{section.count} รายการ · {Number.isFinite(section.total)?'รวมรายบรรทัด USD '+amount(section.total,'USD'):'ตรวจความครบของราคา'} · ยอดที่พิมพ์ในใบ USD {amount(section.printed,'USD')}{section.delta?' · ส่วนต่าง USD '+amount(section.delta,'USD'):''}</p>)}
  <p>รอราคาสำหรับ {cctvEntQuote?'':'CCTV, Entertainment, '}DTRS, Marine/Aero/SSB Radio, {bulk.length?'วัสดุ Bulk ที่ยังไม่มีราคา':'สายและวัสดุ FO/CAT6A'} และงานบริการที่ต้องจัดหาเพิ่ม</p>
  {option&&<p>Wi-Fi Coverage Study · Option {amount(option.quoteEvidence.quotedTotal,'USD')} USD แยกจาก Base</p>}
  <details><summary>ประเด็นตรวจขอบเขตและเงื่อนไข</summary>
   <p>{MGW_CURRENT_OPEN_0550}</p>
   {bulk.length>0&&<p>{MGW_BULK_OPEN_0550}</p>}
   {metNdbQuote&&Object.values(MGW_MET_NDB_OPEN_0550).map(note=><p key={note}>{note}</p>)}
   {metNdbQuote&&onNavigate&&<details><summary>เปิดรายการเสนอราคา MET/NDB ใน 07</summary>
    {metNdb.map(o=><p key={o.id}><button type="button" disabled={disabled} onClick={()=>onNavigate('bid.vendor.offer.'+o.id)}>{o.description}</button> · {o.quoteEvidence.locator}</p>)}
   </details>}
   {cctvEntQuote&&sections.map(section=><div key={section.system}>
    <p>{section.check}</p>
    {onNavigate&&<details><summary>เปิดรายการเสนอราคา {section.label} ใน 07</summary>
     {section.rows.map(o=><p key={o.id}><button type="button" disabled={disabled} onClick={()=>onNavigate('bid.vendor.offer.'+o.id)}>{o.description}</button> · {o.quoteEvidence.locator}</p>)}
    </details>}
   </div>)}
   {conflicts.length>0&&<ul>{conflicts.map(c=><li key={c}>{c}</li>)}</ul>}
   <div className="p55-review-toolbar">
    {quote&&<a href={quote.sourceUrl} target="_blank" rel="noreferrer">ใบเสนอราคา LAN/PBX/FO</a>}
    {cctvEntQuote&&<a href={cctvEntQuote.sourceUrl} target="_blank" rel="noreferrer">ใบเสนอราคา CCTV / Entertainment V1.2</a>}
    {metNdbQuote&&<a href={metNdbQuote.sourceUrl} target="_blank" rel="noreferrer">ใบเสนอราคา MET/NDB</a>}
    {bulk.length>0&&<a href={bulk[0].quoteEvidence.sourceUrl} target="_blank" rel="noreferrer">ใบเสนอราคา FO / Bulk Material</a>}
    <a href={MGW_MET_NDB_0550.deviationsUrl} target="_blank" rel="noreferrer">Attachment 3 · MGW Technical Deviations</a>
    <a href={MGW_CURRENT_BLD_0550} target="_blank" rel="noreferrer">แบบ LAN/PABX BLD</a>
    {onNavigate&&<button type="button" disabled={disabled} onClick={()=>onNavigate('bid.vendor.offers')}>07 · VND</button>}
    {onNavigate&&<button type="button" disabled={disabled} onClick={()=>onNavigate('bid.quotation.C1')}>11.C1 · Working Preview</button>}
   </div>
  </details>
 </section>;
}
