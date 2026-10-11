import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import React,{useState} from "react";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {BULK_TAKEOFF_0553} from "./data/bulkTakeoff0553";
const SHEETS=[
 ["Scope of supply","A/B/C","A1–A5 equipment+bulk, B1–B14 services, C1/C2 options"],
 ["B10 CommSpares","B10","Erection, pre-commissioning, commissioning and start-up spare parts"],
 ["B11 SpecialTool","B11","Special tools"],
 ["B13 Consumerables","B13","Consumables"],
 ["C1 CapitalSpares","C1","Capital spares option"],
 ["C2 2Y-Spares","C2","Two-year operation spares option"]
];
const usd=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"";
export function ScopeSheetsDetail0553(){
 const [sheet,setSheet]=useState("Scope of supply");
 const [showBulk,setShowBulk]=useState(true);
 const category=SHEETS.find(x=>x[0]===sheet);
 const summary=REV08_BASELINE.summary.filter(x=>sheet==="Scope of supply"||x[0]===category[1]);
 const details=REV08_BASELINE.detail[category[1]]||[];
 return <section className="p55-panel">
  <div className="p55-eyebrow">6 ORIGINAL SHEETS <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.scope"/></div>
  <h3>Scope of Supply — Linked Internal Detail</h3>
  <p className="p55-note">Original uploaded workbook has 6 tabs, including unpriced template cells. Historical Rev08 amounts below are kept separate from original cells, current vendor cost and new bid selling price.</p>
  <div className="p55-filterbar"><label>Customer Workbook Sheet <select value={sheet} onChange={e=>setSheet(e.target.value)}>{SHEETS.map(v=><option value={v[0]} key={v[0]}>{v[0]}</option>)}</select></label></div>
  <p className="p55-note">{category[2]}</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Ref.</th><th>Description / Historical Detail</th><th>Qty</th><th>Unit Price USD</th><th>Historical Amount USD</th><th>Source / Gate</th></tr></thead>
  <tbody>{sheet==="Scope of supply"?summary.map(([id,desc,amount])=><tr key={id}><td>{id}</td><td>{desc}</td><td>1 LS (summary)</td><td></td><td className="is-number">{usd(amount)}</td><td>Historical Rev08; reconcile MR/DTS, scope, quantities and vendor terms</td></tr>):
   details.map(([desc,qty,price],i)=><tr key={i}><td>{category[1]}-{i+1}</td><td>{desc}</td><td>{qty}</td><td className="is-number">{usd(price)}</td><td className="is-number">{usd(qty*price)}</td><td>Historical Rev08 detail, not a current supplier quotation</td></tr>)}
  </tbody></table></div>
  {sheet==="Scope of supply"&&<><button type="button" className="p553-detail-button" onClick={()=>setShowBulk(v=>!v)}>{showBulk?"− Hide":"＋ Show"} Engineering Bulk / Enclosures / JB / Licences</button>
  {showBulk&&<div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>MR</th><th>Category</th><th>Engineering Required Item</th><th>Quantity Driver & Evidence</th><th>New Qty / Unit Cost</th></tr></thead><tbody>
  {BULK_TAKEOFF_0553.map((r,i)=><tr key={i}><td>{r.mr}</td><td>{r.category}</td><td>{r.item}<small>{r.note}</small></td><td>{r.driver}<small>{r.source}</small></td><td>{r.qty===null?"":r.qty} / {r.rate===null?"":r.rate}</td></tr>)}
  </tbody></table></div>}</>}
  <p className="p55-note">Do not auto-add historical Rev08 summaries to quotation line costs, options or derived bulk. Zero-price lines and blanks in source are not accepted prices without review. Each sheet must pass Modules 01–08 before new costing/release.</p>
 </section>;
}
