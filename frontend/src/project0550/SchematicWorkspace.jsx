import React,{useEffect,useState} from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {newId} from "./data/bidWorkspaceModel";
import {SYSTEMS,BUDGETARY_ESTIMATE} from "./data";
import {Module,Field,Select,Save} from "./BidControls";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
export function SchematicWorkspace({onOpenSystem,navigationTarget}){
 const {data,put,busy}=useBidWorkspace();
 const [system,setSystem]=useState("ALL");
 useEffect(()=>{if(navigationTarget?.startsWith("bid.schematic."))setSystem("ALL");},[navigationTarget]);
 const [node,setNode]=useState({id:"",systemToken:"TEL-PAGA",site:"",label:"",kind:"EQUIPMENT",sourceRef:""});
 const [edge,setEdge]=useState({id:"",from:"",to:"",label:"",sourceRef:""});
 if(!data)return <p>กำลังโหลด Schematic…</p>;
 const nodes=data.nodes.filter(n=>system==="ALL"||n.systemToken===system),ids=new Set(nodes.map(n=>n.id)),edges=data.edges.filter(e=>ids.has(e.from)&&ids.has(e.to));
 const positions=new Map(nodes.map((n,i)=>[n.id,{x:40+(i%3)*300,y:45+Math.floor(i/3)*130}]));
 const components=BUDGETARY_ESTIMATE.partA.find(s=>s.token===system)?.components||[];
 return <div className="p55-stack"><Module id="bid.schematic.canvas" title="05.3 Overall / Schematic per system">
 <Select label="Schematic system" value={system} onChange={setSystem} options={[["ALL","Overall — all registered system nodes"],...SYSTEMS.map(s=>[s.token,s.name])]}/>
 <p>ตำแหน่งวาดเพื่อให้อ่านง่าย ไม่ใช่ตำแหน่งภูมิศาสตร์ ระยะสาย หรือผลคำนวณ RF เส้นเชื่อมแสดงเฉพาะรายการที่ลงทะเบียนพร้อม source reference</p>
 {nodes.length?<div className="p55-table-wrap"><svg viewBox={`0 0 940 ${Math.max(240,Math.ceil(nodes.length/3)*130+45)}`} role="img" aria-label="0550 registered schematic" style={{width:"100%",minWidth:650}}>
 {edges.map(e=>{const a=positions.get(e.from),b=positions.get(e.to);return <g key={e.id}><path d={`M${a.x+120},${a.y+72} L${b.x+120},${b.y}`} fill="none" stroke="#147a9a" strokeWidth="2"/><text x={(a.x+b.x)/2+120} y={(a.y+b.y)/2+34} textAnchor="middle" fontSize="11">{e.label}</text></g>;})}
 {nodes.map(n=>{const p=positions.get(n.id);return <g key={n.id} role="button" tabIndex="0" aria-label={"Open system "+n.label} onClick={()=>onOpenSystem(n.systemToken)} onKeyDown={e=>{if(e.key==="Enter")onOpenSystem(n.systemToken);}} style={{cursor:"pointer"}}><rect x={p.x} y={p.y} width="240" height="72" rx="8" fill="#e8f5fb" stroke="#1681a2"/><text x={p.x+12} y={p.y+23} fontSize="13">{n.label.slice(0,30)}</text><text x={p.x+12} y={p.y+44} fontSize="11">{n.site} · {n.systemToken}</text><text x={p.x+12} y={p.y+61} fontSize="10">{n.kind}</text></g>;})}</svg></div>:<><p>ยังไม่มี topology ที่ลงทะเบียนสำหรับมุมมองนี้ รายการด้านล่างเป็น scope/component inventory เดิม จึงไม่วาดเส้นเชื่อมที่ไม่มีหลักฐาน</p><div className="p55-grid p55-grid--2">{(system==="ALL"?SYSTEMS:components.map(c=>({token:c.id,name:c.item,ref:c.source}))).map(s=><div className="p55-evidence-card" key={s.token}><strong>{s.name}</strong><small>{s.token} · {s.ref}</small><button type="button" onClick={()=>onOpenSystem(system==="ALL"?s.token:system)}>เปิดระบบ / BOM</button></div>)}</div></>}
 <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Node / site</th><th>System / source</th><th>ID / edit</th></tr></thead><tbody>{nodes.map(n=><tr key={n.id} data-component-key={"bid.schematic.node."+n.id}><td>{n.label}<small>{n.site}</small></td><td>{n.systemToken}<small>{n.sourceRef}</small></td><td><ComponentCopyId projectId="PJ2608-0550" componentKey={"bid.schematic.node."+n.id}/><button type="button" onClick={()=>setNode({...n})}>แก้ไข</button></td></tr>)}</tbody></table></div>
 <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>From → To / function</th><th>Source</th><th>ID / edit</th></tr></thead><tbody>{edges.map(e=><tr key={e.id} data-component-key={"bid.schematic.edge."+e.id}><td>{data.nodes.find(n=>n.id===e.from)?.label} → {data.nodes.find(n=>n.id===e.to)?.label}<small>{e.label}</small></td><td>{e.sourceRef}</td><td><ComponentCopyId projectId="PJ2608-0550" componentKey={"bid.schematic.edge."+e.id}/><button type="button" onClick={()=>setEdge({...e})}>แก้ไข</button></td></tr>)}</tbody></table></div>
 </Module><Module id="bid.schematic.editor" title="ลงทะเบียน Node / Interface จาก Drawing" open={false}>
 <form onSubmit={async e=>{e.preventDefault();if(await put("nodes",{...node,id:node.id||newId("NODE")}))setNode({...node,id:"",label:""});}}><div className="p55-bid-fields"><Select label="Node system" value={node.systemToken} onChange={v=>setNode(n=>({...n,systemToken:v}))} options={SYSTEMS.map(s=>[s.token,s.name])}/>{[["label","Node label"],["site","Node site"],["kind","Node function"],["sourceRef","Node drawing / revision / page"]].map(([k,l])=><Field key={k} label={l} value={node[k]} onChange={v=>setNode(n=>({...n,[k]:v}))} required/>)}</div><Save busy={busy}>บันทึก Node</Save><button type="button" onClick={()=>setNode({...node,id:"",label:""})}>Node ใหม่</button></form>
 <form onSubmit={async e=>{e.preventDefault();if(await put("edges",{...edge,id:edge.id||newId("EDGE")}))setEdge({id:"",from:"",to:"",label:"",sourceRef:""});}}><div className="p55-bid-fields">{[["from","Interface from"],["to","Interface to"]].map(([k,l])=><Select key={k} label={l} value={edge[k]} onChange={v=>setEdge(e=>({...e,[k]:v}))} options={[["","เลือก Node"],...data.nodes.map(n=>[n.id,n.site+" / "+n.label])]}/>)}<Field label="Interface label" value={edge.label} onChange={v=>setEdge(e=>({...e,label:v}))} required/><Field label="Interface drawing / revision / page" value={edge.sourceRef} onChange={v=>setEdge(e=>({...e,sourceRef:v}))} required/></div><Save busy={busy}>บันทึก Interface</Save></form>
 </Module></div>;
}
