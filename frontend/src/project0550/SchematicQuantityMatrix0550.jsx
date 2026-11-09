import React,{useEffect,useMemo,useRef,useState} from 'react';
import {PHI_BUILDINGS_0550} from './data/apfPhiMatrix0550';
import {MGW_CURRENT_MATRIX_0550,NO_SITE_0550,SITE_ONLY_0550,schematicQuantityGroups0550,schematicQuantityMatrix0550,schematicSystemDocs0550} from './data/schematicQuantityMatrix0550';
import {supplierItemSourceText0550} from './data/supplierCostProjection0550';

const ALL_LOCATIONS='รวมไซต์';
const format=number=>Number.isFinite(number)?number.toLocaleString('en-US',{maximumFractionDigits:6}):'OPEN';
const quantity=(number,unit)=>[format(number),unit].filter(Boolean).join(' ');
const byBasis=(tags,basis)=>tags.filter(tag=>tag.basis===basis);
const sourceName=source=>[source.documentNo||source.title,source.revision].filter(Boolean).join(' · ');
const at=(rows,place)=>place===ALL_LOCATIONS?rows:rows.filter(row=>(row.building||SITE_ONLY_0550)===place);

function SourceButton0550({source,onOpenSource}){
 return onOpenSource?<button type="button" onClick={()=>onOpenSource('bid.documents.controlled-source-inventory.document.'+source.id)}>{sourceName(source)}</button>:sourceName(source);
}

function Count0550({label,groups,rows}){
 return <span><b>{label}</b> {groups.length?groups.slice(0,2).map(g=>quantity(g.quantity,g.unit)+' '+g.label).join(' · '):rows?'ดูรายการ':'—'}
  {groups.length>2&&' +'+(groups.length-2)+' รายการ'}</span>;
}

function TagCount0550({label,tags}){
 const primary=tags.filter(tag=>['Camera','IP Phone','Access Point'].includes(tag.type));
 const rest=tags.length-primary.length;
 return <span><b>{label}</b> {primary.length?primary.length+' '+primary[0].type+' TAG'+(rest?' +'+rest+' TAG':''):tags.length?tags.length+' TAG':'—'}
  {tags.some(tag=>tag.conflict)&&' · มีข้อขัดแย้ง'}</span>;
}

function TagTable0550({tags,onOpenSource}){
 if(!tags.length)return <p>ยังไม่พบแถว TAG ที่อ่านได้ในตำแหน่งนี้</p>;
 return <div className="p55-table-wrap"><table className="p55-table" aria-label="CUS TAG evidence">
  <thead><tr><th>TAG</th><th>รายการ / ตำแหน่ง</th><th>จำนวนที่ระบุ</th><th>เอกสาร / จุดอ้างอิง</th></tr></thead>
  <tbody>{tags.map(tag=><tr key={[tag.basis,tag.site,tag.system,tag.tag].join('|')}>
   <th scope="row">{tag.tag}{tag.conflict&&<small>ข้อมูล TAG ขัดกัน</small>}</th>
   <td>{tag.description}<small>{tag.location||tag.building||tag.site}</small></td>
   <td>{tag.conflict?'OPEN':Number.isFinite(tag.quantity)?quantity(tag.quantity,tag.unit):'1 แถว TAG'}</td>
   <td>{tag.records.map((record,i)=><div key={i}>
    <SourceButton0550 source={record.source} onOpenSource={onOpenSource}/> <small>{record.locator} · {record.basis}</small>
    {tag.conflict&&<small>{[record.description,record.location,Number.isFinite(record.quantity)?quantity(record.quantity,record.unit):''].filter(Boolean).join(' · ')}</small>}
   </div>)}</td>
  </tr>)}</tbody>
 </table></div>;
}

function CellEvidence0550({cell,onOpenSource,onNavigate}){
 const {required,tags,offers,docs,phi}=cell;
 return <div className="p55-schematic-evidence">
  <section aria-label="CUS MR DTS SPE LIS">
   <h4>CUS · MR / DTS / SPE / LIS</h4>
   {phi&&<p>PHI Table {phi.table} · {phi.labels.join(' / ')} <SourceButton0550 source={phi.source} onOpenSource={onOpenSource}/></p>}
   {required.length?<ul>{required.map(row=><li key={row.id}>
    <strong>{row.description} · {row.quantityText?row.quantityText+' · หน่วย OPEN':quantity(row.quantity,row.unit)}</strong>
    <small>{row.locator}{row.responsibility==='COMPANY'?' · COMPANY':''}</small>
    <SourceButton0550 source={row.source} onOpenSource={onOpenSource}/>
    {row.detail?.text&&<details><summary>ขอบเขตและส่วนประกอบตาม MR</summary><p style={{whiteSpace:'pre-line'}}>{row.detail.text}</p></details>}
   </li>)}</ul>:<p>ยังไม่พบแถว MR ที่ระบุสำหรับช่องนี้</p>}
   <h5>TAG ตาม DTS / Equipment LIS</h5>
   <TagTable0550 tags={tags} onOpenSource={onOpenSource}/>
   {docs.length>0&&<details><summary>เอกสาร DTS / SPE / LIS Interface Matrix</summary>
    <ul>{docs.map(doc=><li key={doc.id}><SourceButton0550 source={doc} onOpenSource={onOpenSource}/></li>)}</ul>
   </details>}
  </section>
  <section aria-label="VND Quotation and BOM">
   <h4>VND · Quotation / BOM</h4>
   {offers.length?<ul>{offers.map(({offer,native,multipleSystems,exactTags})=><li key={offer.id}>
    <strong>{offer.description} · {quantity(native.quantity,native.unit)}</strong>
    <small>{[offer.quoteRef,offer.quoteEvidence.revision,native.locator,native.option?'Option':'',multipleSystems?'ใช้ร่วมหลายระบบ':'',
     native.totalText==='Included'?'Included':''].filter(Boolean).join(' · ')}</small>
    {exactTags.length>0&&<small>TAG ในใบเสนอราคาตรงกับ CUS · {exactTags.join(', ')}</small>}
    {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.vendor.offer.'+offer.id)}>เปิด Offer ใน 07 VND</button>}
    <details><summary>รายละเอียด BOM และสเปกในใบเสนอราคา</summary>
     <ul>{supplierItemSourceText0550(offer).filter(text=>!/^Quoted section subtotal/i.test(text)).map((text,i)=><li key={i}>{text}</li>)}</ul>
    </details>
   </li>)}</ul>:<p>ยังไม่พบรายการในใบเสนอราคาที่เลือกสำหรับช่องนี้</p>}
  </section>
 </div>;
}

export function SchematicQuantityMatrix0550({sourceIntake,offers,vendors,systems,onNavigate,onOpenSource}){
 const model=useMemo(()=>schematicQuantityMatrix0550({sourceIntake,offers,vendors}),[sourceIntake,offers,vendors]);
 const [site,setSite]=useState('APF'),[quote,setQuote]=useState(MGW_CURRENT_MATRIX_0550),[selection,setSelection]=useState(null);
 const dialog=useRef(null);
 useEffect(()=>{if(selection&&!dialog.current.open)dialog.current.showModal();},[selection]);
 const scope=PHI_BUILDINGS_0550[site]||[];
 const columns=[ALL_LOCATIONS,...scope,...(scope.length?[SITE_ONLY_0550]:[])];
 const phi=model.phi.sites[site];
 const selectedQuote=model.quoteOptions.has(quote)?quote:MGW_CURRENT_MATRIX_0550;
 const quoteRows=model.offered.filter(o=>o.site===site&&(selectedQuote===MGW_CURRENT_MATRIX_0550?o.mgwCurrent:o.quoteKey===selectedQuote));
 const mrRows=model.required.filter(r=>r.site===site),tags=model.tags.filter(t=>t.site===site);
 const rows=[...systems,{token:'COMMON',name:'Common / TAG ที่ยังไม่ระบุระบบ'}].map(system=>{
  const ownMr=mrRows.filter(r=>r.system===system.token),ownVnd=quoteRows.filter(o=>o.system===system.token);
  const ownTags=tags.filter(t=>t.system===system.token),marks=(phi?.rows||[]).filter(r=>r.token===system.token);
  const cells=columns.map((place,i)=>{
   const mr=at(ownMr,place),vnd=at(ownVnd,place),ts=at(ownTags,place);
   const labels=marks.filter(mark=>i===0||mark.location===i-1).map(mark=>mark.label);
   return {place,required:mr,offers:vnd,tags:ts,docs:schematicSystemDocs0550(model.specs,system.token),
    phi:labels.length?{source:model.phi.source,table:phi.table,labels:[...new Set(labels)]}:null};
  });
  return {...system,cells};
 });
 const closeAnd=action=>action&&((...args)=>{dialog.current.close();action(...args);});
 return <section className="p55-source-matrix p55-schematic-quantities" aria-label="CUS VND quantity matrix">
  <h3>ระบบ × ตำแหน่ง · จำนวนและ TAG</h3>
  <p className="p55-note"><b>CUS</b> · MR จำนวนจัดหา, DTS และ Equipment LIS แสดง TAG, SPE แสดงข้อกำหนด · <b>VND</b> · จำนวนตาม Quotation/BOM</p>
  <div className="p55-review-toolbar">
   {model.sites.map(value=><button type="button" key={value} aria-pressed={site===value} onClick={()=>setSite(value)}>{value}</button>)}
   <label>ชุดใบเสนอราคา <select value={selectedQuote} onChange={event=>setQuote(event.target.value)}>
    <option value={MGW_CURRENT_MATRIX_0550}>MGW · Q26-063 ชุดปัจจุบัน</option>
    {[...model.quoteOptions].map(([key,label])=><option key={key} value={key}>{label}</option>)}
   </select></label>
  </div>
  {!model.required.length&&<p className="p55-note">MR OPEN · รอ MR B1 ที่อ่านได้จาก CUS</p>}
  {!model.offered.some(o=>o.mgwCurrent)&&selectedQuote===MGW_CURRENT_MATRIX_0550&&<p className="p55-note">VND OPEN · รอชุดใบเสนอราคา MGW ในทะเบียน 07 VND</p>}
  <p className="p55-note">{phi?.rows.length?<>■ ขอบเขตตำแหน่งตาม PHI Table {phi.table} · </>:null}
   กดช่องเพื่อเปิดรายการและ TAG · — ยังไม่มีข้อมูลในช่อง · จำนวนที่ทราบเพียงระดับไซต์อยู่ในคอลัมน์ท้าย
   {model.offered.some(o=>o.site===NO_SITE_0550)&&site!==NO_SITE_0550?' · ดูรายการ VND ที่ไม่มีไซต์ในแท็บไม่ระบุไซต์':''}</p>
  <div className="p55-table-wrap" tabIndex={0} aria-label="เลื่อนตารางจำนวนและ TAG">
   <table className="p55-table" aria-label={'ระบบ × ตำแหน่ง '+site}>
    <thead><tr><th rowSpan={2} scope="col">ระบบ</th><th colSpan={columns.length} scope="colgroup">{site}</th></tr>
     <tr>{columns.map(place=><th scope="col" key={place}>{place}</th>)}</tr>
    </thead>
    <tbody>{rows.map(row=><tr key={row.token}>
     <th scope="row">{row.name}</th>
     {row.cells.map(cell=>{
      const dts=byBasis(cell.tags,'DTS'),lis=byBasis(cell.tags,'LIS'),reference=byBasis(cell.tags,'LIS อ้างอิง');
      const hasData=cell.required.length||cell.offers.length||cell.tags.length||cell.phi;
      const hasDocs=cell.place===ALL_LOCATIONS&&cell.docs.some(doc=>!doc.documentNo.endsWith('-LIS-0004'));
      return <td key={cell.place} data-location={cell.place}>{hasData||hasDocs?<button type="button" aria-haspopup="dialog"
       aria-label={row.name+' · '+cell.place+' · เปิดจำนวนและ TAG'} onClick={()=>setSelection({...cell,name:row.name})}>
       {cell.phi&&<span className="p55-phi-marker">■ PHI</span>}
       {(cell.required.length>0||cell.place===ALL_LOCATIONS)&&<Count0550 label="MR" groups={schematicQuantityGroups0550(cell.required)} rows={cell.required.length}/>}
       {(dts.length>0||cell.place===ALL_LOCATIONS)&&<TagCount0550 label="DTS" tags={dts}/>}
       {(lis.length>0||cell.place===ALL_LOCATIONS)&&<TagCount0550 label="LIS" tags={lis}/>}
       {reference.length>0&&<TagCount0550 label="LIS อ้างอิง" tags={reference}/>}
       {(cell.offers.length>0||cell.place===ALL_LOCATIONS)&&<Count0550 label="VND" groups={schematicQuantityGroups0550(cell.offers,true)} rows={cell.offers.length}/>}
      </button>:'—'}</td>;
     })}
    </tr>)}</tbody>
   </table>
  </div>
  <dialog ref={dialog} className="p55-source-matrix-dialog p55-schematic-dialog" aria-labelledby="p55-schematic-cell-title" onClose={()=>setSelection(null)}>
   <header><h3 id="p55-schematic-cell-title">{selection?.name} · {site} · {selection?.place}</h3><form method="dialog"><button autoFocus>ปิด</button></form></header>
   {selection&&<CellEvidence0550 cell={selection} onOpenSource={closeAnd(onOpenSource)} onNavigate={closeAnd(onNavigate)}/>}
  </dialog>
 </section>;
}
