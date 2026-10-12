import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {BOM_READ_MODEL_0553,bomItems0553} from "./data/bomReadModel0553";
import {deriveWorkingCostReview0553,convertWorkingAmount0553,summarizeWorkingItems0553,WORKING_FX_POLICY_0553} from "./data/workingCostReview0553";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"0.00";
const formatKey=x=>String(x||"").toLowerCase().replace(/[^a-z0-9-]/g,"-");
export function PartAWorkingBomReadOnly0553({displayCurrency="THB",fx=WORKING_FX_POLICY_0553}){
 const [showInternalCost,setShowInternalCost]=useState(true);
 const [selectedSite,setSelectedSite]=useState("ALL");
 const [open,setOpen]=useState({});
 const report=deriveWorkingCostReview0553(displayCurrency,fx);
 const a1={items:report.items};
 const showSum=s=>s.original.map(v=>v.currency+" "+money(v.amount)).join(" · ")||"0.00 (PENDING)";
 const sites=[...new Set([...BOM_READ_MODEL_0553.sites,...a1.items.map(x=>x.site)])].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
 const groups=sites.filter(site=>selectedSite==="ALL"||site===selectedSite).map(site=>{
  const items=a1.items.filter(x=>x.site===site);
  const mrGaps=BOM_READ_MODEL_0553.systems.filter(m=>!items.some(x=>x.mr===m.id)).map(m=>m.id);
  return {site,items,mrGaps};
 });
 return <div className="p55-panel" data-component-key="bid.budget.summary.workbook.scope-of-supply.part_a.bom-detail">
  <h4>Part A — All Locations · BOM Working Scope <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.summary.workbook.scope-of-supply.part_a.bom-detail"/></h4>
  <p className="p55-note">Read-only from the SAME A1 projection used by workbook Row 7. Quote-rate candidates do not enter site totals until selected; ZWP8 partial scenario is visible but excluded from additive totals. All indexed locations remain visible. Detailed cost rows take priority; other sites show source MTO working rows without inventing unit prices. Missing prices are displayed as 0.00 for management inspection only (not stored as zero, not included in totals). RFI LNA uses an explicit management temporary-zero decision with no assumed site quantity or vendor currency. Working costs are visible by default only in this INTERNAL REVIEW. They are not customer selling prices or approved Excel mapping.</p>
  <p className="p55-note"><strong>Part A known cost:</strong> {showSum(report.partA)} · Converted {displayCurrency}: {money(report.partA.converted)} {report.partA.unconverted>0&&"(FX MISSING)"} · Pending {report.partA.pending} / {report.partA.count} (NOT COST COMPLETE). B/C and project totals await controlled cost mapping.</p>
  <div className="p55-filterbar">
   <label>Location <select value={selectedSite} onChange={e=>setSelectedSite(e.target.value)}><option value="ALL">ALL LOCATIONS ({sites.length})</option>{sites.map(s=><option key={s} value={s}>{s}</option>)}</select></label>
   <label><input type="checkbox" checked={showInternalCost} onChange={e=>setShowInternalCost(e.target.checked)}/> Show confidential working cost (internal only)</label>
  </div>
  {groups.map(group=><div className="p55-panel" key={group.site}>
   <h4><button type="button" className="p55-row-toggle" aria-expanded={open[group.site]!==false} onClick={()=>setOpen(o=>({...o,[group.site]:o[group.site]===false}))}>{open[group.site]===false?"+":"−"}</button> {group.site} · {group.items.length} rows · {showSum(summarizeWorkingItems0553(group.items,displayCurrency,fx))} · Converted {displayCurrency} {money(summarizeWorkingItems0553(group.items,displayCurrency,fx).converted)} <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.summary.workbook.scope-of-supply.part_a."+formatKey(group.site)}/></h4>
   {open[group.site]!==false&&<>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>MR</th><th>MTO Row</th><th>Tag</th><th>Description</th><th>Qty</th><th>Unit</th>{showInternalCost&&<><th>Currency</th><th>Unit Cost</th><th>Line Cost</th><th>Converted ({displayCurrency})</th></>}<th>Source Price Evidence / Gap</th><th>Evidence Status</th><th>Copy ID</th></tr></thead>
     <tbody>{group.items.map((x,i)=><tr key={x.mr+":"+x.id+":"+i}>
      <td>{x.mr}</td><td>{x.row??"—"}</td><td>{x.tag||"—"}</td><td>{x.description}</td><td>{x.qty??"UNKNOWN"}</td><td>{x.unit||"—"}</td>
      {showInternalCost&&<><td>{x.currency==="UNASSIGNED"?"TBC":x.currency||"—"}</td><td>{money(x.unitCost)}{!Number.isFinite(x.unitCost)&&<small>DISPLAY 0 · RATE NOT MAPPED</small>}</td><td>{money(x.extended)}{!Number.isFinite(x.extended)&&<small>DISPLAY 0 · SOURCE NOT MAPPED</small>}</td><td>{money(convertWorkingAmount0553(x.extended,x.currency,displayCurrency,fx))}{!Number.isFinite(convertWorkingAmount0553(x.extended,x.currency,displayCurrency,fx))&&<small>PENDING / FX</small>}</td></>}
      <td>{x.priceCandidates?.length?x.priceCandidates.map(v=><div key={v.quote+v.line}>
       {v.quote} · {v.line} · {v.currency} {money(v.unitPrice)} / quoted unit
       <small>Candidate only — not allocated to site BOM</small>
      </div>):x.allocationClass==="PARTIAL_SCENARIO_NOT_APPROVED"?
       "Source-backed partial scenario; excluded from total":Number.isFinite(x.extended)?"Allocated working rate":"SOURCE PRICE NOT MAPPED"}</td>
      <td>{x.source}<small>{x.status}</small>{x.managementAllowance&&<small>MANAGEMENT THB 500,000 / UNIT · NOT VENDOR QUOTED · QTY PENDING</small>}</td><td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+formatKey(group.site)+"."+formatKey(x.tag||x.id||"row-"+i)}/></td>
     </tr>)}
     {!group.items.length&&<tr><td colSpan={showInternalCost?13:9}>No indexed source MTO scope for this location; not zero quantity.</td></tr>}
     </tbody></table></div>
    <p className="p55-note"><strong>Location coverage:</strong> {summarizeWorkingItems0553(group.items,displayCurrency,fx).known} costed / {group.items.length} lines · {summarizeWorkingItems0553(group.items,displayCurrency,fx).pending} pending. <strong>Per MR:</strong> {BOM_READ_MODEL_0553.systems.map(m=>{const total=summarizeWorkingItems0553(group.items.filter(x=>x.mr===m.id),displayCurrency,fx);return m.id+" "+showSum(total)+" ("+total.pending+" pending)";}).join(" · ")}</p>
    <p className="p55-note">Other systems: {group.mrGaps.map(m=>m+" DETAILED BOM NOT DERIVED").join(" · ")||"All indexed MR entries with scope evidence displayed"}. Current customer selling price is NOT APPROVED.</p>
   </>}
  </div>)}
 </div>;
}
