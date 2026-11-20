import React,{useMemo,useState} from 'react';
import {
 PTTEP_DOC_STANDARD_0550,
 PTTEP_REVISION_CATALOG_0550,
 isInternalPttepRevision0550,
} from './data/pttepDocControl0550';
import {
 buildFullStateSnapshot0550,
 createPreRestoreBackup0550,
 downloadSnapshotJson0550,
 getSnapshotByRev0550,
 listSnapshotRevisions0550,
 nextInternalRevCode0550,
 saveNewSnapshotRevision0550,
 validateAndImportSnapshotJson0550,
} from './data/snapshotManager0550';
import {useBidWorkspace} from './BidWorkspaceContext';

export function SnapshotVersionManager0550({onNavigate}){
 const {data,model,view,change,busy}=useBidWorkspace();
 const [revisions,setRevisions]=useState(()=>listSnapshotRevisions0550());
 const [selectedRev,setSelectedRev]=useState(()=>listSnapshotRevisions0550().at(-1)?.revCode||'INT-00');
 const [compareRevB,setCompareRevB]=useState('CURRENT');
 const [revMode,setRevMode]=useState('AUTO_INT');
 const [formalRev,setFormalRev]=useState('A1');
 const [customerExportRev,setCustomerExportRev]=useState('A1');
 const [changeNote,setChangeNote]=useState('');
 const [status,setStatus]=useState('');
 const [error,setError]=useState('');

 const selectedMeta=useMemo(()=>revisions.find(r=>r.revCode===selectedRev)||revisions[0],[revisions,selectedRev]);
 const selectedSnapshot=useMemo(()=>getSnapshotByRev0550(selectedRev),[selectedRev,revisions]);
 const nextInt=useMemo(()=>nextInternalRevCode0550(revisions),[revisions]);

 const refreshList=(selectCode)=>{
  const list=listSnapshotRevisions0550();
  setRevisions(list);
  if(selectCode)setSelectedRev(selectCode);
 };

 const handleSaveRevision=()=>{
  setError('');
  if(!changeNote.trim()){
   setError('Please enter a short change note before locking a new revision.');
   return;
  }
  const revCode=revMode==='AUTO_INT'?nextInt:formalRev;
  const catalogEntry=PTTEP_REVISION_CATALOG_0550.find(c=>c.code===revCode);
  const purposeOfIssue=catalogEntry?.purpose||(isInternalPttepRevision0550(revCode)?'Internal IDC / WIP':'Issued for Review');
  try{
   const {snapshot}=saveNewSnapshotRevision0550({
    data,model,view,revCode,purposeOfIssue,changeNote:changeNote.trim(),
   });
   refreshList(snapshot.pttepDocControl.revCode);
   setChangeNote('');
   setStatus(`Saved immutable snapshot ${snapshot.pttepDocControl.revCode} (${snapshot.pttepDocControl.fileName}).`);
  }catch(e){
   setError(e?.message||'Unable to save snapshot.');
  }
 };

 const handleExportInternal=()=>{
  setError('');
  const snap=selectedSnapshot||buildFullStateSnapshot0550({data,model,view,revCode:nextInt,changeNote:'Ad-hoc internal export'});
  const name=downloadSnapshotJson0550(snap,{customer:false});
  setStatus(`Exported Full Internal Snapshot JSON: ${name}`);
 };

 const handleExportCustomer=()=>{
  setError('');
  const snap=selectedSnapshot||buildFullStateSnapshot0550({data,model,view,revCode:customerExportRev,changeNote:'Customer issue export'});
  const name=downloadSnapshotJson0550(snap,{customer:true,customerRev:customerExportRev});
  setStatus(`Exported Sanitized Customer JSON: ${name}`);
 };

 const handleImport=async e=>{
  setError('');
  const input=e.currentTarget;
  const file=input.files?.[0];
  input.value='';
  if(!file)return;
  try{
   const text=await file.text();
   const {snapshot}=validateAndImportSnapshotJson0550(text);
   refreshList(snapshot.pttepDocControl.revCode);
   setStatus(`Imported snapshot ${snapshot.pttepDocControl.revCode} [IMPORTED] into 09 Data / Trace.`);
  }catch(err){
   setError(err?.message||'Failed to import snapshot JSON.');
  }
 };

 const handleRestore=async()=>{
  setError('');
  if(!selectedSnapshot||!change){
   setError('Select a valid saved or imported snapshot to restore.');
   return;
  }
  try{
   const backup=createPreRestoreBackup0550({data,model,view,targetRev:selectedRev});
   const ok=await change(d=>({
    ...d,
    fx:selectedSnapshot.siEquationsAndInputs?.fxRates||d.fx,
    revisionHistory:selectedSnapshot.revisionHistory||d.revisionHistory,
    restoredFromSnapshot:{
     revCode:selectedRev,
     restoredAt:new Date().toISOString(),
     preRestoreBackupRev:backup.snapshot.pttepDocControl.revCode,
    },
   }),`Restore Working from snapshot ${selectedRev} (backup ${backup.snapshot.pttepDocControl.revCode})`);
   refreshList(selectedRev);
   if(ok)setStatus(`Created safety backup ${backup.snapshot.pttepDocControl.revCode} and restored ${selectedRev} to Current Working.`);
  }catch(err){
   setError(err?.message||'Failed to restore snapshot.');
  }
 };

 return <section className="p55-panel" aria-label="Full-State Snapshot & PTTEP Version Manager">
  <h3>09 · Full-State JSON Snapshot &amp; PTTEP Version Manager ({PTTEP_DOC_STANDARD_0550})</h3>
  <p>Immutable snapshot repository (<code>snapshots/registry.json</code> + localStorage fallback). Internal <code>INT-XX</code> revisions are excluded from customer exports.</p>

  <div className="p55-bid-fields">
   <label>Saved / Imported Revision
    <select value={selectedRev} onChange={e=>setSelectedRev(e.target.value)} disabled={busy}>
     {revisions.map(r=><option key={r.revCode} value={r.revCode}>
      {r.revCode}{r.imported?' [IMPORTED]':''} · {r.savedAt} · {r.gitCommit} · {r.changeNote}
     </option>)}
    </select>
   </label>
   <label>Compare With (for 11.12)
    <select value={compareRevB} onChange={e=>setCompareRevB(e.target.value)} disabled={busy}>
     <option value="CURRENT">Current Working</option>
     {revisions.map(r=><option key={r.revCode} value={r.revCode}>{r.revCode}{r.imported?' [IMPORTED]':''}</option>)}
    </select>
   </label>
  </div>

  {selectedMeta&&<p><small>File: <code>{selectedMeta.fileName}</code> · Purpose: {selectedMeta.purposeOfIssue} · Saved: {selectedMeta.savedAt} · Commit: <code>{selectedMeta.gitCommit}</code></small></p>}

  <div className="p55-review-toolbar">
   <label>Revision Type
    <select value={revMode} onChange={e=>setRevMode(e.target.value)} disabled={busy}>
     <option value="AUTO_INT">Auto-increment Internal ({nextInt})</option>
     <option value="FORMAL">Formal PTTEP Code</option>
    </select>
   </label>
   {revMode==='FORMAL'&&<label>PTTEP Code
    <select value={formalRev} onChange={e=>setFormalRev(e.target.value)} disabled={busy}>
     {PTTEP_REVISION_CATALOG_0550.filter(c=>!c.internal).map(c=><option key={c.code} value={c.code}>{c.code} · {c.purpose}</option>)}
    </select>
   </label>}
   <label>Change Note (required)
    <input type="text" value={changeNote} placeholder="e.g. Reconciled C2 Appendix 1.1 & FX 31.50" onChange={e=>setChangeNote(e.target.value)} disabled={busy}/>
   </label>
   <button type="button" onClick={handleSaveRevision} disabled={busy}>Save &amp; Lock New Revision</button>
  </div>

  <div className="p55-review-toolbar">
   <button type="button" onClick={handleExportInternal} disabled={busy}>Export Full Internal JSON</button>
   <label>Customer Rev
    <select value={customerExportRev} onChange={e=>setCustomerExportRev(e.target.value)} disabled={busy}>
     {['A1','A2','B1','B2','C1','C2','00','R1'].map(code=><option key={code} value={code}>Rev.{code}</option>)}
    </select>
   </label>
   <button type="button" onClick={handleExportCustomer} disabled={busy}>Export Sanitized Customer JSON</button>
   <label>Import JSON <input type="file" accept=".json,application/json" onChange={handleImport} disabled={busy}/></label>
   <button type="button" onClick={handleRestore} disabled={busy||!selectedSnapshot}>Restore to Working</button>
   {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.quotation.cost-impact')} disabled={busy}>Open 11.12 Cost Impact ({selectedRev} vs {compareRevB})</button>}
  </div>

  {status&&<p role="status">{status}</p>}
  {error&&<p role="alert">{error}</p>}
 </section>;
}
