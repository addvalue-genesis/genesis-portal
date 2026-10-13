import React,{useMemo} from "react";
import {auditZWP20RadioVendorMapping0553} from "./data/controlledTagMappingPilot0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
const money=n=>Number.isFinite(n)?"USD "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NO SOURCE RATE";
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const state=(s)=>s==="ERROR"?"ERROR — CHECK REQUIRED":s==="QUALIFIED"?"QUALIFIED (NOT TECHNICAL PASS)":s==="PASS"?"PASS — EVIDENCE TRACE":"SKIPPED";
export function TagMappingAudit0553(){
 const result=useMemo(()=>auditZWP20RadioVendorMapping0553(),[]);
 const root="bid.budget.bom.zwp20.mr-502-001.4.mapping-audit";
 return <section className="p55-panel" style={{padding:14,marginTop:12}} data-component-key={root}>
  <h4>Controlled TAG → Vendor Mapping / สมการตรวจสอบทีละขั้น</h4>
  <ComponentCopyId projectId="PJ2608-0553" componentKey={root} componentName="ZWP20 MR-502-001 Row 4 — Mapping Audit"/>
  <p><strong>{result.status}</strong> · Internal Budgetary Proceed: {result.budgetaryProceed?"YES — QUALIFIED":"NO — MAPPING ERROR"}
   {" · Customer Release: NO"}</p>
  <p className="p55-note">This is a READ-ONLY independent verification against the existing 07 Vendor source and 10 Budgetary Ledger.
   No vendor approval, quantity, price or cost may be changed by this panel.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Sequence / Equation</th><th>Result</th><th>Required Evidence / Recorded Calculation</th></tr></thead>
   <tbody>{result.stages.map(x=><tr key={x.id}><td><strong>{x.id}</strong><small>{x.name}</small></td>
    <td><strong>{state(x.status)}</strong></td><td>{x.details}</td></tr>)}</tbody>
  </table></div>
  <details className="p55-panel" style={{padding:10}}>
   <summary style={{cursor:"pointer",fontWeight:700}}>Controlled Equation Register / สมการ MAP-01 ถึง MAP-10</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Equation / Copy ID</th><th>Derivation Rule</th><th>Purpose / Failure Gate</th></tr></thead>
    <tbody>{result.equations.map(eq=><tr key={eq.id}>
     <td><strong>{eq.id} · {eq.name}</strong>
      <ComponentCopyId projectId="PJ2608-0553" componentKey={root+".equation."+eq.id.toLowerCase()} componentName={eq.name}/></td>
     <td><code>{eq.expression}</code></td>
     <td>{eq.purpose}<small>{eq.failState}</small></td>
    </tr>)}</tbody></table></div>
  </details>
  {result.requirements&&<p className="p55-note"><strong>Source Requirements:</strong>
   {" Direct "+result.requirements.direct.join(", ")}
   {" · Site "+result.requirements.site.join(", ")}
   {" · Common "+result.requirements.common}
   {" · Conflicts "+result.requirements.conflicts.join(", ")}
  </p>}
  {result.errors.length>0&&<p role="alert" className="p55-note"><strong>MAPPING ERROR — source cost NOT safe to promote:</strong>{" "}
   {result.errors.map(x=>x.equationId+": "+x.message).join("; ")}</p>}
  {result.details.length>0&&<details className="p55-panel" style={{padding:10}}>
   <summary style={{cursor:"pointer",fontWeight:700}}>Original 07 Vendor Quote Lines → Required Function → Cost Owner ({result.details.length})</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Quote Line / Source</th><th>SKU / Function</th><th>Qty: RFQ / Vendor</th><th>Source Rate / Working Scenario</th><th>Allocated TAG / Status</th></tr></thead>
    <tbody>{result.details.map(r=><tr key={r.quoteLine}>
     <td><strong>{r.quoteLine}</strong><small>{r.catalogRelationshipId}</small><small>Quote p.{r.sourcePage||"not indexed"}</small><small>{r.sourceMatch?"SOURCE JOIN PASS":"SOURCE JOIN ERROR"}</small></td>
     <td>{r.partNumber}<small>{r.functionId}</small></td>
     <td>Engineering: {r.engineeringQty??"SEPARATE TAG"}<small>Original vendor: {r.sourceQuoteQty??"NOT RECORDED"}</small></td>
     <td>{money(r.sourceUnitPriceUSD)}<small>{r.managementZeroAssumption?"Management incremental assumption USD 0; original supplier rate NULL":"Working: "+money(r.mappingRateUSD)}</small></td>
     <td><strong>{r.costOwner}</strong><small>{r.mappingStatus}</small></td>
    </tr>)}</tbody>
   </table></div>
  </details>}
  {result.technical?.length>0&&<details className="p55-panel" style={{padding:10}}>
   <summary style={{cursor:"pointer",fontWeight:700}}>Technical Hard Constraints &amp; Proof / เงื่อนไขวิศวกรรม ({result.technical.length})</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Constraint</th><th>Engineering Status</th><th>Evidence / Required Proof</th></tr></thead>
    <tbody>{result.technical.map(t=><tr key={t.id}><td>{t.id}</td><td>{t.result}</td><td>{t.evidence}</td></tr>)}</tbody>
   </table></div>
  </details>}
  {result.ownerReconciliation?.length>0&&<details className="p55-panel" style={{padding:10}}>
   <summary style={{cursor:"pointer",fontWeight:700}}>MAP-09 · Cost Owner Reconciliation with Frozen Ledger</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Owner (TAG / Row)</th><th>Audit Mapping USD</th><th>Existing Ledger USD</th><th>Difference USD</th><th>Result</th></tr></thead>
    <tbody>{result.ownerReconciliation.map(x=><tr key={x.id}>
     <td>{x.id}</td><td>{fmt(x.mappedUSD)}</td><td>{fmt(x.ledgerUSD)}</td>
     <td>{fmt(x.deltaUSD)}</td><td>{x.pass?"PASS":"ERROR / REVIEW"}</td>
    </tr>)}</tbody>
   </table></div>
  </details>}
  <p className="p55-note"><strong>Release Gate:</strong> {result.technicalCompliancePassed?"TECHNICAL VERIFIED":"Technical approval NOT established"}.
   Region 04 Myanmar entitlement, OEM radio, capacity/NMS, Ex certificates, RF CAL and site interface must be documented. Qualified working cost is not a customer price.</p>
 </section>;
}
