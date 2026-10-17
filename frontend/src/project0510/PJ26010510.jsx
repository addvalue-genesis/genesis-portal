import React, { useState } from "react";
import initial from "./satProject0510.json";

const tabs = ["Project", "Network", "SAT Tests", "PTTEP Preview"];
const card = {border:"1px solid #cbd5e1",borderRadius:8,padding:18,background:"#fff"};
const field = {width:"100%",padding:"9px 10px",border:"1px solid #cbd5e1",borderRadius:5,fontSize:15,boxSizing:"border-box"};
function Editable({label,value,onChange}) {return <label style={{display:"block",fontSize:13,color:"#334155"}}>{label}<input style={{...field,marginTop:5}} value={value} onChange={e=>onChange(e.target.value)}/></label>}
export function PJ26010510(){
 const [data,setData]=useState(initial),[tab,setTab]=useState("Project");
 const [diagram,setDiagram]=useState(null);
 const [service,setService]=useState("idle"),[previewKey,setPreviewKey]=useState(0);
 const api="http://localhost:8051";
 const renderDoc=async()=>{setService("rendering");try{const payload={project_title:data.project.title,po_number:data.project.po,display_title:data.project.title,sites:data.network.sites.map(s=>({site:s.id,radio_ip:s.radioIP,role:s.role})),network:{image:"assets/network_zms_ms.png",frequency_mhz:data.network.frequencyMHz,bandwidth_mhz:data.network.channelMHz,distance_km:data.network.distanceKm},tests:data.tests,sections:[]};const put=await fetch(api+"/api/project",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!put.ok)throw Error("Save error "+put.status);const res=await fetch(api+"/api/render",{method:"POST"});if(!res.ok)throw Error("Render error "+res.status);setPreviewKey(k=>k+1);setService("ready")}catch(e){setService("Backend not connected: "+e.message)}};
 const updateProject=(key,value)=>setData(d=>({...d,project:{...d.project,[key]:value}}));
 const updateNetwork=(key,value)=>setData(d=>({...d,network:{...d.network,[key]:value}}));
 const updateSite=(idx,key,value)=>setData(d=>({...d,network:{...d.network,sites:d.network.sites.map((s,i)=>i===idx?{...s,[key]:value}:s)}}));
 const updateTest=(idx,key,value)=>setData(d=>({...d,tests:d.tests.map((t,i)=>i===idx?{...t,[key]:value}:t)}));
 const download=()=>{const a=document.createElement("a");const u=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.href=u;a.download="PJ2601-0510_SAT_WORKING.json";a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
 const th={padding:"9px",background:"#dbeafe",border:"1px solid #94a3b8",textAlign:"left"};
 const td={padding:"9px",border:"1px solid #cbd5e1"};
 return <div style={{fontFamily:"Arial, sans-serif",background:"#f1f5f9",minHeight:"85vh",padding:"24px",color:"#0f172a"}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap",alignItems:"center",marginBottom:16}}>
   <div><h1 style={{margin:0,fontSize:25}}>SAT Document Workspace</h1><p style={{margin:"6px 0",color:"#475569"}}>PJ2601-0510 · ZMS–MS WiMAX Upgrade · SO 3450075822</p></div>
   <button onClick={download} style={{padding:"10px 15px",background:"#1d4ed8",color:"white",border:0,borderRadius:5,cursor:"pointer"}}>Export Working JSON</button>
  </div>
  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:15}}>{tabs.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"10px 15px",cursor:"pointer",borderRadius:6,border:"1px solid #cbd5e1",fontWeight:tab===t?700:400,background:tab===t?"#1d4ed8":"white",color:tab===t?"white":"#334155"}}>{t}</button>)}</div>
  {tab==="Project"&&<section style={card}><h2>Project / Document Control</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:15}}>
   {["po","title","documentNo","documentStatus"].map(k=><Editable key={k} label={k} value={data.project[k]} onChange={v=>updateProject(k,v)}/>)}</div><p style={{color:"#a16207"}}>Document number must be confirmed by PTTEP Document Control before issue.</p></section>}
  {tab==="Network"&&<section style={card}><h2>Network Data — ZMS (HBS) ↔ MS (HSU)</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12}}>
   <Editable label="Distance (km)" value={data.network.distanceKm} onChange={v=>updateNetwork("distanceKm",v)}/><Editable label="Frequency (MHz)" value={data.network.frequencyMHz} onChange={v=>updateNetwork("frequencyMHz",v)}/><Editable label="Channel BW (MHz)" value={data.network.channelMHz} onChange={v=>updateNetwork("channelMHz",v)}/></div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:12,marginTop:20}}>{data.network.sites.map((s,i)=><div key={s.id} style={{...card,background:"#f8fafc"}}><h3>{s.id} · {s.role}</h3>{["radioIP","subnet","gateway","antenna"].map(k=><div key={k} style={{marginBottom:10}}><Editable label={k} value={s[k]} onChange={v=>updateSite(i,k,v)}/></div>)}</div>)}</div></section>}
  {tab==="SAT Tests"&&<section style={card}><h2>SAT Test Register</h2><table style={{borderCollapse:"collapse",width:"100%"}}><thead><tr>{["Test ID","Description","Result"].map(t=><th key={t} style={th}>{t}</th>)}</tr></thead><tbody>{data.tests.map((t,i)=><tr key={t.id}><td style={td}>{t.id}</td><td style={td}>{t.name}</td><td style={td}><select style={field} value={t.status} onChange={e=>updateTest(i,"status",e.target.value)}>{["NOT TESTED","PASS","FAIL","N/A"].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table><p style={{color:"#a16207"}}>All results are initially NOT TESTED; only enter actual test evidence.</p></section>}
  {tab==="PTTEP Preview"&&<section style={card}>
   <h2>PTTEP Master Document — Page Preview</h2>
   <p style={{color:"#475569"}}>Word template is the layout authority. The page viewer uses the PDF rendered from the same DOCX that you download.</p>
   <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:14}}>
    <button onClick={renderDoc} style={{padding:"10px 15px",background:"#1d4ed8",color:"white",border:0,borderRadius:5,cursor:"pointer"}} disabled={service==="rendering"}>{service==="rendering"?"Rendering...":"Generate PTTEP DOCX + PDF"}</button>
    {service==="ready"&&<><a href={api+"/api/download/docx"} target="_blank" rel="noreferrer">Download DOCX</a><a href={api+"/api/download/pdf"} target="_blank" rel="noreferrer">Download PDF</a></>}
   </div>
   {service!=="idle"&&<p role="status" style={{color:service==="ready"?"#166534":"#a16207"}}>{service==="ready"?"Rendered from PTTEP Word template; inspect each page before issue.":service}</p>}
   {service==="ready"?<iframe key={previewKey} title="PTTEP SAT PDF paginated preview" src={api+"/api/download/pdf?v="+previewKey} style={{width:"100%",height:"75vh",border:"1px solid #94a3b8",background:"#fff"}}/>:<div style={{background:"#f8fafc",border:"1px dashed #94a3b8",padding:"45px 12px",textAlign:"center"}}>Page-by-page preview will appear after generating the DOCX via the local SAT document service (port 8051).</div>}
   <div style={{marginTop:18,padding:12,background:"#eff6ff",borderRadius:6}}>
    <b>Selected diagram</b> — exact supplied ZMS–MS network diagram retained as source image in the template service.
    <p style={{margin:"8px 0"}}>Diagram is not automatically rewritten when IP addresses are edited. Review and replace the image before issuing changed configuration.</p>
    <label>Optional temporary comparison image: <input type="file" accept="image/png,image/jpeg" onChange={e=>{const f=e.target.files&&e.target.files[0];if(f){const reader=new FileReader();reader.onload=()=>setDiagram(reader.result);reader.readAsDataURL(f)}}}/></label>
    {diagram&&<img src={diagram} alt="Uploaded reference diagram" style={{display:"block",width:"100%",maxWidth:1000,marginTop:12}}/>}
   </div>
   <p style={{color:"#a16207"}}>Backend service and PTTEP DOCX master template are required for export. Without them the UI still supports JSON editing and export.</p>
  </section>}
 </div>
}
