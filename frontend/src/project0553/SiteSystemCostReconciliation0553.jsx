import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {BOM_READ_MODEL_0553 as data,selectBomRows0553,bomItems0553,bomCurrencySubtotals0553} from "./data/bomReadModel0553";
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"UNPRICED";
export function SiteSystemCostReconciliation0553(){
 const [expanded,setExpanded]=useState({});
 const [site,setSite]=useState("ALL");
 const [mr,setMr]=useState("ALL");
 const rows=selectBomRows0553({mr,site});
 const toggle=k=>setExpanded(s=>({...s,[k]:!s[k]}));
 return <section className="p55-panel" data-component-key="bid.budget.bom.reconciliation">
  <h3>Per MR / Per Location · BOM Cost Reconciliation <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.reconciliation"/></h3>
  <p className="p55-note"><strong>Read-only projection.</strong> Detailed source rows share the ZWP20 Working BOM cost derivation. Other MR/site entries may still contain provisional allocations, not approved physical BOM. No vendor quotation-wide amount is added to a site total; currencies are kept separate.</p>
  <div className="p55-filterbar">
   <label>MR <select value={mr} onChange={e=>setMr(e.target.value)}><option value="ALL">All MR</option>{data.systems.map(s=><option key={s.id} value={s.id}>{s.id} — {s.name}</option>)}</select></label>
   <label>Location <select value={site} onChange={e=>setSite(e.target.value)}><option value="ALL">All locations</option>{data.sites.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
  </div>
  <p className="p55-note"><strong>Partial source subtotal, not a project total:</strong> {bomCurrencySubtotals0553(rows).map(x=>x.currency+" "+fmt(x.amount)).join(" · ")||"NO COSTED ROWS"}</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget"><thead><tr><th>+</th><th>MR</th><th>Location</th><th>Source subtotal</th><th>Detailed MTO rows</th><th>Coverage / Source</th><th>Copy ID</th></tr></thead><tbody>
   {rows.map(r=>{const key=r.mr+":"+r.site,detail=bomItems0553(r);return <React.Fragment key={key}>
    <tr><td><button type="button" className="p55-row-toggle" onClick={()=>toggle(key)}>{expanded[key]?"−":"+"}</button></td>
     <td><strong>{r.mr}</strong><small>{r.name}</small></td><td>{r.site}</td>
     <td>{r.subtotals.map(t=><div key={t.currency}>{t.currency} {fmt(t.amount)}</div>)}</td>
     <td>{detail.length||"NOT DERIVED"}</td>
     <td>{r.projectionSource}<small>{r.completeness}</small></td>
     <td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+r.site.toLowerCase()+"."+r.mr.toLowerCase().replace("-","")+".cost"}/></td></tr>
    {expanded[key]&&<tr><td colSpan={7}>
     <p className="p55-note">RFQ: {r.rfqSource?.title||"SOURCE PENDING"} · {r.rfqSource?.revision||""}</p>
     <table className="p55-table p55-table--compact"><thead><tr><th>MTO Row</th><th>Tag</th><th>Description</th><th>Qty / Unit</th><th>Vendor / SKU</th><th>Source unit cost</th><th>Source extended cost</th><th>Trace / Status</th></tr></thead><tbody>
      {detail.map((x,i)=><tr key={x.id||i}><td>{x.row}</td><td>{x.tag}</td><td>{x.description}</td><td>{x.sourceQty} {x.sourceUnit}</td><td>{x.vendor}<small>{x.sku}</small></td><td>{x.currency||""} {fmt(x.unitCost)}</td><td>{x.currency||""} {fmt(x.extended)}</td><td>{x.basis}<small>{x.status}</small></td></tr>)}
      {!detail.length&&<tr><td colSpan={8}>Detailed working MTO ledger has not been derived for this MR/site. Historical quote allocation is not a physical BOM.</td></tr>}
     </tbody></table>
     <p className="p55-note">Scope gaps: {(r.gaps||[]).join(" · ")}</p>
    </td></tr>}
   </React.Fragment>})}
  </tbody></table></div>
  <p className="p55-note">Working Preview remains the sole BOM engineering workbench. Displayed costs are INTERNAL ONLY; customer sell price must pass a separate approved commercial mapping.</p>
 </section>;
}
