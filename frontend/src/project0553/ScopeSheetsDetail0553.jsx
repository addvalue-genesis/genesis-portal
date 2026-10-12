import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import React,{useState} from "react";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {BULK_TAKEOFF_0553} from "./data/bulkTakeoff0553";
import {deriveScadaBulkVerification0553} from "./data/scadaBulkQuantityVerification0553";
import {deriveScadaBudgetEnvelope0553} from "./data/scadaBudgetEnvelope0553";
const SHEETS=[
 ["Scope of supply","A/B/C","A1–A5 equipment+bulk, B1–B14 services, C1/C2 options"],
 ["B10 CommSpares","B10","Erection, pre-commissioning, commissioning and start-up spare parts"],
 ["B11 SpecialTool","B11","Special tools"],
 ["B13 Consumerables","B13","Consumables"],
 ["C1 CapitalSpares","C1","Capital spares option"],
 ["C2 2Y-Spares","C2","Two-year operation spares option"]
];
const usd=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"";
export function ScopeSheetsDetail0553({fx=null}){
 const [sheet,setSheet]=useState("Scope of supply");
 const [showBulk,setShowBulk]=useState(true);
 const [scadaSite,setScadaSite]=useState("ALL");
 const scadaBulk=deriveScadaBulkVerification0553();
 const scadaEnvelope=deriveScadaBudgetEnvelope0553({thbPerUsd:fx?.thbPerUsd});
 const scadaShown=scadaEnvelope.locations.filter(s=>scadaSite==="ALL"||s.site===scadaSite);
 const cash=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"Not established";
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
  {sheet==="Scope of supply"&&<section className="p55-panel" data-component-key="bid.budget.scope.scada-working">
   <h4>MR-0001 SCADA — Engineering BOM &amp; Bulk Budgetary Working Projection</h4>
   <p className="p55-note"><strong>Live derivation:</strong> existing MR0001 tag Cost Ledger → 16-function bulk verification → budget envelope. This is not a new cost ledger and does not modify customer Rev08. Original currencies retained; FX {fx?.thbPerUsd??"REQUIRED"} THB/USD, source {fx?.source||"not entered"}. Brownfield is budgeted as new replacement only. Accessories are segregated from Base, not silently merged or double counted.</p>
   <label>Location <select value={scadaSite} onChange={e=>setScadaSite(e.target.value)}><option value="ALL">All 7 locations</option>{scadaEnvelope.locations.map(s=><option key={s.site} value={s.site}>{s.site}</option>)}</select></label>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Location</th><th>Base Budget THB</th><th>Conditional priced floor THB</th><th>Conditional complete</th><th>Contingency THB (10% illustrative)</th><th>Priced envelope floor THB</th><th>Outstanding</th></tr></thead><tbody>
   {scadaShown.map(s=><tr key={s.site}><td><strong>{s.site}</strong><small>{s.replacementBasis}</small></td><td>{cash(s.baseBudgetTHB)}<small>Source THB {cash(s.baseSourceTHB)} + USD {s.baseSourceUSD.toLocaleString("en-US")} + incremental field bulk {cash(s.incrementalBaseBulkTHB)}</small></td><td>{cash(s.pricedConditionalFloorTHB)}</td><td>{cash(s.conditionalAllowanceTHB)}</td><td>{cash(s.contingencyTHB)}</td><td>{cash(s.pricedEnvelopeTHB)}<small>NOT full budget / not approved sell price</small></td><td>{s.unresolvedAccessoryFunctions.length} accessory rate/qty gaps; {s.unpricedLedgerRows.length} unpriced MTO rows; {s.unresolvedQuantityTags.length} unknown quantity tags {s.bulkBookedUnverifiable?"· existing bulk not decomposable":""}</td></tr>)}
   </tbody></table></div>
   <details><summary>SCADA Physical Bulk — 16 functions per location (same engineering data)</summary>
   <p className="p55-note">Quantities are provisional from source tags/interfaces; cable length uses 60m per assumed Ethernet run plus 15% only. Ex/OEM compatibility and separate RF/DC/Control routes require confirmation. Price evidence is not customer procurement approval.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Location</th><th>Function</th><th>Quantity</th><th>Unit Rate</th><th>Priced reference THB</th><th>Cost bucket / source</th></tr></thead><tbody>
   {scadaBulk.filter(s=>scadaSite==="ALL"||s.site===scadaSite).flatMap(s=>s.rows.map(b=><tr key={s.site+"-"+b.id}><td>{s.site}</td><td>{b.id}<small>{b.item}</small></td><td>{b.derivedQty??"NOT DERIVED"} {b.unit}<small>{b.quantityState}</small></td><td>{cash(b.unitRateTHB)}</td><td>{cash(b.provisionalExtendedTHB)}</td><td>{b.budgetBucket}<small>{b.rateSource||b.priceBasis}</small></td></tr>))}
   </tbody></table></div>
   </details>
   <p className="p55-note">Completeness is not yet achieved. Missing rates are not zero. "Priced envelope floor" excludes unresolved accessories, verified spare/service scope and technical approval. The 10% contingency is a displayed scenario, not a management-approved rate.</p>
  </section>}
  {sheet==="Scope of supply"&&<><button type="button" className="p553-detail-button" onClick={()=>setShowBulk(v=>!v)}>{showBulk?"− Hide":"＋ Show"} Engineering Bulk / Enclosures / JB / Licences</button>
  {showBulk&&<div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>MR</th><th>Category</th><th>Engineering Required Item</th><th>Quantity Driver & Evidence</th><th>New Qty / Unit Cost</th></tr></thead><tbody>
  {BULK_TAKEOFF_0553.map((r,i)=><tr key={i}><td>{r.mr}</td><td>{r.category}</td><td>{r.item}<small>{r.note}</small></td><td>{r.driver}<small>{r.source}</small></td><td>{r.qty===null?"":r.qty} / {r.rate===null?"":r.rate}</td></tr>)}
  </tbody></table></div>}</>}
  <p className="p55-note">Do not auto-add historical Rev08 summaries to quotation line costs, options or derived bulk. Zero-price lines and blanks in source are not accepted prices without review. Each sheet must pass Modules 01–08 before new costing/release.</p>
 </section>;
}
