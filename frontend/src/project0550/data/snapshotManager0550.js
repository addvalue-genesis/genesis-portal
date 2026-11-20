// Immutable Full-State Snapshot Repository & Version Manager for PJ2608-0550
import initialRegistry from '../snapshots/registry.json';
import int00Snapshot from '../snapshots/INT-00.json';
import scheduleC2Master from './scheduleC2Master0550.json';
import {
 DEFAULT_REVISION_HISTORY_0550,
 customerRevisionHistory0550,
 formatPttepFileName0550,
 isInternalPttepRevision0550,
} from './pttepDocControl0550';

export const SNAPSHOT_SCHEMA_0550='genesis.0550.full-state-snapshot.v1';
const STORAGE_KEY='GENESIS-PJ2608-0550-SNAPSHOTS-V1';

const bangkokTimestamp=(d=new Date())=>{
 const tz=new Date(d.getTime()+7*3600*1000);
 return tz.toISOString().slice(0,19)+'+07:00';
};
const bangkokFileStamp=(d=new Date())=>{
 const tz=new Date(d.getTime()+7*3600*1000);
 const p=tz.toISOString().replace(/[-:]/g,'');
 return p.slice(0,8)+'-'+p.slice(9,13);
};

function readStore(){
 const seeded={
  registry:initialRegistry,
  snapshots:{[int00Snapshot.pttepDocControl.revCode]:int00Snapshot},
 };
 if(typeof localStorage==='undefined')return seeded;
 try{
  const raw=localStorage.getItem(STORAGE_KEY);
  if(!raw)return seeded;
  const parsed=JSON.parse(raw);
  if(!parsed?.registry?.revisions||!parsed?.snapshots)return seeded;
  return {
   registry:{...initialRegistry,...parsed.registry,revisions:mergeRevisions(initialRegistry.revisions,parsed.registry.revisions)},
   snapshots:{...seeded.snapshots,...parsed.snapshots},
  };
 }catch{
  return seeded;
 }
}

function mergeRevisions(baseList=[],extraList=[]){
 const byRev=new Map();
 for(const r of [...baseList,...extraList])if(r?.revCode&&!byRev.has(r.revCode))byRev.set(r.revCode,r);
 return [...byRev.values()];
}

function writeStore(store){
 if(typeof localStorage==='undefined')return;
 try{
  localStorage.setItem(STORAGE_KEY,JSON.stringify(store));
 }catch{
  // Ignore quota errors cleanly; in-memory return still succeeds.
 }
}

export function listSnapshotRevisions0550(){
 return readStore().registry.revisions;
}

export function getSnapshotByRev0550(revCode){
 const store=readStore();
 return store.snapshots[revCode]||null;
}

export function nextInternalRevCode0550(revisions=listSnapshotRevisions0550()){
 const nums=revisions
  .map(r=>String(r.revCode||'').match(/^INT-(\d{2})$/i))
  .filter(Boolean)
  .map(m=>Number(m[1]));
 const next=(nums.length?Math.max(...nums):-1)+1;
 return 'INT-'+String(next).padStart(2,'0');
}

export function buildFullStateSnapshot0550({
 data,
 model,
 view,
 revCode,
 purposeOfIssue='Internal IDC / WIP',
 changeNote='',
 gitCommit='HEAD',
}={}){
 const now=new Date();
 const stamp=bangkokFileStamp(now);
 const savedAt=bangkokTimestamp(now);
 const code=revCode||nextInternalRevCode0550();
 const internal=isInternalPttepRevision0550(code);
 const fileName=formatPttepFileName0550({
  docType:'MTO',
  rev:code,
  ext:'json',
  internal,
  timestamp:internal?stamp:'',
 });
 const workingB5=(model?.lines||data?.lines||[])
  .filter(l=>l.wbs==='B5')
  .map(l=>({id:l.id,systemToken:l.systemToken,description:l.description,quantity:l.quantity,unit:l.unit,currency:l.currency,manualCost:l.manualCost,sellRate:l.sellRate,selected:l.selected}));
 const schedulesC1ToC8={};
 for(const id of ['C1','C2','C3','C4','C5','C6','C7','C8']){
  const rows=view?.scheduleRows?.(id)||[];
  schedulesC1ToC8[id]={
   rowCount:rows.length,
   rows:rows.map(b=>({
    lineId:b.lineId,
    systemToken:b.line?.systemToken||'COMMON',
    description:b.line?.description||'',
    quantity:b.quantity??null,
    unit:b.unit||'',
    unitPrice:b.unitPrice??null,
    amount:b.amount??null,
    deliveryTerm:b.deliveryTerm||'',
    treatment:b.treatment||'BASE',
   })),
   ...(id==='C2'?{scheduleC2Master}:{}),
  };
 }
 const existingHistory=Array.isArray(data?.revisionHistory)&&data.revisionHistory.length?data.revisionHistory:DEFAULT_REVISION_HISTORY_0550;
 const newHistoryEntry={
  rev:code,
  purpose:purposeOfIssue,
  date:savedAt.slice(0,10),
  description:changeNote||'Snapshot saved',
  prepared:'SI / Commercial',
  checked:'Review Pending',
  approved:internal?'Internal WIP':'Issued',
 };
 return {
  schema:SNAPSHOT_SCHEMA_0550,
  projectId:'PJ2608-0550',
  pttepDocControl:{
   documentNo:'MM-ASK-00-GEN-TEQ-TEL-MTO-0001',
   revCode:code,
   purposeOfIssue,
   fileName,
   savedAt,
   gitCommit,
   changeNote:changeNote||'Snapshot saved',
  },
  siEquationsAndInputs:{
   fxRates:data?.fx||{thbPerUSD:31.5},
   pricingRules:{
    standard:'5% + 5% + 20% (E10/E11/E12 + E13 Prime)',
    dmrCeragon:'Ceragon R11/R12 whole-link & ODU custom rule',
    pagaIndustronic:'INDUSTRONIC A20261632-005 EUR custom rule',
    telecomTower:'Master Tower goods 30%/20%, erection 30%/5%',
   },
   workingB5Spares:workingB5,
   calculationsCount:(data?.calculations||[]).length,
  },
  scheduleA1Baseline:{
   c1CeilingUsd:4649195.28,
   baseSubtotalUsd:5569206.5,
   a1DirectItems:(view?.bindings||[]).filter(b=>b.schedule==='A1'||b.treatment==='BASE').slice(0,25).map(b=>({
    lineId:b.lineId,
    schedule:b.schedule,
    amount:b.amount??null,
   })),
  },
  schedulesC1ToC8,
  bidTechnicalAndFlags:{
   technical:data?.bidVolumes?.technical||[],
   vdrl:data?.bidVolumes?.vdrl||[],
   commercialDeviations:data?.bidVolumes?.commercialDeviations||[],
   reviewFlags:(view?.problems||[]).slice(0,50),
  },
  revisionHistory:[...existingHistory.filter(r=>r.rev!==code),newHistoryEntry],
 };
}

export function saveNewSnapshotRevision0550(params){
 const snapshot=buildFullStateSnapshot0550(params);
 const store=readStore();
 const rev=snapshot.pttepDocControl.revCode;
 if(store.snapshots[rev])throw Error(`Revision ${rev} already exists and is immutable.`);
 const entry={
  revCode:rev,
  purposeOfIssue:snapshot.pttepDocControl.purposeOfIssue,
  fileName:snapshot.pttepDocControl.fileName,
  savedAt:snapshot.pttepDocControl.savedAt,
  gitCommit:snapshot.pttepDocControl.gitCommit,
  changeNote:snapshot.pttepDocControl.changeNote,
  imported:false,
  immutable:true,
 };
 const next={
  registry:{
   ...store.registry,
   activeRevision:rev,
   revisions:[...store.registry.revisions,entry],
  },
  snapshots:{...store.snapshots,[rev]:snapshot},
 };
 writeStore(next);
 return {snapshot,registry:next.registry};
}

export function sanitizeSnapshotForCustomer0550(snapshot,customerRev='A1'){
 if(!snapshot)return null;
 const fileName=formatPttepFileName0550({docType:'MTO',rev:customerRev,ext:'json',internal:false});
 const cleanC2=snapshot.schedulesC1ToC8?.C2?{
  ...snapshot.schedulesC1ToC8.C2,
  scheduleC2Master:snapshot.schedulesC1ToC8.C2.scheduleC2Master?{
   ...snapshot.schedulesC1ToC8.C2.scheduleC2Master,
   appendices:snapshot.schedulesC1ToC8.C2.scheduleC2Master.appendices.map(app=>({
    ...app,
    systems:app.systems.map(sys=>({
     ...sys,
     entries:sys.entries.map(({internalAudit,...pub})=>pub),
    })),
   })),
  }:undefined,
 }:undefined;
 return {
  schema:SNAPSHOT_SCHEMA_0550,
  projectId:snapshot.projectId||'PJ2608-0550',
  pttepDocControl:{
   documentNo:snapshot.pttepDocControl?.documentNo||'MM-ASK-00-GEN-TEQ-TEL-MTO-0001',
   revCode:customerRev,
   purposeOfIssue:snapshot.pttepDocControl?.purposeOfIssue||'Issued for Review',
   fileName,
   savedAt:snapshot.pttepDocControl?.savedAt||bangkokTimestamp(),
  },
  schedulesC1ToC8:{
   ...(snapshot.schedulesC1ToC8||{}),
   ...(cleanC2?{C2:cleanC2}:{}),
  },
  bidTechnicalAndFlags:{
   technical:snapshot.bidTechnicalAndFlags?.technical||[],
   vdrl:snapshot.bidTechnicalAndFlags?.vdrl||[],
   commercialDeviations:snapshot.bidTechnicalAndFlags?.commercialDeviations||[],
  },
  revisionHistory:customerRevisionHistory0550(snapshot.revisionHistory),
 };
}

export function downloadSnapshotJson0550(snapshot,{customer=false,customerRev='A1'}={}){
 const payload=customer?sanitizeSnapshotForCustomer0550(snapshot,customerRev):snapshot;
 const fileName=payload?.pttepDocControl?.fileName||'MM-ASK-00-GEN-TEQ-TEL-MTO-0001.json';
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');
 a.href=url;a.download=fileName;a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 return fileName;
}

const REQUIRED_KEYS=['schema','projectId','pttepDocControl','schedulesC1ToC8','revisionHistory'];
export function validateAndImportSnapshotJson0550(jsonText){
 let parsed;
 try{parsed=JSON.parse(jsonText);}catch{throw Error('Invalid JSON file.');}
 if(!parsed||typeof parsed!=='object')throw Error('Snapshot JSON must be an object.');
 for(const key of REQUIRED_KEYS)if(!Object.hasOwn(parsed,key))throw Error(`Missing required snapshot key: ${key}`);
 if(parsed.schema!==SNAPSHOT_SCHEMA_0550)throw Error(`Unsupported snapshot schema: ${parsed.schema}`);
 const baseRev=String(parsed.pttepDocControl?.revCode||'IMPORTED').trim();
 const store=readStore();
 let revCode=baseRev;
 if(store.snapshots[revCode])revCode=`${baseRev}-IMP-${bangkokFileStamp()}`;
 const importedSnapshot={...parsed,pttepDocControl:{...parsed.pttepDocControl,revCode,imported:true}};
 const entry={
  revCode,
  purposeOfIssue:importedSnapshot.pttepDocControl.purposeOfIssue||'Imported Snapshot',
  fileName:importedSnapshot.pttepDocControl.fileName||`${revCode}.json`,
  savedAt:importedSnapshot.pttepDocControl.savedAt||bangkokTimestamp(),
  gitCommit:importedSnapshot.pttepDocControl.gitCommit||'IMPORTED',
  changeNote:`[IMPORTED] ${importedSnapshot.pttepDocControl.changeNote||'External JSON import'}`,
  imported:true,
  immutable:true,
 };
 const next={
  registry:{...store.registry,revisions:[...store.registry.revisions,entry]},
  snapshots:{...store.snapshots,[revCode]:importedSnapshot},
 };
 writeStore(next);
 return {snapshot:importedSnapshot,registry:next.registry};
}

export function createPreRestoreBackup0550(params){
 const base=nextInternalRevCode0550();
 const revCode=`${base}-PRE-RESTORE`;
 return saveNewSnapshotRevision0550({
  ...params,
  revCode,
  purposeOfIssue:'Pre-Restore Safety Backup',
  changeNote:`Automatic safety backup before restoring ${params.targetRev||'historical snapshot'}`,
 });
}
