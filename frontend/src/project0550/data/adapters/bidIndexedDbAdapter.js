// Private bidding inputs only. No HTTP endpoint, ERP integration or public payload.
import {validateReleaseTransition0550} from "../releaseIssue0550";
import {deriveBidWorkspace} from "../bidWorkspaceModel";
import {deriveIntegration0550} from "../integrationWorkspace0550";
import {controlledSnapshotAdapter} from "./controlledSnapshotAdapter";
const DATABASE="GENESIS-PJ2608-0550-BIDDING", KEY="active";
function openDB(){return new Promise((resolve,reject)=>{
 if(!globalThis.indexedDB)return reject(Error("Browser database unavailable; changes cannot be saved"));
 const request=indexedDB.open(DATABASE,1);
 request.onupgradeneeded=()=>{request.result.createObjectStore("workspace");request.result.createObjectStore("revisions");};
 request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error("Close other GENESIS tabs and retry database access"));request.onsuccess=()=>resolve(request.result);
});}
export const bidIndexedDbAdapter={
 async load(){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction("workspace","readonly"),req=tx.objectStore("workspace").get(KEY);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();});},
 async save(data,expectedRevision,action){const db=await openDB();return new Promise((resolve,reject)=>{
  const tx=db.transaction(["workspace","revisions"],"readwrite"),store=tx.objectStore("workspace"),req=store.get(KEY);let saved,reason;
  req.onsuccess=()=>{if((req.result?.revision||0)!==expectedRevision){reason=Error("Another tab changed the workspace. Reload saved data before editing again; your form remains visible.");tx.abort();return;}
   try{
    const today=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
    validateReleaseTransition0550(req.result,data,today,(snapshot,date)=>{const systems=controlledSnapshotAdapter.load().systemGroups.flatMap(g=>g.systems),integration=deriveIntegration0550(snapshot,systems,date);return {...deriveBidWorkspace(snapshot,systems.map(s=>s.token),date,integration),integration};},{restore:action==="Import reviewed 0550 workspace backup / merge frozen history"});
   }catch(e){reason=e;tx.abort();return;}
   saved={...data,revision:expectedRevision+1,audit:[...(data.audit||[]),{revision:expectedRevision+1,at:new Date().toISOString(),action}].slice(-2000)};
   store.put(saved,KEY);tx.objectStore("revisions").put(saved,saved.revision);
  };
  tx.oncomplete=()=>{db.close();resolve(saved);};tx.onabort=()=>{db.close();reject(reason||tx.error||Error("Save aborted"));};tx.onerror=()=>{reason=tx.error;};
 });}
};
