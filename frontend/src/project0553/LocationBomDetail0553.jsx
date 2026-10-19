import React,{useState} from "react";
import {bomPriceTHB0553} from "./bomPresentationContract0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {ControlledModuleSection0553} from "./ControlledModuleSection0553";
import {TagFourStageWorkbench0553} from "./TagFourStageWorkbench0553";
import {traceTagParticular0553} from "./data/documentParticularTrace0553";
import {TagMappingAudit0553} from "./TagMappingAudit0553";
import {ZWP8CostOwnershipAudit0553} from "./ZWP8CostOwnershipAudit0553";
import WORKING_POLICY from "./data/siProceedWithQualifications0553.json";
import {recoverMR0001Evidence0553} from "./data/mr0001EvidenceRecovery0553";
import {MR0001_MODULE_CROSSMAP_0553} from "./data/mr0001ModuleCrossmap0553";
import {selectMR0001Rev03TagCostRows0553 as selectMR0001TagCostRows0553,summarizeMR0001Rev03TagCost0553 as summarizeMR0001TagCost0553} from "./data/mr0001Rev03CostOverlay0553";
import {deriveSevenLocationCostLedger0553} from "./data/sevenLocationCostCalculations0553";
import {ZWP20_WEB_BULK_RATES_0553} from "./data/zwp20WebBulkRates0553";
const fmt=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"PENDING";
export function LocationBomDetail0553({site,fx}){
 const [expanded,setExpanded]=useState({});
 const ledger=summarizeMR0001TagCost0553(site);
 const rows=selectMR0001TagCostRows0553(site);
 const bulk=deriveSevenLocationCostLedger0553().find(v=>v.wp===site);
 const bulkRows=(bulk?.rows||[]).filter(v=>v.system==="SCADA_RADIO");
 const fxValid=fx?.thbPerUsd>0;
 const thb=(n,c)=>bomPriceTHB0553(n,c,fx).label;
 const totalTHB=fxValid?ledger.subtotals.THB+ledger.subtotals.USD*fx.thbPerUsd:null;
 const keyPrefix="bid.budget.bom."+site.toLowerCase();
 const tagKey=v=>keyPrefix+"."+String(v.tag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"."+v.row;
 const tagPanelId=v=>"p553-tag-detail-"+site.toLowerCase()+"-"+String(v.tag).toLowerCase().replace(/[^a-z0-9-]/g,"-")+"-"+v.row;
 // TCAB Row9 was hidden behind two independent expand controls (site + TAG).
 // Open this requested Required BOM by default when the ZWP20 location opens.
 const defaultTcabExpanded=v=>site==="ZWP20"&&v.tag==="TCAB-500-001"&&v.row===9;
 const isTagExpanded=v=>expanded[tagKey(v)]??defaultTcabExpanded(v);
 const copyTable=()=>{
  const lines=[["Module ID","MTO Row","Tag","Quantity","Unit","Original Currency","Unit Cost","Extended Cost","Displayed THB","Basis","Status"],
   ...rows.map(v=>[tagKey(v),v.row,v.tag,v.sourceQty??"",v.sourceUnit??"",v.currency??"",v.unitCost??"",v.extended??"",thb(v.extended,v.currency),v.source??"",v.status])];
  const value=lines.map(row=>row.map(v=>String(v??"").replaceAll("\t"," ").replaceAll("\n"," ")).join("\t")).join("\n");
  if(typeof navigator!=="undefined"&&navigator.clipboard?.writeText)navigator.clipboard.writeText(value).catch(()=>window.prompt("Copy BOM",value));
  else if(typeof window!=="undefined")window.prompt("Copy BOM",value);
 };
 return <section className="p55-panel p553-tag-workbench" data-component-key={keyPrefix}>
  <div style={{display:"flex",justifyContent:"space-between",gap:8,flexWrap:"wrap",alignItems:"center"}}>
   <strong>{site} · SCADA Engineering-Derived Site Cost Summary</strong>
   <button type="button" className="p553-detail-button" onClick={copyTable}>Copy {site} BOM Table (Excel)</button>
  </div>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={keyPrefix}/> · MTO Rev04 → Engineering Tag → Site Function / Quantity → Vendor evidence → Working Cost. Same ledger rules as ZWP20; NO blind copying of ZWP20 radio configuration or prices.</p>
  <p><strong>{site} Working Priced Subtotal: {Number.isFinite(totalTHB)?"THB "+fmt(totalTHB):"FX REQUIRED"}</strong>
   <small>Original USD {fmt(ledger.subtotals.USD)} + THB {fmt(ledger.subtotals.THB)} · {ledger.costedRows}/{ledger.totalRows} tagged rows priced · {ledger.unresolvedRows.length} unresolved · FX {fx?.thbPerUsd??"NOT SET"} THB/USD</small></p>
  <p className="p55-note">กด + ที่ TAG เพื่อดู Engineering derivation, MR/BLD/RPT requirements, Vendor quotation functions, assumptions และ Cost ownership; Copy ID ใช้อ้างอิง TAG แยกตาม Location / MTO row ได้โดยตรง</p>
  {site==="ZWP8"&&<ZWP8CostOwnershipAudit0553 fx={fx}/>}
  <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact p553-mto-summary-table">
   <thead><tr><th>MTO / Module</th><th>Engineering Quantity / Basis</th><th>Budgetary Selected Product / Vendor</th><th>Unit Cost (THB)</th><th>Extended Cost (THB)</th><th>Assumptions / Status</th></tr></thead><tbody>
   {rows.map(v=><React.Fragment key={v.row+"-"+v.tag}>
    <tr data-component-key={tagKey(v)}>
     <td><button type="button" className="p55-row-toggle" aria-expanded={isTagExpanded(v)} aria-label={(isTagExpanded(v)?"Collapse ":"Expand ")+v.tag+" engineering cost details at "+site+" MTO row "+v.row} onClick={()=>setExpanded(o=>({...o,[tagKey(v)]:!(o[tagKey(v)]??defaultTcabExpanded(v))}))}>{isTagExpanded(v)?"−":"+"}</button> <strong>{v.tag}</strong><small>Row {v.row} · {v.description||"Engineering BOM"}</small>{site==="ZWP20"&&v.tag==="TCAB-500-001"&&v.row===9&&<small><strong>BARTEC TCAB Ex e · GA 16 M20 holes · DTS requires 18</strong> · Row9 Required BOM expanded below; factory components non-additive, field glands in Row11</small>}{v.tag?.startsWith("LAN-502-")&&<small><strong>TC-0001 Item 13 · 8 RJ45 PoE + 2 SFP · no expansion module</strong> · Click + for Required BOM, Working SKU/Cost and VST comparison</small>}<ComponentCopyId projectId="PJ2608-0553" componentKey={tagKey(v)} componentName={v.tag+" — "+(v.description||"Engineering BOM")+" / MTO row "+v.row}/></td>
     <td>{v.sourceQty??"REVIEW"} {v.sourceUnit||""}{Number.isFinite(v.procurementQty)&&<small><strong>NEW PROCUREMENT: {v.procurementQty} {v.procurementUnit||v.sourceUnit||"Set"}</strong></small>}<small>{v.quantityBasis||v.note||"Engineering quantity and physical SKU to verify"}</small></td>
     <td>{v.vendor||"Vendor / Configuration not selected"}<small>{v.sku||v.description||"Engineering takeoff required"}</small></td>
     <td>{thb(v.unitCost,v.currency)}<small>{v.currency||"—"} {fmt(v.unitCost)}</small>{v.procurementQty===0&&Number.isFinite(v.referenceExtended)&&<small>Historical full-cabinet reference: THB {fmt(v.referenceExtended)} — NOT SELECTED</small>}{Number.isFinite(v.extended)&&Number.isFinite(v.unitCost)&&Number.isFinite(v.sourceQty)&&v.procurementQty===undefined&&Math.abs(v.extended-v.unitCost*v.sourceQty)>0.01&&<small>TAG total differs from unit rate × MTO quantity; expand to inspect component cost ownership.</small>}{!v.countedInWorkingTotal&&Number.isFinite(v.referenceExtended)&&<small>REFERENCE ONLY — NOT SELECTED</small>}</td>
     <td><strong>{v.countedInWorkingTotal?thb(v.extended,v.currency):Number.isFinite(v.referenceExtended)?thb(v.referenceExtended,v.currency)+" (reference only)":"NOT ALLOCATED"}</strong><small>{v.countedInWorkingTotal?`${v.currency||"—"} ${fmt(v.extended)}`:"Excluded from booked site cost until owner/quantity decision"}</small></td>
     <td>{v.status}<small>{v.source||"MTO Rev04"}</small>{(v.assumptions||[]).map((x,i)=><small key={i}>{x}</small>)}</td>
    </tr>
    {isTagExpanded(v)&&<tr id={tagPanelId(v)} data-component-key={tagKey(v)+".derivation"} className="p553-mto-drilldown-row"><td colSpan={6}>
     <ControlledModuleSection0553 moduleKey={tagKey(v)+".derivation"} title={v.tag+" · Row "+v.row+" — Engineering Derivation / Vendor Breakdown"} defaultOpen>
     <p className="p55-note">Original MTO: {site} / row {v.row} / {v.sourceQty??"REVIEW"} {v.sourceUnit||""}. Cost basis: {v.currency||"UNVERIFIED"} {fmt(v.unitCost)} per source unit; extended: {v.countedInWorkingTotal?fmt(v.extended):"NOT ALLOCATED"}. Vendor / SKU: {v.vendor||"Not selected"} / {v.sku||"Not selected"}. No candidate rate is added automatically.</p>
     <p className="p55-note">Quantity owner: MR/MTO · Cost owner: {v.source} · {v.status} · Selected vendor cost is not customer selling price.</p>
     {(site==="ZWP20"&&v.tag==="ANT-502-001")&&<p className="p55-note"><strong>SI Management Working Basis:</strong> {WORKING_POLICY.workingDecisions[0].state}. 4ft is the preferred budgetary alternative, subject to link and reflection proof. Same Customer TAG applies; any changes to mounting/route are tracked through installation drawings and cost drivers.</p>}
     {(site==="ZWP20"&&["MR-502-001","MR-502-001A","LAN-502-001"].includes(v.tag))&&<p className="p55-note"><strong>ZPQ Existing NMS Interface:</strong> {WORKING_POLICY.workingDecisions[2].state}. Existing NMS assumed; available licences are not verified. Configure and test extension as scope; any incremental entitlements require a sourced scenario or documented commercial qualification, not an assumed zero rate.</p>}

     <TagFourStageWorkbench0553 site={site} tagRow={v} moduleKey={tagKey(v)} fx={fx}>
     {site==="ZWP20"&&v.tag==="MR-502-001"&&v.row===4&&<TagMappingAudit0553/>}
     {(()=>{const trace=traceTagParticular0553(site,v.tag);const rows=[...trace.direct,...trace.siteSpecific];return <ControlledModuleSection0553 moduleKey={tagKey(v)+".particular-evidence"} title={"RFQ Particular Evidence / SI Engineering Proof — "+trace.direct.length+" TAG + "+trace.siteSpecific.length+" Site + "+trace.common.length+" Common; "+trace.conflicts.length+" Conflict Gates"}>
      <p className="p55-note">Requirements derive from MR/BOD/DTS/SPE/RPT/BLD. Clause evidence is independent from existing priced vendor/quantity ledger. Review every linked note, comment and attachment; show applicable common constraints in 04 Documents.</p>
      <ControlledModuleSection0553 moduleKey={tagKey(v)+".particular-evidence.direct-site"} title={"TAG / Site Particular Clauses ("+rows.length+")"} defaultOpen>
       <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact"><thead><tr><th>Document / Clause</th><th>Customer Requirement</th><th>SI Proof / Design Task</th><th>Cost Driver</th></tr></thead><tbody>
        {rows.map(r=><tr key={r.id}><td><strong>{r.document} · {r.section}</strong><small>p.{r.page} · {r.type} · {r.id}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={tagKey(v)+".particular-evidence.clause."+String(r.id).toLowerCase().replace(/[^a-z0-9-]/g,"-")} componentName={r.document+" "+r.section}/></td><td>{r.topic}<small>{r.requirement}</small></td><td>{r.siAction}</td><td>{r.costDriver}<small>Review before price release</small></td></tr>)}
       </tbody></table></div>
      </ControlledModuleSection0553>
      <ControlledModuleSection0553 moduleKey={tagKey(v)+".particular-evidence.common"} title={"Common / System Requirements ("+trace.common.length+")"}>
       <p className="p55-note">Shared clauses are applicable project constraints, not automatically accepted technical compliance or additional posted costs.</p>
       <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact"><thead><tr><th>Document / Clause</th><th>Common Requirement</th><th>Engineering Proof / Action</th><th>Cost Driver</th></tr></thead><tbody>
        {trace.common.map(r=><tr key={r.id}><td><strong>{r.document} · {r.section}</strong><small>p.{r.page} · {r.id}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={tagKey(v)+".particular-evidence.clause."+String(r.id).toLowerCase().replace(/[^a-z0-9-]/g,"-")} componentName={r.document+" "+r.section}/></td><td>{r.topic}<small>{r.requirement}</small></td><td>{r.siAction}</td><td>{r.costDriver}</td></tr>)}
       </tbody></table></div>
      </ControlledModuleSection0553>
      <ControlledModuleSection0553 moduleKey={tagKey(v)+".particular-evidence.conflicts"} title={"Cross-document Conflict Gates ("+trace.conflicts.length+")"}>
       <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact"><thead><tr><th>Conflict / Severity</th><th>Source A</th><th>Source B</th><th>Required SI Decision / Status</th></tr></thead><tbody>
        {trace.conflicts.map(r=><tr key={r.id}><td><strong>{r.id} · {r.topic}</strong><small>{r.severity}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={tagKey(v)+".particular-evidence.conflicts."+String(r.id).toLowerCase()} componentName={r.id+" "+r.topic}/></td><td>{r.sourceA}</td><td>{r.sourceB}</td><td>{r.siDecisionGate}<small>{r.resolution}</small></td></tr>)}
       </tbody></table></div>
      </ControlledModuleSection0553>
      <p className="p55-note">This trace is advisory only and does not change current quantities, selected products, A/B/C, or working totals.</p>
     </ControlledModuleSection0553>})()}
     {v.tag==="MR-502-001"&&site==="ZWP21"&&<p className="p55-note"><strong>Functional mapping from ZWP20 reference:</strong> ZWP20 MR-502-001 Row 4 (PTMP remote) → ZWP21 MR-502-001 Row 13 (PTP peer). Matching child functions: Radio hardware, RF filter, throughput/capacity entitlement and RF mounting. Different RPT role / quote group; no automatic SKU or region entitlement transfer. Separate power/IDU and surge owners must remain separate.</p>}
     {v.tag==="MR-502-001"&&site==="ZWP21"&&<ControlledModuleSection0553 moduleKey={tagKey(v)+".ptp-function-crossmap"} title="ZWP20 → ZWP21 PTP Functional Mapping"><div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
      <thead><tr><th>Function</th><th>ZWP20 Reference</th><th>ZWP21 Budgetary</th><th>Cost Owner</th><th>Engineering Control</th></tr></thead><tbody>
       {MR0001_MODULE_CROSSMAP_0553.functions.map(x=><tr key={x.id}><td>{x.id}</td><td>{x.zwp20}</td><td>{x.zwp21}</td><td>{x.owner}</td><td>{x.rule}</td></tr>)}
      </tbody></table><p className="p55-note">ZWP20: {MR0001_MODULE_CROSSMAP_0553.sourceModule} → ZWP21: {MR0001_MODULE_CROSSMAP_0553.targetModule}. Functional mapping only; quotation and technical approval remain site-specific.</p></div></ControlledModuleSection0553>}
     {(v.detail||v.components||[]).length>0&&<ControlledModuleSection0553 moduleKey={tagKey(v)+".function-breakdown"} title={"Function-level derivation / Supplier Quote Lines ("+(v.detail||v.components||[]).length+")"}><p className="p55-note"><strong>Function-level derivation mapped to Supplier Quote Lines:</strong> Product / Model is interpreted by its quoted function before cost allocation. Supplier quoted quantity remains quotation evidence only; Engineering Required Qty controls the budget quantity. A separate MTO owner is not double-counted in MR-502-001.4.</p><div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
      <thead><tr><th>Engineering Function / Quote Line</th><th>Required Qty / Basis</th><th>Product / Model · What it does</th><th>Supplier Quote Evidence</th><th>Cost Allocation Owner</th><th>Working Extended (THB)</th><th>Engineering / Commercial State</th></tr></thead><tbody>
       {(v.detail||v.components||[]).map((c,i)=><tr key={c.functionId||i}>
        <td><strong>{c.functionId}</strong><small>{c.budgetaryQuoteLine||c.budgetarySelectedOffer||"NO SELECTED QUOTE LINE"}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={tagKey(v)+".function."+String(c.functionId||i).toLowerCase().replace(/[^a-z0-9-]/g,"-")} componentName={v.tag+" / "+(c.functionId||"function "+i)}/></td>
        <td>{c.requiredQty??c.qty??"PENDING"}<small>{c.quantityState||c.quantityBasis||"Engineering confirmation required"}</small><small>{c.quantityProof||""}</small></td>
        <td><strong>{c.budgetarySelectedSKU||c.sku||"NOT SELECTED"}</strong><small>{c.budgetarySelectedDescription||c.description||c.productFunction||"Product function requires engineering review"}</small><small>{c.productFunction||""}</small></td>
        <td>{c.currency||v.currency||"USD"} {fmt(c.budgetaryUnitPrice??c.unitPrice)}<small>Supplier quoted Qty: {c.offeredQuoteQty??"—"} · quoted line total: {c.currency||v.currency||"USD"} {fmt(c.quotedSourceTotal)}</small><small>{c.priceEvidenceType||"SOURCE PRICE EVIDENCE"}</small></td>
        <td><strong>{c.allocationOwner||v.tag+"."+v.row}</strong><small>{c.sourceAllocationBoundary||"Allocate once to physical MTO owner"}</small></td>
        <td>{c.nonCostedIncluded?"INCLUDED / NO EXTRA":thb(c.budgetaryExtended??c.extended,c.currency||v.currency)}</td>
        <td>{c.budgetarySelectionState||c.status||c.state}<small>{c.budgetaryDecision||c.technicalState||""}</small>{c.priceEvidence?.constraints&&<small>{c.priceEvidence.constraints}</small>}</td>
       </tr>)}
      </tbody></table></div></ControlledModuleSection0553>}
     {(()=>{const recovered=recoverMR0001Evidence0553(site,v.row,v.tag);return <ControlledModuleSection0553 moduleKey={tagKey(v)+".recovered-engineering"} title={"Recovered Engineering Source / First Principles / Scope Owner ("+recovered.functions.length+" function records)"}>
      <p className="p55-note">Original package: {recovered.sourcePackage||"No package mapping"} · Family: {recovered.family||"Not classified"} · Cost ownership: {recovered.ownershipStatus}</p>
      <div className="p55-table-wrap p553-module-scroll"><table className="p55-table"><thead><tr><th>Original Engineering Function</th><th>Quantity Driver / Proof</th><th>Vendor Quote Candidates</th><th>Original Decision</th></tr></thead><tbody>
       {recovered.functions.map(fn=><tr key={fn.id}><td>{fn.functionId}</td><td>{fn.quantityDriver}<small>{fn.proofRequired?.join(" · ")}</small></td>
        <td>{fn.candidateQuotes.map(q=>q.quoteLine+" / "+q.partNumber).join(" · ")||"NO SOURCE RATE"}</td><td>{fn.technicalState} · {fn.selectedOffer||"NOT SELECTED"} · Qty {fn.requiredQty??"NOT VERIFIED"}</td></tr>)}
      </tbody></table></div>
      {recovered.ownershipChecks.map(c=><p className="p55-note" key={c.id}>{c.id}: {c.description} — {c.state}</p>)}
     </ControlledModuleSection0553>})()}
     {(v.quotedRateCandidates||[]).length>0&&<ControlledModuleSection0553 moduleKey={tagKey(v)+".vendor-alternatives"} title="Vendor alternative quotation evidence (not additive)"><div className="p55-table-wrap p553-module-scroll"><table className="p55-table"><thead><tr><th>Quote line</th><th>SKU</th><th>Original Unit Rate</th><th>Selected</th></tr></thead><tbody>{v.quotedRateCandidates.map((c,i)=><tr key={i}><td>{c.quoteLine}</td><td>{c.sku}</td><td>{fmt(c.unitPriceTHB??c.sourceUnitTHB)}</td><td>{c.selected?"WORKING COMPARABLE":"ALTERNATIVE"}</td></tr>)}</tbody></table></div></ControlledModuleSection0553>}
     {(v.candidates||[]).map((c,i)=><p key={i} className="p55-note">{c.vendor||"Supplier"} · {c.sku} · {c.originalCurrency} {fmt(c.originalUnitPrice)} · candidate only, NOT additional booked cost</p>)}
     </TagFourStageWorkbench0553>
    </ControlledModuleSection0553></td></tr>}
   </React.Fragment>)}
   </tbody></table></div>
  <ControlledModuleSection0553 moduleKey={keyPrefix+".scada-bulk"} title={site+" · SCADA Bulk / Installation Material Basis (separate scope)"}>
  <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact"><thead><tr><th>Bulk / Function</th><th>Qty</th><th>Rate (THB)</th><th>Extended (THB)</th><th>Owner / Status</th></tr></thead><tbody>
   {bulkRows.map(v=><tr key={v.id}><td>{v.item}</td><td>{v.qty??"DERIVE"} {v.unit}</td><td>{fmt(v.rateTHB)}</td><td>{fmt(v.extendedTHB)}</td><td>{v.owner}<small>{v.status}</small><small>{v.source}</small></td></tr>)}
  </tbody></table></div>
  {site==="ZWP20"&&<ControlledModuleSection0553
   moduleKey={keyPrefix+".scada-bulk.web-rate-evidence"}
   title="Internet Budgetary Rates — SCADA Bulk PENDING items"
   description="Source-backed retail price evidence; not an additional booked cost"
   defaultOpen>
   <p className="p55-note">Source-backed THB ex-VAT retail rates; quantity/Ex suitability and supplier inclusion require Engineering confirmation. Price candidate is not a booked additional cost. Hawke gland range must match physical cable outer diameter.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Item / SKU</th><th>Retail Unit Price (THB)</th><th>OD Range</th><th>Source</th><th>Owner / Condition</th></tr></thead><tbody>
    {ZWP20_WEB_BULK_RATES_0553.lines.map(r=><tr key={r.id}><td><strong>{r.id}</strong><small>{r.sku}</small></td><td>{fmt(r.rateTHB)} / {r.unit}</td><td>{Number.isFinite(r.outerDiameterMinMm)?r.outerDiameterMinMm+"–"+r.outerDiameterMaxMm+" mm":"Cable datasheet required"}</td><td><a href={r.url} target="_blank" rel="noopener noreferrer">{r.source}</a></td><td>{r.decision}</td></tr>)}
   </tbody></table></div>
  </ControlledModuleSection0553>}
  <p className="p55-note">Bulk shown separately, not automatically additive to equipment subtotal. New/Reuse and source quantity are assessed per site. Missing pricing stays PENDING. Customer A+B+C release not approved.</p>
  </ControlledModuleSection0553>
 </section>;
}
