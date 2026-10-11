import React,{useState} from "react";
// Common presentation only; the key is supplied by the project registry.
export function ComponentCopyId({projectId,componentKey}){
 const [state,setState]=useState("Copy ID");
 const value=projectId+" / "+componentKey;
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
 </span>;
}
