import React, { useMemo, useState } from "react";
import { ComponentCopyId } from "../common/ui/ComponentCopyId";
import { AuditBadge, AuditSection } from "../common/ui/ProjectAuditPrimitives";
import { selectDeviationRegister0553 } from "./data/deviationRegister0553";
import TC_HISTORY_0553 from "./data/snapshots/tc.communication.history.0553.json";
import PARTICULAR_REQS_0553 from "./data/documentParticularRequirements0553.json";
import MR_CRS_BLUE_0553 from "./data/snapshots/mr.crs.and.bluetext.0553.json";
import {
  PARTICULAR_DIRECTIVE_EQUATION_0553,
  evaluateParticularDirective0553,
} from "./data/particularDirectiveRule0553";

function inferMrGroup0553(rec) {
  const tags = (rec.tags || []).join(" ").toUpperCase();
  const text = `${rec.topic || ""} ${rec.requirement || ""}`.toUpperCase();
  if (/MR-502|ANT-502|LAN-502|DATO-507|TCAB-500|SA-502|SA-507|ZPQ|ZWP8|ZWP11|SCADA|NMS|PTMP/.test(tags + " " + text)) return "MR-0001";
  if (/LNA|BDA|DMR|TRUNK|RAD-508|YAGI|OMNI/.test(tags + " " + text)) return "MR-0002";
  if (/PHONE|SOUNDER|PABX|TPH-504|LSE-504|TCAB-504/.test(tags + " " + text)) return "MR-0003";
  if (/RACON|MAR-514|MORSE|S\/X|9\.3/.test(tags + " " + text)) return "MR-0004";
  return "SYSTEM";
}

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
  const [historyDoc, setHistoryDoc] = useState("ALL");
  const [historyImpact, setHistoryImpact] = useState("ALL");
  const [partDoc, setPartDoc] = useState("ALL");
  const [partMr, setPartMr] = useState("ALL");
  const [partDir, setPartDir] = useState("ALL");
  const register = useMemo(() => selectDeviationRegister0553(), []);
  const isAVS = viewer === "AVS";

  const tcRows = register.records.filter((r) => r.category === "TECHNICAL_CLARIFICATION");
  const cclRows = register.records.filter((r) => r.category === "COMMERCIAL_CLARIFICATION");
  const allClarify = [...tcRows, ...cclRows];
  const visibleRows = subTab === "tc" ? tcRows : subTab === "ccl" ? cclRows : allClarify;
  const particularRows = useMemo(
    () =>
      (PARTICULAR_REQS_0553.records || [])
        .map((r) => {
          const evalRes = evaluateParticularDirective0553({
            text: r.requirement,
            topic: r.topic,
            signals: { red: r.decisionStatus === "REQUIRES_ENGINEERING_EVALUATION" },
            decisionStatus: r.decisionStatus,
          });
          return { ...r, mrGroup: inferMrGroup0553(r), directive: evalRes.directive, phi: evalRes.phi };
        })
        .filter((r) => {
          if (partDoc !== "ALL" && r.document !== partDoc) return false;
          if (partMr !== "ALL" && r.mrGroup !== partMr) return false;
          if (partDir !== "ALL" && r.directive !== partDir) return false;
          return true;
        }),
    [partDoc, partMr, partDir]
  );
  const historyRows = useMemo(
    () =>
      (TC_HISTORY_0553.items || []).filter((item) => {
        if (historyDoc !== "ALL" && item.doc !== historyDoc) return false;
        if (isAVS && historyImpact !== "ALL" && !item.impact?.[historyImpact]) return false;
        return true;
      }),
    [historyDoc, historyImpact, isAVS]
  );

  const renderTable = (rows) => (
    <div className="p55-table-wrap">
      <table className="p55-table p55-table--budget" style={{ tableLayout: "fixed", width: "100%", minWidth: 980 }}>
        <colgroup>
          <col style={{ width: 108 }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "20%" }} />
          {isAVS && <col style={{ width: "17%" }} />}
          <col style={{ width: 145 }} />
        </colgroup>
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
              <td style={{ verticalAlign: "top" }}>
                <strong style={{ whiteSpace: "nowrap" }}>{r.id}</strong>
                <small>{r.mr} · {r.code}</small>
              </td>
              <td style={{ verticalAlign: "top", overflowWrap: "break-word" }}>
                <strong>{r.title}</strong>
                {isAVS && r.customerComment && <small>JUTAL: {r.customerComment}</small>}
              </td>
              <td style={{ verticalAlign: "top", overflowWrap: "break-word" }}>{r.mrRequirement}</td>
              <td style={{ verticalAlign: "top", overflowWrap: "break-word" }}>{r.offeredBasis}</td>
              <td style={{ verticalAlign: "top", overflowWrap: "anywhere" }}>{r.justification}</td>
              {isAVS && (
                <td style={{ verticalAlign: "top", overflowWrap: "break-word" }}>
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
              <td style={{ verticalAlign: "top", overflowWrap: "anywhere", whiteSpace: "normal" }}>
                <span className="p55-badge" style={{ whiteSpace: "normal", display: "inline-block", lineHeight: 1.35, overflowWrap: "anywhere" }}>
                  {r.status}
                </span>
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
              ["history", `15.4 History & Source Chain (${(TC_HISTORY_0553.items || []).length})`],
              ["particulars", `15.5 Particulars (MR/BOD/DTS/SPE) (${(PARTICULAR_REQS_0553.records || []).length})`],
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

      {subTab === "particulars" ? (
        <AuditSection title="15.5 — CUS Particular Requirements (MR / PHI / BOD / DTS / SPE / LIS)">
          <div data-component-key="bid.clarify.particulars">
            <p className="p55-note">
              ข้อกำหนดเฉพาะโครงการ (<strong>Particular</strong>) แยกตามระบบ MR และหมวดเอกสาร — ข้อความ{" "}
              <strong style={{ color: "#b91c1c" }}>ตัวอักษรสีแดง</strong> คือจุดที่ต้องระวัง และ{" "}
              <strong style={{ color: "#1d4ed8" }}>ตัวอักษรสีน้ำเงิน</strong> คือข้อความปรับแก้ใน MR / BOD / SPE / DTS{" "}
              {isAVS && <code>{PARTICULAR_DIRECTIVE_EQUATION_0553.id}</code>}{" "}
              <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.clarify.particulars" />
            </p>
            <details className="p553-budget-phase" open style={{ marginBottom: 12 }}>
              <summary>
                <strong>Blue-Text Revisions (MR / BOD / SPE / DTS: {MR_CRS_BLUE_0553.blueTextParticulars.length}) &amp; Common MR Client Comments — WichaiS ({MR_CRS_BLUE_0553.commonReviewComments.length})</strong>
              </summary>
              <div className="p55-table-wrap" style={{ marginBottom: 10 }}>
                <table className="p55-table p55-table--compact">
                  <thead>
                    <tr><th>ID</th><th>MR / Page</th><th>Blue-Text Revision</th><th>Directive ({PARTICULAR_DIRECTIVE_EQUATION_0553.id})</th><th>ความหมาย / ผลกระทบ</th></tr>
                  </thead>
                  <tbody>
                    {MR_CRS_BLUE_0553.blueTextParticulars.map((b) => {
                      const ev = evaluateParticularDirective0553({ text: b.note, topic: b.topic, signals: { blue: true } });
                      return (
                        <tr key={b.id}>
                          <td><strong>{b.id}</strong></td>
                          <td><strong>{b.mr}</strong><small>{b.page}</small></td>
                          <td style={{ color: "#1d4ed8", fontWeight: 600 }}>{b.note}</td>
                          <td>
                            <span className="p55-badge">{ev.directive}</span>
                            {isAVS && (
                              <small>
                                {ev.phi.cus ? "CUS " : ""}{ev.phi.vnd ? "07 VND " : ""}{ev.phi.si ? "SI" : ""}
                              </small>
                            )}
                          </td>
                          <td>{b.topic}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p55-table-wrap">
                <table className="p55-table p55-table--compact">
                  <thead>
                    <tr><th>No.</th><th>MR / Ref</th><th>Client Comments (Reviewer)</th><th>Contractor Response</th><th>Status / By</th></tr>
                  </thead>
                  <tbody>
                    {MR_CRS_BLUE_0553.commonReviewComments.map((c) => (
                      <tr key={c.no}>
                        <td>{c.no}</td>
                        <td><strong>{c.mr}</strong><small>{c.pageRef}</small></td>
                        <td>{c.clientComment}</td>
                        <td>{c.contractorResponse}</td>
                        <td><span className="p55-badge">{c.status}</span><small>{c.commentBy}</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
            <div className="p55-filterbar p55-filterbar--simple" style={{ marginBottom: 10 }}>
              <label>
                MR Group{" "}
                <select value={partMr} onChange={(e) => setPartMr(e.target.value)}>
                  <option value="ALL">All MR / Systems ({(PARTICULAR_REQS_0553.records || []).length})</option>
                  <option value="MR-0001">MR-0001 (SCADA Radio)</option>
                  <option value="MR-0002">MR-0002 (DMR Trunk Radio)</option>
                  <option value="MR-0003">MR-0003 (Ex Telephone &amp; Sounder)</option>
                  <option value="MR-0004">MR-0004 (Marine RACON)</option>
                  <option value="SYSTEM">SYSTEM (General / Cross-MR)</option>
                </select>
              </label>
              <label>
                Document{" "}
                <select value={partDoc} onChange={(e) => setPartDoc(e.target.value)}>
                  <option value="ALL">All Docs (MR / BOD / DTS / SPE / RPT / BLD)</option>
                  <option value="MR">MR</option>
                  <option value="BOD">BOD</option>
                  <option value="DTS">DTS</option>
                  <option value="SPE">SPE</option>
                  <option value="RPT">RPT</option>
                  <option value="BLD">BLD</option>
                </select>
              </label>
              <label>
                Directive{" "}
                <select value={partDir} onChange={(e) => setPartDir(e.target.value)}>
                  <option value="ALL">All Directives</option>
                  <option value="MUST_DO">MUST_DO (ต้องทำ)</option>
                  <option value="DO_NOT">DO_NOT (ห้าม/ตัดออก)</option>
                  <option value="OPTIONAL_SCOPE">OPTIONAL_SCOPE (แยก Option)</option>
                  <option value="DEVIATION_SI">DEVIATION_SI (เบี่ยงเบน)</option>
                  <option value="CLARIFY_CUS">CLARIFY_CUS (ชี้แจง)</option>
                </select>
              </label>
            </div>
            <div className="p55-table-wrap">
              <table className="p55-table p55-table--budget" style={{ tableLayout: "fixed", width: "100%", minWidth: 960 }}>
                <colgroup>
                  <col style={{ width: 108 }} />
                  <col style={{ width: 110 }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "36%" }} />
                  {isAVS && <col style={{ width: "22%" }} />}
                  <col style={{ width: 130 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>ID / MR</th>
                    <th>Doc / Sec</th>
                    <th>Topic / TAGs</th>
                    <th>Particular Requirement (Red = Critical Note)</th>
                    {isAVS && <th>SI Action / Cost Driver</th>}
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {particularRows.map((r) => {
                    const isCritical =
                      r.decisionStatus === "REQUIRES_ENGINEERING_EVALUATION" ||
                      /conflict|deviation|not |no |min |retain|stricter|only/i.test(r.requirement || "");
                    return (
                      <tr key={r.id}>
                        <td><strong>{r.id}</strong><small>{r.mrGroup}</small></td>
                        <td><strong>{r.document}</strong><small>§{r.section || "-"} · p.{r.page || "-"}</small></td>
                        <td style={{ overflowWrap: "break-word" }}>
                          <strong>{r.topic}</strong>
                          <small>{(r.tags || []).join(", ")}</small>
                        </td>
                        <td style={{ overflowWrap: "anywhere" }}>
                          <span style={isCritical ? { color: "#b91c1c", fontWeight: 700 } : undefined}>
                            {isCritical ? "PARTICULAR NOTE: " : ""}
                            {r.requirement}
                          </span>
                        </td>
                        {isAVS && (
                          <td style={{ overflowWrap: "anywhere" }}>
                            {r.siAction || "—"}
                            {r.costDriver && <small>Driver: {r.costDriver}</small>}
                          </td>
                        )}
                        <td>
                          <span className="p55-badge" style={{ whiteSpace: "normal", display: "inline-block" }}>{r.directive}</span>
                          {isAVS && <small>{r.phi.cus ? "CUS " : ""}{r.phi.vnd ? "07 VND " : ""}{r.phi.si ? "SI" : ""}</small>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </AuditSection>
      ) : subTab === "history" ? (
        <AuditSection title="15.4 — TC / CCL History & Source Chain (MR Addendum Baseline)">
          <div data-component-key="bid.clarify.history">
            <p className="p55-note">
              ห่วงโซ่เอกสาร <strong>JUTAL (GCME) → SAMTEL → ADDVALUE → SAMTEL → JUTAL (GCME)</strong> — เชื่อมข้อคำถาม-คำตอบรายข้อกับต้นฉบับ Google Drive และผลกระทบ <strong>CUS / 07 VND / SI</strong>{" "}
              <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.clarify.history" />
            </p>
            {isAVS && (
              <details className="p553-budget-phase" style={{ marginBottom: 12 }}>
                <summary>
                  <strong>Original TC Source Files on Google Drive ({TC_HISTORY_0553.documents.length} files)</strong>{" "}
                  <a href={TC_HISTORY_0553.folderUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                    Open TC Folder ↗
                  </a>
                </summary>
                <div className="p55-table-wrap">
                  <table className="p55-table p55-table--compact">
                    <thead>
                      <tr><th>Doc</th><th>MR</th><th>Date</th><th>Flow</th><th>Original File (Google Drive)</th></tr>
                    </thead>
                    <tbody>
                      {TC_HISTORY_0553.documents.map((d) => (
                        <tr key={d.id}>
                          <td><strong>{d.doc}</strong></td>
                          <td>{d.mr}</td>
                          <td>{d.date}</td>
                          <td>{d.direction}</td>
                          <td><a href={d.url} target="_blank" rel="noreferrer">{d.name} ↗</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
            <div className="p55-filterbar p55-filterbar--simple" style={{ marginBottom: 10 }}>
              <label>
                Document{" "}
                <select value={historyDoc} onChange={(e) => setHistoryDoc(e.target.value)}>
                  <option value="ALL">All ({(TC_HISTORY_0553.items || []).length})</option>
                  <option value="TC-0001">TC-0001 (MR-0001)</option>
                  <option value="TC-0002">TC-0002 (MR-0002)</option>
                  <option value="TC-0003">TC-0003 (MR-0003)</option>
                </select>
              </label>
              {isAVS && (
                <label>
                  Impact{" "}
                  <select value={historyImpact} onChange={(e) => setHistoryImpact(e.target.value)}>
                    <option value="ALL">All Tiers</option>
                    <option value="cus">CUS (Customer Scope / 10.3)</option>
                    <option value="vnd">07 VND (Vendor / OEM)</option>
                    <option value="si">SI (Cost / Engineering 10.1 / 10.2)</option>
                  </select>
                </label>
              )}
            </div>
            <div className="p55-table-wrap">
              <table className="p55-table p55-table--budget" style={{ tableLayout: "fixed", width: "100%", minWidth: 980 }}>
                <colgroup>
                  <col style={{ width: 96 }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "18%" }} />
                  {isAVS && <col style={{ width: 150 }} />}
                  <col style={{ width: 120 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>ID / MR</th>
                    <th>Subject / Ref</th>
                    <th>Question (JUTAL / GCME)</th>
                    <th>Initial / Client Status</th>
                    <th>Reply (2026-10-19)</th>
                    {isAVS && <th>Impact &amp; Source</th>}
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRows.map((it) => (
                    <tr key={it.id}>
                      <td><strong>{it.id}</strong><small>{it.mr}</small></td>
                      <td style={{ overflowWrap: "break-word" }}><strong>{it.subject || "—"}</strong>{it.reference && <small>{it.reference}</small>}</td>
                      <td style={{ overflowWrap: "anywhere" }}>{it.question || "—"}</td>
                      <td style={{ overflowWrap: "anywhere" }}>{it.vendorResponse || "—"}{it.clientResponse && <small>Client: {it.clientResponse}</small>}</td>
                      <td style={{ overflowWrap: "anywhere" }}>{it.reply20261019 || "—"}</td>
                      {isAVS && (
                        <td>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                            {it.impact?.cus && <span className="p55-badge">CUS</span>}
                            {it.impact?.vnd && <span className="p55-badge">07 VND</span>}
                            {it.impact?.si && <span className="p55-badge">SI</span>}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 11 }}>
                            <a href={it.incomingUrl} target="_blank" rel="noreferrer">In (10-14) ↗</a>
                            <a href={it.outgoingUrl} target="_blank" rel="noreferrer">Out (10-19) ↗</a>
                          </div>
                        </td>
                      )}
                      <td><span className="p55-badge" style={{ whiteSpace: "normal", display: "inline-block" }}>{it.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AuditSection>
      ) : subTab === "export" ? (
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
