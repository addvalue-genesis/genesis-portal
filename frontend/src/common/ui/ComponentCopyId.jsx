import React,{useState} from "react";
// Common presentation only; the key is supplied by the project registry.
export function ComponentCopyId({projectId,componentKey,componentName=null}){
 const [state,setState]=useState("Copy ID");
 const value=projectId+" / "+componentKey;
 const [nameState,setNameState]=useState("Copy name");
 const copyName=async()=>{try{await navigator.clipboard.writeText(String(componentName));setNameState("Name copied");}
  catch(e){setNameState("Select name");}};
 const copy=async()=>{
  try{
   await navigator.clipboard.writeText(value);
   setState("Copied");
  }catch(e){
   // Clipboard can be blocked on insecure localhost/permissions; expose selectable text instead.
   setState("Select ID");
  }
 };
 return <span className="gns-copy-id">
  <code title={value}>{componentKey}</code>
  <button type="button" onClick={copy} title={"Copy "+value} aria-label={"Copy component ID "+componentKey}>{state==="Copied"?"✓ ":"⧉ "}{state}</button>
  {state==="Select ID"&&<input readOnly aria-label="Select component ID" value={value} onFocus={e=>e.target.select()}/>}
  {componentName&&<button type="button" onClick={copyName} title={"Copy module name: "+componentName} aria-label={"Copy module name "+componentName}>{nameState}</button>}
  {nameState==="Select name"&&<input readOnly aria-label="Select module name" value={String(componentName||"")} onFocus={e=>e.target.select()}/>}
 </span>;
}
