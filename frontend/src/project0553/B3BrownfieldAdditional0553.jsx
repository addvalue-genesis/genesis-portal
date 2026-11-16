import React,{useMemo,useState} from "react";
import {buildB3BrownfieldAdditionalCsv0553,selectB3BrownfieldAdditional0553} from "./data/b3BrownfieldAdditional0553";

const thb=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const usd=n=>Number.isFinite(n)?n.toLocaleString("en-US",{maximumFractionDigits:0}):"";

function downloadCsv(model,view){
 const csv=buildB3BrownfieldAdditionalCsv0553(model,view);
 const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
 const url=URL.createObjectURL(blob);
 const link=document.createElement("a");
 link.href=url;
 link.download=`PJ2608-0553_B3BF_${view.priced?"PRICED":"UNPRICED"}_${view.itemized?"ITEMIZED":"LUMPSUM"}.csv`;
 link.click();
 URL.revokeObjectURL(url);
}

export function B3BrownfieldAdditional0553({initialPriced=true,initialItemized=true}={}){
 const model=useMemo(()=>selectB3BrownfieldAdditional0553(),[]);
 const [doc,setDoc]=useState(false);
 const [itemized,setItemized]=useState(initialItemized);
 const [priced,setPriced]=useState(initialPriced);
 const [open,setOpen]=useState({bf:true,bom:true,site:true,a1:true,a1bom:true,ref:false});
 const shown=key=>doc||!!open[key];
 const toggle=key=>{if(!doc)setOpen(current=>({...current,[key]:!current[key]}));};
 const cols=priced?7:5;
 const bomCols=priced&&itemized?8:6;
 const viewLabel=`${priced?"PRICED":"UNPRICED"} · ${itemized?"ITEMIZED":"LUMP SUM"}`;
 return <section className="p55-panel b3bf" data-testid="b3bf-root">
  <style>{CSS}</style>
  <div className="b3bf-head"><span>PJ2608-0553 / Additional Proposal / B3-BF</span><span>Currency: THB · {viewLabel}</span></div>
  <h2>{model.title}</h2>
  <p className="b3bf-context">{model.context} This tab reads the current B3 rates and the MR0001 MTO. It does not change the original Scope of Supply or the base B3 amount.</p>
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
   <button type="button" onClick={()=>downloadCsv(model,{priced,itemized})}>Export CSV</button>
   <button type="button" onClick={()=>window.print()}>Print</button>
  </div>
  <div className="b3bf-doc">
   <p className="b3bf-stand">ADDITIONAL PROPOSAL — B3 BROWNFIELD INSPECTION, TESTING &amp; CERTIFICATION<br/><small>Standalone. The original quotation / Scope of Supply is not modified.</small></p>
   <div className="b3bf-scroll"><table className="b3bf-sheet">
    <colgroup>
     <col className="b3bf-c-sn"/><col className="b3bf-c-desc"/><col className="b3bf-c-unit"/><col className="b3bf-c-qty"/>
     {priced&&<col className="b3bf-c-money"/>}{priced&&<col className="b3bf-c-money"/>}<col className="b3bf-c-notes"/>
    </colgroup>
    <thead><tr>
     <th>SN</th><th>Item Description</th><th>Unit</th><th>Qty.</th>
     {priced&&<th>Unit Rate (THB)</th>}{priced&&<th>Amount (THB)</th>}<th>Notes</th>
    </tr></thead>
    <tbody>
     <tr className="b3bf-sec b3bf-ref">
      <td colSpan={priced?5:4}><button type="button" className="b3bf-tg" aria-expanded={shown("a1")} onClick={()=>toggle("a1")}>A1 · MR-0001 SCADA radio — brownfield items executed with this proposal</button></td>
      {priced&&<td className="b3bf-num">{thb(model.partATHB)}</td>}<td>Supplied under base</td>
     </tr>
     {shown("a1")&&<tr>
      <td>A1</td>
      <td><button type="button" className="b3bf-tg" aria-expanded={shown("a1bom")} onClick={()=>toggle("a1bom")}>BOM</button> <strong>Brownfield SCADA radio sets from the MR0001 MTO</strong>
       <div className="b3bf-desc">{model.exclusion} {model.installer}.</div></td>
      <td>Lot</td><td className="b3bf-num">{model.a1Rows.length}</td>
      {priced&&<td className="b3bf-num">—</td>}{priced&&<td className="b3bf-num">{thb(model.partATHB)}</td>}
      <td>Supplied under base</td>
     </tr>}
     {shown("a1")&&shown("a1bom")&&<tr><td colSpan={cols}><div className="b3bf-bom">
      <div className="b3bf-bomh"><span>BILL OF MATERIALS — A1 BROWNFIELD (ZPQ / ZWP8 / ZWP11)</span><span className="b3bf-badge">NOT PRICED IN THIS PROPOSAL</span></div>
      <table>
       <thead><tr><th>Item</th><th>Tag No.</th><th>Description</th><th>Site</th><th>Qty</th><th>Status</th><th>JB status</th><th>Install / routing by</th></tr></thead>
       <tbody>{model.a1Rows.map(row=><tr key={row.sn}>
        <td>{row.sn}</td><td>{row.tagText}</td><td>{row.description}<div className="b3bf-src">{row.source}</div></td><td>{row.site}</td><td>{row.qtyText}</td>
        <td>{row.status}</td><td>{row.jbState==="OPEN"?<Mark kind="open">{row.jbText}</Mark>:row.jbText}</td><td>{row.installer}</td>
       </tr>)}</tbody>
      </table>
     </div></td></tr>}
     {model.otherPartA.map(row=><tr key={row.sn} className="b3bf-ref">
      <td>{row.sn}</td><td colSpan={priced?4:3}><strong>{row.title}.</strong> {row.description}</td>
      {priced&&<td className="b3bf-num">—</td>}<td>{row.status}</td>
     </tr>)}
     <tr className="b3bf-sec">
      <td colSpan={priced?5:4}><button type="button" className="b3bf-tg" aria-expanded={shown("bf")} onClick={()=>toggle("bf")}>B3-BF · Brownfield inspection, testing &amp; certification — additional</button></td>
      {priced&&<td className="b3bf-num" data-testid="b3bf-lot">{thb(model.proposalTHB)}</td>}
      <td>Lump sum lot</td>
     </tr>
     {shown("bf")&&<tr>
      <td>BF.1</td>
      <td><button type="button" className="b3bf-tg" aria-expanded={shown("bom")} onClick={()=>toggle("bom")}>BOM</button> <strong>Brownfield site inspection, testing &amp; certification services</strong>
       <div className="b3bf-desc">Existing 2-person team, {model.netCalendarDays} net calendar days, covering brownfield SCADA WiMAX radio links at ZPQ, ZWP8 and ZWP11. Excludes installation, JB and cable routing ({model.installer}).</div></td>
      <td>Lot</td><td className="b3bf-num">1</td>
      {priced&&<td className="b3bf-num">{thb(model.proposalTHB)}</td>}
      {priced&&<td className="b3bf-num">{thb(model.proposalTHB)}</td>}
      <td>Net additional</td>
     </tr>}
     {shown("bf")&&shown("bom")&&<tr><td colSpan={cols}><div className="b3bf-bom">
      <div className="b3bf-bomh"><span>BREAKDOWN — B3-BF BROWNFIELD SERVICES (ZPQ / ZWP8 / ZWP11)</span><span className="b3bf-badge">{itemized?"ITEMIZED PRICING MODE":"LUMP SUM LOT MODE"}</span><span className="b3bf-badge">{priced?"WITH PRICES":"WITHOUT PRICES"}</span></div>
      <table>
       <thead><tr>
        <th>Item</th><th>Resource / Activity</th><th>Persons</th><th>Days</th><th>Unit</th>
        {priced&&itemized&&<th>Unit Rate (THB)</th>}{priced&&itemized&&<th>Total (THB)</th>}<th>Remarks</th>
       </tr></thead>
       <tbody>
        {model.bomLines.filter(line=>line.kind!=="note"&&line.kind!=="info").map(line=><tr key={line.id}>
         <td>{line.id}</td>
         <td>{line.activity}{priced&&line.usdPerPersonDay?<span className="b3bf-rate"> (USD {usd(line.usdPerPersonDay)}{line.kind==="check"?" per team-day":"/day"} @{line.fxTHBPerUSD})</span>:null}</td>
         <td className="b3bf-num">{line.persons??"—"}</td>
         <td className="b3bf-num">{line.days??"—"}</td>
         <td>{line.unit}</td>
         {priced&&itemized&&<td className="b3bf-num">{line.kind==="check"?thb(line.unitRateTHB):line.display?<Mark kind={line.kind}>{line.display}</Mark>:thb(line.unitRateTHB)}</td>}
         {priced&&itemized&&<td className="b3bf-num">{line.kind==="check"?"(= BF.1.1 + BF.1.2)":line.display?<Mark kind={line.kind}>{line.display}</Mark>:Number.isFinite(line.totalTHB)?thb(line.totalTHB):"—"}</td>}
         <td>{line.remarks}</td>
        </tr>)}
        {priced&&itemized&&<tr className="b3bf-sub"><td colSpan={6}>Subtotal (BF.1) — priced items, matches parent lot. OPEN items excluded.</td><td className="b3bf-num">{thb(model.proposalTHB)}</td><td>OPEN items excluded</td></tr>}
        <tr><td>BF.INFO</td><td colSpan={priced&&itemized?bomCols-1:bomCols-1}>Greenfield/base B3 reduced by 5 working days. Carve-out basis OPEN{priced?` — C1 survey ${thb(model.carveOut.c1.valueTHB)} or C2 SAT ${thb(model.carveOut.c2.valueTHB)}`:""}. No price effect in this proposal. Base B3 is not modified.</td></tr>
        <tr className="b3bf-note"><td colSpan={bomCols} data-testid="b3bf-note">{model.lastLineNote}</td></tr>
       </tbody>
      </table>
     </div></td></tr>}
     {shown("bf")&&<tr className="b3bf-site">
      <td colSpan={cols}><button type="button" className="b3bf-tg" aria-expanded={shown("site")} onClick={()=>toggle("site")}>BF.2 · Per-site allocation of the 14 days</button> <Mark kind="open">SPLIT OPEN</Mark></td>
     </tr>}
     {shown("bf")&&shown("site")&&model.siteRows.map(site=><tr key={site.sn}>
      <td>{site.sn}</td>
      <td>{site.site} — {site.description}</td>
      <td>day</td><td className="b3bf-num"><Mark kind="open">OPEN</Mark></td>
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
      <td colSpan={5}>TOTAL ADDITIONAL PROPOSAL — B3-BF (excl. OPEN items)</td>
      <td className="b3bf-num">{thb(model.grandTotalTHB)}</td>
      <td>THB · this additional proposal only</td>
     </tr>}
    </tbody>
   </table></div>
   {priced&&<div className="b3bf-totals" data-testid="b3bf-totals">
    <div><span>Part A</span><strong>{thb(model.partATHB)} THB</strong><small>Supplied under base</small></div>
    <div><span>Part B reference lines</span><strong>No price</strong><small>Original quotation, unchanged</small></div>
    <div><span>B3 Brownfield Additional</span><strong>{thb(model.proposalTHB)} THB</strong><small>{model.netCalendarDays} team-days × {thb(model.teamDayTHB)}</small></div>
    <div><span>Grand total of this additional proposal</span><strong>{thb(model.grandTotalTHB)} THB</strong><small>Excl. OPEN items</small></div>
   </div>}
   <p className="b3bf-foot"><strong>{model.installer}.</strong> Vendor scope in this proposal is supervision, testing and SAT support. MOB/DEMOB, POB, accommodation, medical, visa and the per-site day split stay OPEN. {model.exclusion}</p>
  </div>
  <aside className="b3bf-openpanel" data-testid="b3bf-open-items">
   <h3>Open items</h3>
   <ul>{model.openItems.map(item=><li key={item.id}><strong>{item.topic}.</strong> {item.detail}</li>)}</ul>
   {priced&&<table className="b3bf-carve">
    <caption>Carve-out illustration only — not applied to this proposal and not applied to base B3 ({thb(model.baseReadOnly.workingSellTHB)} THB remains the unchanged base).</caption>
    <thead><tr><th>Basis</th><th>Read from current B3</th><th>Days</th><th>Value (THB)</th><th>Status</th></tr></thead>
    <tbody>
     <tr><td>{model.carveOut.c1.id}</td><td>{model.carveOut.c1.basis}</td><td className="b3bf-num">{model.carveOut.c1.days}</td><td className="b3bf-num">{thb(model.carveOut.c1.valueTHB)}</td><td><Mark kind="open">OPEN</Mark></td></tr>
     <tr><td>{model.carveOut.c2.id}</td><td>{model.carveOut.c2.basis}</td><td className="b3bf-num">{model.carveOut.c2.days}</td><td className="b3bf-num">{thb(model.carveOut.c2.valueTHB)}</td><td><Mark kind="open">OPEN</Mark></td></tr>
    </tbody>
   </table>}
  </aside>
 </section>;
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
.b3bf-c-sn{width:8%}.b3bf-c-unit,.b3bf-c-qty{width:8%}.b3bf-c-money{width:12%}.b3bf-c-notes{width:16%}
.b3bf-sheet th{background:#0b2538;color:#fff;border:1px solid #b1c0cb;padding:5px 6px;font-size:12px;text-align:left}
.b3bf-bom{overflow-x:auto}
.b3bf-bom table{min-width:680px}
.b3bf-bom th,.b3bf-bom td:nth-child(1),.b3bf-bom td:nth-child(4),.b3bf-bom td:nth-child(5){white-space:nowrap}
.b3bf-sheet td,.b3bf-bom td,.b3bf-carve td,.b3bf-carve th{border:1px solid #d1dde5;padding:5px 7px;vertical-align:top}
.b3bf-num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
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
