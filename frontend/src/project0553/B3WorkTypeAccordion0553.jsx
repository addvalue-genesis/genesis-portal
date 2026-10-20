import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {B3WorkingSellBreakdown0553} from "./B3WorkingSellBreakdown0553";
import {B3RequirementWbsTrace0553} from "./B3RequirementWbsTrace0553";
import {B3SiteMrSatCoverage0553} from "./B3SiteMrSatCoverage0553";
import {B9ChinaBudgetDetail0553} from "./B9ChinaBudgetDetail0553";
import {MgwR2CommercialCover0553} from "./MgwR2CommercialCover0553";
import {MgwPaulVendorClarifications0553} from "./MgwPaulVendorClarifications0553";

// Presentation-only B3 grouping. No new source prices, Cost Owner or cost posting.
// Use native <details> so Project Module Navigator can open ALL ancestors of a leaf.
const ROOT="bid.budget.working.bc.b3";
const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";

function B3Group0553({number,kind,title,description,defaultOpen=false,children}){
 const moduleId=ROOT+"."+kind;
 return <details className={"p553-b3-group p553-b3-group--"+kind}
  data-component-key={moduleId} defaultOpen={defaultOpen}>
  <summary className="p553-b3-summary">
   <span className="p553-b3-sequence">{number}</span>
   <span className="p553-b3-summary-label"><strong>{title}</strong>
    <small>{description}</small><code>{moduleId}</code></span>
  </summary>
  <div className="p553-b3-group-body">
   <p className="p55-note">Group Module ID: <ComponentCopyId projectId="PJ2608-0553" componentKey={moduleId}/></p>
   {children}
  </div>
 </details>;
}

function B3Item0553({number,title,moduleId,children,defaultOpen=false}){
 return <details className="p553-b3-accordion-item" defaultOpen={defaultOpen}>
  <summary className="p553-b3-item-summary">
   <span className="p553-b3-sequence">{number}</span>
   <span className="p553-b3-summary-label"><strong>{title}</strong><code>{moduleId}</code></span>
  </summary>
  <div className="p553-b3-item-body">
   <p className="p55-note">Module ID: <ComponentCopyId projectId="PJ2608-0553" componentKey={moduleId}/></p>
   {children}
  </div>
 </details>;
}

export function B3WorkTypeAccordion0553({workingRow,navigationTarget=null,auditContent=null}){
 const rootRef=React.useRef(null);
 if(!workingRow||workingRow.code!=="B3")return null;
 const sat=workingRow.b3FortyDayBudget;
 const fat=workingRow.b3ChinaFatBudget;
 if(!sat||!fat||sat.workdays!==40||sat.persons!==2||
  sat.laborWorkingSellTHB!==2016000||sat.veex?.workingSellTHB!==30000||
  fat.fatWorkingSellTHB!==397400||workingRow.workingSellTHB!==2443400||
  workingRow.directCostTHB!==null)
  throw Error("B3 visual groups must mirror canonical 40-day SAT, FAT and VeEX SELL without cost mutation");
 // Button changes ONLY disclosure DOM state; source models and pricing are immutable.
 const expandAll=open=>{
  rootRef.current?.querySelectorAll("details.p553-b3-group, details.p553-b3-accordion-item")
   .forEach(node=>{node.open=open;});
 };
 const veex=sat.veex;
 return <section className="p553-b3-worktype" ref={rootRef}
  data-component-key={ROOT+".worktype-accordion"}>
  <div className="p553-b3-worktype-header">
   <div><h4>B3 — Inspection, Testing &amp; Certification / จัดกลุ่มตามประเภทงาน</h4>
    <p className="p55-note">Working SELL <strong>{money(workingRow.workingSellTHB)}</strong> · Direct Cost NOT ESTABLISHED · RELEASE HOLD.
     All categories are views of ONE canonical B3 owner; grouped totals are not new postings.</p></div>
   <div className="p553-b3-actions">
    <button type="button" className="p553-detail-button" onClick={()=>expandAll(true)}>＋ Expand All</button>
    <button type="button" className="p553-detail-button" onClick={()=>expandAll(false)}>− Collapse All</button>
   </div>
  </div>
  <B3Group0553 number="B3.1" kind="fat" title="FAT — Factory Acceptance Test"
   description="MGW China · OEM FAT evidence / ADDVALUE witness and travel" defaultOpen>
   <B3Item0553 number="B3.1.1" title="MGW Rev.2 Supplier iFAT / Facility Evidence"
    moduleId={ROOT+".mgw-r2-cover-20261020"} defaultOpen>
    <MgwR2CommercialCover0553 code="B3"/>
    <p className="p55-note">Supplier iFAT/facility USD amounts are supplier quote evidence, NOT another B3 Working SELL line.
     Compare the 2-day iFAT + minimum 5-day FAT facility with ADDVALUE's 6 FAT witness workdays before approval.</p>
   </B3Item0553>
   <B3Item0553 number="B3.1.2" title="MGW China FAT Witness · Labour / Travel / Insurance"
    moduleId={ROOT+".revk-china-budget"}>
    <B9ChinaBudgetDetail0553 budget={fat} selectedOwner="B3"/>
   </B3Item0553>
   <B3Item0553 number="B3.1.3" title="FAT Ownership, Supplier Clarifications & Historical Transfer"
    moduleId={ROOT+".fat-owner-transfer"}>
    <MgwPaulVendorClarifications0553 code="B3"/>
    {workingRow.b3FatOwnerTransfer&&<section className="p55-panel"
     data-component-key={ROOT+".fat-owner-transfer"} style={{padding:12,marginTop:12}}>
     <h4>B3 — Rev.K FAT Cost Owner Reconciliation</h4>
     <p className="p55-note">Rev05 Bangkok FAT <strong>{money(workingRow.b3FatOwnerTransfer.amountTHB)}</strong> is
      superseded. MGW China FAT witness stays in B3 <strong>{money(fat.fatWorkingSellTHB)}</strong>.
      Do not post old Bangkok FAT or OEM FAT execution a second time. Historical evidence is non-additive.</p>
    </section>}
   </B3Item0553>
  </B3Group0553>

  <B3Group0553 number="B3.2" kind="sat" title="SAT / SIT — Offshore Site & Integration Tests"
   description="Seven locations · 40 team-days · 19 Site/MR tests + SIT/Punch" defaultOpen>
   <B3Item0553 number="B3.2.1" title="40-Day SAT/SIT Execution Budget"
    moduleId={ROOT+".40-day-abc"} defaultOpen>
    <section className="p55-panel" data-component-key={ROOT+".40-day-abc"} style={{padding:12}}>
     <p className="p55-note">{sat.persons} specialists × {sat.workdays} team working days
      = <strong>{sat.personDays} man-days</strong>; Offshore labour Working SELL
      = <strong>{money(sat.laborWorkingSellTHB)}</strong>.</p>
     <p className="p55-note">VeEX rental {money(veex.workingSellTHB)} is separately shown under B3.3,
      but remains INCLUDED in the existing B3 total. No new site/MR prices are created.</p>
    </section>
   </B3Item0553>
   <B3Item0553 number="B3.2.2" title="Seven-Site / Four-MR SAT Matrix & Individual Tests"
    moduleId={ROOT+".site-mr-sat-matrix"}>
    <B3SiteMrSatCoverage0553 workingRow={workingRow}/>
   </B3Item0553>
  </B3Group0553>

  <B3Group0553 number="B3.3" kind="tools" title="Test Equipment — Temporary FAT/SAT Tools"
   description="Temporary test rental B3; permanent O&amp;M special tools B11">
   <B3Item0553 number="B3.3.1" title="VeEX MX100+ — Temporary SAT Rental"
    moduleId={ROOT+".veex-mx100"}>
    <section className="p55-panel" data-component-key={ROOT+".veex-mx100"} style={{padding:12}}>
     <p className="p55-note"><strong>{veex.quantity} rental-days × THB {veex.rateTHB.toLocaleString("en-US")}/day
      = {money(veex.workingSellTHB)}</strong> (ex VAT). Cost Owner B3.
      This is the SAME VeEX allowance already included in B3 Working SELL — non-additive.</p>
     <p className="p55-note">Verified direct rental cost: <strong>NOT ESTABLISHED</strong>;
      no extra B11 purchase and no per-Site / per-MR duplicate.</p>
    </section>
   </B3Item0553>
   <B3Item0553 number="B3.3.2" title="Other Test Instruments & B11 Ownership Boundary"
    moduleId={ROOT+".test-tools-ownership"}>
    <section className="p55-panel" data-component-key={ROOT+".test-tools-ownership"} style={{padding:12}}>
     <p className="p55-note">Temporary calibrated RF analyzer, generator, SPL meter or vessel/radar test
      support needed ONLY for FAT/SAT belongs to B3 execution where separately incurred, subject
      to OEM-inclusion, contract payer and actual quotation. No added rental price is established.</p>
     <p className="p55-note"><strong>B11 = Special Tools for Operation &amp; Maintenance, handed over to purchaser.</strong>
      Owner Module ID: <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.working.bc.b11"/>.
      OEM-included RACON programming kit or tools already in Part A must not be charged again in B11.
      Confirm deliverable SKU, TAG, quantity and SPIR before any adjustment.</p>
    </section>
   </B3Item0553>
  </B3Group0553>

  <B3Group0553 number="B3.4" kind="audit" title="Price Reconciliation / Requirement & Cost Audit"
   description="Canonical THB 2,443,400 · 19 obligations · historical audit is non-posting">
   <B3Item0553 number="B3.4.1" title="Working SELL Breakdown — Single Source"
    moduleId={ROOT+".working-sell-breakdown"}>
    <B3WorkingSellBreakdown0553 workingRow={workingRow}/>
   </B3Item0553>
   <B3Item0553 number="B3.4.2" title="Contract Requirements & Cost Owner Crosswalk"
    moduleId={ROOT+".requirement-crosswalk"}>
    <B3RequirementWbsTrace0553 selectedOwner="B3" navigationTarget={navigationTarget}/>
   </B3Item0553>
   <B3Item0553 number="B3.4.3" title="Historical WBS / Source & Direct Cost Gaps"
    moduleId={ROOT+".source-cost-audit"}>
    <div data-component-key={ROOT+".source-cost-audit"}>{auditContent}</div>
   </B3Item0553>
  </B3Group0553>
 </section>;
}
