import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {RELEASE_POLICY_0553,RELEASE_CUSTOMER_COLUMNS_0553} from "./data/releaseCommercialModel0553";
import "./releaseWorkbook0553.css";

const WORKSHEETS=Object.freeze([
 ["Scope of supply","SUMMARY"],["B10 CommSpares","B10"],["B11 SpecialTool","B11"],
 ["B13 Consumerables","B13"],["C1 CapitalSpares","C1"],["C2 2Y-Spares","C2"]
]);
const B_ROWS=Array.from({length:14},(_,i)=>"B"+(i+1));
const format=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const parseName=code=>REV08_BASELINE.summary.find(r=>r[0]===code)?.[1]||code;
const ANNEX_TITLE={
 B10:["ERECTION, PRECOMMISSIONING, COMMISSIONING, START UP SPARE PARTS LISTS","安装，预试车，试车和开车的备件清单"],
 B11:["SUPPLIER RECOMMENDATION FOR SPECIAL TOOLS","供货商推荐的特殊工具"],
 B13:["SUPPLIER RECOMMENDATION FOR CONSUMERABLES","供货商推荐的耗材"],
 C1:["SUPPLIER RECOMMENDATION FOR CAPITAL SPARE PARTS","供货商推荐的主要备品备件"],
 C2:["SUPPLIER RECOMMENDATION FOR 2 YEARS OPERATION SPARE PARTS","供货商推荐的两年运行备品备件"]
};
const UNIT_NOTE="Original 4-Scope of Supply.xlsx price fields use (CURRENCY); THB staging only. Verified final currency/FX must be approved before native export.";
export function ReleaseCustomerWorkbook0553({model,onOpenSource=()=>{},title="10.3 — Customer Release"}){
 const [sheet,setSheet]=useState("Scope of supply");
 const [viewer,setViewer]=useState("INTERNAL");
 const [source,setSource]=useState(null);
 const [showOverflow,setShowOverflow]=useState(false);
 const internal=viewer==="INTERNAL",code=WORKSHEETS.find(x=>x[0]===sheet)?.[1]||"SUMMARY";
 const aTags=model.a.flatMap(x=>x.sourceRows.map(line=>({...line,mrCode:x.code})));
 const overflow=aTags.slice(15),rows=aTags.slice(0,15);
 const annexLines=model.annex[code]||[];
 const annexOverflow=annexLines.slice(13);
 const record=(item)=>{
  if(!internal)return;
  setSource(item);
 };
 const viewSource=(item)=><button type="button" className="p553-origin-link"
   onClick={()=>record(item)} aria-label={"ดูต้นทาง "+(item.code||item.mrCode||"")}>↗ Source</button>;
 const canQuote=false; // Pending written approval and price/fidelity gates.
 const saveDraft=()=>{
  const payload={project:"PJ2608-0553",schema:"0553-RELEASE-PROVENANCE-DRAFT-01",
   approved:false,releaseAllowed:false,currency:"THB",revision:"UNAPPROVED_WORKING",
   pricingPolicy:RELEASE_POLICY_0553,sourceCoverage:model.sourceCoverage,
   staged:{a:model.a.map(x=>({code:x.code,mr:x.mr,costTHB:x.previewCostTHB,
    provisionalSellTHB:x.previewSellTHB,sourceModuleId:x.sourceModuleId,
    lines:x.sourceRows.map(r=>({tag:r.tag,site:r.site,qty:r.qty,costTHB:r.costTHB,
     provisionalSellTHB:r.customerSellTHB,sourceRef:r.sourceRef}))})),
   b:model.b.map(x=>({code:x.code,customerSellTHB:x.customerSellTHB,
    samTelDeductionTHB:x.samTelDeductionTHB,sourceModuleId:x.sourceModuleId})),
   c:model.c.map(x=>({code:x.code,verifiedDirectCostTHB:x.verifiedDirectCostTHB,
    customerSellTHB:x.customerSellTHB,sourceModuleId:x.sourceModuleId}))},
   note:"INTERNAL STAGING ONLY. Not an approved XLSX cell mapping. Native XLSX export is gated."};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),link=document.createElement("a");
  link.href=url;link.download="PJ2608-0553_10.3_RELEASE_STAGING_NOT_APPROVED.json";
  document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
 };
 return <section className="p55-panel p553-release-workbook"
  data-component-key="bid.budget.pricing.release.preview">
  <div className="p55-eyebrow">{title} · XLSX-SHAPED JSX, NOT EXCEL <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.pricing.release.preview"/></div>
  <h3>4-Scope of Supply.xlsx · Customer Presentation (6 sheets)</h3>
  <p className="p55-note"><strong>Internal Preview — NOT RELEASED.</strong> รูปแบบหัวตาราง รายการ B1–B14 และ Annex จำลองตามต้นฉบับโดยไม่เปลี่ยน Working Cost ต้นทาง. Part A แสดง TAG ที่เชื่อมโยงจาก 10.1 และ B แสดงราคา Working Sell ของ 10.2 โดยตรง; C ยังไม่คิด 30% จาก Working Sell ซึ่งไม่ใช่ Direct Cost.</p>
  <div className="p553-release-controls">
   <label>View <select value={viewer} onChange={e=>{setViewer(e.target.value);setSource(null);}}>
     <option value="INTERNAL">Internal + source trace</option><option value="CUSTOMER">Customer clean preview</option>
   </select></label>
   <button type="button" onClick={saveDraft} className="p553-detail-button">Export source mapping JSON (internal draft)</button>
   <button type="button" disabled={!canQuote} title="Customer export requires signed release and validated native template mapping" className="p553-detail-button">Export Native Original XLSX — HOLD</button>
  </div>
  <div className="p553-release-tabs" role="tablist" aria-label="Original customer worksheets">
   {WORKSHEETS.map(([name])=><button type="button" role="tab" aria-selected={sheet===name}
     className={sheet===name?"is-active":""} key={name} onClick={()=>{setSheet(name);setSource(null);}}>
     {name}</button>)}
  </div>
  <div className="p553-native-sheet">
   {code==="SUMMARY"?<>
    <div className="p553-native-title">Scope of supply<br/>供货范围</div>
    <div className="p553-sheet-meta"><strong>Project</strong><span>ZAWTIKA DEVELOPMENT PROJECT PHASE 1F</span>
      <strong>RFQ No.</strong><span> </span><strong>Package Name</strong><span> </span></div>
    <div className="p553-sheet-scroll"><table className="p553-customer-table">
      <thead><tr>{RELEASE_CUSTOMER_COLUMNS_0553.scope.map(h=><th key={h}>{h.split(" / ").map((t,i)=><React.Fragment key={i}>{i>0&&<br/>}{t}</React.Fragment>)}</th>)}</tr></thead>
      <tbody>
       <tr className="p553-sheet-section"><td colSpan={8}>Part A: BASIC<br/>A部分：基本</td></tr>
       <tr className="p553-sheet-subheading"><td colSpan={8}>A1. Main Equipment · TAG-based Working Mapping</td></tr>
       {rows.map((r,i)=><tr key={r.mrCode+":"+r.site+":"+r.id+":"+i}>
        <td>{i+1}</td><td><strong>{r.tag}</strong>{internal&&<><small>{r.site} · {r.mr}</small>{viewSource(r)}</>}</td>
        <td>{r.description}</td><td>{r.specification}</td><td>{r.qty??"TBC"}</td>
        <td className="p553-price-cell">{format(r.customerUnitTHB)}</td>
        <td className="p553-price-cell">{format(r.customerSellTHB)}</td>
        <td>{internal?"PROVISIONAL · "+r.mrCode+" · "+r.status:""}</td></tr>)}
       {Array.from({length:Math.max(0,15-rows.length)},(_,i)=><tr key={"blank-a-"+i} className="p553-empty-row">{Array.from({length:8},(_,j)=><td key={j}>&nbsp;</td>)}</tr>)}
       <tr className="p553-sheet-section"><td colSpan={8}>Part B: OTHERS<br/>B部分：其它</td></tr>
       {B_ROWS.map(id=>{
        const r=model.b.find(x=>x.code===id);
        return <tr key={id}><td><strong>{id}</strong></td>
         <td colSpan={3}>{parseName(id)} {internal&&r&&viewSource(r)}</td>
         <td>1 lot</td><td className="p553-price-cell">{format(r?.customerSellTHB)}</td>
         <td className="p553-price-cell">{format(r?.customerSellTHB)}</td>
         <td>{["B10","B11","B13"].includes(id)?"Refer to Annex "+id:id==="B12"?"Refer to Annex B12 (not in original six sheets)":id==="B7"||id==="B9"?"Conditional scope — confirm before release":""}</td>
        </tr>;
       })}
       <tr className="p553-sheet-total"><td colSpan={6}>Total 合计 — Base A+B</td><td>{format(model.summary.baseCustomerSellTHB)}</td><td>{internal?"HOLD · missing cost/approved snapshot":""}</td></tr>
       <tr className="p553-sheet-highlight"><td colSpan={8}>Prices shall include for all the scope of supply and work as specified in the Material Requisition, but not limited to above items.</td></tr>
       <tr className="p553-sheet-section"><td colSpan={8}>Part C: OPTIONS<br/>选项</td></tr>
       {model.c.map(r=><tr key={r.code}><td><strong>{r.code}</strong></td><td colSpan={3}>{parseName(r.code)} {internal&&viewSource(r)}</td><td>1 lot</td>
        <td className="p553-price-cell">{format(r.customerSellTHB)}</td><td className="p553-price-cell">{format(r.customerSellTHB)}</td>
        <td>Refer to Annex {r.code} · OPTION (excluded from base)</td></tr>)}
       <tr className="p553-sheet-highlight"><td colSpan={8}>Remark: Delivery term shall follow program logistic proposal and fixed by each cluster per equipment cargo size.</td></tr>
      </tbody></table></div>
    {overflow.length>0&&<div className="p553-release-overflow">
      <strong>OVERFLOW — {overflow.length} Part A TAG rows exceed the 15 physical template rows.</strong> Native XLSX export is blocked; do not drop TAGs or resize template.
      <button className="p553-detail-button" type="button" onClick={()=>setShowOverflow(x=>!x)}>{showOverflow?"Hide":"View"} overflow TAGs</button>
      {showOverflow&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Site</th><th>TAG</th><th>Description</th><th>Source</th></tr></thead><tbody>{overflow.map((r,i)=><tr key={i}><td>{r.site}</td><td>{r.tag}</td><td>{r.description}</td><td>{r.mr} <span>{internal&&viewSource(r)}</span></td></tr>)}</tbody></table></div>}
     </div>}
   </>:<>
    <div className="p553-native-title">{ANNEX_TITLE[code]?.[0]}<br/>{ANNEX_TITLE[code]?.[1]}</div>
    <div className="p553-sheet-scroll"><table className="p553-customer-table p553-annex-table">
     <thead><tr><th rowSpan={2}>Item<br/>序号</th><th rowSpan={2}>Tag No<br/>位号</th><th rowSpan={2}>Description<br/>描述</th><th rowSpan={2}>Detail Specification<br/>详细规格</th><th rowSpan={2}>Materials<br/>材质</th><th rowSpan={2}>QTY<br/>数量</th><th colSpan={code.startsWith("C")?3:2}>DDP site （DDP现场交货）</th></tr>
       <tr><th>UNIT PRICE (CURRENCY)<br/>单价</th><th>TOTAL PRICE (CURRENCY)<br/>总价</th>
        {code.startsWith("C")&&<th>Lead time (ARO)<br/>交货期 (周)</th>}</tr></thead>
     <tbody>{Array.from({length:13},(_,i)=>{
      const r=annexLines[i];return <tr key={r?.id||"blank:"+i}>
       <td>{r?i+1:""}</td><td>{r?.tagNo||""}{internal&&r&&viewSource(r)}</td>
       <td>{r?.description||""}</td><td>{r?.specification||""}</td>
       <td>{r?.materials||""}</td><td>{r?.qty??""}</td>
       <td className="p553-price-cell">{format(r?.customerUnitTHB)}</td>
       <td className="p553-price-cell">{format(r?.customerTotalTHB)}</td>
       {code.startsWith("C")&&<td>{r?.leadTimeARO??""}</td>}
      </tr>;
     })}
      <tr className="p553-sheet-total"><td colSpan={7}>Total Price DDP PURCHASER'S YARD:<br/>DDP采购商场地的总费用：</td>
       <td>Not quote</td>{code.startsWith("C")&&<td/>}</tr>
     </tbody></table></div>
    {annexOverflow.length>0&&<div className="p553-release-overflow">OVERFLOW: {annexOverflow.length} rows beyond original 13 item slots. Native export blocked. {internal&&annexOverflow.map(x=><div key={x.id}>{x.id} · {x.description}</div>)}</div>}
    <div className="p553-annex-remark">Remark 注释: {code.startsWith("C")?
      "Above Price of spare parts is valid up to Two years after Delivery date of purchase order":
      "Please include the costs for installation, commissioning, spare parts and special tools in the total price, and provide a detailed breakdown"}</div>
    <p className="p55-note">{UNIT_NOTE} Annex detail prices are blank until OEM TAG/SKU and cost allocation are verified. Historical working reference is internal only.</p>
   </>}
  </div>
  {internal&&source&&<div className="p553-source-drawer" role="region" aria-label="Source trace">
    <div className="p553-source-head"><strong>Source Trace · {source.code||source.mrCode}</strong>
      <button type="button" onClick={()=>setSource(null)}>× Close</button></div>
    <p><strong>Module:</strong> <code>{source.sourceModuleId}</code></p>
    <p><strong>Trace:</strong> {source.mr||source.code||""} · {source.site||""} · {source.tag||source.tagNo||""} · {source.sourceRef||source.sourceId||source.workingSellBasis||""}</p>
    <p><strong>Release Status:</strong> HOLD · {source.state||source.status||source.sourceStatus||"Pre-award budget source; verify OEM cost and TAG"}</p>
    <button type="button" className="p553-detail-button" onClick={()=>onOpenSource(source)}>
     Go to {source.sourceModuleId?.startsWith("bid.budget.bom")?"10.1 Engineering BOM":"10.2 Working BC"} ↗
    </button>
   </div>}
  <p className="p55-note">Native XLSX preservation: original 6-sheet template remains untouched. Export disabled pending signed revision, source-cell mapping, capacity check and verified currency. Internal Source controls and CFO data must NEVER be written into customer file.</p>
 </section>;
}
