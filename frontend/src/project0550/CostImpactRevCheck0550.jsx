import React,{useMemo,useState} from 'react';
import {
 COST_IMPACT_SCHEDULES_0550,
 REV00_BASELINE_0550,
 compareCostImpact0550,
 extractWorkingCostImpactItems0550,
 getCostImpactRevisions0550,
 lockRev00Items0550,
 nextRevisionCode0550,
 promoteCostImpactRevision0550,
} from './data/costImpactRev0550';
import scheduleC2Master from './data/scheduleC2Master0550.json';
import {getSnapshotByRev0550,listSnapshotRevisions0550} from './data/snapshotManager0550';

const fmtUSD=v=>Number.isFinite(v)?'USD '+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'OPEN';
const fmtSignedUSD=v=>{
 if(!Number.isFinite(v))return 'OPEN';
 const sign=v>0?'+':v<0?'-':'';
 return `${sign}USD ${Math.abs(v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
};

export function CostImpactRevCheck0550({data,model,displayView,systems=[],onNavigate,onChange,disabled=false,busy=false}){
 const revisions=useMemo(()=>getCostImpactRevisions0550(data),[data]);
 const activeDefault=data?.costImpactRevisions?.activeBaselineRev||'Rev00';
 const [selectedRev,setSelectedRev]=useState(activeDefault);
 const [showChangedOnly,setShowChangedOnly]=useState(false);
 const [scheduleFilter,setScheduleFilter]=useState('ALL');
 const [systemFilter,setSystemFilter]=useState('ALL');
 const [promoteModalOpen,setPromoteModalOpen]=useState(false);
 const [promoteNote,setPromoteNote]=useState('');
 const [statusMsg,setStatusMsg]=useState('');
 const pttepSnapshots=useMemo(()=>listSnapshotRevisions0550(),[]);
 const [snapA,setSnapA]=useState(()=>pttepSnapshots[0]?.revCode||'INT-00');
 const [snapB,setSnapB]=useState(()=>pttepSnapshots.at(-1)?.revCode||'INT-00');
 const snapAData=useMemo(()=>getSnapshotByRev0550(snapA),[snapA]);
 const snapBData=useMemo(()=>getSnapshotByRev0550(snapB),[snapB]);
 const c2WorkingTotal=useMemo(()=>(displayView?.scheduleRows?.('C2')||[]).reduce((s,b)=>s+(Number.isFinite(b.amount)?b.amount:0),0),[displayView]);
 const c2Delta=Math.round((c2WorkingTotal-scheduleC2Master.reconciledA1Item4USD)*100)/100;

 const baselineRev=revisions.find(r=>r.revision===selectedRev)||revisions[0];
 const nextRev=nextRevisionCode0550(revisions);

 const currentSnapshot=useMemo(
  ()=>extractWorkingCostImpactItems0550(data,model,displayView),
  [data,model,displayView]
 );

 const comparison=useMemo(
  ()=>compareCostImpact0550({baselineRev,currentSnapshot,systems}),
  [baselineRev,currentSnapshot,systems]
 );

 const filteredRows=useMemo(()=>comparison.rows.filter(r=>{
  if(showChangedOnly&&!r.changed)return false;
  if(scheduleFilter!=='ALL'&&r.schedule!==scheduleFilter)return false;
  if(systemFilter!=='ALL'&&r.systemToken!==systemFilter)return false;
  return true;
 }),[comparison.rows,showChangedOnly,scheduleFilter,systemFilter]);

 const systemOptions=useMemo(()=>{
  const tokens=[...systems.map(s=>s.token),'COMMON'];
  const extra=[...new Set(comparison.rows.map(r=>r.systemToken))].filter(t=>!tokens.includes(t));
  return [...tokens,...extra];
 },[systems,comparison.rows]);

 const handleLockRev00Lines=async()=>{
  if(!onChange||disabled||busy)return;
  const ok=await onChange(
   d=>lockRev00Items0550(d,currentSnapshot),
   'Lock immutable Rev00 per-line Cost & Sell snapshot'
  );
  if(ok)setStatusMsg('Locked Rev00 per-line baseline snapshot in workspace.');
 };

 const handleConfirmPromote=async()=>{
  if(!onChange||disabled||busy)return;
  const ok=await onChange(
   d=>promoteCostImpactRevision0550(d,currentSnapshot,promoteNote),
   `Lock & Promote Cost Impact baseline to ${nextRev}`
  );
  if(ok){
   setPromoteModalOpen(false);
   setPromoteNote('');
   setSelectedRev(nextRev);
   setStatusMsg(`Promoted Current Working to immutable baseline ${nextRev}.`);
  }
 };

 const revChain=revisions.map(r=>r.revision).join(' -> ');

 return <div className="p55-cost-impact" data-component-key="bid.quotation.cost-impact">
  <div
   role="alert"
   style={{
    background:'#7f1d1d',
    color:'#fef2f2',
    border:'2px solid #dc2626',
    borderRadius:'6px',
    padding:'10px 14px',
    marginBottom:'12px',
    fontWeight:700,
    letterSpacing:'0.03em',
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    flexWrap:'wrap',
    gap:'8px',
   }}
  >
   <span>INTERNAL COMMERCIAL CONTROL — DO NOT EXPORT TO CUSTOMER</span>
   <span style={{fontSize:'0.85em',fontWeight:500}}>
    Excluded from all customer-facing Word / PDF / HTML / XLSX exports
   </span>
  </div>

  <section className="p55-panel" style={{marginBottom:'12px'}}>
   <h4 style={{margin:'0 0 6px 0'}}>PTTEP Snapshot Comparison (09 Data / Trace) &amp; Schedule C2 A1 Item 4 Reconciliation</h4>
   <div style={{display:'flex',flexWrap:'wrap',gap:'12px',alignItems:'center',fontSize:'0.9em'}}>
    <label>Snapshot A <select value={snapA} onChange={e=>setSnapA(e.target.value)}>{pttepSnapshots.map(r=><option key={r.revCode} value={r.revCode}>{r.revCode}{r.imported?' [IMPORTED]':''} · {r.savedAt}</option>)}</select></label>
    <label>Snapshot B <select value={snapB} onChange={e=>setSnapB(e.target.value)}>{pttepSnapshots.map(r=><option key={r.revCode} value={r.revCode}>{r.revCode}{r.imported?' [IMPORTED]':''} · {r.savedAt}</option>)}</select></label>
    <span>A C1 Ceiling: <strong>{fmtUSD(snapAData?.scheduleA1Baseline?.c1CeilingUsd)}</strong></span>
    <span>B C1 Ceiling: <strong>{fmtUSD(snapBData?.scheduleA1Baseline?.c1CeilingUsd)}</strong></span>
    <span>C2 Master (A1 Item 4): <strong>{fmtUSD(scheduleC2Master.reconciledA1Item4USD)}</strong> ({scheduleC2Master.pricedCount} priced / {scheduleC2Master.openCount} OPEN)</span>
    <span>Current C2 Delta vs A1 Item 4: <strong>{fmtSignedUSD(c2Delta)}</strong></span>
    {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.data')}>Open 09 Data / Trace</button>}
   </div>
  </section>

  <section className="p55-panel" style={{marginBottom:'12px'}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'12px'}}>
    <div>
     <h3 style={{margin:'0 0 4px 0'}}>11.12 · Cost Impact &amp; Rev Check</h3>
     <p style={{margin:0,fontSize:'0.9em',opacity:0.85}}>
      Immutable Baseline: <strong>{REV00_BASELINE_0550.label}</strong> ·{' '}
      1. GOODS / Form C-1 = <strong>{fmtUSD(REV00_BASELINE_0550.goodsC1CeilingUSD)}</strong> ·{' '}
      Total Base Working Subtotal = <strong>{fmtUSD(REV00_BASELINE_0550.totalBaseWorkingSubtotalUSD)}</strong> ·{' '}
      <strong>{REV00_BASELINE_0550.pricedCount}/{REV00_BASELINE_0550.totalCount} priced, {REV00_BASELINE_0550.openCount} OPEN</strong>
     </p>
    </div>
    <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
     <label style={{fontSize:'0.88em'}}>
      Compare vs. Baseline{' '}
      <select
       aria-label="Compare against baseline revision"
       value={baselineRev.revision}
       onChange={e=>setSelectedRev(e.target.value)}
       disabled={disabled||busy}
      >
       {revisions.map(r=><option key={r.revision} value={r.revision}>{r.label}</option>)}
      </select>
     </label>
     {!revisions[0]?.lineSnapshotLocked&&(
      <button type="button" disabled={disabled||busy} onClick={handleLockRev00Lines}>
       Lock Rev00 Line Snapshot
      </button>
     )}
     <button
      type="button"
      disabled={disabled||busy}
      onClick={()=>setPromoteModalOpen(true)}
      style={{background:'#123f61',color:'#fff',fontWeight:600,padding:'6px 12px',borderRadius:'4px',border:'none',cursor:'pointer'}}
     >
      Lock &amp; Promote to Next Revision ({nextRev})
     </button>
    </div>
   </div>
   {statusMsg&&<p role="status" style={{margin:'8px 0 0 0',color:'#166534',fontWeight:600}}>{statusMsg}</p>}
  </section>

  <div
   style={{
    display:'grid',
    gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))',
    gap:'12px',
    marginBottom:'14px',
   }}
   aria-label="Cost Impact KPI Summary"
  >
   <div className="p55-panel" style={{borderLeft:`4px solid ${comparison.netCostImpactUSD>=0?'#16a34a':'#dc2626'}`}}>
    <div style={{fontSize:'0.82em',textTransform:'uppercase',opacity:0.75}}>Net Cost Impact (+/-)</div>
    <div style={{fontSize:'1.4em',fontWeight:700,color:comparison.netCostImpactUSD>=0?'#15803d':'#b91c1c',margin:'4px 0'}}>
     {fmtSignedUSD(comparison.netCostImpactUSD)}
    </div>
    <div style={{fontSize:'0.85em'}}>
     {comparison.netCostImpactUSD>0
      ?'Margin Gain (+) vs. '+baselineRev.revision
      :comparison.netCostImpactUSD<0
      ?'Cost Overrun (-) vs. '+baselineRev.revision
      :comparison.hasLineBaseline
      ?'No net cost variance vs. '+baselineRev.revision
      :'Lock Rev00 line snapshot to track per-line cost deltas'}
    </div>
   </div>

   <div className="p55-panel" style={{borderLeft:`4px solid ${comparison.c1Reconciled?'#16a34a':'#d97706'}`}}>
    <div style={{fontSize:'0.82em',textTransform:'uppercase',opacity:0.75}}>
     C1 Ceiling Gap vs. $4,649,195.28
    </div>
    <div style={{fontSize:'1.4em',fontWeight:700,color:comparison.c1Reconciled?'#15803d':'#b45309',margin:'4px 0'}}>
     {fmtSignedUSD(comparison.c1CeilingGapUSD)}
    </div>
    <div style={{fontSize:'0.85em'}}>
     Current C1 Sell: <strong>{fmtUSD(comparison.currentC1SellUSD)}</strong> ·{' '}
     {comparison.c1Reconciled
      ?'Reconciled to locked ceiling'
      :comparison.c1CeilingGapUSD>0
      ?'Over ceiling — requires internal re-allocation / de-scope'
      :'Under ceiling — headroom available for OPEN items'}
    </div>
   </div>

   <div className="p55-panel" style={{borderLeft:'4px solid #2563eb'}}>
    <div style={{fontSize:'0.82em',textTransform:'uppercase',opacity:0.75}}>Remaining OPEN Items</div>
    <div style={{fontSize:'1.4em',fontWeight:700,margin:'4px 0'}}>
     {comparison.remainingOpenCount} OPEN
    </div>
    <div style={{fontSize:'0.85em'}}>
     Current: <strong>{comparison.pricedCount}/{comparison.totalCount}</strong> priced ·{' '}
     Rev00 Freeze: {REV00_BASELINE_0550.pricedCount}/{REV00_BASELINE_0550.totalCount} priced ({REV00_BASELINE_0550.openCount} OPEN)
    </div>
   </div>
  </div>

  {promoteModalOpen&&(
   <div
    role="dialog"
    aria-modal="true"
    aria-label={`Confirm promotion to ${nextRev}`}
    style={{
     position:'fixed',
     inset:0,
     background:'rgba(15, 23, 42, 0.65)',
     display:'flex',
     alignItems:'center',
     justifyContent:'center',
     zIndex:9999,
     padding:'16px',
    }}
   >
    <div style={{background:'#fff',borderRadius:'8px',maxWidth:'540px',width:'100%',padding:'20px',boxShadow:'0 20px 25px -5px rgba(0,0,0,0.2)'}}>
     <h4 style={{margin:'0 0 8px 0'}}>Lock &amp; Promote to {nextRev}</h4>
     <p style={{fontSize:'0.9em',margin:'0 0 12px 0'}}>
      This will lock the Current Working baseline across <strong>A2 and C1–C8</strong> as immutable revision{' '}
      <strong>{nextRev}</strong> ({revChain} -&gt; {nextRev}) once finalized for SAMTEL submission.
      Rev00 ({fmtUSD(REV00_BASELINE_0550.goodsC1CeilingUSD)}) remains preserved in revision history.
     </p>
     <ul style={{fontSize:'0.88em',margin:'0 0 12px 18px',padding:0}}>
      <li>1. GOODS / Form C-1 Sell: <strong>{fmtUSD(currentSnapshot.summary.goodsC1SellUSD)}</strong></li>
      <li>Total Base Working Subtotal: <strong>{fmtUSD(currentSnapshot.summary.totalBaseWorkingSubtotalUSD)}</strong></li>
      <li>Priced / OPEN: <strong>{currentSnapshot.summary.pricedCount}/{currentSnapshot.summary.totalCount}</strong> ({currentSnapshot.summary.openCount} OPEN)</li>
      <li>Net Cost Impact vs. {baselineRev.revision}: <strong>{fmtSignedUSD(comparison.netCostImpactUSD)}</strong></li>
     </ul>
     <label style={{display:'block',fontSize:'0.88em',marginBottom:'12px'}}>
      Revision / SAMTEL Submission Note
      <input
       type="text"
       value={promoteNote}
       onChange={e=>setPromoteNote(e.target.value)}
       placeholder={`e.g., Finalized A2, C1-C8 for SAMTEL ${nextRev} submission`}
       style={{width:'100%',marginTop:'4px',padding:'6px 8px',boxSizing:'border-box'}}
      />
     </label>
     <div style={{display:'flex',justifyContent:'flex-end',gap:'8px'}}>
      <button type="button" onClick={()=>setPromoteModalOpen(false)} disabled={busy}>Cancel</button>
      <button
       type="button"
       onClick={handleConfirmPromote}
       disabled={busy}
       style={{background:'#123f61',color:'#fff',fontWeight:600,padding:'6px 14px',borderRadius:'4px',border:'none',cursor:'pointer'}}
      >
       Confirm Lock &amp; Promote ({nextRev})
      </button>
     </div>
    </div>
   </div>
  )}

  <details open style={{marginBottom:'14px'}}>
   <summary style={{cursor:'pointer',fontWeight:600,padding:'6px 0'}}>
    11.C1 System Breakdown — All 19 Systems + COMMON ({comparison.c1SystemBreakdown.length} groups)
   </summary>
   <div style={{overflowX:'auto'}}>
    <table className="p55-table" aria-label="11.C1 System Cost Impact Breakdown">
     <thead>
      <tr>
       <th>System</th>
       <th>Items</th>
       <th>OPEN</th>
       <th>Baseline Cost ({baselineRev.revision})</th>
       <th>Current Cost</th>
       <th>Internal Cost Impact (+/-)</th>
       <th>Baseline Sell ({baselineRev.revision})</th>
       <th>Current Sell</th>
       <th>A1 Ceiling Variance</th>
      </tr>
     </thead>
     <tbody>
      {comparison.c1SystemBreakdown.map(s=><tr key={s.systemToken}>
       <td><strong>{s.systemToken}</strong><br/><small>{s.systemName}</small></td>
       <td>{s.itemCount}</td>
       <td>{s.openCount}</td>
       <td>{fmtUSD(s.baselineCostUSD)}</td>
       <td>{fmtUSD(s.currentCostUSD)}</td>
       <td style={{color:s.internalCostImpactUSD>0?'#15803d':s.internalCostImpactUSD<0?'#b91c1c':'inherit',fontWeight:600}}>
        {fmtSignedUSD(s.internalCostImpactUSD)}
       </td>
       <td>{fmtUSD(s.baselineSellUSD)}</td>
       <td>{fmtUSD(s.currentSellUSD)}</td>
       <td style={{color:s.sellVarianceUSD>0?'#b45309':s.sellVarianceUSD<0?'#15803d':'inherit',fontWeight:600}}>
        {fmtSignedUSD(s.sellVarianceUSD)}
       </td>
      </tr>)}
     </tbody>
    </table>
   </div>
  </details>

  <section className="p55-panel" style={{marginBottom:'14px'}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px',marginBottom:'10px'}}>
    <h4 style={{margin:0}}>Line-by-Line Comparison ({baselineRev.revision} vs. Current Working · A2 &amp; C1–C8)</h4>
    <div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}}>
     <div role="group" aria-label="Item change filter" style={{display:'flex',gap:'4px'}}>
      <button
       type="button"
       aria-pressed={showChangedOnly}
       onClick={()=>setShowChangedOnly(true)}
       style={{fontWeight:showChangedOnly?700:400}}
      >
       Show Changed Items Only ({comparison.changedCount})
      </button>
      <button
       type="button"
       aria-pressed={!showChangedOnly}
       onClick={()=>setShowChangedOnly(false)}
       style={{fontWeight:!showChangedOnly?700:400}}
      >
       Show All Items ({comparison.rows.length})
      </button>
     </div>
     <label style={{fontSize:'0.88em'}}>
      Schedule{' '}
      <select aria-label="Filter by Schedule" value={scheduleFilter} onChange={e=>setScheduleFilter(e.target.value)}>
       <option value="ALL">ALL (A2, C1–C8)</option>
       {COST_IMPACT_SCHEDULES_0550.map(s=><option key={s} value={s}>{s}</option>)}
      </select>
     </label>
     <label style={{fontSize:'0.88em'}}>
      System{' '}
      <select aria-label="Filter by System" value={systemFilter} onChange={e=>setSystemFilter(e.target.value)}>
       <option value="ALL">ALL Systems + COMMON</option>
       {systemOptions.map(t=><option key={t} value={t}>{t}</option>)}
      </select>
     </label>
    </div>
   </div>

   <div style={{overflowX:'auto'}}>
    <table className="p55-table" aria-label="Cost Impact Line Comparison">
     <thead>
      <tr>
       <th>Schedule</th>
       <th>System</th>
       <th>Working ID / MR</th>
       <th>Description</th>
       <th>Qty / Unit</th>
       <th>Baseline Cost ({baselineRev.revision})</th>
       <th>Current Working Cost</th>
       <th>Internal Cost Impact (+/-)</th>
       <th>Baseline Sell ({baselineRev.revision})</th>
       <th>Current Working Sell</th>
       <th>A1 Ceiling Variance</th>
       <th>Status</th>
       <th>Open</th>
      </tr>
     </thead>
     <tbody>
      {filteredRows.length===0
       ?<tr><td colSpan={13} style={{textAlign:'center',padding:'16px'}}>
        {showChangedOnly
         ?'No changed items between '+baselineRev.revision+' and Current Working for the selected filters.'
         :'No items match the selected filters.'}
       </td></tr>
       :filteredRows.map(r=><tr key={r.id}>
        <td><strong>11.{r.schedule}</strong><br/><small>{r.treatment}</small></td>
        <td>{r.systemToken}</td>
        <td><small>{r.id}</small>{r.mrRef&&<><br/><small>{r.mrRef}</small></>}</td>
        <td>{r.description}</td>
        <td>{r.quantity??'OPEN'} {r.unit}</td>
        <td>{fmtUSD(r.baselineCostUSD)}</td>
        <td>{fmtUSD(r.currentCostUSD)}</td>
        <td style={{color:(r.internalCostImpactUSD||0)>0?'#15803d':(r.internalCostImpactUSD||0)<0?'#b91c1c':'inherit',fontWeight:600}}>
         {fmtSignedUSD(r.internalCostImpactUSD)}
        </td>
        <td>{fmtUSD(r.baselineSellUSD)}</td>
        <td>{fmtUSD(r.currentSellUSD)}</td>
        <td style={{color:(r.sellVarianceUSD||0)>0?'#b45309':(r.sellVarianceUSD||0)<0?'#15803d':'inherit',fontWeight:600}}>
         {fmtSignedUSD(r.sellVarianceUSD)}
        </td>
        <td>{r.currentStatus}{r.changed?' · CHANGED':''}</td>
        <td>
         {onNavigate&&<button type="button" disabled={disabled} onClick={()=>onNavigate('bid.budget.working.line.'+r.id)}>
          Open
         </button>}
        </td>
       </tr>)}
     </tbody>
    </table>
   </div>
  </section>

  <section className="p55-panel">
   <h4 style={{margin:'0 0 8px 0'}}>Revision History Log ({revChain})</h4>
   <div style={{overflowX:'auto'}}>
    <table className="p55-table" aria-label="Revision History Log">
     <thead>
      <tr>
       <th>Revision</th>
       <th>Label</th>
       <th>Locked At</th>
       <th>1. GOODS / Form C-1</th>
       <th>Base Working Subtotal</th>
       <th>Priced / Total (OPEN)</th>
       <th>Notes</th>
      </tr>
     </thead>
     <tbody>
      {revisions.map(r=><tr key={r.revision}>
       <td><strong>{r.revision}</strong></td>
       <td>{r.label}</td>
       <td><small>{r.createdAt}</small></td>
       <td>{fmtUSD(r.goodsC1CeilingUSD)}</td>
       <td>{fmtUSD(r.totalBaseWorkingSubtotalUSD)}</td>
       <td>{r.pricedCount}/{r.totalCount} ({r.openCount} OPEN)</td>
       <td>{r.note}</td>
      </tr>)}
     </tbody>
    </table>
   </div>
  </section>
 </div>;
}
