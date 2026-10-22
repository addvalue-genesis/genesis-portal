import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB1ProjectSupportBudget0553} from "./data/b1ProjectSupportBudget0553";
import {B1_ACCORDION_ROOT_0553,b1AccountModuleId0553,b1AccountLineModuleId0553} from "./data/b1AccordionModuleIds0553";

// 10.2 / B1. Presentation ONLY: canonical B1.1–B1.8 source accounts, no repricing.
// B1.A is AUDIT (never an additional contractual or financial cost account).
// Native <details> preserves nested Project Module Navigator deep-link behavior.
const ROOT=B1_ACCORDION_ROOT_0553;
const amount=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT VERIFIED";
const quantity=n=>Number.isFinite(n)?n.toLocaleString("en-US"):"TBC";
const accountTone=Object.freeze({
 "B1.1":"management","B1.2":"meetings","B1.3":"travel","B1.4":"administration",
 "B1.5":"regulatory","B1.6":"legal","B1.7":"permits","B1.8":"misc"
});
const copy=id=><span className="p553-b1-copy" onClick={e=>{e.preventDefault();e.stopPropagation();}}
 onKeyDown={e=>e.stopPropagation()}>
 <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>
 </span>;

function B1AuditLeaf0553({number,kind,title,children}){
 const id=ROOT+".audit."+kind;
 return <details className="p553-b1-item" data-component-key={id}>
  <summary className="p553-b1-item-summary"><span className="p553-b1-numeral">{number}</span>
   <span className="p553-b1-summary-label"><strong>{title}</strong><code>{id}</code></span>{copy(id)}
  </summary>
  <div className="p553-b1-item-body">{children}</div>
 </details>;
}

export function B1RevKMilestoneBudget0553({sourceLedger=null,sourceEvidence=null}){
 const model=selectB1ProjectSupportBudget0553();
 const rootRef=React.useRef(null);
 const totalBase=model.accounts.reduce((n,x)=>n+x.baseWorkingCostTHB,0);
 if(model.accounts.length!==8||model.canonicalB1WorkingSellTHB!==211600||
  model.baseWorkingSellTHB!==211600||model.conditionalWorkingSellTHB!==51700||
  model.actualDirectCostTHB!==null||model.historicalEngineeringCarryForwardTHB!==0)
  throw Error("B1 accordion source/owner reconciliation failed");
 const expandAll=isOpen=>{
  rootRef.current?.querySelectorAll("details.p553-b1-group, details.p553-b1-item")
   .forEach(node=>{node.open=isOpen;});
 };
 return <section className="p55-panel p553-b1-worktype" ref={rootRef}
  data-component-key={ROOT+".revk-pm-milestones"} style={{padding:14,marginTop:12}}>
  <div className="p55-eyebrow">10.2 / B1 — INTERNAL PROJECT SUPPORT · Rev.K K00–K18</div>
  <div className="p553-b1-header" data-component-key={ROOT+".worktype-accordion"}>
   <div><h3>B1 — Engineering &amp; Design / Internal Project Cost Groups</h3>
    <p className="p55-note"><strong>Canonical B1 Working SELL: {amount(model.canonicalB1WorkingSellTHB)}</strong>
     {" "}· Planning Working Cost {amount(model.baseWorkingCostTHB)}
     {" "}· Conditional SELL {amount(model.conditionalWorkingSellTHB)} (EXCLUDED FROM BASE).
     Direct Cost NOT ESTABLISHED · Customer RELEASE HOLD.</p>
    <p className="p55-note">Customer B1 = Engineering and Design / 1 Lot (unchanged).
     B1.1–B1.8 below are INTERNAL project support cost accounts. B1.A is read-only Audit.
     No historical 964-MH engineering or old PM rate is reposted.</p>
    <p className="p55-note"><strong>Module ID:</strong> {copy(ROOT+".revk-pm-milestones")}</p>
    <p className="p55-note"><strong>Accordion UI Module:</strong> {copy(ROOT+".worktype-accordion")}</p>
   </div>
   <div className="p553-b1-actions">
    <button type="button" className="p553-detail-button" onClick={()=>expandAll(true)}>＋ Expand All</button>
    <button type="button" className="p553-detail-button" onClick={()=>expandAll(false)}>− Collapse All</button>
   </div>
  </div>
  <div className="p55-metric-grid">
   <div><strong>Support Labour ({Object.keys(model.roleRates).length} roles / {model.labourHours} MH)</strong>
    <p>{amount(model.labourWorkingCostTHB)}</p><small>Planning loaded salary, not payroll</small></div>
   <div><strong>Base Project Expenses</strong><p>{amount(model.baseExpenseWorkingCostTHB)}</p><small>Non-labour base only</small></div>
   <div><strong>Support Base Working Cost</strong><p>{amount(model.baseWorkingCostTHB)}</p><small>NOT verified Direct Cost</small></div>
   <div><strong>Base Working SELL</strong><p>{amount(model.baseWorkingSellTHB)}</p><small>Same single owner B1</small></div>
   <div><strong>Conditional Expenses / SELL</strong><p>{amount(model.conditionalWorkingSellTHB)}</p>
    <small>Lawful legal / government fees; NOT in Base</small></div>
   <div><strong>Historical Carry-forward</strong><p>THB 0.00</p><small>Old engineering / PM excluded</small></div>
  </div>
  <p className="p55-note">Rate assumptions: 22 workdays × 8 h/month, 20% employer load;
   provisional 20% labour gross-margin target / 10% non-labour handling.
   All commercial cost and rate inputs require evidence before customer release.</p>

  {model.accounts.map((group,index)=>{
   const id=b1AccountModuleId0553(group.account),tone=accountTone[group.account];
   const budgetId=id+".budget",gateId=id+".verification";
   return <details key={group.account} className={"p553-b1-group p553-b1-group--"+tone}
    data-component-key={id} open={index===0}>
    <summary className="p553-b1-summary">
     <span className="p553-b1-numeral">{group.account}</span>
     <span className="p553-b1-summary-label"><strong>{group.label}</strong>
      <small>{group.qtyRows} source line(s) · Base SELL {amount(group.baseWorkingSellTHB)}
       {" "}· Conditional {amount(group.conditionalWorkingSellTHB)}</small>
      <code>{id}</code></span>{copy(id)}
    </summary>
    <div className="p553-b1-group-body">
     <B1AccountBudget0553 account={group} number={group.account+".1"} moduleId={budgetId}/>
     <details className="p553-b1-item" data-component-key={gateId}>
      <summary className="p553-b1-item-summary">
       <span className="p553-b1-numeral">{group.account}.2</span>
       <span className="p553-b1-summary-label"><strong>Cost Owner, Verification &amp; Conditions</strong>
        <code>{gateId}</code></span>{copy(gateId)}
      </summary>
      <div className="p553-b1-item-body">
       <p className="p55-note"><strong>Owner B1 only.</strong> Quantities and THB Working Cost / SELL
        are planning assumptions. Verified Direct Cost remains NULL.</p>
       <p className="p55-note">Base Working Cost: {amount(group.baseWorkingCostTHB)} |
        Base Working SELL: {amount(group.baseWorkingSellTHB)} |
        Conditional SELL (excluded): {amount(group.conditionalWorkingSellTHB)}</p>
       {group.rows.map(x=><p key={x.id} className="p55-note"><strong>{x.id}:</strong> {x.verification}
        {" "}· {x.conditional?"Conditional / not Base":"Included once in Base"}.</p>)}
      </div>
     </details>
    </div>
   </details>;
  })}

  <details className="p553-b1-group p553-b1-group--audit" data-component-key={ROOT+".audit"}>
   <summary className="p553-b1-summary">
    <span className="p553-b1-numeral">B1.A</span>
    <span className="p553-b1-summary-label"><strong>Audit / Traceability — Non-posting Evidence</strong>
     <small>Role rates, 19 Rev.K milestones, 27 engineering titles, cost-owner ledger, sources</small>
     <code>{ROOT+".audit"}</code></span>{copy(ROOT+".audit")}
   </summary>
   <div className="p553-b1-group-body">
    <B1AuditLeaf0553 number="B1.A.1" kind="role-rates" title="Seven Role Rates — Internal THB Basis">
     <p className="p55-note">No USD600 specialist rate may be used for office administration.
      Loaded rates are estimates, not actual payroll direct cost.</p>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Role</th><th>Cost Account</th><th>Monthly Salary Assumption</th><th>Loaded Working Cost / MH</th><th>Status</th></tr></thead>
      <tbody>{Object.entries(model.roleRates).map(([key,r])=><tr key={key}>
       <td><strong>{r.name}</strong></td><td>{r.account}</td><td>{amount(r.monthlyTHB)}</td>
       <td>{amount(r.monthlyTHB*model.employerLoadFactor/model.workHoursPerMonth)}</td>
       <td>THAILAND 2026 INDICATIVE · Payroll unverified</td></tr>)}</tbody>
     </table></div>
    </B1AuditLeaf0553>
    <B1AuditLeaf0553 number="B1.A.2" kind="revk-events" title="K00–K18 Unique Role / Milestone Allocation">
     <p className="p55-note">12 unique project-support charging events across 19 Rev.K stages.
      Shared K03–07 and K08–11 are charged only once.</p>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1090}}>
      <thead><tr><th>Rev.K / Module ID</th><th>Milestone</th><th>Role / Hours</th><th>Support MH</th>
       <th>Planning Cost THB</th><th>Working SELL THB</th><th>Execution Owner</th></tr></thead>
      <tbody>{model.milestones.map(k=><tr key={k.stage} data-component-key={k.moduleId}>
       <td><strong>{k.stage}</strong><small>{k.moduleId}</small>{copy(k.moduleId)}</td>
       <td>{k.phase}<small>Charge owner {k.chargeOwnerStage}</small></td>
       <td>{k.rows.length?k.rows.map(r=>r.roleName+" "+r.qty+"MH").join(" · "):"Shared event — "+k.chargeOwnerStage}</td>
       <td>{k.estimatedMH||"—"}</td>
       <td>{k.rows.length?amount(k.budgetaryCostTHB):"Included"}</td>
       <td>{k.rows.length?amount(k.workingSellTHB):"Not additive"}</td>
       <td>{k.executionCostOwner}</td>
      </tr>)}</tbody></table></div>
    </B1AuditLeaf0553>
    <B1AuditLeaf0553 number="B1.A.3" kind="engineering-review" title="27 Engineering Scope Titles — Ownership Review Only">
     <p className="p55-note">Legacy technical engineering WBS activities are unpriced review items.
      Distinct ADDVALUE engineering must be checked against OEM Part A, B2 VDRL and B3 testing.
      No 964-MH historical Engineering price or quantity is carried into current B1.</p>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Engineering ID / Module ID</th><th>Activity</th><th>Provisional Owner</th><th>Working SELL</th></tr></thead>
      <tbody>{model.engineeringScopeReview.map(x=>{
       const id=ROOT+".audit.engineering-review."+x.id.toLowerCase();
       return <tr key={x.id} data-component-key={id}>
        <td><strong>{x.id}</strong><small>{x.group}</small>{copy(id)}</td>
        <td>{x.activity}</td><td>{x.proposedOwner}<small>{x.status}</small></td>
        <td>NOT PRICED — No legacy WBS carry-forward</td>
       </tr>;
      })}</tbody></table></div>
    </B1AuditLeaf0553>
    <B1AuditLeaf0553 number="B1.A.4" kind="indirect-ledger" title="CFO Expense Ledger / Cost Owner Evidence">
     {sourceLedger||<p className="p55-note">Available in 10.2 B1 working cost evidence panel.</p>}
    </B1AuditLeaf0553>
    <B1AuditLeaf0553 number="B1.A.5" kind="source-audit" title="Historical Source, Evidence & Direct Cost Gaps">
     {sourceEvidence||<p className="p55-note">Read-only source audit in 10.2 B1 working cost detail.</p>}
    </B1AuditLeaf0553>
    <p className="p55-note"><strong>Reconciliation:</strong> 8 account Base Working Costs total
     {" "}{amount(totalBase)} and Base SELL totals {amount(model.canonicalB1WorkingSellTHB)};
     Conditional SELL {amount(model.conditionalWorkingSellTHB)} is separate, not additive.</p>
   </div>
  </details>
  <p className="p55-note"><strong>No double posting:</strong> B1 is project-support planning.
   B2 documentation, B3 FAT/SAT and temporary test tools, B5 packing, B6 freight/customs,
   B9 conditional specialist assistance, and OEM Part A technical scope remain with their owners.
   No source or SELL values have been changed by this presentation.</p>
 </section>;
}

function B1AccountBudget0553({account,number,moduleId}){
 return <details className="p553-b1-item" data-component-key={moduleId} open>
  <summary className="p553-b1-item-summary">
   <span className="p553-b1-numeral">{number}</span>
   <span className="p553-b1-summary-label"><strong>Quantity / Working Cost / Working SELL</strong>
    <small>{account.qtyRows} lines · Base {amount(account.baseWorkingSellTHB)}
     {" "}· Conditional {amount(account.conditionalWorkingSellTHB)}</small>
    <code>{moduleId}</code></span>{copy(moduleId)}
  </summary>
  <div className="p553-b1-item-body">
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1060}}>
    <thead><tr><th>No. / Source ID / Copy Module ID</th><th>Activity / Role</th><th>Qty</th>
     <th>Unit Cost THB</th><th>Working Cost THB</th><th>Working SELL THB</th>
     <th>Evidence / Booking Condition</th></tr></thead>
    <tbody>{account.rows.map((x,i)=>{
     const id=b1AccountLineModuleId0553(account.account,x.id);
     return <tr key={x.id} data-component-key={id}>
      <td><strong>{number+"."+(i+1)} · {x.id}</strong><small>{x.wbs}</small>{copy(id)}</td>
      <td>{x.activity}<small>{x.conditional?"CONDITIONAL — EXCLUDED FROM BASE":"BASE PLANNING"}</small></td>
      <td>{quantity(x.qty)} {x.unit}</td><td>{amount(x.unitCostTHB)}</td>
      <td>{amount(x.workingCostTHB)}</td><td>{amount(x.workingSellTHB)}</td>
      <td>{x.verification}<small>Actual Direct Cost: NOT VERIFIED</small></td>
     </tr>;
    })}</tbody>
   </table></div>
   <p className="p55-note"><strong>One B1 cost owner:</strong> the row prices above are already
    included in the canonical B1 account subtotal. Never add their displayed values to B1 a second time.</p>
  </div>
 </details>;
}
