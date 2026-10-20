import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectBcWorkCostLines0553} from "./data/bcWorkCostLines0553";
import {B1EngineeringSellModel0553} from "./B1EngineeringSellModel0553";
import {selectB1ProjectExpenseLedger0553} from "./data/b1IndirectCostLedger0553";
import {B1RevKMilestoneBudget0553} from "./B1RevKMilestoneBudget0553";
import {B9ChinaBudgetDetail0553} from "./B9ChinaBudgetDetail0553";
import {B3RequirementWbsTrace0553} from "./B3RequirementWbsTrace0553";
import {B3SiteMrSatCoverage0553} from "./B3SiteMrSatCoverage0553";
import {B3WorkingSellBreakdown0553} from "./B3WorkingSellBreakdown0553";
import {MgwPaulVendorClarifications0553} from "./MgwPaulVendorClarifications0553";
import {MgwR2CommercialCover0553} from "./MgwR2CommercialCover0553";

// Read-only drill-down inside existing 10.2. Numeric value types must never
// imply that historical payroll cost or the WBS SELL is verified direct COST.
const thb=x=>Number.isFinite(x)?"THB "+x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const qty=x=>Number.isFinite(x)?x.toLocaleString("en-US"):"TBC";
const readableKind=Object.freeze({
 QUANTITY_OR_REQUIREMENT_ONLY:"Engineering driver / Qty only",
 WORKING_SELL_DERIVED:"WBS Working SELL calculation — NOT cost",
 HISTORICAL_COST_PROXY_ONLY:"Historical cost proxy — NOT approved",
 HISTORICAL_SELL_CALIBRATION_ONLY:"Historical sell calibration — NOT approved"
});


function B1WorkingSellBreakdown0553({workingRow}){
 const lines=selectBcWorkCostLines0553().rows.filter(x=>x.code==="B1"&&x.id.startsWith("B1-WBS-"));
 const totalMH=lines.reduce((n,x)=>n+x.quantity,0);
 const totalSell=workingRow.b1ActivityBudget?.engineeringSellTHB;
 if(totalMH!==964||!Number.isFinite(totalSell))return <p className="p55-note">B1 reconciliation unavailable: confirm 964 MH and current Working Sell.</p>;
 const round=n=>Math.round(n*100)/100;
 // Proportional presentation-only allocation; no new role rates, vendor costs or sales posting.
 let running=0;
 const allocated=lines.map((x,i)=>{
  const amount=i===lines.length-1?round(totalSell-running):workingRow.b1ActivityBudget.engineeringRows[i].workingSellTHB;
  running=round(running+amount);
  return {...x,allocatedSellTHB:amount};
 });
 const groups=[["COMMON","Common engineering"],["MR1","MR0001 — SCADA / WiMAX"],["MR2","MR0002 — DMR Trunk Radio"],["MR3","MR0003 — Ex Phone / Sounder"],["MR4","MR0004 — RACON"]];
 const cash=n=>"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
 const [expanded,setExpanded]=React.useState({});
 return <section className="p55-panel" data-component-key="bid.budget.working.bc.b1.sell-breakdown" style={{padding:14,marginTop:12}}>
  <h4>B1 — Working SELL Breakdown / แจกแจงราคางานวิศวกรรม</h4>
  <div className="p55-metric-grid">
   <div><strong>B1 Engineering SELL (excludes PM)</strong><p>{cash(totalSell)}</p></div>
   <div><strong>Engineering Workload</strong><p>{totalMH.toLocaleString("en-US")} MH</p></div>
   <div><strong>Average allocated SELL / MH</strong><p>{cash(totalSell/totalMH)}</p></div>
  </div>
  <p className="p55-note"><strong>วิธีอ่าน:</strong> ราคา Engineering {cash(totalSell)} มาจาก 27 WBS / 964 MH โดยคูณ Role Hours กับ Rev05 rate seeds และ office commercial factor; อีก {cash(workingRow.b1ActivityBudget?.officePmWorkingSellTHB)} มาจาก 48 ชั่วโมง PM ใน 11 Rev.K gate ที่ไม่ซ้ำ (K00 kickoff ถูกตัดออก) รวม B1 ใหม่ {cash(workingRow.workingSellTHB)}. เป็น Working SELL budgetary ไม่ใช่ Payroll Direct Cost ที่ยืนยันแล้ว</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget" style={{width:"100%",minWidth:740,tableLayout:"fixed"}}>
   <colgroup><col style={{width:"43%"}}/><col style={{width:"12%"}}/><col style={{width:"15%"}}/><col style={{width:"20%"}}/><col style={{width:"10%"}}/></colgroup>
   <thead><tr><th>กลุ่มงาน / System</th><th>Activities</th><th>MH</th><th>Allocated Working SELL THB</th><th>รายละเอียด</th></tr></thead>
   <tbody>{groups.map(([key,label])=>{
    const rows=allocated.filter(x=>x.group===key);
    const mh=rows.reduce((n,x)=>n+x.quantity,0);
    const amount=round(rows.reduce((n,x)=>n+x.allocatedSellTHB,0));
    return <React.Fragment key={key}><tr><td><strong>{label}</strong></td><td>{rows.length}</td><td>{mh.toLocaleString("en-US")}</td><td className="is-number"><strong>{cash(amount)}</strong></td><td><button type="button" className="p553-detail-button" aria-expanded={!!expanded[key]} onClick={()=>setExpanded(v=>({...v,[key]:!v[key]}))}>{expanded[key]?"− Hide":"+ View"}</button></td></tr>
     {expanded[key]&&<tr><td colSpan={5}><div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{width:"100%",minWidth:650}}>
      <thead><tr><th>Activity / WBS</th><th>Lead</th><th>Senior</th><th>Engineer</th><th>Drafter</th><th>DC</th><th>Total MH</th><th>Allocated SELL THB</th></tr></thead>
      <tbody>{rows.map(x=><tr key={x.id}><td><strong>{x.name}</strong><small>{x.id}</small></td>{["Lead","Senior","Engineer","Drafter","Document Control"].map(role=><td key={role}>{x.roleMH?.[role]||"—"}</td>)}<td>{x.quantity}</td><td className="is-number">{cash(x.allocatedSellTHB)}</td></tr>)}</tbody>
     </table></div></td></tr>}</React.Fragment>;
   })}<tr><td><strong>TOTAL B1 — Reconciled to Working SELL</strong></td><td>{lines.length}</td><td><strong>{totalMH}</strong></td><td className="is-number"><strong>{cash(running)}</strong></td><td>{Math.abs(running-totalSell)<0.01?"PASS":"CHECK"}</td></tr></tbody>
  </table></div>
  <p className="p55-note">B1 engineering activity SELL is linked to the current 27-line role-hour scenario. This is a read-only distribution of canonical Working SELL, not a second budget posting. Actual role-based selling rates and direct costs remain to be verified.</p>
 </section>;
}

function B1IndirectExpenseRegister0553({workingRow}){
 const ledger=selectB1ProjectExpenseLedger0553();
 const [showCross,setShowCross]=React.useState(false);
 const [expanded,setExpanded]=React.useState({"B1.1":true,"B1.2":true,"B1.3":true,"B1.4":true,"B1.5":true,"B1.6":true,"B1.7":true,"B1.8":true});
 const groups=[["B1.1","Project Management"],["B1.2","Meetings & Representation"],["B1.3","Management Travel"],["B1.4","Office/Admin"],["B1.5","Regulatory Coordination"],["B1.6","Legal/Local Consultant"],["B1.7","Official Fees"],["B1.8","Other Project Expenses"]];
 const cash=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
 const renderRows=rows=><div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1560,width:"100%",tableLayout:"fixed",fontSize:12}}>
  <colgroup><col style={{width:"10%"}}/><col style={{width:"13%"}}/><col style={{width:"11%"}}/><col style={{width:"17%"}}/><col style={{width:"13%"}}/><col style={{width:"11%"}}/><col style={{width:"12%"}}/><col style={{width:"13%"}}/></colgroup>
  <thead><tr><th>WBS / Expense ID</th><th>WHO — ผู้ปฏิบัติ</th><th>WHERE — สถานที่</th><th>WHAT &amp; HOW — วิธีทำ/ผลส่งมอบ</th><th>COST OWNER / PAYER</th><th>QTY / RATE</th><th>WORKING COST / SELL</th><th>SOURCE / CFO GATE</th></tr></thead>
  <tbody>{rows.map(r=><tr key={r.id} style={{verticalAlign:"top",overflowWrap:"anywhere",whiteSpace:"normal"}}>
   <td><strong>{r.id}</strong><small>{r.wbs}</small><small>{r.account||r.owner}</small></td>
   <td><strong>{r.executor}</strong><small>{r.executionStatus}</small></td>
   <td>{r.location}</td>
   <td><strong>{r.activity}</strong><small>Method: {r.method}</small><small>Deliverable: {r.deliverable}</small></td>
   <td><strong>{r.owner}</strong><small>Payer: {r.payer}</small><small>{r.classification}</small></td>
   <td><strong>{r.unit}</strong><small>Qty: {r.quantity??"NOT VERIFIED"}</small><small>Unit rate: {cash(r.unitCostTHB)}</small><small>{r.quantityBasis}</small></td>
   <td><strong>Cost: {cash(r.workingCostTHB)}</strong><small>Sell: {cash(r.workingSellTHB)}</small><small>{r.postingState}</small></td>
   <td>{r.source}<small>{r.gate}</small><small>Event key: {r.expenseObjectKey}</small><small>{r.invoiceStatus}</small></td>
  </tr>)}</tbody></table></div>;
 return <section className="p55-panel" data-component-key="bid.budget.working.bc.b1.indirect-ledger" style={{padding:14,marginTop:12}}>
  <h3>B1 — Project Expense Ledger (WBS-Driven / Single Cost Owner)</h3>
  <p className="p55-note" data-component-key={ledger.pendingAllocationPolicy.moduleId}><strong>B1 PENDING COST OWNER (Suspense):</strong> รายการจาก BOD/DTS/SPE/WBS ที่ยังไม่พบหมวด A/B2–B14/C ให้พักตรวจใน B1 ก่อนโดยไม่บวก Working Cost/Working Sell อัตโนมัติ เมื่อยืนยันว่าเป็นค่า FAT/SAT/Witness ให้ออกไป B3; เฉพาะ Yard Specialist Call-out จึงอยู่ B9; ส่วนที่เหลือ B1 เฉพาะ PM/Indirect ที่มีหลักฐานและไม่ซ้ำหมวดอื่น</p>
  <p className="p55-note"><strong>CFO REVIEW VIEW — Who / What / Where / How / Cost Owner / Payer / Quantity / Rate / Evidence.</strong> Rev.K K00–K18 and Rev.L Yard roles, Rev.J Gantt and Rev.I risk review, MR0001–0004 / BOD / DTS / SPE / TAG MTO. Role/location assumptions and MGW FAT venue conflicts are flagged, not treated as approvals. No new Direct Cost posting. Earlier Engineering WBS pricing has been excluded from active B1; the source-register rows below stay nonposting. The new B1.1–B1.8 THB multi-role and expense estimate is itemized in the Rev.K budget immediately above, while actual payroll/invoices and contractual payers remain to verify.</p>
  <div className="p55-metric-grid">
   <div><strong>NEW Canonical B1 Working Sell</strong><p>{cash(workingRow.workingSellTHB)}</p><small>New B1.1–B1.8 role-based THB estimate only; old Engineering/PM prices excluded</small></div>
   <div><strong>New B1 Support Working Cost (planning)</strong><p>{cash(workingRow.b1SupportPlanningBudget?.baseWorkingCostTHB)}</p><small>Seven roles + B1.2–B1.8 expenses; NOT verified Direct Cost</small></div>
   <div><strong>Engineering Ownership Review (UNPRICED)</strong><p>{workingRow.b1SupportPlanningBudget?.engineeringScopeReview.length||0} items</p><small>Only distinct ADDVALUE technical engineering may later enter B1 after checking B2/OEM</small></div>
   <div><strong>Conditional B1 Allowances (SELL)</strong><p>{cash(workingRow.b1SupportPlanningBudget?.conditionalWorkingSellTHB)}</p><small>Legal consultant / statutory permits excluded from Base</small></div>
   <div><strong>B1 source expense objects</strong><p>{ledger.b1.length}</p><small>{ledger.unpricedB1} awaiting cost evidence</small></div>
   <div><strong>Other-owner expense objects</strong><p>{ledger.outside.length}</p><small>Reference only; cannot post into B1</small></div>
   <div><strong>Who/Where/How mapped</strong><p>{ledger.roleMappedCount}/{ledger.rows.length}</p><small>Mapped is not an approved RACI or priced budget</small></div>
  </div>
  {groups.map(([account,title])=>{const rows=ledger.b1.filter(r=>r.account===account);return <section key={account} style={{marginBottom:10}}><button type="button" className="p553-detail-button" aria-expanded={!!expanded[account]} onClick={()=>setExpanded(x=>({...x,[account]:!x[account]}))}>{expanded[account]?"−":"+"} {account} — {title} ({rows.length})</button>{expanded[account]&&renderRows(rows)}</section>;})}
  <button type="button" className="p553-detail-button" aria-expanded={showCross} onClick={()=>setShowCross(x=>!x)}>{showCross?"−":"+"} Cross-owner WBS Expenses (B2–B14, A, C, third parties) — non-additive</button>
  {showCross&&renderRows(ledger.outside)}
  <p className="p55-note"><strong>Double-post rule:</strong> MGW FAT witness staff/travel/insurance → B3 once; offshore SAT/SIT → B3; optional Yard Specialist → B9; VDRL/document control → B2; freight/customs broker → B6; OEM included equipment/tools → Part A; B1 only project management, lawful permit/regulatory, office and separately evidenced executive costs. No amount can enter B1 without a unique Expense ID, quantity, rate source and ownership check.</p>
 </section>;
}

export function BcCostEvidenceDetail0553({workingRow,navigationTarget=null}){
 if(!workingRow?.costEvidence)return null;
 const e=workingRow.costEvidence;
 return <section className="p55-panel p553-bc-evidence" data-component-key={e.moduleId+".cost-evidence"} style={{padding:"14px",marginTop:12}}>
  <div className="p55-eyebrow">10.2 / EVIDENCE-TO-COST TRACE — WORKING ONLY</div>
  <h3>{e.code} — {workingRow.requirement}</h3>
  <MgwR2CommercialCover0553 code={e.code}/>
  <MgwPaulVendorClarifications0553 code={e.code}/>
  <p className="p55-note">Module ID: <ComponentCopyId projectId="PJ2608-0553" componentKey={e.moduleId}/></p>
  <div className="p55-metric-grid">
   <div><strong>Turnkey Direct Cost</strong><p>NOT ESTABLISHED</p><small>อัตราต้นทุนจริงยังไม่ได้อนุมัติ ห้ามนำ Working SELL มาแทน</small></div>
   <div><strong>Current Working SELL (THB)</strong><p>{thb(workingRow.workingSellTHB)}</p><small>{e.code==="B1"?"Current B1 SELL from fresh B1.1–B1.8 support-only THB resource budget; actual Direct Cost OPEN, old engineering/PM quotes excluded":e.code==="B3"?"Current MGW FAT Witness + Offshore SAT/SIT + VeEX rental, all Inspection/Testing under B3":e.code==="B9"?"No B9 Base; only conditional Yard Specialist 1 LS":"Working source estimate"}</small></div>
   <div><strong>MR / RFQ Evidence Links</strong><p>{e.requirementRecords.length}</p><small>Source requirement ≠ technical approval</small></div>
  </div>
  {e.code==="B6"&&Number.isFinite(e.reconciliation?.historicalRev08TransportSellTHB)&&<p className="p55-note"><strong>B6 Historical Transportation Reference (THB):</strong> {thb(e.reconciliation.historicalRev08TransportSellTHB)} · 4-Scope of Supply.xlsx Rev08 · Conversion at WBS Rev05 planning FX {e.reconciliation.planningFxTHBPerUSD} THB per USD (NOT verified BOT FX). Historical SELL reference only; NOT current freight quotation or Direct Cost. Do not post to current B/C subtotal. Reconcile all four MR cargo legs against current MGW China FAT and DDP JUTAL Zhuhai Yard; Bangkok/Nantong are historical Rev05 routes only.</p>}
  {e.code==="B9"&&workingRow.b9OnshoreRateReview&&<section className="p55-panel" data-component-key="bid.budget.working.bc.b9.onshore-rate-policy" style={{padding:12,marginTop:12}}>
   <h4>B9 — Conditional Yard Specialist Onshore SELL Rate (FAT Witness = B3)</h4>
   <div className="p55-metric-grid">
    <div><strong>Rate / Person / Day</strong><p>USD {workingRow.b9OnshoreRateReview.perPersonUSDPerDay}</p><small>THB {workingRow.b9OnshoreRateReview.perPersonTHBPerDay.toLocaleString("en-US")} / person-day</small></div>
    <div><strong>Yard Senior Engineer Onshore SELL Rate</strong><p>THB {workingRow.b9OnshoreRateReview.perPersonTHBPerDay.toLocaleString("en-US")}</p><small>One paid engineer only · no separately priced per diem · FAT crew billed B3</small></div>
    <div><strong>Current B9 Working SELL</strong><p>{thb(workingRow.workingSellTHB)}</p><small>B9 has zero Base activity; Yard Call-out 1 LS THB 233,600 remains Conditional, excluded from Part B Base</small></div>
   </div>
   <p className="p55-note">MGW China FAT Witness travel/personnel/insurance belong to B3 Inspection, Testing and Certification. B9 holds ONLY requested Yard specialist assistance; no B3 FAT cost may appear in B9. USD600/day is a selling-rate input, not internal payroll Direct Cost.</p>
  </section>}
  {e.code==="B3"&&<B3WorkingSellBreakdown0553 workingRow={workingRow}/>}
  {(e.code==="B3"||e.code==="B9")&&<B3RequirementWbsTrace0553 selectedOwner={e.code} navigationTarget={navigationTarget}/>}
  {e.code==="B3"&&<B3SiteMrSatCoverage0553 workingRow={workingRow}/>}
  {e.code==="B3"&&<B9ChinaBudgetDetail0553 budget={workingRow.b3ChinaFatBudget} selectedOwner="B3"/>}
  {e.code==="B9"&&<B9ChinaBudgetDetail0553 budget={workingRow.b9ChinaBudget} selectedOwner="B9"/>}
  {e.code==="B3"&&workingRow.b3FatOwnerTransfer&&<section className="p55-panel" data-component-key="bid.budget.working.bc.b3.fat-owner-transfer" style={{padding:12,marginTop:12}}><h4>B3 — Rev.K FAT Cost Owner Reconciliation</h4><p className="p55-note">Rev05 Bangkok FAT allocation <strong>THB {workingRow.b3FatOwnerTransfer.amountTHB.toLocaleString("en-US")}</strong> is removed from B3. MGW China FAT witness labor/travel stays in contractual B3 (new THB 397,400); old Bangkok FAT THB144,000 is superseded once. B3 includes 40 Offshore SAT/SIT workdays, 30-day VeEX rental and MGW FAT Witness: <strong>{thb(workingRow.workingSellTHB)}</strong>. Historical FAT source evidence is not additive.</p></section>}
  <p className="p55-note">SOURCE: <a href={e.sourceUrl} target="_blank" rel="noreferrer">{e.sourceSheet} · {e.sourceRevision}</a>. ต้องใช้ Internal Rate Card / Vendor Rate ที่ควบคุมได้ก่อนคำนวณ Direct Cost</p>
  {(e.code==="B1"||e.code==="B2")&&<section className="p55-panel" data-component-key={"bid.budget.working.bc."+e.code.toLowerCase()+".ownership-boundary"} style={{padding:16,marginTop:12}}>
   <h4>ขอบเขต B1 และ B2 ที่ควรแยก</h4>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{width:"100%",tableLayout:"fixed"}}>
    <colgroup><col style={{width:"78%"}}/><col style={{width:"11%"}}/><col style={{width:"11%"}}/></colgroup>
    <thead><tr><th>ประเภทงาน</th><th style={{textAlign:"center"}}>B1</th><th style={{textAlign:"center"}}>B2</th></tr></thead>
    <tbody>{[
     ["Engineering Design / Technical Review","B1"],
     ["Technical License Documentation (technical content)","B1"],
     ["Admin Office / Project Coordination","B1"],
     ["Import / Operating License Coordination","B1"],
     ["Permit Application / Official Fees (lawful, evidence required)","B1"],
     ["Visa / Work Permit / Local Consultant (non-duplicated scope)","B1"],
     ["VDRL / VDRS / Transmittal","B2"],
     ["Document Revision / Final Dossier (document control)","B2"]
    ].map(([name,owner])=><tr key={name}><td>{name}</td>{["B1","B2"].map(code=><td key={code} style={{textAlign:"center",fontWeight:700,color:owner===code?"#15803d":undefined}}>{owner===code?"✓":"—"}</td>)}</tr>)}</tbody>
   </table></div>
   <details style={{marginTop:12}}><summary>รายละเอียดขอบเขตและการป้องกันคิดราคาซ้ำ</summary>
    <p className="p55-note">B1 เป็นเจ้าของงานตรวจเนื้อหาทางเทคนิคและการประสานงานโครงการ รวมถึง Regulatory/Permit support เมื่อมีหลักฐานค่าใช้จ่าย ส่วน B2 จัดการเอกสาร VDRL, transmittal, revision tracking และ final dossier ไม่คิดค่าจัดทำเนื้อหาทางเทคนิคซ้ำ</p>
    <p className="p55-note">Detailed equipment design อยู่กับ OEM/Part A; Offshore SAT/SIT execution อยู่ B3; MGW China FAT Witness อยู่ B3 และเฉพาะ Conditional Yard Senior Engineer อยู่ B9; customs brokerage และ freight อยู่ B6; งานหรือ Man-hours ที่เกิดขึ้นในหลายหมวดต้องระบุ owner เดียวก่อนรวมราคา โดยค่าใช้จ่ายที่ปรึกษาและค่าธรรมเนียมราชการที่มีเงื่อนไขยังไม่รวมใน B1 Base และราคา Engineering WBS เก่าถูกตัดจาก B1</p>
   </details>
  </section>}
  {e.code==="B1"&&<B1RevKMilestoneBudget0553/>}
  {e.code==="B1"&&<B1IndirectExpenseRegister0553 workingRow={workingRow}/>}
   {/* No former 964-MH Engineering pricing audit rendered in current B1 */}
  {e.code==="B1"&&<p className="p55-note"><strong>B1 current basis:</strong> New B1.1–B1.8 roles and expenses only. Old Engineering 964-MH price excluded. Engineering activity titles appear solely in unpriced scope-owner review above.</p>}
  {e.code!=="B1"&&<>
  <h4>{e.code==="B3"||e.code==="B9"?"Rev05 Original WBS Calculation Audit — ไม่ใช่ราคาปัจจุบัน":"1. Working Drivers & Calculation Evidence — ต้นทางปริมาณและสมการ"}</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Activity / Physical Work</th><th>Quantity</th><th>Rate THB</th><th>Evidence Amount THB</th><th>ประเภท / แหล่งข้อมูล</th></tr></thead>
   <tbody>{e.lines.map(line=><tr key={line.id}>
    <td><strong>{line.activity}</strong><small>{line.id}</small></td>
    <td>{qty(line.quantity)} {line.unit}</td>
    <td>{thb(line.rateTHB)}</td>
    <td>{thb(line.amountTHB)}</td>
    <td><strong>{readableKind[line.valueClass]||line.valueClass}</strong><small>{line.status}</small><small>{line.evidence}</small></td>
   </tr>)}</tbody>
  </table></div>
  {e.reconciliation&&<p className="p55-note"><strong>{e.code==="B3"||e.code==="B9"?"Rev05 source reconciliation (superseded for current FAT/B9 sell):":"Source Reconciliation:"}</strong> {Object.entries(e.reconciliation).filter(([k])=>k!=="historicalRev08TransportSellTHB"&&k!=="planningFxTHBPerUSD"&&k!=="displayCurrency").map(([k,v])=>k+": "+(typeof v==="number"?v.toLocaleString("en-US"):Array.isArray(v)?v.join(" – "):v)).join(" · ")}</p>}
  </>}
  <h4>2. Input / Cost Gaps — ข้อมูลที่ต้องยืนยันก่อนคิดต้นทุน</h4>
  <ul>{e.requiredInputs.map((g,i)=><li key={i}>{g}</li>)}</ul>
  <details className="p55-panel" style={{padding:12,marginTop:10}}>
   <summary><strong>3. Workflow 01–08 — Source &amp; Engineering Verification Trail</strong> (เปิดดู 8 ขั้นตอน)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Step</th><th>Principle / Source Owner</th><th>Verification State</th><th>Evidence / Remaining Action</th></tr></thead>
    <tbody>{e.stages.map(stage=><tr key={stage.id}><td>{stage.id}</td><td>{stage.name}</td><td>{stage.state}</td><td>{stage.basis}</td></tr>)}</tbody>
   </table></div>
  </details>
  {e.requirementRecords.length>0&&<details className="p55-panel" style={{padding:12,marginTop:10}}>
   <summary><strong>4. RFQ/MR Source Requirement IDs</strong> ({e.requirementRecords.length} linked)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>ID</th><th>Document</th><th>Subject / Requirement</th><th>Source State</th></tr></thead><tbody>
    {e.requirementRecords.map(r=><tr key={r.id}><td>{r.id}</td><td>{r.sourceClass} §{r.section||"N/A"}</td><td><strong>{r.topic}</strong><small>{r.requirement}</small></td><td>{r.state}</td></tr>)}
   </tbody></table></div>
  </details>}
  <p className="p55-note"><strong>NO DOUBLE COUNT:</strong> {e.noDoubleCountRule} · Direct Cost / Risk / Customer Sell จะยังไม่ถูก Post จนกว่า Cost Evidence จะครบและผ่านการอนุมัติ</p>
 </section>;
}
