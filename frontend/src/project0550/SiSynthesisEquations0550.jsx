import React, { useMemo } from 'react';
import { SYSTEMS } from './data';
import {
  SI_SYNTH_EQUATIONS_0550,
  SI_LEARNED_RULES_0550,
  evaluateSiSynthEquations0550,
} from './data/siVerificationEquations0550';

export function SiSynthesisEquations0550({ mode = 'cal' }) {
  const result = useMemo(
    () => evaluateSiSynthEquations0550({ systems: SYSTEMS }),
    []
  );

  if (mode === 'cal') {
    return (
      <section className="p55-panel" aria-label="SI-SYNTH-EQ First Principles">
        <h3>SI-SYNTH-EQ — 3-Group Holistic Verification &amp; Synthesis Equations</h3>
        <div className="p55-table-wrap">
          <table className="p55-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Equation Group</th>
                <th>SI Home</th>
                <th>Formal Formula</th>
                <th>Governance Control</th>
              </tr>
            </thead>
            <tbody>
              {SI_SYNTH_EQUATIONS_0550.map((eq) => (
                <tr key={eq.id}>
                  <td><strong>{eq.id}</strong></td>
                  <td>{eq.name}</td>
                  <td>{eq.homeTab}</td>
                  <td><code>{eq.formula}</code></td>
                  <td>{eq.control}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (mode === 'req') {
    return (
      <section className="p55-panel" aria-label="SI-SYNTH-EQ Learned Rules Registry">
        <h3>Particular Context &amp; Learned Rules Registry (Ψ_Synth + Λ_SI)</h3>
        <div className="p55-table-wrap">
          <table className="p55-table">
            <thead>
              <tr>
                <th>Rule ID</th>
                <th>Scope</th>
                <th>Synthesized Multi-Document Rule</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {SI_LEARNED_RULES_0550.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.id}</strong></td>
                  <td>{r.scope}</td>
                  <td>{r.rule}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <section className="p55-panel" aria-label="SI-SYNTH-EQ Verification Scorecard">
      <h3>SI-SYNTH-EQ Live Verification Scorecard ({result.passedChecks}/{result.totalChecks} Gates PASS)</h3>
      <div className="p55-table-wrap">
        <table className="p55-table">
          <thead>
            <tr>
              <th>Gate Check</th>
              <th>Equation</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {result.checks.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.id}</strong></td>
                <td>{c.equation}</td>
                <td>{c.passed ? 'PASS' : 'FAIL'}</td>
                <td>{c.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details>
        <summary>19 Systems + COMMON Scorecard ({result.systemScorecard.length} scopes)</summary>
        <div className="p55-table-wrap">
          <table className="p55-table">
            <thead>
              <tr>
                <th>System</th>
                <th>EQ-UI</th>
                <th>EQ-CUS</th>
                <th>EQ-VND</th>
              </tr>
            </thead>
            <tbody>
              {result.systemScorecard.map((s) => (
                <tr key={s.token}>
                  <td>{s.token} · {s.name}</td>
                  <td>{s.eqUi}</td>
                  <td>{s.eqCus}</td>
                  <td>{s.eqVnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
