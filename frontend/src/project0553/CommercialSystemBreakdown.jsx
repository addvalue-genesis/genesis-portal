import React,{useState} from "react";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import MTO from "./data/snapshots/mto.rev04.summary.json";
import {VENDOR_0553_SOURCES} from "./vendorEvidence";
const money=x=>Number.isFinite(x)?"USD "+x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"OPEN";
const CODES={"MR-0001":"A1","MR-0002":"A2","MR-0003":"A3","MR-0004":"A4"};
// Presentation-only 0550-style budget drilldown. Do not distribute an A1-A4
// customer lump sum into fictional component costs or mark MTO families as priced.
export function CommercialSystemBreakdown0553(){
 const [expanded,setExpanded]=useState(new Set());
 const toggle=id=>setExpanded(old=>{const n=new Set(old);n.has(id)?n.delete(id):n.add(id);return n;});
 const systems=MTO.systems.map(s=>({
  ...s,code:CODES[s.mr],
  baseline:REV08_BASELINE.summary.find(x=>x[0]===CODES[s.mr]),
  sources:VENDOR_0553_SOURCES.filter(v=>v.mr===s.mr||v.mr==="MULTI")
 }));
 return <section className="p55-panel">
  <div className="p55-eyebrow">PART A INTERNAL DERIVATION · 0550 STRUCTURE REUSED / 0553 DATA ONLY</div>
  <div className="p55-budget-detail__head">
   <div><h3>4 MR Systems — Equipment / Vendor Evidence / Commercial Breakdown</h3>
   <p className="p55-note">แยกตาม MR และกด + เพื่อดู Equipment Families, Vendor Source และสถานะต้นทุนจริง ข้อมูล MTO Rev04 เป็น Summary ยังไม่ใช่ Itemized Take-off ที่ตรวจรับแล้ว</p></div>
   <div className="p55-segmented"><button type="button" onClick={()=>setExpanded(new Set(systems.map(s=>s.mr)))}>Expand all</button><button type="button" onClick={()=>setExpanded(new Set())}>Collapse all</button></div>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
  <thead><tr><th>+/−</th><th>No.</th><th>System / MR</th><th>Internal basis</th><th>Detail state</th><th>Rev08 Sell USD</th></tr></thead>
  <tbody>{systems.map((s,i)=><React.Fragment key={s.mr}>
   <tr><td><button type="button" className="p55-row-toggle" aria-label={(expanded.has(s.mr)?"Collapse ":"Expand ")+s.name} aria-expanded={expanded.has(s.mr)} onClick={()=>toggle(s.mr)}>{expanded.has(s.mr)?"−":"+"}</button></td>
   <td>{String(i+1).padStart(2,"0")}</td><td><strong>{s.name}</strong><small>{s.mr} · {s.code}</small></td>
   <td>{s.facilities.join(" · ")}<small>{s.rowCount} MTO rows (summary count; not equipment qty)</small></td>
   <td><span className="p55-badge">WORKING / REVALIDATE</span></td>
   <td className="is-number"><strong>{money(s.baseline?.[2])}</strong></td></tr>
   {expanded.has(s.mr)&&<tr className="p55-budget-detail-row"><td colSpan={6}><div className="p55-budget-detail">
    <div className="p55-budget-detail__head"><strong>{s.name} — detailed internal breakdown</strong><span>{s.equipmentFamilies.length} equipment families · {s.sources.length} vendor source records</span></div>
    <div className="p55-source-facts">
     <div><span>Source MTO</span><strong>Rev04 · WORKING</strong></div>
     <div><span>MR / Commercial Code</span><strong>{s.mr} / {s.code}</strong></div>
     <div><span>Customer Rev08 Sell</span><strong>{money(s.baseline?.[2])}</strong></div>
     <div><span>Verified Direct Cost</span><strong>OPEN</strong></div>
    </div>
    <div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>Physical / equipment scope — source MTO Rev04</div>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>No.</th><th>Equipment family</th><th>Platform scope</th><th>Installed qty</th><th>Unit cost</th><th>State</th></tr></thead>
     <tbody>{s.equipmentFamilies.map((family,j)=><tr key={j}><td>{j+1}</td><td>{family}</td><td>{s.facilities.join(", ")}</td><td>UNVERIFIED</td><td>OPEN</td><td><span className="p55-badge">MTO FAMILY ONLY</span></td></tr>)}</tbody>
    </table></div>
    <div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>Source quotation / evidence — vendor candidates and terms</div>
    {s.sources.map(v=><section className="p55-source-detail" key={v.id}>
     <div className="p55-source-detail__head"><div><h4>{v.supplier}</h4><p>{v.document}</p></div><span className="p55-badge">{v.status}</span></div>
     <div className="p55-source-facts">
      <div><span>Source type</span><strong>{v.type}</strong></div>
      <div><span>Revision</span><strong>{v.revision||"OPEN"}</strong></div>
      <div><span>Quoted total</span><strong>{Number.isFinite(v.quotedTotal)?money(v.quotedTotal)+" / MULTI-MR · NOT ALLOCATED":"NOT EXTRACTED"}</strong></div>
      <div><span>Evidence</span><strong><a href={v.url} target="_blank" rel="noreferrer">Open source</a></strong></div>
     </div><p className="p55-note">{v.next}</p>
    </section>)}
    <div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>Internal budget bridge — no fabricated allocations</div>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>Commercial line</th><th>Direct cost</th><th>Rev08 customer sell</th><th>New cost / sell</th><th>Evidence / control</th></tr></thead>
     <tbody><tr><td>{s.code} · {s.name}</td><td>OPEN</td><td>{money(s.baseline?.[2])}</td><td>OPEN</td><td>Rev08 baseline · MTO Rev04 working · Vendor reconciliation required</td></tr></tbody>
    </table></div>
   </div></td></tr>}
  </React.Fragment>)}</tbody></table></div>
  <p className="p55-note">Source: MTO Rev04 (4 MRs), REV08 Customer Workbook, Vendor Evidence Registry. Unlike 0550's quoted PAGA item detail, 0553's vendor line items are not yet extracted into the controlled dataset; DO NOT treat equipment-family headings as priced BOM rows.</p>
 </section>;
}
