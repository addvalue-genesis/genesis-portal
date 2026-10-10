import React from "react";
import { MR0001_WORKING_PRICED_BOM as bom } from "./data/mr0001WorkingPricedBom";
export function WorkingPricedBom0553(){
 return <section className="p55-panel">
  <div className="p55-eyebrow">MR0001 WORKING PRICED BOM · ENGINEERING SCENARIO</div>
  <h3>Source quantities and preliminary priced Cisco network bundle</h3>
  <p className="p55-note">Source MTO Set counts are documentary scope, not physical SKU counts. Cisco 5-set bundle is a traceable quotation scenario (not approved design); original THB cost excludes VAT and is not customer sell. Other equipment remains shown even where OEM take-off is pending.</p>
  <div className="p55-source-facts">
   <div><span>MTO source rows</span><strong>{bom.sourceRowCount}</strong></div>
   <div><span>Item tags incl split</span><strong>{bom.sourceItemCount}</strong></div>
   <div><span>Cisco LAN source sets</span><strong>{bom.cisco.sourceScopeSets} / {bom.cisco.siteCount} sites</strong></div>
   <div><span>Cisco provisional source cost</span><strong>THB {bom.cisco.indicativeExtendedTHB.toLocaleString("en-US")}</strong></div>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Site</th><th>MTO tag</th><th>MTO scope qty</th><th>Source state</th><th>Provisional bundle</th><th>Source unit cost</th><th>Indicative extended</th><th>Required proof</th></tr></thead>
   <tbody>{bom.items.map(x=><tr key={x.id}>
    <td>{x.site}</td><td><strong>{x.sourceTag}</strong><small>{x.description}</small></td>
    <td>{x.sourceQtyText||"REVIEW"}</td><td>{x.sourceState}</td>
    <td>{x.bomType==="L3_SWITCH_CISCO_BUNDLE_CANDIDATE"?"Cisco IE3400 equipment + power + licence + SmartNet bundle":"Physical composition OPEN"}</td>
    <td>{x.indicativePackageCostTHB!==null?"THB "+bom.cisco.unitPackageQuotedSumTHB.toLocaleString("en-US"):"SOURCE RATE/CONFIG OPEN"}</td>
    <td>{x.indicativePackageCostTHB!==null?"THB "+x.indicativePackageCostTHB.toLocaleString("en-US"):"UNPRICED IN THIS SCENARIO"}</td>
    <td>{x.costStatus}</td>
   </tr>)}</tbody></table></div>
  <h4>Cisco — 11 original quote codes per preliminary LAN package</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Vendor code</th><th>Part Number</th><th>Source Qty</th><th>Original unit THB</th><th>Five-unit extended THB</th></tr></thead>
   <tbody>{bom.cisco.items.map(q=><tr key={q.quoteLine}>
    <td>{q.quoteLine}</td><td>{q.sku}</td><td>{q.quoteQty}</td>
    <td>{Number.isFinite(q.unitPrice)?q.unitPrice.toLocaleString("en-US"):"N/A"}</td>
    <td>{Number.isFinite(q.unitPrice)?(q.unitPrice*q.quoteQty).toLocaleString("en-US"):"N/A"}</td>
   </tr>)}</tbody></table></div>
  <p className="p55-note">The five-set Cisco package scenario reconciles to its THB {bom.cisco.sourceTotalTHB.toLocaleString("en-US")} quote subtotal, subject to technology/quantity/licence verification. No zero assumed for unpriced MR components and no Customer Release.</p>
 </section>;
}
