import React,{useMemo,useState} from "react";
import PARTICULAR from "./data/documentParticularRequirements0553.json";
import CONFLICTS from "./data/documentParticularConflicts0553.json";
import CONTINUE_POLICY from "./data/siProceedWithQualifications0553.json";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {SmartFilterBar,SmartDataGroup,moduleSegment} from "../common/ui/SmartDataExplorer";

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
 const decisions=CONTINUE_POLICY.workingDecisions.filter(x=>site===ALL||x.scope.includes(site)||x.id==="WD-NMS-ZPQ");
 const counts=Object.keys(PARTICULAR.sourceDocuments).map(d=>({doc:d,count:PARTICULAR.records.filter(r=>r.document===d).length}));
 const groupedRows=useMemo(()=>Object.keys(PARTICULAR.sourceDocuments).map(name=>({
  name,items:rows.filter(r=>r.document===name)
 })).filter(group=>group.items.length),[rows]);
 const resetFilters=()=>{setSite("ZWP20");setDoc(ALL);setKind(ALL);setKeyword("");};

 return <section className="p55-panel" data-component-key="bid.documents.particular-requirement-matrix" style={{padding:14,marginTop:12}}>
  <h3>Particular Engineering Requirement Matrix · MR / BOD / DTS / SPE / RPT / BLD</h3>
  <p><ComponentCopyId projectId="PJ2608-0553" componentKey="bid.documents.particular-requirement-matrix"/></p>
  <p className="p55-note">Document text and notes are kept as traceable source facts; SI engineering checks are separate interpretations. Original PDF and approved revision control precedence remain authoritative. This is an incremental source extraction, NOT a completed compliance certificate, accepted design or price release.</p>
  <SmartFilterBar projectId="PJ2608-0553" moduleKey="bid.documents.particular-requirement-matrix.filters"
   title="Search · Filter by Site / Document / Evidence"
   total={PARTICULAR.records.length} shown={rows.length} onReset={resetFilters}
   controls={[
    {key:"site",label:"Site / TAG",type:"select",value:site,onChange:setSite,
     options:[{value:ALL,label:"All sites"},...sites.map(s=>({value:s,label:s}))]},
    {key:"doc",label:"Document",type:"select",value:doc,onChange:setDoc,
     options:[{value:ALL,label:"All source documents"},...counts.map(x=>({value:x.doc,label:x.doc+" ("+x.count+")"}))]},
    {key:"kind",label:"Evidence",type:"select",value:kind,onChange:setKind,
     options:[{value:ALL,label:"Clauses + Notes + Comments"},...["CLAUSE","ATTACHMENT","REVIEW_COMMENT","DRAWING","CALCULATION"].map(x=>({value:x,label:x}))]},
    {key:"q",label:"Search",type:"search",value:keyword,onChange:setKeyword,
     placeholder:"TAG, power, NMS, tie-in, cost driver"}
   ]}/>
  <p className="p55-note">Source documents: {counts.map(x=>x.doc+" "+x.count).join(" · ")}. Cross-document review gates: {conflicts.length} at selected site.</p>
  {!compact&&groupedRows.map(group=><SmartDataGroup key={group.name} projectId="PJ2608-0553"
   moduleKey={"bid.documents.particular-requirement-matrix.document."+moduleSegment(group.name)}
   title={group.name+" "+PARTICULAR.sourceDocuments[group.name].revision} count={group.items.length}
   defaultOpen={doc===group.name||(doc===ALL&&group.name==="MR")}>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Source / Ref.</th><th>Customer Particular Requirement</th><th>TAG / Site</th><th>SI First Principles &amp; Proof To Perform</th><th>Cost Driver / Status</th></tr></thead>
   <tbody>{group.items.map(r=>{const source=PARTICULAR.sourceDocuments[r.document];return <tr key={r.id}>
    <td><strong>{r.document} {source.revision}</strong><small>§ {r.section} · p.{r.page}</small><small>{r.type}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.documents.particular-requirement-matrix.rule."+moduleSegment(r.id)}/>{source.sourceUrl?<a href={source.sourceUrl} target="_blank" rel="noreferrer">Open original</a>:<small>{source.filename}</small>}</td>
    <td><strong>{r.topic}</strong><div>{r.requirement}</div></td>
    <td>{r.tags.join(" · ")}</td><td>{r.siAction}</td>
    <td>{r.costDriver}<small>{r.decisionStatus}</small><small>Never post automatically</small></td>
   </tr>})}</tbody></table></div>
  </SmartDataGroup>)}
  {!rows.length&&<p role="status" className="p55-note">No matching requirement. Reset filters or broaden the search.</p>}
  <details open className="p55-panel" data-component-key="bid.documents.si-proceed-decisions" style={{padding:12,marginTop:12}}>
   <summary><strong>SI Working Decisions — Proceed with Qualifications ({decisions.length})</strong></summary>
   <p className="p55-note">Submitted deviation history is reported by ADDVALUE and must be cross-referenced to the original register; this page does not reissue deviations, assume their acceptance, or stop budgetary work.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Working Decision</th><th>Accepted Internal Budgetary Basis</th><th>Proof / Change Trigger</th><th>Commercial Treatment</th></tr></thead><tbody>
    {decisions.map(d=><tr key={d.id}><td><strong>{d.id}</strong><small>{d.scope}</small><small>{d.state}</small></td><td>{d.offerBasis}</td><td>{d.engineeringProof.join(" · ")}<small>{d.changeTrigger||d.mrTagChange||""}</small></td><td>{d.commercialTreatment}<small>{d.externalDeviationLink}</small></td></tr>)}
   </tbody></table></div>
   <p className="p55-note"><strong>Customer Template:</strong> Part C = C1 Capital Spares / C2 Two-year Operation Spares. NMS commercial qualification is a separate proposal remark or existing deviation, never Part C spares. Part B in this template is B1–B14, with different semantics from internal CBS group names.</p>
  </details>
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
