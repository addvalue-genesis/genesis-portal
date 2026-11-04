import React,{useMemo,useState} from 'react';
import {MgwOfferTable} from './MgwQuoteViews';
import {sumMoney0550} from './data/money0550';
import {scheduleCrosswalk0550} from './data/bidVolumeWorkingPreview0550';

const money=v=>Number.isFinite(v)?v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'OPEN';

// Replaces the existing 11.M allocation grid; it is not a new tab/module/store.
export function ScheduleAllocationCrosswalk0550({data,model,savedView,displayView,onEdit,onNavigate,disabled}){
 const [filter,setFilter]=useState('OPEN'),[limit,setLimit]=useState(25);
 const view=useMemo(()=>scheduleCrosswalk0550(data,model,savedView,displayView),[data,model,savedView,displayView]);
 const rows=view.rows.filter(r=>filter==='ALL'||(filter==='B7_B9'?['B7','B8','B9'].includes(r.raw.wbs):r.needsAttention));
 const scopes={SELECTED:'เลือกใช้ใน Working',COMPANY:'COMPANY จัดหา / อ้างอิง',INCLUDED:'รวมในเจ้าของต้นทุนเดิม',NOT_SELECTED:'ยังไม่เลือกใช้'};
 return <>
  <p>ตรวจต่อใน 11.M เดิม: ข้อกำหนดลูกค้า → Working → Customer row → Schedule · กดแก้ที่รายการต้นทางเดิม</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Official to Schedule reconciliation"><thead><tr><th>หมวด</th><th>ราคา Working ที่มี · USD</th><th>10.7 ทบทวนแล้ว · USD</th><th>Schedule ที่บันทึก · USD</th><th>ส่วนต่าง Schedule − 10.7</th><th>ผลตรวจยอด / งานค้าง</th></tr></thead><tbody>{view.reconciliation.map(r=><tr key={r.treatment}><td>{r.treatment==='BASE'?'Base → A1':'Option → A2'}</td><td><strong>{money(r.workingKnownUSD)}</strong><small>{r.workingPriced} owner มีราคา · อีก {r.workingOpen} refs ต้องตรวจราคา/coverage</small></td><td>{money(r.expected)}</td><td>{money(r.allocated)}</td><td>{money(r.difference)}</td><td>{r.state==='AMOUNTS_MATCH'?'ยอดเท่ากัน · ยังต้องตรวจความพร้อมอื่น':r.state==='DIFFERENCE'?'ยอดยังไม่เท่ากัน':'OPEN · ขอบเขต / ราคา / การจัดหมวดยังไม่ครบ'}<small>ยังไม่จัด Schedule {r.unallocatedIds.length} · ราคา 10.7 ยัง OPEN {r.openPriceIds.length} รายการ</small></td></tr>)}</tbody></table></div>
  <p className="p55-note">คอลัมน์ Working แสดงยอดที่คำนวณได้ก่อนทบทวน · การเทียบส่วนต่างใช้ Schedule ที่บันทึกและราคา 10.7 ที่ทบทวนแล้วเสมอ · ยอด Working ที่ทราบแสดงรายแถวด้านล่าง · A1/A2 เป็นยอดสรุปจาก C และการจัดหมวด ห้ามบวกซ้ำ · ยอดเท่ากันยังไม่ยืนยันขอบเขตครบ MR หรืออนุมัติ Release</p>
  <label>รายการที่แสดงใน 11.M <select aria-label="Schedule allocation filter" value={filter} onChange={e=>{setFilter(e.target.value);setLimit(25);}}><option value="OPEN">รายการที่ต้องแก้ / ตรวจต่อ</option><option value="B7_B9">B7–B9 · Survey / Licensing / Insurance</option><option value="ALL">ทุกรายการ รวม COMPANY / Included / ยังไม่เลือก</option></select></label>
  <p>{rows.length} รายการ · แสดง {Math.min(limit,rows.length)} · เปิด/กรองหน้านี้ไม่บันทึกหรืออนุมัติข้อมูล</p>
  <p><strong>ราคาขายจากรายการที่แสดง USD {money(sumMoney0550(rows.filter(r=>Number.isFinite(r.workingUSD)).map(r=>r.workingUSD)))}</strong> · เฉพาะเจ้าของราคาที่เลือกและคำนวณได้ · รายการ OPEN / Included / COMPANY ไม่ถูกแทนด้วยราคา 0 หรือบวกซ้ำ</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Exhibit C allocation"><thead><tr><th>รายการ / เจ้าของต้นทุน</th><th>ข้อกำหนดลูกค้า / หลักฐาน</th><th>ความรับผิดชอบ / ขอบเขต</th><th>Customer row / ราคา USD</th><th>Schedule / สิ่งที่ต้องตรวจ</th><th>แก้ที่รายการเดิม</th></tr></thead><tbody>{rows.slice(0,limit).map(r=><tr key={r.id} data-allocation-line={r.id}>
   <td><strong>{r.raw.description}</strong><small>{r.id} · {r.raw.wbs} · {r.raw.systemToken}</small><small>{scopes[r.scope]}</small>{r.scope==='INCLUDED'&&<small>รวมราคาใน {r.ownerId} · ไม่บวกเพิ่ม</small>}</td>
   <td><details><summary>ข้อกำหนดที่ผูกอยู่ {r.requirements.length} records / ฐานรายการเดิม</summary>{r.requirements.map(q=><p key={q.id}><button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.working-preview.requirement.'+q.id)}>{q.title || q.id}</button><small>{q.id} · {q.state || q.status}</small><small>{q.sourceLocator || q.reference || 'ยังไม่ผูก locator'}</small><small>{q.sourceIds?.length ? q.sourceIds.length+' source refs' : 'ยังไม่ผูกไฟล์ต้นฉบับ'} · {q.responsibility}</small></p>)}<p>{r.raw.requirementRef || 'ยังไม่ระบุ Requirement reference'}</p><small>{r.mr?.reference}</small><p>{r.mr?.note || r.raw.scopeBasis || 'ยังไม่ระบุฐานขอบเขต'}</p></details></td>
   <td>{r.raw.responsibility || r.mr?.responsibility || 'ยังไม่ระบุ'}{r.advisories.map(a=><small key={a}>{a}</small>)}<details><summary>ฐานที่บันทึกใน Working</summary><p>{r.raw.scopeBasis || 'ยังไม่บันทึก'}</p><p>{r.raw.sourceRef}</p></details></td>
   <td>{r.raw.customerRowCode || 'OPEN · ยังไม่ผูก Customer row'}{!r.customerMapped&&<small>Customer row ยังใช้ไม่ได้กับหมวดนี้</small>}<small>{r.line?.quantity ?? r.raw.quantity ?? 'ปริมาณ OPEN'} {r.line?.unit || r.raw.unit}</small>{r.scope==='SELECTED'?<><small>Working ที่ทราบ: {money(r.workingUSD)}</small><small>10.7 ทบทวนแล้ว: {money(r.officialUSD)}</small></>:<small>{r.scope==='INCLUDED'?'ดูราคาจาก owner เดิม':r.scope==='COMPANY'?'อ้างอิงขอบเขต COMPANY':'ยังไม่รวมยอดที่เลือก'}</small>}</td>
   <td>{r.shown?`${r.shown.schedule} / ${r.shown.summary} / ${r.shown.treatment}`:'OPEN · ยังไม่จัดหมวด'}<small>{r.shown?.suggested?'SI แนะนำ · ยังไม่บันทึก':r.binding?'บันทึกแล้ว · '+r.binding.state:'ยังไม่มีการจัดหมวดที่บันทึก'}</small>{r.reasons.map(reason=><small key={reason}>{reason}</small>)}{!!r.binding?.problems.length&&<details><summary>ประเด็นการจัดหมวด {r.binding.problems.length}</summary>{r.binding.problems.map(p=><p key={p}>{p}</p>)}</details>}</td>
   <td><button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.line.'+r.ownerId)}>เปิด Working{r.scope==='INCLUDED'?' owner':''}</button>{r.scope==='SELECTED'&&<button type="button" disabled={disabled} aria-label={'แก้ Schedule '+r.id} onClick={()=>onEdit(r.id)}>แก้ Schedule</button>}<button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.technical.equipment.system.'+r.raw.systemToken)}>12.3 · {r.raw.systemToken}</button></td>
  </tr>)}</tbody></table></div>
  {rows.length>limit&&<button type="button" onClick={()=>setLimit(n=>n+25)}>แสดงอีก 25 รายการ</button>}
 </>;
}

export function WorkingScheduleStatus0550({view,onSave,onAllocate,onNavigate,disabled}){
 const s=view.previewStats;if(!s)return null;
 return <section className="p55-panel" aria-label="Working to Schedule status"><h3>ข้อมูลจาก Working → แบบฟอร์มข้อเสนอ</h3>
  <p>เลือกไว้ {s.active} รายการ · มีการจัดหมวดที่บันทึกแล้ว {s.saved} · ระบบแนะนำเพิ่ม {s.suggested} · ยังตัดสินใจไม่ได้ {s.unresolved}</p>
  <p><strong>ราคาขายที่คำนวณได้ USD {money(s.knownUSD)} จาก {s.priced} รายการ</strong> · อีก {s.unpriced} รายการราคายัง OPEN · ยอดที่ทราบนี้ยังไม่ใช่ราคาครบทั้งโครงการ</p>
  {view.bindings?.some(b=>Number.isFinite(b.amount)&&b.line?.sellBasisState==="WORKING_SELL_KNOWN_COST_UNESTABLISHED")&&<p>มีราคาขาย DIRECT ที่ระบุปริมาณและเรตแล้ว โดยต้นทุนภายในยังไม่ยืนยัน · แสดงราคาขายแยกจากต้นทุน ไม่ถือว่าต้นทุนเป็นศูนย์ และยังไม่ผ่าน Release</p>}
  <p>รายการและราคามาจาก Working ปัจจุบัน รวมราคาผู้ขายที่ยังรอทบทวน · การจัดหมวดอัตโนมัติเป็นข้อเสนอของ SI · ยังไม่อนุมัติหรือออก Release</p>
  <div className="p55-review-toolbar"><button type="button" disabled={disabled||!s.suggested} onClick={onSave}>บันทึกการจัดหมวดร่าง {s.suggested} รายการ</button><button type="button" disabled={disabled} onClick={onAllocate}>ตรวจ / แก้การจัดรายการ 11.M</button></div>
  {view.priceGaps?.length>0&&<details><summary>ดูสาเหตุที่ราคาขายยัง OPEN · {view.priceGaps.length} รายการ</summary>{view.priceGaps.map(g=><p key={g.id}>{g.description} · {g.problems.join(' / ')} <button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.line.'+g.id)}>เปิด Working / แก้ที่ต้นทาง</button></p>)}</details>}
 </section>;
}
export function MgwScheduleSource0550({view,onNavigate,disabled}){
 const sections=view.mgwSections||[],[selected,setSelected]=useState('');
 const section=sections.find(s=>s.id===selected)||sections.find(s=>s.status==='TOTAL_CONFLICT')||sections[0];
 if(!section)return null;
 return <section className="p55-panel" aria-label="MGW source details for Schedule C1"><h3>MGW ที่ใช้ประกอบ C1 · ข้อมูลต้นทางภายใน</h3>
  <label>ระบบ MGW ใน C1 <select aria-label="MGW system in C1" disabled={disabled} value={section.id} onChange={e=>setSelected(e.target.value)}>{sections.map(s=><option key={s.id} value={s.id}>{s.title} · {s.offers.length} รายการ</option>)}</select></label>
  <p><strong>{section.title} · {section.offers.length} รายการจากใบเสนอราคา</strong> · ต้นทุน MGW / จำนวนตาม Quote · ตรวจ MR และราคาขาย Working แยกกัน</p>
  {section.status==='TOTAL_CONFLICT'&&<p>หน้าสรุป USD {money(section.coverTotal)} · รายละเอียดต้นฉบับ USD {money(section.detailTotal)} · แนวทางที่บันทึก 29 ต.ค. 2026 ใช้รายละเอียดในการเตรียมร่าง พร้อมเก็บประเด็นยอดต้นฉบับ</p>}
  {section.workingOwners?.map(owner=><p key={owner.id}>{owner.title} · {owner.selected?'เลือกใช้ใน Working แล้ว':'เป็นทางเลือก / ยังไม่รวมในราคาที่เลือก'} <button type="button" disabled={disabled} onClick={()=>onNavigate?.('bid.budget.working.line.'+owner.id)}>เปิดแพ็กเกจใน Working</button></p>)}
  <p>ตารางต้นทุนนี้ใช้ภายใน · Word/PDF ของแบบฟอร์มส่งออกเฉพาะราคาขายและรายการประกอบที่ไม่คิดซ้ำ</p>
  <div style={{maxHeight:360,overflow:'auto'}}><MgwOfferTable showIds={false} offers={section.offers} onEdit={o=>{if(!disabled)onNavigate?.('bid.vendor.offer.'+o.id);}}/></div>
 </section>;
}
