import React, {useMemo, useState, useEffect} from 'react';
import {systemConstraints0550} from './data/systemConstraints0550';

export function SystemConstraints0550({data, model, system, onEditRequirement, onNavigate, onOpenSource}) {
 const [query, setQuery] = useState(''), [limit, setLimit] = useState(25);
 useEffect(() => {setQuery(''); setLimit(25);}, [system]);
 const view = useMemo(() => system === 'ALL' ? null : systemConstraints0550(data, model, system), [data, model, system]);
 if (!view) return <p className="p55-note">เลือก “ตรวจขอบเขต” รายระบบ หรือเลือกจาก Working Preview system เพื่อรวมชุดข้อกำหนดและตรวจงาน SI ต่อจาก records เดิม</p>;
 const openRequirement = (r, target = 'bid.working-preview.step.4') => {onEditRequirement(r); onNavigate(target);};
 function table(rows, label) {
  const needle = query.toLowerCase();
  const visible = rows.filter(({record: r}) => [r.id, r.title, r.statement, r.sourceLocator, r.need, r.criteria].join(' ').toLowerCase().includes(needle)).sort((a, b) => Number(b.customer.excerptAvailable) - Number(a.customer.excerptAvailable));
  return <><p>{visible.length} records ตามตัวกรอง · แสดง {Math.min(limit, visible.length)} โดยแสดงข้อที่ผูกข้อความ A ก่อน · จำนวนนี้ไม่ใช่จำนวนข้อกำหนดที่รับรองครบ</p>
   <div className="p55-table-wrap"><table className="p55-table" aria-label={label}>
    <thead><tr><th>ข้อกำหนด / หลักฐาน A</th><th>การวิเคราะห์ / Supplier evidence</th><th>CAL–RPT / activities / Working</th><th>ทำงานต่อ</th></tr></thead>
    <tbody>{visible.slice(0, limit).map(row => {
     const r = row.record;
     return <tr key={r.id}><td><strong>{r.title}</strong><small>{r.id} · {r.systemToken} · {r.state}</small>
      <p>{row.customer.received}/{row.customer.ids.length} source refs มีไฟล์ · {row.customer.withText} มีข้อความ · {row.customer.excerptAvailable ? 'พบข้อความอ้างอิง' : 'ยังไม่ผูกข้อความที่ตรวจพบ'}</p>
      <small>{r.sourceLocator || 'Locator ยังไม่ระบุ'}</small>
      {!!r.sourceExcerpt && <details><summary>ข้อความต้นทางที่ผูกไว้</summary><pre className="p55-source-excerpt">{r.sourceExcerpt}</pre></details>}
      {r.sourceIds.map(id => <button type="button" key={id} onClick={() => onOpenSource('bid.documents.controlled-source-inventory.document.' + id)}>อ่าน A · {model.integration.sources.find(s => s.id === id)?.documentNo || id}</button>)}
     </td><td><p>{r.need || 'ยังไม่บันทึก SI interpretation'}</p><small>เกณฑ์: {r.criteria || 'ยังไม่ระบุ'}</small><small>ความรับผิดชอบ: {r.responsibility} · {r.disposition}</small>
      <p>{r.offerIds.length} offer refs · {row.supplierAllocated && row.supplier.excerptAvailable ? 'มีการผูก offer / ข้อความ Supplier · ยังตรวจ adequacy ตามสถานะ Mapping' : 'ยังไม่ผูก Supplier technical evidence ครบ'}</p>
      {r.offerIds.map(id => <button type="button" key={id} onClick={() => onNavigate('bid.vendor.offer.' + id)}>Offer {id}</button>)}
      {r.supplierSourceIds.map(id => <button type="button" key={id} onClick={() => onOpenSource('bid.documents.source.' + id)}>Supplier source {id}</button>)}
     </td><td><p>{row.proofs.length} derived CAL/RPT · {row.activities.length} activities · {row.lines.length} Working refs</p>
      {row.proofs.map(p => <button type="button" key={p.id} onClick={() => onNavigate('bid.working-preview.proof.' + p.id)}>{p.kind} {p.id} · {p.state}</button>)}
      {row.activities.map(a => <button type="button" key={a.id} onClick={() => onNavigate('bid.working-preview.activity.' + a.id)}>{a.title} · {a.quantity ?? 'ปริมาณยังไม่ระบุ'} {a.unit} · {a.state}</button>)}
      {row.calculations.map(c => <button type="button" key={c.id} onClick={() => onNavigate('bid.engineering.calculation.' + c.id)}>Driver {c.equationId} · {c.id}</button>)}
      {row.ownerIds.map(id => <span key={id}><button type="button" onClick={() => onNavigate('bid.budget.working.line.' + id)}>Working {id}</button><button type="button" onClick={() => onNavigate('bid.budget.budget-thb.line.' + id)}>Budget {id}</button><button type="button" onClick={() => onNavigate('bid.budget.release.line.' + id)}>10.7 {id}</button><button type="button" onClick={() => onNavigate('bid.quotation.line.' + id)}>11.M {id}</button></span>)}
      <button type="button" onClick={() => onNavigate('bid.technical.description.system.' + r.systemToken)}>Volume II · {r.systemToken}</button>
      {row.deviations.map(d => <button type="button" key={d.id} onClick={() => onNavigate('bid.deviations.record.' + d.id)}>Deviation {d.id}</button>)}
      {!!row.missingLineIds.length && <small>Working ref ยังหาไม่พบ: {row.missingLineIds.join(', ')}</small>}
     </td><td>{row.next ? <button type="button" onClick={() => openRequirement(r, row.next.target)}>{row.next.label}</button> : 'ตรวจแล้วตาม canonical Mapping'}<button type="button" onClick={() => openRequirement(r)}>เปิด record เดิม</button></td></tr>;
    })}</tbody>
   </table></div>
   {visible.length > limit && <button type="button" onClick={() => setLimit(n => n + 25)}>แสดงอีก 25 records</button>}
  </>;
 }
 return <section className="p55-system-constraints" aria-label="System constraint continuation">
  <h3>ชุดข้อกำหนดและงาน SI ต่อ · {system}</h3>
  <p>มี {view.counts.requirements} requirements · พบข้อความ A {view.counts.sourceText} · มี interpretation {view.counts.interpreted} · ผูก Supplier evidence {view.counts.supplierEvidence} · derived CAL/RPT {view.counts.proofs} · activities {view.counts.activities} · ตรวจ Mapping แล้ว {view.counts.reviewed}</p>
  <p className="p55-note">ใช้ records เดิม · แต่ละสถานะตรวจคนละเรื่องและอาจซ้อนกัน ห้ามรวมเป็นเปอร์เซ็นต์ความครบถ้วน · ข้อเสนอ/ข้อความที่มีอยู่ยังต้องตรวจ applicability, conflicts และ engineering adequacy · การเปิดหน้านี้ไม่สร้างหรืออนุมัติข้อมูล</p>
  <details><summary>เอกสารที่เชื่อมอยู่จริง · {view.documents.length} source refs · CAL/RPT ต้นฉบับ {view.receivedCalRpt.length}</summary>
   <p>CAL/RPT ต้นฉบับเป็น source evidence แยกจาก derived proof · เอกสารใน A ที่ยังไม่ผูกอาจมีอยู่แล้ว ต้องตรวจจาก A ก่อนแจ้งว่าขาด · ชนิดไฟล์หรือ revision ไม่ตัดสินลำดับ override</p>
   <div className="p55-table-wrap"><table className="p55-table" aria-label="System constraint source documents"><thead><tr><th>เอกสาร / family</th><th>ฉบับ / authority</th><th>ข้อความ / ผลทบทวน</th></tr></thead><tbody>{view.documents.map(d => <tr key={d.id}><td><button type="button" onClick={() => onOpenSource('bid.documents.controlled-source-inventory.document.' + d.id)}>{d.source?.documentNo || d.id}</button><small>{d.source?.title || 'Source ref หาไม่พบ'} · {d.family}</small></td><td>{d.source?.revision || 'ฉบับยังไม่ระบุ'} · {d.source?.effectiveAuthority || 'ยังไม่ยืนยัน'}</td><td>{d.source?.readState || 'ไม่มี source record'} · {d.review?.state || 'ยังไม่มีผลทบทวนที่บันทึก'}</td></tr>)}</tbody></table></div>
  </details>
  <label>ค้นในชุดข้อกำหนด <input aria-label="System constraint search" value={query} onChange={e => {setQuery(e.target.value); setLimit(25);}} /></label>
  {table(view.rows, 'System constraint requirements')}
  {system !== 'COMMON' && <details><summary>COMMON ที่ต้องพิจารณาร่วม · {view.commonRows.length} records / {view.commonParticulars.length} Particulars</summary><p>บริบทงานร่วมเพื่อทบทวน applicability เท่านั้น ยังไม่ถือว่าทุกข้อเป็นขอบเขตของ {system} · คง ID และ cost owner เดิม ไม่คัดลอกงานหรือต้นทุนไประบบนี้</p>{table(view.commonRows, 'Common constraint context')}</details>}
  {!!view.findings.length && <details><summary>Source findings ที่เกี่ยวข้อง · {view.findings.length}</summary>{view.findings.map(f => <p key={f.id}>{f.id} · {f.state} · {f.statement}<small>{f.impact}</small></p>)}</details>}
 </section>;
}
