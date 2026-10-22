import React from "react";
import {deriveMR0002RfPhysicalRouteReconciliation0553} from "./data/mr0002RfPhysicalRouteReconciliation0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";

// Inline at System x Location x MTO/MR0002 BULK. Physical quantity is
// deliberately NULL until AFC cable-end route is measured.
export function MR0002RfRouteReconciliation0553({site}){
 const data=deriveMR0002RfPhysicalRouteReconciliation0553().sites.find(x=>x.site===site);
 if(!data)return null;
 const fmt=v=>Number.isFinite(v)?v.toLocaleString("en-US",{maximumFractionDigits:3}):"NOT VERIFIED";
 return <section className="p55-panel" data-component-key={data.moduleId}>
  <h4>MR0002 · {site} — RF Cable From/To Physical Circuit Register <ComponentCopyId projectId="PJ2608-0553" componentKey={data.moduleId}/></h4>
  <p className="p55-note"><strong>Engineering source:</strong> {data.layoutDocument}, Sheet {data.layoutSheet} locates the four TAGs, but does NOT give routed cable metres.
   BLD C1 is a functional system diagram, NOT accepted WIR/TER.
   MR0002 C1 requires a 1 Lot BULK scope per site including fire-resistant coaxial cable and grounding.</p>
  <p className="p55-note"><strong>AFC LAY role-identity review (DO NOT SWAP TAGs):</strong>
   {site}: <strong>{data.afcSurgeEnclosureTag}</strong> = Ex d RF SURGE; <strong>{data.afcLnaEnclosureTag}</strong> = original AFC LNA.
   MGW Rev2 proposes RFI BDA; the AFC still depicts LNA and does not certify BDA substitution.
   <strong> {data.engineeringChange}</strong>. Approved vendor GA, updated schematic, Ex certificate and technical deviation are pending.</p>
  <p className="p55-note"><strong>Deviation 1.1 Rev00 — {data.deviationStatus.toUpperCase()} (not AFC):</strong>
   RFI BDA +33–36 dBm / gain 60–80 dB with AGC and oscillation mute; donor Yagi ANT-508-001 is proposed RFI YBSS6 (6-element, 11 dBi) at EL +21.100m;
   service Omni ANT-508-002 is proposed BENEATH LOWER DECK at EL +18.300m. Both must be accepted by Purchaser/Company.
   The same-deck length proxy below is historical sensitivity only and is invalid for the proposed cross-deck cable purchase.</p>
  <div className="p55-table-wrap p553-module-scroll">
   <table className="p55-table p55-table--compact">
    <thead><tr><th>Physical RF function / ID</th><th>From → To</th><th>AFC installed length</th><th>Budget reference installed</th><th>Budget reference buy (+15%)</th><th>Evidence / Cost Owner</th></tr></thead>
    <tbody>{data.circuits.map(c=><tr key={c.id} data-component-key={c.moduleId}>
      <td><strong>{c.name}</strong><small>{c.id}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={c.moduleId}/></td>
      <td>{c.from} → {c.to}<small>{c.topology}</small></td>
      <td><strong>{fmt(c.verifiedInstalledM)}</strong><small>WIR/TER + field route required</small></td>
      <td>{fmt(c.engineeringBudgetReferenceInstalledM)} m<small>9.144m bay proxy + 3m route/term allowance, NOT field measured</small></td>
      <td>{fmt(c.engineeringBudgetReferencePurchaseM)} m<small>Scenario only / not extra posting</small></td>
      <td>{c.owner}<small>{c.sourceStatus}; validate surge, coupler, connector interface</small></td>
    </tr>)}</tbody>
   </table>
  </div>
  <div className="p55-table-wrap p553-module-scroll">
   <table className="p55-table p55-table--compact">
    <thead><tr><th>RF Material Owner</th><th>Feeder m/site</th><th>Connector pcs/site</th><th>Interpretation</th><th>Cost status</th></tr></thead>
    <tbody>
     <tr><td><strong>MGW / FORLLER — UHF-4</strong></td><td>100 m quoted included</td><td>6 included</td>
      <td>MGW complete system includes functional installed RF feeder; verify reel/cut allocation, IEC60331 and RF interfaces. Any cable shortage is MGW corrective scope.</td><td>VENDOR INCLUDED · complete-system owner</td></tr>
     <tr><td><strong>ADDVALUE / NEK — Conditional BULK Spare Reserve</strong></td><td><strong>NOT APPROVED</strong><small>Independent spare/installation contingency quantity; NOT net installation length</small></td><td>NOT APPROVED</td>
      <td>Internal spare for cutting/handling damage or contingency only if management approves; does not replace MGW installation obligation and is distinct from B10/C2 spares</td><td>NO APPROVED QTY / RATE / WORKING POST</td></tr>
     <tr><td><strong>AFC geometry only — NOT BDA proposed routing</strong></td>
      <td>{data.scenario.referenceTotalPurchaseM} m total illustrative</td><td>At least 4 main terminal ends (not a final connector count)</td>
      <td>~{fmt(data.scenario.referenceTotalInstalledM)} m illustrative installed MGW functional scope, 2 × {data.scenario.referenceMPerCircuit}m +15%. Not a request for ADDVALUE to buy NEK; reserve sizing is an INDEPENDENT decision.</td>
      <td>ILLUSTRATIVE ONLY · no booking</td></tr>
    </tbody>
   </table>
  </div>
  <p className="p55-note"><strong>Compliance HOLD:</strong> {data.compliance.scope}. SPE Rev.C2 §6.3 requires FIRE RESISTANT DMR RF coaxial cable.
   NEK SM000111 Rev6 lists IEC60332 flame retardancy, not IEC60331 fire resistance; MGW/FORLLER does not yet have verified fire-resistance certificate either.
   The 7/8-inch cable rule for remote ODU-to-antenna greater than 5m is a separate applicability check, not an automatic BDA requirement.</p>
  <p className="p55-note"><strong>MGW vendor corrective responsibility:</strong> an actual installed-route shortfall or nonconformance belongs to MGW's complete-system scope; supplier must remedy/clarify.
   <strong> ADDVALUE NEK BULK Spare Reserve: NOT DETERMINED</strong> — determine only from a separately approved spare/handling contingency policy, compliant cable and independent price evidence.
   Do not derive NEK reserve from the two functional RF route lengths. B10 commissioning and C2 long-term spares are separate ledgers. MGW/A5/B/C/customer price unchanged.</p>
  <small>Documents:
   {" "}<a href={data.mgw.source} target="_blank" rel="noopener noreferrer">MGW UHF-4 Quote</a>
   {" · "}<a href={deriveMR0002RfPhysicalRouteReconciliation0553().source.customerMR.url} target="_blank" rel="noopener noreferrer">MR0002 C1</a>
   {" · "}<a href={deriveMR0002RfPhysicalRouteReconciliation0553().source.customerSPE.url} target="_blank" rel="noopener noreferrer">SPE C2</a>
   {" · "}<a href={deriveMR0002RfPhysicalRouteReconciliation0553().source.layout.url} target="_blank" rel="noopener noreferrer">LAY C1</a>
  </small>
 </section>;
}
