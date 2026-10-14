import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {ESTIMATE_TO_BID_0553,validateEstimateToBid0553} from "./estimateToBidMapping";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {derivePartBcWorkingWbs0553} from "./data/partBCWorkingWbs0553";
import {deriveScadaBudgetEnvelope0553} from "./data/scadaBudgetEnvelope0553";
import {deriveA5BulkAttribution0553} from "./data/a5BulkAttribution0553";
import {MR0002_WORKING_BOM_0553} from "./data/mr0002WorkingBom0553";
import {MR0004_WORKING_BOM_0553} from "./data/mr0004WorkingBom0553";
import {SITE_SYSTEM_COST_RECONCILIATION_0553} from "./data/siteSystemCostReconciliation";

const round=n=>Math.round(n*100)/100;
// Projection of upstream evidence only. Currency is never converted using an assumed FX.
function projectEquipmentWorkingCost0553(){
 const envelope=deriveScadaBudgetEnvelope0553();
 const attribution=deriveA5BulkAttribution0553();
 const grossTHB=round(envelope.locations.reduce((n,x)=>n+x.baseSourceTHB,0));
 const grossUSD=round(envelope.locations.reduce((n,x)=>n+x.baseSourceUSD,0));
 const a5=Number.isFinite(attribution.a5PriceTHB)?attribution.a5PriceTHB:null;
 const mr2=MR0002_WORKING_BOM_0553.sites.flatMap(x=>x.items).filter(x=>x.countedInWorkingTotal&&Number.isFinite(x.extended)&&x.source!=="MGW-P26-058"&&!String(x.owner||"").startsWith("MGW_"));
 const mr3=SITE_SYSTEM_COST_RECONCILIATION_0553.rows.filter(x=>x.mr==="MR-0003"&&["ZWP20","ZWP21","ZWP22"].includes(x.site))
  .flatMap(x=>x.evidence||[]).filter(x=>["PHONE-1","SOUNDER-1","JB-1"].includes(x.line)&&x.currency==="THB"&&Number.isFinite(x.extended));
 const mr4=MR0004_WORKING_BOM_0553.sites.reduce((n,x)=>n+x.controlledTotalUSD,0);
 return {
  A1:{thb:a5!==null?round(grossTHB-a5):grossTHB,usd:grossUSD,status:a5!==null?"Partial ledger, A5 bulk reclassified":"A5 reclassification unverified; A1 includes bulk",source:"MR0001 source TAG ledger / SCADA envelope"},
  A2:{thb:round(mr2.filter(x=>x.currency==="THB").reduce((n,x)=>n+x.extended,0)),usd:round(mr2.filter(x=>x.currency==="USD").reduce((n,x)=>n+x.extended,0)),status:"Partial, MGW rates excluded; NOT full DMR",source:"MR0002 working BOM eligible items"},
  A3:{thb:mr3.length===9?round(mr3.reduce((n,x)=>n+x.extended,0)):null,usd:null,status:"3-site floor only; 4th phone set unallocated / JB requote",source:"MR0003 phone/sounder/JB evidence"},
  A4:{thb:null,usd:round(mr4),status:"Provisional three-site ORGA scenario",source:"MR0004 canonical ORGA working BOM"},
  A5:{thb:a5,usd:null,status:a5!==null?"Source-ledger bulk reclassification (not additive)":"Bulk attribution requires reconciliation",source:"A5 source-MTO bulk attribution"}
 };
}
export function EstimateToBidMapping0553(){
 const [open,setOpen]=useState(null);
 const [partFilter,setPartFilter]=useState("ALL");
 const [query,setQuery]=useState("");
 const result=validateEstimateToBid0553();
 const historical=new Map(REV08_BASELINE.summary.map(([code,,value])=>[code,value]));
 const working=new Map(derivePartBcWorkingWbs0553().rows.map(row=>[row.code,row]));
 const equipment=projectEquipmentWorkingCost0553();
 const checks=new Map(result.checks.map(x=>[x.customerLine,x]));
 const shown=ESTIMATE_TO_BID_0553.records.filter(x=>(partFilter==="ALL"||x.customerLine.startsWith(partFilter))&&(!query||[x.customerLine,x.description,x.engineeringSource,x.customerSheet].some(v=>String(v||"").toLowerCase().includes(query.trim().toLowerCase()))));
 const price=(amount,currency)=>Number.isFinite(amount)?currency+" "+amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"Not established";
 return <section className="p55-panel" data-component-key="bid.budget.mapping">
  <div className="p55-eyebrow">ESTIMATE → CUSTOMER BID <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.mapping"/></div>
  <h3>Internal Estimate → Customer A/B/C Mapping</h3>
  <p className="p55-note">Mapping targets are based on the existing controlled workbook registry. Internal estimate line allocation, checked quantity, current cost and selling price are NOT established. Historical Rev08 values are not treated as current vendor cost.</p>
  <p className="p55-note"><strong>Part A equipment cost:</strong> uses existing engineering BOM projections in original THB and USD, without an unverified FX conversion. A5 attribution is deducted from A1 where verified; never add scenario estimates twice. Part C working cost remains unavailable pending a vendor-priced spare schedule.</p>
  <p className="p55-note"><strong>Price recovery:</strong> Historical Rev08 customer workbook prices and existing ADDVALUE Part B working sell are shown for traceability only. They are NOT current vendor costs, approved selling prices, or proof of allocation. Distinct currencies are never summed.</p>
  <div className="p55-filterbar"><label>Cost Part <select value={partFilter} onChange={e=>setPartFilter(e.target.value)}><option value="ALL">A + B + C (all lines)</option><option value="A">Part A</option><option value="B">Part B</option><option value="C">Part C</option></select></label><label>Search Code / Description <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="A1, B10, C2, system..." /></label><button type="button" onClick={()=>{setPartFilter("ALL");setQuery("");setOpen(null);}}>Reset</button></div>
  <p className="p55-note"><strong>Coverage:</strong> {shown.length} / {ESTIMATE_TO_BID_0553.records.length} customer lines · A1–A5, B1–B14, C1–C2. Historical prices do not prove a cost owner or complete Stage 01–08.</p>
  <p className="p55-note"><strong>State:</strong> {ESTIMATE_TO_BID_0553.state} · {result.unreconciled} mapping targets require evidence · Customer Release: HOLD</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
   <thead><tr><th>Detail</th><th>Customer line / description</th><th>Workbook sheet</th><th>Source / quantity driver</th><th>Estimate allocation</th><th>Rev08 Historical (USD)</th><th>Equipment Working Cost — THB / USD</th><th>ADDVALUE Working Sell (THB)</th><th>Cost → selling / release status</th></tr></thead>
   <tbody>{shown.map(row=><React.Fragment key={row.id}>
    <tr><td><button type="button" className="p55-row-toggle" onClick={()=>setOpen(open===row.id?null:row.id)} aria-expanded={open===row.id}>{open===row.id?"−":"+"}</button></td><td><strong>{row.customerLine}</strong><small>{row.description}</small></td><td>{row.customerSheet}</td><td>{row.engineeringSource}<small>{row.quantityDriver}</small></td><td>{row.estimateLineIds.length?"REVIEW ALLOCATION":"UNMAPPED"}<small>{(checks.get(row.customerLine)?.issues||[]).join(" · ")}</small></td><td className="is-number">{price(historical.get(row.customerLine),"USD")}</td><td className="is-number">{equipment[row.customerLine]?<>{equipment[row.customerLine].thb===0?"No separately evidenced THB cost":price(equipment[row.customerLine].thb,"THB")}<small>{equipment[row.customerLine].usd===0?"No separately evidenced USD cost":price(equipment[row.customerLine].usd,"USD")}</small><small>{equipment[row.customerLine].status}</small></>:"Not established"}</td><td className="is-number">{price(working.get(row.customerLine)?.sellTHB,"THB")}</td><td>HOLD — Stage 01–08 / owner allocation / approved sell not fully reconciled</td></tr>
    {open===row.id&&<tr><td></td><td colSpan={8}><strong>{row.id}</strong><p className="p55-note"><strong>Upstream evidence:</strong> {equipment[row.customerLine]?.source||working.get(row.customerLine)?.source||"Customer template / source WBS only"}. <strong>Mapping checks:</strong> {(checks.get(row.customerLine)?.issues||[]).join("; ")}. Stage 01–08 and MAP-01–10 are not certified by historical pricing.</p><p className="p55-note">Required before costing: link accepted estimate line IDs, quantity/units, cost basis, allocation rule, included/excluded scope and approved selling policy. One shared item may allocate across multiple bid lines only with explicit shares; no duplicate costs.</p></td></tr>}
   </React.Fragment>)}</tbody>
  </table></div>
 </section>;
}
