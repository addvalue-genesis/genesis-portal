import React,{useMemo,useState} from 'react';
import {supplierQuantityComparison0550} from './data/supplierQuantityComparison0550';

const statusLabels={
 MATCH:'จำนวนเท่ากัน',SHORT:'จำนวนเสนอที่ระบุต่ำกว่า MR',EXCESS:'จำนวนเสนอที่ระบุสูงกว่า MR',
 SCOPE_REVIEW:'เทียบจำนวนหลังแยกขอบเขตหรือ BOM',UNIT_REVIEW:'หน่วยต่างกัน · รอฐานแปลง',
 SELECTED_DESIGN:'แบบทางเลือกที่เลือกใช้ใน Working · เทียบชิ้นส่วนตามไซต์ใน SI WP.7',
 OPTION:'Optional · แยกจาก Base',INCLUDED:'Included · ตรวจรายการในแพ็กเกจ',
 SOURCE_OPEN:'รอจำนวน หน่วย หรือตำแหน่งในต้นฉบับ',OUTSIDE_SCOPE:'อยู่นอกขอบเขตจัดหา'
};
const qty=(value,unit)=>Number.isFinite(value)?[value.toLocaleString('en-US',{maximumFractionDigits:12}),unit].filter(Boolean).join(' '):'OPEN';
const go=(action,key,label)=>action&&<button type="button" onClick={()=>action(key)}>{label}</button>;

function OfferQuantity0550({entry,onNavigate}){
 const {offer,native,vendor}=entry;
 return <>
  <strong>{qty(native?.quantity,native?.unit)}</strong><small>{offer.description}</small>
  <small>{[vendor?.name||offer.vendorId,offer.quoteRef,offer.quoteEvidence?.revision,native?.locator].filter(Boolean).join(' · ')}</small>
  {go(onNavigate,'bid.vendor.offer.'+offer.id,'ดู Offer ใน 07 VND')}
 </>;
}

function QuantityTable0550({rows,onNavigate,onOpenSource}){
 return <div className="p55-table-wrap"><table className="p55-table" aria-label="CUS VND Working quantity comparison">
  <thead><tr><th>CUS · จำนวนตาม MR</th><th>07 VND · จำนวนตามใบเสนอราคา</th><th>SI · ผลต่าง VND − CUS</th><th>Working · จำนวนที่เลือกใช้</th></tr></thead>
  <tbody>{rows.flatMap(row=>{
   const {mr,requirement,applicable,offers,evidence,bindings,working}=row;
   return (offers.length?offers:[null]).map((entry,index)=><tr key={mr.id+'-'+(entry?.offer.id||'OPEN')}>
    {index===0&&<td rowSpan={offers.length||1}><strong>{mr.site} · {mr.description}</strong><small>{qty(mr.quantity,mr.unit)} · {mr.reference}</small>
     {bindings.map(b=><small key={b.id}>{b.tag} · {qty(b.quantity,b.unit)} · {b.locator}</small>)}
     {evidence.map(s=><React.Fragment key={s.id}>{go(onOpenSource,'bid.documents.source.'+s.id,[s.documentNo,s.revision].filter(Boolean).join(' · '))}</React.Fragment>)}
     {requirement&&go(onNavigate,'bid.working-preview.requirement.'+requirement.id,'ดู Requirement / Mapping')}
    </td>}
    <td>{entry?<OfferQuantity0550 entry={entry} onNavigate={onNavigate}/>:'ยังไม่ผูก Offer กับแถว MR'}</td>
    <td>{entry?<>
     {entry.delta!==null&&<strong>{entry.delta>0?'+':''}{qty(entry.delta,mr.unit)} · </strong>}{statusLabels[entry.status]}
     {entry.scopeIssue&&<small>{entry.scopeIssue}</small>}
    </>:applicable?'OPEN · รอตรวจลิงก์ Offer / ขอบเขต':statusLabels.OUTSIDE_SCOPE}</td>
    {index===0&&<td rowSpan={offers.length||1}>{working.length?working.map(l=><div key={l.id}>
     <strong>{qty(l.quantity,l.unit)}</strong><small>{l.description}</small>
     <small>{l.wbs} · {l.reviewState||l.state}</small>
     {go(onNavigate,'bid.budget.working.line.'+l.id,'ดู Working Line')}
    </div>):'ยังไม่มี Working Line ที่เลือกสำหรับแถวนี้'}</td>}
   </tr>);
  })}</tbody>
 </table></div>;
}

function QuantityGroup0550({rows,unmatched,onNavigate,onOpenSource}){
 return <>
  {rows.length?<QuantityTable0550 rows={rows} onNavigate={onNavigate} onOpenSource={onOpenSource}/>:<p>ไม่มีแถว MR ในระบบนี้</p>}
  {unmatched.length>0&&<details><summary>Offer ที่ยังไม่ผูกแถว MR ในตารางนี้ ({unmatched.length})</summary>
   <ul>{unmatched.map(entry=><li key={entry.offer.id}><OfferQuantity0550 entry={entry} onNavigate={onNavigate}/>
    {entry.native.option&&<small>{statusLabels.OPTION}</small>}</li>)}</ul>
  </details>}
 </>;
}

function QuantityDisclosure0550({title,children}){
 const [open,setOpen]=useState(false);
 return <details className="p55-wp-system" onToggle={event=>setOpen(event.currentTarget.open)}>
  <summary>{title}</summary>
  {open&&children}
 </details>;
}

function QuantityComparisonBody0550({data,model,integration,system,names,onNavigate,onOpenSource}){
 const {rows,unmatched}=useMemo(()=>supplierQuantityComparison0550(data,model,integration),[data,model,integration]);
 const visible=rows.filter(r=>system==='ALL'||r.mr.systemToken===system);
 const groups=[...new Set([...rows.map(r=>r.mr.systemToken),...unmatched.map(e=>e.systemTokens[0]||'UNASSIGNED')])];
 return <>
  <p>คำนวณผลต่างเมื่อขอบเขตแยกได้และหน่วยเทียบกันได้ ใช้จำนวนใน MR และใบเสนอราคาต้นฉบับ ผลต่างเป็นร่างตรวจจำนวน การตรวจสเปกและอนุมัติ Mapping ใช้หลักฐานใน SI ตามเดิม แถวที่ยังไม่ผูก Offer ให้ตรวจแพ็กเกจ งาน SI และขอบเขตจัดหาก่อนสรุปจำนวน</p>
  <p>{visible.length} แถว MR · {visible.filter(r=>r.applicable&&r.offers.length).length} แถวในขอบเขตที่มี Offer อ้างอิง · {visible.filter(r=>r.offers.some(o=>o.delta!==null)).length} แถวที่คำนวณผลต่างได้</p>
  {system==='ALL'?groups.map(token=><QuantityDisclosure0550 key={token} title={token==='UNASSIGNED'?'Offer ที่ยังไม่ระบุระบบ':names(token)}>
   <QuantityGroup0550 rows={visible.filter(r=>r.mr.systemToken===token)} unmatched={unmatched.filter(e=>(e.systemTokens[0]||'UNASSIGNED')===token)} onNavigate={onNavigate} onOpenSource={onOpenSource}/>
  </QuantityDisclosure0550>):<QuantityGroup0550 rows={visible} unmatched={unmatched.filter(e=>e.systemTokens.includes(system))} onNavigate={onNavigate} onOpenSource={onOpenSource}/>}
 </>;
}

export function SupplierQuantityComparison0550(props){
 return <QuantityDisclosure0550 title="เทียบจำนวน CUS → 07 VND → Working">
  <QuantityComparisonBody0550 {...props}/>
 </QuantityDisclosure0550>;
}
