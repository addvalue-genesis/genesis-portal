import React, { useMemo, useState } from "react";
import { PROJECT_0553_FACTS } from "../project0553/projectFacts";
import { PROJECT_0553_EVIDENCE, TECHNICAL_HOLDS } from "../project0553/evidenceRegistry";
import { BID_0553_SOURCES, BID_0553_GATES, validateBidReview } from "../project0553/bidReview";
import "../project0550/project0550.css"; // Reuse existing 0550 presentation primitives, never project facts.
import "../project0553/project0553.css";

const TABS = [
  ["overview","Executive"],["architecture","Architecture"],["systems","4 MR Systems"],
  ["engineering","First Principles"],["execution","Execution"],["budget","Budget"],
  ["risk","Risk & Controls"],["documents","Evidence"]
];
const Badge = ({children}) => {
  const v=String(children).toUpperCase();
  const tone = /HOLD|FAIL|CONFLICT|BLOCK|NOT SEND/.test(v)?"danger":/OPEN|REVIEW|PREPARED|TBC/.test(v)?"warn":"neutral";
  return <span className={"p55-badge p55-badge--"+tone}>{children}</span>;
};
const Metric = ({label,value,sub}) => <div className="p55-metric"><div className="p55-metric__label">{label}</div><div className="p55-metric__value">{value}</div><div className="p55-metric__sub">{sub}</div></div>;
const Table = ({headers,rows}) => <div className="p55-table-wrap"><table className="p55-table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div>;
const sourceLinks = ids => ids.map(id => {
  const s=BID_0553_SOURCES.find(x=>x.id===id);
  return s?<a key={id} href={s.url} target="_blank" rel="noreferrer" style={{display:"block"}}>{id}</a>:id;
});
const Section = ({title,children,subtitle}) => <section className="p55-panel"><div className="p55-panel__head"><div><h3>{title}</h3>{subtitle&&<p className="p55-note">{subtitle}</p>}</div></div>{children}</section>;

export function PJ26080553() {
 const [tab,setTab]=useState("overview");
 const [opened,setOpened]=useState(null);
 const [selectedMr,setSelectedMr]=useState("ALL");
 const p=PROJECT_0553_FACTS;
 const visibleGates=useMemo(()=>BID_0553_GATES.filter(g=>selectedMr==="ALL"||g.system==="ALL"||g.system===selectedMr),[selectedMr]);
 const blocked=BID_0553_GATES.filter(g=>g.status!=="CLOSED_VERIFIED").length;
 const systemTable=<Table headers={["MR","System","Current evidence state","Technical review"]} rows={p.systems.map(s=>[
  s.mr,<strong>{s.name}</strong>,<Badge key={s.id}>{s.status}</Badge>,<button key={"b"+s.id} className="p553-detail-button" onClick={()=>setOpened(opened===s.mr?null:s.mr)}>{opened===s.mr?"− Hide":"＋ Detail"}</button>
 ])}/>;
 return <div className="p55 p553-dashboard">
   <header className="p55-hero">
     <div className="p55-hero__top"><div>
       <div className="p55-kicker">GENESS / TPP · INTERNAL PROJECT CONTROL · NOT CUSTOMER RELEASE</div>
       <h1>PJ2608-0553 <span>Zawtika Phase 1F Telecom</span></h1>
       <p>JUTAL · {p.packageId} · Technical UNPRICED / Priced Commercial Bid</p>
     </div><div className="p55-hero__status"><Badge>WORKING REVIEW REV01 / RELEASE HOLD</Badge><span>Closing amendment verification OPEN</span></div></div>
     <div className="p55-hero__method"><span>METHOD</span> First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model + Evidence Control</div>
     <nav className="p55-tabs" aria-label="0553 workspace sections">{TABS.map(([id,name])=><button key={id} className={tab===id?"is-active":""} onClick={()=>setTab(id)}>{name}</button>)}</nav>
   </header>
   <main className="p55-main">
   {tab==="overview"&&<div className="p55-stack">
     <div className="p55-section-title"><div><div className="p55-eyebrow">MANAGEMENT VIEW</div><h2>Project control spine</h2><p>0553 controlled bid inputs, deliverable gates and technical-commercial evidence. No 0550 quantities or pricing inherited.</p></div></div>
     <div className="p553-alerts"><div className="p553-alert"><strong>Customer release — HOLD</strong><p>Original Instruction to Bidder and later tender update disagree. Confirm authorized closing/submission instruction before release.</p></div><div className="p553-alert"><strong>Bid preparation — ACTIVE</strong><p>MTO Rev04, SAMTEL TC 05-Oct and CCL Rev04 located; all four MRs require trace and quote reconciliation.</p></div></div>
     <div className="p55-metric-grid">
       <Metric label="Systems" value={p.systems.length} sub="MR0001–MR0004, 0553 only"/>
       <Metric label="Bid release" value="HOLD" sub="No customer submission approved"/>
       <Metric label="Review gates" value={BID_0553_GATES.length} sub="Tracked bid readiness issues"/>
       <Metric label="Gates outstanding" value={blocked} sub="OPEN / HOLD / CONFLICT"/>
       <Metric label="Commercial" value="HOLD" sub="Priced proposal not authorized"/>
       <Metric label="Deadline" value="VERIFY" sub="14 Oct working input; amendment OPEN"/>
     </div>
     <div className="p55-grid p55-grid--2"><Section title="First Principles → Constraint → Proof → Quantity → Cost">
       <div className="p553-methodchain">{["Source / Evidence","Requirement","Constraint","CAL / RPT","Quantity / MTO","Work / Rate","Commercial"].map((x,i)=><React.Fragment key={x}>{i>0&&<span>→</span>}<strong>{x}</strong></React.Fragment>)}</div>
       <p className="p55-note">Equations and presentation patterns are shared; all source facts remain project-particular 0553.</p>
     </Section><Section title="Bid packages / release controls"><Table headers={["Package","Working status"]} rows={p.bidControl.requiredPackages.map(x=>[x,<Badge key={x}>REVIEW OPEN</Badge>])}/></Section></div>
     <Section title="Critical bid issues"><Table headers={["ID","Review issue","State"]} rows={BID_0553_GATES.filter(g=>g.priority==="P0").map(g=>[g.id,<strong key={g.id}>{g.title}</strong>,<Badge key={g.status}>{g.status}</Badge>])}/></Section>
   </div>}
   {tab==="architecture"&&<Section title="GENESS/TPP Architecture — controlled 0553 binding"><div className="p553-methodchain">{["COMMON KNOWLEDGE","GENERIC ENGINEERING","PJ2608-0553 PARTICULAR","EVIDENCE / MR","CAL / PROOF","MTO / WBS","A/B/C COST","RELEASE GATE"].map(x=><strong key={x}>{x}</strong>)}</div><p className="p55-note">{p.isolationRule}</p><p className="p55-note">Current data is Git-versioned registry + stable 0553 bindings. No direct imports from 0550 project data.</p></Section>}
   {tab==="systems"&&<div className="p55-stack"><div className="p55-section-title"><div><div className="p55-eyebrow">PARTICULAR PROJECT</div><h2>Four MR Telecom Systems</h2><p>Source-backed grouping; equipment-level quantities remain subject to Rev04 MTO reconciliation.</p></div></div><Section title="MR Registry">{systemTable}{opened&&<div className="p553-detail"><strong>{opened} — Active review points</strong><Table headers={["Gate","Technical issue","State"]} rows={BID_0553_GATES.filter(g=>g.system===opened).map(g=>[g.id,g.detail,<Badge key={g.id}>{g.status}</Badge>])}/></div>}</Section></div>}
   {tab==="engineering"&&<div className="p55-stack"><Section title="Engineering proof and compliance HOLDs" subtitle="Do not equate document mapping with compliance."><Table headers={["ID","MR","Engineering issue","State"]} rows={TECHNICAL_HOLDS.map(h=>[h.id,h.system,h.issue,<Badge key={h.id}>{h.state}</Badge>])}/></Section><Section title="Requirement → Variable → Proof Control"><p>No automatically confirmed design values. Reconcile the four MRs with MTO Rev04, latest TC and vendor datasheets before selecting models and issuing proof.</p></Section></div>}
   {tab==="execution"&&<div className="p55-stack"><Section title="Execution and Delivery Basis"><Table headers={["Activity","Status / Required action"]} rows={[["Engineering & VDRL","Check MR-specific documents and review cycles"],["FAT / Inspection","Confirm approved test matrix, vendor factory and witnessed scope"],["Logistics / Import / Licences","Reconcile DAP Nonthaburi with CIF Zhuhai proposal and authority-processing exclusions"],["SAT / Commissioning","Verify responsibilities, test sites, crew, POB and rates"],["Spares / Special tools","Match inventory, quotation and validity"]].map(x=>x)}/></Section></div>}
   {tab==="budget"&&<div className="p55-stack"><Section title="Part A / B / C — Internal cost versus customer selling price" subtitle="Price records are not released to customer from this workspace."><Table headers={["Group","Contents","Cost status","Sell price status"]} rows={[["A","Equipment and vendor packages"],["B","Engineering, documents, FAT/SAT, logistics, spares and services"],["C","Any separately scoped installation / options only when RFQ confirms"]].map(r=>[...r,<Badge key={r[0]+"c"}>RECONCILIATION OPEN</Badge>,<Badge key={r[0]+"s"}>HOLD</Badge>])}/><p className="p55-note">Rev09 INTERNAL is an estimating source, not a confirmed, itemized or balanced customer offer. No invented zero/balancing lines.</p></Section></div>}
   {tab==="risk"&&<div className="p55-stack"><Section title="Bid Readiness — source-linked audit"><div className="p553-filters"><label>System / MR <select value={selectedMr} onChange={e=>setSelectedMr(e.target.value)}><option value="ALL">ALL</option>{p.systems.map(s=><option key={s.id} value={s.mr}>{s.mr}</option>)}</select></label><Badge>{visibleGates.length} relevant gates</Badge></div><Table headers={["ID","Priority","Scope","Action / control","State","Source"]} rows={visibleGates.map(g=>[g.id,g.priority,g.system,<div key={g.id}><strong>{g.title}</strong><small>{g.detail}</small></div>,<Badge key={g.id}>{g.status}</Badge>,sourceLinks(g.sources)])}/><p className="p55-note">Release allowed: {validateBidReview().releaseAllowed?"YES":"NO — outstanding evidence and approvals"}.</p></Section></div>}
   {tab==="documents"&&<div className="p55-stack"><Section title="0553 Source Register"><Table headers={["ID","Document / location","Revision","Control state","Meaning"]} rows={BID_0553_SOURCES.map(s=>[s.id,<a key={s.id} href={s.url} target="_blank" rel="noreferrer">{s.name}</a>,s.revision,<Badge key={s.id}>{s.status}</Badge>,s.note])}/></Section><Section title="Evidence classification"><Table headers={["Evidence","Revision","State"]} rows={PROJECT_0553_EVIDENCE.map(e=>[e.title,e.revision,<Badge key={e.id}>{e.state}</Badge>])}/></Section></div>}
   </main>
 </div>;
}
