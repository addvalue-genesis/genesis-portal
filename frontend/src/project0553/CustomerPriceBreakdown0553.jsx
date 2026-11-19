import React,{useEffect,useMemo,useRef,useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {buildCustomerPriceBreakdown0553,breakdownKey0553} from "./data/customerPriceBreakdown0553";
import {selectWorkingBomProjection0553} from "./data/workingBomAggregation0553";
import {buildMrCustomerSummary0553,mrSummaryKey0553} from "./data/mrCustomerSummary0553";
import {ScheduleC1Breakdown0553} from "./ScheduleC1Breakdown0553";
import "./customerPriceBreakdown0553.css";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";

function downloadText0553(filename,mime,text){
 const blob=new Blob([text],{type:mime});
 const url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download=filename;a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}

export function CustomerPriceBreakdown0553({source,official,onOpenSource,origin="released",focus=null,showPriceDetails,onPriceDetailsChange,view,onViewChange,defaultView}){
 const model=useMemo(()=>buildCustomerPriceBreakdown0553(source,official),[source,official]);
 const summary=useMemo(()=>buildMrCustomerSummary0553(model),[model]);
 const [localView,setLocalView]=useState(defaultView??(origin==="official"?"customer":"internal"));
 const activeView=view??localView,setView=onViewChange||setLocalView;
 const customer=activeView==="customer";
 const [localPrices,setLocalPrices]=useState(false);
 const showPrices=showPriceDetails??localPrices;
 const setPrices=onPriceDetailsChange||setLocalPrices;
 const [activeTab,setActiveTab]=useState("SCOPE");
 const root=useRef(null);
 useEffect(()=>{
  if(!focus?.key)return;
  const targetGroup=model.groups.find(g=>g.rows.some(r=>r.key===focus.key));
  if(targetGroup)setActiveTab(targetGroup.code);
  const row=[...root.current.querySelectorAll("[data-breakdown-key]")].find(x=>x.dataset.breakdownKey===focus.key);
  if(!row)return;
  for(let p=row.parentElement;p;p=p.parentElement)if(p.tagName==="DETAILS")p.open=true;
  row.focus({preventScroll:true});row.scrollIntoView?.({behavior:"instant",block:"center"});
 },[focus,activeView,model]);
 return <section className="p553-breakdown p553-release-workbook" ref={root} data-component-key="bid.budget.pricing.part-a-breakdown" aria-label="Price breakdown review">
  <h3>Part A Breakdown Preview — 4-Scope of Supply (A1–A4) <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.pricing.part-a-breakdown"/></h3>
  <p className="p55-note"><strong>PRE-EXPORT PREVIEW / NOT ISSUED.</strong> แสดงเฉพาะหมวด Part A (A1–A4 EQ-DISP USD) · {model.priceReference?<>Allocated to <strong>{model.priceReference.revision}</strong> · {model.priceReference.filename}</>:<>Draft allocation from selected Release prices</>}. Price totals reconcile; technical and supplier scope review remains open.</p>
  <div className="p553-preview-toolbar">
   <label>Preview mode <select aria-label="Part A preview mode" value={activeView} onChange={e=>setView(e.target.value)}>
    <option value="customer">Customer Preview (0550 clean)</option>
    <option value="internal">AVS Internal · Expand TAG / Source (141 rows)</option>
   </select></label>
   <button type="button" aria-pressed={!showPrices} onClick={()=>setPrices(false)}>ซ่อนราคาย่อย</button>
   <button type="button" aria-pressed={showPrices} onClick={()=>setPrices(true)}>แสดงราคาย่อย</button>
   <button type="button" onClick={()=>{
    const headers=["Group","MR","Location","TAG","Description","Qty","Unit",...(showPrices?["Unit USD","Amount USD"]:[])];
    const lines=[headers.join(",")];
    model.groups.forEach(g=>g.rows.forEach(r=>{
     const cols=[g.code,g.mr,r.site||"",r.tag||"",`"${String(r.description||"").replace(/"/g,'""')}"`,r.qty??"",r.unit||"",...(showPrices?[r.unitUSD??"",r.amountUSD??""]:[])];
     lines.push(cols.join(","));
    }));
    downloadText0553("PJ2608-0553_Part-A_Breakdown.csv","text/csv;charset=utf-8",lines.join("\n"));
   }}>CSV — Part A Breakdown</button>
   <button type="button" onClick={()=>{
    const rowsHtml=model.groups.map(g=>`<h3>${g.code} · ${g.mr} (USD ${money(g.parentUSD)})</h3><table border="1" cellspacing="0" cellpadding="4"><tr><th>Location</th><th>TAG</th><th>Description</th><th>Qty</th><th>Unit</th>${showPrices?"<th>Unit USD</th><th>Amount USD</th>":""}</tr>${g.rows.map(r=>`<tr><td>${r.site||""}</td><td>${r.tag||""}</td><td>${r.description||""}</td><td>${r.qty??""}</td><td>${r.unit||""}</td>${showPrices?`<td>${r.unitUSD??""}</td><td>${money(r.amountUSD)}</td>`:""}</tr>`).join("")}</table>`).join("");
    downloadText0553("PJ2608-0553_Part-A_Schedule.doc","application/msword",`<html><body><h2>PJ2608-0553 Part A (A1–A4) Breakdown</h2>${rowsHtml}</body></html>`);
   }}>Word — Part A Schedule (.doc)</button>
  </div>
  <p className="p55-note">{showPrices?(customer?"แสดงราคาชุดระบบตามสถานที่ ไม่ใช่ราคาต่ออุปกรณ์":"แสดงราคาต่อหน่วยและราคารวมรายอุปกรณ์"):"แสดงรายการและจำนวน พร้อมยอดรวมแต่ละระบบ โดยซ่อนราคาย่อย"} · ตัวเลือกนี้ใช้กับหน้าจอเท่านั้น Export Breakdown ยังคงเป็นฉบับรายละเอียด 141 แถวสำหรับตรวจทาน</p>
  {customer&&<p className="p55-note">{summary.groups.reduce((n,g)=>n+g.rows.length,0)} รายการสรุปตาม MR / สถานที่ · S คือเลขลำดับสรุป ไม่ใช่เลขบรรทัดใน MR · จำนวนชุดอ้างอิง MR; งาน brownfield ที่ไม่มีจำนวนรวมชัดเจนแสดง See MR §5</p>}
  <div className="p553-breakdown-checks"><strong>{model.reconciled?"A1–A4 totals match":"Price reconciliation required"}</strong>
   <span>Priced A+B: USD {money(model.totalUSD)}</span><span>C1/C2: separate conditional options</span></div>
  <div className="p553-release-tabs" role="tablist" aria-label="Part A MR breakdown tabs">
   <button type="button" role="tab" aria-selected={activeTab==="SCOPE"} className={activeTab==="SCOPE"?"is-active":""} onClick={()=>setActiveTab("SCOPE")}>Scope of supply</button>
   {model.groups.map(g=><button key={g.code} type="button" role="tab" aria-selected={activeTab===g.code} className={activeTab===g.code?"is-active":""} onClick={()=>setActiveTab(g.code)}>{g.code} {g.mr.replace("-","")}</button>)}
  </div>
  <div className="p553-native-sheet">
   <div hidden={activeTab!=="SCOPE"}>
    <div className="p553-native-title">Scope of supply<br/>供货范围</div>
    <div className="p553-sheet-meta"><strong>Project</strong><span>ZAWTIKA DEVELOPMENT PROJECT PHASE 1F</span>
     <strong>RFQ No.</strong><span> </span><strong>Package Name</strong><span>Part A: BASIC (USD)</span></div>
    <div className="p553-preview-totals">
     <span>Part A (A1–A4) · <strong>USD {money(model.groups.reduce((s,g)=>s+(g.parentUSD||0),0))}</strong></span>
     {!customer&&<span>Items · <strong>{model.groups.reduce((s,g)=>s+g.rows.length,0)} rows</strong></span>}
    </div>
    <div className="p553-sheet-scroll"><table className="p553-customer-table">
     <thead><tr>
      <th>S.N<br/>序号</th><th>Tag No.<br/>位号</th><th>Description<br/>名称</th><th>Main Specification<br/>主要参数</th>
      <th>Qty<br/>数量</th><th>Unit Price<br/>单价</th><th>Sub-Total<br/>小计</th><th>Remark<br/>备注</th>
     </tr></thead>
     <tbody>
      <tr className="p553-sheet-section"><td colSpan={8}>Part A: BASIC<br/>A部分：基本</td></tr>
      <tr className="p553-sheet-subheading"><td colSpan={8}>A1. Main Equipment · Source MR-0001–MR-0004</td></tr>
      {model.groups.map(g=>{
       const sites=[...new Set(g.rows.map(r=>r.site).filter(Boolean))].join(", ")||"TBC";
       return <tr key={g.code} className="p553-mr-preview-row" data-cost-owner={g.code}>
        <td><strong>{g.code}</strong></td>
        <td><strong>{g.mr}</strong><small>MULTI-TAG / customer grouping subject to approval</small></td>
        <td>{source?.a?.find(x=>x.code===g.code)?.description||g.mr}</td>
        <td>Locations: {sites}{!customer&&<small>{g.pricedCount} priced / {g.includedCount} included / {g.pendingCount} not priced</small>}</td>
        <td>1 lot</td>
        <td className="p553-price-cell">{money(g.parentUSD)}</td>
        <td className="p553-price-cell"><strong>{money(g.parentUSD)}</strong></td>
        <td><button type="button" className="p553-mr-expand" onClick={()=>setActiveTab(g.code)}>＋ {g.code} {g.mr.replace("-","")}</button></td>
       </tr>;
      })}
      <tr className="p553-sheet-total"><td colSpan={6}>Total Part A (A1–A4) · USD</td>
       <td className="p553-price-cell">{money(model.groups.reduce((s,g)=>s+(g.parentUSD||0),0))}</td><td><strong>REV03 USD</strong></td></tr>
     </tbody>
    </table></div>
    {customer&&origin==="official"&&<MrScopeSummary0553 model={summary} showPrices={showPrices}/>}
   </div>
   {!customer&&model.groups.map(g=><div key={g.code} hidden={activeTab!==g.code}>
    {(!g.sourceComplete||g.quantityPendingCount>0)&&<p className="p55-note">Source completeness requires review{g.quantityPendingCount?"; quantity/unit missing on "+g.quantityPendingCount+" priced rows":""}. A matching subtotal does not close technical or price gaps.</p>}
    <ScheduleC1Breakdown0553
     group={g}
     sourceGroup={source?.a?.find(x=>x.code===g.code)||null}
     internal={true}
     showSubPrices={showPrices}
     onPricingModeChange={setPrices}
     onOpenSource={onOpenSource}
     moduleId="bid.budget.pricing.part-a-breakdown.schedule-c1"
     titlePrefix={`Part A · ${g.code} (Rev03 EQ-DISP Reconciled)`}
    />
   </div>)}
   {customer&&model.groups.map(g=>activeTab===g.code&&<div key={g.code}>
    <ScheduleC1Breakdown0553
     group={g}
     sourceGroup={source?.a?.find(x=>x.code===g.code)||null}
     internal={false}
     showSubPrices={showPrices}
     onPricingModeChange={setPrices}
     moduleId="bid.budget.pricing.part-a-breakdown.schedule-c1"
     titlePrefix={`Part A · ${g.code} (Customer Schedule C1)`}
    />
   </div>)}
  </div>
 </section>;
}

function MrScopeSummary0553({model,showPrices}){
 return model.groups.map(g=><details key={g.code} open className="p553-breakdown-group" data-mr-summary-group={g.code}>
  <summary><strong>{g.code} · {g.mr} · {g.description}</strong><span>USD {money(g.parentUSD)}</span></summary>
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
