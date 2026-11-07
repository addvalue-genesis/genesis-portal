import React,{useRef,useState} from 'react';
import {amount} from './BidControls';
import {nativeSupplierItem0550,supplierBoqRows0550,supplierItemLabel0550,supplierItemSourceText0550} from './data/supplierCostProjection0550';

const columns=[['ACP(main)','2+2 · ACP'],['APF(main)','2+2 · APF'],['ACP(alternative)','2+0 · ACP'],['APF(alternative)','2+0 · APF'],['Spares','Spares']];
const configurations=[['all','เทียบทุกแบบ'],['main','Main 2+2 HSB'],['alternative','Alternative 2+0'],['Spares','Spares']];

function SupplierBoqTable0550({rows,config='all'}){
 const visible=columns.filter(([key])=>rows.some(row=>Object.hasOwn(row.quantities,key))&&(config==='all'||key===config||key.endsWith('('+config+')')));
 return <div className="p55-table-wrap"><table className="p55-table p55-supplier-boq" aria-label="Supplier BoQ by configuration and site">
  <thead><tr><th scope="col">P/N</th><th scope="col">รายการต้นฉบับ</th>{visible.map(([key,label])=><th scope="col" key={key}>{label}</th>)}<th scope="col">หมายเหตุ / ต้นทาง</th></tr></thead>
  <tbody>{rows.filter(row=>visible.some(([key])=>Object.hasOwn(row.quantities,key))).map((row,i)=><tr key={row.locator+':'+i} data-supplier-boq-locator={row.locator}>
   <td><strong>{row.part}</strong></td><td>{row.description}</td>{visible.map(([key])=><td key={key} className="p55-boq-qty">{row.quantities[key]??'—'}</td>)}<td>{row.remark&&<span>{row.remark}<br/></span>}<code>{row.locator}</code></td>
  </tr>)}</tbody>
 </table></div>;
}

export function SupplierQuoteBoq0550({offers}){
 const [config,setConfig]=useState('all'),[open,setOpen]=useState(false);
 const entries=new Map();
 for(const row of offers.flatMap(supplierBoqRows0550)){
  const key=JSON.stringify([row.locator,row.part,row.description,row.remark]);
  const prior=entries.get(key);
  if(prior&&Object.keys(row.quantities).some(k=>Object.hasOwn(prior.quantities,k)&&prior.quantities[k]!==row.quantities[k])){
   entries.set(key+JSON.stringify(row.quantities),row);
  }else entries.set(key,{...row,quantities:{...prior?.quantities,...row.quantities}});
 }
 const rows=[...entries.values()].sort((a,b)=>a.row-b.row);
 if(!rows.length)return null;
 const sourceUrl=offers.find(offer=>offer.quoteEvidence?.sourceUrl)?.quoteEvidence.sourceUrl;
 return <details className="p55-panel p55-quote-boq" onToggle={e=>{if(e.target===e.currentTarget)setOpen(e.currentTarget.open);}}><summary>เปรียบเทียบ BoQ ตามไซต์ / แบบที่เสนอ · {rows.length} แถว</summary>
  {open&&<>
  <div className="p55-review-toolbar">{configurations.filter(([key])=>key==='all'||rows.some(row=>Object.keys(row.quantities).some(k=>k===key||k.endsWith('('+key+')')))).map(([key,label])=>
   <button key={key} type="button" aria-pressed={config===key} onClick={()=>setConfig(key)}>{label}</button>)}</div>
  <p>— = ช่องที่ไม่มีจำนวนในหลักฐานที่บันทึก · 0 = ระบุศูนย์ · ราคาอยู่ที่แพ็กเกจตาม Offer{sourceUrl&&<> · <a href={sourceUrl} target="_blank" rel="noopener noreferrer">เปิด Workbook ต้นฉบับ</a></>}</p>
  <SupplierBoqTable0550 rows={rows} config={config}/>
  </>}
 </details>;
}

// A full-width disclosure shared by the existing Vendor, Mapping and Working views.
export function SupplierItemSourceText0550({offer,requirement,showPrice=true}){
 const dialog=useRef(null);
 const texts=supplierItemSourceText0550(offer);
 const rows=supplierBoqRows0550(offer),native=nativeSupplierItem0550(offer);
 const details=texts.filter(text=>!rows.some(row=>text===row.text));
 return <div data-supplier-source-text={offer.id}>
  <button type="button" aria-haspopup="dialog" onClick={()=>dialog.current.showModal()}>ดูรายละเอียด Supplier{rows.length?' · BoQ '+rows.length+' แถว':''}</button>
  <dialog ref={dialog} className="p55-supplier-evidence" aria-label={'รายละเอียด Supplier '+(offer.supplierQuoteRow?.itemCode||offer.quoteRef||offer.id)}>
   <div className="p55-supplier-evidence-head"><strong>{offer.quoteRef||'Supplier'}{offer.supplierQuoteRow?.itemCode?' · Item '+offer.supplierQuoteRow.itemCode:''}</strong>
    <form method="dialog"><button type="submit">ปิดรายละเอียด</button></form></div>
   <h3>{supplierItemLabel0550(offer)}</h3>
   {requirement&&<>
    <p><strong>CUS · {requirement.site} · {requirement.title}</strong><br/>{requirement.sourceLocator}{requirement.supplierLocator&&<><br/>จุดอ้างอิง Supplier ใน Mapping · {requirement.supplierLocator}</>}</p>
    {(requirement.sourceExcerpt||requirement.criteria)&&<details><summary>ข้อความข้อกำหนดลูกค้า / เกณฑ์ตรวจ SI</summary>
     {requirement.sourceExcerpt&&<p className="p55-supplier-verbatim">{requirement.sourceExcerpt}</p>}
     {requirement.criteria&&<p className="p55-supplier-verbatim">{requirement.criteria}</p>}
    </details>}
   </>}
   {native&&<p>{native.site&&<>{native.site} · </>}{native.quantity??'—'} {native.unit||'หน่วยรอตรวจ'}
    {showPrice&&<> · เรต {amount(native.rate,native.currency)} · ยอดต้นฉบับ {Number.isFinite(native.total)?amount(native.total,native.currency):native.totalText||'—'}</>}
    <br/><code>{native.locator}</code>{native.url&&<> · <a href={native.url} target="_blank" rel="noopener noreferrer">เปิดต้นฉบับ</a></>}</p>}
   {rows.length>0&&<><p>BoQ อ้างอิง Offer นี้ · ราคาแยกต่อ P/N ไม่ปรากฏในหลักฐานที่บันทึก</p><SupplierBoqTable0550 rows={rows}/></>}
   {details.length>0&&<details open={!rows.length}><summary>ข้อความ Supplier / เงื่อนไขที่บันทึก</summary>{details.map((text,i)=><p key={i} className="p55-supplier-verbatim">{text}</p>)}</details>}
   {!texts.length&&<p>ยังไม่มีข้อความรายละเอียดต้นฉบับของ Item นี้ในข้อมูลที่โหลด · ตรวจใบเสนอราคาต้นฉบับ</p>}
   <details data-supplier-source-ref={offer.id}><summary>ข้อความรายการเต็ม / แหล่งอ้างอิงที่บันทึก</summary><p className="p55-supplier-verbatim">{offer.description}</p>{offer.sourceRef&&<p className="p55-supplier-verbatim">{offer.sourceRef}</p>}</details>
  </dialog>
 </div>;
}
