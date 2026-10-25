import React from "react";

// Source-only B10 physical candidate drilldown. Never render this in an
// official customer quote or use its old vendor price as current SELL.
const amount=(n,ccy)=>Number.isFinite(n)?ccy+" "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NO QUOTED PRICE";
const status=s=>s==="VENDOR_DASH__PRICE_UNKNOWN"?"Vendor dash / price unavailable":
 s==="SEPARATELY_QUOTED_SERVICE_OR_ENTITLEMENT__NOT_B10_PHYSICAL_STOCK"?"Not physical B10 stock":"Physical candidate / B10 allocation not approved";

export function B10ItemizedPurchasingEvidence0553({evidence,context="working"}){
 if(!evidence)return null;
 return <details className="p55-panel p553-b10-purchasing-evidence" open={context==="working"} data-component-key={evidence.moduleId} style={{padding:12}}>
  <summary><strong>B10 — Itemized quoted SKU / TAG / quantity / unit-price evidence</strong>
   <small>{evidence.supplierRows.length} quoted line identities, {evidence.supplierQuotedCount} with price; full purchase scope NOT established</small></summary>
  <p className="p55-note"><strong>Source:</strong> {evidence.sourceQuote} · supplier quote dated 16 Sep 2026, expired 1 Oct 2026.
   D and E are distinct NextG optional spare-stock groupings; they do not establish the contents of 14 contractual commissioning kits. No sale, cost, inventory or duplicate charge is posted from this evidence.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Source / MR</th><th>Selected Working SELL THB</th><th>Original kit Qty</th><th>Contents verified</th></tr></thead>
   <tbody>{evidence.budgetEnvelopeRows.map(x=><tr key={x.id}>
    <td><strong>{x.id}</strong><small>{x.mr} / {x.locations.join(", ")}</small></td>
    <td>{amount(x.workingTotalSellTHB,"THB")}</td><td>{x.contractKitCount} sets</td><td>NO — itemized OEM SPIR still required</td>
   </tr>)}</tbody></table></div>
  <h4>B10 purchasable article breakdown — source requirement by physical function</h4>
  <p className="p55-note"><strong>These 14 rows are article families, NOT 14 spare units or proven OEM procurement SKUs.</strong> Each parent 4/3/4/3 kit value is counted once above; every sub-item is nonposting until a make/model/part no., exact site TAG, approved purchase Qty and separate supplier rate have been evidenced.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>MR / Parent source</th><th>Physical article/function</th><th>Actual site/TAG candidates</th><th>OEM part number / SKU</th><th>Physical purchase Qty</th><th>Unit price THB</th><th>Vendor quote link / readiness</th></tr></thead>
   <tbody>{evidence.requirementArticleRows.map(x=><tr key={x.id} data-b10-requirement-id={x.id}>
    <td><strong>{x.parentB10PriceId}</strong><small>{x.mr} · {x.id}</small></td>
    <td>{x.articleFunction}</td>
    <td>{x.actualInstalledTagCandidates.length?
     <details><summary>{x.actualInstalledTagCandidates.length} actual site/TAG references</summary>
      <div>{x.actualInstalledTagCandidates.map(tag=><div key={tag}><code>{tag}</code></div>)}</div>
     </details>:"TAG cross-reference pending"}
     <small>Functional only; not proven interchangeable</small></td>
    <td>NOT SELECTED<small>{x.selectedModel||"OEM model to verify"}</small></td>
    <td>NOT VERIFIED</td><td>NOT ESTABLISHED</td>
    <td>{x.skuCandidateQuoteIds.length?x.skuCandidateQuoteIds.join(", "):"No current SKU quote link"}<small>{x.scopeEvidenceClass}</small></td>
   </tr>)}</tbody>
  </table></div>
  {["D","E"].map(group=>{
   const rows=evidence.supplierRows.filter(x=>x.sourceGroup===group);
   return <details key={group} className="p55-panel" open={context==="working"} style={{padding:10}}>
    <summary><strong>{group} — {group==="D"?"Base-station":"Remote-terminal"} spare offer</strong>
     <small>{rows.length} supplier lines · quoted quantity is NOT the approved purchase quantity</small></summary>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>Quote line</th><th>Physical product / licence / service</th><th>OEM Part No.</th><th>Related installed TAG (candidate)</th><th>Offered Qty</th><th>B10 purchase Qty</th><th>Unit USD quote</th><th>Budget THB equivalent/unit</th><th>Price / ownership gate</th></tr></thead>
     <tbody>{rows.map(x=><tr key={x.id} data-b10-source-id={x.id} data-component-key={evidence.moduleId+"."+x.id.toLowerCase()}>
      <td><code>{x.sourceQuoteLine}</code><small>{x.mr}</small></td>
      <td><strong>{x.articleDescription}</strong><small>{x.articleClass}</small></td>
      <td><code>{x.proposedSku}</code><small>Quote SKU, spare interchangeability OPEN</small><small>Same SKU in installed A/B/C quote lines: {x.matchedBaseEquipmentQuoteLines.join(", ")||"not listed"}</small></td>
      <td>{x.candidateInstalledSiteTags.length?
       <details><summary>{x.candidateInstalledSiteTags.length} source Site/TAG candidates</summary>
        <div>{x.candidateInstalledSiteTags.map(tag=><div key={tag}><code>{tag}</code></div>)}</div>
       </details>:"No verified equipment TAG match"}
       <small>{x.installedTagRelation}</small></td>
      <td>{x.vendorOfferedQty}</td><td><strong>TBC</strong><small>Not the vendor offered qty</small></td>
      <td>{amount(x.quotedUnitPriceUSD,"USD")}</td>
      <td>{Number.isFinite(x.referenceUnitTHB)?amount(x.referenceUnitTHB,"THB"):"—"}</td>
      <td><strong>{status(x.status)}</strong><small>{x.potentialCategoryConflict}</small></td>
     </tr>)}</tbody>
    </table></div>
   </details>;
  })}
  <p className="p55-note"><strong>Scope separation before re-budget:</strong> 6 quoted accessory candidate lines total {amount(evidence.proposedB10AccessoriesUSD,"USD")} (RF filter, DC PoE injector and North American power cord, all compatibility/qty pending). Two complete radio assemblies total {amount(evidence.capitalRadioCandidateUSD,"USD")} and are capital-spare candidates, NOT automatically B10 consumables. The remaining 8 quote lines represent software region/capacity entitlement and warranty selections totaling {amount(evidence.softwareAndWarrantyUSD,"USD")} across 6 priced and 2 dash entries; not physical B10 spare hardware.</p>
  <p className="p55-note"><strong>Commercial collision:</strong> current B10 selected Working SELL {amount(evidence.originalB10WorkingSellTHB,"THB")} is based on hypothetical cost {amount(evidence.originalB10ReferenceCostTHB,"THB")}. NextG's separately quoted D/E priced lines total {amount(evidence.quotedSpareGroupUSD,"USD")} ({amount(evidence.quotedSpareGroupTHB,"THB")} at planning FX31.5) before any technical/inclusion checks; the whole offer exceeds the current cost envelope. It cannot be added, apportioned to kits or presented as a ready purchase.</p>
  <p className="p55-note"><strong>Cross-owner control:</strong> repeated D/E SKU families: {evidence.repeatedSkusAcrossSpareGroups.join(", ")||"none"}. A1 equipment, B10 commissioning stock, B11 licences, C1 replacement units and C2 2-year stock must have separate evidenced physical quantity. Quote lines for warranty and licences are not automatically B10 spare hardware. MR0002–MR0004 have no equivalent individually quoted B10 spare schedule in this evidence.</p>
 </details>;
}
