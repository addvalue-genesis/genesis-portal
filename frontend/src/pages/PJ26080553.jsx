import React from "react";
import { PROJECT_0553_FACTS } from "../project0553/projectFacts";
import { PROJECT_0553_EVIDENCE, TECHNICAL_HOLDS } from "../project0553/evidenceRegistry";
import "../project0553/project0553.css";

const Badge = ({ children, tone = "open" }) => <span className={`p553-badge p553-badge--${tone}`}>{children}</span>;

export function PJ26080553() {
  const p = PROJECT_0553_FACTS;
  return (
    <section className="p553">
      <header className="p553-hero">
        <div>
          <div className="p553-kicker">INTERNAL WORKING / NOT CUSTOMER RELEASE</div>
          <h1>{p.projectId} <span>{p.packageId}</span></h1>
          <p>{p.title}</p>
        </div>
        <Badge>RFQ SOURCE VERIFICATION ACTIVE</Badge>
      </header>

      <main className="p553-main">
        <section className="p553-callout">
          <strong>Isolation rule</strong>
          <p>{p.isolationRule}</p>
        </section>

        <section className="p553-grid p553-grid--2">
          <article className="p553-panel">
            <h2>Bid control</h2>
            <dl className="p553-dl">
              <div><dt>Working closing input</dt><dd>{p.bidControl.closingWorkingInput}</dd></div>
              <div><dt>Thailand equivalent</dt><dd>{p.bidControl.thailandEquivalentWorkingInput}</dd></div>
              <div><dt>Evidence state</dt><dd><Badge>{p.bidControl.closingEvidenceState}</Badge></dd></div>
            </dl>
            <h3>Required bid packages</h3>
            <ul>{p.bidControl.requiredPackages.map(x => <li key={x}>{x}</li>)}</ul>
          </article>

          <article className="p553-panel">
            <h2>Current source inventory</h2>
            {PROJECT_0553_EVIDENCE.map(e => (
              <div className="p553-evidence" key={e.id}>
                <strong>{e.title}</strong>
                <small>{e.revision} · {e.state}</small>
                <ul>{e.controls.map(c => <li key={c}>{c}</li>)}</ul>
              </div>
            ))}
          </article>
        </section>

        <section className="p553-panel">
          <h2>0553 systems — source-controlled only</h2>
          <div className="p553-table-wrap">
            <table className="p553-table">
              <thead><tr><th>ID</th><th>MR</th><th>System</th><th>Status</th></tr></thead>
              <tbody>{p.systems.map(s => <tr key={s.id}><td>{s.id}</td><td>{s.mr}</td><td>{s.name}</td><td><Badge>{s.status}</Badge></td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="p553-panel">
          <h2>Release blockers / technical holds</h2>
          <div className="p553-table-wrap">
            <table className="p553-table">
              <thead><tr><th>ID</th><th>System</th><th>Issue</th><th>Gate</th></tr></thead>
              <tbody>{TECHNICAL_HOLDS.map(h => <tr key={h.id}><td>{h.id}</td><td>{h.system}</td><td>{h.issue}</td><td><Badge tone="danger">{h.state}</Badge></td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="p553-callout p553-callout--warn">
          <strong>Fail-closed rule</strong>
          <p>TBC / OPEN / missing evidence is not zero and is not compliant. No quantity, price, OEM authorization or delivery commitment is promoted without controlling 0553 evidence.</p>
        </section>
      </main>
    </section>
  );
}
