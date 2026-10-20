import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectBcB1B2EquationExecution0553} from "./data/bcB1B2EquationExecution0553";
import {selectB2OriginalWorkbookPriceEvidence0553} from "./data/b2OriginalWorkbookPriceEvidence0553";
import {findModuleElement0553,openModuleAncestors0553} from "./data/moduleDeepLink0553";

// Read-only B2 first-visible summary, same presentation pattern as B1.
// No backsolved per-MR/document prices, invented hours, unit rates or payroll.
// 580,000 THB is a source quotation for ONE project-wide B2 package.
const ROOT="bid.budget.working.bc.b2";
const showAmount=x=>Number.isFinite(x)?"THB "+x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const copyHeader=id=><span className="p553-price-trace-copy"
 onClick={e=>{e.preventDefault();e.stopPropagation();}}
 onKeyDown={e=>e.stopPropagation()}>
 <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>
 </span>;
const MR_LIST=Object.freeze(["MR-0001","MR-0002","MR-0003","MR-0004"]);
const MR_COUNTS=Object.freeze([37,36,35,35]);

export function B2WorkingPriceOverview0553({workingRow}){
 if(!workingRow||workingRow.code!=="B2")return null;
 const source=selectBcB1B2EquationExecution0553();
 const quote=selectB2OriginalWorkbookPriceEvidence0553();
 const by=source.byMr;
 if(workingRow.moduleId!==ROOT||quote.quote.currentWorkingSellTHB!==580000||
  source.b2WorkingSellTHB!==quote.quote.currentWorkingSellTHB||
  source.totals.sourceRows!==143||source.totals.uniqueTitleTypes!==38||
  workingRow.qtyDriver!==143||workingRow.directCostTHB!==null||
  source.b2CalculatedMH!==null||source.b2VerifiedCostTHB!==null)
  throw Error("B2 historical Rev05 comparison must retain 143 source requirements and 580000 old quoted LS");
 const rows=MR_LIST.map((mr,i)=>{
  const group=by[mr];
  if(!group||group.sourceRows!==MR_COUNTS[i])throw Error("B2 VDRL MR source discrepancy: "+mr);
  return {mr,id:ROOT+".price-trace.vdrl."+mr.toLowerCase(),group};
 });
 if(rows.reduce((sum,r)=>sum+r.group.sourceRows,0)!==143)
  throw Error("B2 MR source quantities must total 143 exactly once");

 const drill=mrId=>{
  const node=typeof document==="undefined"?null:findModuleElement0553(document,mrId);
  if(!node)return;
  openModuleAncestors0553(node);
  if(node.tagName==="DETAILS")node.open=true;
  node.classList?.add("p553-module-nav-focus");
  node.scrollIntoView?.({behavior:"smooth",block:"start"});
 };
 return <section className="p55-panel p553-b2-price-overview"
  data-component-key={ROOT+".price-overview"} style={{padding:12,marginTop:12}}>
  <div className="p55-eyebrow">10.2 / B2 — SUPERSEDED REV05 QUOTATION EVIDENCE ONLY (READ ONLY)</div>
  <h3>B2 — Document Requirements × Resource Hours × Price Trace</h3>
  <p className="p55-note"><strong>Module ID:</strong>
   {" "}<ComponentCopyId projectId="PJ2608-0553" componentKey={ROOT+".price-overview"}/>
   {" "}· Source Cost Owner <ComponentCopyId projectId="PJ2608-0553" componentKey={ROOT}/></p>
  <div className="p55-metric-grid">
   <div><strong>Rev05 Original B2 Quoted SELL — SUPERSEDED</strong><p>{showAmount(quote.quote.currentWorkingSellTHB)}</p>
    <small>Not current 10.2 B2 selected Working SELL. For historical comparison only.</small></div>
   <div><strong>Source Requirement Rows</strong><p>{source.totals.sourceRows}</p>
    <small>MR0001–0004 Table 11 obligations</small></div>
   <div><strong>Unique Document Title Types</strong><p>{source.totals.uniqueTitleTypes}</p>
    <small>Not unique document instances</small></div>
   <div><strong>Verified Document MH / Direct Cost</strong><p>NOT ESTABLISHED</p>
    <small>Review cycles, allocated roles and current rates are open</small></div>
  </div>
  <section className="p553-b2-original-price-build" data-component-key={ROOT+".price-overview.original-source"}>
   <h4>B2 — Original Source Price Breakdown / รายละเอียดจาก Workbook จริง</h4>
   <p className="p55-note"><strong>Source hierarchy:</strong> Rev05 quoted B2
    <strong> {showAmount(quote.quote.currentWorkingSellTHB)}</strong>;
    the earlier Rev00a / Rev00d provisional estimation comprises
    {showAmount(quote.temporaryRev00a.roundedWorkingSellTHB)} + 
    {showAmount(quote.rev00d.roundedAdditionTHB)} =
    <strong> {showAmount(quote.rev00d.revisedTemporarySellTHB)}</strong>;
    unexplained gap to current quote
    <strong> {showAmount(quote.unreconciledWorkingSellDifferenceTHB)}</strong>.
    This gap is NOT a priced activity, provision, or approved cost.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Source / Revision</th><th>Quantity / Basis</th>
     <th>Working SELL THB</th><th>Authority / Price Status</th></tr></thead>
    <tbody>
     <tr><td><a href={quote.sources.rolePrice.url} target="_blank" rel="noreferrer">
      Rev00a / Rev00b · Core MR VDRL</a></td>
      <td>{quote.workingMH.toFixed(2)} provisional MH / {quote.documentScope.provisionalUniqueWorkObjects} provisional WOs</td>
      <td>{showAmount(quote.temporaryRev00a.roundedWorkingSellTHB)}</td>
      <td>TEMP_ESTIMATING; 2.744× proxy; excludes later document-cycle tasks</td></tr>
     <tr><td><a href={quote.sources.extraPrice.url} target="_blank" rel="noreferrer">
      Rev00d · N-01…N-04 New B2 document work</a></td>
      <td>4 source-priced additional work types; see nested itemization below</td>
      <td>{showAmount(quote.rev00d.roundedAdditionTHB)}</td>
      <td>TEMP_PRUDENT rounded from calculated {showAmount(quote.rev00d.additionalDocumentCalculatedSellTHB)}</td></tr>
     <tr><td><strong>Rev00d provisional combined</strong></td>
      <td>Rev00a core + Rev00d new B2-only lines</td>
      <td><strong>{showAmount(quote.rev00d.revisedTemporarySellTHB)}</strong></td>
      <td>Prior revision; not controlling customer quote</td></tr>
     <tr><td><strong>Unreconciled price change</strong></td>
      <td>Current Rev05 minus Rev00d provisional combined</td>
      <td><strong>{showAmount(quote.unreconciledWorkingSellDifferenceTHB)}</strong></td>
      <td><strong>SOURCE GAP — no itemized additional work identified</strong></td></tr>
     <tr><td><a href={quote.quote.url} target="_blank" rel="noreferrer">
      <strong>Rev05 Historical B2 — SUPERSEDED</strong></a></td>
      <td>1 project-wide B2 LS</td>
      <td><strong>{showAmount(quote.quote.currentWorkingSellTHB)}</strong></td>
      <td>Historical SELL only / verified Direct Cost NOT ESTABLISHED</td></tr>
    </tbody>
   </table></div>

   <details className="p553-bc-price-doc-group"
    data-component-key={ROOT+".price-overview.role-cost-build"} defaultOpen>
    <summary className="p553-bc-price-leaf-head">
     <span className="p553-bc-price-num">B2.P1</span>
     <span className="p553-bc-price-leaf-label"><strong>Rev00a — 5 Roles × Provisional MH × Historical THB/MH</strong>
      <small>964.28 MH / {showAmount(quote.roleCostProxyTotalTHB)} historical input cost proxy; NOT current Direct Cost</small>
      <code>{ROOT+".price-overview.role-cost-build"}</code></span>
     {copyHeader(ROOT+".price-overview.role-cost-build")}
    </summary>
    <div className="p553-bc-price-leaf-body">
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Role / Description</th><th>MH (provisional)</th><th>Historic Unit Rate THB/MH</th>
       <th>Historical Cost Proxy THB</th><th>Evidence / Status</th></tr></thead>
      <tbody>{quote.roleWorkload.map(x=><tr key={x.id}>
       <td><strong>{x.role}</strong><small>{x.id}</small></td>
       <td>{x.mh.toFixed(3)} MH</td>
       <td>{showAmount(x.historicalInputRateTHBPerMH)}</td>
       <td>{showAmount(x.historicalCostTHB)}</td>
       <td>Rev00a role MH × historical AWP45 seed · HUMAN REVIEW REQUIRED</td>
      </tr>)}</tbody>
      <tfoot><tr><th>Core historical role cost</th><th>{quote.workingMH.toFixed(3)} MH</th>
       <th>Mixed role rates</th><th>{showAmount(quote.roleCostProxyTotalTHB)}</th>
       <th>Rev00a temporary SELL {showAmount(quote.temporaryRev00a.roundedWorkingSellTHB)}</th>
      </tr></tfoot>
     </table></div>
     <p className="p55-note">Rev00a temporary pricing:
      historical cost {showAmount(quote.temporaryRev00a.coreHistoricalDirectCostProxyTHB)}
      {" "}× 2.744 = {showAmount(quote.temporaryRev00a.unroundedWorkingSellTHB)}
      {" "}→ rounded to {showAmount(quote.temporaryRev00a.roundedWorkingSellTHB)}.
      These are real entries in the older model, NOT validated current payroll or a required margin.</p>
    </div>
   </details>

   <details className="p553-bc-price-doc-group"
    data-component-key={ROOT+".price-overview.new-doc-build"} defaultOpen>
    <summary className="p553-bc-price-leaf-head">
     <span className="p553-bc-price-num">B2.P2</span>
     <span className="p553-bc-price-leaf-label"><strong>Rev00d — N-01…N-04 VDRS / Final / DDP New Document Cost</strong>
      <small>{showAmount(quote.extraCostProxyTotalTHB)} direct cost proxy; calculated SELL
       {" "}{showAmount(quote.extraCalculatedSellTotalTHB)} → rounded 120,000 Working SELL</small>
      <code>{ROOT+".price-overview.new-doc-build"}</code></span>
     {copyHeader(ROOT+".price-overview.new-doc-build")}
    </summary>
    <div className="p553-bc-price-leaf-body">
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1120}}>
      <thead><tr><th>WBS / Work Type</th><th>Basis / Qty Driver</th><th>DC MH</th>
       <th>Engineer MH</th><th>Senior MH</th><th>Draft MH</th>
       <th>External Cost THB</th><th>Source Cost Proxy THB</th><th>Calculated SELL THB</th></tr></thead>
      <tbody>{quote.additionalDocumentScope.map(x=><tr key={x.id}>
       <td><strong>{x.id} — {x.scope}</strong></td><td>{x.driver}</td>
       <td>{x.dcMH}</td><td>{x.engineerMH}</td><td>{x.seniorMH}</td><td>{x.drafterMH}</td>
       <td>{showAmount(x.externalDirectTHB)}</td>
       <td>{showAmount(x.directCostProxyTHB)}</td>
       <td>{showAmount(x.sellCalculatedTHB)}</td>
      </tr>)}</tbody>
      <tfoot><tr><th colSpan={7}>Rev00d B2 additional-only subtotal</th>
       <th>{showAmount(quote.extraCostProxyTotalTHB)}</th>
       <th>{showAmount(quote.extraCalculatedSellTotalTHB)}</th>
      </tr></tfoot>
     </table></div>
     <p className="p55-note">Commercial rounding in Rev00d: 119,500.84 → 120,000.
      N-05…N-10 admin/regulatory 140,000, N-11…N-14 B3/B9 test-support 80,000
      and optional N-15 10,000 are <strong>OTHER COST OWNERS / NOT INCLUDED</strong>
      in B2 additional pricing.</p>
    </div>
   </details>
   <p className="p55-note">
    <a href={quote.sources.boundedCost.url} target="_blank" rel="noreferrer">Independent Rev02 bounded B2 historical cost proxy</a>:
    {" "}{showAmount(quote.rev02CostProxy.lowTHB)}–{showAmount(quote.rev02CostProxy.highTHB)}.
    This is a separate sensitivity/source revision, NOT an additional line on top of
    Rev00d and NOT independently verified current Direct Cost.</p>
   <p className="p55-note"><strong>Unresolved pricing authority:</strong>
    The Rev05 THB 580,000 quote remains unchanged, but the specific
    THB 20,000 bridge versus Rev00d THB 560,000 is not itemized in the inspected
    source. It must stay a reconciliation gap until a later controlled WBS/quotation
    proves the difference. No proportional allocation to MR0001–MR0004 or VDRL IDs.</p>
  </section>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact p553-b2-price-overview-table"
   style={{width:"100%",minWidth:1080}}>
   <thead><tr><th>MR / Document Module ID</th><th>System / VDRL Work</th>
    <th>Source Qty</th><th>Document Instances / Issue Cycles</th>
    <th>Document Control MH / Rate</th><th>Allocated Working SELL THB</th>
    <th>Document List / Qty × Rate Detail</th></tr></thead>
   <tbody>{rows.map(({mr,id,group},i)=><tr key={mr}>
    <td><strong>{"B2.1."+(i+1)} · {mr}</strong><small>{id}</small>
     <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/></td>
    <td><strong>{group.rows[0]?.system}</strong>
     <small>Original Table 11 · Document Control lifecycle (B2); technical authorship OEM/B1/B3 as applicable</small></td>
    <td><strong>{group.sourceRows} requirement rows</strong>
     <small>Approval A: {group.A}, I: {group.I}, other: {group.blank}</small></td>
    <td>NOT ESTABLISHED
     <small>One contract row is not proof of one actual issued document</small></td>
    <td>NOT ESTABLISHED
     <small>Role / MH / current rate requires approved document WBS</small></td>
    <td><strong>NOT SEPARATELY ALLOCATED</strong>
     <small>Included in the same B2 1 LS quote; do not sum per-MR estimates</small></td>
    <td><button type="button" className="p553-detail-button"
     onClick={()=>drill(id)}>＋ {mr} View  {group.sourceRows} Documents</button></td>
   </tr>)}</tbody>
   <tfoot>
    <tr><th colSpan={2}>TOTAL B2 — project-wide documentation package</th>
     <th>143 source rows</th><th>Not established</th><th>Not established</th>
     <th>{showAmount(workingRow.workingSellTHB)}</th><th>ONE B2 Working SELL posting</th></tr>
   </tfoot>
  </table></div>
  <section className="p553-b2-commercial-proof" data-component-key={ROOT+".price-overview.lump-sum-proof"}>
   <h4>Price Formula / Authority — what can actually be reconciled?</h4>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Commercial Quantity</th><th>Working SELL / LS</th>
     <th>Current Working SELL THB</th><th>Derivation Status</th></tr></thead>
    <tbody><tr><td><strong>1 project-wide B2 package (LS)</strong>
      <small>Includes applicable VDRL/VDRS, transmittals, reviews and final dossier</small></td>
     <td>{showAmount(quote.quote.currentWorkingSellTHB)} / LS (Rev05 historical)</td>
     <td><strong>{showAmount(quote.quote.currentWorkingSellTHB)}</strong></td>
     <td>Quoted lump sum only — NOT a derived document-rate calculation</td>
    </tr></tbody>
   </table></div>
   <p className="p55-note"><strong>Pricing reconciliation:</strong> 1 LS ×
    {" "}{showAmount(quote.quote.currentWorkingSellTHB)} / LS =
    {" "}<strong>{showAmount(quote.quote.currentWorkingSellTHB)}</strong> (Rev05 reference only).
    This restates the selected source quotation; it does NOT establish paid cost,
    document-level SELL, number of hours, document instances or review cycles.
    Never divide THB 580,000 by 143 requirements or 38 title types and present it
    as a measured rate. The corresponding B2.1 MR/document rows below are scope evidence only.</p>
   <p className="p55-note"><strong>Historical reference only:</strong>
    {" "}Rev04 direct-cost proxy THB 202,717.25–208,217.25 and original rate seeds
    are available in B2.2 / B2.3. They do not prove today's payroll or how this B2
    lump sum was priced. Current verified Direct Cost remains NOT ESTABLISHED.</p>
  </section>
 </section>;
}
