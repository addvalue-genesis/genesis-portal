import React from "react";
function Badge({children,tone="neutral"}){return <span className={"p55-badge p55-badge--"+tone}>{children}</span>}
function SectionTitle({eyebrow,title,text}){return <div className="p55-section-title"><div>{eyebrow&&<div className="p55-eyebrow">{eyebrow}</div>}<h2>{title}</h2>{text&&<p>{text}</p>}</div></div>}
export function ArchitectureView({manifest, modules}) {

  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="Smart Code / Self-Describing Architecture"
        title={manifest.title}
        text={manifest.background}
      />

      <section className="p55-callout">
        <strong>{manifest.governingMethod}</strong>
        <p>{manifest.architecture}</p>
      </section>

      <div className="p55-grid p55-grid--2">
        <section className="p55-panel">
          <SectionTitle eyebrow="Why this code exists" title="Smart-code principles" />
          <ul className="p55-rule-list">
            {manifest.smartCodePrinciples.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </section>

        <section className="p55-panel">
          <SectionTitle eyebrow="Review contract" title="Questions every module must answer" />
          <ul className="p55-rule-list">
            {manifest.reviewQuestions.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </section>
      </div>

      <section className="p55-panel">
        <SectionTitle eyebrow="Evolution policy" title="Preserve knowledge — not necessarily implementation" />
        <div className="p55-grid p55-grid--2">
          <div className="p55-evidence-card">
            <div className="p55-eyebrow">Allowed architectural change</div>
            <ul className="p55-rule-list">
              {manifest.evolutionPolicy.allowedChanges.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="p55-evidence-card">
            <div className="p55-eyebrow">Required controls</div>
            <ul className="p55-rule-list">
              {manifest.evolutionPolicy.requiredControls.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
        <p className="p55-note"><strong>Principle:</strong> {manifest.evolutionPolicy.principle}</p>
      </section>

      <section className="p55-panel">
        <SectionTitle
          eyebrow="Module registry"
          title="What we have, what it does, and why"
          text="This registry is part of the codebase so a new engineer or external AI reviewer can understand the architecture without relying on chat history."
        />
        <div className="p55-table-wrap">
          <table className="p55-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Lifecycle</th>
                <th>Layer</th>
                <th>Purpose</th>
                <th>Why</th>
                <th>Inputs</th>
                <th>Outputs</th>
                <th>Implementation</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.id}>
                  <td><strong>{module.name}</strong><small>{module.id}</small></td>
                  <td><Badge>{module.lifecycleStatus}</Badge></td>
                  <td><Badge tone="neutral">{module.layer}</Badge></td>
                  <td>{module.purpose}</td>
                  <td>{module.why}</td>
                  <td>{module.inputs.join(" · ")}</td>
                  <td>{module.outputs.join(" · ")}</td>
                  <td>{module.implementation.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p55-panel">
        <SectionTitle
          eyebrow="Refactor / evolution governance"
          title="What may change, what must be migrated, and why"
          text="Architecture is allowed to evolve. A change is controlled when the rationale, impact, migration/replacement decision and historical evidence are explicit."
        />
        <div className="p55-groups">
          {modules.map((module) => (
            <section className="p55-group" key={module.id}>
              <div className="p55-group__head">
                <div>
                  <strong>{module.name}</strong>
                  <span>{module.id}</span>
                </div>
                <Badge tone="neutral">{module.invariants.length} invariants</Badge>
              </div>
              <div className="p55-system__detail">
                <ul className="p55-rule-list">
                  {module.invariants.map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

