// 10.3.3 regression: cache original only in local browser and reuse it.
// No external network, no workbook binary embedded in repo.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const source=fs.readFileSync(path.resolve(__dirname,"../src/project0553/nativeTemplateCache0553.js"),"utf8");
const data=new Map();
let ready=false;
const defer=fn=>queueMicrotask(fn);
const db={
 objectStoreNames:{contains:()=>ready},
 createObjectStore:()=>{ready=true;},
 close:()=>{},
 transaction:()=>{
  const tx={};
  const req=fn=>{
   const request={};
   defer(()=>{try{request.result=fn();request.onsuccess?.();defer(()=>tx.oncomplete?.());}
    catch(error){request.error=error;request.onerror?.();}});
   return request;
  };
  tx.objectStore=()=>({
   get:key=>req(()=>data.get(key)),
   put:record=>req(()=>{data.set(record.id,record);return record.id;}),
   delete:key=>req(()=>data.delete(key))
  });
  return tx;
 }
};
const indexedDB={open:()=>{
 const req={result:db};
 defer(()=>{if(!ready)req.onupgradeneeded?.();req.onsuccess?.();});
 return req;
}};
const ctx={indexedDB,ArrayBuffer,Uint8Array,Date,Promise,Error};
vm.runInNewContext(source.replace(/\bexport /g,"")+
 ";this.api={loadNativeTemplate0553,saveNativeTemplate0553,clearNativeTemplate0553,NATIVE_TEMPLATE_NAME_0553};",ctx);
const api=ctx.api;
(async()=>{
 assert.equal(api.NATIVE_TEMPLATE_NAME_0553,"4-Scope of Supply.xlsx");
 assert.equal(await api.loadNativeTemplate0553(),null);
 const original=Uint8Array.from([80,75,3,4,1,2,3,4]).buffer;
 const userFile={name:"4-Scope of Supply.xlsx",size:8,arrayBuffer:async()=>original};
 const saved=await api.saveNativeTemplate0553(userFile);
 assert.equal(saved.size,8);
 const cached=await api.loadNativeTemplate0553();
 assert.equal(cached.name,userFile.name);
 assert.equal(new Uint8Array(await cached.arrayBuffer())[0],80);
 const writable=new Uint8Array(await cached.arrayBuffer());writable[0]=1;
 assert.equal(new Uint8Array(await (await api.loadNativeTemplate0553()).arrayBuffer())[0],80,
  "Cached original must not be changed by consumer mutation");
 await api.clearNativeTemplate0553();
 assert.equal(await api.loadNativeTemplate0553(),null);
 await assert.rejects(()=>api.saveNativeTemplate0553({name:"other.xlsx"}),/original file named/);
 console.log("PASS 0553 original native XLSX cached locally after consent; repeat-click retrieval and clear");
})().catch(e=>{console.error(e);process.exitCode=1;});
