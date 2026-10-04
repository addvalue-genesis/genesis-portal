import React, { useEffect, useMemo, useState } from "react";
import "./PagaWorkspace.css";

const VIEWS = [
  { key: "trace", label: "First Principles Trace" },
  { key: "proof", label: "CAL / SDY / RPT" },
  { key: "mto", label: "Required MTO + Vendor" },
  { key: "vdrl", label: "VDRL + Work / MH" },
  { key: "lifecycle", label: "Lifecycle + Cost" },
];

const LOCATIONS = [
  { code: "APF-CATERING", name: "Catering", state: "ACTIVE", detail: "Vertical slice in progress" },
  { code: "APF-ACCOMMODATION", name: "Accommodation", state: "BASELINE", detail: "Historical baseline ready" },
  { code: "APF-FIRE-SAFETY", name: "Fire / Safety", state: "BASELINE", detail: "Historical baseline ready" },
  { code: "APF-CONTROL", name: "Control Building", state: "REFERENCE", detail: "Main PAGA node reference" },
];

const CATERING = {
  historical: {
    speakers: 8,
    tags: "LSN-303-201 ... LSN-303-208",
    remoteNode: "PAGA-303-201",
    mainNode: "PAGA-303-351",
  },
  sources: [
    { code: "LAY-0002", rev: "C1", title: "Catering Telecom Equipment Layout & Cable Routing", cls: "A" },
    { code: "SPE-0004", rev: "B1", title: "PAGA Specification", cls: "A" },
    { code: "PHI-0001", rev: "B1", title: "Telecommunication Design Philosophy", cls: "A" },
    { code: "PHI-0002", rev: "B1", title: "Telecommunication Interface Philosophy", cls: "A" },
    { code: "BOD-0001", rev: "C8", title: "Basis of Design", cls: "A" },
    { code: "10008-STD-6-TEL-007", rev: "R00", title: "PTTEP PAGA General Specification", cls: "A" },
    { code: "TC / TQ-007", rev: "2026-09-16", title: "CPECC PAGA coverage clarification", cls: "A" },
  ],
  requirements: [
    { label: "Speech / message", value: "≥65 dBA", state: "SOURCE" },
    { label: "Speech SNR", value: "+10 to +20 dB vs ambient", state: "WORKING" },
    { label: "Alarm", value: "≥6 dB above ambient", state: "SOURCE" },
    { label: "Beacon", value: "Required when ambient ≥85 dBA", state: "SOURCE" },
    { label: "Amplifier load", value: "≤80% nominal", state: "SOURCE" },
    { label: "Loop loss", value: "≤20%", state: "SOURCE" },
    { label: "Redundancy", value: "N+1 / hot standby", state: "SOURCE" },
    { label: "UPS", value: "60 min continuous alarm", state: "SOURCE" },
  ],
  interfaces: ["F&G", "PABX", "Entertainment Mute", "Remote Node ↔ Main MCU", "UPS / Power", "Network / Monitoring"],
  blockers: [
    { title: "Ambient noise", detail: "Current Catering ambient-noise input not yet controlled", impact: "Blocks final speaker tap / beacon decision" },
    { title: "Current geometry", detail: "Latest architectural geometry / listener distance required", impact: "Blocks final coverage result" },
    { title: "APF cable schedule", detail: "Current cable type / length not yet confirmed", impact: "Blocks loop-loss and bulk cable" },
    { title: "Loop topology", detail: "Two-loop arrangement is a working hypothesis only", impact: "Blocks final loop assignment" },
  ],
};

const PROOFS = [
  {
    id: "PAGA-SDY-COVER-001",
    type: "SDY",
    name: "Sound Coverage / SNR Study",
    status: "OPEN",
    formula: "Acoustic simulation / coverage mapping",
    inputs: "Geometry + Ambient Noise + Speaker SPL / Directivity / Tap",
    output: "Speaker / beacon positions, taps, coverage result",
  },
  {
    id: "PAGA-CAL-LOAD-001",
    type: "CAL",
    name: "Speaker Tap & Loop Load",
    status: "PRELIMINARY",
    formula: "P_loop = Σ P_tap,i",
    inputs: "Historical 8 tags × candidate 8 W maximum tap",
    output: "64 W upper-bound screening load",
  },
  {
    id: "PAGA-CAL-AMP-001",
    type: "CAL",
    name: "Amplifier Sizing / Loading",
    status: "PRELIMINARY PASS",
    formula: "P_allow = P_nominal × 0.80",
    inputs: "300 W vendor candidate amplifier",
    output: "240 W allowed; 64 W load ⇒ 1 active amp by capacity",
  },
  {
    id: "PAGA-CAL-LOSS-001",
    type: "CAL",
    name: "Speaker Loop Cable Loss",
    status: "BLOCKED",
    formula: "100 V line loss using cable R + route length + connected load",
    inputs: "Current cable schedule missing",
    output: "TBC — must be ≤20%",
  },
  {
    id: "PAGA-CAL-UPS-001",
    type: "CAL",
    name: "UPS / Autonomy",
    status: "OPEN",
    formula: "Energy / load autonomy calculation",
    inputs: "Final node + beacon + electronics load",
    output: "TBC — verify 60 min alarm duty",
  },
];

const MTO_ROWS = [
  { object: "Indoor loudspeaker", required: "TBC", baseline: "8 historical tags", vendor: "LD 8 UE/IP54 EN54 candidate", state: "PROOF OPEN" },
  { object: "Remote amplifier node", required: "TBC", baseline: "PAGA-303-201", vendor: "1 node offered for Catering", state: "PRELIM MATCH" },
  { object: "Active amplifier", required: "1 by capacity screening", baseline: "Historical amp qty not authority", vendor: "1 × NPA 300 W active", state: "PRELIM MATCH" },
  { object: "N+1 amplifier", required: "Required", baseline: "N+1 requirement", vendor: "1 × NPA 300 W N+1", state: "PRELIM MATCH" },
  { object: "Flashing beacon", required: "TBC", baseline: "No Catering tag found ≠ zero scope", vendor: "Project-wide beacons offered", state: "NOISE INPUT NEEDED" },
  { object: "Speaker loop cable", required: "TBC", baseline: "Legacy routing only", vendor: "No final APF cable schedule", state: "BLOCKED" },
  { object: "F&G / PABX / Entertainment I/O", required: "TBC", baseline: "Functional tie-ins required", vendor: "Implementation to reconcile", state: "INTERFACE OPEN" },
];

const RPT_PACKAGE = [
  ["RPT section", "Requirement & Design Criteria Register", "AVAILABLE / EVOLVING"],
  ["RPT section", "Input / Assumption / Hold Register", "PARTIAL"],
  ["SDY", "Ambient Noise / Operating Scenario Study", "INPUT MISSING"],
  ["SDY", "Speaker Acoustic Coverage & SNR Study", "OPEN"],
  ["CAL", "Speaker Deployment Calculation", "TBC"],
  ["CAL", "Speaker Tap & Loop Load", "PRELIMINARY"],
  ["CAL", "Amplifier Sizing / Loading", "PRELIMINARY"],
  ["CAL", "Loop Cable Loss", "BLOCKED"],
  ["CAL", "UPS Load & Autonomy", "OPEN"],
  ["SDY", "Tie-In / Interface Assessment", "PARTIAL"],
  ["RPT section", "Required MTO Reconciliation", "NOT RELEASED"],
  ["TEST", "FAT / IFAT + SAT / Walk-Round", "PLANNED"],
];

const LIFECYCLE = [
  "Engineering",
  "Procurement",
  "Fabrication / Integration",
  "FAT",
  "IFAT",
  "Packing / Logistics",
  "Installation",
  "Pre-Commissioning",
  "Start-up",
  "Commissioning",
  "Training",
  "SAT",
  "ISAT",
  "Punch / Closeout",
  "Warranty / Support",
];

const COST_BUCKETS = [
  "Equipment",
  "Bulk",
  "Engineering MH",
  "VDRL / Document MH",
  "FAT / IFAT",
  "Logistics",
  "Installation MH",
  "Pre-Com",
  "Start-up",
  "Commissioning",
  "Training",
  "SAT / ISAT",
  "Spares / Tools",
  "Regulatory",
  "PM / Admin",
  "Warranty / Support",
  "Risk",
];

export function PagaWorkspace() {
  const [view, setView] = useState("trace");
  const [location, setLocation] = useState("APF-CATERING");
  const [mode, setMode] = useState("PREVIEW");
  const [apiError, setApiError] = useState(null);
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    fetch("/backend/api/etm/paga-workspace.php?project=PJ2608-0550")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((payload) => {
        if (!payload.ok) throw new Error(payload.message || payload.error || "ETM API error");
        setLiveData(payload);
        setMode("LIVE DB");
      })
      .catch((err) => {
        setApiError(err);
        setMode("PREVIEW");
      });
  }, []);

  const selectedLocation = LOCATIONS.find((x) => x.code === location) || LOCATIONS[0];

  const proofSummary = useMemo(() => {
    const rows = liveData?.proofs?.length ? liveData.proofs : PROOFS;
    return {
      total: rows.length,
      open: rows.filter((x) => ["OPEN", "BLOCKED"].some((s) => String(x.status || x.result_status).includes(s))).length,
    };
  }, [liveData]);

  return (
    <div className="etm-shell">
      <header className="etm-hero">
        <div>
          <div className="etm-eyebrow">GENESIS · Engineering Truth Model · Rev0</div>
          <div className="etm-title-line">
            <h1>PJ2608-0550</h1>
            <span className="etm-divider">/</span>
            <h1>PAGA</h1>
          </div>
          <p className="etm-subtitle">SAM PTTEPI MY ASK TEL [MMC24-5002]</p>
        </div>
        <div className="etm-hero-actions">
          <span className={`etm-mode ${mode === "LIVE DB" ? "live" : "preview"}`}>{mode}</span>
          <span className="etm-release">MTO RELEASE: NOT READY</span>
        </div>
      </header>

      {apiError && (
        <div className="etm-preview-note">
          <strong>Preview dataset</strong>
          <span>
            React UI is showing the Rev06 engineering baseline while MariaDB/API migration is pending.
            {apiError ? ` API: ${String(apiError)}` : ""}
          </span>
        </div>
      )}

      <section className="etm-summary-grid">
        <SummaryCard label="Historical speakers" value="8" detail="LSN-303-201 … 208" tone="blue" />
        <SummaryCard label="Engineering proofs" value={String(proofSummary.total)} detail="CAL + SDY objects" tone="violet" />
        <SummaryCard label="Prelim loop load" value="64 W" detail="8 × 8 W upper-bound" tone="green" />
        <SummaryCard label="Amp allowable" value="240 W" detail="300 W × 80%" tone="green" />
        <SummaryCard label="Open blockers" value="4" detail="Noise · Geometry · Cable · Loop" tone="amber" />
        <SummaryCard label="Evidence state" value="A / B / C / D" detail="Source · Derived · TBC · Model" tone="slate" />
      </section>

      <nav className="etm-view-tabs">
        {VIEWS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={view === item.key ? "active" : ""}
            onClick={() => setView(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section className="etm-location-strip">
        <div className="etm-location-label">LOCATION</div>
        {LOCATIONS.map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => setLocation(item.code)}
            className={location === item.code ? "active" : ""}
          >
            <span>{item.name}</span>
            <small>{item.detail}</small>
          </button>
        ))}
      </section>

      {selectedLocation.code !== "APF-CATERING" ? (
        <section className="etm-panel etm-coming">
          <div>
            <div className="etm-section-kicker">{selectedLocation.code}</div>
            <h2>{selectedLocation.name}</h2>
            <p>
              Rev0 has the location node reserved. Detailed migration from the historical evidence baseline
              will follow the same First Principles structure used for Catering.
            </p>
          </div>
          <StatusPill status={selectedLocation.state} />
        </section>
      ) : (
        <>
          {view === "trace" && <TraceView />}
          {view === "proof" && <ProofView />}
          {view === "mto" && <MtoView />}
          {view === "vdrl" && <VdrlView />}
          {view === "lifecycle" && <LifecycleView />}
        </>
      )}
    </div>
  );
}

function TraceView() {
  const stages = [
    ["01", "SOURCE", "7 controlled references", "ready"],
    ["02", "REQUIREMENT", "Acoustic · load · loss · redundancy · tie-in", "ready"],
    ["03", "ENGINEERING INPUT", "4 critical inputs still open", "warn"],
    ["04", "CAL", "Load / Amp preliminary · Loss / UPS open", "partial"],
    ["05", "SDY", "Coverage / SNR study open", "warn"],
    ["06", "RPT-0005", "Official PAGA Sound Coverage Study Report", "partial"],
    ["07", "REQUIRED MTO", "Release blocked until proof closes", "blocked"],
    ["08", "VENDOR / TBE", "INDUSTRONIC reconciliation partial", "partial"],
    ["09", "EXECUTION", "FAT → SAT lifecycle reserved", "partial"],
    ["10", "COST", "TBC ≠ zero cost", "blocked"],
  ];

  return (
    <div className="etm-content-stack">
      <section className="etm-panel">
        <div className="etm-panel-head">
          <div>
            <div className="etm-section-kicker">VERTICAL SLICE · CATERING</div>
            <h2>First Principles Engineering Thread</h2>
            <p>See exactly how source evidence becomes an engineering result, then MTO, vendor scope and cost.</p>
          </div>
          <div className="etm-legend">
            <span><i className="a" />A Source</span>
            <span><i className="b" />B Derived</span>
            <span><i className="c" />C TBC</span>
            <span><i className="d" />D Model</span>
          </div>
        </div>

        <div className="etm-thread">
          {stages.map(([no, label, detail, state], index) => (
            <React.Fragment key={label}>
              <div className={`etm-thread-node ${state}`}>
                <span className="etm-thread-no">{no}</span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </div>
              {index < stages.length - 1 && <div className="etm-thread-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="etm-two-col">
        <section className="etm-panel">
          <div className="etm-section-kicker">A · SOURCE FACTS</div>
          <h3>Controlled evidence feeding Catering</h3>
          <div className="etm-source-list">
            {CATERING.sources.map((src) => (
              <div className="etm-source-row" key={src.code}>
                <span className="etm-class a">A</span>
                <div>
                  <strong>{src.code} <em>{src.rev}</em></strong>
                  <small>{src.title}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="etm-panel">
          <div className="etm-section-kicker">REQUIREMENT / CONSTRAINT</div>
          <h3>What the engineering must prove</h3>
          <div className="etm-requirement-grid">
            {CATERING.requirements.map((req) => (
              <div className="etm-requirement-card" key={req.label}>
                <small>{req.label}</small>
                <strong>{req.value}</strong>
                <span>{req.state}</span>
              </div>
            ))}
          </div>
          <div className="etm-interface-box">
            <small>TIE-IN / INTERFACE</small>
            <div>{CATERING.interfaces.map((x) => <span key={x}>{x}</span>)}</div>
          </div>
        </section>
      </div>

      <section className="etm-panel">
        <div className="etm-section-kicker">HISTORICAL DESIGN → CURRENT ENGINEERING</div>
        <h3>What we know now — and what it means</h3>
        <div className="etm-result-grid">
          <ResultCard label="Historical device baseline" value="8 speakers" detail={CATERING.historical.tags} cls="A" />
          <ResultCard label="Legacy remote node" value={CATERING.historical.remoteNode} detail={`Tie to ${CATERING.historical.mainNode}`} cls="A" />
          <ResultCard label="Candidate full-tap load" value="64 W" detail="8 historical tags × 8 W candidate tap" cls="B" />
          <ResultCard label="Allowed amp load" value="240 W" detail="300 W × 80% project loading rule" cls="B" />
          <ResultCard label="Active amp by capacity" value="1 × 300 W" detail="Capacity screen only; final topology still open" cls="B" />
          <ResultCard label="Required speaker quantity" value="TBC" detail="Coverage / noise study controls final quantity" cls="C" />
        </div>
      </section>

      <section className="etm-panel">
        <div className="etm-panel-head">
          <div>
            <div className="etm-section-kicker">RELEASE GATE</div>
            <h3>Why Required MTO is not released yet</h3>
          </div>
          <StatusPill status="NOT READY" />
        </div>
        <div className="etm-blocker-grid">
          {CATERING.blockers.map((item) => (
            <div className="etm-blocker" key={item.title}>
              <span>!</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
                <small>{item.impact}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProofView() {
  return (
    <section className="etm-panel">
      <div className="etm-panel-head">
        <div>
          <div className="etm-section-kicker">ENGINEERING PROOF</div>
          <h2>CAL / SDY / RPT — not one document type</h2>
          <p>Each proof object has its own inputs, equation / method, result and release status.</p>
        </div>
        <StatusPill status="5 PROOF OBJECTS" />
      </div>

      <div className="etm-proof-grid">
        {PROOFS.map((proof) => (
          <article className="etm-proof-card" key={proof.id}>
            <div className="etm-proof-top">
              <span className={`etm-proof-type ${proof.type.toLowerCase()}`}>{proof.type}</span>
              <StatusPill status={proof.status} small />
            </div>
            <h3>{proof.name}</h3>
            <code>{proof.id}</code>
            <dl>
              <div><dt>Formula / method</dt><dd>{proof.formula}</dd></div>
              <div><dt>Input</dt><dd>{proof.inputs}</dd></div>
              <div><dt>Current output</dt><dd>{proof.output}</dd></div>
            </dl>
          </article>
        ))}
      </div>

      <div className="etm-rpt-flow">
        <div><strong>CAL</strong><span>Atomic numeric proof</span></div>
        <b>+</b>
        <div><strong>SDY</strong><span>Study / simulation / optimization</span></div>
        <b>→</b>
        <div className="emphasis"><strong>RPT-0005</strong><span>Controlled project conclusion</span></div>
        <b>→</b>
        <div><strong>MTO</strong><span>Released only after proof closes</span></div>
      </div>
    </section>
  );
}

function MtoView() {
  return (
    <div className="etm-content-stack">
      <section className="etm-panel">
        <div className="etm-panel-head">
          <div>
            <div className="etm-section-kicker">ENGINEERING TRUTH VS SUPPLIER TRUTH</div>
            <h2>Required MTO → Vendor Offered → Gap</h2>
            <p>Vendor BOM never becomes the requirement. Required quantity must come from controlled engineering proof.</p>
          </div>
          <StatusPill status="RECONCILIATION PARTIAL" />
        </div>

        <div className="etm-table-wrap">
          <table className="etm-data-table">
            <thead>
              <tr>
                <th>Engineering object</th>
                <th>Required</th>
                <th>Historical / source basis</th>
                <th>Vendor offered / candidate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MTO_ROWS.map((row) => (
                <tr key={row.object}>
                  <td><strong>{row.object}</strong></td>
                  <td>{row.required}</td>
                  <td>{row.baseline}</td>
                  <td>{row.vendor}</td>
                  <td><StatusPill status={row.state} small /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="etm-three-col">
        <InfoPanel kicker="REQUIRED" title="Engineering truth" text="Derived from Requirement → CAL / SDY → RPT. This is the procurement basis." />
        <InfoPanel kicker="OFFERED" title="Supplier truth" text="INDUSTRONIC BOM, datasheet, deviation and proposed architecture." />
        <InfoPanel kicker="TBE" title="Technical acceptability" text="Comply / Clarify / Deviation / Not Comply + capability, regulatory and lifecycle responsibility." />
      </div>
    </div>
  );
}

function VdrlView() {
  return (
    <div className="etm-two-col etm-align-start">
      <section className="etm-panel">
        <div className="etm-section-kicker">VDRL / DOCUMENT ENGINE</div>
        <h2>RPT-0005 Evidence Package</h2>
        <p className="etm-muted">The document is generated from database objects, calculations, tables, figures and images — not maintained as an isolated Word file.</p>
        <div className="etm-package-list">
          {RPT_PACKAGE.map(([type, name, state], idx) => (
            <div className="etm-package-row" key={name}>
              <span className="etm-package-no">{String(idx + 1).padStart(2, "0")}</span>
              <div>
                <small>{type}</small>
                <strong>{name}</strong>
              </div>
              <StatusPill status={state} small />
            </div>
          ))}
        </div>
      </section>

      <div className="etm-content-stack">
        <section className="etm-panel">
          <div className="etm-section-kicker">DOCUMENT CONTENT BLOCKS</div>
          <h3>PTTEP template-ready output</h3>
          <div className="etm-token-grid">
            {["Cover / Header / Footer", "Revision History", "Text", "Calculation Table", "Chart", "Coverage Image", "Drawing", "Source Citation", "Appendix"].map((x) => <span key={x}>{x}</span>)}
          </div>
          <div className="etm-export-row">
            <button type="button">DOCX</button>
            <button type="button">XLSX</button>
            <button type="button">PDF</button>
          </div>
          <small className="etm-muted">Export actions are UI placeholders until the document API is connected.</small>
        </section>

        <section className="etm-panel">
          <div className="etm-section-kicker">WORK / MANHOUR ENGINE</div>
          <h3>Every deliverable is also a workload driver</h3>
          <div className="etm-equation">MH = Q × UMH</div>
          <div className="etm-equation secondary">MH_doc = MH_base + Review Cycles × MH_revision + MH_final</div>
          <div className="etm-role-list">
            {["Lead Telecom Engineer", "System Engineer", "CAD / Designer", "Document Controller", "QA/QC", "Project Manager"].map((x) => <span key={x}>{x}</span>)}
          </div>
          <p className="etm-muted">Rates and UMH remain TBC until controlled estimating inputs are approved.</p>
        </section>
      </div>
    </div>
  );
}

function LifecycleView() {
  return (
    <div className="etm-content-stack">
      <section className="etm-panel">
        <div className="etm-section-kicker">PROJECT LIFECYCLE / EXECUTION & ACCEPTANCE</div>
        <h2>Engineering does not stop at MTO</h2>
        <div className="etm-lifecycle-line">
          {LIFECYCLE.map((x, idx) => (
            <React.Fragment key={x}>
              <div className="etm-life-step"><span>{String(idx + 1).padStart(2, "0")}</span><strong>{x}</strong></div>
              {idx < LIFECYCLE.length - 1 && <b>›</b>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="etm-two-col etm-align-start">
        <section className="etm-panel">
          <div className="etm-section-kicker">SPARES / TOOLS</div>
          <h3>Commercially separate quantity bases</h3>
          <div className="etm-token-grid">
            {["Start-up Spares", "Commissioning Spares", "Operational Spares", "2-Year Spares", "Capital / Insurance", "Special Tools", "Consumables"].map((x) => <span key={x}>{x}</span>)}
          </div>
          <p className="etm-muted">Each spare class carries its own quantity basis, responsibility, lifecycle stage and cost state.</p>
        </section>

        <section className="etm-panel">
          <div className="etm-section-kicker">TOTAL PROJECT COST MODEL</div>
          <h3>TBC is visible — never treated as zero</h3>
          <div className="etm-cost-grid">
            {COST_BUCKETS.map((x) => (
              <div key={x}><span>{x}</span><strong>TBC</strong></div>
            ))}
          </div>
          <div className="etm-cost-formula">
            Project Cost = Σ Material + Σ Work/MH + Σ Lifecycle Services + Σ Spares + Σ Risk
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, detail, tone }) {
  return (
    <div className={`etm-summary-card ${tone || ""}`}>
      <small>{label}</small>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  );
}

function ResultCard({ label, value, detail, cls }) {
  return (
    <div className="etm-result-card">
      <div className={`etm-class ${String(cls).toLowerCase()}`}>{cls}</div>
      <small>{label}</small>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  );
}

function StatusPill({ status, small = false }) {
  const raw = String(status || "TBC");
  const normalized = raw.toLowerCase();
  let tone = "neutral";
  if (normalized.includes("pass") || normalized.includes("match") || normalized.includes("ready")) tone = "good";
  if (normalized.includes("open") || normalized.includes("partial") || normalized.includes("prelim") || normalized.includes("baseline")) tone = "warn";
  if (normalized.includes("block") || normalized.includes("not ready") || normalized.includes("not released") || normalized.includes("missing")) tone = "bad";
  return <span className={`etm-pill ${tone} ${small ? "small" : ""}`}>{raw}</span>;
}

function InfoPanel({ kicker, title, text }) {
  return (
    <section className="etm-panel etm-info-panel">
      <div className="etm-section-kicker">{kicker}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}
