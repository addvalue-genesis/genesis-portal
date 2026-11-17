import React, { useMemo, useRef, useState } from 'react';
import {
  DTS_AREAS_0550,
  DTS_REVISIONS_0550,
  DTS_WORKFLOWS_0550,
  buildDtsHtml0550,
  downloadDtsDocx0550,
  generateDtsDocument0550,
  verifyDtsGates0550,
} from './data/dtsGenerator0550';
import { formatPttepFileName0550, isInternalPttepRevision0550 } from './data/pttepDocControl0550';

export function DtsDocumentStudio({ data, model, systems = [], defaultSystem = 'TEL-DMR', today = '2026-11-17' }) {
  const [workflow, setWorkflow] = useState('WORKFLOW_A');
  const [systemToken, setSystemToken] = useState(defaultSystem || 'TEL-DMR');
  const [area, setArea] = useState('APF');
  const [mode, setMode] = useState('internal');
  const [revision, setRevision] = useState('A1');
  const [exportNotice, setExportNotice] = useState('');
  const iframeRef = useRef(null);

  const systemOptions = useMemo(() => {
    const base = systems.map(s => ({ token: s.token, name: s.name }));
    if (!base.some(s => s.token === 'COMMON')) {
      base.push({ token: 'COMMON', name: 'Common / Shared Telecom Scope' });
    }
    return base;
  }, [systems]);

  const dts = useMemo(
    () =>
      generateDtsDocument0550({
        data,
        model,
        systems: systemOptions,
        systemToken,
        area,
        workflow,
        revision,
        today,
      }),
    [data, model, systemOptions, systemToken, area, workflow, revision, today]
  );

  const effectiveRev = mode === 'customer' && isInternalPttepRevision0550(revision) ? 'A1' : revision;

  const html = useMemo(
    () => buildDtsHtml0550(dts, { mode, revision: effectiveRev }),
    [dts, mode, effectiveRev]
  );

  const gates = useMemo(() => verifyDtsGates0550(dts, { mode }), [dts, mode]);

  const pdfFileName = formatPttepFileName0550({
    area: dts.area,
    pkg: dts.pkg,
    discipline: 'TEL',
    docType: 'DTS',
    seq: dts.seq,
    rev: effectiveRev,
    ext: 'pdf',
    internal: mode === 'internal',
  });

  const handleExportDocx = () => {
    const file = downloadDtsDocx0550(dts, { mode, revision: effectiveRev });
    setExportNotice(`Exported Word: ${file}`);
  };

  const handlePrintPdf = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    const prevTitle = document.title;
    document.title = pdfFileName.replace(/\.pdf$/i, '');
    win.focus();
    win.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 1000);
    setExportNotice(`Print / Save as PDF triggered: ${pdfFileName}`);
  };

  return (
    <div className="p55-dts-studio" data-dts-studio="true">
      <div
        className="xb"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: '#f8fafc',
          border: '1px solid #bfd0db',
          borderRadius: 6,
          padding: '10px 12px',
          marginBottom: 12,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <label>
            Workflow{' '}
            <select aria-label="DTS Workflow" value={workflow} onChange={e => setWorkflow(e.target.value)}>
              {DTS_WORKFLOWS_0550.map(w => (
                <option key={w.id} value={w.id}>
                  {w.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            System{' '}
            <select aria-label="DTS System" value={systemToken} onChange={e => setSystemToken(e.target.value)}>
              {systemOptions.map(s => (
                <option key={s.token} value={s.token}>
                  {s.token} · {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Area{' '}
            <select aria-label="DTS Area" value={area} onChange={e => setArea(e.target.value)}>
              {DTS_AREAS_0550.map(a => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <label>
            Revision{' '}
            <select aria-label="DTS Revision" value={revision} onChange={e => setRevision(e.target.value)}>
              {DTS_REVISIONS_0550.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <div role="group" aria-label="DTS Dual-View Mode" style={{ display: 'inline-flex', gap: 4 }}>
            <button
              type="button"
              aria-pressed={mode === 'internal'}
              onClick={() => setMode('internal')}
              style={{
                background: mode === 'internal' ? '#d97706' : '#e2e8f0',
                color: mode === 'internal' ? '#fff' : '#0f172a',
                fontWeight: 700,
              }}
            >
              Internal (full notes)
            </button>
            <button
              type="button"
              aria-pressed={mode === 'customer'}
              onClick={() => setMode('customer')}
              style={{
                background: mode === 'customer' ? '#0f3b5c' : '#e2e8f0',
                color: mode === 'customer' ? '#fff' : '#0f172a',
                fontWeight: 700,
              }}
            >
              Customer Preview (clean)
            </button>
          </div>
          <button type="button" onClick={handleExportDocx}>
            Export .docx
          </button>
          <button type="button" onClick={handlePrintPdf}>
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 12,
          padding: '8px 10px',
          background: '#eef5f9',
          border: '1px solid #cbd5e1',
          borderRadius: 4,
          marginBottom: 10,
        }}
      >
        <span>
          <strong>PTTEP §7.5 Export Name:</strong> <code>{gates.fileName}</code>
        </span>
        <span>
          <strong>Gate R1 (No COMPLY on OPEN):</strong> {gates.r1Pass ? 'PASS' : `FAIL (${gates.r1Violations.length})`}
        </span>
        <span>
          <strong>Gate R2 (11.C1/11.P Sync &amp; 0 Leaks):</strong> {gates.r2Pass ? 'PASS' : 'FAIL'} ({dts.specRows.length} spec rows,{' '}
          {dts.tagRows.length} tags, {gates.c1SyncCount} C1 rows)
        </span>
        {mode === 'customer' && isInternalPttepRevision0550(revision) && (
          <span style={{ color: '#92400e' }}>
            Note: Internal revision {revision} stripped in Customer Preview; exporting as Rev.{effectiveRev}.
          </span>
        )}
      </div>

      {exportNotice && (
        <p role="status" style={{ fontSize: 12, color: '#0f3b5c', fontWeight: 600 }}>
          {exportNotice}
        </p>
      )}

      <iframe
        ref={iframeRef}
        title="DTS Document Studio A4 Preview"
        sandbox="allow-same-origin allow-modals"
        srcDoc={html}
        style={{ width: '100%', height: 820, border: '1px solid #bfd0db', background: '#fff' }}
      />
    </div>
  );
}
