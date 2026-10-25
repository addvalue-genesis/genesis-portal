import React from "react";
import {SPARE_LIFECYCLE_CODES_0553} from "./data/spareLifecycleTrace0553";

const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"Not established";
const titles={
 B10:"Erection / Pre-commissioning / Commissioning / Start-up spares",
 B11:"Operation & Maintenance Special Tools",
 B13:"Preservation / Commissioning Consumables",
 C1:"Capital Spares — optional quotation",
 C2:"Two-year Operating Spares — optional quotation"
};
export function SpareLifecycleControl0553({
 model,view="working",onOpenSource=null,onOpenReleaseRow=null
}){
 if(!model||model.rows.length!==16||model.releaseAllowed!==false)throw Error("0553 spare lifecycle view requires 16 unissued source rows");
 return <details className="p55-panel p553-spare-lifecycle" data-component-key={"bid.budget."+(
    view==="release"?"pricing.release.preview.spare-lifecycle":"working.bc.spare-lifecycle-control")}
   style={{padding:12}}>
  <summary><strong>B10 · B11 · B13 · C1 · C2 — Linked Source / Release / Source Control</strong>
   <small>16 existing finance rows · no new OEM physical SKU charges · 7 cross-category rules · Release HOLD</small></summary>
  <p className="p55-note">Price owners are unchanged. A 14-kit B10 contractual minimum does not prove
   the quantity or price of an individual OEM spare article; B11 permanent handover tools differ
   from B3 temporary testing, B13 consumables differ from B5/A5 installed materials, C1/C2 require
   separate OEM stock ownership. All source references below open exact Working / Release records.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Category</th><th>Requirement</th><th>Existing financial lines</th><th>Working SELL / Option</th><th>Readiness</th></tr></thead>
   <tbody>{SPARE_LIFECYCLE_CODES_0553.map(code=><tr key={code}>
    <td><strong>{code}</strong></td><td>{titles[code]}</td>
    <td>{model.totals[code].rows}</td>
    <td>{money(model.totals[code].workingSellTHB)}</td>
    <td>{code.startsWith("C")?"OEM separate quotation HOLD":"Parametric, not OEM spare SKU-level verified"}</td>
   </tr>)}</tbody>
  </table></div>
  <details className="p553-spare-lifecycle-sub">
   <summary>Source ↔ Release — all 16 specific line identities</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Owner</th><th>Source Row</th><th>Requirement / MR</th><th>Kit / Working Qty</th><th>Working THB</th><th>Navigation</th></tr></thead>
    <tbody>{model.rows.map(x=><tr key={x.id}
     data-spare-roundtrip-row={x.sourceId} data-source-row-module-id={x.sourceRowModuleId}>
     <td><strong>{x.code}</strong></td>
     <td><code>{x.sourceId}</code></td><td>{x.description}<small>{x.mr.join(" / ")}</small></td>
     <td>{x.quantity??"Pending"} {x.unit}</td><td>{money(x.selectedWorkingSellTHB)}</td>
     <td><div className="p553-spare-lifecycle-actions">
      {typeof onOpenSource==="function"&&<button type="button" className="p553-detail-button"
       onClick={()=>onOpenSource({code:x.code,sourceId:x.sourceId,traceId:x.traceId,
        sourceRowModuleId:x.sourceRowModuleId,sourceModuleId:x.sourceRowModuleId})}>↗ 10.2 Source</button>}
      {typeof onOpenReleaseRow==="function"&&<button type="button" className="p553-detail-button"
       onClick={()=>onOpenReleaseRow({code:x.code,sourceId:x.sourceId,
        sourceRowModuleId:x.sourceRowModuleId,traceId:x.traceId})}>↗ 10.3.3 Release</button>}
     </div></td>
    </tr>)}</tbody></table></div>
  </details>
  <details className="p553-spare-lifecycle-sub">
   <summary>Physical stock / service overlap controls ({model.rules.length} independent checks)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Boundary</th><th>Contract / Engineering Driver</th><th>Rule before commercial posting</th><th>Status</th></tr></thead>
    <tbody>{model.rules.map(x=><tr key={x.id}><td><strong>{x.left} / {x.right}</strong><small>{x.title}</small></td>
     <td>{x.requirement}</td><td>{x.decision}</td><td>HOLD — exact SKU / delivered quantity review</td></tr>)}</tbody>
   </table></div>
   <p className="p55-note">Functional descriptions that look similar are NOT proof of the same interchangeable SKU.
    No B10/C1/C2 item is automatically credited, removed, duplicated or posted without the approved OEM Part No., Qty and stock owner.</p>
  </details>
  {model.alertFamilies.length>0&&<details className="p553-spare-lifecycle-sub">
   <summary>Legacy candidate functional overlaps ({model.alertFamilies.length}) — evidence only</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Function</th><th>Potential categories</th><th>Verification gap</th></tr></thead>
    <tbody>{model.alertFamilies.map((x,i)=><tr key={x.family+":"+i}>
     <td>{x.family}</td><td>{x.categories.join(" / ")}</td><td>{x.decision}</td></tr>)}</tbody></table></div>
  </details>}
  <p className="p55-note"><strong>Reconciliation:</strong> 16/16 parent Source / Release IDs
   and amounts match. SKU/stock allocation is NOT approved. Neither this screen nor navigation changes
   WBS SELL, Official USD, native Excel or customer release authority.</p>
 </details>;
}
