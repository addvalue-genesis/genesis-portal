import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AccessControl.css";

const ROLE_PRESETS = [
  {
    code:"PROJECT_OWNER", name:"Project Owner", project:"Manage",
    modules:["Bid","Engineering","VDRL","QA/Test","Vendor/TBE","Internal Cost","Selling Price","Deviation","Submission","Members"],
    sensitive:["Internal notes","Internal cost","Selling price","Release authority"],
    can:"Full project control; manage members; freeze MTO/price; release submission."
  },
  {
    code:"BID_MANAGER", name:"Bid Manager", project:"Contribute / Approve",
    modules:["Bid","Engineering","VDRL","QA/Test","Vendor/TBE","Cost view","Selling Price edit","Deviation","Submission"],
    sensitive:["Internal notes","Internal cost view","Selling price"],
    can:"Control bid response, deviation, readiness and submission."
  },
  {
    code:"LEAD_ENGINEER", name:"Lead Telecom Engineer", project:"Contribute / Approve",
    modules:["Bid view","Engineering","VDRL","QA/Test","Vendor/TBE","Technical Deviation"],
    sensitive:["Internal notes"],
    can:"Approve engineering basis and freeze Required MTO; no selling-price authority."
  },
  {
    code:"ENGINEER", name:"Engineer", project:"Contribute",
    modules:["Bid view","Engineering","VDRL view","QA/Test view","Vendor view","Technical Deviation"],
    sensitive:["Internal notes"],
    can:"Edit assigned system/location engineering only."
  },
  {
    code:"DOCUMENT_CONTROL", name:"Document Controller", project:"Contribute / Issue",
    modules:["Bid view","Engineering view","VDRL","QA/Test view"],
    sensitive:["Internal notes"],
    can:"VDRL/MDDR, revision history, transmittal, issue controlled documents."
  },
  {
    code:"COMMERCIAL", name:"Commercial / Estimator", project:"Contribute / Freeze Price",
    modules:["Bid","VDRL view","Vendor/TBE","Commercial Deviation","Internal Cost","Selling Price"],
    sensitive:["Internal notes","Internal cost","Selling price"],
    can:"Edit cost/rates/price schedules and freeze commercial price basis."
  },
  {
    code:"QA_QC", name:"QA/QC", project:"Contribute",
    modules:["Bid view","Engineering view","VDRL","QA/Test","Vendor view"],
    sensitive:["Internal notes"],
    can:"Prepare ITP/FAT/SAT/quality dossier and inspection evidence."
  },
  {
    code:"VIEWER", name:"Viewer", project:"View",
    modules:["Bid","Engineering","VDRL","QA/Test","Vendor"],
    sensitive:[],
    can:"Read-only; no cost edit, no release."
  },
  {
    code:"EXTERNAL_REVIEWER", name:"External Reviewer", project:"Restricted View",
    modules:["Customer Preview","Engineering clean view","VDRL clean view","QA/Test clean view"],
    sensitive:[],
    can:"No internal notes, no internal cost, no selling price, no edit."
  }
];

const LEVELS = [
  ["1","Project visibility","Can the person see PJ2608-0550 at all?","No access / View / Contribute / Manage"],
  ["2","Module visibility","Which work areas are visible?","Bid / Engineering / VDRL / Cost / Vendor / QA / Deviations / Schedule"],
  ["3","System scope","Which telecom systems?","All systems or selected systems e.g. PAGA only"],
  ["4","Location scope","Which site/building/location?","All locations or selected APF/ACP/buildings"],
  ["5","Action authority","What can they do?","View / Edit / Approve / Freeze / Issue / Release"],
  ["6","Sensitive data","What must remain hidden?","Internal notes / cost build-up / selling price / commercial deviation"],
];

export function AccessControl() {
  const [selected,setSelected]=useState("ENGINEER");
  const role=ROLE_PRESETS.find(x=>x.code===selected) || ROLE_PRESETS[0];

  return (
    <div className="acl-shell">
      <header className="acl-hero">
        <div>
          <div className="acl-eyebrow">GENESIS · PROJECT ACCESS CONTROL · REV0</div>
          <h1>PJ2608-0550 · Team Access</h1>
          <p>กำหนดว่า “ใครเห็น Project ไหน / Module ไหน / System ไหน / Location ไหน / ทำ Action อะไรได้”</p>
        </div>
        <div className="acl-actions">
          <Link to="/projects/pj2608-0550/bid">← Bid Workspace</Link>
          <span>RBAC + Project/System/Location Scope</span>
        </div>
      </header>

      <section className="acl-panel">
        <div className="acl-panel-head">
          <div>
            <small>ACCESS MODEL</small>
            <h2>เราไม่ให้สิทธิ์แบบ “เข้าได้ทั้งระบบ” — แบ่งได้ถึงระดับงานภายใน Project</h2>
          </div>
        </div>
        <div className="acl-level-grid">
          {LEVELS.map(([no,title,question,options])=>(
            <article key={no}>
              <b>{no}</b>
              <h3>{title}</h3>
              <p>{question}</p>
              <span>{options}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="acl-two-col">
        <div className="acl-panel">
          <small>ROLE PRESETS</small>
          <h2>เลือก Role เป็นฐาน แล้วค่อยจำกัด System / Location รายคน</h2>
          <div className="acl-role-list">
            {ROLE_PRESETS.map(r=>(
              <button key={r.code} className={selected===r.code?"active":""} onClick={()=>setSelected(r.code)}>
                <strong>{r.name}</strong>
                <span>{r.project}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="acl-panel acl-role-detail">
          <small>{role.code}</small>
          <h2>{role.name}</h2>
          <div className="acl-badge">{role.project}</div>
          <p>{role.can}</p>
          <h3>Visible modules / capabilities</h3>
          <div className="acl-chips">{role.modules.map(x=><span key={x}>{x}</span>)}</div>
          <h3>Sensitive visibility</h3>
          {role.sensitive.length ? (
            <div className="acl-sensitive">{role.sensitive.map(x=><span key={x}>{x}</span>)}</div>
          ) : <div className="acl-none">None — sensitive commercial/internal data hidden</div>}
        </div>
      </section>

      <section className="acl-panel">
        <small>EXAMPLE · MYANMAR TEAM</small>
        <h2>ตัวอย่างการแบ่งสิทธิ์โดยไม่เปิดข้อมูลราคาให้ทุกคน</h2>
        <div className="acl-example-grid">
          <div>
            <strong>Telecom Engineer</strong>
            <span>Project: PJ2608-0550</span>
            <span>System: PAGA + assigned systems</span>
            <span>Location: APF / assigned buildings</span>
            <span>Can: Evidence / CAL / SDY / technical response</span>
            <em>Cannot: Internal cost / selling price / final release</em>
          </div>
          <div>
            <strong>Document Controller</strong>
            <span>Project: PJ2608-0550</span>
            <span>Module: VDRL / Revision / Transmittal</span>
            <span>Can: Generate draft, update Hist Rev, issue after approval</span>
            <em>Cannot: Change engineering result / selling price</em>
          </div>
          <div>
            <strong>Commercial</strong>
            <span>Project: PJ2608-0550</span>
            <span>Module: Cost / Exhibit C / Commercial Deviation</span>
            <span>Can: Rates, cost, price schedules, commercial basis</span>
            <em>Cannot: Freeze engineering MTO without Lead Engineer gate</em>
          </div>
          <div>
            <strong>External / Customer Preview</strong>
            <span>Only clean approved view</span>
            <span>No internal note</span>
            <span>No internal cost build-up</span>
            <span>No unpublished revision</span>
            <em>Read/export only</em>
          </div>
        </div>
      </section>

      <section className="acl-panel acl-gate">
        <small>CONTROLLED RELEASE</small>
        <h2>สำคัญ: “Edit” กับ “Approve/Freeze/Issue” ต้องเป็นคนละสิทธิ์</h2>
        <div>
          <span>Engineer edits proof</span><b>→</b>
          <span>Lead Engineer approves / freezes MTO</span><b>→</b>
          <span>Commercial freezes price</span><b>→</b>
          <span>Bid Manager / Owner releases submission</span>
        </div>
      </section>
    </div>
  );
}
