import React,{useEffect,useMemo,useRef,useState} from "react";
import {buildOfficialUsdRelease0553,OFFICIAL_SHEETS_0553,selectSubmittedRev02Release0553,selectCurrentReleaseRev03_0553} from "./data/officialUsdRelease0553";
import {allocateBreakdown0553,breakdownKey0553,buildCustomerPriceBreakdown0553,customerBreakdownRows0553} from "./data/customerPriceBreakdown0553";
import {selectWorkingBomProjection0553} from "./data/workingBomAggregation0553";
import {selectDeviationRegister0553} from "./data/deviationRegister0553";
import {B10KitPriceSummary0553} from "./B10KitPriceSummary0553";
import {OtherSpareOriginalAnnex0553} from "./OtherSpareOriginalAnnex0553";
import {SubmittedWorksheet0553} from "./ReleaseCustomerWorkbook0553";
import "./releaseWorkbook0553.css";
import {QuotationBaselineControl0553} from "./QuotationBaselineControl0553";
import {RecordedQuotation0553} from "./RecordedQuotation0553";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"To be quoted";
const unit=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"To be quoted";
const cents=n=>Math.round((n+Number.EPSILON)*100);

export function resolveOfficialTier0553(recipient){
 if(recipient==="INTERNAL")return "SI";
 if(recipient==="SAMTEL")return "VND";
 return "CUS";
}

/**
 * Derive read-only Part A (A1–A4 / 141 rows) breakdown allocated strictly
 * to the frozen Rev03 A1–A4 USD targets (never mutating Rev03 or exports).
 */
export function buildRev03PartABreakdown0553(source,rev03){
 if(!source?.a?.length||!rev03?.rows?.length)return null;
 const groups=source.a.map(parent=>{
  const targetRow=rev03.rows.find(r=>r.code===parent.code);
  const parentUSD=targetRow?.amountUSD??null;
  const projection=selectWorkingBomProjection0553({mr:parent.mr});
  const priced=new Map(parent.sourceRows.map(r=>[breakdownKey0553(r),r]));
  const amounts=Number.isFinite(parentUSD)&&parent.sourceRows.length?allocateBreakdown0553(parent.sourceRows,parentUSD):new Map();
  const rows=projection.lines.map(line=>{
   const key=breakdownKey0553(line),row=priced.get(key),item=line.item||{};
   const included=!!(item.priceInclusion||item.parentPackage);
   const qty=row?.qty??item.sourceQty??item.qty??null;
   const amountUSD=amounts.get(key)??null;
   let unitUSD=Number.isFinite(amountUSD)&&Number.isFinite(qty)&&qty>0?Math.round(amountUSD/qty*1e8)/1e8:null;
   if(unitUSD!==null&&cents(unitUSD*qty)!==cents(amountUSD))unitUSD=null;
   return {key,code:parent.code,mr:parent.mr,site:line.site,id:String(line.id),
    tag:row?.tag||line.tag||"TBC",qty,unit:row?.unit||item.sourceUnit||item.unit||"TBC",
    description:row?.description||item.description||item.role||"Equipment detail to be confirmed",
    specification:row?.specification||item.sku||"To be confirmed",
    sourceModuleId:"bid.budget.bom.system-location-mto",sourceRef:line.source,
    sourceStatus:item.status||"REVIEW",parentPackage:item.parentPackage||null,
    customerSellTHB:row?.customerSellTHB??null,amountUSD,unitUSD,
    status:included?"INCLUDED":amountUSD!==null?"PRICED":"NOT PRICED",
    quantityPending:amountUSD!==null&&(unitUSD===null||!row?.unit)};
  });
  const customerRows=customerBreakdownRows0553({code:parent.code,rows});
  const rawUSD=Number.isFinite(parent.previewSellTHB)?Math.round((parent.previewSellTHB/31.5)*100)/100:null;
  const driftUSD=rawUSD!==null&&Number.isFinite(parentUSD)?Math.round((rawUSD-parentUSD)*100)/100:null;
  const driftPct=driftUSD!==null&&Number.isFinite(parentUSD)&&parentUSD!==0?Math.round((driftUSD/parentUSD)*10000)/100:null;
  const hasDrift=driftPct!==null&&Math.abs(driftPct)>0.5;
  const totalUSD=rows.some(r=>r.amountUSD!==null)?rows.reduce((s,r)=>s+cents(r.amountUSD??0),0)/100:null;
  const varianceUSD=totalUSD!==null&&Number.isFinite(parentUSD)?(cents(totalUSD)-cents(parentUSD))/100:null;
  const matched=varianceUSD!==null&&Math.abs(varianceUSD)<=0.01;
  return {code:parent.code,mr:parent.mr,description:parent.description,rows,customerRows,parentUSD,rawUSD,driftUSD,driftPct,hasDrift,totalUSD,varianceUSD,matched};
 });
 return {groups,reconciled:groups.every(g=>g.matched),anyDrift:groups.some(g=>g.hasDrift)};
}

export function OfficialUsdRelease0553({source,recipient="INTERNAL",onOpenSource=null}){
 const tier=resolveOfficialTier0553(recipient);
 const isSI=tier==="SI";
 const [releaseVersion,setReleaseVersion]=useState("CURRENT_REV03");
 const [submittedSheet,setSubmittedSheet]=useState("Scope of supply");
 const [expandedGroups,setExpandedGroups]=useState({});
 const [showSubPrices,setShowSubPrices]=useState(false);
 const [traceItem,setTraceItem]=useState(null);
 const current=selectCurrentReleaseRev03_0553();
 const historical=releaseVersion==="SUBMITTED_REV02";
 const submitted=historical?selectSubmittedRev02Release0553():current;
 const officialWorksheets=submitted.worksheets.filter(s=>!/^A[1-4] MR000[1-4]$/.test(s.name));
 const archivedSheet=officialWorksheets.find(s=>s.name===submittedSheet)||officialWorksheets[0];
 const model=useMemo(()=>releaseVersion==="WORKING_DRAFT"?buildOfficialUsdRelease0553(source):null,[source,releaseVersion]);
 const rev03Breakdown=useMemo(()=>releaseVersion==="CURRENT_REV03"?buildRev03PartABreakdown0553(source,current):null,[source,current,releaseVersion]);
 const draftBreakdown=useMemo(()=>releaseVersion==="WORKING_DRAFT"&&model?buildCustomerPriceBreakdown0553(source,model):null,[source,model,releaseVersion]);
 const activeBreakdown=releaseVersion==="CURRENT_REV03"?rev03Breakdown:draftBreakdown;
 const toggleGroup=code=>setExpandedGroups(prev=>({...prev,[code]:!prev[code]}));
 const [sheet,setSheet]=useState("SUMMARY"),[error,setError]=useState("");
 const [recordedQuotation,setRecordedQuotation]=useState(null);
 const baselineControl=useRef(null);
 const SelectedSheet="div";
 const selectedSheetRef=useRef(null);
 useEffect(()=>{
  let restore=null;
  const before=()=>{const el=selectedSheetRef.current;if(el?.tagName==="DETAILS"){restore={el,open:el.open};el.open=true;}};
  const after=()=>{if(restore){restore.el.open=restore.open;restore=null;}};
  window.addEventListener("beforeprint",before);window.addEventListener("afterprint",after);
  return ()=>{after();window.removeEventListener("beforeprint",before);window.removeEventListener("afterprint",after);};
 },[]);
 const captureBeforeDownload=()=>{
  if(!isSI){setError("Export requires AVS / SI view.");return;}
  // Freeze + back up before exporting. The register then offers the captured
  // scope/breakdown files; no new file is built from changing Working here.
  if(baselineControl.current){setError("");return baselineControl.current.capture();}
  setError("ทะเบียนกำลังโหลด กรุณาลองบันทึกฉบับอีกครั้ง");
 };
 const summaryRow=r=>{
  const isOption=r.code==="C1"||r.code==="C2";
  const ref=isOption?model.otherSpareItemizedAnnex?.summaries?.[r.code]:null;
  if(isOption&&(!Number.isFinite(ref?.totalUSD)||ref.selectedWorking!==false||
      Number.isFinite(r.amountUSD)||ref.budgetaryOfferPrepared!==true||
      ref.conditionalPriceStatus!=="CONDITIONAL_BUDGETARY_OFFER"||
      r.budgetaryOptionQuoteUSD!==ref.totalUSD||r.budgetaryOfferPrepared!==true||
      r.firmOemQuote!==false||r.optionExcludedFromBase!==true))
   throw Error("0553 Official Part C conditional priced quote must match selected 10.3 source");
  const displayed=isOption?r.budgetaryOptionQuoteUSD:r.amountUSD;
  return <tr key={r.code} data-quote-code={r.code}
    data-option-price-status={isOption?"CONDITIONAL_BUDGETARY_OFFER":undefined}>
   <td>{r.code}</td><td colSpan={3}>{r.description}
    {r.serviceText&&<div className="p553-official-service">{r.serviceText}</div>}</td>
   <td>1 lot{isOption&&<small>Optional</small>}</td>
   <td className="p553-price-cell">{r.priceText&&displayed===null?r.priceText:money(displayed)}
    {isOption&&<small>USD</small>}</td>
   <td className="p553-price-cell">{r.priceText&&displayed===null?r.priceText:money(displayed)}
    {isOption&&<small>USD</small>}</td>
   <td>{r.commercialRemark|| (model.annex[r.code]?"Refer to Annex "+r.code:"")}
    {isOption&&<small>Optional spares; excluded from Total A+B.</small>}</td>
  </tr>;
 };
 const renderPartABreakdown=()=>{
  if(!isSI||!activeBreakdown)return null;
  if(!activeBreakdown.reconciled){
   return <div className="p553-native-warning" role="alert" data-official-breakdown-mismatch="true">
    <strong>MISMATCH — Part A BOM breakdown does not reconcile to {releaseVersion==="CURRENT_REV03"?"Rev03":"Working"} A1–A4 totals (tolerance 0.01 USD).</strong>
    <ul>{activeBreakdown.groups.filter(g=>!g.matched).map(g=><li key={g.code}>{g.code} ({g.mr}): Parent USD {money(g.parentUSD)} vs Sum USD {money(g.totalUSD)} (diff {money(g.varianceUSD)})</li>)}</ul>
   </div>;
  }
  const heading=isSI?"Part A · Internal BOM Breakdown (141 rows · Read-only overlay)":
   tier==="VND"?"Part A · Vendor Scope Schedule (Qty / Unit only — per-TAG prices hidden)":
   "Part A · Equipment Schedule (Qty / Unit only — per-TAG prices hidden)";
  return <section className="p55-panel p553-official-bom-overlay" data-component-key="bid.budget.pricing.official.part-a-breakdown" data-viewer-tier={tier}>
   <h4>{heading}</h4>
   {isSI&&activeBreakdown.anyDrift&&<div className="p553-native-warning" role="status" data-official-breakdown-drift="true">
    <strong>DRIFT NOTICE (&gt;0.5%):</strong> Live 10.1 raw totals differ from frozen Rev03 A1–A4 targets; rows remain allocated to Rev03 targets without altering Rev03.
   </div>}
   {isSI&&<div className="p553-filterbar p553-filterbar--simple" role="group" aria-label="Part A breakdown controls">
    <button type="button" className="p553-detail-button" aria-pressed={!showSubPrices} onClick={()=>setShowSubPrices(false)}>ซ่อนราคาย่อย</button>
    <button type="button" className="p553-detail-button" aria-pressed={showSubPrices} onClick={()=>setShowSubPrices(true)}>แสดงราคาย่อย</button>
    <button type="button" className="p553-detail-button" onClick={()=>setExpandedGroups(Object.fromEntries(activeBreakdown.groups.map(g=>[g.code,true])))}>Expand all A1–A4</button>
    <button type="button" className="p553-detail-button" onClick={()=>{setExpandedGroups({});setTraceItem(null);}}>Collapse all</button>
   </div>}
   <div className="p553-sheet-scroll"><table className="p553-customer-table">
    <thead><tr><th>+/−</th><th>Code</th><th>MR</th><th>Rows</th><th>Parent Total (USD)</th><th>Status</th></tr></thead>
    <tbody>{activeBreakdown.groups.map(g=>{
     const open=!!expandedGroups[g.code];
     const displayRows=isSI?g.rows:(g.customerRows||customerBreakdownRows0553(g));
     const driftLabel=Number.isFinite(g.rawUSD)&&Number.isFinite(g.driftPct)?`${g.code} raw ${money(g.rawUSD)} → Rev03 ${money(g.parentUSD)} (${g.driftPct>=0?"+":""}${g.driftPct.toFixed(2)}%)`:"RECONCILED (SI)";
     return <React.Fragment key={g.code}>
      <tr data-official-bom-group={g.code}>
       <td><button type="button" className="p55-row-toggle" aria-expanded={open} aria-label={(open?"Collapse ":"Expand ")+g.code} onClick={()=>toggleGroup(g.code)}>{open?"−":"+"}</button></td>
       <td><strong>{g.code}</strong></td><td>{g.mr}</td><td>{displayRows.length}</td>
       <td className="p553-price-cell">{money(g.parentUSD)}</td>
       <td>{isSI?<>RECONCILED (SI)<small>{driftLabel}</small></>:"Scope schedule"}</td>
      </tr>
      {open&&<tr className="p553-drilldown-only" data-official-bom-detail={g.code}><td colSpan={6}>
       <div className="p553-drilldown-table-wrap"><table className="p553-drilldown-table">
        <thead><tr>
         <th>Item</th><th>Location</th><th>TAG</th><th>Description</th><th>Qty / Unit</th>
         {isSI&&showSubPrices&&<><th>Unit USD</th><th>Amount USD</th><th>Working Sell THB</th></>}
         {isSI&&<th>Source / Trace</th>}
        </tr></thead>
        <tbody>{displayRows.map((r,idx)=>{
         const raw=g.rows[idx];
         return <tr key={raw?.key||idx}>
          <td>{isSI?g.code+"."+(idx+1):r.item}</td>
          <td>{r.site||"—"}</td>
          <td>{r.tag||"TBC"}</td>
          <td>{r.description}</td>
          <td>{r.qty??"TBC"} {r.unit||""}</td>
          {isSI&&showSubPrices&&<>
           <td className="p553-price-cell">{raw?.unitUSD==null?"—":raw.unitUSD.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:6})}</td>
           <td className="p553-price-cell">{money(raw?.amountUSD)}</td>
           <td className="p553-price-cell">{money(raw?.customerSellTHB)}</td>
          </>}
          {isSI&&<td>
           <button type="button" className="p553-origin-trace" onClick={()=>setTraceItem(raw)}>Trace</button>
           {onOpenSource&&<button type="button" className="p553-detail-button" onClick={()=>onOpenSource({...raw,breakdownKey:raw.key,breakdownOrigin:"official"})}>↗ Source</button>}
          </td>}
         </tr>;
        })}</tbody>
       </table></div>
      </td></tr>}
     </React.Fragment>;
    })}</tbody>
   </table></div>
   {isSI&&traceItem&&<div className="p553-source-drawer" role="region" aria-label="Official source trace">
    <div className="p553-source-head"><strong>Source Trace · {traceItem.code} / {traceItem.mr}</strong>
     <button type="button" onClick={()=>setTraceItem(null)}>× Close</button></div>
    <p><strong>Module:</strong> <code>{traceItem.sourceModuleId}</code></p>
    <p><strong>Trace:</strong> {traceItem.site} · {traceItem.tag} · {traceItem.sourceRef||"Document reference pending"}</p>
    <p><strong>Working Sell THB:</strong> {money(traceItem.customerSellTHB)} · <strong>Allocated USD:</strong> {money(traceItem.amountUSD)}</p>
   </div>}
  </section>;
 };
 return <section className="p55-panel p553-release-workbook p553-official-usd" data-component-key="bid.budget.pricing.official" data-viewer-tier={tier}>
  <div className="p553-official-toolbar"><h3>10.3.4 · Official Release — English / USD</h3>
   {isSI&&releaseVersion==="WORKING_DRAFT"&&<><button type="button" className="p553-detail-button" onClick={captureBeforeDownload}>บันทึกฉบับก่อน Export Excel — English / USD</button>
   <button type="button" className="p553-detail-button" onClick={captureBeforeDownload}>บันทึกฉบับก่อน Export Breakdown — Draft / 10 sheets</button></>}
   <button type="button" className="p553-detail-button" aria-pressed={releaseVersion==="CURRENT_REV03"} onClick={()=>setReleaseVersion("CURRENT_REV03")}>Current Rev03 · Agreed quotation</button>
   <button type="button" className="p553-detail-button" aria-pressed={historical} onClick={()=>setReleaseVersion("SUBMITTED_REV02")}>History Rev02 · 30 Oct 2026</button>
   {isSI&&<button type="button" className="p553-detail-button" aria-pressed={releaseVersion==="WORKING_DRAFT"} onClick={()=>setReleaseVersion("WORKING_DRAFT")}>Working draft · not issued</button>}</div>
  {isSI&&<p className="p55-note" data-jutal-register-summary="true"><strong>JUTAL {selectDeviationRegister0553().responseRound}:</strong> {selectDeviationRegister0553().counts.deviations} Formal Deviation · {selectDeviationRegister0553().counts.technicalClarifications} TC · {selectDeviationRegister0553().counts.commercialClarifications} CCL (tracked in Tab 14 / 15; Rev03 totals unchanged).</p>}
  {isSI&&<QuotationBaselineControl0553 controllerRef={baselineControl} mode={releaseVersion} reference={submitted} source={source} onSelectRecord={record=>{setError("");setRecordedQuotation(record);setReleaseVersion("RECORDED");}}/>}
  {error&&<p role="alert">{error}</p>}
  {releaseVersion==="RECORDED"&&recordedQuotation?<RecordedQuotation0553 key={recordedQuotation.id} record={recordedQuotation}/>:releaseVersion!=="WORKING_DRAFT"?<div data-release-revision={submitted.revision} data-release-state={historical?"HISTORICAL_SUBMITTED_REV02":"OWNER_SELECTED_REV03"}>
   <p><strong>{submitted.filename} · {historical?"History — submitted to SAMTEL 30 October 2026":"Current owner-selected quotation"}</strong><br/>Total A+B: <strong>USD {money(submitted.totalBaseUSD)}</strong>.</p>
   <p>{historical?"Historical reference only; this is not the current selected quotation.":"Exact Scope of supply and B10/B11/B13/C1/C2 from the owner-selected Rev03 source workbook. C1/C2 are optional and excluded from Total A+B."}</p>
   {isSI&&<p><a className="p553-detail-button" href={submitted.originalWorkbookPath} download={submitted.filename} onClick={e=>{e.preventDefault();captureBeforeDownload();}}>{historical?"บันทึกฉบับก่อนดาวน์โหลด Rev02":"บันทึกฉบับก่อนดาวน์โหลด Rev03"}</a>{" · "}<a href={submitted.sourceUrl} target="_blank" rel="noopener noreferrer">Open source workbook</a></p>}
   <div className="p553-release-tabs" role="tablist" aria-label={historical?"Historical Rev02 worksheets":"Current Rev03 worksheets"}>{officialWorksheets.map(s=><button key={s.name} type="button" role="tab" aria-selected={s.name===submittedSheet} onClick={()=>setSubmittedSheet(s.name)}>{s.name}</button>)}</div>
   <SubmittedWorksheet0553 sheet={archivedSheet}/>
   {!historical&&submittedSheet==="Scope of supply"&&renderPartABreakdown()}
  </div>:<>
  <p className="p55-note">Working calculation for internal review. The current agreed quotation is Rev03; historical Rev02 remains separate.</p>
  <div className="p553-release-tabs" role="tablist" aria-label="Quotation worksheets">{OFFICIAL_SHEETS_0553.map(([name,code])=><button type="button" key={code} role="tab" aria-selected={sheet===code} className={sheet===code?"is-active":""} onClick={()=>setSheet(code)}>{name}</button>)}</div>

  <SelectedSheet ref={selectedSheetRef} className={sheet==="C1"?"p55-panel p553-c1-selected-source":"p553-selected-sheet"}>

  <div className="p553-native-sheet">
   <div className="p553-native-title">{sheet==="SUMMARY"?"Scope of Supply":model.annexTitles[sheet]}</div>
   <div className="p553-sheet-meta"><strong>Project</strong><span>{model.project}</span><strong>Currency</strong><span>USD</span></div>
   <div className="p553-sheet-scroll">{sheet==="SUMMARY"?<table className="p553-customer-table">
    <thead><tr>{["Item","Tag No.","Description","Main Specification","Qty","Unit Price (USD)","Amount (USD)","Remarks"].map(h=><th key={h}>{h}</th>)}</tr></thead>
    <tbody><tr className="p553-sheet-section"><td colSpan={8}>Part A: Equipment</td></tr>
     {model.a.map(r=><tr key={r.code} data-quote-code={r.code}><td>{r.code}</td><td>{r.mr}</td><td>{r.description}</td><td>{r.locations}</td><td>1 lot</td><td className="p553-price-cell">{money(r.amountUSD)}</td><td className="p553-price-cell">{money(r.amountUSD)}</td><td/></tr>)}
     <tr className="p553-sheet-section"><td colSpan={8}>Part B: Services and Other Supplies</td></tr>
     {model.b.map(summaryRow)}
     <tr className="p553-sheet-total"><td colSpan={6}>Total A+B (USD){model.excluded.length>0&&<small>Not quoted / excluded: {model.excluded.join(", ")}.</small>}{model.unpriced.length>0&&<small>Excludes items to be quoted: {model.unpriced.join(", ")}.</small>}</td><td className="p553-price-cell">{money(model.totalUSD)}</td><td/></tr>
     <tr className="p553-sheet-section"><td colSpan={8}>Part C: Options — excluded from Total A+B</td></tr>{model.c.map(summaryRow)}
    </tbody>
   </table>:sheet==="B10"?<B10KitPriceSummary0553 rows={model.annex.B10}
     currency="USD" total={model.b.find(r=>r.code==="B10")?.amountUSD} variant="official"
      onOpenSource={onOpenSource}/>:["B11","B13","C1","C2"].includes(sheet)?
     <OtherSpareOriginalAnnex0553 code={sheet} model={model.otherSpareItemizedAnnex}
       onOpenSource={onOpenSource}/>:<table className="p553-customer-table p553-official-annex">
    <thead><tr>{["Item","Tag No.","Description","Specification","Materials","Qty","Unit Price (USD)","Amount (USD)"].map(h=><th key={h}>{h}</th>)}</tr></thead>
    <tbody>{model.annex[sheet].map((r,i)=><tr key={r.sourceId}><td>{i+1}</td><td>{r.tagNo}</td><td>{r.description}</td><td>{r.specification}</td><td>{r.materials}</td><td>{r.qty??"TBC"}</td><td className="p553-price-cell">{unit(r.unitUSD)}</td><td className="p553-price-cell">{money(r.totalUSD)}</td></tr>)}
     <tr className="p553-sheet-total"><td colSpan={7}>Total (USD)</td><td className="p553-price-cell">{money([...model.b,...model.c].find(r=>r.code===sheet)?.amountUSD)}</td></tr></tbody>
   </table>}</div>
  </div>
  </SelectedSheet>
  {sheet==="SUMMARY"&&renderPartABreakdown()}
 </>}
 </section>;
}

