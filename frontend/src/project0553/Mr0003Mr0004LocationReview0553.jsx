import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./data/z1fTelLayoutIndex0553";
import {deriveWpSystemBulkBudget0553} from "./data/wpSystemBulkBudget0553";
import {deriveRaconTerminationBudget0553} from "./data/raconTerminationBudget0553";
import {MR0003_MR0004_SCOPE_C1,mrScopeAt0553} from "./data/mr0003Mr0004ScopeC1";
import {MR0003_SELECTED_PRICE_0553} from "./data/mr0003SelectedPrice0553";
import {MR0004_SELECTED_PRICE_0553} from "./data/mr0004SelectedPrice0553";

const SITES=["ZWP20","ZWP21","ZWP22","ZWP23"];
const fmt=v=>Number.isFinite(v)?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT PRICED";
export function Mr0003Mr0004LocationReview0553(){
 const bulk=deriveWpSystemBulkBudget0553(),racon=deriveRaconTerminationBudget0553();
 const phoneBasis=MR0003_SELECTED_PRICE_0553;
 const raconBasis=MR0004_SELECTED_PRICE_0553;
 return <section className="p55-panel" data-component-key="bid.budget.bom.mr0003-mr0004.zwp20-21-22-23" style={{padding:14}}>
  <h3>MR0003 / MR0004 — ZWP20 Reference → ZWP21, ZWP22, ZWP23 <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.mr0003-mr0004.zwp20-21-22-23"/></h3>
  <p className="p55-note">MR0001 is management-reviewed and unchanged. Source facts and budget assumptions are distinct. MR0003 C1 requires 4 telephone systems including ZWP23; MR0004 C1 requires RACON only on ZWP20/21/22. Layout absence is not a scope exclusion.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Location</th><th>MR</th><th>AFC evidence</th><th>Vendor price evidence</th><th>Cost ownership / missing proof</th></tr></thead><tbody>
   {SITES.flatMap(site=>{
    const w=Z1F_TEL_LAYOUT_INDEX_0553.byWP.find(x=>x.wp===site);
    const bb=bulk.find(x=>x.wp===site);
    const rb=racon.find(x=>x.wp===site);
    const sounders=w?.equipment.filter(e=>e.tag==="LSE-504-001")||[];
    const marine=w?.equipment.filter(e=>e.system==="MARINE_RACON")||[];
    const mr3=bb?.systems.find(s=>s.id==="EX_IP_PHONE");
    const phoneRequired=mrScopeAt0553("MR0003",site);
    const raconRequired=mrScopeAt0553("MR0004",site);
    return [
     <tr key={site+"-3"}><td><strong>{site}</strong></td><td>MR0003 · Ex IP Phone</td><td>{sounders.length?("LAY sounder LSE-504-001 on sheet "+sounders.map(s=>s.sheet).join(", ")):"MR0003 C1 CONFIRMS 1 SYSTEM; PHONE / SOUNDER TAG NOT SHOWN ON THIS LAY"}<small>Sounder does not establish IP Phone quantity. Verify MR0003, phone/JB drawing and ELE-LAY-0002.</small></td><td>MR C1: {phoneRequired?"1 System required":"OUTSIDE MR SCOPE"} (TPH-504-001 + LSE-504-001 + TCAB-504-001). Selected EXION Phone THB {fmt(phoneBasis.phoneTHB)}, EXION Sounder THB {fmt(phoneBasis.sounderTHB)}, historical PROSPER BARTEC JB THB {fmt(phoneBasis.jbTHB)}. Equipment budgetary reference THB {fmt(phoneBasis.equipmentPerSiteTHB)} per site; four-site reference THB {fmt(phoneBasis.equipmentFourSitesTHB)}. MGW PHONE-1 NOT SELECTED.</td><td>{site==="ZWP23"?"ZWP23 REQUIRED BY MR0003 C1 — EXION quote quantity four covers all WP phone/sounder units; PROSPER JB historical comparable must be revalidated for Z1F":"EXION phone and sounder are selected separately; PROSPER BARTEC JB selected as historical budget reference. MGW phone/JB/sounder package excluded from active MR0003 selection."}<small>{mr3?mr3.items.length+" preliminary bulk functions; independently check field cable and Ex entries.":"No separate cost-backed phone bulk owner."} No additive duplicate sounder/JB.</small></td></tr>,
     <tr key={site+"-4"}><td><strong>{site}</strong></td><td>MR0004 · Marine RACON</td><td>{marine.length?marine.map(e=>e.tag+" (sheet "+e.sheet+")").join(", "):"NO RACON REQUIRED BY MR0004 C1 AT ZWP23"}</td><td>MR C1: {raconRequired?"1 Set required":"NOT IN SCOPE"}. Selected MDS/ORGA {raconBasis.model}, {raconBasis.quotation}: USD {fmt(raconBasis.quotedPackageRateUSD)} / ONE quoted system. Three-WP internal scenario USD {fmt(raconBasis.equipmentBudgetaryScenarioUSD)} (NOT a verified three-unit quotation). MGW RACON-1 excluded.</td><td>{rb?rb.routedRunCount+" distinct budgetary circuits; "+rb.additionalCablePurchaseM+" m replacement scenario, NOT measured.":"MR0004 C1 excludes ZWP23 — no RACON equipment, adapter or site cost allocation."}<small>ORGA quoted assemblies must not be purchased again as field bulk; 20m BFOU and 6 glands stated included p4 but contradicted by p8 exclusion. Phase adapter/charging kit counted once only if outside vendor package. Confirm FAT, spares, licensing and field works.</small></td></tr>
    ];
   })}
  </tbody></table></div>
  <p className="p55-note"><strong>Derivation control 01–08:</strong> source → requirements → location/tag → interfaces → physical takeoff → technical constraints → cost-owner/rate → A+B+C reconciliation. This is an evidence/coverage audit, not a completion claim for B1–B14/C1–C2. Missing source ≠ zero; MR0003 EXION quoted four phones and four sounders; PROSPER historical four JBs. Do NOT apply MGW PHONE-1 selected prices. MR0004 phase kit is one set/phase, not one set per WP.</p>
  <p className="p55-note">Sources: AFC MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 sheets 3–13; EXION QT_1260576; PROSPER Q-PROSRY-24051 item 3 historical; MGW P26-058 (alternative only MR0003/MR0004); selected MDS/ORGA QTORG2609244 and existing shared bulk derivations. Customer release remains gated.</p>
 </section>;
}
