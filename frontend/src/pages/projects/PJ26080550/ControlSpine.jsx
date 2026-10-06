import React, { useEffect, useMemo, useState } from "react";
import "./ControlSpine.css";
import { PROJECT0550_ENGINEERING_DOCTRINE } from "./Project0550EngineeringDoctrine";
import { PROJECT0550_CONTROL_OBJECTS } from "./Project0550ControlObjects";
import { evaluateProject0550Portfolio } from "./Project0550SmartControlEngine";

const LEGACY_TRACE_ROWS_UNUSED = [
  {
    id:"CTRL-PAGA-001",
    object:"PAGA Sound Coverage Study",
    source:"MM-ASK-1A-APF-TEL-RPT-0005 + 0550 engineering source chain",
    applicability:"ACTIVE",
    driver:"Ambient noise + geometry + coverage criteria + layout/topology inputs",
    proof:"RPT-0005 / supporting CAL-SDY objects",
    quantity:"Final speaker / beacon quantity = TBC",
    workload:"Study + engineering + review + controlled report issue",
    owner:"TBC — bind from 0550 responsibility source",
    treatment:"TBC — map only after 0550 scope / Exhibit C binding",
    state:"BLOCKED BY INPUTS",
    next:"Close current ambient noise, geometry, APF cable schedule, loop topology, cable loss, final coverage and UPS calculation."
  },
  {
    id:"CTRL-VDRL-001",
    object:"VDRL / Document Production",
    source:"0550 MR / Exhibit A document obligations",
    applicability:"ACTIVE",
    driver:"Q_issue + Q_content + review/revision/final-issue lifecycle",
    proof:"Source row + evidence + revision history",
    quantity:"Q_issue / Q_content = TBC by deliverable",
    workload:"MH_prepare + check + DC + review + revise + final issue",
    owner:"TBC per deliverable / activity",
    treatment:"Map cost once to the applicable 0550 price line",
    state:"STRUCTURE READY",
    next:"Bind issue recurrence, content quantity, review cycle and owner from 0550 VDRL/MDDR source."
  },
  {
    id:"CTRL-TEST-001",
    object:"FAT / IFAT / SAT / Commissioning",
    source:"0550 contract / technical lifecycle obligations",
    applicability:"ACTIVE / VERIFY BY SYSTEM",
    driver:"Required event × crew × duration × test scope",
    proof:"ITP / procedure / report / acceptance evidence",
    quantity:"EventKey = OPEN",
    workload:"Technical test MH + incremental event cost",
    owner:"TBC by event and responsibility",
    treatment:"Base / separate treatment must follow 0550 contract and Exhibit C",
    state:"EVENT BINDING OPEN",
    next:"Create 0550 EventKey and PhysicalTripKey so one real trip is not charged repeatedly across FAT/SAT/training/field work."
  },
  {
    id:"CTRL-LOG-001",
    object:"Logistics / Permit / Import Responsibility",
    source:"0550 Contract / Exhibit A / Exhibit C / vendor origin and delivery basis",
    applicability:"CONTEXT DRIVEN",
    driver:"Origin + delivery point + Incoterm + permit/import responsibility",
    proof:"Contract clause / vendor quote / logistics evidence",
    quantity:"Shipment / permit occurrences = TBC",
    workload:"Admin + logistics + permit/application + financing exposure where applicable",
    owner:"TBC — seller / buyer / vendor / reimbursable owner must be explicit",
    treatment:"Do not bury in miscellaneous allowance",
    state:"RESPONSIBILITY OPEN",
    next:"Bind responsibility and cost owner from 0550 sources before pricing freight, duty, permit or cash exposure."
  },
  {
    id:"CTRL-SPARE-001",
    object:"Spares / Tools / Consumables",
    source:"Exhibit C C2 / C3 / C4 / C5 / C6",
    applicability:"ACTIVE BY PRICE SCHEDULE",
    driver:"Procurement class + required quantity basis",
    proof:"Requirement + OEM recommendation + engineering need",
    quantity:"Separate installed / commissioning / 2Y / capital / tool classes",
    workload:"Procurement + review + document / logistics as applicable",
    owner:"TBC per class",
    treatment:"Base / separate / option kept as independent commercial state",
    state:"QUANTITY / PRICE OPEN",
    next:"Never merge spare classes into installed quantity and never treat vendor BOM as the project requirement."
  }
];

const CONTROL_FIELDS = [
  ["requirement_id","Source obligation","Immutable trace to Contract / MR / SPE / PHI / BOD / Drawing / TC."],
  ["applicability_state","Scope gate","Applicable / Not Applicable / Pending — with reason and source."],
  ["driver_id","Quantity / work driver","Defines what creates quantity, event, document content or workload."],
  ["proof_object_id","CAL / SDY / RPT / evidence","Engineering proof that releases a derived result."],
  ["workload_object","Work / MH object","Existing etm_activities + 010 etm_vdrl_workload_bindings separate physical quantity from work needed to produce/execute it."],
  ["etm_execution_events.event_code","Lifecycle event","010: unique FAT / IFAT / SAT / commissioning / training / assistance event."],
  ["etm_physical_trips.trip_code","Travel conservation key","010: one physical mobilization counted once even when several activities share it."],
  ["etm_cost_items.id","Internal cost object","Existing material / labor / mob / rental / subcontract / common cost object."],
  ["responsibility_role = COST_OWNER","Economic owner","010 etm_object_responsibilities binds a controlled party separately from who performs the work."],
  ["etm_cost_items.cost_status","Valuation state","Existing internal cost state; do not merge it with customer treatment."],
  ["etm_bid_price_schedule_items.inclusion_status","Customer treatment","Existing Base / Option / Separate / Call-off / Excluded / TBC commercial state."],
  ["etm_cost_price_bindings","Exhibit C output link","010 many-to-many trace from internal cost item to the existing customer price-schedule line."],
  ["evidence_id / etm_trace_edges","Evidence + reverse trace","Existing evidence plus 010 bidirectional graph edges support Requirement → Price and Price → Evidence."],
  ["closure_state","Release gate","Open / Hold / Ready / Frozen / Issued with decision history."]
];

const ANTI_DOUBLE = [
  ["B1 ↔ B2","Technical authoring and document-control lifecycle are different work objects. Do not charge the same authoring MH again as VDRL control."],
  ["B3 ↔ B8 ↔ B9","Formal test, training and specialist assistance have different purpose owners; shared travel uses one PhysicalTripKey."],
  ["Project-shared work","PM, common engineering, common document control and common mobilization are generated once and allocated by a controlled causal basis."],
  ["Procurement classes","Installed, commissioning spares, 2-year spares, capital spares and special tools remain separate quantity classes."],
  ["Open values","NOT FOUND and TBC stay visible as unresolved scope/cost; they never collapse into numeric zero."],
  ["Vendor input","Vendor BOM/quote is an offered input to reconcile against required MTO; it is not the project requirement."]
];

const STATES = [
  ["FACT","0550 source / approved human decision"],
  ["DERIVED","Result produced from controlled inputs/formula"],
  ["ASSUMPTION","Explicit working basis awaiting closure"],
  ["TBC","Required value not yet controlled"],
  ["SOURCE_CONFLICT","Sources disagree; do not choose silently"],
  ["NOT_APPLICABLE","Closed with reason/evidence, not blank"]
];

export function ControlSpine(){
  const [mode,setMode]=useState("trace");
  const [q,setQ]=useState("");
  const [liveData,setLiveData]=useState(null);
  const [apiMode,setApiMode]=useState("PREVIEW");
  const [releaseIntent,setReleaseIntent]=useState("PRICE_FREEZE");
  const smart=useMemo(()=>evaluateProject0550Portfolio(PROJECT0550_CONTROL_OBJECTS,{releaseIntent}),[releaseIntent]);

  useEffect(()=>{
    let active=true;
    fetch("/backend/api/etm/control-spine.php?project=PJ2608-0550")
      .then((response)=>{
        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((payload)=>{
        if(!payload.ok) throw new Error(payload.message||payload.error||"ETM API error");
        if(active){
          setLiveData(payload);
          setApiMode("LIVE DB");
        }
      })
      .catch(()=>{
        if(active) setApiMode("PREVIEW");
      });
    return ()=>{active=false;};
  },[]);

  const rows=useMemo(()=>{
    const s=q.trim().toLowerCase();
    if(!s) return smart.objects;
    return smart.objects.filter(x=>Object.values(x).filter(v=>typeof v!=="object").join(" ").toLowerCase().includes(s));
  },[q,smart]);

  return (
    <div className="cs-shell">
      <section className="cs-hero">
        <div>
          <small>0550 SMART ENGINEERING CONTROL · {PROJECT0550_ENGINEERING_DOCTRINE.revision}</small>
          <h2>{PROJECT0550_ENGINEERING_DOCTRINE.name}</h2>
          <p>
            Code ประมวลผลข้อมูล 0550 ตาม First Principles, technical/non-technical constraints, proof gates,
            quantity drivers, lifecycle obligations และ parametric cost rules เพื่อหา gap / blocker / release readiness — ไม่ใช่แค่แสดงหลักการให้อ่าน.
          </p>
        </div>
        <div className="cs-hard-rules">
          <div className="cs-mode-line">
            <strong>CONTROL DATA</strong>
            <span className={apiMode==="LIVE DB"?"live":"preview"}>{apiMode}</span>
          </div>
          <strong>HARD CONTROLS</strong>
          {PROJECT0550_ENGINEERING_DOCTRINE.hardRules.slice(0,5).map(rule=><span key={rule[0]}>{rule[1]}</span>)}
        </div>
      </section>

      <div className="cs-route">
        {PROJECT0550_ENGINEERING_DOCTRINE.uiChain.map((x,i)=>(
          <React.Fragment key={x}>
            <div><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>
            {i<PROJECT0550_ENGINEERING_DOCTRINE.uiChain.length-1&&<em>→</em>}
          </React.Fragment>
        ))}
      </div>

      <div className="cs-live-grid">
        <div><small>SMART STATUS</small><strong>{smart.status}</strong><span>{releaseIntent}</span></div>
        <div><small>BLOCKERS</small><strong>{smart.summary.blockers}</strong><span>must close / disposition</span></div>
        <div><small>WARNINGS</small><strong>{smart.summary.warnings}</strong><span>visible uncertainty</span></div>
        <div><small>CONFIDENCE</small><strong>{smart.summary.averageConfidence}%</strong><span>review priority only</span></div>
      </div>

      <nav className="cs-tabs">
        {Object.keys(PROJECT0550_ENGINEERING_DOCTRINE.releaseIntents).map(intent=>(
          <button key={intent} className={releaseIntent===intent?"active":""} onClick={()=>setReleaseIntent(intent)}>{intent}</button>
        ))}
      </nav>

      {liveData?.summary && (
        <div className="cs-live-grid">
          {Object.entries(liveData.summary).map(([key,value])=>(
            <div key={key}>
              <small>{key}</small>
              <strong>{value.total}</strong>
              <span>{value.open_count} open / TBC</span>
            </div>
          ))}
        </div>
      )}

      <nav className="cs-tabs">
        <button className={mode==="trace"?"active":""} onClick={()=>setMode("trace")}>0550 Trace / Closure</button>
        <button className={mode==="schema"?"active":""} onClick={()=>setMode("schema")}>DB Control Fields</button>
        <button className={mode==="double"?"active":""} onClick={()=>setMode("double")}>Anti-Double-Count</button>
        <button className={mode==="state"?"active":""} onClick={()=>setMode("state")}>Evidence / State Model</button>
        <button className={mode==="smart"?"active":""} onClick={()=>setMode("smart")}>Smart Engine Findings</button>
      </nav>

      {mode==="trace" && (
        <section className="cs-panel">
          <div className="cs-panel-head">
            <div><small>CURRENT CONTROL OBJECTS</small><h2>อะไรปิดแล้ว / อะไรยังขาดก่อนราคา freeze</h2></div>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search object / source / owner / next action…" />
          </div>
          {liveData?.traceEdges?.length>0 && (
            <div className="cs-live-trace">
              <strong>LIVE DB TRACE EDGES</strong>
              <div className="cs-table-wrap">
                <table className="cs-table">
                  <thead><tr><th>Edge</th><th>From</th><th>Relationship</th><th>To</th><th>State</th></tr></thead>
                  <tbody>{liveData.traceEdges.map(edge=>(
                    <tr key={edge.edge_code}>
                      <td><code>{edge.edge_code}</code></td>
                      <td>{edge.source_object_type} #{edge.source_object_id}</td>
                      <td>{edge.relationship_type}</td>
                      <td>{edge.target_object_type} #{edge.target_object_id}</td>
                      <td><State text={edge.binding_state}/></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
          <div className="cs-card-grid">
            {rows.map(r=>(
              <article className="cs-card" key={r.id}>
                <div className="cs-card-top"><code>{r.id}</code><State text={r.evaluation?.status || r.state}/></div>
                <h3>{r.object}</h3>
                <dl>
                  <div><dt>Source</dt><dd>{r.source}</dd></div>
                  <div><dt>Applicability</dt><dd>{r.applicability}</dd></div>
                  <div><dt>Driver</dt><dd>{r.driver}</dd></div>
                  <div><dt>Proof</dt><dd>{r.proof}</dd></div>
                  <div><dt>Quantity</dt><dd>{r.quantity}</dd></div>
                  <div><dt>Workload</dt><dd>{r.workload}</dd></div>
                  <div><dt>Cost owner</dt><dd>{r.owner}</dd></div>
                  <div><dt>Commercial</dt><dd>{r.treatment}</dd></div>
                </dl>
                <div className="cs-state-rule">
                  <strong>Smart gate</strong>
                  <span>{r.evaluation?.blockers || 0} blocker / {r.evaluation?.warnings || 0} warning · confidence {r.evaluation?.confidence || 0}%</span>
                </div>
                <footer><strong>Next closure action</strong><span>{r.evaluation?.findings?.[0]?.action || r.next}</span></footer>
              </article>
            ))}
          </div>
        </section>
      )}

      {mode==="schema" && (
        <section className="cs-panel">
          <small>DATABASE BINDING — TARGET CONTROL MODEL</small>
          <h2>Field ที่ต้องมีเพื่อให้ Requirement ↔ Price trace ได้จริง</h2>
          <p className="cs-muted">นี่คือ target binding model สำหรับ MariaDB/API; ไม่ได้อ้างว่าทุก field ถูก migrate แล้ว.</p>
          <div className="cs-table-wrap">
            <table className="cs-table">
              <thead><tr><th>Field / object</th><th>Control role</th><th>Required behavior</th></tr></thead>
              <tbody>{CONTROL_FIELDS.map(r=>(
                <tr key={r[0]}><td><code>{r[0]}</code></td><td><strong>{r[1]}</strong></td><td>{r[2]}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      )}

      {mode==="double" && (
        <section className="cs-panel">
          <small>CONSERVATION / OWNERSHIP RULES</small>
          <h2>งานหนึ่งชิ้น ค่าใช้จ่ายหนึ่งก้อน และการเดินทางหนึ่งครั้ง ต้องมี owner ชัดและนับครั้งเดียว</h2>
          <div className="cs-rule-grid">{ANTI_DOUBLE.map(r=>(
            <article key={r[0]}><h3>{r[0]}</h3><p>{r[1]}</p></article>
          ))}</div>
        </section>
      )}

      {mode==="smart" && (
        <section className="cs-panel">
          <div className="cs-panel-head">
            <div><small>ALGORITHM OUTPUT</small><h2>เงื่อนไขที่ code ตรวจพบจากข้อมูลปัจจุบัน</h2></div>
            <State text={smart.status}/>
          </div>
          <p className="cs-muted">Release intent: {releaseIntent}. Confidence ใช้จัดลำดับ review เท่านั้นและไม่สามารถ override blocker หรือ auto-release.</p>
          <div className="cs-table-wrap">
            <table className="cs-table">
              <thead><tr><th>Severity</th><th>Object</th><th>Stage</th><th>Rule</th><th>Finding</th><th>Required action</th></tr></thead>
              <tbody>{smart.findings.map((f,idx)=>(
                <tr key={f.objectId+"-"+f.code+"-"+idx}>
                  <td><State text={f.severity}/></td>
                  <td><strong>{f.object}</strong><br/><code>{f.objectId}</code></td>
                  <td>{f.stage}</td>
                  <td><code>{f.code}</code></td>
                  <td>{f.message}</td>
                  <td>{f.action}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      )}

      {mode==="state" && (
        <section className="cs-panel">
          <small>STATE DISCIPLINE</small>
          <h2>State เป็นข้อมูลควบคุม ไม่ใช่ข้อความตกแต่ง UI</h2>
          <div className="cs-state-grid">{STATES.map(r=>(
            <article key={r[0]}><State text={r[0]}/><p>{r[1]}</p></article>
          ))}</div>
          <div className="cs-state-rule">
            <strong>Cost State ≠ Commercial Treatment</strong>
            <span>ตัวอย่าง: vendor quote อาจมี cost_state = QUOTED แต่ commercial_treatment ยังเป็น OPTION / BASE / TBC ได้ ต้องเก็บคนละ field.</span>
          </div>
        </section>
      )}
    </div>
  );
}

function State({text}){
  const s=String(text||"").toLowerCase();
  let tone="neutral";
  if(s.includes("ready")||s==="fact"||s==="derived"||s.includes("structure")) tone="good";
  else if(s.includes("warn")||s.includes("conditional")||s.includes("open")||s.includes("tbc")||s.includes("assumption")||s.includes("context")) tone="warn";
  else if(s.includes("block")||s.includes("conflict")) tone="bad";
  return <span className={"cs-state "+tone}>{text}</span>;
}
