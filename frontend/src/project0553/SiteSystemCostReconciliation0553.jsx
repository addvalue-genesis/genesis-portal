import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {SITE_SYSTEM_COST_RECONCILIATION_0553 as data} from "./data/siteSystemCostReconciliation";
const fmt=n=>n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
export function SiteSystemCostReconciliation0553(){
 const [expanded,setExpanded]=useState({});
 const [site,setSite]=useState("ALL");
 const rows=data.rows.filter(r=>site==="ALL"||r.site===site);
 return <section className="p55-panel" data-component-key="bid.budget.bom.reconciliation">
  <h3>Site × MR Budgetary Cost Reconciliation <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.reconciliation"/></h3>
  <p className="p55-note"><strong>Source-based provisional prices — not verified site totals or customer sell.</strong> Cisco is THB, MGW and Next G are USD. MGW's three units are tentatively allocated one per ZWP20/ZWP21/ZWP22 (not a verified site allocation). Next G USD {fmt(data.nextGQuoteUSD)} is a whole-offer amount and remains unallocated.</p>
  <div className="p55-filterbar"><label>Location <select value={site} onChange={e=>setSite(e.target.value)}><option value="ALL">All locations</option>{data.sites.map(x=><option key={x} value={x}>{x}</option>)}</select></label></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget"><thead><tr><th>+</th><th>Location</th><th>System</th><th>Quoted provisional subtotal (original currency)</th><th>Completeness / outstanding costs</th><th>Verified location cost</th><th>Copy ID</th></tr></thead><tbody>
   {rows.map(r=><React.Fragment key={r.site+r.mr}>
    <tr><td><button type="button" className="p55-row-toggle" onClick={()=>setExpanded(old=>({...old,[r.site+r.mr]:!old[r.site+r.mr]}))}>{expanded[r.site+r.mr]?"−":"+"}</button></td>
     <td><strong>{r.site}</strong></td><td>{r.mr}<small>{r.name}</small></td>
     <td>{r.subtotals.length?r.subtotals.map(t=><div key={t.currency}><strong>{t.currency} {fmt(t.amount)}</strong><small>Partial, source-derived; scope exclusions apply</small></div>):"NO SITE PRICE ALLOCATED"}</td>
     <td>PARTIAL — BUDGETARY ONLY<small>{r.gaps.join(" · ")}</small></td><td>NOT ESTABLISHED</td>
     <td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+r.site.toLowerCase()+"."+r.mr.toLowerCase().replace("-","")+".cost"}/></td></tr>
    {expanded[r.site+r.mr]&&<tr><td colSpan={7}><table className="p55-table p55-table--compact"><thead><tr><th>Source</th><th>Quote line</th><th>Description</th><th>Whole quote Qty</th><th>Assumed site Qty</th><th>Source unit price</th><th>Assumed site amount</th><th>Basis</th></tr></thead><tbody>
     {r.evidence.map((e,i)=><tr key={e.source+e.line+i}><td>{e.source}</td><td>{e.line}</td><td>{e.description}</td><td>{e.sourceQty}</td><td>{e.assumedQty}</td><td>{e.currency} {fmt(e.unit)}</td><td>{e.currency} {fmt(e.extended)}</td><td>{e.kind}</td></tr>)}
     {!r.evidence.length&&<tr><td colSpan={8}>No site-specific source allocation is supported yet — not zero cost.</td></tr>}
    </tbody></table><p className="p55-note">Gaps: {r.gaps.join("; ")}. Source basis: {r.sourceNote}. These scenarios cannot be promoted to verified project costs.</p></td></tr>}
   </React.Fragment>)}
  </tbody></table></div>
  <p className="p55-note"><strong>Shared/unallocated costs:</strong> MGW Engineering + FAT + Packing USD {fmt(data.mgwSharedUSD)} (count once across project; not included in rows). MGW quoted equipment subtotal USD {fmt(data.mgwProductQuotedUSD)}; source total USD {fmt(data.mgwQuoteUSD)}. Next G USD {fmt(data.nextGQuoteUSD)} not yet allocated by link/site. Missing bulk, installation, RFI LNA, services, risk and currency conversion must be derived before A+B+C total.</p>
 </section>;
}