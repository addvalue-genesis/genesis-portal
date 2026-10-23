import React,{useEffect,useMemo,useRef,useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {OFFICIAL_WORKBOOK_TEMPLATE_0553} from "./data/officialWorkbookTemplate0553";
import {buildNativeWorkingDraft0553} from "./nativeWorkingDraft0553";
import {auditCurrentCustomerProjection0553} from "./estimateToBidMapping";
import {selectBcTurnkeyWorkingCost0553} from "./data/bcTurnkeyWorkingCost0553";
import {selectScopePartBcWorking0553} from "./data/scopePartBcReadModel0553";
import {RELEASE_CUSTOMER_COLUMNS_0553,buildPartATagGroupBreakdown0553} from "./data/releaseCommercialModel0553";
import {deriveBulkSourceToReleaseTrace0553} from "./data/bulkSourceToReleaseTrace0553";
import "./releaseWorkbook0553.css";

// Single customer-format sheet preview. Internal TAG/source drilldowns are UI-only
// and MUST NOT be included in the unchanged six-sheet native XLSX export.
const WORKSHEETS=Object.freeze([
 ["Scope of supply","SUMMARY"],["B10 CommSpares","B10"],["B11 SpecialTool","B11"],
 ["B13 Consumerables","B13"],["C1 CapitalSpares","C1"],["C2 2Y-Spares","C2"]
]);
const B_ROWS=Array.from({length:14},(_,i)=>"B"+(i+1));
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const cash=n=>Number.isFinite(n)?"THB "+money(n):"PENDING";
const formatUnit=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"—";
// Customer descriptions must follow the native source workbook, not Rev08 history.
const sourceScopeRows=OFFICIAL_WORKBOOK_TEMPLATE_0553.sheets.find(s=>s.name==="Scope of supply")?.rows||[];
const parseName=code=>sourceScopeRows.find(row=>row[1]===code)?.[2]||
 REV08_BASELINE.summary.find(r=>r[0]===code)?.[1]||code;
const ANNEX_TITLE={
 B10:["ERECTION, PRECOMMISSIONING, COMMISSIONING, START UP SPARE PARTS LISTS","安装，预试车，试车和开车的备件清单"],
 B11:["SUPPLIER RECOMMENDATION FOR SPECIAL TOOLS","供货商推荐的特殊工具"],
 B13:["SUPPLIER RECOMMENDATION FOR CONSUMERABLES","供货商推荐的耗材"],
 C1:["SUPPLIER RECOMMENDATION FOR CAPITAL SPARE PARTS","供货商推荐的主要备品备件"],
 C2:["SUPPLIER RECOMMENDATION FOR 2 YEARS OPERATION SPARE PARTS","供货商推荐的两年运行备品备件"]
};
const addKnown=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)?Math.round((a+b)*100)/100:null;
export function ReleaseCustomerWorkbook0553({model,recipient="INTERNAL",onOpenSource=()=>{},focusAnnexTarget=null,title="10.3 — Customer Release"}){
 const [sheet,setSheet]=useState("Scope of supply");
 // Source→Release: resolve one exact B/C spare row, never change a price.
 const focusKey=focusAnnexTarget?.code+"::"+focusAnnexTarget?.sourceId+"::"+focusAnnexTarget?.seq;
 useEffect(()=>{
  if(!focusAnnexTarget?.code)return;
  const matched=WORKSHEETS.find(([name,code])=>code===focusAnnexTarget.code);
  if(matched)setSheet(matched[0]);
 },[focusKey]);
 useEffect(()=>{
  if(!focusAnnexTarget?.code)return;
  const matched=WORKSHEETS.find(([name,code])=>code===focusAnnexTarget.code);
  if(!matched||matched[0]!==sheet)return;
  const targetId="bid.budget.pricing.release.preview.annex."+
   focusAnnexTarget.code.toLowerCase()+"."+focusAnnexTarget.sourceId.toLowerCase();
  const target=[...document.querySelectorAll("[data-component-key]")]
   .find(node=>node.getAttribute("data-component-key")===targetId);
  if(target){
   for(let node=target;node;node=node.parentElement){
    if(node.tagName==="DETAILS")node.open=true;
   }
   target.scrollIntoView?.({behavior:"smooth",block:"center"});
  }
 },[focusKey,sheet]);
 const [viewer,setViewer]=useState("CUSTOMER");
 const [source,setSource]=useState(null);
 const [expandedMr,setExpandedMr]=useState({});
 const [showChecks,setShowChecks]=useState(false);
 const sourceFileRef=useRef(null);
 const [nativeBusy,setNativeBusy]=useState(false);
 const [nativeReport,setNativeReport]=useState(null);
 const internal=recipient==="INTERNAL"&&viewer==="INTERNAL";
 const code=WORKSHEETS.find(x=>x[0]===sheet)?.[1]||"SUMMARY";
 const partA=buildPartATagGroupBreakdown0553(model);
 const annexLines=model.annex[code]||[];
 const annexModel=model.annexModels?.[code]||null;
 const annexOverflow=annexLines.slice(13);
 const bLines=model.b;
 const aWorkingTotal=partA.pricedFloorTHB;
 const bWorkingTotal=model.summary.bProvisionalCustomerSellTHB;
 const provisionalBase=addKnown(model.summary.aProvisionalCustomerSellTHB,bWorkingTotal);
 const tagCount=model.a.reduce((n,p)=>n+p.sourceRows.length,0);
 const isOverOriginalCapacity=tagCount>15;
 // Existing 10.4 registry supplements—not replaces—the active 10.3 adapter.
 // This is a read-only parity check; the 21 estimate-line allocations remain HOLD.
 const mappingAudit=useMemo(()=>auditCurrentCustomerProjection0553({
  canonical:selectBcTurnkeyWorkingCost0553(),release:model,
  scope:selectScopePartBcWorking0553()
 }),[model]);
 const bulkGate=useMemo(()=>deriveBulkSourceToReleaseTrace0553({releaseModel:model}),[model]);
 const activeChecks=[
  {id:"MAP",label:"10.4 A/B/C → 10.3/10.5 → Native customer row parity",
   state:mappingAudit.selectedValueParity?"REVIEW":"HOLD",
   detail:mappingAudit.declaredMappingCount+" contract lines; "+
    mappingAudit.unresolvedEstimateLines+" estimate allocations still need evidence; "+
    (mappingAudit.selectedValueParity?"current value projection matches":"SOURCE MISMATCH")},
  {id:"A-SUM",label:"10.1 → 10.3 Part A vs CFO",state:partA.reconciliationPassed?"PASS":"HOLD",detail:"Working price "+cash(aWorkingTotal)+" · CFO "+cash(partA.expectedPreviewTHB)},
  {id:"A-TAGS",label:"Original Part A layout / Buyer TAG grouping approval",state:isOverOriginalCapacity?"HOLD":"REVIEW",detail:tagCount+" source TAG lines → 4 MR summary rows; buyer must accept group-level TAG mapping for original 15 slots"},
  {id:"A-BULK",label:"10.1 MR0001–MR0004 Physical BULK → 10.3 / 10.5",state:bulkGate.sourceToReleaseReady?"PASS":"HOLD",
   detail:bulkGate.applicable+" applicable site/MR groups; "+bulkGate.totalFunctionalCandidates+" cable-end function candidates NOT measured runs. "+
    "Working design LNA to RFI BDA ONLY at unchanged location, historical Rev00 relocation NOT adopted; OEM/Ex/cable-end proof open; no new A5 or MGW purchase."},
  {id:"B-SCOPE",label:"10.2 B1–B14 Working Sell",state:model.sourceCoverage.bSellReady?"PREVIEW":"HOLD",detail:"B9 quoted 1 LS included once in Base; Yard execution conditional, B7 reserve still under review"},
  {id:"B-COST",label:"10.2 B1–B14 verified Direct Cost",state:model.sourceCoverage.bCostReady?"PASS":"HOLD",detail:"Required for actual ADDVALUE profit, not for displaying provisional Working Sell"},
  {id:"C-COST",label:"10.2 C1/C2 optional supplier cost",state:model.sourceCoverage.cCostReady?"PASS":"HOLD",detail:"No 30% markup of C Working Sell; verified direct cost required"},
  {id:"ANNEX",label:"Original Annex B10/B11/B13/C1/C2 capacities",state:model.sourceCoverage.annexOverflow.length?"HOLD":"REVIEW",detail:model.sourceCoverage.annexOverflow.length?"Exceeds 13 rows: "+model.sourceCoverage.annexOverflow.join(", "):"13 original slots per Annex / OEM price proof pending"},
  {id:"ANNEX-PRICE",label:"10.2 → 10.3 Annex totals",state:Object.values(model.annexModels||{}).every(x=>x.reconciled)?"REVIEW":"HOLD",
   detail:Object.entries(model.annexModels||{}).map(([id,x])=>id+": "+money(x.selectedWorkingTHB)+" source − "+money(x.annexLineTotalTHB)+" lines = "+money(x.varianceTHB)+" difference").join(" · ")},
  {id:"EXPORT",label:"Signed snapshot / native XLSX geometry and currency",state:"HOLD",detail:"No approved release and source-cell mapping; original workbook unchanged"}
 ];
 const canQuote=false; // Final customer-issued XLSX still requires approval.
 const chooseNativeDraft=()=>sourceFileRef.current?.click();
 const exportNativeDraft=async event=>{
  const file=event.target.files?.[0];
  event.target.value="";
  if(!file)return;
  setNativeBusy(true);setNativeReport(null);
  try{
   const result=await buildNativeWorkingDraft0553(file,model);
   const url=URL.createObjectURL(result.blob),link=document.createElement("a");
   link.href=url;link.download=result.filename;document.body.appendChild(link);
   link.click();link.remove();
   window.setTimeout(()=>URL.revokeObjectURL(url),15000);
   setNativeReport({success:true,text:"Exported: "+result.filename,
    mappedCells:result.mappedCells,warnings:result.warnings});
  }catch(error){
   setNativeReport({success:false,text:"Native export failed: "+(error?.message||String(error)),warnings:[]});
  }finally{setNativeBusy(false);}
 };
 const openSource=item=>{if(internal)setSource(item);};
 const sourceButton=item=>internal?<span className="p553-origin-actions">
  <button type="button" className={"p553-origin-link "+(item.sourceModuleId?.startsWith("bid.budget.bom")?"p553-origin-link--a":item.code?.startsWith("C")?"p553-origin-link--c":"p553-origin-link--b")}
   aria-label={"Open Module ID "+(item.sourceModuleId||item.code||"")} title={item.sourceModuleId}
   onClick={()=>onOpenSource({...item,sourceModuleId:item.sourceRowModuleId||item.sourceModuleId})}>
   ↗ {item.sourceRowModuleId?"10.2 Source":item.sourceModuleId||item.code||"Source"}</button>
  <button type="button" className="p553-origin-trace" onClick={()=>openSource(item)}>Trace</button>
 </span>:null;
 const toggleMr=key=>setExpandedMr(old=>({...old,[key]:!old[key]}));
 return <section className="p55-panel p553-release-workbook" data-component-key="bid.budget.pricing.release.preview">
   <div className="p55-eyebrow">{title} · 10.3 / bid.budget.pricing.release.preview <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.pricing.release.preview"/></div>
   <h3>Customer Excel Format Preview — 4-Scope of Supply.xlsx</h3>
   <p className="p55-note"><strong>PRE-EXPORT PREVIEW / NOT ISSUED.</strong> ตารางนี้เป็น JSX จำลองแบบฟอร์มลูกค้า ไม่ใช่ไฟล์ Excel ที่ Export แล้ว ข้อมูล A1–A4 สรุปทั้ง MR จาก 10.1, B1–B14 จาก Working Sell ของ 10.2, C1/C2 รอ Verified Direct Cost และแยกจาก Base</p>
   <div className="p553-release-controls">
    <label>Preview mode
     <select value={recipient==="INTERNAL"?viewer:"CUSTOMER"} onChange={e=>{setViewer(e.target.value);setSource(null);}} disabled={recipient!=="INTERNAL"}>
      <option value="CUSTOMER">Customer Excel Preview</option>
      <option value="INTERNAL">Internal · Expand TAG / Source</option>
     </select>
    </label>
    {recipient==="INTERNAL"&&<button type="button" className="p553-detail-button"
      onClick={()=>setShowChecks(x=>!x)} aria-expanded={showChecks}>{showChecks?"− Hide":"＋ Review"} Export checks ({activeChecks.filter(x=>x.state==="HOLD").length} HOLD)</button>}
    {recipient==="INTERNAL"&&<>
      <input ref={sourceFileRef} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
       onChange={exportNativeDraft} style={{display:"none"}} aria-label="Select original 4-Scope of Supply.xlsx"/>
      <button type="button" className="p553-detail-button" onClick={chooseNativeDraft} disabled={nativeBusy}
       title="Choose original 4-Scope of Supply.xlsx from your computer. File processed only in your browser; outputs a new native-format working draft.">
       {nativeBusy?"Preparing Native XLSX…":"Export Native XLSX — WORKING DRAFT"}
      </button>
     </>}
    <button type="button" disabled={!canQuote} className="p553-detail-button"
      title="Approved customer XLSX requires signed release and completed checks">Final Customer Release — HOLD</button>
   </div>
   {nativeReport&&recipient==="INTERNAL"&&<section className="p553-native-warning" role="status">
    <strong>{nativeReport.success?"WORKING DRAFT XLSX READY":"EXPORT ERROR"}</strong> · {nativeReport.text}
    {nativeReport.success&&<div>{nativeReport.mappedCells} native cells mapped; original file not modified; NOT approved for customer submission.</div>}
    {nativeReport.warnings.length>0&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>No.</th><th>Working Draft Checks / Warnings</th></tr></thead>
     <tbody>{nativeReport.warnings.map((w,i)=><tr key={i}><td>{i+1}</td><td>{w}</td></tr>)}</tbody>
    </table></div>}
   </section>}
   {showChecks&&recipient==="INTERNAL"&&<div className="p55-table-wrap p553-release-checks">
    <table className="p55-table p55-table--compact"><thead><tr><th>Check</th><th>Module / Requirement</th><th>Status</th><th>Detail</th></tr></thead>
     <tbody>{activeChecks.map(x=><tr key={x.id}><td>{x.id}</td><td>{x.label}</td><td><strong>{x.state}</strong></td><td>{x.detail}</td></tr>)}</tbody>
    </table>
   </div>}
   <div className="p553-release-tabs" role="tablist" aria-label="Original customer workbook sheets">
    {WORKSHEETS.map(([name])=><button type="button" key={name} role="tab" aria-selected={sheet===name}
     className={sheet===name?"is-active":""} onClick={()=>{setSheet(name);setSource(null);}}>{name}</button>)}
   </div>
   <div className="p553-native-sheet">
    {code==="SUMMARY"?<>
     <div className="p553-native-title">Scope of supply<br/>供货范围</div>
     <div className="p553-sheet-meta"><strong>Project</strong><span>ZAWTIKA DEVELOPMENT PROJECT PHASE 1F</span>
      <strong>RFQ No.</strong><span> </span><strong>Package Name</strong><span> </span></div>
     <div className="p553-preview-totals">
      <span>Part A / 10.1 · <strong>{cash(aWorkingTotal)}</strong></span>
      <span>Part B / 10.2 · <strong>{cash(bWorkingTotal)}</strong></span>
      <span>Base A+B (working only) · <strong>{cash(provisionalBase)}</strong></span>
     </div>
     <div className="p553-sheet-scroll"><table className="p553-customer-table">
      <thead><tr>{RELEASE_CUSTOMER_COLUMNS_0553.scope.map(h=><th key={h}>{h.split(" / ").map((t,i)=><React.Fragment key={i}>{i>0&&<br/>}{t}</React.Fragment>)}</th>)}</tr></thead>
      <tbody>
       <tr className="p553-sheet-section"><td colSpan={8}>Part A: BASIC<br/>A部分：基本</td></tr>
       <tr className="p553-sheet-subheading"><td colSpan={8}>A1. Main Equipment · Source MR-0001–MR-0004 / Customer Grouping Preview</td></tr>
       {partA.groups.map((part,i)=><React.Fragment key={part.code}>
        <tr className="p553-mr-preview-row">
         <td><strong>{part.code}</strong></td>
         <td><strong>{part.mr}</strong><small>MULTI-TAG / customer grouping subject to approval</small></td>
         <td>{part.description}</td>
         <td>{part.sourceRows.length} TAG lines across {new Set(part.sourceRows.map(x=>x.site)).size} sites
           {internal&&<small>{part.unresolvedCount} unpriced / pending</small>}</td>
         <td>1 lot</td>
         <td className="p553-price-cell">{money(part.previewSellTHB)}</td>
         <td className="p553-price-cell"><strong>{money(part.previewSellTHB)}</strong></td>
         <td>{internal&&<>
          <button className="p553-mr-expand" type="button" aria-expanded={!!expandedMr[part.code]}
           onClick={()=>toggleMr(part.code)}>{expandedMr[part.code]?"− Hide":"＋ TAG / Site"}</button>
          {sourceButton(part)}
         </>}</td>
        </tr>
        {internal&&expandedMr[part.code]&&<tr className="p553-drilldown-only"><td colSpan={8}>
         <strong>{part.code} / {part.mr} — Source TAG detail (Internal UI only, not additional XLSX rows)</strong>
         <div className="p553-drilldown-table-wrap"><table className="p553-drilldown-table">
          <thead><tr><th>Site</th><th>TAG No.</th><th>Description</th><th>Qty</th><th>Unit Sell THB</th><th>Sell THB</th><th>Module</th></tr></thead>
          <tbody>{part.sourceRows.map((tag,ix)=><tr key={tag.id+":"+tag.site+":"+ix}>
           <td>{tag.site||"—"}</td><td>{tag.tag}</td><td>{tag.description}</td>
           <td>{tag.qty??"TBC"}</td><td className="p553-price-cell">{formatUnit(tag.customerUnitTHB)}</td>
           <td className="p553-price-cell">{money(tag.customerSellTHB)}</td>
           <td>10.1 {sourceButton(tag)}</td>
          </tr>)}</tbody>
          <tfoot><tr><th colSpan={5}>Total {part.code} (same as parent row)</th>
           <th className="p553-price-cell">{money(part.previewSellTHB)}</th><th>Working · NOT RELEASED</th></tr></tfoot>
         </table></div>
        </td></tr>}
       </React.Fragment>)}
       {Array.from({length:11},(_,i)=><tr key={"empty-part-a-"+i} className="p553-empty-row">
        {Array.from({length:8},(_,j)=><td key={j}>&nbsp;</td>)}</tr>)}
       <tr className="p553-sheet-section"><td colSpan={8}>Part B: OTHERS<br/>B部分：其它</td></tr>
       {B_ROWS.map(id=>{
        const line=bLines.find(r=>r.code===id);
        return <React.Fragment key={id}><tr><td><strong>{id}</strong></td>
         <td colSpan={3}>{parseName(id)} {sourceButton(line||{code:id,sourceModuleId:"bid.budget.working.bc."+id.toLowerCase()})}</td>
         <td>1 lot</td><td className="p553-price-cell">{money(line?.customerSellTHB)}</td>
         <td className="p553-price-cell">{money(line?.customerSellTHB)}</td>
         <td>{["B10","B11","B13"].includes(id)?"refer to Annex "+id:
          id==="B12"?"refer to Annex B12":
          line?.executionConditional&&internal?"Quoted in Base · attendance on written call-out":line?.conditional&&internal?"Conditional — verify before release":""}</td>
        </tr>
        {internal&&id==="B3"&&line?.b3GroupTrace&&<tr className="p553-drilldown-only"
         data-component-key="bid.budget.pricing.release.b3.group-trace"><td colSpan={8}>
         <strong>10.3 B3 — Work Type Source-to-Release attribution (internal only, NOT 4 quotation lines)</strong>
         <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
          <thead><tr><th>10.2 Group Source</th><th>Working SELL THB</th><th>10.3 Customer Preview Attribution THB</th>
           <th>Status</th><th>Go to 10.2 Source</th></tr></thead>
          <tbody>{line.b3GroupTrace.map(g=><tr key={g.id}>
           <td>{g.name}<small>{g.id}</small></td>
           <td>{money(g.workingSellTHB)}</td><td>{money(g.customerPreviewAttributionTHB)}</td>
           <td>{g.status}<small>{g.approvalGate}</small></td>
           <td><button type="button" className="p553-detail-button"
             onClick={()=>onOpenSource({code:"B3",sourceModuleId:g.sourceModuleId})}>↗ 10.2 B3 Group</button></td>
          </tr>)}</tbody>
          <tfoot><tr><th>B3 Working Budget Preview — ONE customer LS</th>
           <th>{money(line.workingSellTHB)}</th><th>{money(line.customerSellTHB)}</th>
           <th>CP-B3 NOT ISSUED · No additional posting</th><th>Release HOLD</th></tr></tfoot>
         </table></div>
        </td></tr>}
        </React.Fragment>;
       })}
       <tr className="p553-sheet-total"><td colSpan={6}>Total 合计 / Base A+B (WORKING PREVIEW)</td>
        <td className="p553-price-cell">{money(provisionalBase)}</td>
        <td>{internal?"Pending verification · not approved bid":""}</td></tr>
       <tr className="p553-sheet-highlight"><td colSpan={8}>Prices shall include for all the scope of supply and work as specified in the Material Requisition, but not limited to above items.</td></tr>
       <tr className="p553-sheet-section"><td colSpan={8}>Part C: OPTIONS<br/>选项</td></tr>
       {model.c.map(r=><tr key={r.code}><td><strong>{r.code}</strong></td>
        <td colSpan={3}>{parseName(r.code)} {sourceButton(r)}</td>
        <td>1 lot</td><td className="p553-price-cell">{money(r.customerSellTHB)}</td>
        <td className="p553-price-cell">{money(r.customerSellTHB)}</td>
        <td>refer to Annex {r.code} · OPTION</td></tr>)}
       <tr className="p553-sheet-highlight"><td colSpan={8}>Remark: Delivery term shall follow program logistic proposal and fixed by each cluster per equipment cargo size.</td></tr>
      </tbody>
     </table></div>
     {isOverOriginalCapacity&&<p className="p553-native-warning">
      <strong>Native Excel constraint:</strong> 10.1 has {tagCount} priced TAG rows but the original Part A provides 15 item rows.
      This JSX groups all source data into four MR package rows, with no priced TAG silently discarded.
      Grouped Tag No. format must be accepted by purchaser before native export; no original cell size/layout changes are allowed.
     </p>}
    </>:<>
     <div className="p553-native-title">{ANNEX_TITLE[code]?.[0]}<br/>{ANNEX_TITLE[code]?.[1]}</div>
     <p className="p553-native-warning"><strong>{code} — {annexModel?.priceLabel||"WORKING REFERENCE"}</strong>
      {" "}· รายการจาก 10.2 — <code>bid.budget.working.bc.{code.toLowerCase()}</code>
      {code.startsWith("C")?" · Optional Spare: มีเพียง Budgetary Reference ยังไม่มี Verified Direct Cost สำหรับราคาขาย ×1.30":
      " · THB Working Sell, อ้างอิงราคา Budgetary Rev08; OEM Part No./SKU/การไม่ซ้ำซ้อนยังต้องตรวจ"}</p>
     <p className="p55-note p553-annex-reading-guide"><strong>วิธีอ่านตารางนี้ / How to read:</strong>
      Description = ซื้ออะไหล่อะไรและใช้ทำอะไร · Detail Specification = คุณสมบัติที่ต้องตรงกับของเดิม ·
      Materials = วัสดุหรือส่วนประกอบ (ถ้าไม่ทราบระบุ TBC) · Related TAGs = อุปกรณ์ที่อาจใช้อะไหล่นี้ร่วมกัน ไม่ใช่จำนวนที่จะซื้อ ·
      <strong> QTY = จำนวนอะไหล่สำรองที่จะซื้อ</strong>. ความเข้ากันได้ของ OEM ยังรอการยืนยัน</p>
     <div className="p553-sheet-scroll"><table className="p553-customer-table p553-annex-table">
      <thead><tr><th rowSpan={2}>Item<br/>序号</th><th rowSpan={2}>Tag No<br/>位号</th><th rowSpan={2}>Description<br/>描述</th><th rowSpan={2}>Detail Specification<br/>详细规格</th><th rowSpan={2}>Materials<br/>材质</th><th rowSpan={2}>QTY<br/>数量</th><th colSpan={code.startsWith("C")?3:2}>DDP site （DDP现场交货）</th></tr>
       <tr><th>UNIT PRICE (CURRENCY)<br/>单价</th><th>TOTAL PRICE (CURRENCY)<br/>总价</th>
        {code.startsWith("C")&&<th>Lead time (ARO)<br/>交货期 (周)</th>}</tr></thead>
      <tbody>{Array.from({length:13},(_,i)=>{
       const r=annexLines[i];return <tr key={r?.id||"empty:"+i}
        data-component-key={r?"bid.budget.pricing.release.preview.annex."+code.toLowerCase()+"."+r.sourceId.toLowerCase():undefined}>
        <td>{r?i+1:""}</td>
        <td className="p553-annex-tags">{r&&<><strong>{r.tagSummary||r.tagNo||"COMMON"}</strong>
         {r.relatedEquipmentTagCount>1&&<details className="p553-annex-tag-list">
          <summary>View {r.relatedEquipmentTagCount} TAGs / ดู TAG</summary>
          <div>{(r.relatedTagList||[]).map(tag=><code key={tag} className="p553-annex-tag-chip">{tag}</code>)}</div>
          <small>Functional TAG references only — OEM spare compatibility NOT verified</small>
         </details>}{sourceButton(r)}</>}</td>
        <td className="p553-annex-description">{r?.description&&<strong>{r.description}</strong>}
         {r?.purpose&&<small>{r.purpose}</small>}
         {internal&&r?.engineeringVerification&&<small>OEM SPIR: OPEN · {r.engineeringVerification.level} risk · Trace for details</small>}
         {internal&&r?.explanationTH&&<small>{r.explanationTH}</small>}</td>
        <td className="p553-annex-specification">{r?.specification||""}</td>
        <td className="p553-annex-materials">{r?.materials||""}</td>
        <td className="p553-annex-qty">{r?.qty??""}{r?.unit&&<small>{r.unit} · spare qty</small>}</td>
        <td className="p553-price-cell">{!r?(code==="C2"?"Not quote":""):
          code.startsWith("B")?formatUnit(r.customerUnitTHB):
          internal?formatUnit(r.workingUnitTHB):"Not quote"}
          {internal&&r&&<small>{r.priceClass.startsWith("OPTION")?"Reference only":"Working Sell / pre-award"}</small>}
        </td>
        <td className="p553-price-cell">{!r?(code==="C2"?"Not quote":""):
          code.startsWith("B")?money(r.customerTotalTHB):
          internal?money(r.workingTotalTHB):"Not quote"}
          {internal&&r?.sourceId&&<small>{r.sourceId}</small>}
        </td>
        {code.startsWith("C")&&<td>{r?.leadTimeARO??""}</td>}
       </tr>;
      })}
       <tr className="p553-sheet-total"><td colSpan={7}>Total Price DDP PURCHASER'S YARD:<br/>DDP采购商场地的总费用：</td>
        <td>{code.startsWith("B")?money(annexModel?.selectedWorkingTHB):"Not quote"}</td>
        {code.startsWith("C")&&<td/>}</tr>
      </tbody></table></div>
      {annexModel&&<div className="p553-annex-reconciliation" role="region" aria-label={code+" source reconciliation"}>
       <table className="p55-table p55-table--compact"><thead>
        <tr><th>Source / Pricing</th><th>10.2 Selected Working/Reference THB</th><th>Σ Qty × Unit (Annex lines) THB</th><th>Difference THB</th><th>Gate</th></tr>
       </thead><tbody><tr><td><strong>{code}</strong><small>10.2 → 10.3 · {annexModel.totalRows} lines</small></td>
        <td className="p553-price-cell">{money(annexModel.selectedWorkingTHB)}</td>
        <td className="p553-price-cell">{money(annexModel.annexLineTotalTHB)}</td>
        <td className="p553-price-cell">{money(annexModel.varianceTHB)}</td>
        <td>{annexModel.reconciled?"Source sums within 0.01 THB · NOT RELEASED":"HOLD — source summary differs from detailed lines"}</td>
       </tr></tbody></table>
       <p className="p55-note">{code.startsWith("C")?"OPTIONAL · Reference value for working review only; customer sell remains Not quote pending OEM verified cost.":"Budgetary Working Sell from 10.2; unresolved variance is not silently added to any spare item."} One priced row = one type of proposed spare stock; many related TAGs do NOT multiply spare Qty. TAGs shown are equipment-function candidates, NOT proof of interchangeable OEM part numbers.</p>
      </div>}
      <p className="p55-note"><strong>Reverse trace:</strong> 10.3 Annex ↔ 10.2 Owner / Spare Source uses the same source row ID.
       Expand TAG details for readability; the native XLSX draft retains the complete source TAG string inside its original fixed cell and cannot fold TAGs in Excel.
       Both presentations carry the same description, specification, materials, Qty and Working Sell; Customer Release remains HOLD.</p>
      {annexOverflow.length>0&&<p className="p553-native-warning">HOLD — {code}: {annexOverflow.length} source lines exceed the original 13 annex slots. No rows are discarded from the source; native export requires reconciliation.</p>}
      <div className="p553-annex-remark">Remark 注释: {code.startsWith("C")?
       "Above Price of spare parts is valid up to Two years after Delivery date of purchase order":
       "Please include the costs for installation, commissioning, spare parts and special tools in the total price, and provide a detailed breakdown"}</div>
      <p className="p55-note">10.2 {code}: B Annex shows source-backed Working Sell (NOT direct cost or Released Offer). C Annex shows working reference only in Internal view; customer price remains Not quote until verified OEM cost. Do not double count equipment included in A, startup spares B10, consumables B13 or two-year spares C2.</p>
    </>}
   </div>
   {internal&&source&&<div className="p553-source-drawer" role="region" aria-label="Source trace">
    <div className="p553-source-head"><strong>Source Trace · {source.code||source.mr||""}</strong>
     <button type="button" onClick={()=>setSource(null)}>× Close</button></div>
    <p><strong>Module:</strong> <code>{source.sourceModuleId}</code></p>
    <p><strong>Trace:</strong> {source.mr||source.code||""} · {source.site||""} · {source.tag||source.tagNo||""} · {source.sourceRef||source.sourceId||source.workingSellBasis||""}</p>
    <p><strong>Release status:</strong> HOLD · {source.state||source.status||source.sourceStatus||"Supplier pricing / TAG mapping not verified"}</p>
    {source.engineeringVerification&&<section className="p55-panel" style={{padding:10}}>
     <strong>OEM Spare Engineering Verification — {source.engineeringVerification.level}</strong>
     <p><strong>Installed component (NOT approved spare):</strong>
      {" "}{source.installedCandidateSku||"Model not established"}</p>
     <p><strong>Evidence:</strong> {source.engineeringVerification.evidence}</p>
     <p><strong>Technical gap:</strong> {source.engineeringVerification.issue}</p>
     <p><strong>Supplier action:</strong> {source.engineeringVerification.action}</p>
     <p><strong>Stock / Direct COST:</strong> NOT ESTABLISHED ·
      <strong> OEM spare SKU:</strong> NOT VERIFIED ·
      <strong> Price posting:</strong> NONE</p>
    </section>}
    <button type="button" className="p553-detail-button" onClick={()=>onOpenSource(source)}>
     Go to {source.sourceModuleId?.startsWith("bid.budget.bom")?"10.1 Engineering BOM":"10.2 Working BC"} ↗
    </button>
   </div>}
   <p className="p55-note">Original customer workbook: 6 Sheets, unchanged. Pre-export preview is a read-only JSX layout; it does not prove pixel-perfect native XLSX fidelity. Final native export requires signed line/cell mapping, full cost + TAG reconciliation, verified FX and buyer approval of any grouping.</p>
 </section>;
}