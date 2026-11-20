import React from "react";
import { INNOVA_0553_PROVISIONAL_PRICES as data } from "./data/innovaHistoricalBudgetPrices";
import { MR0001_INNOVA_COST_BRIDGE as bridge } from "./data/mr0001InnovaCostBridge";
export function InnovaBudgetEvidence0553(){
 return <section className="p55-panel">
  <div className="p55-eyebrow">BULK / GLANDS / CAT6A · PROVISIONAL BUDGET PRICE</div>
  <h4>INNOVA 2024 source THB quotation — budget reference / requote pending</h4>
  <p className="p55-note">These quoted THB amounts are usable as preliminary budget reference. They are not approved 0553 quantities, no three totals are automatically summed, and no source basket price is allocated to a site without verified scope.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Source / date</th><th>Original quotation scope</th><th>Source subtotal before VAT</th><th>Selected unit rate evidence</th><th>Budget status</th></tr></thead>
   <tbody>{data.quotations.map(q=><tr key={q.number}>
    <td><a href={q.url} target="_blank" rel="noreferrer">{q.number}</a><small>{data.sourceDate}</small></td>
    <td>{q.scope}</td><td className="is-number">{q.originalSubtotalExVat.toLocaleString("en-US",{minimumFractionDigits:2})} THB</td>
    <td>{q.lines?.map(l=><div key={l.partNumber||l.description}>{l.partNumber||l.description}: {(Number.isFinite(l.unitPriceExVat)?l.unitPriceExVat.toLocaleString("en-US"):"N/A (UNPRICED)")} THB / {l.unit}</div>)||"Basket price: item allocation pending"}</td>
    <td>PROVISIONAL BUDGET / REQUOTE PENDING<small>Required Qty / Accepted Cost: OPEN</small></td>
   </tr>)}</tbody>
  </table></div>
  <h4>Functional BOM → INNOVA rate candidates</h4>
  <p className="p55-note">One price can be a candidate for multiple MTO locations without counting its cost multiple times. The CAT6A 305m box is an alternative reference and must not be treated as RF coax feeder; RF gland size must match cable OD / Ex approval.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
  <thead><tr><th>Site / Function</th><th>Provisional rate candidates</th><th>Required Qty</th><th>Provisional cost</th><th>Scope gate</th></tr></thead>
  <tbody>{bridge.candidates.map(x=><tr key={x.componentId}>
   <td>{x.site}<small>{x.functionId}</small></td>
   <td>{x.evidence.join(" / ")||"Source basket only — item pricing review"}</td>
   <td>OPEN</td><td>OPEN · QTY HOLD</td><td>{x.status}</td>
  </tr>)}</tbody></table></div>
  <h4>Source unit rates</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
  <thead><tr><th>Quotation</th><th>Part / Description</th><th>Quote Unit</th><th>Unit Price THB ex VAT</th><th>Scope</th></tr></thead>
  <tbody>{bridge.rateLines.map(x=><tr key={x.id}><td>{x.quote}</td><td>{x.sku}<small>{x.description}</small></td><td>{x.unit}{x.packLengthM?" / "+x.packLengthM+" m":""}</td><td>{x.rateTHB.toLocaleString("en-US")}</td><td>{x.status}</td></tr>)}</tbody>
  </table></div>
 </section>;
}
