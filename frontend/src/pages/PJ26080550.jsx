import React, { useMemo, useState } from "react";
import {
  CNEEC_BREAKDOWN,
  COMMERCIAL_POLICY,
  CONTROL_RULES,
  CORE_TEAM,
  EXECUTION_CAMPAIGNS,
  FIRST_PRINCIPLES_CHAIN,
  LOGISTICS_GATES,
  OPTIONS,
  PROJECT_0550,
  RISK_SCENARIOS,
  SOURCE_REGISTER,
  SYSTEM_GROUPS,
  SYSTEMS,
} from "../project0550/data";
import "../project0550/project0550.css";

const TABS = [
  { id: "overview", label: "Executive" },
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

function Overview() {
  const openProofs = SYSTEMS.filter(
    (s) => s.proofState.includes("PRELIMINARY") || s.proofState.includes("CONFLICT") || s.proofState.includes("NOT FOUND")
  ).length;
  const quoted = SYSTEMS.filter((s) => s.costBasis.includes("CURRENT_QUOTE")).length;
  const paga = PROJECT_0550.selectedPaga;

  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="Management view"
        title="Project control spine"
        text="Current 0550 baseline is evidence-controlled. PAGA is selected on INDUSTRONIC, while the overall project price remains HOLD until the selected package is commercially normalized."
      />

      <div className="p55-metric-grid">
        <MetricCard label="Systems" value="19" sub="Controlled project spine" />
        <MetricCard
          label="Part A+B"
          value="HOLD"
          sub={"Known subset excl. PAGA: " + compactMoney(PROJECT_0550.knownBaseExPagaUsd, "USD") + " / " + compactMoney(PROJECT_0550.knownBaseExPagaThb, "THB")}
          tone="warn"
        />
        <MetricCard
          label="PAGA selected"
          value={compactMoney(paga.knownSelectedSubtotalEur, "EUR")}
          sub={paga.vendor + " · " + paga.offer + " · EUR FX TBC"}
          tone="good"
        />
        <MetricCard
          label="Base + C2 + C3"
          value="HOLD"
          sub={"Known subset excl. PAGA: " + compactMoney(PROJECT_0550.knownBasePlusC2C3ExPagaThb, "THB")}
          tone="warn"
        />
        <MetricCard label="Open / preliminary proofs" value={String(openProofs)} sub="Engineering closure required" tone="warn" />
        <MetricCard label="FX control" value="31.50" sub="THB/USD · EUR/THB = TBC" />
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
          title="What management should watch before price release"
          text="High-impact dependencies that can move cost, schedule or margin."
        />
        <div className="p55-control-grid">
          {[
            ["PAGA proof", "Sound coverage / amplifier loading / cabinet and loop reconciliation", "HIGH"],
            ["PAGA commercial closure", "ACT-IP, monitoring, UPS 6h, selected-vendor spares, site service and FCA logistics", "HIGH"],
            ["CCTV proof", "Coverage, lens, bandwidth and storage closure", "HIGH"],
            ["FO / bulk MTO", "Replace historical route proxy with current quantity take-off", "HIGH"],
            ["Myanmar permits", "Equipment freeze, MOTC / frequency / DCA / import licence path", "HIGH"],
            ["Resource continuity", "External replacement cover for PM / Chief / Sr / Tech", "PROTECTED"],
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

function SystemCard({ system, expanded, onToggle }) {
  return (
    <article className={"p55-system " + (expanded ? "is-expanded" : "")}>
      <button className="p55-system__summary" onClick={onToggle} type="button">
        <div className="p55-system__no">{String(system.no).padStart(2, "0")}</div>
        <div className="p55-system__title">
          <strong>{system.name}</strong>
          <span>{system.token}</span>
        </div>
        <div className="p55-system__badges">
          <Badge>{system.proofState}</Badge>
          <Badge>{system.costBasis}</Badge>
        </div>
        <span className="p55-chevron">{expanded ? "−" : "+"}</span>
      </button>
      {expanded ? (
        <div className="p55-system__detail">
          <dl className="p55-detail-grid">
            <div><dt>Project reference</dt><dd>{system.ref}</dd></div>
            <div><dt>Engineering proof</dt><dd>{system.proof}</dd></div>
            <div><dt>Quantity state</dt><dd><Badge>{system.quantityState}</Badge></dd></div>
            <div><dt>Execution / boundary</dt><dd>{system.owner}</dd></div>
          </dl>
          <div className="p55-open-item">
            <span>OPEN CLOSURE</span>
            <strong>{system.open}</strong>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function SystemsView() {
  const [viewMode, setViewMode] = useState("group");
  const [selectedToken, setSelectedToken] = useState("ALL");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(() => new Set(["TEL-PAGA"]));
  const [openGroups, setOpenGroups] = useState(() => new Set(SYSTEM_GROUPS.map((g) => g.id)));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SYSTEMS.filter((system) => {
      if (selectedToken !== "ALL" && system.token !== selectedToken) return false;
      if (!q) return true;
      return [system.name, system.token, system.ref, system.proof, system.open]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, selectedToken]);

  function toggleSystem(token) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(token)) next.delete(token);
      else next.add(token);
      return next;
    });
  }

  function toggleGroup(id) {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const groups = SYSTEM_GROUPS.map((group) => ({
    ...group,
    systems: filtered.filter((s) => s.groupId === group.id),
  })).filter((group) => group.systems.length > 0);

  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="19-system control"
        title="System group view"
        text="Expand by discipline, or switch to a single-system focus view. Each system keeps proof state, quantity state, commercial basis and closure action visible."
      />

      <div className="p55-filterbar">
        <div className="p55-segmented" aria-label="View mode">
          <button className={viewMode === "group" ? "is-active" : ""} onClick={() => setViewMode("group")} type="button">Group view</button>
          <button className={viewMode === "focus" ? "is-active" : ""} onClick={() => setViewMode("focus")} type="button">System focus</button>
        </div>
        <label>
          <span>System</span>
          <select
            value={selectedToken}
            onChange={(e) => {
              setSelectedToken(e.target.value);
              if (e.target.value !== "ALL") {
                setViewMode("focus");
                setExpanded(new Set([e.target.value]));
              }
            }}
          >
            <option value="ALL">All 19 systems</option>
            {SYSTEMS.map((s) => <option value={s.token} key={s.token}>{String(s.no).padStart(2, "0")} — {s.name}</option>)}
          </select>
        </label>
        <label className="p55-search">
          <span>Search</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="PAGA, coverage, quote…" />
        </label>
      </div>

      {viewMode === "focus" ? (
        <div className="p55-system-list">
          {filtered.map((system) => (
            <SystemCard
              key={system.token}
              system={system}
              expanded={expanded.has(system.token)}
              onToggle={() => toggleSystem(system.token)}
            />
          ))}
        </div>
      ) : (
        <div className="p55-groups">
          {groups.map((group) => {
            const isOpen = openGroups.has(group.id);
            return (
              <section className="p55-group" key={group.id}>
                <button className="p55-group__head" onClick={() => toggleGroup(group.id)} type="button">
                  <div>
                    <strong>{group.name}</strong>
                    <span>{group.description}</span>
                  </div>
                  <div className="p55-group__right">
                    <Badge tone="neutral">{group.systems.length} systems</Badge>
                    <span className="p55-chevron">{isOpen ? "−" : "+"}</span>
                  </div>
                </button>
                {isOpen ? (
                  <div className="p55-system-list">
                    {group.systems.map((system) => (
                      <SystemCard
                        key={system.token}
                        system={system}
                        expanded={expanded.has(system.token)}
                        onToggle={() => toggleSystem(system.token)}
                      />
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EngineeringView() {
  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="Governing method"
        title="First-Principles engineering chain"
        text="Every system should move through the same controlled causal chain. A formula producing a number does not upgrade evidence status."
      />

      <section className="p55-panel">
        <div className="p55-chain p55-chain--full">
          {FIRST_PRINCIPLES_CHAIN.map((step, index) => (
            <React.Fragment key={step}>
              <div className="p55-chain__node">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </div>
              {index < FIRST_PRINCIPLES_CHAIN.length - 1 ? <div className="p55-chain__line" /> : null}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="p55-grid p55-grid--2">
        <section className="p55-panel">
          <SectionTitle eyebrow="Control doctrine" title="No-guess rules" />
          <ul className="p55-rule-list">
            {CONTROL_RULES.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </section>

        <section className="p55-panel">
          <SectionTitle eyebrow="Equation kernel" title="Reusable cost-engineering logic" />
          <div className="p55-equations">
            <code>MH = I × Q × UMH × F</code>
            <code>Duration = MH / (Persons × H/day × η)</code>
            <code>Internal Labor Cost = Σ MH × Loaded Cost Rate</code>
            <code>Service Sell = Σ MH/MD × Protected Selling Rate</code>
            <code>Customer Service = ADDVALUE Sell × 1.05</code>
            <code>Goods Customer = Cost × 1.20 / 0.95</code>
          </div>
        </section>
      </div>

      <section className="p55-panel">
        <SectionTitle
          eyebrow="Proof matrix"
          title="Engineering proof readiness"
          text="Select any system in the 19-System view to inspect the source binding, proof and open closure in detail."
        />
        <div className="p55-table-wrap">
          <table className="p55-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>System</th>
                <th>Required proof</th>
                <th>Proof state</th>
                <th>Quantity state</th>
              </tr>
            </thead>
            <tbody>
              {SYSTEMS.map((system) => (
                <tr key={system.token}>
                  <td>{String(system.no).padStart(2, "0")}</td>
                  <td><strong>{system.name}</strong><small>{system.token}</small></td>
                  <td>{system.proof}</td>
                  <td><Badge>{system.proofState}</Badge></td>
                  <td><Badge>{system.quantityState}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

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
  const rows = CNEEC_BREAKDOWN.filter((row) => part === "ALL" || row.code.startsWith(part));
  const paga = PROJECT_0550.selectedPaga;

  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="SAMTEL → CNEEC budgetary output"
        title="Priced breakdown control"
        text="Current Rev07 baseline: INDUSTRONIC is the selected PAGA technical/pricing basis. Project headline remains HOLD until EUR conversion and open PAGA scope are closed."
        action={
          <div className="p55-segmented">
            <button className={currency === "USD" ? "is-active" : ""} onClick={() => setCurrency("USD")} type="button">USD</button>
            <button className={currency === "THB" ? "is-active" : ""} onClick={() => setCurrency("THB")} type="button">THB</button>
            <button className={currency === "EUR" ? "is-active" : ""} onClick={() => setCurrency("EUR")} type="button">EUR</button>
          </div>
        }
      />

      <div className="p55-metric-grid">
        <MetricCard
          label="Part A + B Base"
          value="HOLD"
          sub={"Known excl. PAGA: " + money(PROJECT_0550.knownBaseExPagaUsd, "USD") + " / " + money(PROJECT_0550.knownBaseExPagaThb, "THB")}
          tone="warn"
        />
        <MetricCard
          label="PAGA selected"
          value={money(paga.knownSelectedSubtotalEur, "EUR")}
          sub={paga.vendor + " · " + paga.offer}
          tone="good"
        />
        <MetricCard
          label="C2 known non-PAGA"
          value={currency === "THB" ? money(PROJECT_0550.c2Thb, "THB") : currency === "EUR" ? "PAGA TBC" : money(PROJECT_0550.c2Usd, "USD")}
          sub="PAGA capital spares remain TBC"
        />
        <MetricCard
          label="C3 known non-PAGA"
          value={currency === "THB" ? money(PROJECT_0550.c3Thb, "THB") : currency === "EUR" ? "PAGA TBC" : money(PROJECT_0550.c3Usd, "USD")}
          sub="PAGA 2-year spares remain TBC"
        />
        <MetricCard
          label="Project Total"
          value="HOLD"
          sub="C1 unpriced · PAGA open · EUR/THB TBC"
          tone="warn"
        />
        <MetricCard
          label="FX"
          value="31.50"
          sub="THB/USD locked · EUR/THB TBC"
        />
      </div>

      <section className="p55-callout p55-callout--warning">
        <strong>Selected PAGA commercial gate</strong>
        <p>
          INDUSTRONIC base net {money(paga.baseNetEur, "EUR")} plus currently priced requirement additions gives {money(paga.knownSelectedSubtotalEur, "EUR")}. The project total must remain HOLD until the remaining PAGA compliance gaps, selected-vendor spares, site service, FCA logistics and EUR conversion are source-backed.
        </p>
      </section>

      <div className="p55-filterbar p55-filterbar--simple">
        <div className="p55-segmented">
          {["ALL", "A1", "B"].map((key) => (
            <button key={key} className={part === key ? "is-active" : ""} onClick={() => setPart(key)} type="button">
              {key === "ALL" ? "All Base" : key === "A1" ? "Part A1" : "Part B"}
            </button>
          ))}
        </div>
        <Badge tone="warn">REV07 · TOTAL HOLD</Badge>
      </div>

      <section className="p55-panel p55-panel--flush">
        <div className="p55-table-wrap">
          <table className="p55-table p55-table--budget">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th className="is-number">USD</th>
                <th className="is-number">THB @ 31.50</th>
                <th className="is-number">EUR</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.code}>
                  <td><strong>{row.code}</strong></td>
                  <td>
                    {row.description}
                    {row.vendor ? <small>{row.vendor}{row.offer ? " · " + row.offer : ""}</small> : null}
                  </td>
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

      <section className="p55-panel">
        <SectionTitle eyebrow="Part C" title="Options / spares" />
        <div className="p55-option-grid">
          {OPTIONS.map((option) => (
            <div className="p55-option" key={option.code}>
              <div><span>{option.code}</span><strong>{option.description}</strong></div>
              <div className="p55-option__price">
                <strong>
                  {option.code === "C1"
                    ? "NOT PRICED"
                    : currency === "THB"
                      ? money(option.thb, "THB")
                      : currency === "EUR"
                        ? "PAGA TBC"
                        : money(option.usd, "USD")}
                </strong>
                <Badge>{option.state}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p55-callout p55-callout--warning">
        <strong>Budget release note</strong>
        <p>
          Current project total is intentionally HOLD. The UI must not recreate the superseded numeric headline from the previous PAGA basis. Only source-backed selected-vendor amounts may be promoted into the final customer price.
        </p>
      </section>
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
  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="Evidence control"
        title="Source register & traceability"
        text="Project facts stay separate from methodology references. Internal calculations should always point back to a source, driver or explicit assumption."
      />

      <div className="p55-source-grid">
        {SOURCE_REGISTER.map((source) => (
          <article className="p55-source" key={source.id}>
            <div className="p55-source__id">{source.id}</div>
            <div>
              <strong>{source.name}</strong>
              <p>{source.use}</p>
            </div>
            <Badge>{source.state}</Badge>
          </article>
        ))}
      </div>

      <section className="p55-panel">
        <SectionTitle eyebrow="Evidence states" title="Interpretation rule" />
        <div className="p55-grid p55-grid--3">
          {[
            ["Source fact", "Direct statement / quantity / requirement from current 0550 project evidence.", "good"],
            ["Derived engineering rule", "Calculated from source-bound engineering drivers; derivation remains auditable.", "neutral"],
            ["Assumption / TBC", "Used so the budget remains complete, but closure action must stay visible.", "warn"],
          ].map(([title, text, tone]) => (
            <div className="p55-evidence-card" key={title}>
              <Badge tone={tone}>{title}</Badge>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function PJ26080550({ lang = "th" }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p55">
      <header className="p55-hero">
        <div className="p55-hero__top">
          <div>
            <div className="p55-kicker">GENESS / TPP · INTERNAL PROJECT CONTROL</div>
            <h1>{PROJECT_0550.id} <span>{PROJECT_0550.shortName}</span></h1>
            <p>{PROJECT_0550.title}</p>
          </div>
          <div className="p55-hero__status">
            <Badge tone="warn">{PROJECT_0550.state}</Badge>
            <span>Price date {PROJECT_0550.priceDate}</span>
          </div>
        </div>

        <div className="p55-hero__method">
          <span>METHOD</span>
          <strong>{PROJECT_0550.method}</strong>
        </div>

        <nav className="p55-tabs" aria-label="PJ2608-0550 sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "is-active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="p55-main">
        {activeTab === "overview" ? <Overview /> : null}
        {activeTab === "systems" ? <SystemsView /> : null}
        {activeTab === "engineering" ? <EngineeringView /> : null}
        {activeTab === "execution" ? <ExecutionView /> : null}
        {activeTab === "budget" ? <BudgetView /> : null}
        {activeTab === "risk" ? <RiskView /> : null}
        {activeTab === "documents" ? <DocumentsView /> : null}
      </main>

      <footer className="p55-footer">
        <span>{PROJECT_0550.id} · Internal working control</span>
        <span>{lang === "th" ? "ข้อมูลที่เป็น TBC/OPEN ต้องไม่ถูกตีความเป็นศูนย์" : "TBC / OPEN inputs must never be interpreted as zero."}</span>
      </footer>
    </div>
  );
}
