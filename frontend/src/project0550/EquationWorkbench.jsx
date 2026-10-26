import React,{useState} from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {newId} from "./data/bidWorkspaceModel";
import {EQUATION_INPUTS,evaluateServiceEquation} from "./serviceEquationRuntime";
import {SERVICE_EQUATIONS,SYSTEMS} from "./data";
import {Module,Field,Select,Save} from "./BidControls";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
export function EquationWorkbench(){
 const {data,put,busy}=useBidWorkspace();
 const blank=()=>({id:"",title:"",systemToken:"TEL-PAGA",equationId:"E05",inputs:{},sourceRef:""});
 const [form,setForm]=useState(blank);
 if(!data)return <p>กำลังเปิดสมการ…</p>;
 const definition=EQUATION_INPUTS[form.equationId],result=evaluateServiceEquation(form.equationId,form.inputs),method=SERVICE_EQUATIONS.find(e=>e.id===form.equationId);
 const field=(k,v)=>setForm(f=>({...f,[k]:v}));const input=(k,v)=>setForm(f=>({...f,inputs:{...f.inputs,[k]:v}}));
 return <Module id="bid.engineering.equations" title="02.1 Equation Execution — คำนวณและบันทึก Driver">
 <p>ตัวเลขคน/วันเป็นค่าแผนงานที่กรอกเองได้ ผลที่บันทึกเลือกไปใช้เป็น Quantity/MD/MH ใน Working ได้โดยไม่คัดลอกตัวเลขซ้ำ สมการคำนวณไม่ใช่การรับรอง Engineering หรืออนุมัติราคา</p>
 <form onSubmit={async e=>{e.preventDefault();if(await put("calculations",{...form,id:form.id||newId("CAL")}))setForm(blank());}}>
 <div className="p55-bid-fields"><Field label="Calculation title" value={form.title} onChange={v=>field("title",v)} placeholder="เช่น PAGA SAT — Telecom Engineer" required/>
 <Select label="Calculation system" value={form.systemToken} onChange={v=>field("systemToken",v)} options={[["COMMON","COMMON / shared"],...SYSTEMS.map(s=>[s.token,s.name])]}/>
 <Select label="Equation" value={form.equationId} onChange={v=>setForm(f=>({...f,equationId:v,inputs:{}}))} options={Object.keys(EQUATION_INPUTS).map(id=>[id,id+" · "+(SERVICE_EQUATIONS.find(e=>e.id===id)?.purpose||EQUATION_INPUTS[id].formula)])}/>
 <Field label="Calculation source / planning basis" value={form.sourceRef} onChange={v=>field("sourceRef",v)} required/></div>
 <p><strong>{method?.equation||definition.formula}</strong></p><p>{method?.control}</p>
 <div className="p55-bid-fields">{definition.fields.map(f=><Field key={f.key} label={f.label} type="number" step="any" min={f.min} max={f.max} value={form.inputs[f.key]} onChange={v=>input(f.key,v)}/>)}</div>
 {definition.rows&&<><div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Work-object ID</th>{definition.rows.map(f=><th key={f.key}>{f.label}</th>)}<th>Action</th></tr></thead><tbody>{(form.inputs.rows||[]).map((r,i)=><tr key={i}><td><input aria-label={"Work object "+(i+1)} value={r.id} onChange={e=>input("rows",form.inputs.rows.map((row,j)=>i===j?{...row,id:e.target.value}:row))}/></td>{definition.rows.map(f=><td key={f.key}><input aria-label={f.label+" row "+(i+1)} type="number" step="any" min={f.min} max={f.max} value={r[f.key]??""} onChange={e=>input("rows",form.inputs.rows.map((row,j)=>i===j?{...row,[f.key]:e.target.value===""?null:Number(e.target.value)}:row))}/></td>)}<td><button type="button" onClick={()=>input("rows",form.inputs.rows.filter((_,j)=>i!==j))}>เอาแถวออก</button></td></tr>)}</tbody></table></div><button type="button" onClick={()=>input("rows",[...(form.inputs.rows||[]),{id:newId("OBJ")}])}>เพิ่ม Work object</button></>}
 <output className="p55-bid-result" aria-label="Equation result">{result.state}: {result.value===null?"OPEN":result.value.toLocaleString("en-US",{maximumFractionDigits:6})+" "+result.unit}{result.MH!==undefined&&" / "+result.MH+" MH"}</output>
 {result.errors.length>0&&<p>{result.errors.join(" · ")}</p>}<Save busy={busy}>บันทึกผลและ Inputs</Save>{form.id&&<button type="button" onClick={()=>setForm(blank())}>รายการใหม่</button>}
 </form>
 <div className="p55-table-wrap"><table className="p55-table" aria-label="Saved calculations"><thead><tr><th>System / calculation</th><th>Equation / result</th><th>Source</th><th>ID / edit</th></tr></thead><tbody>{data.calculations.map(c=>{const r=evaluateServiceEquation(c.equationId,c.inputs);return <tr key={c.id} data-component-key={"bid.engineering.calculation."+c.id}><td>{c.systemToken}<small>{c.title}</small></td><td>{c.equationId} · {r.value===null?"OPEN":r.value+" "+r.unit}{r.MH!==undefined&&<small>{r.MH} MH</small>}</td><td>{c.sourceRef}</td><td><ComponentCopyId componentKey={"bid.engineering.calculation."+c.id}/><button type="button" onClick={()=>setForm(JSON.parse(JSON.stringify(c)))}>แก้ Inputs</button></td></tr>;})}</tbody></table></div>
 </Module>;
}
