import React from "react";
import {selectSparePricedBudgetReview0553} from "./data/sparePricedBudgetReview0553";
const m=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"Not established";
const unit=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"Not established";
export function SparePricedBudgetReview0553({code,onOpenSource=null,context="working"}){
 const review=selectSparePricedBudgetReview0553();
 if(!review.codes.includes(code))return null;
 const rows=review.rows[code],onlyHistorical=code==="C2",onlyComparable=code==="C1";
 return <details className="p55-panel p553-spare-priced-review" data-component-key={"bid.budget.working.bc."+code.toLowerCase()+".priced-budget-review"}
  style={{padding:12}} open={context==="working"}>
  <summary><strong>{code} — Quantity × Unit Price · Original Annex format (INTERNAL REVIEW)</strong>
   <small>{rows.length} line(s) · estimated THB {m(review.totals[code])} · NOT CUSTOMER RELEASE</small></summary>
  <p className="p55-note"><strong>{onlyHistorical?"HISTORICAL Rev08 USD → THB PRICE REFERENCE ONLY":
    onlyComparable?"INSTALLED RACON FCA COMPARABLE, NOT AN OEM CAPITAL-SPARE PRICE":
    "SELECTED 10.2 WORKING PARAMETRIC SELL (OEM TOOL/CONSUMABLE SKU STILL OPEN)"}</strong>.
   This table exposes a price review for every line, not permission to issue it. It uses existing
   source Qty and existing rate; C2's Rev08 prices are not independent 2026 DDP quotations.
   Do not count any B10/C2 identical physical stock twice or substitute B11/B3 temporary testers.</p>
  <div className="p553-sheet-scroll"><table className="p553-customer-table p553-annex-table" data-budget-price-review={code}>
   <thead><tr><th>Item</th><th>Tag No.</th><th>Description</th><th>Detail Specification / Source</th><th>Materials</th>
    <th>QTY</th><th>Unit THB · budgetary</th><th>Total THB · budgetary</th>{code.startsWith("C")&&<th>Lead time</th>}</tr></thead>
   <tbody>{rows.map((r,i)=><tr key={r.id} data-source-pricing-line={r.id}
    data-component-key={context==="working"&&code==="C2"?"bid.budget.working.bc.c2.priced-budget-review."+r.id.toLowerCase():undefined}>
     <td>{i+1}</td><td>{r.tag}</td><td><strong>{r.description}</strong></td>
     <td>{r.specification}<small>{r.sourceDocument}</small></td><td>{r.materials}</td>
     <td className="p553-annex-qty">{r.quantity} {r.unit}</td>
     <td className="p553-price-cell">{unit(r.unitPriceTHB)}</td>
     <td className="p553-price-cell">{m(r.extendedTHB)}</td>
     {code.startsWith("C")&&<td>{r.leadTime||"Not established"}</td>}
    </tr>)}
    <tr className="p553-sheet-total"><td colSpan={7}>BUDGETARY SOURCE REFERENCE — NOT VERIFIED DDP CUSTOMER OFFER</td>
     <td>{m(review.totals[code])}</td>{code.startsWith("C")&&<td/>}</tr>
   </tbody></table></div>
  {typeof onOpenSource==="function"&&rows.some(r=>r.sourceRowModuleId)&&<div>
   {rows.filter(r=>r.sourceRowModuleId).map(r=><button key={r.id} className="p553-detail-button"
     type="button" onClick={()=>onOpenSource({code,sourceId:r.sourceId,traceId:r.traceId,
      sourceRowModuleId:r.sourceRowModuleId,sourceModuleId:r.sourceRowModuleId})}>
     ↗ 10.2 Source {r.sourceId}</button>)}
  </div>}
  <p className="p55-note">{code==="C2"?"These 12 historical rates support the conditional C2 budgetary offer. The proposed feeder must match the installed system; B10 identical stock must be excluded before firm issue. Original historical descriptions are retained here as evidence.":
    code==="C1"?"The C1 conditional budgetary option uses installed-equipment FCA price × 31.5 × 1.30. It is excluded from Base A+B; independent OEM spare compatibility and CIF delivery price remain unconfirmed.":
    "Quantity and rate are from the existing 10.2 Working financial owner, still pending itemized OEM SKU and delivery evidence."}</p>
 </details>;
}
