import {mgwQuoteItem0550} from "./data/mgwVendorBasis0550";
import {MgwQuoteSummary} from "./MgwQuoteViews";
import {VendorOfferGroups0550} from "./VendorOfferGroups0550";
import React,{useState} from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {BID_UNITS,newId} from "./data/bidWorkspaceModel";
import {COMMERCIAL_SOURCES} from "./data";
import {Module,Field,Select,Save,amount} from "./BidControls";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
export function VendorWorkspace(){
 const {data,put,busy}=useBidWorkspace();
 const [vendor,setVendor]=useState({id:"",name:"",kind:"SUPPLIER",reference:""});
 const blankOffer={id:"",vendorId:"",description:"",brand:"",quoteRef:"",sourceRef:"",date:"",validUntil:"",currency:"THB",unit:"MD",unitCost:null};
 const [offer,setOffer]=useState(blankOffer);
 if(!data)return <p>กำลังเปิดฐานข้อมูล Bidding…</p>;
 const setV=(k,v)=>setVendor(x=>({...x,[k]:v})),setO=(k,v)=>setOffer(x=>({...x,[k]:v}));
 return <div className="p55-stack p55-vendor-workspace">
 <Module id="bid.vendor.master" title="07.1 Vendor / Service Provider">
 <p>ราคาเดิมที่นำเข้า: {data.vendorBasisImport?.importedLineIds.length||0} รายการ · รอปรับปรุงราคาใหม่ · วันที่/Validity ที่ไม่ทราบคงว่างตามหลักฐาน</p>
 <p>MGW Q26-063: {data.offers.filter(mgwQuoteItem0550).length} รายการ · {data.mgwQuoteImport?.conflicts.join(" · ")||"นำเข้าเพื่อเลือกตรวจราคา — ไม่แทนผู้ขายเดิมอัตโนมัติ"}</p>
 <p>ผู้ขายหนึ่งรายมีหลายใบเสนอราคา/เรตได้ แยกต้นทุนจากราคาขาย และเลือกเรตไปใช้ใน Working โดยอ้างอิง Offer ID</p>
 <form onSubmit={async e=>{e.preventDefault();if(await put("vendors",{...vendor,id:vendor.id||newId("VEN")}))setVendor({id:"",name:"",kind:"SUPPLIER",reference:""});}}>
 <div className="p55-bid-fields"><Field label="Vendor name" value={vendor.name} onChange={v=>setV("name",v)} required/><Select label="Vendor type" value={vendor.kind} onChange={v=>setV("kind",v)} options={["SUPPLIER","OEM","SERVICE_PROVIDER","INTERNAL_TEAM"]}/><Field label="Vendor reference" value={vendor.reference} onChange={v=>setV("reference",v)}/></div><Save busy={busy}>บันทึก Vendor</Save></form>
 <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Vendor</th><th>Type / source</th><th>ID / action</th></tr></thead><tbody>{data.vendors.map(v=><tr key={v.id} data-component-key={"bid.vendor."+v.id}><td>{v.name}</td><td>{v.kind}<small>{v.reference}</small></td><td><ComponentCopyId projectId="PJ2608-0550" componentKey={"bid.vendor."+v.id}/><button type="button" onClick={()=>setVendor({...v})}>แก้ไข Vendor</button></td></tr>)}</tbody></table></div>
 </Module>
 <Module id="bid.vendor.offers" title="07.2 ใบเสนอราคา / ต้นทุนสินค้า / เรตบุคลากร">
 {data.offers.filter(o=>o.supplierQuoteRow?.classification==="NET_PACKAGE").map(o=><p key={o.id}>{o.quoteRef} · ราคาฐานสุทธิ {amount(o.unitCost,o.currency)} · {data.lines.some(l=>l.offerId===o.id&&l.selected)?"เลือกใน Working แล้ว — ตรวจ scope/ราคาและ Release gates ต่อ":"บันทึกเป็นฉบับใหม่แล้ว / ยังไม่เลือกแทนราคาที่ใช้อยู่"} · รายการย่อยและ Option ไม่บวกในราคาฐานซ้ำ</p>)}
 <form onSubmit={async e=>{e.preventDefault();if(await put("offers",{...offer,id:offer.id||newId("OFFER")}))setOffer(blankOffer);}}>
 <div className="p55-bid-fields"><Select label="Offer vendor" value={offer.vendorId} onChange={v=>setO("vendorId",v)} options={[["","เลือก Vendor"],...data.vendors.map(v=>[v.id,v.name])]}/>
 {[['description','Product / role / service'],['brand','Brand / model'],['quoteRef','Quotation reference'],['sourceRef','Offer source / file / page']].map(([k,l])=><Field key={k} label={l} value={offer[k]} onChange={v=>setO(k,v)} required={k!=="brand"}/>)}
 <Field label="Quote date" type="date" value={offer.date} onChange={v=>setO("date",v)} required/><Field label="Valid until" type="date" value={offer.validUntil} onChange={v=>setO("validUntil",v)} required={!offer.quoteEvidence}/>
 {mgwQuoteItem0550(offer)?.unit===null&&<Field label="Offer unit confirmation / source" value={offer.unitBasis||""} onChange={v=>setO("unitBasis",v)} placeholder="หน่วยที่ยืนยันและแหล่งอ้างอิง"/>}
 <Select label="Offer currency" value={offer.currency} onChange={v=>setO("currency",v)} options={["THB","USD","EUR"]}/><Select label="Offer unit" value={offer.unit} onChange={v=>setO("unit",v)} options={BID_UNITS.map(unit=>[unit,unit==="MD"?"MD · Man-day":unit==="MH"?"MH · Man-hour":unit])}/><Field label="Quoted unit cost" type="number" min="0" step="any" value={offer.unitCost} onChange={v=>setO("unitCost",v)} required/></div><Save busy={busy}>บันทึกใบเสนอราคา / เรตต้นทุน</Save></form>
 <p>แก้เรตใน Offer เดิมจะคำนวณแถว Working ที่อ้างอิง Offer นั้นใหม่ หากเป็นใบเสนอราคาคนละฉบับให้สร้าง Offer ใหม่เพื่อเก็บฉบับเก่า</p>
 <VendorOfferGroups0550 data={data} onEdit={o=>{setOffer({...o});document.querySelector('[aria-label="Product / role / service"]')?.scrollIntoView({block:"center"});}}/>
 </Module>
 <Module id="bid.vendor.controlled-sources" title="แหล่ง Vendor เดิมของ 0550 — ใช้อ้างอิงก่อนเลือกเรต" open={false}>
 <MgwQuoteSummary/>
 {COMMERCIAL_SOURCES.map(s=><div key={s.id}><strong>{s.vendor} · {s.offerNo}</strong><p>{s.controlState}</p><p>Source ID: {s.id} · Currency: {s.currency}</p><p>ตรวจฉบับ/ขอบเขต/validity ก่อนลงทะเบียน Offer สำหรับข้อเสนอรอบนี้</p></div>)}
 </Module></div>;
}
