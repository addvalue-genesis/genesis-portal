import {roundMoney0550,sumMoney0550} from './money0550';

export const COST_IMPACT_SCHEMA_0550='genesis.0550.cost-impact-revisions.v1';
export const COST_IMPACT_SCHEDULES_0550=['C1','C2','C3','C4','C5','C6','C7','C8','A2'];

/**
 * Immutable submitted Schedule A1 baseline (Rev00 — Schedule A1 Freeze).
 * Locked figures cannot be modified or unlocked by Working edits or UI actions.
 */
export const REV00_BASELINE_0550=Object.freeze({
 revision:'Rev00',
 label:'Rev00 — Schedule A1 Freeze',
 createdAt:'2026-11-16T00:00:00Z',
 note:'Submitted Schedule A1 Freeze baseline: 1. GOODS / Form C-1 = USD 4,649,195.28; Total Base Working Subtotal = USD 5,569,206.50; 237/344 priced, 107 OPEN.',
 immutable:true,
 goodsC1CeilingUSD:4649195.28,
 totalBaseWorkingSubtotalUSD:5569206.50,
 pricedCount:237,
 totalCount:344,
 openCount:107,
 items:Object.freeze([]),
});

const WBS_TO_DEFAULT_SCHEDULE={
 A:'C1',
 B5:'C2',
 C3:'C3',
 C2:'C4',
 B6:'C5',
 C1:'A2',
 B3:'C7',
 B4:'C7',
 B7:'C7',
};

function computeLineCostUSD(data,modelLine){
 if(!modelLine)return null;
 const costTHB=Number.isFinite(modelLine.costTHB)?modelLine.costTHB:Number.isFinite(modelLine.provisionalCostTHB)?modelLine.provisionalCostTHB:null;
 const usdRate=data?.fx?.thbPerUSD>0?data.fx.thbPerUSD:null;
 if(costTHB!==null&&usdRate!==null)return roundMoney0550(costTHB/usdRate);
 if(modelLine.currency==='USD'&&Number.isFinite(modelLine.provisionalCostNative))return roundMoney0550(modelLine.provisionalCostNative);
 return null;
}

/**
 * Extracts normalized per-line cost & sell figures across A2 and C1-C8
 * (including all 19 systems + COMMON in 11.C1) from the current Working view.
 */
export function extractWorkingCostImpactItems0550(data,model,displayView){
 const modelById=new Map((model?.lines||[]).map(l=>[l.id,l]));
 const items=[];
 const seenIds=new Set();

 for(const b of (displayView?.bindings||[])){
  if(!COST_IMPACT_SCHEDULES_0550.includes(b.schedule)||b.nonAdditive||!b.lineId)continue;
  if(seenIds.has(b.lineId))continue;
  seenIds.add(b.lineId);
  const mLine=modelById.get(b.lineId);
  const costUSD=computeLineCostUSD(data,mLine);
  const sellUSD=Number.isFinite(b.amount)?roundMoney0550(b.amount):null;
  items.push({
   id:b.lineId,
   schedule:b.schedule,
   treatment:b.treatment||(b.schedule==='A2'?'OPTION':'BASE'),
   systemToken:b.line?.systemToken||mLine?.systemToken||'COMMON',
   description:b.line?.description||mLine?.description||b.summary||b.lineId,
   mrRef:b.line?.mrRequirementId||mLine?.mrRequirementId||b.locator||'',
   quantity:b.quantity??mLine?.quantity??null,
   unit:b.unit||mLine?.unit||'',
   costUSD,
   sellUSD,
   status:sellUSD!==null?'PRICED':'OPEN',
  });
 }

 for(const mLine of (model?.lines||[])){
  if(!mLine.selected||mLine.mrScopeState?.covered||mLine.mrScopeState?.excluded||mLine.satelliteScopeState?.excluded)continue;
  if(seenIds.has(mLine.id))continue;
  const schedule=WBS_TO_DEFAULT_SCHEDULE[mLine.wbs];
  if(!schedule||!COST_IMPACT_SCHEDULES_0550.includes(schedule))continue;
  seenIds.add(mLine.id);
  const costUSD=computeLineCostUSD(data,mLine);
  const sellUSD=Number.isFinite(mLine.customerUSD)?roundMoney0550(mLine.customerUSD):Number.isFinite(mLine.provisionalCustomerUSD)?roundMoney0550(mLine.provisionalCustomerUSD):null;
  items.push({
   id:mLine.id,
   schedule,
   treatment:mLine.wbs.startsWith('C')?'OPTION':'BASE',
   systemToken:mLine.systemToken||'COMMON',
   description:mLine.description||mLine.id,
   mrRef:mLine.mrRequirementId||'',
   quantity:mLine.quantity??null,
   unit:mLine.unit||'',
   costUSD,
   sellUSD,
   status:sellUSD!==null?'PRICED':'OPEN',
  });
 }

 const c1Items=items.filter(i=>i.schedule==='C1');
 const baseItems=items.filter(i=>i.treatment==='BASE');
 const goodsC1SellUSD=sumMoney0550(c1Items.filter(i=>i.sellUSD!==null).map(i=>i.sellUSD));
 const totalBaseWorkingSubtotalUSD=sumMoney0550(baseItems.filter(i=>i.sellUSD!==null).map(i=>i.sellUSD));
 const pricedCount=items.filter(i=>i.status==='PRICED').length;
 const totalCount=items.length;
 const openCount=totalCount-pricedCount;

 return {
  items,
  summary:{
   goodsC1SellUSD,
   totalBaseWorkingSubtotalUSD,
   pricedCount,
   totalCount,
   openCount,
  },
 };
}

export function getCostImpactRevisions0550(data){
 const stored=data?.costImpactRevisions?.revisions||[];
 const storedRev00=stored.find(r=>r.revision==='Rev00');
 const rev00={
  ...REV00_BASELINE_0550,
  items:storedRev00?.items?.length?storedRev00.items:REV00_BASELINE_0550.items,
  lineSnapshotLocked:Boolean(storedRev00?.items?.length),
 };
 const promoted=stored.filter(r=>r.revision!=='Rev00');
 return [rev00,...promoted];
}

export function nextRevisionCode0550(revisions){
 const nums=revisions.map(r=>Number(String(r.revision||'').replace(/^Rev/i,''))).filter(Number.isFinite);
 const next=(nums.length?Math.max(...nums):0)+1;
 return 'Rev'+String(next).padStart(2,'0');
}

/**
 * Compares the selected baseline revision against Current Working across A2 and C1-C8
 * (and breaks down all 19 systems + COMMON in 11.C1).
 */
export function compareCostImpact0550({baselineRev,currentSnapshot,systems=[]}){
 const baseItems=baselineRev?.items||[];
 const hasLineBaseline=baseItems.length>0;
 const baseById=new Map(baseItems.map(i=>[i.id,i]));
 const currById=new Map((currentSnapshot?.items||[]).map(i=>[i.id,i]));
 const allIds=new Set([...baseById.keys(),...currById.keys()]);

 const rows=[];
 for(const id of allIds){
  const b=baseById.get(id)||null;
  const c=currById.get(id)||null;
  const schedule=c?.schedule||b?.schedule||'C1';
  const systemToken=c?.systemToken||b?.systemToken||'COMMON';
  const description=c?.description||b?.description||id;
  const mrRef=c?.mrRef||b?.mrRef||'';
  const quantity=c?.quantity??b?.quantity??null;
  const unit=c?.unit||b?.unit||'';

  const baselineCostUSD=hasLineBaseline?(b?.costUSD??null):(c?.costUSD??null);
  const currentCostUSD=c?.costUSD??null;
  const internalCostImpactUSD=(baselineCostUSD!==null&&currentCostUSD!==null)
   ?roundMoney0550(baselineCostUSD-currentCostUSD)
   :null;

  const baselineSellUSD=hasLineBaseline?(b?.sellUSD??null):(c?.sellUSD??null);
  const currentSellUSD=c?.sellUSD??null;
  const sellVarianceUSD=(baselineSellUSD!==null&&currentSellUSD!==null)
   ?roundMoney0550(currentSellUSD-baselineSellUSD)
   :null;

  const changed=hasLineBaseline
   ?(Math.abs(internalCostImpactUSD||0)>=0.01||Math.abs(sellVarianceUSD||0)>=0.01||b===null||c===null||b.status!==c.status)
   :false;

  rows.push({
   id,
   schedule,
   treatment:c?.treatment||b?.treatment||'BASE',
   systemToken,
   description,
   mrRef,
   quantity,
   unit,
   baselineCostUSD,
   currentCostUSD,
   internalCostImpactUSD,
   baselineSellUSD,
   currentSellUSD,
   sellVarianceUSD,
   baselineStatus:b?.status||(hasLineBaseline?'REMOVED':'UNLOCKED'),
   currentStatus:c?.status||'REMOVED',
   changed,
  });
 }

 const scheduleOrder=new Map(COST_IMPACT_SCHEDULES_0550.map((s,i)=>[s,i]));
 rows.sort((a,b)=>(scheduleOrder.get(a.schedule)??99)-(scheduleOrder.get(b.schedule)??99)||a.systemToken.localeCompare(b.systemToken)||a.id.localeCompare(b.id));

 const netCostImpactUSD=roundMoney0550(sumMoney0550(rows.map(r=>r.internalCostImpactUSD).filter(Number.isFinite)));
 const currentC1SellUSD=currentSnapshot?.summary?.goodsC1SellUSD??0;
 const c1CeilingUSD=baselineRev?.goodsC1CeilingUSD??REV00_BASELINE_0550.goodsC1CeilingUSD;
 const c1CeilingGapUSD=roundMoney0550(currentC1SellUSD-c1CeilingUSD);
 const c1Reconciled=Math.abs(c1CeilingGapUSD)<0.01;

 const systemTokens=[...systems.map(s=>s.token),'COMMON'];
 const systemNames=new Map([...systems.map(s=>[s.token,s.name]),['COMMON','Common / Project-Wide']]);
 const c1Rows=rows.filter(r=>r.schedule==='C1');
 const extraTokens=[...new Set(c1Rows.map(r=>r.systemToken))].filter(t=>!systemTokens.includes(t));
 const c1SystemBreakdown=[...systemTokens,...extraTokens].map(token=>{
  const sRows=c1Rows.filter(r=>r.systemToken===token);
  const baseCost=sumMoney0550(sRows.map(r=>r.baselineCostUSD).filter(Number.isFinite));
  const currCost=sumMoney0550(sRows.map(r=>r.currentCostUSD).filter(Number.isFinite));
  const costImpact=roundMoney0550(sumMoney0550(sRows.map(r=>r.internalCostImpactUSD).filter(Number.isFinite)));
  const baseSell=sumMoney0550(sRows.map(r=>r.baselineSellUSD).filter(Number.isFinite));
  const currSell=sumMoney0550(sRows.map(r=>r.currentSellUSD).filter(Number.isFinite));
  const sellVar=roundMoney0550(sumMoney0550(sRows.map(r=>r.sellVarianceUSD).filter(Number.isFinite)));
  return {
   systemToken:token,
   systemName:systemNames.get(token)||token,
   itemCount:sRows.length,
   openCount:sRows.filter(r=>r.currentStatus==='OPEN').length,
   baselineCostUSD:baseCost,
   currentCostUSD:currCost,
   internalCostImpactUSD:costImpact,
   baselineSellUSD:baseSell,
   currentSellUSD:currSell,
   sellVarianceUSD:sellVar,
  };
 });

 return {
  hasLineBaseline,
  rows,
  changedCount:rows.filter(r=>r.changed).length,
  netCostImpactUSD,
  currentC1SellUSD,
  c1CeilingUSD,
  c1CeilingGapUSD,
  c1Reconciled,
  remainingOpenCount:currentSnapshot?.summary?.openCount??0,
  pricedCount:currentSnapshot?.summary?.pricedCount??0,
  totalCount:currentSnapshot?.summary?.totalCount??0,
  c1SystemBreakdown,
 };
}

function sanitizeSnapshotItems(items){
 return (items||[]).map(i=>({
  id:String(i.id),
  schedule:String(i.schedule),
  treatment:String(i.treatment||'BASE'),
  systemToken:String(i.systemToken||'COMMON'),
  description:String(i.description||'').slice(0,400),
  mrRef:String(i.mrRef||'').slice(0,200),
  quantity:Number.isFinite(i.quantity)?i.quantity:null,
  unit:String(i.unit||'').slice(0,40),
  costUSD:Number.isFinite(i.costUSD)?roundMoney0550(i.costUSD):null,
  sellUSD:Number.isFinite(i.sellUSD)?roundMoney0550(i.sellUSD):null,
  status:i.status==='PRICED'?'PRICED':'OPEN',
 }));
}

export function lockRev00Items0550(data,currentSnapshot,nowIso=new Date().toISOString()){
 const existing=data?.costImpactRevisions?.revisions||[];
 const existingRev00=existing.find(r=>r.revision==='Rev00');
 if(existingRev00?.items?.length)return data;
 const rev00={
  ...REV00_BASELINE_0550,
  createdAt:nowIso,
  items:sanitizeSnapshotItems(currentSnapshot?.items),
 };
 return {
  ...data,
  costImpactRevisions:{
   schema:COST_IMPACT_SCHEMA_0550,
   activeBaselineRev:data?.costImpactRevisions?.activeBaselineRev||'Rev00',
   revisions:[rev00,...existing.filter(r=>r.revision!=='Rev00')],
  },
 };
}

export function promoteCostImpactRevision0550(data,currentSnapshot,note='',nowIso=new Date().toISOString()){
 const withRev00=lockRev00Items0550(data,currentSnapshot,nowIso);
 const existing=withRev00.costImpactRevisions.revisions;
 const nextRev=nextRevisionCode0550(existing);
 const entry={
  revision:nextRev,
  label:`${nextRev} — SAMTEL Submission Baseline`,
  createdAt:nowIso,
  note:String(note||'').trim()||`Promoted from Current Working to ${nextRev}`,
  immutable:true,
  goodsC1CeilingUSD:roundMoney0550(currentSnapshot?.summary?.goodsC1SellUSD||0),
  totalBaseWorkingSubtotalUSD:roundMoney0550(currentSnapshot?.summary?.totalBaseWorkingSubtotalUSD||0),
  pricedCount:currentSnapshot?.summary?.pricedCount||0,
  totalCount:currentSnapshot?.summary?.totalCount||0,
  openCount:currentSnapshot?.summary?.openCount||0,
  items:sanitizeSnapshotItems(currentSnapshot?.items),
 };
 return {
  ...withRev00,
  costImpactRevisions:{
   schema:COST_IMPACT_SCHEMA_0550,
   activeBaselineRev:nextRev,
   revisions:[...existing,entry],
  },
 };
}

export function validateCostImpactRevisions0550(revisions){
 if(revisions===undefined)return;
 const fail=m=>{throw Error('Cost Impact Revisions: '+m);};
 if(!revisions||typeof revisions!=='object'||Array.isArray(revisions))fail('invalid object');
 if(revisions.schema!==COST_IMPACT_SCHEMA_0550)fail('invalid schema');
 if(typeof revisions.activeBaselineRev!=='string'||!/^Rev\d{2,}$/.test(revisions.activeBaselineRev))fail('invalid activeBaselineRev');
 if(!Array.isArray(revisions.revisions)||revisions.revisions.length>100)fail('invalid revisions array');
 for(const r of revisions.revisions){
  if(!r||typeof r!=='object'||Array.isArray(r))fail('invalid revision entry');
  if(typeof r.revision!=='string'||!/^Rev\d{2,}$/.test(r.revision))fail('invalid revision code');
  if(typeof r.label!=='string'||r.label.length>200)fail('invalid label');
  if(typeof r.createdAt!=='string'||r.createdAt.length>60)fail('invalid createdAt');
  if(typeof r.note!=='string'||r.note.length>2000)fail('invalid note');
  if(r.immutable!==true)fail('revision must be immutable');
  for(const k of ['goodsC1CeilingUSD','totalBaseWorkingSubtotalUSD'])if(typeof r[k]!=='number'||!Number.isFinite(r[k]))fail('invalid '+k);
  for(const k of ['pricedCount','totalCount','openCount'])if(!Number.isSafeInteger(r[k])||r[k]<0)fail('invalid '+k);
  if(!Array.isArray(r.items)||r.items.length>2000)fail('invalid items');
  for(const item of r.items){
   if(!item||typeof item!=='object'||typeof item.id!=='string'||!item.id)fail('invalid item id');
   if(!COST_IMPACT_SCHEDULES_0550.includes(item.schedule))fail('invalid item schedule');
   for(const n of ['quantity','costUSD','sellUSD'])if(item[n]!==null&&(!Number.isFinite(item[n])||typeof item[n]!=='number'))fail('invalid item '+n);
  }
 }
}
