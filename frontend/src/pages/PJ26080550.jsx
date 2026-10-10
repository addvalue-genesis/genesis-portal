import { EngineeringView as SharedEngineeringView } from "../common/ui/EngineeringView";
import { ArchitectureView as SharedArchitectureView } from "../common/ui/ArchitectureView";
import { SystemsView as SharedSystemsView } from "../common/ui/SystemsView";
import { ProjectWorkspaceShell } from "../common/ui/ProjectWorkspaceShell";
import React, { useMemo, useState } from "react";
import {
  ARCHITECTURE_MANIFEST,
  BUDGETARY_ESTIMATE,
  BUDGETARY_SUBMISSION,
  B1_COST_LINEAGE,
  CNEEC_BREAKDOWN,
  COMMERCIAL_POLICY,
  COMMERCIAL_SOURCES,
  CONTROL_RULES,
  CORE_TEAM,
  EXECUTION_CAMPAIGNS,
  ENGINEERING_LAW_LIBRARY,
  FIRST_PRINCIPLES_CHAIN,
  LOGISTICS_GATES,
  MODULE_REGISTRY,
  KNOWLEDGE_KERNEL_DOMAINS,
  OPTIONS,
  PROJECT_0550,
  PROJECT_0550_FACTS,
  REQUIREMENT_COMPLETENESS,
  RISK_SCENARIOS,
  SERVICE_EQUATION_SOURCE,
  SERVICE_LINE_DERIVATION,
  SOURCE_REGISTER,
  SYSTEM_GROUPS,
  SYSTEMS,
} from "../project0550/data";
import { exportOriginalPriceFormXlsx } from "../project0550/exportOriginalPriceForm";
import "../project0550/project0550.css";

const TABS = [
  { id: "overview", label: "Executive" },
  { id: "architecture", label: "Architecture" },
  { id: "systems", label: "19 Systems" },
  { id: "engineering", label: "First Principles" },
  { id: "execution", label: "Execution" },
  { id: "budget", label: "Budget" },
  { id: "risk", label: "Risk & Controls" },
  { id: "documents", label: "Evidence" },
];

function money(value, currency) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function compactMoney(value, currency) {
  if (value === null || value === undefined) return "—";
  const prefix = currency === "USD" ? "$" : currency === "EUR" ? "€" : "฿";
  if (value >= 1_000_000) return prefix + (value / 1_000_000).toFixed(2) + "M";
  if (value >= 1_000) return prefix + (value / 1_000).toFixed(1) + "K";
  return prefix + value.toFixed(0);
}

function priceCell(row, currency) {
  if (currency === "EUR") return Number.isFinite(row.eur) ? money(row.eur, "EUR") : "—";
  return Number.isFinite(row[currency.toLowerCase()]) ? money(row[currency.toLowerCase()], currency) : "HOLD";
}

function toneFor(value = "") {
  const text = String(value).toUpperCase();
  if (
    text.includes("CURRENT_QUOTE") ||
    text.includes("SOURCE-BACKED") ||
    text.includes("LOCKED") ||
    text.includes("MANDATORY")
  ) return "good";
  if (
    text.includes("CONFLICT") ||
    text.includes("NOT FOUND") ||
    text.includes("CRITICAL") ||
    text.includes("OPEN")
  ) return "danger";
  if (
    text.includes("DUMMY") ||
    text.includes("HIST") ||
    text.includes("TBC") ||
    text.includes("WORKING") ||
    text.includes("PRELIMINARY")
  ) return "warn";
  return "neutral";
}

function Badge({ children, tone }) {
  return <span className={"p55-badge p55-badge--" + (tone || toneFor(children))}>{children}</span>;
}

function SectionTitle({ eyebrow, title, text, action }) {
  return (
    <div className="p55-section-title">
      <div>
        {eyebrow ? <div className="p55-eyebrow">{eyebrow}</div> : null}
        <h2>{title}</h2>
        {text ? <p>{text}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

function MetricCard({ label, value, sub, tone = "default" }) {
  return (
    <div className={"p55-metric p55-metric--" + tone}>
      <div className="p55-metric__label">{label}</div>
      <div className="p55-metric__value">{value}</div>
      {sub ? <div className="p55-metric__sub">{sub}</div> : null}
    </div>
  );
}

function B1CostLineageTable() {
  const [groupId, setGroupId] = useState("SYSTEM_ENGINEERING");
  const lineage = B1_COST_LINEAGE;
  const selected = lineage.groups.find((g) => g.id === groupId) || lineage.groups[0];

  return (
    <div className="p55-derivation-block">
      <div className="p55-eyebrow" style={{ marginBottom: 8 }}>B1 — 24M control total reconciliation</div>

      <div className="p55-table-wrap">
        <table className="p55-table p55-table--compact p55-table--derivation">
          <thead>
            <tr>
              <th>Layer</th>
              <th className="is-number">MH</th>
              <th className="is-number">Equivalent person-days @ 8h</th>
              <th className="is-number">THB</th>
              <th>Evidence state</th>
            </tr>
          </thead>
          <tbody>
            {lineage.groups.map((g) => (
              <tr key={g.id}>
                <td><strong>{g.label}</strong><small>{g.id}</small></td>
                <td className="is-number">{g.mh.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
                <td className="is-number">{g.eqDays.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
                <td className="is-number">{money(g.baseThb, "THB")}</td>
                <td><Badge tone="good">RECOVERED BOTTOM-UP</Badge></td>
              </tr>
            ))}
            <tr>
              <td><strong>Recovered bottom-up subtotal</strong></td>
              <td />
              <td />
              <td className="is-number"><strong>{money(lineage.recoveredBottomUpThb, "THB")}</strong></td>
              <td><Badge tone="good">TRACEABLE</Badge></td>
            </tr>
            <tr>
              <td><strong>Unattributed reconciliation gap</strong><small>Current Rev10 allowance minus latest traceable Rev04 bottom-up model</small></td>
              <td>—</td>
              <td>—</td>
              <td className="is-number"><strong>{money(lineage.reconciliationGapThb, "THB")}</strong></td>
              <td><Badge tone="danger">NOT YET DERIVED</Badge></td>
            </tr>
            <tr>
              <td><strong>Current B1 control total</strong></td>
              <td />
              <td />
              <td className="is-number"><strong>{money(lineage.currentAllowanceThb, "THB")}</strong></td>
              <td><Badge tone="warn">WORKING ALLOWANCE</Badge></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="p55-note">
        <strong>Audit conclusion:</strong> {lineage.interpretation}
      </p>

      <div className="p55-filterbar p55-filterbar--simple" style={{ marginTop: 14 }}>
        <label>
          <span>Breakdown group</span>
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            {lineage.groups.map((g) => <option value={g.id} key={g.id}>{g.label}</option>)}
          </select>
        </label>
        <Badge tone="neutral">{selected.rows.length} detail rows</Badge>
      </div>

      <div className="p55-table-wrap" style={{ marginTop: 10 }}>
        {selected.id === "COMMON_PROJECT" ? (
          <table className="p55-table p55-table--compact p55-table--derivation">
            <thead>
              <tr>
                <th>ID</th>
                <th>Work / cost object</th>
                <th className="is-number">Driver qty</th>
                <th>Unit</th>
                <th>Role</th>
                <th className="is-number">USD/h</th>
                <th className="is-number">MH</th>
                <th className="is-number">Eq. person-days</th>
                <th className="is-number">Base THB</th>
                <th>Source / formula basis</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {selected.rows.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.id}</strong></td>
                  <td>{r.item}<small>{r.note}</small></td>
                  <td className="is-number">{r.driverQty ?? "—"}</td>
                  <td>{r.unit || "—"}</td>
                  <td>{r.role}</td>
                  <td className="is-number">{Number.isFinite(r.rateUsdH) ? money(r.rateUsdH, "USD") : "FIXED QUOTE"}</td>
                  <td className="is-number">{r.mh || "—"}</td>
                  <td className="is-number">{Number.isFinite(r.eqDays) ? r.eqDays.toFixed(2) : "—"}</td>
                  <td className="is-number">{money(r.baseThb, "THB")}</td>
                  <td>{r.source}</td>
                  <td><Badge>{r.state}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="p55-table p55-table--compact p55-table--derivation">
            <thead>
              <tr>
                <th>System / Token</th>
                <th className="is-number">Underlying rows</th>
                <th className="is-number">MH</th>
                <th className="is-number">Eq. person-days @ 8h</th>
                <th className="is-number">Model base THB</th>
                <th className="is-number">Internal cost THB</th>
                <th>People / crew interpretation</th>
              </tr>
            </thead>
            <tbody>
              {selected.rows.map((r) => (
                <tr key={r.token}>
                  <td><strong>{SYSTEMS.find((s) => s.token === r.token)?.name || r.token}</strong><small>{r.token}</small></td>
                  <td className="is-number">{r.rows}</td>
                  <td className="is-number">{r.mh.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
                  <td className="is-number">{r.eqDays.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
                  <td className="is-number">{money(r.baseThb, "THB")}</td>
                  <td className="is-number">{money(r.internalCostThb, "THB")}</td>
                  <td>Workload is expressed as person-hours/person-days; actual concurrent headcount is TBC until the resource-loaded schedule is approved.</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p55-table-wrap" style={{ marginTop: 10 }}>
        <table className="p55-table p55-table--compact p55-table--derivation">
          <thead><tr><th>Source</th><th>Drive ID</th><th>Date</th><th>Controlled sheets used</th></tr></thead>
          <tbody><tr>
            <td><strong>{lineage.source.file}</strong></td>
            <td>{lineage.source.driveId}</td>
            <td>{lineage.source.date}</td>
            <td>{lineage.source.sheets.join(" · ")}</td>
          </tr></tbody>
        </table>
      </div>
    </div>
  );
}

function DerivationBasisTable({ code, directThb }) {
  const model = SERVICE_LINE_DERIVATION[code];
  if (!model) return null;

  return (
    <div className="p55-derivation-block">
      <div className="p55-eyebrow" style={{ marginBottom: 8 }}>Cost derivation / method recovered from prior model</div>

      <div className="p55-table-wrap">
        <table className="p55-table p55-table--compact p55-table--derivation">
          <thead>
            <tr>
              <th>Control field</th>
              <th>Recovered basis / meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>Current direct allowance</strong></td><td>{directThb === null ? "EXCLUDED" : money(directThb, "THB")}</td></tr>
            <tr><td><strong>Source model</strong></td><td>{model.sourceModel}</td></tr>
            <tr><td><strong>Recovered structure</strong></td><td>{model.recoveredStructure}</td></tr>
            <tr><td><strong>Driver / calculation inputs</strong></td><td>{model.sourceColumns}</td></tr>
            <tr><td><strong>Derivation principle</strong></td><td>{model.driverSummary}</td></tr>
            <tr><td><strong>What the current total means</strong></td><td>{model.currentAllowanceMeaning}</td></tr>
            <tr><td><strong>Reconciliation state</strong></td><td><Badge>{model.currentStatus}</Badge></td></tr>
            <tr><td><strong>Recovered source file</strong></td><td>{SERVICE_EQUATION_SOURCE.file} · {SERVICE_EQUATION_SOURCE.date}</td></tr>
          </tbody>
        </table>
      </div>

      {(model.methods || []).length ? (
        <>
          <div className="p55-eyebrow" style={{ marginTop: 14, marginBottom: 8 }}>Equation / calculation logic</div>
          <div className="p55-table-wrap">
            <table className="p55-table p55-table--compact p55-table--derivation">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Purpose</th>
                  <th>Equation</th>
                  <th>Counting / control rule</th>
                </tr>
              </thead>
              <tbody>
                {model.methods.map((method) => (
                  <tr key={method.id}>
                    <td><strong>{method.id}</strong></td>
                    <td>{method.purpose}</td>
                    <td><code>{method.equation}</code></td>
                    <td>{method.control}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <p className="p55-note">
        <strong>Control:</strong> {SERVICE_EQUATION_SOURCE.keyRule}
      </p>
    </div>
  );
}

function Overview() {
  const openProofs = SYSTEMS.filter(
    (s) => s.proofState.includes("PRELIMINARY") || s.proofState.includes("CONFLICT") || s.proofState.includes("NOT FOUND")
  ).length;
  const paga = PROJECT_0550.selectedPaga;
  const submission = BUDGETARY_SUBMISSION;

  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="Management view"
        title="Project control spine"
        text="Engineering/commercial closure and customer budgetary submission are controlled as separate states. Final RELEASED_SELL remains HOLD, while the emergency SAMTEL Rev00 budgetary snapshot was issued on 08-Oct-2026."
      />

      <div className="p55-grid p55-grid--2">
        <section className="p55-callout p55-callout--warning">
          <strong>Engineering / Final Customer Release</strong>
          <p>
            <strong>HOLD / CONTROLLED.</strong> Open engineering proofs, vendor/OEM closures, quantity reconciliation and final commercial authorization remain before a formal Released Customer Output can be issued.
          </p>
        </section>

        <section className="p55-callout">
          <strong>Emergency Budgetary Submission</strong>
          <p>
            <strong>ISSUED — {submission?.revision || "SAMTEL FINAL Rev00"}.</strong> Frozen preliminary USD snapshot for ADDVALUE → SAMTEL → CNEEC. It is historical evidence of what was sent and must not be overwritten by later working-price updates.
          </p>
        </section>
      </div>

      <div className="p55-metric-grid">
        <MetricCard label="Systems" value="19" sub="Controlled engineering spine" />
        <MetricCard
          label="Final release"
          value="HOLD"
          sub="RELEASED_SELL not yet authorized"
          tone="warn"
        />
        <MetricCard
          label="Budgetary base"
          value={compactMoney(submission?.baseBeforeOptionsUsd || 0, "USD")}
          sub="Part A + customer B1-B6 · issued 08-Oct-2026"
          tone="good"
        />
        <MetricCard
          label="C2 + C3 options"
          value={compactMoney(submission?.optionsC2C3Usd || 0, "USD")}
          sub="C1 physical installation excluded"
        />
        <MetricCard
          label="Management envelope"
          value={compactMoney(submission?.managementEnvelopeUsd || 0, "USD")}
          sub="Budgetary reference only · do not back-solve"
          tone="warn"
        />
        <MetricCard
          label="FX snapshot"
          value={String(submission?.fxThbUsd || PROJECT_0550.fxThbUsd)}
          sub="THB/USD used for SAMTEL Rev00"
        />
      </div>

      <div className="p55-grid p55-grid--2">
        <section className="p55-panel">
          <div className="p55-panel__head">
            <div>
              <div className="p55-eyebrow">Governing method</div>
              <h3>First Principles → Constraint → Proof → Quantity → Cost</h3>
            </div>
            <Badge tone="good">LOCKED</Badge>
          </div>
          <div className="p55-chain p55-chain--compact">
            {FIRST_PRINCIPLES_CHAIN.slice(0, 12).map((step, idx) => (
              <React.Fragment key={step}>
                <span className="p55-chain__step">{step}</span>
                {idx < 11 ? <span className="p55-chain__arrow">→</span> : null}
              </React.Fragment>
            ))}
          </div>
          <p className="p55-note">
            Vendor selection follows Requirement → Constraint → CAL/Study/RPT → Engineering Proof → Architecture → Required Quantity → Cost. Unknown scope remains OPEN/TBC and is never silently treated as zero.
          </p>
        </section>

        <section className="p55-panel">
          <div className="p55-panel__head">
            <div>
              <div className="p55-eyebrow">Selected PAGA basis</div>
              <h3>{paga.vendor} · {paga.offer}</h3>
            </div>
            <Badge tone="good">SELECTED</Badge>
          </div>
          <div className="p55-policy-list">
            <div className="p55-policy">
              <div><strong>Base net</strong><p>{money(paga.baseNetEur, "EUR")} · {paga.delivery}</p></div>
              <Badge>DIRECT QUOTE</Badge>
            </div>
            <div className="p55-policy">
              <div><strong>Known requirement additions</strong><p>AP712 +1 and XBC Beacon Control</p></div>
              <Badge>DERIVED / PRICED</Badge>
            </div>
            <div className="p55-policy">
              <div><strong>Known selected subtotal</strong><p>{money(paga.knownSelectedSubtotalEur, "EUR")}</p></div>
              <Badge>{paga.state}</Badge>
            </div>
          </div>
        </section>
      </div>

      <section className="p55-panel">
        <SectionTitle
          eyebrow="Release controls"
          title="What management should watch before final price release"
          text={"Emergency budgetary has already been issued; these are the main closures before it can become a formal Released Customer Output. Open/preliminary proof count: " + openProofs + "."}
        />
        <div className="p55-control-grid">
          {[
            ["Vendor/OEM quote replacement", "Replace working allowances with current quotations through revision control", "HIGH"],
            ["PAGA engineering proof", "Sound coverage / amplifier loading / cabinet and loop reconciliation", "HIGH"],
            ["CCTV proof", "Coverage, lens, bandwidth and storage closure", "HIGH"],
            ["FO / bulk MTO", "Replace historical route proxy with current quantity take-off", "HIGH"],
            ["Myanmar permits", "Equipment freeze, frequency / DCA / import / type-approval path", "HIGH"],
            ["Resource continuity", "Call-off external specialist cover for FAT / IFAT / SAT Deploy / commissioning", "PROTECTED"],
          ].map(([name, text, state]) => (
            <div className="p55-control" key={name}>
              <div className="p55-control__dot" />
              <div>
                <strong>{name}</strong>
                <p>{text}</p>
              </div>
              <Badge>{state}</Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ArchitectureView(){return <SharedArchitectureView manifest={ARCHITECTURE_MANIFEST} modules={MODULE_REGISTRY}/>;}

function SystemsView() {
 return <SharedSystemsView initialExpandedTokens={["TEL-PAGA"]} systems={SYSTEMS} systemGroups={SYSTEM_GROUPS} title="System group view" description="Expand by discipline, or switch to a single-system focus view. Each system keeps proof state, quantity state, commercial basis and closure action visible." />;
}

function EngineeringView(){return <SharedEngineeringView model={{projectId:"PJ2608-0550",completeness:REQUIREMENT_COMPLETENESS,lawLibrary:ENGINEERING_LAW_LIBRARY,systems:SYSTEMS,chain:FIRST_PRINCIPLES_CHAIN,domains:KNOWLEDGE_KERNEL_DOMAINS,controlRules:CONTROL_RULES,costEquations:["Customer Service = ADDVALUE Sell × 1.05","Goods Customer = Cost × 1.20 / 0.95"]}}/>;}

function ExecutionView() {
  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="Resource-loaded execution"
        title="Core team + vendor campaign model"
        text="One shared ADDVALUE core team runs cross-system engineering, FAT, SAT, punch and handover. OEM specialists join only where applicable."
      />

      <section className="p55-panel">
        <div className="p55-timeline">
          {EXECUTION_CAMPAIGNS.map((campaign, index) => (
            <div className="p55-timeline__item" key={campaign.id}>
              <div className="p55-timeline__rail">
                <span>{index + 1}</span>
                {index < EXECUTION_CAMPAIGNS.length - 1 ? <i /> : null}
              </div>
              <div className="p55-timeline__body">
                <div className="p55-timeline__top">
                  <div>
                    <small>{campaign.id} · {campaign.location}</small>
                    <strong>{campaign.title}</strong>
                  </div>
                  <div className="p55-timeline__meta">
                    <span>{campaign.days} days</span>
                    <Badge>{campaign.state}</Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="p55-grid p55-grid--2">
        <section className="p55-panel">
          <SectionTitle eyebrow="Protected resource rates" title="Core team continuity" text="External replacement cost forms a floor so staff illness or unavailability does not automatically create a loss." />
          <div className="p55-table-wrap">
            <table className="p55-table p55-table--compact">
              <thead><tr><th>Role</th><th>ADDVALUE</th><th>SAMTEL/CNEEC</th><th>Cover</th></tr></thead>
              <tbody>
                {CORE_TEAM.map((r) => (
                  <tr key={r.role}>
                    <td><strong>{r.role}</strong></td>
                    <td>{money(r.protectedUsdDay, "USD")}/d</td>
                    <td>{money(r.customerUsdDay, "USD")}/d</td>
                    <td><Badge>{r.scarcity}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="p55-panel">
          <SectionTitle eyebrow="Myanmar logistics" title="Release gates" text="Logistics is a lifecycle domain, not a freight percentage." />
          <div className="p55-gate-list">
            {LOGISTICS_GATES.map((gate, index) => (
              <div className="p55-gate" key={gate.gate}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{gate.gate}</strong><p>{gate.detail}</p></div>
                <Badge>{gate.state}</Badge>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="p55-callout">
        <strong>Execution boundary</strong>
        <p>
          Nantong is a working FAT assumption. Ranong is source-backed as a PTTEPI logistics point, but the exact 0550 route, customs owner, importer of record and Myanmar inland delivery responsibility remain project-binding items to close.
        </p>
      </section>
    </div>
  );
}

function BudgetView() {
  const [currency, setCurrency] = useState("USD");
  const [part, setPart] = useState("ALL");
  const [budgetMode, setBudgetMode] = useState("budgetary");
  const [expandedBudgetSystems, setExpandedBudgetSystems] = useState(() => new Set());
  const [expandedBudgetB, setExpandedBudgetB] = useState(() => new Set());
  const [expandedBudgetC, setExpandedBudgetC] = useState(() => new Set());

  const rows = CNEEC_BREAKDOWN.filter((row) => part === "ALL" || row.code.startsWith(part));
  const paga = PROJECT_0550.selectedPaga;
  const budget = BUDGETARY_ESTIMATE;
  const submission = BUDGETARY_SUBMISSION;

  const directTotal = budget?.directDeliveryBasisThb || 0;
  const calculated = budget?.calculatedCustomerBeforeRoundingThb || 0;

  const submissionBaseRows = (submission?.customerRows || []).filter(
    (row) => row.code.startsWith("A1-") || ["B1","B2","B3","B4","B5","B6"].includes(row.code)
  );
  const submissionOptions = (submission?.customerRows || []).filter(
    (row) => ["C1","C2","C3"].includes(row.code)
  );

  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="Commercial state control"
        title="Working / emergency budgetary / released customer output"
        text="Keep the evolving internal model, the 08-Oct emergency SAMTEL budgetary snapshot and the final released customer output as three different states. A later working-price change must never rewrite what was already issued."
        action={
          budgetMode === "released" ? (
            <div className="p55-segmented">
              <button className={currency === "USD" ? "is-active" : ""} onClick={() => setCurrency("USD")} type="button">USD</button>
              <button className={currency === "THB" ? "is-active" : ""} onClick={() => setCurrency("THB")} type="button">THB</button>
              <button className={currency === "EUR" ? "is-active" : ""} onClick={() => setCurrency("EUR")} type="button">EUR</button>
            </div>
          ) : <Badge tone={budgetMode === "budgetary" ? "warn" : "neutral"}>{budgetMode === "budgetary" ? "FROZEN SNAPSHOT" : "INTERNAL ONLY"}</Badge>
        }
      />

      <div className="p55-filterbar p55-filterbar--simple">
        <div className="p55-segmented p55-segmented--commercial">
          {[
            ["working", "Working Preview"],
            ["budgetary", "Budgetary Submission"],
            ["released", "Released Customer Output"],
          ].map(([id, label]) => (
            <button key={id} className={budgetMode === id ? "is-active" : ""} onClick={() => setBudgetMode(id)} type="button">
              {label}
            </button>
          ))}
        </div>
        <div className="p55-commercial-state">
          {budgetMode === "working" ? <><strong>7.1 WORKING_SELL projection</strong><span>internal only</span></> : null}
          {budgetMode === "budgetary" ? <><strong>{submission?.revision || "SAMTEL Rev00"}</strong><span>Emergency / Preliminary · 08-Oct-2026</span></> : null}
          {budgetMode === "released" ? <><strong>Authorized RELEASED_SELL only</strong><span>budgetary snapshot is not final release</span></> : null}
        </div>
      </div>

      {budgetMode === "working" && budget ? (
        <>
          <div className="p55-metric-grid">
            <MetricCard label="Part A direct" value={compactMoney(budget.partADirectThb, "THB")} sub="Equipment / vendor / attributable bulk" tone="good" />
            <MetricCard label="Part B direct" value={compactMoney(budget.partBDirectThb, "THB")} sub="Engineering / execution / logistics / specialist" />
            <MetricCard label="Part C direct" value={compactMoney(budget.partCDirectThb, "THB")} sub="C2 + C3; C1 excluded" />
            <MetricCard label="Direct delivery basis" value={compactMoney(directTotal, "THB")} sub="Internal working basis" />
            <MetricCard label="Commercialized working" value={compactMoney(calculated, "THB")} sub="Before management envelope / quote replacement" />
            <MetricCard label="FX working" value="33.6335" sub="THB/USD used for 08-Oct snapshot; refresh for next issue" />
          </div>

          <section className="p55-panel">
            <SectionTitle
              eyebrow="Resource substitution protection"
              title="External specialist = call-off, not full-project FTE"
              text="Specialists are loaded only against the design/FAT/IFAT/SAT/commissioning window that requires their competency. SAT Deploy is the peak field call-off period."
            />
            <div className="p55-grid p55-grid--2">
              <div className="p55-evidence-card">
                <Badge tone="good">USD {budget.externalSpecialistPolicy.basisUsdPerWorkingDay.toLocaleString("en-US")} / working MD minimum</Badge>
                <p>{budget.externalSpecialistPolicy.usage}</p>
              </div>
              <div className="p55-evidence-card">
                <Badge tone="warn">SEPARATE TRIP / CASH COST</Badge>
                <p>{budget.externalSpecialistPolicy.excludedFromDayRate.join(" · ")}</p>
              </div>
            </div>
            <p className="p55-note"><strong>Peak:</strong> {budget.externalSpecialistPolicy.keyPeak}</p>
          </section>

          <section className="p55-panel">
            <SectionTitle
              eyebrow="Part A internal derivation"
              title="19-system direct budget basis + component breakdown"
              text="Expand each system to see the internal equipment / subsystem / software / interface / bulk / engineering / test composition. Detail remains working-controlled and is revalidated against source evidence."
              action={
                <div className="p55-segmented">
                  <button
                    type="button"
                    onClick={() => setExpandedBudgetSystems(new Set(budget.partA.map((row) => row.token)))}
                  >
                    Expand all
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedBudgetSystems(new Set())}
                  >
                    Collapse all
                  </button>
                </div>
              }
            />
            <div className="p55-table-wrap">
              <table className="p55-table p55-table--budget">
                <thead>
                  <tr>
                    <th></th>
                    <th>No.</th>
                    <th>System</th>
                    <th>Internal basis</th>
                    <th>Detail state</th>
                    <th className="is-number">Direct THB</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.partA.map((row) => {
                    const isOpen = expandedBudgetSystems.has(row.token);
                    return (
                      <React.Fragment key={row.token}>
                        <tr>
                          <td>
                            <button
                              className="p55-row-toggle"
                              type="button"
                              aria-label={(isOpen ? "Collapse " : "Expand ") + row.system}
                              onClick={() => setExpandedBudgetSystems((current) => {
                                const next = new Set(current);
                                if (next.has(row.token)) next.delete(row.token);
                                else next.add(row.token);
                                return next;
                              })}
                            >
                              {isOpen ? "−" : "+"}
                            </button>
                          </td>
                          <td>{String(row.no).padStart(2, "0")}</td>
                          <td><strong>{row.system}</strong><small>{row.token}</small></td>
                          <td>{row.basis}</td>
                          <td><Badge>{row.detailState || "WORKING"}</Badge></td>
                          <td className="is-number">{money(row.directThb, "THB")}</td>
                        </tr>
                        {isOpen ? (
                          <tr className="p55-budget-detail-row">
                            <td colSpan="6">
                              <div className="p55-budget-detail">
                                <div className="p55-budget-detail__head">
                                  <strong>{row.system} — detailed internal breakdown</strong>
                                  <span>{(row.components || []).length} scope items · {(row.pricingTrace || []).length} price/source trace rows</span>
                                </div>

                                {(row.commercialSourceIds || []).map((sourceId) => {
                                  const source = COMMERCIAL_SOURCES.find((item) => item.id === sourceId);
                                  if (!source) return null;
                                  const terms = source.commercialTerms || {};
                                  return (
                                    <section className="p55-source-detail" key={source.id}>
                                      <div className="p55-source-detail__head">
                                        <div>
                                          <div className="p55-eyebrow">Source quotation / evidence</div>
                                          <h4>{source.vendor} — {source.offerNo}</h4>
                                          <p>{source.project}</p>
                                        </div>
                                        <Badge tone="good">{source.controlState}</Badge>
                                      </div>

                                      <div className="p55-source-facts">
                                        <div><span>Offer date</span><strong>{source.offerDate}</strong></div>
                                        <div><span>Inquiry</span><strong>{source.inquiryNo}</strong></div>
                                        <div><span>Currency</span><strong>{source.currency}</strong></div>
                                        <div><span>Gross total</span><strong>{money(source.grossTotal, source.currency)}</strong></div>
                                        <div><span>Discount</span><strong>{source.discountPercent}% / {money(source.discountAmount, source.currency)}</strong></div>
                                        <div><span>Final price</span><strong>{money(source.finalPrice, source.currency)}</strong></div>
                                      </div>

                                      <div className="p55-grid p55-grid--2">
                                        <div className="p55-evidence-card">
                                          <div className="p55-eyebrow">Commercial conditions</div>
                                          <dl className="p55-source-terms">
                                            <div><dt>Validity</dt><dd>{terms.validity || "TBC"}</dd></div>
                                            <div><dt>Delivery</dt><dd>{terms.deliveryTerm || "TBC"}</dd></div>
                                            <div><dt>Payment</dt><dd>{terms.paymentTerm || "TBC"}</dd></div>
                                            <div><dt>Delivery time</dt><dd>{terms.deliveryTime || "TBC"}</dd></div>
                                            <div><dt>Warranty</dt><dd>{terms.warranty || "TBC"}</dd></div>
                                            <div><dt>Net weight</dt><dd>{terms.netWeight || "TBC"}</dd></div>
                                            <div><dt>VAT / tax</dt><dd>{terms.vat || "TBC"}</dd></div>
                                            <div><dt>Partial shipment</dt><dd>{terms.partialShipment || "TBC"}</dd></div>
                                          </dl>
                                        </div>
                                        <div className="p55-evidence-card">
                                          <div className="p55-eyebrow">Contract / offer controls</div>
                                          <ul className="p55-rule-list">
                                            {(source.scopeAndConditions || []).map((item) => <li key={item}>{item}</li>)}
                                          </ul>
                                        </div>
                                      </div>

                                      <div className="p55-eyebrow" style={{marginTop:16, marginBottom:8}}>Quoted item detail</div>
                                      <div className="p55-table-wrap">
                                        <table className="p55-table p55-table--compact p55-table--quoted">
                                          <thead>
                                            <tr><th>Code</th><th>Description</th><th className="is-number">Qty</th><th>Unit</th><th className="is-number">Unit price</th><th className="is-number">Total</th><th>State</th></tr>
                                          </thead>
                                          <tbody>
                                            {(source.priceGroups || []).map((line) => (
                                              <tr key={line.code}>
                                                <td><strong>{line.code}</strong></td>
                                                <td>{line.description}</td>
                                                <td className="is-number">{line.qty}</td>
                                                <td>{line.unit}</td>
                                                <td className="is-number">{money(line.unitPrice, source.currency)}</td>
                                                <td className="is-number">{money(line.total, source.currency)}</td>
                                                <td><Badge>{line.state}</Badge></td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>

                                      {(source.activationDetail || []).length ? (
                                        <div className="p55-evidence-card" style={{marginTop:12}}>
                                          <div className="p55-eyebrow">Activation / software detail included in quoted bundle</div>
                                          <p>{source.activationDetail.join(" · ")}</p>
                                        </div>
                                      ) : null}

                                      <div className="p55-evidence-card" style={{marginTop:12}}>
                                        <div className="p55-eyebrow">Source location</div>
                                        <p><strong>{source.sourceLocation?.fileName}</strong> · Drive file ID {source.sourceLocation?.driveFileId}</p>
                                      </div>
                                    </section>
                                  );
                                })}

                                <div className="p55-eyebrow" style={{marginTop:18, marginBottom:8}}>Internal budget bridge</div>
                                <div className="p55-table-wrap">
                                  <table className="p55-table p55-table--compact">
                                    <thead>
                                      <tr>
                                        <th>Cost line</th>
                                        <th className="is-number">Qty</th>
                                        <th>Unit</th>
                                        <th className="is-number">Value</th>
                                        <th>Curr.</th>
                                        <th>Role</th>
                                        <th>Source / basis</th>
                                        <th>State</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(row.pricingTrace || []).map((line) => (
                                        <tr key={line.id || line.description}>
                                          <td><strong>{line.description}</strong>{line.id ? <small>{line.id}</small> : null}</td>
                                          <td className="is-number">{line.qty ?? "—"}</td>
                                          <td>{line.unit || "—"}</td>
                                          <td className="is-number">{Number.isFinite(line.extended) ? money(line.extended, line.currency || "THB") : "TBC"}</td>
                                          <td>{line.currency || "—"}</td>
                                          <td><Badge tone={String(line.role).includes("ADDITIVE") && !String(line.role).includes("NON_ADDITIVE") ? "good" : "neutral"}>{line.role}</Badge></td>
                                          <td>{line.source}</td>
                                          <td><Badge>{line.state}</Badge></td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                {row.budgetBridge ? (
                                  <div className="p55-callout p55-callout--warning" style={{marginTop:12}}>
                                    <strong>Why the internal allowance is not the same as the vendor quotation</strong>
                                    <p>{row.budgetBridge.explanation}</p>
                                    <p><strong>Replacement rule:</strong> {row.budgetBridge.replacementRule}</p>
                                  </div>
                                ) : null}
                                <p className="p55-note"><strong>Price trace rule:</strong> {row.priceTraceRule}</p>

                                <div className="p55-eyebrow" style={{marginTop:18, marginBottom:8}}>Scope composition / completeness</div>
                                <div className="p55-table-wrap">
                                  <table className="p55-table p55-table--compact p55-table--scope">
                                    <thead>
                                      <tr>
                                        <th>Item</th>
                                        <th>Category</th>
                                        <th>Source / basis</th>
                                        <th>State</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(row.components || []).map((component) => (
                                        <tr key={component.id}>
                                          <td><strong>{component.item}</strong><small>{component.id}</small></td>
                                          <td>{component.category}</td>
                                          <td>{component.source}</td>
                                          <td><Badge>{component.state}</Badge></td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <p className="p55-note">
                                  Scope rows show what the system must contain. Price/source rows show what is actually priced or used as evidence. Unknown component quantities or unit prices remain TBC rather than being allocated by guess.
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="p55-panel">
            <SectionTitle
              eyebrow="Part B internal derivation"
              title="Service / logistics / specialist working basis"
              text="Expand B1-B9 to see the activity/work-package composition behind each direct allowance. Detailed cost allocation remains TBC until resource, vendor, travel, permit and logistics evidence closes."
              action={
                <div className="p55-segmented">
                  <button type="button" onClick={() => setExpandedBudgetB(new Set(budget.partB.map((row) => row.code)))}>Expand all</button>
                  <button type="button" onClick={() => setExpandedBudgetB(new Set())}>Collapse all</button>
                </div>
              }
            />
            <div className="p55-table-wrap">
              <table className="p55-table p55-table--budget">
                <thead><tr><th></th><th>Code</th><th>Description</th><th>Class</th><th className="is-number">Direct THB</th><th>Detail state</th><th>Control note</th></tr></thead>
                <tbody>
                  {budget.partB.map((row) => {
                    const isOpen = expandedBudgetB.has(row.code);
                    return (
                      <React.Fragment key={row.code}>
                        <tr>
                          <td>
                            <button
                              className="p55-row-toggle"
                              type="button"
                              onClick={() => setExpandedBudgetB((current) => {
                                const next = new Set(current);
                                if (next.has(row.code)) next.delete(row.code);
                                else next.add(row.code);
                                return next;
                              })}
                            >
                              {isOpen ? "−" : "+"}
                            </button>
                          </td>
                          <td><strong>{row.code}</strong></td>
                          <td>{row.description}</td>
                          <td><Badge>{row.pricingClass}</Badge></td>
                          <td className="is-number">{money(row.directThb, "THB")}</td>
                          <td><Badge>{row.detailState || "WORKING"}</Badge></td>
                          <td>{row.note}</td>
                        </tr>
                        {isOpen ? (
                          <tr className="p55-budget-detail-row">
                            <td colSpan="7">
                              <div className="p55-budget-detail">
                                <div className="p55-budget-detail__head">
                                  <strong>{row.code} — activity / work-package breakdown</strong>
                                  <span>{(row.details || []).length} controlled detail items</span>
                                </div>
                                {row.code === "B1" ? <B1CostLineageTable /> : null}
                                <DerivationBasisTable code={row.code} directThb={row.directThb} />
                                <div className="p55-eyebrow" style={{ marginTop: 16, marginBottom: 8 }}>Activity / component scope</div>
                                <div className="p55-table-wrap">
                                  <table className="p55-table p55-table--compact p55-table--scope">
                                    <thead><tr><th>Activity / cost component</th><th>Category</th><th>Source / basis</th><th className="is-number">Allocated THB</th><th>State</th></tr></thead>
                                    <tbody>
                                      {(row.details || []).map((detail) => (
                                        <tr key={detail.id}>
                                          <td><strong>{detail.item}</strong><small>{detail.id}</small></td>
                                          <td>{detail.category}</td>
                                          <td>{detail.source}</td>
                                          <td className="is-number">{Number.isFinite(detail.directThb) ? money(detail.directThb, "THB") : "TBC"}</td>
                                          <td><Badge>{detail.state}</Badge></td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <p className="p55-note">The parent B-line allowance remains the current control total. Sub-line THB allocation stays TBC until a defensible bottom-up basis is available; it is not force-allocated to match the parent total.</p>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="p55-panel">
            <SectionTitle
              eyebrow="Part C internal derivation"
              title="Options / long-term spares working basis"
              text="Expand C1-C3 to see the scope boundary or spare-list composition. C2/C3 remain separate from Part A and B5; detailed OEM quantities/prices replace the allowances when available."
              action={
                <div className="p55-segmented">
                  <button type="button" onClick={() => setExpandedBudgetC(new Set(budget.partC.map((row) => row.code)))}>Expand all</button>
                  <button type="button" onClick={() => setExpandedBudgetC(new Set())}>Collapse all</button>
                </div>
              }
            />
            <div className="p55-table-wrap">
              <table className="p55-table p55-table--budget">
                <thead><tr><th></th><th>Code</th><th>Description</th><th className="is-number">Direct THB</th><th>State</th><th>Detail state</th><th>Boundary / control</th></tr></thead>
                <tbody>
                  {budget.partC.map((row) => {
                    const isOpen = expandedBudgetC.has(row.code);
                    const boundary = row.code === "C1"
                      ? "Physical installation construction / civil / pulling-blowing / erection remains CNEEC working boundary unless scope changes."
                      : row.code === "C2"
                        ? "10-year capital spares; final OEM-recommended list and quantities to replace the allowance."
                        : "2-year normal operation spares; final OEM-recommended list and quantities to replace the allowance.";
                    return (
                      <React.Fragment key={row.code}>
                        <tr>
                          <td>
                            <button
                              className="p55-row-toggle"
                              type="button"
                              onClick={() => setExpandedBudgetC((current) => {
                                const next = new Set(current);
                                if (next.has(row.code)) next.delete(row.code);
                                else next.add(row.code);
                                return next;
                              })}
                            >
                              {isOpen ? "−" : "+"}
                            </button>
                          </td>
                          <td><strong>{row.code}</strong></td>
                          <td>{row.description}</td>
                          <td className="is-number">{row.directThb === null ? "—" : money(row.directThb, "THB")}</td>
                          <td><Badge>{row.state}</Badge></td>
                          <td><Badge>{row.detailState || "WORKING"}</Badge></td>
                          <td>{boundary}</td>
                        </tr>
                        {isOpen ? (
                          <tr className="p55-budget-detail-row">
                            <td colSpan="7">
                              <div className="p55-budget-detail">
                                <div className="p55-budget-detail__head">
                                  <strong>{row.code} — scope / option breakdown</strong>
                                  <span>{(row.details || []).length} controlled detail items</span>
                                </div>
                                <DerivationBasisTable code={row.code} directThb={row.directThb} />
                                <div className="p55-eyebrow" style={{ marginTop: 16, marginBottom: 8 }}>Scope / spare-list composition</div>
                                <div className="p55-table-wrap">
                                  <table className="p55-table p55-table--compact p55-table--scope">
                                    <thead><tr><th>Scope / spare component</th><th>Category</th><th>Source / basis</th><th className="is-number">Allocated THB</th><th>State</th></tr></thead>
                                    <tbody>
                                      {(row.details || []).map((detail) => (
                                        <tr key={detail.id}>
                                          <td><strong>{detail.item}</strong><small>{detail.id}</small></td>
                                          <td>{detail.category}</td>
                                          <td>{detail.source}</td>
                                          <td className="is-number">{Number.isFinite(detail.directThb) ? money(detail.directThb, "THB") : "TBC"}</td>
                                          <td><Badge>{detail.state}</Badge></td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <p className="p55-note">{row.code === "C1" ? "C1 detail is a scope-boundary map, not a priced ADDVALUE package under the current basis." : "C2/C3 sub-line quantities and prices remain TBC until OEM-recommended spare lists are normalized system by system; no arbitrary allocation is made."}</p>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {budgetMode === "budgetary" && submission ? (
        <>
          <section className="p55-callout p55-callout--warning">
            <strong>Emergency budgetary snapshot — frozen</strong>
            <p>
              {submission.reason} Customer-facing file: <strong>{submission.customerFileName}</strong>. This state is read-only by policy and is not the final contractual release.
            </p>
          </section>

          <div className="p55-metric-grid">
            <MetricCard label="Currency" value="USD" sub={"FX working basis: " + submission.fxThbUsd + " THB/USD"} />
            <MetricCard label="Base before Part C" value={compactMoney(submission.baseBeforeOptionsUsd, "USD")} sub="Part A + customer B1-B6" tone="good" />
            <MetricCard label="C2 + C3 options" value={compactMoney(submission.optionsC2C3Usd, "USD")} sub="C1 excluded" />
            <MetricCard label="Calculated incl. options" value={compactMoney(submission.calculatedInclOptionsUsd, "USD")} sub="Snapshot arithmetic" />
            <MetricCard label="Management envelope" value={compactMoney(submission.managementEnvelopeUsd, "USD")} sub="Do not back-solve lines to this value" tone="warn" />
            <MetricCard label="Release state" value="PRELIMINARY" sub="ADDVALUE → SAMTEL → CNEEC · 08-Oct-2026" tone="warn" />
          </div>

          <section className="p55-panel">
            <SectionTitle
              eyebrow="Frozen customer-facing snapshot"
              title="SAMTEL Rev00 price breakdown"
              text="Vendor names and internal commercial derivation are deliberately excluded from this customer view."
              action={<button className="p55-export-button" type="button" onClick={() => exportOriginalPriceFormXlsx(submission)}>Export SAMTEL Rev00 XLSX</button>}
            />
            <div className="p55-table-wrap">
              <table className="p55-table p55-table--budget">
                <thead><tr><th>Code</th><th>Description</th><th className="is-number">USD</th><th>Remark</th></tr></thead>
                <tbody>
                  {submissionBaseRows.map((row) => (
                    <tr key={row.code}>
                      <td><strong>{row.code}</strong></td>
                      <td>{row.description}</td>
                      <td className="is-number">{money(row.customerUsd, "USD")}</td>
                      <td>{row.remark}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2"><strong>Base Total before Part C Options</strong></td>
                    <td className="is-number"><strong>{money(submission.baseBeforeOptionsUsd, "USD")}</strong></td>
                    <td>Excluding VAT.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="p55-panel">
            <SectionTitle eyebrow="Part C options" title="Frozen option values" />
            <div className="p55-option-grid">
              {submissionOptions.map((row) => (
                <div className="p55-option" key={row.code}>
                  <div><span>{row.code}</span><strong>{row.description}</strong></div>
                  <div className="p55-option__price">
                    <strong>{row.code === "C1" ? "EXCLUDED / CNEEC" : money(row.customerUsd, "USD")}</strong>
                    <Badge>{row.code === "C1" ? "EXCLUDED" : "BUDGETARY OPTION"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="p55-panel">
            <SectionTitle
              eyebrow="Internal trace — not customer output"
              title="Where each emergency budget line came from"
              text="This trace is kept so a later engineer can identify the internal system mapping, cost basis, evidence strength and the quotation that must replace each allowance."
            />
            <div className="p55-table-wrap">
              <table className="p55-table p55-table--budget">
                <thead><tr><th>Line</th><th>Internal mapping</th><th className="is-number">Direct THB</th><th>Internal basis</th><th>Evidence / driver</th><th>Confidence</th><th>Replace when</th></tr></thead>
                <tbody>
                  {submission.internalTrace.map((row) => (
                    <tr key={row.customerLine}>
                      <td><strong>{row.customerLine}</strong></td>
                      <td>{row.internalSystems}</td>
                      <td className="is-number">{money(row.directThb, "THB")}</td>
                      <td>{row.basis}</td>
                      <td>{row.evidence}</td>
                      <td><Badge>{row.confidence}</Badge></td>
                      <td>{row.replaceWhen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p55-callout p55-callout--warning">
              <strong>Revision rule</strong>
              <p>{submission.replacementRule}</p>
            </div>
          </section>

          <section className="p55-panel">
            <SectionTitle eyebrow="Part B trace" title="Why specialist / deployment allowances exist" text="B4 is event/campaign-based, not a full-project specialist FTE assumption." />
            <div className="p55-table-wrap">
              <table className="p55-table p55-table--compact">
                <thead><tr><th>Code</th><th className="is-number">Direct THB</th><th>Internal cost logic</th><th>Specialist rule</th><th>Emergency customer-form treatment</th></tr></thead>
                <tbody>
                  {submission.partBInternal.map((row) => (
                    <tr key={row.code}>
                      <td><strong>{row.code}</strong></td>
                      <td className="is-number">{money(row.directThb, "THB")}</td>
                      <td>{row.logic}</td>
                      <td>{row.externalSpecialist}</td>
                      <td>{row.customerFormTreatment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="p55-panel">
            <SectionTitle
              eyebrow="Part C trace"
              title="Why C1 / C2 / C3 are kept separate"
              text="Part C is option scope, not part of the base A+B total. C1 is excluded under the current working boundary; C2/C3 remain separate long-term spare allowances."
            />
            <div className="p55-table-wrap">
              <table className="p55-table p55-table--compact">
                <thead><tr><th>Code</th><th>Description</th><th className="is-number">Internal direct THB</th><th className="is-number">Issued customer USD</th><th>Control treatment</th></tr></thead>
                <tbody>
                  {budget.partC.map((row) => {
                    const issued = submissionOptions.find((option) => option.code === row.code);
                    return (
                      <tr key={row.code}>
                        <td><strong>{row.code}</strong></td>
                        <td>{row.description}</td>
                        <td className="is-number">{row.directThb === null ? "—" : money(row.directThb, "THB")}</td>
                        <td className="is-number">{row.code === "C1" ? "EXCLUDED" : money(issued?.customerUsd || 0, "USD")}</td>
                        <td>
                          {row.code === "C1"
                            ? "CNEEC optional physical installation boundary; reopen only by controlled scope change."
                            : row.code === "C2"
                              ? "10-year capital spares; replace allowance with final OEM list."
                              : "2-year operational spares; replace allowance with final OEM list."}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {budgetMode === "released" ? (
        <>
          <section className="p55-callout">
            <strong>Released Customer Output remains a separate authorization state</strong>
            <p>
              The 08-Oct SAMTEL emergency budgetary issue is intentionally not promoted into RELEASED_SELL. This view continues to show the controlled customer-form baseline and its HOLD/open items until a formal customer release is authorized.
            </p>
          </section>

          <div className="p55-metric-grid">
            <MetricCard
              label="Part A + B Base"
              value="HOLD"
              sub={"Known excl. PAGA: " + money(PROJECT_0550.knownBaseExPagaUsd, "USD") + " / " + money(PROJECT_0550.knownBaseExPagaThb, "THB")}
              tone="warn"
            />
            <MetricCard label="PAGA selected" value={money(paga.knownSelectedSubtotalEur, "EUR")} sub={paga.vendor + " · " + paga.offer} tone="good" />
            <MetricCard label="Project Total" value="HOLD" sub="Final release requires controlled closure / authorization" tone="warn" />
            <MetricCard label="Emergency snapshot" value={money(submission?.baseBeforeOptionsUsd || 0, "USD")} sub="Budgetary only — not RELEASED_SELL" />
          </div>

          <div className="p55-filterbar p55-filterbar--simple">
            <div className="p55-segmented">
              {["ALL", "A1", "B"].map((key) => (
                <button key={key} className={part === key ? "is-active" : ""} onClick={() => setPart(key)} type="button">
                  {key === "ALL" ? "All Base" : key === "A1" ? "Part A1" : "Part B"}
                </button>
              ))}
            </div>
            <Badge tone="warn">CONTROLLED · HOLD</Badge>
          </div>

          <section className="p55-panel p55-panel--flush">
            <div className="p55-table-wrap">
              <table className="p55-table p55-table--budget">
                <thead><tr><th>Code</th><th>Description</th><th className="is-number">USD</th><th className="is-number">THB</th><th className="is-number">EUR</th><th>State</th></tr></thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.code}>
                      <td><strong>{row.code}</strong></td>
                      <td>{row.description}{row.vendor ? <small>{row.vendor}{row.offer ? " · " + row.offer : ""}</small> : null}</td>
                      <td className="is-number">{priceCell(row, "USD")}</td>
                      <td className="is-number">{priceCell(row, "THB")}</td>
                      <td className="is-number">{priceCell(row, "EUR")}</td>
                      <td><Badge>{row.state}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function RiskView() {
  const maxExposure = Math.max(...RISK_SCENARIOS.map((r) => r.exposureThb));

  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="Project economics"
        title="Risk, standby and recovery controls"
        text="Risks are modelled as causal scenarios. They are not automatically summed into Base price."
      />

      <div className="p55-grid p55-grid--2">
        <section className="p55-panel">
          <SectionTitle eyebrow="Scenario exposure" title="Weather / NATCAT / political / access" />
          <div className="p55-risk-list">
            {RISK_SCENARIOS.map((risk) => (
              <div className="p55-risk" key={risk.id}>
                <div className="p55-risk__top">
                  <div><small>{risk.id} · {risk.group}</small><strong>{risk.name}</strong></div>
                  <strong>{money(risk.exposureThb, "THB")}</strong>
                </div>
                <div className="p55-risk__bar">
                  <i style={{ width: Math.max(4, (risk.exposureThb / maxExposure) * 100) + "%" }} />
                </div>
                <p>{risk.treatment}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p55-panel">
          <SectionTitle eyebrow="Recovery logic" title="Cost exposure ≠ customer recovery" />
          <div className="p55-recovery">
            {[
              ["1", "Trigger", "Weather, flood, earthquake, political/security, access, regulatory or third-party event"],
              ["2", "Exposure", "Standby, travel, hotel, equipment idle, inspection, storage, evacuation or remobilisation"],
              ["3", "Internal Cost", "Personnel + cash + equipment + vendor extension"],
              ["4", "Mitigation", "Planning, schedule float, alternative route, security plan, insurance"],
              ["5", "Commercial Recovery", "Standby / client-delay / force-majeure / variation entitlement"],
              ["6", "Residual Risk", "Only unrecovered exposure is a candidate for management reserve"],
            ].map(([no, title, text]) => (
              <div className="p55-recovery__item" key={no}>
                <span>{no}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="p55-panel">
        <SectionTitle eyebrow="Resource risk" title="Outsource replacement protection" />
        <p className="p55-note p55-note--top">
          Critical project roles use a protected selling-rate floor based on external replacement cost, rather than cheap ADDVALUE payroll. This protects the budget if internal staff become unavailable.
        </p>
        <div className="p55-table-wrap">
          <table className="p55-table">
            <thead><tr><th>Role</th><th>Protected ADDVALUE</th><th>SAMTEL / Customer</th><th>Scarcity</th></tr></thead>
            <tbody>
              {CORE_TEAM.map((r) => (
                <tr key={r.role}>
                  <td><strong>{r.role}</strong></td>
                  <td>{money(r.protectedUsdDay, "USD")}/person-day</td>
                  <td>{money(r.customerUsdDay, "USD")}/person-day</td>
                  <td><Badge>{r.scarcity}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function DocumentsView() {
  const facts = PROJECT_0550_FACTS;

  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="Evidence control"
        title="Project facts, source register & traceability"
        text="Project facts are stored as structured records with evidence state, source and downstream cost/schedule impact. Methodology remains separate from project facts."
      />

      <section className="p55-panel">
        <SectionTitle
          eyebrow="Particular project facts"
          title="Stakeholders / contractual roles"
          text="Contract/legal roles are not broadened beyond the controlling source."
        />
        <div className="p55-table-wrap">
          <table className="p55-table p55-table--compact">
            <thead><tr><th>Role</th><th>Organisation</th><th>Source</th><th>Evidence state</th><th>Control note</th></tr></thead>
            <tbody>
              {(facts.stakeholders || []).map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.role}</strong><small>{row.id}</small></td>
                  <td>{row.organisation}</td>
                  <td>{row.source}</td>
                  <td><Badge>{row.evidenceState}</Badge></td>
                  <td>{row.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p55-panel">
        <SectionTitle eyebrow="Location register" title="Project sites / route references" />
        <div className="p55-table-wrap">
          <table className="p55-table p55-table--compact">
            <thead><tr><th>Code</th><th>Name</th><th>Aliases</th><th>Type</th><th>Source</th><th>Evidence state</th></tr></thead>
            <tbody>
              {(facts.locations || []).map((row) => (
                <tr key={row.code}>
                  <td><strong>{row.code}</strong></td>
                  <td>{row.name}</td>
                  <td>{(row.aliases || []).join(", ") || "—"}</td>
                  <td>{row.type}</td>
                  <td>{row.source || "—"}</td>
                  <td><Badge>{row.evidenceState}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p55-panel">
        <SectionTitle eyebrow="Schedule evidence" title="Milestones and source maturity" />
        <div className="p55-table-wrap">
          <table className="p55-table p55-table--compact">
            <thead><tr><th>ID</th><th>Date / target</th><th>Event</th><th>Source</th><th>Evidence state</th></tr></thead>
            <tbody>
              {(facts.milestones || []).map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.id}</strong></td>
                  <td>{row.date}</td>
                  <td>{row.event}</td>
                  <td>{row.source || "—"}</td>
                  <td><Badge>{row.evidenceState}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p55-panel">
        <SectionTitle
          eyebrow="Accepted clarification"
          title="Clarification → cost / delivery impact"
          text="These rows are project-specific constraints that downstream engineering, budget and schedule modules should consume."
        />
        <div className="p55-table-wrap">
          <table className="p55-table p55-table--compact">
            <thead><tr><th>Topic</th><th>Accepted / controlled fact</th><th>Source</th><th>Cost impact</th><th>Delivery impact</th><th>Evidence</th></tr></thead>
            <tbody>
              {(facts.clarifications || []).map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.topic}</strong><small>{row.id}</small></td>
                  <td>{row.fact}</td>
                  <td>{row.source}</td>
                  <td>{row.costImpact}</td>
                  <td>{row.deliveryImpact}</td>
                  <td><Badge>{row.evidenceState}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p55-panel">
        <SectionTitle eyebrow="Customer commercial structure" title="Part A / B / C mapping" />
        <div className="p55-grid p55-grid--3">
          <div className="p55-table-wrap">
            <table className="p55-table p55-table--compact">
              <thead><tr><th>Part A — Customer 15 lines</th></tr></thead>
              <tbody>{(facts.customerCommercialStructure?.partA15 || []).map((x, i) => <tr key={x}><td><strong>{String(i+1).padStart(2,"0")}</strong> · {x}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="p55-table-wrap">
            <table className="p55-table p55-table--compact">
              <thead><tr><th>Code</th><th>Part B treatment</th></tr></thead>
              <tbody>{(facts.customerCommercialStructure?.partB || []).map((x) => <tr key={x.code}><td><strong>{x.code}</strong></td><td>{x.title}<small>{x.treatment}</small></td></tr>)}</tbody>
            </table>
          </div>
          <div className="p55-table-wrap">
            <table className="p55-table p55-table--compact">
              <thead><tr><th>Code</th><th>Part C treatment</th></tr></thead>
              <tbody>{(facts.customerCommercialStructure?.partC || []).map((x) => <tr key={x.code}><td><strong>{x.code}</strong></td><td>{x.title}<small>{x.treatment}</small></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="p55-panel">
        <SectionTitle eyebrow="Submission structure" title="Required proposal volumes" />
        <div className="p55-table-wrap">
          <table className="p55-table p55-table--compact">
            <thead><tr><th>Volume</th><th>Title</th><th>Contents</th><th>Evidence state</th></tr></thead>
            <tbody>
              {(facts.submissionStructure || []).map((row) => (
                <tr key={row.volume}>
                  <td><strong>Volume {row.volume}</strong></td>
                  <td>{row.title}</td>
                  <td>{row.contents.join(" · ")}</td>
                  <td><Badge>{row.evidenceState}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p55-panel">
        <SectionTitle eyebrow="Evidence states" title="Interpretation rule" />
        <div className="p55-table-wrap">
          <table className="p55-table p55-table--compact">
            <thead><tr><th>State</th><th>Meaning</th></tr></thead>
            <tbody>
              {Object.entries(facts.evidenceStates || {}).map(([state, meaning]) => (
                <tr key={state}><td><Badge>{state}</Badge></td><td>{meaning}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p55-panel">
        <SectionTitle eyebrow="Source priority" title="Which evidence governs first" />
        <div className="p55-table-wrap">
          <table className="p55-table p55-table--compact">
            <thead><tr><th>Priority</th><th>Evidence class</th></tr></thead>
            <tbody>
              {(facts.sourcePriority || []).map((item, i) => (
                <tr key={item}><td><strong>{i+1}</strong></td><td>{item}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p55-panel">
        <SectionTitle eyebrow="Source register" title="Controlled source inventory" />
        <div className="p55-table-wrap">
          <table className="p55-table p55-table--compact">
            <thead><tr><th>ID</th><th>Source</th><th>Use</th><th>State</th></tr></thead>
            <tbody>
              {SOURCE_REGISTER.map((source) => (
                <tr key={source.id}>
                  <td><strong>{source.id}</strong></td>
                  <td>{source.name}</td>
                  <td>{source.use}</td>
                  <td><Badge>{source.state}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function PJ26080550({ lang = "th" }) {
  const project = {
    id: PROJECT_0550.id,
    shortName: PROJECT_0550.shortName,
    title: PROJECT_0550.title,
    state: PROJECT_0550.state,
    statusDetail: "Price date " + PROJECT_0550.priceDate,
    method: PROJECT_0550.method
  };
  const views = {
    overview: <Overview />,
    architecture: <ArchitectureView />,
    systems: <SystemsView />,
    engineering: <EngineeringView />,
    execution: <ExecutionView />,
    budget: <BudgetView />,
    risk: <RiskView />,
    documents: <DocumentsView />
  };
  return <ProjectWorkspaceShell project={project} lang={lang} tabs={TABS} views={views} />;
}
