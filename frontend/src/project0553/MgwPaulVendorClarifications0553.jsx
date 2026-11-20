import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {MGW_PAUL_EMAIL_CLARIFICATIONS_0553 as evidence} from "./data/mgwPaulEmailClarifications0553";

export function MgwPaulVendorClarifications0553({code}){
 const matched=evidence.rows.filter(r=>r.owner===code);
 const extras=evidence.additionalSpareOwners.filter(r=>r.owner===code);
 if(!matched.length&&!extras.length)return null;
 return <section className="p55-panel" data-component-key={"bid.budget.working.bc."+code.toLowerCase()+".mgw-email-clarifications"}
  style={{padding:12,marginTop:12}}>
  <h4>MGW Paul Email — 20-Oct-2026 / Supplier Scope Clarification</h4>
  <p className="p55-note"><strong>Source:</strong> {evidence.source}.
   Supplier statements only, separate from priced P26-058_R2 PDF; <strong>no new cost posting or Working SELL change</strong>.
   <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.working.bc."+code.toLowerCase()+".mgw-email-clarifications"}/>
  </p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Module / Email Item</th><th>Supplier statement or requested BOM</th><th>Supplier-evidence status</th><th>Remaining gate / Owner</th></tr></thead>
   <tbody>{matched.map(r=><tr key={r.id} data-component-key={r.moduleId}>
    <td><strong>Item {r.emailItem} · {r.id}</strong>
     <ComponentCopyId projectId="PJ2608-0553" componentKey={r.moduleId}/></td>
    <td>{r.statement}{r.id==="ROAD-FREIGHT"&&<small><strong>Quoted ROAD FREIGHT USD {evidence.pricedVendorFreight.usd.toLocaleString("en-US")}</strong> · Nantong → JUTAL site · quotation scope verification OPEN; NOT B6 Working SELL</small>}</td>
    <td><strong>{r.status}</strong><small>Current Direct COST: NOT ESTABLISHED</small></td>
    <td>{r.verificationGate}</td>
   </tr>)}
   {extras.map(r=><tr key={r.id} data-component-key={r.moduleId}>
    <td><strong>Email item {r.sourceItem} · {r.id}</strong>
     <ComponentCopyId projectId="PJ2608-0553" componentKey={r.moduleId}/></td>
    <td>{r.expected}</td><td><strong>{r.status}</strong></td>
    <td>John/MGW itemized OEM SKU, TAG, quantity and supplied-vs-extra price. No automatic deduction or zero-cost assumption.</td>
   </tr>)}</tbody>
  </table></div>
  {code==="B6"&&<p className="p55-note"><strong>Freight / duty hold:</strong> MGW email USD 2,500 road transport is also listed ONCE as SERV-5 in the 20-Oct-2026 P26-058_R2 Cover USD 368,841; do not add it again. JUTAL receiving site, final transport legs to Myanmar, export/customs, VAT, insurance and DDP responsibility are unverified. Seller's Myanmar offshore zero-rated duty assertion is NOT an official customs ruling.</p>}
  {["B10","B11","C2"].includes(code)&&<p className="p55-note"><strong>Spares/Tools gate:</strong> MGW says items will be included; the OEM two-year spare list, commissioning spares and special tools remain unitemized. Do NOT double-book the vendor-inclusive scope or erase existing budget before receiving detailed SPIR/quote revision.</p>}
 </section>;
}
