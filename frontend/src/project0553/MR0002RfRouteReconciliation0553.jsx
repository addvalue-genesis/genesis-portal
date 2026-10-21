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
      <td>One site package pool; usable reel/cut allocation, IEC60331 and RF interface compatibility still unverified</td><td>VENDOR INCLUDED · no second cost</td></tr>
     <tr><td><strong>ADDVALUE / NEK — Proposed Field BULK</strong></td><td><strong>NOT VERIFIED</strong><small>Net of MGW accepted package</small></td><td>NOT VERIFIED</td>
      <td>Proposed by ADDVALUE, NOT MGW. A separate installed run OR documented replacement/credit must be established before purchase</td><td>NO RATE / NO WORKING POST</td></tr>
     <tr><td><strong>Scenario: 2 provisional RF paths</strong></td>
      <td>{data.scenario.referenceTotalPurchaseM} m total illustrative</td><td>At least 4 main terminal ends (not a final connector count)</td>
      <td>~{fmt(data.scenario.referenceTotalInstalledM)} m physically assumed; 2 × {data.scenario.referenceMPerCircuit} m and 15% purchasing allowance. If MGW 100m is fully compatible and pooled, theoretical additional feeder is 0m; NOT engineering proof</td>
      <td>ILLUSTRATIVE ONLY · no booking</td></tr>
    </tbody>
   </table>
  </div>
  <p className="p55-note"><strong>Compliance HOLD:</strong> {data.compliance.scope}. SPE Rev.C2 §6.3 requires FIRE RESISTANT DMR RF coaxial cable.
   NEK SM000111 Rev6 lists IEC60332 flame retardancy, not IEC60331 fire resistance; MGW/FORLLER does not yet have verified fire-resistance certificate either.
   The 7/8-inch cable rule for remote ODU-to-antenna greater than 5m is a separate applicability check, not an automatic BDA requirement.</p>
  <p className="p55-note"><strong>Actual ADDVALUE NEK purchase: NOT DETERMINED</strong> — cannot call it 0m or 28m for procurement until measured paths,
   approved Ex/FIRE cable, compatible usable MGW supply and commercial owner/credit are resolved.
   Quote cost and A5/B/C/customer price remain unchanged.</p>
  <small>Documents:
   {" "}<a href={data.mgw.source} target="_blank" rel="noopener noreferrer">MGW UHF-4 Quote</a>
   {" · "}<a href={deriveMR0002RfPhysicalRouteReconciliation0553().source.customerMR.url} target="_blank" rel="noopener noreferrer">MR0002 C1</a>
   {" · "}<a href={deriveMR0002RfPhysicalRouteReconciliation0553().source.customerSPE.url} target="_blank" rel="noopener noreferrer">SPE C2</a>
   {" · "}<a href={deriveMR0002RfPhysicalRouteReconciliation0553().source.layout.url} target="_blank" rel="noopener noreferrer">LAY C1</a>
  </small>
 </section>;
}
