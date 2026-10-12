import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {COMMERCIAL_TEMPLATE_0553 as template} from "./commercialWorkbookControl";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";

// Workbook-driven navigation, not an editable BOM and not a released quote.
// The historical Rev08 amounts are source evidence ONLY; never promote them
// to the current customer offer or overwrite the original XLSX.
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
export function BudgetaryWorkbookPreview0553(){
 const [sheet,setSheet]=useState(template.sheets[0].name);
 const active=template.sheets.find(s=>s.name===sheet);
 const lines=active?.kind==="SUMMARY"?REV08_BASELINE.summary:
  REV08_BASELINE.detail[active?.code]||[];
 return <section className="p55-panel" data-component-key="bid.budget.summary.workbook">
   <div className="p55-eyebrow">BUDGETARY SUBMISSION · NATIVE SOURCE WORKBOOK STRUCTURE <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.summary.workbook"/></div>
   <h3>4-Scope of Supply.xlsx · 6 Worksheet Review</h3>
   <p className="p55-note"><strong>PREVIEW OF HISTORICAL REV08 DATA, NOT NEW CUSTOMER PRICE.</strong> Original workbook is the export template. This component currently displays registered historical schedule lines, NOT every native worksheet cell/merged header. Template fidelity, current BOM selling-price mapping and native XLSX export are not implemented yet; release is blocked.</p>
   <div className="p55-filterbar"><label>Original worksheet <select value={sheet} onChange={e=>setSheet(e.target.value)}>{template.sheets.map(s=><option key={s.name} value={s.name}>{s.name}</option>)}</select></label></div>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead>{active?.kind==="SUMMARY"?
    <tr><th>Item code</th><th>Historical customer description</th><th>Historical amount (USD)</th><th>Link status</th></tr>:
    <tr><th>Item</th><th>Historical description</th><th>Qty</th><th>Historical unit price (USD)</th><th>Historical amount (USD)</th></tr>}</thead><tbody>
    {active?.kind==="SUMMARY"?lines.map(([id,label,amount])=><tr key={id}><td>{id}</td><td>{label}</td><td>{money(amount)}</td><td>HISTORICAL — NOT RECONCILED</td></tr>):
     lines.map(([description,qty,rate],i)=><tr key={i}><td>{i+1}</td><td>{description}</td><td>{qty}</td><td>{money(rate)}</td><td>{money(qty*rate)}</td></tr>)}
    {!lines.length&&<tr><td colSpan={5}>No registered historic rows. Native workbook remains controlling source.</td></tr>}
   </tbody></table></div>
   <p className="p55-note">Worksheets: {template.sheets.map(s=>s.name).join(" · ")}. Currency USD. Export: HOLD until verified mapping of canonical BOM → customer lines, complete native-cell presentation, source template preservation, revision/approval gates and cross-sheet reconciliation.</p>
 </section>;
}
