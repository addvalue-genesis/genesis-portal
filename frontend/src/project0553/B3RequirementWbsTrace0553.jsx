import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB3RequirementWbsTrace0553} from "./data/b3RequirementWbsTrace0553";

export function B3RequirementWbsTrace0553({selectedOwner="B3",navigationTarget=null}){
 const model=selectB3RequirementWbsTrace0553();
 const owner=selectedOwner==="B9"?"B9":"B3";
 const selectedRow=model.rows.find(r=>r.moduleId===navigationTarget);
 const needsOtherOwner=Boolean(selectedRow&&selectedRow.costOwner!==owner);
 const [showOthers,setShowOthers]=useState(needsOtherOwner);
 React.useEffect(()=>{if(needsOtherOwner)setShowOthers(true);},[needsOtherOwner,navigationTarget]);
 const primary=owner==="B9"?model.B9:model.B3;
 const others=model.rows.filter(r=>r.costOwner!==owner);
 const render=(rows)=><div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1440,width:"100%",tableLayout:"fixed",fontSize:12}}>
  <colgroup><col style={{width:"11%"}}/><col style={{width:"12%"}}/><col style={{width:"19%"}}/><col style={{width:"16%"}}/><col style={{width:"11%"}}/><col style={{width:"15%"}}/><col style={{width:"16%"}}/></colgroup>
  <thead><tr><th>Module ID / Requirements</th><th>WBS / MR / Owner</th><th>BOD / SPE / DTS: Required result</th><th>Rev.K: Work to execute</th><th>Who / Where</th><th>Evidence / Acceptance</th><th>Source / Gate</th></tr></thead>
  <tbody>{rows.map(r=><tr key={r.id} data-component-key={r.moduleId} style={{verticalAlign:"top",overflowWrap:"anywhere",whiteSpace:"normal"}}>
   <td><strong>{r.id}</strong><small>{r.moduleId}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={r.moduleId}/></td>
   <td><strong>{r.wbs} · {r.system}</strong><small>Candidate Cost Owner: {r.costOwner}</small><small>{r.contractualRequirementState}</small><small>{r.addvalueAttendanceState}</small><small>{r.b9CommercialTreatment||r.status}</small></td>
   <td><strong>{r.requiredResult}</strong></td>
   <td>{r.activity}<small>Cost boundary: {r.costRule}</small></td>
   <td>{r.responsibility}<small>{r.location}</small></td>
   <td>{r.deliverable}</td>
   <td><strong>{r.requirementRef}</strong><small>{r.gate}</small><small>{r.sourceKeys.map((key,i)=><React.Fragment key={key}>{i>0?" · ":""}<a href={model.sourceURLs[key]} target="_blank" rel="noreferrer">{key}</a></React.Fragment>)}</small></td>
  </tr>)}</tbody></table></div>;
 return <section className="p55-panel" data-component-key={"bid.budget.working.bc."+owner.toLowerCase()+".requirement-crosswalk"} style={{padding:12,marginTop:12}}>
  <h4>{owner} — Contract Requirements × Rev.K Work Breakdown (BOD + SPE + DTS + MR)</h4>
  <p className="p55-note"><strong>Module ID:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.working.bc."+owner.toLowerCase()+".requirement-crosswalk"}/> · <strong>Trace source:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={model.moduleId}/> · 19 obligations are non-priced and must not be summed into Working Sell.</p>
  <p className="p55-note"><strong>Reading rule:</strong> BOD states system/function/acceptance basis; DTS gives equipment parameters; SPE and MR prescribe tests, certificates, approval and support; Rev.K gives actionable activities/locations. A valid budget line is then one unique Activity + Resource + Cost Owner. This crosswalk is contractual technical coverage, NOT a price ledger and will not add to any Working Sell.</p>
  <div className="p55-metric-grid">
   <div><strong>{owner} source-linked activities</strong><p>{primary.length}</p><small>Contractual activities and owner gates shown</small></div>
   <div><strong>Linked obligations total</strong><p>{model.rows.length}</p><small>Across B3 / B9 / other owners; counts ≠ billable labor</small></div>
   <div><strong>Cost posting</strong><p>BLOCKED</p><small>Owner &amp; test method approvals required</small></div>
  </div>
  {render(primary)}
  <button type="button" className="p553-detail-button" aria-expanded={showOthers} onClick={()=>setShowOthers(v=>!v)}>{showOthers?"− Hide":"+ Review"} Cross-owner obligations (read-only; non-additive, {others.length})</button>
  {showOthers&&render(others)}
  <p className="p55-note"><strong>Mandatory deliverable is not mandatory ADDVALUE attendance:</strong> Yard SAT under SPE §7.3.2 remains required, but JUTAL/MGW/ADDVALUE execution and witness assignment must follow contractual RACI. SPE §7.3.4 requests onshore/offshore site-support man-day rates; it does not establish unconditional 12 ADDVALUE Yard team-days. B9 cost posting for Yard support is CONDITIONAL on call-out or signed scope.</p>
  <p className="p55-note"><strong>Contract gates:</strong> SPE §7.3.2 explicitly requires Fabrication Yard SAT; SPE §7.3.3 requires offshore commissioning/final performance; SPE §7.3.4 requests onshore/offshore support man-day rates. BOD §10.2 requests 30-day FAT notice versus SPE §7.3 14-day; resolve controlling requirement before scheduling. The SPE's post-Yard SAT transfer of some devices to ZPQ and old TETRA gateway wording must be clarified against current DMR/RFI Rev.K before budgeting or execution.</p>
 </section>;
}
