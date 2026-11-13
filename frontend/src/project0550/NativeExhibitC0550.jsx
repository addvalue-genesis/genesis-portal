import React,{useMemo,useState} from 'react';
import {a1SummarySlot0550,nativeSchedule0550,nativeExhibitProblems0550,nativeFormCss0550,nativeExhibitHtml0550,downloadNativeExhibit0550} from './exhibitCNative0550';
import {MgwScheduleSource0550} from './WorkingSchedulePreview0550';
import {ScheduleParentResults0550,SchedulePriceDiagnostics0550} from './SchedulePriceDiagnostics0550';
import {C1Appendix0550} from './C1Appendix0550';
import {C1_APPENDIX_LAYOUT_0550} from './data/c1Appendix0550';
import {scheduleRollup0550,scheduleViewTHB0550} from './data/scheduleRollup0550';
import {c8Country0550} from './data/c8Calloff0550';
import {c2DraftRowsFromExisting0550,c2HasSystem0550,c2ProjectLotOverlaps0550,spareSystemGroups0550,spareEquationDraftRows0550,SPARE_DRAFT_NOTE_0550} from './data/c2SystemForms0550';
import {commissioningPhase0550} from './data/commissioningSparePhases0550';
import {LanCusSpareCoverage0550} from './LanCusBasis0550';
import {useBidWorkspace} from './BidWorkspaceContext';
import {c5EquationDraftRows0550,c5SelectedSystems0550,c5UnmappedSystems0550,C5_TOOLS_DRAFT_NOTE_0550} from './data/c5ToolsScope0550';

const a1DirectRows=[
 [3,'S/N 2 · Inspection and tests'],
 [4,'S/N 3 · Preservation and packing for shipment'],
 [10,'S/N 9 · Vendor Documents'],
 [11,'Others (Please specify)'],
];
const money=value=>Number.isFinite(value)?value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'OPEN';

function LanC2Open0550({rows}){
 const phases=new Set(rows.map(row=>commissioningPhase0550(row.line)));
 const pre=!phases.has('PRE_COMMISSIONING'),commissioning=!phases.has('COMMISSIONING');
 return (pre||commissioning)&&<section className="p55-panel" aria-label="LAN C2 missing phase inputs">
  <h4>ข้อมูลที่ยังขาดสำหรับ LAN C2</h4>
  <ul>
   {pre&&<li>Pre-commissioning · OPEN · ยังไม่พบรายการและจำนวนวัสดุที่ต้องใช้ตาม ITP หรือแผนเตรียมระบบ LAN</li>}
   {commissioning&&<li>Commissioning · OPEN · MGW Q26-063 ยังไม่แยกรายการอะไหล่ที่ใช้ทดสอบและเดินระบบถึง PAC พร้อมจำนวนที่รวมในแพ็กเกจแล้ว</li>}
  </ul>
 </section>;
}

function A1DirectReview0550({view,currency,onNavigate,onAllocate,disabled}){
 const direct=view.bindings.filter(b=>b.line&&b.schedule==='A1'&&b.treatment==='BASE');
 return <section aria-label="11.A1 internal direct allocation review">
  <h4>11.A1 · รายการย่อยสำหรับตรวจทานภายใน</h4>
  <p>เปิดตามข้อใน 11.A1 เพื่อดูรายการจาก Working ที่จัดเข้า A1 โดยตรง พร้อมฐานสำหรับเตรียมคำอธิบาย</p>
  {a1DirectRows.map(([slot,label])=>{
   const rows=direct.filter(b=>a1SummarySlot0550(b)===slot);
   const subtotal=scheduleRollup0550(rows);
   return <details key={slot}>
    <summary>{label} · {subtotal.count} รายการ{subtotal.priced>0?' · ยอดที่มีราคา '+currency+' '+money(subtotal.knownUSD):''}{subtotal.open>0?' · '+subtotal.open+' OPEN':''}</summary>
    {rows.length===0?<p>ยังไม่มีรายการจัดเข้า A1 โดยตรงในข้อนี้</p>:<div className="p55-table-wrap"><table className="p55-table" aria-label={label}>
     <thead><tr><th>รายการ Working</th><th>จำนวน / หน่วย</th><th>ราคาขาย {currency}</th><th>ฐานสำหรับเตรียมคำอธิบาย</th><th>เปิดรายการต้นทาง</th></tr></thead>
     <tbody>{rows.map(b=><tr key={b.lineId}>
      <td><strong>{b.line.description}</strong><small>{b.lineId} · {b.line.wbs}</small></td>
      <td>{b.quantity??'OPEN'} {b.unit}</td>
      <td>{money(b.amount)}</td>
      <td><small>{b.suggested?'SI แนะนำ · ยังไม่บันทึก':b.state}</small><p>{b.basis||'ยังไม่ระบุฐานการจัดหมวด'}</p>{b.locator&&<details><summary>หลักฐานอ้างอิง</summary><p>{b.locator}</p></details>}</td>
      <td><button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.line.'+b.lineId)}>เปิด Working</button> <button type="button" disabled={disabled} onClick={()=>onAllocate?.(b.lineId)}>เปิด 11.M</button></td>
     </tr>)}</tbody>
    </table></div>}
   </details>;
  })}
 </section>;
}

export function LazyNativeExhibitC0550(props){
 const [open,setOpen]=useState(false);
 return <details open={open} onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}><summary>{props.label}</summary>{open&&<NativeExhibitC0550 {...props}/>}</details>;
}

// BID-FLOW: CUS ↔ VND → SI A/B/C → Release → Volume I (A1 A2 C1–C8 D E F M) / II / III
// C2–C4 drafts come from SI spare equations; the C5 draft comes from TOOLS-SCOPE. Neither enters A1/A2 until bound in 11.M.
export function NativeExhibitC0550({view,id,currency='USD',onAllocate,onNavigate,c2Scope,onPrepareSpare,disabled=false,mrNavigationTarget}){
 view=useMemo(()=>id==='C1'?{...view,c1LayoutVersion:C1_APPENDIX_LAYOUT_0550}:view,[view,id]);
 const [systemChoice,setSystemChoice]=useState('');
 const [c8LoadMessage,setC8LoadMessage]=useState('');
 const ws=useBidWorkspace();
 const references=useMemo(()=>{
  if(!['C2','C3','C4'].includes(id)||!view.workingPreview||!c2Scope)return undefined;
  const equations=spareEquationDraftRows0550(c2Scope.data,c2Scope.model,id);
  if(id!=='C2')return equations;
  const legacy=c2DraftRowsFromExisting0550(c2Scope.data,c2Scope.model);
  return new Map([...legacy,...equations]);
 },[id,view.workingPreview,c2Scope]);
 const groups=useMemo(()=>['C2','C3','C4'].includes(id)&&(view.c2Systems||references?.size)?spareSystemGroups0550(view,id,references).filter(g=>g.token):[],[id,view,references]);
 const selected=groups.find(group=>group.token===systemChoice);
 const unresolved=useMemo(()=>id==='C2'&&groups.length?view.scheduleRows('C2').filter(row=>!c2HasSystem0550(row)):[],[view,groups,id]);
 const formView=useMemo(()=>groups.length?{...view,c2SystemToken:selected?.token,
  scheduleRows:schedule=>schedule===id?(selected?selected.rows:groups.flatMap(group=>group.rows)):view.scheduleRows(schedule)}:view,[view,groups,selected,id]);
 const hasPricedTools=id==='C5'&&view.scheduleRows('C5').some(row=>row.quantity>0&&Number.isFinite(row.amount));
 const toolDrafts=useMemo(()=>id!=='C5'||!view.workingPreview||hasPricedTools||!ws?.data||!ws?.model?[]:c5EquationDraftRows0550(ws.data,ws.model),[id,view.workingPreview,hasPricedTools,ws?.data,ws?.model]);
 const toolSystems=useMemo(()=>toolDrafts.length?c5SelectedSystems0550(ws.data,ws.model):[],[toolDrafts,ws?.data,ws?.model]);
 const screenView=useMemo(()=>currency==='THB'?scheduleViewTHB0550(formView):formView,[formView,currency]);
 const form=useMemo(()=>id==='C1'?null:nativeSchedule0550(screenView,id,currency,references),[screenView,id,currency,references]),count=id==='A1'?view.bindings.filter(b=>b.line&&b.treatment==='BASE').length:id==='A2'?view.bindings.filter(b=>b.line&&b.treatment==='OPTION').length:formView.scheduleRows(id).length;
 const problems=useMemo(()=>nativeExhibitProblems0550(formView,id),[formView,id]);
 const hasC8Calloff=id==='C8'&&view.scheduleRows('C8').some(c8Country0550);
 const overlaps=useMemo(()=>id==='C2'?c2ProjectLotOverlaps0550(view.scheduleRows('C2')):[],[view,id]);
 const print=()=>{
  const frame=document.createElement('iframe');frame.style.cssText='position:fixed;width:1px;height:1px;left:-10000px';
  frame.onload=()=>{frame.contentWindow.focus();frame.contentWindow.print();setTimeout(()=>frame.remove(),60000);};
  frame.srcdoc=nativeExhibitHtml0550(formView,id);document.body.appendChild(frame);
 };
 return <section aria-label={'Native Exhibit C Schedule '+id}>
  <style>{nativeFormCss0550}</style>
  {groups.length>0&&<label>ระบบใน Schedule {id} <select aria-label={id+' system form'} value={selected?.token||''} onChange={e=>setSystemChoice(e.target.value)} disabled={disabled}><option value="">แสดงทุกระบบ</option>{groups.map(group=><option key={group.token} value={group.token}>{group.token}{group.name===group.token?'':' · '+group.name} · {group.rows.length||(group.draftRows.length?'Draft reference':'OPEN')}</option>)}</select></label>}
  {groups.length>0&&<button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.group.'+({C2:'B5',C3:'C3',C4:'C2'}[id]),{workingSystem:selected?.token})}>เตรียมรายการ Working {({C2:'B5',C3:'C3',C4:'C2'}[id])}</button>}
  <div className="p55-native-toolbar"><button type="button" disabled={disabled} onClick={()=>downloadNativeExhibit0550(formView,'docx',id)}>Export Schedule {id} Word (.docx)</button><button type="button" disabled={disabled} onClick={print}>พิมพ์ Schedule {id} / PDF</button><button type="button" disabled={disabled} onClick={()=>downloadNativeExhibit0550(view,'docx')}>Export Exhibit C Word ทั้งชุด</button></div>
  {id==='C1'?<C1Appendix0550 view={view} currency={currency} onNavigate={onNavigate} disabled={disabled} mrNavigationTarget={mrNavigationTarget}/>:<p className="p55-native-help">แบบฟอร์มจาก Exhibit C rev-0 · Currency: {currency} · {count} รายการจาก Working · {view.workingPreview?'ร่างพร้อมการจัดหมวดแนะนำ / ราคาที่ยังรอทบทวน':'ข้อมูลที่บันทึก / ราคาที่ผ่านการทบทวน'} · ข้อมูลที่ขาดคง OPEN</p>}
  {/^C[2-7]$/.test(id)&&<ScheduleParentResults0550 rows={view.scheduleRows(id)} id={id} system={selected?.token} currency={currency} workingPreview={view.workingPreview} onNavigate={onNavigate} disabled={disabled}/>}
  {id==='C8'&&view.workingPreview&&!hasC8Calloff&&ws?.importC8Calloff&&<div className="p55-panel" aria-label="C8 price data">
   <p>ยังไม่มีราคา Call-off รายประเทศใน Working หาก Drive ยังไม่ซิงก์ ให้เลือกไฟล์ราคาโครงการจาก DATA เพื่อโหลดเฉพาะ C8</p>
   <label>โหลดไฟล์ราคา C8 <input type="file" accept=".json,application/json" disabled={disabled||ws.busy} onChange={async e=>{
    const input=e.currentTarget;
    const file=input.files?.[0];
    input.value='';
    if(file)setC8LoadMessage(await ws.importC8Calloff(file));
   }}/></label>
   {c8LoadMessage&&<p role="status">{c8LoadMessage}</p>}
  </div>}
  {id==='C2'&&view.workingPreview&&selected?.token==='TEL-LAN'&&<LanC2Open0550 rows={selected.rows}/>}
  {groups.some(group=>group.draftRows.length>0)&&<p className="p55-native-help">Draft reference · {SPARE_DRAFT_NOTE_0550} · ยอดข้อเสนอและ Word/PDF ใช้รายการที่จัดลง Schedule</p>}
  {toolDrafts.length>0&&<details className="p55-panel" open><summary>SI · Special Tools ตามระบบใน Working (Draft · {toolDrafts.length} ประเภท)</summary>
   <p>{C5_TOOLS_DRAFT_NOTE_0550}</p>
   <p>ระบบที่เลือกใน Working A: {toolSystems.join(', ')||'OPEN'}{c5UnmappedSystems0550(toolSystems).length>0&&' · ยังไม่มีรายการเครื่องมือสำหรับ: '+c5UnmappedSystems0550(toolSystems).join(', ')}</p>
   <div className="p55-table-wrap"><table className="p55-table" aria-label="C5 special tool type drafts"><thead><tr><th>Tool type</th><th>ระบบ</th><th>จำนวน / ยี่ห้อ / ราคา</th><th>หมายเหตุ</th></tr></thead><tbody>
    {toolDrafts.map(t=><tr key={t.id}><td>{t.description}</td><td>{t.systems.join(', ')}</td><td>OPEN</td><td><small>{t.source}</small></td></tr>)}
   </tbody></table></div>
  </details>}
  {groups.filter(g=>!selected||selected.token===g.token).flatMap(g=>g.draftRows).some(r=>r.equationDraft)&&<details className="p55-panel" open><summary>SI · Q_add / ต้นทุน / ราคาขาย Draft</summary>
   <p>{SPARE_DRAFT_NOTE_0550}</p>
   <div className="p55-table-wrap"><table className="p55-table" aria-label={id+' SI equation drafts'}><thead><tr><th>Working / Offer</th><th>Q_required / Q_add</th><th>ต้นทุนต่อหน่วย / รวม</th><th>ราคาขาย Draft USD</th><th>ทำงานต่อ</th></tr></thead><tbody>
    {groups.filter(g=>!selected||selected.token===g.token).flatMap(g=>g.draftRows).filter(r=>r.equationDraft).map(r=><tr key={r.id}>
     <td>{r.description}<small>{r.systemToken} / {r.workingLineId} / {r.offerId}</small></td>
     <td>{r.result.requiredQuantity??'OPEN'} / {r.quantity??'OPEN'} {r.unit}<small>{r.equationId}</small></td>
     <td>{r.currency} {money(r.unitCost)} / {money(r.totalCost)}</td><td>USD {money(r.amount)}</td>
     <td><button type="button" disabled={disabled} onClick={()=>onNavigate?.(r.calculationId?'bid.engineering.calculation.'+r.calculationId:'bid.engineering.equations')}>ตรวจสมการ SI</button>
      {onPrepareSpare&&<button type="button" disabled={disabled||r.result.state!=='CALCULATED'||!(r.quantity>0)||!Number.isFinite(r.unitCost)||!['Pc','U','SET'].includes(r.unit)} onClick={()=>onPrepareSpare(r)}>เตรียม Working แล้วเปิด 11.M</button>}
      <small>{r.issues.join(' / ')}</small></td>
    </tr>)}
   </tbody></table></div>
  </details>}
  {id==='C2'&&selected?.token==='TEL-LAN'&&c2Scope&&<details className="p55-panel"><summary>ตรวจความครบถ้วนจาก CUS → Working B5 → C2</summary>
   <button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.working-preview.step.5',{workingSystem:'TEL-LAN'})}>เปิด WP.5 · TEL-LAN</button>
   <LanCusSpareCoverage0550 {...c2Scope} onNavigate={onNavigate} disabled={disabled}/>
  </details>}
  {overlaps.length>0&&<div role="alert" className="p55-native-issues" aria-label="C2 Project Lot overlap">
   <strong>ตรวจความเสี่ยงคิดซ้ำใน C2 · พบ Lot และรายการราย Part No.</strong>
   <ul>{overlaps.map(({mainEquipment,systemToken,lots,parts})=><li key={mainEquipment?'equipment:'+mainEquipment:'system:'+systemToken}>
    {mainEquipment?'Main Equipment '+mainEquipment:'ระบบ '+systemToken+' · ตรวจขอบเขต Lot ในฟอร์มเดียวกัน'} · {lots.map(row=>row.lineId).join(', ')} · Part No. {parts.map(row=>row.partNo+' ('+row.lineId+')').join(', ')}
    {' '}<button type="button" disabled={disabled} onClick={()=>onAllocate?.(lots[0].lineId)}>ตรวจการจัดหมวด 11.M</button>
   </li>)}</ul>
  </div>}
  <details className="p55-c1-internal-diagnostics" open={id!=='C1'&&id!=='C8'}><summary>SI · ตรวจราคา / การจัดหมวดภายใน</summary>
  {id==='C8'&&<ScheduleParentResults0550 rows={view.scheduleRows(id)} id={id} currency={currency} workingPreview={view.workingPreview} onNavigate={onNavigate} disabled={disabled}/>}
  {unresolved.length>0&&<section className="p55-native-issues" aria-label="C2 rows awaiting system assignment">
   <h4>รายการ C2 รอระบุระบบ · {unresolved.length} แถว</h4>
   <p>เก็บรายการ Working เดิมไว้ตรวจทานใน SI ยอดทั้งโครงการยังอ้างอิงรายการเดิม เมื่อยืนยันระบบและ Main Equipment No. แล้วให้จัดลงฟอร์มของระบบนั้น</p>
   <ul>{unresolved.map(row=><li key={row.lineId}>{row.line.description}{' '}
    <button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.line.'+row.lineId)}>เปิด Working</button>{' '}
    <button type="button" disabled={disabled} onClick={()=>onAllocate?.(row.lineId)}>ตรวจการจัดหมวด 11.M</button>
   </li>)}</ul>
  </section>}
  {id==='A1'&&<A1DirectReview0550 view={screenView} currency={currency} onNavigate={onNavigate} onAllocate={onAllocate} disabled={disabled}/>}
  <SchedulePriceDiagnostics0550 view={screenView} id={id} currency={currency} onNavigate={onNavigate} onAllocate={onAllocate} disabled={disabled}/>
  {view.unallocated.length>0&&<p className="p55-native-issues">Working อีก {view.unallocated.length} รายการยังไม่ได้ระบุช่องปลายทาง <button type="button" onClick={()=>onAllocate?.()}>จัดรายการลงแบบฟอร์ม 11.M</button></p>}
  {problems.length>0&&<ul className="p55-native-issues">{problems.map((p,i)=><li key={i}>{p}</li>)}</ul>}
  {id==='C1'&&view.workingPreview&&<MgwScheduleSource0550 view={view} onNavigate={onNavigate} disabled={disabled}/>}
  </details>
  {id!=='C1'&&<div className="p55-native-scroll" dangerouslySetInnerHTML={{__html:form.html}}/>}
 </section>;
}
