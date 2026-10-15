import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectBcB3EquationExecution0553} from "./data/bcB3EquationExecution0553";

const thb=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
export function B3EquationAudit0553({selectedCode="ALL"}){
 const proof=selectBcB3EquationExecution0553();
 const [showIrt,setShowIrt]=useState(false);
 const [showVdrl,setShowVdrl]=useState(false);
 const [showEvents,setShowEvents]=useState(false);
 const isB3=selectedCode==="B3";
 if(selectedCode!=="ALL"&&!isB3)return null;
 const c=proof.offshore.tripComposition;
 return <details className="p55-panel" data-component-key={proof.moduleId} open={isB3}
  style={{marginTop:12,padding:"12px 14px"}}>
  <summary><strong>02 → 10.2 B3 | GEQ/PEQ IRT → FAT / SAT / Offshore Proof</strong>
   <small> {proof.irtSourceCount} RFQ IRT source points · {proof.offshore.workingTripCount} WORKING trips · no cost posting</small></summary>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={proof.moduleId}/>
   {" "}Sources: MR0001–MR0004 Rev.C1 §7/§9, PTTEP ITP, WBS Rev05 (<a href={proof.sourceWbsUrl} target="_blank" rel="noreferrer">WBS source</a>).
   IRT points are inspection requirements, NOT individually priced test events or approved inspection dates.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>B3 Workload / Cost Driver</th><th>Source Working Scenario</th><th>Independent GEQ Evidence</th><th>Missing Approval / Cost Gate</th></tr></thead>
   <tbody>
    <tr><td>OEM Factory Tests (4 MR stage requirements)</td><td>OEM-controlled, locations TBC</td>
     <td>MR §§7.3/9; source IRT may contain test/witness points</td>
     <td>Included OEM scope proof; source FAT sign-off / no extra B3 cost without RACI</td></tr>
    <tr><td>SAMTEL Bangkok Integrated FAT</td><td>8 team-days · 2 roles · {thb(proof.integratedFat.workingSellTHB)}</td>
     <td>GEQ-005 gross duty {proof.integratedFat.workingGrossShiftMH} MH (Senior 64 + Engineer 64), 8h/day working convention</td>
     <td>Approved ITP, test equipment, client witness, actual payroll and venue costs</td></tr>
    <tr><td>Offshore SAT + Commissioning</td><td>{proof.offshore.workingTripCount} working trips · {proof.offshore.workingTeamDays} team-days · {proof.offshore.workingPersonDays} MD · {thb(proof.offshore.workingSellTHB)}</td>
     <td>GEQ-005 gross duty {proof.offshore.grossShiftMH} MH = 78 MD × 12h offshore convention; NOT 936 verified productive test MH</td>
     <td>Actual SAT vs COMM days, HUC/SIMOPS/POB, travel, internal staff costs</td></tr>
    <tr><td>MOB / DEMOB</td><td>{c.mob+c.demob} team-days ALREADY INCLUDED</td>
     <td>{c.mob} MOB + {c.demob} DEMOB, within {c.teamDays} total, NOT incremental</td>
     <td>Physical itineraries and reimbursable travel rates; never add 10 again</td></tr>
    <tr><td>Technical SAT/COMM / Integration / Field transfer</td><td>{c.technical} + {c.integration} + {c.transfer} team-days</td>
     <td>{c.technical+c.integration+c.transfer+c.mob+c.demob} = {c.teamDays} WORKING team-days</td>
     <td>Test-event-approved durations and field resources remain OPEN</td></tr>
    <tr><td>B3 total Working SELL (non-posting)</td><td><strong>{thb(proof.workingSellTHB)}</strong></td>
     <td>THB144,000 + THB1,965,600; SOURCE WBS reconciliation only</td>
     <td>Actual Direct COST: <strong>NOT ESTABLISHED</strong>; no B3 customer release</td></tr>
   </tbody>
  </table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Trip (WBS)</th><th>Facility / Covered MR</th><th>Composition (Team-days)</th><th>Person-Days</th><th>Gross Shift MH (GEQ-005)</th><th>Release State</th></tr></thead>
   <tbody>{proof.offshore.workingTrips.map(t=><tr key={t.id}>
    <td>{t.id}</td><td>{t.location}<small>{t.sourceMR.join(" / ")}</small></td>
    <td>Tech {t.composition.technical} · MOB {t.composition.mob} · DEMOB {t.composition.demob} · Integration {t.composition.integration} · Transfer {t.composition.transfer}</td>
    <td>{t.workingPersonDays}</td><td>{t.grossShiftMH}</td><td>HUC / Test Schedule OPEN</td>
   </tr>)}</tbody>
  </table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Source/Equation Validation</th><th>Status</th><th>Evidence or Remaining Gate</th></tr></thead>
   <tbody>{proof.validation.map(x=><tr key={x.id}><td>{x.id} — {x.label}</td>
    <td><strong>{x.status}</strong></td><td>{x.detail}</td></tr>)}</tbody>
  </table></div>
  <button className="p55-row-toggle" type="button" onClick={()=>setShowEvents(v=>!v)}>
   {showEvents?"−":"＋"} Test Stage Requirements ({proof.stageRequirementCount}; NOT separate priced visits)
  </button>
  {showEvents&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Stage Requirement / MR</th><th>Location & Owner</th><th>Approved ITP/Event Evidence</th></tr></thead>
   <tbody>{proof.stageRequirementKeys.map(x=><tr key={x.id}>
    <td>{x.id}<small>{x.sourceRevision} / {x.section}</small></td>
    <td>{x.location}<small>{x.costOwner}</small></td><td>OPEN — actual event quantity and accepted test sheets not confirmed</td>
   </tr>)}</tbody>
  </table></div>}
  <button className="p55-row-toggle" type="button" onClick={()=>setShowVdrl(v=>!v)}>
   {showVdrl?"−":"＋"} Test Documents → B2/B3 VDRL Trace ({proof.testDocumentRows.length}; NON-ADDITIVE)
  </button>
  {showVdrl&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>VDRL MR / Document Number</th><th>Document Title / Status</th><th>Cost Ownership Boundary</th></tr></thead>
   <tbody>{proof.testDocumentRows.map(x=><tr key={x.id}>
    <td>{x.id} · {x.mr}<small>{x.projectDocumentNo}</small></td>
    <td>{x.title}<small>{x.approvalClass||"SOURCE BLANK"} · {x.submissionTrigger}</small></td>
    <td>Original test operation &amp; technical results: B3/OEM; VDRL transmittal, numbering, revision control: B2. Do not count a second test event.</td>
   </tr>)}</tbody>
  </table></div>}
  <button className="p55-row-toggle" type="button" onClick={()=>setShowIrt(v=>!v)}>
   {showIrt?"−":"＋"} MR0001–4 RFQ IRT Raw Source Points ({proof.irtSourceCount}; 28/27/27/27)
  </button>
  {showIrt&&<div className="p55-table-wrap" style={{maxHeight:450,overflowY:"auto"}}>
   <table className="p55-table p55-table--compact"><thead><tr><th>IRT ID / MR §9</th><th>Source Step / Codes</th><th>Inspection Requirement</th><th>Pricing Treatment</th></tr></thead>
   <tbody>{proof.irtSourceRows.map(x=><tr key={x.id}>
    <td>{x.id}</td><td>{x.sourceItem}<small>{x.inspectionCodes}</small></td>
    <td>{x.itemDescription}</td><td>RFQ-stage / ITP approval OPEN / non-additive</td>
   </tr>)}</tbody></table>
  </div>}
  <p className="p55-note"><strong>Boundary:</strong> B1 engineering content, B2 transmittal/final dossier,
   B3 actual physical testing and original signed test sheets, B9 Nantong yard supervision.
   If a vendor's OEM test is included in Part A, avoid charging it again under B3.
   No default payroll, extra travel, offshore standby or additional test-event price has been created.</p>
 </details>;
}
