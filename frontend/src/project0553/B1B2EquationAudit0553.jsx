import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectBcWorkCostLines0553} from "./data/bcWorkCostLines0553";

// Shared read-only GEQ/PEQ proof: section 02 owns the mathematical method;
// 10.2 consumes the SAME proof, never an independent second price calculator.
export function B1B2EquationAudit0553({selectedCode="ALL"}){
 const [showRows,setShowRows]=useState(false);
 const w=selectBcWorkCostLines0553();
 const proof=w.equationProof;
 if(!proof||!proof.validation)throw Error("Missing section 02 B1/B2 equation execution proof");
 if(selectedCode!=="ALL"&&selectedCode!=="B1"&&selectedCode!=="B2")return null;
 const b1=selectedCode==="ALL"||selectedCode==="B1";
 const b2=selectedCode==="ALL"||selectedCode==="B2";
 return <details className="p55-panel" data-component-key={proof.moduleId}
  open={selectedCode!=="ALL"} style={{marginTop:12,padding:"12px 14px"}}>
  <summary><strong>02 → 10.2 | B1/B2 Equation Execution &amp; VDRL Verification</strong>
   <small>GEQ-001…033 / PEQ-B1 / PEQ-B2 · {proof.totals.sourceRows} VDRL source rows</small></summary>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={proof.moduleId}/>
   {" "}Source: <a href={proof.sourceUrl} target="_blank" rel="noreferrer">{proof.sourceRevision}</a>.
   ตรวจสอบสมการจริงใน Common Kernel; เมื่อไม่มี UMH, Revision Cycles, Cost Rate ระบบคืนค่า OPEN_INPUT ไม่สร้างราคาสมมติ.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>02 Source / Driver</th><th>ตรวจสอบได้แล้ว</th><th>ยังต้องพิสูจน์ก่อนรับรอง MH/Cost</th></tr></thead>
   <tbody>
    <tr><td>GEQ-001/004/026 · VDRL</td><td>143 source rows · 38 title types · {proof.totals.sourceDocumentKeys} MR+Document keys</td>
     <td>Unique issued document copies, work-object/Tag/Facility breakdown, reporting duration</td></tr>
    <tr><td>Approval status</td><td>A {proof.totals.approvalA} · I {proof.totals.informationI} · Blank {proof.totals.blankApproval}</td>
     <td>Approval/Information blanks remain OPEN; do not assume I=no effort</td></tr>
    <tr><td>GEQ-005 · PEQ-B1-003</td><td>27 WBS engineering activities · Baseline {proof.b1BaselineMH} MH · Working SELL THB 510,000</td>
     <td>Role Work Object Q, calibrated Unit MH, OEM/ADDVALUE Work Mode, Complexity factors</td></tr>
    <tr><td>GEQ-009/024 · PEQ-B2-001…014</td><td>B2 Working SELL THB 580,000</td>
     <td>Issue/revision cycle count, DC/technical ownership, actual B2 MH, current loaded rate</td></tr>
    <tr><td>PTTEP STD003 / STD004</td><td>COMPANY review 10 working days; Contractor re-submit 15 calendar days (subject to contract precedence)</td>
     <td>Calendar review period is not billable person-hours; no fixed number of revisions in standard</td></tr>
    <tr><td>Management sensitivity (NON-POSTING)</td><td>Temporary B2 planning THB 200,000, separately recorded</td>
     <td>NOT a derived or approved customer price; original B1/B2 Working SELL unchanged</td></tr>
   </tbody>
  </table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Validation Rule</th><th>Status</th><th>Meaning</th></tr></thead>
    <tbody>{proof.validation.map(x=><tr key={x.id}><td>{x.id} · {x.title}</td>
     <td><strong>{x.status}</strong></td><td>{x.detail}</td></tr>)}</tbody>
  </table></div>
  {b2&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>MR</th><th>Source Rows</th><th>Approval A</th><th>Info I</th><th>Blank A/I</th></tr></thead>
   <tbody>{Object.values(proof.byMr).map(x=><tr key={x.mr}><td>{x.mr}</td>
    <td>{x.sourceRows}</td><td>{x.A}</td><td>{x.I}</td><td>{x.blank}</td></tr>)}</tbody>
  </table></div>}
  <button type="button" className="p55-row-toggle" onClick={()=>setShowRows(v=>!v)}>
   {showRows?"−":"＋"} {b1?"B1 27 Role-MH lines":"B1"} {b1&&b2?" + ":""} {b2?"B2 143 source VDRL rows":""} / Kernel Proof (read-only)
  </button>
  {showRows&&b1&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>WBS Task / B1</th><th>Baseline Role MH</th><th>GEQ/PEQ independently calculated</th><th>Required inputs</th></tr></thead>
   <tbody>{proof.b1Activities.map(x=><tr key={x.id}>
    <td>{x.id} · {x.group}<small>{x.name}</small></td>
    <td>{x.baselineMH} MH</td><td>{x.calculatedMH===null?"OPEN_INPUT":x.calculatedMH}</td>
    <td>{x.missingInputs.join(", ")}</td></tr>)}</tbody>
  </table></div>}
  {showRows&&b2&&<div className="p55-table-wrap" style={{maxHeight:440,overflowY:"auto"}}><table className="p55-table p55-table--compact">
   <thead><tr><th>VDRL Source / Document No.</th><th>A/I / Trigger</th><th>Cost Owner / Occurrence</th><th>GEQ-009/024 MH</th></tr></thead>
   <tbody>{proof.records.map(x=><tr key={x.id}>
    <td>{x.id} · {x.mr}<small>{x.sourceItem} · {x.title}</small>
     <small>{x.projectDocumentNo}</small></td>
    <td>{x.approvalClass||"SOURCE BLANK"}<small>{x.submissionTrigger}</small></td>
    <td>B2 Document Lifecycle<small>Technical: {x.technicalWorkOwner}</small>
     <small>{x.occurrenceRule}</small></td>
    <td>{x.documentationEquationProof.status}<small>Revision cycles / UMH: OPEN</small></td></tr>)}</tbody>
  </table></div>}
  <p className="p55-note"><strong>B3 HANDOFF:</strong> Test execution and signed test evidence remain B3/OEM work;
   document submission/control B2 only. Proceed to FAT/SAT/ITP and offshore MH without importing these unresolved document MH as B3 costs.</p>
 </details>;
}
