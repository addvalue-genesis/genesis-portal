import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {ESTIMATE_TO_BID_0553,validateEstimateToBid0553} from "./estimateToBidMapping";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {derivePartBcWorkingWbs0553} from "./data/partBCWorkingWbs0553";
import {compareAEquipmentToLocation0553} from "./data/workingBomAggregation0553";
import {selectCustomerEquipmentDisplay0553} from "./data/customerEquipmentDisplay0553";

export function EstimateToBidMapping0553(){
 const [open,setOpen]=useState(null);
 const [partFilter,setPartFilter]=useState("ALL");
 const [query,setQuery]=useState("");
 const result=validateEstimateToBid0553();
 const historical=new Map(REV08_BASELINE.summary.map(([code,,value])=>[code,value]));
 const working=new Map(derivePartBcWorkingWbs0553().rows.map(row=>[row.code,row]));
 const equipment=selectCustomerEquipmentDisplay0553();
 const reconciliation=compareAEquipmentToLocation0553();
 const checks=new Map(result.checks.map(x=>[x.customerLine,x]));
 const shown=ESTIMATE_TO_BID_0553.records.filter(x=>(partFilter==="ALL"||x.customerLine.startsWith(partFilter))&&(!query||[x.customerLine,x.description,x.engineeringSource,x.customerSheet].some(v=>String(v||"").toLowerCase().includes(query.trim().toLowerCase()))));
 const price=(amount,currency)=>Number.isFinite(amount)?currency+" "+amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"Not established";
 return <section className="p55-panel" data-component-key="bid.budget.mapping">
  <div className="p55-eyebrow">ESTIMATE → CUSTOMER BID <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.mapping"/></div>
  <h3>Internal Estimate → Customer A/B/C Mapping</h3>
  <p className="p55-note">Mapping targets are based on the existing controlled workbook registry. Internal estimate line allocation, checked quantity, current cost and selling price are NOT established. Historical Rev08 values are not treated as current vendor cost.</p>
  <p className="p55-note"><strong>Part A equipment cost:</strong> uses existing engineering BOM projections in original THB and USD, without an unverified FX conversion. A1–A4 use exactly the same MR/Location row aggregation as System-Location MTO. A5 is an overlapping attribution reference until item-level ownership is established; it is NOT added or blindly deducted. Part C working cost remains unavailable pending a vendor-priced spare schedule.</p>
  <p className="p55-note"><strong>Price recovery:</strong> Historical Rev08 customer workbook prices and existing ADDVALUE Part B working sell are shown for traceability only. They are NOT current vendor costs, approved selling prices, or proof of allocation. Distinct currencies are never summed.</p>
  <p className="p55-note"><strong>MR ↔ Location reconciliation (same underlying ledger):</strong> {reconciliation.map(r=>r.customerLine+" / "+r.mr+": "+Object.entries(r.currencies).map(([currency,value])=>currency+" "+value.toLocaleString("en-US")).join(" + ")+"; "+r.priced+" counted, "+r.unresolved+" unresolved"+(r.scenario?" [SCENARIO]":"")).join(" · ")}. Parity of the shared projection does not certify correctness of source evidence or A5 classification.</p>
  <div className="p55-filterbar"><label>Cost Part <select value={partFilter} onChange={e=>setPartFilter(e.target.value)}><option value="ALL">A + B + C (all lines)</option><option value="A">Part A</option><option value="B">Part B</option><option value="C">Part C</option></select></label><label>Search Code / Description <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="A1, B10, C2, system..." /></label><button type="button" onClick={()=>{setPartFilter("ALL");setQuery("");setOpen(null);}}>Reset</button></div>
  <p className="p55-note"><strong>Coverage:</strong> {shown.length} / {ESTIMATE_TO_BID_0553.records.length} customer lines · A1–A5, B1–B14, C1–C2. Historical prices do not prove a cost owner or complete Stage 01–08.</p>
  <p className="p55-note"><strong>State:</strong> {ESTIMATE_TO_BID_0553.state} · {result.unreconciled} mapping targets require evidence · Customer Release: HOLD</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
   <thead><tr><th>Detail</th><th>Customer line / description</th><th>Workbook sheet</th><th>Source / quantity driver</th><th>Estimate allocation</th><th>Rev08 Historical (USD)</th><th>Equipment Working Cost — THB / USD</th><th>ADDVALUE Working Sell (THB)</th><th>Cost → selling / release status</th></tr></thead>
   <tbody>{shown.map(row=><React.Fragment key={row.id}>
    <tr data-component-key={"bid.budget.mapping."+row.customerLine.toLowerCase()}><td><button type="button" className="p55-row-toggle" onClick={()=>setOpen(open===row.id?null:row.id)} aria-expanded={open===row.id}>{open===row.id?"−":"+"}</button></td><td><strong>{row.customerLine}</strong><small>{row.description}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.mapping."+row.customerLine.toLowerCase()} componentName={row.customerLine+" — "+row.description}/></td><td>{row.customerSheet}</td><td>{row.engineeringSource}<small>{row.quantityDriver}</small></td><td>{row.estimateLineIds.length?"REVIEW ALLOCATION":"UNMAPPED"}<small>{(checks.get(row.customerLine)?.issues||[]).join(" · ")}</small></td><td className="is-number">{price(historical.get(row.customerLine),"USD")}</td><td className="is-number">{equipment[row.customerLine]?<>{equipment[row.customerLine].thb===0?"No separately evidenced THB cost":price(equipment[row.customerLine].thb,"THB")}<small>{equipment[row.customerLine].usd===0?"No separately evidenced USD cost":price(equipment[row.customerLine].usd,"USD")}</small><small>{equipment[row.customerLine].status}</small></>:"Not established"}</td><td className="is-number">{price(working.get(row.customerLine)?.sellTHB,"THB")}</td><td>HOLD — Stage 01–08 / owner allocation / approved sell not fully reconciled</td></tr>
    {open===row.id&&<tr><td></td><td colSpan={8}><strong>{row.id}</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.mapping."+row.customerLine.toLowerCase()+".evidence"} componentName={row.customerLine+" Mapping Evidence"}/><p className="p55-note"><strong>Upstream evidence:</strong> {equipment[row.customerLine]?.source||working.get(row.customerLine)?.source||"Customer template / source WBS only"}. <strong>Mapping checks:</strong> {(checks.get(row.customerLine)?.issues||[]).join("; ")}. Stage 01–08 and MAP-01–10 are not certified by historical pricing.</p><p className="p55-note">Required before costing: link accepted estimate line IDs, quantity/units, cost basis, allocation rule, included/excluded scope and approved selling policy. One shared item may allocate across multiple bid lines only with explicit shares; no duplicate costs.</p></td></tr>}
   </React.Fragment>)}</tbody>
  </table></div>
 </section>;
}
