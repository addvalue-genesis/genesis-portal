import React,{useMemo,useState} from 'react';
import {useBidWorkspace} from './BidWorkspaceContext';
import {Field,Select,Save} from './BidControls';
import {SYSTEMS} from './data';
import {deriveBidPunch0550} from './data/bidPunch0550';
import {BID_PUNCH_STATES} from '../common/governance/bidPunch';

const severityNames={MAJOR:'Major · กระทบราคา/ขอบเขต/การยื่น',MINOR:'Minor · งานบันทึก/รายละเอียด',REVIEW:'ต้องประเมินผลกระทบ'};
const phaseNames={REVIEW:'ตรวจข้อกำหนดกำหนดส่งก่อน',BID:'พร้อม Bid',BEFORE_PO:'ก่อน PO',POST_AWARD:'หลัง PO'};
const effectNames={INPUT:'ขาด/ผิดฐานตัวเลข',SCOPE:'เสี่ยงเปลี่ยนขอบเขตหรือราคา',EVIDENCE:'หลักฐาน/เอกสาร/การทบทวน',UNKNOWN:'ยังประเมินผลต่อราคาไม่ได้'};
export function BidPunch0550({system='ALL',onNavigate,onOpenSource}){
 const {data,model,busy,change,reviewDate}=useBidWorkspace();
 const view=useMemo(()=>data&&model?deriveBidPunch0550(data,model,SYSTEMS,reviewDate):null,[data,model,reviewDate]);
 const [filter,setFilter]=useState('ALL'),[limit,setLimit]=useState(40),[editing,setEditing]=useState(null),[message,setMessage]=useState('');
 if(!view)return null;
 const matches=r=>filter==='ALL'?true:filter==='INPUT'?r.hardPriceBlock:filter==='UNPLANNED'?!r.planComplete:filter==='STALE'?r.stale:r.severity===filter;
 const rows=view.rows.filter(r=>(system==='ALL'||r.systemTokens.includes(system)||r.systemTokens.includes('COMMON'))&&matches(r));
 rows.sort((a,b)=>Number(b.hardPriceBlock)-Number(a.hardPriceBlock)||Number(b.requiredWithBid)-Number(a.requiredWithBid)||({MAJOR:0,REVIEW:1,MINOR:2}[a.severity]-{MAJOR:0,REVIEW:1,MINOR:2}[b.severity])||a.id.localeCompare(b.id));
 const active=editing&&view.rows.find(r=>r.id===editing.id);
 const edit=r=>{setMessage('');setEditing(r.plan?{...r.plan}:{id:r.id,basisKey:r.basisKey,severity:r.severity,phase:r.phase,action:r.action,owner:'',dueOn:'',priceBasis:'',reference:''});};
 const field=(k,v)=>setEditing(p=>({...p,[k]:v}));
 return <section aria-label="Bid Punch List" className="p55-panel">
  <h3>Punch List เพื่อเดินงานเสนอราคา</h3>
  <p><strong>{view.selectedDraftAmountsComplete?'ต้นทุนและราคาคำนวณครบเจ้าของที่เลือกแล้ว · ทำร่างต่อพร้อมตรวจ Punch':view.canContinuePricing?'ทำร่างต่อจากราคาที่มี พร้อมจัดฐานส่วนที่ขาด':'ต้องจัดฐานตัวเลขก่อนรวมราคาร่าง'}</strong><br/>มีราคา {view.pricedOwners}/{view.owners} เจ้าของ · ฐานต้นทุน/ราคาขาด {view.missingOwnerIds.length} เจ้าของ · เงื่อนไขขวางตัวเลข {view.numericBlockers} รายการ</p>
  <div className="p55-review-toolbar"><button type="button" onClick={()=>onNavigate('bid.budget.working.part.A')}>เปิด Working / ทำร่างราคาต่อ</button><button type="button" onClick={()=>onNavigate('bid.budget.official.summary')}>ยอด A/B/C / ฐานประมาณการ</button><button type="button" onClick={()=>onNavigate('bid.technical.vdrl')}>เอกสาร / กำหนดส่ง 12.V</button></div>
  <p>Major {view.major} · Minor {view.minor} · รอประเมิน {view.unassessed} · มีแผนจัดการครบ {view.planned} · แผนฐานเปลี่ยน {view.stalePlans}<br/>รวมต้นเหตุร่วมครั้งเดียว แทนการนับประเด็นซ้ำตามจำนวน MR · Major/Minor เป็นลำดับงาน กำหนดส่งเป็นอีกเรื่องหนึ่ง</p>
  <p>ร่างตัวเลขครบแถวที่เลือกยังไม่ยืนยันว่าครบ RFQ · แผนด้านล่างไม่ปิด OPEN ไม่เปลี่ยน Proof/ราคา และไม่อนุญาตออกข้อเสนอ · สถานะวิศวกรรมและ Release ใช้ผลตรวจเดิม</p>
  <details><summary>ความหมาย DRAFT / Proof / ราคา / Release ที่มีในโค้ด</summary><div className="p55-table-wrap"><table className="p55-table" aria-label="Bid workflow state meanings"><thead><tr><th>ชั้นข้อมูล</th><th>สถานะเดิม</th><th>ความหมาย / ผลต่อการทำงาน</th></tr></thead><tbody>{BID_PUNCH_STATES.map(([layer,state,meaning])=><tr key={layer}><td>{layer}</td><td>{state}</td><td>{meaning}</td></tr>)}</tbody></table></div></details>
  <label>แสดง Punch<select aria-label="Bid Punch filter" value={filter} onChange={e=>{setFilter(e.target.value);setLimit(40);}}>{[['ALL','ทั้งหมด'],['INPUT','ขวางฐานตัวเลข'],['MAJOR','Major'],['MINOR','Minor'],['REVIEW','รอประเมินผลกระทบ'],['UNPLANNED','ยังไม่มีแผนจัดการครบ'],['STALE','แผนฐานเปลี่ยน']].map(([v,t])=><option key={v} value={v}>{t}</option>)}</select></label>
  {message&&<p role="status">{message}</p>}
  {editing&&active&&<form aria-label="Bid Punch plan editor" onSubmit={async e=>{e.preventDefault();const current=view.rows.find(r=>r.id===editing.id);if(!current)return;const plan={...editing,basisKey:current.basisKey};const ok=await change(d=>({...d,bidPunchPlans:[...(d.bidPunchPlans||[]).filter(p=>p.id!==plan.id),plan]}),'Save bid Punch work plan / '+plan.id);if(ok){setEditing(null);setMessage('บันทึกแผนจัดการแล้ว · ราคา สถานะต้นทาง และผลตรวจวิศวกรรมใช้ข้อมูลเดิม');}}}>
   <h4>{active.title}</h4><p>{active.context}</p>{editing.basisKey!==active.basisKey&&<p role="alert">ฐานเปลี่ยนจากวันที่บันทึกแผน ต้องตรวจแผนกับข้อมูลปัจจุบันก่อนบันทึกใหม่</p>}
   <div className="p55-bid-fields">
    <Select label="Punch severity" value={editing.severity} onChange={v=>field('severity',v)} options={Object.entries(severityNames)}/>
    <Select label="Punch planned phase" value={editing.phase} onChange={v=>field('phase',v)} options={Object.entries(phaseNames)}/>
    <Field label="Punch action" value={editing.action} onChange={v=>field('action',v)} required/>
    <Field label="Punch owner" value={editing.owner} onChange={v=>field('owner',v)} required/>
    <Field label="Punch due date" type="date" value={editing.dueOn} onChange={v=>field('dueOn',v)} required/>
    <Field label="Punch cost / price treatment" value={editing.priceBasis} onChange={v=>field('priceBasis',v)} required/>
    <Field label="Punch source / timing reference" value={editing.reference} onChange={v=>field('reference',v)} required/>
   </div>
   <p>ระบุราคา Supplier / ประมาณการ / วงเงินเผื่อ / ไม่มีผลต่อยอด พร้อมเหตุผล การเลือกหลัง PO เป็นแผนเสนอ ต้องตรวจว่าข้อกำหนดยอมให้ส่งตามได้ · ข้อบังคับพร้อม Bid และข้อผิดฐานตัวเลขยังคง Major</p>
   <Save busy={busy}>บันทึกแผนจัดการ Punch</Save><button type="button" onClick={()=>setEditing(null)}>ยกเลิกแผนที่ยังไม่บันทึก</button>
  </form>}
  <p>แสดง {Math.min(rows.length,limit)} / {rows.length} ต้นเหตุในระบบที่เลือก · งาน COMMON แสดงร่วมและไม่สร้างต้นทุนซ้ำ</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Bid Punch actions"><thead><tr><th>ประเด็น / ที่มา</th><th>ระดับ / ผลต่อราคา</th><th>วิธีเดินงานต่อ / กำหนดส่ง</th><th>แผน / ทำงานเดิม</th></tr></thead><tbody>{rows.slice(0,limit).map(r=><tr key={r.id} data-bid-punch={r.id}><td><strong>{r.title}</strong><small>{r.context}</small><small>{r.systemTokens.join(' / ')} · เกี่ยวข้อง {r.requirementIds.length} ข้อกำหนด</small>{r.shared&&<small>ต้นเหตุร่วม · ตรวจ/จัดต้นทุนครั้งเดียว</small>}<details><summary>ข้อกำหนดที่เกี่ยวข้อง {r.requirementIds.length} รายการ</summary>{r.requirementIds.slice(0,20).map(id=><button type="button" key={id} onClick={()=>onNavigate("bid.working-preview.requirement."+id)}>{id}</button>)}{r.requirementIds.length>20&&<small>เปิดระบบนี้ใน WP.4 เพื่ออ่านรายการที่เหลือ</small>}</details><details><summary>เงื่อนไขจากโค้ด {r.codes.length} รายการ</summary><ul>{r.codes.slice(0,40).map(c=><li key={c}>{c}</li>)}</ul></details></td><td><strong>{severityNames[r.severity]}</strong><small>{effectNames[r.priceEffect]}</small><small>{r.hardPriceBlock?'ต้องจัดฐานก่อนรวมตัวเลขของเจ้าของนี้':'ใช้ตัวเลขที่มีทำร่างต่อได้ · ตรวจขอบเขต/หลักฐานตามรายการ'}</small></td><td>{r.action}{r.deliveryHint&&<small>กำหนดรายงานระดับระบบที่พบ: {r.deliveryHint}</small>}<small>แผน: {phaseNames[r.phase]} · ข้อกำหนด: {phaseNames[r.requiredPhase]}</small>{r.requiredWithBid&&<strong>ข้อกำหนดพร้อม Bid · แผนส่งตามไม่เปลี่ยนเงื่อนไขนี้</strong>}</td><td>{r.plan?<><strong>{r.stale?'STALE · ฐานเปลี่ยน ต้องทบทวนแผน':r.planComplete?'มีแผนจัดการ · ต้นทางยังไม่ปิด':'แผนยังไม่ครบ'}</strong><small>{r.plan.owner} / {r.plan.dueOn}{r.overdue?' · เลยวันในแผน':''}</small><small>{r.plan.action}</small><small>{r.plan.priceBasis}</small><small>{r.plan.reference}</small></>:'ยังไม่มีแผนบันทึก'}<button type="button" onClick={()=>edit(r)}>จัดแผน Major / Minor</button><button type="button" onClick={()=>r.sourceTarget?onOpenSource(r.target):onNavigate(r.target)}>เปิดต้นทาง / ทำงานเดิม</button>{r.workLineIds.slice(0,2).map(id=><button type="button" key={id} onClick={()=>onNavigate('bid.budget.working.line.'+id)}>Working · {id}</button>)}</td></tr>)}</tbody></table></div>
  {!rows.length&&<p>ไม่มี Punch ในตัวกรองนี้ · ตรวจความพร้อมทั้งโครงการและเงื่อนไข Release เดิมก่อนออกข้อเสนอ</p>}
  {rows.length>limit&&<button type="button" onClick={()=>setLimit(n=>n+40)}>แสดงอีก 40 รายการ</button>}
  {view.orphanPlans.length>0&&<details><summary>แผนที่ต้นเหตุไม่ปรากฏในรอบนี้ {view.orphanPlans.length} รายการ</summary><p>เก็บแผนเดิมไว้ ไม่ตีความว่าปิดแล้วหรืออนุมัติแล้ว</p>{view.orphanPlans.map(p=><p key={p.id}>{p.id} · {p.owner} · {p.action}</p>)}</details>}
 </section>;
}
