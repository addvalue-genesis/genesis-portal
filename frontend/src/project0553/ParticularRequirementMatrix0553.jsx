import React,{useMemo,useState} from "react";
import PARTICULAR from "./data/documentParticularRequirements0553.json";
import CONFLICTS from "./data/documentParticularConflicts0553.json";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";

// Read-only evidence trace: no modification of Budgetary, supplier selections or TAG cost ledger.
const ALL="ALL";
const n=(value)=>String(value||"").toLowerCase();
const sites=["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"];
const zwp20Tags=["MR-502-001","MR-502-001A","ANT-502-001","SA-502-001","LAN-502-001","TCAB-500-001","DATO-507-001"];
function siteMatch(tags,site){
 if(site===ALL)return true;
 return tags.includes("SYSTEM")||tags.includes(site)||(site==="ZWP20"&&tags.some(t=>zwp20Tags.includes(t)));
}
export function ParticularRequirementMatrix0553({compact=false}){
 const [site,setSite]=useState("ZWP20"),[doc,setDoc]=useState(ALL),[kind,setKind]=useState(ALL);
 const [keyword,setKeyword]=useState(""),[showConflicts,setShowConflicts]=useState(true);
 const rows=useMemo(()=>PARTICULAR.records.filter(r=>{
  if(doc!==ALL&&r.document!==doc)return false;
  if(kind!==ALL&&r.type!==kind)return false;
  if(!siteMatch(r.tags,site))return false;
  const hay=[r.section,r.topic,r.requirement,r.siAction,r.costDriver,...r.tags].join(" ");
  return !keyword||n(hay).includes(n(keyword));
 }),[site,doc,kind,keyword]);
 const conflicts=useMemo(()=>CONFLICTS.records.filter(r=>siteMatch(r.tags,site)),[site]);
 const counts=Object.keys(PARTICULAR.sourceDocuments).map(d=>({doc:d,count:PARTICULAR.records.filter(r=>r.document===d).length}));
 return <section className="p55-panel" data-component-key="bid.documents.particular-requirement-matrix" style={{padding:14,marginTop:12}}>
  <h3>Particular Engineering Requirement Matrix · MR / BOD / DTS / SPE / RPT / BLD</h3>
  <p><ComponentCopyId projectId="PJ2608-0553" componentKey="bid.documents.particular-requirement-matrix"/></p>
  <p className="p55-note">Document text and notes are kept as traceable source facts; SI engineering checks are separate interpretations. Original PDF and approved revision control precedence remain authoritative. This is an incremental source extraction, NOT a completed compliance certificate, accepted design or price release.</p>
  <div className="p55-filterbar">
   <label>Site / TAG <select value={site} onChange={e=>setSite(e.target.value)}><option value={ALL}>All sites</option>{sites.map(s=><option key={s} value={s}>{s}</option>)}</select></label>
   <label>Document <select value={doc} onChange={e=>setDoc(e.target.value)}><option value={ALL}>All source documents</option>{counts.map(x=><option key={x.doc} value={x.doc}>{x.doc} ({x.count})</option>)}</select></label>
   <label>Evidence <select value={kind} onChange={e=>setKind(e.target.value)}><option value={ALL}>Clauses + Notes + Comments</option>{["CLAUSE","ATTACHMENT","REVIEW_COMMENT","DRAWING","CALCULATION"].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
   <label>Search<input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="TAG, power, NMS, tie-in, cost driver"/></label>
  </div>
  <p className="p55-note">Stored source-linked rules: {PARTICULAR.records.length}; current view: {rows.length}; cross-document conflicts at site: {conflicts.length}. {counts.map(x=>x.doc+" "+x.count).join(" · ")}.</p>
  {!compact&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Source / Ref.</th><th>Customer Particular Requirement</th><th>TAG / Site</th><th>SI First Principles &amp; Proof To Perform</th><th>Cost Driver / Status</th></tr></thead>
   <tbody>{rows.map(r=>{const source=PARTICULAR.sourceDocuments[r.document];return <tr key={r.id}>
    <td><strong>{r.document} {source.revision}</strong><small>§ {r.section} · p.{r.page}</small><small>{r.type}</small><small>{r.id}</small>{source.sourceUrl?<a href={source.sourceUrl} target="_blank" rel="noreferrer">Open original</a>:<small>{source.filename}</small>}</td>
    <td><strong>{r.topic}</strong><div>{r.requirement}</div></td>
    <td>{r.tags.join(" · ")}</td>
    <td>{r.siAction}</td>
    <td>{r.costDriver}<small>{r.decisionStatus}</small><small>Never post automatically</small></td>
   </tr>})}</tbody></table></div>}
  <details open={showConflicts} onToggle={e=>setShowConflicts(e.currentTarget.open)} style={{marginTop:12}}>
   <summary><strong>Cross-document inconsistencies / approval gates ({conflicts.length} for {site})</strong></summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Issue</th><th>Source A</th><th>Source B / Scenario</th><th>Required SI Review</th></tr></thead>
    <tbody>{conflicts.map(r=><tr key={r.id}><td><strong>{r.id}: {r.topic}</strong><small>{r.severity} · {r.resolution}</small></td>
     <td>{r.sourceA}</td><td>{r.sourceB}</td><td>{r.siDecisionGate}</td>
    </tr>)}</tbody></table></div>
  </details>
  <p className="p55-note"><strong>Cost integrity:</strong> Scope can be derived from a clause, but costs must be calculated from physical quantity, source rate, technical proof, commercial scope and ONE cost owner. No budgetary ledger is modified here.</p>
 </section>;
}
