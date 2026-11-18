import React, { useMemo, useState } from "react";
import { ComponentCopyId } from "../common/ui/ComponentCopyId";
import { AuditBadge, AuditSection } from "../common/ui/ProjectAuditPrimitives";
import { selectDeviationRegister0553 } from "./data/deviationRegister0553";

function downloadText(text, type, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([type.startsWith("text/csv") ? "\uFEFF" + text : text], { type }));
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 15000);
}

function buildClarifyCsv(records) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const head = ["ID", "Category", "MR", "Code", "Title", "MR / RFQ Basis", "Offered Basis (Rev03)", "Clarification / Response", "Status"];
  const body = records.map((r) => [r.id, r.category, r.mr, r.code, r.title, r.mrRequirement, r.offeredBasis, r.justification, r.status]);
  return [head, ...body].map((row) => row.map(esc).join(",")).join("\n") + "\n";
}

function buildClarifyWordHtml(records, title) {
  const rows = records
    .map(
      (r) =>
        `<tr><td>${r.id}</td><td>${r.mr} / ${r.code}</td><td>${r.title}</td><td>${r.mrRequirement}</td><td>${r.offeredBasis}</td><td>${r.justification}</td><td>${r.status}</td></tr>`
    )
    .join("");
  return (
    `<html><head><meta charset="utf-8"><title>${title}</title></head><body>` +
    `<h1>${title}</h1>` +
    "<table border=\"1\" cellspacing=\"0\" cellpadding=\"6\"><thead><tr>" +
    "<th>ID</th><th>MR / Code</th><th>Title</th><th>MR / RFQ Basis</th><th>Offered Basis (Rev03)</th><th>Clarification / Response</th><th>Status</th>" +
    "</tr></thead><tbody>" +
    rows +
    "</tbody></table></body></html>"
  );
}

export function ClarifyWorkspace0553({ onNavigate = null }) {
  const [subTab, setSubTab] = useState("tc");
  const [viewer, setViewer] = useState("AVS");
  const register = useMemo(() => selectDeviationRegister0553(), []);
  const isAVS = viewer === "AVS";

  const tcRows = register.records.filter((r) => r.category === "TECHNICAL_CLARIFICATION");
  const cclRows = register.records.filter((r) => r.category === "COMMERCIAL_CLARIFICATION");
  const allClarify = [...tcRows, ...cclRows];
  const visibleRows = subTab === "tc" ? tcRows : subTab === "ccl" ? cclRows : allClarify;

  const renderTable = (rows) => (
    <div className="p55-table-wrap">
      <table className="p55-table p55-table--budget">
        <thead>
          <tr>
            <th>ID / Code</th>
            <th>Clarification Title</th>
            <th>MR / RFQ Basis</th>
            <th>Offered Basis (Rev03)</th>
            <th>Clarification / Proposed Reply</th>
            {isAVS && <th>Linked Modules (07 / 08 / 10 / 10B)</th>}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} data-clarify-id={r.id}>
              <td>
                <strong>{r.id}</strong>
                <small>{r.mr} · {r.code}</small>
              </td>
              <td>
                <strong>{r.title}</strong>
                {isAVS && r.customerComment && <small>JUTAL: {r.customerComment}</small>}
              </td>
              <td>{r.mrRequirement}</td>
              <td>{r.offeredBasis}</td>
              <td>{r.justification}</td>
              {isAVS && (
                <td>
                  <small>{r.vendorRef}</small>
                  {r.brownfieldRef !== "—" && <small>{r.brownfieldRef}</small>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                    {r.links.map((lk) => (
                      <button
                        key={lk.label}
                        type="button"
                        className="p553-detail-button"
                        onClick={() => onNavigate?.({ id: lk.moduleId, tab: lk.tab, name: lk.label })}
                      >
                        ↗ {lk.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
              <td>
                <AuditBadge>{r.status}</AuditBadge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p55-stack" data-component-key="bid.clarify">
      <section className="p55-panel" style={{ padding: "12px 16px" }}>
        <div className="p55-eyebrow">15 CLARIFICATIONS · TC &amp; CCL REGISTER</div>
        <h3>
          Clarify Workspace — Technical (TC) &amp; Commercial (CCL){" "}
          <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.clarify" />
        </h3>
        <p className="p55-note">
          แยกงานชี้แจง <strong>TC (Technical Clarifications)</strong> และ <strong>CCL (Commercial Clarifications)</strong> ออกจาก{" "}
          <strong>14 Deviations</strong> (ซึ่งมีเฉพาะ MR-0002 Trunk Radio LNA → BDA)
        </p>
        <div className="p55-filterbar p55-filterbar--simple">
          <div role="tablist" aria-label="Clarification sub-tabs" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["tc", `15.1 TC · Technical (${tcRows.length})`],
              ["ccl", `15.2 CCL · Commercial (${cclRows.length})`],
              ["export", `15.3 Export TC / CCL (${allClarify.length})`],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={subTab === id}
                className="p553-detail-button"
                style={{ fontWeight: subTab === id ? 700 : 400, border: subTab === id ? "2px solid #07729a" : "1px solid #b7c7d5" }}
                onClick={() => setSubTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <label>
            Viewer{" "}
            <select value={viewer} onChange={(e) => setViewer(e.target.value)}>
              <option value="AVS">AVS view</option>
              <option value="CUSTOMER">Customer Export</option>
            </select>
          </label>
        </div>
      </section>

      {subTab === "export" ? (
        <AuditSection title="15.3 — Export TC &amp; CCL Lists (Read-only)">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <button
              type="button"
              className="p553-detail-button"
              onClick={() =>
                downloadText(buildClarifyWordHtml(tcRows, "PJ2608-0553 · Technical Clarifications (TC)"), "application/msword", "PJ2608-0553_TC_List.doc")
              }
            >
              Word — TC List ({tcRows.length}) (.doc)
            </button>
            <button
              type="button"
              className="p553-detail-button"
              onClick={() =>
                downloadText(buildClarifyWordHtml(cclRows, "PJ2608-0553 · Commercial Clarifications (CCL)"), "application/msword", "PJ2608-0553_CCL_List.doc")
              }
            >
              Word — CCL List ({cclRows.length}) (.doc)
            </button>
            <button
              type="button"
              className="p553-detail-button"
              onClick={() => downloadText(buildClarifyCsv(allClarify), "text/csv;charset=utf-8", "PJ2608-0553_TC_CCL_List.csv")}
            >
              CSV — All Clarifications ({allClarify.length}) (.csv)
            </button>
          </div>
          {renderTable(visibleRows)}
        </AuditSection>
      ) : (
        <AuditSection title={subTab === "tc" ? "15.1 — Technical Clarifications (TC)" : "15.2 — Commercial Clarifications (CCL)"}>
          {renderTable(visibleRows)}
        </AuditSection>
      )}
    </div>
  );
}
