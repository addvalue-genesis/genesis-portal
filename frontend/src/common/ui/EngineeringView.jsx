import { LinkedEngineeringHierarchy } from "./LinkedEngineeringHierarchy";
import { ExpandableFormulaTable } from "./ExpandableFormulaTable";
import { MASTER_FORMULA_INVENTORY, FORMULA_COVERAGE_SUMMARY, PRELIMINARY_METHODS_REQUIRING_SPECIALIST_MODELS } from "../engineering/masterFormulaInventory";
import React from "react";
function Badge({children,tone="neutral"}) { return <span className={"p55-badge p55-badge--"+tone}>{children}</span>; }
function SectionTitle({eyebrow,title,text}) { return <div className="p55-section-title"><div>{eyebrow&&<div className="p55-eyebrow">{eyebrow}</div>}<h2>{title}</h2>{text&&<p>{text}</p>}</div></div>; }
export function EngineeringView({model,children}) {
  const {completeness,lawLibrary,systems,chain,domains,controlRules,costEquations,projectId,serviceEquations=[]}=model;
  const audited = (completeness?.systemAudit || []).filter((row) => row.auditState !== "NOT_YET_AUDITED").length;
  const notAudited = (completeness?.systemAudit || []).filter((row) => row.auditState === "NOT_YET_AUDITED").length;

  return (
    <div className="p55-stack">
      <SectionTitle
        eyebrow="First Principles + Completeness Control"
        title="Requirement threads before release"
        text="The chain remains the governing method, but release control now starts from source requirements. A system is not complete merely because a main equipment line or price exists."
      />

      <div className="p55-grid p55-grid--2">
        <section className="p55-callout p55-callout--warning">
          <strong>Completeness audit: {completeness?.state || "AUDIT REQUIRED"}</strong>
          <p>{completeness?.doctrine}</p>
        </section>
        <section className="p55-callout">
          <strong>Audit coverage</strong>
          <p>{audited} system(s) started · {notAudited} system(s) still NOT_YET_AUDITED. No 100% completeness claim is allowed until source extraction and thread mapping are finished.</p>
        </section>
      </div>

      <section className="p55-panel">
        <SectionTitle
          eyebrow="Known gap caught by the new control"
          title="Seed requirement finding"
          text="NMS is the first proof that system-level pricing alone is not a sufficient completeness check."
        />
        {(completeness?.seedFindings || []).map((finding) => (
          <div className="p55-open-item" key={finding.id}>
            <span>{finding.id}</span>
            <div>
              <strong>{finding.title} · {finding.systemToken}</strong>
              <p className="p55-note p55-note--top">{finding.sourceFact}</p>
              <div className="p55-system__badges" style={{justifyContent:"flex-start"}}>
                <Badge>{finding.mappingState}</Badge>
                <Badge>{finding.threadState}</Badge>
              </div>
              <ul className="p55-rule-list" style={{marginTop:10}}>
                {finding.missingControls.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="p55-note"><strong>Release effect:</strong> {finding.releaseEffect}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="p55-panel">
        <SectionTitle
          eyebrow="Project-system audit"
          title="Requirement completeness state"
          text="NOT_YET_AUDITED means unknown completeness, not zero gaps."
        />
        <div className="p55-table-wrap">
          <table className="p55-table">
            <thead>
              <tr><th>No.</th><th>System</th><th>Audit state</th><th>Known finding</th></tr>
            </thead>
            <tbody>
              {(completeness?.systemAudit || []).map((row) => (
                <tr key={row.token}>
                  <td>{String(row.no).padStart(2, "0")}</td>
                  <td><strong>{row.name}</strong><small>{row.token}</small></td>
                  <td><Badge>{row.auditState}</Badge></td>
                  <td>{row.knownFinding || "— audit not yet performed —"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="p55-grid p55-grid--2">
        <section className="p55-panel">
          <SectionTitle eyebrow="Cross-system obligations" title="Common / shared mapping queue" />
          <div className="p55-policy-list">
            {(completeness?.crossSystemObligations || []).map((item) => (
              <div className="p55-policy" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.source}</p>
                </div>
                <Badge>{item.mappingState}</Badge>
              </div>
            ))}
          </div>
        </section>

        <section className="p55-panel">
          <SectionTitle eyebrow="Fail-closed release gate" title="Final release rules" />
          <ul className="p55-rule-list">
            {(completeness?.releaseRules || []).map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </section>
      </div>

      <LinkedEngineeringHierarchy auditDimensions={completeness?.auditDimensions||[]} chain={chain} domains={domains} kernels={lawLibrary?.kernels||[]} systemKernelMap={lawLibrary?.systemKernelMap||[]} projectId={projectId}/>
      <section className="p55-callout"><strong>{lawLibrary?.state||"COMMON_GENERIC_KERNEL"}</strong><p>{lawLibrary?.evidenceRule}</p></section>

      <section className="p55-panel">
        <SectionTitle
          eyebrow="System-to-kernel map"
          title="Which physics/math model checks each system"
          text="MAPPED_PRELIMINARY means the generic kernel applies; project inputs, standards and source evidence still need system-by-system audit."
        />
        <div className="p55-table-wrap">
          <table className="p55-table">
            <thead><tr><th>System</th><th>Engineering kernels</th><th>State</th></tr></thead>
            <tbody>
              {(lawLibrary?.systemKernelMap || []).map((row) => (
                <tr key={row.token}>
                  <td><strong>{row.name}</strong><small>{row.token}</small></td>
                  <td>{row.kernelIds.length ? row.kernelIds.join(" · ") : "—"}</td>
                  <td><Badge>{row.auditState}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="p55-grid p55-grid--2">
        <section className="p55-panel">
          <SectionTitle eyebrow="Control doctrine" title="No-guess rules" />
          <ul className="p55-rule-list">
            {controlRules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </section>

        <section className="p55-panel">
          <SectionTitle eyebrow="Parametric Cost Kernel" title="Math after engineering quantity" />
          <div className="p55-equations">
            <code>MH = I × Q × UMH × F</code>
            <code>Duration = MH / (Persons × H/day × η)</code>
            <code>Internal Labor Cost = Σ MH × Loaded Cost Rate</code>
            <code>Service Sell = Σ MH/MD × Protected Selling Rate</code>
            {costEquations.map((equation,i)=><code key={i}>{equation}</code>)}
          </div>
        </section>
      </div>

      <section className="p55-panel">
        <SectionTitle eyebrow="COMMON method registry" title="Service / Cost Equations E01–E18" text="Original 0550 equations and constraints are shared methods, not 0550 rates or adopted 0553 costs. Formula registration is not evidence of automatic execution."/>
        <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>ID</th><th>Purpose</th><th>Formula</th><th>Control / limitation</th></tr></thead><tbody>
          {serviceEquations.map(eq=><tr key={eq.id}><td>{eq.id}</td><td>{eq.purpose}</td><td><code>{eq.equation}</code></td><td>{eq.control}</td></tr>)}
        </tbody></table></div>
      </section>
      <section className="p55-panel">
        <SectionTitle eyebrow="Master Formula Inventory" title="Engineering + Service / Cost Equation Coverage" text="One canonical inventory references existing law and service definitions. EXECUTABLE means partial preliminary function coverage, not automatic compliance or OEM certification."/>
        <p className="p55-note">{FORMULA_COVERAGE_SUMMARY.engineeringDefinitions} engineering equations + {FORMULA_COVERAGE_SUMMARY.serviceDefinitions} service/cost equations = {FORMULA_COVERAGE_SUMMARY.total} registered equations. Executable/partial implementations: {FORMULA_COVERAGE_SUMMARY.executableCoverage}. Remaining entries require controlled implementation and verification.</p>
        <ExpandableFormulaTable rows={MASTER_FORMULA_INVENTORY}/>
        <p className="p55-note"><strong>Specialist method controls:</strong> {PRELIMINARY_METHODS_REQUIRING_SPECIALIST_MODELS.map(x=>x.id+" — "+x.state).join(" · ")}. Project-specific STD applicability and CAL/RPT evidence are reviewed separately.</p>
      </section>
      {children}
      <section className="p55-panel">
        <SectionTitle
          eyebrow="Proof matrix"
          title="Engineering proof readiness"
          text="Select any system in the Systems view to inspect the source binding, proof and open closure in detail."
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
              {systems.map((system) => (
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

