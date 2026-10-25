import React from "react";
import {selectB10NativeAnnexReview0553} from "./data/b10NativeAnnexReview0553";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"Not quoted";
export function B10NativeAnnexReview0553({internal=false,onOpenSource=null,variant="release"}){
 const annex=selectB10NativeAnnexReview0553();
 const byMR=[...new Set(annex.rows.map(x=>x.mr))];
 return <section className="p553-b10-composition p553-b10-original-annex"
  data-component-key={"bid.budget."+(variant==="official"?"pricing.official":variant==="release"?"pricing.release.preview":variant==="scope"?"scope":"pricing.budgetary")+".b10.original-annex-item-map"}
  data-native-original-sheet="B10 CommSpares"
  data-b10-composition-count={annex.rows.length}>
  <div className="p553-native-title">{annex.standardDocumentHeader}
   {variant!=="official"&&<small>安装，预试车，试车和开车的备件清单</small>}
  </div>
  <div className="p553-b10-commercial-heading">
   <strong>B10 — Equipment composition / Spare-Part Coverage</strong>
   <small>Original Item / Source → Tag → Description → Detail Specification / Part No. → Materials → Qty → Unit USD → Total USD; {annex.rows.length} items, no 13-row clipping</small>
  </div>
  <p className="p553-b10-commercial-note"><strong>Delivery basis:</strong> {annex.commercialOfferTerm}.
   Original purchaser form says DDP site; changing that contractual term requires a commercial qualification/acceptance.
   <strong> No source unit rate below is a CIF B10 Spare SELL.</strong>
   The source Qty means quoted installed/optional units; B10 purchase Qty is still unverified.
   OEM SPIR Attachment 5 and cross-check against Part A/C1/C2 remain mandatory.</p>
  <div className="p553-b10-commercial-scroll"><table className="p553-customer-table p553-b10-native-annex-table">
   <thead><tr><th rowSpan={2}>Item<br/>序号</th><th rowSpan={2}>Tag No.<br/>位号</th>
    <th rowSpan={2}>Description<br/>描述</th>
    <th rowSpan={2}>Detail Specification<br/>Part No. / 原始报价</th>
    <th rowSpan={2}>Materials / Owner<br/>材质</th>
    <th rowSpan={2}>Qty<br/>数量</th>
    <th colSpan={2}>{internal?"SOURCE QUOTE REFERENCE — NOT CIF SELL":"CIF ZHUHAI PORT — USD OFFER PENDING"}</th></tr>
    <tr><th>UNIT PRICE (USD)</th><th>TOTAL PRICE (USD)</th></tr>
   </thead>
   <tbody>{byMR.flatMap(mr=>annex.rows.filter(x=>x.mr===mr).map(x=><tr key={x.id}
    data-native-b10-source-id={x.id} data-parent-source-id={x.parentSourceId}
    data-b10-requirement-id={x.isRequirementFamily?x.id:undefined}>
    <td><strong>{x.item}</strong></td>
    <td>{x.tag}<small>{x.mr}</small></td>
    <td>{x.description}</td>
    <td><strong>{x.partNo||"OEM SPIR Part No. pending"}</strong>
     <small>{x.specification}</small>
     {internal&&<small>Original Item / Source: {x.originalItemSource}</small>}
     {internal&&x.referenceCurrency==="THB"&&<small>Original source THB {money(x.referenceUnit)} @ planning FX {annex.sourceFXTHBPerUSD}</small>}
    </td>
    <td>{x.owner}</td>
    <td>{internal&&Number.isFinite(x.referenceQty)?x.referenceQty:"TBC"}
     <small>{internal&&Number.isFinite(x.referenceQty)?"Original quote Qty only; B10 spare Qty TBC":"B10 purchase Qty not verified"}</small>
    </td>
    <td className="p553-b10-commercial-number">{internal?money(x.referenceUnitUSD):"To be quoted"}
     {internal&&<small>Source COST/installed reference, NOT SELL</small>}</td>
    <td className="p553-b10-commercial-number">{internal?money(x.referenceExtendedUSD):"To be quoted"}</td>
   </tr>))}</tbody>
   <tfoot><tr><th colSpan={7}>Total CIF B10 purchaser offer (USD): NOT QUOTED — source reference values are not additive spare prices</th>
    <th>To be quoted</th></tr></tfoot>
  </table></div>
  {internal&&<p className="p553-b10-commercial-note">
   Original reference monetary total (multiple installed and optional quotes) USD {money(annex.sourceTotalUSD)} —
   <strong> NONPOSTING / NOT A B10 COST OR CIF SELL TOTAL.</strong> 14 required MR-spare function reviews remain OEM-unpriced.
   Source quotation rates include different delivery bases and cannot be relabelled CIF simply by changing the heading.
  </p>}
  {internal&&typeof onOpenSource==="function"&&<div className="p553-spare-lifecycle-actions">
   {byMR.map(mr=>{const x=annex.rows.find(row=>row.mr===mr);return <button key={mr} className="p553-detail-button"
    type="button" onClick={()=>onOpenSource({code:"B10",sourceId:x.parentSourceId,traceId:x.traceId,
     sourceRowModuleId:x.sourceRowModuleId,sourceModuleId:x.sourceRowModuleId})}>↗ {mr} · 10.2 Source</button>;})}
  </div>}
 </section>;
}