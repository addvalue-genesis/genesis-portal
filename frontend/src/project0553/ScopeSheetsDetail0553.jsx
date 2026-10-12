import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import React,{useState} from "react";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {derivePartBcWorkingWbs0553} from "./data/partBCWorkingWbs0553";
import {BULK_TAKEOFF_0553} from "./data/bulkTakeoff0553";
import {deriveScadaBulkVerification0553} from "./data/scadaBulkQuantityVerification0553";
import {deriveScadaBudgetEnvelope0553} from "./data/scadaBudgetEnvelope0553";
import {MR0002_WORKING_BOM_0553} from "./data/mr0002WorkingBom0553";
import {MR0004_WORKING_BOM_0553} from "./data/mr0004WorkingBom0553";
import {deriveWpSystemBulkBudget0553} from "./data/wpSystemBulkBudget0553";
import {SITE_SYSTEM_COST_RECONCILIATION_0553} from "./data/siteSystemCostReconciliation";
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
 const workingMR4USD=MR0004_WORKING_BOM_0553.sites.reduce((sum,s)=>sum+s.controlledTotalUSD,0);
 // A2 is sourced from the SAME MR0002 per-site Working BOM, including the RFI-LNA.
 // Management excluded MGW rates: omit MGW vendor rows, never erase independently
 // evidenced RFI-LNA and THB field allowance entries.
 const a2Eligible=MR0002_WORKING_BOM_0553.sites.flatMap(s=>s.items)
  .filter(x=>x.countedInWorkingTotal&&Number.isFinite(x.extended)&&x.source!=="MGW-P26-058"&&!String(x.owner||"").startsWith("MGW_"));
 const a2THB=a2Eligible.filter(x=>x.currency==="THB").reduce((n,x)=>n+x.extended,0);
 const a2USD=a2Eligible.filter(x=>x.currency==="USD").reduce((n,x)=>n+x.extended,0);
 // Working figures are live provisional cost evidence, not customer sell / released A1-A5.
 // A1 currently has SCADA field bulk embedded in tag ledger; it cannot be split blindly into A5.
 const round=n=>Math.round(n*100)/100;
 const fxValid=Number.isFinite(fx?.thbPerUsd)&&fx.thbPerUsd>0;
 // Working budget estimate: source-priced equipment plus explicitly separated bulk.
 // Incomplete scopes remain flagged, not mislabelled as accepted cost.
 const scadaSourceTHB=round(scadaEnvelope.locations.reduce((n,s)=>n+s.baseSourceTHB,0));
 const scadaSourceUSD=round(scadaEnvelope.locations.reduce((n,s)=>n+s.baseSourceUSD,0));
 const scadaIncrementalBulk=round(scadaEnvelope.locations.reduce((n,s)=>n+(Number.isFinite(s.incrementalBaseBulkTHB)?s.incrementalBaseBulkTHB:0),0));
 const workingScadaFloor=fxValid?round(scadaSourceTHB+scadaSourceUSD*fx.thbPerUsd+scadaIncrementalBulk):null;
 const allSystemBulk=deriveWpSystemBulkBudget0553().flatMap(w=>w.systems.flatMap(s=>
   s.items.map(x=>({...x,wp:w.wp,system:s.id}))));
 const additionalBulk=allSystemBulk.filter(x=>x.owner!=="DATO_ROW8_INCLUDED_IN_BUDGET__NOT_ADDITIVE" &&
  !(x.system==="SCADA_RADIO" && x.id==="SCADA-CAT6A") &&
  Number.isFinite(x.extendedTHB));
 const a5Known=round(additionalBulk.reduce((n,x)=>n+x.extendedTHB,0));
 const a5Unpriced=allSystemBulk.filter(x=>!Number.isFinite(x.extendedTHB)&&x.owner!=="DATO_ROW8_INCLUDED_IN_BUDGET__NOT_ADDITIVE").length;
 const phoneRows=SITE_SYSTEM_COST_RECONCILIATION_0553.rows.filter(r=>r.mr==="MR-0003"&&["ZWP20","ZWP21","ZWP22"].includes(r.site));
 const phoneRateLines=phoneRows.flatMap(r=>r.evidence||[]).filter(x=>["PHONE-1","SOUNDER-1","JB-1"].includes(x.line)&&x.currency==="THB"&&Number.isFinite(x.extended));
 const a3PricedFloor=phoneRateLines.length===9?round(phoneRateLines.reduce((n,x)=>n+x.extended,0)):null;
 const partBC=derivePartBcWorkingWbs0553();
 const workingSummary={
   A1:{amount:workingScadaFloor,source:"MR0001 Tag Cost Ledger + separated incremental SCADA bulk",status:"PRELIMINARY PRICED FLOOR; unpriced equipment/accessories excluded"},
   A2:{amount:fxValid?round(a2THB+a2USD*fx.thbPerUsd):a2USD===0?round(a2THB):null,
   source:"MR0002_WORKING_BOM_0553 per-site rows: RFI-LNA and non-MGW priced allowances only",
   status:"PARTIAL WORKING FLOOR; MGW rates excluded, remaining DMR equipment and unpriced bulk not included"},
   A3:{amount:a3PricedFloor,source:"EXION THAI QT1260576 Phone + Sounder; PROSPER Q-PROSRY-24051 historical Ex e JB; 3 allocated locations only",status:"PRELIMINARY 3-LOCATION FLOOR; 4th EXION quoted set UNALLOCATED, JB REQUOTE AND BULK NOT INCLUDED"},
   A4:{amount:fx?.thbPerUsd>0?workingMR4USD*fx.thbPerUsd:null,source:"MR0004 ORGA canonical Working BOM",status:"PROVISIONAL 3-SITE SCENARIO"},
   A5:{amount:a5Known>0?a5Known:null,source:"Separate system physical bulk ledger excluding SCADA-CAT6A and DATO already allocated in A1",status:"PARTIAL PRICED FLOOR; "+a5Unpriced+" other field-bulk items remain without rates"}
 };
 return <section className="p55-panel">
  <div className="p55-eyebrow">6 ORIGINAL SHEETS <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.scope"/></div>
  <h3>Scope of Supply — Linked Internal Detail</h3>
  <p className="p55-note">Original uploaded workbook has 6 tabs, including unpriced template cells. Historical Rev08 amounts below are kept separate from original cells, current vendor cost and new bid selling price.</p>
  <div className="p55-filterbar"><label>Customer Workbook Sheet <select value={sheet} onChange={e=>setSheet(e.target.value)}>{SHEETS.map(v=><option value={v[0]} key={v[0]}>{v[0]}</option>)}</select></label></div>
  <p className="p55-note">{category[2]}</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Ref.</th><th>Description</th><th>Qty</th><th>Unit Price THB</th><th>Working Budgetary Cost THB</th><th>Source / Engineering &amp; Cost Status</th></tr></thead>
  <tbody>{sheet==="Scope of supply"?summary.map(([id,desc])=>{
   const control=partBC.rows.find(r=>r.code===id);
   const item=workingSummary[id]||(control?{amount:control.sellTHB,status:control.state,source:control.driver+" · "+control.owner+" · "+control.source}:null),amount=item?.amount;
   const unavailable=id==="A5"?"Unpriced bulk exposure":item?.status?.includes("MGW PRICE EXCLUDED")?"Selected rate required":fxValid?"Cost source pending":"Awaiting FX";
   return <tr key={id}><td>{id}</td><td>{desc}</td><td>{control?.qty!==null&&Number.isFinite(control?.qty)?control.qty+" "+control.unit:"1 LS (unpriced scope)"}</td>
    <td className="is-number">{Number.isFinite(control?.unitPriceTHB)?cash(control.unitPriceTHB):Number.isFinite(amount)?cash(amount):unavailable}</td>
    <td className="is-number">{Number.isFinite(amount)?cash(amount):control?"Owner / OEM quotation required":unavailable}</td>
    <td>{item?<>{item.status}<small>{item.source}</small></>:"Non-A scope: separate cost derivation required"}</td></tr>;
  }):details.map(([desc,qty,price],i)=>{
   // Historical template numbers are customer-facing Rev08 prices, not present-day supplier cost.
   const rate=fxValid?round(price*fx.thbPerUsd):null;
   return <tr key={i}><td>{category[1]}-{i+1}</td><td>{desc}</td><td>{qty}</td>
    <td className="is-number">{Number.isFinite(rate)?cash(rate):"Awaiting FX"}</td>
    <td className="is-number">{Number.isFinite(rate)?cash(round(qty*rate)):"Awaiting FX"}</td>
    <td>Rev08 customer-price equivalent converted to THB — historical comparison ONLY, not working supplier cost</td></tr>;
  })}</tbody></table></div>
  {sheet==="Scope of supply"&&<p className="p55-note"><strong>Part B ADDVALUE Working Sell:</strong> {cash(partBC.subtotalTHB)} from Rev05 WBS, not internal direct cost or full SAMTEL client price. B4–B7, B10–B14 and C1–C2 are owner-controlled excluded/optional lines; unresolved owner quotation must NOT be interpreted as zero. <a href={partBC.sourceUrl} target="_blank" rel="noreferrer">WBS Rev05 original</a>.</p>}
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
