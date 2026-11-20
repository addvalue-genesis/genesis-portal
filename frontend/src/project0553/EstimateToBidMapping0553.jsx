import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {ESTIMATE_TO_BID_0553,validateEstimateToBid0553} from "./estimateToBidMapping";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {selectBcTurnkeyWorkingCost0553} from "./data/bcTurnkeyWorkingCost0553";
import {compareAEquipmentToLocation0553} from "./data/workingBomAggregation0553";
import {selectCustomerEquipmentDisplay0553} from "./data/customerEquipmentDisplay0553";
import {mappingDisplaySummary0553,grossMr0001Bridge0553} from "./data/mappingDisplaySummary0553";

export function EstimateToBidMapping0553(){
 const [open,setOpen]=useState(null);
 const [partFilter,setPartFilter]=useState("ALL");
 const [query,setQuery]=useState("");
 const result=validateEstimateToBid0553();
 const historical=new Map(REV08_BASELINE.summary.map(([code,,value])=>[code,value]));
 const working=new Map(selectBcTurnkeyWorkingCost0553().rows.map(row=>[row.code,row]));
 const equipment=selectCustomerEquipmentDisplay0553();
 const reconciliation=compareAEquipmentToLocation0553();
 const checks=new Map(result.checks.map(x=>[x.customerLine,x]));
 const {shown,cost,sell}=mappingDisplaySummary0553(ESTIMATE_TO_BID_0553.records,equipment,working,{part:partFilter,query});
 const bridge=grossMr0001Bridge0553(equipment);
 const showMoney=x=>Number.isFinite(x)?x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"Not established";
 const price=(amount,currency)=>Number.isFinite(amount)?currency+" "+amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"Not established";
 return <section className="p55-panel" data-component-key="bid.budget.mapping">
  <div className="p55-eyebrow">ESTIMATE → CUSTOMER BID <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.mapping"/></div>
  <h3>Internal Estimate → Customer A/B/C Mapping</h3>
  <p className="p55-note">Mapping targets are based on the existing controlled workbook registry. Internal estimate line allocation, checked quantity, current cost and selling price are NOT established. Historical Rev08 values are not treated as current vendor cost.</p>
  <p className="p55-note"><strong>Part A equipment cost:</strong> uses existing engineering BOM projections in original THB and USD, without an unverified FX conversion. A1–A4 use exactly the same MR/Location row aggregation as System-Location MTO. Verified A5 source-MTO rows are transferred out of displayed A1 THB into A5; the original MR0001 ledger remains unchanged. When transfer fails, A1 equipment-only THB is not established. Part C working cost remains unavailable pending a vendor-priced spare schedule.</p>
  <p className="p55-note"><strong>Price recovery:</strong> Historical Rev08 customer workbook prices and existing ADDVALUE Part B working sell are shown for traceability only. They are NOT current vendor costs, approved selling prices, or proof of allocation. Distinct currencies are never summed.</p>
  <p className="p55-note"><strong>MR ↔ Location reconciliation (same underlying ledger):</strong> {reconciliation.map(r=>r.customerLine+" / "+r.mr+": "+Object.entries(r.currencies).map(([currency,value])=>currency+" "+value.toLocaleString("en-US")).join(" + ")+"; "+r.priced+" counted, "+r.unresolved+" unresolved"+(r.scenario?" [SCENARIO]":"")).join(" · ")}. MR0001 gross includes its original Bulk MTO rows; A1 shown below is net of verified A5 transfer, so compare gross MR0001 against A1 + A5 (by currency), NOT A1 alone. Parity does not certify source completeness.</p>
  <div className="p55-filterbar"><label>Cost Part <select value={partFilter} onChange={e=>setPartFilter(e.target.value)}><option value="ALL">A + B + C (all lines)</option><option value="A">Part A</option><option value="B">Part B</option><option value="C">Part C</option></select></label><label>Search Code / Description <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="A1, B10, C2, system..." /></label><button type="button" onClick={()=>{setPartFilter("ALL");setQuery("");setOpen(null);}}>Reset</button></div>
  <div className="p55-source-facts" data-component-key="bid.budget.mapping.filtered-summary">
   <div><span>Selected view</span><strong>{partFilter==="ALL"?"All A+B+C":("Part "+partFilter)}</strong><small>{shown.length} customer lines{query?" · search filtered":""}</small></div>
   <div><span>Equipment working cost (known THB only)</span><strong>THB {showMoney(cost.THB)}</strong><small>Original USD {showMoney(cost.USD)} · never added without sourced FX</small></div>
   <div><span>ADDVALUE working sell (known THB only)</span><strong>THB {showMoney(sell.THB)}</strong><small>Separate selling basis — NOT added to equipment cost</small></div>
   <div><span>Completeness / release</span><strong>{cost.complete?"Cost lines evidenced":"PARTIAL / NOT RELEASED"}</strong><small>{cost.missing.length} lines without mapped equipment cost · A+B+C not established</small></div>
  </div>
  {(partFilter==="A"||partFilter==="ALL")&&<p className="p55-note" data-component-key="bid.budget.mapping.a1-reconciliation"><strong>MR0001 gross → A1 + A5:</strong> THB {showMoney(bridge.grossTHB)} → THB {showMoney(bridge.allocatedTHB)} · Variance THB {showMoney(bridge.varianceTHB)} · {bridge.status}. The MR0001 gross is equipment/bulk working cost only, NOT full project A+B+C. The 31.5 working FX shown elsewhere is an unverified planning assumption and is not silently applied here.</p>}
  <p className="p55-note"><strong>Coverage:</strong> {shown.length} / {ESTIMATE_TO_BID_0553.records.length} customer lines · A1–A5, B1–B14, C1–C2. Historical prices do not prove a cost owner or complete Stage 01–08.</p>
  <p className="p55-note"><strong>State:</strong> {ESTIMATE_TO_BID_0553.state} · {result.unreconciled} mapping targets require evidence · Customer Release: HOLD</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
   <thead><tr><th>Detail</th><th>Customer line / description</th><th>Workbook sheet</th><th>Source / quantity driver</th><th>Estimate allocation</th><th>Rev08 Historical (USD)</th><th>Equipment Working Cost — THB / USD</th><th>ADDVALUE Working Sell (THB)</th><th>Cost → selling / release status</th></tr></thead>
   <tbody>{shown.map(row=><React.Fragment key={row.id}>
    <tr data-component-key={"bid.budget.mapping."+row.customerLine.toLowerCase()}><td><button type="button" className="p55-row-toggle" onClick={()=>setOpen(open===row.id?null:row.id)} aria-expanded={open===row.id}>{open===row.id?"−":"+"}</button></td><td><strong>{row.customerLine}</strong><small>{row.description}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.mapping."+row.customerLine.toLowerCase()} componentName={row.customerLine+" — "+row.description}/></td><td>{row.customerSheet}</td><td>{row.engineeringSource}<small>{row.quantityDriver}</small></td><td>{row.estimateLineIds.length?"REVIEW ALLOCATION":"UNMAPPED"}<small>{(checks.get(row.customerLine)?.issues||[]).join(" · ")}</small></td><td className="is-number">{price(historical.get(row.customerLine),"USD")}</td><td className="is-number">{equipment[row.customerLine]?<>{equipment[row.customerLine].thb===0?"No separately evidenced THB cost":price(equipment[row.customerLine].thb,"THB")}<small>{equipment[row.customerLine].usd===0?"No separately evidenced USD cost":price(equipment[row.customerLine].usd,"USD")}</small><small>{equipment[row.customerLine].status}</small>{row.customerLine==="A1"&&Number.isFinite(equipment.A1?.grossMrTHB)&&<small>MR0001 gross source: THB {equipment.A1.grossMrTHB.toLocaleString("en-US")} · Verified transfer to A5: {Number.isFinite(equipment.A1.transferredToA5THB)?"THB "+equipment.A1.transferredToA5THB.toLocaleString("en-US"):"NOT VERIFIED"}</small>}</>:"Not established"}</td><td className="is-number">{price(working.get(row.customerLine)?.workingSellTHB,"THB")}</td><td>HOLD — Stage 01–08 / owner allocation / approved sell not fully reconciled</td></tr>
    {open===row.id&&<tr><td></td><td colSpan={8}><strong>{row.id}</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.mapping."+row.customerLine.toLowerCase()+".evidence"} componentName={row.customerLine+" Mapping Evidence"}/><p className="p55-note"><strong>Upstream evidence:</strong> {equipment[row.customerLine]?.source||working.get(row.customerLine)?.sourceRevision||"Customer template / source WBS only"}. <strong>Mapping checks:</strong> {(checks.get(row.customerLine)?.issues||[]).join("; ")}. Stage 01–08 and MAP-01–10 are not certified by historical pricing.</p><p className="p55-note">Required before costing: link accepted estimate line IDs, quantity/units, cost basis, allocation rule, included/excluded scope and approved selling policy. One shared item may allocate across multiple bid lines only with explicit shares; no duplicate costs.</p></td></tr>}
   </React.Fragment>)}</tbody>
  </table></div>
 </section>;
}
