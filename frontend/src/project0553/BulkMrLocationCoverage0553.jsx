import React,{useState} from "react";
import {selectBulkMrLocationCoverage0553} from "./data/bulkMrLocationCoverage0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";

// Shared 10.1.1.3 and MR0001 MTO Row11 viewer. Price figures are
// evidence only: never participate in the A1-A5 or B/C counted ledger.
const fmt=x=>Number.isFinite(x)?x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const stateText={
 BOOKED_PARTIAL:"A5 ORIGINAL / PARTIAL",
 VENDOR_INCLUDED:"VENDOR INCLUDED — NON-ADDITIVE",
 NEEDS_QUANTITY:"QTY / ROUTE REQUIRED",
 NEEDS_RATE:"PRICE EVIDENCE REQUIRED",
 SCOPE_REVIEW:"VERIFY OWNER / INCLUSION",
 OTHER_WBS:"SEPARATE SERVICE / SPARES"
};
const countFmt=(n)=>Number.isFinite(n)?n:"—";
export function BulkMrLocationCoverage0553({mr="MR-0001",site="ALL",state="ALL",detail=false}){
 const [opened,setOpened]=useState({});
 const view=selectBulkMrLocationCoverage0553({mr,site,state});
 const groups=view.groups.filter(g=>state==="ALL"||g.visibleItems.length);
 const toggle=(key)=>setOpened(prev=>({...prev,[key]:!prev[key]}));
 const title=detail?"Source MTO BULK — engineering material / owner reconciliation":
  "BULK / Installation Materials — "+mr+" / "+(site==="ALL"?"All Locations":site);
 return <section className="p55-panel" data-component-key={detail?"bid.budget.bom."+site.toLowerCase()+".bulk-material.reconciliation":view.moduleId}>
  <h4>{title} <ComponentCopyId projectId="PJ2608-0553" componentKey={detail?"bid.budget.bom."+site.toLowerCase()+".bulk-material.reconciliation":view.moduleId}/></h4>
  <p className="p55-note"><strong>One MR × Location view:</strong> physical field BULK and supplier-included assemblies are separate from priced equipment.
   Only MR0001 has seven booked source A5 partial floors (THB {fmt(view.originalA5BookedTHB)} total — already inside A1/A5 presentation).
   <strong> This page posts THB 0 additional</strong>. A quantity or quote in this table is evidence, not a released purchase or customer sell price.
   Non-applicable MR/Location pairs are not automatically purchased. Selected MR0002–MR0004 source: MGW P26-058_R2 combined.</p>
  <div className="p55-table-wrap p553-module-scroll">
   <table className="p55-table p55-table--compact p55-table--budget">
    <thead><tr><th>+/−</th><th>Location / MR</th><th>Source / Module ID</th><th>BULK functions</th>
      <th>Qty gap</th><th>Rate gap</th><th>Included</th><th>Existing A5 source THB</th></tr></thead>
    <tbody>
    {groups.map(g=>{
      const key=g.site+"-"+g.mr,open=detail||!!opened[key];
      const shown=g.visibleItems;
      return <React.Fragment key={key}>
       <tr data-component-key={g.moduleId+".bulk-summary"}>
        <td><button type="button" className="p55-row-toggle" aria-expanded={open} onClick={()=>toggle(key)} disabled={detail}>{open?"−":"+"}</button></td>
        <td><strong>{g.site} / {g.mr}</strong><small>{g.active?"APPLICABLE MR/SITE":"NOT IN MGW SELECTED MR/SITE SCOPE"}</small></td>
        <td><ComponentCopyId projectId="PJ2608-0553" componentKey={g.moduleId} componentName={g.site+" "+g.mr+" BULK Material"}/>
          <small>{g.sourceMtoRow!==null?"Original MR0001 MTO Bulk Row "+g.sourceMtoRow:"Per-system field interface register (no fabricated MTO source row)"}</small></td>
        <td className="is-number">{shown.length} / {g.items.length}<small>{g.scopeReview} owner/inclusion reviews</small></td>
        <td className="is-number">{shown.filter(i=>i.state==="NEEDS_QUANTITY").length}</td>
        <td className="is-number">{shown.filter(i=>i.state==="NEEDS_RATE").length}</td>
        <td className="is-number">{shown.filter(i=>i.state==="VENDOR_INCLUDED").length}</td>
        <td className="is-number">{Number.isFinite(g.bookedA5THB)?fmt(g.bookedA5THB):"N/A"}<small>{g.mr==="MR-0001"?"Reclassified once / NOT additive":"No source A5 posting"}</small></td>
       </tr>
       {open&&<tr data-component-key={g.moduleId+".bulk-material-detail"}><td colSpan={8}>
        <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
         <thead><tr><th>Physical BULK / Item ID</th><th>Qty / Unit</th><th>Unit Rate / Price Basis</th><th>Cost Owner / Vendor</th><th>Gap / Inclusion Status</th><th>Engineering Evidence / Next Action</th></tr></thead>
         <tbody>
          {shown.map(item=><tr key={item.id} data-component-key={item.moduleId}>
           <td><strong>{item.item}</strong><small>{item.id} · {item.category}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={item.moduleId} componentName={item.item}/></td>
           <td className="is-number">{countFmt(item.qty)} <small>{item.unit}</small>{item.derivedCandidateQty!==undefined&&item.derivedCandidateQty!==null&&item.derivedCandidateQty!==item.qty&&<small>Independent parametric check: {item.derivedCandidateQty} — NOT booked</small>}</td>
           <td className="is-number">{Number.isFinite(item.rateTHB)?"THB "+fmt(item.rateTHB):item.state==="VENDOR_INCLUDED"?"INCLUDED / NO EXTRA RATE":"NOT ESTABLISHED"}
            {Number.isFinite(item.existingBookedTHB)&&<small>A5 source THB {fmt(item.existingBookedTHB)} — NOT extra</small>}</td>
           <td>{item.owner}<small>{item.state==="VENDOR_INCLUDED"?"Selected MGW package or original factory owner":"Confirm physical owner before working-cost revision"}</small></td>
           <td><strong>{stateText[item.state]||item.state}</strong><small>{item.approvedProcurement?"Procurement selected":"NOT PROCUREMENT-APPROVED"}</small>{item.revisionConflictState&&<small><strong>RF DATASHEET REVISION HOLD — SM000111 Rev6 vs NEK Rev9 (not FORLLER)</strong></small>}</td>
           <td>{item.detail}<small>Evidence: {/^https:/.test(item.source)?<a href={item.source} target="_blank" rel="noopener noreferrer">Open source quotation / manufacturer page</a>:item.source}</small>{item.evidenceFile&&<small><strong>Attached engineering evidence: {item.evidenceFile} / page {item.evidencePage??"?"} / Rev {item.evidenceRevision||"not stated"}</strong></small>}{item.technicalPdfUrl&&<small><a href={item.technicalPdfUrl} target="_blank" rel="noopener noreferrer">NEK manufacturer RF LLF half-inch SHF1 Rev9 PDF — candidate only, not FORLLER certification</a></small>}</td>
          </tr>)}
          {shown.length===0&&<tr><td colSpan={6}>No applicable physical BULK row under this MR / Location / status filter. This is not a confirmed zero-cost allocation; check MR scope.</td></tr>}
         </tbody>
        </table></div>
        <p className="p55-note">Unresolved amount remains NULL. The displayed Qty/Price is separate engineering evidence. No original TAG cost, MGW included component, A5, B/C or customer price changes here.</p>
       </td></tr>}
      </React.Fragment>;
    })}
    {groups.length===0&&<tr><td colSpan={8}>No BULK rows match the selected MR, Location and status. Clear BULK status to see the complete register.</td></tr>}
    </tbody>
   </table>
  </div>
  {!detail&&<p className="p55-note">Filtering is shared with 10.1.1.2 System / Location / BULK Status. The 10.1.1.3 equipment MTO count continues to mean original source TAGs, not an approved physical cable or accessory count. Engineering cable-end/register verification is required before procurement.</p>}
 </section>;
}
