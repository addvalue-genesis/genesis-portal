import React,{useState} from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {newId} from "./data/bidWorkspaceModel";
import {EQUATION_INPUTS,evaluateServiceEquation,serviceEquationFields0550,C2_OEM_QUANTITY_ID_0550,C2_OEM_POPULATIONS_0550,C2_OEM_ROUNDING_0550,C2_OEM_RATIO_FORMULA_0550,SPARE_EQUATION_SCHEDULES_0550} from "./serviceEquationRuntime";
import {vendorOfferEntries0550} from './data/vendorRegister0550';
import {SERVICE_EQUATIONS,SYSTEMS} from "./data";
import {Module,Field,Select,Save} from "./BidControls";
import {BidInheritedBasis} from "./BidInheritedBasis";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
export function EquationWorkbench(){
 const {data,put,busy}=useBidWorkspace();
 const blank=()=>({id:"",title:"",systemToken:"TEL-PAGA",equationId:"E05",inputs:{},sourceRef:""});
 const [form,setForm]=useState(blank);
 if(!data)return <p>กำลังเปิดสมการ…</p>;
 const definition=EQUATION_INPUTS[form.equationId],result=evaluateServiceEquation(form.equationId,form.inputs),method=SERVICE_EQUATIONS.find(e=>e.id===form.equationId);
 const field=(k,v)=>setForm(f=>({...f,[k]:v}));
 const input=(k,v)=>setForm(f=>{
  const inputs=f.equationId===C2_OEM_QUANTITY_ID_0550&&f.inputs.mode==="RATIO"?
   {roundingMode:"",roundingSourceRef:"",...f.inputs}:f.inputs;
  return {...f,inputs:{...inputs,[k]:v}};
 });
 const c2Oem=form.equationId===C2_OEM_QUANTITY_ID_0550,ratio=c2Oem&&form.inputs.mode==="RATIO";
 const spareSchedule=SPARE_EQUATION_SCHEDULES_0550[form.equationId];
 const spareWorking=data.lines.filter(l=>l.wbs==='A'&&l.selected&&l.systemToken===form.systemToken&&!l.coveredByLineId&&l.responsibility!=='COMPANY');
 const spareParent=spareWorking.find(l=>l.id===form.inputs.workingLineId);
 const spareOffers=spareSchedule&&spareParent?vendorOfferEntries0550(data).filter(e=>e.working.some(l=>l.id===spareParent.id)||e.offer.supplierQuoteRow?.parentOfferId===spareParent.offerId):[];
 const legacyRounding=ratio&&form.inputs.roundingMode===undefined&&form.inputs.roundingSourceRef===undefined;
 const setC2Mode=mode=>setForm(f=>{
  const {A,B,included}=f.inputs;
  return {...f,inputs:{mode,A:A??null,B:B??null,included:included??null,...(mode==="RATIO"?{roundingMode:"",roundingSourceRef:""}:{})}};
 });
 return <Module id="bid.engineering.equations" title="02.1 Equation Execution — คำนวณและบันทึก Driver">
 <BidInheritedBasis/>
 <p>ตัวเลขคน/วันเป็นค่าแผนงานที่กรอกเองได้ ผลที่บันทึกเลือกไปใช้เป็น Quantity/MD/MH ใน Working ได้โดยไม่คัดลอกตัวเลขซ้ำ สมการคำนวณไม่ใช่การรับรอง Engineering หรืออนุมัติราคา</p>
 <form onSubmit={async e=>{e.preventDefault();if(await put("calculations",{...form,id:form.id||newId("CAL")}))setForm(blank());}}>
 <div className="p55-bid-fields"><Field label="Calculation title" value={form.title} onChange={v=>field("title",v)} placeholder="เช่น PAGA SAT — Telecom Engineer" required/>
 <Select label="Calculation system" value={form.systemToken} onChange={v=>field("systemToken",v)} options={[["COMMON","COMMON / shared"],...SYSTEMS.map(s=>[s.token,s.name])]}/>
 <Select label="Equation" value={form.equationId} onChange={v=>setForm(f=>({...f,equationId:v,inputs:v==="E17"&&data.fx.source&&data.fx.date&&data.fx.thbPerUSD>0?{fx:data.fx.thbPerUSD}:{}}))} options={Object.keys(EQUATION_INPUTS).map(id=>[id,id+" · "+(SERVICE_EQUATIONS.find(e=>e.id===id)?.purpose||EQUATION_INPUTS[id].formula)])}/>
 <Field label="Calculation source / planning basis" value={form.sourceRef} onChange={v=>field("sourceRef",v)} required/></div>
 <p><strong>{ratio?C2_OEM_RATIO_FORMULA_0550(legacyRounding?"CEIL":form.inputs.roundingMode):method?.equation||definition.formula}</strong></p><p>{method?.control}</p>
 {spareSchedule&&<fieldset><legend>{spareSchedule} · Working A → 07 Vendor → SI quantity</legend>
  <p>เลือกเจ้าของจำนวนติดตั้งและ Offer เดียวกัน ระบุข้อ MR / OEM / เกณฑ์ MMC ที่เลือกใช้เป็นฐานภายในใน Source ไม่กำหนดเปอร์เซ็นต์ให้ทุกระบบอัตโนมัติ ผลเป็น Q_add สำหรับ Draft; ราคายังผ่าน E10/E11/E12 และ FX เดิม ยังไม่เข้ายอด A1/A2 จนผูกใน 11.M</p>
  <Select label="Spare installed Working A" value={form.inputs.workingLineId||''} onChange={id=>setForm(f=>{const l=spareWorking.find(l=>l.id===id);return {...f,inputs:{...f.inputs,workingLineId:id,offerId:l?.offerId||'',N:['Pc','U','SET'].includes(l?.unit)?l.quantity:null}};})} options={[["","เลือก Working A"],...spareWorking.map(l=>[l.id,l.description+' / '+l.id])]}/>
  <Select label="Spare source Offer" value={form.inputs.offerId||''} onChange={id=>input('offerId',id)} options={[["","เลือก Offer ที่ผูกกับ Working"],...spareOffers.map(e=>[e.offer.id,e.offer.quoteRef+' / '+e.offer.description])]}/>
  <Field label="Spare Part No. / model / rating basis" value={form.inputs.partNo||''} onChange={v=>input('partNo',v)}/>
  <p>Included in Kit และ Approved Stock เป็นจำนวนของ Part/หน่วย/ช่วงงานเดียวกันเท่านั้น กรอก 0 เมื่อไม่มีจำนวนที่ยืนยันให้หัก; C2 กับ C3 ไม่หักกันอัตโนมัติ</p>
 </fieldset>}
 {c2Oem&&<>
  <p>Exhibit C2 Notes 1–3 / MR Appendix 10 / STD TEL-001 §7.7.1 · ใช้ต่อ Main Equipment No. และ Part No. ถึง PAC อ้างเอกสาร CUS หรือ OEM ที่ระบุจำนวนหรืออัตราส่วน</p>
  <div className="p55-bid-fields">
   <Select label="C2 quantity basis" value={form.inputs.mode??"DIRECT"} onChange={setC2Mode} options={[["DIRECT","จำนวนที่ระบุโดยตรง"],["RATIO","อัตราส่วนต่อกลุ่ม"]]}/>
   {ratio&&<>
    <Select label="C2 population basis" value={form.inputs.populationBasis??""} onChange={value=>input("populationBasis",value)} options={[["","เลือกฐานตามเอกสาร"],...C2_OEM_POPULATIONS_0550]}/>
    <Select label="C2 rounding mode" value={form.inputs.roundingMode??""} onChange={value=>input("roundingMode",value)} options={[["","เลือกวิธีนับเศษตามเอกสาร"],...C2_OEM_ROUNDING_0550]}/>
    <Field label="C2 rounding source reference" value={form.inputs.roundingSourceRef} onChange={value=>input("roundingSourceRef",value)} placeholder="เลขเอกสาร / Rev. / หน้า / ข้อที่ระบุวิธีนับเศษ"/>
   </>}
  </div>
  {ratio&&<p>ปัดจำนวนกลุ่มตามเอกสารก่อนคูณจำนวนอะไหล่ต่อกลุ่ม แล้วหักจำนวนที่รวมไว้สำหรับ Part No. และงานเดียวกัน{legacyRounding&&' · รายการเดิมใช้ CEIL เมื่อแก้ Inputs ให้เลือกวิธีนับเศษและระบุเอกสาร'}</p>}
 </>}
 {form.equationId==="B5-SPARE-QTY"&&<p>ใช้ต่อระบบ / ไซต์ / ช่วงงาน / Part No. เลือกจำนวนรอบสำหรับอะไหล่ที่ใช้หมด หรือจำนวนทีมพร้อมกันสำหรับชุดที่ใช้ซ้ำ หาก OEM ให้จำนวนตรง ให้กรอกจำนวนรอบ 1 และจำนวน OEM ต่อรอบ ระบุเอกสารที่รองรับจำนวนทั้งหมดและยอดที่รวมไว้ ใช้หน่วย U, Pc หรือ SET ให้ตรงทั้งสมการและ Working หากคำนวณได้ 0 ให้บันทึกเป็นหลักฐานรวมในแพ็กเกจเดิม</p>}
 {form.equationId==="B5-SPARE-STOCK"&&<p>ใช้กับ Part No. ที่เปลี่ยนทดแทนกันได้ ระบุแหล่งอัตราเสียของ OEM ช่วงเวลาที่ไม่มีของเติม และเป้าหมายความพอใช้ ใช้แบบจำลองอัตราเสียคงที่และการเสียอิสระ แยกจำนวนที่ต้องใช้ตามแผนออกจากสต็อกเผื่อเสีย</p>}
 <div className="p55-bid-fields">{serviceEquationFields0550(form.equationId,form.inputs).map(f=><Field key={f.key} label={f.label+(f.optional?" (optional)":"")} type="number" step={c2Oem?1:"any"} min={f.min} max={f.max} value={form.inputs[f.key]} onChange={v=>input(f.key,v)}/>)}</div>
 {definition.rows&&<><div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Work-object ID</th>{definition.rows.map(f=><th key={f.key}>{f.label}</th>)}<th>Action</th></tr></thead><tbody>{(form.inputs.rows||[]).map((r,i)=><tr key={i}><td><input aria-label={"Work object "+(i+1)} value={r.id} onChange={e=>input("rows",form.inputs.rows.map((row,j)=>i===j?{...row,id:e.target.value}:row))}/></td>{definition.rows.map(f=><td key={f.key}><input aria-label={f.label+" row "+(i+1)} type="number" step="any" min={f.min} max={f.max} value={r[f.key]??""} onChange={e=>input("rows",form.inputs.rows.map((row,j)=>i===j?{...row,[f.key]:e.target.value===""?null:Number(e.target.value)}:row))}/></td>)}<td><button type="button" onClick={()=>input("rows",form.inputs.rows.filter((_,j)=>i!==j))}>เอาแถวออก</button></td></tr>)}</tbody></table></div><button type="button" onClick={()=>input("rows",[...(form.inputs.rows||[]),{id:newId("OBJ")}])}>เพิ่ม Work object</button></>}
 <output className="p55-bid-result" aria-label="Equation result">{result.state}: {result.value===null?"OPEN":result.value.toLocaleString("en-US",{maximumFractionDigits:6})+" "+result.unit}{result.MH!==undefined&&" / "+result.MH+" MH"}</output>
 {result.installedPopulation!==undefined&&<p>A × B · จำนวนชิ้นส่วนรุ่นเดียวกันที่ติดตั้ง {result.installedPopulation.toLocaleString('en-US')}</p>}
 {result.requiredQuantity!==undefined&&<p>Q_required ก่อนหักที่รวมไว้ {result.requiredQuantity.toLocaleString('en-US')}</p>}
 {result.reserve!==undefined&&<p>จำนวนเสียคาดหมาย {result.meanFailures.toPrecision(4)} · สต็อกเผื่อเสีย {result.reserve} · โอกาสพอใช้ {result.coveragePct.toFixed(4)}%</p>}
 {result.errors.length>0&&<p>{result.errors.join(" · ")}</p>}<Save busy={busy}>บันทึกผลและ Inputs</Save>{form.id&&<button type="button" onClick={()=>setForm(blank())}>รายการใหม่</button>}
 </form>
 <div className="p55-table-wrap"><table className="p55-table" aria-label="Saved calculations"><thead><tr><th>System / calculation</th><th>Equation / result</th><th>Source</th><th>ID / edit</th></tr></thead><tbody>{data.calculations.map(c=>{const r=evaluateServiceEquation(c.equationId,c.inputs);return <tr key={c.id} data-component-key={"bid.engineering.calculation."+c.id}><td>{c.systemToken}<small>{c.title}</small></td><td>{c.equationId} · {r.value===null?"OPEN":r.value+" "+r.unit}{r.MH!==undefined&&<small>{r.MH} MH</small>}</td><td>{c.sourceRef}</td><td><ComponentCopyId projectId="PJ2608-0550" componentKey={"bid.engineering.calculation."+c.id}/><button type="button" onClick={()=>setForm(JSON.parse(JSON.stringify(c)))}>แก้ Inputs</button></td></tr>;})}</tbody></table></div>
 </Module>;
}
