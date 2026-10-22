import React,{useEffect,useState} from "react";
import {derivePhysicalCableEndRegister0553} from "./data/physicalCableEndRegister0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";

// Read-only *candidate functional cable ends*, not installation WIR or purchase order.
export function PhysicalCableEndRegister0553({mr="ALL",site="ALL",focusModuleId=null,placement="BOM"}){
 const model=derivePhysicalCableEndRegister0553();
 const id=placement==="RELEASE"?model.releaseModuleId:model.modelId;
 const [onlyHolds,setOnlyHolds]=useState(false);
 const rows=model.lines.filter(x=>(mr==="ALL"||x.mr===mr)&&(site==="ALL"||x.site===site)&&(!onlyHolds||!x.approvedInstallation));
 useEffect(()=>{
  if(!focusModuleId||placement!=="BOM"||typeof document==="undefined")return;
  const el=[...document.querySelectorAll("[data-component-key]")].find(
   x=>x.getAttribute("data-component-key")===focusModuleId);
  if(!el)return;
  let parent=el.parentElement;
  while(parent){if(parent.tagName==="DETAILS")parent.open=true;parent=parent.parentElement;}
  el.classList?.add("p553-module-nav-focus");
  el.scrollIntoView?.({block:"center",behavior:"smooth"});
 },[focusModuleId,mr,site,placement]);
 const fmt=x=>x===null||x===undefined?"TBD":String(x);
 return <section className="p55-panel" data-component-key={id}>
  <h4>Physical Cable-End Register — MR0001–MR0004 <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/></h4>
  <p className="p55-note"><strong>61 FUNCTION CANDIDATES / 17 MR×Location groups</strong> — source-backed prompts for
   WIR/TER takeoff only. <strong>NOT 61 verified installed cable runs</strong>.
   Cable lengths, terminated ends, selected cable SKUs, spare quantities and purchase costs remain TBD.
   The customer AFC drawings outrank the internal bidding schematic.</p>
  <p className="p55-note"><strong>MR0002 — Deviation 1.1 Rev00: OPEN.</strong> RFI Offshore BDA (+33–36 dBm output,
   60–80 dB gain); proposed RFI YBSS6 Yagi ANT-508-001 +21.100 m; proposed Omni ANT-508-002 beneath
   Lower Deck +18.300 m. Original AFC uses LNA and Mezzanine Omni. Open Deviation does not approve
   the relocated antenna, BDA/Ex mapping or measured cable lengths.</p>
  <div className="p55-source-facts">
   <div><span>MR1 / MR2 / MR3 / MR4 functional candidates</span><strong>{model.byMR["MR-0001"]} / {model.byMR["MR-0002"]} / {model.byMR["MR-0003"]} / {model.byMR["MR-0004"]}</strong></div>
   <div><span>MR0004 Adapter + Charging Kit</span><strong>1 SET / PHASE · shared</strong></div>
   <div><span>Installation cable lengths approved</span><strong>0 verified</strong></div>
   <div><span>New Working Cost / Customer Release</span><strong>THB 0 / HOLD</strong></div>
  </div>
  <label style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
   <input type="checkbox" checked={onlyHolds} onChange={e=>setOnlyHolds(e.target.checked)}/>
   Show unresolved cable-end functions
  </label>
  <div className="p55-table-wrap p553-module-scroll">
   <table className="p55-table p55-table--compact">
    <thead><tr><th>MR / Location / ID</th><th>Physical function</th><th>From → To</th>
     <th>AFC Deck → Proposed BDA Deck</th><th>Cable / Connector & Gland</th>
     <th>MGW/OEM vs ADDVALUE Owner</th><th>Qty, Cost and Approval</th></tr></thead>
    <tbody>{rows.map(e=><tr key={e.moduleId} data-component-key={placement==="RELEASE"?id+"."+e.site.toLowerCase()+"."+e.id.toLowerCase():e.moduleId}>
     <td><strong>{e.site} / {e.mr}</strong><small>{e.id}</small>
      {placement==="BOM"&&<ComponentCopyId projectId="PJ2608-0553" componentKey={e.moduleId}/>}</td>
     <td>{e.function}<small>{e.sourceClause||e.sourceDrawing}</small></td>
     <td><strong>{e.fromTag}</strong> → <strong>{e.toTag}</strong>
      <small>Final cable end count and termination pinout: TBD</small></td>
     <td>{fmt(e.afcFromDeck)} → {fmt(e.afcToDeck)}
      {e.proposedToDeck&&<small><strong>OPEN Deviation:</strong> Proposed destination {e.proposedToDeck}</small>}
      <small>{e.deviationStatus&&"Deviation 1.1: "+e.deviationStatus}</small></td>
     <td>{e.cableFamily}<small>{e.connectorGlandEvidence}</small></td>
     <td>{e.owner}<small>{e.vendorIncluded===true?"Vendor quoted package reference":"Interface / inclusion needs verification"} · {fmt(e.vendorPackageLine)}</small></td>
     <td><strong>HOLD</strong><small>Installed length {fmt(e.verifiedInstalledLengthM)} m; Purchase {fmt(e.procurementQtyM)}; Unit Rate {fmt(e.unitRateTHB)}</small>
      <small>Working THB {e.incrementalWorkingTHB} (no new booking)</small><small>{e.quantityBasis}</small></td>
    </tr>)}</tbody>
   </table>
  </div>
  <p className="p55-note"><strong>Release gate:</strong> AFC 508 TAG exceptions preserved: ZWP20 (001 Surge / 002 LNA),
   ZWP21/22 (001 LNA / 002 Surge). The proposed RFI BDA and below-Lower-Deck Omni require approved
   technical deviation, RF isolation/link calculation, equipment GA, Ex/fire compliance, WIR/TER,
   OEM inclusion review and authorized pricing before adoption. FORLLER MGW complete system remains
   the installed cable cost owner; NEK is optional ADDVALUE spare only, not duplicate installed cable.</p>
 </section>;
}
