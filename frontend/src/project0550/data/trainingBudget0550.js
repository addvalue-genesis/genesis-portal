import {isGeneratedBidEstimate0550} from './bidCompletion0550';
import {matchesWorkingDefault0550,policyDefaults0550} from '../bidWorkingBasis0550';
import {blankScheduleBinding0550,saveBidVolumeRecord0550} from './bidVolumes0550';
import {integrationFingerprint0550,integrationRequirements0550} from './integrationWorkspace0550';
import {importMrWorkingBasis0550} from './mrWorkingBasis0550';
import {prepareTsiActivityBudget0550,prepareTsiExpenseBudget0550} from './tsiActivityBudget0550';

export const TRAINING_THAI_OWNER_0550='REQ-MR-ACT-B3-D02';
export const TRAINING_OJT_OWNER_0550='REQ-MR-ACT-B3-D03';
export const TRAINING_OJT_DAYS_0550=15;
const version='Training Rev01 / 2026-11-13';
const thai={id:TRAINING_THAI_OWNER_0550,schedule:'A1',summary:'OTHER',title:'Thailand FAT campaign · customer training (1 cohort / 20 people / 5 days)',cost:933847.58,quantity:1,unit:'Lot'};
const ojt={id:TRAINING_OJT_OWNER_0550,schedule:'C7',summary:'TRAINING',title:'Myanmar site OJT · 6 blocks / 15 days',cost:2267321.17,quantity:TRAINING_OJT_DAYS_0550*2*10,unit:'MH'};
const owners=[thai,ojt];
const covered={
 'REQ-MR-ACT-B3-D01':ojt.id,
 'REQ-MR-ACT-B3-D04':thai.id,
 'REQ-MR-ACT-B3-D05':ojt.id,
};
const legacyOemTravel='LINE-BID-OEM-TRAINING-TRAVEL-0550';
// The legacy shared pool includes 6 training trips, 8 event days and 12 paid
// transit days. Retain the other campaigns and the common personnel cover.
const sharedTraining={
 'REQ-MR-ACT-B4-D07':6,'LINE-TSI-BUDGET-AIRFARE':6,'REQ-MR-ACT-B4-D08':14,
 'LINE-TSI-BUDGET-PERDIEM':20,'LINE-TSI-BUDGET-GROUND':6,'REQ-MR-ACT-B4-D09':6,
};
const same=(a,b)=>integrationFingerprint0550(a??null)===integrationFingerprint0550(b??null);
export const trainingRev01Owner0550=(line,id)=>line?.id===id&&line.sourceRef?.startsWith(version+' / ');

export function trainingBudgetPending0550(data,today){
 return today>='2026-11-13'&&data.projectId==='PJ2608-0550'&&Boolean(data.repositoryBasisImport)&&
  !data.lines.some(line=>owners.some(owner=>trainingRev01Owner0550(line,owner.id)));
}

export function prepareTrainingBudget0550(data,policies,team,today){
 if(!trainingBudgetPending0550(data,today))return data;
 const service=policyDefaults0550(policies,'Professional Service'),repo=data.repositoryBasisImport;
 if(!service)return data;
 const pristine=importMrWorkingBasis0550({lines:[],offers:[]},policies,today).lines;
 const date=repo.tsiActivityBudget?.preparedOn||today;
 const generated=prepareTsiExpenseBudget0550(prepareTsiActivityBudget0550({
  projectId:data.projectId,repositoryBasisImport:{},lines:pristine,calculations:[],
 },policies,team,date),policies,team,date);
 const byId=new Map(data.lines.map(l=>[l.id,l]));
 const byCalc=new Map(data.calculations.map(c=>[c.id,c]));
 const generatedLines=new Map(generated.lines.map(l=>[l.id,l]));
 const generatedCalcs=new Map(generated.calculations.map(c=>[c.id,c]));
 const canReplace=line=>{
  if(!line||line.officialReview)return false;
  const base=generatedLines.get(line.id),calc=byCalc.get(line.calculationId);
  return matchesWorkingDefault0550(line,pristine.find(l=>l.id===line.id))||
   (same(line,base)&&same(calc,generatedCalcs.get(base?.calculationId)))||isGeneratedBidEstimate0550(data,line);
 };
 const affected=new Set([...owners.map(owner=>owner.id),...Object.keys(covered),legacyOemTravel]);
 const legacy=byId.get(legacyOemTravel);
 const shared=Object.keys(sharedTraining).filter(id=>{
  const line=byId.get(id);
  return repo.tsiActivityBudget?.expenseLineIds?.includes(id)||
   (line?.selected&&(line.manualCost!=null||line.sellRate!=null||line.calculationId||line.offerId));
 });
 if([...affected].some(id=>id!==legacyOemTravel&&!canReplace(byId.get(id)))||
  (legacy?.selected&&!canReplace(legacy))||shared.some(id=>!canReplace(byId.get(id)))||
  data.lines.some(line=>line.wbs==='B3'&&line.selected&&!affected.has(line.id)&&
   !line.coveredByLineId&&(line.manualCost!=null||line.sellRate!=null||line.offerId||line.calculationId)))return data;
 const bindings=data.bidVolumes?.bindings||[];
 const oldBindings=bindings.filter(b=>affected.has(b.lineId));
 const wasGenerated=b=>b.status==='DRAFT'&&!b.reviewer&&!b.reviewedOn&&!b.basisKey&&
  b.schedule==='C7'&&b.summary==='TRAINING'&&b.treatment==='BASE'&&
  repo.pricedVolumeDraftIds?.includes(b.lineId)&&b.basis.startsWith('SI DRAFT / Training → C7 Training;')&&
  Object.entries(blankScheduleBinding0550(b.lineId)).every(([key,value])=>
   ['schedule','summary','sourceIds','locator','basis'].includes(key)||b[key]===value);
 const recorded=new Set(repo.pricedVolumeDraftIds||[]);
 if(bindings.length-oldBindings.length+owners.length>2000||oldBindings.some(b=>!wasGenerated(b))||
  owners.some(owner=>recorded.has(owner.id)&&!oldBindings.some(b=>b.lineId===owner.id)))return data;
 for(const owner of owners)recorded.add(owner.id);
 if(recorded.size>2000)return data;
 const ojtId=ojt.id;
 const record=data.bidVolumes?.records.find(r=>r.id==='I.C7');
 const scheduleDays=record?.nativeFields?.trainingPeriodDays?.trim();
 if(scheduleDays&&scheduleDays!==String(TRAINING_OJT_DAYS_0550))return data;
 const ownerById=new Map(owners.map(owner=>[owner.id,owner]));
 const sourceBasis=version+' / PJ2608-0550_Training_Budget_C7_Rev01.xlsx / Budget Summary and Delivery Plan / MR Rev.B1 §2.0(m), Exhibit A Annex 7 and Exhibit C A1/C7';
 const lines=data.lines.map(line=>{
  const owner=ownerById.get(line.id);
  if(owner){
   const {contingencyPct,...rest}=line;
   const rate=owner.cost/owner.quantity;
   return {...rest,...service,selected:true,description:owner.title,quantity:owner.quantity,unit:owner.unit,currency:'THB',
    manualCost:rate,sellRate:rate,markupPct:null,marginPct:null,calculationId:'',resultKey:'value',
    sourceRef:sourceBasis+' / Approved ROM with 15% reserve; ADDVALUE draft selling basis at cost recovery; existing Professional Service Prime treatment.',
    coverageBasis:'Rev01 training owner, including its own mobilization and allocated OEM support. PAGA item 23070 and Punch List use their existing separate owners.',
    customerRemark:owner.id===ojtId?'Myanmar OJT: APF Early/Main, ACP, ABV01, AMS01 and Yangon. 15 days × two crew × 10 h.':'Thailand classroom and lab: 19 Base systems. One cohort of 20 for five days.'};
  }
  if(covered[line.id]||line.id===legacyOemTravel&&line.selected){
   const {contingencyPct,...rest}=line;
   return {...rest,selected:false,coveredByLineId:covered[line.id]||ojtId,manualCost:null,sellRate:null,
    markupPct:null,marginPct:null,primePct:null,calculationId:'',resultKey:'value',quantity:null,
    coverageBasis:sourceBasis+' / Superseded training estimate; amount carried by the Rev01 owners once.'};
  }
  if(!shared.includes(line.id))return line;
  const quantity=line.id==='REQ-MR-ACT-B4-D07'?line.quantity:line.quantity-sharedTraining[line.id];
  return {...line,quantity,sourceRef:line.sourceRef+'\n'+version+' / remove legacy training workload from shared travel.',coverageBasis:line.coverageBasis+' / Remaining non-training campaigns.'};
 });
 const transit=shared.includes('REQ-MR-ACT-B4-D07')?byId.get('REQ-MR-ACT-B4-D07').calculationId:null;
 const calculations=data.calculations.map(c=>c.id===transit?
  {...c,inputs:{...c.inputs,events:c.inputs.events-sharedTraining['REQ-MR-ACT-B4-D07']},
   sourceRef:c.sourceRef+'\n'+version+' / remove legacy training trips.'}:c);
 const completion=repo.bidCompletion;
 const updatedIds=new Set([...affected,...shared]);
 const repositoryBasisImport={...repo,pricedVolumeDraftIds:[...recorded],
  ...(completion?{bidCompletion:{...completion,rows:completion.rows.filter(row=>!updatedIds.has(row.lineId))}}:{})};
 // Remove the superseded draft routes in the same update as the Working rows.
 let next={...data,lines,calculations,repositoryBasisImport,
  ...(data.bidVolumes?{bidVolumes:{...data.bidVolumes,bindings:bindings.filter(b=>!affected.has(b.lineId))}}:{})};
 const sources=data.sourceIntake?.sources||[],replaced=new Set(sources.flatMap(s=>s.replaces||[]));
 const activeSources=new Set(sources.filter(s=>s.authority==='CURRENT_TENDER'&&s.content&&s.readState!=='METADATA_ONLY'&&!replaced.has(s.id)).map(s=>s.id));
 const requirementSources=integrationRequirements0550(data).filter(q=>q.workLineIds.some(id=>affected.has(id))).flatMap(q=>q.sourceIds);
 const mrSources=sources.filter(s=>activeSources.has(s.id)&&s.documentNo==='MM-ASK-1A-APF-TEL-MR-0001'&&s.revision==='B1');
 const sourceIds=[...new Set([...requirementSources,...oldBindings.flatMap(b=>b.sourceIds),
  ...(mrSources.length===1?[mrSources[0].id]:[])])].filter(id=>activeSources.has(id));
 for(const owner of owners){
  const old=oldBindings.find(b=>b.lineId===owner.id);
  next=saveBidVolumeRecord0550(next,'bindings',{...(old||blankScheduleBinding0550(owner.id)),id:old?.id||owner.id,
   schedule:owner.schedule,summary:owner.summary,treatment:'BASE',sourceIds,locator:sourceBasis,
   basis:owner.id===ojtId?'Owner-approved budget draft / Myanmar OJT':'Owner-approved budget draft / Thailand classroom training in Initial Contract Price',
   hoursPerDay:null},today);
 }
 return next;
}
