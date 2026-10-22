import React,{useState,useEffect} from "react";
import {deriveBulkSourceToReleaseTrace0553} from "./data/bulkSourceToReleaseTrace0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";

// Read-only source → engineering BULK → working ledger → customer Release gate.
// This view never changes Canonical BOM, quoted-cost owner or customer price.
export function BulkSourceToReleaseAudit0553({releaseModel=null,placement="BOM",mr="ALL",site="ALL",focusModuleId=null}){
 const model=deriveBulkSourceToReleaseTrace0553({releaseModel});
 const [opened,setOpened]=useState({});
 const rows=model.groups.filter(x=>(mr==="ALL"||x.mr===mr)&&(site==="ALL"||x.site===site));
 const id=placement==="RELEASE"?model.releaseModuleId:model.moduleId;
 // Page-level module navigator selects MR+site upstream. Expand the exact source
 // row here without altering any canonical costing or customer release.
 useEffect(()=>{
  if(!focusModuleId||placement!=="BOM")return;
  const match=rows.find(x=>x.moduleId===focusModuleId||x.moduleId+".requirements"===focusModuleId);
  if(match)setOpened(prev=>prev[match.id]?prev:{...prev,[match.id]:true});
 },[focusModuleId,placement,mr,site]);
 useEffect(()=>{
  if(!focusModuleId||placement!=="BOM"||typeof document==="undefined")return;
  const target=[...document.querySelectorAll("[data-component-key]")].find(
   x=>x.getAttribute("data-component-key")===focusModuleId);
  if(!target)return;
  let p=target.parentElement;
  while(p){if(p.tagName==="DETAILS")p.open=true;p=p.parentElement;}
  target.classList?.add("p553-module-nav-focus");
  target.scrollIntoView?.({behavior:"smooth",block:"center"});
 },[focusModuleId,opened,placement,mr,site]);
 const toggle=k=>setOpened(p=>({...p,[k]:!p[k]}));
 const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"PENDING";
 return <section className="p55-panel" data-component-key={id}>
  <h4>Source → Engineering BULK → Working BOM → Release · Completeness Audit
    {" "}<ComponentCopyId projectId="PJ2608-0553" componentKey={id}/></h4>
  <p className="p55-note"><strong>Controlled scope:</strong> MR0001 7 original MTO lots; MR0002 3 bulk lots;
   MR0003 4 phone/sounder systems with conditional special cable (NOT fictitious lots);
   MR0004 3 RACON sites with ONE shared phase adapter/charging kit.
   <strong> SOURCE-TO-RELEASE HOLD</strong> until cable end takeoff, OEM inclusions, vendor quotation,
   IEC/Ex/Fire evidence, and price/cost ledger owner are resolved.</p>
  <div className="p55-source-facts">
   <div><span>MR × Location scope slots</span><strong>{model.scopeSlots}</strong></div>
   <div><span>Applicable site/system pairs</span><strong>{model.applicable}</strong></div>
   <div><span>MR0001 partial A5 working-source cost</span><strong>{money(model.originalA5PartialTHB)}</strong></div>
   <div><span>New BULK cost posted / release change</span><strong>THB 0 / NONE</strong></div>
  </div>
  <div className="p55-table-wrap p553-module-scroll">
   <table className="p55-table p55-table--compact">
    <thead><tr><th>+/−</th><th>Location / MR</th><th>Source / original MTO Row</th>
     <th>Required BULK functions</th><th>Current Working Source</th><th>Customer mapping</th><th>Readiness</th></tr></thead>
    <tbody>{rows.map(r=>{
     const open=!!opened[r.id];
     return <React.Fragment key={r.id}>
      <tr data-component-key={placement==="RELEASE"?id+"."+r.site.toLowerCase()+"."+r.mr.toLowerCase().replace("-",""):r.moduleId}>
       <td><button className="p55-row-toggle" type="button" aria-expanded={open} onClick={()=>toggle(r.id)}>{open?"−":"+"}</button></td>
       <td><strong>{r.site} / {r.mr}</strong><ComponentCopyId projectId="PJ2608-0553" componentKey={placement==="RELEASE"?id+"."+r.site.toLowerCase()+"."+r.mr.toLowerCase().replace("-",""):r.moduleId}/></td>
       <td><strong>{r.sourceMtoRow!==null?"MTO Row "+r.sourceMtoRow:r.sourceAuthority}</strong>
        <small>{r.sourceDocument} · {r.sourceRevision}</small>
        <small>{r.sourceLotQty===1?"1 Lot / site":r.mr0003SystemQty===1?"1 System / site":r.mr0004PhaseSharedQty===1?"1 shared adapter/charging kit per PHASE (not per site)":"Review source"}</small></td>
       <td>{r.itemCount} registered functions<small>{r.requiredFunctionCount} minimum control identities traced</small></td>
       <td>{r.knownSourceFloorTHB!==null?money(r.knownSourceFloorTHB)+" (partial, included)":r.countedWorkingLines+" counted equipment lines (not new BULK)"}
        <small>{r.sourcePriceClass}</small></td>
       <td><strong>{r.customerLine}</strong><small>10.3 reads 10.1 source</small>
        <small>{r.mr==="MR-0001"?"A5 reclassification only; never post twice":"MGW/OEM bundle first; no extra BULK posting"}</small></td>
       <td><strong>HOLD</strong><small>{r.openMaterialEvidenceCount} unapproved material/evidence items</small></td>
      </tr>
      {open&&<tr data-component-key={placement==="RELEASE"?id+"."+r.site.toLowerCase()+"."+r.mr.toLowerCase().replace("-","")+".requirements":r.moduleId+".requirements"}><td colSpan={7}>
       <p><strong>Requirement:</strong> {r.sourceRequirement}</p>
       {r.sourceMtoDescription&&<p><strong>Original MTO description:</strong> {r.sourceMtoDescription}</p>}
       <p><strong>Engineering and technical HOLD:</strong> {r.openEvidenceGates.join(" · ")}</p>
       <p><strong>Source:</strong> {r.sourceUrl?<a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">{r.sourceDocument}</a>:r.sourceDocument} |
        {" "}BOM <ComponentCopyId projectId="PJ2608-0553" componentKey={r.sourceModuleId}/></p>
       <p><strong>Source-to-release:</strong> 10.1 Engineering BOM → A1–A4 canonical Working Cost
        {r.mr==="MR-0001"?" with A5 partial reclassification":""} → 10.3 Read-only Release Preview → 10.5 Scope.
        No independent selling-price mutation or quote issuance.</p>
      </td></tr>}
     </React.Fragment>
    })}</tbody>
   </table>
  </div>
  <p className="p55-note"><strong>Price and source governance:</strong> 69m CAT6A × THB524 plus one M20 gland
   × THB1020 per MR0001 location are *historical source working-cost components*; they are NOT verified installed material quantities.
   FORLLER is MGW MR0002 complete-system supply; NEK spare is conditional/not booked.
   MR0004 phase kit is exactly one requirement across all three WPs; check MGW quotation/B11 before pricing.</p>
  {placement==="RELEASE"&&<p className="p55-note"><strong>Customer release remains HOLD:</strong> this coverage matrix exposes
   incomplete BULK engineering. Any numeric A/B/C shown in Release Preview comes from the existing
   Working source, not from this audit; no validated complete supply cost is asserted.</p>}
 </section>;
}
