import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectScopeBcPriceAudit0553} from "./data/scopeBcPriceAudit0553";
import {selectUnifiedSpareConsumables0553} from "./data/unifiedSpareConsumables0553";
import {selectSpareCoverageEngineering0553} from "./data/spareCoverageEngineering0553";
import {selectSpareCustomerSchedule0553} from "./data/spareCustomerSchedule0553";

const thb=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const usd=n=>Number.isFinite(n)?"USD "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"NOT ESTABLISHED";
export function ScopeBcAnnexDetail0553({code,fx=null,mode="scope"}){
 const m=selectScopeBcPriceAudit0553({thbPerUsd:fx?.thbPerUsd});
 const p=m.byCode[code];
 const shared=selectUnifiedSpareConsumables0553();
 const customerSchedule=selectSpareCustomerSchedule0553();
 const spareLines=customerSchedule.byCode[code]||[];
 const coverage=["B10","B11","B13","C1","C2"].includes(code)?selectSpareCoverageEngineering0553():null;
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
   <div><strong>{code==="B11"?"Pre-Award B11 Tool Budget (non-posting)":"Current WBS Working SELL"}</strong><p>{thb(code==="B11"?customerSchedule.summary.B11.workingReferenceTHB:p.workingSellTHB)}</p><small>{code==="B11"?"Rev08 tool-kit budget candidate only; OEM inclusion pending, not added to current Working SELL":"Not a current customer quotation"}</small></div>
   <div><strong>Historical Rev08 Reference</strong><p>{thb(p.historicalReferenceTHB)}</p><small>Native USD source retained for audit · {p.historicalFxState}</small></div>
  </div>
  <p className="p55-note"><strong>Scope price status:</strong> {p.currentPriceState} · {p.costState} · <strong>Historical references must NOT post to the current cost/sell ledger.</strong> {p.controlNote}</p>
  {spareLines.length>0&&<div className="p55-panel" style={{padding:12}}>
   <h4>{code==="B11"?"SUPPLIER RECOMMENDATION FOR SPECIAL TOOLS — 供货商推荐的特殊工具":"Customer Schedule — "+shared.descriptions[code]} (Pre-Award Budgetary Working Preview)</h4>
   <p className="p55-note"><strong>Coverage readiness:</strong> {customerSchedule.engineeringReadiness.installedTagInstances} source site-TAG instances / {customerSchedule.engineeringReadiness.criticalTagFunctionGroups} critical TAG families. Confirmed replacement SKU mappings in this model: {customerSchedule.engineeringReadiness.confirmedReplacementSkuGroups}. Verdict: <strong>{customerSchedule.engineeringReadiness.verdict}</strong> — budget price rows exist, but complete Commissioning Spare coverage and major-equipment provision have not yet been demonstrated.</p>
   <p className="p55-note"><strong>TOP-DOWN TRACE:</strong> {customerSchedule.sourceOwnership} · Existing MR/MTO/AFC installed TAGs are joined to the five-category Rev08 budget lines by equipment function. COMMON means a shared stock/tool item, not an invented installed TAG. Quantities and THB unit rates retain the original pre-award Rev08 basis at FX 31.5. The TAG association is not OEM interchangeable SKU approval.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Item</th><th>Tag No.</th><th>Description</th><th>Detail Specification</th><th>Materials</th><th>Qty</th><th>Unit Price THB</th><th>Total Price THB</th>{(code==="C1"||code==="C2")&&<th>Lead Time ARO</th>}</tr></thead>
    <tbody>{spareLines.map(x=><tr key={x.id}>
     <td>{x.item}</td><td>{x.tagNo}<small>{x.installedTagKeys.length?"Installed TAG/Location links: "+x.installedTagKeys.join("; "):"Shared/unspecified equipment stock — crosswalk open"}</small><small>{x.linkedLocations.join(", ")}</small></td>
     <td>{x.description}<small>{x.id}</small></td>
     <td>{x.detailSpecification}<small>{x.mappingStatus}</small></td>
     <td>{x.materials}</td>
     <td>{x.qty} {x.unit}<small>Budgetary Qty · source {x.sourceId} · excludes additional major-spare risk stock</small></td>
     <td>{thb(x.unitPriceTHB)}</td><td>{thb(x.extendedTHB)}</td>
     {(code==="C1"||code==="C2")&&<td>{x.leadTimeARO||"OEM confirmation required"}</td>}
    </tr>)}</tbody>
    {code==="B11"&&<tfoot><tr><th colSpan={7} style={{textAlign:"right"}}>Total Price — Supplier Recommendation for Special Tools (THB)</th><th>{thb(customerSchedule.summary.B11.workingReferenceTHB)}</th></tr></tfoot>}
   </table></div>
   <p className="p55-note"><strong>PRE-AWARD CATEGORY BUDGET:</strong> {thb(customerSchedule.summary[code].workingReferenceTHB)} · Source: Rev08 historic priced lines × planning FX 31.5 THB/USD · {customerSchedule.summary[code].priceStatus} · B11 reference remains non-posting, other approved categories preserve existing budgetary Working Sell. No new Direct Cost posting. Rounding per line can differ from category source total.</p>
   {code==="B11"&&<p className="p55-note"><strong>Customer template delivery basis:</strong> DDP Purchaser’s Yard shown in RFQ; current THB prices are internal budget references only, not a verified DDP delivered quotation. Installation, commissioning and special tools must reconcile with B3/B9 and Part A before customer release. Four Rev08 priced tools and five EXA-A8 minimum requirements are separate cross-references, not nine additive priced lines.</p>}
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
       <td>{x.categoryApplicability.B10?x.b10BudgetScenarioQty:"—"}<small>{x.estimatedPartQtyState} · {x.b10QtyEquationId}</small><small>{x.reliabilityEquationId}: {x.reliabilityState} (OEM failure rate unavailable; no inferred reliability quantity)</small></td>
       <td>{x.budgetaryExistingSourceIds[code]?.length?x.budgetaryExistingSourceIds[code].join(", "):"NO MATCHED REV08 CATEGORY REFERENCE"}<small>Cost evidence is a candidate, not proven interchangeable SKU</small></td>
      </tr>)}</tbody>
     </table></div>
    </details>;
   })}
   {coverage.unresolvedRequirementTags.map(x=><p className="p55-note" key={x.mr+"-"+x.tag}>
    <strong>Open MR-to-Selected Tag Crosswalk:</strong> {x.mr} / {x.tag} → {x.candidateCurrentInstalledTag} · {x.reason} · {x.status} · {x.source}. No quantity or price counted as resolved.
   </p>)}
   <p className="p55-note"><strong>Coverage gate:</strong> Contract minimum EXA-A8 and OEM SPIR composition remain unresolved; major equipment and compatibility gaps stay visible. Part A and B10/B13/C1/C2 must reconcile unique physical delivered quantities before customer release. Working Sell budgets are unchanged.</p>
  </details>}
  {code==="B11"&&<details className="p55-panel" open={inWorking} style={{padding:12}}>
   <summary><strong>B11 Minimum Operational Special Tools — EXA-A8 Phase 1F</strong> (five customer requirements)</summary>
   <p className="p55-note">These are contractual minimum tool/authorization drivers, not five independent price postings. The four original Rev08 B11 tool/kit budget lines remain the only historic price basis. TETRA gateway applicability must be assessed against the selected DMR system.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Item</th><th>Tag No.</th><th>Description</th><th>QTY</th><th>Unit Price THB</th><th>Price / Inclusion Basis</th></tr></thead>
    <tbody>{customerSchedule.b11Requirements.rows.map(x=><tr key={x.id}>
     <td>{x.id}</td><td><strong>{x.tag}</strong><small>{x.mr}</small></td>
     <td>{x.description}<small>{x.compatibilityGate}</small></td><td>{x.qty} {x.unit}</td>
     <td>Covered by shared B11 reference — not separately allocated</td>
     <td>{x.sourceQuoteCandidate}<small>{x.budgetPriceState}</small></td>
    </tr>)}</tbody></table></div>
   <p className="p55-note">Source: {customerSchedule.b11Requirements.source}. No independent rate or final supplier compatibility has been invented; B11 shared-tool OEM credits remain open.</p>
  </details>}
  {(code==="B10"||code==="C1")&&<details className="p55-panel" open={inWorking} style={{padding:12}}>
   <summary><strong>Critical Replacement Risk Scenario — MR0002 / ZWP20 / RFI-BDA</strong> (NON-ADDITIVE budget sensitivity)</summary>
   <p className="p55-note">This is derived from the selected MR0002 Working BOM, not from a fabricated spare quote. The integrated BDA+WAROM assembly is already supplied in Part A. The comparison is for one replacement package only; choose physical ownership B10 OR C1 when justified, never both for the same stock unit.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Installed TAG / Evidence</th><th>BOM / Spare Scenario</th><th>Scenario Qty</th><th>Vendor package rate THB (comparable)</th><th>Extended risk reference THB</th><th>Commercial treatment</th></tr></thead>
    <tbody>{customerSchedule.riskCandidates.map(x=><tr key={x.id}>
     <td><strong>{x.tagNo}</strong><small>{x.moduleId}</small><small>{x.site} · {x.mr}</small></td>
     <td>{x.description}<small>Selected OEM SKU: {x.sku} · {x.source} / {x.sourceQuoteLine}</small></td>
     <td>{x.qty} {x.unit}<small>SPQ-001 critical-family budget scenario, not required SPIR quantity</small></td>
     <td>{thb(x.comparativeUnitTHB)}<small>USD {x.sourceUnitUSD} × {x.planningFxTHBPerUSD} THB/USD</small></td>
     <td><strong>{thb(x.comparativeAmountTHB)}</strong></td>
     <td><strong>NOT INCLUDED IN WORKING SELL</strong><small>{x.categoryDecision}</small><small>{x.priceClass}</small></td>
    </tr>)}</tbody>
   </table></div>
   <h4>Original MR0002 / ZWP20 Selected RFI-BDA BOM / Cost Ownership</h4>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>TAG / BOM ID</th><th>Equipment / Vendor SKU</th><th>QTY</th><th>Unit Price THB / Evidence</th><th>Total Reference THB</th><th>Cost / Inclusion Status</th></tr></thead>
    <tbody>{customerSchedule.riskCandidates.flatMap(x=>x.originalBOM).map(x=><tr key={x.id}>
     <td>{x.tag}<small>{x.id}</small></td>
     <td>{x.description}<small>{x.sku||"SKU not separately specified"}</small></td>
     <td>{Number.isFinite(x.qty)?x.qty:"Input unresolved"} {x.unit}</td>
     <td>{Number.isFinite(x.referenceUnitTHB)?thb(x.referenceUnitTHB):x.priceInclusion?"Included with parent package":"No unit rate established"}</td>
     <td>{Number.isFinite(x.referenceExtendedTHB)?thb(x.referenceExtendedTHB):x.priceInclusion?"Included (not additive)":"Not priced"}</td>
     <td>{x.priceInclusion||x.status}<small>{x.countedInPartA?"Part A selected package source — not extra B10 / C1 charge":"Non-additive interface/inclusion/provisional line"}</small></td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note"><strong>Open decision:</strong> Include standalone BDA module vs complete assembly replacement? Check OEM spare compatibility, EX certification and MR0002 RAD-508-001 LNA to RFI BDA crosswalk. This priced full-package reference must not be treated as a final spare quotation or counted in both B10 and C1.</p>
  </details>}
  {customerSchedule.crossCategoryDuplicates.length>0&&<details className="p55-panel" style={{padding:12}}>
   <summary><strong>Cross-category Stock / Double-count Review</strong> ({customerSchedule.crossCategoryDuplicates.length} functional overlaps)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Replaceable Function</th><th>Source Rows / Categories</th><th>Quantity &amp; Cost Ownership Decision</th></tr></thead>
    <tbody>{customerSchedule.crossCategoryDuplicates.map(x=><tr key={x.family}>
     <td><strong>{x.family}</strong></td>
     <td>{x.categories.join(" / ")}<small>{x.sourceIds.join(", ")}</small></td>
     <td>{x.decision}<small>{x.status}</small></td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note">This is a functional overlap alert, NOT proof of identical OEM SKU or double billing. B10 and C2 may legitimately require independent delivery quantities. B13 packaging must be net of B5.</p>
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
