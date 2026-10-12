import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {MR0002_WORKING_BOM_0553 as model} from "./data/mr0002WorkingBom0553";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"0.00";
export function MR0002WorkingBom0553(){
 const [open,setOpen]=useState({});
 const [selectedSite,setSelectedSite]=useState("ALL");
 const visibleSites=model.sites.filter(g=>selectedSite==="ALL"||g.site===selectedSite);
 return <section className="p55-panel" data-component-key="bid.budget.bom.mr0002">
  <h3>MR-0002 · DMR Trunk Radio Working BOM <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.mr0002"/></h3>
  <p className="p55-note">Working source: RFI selected equipment; MGW/HYTERA quotation retained as unselected reference + management RFI LNA THB 500,000 per unit + controlled DTRS bulk calculation. MGW Yagi (UHF-2), Omni (UHF-3) and 100m feeder with six connectors (UHF-4) are budgeted per site. HYTERA BDA (UHF-1) excluded. Existing RF bulk calculation is reused; duplicate feeder and connectors excluded. RFI LNA THB 500,000 per tagged site is provisional. Other interface accessories remain cost gaps. LNA rate does not imply approved quantity. MGW UHF-4 feeder kit is budget-selected once; overlapping field feeder and connector are excluded from additional totals pending interface reconciliation.</p>
  <div className="p55-filterbar" style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
   <label>Location <select aria-label="MR-0002 Location" value={selectedSite} onChange={e=>setSelectedSite(e.target.value)}>
    <option value="ALL">All locations ({model.sites.length})</option>
    {model.sites.map(g=><option key={g.site} value={g.site}>{g.site}</option>)}
   </select></label>
   <button type="button" onClick={()=>setOpen(Object.fromEntries(visibleSites.map(g=>[g.site,true])))}>＋ Expand all locations</button>
   <button type="button" onClick={()=>setOpen({})}>− Collapse all locations</button>
   <strong>{visibleSites.map(g=>g.site).join(" · ")}</strong>
  </div>
  <p className="p55-note">ครบ {model.sites.length} Location จาก Z1F TEL-LAY Rev.C1; ตารางแสดงต้นทุนเบื้องต้น USD และ THB แยกสกุลเงิน · คลิก + ของแต่ละ Location เพื่อเปิดรายการ Tag</p>
  {visibleSites.map(group=><div className="p55-panel" key={group.site}>
   <h4><button type="button" className="p55-row-toggle" onClick={()=>setOpen(x=>({...x,[group.site]:!x[group.site]}))}>{open[group.site]?"−":"+"}</button> {group.site} · Working USD {money(group.controlledTotalUSD)} + THB {money(group.controlledTotalTHB)} · incomplete accessories
   <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom.mr0002."+group.site.toLowerCase()}/></h4>
   {open[group.site]&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Tag / Item</th><th>SKU / Description</th><th>Qty</th><th>Original Currency</th><th>Unit Rate</th><th>Extended</th><th>Owner / Evidence</th><th>Status</th><th>Copy ID</th></tr></thead>
    <tbody>{group.items.map(item=><tr key={item.id}><td>{item.tag}</td><td>{item.sku||"—"}<small>{item.description}</small></td>
     <td>{item.qty??"PENDING"} {item.unit}</td><td>{item.currency||"TBC"}</td><td>{money(item.unitCost)}</td>
     <td>{item.countedInWorkingTotal?money(item.extended):"EXCLUDED / PENDING"}</td><td>{item.owner}<small>{item.source}</small></td><td>{item.status}</td>
     <td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom.mr0002."+group.site.toLowerCase()+"."+item.id.toLowerCase()}/></td></tr>)}</tbody></table></div>}
   <p className="p55-note">{group.scopeWarnings.join(" · ")}</p>
  </div>)}
  <p className="p55-note">This is the controlled derivation workbench, not a persisted in-browser price editor. Changes to supplier rate, approved site quantity and configuration must update source-controlled inputs; downstream views read this same dataset. No customer release.</p>
 </section>;
}