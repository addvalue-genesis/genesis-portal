import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {COMMERCIAL_TEMPLATE_0553 as template} from "./commercialWorkbookControl";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";
import {OFFICIAL_WORKBOOK_TEMPLATE_0553} from "./data/officialWorkbookTemplate0553";

// Workbook-driven navigation, not an editable BOM and not a released quote.
// The historical Rev08 amounts are source evidence ONLY; never promote them
// to the current customer offer or overwrite the original XLSX.
const sheetKey=name=>name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,"");
const summaryCellRow={A1:9,A2:10,A3:11,A4:12,A5:13,B1:24,B2:25,B3:26,B4:27,B5:28,B6:29,B7:30,B8:31,B9:32,B10:33,B11:34,B12:35,B13:36,B14:37,C1:41,C2:42};
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
export function BudgetaryWorkbookPreview0553(){
 const [sheet,setSheet]=useState(template.sheets[0].name);
 const [showHistorical,setShowHistorical]=useState(false);
 const [showEmptyRows,setShowEmptyRows]=useState(false);
 const [collapsed,setCollapsed]=useState({});
 const sectionForRow=(n)=>sheet==="Scope of supply"?(n>=7&&n<=22?"PART_A":n>=24&&n<=37?"PART_B":n>=41&&n<=42?"PART_C":null):(layout.sections.items.start<=n&&n<=layout.sections.items.end?"ITEMS":null);
 const labels=sheet==="Scope of supply"?{PART_A:"Part A — Basic Equipment",PART_B:"Part B — Services / Spares",PART_C:"Part C — Options"}:{ITEMS:"Detailed item schedule / รายการย่อย"};
 const toggleSection=(key)=>setCollapsed(v=>({...v,[sheet+":"+key]:!v[sheet+":"+key]}));
 const [currency,setCurrency]=useState("USD");
 const [fx,setFx]=useState({THB:"31.5",CNY:""});
 const [fxDate,setFxDate]=useState("2026-10-12");
 const [fxSource,setFxSource]=useState("MANAGEMENT WORKING BUDGET FX — NOT BOT VERIFIED");
 const rate=currency==="USD"?1:Number(fx[currency]);
 const fxReady=currency==="USD"||(fx[currency]!==""&&Number.isFinite(rate)&&rate>0&&fxDate.trim()&&fxSource.trim());
 const converted=n=>fxReady?money(n*rate):"—";
 const active=template.sheets.find(s=>s.name===sheet);
 const layout=OFFICIAL_WORKBOOK_TEMPLATE_0553.sheets.find(s=>s.name===sheet);
 const lines=active?.kind==="SUMMARY"?REV08_BASELINE.summary:
  REV08_BASELINE.detail[active?.code]||[];
 return <section className="p55-panel" data-component-key="bid.budget.summary.workbook">
   <div className="p55-eyebrow">BUDGETARY SUBMISSION · NATIVE SOURCE WORKBOOK STRUCTURE <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.summary.workbook"/></div>
   <h3>4-Scope of Supply.xlsx · 6 Worksheet Review</h3>
   <p className="p55-note"><strong>TEMPLATE GRID PREVIEW, NOT NEW CUSTOMER PRICE.</strong> Original workbook is the export template. This component renders the original worksheet dimensions and a source-transcribed subset of cell labels, preserving empty rows; full exact-cell fidelity is still pending. Template fidelity, current BOM selling-price mapping and native XLSX export are not implemented yet; release is blocked.</p>
   <div className="p55-filterbar">
    <label>Display currency <select value={currency} onChange={e=>setCurrency(e.target.value)}><option value="USD">USD — original Rev08</option><option value="THB">THB — Thai baht</option><option value="CNY">CNY — Chinese yuan (RMB)</option></select></label>
    {currency!=="USD"&&<label>1 USD = <input type="number" min="0" step="any" placeholder={"Verified "+currency+" per USD"} value={fx[currency]} onChange={e=>setFx(s=>({...s,[currency]:e.target.value}))}/> {currency}</label>}
    {currency!=="USD"&&<label>FX date <input type="date" value={fxDate} onChange={e=>setFxDate(e.target.value)}/></label>}
    {currency!=="USD"&&<label>FX source <input value={fxSource} onChange={e=>setFxSource(e.target.value)} placeholder="Source/reference"/></label>}
    <label>Original worksheet <select value={sheet} onChange={e=>setSheet(e.target.value)}>{template.sheets.map(s=><option key={s.name} value={s.name}>{s.name}</option>)}</select></label></div>
   <div className="p55-filterbar" role="group" aria-label="Workbook worksheets">
    {template.sheets.map(item=><button type="button" key={item.name}
      className={"p553-detail-button"+(sheet===item.name?" is-active":"")}
      aria-pressed={sheet===item.name} onClick={()=>setSheet(item.name)}
      style={{fontWeight:sheet===item.name?700:400,border:sheet===item.name?"2px solid #07729a":"1px solid #b7c7d5"}}>
      {item.name}</button>)}
   </div>
   <p className="p55-note"><strong>Currency: {currency}</strong> · {currency==="USD"?"Historical source values in original USD; no conversion.":fxReady?"Indicative converted display only, using user-entered "+rate+" "+currency+"/USD on "+fxDate+" · Source: "+fxSource+". Not a verified or approved customer rate.":"Conversion unavailable: enter rate, date and source. USD source amounts are retained unchanged; no implied FX."}</p>
   <label><input type="checkbox" checked={showHistorical} onChange={e=>setShowHistorical(e.target.checked)}/> Show historical Rev08 price comparison (not current bid)</label>
   <label><input type="checkbox" checked={showEmptyRows} onChange={e=>setShowEmptyRows(e.target.checked)}/> Show empty template rows (original Excel layout)</label>
   <p className="p55-note"><strong>Sheet-specific layout:</strong> {layout.leadTime?"Lead time (ARO) column · ":""}{layout.sourceNotQuote?"Original Not quote cells · ":""}{layout.sections?.remark?"Original remark row "+layout.sections.remark.start:"No remark row in source"}</p>
   <p className="p55-note"><strong>Original worksheet cell layout:</strong> {layout.columns} columns × {layout.maxRow} rows. Blank cells are preserved; historically labelled cells are reference only. Current BOM-derived customer selling prices are not approved and remain blank.</p>
   <div className="p55-panel">
    <strong>{sheet}</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.summary.workbook."+sheetKey(sheet)}/>
    <p className="p55-note">Price cells marked REV08 are historical comparison values only, displayed in the official-style grid for review. They are NOT approved customer selling prices and will NOT be exported as the current bid.</p>
   </div>
   <div className="p55-filterbar">
    <button type="button" className="p553-detail-button" onClick={()=>setCollapsed(old=>({...old,...Object.fromEntries((sheet==="Scope of supply"?["PART_A","PART_B","PART_C"]:["ITEMS"]).map(key=>[sheet+":"+key,false]))}))}>− Expand all details</button>
    <button type="button" className="p553-detail-button" onClick={()=>setCollapsed(old=>({...old,...Object.fromEntries((sheet==="Scope of supply"?["PART_A","PART_B","PART_C"]:["ITEMS"]).map(key=>[sheet+":"+key,true]))}))}>+ Collapse all details</button>
    <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.summary.workbook."+sheetKey(sheet)}/>
   </div>
   <p className="p55-note">กด + / − เพื่อยุบเฉพาะรายการย่อย (แถว 6–18) โดยหัวเอกสาร หัวตาราง Total และ Remark จะแสดงเสมอ; Excel ต้นฉบับไม่ถูกแก้ไข</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
    <thead><tr><th style={{width:45}}>Row</th>{Array.from({length:layout.columns},(_,i)=><th key={i}>{String.fromCharCode(65+i)}</th>)}<th style={{width:85}}>Copy ID</th></tr></thead>
    <tbody>{Array.from({length:layout.maxRow},(_,i)=>i+1).map(rowNum=>{
     const row=[...(layout.rows.find(r=>r[0]===rowNum)||[rowNum])];
     let overlay=false,refCode="";
     if(showHistorical&&active?.kind==="SUMMARY"){
      const match=REV08_BASELINE.summary.find(([code])=>summaryCellRow[code]===rowNum);
      if(match){
       const [code,desc,amount]=match;refCode=code;overlay=true;
       // Do not invent missing A-section row placements or overwrite original template formulas.
       if(!code.startsWith("A"))row[7]=converted(amount);
       else overlay=false;
      }
     }else if(showHistorical){
      const index=rowNum-6;
      const line=REV08_BASELINE.detail[active?.code]?.[index];
      if(index>=0&&line&&!layout.sourceNotQuote){
       const [desc,qty,unit]=line;refCode=active.code+"-"+(index+1);overlay=true;
       row[2]=index+1;row[4]=desc;row[7]=qty;row[8]=converted(unit);row[9]=converted(qty*unit);
      }
     }
     const visibleContent=row.slice(1).some(value=>value!==null&&value!==undefined&&String(value).trim()!=="");
     const section=sectionForRow(rowNum);
     const previous=sectionForRow(rowNum-1);
     const sectionStart=section&&section!==previous;
     const header=sectionStart?<tr key={"group:"+section} className="p55-group-heading"><td colSpan={layout.columns+2}>
      <button type="button" className="p55-row-toggle" aria-expanded={!collapsed[sheet+":"+section]} onClick={()=>toggleSection(section)}>{collapsed[sheet+":"+section]?"+":"−"}</button>
      <strong style={{marginLeft:8}}>{labels[section]}</strong>
      <span style={{marginLeft:12}}><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.summary.workbook."+sheetKey(sheet)+"."+section.toLowerCase()}/></span>
     </td></tr>:null;
     const hidden=section&&collapsed[sheet+":"+section];
     if(hidden||(!showEmptyRows&&!visibleContent))return header;
     return <React.Fragment key={rowNum}>{header}<tr style={overlay?{background:"rgba(36,111,184,0.07)"}:{}}>
      <td><strong>{rowNum}</strong></td>
      {Array.from({length:layout.columns},(_,col)=>{
       const value=row[col+1]??"";
       const isPrice=overlay&&(active?.kind==="SUMMARY"?col===6:(col===7||col===8));
       return <td key={col} style={{whiteSpace:"pre-wrap",minWidth:col===0?65:95}}>
        {value}{isPrice&&<small style={{display:"block"}}>REV08 · historical {fxReady?currency:"FX MISSING"} · {refCode}</small>}
       </td>;
      })}
      <td>{(overlay||row.slice(1).some(v=>typeof v==="string"&&v.trim()))&&<ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.summary.workbook."+sheetKey(sheet)+".row-"+rowNum}/>}</td>
     </tr></React.Fragment>;
    })}</tbody>
   </table></div>
   <p className="p55-note">Historical overlay is OFF by default. Unmapped A1–A5 prices are withheld rather than placed into incorrect worksheet rows. C2 original Not quote entries are preserved. Current approved selling price remains unavailable.</p>
   <p className="p55-note">The native XLSX retains all rows and columns. The JSX keeps worksheet header, totals and remarks visible while item rows can collapse. It hides completely empty rows by default; enable Show empty template rows for a structural audit. Source-transcribed text is a working preview; native merged-cell positioning, styling and exact original formulas are governed by the XLSX master and are not claimed identical yet.</p>
   <p className="p55-note">Worksheets: {template.sheets.map(s=>s.name).join(" · ")}. Original currency USD; converted view requires explicit FX. Export: HOLD until verified mapping of canonical BOM → customer lines, complete native-cell presentation, source template preservation, revision/approval gates and cross-sheet reconciliation.</p>
 </section>;
}
