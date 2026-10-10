import { formatCommercialAmount } from "../common/cost/commercialCurrency";
import { InternalBudgetShortcut0553 } from "./InternalBudgetShortcut0553";
import { BID_COST_SPINE_0553 } from "./data/bidCostSpine";
import { CommercialSystemBreakdown0553 } from "./CommercialSystemBreakdown";
import { SimpleBom0553 } from "./SimpleBom0553";
import { REV08_BASELINE, getBaselineReview } from "./data/rev08CommercialBaseline";
import React,{useState} from "react";
import {COMMERCIAL_TEMPLATE_0553 as template} from "./commercialWorkbookControl";
import { BID_0553_GATES, BID_0553_SOURCES } from "./bidReview";
export function CommercialWorkspace0553({focusedLocation=null}){
 const [mode,setMode]=useState("working");
 const [recipient,setRecipient]=useState("INTERNAL");
 const [expanded,setExpanded]=useState(new Set(["SUMMARY"]));
 const toggle=k=>setExpanded(a=>{const n=new Set(a);n.has(k)?n.delete(k):n.add(k);return n;});
 const rows=template.sheets;
 const baseline=getBaselineReview();
 
 // Working display defaults only. Never represent the 31.5 planning rate as a BOT quote.
 const DEFAULT_FX={displayCurrency:"THB",fxRate:"31.5",fxDate:"2026-10-10",fxSource:"INTERNAL PLANNING ASSUMPTION — UNVERIFIED"};
 const STORAGE_KEY="pj2608-0553-working-fx-v1";
 const readSettings=()=>{
  try{
   const saved=JSON.parse(window.localStorage.getItem(STORAGE_KEY)||"null");
   if(saved&&["USD","THB"].includes(saved.displayCurrency)&&
     /^\\d+(?:\\.\\d+)?$/.test(String(saved.fxRate))&&Number(saved.fxRate)>0&&
     /^\\d{4}-\\d{2}-\\d{2}$/.test(String(saved.fxDate))&&
     typeof saved.fxSource==="string"&&saved.fxSource.trim())return saved;
  }catch(e){/* Private browsing or storage unavailable: use defaults. */}
  return DEFAULT_FX;
 };
 const [fxSettings,setFxSettings]=useState(readSettings);
 const persistSettings=next=>{
  setFxSettings(next);
  try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(next));}catch(e){/* Session still works. */}
 };
 const displayCurrency=fxSettings.displayCurrency,fxRate=fxSettings.fxRate,fxDate=fxSettings.fxDate,fxSource=fxSettings.fxSource;
 const fx=Number(fxRate)>0&&fxDate&&fxSource.trim()?{thbPerUsd:Number(fxRate),date:fxDate,source:fxSource}:null;
 const isPlanningFx=fxSource===DEFAULT_FX.fxSource;
 const updateFx=(key,value)=>persistSettings({...fxSettings,[key]:value});
 const resetFx=()=>persistSettings({...DEFAULT_FX});
 const price=(n,from="USD")=>formatCommercialAmount(n,from,displayCurrency,fx);
 return <div className="p55-stack">
 <InternalBudgetShortcut0553/>
 <section className="p55-panel">
  <div className="p55-eyebrow">0553 / REUSE 0550 COMMERCIAL STATE DOCTRINE</div>
  <h2>Engineering → BOM/MTO → Cost → Customer Scope of Supply</h2>
  <p className="p55-note"><strong>Shared Cost Spine:</strong> Known preliminary equipment THB {BID_COST_SPINE_0553.knownPreliminaryCost.THB.toLocaleString("en-US")} · {BID_COST_SPINE_0553.pricedRows} priced MTO items / {BID_COST_SPINE_0553.unpricedRows} unpriced · full A+B+C and customer sell not complete. Source: {BID_COST_SPINE_0553.source}</p>
  <p className="p55-note">This is a controlled WORKSPACE, not a price release. The previously issued SAMTEL file is historical evidence; its exact issued revision must be verified before snapshot registration. No 0550 rates or facts transferred.</p>
  <div className="p55-filterbar p55-filterbar--simple">
    <div className="p55-segmented p55-segmented--commercial">
    {[[ "working","Working Preview" ],["budgetary","Budgetary Submission"],["released","Released Customer Output"]].map(([k,label])=><button key={k} type="button" className={mode===k?"is-active":""} onClick={()=>setMode(k)}>{label}</button>)}
    </div>
    <label>Customer / viewer <select value={recipient} onChange={e=>setRecipient(e.target.value)}>{template.policy.recipients.map(x=><option key={x}>{x}</option>)}</select></label>
  </div>
  <p className="p55-note"><strong>Current display:</strong> {mode.toUpperCase()} · {recipient}. {mode==="working"?"Editable commercial derivation is pending source reconciliation.":mode==="budgetary"?"Frozen snapshot required; do not overwrite prior submissions.":"Customer release remains HOLD until written authorization and all gates pass."}</p>
  {mode==="working"&&<>
  <section className="p55-panel">
   <div className="p55-eyebrow">CURRENCY VIEW / ORIGINAL CURRENCY RETAINED</div>
   <div className="p55-filterbar p55-filterbar--simple">
    <label>Display currency <select value={displayCurrency} onChange={e=>updateFx("displayCurrency",e.target.value)}><option value="USD">USD</option><option value="THB">THB</option></select></label>
    <label>FX THB per USD (source-controlled) <input type="number" min="0.000001" step="any" value={fxRate} onChange={e=>updateFx("fxRate",e.target.value)} placeholder="Rate from verified source"/></label>
    <label>FX date <input type="date" value={fxDate} onChange={e=>updateFx("fxDate",e.target.value)}/></label>
    <label>FX source <input value={fxSource} onChange={e=>updateFx("fxSource",e.target.value)} placeholder="BOT publication / reference"/></label>
   </div>
   <p className="p55-note"><strong>{isPlanningFx?"WORKING ASSUMPTION (NOT VERIFIED BOT RATE)":"USER-ENTERED FX — VERIFY SOURCE BEFORE RELEASE"}:</strong> Default 31.5 THB/USD dated 2026-10-10 is a budget display assumption only, not an authenticated BOT rate. Original vendor currencies and amounts remain unchanged. Edits persist in this browser; they do not modify controlled source data. <button type="button" onClick={resetFx}>Reset working default</button></p>
  </section>
  <section className="p55-panel">
   <div className="p55-eyebrow">GOVERNING METHOD · WORKING PREVIEW IS THE ENGINEERING WORKBENCH</div>
   <p className="p55-note"><strong>INPUT:</strong> RFQ/MR/MTO/BLD/DTS/RPT/Standards · <strong>DERIVE:</strong> Link/Capacity/Interface Constraints → Physical BOM and quantity → Vendor technical evaluation → WBS Services → Equipment/Service Cost and risk · <strong>OUTPUT:</strong> reviewed engineering working cost. Current MTO sets and quoted vendor quantities are input evidence, NOT verified physical SKU quantities.</p>
  </section>
  <SimpleBom0553 focusedLocation={focusedLocation}/>
  <CommercialSystemBreakdown0553 displayCurrency={displayCurrency} fx={fx}/>
  <section className="p55-panel">
   <div className="p55-eyebrow">REV08 EXISTING COMMERCIAL BASELINE · PRICES FROM CUSTOMER WORKBOOK</div>
   <h3>Detailed Cost / Selling Price Breakdown — {displayCurrency}</h3>
   <p className="p55-note">ราคาด้านล่างเป็นราคาเสนอเดิมใน Workbook Rev08 ไม่ใช่ Verified Vendor Cost หรือ Working Revised Price และยังไม่ใช่ JUTAL Released Offer · รายการ Qty 1 ของ A/B เป็น Lump Sum ในเอกสาร ไม่ใช่จำนวนอุปกรณ์ติดตั้งจริง</p>
   <div className="p55-metric-grid">
    <div><strong>Part A</strong><p>{price(baseline.partA)}</p></div>
    <div><strong>Part B</strong><p>{price(baseline.partB)}</p></div>
    <div><strong>Base A+B</strong><p>{price(baseline.base)}</p></div>
    <div><strong>Optional C1+C2</strong><p>{price(baseline.options)}</p></div>
   </div>
   <p className="p55-note">Reported base in source: {price(baseline.reportedBase)} · Calculated variance: {price(baseline.base-baseline.reportedBase)} (display values rounded to 4 decimal places).</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
    <thead><tr><th>Item ID</th><th>Customer Description</th><th>Qty basis</th><th>Unit Price ({displayCurrency})</th><th>Total ({displayCurrency})</th><th>State</th></tr></thead>
    <tbody>{REV08_BASELINE.summary.map(([code,name,unitAmount])=><tr key={code}><td><strong>{code}</strong></td><td>{name}</td><td>1 LS</td><td className="is-number">{price(unitAmount)}</td><td className="is-number">{price(unitAmount)}</td><td><span className="p55-badge">{code.startsWith("C")?"OPTION":"REV08"}</span></td></tr>)}</tbody>
   </table></div>
   <h3>Linked detail schedules — Qty × Unit USD</h3>
   {baseline.checks.map(s=><div key={s.code} className="p55-panel">
     <button type="button" className="p55-row-toggle" onClick={()=>toggle("detail-"+s.code)} aria-expanded={expanded.has("detail-"+s.code)}>{expanded.has("detail-"+s.code)?"−":"+"}</button>
     <strong> {s.code} · {template.sheets.find(x=>x.code===s.code)?.name}</strong>
     <span style={{marginLeft:12}}>Summary {price(s.summary)} · Detail {price(s.total)} · Difference {price(s.delta)}</span>
     {expanded.has("detail-"+s.code)&&<div className="p55-table-wrap"><table className="p55-table p55-table--budget">
       <thead><tr><th>No.</th><th>Detailed description (source Rev08)</th><th>Qty</th><th>Unit Price ({displayCurrency})</th><th>Extended Price ({displayCurrency})</th></tr></thead>
       <tbody>{s.items.map(([name,qty,unitAmount],idx)=><tr key={idx}><td>{idx+1}</td><td>{name}</td><td className="is-number">{qty}</td><td className="is-number">{price(unitAmount)}</td><td className="is-number">{price(qty*unitAmount)}</td></tr>)}</tbody>
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
 </>}
 {mode==="budgetary"&&<section className="p55-panel">
   <div className="p55-eyebrow">BUDGETARY SUBMISSION · SNAPSHOT REGISTRY</div>
   <h3>Frozen Budgetary Issue — Verification Required</h3>
   <p className="p55-note"><strong>NO VERIFIED ISSUED SNAPSHOT REGISTERED.</strong> A historical Rev08 workbook is available but its exact SAMTEL-issued revision and recipients are still unverified. It is not promoted to Budgetary Submission.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Candidate evidence</th><th>Source</th><th>Issue / approval status</th></tr></thead><tbody>
    <tr><td>4-Scope of Supply.xlsx · Rev08</td><td><a href={"https://drive.google.com/file/d/"+template.sourceId+"/view"} target="_blank" rel="noreferrer">Historical customer workbook</a></td><td>HISTORICAL BASELINE / ISSUED REVISION UNVERIFIED</td></tr>
    <tr><td>Internal Pricing Rev09</td><td><a href={BID_0553_SOURCES.find(x=>x.id==="INT-PRICE-R09")?.url} target="_blank" rel="noreferrer">Source file</a></td><td>INTERNAL ONLY / HOLD</td></tr>
   </tbody></table></div>
   <p className="p55-note"><strong>Required before freeze:</strong> confirmed issued document, recipient, revision, approved commercial amount, source hash, issue timestamp, and management authorization. Working price changes must not rewrite an issued snapshot.</p>
   <p><strong>Customer export:</strong> DISABLED — no authenticated frozen budgetary snapshot.</p>
 </section>}
 {mode==="released"&&<section className="p55-panel">
   <div className="p55-eyebrow">RELEASED CUSTOMER OUTPUT · APPROVAL GATE</div>
   <h3>Customer Release — HOLD</h3>
   <p className="p55-note">No JUTAL customer-priced release is authorized. Rev08 historical values and working internal costs are intentionally hidden from this view. Choosing this tab does not approve or issue any document.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Gate</th><th>Required check</th><th>Current status</th></tr></thead>
   <tbody>{BID_0553_GATES.map(g=><tr key={g.id}><td><strong>{g.id}</strong></td><td>{g.title}<small>{g.detail}</small></td><td><span className="p55-badge">{g.status}</span></td></tr>)}</tbody></table></div>
   <p><strong>Price / Approved XLSX / Submission:</strong> HOLD — final technical, commercial, six-sheet reconciliation, authenticated ITB amendment and written approval required.</p>
 </section>}
 <section className="p55-panel"><h3>Release & integrity checklist</h3>
 <p>1. Source MR/MTO/TC/vendor revision → 2. Engineering quantity → 3. Vendor cost & service MH → 4. Summary A/B/C ↔ detail sheets → 5. Freeze per recipient → 6. Approved XLSX export.</p>
 <p className="p55-note">0550 source code remains untouched. State control is based on the reused three-state doctrine, not an independent 0553 pricing policy.</p>
 </section>
 </section>
 </div>;
}
