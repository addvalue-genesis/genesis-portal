import React,{useEffect,useMemo,useRef,useState} from "react";
import {buildOfficialUsdRelease0553,OFFICIAL_SHEETS_0553,selectSubmittedRev02Release0553,MTO_C1_RELEASE_CONFIRMATION_0553} from "./data/officialUsdRelease0553";
import {buildNativeOfficialRelease0553} from "./nativeWorkingDraft0553";
import template from "./data/nativeReleaseTemplate0553.json";
import {B10KitPriceSummary0553} from "./B10KitPriceSummary0553";
import {OtherSpareOriginalAnnex0553} from "./OtherSpareOriginalAnnex0553";
import {SubmittedWorksheet0553} from "./ReleaseCustomerWorkbook0553";
import {buildCustomerPriceBreakdown0553} from "./data/customerPriceBreakdown0553";
import {buildNativePriceBreakdown0553} from "./nativePriceBreakdown0553";
import "./releaseWorkbook0553.css";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"To be quoted";
const unit=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"To be quoted";
export function OfficialUsdRelease0553({source,onOpenSource=null}){
 const [releaseVersion,setReleaseVersion]=useState("SUBMITTED_REV02");
 const [submittedSheet,setSubmittedSheet]=useState("Scope of supply");
 const submitted=selectSubmittedRev02Release0553();
 const officialWorksheets=submitted.worksheets.filter(s=>!/^A[1-4] MR000[1-4]$/.test(s.name));
 const archivedSheet=officialWorksheets.find(s=>s.name===submittedSheet)||officialWorksheets[0];
 const model=useMemo(()=>releaseVersion==="WORKING_DRAFT"?buildOfficialUsdRelease0553(source):null,[source,releaseVersion]);
 const [sheet,setSheet]=useState("SUMMARY"),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const SelectedSheet="div";
 const selectedSheetRef=useRef(null);
 useEffect(()=>{
  let restore=null;
  const before=()=>{const el=selectedSheetRef.current;if(el?.tagName==="DETAILS"){restore={el,open:el.open};el.open=true;}};
  const after=()=>{if(restore){restore.el.open=restore.open;restore=null;}};
  window.addEventListener("beforeprint",before);window.addEventListener("afterprint",after);
  return ()=>{after();window.removeEventListener("beforeprint",before);window.removeEventListener("afterprint",after);};
 },[]);
 const download=async(breakdown=false)=>{
  if(!model)return;
  setBusy(true);setError("");
  try{
   const bytes=Uint8Array.from(atob(template.base64),c=>c.charCodeAt(0));
   const file=new File([bytes],template.sourceName,{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
   const result=breakdown?await buildNativePriceBreakdown0553(file,model,buildCustomerPriceBreakdown0553(source,model)):
    await buildNativeOfficialRelease0553(file,model);
   const url=URL.createObjectURL(result.blob),link=document.createElement("a");
   link.href=url;link.download=result.filename;document.body.appendChild(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),15000);
  }catch(e){setError(e.message||String(e));}finally{setBusy(false);}
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
 return <section className="p55-panel p553-release-workbook p553-official-usd" data-component-key="bid.budget.pricing.official">
  <div className="p553-official-toolbar"><h3>10.3.4 · Official Release — English / USD</h3>
   {releaseVersion==="WORKING_DRAFT"&&<><button type="button" className="p553-detail-button" disabled={busy} onClick={()=>download()}>{busy?"Preparing Excel…":"Export Excel — English / USD"}</button>
   <button type="button" className="p553-detail-button" disabled={busy} onClick={()=>download(true)}>Export Breakdown — Draft / 10 sheets</button></>}
   <button type="button" className="p553-detail-button" aria-pressed={releaseVersion==="SUBMITTED_REV02"} onClick={()=>setReleaseVersion("SUBMITTED_REV02")}>Submitted Rev02 · 30 Oct 2026</button>
   <button type="button" className="p553-detail-button" aria-pressed={releaseVersion==="WORKING_DRAFT"} onClick={()=>setReleaseVersion("WORKING_DRAFT")}>Working draft · not issued</button></div>
  {releaseVersion==="SUBMITTED_REV02"?<div data-release-revision="Rev02" data-release-state="SUBMITTED_TO_SAMTEL">
   <p><strong>{submitted.filename} · Submitted to SAMTEL · 30 October 2026</strong><br/>Total A+B: <strong>USD {money(submitted.totalBaseUSD)}</strong>. These are the preserved submitted values.</p>
   <p>{MTO_C1_RELEASE_CONFIRMATION_0553.mto}: materials and associated costs marked “Supplied by Telecom Vendor” are included. Submitted price unchanged. Confirmation reply prepared; not sent.</p>
   <p><a className="p553-detail-button" href={submitted.originalWorkbookPath} download={submitted.filename}>Download original submitted Rev02</a>{" · "}<a href={submitted.sourceUrl} target="_blank" rel="noopener noreferrer">Open source workbook</a></p>
   <div className="p553-release-tabs" role="tablist" aria-label="Submitted Rev02 worksheets">{officialWorksheets.map(s=><button key={s.name} type="button" role="tab" aria-selected={s.name===submittedSheet} onClick={()=>setSubmittedSheet(s.name)}>{s.name}</button>)}</div>
   <SubmittedWorksheet0553 sheet={archivedSheet}/>
  </div>:<>
  <p className="p55-note">Working draft calculated from current inputs. It has not replaced submitted Rev02.</p>
  {error&&<p role="alert">Export failed: {error}</p>}
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
 </>}
 </section>;
}

