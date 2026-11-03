import React from "react";

// This is the B10 "what is inside the system?" evidence breakdown.
// It is NOT a separately posted B10 physical-spare SKU quote.
const val=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"Not established";
export function B10CompositionBreakdown0553({composition,internal=false,onOpenSource=null,mode="release"}){
 if(!composition)return null;
 if(composition.parentRows.length!==3||composition.deliveredCommissioningKits!==11)
  throw Error("B10 composition must retain 3 selected MR financial owners and 11 commissioning kits");
 const ids=new Set(composition.parentRows.map(x=>x.sourceId));
 if(ids.size!==3||composition.installedComponents.some(x=>!ids.has(x.parentSourceId)))
  throw Error("B10 composition orphaned from Source");
 return <section className="p553-b10-composition" data-component-key="bid.budget.working.bc.b10.physical-composition.preview"
  data-b10-composition-count={composition.installedComponents.length}>
  <div className="p553-b10-commercial-heading">
   <strong>B10 — Equipment composition / Spare-Part Coverage</strong>
   <small>What each telecom system consists of · Installed Part A vs B10 start-up spare stock separated · Source-driven, no extra line price</small>
  </div>
  <p className="p553-b10-commercial-note">Original customer Annex B10 is blank, with 13 physical item rows. Customer MR requires
   1 commissioning spare kit per platform, but not automatically one spare ODU, IDU or Cisco switch.
   The quoted unit cost below is <strong>installed equipment reference only</strong>, not the B10 spare purchase/selling price.
   OEM SPIR Attachment 5 must confirm exact spare Part No., Qty and independently justified B10 cost.</p>
  {composition.parentRows.map(parent=><details key={parent.sourceId} className="p553-b10-composition-group" open={parent.mr==="MR-0001"}>
    <summary><strong>{parent.mr} — {parent.sites.join(", ")}</strong>
     <span>{parent.kitQty} commissioning kit sets · financial envelope {val(parent.workingSellTHB)} THB</span></summary>
    <div className="p553-b10-commercial-scroll"><table className="p553-b10-composition-table">
     <thead><tr>
      <th>Original Item / Source</th><th>Equipment / Spare Function</th><th>Make / Model / Part No.</th>
      <th>Original Quote Qty</th>{internal&&<th>Installed Quote Unit Price</th>}
      <th>B10 Purchase Qty</th><th>B10 Spare Unit Sell</th><th>Ownership / Verification</th>
     </tr></thead>
     <tbody>{composition.installedComponents.filter(x=>x.mr===parent.mr).map(x=><tr key={x.id}
       data-b10-composition-id={x.id} data-parent-source-id={x.parentSourceId}>
       <td><strong>{x.group}</strong><small>{x.source}</small></td>
       <td>{x.item}</td><td><code>{x.sku||"OEM Part No. pending"}</code></td>
       <td>{Number.isFinite(x.referenceQty)?x.referenceQty:"TBC"}<small>{x.installedQuantityMeaning}</small></td>
       {internal&&<td>{x.referenceUnitPrice===null?"Not quoted":x.referenceCurrency+" "+val(x.referenceUnitPrice)}
        <small>Part A / spare option reference, NOT B10 price</small></td>}
       <td>Not established</td><td>Not established</td>
       <td><strong>{x.owner==="PART_A_INSTALLED_REFERENCE_NOT_B10_SPARE"?"Part A installed reference":x.owner==="B10_SPARE_CANDIDATE_NOT_SELECTED"?"B10/C1 candidate only":"OEM spare/IDU proof pending"}</strong>
        <small>{x.evidence}</small></td>
      </tr>)}
      {composition.requiredSpareFamilies.filter(x=>x.parentSourceId===parent.sourceId).map(x=><tr key={x.id}
       className="p553-b10-composition-unpriced" data-b10-requirement-id={x.id} data-parent-source-id={x.parentSourceId}>
       <td><strong>MR Attachment 5 / SPIR</strong><small>{x.source}</small></td>
       <td>{x.item}</td><td>To be confirmed</td><td>—</td>
       {internal&&<td>—</td>}<td>Not established</td><td>Not established</td>
       <td>Required functional spare review<small>Physical OEM replacement SKU, required Qty and separate unit price unavailable</small></td>
      </tr>)}
     </tbody></table></div>
    {internal&&typeof onOpenSource==="function"&&<button type="button" className="p553-detail-button"
      onClick={()=>onOpenSource({code:"B10",sourceId:parent.sourceId,traceId:parent.traceId,
       sourceRowModuleId:parent.sourceRowModuleId,sourceModuleId:parent.sourceRowModuleId})}>
      ↗ 10.2 Working Source · {parent.mr}</button>}
  </details>)}
  <p className="p553-b10-commercial-note"><strong>Source / Release gate:</strong> Selected parent Source IDs B10-PTTEP-01..03; RACON B10-PTTEP-04 is owner-excluded.
   The component rows are supporting evidence, not additive commercial lines. The excluded RACON allowance is removed from B10 totals and native Excel.
   Outstanding: OEM SPIR per unit and equipment function, DDP quotation, stock ownership and Attachment-7 C2 de-duplication.</p>
 </section>;
}
