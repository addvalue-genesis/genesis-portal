import React,{useState} from "react";
import {bomModuleId0553,bomPriceTHB0553,bomEvidenceDisplay0553} from "./bomPresentationContract0553";
import {MGW_P26_058_R2_UHF_0553} from "./data/mgwP26058R2Uhf0553";
import {selectWorkingBomProjection0553} from "./data/workingBomAggregation0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";

// Read projection only. MR0002/MR0004 use canonical working items;
// MR0003 remains a priced-evidence scenario until a canonical ledger is approved.
// Never merge source evidence and booked entries into one financial total.
const money=(n,c)=>Number.isFinite(n)?new Intl.NumberFormat("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+" "+c:"PENDING (not zero)";
const evidenceToRow=(x,i)=>({
 id:String(x.line||i),tag:x.line,sku:"",description:x.description,qty:x.assumedQty,
 unit:"",currency:x.currency,unitCost:x.unit,extended:x.extended,
 source:x.source,status:x.kind,owner:x.costOwner||"EVIDENCE_ONLY",
 countedInWorkingTotal:Number.isFinite(x.extended),scenarioEvidence:true
});
const canonicalRow=(x)=>({...x,scenarioEvidence:false});
const isCounted=x=>x.countedInWorkingTotal===true&&Number.isFinite(x.extended);
const phoneEvidenceState=x=>({ "EX-PHONE-JB-ENTRIES":"COUNTED: 8 physical M20 entries / 3 budget-active / 5 factory plugs; included in JB assembly", "EX-PHONE-BARTEC-M20-GLAND-SIZE-QTY":"COUNTED: 3 budgetary glands × THB 1,020 = THB 3,060 indicative; not A5 booked without certified SKU", "EX-PHONE-CABLE":"COUNTED: 3 physical circuit functions; length-based cost not established from WIR/TER" })[String(x.id).toUpperCase()]||null;
const moduleBase=(mr,site)=>"bid.budget.bom."+mr.toLowerCase().replace("-","")+(site?"."+site.toLowerCase():"");
const moduleItem=(mr,site,item)=>bomModuleId0553({mr,site,itemId:item.id});
const budgetRateOwner=(mr,x)=>mr==="MR-0002"?(String(x.id).includes("RFI-LNA")?"RFI · LNA":String(x.quoteLine||"").match(/^UHF-[234]$/)?"MGW · Antenna / Feeder":String(x.quoteLine||"")==="UHF-1"?"MGW R2 · RFI/WAROM bundle":x.owner||"Field bulk"):x.owner||"Evidence candidate";
export function UnifiedMrLocationTable0553({mr,site="ALL",fx=null}){
 const [expanded,setExpanded]=useState({});
 const [expandedItems,setExpandedItems]=useState({});
 const projection=selectWorkingBomProjection0553({mr,site});
 const rows=projection.rows;
 const withRows=rows.filter(r=>r.items.length);
 const totals=projection.currencies;
 const workingUsd=totals.USD||0,workingThb=totals.THB||0;
 const hasUsd=Object.prototype.hasOwnProperty.call(totals,"USD");
 const hasThb=Object.prototype.hasOwnProperty.call(totals,"THB");
 const convertible=!hasUsd||(Number.isFinite(fx?.thbPerUsd)&&fx.thbPerUsd>0);
 const thbTotal=convertible?workingThb+workingUsd*(fx?.thbPerUsd||0):null;
 const candidate=mr==="MR-0003";
 const asThb=(n,c)=>bomPriceTHB0553(n,c,fx).label;
 const checkedRate=(x)=>{if(mr==="MR-0002"&&String(x.id).endsWith("-RFI-BDA")){const line=MGW_P26_058_R2_UHF_0553.lines.find(q=>q.id==="UHF-1");if(!line||x.unitCost!==line.unitPriceUSD||x.extended!==line.unitPriceUSD||x.source!==MGW_P26_058_R2_UHF_0553.id)return "SOURCE RATE MISMATCH — CHECK MGW R2";}return asThb(x.unitCost,x.currency);};
 const fmtLine=x=>Number.isFinite(x)?money(x,"THB"): "FX REQUIRED";
 const includedThb=x=>bomEvidenceDisplay0553(x,fx,MGW_P26_058_R2_UHF_0553.lines);
 return <section className="p55-panel" data-component-key={"bid.budget.bom.system-location-mto."+mr.toLowerCase().replace("-","")}>
  <h4>{mr} · System × Location × MTO / Working BOM <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom.system-location-mto."+mr.toLowerCase().replace("-","")}/></h4>
  <p className="p55-note"><strong>Display currency: THB only.</strong> {Number.isFinite(fx?.thbPerUsd)&&fx.thbPerUsd>0?`Working FX ${fx.thbPerUsd} THB/USD · ${fx.date||"date not verified"} · ${fx.source||"source not verified"}`:"USD→THB FX rate required; values will not be mislabeled as THB."}</p>
  <p className="p55-note">{candidate?"MR0003: priced vendor/reference evidence and field-bulk candidates only, NOT approved or posted working cost.":"Canonical equipment working lines; INCLUDED and unpriced rows never added again."} Source quote currencies remain preserved in the underlying registry, not shown in this THB working view. Missing prices/quantities are pending, never zero. No released A+B+C total is asserted.</p>
  <div className="p55-source-facts">
   <div><span>Locations with registered lines</span><strong>{withRows.length}</strong></div>
   <div><span>Visible source / working lines</span><strong>{withRows.reduce((n,r)=>n+r.items.length,0)}</strong></div>
   <div><span>Lines with numeric extended evidence</span><strong>{withRows.reduce((n,r)=>n+r.items.filter(isCounted).length,0)} / {withRows.reduce((n,r)=>n+r.items.length,0)}</strong></div>
   <div><span>{site==="ALL"?"All Locations":"Selected Location"} — {candidate?"candidate evidence subtotal":"controlled working subtotal"}</span>
    <strong>{thbTotal===null?"FX PENDING":fmtLine(thbTotal)}</strong>
    <small>{candidate?"NOT BOOKED / NOT RELEASED":"Equipment working rows only, not full A+B+C"}</small>
   </div>
  </div>
  <div className="p55-filterbar"><button type="button" className="p553-detail-button" onClick={()=>setExpanded(Object.fromEntries(withRows.map(r=>[r.site,true])))}>＋ Expand all</button>{" "}
   <button type="button" className="p553-detail-button" onClick={()=>setExpanded({})}>− Collapse all</button></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>+/−</th><th>Location</th><th>Module ID / Copy</th><th>MTO / lines</th><th>Rate evidence</th><th>Subtotal (THB)</th><th>Basis / status</th></tr></thead><tbody>
   {withRows.map(r=>{
    const sub=r.items.filter(isCounted).reduce((a,x)=>(a[x.currency]=(a[x.currency]||0)+x.extended,a),{});
    const open=!!expanded[r.site];
    return <React.Fragment key={r.site}>
     <tr><td><button type="button" className="p55-row-toggle" aria-expanded={open} onClick={()=>setExpanded(o=>({...o,[r.site]:!o[r.site]}))}>{open?"−":"+"}</button></td>
      <td><strong>{r.site}</strong></td><td><ComponentCopyId projectId="PJ2608-0553" componentKey={moduleBase(mr,r.site)} componentName={r.site+" / "+mr+" Engineering BOM"}/></td>
      <td>{r.items.length}</td><td>{r.items.filter(isCounted).length}/{r.items.length}</td>
      <td>{Object.entries(sub).length?(convertible?fmtLine((sub.THB||0)+(sub.USD||0)*(fx?.thbPerUsd||0)):"FX REQUIRED"):"PENDING"}</td>
      <td>{r.projectionSource||"SOURCE_EVIDENCE_ONLY"}<small>{r.completeness||""}</small></td></tr>
     {open&&<tr><td colSpan={7}><div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Tag / line</th><th>SKU / Description</th><th>Qty</th><th>Unit rate (THB)</th><th>Extension (THB)</th><th>Ownership / Evidence</th><th>Status / Copy ID</th></tr></thead><tbody>
      {r.items.map((x,i)=><tr key={x.id+"-"+i}><td><button type="button" className="p55-row-toggle" aria-expanded={!!expandedItems[moduleItem(mr,r.site,x)]} onClick={()=>setExpandedItems(o=>({...o,[moduleItem(mr,r.site,x)]:!o[moduleItem(mr,r.site,x)]}))}>{expandedItems[moduleItem(mr,r.site,x)]?"−":"+"}</button> {x.tag||x.id}<small>{moduleItem(mr,r.site,x)}</small></td><td>{x.sku||"—"}<small>{x.description}</small>{expandedItems[moduleItem(mr,r.site,x)]&&<div className="p55-note"><strong>Requirement → Location → Function → Quantity → Vendor → Cost:</strong> {mr} → {r.site} → {x.tag||x.id} → {x.qty??"NOT VERIFIED"} {x.unit||""} → {budgetRateOwner(mr,x)} → {isCounted(x)?asThb(x.extended,x.currency):"UNPRICED / EXCLUDED"}.<p>Source: {x.source||r.rfqSource||"RFQ cross-reference pending"} · Price basis: {x.priceBasis||r.projectionSource||"Evidence only"} · Cost owner: {x.owner||"Unassigned"} · {x.note||x.costGap||"Engineering verification required before release"}</p><ComponentCopyId projectId="PJ2608-0553" componentKey={moduleItem(mr,r.site,x)+".evidence"} componentName={(x.tag||x.id)+" / Engineering & Cost Evidence"}/></div>}</td>
       <td>{x.qty??"PENDING"} {x.unit||""}</td><td>{checkedRate(x)}</td>
       <td>{isCounted(x)?asThb(x.extended,x.currency):x.displayPrice?includedThb(x):mr==="MR-0003"&&phoneEvidenceState(x)?phoneEvidenceState(x):"NOT COUNTED / PENDING"}</td>
       <td>{budgetRateOwner(mr,x)}<small>{x.source||"Source trace pending"}</small></td>
       <td>{x.status||"—"}<small><ComponentCopyId projectId="PJ2608-0553" componentKey={moduleItem(mr,r.site,x)}/></small></td></tr>)}
     </tbody></table></div><p className="p55-note">Open constraints: {(r.gaps||[]).join(" · ")||"See RFQ / engineering evidence trace"}</p></td></tr>}
    </React.Fragment>;
   })}
  </tbody></table></div>
  {!withRows.length&&<p className="p55-note">No mapped source rows for this MR at {site}; absence is not zero cost. Review MR / WP allocation evidence.</p>}
 </section>;
}
