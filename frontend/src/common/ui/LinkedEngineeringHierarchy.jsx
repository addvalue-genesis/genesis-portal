import React,{useState} from "react";
const id=(prefix,n)=>prefix+"-"+String(n+1).padStart(2,"0");
const fmt=(items)=>items.length?items.join(" · "):"NOT_MAPPED";
export function LinkedEngineeringHierarchy({auditDimensions=[],chain=[],domains=[],kernels=[],systemKernelMap=[],projectId}){
 const [open,setOpen]=useState(new Set(["AUDIT","CHAIN","KNOWLEDGE"]));
 const toggle=x=>setOpen(old=>{const n=new Set(old);n.has(x)?n.delete(x):n.add(x);return n});
 const groups=[
  {id:"AUDIT",name:"Requirement audit dimensions",count:auditDimensions.length},
  {id:"CHAIN",name:"First Principles / lifecycle sequence",count:chain.length},
  {id:"KNOWLEDGE",name:"Knowledge domains → Engineering kernels → Equations",count:kernels.reduce((n,k)=>n+k.equations.length,0)}
 ];
 const sysNames=Object.fromEntries(systemKernelMap.map(x=>[x.token,x.name]));
 const btn=(key)=><button type="button" className="p55-row-toggle" aria-label={(open.has(key)?"Collapse ":"Expand ")+key} aria-expanded={open.has(key)} onClick={()=>toggle(key)}>{open.has(key)?"−":"+"}</button>;
 return <section className="p55-panel">
  <div className="p55-eyebrow">LINKED CONTROL HIERARCHY / {projectId}</div>
  <h3>Requirement → Method → Engineering Proof → Cost</h3>
  <p className="p55-note">รหัส AUD/STEP/DOM/KERNEL/EQ ใช้ชี้ไปยัง Registry เดิม; การเชื่อมกับ MR/ระบบจริงแสดงเฉพาะเมื่อมี Binding ไม่ใช่ยืนยัน Compliance โดยอัตโนมัติ</p>
  <div className="p55-segmented" style={{display:"flex",justifyContent:"flex-end",gap:8,marginBottom:8}}>
   <button type="button" onClick={()=>setOpen(new Set([...groups.map(x=>x.id),...domains.map(x=>"DOM-"+x.id),...kernels.map(x=>"KERNEL-"+x.id)]))}>Expand all</button>
   <button type="button" onClick={()=>setOpen(new Set())}>Collapse all</button>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
   <thead><tr><th style={{width:50}}>+/−</th><th style={{width:150}}>Reference ID</th><th>หัวข้อหลัก / ย่อย</th><th>Parent / Related IDs</th><th>State</th></tr></thead><tbody>
   {groups.map(g=><React.Fragment key={g.id}>
    <tr><td>{btn(g.id)}</td><td><strong>{g.id}</strong></td><td><strong>{g.name}</strong><small>{g.count} entries</small></td><td>GENESS COMMON / {projectId}</td><td>REGISTERED</td></tr>
    {g.id==="AUDIT"&&open.has(g.id)&&auditDimensions.map((x,i)=><tr key={id("AUD",i)}><td></td><td>{id("AUD",i)}</td><td>{x}</td><td>REQ-ID → AUD-ID (mapping pending)</td><td>CHECK_REQUIRED</td></tr>)}
    {g.id==="CHAIN"&&open.has(g.id)&&chain.map((x,i)=><tr key={id("STEP",i)}><td></td><td>{id("STEP",i)}</td><td>{x}</td><td>{i? id("STEP",i-1)+" → ":"SOURCE → "}{id("STEP",i)}</td><td>METHOD_DEFINED</td></tr>)}
    {g.id==="KNOWLEDGE"&&open.has(g.id)&&domains.map(d=>{
     const matching=kernels.filter(k=>{const domainText=(k.domain||"").toLowerCase();const keys={MATH:["mathemat"],PHYSICS:["electromagnet","acoust","optic","mechanic","probab"],TELECOM:[],NETWORK:["capacity"],ELECTRICAL:["electrical","energy"],ECON:[],ACCOUNTING:[],LOGISTICS:[],PM:[],GOV:[]};return (keys[d.id]||[]).some(x=>domainText.includes(x))});
     return <React.Fragment key={d.id}><tr><td>{btn("DOM-"+d.id)}</td><td>{"DOM-"+d.id}</td><td><strong>{d.name}</strong><small>{d.purpose}</small></td><td>KNOWLEDGE</td><td>DOMAIN</td></tr>
     {open.has("DOM-"+d.id)&&<tr><td></td><td></td><td colSpan={3}><strong>Topics:</strong> {d.topics.join(" · ")}<p className="p55-note">Kernel association below uses explicit KERNEL IDs in the separate registry; topic classification alone does not prove mapping.</p></td></tr>}
     {open.has("DOM-"+d.id)&&matching.map(k=><React.Fragment key={k.id}><tr><td>{btn("KERNEL-"+k.id)}</td><td>{"KERNEL-"+k.id}</td><td><strong>{k.name}</strong></td><td>{"DOM-"+d.id+" / STEP-05"}</td><td>{k.appliesTo?.length||0} SYSTEM BINDINGS</td></tr>
     {open.has("KERNEL-"+k.id)&&<tr><td></td><td></td><td colSpan={3}><strong>Bound systems:</strong> {fmt((k.appliesTo||[]).map(x=>x+" "+(sysNames[x]||"")))}<p className="p55-note">OPEN / MAPPED_PRELIMINARY does not indicate engineering approval.</p></td></tr>}
     {open.has("KERNEL-"+k.id)&&k.equations.map((eq,j)=><tr key={id(k.id,j)}><td></td><td>{id(k.id,j)}</td><td><strong>{eq.name}</strong><small>{eq.formula}</small></td><td>{"KERNEL-"+k.id+" → STEP-08"}</td><td>FORMULA_REGISTERED</td></tr>)}
     </React.Fragment>)}
     </React.Fragment>;
    })}
   </React.Fragment>)}
   </tbody></table></div>
  <p className="p55-note">Cross-reference IDs are navigation identifiers, not new extracted requirements. A project requirement must receive its own evidence-backed REQ-ID before a full causal thread can be certified.</p>
 </section>;
}
