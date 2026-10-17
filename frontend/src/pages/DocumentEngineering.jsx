import React, { useState } from "react";

const legacyModules = [
  {id:"vdrl",name:"AWP45 VDRL Quotation",file:"AWP45_VDRL_Quotation.html",description:"Legacy VDRL quotation / A4 document layout"},
  {id:"generator",name:"ADDVALUE Document Generator",file:"Addvalue_Document_Generator_Updated.html",description:"PTTEP-oriented document generation concept"},
  {id:"number",name:"Document Number Generator",file:"Addvalue_Document_Number_Generator.html",description:"Document numbering and catalog reference"}
];

export function DocumentEngineering() {
  const [id,setId]=useState("vdrl");
  const item=legacyModules.find(x=>x.id===id);
  const url="/legacy-documents/"+encodeURIComponent(item.file);
  return <div style={{background:"#f1f5f9",minHeight:"85vh",padding:"20px",fontFamily:"Arial,sans-serif",color:"#0f172a"}}>
    <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
      <div><h1 style={{margin:"0 0 7px",fontSize:24}}>ADDVALUE · Document Engineering</h1><p style={{margin:0}}>Original GENESIS HTML Modules — Reference Workspace</p></div>
      <a href={url} target="_blank" rel="noreferrer" style={{background:"#1d4ed8",color:"white",padding:"10px 14px",borderRadius:6,textDecoration:"none"}}>Open module in new tab</a>
    </header>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"18px 0"}}>
      {legacyModules.map(x=><button key={x.id} onClick={()=>setId(x.id)} style={{padding:"11px 14px",border:"1px solid #94a3b8",borderRadius:6,background:id===x.id?"#1e40af":"white",color:id===x.id?"white":"#0f172a",cursor:"pointer"}}>{x.name}</button>)}
    </div>
    <div style={{background:"white",padding:12,border:"1px solid #cbd5e1",borderRadius:8,marginBottom:12}}>
      <strong>{item.name}</strong><p style={{margin:"5px 0",fontSize:13}}>{item.description}</p>
      <p style={{margin:0,fontSize:12,color:"#a16207"}}>Read-only integration of original HTML module as a reference. Existing buttons and browser-local controls may run inside the module, but this is not yet connected to SAT JSON / DOCX Export.</p>
    </div>
    <iframe key={item.id} title={item.name} src={url} sandbox="allow-scripts allow-forms allow-downloads allow-modals" style={{display:"block",width:"100%",height:"75vh",border:"1px solid #94a3b8",background:"white",borderRadius:6}}/>
  </div>
}
