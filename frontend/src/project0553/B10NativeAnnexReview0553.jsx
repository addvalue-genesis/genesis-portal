import React from "react";
import {selectB10NativeAnnexReview0553} from "./data/b10NativeAnnexReview0553";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"To be quoted";

export function B10NativeAnnexReview0553({internal=false,onOpenSource=null,variant="release"}){
 const annex=selectB10NativeAnnexReview0553(),official=variant==="official";
 const groups=[...new Set(annex.rows.map(x=>x.mr))];
 return <section className="p553-b10-composition p553-b10-original-annex"
  data-component-key="bid.budget.working.bc.b10.original-annex-item-map.preview"
  data-native-original-sheet="B10 CommSpares"
  data-b10-composition-count={annex.rows.length}>
  <div className="p553-native-title">{annex.standardDocumentHeader}
   {!official&&<small>安装，预试车，试车和开车的备件清单</small>}
  </div>
  <div className="p553-b10-commercial-heading">
   <strong>B10 — Original Annex: Spare Part Schedule</strong>
   <small>Item · Installed TAG · Description · Detail Specification · Materials · Qty · Unit USD · Total USD</small>
  </div>
  <p className="p553-b10-commercial-note">
   {!official?<>
    <strong>Budgetary price breakdown from selected 10.2 Working SELL.</strong>
    {" "}Each of 14 functional spare groups is shown as 1 LOT; Unit USD is a financial allocation
    of the four MR commissioning-kit envelopes, <strong>not an independently quoted OEM
    spare-part rate or confirmed number of physical spare units.</strong>
    {" "}Prices are for pre-award review only, not customer issued.
   </>:<>
    Original Annex line-item spare pricing requires an approved OEM part-number schedule and delivery quantity.
    Final CIF spare unit selling prices are not issued.
   </>}
  </p>
  <div className="p553-b10-commercial-scroll">
   <table className="p553-customer-table p553-b10-native-annex-table" data-b10-original-template="B-I">
    <thead><tr><th rowSpan={2}>Item<br/>序号</th><th rowSpan={2}>Tag No.<br/>位号</th>
     <th rowSpan={2}>Description<br/>描述</th>
     <th rowSpan={2}>Detail Specification<br/>详细规格</th>
     <th rowSpan={2}>Materials<br/>材质</th><th rowSpan={2}>Qty<br/>数量</th>
     <th colSpan={2}>{official?"CIF ZHUHAI PORT — NOT ISSUED":"BUDGETARY WORKING ALLOCATION — USD"}</th></tr>
     <tr><th>UNIT PRICE (USD)<br/>单价</th><th>TOTAL PRICE (USD)<br/>总价</th></tr></thead>
    <tbody>{groups.flatMap(mr=>annex.rows.filter(x=>x.mr===mr).map(x=>
     <tr key={x.id} data-native-b10-source-id={x.id}
      data-b10-requirement-id={x.id} data-parent-source-id={x.parentSourceId}>
      <td><strong>{x.item}</strong></td>
      <td>{x.tag}<small>{x.mr}</small></td>
      <td><strong>{x.description}</strong></td>
      <td>{x.specification}
      </td>
      <td>{x.materials}</td>
      <td className="p553-annex-qty">{official?"—":x.presentationQty}
       {!official&&<small>{x.presentationUnit} (budgetary, not physical SKU Qty)</small>}</td>
      <td className="p553-b10-commercial-number">{official?"To be quoted":money(x.budgetaryUnitPriceUSD)}</td>
      <td className="p553-b10-commercial-number">{official?"To be quoted":money(x.budgetaryTotalUSD)}</td>
     </tr>))}</tbody>
    <tfoot><tr><th colSpan={7}>{
     official?"B10 CIF SPARE SELL TOTAL — OEM UNIT PRICE NOT RELEASED":
     "B10 TOTAL — ALLOCATED CURRENT WORKING BUDGET (USD / NON-ISSUED)"}</th>
     <th>{official?"To be quoted":money(annex.budgetaryPresentationTotalUSD)}</th></tr></tfoot>
   </table>
  </div>
  {internal&&<details className="p55-panel p553-b10-source-trace" style={{padding:12}}>
    <summary><strong>Engineering source / vendor evidence — INTERNAL ONLY</strong>
     <small>14 individual function trace keys · click to 10.2 Source · no duplicate purchasing post</small></summary>
    <div className="p553-b10-commercial-scroll"><table className="p55-table p55-table--compact">
      <thead><tr><th>Function ID</th><th>Stages</th><th>NextG reference / proposed SKU</th><th>Working source</th></tr></thead>
      <tbody>{annex.rows.map(x=><tr key={x.id}>
        <td><code>{x.id}</code></td>
        <td>{x.physicalStageNames.join(" / ")}</td>
        <td>{x.sourceQuoteEvidence.length?x.sourceQuoteEvidence.map(q=>
          <small key={q.id}>{q.sourceQuoteLine} · {q.partNo} · USD {money(q.unitCostUSD)}
           {" "}— expired/unapproved</small>):"No independently priced supplier spare item"}</td>
        <td>{typeof onOpenSource==="function"&&<button type="button" className="p553-detail-button"
         onClick={()=>onOpenSource({code:"B10",sourceId:x.parentSourceId,traceId:x.traceId,
         sourceRowModuleId:x.sourceRowModuleId,sourceModuleId:x.sourceRowModuleId,
         sourceSelectionId:x.id})}>↗ 10.2 Source</button>}</td>
      </tr>)}</tbody>
    </table></div>
   </details>}
  {internal&&<p className="p553-b10-commercial-note">
   10.2 Source financial owner THB {money(annex.selectedMRKitWorkingSellTHB)}
   {" "}÷ approved planning FX {annex.budgetaryPlanningFX} = USD {money(annex.budgetaryPresentationTotalUSD)}.
   Equal functional sharing is a <strong>budget presentation allocation only</strong>;
   replacement OEM SKU/physical spare Qty, CIF/insurance/freight, stock owner and C2 exclusions require separate review.
  </p>}
  <p className="p553-b10-commercial-note">Original purchaser form delivery basis: DDP site.
   Proposed CIF Zhuhai Port, China requires purchaser acceptance of the commercial qualification.
  </p>
  {internal&&typeof onOpenSource==="function"&&<div className="p553-spare-lifecycle-actions">
   {groups.map(mr=>{const x=annex.rows.find(r=>r.mr===mr);return <button type="button" key={mr}
    className="p553-detail-button" onClick={()=>onOpenSource({code:"B10",
     sourceId:x.parentSourceId,traceId:x.traceId,sourceRowModuleId:x.sourceRowModuleId,
     sourceModuleId:x.sourceRowModuleId})}>↗ {mr} · 10.2 Working Source</button>;})}
  </div>}
 </section>;
}
