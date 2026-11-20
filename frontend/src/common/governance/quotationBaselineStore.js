import {emptyBaselineRegister,scopeKey,verifyRegister,cloneBaselineJson,assertBaselineWrite} from "./quotationBaseline";
// Browser durable storage, scoped by project/proposal/recipient. Portable backup
// is mandatory in the UI; this is not a central server or cross-device sync.
function database(){
 return new Promise((resolve,reject)=>{
  if(!globalThis.indexedDB)return reject(Error("IndexedDB unavailable; register was not saved"));
  const request=indexedDB.open("genesis-quotation-baselines-v1",1);
  request.onupgradeneeded=()=>request.result.createObjectStore("registers");
  request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error("Close other register tabs and retry"));
  request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();resolve(db);};
 });
}
export async function loadBaselineRegister(scope){
 const db=await database();
 try{
  const value=await new Promise((resolve,reject)=>{const tx=db.transaction("registers","readonly"),r=tx.objectStore("registers").get(scopeKey(scope));r.onsuccess=()=>resolve(r.result||emptyBaselineRegister(scope));r.onerror=()=>reject(r.error);});
  await verifyRegister(value);return value;
 }finally{db.close();}
}
export async function commitBaselineRegister(scope,expectedVersion,next){
 await verifyRegister(next);
 if(scopeKey(scope)!==scopeKey(next.scope)||next.version<expectedVersion)throw Error("Invalid register transaction");
 const db=await database();
 try{
  await new Promise((resolve,reject)=>{
   const tx=db.transaction("registers","readwrite"),store=tx.objectStore("registers"),request=store.get(scopeKey(scope));let error=null;
   request.onsuccess=()=>{const current=request.result||emptyBaselineRegister(scope);
    try{assertBaselineWrite(current,expectedVersion,next);}catch(e){error=e;tx.abort();return;}
    store.put(cloneBaselineJson(next),scopeKey(scope));
   };
   tx.oncomplete=()=>resolve();tx.onabort=()=>reject(error||tx.error||Error("Register write aborted"));tx.onerror=()=>{error=error||tx.error;};
  });return next;
 }finally{db.close();}
}
