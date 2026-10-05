import React from "react";
import { Link } from "react-router-dom";
import { PROJECT0550_SYSTEMS } from "./Project0550SystemRegistry";
import "./SystemEngineeringIndex.css";

function State({text}){
  const s=String(text||"").toLowerCase();
  let tone="neutral";
  if(s.includes("pilot")) tone="active";
  else if(s.includes("verify")) tone="warn";
  else if(s.includes("reference")||s.includes("free_issue")) tone="special";
  else if(s.includes("partial")) tone="partial";
  return <span className={"sys-state "+tone}>{text}</span>;
}

export function SystemEngineeringIndex(){
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

      <section className="sys-grid">
        {PROJECT0550_SYSTEMS.map(s=>(
          <article key={s.no} className={"sys-card "+(s.no===7?"pilot":"")}>
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
                : <span className="sys-future">Same architecture · not yet expanded</span>}
            </footer>
          </article>
        ))}
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
