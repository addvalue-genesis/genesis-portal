import React from "react";
import { INNOVA_0553_PROVISIONAL_PRICES as data } from "./data/innovaHistoricalBudgetPrices";
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
    <td>{q.lines?.map(l=><div key={l.partNumber||l.description}>{l.partNumber||l.description}: {l.unitPriceExVat.toLocaleString("en-US")} THB / {l.unit}</div>)||"Basket price: item allocation pending"}</td>
    <td>PROVISIONAL BUDGET / REQUOTE PENDING<small>Required Qty / Accepted Cost: OPEN</small></td>
   </tr>)}</tbody>
  </table></div>
 </section>;
}
