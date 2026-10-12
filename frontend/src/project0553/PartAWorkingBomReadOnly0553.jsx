import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {BOM_READ_MODEL_0553,bomItems0553,bomCurrencySubtotals0553} from "./data/bomReadModel0553";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT PRICED";
export function PartAWorkingBomReadOnly0553(){
 const [showInternalCost,setShowInternalCost]=useState(false);
 const siteRows=BOM_READ_MODEL_0553.rows.filter(r=>bomItems0553(r).length);
 const totals=bomCurrencySubtotals0553(siteRows);
 return <div className="p55-panel" data-component-key="bid.budget.summary.workbook.scope-of-supply.part_a.bom-detail">
  <h4>Part A — BOM Working Detail <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.summary.workbook.scope-of-supply.part_a.bom-detail"/></h4>
  <p className="p55-note"><strong>Source:</strong> bid.budget.bom → ZWP20 detailed cost derivation → shared read-only model. Quantities below are MTO scope quantities (Set is NOT a physical SKU count). Current customer selling prices are NOT approved or mapped. This is an internal review panel only, not customer release.</p>
  <label><input type="checkbox" checked={showInternalCost} onChange={e=>setShowInternalCost(e.target.checked)}/> Show internal working cost (confidential — never included in customer export)</label>
  {showInternalCost&&<p className="p55-note"><strong>Partial working cost subtotals, by original currency:</strong> {totals.map(t=>t.currency+" "+money(t.amount)).join(" · ")||"NO COSTED LINES"}. These are not customer sell totals, and include only costed scope for the detailed ledgers.</p>}
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>MR</th><th>Location</th><th>MTO Row</th><th>Tag</th><th>Equipment / Description</th><th>MTO Qty</th><th>Unit</th><th>Original Currency</th>{showInternalCost&&<><th>Working Unit Cost</th><th>Working Line Cost</th></>}<th>Customer Sell</th><th>Status</th><th>Copy Module</th></tr></thead>
   <tbody>{siteRows.flatMap(r=>bomItems0553(r).map((item,i)=><tr key={r.mr+":"+r.site+":"+(item.id||i)}>
    <td>{r.mr}</td><td>{r.site}</td><td>{item.row??"—"}</td><td>{item.tag||"—"}</td><td>{item.description}</td>
    <td>{item.sourceQty??"UNKNOWN"}</td><td>{item.sourceUnit||"—"}</td><td>{item.currency||"—"}</td>
    {showInternalCost&&<><td>{money(item.unitCost)}</td><td>{money(item.extended)}</td></>}
    <td>NOT APPROVED</td><td>{item.status||"WORKING"}</td>
    <td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+r.site.toLowerCase()+"."+(item.tag||item.id||"row-"+i).toLowerCase().replace(/[^a-z0-9-]/g,"-")}/></td>
   </tr>))}
   {!siteRows.length&&<tr><td colSpan={showInternalCost?13:11}>No detailed BOM source rows available.</td></tr>}
   </tbody></table></div>
  <p className="p55-note">Working costs are projected without recalculating or currency conversion. Missing/partial rates remain NOT PRICED. Other MR/location quotation-only allocations are not approved physical BOM; selling prices require the commercial mapping and release gate.</p>
 </div>;
}