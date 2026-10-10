import React,{useState} from "react";
import { WORKING_BOM_BY_LOCATION_0553 as model } from "./data/workingBomByLocation";
import { MR0001_WORKING_PRICED_BOM as bom } from "./data/mr0001WorkingPricedBom";

// One operational BOM surface. All Source/Engineering/Vendor links derive from existing registries.
export function SimpleBom0553(){
 const [site,setSite]=useState("ALL");
 const [vendor,setVendor]=useState("ALL");
 const [system,setSystem]=useState("MR-0001");
 const [expanded,setExpanded]=useState({});
 const groups=model.locations.filter(g=>site==="ALL"||g.site===site).map(g=>({
  ...g,items:g.items.filter(i=>vendor==="ALL"||
   i.pricedVendor===vendor||i.vendorCandidates.some(v=>v.vendor===vendor))
 }));
 const visible=groups.flatMap(g=>g.items);
 const priced=visible.filter(x=>Number.isFinite(x.indicativePackageCostTHB));
 const provisionalSubtotalTHB=priced.reduce((sum,x)=>sum+x.indicativePackageCostTHB,0);
 const open=k=>setExpanded(old=>({...old,[k]:!old[k]}));
 const money=(v,currency)=>Number.isFinite(v)?currency+" "+v.toLocaleString("en-US",{maximumFractionDigits:2}):"—";
 return <section className="p55-panel">
  <div className="p55-eyebrow">BUDGET → WORKING PREVIEW → ENGINEERING BOM</div>
  <h3>Engineering Working Preview — Requirement → Calculation → BOM → Cost</h3>
  <p className="p55-note"><strong>ENGINEERING DERIVATION INCOMPLETE:</strong> This is the MTO source and vendor quote comparison, NOT an accepted First-Principles-derived equipment BOM. Physical SKU quantities, OEM RF proof and scope allocation must be solved here before a budgetary snapshot can be created.</p>
  <p className="p55-note">ข้อมูลที่แสดงมาจาก MTO → Required Engineering Objects → Vendor Source Registry โดยตรง ไม่กรอกซ้ำในหน้า Budget. จำนวน Set/Lot เป็น Requirement Scope; Vendor SKU Candidates ยังไม่ใช่ Selected/Approved BOM.</p>
  <div className="p55-filterbar p55-filterbar--simple">
   <label>System <select value={system} onChange={e=>setSystem(e.target.value)}>
    <option value="MR-0001">MR0001 · SCADA Radio</option>
    <option value="MR-0002">MR0002 · DMR (full BOM pending)</option>
    <option value="MR-0003">MR0003 · Ex Telephone (full BOM pending)</option>
    <option value="MR-0004">MR0004 · RACON (full BOM pending)</option>
   </select></label>
   <label>Location <select value={site} onChange={e=>setSite(e.target.value)}><option value="ALL">All locations</option>{model.locations.map(x=><option key={x.site} value={x.site}>{x.site}</option>)}</select></label>
   <label>Vendor / Company <select value={vendor} onChange={e=>setVendor(e.target.value)}><option value="ALL">All vendors</option>{model.vendors.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
  </div>
  {system!=="MR-0001"?<p className="p55-note">ระบบ {system} ยังไม่มี Item-Level BOM ที่เชื่อม MTO/Engineering/Vendor ครบใน Controlled Repository: ไม่แสดงจำนวนหรือราคาจำลอง โปรดตรวจ Scope ใน 4 MR Systems ก่อน</p>:<>
  <div className="p55-source-facts">
   <div><span>Locations with source data</span><strong>{groups.filter(g=>g.items.length).length}</strong></div>
   <div><span>Visible MTO item tags</span><strong>{visible.length}</strong></div>
   <div><span>Provisional priced items</span><strong>{priced.length} / {visible.length}</strong></div>
   <div><span>Source-priced scenario subtotal (THB)</span><strong>{money(provisionalSubtotalTHB,"THB")}</strong></div>
  </div>
  {groups.filter(g=>g.items.length).map(g=><section key={g.site} className="p55-panel">
   <button type="button" className="p55-row-toggle" onClick={()=>open("site:"+g.site)} aria-expanded={expanded["site:"+g.site]!==false}>{expanded["site:"+g.site]===false?"+":"−"}</button>
   <strong> {g.site} </strong><span> · {g.items.length} MTO items · {g.items.filter(x=>Number.isFinite(x.indicativePackageCostTHB)).length} source-priced scenarios</span><small> · RPT functional link endpoints: {g.rfDemand?.linkEndpointDemand??"NO RPT LINK"} · Antenna references: {g.rfDemand?.antennaReferenceDemand??"NO RPT LINK"} (NOT purchase qty)</small>
   {expanded["site:"+g.site]!==false&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget">
    <thead><tr><th>+</th><th>MTO Item / Equipment</th><th>MR/MTO Qty (input)</th><th>Vendor / SKU Candidate</th><th>Unit price / source currency</th><th>Extended cost</th><th>First Principles / Qty proof</th></tr></thead>
    <tbody>{g.items.map(x=><React.Fragment key={x.id}>
     <tr><td><button type="button" className="p55-row-toggle" onClick={()=>open("item:"+x.id)}>{expanded["item:"+x.id]?"−":"+"}</button></td>
      <td><strong>{x.sourceTag}</strong><small>{x.description}</small></td>
      <td>{x.sourceScopeQty??"REVIEW"} {x.sourceScopeUnit||""}<small>{x.sourceState}</small></td>
      <td>{x.pricedVendor||"Candidate / selection OPEN"}<small>{x.vendorCandidates.length?x.vendorCandidates.length+" vendor offer candidates":"Unmapped to priced supplier line"}</small></td>
      <td>{x.pricedVendor?money(bom.cisco.unitPackageQuotedSumTHB,"THB"):"See available source prices (+)"}</td>
      <td>{Number.isFinite(x.indicativePackageCostTHB)?money(x.indicativePackageCostTHB,"THB"):"UNPRICED — NOT ZERO"}</td>
      <td>{x.workingPriceStatus}<small>{x.costStatus}</small></td>
     </tr>
     {expanded["item:"+x.id]&&<tr><td colSpan={7}>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Vendor</th><th>SKU / Offer line</th><th>Quoted qty (whole offer)</th><th>Quoted unit price</th><th>Use decision</th></tr></thead><tbody>
      {x.configuration.concat(x.vendorCandidates).map((v,i)=><tr key={i}>
       <td>{v.vendor||"VST ECS / Cisco"}</td><td>{v.sku}<small>{v.quoteId} · {v.quoteLine}</small></td>
       <td>{v.offeredQuoteQty??v.quoteQty??"—"}</td>
       <td>{money(v.originalUnitPrice??v.unitPrice,v.originalCurrency||v.currency)}</td>
       <td>{x.pricedVendor?"Cisco working bundle / OEM review":"SOURCE QUOTE ONLY — ALLOCATION OPEN"}</td>
      </tr>)}
      {!x.configuration.length&&!x.vendorCandidates.length&&<tr><td colSpan={5}>No priced source mapped to this physical object yet; do not assume zero cost</td></tr>}
      </tbody></table></div>
     </td></tr>}
    </React.Fragment>)}</tbody></table></div>}
  </section>)}
  <p className="p55-note">Subtotal is for priced working items only. It excludes non-priced MR0001 equipment, bulk, spares and services. Customer A+B+C total and selling price remain separate; 4-Scope of Supply.xlsx is the controlled output template.</p>
  </>}
 </section>;
}
