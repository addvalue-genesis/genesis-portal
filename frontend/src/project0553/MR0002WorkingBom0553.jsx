import React,{useState} from "react";
import {RfFeederEvidence0553} from "./RfFeederEvidence0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {MR0002_WORKING_BOM_0553 as model} from "./data/mr0002WorkingBom0553";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
export function MR0002WorkingBom0553({fx=null}){
 const [open,setOpen]=useState({});
 const validFx=Number.isFinite(fx?.thbPerUsd)&&fx.thbPerUsd>0;
 const thb=(n,c)=>!Number.isFinite(n)?"PENDING":c==="THB"?"THB "+money(n):c==="USD"&&validFx?"THB "+money(n*fx.thbPerUsd):"FX REQUIRED";
 const siteThb=g=>validFx?g.controlledTotalTHB+g.controlledTotalUSD*fx.thbPerUsd:null;
 const itemModuleId=item=>"bid.budget.bom.mr0002."+item.site.toLowerCase()+"."+item.id.toLowerCase();
 const includedPrice=item=>item.priceInclusion&&item.parentPackage?("INCLUDED IN "+(item.quoteLine||"VENDOR PACKAGE")+" · "+(validFx?"Package THB "+money((item.quoteLine==="UHF-1"?31474:227)*fx.thbPerUsd):"PACKAGE FX REQUIRED")+" · No additional cost"):includedPrice(item);
 const [selectedSite,setSelectedSite]=useState("ALL");
 const visibleSites=model.sites.filter(g=>selectedSite==="ALL"||g.site===selectedSite);
 return <section className="p55-panel" data-component-key="bid.budget.bom.mr0002">
  <h3>MR-0002 · DMR Trunk Radio Working BOM <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.mr0002"/></h3>
  <p className="p55-note">Latest source-priced UHF package: MGW P26-058_R2. RFI BD4345-00N0-AC with WAROM HRMD95-VIIIB enclosure is included in UHF-1; PolyPhaser IS-B50LN-C2 is included in UHF-2 Yagi antenna set. Enclosure and PolyPhaser are displayed for traceability but their prices MUST NOT be added twice. Ex d assembly, RF surge compliance and field interfaces require separate engineering validation. Earlier HYTERA/BARTEC/LNA scenarios remain historical and non-additive. Internal preview, not customer release.</p>
  <div className="p55-filterbar" style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
   <label>Location <select aria-label="MR-0002 Location" value={selectedSite} onChange={e=>setSelectedSite(e.target.value)}>
    <option value="ALL">All locations ({model.sites.length})</option>
    {model.sites.map(g=><option key={g.site} value={g.site}>{g.site}</option>)}
   </select></label>
   <button type="button" onClick={()=>setOpen(Object.fromEntries(visibleSites.map(g=>[g.site,true])))}>＋ Expand all locations</button>
   <button type="button" onClick={()=>setOpen({})}>− Collapse all locations</button>
   <strong>{visibleSites.map(g=>g.site).join(" · ")}</strong>
  </div>
  <p className="p55-note">ครบ {model.sites.length} Location จาก Z1F TEL-LAY Rev.C1; ตารางแสดงยอด THB เป็นหลัก และเก็บ USD ต้นทางเป็นหลักฐาน · คลิก + ของแต่ละ Location เพื่อเปิดรายการ Tag</p>
  {visibleSites.map(group=><div className="p55-panel" key={group.site}>
   <h4><button type="button" className="p55-row-toggle" onClick={()=>setOpen(x=>({...x,[group.site]:!x[group.site]}))}>{open[group.site]?"−":"+"}</button> {group.site} · Working {Number.isFinite(siteThb(group))?"THB "+money(siteThb(group)):"FX REQUIRED"} · incomplete accessories
   <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom.mr0002."+group.site.toLowerCase()}/></h4>
   {open[group.site]&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Tag / Item</th><th>SKU / Description</th><th>Qty</th><th>Original Currency</th><th>Unit Rate (THB)</th><th>Extended (THB)</th><th>Owner / Evidence</th><th>Status</th><th>Copy ID</th></tr></thead>
    <tbody>{group.items.map(item=><tr key={item.id}><td>{item.tag}<small>{itemModuleId(item)}</small></td><td>{item.sku||"—"}<small>{item.description}</small></td>
     <td>{item.qty??"PENDING"} {item.unit}</td><td>{item.currency||"TBC"}</td><td>{thb(item.unitCost,item.currency)}<small>{Number.isFinite(item.unitCost)?"Original: "+(item.currency||"—")+" "+money(item.unitCost):item.priceInclusion?"Included in parent package — no separate vendor rate":"No sourced unit rate"}</small></td>
     <td>{item.countedInWorkingTotal?thb(item.extended,item.currency):(item.displayPrice||"NOT ADDITIVE / TECHNICAL REVIEW")}</td><td>{item.owner}<small>{item.source}</small></td><td>{item.status}{item.note&&<small>{item.note}</small>}</td>
     <td><ComponentCopyId projectId="PJ2608-0553" componentKey={itemModuleId(item)+".evidence"}/></td></tr>)}</tbody></table></div>}
   <p className="p55-note">THB conversion: {validFx?fx.thbPerUsd+" THB/USD · "+(fx.date||"DATE NOT VERIFIED")+" · "+(fx.source||"SOURCE NOT VERIFIED"):"FX REQUIRED"}; original supplier USD values are preserved for evidence. Included packages are not additive.</p>
   <RfFeederEvidence0553 group={group}/>
   <p className="p55-note">{group.scopeWarnings.join(" · ")}</p>
  </div>)}
  <p className="p55-note">This is the controlled derivation workbench, not a persisted in-browser price editor. Changes to supplier rate, approved site quantity and configuration must update source-controlled inputs; downstream views read this same dataset. No customer release.</p>
 </section>;
}