import {mgwQuoteItem0550,currentSupplierOffers0550,PROCUREMENT_SCOPE_0550} from "./data/mgwVendorBasis0550";
import {MgwQuoteSummary} from "./MgwQuoteViews";
import {VendorOfferGroups0550} from "./VendorOfferGroups0550";
import React,{useState} from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {BID_UNITS,newId} from "./data/bidWorkspaceModel";
import {COMMERCIAL_SOURCES} from "./data";
import {Module,Field,Select,Save,amount} from "./BidControls";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {VENDOR_OFFER_TAG_FIELDS_0550,VENDOR_VOLUME_TAGS_0550,offerSourceSections0550} from './data/vendorBidTags0550';
import {latestPagaVendorPackage0550,latestVendorPackageQuotes0550,vendorPagaHistoricalQuote0550} from './data/vendorRegister0550';
import {activeSupply0550} from './data/workingOffers0550';
import AlieIntake from './AlieIntake';
const tagValues=(field,text)=>[...new Set(text.split(field==='mr'?/\s+\|\s+|\n/:/[|\n]/).map(tag=>tag.trim()).filter(Boolean))];
export function VendorWorkspace({navigationTarget,onNavigate}){
 const {data,model,put,busy,vendorSync,reviewDate}=useBidWorkspace();
 const [vendor,setVendor]=useState({id:"",name:"",kind:"SUPPLIER",reference:""});
 const blankOffer={id:"",vendorId:"",description:"",brand:"",quoteRef:"",sourceRef:"",date:"",validUntil:"",currency:"THB",unit:"MD",unitCost:null};
 const [offer,setOffer]=useState(blankOffer);
 const [offerTagText,setOfferTagText]=useState({});
 const [alieOpened,setAlieOpened]=useState(false);
 if(!data)return <p>กำลังเปิดฐานข้อมูล Bidding…</p>;
 const currentOffers=currentSupplierOffers0550(data);
 const quotedVendorIds=new Set(currentOffers.map(o=>o.vendorId));
 const latestPackages=latestVendorPackageQuotes0550(currentOffers);
 const serviceQuotes=new Map();
 for(const offer of currentOffers){
  if(!offer.atomicLines?.[0]?.route.line_class.startsWith('SERVICE_'))continue;
  const quotes=serviceQuotes.get(offer.vendorId)||new Map();
  if(!quotes.has(offer.quoteRef))quotes.set(offer.quoteRef,offer.id);
  serviceQuotes.set(offer.vendorId,quotes);
 }
 const latestPaga=latestPagaVendorPackage0550(currentOffers);
 const cabinetProcurement=PROCUREMENT_SCOPE_0550.cabinetProcurement;
 const selectedOfferIds=new Set(data.lines.filter(activeSupply0550).map(line=>line.offerId));
 const setV=(k,v)=>setVendor(x=>({...x,[k]:v})),setO=(k,v)=>setOffer(x=>({...x,[k]:v}));
 const authoredSections=offer.bidTags?.sections||[];
 const changeSection=(tag,checked)=>setO('bidTags',{sections:checked?[...authoredSections,tag]:authoredSections.filter(section=>section!==tag)});
 const saveOffer=async event=>{
  event.preventDefault();
  const {bidTags,...sourceOffer}=offer;
  const tags={sections:authoredSections,...Object.fromEntries(VENDOR_OFFER_TAG_FIELDS_0550.map(([field])=>[field,tagValues(field,offerTagText[field]||'')]))};
  const saved={...sourceOffer,id:offer.id||newId('OFFER'),...(Object.values(tags).some(values=>values.length)?{bidTags:tags}:{})};
  if(await put('offers',saved)){setOffer(blankOffer);setOfferTagText({});}
 };
 return <div className="p55-stack p55-vendor-workspace">
 <Module id="bid.vendor.master" title="07.1 Vendor / Service Provider">
 {vendorSync&&<p role="status" aria-label="Vendor register loaded status">{vendorSync.message}</p>}
 <p>ฐานราคาเริ่มต้นที่นำเข้า: {data.vendorBasisImport?.importedLineIds.length||0} รายการ · ตรวจฉบับที่เลือกใช้ใน Working · วันที่/Validity ที่ไม่ทราบคงว่างตามหลักฐาน</p>
 <p>MGW Q26-063: {currentOffers.filter(mgwQuoteItem0550).length} รายการ · {data.mgwQuoteImport?.conflicts.join(" · ")||"นำเข้าเพื่อเลือกตรวจราคา — ไม่แทนผู้ขายเดิมอัตโนมัติ"}</p>
 <p><strong>{PROCUREMENT_SCOPE_0550.procurementOwner} เสนอและรับผิดชอบโดยตรง · อ้างอิงแผนจัดซื้อ</strong> · {PROCUREMENT_SCOPE_0550.directProcurement.map(s=>s.name+' จาก '+s.suppliers.map(v=>v.name+' ('+(latestPaga&&v.vendorIds.includes(latestPaga.vendorId)?latestPaga.quoteRef:v.quoteRef)+(v.quoteScope?' · '+v.quoteScope:'')+')').join(' / ')).join(' · ')}</p>
 <details>
  <summary>ตู้และ Rack ทุกระบบ · {cabinetProcurement.brand} จาก {cabinetProcurement.supplier}</summary>
  <p>LAN · {cabinetProcurement.lanQuoteRef} · ตรวจตู้และอุปกรณ์ประกอบเทียบกับ MR ก่อนยืนยัน</p>
  <p>รายการที่รอยืนยันราคาและขอบเขตตู้ RITTAL</p>
  <ul>{cabinetProcurement.pending.map(({system,scope})=><li key={system}><strong>{system}</strong> · {scope}</li>)}</ul>
 </details>
 <p>{PROCUREMENT_SCOPE_0550.mgw.bidOfferOwner} เสนอระบบอื่น รวม VHF Trunked Radio (DTRS) · ขอบเขตที่ยังไม่มีใบเสนอราคาคงสถานะ OPEN</p>
 <p>MR Appendix 1.4 · INDUSTRONIC PAGA · ADDVALUE +{PROCUREMENT_SCOPE_0550.pagaAppendix14Pricing.markupPct}% → SAMTEL +{PROCUREMENT_SCOPE_0550.pagaAppendix14Pricing.primePct}%</p>
 <p>MR Appendix 1.5 · CERAGON DMR R11 · ADDVALUE +{PROCUREMENT_SCOPE_0550.directSupplierMarkupPct}% → SAMTEL +{PROCUREMENT_SCOPE_0550.dmrAppendix15Pricing.primePct}% · Master Tower ใช้ ADDVALUE +{PROCUREMENT_SCOPE_0550.directSupplierMarkupPct}% ตามฐานจัดซื้อโดยตรง</p>
 <p>ผู้ขายหนึ่งรายมีหลายใบเสนอราคา/เรตได้ แยกต้นทุนจากราคาขาย และเลือกเรตไปใช้ใน Working โดยอ้างอิง Offer ID</p>
 <form onSubmit={async e=>{e.preventDefault();if(await put("vendors",{...vendor,id:vendor.id||newId("VEN")}))setVendor({id:"",name:"",kind:"SUPPLIER",reference:""});}}>
 <div className="p55-bid-fields"><Field label="Vendor name" value={vendor.name} onChange={v=>setV("name",v)} required/><Select label="Vendor type" value={vendor.kind} onChange={v=>setV("kind",v)} options={["SUPPLIER","OEM","SERVICE_PROVIDER","INTERNAL_TEAM"]}/><Field label="Vendor reference" value={vendor.reference} onChange={v=>setV("reference",v)}/></div><Save busy={busy}>บันทึก Vendor</Save></form>
 <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Vendor</th><th>Type / source</th><th>ใบเสนอราคาอ้างอิงล่าสุดในทะเบียน</th><th>ID / action</th></tr></thead><tbody>{data.vendors.map(v=>{
  const latest=latestPackages.get(v.id);
  const evidence=latest?.quoteEvidence;
  return <tr key={v.id} data-component-key={quotedVendorIds.has(v.id)?undefined:"bid.vendor."+v.id}><td>{v.name}</td><td>{v.kind}<small>{v.reference}</small></td><td>{latest&&<>
  <strong>{latest.quoteRef} · {latest.date}</strong>
  <small>NET {amount(evidence.commercialTotals.net,evidence.quotedCurrency)} · {selectedOfferIds.has(latest.id)?'เลือกใน Working':'รอเลือกใน Working'}</small>
  {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.vendor.offer.'+latest.id)}>07.2 · เปิดใบเสนอราคา</button>}
 </>}{!latest&&[...(serviceQuotes.get(v.id)||[])].map(([quoteRef,offerId])=><div key={quoteRef}>
  <strong>{quoteRef}</strong>
  {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.vendor.offer.'+offerId)}>07.2 · ดูเรตบริการ</button>}
 </div>)}</td><td><ComponentCopyId projectId="PJ2608-0550" componentKey={"bid.vendor."+v.id}/><button type="button" onClick={()=>setVendor({...v})}>แก้ไข Vendor</button></td></tr>;})}</tbody></table></div>
 </Module>
 <Module id="bid.vendor.offers" title="07.2 ใบเสนอราคา / ต้นทุนสินค้า / เรตบุคลากร">
 {currentOffers.filter(o=>o.supplierQuoteRow?.classification==="NET_PACKAGE"&&!vendorPagaHistoricalQuote0550(o,latestPaga)).map(o=><p key={o.id}>{o.quoteRef} · ราคาฐานสุทธิ {amount(o.unitCost,o.currency)} · {selectedOfferIds.has(o.id)?"เลือกใน Working แล้ว — ตรวจ scope/ราคาและ Release gates ต่อ":"บันทึกเป็นฉบับใหม่แล้ว / ยังไม่เลือกแทนราคาที่ใช้อยู่"} · รายการย่อยและ Option ไม่บวกในราคาฐานซ้ำ</p>)}
 <form onSubmit={saveOffer}>
 <div className="p55-bid-fields"><Select label="Offer vendor" value={offer.vendorId} onChange={v=>setO("vendorId",v)} options={[["","เลือก Vendor"],...data.vendors.map(v=>[v.id,v.name])]}/>
 {[['description','Product / role / service'],['brand','Brand / model'],['quoteRef','Quotation reference'],['sourceRef','Offer source / file / page']].map(([k,l])=><Field key={k} label={l} value={offer[k]} onChange={v=>setO(k,v)} required={k!=="brand"}/>)}
 <Field label="Quote date" type="date" value={offer.date} onChange={v=>setO("date",v)} required={!offer.id}/><Field label="Valid until" type="date" value={offer.validUntil} onChange={v=>setO("validUntil",v)} required={!offer.id&&!offer.quoteEvidence}/>
 {mgwQuoteItem0550(offer)?.unit===null&&<Field label="Offer unit confirmation / source" value={offer.unitBasis||""} onChange={v=>setO("unitBasis",v)} placeholder="หน่วยที่ยืนยันและแหล่งอ้างอิง"/>}
 <Select label="Offer currency" value={offer.currency} onChange={v=>setO("currency",v)} options={["THB","USD","EUR"]}/><Select label="Offer unit" value={offer.unit} onChange={v=>setO("unit",v)} options={BID_UNITS.map(unit=>[unit,unit==="MD"?"MD · Man-day":unit==="MH"?"MH · Man-hour":unit])}/><Field label="Quoted unit cost" type="number" min="0" step="any" value={offer.unitCost} onChange={v=>setO("unitCost",v)} required={!offer.id}/></div>
 <details>
  <summary>TAG รายการเสนอราคา / Volume I</summary>
  <div className="p55-bid-fields">{VENDOR_OFFER_TAG_FIELDS_0550.map(([field,label])=><Field key={field} label={label} value={offerTagText[field]||''} onChange={value=>setOfferTagText(current=>({...current,[field]:value}))} placeholder={field==='mr'?'คั่นแต่ละอ้างอิงด้วยช่องว่าง | ช่องว่าง':'คั่นแต่ละ TAG ด้วย |'}/>)}</div>
  <fieldset><legend>หมวดใน Volume I · เลือกได้หลายหมวด</legend>
   <div className="p55-review-toolbar">{VENDOR_VOLUME_TAGS_0550.map(tag=><label key={tag}><input type="checkbox" checked={authoredSections.includes(tag)} onChange={event=>changeSection(tag,event.target.checked)}/> 11.{tag}</label>)}</div>
  </fieldset>
  <small>หมวดที่ใช้แสดง {offerSourceSections0550(offer).map(tag=>'11.'+tag).join(' · ')||'OPEN'} · 11.M และ 11.P อ่านจาก Working และ Schedule allocation</small>
 </details>
 <Save busy={busy}>บันทึกใบเสนอราคา / TAG</Save></form>
 <p>แก้เรตใน Offer เดิมจะคำนวณแถว Working ที่อ้างอิง Offer นั้นใหม่ หากเป็นใบเสนอราคาคนละฉบับให้สร้าง Offer ใหม่เพื่อเก็บฉบับเก่า</p>
 <details className="p55-panel" onToggle={e=>{if(e.currentTarget.open)setAlieOpened(true);}}>
  <summary>ALIE R2 · Atomic Lines Intake</summary>
  {alieOpened&&<AlieIntake onNavigate={onNavigate}/>}
 </details>
 <VendorOfferGroups0550 data={data} model={model} reviewDate={reviewDate} navigationTarget={navigationTarget} onNavigate={onNavigate} onEdit={o=>{setOffer({...o});setOfferTagText(Object.fromEntries(VENDOR_OFFER_TAG_FIELDS_0550.map(([field])=>[field,(o.bidTags?.[field]||[]).join(' | ')])));document.querySelector('[aria-label="Product / role / service"]')?.scrollIntoView({block:"center"});}}/>
 </Module>
 <Module id="bid.vendor.controlled-sources" title="แหล่ง Vendor เดิมของ 0550 — ใช้อ้างอิงก่อนเลือกเรต" open={false}>
 <MgwQuoteSummary/>
 {COMMERCIAL_SOURCES.map(s=><div key={s.id}><strong>{s.vendor} · {s.offerNo}</strong><p>{s.controlState}</p><p>Source ID: {s.id} · Currency: {s.currency}</p><p>ตรวจฉบับ/ขอบเขต/validity ก่อนลงทะเบียน Offer สำหรับข้อเสนอรอบนี้</p></div>)}
 </Module></div>;
}
