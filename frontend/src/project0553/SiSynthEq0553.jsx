import React from "react";
import {selectSiSynthScorecard0553} from "./data/siVerificationEquations0553";

const STATE={PASS:"p55-badge",OPEN:"p55-badge"};
function Equations({model}){
 return <section className="p55-panel" data-component-key="bid.engineering.si-synth-eq">
  <div className="p55-eyebrow">SI-CAL · 02 First Principles · SI-SYNTH-EQ</div>
  <h3>Verification equation definitions</h3>
  <p className="p55-note">EQ-UI, EQ-CUS (Ψ_Synth) and EQ-VND (μ(s)) have no formula in this repository. Existing GEQ/PEQ audits on this tab stay the active engineering checks. The missing rules are listed in {model.questions}.</p>
  <table className="p55-table p55-table--compact"><thead><tr><th>ID</th><th>Symbol</th><th>Home</th><th>Formula</th><th>State</th></tr></thead>
   <tbody>{model.equations.map(equation=><tr key={equation.id}><td><strong>{equation.id}</strong></td><td>{equation.symbol||"—"}</td><td>{equation.tab}</td><td>{equation.formula||equation.reason}</td><td><span className={STATE[equation.status]||"p55-badge"}>{equation.status}</span></td></tr>)}</tbody>
  </table>
 </section>;
}
function Registry({model}){
 return <section className="p55-panel" data-component-key="bid.systems.si-synth-eq">
  <div className="p55-eyebrow">SI-REQ · 04 Systems / Requirements · Ψ_Synth + Λ_SI</div>
  <h3>Particular context registry</h3>
  <p className="p55-note">Rows are the four 0553 MR systems already in the project facts and the MTO Rev04 snapshot. No synthesized PHI, DTS, SPE, LIS, Appendix 2, or red-font requirement text is added here. Learned rules Λ_SI: {model.learnedRules.length}.</p>
  <table className="p55-table p55-table--compact"><thead><tr><th>System</th><th>MR source</th><th>MTO Rev04</th><th>Locations</th><th>Existing gates</th><th>State</th></tr></thead>
   <tbody>{model.rows.filter(row=>row.mr!=="COMMON").map(row=><tr key={row.id}><td><strong>{row.mr}</strong><small>{row.name}</small></td><td>{row.mrTitle}<small>{row.mrRevision}</small></td><td>{row.mtoRevision} · {row.mtoRows} rows</td><td>{row.locations.join(", ")||"OPEN"}</td><td>{row.gates.map(gate=>gate.id+" "+gate.status).join("; ")||"none"}</td><td><span className="p55-badge">{row.state}</span></td></tr>)}</tbody>
  </table>
 </section>;
}
function Scorecard({model}){
 return <section className="p55-panel" data-component-key="bid.execution.si-synth-eq">
  <div className="p55-eyebrow">SI-ACT · 06 Execution / Resources · SI-SYNTH-EQ scorecard</div>
  <h3>Live verification scorecard</h3>
  <p className="p55-note">PASS means every existing bid gate in that scope is CLOSED_VERIFIED. OPEN means at least one existing gate is not closed. Equation formulas themselves remain OPEN and are not scored as pass or fail.</p>
  <table className="p55-table p55-table--compact"><thead><tr><th>Scope</th><th>Existing gate states</th><th>Score</th></tr></thead>
   <tbody>{model.rows.map(row=><tr key={row.id}><td><strong>{row.mr}</strong><small>{row.name}</small></td><td>{row.gates.map(gate=>gate.id+": "+gate.status).join("; ")}</td><td><span className="p55-badge">{row.state}</span></td></tr>)}</tbody>
  </table>
 </section>;
}
export function SiSynthEq0553({view}){
 const model=selectSiSynthScorecard0553();
 if(view==="definitions")return <Equations model={model}/>;
 if(view==="registry")return <Registry model={model}/>;
 return <Scorecard model={model}/>;
}
