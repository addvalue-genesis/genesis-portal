import {PagaQuoteScope0550} from './PagaQuoteScope0550';
import {chevalierPbxSource0550} from './data/chevalierPbxQuote0550';
import {MgwCurrentQuote0550} from "./MgwCurrentQuote0550";
import {VENDOR_VOLUME_TAGS_0550,VENDOR_OFFER_TAG_FIELDS_0550,VENDOR_PHYSICAL_TAG_FIELDS_0550,offerLinkedSections0550,offerSourceSections0550} from './data/vendorBidTags0550';
import {MGW_AERO_FIXED_DRAFT_UNIT_NOTE_0550,mgwAeroFixedDraftUnit0550,mgwFocSupplyOffer0550,mgwRadioSourceModel0550,mgwRadioSourceRow0550} from './data/mgwQuoteSelection0550';
import {scheduleAllocationPlan0550} from './data/bidVolumeWorkingPreview0550';
import {mgwCurrentMr0550,mgwCurrentOffer0550,mgwRadioDtrsOffer0550} from "./data/mgwQuoteSelection0550";
import {CERAGON_R11_0550,CERAGON_R10_0550,ceragonR11Selected0550} from './data/ceragonSelection0550';
import {atomicScheduleTotals0550} from './data/atomicLines0550';
import {towerOfferScope0550} from './data/towerTenderScope0550';
import React,{useEffect,useMemo,useState} from 'react';
import {vendorOfferEntries0550,groupVendorOffers0550,vendorQuoteTotals0550,vendorQuoteRowTreatment0550,vendorQuoteNetUnitRate0550,latestPagaVendorPackage0550,vendorPagaHistoricalQuote0550} from './data/vendorRegister0550';
import {mgwHistoricalOffer0550,mgwQuoteItem0550,mgwProjectWideService0550} from './data/mgwVendorBasis0550';
import {SYSTEMS} from './data';
import {bidOwnerStyle} from './bidPresentation0550';
import {ComponentCopyId} from '../common/ui/ComponentCopyId';
import {amount} from './BidControls';
import {activeSupply0550} from './data/workingOffers0550';
import {SupplierItemSourceText0550,SupplierQuoteBoq0550,SupplierTowerBom0550,SupplierPagaBom0550} from './SupplierItemSourceText0550';
import {RadioLotBomTable0550} from './RadioLotBom0550';
import {supplierItemLabel0550,supplierQuotedSection0550} from './data/supplierCostProjection0550';
import {requirementSupplierOfferIds0550} from './data/mrSupplierLinks0550';
import {QUOTE_EXTENSION_DAYS_0550,quoteValidity0550} from './data/quoteValidity0550';
import {cabinetTagLabel0550,draftCabinetTag0550,mappedCabinetTags0550} from './data/cabinetTag0550';

const Toggle=()=> <span className="p55-vnd-toggle" aria-hidden="true"><span>+</span><span>−</span></span>;
const quoteTitle=q=>[q.title,q.fileName,q.revision&&'Rev.'+q.revision,q.hash?.slice(0,8)].filter(Boolean).join(' · ');
const primarySection=offer=>{
 const sections=offer.bidTags?.sections||[];
 const details=sections.filter(tag=>tag!=='A1'&&tag!=='A2');
 if(details.length===1)return details[0];
 return sections.length===1?sections[0]:'';
};
const rowSections=[['BASE','Base · รายการหลัก'],['OPTION','Option · รายการทางเลือก'],['REFERENCE','รายการรวมในแพ็กเกจ / อ้างอิง']];
function OfferLocation({location,onNavigate}){
 if(!location)return null;
 const {state,sites,requirements,note}=location;
 if(state==='OPEN'||state==='COMMON')return <small>Location · {state} · {note}</small>;
 const label=state==='REFERENCE'?'ไซต์อ้างอิง · Option ยัง OPEN':'CUS Draft';
 return <details><summary>Location · {sites.join(' / ')} · {label}</summary>
  <p>{note}</p>
  {requirements.map(r=><div key={r.id}>
   {onNavigate?<button type="button" onClick={()=>onNavigate('bid.working-preview.requirement.REQDEF-'+r.id)}>{r.site} · {r.description}</button>:<span>{r.site} · {r.description}</span>}
   <small>MR {r.quantity} {r.unit} · {r.reference}</small>
  </div>)}
 </details>;
}
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
 const baseLabel=t.net?'รวมสุทธิใบเสนอราคา':groupOnly?
  (['SHARED','UNASSIGNED'].includes(quote.system)?'ยอด Base ของกลุ่มนี้':'รวมเฉพาะระบบนี้'):'รวมใบเสนอราคา';
 const show=(s,label)=><span className="p55-vnd-total-part">
  <strong>{label}: {s.totalTHB!==null?amount(s.totalTHB,'THB')+' THB':s.hasConverted?'ยอดที่ทราบ '+amount(s.knownTHB,'THB')+' THB · ยังไม่ครบ':'OPEN'}</strong>
  {s.native.length>0&&<span>ต้นทาง {s.native.map(n=>amount(n.value,n.currency)+' '+n.currency).join(' + ')}{s.missingPrices>0?' · เฉพาะยอดที่ทราบ':''}</span>}
  {s.rates.some(r=>r.currency!=='THB')&&<span>FX {s.rates.filter(r=>r.currency!=='THB').map(r=>'1 '+r.currency+' = '+r.rate+' THB').join(' · ')} · {t.fxDate} · {t.fxSource}</span>}
  {s.missingFX.length>0&&<span>รอ FX {s.missingFX.join(' / ')} → THB พร้อมแหล่งอ้างอิงและวันที่</span>}
  {s.missingPrices>0&&<span>{s.missingPrices} รายการยังไม่มียอดรวมในต้นฉบับ</span>}
  {s.ambiguous&&<span>OPEN · พบยอดสุทธิหลายรายการ ต้องตรวจต้นฉบับก่อนรวม</span>}
 </span>;
 return <span className="p55-vnd-total" data-vnd-quote-total="true">
  {t.packageUnallocated?<span>Base · ราคาเหมารวมทั้งใบ · รอหลักฐานแบ่งยอดตามระบบ</span>:t.hasBase?show(t.base,baseLabel):null}
  {t.option&&show(t.option,'Option แยก')}
  {!t.packageUnallocated&&!t.hasBase&&!t.option&&<span>มีเฉพาะรายการอ้างอิงในกลุ่มนี้</span>}
 </span>;
}
function QuoteAtomicLines0550({lines}){
 const [open,setOpen]=useState(false);
 if(!lines.length)return null;
 const tags=new Map(lines.map(line=>[line.line_id,line.anchor.tag]));
 return <details className="p55-panel" data-vnd-atomic-lines onToggle={event=>{
  if(event.target===event.currentTarget)setOpen(event.currentTarget.open);
 }}>
  <summary>ALIE Rev.R2 · {lines.length} บรรทัด</summary>
  {open&&<>
   <small>ยอดตามหมวดก่อนส่วนลด · ส่วนลดคิดที่สรุปใบเสนอราคา</small>
   <ul aria-label="ALIE schedule totals">{atomicScheduleTotals0550(lines).map(total=><li key={[total.schedule,total.currency,total.treatment].join('|')}>
    {total.schedule} · {total.treatment} · {total.known===null?'OPEN':amount(Number(total.known),total.currency)}
    {total.open>0&&' · OPEN '+total.open+' รายการ'}
    {total.schedule==='C1'&&' · แสดงจาก EQUIP / A1'}
   </li>)}</ul>
   <div className="p55-table-wrap"><table className="p55-table" aria-label="ALIE atomic lines"><thead><tr>
    <th>TAG / Location / Cabinet</th><th>Part / Service</th><th>Class → Schedule</th><th>Qty / UOM</th><th>Unit cost ต้นทาง</th>
   </tr></thead><tbody>{lines.map(({line_id,anchor,route,part,qty,cost,internal,prov,parent_line_id})=><tr key={line_id}>
    <td><strong>{anchor.tag}</strong><small>{anchor.tag_status}</small>
     <small>{[anchor.site,anchor.location,anchor.cabinet].filter(Boolean).join(' · ')||'Location OPEN'}</small>
     {anchor.tag_intended&&<small>TAG รอยืนยัน · {anchor.tag_intended}</small>}
    </td>
    <td>{part.vnd_desc}{part.vnd_pn&&<small>P/N / Code · {part.vnd_pn}</small>}
     {parent_line_id&&<small>Parent · {tags.get(parent_line_id)||parent_line_id}</small>}
     <small>{line_id}</small><small>{prov.src}</small>
    </td>
    <td>{route.line_class} → {route.schedule}<small>{internal.treatment}</small></td>
    <td>{qty.value??qty.state} {qty.uom}</td>
    <td>{internal.treatment==='REFERENCE'?'อ้างอิง · ราคาอยู่ที่ระดับใบเสนอราคา':cost.unit??cost.state}
     {internal.treatment!=='REFERENCE'&&' '+cost.currency}
     {internal.lump_unsplit&&<small>ราคาเหมารวมตามใบเสนอราคา</small>}
     <details><summary>หลักฐานและเงื่อนไข</summary><small>{internal.notes}</small></details>
    </td>
   </tr>)}</tbody></table></div>
  </>}
 </details>;
}

export function VendorOfferGroups0550({data,model,reviewDate,onEdit,onNavigate,navigationTarget}){
 const [mode,setMode]=useState('company');
 const [sectionFilter,setSectionFilter]=useState('');
 const entries=useMemo(()=>vendorOfferEntries0550(data),[data]);
 const sectionsByOffer=useMemo(()=>{
  const bindingsByLine=new Map((data.bidVolumes?.bindings||[]).map(binding=>[binding.lineId,binding]));
  const focOwners=new Set((model?.provisional?.selected||[]).filter(line=>mgwFocSupplyOffer0550(line.offer)).map(line=>line.id));
  const unallocated=(model?.official?.lines||[]).filter(line=>focOwners.has(line.id)&&!bindingsByLine.has(line.id));
  if(unallocated.length)for(const {proposal} of scheduleAllocationPlan0550(data,{unallocated}))if(proposal)bindingsByLine.set(proposal.lineId,proposal);
  return new Map(entries.map(entry=>{
   const lineIds=new Set([...entry.working,...entry.allocatedWorking.map(use=>use.line)].map(line=>line.id));
   const active=mgwFocSupplyOffer0550(entry.offer)&&model?[...lineIds].filter(id=>focOwners.has(id)):[...lineIds];
   const bindings=active.map(id=>bindingsByLine.get(id)).filter(Boolean);
   return [entry.offer.id,offerLinkedSections0550(offerSourceSections0550(entry.offer),bindings,active.length>0)];
  }));
 },[data,entries,model]);
 const quoteGroups=useMemo(()=>groupVendorOffers0550(entries,mode,SYSTEMS,{sourceGroups:true}),[entries,mode]);
 const latestPaga=latestPagaVendorPackage0550(data.offers);
 const isHistorical=q=>vendorPagaHistoricalQuote0550(q.entries[0].offer,latestPaga);
 const isLatestPaga=q=>q.entries.some(({offer})=>offer.id===latestPaga?.id);
 const fullQuotes=[...new Map(quoteGroups.flatMap(group=>group.children.flatMap(child=>child.quotes))
  .filter(q=>q.totalEntries.length>q.entries.length&&!q.referenceOnly&&!isHistorical(q)).map(q=>[q.key,q])).values()];
 const selectedR11=ceragonR11Selected0550(data);
 const archived=selectedR11&&data.offers.find(o=>o.id===CERAGON_R10_0550);
 const archivedKey=archived?'bid.vendor.offer.'+archived.id:null;
 const mgwVendorId=data.offers.find(mgwCurrentOffer0550)?.vendorId ||
  data.vendors.find(v=>v.id==='VENDOR-MGW-0550')?.id || data.offers.find(o=>mgwHistoricalOffer0550(data,o))?.vendorId;
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
  const targetOffer=entries.find(({offer})=>navigationTarget==='bid.vendor.offer.'+offer.id);
  if(targetOffer)setSectionFilter('');
  if(targetOffer||navigationTarget===archivedKey||entries.some(({offer})=>navigationTarget==='bid.vendor.'+offer.vendorId)||
   navigationTarget==='bid.vendor.'+archived?.vendorId||navigationTarget==='bid.vendor.'+mgwVendorId)setMode('company');
 },[entries,archivedKey,archived,mgwVendorId,navigationTarget]);
 const anchors=new Set();
 const packageQuotes=new Map(data.offers.filter(o=>o.quoteEvidence?.commercialTotals).map(o=>[o.id,o]));
 const renderRow=entry=>{
  const o=entry.offer,e=o.quoteEvidence,r=mgwQuoteItem0550(o),s=o.supplierQuoteRow,towerScope=towerOfferScope0550(o),commercial=e?.commercialTotals;
  const validity=quoteValidity0550(o,reviewDate);
  const sourceSection=supplierQuotedSection0550(data,o);
  const radioSource=mgwRadioSourceRow0550(o),radioModel=mgwRadioSourceModel0550(radioSource);
  const atom=o.atomicLines?.[0];
  const equipment=o.bidTags?.lineClass?.includes('EQUIP');
  const netRate=atom?null:vendorQuoteNetUnitRate0550(o,packageQuotes.get(s?.parentOfferId));
  const anchor=!anchors.has(o.id);anchors.add(o.id);
  const currentMr=mgwCurrentMr0550(o);
  const selected=entry.working.filter(activeSupply0550),referenceSelected=entry.referenceWorking.filter(activeSupply0550);
  const allocated=entry.allocatedWorking.filter(u=>u.current&&activeSupply0550(u.line)),stale=entry.allocatedWorking.filter(u=>!u.current);
  const sourceQty=mgwRadioDtrsOffer0550(o)&&e.classification==='OPTION'?'TBD':e?.quotedQuantity??s?.quantity??r?.quantity;
  const sourceUnit=e?.quotedUnit??s?.quotedUnit??r?.sourceUnit;
  const draftUnit=mgwAeroFixedDraftUnit0550(o);
  const usageSystems=entry.systemTokens.filter(token=>!entry.sourceSystemTokens.includes(token));
  const mappedRacks=[...new Set((requirementsByOffer.get(o.id)||[]).flatMap(r=>mappedCabinetTags0550(r,{offerId:o.id})))];
  const draftRack=entry.location?.requirements.map(r=>draftCabinetTag0550(r.id)).find(Boolean);
  const rackLabel=cabinetTagLabel0550(mappedRacks,draftRack);
  const lotBom=o.components?.length?<tr className="p55-radio-lot-bom-row" data-radio-lot-bom={o.id}><td colSpan={6}>
   <RadioLotBomTable0550 components={o.components} caption={'BOM ต่อชุด · '+supplierItemLabel0550(o)} sourceBrand={radioSource?.brand} sourceModel={radioModel}/>
  </td></tr>:null;
  return <React.Fragment key={o.id}><tr data-component-key={anchor?'bid.vendor.offer.'+o.id:undefined} data-vnd-offer={o.id} tabIndex={-1}>
   <td><strong>{s?.itemCode&&<small>Item {s.itemCode}</small>}{supplierItemLabel0550(o)}</strong>{sourceSection?.part&&<small>P/N {sourceSection.part}</small>}<small>{[o.brand,radioModel].filter(Boolean).join(' · ')}</small><SupplierItemSourceText0550 offer={o} data={data} sourceSection={sourceSection}/>
    <small>ขอบเขตใบเสนอราคา: {mgwProjectWideService0550(o)?'COMMON · ค่าแรงระดับโครงการ / B1':entry.sourceSystemTokens.join(' / ')||'ยังไม่ระบุระบบ'}</small>
    <OfferLocation location={entry.location} onNavigate={onNavigate}/>
    <small>Volume I · {sectionsByOffer.get(o.id).map(tag=>'11.'+tag).join(' · ')||'OPEN'}</small>
    {VENDOR_OFFER_TAG_FIELDS_0550.map(([field,label])=>{
     const alieValue=field==='equipment'?atom?.anchor.tag:field==='rack'?atom?.anchor.cabinet:null;
     const value=o.bidTags?.[field]?.join(' · ')||alieValue;
     return (value||equipment&&VENDOR_PHYSICAL_TAG_FIELDS_0550.some(([key])=>key===field))&&<small key={field}>{label} · {value||'OPEN'}</small>;
    })}
    {atom&&<small>ALIE TAG · {atom.anchor.tag} · {atom.anchor.tag_status}</small>}
    {rackLabel&&<small>{rackLabel}</small>}
    {usageSystems.length>0&&<small>ระบบที่อ้างใน Mapping / Working: {usageSystems.join(' / ')}</small>}
    <details><summary>รายละเอียด / ต้นฉบับ</summary>
     {r&&<><p>{r.site} · PDF p{r.page} · item {r.sn||r.id}</p>{r.issues.map(x=><p key={x}>{x}</p>)}<p>ยอดรายการในต้นฉบับ {amount(r.extended,'USD')}</p>{o.unitCost!==r.unitCost&&<p>เรตต้นฉบับ {amount(r.unitCost,'USD')} · คงเรตที่บันทึกไว้ในตาราง</p>}</>}
     {e&&<><p>{e.locator} · revision: {e.revision||'ต้นฉบับไม่ระบุ'}</p><p><a href={e.sourceUrl} target="_blank" rel="noopener noreferrer">เปิดใบเสนอราคาต้นฉบับ</a></p><small>Source ID: {e.sourceId}<br/>SHA256: {e.sourceSha256}</small></>}
     {commercial&&(chevalierPbxSource0550(o)
      ?<p>Products {amount(commercial.discountable,e.quotedCurrency)} · ส่วนลดเหมารวม {amount(commercial.discount,e.quotedCurrency)} · Products NET {amount(commercial.discountable-commercial.discount,e.quotedCurrency)} · Products &amp; Services NET {amount(commercial.net,e.quotedCurrency)}</p>
      :<p>Gross {amount(commercial.gross,e.quotedCurrency)} · ฐานส่วนลด {amount(commercial.discountable,e.quotedCurrency)} · ส่วนลด {commercial.discountPercent}% ({amount(commercial.discount,e.quotedCurrency)}) · NET {amount(commercial.net,e.quotedCurrency)}</p>)}
     <p>{o.sourceRef}</p>
    </details>
   </td>
   <td>{entry.referenceOnly?<>{entry.working.map(l=>(l.quantity??'OPEN')+' '+l.unit).join(' / ')||'Working basis'}<small>จำนวนที่ใช้ใน Working</small></>:<>{sourceQty===undefined?'ไม่ระบุ':sourceQty} {sourceUnit||'หน่วยรอยืนยัน'}{e&&<small>จำนวนอ้างอิงใน Quote</small>}{r&&<small>{r.kind==='COVER_ONLY'?'ยอดเหมาหน้าสรุป':'จำนวนต้นฉบับ ไม่แทนจำนวน MR'}</small>}</>}{draftUnit===o.unit&&<small>{MGW_AERO_FIXED_DRAFT_UNIT_NOTE_0550}</small>}</td>
   <td><strong>{amount(e?e.quotedUnitCost:o.unitCost,e?.quotedCurrency||o.currency)}</strong><small>/ {e?.quotedUnit||o.unit}</small>{entry.referenceOnly&&<small>ฐาน Working เดิมรวมหลายใบเสนอราคา · ดูต้นฉบับแยกฉบับ</small>}{e&&<><small>{e.rateBasis}</small>{(o.unitCost!==e.quotedUnitCost||o.currency!==e.quotedCurrency||o.unit!==e.quotedUnit)&&<small>เรตที่บันทึกไว้ {amount(o.unitCost,o.currency)} / {o.unit}</small>}</>}
    {netRate!==null&&<small>เรตสุทธิอ้างอิง {netRate.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:4})} {e.quotedCurrency} / {e.quotedUnit} · {s.discountable?'ใช้ส่วนลด':'ไม่อยู่ในฐานส่วนลด'}</small>}
    {e?.classification==='OPTION'&&<small>{selectedR11&&o.id===CERAGON_R11_0550?'OPTION ในใบต้นฉบับ · เลือกใช้ 1 Lot ใน Working':'OPTION · ยังไม่รวมในฐานโดยอัตโนมัติ'}</small>}
    {s&&<small>{s.classification==='NET_PACKAGE'?'ต้นทุนสุทธิทั้งแพ็กเกจ':s.classification==='INCLUDED_REFERENCE'?'อ้างอิง · ไม่มีราคาแยก':s.classification==='OPTION'?'OPTION · อ้างอิงแยกจากฐาน':'ราคาก่อนส่วนลด · อ้าง Package เดียว'} · Item {s.itemCode}</small>}
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
  </tr>{lotBom}</React.Fragment>;
 };
 const renderRows=quote=><div className="p55-table-wrap"><table className="p55-table" aria-label={'Vendor costs '+quote.title}><thead><tr><th>รายการ / ระบบ</th><th>จำนวน / หน่วยต้นฉบับ</th><th>ต้นทุน / หน่วยเรต<br/>Unit Price ต้นฉบับ</th><th>Total Price ต้นฉบับ</th><th>วันที่ / เงื่อนไข</th><th>Offer ID / การใช้ใน Working</th></tr></thead>
  {rowSections.map(([type,label])=>{
   const rows=quote.entries.filter(e=>vendorQuoteRowTreatment0550(e)===type&&(!sectionFilter||sectionsByOffer.get(e.offer.id).includes(sectionFilter)));
   if(!rows.length)return null;
   const tagged=quote.entries.some(({offer})=>offer.bidTags?.lineClass?.length);
   const groups=new Map();
   for(const row of rows){
    const section=tagged?primarySection(row.offer):'';
    if(!groups.has(section))groups.set(section,[]);
    groups.get(section).push(row);
   }
   return [...groups].sort(([a],[b])=>VENDOR_VOLUME_TAGS_0550.indexOf(a)-VENDOR_VOLUME_TAGS_0550.indexOf(b))
    .map(([section,items])=>{
     const gross=type==='BASE'&&section?vendorQuoteTotals0550({entries:items}).base.native:[];
     return <tbody key={type+section} data-vnd-treatment={type} data-vnd-quote-section={section||undefined}>
      <tr><th colSpan={6} scope="rowgroup">{label}{section&&' · 11.'+section} · {items.length} รายการ
       {gross.length>0&&' · ก่อนส่วนลด '+gross.map(n=>amount(n.value,n.currency)).join(' + ')}
      </th></tr>
      {items.map(renderRow)}
     </tbody>;
    });
  })}
 </table></div>;
 const renderQuote=q=><details key={q.key} className="p55-vnd-quote" data-vnd-source-quote={q.referenceOnly?'false':'true'}>
  <summary><Toggle/>{isLatestPaga(q)?'ฉบับหลัก · ':q.referenceOnly?'ฐาน Working เดิม · ':''}{quoteTitle(q)} · {q.entries.length} รายการ<QuoteTotal quote={q} fx={data.fx} selectedR11={selectedR11} groupOnly/></summary>
  {renderRows(q)}
  <QuoteAtomicLines0550 lines={q.entries.flatMap(({offer})=>offer.atomicLines||[])}/>
  <SupplierQuoteBoq0550 offers={q.entries.map(entry=>entry.offer)}/>
 </details>;
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
   <label>Volume I TAG <select aria-label="Volume I TAG filter" value={sectionFilter} onChange={event=>setSectionFilter(event.target.value)}>
    <option value="">ทุกหมวด</option>
    {[...VENDOR_VOLUME_TAGS_0550,'M','P'].map(tag=><option key={tag} value={tag}>11.{tag}</option>)}
   </select></label>
   <span>{entries.length} Offer IDs · ต้นทุนตามสกุล/หน่วยต้นฉบับ</span>
  </div>
  {sectionFilter&&<p>แสดง Item ที่มี TAG 11.{sectionFilter} · ยอดใบเสนอราคาแสดงเต็มฉบับ</p>}
  <p>แต่ละ Offer อยู่ในกลุ่มเดียวตามขอบเขตต้นฉบับ · งานหลายระบบอยู่ในกลุ่มงานร่วม · แยก Base, Option และรายการอ้างอิง · ระบบที่ใช้ Offer ใน Mapping / Working ดูได้ในแต่ละแถว</p>
  {mode==='system'&&<>
   <MgwCurrentQuote0550 data={data} showRadioSource sectionFilter={sectionFilter}/>
   <PagaQuoteScope0550 data={data} section="vendor" onNavigate={onNavigate}/>
   {renderFullQuotes(fullQuotes)}
   <SupplierTowerBom0550 data={data} onNavigate={onNavigate}/>
   <SupplierPagaBom0550 data={data} onNavigate={onNavigate} preferredOfferId={latestPaga?.id}/>
  </>}
  {groups.map(g=><details key={mode+g.key} className="p55-vnd-group" data-vnd-group={g.key} data-component-key={mode==='company'?'bid.vendor.'+g.key:undefined} style={bidOwnerStyle(g.system)}>
   <summary><Toggle/>{g.title} · {new Set(g.children.flatMap(c=>c.quotes.filter(q=>!q.referenceOnly).map(q=>q.key))).size} ใบเสนอราคา · {g.offerIds.size} Offer IDs{mode==='company'&&<> {' '}<ComponentCopyId projectId="PJ2608-0550" componentKey={'bid.vendor.'+g.key}/></>}</summary>
   {mode==='company'&&<>
    {g.key===mgwVendorId&&<MgwCurrentQuote0550 data={data} showRadioSource sectionFilter={sectionFilter}/>}
    {g.key==='LEGACY-VENDOR-INDUSTRONIC'&&<PagaQuoteScope0550 data={data} section="vendor" onNavigate={onNavigate}/>}
    {renderFullQuotes(fullQuotes.filter(q=>q.entries[0].offer.vendorId===g.key))}
    {g.key===archived?.vendorId&&archivedR10}
    <SupplierTowerBom0550 data={data} vendorId={g.key} onNavigate={onNavigate}/>
    <SupplierPagaBom0550 data={data} vendorId={g.key} onNavigate={onNavigate} preferredOfferId={latestPaga?.id}/>
   </>}
   {g.children.map(child=>{
    const historical=child.quotes.filter(isHistorical);
    const primary=child.quotes.find(isLatestPaga);
    const other=child.quotes.filter(q=>q!==primary&&!isHistorical(q));
    return <details key={child.key} className="p55-vnd-group" data-vnd-subgroup={child.key} open={primary?true:undefined} style={bidOwnerStyle(child.system||g.system)}>
     <summary><Toggle/>{child.title}{mode==='system'&&<> {' '}<ComponentCopyId projectId="PJ2608-0550" componentKey={'bid.vendor.'+child.key}/></>}</summary>
     {primary&&renderQuote(primary)}
     {other.map(renderQuote)}
     {historical.length>0&&<details className="p55-vnd-group" data-vnd-paga-history>
      <summary><Toggle/>ประวัติใบเสนอราคา INDUSTRONIC · {historical.length} ฉบับ</summary>
      {historical.map(renderQuote)}
     </details>}
    </details>;
   })}
  </details>)}
 </div>;
}
