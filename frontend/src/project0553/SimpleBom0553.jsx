import {deriveZWP20SiteCost0553} from "./data/zwp20SiteCost0553";
import { deriveEngineeringOwnedCost0553 } from "./data/engineeringOwnedCost0553";
import { deriveZWP20VendorFunctionCosts, getZWP20RemoteBudgetChoice, getMR502BudgetaryScenarios } from "./data/mr502BudgetaryScenarios";
import {ZWP8_ROW43_COST_TRACE} from "./data/zwp8Row43CostTrace";
import {SourceCoverage0553} from "./SourceCoverage0553";
import {SiteSystemCostReconciliation0553} from "./SiteSystemCostReconciliation0553";
import { NEXTG_CANDIDATE_ESTIMATE_0553 } from "./data/nextgCandidateEstimate0553";
import { ITEM_DECISION_PIPELINE_0553 } from "./data/itemDecisionPipeline0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import React,{useState} from "react";
import { WORKING_BOM_BY_LOCATION_0553 as model } from "./data/workingBomByLocation";
import { MR0001_WORKING_PRICED_BOM as bom } from "./data/mr0001WorkingPricedBom";

// One operational BOM surface. All Source/Engineering/Vendor links derive from existing registries.
export function SimpleBom0553({focusedLocation=null,fx=null,displayCurrency="THB"}){
 const zwp20Cost=deriveZWP20SiteCost0553();
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
 const missingSourceRows=model.locations.filter(g=>site==="ALL"||g.site===site).flatMap(g=>g.items).filter(x=>!Number.isFinite(x.indicativePackageCostTHB));
 const sourceCount=model.locations.filter(g=>site==="ALL"||g.site===site).reduce((n,g)=>n+g.items.length,0);
 const displayedCount=groups.reduce((n,g)=>n+g.items.length,0);
 const priced=visible.filter(x=>Number.isFinite(x.indicativePackageCostTHB));
 const getVendorLines=x=>[...new Map(NEXTG_CANDIDATE_ESTIMATE_0553.estimateFor(x).functions.flatMap(fn=>fn.candidates).map(q=>[q.quoteLine,q])).values()];
 const vendorCovered=x=>getVendorLines(x).some(q=>Number.isFinite(q.unitPrice))||x.vendorCandidates.some(v=>Number.isFinite(v.originalUnitPrice))||Number.isFinite(x.indicativePackageCostTHB);
 const coverageCount=visible.filter(vendorCovered).length;
 const provisionalSubtotalTHB=priced.reduce((sum,x)=>sum+x.indicativePackageCostTHB,0);
 const open=k=>setExpanded(old=>({...old,[k]:k.startsWith("site:")?!(old[k]??allSitesExpanded):!old[k]}));
 const money=(v,currency)=>Number.isFinite(v)?currency+" "+v.toLocaleString("en-US",{maximumFractionDigits:2}):"—";
 const wpSummary=siteName=>{
  if(siteName==="ZWP20")return {usd:zwp20Cost.subtotals.USD,thb:zwp20Cost.subtotals.THB,costed:zwp20Cost.pricedRows,total:zwp20Cost.totalRows,gaps:zwp20Cost.gaps.length};
  const source=model.locations.find(v=>v.site===siteName)?.items||[];
  const costed=source.filter(v=>Number.isFinite(v.indicativePackageCostTHB));
  return {usd:0,thb:costed.reduce((n,v)=>n+v.indicativePackageCostTHB,0),costed:costed.length,total:source.length,gaps:source.length-costed.length};
 };
 const thbEquivalent=sum=>fx?.thbPerUsd>0?Math.round((sum.thb+sum.usd*fx.thbPerUsd)*100)/100:null;
 const displaySiteTotal=siteName=>{const sum=wpSummary(siteName),total=thbEquivalent(sum);return total===null?"FX REQUIRED · "+money(sum.usd,"USD")+" + "+money(sum.thb,"THB"):money(total,"THB");};

 return <section className="p55-panel">
  <div className="p55-eyebrow">ENGINEERING WORKING PREVIEW <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom"/></div>
  <h3>Engineering Working Preview — Requirement → Calculation → BOM → Cost</h3>
  <SourceCoverage0553/>
  <SiteSystemCostReconciliation0553/>
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
  <p className="p55-note"><strong>Source row completeness:</strong> {displayedCount} displayed / {sourceCount} registered MTO item tags. {vendor!=="ALL"?"Vendor filter hides some source rows; select All vendors for the full BOM.":"All source rows remain visible, including items lacking price."} Source item coverage does not mean a complete physical SKU take-off.</p>
  <div className="p55-source-facts">
   <div><span>Locations with source data</span><strong>{groups.filter(g=>g.items.length).length}</strong></div>
   <div><span>Visible MTO item tags</span><strong>{visible.length}</strong></div>
   <div><span>Items with mapped vendor rate evidence (not approved)</span><strong>{coverageCount} / {visible.length}</strong></div>
   <div><span>{site==="ALL"?"All locations":"Location "+site} — allocated total equipment / A+B+C</span><strong>{site==="ALL"?"Select WP to see total":displaySiteTotal(site)}</strong><small>{site==="ALL"?"Per-WP budgetary priced totals below; missing rows never valued zero":wpSummary(site).costed+"/"+wpSummary(site).total+" costed; "+wpSummary(site).gaps+" unresolved; "+(fx?.source||"FX unavailable")}</small></div>
  </div>
  <div className="p55-filterbar" style={{display:"flex",gap:8,margin:"12px 0"}}><button type="button" className="p553-detail-button" onClick={expandAll}>＋ Expand all</button><button type="button" className="p553-detail-button" onClick={collapseAll}>− Collapse all</button><span className="p55-note">เริ่มต้นแสดงภาพรวมทุกแท่น คลิก + เพื่อดู MTO, Calculation, Vendor และ Cost</span></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget" style={{width:"100%",borderCollapse:"collapse"}}>
  <thead><tr><th>+/−</th><th>Location / ประเภทแท่น</th><th>Module ID</th><th>MTO items</th><th>Vendor-rate coverage</th><th>RPT links</th><th>Antenna refs</th><th>Vendor evidence / currency</th><th>Allocated location cost</th></tr></thead><tbody>
  {groups.filter(g=>g.items.length).map(g=><React.Fragment key={g.site}>
   <tr><td><button type="button" className="p55-row-toggle" onClick={()=>open("site:"+g.site)} aria-expanded={siteExpanded(g.site)}>{siteExpanded(g.site)?"−":"+"}</button></td>
   <td><strong>{g.site}</strong><small>{g.siteClass?.type||"UNCLASSIFIED"} · {g.siteClass?.thai||"ตรวจสอบ"}</small></td>
   <td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+g.site.toLowerCase()}/></td>
   <td className="is-number">{g.items.length}</td><td className="is-number">{g.items.filter(vendorCovered).length} / {g.items.length}</td>
   <td className="is-number">{g.rfDemand?.linkEndpointDemand??"—"}</td><td className="is-number">{g.rfDemand?.antennaReferenceDemand??"—"}</td>
   <td>{g.items.some(x=>Number.isFinite(x.indicativePackageCostTHB))&&<small>Cisco scenario THB {g.items.reduce((n,x)=>n+(Number.isFinite(x.indicativePackageCostTHB)?x.indicativePackageCostTHB:0),0).toLocaleString("en-US")}</small>}{g.items.some(x=>getVendorLines(x).some(q=>Number.isFinite(q.unitPrice)))&&<small>Next G USD source rates mapped</small>}{g.items.some(x=>x.vendorCandidates.some(v=>Number.isFinite(v.originalUnitPrice)))&&<small>Other vendor source rates mapped</small>}</td><td><strong>{displaySiteTotal(g.site)}</strong><small>{wpSummary(g.site).costed}/{wpSummary(g.site).total} MTO priced · {wpSummary(g.site).gaps} unresolved</small><small>{g.site==="ZWP20"?"USD "+zwp20Cost.subtotals.USD.toFixed(2)+" + THB "+zwp20Cost.subtotals.THB.toFixed(2):"Cisco provisional source only · remaining scope not yet priced"}</small></td></tr>
   {siteExpanded(g.site)&&<tr><td colSpan={9}><div className="p55-table-wrap"><p className="p55-note"><strong>Site Scope:</strong> {g.siteClass?.note} · Equipment ownership: NEW / REUSE / BY OTHERS ต้องตรวจ BLD/MR ทีละรายการ ไม่สรุปจากประเภทแท่น</p>
    {g.site==="ZWP20"&&<div className="p55-panel"><div style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}><strong>ZWP20 · SCADA Engineering-Derived Site Cost Summary</strong><button type="button" className="p553-detail-button" onClick={()=>{const header=["Module ID","MTO Row","Item Tag","Source Qty","Engineering Quantity Basis","Vendor","SKU","Currency","Unit Cost","Extended Cost","State"];const rows=[header,...zwp20Cost.rows.map(v=>[zwp20Cost.moduleId+"."+String(v.tag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+v.row,v.row,v.tag,v.sourceQty+" "+(v.sourceUnit||""),v.quantityBasis,v.vendor||"",v.sku||"",v.currency||"",v.unitCost??"",v.extended??"",v.status]),["SITE TOTAL","","","","","","","USD","",zwp20Cost.subtotals.USD,zwp20Cost.status],["SITE TOTAL","","","","","","","THB","",zwp20Cost.subtotals.THB,zwp20Cost.status]];const tsv=rows.map(r=>r.map(v=>String(v??"").replaceAll(String.fromCharCode(9)," ").replaceAll(String.fromCharCode(10)," ")).join(String.fromCharCode(9))).join(String.fromCharCode(10));if(typeof navigator!=="undefined"&&navigator.clipboard?.writeText)navigator.clipboard.writeText(tsv).catch(()=>window.prompt("Copy site BOM",tsv));else window.prompt("Copy site BOM",tsv);}}>Copy ZWP20 BOM Table (Excel)</button></div>
      <p className="p55-note">Module ID: {zwp20Cost.moduleId} · Source: MTO Rev04, Engineering Topology/Derivation → Vendor selected rate; one row per MTO allocation. No USD/THB mixing without sourced FX.</p>
      <p><strong>ZWP20 Budgetary Priced Total: {displaySiteTotal("ZWP20")}</strong> <small>FX {fx?.thbPerUsd??"not set"} THB/USD · {fx?.date||"no date"} · {fx?.source||"no source"}</small><small>Source subtotals {money(zwp20Cost.subtotals.USD,"USD")} + {money(zwp20Cost.subtotals.THB,"THB")}; {zwp20Cost.pricedRows}/{zwp20Cost.totalRows} MTO rows priced. This is NOT the full WP budget until bulk/services are complete.</small></p>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>MTO / Module</th><th>Engineering Quantity / Basis</th><th>Budgetary Selected Product / Vendor</th><th>Unit Cost</th><th>Extended Cost</th><th>Assumptions / Status</th></tr></thead><tbody>{zwp20Cost.rows.map(v=><tr key={v.id}><td><strong>{v.tag||"BULK"}</strong><small>Row {v.row}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom.zwp20."+String(v.tag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+v.row}/></td><td>{v.sourceQty??"REVIEW"} {v.sourceUnit}<small>{v.quantityBasis}</small></td><td>{v.vendor||"Vendor selection / source rate needed"}<small>{v.sku||"Engineering take-off required"}</small></td><td>{money(v.unitCost,v.currency)}</td><td><strong>{money(v.extended,v.currency)}</strong></td><td>{v.status}{v.assumptions.map((a,i)=><small key={i}>{a}</small>)}</td></tr>)}</tbody></table></div>
      <div className="p55-table-wrap"><strong>Bulk Row 11 · Engineering Quantity × INNOVA Unit Rates</strong><p className="p55-note">Drawing-derived geometry · LAY-0001 C1 Sheet 4: ODU–Antenna plan proximity approximately 0.5–1.0 m; Mezzanine +21.100/+21.300 m to Lower Deck +18.300 m yields 2.8–3.0 m level difference. Neither is a verified cable route. E&I room internal panel position requires the referenced electrical layout. Source rate evidence shown below; Cable Extended Cost remains uncalculated until endpoints and routing are identified.</p>
      <p className="p55-note"><strong>Historical Z1D Wiring (22-Dec-2021, pages 3–5) → Z1F interface evidence:</strong> connectivity reference only, not Z1F procurement quantities.</p>
      <table className="p55-table p55-table--compact"><thead><tr><th>Function</th><th>From</th><th>To</th><th>Cable / Driver</th><th>Cost owner</th></tr></thead><tbody>
      {(zwp20Cost.rows.find(v=>v.row===11)?.historicalWiring?.functionTrace||[]).map(v=><tr key={v.id}><td>{v.id}</td><td>{v.from}</td><td>{v.to}</td><td>{v.medium}<small>{v.quantityDriver}</small></td><td>{v.costOwner}</td></tr>)}
      </tbody></table>
      <table className="p55-table p55-table--compact"><thead><tr><th>Function / SKU</th><th>Source</th><th>Unit</th><th>Rate THB</th><th>ZWP20 Derived Qty</th><th>Extended THB</th></tr></thead><tbody>
      {(zwp20Cost.rows.find(v=>v.row===11)?.quotedRateCandidates||[]).map((v,i)=><tr key={i}><td>{v.sku}</td><td>{v.source}</td><td>{v.unit}</td><td>{money(v.rateTHB,"THB")}</td><td>{Number.isFinite(v.quantity)?v.quantity+" "+v.unit:"ALTERNATIVE — EXCLUDED"}<small>{v.driver}</small></td><td>{money(v.extended,"THB")}</td></tr>)}
      </tbody></table><p className="p55-note">MTO 1 Lot ≠ one cable/gland. Cable quantity = physical routed segments + service loops + wastage; Gland quantity = applicable certified interfaces less fittings already included by BARTEC or radio kits. Historical Z1D wiring identifies functional cable paths; it does NOT establish Z1F physical lengths. Previous 20m cable and 1 gland scenario has been excluded from site totals. Unit rates remain visible pending Z1F routed lengths and certified entry counts.</p></div>
      <p className="p55-note"><strong>Unresolved / partial scope:</strong> {zwp20Cost.gaps.map(v=>(v.sourceTag||v.tag)+" (row "+v.row+")").join(", ")}. These must be derived/estimated before calling the result a complete ZWP20 cost. The radio, antenna, LAN and surge costs are budgetary, not final OEM approval.</p></div>}
    <table className="p55-table p55-table--compact"><thead><tr><th>Link / First Principles</th><th>FSPL</th><th>Gt + Gr</th><th>Ideal RSL offset</th><th>STD / BOM</th></tr></thead>
     <tbody>{g.rfProof.map(p=><tr key={p.id}><td>{p.from} → {p.to}</td><td>{p.fsplDb.toFixed(2)} dB</td><td>{p.gainSumDbi.toFixed(2)} dBi</td><td>{p.idealRslOffsetDb.toFixed(2)} dB<small>Rx = Tx + offset − losses</small></td><td>HOLD · CAL/OEM proof required{p.change&&<small>4ft candidate: {p.change.gainChangeDb.toFixed(2)} dB vs Next G baseline</small>}</td></tr>)}</tbody>
    </table>
    <table className="p55-table p55-table--compact p55-table--budget">
    <thead><tr><th>+</th><th>MTO Item / Equipment / Copy ID</th><th>MR/MTO Qty (input)</th><th>Vendor / SKU Candidate</th><th>Selected unit / package price (source currency)</th><th>Item extended cost (not sum of alternatives)</th><th>First Principles / Qty proof</th></tr></thead>
    <tbody>{g.items.map(x=><React.Fragment key={x.id}>
     <tr><td><button type="button" className="p55-row-toggle" onClick={()=>open("item:"+x.id)}>{expanded["item:"+x.id]?"−":"+"}</button></td>
      <td><strong>{x.sourceTag}</strong><small>{x.description}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+g.site.toLowerCase()+"."+String(x.sourceTag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+String(x.sourceRow)}/></td>
      <td>{x.sourceScopeQty??"REVIEW"} {x.sourceScopeUnit||""}<small>{x.sourceState}</small><small>Engineering SKU Qty: {x.engineeringRequiredSkuQty??"NOT DERIVED"}</small></td>
      {(()=>{const estimate=NEXTG_CANDIDATE_ESTIMATE_0553.estimateFor(x);
       const candidates=[...new Map(estimate.functions.flatMap(fn=>fn.candidates).map(q=>[q.quoteLine,q])).values()];
       const nextgPriced=candidates.filter(q=>Number.isFinite(q.unitPrice));
       const otherPriced=x.vendorCandidates.filter(v=>Number.isFinite(v.originalUnitPrice));
       const isCisco=Number.isFinite(x.indicativePackageCostTHB);
       const remoteBudget=getZWP20RemoteBudgetChoice(x);
       const engineeringCost=deriveEngineeringOwnedCost0553(x);
       const siteAllocation=g.site==="ZWP20"?zwp20Cost.rows.find(r=>r.row===x.sourceRow&&r.tag===x.sourceTag):null;
       return <>
       <td><strong>{siteAllocation?.vendor|| (isCisco?x.pricedVendor:remoteBudget?"Next G · budgetary radio":"NO SELECTED VENDOR")}</strong>
        <small>Next G: {nextgPriced.length} priced quote option(s)</small>
        <small>Others: {otherPriced.length} source rate(s)</small>
        <small>กด + ตรวจ Vendor / MCDA / Quantity</small></td>
       <td>{siteAllocation?.extended!==null&&siteAllocation?.extended!==undefined?<><strong>{siteAllocation.sku}</strong><small>{money(siteAllocation.unitCost,siteAllocation.currency)} · budgetary unit cost</small></>:isCisco?<><strong>{money(bom.cisco.unitPackageQuotedSumTHB,"THB")}</strong><small>Cisco package scenario per MTO Set — NOT accepted SKU rate</small></>:remoteBudget?<><strong>{engineeringCost.budgetaryCoverage?"Next G · Budgetary Selected":"BUDGETARY SELECTION INCOMPLETE"}</strong><small>7 engineering functions, selected individually from Next G · not a single physical SKU price</small></>:
        <><strong>NOT SELECTED</strong><small>{nextgPriced.length+otherPriced.length} unit-price evidence line(s) in expanded quote table</small><small>ไม่ใช่ผลรวมของราคา Vendor ทุกทางเลือก</small></>}</td>
       <td>{siteAllocation?.extended!==null&&siteAllocation?.extended!==undefined?<><strong>{money(siteAllocation.extended,siteAllocation.currency)}</strong><small>{siteAllocation.status} · allocated once at MTO row {x.sourceRow}</small></>:isCisco?<><strong>{money(x.indicativePackageCostTHB,"THB")}</strong><small>Provisional Cisco bundle only</small></>:remoteBudget?<><strong>{engineeringCost.budgetaryItemTotalUSD!==null?money(engineeringCost.budgetaryItemTotalUSD,"USD"):engineeringCost.budgetaryPartialUSD!==null?money(engineeringCost.budgetaryPartialUSD,"USD"):"NO PRICED FUNCTIONS"}</strong><small>Engineering-derived functions: {engineeringCost.budgetaryCostedCount}/{engineeringCost.requiredFunctionCount} · {engineeringCost.budgetaryDecision.state}</small><small>Budgetary-selected Radio ODU-owned function cost excluding indoor power interface assigned to IDU row 5 (not full SCADA system); Region Key B-4 has no vendor rate; Region Key incremental USD 0 assumed included for Budgetary, NOT supplier-confirmed free of charge; Myanmar region suitability subject to OEM qualification. Antenna, independent surge, enclosure, bulk and services are separate scope</small></>:
        <><strong>NOT CALCULATED</strong><small>Physical Qty × Selected Unit Rate + attributable accessories</small><small>No site allocation approved</small>

         </>}</td>
       </>;
      })()}
      <td>{x.workingPriceStatus}<small>{x.costStatus}</small><small>Accepted unit cost: {Number.isFinite(x.acceptedPrice)?money(x.acceptedPrice,"THB"):"NOT VERIFIED"}</small></td>
     </tr>
     {expanded["item:"+x.id]&&<tr><td colSpan={7}>
      <div className="p55-panel" style={{marginBottom:10}}>
       <strong>Item-level First Principles → Engineering Constraints → Parametric Cost</strong>
       <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+g.site.toLowerCase()+"."+String(x.sourceTag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+String(x.sourceRow)+".derivation"}/>
       {g.site==="ZWP20"&&x.sourceRow!==4&&(()=>{const r=zwp20Cost.rows.find(v=>v.row===x.sourceRow&&v.tag===x.sourceTag);if(!r)return null;return <div className="p55-table-wrap">
       <h4>Engineering Derivation → Physical Function → Budgetary SKU & Cost</h4>
       <p className="p55-note"><strong>Module:</strong> PJ2608-0553 / bid.budget.bom.zwp20.{String(x.sourceTag).toLowerCase().replace(/[^a-z0-9-]/g,"-")}.{x.sourceRow}.derivation · <strong>Source Quantity:</strong> {r.sourceQty} {r.sourceUnit} · <strong>Cost:</strong> {money(r.extended,r.currency)} · <strong>State:</strong> {r.status}</p>
       <table className="p55-table p55-table--compact"><thead><tr><th>Engineering / Quantity Basis</th><th>Vendor / Selected product</th><th>Unit Cost</th><th>Extended Cost</th></tr></thead><tbody>
       <tr><td>{r.quantityBasis}</td><td>{r.vendor||"Engineering takeoff"}<small>{r.sku||"No selected SKU"}</small></td><td>{money(r.unitCost,r.currency)}</td><td>{money(r.extended,r.currency)}</td></tr>
       {(r.components||[]).map((v,i)=><tr key={i}><td>{v.functionId} · Engineering Qty {v.qty}</td><td>{v.vendor}<small>{v.sku}</small></td><td>{money(v.unitPrice,v.currency)}</td><td>{money(v.extended,v.currency)}</td></tr>)}
       </tbody></table><p className="p55-note">{r.assumptions.map((v,i)=><small key={i}>{v} </small>)}</p>
       </div>})()}
       {x.sourceRow===4&&(()=>{const result=deriveEngineeringOwnedCost0553(x);return <div className="p55-table-wrap">
        <h4>Engineering Required BOM → Vendor Rate → Budgetary Cost</h4>
        <p className="p55-note"><strong>Budgetary Calculation:</strong> {result.budgetaryState} · <strong>Budgetary Item Cost:</strong> {money(result.budgetaryItemTotalUSD,"USD")} · <strong>Vendor:</strong> {result.budgetaryDecision.selectedVendor} · <strong>Scope:</strong> Radio ODU allocated functions; indoor PoE interface allocated to Row 5.</p>
        <p className="p55-note">Only Engineering Required Qty can drive Cost. Vendor quotation quantity and one-per-function demonstration cannot set purchase quantity. {result.qtyDerivedCount}/{result.requiredFunctionCount} function quantities derived; {result.costedFunctionCount} verified costed; {result.budgetaryCostedCount} provisional priced.</p>
        <table className="p55-table p55-table--compact"><thead><tr><th>Engineering Function</th><th>Quantity Driver</th><th>Required Qty</th><th>Selected SKU</th><th>Vendor Unit Rate</th><th>Extended Cost</th><th>State</th></tr></thead><tbody>
        {result.components.map(c=><tr key={c.id}><td>{c.functionId}</td><td>{c.driver}</td><td>{c.nonCostedIncluded?"INCLUDED · N/A":c.requiredQty??"NOT DERIVED"}<small>{c.quantityState}</small><small>{c.quantityProof}</small></td><td>{c.budgetarySelectedSKU??(c.nonCostedIncluded?"INCLUDED":c.selectedOffer??"NOT SELECTED")}<small>{c.budgetarySelectedOffer?"Budgetary selected: Next G "+c.budgetarySelectedOffer:""}</small></td><td>{Number.isFinite(c.budgetaryUnitPrice)?money(c.budgetaryUnitPrice,"USD"):c.nonCostedIncluded?"INCLUDED":"NOT PRICED"}<small>{Number.isFinite(c.budgetaryUnitPrice)?"Budgetary "+(c.priceEvidenceType==="ASSUMED_INCLUDED_NO_SEPARATE_CHARGE"?"USD 0 included assumption (NOT OEM-confirmed)":"Next G unit rate")+": "+money(c.budgetaryUnitPrice,"USD"):""}</small></td><td>{Number.isFinite(c.budgetaryExtended)?money(c.budgetaryExtended,"USD"):c.nonCostedIncluded?"INCLUDED":"NOT CALCULATED"}<small>{Number.isFinite(c.budgetaryExtended)?"Budgetary partial: "+money(c.budgetaryExtended,"USD"):""}</small></td><td>{c.state}<small>{c.priceEvidence?.sku?"Region key "+c.priceEvidence.sku+"; "+c.priceEvidence.constraints:""}</small></td></tr>)}
        </tbody></table><p className="p55-note"><strong>Budgetary Engineering Decision:</strong> {result.budgetaryDecision.configuration} · {result.budgetaryDecision.basis} · {result.budgetaryDecision.state}. Standard warranty: included. Qualification/deviation review: {result.budgetaryDecision.requiredDeviationReview.join("; ")}. No approval or registered deviation is implied.</p>
        <p className="p55-note"><strong>Budgetary ODU Item Cost:</strong> {money(result.budgetaryItemTotalUSD,"USD")} · <strong>Indoor Interface allocated to Row 5:</strong> {money(result.budgetaryIndoorInterfaceUSD,"USD")} · <strong>Budgetary State:</strong> {result.budgetaryState} · <strong>Final Technical Approval:</strong> {result.amount===null?"PENDING FINAL VERIFICATION":money(result.amount,result.currency)} (quantity proof shown per function; standard warranty included in radio base rate; excludes ethernet surge, antenna, enclosure, bulk and services) · {result.approvedState}. Engineering requiredQty drives each priced function; vendor offered quantities and alternatives do not.</p>
       </div>})()}

       {x.site==="ZWP8"&&x.sourceRow===43&&<div className="p55-table-wrap">
        <strong>ZWP8 Row 43 — six original MTO tags, exact quotation candidates</strong>
        <p className="p55-note">The current source item is {x.sourceTag}. The complete source row includes six distinct equipment functions. Quoted prices are evidence, not selected site rates; source sets are not validated physical SKU counts.</p>
        <div className="p55-table-wrap"><strong>Budgetary reference — two radio assemblies and two antennas (source-backed assumptions, NOT full ZWP8 cost)</strong>
        <table className="p55-table p55-table--compact"><thead><tr><th>Antenna option</th><th>Assumed radio assemblies</th><th>Radio USD/unit</th><th>Assumed antennas</th><th>Antenna USD/unit</th><th>Partial equipment USD</th><th>Decision</th></tr></thead><tbody>
        {ZWP8_ROW43_COST_TRACE.referenceScenarios.map(v=><tr key={v.id}><td><strong>{v.antennaLabel} · {v.antennaQuoteLine}</strong><small>{v.id===ZWP8_ROW43_COST_TRACE.preferredScenarioId?"PREFERRED BUDGETARY · MANAGEMENT":"REFERENCE ALTERNATIVE — EXCLUDED FROM PREFERRED TOTAL"}</small></td><td>{v.assumedRadioAssemblies}</td><td>{money(v.radioAssemblyUnitUSD,"USD")}</td><td>{v.assumedAntennas}</td><td>{money(v.antennaUnitUSD,"USD")}</td><td><strong>{money(v.partialEquipmentUSD,"USD")}</strong></td><td>{v.state}<small>{v.assumption}</small></td></tr>)}
        </tbody></table>
        <p className="p55-note">These are alternative estimates; never add 4ft and 6ft scenarios together. Excludes separate IDU treatment, region/NMS licensing, warranty, enclosure, cable, gland, bulk, services and risk. No scenario is an approved ZWP8 or MR0001 total.</p></div>

        <table className="p55-table p55-table--compact"><thead><tr><th>Tag / leaf ID</th><th>MTO qty</th><th>Function</th><th>Vendor rate candidates (USD/unit)</th><th>Required physical qty</th><th>Extended ZWP8 cost</th></tr></thead><tbody>
        {ZWP8_ROW43_COST_TRACE.items.map(item=><tr key={item.tag}><td>{item.tag}<ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom.zwp8."+item.tag.toLowerCase()+".43"}/></td><td>{item.sourceScopeText}</td><td>{item.role}</td><td>{item.candidates.length?item.candidates.map(v=><small key={v.quoteLine}>{v.quoteLine} · {v.sku}: {money(v.unitPriceUSD,"USD")} (offer qty {v.quoteQty})</small>):"No separate priced OEM IDU line identified"}</td><td>NOT DERIVED</td><td>NOT ALLOCATED</td></tr>)}
        </tbody></table><p className="p55-note">Antenna selection 4ft versus 6ft requires CAL/RPT; do not sum alternative antenna quotes. IDU integration must be checked before assigning additional cost.</p>
       </div>}
       <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
        <thead><tr><th>Stage</th><th>Evidence / calculation</th><th>Result</th></tr></thead><tbody>
        <tr><td>01 Source</td><td>MTO Rev04 · source row {x.sourceRow} · {x.sourceTag}</td><td>{x.sourceScopeQty??"UNRESOLVED"} {x.sourceScopeUnit||""} (scope quantity only)</td></tr>
        <tr><td>02 First Principles</td><td>Site {g.site}; requirement object {x.bomType}; source demand is not physical SKU quantity</td><td>{x.engineeringRequiredSkuQty==null?"SKU quantity requires configuration, interface and location take-off":x.engineeringRequiredSkuQty}</td></tr>
        <tr><td>03 Constraints / CAL-RPT</td><td>{g.rfProof.length?g.rfProof.map(r=>r.id).join(", "):"No linked RF calculation for this item"} · verify capacity, power, Ex rating, licences and interfaces as applicable</td><td>ENGINEERING REVIEW REQUIRED</td></tr>
        <tr><td>04 Vendor fit</td><td>{x.vendorCandidates.length} matched offer candidates; {x.configuration.length} bundled offer lines</td><td>{x.pricedVendor?"WORKING BUNDLE — OEM NOT APPROVED":"NOT SELECTED"}</td></tr>
        {getZWP20RemoteBudgetChoice(x)&&<tr><td>05a Vendor comparison basket</td><td>{getZWP20RemoteBudgetChoice(x).rationale}; quote lines must be assigned once to physical functions before aggregation</td><td>USD {getZWP20RemoteBudgetChoice(x).partialUSD.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} · comparison only; selected package total NOT DERIVED</td></tr>}
       {getMR502BudgetaryScenarios(x).length>0&&<tr><td>05a Cost scenario evidence</td><td>Next G A/B/C are alternative, unselected assembly rate references; not additive. Confirm radio role, quantity, licence and excluded bulk before using in budget.</td><td>NOT SELECTED — {getMR502BudgetaryScenarios(x).map(v=>v.group+": "+money(v.unitAssemblyReferenceUSD,"USD")).join(" | ")}</td></tr>}
        <tr><td>05 Cost formula</td><td>Physical Qty × Accepted Unit Rate + attributable bulk / work / risk</td><td>{Number.isFinite(x.acceptedPrice)&&Number.isFinite(x.engineeringRequiredSkuQty)?money(x.acceptedPrice*x.engineeringRequiredSkuQty,"THB"):"Verified extended cost NOT ESTABLISHED"}</td></tr>
        <tr><td>06 Budgetary evidence</td><td>Source scenario shown separately; pricing requires quantity driver, currency/FX, validity and risk basis</td><td>{Number.isFinite(x.indicativePackageCostTHB)?money(x.indicativePackageCostTHB,"THB")+" — SCENARIO ONLY":"SOURCE PRICE NOT ALLOCATED"}</td></tr>
        </tbody></table></div>
       {(()=>{const result=deriveEngineeringOwnedCost0553(x);
        const moduleId="PJ2608-0553 / bid.budget.bom."+g.site.toLowerCase()+"."+String(x.sourceTag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+String(x.sourceRow)+".derivation";
        const lines=[["Module ID","Engineering Function","Engineering Qty","Quantity Basis","Budgetary Vendor","Selected SKU","Vendor Quote Line","Unit Price USD","Extended USD","Price Basis"],
          ...result.components.map(c=>[moduleId,c.functionId,c.nonCostedIncluded?"Included":c.requiredQty??"",c.quantityState,c.nonCostedIncluded?"OEM Included":c.budgetarySelectedOffer?"Next G":"Not selected",c.budgetarySelectedSKU||"",c.budgetarySelectedOffer||"",c.budgetaryUnitPrice??"",c.budgetaryExtended??"",c.priceEvidenceType||""]),
          [moduleId,"BUDGETARY RADIO FUNCTIONAL TOTAL","","",result.budgetaryDecision.selectedVendor,"","","",result.budgetaryItemTotalUSD??"","CALCULATED_WITH_ASSUMPTIONS"]];
        const tsv=lines.map(row=>row.map(value=>String(value??"").replaceAll(String.fromCharCode(9)," ").replaceAll(String.fromCharCode(10)," ")).join(String.fromCharCode(9))).join(String.fromCharCode(10));
        return <div className="p55-table-wrap">
         <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",justifyContent:"space-between"}}>
          <strong>Engineering-Derived BOM → Selected Vendor/SKU → Parametric Cost</strong>
          <button type="button" className="p553-detail-button" onClick={()=>{if(typeof navigator!=="undefined"&&navigator.clipboard?.writeText){navigator.clipboard.writeText(tsv).catch(()=>window.prompt("Copy engineering BOM TSV",tsv));}else if(typeof window!=="undefined"){window.prompt("Copy engineering BOM TSV",tsv);}}}>Copy Module Table (Excel TSV)</button>
         </div>
         <p className="p55-note"><strong>Module ID:</strong> {moduleId} <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+g.site.toLowerCase()+"."+String(x.sourceTag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+String(x.sourceRow)+".derivation"}/></p>
         <p className="p55-note">Root = Engineering Requirements, Topology, Constraints and derived quantities. Next G / {result.budgetaryDecision.quotation} supplies product and unit-rate evidence only, not purchase quantities. All vendor alternatives and whole-offer quantities are excluded from this total.</p>
         <table className="p55-table p55-table--compact"><thead><tr><th>Required Engineering Function</th><th>Qty / Basis</th><th>Budgetary Selected Vendor / SKU</th><th>Source Line</th><th>Unit USD</th><th>Extended USD</th><th>Decision</th></tr></thead><tbody>
          {result.components.map(c=><tr key={c.id}><td>{c.functionId}</td><td>{c.nonCostedIncluded?"Included":c.requiredQty??"Not derived"}<small>{c.quantityState}</small></td><td>{c.nonCostedIncluded?"Included in OEM base":c.budgetarySelectedSKU??"Not selected"}<small>{c.budgetarySelectedOffer?"Next G · budgetary selected":""}</small></td><td>{c.budgetarySelectedOffer||"—"}</td><td>{Number.isFinite(c.budgetaryUnitPrice)?money(c.budgetaryUnitPrice,"USD"):"—"}</td><td>{Number.isFinite(c.budgetaryExtended)?money(c.budgetaryExtended,"USD"):"Included / Not priced"}</td><td>{c.priceEvidenceType==="ASSUMED_INCLUDED_NO_SEPARATE_CHARGE"?"USD 0 incremental assumption; Myanmar entitlement review":c.budgetaryDecision}<small>Final technical approval tracked separately</small></td></tr>)}
          <tr><td colSpan={5}><strong>Engineering Budgetary Radio Functional Cost</strong></td><td><strong>{money(result.budgetaryItemTotalUSD,"USD")}</strong></td><td>{result.budgetaryState}</td></tr>
         </tbody></table>
         <p className="p55-note">Scope boundary: Radio ODU functional package only; antenna, independent surge, enclosure, bulk and services belong to separately traced MTO/CBS lines. Standard warranty included. Region entitlement USD 0 is a working assumption, not OEM-confirmed pricing.</p>
         <details><summary>Vendor alternative price evidence (reference only; excluded from selected cost)</summary>
         <p className="p55-note">Vendor candidate rates are reference evidence. No quotation-wide offered quantity determines the Engineering BOM quantity.</p>
         <table className="p55-table p55-table--compact"><thead><tr><th>Engineering Function</th><th>Vendor SKU / Quote</th><th>Quoted Qty (whole quote)</th><th>Unit Rate</th></tr></thead><tbody>
         {result.components.flatMap(c=>c.vendorCandidates.map(v=><tr key={c.id+"-"+v.quoteLine}><td>{c.functionId}</td><td>{v.sku} / {v.quoteLine}</td><td>{v.offeredQty??"—"}</td><td>{Number.isFinite(v.unitPrice)?money(v.unitPrice,v.currency||"USD"):"No separate rate"}</td></tr>))}
         </tbody></table></details>
        </div>;
       })()}
       {(()=>{const decision=ITEM_DECISION_PIPELINE_0553.evaluate(x);return <div className="p55-table-wrap">
       <strong>Stage-gated qualification / MCDA / CBS trace</strong>
       <table className="p55-table p55-table--compact"><thead><tr><th>Gate</th><th>Result</th><th>Evidence / decision rule</th></tr></thead><tbody>
        {decision.stages.map(gate=><tr key={gate.id}><td>{gate.label}</td><td>{gate.passed?"EVIDENCE COMPLETE":"REVIEW REQUIRED"}</td><td>{gate.detail}</td></tr>)}
       </tbody></table>
       <p className="p55-note">Functional decomposition: {decision.functions.length} required function(s); vendor quote candidate lines: {decision.candidateLines.join(", ")||"none mapped"}. MCDA is NOT_RANKED until safety/technical qualification and weights are verified. CBS allocation: {decision.stages.find(v=>v.id==="CBS")?.passed?"MAPPED":"NOT MAPPED"}.</p>
       </div>})()}
       <p className="p55-note">Budgetary assumption may be used only when explicitly recorded and traceable; missing physical quantities or accepted rates never become zero. Source MTO Set/Lot is not SKU count.</p>
      </div>
      <details className="p553-budget-phase"><summary><strong>Source Quotation Evidence / หลักฐานใบเสนอราคา</strong> · {x.configuration.length+x.vendorCandidates.length} referenced lines · expand to inspect original quantities and prices</summary>
      <p className="p55-note">Source quote quantities are for the entire supplier offer and are not the physical quantity installed at {g.site}. Alternatives and repeated vendor candidates must not be added into BOM cost.</p>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Vendor</th><th>SKU / Offer line</th><th>Quoted qty (whole offer)</th><th>Quoted unit price</th><th>Use decision</th></tr></thead><tbody>
      {x.configuration.concat(x.vendorCandidates).map((v,i)=><tr key={i}>
       <td>{v.vendor||"VST ECS / Cisco"}</td><td>{v.sku}<small>{v.quoteId} · {v.quoteLine}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+g.site.toLowerCase()+"."+String(x.sourceTag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+String(x.sourceRow)+".quote."+String(v.quoteId||"candidate").toLowerCase()+"."+String(v.quoteLine||i).toLowerCase().replace(/[^a-z0-9-]/g,"-")}/></td>
       <td>{v.offeredQuoteQty??v.quoteQty??"—"}</td>
       <td>{money(v.originalUnitPrice??v.unitPrice,v.originalCurrency||v.currency)}</td>
       <td>{x.pricedVendor?"Cisco working bundle / OEM review":"SOURCE QUOTE ONLY — ALLOCATION OPEN"}</td>
      </tr>)}
      {!x.configuration.length&&!x.vendorCandidates.length&&<tr><td colSpan={5}>No priced source mapped to this physical object yet; do not assume zero cost</td></tr>}
      </tbody></table></div></details>
     </td></tr>}
    </React.Fragment>)}</tbody></table></div></td></tr>}
  </React.Fragment>)}
  </tbody></table></div>
  <p className="p55-note">Missing price is not missing scope: {missingSourceRows.length} source rows in the chosen location still lack a Cisco-priced scenario, and may have other vendor price evidence. Detailed physical quantities, bulk and services must be derived separately.</p>
  <p className="p55-note">ZWP20 GREENFIELD total across all equipment, vendor packages and bulk is NOT ESTABLISHED; Cisco-only priced subtotal must never be labelled total location cost. Subtotal is for priced working items only. It excludes non-priced MR0001 equipment, bulk, spares and services. Customer A+B+C total and selling price remain separate; 4-Scope of Supply.xlsx is the controlled output template.</p>
  </>}
 </section>;
}
