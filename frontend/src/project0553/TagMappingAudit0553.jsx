import React,{useMemo} from "react";
import {auditZWP20RadioVendorMapping0553} from "./data/controlledTagMappingPilot0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {ControlledModuleSection0553} from "./ControlledModuleSection0553";
import {summarizeZWP20TagCostComparison0553} from "./data/zwp20TagCostComparison0553";
const money=n=>Number.isFinite(n)?"USD "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NO SOURCE RATE";
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const state=(s)=>s==="ERROR"?"ERROR — CHECK REQUIRED":s==="QUALIFIED"?"QUALIFIED (NOT TECHNICAL PASS)":s==="PASS"?"PASS — EVIDENCE TRACE":"SKIPPED";
export function TagMappingAudit0553(){
 const result=useMemo(()=>{
  try{return auditZWP20RadioVendorMapping0553();}
  catch(error){
   return {status:"MAPPING_RUNTIME_ERROR",budgetaryProceed:false,technicalCompliancePassed:false,
    releaseAllowed:false,equations:[],stages:[],details:[],technical:[],ownerReconciliation:[],requirements:null,
    errors:[{equationId:"RUNTIME",message:String(error?.message||error)}]};
  }
 },[]);
 const comparison=useMemo(()=>summarizeZWP20TagCostComparison0553(result),[result]);
 const root="bid.budget.bom.zwp20.mr-502-001.4.mapping-audit";
 return <ControlledModuleSection0553 moduleKey={root} title="Controlled TAG → Vendor Mapping / สมการตรวจสอบทีละขั้น" defaultOpen className="p553-tag-mapping-audit">
  <p><strong>{result.status}</strong> · Internal Budgetary Proceed: {result.budgetaryProceed?"YES — QUALIFIED":"NO — MAPPING ERROR"}
   {" · Customer Release: NO"}</p>
  <p className="p55-note">This is a READ-ONLY independent verification against the existing 07 Vendor source and 10 Budgetary Ledger.
   No vendor approval, quantity, price or cost may be changed by this panel.</p>
  <ControlledModuleSection0553 moduleKey={root+".cost-scope-comparison"} title="Cost scope reconciliation / เหตุใด ODU USD 7,288.65 ไม่เท่ากับ 9 Vendor Lines" defaultOpen>
   <p className="p55-note"><strong>MR-502-001.4 = B-1 ถึง B-5 เท่านั้น.</strong> B-6/B-7 = IDU interface, B-8 = surge, B-12 = antenna. The 9 quote lines represent FOUR different cost owners and must NOT all be added to MR-502-001.4.</p>
   <p><strong>ODU (5 lines): USD {fmt(comparison.selectedTagUSD)}</strong> · Other 3 TAGs: USD {fmt(comparison.otherTagsUSD)} · <strong>All 9 single-site working lines: USD {fmt(comparison.all9USD)}</strong></p>
   <p className="p55-note">Original supplier quote-wide priced subtotals for these 9 lines: USD {fmt(comparison.sourceWidePricedUSD)} based on ORIGINAL offered quantities, NOT the ZWP20 budget quantity. Vendor unpriced lines: {comparison.vendorUnpriced.join(", ")||"None"}. Do not compare quote-wide amounts directly with one TAG cost.</p>
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact p553-audit-owner-table">
    <thead><tr><th>Physical TAG / Cost Owner</th><th>Vendor Quote Lines</th><th>Budgetary Site Cost USD</th><th>Existing Frozen Ledger USD</th><th>Delta USD</th><th>Audit / Price Qualification</th></tr></thead>
    <tbody>{comparison.owners.map(g=><tr key={g.ownerId}>
     <td><strong>{g.ownerId}</strong><ComponentCopyId projectId="PJ2608-0553" componentKey={root+".cost-scope-comparison."+g.ownerId.toLowerCase().replace(/[^a-z0-9-]/g,"-")} componentName={g.ownerId+" cost comparison"}/></td>
     <td>{g.quoteCodes.join(" + ")}</td><td>USD {fmt(g.computedUSD)}</td><td>USD {fmt(g.ledgerUSD)}</td>
     <td>{Number.isFinite(g.differenceUSD)?"USD "+fmt(g.differenceUSD):"NOT VERIFIED"}</td>
     <td>{g.reconciled?"MATCH — WORKING ONLY":"REVIEW / NOT VERIFIED"}{g.sourceMissing.length>0&&<small>Missing Vendor Price: {g.sourceMissing.join(", ")} (management incremental USD 0 only)</small>}</td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note"><strong>{comparison.reconciled?"WORKING ALLOCATION RECONCILED":"COST MAPPING NOT VERIFIED"}.</strong> {comparison.note} Even when four ledger owners reconcile, original B-4 country entitlement, RF/OEM approvals, excluded scope and customer release remain unresolved.</p>
  </ControlledModuleSection0553>
  <ControlledModuleSection0553 moduleKey={root+".stages"} title="MAP-01 ถึง MAP-10 · Mapping sequence / verification results" defaultOpen>
  <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact p553-audit-stages-table">
   <thead><tr><th>Sequence / Equation</th><th>Result</th><th>Required Evidence / Recorded Calculation</th></tr></thead>
   <tbody>{result.stages.map(x=><tr key={x.id}><td><strong>{x.id}</strong><small>{x.name}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={root+".stage."+x.id.toLowerCase()} componentName={x.name}/></td>
    <td><strong>{state(x.status)}</strong></td><td>{x.details}</td></tr>)}</tbody>
  </table></div>
  </ControlledModuleSection0553>
  <ControlledModuleSection0553 moduleKey={root+".equations"} title="Controlled Equation Register / สมการ MAP-01 ถึง MAP-10">
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact p553-audit-equations-table">
    <thead><tr><th>Equation / Copy ID</th><th>Derivation Rule</th><th>Purpose / Failure Gate</th></tr></thead>
    <tbody>{result.equations.map(eq=><tr key={eq.id}>
     <td><strong>{eq.id} · {eq.name}</strong>
      <ComponentCopyId projectId="PJ2608-0553" componentKey={root+".equation."+eq.id.toLowerCase()} componentName={eq.name}/></td>
     <td><code>{eq.expression}</code></td>
     <td>{eq.purpose}<small>{eq.failState}</small></td>
    </tr>)}</tbody></table></div>
  </ControlledModuleSection0553>
  {result.requirements&&<p className="p55-note"><strong>Source Requirements:</strong>
   {" Direct "+result.requirements.direct.join(", ")}
   {" · Site "+result.requirements.site.join(", ")}
   {" · Common "+result.requirements.common}
   {" · Conflicts "+result.requirements.conflicts.join(", ")}
  </p>}
  {result.errors.length>0&&<p role="alert" className="p55-note"><strong>MAPPING ERROR — source cost NOT safe to promote:</strong>{" "}
   {result.errors.map(x=>x.equationId+": "+x.message).join("; ")}</p>}
  {result.details.length>0&&<ControlledModuleSection0553 moduleKey={root+".vendor-quote-lines"} title={"Original 07 Vendor Quote Lines → Required Function → Cost Owner ("+result.details.length+")"}>
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact p553-audit-vendor-table">
    <thead><tr><th>Quote Line / Source</th><th>SKU / Function</th><th>Qty: Engineering / Vendor</th><th>Source Unit / Original Quote Extended</th><th>ZWP20 Working Extended USD</th><th>Allocated TAG / Status</th></tr></thead>
    <tbody>{result.details.map(r=><tr key={r.quoteLine}>
     <td><strong>{r.quoteLine}</strong><small>{r.catalogRelationshipId}</small><small>Quote p.{r.sourcePage||"not indexed"}</small><small>{r.sourceMatch?"SOURCE JOIN PASS":"SOURCE JOIN ERROR"}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={root+".vendor-quote-lines."+r.quoteLine.toLowerCase()} componentName={r.quoteLine+" / "+r.partNumber}/></td>
     <td>{r.partNumber}<small>{r.functionId}</small></td>
     <td>Engineering: {r.engineeringQty??"SEPARATE TAG"}<small>Original vendor: {r.sourceQuoteQty??"NOT RECORDED"}</small></td>
     <td>{money(r.sourceUnitPriceUSD)}<small>Original quote line total: {money(r.sourceQuotedLineTotalUSD)}</small><small>{r.managementZeroAssumption?"Management incremental assumption USD 0; original supplier rate NULL":"Original quote unit price unchanged"}</small></td>
     <td>{money(comparison.owners.flatMap(g=>g.lines).find(x=>x.code===r.quoteLine)?.siteExtendedUSD)}<small>Engineering Qty × working rate; one assigned cost owner</small></td>
     <td><strong>{r.costOwner}</strong><small>{r.mappingStatus}</small></td>
    </tr>)}</tbody>
   </table></div>
  </ControlledModuleSection0553>}
  {result.technical?.length>0&&<ControlledModuleSection0553 moduleKey={root+".technical-constraints"} title={"Technical Hard Constraints & Proof / เงื่อนไขวิศวกรรม ("+result.technical.length+")"}>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Constraint</th><th>Engineering Status</th><th>Evidence / Required Proof</th></tr></thead>
    <tbody>{result.technical.map(t=><tr key={t.id}><td>{t.id}<ComponentCopyId projectId="PJ2608-0553" componentKey={root+".technical-constraints."+t.id.toLowerCase()} componentName={t.id}/></td><td>{t.result}</td><td>{t.evidence}</td></tr>)}</tbody>
   </table></div>
  </ControlledModuleSection0553>}
  {result.ownerReconciliation?.length>0&&<ControlledModuleSection0553 moduleKey={root+".cost-owner-reconciliation"} title="MAP-09 · Cost Owner Reconciliation with Frozen Ledger">
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Owner (TAG / Row)</th><th>Audit Mapping USD</th><th>Existing Ledger USD</th><th>Difference USD</th><th>Result</th></tr></thead>
    <tbody>{result.ownerReconciliation.map(x=><tr key={x.id}>
     <td>{x.id}<ComponentCopyId projectId="PJ2608-0553" componentKey={root+".cost-owner-reconciliation."+x.id.toLowerCase().replace(/[^a-z0-9-]/g,"-")} componentName={x.id}/></td><td>{fmt(x.mappedUSD)}</td><td>{fmt(x.ledgerUSD)}</td>
     <td>{fmt(x.deltaUSD)}</td><td>{x.pass?"PASS":"ERROR / REVIEW"}</td>
    </tr>)}</tbody>
   </table></div>
  </ControlledModuleSection0553>}
  <p className="p55-note"><strong>Release Gate:</strong> {result.technicalCompliancePassed?"TECHNICAL VERIFIED":"Technical approval NOT established"}.
   Region 04 Myanmar entitlement, OEM radio, capacity/NMS, Ex certificates, RF CAL and site interface must be documented. Qualified working cost is not a customer price.</p>
 </ControlledModuleSection0553>;
}
