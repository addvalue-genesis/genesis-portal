import React,{useState} from "react";
import {Field,Select,amount} from "./BidControls";
import {BID_UNITS} from "./data/bidWorkspaceModel";
import {blankSupplyProposalDraft0550,deriveSupplyProposalDraft0550,supplyDraftBacklinks0550,SUPPLY_SERVICE_TREATMENTS_0550} from "./data/supplyProposalDraft0550";

export function SupplyProposalDraftFields0550({data,line,onChange,onNavigate}){
 const [serviceId,setServiceId]=useState("");
 const draft=line.supplyDraft,derived=deriveSupplyProposalDraft0550(data,line),backlinks=supplyDraftBacklinks0550(data,line.id);
 const update=(key,value)=>onChange({...draft,[key]:value});
 const navigate=id=>onNavigate?.("bid.budget.working.line."+id);
 if(line.wbs.startsWith("B"))return <fieldset aria-label="Supply package links for B"><legend>กิจกรรม B กับแพ็กเกจสินค้า</legend><p>ค่าจ้าง ทรัพยากร และราคาบริการยังใช้รายการ B เดิม ร่างการรวมในแพ็กเกจยังไม่เปลี่ยนยอดนี้</p>{backlinks.length?<ul>{backlinks.map(({owner,allocation})=><li key={owner.id}>{owner.description} · {SUPPLY_SERVICE_TREATMENTS_0550.find(([k])=>k===allocation.treatment)?.[1]} · {allocation.basis||"ยังไม่มีฐานขอบเขต"}{onNavigate&&<button type="button" onClick={()=>navigate(owner.id)}>เปิดแพ็กเกจ A · {owner.id}</button>}</li>)}</ul>:<p>ยังไม่มีร่างแพ็กเกจ A ผูกกับงานนี้</p>}</fieldset>;
 if(line.wbs!=="A")return null;
 const offer=data.offers.find(o=>o.id===line.offerId),serviceOptions=data.lines.filter(l=>l.wbs.startsWith("B")&&!draft?.serviceAllocations.some(r=>r.workLineId===l.id));
 return <fieldset aria-label="Separate supply proposal draft"><legend>ประเภทการเสนอและราคาขายแพ็กเกจ · ร่างแยก</legend>
 <p><strong>ยังไม่ใช้ร่างนี้คำนวณ Working / 10.7 / Volume I</strong> ต้นทุน Supplier ราคาขายที่ใช้อยู่ FX และการเลือกคิดเงินของ A/B คงเดิม</p>
 <p>ต้นทางซื้อเดิม: {offer?offer.quoteRef+" · "+amount(offer.unitCost,offer.currency)+" / "+offer.unit:"ต้นทุน manual "+amount(line.manualCost,line.currency)} · ผู้ผลิตและผู้ขายต้นทางยังเก็บใน Offer เดิม</p>
 {!draft?<button type="button" onClick={()=>onChange(blankSupplyProposalDraft0550(line))}>เตรียมร่างประเภทการเสนอ</button>:<>
 <div className="p55-bid-fields">
 <Select label="ประเภทผู้เสนอในร่าง" value={draft.seller} onChange={v=>update("seller",v)} options={[["ADDVALUE","ADDVALUE เสนอตรง"],["EXTERNAL","Vendor ภายนอกเสนอ"]]}/>
 <Field label="ผู้ผลิตของแพ็กเกจ" value={draft.manufacturer} onChange={v=>update("manufacturer",v)}/>
 <Field label="ช่องทางจัดซื้อของแพ็กเกจ" value={draft.procurementChannel} onChange={v=>update("procurementChannel",v)}/>
 <Field label="เลขร่างใบเสนอราคาแพ็กเกจ" value={draft.quotationRef} onChange={v=>update("quotationRef",v)}/>
 <Select label="วิธีตั้งราคาแพ็กเกจใหม่" value={draft.pricingMode} onChange={v=>update("pricingMode",v)} options={[["FIXED","ตั้งราคาขายแพ็กเกจ"],["COST_MARKUP","ต้นทุนรวม + markup"]]}/>
 <Select label="สกุลเงินของร่างแพ็กเกจ" value={draft.currency} onChange={v=>update("currency",v)} options={["THB","USD","EUR"]}/>
 <Select label="หน่วยราคาขายแพ็กเกจ" value={draft.unit} onChange={v=>update("unit",v)} options={BID_UNITS}/>
 {draft.pricingMode==="FIXED"?<Field label="ราคาขายแพ็กเกจใหม่ต่อหน่วย (ร่าง)" type="number" min="0" step="any" value={draft.packageSellRate} onChange={v=>update("packageSellRate",v)}/>:<Field label="Markup แพ็กเกจใหม่จากต้นทุน (%)" type="number" min="0" step="any" value={draft.packageMarkupPct} onChange={v=>update("packageMarkupPct",v)}/>}
 <Field label="ADDVALUE gross margin ชั้นสุดท้ายในร่าง (%)" type="number" min="0" max="99.9999" step="any" value={draft.finalMarginPct} onChange={v=>update("finalMarginPct",v)}/>
 <Field label="SAMTEL markup ในร่าง (%)" type="number" min="0" step="any" value={draft.primeMarkupPct} onChange={v=>update("primeMarkupPct",v)}/>
 <Field label="ฐานขอบเขตและต้นทุนของแพ็กเกจใหม่" value={draft.basis} onChange={v=>update("basis",v)}/></div>
 {draft.seller==="ADDVALUE"?<p>หลักการ ADDVALUE เสนอตรง: ราคาแพ็กเกจ P รวมกำไรผู้จัดหาแล้ว → ชั้นแรก0% → P ÷ (1 − gross margin ชั้นสุดท้าย) × (1 + SAMTEL markup) โดยใช้ E10/E11 → E12 → E13 เดิม ต้องกระทบยอดกิจกรรม B ก่อนใช้จริง และยังไม่แปลงสกุลเงินของร่างนี้อัตโนมัติ</p>:<p>Vendor ภายนอก: เก็บร่างข้อเสนอและขอบเขตที่เกี่ยวข้องแยกจาก Offer และนโยบายราคาที่ใช้อยู่ ยังไม่เปลี่ยนราคา Working</p>}
 {derived.issues.length>0&&<ul>{derived.issues.map(p=><li key={p}>{p}</li>)}</ul>}
 <h4>กิจกรรมและเจ้าของงาน B ที่เกี่ยวข้อง</h4><p>เชื่อมรายการบริการเดิม เช่น PM/Engineering, เอกสาร, FAT, ขนส่ง, Training, SAT และ Warranty ตามขอบเขตจริง ไม่สร้างกิจกรรมหรือค่าใช้จ่ายเพิ่มจากการเปิดร่างนี้</p>
 <div className="p55-bid-fields"><Select label="เลือกรายการ B เพื่อกระทบยอด" value={serviceId} onChange={setServiceId} options={[["","เลือกรายการบริการเดิม"],...serviceOptions.map(l=>[l.id,l.wbs+" · "+l.description+" / "+l.id])]}/><button type="button" disabled={!serviceOptions.some(l=>l.id===serviceId)} onClick={()=>{update("serviceAllocations",[...draft.serviceAllocations,{workLineId:serviceId,treatment:"REVIEW",basis:""}]);setServiceId("");}}>เชื่อมงาน B ในร่าง</button></div>
 {derived.services.map(r=><fieldset key={r.workLineId} aria-label={"B scope allocation "+r.workLineId}><legend>{r.service?.wbs||"B"} · {r.service?.description||r.workLineId}</legend><p>{r.workLineId}</p>
 <Select label={"ขอบเขต B "+r.workLineId} value={r.treatment} onChange={v=>update("serviceAllocations",draft.serviceAllocations.map(a=>a.workLineId===r.workLineId?{...a,treatment:v}:a))} options={SUPPLY_SERVICE_TREATMENTS_0550}/>
 <Field label={"หลักฐานขอบเขต B "+r.workLineId} value={r.basis} onChange={v=>update("serviceAllocations",draft.serviceAllocations.map(a=>a.workLineId===r.workLineId?{...a,basis:v}:a))}/>
 {r.service&&<details><summary>ต้นทางและฐานทรัพยากรงาน B</summary><p>{r.service.sourceRef}</p></details>}
 {r.activities.length>0&&<ul>{r.activities.map(a=><li key={a.id}>{a.id} · {a.title} · {a.responsible} · {a.quantity??"ปริมาณรอตรวจ"} {a.unit}<small>Requirement {a.requirementId} · Deliverable {a.deliverable} · {a.status}</small></li>)}</ul>}
 {r.problems.length>0&&<ul>{r.problems.map(p=><li key={p}>{p}</li>)}</ul>}
 {onNavigate&&r.service&&<button type="button" onClick={()=>navigate(r.workLineId)}>เปิด Working B · {r.workLineId}</button>}
 <button type="button" onClick={()=>update("serviceAllocations",draft.serviceAllocations.filter(a=>a.workLineId!==r.workLineId))}>เลิกผูกในร่าง · {r.workLineId}</button></fieldset>)}
 <p>บันทึกพร้อมรายการ Working ด้วยปุ่มบันทึกเดิมด้านล่าง การเลือก “รวมในแพ็กเกจ” เป็นร่างการจัดสรร ยังไม่ลบ/ยกเลิกเลือก/ทำให้ราคา B เป็นศูนย์</p>
 <button type="button" onClick={()=>onChange(undefined)}>ลบร่างแยกจากรายการนี้</button>
 </>}
 </fieldset>;
}
