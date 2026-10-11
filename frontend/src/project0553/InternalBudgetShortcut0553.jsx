import React,{useState} from "react";
import {BulkTakeoff0553} from "./BulkTakeoff0553";
import {BULK_TAKEOFF_0553} from "./data/bulkTakeoff0553";
import { REV08_BASELINE,getBaselineReview } from "./data/rev08CommercialBaseline";
import { BID_COST_SPINE_0553 } from "./data/bidCostSpine";
// Read-only decision shortcut. Historical customer amounts and vendor costs are
// DIFFERENT bases: never add them together or call historical prices new costs.
const systems=[
 ["A1","MR-0001","SCADA Radio","Radio throughput feature/licences; NMS licences; dedicated SCADA enclosure; BLD/LAY bulk take-off"],
 ["A2","MR-0002","DMR Trunk Radio","LNA unit price: blank / no vendor quotation. This A2 value is HISTORICAL SYSTEM SELL only, not LNA price. BDA not accepted as substitute; 1/2-inch feeder, Yagi/omni, pigtail, enclosure, glands, power and alarm wiring require DWG/route take-off"],
 ["A3","MR-0003","Ex Telephone & Sounder","ATEX telephone junction boxes separately from SCADA enclosure; glands/cables/termination bulk"],
 ["A4","MR-0004","Marine RACON","Certification, installation accessories and site bulk from BLD/LAY"]
];
const steps=[
 ["01","Executive","RFQ scope, bidder/contract responsibility and budgetary policy"],
 ["02","First Principles","methodology, constraints, productivity and cost drivers"],
 ["03","Architecture","4-system interfaces, locations, boundaries, power and network"],
 ["04","MR & Documents","MR/DTS/BOD/SPE/notes/comments/references and MTO source"],
 ["05","Engineering","CAL/RPT, BLD/LAY/DWG, radio licence/capacity, enclosure/JB and physical bulk"],
 ["06","Execution","work packs, WBS, site resources, FAT/SAT, transport and schedule"],
 ["07","Vendor Evidence","product, datasheet, quoted lines, valid price and full commercial terms"],
 ["08","Risk & Change","assumptions, deviations, quantity/cost gaps and revision impact"]
];
export function InternalBudgetShortcut0553(){
 const [details,setDetails]=useState(false);
 const [openedSystems,setOpenedSystems]=useState(new Set());
 const toggleSystem=mr=>setOpenedSystems(old=>{const next=new Set(old);next.has(mr)?next.delete(mr):next.add(mr);return next;});
 const [currency,setCurrency]=useState("USD");
 const [rates,setRates]=useState({THB:"",CNY:""});
 const [showHistorical,setShowHistorical]=useState(false);
 const baseline=getBaselineReview();
 const historical=(code)=>REV08_BASELINE.summary.find(r=>r[0]===code)?.[2]??null;
 const usd=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"";
 const displayHistorical=n=>{if(!Number.isFinite(n))return "";if(currency==="USD")return usd(n);const rate=Number(rates[currency]);return rates[currency]&&Number.isFinite(rate)&&rate>0?usd(n*rate):"";};
 const currencyReady=currency==="USD"||(rates[currency]&&Number(rates[currency])>0);
 return <section className="p55-panel" style={{border:"2px solid #a5c7d3"}}>
  <div className="p55-eyebrow">L3.B / 10 · INTERNAL BUDGET SHORTCUT · SOURCE-CONTROLLED</div>
  <h2>Budgetary Internal — 4-System Quick View</h2>
  <p className="p55-note">CURRENT RECONCILED BID: not yet calculated. Do not mistake historical Rev08 selling amounts for current costs or new proposal prices. Missing values are blank, never zero.</p>
  <div className="p55-filterbar"><label>Display currency <select value={currency} onChange={e=>setCurrency(e.target.value)}><option value="USD">USD</option><option value="THB">THB — Thai baht</option><option value="CNY">CNY — Chinese yuan (RMB)</option></select></label>
  {currency!=="USD"&&<label>1 USD = <input type="number" min="0.000001" step="any" value={rates[currency]} onChange={e=>setRates(old=>({...old,[currency]:e.target.value}))} placeholder={"Verified "+currency+" rate"}/> {currency}</label>}</div>
  {!currencyReady&&<p className="p55-note">No verified USD/{currency} FX rate supplied. Converted amounts deliberately blank; source USD data remains unchanged. Record source/date before relying on any conversion.</p>}
  <div className="p55-metric-grid"><div><span>New reconciled budgetary internal ({currency})</span><strong>NOT YET ESTABLISHED</strong></div></div>
  <button type="button" className="p553-detail-button" onClick={()=>setShowHistorical(v=>!v)}>{showHistorical?"− Hide":"＋ Show"} historical Rev08 comparison (not current offer)</button>
  {showHistorical&&<div className="p55-metric-grid">
   <div><span>Historical Base A+B ({currency})</span><strong>{displayHistorical(baseline.base)}</strong></div>
   <div><span>Historical Part A ({currency})</span><strong>{displayHistorical(baseline.partA)}</strong></div>
   <div><span>Historical Part B ({currency})</span><strong>{displayHistorical(baseline.partB)}</strong></div>
   <div><span>Known Cisco working vendor cost (THB)</span><strong>{usd(BID_COST_SPINE_0553.knownPreliminaryCost.THB)}</strong></div>
  </div>}
  <p className="p55-note">Do not sum the Cisco vendor cost into Rev08: overlapping scope, different currency and quote validity require reconciliation. Optional C1/C2 excluded from base.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>＋/−</th><th>MR</th><th>System</th><th>Current reconciled budget ({currency})</th><th>Rev08 historical sell ({currency}) — comparison only</th><th>Engineering / cost reconciliation</th></tr></thead><tbody>
  {systems.map(([code,mr,name,note])=><React.Fragment key={mr}><tr><td><button type="button" className="p55-row-toggle" onClick={()=>toggleSystem(mr)} aria-expanded={openedSystems.has(mr)}>{openedSystems.has(mr)?"−":"+"}</button></td><td>{mr}</td><td>{name}</td><td className="is-number"></td><td className="is-number">{showHistorical?displayHistorical(historical(code)):""}</td><td>{note}</td></tr>
  {openedSystems.has(mr)&&<tr><td></td><td colSpan={5}><strong>{mr} — System composition / cost trace</strong>
   <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Component group</th><th>Engineering scope</th><th>Quantity driver / source</th><th>Qty</th><th>Price</th></tr></thead><tbody>
    {BULK_TAKEOFF_0553.filter(r=>r.mr===mr).map((r,i)=><tr key={i}><td>{r.category}</td><td>{r.item}</td><td>{r.source}<small>{r.driver}</small></td><td>{r.qty??""}</td><td>{r.rate??""}</td></tr>)}
   </tbody></table></div><p className="p55-note">Working engineering components only. Open the expandable Bulk Take-off below for individual accessory/check details. Vendor selection and system total remain unapproved.</p>
  </td></tr>}</React.Fragment>)}
  <tr><td></td><td>MR-0002</td><td>RFI LNA RX3852-2002-11 (product-only)</td><td className="is-number"></td><td className="is-number"></td><td>No source quotation received. Datasheet-only: 380–520 MHz, SMA(F), 11–28 VDC. Connector accessories, cable and enclosure require physical design. Blank is unknown, not zero.</td></tr>
  <tr><td></td><td>ALL</td><td>Shared bulk A5</td><td className="is-number"></td><td className="is-number">{showHistorical?displayHistorical(historical("A5")):""}</td><td>Source workbook has shared bulk; split quantities by MR using BLD/LAY/DWG, count common items once, preserve historic A5 without double counting</td></tr>
  </tbody></table></div>
  <BulkTakeoff0553/>
  <button type="button" className="p553-detail-button" onClick={()=>setDetails(v=>!v)} aria-expanded={details}>{details?"− Hide":"＋ Show"} mandatory processing 01–08</button>
  {details&&<div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Step</th><th>Module</th><th>Required evidence before revised budget</th></tr></thead><tbody>
   {steps.map(([n,title,description])=><tr key={n}><td>{n}</td><td>{title}</td><td>{description}</td></tr>)}
  </tbody></table></div>}
  <p className="p55-note"><strong>Process gate:</strong> Revised budget values require recorded outputs from all 01–08. No unsupported zero, synthetic vendor quote, inferred bulk quantity or automatic release. Historical reference remains visible even while new costing is incomplete.</p>
 </section>;
}
