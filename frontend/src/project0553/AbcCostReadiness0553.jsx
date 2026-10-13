import React,{useMemo} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {ControlledModuleSection0553} from "./ControlledModuleSection0553";
import {deriveAbcWorkingReadiness0553} from "./data/abcWorkingReadiness0553";

const fmt=x=>Number.isFinite(x)?x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const thb=x=>Number.isFinite(x)?"THB "+fmt(x):"NOT ESTABLISHED";
export function AbcCostReadiness0553({site="ALL",fx=null,priceEvidence=null,snapshot=null}){
 const model=useMemo(()=>snapshot||deriveAbcWorkingReadiness0553({site,thbPerUsd:fx?.thbPerUsd??null}),[snapshot,site,fx?.thbPerUsd]);
 const root="bid.budget.bom.system-location-mto.abc-readiness";
 const A=model.A,B=model.B,C=model.C,ABC=model.ABC;
 return <ControlledModuleSection0553 moduleKey={root} title={"A / B / C — Cost Readiness & Next Actions · "+(site==="ALL"?"MR0001 All Locations":site)} defaultOpen className="p553-abc-readiness"
  description="Source-backed working cost and B/C WBS sell evidence are different bases; final A+B+C is not yet established">
  <p className="p55-note"><strong>วิธีอ่าน:</strong> A = รายการอุปกรณ์/วัสดุที่บันทึก Working Cost ได้จริงจาก TAG Ledger; B = งานบริการและ WBS ที่ต้องหาต้นทุนภายใน; C = Spare Options ที่ต้องมี OEM Qty/Rate. <strong>37/55 เป็นหลักฐานราคา ไม่ใช่จำนวนผ่าน Engineering Approval.</strong></p>
  {priceEvidence&&<p className="p55-note">Price evidence: {priceEvidence.covered}/{priceEvidence.total} visible MTO TAGs have candidate rate evidence; {priceEvidence.total-priceEvidence.covered} do not yet have matched price evidence.{priceEvidence.filtered?" Vendor filter is active; cost roll-up always uses the full canonical ledger, not filtered visible rows.":""} Price evidence, posted working cost and technical approval are three independent controls.</p>}
  <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
   <thead><tr><th>Part / Basis</th><th>Current Source-Backed Cost</th><th>Coverage / Status</th><th>Next Engineering / Commercial Action</th></tr></thead><tbody>
    <tr><td><strong>A — Equipment / Attributable Bulk</strong><small>MR-0001 selected Location(s), internal working cost</small></td>
     <td><strong>{Number.isFinite(A.knownWorkingTHB)?thb(A.knownWorkingTHB):"USD "+fmt(A.originalUSD)+" + THB "+fmt(A.originalTHB)}</strong><small>Original USD {fmt(A.originalUSD)} + THB {fmt(A.originalTHB)}. {model.fx.thbPerUsd?"THB display via working FX "+model.fx.thbPerUsd+" (source unverified)":"FX required to convert USD portion"}.</small></td>
     <td>{A.postedRows}/{A.totalRows} TAGs carry an allocated working amount · {A.unpostedRows} unresolved<small>{A.allocatedTagCoverageComplete?"All current TAG rows costed; Part A still requires OEM/project-wide approval":"PARTIAL — not full Part A price"}</small></td>
     <td>{A.action}</td></tr>
    <tr><td><strong>B — Services / Other B1–B14</strong><small>Cost basis (NOT sell)</small></td>
     <td><strong>{thb(B.costTHB)}</strong><small>Project-wide WBS Rev05 working SELL (separate basis): {thb(B.workingSellTHB)}</small></td>
     <td>{B.workingSellCount}/{B.totalRows} B-lines have a working sell reference · {B.unpricedSellRows} not priced even on sell basis<small>No approved project-wide B internal cost ledger posted</small></td>
     <td>{B.action}</td></tr>
    <tr><td><strong>C — C1/C2 Spare Options</strong><small>Optional scope: not equipment installation</small></td>
     <td><strong>{thb(C.costTHB)}</strong><small>Current C Working Sell: {thb(C.workingSellTHB)}</small></td>
     <td>{C.unpricedSellRows}/{C.totalRows} optional spare lines require source-priced schedules</td>
     <td>{C.action}</td></tr>
    <tr><td><strong>A+B+C — Full Project Cost</strong></td>
     <td><strong>{thb(ABC.completeCostTHB)}</strong><small>Visible allocated portion from MR0001 A ONLY: {thb(ABC.knownAOnlyWorkingTHB)}; do not relabel this as full A+B+C</small></td>
     <td><strong>INCOMPLETE — NOT FOR CUSTOMER RELEASE</strong><small>Missing B cost, C cost, remaining A and other MR allocations</small></td>
     <td>Reconcile cost ownership once per function, close RFQ/WBS and FX requirements, then compute actual A+B+C</td></tr>
   </tbody></table></div>
  <p className="p55-note"><strong>Important:</strong> The B1/B2/B3/B8/B9 working sell values cannot be added to Part A vendor cost: cost ≠ selling price. The current 31.5 FX setting may be an INTERNAL PLANNING ASSUMPTION, not a verified BOT rate. Null values mean unknown, never zero.</p>
  {priceEvidence?.uncovered?.length>0&&<ControlledModuleSection0553 moduleKey={root+".price-evidence-gaps"} title={"Price Evidence Gaps ("+priceEvidence.uncovered.length+" MTO TAGs)"} >
   <p className="p55-note"><strong>หลักการ:</strong> These are the TAGs without a currently matched Vendor Rate Evidence under the visible filter. A TAG may still have an internal budgetary cost posted from a separate controlled source; price-evidence coverage is NOT the same as Engineering or Cost approval.</p>
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
    <thead><tr><th>Location / TAG / Module ID</th><th>MTO Scope Qty</th><th>Budgetary Working Allocation</th><th>Next Source / Engineering Action</th></tr></thead><tbody>
    {priceEvidence.uncovered.map((g,i)=><tr key={g.site+"|"+g.row+"|"+g.tag+"|"+i}><td><strong>{g.site} / {g.tag}</strong><small>MTO Row {g.row}</small>
     <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+g.site.toLowerCase()+"."+String(g.tag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+g.row} componentName={g.tag+" / "+g.site+" MTO Row "+g.row}/></td>
     <td>{g.scopeQty??"NOT VERIFIED"} {g.scopeUnit||""}</td>
     <td>{g.workingCostAllocated?"Working amount exists — RATE EVIDENCE MATCH REVIEW":"No allocated TAG working cost"}<small>{g.workingState}</small></td>
     <td>Map original RFQ function → approved physical Quantity → compatible SKU → supplier quotation/currency/validity → unique TAG cost owner</td>
    </tr>)}
    </tbody></table></div>
  </ControlledModuleSection0553>}
  <ControlledModuleSection0553 moduleKey={root+".part-a-gaps"} title={"A · Location / TAG Cost Gaps ("+A.unpostedRows+" unresolved)"} >
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
    <thead><tr><th>Location</th><th>Allocated Working Cost in Source Currency</th><th>Costed / MTO</th><th>Unpriced / Unallocated TAGs</th></tr></thead><tbody>
    {model.locations.map(l=><tr key={l.site}><td><strong>{l.site}</strong><ComponentCopyId projectId="PJ2608-0553" componentKey={root+".part-a-gaps."+l.site.toLowerCase()} componentName={l.site+" cost gap"}/></td>
     <td>USD {fmt(l.originalUSD)} + THB {fmt(l.originalTHB)}</td><td>{l.postedCount}/{l.sourceCount}</td>
     <td>{l.unresolved.length?l.unresolved.map(x=>x.tag+" (row "+x.row+"): "+x.status).join("; "):"No unallocated TAG in working ledger — Engineering approval still required"}</td>
    </tr>)}
   </tbody></table></div>
  </ControlledModuleSection0553>
  <ControlledModuleSection0553 moduleKey={root+".part-b-wbs"} title={"B · WBS Rev05: current Working SELL / Cost Gaps ("+B.sourceWbsRows.length+" lines)"}>
   <p className="p55-note">Source: <a href={model.bWbsSourceUrl} target="_blank" rel="noreferrer">{model.bWbsSource}</a>. These are project-wide working SELL lines; do not allocate to a WP or treat as internal cost without evidence. The Lifecycle B4/B5/C2 display uses a separate working scope crosswalk and must not silently override these RFQ/customer WBS line names.</p>
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
    <thead><tr><th>WBS / Module ID</th><th>Working Sell THB</th><th>Responsible Owner / Quantity Driver</th><th>Cost / Source Status</th></tr></thead><tbody>
    {B.sourceWbsRows.map(x=><tr key={x.code}>
     <td><strong>{x.code}</strong><ComponentCopyId projectId="PJ2608-0553" componentKey={root+".part-b-wbs."+x.code.toLowerCase()} componentName={x.code+" WBS source line"}/></td>
     <td>{thb(x.sellTHB)}</td><td>{x.owner}<small>{x.driver}</small></td>
     <td><strong>INTERNAL COST NOT MAPPED</strong><small>{x.state}; quote/sell is not cost</small></td>
    </tr>)}
   </tbody></table></div>
  </ControlledModuleSection0553>
  <ControlledModuleSection0553 moduleKey={root+".part-c-spares"} title="C · Capital / Operational Spares — Pending OEM Evidence">
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
    <thead><tr><th>Part / Module ID</th><th>Current Working Sell</th><th>Required Cost Driver</th><th>Gate</th></tr></thead><tbody>
    {C.sourceWbsRows.map(x=><tr key={x.code}><td><strong>{x.code}</strong><ComponentCopyId projectId="PJ2608-0553" componentKey={root+".part-c-spares."+x.code.toLowerCase()} componentName={x.code+" spare schedule"}/></td><td>{thb(x.sellTHB)}</td><td>{x.driver}</td><td>{x.state}<small>{x.owner}</small></td></tr>)}
   </tbody></table></div>
  </ControlledModuleSection0553>
 </ControlledModuleSection0553>;
}
