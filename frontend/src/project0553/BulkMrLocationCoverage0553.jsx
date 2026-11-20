import React,{useState,useEffect} from "react";
import {selectBulkMrLocationCoverage0553} from "./data/bulkMrLocationCoverage0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {MR0002RfRouteReconciliation0553} from "./MR0002RfRouteReconciliation0553";

// Shared 10.1.1.3 and MR0001 MTO Row11 viewer. Price figures are
// evidence only: never participate in the A1-A5 or B/C counted ledger.
const fmt=x=>Number.isFinite(x)?x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
const stateText={
 BOOKED_PARTIAL:"A5 ORIGINAL / PARTIAL",
 VENDOR_INCLUDED:"VENDOR INCLUDED — NON-ADDITIVE",
 ADDVALUE_PROPOSED:"ADDVALUE NEK FIELD BULK — LEGACY PROPOSAL",
 BULK_RESERVE_CANDIDATE:"ADDVALUE NEK — CONDITIONAL BULK SPARE / NOT BOOKED",
 NEEDS_QUANTITY:"QTY / ROUTE REQUIRED",
 NEEDS_RATE:"PRICE EVIDENCE REQUIRED",
 SCOPE_REVIEW:"VERIFY OWNER / INCLUSION",
 OTHER_WBS:"SEPARATE SERVICE / SPARES"
};
const countFmt=(n)=>Number.isFinite(n)?n:"—";
export function BulkMrLocationCoverage0553({mr="MR-0001",site="ALL",state="ALL",detail=false,focusModuleId=null}){
 const [opened,setOpened]=useState({});
 const view=selectBulkMrLocationCoverage0553({mr,site,state});
 const groups=view.groups.filter(g=>state==="ALL"||g.visibleItems.length);
 // Open the exact MR/site group when the project-level Module Navigator targets a
 // nested BULK item or RF circuit. Do not mutate canonical BOM or cost sources.
 useEffect(()=>{
  if(!focusModuleId)return;
  const g=view.groups.find(group=>group.active&&(
    focusModuleId===group.moduleId||
    group.items.some(item=>item.moduleId===focusModuleId)||
    focusModuleId.startsWith("bid.budget.bom."+group.site.toLowerCase()+"."+
      group.mr.toLowerCase().replace("-","")+".rf-")
  ));
  if(g)setOpened(prev=>prev[g.site+"-"+g.mr]?prev:{...prev,[g.site+"-"+g.mr]:true});
 },[focusModuleId,mr,site,state]);
 useEffect(()=>{
  if(!focusModuleId||typeof document==="undefined")return;
  const el=[...document.querySelectorAll("[data-component-key]")].
    find(node=>node.getAttribute("data-component-key")===focusModuleId);
  if(!el)return;
  let cursor=el.parentElement;
  while(cursor){if(cursor.tagName==="DETAILS")cursor.open=true;cursor=cursor.parentElement;}
  el.classList?.add("p553-module-nav-focus");
  el.scrollIntoView?.({block:"center",behavior:"smooth"});
 },[focusModuleId,opened,mr,site,state]);
 const toggle=(key)=>setOpened(prev=>({...prev,[key]:!prev[key]}));
 const title=detail?"Source MTO BULK — engineering material / owner reconciliation":
  "BULK / Installation Materials — "+mr+" / "+(site==="ALL"?"All Locations":site);
 return <section className="p55-panel" data-component-key={detail?"bid.budget.bom."+site.toLowerCase()+".bulk-material.reconciliation":view.moduleId}>
  <h4>{title} <ComponentCopyId projectId="PJ2608-0553" componentKey={detail?"bid.budget.bom."+site.toLowerCase()+".bulk-material.reconciliation":view.moduleId}/></h4>
  <p className="p55-note"><strong>One MR × Location view:</strong> physical field BULK and supplier-included assemblies are separate from priced equipment.
   Only MR0001 has seven booked source A5 partial floors (THB {fmt(view.originalA5BookedTHB)} total — already inside A1/A5 presentation).
   <strong> This page posts THB 0 additional</strong>. A quantity or quote in this table is evidence, not a released purchase or customer sell price.
   Non-applicable MR/Location pairs are not automatically purchased. Current selected supply: MR0002 MGW RF; MR0003 EXION phone/sounder with JB/glands unquoted; MR0004 MDS/ORGA with cable/gland inclusion conflict unresolved. MGW is responsible for functional installed RF cabling as complete-system scope; ADDVALUE NEK is a separate optional installation BULK spare reserve. No automatic replacement, no installation shortfall transfer and no B10/C2 double count.</p>
  <div className="p55-table-wrap p553-module-scroll">
   <table className="p55-table p55-table--compact p55-table--budget">
    <thead><tr><th>+/−</th><th>Location / MR</th><th>Source / Module ID</th><th>BULK functions</th>
      <th>Qty gap</th><th>Rate gap</th><th>Included</th><th>Existing A5 source THB</th></tr></thead>
    <tbody>
    {groups.map(g=>{
      const key=g.site+"-"+g.mr,open=detail||!!opened[key];
      const shown=g.visibleItems;
      return <React.Fragment key={key}>
       <tr data-component-key={detail?g.moduleId+".source-row-detail-mirror":g.moduleId}>
        <td data-component-key={g.moduleId+".bulk-summary"}><button type="button" className="p55-row-toggle" aria-expanded={open} onClick={()=>toggle(key)} disabled={detail}>{open?"−":"+"}</button></td>
        <td><strong>{g.site} / {g.mr}</strong><small>{g.active?"APPLICABLE MR/SITE":"NOT IN MGW SELECTED MR/SITE SCOPE"}</small></td>
        <td><ComponentCopyId projectId="PJ2608-0553" componentKey={g.moduleId} componentName={g.site+" "+g.mr+" BULK Material"}/>
          <small>{g.sourceMtoRow!==null?"Original MR0001 MTO Bulk Row "+g.sourceMtoRow:"Per-system field interface register (no fabricated MTO source row)"}</small></td>
        <td className="is-number">{shown.length} / {g.items.length}<small>{g.scopeReview} owner/inclusion reviews</small></td>
        <td className="is-number">{shown.filter(i=>i.state==="NEEDS_QUANTITY"||(i.state==="BULK_RESERVE_CANDIDATE"&&i.qty===null)).length}</td>
        <td className="is-number">{shown.filter(i=>i.state==="NEEDS_RATE"||(i.state==="BULK_RESERVE_CANDIDATE"&&!Number.isFinite(i.rateTHB))).length}</td>
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
           <td><strong>{stateText[item.state]||item.state}</strong><small>{item.approvedProcurement?"Procurement selected":item.state==="BULK_RESERVE_CANDIDATE"?"SPARE RESERVE — PENDING APPROVAL":"NOT PROCUREMENT-APPROVED"}</small>{item.revisionConflictState&&<small><strong>RF DATASHEET REVISION HOLD — SM000111 Rev6 vs NEK Rev9 (not FORLLER)</strong></small>}</td>
           <td>{item.detail}<small>Evidence: {/^https:/.test(item.source)?<a href={item.source} target="_blank" rel="noopener noreferrer">Open source quotation / manufacturer page</a>:item.source}</small>{item.evidenceFile&&<small><strong>Attached engineering evidence: {item.evidenceFile} / page {item.evidencePage??"?"} / Rev {item.evidenceRevision||"not stated"}</strong></small>}{item.technicalPdfUrl&&<small><a href={item.technicalPdfUrl} target="_blank" rel="noopener noreferrer">NEK manufacturer RF LLF half-inch SHF1 Rev9 PDF — candidate only, not FORLLER certification</a></small>}</td>
          </tr>)}
          {shown.length===0&&<tr><td colSpan={6}>No applicable physical BULK row under this MR / Location / status filter. This is not a confirmed zero-cost allocation; check MR scope.</td></tr>}
         </tbody>
        </table></div>
        {g.mr==="MR-0002"&&g.active&&<MR0002RfRouteReconciliation0553 site={g.site}/>}
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
