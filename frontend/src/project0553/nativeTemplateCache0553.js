/**
 * PJ2608-0553 / 10.3.3 — Local ORIGINAL template cache.
 * The browser cannot read a file in Windows Downloads without user consent.
 * Choose original 4-Scope of Supply.xlsx ONCE; cache it locally in IndexedDB.
 * Subsequent Working Draft exports can download with one click.
 * Never upload, log, or commit the confidential source workbook.
 * Cache is per browser/profile/origin and can be replaced by the user.
 */
const DATABASE="pj2608-0553-native-templates-v1";
const STORE="originals";
const KEY="4-Scope of Supply.xlsx";
const openDb=()=>new Promise((resolve,reject)=>{
 if(typeof indexedDB==="undefined")return reject(new Error("IndexedDB is unavailable; browser cannot retain template"));
 const req=indexedDB.open(DATABASE,1);
 req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))
   req.result.createObjectStore(STORE,{keyPath:"id"});};
 req.onsuccess=()=>resolve(req.result);
 req.onerror=()=>reject(req.error||new Error("Unable to open browser template cache"));
});
const transaction=(mode,operation)=>openDb().then(db=>new Promise((resolve,reject)=>{
 const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE);
 let val=null,finished=false;
 const req=operation(store);
 req.onsuccess=()=>{val=req.result;};
 req.onerror=()=>{if(!finished){finished=true;reject(req.error||new Error("Template cache error"));}};
 tx.oncomplete=()=>{if(!finished){finished=true;resolve(val);}};
 tx.onerror=()=>{if(!finished){finished=true;reject(tx.error||new Error("Template cache transaction failed"));}};
 tx.onabort=()=>{if(!finished){finished=true;reject(tx.error||new Error("Template cache transaction aborted"));}};
 db.onversionchange=()=>db.close();
})).catch(e=>{throw e;});

export const NATIVE_TEMPLATE_NAME_0553=KEY;
export async function loadNativeTemplate0553(){
 const data=await transaction("readonly",store=>store.get(KEY));
 if(!data)return null;
 if(!data.originalBytes||!data.name)return null;
 const buffer=data.originalBytes instanceof ArrayBuffer?data.originalBytes:data.originalBytes.buffer;
 return {
  name:data.name,size:buffer.byteLength,savedAt:data.savedAt,
  arrayBuffer:async()=>buffer.slice(0)
 };
}
export async function saveNativeTemplate0553(file){
 if(!file||file.name!==KEY)throw new Error("Please select the original file named 4-Scope of Supply.xlsx");
 if(file.size>25_000_000)throw new Error("Original workbook is too large for this native draft exporter");
 const originalBytes=await file.arrayBuffer();
 await transaction("readwrite",store=>store.put({
  id:KEY,name:KEY,originalBytes,savedAt:new Date().toISOString()
 }));
 return {name:KEY,size:originalBytes.byteLength};
}
export async function clearNativeTemplate0553(){
 await transaction("readwrite",store=>store.delete(KEY));
}
