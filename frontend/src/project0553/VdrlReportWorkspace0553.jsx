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

function groupRowsGfBf(preview) {
  const locationOrder = ["ZWP20", "ZWP21", "ZWP22", "ZWP23", "ZPQ", "ZWP8", "ZWP11"];
  const buckets = new Map();
  for (const r of preview.rows || []) {
    const joined = r.map((c) => (c == null ? "" : String(c))).join(" ");
    const matchedLoc = locationOrder.find((loc) => new RegExp(`\\b${loc}\\b`, "i").test(joined));
    const isBf = matchedLoc ? ["ZPQ", "ZWP8", "ZWP11"].includes(matchedLoc) : /\bBROWNFIELD\b/i.test(joined);
    const isGf = matchedLoc ? ["ZWP20", "ZWP21", "ZWP22", "ZWP23"].includes(matchedLoc) : /\bGREENFIELD\b/i.test(joined);
    const key = matchedLoc ? `${isBf ? "BF" : "GF"}-${matchedLoc}` : isBf ? "BF-ALL" : isGf ? "GF-ALL" : "GEN";
    const title = matchedLoc
      ? `${isBf ? "BROWNFIELD" : "GREENFIELD"} — Location: ${matchedLoc} Platform`
      : isBf
      ? "BROWNFIELD PLATFORMS — Location: ZPQ, ZWP8, ZWP11"
      : isGf
      ? "GREENFIELD PLATFORMS — Location: ZWP20, ZWP21, ZWP22, ZWP23"
      : "GENERAL / COMMON SCOPE";
    if (!buckets.has(key)) buckets.set(key, { key, title, order: matchedLoc ? locationOrder.indexOf(matchedLoc) : 99, rows: [] });
    buckets.get(key).rows.push(r);
  }
  return [...buckets.values()].sort((a, b) => a.order - b.order);
}

function colWidthPct(colName) {
  const c = String(colName || "").toUpperCase();
  if (/^(NO\.|ITEM NO\.|UNIT|Q'TY|QTY\.|REV)$/.test(c)) return "5%";
  if (/^(SYSTEM|LOCATION)$/.test(c)) return "7%";
  if (/^TAG NUMBER$/.test(c)) return "9%";
  if (/^BRAND$/.test(c)) return "8%";
  if (/^MODEL$/.test(c)) return "14%";
  if (/^PART NO\.$/.test(c)) return "14%";
  if (/DESCRIPTION|TITLE|SPECIFICATION/.test(c)) return "20%";
  if (/REMARK/.test(c)) return "13%";
  return "10%";
}

function buildVdrlWordHtml(preview, logos = {}) {
  const h = preview.header;
  const ths = preview.columns.map((c) => `<th style="width:${colWidthPct(c)};">${c}</th>`).join("");
  const grouped = groupRowsGfBf(preview);
  const colCount = preview.columns.length;
  const tbody = grouped
    .map((g) => {
      const banner = `<tr><td colspan="${colCount}" style="background:#e2e8f0;font-weight:bold;padding:5px 6px;">${g.title}</td></tr>`;
      const trs = g.rows
        .map((r) => `<tr>${r.map((cell) => `<td>${cell == null ? "" : String(cell)}</td>`).join("")}</tr>`)
        .join("");
      return banner + trs;
    })
    .join("");
  const pttepImg = logos.pttep ? `<img src="${logos.pttep}" alt="PTTEP" style="height:48px;width:auto;"/>` : `<strong>PTTEP</strong>`;
  const rightLogos = [
    logos.jutal ? `<img src="${logos.jutal}" alt="JUTAL" style="height:26px;width:auto;margin:2px;"/>` : `<strong>JUTAL</strong>`,
    logos.samtel ? `<img src="${logos.samtel}" alt="SAMTEL" style="height:22px;width:auto;margin:2px;"/>` : `<span>SAMTEL</span>`,
    logos.avs ? `<img src="${logos.avs}" alt="ADDVALUE" style="height:22px;width:auto;margin:2px;"/>` : `<span>ADDVALUE</span>`,
  ].join("<br/>");
  return (
    `<html><head><meta charset="utf-8"><title>${h.addvalueDocNo}</title>` +
    `<style>` +
    `@page portrait_page{size:A4 portrait;margin:12mm;}` +
    `@page landscape_page{size:A4 landscape;margin:8mm;}` +
    `*{box-sizing:border-box;}` +
    `body{font-family:Arial,sans-serif;font-size:9pt;margin:0;line-height:1.35;}` +
    `.portrait-sec{page:portrait_page;page-break-after:always;}` +
    `.landscape-sec{page:landscape_page;width:100%;}` +
    `table{border-collapse:collapse;width:100%;table-layout:fixed;}` +
    `th,td{border:1px solid #000;padding:4px 5px;vertical-align:top;overflow-wrap:break-word;word-break:normal;font-size:7.8pt;}` +
    `th{background:#f3f4f6;}` +
    `thead{display:table-header-group;}` +
    `tr{page-break-inside:avoid;}` +
    `.center{text-align:center;vertical-align:middle;}` +
    `</style></head><body>` +
    `<div class="portrait-sec" style="border:1px solid #000;padding:18px;min-height:265mm;display:flex;flex-direction:column;justify-content:space-between;">` +
    `<div>` +
    `<div class="center" style="margin:28px 0 36px 0;font-size:11pt;"><strong>ENGINEERING, PROCUREMENT, CONSTRUCTION, AND INSTALLATION OF WELLHEAD PLATFORMS, ASSOCIATED PIPELINES AND BROWNFIELD MODIFICATIONS<br/><br/>FOR<br/><br/>ZAWTIKA DEVELOPMENT PROJECT PHASE 1F</strong></div>` +
    `<div class="center" style="margin:36px 0 40px 0;font-size:13pt;"><strong>${String(h.title || "").toUpperCase()}</strong></div>` +
    `</div>` +
    `<table><tr><td colspan="4" style="border:none;"></td><th colspan="4">DOCUMENT CLASS: ${h.approvalClass || "1"}</th></tr>` +
    `<tr><th rowspan="2">REV</th><th rowspan="2">DATE</th><th rowspan="2">BY</th><th rowspan="2">DESCRIPTION</th><th colspan="2">CONTRACTOR APPROVAL</th><th colspan="2">COMPANY APPROVAL</th></tr>` +
    `<tr><th>CHECK</th><th>APPR.</th><th>CHECK</th><th>APPR.</th></tr>` +
    `<tr><td class="center">${h.revision}</td><td class="center">21-Nov-26</td><td class="center">ADDV</td><td>${h.purpose}</td><td class="center">—</td><td class="center">—</td><td class="center">—</td><td class="center">—</td></tr>` +
    `<tr><td colspan="8" class="center"><strong>REVISION CODE: A = Issued for Review – B = Issued for Approval – C = Approved for Construction</strong></td></tr>` +
    `<tr><td colspan="8" class="center" style="font-size:8pt;">TOTAL OR PARTIAL REPRODUCTION AND/OR UTILIZATION OF THIS DOCUMENT ARE FORBIDDEN WITHOUT PRIOR WRITTEN AUTHORIZATION OF THE OWNER</td></tr>` +
    `<tr><td rowspan="3" class="center">${pttepImg}</td><td colspan="5" class="center"><strong>PTTEP INTERNATIONAL LIMITED</strong><br/>EPCI OF WELLHEAD PLATFORMS, ASSOCIATED PIPELINES AND BROWNFIELD MODIFICATIONS FOR ZAWTIKA DEVELOPMENT PROJECT PHASE 1F</td><td colspan="2" rowspan="3" class="center">${rightLogos}</td></tr>` +
    `<tr><td colspan="4" rowspan="2" class="center"><strong>${h.addvalueDocNo}</strong></td><th class="center">REV</th></tr>` +
    `<tr><td class="center"><strong>${h.revision}</strong></td></tr>` +
    `</table></div>` +
    `<div class="portrait-sec">` +
    `<table style="margin-bottom:12px;"><tr><td class="center" style="width:16%;">${pttepImg}</td><th class="center" style="width:52%;">${String(h.title || "").toUpperCase()}</th><td class="center" style="width:18%;">${rightLogos}</td><td style="width:14%;"><strong>DOC NO:</strong> ${h.addvalueDocNo}<br/><strong>REV:</strong> ${h.revision}</td></tr></table>` +
    `<h3 class="center" style="margin:8px 0;">TABULATION OF REVISED PAGES</h3>` +
    `<table><thead><tr><th>SHEET</th><th>A1</th><th>B1</th><th>C1</th><th>C2</th><th>C3</th></tr></thead>` +
    `<tbody><tr><td class="center">1 (Cover)</td><td class="center">X</td><td></td><td></td><td></td><td></td></tr>` +
    `<tr><td class="center">2 (Tabulation)</td><td class="center">X</td><td></td><td></td><td></td><td></td></tr>` +
    `<tr><td class="center">3 (Data Sheet)</td><td class="center">X</td><td></td><td></td><td></td><td></td></tr></tbody></table></div>` +
    `<div class="landscape-sec">` +
    `<table style="margin-bottom:8px;"><tr><td class="center" style="width:12%;">${pttepImg}</td><th class="center" style="width:52%;">${String(h.title || "").toUpperCase()}</th><td class="center" style="width:18%;">${rightLogos}</td><td style="width:18%;"><strong>DOC NO:</strong> ${h.addvalueDocNo}<br/><strong>REV:</strong> ${h.revision}</td></tr></table>` +
    `<table><thead><tr>${ths}</tr></thead><tbody>${tbody}</tbody></table>` +
    `</div></body></html>`
  );
}

async function loadVdrlLogos() {
  const toDataUrl = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (_) {
      return null;
    }
  };
  const [pttep, jutal, samtel, avs] = await Promise.all([
    toDataUrl("/project0553/logos/logo-pttep.png"),
    toDataUrl("/project0553/logos/logo-jutal.png"),
    toDataUrl("/project0553/logos/logo-samtel.jpg"),
    toDataUrl("/project0553/logos/logo-avs.png"),
  ]);
  return { pttep, jutal, samtel, avs };
}

async function exportVdrlWordWithLogos(preview) {
  const logos = await loadVdrlLogos();
  downloadText(
    buildVdrlWordHtml(preview, logos),
    "application/msword;charset=utf-8",
    `${preview.header.addvalueDocNo}.doc`
  );
}

async function printVdrlWithLogos(preview) {
  const logos = await loadVdrlLogos();
  const html = buildVdrlWordHtml(preview, logos);
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (!doc) {
    iframe.remove();
    window.print();
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();
  window.setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    window.setTimeout(() => iframe.remove(), 2000);
  }, 300);
}

export function VdrlReportWorkspace0553({ onNavigate = null }) {
  const catalog = useMemo(() => selectVdrlReportCatalog0553(), []);
  const [mrFilter, setMrFilter] = useState("ALL");
  const [docTypeFilter, setDocTypeFilter] = useState("ALL");
  const [phaseFilter, setPhaseFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("VDRL-004");
  const [previewTab, setPreviewTab] = useState("DATA");
  const [fullHeight, setFullHeight] = useState(true);

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
              onClick={() => exportVdrlWordWithLogos(preview)}
            >
              Export Word ({preview.header.addvalueDocNo}.doc)
            </button>
            <button
              type="button"
              className="p553-detail-button"
              onClick={() => printVdrlWithLogos(preview)}
            >
              Print / Save PDF
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
          <div className="p553-filterbar p553-filterbar--simple" role="tablist" aria-label="VDRL Preview Sheets" style={{ marginBottom: 10 }}>
            <button type="button" className="p553-detail-button" aria-selected={previewTab === "COVER"} onClick={() => setPreviewTab("COVER")}>1. Cover Page</button>
            <button type="button" className="p553-detail-button" aria-selected={previewTab === "TABULATION"} onClick={() => setPreviewTab("TABULATION")}>2. Tabulation</button>
            <button type="button" className="p553-detail-button" aria-selected={previewTab === "DATA"} onClick={() => setPreviewTab("DATA")}>3. Data Sheet ({preview.rows.length} rows)</button>
            {previewTab === "DATA" && (
              <button type="button" className="p553-detail-button" aria-pressed={fullHeight} onClick={() => setFullHeight((v) => !v)}>
                {fullHeight ? "ย่อความสูงตาราง (Compact)" : "ขยายเต็มหน้า (Full Height)"}
              </button>
            )}
          </div>
          {previewTab === "COVER" && (
            <div className="p55-table-wrap" style={{ border: "1px solid #1e293b", padding: 16, background: "#fff" }}>
              <div style={{ textAlign: "center", margin: "12px 0 20px 0", fontWeight: 700 }}>
                ENGINEERING, PROCUREMENT, CONSTRUCTION, AND INSTALLATION OF WELLHEAD PLATFORMS, ASSOCIATED PIPELINES AND BROWNFIELD MODIFICATIONS<br />FOR<br />ZAWTIKA DEVELOPMENT PROJECT PHASE 1F
              </div>
              <div style={{ textAlign: "center", margin: "16px 0 24px 0", fontSize: "1.1rem", fontWeight: 700 }}>
                {String(preview.header.title || "").toUpperCase()}
              </div>
              <table className="p55-table p55-table--compact">
                <tbody>
                  <tr><td colSpan={4} style={{ border: "none" }} /><th colSpan={4}>DOCUMENT CLASS: {preview.header.approvalClass || "1"}</th></tr>
                  <tr><th rowSpan={2}>REV</th><th rowSpan={2}>DATE</th><th rowSpan={2}>BY</th><th rowSpan={2}>DESCRIPTION</th><th colSpan={2}>CONTRACTOR APPROVAL</th><th colSpan={2}>COMPANY APPROVAL</th></tr>
                  <tr><th>CHECK</th><th>APPR.</th><th>CHECK</th><th>APPR.</th></tr>
                  <tr><td>{preview.header.revision}</td><td>21-Nov-26</td><td>ADDV</td><td>{preview.header.purpose}</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
                  <tr><td colSpan={8} style={{ textAlign: "center", fontWeight: 600 }}>REVISION CODE: A = Issued for Review – B = Issued for Approval – C = Approved for Construction</td></tr>
                  <tr>
                    <td rowSpan={3} style={{ textAlign: "center", verticalAlign: "middle" }}><img src="/project0553/logos/logo-pttep.png" alt="PTTEP" style={{ height: 42, width: "auto" }} /></td>
                    <td colSpan={5} style={{ textAlign: "center" }}><strong>PTTEP INTERNATIONAL LIMITED</strong><br />EPCI OF WELLHEAD PLATFORMS, ASSOCIATED PIPELINES AND BROWNFIELD MODIFICATIONS FOR ZAWTIKA DEVELOPMENT PROJECT PHASE 1F</td>
                    <td colSpan={2} rowSpan={3} style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <img src="/project0553/logos/logo-jutal.png" alt="JUTAL" style={{ height: 22, width: "auto", marginRight: 4 }} />
                      <img src="/project0553/logos/logo-samtel.jpg" alt="SAMTEL" style={{ height: 20, width: "auto", marginRight: 4 }} />
                      <img src="/project0553/logos/logo-avs.png" alt="ADDVALUE" style={{ height: 22, width: "auto" }} />
                    </td>
                  </tr>
                  <tr><td colSpan={4} rowSpan={2} style={{ textAlign: "center" }}><strong>{preview.header.addvalueDocNo}</strong></td><th>REV</th></tr>
                  <tr><td style={{ textAlign: "center", fontWeight: 700 }}>{preview.header.revision}</td></tr>
                </tbody>
              </table>
            </div>
          )}
          {previewTab === "TABULATION" && (
            <div className="p55-table-wrap">
              <table className="p55-table p55-table--compact">
                <thead><tr><th>SHEET</th><th>A1</th><th>B1</th><th>C1</th><th>C2</th><th>C3</th></tr></thead>
                <tbody>
                  <tr><td>1 (Cover)</td><td>X</td><td /><td /><td /><td /></tr>
                  <tr><td>2 (Tabulation)</td><td>X</td><td /><td /><td /><td /></tr>
                  <tr><td>3 (Data)</td><td>X</td><td /><td /><td /><td /></tr>
                </tbody>
              </table>
            </div>
          )}
          {previewTab === "DATA" && (<>
          <div className="p55-table-wrap" style={{ marginBottom: 10 }}>
            <table className="p55-table p55-table--compact">
              <tbody>
                <tr>
                  <td rowSpan={3} style={{ textAlign: "center", verticalAlign: "middle", width: 90 }}>
                    <img src="/project0553/logos/logo-pttep.png" alt="PTTEP" style={{ height: 40, width: "auto" }} />
                  </td>
                  <th>ADDVALUE Doc No.</th><td><code>{preview.header.addvalueDocNo}</code></td>
                  <th>Client Doc No.</th><td><code>{preview.header.clientDocNo}</code></td>
                  <td rowSpan={3} style={{ textAlign: "center", verticalAlign: "middle", width: 170 }}>
                    <img src="/project0553/logos/logo-jutal.png" alt="JUTAL" style={{ height: 22, width: "auto", marginRight: 6 }} />
                    <img src="/project0553/logos/logo-samtel.jpg" alt="SAMTEL" style={{ height: 20, width: "auto", marginRight: 6 }} />
                    <img src="/project0553/logos/logo-avs.png" alt="ADDVALUE" style={{ height: 22, width: "auto" }} />
                  </td>
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
          <div className="p55-table-wrap" style={fullHeight ? { overflowX: "auto" } : { maxHeight: 340, overflowY: "auto", overflowX: "auto" }}>
            <table className="p55-table p55-table--compact" style={{ width: "100%", tableLayout: "auto", fontSize: "0.78rem", lineHeight: 1.35 }}>
              <thead>
                <tr>{preview.columns.map((c) => <th key={c} style={{ minWidth: colWidthPct(c), whiteSpace: "normal", wordBreak: "normal", overflowWrap: "break-word", padding: "5px 6px" }}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {groupRowsGfBf(preview).map((g) => (
                  <React.Fragment key={g.key}>
                    <tr>
                      <td colSpan={preview.columns.length} style={{ background: "#e2e8f0", fontWeight: 700, padding: "6px 8px" }}>
                        {g.title} ({g.rows.length})
                      </td>
                    </tr>
                    {g.rows.map((row, i) => (
                      <tr key={`${g.key}-${i}`}>{row.map((cell, j) => <td key={j} style={{ whiteSpace: "normal", wordBreak: "normal", overflowWrap: "break-word", padding: "5px 6px" }}>{cell}</td>)}</tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          </>)}
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
