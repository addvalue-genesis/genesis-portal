import { CommercialSystemBreakdown0553 } from "./CommercialSystemBreakdown";
import { REV08_BASELINE, getBaselineReview } from "./data/rev08CommercialBaseline";
import React,{useState} from "react";
import {COMMERCIAL_TEMPLATE_0553 as template,commercialTransition} from "./commercialWorkbookControl";
export function CommercialWorkspace0553(){
 const [mode,setMode]=useState("working");
 const [recipient,setRecipient]=useState("INTERNAL");
 const [expanded,setExpanded]=useState(new Set(["SUMMARY"]));
 const toggle=k=>setExpanded(a=>{const n=new Set(a);n.has(k)?n.delete(k):n.add(k);return n;});
 const rows=template.sheets;
 const baseline=getBaselineReview();
 const usd=n=>typeof n==="number"?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"OPEN";
 const [showPrices,setShowPrices]=useState(true);
 return <div className="p55-stack">
 <section className="p55-panel">
  <div className="p55-eyebrow">0553 / REUSE 0550 COMMERCIAL STATE DOCTRINE</div>
  <h2>Engineering → BOM/MTO → Cost → Customer Scope of Supply</h2>
  <p className="p55-note">This is a controlled WORKSPACE, not a price release. The previously issued SAMTEL file is historical evidence; its exact issued revision must be verified before snapshot registration. No 0550 rates or facts transferred.</p>
  <div className="p55-filterbar p55-filterbar--simple">
    <div className="p55-segmented p55-segmented--commercial">
    {[[ "working","Working Preview" ],["budgetary","Budgetary Submission"],["released","Released Customer Output"]].map(([k,label])=><button key={k} type="button" className={mode===k?"is-active":""} onClick={()=>setMode(k)}>{label}</button>)}
    </div>
    <label>Customer / viewer <select value={recipient} onChange={e=>setRecipient(e.target.value)}>{template.policy.recipients.map(x=><option key={x}>{x}</option>)}</select></label>
  </div>
  <p className="p55-note"><strong>Current display:</strong> {mode.toUpperCase()} · {recipient}. {mode==="working"?"Editable commercial derivation is pending source reconciliation.":mode==="budgetary"?"Frozen snapshot required; do not overwrite prior submissions.":"Customer release remains HOLD until written authorization and all gates pass."}</p>
  <CommercialSystemBreakdown0553/>
  <section className="p55-panel">
   <div className="p55-eyebrow">REV08 EXISTING COMMERCIAL BASELINE · PRICES FROM CUSTOMER WORKBOOK</div>
   <h3>Detailed Cost / Selling Price Breakdown — USD</h3>
   <p className="p55-note">ราคาด้านล่างเป็นราคาเสนอเดิมใน Workbook Rev08 ไม่ใช่ Verified Vendor Cost หรือ Working Revised Price และยังไม่ใช่ JUTAL Released Offer · รายการ Qty 1 ของ A/B เป็น Lump Sum ในเอกสาร ไม่ใช่จำนวนอุปกรณ์ติดตั้งจริง</p>
   <div className="p55-metric-grid">
    <div><strong>Part A</strong><p>USD {usd(baseline.partA)}</p></div>
    <div><strong>Part B</strong><p>USD {usd(baseline.partB)}</p></div>
    <div><strong>Base A+B</strong><p>USD {usd(baseline.base)}</p></div>
    <div><strong>Optional C1+C2</strong><p>USD {usd(baseline.options)}</p></div>
   </div>
   <p className="p55-note">Reported base in source: USD {usd(baseline.reportedBase)} · Calculated variance: USD {usd(baseline.base-baseline.reportedBase)} (display values rounded to 4 decimal places).</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
    <thead><tr><th>Item ID</th><th>Customer Description</th><th>Qty basis</th><th>Unit Price USD</th><th>Total USD</th><th>State</th></tr></thead>
    <tbody>{REV08_BASELINE.summary.map(([code,name,price])=><tr key={code}><td><strong>{code}</strong></td><td>{name}</td><td>1 LS</td><td className="is-number">{usd(price)}</td><td className="is-number">{usd(price)}</td><td><span className="p55-badge">{code.startsWith("C")?"OPTION":"REV08"}</span></td></tr>)}</tbody>
   </table></div>
   <h3>Linked detail schedules — Qty × Unit USD</h3>
   {baseline.checks.map(s=><div key={s.code} className="p55-panel">
     <button type="button" className="p55-row-toggle" onClick={()=>toggle("detail-"+s.code)} aria-expanded={expanded.has("detail-"+s.code)}>{expanded.has("detail-"+s.code)?"−":"+"}</button>
     <strong> {s.code} · {template.sheets.find(x=>x.code===s.code)?.name}</strong>
     <span style={{marginLeft:12}}>Summary USD {usd(s.summary)} · Detail USD {usd(s.total)} · Difference USD {usd(s.delta)}</span>
     {expanded.has("detail-"+s.code)&&<div className="p55-table-wrap"><table className="p55-table p55-table--budget">
       <thead><tr><th>No.</th><th>Detailed description (source Rev08)</th><th>Qty</th><th>Unit Price USD</th><th>Extended Price USD</th></tr></thead>
       <tbody>{s.items.map(([name,qty,price],idx)=><tr key={idx}><td>{idx+1}</td><td>{name}</td><td className="is-number">{qty}</td><td className="is-number">{usd(price)}</td><td className="is-number">{usd(qty*price)}</td></tr>)}</tbody>
      </table></div>}
   </div>)}
   <p className="p55-note">Baseline source: 4-Scope of Supply.xlsx, Rev08. These detail lines are not yet fully linked to latest MR/MTO and vendor changes; no edit to original or prior SAMTEL submission.</p>
  </section>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
    <thead><tr><th>＋/−</th><th>Customer Workbook Sheet</th><th>Linked code / origin</th><th>Commercial check</th></tr></thead>
    <tbody>{rows.map(s=><React.Fragment key={s.name}><tr>
      <td><button type="button" className="p55-row-toggle" onClick={()=>toggle(s.name)} aria-expanded={expanded.has(s.name)}>{expanded.has(s.name)?"−":"+"}</button></td>
      <td><strong>{s.name}</strong><small>{s.kind}</small></td>
      <td>{s.code}</td><td><span className="p55-badge">SOURCE RECONCILIATION</span></td>
    </tr>{expanded.has(s.name)&&<tr><td></td><td colSpan={3}>
      <strong>Linked derivation</strong>
      <ul>{template.mappings.filter(x=>s.kind==="SUMMARY"?x.sheet==="Scope of supply":x.sheet===s.name).map(x=><li key={x.code}><code>{x.code}</code> · {x.source} → {x.driver}</li>)}</ul>
      <p className="p55-note">No auto-release or unverified totals. {s.kind==="OPTION"?"Optional Part C excluded from base A+B.":"Confirm installed BOM, source unit price, quantity and FX."}</p>
    </td></tr>}</React.Fragment>)}</tbody>
  </table></div>
  <p><strong>Workbook source:</strong> {template.sourceName} · {template.revision} · 6 sheets. <strong>Export status:</strong> HOLD — original template fidelity and cross-sheet reconciliation not yet validated.</p>
 </section>
 <section className="p55-panel"><h3>Release & integrity checklist</h3>
 <p>1. Source MR/MTO/TC/vendor revision → 2. Engineering quantity → 3. Vendor cost & service MH → 4. Summary A/B/C ↔ detail sheets → 5. Freeze per recipient → 6. Approved XLSX export.</p>
 <p className="p55-note">0550 source code remains untouched. State control is based on the reused three-state doctrine, not an independent 0553 pricing policy.</p>
 </section>
 </div>;
}
