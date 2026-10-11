import React,{useState} from "react";
import {WORKFLOW_0553,COMPONENTS_0553,validateWorkflow0553} from "./workflowRegistry0553";
export function WorkflowNavigator0553({onNavigate}){
 const [open,setOpen]=useState("WF-05");
 return <section className="p55-panel">
  <div className="p55-eyebrow">PJ2608-0553 / L3.B · WORKFLOW & COMPONENT CONTROL</div>
  <h2>Workflow Navigator · WF-01–WF-12</h2>
  <p className="p55-note">รหัสใช้เรียกงานร่วมกัน; แต่ละสถานะหมายถึงความพร้อมของหน้าจอ ไม่ใช่ Engineering APPROVED. Registry integrity: {validateWorkflow0553()?"PASS":"CHECK"}</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>WF ID</th><th>Work / Dependency</th><th>Component ID</th><th>Open existing workbench</th></tr></thead><tbody>
  {WORKFLOW_0553.map(w=><React.Fragment key={w.id}><tr>
   <td><button type="button" className="p55-row-toggle" onClick={()=>setOpen(old=>old===w.id?"":w.id)} aria-expanded={open===w.id}>{open===w.id?"−":"+"}</button> {w.id}</td>
   <td><strong>{w.title}</strong><small>After: {w.dependencies.join(", ")||"Project start"}</small></td>
   <td>{w.component}</td><td><button type="button" className="p553-detail-button" onClick={()=>onNavigate(w.tab)}>Open {w.tab}</button></td>
  </tr>{open===w.id&&<tr><td></td><td colSpan={3}>
   <strong>Implementation: {w.status}</strong><p className="p55-note">Component registry below identifies existing source; workflow dependencies are planned, not yet enforced as budget approval gates.</p>
   {COMPONENTS_0553.filter(c=>c.id===w.component||c.tab===w.tab).map(c=><div key={c.id}>{c.id} — {c.name} <small>{c.path}</small></div>)}
  </td></tr>}</React.Fragment>)}
  </tbody></table></div>
  </section>;
}
