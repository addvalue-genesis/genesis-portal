import React, { useEffect, useMemo, useState } from "react";
import "./PagaWorkspace.css";

const TABS = [
  "Overview",
  "Evidence",
  "Requirements",
  "CAL / SDY / RPT",
  "Required MTO",
  "VDRL",
  "Work / MH",
  "Lifecycle",
  "Vendor / TBE",
  "Cost / Risk",
];

const PREVIEW_DATA = {
  project: {
    code: "PJ2608-0550",
    name: "SAM PTTEPI MY ASK TEL [MMC24-5002]",
  },
  system: {
    code: "PAGA",
    name: "Public Address and General Alarm",
  },
  locations: [
    { id: 1, location_code: "APF-CATERING", location_name: "Catering Building", cal_count: 4, sdy_count: 1, open_proofs: 3 },
    { id: 2, location_code: "APF-ACCOMMODATION", location_name: "Accommodation Building", cal_count: 0, sdy_count: 0, open_proofs: 0 },
    { id: 3, location_code: "APF-FIRE-SAFETY", location_name: "Fire/Safety Building", cal_count: 0, sdy_count: 0, open_proofs: 0 },
    { id: 4, location_code: "APF-CONTROL", location_name: "Control Building", cal_count: 0, sdy_count: 0, open_proofs: 0 },
  ],
  proofs: [
    { proof_code: "PAGA-SDY-COVER-001", proof_type: "SDY", proof_name: "PAGA Sound Coverage / SNR Study", location_name: "Catering Building", input_status: "INCOMPLETE", result_status: "OPEN", release_gate_status: "NOT_RELEASED" },
    { proof_code: "PAGA-CAL-LOAD-001", proof_type: "CAL", proof_name: "Speaker Tap & Loop Load Calculation", location_name: "Catering Building", input_status: "PARTIAL", result_status: "PRELIMINARY", release_gate_status: "NOT_RELEASED" },
    { proof_code: "PAGA-CAL-AMP-001", proof_type: "CAL", proof_name: "Amplifier Sizing / Loading Calculation", location_name: "Catering Building", input_status: "PARTIAL", result_status: "PRELIMINARY", release_gate_status: "NOT_RELEASED" },
    { proof_code: "PAGA-CAL-LOSS-001", proof_type: "CAL", proof_name: "Speaker Loop Cable Loss Calculation", location_name: "Catering Building", input_status: "BLOCKED", result_status: "OPEN", release_gate_status: "NOT_RELEASED" },
    { proof_code: "PAGA-CAL-UPS-001", proof_type: "CAL", proof_name: "PAGA UPS / Autonomy Calculation", location_name: "Catering Building", input_status: "INCOMPLETE", result_status: "OPEN", release_gate_status: "NOT_RELEASED" },
  ],
  lifecycleStages: [
    { stage_code: "ENGINEERING", stage_name: "Engineering", sequence_no: 10, cost_category: "ENGINEERING" },
    { stage_code: "PROCUREMENT", stage_name: "Procurement", sequence_no: 20, cost_category: "EQUIPMENT" },
    { stage_code: "FAB_INTEGRATION", stage_name: "Fabrication / Integration", sequence_no: 30, cost_category: "FABRICATION" },
    { stage_code: "FAT", stage_name: "Factory Acceptance Test", sequence_no: 40, cost_category: "FAT_IFAT" },
    { stage_code: "IFAT", stage_name: "Integrated Factory Acceptance Test", sequence_no: 50, cost_category: "FAT_IFAT" },
    { stage_code: "PACK_LOGISTICS", stage_name: "Packing / Logistics", sequence_no: 60, cost_category: "LOGISTICS" },
    { stage_code: "INSTALLATION", stage_name: "Site Installation", sequence_no: 70, cost_category: "INSTALLATION" },
    { stage_code: "PRECOM", stage_name: "Pre-Commissioning", sequence_no: 80, cost_category: "PRECOM" },
    { stage_code: "STARTUP", stage_name: "Start-up", sequence_no: 90, cost_category: "STARTUP" },
    { stage_code: "COMMISSIONING", stage_name: "Commissioning", sequence_no: 100, cost_category: "COMMISSIONING" },
    { stage_code: "TRAINING", stage_name: "Training", sequence_no: 110, cost_category: "TRAINING" },
    { stage_code: "SAT", stage_name: "Site Acceptance Test", sequence_no: 120, cost_category: "SAT_ISAT" },
    { stage_code: "ISAT", stage_name: "Integrated Site Acceptance Test", sequence_no: 130, cost_category: "SAT_ISAT" },
    { stage_code: "PUNCH_CLOSEOUT", stage_name: "Punch / Closeout", sequence_no: 140, cost_category: "CLOSEOUT" },
    { stage_code: "WARRANTY_SUPPORT", stage_name: "Warranty / Support", sequence_no: 150, cost_category: "WARRANTY_SUPPORT" },
  ],
};

export function PagaWorkspace() {
  const [data, setData] = useState(PREVIEW_DATA);
  const [tab, setTab] = useState("Overview");
  const [apiError, setApiError] = useState(null);
  const [mode, setMode] = useState("PREVIEW");

  useEffect(() => {
    fetch("/backend/api/etm/paga-workspace.php?project=PJ2608-0550")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((payload) => {
        if (!payload.ok) throw new Error(payload.message || payload.error || "ETM API error");
        setData(payload);
        setMode("LIVE DB");
      })
      .catch((err) => {
        setApiError(err);
        setMode("PREVIEW");
      });
  }, []);

  const summary = useMemo(() => {
    const proofs = data?.proofs || [];
    return {
      total: proofs.length,
      cal: proofs.filter((x) => x.proof_type === "CAL").length,
      sdy: proofs.filter((x) => x.proof_type === "SDY").length,
      open: proofs.filter((x) => !x.result_status || x.result_status === "OPEN").length,
    };
  }, [data]);

  return (
    <div className="etm-page">
      <div className="etm-title-row">
        <div>
          <div className="etm-kicker">GENESIS · Engineering Truth Model · Rev0</div>
          <h1>{data.project.code} · PAGA</h1>
          <p>{data.project.name}</p>
        </div>
        <div className="etm-status">{mode}</div>
      </div>

      {apiError && (
        <div className="etm-alert" style={{ marginBottom: "1rem" }}>
          Preview mode: React UI is running, but MariaDB/API is not connected yet.
          <br />
          <small>{String(apiError)}</small>
        </div>
      )}

      <div className="etm-grid">
        <Metric label="Proof Objects" value={summary.total} />
        <Metric label="CAL" value={summary.cal} />
        <Metric label="SDY" value={summary.sdy} />
        <Metric label="Open Proof" value={summary.open} />
      </div>

      <div className="etm-tabs">
        {TABS.map((x) => (
          <button key={x} className={tab === x ? "active" : ""} onClick={() => setTab(x)}>
            {x}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <section className="etm-panel">
          <h2>Engineering Digital Thread</h2>
          <div className="etm-flow">
            {[
              "SOURCE",
              "REQUIREMENT",
              "CAL / SDY",
              "RPT",
              "REQUIRED MTO",
              "VENDOR / TBE",
              "LIFECYCLE",
              "ACCEPTANCE",
              "COST / RISK",
            ].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>

          <h3>Locations</h3>
          <table className="etm-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>CAL</th>
                <th>SDY</th>
                <th>Open</th>
              </tr>
            </thead>
            <tbody>
              {data.locations.map((x) => (
                <tr key={x.id}>
                  <td>
                    <strong>{x.location_name}</strong>
                    <br />
                    <small>{x.location_code}</small>
                  </td>
                  <td>{Number(x.cal_count || 0)}</td>
                  <td>{Number(x.sdy_count || 0)}</td>
                  <td>{Number(x.open_proofs || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === "CAL / SDY / RPT" && (
        <section className="etm-panel">
          <h2>Engineering Proof Register</h2>
          <table className="etm-table">
            <thead>
              <tr>
                <th>Proof</th>
                <th>Type</th>
                <th>Location</th>
                <th>Input</th>
                <th>Result</th>
                <th>Gate</th>
              </tr>
            </thead>
            <tbody>
              {data.proofs.map((x) => (
                <tr key={x.proof_code}>
                  <td>
                    <strong>{x.proof_code}</strong>
                    <br />
                    <small>{x.proof_name}</small>
                  </td>
                  <td>{x.proof_type}</td>
                  <td>{x.location_name || "-"}</td>
                  <td>{x.input_status || "-"}</td>
                  <td>{x.result_status || "-"}</td>
                  <td>{x.release_gate_status || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === "Lifecycle" && (
        <section className="etm-panel">
          <h2>Lifecycle Delivery & Acceptance</h2>
          <div className="etm-life">
            {data.lifecycleStages.map((x) => (
              <div className="etm-life-card" key={x.stage_code}>
                <small>{x.sequence_no}</small>
                <strong>{x.stage_name}</strong>
                <span>{x.cost_category}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {!["Overview", "CAL / SDY / RPT", "Lifecycle"].includes(tab) && (
        <section className="etm-panel">
          <h2>{tab}</h2>
          <div className="etm-empty">
            Rev0 schema reserves this module; detailed database wiring is the next increment.
          </div>
        </section>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="etm-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
