import { SCADA_0553_RECONCILIATION } from "./data/scadaOfferReconciliation";
import { MR0001_ENGINEERING_REQUIRED_BOM, summarizeMR0001RequiredBom } from "./data/mr0001RequiredBomDerivation";
import { formatCommercialAmount } from "../common/cost/commercialCurrency";
import { getProject0553Dataset, getProject0553SupplierQuotes } from "./data/repository";
import React,{useState} from "react";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";

import {VENDOR_0553_SOURCES} from "./vendorEvidence";

const CODES={"MR-0001":"A1","MR-0002":"A2","MR-0003":"A3","MR-0004":"A4"};
// Presentation-only 0550-style budget drilldown. Do not distribute an A1-A4
// customer lump sum into fictional component costs or mark MTO families as priced.
export function CommercialSystemBreakdown0553({displayCurrency="USD",fx=null}){
 const shown=(amount,source="USD")=>formatCommercialAmount(amount,source,displayCurrency,fx);
 const [expanded,setExpanded]=useState(new Set());
 const toggle=id=>setExpanded(old=>{const n=new Set(old);n.has(id)?n.delete(id):n.add(id);return n;});
 const systems=getProject0553Dataset().mto.systems.map(s=>({
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
  <thead><tr><th>+/−</th><th>No.</th><th>System / MR</th><th>Internal basis</th><th>Detail state</th><th>Rev08 Sell ({displayCurrency})</th></tr></thead>
  <tbody>{systems.map((s,i)=><React.Fragment key={s.mr}>
   <tr><td><button type="button" className="p55-row-toggle" aria-label={(expanded.has(s.mr)?"Collapse ":"Expand ")+s.name} aria-expanded={expanded.has(s.mr)} onClick={()=>toggle(s.mr)}>{expanded.has(s.mr)?"−":"+"}</button></td>
   <td>{String(i+1).padStart(2,"0")}</td><td><strong>{s.name}</strong><small>{s.mr} · {s.code}</small></td>
   <td>{s.facilities.join(" · ")}<small>{s.rowCount} MTO rows (summary count; not equipment qty)</small></td>
   <td><span className="p55-badge">WORKING / REVALIDATE</span></td>
   <td className="is-number"><strong>{shown(s.baseline?.[2])}</strong></td></tr>
   {expanded.has(s.mr)&&<tr className="p55-budget-detail-row"><td colSpan={6}><div className="p55-budget-detail">
    <div className="p55-budget-detail__head"><strong>{s.name} — detailed internal breakdown</strong><span>{s.equipmentFamilies.length} equipment families · {s.sources.length} vendor source records</span></div>
    <div className="p55-source-facts">
     <div><span>Source MTO</span><strong>Rev04 · WORKING</strong></div>
     <div><span>MR / Commercial Code</span><strong>{s.mr} / {s.code}</strong></div>
     <div><span>Customer Rev08 Sell</span><strong>{shown(s.baseline?.[2])}</strong></div>
     <div><span>Verified Direct Cost</span><strong>OPEN</strong></div>
    </div>
    <div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>Physical / equipment scope — source MTO Rev04</div>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>No.</th><th>Equipment family</th><th>Platform scope</th><th>Installed qty</th><th>Unit cost</th><th>State</th></tr></thead>
     <tbody>{s.equipmentFamilies.map((family,j)=><tr key={j}><td>{j+1}</td><td>{family}</td><td>{s.facilities.join(", ")}</td><td>UNVERIFIED</td><td>OPEN</td><td><span className="p55-badge">MTO FAMILY ONLY</span></td></tr>)}</tbody>
    </table></div>
    {s.mr==="MR-0001"&&<section className="p55-panel">
     <div className="p55-eyebrow">MR0001 · REQUIREMENT → PHYSICS/CONSTRAINT → REQUIRED BOM → SERVICES</div>
     <h4>Engineering-required scope from original MTO Rev04 (not vendor BOM)</h4>
     <p className="p55-note">ต้นทางคือ MTO จริง 42 แถว ครอบคลุมทั้ง Greenfield/Brownfield 7 Sites และอ้างอิง 5 Links จาก RPT Rev.C1. จำนวน Set/Lot จาก MR ไม่ใช่จำนวนชิ้นตาม SKU; ข้อมูลการรับรองวิศวกรรม, Cable/Bulk, Licence, Service MH และราคายัง OPEN</p>
     <div className="p55-source-facts">
      <div><span>Source item rows</span><strong>{summarizeMR0001RequiredBom().rowCount}</strong></div>
      <div><span>Locations</span><strong>{summarizeMR0001RequiredBom().siteCount}</strong></div>
      <div><span>Multi-code source rows</span><strong>{summarizeMR0001RequiredBom().groupedRowCount} · SPLIT OPEN</strong></div>
      <div><span>Accepted SKU/Cost/Sell</span><strong>OPEN / HOLD</strong></div>
     </div>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget">
      <thead><tr><th>Source row</th><th>Platform / link</th><th>MR item / requirement</th><th>MR Qty</th><th>Required SKU Qty</th><th>Engineering proof / missing driver</th><th>Services / Cost / Sell</th></tr></thead>
      <tbody>{MR0001_ENGINEERING_REQUIRED_BOM.rows.map(r=><tr key={r.id}>
       <td>{r.sourceRowIndex}<small><a href={r.sourceUrl} target="_blank" rel="noreferrer">MTO Rev04</a></small></td>
       <td><strong>{r.platform}</strong><small>{r.relatedLinks.join(" · ")||"SITE / NO LINK MAPPED"}</small></td>
       <td><strong>{r.sourcePartText}</strong><small>{r.sourceDescription}</small></td>
       <td>{r.sourceQuantityText}</td>
       <td><strong>OPEN</strong><small>{r.groupedRow?"MULTI-CODE SPLIT REQUIRED":"SET ≠ OEM SKU QTY"}</small></td>
       <td><strong>{r.status}</strong><small>{r.missing.join(" · ")}</small></td>
       <td>MH OPEN / COST OPEN / SELL HOLD</td>
      </tr>)}</tbody>
     </table></div>
     <p className="p55-note">RPT topology is a preliminary reference, not acceptance of antenna selection, radio compatibility, availability or Myanmar licence. NG/Cisco offers remain comparison evidence only. This table intentionally cannot produce customer pricing until required quantities, proof, WBS drivers and source-based rates are verified.</p>
    </section>}
    {s.mr==="MR-0001"&&<><div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>FIRST PRINCIPLES → REQUIRED vs OFFERED → COST GATE</div>
     <div className="p55-table-wrap"><table className="p55-table p55-table--budget p55-table--compact">
      <thead><tr><th>Equipment family</th><th>Required Qty</th><th>NG quoted lines</th><th>Engineering decision</th><th>Cost readiness</th><th>Source</th></tr></thead>
      <tbody>{SCADA_0553_RECONCILIATION.rows.map(r=><tr key={r.equipmentFamily}><td>{r.equipmentFamily}</td><td>DERIVATION PENDING</td><td>{SCADA_0553_RECONCILIATION.unmappedOffered.filter(x=>x.description?.toLowerCase().includes(r.equipmentFamily.toLowerCase())).length} preliminary text matches (not approved)</td><td>{r.decision.state}<small>{r.decision.reason}</small></td><td>HOLD</td><td>MTO Rev04 → MR0001 CAL/DWG/OEM</td></tr>)}</tbody>
     </table></div><p className="p55-note">Vendor quote 53 lines are preserved as evidence. Required SKU, licence, enclosure and bulk quantities need full MR/DWG/MTO extraction before technical acceptance or repricing.</p></>}
    <div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>Source quotation / evidence — vendor candidates and terms</div>
    <div className="p55-table-wrap"><table className="p55-table p55-table--budget p55-table--compact">
     <thead><tr><th>No.</th><th>Vendor / Supplier</th><th>Document / Scope</th><th>Type / Revision</th><th>Quoted Total ({displayCurrency})</th><th>Evidence Status</th><th>Source / Next Action</th></tr></thead>
     <tbody>{s.sources.map((v,i)=><tr key={v.id}>
      <td>{i+1}</td>
      <td><strong>{v.supplier}</strong></td>
      <td>{v.document}<small>{v.mr}</small></td>
      <td>{v.type}<small>Rev: {v.revision||"OPEN"}</small></td>
      <td className="is-number">{Number.isFinite(v.quotedTotal)?shown(v.quotedTotal,v.currency||"USD"):"NOT EXTRACTED"}{v.mr==="MULTI"&&<small>MULTI-MR / NOT ALLOCATED</small>}</td>
      <td><span className="p55-badge">{v.status}</span></td>
      <td><a href={v.url} target="_blank" rel="noreferrer">Open source</a><small>{v.next}</small></td>
     </tr>)}</tbody>
    </table></div>
    <div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>Detailed source quotation items — supplier price / currency as quoted</div>
    {getProject0553SupplierQuotes().filter(q=>q.mr.split("/").includes(s.mr)).map(q=><section key={q.id} className="p55-source-detail">
     <div className="p55-source-detail__head"><div><h4>{q.vendor} — {q.quotation}</h4><p>{q.source} · {q.scope}</p></div><span className="p55-badge">{q.status}</span></div>
     <div className="p55-source-facts">
      <div><span>Offer date</span><strong>{q.date}</strong></div>
      <div><span>Currency</span><strong>{q.currency}</strong></div>
      <div><span>Quoted total</span><strong>{shown(q.quotedTotal,q.currency)}</strong></div>
      <div><span>Valid through</span><strong>{q.validUntil||"HISTORICAL / EXPIRED"}</strong></div>
     </div>
     <p className="p55-note">{q.terms} · Price evidence only; verify site applicability, quote expiry, and whether lines are optional/spares before inclusion.</p>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--quoted p553-quoted-lines"><thead><tr><th>Code</th><th>Part Number</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Quoted Total</th></tr></thead>
     <tbody>{q.lines.map(([code,pn,description,qty,unitPrice,quotedTotal,group,page,pricingState])=><tr key={code}><td>{code}</td><td>{pn}</td><td>{description}</td><td className="is-number">{qty}</td><td className="is-number">{Number.isFinite(unitPrice)?shown(unitPrice,q.currency):"— (AS QUOTED)"}</td><td className="is-number">{Number.isFinite(quotedTotal)?shown(quotedTotal,q.currency):Number.isFinite(unitPrice)?shown(qty*unitPrice,q.currency):"— (AS QUOTED)"}</td></tr>)}</tbody></table></div>
     <p className="p55-note">{q.id==="NG-260916"?"All 53 original BOQ lines (A–E) preserved in JSON. Vendor quoted line totals reconcile to the PDF quote; Group D/E are spares and must not automatically enter base equipment.":"Document detail is historical/source evidence, not automatically required Z1F BOM."}</p>
    </section>)}
    <div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>Internal budget bridge — no fabricated allocations</div>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>Commercial line</th><th>Direct cost</th><th>Rev08 customer sell</th><th>New cost / sell</th><th>Evidence / control</th></tr></thead>
     <tbody><tr><td>{s.code} · {s.name}</td><td>OPEN</td><td>{shown(s.baseline?.[2])}</td><td>OPEN</td><td>Rev08 baseline · MTO Rev04 working · Vendor reconciliation required</td></tr></tbody>
    </table></div>
   </div></td></tr>}
  </React.Fragment>)}</tbody></table></div>
  <p className="p55-note">Source: MTO Rev04 (4 MRs), REV08 Customer Workbook, Vendor Evidence Registry. Unlike 0550's quoted PAGA item detail, 0553's vendor line items are not yet extracted into the controlled dataset; DO NOT treat equipment-family headings as priced BOM rows.</p>
 </section>;
}
