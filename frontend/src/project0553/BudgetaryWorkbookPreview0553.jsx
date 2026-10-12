import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {COMMERCIAL_TEMPLATE_0553 as template} from "./commercialWorkbookControl";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {OFFICIAL_WORKBOOK_TEMPLATE_0553} from "./data/officialWorkbookTemplate0553";

// Workbook-driven navigation, not an editable BOM and not a released quote.
// The historical Rev08 amounts are source evidence ONLY; never promote them
// to the current customer offer or overwrite the original XLSX.
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
export function BudgetaryWorkbookPreview0553(){
 const [sheet,setSheet]=useState(template.sheets[0].name);
 const [showHistorical,setShowHistorical]=useState(true);
 const [currency,setCurrency]=useState("USD");
 const [fx,setFx]=useState({THB:"31.5",CNY:""});
 const [fxDate,setFxDate]=useState("2026-10-12");
 const [fxSource,setFxSource]=useState("MANAGEMENT WORKING BUDGET FX — NOT BOT VERIFIED");
 const rate=currency==="USD"?1:Number(fx[currency]);
 const fxReady=currency==="USD"||(fx[currency]!==""&&Number.isFinite(rate)&&rate>0&&fxDate.trim()&&fxSource.trim());
 const converted=n=>fxReady?money(n*rate):"—";
 const active=template.sheets.find(s=>s.name===sheet);
 const layout=OFFICIAL_WORKBOOK_TEMPLATE_0553.sheets.find(s=>s.name===sheet);
 const lines=active?.kind==="SUMMARY"?REV08_BASELINE.summary:
  REV08_BASELINE.detail[active?.code]||[];
 return <section className="p55-panel" data-component-key="bid.budget.summary.workbook">
   <div className="p55-eyebrow">BUDGETARY SUBMISSION · NATIVE SOURCE WORKBOOK STRUCTURE <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.summary.workbook"/></div>
   <h3>4-Scope of Supply.xlsx · 6 Worksheet Review</h3>
   <p className="p55-note"><strong>TEMPLATE GRID PREVIEW, NOT NEW CUSTOMER PRICE.</strong> Original workbook is the export template. This component renders the original worksheet dimensions and a source-transcribed subset of cell labels, preserving empty rows; full exact-cell fidelity is still pending. Template fidelity, current BOM selling-price mapping and native XLSX export are not implemented yet; release is blocked.</p>
   <div className="p55-filterbar">
    <label>Display currency <select value={currency} onChange={e=>setCurrency(e.target.value)}><option value="USD">USD — original Rev08</option><option value="THB">THB — Thai baht</option><option value="CNY">CNY — Chinese yuan (RMB)</option></select></label>
    {currency!=="USD"&&<label>1 USD = <input type="number" min="0" step="any" placeholder={"Verified "+currency+" per USD"} value={fx[currency]} onChange={e=>setFx(s=>({...s,[currency]:e.target.value}))}/> {currency}</label>}
    {currency!=="USD"&&<label>FX date <input type="date" value={fxDate} onChange={e=>setFxDate(e.target.value)}/></label>}
    {currency!=="USD"&&<label>FX source <input value={fxSource} onChange={e=>setFxSource(e.target.value)} placeholder="Source/reference"/></label>}
    <label>Original worksheet <select value={sheet} onChange={e=>setSheet(e.target.value)}>{template.sheets.map(s=><option key={s.name} value={s.name}>{s.name}</option>)}</select></label></div>
   <p className="p55-note"><strong>Currency: {currency}</strong> · {currency==="USD"?"Historical source values in original USD; no conversion.":fxReady?"Indicative converted display only, using user-entered "+rate+" "+currency+"/USD on "+fxDate+" · Source: "+fxSource+". Not a verified or approved customer rate.":"Conversion unavailable: enter rate, date and source. USD source amounts are retained unchanged; no implied FX."}</p>
   <label><input type="checkbox" checked={showHistorical} onChange={e=>setShowHistorical(e.target.checked)}/> Show historical Rev08 price comparison (not current bid)</label>
   <p className="p55-note"><strong>Original worksheet cell layout:</strong> {layout.columns} columns × {layout.maxRow} rows. Blank cells are preserved; historically labelled cells are reference only. Current BOM-derived customer selling prices are not approved and remain blank.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
    <thead><tr><th>Row</th>{Array.from({length:layout.columns},(_,i)=><th key={i}>{String.fromCharCode(65+i)}</th>)}</tr></thead>
    <tbody>{Array.from({length:layout.maxRow},(_,i)=>i+1).map(rowNum=>{
     const row=layout.rows.find(r=>r[0]===rowNum)||[rowNum];
     return <tr key={rowNum}><td><strong>{rowNum}</strong></td>{Array.from({length:layout.columns},(_,col)=><td key={col} style={{whiteSpace:"pre-wrap",minWidth:col===0?65:95}}>{row[col+1]??""}</td>)}</tr>;
    })}</tbody>
   </table></div>
   {showHistorical&&<div className="p55-table-wrap"><h4>Historical Rev08 · Price Reference (NOT current customer sell)</h4>
    <table className="p55-table p55-table--budget"><thead><tr><th>Item</th><th>Description</th>{active?.kind!=="SUMMARY"&&<th>Qty</th>}<th>Unit ({currency})</th><th>Amount ({currency})</th></tr></thead><tbody>
     {active?.kind==="SUMMARY"?lines.map(([id,label,amount])=><tr key={id}><td>{id}</td><td>{label}</td><td>—</td><td>{converted(amount)}</td></tr>):
     lines.map(([description,qty,unit],i)=><tr key={i}><td>{i+1}</td><td>{description}</td><td>{qty}</td><td>{converted(unit)}</td><td>{converted(qty*unit)}</td></tr>)}
    </tbody></table>
    <p className="p55-note">Historical amount comparison is not injected into current template price cells. Blank current prices mean no approved current commercial mapping, not zero.</p>
   </div>}
   <p className="p55-note">Full-grid JSX view shows every original worksheet row and column, including blank spaces. Source-transcribed text is a working preview; native merged-cell positioning, styling and exact original formulas are governed by the XLSX master and are not claimed identical yet.</p>
   <p className="p55-note">Worksheets: {template.sheets.map(s=>s.name).join(" · ")}. Original currency USD; converted view requires explicit FX. Export: HOLD until verified mapping of canonical BOM → customer lines, complete native-cell presentation, source template preservation, revision/approval gates and cross-sheet reconciliation.</p>
 </section>;
}
