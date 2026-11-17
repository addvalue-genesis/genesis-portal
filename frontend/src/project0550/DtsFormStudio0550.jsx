import React, { useEffect, useMemo, useRef, useState } from 'react';
import './dtsFormTemplate0550.css';
import {
  DTS_FORM_AREAS_0550,
  DTS_FORM_REVISIONS_0550,
  buildDtsFormModel0550,
  exportDtsFormWord0550,
  fixWidths,
} from './data/dtsFormEngine0550';
import {
  AVS_LOGO_DATA_URI,
  OMEGA_LOGO_DATA_URI,
  PTTEP_LOGO_DATA_URI,
} from './data/dtsFormLogos0550';

function collectDtsFormCssText() {
  if (typeof document === 'undefined') return '';
  const chunks = [];
  for (const sheet of Array.from(document.styleSheets || [])) {
    try {
      for (const rule of Array.from(sheet.cssRules || [])) {
        if (/dts-root|cv-|as-|ph|tb|sb|foot|basis|notes|vm-warn|intblock|lg-/.test(rule.cssText)) {
          chunks.push(rule.cssText);
        }
      }
    } catch {
      // Cross-origin stylesheet guard
    }
  }
  return chunks.join('\n');
}

export function DtsFormStudio0550({
  data,
  model,
  systems = [],
  defaultSystem = 'TEL-DMR',
  today = '2026-11-17',
}) {
  const [mode, setMode] = useState('customer');
  const [systemToken, setSystemToken] = useState(defaultSystem || 'TEL-DMR');
  const [area, setArea] = useState('APF');
  const [revision, setRevision] = useState('A1');
  const [notice, setNotice] = useState('');
  const rootRef = useRef(null);

  const systemOptions = useMemo(() => {
    const base = systems.map(s => ({ token: s.token, name: s.name }));
    if (!base.some(s => s.token === 'COMMON')) {
      base.push({ token: 'COMMON', name: 'Common / Shared Telecom Scope' });
    }
    return base;
  }, [systems]);

  const form = useMemo(
    () =>
      buildDtsFormModel0550({
        data,
        model,
        systems: systemOptions,
        systemToken,
        area,
        revision,
        mode,
        today,
      }),
    [data, model, systemOptions, systemToken, area, revision, mode, today]
  );

  useEffect(() => {
    if (rootRef.current) {
      fixWidths(rootRef.current, 17);
    }
  }, [form]);

  const isInternal = mode === 'internal';
  const colCount = isInternal ? 6 : 4;
  const blankCoverRows = Math.max(0, 4 - form.revisionHistory.length);

  const handleExportDocx = () => {
    const cssText = collectDtsFormCssText();
    const file = exportDtsFormWord0550({
      rootElement: rootRef.current,
      formModel: form,
      cssText,
    });
    setNotice(`Exported Word (.docx): ${file}`);
  };

  const handleExportPdf = () => {
    const prev = document.title;
    document.title = form.docFileNamePdf.replace(/\.pdf$/i, '');
    window.print();
    setTimeout(() => {
      document.title = prev;
    }, 1000);
    setNotice(`Print / Save as PDF: ${form.docFileNamePdf}`);
  };

  return (
    <div className="dts-form-studio" data-dts-form-studio="true" data-mode={mode}>
      {/* Sticky Control Bar (.xb) */}
      <div className="xb no-print">
        <b>View mode:</b>
        <button
          type="button"
          className={isInternal ? 'on' : ''}
          aria-pressed={isInternal}
          onClick={() => setMode('internal')}
        >
          Internal (full notes)
        </button>
        <button
          type="button"
          className={!isInternal ? 'on' : ''}
          aria-pressed={!isInternal}
          onClick={() => setMode('customer')}
        >
          Customer Preview (clean)
        </button>

        <label>
          System
          <select
            aria-label="DTS Form System"
            value={systemToken}
            onChange={e => setSystemToken(e.target.value)}
          >
            {systemOptions.map(s => (
              <option key={s.token} value={s.token}>
                {s.token} · {s.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Area
          <select
            aria-label="DTS Form Area"
            value={area}
            onChange={e => setArea(e.target.value)}
          >
            {DTS_FORM_AREAS_0550.map(a => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        <label>
          Rev
          <select
            aria-label="DTS Form Revision"
            value={revision}
            onChange={e => setRevision(e.target.value)}
          >
            {DTS_FORM_REVISIONS_0550.map(r => (
              <option key={r.code} value={r.code}>
                {r.label}
              </option>
            ))}
          </select>
        </label>

        <span className="hint">— {form.docFileNameDocx}</span>

        <span className="sp">
          <button type="button" onClick={handleExportDocx}>
            Export .docx
          </button>
          <button type="button" onClick={handleExportPdf}>
            Print / Save as PDF
          </button>
        </span>
      </div>

      {notice && (
        <div className="no-print" role="status" style={{ padding: '6px 12px', fontSize: 12, background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}>
          {notice}
        </div>
      )}

      {/* 4-Page A4 Datasheet Template (.dts-root) */}
      <div className="dts-root" ref={rootRef}>
        {/* PAGE 1: COVER PAGE */}
        <div className="page cover">
          <div className="inner">
            <div className="cv-frame">
              <div className="cv-proj">{form.projectTitle}</div>
              <div className="cv-sp" />
              <div className="cv-title">DATA SHEET FOR {form.systemTitleUpper}</div>
              <div className="cv-for">FOR</div>
              <div className="cv-pkg">{form.systemTitle}</div>
              <div className="cv-sp2" />

              <table className="cv-rev">
                <tbody>
                  {Array.from({ length: blankCoverRows }).map((_, idx) => (
                    <tr key={`blank-${idx}`}>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  ))}
                  {form.revisionHistory.slice(0, 4).map(r => (
                    <tr key={`cv-rev-${r.rev}`}>
                      <td>{r.rev}</td>
                      <td>{r.date}</td>
                      <td>{r.by}</td>
                      <td className="desc">{r.description}</td>
                      <td>{r.checked}</td>
                      <td>{r.approved}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                  <tr>
                    <td className="lbl lbl-b" rowSpan={2}>REV</td>
                    <td className="lbl lbl-b" rowSpan={2}>DATE</td>
                    <td className="lbl lbl-b" rowSpan={2}>BY</td>
                    <td className="lbl lbl-b" rowSpan={2}>DESCRIPTION</td>
                    <td className="lbl">CHECK</td>
                    <td className="lbl">APPR.</td>
                    <td className="lbl">CHECK</td>
                    <td className="lbl">APPR.</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="grp">
                      <div>CONTRACTOR</div>
                      <div>APPROVAL</div>
                    </td>
                    <td colSpan={2} className="grp">
                      <div>COMPANY</div>
                      <div>APPROVAL</div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={8} className="cv-status">
                      STATUS CODE: A = Issued for Review, B = Issued for Approval, C = Approved For Construction
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={8} className="cv-conf">
                      TOTAL OR PARTIAL REPRODUCTION AND/OR UTILIZATION OF THIS DOCUMENT ARE FORBIDDEN WITHOUT PRIOR WRITTEN AUTHORIZATION OF THE OWNER
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="cv-tb">
                <tbody>
                  <tr>
                    <td rowSpan={3} className="tb-logo">
                      <img className="lg lg-pttep-cv" alt="PTTEP" src={PTTEP_LOGO_DATA_URI} />
                    </td>
                    <td colSpan={3} className="tb-client">{form.clientName}</td>
                    <td rowSpan={3} className="tb-logo tb-avs">
                      <img className="lg lg-omega-cv" alt="OMEGA Integration" src={OMEGA_LOGO_DATA_URI} />
                      <img className="lg lg-avs-cv" alt="Add Value System" src={AVS_LOGO_DATA_URI} />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="tb-proj">{form.projectTitle}</td>
                  </tr>
                  <tr>
                    <td className="tb-no">{form.docId}</td>
                    <td className="tb-f">
                      <div className="tb-fh">REVISION</div>
                      <div className="tb-fv">{form.revision}</div>
                    </td>
                    <td className="tb-f">
                      <div className="tb-fh">STATUS</div>
                      <div className="tb-fv">{form.statusCode}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PAGE 2: APPROVAL & DOCUMENT REVISION HISTORY SHEET */}
        <div className="page">
          <div className="inner">
            <table className="as-hd">
              <tbody>
                <tr>
                  <td className="as-logo">
                    <img className="lg lg-pttep-hd" alt="PTTEP" src={PTTEP_LOGO_DATA_URI} />
                  </td>
                  <td className="as-proj">{form.projectTitle}</td>
                  <td className="as-logo as-avs">
                    <img className="lg lg-omega-hd" alt="OMEGA Integration" src={OMEGA_LOGO_DATA_URI} />
                    <img className="lg lg-avs-hd" alt="Add Value System" src={AVS_LOGO_DATA_URI} />
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="as-f">
              <tbody>
                <tr>
                  <td className="as-k"><div>DOCUMENT NO.</div></td>
                  <td className="as-v">{form.docId}</td>
                </tr>
                <tr>
                  <td className="as-k"><div>DOCUMENT TITLE</div></td>
                  <td className="as-v">DATA SHEET FOR {form.systemTitleUpper}</td>
                </tr>
                <tr>
                  <td className="as-k">
                    <div>VENDOR DOCUMENT NO.</div>
                    <div className="as-k2">(as applicable)</div>
                  </td>
                  <td className="as-v">{form.vendorDocNo}</td>
                </tr>
                <tr>
                  <td className="as-k">
                    <div>TOTAL NO. OF PAGES</div>
                    <div className="as-k2">(including front sheet)</div>
                  </td>
                  <td className="as-v">{form.totalPages}</td>
                </tr>
              </tbody>
            </table>

            <table className="as-rev">
              <tbody>
                <tr>
                  <th style={{ width: '12%' }}>REV</th>
                  <th style={{ width: '20%' }}>DATE</th>
                  <th>VENDOR APPROVAL (NAME &amp; SIGNATURE)</th>
                </tr>
                <tr>
                  <td className="c">{form.revision}</td>
                  <td className="c">{form.dateDmy}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <table className="as-sub">
              <tbody>
                <tr>
                  <td className="as-subk">SUBMITTED FOR:</td>
                  <td className="as-subv">
                    <div className="as-row">
                      <span className={`as-box${/^A/i.test(form.revision) ? ' checked' : ''}`} />INFO
                    </div>
                    <div className="as-row">
                      <span className={`as-box${/^[RB]/i.test(form.revision) ? ' checked' : ''}`} />REVIEW / APPROVAL
                    </div>
                    <div className="as-row">
                      <span className={`as-box${/^(?:C|00)/i.test(form.revision) ? ' checked' : ''}`} />CERTIFIED
                    </div>
                  </td>
                  <td className="as-subn">
                    <div><b>VENDOR NAME:</b> {form.vendorName}</div>
                    <div><b>TAG NO. :</b> {form.tagSummary}</div>
                    <div><b>P.O. NO. :</b> {form.poNo}</div>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="as-cod">
              <tbody>
                <tr>
                  <td className="as-col">
                    <div className="as-ch">PTTEP</div>
                    <div className="as-row"><span className="as-box" />(1) ACCEPTED</div>
                    <div className="as-row"><span className="as-box" />(2) ACCEPTED, PROCEED WITH WORK &amp; INCORPORATE COMMENTS &amp; RESUBMIT</div>
                    <div className="as-row"><span className="as-box" />(3) NOT ACCEPTED, REVISE AND RESUBMIT</div>
                    <div className="as-row"><span className="as-box" />(4) FOR INFORMATION ONLY</div>
                  </td>
                  <td className="as-col">
                    <div className="as-ch">ADDVALUE</div>
                    <div className="as-row">
                      <span className="as-box" />(1) APPROVED WITHOUT COMMENTS
                      <div className="as-d">Work may proceed — submit finals</div>
                    </div>
                    <div className="as-row">
                      <span className="as-box" />(2) APPROVED WITH COMMENTS
                      <div className="as-d">Work may proceed subject to comment — reissue for approval</div>
                    </div>
                    <div className="as-row">
                      <span className="as-box" />(3) REJECTED
                      <div className="as-d">Work may NOT proceed — revise and resubmit for review and approval</div>
                    </div>
                    <div className="as-row">
                      <span className="as-box" />(4) ACCEPTED
                      <div className="as-d">For information only</div>
                    </div>
                    <div className="as-row">
                      <span className="as-box" />(5) CERTIFIED FINAL
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="as-sig">
                    <div>NAME :</div>
                    <div>SIGNATURE :</div>
                    <div>DATE :</div>
                  </td>
                  <td className="as-sig">
                    <div>NAME :</div>
                    <div>SIGNATURE :</div>
                    <div>DATE :</div>
                  </td>
                </tr>
                <tr>
                  <td className="as-dis">
                    APPROVAL OF THIS DOCUMENT DOES NOT RELIEVE THE CONTRACTOR FROM THE RESPONSIBILITIES UNDER THE TERMS OF THE CONTRACT AGREEMENT.
                  </td>
                  <td className="as-dis">
                    THIS APPROVAL DOES NOT RELIEVE SUPPLIER OF RESPONSIBILITY TO COMPLY WITH APPLICABLE CONTRACT / PROJECT SPECIFICATIONS, CODES, GOVERNING LAWS AND REGULATIONS.
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="st2rh">DOCUMENT REVISION HISTORY</div>
            <table className="as-rh">
              <tbody>
                <tr>
                  <th><div>Rev #</div></th>
                  <th><div>Page</div></th>
                  <th><div>Date Of Change</div><div>(DD/MM/YYYY)</div></th>
                  <th><div>Description Of Change</div></th>
                  <th><div>Revised By</div><div>(Name)</div></th>
                </tr>
                {form.revisionHistory.map(r => (
                  <tr key={`rh-${r.rev}`}>
                    <td className="c">{r.rev}</td>
                    <td className="c">{r.page}</td>
                    <td className="c">{r.date}</td>
                    <td>{r.description}</td>
                    <td className="c">{r.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGE 3: TECHNICAL DATASHEET SPECIFICATION TABLE */}
        <div className="page">
          <div className="inner">
            <table className="ph">
              <tbody>
                <tr>
                  <td className="ph-t">{form.projectTitle}</td>
                </tr>
                <tr>
                  <td className="ph-i">
                    DATA SHEET FOR {form.systemTitleUpper} — {form.area} — Vendor equipment data
                  </td>
                </tr>
                <tr>
                  <td className="ph-i">
                    DOC: {form.docId} &nbsp;·&nbsp; REV: {form.revision} &nbsp;·&nbsp; {form.dateDmy}
                    {isInternal && (
                      <>
                        {' '}
                        &nbsp;·&nbsp; <i>INTERNAL TRACE ({form.systemToken} · C1 rows: {form.c1SyncCount})</i>
                      </>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="basis">
              VENDOR has answered against {form.clientDtsRef} Rev.A1, which incorporates COMPANY review comments closed at that revision. Deviations and exclusions are listed in MM-ASK-1A-WP01-TEQ-TEL-LIS-0004, submitted with this bid.
            </div>

            {isInternal && form.internalNotes.length > 0 && (
              <div className="vm-warn intblock">
                <b>INTERNAL ENGINEERING REVIEW (.intblock — stripped in Customer Preview):</b>
                <ul>
                  {form.internalNotes.map((n, i) => (
                    <li key={i}>
                      <b>{n.category}:</b> {n.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <table className="tb ds">
              {isInternal ? (
                <colgroup>
                  <col style={{ width: '6%' }} />
                  <col style={{ width: '21%' }} />
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '27%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '11%' }} />
                </colgroup>
              ) : (
                <colgroup>
                  <col style={{ width: '7%' }} />
                  <col style={{ width: '24%' }} />
                  <col style={{ width: '32%' }} />
                  <col style={{ width: '37%' }} />
                </colgroup>
              )}
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Parameter</th>
                  <th>COMPANY Requirement</th>
                  <th>Vendor Offered Data</th>
                  {isInternal && <th>Src.</th>}
                  {isInternal && <th>Compliance</th>}
                </tr>
              </thead>
              <tbody>
                {form.sections.map(sec => (
                  <React.Fragment key={sec.title}>
                    <tr className="sec">
                      <td colSpan={colCount}>{sec.title}</td>
                    </tr>
                    {sec.rows.map((row, idx) => (
                      <tr key={`${sec.title}-${row.item}-${idx}`} className={idx % 2 === 1 ? 'alt' : ''}>
                        <td className="c mono">{row.item}</td>
                        <td className="param">{row.parameter}</td>
                        <td>{row.requirement}</td>
                        <td>{row.offered}</td>
                        {isInternal && <td className="c">{row.src || '—'}</td>}
                        {isInternal && (
                          <td className="c">
                            <span className={`sb ${row.badge.cls}`}>{row.badge.label}</span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <div className="foot">
              <span className="mono">{form.docId} Rev.{form.revision}</span>
              <span>Page 3 of 4</span>
            </div>
          </div>
        </div>

        {/* PAGE 4: EQUIPMENT TAG LIST & NOTES */}
        <div className="page">
          <div className="inner">
            <table className="ph">
              <tbody>
                <tr>
                  <td className="ph-t">{form.projectTitle}</td>
                </tr>
                <tr>
                  <td className="ph-i">
                    DATA SHEET FOR {form.systemTitleUpper} — {form.area} — Vendor equipment data
                  </td>
                </tr>
                <tr>
                  <td className="ph-i">
                    DOC: {form.docId} &nbsp;·&nbsp; REV: {form.revision} &nbsp;·&nbsp; {form.dateDmy}
                    {isInternal && (
                      <>
                        {' '}
                        &nbsp;·&nbsp; <i>INTERNAL TRACE ({form.systemToken})</i>
                      </>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="st2">Equipment Tag list</div>
            <table className="tb">
              <colgroup>
                <col style={{ width: '26%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '30%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Items</th>
                  <th>Tag Number</th>
                  <th>Service Location</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {form.tagList.map((t, idx) => (
                  <tr key={`${t.tagNumber}-${idx}`} className={idx % 2 === 1 ? 'alt' : ''}>
                    <td>{t.items}</td>
                    <td className="c mono">{t.tagNumber}</td>
                    <td>{t.location}</td>
                    <td>{t.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="st2">Notes:</div>
            <ol className="notes">
              {form.notes.map((n, idx) => (
                <li key={idx}>
                  {n.text}
                  {isInternal && n.devTag && <span className="devref"> {n.devTag}</span>}
                </li>
              ))}
            </ol>

            <div className="foot">
              <span className="mono">{form.docId} Rev.{form.revision}</span>
              <span>Page 4 of 4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
