import React,{useMemo,useState} from "react";
import {buildOfficialUsdRelease0553,OFFICIAL_SHEETS_0553} from "./data/officialUsdRelease0553";
import {buildNativeOfficialRelease0553} from "./nativeWorkingDraft0553";
import template from "./data/nativeReleaseTemplate0553.json";
import {B10KitPriceSummary0553} from "./B10KitPriceSummary0553";
import "./releaseWorkbook0553.css";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"To be quoted";
const unit=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"To be quoted";
export function OfficialUsdRelease0553({source}){
 const model=useMemo(()=>buildOfficialUsdRelease0553(source),[source]);
 const [sheet,setSheet]=useState("SUMMARY"),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const download=async()=>{
  setBusy(true);setError("");
  try{
   const bytes=Uint8Array.from(atob(template.base64),c=>c.charCodeAt(0));
   const file=new File([bytes],template.sourceName,{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
   const result=await buildNativeOfficialRelease0553(file,model);
   const url=URL.createObjectURL(result.blob),link=document.createElement("a");
   link.href=url;link.download=result.filename;document.body.appendChild(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),15000);
  }catch(e){setError(e.message||String(e));}finally{setBusy(false);}
 };
 const summaryRow=r=><tr key={r.code} data-quote-code={r.code}>
  <td>{r.code}</td><td colSpan={3}>{r.description}{r.serviceText&&<div className="p553-official-service">{r.serviceText}</div>}</td>
  <td>1 lot</td><td className="p553-price-cell">{money(r.amountUSD)}</td><td className="p553-price-cell">{money(r.amountUSD)}</td>
  <td>{model.annex[r.code]?"Refer to Annex "+r.code:""}</td>
 </tr>;
 return <section className="p55-panel p553-release-workbook p553-official-usd" data-component-key="bid.budget.pricing.official">
  <div className="p553-official-toolbar"><h3>10.3.4 · Official Release — English / USD</h3>
   <button type="button" className="p553-detail-button" disabled={busy} onClick={download}>{busy?"Preparing Excel…":"Export Excel — English / USD"}</button></div>
  {error&&<p role="alert">Export failed: {error}</p>}
  <div className="p553-release-tabs" role="tablist" aria-label="Quotation worksheets">{OFFICIAL_SHEETS_0553.map(([name,code])=><button type="button" key={code} role="tab" aria-selected={sheet===code} className={sheet===code?"is-active":""} onClick={()=>setSheet(code)}>{name}</button>)}</div>
  <div className="p553-native-sheet">
   <div className="p553-native-title">{sheet==="SUMMARY"?"Scope of Supply":model.annexTitles[sheet]}</div>
   <div className="p553-sheet-meta"><strong>Project</strong><span>{model.project}</span><strong>Currency</strong><span>USD</span></div>
   <div className="p553-sheet-scroll">{sheet==="SUMMARY"?<table className="p553-customer-table">
    <thead><tr>{["Item","Tag No.","Description","Main Specification","Qty","Unit Price (USD)","Amount (USD)","Remarks"].map(h=><th key={h}>{h}</th>)}</tr></thead>
    <tbody><tr className="p553-sheet-section"><td colSpan={8}>Part A: Equipment</td></tr>
     {model.a.map(r=><tr key={r.code} data-quote-code={r.code}><td>{r.code}</td><td>{r.mr}</td><td>{r.description}</td><td>{r.locations}</td><td>1 lot</td><td className="p553-price-cell">{money(r.amountUSD)}</td><td className="p553-price-cell">{money(r.amountUSD)}</td><td/></tr>)}
     <tr className="p553-sheet-section"><td colSpan={8}>Part B: Services and Other Supplies</td></tr>
     {model.b.map(summaryRow)}
     <tr className="p553-sheet-total"><td colSpan={6}>Total A+B (USD){model.unpriced.length>0&&<small>Excludes items to be quoted: {model.unpriced.join(", ")}.</small>}</td><td className="p553-price-cell">{money(model.totalUSD)}</td><td/></tr>
     <tr className="p553-sheet-section"><td colSpan={8}>Part C: Options — excluded from Total A+B</td></tr>{model.c.map(summaryRow)}
    </tbody>
   </table>:sheet==="B10"?<B10KitPriceSummary0553 rows={model.annex.B10}
     currency="USD" total={model.b.find(r=>r.code==="B10")?.amountUSD} variant="official"/>:<table className="p553-customer-table p553-official-annex">
    <thead><tr>{["Item","Tag No.","Description","Specification","Materials","Qty","Unit Price (USD)","Amount (USD)"].map(h=><th key={h}>{h}</th>)}</tr></thead>
    <tbody>{model.annex[sheet].map((r,i)=><tr key={r.sourceId}><td>{i+1}</td><td>{r.tagNo}</td><td>{r.description}</td><td>{r.specification}</td><td>{r.materials}</td><td>{r.qty??"TBC"}</td><td className="p553-price-cell">{unit(r.unitUSD)}</td><td className="p553-price-cell">{money(r.totalUSD)}</td></tr>)}
     <tr className="p553-sheet-total"><td colSpan={7}>Total (USD)</td><td className="p553-price-cell">{money([...model.b,...model.c].find(r=>r.code===sheet)?.amountUSD)}</td></tr></tbody>
   </table>}</div>
  </div>
 </section>;
}
