import {prepareRadioAppendix11Budget0550} from './data/radioAppendix11Budget0550';
import {prepareMgwCurrentWorking0550,prepareMgwRadioDtrsRegister0550} from "./data/mgwCurrentWorking0550";
import {mgwOfferSourcePending0550} from "./data/mgwQuoteSelection0550";
import {applyCommercialSellPolicies0550,prepareBidCompletion0550,reconcileTowerTenderScope0550,replaceGeneratedDtrsHandheld0550} from "./data/bidCompletion0550";
import {prepareBidProcess0550} from "./data/bidProcess0550";
import {pendingVendorDefaultCount0550} from "./data/vendorDefaultCatalog0550";
import {fetchAutomaticVendorRegisters0550,planAutomaticVendorRegisters0550,prepareVendorDefaults0550,vendorRegisterSyncSuccess0550,vendorRegisterSyncFailure0550} from "./data/vendorRegisterAuto0550";
import {prepareMgwDetailPricing0550} from "./data/mgwDetailPricing0550";
import {deriveAvlReconciliation0550,prepareSystemAvlDeviations0550} from "./data/avlReconciliation0550";
import {importMgwVendorBasis0550} from "./data/mgwVendorBasis0550";
import {preparePagaRevisionPricing0550} from './data/supplierRevision0550';
import {preparePagaIdieWorking0550} from './data/alieIntake0550';
import {preparePagaMobWorking0550} from './data/pagaMobWorking0550';
import {preparePagaAvlDeviation0550} from "./data/avlDeviationBasis0550";
import {deriveIntegration0550} from "./data/integrationWorkspace0550";
import {importMrWorkingBasis0550} from "./data/mrWorkingBasis0550";
import React,{createContext,useContext,useEffect,useMemo,useRef,useState} from "react";
import {loadProject0550Bid,saveProject0550Bid,SYSTEMS,DATA_LAYER_META,BUDGETARY_ESTIMATE,COMMERCIAL_SOURCES,COMMERCIAL_POLICY} from "./data";
import {deriveBidWorkspace,validateBidWorkspace} from "./data/bidWorkspaceModel";
import {sourceLoadMessage} from "./data/sourceAutoLoad";
import {fetchAutomaticSourceWorkspace0550,selectAutomaticSourceWorkspace0550} from "./data/sourceWorkspaceAuto0550";
import {repairPagaEngineeringDrafts0550} from "./data/siWorkPackage0550";
import {importLegacyVendorBasis0550} from "./data/legacyVendorBasis0550";
import {retireLegacyTowerPricing0550} from "./data/towerLegacyPricing0550";
import {workspaceDiagnostic0550} from "./data/workspaceRecovery0550";
import {deriveReleaseControl0550,mergeReleaseRegister0550} from "./data/releaseIssue0550";
import {prepareRepositoryBidBasis0550,prepareAuthorizedEurThb0550} from "./data/repositoryBidBasis0550";
import {prepareTsiActivityBudget0550,prepareTsiExpenseBudget0550} from "./data/tsiActivityBudget0550";
import {CORE_TEAM} from "./data";
import {deriveSourceReadiness0550} from "./data/sourceReadiness0550";
import {preparePricedVolumeDrafts0550} from "./data/bidVolumeWorkingPreview0550";
import {prepareChevalierPbxWorking0550} from "./data/chevalierPbxWorking0550";
import {prepareChevalierPbxBudget0550} from "./data/chevalierPbxBudget0550";
import {prepareMgwCctvEntBudget0550} from "./data/mgwCctvEntBudget0550";
import {prepareVersedDmrCabinet0550} from "./data/versedRack0550";
import {fetchC8Calloff0550} from "./data/c8Calloff0550";
import {prepareC8Calloff0550} from "./data/bidVolumes0550";
const Context=createContext(null);
const systemTokens0550=SYSTEMS.map(s=>s.token);
function prepareQuotation0550(data,today){
 const revised=preparePagaIdieWorking0550(preparePagaRevisionPricing0550(data,today),COMMERCIAL_POLICY,today);
 const pbx=prepareChevalierPbxWorking0550(revised,COMMERCIAL_POLICY,today);
 const avl=preparePagaAvlDeviation0550(pbx);
 const based=prepareVersedDmrCabinet0550(
  pbx===data?avl:prepareSystemAvlDeviations0550(avl,deriveIntegration0550(avl,SYSTEMS,today)),COMMERCIAL_POLICY,today);
 const radioBudget=prepareRadioAppendix11Budget0550(based,COMMERCIAL_POLICY,today,replaceGeneratedDtrsHandheld0550);
 const priced=prepareBidCompletion0550(radioBudget,{policies:COMMERCIAL_POLICY,team:CORE_TEAM,pricing:()=>deriveBidWorkspace(radioBudget,systemTokens0550,today)},today);
 const pbxBudget=prepareChevalierPbxBudget0550(applyCommercialSellPolicies0550(priced),COMMERCIAL_POLICY,today);
 const working=prepareMgwCctvEntBudget0550(pbxBudget,COMMERCIAL_POLICY,today);
 return preparePagaMobWorking0550(preparePricedVolumeDrafts0550(working,()=>deriveBidWorkspace(working,systemTokens0550,today),today));
}
export const useBidWorkspace=()=>useContext(Context);
export function downloadBidFile(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function BidWorkspaceProvider({children}){
 const [data,setData]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),lock=useRef(false);
 const [recovery,setRecovery]=useState(null);
 const [vendorSync,setVendorSync]=useState({state:"CHECKING",message:"กำลังตรวจชุด Vendor ที่เตรียมไว้ในข้อมูลโครงการ"});
 const [sourceSync,setSourceSync]=useState({state:"CHECKING",message:"กำลังตรวจทะเบียนจาก Google Drive for Desktop"});
 const reload=async()=>{
  if(lock.current)return;lock.current=true;setBusy(true);
  try{
   const c8Request=fetchC8Calloff0550().catch(e=>({error:e.message}));
   let current=await loadProject0550Bid();
   const retired=retireLegacyTowerPricing0550(current);
   if(retired!==current)current=await saveProject0550Bid(retired,current.revision,"Cancel the legacy tower Part A pricing basis");
   const towerScope=reconcileTowerTenderScope0550(current);
   if(towerScope!==current)current=await saveProject0550Bid(towerScope,current.revision,"Reconcile TEL-TELT tender scope and erection schedule allocation");
   const scopeRepaired=repairPagaEngineeringDrafts0550(current);
   if(scopeRepaired!==current)current=await saveProject0550Bid(scopeRepaired,current.revision,"Correct PAGA-only documentation references in three prepared SI drafts");
   const vendorPrepared=importLegacyVendorBasis0550(current,{meta:DATA_LAYER_META,budgetaryEstimate:BUDGETARY_ESTIMATE,commercialSources:COMMERCIAL_SOURCES,commercialPolicy:COMMERCIAL_POLICY},reviewDate);
   const mrPrepared=importMrWorkingBasis0550(vendorPrepared,COMMERCIAL_POLICY,reviewDate);
   const vendorDraft=preparePagaAvlDeviation0550(importMgwVendorBasis0550(mrPrepared,reviewDate));
   const detail=prepareMgwDetailPricing0550(vendorDraft,COMMERCIAL_POLICY,reviewDate);
   const radio=prepareMgwRadioDtrsRegister0550(detail,systemTokens0550,reviewDate);
   const priced=prepareMgwCurrentWorking0550(radio,COMMERCIAL_POLICY,reviewDate);
   const avlPrepared=prepareSystemAvlDeviations0550(priced,deriveIntegration0550(priced,SYSTEMS,reviewDate));
   const repository=prepareRepositoryBidBasis0550(avlPrepared,{meta:DATA_LAYER_META,budgetaryEstimate:BUDGETARY_ESTIMATE},reviewDate);
   const labour=prepareTsiActivityBudget0550(prepareAuthorizedEurThb0550(repository,reviewDate),COMMERCIAL_POLICY,CORE_TEAM,reviewDate);
   const processed=prepareBidProcess0550(prepareVendorDefaults0550(prepareTsiExpenseBudget0550(labour,COMMERCIAL_POLICY,CORE_TEAM,reviewDate),SYSTEMS.map(s=>s.token)),COMMERCIAL_POLICY,reviewDate);
   const c8=await c8Request;
   const prepared=prepareQuotation0550(prepareC8Calloff0550(processed,c8?.error?null:c8,reviewDate),reviewDate);
   if(prepared!==current)current=await saveProject0550Bid(prepared,current.revision,"Prepare vendor/MR basis, default supplier metadata, authorised TSI estimates and priced Volume I drafts / "+prepared.mgwQuoteImport.version);
   setData(current);setError(c8?.error?'C8 · '+c8.error:"");setRecovery(null);
   setSourceSync({state:"CHECKING",message:"กำลังตรวจทะเบียนจาก Google Drive for Desktop"});
   // Fetch independent evidence concurrently; a missing/conflicting CUS bundle
   // must not prevent a valid Vendor register from reaching the existing07.1/07.2.
   const sourceRequest=fetchAutomaticSourceWorkspace0550().then(bundle=>({bundle}),error=>({error}));
   setVendorSync({state:"CHECKING",message:"กำลังตรวจชุด Vendor ที่เตรียมไว้ในข้อมูลโครงการ"});
   try{
    const bundle=await fetchAutomaticVendorRegisters0550(),plan=planAutomaticVendorRegisters0550(current,bundle,SYSTEMS.map(s=>s.token));
    const processed=prepareBidProcess0550(prepareMgwCurrentWorking0550(plan.workspace,COMMERCIAL_POLICY,reviewDate),COMMERCIAL_POLICY,reviewDate);
    const priced=prepareQuotation0550(processed,reviewDate);
    if(priced!==current)current=await saveProject0550Bid(priced,current.revision,"Load prepared Vendor registers and execute source-bound bid preparation / "+bundle.packages.map(p=>p.batchId).join(", "));
    setData(current);setVendorSync(vendorRegisterSyncSuccess0550(plan,current));
   }catch(e){current=await loadProject0550Bid();setData(current);setVendorSync(vendorRegisterSyncFailure0550(e.message,current));}
   try {
    const result=await sourceRequest;if(result.error)throw result.error;
    const bundle=result.bundle,intake=bundle.sourceIntake,selected=selectAutomaticSourceWorkspace0550(current,bundle,SYSTEMS.map(s=>s.token));
    const currentSources=prepareMgwCurrentWorking0550(selected.workspace,COMMERCIAL_POLICY,reviewDate);
    const sourceDraft=prepareSystemAvlDeviations0550(currentSources,deriveIntegration0550(currentSources,SYSTEMS,reviewDate));
    const sourced=prepareQuotation0550(sourceDraft,reviewDate);
    if(sourced!==current)current=await saveProject0550Bid(sourced,current.revision,"Load canonical source/A preparation and reconcile system AVL drafts / "+intake.batchId);
    const messages={APPLIED:"โหลดข้อมูล JSON และชุดเตรียม A ให้ B ใช้แล้วอัตโนมัติ",PRESERVED_EDITS:"โหลดชุดเตรียม A แล้ว โดยคงรายการที่คุณแก้ไขไว้",ADOPTED:"ใช้ชุดเตรียม A ที่บันทึกไว้แล้ว โดยคงงานที่แก้ไขและรายการที่ลบไว้",CURRENT:"ข้อมูล JSON และชุดเตรียม A ใน workspace เป็นชุดปัจจุบันแล้ว",NOT_FOUND:"โหลดทะเบียน JSON แล้ว แต่ยังไม่พบชุดเตรียม A ที่ตรงกันใน DATA",LOCAL_NEWER:"ข้อมูลที่บันทึกอยู่ใหม่กว่าชุดบน Drive จึงเก็บข้อมูลเดิมไว้"};
    setData(current);setSourceSync({state:selected.state,message:messages[selected.preparationState],preparationState:selected.preparationState,preparationStats:selected.stats,batchId:current.sourceIntake?.batchId});
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
 // Arrival of a synced quote fills only untouched OPEN defaults. Retry in the
 // background, without requiring Load/reload or resetting source/Working forms.
 useEffect(()=>{
  if(!data||!pendingVendorDefaultCount0550(data)&&!mgwOfferSourcePending0550(data))return;
  let active=true,timer,attempts=0;
  const retry=async()=>{
   if(!active)return;
   if(lock.current){timer=setTimeout(retry,5000);return;}
   attempts++;
   try{
    const bundle=await fetchAutomaticVendorRegisters0550();if(!active)return;
    if(lock.current)return;
    lock.current=true;setBusy(true);
    try{
     let current=await loadProject0550Bid();
     const plan=planAutomaticVendorRegisters0550(current,bundle,SYSTEMS.map(s=>s.token));
     const processed=prepareBidProcess0550(prepareMgwCurrentWorking0550(plan.workspace,COMMERCIAL_POLICY,reviewDate),COMMERCIAL_POLICY,reviewDate);
    const priced=prepareQuotation0550(processed,reviewDate);
     if(priced!==current)current=await saveProject0550Bid(priced,current.revision,"Load prepared Vendor registers and execute source-bound bid preparation / "+bundle.packages.map(p=>p.batchId).join(", "));
     if(active){if(plan.changed||current.revision!==data.revision)setData(current);setVendorSync(vendorRegisterSyncSuccess0550(plan,current));}
    }finally{lock.current=false;setBusy(false);}
   }catch(e){if(active)setVendorSync(vendorRegisterSyncFailure0550(e.message,data));}
   finally{if(active&&attempts<3)timer=setTimeout(retry,5000);}
  };
  timer=setTimeout(retry,5000);
  return()=>{active=false;clearTimeout(timer);};
 },[data]);
 const reviewDate=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
 const model=useMemo(()=>{if(!data)return null;const integration=deriveIntegration0550(data,SYSTEMS,reviewDate),sourceReadiness=deriveSourceReadiness0550(data,integration,reviewDate),derived={...deriveBidWorkspace(data,SYSTEMS.map(s=>s.token),reviewDate,integration),integration,sourceReadiness,avlReconciliation:deriveAvlReconciliation0550(data,integration)};const releaseControl=deriveReleaseControl0550(data,derived,reviewDate);return {...derived,releaseControl,official:{...derived.official,releaseAllowed:releaseControl.releaseAllowed,releaseState:releaseControl.state}};},[data,reviewDate]);
 async function change(transform,action){
  if(!data||lock.current)return false;
  lock.current=true;
  setBusy(true);
  try{
   const transformed=repairPagaEngineeringDrafts0550(reconcileTowerTenderScope0550(retireLegacyTowerPricing0550(transform(data))));
   const sourced=transformed.offers===data.offers?transformed:prepareChevalierPbxBudget0550(
    prepareChevalierPbxWorking0550(transformed,COMMERCIAL_POLICY,reviewDate),COMMERCIAL_POLICY,reviewDate);
   const next=prepareSystemAvlDeviations0550(sourced,deriveIntegration0550(sourced,SYSTEMS,reviewDate));
   setData(await saveProject0550Bid(preparePagaMobWorking0550(next),data.revision,action));
   setError("");
   return true;
  }catch(e){
   setError(e.message);
   return false;
  }finally{
   lock.current=false;
   setBusy(false);
  }
 }
 const put=(collection,record)=>change(d=>({...d,[collection]:d[collection].some(r=>r.id===record.id)?d[collection].map(r=>r.id===record.id?record:r):[...d[collection],record]}),"Save "+collection+" / "+record.id);
 async function importFile(file){if(!file)return;try{if(file.size>64*1024*1024)throw Error("Workspace exceeds 64 MiB");const imported=validateBidWorkspace(JSON.parse(await file.text()),DATA_LAYER_META.datasetId,SYSTEMS.map(s=>s.token));await change(current=>{const releaseRegister=mergeReleaseRegister0550(current.releaseRegister,imported.releaseRegister);return {...imported,...(current.bidVolumes&&!imported.bidVolumes?{bidVolumes:current.bidVolumes}:{}),revision:current.revision,audit:current.audit,...(releaseRegister?{releaseRegister}:{})};},"Import reviewed 0550 workspace backup / merge frozen history");}catch(e){setError(e.message);}}
 return <Context.Provider value={{data,model,error,busy,recovery,change,put,reload,importFile,reviewDate,sourceSync,vendorSync}}>{children}</Context.Provider>;
}
