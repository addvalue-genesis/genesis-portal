import React,{useState} from "react";
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
 const baseline=getBaselineReview();
 const historical=(code)=>REV08_BASELINE.summary.find(r=>r[0]===code)?.[2]??null;
 const usd=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
 return <section className="p55-panel" style={{border:"2px solid #a5c7d3"}}>
  <div className="p55-eyebrow">L3.B / 10 · INTERNAL BUDGET SHORTCUT · SOURCE-CONTROLLED</div>
  <h2>Budgetary Internal — 4-System Quick View</h2>
  <p className="p55-note">Historical Rev08 customer baseline only. Not a newly reconciled 0553 bid, approved vendor cost or customer release. Existing vendor quotations, A/B/C costing and calculations remain unchanged.</p>
  <div className="p55-metric-grid">
   <div><span>Historical Base A+B (USD)</span><strong>{usd(baseline.base)}</strong></div>
   <div><span>Historical Part A (USD)</span><strong>{usd(baseline.partA)}</strong></div>
   <div><span>Historical Part B (USD)</span><strong>{usd(baseline.partB)}</strong></div>
   <div><span>Known Cisco working vendor cost (THB)</span><strong>{usd(BID_COST_SPINE_0553.knownPreliminaryCost.THB)}</strong></div>
  </div>
  <p className="p55-note">Do not sum the Cisco vendor cost into Rev08: overlapping scope, different currency and quote validity require reconciliation. Optional C1/C2 excluded from base.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>MR</th><th>System</th><th>Rev08 historical system sell (USD) — NOT LNA/unit cost</th><th>Engineering / cost reconciliation</th></tr></thead><tbody>
  {systems.map(([code,mr,name,note])=><tr key={mr}><td>{mr}</td><td>{name}</td><td className="is-number">{usd(historical(code))}</td><td>{note}</td></tr>)}
  <tr><td>MR-0002</td><td>RFI LNA RX3852-2002-11 (product-only)</td><td className="is-number"></td><td>No source quotation received. Datasheet-only: 380–520 MHz, SMA(F), 11–28 VDC. Connector accessories, cable and enclosure require physical design. Blank is unknown, not zero.</td></tr>
  <tr><td>ALL</td><td>Shared bulk A5</td><td className="is-number">{usd(historical("A5"))}</td><td>Source workbook has shared bulk; split quantities by MR using BLD/LAY/DWG, count common items once, preserve historic A5 without double counting</td></tr>
  </tbody></table></div>
  <button type="button" className="p553-detail-button" onClick={()=>setDetails(v=>!v)} aria-expanded={details}>{details?"− Hide":"＋ Show"} mandatory processing 01–08</button>
  {details&&<div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Step</th><th>Module</th><th>Required evidence before revised budget</th></tr></thead><tbody>
   {steps.map(([n,title,description])=><tr key={n}><td>{n}</td><td>{title}</td><td>{description}</td></tr>)}
  </tbody></table></div>}
  <p className="p55-note"><strong>Process gate:</strong> Revised budget values require recorded outputs from all 01–08. No unsupported zero, synthetic vendor quote, inferred bulk quantity or automatic release. Historical reference remains visible even while new costing is incomplete.</p>
 </section>;
}
