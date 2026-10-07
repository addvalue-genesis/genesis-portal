import React, { useEffect, useMemo, useState } from "react";
import "./EquationKernel.css";
import { PROJECT0550_CONTROLLED_EQUATION_FALLBACK } from "./Project0550EquationCatalog";

const CONTROLLED_FALLBACK_SNAPSHOT = PROJECT0550_CONTROLLED_EQUATION_FALLBACK;


const MODEL_FAMILIES = [
  ["B1","Engineering & Design","Quantity driver → engineering MH → labor/direct cost → selling-price state","Reuse method only; 0553 rates/quantities not imported"],
  ["B2","Documentation / VDRL","Issue quantity + content quantity + review/revision lifecycle → document MH/cost","Directly useful for 0550 MDDR/VDRL"],
  ["B3","Inspection / Testing / Certification","FAT/SAT/ITP/commissioning event keys → crew/MH → test cost","Event grouping avoids hidden or duplicate trips"],
  ["B8","Training","Session key → trainer/material prep/delivery/closeout MH → training cost","Can share physical trip with FAT; incremental mob only"],
  ["B9","Specialist Field Assistance","Person-days → field MH + OT + standby + mobilization + OEM specialist","Formal acceptance work remains separated from call-off assistance"]
];

const METHOD_SOURCES = [
  {
    project:"0553",
    title:"MASTER_MATHEMATICAL_EQUATION_AI_CONTEXT Rev04-DRAFT",
    use:"Controlled GEQ-001…033 kernel + external standards/research pedigree + anti-double-count rules",
    state:"METHOD AUTHORITY"
  },
  {
    project:"0553",
    title:"TPP_EPC_Equation_Model Rev02.1-DRAFT",
    use:"COMMON / GENERIC / PARTICULAR binding architecture; project facts bind equations rather than creating new math",
    state:"METHOD AUTHORITY"
  },
  {
    project:"0553",
    title:"MR0002_DMR_VDRL_MATHEMATICAL_MODEL Rev00",
    use:"Separate Q_issue from Q_content; document workflow/revision/schedule mathematics",
    state:"METHOD / PILOT"
  },
  {
    project:"0541",
    title:"OMEGA / VDRS / historical campaign work",
    use:"Historical validation of document-matrix UX, man-day/campaign decomposition and practical bid workflow",
    state:"HISTORICAL REFERENCE ONLY"
  }
];

const BINDING = [
  ["PAGA Speaker / Beacon","GEQ-001/002/032","Requirement + location + coverage proof","Required installed / procurement-class quantity","PARTIAL"],
  ["PAGA Loop / Amplifier","GEQ-004 + project CAL","Speaker taps / loop topology / loading criteria","Loop load / active + spare amplifier requirement","PRELIMINARY"],
  ["Engineering Work","GEQ-004/005/008/018","Required engineering objects × approved UMH/rates","Engineering MH + cost","UMH OPEN"],
  ["VDRL / Hist Rev","GEQ-009/010/011/024","Issue count + content + review cycles + due-date anchors","Document MH / due dates / revision workload","STRUCTURE READY"],
  ["FAT / SAT / Comm","GEQ-001/004/005/006/007/018/023","Required event keys + days + crew + resource caps","Test/site MH + stage cost","EVENT INPUT OPEN"],
  ["Mob / Travel","GEQ-013…017","People / trips / route / hotel / per-diem / permit","Mobilization cost","RATE INPUT OPEN"],
  ["Total Cost","GEQ-019/020/021/023","All direct equipment/activity + common cost","Internal project cost","NOT READY"],
  ["Commercial / Quote","GEQ-032/033","Required/awarded quantity + Base/Separate/Option treatment","Exhibit C / awarded price state","NOT READY"],
  ["Currency Conversion","GEQ-034","Source amount + source currency + BOT THB-reference rates + selected display currency","Derived display amount; source amount remains unchanged","CONTROLLED"]
];

export function EquationKernel(){
  const [q,setQ]=useState("");
  const [view,setView]=useState("binding");
  const [registry,setRegistry]=useState(null);
  const [registryState,setRegistryState]=useState("LOADING");

  useEffect(()=>{
    let active=true;
    fetch("/backend/api/etm/equation-registry.php?project=PJ2608-0550")
      .then(r=>{
        if(!r.ok) throw new Error("HTTP "+r.status);
        return r.json();
      })
      .then(payload=>{
        if(!payload.ok || !Array.isArray(payload.equations)) throw new Error(payload.message||payload.error||"Equation registry unavailable");
        if(active){
          setRegistry(payload);
          setRegistryState("LIVE_DB");
        }
      })
      .catch(()=>{
        if(active) setRegistryState("CONTROLLED_FALLBACK");
      });
    return ()=>{active=false;};
  },[]);

  const kernelRows=useMemo(()=>{
    if(registryState!=="LIVE_DB" || !registry?.equations?.length) return CONTROLLED_FALLBACK_SNAPSHOT;
    return registry.equations.map(r=>[
      r.equation_code,
      r.equation_name,
      r.expression_text,
      r.model_class || r.equation_layer,
      r.calibration_state || r.control_status,
      r.control_note || r.evidence_basis || r.equation_domain
    ]);
  },[registry,registryState]);

  const rows=useMemo(()=>kernelRows.filter(r=>!q||r.join(" ").toLowerCase().includes(q.toLowerCase())),[q,kernelRows]);

  return (
    <div className="eq-shell">
      <section className="eq-banner">
        <div>
          <small>CONTROLLED METHOD REUSE — NOT NEW THEORY · {registryState==="LIVE_DB" ? "LIVE DB REGISTRY" : "CONTROLLED FALLBACK SNAPSHOT"}</small>
          <h2>0550 ใช้สมการจาก Canonical Equation Registry แล้ว bind ด้วย Requirement / Input / Proof ของ 0550</h2>
          <p>
            Canonical equation truth = etm_equation_registry; หน้านี้เป็น projection เท่านั้น.
            เราไม่ยก quantity, rate, crew หรือ commercial parameter ของโครงการเก่ามาเป็น fact ของ 0550.
            สิ่งที่ reuse คือ mathematical form, workflow logic, anti-double-count rule และ research/standards grounding.
          </p>
        </div>
        <div className="eq-architecture">
          <b>Requirement</b><i>→</i><b>Applicability</b><i>→</i><b>Driver</b><i>→</i>
          <b>Workload</b><i>→</i><b>Cost</b><i>→</i><b>Cost Owner</b><i>→</i><b>Commercial State</b>
        </div>
      </section>

      <section className="eq-source-grid">
        {METHOD_SOURCES.map(s=>(
          <article key={s.project+s.title}>
            <div><b>{s.project}</b><span>{s.state}</span></div>
            <h3>{s.title}</h3>
            <p>{s.use}</p>
          </article>
        ))}
      </section>

      <nav className="eq-tabs">
        <button className={view==="binding"?"active":""} onClick={()=>setView("binding")}>0550 Binding Trace</button>
        <button className={view==="kernel"?"active":""} onClick={()=>setView("kernel")}>Controlled Equation Kernel</button>
        <button className={view==="families"?"active":""} onClick={()=>setView("families")}>Reusable Cost Families</button>
        <button className={view==="research"?"active":""} onClick={()=>setView("research")}>Standards / Research Basis</button>
      </nav>

      {view==="binding" && <BindingView/>}
      {view==="kernel" && (
        <section className="eq-panel">
          <div className="eq-panel-head">
            <div><small>GEQ-001…034</small><h2>Equation Registry — ค้นหาสมการที่ใช้กับงาน</h2></div>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search equation / domain / output…" />
          </div>
          <div className="eq-table-wrap">
            <table className="eq-table">
              <thead><tr><th>ID</th><th>Name</th><th>Controlled expression</th><th>Model class</th><th>Input state</th><th>Meaning in 0550</th></tr></thead>
              <tbody>{rows.map(r=>(
                <tr key={r[0]}>
                  <td><code>{r[0]}</code></td><td><strong>{r[1]}</strong></td><td><code>{r[2]}</code></td>
                  <td>{r[3]}</td><td><State text={r[4]}/></td><td>{r[5]}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      )}

      {view==="families" && (
        <section className="eq-panel">
          <small>REUSABLE EPC COST FAMILIES</small>
          <h2>ไม่ต้องสร้างสูตรใหม่ทุก Project — เปลี่ยน Particular Binding / Input เท่านั้น</h2>
          <div className="eq-family-grid">
            {MODEL_FAMILIES.map(r=>(
              <article key={r[0]}>
                <b>{r[0]}</b><h3>{r[1]}</h3><p>{r[2]}</p><span>{r[3]}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {view==="research" && <ResearchView/>}
    </div>
  );
}

function BindingView(){
  return (
    <div className="eq-stack">
      <section className="eq-panel">
        <small>0550 PARTICULAR BINDING</small>
        <h2>อ่านเหมือน Excel chain แต่แต่ละ node เป็น DB object + Equation ID + Source</h2>
        <div className="eq-binding-flow">
          {["Source / Requirement","0550 Particular Inputs","Controlled Equation","Derived Result","Cost Object","Commercial Output"].map((x,i)=>(
            <React.Fragment key={x}><div><b>{String(i+1).padStart(2,"0")}</b><strong>{x}</strong></div>{i<5&&<i>→</i>}</React.Fragment>
          ))}
        </div>
      </section>

      <section className="eq-panel">
        <div className="eq-panel-head"><div><small>TRACEABILITY</small><h2>จาก Engineering ไปถึง Cost / Quotation</h2></div><State text="TBC ≠ ZERO COST"/></div>
        <div className="eq-table-wrap">
          <table className="eq-table binding">
            <thead><tr><th>Cost / Engineering object</th><th>Equation binding</th><th>0550 input basis</th><th>Derived output</th><th>State</th></tr></thead>
            <tbody>{BINDING.map(r=>(
              <tr key={r[0]}><td><strong>{r[0]}</strong></td><td><code>{r[1]}</code></td><td>{r[2]}</td><td>{r[3]}</td><td><State text={r[4]}/></td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="eq-panel eq-example">
        <small>EXAMPLE TRACE · PAGA CATERING</small>
        <h2>สิ่งที่ UI ต้องทำให้เห็น ไม่ใช่แค่แสดงเลข 64 W</h2>
        <div className="eq-example-flow">
          <div><span>Source</span><strong>LAY / SPE / PHI / BOD / STD</strong><small>Evidence A</small></div><i>→</i>
          <div><span>Requirement</span><strong>Coverage / Load / Loss / N+1</strong><small>Project constraints</small></div><i>→</i>
          <div><span>Engineering proof</span><strong>CAL / SDY / RPT</strong><small>Project equations / studies</small></div><i>→</i>
          <div><span>Required object</span><strong>Speaker / Amp / Cable / I/O</strong><small>GEQ-002/032 + project CAL</small></div><i>→</i>
          <div><span>Work</span><strong>Install / Test / Doc / Comm</strong><small>GEQ-004/005/009/023</small></div><i>→</i>
          <div><span>Cost</span><strong>Material + Labor + Mob + Common</strong><small>GEQ-012…021</small></div><i>→</i>
          <div><span>Quotation</span><strong>Base / Separate / Option</strong><small>GEQ-033 → Exhibit C</small></div>
        </div>
      </section>
    </div>
  );
}

function ResearchView(){
  const refs=[
    ["GEQ-005","Parametric estimating / CER","AACE Transactions 2008 EST.03 — conceptual support; coefficients still require calibration."],
    ["GEQ-006/007","Activity duration / resource feasibility","AACE RP 32R-04 method grounding; physical/POB/workspace caps remain project inputs."],
    ["GEQ-009/010/024","Document workflow / revisions","PTTEP GEN-003/project document-control lifecycle is primary."],
    ["GEQ-018…023/033","Cost code / EPC roll-up","AACE RP 20R-98 and 21R-98 accounting / EPC code-of-accounts structure."],
    ["GEQ-022","Common-cost allocation","Activity-Based Costing / causal-driver concept; arbitrary allocation weights prohibited."],
    ["GEQ-025","Integration workload","Parametric CER + controlled interface graph; do not assume universal O(N²)."],
    ["GEQ-030","Criticality","ISO 31000 conceptual basis only after project scoring/bands are defined."],
    ["GEQ-031","Hazardous area","IEC 60079 family method/compliance grounding; project-governing edition remains separate authority."]
  ];
  return (
    <section className="eq-panel">
      <small>METHOD PEDIGREE</small>
      <h2>ทฤษฎี / Standard ใช้เป็น “ฐานวิธี” แต่ไม่ override Contract / MR / SPE ของ 0550</h2>
      <div className="eq-research-list">
        {refs.map(r=><div key={r[0]}><code>{r[0]}</code><strong>{r[1]}</strong><span>{r[2]}</span></div>)}
      </div>
      <div className="eq-rule">
        <b>Control rule</b>
        <span>Published method ≠ project numeric input. Unknown UMH / crew / factor / event count / rate remains OPEN until source, policy or calibrated history supports it.</span>
      </div>
    </section>
  );
}

function State({text}){
  const s=String(text).toLowerCase(); let tone="neutral";
  if(s.includes("control")||s.includes("ready")) tone="good";
  else if(s.includes("prelim")||s.includes("partial")||s.includes("calibration")||s.includes("structure")) tone="warn";
  else if(s.includes("open")||s.includes("not ready")||s.includes("input required")||s.includes("tbc")) tone="bad";
  return <span className={"eq-state "+tone}>{text}</span>;
}
