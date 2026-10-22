import React,{useMemo,useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {ProjectWorkspaceShell} from "../common/ui/ProjectWorkspaceShell";
import {getProject0556Dataset} from "../project0556/data/repository";
import {O_G_LIFECYCLE_0556,L3_TABS_0556,L3_TAB_GROUPS_0556,TAB_IDENTITY_0556} from "../project0556/lifecycleNavigation";
import {MODULE_REGISTRY_0556} from "../project0556/moduleRegistry";
import {ARCHITECTURE_MANIFEST_0556} from "../project0556/architectureManifest";
import {CommercialWorkspace0556} from "../project0556/CommercialWorkspace0556";
import "../project0556/uiBase0556.css";
import "../project0556/project0556.css";

const data=getProject0556Dataset();
const Copy=({id})=><ComponentCopyId projectId="PJ2610-0556" componentKey={id}/>;
const Doc=({title,children})=><section className="p55-panel"><h3>{title}</h3>{children}</section>;
const GridTable=({heads,rows})=><div className="p55-table-wrap"><table className="p55-table p55-table--compact">
 <thead><tr>{heads.map(h=><th key={h}>{h}</th>)}</tr></thead>
 <tbody>{rows.map((r,i)=><tr key={i}>{r.map((x,j)=><td key={j}>{x===null||x===undefined?"NOT ESTABLISHED":x}</td>)}</tr>)}</tbody>
 </table></div>;
const moduleLabels={
 overview:"Project Overview",engineering:"Engineering / First Principles",architecture:"Architecture / Module Registry",
 systems:"Requirements / TOR Intelligence",schematic:"Microwave Link Schematic",execution:"Execution & Delivery",
 documents:"Vendor / Evidence",risk:"Risk & Controls",registry:"Data / Code Registry",budget:"Budget Workspace"
};
export function PJ26080556() {
 const [workspaceTab,setWorkspaceTab]=useState("overview");
 const [stage,setStage]=useState("L3");
 const [area,setArea]=useState("B");
 const [query,setQuery]=useState("");
 const [navTarget,setNavTarget]=useState(null);
 const [navSequence,setNavSequence]=useState(0);
 const [selectedSite,setSelectedSite]=useState("ALL");
 const modules=useMemo(()=>MODULE_REGISTRY_0556.map(m=>({...m,tab:m.route||"budget"})),[]);
 const find=useMemo(()=>modules.filter(m=>!query.trim()||(m.id+" "+m.title+" "+m.semanticCode).toLowerCase().includes(query.replace(/^PJ2610-0556\s*\/\s*/i,"").toLowerCase().trim())),[modules,query]);
 const jump=m=>{setStage("L3");setArea("B");setWorkspaceTab(m.tab);setNavTarget(m.id);setNavSequence(s=>s+1);};
 const identity={id:data.projectId,shortName:data.project.shortName,title:data.projectName+" · 60-Month Managed Microwave Rental",state:"WORKING / RELEASE HOLD",statusDetail:"GREA isolated UI · Budgetary not priced",method:ARCHITECTURE_MANIFEST_0556.governingMethod};
 const tabs=L3_TABS_0556.map(([id,label])=>({id,label:TAB_IDENTITY_0556.tabs.find(t=>t.route===id).semanticCode+" · "+label}));
 const lifecycle=O_G_LIFECYCLE_0556.find(x=>x.id===stage);
 const lifecycleHead=<section className="p55-section" style={{padding:"12px 16px",marginBottom:14}}>
  <label htmlFor="p556-lifecycle" style={{fontWeight:700,display:"block",marginBottom:8}}>O&amp;G PROJECT LIFECYCLE — Master stage</label>
  <select id="p556-lifecycle" value={stage} onChange={e=>setStage(e.target.value)} style={{maxWidth:620,width:"100%",padding:10,fontSize:15}}>
   {O_G_LIFECYCLE_0556.map(s=><option key={s.id} value={s.id}>{s.id} — {s.title}{s.id==="L3"?" · CURRENT":""}</option>)}
  </select>
  <p>{lifecycle.title} · {lifecycle.state} · APP–AMA managed microwave rental / 60 months</p>
  {stage==="L3"&&<div role="group" aria-label="L3 work areas" style={{display:"flex",gap:10,flexWrap:"wrap"}}>
   {[["A","A — Original / Received Documents"],["B","B — Internal Engineering & Bid Preparation"],["C","C — Communications & Submissions"]].map(([key,title])=>
    <button type="button" key={key} className="p556-detail-button" aria-pressed={area===key} onClick={()=>setArea(key)}>{title}</button>)}
  </div>}
 </section>;
 const section=()=>{
 if(workspaceTab==="budget")return <CommercialWorkspace0556 navigationTarget={navTarget} navigationSequence={navSequence}/>;
 if(workspaceTab==="overview")return <div className="p55-stack"><Doc title="01 Executive & Project Governance">
  <p><strong>PJ2610-0556 / APP–AMA.</strong> PTTEP offshore 2+0 XPIC + ASD microwave service. Term: 60 months. Source: draft TOR, not a price or approved engineering design.</p>
  <div className="p55-metric-grid">{[["Sites","2"],["Path","~40 km"],["CIR","≥80 Mbps"],["Availability","99.995%"],["Rental","60 months"]].map(([a,b])=><div key={a}><strong>{a}</strong><p>{b}</p></div>)}</div>
  <Copy id="bid.overview"/>
 </Doc><Doc title="Project Milestones">
  <GridTable heads={["Milestone","Tentative Date","Authority"]} rows={data.milestones.map(x=>[x.name,x.date,"DRAFT TOR — VERIFY"])}/>
 </Doc></div>;
 if(workspaceTab==="engineering")return <div className="p55-stack"><Doc title="02 First Principles & Methodology"><Copy id="bid.engineering"/>
  <p>Requirement → RF constraint → Engineering proof → Physical function → Required BOM → Service WBS → Project-specific cost.</p>
  <GridTable heads={["Engineering Gate","Current State","Comment"]} rows={[
   ["Path profile / Fresnel / clearance","OPEN","Survey and elevation datum required"],
   ["Frequency / 2+0 XPIC / ASD","OPEN","Licensed frequency and OEM architecture"],
   ["ITU-R P.530 availability / offshore multipath","OPEN","Full prediction, not free-space alone"],
   ["Fade margin / 80 Mbps throughput","OPEN","OEM radio/modulation and interference evidence"],
   ["FAT / SAT / SLA verification","OPEN","Approved test procedure and 24/72-hour burn-in clarification"]]}/>
 </Doc></div>;
 if(workspaceTab==="architecture")return <Doc title="03 System & Process Architecture"><Copy id="bid.architecture"/>
  <p>{ARCHITECTURE_MANIFEST_0556.architecture}</p>
  <GridTable heads={["Layer","Policy"]} rows={[
   ["COMMON UI","Reuse visual contract without 0553 data"],
   ["PARTICULAR DATA","Only PJ2610-0556 controlled JSON"],
   ["ENGINEERING","RF proof and TOR compliance independent of vendor catalogue"],
   ["PRICING","60-month life cycle and working/budget/release"],
   ["GOVERNANCE","Cross-project imports and release mutation prohibited"]]}/>
 </Doc>;
 if(workspaceTab==="systems")return <div className="p55-stack"><Doc title="04 PTP Requirements & Document Intelligence"><Copy id="bid.systems"/>
   <label>Location filter <select value={selectedSite} onChange={e=>setSelectedSite(e.target.value)}>
    <option value="ALL">ALL SITES</option>{data.sites.map(s=><option key={s.id}>{s.id}</option>)}</select></label>
   <GridTable heads={["Site","Antenna elevation","Basis / Gate"]} rows={data.sites.filter(x=>selectedSite==="ALL"||x.id===selectedSite).map(x=>[x.id,x.elevationM.join(", ")+" m","AGL / ASL source conflict — OPEN"])}/>
   <GridTable heads={["Requirement ID","Area","Source requirement","Required","State"]} rows={data.requirements.map(r=>[r.id,r.area,r.description,r.required,"TOR_ONLY / UNVERIFIED"])}/>
  </Doc></div>;
 if(workspaceTab==="schematic")return <Doc title="05.3 Microwave Link & System Drawings"><Copy id="bid.schematic"/>
  <div className="p556-link-diagram" role="img" aria-label="APP to AMA approximate 40 kilometer point to point microwave topology">
   <div>APP <small>70 m · datum OPEN</small></div><div>↔ 2+0 XPIC + ASD ↔<small>Approx. 40 km · Frequency OPEN</small></div><div>AMA <small>30 / 25 m · datum OPEN</small></div>
  </div>
  <p className="p55-note">Conceptual topology only. Not an approved path profile, antenna layout or construction schematic.</p>
 </Doc>;
 if(workspaceTab==="execution")return <Doc title="06 Execution & Resource Planning"><Copy id="bid.execution"/>
  <GridTable heads={["Workstream","Deliverable / Gate","State"]} rows={[
   ["Detailed design","Profile, link budget, IP/VLAN/QoS and drawings","OPEN"],
   ["Regulatory","Frequency, apparatus, import and operating licenses","OPEN"],
   ["FAT","Procedure, punch closeout before shipment to PSB Songkhla","OPEN"],
   ["Site works / SAT","APP + AMA installation and throughput/latency tests","OPEN"],
   ["Operations","24x7 NOC, annual PM, monthly reports, service restoration","OPEN"],
   ["End of service","Decommission within 30 days after notice","OPEN"]]}/>
 </Doc>;
 if(workspaceTab==="documents")return <Doc title="07 Vendor & Technical Evidence"><Copy id="bid.documents"/>
  <GridTable heads={["Source ID","Evidence","State"]} rows={[
   [data.source.id,<a href={data.source.url} target="_blank" rel="noreferrer">{data.source.filename}</a>,"DRAFT_TOR"],
   ["VENDOR-OFFER-0556","No controlled APP–AMA OEM offer","OPEN"],
   ["LICENSE-0556","Frequency/license proof","OPEN"],
   ["CUSTOMER-COMMERCIAL-0556","Commercial RFQ / scope schedule","OPEN"]]}/>
 </Doc>;
 if(workspaceTab==="risk")return <Doc title="08 Risk, Assumptions & Change"><Copy id="bid.risk"/>
  <GridTable heads={["Issue","TOR placeholder / conflict","Resolution"]} rows={data.openItems.map(x=>[x.id+" — "+x.issue,x.source,"OPEN_INPUT"])}/>
 </Doc>;
 if(workspaceTab==="registry")return <Doc title="09 Data, Code & Traceability"><Copy id="bid.registry"/>
  <GridTable heads={["Module ID","Semantic ID","State"]} rows={modules.map(m=>[
   <Copy id={m.id}/>,m.semanticCode||m.number,m.status])}/>
 </Doc>;
 return null;
 };
 return <ProjectWorkspaceShell project={identity} tabs={area==="B"?tabs:[]} tabGroups={area==="B"?L3_TAB_GROUPS_0556:[]} className="p556-dashboard" activeTab={workspaceTab} onTabChange={setWorkspaceTab}
 renderContent={()=> <>{lifecycleHead}
  {stage!=="L3"?<Doc title={lifecycle.title}>Future lifecycle stage · Current project remains in controlled Tendering &amp; Bidding.</Doc>:
   area==="A"?<Doc title="L3.A — Original / Received Documents"><Copy id="l3.original"/><p>Draft source held in immutable 00_NATIVE_ORIGINAL / SHAREPOINT.</p>
     <a href={data.source.url} target="_blank" rel="noreferrer">{data.source.filename}</a></Doc>:
   area==="C"?<Doc title="L3.C — Communications & Submissions"><Copy id="l3.submissions"/><p>No verified issued proposal or customer submission. STATUS: HOLD.</p></Doc>:
   <div className="p55-stack">
    <section className="p55-panel" style={{padding:14}}>
     <h3>ค้นหา Module ทั้งโครงการ / Project Module Navigator</h3>
     <p className="p55-note">Search Module ID, press Enter or click the desired module. Exact parent modules open in Budget.</p>
     <div className="p55-filterbar"><label>Search Module <input value={query} onChange={e=>setQuery(e.target.value)}
      onKeyDown={e=>{if(e.key==="Enter"&&find[0])jump(find[0]);}} placeholder="เช่น bid.budget.working.bc"/></label>
      <button type="button" onClick={()=>setQuery("")}>Clear</button></div>
     <div style={{display:"flex",flexWrap:"wrap",gap:8,maxHeight:query?320:145,overflowY:"auto"}}>
      {find.map(x=><button type="button" key={x.id} className="p556-detail-button" onClick={()=>jump(x)}>
       <strong>{x.title}</strong><small style={{display:"block"}}>{x.id} · Open Module ({x.tab})</small></button>)}
      {!find.length&&<p role="status">Module not found</p>}
     </div>
    </section>
    <Doc title="Current Module / Copy ID"><Copy id={"bid."+workspaceTab}/></Doc>
    {section()}
   </div>}
 </>}/>;
}
