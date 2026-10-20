import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import PARTICULAR from "./data/documentParticularRequirements0553.json";
import PARTICULAR_CONFLICTS from "./data/documentParticularConflicts0553.json";
import WORKING_DECISIONS from "./data/siProceedWithQualifications0553.json";
import {EstimateToBidMapping0553} from "./EstimateToBidMapping0553";
import { formatCommercialAmount } from "../common/cost/commercialCurrency";
import { InternalBudgetShortcut0553 } from "./InternalBudgetShortcut0553";
import { ScopeSheetsDetail0553 } from "./ScopeSheetsDetail0553";
import { BID_COST_SPINE_0553 } from "./data/bidCostSpine";
import { CostIntegrityReview0553 } from "./CostIntegrityReview0553";
import {BcCostEvidenceDetail0553} from "./BcCostEvidenceDetail0553";
import {BcExecutionComplianceAudit0553} from "./BcExecutionComplianceAudit0553";
import {BcWorkCostLines0553} from "./BcWorkCostLines0553";
import {RevKAbcOwnershipControl0553} from "./RevKAbcOwnershipControl0553";
import {ScopeBcAnnexDetail0553} from "./ScopeBcAnnexDetail0553";
import {ScopeCategoryTabs0553} from "./ScopeCategoryTabs0553";
import {selectScopeBcPriceAudit0553} from "./data/scopeBcPriceAudit0553";
import {selectBcOutstandingBudgetReferences0553} from "./data/bcOutstandingBudgetReferences0553";
import { CommercialSystemBreakdown0553 } from "./CommercialSystemBreakdown";
import { SimpleBom0553 } from "./SimpleBom0553";
import { CustomerProposalPreview0553 } from "./CustomerProposalPreview0553";
import { BudgetaryWorkbookPreview0553 } from "./BudgetaryWorkbookPreview0553";
import {PricingCfoDashboard0553} from "./PricingCfoDashboard0553";
import {ReleaseCustomerWorkbook0553} from "./ReleaseCustomerWorkbook0553";
import {PricingSourceGuide0553,PricingSourceChip0553} from "./PricingSourceGuide0553";
import {buildReleaseCommercialModel0553} from "./data/releaseCommercialModel0553";
import {PRICING_VIEWS_0553,pricingViewByKey0553} from "./pricingViewRegistry0553";
import { REV08_BASELINE, getBaselineReview } from "./data/rev08CommercialBaseline";
import {selectBcTurnkeyWorkingCost0553} from "./data/bcTurnkeyWorkingCost0553";
import {LIFECYCLE_SPARES_0553} from "./data/lifecycleSpareScope0553";
import {BC_WORKING_ROUTES_0553,validateBcRoutes0553} from "./data/bcWorkingModuleRoutes0553";
import {BUDGET_BC_WORKFLOW_0553} from "./workstreamOwnership0553";
import React,{useState} from "react";
import {assessVendorEvidenceForBudget0553} from "./data/vendorExternalEvidence0553";
import {COMMERCIAL_TEMPLATE_0553 as template} from "./commercialWorkbookControl";
import { BID_0553_GATES, BID_0553_SOURCES } from "./bidReview";
export function CommercialWorkspace0553({focusedLocation=null,initialMode="working",navigationTarget=null,navigationSequence=0}){
 const [mode,setMode]=useState(initialMode);
 const [recipient,setRecipient]=useState("INTERNAL");
 const [expanded,setExpanded]=useState(new Set(["SUMMARY"]));
 const [bcDetailCode,setBcDetailCode]=useState(null);
 const [bcTab,setBcTab]=useState("ALL");
 const toggle=k=>setExpanded(a=>{const n=new Set(a);n.has(k)?n.delete(k):n.add(k);return n;});
 const rows=template.sheets;
 const baseline=getBaselineReview();
 const bcWorking=selectBcTurnkeyWorkingCost0553();
 // 10.2 canonical sell totals only: C options never enter base Part B.
 const bcSellSum=(rows)=>Math.round(rows.reduce((n,r)=>n+r.workingSellTHB,0)*100)/100;
 const partBRows=bcWorking.rows.filter(r=>!r.optional);
 const partCRows=bcWorking.rows.filter(r=>r.optional);
 const pricedB=partBRows.filter(r=>Number.isFinite(r.workingSellTHB));
 const pricedC=partCRows.filter(r=>Number.isFinite(r.workingSellTHB));
 const partBWorkingSell=bcSellSum(pricedB);
 const partCWorkingSell=bcSellSum(pricedC);
 const combinedBCWorkingSell=Math.round((partBWorkingSell+partCWorkingSell)*100)/100;
 const missingB=partBRows.filter(r=>!Number.isFinite(r.workingSellTHB)).map(r=>r.code);
 const missingC=partCRows.filter(r=>!Number.isFinite(r.workingSellTHB)).map(r=>r.code);
 if(Math.abs(partBWorkingSell-bcWorking.knownWorkingSellTHB)>0.01)throw Error("10.2 Part B summary mismatch");


 const bcGroupIdByWorkflow=new Map(BUDGET_BC_WORKFLOW_0553
  .filter(x=>x.parent==="10.2").map(x=>[x.workflowNumber,x.moduleId]));
 // The Project Module Navigator opens the EXISTING 10.2 disclosure
 // and scrolls to the canonical B/C row/group; it never creates a second workbench.
 React.useEffect(()=>{
  if(!navigationTarget?.startsWith("bid.budget.working.bc"))return;
  // Route nested B1 Rev.K cost objects (and other B/C child IDs) through the same parent workbench.
  const nestedCode=navigationTarget.match(/^bid\.budget\.working\.bc\.(b(?:[1-9]|1[0-4])|c[12])(?:\.|$)/i)?.[1]?.toUpperCase();
  if(nestedCode&&bcWorking.byCode[nestedCode]){
   setBcDetailCode(old=>old===nestedCode?old:nestedCode);
   setBcTab(old=>old==="ALL"?old:"ALL");
  }
  if(mode!=="working"){setMode("working");return;}
  const parent=document.querySelector('[data-component-key="bid.budget.working.bc"]');
  if(!parent)return;
  parent.open=true;
  const exact=[...document.querySelectorAll("[data-component-key]")]
   .find(node=>node.getAttribute("data-component-key")===navigationTarget);
  if(navigationTarget==="bid.budget.working.bc.cost-lines"){
   const lines=document.querySelector('[data-component-key="bid.budget.working.bc.cost-lines"]');
   if(lines?.tagName==="DETAILS")lines.open=true;
  }
  if((navigationTarget==="bid.budget.working.bc.execution-audit"||navigationTarget==="bid.budget.working.bc.b3.mob-demob-economics")){
   const audit=document.querySelector('[data-component-key="bid.budget.working.bc.execution-audit"]');
   if(audit?.tagName==="DETAILS")audit.open=true;
  }
  const target=exact||parent;
  if(typeof target.scrollIntoView==="function")
   target.scrollIntoView({block:"center",behavior:"smooth"});
 },[navigationTarget,navigationSequence,mode,bcDetailCode]);
 
 // Working display defaults only. Never represent the 31.5 planning rate as a BOT quote.
 const DEFAULT_FX={displayCurrency:"THB",fxRate:"31.5",fxDate:"2026-10-10",fxSource:"INTERNAL PLANNING ASSUMPTION — UNVERIFIED"};
 const STORAGE_KEY="pj2608-0553-working-fx-v1";
 const readSettings=()=>{
  try{
   const saved=JSON.parse(window.localStorage.getItem(STORAGE_KEY)||"null");
   if(saved&&["USD","THB"].includes(saved.displayCurrency)&&
     /^\\d+(?:\\.\\d+)?$/.test(String(saved.fxRate))&&Number(saved.fxRate)>0&&
     /^\\d{4}-\\d{2}-\\d{2}$/.test(String(saved.fxDate))&&
     typeof saved.fxSource==="string"&&saved.fxSource.trim())return saved;
  }catch(e){/* Private browsing or storage unavailable: use defaults. */}
  return DEFAULT_FX;
 };
 const [fxSettings,setFxSettings]=useState(readSettings);
 const persistSettings=next=>{
  setFxSettings(next);
  try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(next));}catch(e){/* Session still works. */}
 };
 const displayCurrency=fxSettings.displayCurrency,fxRate=fxSettings.fxRate,fxDate=fxSettings.fxDate,fxSource=fxSettings.fxSource;
 const fx=Number(fxRate)>0&&fxDate&&fxSource.trim()?{thbPerUsd:Number(fxRate),date:fxDate,source:fxSource}:null;
 const isPlanningFx=fxSource===DEFAULT_FX.fxSource;
 const updateFx=(key,value)=>persistSettings({...fxSettings,[key]:value});
 const resetFx=()=>persistSettings({...DEFAULT_FX});
 const price=(n,from="USD")=>formatCommercialAmount(n,from,displayCurrency,fx);
 const bcPriceAudit=selectScopeBcPriceAudit0553({thbPerUsd:fx?.thbPerUsd});
 const releaseModel=buildReleaseCommercialModel0553({thbPerUsd:fx?.thbPerUsd});
 const activePricingView=pricingViewByKey0553(mode);
 const openReleaseSource=(item)=>{
  const key=String(item?.code||item?.mrCode||"").toUpperCase();
  setMode("working");
  if(/^B(?:[1-9]|1[0-4])$|^C[12]$/.test(key)){setBcTab(key);setBcDetailCode(key);}
  window.setTimeout(()=>{
   const sourceDetails=document.querySelector(key.startsWith("A")?
    '[data-component-key="bid.budget.bom"]':'[data-component-key="bid.budget.working.bc"]');
   if(sourceDetails){sourceDetails.open=true;sourceDetails.scrollIntoView({behavior:"smooth",block:"start"});}
  },30);
 };
 const pendingBudget=selectBcOutstandingBudgetReferences0553();
 return <div className="p55-stack" data-component-key="bid.budget">
 <section className="p55-panel" style={{padding:"10px 14px"}}><strong>Budget Workspace</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget"/><p className="p55-note" style={{marginTop:4}}>ส่วนงานย่อยมีรหัส canonical key กำกับที่หัวข้อ ใช้คัดลอกเพื่อสั่งแก้ไขหรือค้นหาโค้ดได้</p></section>
 <details className="p55-panel" data-component-key="bid.budget.particular-source-gates">
  <summary><strong>Budgetary 10 — RFQ Particular Scope &amp; Conflict Gates</strong> · <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.particular-source-gates"/></summary>
  <p className="p55-note">The 04 Documents particular matrix holds {PARTICULAR.records.length} source-linked engineering requirements and {PARTICULAR_CONFLICTS.records.length} cross-document review issues. This budget view references that same source, not a copied rate table or new costing model.</p>
  <p className="p55-note">Working basis: {WORKING_DECISIONS.controls.continuationStatus}. Internal budget proceeds using documented assumptions; original customer scope and prices are unchanged.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Decision</th><th>Budget Basis</th></tr></thead><tbody>
    {WORKING_DECISIONS.workingDecisions.map(d=><tr key={d.id}><td>{d.id}<small>{d.scope}</small></td><td>{d.commercialTreatment}<small>{d.offerBasis}</small></td></tr>)}
  </tbody></table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Engineering Issue</th><th>Budgetary Requirement / Gate</th></tr></thead>
  <tbody>{PARTICULAR_CONFLICTS.records.filter(r=>r.severity==="CRITICAL"||r.severity==="HIGH").map(r=><tr key={r.id}><td>{r.id} · {r.topic}</td><td>{r.siDecisionGate}<small>Engineering Review · No automatic repricing</small></td></tr>)}</tbody></table></div>
  <p className="p55-note">Before adopting a source into Cost: requirement → TAG/site → SI function → physical quantity → vendor proof/AVL → exactly one CBS cost owner. Source notes/comments/appendices and RPT/BLD must be checked as well as MR MTO.</p>
 </details>
 <details className="p55-panel" data-component-key="bid.budget.vendor-evidence-impact">
  <summary><strong>Budgetary 10 · Supplier / Internet / ERP source readiness</strong> · <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.vendor-evidence-impact"/></summary>
  <p className="p55-note">Same read-only source register as Vendor Products; no separate budget-only price master. Unapproved evidence remains reference only and cannot silently overwrite A/B/C.</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Product / Evidence</th><th>Source unit rate</th><th>Budgetary dependency</th><th>Gate</th></tr></thead><tbody>
   {assessVendorEvidenceForBudget0553().rows.map(e=><tr key={e.id}><td><strong>{e.sku}</strong><small>{e.sourceClass} · {e.supplier}</small></td><td>{Number.isFinite(e.unitPrice)?e.currency+" "+e.unitPrice+" / "+(e.unit||"UOM UNVERIFIED"):"NOT VERIFIED"}</td><td>{e.budgetDependency}</td><td>{e.budgetaryRateStatus}<small>{e.technicalState}</small></td></tr>)}
  </tbody></table></div>
  <p className="p55-note">Existing budget projections and historical approved assumptions remain unchanged until explicit engineering/quantity/UOM evidence supports repricing. Missing evidence is not zero cost.</p>
 </details>
 <div className="p55-note" style={{margin:"0 2px"}}><strong>Workflow:</strong> Engineering basis → Required BOM → Scope & Bulk → Cost / Pricing → Internal Summary · ขยายเฉพาะกลุ่มที่ต้องตรวจสอบ</div>
 <section className="p55-panel">
  <div className="p55-eyebrow">COMMERCIAL WORKING PREVIEW <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.pricing"/></div>
  <h2>Engineering → BOM/MTO → Cost → Customer Scope of Supply</h2>
  <p className="p55-note"><strong>MR0001 Cisco-only preliminary subtotal (NOT total project cost):</strong> THB {BID_COST_SPINE_0553.knownPreliminaryCost.THB.toLocaleString("en-US")} · {BID_COST_SPINE_0553.pricedRows} provisionally priced source items / {BID_COST_SPINE_0553.unpricedRows} unpriced · Next G / MGW / other vendors / bulk / A+B+C / customer sell NOT included. Source: {BID_COST_SPINE_0553.source}</p>
  <p className="p55-note">This is a controlled WORKSPACE, not a price release. The previously issued SAMTEL file is historical evidence; its exact issued revision must be verified before snapshot registration. No 0550 rates or facts transferred.</p>
  <div className="p55-filterbar p55-filterbar--simple">
    <div className="p55-segmented p55-segmented--commercial">
    {PRICING_VIEWS_0553.map(view=><button key={view.key} type="button"
     data-component-key={view.moduleId} title={view.number+" — "+view.fullLabel+" · "+view.moduleId}
     aria-pressed={mode===view.key} className={mode===view.key?"is-active":""}
     onClick={()=>setMode(view.key)}>{view.number} · {view.shortLabel}</button>)}
    </div>
    <label>Customer / viewer <select value={recipient} onChange={e=>setRecipient(e.target.value)}>{template.policy.recipients.map(x=><option key={x}>{x}</option>)}</select></label>
  </div>
  <p className="p55-note" data-component-key="bid.budget.pricing.view-reference">
   <strong>Current module:</strong> {activePricingView.number} · {activePricingView.fullLabel} ·
   <ComponentCopyId projectId="PJ2608-0553" componentKey={activePricingView.moduleId}/>
   {" "}· {recipient} · {mode==="working"?"LIVE Working Read Model — Save/Sync is not complete.":mode==="budgetary"?"BUDGET PREVIEW — no authenticated frozen snapshot.":"RELEASE PREVIEW — approval HOLD; selecting this tab does not issue a quotation."}
  </p>
  {recipient==="INTERNAL"&&<PricingSourceGuide0553 onOpenSource={openReleaseSource}/>}
  {recipient==="INTERNAL"&&<PricingCfoDashboard0553 model={releaseModel}/>}
  {mode==="working"&&<>
  <section className="p55-panel">
   <div className="p55-eyebrow">CURRENCY VIEW / ORIGINAL CURRENCY RETAINED</div>
   <div className="p55-filterbar p55-filterbar--simple">
    <label>Display currency <select value={displayCurrency} onChange={e=>updateFx("displayCurrency",e.target.value)}><option value="USD">USD</option><option value="THB">THB</option></select></label>
    <label>FX THB per USD (source-controlled) <input type="number" min="0.000001" step="any" value={fxRate} onChange={e=>updateFx("fxRate",e.target.value)} placeholder="Rate from verified source"/></label>
    <label>FX date <input type="date" value={fxDate} onChange={e=>updateFx("fxDate",e.target.value)}/></label>
    <label>FX source <input value={fxSource} onChange={e=>updateFx("fxSource",e.target.value)} placeholder="BOT publication / reference"/></label>
   </div>
   <p className="p55-note"><strong>{isPlanningFx?"WORKING ASSUMPTION (NOT VERIFIED BOT RATE)":"USER-ENTERED FX — VERIFY SOURCE BEFORE RELEASE"}:</strong> Default 31.5 THB/USD dated 2026-10-10 is a budget display assumption only, not an authenticated BOT rate. Original vendor currencies and amounts remain unchanged. Edits persist in this browser; they do not modify controlled source data. <button type="button" onClick={resetFx}>Reset working default</button></p>
  </section>
  <section className="p55-panel">
   <div className="p55-eyebrow">GOVERNING METHOD · WORKING PREVIEW IS THE ENGINEERING WORKBENCH</div>
    <p className="p55-note"><strong>WORKFLOW:</strong> 10.1 Engineering BOM → 10.2 B/C working WBS &amp; spare derivation (upstream data, not a verified complete cost) → 10.3 Pricing reference → 10.4 Estimate-to-Bid Mapping → 10.5 Scope → 10.6 Customer Workbook. Prerequisites: 04 MR, 05.3 Drawings, 06 Execution, 07 Vendor, 08 Risk, 09 Traceability. Workflow numbers indicate order, not approval.</p>
   <p className="p55-note"><strong>INPUT:</strong> RFQ/MR/MTO/BLD/DTS/RPT/Standards · <strong>DERIVE:</strong> Link/Capacity/Interface Constraints → Physical BOM and quantity → Vendor technical evaluation → WBS Services → Equipment/Service Cost and risk · <strong>OUTPUT:</strong> reviewed engineering working cost. Current MTO sets and quoted vendor quantities are input evidence, NOT verified physical SKU quantities.</p>
  </section>
  <details className="p553-budget-phase p553-source-frame p553-source-frame--equipment" open data-component-key="bid.budget.bom"><summary><strong>10.1 — Engineering Basis & Required BOM</strong><small>bid.budget.bom · MR / MTO / RF proof</small><PricingSourceChip0553 source="equipment" role="owner"/></summary>
   <CostIntegrityReview0553/>
   <SimpleBom0553 focusedLocation={focusedLocation} fx={fx} displayCurrency={displayCurrency}/>
  </details>
  <details className="p553-budget-phase p553-source-frame p553-source-frame--services" data-component-key="bid.budget.working.bc">
   <summary><strong>10.2 — Part B/C Working Cost &amp; Spare Requirements</strong><small>bid.budget.working.bc · WBS / Services / Spares</small><PricingSourceChip0553 source="bc" role="owner"/></summary>
   <section className="p55-panel" style={{padding:"12px 14px"}}>
    <div className="p55-eyebrow">PART B/C WORKING SHEETS / ENGINEERING COST CONTROL <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.working.bc"/></div>
    <h3>Part B/C — Linked Internal Working Detail</h3>
    <p className="p55-note">หน้าตาและการเลือกหมวดเหมือน 10.5 แต่ที่นี่เป็นเจ้าของ Working Source / Direct Cost Evidence; 10.5 เป็น Read-only Customer Scope. ชื่อและ Module ID ของแต่ละรายการใช้ Canonical 10.2 เท่านั้น</p>
    <section className="p55-panel" data-component-key="bid.budget.working.bc.totals" style={{marginBottom:12}}>
     <h4>10.2 — Part B / Part C Working Sell Summary (THB)</h4>
     <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Price scope</th><th>Working Sell THB</th><th>Priced coverage</th><th>Commercial treatment</th></tr></thead><tbody>
      <tr><td><strong>Part B — Base services / spares</strong></td><td className="is-number"><strong>THB {partBWorkingSell.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></td><td>{pricedB.length}/{partBRows.length} codes; pending: {missingB.join(", ")||"none"}</td><td>Partial base working sell; not direct cost or customer released price</td></tr>
      <tr><td><strong>Part C — Optional spares</strong></td><td className="is-number"><strong>THB {partCWorkingSell.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></td><td>{pricedC.length}/{partCRows.length} codes; pending: {missingC.join(", ")||"none"}</td><td>OPTIONAL — not included in Part B base</td></tr>
      <tr><td><strong>B + C — Reference including options</strong></td><td className="is-number"><strong>THB {combinedBCWorkingSell.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></td><td>Sum of priced lines only</td><td>Reference only; not a customer-released quotation</td></tr>
     </tbody></table></div>
     <p className="p55-note">Live source: selectBcTurnkeyWorkingCost0553() · 10.2 Working SELL only. Missing lines are not zero; C1/C2 are kept separate. Historical non-posting references and direct costs are not added.</p>
    </section>
    <RevKAbcOwnershipControl0553 working={bcWorking}/>
    <ScopeCategoryTabs0553 value={bcTab} onChange={code=>{setBcTab(code);setBcDetailCode(code==="ALL"?null:code);}}/>
    <p className="p55-note">Selected module: <strong>{bcTab==="ALL"?"All Part B/C — B1–B14 and C1–C2":bcTab+" — "+bcWorking.byCode[bcTab]?.requirement}</strong> · <ComponentCopyId projectId="PJ2608-0553" componentKey={bcTab==="ALL"?"bid.budget.working.bc":"bid.budget.working.bc."+bcTab.toLowerCase()}/></p>
    </section>
   {bcTab!=="ALL"&&bcWorking.byCode[bcTab]&&<section className="p55-panel" data-component-key={"bid.budget.working.bc."+bcTab.toLowerCase()+".details"}><h4>{bcTab} — Engineering & Cost Detail</h4><BcCostEvidenceDetail0553 workingRow={bcWorking.byCode[bcTab]}/><BcWorkCostLines0553 selectedCode={bcTab}/></section>}
   {bcTab!=="ALL"&&bcPriceAudit.byCode[bcTab]&&<ScopeBcAnnexDetail0553 code={bcTab} fx={fx} mode="working"/>}
   {bcTab!=="ALL"&&bcPriceAudit.byCode[bcTab]&&<p className="p55-note"><strong>Selected {bcTab}:</strong> รายละเอียดแสดงโดยตรงด้านล่างตารางจาก Component เดียวกับ 10.5 โดยไม่ต้องกด ＋ Detail อีกครั้ง</p>}
   <p className="p55-note">WBS values are WORKING SELL references, not complete turnkey costs. SAMTEL/OEM execution remains in turnkey responsibility; missing cost is not zero.</p>
    <p className="p55-note"><strong>CURRENT REV.K FAT / YARD BASIS (18-Oct-2026):</strong> MGW executes MR0001–MR0004 OEM IFAT/FAT at MGW Office in China; ADDVALUE sends 2 paid attendees (plus 1 unbilled standby). MGW DDP delivery is at JUTAL Zhuhai Yard, China. FAT venue/city, approved attendance days, one-trip routing, visa/work permissions, lodging and insured activities remain to confirm. ADDVALUE MGW FAT Witness staff/travel/insurance AND offshore SAT/SIT are B3 Inspection/Testing. B9 is only optional Yard Specialist assistance; direct personnel COST is not established. The former Bangkok integrated FAT and JUTAL Nantong routing in Rev05 are superseded for current 10.2 budget, preserved as audit source only.</p>
   {bcTab==="ALL"&&<section className="p55-panel" data-component-key="bid.budget.working.bc.inline-list"><h4>Working WBS — Separate Part B Base and Part C Options</h4>
    {([{part:"B",title:"Part B — Services / Spares · Base Scope",rows:partBRows,total:partBWorkingSell,missing:missingB},{part:"C",title:"Part C — Optional Spare Parts",rows:partCRows,total:partCWorkingSell,missing:missingC}]).map(group=><section className="p55-panel" key={group.part} data-component-key={"bid.budget.working.bc.part-"+group.part.toLowerCase()} style={{marginBottom:16,padding:12,minWidth:0}}><h4>{group.title}</h4><p className="p55-note">Current Working SELL only. Unpriced codes remain NOT ESTABLISHED; budgetary candidates and earlier revision references are available in source evidence, not added to this table or subtotal without controlled working-sell selection.</p><p className="p55-note"><strong>Working Sell subtotal: THB {group.total.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong> · Priced {group.rows.length-group.missing.length}/{group.rows.length} · Pending: {group.missing.join(", ")||"none"} · {group.part==="C"?"OPTIONAL — excluded from Part B base":"BASE — known priced lines only"}; unresolved values are not zero.</p>
    {group.rows.map(item=><div key={item.code} style={{marginBottom:12,minWidth:0}}><div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{width:"100%",minWidth:1120,tableLayout:"fixed",fontSize:"12px"}}><colgroup><col style={{width:"16%"}}/><col style={{width:"23%"}}/><col style={{width:"10%"}}/><col style={{width:"12%"}}/><col style={{width:"15%"}}/><col style={{width:"24%"}}/></colgroup><thead><tr><th style={{overflowWrap:"anywhere"}}>REF. / MODULE ID</th><th>DESCRIPTION</th><th>QTY / BASIS</th><th>DIRECT COST THB</th><th style={{whiteSpace:"normal",overflowWrap:"anywhere",lineHeight:1.4}}>WORKING SELL THB</th><th style={{whiteSpace:"normal",overflowWrap:"anywhere",wordBreak:"normal",lineHeight:1.4,verticalAlign:"top"}}>SOURCE / ENGINEERING STATUS</th></tr></thead><tbody><tr style={{verticalAlign:"top",overflowWrap:"anywhere",wordBreak:"break-word",whiteSpace:"normal"}} data-component-key={item.moduleId} className={navigationTarget===item.moduleId?"p553-module-nav-target":undefined}><td style={{whiteSpace:"normal",overflowWrap:"anywhere",wordBreak:"break-word"}}><button type="button" className="p553-detail-button" style={{display:"inline-flex",alignItems:"center",gap:6,width:"auto",maxWidth:"100%",whiteSpace:"nowrap",wordBreak:"normal",overflowWrap:"normal",padding:"5px 8px"}} aria-expanded={bcDetailCode===item.code} onClick={()=>setBcDetailCode(old=>old===item.code?null:item.code)}><span aria-hidden="true">{bcDetailCode===item.code?"−":"＋"}</span><span>{item.code} — Detail</span></button><small style={{display:"block",overflowWrap:"anywhere",whiteSpace:"normal"}}>{item.workflowNumber} · {item.moduleId}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={item.moduleId}/></td><td><strong>{item.requirement}</strong><small>{item.executionOwner}</small></td><td>{Number.isFinite(item.qtyDriver)?item.qtyDriver+" "+item.unit:item.unit||"1 LS (scope)"}</td><td>{Number.isFinite(item.directCostTHB)?"THB "+item.directCostTHB.toLocaleString("en-US",{minimumFractionDigits:2}):"COST NOT ESTABLISHED"}</td><td>{Number.isFinite(item.workingSellTHB)?"THB "+item.workingSellTHB.toLocaleString("en-US",{minimumFractionDigits:2}):"NOT ESTABLISHED"}<small>{item.code==="B6"?"MANAGEMENT APPROVED · PRE-AWARD BUDGETARY WORKING SELL · THB · actual logistics quotation after award":item.workingSellBasis||"No current sell evidence"}</small></td><td>{item.b6UpdatedReview?<><strong>UPDATED WORKING REVIEW · {item.b6UpdatedReview.reviewedOn}</strong><small>Approved Working SELL: {Number.isFinite(item.workingSellTHB)?"THB "+item.workingSellTHB.toLocaleString("en-US",{minimumFractionDigits:2}):"PENDING DATA RECONCILIATION"} · sourced from Rev08 · FX 31.5 planning only</small><small>Pre-award budget approval only · Direct Cost NOT VERIFIED · Four-MR freight and Incoterm reconciliation OPEN</small></>:item.costState}<small>{item.requirement} · {item.sourceRevision}</small><small>Contract: {item.contractOwner} · Turnkey: {item.turnkeyEstimator} · Execution: {item.executionOwner}</small><small>Lifecycle activity source rows: {item.requirementCount}; unverified quantities/rates are not treated as zero</small>{item.executionDecision&&<small><strong>Approved FAT / Delivery Strategy:</strong> {item.executionDecision.summary} · {item.executionDecision.decisionId} · {item.executionDecision.costState}</small>}</td></tr></tbody></table></div>{bcDetailCode===item.code&&<section className="p55-panel" data-component-key={item.moduleId+".details"} style={{width:"100%",minWidth:0,overflowX:"auto",marginTop:8,padding:12}}><h4>{item.code} — Engineering &amp; Cost Detail</h4><BcCostEvidenceDetail0553 workingRow={item}/><BcWorkCostLines0553 selectedCode={item.code}/></section>}</div>)}</section>)}
   </section>}
   
   
   <p className="p55-note"><strong>10.2 Source Routing:</strong> {validateBcRoutes0553()?"16/16 customer B/C categories assigned uniquely":"MAPPING ERROR"}. Cost evidence and technical approval remain separate.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Workflow</th><th>Customer Categories</th><th>Working Owner / Source / Next Step</th></tr></thead><tbody>
    {BC_WORKING_ROUTES_0553.map(r=><tr key={r.workflow} data-component-key={bcGroupIdByWorkflow.get(r.workflow)} className={navigationTarget===bcGroupIdByWorkflow.get(r.workflow)?"p553-module-nav-target":undefined}><td>{r.workflow}</td><td>{r.codes.join(", ")}<small>{r.name}</small></td><td>{r.owner}<small>{r.source.join(" + ")} · {r.basis} · {r.next}</small></td></tr>)}
   </tbody></table></div>
   
   <BcExecutionComplianceAudit0553 selectedCode={bcTab}/>
   <p className="p55-note">Legacy lifecycle input contains {LIFECYCLE_SPARES_0553.rows.length} activity requirements. Customer B/C remapping is by activity (not legacy category label); current OEM spare rates and full turnkey costs are still missing.</p>
  </details>
  <details className="p553-budget-phase"><summary><strong>10.3 — Cost & Commercial Pricing Reference</strong><small>bid.budget.pricing · Rev08 historical reference</small></summary>
   <p className="p55-note"><strong>10.3 Current Working Basis:</strong> B/C turnkey direct cost: {Number.isFinite(bcWorking.knownDirectCostTHB)?"THB "+bcWorking.knownDirectCostTHB.toLocaleString("en-US"):"NOT ESTABLISHED"} · B WBS working SELL reference: THB {bcWorking.knownWorkingSellTHB.toLocaleString("en-US",{minimumFractionDigits:2})}. Part A equipment COST and Part B working SELL cannot be summed into a project cost or released customer quotation. C1/C2 are optional. Historical Rev08 below is AUDIT ONLY.</p>
   <CommercialSystemBreakdown0553 displayCurrency={displayCurrency} fx={fx}/>
  <section className="p55-panel">
   <div className="p55-eyebrow">REV08 EXISTING COMMERCIAL BASELINE · PRICES FROM CUSTOMER WORKBOOK</div>
   <h3>Detailed Cost / Selling Price Breakdown — {displayCurrency}</h3>
   <p className="p55-note">ราคาด้านล่างเป็นราคาเสนอเดิมใน Workbook Rev08 ไม่ใช่ Verified Vendor Cost หรือ Working Revised Price และยังไม่ใช่ JUTAL Released Offer · รายการ Qty 1 ของ A/B เป็น Lump Sum ในเอกสาร ไม่ใช่จำนวนอุปกรณ์ติดตั้งจริง</p>
   <div className="p55-metric-grid">
    <div><strong>Part A</strong><p>{price(baseline.partA)}</p></div>
    <div><strong>Part B</strong><p>{price(baseline.partB)}</p></div>
    <div><strong>Base A+B</strong><p>{price(baseline.base)}</p></div>
    <div><strong>Optional C1+C2</strong><p>{price(baseline.options)}</p></div>
   </div>
   <p className="p55-note">Reported base in source: {price(baseline.reportedBase)} · Calculated variance: {price(baseline.base-baseline.reportedBase)} (display values rounded to 4 decimal places).</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
    <thead><tr><th>Item ID</th><th>Customer Description</th><th>Qty basis</th><th>Unit Price ({displayCurrency})</th><th>Total ({displayCurrency})</th><th>State</th></tr></thead>
    <tbody>{REV08_BASELINE.summary.map(([code,name,unitAmount])=><tr key={code}><td><strong>{code}</strong></td><td>{name}</td><td>1 LS</td><td className="is-number">{price(unitAmount)}</td><td className="is-number">{price(unitAmount)}</td><td><span className="p55-badge">{code.startsWith("C")?"OPTION":"REV08"}</span></td></tr>)}</tbody>
   </table></div>
   <h3>Linked detail schedules — Qty × Unit USD</h3>
   {baseline.checks.map(s=><div key={s.code} className="p55-panel">
     <button type="button" className="p55-row-toggle" onClick={()=>toggle("detail-"+s.code)} aria-expanded={expanded.has("detail-"+s.code)}>{expanded.has("detail-"+s.code)?"−":"+"}</button>
     <strong> {s.code} · {template.sheets.find(x=>x.code===s.code)?.name}</strong>
     <span style={{marginLeft:12}}>Summary {price(s.summary)} · Detail {price(s.total)} · Difference {price(s.delta)}</span>
     {expanded.has("detail-"+s.code)&&<div className="p55-table-wrap"><table className="p55-table p55-table--budget">
       <thead><tr><th>No.</th><th>Detailed description (source Rev08)</th><th>Qty</th><th>Unit Price ({displayCurrency})</th><th>Extended Price ({displayCurrency})</th></tr></thead>
       <tbody>{s.items.map(([name,qty,unitAmount],idx)=><tr key={idx}><td>{idx+1}</td><td>{name}</td><td className="is-number">{qty}</td><td className="is-number">{price(unitAmount)}</td><td className="is-number">{price(qty*unitAmount)}</td></tr>)}</tbody>
      </table></div>}
   </div>)}
   <p className="p55-note">Baseline source: 4-Scope of Supply.xlsx, Rev08. These detail lines are not yet fully linked to latest MR/MTO and vendor changes; no edit to original or prior SAMTEL submission.</p>
  </section>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
    <thead><tr><th>＋/−</th><th>Customer Workbook Sheet</th><th>Linked code / origin</th><th>Commercial check</th></tr></thead>
    <tbody>{rows.map(s=><React.Fragment key={s.name}><tr>
      <td><button type="button" className="p55-row-toggle" onClick={()=>toggle(s.name)} aria-expanded={expanded.has(s.name)}>{expanded.has(s.name)?"−":"+"}</button></td>
      <td><strong>{s.name}</strong><small>{s.kind}</small></td>
      <td>{s.code}</td><td><span className="p55-badge">SOURCE RECONCILIATION</span></td>
    </tr>{expanded.has(s.name)&&<tr><td></td><td colSpan={3}>
      <strong>Linked derivation</strong>
      <ul>{template.mappings.filter(x=>s.kind==="SUMMARY"?x.sheet==="Scope of supply":x.sheet===s.name).map(x=><li key={x.code}><code>{x.code}</code> · {x.source} → {x.driver}</li>)}</ul>
      <p className="p55-note">No auto-release or unverified totals. {s.kind==="OPTION"?"Optional Part C excluded from base A+B.":"Confirm installed BOM, source unit price, quantity and FX."}</p>
    </td></tr>}</React.Fragment>)}</tbody>
  </table></div>
  <p><strong>Workbook source:</strong> {template.sourceName} · {template.revision} · 6 sheets. <strong>Export status:</strong> HOLD — original template fidelity and cross-sheet reconciliation not yet validated.</p>
  </details>  <details className="p553-budget-phase"><summary><strong>10.4 — Estimate → Customer Bid Mapping</strong><small>bid.budget.mapping · allocation review</small></summary>
   <EstimateToBidMapping0553/>
  </details>

 </>}
 {/* Downstream Scope summary: after engineering BOM and estimate-to-bid mapping; read-only. */}
   {(mode==="working"||mode==="budgetary")&&<details className="p553-budget-phase" open data-component-key="bid.budget.scope">
   <summary><strong>10.5 — Scope of Supply / A+B+C</strong><small>bid.budget.scope · B10 / B11 / B13 / C1 / C2 · A/B/C</small></summary>
   <p className="p55-note"><strong>Internal engineering reference only:</strong> linked working costs are not an approved customer quotation. Original workbook codes and internal cost categories remain distinct; missing vendor prices are not zero.</p>
   <ScopeSheetsDetail0553 fx={fx} navigationTarget={navigationTarget} navigationSequence={navigationSequence}/>
  </details>}
  
  {mode==="budgetary"&&<><BudgetaryWorkbookPreview0553/><section className="p55-panel">
   <div className="p55-eyebrow">BUDGETARY SUBMISSION · SNAPSHOT REGISTRY</div>
   <h3>Frozen Budgetary Issue — Verification Required</h3>
   <p className="p55-note"><strong>NO VERIFIED ISSUED SNAPSHOT REGISTERED.</strong> A historical Rev08 workbook is available but its exact SAMTEL-issued revision and recipients are still unverified. It is not promoted to Budgetary Submission.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Candidate evidence</th><th>Source</th><th>Issue / approval status</th></tr></thead><tbody>
    <tr><td>4-Scope of Supply.xlsx · Rev08</td><td><a href={"https://drive.google.com/file/d/"+template.sourceId+"/view"} target="_blank" rel="noreferrer">Historical customer workbook</a></td><td>HISTORICAL BASELINE / ISSUED REVISION UNVERIFIED</td></tr>
    <tr><td>Internal Pricing Rev09</td><td><a href={BID_0553_SOURCES.find(x=>x.id==="INT-PRICE-R09")?.url} target="_blank" rel="noreferrer">Source file</a></td><td>INTERNAL ONLY / HOLD</td></tr>
   </tbody></table></div>
   <p className="p55-note"><strong>Required before freeze:</strong> confirmed issued document, recipient, revision, approved commercial amount, source hash, issue timestamp, and management authorization. Working price changes must not rewrite an issued snapshot.</p>
   <p><strong>Customer export:</strong> DISABLED — no authenticated frozen budgetary snapshot.</p>
 </section></>}
 {mode==="released"&&<section className="p55-panel">
   <div className="p55-eyebrow">RELEASED CUSTOMER OUTPUT · APPROVAL GATE</div>
   <h3>Customer Release — HOLD</h3>
   <ReleaseCustomerWorkbook0553 model={releaseModel} recipient={recipient} onOpenSource={openReleaseSource} title="10.3 — Released Customer Output (Read-only staging)"/>
   <p className="p55-note">No JUTAL customer-priced release is authorized. Rev08 historical values and working internal costs are intentionally hidden from this view. Choosing this tab does not approve or issue any document.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Gate</th><th>Required check</th><th>Current status</th></tr></thead>
   <tbody>{BID_0553_GATES.map(g=><tr key={g.id}><td><strong>{g.id}</strong></td><td>{g.title}<small>{g.detail}</small></td><td><span className="p55-badge">{g.status}</span></td></tr>)}</tbody></table></div>
   <p><strong>Price / Approved XLSX / Submission:</strong> HOLD — final technical, commercial, six-sheet reconciliation, authenticated ITB amendment and written approval required.</p>
 </section>}
 <section className="p55-panel"><h3>Release & integrity checklist</h3>
 <p>1. Source MR/MTO/TC/vendor revision → 2. Engineering quantity → 3. Vendor cost & service MH → 4. Summary A/B/C ↔ detail sheets → 5. Freeze per recipient → 6. Approved XLSX export.</p>
 <p className="p55-note">0550 source code remains untouched. State control is based on the reused three-state doctrine, not an independent 0553 pricing policy.</p>
 </section>
 </section>
 {mode==="working"&&<details className="p553-budget-phase" open><summary><strong>10.6 — Customer Proposal Preview · Scope of Supply</strong><small>bid.budget.summary · Customer review layout · no release</small></summary>
  <CustomerProposalPreview0553/>
 </details>}
 <details className="p553-budget-phase"><summary><strong>10.7 — Internal Budget Summary & Review</strong><small>bid.budget.internal · 4 MR systems · historical separation</small></summary>
  <InternalBudgetShortcut0553/>
 </details>
 </div>;
}
