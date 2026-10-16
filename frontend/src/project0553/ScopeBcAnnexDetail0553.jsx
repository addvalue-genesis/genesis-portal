import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectScopeBcPriceAudit0553} from "./data/scopeBcPriceAudit0553";
import {selectUnifiedSpareConsumables0553} from "./data/unifiedSpareConsumables0553";
import {selectSpareCoverageEngineering0553} from "./data/spareCoverageEngineering0553";

const thb=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const usd=n=>Number.isFinite(n)?"USD "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"NOT ESTABLISHED";
export function ScopeBcAnnexDetail0553({code,fx=null,mode="scope"}){
 const m=selectScopeBcPriceAudit0553({thbPerUsd:fx?.thbPerUsd});
 const p=m.byCode[code];
 const shared=selectUnifiedSpareConsumables0553();
 const spareLines=shared.byCode[code]||[];
 const coverage=["B10","B13","C1","C2"].includes(code)?selectSpareCoverageEngineering0553():null;
 const inWorking=mode==="working";
 const moduleId=inWorking?"bid.budget.working.bc."+String(code||"").toLowerCase()+".detail":p?.moduleId;
 if(!p)return <p role="alert">Unsupported customer scope code: {code}</p>;
 return <section className="p55-panel" data-component-key={moduleId} style={{padding:14}}>
  <div className="p55-eyebrow">{inWorking?"10.2 WORKING COST DETAIL":"10.5 CUSTOMER SCOPE DETAIL"} · PRICE SOURCE AUDIT (THB display)</div>
  <h3>{p.code} — {p.description}</h3>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={moduleId}/>
   {" "}· Current cost owner: <code>{p.ownerModuleId}</code>
   {" "}· <strong>{p.optional?"PART C OPTION — NOT IN BASE":"PART B — BASE SCOPE REQUIREMENT"}</strong></p>
  <div className="p55-metric-grid">
   <div><strong>Current Turnkey Direct COST</strong><p>{thb(p.directCostTHB)}</p><small>Source-verified Cost Rate × Verified Qty required</small></div>
   <div><strong>Current WBS Working SELL</strong><p>{thb(p.workingSellTHB)}</p><small>Not a current customer quotation</small></div>
   <div><strong>Historical Rev08 Reference</strong><p>{thb(p.historicalReferenceTHB)}</p><small>Native USD source retained for audit · {p.historicalFxState}</small></div>
  </div>
  <p className="p55-note"><strong>Scope price status:</strong> {p.currentPriceState} · {p.costState} · <strong>Historical references must NOT post to the current cost/sell ledger.</strong> {p.controlNote}</p>
  {spareLines.length>0&&<div className="p55-panel" style={{padding:12}}>
   <h4>Customer Schedule — {shared.descriptions[code]} (Engineering Working Preview)</h4>
   <p className="p55-note"><strong>TOP-DOWN TRACE:</strong> {shared.sourceTagRegister} · Existing MTO tags are used where matched to an equipment family; shared spares are grouped COMMON. Budget quantity and THB sell rates come from Rev08 at FX 31.5. OEM compatibility and minimum EXA-A8 coverage remain open.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Item</th><th>Tag No. / Linked MTO Tags</th><th>Description</th><th>Detail Specification</th><th>Materials</th><th>Qty</th><th>Unit Price THB</th><th>Total Price THB</th>{(code==="C1"||code==="C2")&&<th>Lead Time ARO</th>}</tr></thead>
    <tbody>{spareLines.map(x=><tr key={x.id}>
     <td>{x.item}</td><td>{x.customerTagNo}<small>{x.relatedInstalledTags.length?"MTO candidate tags: "+x.relatedInstalledTags.join(", "):"No verified cross-reference yet"}</small><small>{x.relatedLocations.join(", ")}</small></td>
     <td>{x.description}<small>{x.id}</small></td>
     <td>{x.detailSpecification||"Budgetary equivalent to installed equipment; final model/rating per selected OEM"}<small>{x.tagMappingState}</small></td>
     <td>{x.material||"Compatible OEM component / as specified"}</td>
     <td>{x.budgetQty}<small>Budgetary Qty · Rev08 source, not final OEM SPIR</small></td>
     <td>{thb(x.budgetUnitTHB)}</td><td>{thb(x.budgetTotalTHB)}</td>
     {(code==="C1"||code==="C2")&&<td>{x.leadTimeARO||"OEM confirmation required"}</td>}
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note"><strong>PRE-AWARD CATEGORY BUDGET:</strong> {thb(shared.budgetTotalsTHB[code])} · Source: Rev08 historic priced lines × planning FX 31.5 THB/USD · budgetary sell estimate only, no new direct-cost posting. Rounding per line can differ from category source total.</p>
   <p className="p55-note">Linked Tag candidates are not approved spare-to-installed-equipment matches. B10/B13 base and C1/C2 options remain separated. This table is a working engineering view; customer DDP currency and Incoterm conflict must be resolved before release.</p>
  </div>}
  {coverage&&<details className="p55-panel" open={inWorking} style={{padding:12}}>
   <summary><strong>Top-down Engineering Spare Coverage — MR0001–MR0004</strong> (SPQ-001 + existing MAP equations; pre-award scenario only)</summary>
   <p className="p55-note"><strong>Basis:</strong> MR0001 MTO Rev04 / MR0002 AFC TEL-LAY / MR0003–0004 MR Rev.C1 scope. Existing MAP-01/02/05/06/07/08/10 reused; SPQ-001 adds critical-family spare scenario sizing only. A scenario Qty is not an OEM-approved spare quantity or contractual minimum. No prices are newly posted by this assessment.</p>
   {["MR-0001","MR-0002","MR-0003","MR-0004"].map(mr=>{
    const summary=coverage.totals[mr];
    return <details key={mr} className="p55-panel" style={{padding:10}}>
     <summary><strong>{mr}</strong> — {summary.installedTagInstances} site-tag instances / {summary.uniqueTagTypes} equipment tag types / {summary.criticalTagTypes} critical-family candidates</summary>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Installed Tag</th><th>Location / Source</th><th>Replaceable Family</th><th>{code} Scope Assessment</th><th>B10 Budget Risk Qty (scenario)</th><th>Existing Price Reference / Gate</th></tr></thead>
      <tbody>{coverage.groups.filter(x=>x.mr===mr).map(x=><tr key={x.id}>
       <td><strong>{x.tag}</strong><small>{x.criticality}</small></td>
       <td>{x.installedSites.join(", ")}<small>{x.sourceEvidence.join("; ")}</small></td>
       <td>{x.family}<small>{x.interchangeabilityState}</small></td>
       <td>{x.categoryApplicability[code]?"ENGINEERING ASSESSMENT APPLICABLE":"NOT PRIMARY SPARE CLASS"}<small>{x.contractKitMinimumState}</small></td>
       <td>{x.categoryApplicability.B10?x.b10BudgetScenarioQty:"—"}<small>{x.estimatedPartQtyState} · {x.b10QtyEquationId}</small></td>
       <td>{x.budgetaryExistingSourceIds[code]?.length?x.budgetaryExistingSourceIds[code].join(", "):"NO MATCHED REV08 CATEGORY REFERENCE"}<small>Cost evidence is a candidate, not proven interchangeable SKU</small></td>
      </tr>)}</tbody>
     </table></div>
    </details>;
   })}
   <p className="p55-note"><strong>Coverage gate:</strong> Contract minimum EXA-A8 and OEM SPIR composition remain unresolved; major equipment and compatibility gaps stay visible. Part A and B10/B13/C1/C2 must reconcile unique physical delivered quantities before customer release. Working Sell budgets are unchanged.</p>
  </details>}
  <h4>1. Historical Annex Price Lines — Original Rev08 / Not current Vendor Quote</h4>
  {p.historicalHasDetail?
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Legacy Ref</th><th>Historical Item</th><th>Historic Qty</th><th>Historical Unit THB *</th><th>Historical Extended THB *</th><th>Current SKU / Rate Approval</th></tr></thead>
    <tbody>{p.historicalDetailLines.map(x=><tr key={x.id}>
     <td><strong>{x.id}</strong></td><td>{x.description}<small>{x.source}</small></td>
     <td>{x.qty}</td><td>{thb(x.historicalUnitTHB)}</td><td>{thb(x.historicalExtendedTHB)}</td>
     <td><strong>NOT VERIFIED / NOT POSTED</strong><small>OEM SKU, supplier quote, confirmed Qty and cost ownership required</small></td>
    </tr>)}</tbody>
   </table></div>:
   <p className="p55-note"><strong>NO ITEMIZED REV08 ANNEX FOR {p.code}.</strong> Historical summary {thb(p.historicalReferenceTHB)} only (native source in USD); this cannot prove current insured value, premium or direct cost. No invented line items.</p>}
  <p className="p55-note"><strong>Historical Source Reconciliation:</strong> {p.historicalHasDetail?
   (p.historicalReconciled?"PASS — ":"FAIL — ")+p.historicalDetailLines.length+
   " Rev08 lines reconcile with source summary within native USD 0.01 tolerance. Rounded-display lines "+thb(p.historicalDisplayedLineTHBSum)+" vs summary "+thb(p.historicalReferenceTHB)+"; display difference "+thb(p.historicalDisplayedVsSummaryDeltaTHB)+" (historical source precision, no balancing row added)":
   "NO LINE-LEVEL RECONCILIATION — historical summary only"}
   {" "}· THB display at working planning FX {p.historicalFxTHBPerUSD??"NOT PROVIDED"}; not a verified BOT quotation. Original USD and unrounded values remain in the historical source model.</p>
  <h4>2. Current Requirement / Cost Driver from 10.2 — No Double Count</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>10.2 Activity / Requirement</th><th>Required Qty</th><th>Verified Direct Cost THB</th><th>Source &amp; Verification</th></tr></thead>
   <tbody>{p.currentDerivationLines.map(x=><tr key={x.id}>
    <td><strong>{x.activity}</strong><small>{x.id} · {x.valueClass}</small></td>
    <td>{Number.isFinite(x.quantity)?x.quantity:"TO DERIVE"} {x.unit}</td>
    <td>NOT ESTABLISHED</td><td>{x.evidence}<small>{x.status}</small></td>
   </tr>)}</tbody>
  </table></div>
  {p.currentRequirementRows.length>0&&<details className="p55-panel" style={{padding:12}}>
   <summary><strong>Current Lifecycle Demand Register</strong> ({p.currentRequirementCount} source candidates; not verified spare quantities)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Site / System</th><th>Candidate Activity / Spare</th><th>Qty &amp; Rate</th><th>Source Status</th></tr></thead><tbody>
    {p.currentRequirementRows.map(x=><tr key={x.sourceId}>
     <td>{x.site} · {x.system}</td><td>{x.description}<small>{x.sourceId}</small></td>
     <td>QTY NOT VERIFIED · RATE NOT VERIFIED</td><td>{x.sourceStatus}</td>
    </tr>)}</tbody></table></div>
  </details>}
  <h4>3. Verification Tasks — To Establish Current THB Price</h4>
  <ul>{p.currentCostGaps.map((x,i)=><li key={i}>{x}</li>)}</ul>
  <details className="p55-panel" style={{padding:12}}>
   <summary><strong>01–08 Engineering Source &amp; Cost Verification</strong> ({p.currentVerificationSteps.length} gates)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Step</th><th>Validation State</th><th>Basis / Missing Proof</th></tr></thead>
    <tbody>{p.currentVerificationSteps.map(x=><tr key={x.id}><td>{x.id} — {x.name}</td><td>{x.state}</td><td>{x.basis}</td></tr>)}</tbody>
   </table></div>
  </details>
  <p className="p55-note"><strong>Cost Ownership:</strong> {p.noDoubleCountRule} · Historical USD values shown solely for cost benchmark, no approval or customer release.</p>
 </section>;
}
