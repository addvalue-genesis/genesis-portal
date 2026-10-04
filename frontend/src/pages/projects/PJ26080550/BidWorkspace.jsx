import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./BidWorkspace.css";
import { BidFormTracker } from "./BidFormTracker";
import { VdrlProduction } from "./VdrlProduction";
import { EquationKernel } from "./EquationKernel";
import { PricingStrategy } from "./PricingStrategy";

const SOURCE_GROUPS = [
  {
    key: "contract",
    title: "Contract / Commercial Pack",
    detail: "Purchase Agreement + Exhibit A/B/C/D/E/F",
    status: "SOURCE RECEIVED",
    items: [
      "Purchase Agreement",
      "Exhibit A · Scope of Work",
      "Exhibit B · Work Time Schedule",
      "Exhibit C · Commercial Terms / Price Schedules",
      "Exhibit D · Performance Test",
    ],
  },
  {
    key: "technical",
    title: "Technical RFQ Pack",
    detail: "MR / SPE / PHI / BOD / LIS / Drawings / FEED / latest update",
    status: "SOURCE RECEIVED",
    items: [
      "APF / ACP Basic Engineering documents",
      "Construction / updated Telecom documents",
      "Material Requisition and referenced specifications",
      "Tie-in / interface / layout / list / drawing evidence",
    ],
  },
  {
    key: "clarification",
    title: "Clarification / Deviation Pack",
    detail: "TC/TQ + Technical & Commercial Deviation templates",
    status: "ACTIVE",
    items: [
      "Attachment 3 · Technical Deviations List",
      "Attachment 4 · Commercial Deviations List",
      "Technical Clarification / Purchaser responses",
    ],
  },
  {
    key: "vendor",
    title: "Vendor / Subsupplier Inputs",
    detail: "Quotation, BOM, datasheets, deviation, delivery and services",
    status: "PARTIAL",
    items: [
      "OEM / supplier quotation",
      "Datasheet / compliance evidence",
      "Lead time / FAT / field service",
      "Spares / tools / training / warranty",
    ],
  },
];

const SCOPE_ROWS = [
  ["Engineering", "Detailed design, FEED validation, calculations, drawings, AFC / installation engineering", "PARTIAL", "Engineering proof + VDRL + MH"],
  ["Procurement", "All components / ancillary equipment / approved vendors / procurement management", "PARTIAL", "Required MTO + Vendor/TBE + price"],
  ["Fabrication / Assembly", "Manufacturing, assembly, quality and certificates", "OPEN", "Vendor scope + QA/QC cost"],
  ["Inspection / FAT / SIT", "ITP, hold/witness points, FAT/SIT, inspection facilities", "OPEN", "Test scope + witness cost + schedule"],
  ["Packing / Shipping", "Packing, marking, protection, shipping documents, Incoterms", "OPEN", "Logistics + documentation + cost"],
  ["Site Supervision", "Installation, pre-commissioning, commissioning and testing supervision", "OPEN", "Personnel × days/hours + rate"],
  ["Training", "O&M training, plan, trainer, material, facilities, logistics", "OPEN", "Training scope + MH + travel/facility"],
  ["Vendor Documents", "MDDR / VDRS, planned/actual dates, approval status, PTTEP format", "PARTIAL", "VDRL + review cycles + document MH"],
  ["Spares / Tools", "Pre-com/commissioning spares, 2-year spares, capital spares, special tools, consumables", "OPEN", "Separate price schedule / base-vs-option"],
  ["Warranty / Acceptance", "Performance, provisional/final acceptance, warranty obligations", "OPEN", "Risk + lifecycle + payment milestone"],
];

const PRICE_SCHEDULES = [
  ["A1", "Base Scope Lump Sum", "BASE", "Must include ancillaries + pre-com/commissioning/start-up spares/tools + sufficient field service/training"],
  ["A2", "Optional Scope Lump Sum", "OPTION", "Optional supply priced separately"],
  ["C1", "Base Scope Price Breakdown", "BASE", "Equipment / package / services breakdown"],
  ["C2", "Pre-Com & Commissioning Spares", "BASE", "Commissioning-stage spares / consumables"],
  ["C3", "2-Year Operational Spares", "EXCLUDED FROM BASE", "Price separately"],
  ["C4", "Capital Spares", "SEPARATE", "Price separately"],
  ["C5", "Special Tools", "BASE / CHECK", "Commissioning and maintenance tools"],
  ["C6", "First Fill / Consumables", "BASE / CHECK", "Initial fills / consumables"],
  ["C7", "Field Services & Training", "BASE", "Personnel category × total hours × rates; sufficient included time"],
  ["C8", "Services / Facilities", "CALL-OFF / MIXED", "Free-of-charge items vs call-off unit rates"],
];

const OUTPUTS = [
  ["PRICE", "Commercial Price Schedules", "Exhibit C A1/A2 + C1…C8", "NOT READY"],
  ["TECH-DEV", "Technical Deviations", "Attachment 3 template", "ACTIVE"],
  ["COM-DEV", "Commercial Deviations", "Attachment 4 template", "ACTIVE"],
  ["TECH", "Technical Proposal / Compliance", "MR/SPE/PHI/DWG + calculations/studies", "PARTIAL"],
  ["VDRL", "Vendor Document Register", "MDDR / VDRS + PTTEP document control", "PARTIAL"],
  ["SCHED", "Bid / Delivery Schedule", "Exhibit B + milestone / detailed schedule basis", "OPEN"],
];

const DEVIATIONS = [
  {
    type: "TECHNICAL",
    source: "PAGA · current cable schedule",
    issue: "Current APF cable type / length not controlled; loop-loss proof cannot be finalized.",
    response: "Clarification / technical deviation if bidder basis cannot be confirmed before closing.",
    state: "OPEN",
  },
  {
    type: "TECHNICAL",
    source: "PAGA · sound coverage",
    issue: "RPT-0005 / final coverage result not available at quotation stage.",
    response: "Use controlled preliminary basis + include cost to complete study; identify residual hold point.",
    state: "WORKING BASIS",
  },
  {
    type: "COMMERCIAL",
    source: "Field service / training",
    issue: "Exhibit C requires sufficient included service time; no extra payment entitlement for quoted included scope.",
    response: "Need explicit service-day/hour basis and exclusions before price freeze.",
    state: "OPEN",
  },
];

const WORKFLOW = [
  ["1", "Read Bid Pack", "Contract + technical + clarification sources"],
  ["2", "Extract Obligations", "Each clause becomes a traceable bid requirement"],
  ["3", "Decide Response", "Comply / Clarify / Technical Deviation / Commercial Deviation / Option / Exclusion"],
  ["4", "Engineer & Quantify", "First Principles + CAL/SDY/RPT → Required MTO / Work / MH"],
  ["5", "Price", "Map cost into Exhibit C schedules and lifecycle services"],
  ["6", "Generate Submission", "Price schedules + deviation lists + technical/VDRL/schedule outputs"],
];

export function BidWorkspace() {
  const [active, setActive] = useState("overview");
  const [filter, setFilter] = useState("ALL");

  const deviationRows = useMemo(() => {
    if (filter === "ALL") return DEVIATIONS;
    return DEVIATIONS.filter((x) => x.type === filter);
  }, [filter]);

  return (
    <div className="bid-shell">
      <header className="bid-hero">
        <div>
          <div className="bid-eyebrow">PJ2608-0550 · BID SUBMISSION WORKBENCH · REV0</div>
          <h1>Quotation Control — Aung Sinkha Telecom</h1>
          <p>
            เป้าหมายของระบบนี้คือ <strong>ตอบ RFQ ให้ครบ + ระบุ deviation ให้ถูก + คิดราคาให้ไม่ตก scope</strong>
          </p>
        </div>
        <div className="bid-hero-status">
          <span className="preview">PREVIEW / DB MIGRATION PENDING</span>
          <span className="danger">PRICE FREEZE: NOT READY</span>
        </div>
      </header>

      <section className="bid-goal">
        <div>
          <small>THE ACTUAL BID LOGIC</small>
          <h2>เราไม่ได้เริ่มจาก “ราคาเท่าไร” — เราเริ่มจาก “ลูกค้าบังคับให้เรารับผิดชอบอะไรบ้าง”</h2>
          <p>
            Exhibit A ระบุ minimum scope และยังครอบคลุมกิจกรรมที่แม้ไม่ได้เขียนตรง ๆ แต่จำเป็นเพื่อให้ Goods fit for intended purpose.
            จากนั้น Technical Pack บอก requirement รายระบบ; สิ่งที่ทำไม่ได้ต้องถูกแยกเป็น Technical หรือ Commercial Deviation;
            สิ่งที่รับได้ต้องถูก quantify และ map เข้า Price Schedule.
          </p>
        </div>
        <div className="bid-goal-route">
          {WORKFLOW.map(([no, title, detail], i) => (
            <React.Fragment key={no}>
              <div><b>{no}</b><strong>{title}</strong><span>{detail}</span></div>
              {i < WORKFLOW.length - 1 && <em>→</em>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <nav className="bid-tabs">
        {[
          ["overview", "Bid Overview"],
          ["strategy", "Pricing / Win Strategy"],
          ["model", "Method / Equation Engine"],
          ["form", "Bid Form Tracker"],
          ["scope", "Scope / Compliance"],
          ["price", "Price Schedules"],
          ["deviation", "Deviation Control"],
          ["vdrl", "VDRL / Document Production"],
          ["submission", "Submission Outputs"],
        ].map(([key, label]) => (
          <button key={key} className={active === key ? "active" : ""} onClick={() => setActive(key)}>{label}</button>
        ))}
        <Link to="/projects/pj2608-0550/access" className="bid-drill">Team Access</Link>
        <Link to="/projects/pj2608-0550/paga" className="bid-drill">Open PAGA Engineering →</Link>
      </nav>

      {active === "overview" && <Overview />}
      {active === "strategy" && <PricingStrategy />}
      {active === "model" && <EquationKernel />}
      {active === "form" && <BidFormTracker />}
      {active === "scope" && <ScopeView />}
      {active === "price" && <PriceView />}
      {active === "deviation" && (
        <DeviationView filter={filter} setFilter={setFilter} rows={deviationRows} />
      )}
      {active === "vdrl" && <VdrlProduction />}
      {active === "submission" && <SubmissionView />}
    </div>
  );
}

function Overview() {
  return (
    <div className="bid-stack">
      <section className="bid-panel">
        <div className="bid-panel-head">
          <div>
            <small>BID INPUT PACK</small>
            <h2>ข้อมูลที่ระบบต้องอ่านก่อนทำราคา</h2>
          </div>
          <span className="bid-chip">4 SOURCE GROUPS</span>
        </div>
        <div className="bid-source-grid">
          {SOURCE_GROUPS.map((g) => (
            <article key={g.key} className="bid-source-card">
              <div className="bid-source-top">
                <strong>{g.title}</strong>
                <Status status={g.status} />
              </div>
              <p>{g.detail}</p>
              <ul>{g.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bid-panel">
        <div className="bid-panel-head">
          <div>
            <small>WHAT MUST COME OUT</small>
            <h2>ผลลัพธ์สุดท้ายที่ใช้ยื่นราคา</h2>
          </div>
          <span className="bid-chip">SUBMISSION CONTROL</span>
        </div>
        <div className="bid-output-grid">
          {OUTPUTS.map(([code, title, basis, state]) => (
            <div key={code} className="bid-output-card">
              <b>{code}</b>
              <h3>{title}</h3>
              <p>{basis}</p>
              <Status status={state} />
            </div>
          ))}
        </div>
      </section>

      <section className="bid-panel bid-highlight">
        <small>THE CONNECTION TO FIRST PRINCIPLES</small>
        <h2>First Principles เป็น “เครื่องมือหลังบ้าน” เพื่อให้เราตอบเอกสารเสนอราคาได้อย่างมีหลักฐาน</h2>
        <div className="bid-connection">
          <div><span>Contract / Technical Requirement</span><strong>What must we accept?</strong></div>
          <em>→</em>
          <div><span>First Principles / Engineering Proof</span><strong>What is actually required?</strong></div>
          <em>→</em>
          <div><span>MTO / Work / MH / Lifecycle</span><strong>What must we buy and do?</strong></div>
          <em>→</em>
          <div><span>Cost / Deviation</span><strong>What is our price / exception?</strong></div>
          <em>→</em>
          <div><span>Bid Submission</span><strong>What do we send back?</strong></div>
        </div>
      </section>
    </div>
  );
}

function ScopeView() {
  return (
    <section className="bid-panel">
      <div className="bid-panel-head">
        <div>
          <small>EXHIBIT A → BID OBLIGATION MATRIX</small>
          <h2>Scope ไม่ได้มีแค่อุปกรณ์ — ต้อง price งานและบริการทั้ง lifecycle</h2>
        </div>
        <Status status="REVIEW IN PROGRESS" />
      </div>
      <div className="bid-table-wrap">
        <table className="bid-table">
          <thead><tr><th>Scope group</th><th>Obligation / basis</th><th>Status</th><th>What it drives</th></tr></thead>
          <tbody>
            {SCOPE_ROWS.map(([group, basis, state, drives]) => (
              <tr key={group}><td><strong>{group}</strong></td><td>{basis}</td><td><Status status={state} /></td><td>{drives}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bid-callout">
        <strong>Important:</strong>
        <span>
          เมื่อ requirement ใด “ทำไม่ได้ / ไม่รับ / ต้องมีเงื่อนไข” ระบบต้องบังคับให้เลือก response type
          ก่อนปล่อยราคา: Technical Deviation, Commercial Deviation, Clarification, Option หรือ Exclusion.
        </span>
      </div>
    </section>
  );
}

function PriceView() {
  return (
    <div className="bid-stack">
      <section className="bid-panel">
        <div className="bid-panel-head">
          <div>
            <small>EXHIBIT C → PRICE OUTPUT MODEL</small>
            <h2>Cost Model ต้อง map ลงแบบฟอร์มราคาที่ลูกค้าต้องการ ไม่ใช่จบแค่ Internal Cost</h2>
          </div>
          <Status status="PRICE NOT READY" />
        </div>
        <div className="bid-price-grid">
          {PRICE_SCHEDULES.map(([code, title, classif, note]) => (
            <article key={code} className="bid-price-card">
              <div><b>{code}</b><Status status={classif} /></div>
              <h3>{title}</h3>
              <p>{note}</p>
              <footer><span>Source of value</span><strong>ETM Cost Engine → Exhibit C</strong></footer>
            </article>
          ))}
        </div>
      </section>

      <section className="bid-panel bid-formula-panel">
        <small>PARAMETRIC COST ENGINEERING</small>
        <h2>Internal engineering math must end in the customer price form</h2>
        <div className="bid-formulas">
          <code>MH = Q × UMH</code>
          <code>Labor Cost = Σ(MH_role × Rate_role)</code>
          <code>Total Cost = Material + Bulk + Engineering + VDRL + Lifecycle + Spares + Risk</code>
          <code>Selling Price = PricingPolicy(Total Cost, Margin / Markup)</code>
        </div>
        <p>
          Base / Optional / 2-Year Spares / Capital Spares / Tools / Field Service / Training / Facilities
          ต้องแยกตาม Schedule ของ Exhibit C เพื่อไม่ให้ scope ที่ควรอยู่ใน Lump Sum หลุดไปเป็น “extra”.
        </p>
      </section>
    </div>
  );
}

function DeviationView({ filter, setFilter, rows }) {
  return (
    <section className="bid-panel">
      <div className="bid-panel-head">
        <div>
          <small>ATTACHMENT 3 + ATTACHMENT 4</small>
          <h2>สิ่งที่ทำไม่ได้ ต้องไม่หายไป — ต้องออกเป็น Deviation ที่ trace กลับหา clause ได้</h2>
        </div>
        <div className="bid-filter">
          {["ALL", "TECHNICAL", "COMMERCIAL"].map((x) => (
            <button key={x} onClick={() => setFilter(x)} className={filter === x ? "active" : ""}>{x}</button>
          ))}
        </div>
      </div>

      <div className="bid-deviation-map">
        <div className="tech">
          <strong>Technical Deviation</strong>
          <span>Doc / Para / Description → Vendor Deviation → Reason → Contractor/Vendor/Company responses → Resolution / Status / Closure</span>
        </div>
        <div className="commercial">
          <strong>Commercial Deviation</strong>
          <span>Doc / Para / Description → Vendor Deviation → Reason → Purchaser Response → Resolution → Final Closure</span>
        </div>
      </div>

      <div className="bid-table-wrap">
        <table className="bid-table">
          <thead><tr><th>Type</th><th>Source / issue</th><th>Bid response</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((x, idx) => (
              <tr key={idx}>
                <td><span className={"bid-dev-type " + x.type.toLowerCase()}>{x.type}</span></td>
                <td><strong>{x.source}</strong><br/><span>{x.issue}</span></td>
                <td>{x.response}</td>
                <td><Status status={x.state} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SubmissionView() {
  return (
    <div className="bid-stack">
      <section className="bid-panel">
        <div className="bid-panel-head">
          <div>
            <small>READY-TO-SUBMIT PACKAGE</small>
            <h2>Definition of Done ของงานเสนอราคา</h2>
          </div>
          <Status status="NOT READY" />
        </div>
        <div className="bid-submit-grid">
          {OUTPUTS.map(([code, title, basis, state], idx) => (
            <article key={code}>
              <span>{String(idx + 1).padStart(2, "0")}</span>
              <div><strong>{title}</strong><small>{basis}</small></div>
              <Status status={state} />
            </article>
          ))}
        </div>
      </section>

      <section className="bid-panel">
        <small>PROJECT CONTROLS FROM CONTRACT</small>
        <h2>สิ่งที่หลังบ้านต้องรองรับ เพราะมีผลต่อราคาและความเสี่ยง</h2>
        <div className="bid-control-grid">
          <div><strong>Schedule</strong><span>Detailed Work Time Schedule, milestones, engineering/procurement/commissioning dates</span></div>
          <div><strong>Document Control</strong><span>MDDR / VDRS, revision, submission/return dates, approval status</span></div>
          <div><strong>Inspection</strong><span>ITP, Hold/Witness/Review points, FAT/SIT notice and attendance</span></div>
          <div><strong>Site Service</strong><span>10-hour service day basis, supervision, commissioning/testing personnel</span></div>
          <div><strong>Training</strong><span>Training plan, trainer CV, facilities, logistics, materials, OJT/classroom/hands-on</span></div>
          <div><strong>Acceptance / Payment</strong><span>Ready for shipment, Material Receiving, Provisional / Final Acceptance milestones</span></div>
        </div>
      </section>
    </div>
  );
}

function Status({ status }) {
  const text = String(status || "TBC");
  const s = text.toLowerCase();
  let tone = "neutral";
  if (s.includes("ready") || s.includes("received") || s.includes("base")) tone = "good";
  if (s.includes("partial") || s.includes("active") || s.includes("working") || s.includes("review")) tone = "warn";
  if (s.includes("not ready") || s.includes("open") || s.includes("tbc")) tone = "bad";
  return <span className={"bid-status " + tone}>{text}</span>;
}
