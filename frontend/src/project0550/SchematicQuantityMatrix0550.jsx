import React,{useEffect,useMemo,useRef,useState} from 'react';
import {PHI_BUILDINGS_0550} from './data/apfPhiMatrix0550';
import {MGW_CURRENT_MATRIX_0550,NO_SITE_0550,SITE_ONLY_0550,schematicQuantityGroups0550,schematicQuantityMatrix0550,schematicSystemDocs0550} from './data/schematicQuantityMatrix0550';
import {supplierItemSourceText0550} from './data/supplierCostProjection0550';

const ALL_LOCATIONS='รวมไซต์';
const ALL_SITES='ALL';
const format=number=>Number.isFinite(number)?number.toLocaleString('en-US',{maximumFractionDigits:6}):'OPEN';
const quantity=(number,unit)=>[format(number),unit].filter(Boolean).join(' ');
const byBasis=(tags,basis)=>tags.filter(tag=>tag.basis===basis);
const sourceName=source=>[source.documentNo||source.title,source.revision].filter(Boolean).join(' · ');
const at=(rows,place)=>place===ALL_LOCATIONS?rows:rows.filter(row=>(row.building||SITE_ONLY_0550)===place);

function SourceButton0550({source,onOpenSource}){
 return onOpenSource?<button type="button" onClick={()=>onOpenSource('bid.documents.controlled-source-inventory.document.'+source.id)}>{sourceName(source)}</button>:sourceName(source);
}

function Count0550({label,groups,rows}){
 return <span>{label&&<><b>{label}</b>{' '}</>}{groups.length?groups.slice(0,2).map(g=>quantity(g.quantity,g.unit)+' '+g.label).join(' · '):rows?'ดูรายการ':'—'}
  {groups.length>2&&' +'+(groups.length-2)+' กลุ่ม'}</span>;
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

function CustomerBom0550({rows,onOpenSource}){
 return rows.length?<div className="p55-table-wrap"><table className="p55-table" aria-label="BOM และจำนวนตาม MR">
  <thead><tr><th scope="col">รายการตาม MR</th><th scope="col">จำนวนที่ต้องการ</th></tr></thead>
  <tbody>{rows.map(row=><tr key={row.id}>
   <td><strong>{row.description}</strong>{row.responsibility==='COMPANY'&&<small>COMPANY จัดหา</small>}
    <details><summary>ต้นทาง MR และส่วนประกอบ</summary>
     <small>{row.locator}</small><SourceButton0550 source={row.source} onOpenSource={onOpenSource}/>
     {row.detail?.text&&<p className="p55-bom-native-text">{row.detail.text}</p>}
    </details>
   </td>
   <td className="p55-bom-count">{row.quantityText?row.quantityText+' · หน่วย OPEN':quantity(row.quantity,row.unit)}</td>
  </tr>)}</tbody>
 </table></div>:<p>ยังไม่พบรายการ MR ที่ระบุไซต์นี้</p>;
}

function VendorBom0550({offers,onNavigate}){
 return offers.length?<div className="p55-table-wrap"><table className="p55-table" aria-label="BOM และจำนวนตามใบเสนอราคา">
  <thead><tr><th scope="col">รายการและ BOM ตามใบเสนอราคา</th><th scope="col">จำนวนเสนอ</th></tr></thead>
  <tbody>{offers.map(({offer,native,multipleSystems,exactTags})=>{
   const terms=supplierItemSourceText0550(offer).filter(line=>!/^Quoted section subtotal/i.test(line));
   const components=terms.filter(line=>/^BOM:\s*/i.test(line));
   return <tr key={offer.id} data-quote-offer={offer.id}>
    <td><strong>{offer.description}</strong>
     {components.length>0&&<ul className="p55-bom-components">{components.slice(0,2).map(line=><li key={line}>{line.replace(/^BOM:\s*/i,'')}</li>)}</ul>}
     {exactTags.length>0&&<small>TAG ในใบเสนอราคาตรงกับ CUS · {exactTags.join(', ')}</small>}
     <details><summary>{components.length>2?'BOM ทั้ง '+components.length+' รายการ และต้นทาง':'ดูต้นทางและสเปก'}</summary>
      <small>{[offer.quoteRef,offer.quoteEvidence.revision,native.locator].filter(Boolean).join(' · ')}</small>
      {terms.length>0&&<ul className="p55-bom-native-text">{terms.map(line=><li key={line}>{line}</li>)}</ul>}
      {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.vendor.offer.'+offer.id)}>เปิด Offer ใน 07 VND</button>}
     </details>
    </td>
    <td className="p55-bom-count">
     <strong>{quantity(native.quantity,native.unit)}</strong>
     {native.option&&<small>Option</small>}
     {native.totalText==='Included'&&<small>Included</small>}
     {multipleSystems&&<small>ใช้ร่วมหลายระบบ</small>}
    </td>
   </tr>;
  })}</tbody>
 </table></div>:<p>ยังไม่พบรายการเสนอสำหรับไซต์นี้ในชุดที่เลือก</p>;
}

function CellEvidence0550({cell,onOpenSource,onNavigate}){
 const {required,tags,offers,docs,phi}=cell;
 return <div className="p55-schematic-evidence">
  <section aria-label="CUS MR DTS SPE LIS">
   <h4>CUS · MR / DTS / SPE / LIS</h4>
   {phi&&<p>PHI Table {phi.table} · {phi.labels.join(' / ')} <SourceButton0550 source={phi.source} onOpenSource={onOpenSource}/></p>}
   <CustomerBom0550 rows={required} onOpenSource={onOpenSource}/>
   <h5>TAG ตาม DTS / Equipment LIS</h5>
   <TagTable0550 tags={tags} onOpenSource={onOpenSource}/>
   {docs.length>0&&<details><summary>เอกสาร DTS / SPE / LIS Interface Matrix</summary>
    <ul>{docs.map(doc=><li key={doc.id}><SourceButton0550 source={doc} onOpenSource={onOpenSource}/></li>)}</ul>
   </details>}
  </section>
  <section aria-label="VND Quotation and BOM">
   <h4>VND · Quotation / BOM</h4>
   <VendorBom0550 offers={offers} onNavigate={onNavigate}/>
  </section>
 </div>;
}

function SystemBom0550({groups,quoteName,onOpenSource,onNavigate}){
 if(!groups.length)return <p>ยังไม่พบรายการ MR หรือใบเสนอราคาสำหรับตัวกรองนี้</p>;
 const summary=groups.length>1?[{
  site:'รวมทุกไซต์',required:groups.flatMap(group=>group.required),offers:groups.flatMap(group=>group.offers),
 },...groups]:groups;
 return <>
  <div className="p55-table-wrap p55-bom-overview"><table className="p55-table" aria-label="สรุปจำนวนแยกตามไซต์">
   <thead><tr><th scope="col">ไซต์</th><th scope="col">CUS · จำนวนตาม MR</th><th scope="col">VND · จำนวนเสนอ</th></tr></thead>
   <tbody>{summary.map(({site,required,offers})=><tr key={site} className={site==='รวมทุกไซต์'?'p55-bom-total':undefined}>
    <th scope="row">{site}</th>
    <td><Count0550 label="" groups={schematicQuantityGroups0550(required)} rows={required.length}/></td>
    <td><Count0550 label="" groups={schematicQuantityGroups0550(offers,true)} rows={offers.length}/></td>
   </tr>)}</tbody>
  </table></div>
  <div className="p55-bom-sites">{groups.map(({site,required,offers})=><section key={site} className="p55-bom-site" aria-label={'BOM '+site}>
   <h4>{site}</h4>
   <div className="p55-schematic-evidence">
    <section aria-label={'รายการที่ต้องการ '+site}>
     <h5>CUS · BOM ที่ต้องการตาม MR</h5>
     <CustomerBom0550 rows={required} onOpenSource={onOpenSource}/>
    </section>
    <section aria-label={'รายการเสนอ '+site}>
     <h5>VND · {quoteName}</h5>
     <VendorBom0550 offers={offers} onNavigate={onNavigate}/>
    </section>
   </div>
  </section>)}</div>
 </>;
}

export function SchematicQuantityMatrix0550({sourceIntake,offers,vendors,systems,onNavigate,onOpenSource}){
 const model=useMemo(()=>schematicQuantityMatrix0550({sourceIntake,offers,vendors}),[sourceIntake,offers,vendors]);
 const systemOptions=[...systems,{token:'COMMON',name:'Common / TAG ที่ยังไม่ระบุระบบ'}];
 const [token,setToken]=useState('TEL-CCTV'),[siteFilter,setSiteFilter]=useState(ALL_SITES);
 const [locationSite,setLocationSite]=useState('APF'),[locationsOpen,setLocationsOpen]=useState(false);
 const [quote,setQuote]=useState(MGW_CURRENT_MATRIX_0550),[selection,setSelection]=useState(null);
 const dialog=useRef(null);
 useEffect(()=>{if(selection&&!dialog.current.open)dialog.current.showModal();},[selection]);
 const system=systemOptions.find(s=>s.token===token)||systemOptions[0];
 const site=siteFilter===ALL_SITES?locationSite:siteFilter;
 const scope=PHI_BUILDINGS_0550[site]||[];
 const columns=[ALL_LOCATIONS,...scope,...(scope.length?[SITE_ONLY_0550]:[])];
 const phi=model.phi.sites[site];
 const selectedQuote=model.quoteOptions.has(quote)?quote:MGW_CURRENT_MATRIX_0550;
 const mgw=selectedQuote===MGW_CURRENT_MATRIX_0550;
 const quoteName=mgw?'MGW · Q26-063':model.quoteOptions.get(selectedQuote);
 const quoteRows=model.offered.filter(o=>o.system===system.token&&(mgw?o.mgwCurrent:o.quoteKey===selectedQuote));
 const mrRows=model.required.filter(r=>r.system===system.token);
 const groups=(siteFilter===ALL_SITES?model.sites:[siteFilter]).map(siteKey=>({
  site:siteKey,required:mrRows.filter(r=>r.site===siteKey),offers:quoteRows.filter(o=>o.site===siteKey),
 })).filter(group=>group.required.length||group.offers.length);
 const tags=model.tags.filter(t=>t.system===system.token&&t.site===site);
 const marks=(phi?.rows||[]).filter(r=>r.token===system.token);
 const docs=schematicSystemDocs0550(model.specs,system.token);
 const locationMr=mrRows.filter(r=>r.site===site),locationVnd=quoteRows.filter(o=>o.site===site);
 const cells=locationsOpen?columns.map((place,i)=>{
  const labels=marks.filter(mark=>i===0||mark.location===i-1).map(mark=>mark.label);
  return {place,required:at(locationMr,place),offers:at(locationVnd,place),
   tags:at(tags,place),docs,phi:labels.length?{source:model.phi.source,table:phi.table,labels:[...new Set(labels)]}:null};
 }):[];
 const closeAnd=action=>action&&((...args)=>{dialog.current.close();action(...args);});
 return <section className="p55-schematic-quantities" aria-label="BOM รายระบบและจำนวนเสนอ">
  <h3>BOM รายระบบ · จำนวนที่ต้องการและจำนวนเสนอ</h3>
  <div className="p55-review-toolbar p55-bom-filters">
   <label>ระบบ <select aria-label="ระบบ" value={system.token} onChange={event=>setToken(event.target.value)}>
    {systemOptions.map(item=><option key={item.token} value={item.token}>{item.name}</option>)}
   </select></label>
   <label>ไซต์ <select aria-label="ไซต์" value={siteFilter} onChange={event=>setSiteFilter(event.target.value)}>
    <option value={ALL_SITES}>ทุกไซต์</option>
    {model.sites.map(value=><option key={value} value={value}>{value}</option>)}
   </select></label>
   <label>ชุดใบเสนอราคา <select aria-label="ชุดใบเสนอราคา" value={selectedQuote} onChange={event=>setQuote(event.target.value)}>
    <option value={MGW_CURRENT_MATRIX_0550}>MGW · Q26-063 ชุดปัจจุบัน</option>
    {[...model.quoteOptions].map(([key,label])=><option key={key} value={key}>{label}</option>)}
   </select></label>
  </div>
  {!model.required.length&&<p className="p55-note">MR OPEN · รอ MR B1 ที่อ่านได้จาก CUS</p>}
  {!model.offered.some(o=>o.mgwCurrent)&&mgw&&<p className="p55-note">VND OPEN · รอชุดใบเสนอราคา MGW ในทะเบียน 07 VND</p>}
  <p className="p55-note">จำนวนเสนอใช้หน่วยในใบเสนอราคา · แถว Option และรายการใช้ร่วมแสดงใน BOM แยกจากยอดสรุป</p>
  {siteFilter!==ALL_SITES&&siteFilter!==NO_SITE_0550&&quoteRows.some(o=>o.site===NO_SITE_0550)&&
   <p className="p55-note">ชุดใบเสนอราคานี้มีรายการที่ยังไม่ระบุไซต์ <button type="button" onClick={()=>setSiteFilter(NO_SITE_0550)}>ดูรายการไม่ระบุไซต์</button></p>}
  <SystemBom0550 groups={groups} quoteName={quoteName} onOpenSource={onOpenSource} onNavigate={onNavigate}/>
  <details className="p55-bom-locations" onToggle={event=>setLocationsOpen(event.currentTarget.open)}>
   <summary>ตำแหน่งอาคารและ TAG · DTS / LIS / SPE</summary>
   {locationsOpen&&<div className="p55-source-matrix p55-bom-location-grid">
    {siteFilter===ALL_SITES&&<label>ไซต์ในตารางตำแหน่ง <select aria-label="ไซต์ในตารางตำแหน่ง" value={locationSite} onChange={event=>setLocationSite(event.target.value)}>
     {model.sites.map(value=><option key={value} value={value}>{value}</option>)}
    </select></label>}
    <p className="p55-note">{phi?.rows.length?<>■ ขอบเขตตำแหน่งตาม PHI Table {phi.table} · </>:null}
     กดช่องเพื่อดู TAG และเอกสารต้นทาง · จำนวนที่ทราบเพียงระดับไซต์อยู่ในคอลัมน์ท้าย</p>
    <div className="p55-table-wrap" tabIndex={0} aria-label="เลื่อนตารางจำนวนและ TAG">
   <table className="p55-table" aria-label={'ระบบ × ตำแหน่ง '+site}>
    <thead><tr><th rowSpan={2} scope="col">ระบบ</th><th colSpan={columns.length} scope="colgroup">{site}</th></tr>
     <tr>{columns.map(place=><th scope="col" key={place}>{place}</th>)}</tr>
    </thead>
    <tbody><tr>
     <th scope="row">{system.name}</th>
     {cells.map(cell=>{
      const dts=byBasis(cell.tags,'DTS'),lis=byBasis(cell.tags,'LIS'),reference=byBasis(cell.tags,'LIS อ้างอิง');
      const hasData=cell.required.length||cell.offers.length||cell.tags.length||cell.phi;
      const hasDocs=cell.place===ALL_LOCATIONS&&cell.docs.some(doc=>!doc.documentNo.endsWith('-LIS-0004'));
      return <td key={cell.place} data-location={cell.place}>{hasData||hasDocs?<button type="button" aria-haspopup="dialog"
       aria-label={system.name+' · '+cell.place+' · เปิดจำนวนและ TAG'} onClick={()=>setSelection({...cell,name:system.name})}>
       {cell.phi&&<span className="p55-phi-marker">■ PHI</span>}
       {(cell.required.length>0||cell.place===ALL_LOCATIONS)&&<Count0550 label="MR" groups={schematicQuantityGroups0550(cell.required)} rows={cell.required.length}/>}
       {(dts.length>0||cell.place===ALL_LOCATIONS)&&<TagCount0550 label="DTS" tags={dts}/>}
       {(lis.length>0||cell.place===ALL_LOCATIONS)&&<TagCount0550 label="LIS" tags={lis}/>}
       {reference.length>0&&<TagCount0550 label="LIS อ้างอิง" tags={reference}/>}
       {(cell.offers.length>0||cell.place===ALL_LOCATIONS)&&<Count0550 label="VND" groups={schematicQuantityGroups0550(cell.offers,true)} rows={cell.offers.length}/>}
      </button>:'—'}</td>;
     })}
    </tr></tbody>
   </table>
    </div>
   </div>}
  </details>
  <dialog ref={dialog} className="p55-source-matrix-dialog p55-schematic-dialog" aria-labelledby="p55-schematic-cell-title" onClose={()=>setSelection(null)}>
   <header><h3 id="p55-schematic-cell-title">{selection?.name} · {site} · {selection?.place}</h3><form method="dialog"><button autoFocus>ปิด</button></form></header>
   {selection&&<CellEvidence0550 cell={selection} onOpenSource={closeAnd(onOpenSource)} onNavigate={closeAnd(onNavigate)}/>}
  </dialog>
 </section>;
}
