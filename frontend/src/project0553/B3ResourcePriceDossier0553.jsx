import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB3ResourcePriceDossier0553} from "./data/b3ResourcePriceDossier0553";

const root="bid.budget.working.bc.b3.resource-price-dossier";
const cash=v=>Number.isFinite(v)?"THB "+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const num=v=>Number.isFinite(v)?v.toLocaleString("en-US",{maximumFractionDigits:2}):"TBC";
const c=id=><ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>;
export function B3ResourcePriceDossier0553({workingRow}){
 const model=selectB3ResourcePriceDossier0553(workingRow);
 const holder=React.useRef(null);
 const expandAll=open=>holder.current?.querySelectorAll("details.p553-b3-dossier-group,details.p553-b3-dossier-site")
  .forEach(x=>{x.open=open;});
 return <section ref={holder} className="p55-panel p553-b3-resource-dossier"
  data-component-key={root} style={{padding:12,marginTop:12}}>
  <div className="p553-b2-recalc-topbar">
   <div><h3>B3 — Resource / Cost &amp; Working SELL Dossier (แจกแจงคน วัน อัตรา และราคา)</h3>
    <p className="p55-note">Module {c(root)} · รูปแบบ Work Type → Site → Resource/Expense
     แบบเดียวกับแฟ้ม B2 Project Dossier / MR-0001. แต่ B3 เป็นบริการ ไม่ใช่ Equipment BOM.</p></div>
   <div className="p553-b2-recalc-buttons">
    <button type="button" className="p553-detail-button" onClick={()=>expandAll(true)}>＋ Expand All</button>
    <button type="button" className="p553-detail-button" onClick={()=>expandAll(false)}>− Collapse All</button>
   </div>
  </div>
  <div className="p55-metric-grid">
   <div><strong>Selected B3 Working SELL · 10.2 → 10.3/10.5</strong>
    <p>{cash(model.pricedWorkingSellTHB)}</p><small>4 included cost-owner workgroups / 29 priced evidence lines</small></div>
   <div><strong>Actual Paid Direct Cost</strong><p>NOT ESTABLISHED</p>
    <small>Vendor Quote THB 236,250 is PURCHASE EVIDENCE, not paid cost</small></div>
   <div><strong>Current physical people × days (GF Yard / Offshore)</strong><p>TO VERIFY</p>
    <small>No approved ADDVALUE RACI, deployment or cash cost</small></div>
   <div><strong>Commercial Release</strong><p>HOLD</p>
    <small>No Working SELL or customer price mutation from this dossier</small></div>
  </div>
  <p className="p55-note"><strong>อ่านตารางนี้อย่างไร:</strong>
   คอลัมน์ Working SELL คือยอดขายที่อยู่ในฐาน 10.2 แล้วเฉพาะรายการระบุ INCLUDED;
   Supplier Quotation แสดงราคาซื้อก่อนบวก 20%+5%+5% (เฉพาะ MGW);
   Actual Direct Cost ที่ยังไม่มีใบจ่าย/Payroll ให้แสดง NOT ESTABLISHED ไม่ตีว่าเป็นศูนย์.
   Site/MR Test IDs ไม่ใช่รายการราคาซ้ำ.</p>
  {model.groups.map((g,i)=>{
   const gid=root+".group."+String(i+1).padStart(2,"0");
   const active=i<4;
   const sites=[...new Set(g.rows.map(x=>x.site||"Shared"))];
   return <details className="p553-b3-dossier-group" key={gid}
    data-component-key={gid} open={i===0||i===1||i===2}>
    <summary className="p553-b2-recalc-summary">
     <span className="p553-b2-recalc-num">B3.R{i+1}</span>
     <span className="p553-b2-recalc-label">
      <strong>{g.name}</strong>
      <small>{g.rowCount} detailed resource/expense rows ·
       {active?" INCLUDED IN WORKING SELL":" CONDITIONAL / UNPRICED — NOT ADDITIVE"} ·
       {active?cash(g.selectedWorkingSellTHB):"0 POSTED; amount NOT ESTABLISHED"}</small>
      <code>{gid}</code>
     </span>{c(gid)}
    </summary>
    <div className="p553-b2-recalc-body">
     <p className="p55-note">Basis: {g.reference} ·
      {active?" Selected source price evidence; no duplicate posting.":" Engineering SOW only; physical crew, day and Direct Cost require approval."}</p>
     {sites.map((site,j)=>{
      const rows=g.rows.filter(x=>(x.site||"Shared")===site);
      const sid=gid+".site."+String(j+1).padStart(2,"0");
      const siteAmount=rows.reduce((n,x)=>n+(Number.isFinite(x.workingSellTHB)?x.workingSellTHB:0),0);
      return <details className="p553-b3-dossier-site" key={sid} data-component-key={sid} open={i<3&&j===0}>
       <summary className="p553-b2-recalc-summary">
        <span className="p553-b2-recalc-num">B3.R{i+1}.{j+1}</span>
        <span className="p553-b2-recalc-label"><strong>{site}</strong>
         <small>{rows.length} lines · {active?cash(siteAmount):"NONPOSTING / Pending approved scope & rates"}</small>
         <code>{sid}</code></span>{c(sid)}
       </summary>
       <div className="p55-table-wrap">
        <table className="p55-table p55-table--compact" style={{minWidth:1650}}>
         <thead><tr>
          <th>Expense ID / Source Module</th><th>Activity / WBS</th><th>Role / Crew</th>
          <th>People</th><th>Days</th><th>Qty × Unit</th>
          <th>Rate USD / unit</th><th>FX</th><th>THB / unit</th>
          <th>Quoted Vendor Cost THB</th><th>Working SELL THB</th>
          <th>Verified Direct COST THB</th><th>Evidence / Posting Gate</th>
         </tr></thead>
         <tbody>{rows.map(x=><tr key={x.id} data-component-key={x.id}>
          <td><strong>{x.id.split(".").slice(-2).join(" / ")}</strong>
           <small>{x.sourceModuleId}</small>{c(x.id)}</td>
          <td>{x.work}<small>{x.wbs||""}</small><small>{x.calculation}</small></td>
          <td>{x.role}</td><td>{num(x.people)}</td><td>{num(x.teamDays)}</td>
          <td>{num(x.qty)} {x.unit||""}</td>
          <td>{Number.isFinite(x.rateUSDPerUnit)?"USD "+num(x.rateUSDPerUnit):"—"}</td>
          <td>{Number.isFinite(x.fxTHBPerUSD)?num(x.fxTHBPerUSD):"—"}</td>
          <td>{cash(x.unitRateTHB)}</td>
          <td>{cash(x.quotedVendorCostTHB)}</td>
          <td><strong>{cash(x.workingSellTHB)}</strong>
           {Number.isFinite(x.illustrativeOnlyTHB)&&<small>Conditional estimate {cash(x.illustrativeOnlyTHB)} — not posted</small>}</td>
          <td>NOT ESTABLISHED</td>
          <td>{x.verifiedRateType||x.sourceType}
           <small>{x.sourceEvidence||x.sourceType||"No approved source rate"}</small>
           <small>{x.postingClass}</small></td>
         </tr>)}</tbody>
         <tfoot><tr>
          <th colSpan={10}>{site} — subtotal · {active?"selected price ONCE":"not priced"}</th>
          <th>{active?cash(siteAmount):"NOT ESTABLISHED"}</th>
          <th>NOT ESTABLISHED</th><th>Do not add duplicate Test IDs or unapproved work</th>
         </tr></tfoot>
        </table>
       </div>
      </details>;
     })}
     {i===4&&<p className="p55-note"><strong>BF ONLY conditional working labour scenario:</strong>
      {cash(model.bfOptionalIllustrativeSellTHB)} = 2 people × (3 provisional site-days + 2 provisional travel-days)
      × THB25,200/person-day. BOD §8 has previous survey findings;
      this scenario is NOT a payable verified direct cost or selected Working SELL.</p>}
     {i===5&&<p className="p55-note">SPE §7.3.2: JUTAL Zhuhai fabrication site SAT.
      ADDVALUE Crew × Days × Rate = NOT ESTABLISHED; MGW OEM FAT in B3.R1–R2 cannot be posted again here.</p>}
     {i===6&&<p className="p55-note">SPE §7.3.3: GF offshore commissioning after installation.
      ADDVALUE crew, mobilization, vessel/POB and RF/RACON support require separate priced evidence and signed RACI.</p>}
    </div>
   </details>;
  })}
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Selected Working SELL reconciliation</th><th>Amount THB</th><th>Cost status / Receiver</th></tr></thead>
   <tbody>{model.groups.slice(0,4).map((g,i)=><tr key={i}>
    <td>B3.R{i+1} — {g.name}</td><td>{cash(g.selectedWorkingSellTHB)}</td>
    <td>Included WS-B3 once / Actual Cost NOT ESTABLISHED</td>
   </tr>)}
   <tr><th>Selected B3 / CP-B3 preview · 1 LS</th>
    <th>{cash(model.pricedWorkingSellTHB)}</th>
    <th>10.2 source → 10.3 releaseCommercialModel → 10.5 scope; Customer Release HOLD</th></tr>
   </tbody></table></div>
  <p className="p55-note"><strong>New cost ledger gate:</strong>
   No new BF/Yard/Offshore work may enter the financial total until separately evidenced
   Qty × role × days × verified cost rate + travel/POB/allowances, one cost owner,
   a priced Working SELL decision, an approved ITP/RACI, and 10.3 Release reconciliation.
   This dossier does not invent payroll or migrate old 40-day SELL to the new work phases.</p>
 </section>;
}
