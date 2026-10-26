import React from "react";
import {selectB10NativeAnnexReview0553} from "./data/b10NativeAnnexReview0553";

const cash=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"Not quoted";
export function B10NativeAnnexReview0553({internal=false,onOpenSource=null,variant="release"}){
 const annex=selectB10NativeAnnexReview0553();
 const byMR=[...new Set(annex.rows.map(x=>x.mr))];
 return <section className="p553-b10-composition p553-b10-original-annex"
   data-component-key="bid.budget.working.bc.b10.original-annex-item-map.preview"
   data-native-original-sheet="B10 CommSpares"
   data-b10-composition-count={annex.rows.length}>
  <div className="p553-native-title">{annex.standardDocumentHeader}
   {variant!=="official"&&<small>安装，预试车，试车和开车的备件清单</small>}
  </div>
  <div className="p553-b10-commercial-heading">
   <strong>B10 — Erection / Pre-commissioning / Commissioning / Start-up Spare Part Selection</strong>
   <small>14 MR Attachment-5 spare functions mapped to installed TAGs — not Part A installed-equipment purchase lines</small>
  </div>
  <p className="p553-b10-commercial-note">
   Source: MR0001–0004 §5 / Attachment 5, Required BOM, SPE §8.1 and the applicable Exhibit A Annex-8.
   Four commissioning kit requirements (4/3/4/3) do not specify 14 physical SKUs or their individual quantities.
   <strong> Qty/Unit Price must be confirmed by OEM SPIR and selected Working before customer issue.</strong>
  </p>
  <div className="p553-b10-commercial-scroll"><table className="p553-customer-table p553-b10-native-annex-table" data-b10-original-template="B-I">
   <thead><tr><th rowSpan={2}>Item<br/>序号</th><th rowSpan={2}>Tag No.<br/>位号</th>
    <th rowSpan={2}>Description<br/>描述</th>
    <th rowSpan={2}>Detail Specification<br/>详细规格</th>
    <th rowSpan={2}>Materials<br/>材质</th>
    <th rowSpan={2}>QTY<br/>数量</th>
    <th colSpan={2}>CIF Zhuhai Port — proposed (USD)</th></tr>
    <tr><th>UNIT PRICE (USD)</th><th>TOTAL PRICE (USD)</th></tr></thead>
   <tbody>{byMR.flatMap(mr=>annex.rows.filter(x=>x.mr===mr).map(x=><tr key={x.id}
      data-native-b10-source-id={x.id} data-b10-requirement-id={x.id}
      data-parent-source-id={x.parentSourceId}>
     <td><strong>{x.item}</strong></td>
     <td>{x.tag}<small>{x.mr}</small></td>
     <td><strong>{x.description}</strong><small>{x.physicalStageNames.join(" / ")}</small></td>
     <td>{x.specification}<small>{x.why}</small>
      {internal&&<><small>Original Item / Source: {x.originalItemSource}</small>
       {x.sourceQuoteEvidence.length>0&&<details className="p553-spare-lifecycle-sub">
        <summary>Original quote evidence (NOT CIF B10 price)</summary>
        {x.sourceQuoteEvidence.map(q=><small key={q.id}>
         {q.sourceQuoteLine} · {q.partNo} · offered Qty {q.vendorOfferedQty} · vendor reference USD {cash(q.unitCostUSD)}
         {q.quoteExpired?" · expired":""} · NOT APPROVED SPARE SKU</small>)}
       </details>}</>}
     </td>
     <td>{x.materials}</td><td className="p553-annex-qty">TBC<small>OEM per-type spare Qty, NOT kit count</small></td>
     <td className="p553-b10-commercial-number">To be quoted</td>
     <td className="p553-b10-commercial-number">To be quoted</td>
    </tr>))}</tbody>
    <tfoot><tr><th colSpan={7}>Total CIF B10 Spare SELL (USD) — NOT QUOTED (OEM SPIR quantity/unit rate pending)</th>
     <th>To be quoted</th></tr></tfoot>
  </table></div>
  <p className="p553-b10-commercial-note"><strong>Delivery / contract check:</strong> {annex.commercialOfferTerm}.
   The original purchaser form requests DDP site; do not silently relabel a supplier FCA/DDP installed price as CIF spare sell.
   C2 must exclude proven same spare lines per MR Attachment 7 para.6.
  </p>
  {internal&&<p className="p553-b10-commercial-note">
   <strong>Nonposting financial bridge:</strong> 4 MR financial kit envelopes in 10.2 total THB {cash(annex.selectedMRKitWorkingSellTHB)}.
   This is an unallocated, unverified B10 budget — it is NOT an item-level CIF USD quote.
   Vendor quotation Qty and rates belong to evidence, not native B10 purchasing quantity or customer price fields.
  </p>}
  {internal&&typeof onOpenSource==="function"&&<div className="p553-spare-lifecycle-actions">
   {byMR.map(mr=>{const x=annex.rows.find(row=>row.mr===mr);return <button key={mr} type="button"
    className="p553-detail-button" onClick={()=>onOpenSource({code:"B10",
      sourceId:x.parentSourceId,traceId:x.traceId,
      sourceRowModuleId:x.sourceRowModuleId,sourceModuleId:x.sourceRowModuleId})}>
     ↗ {mr} · 10.2 Working Source</button>;})}
  </div>}
 </section>;
}