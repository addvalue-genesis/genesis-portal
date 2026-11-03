import React from "react";
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"N/A";
const headings={B11:"SPECIAL TOOLS FOR OPERATION AND MAINTENANCE",B13:"CONSUMABLES",
 C1:"CAPITAL SPARE PARTS",C2:"TWO YEARS OPERATION SPARE PARTS"};
export function OtherSpareOriginalAnnex0553({code,model,onOpenSource=null,currency="USD",internal=false}){
 const rows=model?.rows?.[code],summary=model?.summaries?.[code];
 if(!rows||!summary||!headings[code])throw Error("0553 spare Annex unavailable "+code);
 const option=code==="C1"||code==="C2";
 if(!["USD","THB"].includes(currency)||currency==="THB"&&!option&&code!=="B13")throw Error("Unsupported spare Annex currency");
 return <section className="p553-b10-original-annex" data-original-spare-annex={code} data-price-status={summary.priceClass}>
  <div className="p553-native-title">{headings[code]}</div>
  {summary.excluded?<p>N/A — Not separately quoted. Tools expressly included in the equipment supply remain included.</p>:<>
  <div className="p553-b10-commercial-scroll"><table className="p553-customer-table p553-b10-native-annex-table">
   {code==="C2"&&<colgroup>{[6,17,16,24,12,5,7,7,6].map((width,i)=><col key={i} style={{width:width+"%"}}/>)}</colgroup>}
   <thead><tr><th>Item</th><th>Tag No. / Reference site</th><th>Description</th><th>Detail Specification</th>
    <th>Materials</th><th>QTY</th><th>UNIT PRICE ({currency})</th><th>TOTAL PRICE ({currency})</th>
    {option&&<th>Lead time (ARO)</th>}</tr></thead>
   <tbody>{rows.map(row=><tr key={row.id} data-other-spare-source-id={row.id} data-parent-source-id={row.sourceId||undefined}>
    <td><strong>{row.item}</strong>{typeof onOpenSource==="function"&&<button type="button" className="p553-detail-button"
     onClick={()=>onOpenSource(row.sourceId?{code,sourceId:row.sourceId,selectionId:row.sourceSelectionId,traceId:row.traceId,
      sourceRowModuleId:row.sourceRowModuleId,sourceModuleId:row.sourceRowModuleId}:
      {code,sourceModuleId:"bid.budget.working.bc.c2.priced-budget-review."+row.historicalSourceId.toLowerCase(),historicalSourceId:row.historicalSourceId})}>↗ Source</button>}</td>
    <td>{row.tag}</td><td>{row.description}</td><td>{row.specification}</td><td>{row.materials}</td>
    <td>{row.qty} <small>{row.unit}</small></td><td className="p553-price-cell">{fmt(currency==="THB"?row.unitTHB:row.unitUSD)}</td>
    <td className="p553-price-cell">{fmt(currency==="THB"?row.totalTHB:row.totalUSD)}</td>
    {option&&<td>{row.leadTime}</td>}</tr>)}</tbody>
   <tfoot><tr><th colSpan={7}>TOTAL ({currency})</th><th className="p553-price-cell">{fmt(currency==="THB"?summary.sourceTHB:summary.totalUSD)}</th>{option&&<th/>}</tr></tfoot>
  </table></div>
  {code==="B13"&&internal&&<details className="p553-c1c2-engineering-review" data-b13-internal-reference="true">
   <summary>INTERNAL ONLY — Equipment TAG references for B13</summary>
   <p>Reference equipment only. COMMON quantities are shared stock, not quantity per TAG. This table is excluded from customer previews and Excel.</p>
   <table className="p553-customer-table"><thead><tr><th>Ref.</th><th>Reference equipment TAG</th><th>Site(s)</th><th>System</th></tr></thead>
    <tbody>{(summary.tagSchedule||[]).map((group,i)=><tr key={group.mr+group.sites.join("/")} data-b13-tag-group={i+1}>
     <td>{i+1}</td><td>{group.tags.join("; ")}</td><td>{group.sites.join(", ")}</td><td>{group.mr} / {group.system}</td>
    </tr>)}</tbody></table>
  </details>}
  {option&&<p className="p553-b10-commercial-note">Optional spares; excluded from Total A+B. TAGs identify reference equipment; quantities are shared project stock, not quantity per TAG. Final configuration and delivery terms subject to agreement.</p>}
  </>}
 </section>;
}
