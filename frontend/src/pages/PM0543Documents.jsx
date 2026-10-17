import React from "react";

const link = (href,text) => <a href={href} target="_blank" rel="noopener noreferrer" style={{color:"#1d4ed8"}}>{text}</a>;
export function PM0543Documents() {
  const rows = [
    ["Customer / Project","Andaman Transportation Limited · Project 8401 ATL"],
    ["Service Order","3450075556 (2026-08-26)"],
    ["Quotation","PR2608-0526 Rev1"],
    ["Scope","CCTV Preventive Maintenance · ZOC, ZMS, ZBV1, ZBV2, KP-30, Landfall"],
    ["Registered Cameras","60 per Service Order (check SOW/tag-level reconciliation)"],
    ["Deliverables","Daily Progress, PM Completion, Configuration Backup (where applicable), Before/After Photos, Defects & Recommendations"]
  ];
  return <section style={{fontFamily:"Arial,sans-serif",padding:20,background:"#f8fafc",minHeight:"70vh",color:"#0f172a"}}>
    <h1 style={{marginTop:0}}>PJ2607-0543 · PTTEPI MY ATL [PM CCTV]</h1>
    <p style={{color:"#475569"}}>Existing project reference & document inventory — not a recreated or approved SAT/PM editor.</p>
    <div style={{display:"flex",gap:18,flexWrap:"wrap",marginBottom:18}}>
      {link("https://drive.google.com/drive/folders/1963kZhBprQ14dDJ50SGJdP-PE7a9GOPg","Open PJ2607-0543 Google Drive")}
      {link("https://drive.google.com/file/d/19lEMUr05yBKJpwioKrqmmfk2ogJQqpsb/view","Service Order")}
      {link("https://drive.google.com/file/d/1M6lcwyopJbwyki6Anw5iSEhUhVOs2B85/view","CCTV PM SOW")}
    </div>
    <div style={{border:"1px solid #cbd5e1",background:"white",borderRadius:8,padding:18,maxWidth:1100}}>
      <h2 style={{marginTop:0}}>Project Document Register</h2>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <tbody>{rows.map(([key,value])=><tr key={key}><th style={{width:"28%",textAlign:"left",background:"#e0edff",padding:11,border:"1px solid #cbd5e1"}}>{key}</th><td style={{padding:11,border:"1px solid #cbd5e1"}}>{value}</td></tr>)}</tbody>
      </table>
      <p style={{color:"#92400e",marginBottom:0}}>Source-backed project information only. Previous 0543 editing UI/source has not yet been located; no Word/PDF generator is wired here.</p>
    </div>
  </section>;
}
