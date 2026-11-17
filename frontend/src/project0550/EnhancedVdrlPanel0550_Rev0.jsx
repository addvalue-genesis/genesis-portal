import React, { useMemo } from 'react';
import {
  DOCUMENT_EQUATIONS_REV0,
  listEquations,
} from './data/documentEquations_Rev0';
import sdrlDocumentEquations from './data/sdrlDocumentEquations0550.json';

const TREATMENT_LABEL = {
  SAMPLE: 'SAMPLE — representative With-Bid excerpt from Memory',
  FULL: 'FULL — complete With-Bid package from Memory / VND',
  STATEMENT: 'STATEMENT — With-Bid intent + OPEN gaps (no deliverable bytes claimed)',
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function appendix3SdrlWordHtml({ documentNo, revision, rows, generalFormula }) {
  const today = new Date().toISOString().slice(0, 10);
  const bodyRows = rows
    .map(
      (r) => `<tr>
<td>${escapeHtml(r.code)}</td>
<td>${escapeHtml(r.description)}</td>
<td>${escapeHtml(r.withBidTreatment)}<br/><small>${escapeHtml(TREATMENT_LABEL[r.withBidTreatment] || '')}</small></td>
<td><pre>${escapeHtml(r.equation)}</pre></td>
</tr>`
    )
    .join('');
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:w="urn:schemas-microsoft-com:office:word"
 xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<title>PJ2608-0550 APPENDIX 3 SDRL — With Bid / Equations (Rev.0)</title>
<style>
body{font:12pt Arial,sans-serif;color:#17304a;line-height:1.4;margin:24px}
h1{font-size:18pt}h2{font-size:14pt;color:#12536b}
table{width:100%;border-collapse:collapse;font-size:10pt;table-layout:fixed;margin:12px 0}
td,th{border:1px solid #aebfc9;padding:6px;vertical-align:top;text-align:left;word-wrap:break-word}
th{background:#edf5f8}
pre{white-space:pre-wrap;font:inherit;margin:0}
.draft{border:2px solid #a86b0a;padding:10px;background:#fff8e5}
.meta{color:#637083}
</style>
</head>
<body>
<h1>APPENDIX 3 · SDRL / VDRL With Bid — PJ2608-0550</h1>
<p class="draft"><strong>DRAFT — Volume II ≡ 12.V VDRL · Code Revision 0</strong><br/>
HTML-to-Word export. Not a customer issue. Confirm current MR Appendix 3 authority separately.</p>
<p class="meta">Document No.: <strong>${escapeHtml(documentNo || 'OPEN')}</strong>
 · Revision: <strong>${escapeHtml(revision || 'Rev.0')}</strong>
 · Export date: ${escapeHtml(today)}
 · Equations pack: ${escapeHtml(DOCUMENT_EQUATIONS_REV0.revision)}</p>
<h2>General formula</h2>
<p><pre>${escapeHtml(generalFormula)}</pre></p>
<h2>Priority SDRL codes · WITH BID treatment &amp; equations</h2>
<table>
<thead><tr><th style="width:12%">Code</th><th style="width:22%">Description</th><th style="width:18%">WITH BID Treatment</th><th>Equation</th></tr></thead>
<tbody>${bodyRows}</tbody>
</table>
<p class="meta">B03/B05 default SAMPLE · B08/B11 default FULL · LINK_BUDGET/C02 default STATEMENT.
Native MR B1 Appendix 3 With Bid cells remain unmarked; this table is SI Memory planning only.</p>
</body>
</html>`;
}

function downloadAppendix3SdrlWord({ documentNo, revision, rows, generalFormula }) {
  const html = appendix3SdrlWordHtml({ documentNo, revision, rows, generalFormula });
  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const rev = String(revision || 'Rev0').replace(/[^\w.-]+/g, '_');
  a.href = url;
  a.download = `PJ2608-0550_APPENDIX-3_SDRL_WithBid_${rev}_Rev0.doc`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Enhanced 12.V VDRL panel — equations + APPENDIX 3 Word export (Rev.0).
 * Additive to VdrlWorkspace0550; reads documentNo/revision from technicalProposal when present.
 */
export function EnhancedVdrlPanel0550({ data }) {
  const rows = useMemo(() => listEquations(), []);
  const documentNo = data?.technicalProposal?.documentNo || data?.bidVolumes?.documentNo || '';
  const revision =
    data?.technicalProposal?.revision || data?.bidVolumes?.revision || DOCUMENT_EQUATIONS_REV0.revision;

  return (
    <section className="p55-panel" data-component-key="bid.technical.vdrl.enhanced-rev0" aria-label="Enhanced VDRL equations Rev.0">
      <h3>12.V · Enhanced VDRL / With Bid equations (Rev.0)</h3>
      <p>
        Volume II ≡ 12.V VDRL. Priority SDRL codes draw WITH BID treatment and equations from Memory
        (VND PDF/datasheet + SI history). Native Appendix 3 With Bid marks stay unmarked until reviewed.
      </p>
      <p>
        Document No.: <strong>{documentNo || 'OPEN'}</strong>
        {' · '}
        Revision: <strong>{revision || 'OPEN'}</strong>
        {' · '}
        Pack: {DOCUMENT_EQUATIONS_REV0.revision}
      </p>
      <details>
        <summary>General formula</summary>
        <pre>{DOCUMENT_EQUATIONS_REV0.generalFormula}</pre>
      </details>
      <div className="p55-review-toolbar">
        <button
          type="button"
          onClick={() =>
            downloadAppendix3SdrlWord({
              documentNo,
              revision,
              rows,
              generalFormula: DOCUMENT_EQUATIONS_REV0.generalFormula,
            })
          }
        >
          ส่งออก APPENDIX 3 SDRL เป็น Word
        </button>
      </div>
      <div className="p55-table-wrap">
        <table className="p55-table" aria-label="Enhanced VDRL WITH BID equations">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>WITH BID Treatment</th>
              <th>Equation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code}>
                <td>{r.code}</td>
                <td>{r.description}</td>
                <td>
                  {r.withBidTreatment}
                  <small>{TREATMENT_LABEL[r.withBidTreatment]}</small>
                </td>
                <td>
                  <pre>{r.equation}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4 style={{ marginTop: 14 }}>Canonical SDRL Deliverable Equations ({sdrlDocumentEquations.generalFormula})</h4>
      <div className="p55-table-wrap">
        <table className="p55-table" aria-label="Canonical SDRL Generation Equations">
          <thead>
            <tr>
              <th>Code</th>
              <th>Deliverable Class</th>
              <th>Equation</th>
              <th>WITH BID / POST-AWARD &amp; Gate §10</th>
            </tr>
          </thead>
          <tbody>
            {(sdrlDocumentEquations.sdrlDeliverables || []).map((d) => (
              <tr key={d.code}>
                <td><strong>{d.code}</strong></td>
                <td>{d.title}</td>
                <td><code>{d.formula}</code></td>
                <td>
                  <div>{d.withBidRule}</div>
                  <div><small>{d.postAwardRule} · {d.crossVolumeGate}</small></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default EnhancedVdrlPanel0550;
