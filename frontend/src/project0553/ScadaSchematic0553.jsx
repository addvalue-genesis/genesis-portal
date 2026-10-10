import React,{useState} from "react";
import {SCADA_LINKS_0553} from "./data/scadaLinkEvidence";
import {MR0001_SITE_CLASSIFICATION} from "./data/mr0001SiteClassification";
import {MR0001_NEXTG_LINK_RECONCILIATION} from "./data/mr0001NextGLinkReconciliation";
// Schematic topology, not geospatial scale: node placement is visual only.
// Controlled RPT links and Next G evidence; existing links outside MR0001 are not invented.
const positions={ZWP20:[85,90],ZWP22:[85,260],ZWP8:[285,170],ZWP11:[285,350],ZWP21:[480,350],ZPQ:[510,135],ZWP23:[710,135]};
export function ScadaSchematic0553({onOpenLocationBom}){
 const [selected,setSelected]=useState(null);
 const [showLabels,setShowLabels]=useState(true);
 const [overviewOpen,setOverviewOpen]=useState(true);
 const active=SCADA_LINKS_0553.find(l=>l.id===selected)||null;
 const vendor=MR0001_NEXTG_LINK_RECONCILIATION.links.find(l=>l.id===selected);
 return <section className="p55-panel">
  <section className="p55-panel">
   <div className="p55-eyebrow">FIELD OVERVIEW · REFERENCE IMAGE</div>
   <h2>Overall Field Schematic · Zawtika Phase 1F</h2>
   <p className="p55-note">ภาพรวม Phase 1A–1E (เดิม) และ Phase 1F (ใหม่) จากแผนภาพที่ให้ไว้ใน Eng Cal; ใช้เพื่อเข้าใจทั้ง Field ไม่ใช่เพื่อกำหนดระยะทาง RF หรือ BOM</p>
   <button type="button" className="p553-detail-button" onClick={()=>setOverviewOpen(x=>!x)}>{overviewOpen?"− Hide Overall":"＋ Show Overall"}</button>
   {overviewOpen&&<div style={{marginTop:12,maxWidth:1100}}>
    <img src="/assets/pj2608-0553/zawtika-phase1f-overall-original.png" alt="Field Schematic for Zawtika Phase 1F Development — overall reference" loading="lazy" style={{display:"block",width:"100%",height:"auto",border:"1px solid #c8d8e5",borderRadius:10,background:"#fff"}} onError={e=>{e.currentTarget.style.display="none";e.currentTarget.nextElementSibling.style.display="block";}}/>
    <p className="p55-note" style={{display:"none"}}>Overall image asset is not installed. Copy the supplied PNG to frontend/public/assets/pj2608-0553/zawtika-phase1f-overall-original.png.</p>
    <p className="p55-note">Unmodified original engineering schematic provided by user · NOT TO SCALE. Controlled RF links, exact distances and Engineering BOM come from the interactive model below, not from this image.</p>
   </div>}
  </section>
  <div className="p55-eyebrow" style={{marginTop:16}}>INTERACTIVE WORKING SCHEMATIC · CONTROLLED JSON</div>
  <div className="p55-eyebrow">PJ2608-0553 / SCADA RADIO / SOURCE-DRIVEN SCHEMATIC</div>
  <h2>Schematic — 5 RPT links / 7 sites</h2>
  <p className="p55-note"><strong>คลิกชื่อ Location เพื่อเปิด BOM ของ Location นั้นใน Budget → Working Preview</strong></p>
  <p className="p55-note">Topology from RPT Rev.C1 and Site classification from BLD/LAY. Schematic coordinates are for readability only; NOT geographic positions or all Zawtika field links. Blue = Phase 1F / Greenfield; grey = existing / Brownfield. Dashed paths show PTMP; solid paths show PTP.</p>
  <label><input type="checkbox" checked={showLabels} onChange={e=>setShowLabels(e.target.checked)}/> Show link distance / mode</label>
  <div style={{overflowX:"auto"}}>
   <svg viewBox="0 0 790 425" role="img" aria-label="MR0001 SCADA five-link schematic" style={{width:"100%",minWidth:590,background:"var(--p55-surface,#f7fafc)",borderRadius:12,border:"1px solid #cad7e3"}}>
    {SCADA_LINKS_0553.map(l=>{const a=positions[l.from],z=positions[l.to],midX=(a[0]+z[0])/2,midY=(a[1]+z[1])/2;return <g key={l.id}>
      <line x1={a[0]} y1={a[1]} x2={z[0]} y2={z[1]} stroke={selected===l.id?"#ea8b2f":"#62849e"} strokeWidth={selected===l.id?4:2.5} strokeDasharray={l.mode==="PTMP"?"7 5":undefined}/>
      <line x1={a[0]} y1={a[1]} x2={z[0]} y2={z[1]} stroke="transparent" strokeWidth="22" style={{cursor:"pointer"}} onClick={()=>setSelected(l.id)}/>
      {showLabels&&<g><rect x={midX-48} y={midY-12} width="96" height="23" rx="5" fill="white" stroke="#d4e1ec"/><text x={midX} y={midY+3} textAnchor="middle" fontSize="11" fill="#324e67">{l.distanceKm.toFixed(2)} km · {l.mode}</text></g>}
     </g>})}
    {Object.entries(positions).map(([site,[x,y]])=>{const group=MR0001_SITE_CLASSIFICATION.sites[site],green=group.type==="GREENFIELD";return <g key={site} onClick={()=>onOpenLocationBom?.(site)} style={{cursor:"pointer"}}>
      <rect x={x-43} y={y-23} width="86" height="46" rx="9" fill={green?"#d7ebff":"#e9eef1"} stroke={green?"#246bc3":"#6b7b88"} strokeWidth="2"/>
      <text x={x} y={y-3} textAnchor="middle" fontWeight="bold" fontSize="14" fill="#193851">{site}</text>
      <text x={x} y={y+13} textAnchor="middle" fontSize="10" fill="#4e6272">{green?"Phase 1F":"Existing"}</text>
    </g>})}
    <text x="18" y="406" fontSize="11" fill="#526b81">RPT Rev.C1 · Click a location for Working BOM · Click a link for RF details</text>
   </svg>
  </div>
  {active?<div className="p55-panel">
   <h3>{active.from} → {active.to} · {active.mode}</h3>
   <p className="p55-note">RPT: {active.distanceKm} km · {active.frequencyMHz} MHz · Tx {active.reportTxAntenna} · Rx {active.reportRxAntenna}</p>
   <p className="p55-note">Next G: {vendor?.aModel} / {vendor?.bModel} · {vendor?.aGainDbi} / {vendor?.bGainDbi} dBi · STD compliance {vendor?.stdPass===true?"PASS":vendor?.stdPass===false?"FAIL":"UNPROVEN"}</p>
  </div>:<p className="p55-note">คลิกเส้นทางเพื่อดู RPT และ Next G Technical Scenario โดยไม่ถือเป็น Manufacturer Approval</p>}
 </section>;
}
