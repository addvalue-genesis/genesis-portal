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

export function PagaWorkspace() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("Overview");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/backend/api/etm/paga-workspace.php?project=PJ2608-0550")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((payload) => {
        if (!payload.ok) throw new Error(payload.message || payload.error || "ETM API error");
        setData(payload);
      })
      .catch(setError);
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

  if (error) {
    return (
      <div className="etm-page">
        <h1>PJ2608-0550 · PAGA</h1>
        <div className="etm-alert">
          Rev0 UI is ready; MariaDB/API is not configured yet.
          <br />
          <small>{String(error)}</small>
        </div>
      </div>
    );
  }

  if (!data) return <div className="etm-page">Loading ETM Rev0...</div>;

  return (
    <div className="etm-page">
      <div className="etm-title-row">
        <div>
          <div className="etm-kicker">GENESIS · Engineering Truth Model · Rev0</div>
          <h1>{data.project.code} · PAGA</h1>
          <p>{data.project.name}</p>
        </div>
        <div className="etm-status">DB-backed</div>
      </div>

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
