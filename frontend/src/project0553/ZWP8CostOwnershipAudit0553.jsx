import React,{useMemo} from "react";
import {ControlledModuleSection0553} from "./ControlledModuleSection0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {auditZWP8CostOwnership0553} from "./data/zwp8CostOwnershipAudit0553";
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
export function ZWP8CostOwnershipAudit0553({fx=null}){
 const audit=useMemo(()=>auditZWP8CostOwnership0553({thbPerUsd:fx?.thbPerUsd??null}),[fx?.thbPerUsd]);
 const id="bid.budget.bom.zwp8.cost-ownership-audit";
 return <ControlledModuleSection0553 moduleKey={id}
  title="ZWP8 · Cost Ownership Reconciliation — AFC role split / Brownfield"
  description="THB is the primary budget currency; source USD retained for vendor evidence. Working FX is not a verified BOT rate.">
  <p className="p55-note"><strong>PTP ZPQ ↔ ZWP8 = EXISTING baseline link (BLD C1).</strong> BOD C2 §7.2 separately requests added capacity/new link; this must NOT convert the existing link into a second NEW radio procurement without scope/endpoint proof.</p>
  <p className="p55-note"><strong>Finding: {audit.flags.uniqueCostOwnerPassed?"SOURCE OWNERS RECONCILED":"SOURCE OWNERSHIP REVIEW REQUIRED"}.</strong> ZWP8 new PTMP and added PTP are kept separate from the existing PTP baseline; vendor technical acceptance is pending. MTO row43 has {audit.physicalGroup.radioODU} ODU, {audit.physicalGroup.radioIDU} IDU, {audit.physicalGroup.antenna} antenna source tags.</p>
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
