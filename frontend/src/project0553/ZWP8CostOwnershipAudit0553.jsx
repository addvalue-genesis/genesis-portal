import React,{useMemo} from "react";
import {ControlledModuleSection0553} from "./ControlledModuleSection0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {auditZWP8CostOwnership0553} from "./data/zwp8CostOwnershipAudit0553";
import {getZWP8RadioOwnershipComparison0553} from "./data/mr0001Zwp8RadioOwnerEvidence0553";
import {selectMR0001Rev03TagCostRows0553} from "./data/mr0001Rev03CostOverlay0553";
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
export function ZWP8CostOwnershipAudit0553({fx=null}){
 const audit=useMemo(()=>auditZWP8CostOwnership0553({thbPerUsd:fx?.thbPerUsd??null}),[fx?.thbPerUsd]);
 const proof=useMemo(()=>getZWP8RadioOwnershipComparison0553(selectMR0001Rev03TagCostRows0553("ZWP8")),[]);
 const id="bid.budget.bom.zwp8.cost-ownership-audit";
 return <ControlledModuleSection0553 moduleKey={id}
  title="ZWP8 · Cost Ownership Reconciliation — AFC role split / Brownfield"
  description="THB is the primary budget currency; source USD retained for vendor evidence. Working FX is not a verified BOT rate.">
  <p className="p55-note"><strong>PTP ZPQ ↔ ZWP8 = EXISTING baseline link (BLD C1).</strong> BOD C2 §7.2 separately requests added capacity/new link; this must NOT convert the existing link into a second NEW radio procurement without scope/endpoint proof.</p>
  <p className="p55-note"><strong>Finding: {audit.flags.uniqueCostOwnerPassed?"SOURCE OWNERS RECONCILED":"SOURCE OWNERSHIP REVIEW REQUIRED"}.</strong> ZWP8 new PTMP and added PTP are kept separate from the existing PTP baseline; vendor technical acceptance is pending. MTO row43 has {audit.physicalGroup.radioODU} ODU, {audit.physicalGroup.radioIDU} IDU, {audit.physicalGroup.antenna} antenna source tags.</p>
  <ControlledModuleSection0553 moduleKey={id+".two-radios-one-enclosure"} title="MR0001 ZWP8 Row43 — Two priced ODU TAGs, separate IDU / One TCAB" defaultOpen>
   <p className="p55-note"><strong>MR-502-003 and MR-502-004 are two DIFFERENT cost owners, not one repeated radio.</strong> MR0001 C1 ZWP8 Table 5 requires two ODU/IDU/antenna functions under Row43, two SA TAGs under Row45, but only <strong>one TCAB-500-003 Set (Row46)</strong>. A historical BARTEC Type2 dual-PoE/dual-Surge enclosure is one candidate, not an approved Z1F model or a second cabinet.</p>
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact"><thead><tr><th>Physical TAG / Distinct Role</th><th>Quote functions / Paired owner</th><th>Source USD</th><th>Working THB</th><th>Scope / Approval</th></tr></thead><tbody>
    {proof.radios.map(r=><tr key={r.tag}><td><strong>{r.tag} Row43</strong><small>{r.role}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom.zwp8."+r.tag.toLowerCase()+".43.required-bom"} componentName={r.tag+" / Required BOM working price evidence"}/></td><td>{r.functions.map(x=>x.code).join(" + ")}<small>{r.pairedIdU} / {r.associatedAntenna} booked separately</small></td><td><strong>USD {fmt(r.alreadyBookedSiteUSD)}</strong></td><td>{Number.isFinite(audit.fx.thbPerUsd)?"THB "+fmt(r.alreadyBookedSiteUSD*audit.fx.thbPerUsd):"FX REQUIRED"}</td><td>1 source Set · {r.technicallyApproved?"APPROVED":"INTERNAL BUDGET ONLY"}<small>No second ODU posting</small></td></tr>)}
    <tr><td><strong>IDU owners (2 TAGs)</strong></td><td>MR-502-003A + MR-502-004A</td><td>USD {fmt(proof.iduCostUSD)}</td><td>{Number.isFinite(audit.fx.thbPerUsd)?"THB "+fmt(proof.iduCostUSD*audit.fx.thbPerUsd):"FX REQUIRED"}</td><td>PoE power interface only; full OEM IDU technical proof open</td></tr>
    <tr><td><strong>Antennas (2 TAGs)</strong></td><td>ANT-502-002 PTMP + ANT-502-003 PTP</td><td>USD {fmt(proof.antennaCostUSD)}</td><td>{Number.isFinite(audit.fx.thbPerUsd)?"THB "+fmt(proof.antennaCostUSD*audit.fx.thbPerUsd):"FX REQUIRED"}</td><td>PTMP sector and PTP parabolic; confirm actual new/reuse</td></tr>
    <tr><td><strong>Ethernet surge (2 TAGs)</strong></td><td>SA-502-002 + SA-502-003 (NOT in ODU again)</td><td>USD {fmt(proof.surgeCostUSD)}</td><td>{Number.isFinite(audit.fx.thbPerUsd)?"THB "+fmt(proof.surgeCostUSD*audit.fx.thbPerUsd):"FX REQUIRED"}</td><td>Separately owned and counted once</td></tr>
    <tr><td><strong>{proof.enclosureTag} Row {proof.enclosureRow} — ONE enclosure</strong></td><td>Historical 2022 Type2: two PoE, two surge; 16 M20 holes, Z1F GA Sheet13 10 bottom M20</td><td>THB source, not USD</td><td>THB {fmt(proof.enclosureWorkingCostTHB)}</td><td>1 Set only · Pending new exact Ex/thermal drawing and new price; do not duplicate for each radio</td></tr>
   </tbody></table></div>
   {proof.radios[0].functions.some(r=>r.code==="A-4")&&<p className="p55-note" data-component-key={id+".pmp-capacity-licence-check"}><strong>High-value cost driver:</strong> Next G line A-4 ({proof.radios[0].functions.find(r=>r.code==="A-4").sku}) is USD {fmt(proof.radios[0].functions.find(r=>r.code==="A-4").quotedUnitUSD)} for PMP Maximum Remotes & Maximum Mbps. It represents {fmt(proof.radios[0].functions.find(r=>r.code==="A-4").quotedUnitUSD/proof.radios[0].alreadyBookedSiteUSD*100)}% of MR-502-003 ODU working cost. This expensive licence option requires PTMP subscriber capacity/OEM entitlement confirmation; do not remove or release it just because ZWP8 looks high.</p>}
   <p className="p55-note"><strong>High ZWP8 total analysis:</strong> two separately priced radio roles and RF functions plus Cisco, enclosure and Bulk are represented at this brownfield hub, unlike single-radio new wellhead sites. A historical ZPQ–ZWP8 physical PTP link remains existing, while a proposed additional capacity link is budgeted conditionally. This is not proof that both candidate new purchases are accepted; NEW/REUSE and full supplier RFQ must be checked. Baseline THB {fmt(audit.currentWorkingTHB)} remains unchanged.</p>
  </ControlledModuleSection0553>
  <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
   <thead><tr><th>Working Budget Basis</th><th>Budget THB (Primary)</th><th>Original Vendor Currency (Evidence)</th><th>Scope / Engineering Gate</th></tr></thead><tbody>
   <tr><td><strong>Current posted ZWP8 TAG Ledger</strong></td><td><strong>THB {fmt(audit.currentWorkingTHB)}</strong></td><td>USD {fmt(audit.currencyTotals.USD)} + THB {fmt(audit.currencyTotals.THB)}</td><td>Existing source-backed working preview; {audit.ledgerCoverage.costed}/{audit.ledgerCoverage.total} TAGs booked</td></tr>
   <tr><td><strong>Current duplicate surge booking</strong></td><td>{Number.isFinite(audit.fx.thbPerUsd)?"THB "+fmt(audit.duplicatedSurgeUSD*audit.fx.thbPerUsd):"FX REQUIRED"}</td><td>USD {fmt(audit.duplicatedSurgeUSD)}</td><td>A-8/B-8 now belong only to SA TAGs, never doubled in Radio ODU</td></tr>
   <tr><td><strong>Current misplaced IDU power</strong></td><td>{Number.isFinite(audit.fx.thbPerUsd)?"THB "+fmt(audit.misplacedPOEUSD*audit.fx.thbPerUsd):"FX REQUIRED"}</td><td>USD {fmt(audit.misplacedPOEUSD)}</td><td>A-6/A-7 and B-6/B-7 are assigned once to IDU TAGs; complete IDU approval pending</td></tr>
   <tr><td><strong>Reconciled role-based working total</strong></td><td><strong>THB {fmt(audit.adjustedOwnerTotalTHB)}</strong></td><td>USD {fmt(audit.adjustedOwnerTotalUSD)} + THB {fmt(audit.currencyTotals.THB)}</td><td>Current working subtotal; OEM, licence and source scope release still unapproved</td></tr>
   </tbody></table></div>
  <p className="p55-note"><strong>First-principle formula:</strong> {audit.calculation}. Quote source B-12 provides only {audit.sourceUnitUSD.antenna!==null?"one original global quoted 4ft antenna line;":"no confirmed antenna rate;"} vendor offered Qty is not ZWP8 required physical quantity.</p>
  <ControlledModuleSection0553 moduleKey={id+".issues"} title={"Source, Physical Quantity & Cost-Owner Gates ("+audit.issues.length+")"}>
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
    <thead><tr><th>Audit ID / Copy</th><th>Gate</th><th>Assessment & Required Decision</th></tr></thead><tbody>
     {audit.issues.map(issue=><tr key={issue.id}><td><strong>{issue.id}</strong>
      <ComponentCopyId projectId="PJ2608-0553" componentKey={id+".issues."+issue.id.toLowerCase()} componentName={issue.title}/></td>
      <td><strong>{issue.level}</strong><small>{issue.title}</small></td><td>{issue.details}</td>
     </tr>)}
    </tbody></table></div>
  </ControlledModuleSection0553>
  <ControlledModuleSection0553 moduleKey={id+".rpt-topology"} title={"RPT Rev.C1 Topology Evidence — "+audit.siteLinks.length+" link(s)"}>
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
    <thead><tr><th>RPT Link</th><th>Mode / Installed Lifecycle</th><th>Report Antenna at Ends</th><th>Engineering Scope / Cost Gate</th></tr></thead><tbody>
    {audit.siteLinks.map(link=><tr key={link.id}><td>{link.from} → {link.to}</td><td>{link.mode}<small><strong>{link.installedLinkState}</strong></small></td><td>{link.txAntenna} / {link.rxAntenna}</td><td>{link.capacityScope}<small>{link.newReplacementAutomaticallyRequired===false?"Existing equipment replacement NOT inferred from link identity":"Confirm new/reuse physical items, number of radios/antennas and OEM CAL"}</small></td></tr>)}
    </tbody></table></div>
  </ControlledModuleSection0553>
  <p className="p55-note"><strong>Original source:</strong> {audit.basis}. <strong>No price mutation:</strong> source ledger, quotation, management scenario and full A+B+C remain unchanged pending architecture/engineering Change Control.</p>
 </ControlledModuleSection0553>;
}
