import React,{useState} from "react";
// Adapted from the 0553 common UI pattern. Project-qualified IDs supplied by caller.
export function ComponentCopyId({projectId="PJ2608-0550",componentKey}){
 const [state,setState]=useState("Copy ID");const value=projectId+" / "+componentKey;
 async function copy(e){e.preventDefault();e.stopPropagation();try{await navigator.clipboard.writeText(value);setState("Copied");}catch{setState("Select ID");}}
 return <span className="gns-copy-id" onClick={e=>e.stopPropagation()}><code>{componentKey}</code><button type="button" aria-label={"Copy component ID "+componentKey} onClick={copy}>{state}</button>{state==="Select ID"&&<input aria-label="Select component ID" readOnly value={value} onFocus={e=>e.target.select()}/>}</span>;
}
