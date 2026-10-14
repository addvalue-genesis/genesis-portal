import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./data/z1fTelLayoutIndex0553";
import {deriveWpSystemBulkBudget0553} from "./data/wpSystemBulkBudget0553";
import {deriveRaconTerminationBudget0553} from "./data/raconTerminationBudget0553";
import {MGW_P26_058_0553} from "./data/mgwP26058";

const SITES=["ZWP20","ZWP21","ZWP22","ZWP23"];
const fmt=v=>Number.isFinite(v)?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT PRICED";
export function Mr0003Mr0004LocationReview0553(){
 const bulk=deriveWpSystemBulkBudget0553(),racon=deriveRaconTerminationBudget0553();
 const phone=MGW_P26_058_0553.lines.find(x=>x[0]==="PHONE-1");
 const mgwRacon=MGW_P26_058_0553.lines.find(x=>x[0]==="RACON-1");
 return <section className="p55-panel" data-component-key="bid.budget.bom.mr0003-mr0004.zwp20-21-22-23" style={{padding:14}}>
  <h3>MR0003 / MR0004 — ZWP20 Reference → ZWP21, ZWP22, ZWP23 <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.mr0003-mr0004.zwp20-21-22-23"/></h3>
  <p className="p55-note">MR0001 is management-reviewed and unchanged. Source facts and budget assumptions are distinct. ZWP23 is not automatically cloned from ZWP20/21/22 or priced using quote-wide quantities.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Location</th><th>MR</th><th>AFC evidence</th><th>Vendor price evidence</th><th>Cost ownership / missing proof</th></tr></thead><tbody>
   {SITES.flatMap(site=>{
    const w=Z1F_TEL_LAYOUT_INDEX_0553.byWP.find(x=>x.wp===site);
    const bb=bulk.find(x=>x.wp===site);
    const rb=racon.find(x=>x.wp===site);
    const sounders=w?.equipment.filter(e=>e.tag==="LSE-504-001")||[];
    const marine=w?.equipment.filter(e=>e.system==="MARINE_RACON")||[];
    const mr3=bb?.systems.find(s=>s.id==="EX_IP_PHONE");
    return [
     <tr key={site+"-3"}><td><strong>{site}</strong></td><td>MR0003 · Ex IP Phone</td><td>{sounders.length?("LAY sounder LSE-504-001 on sheet "+sounders.map(s=>s.sheet).join(", ")):"NO MR0003 PHONE / SOUNDER TAG VERIFIED ON THIS LAY"}<small>Sounder does not establish IP Phone quantity. Verify MR0003, phone/JB drawing and ELE-LAY-0002.</small></td><td>MGW PHONE-1: USD {fmt(phone?.[4])} per quoted set, 3 sets quote-wide for ZWP20–22 only.</td><td>{site==="ZWP23"?"NO ZWP23 ALLOCATION WITHOUT SCOPE EVIDENCE":"Vendor includes phone bracket, Ex headset, sounder/strobe and WAROM JB with gland."}<small>{mr3?mr3.items.length+" preliminary bulk functions; independently check field cable and Ex entries.":"No separate cost-backed phone bulk owner."} No additive duplicate sounder/JB.</small></td></tr>,
     <tr key={site+"-4"}><td><strong>{site}</strong></td><td>MR0004 · Marine RACON</td><td>{marine.length?marine.map(e=>e.tag+" (sheet "+e.sheet+")").join(", "):"NO MARINE RACON TAG VERIFIED ON THIS LAY"}</td><td>MGW RACON-1: USD {fmt(mgwRacon?.[4])} per quoted set for ZWP20–22. ORGA USD 75,000 is a separate alternative for ONE system, not additive.</td><td>{rb?rb.routedRunCount+" distinct budgetary circuits; "+rb.additionalCablePurchaseM+" m replacement scenario, NOT measured.":"ZWP23 requires confirmed system scope before a route or package is counted."}<small>Supplier cable/glands, Ex enclosures and separate field scope must be reconciled; quoted cut lengths cannot automatically be joined.</small></td></tr>
    ];
   })}
  </tbody></table></div>
  <p className="p55-note"><strong>Derivation control 01–08:</strong> source → requirements → location/tag → interfaces → physical takeoff → technical constraints → cost-owner/rate → A+B+C reconciliation. This is an evidence/coverage audit, not a completion claim for B1–B14/C1–C2. Missing source ≠ zero; ZWP23 cannot inherit a three-site quote allocation.</p>
  <p className="p55-note">Sources: AFC MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 sheets 3–13; MGW P26-058; ORGA QTORG2609244 and existing shared bulk derivations. Customer release remains gated.</p>
 </section>;
}
