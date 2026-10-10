import React,{useState} from "react";
import {getProject0553Dataset,getProject0553DataLayerStatus} from "./data/repository";
import {WORKING_BOM_BY_LOCATION_0553} from "./data/workingBomByLocation";
import {BID_COST_SPINE_0553} from "./data/bidCostSpine";
import {MODULE_REGISTRY_0553} from "./moduleRegistry";
import {MR0001_PRELIMINARY_LINK_BUDGET} from "./data/mr0001PreliminaryLinkBudget";
import {MR0001_SITE_CLASSIFICATION} from "./data/mr0001SiteClassification";
const ROOT="https://github.com/addvalue-genesis/genesis-portal/blob/feat/pj2608-0553-tpp-bid-handoff/";
const codeFiles=[
 "frontend/src/pages/PJ26080553.jsx",
 "frontend/src/project0553/CommercialWorkspace.jsx",
 "frontend/src/project0553/SimpleBom0553.jsx",
 "frontend/src/project0553/ScadaSchematic0553.jsx",
 "frontend/src/project0553/MR0001RFProofPilot.jsx",
 "frontend/src/project0553/data/repository.js",
 "frontend/src/project0553/data/adapters/controlledSnapshotAdapter.js",
 "frontend/src/project0553/data/workingBomByLocation.js",
 "frontend/src/project0553/data/mr0001PreliminaryLinkBudget.js",
 "frontend/src/project0553/data/mr0001TidalBudgetStudy.js",
 "frontend/src/project0553/data/mr0001NextGLinkReconciliation.js",
 "frontend/src/project0553/data/supplierQuoteLines.js",
 "frontend/src/project0553/data/bidCostSpine.js",
 "frontend/src/project0553/moduleRegistry.js",
 "frontend/src/project0553/architectureManifest.js",
 "docs/handoff/pj2608-0553/11_NEW_CHAT_RESUME_PROMPT.md",
 "docs/handoff/pj2608-0553/00_HANDOFF_CURRENT.md",
 "docs/handoff/pj2608-0553/12_MACHINE_STATE.json",
 "docs/handoff/pj2608-0553/13_TEAM_DEVELOPER_HANDOFF.md"
];
const exportObject=(type)=>{
 const dataset=getProject0553Dataset(),layer=getProject0553DataLayerStatus();
 const headers={projectId:"PJ2608-0553",registry:"DATA_CODE_REGISTRY",basis:"CONTROLLED_WORKING_SNAPSHOT",releaseAllowed:false,origin:"genesis-portal/feat/pj2608-0553-tpp-bid-handoff"};
 switch(type){
 case "working":return {...headers,layer,data:dataset};
 case "bom":return {...headers,source:WORKING_BOM_BY_LOCATION_0553.source,locations:WORKING_BOM_BY_LOCATION_0553.locations};
 case "cost":return {...headers,model:BID_COST_SPINE_0553};
 case "rf":return {...headers,model:MR0001_PRELIMINARY_LINK_BUDGET,siteClassification:MR0001_SITE_CLASSIFICATION};
 default:return {...headers,layer,modules:MODULE_REGISTRY_0553,paths:codeFiles,notice:"The manifest is an index; actual .jsx/.js source must be retrieved from versioned GitHub, not reconstructed from this export"};
 }
};
function downloadJson(key){
 const json=JSON.stringify(exportObject(key),(k,v)=>typeof v==="function"?undefined:v,2);
 const url=URL.createObjectURL(new Blob([json],{type:"application/json"}));
 const a=document.createElement("a");a.href=url;a.download="PJ2608-0553_"+key+"_working.json";
 document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
export function DataCodeRegistry0553(){
 const [filter,setFilter]=useState("");
 const status=getProject0553DataLayerStatus();
 const visible=codeFiles.filter(p=>p.toLowerCase().includes(filter.toLowerCase()));
 return <section className="p55-panel">
 <div className="p55-eyebrow">10 / DATA & CODE REGISTRY · TEAM HANDOFF</div>
 <h2>Data Sources · JSON · JSX · Developer Handoff</h2>
 <p className="p55-note">แหล่งข้อมูลหลักสำหรับการส่งต่องาน: Controlled JSON Snapshot + GitHub source files + Engineering/COST lineage. <strong>ไม่ใช่ Live SQL/AGERP</strong> และการดาวน์โหลดไม่แก้ไข Repository หรืออนุมัติราคา</p>
 <div className="p55-source-facts">
  <div><span>Project</span><strong>{status.projectId}</strong></div>
  <div><span>Storage</span><strong>{status.storage}</strong></div>
  <div><span>Adapter</span><strong>{status.adapter}</strong></div>
  <div><span>Issue Permission</span><strong>NO / WORKING</strong></div>
 </div>
 <h3>Export Working Data</h3>
 <div className="p55-filterbar p55-filterbar--simple">
  {[["working","Controlled Dataset JSON"],["bom","Location BOM JSON"],["rf","RF & Site Model JSON"],["cost","Cost State JSON"],["code","Code / Handoff Manifest JSON"]].map(([key,label])=><button key={key} type="button" className="p553-detail-button" onClick={()=>downloadJson(key)}>↓ {label}</button>)}
 </div>
 <p className="p55-note">Exports are internal working snapshots. Source files are version-controlled in GitHub; .jsx source code is linked below rather than copied into JSON. Missing/OPEN quantity, price or compliance must remain unapproved.</p>
 <h3>Source Code & Handoff Index</h3>
 <label>Filter source path <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="e.g. BOM, RF, .jsx, handoff" style={{marginLeft:12,padding:8,width:"min(470px,90%)"}}/></label>
 <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Source path / role</th><th>Type</th><th>GitHub</th></tr></thead><tbody>
 {visible.map(p=><tr key={p}><td style={{overflowWrap:"anywhere"}}>{p}</td><td>{p.endsWith(".jsx")?"React JSX":p.endsWith(".json")?"JSON":p.endsWith(".md")?"Handoff":"JavaScript"}</td><td><a href={ROOT+p} target="_blank" rel="noreferrer">Open source</a></td></tr>)}
 </tbody></table></div>
 <p className="p55-note">For another team: start with 11_NEW_CHAT_RESUME_PROMPT.md → 00_HANDOFF_CURRENT.md → 12_MACHINE_STATE.json → 13_TEAM_DEVELOPER_HANDOFF.md; create a feature branch, run npm run build, submit a reviewed PR. Preserve 0550 isolation, customer release gates and evidence control.</p>
 </section>;
}
