import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {BOM_READ_MODEL_0553,bomItems0553} from "./data/bomReadModel0553";
import {WORKING_BOM_BY_LOCATION_0553} from "./data/workingBomByLocation";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT PRICED";
const formatKey=x=>String(x||"").toLowerCase().replace(/[^a-z0-9-]/g,"-");
export function PartAWorkingBomReadOnly0553(){
 const [showInternalCost,setShowInternalCost]=useState(true);
 const [selectedSite,setSelectedSite]=useState("ALL");
 const [open,setOpen]=useState({});
 const sites=[...new Set([...BOM_READ_MODEL_0553.sites,...WORKING_BOM_BY_LOCATION_0553.locations.map(l=>l.site)])].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
 const groups=sites.filter(s=>selectedSite==="ALL"||s===selectedSite).map(site=>{
  const canonical=BOM_READ_MODEL_0553.rows.filter(r=>r.site===site&&bomItems0553(r).length);
  const canonicalIds=new Set(canonical.flatMap(r=>bomItems0553(r).map(x=>String(x.row??"")+"|"+String(x.tag??""))));
  const details=canonical.flatMap(r=>bomItems0553(r).map(x=>({mr:r.mr,row:x.row,tag:x.tag,
   description:x.description,qty:x.sourceQty,unit:x.sourceUnit,currency:x.currency,
   unitCost:x.unitCost,extended:x.extended,status:x.status,source:"DETAILED_COST_LEDGER",id:x.id})));
  const supplemental=(WORKING_BOM_BY_LOCATION_0553.locations.find(l=>l.site===site)?.items||[])
   .filter(x=>!canonicalIds.has(String(x.sourceRow??"")+"|"+String(x.sourceTag??"")))
   .map(x=>({mr:"MR-0001",row:x.sourceRow,tag:x.sourceTag,description:x.description,
    qty:x.sourceScopeQty,unit:x.sourceScopeUnit,currency:Number.isFinite(x.indicativePackageCostTHB)?"THB":null,
    unitCost:Number.isFinite(x.indicativePackageCostTHB)&&Number.isFinite(x.sourceScopeQty)&&x.sourceScopeQty>0?x.indicativePackageCostTHB/x.sourceScopeQty:null,extended:x.indicativePackageCostTHB,status:x.workingPriceStatus||x.sourceState,
    source:"WORKING_MTO_SCOPE_PROVISIONAL",id:x.id}));
  const mrGaps=BOM_READ_MODEL_0553.systems.filter(s=>s.id!=="MR-0001").map(mr=>({
   mr:mr.id,name:mr.name,ready:BOM_READ_MODEL_0553.rows.some(r=>r.site===site&&r.mr===mr.id&&bomItems0553(r).length)
  }));
  return {site,items:[...details,...supplemental],mrGaps};
 });
 return <div className="p55-panel" data-component-key="bid.budget.summary.workbook.scope-of-supply.part_a.bom-detail">
  <h4>Part A — All Locations · BOM Working Scope <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.summary.workbook.scope-of-supply.part_a.bom-detail"/></h4>
  <p className="p55-note">Read-only from Working BOM. All indexed locations remain visible. Detailed cost rows take priority; other sites show source MTO working rows without inventing unit prices. Working costs are visible by default only in this INTERNAL REVIEW. They are not customer selling prices or approved Excel mapping.</p>
  <div className="p55-filterbar">
   <label>Location <select value={selectedSite} onChange={e=>setSelectedSite(e.target.value)}><option value="ALL">ALL LOCATIONS ({sites.length})</option>{sites.map(s=><option key={s} value={s}>{s}</option>)}</select></label>
   <label><input type="checkbox" checked={showInternalCost} onChange={e=>setShowInternalCost(e.target.checked)}/> Show confidential working cost (internal only)</label>
  </div>
  {groups.map(group=><div className="p55-panel" key={group.site}>
   <h4><button type="button" className="p55-row-toggle" aria-expanded={open[group.site]!==false} onClick={()=>setOpen(o=>({...o,[group.site]:o[group.site]===false}))}>{open[group.site]===false?"+":"−"}</button> {group.site} · {group.items.length} MTO / detailed scope rows <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.summary.workbook.scope-of-supply.part_a."+formatKey(group.site)}/></h4>
   {open[group.site]!==false&&<>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>MR</th><th>MTO Row</th><th>Tag</th><th>Description</th><th>Qty</th><th>Unit</th>{showInternalCost&&<><th>Currency</th><th>Unit Cost</th><th>Line Cost</th></>}<th>Evidence Status</th><th>Copy ID</th></tr></thead>
     <tbody>{group.items.map((x,i)=><tr key={x.mr+":"+x.id+":"+i}>
      <td>{x.mr}</td><td>{x.row??"—"}</td><td>{x.tag||"—"}</td><td>{x.description}</td><td>{x.qty??"UNKNOWN"}</td><td>{x.unit||"—"}</td>
      {showInternalCost&&<><td>{x.currency||"—"}</td><td>{money(x.unitCost)}</td><td>{money(x.extended)}</td></>}
      <td>{x.source}<small>{x.status}</small></td><td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+formatKey(group.site)+"."+formatKey(x.tag||x.id||"row-"+i)}/></td>
     </tr>)}
     {!group.items.length&&<tr><td colSpan={showInternalCost?11:8}>No indexed source MTO scope for this location; not zero quantity.</td></tr>}
     </tbody></table></div>
    <p className="p55-note">Other systems: {group.mrGaps.map(m=>m.mr+" "+(m.ready?"DETAIL AVAILABLE":"DETAILED BOM NOT YET DERIVED")).join(" · ")}. Current customer selling price is NOT APPROVED.</p>
   </>}
  </div>)}
 </div>;
}
