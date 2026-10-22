import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
const thb=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
// Historic filename retained for routing compatibility; view ALWAYS filters by contractual cost owner.
export function B9ChinaBudgetDetail0553({budget,selectedOwner="B9",purchasedServices=null,workingRow=null}){
 if(!budget)return null;
 const isFat=selectedOwner==="B3", owner=isFat?"B3":"B9";
 const rows=budget.rows.filter(x=>x.costOwner===owner);
 const total=isFat?budget.fatWorkingSellTHB:budget.conditionalYardSellTHB;
 // This component's eight B3 source lines are ADDVALUE witnesses only.
 // The purchased MGW factory-service WS is already selected in the parent B3.
 // Include that source in the FULL-B3 preview only when supplied by its caller;
 // never modify rows, POST an extra line, or claim quoted cost is paid cost.
 const purchasedFatSell=isFat&&Number.isFinite(purchasedServices?.selectedIncrementalWorkingSellTHB)?
  purchasedServices.selectedIncrementalWorkingSellTHB:0;
 if(isFat&&purchasedServices&&
   (purchasedFatSell!==307125||purchasedServices.vendorPurchasedQuoteUSD!==7500))
  throw Error("B3 purchased MGW FAT quotation and Working SELL source mismatch");
 // FULL B3 must originate from canonical 10.2 owner, not historical 40d
 // SAT THB2,046,000. Missing canonical input means NO full-total claim.
 const ownerPreviewB3THB=isFat&&workingRow?.code==="B3"?
  workingRow.workingSellTHB:null;
 if(isFat&&Number.isFinite(ownerPreviewB3THB)&&
  Math.round((workingRow.b3SelectedSatSurveyBudget.includedB3SatSurveyToolsWorkingSellTHB+
   total+purchasedFatSell)*100)!==Math.round(ownerPreviewB3THB*100))
  throw Error("B3 FAT detail FULL preview must reconcile to canonical WS-B3");
 if(!rows.length||Math.abs(rows.reduce((sum,x)=>sum+x.workingSellTHB,0)-total)>0.01)
  throw Error("Contract B3 FAT vs B9 Yard detail ownership/pricing mismatch");
 return <section className="p55-panel" data-component-key={"bid.budget.working.bc."+owner.toLowerCase()+".revk-china-budget"} style={{padding:14,marginTop:12}}>
  <h4>{isFat?"IC-FAT — ADDVALUE China FAT Witness · Internal Working SELL Detail":"IC-YARD — Specialist Field Assistance · Quoted Base Working SELL (Call-out Execution)"}</h4>
  <p className="p55-note"><strong>Internal record:</strong> {isFat?"IC-FAT / WS-B3":"IC-YARD / WS-B9"} · <strong>Customer contractual Scope:</strong> {isFat?"SOW-B3":"SOW-B9"} · <strong>Commercial Proposal:</strong> {isFat?"CP-B3":"CP-B9"} NOT ISSUED. These rows are internal estimating activities, not customer B3/B9 quotation line numbers.</p>
  <div className="p55-metric-grid">
   <div><strong>{isFat?"WS-B3 — Current Internal FAT Working SELL":"WS-B9 — Included in Base Once · On-call Yard Working SELL"}</strong><p>{thb(total)}</p>
    <small>{isFat?"Two ADDVALUE paid witnesses, six budgetary FAT days, one return China trip; OEM executes FAT in Part A":"One paid Senior Telecom Engineer · 7 working days + 2 travel days · one unbilled accompanying Field Telecom Specialist"}</small></div>
   <div><strong>{isFat?
    (Number.isFinite(ownerPreviewB3THB)?"WS-B3 — FULL B3 canonical Working SELL (MGW Purchased FAT included once)":"WS-B3 — Full total requires canonical 10.2 owner"):
    "Current B9 Base"}</strong><p>{isFat?thb(ownerPreviewB3THB):thb(budget.b9BaseWorkingSellTHB)}</p>
    <small>{isFat?
     (Number.isFinite(ownerPreviewB3THB)?"SAT28 + BF conditional Survey + VeEX + ADDVALUE FAT witness + MGW purchased iFAT/Facility included ONCE; vendor quote is not paid cost":"Standalone FAT source detail only; total WS-B3 cannot be inferred from this budget object"):
     "B9 1 LS included in quoted Base; actual deployment requires written Yard call-out"}</small></div>
  </div>
  {isFat&&budget.fatWbs&&<details className="p55-panel" style={{padding:10,marginTop:12}}>
   <summary><strong>MGW FAT / MR0001–MR0004 — 6-Day Estimating Agenda</strong></summary>
   <p className="p55-note">Witness team: {budget.fatWitnessRoles.join(" + ")}. Field Specialist standby unbilled. MGW/OEM provides factory test execution and its calibrated tools. Source: BOD §10.2–10.3 / SPE §7.3.1 / MR/DTS1–4. Six days are internal estimates pending signed OEM ITP and equipment TAG repetition.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Day / Test ID</th><th>MR</th><th>Test Requirement</th><th>Hours</th><th>Evidence</th></tr></thead>
    <tbody>{budget.fatWbs.rows.map(x=><tr key={x.id}><td>{x.day} · {x.id}</td><td>{x.mr}</td><td>{x.activity}</td><td>{x.hours}</td><td>{x.evidence}</td></tr>)}</tbody>
   </table></div>
   <p className="p55-note">FAT notice: management target 14 days per SPE; BOD has 30-day requirement. Contract precedence/waiver remains unresolved.</p>
  </details>}
  {!isFat&&<p className="p55-note"><strong>Yard scope:</strong> configuration verification, IP/VLAN/NMS/PLC/PABX integration, troubleshooting and OEM coordination if called out by JUTAL. Base Yard SAT outcome remains mandatory for CONTRACTOR/VENDOR, but ADDVALUE Specialist attendance is conditional on signed RACI or written request. The second Field Telecom Specialist is unbilled but actual travel/payroll must be tracked; internal risk cash allowance {thb(budget.unbilledBackupCashAllowanceTHB)} is NOT another customer charge.</p>}
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget" style={{width:"100%",minWidth:1050,tableLayout:"fixed"}}>
   <thead><tr><th>Internal Cost Activity ID / Technical Module</th><th>Activity</th><th>Qty / Unit</th><th>Internal Working SELL Unit Rate</th><th>Internal Working SELL THB</th><th>Evidence / Treatment</th></tr></thead>
   <tbody>{rows.map(x=><tr key={x.id} data-component-key={x.moduleId} style={{verticalAlign:"top",overflowWrap:"anywhere"}}>
    <td><strong>{x.internalCostLineId}</strong><small>Legacy WBS source: {x.legacySourceExpenseId}</small><small>Technical Module: {x.moduleId}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={x.moduleId}/></td>
    <td><strong>{x.description}</strong><small>{x.status}</small></td>
    <td>{x.qty} {x.unit}</td><td>{thb(x.unitRateTHB)}</td><td><strong>{thb(x.workingSellTHB)}</strong></td>
    <td>{x.evidence}<small>{x.optional?"SOW-B9 / WS-B9 INCLUDED IN BASE — EXECUTION ON WRITTEN CALL-OUT":"SOW-B3 / WS-B3 INTERNAL WORKING ESTIMATE"}</small><small>Direct Cost NOT VERIFIED · CP NOT ISSUED</small></td>
   </tr>)}
   <tr><td colSpan={4}><strong>{isFat?"WS-B3 / IC-FAT — FAT Witness + Travel":"WS-B9 / IC-YARD — Quoted Base Yard 1 LS"}</strong></td>
     <td><strong>{thb(total)}</strong></td><td>Direct Cost is NOT VERIFIED; Internal WS only · CP NOT ISSUED. Scope Owner SOW-{owner}</td></tr></tbody>
  </table></div>
  <p className="p55-note"><strong>Cost rule:</strong> 4-Scope of Supply.xlsx B3 = Inspection, Testing and Certification as per ITP; B9 = Specialist Field Assistance. No FAT personnel/travel may be posted to B9. OEM FAT execution/tools remain Part A; no duplicate B3 OEM labour. Direct Cost must be derived from real payroll, fare, room, insurance and paid supplier evidence, not from the Working Sell daily rate.</p>
 </section>;
}