import React,{useEffect,useMemo,useRef,useState} from 'react';
import {PHI_BUILDINGS_0550} from './data/apfPhiMatrix0550';
import {MGW_CURRENT_MATRIX_0550,NO_SITE_0550,SITE_ONLY_0550,schematicQuantityGroups0550,schematicQuantityMatrix0550,schematicSystemDocs0550} from './data/schematicQuantityMatrix0550';
import {supplierItemSourceText0550} from './data/supplierCostProjection0550';
import {MGW_CCTV_ENT_SECTIONS_0550} from './data/mgwQuoteSelection0550';
import {schematicCoverage0550,schematicOfferMrRefs0550} from './data/schematicCoverage0550';

import {SchematicDrawings0550} from './SchematicDrawings0550';
import {schematicDrawings0550} from './data/schematicDrawings0550';

const ALL_LOCATIONS='รวมไซต์';
const ALL_SITES='ALL';
const format=number=>Number.isFinite(number)?number.toLocaleString('en-US',{maximumFractionDigits:6}):'OPEN';
const quantity=(number,unit)=>[format(number),unit].filter(Boolean).join(' ');
const sourceName=source=>[source.documentNo||source.title,source.revision].filter(Boolean).join(' · ');
const at=(rows,place)=>place===ALL_LOCATIONS?rows:rows.filter(row=>(row.building||SITE_ONLY_0550)===place);

function SourceButton0550({source,onOpenSource}){
 return onOpenSource?<button type="button" onClick={()=>onOpenSource('bid.documents.controlled-source-inventory.document.'+source.id)}>{sourceName(source)}</button>:sourceName(source);
}

function Count0550({label,groups,rows}){
 return <span>{label&&<><b>{label}</b>{' '}</>}{groups.length?groups.slice(0,2).map(g=>quantity(g.quantity,g.unit)+' '+g.label).join(' · '):rows?'ดูรายการ':'—'}
  {groups.length>2&&' +'+(groups.length-2)+' กลุ่ม'}</span>;
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

const coverageLabel={SHORT:'ขาดตาม MR',EXCESS:'เสนอเกิน MR',OPEN:'รอตรวจ',MATCH:'จำนวนตรง'};
const displayQty=(value,unit)=>Number.isFinite(value)?quantity(value,unit):'—';

function CoverageTable0550({groups,showMatched,onOpenSource,onNavigate,workingLines=[]}){
 const rows=groups.flatMap(group=>group.results.filter(row=>showMatched||row.status!=='MATCH').map(row=>({...row,site:group.site})));
 if(!rows.length)return <p>{groups.some(group=>group.results.length)?'รายการที่เทียบได้มีจำนวนตรงตาม MR':'ยังไม่มีรายการที่ตรวจได้ในขอบเขตนี้'}</p>;
 return <div className="p55-table-wrap"><table className="p55-table" aria-label="ผลเทียบจำนวนตาม MR">
  <thead><tr><th>ไซต์ / รายการ</th><th>MR</th><th>VND</th><th>ผลต่าง VND − MR</th><th>สถานะ</th></tr></thead>
  <tbody>{rows.map(row=><tr key={row.site+'|'+row.key} data-coverage-status={row.status}>
   <td><strong>{row.site} · {row.label}</strong>
    {row.packageLabel&&<small>{row.packageLabel} · {row.packagePlace}</small>}
    {row.mrBasis&&<small>ฐาน MR · {row.mrBasis}</small>}
    <details><summary>หลักฐาน MR {row.packageSource?1:row.required.length} · VND {row.offers.length}</summary>
     {row.packageSource&&!row.required.length&&<div>
      <small>MR · {row.packageSource.locator}</small>
      <SourceButton0550 source={row.packageSource.source} onOpenSource={onOpenSource}/>
     </div>}
     {row.required.map(item=><div key={item.id}><small>MR · {item.description} · {quantity(item.quantity,item.unit)} · {item.locator}</small>
      <SourceButton0550 source={item.source} onOpenSource={onOpenSource}/></div>)}
     {row.offers.map(item=><div key={item.offer.id}><small>VND · {item.description} · {quantity(item.native.quantity,item.native.unit)} · {item.native.locator}</small>
      {schematicOfferMrRefs0550(item).length>0&&<small>MR ที่เกี่ยวข้อง · {schematicOfferMrRefs0550(item).join(' / ')}</small>}
      {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.vendor.offer.'+item.offer.id)}>เปิด Offer ใน 07 VND</button>}
      {workingLines.filter(line=>line.wbs==='A'&&line.selected&&line.offerId===item.offer.id).map(line=><div key={line.id}>
       <small>เลือกใช้ใน Working Part A · {quantity(line.quantity,line.unit)}</small>
       {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.budget.working.line.'+line.id)}>เปิด Working Part A</button>}
      </div>)}
     </div>)}
    </details>
   </td>
   <td>{displayQty(row.requiredQty,row.mrUnit)}{row.required.length===1&&row.required[0].quantityText&&<small>{row.required[0].quantityText}</small>}</td><td>{displayQty(row.offeredQty,row.vndUnit)}</td>
   <td>{Number.isFinite(row.delta)?(row.delta>0?'+':'')+quantity(row.delta,row.unit):'—'}</td>
   <td><strong>{coverageLabel[row.status]}</strong>{row.reason&&<small>{row.reason}</small>}</td>
  </tr>)}</tbody>
 </table></div>;
}

function TraceLinks0550({system,cell,workingLines,onNavigate}){
 if(!onNavigate)return null;
 const ids=new Set(cell.required.map(row=>row.id)),offerIds=new Set(cell.offers.map(row=>row.offer.id));
 const linked=workingLines.filter(line=>line.selected&&(ids.has(line.mrRequirementId)||offerIds.has(line.offerId)));
 return <div className="p55-bom-trace">
  <strong>เปิดงานที่เกี่ยวข้อง</strong>
  <div className="p55-review-toolbar">
   <button type="button" onClick={()=>onNavigate('bid.working-preview.step.5',{workingSystem:system})}>SI WP.5 · BOM</button>
   <button type="button" onClick={()=>onNavigate('bid.working-preview.step.7',{workingSystem:system})}>SI WP.7 · Mapping</button>
   {['A','B','C'].map(part=><button type="button" key={part} onClick={()=>onNavigate('bid.budget.working.part.'+part)}>Working Part {part}</button>)}
  </div>
  {linked.length>0&&<details><summary>Working Line ที่ผูกกับ MR / Offer ในตำแหน่งนี้ ({linked.length})</summary>
   {linked.map(line=><button type="button" key={line.id} onClick={()=>onNavigate('bid.budget.working.line.'+line.id)}>
    {line.wbs} · {line.description}
   </button>)}
  </details>}
 </div>;
}

function CellEvidence0550({cell,onOpenSource,onNavigate,workingLines}){
 const {required,tags,offers,docs,phi}=cell;
 return <>
  {cell.siteOnlyNotice&&<p className="p55-note">ใบเสนอราคามีรายการที่ระบุเพียงระดับไซต์ เปิดโหนดระดับไซต์เพื่อดูรายการเหล่านั้น</p>}
  <TraceLinks0550 system={cell.system} cell={cell} workingLines={workingLines} onNavigate={onNavigate}/>
  <CoverageTable0550 groups={[{site:cell.site,results:cell.results}]} showMatched onOpenSource={onOpenSource} onNavigate={onNavigate} workingLines={workingLines}/>
  <section className="p55-location-quote" aria-label="รายการที่เสนอในตำแหน่งนี้">
   <h4>VND · รายการและจำนวนที่เสนอ</h4>
   <VendorBom0550 offers={offers} onNavigate={onNavigate}/>
  </section>
  <details className="p55-bom-locations"><summary>CUS · BOM, TAG และเอกสารต้นทาง</summary>
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
  </details>
 </>;
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

function LocationDiagram0550({site,cells,onSelect}){
 const [root,...locations]=cells;
 const node=(cell,label)=> <button type="button" aria-haspopup="dialog" onClick={()=>onSelect(cell)}>
  <strong>{label}</strong>
  <small>MR {cell.required.length?cell.required.length+' แถว':'—'} · VND {cell.offers.length?cell.offers.length+' แถว':'—'}</small>
  {['DTS','LIS','LIS อ้างอิง'].map(basis=>{
   const count=cell.tags.filter(tag=>tag.basis===basis).length;
   return count>0&&<small key={basis}>{basis} · {count} TAG</small>;
  })}
  {cell.phi&&<small>PHI Table {cell.phi.table}</small>}
 </button>;
 return <div className="p55-location-diagram" role="group" aria-label={'ผังตำแหน่ง '+site}>
  <div className="p55-location-root">{node(root,site+' · รวมไซต์')}</div>
  {locations.length>0&&<ul>{locations.map(cell=><li key={cell.place}>{node(cell,cell.place)}</li>)}</ul>}
 </div>;
}

export function SchematicQuantityMatrix0550({sourceIntake,offers,vendors,systems,workingLines=[],onNavigate,onOpenSource}){
 const model=useMemo(()=>schematicQuantityMatrix0550({sourceIntake,offers,vendors}),[sourceIntake,offers,vendors]);
 const systemOptions=[...systems,{token:'COMMON',name:'Common / TAG ที่ยังไม่ระบุระบบ'}];
 const [token,setToken]=useState('TEL-CCTV'),[siteFilter,setSiteFilter]=useState(ALL_SITES);
 const [locationSite,setLocationSite]=useState('APF'),[showMatched,setShowMatched]=useState(false);
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
 const selectedOffers=model.offered.filter(o=>mgw?o.mgwCurrent:o.quoteKey===selectedQuote);
 const quoteRows=selectedOffers.filter(o=>o.system===system.token);
 const drawingView=schematicDrawings0550(system.token,site);
 const drawingProps={sources:model.drawingSources,quoteRows:selectedOffers,workingLines,onOpenSource,onNavigate};
 const mrRows=model.required.filter(r=>r.system===system.token);
 const expectedCameras=MGW_CCTV_ENT_SECTIONS_0550.find(section=>section.system==='TEL-CCTV').count;
 const currentCameraRows=system.token==='TEL-CCTV'?quoteRows.filter(row=>row.mgwCurrent).length:0;
 const completeCameraRegister=currentCameraRows===expectedCameras;
 const partialCameraRegister=currentCameraRows>0&&!completeCameraRegister;
 const noSite=quoteRows.some(row=>row.site===NO_SITE_0550&&!row.native.option&&!row.multipleSystems);
 const groups=(siteFilter===ALL_SITES?model.sites:[siteFilter]).map(siteKey=>{
  const required=mrRows.filter(r=>r.site===siteKey),offers=quoteRows.filter(o=>o.site===siteKey);
  return {site:siteKey,required,offers,results:schematicCoverage0550(required,offers,{
   hasUnlocatedOffer:noSite&&siteKey!==NO_SITE_0550,completeCameraRegister,partialCameraRegister,
   packageOffers:selectedOffers.filter(row=>row.site===siteKey),
  })};
 }).filter(group=>group.required.length||group.offers.length);
 const results=groups.flatMap(group=>group.results);
 const tags=model.tags.filter(t=>t.system===system.token&&t.site===site);
 const marks=(phi?.rows||[]).filter(r=>r.token===system.token);
 const docs=schematicSystemDocs0550(model.specs,system.token);
 const locationMr=mrRows.filter(r=>r.site===site),locationVnd=quoteRows.filter(o=>o.site===site);
 const locationPackageOffers=selectedOffers.filter(row=>row.site===site);
 const siteOnlyOffer=locationVnd.some(row=>!row.building&&!row.native.option&&!row.multipleSystems);
 const siteOnlyMr=locationMr.some(row=>!row.building&&row.responsibility!=='COMPANY');
 const cells=columns.map((place,i)=>{
  const labels=marks.filter(mark=>i===0||mark.location===i-1).map(mark=>mark.label);
  const required=at(locationMr,place),offers=at(locationVnd,place),isBuilding=scope.includes(place);
  return {place,site,system:system.token,name:system.name,required,offers,tags:at(tags,place),docs,
   results:schematicCoverage0550(required,offers,{building:place!==ALL_LOCATIONS,completeCameraRegister,partialCameraRegister,
    place:isBuilding?place:undefined,packageOffers:locationPackageOffers,
    hasUnlocatedOffer:place===SITE_ONLY_0550||noSite&&site!==NO_SITE_0550||isBuilding&&(siteOnlyOffer||siteOnlyMr)}),
   siteOnlyNotice:isBuilding&&siteOnlyOffer,phi:labels.length?{source:model.phi.source,table:phi.table,labels:[...new Set(labels)]}:null};
 }).filter(cell=>cell.place===ALL_LOCATIONS||cell.required.length||cell.offers.length||cell.tags.length||cell.phi||schematicDrawings0550(system.token,site,cell.place).cabinets.length||drawingView.topology?.place===cell.place);
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
  <section className="p55-coverage" aria-label="ผลตรวจความครบถ้วน">
   <h4>ผลตรวจตาม MR · {system.name}</h4>
   <div className="p55-coverage-summary">{Object.entries(coverageLabel).map(([status,label])=><span key={status} data-coverage-status={status}>
    <strong>{results.filter(row=>row.status===status).length}</strong> {label}
   </span>)}</div>
   <p className="p55-note">นับเป็นกลุ่มตรวจตามไซต์ · จำนวนตรงยังต้องผ่านการตรวจสเปกและ TAG ใน SI</p>
   <label><input type="checkbox" checked={showMatched} onChange={event=>setShowMatched(event.target.checked)}/> แสดงรายการที่จำนวนตรงด้วย</label>
   <CoverageTable0550 groups={groups} showMatched={showMatched} onOpenSource={onOpenSource} onNavigate={onNavigate} workingLines={workingLines}/>
  </section>
  <section className="p55-bom-locations" aria-label="ผังตำแหน่งและข้อเสนอ">
   <h4>ผังตำแหน่ง · กดชื่อเพื่อดูข้อเสนอ</h4>
   {siteFilter===ALL_SITES&&<label>ไซต์ในผัง <select aria-label="ไซต์ในผัง" value={locationSite} onChange={event=>setLocationSite(event.target.value)}>
    {model.sites.map(value=><option key={value} value={value}>{value}</option>)}
   </select></label>}
   <p className="p55-note">จัดกลุ่มตามไซต์และตำแหน่งในหลักฐาน · เส้นแสดงการจัดกลุ่มสถานที่</p>
   <LocationDiagram0550 site={site} cells={cells} onSelect={setSelection}/>
  </section>
  <SchematicDrawings0550 key={system.token+'|'+site} view={drawingView} site={site} {...drawingProps}/>
  <details className="p55-bom-locations"><summary>เปิด BOM ต้นฉบับ CUS / VND ทุกแถว</summary>
   <SystemBom0550 groups={groups} quoteName={quoteName} onOpenSource={onOpenSource} onNavigate={onNavigate}/>
  </details>
  <dialog ref={dialog} className="p55-source-matrix-dialog p55-schematic-dialog" aria-labelledby="p55-schematic-cell-title" onClose={()=>setSelection(null)}>
   <header><h3 id="p55-schematic-cell-title">{selection?.name} · {selection?.site} · {selection?.place}</h3><form method="dialog"><button autoFocus>ปิด</button></form></header>
   {selection&&<>
    <SchematicDrawings0550 {...drawingProps} site={selection.site} place={selection.place===ALL_LOCATIONS?undefined:selection.place}
     view={schematicDrawings0550(selection.system,selection.site,selection.place===ALL_LOCATIONS?undefined:selection.place)}
     onOpenSource={closeAnd(onOpenSource)} onNavigate={closeAnd(onNavigate)}/>
    <CellEvidence0550 cell={selection} workingLines={workingLines} onOpenSource={closeAnd(onOpenSource)} onNavigate={closeAnd(onNavigate)}/>
   </>}
  </dialog>
 </section>;
}
