import React from 'react';
import {amount} from './BidControls';
import {sumMoney0550} from './data/money0550';
import {MGW_QUOTE_0550, mgwHistoricalOffer0550} from './data/mgwVendorBasis0550';
import {mgwServiceAllocation0550} from './data/mgwDetailPricing0550';
import mrCatalog from './data/mrWorkingCatalog0550.json';
import {MgwRadioTagEvidence0550} from './MgwRadioTagEvidence0550';
import {mgwRadioItemForOffer0550,offerLinkedSections0550,offerSourceSections0550,sourceRadioSections0550} from './data/vendorBidTags0550';
import {
 MGW_CURRENT_BLD_0550, MGW_CURRENT_OPEN_0550, MGW_CURRENT_QUOTE_0550, MGW_MET_NDB_0550, MGW_MET_NDB_OPEN_0550,
 MGW_CCTV_ENT_0550, MGW_CCTV_ENT_SECTIONS_0550, MGW_SECTION_SUBTOTAL_0550,
 MGW_BULK_0550, MGW_BULK_OPEN_0550, mgwBulkOffer0550,
 MGW_RADIO_AERO_0550, MGW_RADIO_DTRS_0550, MGW_RADIO_DTRS_OPEN_0550,
 MGW_RADIO_MARINE_0550, MGW_RADIO_SSB_0550, mgwRadioDtrsOffer0550,
 mgwCctvEntOffer0550, mgwLanPbxFoOffer0550, mgwMetNdbOffer0550, mgwReplacementActive0550,
} from './data/mgwQuoteSelection0550';

const radioSourceRows=MGW_QUOTE_0550.rows.filter(row=>row.section==='RADIO');
const radioSourceMr={
 ...MGW_RADIO_DTRS_0550.mrMap,
 ...MGW_RADIO_MARINE_0550.mrMap,
 ...MGW_RADIO_SSB_0550.mrMap,
 ...MGW_RADIO_AERO_0550.mrMap,
 'RADIO-004':['MR-B1-11-ACP-05'],
 'RADIO-005':['MR-B1-11-ACP-04'],
};
const radioMrById=new Map(mrCatalog.rows.filter(row=>row.id.startsWith('MR-B1-11-')).map(row=>[row.id,row]));
const radioMrSource=radioMrById.get('MR-B1-11-APF-01')?.componentReview?.sources.find(source=>source.label.includes('Rev.B1'));
const radioUnpriced={
 'RADIO-005':{
  separator:'\nLocation: APM\nVHF DMR Radio System GTPL\n',
  title:'VHF DMR Radio System · GTPL relocation', sourceSite:'APM', site:'ติดตั้งที่ APF ตามหมายเหตุผู้เสนอ', price:'—',
 },
 'RADIO-009':{
  separator:'\nVHF DMR Radio System Accessaries MOTOROLA\n',
  title:'VHF DMR Radio System Accessories · Motorola Option', sourceSite:'APF', site:'APF', price:'TBD',
 },
};

function MgwRadioSource0550({data,sectionFilter}){
 const currency=MGW_QUOTE_0550.currency;
 const total=sumMoney0550(radioSourceRows.map(row=>row.extended));
 const offersByItem=new Map();
 for(const offer of data.offers){
  const item=mgwRadioItemForOffer0550(offer);
  if(item&&(!offersByItem.has(item)||mgwRadioDtrsOffer0550(offer)))offersByItem.set(item,offer);
 }
 const itemSections=item=>{
  const offer=offersByItem.get(item);
  const lines=new Set(offer?data.lines.filter(line=>line.offerId===offer.id).map(line=>line.id):[]);
  const bindings=(data.bidVolumes?.bindings||[]).filter(binding=>lines.has(binding.lineId));
  return offerLinkedSections0550(offer?offerSourceSections0550(offer):sourceRadioSections0550(item),bindings,lines.size>0);
 };
 const isVisible=tags=>!sectionFilter||tags.includes(sectionFilter);
 return <details className="p55-vnd-quote">
  <summary>Radio System · {MGW_QUOTE_0550.quoteRef} · {radioSourceRows.length} รายการมีราคา · {amount(total,currency)} {currency}</summary>
  <p><a href={MGW_QUOTE_0550.sourceUrl} target="_blank" rel="noreferrer">ใบเสนอราคา MGW หน้า 9–12</a>
   {radioMrSource&&<> · <a href={radioMrSource.url} target="_blank" rel="noreferrer">CUS MR Rev.B1 Appendix 1.1</a></>}</p>
  <p>RADIO-004 ตรงกับ ACP Radio Console 1 Pc · RADIO-005 ตรงกับ ACP Antenna Cable 700 m ตาม CUS</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Original MGW Radio System quotation breakdown">
   <thead><tr><th>หน้า / รายการ</th><th>ไซต์อ้างอิง</th><th>Location ในใบเสนอราคา</th><th>จำนวนตามใบ</th><th>USD / หน่วย</th><th>รวม USD</th></tr></thead>
   <tbody>{radioSourceRows.map(row=>{
    const item=row.id.replace('MGW-Q26-063-','');
    const mr=radioMrById.get(radioSourceMr[item]?.[0]);
    const site=mr?.site||(item==='RADIO-016'?'AMS01':row.site==='APF'?row.site:'รอยืนยัน');
    const extra=radioUnpriced[item];
    const continuation=MGW_QUOTE_0550.radioDetailContinuations[item];
    const [rawDetail,unpricedDetail]=extra?row.detail.split(extra.separator):[row.detail];
    const detail=continuation?rawDetail.replace(continuation.anchor,continuation.text):rawDetail;
    const sections=itemSections(item);
    const optionItem=item==='RADIO-009'?'RADIO-009-OPTION':null;
    const extraSections=optionItem?itemSections(optionItem):[];
    return <React.Fragment key={row.id}>
     {isVisible(sections)&&<tr>
      <td><strong>{row.description} · {row.brand}</strong><small>{item} · PDF {row.page}{continuation&&'–'+continuation.page}</small>
       <small>Volume I · {sections.map(tag=>'11.'+tag).join(' · ')}</small>
       <details><summary>รายการย่อย / BOM</summary><p className="p55-supplier-verbatim">{detail}</p></details>
       <MgwRadioTagEvidence0550 item={item}/></td>
      <td>{site}{mr&&<small>{mr.id}</small>}{item==='RADIO-016'&&<small>ตามบันทึกไซต์เดิม</small>}</td>
      <td>{row.site}</td><td>{row.quantity} {row.sourceUnit||'· หน่วยไม่ระบุ'}</td>
      <td>{amount(row.unitCost,currency)}</td><td>{amount(row.extended,currency)}</td>
     </tr>}
     {unpricedDetail&&isVisible(extraSections)&&<tr>
      <td><strong>{extra.title}</strong><small>PDF {row.page}</small>
       {extraSections.length>0&&<small>Volume I · {extraSections.map(tag=>'11.'+tag).join(' · ')}</small>}
       <details><summary>รายการย่อย / ขอบเขต</summary><p className="p55-supplier-verbatim">{unpricedDetail}</p></details>
       {optionItem&&<MgwRadioTagEvidence0550 item={optionItem}/>}</td>
      <td>{extra.site}</td><td>{extra.sourceSite}</td><td>—</td><td>—</td><td>{extra.price}</td>
     </tr>}
    </React.Fragment>;
   })}</tbody>
   <tfoot><tr><th colSpan={5}>รวมตามใบเสนอราคา Radio</th><td>{amount(total,currency)}</td></tr></tfoot>
  </table></div>
 </details>;
}

export function MgwCurrentQuote0550({data,onNavigate,disabled=false,showRadioSource=false,sectionFilter=''}){
 if(!mgwReplacementActive0550(data))return showRadioSource?<MgwRadioSource0550 data={data} sectionFilter={sectionFilter}/>:null;
 const offers=data.offers.filter(mgwLanPbxFoOffer0550);
 const quote=offers[0]?.quoteEvidence;
 const metNdb=data.offers.filter(mgwMetNdbOffer0550);
 const metNdbQuote=metNdb[0]?.quoteEvidence;
 const cctvEnt=data.offers.filter(mgwCctvEntOffer0550);
 const cctvEntQuote=cctvEnt[0]?.quoteEvidence;
 const bulk=data.offers.filter(mgwBulkOffer0550);
 const bulkPriced=bulk.filter(o=>Number.isFinite(o.quoteEvidence.quotedTotal));
 const radio=data.offers.filter(mgwRadioDtrsOffer0550);
 const radioWorking=data.lines.filter(l=>l.selected&&radio.some(o=>o.id===l.offerId));
 const services=mgwServiceAllocation0550();
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
 const conflicts=data.mgwDetailPricingImport.conflicts.filter(s=>s.includes('current MGW Offer')||s.startsWith('LINE-MGW-CURRENT-')||s.startsWith('DTRS vendor register /'));
 return <section className="p55-panel" aria-label="Current MGW quotation">
  <h3>MGW · ใบเสนอราคาที่ใช้ใน Working</h3>
  <p>{MGW_CURRENT_QUOTE_0550} · {quote?'มีราคา LAN, IP Telephony/PABX และ Fiber Patch Panel ตามรายการในใบเสนอราคา':'รอโหลดใบเสนอราคาจากข้อมูลโครงการ'} · ยกเลิกฐานใบราคา MGW เดิม{historical?' '+historical+' Offer IDs':''}</p>
  <p>{MGW_MET_NDB_0550.quoteRef} · {metNdbQuote?metNdb.length+' รายการที่อยู่ในทะเบียน · MET APF/ACP และ NDB · Supply / Draft':'รอโหลดใบเสนอราคาจากข้อมูลโครงการ'}</p>
  <p>{MGW_CCTV_ENT_0550.quoteRef} · {MGW_CCTV_ENT_0550.revision} · {cctvEntQuote?cctvEnt.length+' รายการในทะเบียน · Equipment Supply / Draft':'รอโหลดใบเสนอราคาจากข้อมูลโครงการ'}</p>
  <p>{MGW_BULK_0550.quoteRef} · {bulk.length?`${bulkPriced.length}/${bulk.length} รายการมีราคา · USD ${amount(sumMoney0550(bulkPriced.map(o=>o.quoteEvidence.quotedTotal)),'USD')} · Supply / Draft`:'รอโหลดใบเสนอราคาจากข้อมูลโครงการ'}</p>
  <p>{MGW_RADIO_DTRS_0550.quoteRef} · {radio.length?radio.length+' Offer records · '+radioWorking.length+' Working owners · Supply / Draft':'รอข้อมูลใบเสนอราคา'}</p>
  {showRadioSource&&<MgwRadioSource0550 data={data} sectionFilter={sectionFilter}/>}
  {cctvEntQuote&&sections.map(section=><p key={section.system}><strong>{section.label}</strong> · {section.rows.length}/{section.count} รายการ · {Number.isFinite(section.total)?'รวมรายบรรทัด USD '+amount(section.total,'USD'):'ตรวจความครบของราคา'} · ยอดที่พิมพ์ในใบ USD {amount(section.printed,'USD')}{section.delta?' · ส่วนต่าง USD '+amount(section.delta,'USD'):''}</p>)}
  <p>รอราคาสำหรับ {cctvEntQuote?'':'CCTV, Entertainment, '}{radio.length?'':'DTRS, '}Marine/Aero/SSB Radio, {bulk.length?'วัสดุ Bulk ที่ยังไม่มีราคา':'สายและวัสดุ FO/CAT6A'} และงานบริการที่ต้องจัดหาเพิ่ม</p>
  {option&&<p>Wi-Fi Coverage Study · Option {amount(option.quoteEvidence.quotedTotal,'USD')} USD แยกจาก Base</p>}
  <details><summary>ประเด็นตรวจขอบเขตและเงื่อนไข</summary>
   <p>{MGW_CURRENT_OPEN_0550}</p>
   {bulk.length>0&&<p>{MGW_BULK_OPEN_0550}</p>}
   {radio.length>0&&<p>{MGW_RADIO_DTRS_OPEN_0550}</p>}
   {radio.length>0&&onNavigate&&<details><summary>เปิดรายการเสนอราคา DTRS ใน 07</summary>
    {radio.map(o=><p key={o.id}><button type="button" disabled={disabled} onClick={()=>onNavigate('bid.vendor.offer.'+o.id)}>{o.description}</button> · {o.quoteEvidence.locator}</p>)}
   </details>}
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
   <details><summary>Services · E14 · ประมาณการรายระบบ USD {amount(services.totalUSD,'USD')}</summary>
    <p>ใช้ SI design workload ({services.totalDrivers} MH) เป็นน้ำหนักความซับซ้อนสำหรับระบบที่มีอุปกรณ์ใน Q26-063 ข้อมูลนี้เป็นฐานประมาณต้นทุน non-equipment ภายใน และใช้ยอด Other Charges จากหน้า 1</p>
    <div className="p55-table-wrap"><table className="p55-table" aria-label="MGW E14 services allocation">
     <thead><tr><th>ระบบ</th><th>Driver (MH)</th>{services.priced.map(row=><th key={row.id}>{row.description}</th>)}<th>รวม USD</th></tr></thead>
     <tbody>{services.rows.map(row=><tr key={row.systemToken}><td>{row.systemToken}</td><td>{row.driver}</td>{row.shares.map((share,i)=><td key={services.priced[i].id}>{amount(share,'USD')}</td>)}<td>{amount(row.totalUSD,'USD')}</td></tr>)}</tbody>
     <tfoot><tr><th>รวม</th><td>{services.totalDrivers}</td>{services.priced.map(row=><td key={row.id}>{amount(row.extended,'USD')}</td>)}<td>{amount(services.totalUSD,'USD')}</td></tr></tfoot>
    </table></div>
    {services.open.map(row=><p key={row.id}>{row.description} · OPEN</p>)}
   </details>
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
