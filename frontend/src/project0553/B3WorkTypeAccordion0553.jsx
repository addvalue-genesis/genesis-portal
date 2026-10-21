import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {B3WorkingSellBreakdown0553} from "./B3WorkingSellBreakdown0553";
import {B3RequirementWbsTrace0553} from "./B3RequirementWbsTrace0553";
import {B3SiteMrSatCoverage0553} from "./B3SiteMrSatCoverage0553";
import {B9ChinaBudgetDetail0553} from "./B9ChinaBudgetDetail0553";
import {MgwR2CommercialCover0553} from "./MgwR2CommercialCover0553";
import {MgwPaulVendorClarifications0553} from "./MgwPaulVendorClarifications0553";
import {selectB3HierarchicalPriceTable0553,B3_PRICE_ROW_CLASSES_0553 as PRICE_CLASS} from "./data/b3HierarchicalPriceTable0553";

// 10.2 B3 — real TABLE for groups and nested MODULES, one read-only source model.
// Table shows all prices even when details are collapsed. Native details preserves
// Project Module Navigator ancestor opening. Do NOT post supplier/historical/audit.
const ROOT="bid.budget.working.bc.b3";
const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const usd=n=>Number.isFinite(n)?"USD "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const fmtPrice=n=>Number.isFinite(n)?money(n):"—";
const copyInSummary=id=><span className="p553-b3-table-copy"
 onClick={e=>{e.preventDefault();e.stopPropagation();}}
 onKeyDown={e=>e.stopPropagation()}>
 <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>
 </span>;
const qtyUnit=row=>row.qty===null?"—":row.qty.toLocaleString("en-US")+" "+(row.unit||"");
const rateSource=row=>row.unitRateTHB===null?"":money(row.unitRateTHB)+" / "+(row.unit||"unit");
const gridColumns=Object.freeze(["No.","Work Type / Module ID","Qty / Rate","MGW Quote USD",
 "MGW Source THB","Historical / Audit THB","B3 Working SELL THB","Treatment / Owner"]);
function TablePriceCells0553({row,number,title,isGroup=false,fx}){
 const quote=Number.isFinite(row.vendorQuoteUSD)?row.vendorQuoteUSD:null;
 const sourceThb=quote===null?null:Math.round((quote*fx+Number.EPSILON)*100)/100;
 const reference=Number.isFinite(row.historicalTHB)?row.historicalTHB:row.referenceTHB;
 return <>
  <span className="p553-b3-table-cell p553-b3-table-num">{number}</span>
  <span className="p553-b3-table-cell p553-b3-table-name">
   <strong>{title}</strong>
   <small>{row.driver}</small>
   <code>{row.moduleId}</code>
  </span>
  <span className="p553-b3-table-cell p553-b3-table-qty">
   {qtyUnit(row)}
   {row.unitRateTHB!==null&&<small>{rateSource(row)}</small>}
  </span>
  <span className="p553-b3-table-cell p553-b3-table-amount">{usd(quote)}</span>
  <span className="p553-b3-table-cell p553-b3-table-amount">{fmtPrice(sourceThb)}</span>
  <span className="p553-b3-table-cell p553-b3-table-amount">{fmtPrice(reference)}</span>
  <span className="p553-b3-table-cell p553-b3-table-amount">
   <strong>{fmtPrice(isGroup?row.workingSellTHB:row.priceClass===PRICE_CLASS.INCLUDED_WORKING_SELL?
    row.workingSellTHB:null)}</strong>
  </span>
  <span className="p553-b3-table-cell p553-b3-table-treatment">
   <small>{isGroup?"GROUP ROLL-UP · B3 ONLY":row.status}</small>
   <small>{row.owner||"B3"}</small>
  </span>
 </>;
}

function B3DetailContents0553({item,workingRow,navigationTarget,auditContent}){
 const suffix=item.moduleId.slice(ROOT.length+1);
 const sat=workingRow.b3FortyDayBudget,fat=workingRow.b3ChinaFatBudget,veex=sat.veex;
 switch(suffix){
  case "mgw-r2-cover-20261020":
   return <>
    <MgwR2CommercialCover0553 code="B3"/>
    <p className="p55-note">Supplier USD5,000 iFAT (2 days) + USD2,500 FAT facility
     (minimum 5 days) = USD7,500. This is a MGW vendor quotation, NOT a second
     B3 Working SELL entry. Exact Part A inclusion/payer and 6 witness-day plan are OPEN.</p>
   </>;
  case "revk-china-budget":
   return <B9ChinaBudgetDetail0553 budget={fat} selectedOwner="B3"/>;
  case "fat-owner-transfer":
   return <>
    <MgwPaulVendorClarifications0553 code="B3"/>
    {workingRow.b3FatOwnerTransfer&&<section className="p55-panel"
     data-component-key={ROOT+".fat-owner-transfer"} style={{padding:12,marginTop:12}}>
     <h4>B3 — FAT Cost Owner Reconciliation / Rev05</h4>
     <p className="p55-note">Rev05 Bangkok FAT
      <strong> {money(workingRow.b3FatOwnerTransfer.amountTHB)}</strong> is
      SUPERSEDED, not another source of selected Working SELL. China witness/travel
      <strong> {money(fat.fatWorkingSellTHB)}</strong> appears in B3.1.2 ONLY.</p>
    </section>}
   </>;
  case "40-day-abc":
   return <section className="p55-panel" data-component-key={ROOT+".40-day-abc"}
    style={{padding:12,marginTop:12}}>
    <h4>B3.2.1 — 40-Day Offshore SAT/SIT Working SELL</h4>
    <p className="p55-note">{sat.persons} engineers × {sat.workdays} team-days =
     {" "}{sat.personDays} paid person-days × USD {sat.rateUSDPerPersonDay}/person-day
     × FX {sat.fxTHBPerUSD} = <strong>{money(sat.laborWorkingSellTHB)}</strong>.
     VeEX {money(veex.workingSellTHB)} is NOT in this labour subtotal;
     it belongs to B3.3.1.</p>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>Timebox / ID</th><th>Location / Activity</th><th>Team days</th>
      <th>Person-days</th><th>Working SELL THB</th><th>Scope / Owner</th></tr></thead>
     <tbody>{sat.rows.map(x=><tr key={x.id}>
      <td>{x.id} · {x.wbs}</td><td>{x.site} · {x.reason}</td>
      <td>{x.days}</td><td>{x.plannedPersonDays}</td>
      <td>{money(x.workingSellTHB)}</td><td>B3 once, shared MR workload</td></tr>)}</tbody>
    </table></div>
   </section>;
  case "site-mr-sat-matrix":
   return <B3SiteMrSatCoverage0553 workingRow={workingRow}/>;
  case "veex-mx100":
   return <section className="p55-panel" data-component-key={ROOT+".veex-mx100"}
    style={{padding:12,marginTop:12}}>
    <h4>B3.3.1 — Temporary VeEX MX100+ Test Instrument</h4>
    <p className="p55-note">{veex.quantity} rental-days × {money(veex.rateTHB)} / day
     = <strong>{money(veex.workingSellTHB)}</strong> (ex VAT).
     Cost Owner B3; Working SELL already included; rental Direct Cost NOT ESTABLISHED.
     No duplicate B11 handover special tool.</p>
   </section>;
  case "test-tools-ownership":
   return <section className="p55-panel" data-component-key={ROOT+".test-tools-ownership"}
    style={{padding:12,marginTop:12}}>
    <h4>B3.3.2 — Test Tool Cost Owner / B11 Boundary</h4>
    <p className="p55-note">Temporary calibrated RF analyser, signal generator,
     SPL meter and specialised vessel/radar test support used only for FAT/SAT
     are B3 candidates where independently incurred. No validated Qty × Rate yet,
     so NO numerical amount or assumed zero-price posting.</p>
    <p className="p55-note"><strong>B11 = Special Tools for Operation &amp; Maintenance</strong>
     {" "}<ComponentCopyId projectId="PJ2608-0553"
     componentKey="bid.budget.working.bc.b11"/>; tools included by MGW/OEM Part A
     cannot be billed a second time. Confirm SKU / TAG / SPIR / supplier inclusion.</p>
   </section>;
  case "working-sell-breakdown":
   return <B3WorkingSellBreakdown0553 workingRow={workingRow}/>;
  case "requirement-crosswalk":
   return <B3RequirementWbsTrace0553 selectedOwner="B3"
    navigationTarget={navigationTarget}/>;
  case "source-cost-audit":
   return <div data-component-key={ROOT+".source-cost-audit"}>{auditContent}</div>;
  default:
   throw Error("Unmapped B3 table Module ID: "+item.moduleId+
    ". Add content to existing render registry before introducing a new B3 module.");
 }
}

export function B3WorkTypeAccordion0553({workingRow,navigationTarget=null,auditContent=null}){
 const rootRef=React.useRef(null);
 if(!workingRow||workingRow.code!=="B3")return null;
 const model=selectB3HierarchicalPriceTable0553(workingRow);
 const expandAll=open=>rootRef.current?.querySelectorAll(
  "details.p553-b3-table-group, details.p553-b3-table-item").forEach(node=>{node.open=open;});
 return <section className="p553-b3-worktype p553-b3-price-table-section"
  ref={rootRef} data-component-key={model.moduleId}>
  <div className="p553-b3-worktype-header">
   <div><h4>B3 — Hierarchical Working SELL / Supplier Cost Evidence Table</h4>
    <p className="p55-note">Module ID: {copyInSummary(model.moduleId)}.
     All B3.1–B3.4 and child prices visible BEFORE expanding. Click ＋ / −
     to inspect details, source expense lines and cost ownership.</p>
    <p className="p55-note"><strong>Canonical B3 Working SELL {money(model.totalWorkingSellTHB)}</strong>;
     MGW FAT supplier quote {usd(model.supplierFatReferenceUSD)} =
     {money(model.supplierFatReferenceTHB)} at FX {model.supplierFxTHBPerUSD}
     (SUPPLIER REFERENCE, NOT an additive B3 Working SELL line);
     old Bangkok FAT is HISTORICAL. Direct Cost NOT ESTABLISHED · RELEASE HOLD.</p>
   </div>
   <div className="p553-b3-actions">
    <button type="button" className="p553-detail-button" onClick={()=>expandAll(true)}>＋ Expand All</button>
    <button type="button" className="p553-detail-button" onClick={()=>expandAll(false)}>− Collapse All</button>
   </div>
  </div>
  <div className="p55-table-wrap p553-b3-table-scroll">
   <table className="p55-table p553-b3-hierarchical-table">
    <thead><tr>{gridColumns.map(name=><th key={name}>{name}</th>)}</tr></thead>
    <tbody>{model.groups.map(group=><tr key={group.moduleId} className={"p553-b3-master-row p553-b3-master-row--"+group.kind}>
     <td colSpan={gridColumns.length} className="p553-b3-flat-cell">
      <details className={"p553-b3-table-group p553-b3-table-group--"+group.kind}
       data-component-key={group.moduleId} defaultOpen={group.kind==="fat"||group.kind==="sat"}>
       <summary className="p553-b3-table-summary">
        <span className="p553-b3-table-plus">+</span>
        <TablePriceCells0553 number={group.number} title={group.title} row={group}
         isGroup fx={model.supplierFxTHBPerUSD}/>
        {copyInSummary(group.moduleId)}
       </summary>
       <div className="p553-b3-table-children">
        <table className="p55-table p553-b3-hierarchical-table p553-b3-subtable">
         <thead><tr>{gridColumns.map(name=><th key={name}>{name}</th>)}</tr></thead>
         <tbody>{group.items.map(item=><tr key={item.moduleId}
          className={"p553-b3-detail-row p553-b3-detail-row--"+group.kind}>
          <td colSpan={gridColumns.length} className="p553-b3-flat-cell">
           <details className="p553-b3-table-item">
            <summary className="p553-b3-table-summary p553-b3-table-summary--child">
             <span className="p553-b3-table-plus">+</span>
             <TablePriceCells0553 row={item} number={item.number} title={item.title}
              fx={model.supplierFxTHBPerUSD}/>
             {copyInSummary(item.moduleId)}
            </summary>
            <div className="p553-b3-table-expanded">
             <p className="p55-note">Module ID: {copyInSummary(item.moduleId)} ·
              <strong> Price Class: {item.priceClass}</strong>.
              Supplier quotes, historical prices and audit mirror references
              are NEVER added to the B3 Working SELL contribution.</p>
             {item.supplierRows.length>0&&<div className="p55-table-wrap">
              <table className="p55-table p55-table--compact">
               <thead><tr><th>Supplier ID</th><th>Supplier Scope</th>
                <th>Quoted USD</th><th>Reference THB</th><th>Cost Owner / Price Class</th></tr></thead>
               <tbody>{item.supplierRows.map(x=><tr key={x.id}>
                <td>{x.id}</td><td>{x.description}</td><td>{usd(x.usd)}</td>
                <td>{money(x.usd*model.supplierFxTHBPerUSD)}</td>
                <td>MGW / supplier cost evidence; B3 SELL non-additive</td>
               </tr>)}</tbody>
              </table>
             </div>}
             <B3DetailContents0553 item={item} workingRow={workingRow}
              navigationTarget={navigationTarget} auditContent={auditContent}/>
            </div>
           </details>
          </td>
         </tr>)}</tbody>
         <tfoot><tr><th colSpan={6}>{group.number} — Included Working SELL subtotal
          (supplier/historical/audit excluded)</th><th className="p553-b3-money">
          {money(group.workingSellTHB)}</th><th>ONE B3 owner</th></tr></tfoot>
        </table>
       </div>
      </details>
     </td>
    </tr>)}</tbody>
    <tfoot><tr><th colSpan={6}>B3 TOTAL — INCLUDED WORKING SELL (B3.1+B3.2+B3.3;
     B3.4 non-posting)</th><th className="p553-b3-money">
     {money(model.totalWorkingSellTHB)}</th>
     <th>Direct Cost NOT ESTABLISHED · Release HOLD</th></tr></tfoot>
   </table>
  </div>
  <p className="p55-note"><strong>Price calculation rule:</strong>
   Working SELL is a SUM of only INCLUDED_WORKING_SELL child modules.
   MGW Supplier Quote USD, Historical THB and Audit Mirror THB are SEPARATE
   reference columns. A future B3 Module MUST declare Module ID, Qty/Rate,
   Cost Owner, Price Class, source evidence and content renderer; the
   normalized table rejects extra/unreconciled postings.</p>
 </section>;
}
