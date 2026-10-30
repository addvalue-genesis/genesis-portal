// Local development bridge. Private evidence never enters the public bundle.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const ENDPOINT = '/api/local/pj2608-0550/source-intake';
const WORKSPACE_ENDPOINT = '/api/local/pj2608-0550/source-workspace';
const MAX_BYTES = 16 * 1024 * 1024;
const PROJECT = /^PJ2608-0550(?:[ _-]|$)/;
const FILENAME = /^PJ2608-0550_Source_Intake_Rev\d+_\d{8}\.json$/;
const PREPARATION_FILE = /^PJ2608-0550_A_Work_Package_(?:Rev\d+_)?\d{8}\.json$/;
const batchKey = value => {
  const m = /^PJ2608-0550-SOURCE-INTAKE-REV(\d+)-(\d{8})$/.exec(value || '');
  return m && {revision:Number(m[1]),date:m[2]};
};
const fail = (code, status = 503) => Object.assign(new Error(code), {code, status});
async function directories(dir) {
  try { return (await fs.readdir(dir,{withFileTypes:true})).filter(e=>e.isDirectory()).map(e=>path.join(dir,e.name)); }
  catch(e) { if(['ENOENT','ENOTDIR'].includes(e.code)) return []; throw fail('DRIVE_UNREADABLE'); }
}
function defaultRoots() {
  return process.platform === 'win32' ? ['N',...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.replace('N','')].map(letter=>letter+':'+path.sep) : [];
}
async function discoverProjects({roots = defaultRoots(), projectDir = process.env.GENESIS_0550_PROJECT_DIR} = {}) {
  if (projectDir) return [path.resolve(projectDir)];
  const projects=[];
  for (const root of roots) {
    // Inspect folder names only, at the Drive Desktop shortcut-target level.
    // No recursive scan of other project contents and no private Drive IDs in code.
    const targets=await directories(path.join(root,'.shortcut-targets-by-id')).catch(()=>[]);
    if(targets.length>2000) throw fail('DRIVE_DISCOVERY_LIMIT');
    for(let i=0;i<targets.length;i+=16) {
      const children=await Promise.all(targets.slice(i,i+16).map(d=>directories(d).catch(()=>[])));
      projects.push(...children.flat().filter(d=>PROJECT.test(path.basename(d))));
    }
    for(const container of [root,path.join(root,'My Drive'),path.join(root,'ไดรฟ์ของฉัน')])
      projects.push(...(await directories(container).catch(()=>[])).filter(d=>PROJECT.test(path.basename(d))));
    // Once the project mount is found, do not probe unrelated drive letters.
    if(projects.length)break;
  }
  return [...new Set(projects)];
}
async function readJson(file) {
  const handle=await fs.open(file,'r');
  try {
    const stat=await handle.stat();
    if(!stat.isFile() || stat.size>MAX_BYTES) throw fail('SOURCE_FILE_TOO_LARGE');
    // Bounded read also protects against a file growing during cloud sync.
    const buffer=Buffer.alloc(MAX_BYTES+1);let size=0;
    while(size<buffer.length) {const r=await handle.read(buffer,size,buffer.length-size,null);if(!r.bytesRead)break;size+=r.bytesRead;}
    if(size>MAX_BYTES)throw fail('SOURCE_FILE_TOO_LARGE');
    const body=buffer.subarray(0,size).toString('utf8').replace(/^\uFEFF/,'');
    let intake;try{intake=JSON.parse(body);}catch{throw fail('SOURCE_FILE_INVALID');}
    return {body,intake,hash:crypto.createHash('sha256').update(body).digest('hex')};
  } finally {await handle.close();}
}
async function readCandidate(file){
 const result=await readJson(file),{intake}=result,key=batchKey(intake.batchId);
 if(intake.projectId!=='PJ2608-0550'||intake.schema!=='genesis.0550.source-intake.v1'||!key||intake.reviewedOn?.replace(/-/g,'')!==key.date||!Array.isArray(intake.sources))throw fail('SOURCE_FILE_INVALID');
 return {...result,key};
}
async function selectDriveIntake(options) {
  const projects=await discoverProjects(options),files=[];
  for(const project of projects) {
    const dir=path.join(project,'90_SYSTEM_WORKING','DATA');
    let entries;try{entries=await fs.readdir(dir,{withFileTypes:true});}catch(e){if(e.code==='ENOENT')continue;throw fail('DRIVE_UNREADABLE');}
    files.push(...entries.filter(e=>e.isFile()&&FILENAME.test(e.name)).map(e=>path.join(dir,e.name)));
  }
  if(!files.length)throw fail('DRIVE_SOURCE_NOT_FOUND',404);
  if(files.length>50)throw fail('SOURCE_FILE_LIMIT');
  const candidates=[];
  for(const file of files) candidates.push(await readCandidate(file));
  candidates.sort((a,b)=>b.key.date.localeCompare(a.key.date)||b.key.revision-a.key.revision);
  const latest=candidates[0];
  if(candidates.some(c=>c.intake.batchId===latest.intake.batchId&&c.hash!==latest.hash))throw fail('SOURCE_BATCH_CONFLICT',409);
  return {latest,projects};
}
async function loadDriveIntake(options){return (await selectDriveIntake(options)).latest.body;}
async function loadDriveSourceWorkspace(options){
 const {latest,projects}=await selectDriveIntake(options),files=[];
 for(const project of projects){
  const dir=path.join(project,'90_SYSTEM_WORKING','DATA');let entries;
  try{entries=await fs.readdir(dir,{withFileTypes:true});}catch(e){if(e.code==='ENOENT')continue;throw fail('DRIVE_UNREADABLE');}
  files.push(...entries.filter(e=>e.isFile()&&PREPARATION_FILE.test(e.name)).map(e=>path.join(dir,e.name)));
 }
 if(files.length>50)throw fail('A_PREPARATION_FILE_LIMIT');
 const matches=[];
 for(const file of files){
  const row=await readJson(file),p=row.intake;
  if(p.projectId!=='PJ2608-0550'||p.schema!=='genesis.0550.si-work-package.v2')throw fail('A_PREPARATION_FILE_INVALID');
  if(p.sourceBatchId!==latest.intake.batchId)continue;
  if(typeof p.preparedOn!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(p.preparedOn)||!Number.isFinite(Date.parse(p.preparedOn))||new Date(p.preparedOn).toISOString().slice(0,10)!==p.preparedOn)throw fail('A_PREPARATION_FILE_INVALID');
  matches.push(row);
 }
 matches.sort((a,b)=>b.intake.preparedOn.localeCompare(a.intake.preparedOn));
 const chosen=matches[0];
 if(chosen&&matches.some(r=>(r.intake.batchId===chosen.intake.batchId||r.intake.preparedOn===chosen.intake.preparedOn)&&r.hash!==chosen.hash))throw fail('A_PREPARATION_CONFLICT',409);
 return JSON.stringify({schema:'genesis.0550.source-workspace.v1',sourceIntake:latest.intake,aWorkPackage:chosen?.intake||null});
}
function permitted(req) {
  if(!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket?.remoteAddress))return false;
  try {
    const host=new URL('http://'+req.headers.host);
    if(host.username||host.password||!['localhost','127.0.0.1','[::1]'].includes(host.hostname))return false;
    if(req.headers.origin && new URL(req.headers.origin).host!==host.host)return false;
    if(req.headers['sec-fetch-site'] && !['same-origin','none'].includes(req.headers['sec-fetch-site']))return false;
    return true;
  }catch{return false;}
}
function createMiddleware(loader=()=>loadDriveIntake(),workspaceLoader=()=>loadDriveSourceWorkspace()) {
  const pending=new Map();
  return async(req,res,next)=>{
    const endpoint=req.url.split('?')[0];
    if(![ENDPOINT,WORKSPACE_ENDPOINT].includes(endpoint))return next();
    res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
    if(!permitted(req)){res.statusCode=403;return res.end(JSON.stringify({code:'LOCAL_ACCESS_ONLY'}));}
    if(req.method!=='GET'){res.statusCode=405;return res.end(JSON.stringify({code:'METHOD_NOT_ALLOWED'}));}
    try {
      if(!pending.has(endpoint))pending.set(endpoint,(endpoint===ENDPOINT?loader:workspaceLoader)().finally(()=>pending.delete(endpoint)));
      res.end(await pending.get(endpoint));
    }catch(e){res.statusCode=e.status||503;res.end(JSON.stringify({code:e.status?e.code:'DRIVE_UNREADABLE'}));}
  };
}
module.exports={ENDPOINT,WORKSPACE_ENDPOINT,MAX_BYTES,batchKey,discoverProjects,loadDriveIntake,loadDriveSourceWorkspace,createMiddleware,permitted};
