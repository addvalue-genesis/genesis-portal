import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PROJECT0550_SYSTEMS } from "./Project0550SystemRegistry";
import {
  PROJECT0550_SYSTEM_SCOPE_GROUPS,
  project0550SystemScopeSkeleton
} from "./Project0550SystemScopeTaxonomy";
import "./SystemEngineeringIndex.css";

const UI_GROUPS = [
  {
    id:"G1",
    title:"Network / ICT / Telephony",
    detail:"LAN, collaboration and telephone-facing systems",
    systemNos:[1,2,5,6]
  },
  {
    id:"G2",
    title:"Satellite / Transmission / Backbone",
    detail:"Satellite links, microwave transport and fiber backbone",
    systemNos:[3,4,13,15]
  },
  {
    id:"G3",
    title:"Safety / Security / Plant Communication",
    detail:"Plant-wide alerting and surveillance systems",
    systemNos:[7,8]
  },
  {
    id:"G4",
    title:"Radio / Aviation / Marine",
    detail:"Operational radio and navigation-related communication systems",
    systemNos:[9,10,11,12,18,19]
  },
  {
    id:"G5",
    title:"Site Infrastructure / Support",
    detail:"Entertainment, telecom mast/tower and meteorological support",
    systemNos:[14,16,17]
  }
];

function State({text}){
  const s=String(text||"").toLowerCase();
  let tone="neutral";
  if(s.includes("pilot")) tone="active";
  else if(s.includes("verify")) tone="warn";
  else if(s.includes("reference")||s.includes("free_issue")) tone="special";
  else if(s.includes("partial")) tone="partial";
  return <span className={"sys-state "+tone}>{text}</span>;
}

function SystemCard({s}){
  return (
    <article className={"sys-card "+(s.no===7?"pilot":"")}>
      <div className="sys-card-head">
        <div className="sys-num">
          <span>{String(s.no).padStart(2,"0")}</span>
          <b>{s.moduleId}</b>
        </div>
        <State text={s.state}/>
      </div>
      <h2>{s.name}</h2>
      <code>{s.token}</code>
      <div className="sys-bindings">
        <div><small>MR</small><span>{s.rfq.mr}</span></div>
        <div><small>PHI</small><span>{s.rfq.phi}</span></div>
        <div><small>BOD</small><span>{s.rfq.bod}</span></div>
        <div><small>SPE</small><span>{s.rfq.spe}</span></div>
        <div><small>STD</small><span>{s.rfq.std}</span></div>
        <div><small>TEL-021</small><span>{s.rfq.tel021}</span></div>
      </div>
      <footer>
        <span>{s.workbook}</span>
        {s.no===7
          ? <Link to="/projects/pj2608-0550/paga">Open 12.7 PAGA →</Link>
          : <span className="sys-future">Common x.1–x.7 architecture active · detailed evidence binding in progress</span>}
      </footer>
    </article>
  );
}

function SystemScopeTable({system}){
  const rows=project0550SystemScopeSkeleton(system.token);
  return (
    <section className="sys-scope-focus">
      <div className="sys-scope-head">
        <div>
          <small>{system.moduleId} · {system.token} · SYSTEM SCOPE STRUCTURE</small>
          <h3>หัวข้องานมาตรฐานของระบบนี้</h3>
        </div>
        <span>{system.state}</span>
      </div>
      <div className="sys-scope-table-wrap">
        <table className="sys-scope-table focused">
          <thead>
            <tr><th>No.</th><th>Scope Group</th><th>Commercial Route</th><th>Current State</th><th>Meaning</th></tr>
          </thead>
          <tbody>
            {rows.map(row=>(
              <tr key={row.code}>
                <td className="num">{row.order}</td>
                <td><strong>{row.title}</strong><code>{row.code}</code></td>
                <td>{row.commercialRoute}</td>
                <td><State text={row.state}/></td>
                <td>{row.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="sys-scope-note">
        ตารางนี้ไม่สร้าง scope ใหม่. ทุกแถวเป็น projection category เดียวกันสำหรับ 19 ระบบ; เมื่อ canonical Requirement / MTO / Vendor / Work / Cost ถูก bind แล้ว state และจำนวนรายการของแต่ละระบบจะเปลี่ยนตามข้อมูลจริง.
      </p>
    </section>
  );
}

export function SystemEngineeringIndex(){
  const [selectedSystem,setSelectedSystem]=useState("ALL");
  const [expanded,setExpanded]=useState(()=>({
    G1:false,
    G2:false,
    G3:true,
    G4:false,
    G5:false
  }));

  const selected=useMemo(
    ()=>selectedSystem==="ALL" ? null : PROJECT0550_SYSTEMS.find(s=>String(s.no)===selectedSystem),
    [selectedSystem]
  );

  const groups=useMemo(
    ()=>UI_GROUPS.map(g=>({
      ...g,
      systems:g.systemNos.map(no=>PROJECT0550_SYSTEMS.find(s=>s.no===no)).filter(Boolean)
    })),
    []
  );

  const toggleGroup=(id)=>setExpanded(prev=>({...prev,[id]:!prev[id]}));
  const setAll=(value)=>setExpanded(Object.fromEntries(UI_GROUPS.map(g=>[g.id,value])));

  return (
    <div className="sys-shell">
      <header className="sys-hero">
        <div>
          <small>12.0 · SYSTEM ENGINEERING · 19-SYSTEM MASTER</small>
          <h1>PJ2608-0550 Telecom Systems</h1>
          <p>
            Internal sequence follows the controlled 19-System Master workbook. RFQ documents remain the governing evidence.
            Each system uses the same knowledge pattern; PAGA is the active pilot at system no. 7.
          </p>
        </div>
        <div className="sys-hero-meta">
          <strong>19</strong><span>systems</span>
          <strong>1</strong><span>active pilot</span>
        </div>
      </header>

      <section className="sys-principle">
        <div><b>Internal No.</b><span>Navigation / work breakdown only</span></div>
        <div><b>System Token</b><span>Stable internal system identity</span></div>
        <div><b>RFQ Binding</b><span>MR · PHI · BOD · SPE · STD · TEL-021</span></div>
        <div><b>Authority</b><span>RFQ/project evidence governs technical truth</span></div>
      </section>

      <section className="sys-controls">
        <div className="sys-control-main">
          <label htmlFor="sys-select">View system</label>
          <select id="sys-select" value={selectedSystem} onChange={e=>setSelectedSystem(e.target.value)}>
            <option value="ALL">All 19 systems · Group View</option>
            {PROJECT0550_SYSTEMS.map(s=>(
              <option key={s.no} value={String(s.no)}>
                {s.moduleId} · {s.token} · {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sys-control-actions">
          <button type="button" onClick={()=>setAll(true)} disabled={selectedSystem!=="ALL"}>Expand all</button>
          <button type="button" onClick={()=>setAll(false)} disabled={selectedSystem!=="ALL"}>Collapse all</button>
        </div>
        <span className="sys-ui-note">UI GROUP ONLY · NOT RFQ CLASSIFICATION</span>
      </section>

      {selected ? (
        <section className="sys-focus">
          <div className="sys-focus-head">
            <div>
              <small>FOCUSED SYSTEM VIEW</small>
              <h2>{selected.moduleId} · {selected.name}</h2>
            </div>
            <button type="button" onClick={()=>setSelectedSystem("ALL")}>← Back to all systems</button>
          </div>
          <SystemCard s={selected}/>
          <SystemScopeTable system={selected}/>
        </section>
      ) : (
        <div className="sys-group-list">
          {groups.map(g=>{
            const isOpen=!!expanded[g.id];
            const pilot=g.systems.some(s=>s.no===7);
            return (
              <section className={"sys-group "+(pilot?"pilot-group":"")} key={g.id}>
                <button
                  type="button"
                  className="sys-group-toggle"
                  onClick={()=>toggleGroup(g.id)}
                  aria-expanded={isOpen}
                >
                  <div className="sys-group-id">{g.id}</div>
                  <div className="sys-group-copy">
                    <strong>{g.title}</strong>
                    <span>{g.detail}</span>
                  </div>
                  <div className="sys-group-meta">
                    {pilot && <span className="sys-pilot-badge">PAGA PILOT</span>}
                    <b>{g.systems.length} systems</b>
                    <span className="sys-chevron">{isOpen?"−":"+"}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="sys-grid sys-group-grid">
                    {g.systems.map(s=><SystemCard key={s.no} s={s}/>)}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      <section className="sys-scope-master">
        <div className="sys-scope-head">
          <div>
            <small>COMMON SYSTEM SCOPE TAXONOMY · ALL 19 SYSTEMS</small>
            <h2>ทุกระบบใช้หัวข้อควบคุมเดียวกัน — ข้อมูลจริงของแต่ละระบบ bind จาก canonical state</h2>
          </div>
          <span>TABLE VIEW · PRESENTATION ONLY</span>
        </div>
        <div className="sys-scope-table-wrap">
          <table className="sys-scope-table">
            <thead>
              <tr><th>No.</th><th>Scope Group</th><th>Customer / Commercial Route</th><th>Canonical Domains</th><th>Purpose / Control Rule</th></tr>
            </thead>
            <tbody>
              {PROJECT0550_SYSTEM_SCOPE_GROUPS.map(row=>(
                <tr key={row.code}>
                  <td className="num">{row.order}</td>
                  <td><strong>{row.title}</strong><code>{row.code}</code></td>
                  <td>{row.commercialRoute}</td>
                  <td>{row.canonicalDomains.join(" · ")}</td>
                  <td>{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sys-pattern">
        <small>COMMON SUB-MODULE PATTERN</small>
        <h2>ทุกระบบจะใช้โครงเดียวกัน แต่ bind กับ RFQ ของตัวเอง</h2>
        <div>
          <span>x.1 System Picture</span>
          <b>→</b><span>x.2 Requirement / Evidence</span>
          <b>→</b><span>x.3 Technical Resolution / Proof</span>
          <b>→</b><span>x.4 Required MTO / Vendor</span>
          <b>→</b><span>x.5 VDRL / Workload</span>
          <b>→</b><span>x.6 Lifecycle / Cost</span>
          <b>→</b><span>x.7 Resolution Queue</span>
        </div>
        <p>
          Calculations are optional proof tools inside a system. The primary structure is evidence → requirement → need →
          interpretation → answer → verification → output/deviation.
        </p>
      </section>
    </div>
  );
}
