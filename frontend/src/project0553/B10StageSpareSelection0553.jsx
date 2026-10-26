import React from "react";
import {selectB10StageSpareSelection0553} from "./data/b10StageSpareSelection0553";

const stageTitle={ERECTION:"Erection",PRE_COMMISSIONING:"Pre-commissioning",COMMISSIONING:"Commissioning",START_UP:"Start-up"};

export function B10StageSpareSelection0553({internal=false,onOpenSource=null,context="working"}){
 const model=selectB10StageSpareSelection0553();
 if(!internal)return <p className="p553-b10-commercial-note">
  B10 commissioning spare contents require OEM SPIR validation against installed equipment and the applicable Annex-8 minimums.
  The 4/3/4/3 MR kit quantities do not establish an individual spare SKU quantity or CIF USD unit price.
 </p>;
 return <details className="p55-panel p553-b10-stage-selection" open
   data-component-key={context==="working"?model.moduleId:"bid.budget."+context+".b10.stage-spare-selection"} style={{padding:12}}>
  <summary><strong>B10 — Select spares from installed Required BOM / MR Attachment 5</strong>
   <small>14 spare function candidates · 4 stages · source ZWP20 MR-502-001 row 4 · NONPOSTING</small></summary>
  <p className="p55-note"><strong>Selection logic:</strong> Part A BOM identifies installed ODU, IDU, Antenna, L3 Switch,
   Ethernet socket, Enclosure, Surge Arrestor and bulk. For B10, choose only replaceable items needed during
   Erection, Pre-commissioning, Commissioning or Start-up. Then qualify exact OEM Part No., per-kit
   physical Qty, certification, availability, installation/commissioning procedure and independent unit price.
   The 10% rules for PLC Based SCADA do not automatically apply to WiMAX radios or Cisco L3.</p>
  <div className="p553-b10-commercial-scroll">
   <table className="p553-b10-stage-selection-table">
    <thead><tr><th>MR / Installed Equipment TAG</th><th>Candidate spare function</th>
     {model.phases.map(stage=><th key={stage}>{stageTitle[stage]}</th>)}
     <th>Required verification / why</th><th>Commissioning Kit Qty</th><th>Physical spare Qty / SKU / CIF USD</th>
    </tr></thead>
    <tbody>{model.stageRows.map(r=><tr key={r.id} data-b10-stage-spare-id={r.id}
       data-component-key={context==="working"?"bid.budget.working.bc.b10.stage-spare-selection."+r.id.toLowerCase():"bid.budget."+context+".b10.stage-spare-selection."+r.id.toLowerCase()}
       data-parent-source-id={r.parentSourceId}>
      <td><strong>{r.mr}</strong><small>{r.installedEquipmentTagCandidates.join(" · ")||"Installed TAG compatibility pending"}</small></td>
      <td><strong>{r.requirementFunction}</strong><small>{r.id}</small></td>
      {model.phases.map(stage=><td key={stage} className="p553-b10-stage-flag">
       {r.phaseApplicability.includes(stage)?"✓":"—"}</td>)}
      <td>{r.validationRule}<small>{r.engineeringJustification}</small></td>
      <td>{r.commissioningKitSets} kit sets<small>NOT this spare's Qty</small></td>
      <td>OEM SPIR HOLD<small>Qty: pending · Part No.: pending · Unit CIF USD: pending</small></td>
     </tr>)}</tbody>
   </table>
  </div>
  <details className="p553-spare-lifecycle-sub">
   <summary>ZWP20 MR0001 installed Required BOM — original eight functions</summary>
   <div className="p553-b10-commercial-scroll"><table className="p55-table p55-table--compact">
    <thead><tr><th>Source TAG</th><th>Installed equipment description</th>
     <th>Installed Qty</th><th>B10 interpretation</th></tr></thead>
    <tbody>{model.originalZwp20RequiredBom.map(x=><tr key={x.site+":"+x.tag}>
     <td>{x.site} / <strong>{x.tag}</strong></td><td>{x.description}</td>
     <td>{x.installedQty} {x.unit}</td>
     <td>Installed parent only; no automatic spare Qty or spare unit price</td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note"><code>{model.upstreamInstalledBomModule}</code></p>
  </details>
  <p className="p55-note"><strong>Category separation:</strong> B10 commissioning stock is distinct from
   B11 O&amp;M tools, B13 additional consumables, C1 optional whole-unit capital spares
   and C2 two-year operating spares. MR0001 Attachment 7 expressly excludes B10 stock
   from the C2 list. Exhibit A revision mismatch and OEM SPIR remain HOLD.</p>
  {typeof onOpenSource==="function"&&<div className="p553-spare-lifecycle-actions">
    {model.commissioningSiteKits.map(x=><button key={x.sourceId} className="p553-detail-button"
     type="button" onClick={()=>onOpenSource({code:"B10",sourceId:x.sourceId,
      traceId:"B10::"+x.sourceId,sourceRowModuleId:x.sourceRowModuleId,
      sourceModuleId:x.sourceRowModuleId})}>↗ 10.2 Source {x.mr}</button>)}
   </div>}
 </details>;
}