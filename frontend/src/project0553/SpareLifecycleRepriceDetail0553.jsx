import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectSpareLifecycleReprice0553} from "./data/spareLifecycleReprice0553";

// 10.2 and 10.5 share the SAME PTTEP source-led register. Release consumes this
// model too, but no customer price is issued without OEM SPIR and independent quote.
const fmt=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const baseCodes=new Set(["B10","B11","B13"]);
export function SpareLifecycleRepriceDetail0553({code,mode="working"}){
 const register=selectSpareLifecycleReprice0553();
 const owner=register.byCode[code];
 if(!owner)return null;
 const root=mode==="working"?"bid.budget.working.bc."+code.toLowerCase()+".detail":"bid.budget.scope."+code.toLowerCase();
 const groups=register.groups.filter(x=>x.code===code);
 return <section className="p55-panel" style={{padding:14}} data-component-key={root}>
  <p className="p55-eyebrow">{mode==="working"?"10.2 WORKING COST":"10.5 CUSTOMER SCOPE"} · PTTEP STD / OEM SPIR RE-ESTIMATION</p>
  <h3>{code} — {owner.name}</h3>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={root}/>
   {" "}· Source <code>{owner.moduleId}</code> · <strong>{baseCodes.has(code)?"PART B · BASE REQUIRED":"PART C · QUOTATION OPTION ONLY"}</strong></p>
  <div className="p55-metric-grid">
   <div><strong>New Working SELL</strong><p>{fmt(owner.workingSellTHB)}</p><small>No historical Rev08 price carried</small></div>
   <div><strong>Verified OEM Direct COST</strong><p>{fmt(owner.directCostTHB)}</p><small>Independent supplier spare/tool quotation pending</small></div>
   <div><strong>Engineering Candidates</strong><p>{owner.candidateCount}</p><small>Not automatically purchased parts</small></div>
   <div><strong>Customer Release</strong><p>HOLD</p><small>OEM SPIR, Qty, Ex compatibility and physical stock owner incomplete</small></div>
  </div>
  <p className="p55-note"><strong>Five mutually-exclusive commercial cost owners (one engineering register):</strong> B10 Erection/Commissioning Spares; B11 Special Tools; B13 Consumables; C1 Capital Spare Option; C2 Two-Year Operating Spare Option. Part A/A5 installed bulk is NOT B10 physical spare stock. Parts already purchased with OEM packages are NOT new price lines.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Cost Owner</th><th>Commercial Class</th><th>Candidate Requirements</th><th>Current Working SELL</th><th>Release</th></tr></thead>
   <tbody>{register.commercialOwners.map(o=><tr key={o.code}>
    <td><strong>{o.code}</strong></td><td>{o.commercialClass}</td>
    <td>{register.byCode[o.code].candidateCount}</td><td>{fmt(register.byCode[o.code].workingSellTHB)}</td><td>HOLD</td>
   </tr>)}</tbody>
  </table></div>
  {code==="B10"&&<details className="p55-panel" open style={{padding:10}}>
   <summary><strong>MR0001–MR0004 / Attachment-5 — 14 commissioning spare kits</strong></summary>
   <p className="p55-note">The PTTEP document specifies 1 spare kit per applicable MR/platform, not 1 complete major-equipment spare. Every kit needs OEM-SPIR part contents, quantities and traceable allocation.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>MR</th><th>Physical Locations</th><th>Required Kits</th><th>OEM Contents</th><th>Value</th></tr></thead>
    <tbody>{register.commissioningKitDemand.map(k=><tr key={k.mr}>
     <td>{k.mr}</td><td>{k.sites.join(", ")}</td><td>{k.requiredSets} set(s)</td>
     <td>NOT VERIFIED · OEM SPIR / Attachment 5</td><td>NOT ESTABLISHED</td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note"><strong>Brownfield:</strong> ZPQ, ZWP08, ZWP11 SCADA + ZPQ DMR are "as required" interfaces, not four more automatically priced kits.</p>
  </details>}
  {groups.map(g=><details className="p55-panel" key={g.moduleId} open style={{padding:10}} data-component-key={g.moduleId}>
   <summary><strong>{g.title}</strong> · {g.rows.length} candidates · Working SELL NOT ESTABLISHED</summary>
   <p className="p55-note"><code>{g.moduleId}</code> · {g.mr} · {g.sites.join(", ")} · {g.source}</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1150}}>
    <thead><tr><th>No. / Module ID</th><th>Spare / Tool / Consumable</th><th>MR &amp; Sites</th><th>Technical Evidence / Source</th><th>Required Qty / OEM Part No.</th><th>Direct COST THB</th><th>Working SELL THB</th></tr></thead>
    <tbody>{g.rows.map((r,i)=><tr key={r.id} data-component-key={r.moduleId}>
     <td><strong>{i+1}</strong><small>{r.id}</small><small><ComponentCopyId projectId="PJ2608-0553" componentKey={r.moduleId}/></small></td>
     <td><strong>{r.description}</strong><small>{r.requirementClass}</small></td>
     <td>{r.relatedMR}<small>{r.sites.join(", ")}</small><small>Installed TAG: pending verified mapping</small></td>
     <td>{r.qualification}<small>{r.sourceReferences.join(" | ")}</small></td>
     <td>NOT ESTABLISHED<small>OEM Part No.: {r.sparePartNumber||"NOT ESTABLISHED"}</small></td>
     <td>{fmt(r.directCostTHB)}</td><td>{fmt(r.workingSellTHB)}</td>
    </tr>)}</tbody>
   </table></div>
  </details>)}
  <details className="p55-panel" style={{padding:10}}>
   <summary><strong>PTTEP Source, Applicability &amp; No-Double-Count Gates</strong></summary>
   <p className="p55-note"><strong>Document conflict:</strong> {register.documentControl.specificConflict}</p>
   <p className="p55-note"><strong>Cable capacity:</strong> {register.documentControl.cableCapacityNotStock}</p>
   <p className="p55-note"><strong>C2 exclusion:</strong> {register.documentControl.c2Exclusion}</p>
   <p className="p55-note"><strong>B11 phase tool sharing:</strong> {register.documentControl.phaseToolPooling}</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Mandatory OEM/SPIR Verification Field</th><th>Current State</th></tr></thead>
    <tbody>{register.documentControl.oemFormFields.map(x=><tr key={x}><td>{x}</td><td>OPEN / Source proof required</td></tr>)}</tbody>
   </table></div>
  </details>
  <p className="p55-note"><strong>Financial control:</strong> No Rev08/previous WBS price seeds, no carry-forward from MGW installed equipment Part A, no invented SKU/quantity or unit cost. New B10/B11/B13/C1/C2 prices remain NULL until OEM SPIR and independent quotation provide current evidence. All five customer-release gates HOLD.</p>
 </section>;
}
