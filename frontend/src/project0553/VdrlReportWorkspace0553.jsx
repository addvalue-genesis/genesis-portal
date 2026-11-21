import React, { useMemo, useState } from "react";
import { ComponentCopyId } from "../common/ui/ComponentCopyId";
import { AuditSection } from "../common/ui/ProjectAuditPrimitives";
import {
  PTTEP_VDRL_NAMING_SPEC_0553,
  VDRL_TEMPLATES_0553,
  buildVdrlDocumentPreview0553,
  selectVdrlReportCatalog0553,
} from "./data/vdrlReportCatalog0553";
import { buildVdrlXlsxBytes0553 } from "./data/simpleXlsxExport0553";

function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 15000);
}

function downloadText(text, type, filename) {
  downloadBlob(new Blob([type.startsWith("text/csv") ? "\uFEFF" + text : text], { type }), filename);
}

function buildVdrlCsv(preview) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const h = preview.header;
  const meta = [
    ["Project", h.project],
    ["Client Doc No.", h.clientDocNo],
    ["ADDVALUE Doc No. (PTTEP STD)", h.addvalueDocNo],
    ["Title", h.title],
    ["MR / Dossier", `${h.mr} / ${h.dossier}`],
    ["Revision / Purpose", `${h.revision} / ${h.purpose} (UNPRICED)`],
    [],
  ];
  return [...meta, preview.columns, ...preview.rows].map((row) => row.map(esc).join(",")).join("\n") + "\n";
}

function buildVdrlWordHtml(preview) {
  const h = preview.header;
  const ths = preview.columns.map((c) => `<th>${c}</th>`).join("");
  const trs = preview.rows
    .map((r) => `<tr>${r.map((cell) => `<td>${cell == null ? "" : String(cell)}</td>`).join("")}</tr>`)
    .join("");
  return (
    `<html><head><meta charset="utf-8"><title>${h.addvalueDocNo}</title></head><body>` +
    `<h2>${h.project}</h2>` +
    `<table border="1" cellspacing="0" cellpadding="5" style="margin-bottom:12px;">` +
    `<tr><th>ADDVALUE Doc No.</th><td>${h.addvalueDocNo}</td><th>Client Doc No.</th><td>${h.clientDocNo}</td></tr>` +
    `<tr><th>Title</th><td>${h.title}</td><th>MR / Dossier</th><td>${h.mr} / ${h.dossier}</td></tr>` +
    `<tr><th>Contractor</th><td>${h.contractor}</td><th>Revision / Purpose</th><td>${h.revision} · ${h.purpose}</td></tr>` +
    `</table>` +
    `<table border="1" cellspacing="0" cellpadding="5"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>` +
    `</body></html>`
  );
}

export function VdrlReportWorkspace0553({ onNavigate = null }) {
  const catalog = useMemo(() => selectVdrlReportCatalog0553(), []);
  const [mrFilter, setMrFilter] = useState("ALL");
  const [docTypeFilter, setDocTypeFilter] = useState("ALL");
  const [phaseFilter, setPhaseFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("VDRL-004");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.records.filter((r) => {
      if (mrFilter !== "ALL" && r.mr !== mrFilter) return false;
      if (docTypeFilter !== "ALL" && r.docType !== docTypeFilter) return false;
      if (phaseFilter === "BID" && !r.requiredDuringBidding) return false;
      if (phaseFilter === "EXEC" && !r.requiredDuringExecution) return false;
      if (q && !`${r.id} ${r.clientDocNo} ${r.addvalueDocNo} ${r.title} ${r.mr}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [catalog.records, mrFilter, docTypeFilter, phaseFilter, query]);

  const selectedRow = useMemo(
    () => catalog.records.find((r) => r.id === selectedId) || filtered[0] || catalog.records[0],
    [catalog.records, filtered, selectedId]
  );
  const preview = useMemo(() => buildVdrlDocumentPreview0553(selectedRow), [selectedRow]);

  return (
    <div className="p55-stack" data-component-key="bid.vdrl">
      <section className="p55-panel" style={{ padding: "12px 16px" }}>
        <div className="p55-eyebrow">16 REPORT - VDRL · PTTEP STANDARD DELIVERABLES (UNPRICED)</div>
        <h3>
          Report - VDRL Master Register &amp; PTTEP Document Templates{" "}
          <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vdrl" />
        </h3>
        <p className="p55-note">
          ดึงข้อมูลจาก <strong>CUS (MR Table 11 VDRL 143 รายการ)</strong> + <strong>07 VND (OEM Specs)</strong> → ทำงานด้วย <strong>SI (Unpriced Schedule C1 / B1-B2)</strong>{" "}
          ใช้มาตรฐานรหัสเอกสาร <code>{PTTEP_VDRL_NAMING_SPEC_0553.standard}</code> (Company Code: <code>{PTTEP_VDRL_NAMING_SPEC_0553.companyCode}</code>, Pattern:{" "}
          <code>{PTTEP_VDRL_NAMING_SPEC_0553.pattern}</code>)
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          <span className="p55-badge">Total VDRL: {catalog.counts.total}</span>
          <span className="p55-badge">With Bid: {catalog.counts.withBid}</span>
          <span className="p55-badge">Execution: {catalog.counts.execution}</span>
          {Object.entries(catalog.counts.byType).map(([k, v]) => (
            <span key={k} className="p55-badge">{k}: {v}</span>
          ))}
        </div>

        <div className="p55-filterbar p55-filterbar--simple">
          <label>
            MR{" "}
            <select value={mrFilter} onChange={(e) => setMrFilter(e.target.value)}>
              <option value="ALL">ALL MRs ({catalog.counts.total})</option>
              <option value="MR-0001">MR-0001 (SCADA)</option>
              <option value="MR-0002">MR-0002 (DMR)</option>
              <option value="MR-0003">MR-0003 (Telephone)</option>
              <option value="MR-0004">MR-0004 (RACON)</option>
            </select>
          </label>
          <label>
            Doc Type{" "}
            <select value={docTypeFilter} onChange={(e) => setDocTypeFilter(e.target.value)}>
              <option value="ALL">ALL Types</option>
              {Object.keys(VDRL_TEMPLATES_0553).map((t) => (
                <option key={t} value={t}>{t} ({catalog.counts.byType[t] || 0})</option>
              ))}
            </select>
          </label>
          <label>
            Phase{" "}
            <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}>
              <option value="ALL">All Phases</option>
              <option value="BID">With Bid Only ({catalog.counts.withBid})</option>
              <option value="EXEC">Execution ({catalog.counts.execution})</option>
            </select>
          </label>
          <label>
            Search{" "}
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Doc No. / Title / VDRL ID" />
          </label>
          <button
            type="button"
            className="p553-detail-button"
            onClick={() => {
              setMrFilter("ALL");
              setDocTypeFilter("ALL");
              setPhaseFilter("ALL");
              setQuery("");
            }}
          >
            Reset Filters
          </button>
        </div>
      </section>

      {preview && (
        <AuditSection title={`16.1 — VDRL Template Preview & Export: ${preview.header.addvalueDocNo}`}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <button
              type="button"
              className="p553-detail-button"
              onClick={() =>
                downloadBlob(
                  new Blob([buildVdrlXlsxBytes0553(preview)], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  }),
                  `${preview.header.addvalueDocNo}.xlsx`
                )
              }
            >
              Export Excel ({preview.header.addvalueDocNo}.xlsx)
            </button>
            <button
              type="button"
              className="p553-detail-button"
              onClick={() => downloadText(buildVdrlCsv(preview), "text/csv;charset=utf-8", `${preview.header.addvalueDocNo}.csv`)}
            >
              Export CSV ({preview.header.addvalueDocNo}.csv)
            </button>
            <button
              type="button"
              className="p553-detail-button"
              onClick={() => downloadText(buildVdrlWordHtml(preview), "application/msword;charset=utf-8", `${preview.header.addvalueDocNo}.doc`)}
            >
              Export Word ({preview.header.addvalueDocNo}.doc)
            </button>
            {onNavigate && (
              <button
                type="button"
                className="p553-detail-button"
                onClick={() => onNavigate({ id: "bid.clarify", tab: "clarify" })}
              >
                Open 15 Clarify (TC / CCL)
              </button>
            )}
          </div>
          <p className="p55-note">
            <strong>Template:</strong> {preview.template.name} — {preview.template.purpose}
          </p>
          <div className="p55-table-wrap" style={{ marginBottom: 10 }}>
            <table className="p55-table p55-table--compact">
              <tbody>
                <tr>
                  <th>ADDVALUE Doc No.</th><td><code>{preview.header.addvalueDocNo}</code></td>
                  <th>Client Doc No.</th><td><code>{preview.header.clientDocNo}</code></td>
                </tr>
                <tr>
                  <th>Title</th><td>{preview.header.title}</td>
                  <th>MR / Dossier</th><td>{preview.header.mr} · {preview.header.dossier}</td>
                </tr>
                <tr>
                  <th>Contractor</th><td>{preview.header.contractor}</td>
                  <th>Revision / Purpose</th><td>{preview.header.revision} · {preview.header.purpose} · Class {preview.header.approvalClass}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p55-table-wrap" style={{ maxHeight: 340, overflowY: "auto" }}>
            <table className="p55-table p55-table--compact">
              <thead>
                <tr>{preview.columns.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {preview.rows.map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </AuditSection>
      )}

      <AuditSection title={`16.2 — All Required VDRL Deliverables (${filtered.length} / ${catalog.counts.total})`}>
        <div className="p55-table-wrap">
          <table className="p55-table p55-table--budget" style={{ tableLayout: "fixed", width: "100%", minWidth: 1020 }}>
            <colgroup>
              <col style={{ width: 92 }} />
              <col style={{ width: 96 }} />
              <col style={{ width: 76 }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 110 }} />
            </colgroup>
            <thead>
              <tr>
                <th>VDRL ID</th>
                <th>MR / Item</th>
                <th>Type</th>
                <th>ADDVALUE Doc No. (ADDV) / Client No.</th>
                <th>Deliverable Title</th>
                <th>Lineage (CUS → VND → SI)</th>
                <th>Trigger / Class</th>
                <th>Template</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 16 }}>
                    ไม่พบรายการที่ตรงกับตัวกรองปัจจุบัน (เช่น รายการ <code>LIS</code> ใน MR Table 11 อยู่ในช่วง <strong>Post-Award / Execution</strong> ไม่ใช่ <strong>With Bid</strong>) — ลองเปลี่ยน Phase เป็น <strong>All Phases</strong> หรือกด <strong>Reset Filters</strong>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                <tr key={r.id} style={selectedRow?.id === r.id ? { background: "#eff6ff" } : undefined}>
                  <td>
                    <strong>{r.id}</strong>
                    {r.linkedClarifyIds.map((cid) => (
                      <small key={cid} style={{ display: "block", color: "#0369a1" }}>{cid}</small>
                    ))}
                  </td>
                  <td><strong>{r.mr}</strong><small style={{ display: "block" }}>§{r.sourceItem}</small></td>
                  <td><span className="p55-badge">{r.docType}</span></td>
                  <td style={{ overflowWrap: "anywhere" }}>
                    <code>{r.addvalueDocNo}</code>
                    <small style={{ display: "block", color: "#64748b" }}>Client: {r.clientDocNo}</small>
                  </td>
                  <td>
                    <strong>{r.title}</strong>
                    <small style={{ display: "block", color: "#475569" }}>{r.dossier}</small>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    <div><strong>CUS:</strong> {r.lineage.cus}</div>
                    <div><strong>VND:</strong> {r.lineage.vnd}</div>
                    <div><strong>SI:</strong> {r.lineage.si}</div>
                  </td>
                  <td>
                    <div>{r.submissionTrigger}</div>
                    <small>Class {r.approvalClass} · {r.requiredDuringBidding ? "With Bid" : "Post-Award"}</small>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="p553-detail-button"
                      onClick={() => setSelectedId(r.id)}
                    >
                      {selectedRow?.id === r.id ? "Selected" : "Preview"}
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </AuditSection>
    </div>
  );
}
