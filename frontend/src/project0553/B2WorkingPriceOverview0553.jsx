import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectBcB1B2EquationExecution0553} from "./data/bcB1B2EquationExecution0553";
import {findModuleElement0553,openModuleAncestors0553} from "./data/moduleDeepLink0553";

// Read-only B2 first-visible summary, same presentation pattern as B1.
// No backsolved per-MR/document prices, invented hours, unit rates or payroll.
// 580,000 THB is a source quotation for ONE project-wide B2 package.
const ROOT="bid.budget.working.bc.b2";
const showAmount=x=>Number.isFinite(x)?"THB "+x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const MR_LIST=Object.freeze(["MR-0001","MR-0002","MR-0003","MR-0004"]);
const MR_COUNTS=Object.freeze([37,36,35,35]);

export function B2WorkingPriceOverview0553({workingRow}){
 if(!workingRow||workingRow.code!=="B2")return null;
 const source=selectBcB1B2EquationExecution0553();
 const by=source.byMr;
 if(workingRow.moduleId!==ROOT||workingRow.workingSellTHB!==580000||
  source.b2WorkingSellTHB!==workingRow.workingSellTHB||
  source.totals.sourceRows!==143||source.totals.uniqueTitleTypes!==38||
  workingRow.qtyDriver!==143||workingRow.directCostTHB!==null||
  source.b2CalculatedMH!==null||source.b2VerifiedCostTHB!==null)
  throw Error("B2 visible detail must retain 143 requirements, 580000 LS and unknown actual MH/cost");
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
  <div className="p55-eyebrow">10.2 / B2 — DOCUMENTATION QUANTITY &amp; PRICE AUTHORITY (READ ONLY)</div>
  <h3>B2 — Document Requirements × Resource Hours × Price Trace</h3>
  <p className="p55-note"><strong>Module ID:</strong>
   {" "}<ComponentCopyId projectId="PJ2608-0553" componentKey={ROOT+".price-overview"}/>
   {" "}· Source Cost Owner <ComponentCopyId projectId="PJ2608-0553" componentKey={ROOT}/></p>
  <div className="p55-metric-grid">
   <div><strong>Current B2 Working SELL</strong><p>{showAmount(workingRow.workingSellTHB)}</p>
    <small>Project-wide 1 LS · WBS source quotation</small></div>
   <div><strong>Source Requirement Rows</strong><p>{source.totals.sourceRows}</p>
    <small>MR0001–0004 Table 11 obligations</small></div>
   <div><strong>Unique Document Title Types</strong><p>{source.totals.uniqueTitleTypes}</p>
    <small>Not unique document instances</small></div>
   <div><strong>Verified Document MH / Direct Cost</strong><p>NOT ESTABLISHED</p>
    <small>Review cycles, allocated roles and current rates are open</small></div>
  </div>
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
     <td>{showAmount(workingRow.workingSellTHB)} / LS</td>
     <td><strong>{showAmount(workingRow.workingSellTHB)}</strong></td>
     <td>Quoted lump sum only — NOT a derived document-rate calculation</td>
    </tr></tbody>
   </table></div>
   <p className="p55-note"><strong>Pricing reconciliation:</strong> 1 LS ×
    {" "}{showAmount(workingRow.workingSellTHB)} / LS =
    {" "}<strong>{showAmount(workingRow.workingSellTHB)}</strong>.
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
