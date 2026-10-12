// PJ2608-0553 SCADA physical completeness projection, not a second BOM or cost ledger.
// Decisions 2026-10-12: derive quantities, show vendor-included children, use transparent budget analogues.
// A visible child never implies a separately purchasable SKU or an approved OEM quantity.
import React,{useState} from "react";
import {WORKING_BOM_BY_LOCATION_0553} from "./data/workingBomByLocation";
import {selectMR0001TagCostRows0553} from "./data/mr0001TagCostLedger0553";
import {ZWP20_BULK_SCOPE_AUDIT_0553} from "./data/zwp20BulkScopeAudit0553";
import {MR0001_FUNCTIONS_0553} from "./data/mr0001EightFunctionCoverage0553";
import {deriveScadaBulkVerification0553} from "./data/scadaBulkQuantityVerification0553";

const families=[
 ["RADIO","Radio / ODU / IDU",/^MR-/i,["RF filter","Power adaptor / DC mating","Throughput / region / NMS entitlements","Radio mount and RF jumpers"]],
 ["ANTENNA","Antenna",/^ANT-/i,["Bracket / pole / SS fasteners","RF mating connectors / feeder","Alignment and bonding"]],
 ["LAN","LAN / switching",/^LAN-/i,["Power / SFP / uplink patching","Network licences and configuration"]],
 ["DATO","Data termination",/^DATO-/i,["Certified mating interface","RJ45 termination / patch lead"]],
 ["TCAB","Ex enclosure",/^TCAB-/i,["Terminals / fuses / earth busbar","Mount / labels / glands / drain","Thermal and Ex assembly verification"]],
 ["SURGE","Surge",/^SA-/i,["Protected and earth interfaces","Earth wire and terminal"]],
 ["BULK","Field bulk",/bulk.material/i,["Cables / terminations","Glands / Ex ingress","Mounting, cleats and bonding"]]
];
const controlFor=site=>["ZPQ","ZWP8","ZWP11"].includes(site)?"NEW_REUSE_MODIFY_BY_OTHERS_REVIEW":"NEW_PACKAGE_COMPOSITION_REVIEW";
const formatted=n=>Number.isFinite(n)?n.toLocaleString("en-US",{maximumFractionDigits:2}):"Not established";
const knownBulk=ZWP20_BULK_SCOPE_AUDIT_0553.checks;
export function ScadaPhysicalCompleteness0553({site="ALL"}){
 const [showChildren,setShowChildren]=useState(true);
 const sites=WORKING_BOM_BY_LOCATION_0553.locations.filter(g=>site==="ALL"||g.site===site);
 const bulkBySite=deriveScadaBulkVerification0553();
 return <details className="p55-panel" data-component-key="bid.budget.bom.scada-physical-completeness">
  <summary style={{cursor:"pointer",fontWeight:700,padding:10}}>＋ / − SCADA SI Equipment &amp; Bulk Completeness — 7 locations (verification, not extra cost)</summary>
  <p className="p55-note">Customer MTO tags are preserved. Child functions display whether a vendor package must include them, not an instruction to purchase twice. Derived quantities require verified physical interfaces, routes, supplier inclusions and Ex/technical constraints. Existing cost ledger remains the sole price owner.</p>
  <label><input type="checkbox" checked={showChildren} onChange={e=>setShowChildren(e.target.checked)}/> Show vendor-package child functions and interface obligations</label>
  {sites.map(g=>{
   const ledger=selectMR0001TagCostRows0553(g.site);
   const controls=MR0001_FUNCTIONS_0553.map(f=>({...f,present:g.items.some(i=>f.test(String(i.sourceTag||"").toUpperCase()))}));
   const priced=ledger.filter(x=>x.countedInWorkingTotal).length;
   return <details key={g.site} className="p55-panel">
    <summary><strong>{g.site}</strong> — {g.items.length} MTO tag records · {priced}/{ledger.length} working priced tag rows · {controls.filter(x=>x.present).length}/8 functional tag categories present</summary>
    <p className="p55-note">Ownership: {controlFor(g.site)}. Tag coverage and price coverage do not certify installed quantity, Ex suitability, RF performance or completeness.</p>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Physical family / Source tags</th><th>Child components / bulk obligations</th><th>Quantity derivation</th><th>Procurement &amp; cost boundary</th><th>SI verification</th></tr></thead><tbody>
      {families.map(([key,label,test,children])=>{
       const tags=g.items.filter(i=>test.test(String(i.sourceTag||"")));
       const costed=ledger.filter(r=>tags.some(t=>t.sourceTag===r.tag&&t.sourceRow===r.row)).filter(r=>r.countedInWorkingTotal).length;
       return <tr key={key}><td><strong>{label}</strong><small>{tags.length?tags.map(t=>t.sourceTag).join(", "):"No explicit MTO tag in this site"}</small></td>
        <td>{showChildren?children.map((c,i)=><small key={i}>{c}</small>):"Hidden"}</td>
        <td>{key==="BULK"?"Distinct physical cable runs × evidenced route length + purchasing allowance; entry/endpoints counted independently":"MTO tag set → actual functions/ports/interfaces → OEM-confirmed part count"}</td>
        <td>{tags.length?costed+"/"+tags.length+" source tags working priced; child inclusion conditional, no additive cost":"No automatic procurement: check existing / reuse / by others / requirement"}</td>
        <td>{tags.length?"PACKAGE_COMPOSITION_AND_INTERFACE_PROOF_REQUIRED":"MISSING_TAG_OR_NOT_APPLICABLE_DECISION_REQUIRED"}</td></tr>;
      })}
    </tbody></table></div>
    <details className="p55-panel"><summary>16 physical bulk functions — derived quantities and budget-rate evidence</summary>
      <p className="p55-note">No new cost has been booked. CAT6A historical rate 524 THB/m and M20 gland 1,020 THB/ea are comparable only. IP67 RJ45 rate is reference-only, not Ex acceptance. Brownfield NEW/REUSE remains a separate decision.</p>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Function</th><th>Derived Qty / Basis</th><th>Source Rate</th><th>Unposted Budget Reference (THB)</th><th>Ownership / Verification</th></tr></thead><tbody>
      {(bulkBySite.find(x=>x.site===g.site)?.rows||[]).map(b=><tr key={b.id}><td>{b.id}<small>{b.item}</small></td><td>{b.derivedQty??"DERIVATION REQUIRED"} {b.unit}<small>{b.quantityState}</small></td><td>{Number.isFinite(b.unitRateTHB)?"THB "+formatted(b.unitRateTHB):"Rate research required"}<small>{b.rateSource||b.priceBasis}</small></td><td>{Number.isFinite(b.provisionalExtendedTHB)?"THB "+formatted(b.provisionalExtendedTHB):"Not booked / supplier inclusion or rate needed"}</td><td>{b.decision}<small>{b.caveat}</small></td></tr>)}
      </tbody></table></div>
    </details>
    <p className="p55-note">Checks before completeness: radio topology and licences; exact antenna count and RF path; independent ODU-to-indoor Ethernet runs; DC/patching; external earth; Ex gland sizing/entry count; vendor-supplied bracket, jumpers and panel internals; test/termination interface. No additional amount is added here.</p>
   </details>;
  })}
  {site==="ALL"&&<details className="p55-panel"><summary>Bulk functional checks (ZWP20 reference methodology, not copied as quantities across WPs)</summary>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Function</th><th>Reference / Budget quantity</th><th>Cost treatment</th><th>Required independent proof</th></tr></thead><tbody>
     {knownBulk.map(x=><tr key={x.id}><td>{x.item}</td><td>{x.qty===null?"Derived from interface/route":formatted(x.qty)+" "+x.unit}</td><td>{x.pricing} · {x.owner}</td><td>{x.basis}</td></tr>)}
    </tbody></table></div>
    <p className="p55-note">Only ZWP20 reference includes costed 69 m CAT6A and one M20 entry; all other entries require own quantities and comparable rates. No unknown component is assigned zero cost. Budgetary estimate is not technically approved material take-off.</p>
   </details>}
 </details>;
}
