import React from "react";

// B10 is commercially four MR/kit envelopes today. This is a REFERENCE schedule:
// original D/E vendor SKU evidence displayed at the point the user reads the
// 10.3.3 annex, WITHOUT posting or exporting it as approved purchasable stock.
const number=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"—";
const group=(x)=>x.articleClass.startsWith("RF_FILTER__")||
 x.articleClass.startsWith("POWER_INJECTOR__")||
 x.articleClass.startsWith("POWER_CORD__")?"ACCESSORY_CANDIDATE":
 x.articleClass.startsWith("RADIO_ASSEMBLY__")?"WHOLE_RADIO_CANDIDATE":
 x.articleClass.startsWith("WARRANTY_SERVICE__")?"WARRANTY_NOT_PHYSICAL_STOCK":"LICENCE_NOT_PHYSICAL_STOCK";
const groupOrder=["ACCESSORY_CANDIDATE","WHOLE_RADIO_CANDIDATE","LICENCE_NOT_PHYSICAL_STOCK","WARRANTY_NOT_PHYSICAL_STOCK"];
const label={
 ACCESSORY_CANDIDATE:"Potential spare accessories — 6 quote lines",
 WHOLE_RADIO_CANDIDATE:"Complete radio candidates — capital/ownership review (2)",
 LICENCE_NOT_PHYSICAL_STOCK:"Software/region licences — not physical spare stock (4)",
 WARRANTY_NOT_PHYSICAL_STOCK:"Warranty services — not physical spare stock (4)"
};
const previewTags=(tags)=>Array.isArray(tags)?[...new Set(tags)]:[];

export function B10ReleaseSkuSchedule0553({evidence,priceReview=null,internal=false}){
 if(!evidence)return null;
 const rows=evidence.supplierRows||[];
 if(rows.length!==16||evidence.originalB10WorkingSellTHB!==509827.5)
  throw Error("B10 SKU reference identity/price owner changed");
 const scenarios=new Map((priceReview?.selectedSourceQuoteLines||[]).map(x=>[x.id,x]));
 return <section className="p553-b10-sku-preview" data-component-key="bid.budget.pricing.release.preview.annex.b10.original-item-source"
  aria-label="B10 Original Item / Source and SKU Schedule">
  <div className="p553-b10-sku-heading">
   <div><strong>B10 · Original Item / Source → SKU / Part No. → Related TAG</strong>
    <small>Source-linked item identification · {rows.length} original quote lines; {evidence.supplierQuotedCount} price references · no selected spare purchase quantity yet</small></div>
   <span className="p553-b10-sku-state">PRE-AWARD · NOT ISSUED</span>
  </div>
  <p className="p55-note">The four priced B10 MR kits below are <strong>financial envelopes, not purchasable SKU lines</strong>.
   Source D/E offered quantities are not commissioning spare quantities. OEM interchangeability and Ex/technical suitability are pending.
   {internal?" Displayed USD is the expired NextG vendor reference; review SELL is a nonposting scenario, not the current Release unit price.":" No SKU-level customer price has been approved or issued."}</p>
  <div className="p553-b10-sku-scroll">
   <table className="p55-table p55-table--compact p553-b10-sku-table">
    <thead><tr>
     <th>Original Item / Source</th>
     <th>SKU / Part No.</th>
     <th>Related Installed TAG</th>
     <th>Offered Qty</th>
     <th>B10 Purchase Qty</th>
     {internal&&<th>Vendor Unit USD (expired)</th>}
     <th>{internal?"Review SELL USD/unit":"Customer Unit USD"}</th>
     <th>Evidence / Stock Owner</th>
    </tr></thead>
    <tbody>{groupOrder.flatMap(classKey=>{
     const items=rows.filter(x=>group(x)===classKey);
     return [
      <tr key={classKey} className="p553-b10-sku-group"><th colSpan={internal?8:7}>{label[classKey]}</th></tr>,
      ...items.map(row=>{
       const candidateTags=previewTags(row.candidateInstalledSiteTags);
       const review=scenarios.get(row.id);
       return <tr key={row.id} data-b10-sku-row={row.sourceQuoteLine}
        data-component-key={"bid.budget.pricing.release.preview.annex.b10.original-item-source."+row.sourceQuoteLine.toLowerCase()}>
        <td><strong>{row.articleDescription}</strong>
         <small>{internal?row.vendor+" · "+row.quotation+" · "+row.sourceQuoteLine:
          "Source item "+row.sourceQuoteLine+" · MR-0001"}</small>
         {internal&&<small>Original A/B/C quote line(s): {row.matchedBaseEquipmentQuoteLines.join(", ")||"not evidenced"}</small>}</td>
        <td><code>{row.proposedSku}</code><small>Offered SKU · replacement approval pending</small></td>
        <td>{candidateTags.length?<><strong>{candidateTags.slice(0,2).join("; ")}</strong>
         {candidateTags.length>2&&<details className="p553-b10-sku-tags">
          <summary>View all {candidateTags.length} candidate Site/TAGs</summary>
          <div>{candidateTags.map(tag=><code key={tag}>{tag}</code>)}</div>
         </details>}</>:<span>Not mapped</span>}
         <small>Functional link, not interchangeability proof</small></td>
        <td className="p553-b10-sku-number">{row.vendorOfferedQty}<small>Source quote only</small></td>
        <td><strong>Not verified</strong><small>MR Attachment 5 SPIR</small></td>
        {internal&&<td className="p553-b10-sku-number">{number(row.quotedUnitPriceUSD)}
         <small>{row.quotedUnitPriceUSD===null?"Dash in original quote":"USD; reference only"}</small></td>}
        <td className="p553-b10-sku-number">
         {internal&&review?number(review.indicativeUnitSellUSD):"Not established"}
         <small>{internal&&review?"1.40 what-if; NONPOSTING": "No approved SKU-level release price"}</small></td>
        <td><strong>{classKey==="ACCESSORY_CANDIDATE"?"Evaluate B10 stock":
         classKey==="WHOLE_RADIO_CANDIDATE"?"C1/B10 decision":"Exclude from physical spare count"}</strong>
         <small>Do not count in Part A/B11/C1/C2 twice</small></td>
       </tr>;
      })
     ];
    })}</tbody>
   </table>
  </div>
  <div className="p553-b10-sku-bottom">
   <span>Price owner: B10 · 4 MR kit rows · THB {evidence.originalB10WorkingSellTHB.toLocaleString("en-US",{minimumFractionDigits:2})} unchanged</span>
   <span>Source quote rows = <strong>NONPOSTING</strong> · 10.3.4 / native Excel remain unchanged</span>
  </div>
 </section>;
}
