import React,{createContext,useContext,useEffect,useMemo,useRef,useState} from "react";
import {loadProject0550Bid,saveProject0550Bid,SYSTEMS,DATA_LAYER_META} from "./data";
import {deriveBidWorkspace,validateBidWorkspace} from "./data/bidWorkspaceModel";
const Context=createContext(null);
export const useBidWorkspace=()=>useContext(Context);
export function downloadBidFile(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function BidWorkspaceProvider({children}){
 const [data,setData]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),lock=useRef(false);
 const reload=async()=>{try{setData(await loadProject0550Bid());setError("");}catch(e){setError(e.message);}};
 useEffect(()=>{reload();},[]);
 const reviewDate=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
 const model=useMemo(()=>data?deriveBidWorkspace(data,SYSTEMS.map(s=>s.token),reviewDate):null,[data,reviewDate]);
 async function change(transform,action){if(!data||lock.current)return false;lock.current=true;setBusy(true);try{const next=transform(data);setData(await saveProject0550Bid(next,data.revision,action));setError("");return true;}catch(e){setError(e.message);return false;}finally{lock.current=false;setBusy(false);}}
 const put=(collection,record)=>change(d=>({...d,[collection]:d[collection].some(r=>r.id===record.id)?d[collection].map(r=>r.id===record.id?record:r):[...d[collection],record]}),"Save "+collection+" / "+record.id);
 async function importFile(file){if(!file)return;try{if(file.size>5*1024*1024)throw Error("Workspace exceeds 5 MiB");const imported=validateBidWorkspace(JSON.parse(await file.text()),DATA_LAYER_META.datasetId,SYSTEMS.map(s=>s.token));await change(current=>({...imported,revision:current.revision,audit:current.audit}),"Import reviewed 0550 workspace backup");}catch(e){setError(e.message);}}
 return <Context.Provider value={{data,model,error,busy,change,put,reload,importFile,reviewDate}}>{children}</Context.Provider>;
}
