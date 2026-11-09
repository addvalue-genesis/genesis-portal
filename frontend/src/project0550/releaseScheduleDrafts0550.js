import {SCHEDULES_0550,deriveBidVolumes0550} from './data/bidVolumes0550';
import {deriveBidVolumeWorkingPreview0550} from './data/bidVolumeWorkingPreview0550';
import {C1_APPENDIX_LAYOUT_0550} from './data/c1Appendix0550';
import {c2HasSystem0550,c2SystemGroups0550} from './data/c2SystemForms0550';
import {scheduleRollup0550} from './data/scheduleRollup0550';
import {mgwMetNdbOffer0550,MGW_MET_NDB_OPEN_0550} from './data/mgwQuoteSelection0550';
import {buildNativeExhibitDocx0550,nativeExhibitProblems0550} from './exhibitCNative0550';
import {zipStore} from './exportOriginalPriceForm';

export const RELEASE_DRAFT_FORMS_0550=SCHEDULES_0550.filter(({id})=>id==='A'||/^C[1-8]$/.test(id));
const dollars=value=>value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
export const draftSubtotal0550=result=>result.priced
 ?'USD '+dollars(result.knownUSD)+' · '+result.priced+'/'+result.count+' priced'
 :'OPEN · 0/'+result.count+' priced';

export function releaseScheduleDraftView0550(data,model,systems,today){
 const saved=deriveBidVolumes0550(data,model,systems,today);
 const draft=deriveBidVolumeWorkingPreview0550(data,model,systems,today,saved);
 return {...draft,c1LayoutVersion:C1_APPENDIX_LAYOUT_0550,c2Systems:systems};
}

export function releaseScheduleChecks0550(view){
 return RELEASE_DRAFT_FORMS_0550.map(({id,title})=>{
  const rows=id==='A'?view.bindings.filter(b=>b.line):view.scheduleRows(id);
  const unassigned=id==='C2'?rows.filter(b=>!c2HasSystem0550(b)):[];
  const printed=id==='C2'?rows.filter(c2HasSystem0550):rows;
  const formView=id==='C2'?{...view,scheduleRows:code=>code==='C2'?printed:view.scheduleRows(code)}:view;
  const amounts=['BASE','OPTION'].map(treatment=>({treatment,...scheduleRollup0550(printed.filter(b=>b.treatment===treatment))}))
   .filter(row=>row.count);
  const checks=new Map();
  const add=(label,ref)=>{
   if(!label)return;
   if(!checks.has(label))checks.set(label,new Set());
   if(ref)checks.get(label).add(ref);
  };
  const record=view.getRecord('I.'+id);
  if(record.state!=='REVIEWED')add('Schedule response / disposition awaits review');
  if(id==='A'){
   if(!record.nativeFields?.agreementNo?.trim())add('Agreement / Contract No. OPEN');
   if(!view.proposal.documentNo?.trim())add('Quotation document number OPEN');
   add('Confirm the package title in the native Exhibit C header.');
   if(!Number.isFinite(view.baseAssigned))add('Base A1 total OPEN');
   if(!Number.isFinite(view.optionsAssigned))add('Option A2 total OPEN');
   for(const b of printed.filter(b=>!Number.isFinite(b.amount)&&b.treatment!=='CALLOFF')){
    add(b.treatment+' owner with no selling price',b.lineId);
   }
   for(const line of view.unallocated)add('Working owner awaiting Schedule allocation',line.id);
  }else{
   if(!printed.length&&record.state!=='REVIEWED')add('No Working rows on this form. Confirm scope and allocation.');
   for(const issue of nativeExhibitProblems0550(formView,id)){
    const [label,ref]=issue.slice(id.length+3).split(/ \/ |: (?=[\w.-]+$)/,2);
    add(label,ref);
   }
   for(const b of printed){
    for(const issue of b.problems||[]){
     if(issue!=='REVIEW_OPEN')add(issue.split(' / ')[0],b.lineId);
    }
    for(const issue of b.line.problems||[])add(issue.split(' / ')[0],b.lineId);
    if(b.line.spareBudget)add('Draft spare allowance. Confirm OEM parts, quantity and rate.',b.lineId);
    if(mgwMetNdbOffer0550(b.line.offer))add(MGW_MET_NDB_OPEN_0550[b.line.systemToken],b.lineId);
   }
   for(const b of unassigned)add('C2 row needs a named system before printing',b.lineId);
   if(id==='C2')for(const system of c2SystemGroups0550(formView)){
    for(const phase of system.pendingPhases)add('C2 phase awaiting Working B5: '+phase.title,system.token);
   }
   if(id==='C6'&&!printed.length&&record.state!=='REVIEWED')add('Confirm first-filling and consumable specification, quantity and owner.');
   if(id==='C7')for(const b of printed.filter(b=>b.unit!=='MH'||!Number.isFinite(b.quantity)))add('Service / training man-hours OPEN',b.lineId);
   if(id==='C8')for(const b of printed.filter(b=>b.treatment==='CALLOFF'))add('Call-off unit rate. Exclude from contract subtotals.',b.lineId);
   if(id==='C8'&&!printed.length&&record.state!=='REVIEWED')add('Confirm Purchaser facilities and the Base or call-off treatment.');
  }
  return {id,title,amounts,checks:[...checks].map(([label,refs])=>({label,refs:[...refs]})),formView};
 });
}

export function releaseScheduleReviewText0550(documents){
 return ['# PJ2608-0550 Draft Schedule Review',
  'Working prices in USD. Subtotals cover priced allocations only. Schedule A summarizes the underlying allocations. Review and resolve the checks before customer issue.',
  ...documents.map(({id,title,amounts,checks})=>[
   '## Schedule '+id+' '+title,
   amounts.length?amounts.map(result=>result.treatment+' · '+draftSubtotal0550(result)).join(' / '):'Price · OPEN',
   ...checks.map(({label,refs})=>'- '+label+(refs.length?' · '+refs.join(', '):'')),
  ].join('\n'))].join('\n\n')+'\n';
}

export function releaseScheduleArchive0550(documents){
 const files=Object.fromEntries(documents.map(({id,formView})=>[
  'PJ2608-0550_Schedule-'+id+'_DRAFT.docx',buildNativeExhibitDocx0550(formView,id),
 ]));
 return zipStore({...files,'PJ2608-0550_Draft_Schedule_Review.md':releaseScheduleReviewText0550(documents)});
}
