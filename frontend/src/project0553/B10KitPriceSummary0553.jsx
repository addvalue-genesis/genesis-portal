import React from "react";

// Commercial-only view of EXISTING B10 source row identities.
// Never turn vendor source candidate quote lines into released SKU stock.
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"To be quoted";
const unique=xs=>[...new Set((xs||[]).filter(Boolean))];

export function B10KitPriceSummary0553({
 rows=[], currency="THB", total=null, internal=false,
 onOpenSource=null,onOpenReleaseRow=null,variant="release"
}){
 if(rows.length!==4||new Set(rows.map(x=>x.sourceId||x.id)).size!==4)
  throw Error("0553 B10 kit summary must retain exactly four distinct source-owned MR lines");
 const canonical=["MR-0001","MR-0002","MR-0003","MR-0004"];
 const normalized=rows.map((r,i)=>{
  const mr=unique(r.mr||r.linkedMR||[]);
  const currentMr=mr[0]||(canonical[i]);
  if(currentMr!==canonical[i])throw Error("B10 kit summary MR row identity/order changed");
  const qty=r.qty;
  // Budgetary/Scope are canonical 10.2 source rows; Release and Official
  // are projections with distinct field names. This is a READ adapter only.
  const isSourceRow=variant==="scope"||variant==="budgetary";
  const unit=currency==="USD"?r.unitUSD:isSourceRow?r.unitPriceTHB:r.customerUnitTHB;
  const amount=currency==="USD"?r.totalUSD:isSourceRow?r.extendedTHB:r.customerTotalTHB;
  if(!Number.isFinite(unit)||!Number.isFinite(amount))
   throw Error("0553 B10 missing "+currency+" price field in "+variant+" for "+(r.sourceId||r.id));

  const id=r.sourceId||r.id;
  return {row:r,mr:currentMr,qty,unit,amount,id,
   description:r.displayDescription||r.description,sites:unique(r.sites||r.linkedLocations||[]),
   sourceRowModuleId:r.sourceRowModuleId||("bid.budget.working.bc.b10.spare-line."+id.toLowerCase())};
 });
 if(normalized.reduce((n,r)=>n+r.qty,0)!==14||
  normalized.some((r,i)=>r.qty!==[4,3,4,3][i]))
  throw Error("0553 B10 MR commissioning kit quantities diverged from source");
 if(Number.isFinite(total)&&Math.abs(normalized.reduce((sum,r)=>sum+r.amount,0)-total)>0.02)
  throw Error("0553 B10 source-to-release kit totals do not reconcile");
 return <section className="p553-b10-commercial-summary" data-component-key={variant==="scope"?"bid.budget.scope.b10.kit-summary":
    variant==="budgetary"?"bid.budget.pricing.budgetary.annex.b10.kit-summary":
    currency==="USD"?"bid.budget.pricing.official.b10.kit-summary":"bid.budget.pricing.release.preview.annex.b10.kit-summary"}
    data-source-reconciliation="B10_SOURCE_RELEASE_SOURCE">
  <div className="p553-b10-commercial-heading">
   <strong>B10 — Kit price summary / reconciliation</strong>
   <small>4 MR-level financial envelopes · 4/3/4/3 commissioning spare sets · same source-owned prices, no added SKU charges</small>
  </div>
  <div className="p553-b10-commercial-scroll">
   <table className={"p553-b10-commercial-table"+(internal?" p553-b10-commercial-table--internal":"")}>
    <thead><tr><th>MR / Item</th><th>Description</th><th>Qty (kit)</th>
     <th>Unit Price ({currency})</th><th>Amount ({currency})</th>{internal&&<th>Source</th>}</tr></thead>
    <tbody>{normalized.map((r,i)=><tr key={r.id}
      data-source-id={r.id}
      data-source-row-module-id={r.sourceRowModuleId}
      data-component-key={(variant==="release"?"bid.budget.pricing.release.preview.annex.b10.":
        variant==="scope"?"bid.budget.scope.b10.spare-line.":
        variant==="budgetary"?"bid.budget.pricing.budgetary.annex.b10.":"bid.budget.pricing.official.annex.b10.")+
        (variant==="scope"?r.id.toLowerCase():r.id.toLowerCase())}>
      <td><strong>{r.mr}</strong><small>Item {i+1}</small></td>
      <td>{r.description}<small>{r.sites.length?r.sites.join(", "):"Commissioning spare kit per MR"}</small></td>
      <td className="p553-b10-commercial-number">{r.qty}</td>
      <td className="p553-b10-commercial-number">{money(r.unit)}</td>
      <td className="p553-b10-commercial-number"><strong>{money(r.amount)}</strong></td>
      {internal&&<td>{typeof onOpenSource==="function"&&
       <button className="p553-detail-button" type="button"
        onClick={()=>onOpenSource({code:"B10",sourceId:r.id,sourceRowModuleId:r.sourceRowModuleId,
         sourceModuleId:r.sourceRowModuleId,traceId:r.row.traceId||"B10::"+r.id})}>↗ 10.2 Source</button>}
       {typeof onOpenReleaseRow==="function"&&
        <button className="p553-detail-button" type="button" onClick={()=>onOpenReleaseRow({
         code:"B10",sourceId:r.id,sourceRowModuleId:r.sourceRowModuleId})}>↗ 10.3 Release</button>}
      </td>}
     </tr>)}</tbody>
    <tfoot><tr><th colSpan={4}>B10 Total ({currency}) · same financial owner, counted once</th>
     <th className="p553-b10-commercial-number">{money(total)}</th>{internal&&<th/>}</tr></tfoot>
   </table>
  </div>
  <p className="p553-b10-commercial-note">Original Item / Source evidence, related installed TAGs and OEM SKU validation remain in 10.2 Working.
   This summary is for price presentation only; kit quantities are not itemized SKU purchase quantities.</p>
 </section>;
}
