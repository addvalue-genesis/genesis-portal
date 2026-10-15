import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import { CommercialWorkspace0553 } from "../project0553/CommercialWorkspace";
import { WorkflowNavigator0553 } from "../project0553/WorkflowNavigator0553";
import { O_G_LIFECYCLE_0553, L3_TABS_0553, L3_TAB_GROUPS_0553, TAB_IDENTITY_0553 } from "../project0553/lifecycleNavigation";
import { DocumentReferenceControl0553 } from "../project0553/DocumentReferenceControl0553";
import { VendorProductCatalog0553 } from "../project0553/VendorProductCatalog0553";
import { VendorSourceRegister0553 } from "../project0553/VendorSourceRegister0553";
import {SmartDataGroup} from "../common/ui/SmartDataExplorer";
import React, { useMemo, useState } from "react";
import { ProjectWorkspaceShell } from "../common/ui/ProjectWorkspaceShell";
import { ArchitectureView as SharedArchitectureView } from "../common/ui/ArchitectureView";
import { ARCHITECTURE_MANIFEST_0553 } from "../project0553/architectureManifest";
import { MODULE_REGISTRY_0553 } from "../project0553/moduleRegistry";
import {buildBcModuleNavigator0553} from "../project0553/data/bcModuleNavigator0553";
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
const TABS = L3_TABS_0553.map(([id,label])=>[id,`${TAB_IDENTITY_0553.tabs.find(t=>t.route===id)?.semanticCode||"BID-UNKNOWN"} · ${label}`]);
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
 const [moduleQuery,setModuleQuery]=useState("");
 const mainModuleIndex=[
  {id:"bid.overview",name:"Project Overview / Workflow",tab:"overview",keywords:"main dashboard"},
  {id:"bid.architecture",name:"Architecture / Module Registry",tab:"architecture",keywords:"structure architecture"},
  {id:"bid.systems",name:"All MR Systems",tab:"systems",keywords:"mr0001 mr0002 mr0003 mr0004 system"},
  {id:"bid.engineering",name:"Engineering / First Principles",tab:"engineering",keywords:"calculation mr engineering"},
  {id:"bid.engineering.mr0001",name:"MR-0001 SCADA / RF Engineering",tab:"engineering",keywords:"radio link calculation"},
  {id:"bid.engineering.mr0002",name:"MR-0002 RFI LNA / Physical BOM",tab:"engineering",keywords:"rfi trunk radio"},
  {id:"bid.systems.mr0003",name:"MR-0003 IP Phone",tab:"systems",keywords:"phone telephony"},
  {id:"bid.systems.mr0004",name:"MR-0004 Marine RACON",tab:"systems",keywords:"navigation beacon racon"},
  {id:"bid.documents",name:"Source Documents / Evidence Register",tab:"documents",keywords:"source documents original vendor supplier quote"},
  {id:"bid.vendor.products.supplier.quote-lines",name:"Vendor Products / Supplier Quote Lines",tab:"documents",keywords:"supplier mgw rfi cost"},
  {id:"bid.budget",name:"Budget Workspace",tab:"budget",keywords:"working costing"},
  {id:"bid.budget.bom",name:"Engineering BOM Working Preview",tab:"budget",keywords:"working preview equipment"},
  {id:"bid.budget.bom.mr0002",name:"MR-0002 Trunk Radio Working BOM",tab:"budget",keywords:"rfi dmr antenna feeder"},
  {id:"bid.budget.bom.source-coverage",name:"BOM Source Coverage",tab:"budget",keywords:"source evidence"},
  {id:"bid.budget.bom.reconciliation",name:"BOM Cost Reconciliation",tab:"budget",keywords:"site cost"},
  {id:"bid.budget.summary.workbook",name:"Budgetary Summary Workbook",tab:"budget",keywords:"scope of supply a b c"},
  {id:"bid.execution",name:"Execution & Delivery",tab:"execution",keywords:"vdr fat sat"},
  {id:"bid.risk",name:"Risk / Compliance",tab:"risk",keywords:"release gates"},
  {id:"bid.registry",name:"Data Code Registry",tab:"registry",keywords:"module ids"},
  {id:"bid.schematic",name:"SCADA / Telecom Schematic",tab:"schematic",keywords:"radio"}
 ];
 // Derive B/C search results from the SAME controlled 10.2 source and module IDs
 // rendered in Budgetary; avoid isolated manually-maintained search aliases.
 const navigableModules=[...mainModuleIndex,...buildBcModuleNavigator0553()];
 const searchMatches=moduleQuery.trim()?
  navigableModules.filter(m=>(m.id+" "+m.name+" "+m.keywords).toLowerCase().includes(moduleQuery.trim().toLowerCase())):
  navigableModules;
 const jumpModule=m=>{setLifecycleStage("L3");setL3Area("B");setWorkspaceTab(m.tab);setModuleQuery(m.id);setNavTarget(m.id);};
 const [navTarget,setNavTarget]=useState(null);
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
 {l3Area==="A"&&<div className="p55-stack"><section className="p55-panel"><ComponentCopyId projectId="PJ2608-0553" componentKey="l3.original"/></section><Section title="L3.A — Original / Received Documents"><p>เอกสารต้นทางจาก RFQ / Client เก็บอ้างอิงไฟล์เดิม ไม่ถือว่าการลงทะเบียนเป็นการอนุมัติ</p><Table headers={["ID","Document / location","Revision","Control state","Meaning"]} rows={sourceRows(originalSources)}/></Section><Section title="Project Engineering References"><p>MR, DTS, BOD, SPE, DWG, CAL/RPT และเอกสารที่ถูกอ้างอิง ตรวจรายละเอียดและ Revision ใน 04 Document Intelligence โดยใช้ต้นฉบับชุดเดิม</p><DocumentReferenceControl0553/></Section></div>}
 {l3Area==="C"&&<div className="p55-stack"><section className="p55-panel"><ComponentCopyId projectId="PJ2608-0553" componentKey="l3.submissions"/></section><Section title="L3.C — Communications & Submissions"><p>ทะเบียนเอกสารสื่อสารกับ SAMTEL / JUTAL และเอกสารเสนอราคา ไม่ถือว่ารายการที่ INDEXED หรือ PREPARED ได้ส่งแล้ว</p><Table headers={["ID","Document / location","Revision","Control state","Meaning"]} rows={sourceRows(communications)}/></Section><Section title="Submission Control"><p>TC/TQ, technical bid, commercial priced/unpriced, transmittals, comments และ responses ต้องตรวจหลักฐานผู้ส่ง ผู้รับ วันที่ และ Revision ก่อนเปลี่ยนสถานะเป็น SUBMITTED. TBE ภายในไม่ใช่ Submission อัตโนมัติ</p></Section></div>}
 {l3Area==="B"&&<section className="p55-panel" style={{padding:14,marginBottom:16}}>
  <h3>ค้นหา Module ทั้งโครงการ / Project Module Navigator</h3>
  <p className="p55-note">ค้นหาจาก Module ID, System, MR หรือชื่อหน้าจอ แล้วคลิกเพื่อเปิดแท็บหลักที่เกี่ยวข้อง ไม่จำกัดเฉพาะ Trunk Radio</p>
  <div className="p55-filterbar"><label>Search Module <input value={moduleQuery} onChange={e=>setModuleQuery(e.target.value)} placeholder="เช่น bid.budget.bom.mr0002, Vendor, MR-0001, Summary Workbook" aria-label="ค้นหา Module ทั้งโครงการ"/></label>
   <button type="button" onClick={()=>setModuleQuery("")}>Clear</button>
  </div>
  <div style={{maxHeight:moduleQuery.trim()?320:150,overflowY:"auto",display:"flex",flexWrap:"wrap",gap:8}}>
   {searchMatches.map(m=><button key={m.id} type="button" className="p553-detail-button" onClick={()=>jumpModule(m)}>
    <strong>{m.name}</strong><small style={{display:"block"}}>{m.id} · Open {m.tab}</small>
   </button>)}
   {!searchMatches.length&&<span role="status">ไม่พบ Module ที่ตรงกับคำค้น</span>}
  </div>
 </section>}
 {l3Area==="B"&&<>
 <section className="p55-panel"><strong>Current module / รหัสอ้างอิงสำหรับสั่งแก้ไข</strong> <ComponentCopyId key={tab} projectId="PJ2608-0553" componentKey={"bid."+tab}/></section>
 {tab==="overview"&&<WorkflowNavigator0553 onNavigate={setWorkspaceTab}/> }

   {tab==="schematic"&&<ScadaSchematic0553 onOpenLocationBom={openLocationBom}/>}
   {tab==="registry"&&<DataCodeRegistry0553/>}
   {tab==="overview"&&<ExecutiveView model={EXECUTIVE_0553}/>}
   {tab==="architecture"&&<SharedArchitectureView manifest={ARCHITECTURE_MANIFEST_0553} modules={MODULE_REGISTRY_0553}/>}
   {tab==="systems"&&<><SharedSystemsView systems={SYSTEMS_0553} systemGroups={SYSTEM_GROUPS_0553} title="System group view" description="Four 0553 MR systems; project-specific engineering and cost evidence."/><DocumentReferenceControl0553/></>}
   {tab==="engineering"&&<SharedEngineeringView model={ENGINEERING_VIEW_MODEL_0553}><MR0001RFProofPilot/><MR0002LNACalculation/><MR0002PhysicalBom/></SharedEngineeringView>}
   {tab==="execution"&&<div className="p55-stack"><Section title="Execution and Delivery Basis"><Table headers={["Activity","Status / Required action"]} rows={[["Engineering & VDRL","Check MR-specific documents and review cycles"],["FAT / Inspection","Confirm approved test matrix, vendor factory and witnessed scope"],["Logistics / Import / Licences","Reconcile DAP Nonthaburi with CIF Zhuhai proposal and authority-processing exclusions"],["SAT / Commissioning","Verify responsibilities, test sites, crew, POB and rates"],["Spares / Special tools","Match inventory, quotation and validity"]].map(x=>x)}/></Section></div>}
   {tab==="budget"&&<CommercialWorkspace0553 key={navTarget||"budget"} focusedLocation={focusedBomLocation} navigationTarget={navTarget} initialMode={navTarget?.startsWith("bid.budget.summary.workbook")?"budgetary":"working"}/>}
   {tab==="risk"&&<div className="p55-stack"><Section title="Bid Readiness — source-linked audit"><div className="p553-filters"><label>System / MR <select value={selectedMr} onChange={e=>setSelectedMr(e.target.value)}><option value="ALL">ALL</option>{p.systems.map(s=><option key={s.id} value={s.mr}>{s.mr}</option>)}</select></label><Badge>{visibleGates.length} relevant gates</Badge></div><Table headers={["ID","Priority","Scope","Action / control","State","Source"]} rows={visibleGates.map(g=>[g.id,g.priority,g.system,<div key={g.id}><strong>{g.title}</strong><small>{g.detail}</small></div>,<Badge key={g.id}>{g.status}</Badge>,sourceLinks(g.sources)])}/><p className="p55-note">Release allowed: {validateBidReview().releaseAllowed?"YES":"NO — outstanding evidence and approvals"}.</p></Section></div>}
   {tab==="documents"&&<div className="p55-stack">
    <VendorProductCatalog0553/>
    <SmartDataGroup moduleKey="bid.documents" projectId="PJ2608-0553"
      title="Documents · RFQ / Original Vendor Sources / Evidence Classification" defaultOpen={false}
      description="Documents preserve originals and revisions; Vendor Products above displays derived company, products and quotations from the same source evidence.">
      <VendorSourceRegister0553/>
      <details className="p55-panel" data-component-key="bid.documents.evidence-classification" style={{padding:12}}>
        <summary style={{cursor:"pointer",fontWeight:700}}>Document Evidence Classification / ทะเบียนสถานะเอกสารต้นฉบับ</summary>
        <p><ComponentCopyId projectId="PJ2608-0553" componentKey="bid.documents.evidence-classification"/></p>
        <Table headers={["Evidence","Revision","State"]} rows={PROJECT_0553_EVIDENCE.map(e=>[e.title,e.revision,<Badge key={e.id}>{e.state}</Badge>])}/>
      </details>
    </SmartDataGroup>
   </div>}

 </>}</>}</>}/>;
}
