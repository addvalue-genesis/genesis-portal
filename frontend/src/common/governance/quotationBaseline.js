// COMMON immutable quotation records + append-only use/selection events.
// This is identity/integrity control, not engineering approval or email delivery.
export const BASELINE_SCHEMA="genesis.quotation-baseline/1";
export const MAX_BACKUP_BYTES=64*1024*1024;
const encoder=new TextEncoder();
export function canonicalJson(value){
 const seen=new Set();
 function encode(x){
  if(x===null||typeof x==="string"||typeof x==="boolean")return JSON.stringify(x);
  if(typeof x==="number"){if(!Number.isFinite(x))throw Error("Nonfinite snapshot value");return JSON.stringify(x);}
  if(typeof x!=="object"||seen.has(x))throw Error("Snapshot must be acyclic JSON");
  seen.add(x);
  if(!Array.isArray(x)&&Object.prototype.toString.call(x)!=="[object Object]")throw Error("Snapshot must contain plain JSON objects");
  const result=Array.isArray(x)?"["+Array.from(x,encode).join(",")+"]":"{"+Object.keys(x).sort().map(k=>JSON.stringify(k)+":"+encode(x[k])).join(",")+"}";
  seen.delete(x);return result;
 }
 return encode(value);
}
export const cloneBaselineJson=value=>JSON.parse(canonicalJson(value));
export function freezeBaseline(value){
 if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freezeBaseline);Object.freeze(value);}return value;
}
export async function sha256(value){
 if(!globalThis.crypto?.subtle)throw Error("SHA-256 requires a secure browser context (localhost/HTTPS)");
 const bytes=typeof value==="string"?encoder.encode(value):value;
 const hash=await globalThis.crypto.subtle.digest("SHA-256",bytes);
 return [...new Uint8Array(hash)].map(n=>n.toString(16).padStart(2,"0")).join("");
}
export const scopeKey=scope=>canonicalJson(scope);
const digest=x=>sha256(canonicalJson(x));
function validScope(scope){
 if(!scope||["projectId","proposalStreamId","recipientGroupId"].some(k=>typeof scope[k]!=="string"||!scope[k].trim()))throw Error("Project, proposal stream and recipient scope required");
}
const sha=s=>typeof s==="string"&&/^[a-f0-9]{64}$/.test(s);
const nonempty=s=>typeof s==="string"&&s.trim().length>0;
function timestamp(s){return typeof s==="string"&&!Number.isNaN(Date.parse(s));}
export function bytesToBase64(bytes){
 let value="";for(let i=0;i<bytes.length;i+=16384)value+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(value);
}
export function base64ToBytes(value){
 if(typeof value!=="string"||value.length>MAX_BACKUP_BYTES*1.4||value.length%4||!/^[A-Za-z0-9+/]*={0,2}$/.test(value))throw Error("Invalid artifact base64");
 return Uint8Array.from(atob(value),c=>c.charCodeAt(0));
}
export async function makeArtifact({id,filename,mimeType,audience,bytes,expectedSha256=null}){
 if(!nonempty(id)||!nonempty(filename)||!nonempty(mimeType)||!["CUSTOMER","INTERNAL"].includes(audience)||!(bytes instanceof Uint8Array)||bytes.length>MAX_BACKUP_BYTES)throw Error("Invalid artifact");
 const hash=await sha256(bytes);
 if(expectedSha256&&hash!==expectedSha256)throw Error("Original workbook hash mismatch; capture stopped");
 return {id,filename,mimeType,audience,sizeBytes:bytes.length,sha256:hash,base64:bytesToBase64(bytes)};
}
const recordPayload=r=>({schema:r.schema,scope:r.scope,label:r.label,createdBy:r.createdBy,createdAt:r.createdAt,snapshot:r.snapshot,artifacts:r.artifacts});
export async function createBaseline({scope,label,actor,createdAt,snapshot,artifacts}){
 validScope(scope);
 if(!nonempty(label)||!nonempty(actor)||!timestamp(createdAt)||!snapshot||!artifacts?.length)throw Error("Label, actor, date, snapshot and exact artifact required");
 const record=cloneBaselineJson({schema:BASELINE_SCHEMA,scope,label:label.trim(),createdBy:actor.trim(),createdAt,snapshot,artifacts});
 record.snapshotHash=await digest(record.snapshot);record.id=await digest(recordPayload(record));
 await verifyBaseline(record);return freezeBaseline(record);
}
export async function verifyBaseline(r){
 validScope(r?.scope);
 if(r.schema!==BASELINE_SCHEMA||!nonempty(r.label)||!nonempty(r.createdBy)||!timestamp(r.createdAt)||!sha(r.id)||!sha(r.snapshotHash)||!r.artifacts?.length)throw Error("Invalid frozen revision");
 if(await digest(r.snapshot)!==r.snapshotHash||await digest(recordPayload(r))!==r.id)throw Error("Frozen revision hash mismatch");
 if(new Set(r.artifacts.map(x=>x.id)).size!==r.artifacts.length)throw Error("Duplicate artifact identity");
 for(const a of r.artifacts){
  if(!nonempty(a.filename)||!nonempty(a.mimeType)||!["CUSTOMER","INTERNAL"].includes(a.audience)||!sha(a.sha256))throw Error("Invalid artifact metadata");
  const bytes=base64ToBytes(a.base64);
  if(bytes.length!==a.sizeBytes||await sha256(bytes)!==a.sha256)throw Error("Artifact hash/size mismatch");
 }
 return true;
}
export function emptyBaselineRegister(scope){validScope(scope);return {schema:BASELINE_SCHEMA,scope:cloneBaselineJson(scope),version:0,records:[],events:[],selectedRevisionId:null,lastUsedRevisionId:null};}
const eventPayload=e=>({type:e.type,revisionId:e.revisionId,snapshotHash:e.snapshotHash,actor:e.actor,recordedAt:e.recordedAt,occurredAt:e.occurredAt,purpose:e.purpose,
 ...(e.type==="DOWNLOAD_STARTED"?{artifactId:e.artifactId,artifactSha256:e.artifactSha256}:{})});
export async function addBaseline(register,record){
 await verifyRegister(register);await verifyBaseline(record);
 if(scopeKey(register.scope)!==scopeKey(record.scope))throw Error("Cross-project/recipient revision rejected");
 if(register.records.some(r=>r.id===record.id))return freezeBaseline(cloneBaselineJson(register));
 return freezeBaseline({...cloneBaselineJson(register),version:register.version+1,records:[...cloneBaselineJson(register.records),cloneBaselineJson(record)]});
}
export async function recordBaselineEvent(register,{type,revisionId,actor,recordedAt,occurredAt=null,purpose,artifactId=null}){
 await verifyRegister(register);
 if(!["SELECTED","OWNER_ATTESTED_USED","DOWNLOAD_STARTED"].includes(type))throw Error("Only selection/use/download supported; no implied sending/acceptance");
 const record=register.records.find(r=>r.id===revisionId);
 if(!record||!nonempty(actor)||!timestamp(recordedAt)||!nonempty(purpose)||(occurredAt!==null&&!/^\d{4}-\d{2}-\d{2}$/.test(occurredAt)))throw Error("Valid revision, actor, purpose and date required");
 if(occurredAt!==null){const d=new Date(occurredAt);if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==occurredAt)throw Error("Invalid usage date");}
 const artifact=type==="DOWNLOAD_STARTED"?record.artifacts.find(a=>a.id===artifactId):null;
 if(type==="DOWNLOAD_STARTED"&&!artifact)throw Error("Download must identify a frozen artifact");
 const event={type,revisionId,snapshotHash:record.snapshotHash,actor:actor.trim(),recordedAt,occurredAt,purpose:purpose.trim(),
  ...(artifact?{artifactId:artifact.id,artifactSha256:artifact.sha256}:{})};event.id=await digest(eventPayload(event));
 if(register.events.some(e=>e.id===event.id))return freezeBaseline(cloneBaselineJson(register));
 return freezeBaseline({...cloneBaselineJson(register),version:register.version+1,events:[...cloneBaselineJson(register.events),event],selectedRevisionId:type==="DOWNLOAD_STARTED"?register.selectedRevisionId:revisionId,
  lastUsedRevisionId:type==="OWNER_ATTESTED_USED"?revisionId:register.lastUsedRevisionId});
}
export async function verifyRegister(register){
 validScope(register?.scope);
 if(register.schema!==BASELINE_SCHEMA||!Number.isSafeInteger(register.version)||register.version<0||!Array.isArray(register.records)||!Array.isArray(register.events)||register.version<register.records.length+register.events.length)throw Error("Invalid register");
 const ids=new Set();for(const r of register.records){await verifyBaseline(r);if(scopeKey(r.scope)!==scopeKey(register.scope)||ids.has(r.id))throw Error("Duplicate/foreign revision");ids.add(r.id);}
 const eventIds=new Set();let selected=null,used=null;
 for(const e of register.events){
  const r=register.records.find(x=>x.id===e.revisionId);
  if(!r||!["SELECTED","OWNER_ATTESTED_USED","DOWNLOAD_STARTED"].includes(e.type)||!nonempty(e.actor)||!nonempty(e.purpose)||!timestamp(e.recordedAt)||e.snapshotHash!==r.snapshotHash||await digest(eventPayload(e))!==e.id||eventIds.has(e.id))throw Error("Invalid or unbound revision event");
  if(e.type==="DOWNLOAD_STARTED"&&!r.artifacts.some(a=>a.id===e.artifactId&&a.sha256===e.artifactSha256))throw Error("Unbound download artifact");
  if(e.occurredAt!==null&&(!/^\d{4}-\d{2}-\d{2}$/.test(e.occurredAt)||Number.isNaN(Date.parse(e.occurredAt))||new Date(e.occurredAt).toISOString().slice(0,10)!==e.occurredAt))throw Error("Invalid recorded usage date");
  eventIds.add(e.id);if(e.type!=="DOWNLOAD_STARTED")selected=e.revisionId;if(e.type==="OWNER_ATTESTED_USED")used=e.revisionId;
 }
 if(register.selectedRevisionId!==selected||register.lastUsedRevisionId!==used)throw Error("Selection pointer does not match event history");
 return true;
}
// Restore only into an empty register, or append a strict history extension.
// Divergent copies require explicit reconciliation, never last-write-wins.
export async function restoreBaselineRegister(current,incoming){
 await verifyRegister(current);await verifyRegister(incoming);
 if(scopeKey(current.scope)!==scopeKey(incoming.scope))throw Error("Backup belongs to another project/recipient");
 for(const key of ["records","events"]){
  if(incoming[key].length<current[key].length||current[key].some((r,i)=>canonicalJson(r)!==canonicalJson(incoming[key][i])))throw Error("Backup would remove/rewrite existing history; restore stopped");
 }
 if(canonicalJson(current)===canonicalJson(incoming))return freezeBaseline(cloneBaselineJson(current));
 return freezeBaseline({...cloneBaselineJson(incoming),version:Math.max(incoming.version,current.version)+1});
}
export async function serializeBaselineRegister(register){await verifyRegister(register);const text=canonicalJson(register);if(encoder.encode(text).length>MAX_BACKUP_BYTES)throw Error("Backup exceeds64MiB");return text;}
// Run inside the storage transaction after loading its current value.
export function assertBaselineWrite(current,expectedVersion,next){
 if(current.version!==expectedVersion)throw Error("Register changed in another tab; reload before saving");
 if(scopeKey(current.scope)!==scopeKey(next.scope)||next.version<current.version)throw Error("Invalid register transaction");
 for(const key of ["records","events"]){
  if(current[key].length>next[key].length||current[key].some((x,i)=>canonicalJson(x)!==canonicalJson(next[key][i])))throw Error("Cannot rewrite existing revision history");
 }
 if(current.version===next.version&&canonicalJson(current)!==canonicalJson(next))throw Error("Register change requires a new version");
 return true;
}
export async function parseBaselineRegister(text,scope){
 if(typeof text!=="string"||encoder.encode(text).length>MAX_BACKUP_BYTES)throw Error("Backup exceeds64MiB");
 const register=JSON.parse(text);await verifyRegister(register);
 if(scopeKey(scope)!==scopeKey(register.scope))throw Error("Foreign project/recipient backup");
 return freezeBaseline(register);
}
export function baselineDifferences(before,after,limit=100){
 const changes=[];let count=0;
 function visit(a,b,path){
  if(Object.is(a,b))return;
  if(a&&b&&typeof a==="object"&&typeof b==="object"&&Array.isArray(a)===Array.isArray(b)){
   const idKey=Array.isArray(a)&&a.length&&b.length?["id","key","sourceId"].find(k=>[a,b].every(xs=>xs.every(x=>x&&typeof x==="object"&&typeof x[k]==="string")&&new Set(xs.map(x=>x[k])).size===xs.length)):null;
   if(idKey){const am=new Map(a.map(x=>[x[idKey],x])),bm=new Map(b.map(x=>[x[idKey],x]));for(const k of new Set([...am.keys(),...bm.keys()]))visit(am.get(k),bm.get(k),path+"["+idKey+"="+k+"]");}
   else for(const k of new Set([...Object.keys(a),...Object.keys(b)]))visit(a[k],b[k],path+"."+k);
  }else{count++;if(changes.length<limit)changes.push({path,before:a===undefined?"(absent)":JSON.stringify(a),after:b===undefined?"(absent)":JSON.stringify(b)});}
 }
 visit(before,after,"Working");return {count,changes,truncated:count>changes.length};
}
