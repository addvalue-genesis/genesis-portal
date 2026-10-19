import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB1ProjectSupportBudget0553} from "./data/b1ProjectSupportBudget0553";

const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT VERIFIED";
const qty=n=>Number.isFinite(n)?n.toLocaleString("en-US"):"TBC";

// B1 Rev.K is an INTERNAL role-based planning estimate, not a renaming of the
// customer's Engineering and Design B1 1-Lot item and not a second sell posting.
export function B1RevKMilestoneBudget0553(){
 const model=selectB1ProjectSupportBudget0553();
 const [openAccounts,setOpenAccounts]=useState(["B1.1","B1.2","B1.3","B1.4","B1.5","B1.6","B1.7","B1.8"]);
 const [showMilestones,setShowMilestones]=useState(true);
 const [showRates,setShowRates]=useState(true);
 const toggleAccount=account=>setOpenAccounts(v=>v.includes(account)?v.filter(x=>x!==account):[...v,account]);
 const totalBase=model.accounts.reduce((n,x)=>n+x.baseWorkingCostTHB,0);
 return <section className="p55-panel" data-component-key="bid.budget.working.bc.b1.revk-pm-milestones" style={{padding:14,marginTop:12}}>
  <div className="p55-eyebrow">PJ2608-0553 / B1 INTERNAL CFO PLAN / K00–K18 <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.working.bc.b1.revk-pm-milestones"/></div>
  <h3>B1.1–B1.8 — Project Management, Administration & General Project Expenses</h3>
  <p className="p55-note"><strong>Scope boundary:</strong> Original customer B1 stays <strong>Engineering and Design / 1 Lot</strong>. This is the ADDVALUE internal residual project-cost plan, including Administration, Accountant, Procurement, Coordinator and PM effort across unique Rev.K milestones. B2 VDRL; B3 MGW FAT witness, offshore SAT/SIT and hired test equipment; B5 packing; B6 DDP freight/customs broker; B7 vendor storage; and B9 optional seven-day Yard Specialist remain separate. No activity is billed twice.</p>
  <div className="p55-metric-grid">
   <div><strong>Support Labour (7 roles / {model.labourHours} MH)</strong><p>Cost {money(model.labourWorkingCostTHB)}</p><small>Planning loaded salary, not verified payroll</small></div>
   <div><strong>B1 Base Project Expenses</strong><p>Cost {money(model.baseExpenseWorkingCostTHB)}</p><small>Meetings, management travel, project office, filing, misc</small></div>
   <div><strong>Support Base Working Cost</strong><p>{money(model.baseWorkingCostTHB)}</p><small>Indicative allocated cost, NOT actual Direct Cost</small></div>
   <div><strong>Support Base Working SELL</strong><p>{money(model.baseWorkingSellTHB)}</p><small>20% labour gross margin + 10% non-labour handling, provisional</small></div>
   <div><strong>B1 Conditional Expenses</strong><p>{money(model.conditionalWorkingSellTHB)}</p><small>Legal consultant and official permit fee, NOT in base</small></div>
   <div><strong>Proposed Revised B1 Working SELL</strong><p>{money(model.proposedB1BaseWorkingSellTHB)}</p><small>Engineering {money(model.engineeringBaselineWorkingSellTHB)} + Support {money(model.baseWorkingSellTHB)}</small></div>
  </div>
  <p className="p55-note"><strong>Budget reconciliation:</strong> Existing canonical 10.2 B1 Working SELL <strong>{money(model.previousCanonicalB1WorkingSellTHB)}</strong> remains unchanged pending CFO rate/overhead ownership review. The new proposal is <strong>{money(model.proposedB1BaseWorkingSellTHB)}</strong>, an increase of <strong>{money(model.budgetaryVsCanonicalDeltaTHB)}</strong> after replacing, NOT adding again, the former USD600/day 48-MH PM allowance. This page does not automatically update the customer quote, change the 10.2 base total, or post provisional Working Cost as verified Direct Cost.</p>
  <p className="p55-note"><strong>Rate assumptions:</strong> Thai office-role salary scenarios: 22 days × 8 hours/month; employer burden 20%, no additional general overhead in this loaded rate; labour Working SELL = labour planning cost / 0.80 (20% target gross margin). Non-labour Working SELL = documented planning expense × 1.10. All salary, trip, regulatory and spending quantities are PRE-AWARD estimates requiring ADDVALUE internal verification.</p>
  <button type="button" className="p553-detail-button" onClick={()=>setShowRates(v=>!v)}>{showRates?"− Hide":"＋ Show"} Seven Role Cost Rates — THB, not USD600</button>
  {showRates&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Role / Resource</th><th>Allocated B1 Account</th><th>Monthly Salary Assumption</th><th>Loaded Working Cost / MH</th><th>Basis / Status</th></tr></thead>
  <tbody>{Object.entries(model.roleRates).map(([key,r])=><tr key={key}><td><strong>{r.name}</strong></td><td>{r.account}</td><td className="is-number">{money(r.monthlyTHB)}</td><td className="is-number">{money(r.monthlyTHB*model.employerLoadFactor/model.workHoursPerMonth)}</td><td>THAILAND 2026 INDICATIVE / payroll unverified</td></tr>)}</tbody></table></div>}
  <h4>B1.1–B1.8 — Quantity, Unit Cost, Working Cost &amp; Sell</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Cost Account</th><th>Indirect / Project-specific Expense</th><th>Base Working Cost THB</th><th>Base Working Sell THB</th><th>Conditional Working Sell THB</th><th>Details</th></tr></thead>
   <tbody>{model.accounts.map(group=><React.Fragment key={group.account}>
    <tr><td><strong>{group.account}</strong></td><td><strong>{group.label}</strong><small>{group.qtyRows} source-bound resource/expense lines</small></td>
     <td className="is-number">{money(group.baseWorkingCostTHB)}</td>
     <td className="is-number">{money(group.baseWorkingSellTHB)}</td>
     <td className="is-number">{money(group.conditionalWorkingSellTHB)}</td>
     <td><button type="button" className="p553-detail-button" aria-expanded={openAccounts.includes(group.account)} onClick={()=>toggleAccount(group.account)}>{openAccounts.includes(group.account)?"− Hide":"＋ View"}</button></td></tr>
    {openAccounts.includes(group.account)&&<tr><td colSpan={6}><div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1200,width:"100%"}}>
     <thead><tr><th>Expense ID / K WBS</th><th>Activity / Staff Role</th><th>Qty</th><th>Unit Cost THB</th><th>Working Cost THB</th><th>Working Sell THB</th><th>Evidence / Booking Condition</th></tr></thead>
     <tbody>{group.rows.map(x=><tr key={x.id}><td><strong>{x.id}</strong><small>{x.wbs}</small></td><td>{x.activity}<small>{x.conditional?"CONDITIONAL — EXCLUDED FROM BASE":"BASE PLANNING"}</small></td><td>{qty(x.qty)} {x.unit}</td><td>{money(x.unitCostTHB)}</td><td>{money(x.workingCostTHB)}</td><td>{money(x.workingSellTHB)}</td><td>{x.verification}<small>Actual Direct Cost: NOT VERIFIED</small></td></tr>)}</tbody>
    </table></div></td></tr>}
   </React.Fragment>)}
   <tr><td colSpan={2}><strong>B1 INTERNAL BASE SUPPORT ESTIMATE</strong></td><td className="is-number"><strong>{money(totalBase)}</strong></td><td className="is-number"><strong>{money(model.baseWorkingSellTHB)}</strong></td><td className="is-number"><strong>{money(model.conditionalWorkingSellTHB)}</strong></td><td>Not posted to 10.2 canonical yet</td></tr>
  </tbody></table></div>
  <button type="button" className="p553-detail-button" onClick={()=>setShowMilestones(v=>!v)}>{showMilestones?"− Hide":"＋ Show"} Rev.K K00–K18 Role-Based Milestone Allocation</button>
  {showMilestones&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1100,width:"100%"}}>
   <thead><tr><th>K / Module ID</th><th>Milestone</th><th>Resource Roles</th><th>Support MH</th><th>Working Cost THB</th><th>Working SELL THB</th><th>Separate Execution Owner</th></tr></thead>
   <tbody>{model.milestones.map(k=><tr key={k.stage} data-component-key={k.moduleId}>
    <td><strong>{k.stage}</strong><small>{k.moduleId}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={k.moduleId}/></td>
    <td>{k.phase}<small>Unique charge: {k.chargeOwnerStage}</small></td>
    <td>{k.rows.length?k.rows.map(r=>r.roleName+" "+r.qty+"MH").join(" · "):"Shared event — charged in "+k.chargeOwnerStage}</td>
    <td>{k.estimatedMH||"—"}</td><td>{k.rows.length?money(k.budgetaryCostTHB):"Included"}</td>
    <td>{k.rows.length?money(k.workingSellTHB):"Not additive"}</td><td>{k.executionCostOwner}</td>
   </tr>)}</tbody>
  </table></div>}
  <p className="p55-note"><strong>Risk gates:</strong> B1.2 expenses require lawful hospitality evidence; B1.3 uses management-only Trip IDs; B1.6 consultant requires written lawful scope and due diligence; B1.7 official fees require published authority rates/receipts and confirmed ADDVALUE liability. Conditional THB {model.conditionalWorkingCostTHB.toLocaleString("en-US")} Working Cost and {money(model.conditionalWorkingSellTHB)} Working Sell remain separate from Base. No facilitation payments, unofficial commissions or unsupported expense reimbursements.</p>
 </section>;
}
