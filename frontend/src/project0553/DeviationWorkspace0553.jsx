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
  const head = ["ID", "Category", "MR", "Code", "Title", "MR Requirement", "Offered Basis", "Justification", "Status"];
  const body = records.map((r) => [r.id, r.category, r.mr, r.code, r.title, r.mrRequirement, r.offeredBasis, r.justification, r.status]);
  return [head, ...body].map((row) => row.map(esc).join(",")).join("\n") + "\n";
}

function buildDeviationWordHtml(records) {
  const rows = records
    .map(
      (r) =>
        `<tr><td>${r.id}</td><td>${r.category}</td><td>${r.mr} / ${r.code}</td><td>${r.title}</td><td>${r.mrRequirement}</td><td>${r.offeredBasis}</td><td>${r.justification}</td><td>${r.status}</td></tr>`
    )
    .join("");
  return (
    "<html><head><meta charset=\"utf-8\"><title>PJ2608-0553 Technical & Commercial Deviations</title></head><body>" +
    "<h1>PJ2608-0553 · Technical &amp; Commercial Deviation Register</h1>" +
    "<table border=\"1\" cellspacing=\"0\" cellpadding=\"6\"><thead><tr>" +
    "<th>ID</th><th>Category</th><th>MR / Code</th><th>Title</th><th>MR Requirement</th><th>Offered Basis</th><th>Justification</th><th>Status</th>" +
    "</tr></thead><tbody>" +
    rows +
    "</tbody></table></body></html>"
  );
}

export function DeviationWorkspace0553({ onNavigate = null }) {
  const [subTab, setSubTab] = useState("technical");
  const [viewer, setViewer] = useState("AVS");
  const register = useMemo(() => selectDeviationRegister0553(), []);
  const isAVS = viewer === "AVS";

  const visibleRecords =
    subTab === "technical"
      ? register.records.filter((r) => r.category === "TECHNICAL")
      : subTab === "commercial"
      ? register.records.filter((r) => r.category === "COMMERCIAL")
      : register.records;

  const renderTable = (rows) => (
    <div className="p55-table-wrap">
      <table className="p55-table p55-table--budget">
        <thead>
          <tr>
            <th>ID / Code</th>
            <th>Deviation Title</th>
            <th>MR / RFQ Requirement</th>
            <th>Offered Basis (Rev03)</th>
            <th>Justification / Disposition</th>
            {isAVS && <th>Linked Modules (07 / 10 / 10B / B3)</th>}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} data-deviation-id={r.id}>
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
    <div className="p55-stack" data-component-key="bid.deviations">
      <section className="p55-panel" style={{ padding: "12px 16px" }}>
        <div className="p55-eyebrow">14 DEVIATIONS &amp; CLARIFICATIONS · 0550 PATTERN / 0553 SOURCES</div>
        <h3>
          Technical &amp; Commercial Deviation Register{" "}
          <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.deviations" />
        </h3>
        <p className="p55-note">
          รวบรวม Technical &amp; Commercial Deviations จาก 04 MR, 07 Vendor (VND), 08 Risk, 10 Budget (10.1–10.3.4 / B3) และ 10B Brownfield (B3-BF)
          โดยไม่แก้ไขยอดราคา Rev03 และไม่ import ข้อมูลจาก 0550
        </p>
        <div className="p55-filterbar p55-filterbar--simple">
          <div role="tablist" aria-label="Deviation work areas" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["technical", `14.1 Technical / AVL (${register.counts.technical})`],
              ["commercial", `14.2 Commercial / JUTAL (${register.counts.commercial})`],
              ["release", `14.3 Deviation Release / Export (${register.counts.total})`],
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
        <AuditSection title="14.3 — Customer Deviation List Export (Read-only)">
          <p className="p55-note">
            Export เอกสาร Technical &amp; Commercial Deviations List จากทะเบียนกลางนี้โดยตรง (ไม่แสดงข้อมูลภายใน 07 VND / 10B ในไฟล์ลูกค้า)
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <button
              type="button"
              className="p553-detail-button"
              onClick={() =>
                downloadText(buildDeviationWordHtml(register.records), "application/msword", "PJ2608-0553_Deviations_List.doc")
              }
            >
              Word — Deviation List (.doc)
            </button>
            <button
              type="button"
              className="p553-detail-button"
              onClick={() =>
                downloadText(buildDeviationCsv(register.records), "text/csv;charset=utf-8", "PJ2608-0553_Deviations_List.csv")
              }
            >
              CSV — Deviation List (.csv)
            </button>
          </div>
          {renderTable(visibleRecords)}
        </AuditSection>
      )}

      {subTab !== "release" && (
        <AuditSection title={subTab === "technical" ? "14.1 — Technical & AVL Deviations" : "14.2 — Commercial & JUTAL Deviations"}>
          {renderTable(visibleRecords)}
        </AuditSection>
      )}
    </div>
  );
}
