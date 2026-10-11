import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {ESTIMATE_TO_BID_0553,validateEstimateToBid0553} from "./estimateToBidMapping";
export function EstimateToBidMapping0553(){
 const [open,setOpen]=useState(null);
 const result=validateEstimateToBid0553();
 return <section className="p55-panel" data-component-key="bid.budget.mapping">
  <div className="p55-eyebrow">ESTIMATE → CUSTOMER BID <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.mapping"/></div>
  <h3>Internal Estimate → Customer A/B/C Mapping</h3>
  <p className="p55-note">Mapping targets are based on the existing controlled workbook registry. Internal estimate line allocation, checked quantity, current cost and selling price are NOT established. Historical Rev08 values are not treated as current vendor cost.</p>
  <p className="p55-note"><strong>State:</strong> {ESTIMATE_TO_BID_0553.state} · {result.unreconciled} mapping targets require evidence · Customer Release: HOLD</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
   <thead><tr><th>Detail</th><th>Customer line</th><th>Workbook sheet</th><th>Source / quantity driver</th><th>Estimate allocation</th><th>Cost → selling</th></tr></thead>
   <tbody>{ESTIMATE_TO_BID_0553.records.map(row=><React.Fragment key={row.id}>
    <tr><td><button type="button" className="p55-row-toggle" onClick={()=>setOpen(open===row.id?null:row.id)} aria-expanded={open===row.id}>{open===row.id?"−":"+"}</button></td><td><strong>{row.customerLine}</strong></td><td>{row.customerSheet}</td><td>{row.engineeringSource}<small>{row.quantityDriver}</small></td><td>UNMAPPED</td><td>HOLD — NO VERIFIED PRICE</td></tr>
    {open===row.id&&<tr><td></td><td colSpan={5}><strong>{row.id}</strong><p className="p55-note">Required before costing: link accepted estimate line IDs, quantity/units, cost basis, allocation rule, included/excluded scope and approved selling policy. One shared item may allocate across multiple bid lines only with explicit shares; no duplicate costs.</p></td></tr>}
   </React.Fragment>)}</tbody>
  </table></div>
 </section>;
}
