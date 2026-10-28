import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {breakdownModule0553} from "./pricingViewRegistry0553";
import React,{useEffect,useMemo,useRef,useState} from "react";
import {buildCustomerPriceBreakdown0553,breakdownKey0553} from "./data/customerPriceBreakdown0553";
import {selectWorkingBomProjection0553} from "./data/workingBomAggregation0553";
import {buildMrCustomerSummary0553,mrSummaryKey0553} from "./data/mrCustomerSummary0553";
import "./customerPriceBreakdown0553.css";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";

function BreakdownCopyId0553({origin,code=null}){
 const module=breakdownModule0553(origin,code);
 return <span className="p553-breakdown-identity" onClick={e=>{e.preventDefault();e.stopPropagation();}} onKeyDown={e=>e.stopPropagation()}>
  <ComponentCopyId projectId="PJ2608-0553" componentKey={module.id}/>
 </span>;
}

export function CustomerPriceBreakdown0553({source,official,onOpenSource,origin="released",focus=null,showPriceDetails,onPriceDetailsChange,view,onViewChange}){
 const module=breakdownModule0553(origin);
 const model=useMemo(()=>buildCustomerPriceBreakdown0553(source,official),[source,official]);
 const summary=useMemo(()=>buildMrCustomerSummary0553(model),[model]);
 const [localView,setLocalView]=useState(origin==="official"?"customer":"internal");
 const activeView=view??localView,setView=onViewChange||setLocalView;
 const customer=activeView==="customer";
 const [localPrices,setLocalPrices]=useState(false);
 const showPrices=showPriceDetails??localPrices;
 const setPrices=onPriceDetailsChange||setLocalPrices;
 const root=useRef(null);
 useEffect(()=>{
  if(!focus?.key)return;
  const row=[...root.current.querySelectorAll("[data-breakdown-key]")].find(x=>x.dataset.breakdownKey===focus.key);
  if(!row)return;
  for(let p=row.parentElement;p;p=p.parentElement)if(p.tagName==="DETAILS")p.open=true;
  row.focus({preventScroll:true});row.scrollIntoView?.({behavior:"instant",block:"center"});
 },[focus,activeView]);
 return <section className="p553-breakdown" ref={root} aria-label="Price breakdown review" data-component-key={module.id}>
  <div className="p553-breakdown-heading"><h3>{module.number} · Part A · {customer?"MR scope summary":"Internal item breakdown"}</h3><BreakdownCopyId0553 origin={origin}/></div>
  <div className="p553-breakdown-display" role="group" aria-label="Part A breakdown view">
   <button type="button" aria-pressed={customer} onClick={()=>setView("customer")}>Customer · สรุปตาม MR</button>
   <button type="button" aria-pressed={!customer} onClick={()=>setView("internal")}>Internal · รายละเอียด {model.groups.reduce((n,g)=>n+g.rows.length,0)} แถว</button>
  </div>
  <div className="p553-breakdown-display" role="group" aria-label="Part A price display">
   <span>การแสดงราคาย่อย Part A</span>
   <button type="button" aria-pressed={!showPrices} onClick={()=>setPrices(false)}>ซ่อนราคาย่อย</button>
   <button type="button" aria-pressed={showPrices} onClick={()=>setPrices(true)}>แสดงราคาย่อย</button>
  </div>
  <p className="p55-note">{showPrices?(customer?"แสดงราคาชุดระบบตามสถานที่ ไม่ใช่ราคาต่ออุปกรณ์":"แสดงราคาต่อหน่วยและราคารวมรายอุปกรณ์"):"แสดงรายการและจำนวน พร้อมยอดรวมแต่ละระบบ โดยซ่อนราคาย่อย"} · ตัวเลือกนี้ใช้กับหน้าจอเท่านั้น Export Breakdown ยังคงเป็นฉบับรายละเอียด 141 แถวสำหรับตรวจทาน</p>
  <p className="p55-note">Draft allocation from the selected Release prices. Submitted proposal comparison: <strong>NOT VERIFIED</strong>.
   Existing A1–A4 totals are retained. {customer?"Summary based on the received MR scope and current offer, subject to stated qualifications. Services and spares remain under their existing B/C items.":"Package contents carry no second charge. Unpriced rows remain visible."}</p>
  {customer&&<p className="p55-note">{summary.groups.reduce((n,g)=>n+g.rows.length,0)} รายการสรุปตาม MR / สถานที่ · S คือเลขลำดับสรุป ไม่ใช่เลขบรรทัดใน MR · จำนวนชุดอ้างอิง MR; งาน brownfield ที่ไม่มีจำนวนรวมชัดเจนแสดง See MR §5</p>}
  <div className="p553-breakdown-checks"><strong>{model.reconciled?"A1–A4 totals match":"Price reconciliation required"}</strong>
   <span>Priced A+B: USD {money(model.totalUSD)}</span><span>C1/C2: separate conditional options</span></div>
  {customer?<MrScopeSummary0553 model={summary} showPrices={showPrices} origin={origin}/>:model.groups.map(g=><details key={g.code} className="p553-breakdown-group" data-component-key={breakdownModule0553(origin,g.code).id} data-cost-owner={g.code}>
   <summary><strong>{breakdownModule0553(origin,g.code).number} · {g.code} · {g.mr}</strong><span>USD {money(g.parentUSD)}</span>
    <span>{g.pricedCount} priced / {g.includedCount} included / {g.pendingCount} not priced</span>
    <span>Difference: {money(g.varianceUSD)}</span><BreakdownCopyId0553 origin={origin} code={g.code}/></summary>
   {(!g.sourceComplete||g.quantityPendingCount>0)&&<p className="p55-note">Source completeness requires review{g.quantityPendingCount?"; quantity/unit missing on "+g.quantityPendingCount+" priced rows":""}. A matching subtotal does not close technical or price gaps.</p>}
   <div className="p553-sheet-scroll"><table className="p55-table p55-table--compact"><thead><tr>
    {["Item / TAG","Location","Description","Qty / Unit",...(showPrices?["Unit USD","Amount USD"]:[]),"State / Source"].map(h=><th key={h}>{h}</th>)}
   </tr></thead><tbody>{g.rows.map((r,i)=><tr key={r.key} tabIndex={-1} data-breakdown-key={r.key} data-mr-summary-key={mrSummaryKey0553(r.mr,r.site)}
     className={focus?.key===r.key?"p553-release-row-focus":""}>
    <td>{g.code}.{i+1}<small>{r.tag}</small><small>MR summary: {summary.groups.find(x=>x.code===g.code).rows.find(x=>x.site===r.site).item}</small></td><td>{r.site}</td><td>{r.description}</td>
    <td>{r.qty??"TBC"} {r.unit}</td>{showPrices&&<><td className="p553-breakdown-price" data-price-detail="unit">{r.unitUSD===null?"—":r.unitUSD.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:8})}</td>
    <td className="p553-breakdown-price" data-price-detail="amount">{money(r.amountUSD)}</td></>}<td><strong>{r.status}</strong>{r.quantityPending&&<small>Quantity / unit review</small>}
     {onOpenSource&&<button type="button" onClick={()=>onOpenSource({...r,breakdownKey:r.key,breakdownOrigin:origin})}>↗ Source</button>}</td>
   </tr>)}<tr className="p553-sheet-total"><td colSpan={showPrices?5:4}>Priced subtotal · {g.mr}</td><td className="p553-breakdown-price">USD {money(g.totalUSD)}</td>{showPrices&&<td>Difference {money(g.varianceUSD)}</td>}</tr></tbody></table></div>
  </details>)}
 </section>;
}

function MrScopeSummary0553({model,showPrices,origin}){
 return model.groups.map(g=><details key={g.code} open className="p553-breakdown-group" data-mr-summary-group={g.code} data-component-key={breakdownModule0553(origin,g.code).id} data-cost-owner={g.code}>
  <summary><strong>{breakdownModule0553(origin,g.code).number} · {g.code} · {g.mr} · {g.description}</strong><span>USD {money(g.parentUSD)}</span><BreakdownCopyId0553 origin={origin} code={g.code}/></summary>
  <p className="p55-note">{g.qualification}</p>
  <div className="p553-sheet-scroll"><table className="p55-table p55-table--compact"><thead><tr>
   {["Summary item","Location","MR scope","Qty / Unit",...(showPrices?["Unit USD","Amount USD"]:[]),"MR reference"].map(h=><th key={h}>{h}</th>)}
  </tr></thead><tbody>{g.rows.map(r=><tr key={r.key} data-customer-summary-key={r.key}>
   <td>{r.item}</td><td>{r.site}</td><td>{r.description}</td><td>{r.qty??""} {r.unit}</td>
   {showPrices&&<><td className="p553-breakdown-price" data-price-detail="unit">{money(r.unitUSD)}</td><td className="p553-breakdown-price" data-price-detail="amount">{money(r.amountUSD)}</td></>}
   <td>{r.mrReference}</td>
  </tr>)}<tr className="p553-sheet-total"><td colSpan={showPrices?5:4}>Subtotal · {g.mr}</td><td className="p553-breakdown-price">USD {money(g.totalUSD)}</td>{showPrices&&<td/>}</tr></tbody></table></div>
 </details>);
}

export function BreakdownSourceRow0553({selection,onReturn}){
 const root=useRef(null);
 const line=selection?selectWorkingBomProjection0553({mr:selection.mr,site:selection.site}).lines.find(r=>breakdownKey0553(r)===selection.key):null;
 useEffect(()=>{
  if(!root.current)return;
  for(let p=root.current.parentElement;p;p=p.parentElement)if(p.tagName==="DETAILS")p.open=true;
  const token=requestAnimationFrame(()=>{root.current?.focus({preventScroll:true});root.current?.scrollIntoView?.({behavior:"instant",block:"center"});});
  return ()=>cancelAnimationFrame(token);
 },[selection]);
 if(!selection)return null;
 if(!line)throw Error("Breakdown source row no longer exists");
 const item=line.item;
 return <section className="p553-breakdown-source" tabIndex={-1} ref={root} data-breakdown-source-key={selection.key}>
  <h4>10.1 · Exact source row: {line.mr} / {line.site} / {line.id}</h4>
  <p><strong>{line.tag}</strong> · {item.description||item.role}</p>
  <table className="p55-table"><thead><tr><th>Source quantity</th><th>Source amount</th><th>Posting</th><th>Evidence</th></tr></thead>
   <tbody><tr><td>{item.sourceQty??item.qty??"TBC"} {item.sourceUnit||item.unit||"TBC"}</td>
    <td>{money(line.extended)} {line.currency||"TBC"}</td><td>{line.counted?"Counted once":item.parentPackage||item.priceInclusion?"Included in package":"Not posted"}</td>
    <td>{line.source||"Document reference pending"}<small>{item.status}</small></td></tr></tbody></table>
  <p className="p55-note">Read directly from the canonical System × Location × MTO source. No prices are edited by this navigation.</p>
  <button type="button" onClick={onReturn}>↩ Return to exact Breakdown row</button>
 </section>;
}

export function BreakdownSourcePicker0553({onOpenRow}){
 const lines=useMemo(()=>selectWorkingBomProjection0553().lines,[]);
 const [selected,setSelected]=useState(()=>lines.length?breakdownKey0553(lines[0]):"");
 return <details className="p553-breakdown-source" data-breakdown-source-picker>
  <summary><strong>Source → Price Breakdown</strong></summary>
  <p className="p55-note">Select an existing MR / Location / Item to view its corresponding Release breakdown row.</p>
  <label>Source item <select aria-label="Source item for price breakdown" value={selected} onChange={e=>setSelected(e.target.value)}>
   {[...new Set(lines.map(r=>r.mr))].map(mr=><optgroup label={mr} key={mr}>{lines.filter(r=>r.mr===mr).map(r=><option key={breakdownKey0553(r)} value={breakdownKey0553(r)}>{r.site} · {r.tag||r.id} · {r.item.description||r.item.role||r.id}</option>)}</optgroup>)}
  </select></label>
  <button type="button" disabled={!selected} onClick={()=>onOpenRow(selected)}>Open selected Breakdown row ↗</button>
 </details>;
}
