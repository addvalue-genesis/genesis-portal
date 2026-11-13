// Local development bridge. Private evidence never enters the public bundle.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sourceLimits = require('../src/project0550/data/sourceWorkspaceLimits0550.json');
const ENDPOINT = '/api/local/pj2608-0550/source-intake';
const WORKSPACE_ENDPOINT = '/api/local/pj2608-0550/source-workspace';
const VENDOR_ENDPOINT = '/api/local/pj2608-0550/vendor-registers';
const C8_ENDPOINT = '/api/local/pj2608-0550/c8-calloff';
const C8_FILE = 'PJ2608-0550_C8_CallOff.json';
const MAX_VENDOR_BYTES = 4 * 1024 * 1024, MAX_VENDOR_RESPONSE_BYTES = 16 * 1024 * 1024;
const MAX_BYTES = sourceLimits.sourceBytes;
// Exact predecessor snapshots are retained in the next reading continuation.
// Bound preparation separately; source-only32 MiB and Vendor limits stay fixed.
const MAX_PREPARATION_BYTES = sourceLimits.preparationBytes;
const MAX_WORKSPACE_BYTES = MAX_BYTES + MAX_PREPARATION_BYTES + sourceLimits.responseOverheadBytes;
const PROJECT = /^PJ2608-0550(?:[ _-]|$)/;
const FILENAME = /^PJ2608-0550_Source_Intake_Rev\d+_\d{8}\.json$/;
const PREPARATION_FILE = /^PJ2608-0550_A_Work_Package_(?:Rev\d+_)?\d{8}\.json$/;
const VENDOR_FILE = /^PJ2608-0550_[A-Za-z0-9_-]*Vendor_Register_(?:Rev\d+_)?\d{8}\.json$/;
const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
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
async function discoverProjects({roots = defaultRoots(), projectDir = process.env.GENESIS_0550_PROJECT_DIR, scanAllRoots = false} = {}) {
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
    if(projects.length&&!scanAllRoots)break;
  }
  return [...new Set(projects)];
}
async function readJson(file, maxBytes = MAX_BYTES) {
  const handle=await fs.open(file,'r');
  try {
    const stat=await handle.stat();
    if(!stat.isFile() || stat.size>maxBytes) throw fail('SOURCE_FILE_TOO_LARGE');
    // Bounded read also protects against a file growing during cloud sync.
    const buffer=Buffer.alloc(maxBytes+1);let size=0;
    while(size<buffer.length) {const r=await handle.read(buffer,size,buffer.length-size,null);if(!r.bytesRead)break;size+=r.bytesRead;}
    if(size>maxBytes)throw fail('SOURCE_FILE_TOO_LARGE');
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
  const row=await readJson(file,MAX_PREPARATION_BYTES),p=row.intake;
  if(p.projectId!=='PJ2608-0550'||!['genesis.0550.si-work-package.v2','genesis.0550.si-work-package.v3','genesis.0550.si-work-package.v4','genesis.0550.si-work-package.v5'].includes(p.schema)||Buffer.byteLength(row.body)>MAX_PREPARATION_BYTES)throw fail('A_PREPARATION_FILE_INVALID');
  if(p.sourceBatchId!==latest.intake.batchId)continue;
  if(typeof p.preparedOn!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(p.preparedOn)||!Number.isFinite(Date.parse(p.preparedOn))||new Date(p.preparedOn).toISOString().slice(0,10)!==p.preparedOn)throw fail('A_PREPARATION_FILE_INVALID');
  matches.push(row);
 }
 matches.sort((a,b)=>b.intake.preparedOn.localeCompare(a.intake.preparedOn));
 const latestDate=matches[0]?.intake.preparedOn;
 const peers=matches.filter(r=>r.intake.preparedOn===latestDate);
 const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
 // Same-day continuation is ordered only by its exact embedded predecessor,
 // never filename/revision/upload time. Diverging candidates remain a conflict.
 const ancestor=(child,parent)=>{let p=child.intake;for(let n=0;n<sourceLimits.maxAncestors&&p?.predecessor;n++){if(canonical(p.predecessor)===canonical(parent.intake))return true;p=p.predecessor;}return false;};
 const tips=peers.filter(r=>peers.every(other=>r.hash===other.hash||ancestor(r,other)));
 const chosen=tips[0];
 if(peers.length&&(!chosen||tips.some(r=>r.hash!==chosen.hash)))throw fail('A_PREPARATION_CONFLICT',409);
 if(chosen&&matches.some(r=>r.intake.batchId===chosen.intake.batchId&&r.hash!==chosen.hash))throw fail('A_PREPARATION_CONFLICT',409);
 const body=JSON.stringify({schema:'genesis.0550.source-workspace.v1',sourceIntake:latest.intake,aWorkPackage:chosen?.intake||null});
 if(Buffer.byteLength(body)>MAX_WORKSPACE_BYTES)throw fail('SOURCE_FILE_TOO_LARGE');
 return body;
}
// Vendor evidence is independent of the CUS/A batch. Read every prepared quote,
// not just a newest date; existing importer controls revisions and preserves edits.
async function vendorFiles(projects){
 const files=[];
 for(const project of projects){
  const dir=path.join(project,'90_SYSTEM_WORKING','DATA');let entries;
  try{entries=await fs.readdir(dir,{withFileTypes:true});}catch(e){if(e.code==='ENOENT')continue;throw fail('DRIVE_UNREADABLE');}
  files.push(...entries.filter(e=>e.isFile()&&VENDOR_FILE.test(e.name)).map(e=>path.join(dir,e.name)));
 }
 return files;
}
async function loadDriveVendorRegisters(options){
 let projects=await discoverProjects(options),files=await vendorFiles(projects);
 // An older explicit CUS root must not hide a newly synced Vendor package in
 // the normal project mount. Leave CUS/A override behaviour unchanged.
 if(!files.length&&(options?.projectDir||process.env.GENESIS_0550_PROJECT_DIR)){
  projects=[...new Set([...projects,...await discoverProjects({...options,projectDir:null})])];
  files=await vendorFiles(projects);
 }
 if(!projects.length)throw fail('VENDOR_REGISTER_NOT_FOUND',404);
 if(files.length>100)throw fail('VENDOR_REGISTER_FILE_LIMIT');
 const packages=new Map();let total=0;
 for(const file of files.sort()){
  let row;try{row=await readJson(file,MAX_VENDOR_BYTES);}catch(e){throw fail(e.code?.replace(/^SOURCE_/,'VENDOR_REGISTER_')||'DRIVE_UNREADABLE',e.status||503);}
  const p=row.intake;
  if(!p||p.schema!=='genesis.0550.vendor-register.v1'||p.projectId!=='PJ2608-0550'||typeof p.batchId!=='string'||!/^\w[\w.-]{0,99}$/.test(p.batchId)||typeof p.preparedOn!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(p.preparedOn)||!Number.isFinite(Date.parse(p.preparedOn))||new Date(p.preparedOn).toISOString().slice(0,10)!==p.preparedOn||!Array.isArray(p.vendors)||!Array.isArray(p.offers))throw fail('VENDOR_REGISTER_FILE_INVALID');
  const body=canonical(p),prior=packages.get(p.batchId);
  if(prior&&prior.body!==body)throw fail('VENDOR_REGISTER_BATCH_CONFLICT',409);
  if(!prior){total+=Buffer.byteLength(body);if(total>MAX_VENDOR_RESPONSE_BYTES)throw fail('VENDOR_REGISTER_FILE_TOO_LARGE');packages.set(p.batchId,{body,pack:p});}
 }
 const ordered=[...packages.values()].map(r=>r.pack).sort((a,b)=>a.preparedOn.localeCompare(b.preparedOn)||a.batchId.localeCompare(b.batchId));
 const body=JSON.stringify({schema:'genesis.0550.vendor-registers.v1',projectId:'PJ2608-0550',packages:ordered});
 if(Buffer.byteLength(body)>MAX_VENDOR_RESPONSE_BYTES+1024)throw fail('VENDOR_REGISTER_FILE_TOO_LARGE');
 return body;
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
async function loadDriveC8Calloff(options){
 const projects=await discoverProjects(options),visited=new Set(),bodies=new Set();
 const collect=async candidates=>{
  for(const project of candidates){
   if(visited.has(project))continue;
   visited.add(project);
   try{
    const {intake}=await readJson(path.join(project,'90_SYSTEM_WORKING','DATA',C8_FILE),16384);
    if(intake?.schema!=='genesis.0550.c8-calloff.v1'||intake.projectId!=='PJ2608-0550')throw fail('C8_CALLOFF_DATA_INVALID');
    bodies.add(canonical(intake));
   }catch(e){if(e.code!=='ENOENT')throw e;}
  }
 };
 await collect(projects);
 if(!bodies.size)await collect(await discoverProjects({...options,projectDir:null,scanAllRoots:true}));
 if(!bodies.size)throw fail('C8_CALLOFF_NOT_FOUND',404);
 if(bodies.size>1)throw fail('C8_CALLOFF_DATA_CONFLICT',409);
 return [...bodies][0];
}
function createMiddleware(loader=()=>loadDriveIntake(),workspaceLoader=()=>loadDriveSourceWorkspace(),vendorLoader=()=>loadDriveVendorRegisters(),c8Loader=()=>loadDriveC8Calloff()) {
  const pending=new Map();
  return async(req,res,next)=>{
    const endpoint=req.url.split('?')[0];
    if(![ENDPOINT,WORKSPACE_ENDPOINT,VENDOR_ENDPOINT,C8_ENDPOINT].includes(endpoint))return next();
    res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
    if(!permitted(req)){res.statusCode=403;return res.end(JSON.stringify({code:'LOCAL_ACCESS_ONLY'}));}
    if(req.method!=='GET'){res.statusCode=405;return res.end(JSON.stringify({code:'METHOD_NOT_ALLOWED'}));}
    try {
      if(!pending.has(endpoint))pending.set(endpoint,(endpoint===ENDPOINT?loader:endpoint===WORKSPACE_ENDPOINT?workspaceLoader:endpoint===VENDOR_ENDPOINT?vendorLoader:c8Loader)().finally(()=>pending.delete(endpoint)));
      res.end(await pending.get(endpoint));
    }catch(e){res.statusCode=e.status||503;res.end(JSON.stringify({code:e.status?e.code:'DRIVE_UNREADABLE'}));}
  };
}
module.exports={ENDPOINT,WORKSPACE_ENDPOINT,VENDOR_ENDPOINT,C8_ENDPOINT,MAX_BYTES,MAX_PREPARATION_BYTES,MAX_WORKSPACE_BYTES,MAX_VENDOR_BYTES,MAX_VENDOR_RESPONSE_BYTES,batchKey,discoverProjects,loadDriveIntake,loadDriveSourceWorkspace,loadDriveVendorRegisters,loadDriveC8Calloff,createMiddleware,permitted};
