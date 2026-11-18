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

function buildDeviationCsv(records) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const head = ["ID", "Kind", "Category", "MR", "Code", "Title", "MR Requirement", "Offered Basis", "Justification", "Status"];
  const body = records.map((r) => [r.id, r.kind, r.category, r.mr, r.code, r.title, r.mrRequirement, r.offeredBasis, r.justification, r.status]);
  return [head, ...body].map((row) => row.map(esc).join(",")).join("\n") + "\n";
}

function buildDeviationWordHtml(records, title) {
  const rows = records
    .map(
      (r) =>
        `<tr><td>${r.id}</td><td>${r.kind}</td><td>${r.mr} / ${r.code}</td><td>${r.title}</td><td>${r.mrRequirement}</td><td>${r.offeredBasis}</td><td>${r.justification}</td><td>${r.status}</td></tr>`
    )
    .join("");
  return (
    `<html><head><meta charset="utf-8"><title>${title}</title></head><body>` +
    `<h1>${title}</h1>` +
    "<table border=\"1\" cellspacing=\"0\" cellpadding=\"6\"><thead><tr>" +
    "<th>ID</th><th>Type</th><th>MR / Code</th><th>Title</th><th>MR Requirement</th><th>Offered Basis</th><th>Justification</th><th>Status</th>" +
    "</tr></thead><tbody>" +
    rows +
    "</tbody></table></body></html>"
  );
}

export function DeviationWorkspace0553({ onNavigate = null }) {
  const [subTab, setSubTab] = useState("deviations");
  const [viewer, setViewer] = useState("AVS");
  const register = useMemo(() => selectDeviationRegister0553(), []);
  const isAVS = viewer === "AVS";

  const deviationRows = register.records.filter((r) => r.kind === "DEVIATION");
  const visibleRecords = deviationRows;

  const renderTable = (rows) => (
    <div className="p55-table-wrap">
      <table className="p55-table p55-table--budget">
        <thead>
          <tr>
            <th>ID / Type</th>
            <th>Title</th>
            <th>MR / RFQ Requirement</th>
            <th>Offered Basis (Rev03)</th>
            <th>Justification / Disposition</th>
            {isAVS && <th>Linked Modules (07 / 10 / 10B / B3)</th>}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} data-deviation-id={r.id} data-register-kind={r.kind}>
              <td>
                <strong>{r.id}</strong>
                <small>{r.kind} · {r.mr} · {r.code}</small>
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
    <div className="p55-stack" data-component-key="bid.deviations">
      <section className="p55-panel" style={{ padding: "12px 16px" }}>
        <div className="p55-eyebrow">14 FORMAL DEVIATIONS · 0550 PATTERN / 0553 SOURCES</div>
        <h3>
          Formal Deviation Register{" "}
          <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.deviations" />
        </h3>
        <p className="p55-note">
          แสดงเฉพาะ <strong>Formal Deviation (1 รายการ: MR-0002 Trunk Radio LNA → BDA)</strong> ส่วนรายการชี้แจง{" "}
          <strong>TC / CCL (5 รายการ)</strong> แยกไปอยู่ที่แท็บ{" "}
          <button type="button" className="p553-detail-button" onClick={() => onNavigate?.({ id: "bid.clarify", tab: "clarify", name: "15 Clarify (TC / CCL)" })}>
            ↗ 15 Clarify (TC / CCL)
          </button>
        </p>
        <div className="p55-filterbar p55-filterbar--simple">
          <div role="tablist" aria-label="Deviation work areas" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["deviations", `14.1 Formal Deviations (${register.counts.deviations})`],
              ["release", `14.2 Deviation Release / Export (${register.counts.deviations})`],
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

      {subTab === "release" && (
        <AuditSection title="14.3 — Customer Deviation & TC Export (Read-only)">
          <p className="p55-note">
            แยกไฟล์ Export ระหว่าง <strong>Formal Deviation List (1 รายการ)</strong> กับ <strong>TC · Clarifications (5 รายการ)</strong> (ซ่อนข้อมูลภายใน 07 VND / 10B)
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <button
              type="button"
              className="p553-detail-button"
              onClick={() =>
                downloadText(
                  buildDeviationWordHtml(deviationRows, "PJ2608-0553 · Formal Deviation List"),
                  "application/msword",
                  "PJ2608-0553_Formal_Deviation_List.doc"
                )
              }
            >
              Word — Formal Deviation List ({deviationRows.length}) (.doc)
            </button>
            <button
              type="button"
              className="p553-detail-button"
              onClick={() =>
                downloadText(buildDeviationCsv(deviationRows), "text/csv;charset=utf-8", "PJ2608-0553_Formal_Deviation_List.csv")
              }
            >
              CSV — Formal Deviation List ({deviationRows.length}) (.csv)
            </button>
          </div>
          {renderTable(visibleRecords)}
        </AuditSection>
      )}

      {subTab !== "release" && (
        <AuditSection
          title={
            subTab === "deviations"
              ? "14.1 — Formal Technical Deviations (1 item: MR-0002 LNA → BDA)"
              : "14.2 — Technical & Commercial Clarifications (TC)"
          }
        >
          {renderTable(visibleRecords)}
        </AuditSection>
      )}
    </div>
  );
}
