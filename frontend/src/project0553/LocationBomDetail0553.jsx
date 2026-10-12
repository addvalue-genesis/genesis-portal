import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {MR0001_MODULE_CROSSMAP_0553} from "./data/mr0001ModuleCrossmap0553";
import {selectMR0001TagCostRows0553,summarizeMR0001TagCost0553} from "./data/mr0001TagCostLedger0553";
import {deriveSevenLocationCostLedger0553} from "./data/sevenLocationCostCalculations0553";
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"PENDING";
export function LocationBomDetail0553({site,fx}){
 const [expanded,setExpanded]=useState({});
 const ledger=summarizeMR0001TagCost0553(site);
 const rows=selectMR0001TagCostRows0553(site);
 const bulk=deriveSevenLocationCostLedger0553().find(v=>v.wp===site);
 const bulkRows=(bulk?.rows||[]).filter(v=>v.system==="SCADA_RADIO");
 const fxValid=fx?.thbPerUsd>0;
 const thb=(n,c)=>!Number.isFinite(n)?"PENDING":c==="THB"?"THB "+fmt(n):c==="USD"&&fxValid?"THB "+fmt(n*fx.thbPerUsd):"FX REQUIRED";
 const totalTHB=fxValid?ledger.subtotals.THB+ledger.subtotals.USD*fx.thbPerUsd:null;
 const keyPrefix="bid.budget.bom."+site.toLowerCase();
 const copyTable=()=>{
  const lines=[["Module ID","MTO Row","Tag","Quantity","Unit","Original Currency","Unit Cost","Extended Cost","Displayed THB","Basis","Status"],
   ...rows.map(v=>[keyPrefix+"."+String(v.tag).toLowerCase()+"."+v.row,v.row,v.tag,v.sourceQty??"",v.sourceUnit??"",v.currency??"",v.unitCost??"",v.extended??"",thb(v.extended,v.currency),v.source??"",v.status])];
  const value=lines.map(row=>row.map(v=>String(v??"").replaceAll("\t"," ").replaceAll("\n"," ")).join("\t")).join("\n");
  if(typeof navigator!=="undefined"&&navigator.clipboard?.writeText)navigator.clipboard.writeText(value).catch(()=>window.prompt("Copy BOM",value));
  else if(typeof window!=="undefined")window.prompt("Copy BOM",value);
 };
 return <section className="p55-panel" data-component-key={keyPrefix}>
  <div style={{display:"flex",justifyContent:"space-between",gap:8,flexWrap:"wrap",alignItems:"center"}}>
   <strong>{site} · SCADA Engineering-Derived Site Cost Summary</strong>
   <button type="button" className="p553-detail-button" onClick={copyTable}>Copy {site} BOM Table (Excel)</button>
  </div>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={keyPrefix}/> · MTO Rev04 → Engineering Tag → Site Function / Quantity → Vendor evidence → Working Cost. Same ledger rules as ZWP20; NO blind copying of ZWP20 radio configuration or prices.</p>
  <p><strong>{site} Working Priced Subtotal: {Number.isFinite(totalTHB)?"THB "+fmt(totalTHB):"FX REQUIRED"}</strong>
   <small>Original USD {fmt(ledger.subtotals.USD)} + THB {fmt(ledger.subtotals.THB)} · {ledger.costedRows}/{ledger.totalRows} tagged rows priced · {ledger.unresolvedRows.length} unresolved · FX {fx?.thbPerUsd??"NOT SET"} THB/USD</small></p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>MTO / Module</th><th>Engineering Quantity / Basis</th><th>Budgetary Selected Product / Vendor</th><th>Unit Cost (THB)</th><th>Extended Cost (THB)</th><th>Assumptions / Status</th></tr></thead><tbody>
   {rows.map(v=><React.Fragment key={v.row+"-"+v.tag}>
    <tr>
     <td><button type="button" className="p55-row-toggle" onClick={()=>setExpanded(o=>({...o,[v.tag]:!o[v.tag]}))}>{expanded[v.tag]?"−":"+"}</button> <strong>{v.tag}</strong><small>Row {v.row}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={keyPrefix+"."+String(v.tag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+v.row}/></td>
     <td>{v.sourceQty??"REVIEW"} {v.sourceUnit||""}<small>{v.quantityBasis||v.note||"Engineering quantity and physical SKU to verify"}</small></td>
     <td>{v.vendor||"Vendor / Configuration not selected"}<small>{v.sku||v.description||"Engineering takeoff required"}</small></td>
     <td>{thb(v.unitCost,v.currency)}<small>{v.currency||"—"} {fmt(v.unitCost)}</small></td>
     <td><strong>{thb(v.extended,v.currency)}</strong><small>{v.currency||"—"} {fmt(v.extended)}</small></td>
     <td>{v.status}<small>{v.source||"MTO Rev04"}</small>{(v.assumptions||[]).map((x,i)=><small key={i}>{x}</small>)}</td>
    </tr>
    {expanded[v.tag]&&<tr><td colSpan={6}><div className="p55-panel">
     <strong>{v.tag} · Row {v.row} — Engineering Derivation / Vendor Breakdown</strong><p><ComponentCopyId projectId="PJ2608-0553" componentKey={keyPrefix+"."+String(v.tag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+v.row+".derivation"}/></p>
     <p className="p55-note">Quantity owner: MR/MTO · Cost owner: {v.source} · {v.status} · Selected vendor cost is not customer selling price.</p>
     {v.tag==="MR-502-001"&&site==="ZWP21"&&<p className="p55-note"><strong>Functional mapping from ZWP20 reference:</strong> ZWP20 MR-502-001 Row 4 (PTMP remote) → ZWP21 MR-502-001 Row 13 (PTP peer). Matching child functions: Radio hardware, RF filter, throughput/capacity entitlement and RF mounting. Different RPT role / quote group; no automatic SKU or region entitlement transfer. Separate power/IDU and surge owners must remain separate.</p>}
     {v.tag==="MR-502-001"&&site==="ZWP21"&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Function</th><th>ZWP20 Reference</th><th>ZWP21 Budgetary</th><th>Cost Owner</th><th>Engineering Control</th></tr></thead><tbody>
       {MR0001_MODULE_CROSSMAP_0553.functions.map(x=><tr key={x.id}><td>{x.id}</td><td>{x.zwp20}</td><td>{x.zwp21}</td><td>{x.owner}</td><td>{x.rule}</td></tr>)}
      </tbody></table><p className="p55-note">ZWP20: {MR0001_MODULE_CROSSMAP_0553.sourceModule} → ZWP21: {MR0001_MODULE_CROSSMAP_0553.targetModule}. Functional mapping only; quotation and technical approval remain site-specific.</p></div>}
     {(v.detail||v.components||[]).length>0&&<div className="p55-table-wrap"><p className="p55-note"><strong>Function-level costing (same renderer for all sites):</strong> Source quantity, accepted function selection and commercial rates are independent controls. A missing function cost remains pending.</p><table className="p55-table p55-table--compact">
      <thead><tr><th>Engineering Function / Quote Line</th><th>Required Qty / Basis</th><th>Selected Budgetary SKU</th><th>Original Rate</th><th>Extended (THB)</th><th>Evidence / Owner / Status</th></tr></thead><tbody>
       {(v.detail||v.components||[]).map((c,i)=><tr key={c.functionId||i}><td>{c.functionId}</td><td>{c.requiredQty??c.qty??"PENDING"}<small>{c.quantityState||c.quantityBasis||"Engineering confirmation required"}</small></td><td>{c.budgetarySelectedSKU||c.sku||"NOT SELECTED"}</td><td>{c.currency||v.currency||"USD"} {fmt(c.budgetaryUnitPrice??c.unitPrice)}</td><td>{thb(c.budgetaryExtended??c.extended,c.currency||v.currency)}</td><td>{c.allocationOwner||v.tag+"."+v.row}<small>{c.budgetarySelectionState||c.status||c.state}</small></td></tr>)}
      </tbody></table></div>}
     {(v.quotedRateCandidates||[]).length>0&&<div className="p55-table-wrap"><strong>Vendor alternative quotation evidence (not additive)</strong><table className="p55-table"><thead><tr><th>Quote line</th><th>SKU</th><th>Original Unit Rate</th><th>Selected</th></tr></thead><tbody>{v.quotedRateCandidates.map((c,i)=><tr key={i}><td>{c.quoteLine}</td><td>{c.sku}</td><td>{fmt(c.unitPriceTHB??c.sourceUnitTHB)}</td><td>{c.selected?"WORKING COMPARABLE":"ALTERNATIVE"}</td></tr>)}</tbody></table></div>}
     {(v.candidates||[]).map((c,i)=><p key={i} className="p55-note">{c.vendor||"Supplier"} · {c.sku} · {c.originalCurrency} {fmt(c.originalUnitPrice)} · candidate only, NOT additional booked cost</p>)}
    </div></td></tr>}
   </React.Fragment>)}
   </tbody></table></div>
  <h4>{site} · SCADA Bulk / Installation Material Basis (separate scope)</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Bulk / Function</th><th>Qty</th><th>Rate (THB)</th><th>Extended (THB)</th><th>Owner / Status</th></tr></thead><tbody>
   {bulkRows.map(v=><tr key={v.id}><td>{v.item}</td><td>{v.qty??"DERIVE"} {v.unit}</td><td>{fmt(v.rateTHB)}</td><td>{fmt(v.extendedTHB)}</td><td>{v.owner}<small>{v.status}</small><small>{v.source}</small></td></tr>)}
  </tbody></table></div>
  <p className="p55-note">Bulk shown separately, not automatically additive to equipment subtotal. New/Reuse and source quantity are assessed per site. Missing pricing stays PENDING. Customer A+B+C release not approved.</p>
 </section>;
}
