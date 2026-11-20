import React from "react";
import { MR0001_WORKING_PRICED_BOM as bom } from "./data/mr0001WorkingPricedBom";
const thb=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"PENDING";
export function WorkingPricedBom0553(){
 const removed=new Set(bom.cisco.removedItems.map(x=>x.quoteLine));
 return <section className="p55-panel" data-component-key="bid.budget.bom.mr0001.cisco-tc0001">
  <div className="p55-eyebrow">MR0001 WORKING PRICED BOM · TC-0001 ITEM 13 · ENGINEERING REVISION</div>
  <h3>Cisco IE3400 — 8 RJ45 PoE + 2 SFP, without expansion module</h3>
  <p className="p55-note">The revised Trunk Radio design requests an 8-port Layer 3 switch. Keep IE-3400-8P2S-E, its quoted PSU, software, DNA licence and main-switch SmartNet. Remove IEM-3300-8T= and expansion-module SmartNet from the five-site working cost. Original VST A-0048/2026 Rev.1 quotation remains unchanged as source evidence.</p>
  <div className="p55-source-facts">
   <div><span>Source MTO rows</span><strong>{bom.sourceRowCount}</strong></div>
   <div><span>Cisco LAN sets / sites</span><strong>{bom.cisco.sourceScopeSets} / {bom.cisco.siteCount}</strong></div>
   <div><span>Original VST quote (ex VAT)</span><strong>{thb(bom.cisco.sourceTotalTHB)}</strong></div>
   <div><span>8-port revised working cost (ex VAT)</span><strong>{thb(bom.cisco.indicativeExtendedTHB)}</strong></div>
   <div><span>Reduction, not extra credit (ex VAT)</span><strong>{thb(bom.cisco.removedTotalTHB)}</strong></div>
  </div>
  <p className="p55-note"><strong>Engineering gate: {bom.cisco.engineeringGate}.</strong> Confirm physical port assignments (including spare capacity), PoE demand versus the quoted 65W PSU, and required Layer 3 features/licences at ZWP20/21/22/23 and ZWP8. No OEM compliance, quotation refresh or customer Working Sell approval is implied.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Site</th><th>MTO TAG</th><th>Qty</th><th>Working configuration</th><th>Unit cost</th><th>Working extended</th><th>Approval status</th></tr></thead>
   <tbody>{bom.items.map(x=><tr key={x.id}>
    <td>{x.site}</td><td><strong>{x.sourceTag}</strong><small>{x.description}</small></td>
    <td>{x.sourceQtyText||"REVIEW"}</td>
    <td>{x.bomType==="L3_SWITCH_CISCO_BUNDLE_CANDIDATE"?bom.cisco.specification:"Physical composition open"}</td>
    <td>{x.indicativePackageCostTHB!==null?thb(bom.cisco.unitPackageQuotedSumTHB):"RATE PENDING"}</td>
    <td>{x.indicativePackageCostTHB!==null?thb(x.indicativePackageCostTHB):"UNPRICED"}</td>
    <td>{x.costStatus}</td>
   </tr>)}</tbody>
  </table></div>
  <h4>Retained Cisco quotation lines — one 8-port LAN assembly</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>VST line</th><th>SKU</th><th>Source qty</th><th>Unit THB ex VAT</th><th>Five-unit THB ex VAT</th></tr></thead>
   <tbody>{bom.cisco.items.map(q=><tr key={q.quoteLine}>
    <td>{q.quoteLine}</td><td>{q.sku}</td><td>{q.quoteQty}</td>
    <td>{thb(q.unitPrice)}</td><td>{thb(q.unitPrice*q.quoteQty)}</td>
   </tr>)}</tbody>
  </table></div>
  <h4>Excluded by TC-0001 — original quotation preserved for audit</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>VST line</th><th>SKU</th><th>Original qty</th><th>Original unit THB</th><th>Removed working THB</th><th>Decision</th></tr></thead>
   <tbody>{bom.cisco.originalQuoteItems.filter(q=>removed.has(q.quoteLine)).map(q=><tr key={q.quoteLine}>
    <td>{q.quoteLine}</td><td>{q.sku}</td><td>{q.quoteQty}</td>
    <td>{thb(q.unitPrice)}</td><td>{thb(q.unitPrice*q.quoteQty)}</td><td>EXCLUDED FROM WORKING PACKAGE; NOT DELETED FROM ORIGINAL QUOTE</td>
   </tr>)}</tbody>
  </table></div>
  <p className="p55-note">Original quote {thb(bom.cisco.sourceTotalTHB)} = revised working scenario {thb(bom.cisco.indicativeExtendedTHB)} + excluded expansion and service {thb(bom.cisco.removedTotalTHB)}. The VST source quotation is expired and MGW pricing may differ. No automatic change to WBS or customer selling price.</p>
 </section>;
}
