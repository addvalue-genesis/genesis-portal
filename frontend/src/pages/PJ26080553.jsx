import { CommercialWorkspace0553 } from "../project0553/CommercialWorkspace";
import React, { useMemo, useState } from "react";
import { ProjectWorkspaceShell } from "../common/ui/ProjectWorkspaceShell";
import { ArchitectureView as SharedArchitectureView } from "../common/ui/ArchitectureView";
import { ARCHITECTURE_MANIFEST_0553 } from "../project0553/architectureManifest";
import { MODULE_REGISTRY_0553 } from "../project0553/moduleRegistry";
import { ExecutiveView } from "../common/ui/ExecutiveView";
import { MR0001RFProofPilot } from "../project0553/MR0001RFProofPilot";
import { ScadaSchematic0553 } from "../project0553/ScadaSchematic0553";
import { MR0002LNACalculation } from "../project0553/MR0002LNACalculation";
import { MR0002PhysicalBom } from "../project0553/MR0002PhysicalBom";
import { EngineeringView as SharedEngineeringView } from "../common/ui/EngineeringView";
import { ENGINEERING_VIEW_MODEL_0553 } from "../project0553/engineeringViewModel";
import { EXECUTIVE_0553 } from "../project0553/executiveViewModel";
import { SystemsView as SharedSystemsView } from "../common/ui/SystemsView";
import { SYSTEMS_0553, SYSTEM_GROUPS_0553 } from "../project0553/systemsBinding";
import { PROJECT_0553_FACTS } from "../project0553/projectFacts";
import { PROJECT_0553_EVIDENCE, TECHNICAL_HOLDS } from "../project0553/evidenceRegistry";
import { BID_0553_SOURCES, BID_0553_GATES, validateBidReview } from "../project0553/bidReview";
import { VENDOR_0553_SOURCES } from "../project0553/vendorEvidence";
import { ARCHITECTURE_0553 } from "../project0553/architectureManifest";
import { deriveManHours, deriveLaborCost } from "../common/cost/derivationKernel";
import { STANDARD_PROJECT_TABS, AuditBadge, AuditMetric, AuditTable, AuditSection, ProjectTabs } from "../common/ui/ProjectAuditPrimitives";
import { getProject0553Dataset } from "../project0553/data/repository";
import "../project0550/project0550.css"; // Reuse existing 0550 presentation primitives, never project facts.
import "../project0553/project0553.css";

const TABS = [...STANDARD_PROJECT_TABS.map(([id,label]) => [id, id === "systems" ? "4 MR Systems" : label]), ["schematic","Schematic"]];
const Badge = AuditBadge;
const Metric = AuditMetric;
const Table = AuditTable;
const Section = AuditSection;
const sourceLinks = ids => ids.map(id => {
  const s=BID_0553_SOURCES.find(x=>x.id===id);
  return s?<a key={id} href={s.url} target="_blank" rel="noreferrer" style={{display:"block"}}>{id}</a>:id;
});

export function PJ26080553() {
 const [opened,setOpened]=useState(null);
 const [workspaceTab,setWorkspaceTab]=useState("overview");
 const [focusedBomLocation,setFocusedBomLocation]=useState(null);
 const openLocationBom=site=>{setFocusedBomLocation(site);setWorkspaceTab("budget");};
 const [selectedMr,setSelectedMr]=useState("ALL");
 const p=getProject0553Dataset().project;
 const visibleGates=useMemo(()=>BID_0553_GATES.filter(g=>selectedMr==="ALL"||g.system==="ALL"||g.system===selectedMr),[selectedMr]);
 const blocked=BID_0553_GATES.filter(g=>g.status!=="CLOSED_VERIFIED").length;
 const systemTable=<Table headers={["MR","System","Current evidence state","Technical review"]} rows={p.systems.map(s=>[
  s.mr,<strong>{s.name}</strong>,<Badge key={s.id}>{s.status}</Badge>,
  <button key={"b"+s.id} className="p553-detail-button" onClick={()=>setOpened(opened===s.mr?null:s.mr)}>{opened===s.mr?"− Hide":"＋ Detail"}</button>
 ])}/>;
 const shellProject = {id:p.projectId,shortName:"Zawtika Phase 1F Telecom",title:"JUTAL · "+p.packageId+" · Technical UNPRICED / Priced Commercial Bid",state:"WORKING REVIEW / RELEASE HOLD",statusDetail:"Closing amendment verification OPEN",method:p.method};
 return <ProjectWorkspaceShell project={shellProject} tabs={TABS.map(([id,label])=>({id,label}))} className="p553-dashboard" activeTab={workspaceTab} onTabChange={setWorkspaceTab} renderContent={(tab)=><>

   {tab==="schematic"&&<ScadaSchematic0553 onOpenLocationBom={openLocationBom}/>}
   {tab==="overview"&&<ExecutiveView model={EXECUTIVE_0553}/>}
   {tab==="architecture"&&<SharedArchitectureView manifest={ARCHITECTURE_MANIFEST_0553} modules={MODULE_REGISTRY_0553}/>}
   {tab==="systems"&&<SharedSystemsView systems={SYSTEMS_0553} systemGroups={SYSTEM_GROUPS_0553} title="System group view" description="Same group/focus/search/expand behavior as PJ2608-0550; all facts come from 0553 controlled MTO and RFQ."/>}
   {tab==="engineering"&&<SharedEngineeringView model={ENGINEERING_VIEW_MODEL_0553}><MR0001RFProofPilot/><MR0002LNACalculation/><MR0002PhysicalBom/></SharedEngineeringView>}
   {tab==="execution"&&<div className="p55-stack"><Section title="Execution and Delivery Basis"><Table headers={["Activity","Status / Required action"]} rows={[["Engineering & VDRL","Check MR-specific documents and review cycles"],["FAT / Inspection","Confirm approved test matrix, vendor factory and witnessed scope"],["Logistics / Import / Licences","Reconcile DAP Nonthaburi with CIF Zhuhai proposal and authority-processing exclusions"],["SAT / Commissioning","Verify responsibilities, test sites, crew, POB and rates"],["Spares / Special tools","Match inventory, quotation and validity"]].map(x=>x)}/></Section></div>}
   {tab==="budget"&&<CommercialWorkspace0553 focusedLocation={focusedBomLocation}/>}
   {tab==="risk"&&<div className="p55-stack"><Section title="Bid Readiness — source-linked audit"><div className="p553-filters"><label>System / MR <select value={selectedMr} onChange={e=>setSelectedMr(e.target.value)}><option value="ALL">ALL</option>{p.systems.map(s=><option key={s.id} value={s.mr}>{s.mr}</option>)}</select></label><Badge>{visibleGates.length} relevant gates</Badge></div><Table headers={["ID","Priority","Scope","Action / control","State","Source"]} rows={visibleGates.map(g=>[g.id,g.priority,g.system,<div key={g.id}><strong>{g.title}</strong><small>{g.detail}</small></div>,<Badge key={g.id}>{g.status}</Badge>,sourceLinks(g.sources)])}/><p className="p55-note">Release allowed: {validateBidReview().releaseAllowed?"YES":"NO — outstanding evidence and approvals"}.</p></Section></div>}
   {tab==="documents"&&<div className="p55-stack"><Section title="0553 Source Register"><Table headers={["ID","Document / location","Revision","Control state","Meaning"]} rows={BID_0553_SOURCES.map(s=>[s.id,<a key={s.id} href={s.url} target="_blank" rel="noreferrer">{s.name}</a>,s.revision,<Badge key={s.id}>{s.status}</Badge>,s.note])}/></Section><Section title="Vendor / OEM Source Index"><Table headers={["MR","Supplier","Source type","Link","Review status"]} rows={VENDOR_0553_SOURCES.map(v=>[v.mr,v.supplier,v.type,<a key={v.id} href={v.url} target="_blank" rel="noreferrer">{v.document}</a>,<Badge key={v.id}>{v.status}</Badge>])}/></Section><Section title="Evidence classification"><Table headers={["Evidence","Revision","State"]} rows={PROJECT_0553_EVIDENCE.map(e=>[e.title,e.revision,<Badge key={e.id}>{e.state}</Badge>])}/></Section></div>}

 </>}/>;
}
