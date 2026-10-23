import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import React,{useState} from "react";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {selectScopeSheet0553} from "./data/scopeSheetProjection0553";

import {selectScopePartBcWorking0553} from "./data/scopePartBcReadModel0553";
import {selectB9ChinaWorkingBudget0553} from "./data/b9ChinaWorkingBudget0553";
import {selectScopeBcPriceAudit0553,SCOPE_BC_DETAIL_CODES_0553} from "./data/scopeBcPriceAudit0553";
import {ScopeBcAnnexDetail0553} from "./ScopeBcAnnexDetail0553";
import {ScopeCategoryTabs0553} from "./ScopeCategoryTabs0553";
import {BULK_TAKEOFF_0553} from "./data/bulkTakeoff0553";
import {deriveScadaBulkVerification0553} from "./data/scadaBulkQuantityVerification0553";
import {deriveScadaBudgetEnvelope0553} from "./data/scadaBudgetEnvelope0553";
import {MR0002_WORKING_BOM_0553} from "./data/mr0002WorkingBom0553";
import {MR0004_WORKING_BOM_0553} from "./data/mr0004WorkingBom0553";
import {deriveWpSystemBulkBudget0553} from "./data/wpSystemBulkBudget0553";
import {SITE_SYSTEM_COST_RECONCILIATION_0553} from "./data/siteSystemCostReconciliation";
import {deriveA5BulkAttribution0553} from "./data/a5BulkAttribution0553";
import {getMR0001LocationCost0553} from "./data/mr0001LocationCostSummary0553";
import {WORKING_BOM_BY_LOCATION_0553} from "./data/workingBomByLocation";
import {selectWorkingBomProjection0553} from "./data/workingBomAggregation0553";
const SHEETS=[
 ["Scope of supply","A/B/C","A1–A5 equipment+bulk, B1–B14 services, C1/C2 options"],
 ["B10 CommSpares","B10","Erection, pre-commissioning, commissioning and start-up spare parts"],
 ["B11 SpecialTool","B11","Special tools"],
 ["B12 FirstFilling","B12","First filling — itemized worksheet not available"],
 ["B13 Consumerables","B13","Consumables"],
 ["B14 BondsInsurance","B14","Bonds and insurance — itemized worksheet not available"],
 ["C1 CapitalSpares","C1","Capital spares option"],
 ["C2 2Y-Spares","C2","Two-year operation spares option"]
];
const usd=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"";
export function ScopeSheetsDetail0553({fx=null,view="full",navigationTarget=null,navigationSequence=0}){
 const [sheet,setSheet]=useState("Scope of supply");
 React.useEffect(()=>{
  if(!navigationTarget?.startsWith("bid.budget.scope."))return;
  const code=navigationTarget.slice("bid.budget.scope.".length).toUpperCase();
  const found=SHEETS.find(row=>row[1]===code);
  if(found)setSheet(found[0]);
  const scope=document.querySelector('[data-component-key="bid.budget.scope"]');
  if(scope&&typeof scope.scrollIntoView==="function")
   scope.scrollIntoView({block:"start",behavior:"smooth"});
 },[navigationTarget,navigationSequence]);
 const [showBulk,setShowBulk]=useState(true);
 const [scadaSite,setScadaSite]=useState("ALL");
 const scadaBulk=deriveScadaBulkVerification0553();
 const scadaEnvelope=deriveScadaBudgetEnvelope0553({thbPerUsd:fx?.thbPerUsd});
 const scadaShown=scadaEnvelope.locations.filter(s=>scadaSite==="ALL"||s.site===scadaSite);
 const cash=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"Not established";
 const category=SHEETS.find(x=>x[0]===sheet);
 const scopePriceAudit=selectScopeBcPriceAudit0553({thbPerUsd:fx?.thbPerUsd});
 const summary=REV08_BASELINE.summary.filter(x=>sheet==="Scope of supply"||x[0]===category[1]);
 const details=selectScopeSheet0553(category[1],{thbPerUsd:fx?.thbPerUsd}).rows;
 const linkedScopeCodes=new Set(SCOPE_BC_DETAIL_CODES_0553);
 const scopeSheetSources=Object.fromEntries([...linkedScopeCodes].map(code=>[code,selectScopeSheet0553(code,{thbPerUsd:fx?.thbPerUsd})]));
 // Current A2/A3/A4 use ONLY sourceMrProjection from the selected 10.1 BOM.
 // Working figures are live provisional cost evidence, not customer sell / released A1-A5.
 // A1 currently has SCADA field bulk embedded in tag ledger; it cannot be split blindly into A5.
 const round=n=>Math.round(n*100)/100;
 const fxValid=Number.isFinite(fx?.thbPerUsd)&&fx.thbPerUsd>0;
 // Working budget estimate: source-priced equipment plus explicitly separated bulk.
 // Incomplete scopes remain flagged, not mislabelled as accepted cost.
 // Source of truth: identical seven-location allocated TAG ledger used by
 // bid.budget.bom.system-location-mto (SimpleBom0553), NOT the separate
 // engineering envelope/scenario projection.
 const scadaLocationCosts=WORKING_BOM_BY_LOCATION_0553.locations.map(location=>getMR0001LocationCost0553(location.site));
 const scadaSourceTHB=round(scadaLocationCosts.reduce((n,s)=>n+s.allocatedTHB,0));
 const scadaSourceUSD=round(scadaLocationCosts.reduce((n,s)=>n+s.allocatedUSD,0));
 // Source Ledger is already priced by the MTO's Bulk Material cost owners.
 // The separate SCADA envelope / WP planning routes are scenario views, not additive invoices.
 const a5=deriveA5BulkAttribution0553();
 const scadaLedgerCostTHB=fxValid?round(scadaSourceTHB+scadaSourceUSD*fx.thbPerUsd):null;
 const workingScadaEquipment=Number.isFinite(scadaLedgerCostTHB)&&Number.isFinite(a5.a1CostToReclassifyTHB)?
  round(scadaLedgerCostTHB-a5.a1CostToReclassifyTHB):scadaLedgerCostTHB;
 const a5Unpriced=a5.unresolved.length+a5.unknownScadaAccessories.length;
 const a5LedgerReconciled=Number.isFinite(scadaLedgerCostTHB)&&
  Number.isFinite(workingScadaEquipment)&&Number.isFinite(a5.a5PriceTHB)&&
  Math.abs(round(workingScadaEquipment+a5.a5PriceTHB-scadaLedgerCostTHB))<=0.01 &&
  Math.abs(round(a5.a1CostToReclassifyTHB-a5.a5PriceTHB))<=0.01 && a5.a5PriceTHB<=scadaLedgerCostTHB;
 // Former EXION/PROSPER three-site phone-price proxy is historical, not posted.
 const scopeBC=selectScopePartBcWorking0553();
 // All four Scope A lines read the very same projection used by the
 // System x Location x MTO Working BOM screen. No parallel supplier-rate path.
 const sourceMrProjection={
  A1:selectWorkingBomProjection0553({mr:"MR-0001"}),
  A2:selectWorkingBomProjection0553({mr:"MR-0002"}),
  A3:selectWorkingBomProjection0553({mr:"MR-0003"}),
  A4:selectWorkingBomProjection0553({mr:"MR-0004"})
 };
 const projectionTHB=projection=>{
  if(projection.orphanCurrency)return null;
  const other=Object.keys(projection.currencies).filter(key=>key!=="THB"&&key!=="USD");
  if(other.length)return null;
  const thb=projection.currencies.THB||0,usd=projection.currencies.USD||0;
  return usd&&!fxValid?null:round(thb+usd*(fx?.thbPerUsd||0));
 };
 const a1Combined=projectionTHB(sourceMrProjection.A1);
 // A1 shows the full MR0001 canonical allocated BOM amount, including embedded bulk.
 // A5 is a non-additive disclosure of that included portion (not another charge).
 const a1Equipment=a1Combined;
 const sourceLine=(code,description,candidate=false)=>({
  amount:projectionTHB(sourceMrProjection[code]),
  source:"bid.budget.bom.system-location-mto → selectWorkingBomProjection0553("+sourceMrProjection[code].rows[0]?.mr+")",
  status:(candidate?"CANDIDATE EVIDENCE ONLY — NOT BOOKED / NOT RELEASED; ":"CONTROLLED WORKING EQUIPMENT/BULK, NOT FULL A+B+C; ")+
   sourceMrProjection[code].priced+" lines with numeric extended evidence; "+
   sourceMrProjection[code].unresolved+" unresolved; "+description
 });
 const workingSummary={
  A1:{amount:a1Equipment,
   source:"MR0001 TAG Cost Ledger → system-location-mto; A1 is the full allocated amount including bulk. A5 is a non-additive disclosure only",
   status:"WORKING ALLOCATED EQUIPMENT/BULK — INCLUDES A5; same MR0001 BOM total; NOT full A+B+C"},
  A2:sourceLine("A2","MR0002 vendor working lines; engineering/source gates retained"),
  A3:sourceLine("A3","Selected MGW R2 Gai-Tronics 212-02-6008-410, EATON DB3B and WAROM BXJ-S; 4 sites, external field bulk unpriced"),
  A4:sourceLine("A4","Selected MGW R2 Tideland SeaBeacon 2 System 6; 3 sites, DB-5P included, control/bulk pending"),
  A5:{amount:a5.a5PriceTHB,source:a5.source+"; exact "+a5.rowCount+" source MTO Bulk cost-owner rows; A1→A5 display reclassification only",
   status:"INCLUDED IN A1 — NON-ADDITIVE MEMO ONLY; "+a5.state+"; "+a5Unpriced+" remaining field-bulk/accessory evidence gaps"}
 };
 // Fail visibly rather than silently subtract unrelated or excess A5 rates.
 if(Number.isFinite(a1Combined)&&Number.isFinite(a5.a5PriceTHB)&&a5.a5PriceTHB>a1Combined){
  workingSummary.A1={amount:null,source:workingSummary.A1.source,
   status:"RECONCILIATION ERROR — A5 exceeds MR0001 source allocated ledger"};
 }

 // The workbook consumes this exact Scope projection; there is no second A/B/C ledger.
 if(view==="part-a"||view==="summary"){
  const codes=view==="part-a"?["A1","A2","A3","A4","A5"]:REV08_BASELINE.summary.map(row=>row[0]);
  const linkedCodes=new Set(SCOPE_BC_DETAIL_CODES_0553);
  return <section className="p55-panel" data-component-key={"bid.budget.summary.workbook.scope-of-supply"+(view==="part-a"?".part_a":"")}>
   <h4>{view==="part-a"?"Part A — MR-based Scope of Supply (same canonical Scope view)":"Scope of Supply — Linked A/B/C Working View"}</h4>
   <p className="p55-note">SOURCE: PJ2608-0553 / bid.budget.scope · Equipment values from canonical MR/location BOM; B/C current WBS sell references or unpriced turnkey cost requirements from 10.2. Historical child schedules are audit-only. THB only. Reference prices and unverified amounts are not approved customer sell.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Ref / MR</th><th>Description</th><th>Qty / Basis</th><th>Working Unit THB / LS</th><th>Working Budgetary THB</th><th>Historical Rev08 Reference THB — NOT Cost</th><th>Source / Engineering & Cost Status</th></tr></thead><tbody>
    {REV08_BASELINE.summary.filter(([id])=>codes.includes(id)).map(([id,desc])=>{
     const control=scopeBC.lines[id]||null;
     const working=workingSummary[id]||null;
     const child=linkedCodes.has(id)?scopeSheetSources[id]:null;
     const audit=scopePriceAudit.byCode[id]||null;
     const amount=working?working.amount:control?.workingSellTHB; // Current scope view never substitutes Rev08 price
     const mr={A1:"MR-0001",A2:"MR-0002",A3:"MR-0003",A4:"MR-0004",A5:"MR-0001–0004 / Bulk"}[id]||"";
     const qty=id==="A5"?"1 LS ("+a5.rowCount+" MTO lots)":child?.quantity?"1 LS (Rev08: "+child.quantity+" historical item rows)":control?.qty!=null&&Number.isFinite(control.qty)?control.qty+" "+control.unit:"1 LS";
     return <tr key={id}><td><strong>{id}</strong>{mr&&<small>{mr}</small>}</td><td>{desc}</td><td>{qty}</td>
      <td className="is-number">{id==="A5"&&Number.isFinite(amount)?"Included in A1 ("+cash(amount)+")":Number.isFinite(amount)?cash(amount):"Cost source pending"}</td>
      <td className="is-number">{id==="A5"?"INCLUDED IN A1 · NOT ADDITIVE":Number.isFinite(amount)?cash(amount):"Not established"}</td>
      <td className="is-number">{audit?cash(audit.historicalReferenceTHB):"—"}<small>{audit?"HISTORICAL REV08 ONLY":"—"}</small></td>
      <td>{child?.quantity?"CURRENT TURNKEY COST NOT ESTABLISHED · historical child detail is audit-only":working?working.status:control?.priceStatus||"No current verified cost"}
       <small>{child?.source||working?.source||control?.source||"No current source"}{mr?" · "+mr:""}</small></td>
     </tr>;
    })}
   </tbody></table></div>
  </section>;
 }
 return <section className="p55-panel" data-component-key="bid.budget.scope">
  <div className="p55-eyebrow">SCOPE SHEETS / REFERENCED DETAIL <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.scope"/></div>
  <h3>Scope of Supply — Linked Internal Detail</h3>
  <p className="p55-note">Original uploaded workbook has 6 tabs, including unpriced template cells. Historical Rev08 amounts below are kept separate from original cells, current vendor cost and new bid selling price.</p>
  <ScopeCategoryTabs0553 value={category[1]==="A/B/C"?"ALL":category[1]}
   onChange={code=>setSheet(code==="ALL"?"Scope of supply":SHEETS.find(row=>row[1]===code)?.[0]||"Scope of supply")}/>
  <p className="p55-note"><strong>Selected sheet:</strong> {sheet} · <ComponentCopyId projectId="PJ2608-0553" componentKey={sheet==="Scope of supply"?"bid.budget.scope":"bid.budget.scope."+category[1].toLowerCase()}/> · Rev08 historical detail is reference only, not current vendor cost or an authorized sell price.</p>
  <p className="p55-note">{category[2]}</p>
  <p className="p55-note"><strong>Price basis:</strong> 10.2 B/C working SELL and validated COST (where present) shown separately from original Rev08 historical USD→THB references. Not additive and not a released quote.</p>
  <p className="p55-note" data-component-key="bid.budget.scope.b9.optional-yard-ls"><strong>B9 CUSTOMER BASE 1 LS — EXECUTION ON WRITTEN CALL-OUT:</strong> 1 LS · Two-person on-call Zhuhai Yard Configuration / Interface Integration / Troubleshooting / Yard SAT Technical Assistance; each 7 working days + 2 travel days, inclusive of mobilisation, return journey, accommodation and technical-work cover. <strong>{cash(selectB9ChinaWorkingBudget0553().conditionalYardSellTHB)}</strong>. Trigger: written JUTAL/SAMTEL call-out / signed RACI. The price covers TWO paid staff: one Senior Telecom Engineer (USD700/MD) and one Field Telecom Technician (USD600/MD), each for 7 Yard working days + 2 travel days, with two-person travel and accommodation included once. CCL Item 31 original 18 Yard / 45 Offshore days remain a separate unresolved scope allocation; no additional B3 FAT witness cost is added here. This same B9 source Working SELL is included ONCE in Part B Base, not added as a second option; this is not a signed/released quotation.</p>
  {sheet==="Scope of supply"&&scopeBC.lines.B3?.b3GroupTrace&&
   <details className="p55-panel p553-b3-scope-trace" style={{padding:12,margin:"10px 0"}}
    data-component-key="bid.budget.scope.b3.group-trace">
    <summary style={{cursor:"pointer",fontWeight:750}}>B3 — FAT / SITE SURVEY / SAT / TOOLS · Source-to-Scope (Working SELL {cash(scopeBC.lines.B3.workingSellTHB)})</summary>
    <p className="p55-note">10.5 SOW-B3 1 LS is derived from canonical 10.2 WS-B3.
     These four group subtotals are audit attribution ONLY — not four additional customer rows.
     CP-B3 Customer Release remains NOT ISSUED; BF physical survey conditional, RACI/Direct Cost open.</p>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>10.2 Work Type Source</th><th>Working SELL THB</th><th>10.5 Scope Attribution THB</th>
      <th>Execution & Approval / Cost State</th></tr></thead>
     <tbody>{scopeBC.lines.B3.b3GroupTrace.map(g=><tr key={g.id}>
      <td><strong>{g.name}</strong><small>{g.sourceModuleId}</small></td>
      <td>{cash(g.workingSellTHB)}</td><td>{cash(g.scopeWorkingSellAttributionTHB)}</td>
      <td>{g.status}<small>{g.approvalGate}</small><small>Direct Cost NOT ESTABLISHED · no independent customer line</small></td>
     </tr>)}</tbody>
     <tfoot><tr><th>SOW-B3 · 1 LS · Release HOLD</th>
      <th>{cash(scopeBC.lines.B3.workingSellTHB)}</th><th>{cash(scopeBC.lines.B3.amountTHB)}</th>
      <th>WS-B3 = CP-B3 Preview = SOW-B3 · NO DOUBLE POST</th></tr></tfoot>
    </table></div>
   </details>}
  {sheet==="Scope of supply"?<div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Ref.</th><th>Description</th><th>Qty</th><th>Current Working Unit THB (A COST / B SELL)</th><th>Current Working Amount THB (A COST / B SELL)</th><th>Historical Rev08 Reference THB — NOT Cost</th><th>Source / Engineering &amp; Cost Status</th></tr></thead>
  <tbody>{sheet==="Scope of supply"?summary.map(([id,desc])=>{
   const control=scopeBC.lines[id]||null;
   const item=workingSummary[id]||(control?{amount:control.amountTHB,
    status:control.priceType+" · "+control.priceStatus+" · "+control.requirement,
    source:control.basis+" · OWNER: "+control.owner+" · "+control.source+" · EQUATIONS: "+(control.equations.join(", ")||"source schedule required")}:null),amount=item?.amount;
   const unavailable=id==="A5"?"A5 source/ledger reconciliation required":item?.status?.includes("MGW PRICE EXCLUDED")?"Selected rate required":fxValid?"Cost source pending":"Awaiting FX";
   const childSource=scopeSheetSources[id]||null;
   const hasChild=Boolean(childSource&&childSource.quantity>0);
   const audited=scopePriceAudit.byCode[id]||null;
   const shownAmount=amount;
   const qtyDisplay=id==="A5"?"1 LS ("+a5.rowCount+"/"+a5.expectedMtoBulkLots+" source Bulk MTO lots traced)":
    hasChild?"1 LS (Rev08: "+childSource.quantity+" unverified historical item rows)":control?.qty!==null&&Number.isFinite(control?.qty)?control.qty+" "+control.unit:control?.unit||"1 LS (working basis)";
   return <tr key={id}><td>{audited?<button type="button" className="p553-detail-button" onClick={()=>setSheet(SHEETS.find(row=>row[1]===id)[0])}>{id} — View Details</button>:id}</td><td>{desc}</td><td>{qtyDisplay}</td>
    <td className="is-number">{id==="A5"&&Number.isFinite(amount)?"Included in A1 ("+cash(amount)+")":Number.isFinite(control?.unitRateTHB)?"WORKING SELL "+cash(control.unitRateTHB):Number.isFinite(amount)?cash(amount):unavailable}</td>
    <td className="is-number">{id==="A5"&&Number.isFinite(amount)?"INCLUDED IN A1 · NOT ADDITIVE":Number.isFinite(shownAmount)?(control?"WORKING SELL "+cash(shownAmount):cash(shownAmount)):control?"Current owner / OEM price not established":unavailable}</td>
    <td className="is-number">{audited?cash(audited.historicalReferenceTHB):"—"}<small>{audited?"Rev08 HISTORICAL ONLY — not additive":""}</small></td>
    <td>{control&&<small><strong>{control.financialIdentity.scopeId}</strong> Scope ·
     <strong> {control.financialIdentity.workingSellId}</strong> Working SELL ·
     <strong> {control.financialIdentity.customerProposalId}</strong> NOT ISSUED
     {Number.isFinite(control.financialIdentity.mgwPurchasedWorkingSellTHB)&&
      " · VQ-MGW-SERV-2 / SERV-4 supplier quotation → WS-B3 MGW Purchased THB "+
       control.financialIdentity.mgwPurchasedWorkingSellTHB.toLocaleString("en-US")}</small>}
     {hasChild?<><strong>{id} · CURRENT TURNKEY COST NOT ESTABLISHED (historical detail is audit-only)</strong><small>{childSource.source} · {childSource.quantity} historical rows · Rev08 rates available in original audit detail, never posted to current turnkey cost · OEM verification: {control?.priceStatus} · {id.startsWith("C")?"OPTION — NOT INCLUDED IN BASE": "REFERENCE — NOT ADDED TO CURRENT WORKING SELL"}</small></>:
     (id==="B12"||id==="B14")?<><strong>NO ITEMIZED CHILD-SHEET PRICE</strong><small>{id==="B12"?"First-filling applicability and supplier scope must be verified; historical summary zero is not accepted as a verified cost.":"Insurance/bond premium and insured-value evidence required; historical Rev08 summary is not an itemized vendor quotation."} {control?.priceStatus}</small></>:
     item?<>{item.status}<small>{item.source}</small></>:"Non-A scope: separate cost derivation required"}</td></tr>;
  }):details.map(row=><tr key={row.id}><td>{row.id}</td><td>{row.description}</td><td>{row.qty}</td>
    <td className="is-number">{Number.isFinite(row.unitTHB)?cash(row.unitTHB):"Awaiting FX"}</td>
    <td className="is-number">{Number.isFinite(row.totalTHB)?cash(row.totalTHB):"Awaiting FX"}</td>
    <td>Rev08 historical worksheet reference · OEM verification separate</td></tr>)}</tbody></table></div>:<ScopeBcAnnexDetail0553 code={category[1]} fx={fx}/>}
  {sheet==="Scope of supply"&&<details className="p55-panel" data-component-key="bid.budget.scope.a5" open={false}>
   <summary style={{cursor:"pointer",fontWeight:700}}>A5 Bulk Materials — Source-MTO Price Attribution / Drill-down ({a5.rowCount} lots)</summary>
   <p className="p55-note">A5 Working Priced Floor: <strong>{cash(a5.a5PriceTHB)}</strong>.
    From existing MR0001 Bulk MTO cost owners, not new vendor charges. A1 already includes this A5 amount; A5 is shown for attribution only and MUST NOT be summed into A1 or A+B+C again. Original working ledgers and quotations remain unchanged.
    Original customer scope remains 1 LS. All sites priced only for 69m CAT6A + 1 M20 gland per priced management route assumption, not a complete O&G bulk take-off.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Site / Original MTO</th><th>TAG / Engineering quantity</th><th>Priced Cost Evidence</th><th>Working Amount THB</th><th>Owner / Qualification</th></tr></thead><tbody>
    {a5.rows.map(row=><tr key={row.site+"-"+row.sourceRow}>
     <td><strong>{row.site}</strong><small>MTO extract index {row.sourceRow}; native workbook row number must be verified</small></td>
     <td><strong>{row.tag} · 1 Lot</strong><small>{row.components.map(c=>c.qty+" "+c.unit+" "+c.sku).join(" + ")}</small></td>
     <td>{row.components.map((c,i)=><small key={i}>{c.sku}: {c.qty} × THB {usd(c.rateTHB)} = THB {usd(c.extendedTHB)}</small>)}<small>{row.source}</small></td>
     <td className="is-number"><strong>{cash(row.workingCostTHB)}</strong></td>
     <td><strong>{row.status}</strong><small>{row.costOwner} → A5 display only</small></td>
    </tr>)}
    </tbody></table></div>
   <p className="p55-note"><strong>Source Ledger reconciliation:</strong>
    {a5LedgerReconciled?" PASS — A1 displayed is gross (A5 included); A1 net of attributed bulk + A5 memo equals original MR0001 ledger. A5 is NON-ADDITIVE":
      !fxValid?" FX required to verify displayed A1+A5 in THB":
      " NOT RECONCILED — do not release A5 or Grand Total"}
    . Missing physical functions/rates: {a5Unpriced} observations; standalone SCADA CAT6A mirrors and DATO already-owned price are not added.
    Other-system rate evidence (if any): {a5.otherPricedCandidates.length} candidates held for cost owner review.
   </p>
   {a5.problems.length>0&&<p role="alert">A5 attribution ERROR: {a5.problems.map(x=>x.site+" "+x.message).join("; ")}</p>}
   <details><summary>Unpriced system bulk / accessories ({a5Unpriced})</summary>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Site</th><th>System</th><th>Item / Function</th><th>Quantity</th><th>Rate</th><th>Missing evidence / owner</th></tr></thead><tbody>
    {[...a5.unresolved,...a5.unknownScadaAccessories].map((row,i)=><tr key={row.site+"-"+row.system+"-"+row.id+"-"+i}>
     <td>{row.site}</td><td>{row.system}</td><td>{row.id}<small>{row.item}</small></td><td>{row.qty??"NOT VERIFIED"}</td><td>{Number.isFinite(row.rateTHB)?cash(row.rateTHB):"NOT PRICED"}</td>
     <td>{row.status}<small>{row.source||""}</small></td>
    </tr>)}
    </tbody></table></div>
   </details>
  </details>}
  {sheet==="Scope of supply"&&<p className="p55-note"><strong>Part B WBS Working Sell Reference (B1/B2/B3/B8/B9 only — NOT turnkey direct cost):</strong> {cash(scopeBC.knownAddvalueWorkingSellTHB)} from source-linked Rev05 WBS, not internal direct cost or full SAMTEL client price. Unpriced B/C amounts are unknown, never zero. B4–B7, B10–B14 and C1–C2 are owner-controlled excluded/optional lines; unresolved owner quotation must NOT be interpreted as zero. <a href={scopeBC.sourceUrl} target="_blank" rel="noreferrer">WBS Rev05 original</a>.</p>}
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
