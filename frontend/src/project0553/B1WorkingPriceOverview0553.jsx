import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {b1AccountModuleId0553} from "./data/b1AccordionModuleIds0553";
import {findModuleElement0553,openModuleAncestors0553} from "./data/moduleDeepLink0553";

// 10.2 / B1 — visible FIRST, read-only account and resource price trace.
// The selected canonical B1 price is NEVER reconstructed from the display.
// Account and line amounts below are source projections, not additional postings.
const ROOT="bid.budget.working.bc.b1";
const display=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;

export function B1WorkingPriceOverview0553({workingRow}){
 if(!workingRow||workingRow.code!=="B1")return null;
 const model=workingRow.b1SupportPlanningBudget;
 if(!model||model.accounts.length!==8||workingRow.workingSellTHB!==421180||
  model.canonicalB1WorkingSellTHB!==workingRow.workingSellTHB||
  model.baseWorkingCostTHB!==374200||model.labourHours!==242||
  model.conditionalWorkingSellTHB!==0||workingRow.directCostTHB!==null)
  throw Error("B1 price overview must follow current canonical B1 source, not legacy WBS");
 const baseSell=round(model.accounts.reduce((n,a)=>n+a.baseWorkingSellTHB,0));
 const conditionalSell=round(model.accounts.reduce((n,a)=>n+a.conditionalWorkingSellTHB,0));
 const baseCost=round(model.accounts.reduce((n,a)=>n+a.baseWorkingCostTHB,0));
 if(baseSell!==workingRow.workingSellTHB||conditionalSell!==model.conditionalWorkingSellTHB||
  baseCost!==model.baseWorkingCostTHB)
  throw Error("B1 summary source-account amounts fail no-double-count reconciliation");

 const showDetail=account=>{
  const id=b1AccountModuleId0553(account);
  const el=typeof document!=="undefined"?findModuleElement0553(document,id):null;
  if(!el)return;
  openModuleAncestors0553(el);
  if(el.tagName==="DETAILS")el.open=true;
  const child=el.querySelector?.("details.p553-b1-item");
  if(child)child.open=true;
  el.classList?.add("p553-module-nav-focus");
  el.scrollIntoView?.({behavior:"smooth",block:"start"});
 };

 return <section className="p55-panel p553-b1-price-overview"
  data-component-key={ROOT+".price-overview"} style={{padding:12,marginTop:12}}>
  <div className="p55-eyebrow">10.2 / B1 — DIRECT ACCOUNT PRICE INSPECTION (READ ONLY)</div>
  <h3>B1 — B1.1–B1.8 Quantities, Man-hours, Working Cost &amp; Working SELL</h3>
  <p className="p55-note"><strong>Module ID:</strong>
   {" "}<ComponentCopyId projectId="PJ2608-0553" componentKey={ROOT+".price-overview"}/>
   {" "}· Source owner: <ComponentCopyId projectId="PJ2608-0553" componentKey={ROOT}/>
   {" "}· Click any account to open its  Qty × Rate × Amount source lines immediately below.</p>
  <div className="p55-metric-grid">
   <div><strong>Current B1 Working SELL</strong><p>{display(workingRow.workingSellTHB)}</p>
    <small>Selected one-time B1 owner</small></div>
   <div><strong>Planning Working Cost</strong><p>{display(model.baseWorkingCostTHB)}</p>
    <small>Not actual verified Direct Cost</small></div>
   <div><strong>Staff / Project Support</strong><p>{model.labourHours} MH</p>
    <small>{Object.keys(model.roleRates).length} role definitions; not 964 legacy engineering MH</small></div>
   <div><strong>Conditional Working SELL</strong><p>{display(model.conditionalWorkingSellTHB)}</p>
    <small>Excluded from B1 Base</small></div>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact p553-b1-price-overview-table"
   style={{width:"100%",minWidth:990}}>
   <thead><tr>
    <th>B1 Cost Account / Module ID</th>
    <th>Work Type / Account</th>
    <th>Resource / Qty Evidence</th>
    <th>Working Cost THB</th>
    <th>Base Working SELL THB</th>
    <th>Conditional SELL THB</th>
    <th>Qty × Rate × Amount</th>
   </tr></thead>
   <tbody>{model.accounts.map(a=>{
    const id=b1AccountModuleId0553(a.account);
    const hours=a.rows.filter(x=>x.unit==="MH").reduce((n,x)=>n+x.qty,0);
    const expenses=a.rows.filter(x=>x.unit!=="MH").length;
    return <tr key={a.account}>
     <td><strong>{a.account}</strong>
      <small>{id}</small>
      <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/></td>
     <td><strong>{a.label}</strong></td>
     <td>{hours>0?<strong>{hours} MH</strong>:"—"}
      <small>{a.qtyRows} source line(s) · {expenses} non-MH expense line(s)</small></td>
     <td className="is-number">{display(a.baseWorkingCostTHB)}</td>
     <td className="is-number"><strong>{display(a.baseWorkingSellTHB)}</strong></td>
     <td className="is-number">{display(a.conditionalWorkingSellTHB)}
      <small>{a.conditionalWorkingSellTHB>0?"NOT IN BASE":"No conditional price"}</small></td>
     <td><button type="button" className="p553-detail-button"
      onClick={()=>showDetail(a.account)}>＋ {a.account} View Qty × Rate × Amount</button></td>
    </tr>;
   })}</tbody>
   <tfoot><tr>
    <th colSpan={3}>B1 Base — Sum of eight cost accounts; not an additional posting</th>
    <th className="is-number">{display(baseCost)}</th>
    <th className="is-number">{display(baseSell)}</th>
    <th className="is-number">{display(conditionalSell)}</th>
    <th>Direct Cost NOT ESTABLISHED</th>
   </tr></tfoot>
  </table></div>
  <p className="p55-note"><strong>How to audit:</strong> Open B1.1–B1.8 below to inspect
   each staff/expense line's original Qty, Unit Cost, calculated planning Working Cost
   and Working SELL. This summary DOES NOT contain a flat account-level unit rate
   because each account combines different staff roles and physical expense units.
   Historical 27 Engineering WBS / 964 MH is excluded from current B1 pricing.</p>
 </section>;
}
