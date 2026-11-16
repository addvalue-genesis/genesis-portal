// PTTEP 10008-STD-6-GEN-002-R01 Document Coding, Revision Designations & Revision History

export const PTTEP_DOC_STANDARD_0550='10008-STD-6-GEN-002-R01';

export const PTTEP_AREAS_0550=['GEN','APF','ACP','ABV01'];

export const PTTEP_PACKAGES_0550=[
 'TEQ','RADIO','VSAT','LAN','PABX','PAGA','CCTV','FO','TELT','MET','AIS','ES','IPP',
];

export const PTTEP_DISCIPLINES_0550=['TEL','PJM'];

export const PTTEP_DOCTYPES_0550={
 MTO:'Schedules A1–C8 / Commercial MTO',
 SPIR:'Spares (C2 / C3)',
 VDR:'Vendor Document Requirement Listing (VDRL)',
 SPE:'Technical Proposal / Specification',
 DTS:'Equipment Datasheet',
 CAL:'SI Calculation',
};

export const PTTEP_REVISION_CATALOG_0550=[
 {code:'INT-00',purpose:'Internal IDC / WIP Baseline',internal:true},
 {code:'INT-01',purpose:'Internal IDC / WIP Update',internal:true},
 {code:'R1',purpose:'IDC — Inter-Discipline Check',internal:false},
 {code:'R2',purpose:'IDC — Inter-Discipline Check Rev.2',internal:false},
 {code:'A1',purpose:'IFR / IFI — Issued for Review / Information',internal:false},
 {code:'A2',purpose:'IFR / IFI — Issued for Review Rev.2',internal:false},
 {code:'B1',purpose:'IFA / IFT — Issued for Approval / Tender',internal:false},
 {code:'B2',purpose:'IFA / IFT — Issued for Approval Rev.2',internal:false},
 {code:'C1',purpose:'AFC / IFP — Approved for Construction / Purchase',internal:false},
 {code:'C2',purpose:'AFC / IFP — Approved for Construction Rev.2',internal:false},
 {code:'00',purpose:'As-Built',internal:false},
 {code:'01',purpose:'As-Built Rev.01',internal:false},
 {code:'Rev.0',purpose:'Vendor Doc — Initial Issue',internal:false},
 {code:'Rev.1',purpose:'Vendor Doc — Revision 1',internal:false},
 {code:'X',purpose:'Void / Cancelled',internal:false},
];

export const isInternalPttepRevision0550=rev=>/^INT-/i.test(String(rev||'').trim());

export function normalizePttepRev0550(rawRev,fallback='A1'){
 const raw=String(rawRev||'').trim();
 if(!raw||/^OPEN$/i.test(raw)||/^WORKING$/i.test(raw))return fallback;
 if(/^(?:INT-\d{2}|[RABCI]\d+|\d{2}|Rev\.\d+|X)$/i.test(raw))return raw;
 const revMatch=raw.match(/^Rev\.?\s*(\d+)$/i);
 if(revMatch)return 'A'+Math.max(1,Number(revMatch[1])||1);
 return fallback;
}

// PTTEP Sections 7.2, 7.3 & 7.5: space before "Rev."
export function formatPttepFileName0550({
 area='GEN',
 pkg='TEQ',
 discipline='TEL',
 docType='MTO',
 seq='0001',
 rev='A1',
 ext='pdf',
 internal=false,
 timestamp='',
}={}){
 const safeArea=PTTEP_AREAS_0550.includes(area)?area:'GEN';
 const safePkg=PTTEP_PACKAGES_0550.includes(pkg)?pkg:'TEQ';
 const safeDisc=PTTEP_DISCIPLINES_0550.includes(discipline)?discipline:'TEL';
 const safeType=Object.hasOwn(PTTEP_DOCTYPES_0550,docType)?docType:'MTO';
 const safeSeq=String(seq||'0001').padStart(4,'0').slice(-4);
 const safeRev=String(rev||'A1').replace(/[^\w.-]/g,'');
 const docId=`MM-ASK-00-${safeArea}-${safePkg}-${safeDisc}-${safeType}-${safeSeq}`;
 if(internal){
  const ts=timestamp?`_${timestamp}`:'';
  return `${docId}_INTERNAL Rev.${safeRev}${ts}.${ext}`;
 }
 return `${docId} Rev.${safeRev}.${ext}`;
}

export const DEFAULT_REVISION_HISTORY_0550=[
 {rev:'INT-00',purpose:'Internal IDC / WIP',date:'2026-11-16',description:'Internal baseline freeze (Schedule A1 Goods USD 4,649,195.28; Base Working USD 5,569,206.50)',prepared:'SI Lead',checked:'Commercial Lead',approved:'Internal WIP'},
 {rev:'R1',purpose:'IDC',date:'2026-11-14',description:'Inter-discipline check across 19 telecom systems + COMMON',prepared:'SI Lead',checked:'Engineering Mgr',approved:'Project Mgr'},
 {rev:'A1',purpose:'IFR / IFI',date:'2026-11-16',description:'Issued for Review — Exhibit C Commercial Terms & Schedules A1–C8',prepared:'TSI Proposal',checked:'Commercial Mgr',approved:'Authorized Signatory'},
];

export function customerRevisionHistory0550(history=DEFAULT_REVISION_HISTORY_0550){
 return (Array.isArray(history)&&history.length?history:DEFAULT_REVISION_HISTORY_0550)
  .filter(row=>row&&!isInternalPttepRevision0550(row.rev));
}

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function revisionHistoryHtml0550(history=DEFAULT_REVISION_HISTORY_0550){
 const rows=customerRevisionHistory0550(history);
 return `<article class="p55-native-paper" data-pttep-revision-history="true"><h2>REVISION HISTORY (${PTTEP_DOC_STANDARD_0550})</h2><table><thead><tr><th>Rev</th><th>Purpose of Issue</th><th>Date</th><th>Description</th><th>Prepared</th><th>Checked</th><th>Approved</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.rev)}</td><td>${esc(r.purpose)}</td><td>${esc(r.date)}</td><td>${esc(r.description)}</td><td>${esc(r.prepared)}</td><td>${esc(r.checked)}</td><td>${esc(r.approved)}</td></tr>`).join('')}</tbody></table></article>`;
}

export function revisionHistoryWordXml0550(history=DEFAULT_REVISION_HISTORY_0550){
 const rows=customerRevisionHistory0550(history);
 const p=t=>`<w:p><w:r><w:t xml:space="preserve">${esc(t)}</w:t></w:r></w:p>`;
 const cell=(t,hdr)=>`<w:tc><w:tcPr>${hdr?'<w:shd w:fill="EAF2F6"/>':''}</w:tcPr>${p(t)}</w:tc>`;
 const tr=(vals,hdr)=>`<w:tr>${vals.map(v=>cell(v,hdr)).join('')}</w:tr>`;
 const borders=['top','left','bottom','right','insideH','insideV'].map(e=>`<w:${e} w:val="single" w:sz="4" w:color="8097A7"/>`).join('');
 const head=tr(['Rev','Purpose of Issue','Date','Description','Prepared','Checked','Approved'],true);
 const body=rows.map(r=>tr([r.rev,r.purpose,r.date,r.description,r.prepared,r.checked,r.approved],false)).join('');
 return `${p(`REVISION HISTORY (${PTTEP_DOC_STANDARD_0550})`)}<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>${borders}</w:tblBorders></w:tblPr>${head}${body}</w:tbl>`;
}
