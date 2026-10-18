import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectBcWorkCostLines0553} from "./data/bcWorkCostLines0553";
import {B1EngineeringSellModel0553} from "./B1EngineeringSellModel0553";

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
 const totalSell=workingRow.workingSellTHB;
 if(totalMH!==964||!Number.isFinite(totalSell))return <p className="p55-note">B1 reconciliation unavailable: confirm 964 MH and current Working Sell.</p>;
 const round=n=>Math.round(n*100)/100;
 // Proportional presentation-only allocation; no new role rates, vendor costs or sales posting.
 let running=0;
 const allocated=lines.map((x,i)=>{
  const amount=i===lines.length-1?round(totalSell-running):round(totalSell*x.quantity/totalMH);
  running=round(running+amount);
  return {...x,allocatedSellTHB:amount};
 });
 const groups=[["COMMON","Common engineering"],["MR1","MR0001 — SCADA / WiMAX"],["MR2","MR0002 — DMR Trunk Radio"],["MR3","MR0003 — Ex Phone / Sounder"],["MR4","MR0004 — RACON"]];
 const cash=n=>"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
 const [expanded,setExpanded]=React.useState({});
 return <section className="p55-panel" data-component-key="bid.budget.working.bc.b1.sell-breakdown" style={{padding:14,marginTop:12}}>
  <h4>B1 — Working SELL Breakdown / แจกแจงราคางานวิศวกรรม</h4>
  <div className="p55-metric-grid">
   <div><strong>Working SELL รวม B1</strong><p>{cash(totalSell)}</p></div>
   <div><strong>Engineering Workload</strong><p>{totalMH.toLocaleString("en-US")} MH</p></div>
   <div><strong>Average allocated SELL / MH</strong><p>{cash(totalSell/totalMH)}</p></div>
  </div>
  <p className="p55-note"><strong>วิธีอ่าน:</strong> THB {totalSell.toLocaleString("en-US")} เป็นยอด WBS Working Sell ที่มีอยู่แล้ว นำมาแจกแจงตามสัดส่วน Man-hours ของ 27 กิจกรรม (สัดส่วน MH / 964 × 510,000) เพื่อให้เห็นองค์ประกอบเท่านั้น อัตราเฉลี่ยไม่ใช่ Role Day Rate, Vendor Quote หรือ Direct Cost ที่อนุมัติ</p>
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
  <p className="p55-note">Price allocation is NON-POSTING and will update when the canonical B1 Working Sell changes. Historical cost proxies are not included. Actual role-based selling rates and direct costs remain to be verified.</p>
 </section>;
}

export function BcCostEvidenceDetail0553({workingRow}){
 if(!workingRow?.costEvidence)return null;
 const e=workingRow.costEvidence;
 return <section className="p55-panel p553-bc-evidence" data-component-key={e.moduleId+".cost-evidence"} style={{padding:"14px",marginTop:12}}>
  <div className="p55-eyebrow">10.2 / EVIDENCE-TO-COST TRACE — WORKING ONLY</div>
  <h3>{e.code} — {workingRow.requirement}</h3>
  <p className="p55-note">Module ID: <ComponentCopyId projectId="PJ2608-0553" componentKey={e.moduleId}/></p>
  <div className="p55-metric-grid">
   <div><strong>Turnkey Direct Cost</strong><p>NOT ESTABLISHED</p><small>อัตราต้นทุนจริงยังไม่ได้อนุมัติ ห้ามนำ Working SELL มาแทน</small></div>
   <div><strong>WBS Working SELL (THB)</strong><p>{thb(e.workingSellTHB)}</p><small>อ้างอิง Rev05 เท่านั้น</small></div>
   <div><strong>MR / RFQ Evidence Links</strong><p>{e.requirementRecords.length}</p><small>Source requirement ≠ technical approval</small></div>
  </div>
  {e.code==="B6"&&Number.isFinite(e.reconciliation?.historicalRev08TransportSellTHB)&&<p className="p55-note"><strong>B6 Historical Transportation Reference (THB):</strong> {thb(e.reconciliation.historicalRev08TransportSellTHB)} · 4-Scope of Supply.xlsx Rev08 · Conversion at WBS Rev05 planning FX {e.reconciliation.planningFxTHBPerUSD} THB per USD (NOT verified BOT FX). Historical SELL reference only; NOT current freight quotation or Direct Cost. Do not post to current B/C subtotal. Confirm the four MR legs through Bangkok FAT and JUTAL Nantong.</p>}
  <p className="p55-note">SOURCE: <a href={e.sourceUrl} target="_blank" rel="noreferrer">{e.sourceSheet} · {e.sourceRevision}</a>. ต้องใช้ Internal Rate Card / Vendor Rate ที่ควบคุมได้ก่อนคำนวณ Direct Cost</p>
  {(e.code==="B1"||e.code==="B2")&&<section className="p55-panel" data-component-key={"bid.budget.working.bc."+e.code.toLowerCase()+".ownership-boundary"} style={{padding:14,marginTop:12}}>
   <h4>{e.code} — Cost Ownership &amp; No-Double-Count Boundary</h4>
   <p className="p55-note"><strong>B1</strong> owns technical review, OEM interfaces, project/admin and regulatory coordination when separately supported. <strong>B2</strong> owns document-register, transmittal, revision tracking and final dossier assembly. The same technical document may have both a B1 review task and a B2 control task, but not the same labour hours charged twice.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Work object</th><th>B1 treatment</th><th>B2 treatment</th><th>Other owner / gate</th></tr></thead><tbody>
    <tr><td>MR/BOD/DTS, technical calculations &amp; design interfaces</td><td>Technical review / clarification only</td><td>Register, route &amp; track documents only</td><td>OEM authors detailed equipment design; verify included scope</td></tr>
    <tr><td>OEM GA / schematic / wiring documents</td><td>Engineering check and comments; NOT full OEM design duplication</td><td>Revision register / transmittal / dossier</td><td>Vendor original authoring remains OEM/Part A</td></tr>
    <tr><td>VDRL / VDRS / document submissions</td><td>Not charged as document-control MH</td><td>Primary owner: submission, expediting, revision control</td><td>143 source rows / 38 distinct title types are not automatically 143 billable documents</td></tr>
    <tr><td>Final dossier / as-built package</td><td>Review changed technical interfaces only</td><td>Compile, index and transmit final package</td><td>OEM provides own approved as-built technical content</td></tr>
    <tr><td>Admin office / regulatory / licences</td><td>Separate B1 scope candidate; quantify coordination labour and lawful permit fees</td><td>Submission document tracking only, if required</td><td>B6 owns customs brokerage/freight; official fees need evidence and no duplicate posting</td></tr>
    <tr><td>FAT / SAT evidence</td><td>Technical procedure review only when separately required</td><td>Record transmission / filing</td><td>B3 owns physical test execution and signed original test evidence</td></tr>
   </tbody></table></div>
   <p className="p55-note">Current WBS reference is B1 THB 510,000 (964 role-MH / 27 engineering tasks), B2 THB 580,000 (document lifecycle). These are two separate quoted working values—not proof that additional admin, licences or permit fees are already funded. Any scope reallocation requires a work-object/role-MH reconciliation and explicit revised Working SELL approval.</p>
  </section>}
  {e.code==="B1"&&<B1EngineeringSellModel0553 workingRow={workingRow}/>}
  <h4>1. Working Drivers &amp; Calculation Evidence — ต้นทางปริมาณและสมการ</h4>
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
  {e.reconciliation&&<p className="p55-note"><strong>Source Reconciliation:</strong> {Object.entries(e.reconciliation).filter(([k])=>k!=="historicalRev08TransportSellTHB"&&k!=="planningFxTHBPerUSD"&&k!=="displayCurrency").map(([k,v])=>k+": "+(typeof v==="number"?v.toLocaleString("en-US"):Array.isArray(v)?v.join(" – "):v)).join(" · ")}</p>}
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
