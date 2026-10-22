import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {B3B8SevenDayAllocation0553} from "./B3B8SevenDayAllocation0553";
import {selectBcTurnkeyWorkingCost0553} from "./data/bcTurnkeyWorkingCost0553";
import {selectBcB1B2EquationExecution0553} from "./data/bcB1B2EquationExecution0553";
import {B2WorkingPriceOverview0553} from "./B2WorkingPriceOverview0553";
import {B2IndependentVdrlRecalculation0553} from "./B2IndependentVdrlRecalculation0553";
import {selectBcB5HistoricalPriceBridge0553} from "./data/bcB5HistoricalPriceBridge0553";

// 10.2 owner-local READ ONLY price evidence for B2/B4–B9.
// Never infer document man-hours, unit SELL or payroll from a lump-sum quote.
// Source authority remains bcTurnkeyWorkingCost0553, VDRL register and vendor evidence.
const ROOT="bid.budget.working.bc.";
const fmt=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
// Historical Rev05 THB/MH inputs have 3 decimal places; preserve their exact
// stated rate in the AUDIT view. Do not use this to calculate current B2 cost.
const fmtHistoricalRate=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:3,maximumFractionDigits:3}):"NOT ESTABLISHED";
const qty=n=>Number.isFinite(n)?n.toLocaleString("en-US",{maximumFractionDigits:2}):"NOT ESTABLISHED";
const categories=Object.freeze({
 B2:["engineering","Documentation / VDRL"],
 B4:["fabrication","Painting / Coating"],
 B5:["logistics","Export Packing & Marking"],
 B6:["logistics","Delivery / Freight"],
 B7:["logistics","Storage"],
 B8:["services","Training"],
 B9:["services","Specialist Field Assistance"]
});
const owners=Object.freeze({
 TECHNICAL_B1_OR_OEM:"OEM / B1 Technical Author — verify RACI",
 TEST_EVIDENCE_B3:"OEM / B3 Test Author — verify RACI",
 DOCUMENT_CONTROL_B2_VENDOR_PAYLOAD:"B2 Document Controller; OEM technical payload — verify RACI",
 OWNER_TECHNICAL_REVIEW_PENDING:"Document Controller + technical author to confirm"
});
const idFor=(code,suffix)=>ROOT+code.toLowerCase()+".price-trace"+(suffix?"."+suffix:"");
export const priceTraceId0553=idFor;
const copy=id=><span className="p553-price-trace-copy"
 onClick={e=>{e.preventDefault();e.stopPropagation();}} onKeyDown={e=>e.stopPropagation()}>
 <ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>
 </span>;
function Section({code,num,suffix,title,summary,children,defaultOpen=false}){
 const id=idFor(code,suffix);
 return <details className="p553-bc-price-leaf" data-component-key={id} open={defaultOpen}>
  <summary className="p553-bc-price-leaf-head">
   <span className="p553-bc-price-num">{num}</span>
   <span className="p553-bc-price-leaf-label"><strong>{title}</strong>
    {summary&&<small>{summary}</small>}<code>{id}</code></span>{copy(id)}
  </summary>
  <div className="p553-bc-price-leaf-body">{children}</div>
 </details>;
}
function B2Vdrl({code}){
 const m=selectBcB1B2EquationExecution0553();
 if(m.totals.sourceRows!==143||m.totals.uniqueTitleTypes!==38||
  m.b2WorkingSellTHB!==580000||m.b2CalculatedMH!==null)
  throw Error("B2 VDRL scope count/580000 quote or missing MH authority diverged");
 const mrCodes=["MR-0001","MR-0002","MR-0003","MR-0004"];
 const counts=[37,36,35,35];
 return <div className="p553-price-vdrl">
  <p className="p55-note"><strong>Source authority:</strong> {m.sourceRevision}.
   {" "}143 contractual VDRL requirements and 38 unique title types, NOT 143 confirmed document instances.
   {" "}One register obligation may require multiple revision submissions; instance counts and cycles are OPEN.</p>
  {mrCodes.map((mr,i)=>{
   const group=m.byMr[mr];
   if(group.sourceRows!==counts[i])throw Error("B2 VDRL source row divergence at "+mr);
   const id=idFor(code,"vdrl."+mr.toLowerCase());
   return <details className="p553-bc-price-doc-group" key={mr} data-component-key={id}>
    <summary className="p553-bc-price-leaf-head">
     <span className="p553-bc-price-num">B2.1.{i+1}</span>
     <span className="p553-bc-price-leaf-label"><strong>{mr} — {group.rows[0]?.system}</strong>
      <small>{group.sourceRows} requirement rows · Approval A {group.A}, I {group.I},
       unspecified {group.blank} · MH and per-document SELL not established</small><code>{id}</code></span>{copy(id)}
    </summary>
    <div className="p553-bc-price-leaf-body">
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1350}}>
      <thead><tr><th>Requirement / Module ID</th><th>Document Title / Document No.</th>
       <th>Dossier / Source</th><th>Approval / Submission</th><th>Technical &amp; Document Control Owner</th>
       <th>Document Qty / Revisions</th><th>Position / MH / Rate / SELL</th></tr></thead>
      <tbody>{group.rows.map(row=>{
       const rowId=idFor(code,"vdrl."+row.id.toLowerCase());
       return <tr key={row.id} data-component-key={rowId}>
        <td><strong>{row.id}</strong><small>Table 11 item {row.sourceItem}</small>{copy(rowId)}</td>
        <td><strong>{row.title}</strong><small>{row.projectDocumentNo}</small></td>
        <td>{row.dossier}<small>Page {row.pdfPage??"TBC"}</small>
         <small>{row.evidenceUrl&&<a href={row.evidenceUrl} target="_blank" rel="noreferrer">MR source document</a>}</small></td>
        <td><strong>{row.approvalClass||"NOT STATED"}</strong>
         <small>{row.submissionTrigger||"NOT STATED"}</small></td>
        <td><strong>{owners[row.workKind]||"OWNER VERIFY"}</strong>
         <small>Document control B2; technical payload must NOT be double charged with B1/B3/Part A</small></td>
        <td>Requirement rows: 1
         <small>Actual document instances: {qty(row.documentInstances)}</small>
         <small>Review cycles: {qty(row.revisionCycles)}</small><small>{row.occurrenceRule}</small></td>
        <td><strong>Position assigned: NOT ESTABLISHED</strong>
         <small>Document Controller MH: {qty(row.calculatedB2MH)}</small>
         <small>Author MH: {qty(row.calculatedB1MH)}</small>
         <small>Rate THB/MH: NOT ESTABLISHED</small>
         <small>Allocated Working SELL: NOT ESTABLISHED (included in B2 lump sum only when in B2 scope)</small></td>
       </tr>;
      })}</tbody>
     </table></div>
    </div>
   </details>;
  })}
 </div>;
}
function Pricing({row}){
 const code=row.code;
 const e=row.costEvidence;
 const total=row.workingSellTHB;
 const b5=code==="B5"?selectBcB5HistoricalPriceBridge0553():null;
 const b9=code==="B9"?row.b9ChinaBudget:null;
 return <div className="p553-bc-price-recon">
  <div className="p55-metric-grid">
   <div><strong>Current Working SELL (one owner)</strong><p>{fmt(total)}</p>
    <small>{code==="B9"?"Quoted Base 1 LS; execution requires written call-out":"Only canonical 10.2 owner amount"}</small></div>
   <div><strong>Current Verified Direct Cost</strong><p>{fmt(row.directCostTHB)}</p>
    <small>Missing cost evidence is not zero</small></div>
   <div><strong>Qty / Commercial basis</strong><p>{qty(row.qtyDriver)}</p><small>{row.unit}</small></div>
   <div><strong>Financial authority</strong><p>{row.releaseAllowed?"REVIEW":"RELEASE HOLD"}</p>
    <small>Working SELL is not a supplier invoice or verified payroll cost</small></div>
  </div>
  {code==="B2"&&<section className="p55-panel" style={{padding:12}}>
   <h4>B2 — Historical Rev05 THB 580,000 Quotation / Reconciliation (non-current)</h4>
   <p className="p55-note"><strong>THB 580,000 is the SUPERSEDED Rev05 historical WBS lump sum, not current 10.2 B2 Working SELL.</strong>
    The 143 source rows are not separately priced document instances. There is no validated
    allocation of Qty × document hours × staff role rate or independent direct cost that
    reconciles to this SELL figure. <strong>Do not divide THB580,000 by 143 or 38</strong>
    and treat the result as a real unit rate.</p>
   <p className="p55-note">Rev04 historical proxy range THB 202,717.25–208,217.25 is
    <strong> NOT</strong> current direct cost. Any change to B2 Working SELL requires
    a separate controlled document WBS, effort/rate evidence and approval.</p>
  </section>}
  {code==="B2"&&<section className="p55-panel" style={{padding:12}}>
   <h4>B2 — Historical Role Rate Seeds / Cross-check ONLY</h4>
   <p className="p55-note">Rev05 Workbook 01_COMMERCIAL_BASIS records the following
    historical THB/MH input cost seeds. They are NOT current ADDVALUE payroll,
    NOT assigned B2 staff, and do not allocate the THB580,000 lump sum.
    No role hours, revision cycles or hours per document have been approved.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Historical Role / Position</th><th>Historical Input Cost THB / MH</th>
     <th>Current B2 Allocated MH</th><th>Current B2 Direct Cost</th></tr></thead>
    <tbody>{[
     ["Lead / PM / QA Checker",341.625],
     ["Senior Telecom Engineer",250],
     ["Telecom Engineer",137.5],
     ["CAD / Telecom Drafter",116.625],
     ["Document Controller",104.125]
    ].map(([role,rate])=><tr key={role}><td>{role}</td><td>{fmtHistoricalRate(rate)}</td>
     <td>NOT ESTABLISHED</td><td>NOT ESTABLISHED</td></tr>)}</tbody>
   </table></div>
   <p className="p55-note">Rev04 bounded cost proxy THB202,717.25–208,217.25
    and project office calibration 2.8228342959766093× are HISTORICAL
    price sanity checks only. They do not establish current cost, unit rate,
    or the number of man-hours needed for B2. Source: Rev05
    01_COMMERCIAL_BASIS / 09_B2_DOCUMENTATION.</p>
  </section>}
  {code==="B5"&&<section className="p55-panel" style={{padding:12}}>
   <h4>B5 — Working SELL vs Historic Packing Source</h4>
   <p className="p55-note">Current selected B5 Working SELL: <strong>{fmt(total)}</strong>.
    It uses a historical packing-only reference, not a verified current vendor direct cost.
    The <strong>{fmt(b5.originalB5EmbeddedStorageSellTHB)}</strong> old storage component
    belongs to B7 and is EXCLUDED. MGW quoted SERV-3 USD500 may overlap USD2500 freight packing;
    vendor correction remains OPEN and neither rate is a new B5 posting.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Historical Source Line</th><th>Qty</th><th>Historical Input Proxy / Unit</th>
     <th>Historical SELL reference</th><th>Status / Inclusion</th></tr></thead>
    <tbody>{b5.sourceLines.map(x=><tr key={x.id}>
     <td><strong>{x.id}</strong> — {x.description}</td><td>{qty(x.count)} {x.unit}</td>
     <td>{fmt(x.sourceUnitCostTHB)}</td><td>{fmt(x.historicalSellTHB)}</td>
     <td>{x.sourceState}<small>{x.note}</small></td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note">Historical packing-only total {fmt(b5.originalB5PackingOnlySellTHB)};
    no automatic reassessment of selected SELL and no duplicate OEM packing.</p>
  </section>}
  {code==="B6"&&<section className="p55-panel" style={{padding:12}}>
   <h4>B6 — Transportation Working SELL Source</h4>
   <p className="p55-note">{fmt(total)} is a Rev08 transportation Working SELL reference
    converted using internal planning FX 31.5, <strong>NOT a quotation from MGW</strong>
    or a shipment-level rate. Supplier USD2500 Nantong→JUTAL road freight is contained
    ONCE in the 20-Oct MGW cover; it must be reconciled with the B6 cost owner,
    supplier packing USD500, delivery terms, and original equipment A inclusion.
    There is no approved allocation of the B6 Working SELL to four MR cargo legs.</p>
   <p className="p55-note"><strong>OWNER-APPROVED B6 Physical Routing (ADR-68 · 22-Oct-2026):</strong>
    NextG <strong>IDU 4 + ODU 4 + ALL 5 Greenfield Antennas</strong> to MGW Nantong
    directly; Thailand receives <strong>Enclosure + Cisco 4 sets</strong>, performs
    approved bench preassembly/wiring and preliminary electrical QA, then exports
    these four protected sets to MGW for final integration/FAT. No antenna diversion
    direct to JUTAL. MGW MR0002/0003/0004 OEM items remain China-bound for combined FAT,
    without an artificial Thailand transit. The original NextG
    <strong> NG/260916-ADV-DAP1 / DAP Ranong</strong> delivery quotation has expired
    and has NOT been amended to MGW Nantong; destination/Incoterm, freight credit
    and supplier dispatch still require confirmation.
    <strong> Selected B6 Working SELL {fmt(total)} remains unchanged.</strong>
    No verified saving, increment, tariff or actual logistics COST has been posted.</p>
   <p className="p55-note"><strong>Earlier all-Thailand scenario (comparison only):</strong>
    four preassembled cabinets (not ODU/antenna freight) to MGW Nantong; planning-only
    inbound allowance <strong>{fmt(row.b6Mr0001ChinaInboundEvidence?.preliminaryInboundLowTHB)}
    – {fmt(row.b6Mr0001ChinaInboundEvidence?.preliminaryInboundHighTHB)}</strong> (scenario,
    NOT additional selected SELL). MGW SERV-5 USD2,500 is Nantong→JUTAL quoted once;
    the Thailand→Nantong inbound leg, customs, taxes, cargo value and four-set dimensions
    are not covered by proof. The compared scenario does NOT price the complete
    NextG radio/antenna shipment. MGW SERV-5 outbound USD2500 includes packing
    per supplier message; separately quoted SERV-3 USD500 creates an overlap check,
    not an automatic credit. Compare all four MR legs against B6 owner before
    selecting an actual delta.</p>
  </section>}
  {code==="B7"&&<section className="p55-panel" style={{padding:12}}>
   <h4>B7 — Storage Reserve</h4>
   <p className="p55-note">Current <strong>{fmt(total)}</strong> = a
    management-selected one-month conditional storage allowance.
    This is a planned lump sum for one month, NOT a vendor quotation or a verified monthly rate.
    Charge only where the OEM/SAMTEL storage period is insufficient.
    Legacy three-month storage allocation in older B5 must not be booked twice.</p>
   <p className="p55-note"><strong>Customer requires 3 months FREE at Vendor Workshop.</strong>
    MGW P26-058_R2 contains no storage charge or written inclusion commitment.
    Public 2026 China pallet-price reference for 4 assumed pallets / 90 days:
    <strong>{fmt(row.b7ThreeMonthStorageEvidence?.marketThreeMonthBarePalletTHBLow)}
    – {fmt(row.b7ThreeMonthStorageEvidence?.marketThreeMonthBarePalletTHBHigh)}</strong>
    (bare space only; not MGW workshop quote). Full three-month reserve at historical
    internal THB30,000/month would be THB90,000, with THB60,000 additional
    NONPOSTING sensitivity. Confirm actual pallet/CBM, vendor free period and
    handling/protection fees before revising B7 Selected Working SELL.</p>
  </section>}
  {code==="B8"&&<section className="p55-panel" style={{padding:12}}>
   <h4>B8 — Training WBS Source</h4>
   <p className="p55-note">Current <strong>{fmt(total)}</strong> is a Working SELL WBS allowance;
    Rev05 identifies <strong>44 MH</strong> of training scope, but the allocated positions,
    trainer hours per session, number of trainee groups, rate per role, sessions, materials
    and OEM-included courses are not independently verified. THB 30,000 is not
    an approved hourly-rate calculation. Do not treat THB30,000/44 as an agreed rate.</p>
  </section>}
  {code==="B9"&&<section className="p55-panel" style={{padding:12}}>
   <h4>B9 — Quoted Senior Telecom Engineer Package (one Lump Sum)</h4>
   <p className="p55-note"><strong>Current B9 quoted Base {fmt(total)}.</strong> The same on-call Yard package has
    source Working SELL <strong>{fmt(b9.conditionalYardSellTHB)}</strong>, consisting of one
    Senior Telecom Systems Integration Engineer, seven Yard working days plus travel,
    lodging, insurance and related allowance rows. This amount is included ONCE in
    B1–B14 Base; execution requires written request. The legacy 12 team-day/THB574,560 WBS is superseded and non-posting.
    FAT witnesses belong only in B3.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Call-out Item / Module ID</th><th>Role / Activity</th><th>Qty × Unit</th>
     <th>Working SELL rate THB</th><th>Included B9 Working SELL THB</th><th>Cost authority</th></tr></thead>
    <tbody>{b9.rows.filter(x=>x.costOwner==="B9").map(x=><tr key={x.id}>
     <td><strong>{x.id}</strong><small>{x.moduleId}</small>{copy(x.moduleId)}</td>
     <td>{x.description}</td><td>{qty(x.qty)} {x.unit}</td>
     <td>{fmt(x.unitRateTHB)}</td><td>{fmt(x.workingSellTHB)}</td>
     <td>{x.status}<small>Verified Direct Cost: NOT ESTABLISHED</small></td>
    </tr>)}</tbody>
    <tfoot><tr><th colSpan={4}>Quoted B9 Base once — execution upon written call-out</th>
     <th>{fmt(b9.conditionalYardSellTHB)}</th><th>Written RACI / call-out required</th></tr></tfoot>
   </table></div>
  </section>}
  {["B4"].includes(code)&&<p className="p55-note"><strong>Painting / Coating:</strong>
   no unique coating surface area, quantity or priced extra scope has been established.
   Verify OEM/Part A inclusion before adding any B4 Working SELL.</p>}
  <p className="p55-note"><strong>Control:</strong> {row.workingSellBasis||"Unknown current pricing basis"}.
   {" "}Original source {e.sourceSheet} — {e.sourceRevision}. No independent cost posting from this view.</p>
 </div>;
}
function PhysicalDrivers({row}){
 const code=row.code;
 const drivers=(row.costEvidence?.lines||[]);
 const sourceRows=(row.workCostLines||[]);
 return <div>
  <p className="p55-note">Scope and quantities are displayed as source evidence ONLY.
   Historical source cost/SELL values, if any, are not the current price. No unverified
   resource-hours, productivity or rate is invented from the total.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Driver / Source ID</th><th>Physical Activity / Deliverable</th>
    <th>Qty / Unit</th><th>Rate THB</th><th>Amount THB</th><th>Evidence / Cost Gate</th></tr></thead>
   <tbody>{drivers.map(x=><tr key={x.id}>
    <td><strong>{x.id}</strong></td><td>{x.activity}</td>
    <td>{qty(x.quantity)} {x.unit}</td><td>{fmt(x.rateTHB)}</td>
    <td>{fmt(x.amountTHB)}<small>{x.valueClass}</small></td>
    <td>{x.evidence}<small>{x.status}</small></td>
   </tr>)}
   {sourceRows.filter(x=>!drivers.some(p=>p.id===x.id)).map(x=><tr key={x.id}>
    <td><strong>{x.id}</strong><small>{x.moduleId}</small>{copy(x.moduleId)}</td>
    <td>{x.name}</td><td>{qty(x.quantity)} {x.unit}</td>
    <td>{fmt(x.workingSellRateTHB)}</td><td>{fmt(x.workingSellTHB)}</td>
    <td><strong>Historical / Cost Driver view — not additive</strong>
     <small>{x.scopeGate}</small><small>{x.sourceRef}</small></td>
   </tr>)}</tbody>
  </table></div>
 </div>;
}
function Resource({row}){
 const code=row.code,e=row.costEvidence;
 return <div>
  <p className="p55-note"><strong>WHO / MH / Rate:</strong> Current verified team,
   position, hours and payroll rates have NOT been established for this cost owner
   unless a separate source-controlled WBS is shown. The source allowance alone
   does not prove paid Direct Cost.</p>
  {code==="B2"&&<p className="p55-note">Expected functions: Document Controller (register, number,
   transmit and chase approval); OEM/B1 technical author for drawings/calculations;
   OEM/B3 author for FAT/SAT test reports. These are
   <strong> cost-ownership candidates, not approved assigned positions or MH</strong>.
   Engineering design content must not be charged again through B2.</p>}
  {code==="B8"&&<p className="p55-note">Trainer discipline and sessions by MR0001–0004,
   number of trainees, training days/total 44 source MH allocation and
   OEM-provided materials remain to validate.</p>}
  {code==="B9"&&<p className="p55-note">Quoted Sr Telecom Systems Integration Engineer:
   7 Yard working days and 2 travel days, 1 person selected.
   The second standby specialist is UNBILLED labour in the offer but could still
   incur internal cash cost. Actual payroll Direct Cost stays open.</p>}
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Required cost / effort input</th><th>Current evidence status</th></tr></thead>
   <tbody>{e.requiredInputs.map((text,i)=><tr key={i}><td>{text}</td>
    <td>NOT VERIFIED — input required before detailed cost derivation</td></tr>)}</tbody>
  </table></div>
 </div>;
}
export function BcOwnerPriceTrace0553({workingRow,auditContent=null,sourceContent=null}){
 if(!workingRow||!categories[workingRow.code])return null;
 const code=workingRow.code;
 const [tone,label]=categories[code];
 const id=idFor(code);
 const root=React.useRef(null);
 const setAll=open=>root.current?.querySelectorAll("details.p553-bc-price-leaf, details.p553-bc-price-doc-group")
  .forEach(x=>{x.open=open;});
 if(!workingRow.costEvidence||workingRow.directCostTHB!==null)
  throw Error("B/C price trace must not imply a verified Direct Cost");
 if(code==="B2"&&(!workingRow.b2WorkingSellDecision||
  workingRow.workingSellTHB!==workingRow.b2WorkingSellDecision.selectedWorkingSellTHB||
  workingRow.workingSellTHB!==237121.13||workingRow.b2PriorWorkingSellReferenceTHB!==580000))
  throw Error("B2 owner trace must display independent 131-WO Working SELL; Rev05 is historical only");
 return <section ref={root} className={"p55-panel p553-bc-price-trace p553-bc-price-trace--"+tone}
  data-component-key={id}>
  <div className="p553-bc-price-head">
   <div><h4>{code} — {label} · Working SELL Evidence</h4>
    <p className="p55-note"><strong>Current Working SELL {fmt(workingRow.workingSellTHB)}</strong>
     {" "}· Direct Cost NOT ESTABLISHED · Single Cost Owner {code}</p>
    <p className="p55-note">Module ID: {copy(id)}</p>
   </div>
   <div className="p553-bc-main-actions">
    <button type="button" className="p553-detail-button" onClick={()=>setAll(true)}>＋ Expand All</button>
    <button type="button" className="p553-detail-button" onClick={()=>setAll(false)}>− Collapse All</button>
   </div>
  </div>
  {code==="B8"&&<B3B8SevenDayAllocation0553
   b3={selectBcTurnkeyWorkingCost0553().byCode.B3} b8={workingRow} owner="B8"/>}
  {code==="B2"&&<B2IndependentVdrlRecalculation0553 workingRow={workingRow}/>}
  {code==="B2"&&<details className="p55-panel p553-b2-legacy-price-reference"
   data-component-key="bid.budget.working.bc.b2.quote-comparison"
   style={{padding:12,marginTop:12}}>
   <summary><strong>B2 Rev05 Historical SELL THB 580,000 — REPLACED / NOT USED IN CURRENT WORKING</strong>
    {" "}<small>Open only to compare the previous source WBS and original revisions;
    the independent VDRL estimate above uses no old selling-price target</small></summary>
   <B2WorkingPriceOverview0553 workingRow={workingRow}/>
  </details>}
  <Section code={code} num={code+".1"} suffix="work-scope"
   title={code==="B2"?"VDRL / Document Register by MR":"Work Type / Physical Deliverables"}
   summary={code==="B2"?"MR0001–0004 · 143 requirement rows / 38 unique title types":
    "Scope and source work drivers; no invented quantities"} defaultOpen>
   {code==="B2"?<B2Vdrl code={code}/>:<PhysicalDrivers row={workingRow}/>}
  </Section>
  <Section code={code} num={code+".2"} suffix="price-reconciliation"
   title="Qty × Rate × Working SELL / Cost Reconciliation"
   summary="Canonical owner amount vs source proof; missing line rates stay OPEN" defaultOpen>
   <Pricing row={workingRow}/>
  </Section>
  <Section code={code} num={code+".3"} suffix="resource-man-hours"
   title="Roles / Man-hours / Resource & Rate Verification"
   summary="WHO · HOW MANY · HOURS · RATE · OPEN INPUTS">
   <Resource row={workingRow}/>
  </Section>
  <Section code={code} num={code+".4"} suffix="source-audit"
   title="Vendor Evidence / Previous Source / Cost Ownership Audit"
   summary="Read-only historical and quote evidence — NOT another price posting">
   {sourceContent}
   {auditContent}
  </Section>
 </section>;
}
