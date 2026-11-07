import React from 'react';
import {amount} from './BidControls';
import {mgwHistoricalOffer0550} from './data/mgwVendorBasis0550';
import {
 MGW_CURRENT_BLD_0550, MGW_CURRENT_OPEN_0550, MGW_CURRENT_QUOTE_0550,
 mgwCurrentOffer0550, mgwReplacementActive0550,
} from './data/mgwQuoteSelection0550';

export function MgwCurrentQuote0550({data,onNavigate,disabled=false}){
 if(!mgwReplacementActive0550(data))return null;
 const offers=data.offers.filter(mgwCurrentOffer0550);
 const quote=offers[0]?.quoteEvidence;
 const option=offers.find(o=>o.quoteEvidence.classification==='OPTION');
 const historical=data.offers.filter(o=>mgwHistoricalOffer0550(data,o)).length;
 const conflicts=data.mgwDetailPricingImport.conflicts.filter(s=>s.includes('current MGW Offer')||s.startsWith('LINE-MGW-CURRENT-'));
 return <section className="p55-panel" aria-label="Current MGW quotation">
  <h3>MGW · {MGW_CURRENT_QUOTE_0550}</h3>
  <p>{quote?'มีราคา LAN, IP Telephony/PABX และ Fiber Patch Panel ตามรายการในใบเสนอราคา':'รอโหลดใบเสนอราคาปัจจุบันจากข้อมูลโครงการ'} · ยกเลิกฐานใบราคา MGW เดิม{historical?' '+historical+' Offer IDs':''}</p>
  <p>รอใบเสนอราคา MGW สำหรับ CCTV, MET, DTRS, Marine/Aero/SSB Radio, Entertainment, NDB, สายและวัสดุ FO/CAT6A และงานบริการที่ต้องจัดหาเพิ่ม</p>
  {option&&<p>Wi-Fi Coverage Study · Option {amount(option.quoteEvidence.quotedTotal,'USD')} USD แยกจาก Base</p>}
  <details><summary>ประเด็นตรวจขอบเขตและเงื่อนไข</summary>
   <p>{MGW_CURRENT_OPEN_0550}</p>
   {conflicts.length>0&&<ul>{conflicts.map(c=><li key={c}>{c}</li>)}</ul>}
   <div className="p55-review-toolbar">
    {quote&&<a href={quote.sourceUrl} target="_blank" rel="noreferrer">ใบเสนอราคา MGW</a>}
    <a href={MGW_CURRENT_BLD_0550} target="_blank" rel="noreferrer">แบบ LAN/PABX BLD</a>
    {onNavigate&&<button type="button" disabled={disabled} onClick={()=>onNavigate('bid.vendor.offers')}>07 · VND</button>}
    {onNavigate&&<button type="button" disabled={disabled} onClick={()=>onNavigate('bid.quotation.C1')}>11.C1 · Working Preview</button>}
   </div>
  </details>
 </section>;
}
