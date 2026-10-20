import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {evaluateB2VdrlIndependentScenario0553} from "./data/b2IndependentVdrlRecalculation0553";

// 10.2 B2: Independent First Principles estimate ONLY; not the canonical quote.
// Work objects are actual source Rev00a VDRL register inputs (TEMP productivity).
// No 580k seed, no historical quote reverse-engineering, no other-owner postings.
const ROOT="bid.budget.working.bc.b2.independent-recalculation";
const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const num=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:3}):"N/A";
const variants=[
 {value:"EXCLUDE_EXPLICIT_B1_TECHNICAL_AUTHOR_HOURS",text:"B2 review candidate — exclude explicit B1 authored technical hours"},
 {value:"SOURCE_ALL_ROLE_HOURS",text:"Original WBS all role MH — ownership not excluded"},
 {value:"DC_ADMIN_ONLY_BOUNDARY_CASE",text:"Document Controller only — lower-scope boundary, INCOMPLETE"}
];
const tones={
 "PROJECT DOSSIER":"project","ENGINEERING DOSSIER":"engineering",
 "QUALITY DOSSIER":"quality","MAINTENANCE AND OPERATION DOSSIER":"maintenance"
};
const dossiers={
 "PROJECT DOSSIER":"Project Dossier",
 "ENGINEERING DOSSIER":"Engineering Dossier",
 "QUALITY DOSSIER":"Quality / Test Documents",
 "MAINTENANCE AND OPERATION DOSSIER":"Maintenance / Operation Documents"
};
const copy=id=><span className="p553-b2-recalc-copy"
 onClick={e=>{e.preventDefault();e.stopPropagation();}}
 onKeyDown={e=>e.stopPropagation()}>
 <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>
 </span>;
function WorkGroup({title,description,id,numCode,children,tone="project",defaultOpen=false}){
 return <details className={"p553-b2-recalc-group p553-b2-recalc-group--"+tone}
  data-component-key={id} defaultOpen={defaultOpen}>
  <summary className="p553-b2-recalc-summary">
   <span className="p553-b2-recalc-num">{numCode}</span>
   <span className="p553-b2-recalc-label"><strong>{title}</strong>
    <small>{description}</small><code>{id}</code></span>{copy(id)}
  </summary>
  <div className="p553-b2-recalc-body">{children}</div>
 </details>;
}
export function B2IndependentVdrlRecalculation0553(){
 const [ownerPolicy,setOwnerPolicy]=React.useState("EXCLUDE_EXPLICIT_B1_TECHNICAL_AUTHOR_HOURS");
 const [employerLoad,setEmployerLoad]=React.useState(1.2);
 const [margin,setMargin]=React.useState(.2);
 const ref=React.useRef(null);
 const model=React.useMemo(()=>evaluateB2VdrlIndependentScenario0553({
  employerLoadFactor:employerLoad,laborGrossMarginTarget:margin,ownerPolicy
 }),[employerLoad,margin,ownerPolicy]);
 const r=model.result;
 const openAll=open=>ref.current?.querySelectorAll("details.p553-b2-recalc-group")
  .forEach(node=>{node.open=open;});
 return <section ref={ref} className="p55-panel p553-b2-recalc"
  data-component-key={ROOT} style={{padding:12,marginTop:12}}>
  <div className="p55-eyebrow">10.2 / B2 — 02 GEQ / PEQ INDEPENDENT FIRST-PRINCIPLES CALCULATION</div>
  <h3>B2 — คำนวณใหม่ตาม VDRL Work Objects จริง (ไม่ใช้ราคาเดิมเป็นฐาน)</h3>
  <p className="p55-note"><strong>Recalculation Module:</strong> {copy(ROOT)}
   {" "}· 143 original MR document obligations → 131 provisional unique work objects,
   project-shared documents charged once, each MH role vector traceable to actual Rev00a source.</p>
  <p className="p55-note"><a href={model.sourceUrl} target="_blank" rel="noreferrer">
   Original source: {model.sourceTitle}</a>. Source effort, occurrence factors, and
   historical THB/MH are provisional inputs; only scenario formula is newly calculated.
   No historical SELL price and no 580,000 THB price anchor enter the formulas.</p>
  <div className="p553-b2-recalc-controls">
   <label>Cost Owner Boundary
    <select value={ownerPolicy} onChange={e=>setOwnerPolicy(e.target.value)}>
     {variants.map(v=><option value={v.value} key={v.value}>{v.text}</option>)}
    </select></label>
   <label>Employer Load (planning assumption)
    <select value={employerLoad} onChange={e=>setEmployerLoad(Number(e.target.value))}>
     <option value={1}>0% additional</option><option value={1.1}>10%</option>
     <option value={1.2}>20% (default scenario)</option><option value={1.3}>30%</option>
    </select></label>
   <label>Gross Margin (planning assumption)
    <select value={margin} onChange={e=>setMargin(Number(e.target.value))}>
     <option value={0}>0%</option><option value={.15}>15%</option>
     <option value={.2}>20% (default scenario)</option><option value={.25}>25%</option>
    </select></label>
  </div>
  <div className="p55-metric-grid">
   <div><strong>Source VDRL obligations / unique WOs</strong><p>143 / {r.workObjects}</p>
    <small>Not all 143 are independent paid document instances</small></div>
   <div><strong>Role hours in original source</strong><p>{num(r.sourceRoleMH)} MH</p>
    <small>Temporary estimating / human review required</small></div>
   <div><strong>Selected B2 scenario hours</strong><p>{num(r.selectedB2MH)} MH</p>
    <small>Excluded explicitly identified other-owner MH: {num(r.excludedOtherOwnerMH)}</small></div>
   <div><strong>Recalculated source-rate labour COST proxy</strong><p>{money(r.selectedHistoricalCostProxyTHB)}</p>
    <small>Old historical THB/MH rate seed; NOT verified Direct Cost</small></div>
   <div><strong>Scenario employer-loaded Working Cost</strong><p>{money(r.employerLoadedPlanningCostTHB)}</p>
    <small>Source Cost × {employerLoad.toFixed(2)} planning only</small></div>
   <div><strong>Independent indicative SELL scenario</strong><p>{money(r.indicativeGrossMarginSellTHB)}</p>
    <small>Loaded cost ÷ (1 − {(margin*100).toFixed(0)}% margin) — NOT current SELL</small></div>
  </div>
  <p className="p55-note"><strong>Cost formula:</strong>
   {" "}Σ [I × Q × UMH by position × historical cost rate] × Employer Load
   {" "}÷ (1 − planning margin). No original B2 SELL price is referenced.
   <strong> This is a what-if candidate, not a revised/approved quotation.</strong>
   {" "}Even after explicitly excluding the B1-owned technical-authoring hours,
   other engineering-review and FAT/SAT documentation authoring RACI checks remain OPEN.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Role / Resource</th><th>Source MH</th><th>Selected B2 MH</th>
    <th>Historical Cost Rate THB/MH</th><th>Source Cost Proxy THB</th>
    <th>Employer Loaded Planning Cost</th><th>Scenario SELL</th></tr></thead>
   <tbody>{model.roleSummary.map(x=><tr key={x.role}>
    <td><strong>{x.role}</strong></td><td>{num(x.sourceMH)}</td>
    <td>{num(x.selectedMH)}</td><td>{money(x.historicalRateTHBPerMH)}</td>
    <td>{money(x.costProxyTHB)}</td><td>{money(x.loadedPlanningCostTHB)}</td>
    <td>{money(x.indicativeSellTHB)}</td></tr>)}</tbody>
   <tfoot>
    {model.roleLineCostRoundingBridgeTHB!==0&&<tr><th colSpan={4}>
     Source role-line rounding reconciliation (5 displayed rows × 2 decimals)</th>
     <th>{money(model.roleLineCostRoundingBridgeTHB)}</th>
     <th>Included in aggregate</th><th>Not a separate Cost Owner or price item</th></tr>}
    <tr><th>Independent scenario TOTAL</th><th>{num(r.sourceRoleMH)}</th>
    <th>{num(r.selectedB2MH)}</th><th>Mixed role rates</th>
    <th>{money(r.selectedHistoricalCostProxyTHB)}</th>
    <th>{money(r.employerLoadedPlanningCostTHB)}</th>
    <th>{money(r.indicativeGrossMarginSellTHB)}</th></tr></tfoot>
  </table></div>
  <div className="p553-b2-recalc-topbar">
   <h4>Work Type → MR → Work Object / Source Qty, MH, Cost &amp; SELL</h4>
   <div className="p553-b2-recalc-buttons">
    <button type="button" className="p553-detail-button" onClick={()=>openAll(true)}>＋ Expand All</button>
    <button type="button" className="p553-detail-button" onClick={()=>openAll(false)}>− Collapse All</button>
   </div>
  </div>
  {model.dossierGroups.map((group,i)=>{
   const id=ROOT+".dossier."+group.dossier.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,"");
   return <WorkGroup key={id} numCode={"B2.R"+(i+1)} id={id}
    tone={tones[group.dossier]} defaultOpen={i===0}
    title={dossiers[group.dossier]}
    description={group.quantity+" work objects / "+num(group.countedMH)+" selected MH; "+
      money(group.selectedPlanningCostTHB)+" planning cost · "+money(group.candidateSellTHB)+" scenario SELL"}>
    {group.byMr.map((mr,j)=>{
     const mrId=id+".mr."+mr.mr.toLowerCase().replace(/[^a-z0-9]+/g,"-");
     return <WorkGroup key={mrId} numCode={"B2.R"+(i+1)+"."+(j+1)}
      tone={tones[group.dossier]} id={mrId} title={mr.mr}
      description={mr.workObjectCount+" original unique work objects"}
      defaultOpen={i===0&&j===0}>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1590}}>
       <thead><tr>
        <th>Work Object / Module ID</th><th>Source Document / Dossier</th>
        <th>Source Qty / Driver</th><th>Role / Work Mode</th>
        <th>Lead MH</th><th>Senior MH</th><th>Engineer MH</th><th>Draft MH</th>
        <th>DC/Admin MH</th><th>B2 Counted MH</th><th>Historical Cost THB</th>
        <th>Employer Loaded THB</th><th>Scenario SELL THB</th><th>Ownership / Gate</th>
       </tr></thead>
       <tbody>{mr.rows.map(x=>{
        const woId=ROOT+".wo."+x.id.toLowerCase();
        return <tr key={x.id} data-component-key={woId}>
         <td><strong>{x.id}</strong><small>{woId}</small>{copy(woId)}</td>
         <td><strong>{x.title}</strong><small>{x.sourceItem} · {x.dossier} · {x.mr}</small></td>
         <td>{num(x.provisionalOccurrenceQty)} {x.occurrenceBasis}
          <small>Effective unit {num(x.effectiveUnits)}</small></td>
         <td>{x.workMode}<small>{x.documentClass} / {x.sharingScope}</small></td>
         {x.selectedRoleMH.map((v,k)=><td key={k}>{num(v)}</td>)}
         <td><strong>{num(x.countedMH)}</strong>
          {x.excludedMH>0&&<small>Other owner excluded {num(x.excludedMH)} MH</small>}</td>
         <td>{money(x.directCostProxyTHB)}</td>
         <td>{money(x.employerLoadedPlanningCostTHB)}</td>
         <td>{money(x.indicativeSellTHB)}</td>
         <td>{x.ownerDisposition}<small>{x.evidenceStatus}</small><small>{x.bindingDecision}</small></td>
        </tr>;
       })}</tbody>
      </table></div>
     </WorkGroup>;
    })}
   </WorkGroup>;
  })}
  <WorkGroup id={ROOT+".audit"} numCode="B2.RA" title="Engineering Cost, RACI & Document Completeness Audit"
   tone="audit" description="No double counting, rate/quantity authority and missing VDRL lifecycle evidence">
   <p className="p55-note"><strong>Independent scenario inputs are not approved:</strong>
    original Rev00a WO counts and productivity contain TEMP factors. The
    original 131 Work Objects have not been independently re-engineered from equipment
    SKUs, actual submitted document versions, received vendor deliverables or current
    execution milestones. Their quantities and estimated hours are recomputed,
    NOT newly approved.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Verification Gate</th><th>Required closure</th></tr></thead>
    <tbody>{model.unresolvedGates.map((item,i)=><tr key={i}><td>OPEN-{String(i+1).padStart(2,"0")}</td><td>{item}</td></tr>)}</tbody>
   </table></div>
   <p className="p55-note"><strong>Cost Owner Rule:</strong> B2 = document control,
    submittals, revisions, review coordination and final compilation.
    OEM/B1 creates technical drawing/calculation payloads; B3 creates FAT/SAT
    test evidence. Do not count those authoring roles twice.</p>
  </WorkGroup>
  <p className="p55-note"><strong>Price authority:</strong> This module writes NO canonical
   B2 Working SELL, no verified direct cost and no release/customer quote.
   It is a reproducible first-principles scenario derived from source document
   work objects and explicit rate/load/margin assumptions only.</p>
 </section>;
}
