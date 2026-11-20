import React,{useId,useState} from 'react';
import {rackOfferCandidates0550,schematicDrawingSource0550} from './data/schematicDrawings0550';
import {safeSourceUrl} from './data/sourceIntakeModel';

function DrawingRef0550({drawing,sources,locator,onOpenSource}){
 const {source,warning}=schematicDrawingSource0550(sources,drawing);
 const url=safeSourceUrl(source?.url);
 return <div className="p55-drawing-ref">
  <strong>{drawing.title}</strong>
  <small>{drawing.documentNo} · Rev.{drawing.revision}{locator&&' · '+locator}</small>
  {warning&&<small>{warning}</small>}
  {source&&onOpenSource&&<button type="button" onClick={()=>onOpenSource('bid.documents.controlled-source-inventory.document.'+source.id)}>เปิดใน CUS</button>}
  {url&&<a href={url} target="_blank" rel="noreferrer">เปิดต้นฉบับ</a>}
 </div>;
}

function DrawingTopology0550({topology,site,activeRack,onRack}){
 const {nodes,edges,place}=topology;
 const columns=1+Math.max(...nodes.map(node=>node.column));
 const rows=1+Math.max(...nodes.map(node=>node.row));
 const position=node=>({x:110+node.column*220,y:38+node.row*76});
 const width=columns*220,height=rows*76;
 return <div className="p55-drawing-scroll">
  <div className="p55-drawing-topology" style={{minWidth:width,gridTemplateColumns:`repeat(${columns},minmax(0,1fr))`,gridTemplateRows:`repeat(${rows},4.75rem)`}}
   role="group" aria-label={'Topology จาก BLD · '+(place||site)}>
   <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
    {edges.map(([from,to])=>{
     const a=position(nodes[from]),b=position(nodes[to]);
     return <line key={from+'-'+to} x1={a.x} y1={a.y} x2={b.x} y2={b.y}/>;
    })}
   </svg>
   {nodes.map(({label,tag,rackTag,column,row},i)=>{
    const style={gridColumn:column+1,gridRow:row+1};
    const body=<><strong>{label}</strong>{tag&&<small>{tag}</small>}</>;
    return rackTag?<button type="button" key={i} style={style} aria-pressed={rackTag===activeRack} onClick={()=>onRack(rackTag)}>{body}</button>:
     <div key={i} style={style}>{body}</div>;
   })}
  </div>
 </div>;
}

const number=new Intl.NumberFormat('en-US',{maximumFractionDigits:6});
const quantity=(count,unit)=>Number.isFinite(count)?[number.format(count),unit].filter(Boolean).join(' '):'OPEN';
const size=dimensions=>dimensions.join(' × ')+' มม.';
const dimensionsDelta=values=>values.map((value,i)=>value?[['กว้าง','ลึก','สูง'][i],value>0?'+':'',number.format(value),' มม.'].join(''):'').filter(Boolean).join(' · ');

function RackOfferRows0550({rows,workingLines,onNavigate}){
 if(!rows.length)return <p className="p55-note">OPEN · ยังไม่พบรายการอุปกรณ์ที่เกี่ยวข้องในชุด VND ที่เลือก</p>;
 return <div className="p55-table-wrap"><table className="p55-table" aria-label="หลักฐานใบเสนอราคาสำหรับตู้">
  <thead><tr><th scope="col">รายการจาก 07 VND</th><th scope="col">จำนวนในใบเสนอราคา</th><th scope="col">ผลตรวจ / 10 Working Part A</th></tr></thead>
  <tbody>{rows.map(row=>{
   const selected=workingLines.filter(line=>line.wbs==='A'&&line.selected&&line.offerId===row.offer.id);
   const delta=row.dimensionDelta&&dimensionsDelta(row.dimensionDelta);
   return <tr key={row.offer.id}>
    <td><strong>{row.description}</strong>
     <small>{[row.offer.quoteRef,row.offer.quoteEvidence.revision,row.native.locator].filter(Boolean).join(' · ')}</small>
     {row.crossSystem&&<small>อ้างอิงจากระบบ LAN · รอยืนยันการจัดสรรเข้าตู้ CCTV</small>}
     {row.part&&<small>{row.part}</small>}
     {row.ports&&<small>{row.ports} พอร์ตต่อเครื่อง</small>}
     {row.dimensions&&<small>กว้าง × ลึก × สูง · {size(row.dimensions)}</small>}
     {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.vendor.offer.'+row.offer.id)}>เปิด Offer ใน 07 VND</button>}
    </td>
    <td>{quantity(row.native.quantity,row.native.unit)}<small>{row.building||'ระดับไซต์ตาม VND'}</small></td>
    <td>
     {row.ports&&row.requiredPorts&&<strong>{row.ports===row.requiredPorts?'จำนวนพอร์ตตรง':`พอร์ตต่อเครื่อง ${row.ports} / ${row.requiredPorts}`}</strong>}
     {delta&&<small>ขนาดต่างจาก LAY · {delta}</small>}
     <small>{row.exactRack?'พบ TAG ตู้ในเอกสารเสนอ':'OPEN · รอยืนยัน TAG ตู้'}</small>
     {selected.map(line=><div key={line.id}>
      <small>Working {line.wbs} · เลือกใช้ {quantity(line.quantity,line.unit)}</small>
      {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.budget.working.line.'+line.id)}>เปิด Working Line</button>}
     </div>)}
     {!selected.length&&<small>ยังไม่พบ Part A ที่เลือกใช้ Offer นี้โดยตรง</small>}
    </td>
   </tr>;
  })}</tbody>
 </table></div>;
}

export function SchematicDrawings0550({view,sources,quoteRows,workingLines,onOpenSource,onNavigate,site,place}){
 const [activeRack,setActiveRack]=useState('');
 const id=useId();
 const {topology,cabinets,blockDrawings,layouts,specifications}=view;
 const selected=cabinets.find(rack=>rack.tag===activeRack)||cabinets[0];
 const rows=selected?rackOfferCandidates0550(selected,quoteRows):[];
 const accessReferences=selected?.components.some(item=>item.ports)&&specifications.length>0;
 return <section className="p55-bom-locations p55-drawing-panel" aria-labelledby={id}>
  <h4 id={id}>แบบ BLD / LAY และ Rack/Cabinet · {site}{place&&' · '+place}</h4>
  {topology?<div className="p55-drawing-detail">
   <DrawingRef0550 drawing={topology.drawing} locator={'Sheet '+topology.sheet+' · '+(topology.place||site)} sources={sources} onOpenSource={onOpenSource}/>
   <p className="p55-note">ถอดเฉพาะส่วนที่อ่านยืนยันจาก BLD · กดอุปกรณ์ที่มีตู้เพื่อเปิด Rack BOM</p>
   {topology.relationship&&<p>{topology.relationship}</p>}
   <DrawingTopology0550 topology={topology} site={site} activeRack={selected?.tag} onRack={setActiveRack}/>
  </div>:<p className="p55-note">OPEN · ตำแหน่งนี้ยังไม่มีผังที่ถอดจากแผ่น BLD ตรวจแบบอ้างอิงด้านล่าง</p>}
  <details>
   <summary>แบบต้นทาง BLD / LAY และข้อกำหนดที่เกี่ยวข้อง</summary>
   <div className="p55-drawing-grid">
    {[...blockDrawings,...layouts,...specifications].map(drawing=>
     <DrawingRef0550 key={drawing.documentNo} drawing={drawing} sources={sources} onOpenSource={onOpenSource}/>)}
   </div>
  </details>
  {selected?<div className="p55-drawing-detail">
   <div className="p55-review-toolbar">
    <label>Rack/Cabinet <select value={selected.tag} onChange={event=>setActiveRack(event.target.value)}>
     {cabinets.map(rack=><option key={rack.tag} value={rack.tag}>{rack.tag} · {rack.name}</option>)}
    </select></label>
    {onNavigate&&<button type="button" onClick={()=>onNavigate('bid.working-preview.step.7',{workingSystem:selected.systems[0]})}>เปิด SI WP.7 · Mapping</button>}
   </div>
   <p><strong>{selected.tag}</strong> · {selected.name} · {selected.place} · {selected.room}</p>
   <p>LAY · {selected.mount} · กว้าง × ลึก × สูง {size(selected.dimensions)}</p>
   {selected.systems.length>1&&<small>ตู้ใช้ร่วม · {selected.systems.join(' / ')}</small>}
   <div className="p55-drawing-grid">
    <DrawingRef0550 drawing={selected.layout} locator={'Sheet 4 · Item '+selected.item} sources={sources} onOpenSource={onOpenSource}/>
    <DrawingRef0550 drawing={selected.contentsDrawing[0]} locator={'Sheet '+selected.contentsDrawing[1]+' · อุปกรณ์ในตู้'} sources={sources} onOpenSource={onOpenSource}/>
   </div>
   <ul className="p55-rack-components">{selected.components.map(item=><li key={item.label}>
    <strong>{item.label}</strong>{item.tag&&' · '+item.tag}{item.ports&&' · '+item.ports+' พอร์ต'}
   </li>)}</ul>
   <p className="p55-note">OPEN · ตำแหน่ง U และพื้นที่สำรองรอ Rack GA / Elevation</p>
   {accessReferences&&<p className="p55-note">ตรวจจำนวนพอร์ตแยกจากการจัดสรรเข้าตู้และการตรวจสเปกทั้งหมด · LAN DTS-0001 Rev.B1 PDF หน้า 6 ข้อ 13 และ LAN SPE-0002 Rev.B1 §7.3.2</p>}
   <RackOfferRows0550 rows={rows} workingLines={workingLines} onNavigate={onNavigate}/>
  </div>:<p className="p55-note">OPEN · ยังไม่มี TAG ตู้ที่ถอดและยืนยันสำหรับมุมมองนี้</p>}
 </section>;
}
