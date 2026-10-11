import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import React,{useState} from "react";
import { WORKING_BOM_BY_LOCATION_0553 as model } from "./data/workingBomByLocation";
import { MR0001_WORKING_PRICED_BOM as bom } from "./data/mr0001WorkingPricedBom";

// One operational BOM surface. All Source/Engineering/Vendor links derive from existing registries.
export function SimpleBom0553({focusedLocation=null}){
 const [manualSite,setManualSite]=useState("ALL");
 const [focusSeen,setFocusSeen]=useState(null);
 const site=focusedLocation&&focusedLocation!==focusSeen?focusedLocation:manualSite;
 const changeSite=value=>{setManualSite(value);setFocusSeen(focusedLocation);};
 const [vendor,setVendor]=useState("ALL");
 const [system,setSystem]=useState("MR-0001");
 const [expanded,setExpanded]=useState({});
 const [allSitesExpanded,setAllSitesExpanded]=useState(false);
 const siteExpanded=siteId=>expanded["site:"+siteId]??allSitesExpanded;
 const expandAll=()=>{setAllSitesExpanded(true);setExpanded({});};
 const collapseAll=()=>{setAllSitesExpanded(false);setExpanded({});};
 const groups=model.locations.filter(g=>site==="ALL"||g.site===site).map(g=>({
  ...g,items:g.items.filter(i=>vendor==="ALL"||
   i.pricedVendor===vendor||i.vendorCandidates.some(v=>v.vendor===vendor))
 }));
 const visible=groups.flatMap(g=>g.items);
 const priced=visible.filter(x=>Number.isFinite(x.indicativePackageCostTHB));
 const provisionalSubtotalTHB=priced.reduce((sum,x)=>sum+x.indicativePackageCostTHB,0);
 const open=k=>setExpanded(old=>({...old,[k]:k.startsWith("site:")?!(old[k]??allSitesExpanded):!old[k]}));
 const money=(v,currency)=>Number.isFinite(v)?currency+" "+v.toLocaleString("en-US",{maximumFractionDigits:2}):"—";
 return <section className="p55-panel">
  <div className="p55-eyebrow">ENGINEERING WORKING PREVIEW <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom"/></div>
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
   <label>Location <select value={site} onChange={e=>changeSite(e.target.value)}><option value="ALL">All locations</option>{model.locations.map(x=><option key={x.site} value={x.site}>{x.site}</option>)}</select></label>
   <label>Vendor / Company <select value={vendor} onChange={e=>setVendor(e.target.value)}><option value="ALL">All vendors</option>{model.vendors.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
  </div>
  {system!=="MR-0001"?<p className="p55-note">ระบบ {system} ยังไม่มี Item-Level BOM ที่เชื่อม MTO/Engineering/Vendor ครบใน Controlled Repository: ไม่แสดงจำนวนหรือราคาจำลอง โปรดตรวจ Scope ใน 4 MR Systems ก่อน</p>:<>
  <div className="p55-source-facts">
   <div><span>Locations with source data</span><strong>{groups.filter(g=>g.items.length).length}</strong></div>
   <div><span>Visible MTO item tags</span><strong>{visible.length}</strong></div>
   <div><span>Source items with Cisco scenario only</span><strong>{priced.length} / {visible.length}</strong></div>
   <div><span>{site==="ALL"?"All locations":"Location "+site} — priced Cisco items ONLY (THB), not location total</span><strong>{money(provisionalSubtotalTHB,"THB")}</strong></div>
  </div>
  <div className="p55-filterbar" style={{display:"flex",gap:8,margin:"12px 0"}}><button type="button" className="p553-detail-button" onClick={expandAll}>＋ Expand all</button><button type="button" className="p553-detail-button" onClick={collapseAll}>− Collapse all</button><span className="p55-note">เริ่มต้นแสดงภาพรวมทุกแท่น คลิก + เพื่อดู MTO, Calculation, Vendor และ Cost</span></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget" style={{width:"100%",borderCollapse:"collapse"}}>
  <thead><tr><th>+/−</th><th>Location / ประเภทแท่น</th><th>Module ID</th><th>MTO items</th><th>Priced</th><th>RPT links</th><th>Antenna refs</th><th>Cisco subtotal (THB)</th><th>Total location</th></tr></thead><tbody>
  {groups.filter(g=>g.items.length).map(g=><React.Fragment key={g.site}>
   <tr><td><button type="button" className="p55-row-toggle" onClick={()=>open("site:"+g.site)} aria-expanded={siteExpanded(g.site)}>{siteExpanded(g.site)?"−":"+"}</button></td>
   <td><strong>{g.site}</strong><small>{g.siteClass?.type||"UNCLASSIFIED"} · {g.siteClass?.thai||"ตรวจสอบ"}</small></td>
   <td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+g.site.toLowerCase()}/></td>
   <td className="is-number">{g.items.length}</td><td className="is-number">{g.items.filter(x=>Number.isFinite(x.indicativePackageCostTHB)).length}</td>
   <td className="is-number">{g.rfDemand?.linkEndpointDemand??"—"}</td><td className="is-number">{g.rfDemand?.antennaReferenceDemand??"—"}</td>
   <td className="is-number">{g.items.some(x=>Number.isFinite(x.indicativePackageCostTHB))?money(g.items.reduce((n,x)=>n+(Number.isFinite(x.indicativePackageCostTHB)?x.indicativePackageCostTHB:0),0),"THB"):"NO CISCO PRICED ITEM"}</td><td>NOT ESTABLISHED</td></tr>
   {siteExpanded(g.site)&&<tr><td colSpan={9}><div className="p55-table-wrap"><p className="p55-note"><strong>Site Scope:</strong> {g.siteClass?.note} · Equipment ownership: NEW / REUSE / BY OTHERS ต้องตรวจ BLD/MR ทีละรายการ ไม่สรุปจากประเภทแท่น</p>
    <table className="p55-table p55-table--compact"><thead><tr><th>Link / First Principles</th><th>FSPL</th><th>Gt + Gr</th><th>Ideal RSL offset</th><th>STD / BOM</th></tr></thead>
     <tbody>{g.rfProof.map(p=><tr key={p.id}><td>{p.from} → {p.to}</td><td>{p.fsplDb.toFixed(2)} dB</td><td>{p.gainSumDbi.toFixed(2)} dBi</td><td>{p.idealRslOffsetDb.toFixed(2)} dB<small>Rx = Tx + offset − losses</small></td><td>HOLD · CAL/OEM proof required{p.change&&<small>4ft candidate: {p.change.gainChangeDb.toFixed(2)} dB vs Next G baseline</small>}</td></tr>)}</tbody>
    </table>
    <table className="p55-table p55-table--compact p55-table--budget">
    <thead><tr><th>+</th><th>MTO Item / Equipment / Copy ID</th><th>MR/MTO Qty (input)</th><th>Vendor / SKU Candidate</th><th>Unit price / source currency</th><th>Extended cost</th><th>First Principles / Qty proof</th></tr></thead>
    <tbody>{g.items.map(x=><React.Fragment key={x.id}>
     <tr><td><button type="button" className="p55-row-toggle" onClick={()=>open("item:"+x.id)}>{expanded["item:"+x.id]?"−":"+"}</button></td>
      <td><strong>{x.sourceTag}</strong><small>{x.description}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+g.site.toLowerCase()+"."+String(x.sourceTag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+String(x.sourceRow)}/></td>
      <td>{x.sourceScopeQty??"REVIEW"} {x.sourceScopeUnit||""}<small>{x.sourceState}</small><small>Engineering SKU Qty: {x.engineeringRequiredSkuQty??"NOT DERIVED"}</small></td>
      <td>{x.pricedVendor||"Candidate / selection OPEN"}<small>{x.vendorCandidates.length?x.vendorCandidates.length+" vendor offer candidates":"Unmapped to priced supplier line"}</small></td>
      <td>{x.pricedVendor?money(bom.cisco.unitPackageQuotedSumTHB,"THB"):"See available source prices (+)"}</td>
      <td>{Number.isFinite(x.indicativePackageCostTHB)?money(x.indicativePackageCostTHB,"THB"):"UNPRICED — NOT ZERO"}</td>
      <td>{x.workingPriceStatus}<small>{x.costStatus}</small><small>Accepted unit cost: {Number.isFinite(x.acceptedPrice)?money(x.acceptedPrice,"THB"):"NOT VERIFIED"}</small></td>
     </tr>
     {expanded["item:"+x.id]&&<tr><td colSpan={7}>
      <div className="p55-panel" style={{marginBottom:10}}>
       <strong>Item-level First Principles → Engineering Constraints → Parametric Cost</strong>
       <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+g.site.toLowerCase()+"."+String(x.sourceTag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+String(x.sourceRow)+".derivation"}/>
       <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
        <thead><tr><th>Stage</th><th>Evidence / calculation</th><th>Result</th></tr></thead><tbody>
        <tr><td>01 Source</td><td>MTO Rev04 · source row {x.sourceRow} · {x.sourceTag}</td><td>{x.sourceScopeQty??"UNRESOLVED"} {x.sourceScopeUnit||""} (scope quantity only)</td></tr>
        <tr><td>02 First Principles</td><td>Site {g.site}; requirement object {x.bomType}; source demand is not physical SKU quantity</td><td>{x.engineeringRequiredSkuQty==null?"SKU quantity requires configuration, interface and location take-off":x.engineeringRequiredSkuQty}</td></tr>
        <tr><td>03 Constraints / CAL-RPT</td><td>{g.rfProof.length?g.rfProof.map(r=>r.id).join(", "):"No linked RF calculation for this item"} · verify capacity, power, Ex rating, licences and interfaces as applicable</td><td>ENGINEERING REVIEW REQUIRED</td></tr>
        <tr><td>04 Vendor fit</td><td>{x.vendorCandidates.length} matched offer candidates; {x.configuration.length} bundled offer lines</td><td>{x.pricedVendor?"WORKING BUNDLE — OEM NOT APPROVED":"NOT SELECTED"}</td></tr>
        <tr><td>05 Cost formula</td><td>Physical Qty × Accepted Unit Rate + attributable bulk / work / risk</td><td>{Number.isFinite(x.acceptedPrice)&&Number.isFinite(x.engineeringRequiredSkuQty)?money(x.acceptedPrice*x.engineeringRequiredSkuQty,"THB"):"Verified extended cost NOT ESTABLISHED"}</td></tr>
        <tr><td>06 Budgetary evidence</td><td>Source scenario shown separately; pricing requires quantity driver, currency/FX, validity and risk basis</td><td>{Number.isFinite(x.indicativePackageCostTHB)?money(x.indicativePackageCostTHB,"THB")+" — SCENARIO ONLY":"SOURCE PRICE NOT ALLOCATED"}</td></tr>
        </tbody></table></div>
       <p className="p55-note">Budgetary assumption may be used only when explicitly recorded and traceable; missing physical quantities or accepted rates never become zero. Source MTO Set/Lot is not SKU count.</p>
      </div>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Vendor</th><th>SKU / Offer line</th><th>Quoted qty (whole offer)</th><th>Quoted unit price</th><th>Use decision</th></tr></thead><tbody>
      {x.configuration.concat(x.vendorCandidates).map((v,i)=><tr key={i}>
       <td>{v.vendor||"VST ECS / Cisco"}</td><td>{v.sku}<small>{v.quoteId} · {v.quoteLine}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+g.site.toLowerCase()+"."+String(x.sourceTag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+String(x.sourceRow)+".quote."+String(v.quoteId||"candidate").toLowerCase()+"."+String(v.quoteLine||i).toLowerCase().replace(/[^a-z0-9-]/g,"-")}/></td>
       <td>{v.offeredQuoteQty??v.quoteQty??"—"}</td>
       <td>{money(v.originalUnitPrice??v.unitPrice,v.originalCurrency||v.currency)}</td>
       <td>{x.pricedVendor?"Cisco working bundle / OEM review":"SOURCE QUOTE ONLY — ALLOCATION OPEN"}</td>
      </tr>)}
      {!x.configuration.length&&!x.vendorCandidates.length&&<tr><td colSpan={5}>No priced source mapped to this physical object yet; do not assume zero cost</td></tr>}
      </tbody></table></div>
     </td></tr>}
    </React.Fragment>)}</tbody></table></div></td></tr>}
  </React.Fragment>)}
  </tbody></table></div>
  <p className="p55-note">ZWP20 GREENFIELD total across all equipment, vendor packages and bulk is NOT ESTABLISHED; Cisco-only priced subtotal must never be labelled total location cost. Subtotal is for priced working items only. It excludes non-priced MR0001 equipment, bulk, spares and services. Customer A+B+C total and selling price remain separate; 4-Scope of Supply.xlsx is the controlled output template.</p>
  </>}
 </section>;
}
