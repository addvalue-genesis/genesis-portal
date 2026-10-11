import { CommercialWorkspace0553 } from "../project0553/CommercialWorkspace";
import { WorkflowNavigator0553 } from "../project0553/WorkflowNavigator0553";
import { O_G_LIFECYCLE_0553, L3_TABS_0553, L3_TAB_GROUPS_0553 } from "../project0553/lifecycleNavigation";
import { DocumentReferenceControl0553 } from "../project0553/DocumentReferenceControl0553";
import { VendorProductCatalog0553 } from "../project0553/VendorProductCatalog0553";
import React, { useMemo, useState } from "react";
import { ProjectWorkspaceShell } from "../common/ui/ProjectWorkspaceShell";
import { ArchitectureView as SharedArchitectureView } from "../common/ui/ArchitectureView";
import { ARCHITECTURE_MANIFEST_0553 } from "../project0553/architectureManifest";
import { MODULE_REGISTRY_0553 } from "../project0553/moduleRegistry";
import { ExecutiveView } from "../common/ui/ExecutiveView";
import { MR0001RFProofPilot } from "../project0553/MR0001RFProofPilot";
import { ScadaSchematic0553 } from "../project0553/ScadaSchematic0553";
import { DataCodeRegistry0553 } from "../project0553/DataCodeRegistry0553";
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

// IDs are stable application route keys. Display order follows the project
// engineering workflow; Budget is the final workbench after all upstream views.
// Lifecycle hierarchy is a navigation layer; route keys and workbench components are preserved.
const TABS = L3_TABS_0553;
const TAB_GROUPS = L3_TAB_GROUPS_0553;
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
 const [lifecycleStage,setLifecycleStage]=useState("L3");
 const [l3Area,setL3Area]=useState("B");
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
 const activeLifecycle=O_G_LIFECYCLE_0553.find(x=>x.id===lifecycleStage);
 const sourceRows=(sources)=>sources.map(d=>[d.id,<a key={d.id} href={d.url} target="_blank" rel="noreferrer">{d.name}</a>,d.revision,<Badge key={d.id}>{d.status}</Badge>,d.note]);
 const originalSources=BID_0553_SOURCES.filter(d=>["RFQ-ITB","RFQ-MTO-R04"].includes(d.id));
 const communications=BID_0553_SOURCES.filter(d=>!["RFQ-ITB","RFQ-MTO-R04","INT-PRICE-R09"].includes(d.id));
 const lifecycleHeader=<section className="p55-section" style={{padding:"12px 16px",marginBottom:14}}>
  <label htmlFor="p553-lifecycle" style={{fontWeight:700,display:"block",marginBottom:8}}>O&G PROJECT LIFECYCLE — Master stage</label>
  <select id="p553-lifecycle" style={{width:"100%",maxWidth:620,padding:10,fontSize:15}} value={lifecycleStage} onChange={e=>setLifecycleStage(e.target.value)}>
   {O_G_LIFECYCLE_0553.map(s=><option key={s.id} value={s.id}>{s.id} — {s.title}{s.id==="L3"?" · CURRENT":""}</option>)}
  </select>
  <p style={{marginTop:8}}>{activeLifecycle.title} · {activeLifecycle.state} · 0553 has 4 MR systems. Historical source files, legacy route IDs and pricing logic are unchanged.</p>
  {lifecycleStage==="L3"&&<div role="group" aria-label="L3 document and work areas" style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:14}}>
   {[
    ["A","A — Original / Received Documents"],
    ["B","B — Internal Engineering & Bid Preparation"],
    ["C","C — Communications & Submissions"]
   ].map(([id,label])=><button key={id} type="button" className="p553-detail-button" aria-pressed={l3Area===id} onClick={()=>setL3Area(id)} style={{padding:"10px 14px",fontWeight:l3Area===id?700:400,border:l3Area===id?"2px solid #07729a":"1px solid #b7c7d5"}}>{label}</button>)}
  </div>}

 </section>;
 return <ProjectWorkspaceShell project={shellProject} tabs={l3Area==="B"?TABS.map(([id,label])=>({id,label})):[]} tabGroups={l3Area==="B"?TAB_GROUPS:[]} className="p553-dashboard" activeTab={workspaceTab} onTabChange={setWorkspaceTab} renderContent={(tab)=><>{lifecycleHeader}{lifecycleStage!=="L3"?<section className="p55-section"><h2>{activeLifecycle.id} — {activeLifecycle.title}</h2><p>This lifecycle stage is a navigation placeholder. The current project is L3 Tendering & Bidding. Its upstream references and downstream scope forecasts remain preserved in the L3 workbench; no project data was migrated or reclassified automatically.</p><button type="button" onClick={()=>setLifecycleStage("L3")}>Back to L3 Tendering & Bidding</button></section>:<>
 {l3Area==="A"&&<div className="p55-stack"><Section title="L3.A — Original / Received Documents"><p>เอกสารต้นทางจาก RFQ / Client เก็บอ้างอิงไฟล์เดิม ไม่ถือว่าการลงทะเบียนเป็นการอนุมัติ</p><Table headers={["ID","Document / location","Revision","Control state","Meaning"]} rows={sourceRows(originalSources)}/></Section><Section title="Project Engineering References"><p>MR, DTS, BOD, SPE, DWG, CAL/RPT และเอกสารที่ถูกอ้างอิง ตรวจรายละเอียดและ Revision ใน 04 Document Intelligence โดยใช้ต้นฉบับชุดเดิม</p><DocumentReferenceControl0553/></Section></div>}
 {l3Area==="C"&&<div className="p55-stack"><Section title="L3.C — Communications & Submissions"><p>ทะเบียนเอกสารสื่อสารกับ SAMTEL / JUTAL และเอกสารเสนอราคา ไม่ถือว่ารายการที่ INDEXED หรือ PREPARED ได้ส่งแล้ว</p><Table headers={["ID","Document / location","Revision","Control state","Meaning"]} rows={sourceRows(communications)}/></Section><Section title="Submission Control"><p>TC/TQ, technical bid, commercial priced/unpriced, transmittals, comments และ responses ต้องตรวจหลักฐานผู้ส่ง ผู้รับ วันที่ และ Revision ก่อนเปลี่ยนสถานะเป็น SUBMITTED. TBE ภายในไม่ใช่ Submission อัตโนมัติ</p></Section></div>}
 {l3Area==="B"&&<>
 {tab==="overview"&&<WorkflowNavigator0553 onNavigate={setWorkspaceTab}/> }

   {tab==="schematic"&&<ScadaSchematic0553 onOpenLocationBom={openLocationBom}/>}
   {tab==="registry"&&<DataCodeRegistry0553/>}
   {tab==="overview"&&<ExecutiveView model={EXECUTIVE_0553}/>}
   {tab==="architecture"&&<SharedArchitectureView manifest={ARCHITECTURE_MANIFEST_0553} modules={MODULE_REGISTRY_0553}/>}
   {tab==="systems"&&<><SharedSystemsView systems={SYSTEMS_0553} systemGroups={SYSTEM_GROUPS_0553} title="System group view" description="Four 0553 MR systems; project-specific engineering and cost evidence."/><DocumentReferenceControl0553/></>}
   {tab==="engineering"&&<SharedEngineeringView model={ENGINEERING_VIEW_MODEL_0553}><MR0001RFProofPilot/><MR0002LNACalculation/><MR0002PhysicalBom/></SharedEngineeringView>}
   {tab==="execution"&&<div className="p55-stack"><Section title="Execution and Delivery Basis"><Table headers={["Activity","Status / Required action"]} rows={[["Engineering & VDRL","Check MR-specific documents and review cycles"],["FAT / Inspection","Confirm approved test matrix, vendor factory and witnessed scope"],["Logistics / Import / Licences","Reconcile DAP Nonthaburi with CIF Zhuhai proposal and authority-processing exclusions"],["SAT / Commissioning","Verify responsibilities, test sites, crew, POB and rates"],["Spares / Special tools","Match inventory, quotation and validity"]].map(x=>x)}/></Section></div>}
   {tab==="budget"&&<CommercialWorkspace0553 focusedLocation={focusedBomLocation}/>}
   {tab==="risk"&&<div className="p55-stack"><Section title="Bid Readiness — source-linked audit"><div className="p553-filters"><label>System / MR <select value={selectedMr} onChange={e=>setSelectedMr(e.target.value)}><option value="ALL">ALL</option>{p.systems.map(s=><option key={s.id} value={s.mr}>{s.mr}</option>)}</select></label><Badge>{visibleGates.length} relevant gates</Badge></div><Table headers={["ID","Priority","Scope","Action / control","State","Source"]} rows={visibleGates.map(g=>[g.id,g.priority,g.system,<div key={g.id}><strong>{g.title}</strong><small>{g.detail}</small></div>,<Badge key={g.id}>{g.status}</Badge>,sourceLinks(g.sources)])}/><p className="p55-note">Release allowed: {validateBidReview().releaseAllowed?"YES":"NO — outstanding evidence and approvals"}.</p></Section></div>}
   {tab==="documents"&&<div className="p55-stack"><Section title="Vendor / OEM Source Index"><Table headers={["MR","Supplier","Source type","Link","Review status"]} rows={VENDOR_0553_SOURCES.map(v=>[v.mr,v.supplier,v.type,<a key={v.id} href={v.url} target="_blank" rel="noreferrer">{v.document}</a>,<Badge key={v.id}>{v.status}</Badge>])}/></Section><Section title="Evidence classification"><Table headers={["Evidence","Revision","State"]} rows={PROJECT_0553_EVIDENCE.map(e=>[e.title,e.revision,<Badge key={e.id}>{e.state}</Badge>])}/></Section><VendorProductCatalog0553/></div>}

 </>}</>}</>}/>;
}
