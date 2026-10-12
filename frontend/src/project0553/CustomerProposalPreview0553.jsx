import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {SITE_SYSTEM_COST_RECONCILIATION_0553 as ledger} from "./data/siteSystemCostReconciliation";

// Customer-facing scope preview. Does not copy or recalculate the engineering BOM.
// Commercial sell prices are intentionally unavailable until an approved
// estimate-to-bid mapping/revision is registered. Never expose vendor costs.
export function CustomerProposalPreview0553(){
 const [mr,setMr]=useState("ALL");
 const [site,setSite]=useState("ALL");
 const [expanded,setExpanded]=useState({});
 const rows=ledger.rows.filter(r=>(mr==="ALL"||mr===r.mr)&&(site==="ALL"||site===r.site));
 const groups=ledger.systems.filter(s=>mr==="ALL"||s.id===mr);
 const toggle=id=>setExpanded(x=>({...x,[id]:!x[id]}));
 return <section className="p55-panel" data-component-key="bid.budget.summary">
  <div className="p55-eyebrow">CUSTOMER PROPOSAL PREVIEW · INTERNAL REVIEW ONLY <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.summary"/></div>
  <h2>Scope of Supply — BOM → Customer Presentation</h2>
  <p className="p55-note"><strong>NOT AN ISSUED OFFER.</strong> Same underlying BOM ledger as Working Preview and Source Coverage. Vendor cost, internal margin and quotation-wide cost assumptions are intentionally hidden. Customer selling amounts remain blank until approved commercial mapping, verified FX and snapshot release.</p>
  <div className="p55-filterbar">
   <label>MR <select value={mr} onChange={e=>setMr(e.target.value)}><option value="ALL">All MR</option>{ledger.systems.map(x=><option key={x.id} value={x.id}>{x.id} — {x.name}</option>)}</select></label>
   <label>Location <select value={site} onChange={e=>setSite(e.target.value)}><option value="ALL">All locations</option>{ledger.sites.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>+</th><th>MR / System</th><th>Location</th><th>Working scope items</th><th>Customer selling total</th><th>Readiness</th></tr></thead><tbody>
   {groups.flatMap(system=>rows.filter(r=>r.mr===system.id).map(r=>{
    const key=r.mr+":"+r.site;
    const details=r.detailRows||[];
    return <React.Fragment key={key}>
     <tr><td><button type="button" className="p55-row-toggle" onClick={()=>toggle(key)} aria-expanded={!!expanded[key]}>{expanded[key]?"−":"+"}</button></td>
      <td><strong>{system.id}</strong><small>{system.name}</small></td><td>{r.site}</td>
      <td>{details.length?details.length+" source rows":"Detailed MTO mapping pending"}</td>
      <td>—</td><td>{details.length?"WORKING SCOPE / NOT COMMERCIAL RELEASE":"NOT READY — NO DETAIL LEDGER"}</td></tr>
     {expanded[key]&&<tr><td colSpan={6}>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Item / Tag</th><th>Customer description (working)</th><th>Qty</th><th>Unit</th><th>Selling unit</th><th>Selling amount</th><th>Review status</th></tr></thead><tbody>
       {details.map((x,i)=><tr key={x.id||i}><td>{x.tag||x.sourceTag||"—"}</td><td>{x.description}</td><td>{x.sourceQty??"—"}</td><td>{x.sourceUnit||"—"}</td><td>—</td><td>—</td><td>ENGINEERING DRAFT</td></tr>)}
       {!details.length&&<tr><td colSpan={7}>No customer-ready BOM item list yet. Existing supplier quotation evidence has not been promoted to a customer scope line.</td></tr>}
      </tbody></table></div>
      <p className="p55-note">Controlling MR: {r.rfqSource?.title||system.rfqSource?.title||r.mr}; {r.rfqSource?.revision||system.rfqSource?.revision||"revision pending"}. Buyer-facing description and sell-rate approval are required before export.</p>
     </td></tr>}
    </React.Fragment>;
   }))}
  </tbody></table></div>
  <p className="p55-note"><strong>Official format:</strong> 4-Scope of Supply.xlsx (6 worksheets). This is a UX/UI review, not an Excel export or authorized submission. Scope ownership, Part A/B/C, optional spares, revised selling amounts and approval gate must reconcile before release.</p>
 </section>;
}
