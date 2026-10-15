import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectScopeBcPriceAudit0553} from "./data/scopeBcPriceAudit0553";

const thb=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const usd=n=>Number.isFinite(n)?"USD "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"NOT ESTABLISHED";
export function ScopeBcAnnexDetail0553({code,fx=null,mode="scope"}){
 const m=selectScopeBcPriceAudit0553({thbPerUsd:fx?.thbPerUsd});
 const p=m.byCode[code];
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
