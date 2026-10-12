import React,{useMemo,useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {SITE_SYSTEM_COST_RECONCILIATION_0553 as ledger} from "./data/siteSystemCostReconciliation";
import {SUPPLIER_QUOTE_LINES_0553} from "./data/supplierQuoteLines";

// ONE ledger, multiple projections. No independent category-to-MTO matching or pricing here.
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT PRICED";
const RFQ_URL=id=>id?"https://drive.google.com/file/d/"+id+"/view":null;
function detail(row){
 return row.detailRows?.length?row.detailRows:row.evidence.map((e,i)=>({
  id:row.site+"-"+row.mr+"-"+i,site:row.site,sourceRow:e.line,sourceTag:e.line,
  description:e.description,sourceScopeQty:e.assumedQty,sourceScopeUnit:"",vendor:e.source,
  sku:null,currency:e.currency,unitCost:e.unit,extended:e.extended,status:e.kind,
  basis:e.source,assumptions:["Legacy provisional allocation; full item-level MTO linkage not available in this projection"]
 }));
}
function groupTotal(rows){
 const result=new Map();
 for(const r of rows)for(const t of r.subtotals||[])if(Number.isFinite(t.amount))result.set(t.currency,(result.get(t.currency)||0)+t.amount);
 return [...result].map(([currency,value])=>currency+" "+fmt(value)).join(" · ")||"NO ALLOCATED PRICES";
}
export function SourceCoverage0553(){
 const [mode,setMode]=useState("MR");
 const [mr,setMr]=useState("ALL");
 const [site,setSite]=useState("ALL");
 const [expanded,setExpanded]=useState({});
 const filtered=useMemo(()=>ledger.rows.filter(r=>(mr==="ALL"||r.mr===mr)&&(site==="ALL"||r.site===site)),[mr,site]);
 const groupKey=r=>mode==="MR"?r.mr:r.site;
 const groups=[...new Set(filtered.map(groupKey))].map(key=>({key,rows:filtered.filter(r=>groupKey(r)===key)}));
 const toggle=key=>setExpanded(old=>({...old,[key]:!old[key]}));
 return <section className="p55-panel" data-component-key="bid.budget.bom.source-coverage">
  <h3>BOM Source Coverage · MR / Location / Official Projection <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.source-coverage"/></h3>
  <p className="p55-note"><strong>Single Source of Truth:</strong> This page uses exactly the reconciliation rows and the ZWP20 detailed ledger, without separate price calculation. The official Excel template is a release/export layout, not a second cost database. Other sites/MRs retain clearly labelled legacy provisional evidence until migrated into a detailed ledger.</p>
  <div className="p55-filterbar">
   <label>View <select value={mode} onChange={e=>setMode(e.target.value)}><option value="MR">Per MR → Location</option><option value="LOCATION">Per Location → MR</option></select></label>
   <label>MR <select value={mr} onChange={e=>setMr(e.target.value)}><option value="ALL">All MR</option>{ledger.systems.map(s=><option key={s.id} value={s.id}>{s.id} · {s.name}</option>)}</select></label>
   <label>Location <select value={site} onChange={e=>setSite(e.target.value)}><option value="ALL">All locations</option>{ledger.sites.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
  </div>
  <p className="p55-note"><strong>Visible view subtotal by original currency:</strong> {groupTotal(filtered)}. Never add currencies or quote-wide evidence into totals without allocation and approved FX.</p>
  {groups.map(g=><div key={g.key} className="p55-panel">
   <h4><button type="button" className="p55-row-toggle" onClick={()=>toggle("group:"+g.key)}>{expanded["group:"+g.key]?"−":"+"}</button> {g.key} · {mode==="MR"?(ledger.systems.find(s=>s.id===g.key)?.name||""):"Location"} · {groupTotal(g.rows)}</h4>
   {mode==="MR"&&ledger.systems.find(s=>s.id===g.key)?.rfqSource&&<p className="p55-note">RFQ MR: <a target="_blank" rel="noreferrer" href={RFQ_URL(ledger.systems.find(s=>s.id===g.key).rfqSource.driveId)}>{ledger.systems.find(s=>s.id===g.key).rfqSource.title} · {ledger.systems.find(s=>s.id===g.key).rfqSource.revision}</a></p>}
   {expanded["group:"+g.key]&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget"><thead><tr><th>+</th><th>MR</th><th>Location</th><th>Lines</th><th>Subtotal (original currency)</th><th>Coverage / source</th></tr></thead><tbody>
    {g.rows.map(r=>{const key="row:"+r.mr+":"+r.site;const lines=detail(r);return <React.Fragment key={key}>
     <tr><td><button type="button" className="p55-row-toggle" onClick={()=>toggle(key)}>{expanded[key]?"−":"+"}</button></td>
      <td>{r.mr}</td><td>{r.site}</td><td>{lines.length}</td><td>{r.subtotals.map(s=><div key={s.currency}>{s.currency} {fmt(s.amount)}</div>)}</td>
      <td>{r.projectionSource}<small>{r.completeness}</small></td></tr>
     {expanded[key]&&<tr><td colSpan={6}><table className="p55-table p55-table--compact"><thead><tr><th>MTO row / Tag</th><th>Physical object / Description</th><th>Qty / Unit</th><th>Vendor / SKU</th><th>Unit Price</th><th>Extended</th><th>Trace / Decision</th></tr></thead><tbody>
     {lines.map((x,i)=><tr key={x.id||i}><td>{x.row??x.sourceRow??"—"}<small>{x.tag||x.sourceTag||""}</small></td>
      <td>{x.description}</td><td>{x.sourceQty??x.sourceScopeQty??"UNKNOWN"} {x.sourceUnit||x.sourceScopeUnit||""}</td>
      <td>{x.vendor||"—"}<small>{x.sku||""}</small></td><td>{x.currency||"—"} {fmt(x.unitCost)}</td>
      <td>{x.currency||"—"} {fmt(x.extended)}</td><td>{x.basis||"Source unassigned"}<small>{x.status||""}</small><small>{(x.assumptions||[]).join(" · ")}</small></td></tr>)}
     {!lines.length&&<tr><td colSpan={7}>No priced detail; this is a documented scope gap, not zero cost.</td></tr>}
     </tbody></table>
     <p className="p55-note">Open scope / issues: {(r.gaps||[]).join(" · ")||"No explicit gaps recorded"}</p>
     {r.rfqSource&&<p className="p55-note">RFQ: <a target="_blank" rel="noreferrer" href={RFQ_URL(r.rfqSource.driveId)}>{r.rfqSource.title} {r.rfqSource.revision}</a></p>}
     </td></tr>}
    </React.Fragment>})}
   </tbody></table></div>}
  </div>)}
  <p className="p55-note"><strong>Official Excel:</strong> preserve the uploaded six-sheet 4-Scope of Supply template and its Part A/B/C and spares categories. Source coverage is INTERNAL and must not be exported into customer-priced sheets. A template-accurate exporter with selected revision, price currency and customer release gate is a separate implementation step; no live Excel export is claimed by this page.</p>
 </section>;
}
