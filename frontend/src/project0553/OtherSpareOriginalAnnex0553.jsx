import React from "react";
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"Not quoted";
const headings={B11:"SUPPLIER RECOMMENDATION FOR SPECIAL TOOLS",B13:"SUPPLIER RECOMMENDATION FOR CONSUMABLES",
 C1:"SUPPLIER RECOMMENDATION FOR CAPITAL SPARE PARTS",C2:"SUPPLIER RECOMMENDATION FOR 2 YEARS OPERATION SPARE PARTS"};
export function OtherSpareOriginalAnnex0553({code,model,onOpenSource=null,currency="USD"}){
 const rows=model?.rows?.[code],summary=model?.summaries?.[code];
 if(!rows||!summary||!headings[code])throw Error("0553 priced original spare Annex unavailable "+code);
 const option=code==="C1"||code==="C2";
 if(!["USD","THB"].includes(currency)||currency==="THB"&&!option)throw Error("Unsupported spare Annex currency");
 return <section className="p553-b10-original-annex" data-original-spare-annex={code} data-price-status={summary.priceClass}>
  <div className="p553-native-title">{headings[code]}</div>
  <div className="p553-b10-commercial-heading"><strong>{code} — Original Annex · Qty × Unit {currency} = Total {currency}</strong>
   <small>{rows.length} price lines from {option?"Source comparator / superseded historical reference":"selected 10.2 Working financial source"}</small></div>
  <p className="p553-b10-commercial-note">
   {option?<><strong>CONDITIONAL BUDGETARY OFFER — PRICED OPTION.</strong>
    {" "}{code==="C1"?"The amount uses the installed RACON FCA-equipment commercial comparator; it is not a standalone capital-spare supplier quote.":
     "The proposed two-year stock option uses a superseded Rev08 pricing baseline with conditional technical substitutions; actual OEM 2026 rates and B10 duplicate stock exclusion must be verified."}
    {code==="C2"&&" Historical stock includes potential B10 overlaps; the proposed feeder must match the installed size. OEM validation remains required."}
    {" "}These options remain outside the selected A+B quotation.</>:
    <><strong>PRE-AWARD WORKING PRICE BREAKDOWN.</strong>
     {" "}Qty and unit USD derive from the selected {code} Working allowances and reconciled USD Official parent.
     They are budgetary packages, not independently priced certified OEM items.</>}
  </p>
  <div className="p553-b10-commercial-scroll"><table className="p553-customer-table p553-b10-native-annex-table">
   <thead><tr><th>Item</th><th>Tag No.</th><th>Description</th><th>Detail Specification</th>
    <th>Materials</th><th>QTY</th><th>UNIT PRICE ({currency})</th><th>TOTAL PRICE ({currency})</th>
    {option&&<th>Lead time (ARO)</th>}</tr></thead>
   <tbody>{rows.map(row=><tr key={row.id} data-other-spare-source-id={row.id}
     data-parent-source-id={row.sourceId||undefined}>
    <td><strong>{row.item}</strong>
     {typeof onOpenSource==="function"&&<button type="button" className="p553-detail-button"
       title={"Source: "+(row.sourceId||row.historicalSourceId)}
       onClick={()=>onOpenSource(row.sourceId?{
        code,sourceId:row.sourceId,traceId:row.traceId,
        sourceRowModuleId:row.sourceRowModuleId,sourceModuleId:row.sourceRowModuleId
       }:{code,sourceModuleId:"bid.budget.working.bc.c2.priced-budget-review."+row.historicalSourceId.toLowerCase(),
        historicalSourceId:row.historicalSourceId})}>{row.historicalSourceId?"↗ Rev08 Source":"↗ Working Source"}</button>}</td>
    <td>{row.tag}</td><td>{row.description}</td><td>{row.specification}</td><td>{row.materials}</td>
    <td>{row.qty} <small>{row.unit}</small></td><td className="p553-price-cell">{fmt(currency==="THB"?row.unitTHB:row.unitUSD)}</td>
    <td className="p553-price-cell">{fmt(currency==="THB"?row.totalTHB:row.totalUSD)}</td>
    {option&&<td>{row.leadTime}</td>}</tr>)}</tbody>
   <tfoot><tr><th colSpan={7}>TOTAL ({currency}) — {option?"CONDITIONAL BUDGETARY OPTION SELL":"WORKING/RELEASE PRICE, PRE-AWARD"}</th>
    <th className="p553-price-cell">{fmt(currency==="THB"?summary.sourceTHB:summary.totalUSD)}</th>{option&&<th/>}</tr></tfoot>
  </table></div>
  <p className="p553-b10-commercial-note">
   {option?"C1/C2 budgetary option prices are proposed commercially on a conditional basis, not supplier-confirmed OEM prices. They are excluded from Total A+B.":
    "Current selected Working SELL reconciles to 10.3.4 rounded parent. No additional source cost or duplicate posting."}
   {" "}{code==="B11"?"Exhibit A Annex-8 identifies five telecom tool functions; the four MR phase-price packages do not prove five approved independent tool SKUs, and TETRA versus DMR applicability is open.":""}
   {" "}Original purchaser terms are DDP site; proposed CIF Zhuhai Port requires approval. This is not an issued supplier OEM quotation.
  </p>
 </section>;
}
