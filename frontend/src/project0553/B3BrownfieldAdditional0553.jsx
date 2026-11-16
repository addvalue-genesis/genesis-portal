import React,{useMemo,useState} from "react";
import {b3BrownfieldDocumentNumber0553,b3BrownfieldExportFileName0553,buildB3BrownfieldAdditionalCsv0553,formatB3BrownfieldMoney0553,selectB3BrownfieldAdditional0553,selectB3BrownfieldOfficialSchedule0553} from "./data/b3BrownfieldAdditional0553";
import "./releaseWorkbook0553.css";

function downloadCsv(model,view){
 const csv=buildB3BrownfieldAdditionalCsv0553(model,view);
 const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
 const url=URL.createObjectURL(blob);
 const link=document.createElement("a");
 link.href=url;
 link.download=b3BrownfieldExportFileName0553({audience:view.version==="official"?"official":"internal",extension:"csv"});
 link.click();
 URL.revokeObjectURL(url);
}

export function B3BrownfieldAdditional0553({initialPriced=true,initialItemized=true,initialVersion="internal",initialCurrency="thb"}={}){
 const model=useMemo(()=>selectB3BrownfieldAdditional0553(),[]);
 const [doc,setDoc]=useState(false);
 const [itemized,setItemized]=useState(initialItemized);
 const [priced,setPriced]=useState(initialPriced);
 const [version,setVersion]=useState(initialVersion);
 const [currency,setCurrency]=useState(initialCurrency);
 const official=version==="official";
 const money=(thbValue,usdValue)=>priced?formatB3BrownfieldMoney0553(model,thbValue,usdValue,currency):"";
 const [open,setOpen]=useState({bf:true,bom:true,site:true,a1:true,a1bom:true,ref:false});
 const shown=key=>doc||!!open[key];
 const toggle=key=>{if(!doc)setOpen(current=>({...current,[key]:!current[key]}));};
 const cols=priced?7:5;
 const bomCols=priced&&itemized?8:6;
 const docName=b3BrownfieldExportFileName0553({audience:official?"official":"internal"});
 const viewLabel=`${official?"OFFICIAL":"INTERNAL"} · ${priced?"PRICED":"UNPRICED"} · ${itemized?"ITEMIZED":"LUMP SUM"}${priced?" · "+currency.toUpperCase():""}`;
 const gap=official?"TBA":"OPEN";
 return <section className="p55-panel b3bf" data-testid="b3bf-root" data-version={version} data-currency={priced?currency:"unpriced"}>
  <style>{CSS}</style>
  <div className="b3bf-head"><span>PJ2608-0553 / Additional Proposal / B3-BF</span><span>{viewLabel}</span></div>
  <h2>{model.title}</h2>
  <p className="b3bf-doctitle" data-testid="b3bf-doc-title">{docName}</p>
  {!official&&<p className="b3bf-context">{model.context} This tab reads the current B3 rates and the MR0001 MTO. It does not change the original Scope of Supply or the base B3 amount.</p>}
  <div className="b3bf-controls" role="toolbar" aria-label="Brownfield additional proposal view">
   <button type="button" aria-pressed={!doc} onClick={()=>setDoc(false)}>Interactive View (+/−)</button>
   <button type="button" aria-pressed={doc} onClick={()=>setDoc(true)}>Expand All Document Mode</button>
   <span className="b3bf-sep">|</span>
   <button type="button" data-testid="b3bf-lumpsum" aria-pressed={!itemized} onClick={()=>setItemized(false)}>Lump Sum Lot Mode</button>
   <button type="button" data-testid="b3bf-itemized" aria-pressed={itemized} onClick={()=>setItemized(true)}>Itemized Pricing Mode</button>
   <span className="b3bf-sep">|</span>
   <button type="button" data-testid="b3bf-priced" aria-pressed={priced} onClick={()=>setPriced(true)}>With Prices</button>
   <button type="button" data-testid="b3bf-unpriced" aria-pressed={!priced} onClick={()=>setPriced(false)}>Without Prices</button>
   <span className="b3bf-sep">|</span>
   <button type="button" data-testid="b3bf-internal" aria-pressed={!official} onClick={()=>setVersion("internal")}>Internal</button>
   <button type="button" data-testid="b3bf-official" aria-pressed={official} onClick={()=>setVersion("official")}>Official</button>
   <span className="b3bf-sep">|</span>
   <button type="button" data-testid="b3bf-thb" aria-pressed={currency==="thb"} onClick={()=>setCurrency("thb")} disabled={!priced}>THB</button>
   <button type="button" data-testid="b3bf-usd" aria-pressed={currency==="usd"} onClick={()=>setCurrency("usd")} disabled={!priced}>USD</button>
   <button type="button" data-testid="b3bf-both" aria-pressed={currency==="both"} onClick={()=>setCurrency("both")} disabled={!priced}>Both</button>
   <span className="b3bf-sep">|</span>
   <button type="button" onClick={()=>downloadCsv(model,{priced,itemized,version,currency})}>Export CSV</button>
   <button type="button" onClick={()=>window.print()}>Print</button>
  </div>
  <div className="b3bf-doc">
   {official&&<OfficialCustomerSheet model={model} priced={priced} itemized={itemized} currency={currency}/>}
   {!official&&<><p className="b3bf-stand">ADDITIONAL PROPOSAL — B3 BROWNFIELD INSPECTION, TESTING &amp; CERTIFICATION<br/><small>Standalone. The original quotation / Scope of Supply is not modified.</small></p>
   <div className="b3bf-scroll"><table className="b3bf-sheet">
    <colgroup>
     <col className="b3bf-c-sn"/><col className="b3bf-c-desc"/><col className="b3bf-c-unit"/><col className="b3bf-c-qty"/>
     {priced&&<col className="b3bf-c-money"/>}{priced&&<col className="b3bf-c-money"/>}<col className="b3bf-c-notes"/>
    </colgroup>
    <thead><tr>
     <th>SN</th><th>Item Description</th><th>Unit</th><th>Qty.</th>
     {priced&&<th>{currency==="usd"?"Unit Rate (USD)":currency==="both"?"Unit Rate":"Unit Rate (THB)"}</th>}
     {priced&&<th>{currency==="usd"?"Amount (USD)":currency==="both"?"Amount":"Amount (THB)"}</th>}<th>Notes</th>
    </tr></thead>
    <tbody>
     <tr className="b3bf-sec b3bf-ref">
      <td colSpan={priced?5:4}><button type="button" className="b3bf-tg" aria-expanded={shown("a1")} onClick={()=>toggle("a1")}>A1 · MR-0001 SCADA radio — brownfield items executed with this proposal</button></td>
      {priced&&<td className="b3bf-num">{money(0,0)}</td>}<td>Supplied under base</td>
     </tr>
     {shown("a1")&&<tr>
      <td>A1</td>
      <td><button type="button" className="b3bf-tg" aria-expanded={shown("a1bom")} onClick={()=>toggle("a1bom")}>BOM</button> <strong>Brownfield SCADA radio sets from the MR0001 MTO</strong>
       <div className="b3bf-desc">{model.exclusion}</div></td>
      <td>Lot</td><td className="b3bf-num">{model.a1Rows.length}</td>
      {priced&&<td className="b3bf-num">—</td>}{priced&&<td className="b3bf-num">{money(0,0)}</td>}
      <td>Supplied under base</td>
     </tr>}
     {shown("a1")&&shown("a1bom")&&<tr><td colSpan={cols}><div className="b3bf-bom">
      <div className="b3bf-bomh"><span>BILL OF MATERIALS — A1 BROWNFIELD (ZPQ / ZWP8 / ZWP11)</span><span className="b3bf-badge">NOT PRICED IN THIS PROPOSAL</span></div>
      <table>
       <thead><tr><th>Item</th><th>Tag No.</th><th>Description</th><th>Site</th><th>Qty</th><th>Status</th><th>JB status</th><th>Install / routing by</th></tr></thead>
       <tbody>{model.a1Rows.map(row=><tr key={row.sn}>
        <td>{row.sn}</td><td className="b3bf-pre">{row.tagText}</td><td className="b3bf-pre">{row.description}{!official&&<div className="b3bf-src">{row.source}</div>}</td><td>{row.site}</td><td className="b3bf-pre">{row.qtyText}</td>
        <td>{row.status}</td><td>{row.jbState==="OPEN"?<Mark kind="open">{official?"TBA":row.jbText}</Mark>:row.jbText}</td><td>{row.installer}</td>
       </tr>)}</tbody>
      </table>
     </div></td></tr>}
     {model.otherPartA.map(row=><tr key={row.sn} className="b3bf-ref">
      <td>{row.sn}</td><td colSpan={priced?4:3}><strong>{row.title}.</strong> {row.description}</td>
      {priced&&<td className="b3bf-num">—</td>}<td>{row.status}</td>
     </tr>)}
     <tr className="b3bf-sec">
      <td colSpan={priced?5:4}><button type="button" className="b3bf-tg" aria-expanded={shown("bf")} onClick={()=>toggle("bf")}>B3-BF · Brownfield inspection, testing &amp; certification — additional</button></td>
      {priced&&<td className="b3bf-num">—</td>}
      <td>Lump sum lot</td>
     </tr>
     {shown("bf")&&<tr>
      <td>BF.1</td>
      <td><button type="button" className="b3bf-tg" aria-expanded={shown("bom")} onClick={()=>toggle("bom")}>BOM</button> <strong>Brownfield site inspection, testing &amp; certification services</strong>
       <div className="b3bf-desc">Existing 2-person team, {model.netCalendarDays} net calendar days, covering brownfield SCADA WiMAX radio links at ZPQ, ZWP8 and ZWP11.</div></td>
      <td>Lot</td><td className="b3bf-num">1</td>
      {priced&&<td className="b3bf-num">—</td>}
      {priced&&<td className="b3bf-num" data-testid="b3bf-lot">{money(model.proposalTHB,model.proposalUSD)}</td>}
      <td>Net additional</td>
     </tr>}
     {shown("bf")&&shown("bom")&&<tr><td colSpan={cols}><div className="b3bf-bom">
      <div className="b3bf-bomh"><span>BREAKDOWN — B3-BF BROWNFIELD SERVICES (ZPQ / ZWP8 / ZWP11)</span><span className="b3bf-badge">{itemized?"ITEMIZED PRICING MODE":"LUMP SUM LOT MODE"}</span><span className="b3bf-badge">{priced?"WITH PRICES":"WITHOUT PRICES"}</span></div>
      <table>
       <thead><tr>
        <th>Item</th><th>Resource / Activity</th><th>Persons</th><th>Days</th><th>Unit</th>
        {priced&&itemized&&<th>{currency==="usd"?"Unit Rate (USD)":currency==="both"?"Unit Rate":"Unit Rate (THB)"}</th>}
        {priced&&itemized&&<th>Breakdown (incl. in B3-BF)</th>}<th>Remarks</th>
       </tr></thead>
       <tbody>
        {model.bomLines.filter(line=>line.kind!=="note"&&line.kind!=="info"&&!(official&&line.internalOnly)).map(line=><tr key={line.id}>
         <td>{line.id}</td>
         <td>{line.activity}{priced&&!official&&line.usdPerPersonDay?<span className="b3bf-rate"> (USD {line.usdPerPersonDay.toLocaleString("en-US")}{line.kind==="check"?" per team-day":"/day"} @{line.fxTHBPerUSD})</span>:null}</td>
         <td className="b3bf-num">{line.persons??"—"}</td>
         <td className="b3bf-num">{line.days??"—"}</td>
         <td>{line.unit}</td>
         {priced&&itemized&&<td className="b3bf-num">{line.kind==="check"?"(= BF.1.1 + BF.1.2)":line.display?<Mark kind={line.kind}>{official?"TBA":line.display}</Mark>:money(line.unitRateTHB,line.unitRateUSD)}</td>}
         {priced&&itemized&&<td className="b3bf-num">{line.countsInSubtotal?("("+(money(line.totalTHB,line.totalUSD)||"—")+")"):"—"}</td>}
         <td>{official?(line.officialRemarks||""):line.remarks}</td>
        </tr>)}
        {!official&&<tr><td>BF.INFO</td><td colSpan={bomCols-1}>Greenfield/base B3 reduced by 5 working days. Carve-out basis OPEN. No price effect in this proposal. Base B3 is not modified.</td></tr>}
        <tr className="b3bf-note"><td colSpan={bomCols} data-testid="b3bf-jutal-note">{model.jutalNote}</td></tr>
        <tr className="b3bf-note"><td colSpan={bomCols} data-testid="b3bf-note">{model.lastLineNote}</td></tr>
       </tbody>
      </table>
     </div></td></tr>}
     {shown("bf")&&<tr className="b3bf-site">
      <td colSpan={cols}><button type="button" className="b3bf-tg" aria-expanded={shown("site")} onClick={()=>toggle("site")}>BF.2 · Per-site allocation of the 14 days</button> <Mark kind="open">{official?"SPLIT TBA":"SPLIT OPEN"}</Mark></td>
     </tr>}
     {shown("bf")&&shown("site")&&model.siteRows.map(site=><tr key={site.sn}>
      <td>{site.sn}</td>
      <td>{site.site} — {site.description}</td>
      <td>day</td><td className="b3bf-num"><Mark kind="open">{gap}</Mark></td>
      {priced&&<td className="b3bf-num">—</td>}{priced&&<td className="b3bf-num">—</td>}
      <td>Total only · {site.jbText} · {site.installer}</td>
     </tr>)}
     <tr className="b3bf-sec b3bf-ref">
      <td colSpan={cols}><button type="button" className="b3bf-tg" aria-expanded={shown("ref")} onClick={()=>toggle("ref")}>PART B — original quotation items (reference base scope, not priced)</button></td>
     </tr>
     {shown("ref")&&model.partB.map(row=><tr key={row.code} className="b3bf-ref">
      <td>{row.code}</td><td colSpan={priced?4:3}>{row.note}</td>
      {priced&&<td className="b3bf-num">—</td>}<td>{row.note}</td>
     </tr>)}
     {priced&&<tr className="b3bf-total" data-testid="b3bf-total">
      <td colSpan={5}>Grand total of this additional proposal (excl. OPEN items)</td>
      <td className="b3bf-num">{money(model.grandTotalTHB,model.grandTotalUSD)}</td>
      <td>{currency==="usd"?"USD":currency==="both"?"THB / USD":"THB"} · excl. OPEN items</td>
     </tr>}
    </tbody>
   </table></div>
   <p className="b3bf-foot">{model.exclusion} MOB/DEMOB and the per-site day split stay OPEN.</p>
   </>}
  </div>
  {!official&&<aside className="b3bf-openpanel" data-testid="b3bf-open-items">
   <h3>Open items</h3>
   <ul>{model.openItems.map(item=><li key={item.id}><strong>{item.topic}.</strong> {item.detail}</li>)}</ul>
   {priced&&<table className="b3bf-carve">
    <caption>Carve-out illustration only — not an Amount column and not applied to this proposal or to base B3 ({money(model.baseReadOnly.workingSellTHB,null)} remains the unchanged base).</caption>
    <thead><tr><th>Basis</th><th>Read from current B3</th><th>Days</th><th>Illustration</th><th>Status</th></tr></thead>
    <tbody>
     <tr><td>{model.carveOut.c1.id}</td><td>{model.carveOut.c1.basis}</td><td className="b3bf-num">{model.carveOut.c1.days}</td><td className="b3bf-num">{money(model.carveOut.c1.valueTHB,null)}</td><td><Mark kind="open">OPEN</Mark></td></tr>
     <tr><td>{model.carveOut.c2.id}</td><td>{model.carveOut.c2.basis}</td><td className="b3bf-num">{model.carveOut.c2.days}</td><td className="b3bf-num">{money(model.carveOut.c2.valueTHB,null)}</td><td><Mark kind="open">OPEN</Mark></td></tr>
    </tbody>
   </table>}
  </aside>}
 </section>;
}
function OfficialCustomerSheet({model,priced,itemized,currency}){
 const schedule=selectB3BrownfieldOfficialSchedule0553(model,{priced,itemized,currency});
 const shown=row=>priced?row.cells:[...row.cells.slice(0,5),row.cells[7]||""];
 const span=schedule.columns.length;
 return <div className="p553-native-sheet" data-testid="b3bf-official-sheet">
  <div className="p553-native-title">Scope of supply<br/>供货范围</div>
  <div className="p553-sheet-meta"><strong>Project</strong><span>ZAWTIKA DEVELOPMENT PROJECT PHASE 1F</span><strong>Document</strong><span>{b3BrownfieldDocumentNumber0553()}</span></div>
  <div className="p553-sheet-scroll"><table className="p553-customer-table">
   <thead><tr>{schedule.columns.map(header=><th key={header}>{header.split(" / ").map((part,index)=><React.Fragment key={part+index}>{index>0&&<br/>}{part}</React.Fragment>)}</th>)}</tr></thead>
   <tbody>{schedule.rows.map((row,index)=>{
    const cells=shown(row);
    if(row.kind==="section")return <tr key={index} className="p553-sheet-section"><td colSpan={span}>{row.cells[0]}<br/>{row.cells[1]}</td></tr>;
    if(row.kind==="note")return <tr key={index} className="b3bf-note"><td colSpan={span}>{row.cells[0]}</td></tr>;
    if(row.kind==="total")return <tr key={index} className="p553-sheet-total" data-testid={priced?"b3bf-total":undefined}><td colSpan={priced?6:5}>{row.cells[0]}</td>{priced&&<td className="p553-price-cell">{row.cells[6]}</td>}<td>{row.cells[7]}</td></tr>;
    if(row.kind==="tba")return <tr key={index}><td colSpan={span}>{row.cells[0]} — TBA</td></tr>;
    return <tr key={index} className={row.kind==="detail"?"b3bf-official-detail":"p553-mr-preview-row"}>{cells.map((value,cell)=><td key={cell} className={(priced&&(cell===5||cell===6)?"p553-price-cell ":"")+"b3bf-pre"}>{value}</td>)}</tr>;
   })}</tbody>
  </table></div>
 </div>;
}
function Mark({kind,children}){
 return <span className={kind==="open"?"b3bf-open":kind==="company"||kind==="jutal"?"b3bf-by":"b3bf-open"}>{children}</span>;
}
const CSS=`
.b3bf{font-size:13px;color:#172d3e}
.b3bf h2{font-size:18px;margin:4px 0 8px}
.b3bf-head,.b3bf-context{display:flex;justify-content:space-between;gap:12px;color:#4d6474;font-size:12px}
.b3bf-context{display:block;margin:0 0 10px;line-height:1.45}
.b3bf-controls{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin:0 0 10px}
.b3bf-controls button{border:1px solid #8ba2b1;background:#fff;padding:4px 9px;border-radius:3px;font-size:12px;cursor:pointer}
.b3bf-controls button[aria-pressed=true]{background:#005a9e;color:#fff;border-color:#005a9e}
.b3bf-sep{color:#8ba2b1;margin:0 4px}
.b3bf-doc{background:#fff;border:1px solid #b1c0cb;padding:14px 16px}
.b3bf-stand{text-align:center;font-weight:700;margin:4px 0 10px}
.b3bf-stand small{font-weight:400}
.b3bf-scroll{overflow-x:auto}
.b3bf-sheet,.b3bf-bom table,.b3bf-carve{width:100%;border-collapse:collapse}
.b3bf-sheet{table-layout:fixed}
.b3bf-c-sn{width:7%}.b3bf-c-unit,.b3bf-c-qty{width:7%}.b3bf-c-money{width:16%}.b3bf-c-notes{width:14%}
.b3bf-sheet th{background:#0b2538;color:#fff;border:1px solid #b1c0cb;padding:5px 6px;font-size:12px;text-align:left}
.b3bf-bom{overflow-x:auto}
.b3bf-bom table{min-width:680px}
.b3bf-bom th,.b3bf-bom td:nth-child(1),.b3bf-bom td:nth-child(4),.b3bf-bom td:nth-child(5){white-space:nowrap}
.b3bf-sheet td,.b3bf-bom td,.b3bf-carve td,.b3bf-carve th{border:1px solid #d1dde5;padding:5px 7px;vertical-align:top}
.b3bf-num{text-align:right;font-variant-numeric:tabular-nums;white-space:normal}
.b3bf-sec td{background:#dbe9f3;font-weight:700}
.b3bf-site td{background:#f4f8fb;font-weight:600}
.b3bf-ref td{color:#5b6b78}
.b3bf-tg{border:0;background:none;font:inherit;font-weight:inherit;color:inherit;cursor:pointer;padding:0;text-align:left}
.b3bf-tg::before{content:"+ ";font-family:Consolas,monospace}
.b3bf-tg[aria-expanded=true]::before{content:"− "}
.b3bf-desc{font-size:11.5px;color:#4a5568;font-style:italic;font-weight:400;margin-top:3px}
.b3bf-bom{background:#fff;border:1px solid #005a9e;border-radius:4px;overflow:hidden}
.b3bf-bomh{background:#005a9e;color:#fff;padding:6px 12px;font-size:12px;font-weight:600;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.b3bf-badge{background:#fff;color:#005a9e;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:700}
.b3bf-bom th{background:#eaf2f6;color:#0b2538;text-align:left}
.b3bf-sub td{background:#eaf2f6;font-weight:700}
.b3bf-note td{background:#fff8e1;border-top:2px solid #e0a800;font-weight:600;color:#5c4400;line-height:1.5}
.b3bf-open{display:inline-block;background:#fde2e1;color:#a4161a;border-radius:3px;padding:0 5px;font-weight:700;font-size:11px}
.b3bf-by{display:inline-block;background:#e3f2e5;color:#1d6b2a;border-radius:3px;padding:0 5px;font-weight:700;font-size:11px}
.b3bf-rate{color:#2c5d7a;font-weight:400}
.b3bf-src{font-family:Consolas,monospace;font-size:10.5px;color:#7a8a96;font-weight:400}
.b3bf-pre{white-space:pre-line}
.b3bf .p553-customer-table td.p553-price-cell{white-space:normal}
.b3bf-official-detail td{background:#f8fbfd;font-weight:400}
.b3bf-doctitle{font-family:Consolas,monospace;font-size:12px;margin:0 0 8px}
.b3bf-controls button:disabled{opacity:.45;cursor:not-allowed}
.b3bf-total td{background:#0b2538;color:#fff;font-weight:700}
.b3bf-totals{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:12px}
.b3bf-totals div{border:1px solid #b1c0cb;padding:8px 10px;background:#f7fbfd}
.b3bf-totals span,.b3bf-totals small{display:block;color:#4d6474;font-size:11px}
.b3bf-totals strong{display:block;margin:3px 0;font-size:15px}
.b3bf-foot{font-size:11.5px;color:#4a5568;line-height:1.45}
.b3bf-openpanel{margin-top:14px;border:2px dashed #a4161a;background:#fffafa;padding:10px 14px}
.b3bf-openpanel h3{margin:0 0 8px;color:#a4161a;font-size:14px}
.b3bf-openpanel li{margin:4px 0}
.b3bf-carve{margin-top:8px}
.b3bf-carve caption{text-align:left;font-weight:700;margin-bottom:6px;color:#5c4400}
@media(max-width:900px){.b3bf-totals{grid-template-columns:1fr 1fr}}
@media print{.b3bf-controls,.b3bf-openpanel{break-inside:avoid}.b3bf-controls{display:none}}
`;
