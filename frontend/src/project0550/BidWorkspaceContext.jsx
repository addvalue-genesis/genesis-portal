import {importMgwVendorBasis0550} from "./data/mgwVendorBasis0550";
import {preparePagaAvlDeviation0550} from "./data/avlDeviationBasis0550";
import {deriveIntegration0550} from "./data/integrationWorkspace0550";
import {importMrWorkingBasis0550} from "./data/mrWorkingBasis0550";
import React,{createContext,useContext,useEffect,useMemo,useRef,useState} from "react";
import {loadProject0550Bid,saveProject0550Bid,SYSTEMS,DATA_LAYER_META,BUDGETARY_ESTIMATE,COMMERCIAL_SOURCES,COMMERCIAL_POLICY} from "./data";
import {deriveBidWorkspace,validateBidWorkspace} from "./data/bidWorkspaceModel";
import {fetchAutomaticSource,selectAutomaticSource,sourceLoadMessage} from "./data/sourceAutoLoad";
import {importLegacyVendorBasis0550} from "./data/legacyVendorBasis0550";
import {workspaceDiagnostic0550} from "./data/workspaceRecovery0550";
const Context=createContext(null);
export const useBidWorkspace=()=>useContext(Context);
export function downloadBidFile(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function BidWorkspaceProvider({children}){
 const [data,setData]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),lock=useRef(false);
 const [recovery,setRecovery]=useState(null);
 const [sourceSync,setSourceSync]=useState({state:"CHECKING",message:"กำลังตรวจทะเบียนจาก Google Drive for Desktop"});
 const reload=async()=>{
  if(lock.current)return;lock.current=true;setBusy(true);
  try{
   let current=await loadProject0550Bid();
   const vendorPrepared=importLegacyVendorBasis0550(current,{meta:DATA_LAYER_META,budgetaryEstimate:BUDGETARY_ESTIMATE,commercialSources:COMMERCIAL_SOURCES,commercialPolicy:COMMERCIAL_POLICY},reviewDate);
   const mrPrepared=importMrWorkingBasis0550(vendorPrepared,COMMERCIAL_POLICY,reviewDate);
   const prepared=preparePagaAvlDeviation0550(importMgwVendorBasis0550(mrPrepared,reviewDate));
   if(prepared!==current)current=await saveProject0550Bid(prepared,current.revision,"Prepare vendor offers, MR Working requirements and selected PAGA AVL deviation / "+prepared.mgwQuoteImport.version);
   setData(current);setError("");setRecovery(null);
   setSourceSync({state:"CHECKING",message:"กำลังตรวจทะเบียนจาก Google Drive for Desktop"});
   try {
    const intake=await fetchAutomaticSource(),selected=selectAutomaticSource(current,intake,SYSTEMS.map(s=>s.token));
    if(selected.state==="UPDATED")current=await saveProject0550Bid(selected.workspace,current.revision,"Load reviewed source from Drive Desktop / "+intake.batchId);
    setData(current);setSourceSync({state:selected.state,message:selected.state==="LOCAL_NEWER"?"ข้อมูลที่บันทึกอยู่ใหม่กว่าชุดบน Drive จึงเก็บข้อมูลเดิมไว้":"โหลดทะเบียนจาก Google Drive for Desktop แล้ว",batchId:current.sourceIntake?.batchId});
   }catch(e){
    // Another tab can save while Drive is loading. Reload it rather than writing stale data.
    setData(await loadProject0550Bid());
    const code=e.name==="AbortError"?"DRIVE_TIMEOUT":e.message;
    setSourceSync({state:"UNAVAILABLE",code,message:sourceLoadMessage(code)});
   }
  }catch(e){
   setData(null);setError(e.message);
   setRecovery({rawWorkspace:e.rawWorkspace||null,diagnostic:workspaceDiagnostic0550(e,e.rawWorkspace,globalThis.location?.origin||"")});
  }finally{lock.current=false;setBusy(false);}
 };
 useEffect(()=>{reload();},[]);
 const reviewDate=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
 const model=useMemo(()=>{if(!data)return null;const integration=deriveIntegration0550(data,SYSTEMS,reviewDate);return {...deriveBidWorkspace(data,SYSTEMS.map(s=>s.token),reviewDate,integration),integration};},[data,reviewDate]);
 async function change(transform,action){if(!data||lock.current)return false;lock.current=true;setBusy(true);try{const next=transform(data);setData(await saveProject0550Bid(next,data.revision,action));setError("");return true;}catch(e){setError(e.message);return false;}finally{lock.current=false;setBusy(false);}}
 const put=(collection,record)=>change(d=>({...d,[collection]:d[collection].some(r=>r.id===record.id)?d[collection].map(r=>r.id===record.id?record:r):[...d[collection],record]}),"Save "+collection+" / "+record.id);
 async function importFile(file){if(!file)return;try{if(file.size>16*1024*1024)throw Error("Workspace exceeds 16 MiB");const imported=validateBidWorkspace(JSON.parse(await file.text()),DATA_LAYER_META.datasetId,SYSTEMS.map(s=>s.token));await change(current=>({...imported,revision:current.revision,audit:current.audit}),"Import reviewed 0550 workspace backup");}catch(e){setError(e.message);}}
 return <Context.Provider value={{data,model,error,busy,recovery,change,put,reload,importFile,reviewDate,sourceSync}}>{children}</Context.Provider>;
}
