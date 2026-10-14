import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {ESTIMATE_TO_BID_0553,validateEstimateToBid0553} from "./estimateToBidMapping";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {derivePartBcWorkingWbs0553} from "./data/partBCWorkingWbs0553";
export function EstimateToBidMapping0553(){
 const [open,setOpen]=useState(null);
 const result=validateEstimateToBid0553();
 const historical=new Map(REV08_BASELINE.summary.map(([code,,value])=>[code,value]));
 const working=new Map(derivePartBcWorkingWbs0553().rows.map(row=>[row.code,row]));
 const price=(amount,currency)=>Number.isFinite(amount)?currency+" "+amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"Not established";
 return <section className="p55-panel" data-component-key="bid.budget.mapping">
  <div className="p55-eyebrow">ESTIMATE → CUSTOMER BID <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.mapping"/></div>
  <h3>Internal Estimate → Customer A/B/C Mapping</h3>
  <p className="p55-note">Mapping targets are based on the existing controlled workbook registry. Internal estimate line allocation, checked quantity, current cost and selling price are NOT established. Historical Rev08 values are not treated as current vendor cost.</p>
  <p className="p55-note"><strong>Price recovery:</strong> Historical Rev08 customer workbook prices and existing ADDVALUE Part B working sell are shown for traceability only. They are NOT current vendor costs, approved selling prices, or proof of allocation. Distinct currencies are never summed.</p>
  <p className="p55-note"><strong>State:</strong> {ESTIMATE_TO_BID_0553.state} · {result.unreconciled} mapping targets require evidence · Customer Release: HOLD</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
   <thead><tr><th>Detail</th><th>Customer line</th><th>Workbook sheet</th><th>Source / quantity driver</th><th>Estimate allocation</th><th>Rev08 Historical (USD)</th><th>ADDVALUE Working Sell (THB)</th><th>Cost → selling / release status</th></tr></thead>
   <tbody>{ESTIMATE_TO_BID_0553.records.map(row=><React.Fragment key={row.id}>
    <tr><td><button type="button" className="p55-row-toggle" onClick={()=>setOpen(open===row.id?null:row.id)} aria-expanded={open===row.id}>{open===row.id?"−":"+"}</button></td><td><strong>{row.customerLine}</strong></td><td>{row.customerSheet}</td><td>{row.engineeringSource}<small>{row.quantityDriver}</small></td><td>{row.estimateLineIds.length?"REVIEW ALLOCATION":"UNMAPPED"}</td><td className="is-number">{price(historical.get(row.customerLine),"USD")}</td><td className="is-number">{price(working.get(row.customerLine)?.sellTHB,"THB")}</td><td>HOLD — current vendor cost / approved customer sell not reconciled</td></tr>
    {open===row.id&&<tr><td></td><td colSpan={7}><strong>{row.id}</strong><p className="p55-note">Required before costing: link accepted estimate line IDs, quantity/units, cost basis, allocation rule, included/excluded scope and approved selling policy. One shared item may allocate across multiple bid lines only with explicit shares; no duplicate costs.</p></td></tr>}
   </React.Fragment>)}</tbody>
  </table></div>
 </section>;
}
