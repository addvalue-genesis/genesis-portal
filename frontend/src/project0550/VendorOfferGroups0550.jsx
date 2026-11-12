import {PagaQuoteScope0550} from './PagaQuoteScope0550';
import {MgwCurrentQuote0550} from "./MgwCurrentQuote0550";
import {mgwCurrentMr0550,mgwCurrentOffer0550,mgwRadioDtrsOffer0550,mgwReplacementActive0550} from "./data/mgwQuoteSelection0550";
import {CERAGON_R11_0550,CERAGON_R10_0550,ceragonR11Selected0550} from './data/ceragonSelection0550';
import {towerOfferScope0550} from './data/towerTenderScope0550';
import React,{useEffect,useMemo,useState} from 'react';
import {vendorOfferEntries0550,groupVendorOffers0550,vendorQuoteTotals0550,vendorQuoteRowTreatment0550,vendorQuoteNetUnitRate0550} from './data/vendorRegister0550';
import {mgwHistoricalOffer0550,mgwQuoteItem0550,mgwProjectWideService0550} from './data/mgwVendorBasis0550';
import {SYSTEMS} from './data';
import {bidOwnerStyle} from './bidPresentation0550';
import {ComponentCopyId} from '../common/ui/ComponentCopyId';
import {amount} from './BidControls';
import {activeSupply0550} from './data/workingOffers0550';
import {SupplierItemSourceText0550,SupplierQuoteBoq0550,SupplierTowerBom0550,SupplierPagaBom0550} from './SupplierItemSourceText0550';
import {supplierItemLabel0550} from './data/supplierCostProjection0550';
import {requirementSupplierOfferIds0550} from './data/mrSupplierLinks0550';
import {QUOTE_EXTENSION_DAYS_0550,quoteValidity0550} from './data/quoteValidity0550';

const Toggle=()=> <span className="p55-vnd-toggle" aria-hidden="true"><span>+</span><span>−</span></span>;
const quoteTitle=q=>[q.title,q.fileName,q.revision&&'Rev.'+q.revision,q.hash?.slice(0,8)].filter(Boolean).join(' · ');
const rowSections=[['BASE','Base · รายการหลัก'],['OPTION','Option · รายการทางเลือก'],['REFERENCE','รายการรวมในแพ็กเกจ / อ้างอิง']];
function QuoteTotal({quote,fx,selectedR11,groupOnly=false}){
 const r11=selectedR11&&quote.entries.find(e=>e.offer.id===CERAGON_R11_0550);
 if(r11){
  const {offer}=r11,rate=offer.unitCost;
  const total=vendorQuoteTotals0550({entries:[{...r11,offer:{...offer,quoteEvidence:{...offer.quoteEvidence,classification:'RATE',quotedTotal:rate}}}]},fx).base;
  return <span className="p55-vnd-total"><strong>R11 · ฐาน Working 1 Lot · {amount(rate,offer.currency)}</strong>
   <span>เทียบเงินโครงการ {amount(total.totalTHB,'THB')} · R12 อะไหล่ / R14 SLA แยกขอบเขต</span>
   <span>Qty ต้นฉบับของ R11 = 0</span></span>;
 }
 const t=vendorQuoteTotals0550(quote,fx,groupOnly);
 if(t.referenceOnly)return <span className="p55-vnd-total">ฐาน Working อ้างอิง · ดูยอดในใบเสนอราคาต้นฉบับ</span>;
 const baseLabel=groupOnly?(['SHARED','UNASSIGNED'].includes(quote.system)?'ยอด Base ของกลุ่มนี้':'รวมเฉพาะระบบนี้'):t.net?'รวมสุทธิใบเสนอราคา':'รวมใบเสนอราคา';
 const show=(s,label)=><span className="p55-vnd-total-part">
  <strong>{label}: {s.totalTHB!==null?amount(s.totalTHB,'THB')+' THB':s.hasConverted?'ยอดที่ทราบ '+amount(s.knownTHB,'THB')+' THB · ยังไม่ครบ':'OPEN'}</strong>
  {s.native.length>0&&<span>ต้นทาง {s.native.map(n=>amount(n.value,n.currency)+' '+n.currency).join(' + ')}{s.missingPrices>0?' · เฉพาะยอดที่ทราบ':''}</span>}
  {s.rates.some(r=>r.currency!=='THB')&&<span>FX {s.rates.filter(r=>r.currency!=='THB').map(r=>'1 '+r.currency+' = '+r.rate+' THB').join(' · ')} · {t.fxDate} · {t.fxSource}</span>}
  {s.missingFX.length>0&&<span>รอ FX {s.missingFX.join(' / ')} → THB พร้อมแหล่งอ้างอิงและวันที่</span>}
  {s.missingPrices>0&&<span>{s.missingPrices} รายการยังไม่มียอดแน่นอน / As actual</span>}
  {s.ambiguous&&<span>OPEN · พบยอดสุทธิหลายรายการ ต้องตรวจต้นฉบับก่อนรวม</span>}
 </span>;
 return <span className="p55-vnd-total" data-vnd-quote-total="true">
  {t.packageUnallocated?<span>Base · ราคาเหมารวมทั้งใบ · รอหลักฐานแบ่งยอดตามระบบ</span>:t.hasBase?show(t.base,baseLabel):null}
  {t.option&&show(t.option,'Option แยก')}
  {!t.packageUnallocated&&!t.hasBase&&!t.option&&<span>มีเฉพาะรายการอ้างอิงในกลุ่มนี้</span>}
 </span>;
}
export function VendorOfferGroups0550({data,reviewDate,onEdit,onNavigate,navigationTarget}){
 const [mode,setMode]=useState('company');
 const entries=useMemo(()=>vendorOfferEntries0550(data),[data]);
 const quoteGroups=useMemo(()=>groupVendorOffers0550(entries,mode,SYSTEMS,{sourceGroups:true}),[entries,mode]);
 const fullQuotes=[...new Map(quoteGroups.flatMap(group=>group.children.flatMap(child=>child.quotes))
  .filter(q=>q.totalEntries.length>q.entries.length&&!q.referenceOnly).map(q=>[q.key,q])).values()];
 const selectedR11=ceragonR11Selected0550(data);
 const archived=selectedR11&&data.offers.find(o=>o.id===CERAGON_R10_0550);
 const archivedKey=archived?'bid.vendor.offer.'+archived.id:null;
 const mgwVendorId=mgwReplacementActive0550(data) && (data.offers.find(mgwCurrentOffer0550)?.vendorId ||
  data.vendors.find(v=>v.id==='VENDOR-MGW-0550')?.id || data.offers.find(o=>mgwHistoricalOffer0550(data,o))?.vendorId);
 const supplementalVendorIds=[...new Set([archived?.vendorId,mgwVendorId].filter(Boolean))];
 const groups=mode==='company'?[...quoteGroups,...supplementalVendorIds.filter(id=>!quoteGroups.some(g=>g.key===id))
  .map(id=>({key:id,title:data.vendors.find(v=>v.id===id)?.name||id,children:[],offerIds:new Set()}))]
  .sort((a,b)=>a.title.localeCompare(b.title,'en',{numeric:true})):quoteGroups;
 const requirementsByOffer=useMemo(()=>{
  const index=new Map();
  for(const requirement of data.integrationWorkspace?.requirements||[]){
   for(const id of requirementSupplierOfferIds0550(requirement)){
    if(!index.has(id))index.set(id,[]);
    index.get(id).push(requirement);
   }
  }
  return index;
 },[data.integrationWorkspace]);
 useEffect(()=>{
  if(!navigationTarget)return;
  if(navigationTarget===archivedKey||entries.some(({offer})=>navigationTarget==='bid.vendor.'+offer.vendorId)||
   navigationTarget==='bid.vendor.'+archived?.vendorId||navigationTarget==='bid.vendor.'+mgwVendorId)setMode('company');
 },[entries,archivedKey,archived,mgwVendorId,navigationTarget]);
 const anchors=new Set();
 const packageQuotes=new Map(data.offers.filter(o=>o.quoteEvidence?.commercialTotals).map(o=>[o.id,o]));
 const renderRow=entry=>{
  const o=entry.offer,e=o.quoteEvidence,r=mgwQuoteItem0550(o),s=o.supplierQuoteRow,towerScope=towerOfferScope0550(o),commercial=e?.commercialTotals;
  const validity=quoteValidity0550(o,reviewDate);
  const netRate=vendorQuoteNetUnitRate0550(o,packageQuotes.get(s?.parentOfferId));
  const anchor=!anchors.has(o.id);anchors.add(o.id);
  const currentMr=mgwCurrentMr0550(o);
  const selected=entry.working.filter(activeSupply0550),referenceSelected=entry.referenceWorking.filter(activeSupply0550);
  const allocated=entry.allocatedWorking.filter(u=>u.current&&activeSupply0550(u.line)),stale=entry.allocatedWorking.filter(u=>!u.current);
  const sourceQty=mgwRadioDtrsOffer0550(o)&&e.classification==='OPTION'?'TBD':e?.quotedQuantity??s?.quantity??r?.quantity;
  const sourceUnit=e?.quotedUnit??s?.quotedUnit??r?.sourceUnit;
  const usageSystems=entry.systemTokens.filter(token=>!entry.sourceSystemTokens.includes(token));
  return <tr key={o.id} data-component-key={anchor?'bid.vendor.offer.'+o.id:undefined} data-vnd-offer={o.id} tabIndex={-1}>
   <td><strong>{s?.itemCode&&<small>Item {s.itemCode}</small>}{supplierItemLabel0550(o)}</strong><SupplierItemSourceText0550 offer={o} data={data}/><small>{o.brand}</small>
    <small>ขอบเขตใบเสนอราคา: {mgwProjectWideService0550(o)?'COMMON · ค่าแรงระดับโครงการ / B1':entry.sourceSystemTokens.join(' / ')||'ยังไม่ระบุระบบ'}</small>
    {usageSystems.length>0&&<small>ระบบที่อ้างใน Mapping / Working: {usageSystems.join(' / ')}</small>}
    <details><summary>รายละเอียด / ต้นฉบับ</summary>
     {r&&<><p>{r.site} · PDF p{r.page} · item {r.sn||r.id}</p>{r.issues.map(x=><p key={x}>{x}</p>)}<p>ยอดรายการในต้นฉบับ {amount(r.extended,'USD')}</p>{o.unitCost!==r.unitCost&&<p>เรตต้นฉบับ {amount(r.unitCost,'USD')} · คงเรตที่บันทึกไว้ในตาราง</p>}</>}
     {e&&<><p>{e.locator} · revision: {e.revision||'ต้นฉบับไม่ระบุ'}</p><p><a href={e.sourceUrl} target="_blank" rel="noopener noreferrer">เปิดใบเสนอราคาต้นฉบับ</a></p><small>Source ID: {e.sourceId}<br/>SHA256: {e.sourceSha256}</small></>}
     {commercial&&<p>Gross {amount(commercial.gross,e.quotedCurrency)} · ฐานส่วนลด {amount(commercial.discountable,e.quotedCurrency)} · ส่วนลด {commercial.discountPercent}% ({amount(commercial.discount,e.quotedCurrency)}) · NET {amount(commercial.net,e.quotedCurrency)}</p>}
     <p>{o.sourceRef}</p>
    </details>
   </td>
   <td>{entry.referenceOnly?<>{entry.working.map(l=>(l.quantity??'OPEN')+' '+l.unit).join(' / ')||'Working basis'}<small>จำนวนที่ใช้ใน Working</small></>:<>{sourceQty===undefined?'ไม่ระบุ':sourceQty} {sourceUnit||'หน่วยรอยืนยัน'}{e&&<small>จำนวนอ้างอิงใน Quote</small>}{r&&<small>{r.kind==='COVER_ONLY'?'ยอดเหมาหน้าสรุป':'จำนวนต้นฉบับ ไม่แทนจำนวน MR'}</small>}</>}</td>
   <td><strong>{amount(e?e.quotedUnitCost:o.unitCost,e?.quotedCurrency||o.currency)}</strong><small>/ {e?.quotedUnit||o.unit}</small>{entry.referenceOnly&&<small>ฐาน Working เดิมรวมหลายใบเสนอราคา · ดูต้นฉบับแยกฉบับ</small>}{e&&<><small>{e.rateBasis}</small>{(o.unitCost!==e.quotedUnitCost||o.currency!==e.quotedCurrency||o.unit!==e.quotedUnit)&&<small>เรตที่บันทึกไว้ {amount(o.unitCost,o.currency)} / {o.unit}</small>}</>}
    {netRate!==null&&<small>เรตสุทธิอ้างอิง {netRate.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:4})} {e.quotedCurrency} / {e.quotedUnit} · {s.discountable?'ใช้ส่วนลด':'ไม่อยู่ในฐานส่วนลด'}</small>}
    {e?.classification==='OPTION'&&<small>{selectedR11&&o.id===CERAGON_R11_0550?'OPTION ในใบต้นฉบับ · เลือกใช้ 1 Lot ใน Working':'OPTION · ยังไม่รวมในฐานโดยอัตโนมัติ'}</small>}
    {s&&<small>{s.classification==='NET_PACKAGE'?'ต้นทุนสุทธิทั้งแพ็กเกจ':s.classification==='INCLUDED_REFERENCE'?'รวมใน Package · ไม่มีราคาแยก':s.classification==='OPTION'?'OPTION · อ้างอิงแยกจากฐาน':'ราคาก่อนส่วนลด · อ้าง Package เดียว'} · Item {s.itemCode}</small>}
    {s?.classification!=='NET_PACKAGE'&&s?.parentOfferId&&<small>{s.parentOfferId}</small>}
   </td>
   <td>{entry.referenceOnly?'อ้างอิงยอดต้นฉบับแยกแต่ละฉบับ':e?.quotedTotal!==undefined?(e.quotedTotal===null?e.quotedTotalText||'ต้นฉบับไม่ระบุยอดแยก':amount(e.quotedTotal,e.quotedCurrency)):r?amount(r.extended,'USD'):'OPEN · ยังไม่บันทึกยอดต้นฉบับ'}{e&&<small>{e.locator}</small>}</td>
   <td>{o.date||'วันที่ OPEN'}<small>Valid until: {o.validUntil||'ไม่ระบุวันสิ้นสุด'}</small>
    {validity.extended&&<small>ใช้ในงบถึง {validity.effectiveUntil} · โครงการขยาย {QUOTE_EXTENSION_DAYS_0550} วัน{validity.expired?' · หมดอายุ':''}</small>}
   </td>
   <td><ComponentCopyId projectId="PJ2608-0550" componentKey={'bid.vendor.offer.'+o.id}/><button type="button" onClick={()=>onEdit(o)}>เปิด Offer / แก้ไข</button>
    <small>{towerScope?towerScope.text:selected.length?'มี Working ที่เลือกใช้ '+selected.length+' รายการ':allocated.length?'จัดสรรต้นทุนใน Working แล้ว '+allocated.length+' รายการ':referenceSelected.length?'อ้างอิงเจ้าของราคา Working เดิม':stale.length?'ฐานจัดสรรเปลี่ยน · ต้องทบทวน':'ยังไม่เลือกใช้ใน Working'}</small>
    {allocated.map(u=><small key={u.line.id}>Part {u.line.wbs[0]} / {u.line.wbs} → {u.line.customerRowCode||'Customer row OPEN'} · {u.line.description}{u.kind==='ESTIMATE'?' · รวมในต้นทุนผสมใบเสนอราคาและประมาณการ':''}</small>)}
    {stale.map(u=><small key={u.line.id}>ต้องทบทวนลิงก์ {u.line.id} · ข้อมูลรายการหรือราคาต้นทางเปลี่ยน</small>)}
    {referenceSelected.length>0&&<small>อ้างอิงฐาน Working เดิม {referenceSelected.length} รายการ · ตรวจขอบเขตก่อนเปลี่ยนราคา</small>}
    {onNavigate&&currentMr.length>0&&<details><summary>MR · ขอบเขตรอตรวจ</summary>{currentMr.map(id=><div key={id}><button type="button" onClick={()=>onNavigate('bid.working-preview.requirement.REQDEF-'+id)}>{id}</button></div>)}</details>}
    {onNavigate&&requirementsByOffer.has(o.id)&&<details><summary>SI Mapping · {requirementsByOffer.get(o.id).length} ข้อ</summary>{requirementsByOffer.get(o.id).map(r=><div key={r.id}><button type="button" onClick={()=>onNavigate('bid.working-preview.requirement.'+r.id)}>{r.site? r.site+' · ':''}{r.title||r.id}</button></div>)}</details>}
    {onNavigate&&[...new Map([...selected,...allocated.map(u=>u.line),...referenceSelected].map(line=>[line.id,line])).values()].map(line=><div key={line.id}><button type="button" onClick={()=>onNavigate('bid.budget.working.line.'+line.id)}>10.2 · {line.wbs} · {line.description}</button></div>)}
   </td>
  </tr>;
 };
 const renderRows=quote=><div className="p55-table-wrap"><table className="p55-table" aria-label={'Vendor costs '+quote.title}><thead><tr><th>รายการ / ระบบ</th><th>จำนวน / หน่วยต้นฉบับ</th><th>ต้นทุน / หน่วยเรต<br/>Unit Price ต้นฉบับ</th><th>Total Price ต้นฉบับ</th><th>วันที่ / เงื่อนไข</th><th>Offer ID / การใช้ใน Working</th></tr></thead>
  {rowSections.map(([type,label])=>{
   const rows=quote.entries.filter(e=>vendorQuoteRowTreatment0550(e)===type);
   return rows.length>0&&<tbody key={type} data-vnd-treatment={type}><tr><th colSpan={6} scope="rowgroup">{label} · {rows.length} รายการ</th></tr>{rows.map(renderRow)}</tbody>;
  })}
 </table></div>;
 const renderFullQuotes=quotes=>quotes.length>0&&<details className="p55-panel" aria-label="Full quotation totals">
  <summary>ยอดทั้งใบสำหรับใบเสนอราคาที่มีหลายกลุ่ม · {quotes.length} ใบ</summary>
  {quotes.map(q=><div key={q.key} aria-label={'Full quotation '+q.title}>
   <strong>{q.entries[0].vendor?.name||q.entries[0].offer.vendorId} · {quoteTitle(q)}</strong>
   <QuoteTotal quote={q} fx={data.fx}/>
  </div>)}
 </details>;
 const archivedR10=archived&&<details data-component-key={archivedKey}><summary>CERAGON · R10 ต้นฉบับ / ประวัติ</summary>
  <ComponentCopyId projectId="PJ2608-0550" componentKey={archivedKey}/>
  <p>R10 · 2+2 Hot Standby · ฐานเดิมก่อนเลือก R11</p>
  {archived.quoteEvidence?.sourceUrl&&<a href={archived.quoteEvidence.sourceUrl} target="_blank" rel="noopener noreferrer">เปิดใบเสนอราคาต้นฉบับ</a>}
 </details>;
 return <div className="p55-vnd-groups" aria-label="Vendor cost register">
  <div className="p55-review-toolbar" aria-label="Vendor grouping">
   <button type="button" aria-pressed={mode==='company'} onClick={()=>setMode('company')}>บริษัท → ระบบ</button>
   <button type="button" aria-pressed={mode==='system'} onClick={()=>setMode('system')}>ระบบ → บริษัท</button>
   <span>{entries.length} Offer IDs · ต้นทุนตามสกุล/หน่วยต้นฉบับ</span>
  </div>
  <p>แต่ละ Offer อยู่ในกลุ่มเดียวตามขอบเขตต้นฉบับ · งานหลายระบบอยู่ในกลุ่มงานร่วม · แยก Base, Option และรายการอ้างอิง · ระบบที่ใช้ Offer ใน Mapping / Working ดูได้ในแต่ละแถว</p>
  {mode==='system'&&<>
   <MgwCurrentQuote0550 data={data}/>
   <PagaQuoteScope0550 data={data} section="vendor" onNavigate={onNavigate}/>
   {renderFullQuotes(fullQuotes)}
   <SupplierTowerBom0550 data={data} onNavigate={onNavigate}/>
   <SupplierPagaBom0550 data={data} onNavigate={onNavigate}/>
  </>}
  {groups.map(g=><details key={mode+g.key} className="p55-vnd-group" data-vnd-group={g.key} data-component-key={mode==='company'?'bid.vendor.'+g.key:undefined} style={bidOwnerStyle(g.system)}>
   <summary><Toggle/>{g.title} · {new Set(g.children.flatMap(c=>c.quotes.filter(q=>!q.referenceOnly).map(q=>q.key))).size} ใบเสนอราคา · {g.offerIds.size} Offer IDs{mode==='company'&&<> {' '}<ComponentCopyId projectId="PJ2608-0550" componentKey={'bid.vendor.'+g.key}/></>}</summary>
   {mode==='company'&&<>
    {g.key===mgwVendorId&&<MgwCurrentQuote0550 data={data}/>}
    {g.key==='LEGACY-VENDOR-INDUSTRONIC'&&<PagaQuoteScope0550 data={data} section="vendor" onNavigate={onNavigate}/>}
    {renderFullQuotes(fullQuotes.filter(q=>q.entries[0].offer.vendorId===g.key))}
    {g.key===archived?.vendorId&&archivedR10}
    <SupplierTowerBom0550 data={data} vendorId={g.key} onNavigate={onNavigate}/>
    <SupplierPagaBom0550 data={data} vendorId={g.key} onNavigate={onNavigate}/>
   </>}
   {g.children.map(child=><details key={child.key} className="p55-vnd-group" data-vnd-subgroup={child.key} style={bidOwnerStyle(child.system||g.system)}>
    <summary><Toggle/>{child.title}{mode==='system'&&<> {' '}<ComponentCopyId projectId="PJ2608-0550" componentKey={'bid.vendor.'+child.key}/></>}</summary>
    {child.quotes.map(q=><details key={q.key} className="p55-vnd-quote" data-vnd-source-quote={q.referenceOnly?'false':'true'}>
     <summary><Toggle/>{q.referenceOnly?'ฐาน Working เดิม · ':''}{quoteTitle(q)} · {q.entries.length} รายการ<QuoteTotal quote={q} fx={data.fx} selectedR11={selectedR11} groupOnly/></summary>
     {renderRows(q)}
     <SupplierQuoteBoq0550 offers={q.entries.map(entry=>entry.offer)}/>
    </details>)}
   </details>)}
  </details>)}
 </div>;
}
