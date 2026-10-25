import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectScopeBcPriceAudit0553} from "./data/scopeBcPriceAudit0553";
import {selectUnifiedSpareConsumables0553} from "./data/unifiedSpareConsumables0553";
import {selectSpareCoverageEngineering0553} from "./data/spareCoverageEngineering0553";
import {selectSpareCustomerSchedule0553} from "./data/spareCustomerSchedule0553";
import {selectDocumentSpareObligations0553} from "./data/documentSpareObligations0553";
import {selectAddvalueB14Insurance0553} from "./data/addvalueB14Insurance0553";
import {selectB1RegulatoryCost0553} from "./data/b1RegulatoryCost0553";
import {selectSatToolReadiness0553} from "./data/satToolReadiness0553";
import {selectSpareEngineeringReconciliation0553} from "./data/spareEngineeringReconciliation0553";
import {selectB10ItemizedPurchaseEvidence0553} from "./data/b10ItemizedPurchaseEvidence0553";
import {B10ItemizedPurchasingEvidence0553} from "./B10ItemizedPurchasingEvidence0553";
import {B10PriceToWinScenario0553} from "./B10PriceToWinScenario0553";
import {B10KitPriceSummary0553} from "./B10KitPriceSummary0553";

const thb=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const usd=n=>Number.isFinite(n)?"USD "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"NOT ESTABLISHED";
export function ScopeBcAnnexDetail0553({code,fx=null,mode="scope",onOpenReleaseRow=null,onOpenSource=null}){
 const m=selectScopeBcPriceAudit0553({thbPerUsd:fx?.thbPerUsd});
 const p=m.byCode[code];
 const shared=selectUnifiedSpareConsumables0553();
 const customerSchedule=selectSpareCustomerSchedule0553();
 const documentObligations=selectDocumentSpareObligations0553();
 const addvalueInsurance=code==="B14"?selectAddvalueB14Insurance0553():null;
 const b1Regulatory=code==="B1"?selectB1RegulatoryCost0553():null;
 const satToolReadiness=code==="B3"?selectSatToolReadiness0553():null;
 const spareReconciliation=selectSpareEngineeringReconciliation0553();
 const spareLines=customerSchedule.currentByCode?.[code]||customerSchedule.byCode[code]||[];
 const b10ItemizedEvidence=code==="B10"?selectB10ItemizedPurchaseEvidence0553():null;
 const coverage=["B10","B11","B13","C1","C2"].includes(code)?selectSpareCoverageEngineering0553():null;
 const inWorking=mode==="working";
 const moduleId=inWorking?"bid.budget.working.bc."+String(code||"").toLowerCase()+".detail":p?.moduleId;
 if(!p)return <p role="alert">Unsupported customer scope code: {code}</p>;
 if(code==="B10"&&!inWorking)return <section className="p55-panel p553-b10-scope-compact"
   data-cost-owner="B10" data-component-key={moduleId} style={{padding:12}}>
   <B10KitPriceSummary0553 rows={spareLines} currency="THB"
    total={customerSchedule.currentBudgetaryByCode.B10} variant="scope"
    internal={typeof onOpenSource==="function"||typeof onOpenReleaseRow==="function"}
    onOpenSource={onOpenSource} onOpenReleaseRow={onOpenReleaseRow}/>
 </section>;
 return <section className="p55-panel" data-cost-owner={code} data-component-key={moduleId} style={{padding:14}}>
  <div className="p55-eyebrow">{inWorking?"10.2 WORKING COST DETAIL":"10.5 CUSTOMER SCOPE DETAIL"} · PRICE SOURCE AUDIT (THB display)</div>
  <h3>{p.code} — {p.description}</h3>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={moduleId}/>
   {" "}· Current cost owner: <code>{p.ownerModuleId}</code>
   {" "}· <strong>{p.optional?"PART C OPTION — NOT IN BASE":"PART B — BASE SCOPE REQUIREMENT"}</strong></p>
  <div className="p55-metric-grid">
   <div><strong>Current Turnkey Direct COST</strong><p>{thb(p.directCostTHB)}</p><small>Source-verified Cost Rate × Verified Qty required</small></div>
   <div><strong>New PTTEP First-Principles Working Estimate</strong><p>{thb(p.workingSellTHB)}</p><small>{["B10","B11","B13","C1","C2"].includes(code)?"Unquoted Engineering Parametric Allowance · 2026 planning only · OEM SPIR, SKU, DDP proof OPEN":"Current Working SELL"}</small></div>
   <div><strong>Historical Rev08 Reference</strong><p>{thb(p.historicalReferenceTHB)}</p><small>Native USD source retained for audit · {p.historicalFxState}</small></div>
  </div>
  <p className="p55-note"><strong>Scope price status:</strong> {p.currentPriceState} · {p.costState} · <strong>Historical references must NOT post to the current cost/sell ledger.</strong> {p.controlNote}</p>
  {["B10","B11","B13","C1","C2"].includes(code)&&<details
   className="p55-panel p553-spare-oem-verification" open={inWorking} style={{padding:12}}
   data-component-key={"bid.budget.working.bc."+code.toLowerCase()+".spare-engineering-review"}>
   <summary><strong>{code} — OEM Spare Verification / Purchasing Scope Review</strong>
    <small>{spareReconciliation.verificationRows.filter(x=>x.code===code).length} Rev08 candidates ·
     {spareReconciliation.priorityRows.filter(x=>x.code===code).length} high-risk gaps ·
     No independently verified spare SKU or purchased stock</small></summary>
   <p className="p55-note"><strong>Evidence basis:</strong>
    <a href="https://drive.google.com/file/d/1aFGpjocp4YUlsTEewTTvw9-BDi1mz5ZL/view" target="_blank" rel="noreferrer">EXA-A8 Att-1 Minimum Spares</a>
    {" · "}
    <a href="https://drive.google.com/file/d/1J3jkvf9e-tbFAiGwrK0s_bVIbH6pmUZ7/view" target="_blank" rel="noreferrer">EXA-A8 Att-2 Telecom Tools</a>
    {" · "}
    <a href="https://drive.google.com/file/d/1LHfQU0yg2O9GwLhHnVyBPxtfPfrI1Jzo/view" target="_blank" rel="noreferrer">MGW P26-058_R2 (Installed Supply Only)</a>.
    Engineering finding is traceable to the exact source; none is an approved OEM spare SPIR.</p>
   <p className="p55-note"><strong>Engineering assessment completed against current available evidence:</strong>
    MR Rev.C1 / EXA-A8 / MGW R2 installed quotation and seller clarification.
    Listed candidate OEM models are NOT approved replacement spare part numbers.
    Each row below states exactly what the selected supplier must provide to prove
    physical interchangeability, scope and pricing. No Qty/Working SELL changes or
    automatic credit are made by this review.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Original Item / Source</th><th>Installed Model Candidate (not spare SKU)</th>
     <th>Finding / Risk</th><th>Remaining OEM Proof / Action</th><th>Commercial Treatment</th></tr></thead>
    <tbody>{spareReconciliation.verificationRows.filter(x=>x.code===code).map(x=><tr key={x.id}>
     <td><strong>{x.description}</strong><small>{x.id} · Qty {x.sourceQty} (Rev08 reference)</small></td>
     <td>{x.installedCandidateSku||"Not established"}<small>{x.evidence}</small></td>
     <td><strong>{x.severity==="HIGH"?"HIGH — ":""}{x.conflict}</strong>
      <small>{x.technicalGap}</small></td>
     <td>{x.requiredVendorAnswer}<small>Accepted replacement SKU / approved Qty / quoted Direct COST: NOT ESTABLISHED</small></td>
     <td>REFERENCE ONLY · no additional posting<small>B10/B11/B13 Base / C1/C2 Options retain original boundaries; Release HOLD</small></td>
    </tr>)}</tbody></table></div>
   {code==="B10"&&<p className="p55-note"><strong>Document minimum:</strong> 14 commissioning/start-up
    spare KITS (MR0001–0004: 4/3/4/3). The 9 historical B10 item descriptions are not
    a substitute for 14 itemized OEM commissioning kit bills. EXA-A8 Att-1 applies
    to the actual equipment/rating and must not be mechanically imposed on every telecom item.</p>}
   {code==="B11"&&<p className="p55-note"><strong>Vendor inclusion:</strong> MGW Paul email 20-Oct confirms RACON
    programming kit included; exact OEM kit content, quantity and handover still OPEN.
    Do not buy/price the same kit twice. The historical TETRA voice gateway tool
    does not automatically apply to the selected DMR/RFI BDA design. EXA-A8 Att-2 has five telecom tool/license
    functions, while the historical B11 contains four priced rows: reconcile by function
    and actual project-wide license/tool rights, not by row count.</p>}
   {code==="B13"&&<p className="p55-note"><strong>Preservation:</strong> the 4 historical consumable
    lines are provisional; confirm activity-driven replenishment and distinctly
    handed-over stock versus B5 shipping packing. Unknown direct cost stays NULL.</p>}
   {code==="C1"&&<p className="p55-note"><strong>Capital spare:</strong> historical MDS/ORGA
    is an alternate price basis, not a spare part interchangeable with selected
    MGW/Tideland. Independently sourced Tideland spare quote still missing;
    C1 is NOT in Base.</p>}
   {code==="C2"&&<p className="p55-note"><strong>Overlap screening:</strong>
    {spareReconciliation.engineeringSummary.possibleB10C2DuplicateFamilies} C2 spare families
    have potential B10 start-up stock overlap, with
    <strong> {thb(spareReconciliation.engineeringSummary.possibleC2DuplicateHistoricalReferenceTHB)}</strong>
    as historical C2 reference exposed to verification, NOT confirmed savings or an approved price deduction.</p>}
   {code==="C2"&&<p className="p55-note"><strong>Attachment 7 instruction 6:</strong>
    items physically listed in start-up B10 shall be excluded from 2-year operating
    spare quotation once identical part numbers are proven. Do not automatically
    remove historical C2 lines before SKU reconciliation.
    Notice: MGW UHF-4 specifies 1/2-inch RF feeder; historic C2 requests 7/8-inch,
    so cable/connector specification requires particular attention.</p>}
  </details>}
  {code==="B1"&&<div className="p55-panel" style={{padding:12}}>
   <h4>B1 — Regulatory, Import &amp; Operating Licence Coordination (ADDVALUE)</h4>
   <p className="p55-note"><strong>Cost owner:</strong> ADDVALUE · First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model. Historical Rev05 engineering evidence is retained for audit only and NOT carried into current B1 Working SELL. New B1.1–B1.8 role-based project support is the current pricing basis; current Myanmar service/fee/reserve package is included once. The legacy requirement rows below remain nonposting evidence, not missing current budget.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Internal Ref</th><th>Description</th><th>Role</th><th>Quantity Driver</th><th>Qty</th><th>Unit Rate THB</th><th>Amount THB</th><th>Owner / Source Gate</th></tr></thead>
    <tbody>{b1Regulatory.rows.map(x=><tr key={x.id}>
     <td>{x.id}</td><td><strong>{x.description}</strong><small>{x.category} / {x.unit}</small></td>
     <td>{x.role}</td><td>{x.driver}<small>{x.purposeKey}</small></td>
     <td>{Number.isFinite(x.quantity)?x.quantity:"TO DERIVE"}</td>
     <td>{thb(x.rateTHB)}</td><td>{thb(x.budgetExtendedTHB)}</td>
     <td>{x.owner} · {x.sourceRateStatus}<small>{x.source}</small><small>{x.riskClass}</small></td>
    </tr>)}</tbody>
   </table></div>
   <h4>Existing Rev05 WBS / Milestone Evidence — No ERP</h4>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>WBS Activity</th><th>Original Owner</th><th>Team-Days</th><th>Personnel-Days</th><th>Trips</th><th>May Assign to B1 Permit Travel?</th></tr></thead>
    <tbody>{b1Regulatory.wbsMilestoneAudit.knownCampaigns.map(x=><tr key={x.id}>
     <td>{x.id}</td><td>{x.owner}</td><td>{x.teamDays}</td><td>{x.personDays}</td><td>{x.tripCount??"Not established"}</td>
     <td>NO — existing {x.owner} cost ownership</td>
    </tr>)}</tbody></table></div>
   <p className="p55-note"><strong>WBS Sheet 20_CUSTOMS_PERMIT:</strong> permit and customs requirements are documented, but dedicated ADDVALUE regulatory travel trips, travelers and accommodation nights are not scheduled. Quantity remains <strong>TO DERIVE</strong>. {b1Regulatory.wbsMilestoneAudit.regulatoryMilestone.gate}</p>
   <p className="p55-note"><strong>Incremental Direct Cost:</strong> NOT ESTABLISHED · <strong>Incremental Working Sell:</strong> NOT POSTED. Regulatory Travel/MOB/DEMOB is only under B1 when its separate Trip ID is linked to permit coordination; exclude SAT B3, goods logistics B6, China Yard Specialist B9 and insurance B14.</p>
   <p className="p55-note"><strong>Compliance:</strong> Only lawful, evidenced authority fees and actual third-party services; unofficial facilitation or influence payments are excluded.</p>
  </div>}
  {code==="B3"&&satToolReadiness&&<div className="p55-panel" data-component-key="bid.budget.working.bc.b3.sat-tools" style={{padding:12}}>
   <h4>B3 — SAT Test Equipment Compliance (non-posting engineering evidence)</h4>
   <p className="p55-note">MR0001 SCADA · MR0002 RFI BDA/DAS · MR0003 Ex Phone/Sounder · MR0004 ORGA RACON. Tool readiness is NOT a SAT pass, supplier quotation, working direct cost or automatic Working Sell update. VeEX MX100+ budget: <strong>30 days × THB 1,000/day = THB 30,000 (ex VAT)</strong>, included ONCE in current B3 Working Sell with no markup planning assumption. Rental receipt/campaign dates and verified Direct Cost remain open; other calibrated RF/audio/marine equipment costs are unpriced.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>MR / Test IDs</th><th>Tool / Instrument</th><th>Acquisition</th><th>Rate</th><th>Extended Cost</th><th>Source Status / Gate</th></tr></thead>
    <tbody>{satToolReadiness.rows.map(x=><tr key={x.id}>
     <td><strong>{x.mr}</strong><small>{x.system}</small><small>{x.tests}</small></td>
     <td>{x.item}<small>{x.id}</small></td>
     <td>{x.method}<small>Owner: {x.owner}</small></td>
     <td>{Number.isFinite(x.unitRateTHB)?thb(x.unitRateTHB)+" / "+x.rateUnit:"NOT ESTABLISHED"}</td>
     <td>{Number.isFinite(x.extendedCostTHB)?thb(x.extendedCostTHB):"NOT ESTABLISHED"}</td>
     <td>{x.status}<small>{x.gate}</small></td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note"><strong>RACON approval holds:</strong> {satToolReadiness.holds.map(x=>x.id+" — "+x.detail).join(" | ")}</p>
   <p className="p55-note"><strong>Ledger policy:</strong> No automatic posting. Existing RF Explorer PO is not a new purchase cost; OEM-included ORGA purge/programming kits require confirmation in the current MGW offer. Rental, calibration, marine vessel and travel costs require evidence and explicit owner allocation.</p>
  </div>}
  {code==="B14"&&<div className="p55-panel" style={{padding:12}}>
   <h4>ADDVALUE — Personnel &amp; Work-Related Insurance Budget (B14)</h4>
   <p className="p55-note"><strong>ADDVALUE only:</strong> no SAMTEL bond, bank guarantee or EPC master insurance is added. Four personnel roles are registered; only Senior Telecom Technician and Chief Telecom Technician are assigned to SAT/offshore for this budget.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Item</th><th>Insurance / Work Scope</th><th>Persons</th><th>Days / Period</th><th>Qty</th><th>Budget Rate THB</th><th>Amount THB</th><th>Evidence / Qualification</th></tr></thead>
    <tbody>{addvalueInsurance.entries.map(x=><tr key={x.id}>
     <td>{x.id}</td><td>{x.description}<small>{x.unit}</small></td>
     <td>{x.persons}</td><td>{x.days}</td><td>{x.qty}</td><td>{thb(x.rateTHB)}</td><td>{thb(x.estimatedTHB)}</td>
     <td>{x.rateClass}<small>{x.basis}</small></td>
    </tr>)}</tbody>
    <tfoot><tr><th colSpan={6} style={{textAlign:"right"}}>ADDVALUE Personnel Insurance Budget — Management Allowance (THB)</th><th>{thb(addvalueInsurance.totalBudgetTHB)}</th><th>NOT INSURER-QUOTED / NOT YET POSTED TO WORKING SELL</th></tr></tfoot>
   </table></div>
   <p className="p55-note"><strong>Four ADDVALUE positions:</strong> {addvalueInsurance.roles.map(x=>x.role).join("; ")}. <strong>SAT offshore team:</strong> {addvalueInsurance.offshoreSATCrew.join(" + ")}. Offshore {addvalueInsurance.b3OffshoreWorkingPersonDays} person-days; provisional China Yard {addvalueInsurance.b9ChinaProvisionalPersonDays} person-days (actual travelers pending).</p>
   <p className="p55-note"><strong>Safety/coverage gate:</strong> General PA and travel insurance can EXCLUDE offshore oil/gas work. The offshore rate is a management allowance only, NOT evidence that the worker is insured. Obtain a policy explicitly covering offshore telecom work, medical treatment and evacuation before mobilization. Existing company policies and any EPC coverage must be deducted to avoid duplication.</p>
   <p className="p55-note">Original Rev08 B14 {thb(p.historicalReferenceTHB)} remains a separate summary-only SAMTEL bond/insurance reference. It is NOT added to the ADDVALUE-only allowance.</p>
  </div>}
  {["B10","B11","B13","C1","C2"].includes(code)&&<details className="p55-panel" open={code==="C1"||code==="B10"} style={{padding:12}}>
   <summary><strong>02 Document-Driven Quantity Basis → 10.2 {code}</strong> · MR0001–0004 (not an additional price)</summary>
   <p className="p55-note">First Principles + Telecom Constraints + Parametric Cost are applied to Customer/MR obligations; they do not create extra quantities on their own. Commissioning kit contents remain a separate OEM/SPIR derivation. Risk-based SPQ-001 is a non-posting gap assessment.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>MR / Scope</th><th>Locations</th><th>B10 commissioning kits</th><th>B11 tools</th><th>C1 mandatory complete unit</th><th>C2 supply basis</th><th>Document proof</th></tr></thead>
    <tbody>{documentObligations.rows.map(x=><tr key={x.mr}>
     <td><strong>{x.mr}</strong><small>{x.label}</small></td>
     <td>{x.sites.join(", ")}</td>
     <td>{x.commissioningKitQuantity} sets<small>1 kit/platform · component list is NOT complete</small></td>
     <td>{x.specialToolPhaseSets} set/phase<small>Supplier/tool sharing assessment needed</small></td>
     <td>NOT mandated by 1 Set/Platform<small>Capital spares are optional engineering/quotation scope</small></td>
     <td>Quotation only<small>Not additive physical supply in Base</small></td>
     <td>{x.source}<small>{x.minimumProof}</small></td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note"><strong>Document-verified scope basis:</strong> {documentObligations.totals.commissioningKitSets} commissioning KIT sets across four MRs; {documentObligations.totals.specialToolMrPhaseRequirements} per-MR phase-tool requirements before proven tool sharing. A kit is not a complete main-equipment spare. Physical items, unit rates and combined prices must follow separate OEM/EXA-A8 mappings.</p>
  </details>}
  {code==="B10"&&<div className="p55-panel" style={{padding:12}}>
   <h4>MR Attachment-5: 14 Contractual Commissioning/Start-up Spare Kits (Physical BOM &amp; Cost Audit)</h4>
   <p className="p55-note">Required 1 set per MR/platform is a spare KIT delivery obligation, not an automatic full spare radio/RACON or a verified bill of parts. The historical nine priced B10 source lines are NOT a 14-kit OEM SPIR cost breakdown. Missing rate is shown as unpriced, never zero.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Item</th><th>Tag No. / System</th><th>Location / MR</th><th>Description / Source</th><th>QTY</th><th>Unit Price THB</th><th>Total Price THB</th><th>Engineering Gate</th></tr></thead>
    <tbody>{spareReconciliation.kitLines.map((x,i)=><tr key={x.id}>
     <td>{i+1}</td><td>{x.tagNo}<small>No fabricated installed equipment TAG</small></td>
     <td>{x.site} / {x.mr}</td>
     <td>{x.description}<small>{x.source}</small></td>
     <td>{x.requirementQty} {x.unit}<small>{x.equationId}</small></td>
     <td>OEM itemized rate required</td><td>NOT ESTABLISHED</td>
     <td>{x.contentStatus}<small>{x.priceBasis}</small></td>
    </tr>)}</tbody></table></div>
   <h4>Brownfield — Spare Parts and Tools AS REQUIRED (not part of 14 new-ZWP KIT count)</h4>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>MR</th><th>Site</th><th>Required Assessment</th><th>Kit Quantity</th><th>Price THB</th><th>Source</th></tr></thead>
    <tbody>{spareReconciliation.brownfieldDemand.map(x=><tr key={x.mr+"-"+x.site}>
     <td>{x.mr}</td><td>{x.site}</td><td>{x.requirement}<small>{x.verificationGate}</small></td>
     <td>As required — no fixed per-site KIT</td><td>NOT ESTABLISHED</td><td>{x.source}</td>
    </tr>)}</tbody></table></div>
   <p className="p55-note"><strong>Quantity derived:</strong> {spareReconciliation.kitLines.length} contractual KITs (4/3/4/3). <strong>New verified kit price:</strong> NOT ESTABLISHED until OEM Attachment-5 itemized BOM/quantity/rate; existing B10 THB reference is kept separate below.</p>
  </div>}
  {code==="B11"&&<details className="p55-panel" open={inWorking} style={{padding:12}}>
   <summary><strong>MR0001–MR0004 Special Tools — 1 Set per Phase Requirement Audit</strong></summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>MR</th><th>Tag No.</th><th>Description</th><th>QTY</th><th>Unit Price THB</th><th>Total Price THB</th><th>Source / Cost Gate</th></tr></thead>
    <tbody>{spareReconciliation.toolRequirements.map(x=><tr key={x.id}>
     <td>{x.mr}</td><td>{x.tagNo}</td><td>{x.description}</td><td>{x.requirementQty} {x.unit}</td>
     <td>Not separately allocated</td><td>NOT ESTABLISHED</td><td>{x.source}<small>{x.priceBasis}</small></td>
    </tr>)}</tbody></table></div>
   <p className="p55-note">Four MR-phase requirement sets use the current B11 parametric budget once; verify OEM included tools, license compatibility and pooled common sets. Rev08 tool rows remain historical audit only.</p>
  </details>}
  {code==="C2"&&<div className="p55-panel" style={{padding:12}}>
   <h4>2-Year Operating Spares — MR0001–0004 Attachment 7 Exclusion Audit</h4>
   <p className="p55-note"><strong>Mandatory instruction 6:</strong> Exclude all items in the Pre-Commissioning / Start-up Spare Parts List. C2 remains Quotation Only until ordered. Historical Rev08 B10/C2 candidate overlap is not an approved duplicate supply; verify OEM SKU and remove overlapping items from revised C2 once proven.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Candidate Part Family</th><th>B10/C2 Historic Source References</th><th>Status / Calculation Action</th></tr></thead>
    <tbody>{customerSchedule.crossCategoryDuplicates.filter(x=>x.categories.includes("B10")&&x.categories.includes("C2")).map(x=><tr key={x.family}>
     <td>{x.family}</td><td>{x.sourceIds.join(", ")}</td><td>{x.status}<small>{x.decision}</small></td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note">Attachment 7 also requires part number, lead time, unit and breakdown price; do not assume the historical C2 quantity is an independently verified two-year OEM stock level.</p>
  </div>}
  {code==="B13"&&<div className="p55-panel" style={{padding:12}}>
   <h4>Consumables Quantity Driver — MR Attachment 9 / SPQ-003</h4>
   <p className="p55-note">Shipping and Long-Term Storage recommendations require preservation agents, quantities, reapplication interval and environmental storage conditions. Only separately delivered B13 consumables are additive; B5 shipment packaging and installed consumables are not counted again.</p>
   <p className="p55-note"><strong>Derived required B13 quantity:</strong> NOT ESTABLISHED (activity count, usage per event and preservation program source missing). The three current parametric allowance rows remain unquoted planning assumptions, not demonstrated minimum consumption. Rev08 rows are historical audit only.</p>
  </div>}
  {code==="C1"&&<details className="p55-panel" open style={{padding:12}}>
   <summary><strong>Capital Spare Optional Selection — MR0001–0004 Source Review</strong></summary>
   <p className="p55-note">MR §5 does not mandate an extra complete major unit from the wording 1 Set/Platform. Rev08 C1 complete RACON and SCADA radio remain historical option candidates, not Document-Required OEM spare quantities.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Tag No.</th><th>Capital Spare Candidate</th><th>Rev08 Qty</th><th>Historical Unit THB</th><th>Current Validated Replacement Qty</th><th>OEM Spare Price THB</th><th>Evidence Gate</th></tr></thead>
    <tbody>{spareReconciliation.capitalHistory.map(x=><tr key={x.id}>
     <td>{x.tagNo}</td><td>{x.description}</td><td>{x.qty}</td><td>{thb(x.unitPriceTHB)}</td>
     <td>NOT DERIVED</td><td>NOT ESTABLISHED</td><td>{x.documentMandateStatus}<small>{x.verificationStatus}</small></td>
    </tr>)}</tbody></table></div>
   <p className="p55-note"><strong>RACON compare — distinct vendor sources:</strong> Rev08 historical full-spare unit {thb(spareReconciliation.raconComparison.historicalUnitPriceTHB)} versus <strong>selected installed MDS RACON</strong> {thb(spareReconciliation.raconComparison.vendorPackageRateReferenceTHB)} (USD {spareReconciliation.raconComparison.vendorUnitPriceUSD}). MDS/ORGA QTORG2609244 FCA <strong>USD {spareReconciliation.raconComparison.historicalAlternativeUnitUSD}</strong> is also the current installed-system rate, still not an independent spare offer. Difference {thb(spareReconciliation.raconComparison.historicalVsPackageUnitDeltaTHB)} compares Rev08 against the selected installed unit only; it is NOT an independent spare quote, saving or approval.</p>
  </details>}
  {["B10","B11","B13","C1","C2"].includes(code)&&<details className="p55-panel" style={{padding:12}}>
   <summary><strong>MR Attachment-5 Vendor Spare List — Documentary Completion Gate</strong> ({spareReconciliation.sourceSpecificationChecklist.length} evidence checks)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>No.</th><th>Required Detail in OEM Spare Parts List</th><th>Current Check</th></tr></thead>
    <tbody>{spareReconciliation.sourceSpecificationChecklist.map((x,i)=><tr key={x}>
     <td>{i+1}</td><td>{x}</td><td>Item-level confirmation pending</td>
    </tr>)}</tbody></table></div>
   <p className="p55-note">Document source: MR0001–MR0004 Rev.C1 Attachment 5, cross-reference to project EXA-A8 minimum and Vendor IOM/Spare Part Interchangeability Record.</p>
  </details>}
  {spareReconciliation.vendorScopeConflicts.some(x=>x.code===code)&&<details className="p55-panel" open={code==="C1"} style={{padding:12}}>
   <summary><strong>MR0004 / ORGA Vendor Package Conflict Gate</strong></summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>TAG</th><th>Quoted Inclusion</th><th>Contradiction / Required Resolution</th></tr></thead>
    <tbody>{spareReconciliation.vendorScopeConflicts.filter(x=>x.code===code).map(x=><tr key={x.id}>
     <td>{x.tag}<small>{x.source}</small></td><td>{x.includedClaim}</td><td>{x.conflict}<small>{x.scopeState}</small></td>
    </tr>)}</tbody></table></div>
  </details>}
  {code==="C1"&&spareLines.length>0&&<details className="p55-panel p553-c1-historical-source-trace" style={{padding:12}}>
   <summary><strong>C1 Rev08 historical source rows — NOT POSTED</strong><small>Historical audit only; the current source-to-release row is in the Customer Schedule below</small></summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Source item</th><th>Related TAGs</th><th>Description / Use</th><th>Specification</th><th>Materials</th><th>Qty</th><th>Reference THB</th></tr></thead>
    <tbody>{customerSchedule.byCode.C1.map(x=><tr key={x.id}>
     <td>{x.item}<small>{x.id}</small></td>
     <td><strong>{x.tagSummary}</strong>{x.relatedEquipmentTagCount>1&&<details className="p553-annex-tag-list"><summary>ดู TAG ({x.relatedEquipmentTagCount})</summary><div>{x.relatedTagList.map(tag=><code key={tag} className="p553-annex-tag-chip">{tag}</code>)}</div></details>}</td>
     <td>{x.displayDescription}<small>{x.displayPurpose}</small></td>
     <td>{x.displaySpecification}</td><td>{x.displayMaterials}</td><td>{x.qty} {x.unit}</td>
     <td>{thb(x.extendedTHB)}<small>Historical reference only / No Customer Release</small></td>
    </tr>)}</tbody></table></div>
  </details>}
  {code==="C1"&&<details className="p55-panel" style={{padding:12}}>
   <summary>Historical C1 ORGA comparison — NOT current independent OEM spare price</summary>
   <h4>SUPPLIER RECOMMENDATION FOR CAPITAL SPARE PARTS — CURRENT SELECTION REVIEW</h4>
   <p className="p55-note"><strong>HISTORICAL NONPOSTING C1 AUDIT:</strong> One complete RACON spare set is selected as an OPTION using the ORGA installed equipment FCA quote benchmark, not a confirmed OEM spare quote or DDP delivered price. Rev08 RACON/SCADA historical entries remain only comparison references.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>MR / Installed Equipment</th><th>Document / OEM Scope</th><th>Capital Spare Assessment</th><th>Selected QTY</th><th>Unit Price THB</th><th>Total Price THB</th><th>Evidence / Decision</th></tr></thead>
    <tbody>{spareReconciliation.systemSummary.map(x=><tr key={x.mr}>
     <td><strong>{x.mr}</strong><small>{x.label} · {x.sites.join(", ")}</small></td>
     <td>{x.source}<small>MR one installed equipment SET / commissioning spare KIT is not a C1 requirement</small></td>
     <td>OEM approved replaceable spare parts / repair-exchange arrangement to verify<small>Complete equipment only if source requirement, repair restriction or owner-approved insurance strategy justifies it</small></td>
     <td>NOT DERIVED</td><td>OEM SPIR RATE REQUIRED</td><td>NOT ESTABLISHED</td>
     <td>{x.auditVerdict}<small>C1 quotation is optional, not an approved working-selection BOM</small></td>
    </tr>)}</tbody></table></div>
   <h4>Selected C1 Budgetary Option — Customer Format</h4>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Item</th><th>Tag No.</th><th>Description</th><th>Detail Specification</th><th>Materials</th><th>QTY</th><th>Unit Price THB</th><th>Total Price THB</th><th>Lead Time ARO</th></tr></thead>
    <tbody><tr>
     <td>1</td><td>{spareReconciliation.selectedC1Option.tagNo}</td>
     <td>{spareReconciliation.selectedC1Option.description}<small>{spareReconciliation.selectedC1Option.id}</small></td>
     <td>{spareReconciliation.selectedC1Option.detailSpecification}<small>{spareReconciliation.selectedC1Option.selectionState}</small></td>
     <td>{spareReconciliation.selectedC1Option.materials}</td><td>{spareReconciliation.selectedC1Option.qty} set</td>
     <td>{thb(spareReconciliation.selectedC1Option.budgetUnitPriceTHB)}</td>
     <td>{thb(spareReconciliation.selectedC1Option.budgetTotalTHB)}</td>
     <td>{spareReconciliation.selectedC1Option.leadTimeARO}</td>
    </tr></tbody></table></div>
   <p className="p55-note"><strong>C1 management-selected BUDGETARY spare option (NONPOSTING):</strong> {thb(spareReconciliation.selectedC1Option.budgetTotalTHB)} · {spareReconciliation.selectedC1Option.source}. Based on historical ORGA USD 75,000 FCA, NOT the installed MGW USD 75,059 equipment quotation. Separate OEM replacement-spare quotation and technical interchangeability with MGW Tideland are PENDING. Not DDP Purchaser's Yard, not a verified direct cost, not posted to Part A/Part B/C1 Customer SELL.</p>
   <p className="p55-note"><strong>Historical Rev08:</strong> {thb(customerSchedule.summary.C1.workingReferenceTHB)} preserved for audit only; no automatic addition to selected C1 option or A+B base.</p>
  </details>}
  {spareLines.length>0&&<div className="p55-panel" style={{padding:12}}>
   <h4>{code==="B11"?"SUPPLIER RECOMMENDATION FOR SPECIAL TOOLS — 供货商推荐的特殊工具":"Customer Schedule — "+shared.descriptions[code]} (PTTEP 2026 First-Principles Working Preview)</h4>
   <p className="p55-note"><strong>Coverage readiness:</strong> {customerSchedule.engineeringReadiness.installedTagInstances} source site-TAG instances / {customerSchedule.engineeringReadiness.criticalTagFunctionGroups} critical TAG families. Confirmed replacement SKU mappings in this model: {customerSchedule.engineeringReadiness.confirmedReplacementSkuGroups}. Verdict: <strong>{customerSchedule.engineeringReadiness.verdict}</strong> — budget price rows exist, but complete Commissioning Spare coverage and major-equipment provision have not yet been demonstrated.</p>
   <p className="p55-note"><strong>วิธีอ่านราคาอะไหล่:</strong> Description = รายการที่จะซื้อและหน้าที่ใช้งาน ·
    Detail Specification = คุณสมบัติที่ต้องตรงกับของเดิม · Materials = วัสดุ/ส่วนประกอบจริง (TBC หากยังไม่ยืนยัน) ·
    TAG No. = จุดติดตั้งที่เกี่ยวข้อง ไม่ใช่จำนวนอะไหล่ · <strong>Qty = จำนวน Kit/Tools/Consumables สำหรับประเมินงบ ไม่ใช่ OEM Spare SKU ที่ผ่าน SPIR</strong>.
    รายการที่มีหลาย TAG ยังไม่ถือว่าใช้แทนกันได้จนกว่าจะยืนยัน OEM SKU
    <strong> ข้อมูลในตารางมาจาก Spare Source ของ 10.2 เดียวกับ Release 10.3</strong>;
    การเปิดรายละเอียดไม่คำนวณราคาใหม่</p>
   <p className="p55-note"><strong>TOP-DOWN TRACE:</strong> {customerSchedule.sourceOwnership} · Current 4/3/4/3 B10 kit quantities derive from MR0001–0004; B11 reviews EXA-A8 Phase 1F tools and applicability; B13 excludes B5/A5. Rates are UNQUOTED planning estimates at FX31.5 and factor 1.30, NOT OEM supplier prices. C1/C2 remain optional and unquoted.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Item</th><th>Tag No.</th><th>Description</th><th>Detail Specification</th><th>Materials</th><th>Qty</th><th>Unit Price THB</th><th>Total Price THB</th>{(code==="C1"||code==="C2")&&<th>Lead Time ARO</th>}</tr></thead>
    <tbody>{spareLines.map(x=><tr key={x.id}
      data-component-key={inWorking?x.sourceRowModuleId:"bid.budget.scope."+code.toLowerCase()+".spare-line."+x.id.toLowerCase()}>
     <td>{x.item}{onOpenReleaseRow&&<button className="p553-detail-button p553-source-to-release" type="button"
       onClick={()=>onOpenReleaseRow({code,sourceId:x.id,sourceRowModuleId:x.sourceRowModuleId})}
       title={"Open matching 10.3 customer preview item "+x.id}>↗ 10.3 Release</button>}
      {!inWorking&&onOpenSource&&<button type="button" className="p553-detail-button"
       onClick={()=>onOpenSource({code,sourceModuleId:x.sourceRowModuleId})}>↗ 10.2 Source</button>}</td>
     <td><strong>{x.tagSummary||x.tagNo}</strong>
      {x.relatedEquipmentTagCount>1&&<details className="p553-annex-tag-list">
       <summary>ดู TAG ทั้งหมด ({x.relatedEquipmentTagCount})</summary>
       <div>{x.relatedTagList.map(tag=><code key={tag} className="p553-annex-tag-chip">{tag}</code>)}</div>
       <small>ยังไม่รับรองว่าใช้ Spare Part รุ่นเดียวกันได้</small>
      </details>}
      <small>{x.linkedLocations.join(", ")||"Location pending"}</small></td>
     <td><strong>{x.displayDescription||x.description}</strong>
      <small>{x.displayPurpose}</small><small>{x.explanationTH}</small>
      <small>Original source: {x.description} · {x.id}</small></td>
     <td>{x.displaySpecification||x.detailSpecification}
      {x.engineeringVerification&&<details><summary>Current row OEM proof — OPEN</summary>
       <small>Evidence: {x.engineeringVerification.evidence}</small>
       <small>Gap: {x.engineeringVerification.issue}</small>
       <small>Required: {x.engineeringVerification.action}</small>
      </details>}
      <small>ต้องตรวจ OEM Part No. และ Rating จริงก่อนอนุมัติ</small></td>
     <td>{x.displayMaterials||x.materials}
      <small>รอยืนยันวัสดุ/รุ่นจาก OEM</small></td>
     <td className="p553-annex-qty"><strong>{x.qty??"TBC — OEM SPIR"}</strong><small>{x.unit} · spare qty</small><small>Engineering Qty · {x.sourceId} · {x.sourcePriceBasis}</small></td>
     <td>{x.option?"NOT QUOTED":thb(x.unitPriceTHB)}</td><td>{x.option?"NOT QUOTED":thb(x.extendedTHB)}</td>
     {(code==="C1"||code==="C2")&&<td>{x.leadTimeARO||"OEM confirmation required"}</td>}
    </tr>)}</tbody>
    {code==="B11"&&<tfoot><tr><th colSpan={7} style={{textAlign:"right"}}>B11 Current First-Principles Working SELL (THB) — OEM QUOTE HOLD</th><th>{thb(customerSchedule.currentBudgetaryByCode.B11)}</th></tr></tfoot>}
   </table></div>
   <p className="p55-note"><strong>CURRENT PARAMETRIC WORKING SELL:</strong> {thb(customerSchedule.currentBudgetaryByCode?.[code])} · Unquoted cost allowance × {customerSchedule.currentBudgetaryPricingFactor} × FX {customerSchedule.currentWorkingFxTHBPerUSD}. Each estimate row exposes qty, rate basis, and requirement. <strong>OEM quote/SPIR/Ex compatibility/DDP remain open.</strong> Rev08 is archived and excluded from current cost.</p>
   {code==="B11"&&<p className="p55-note"><strong>Customer template delivery basis:</strong> DDP Purchaser’s Yard shown in RFQ; current THB prices are internal budget references only, not a verified DDP delivered quotation. Installation, commissioning and special tools must reconcile with B3/B9 and Part A before customer release. Four MR-phase tool sets and five EXA-A8 minimum applicability checks do NOT mean nine additive tool purchase lines.</p>}
   <p className="p55-note">Linked Tag candidates are not approved spare-to-installed-equipment matches. B10/B13 base and C1/C2 options remain separated. This table is a working engineering view; customer DDP currency and Incoterm conflict must be resolved before release.</p>
  </div>}
  {code==="B10"&&<B10PriceToWinScenario0553 context={inWorking?"working":"scope"}/>}
  {code==="B10"&&<B10ItemizedPurchasingEvidence0553 evidence={b10ItemizedEvidence} context={inWorking?"working":"scope"}/>}
  {spareLines.length>0&&customerSchedule.sparePriceEvidence&&<details className="p55-panel p553-itemized-evidence" open={inWorking} style={{padding:12}}>
   <summary><strong>Physical purchase candidate register — item names / OEM model / Part No. / historical price evidence</strong>
    <small>10.2 source evidence only · NOT additive to Working SELL / customer Release · no supplier spare quotation implied</small></summary>
   <p className="p55-note"><strong>Source-to-Working ownership:</strong> {customerSchedule.sparePriceEvidence.moduleId}. Rows below reveal individual legacy candidate parts inside the budget headings without pretending that the 4/3/4/3 kits have approved item contents. A historical quantity is NOT a newly approved purchase quantity. Actual TAG/SKU/rating and commissioned B10 vs C2 stock exclusion must be resolved first.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Source line</th><th>Candidate physical article</th><th>Historically stated qty</th><th>Historical unit USD</th><th>Historical extended USD</th><th>Current approved spare Part No.</th><th>Current purchase qty / spare quotation</th></tr></thead>
    <tbody>{(customerSchedule.sparePriceEvidence.byCode[code]||[]).map(x=><tr key={x.id} data-spare-evidence-id={x.id}>
     <td><code>{x.id}</code></td><td>{x.name}</td><td>{x.historicalQty}<small>Rev08 only</small></td>
     <td>{usd(x.historicalUnitUSD)}</td><td>{usd(x.historicalTotalUSD)}</td>
     <td>NOT VERIFIED</td><td>NOT VERIFIED<small>{x.status}</small></td>
    </tr>)}</tbody>
   </table></div>
   {(customerSchedule.sparePriceEvidence.directComparablesByCode[code]||[]).length>0&&<>
    <h4>Selected supplier product evidence — installed-equipment comparable, NOT a separately quoted spare</h4>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>Supplier / source</th><th>Make / model / item</th><th>Part No.</th><th>Related installed TAG</th><th>Quoted installed-package qty</th><th>Installed quote basis / rate</th><th>Critical difference</th></tr></thead>
     <tbody>{customerSchedule.sparePriceEvidence.directComparablesByCode[code].map(x=><tr key={x.id}>
      <td>{x.supplier}</td><td>{x.brand} / {x.model} / {x.name}</td><td><code>{x.partNo}</code></td>
      <td>{x.installedTag}</td><td>{x.quotedQty??"not itemized"}</td>
      <td>{Number.isFinite(x.quotedUnitUSD)?usd(x.quotedUnitUSD):Number.isFinite(x.quotedUnitTHB)?thb(x.quotedUnitTHB):"Included / not separately priced"}<small>{x.quoteBasis}</small></td>
      <td>{x.warning}<small>{x.status}</small></td>
     </tr>)}</tbody>
    </table></div>
   </>}
   {code==="C1"&&<p className="p55-note"><strong>C1 single complete-RACON optional scenario (NONPOSTING):</strong> FCA installed package comparator USD {customerSchedule.sparePriceEvidence.c1CurrentOptionalReference.referenceFcaUnitUSD.toLocaleString("en-US")} · THB {customerSchedule.sparePriceEvidence.c1CurrentOptionalReference.indicativeFullReplacementSellScenarioTHB.toLocaleString("en-US")} illustrative customer sell (USD {customerSchedule.sparePriceEvidence.c1CurrentOptionalReference.indicativeFullReplacementSellScenarioUSD.toLocaleString("en-US")}) only after x1.30; no independent replacement price, configuration approval or delivery cost. Not authorized for customer export.</p>}
   {code==="C2"&&<>
    <p className="p55-note"><strong>C2 historical gross reference:</strong> USD {customerSchedule.sparePriceEvidence.c2Historical.referenceUSD.toLocaleString("en-US",{minimumFractionDigits:2})} across {customerSchedule.sparePriceEvidence.c2Historical.historicalCandidateLines} unverified Rev08 candidate lines. This is NOT verified current Direct Cost and cannot be marked as a customer quotation.</p>
    <p className="p55-note"><strong>C2 historical residual scenario — NOT a quotation:</strong> Gross USD {usd(customerSchedule.sparePriceEvidence.c2BudgetScreening.grossHistoricalUSD)} minus potential overlap USD {usd(customerSchedule.sparePriceEvidence.c2BudgetScreening.potentialB10FunctionalOverlapUSD)} and legacy 7/8-inch feeder USD {usd(customerSchedule.sparePriceEvidence.c2BudgetScreening.incompatibleSevenEighthFeederHistoricalUSD)} = <strong>{usd(customerSchedule.sparePriceEvidence.c2BudgetScreening.historicalResidualScreeningUSD)} (THB {thb(customerSchedule.sparePriceEvidence.c2BudgetScreening.historicalResidualScreeningTHB)})</strong>. Purely an older SELL-reference screening, not verified 2026 cost or current required scope; do not post or export.</p>
    <p className="p55-note"><strong>Attachment 7 non-duplication:</strong> {customerSchedule.sparePriceEvidence.duplicates.length} B10/C2 functional candidate overlaps must be reconciled by exact supplier SKU and separate delivered quantity. Historic 7/8-inch feeder conflicts with MGW 1/2-inch feeder; keep out of any approved current C2 takeoff until reconciled.</p>
   </>}
  </details>}
  {coverage&&<details className="p55-panel" open={inWorking} style={{padding:12}}>
   <summary><strong>Top-down Engineering Spare Coverage — MR0001–MR0004</strong> (SPQ-001 + existing MAP equations; pre-award scenario only)</summary>
   <p className="p55-note"><strong>Basis:</strong> MR0001 MTO Rev04 / MR0002 AFC TEL-LAY / MR0003–0004 MR Rev.C1 scope. Existing MAP-01/02/05/06/07/08/10 reused; SPQ-001 adds critical-family spare scenario sizing only. A scenario Qty is not an OEM-approved spare quantity or contractual minimum. No prices are newly posted by this assessment.</p>
   {["MR-0001","MR-0002","MR-0003","MR-0004"].map(mr=>{
    const summary=coverage.totals[mr];
    return <details key={mr} className="p55-panel" style={{padding:10}}>
     <summary><strong>{mr}</strong> — {summary.installedTagInstances} site-tag instances / {summary.uniqueTagTypes} equipment tag types / {summary.criticalTagTypes} critical-family candidates</summary>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Installed Tag</th><th>Location / Source</th><th>Replaceable Family</th><th>{code} Scope Assessment</th><th>B10 Budget Risk Qty (scenario)</th><th>Existing Price Reference / Gate</th></tr></thead>
      <tbody>{coverage.groups.filter(x=>x.mr===mr).map(x=><tr key={x.id}>
       <td><strong>{x.tag}</strong><small>{x.criticality}</small></td>
       <td>{x.installedSites.join(", ")}<small>{x.sourceEvidence.join("; ")}</small></td>
       <td>{x.family}<small>{x.interchangeabilityState}</small></td>
       <td>{x.categoryApplicability[code]?"ENGINEERING ASSESSMENT APPLICABLE":"NOT PRIMARY SPARE CLASS"}<small>{x.contractKitMinimumState}</small></td>
       <td>{x.categoryApplicability.B10?x.b10BudgetScenarioQty:"—"}<small>{x.estimatedPartQtyState} · {x.b10QtyEquationId}</small><small>{x.reliabilityEquationId}: {x.reliabilityState} (OEM failure rate unavailable; no inferred reliability quantity)</small></td>
       <td>{x.budgetaryExistingSourceIds[code]?.length?x.budgetaryExistingSourceIds[code].join(", "):"NO MATCHED REV08 CATEGORY REFERENCE"}<small>Cost evidence is a candidate, not proven interchangeable SKU</small></td>
      </tr>)}</tbody>
     </table></div>
    </details>;
   })}
   {coverage.unresolvedRequirementTags.map(x=><p className="p55-note" key={x.mr+"-"+x.tag}>
    <strong>Open MR-to-Selected Tag Crosswalk:</strong> {x.mr} / {x.tag} → {x.candidateCurrentInstalledTag} · {x.reason} · {x.status} · {x.source}. No quantity or price counted as resolved.
   </p>)}
   <p className="p55-note"><strong>Coverage gate:</strong> Contract minimum EXA-A8 and OEM SPIR composition remain unresolved; major equipment and compatibility gaps stay visible. Part A and B10/B13/C1/C2 must reconcile unique physical delivered quantities before customer release. Working Sell budgets are unchanged.</p>
  </details>}
  {code==="B11"&&<details className="p55-panel" open={inWorking} style={{padding:12}}>
   <summary><strong>B11 Minimum Operational Special Tools — EXA-A8 Phase 1F</strong> (five customer requirements)</summary>
   <p className="p55-note">These are contractual minimum tool/authorization drivers, not five independent price postings. The four original Rev08 B11 tool/kit budget lines remain the only historic price basis. TETRA gateway applicability must be assessed against the selected DMR system.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Item</th><th>Tag No.</th><th>Description</th><th>QTY</th><th>Unit Price THB</th><th>Price / Inclusion Basis</th></tr></thead>
    <tbody>{customerSchedule.b11Requirements.rows.map(x=><tr key={x.id}>
     <td>{x.id}</td><td><strong>{x.tag}</strong><small>{x.mr}</small></td>
     <td>{x.description}<small>{x.compatibilityGate}</small></td><td>{x.qty} {x.unit}</td>
     <td>Covered by shared B11 reference — not separately allocated</td>
     <td>{x.sourceQuoteCandidate}<small>{x.budgetPriceState}</small></td>
    </tr>)}</tbody></table></div>
   <p className="p55-note">Source: {customerSchedule.b11Requirements.source}. No independent rate or final supplier compatibility has been invented; B11 shared-tool OEM credits remain open.</p>
  </details>}
  {(code==="B10"||code==="C1")&&<details className="p55-panel" open={inWorking} style={{padding:12}}>
   <summary><strong>Critical Replacement Risk Scenario — MR0002 / ZWP20 / RFI-BDA</strong> (NON-ADDITIVE budget sensitivity)</summary>
   <p className="p55-note">This is derived from the selected MR0002 Working BOM, not from a fabricated spare quote. The integrated BDA+WAROM assembly is already supplied in Part A. The comparison is for one replacement package only; choose physical ownership B10 OR C1 when justified, never both for the same stock unit.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Installed TAG / Evidence</th><th>BOM / Spare Scenario</th><th>Scenario Qty</th><th>Vendor package rate THB (comparable)</th><th>Extended risk reference THB</th><th>Commercial treatment</th></tr></thead>
    <tbody>{customerSchedule.riskCandidates.map(x=><tr key={x.id}>
     <td><strong>{x.tagNo}</strong><small>{x.moduleId}</small><small>{x.site} · {x.mr}</small></td>
     <td>{x.description}<small>Selected OEM SKU: {x.sku} · {x.source} / {x.sourceQuoteLine}</small></td>
     <td>{x.qty} {x.unit}<small>SPQ-001 critical-family budget scenario, not required SPIR quantity</small></td>
     <td>{thb(x.comparativeUnitTHB)}<small>USD {x.sourceUnitUSD} × {x.planningFxTHBPerUSD} THB/USD</small></td>
     <td><strong>{thb(x.comparativeAmountTHB)}</strong></td>
     <td><strong>NOT INCLUDED IN WORKING SELL</strong><small>{x.categoryDecision}</small><small>{x.priceClass}</small></td>
    </tr>)}</tbody>
   </table></div>
   <h4>Original MR0002 / ZWP20 Selected RFI-BDA BOM / Cost Ownership</h4>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>TAG / BOM ID</th><th>Equipment / Vendor SKU</th><th>QTY</th><th>Unit Price THB / Evidence</th><th>Total Reference THB</th><th>Cost / Inclusion Status</th></tr></thead>
    <tbody>{customerSchedule.riskCandidates.flatMap(x=>x.originalBOM).map(x=><tr key={x.id}>
     <td>{x.tag}<small>{x.id}</small></td>
     <td>{x.description}<small>{x.sku||"SKU not separately specified"}</small></td>
     <td>{Number.isFinite(x.qty)?x.qty:"Input unresolved"} {x.unit}</td>
     <td>{Number.isFinite(x.referenceUnitTHB)?thb(x.referenceUnitTHB):x.priceInclusion?"Included with parent package":"No unit rate established"}</td>
     <td>{Number.isFinite(x.referenceExtendedTHB)?thb(x.referenceExtendedTHB):x.priceInclusion?"Included (not additive)":"Not priced"}</td>
     <td>{x.priceInclusion||x.status}<small>{x.countedInPartA?"Part A selected package source — not extra B10 / C1 charge":"Non-additive interface/inclusion/provisional line"}</small></td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note"><strong>Open decision:</strong> Include standalone BDA module vs complete assembly replacement? Check OEM spare compatibility, EX certification and MR0002 RAD-508-001 LNA to RFI BDA crosswalk. This priced full-package reference must not be treated as a final spare quotation or counted in both B10 and C1.</p>
  </details>}
  {customerSchedule.crossCategoryDuplicates.length>0&&<details className="p55-panel" style={{padding:12}}>
   <summary><strong>Cross-category Stock / Double-count Review</strong> ({customerSchedule.crossCategoryDuplicates.length} functional overlaps)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Replaceable Function</th><th>Source Rows / Categories</th><th>Quantity &amp; Cost Ownership Decision</th></tr></thead>
    <tbody>{customerSchedule.crossCategoryDuplicates.map(x=><tr key={x.family}>
     <td><strong>{x.family}</strong></td>
     <td>{x.categories.join(" / ")}<small>{x.sourceIds.join(", ")}</small></td>
     <td>{x.decision}<small>{x.status}</small></td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note">This is a functional overlap alert, NOT proof of identical OEM SKU or double billing. MR0001–0004 Attachment 7 requires excluding items listed in the Pre-Commissioning/Start-up spares list from C2. Confirm actual OEM part numbers before removing or retaining a historical C2 candidate. B13 preservation stock must be net of B5 shipping packing.</p>
  </details>}
  <h4>1. Historical Annex Price Lines — Original Rev08 / Not current Vendor Quote</h4>
  {p.historicalHasDetail?
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Legacy Ref</th><th>Historical Item</th><th>Historic Qty</th><th>Historical Unit THB *</th><th>Historical Extended THB *</th><th>Current SKU / Rate Approval</th></tr></thead>
    <tbody>{p.historicalDetailLines.map(x=><tr key={x.id}>
     <td><strong>{x.id}</strong></td><td>{x.description}<small>{x.source}</small></td>
     <td>{x.qty}</td><td>{thb(x.historicalUnitTHB)}</td><td>{thb(x.historicalExtendedTHB)}</td>
     <td><strong>NOT VERIFIED / NOT POSTED</strong><small>OEM SKU, supplier quote, confirmed Qty and cost ownership required</small></td>
    </tr>)}</tbody>
   </table></div>:
   <p className="p55-note"><strong>NO ITEMIZED REV08 ANNEX FOR {p.code}.</strong> Historical summary {thb(p.historicalReferenceTHB)} only (native source in USD); this cannot prove current insured value, premium or direct cost. No invented line items.</p>}
  <p className="p55-note"><strong>Historical Source Reconciliation:</strong> {p.historicalHasDetail?
   (p.historicalReconciled?"PASS — ":"FAIL — ")+p.historicalDetailLines.length+
   " Rev08 lines reconcile with source summary within native USD 0.01 tolerance. Rounded-display lines "+thb(p.historicalDisplayedLineTHBSum)+" vs summary "+thb(p.historicalReferenceTHB)+"; display difference "+thb(p.historicalDisplayedVsSummaryDeltaTHB)+" (historical source precision, no balancing row added)":
   "NO LINE-LEVEL RECONCILIATION — historical summary only"}
   {" "}· THB display at working planning FX {p.historicalFxTHBPerUSD??"NOT PROVIDED"}; not a verified BOT quotation. Original USD and unrounded values remain in the historical source model.</p>
  <h4>2. Current Requirement / Cost Driver from 10.2 — No Double Count</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>10.2 Activity / Requirement</th><th>Required Qty</th><th>Verified Direct Cost THB</th><th>Source &amp; Verification</th></tr></thead>
   <tbody>{p.currentDerivationLines.map(x=><tr key={x.id}>
    <td><strong>{x.activity}</strong><small>{x.id} · {x.valueClass}</small></td>
    <td>{Number.isFinite(x.quantity)?x.quantity:"TO DERIVE"} {x.unit}</td>
    <td>NOT ESTABLISHED</td><td>{x.evidence}<small>{x.status}</small></td>
   </tr>)}</tbody>
  </table></div>
  {p.currentRequirementRows.length>0&&<details className="p55-panel" style={{padding:12}}>
   <summary><strong>Current Lifecycle Demand Register</strong> ({p.currentRequirementCount} source candidates; not verified spare quantities)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Site / System</th><th>Candidate Activity / Spare</th><th>Qty &amp; Rate</th><th>Source Status</th></tr></thead><tbody>
    {p.currentRequirementRows.map(x=><tr key={x.sourceId}>
     <td>{x.site} · {x.system}</td><td>{x.description}<small>{x.sourceId}</small></td>
     <td>QTY NOT VERIFIED · RATE NOT VERIFIED</td><td>{x.sourceStatus}</td>
    </tr>)}</tbody></table></div>
  </details>}
  <h4>3. Verification Tasks — To Establish Current THB Price</h4>
  <ul>{p.currentCostGaps.map((x,i)=><li key={i}>{x}</li>)}</ul>
  <details className="p55-panel" style={{padding:12}}>
   <summary><strong>01–08 Engineering Source &amp; Cost Verification</strong> ({p.currentVerificationSteps.length} gates)</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Step</th><th>Validation State</th><th>Basis / Missing Proof</th></tr></thead>
    <tbody>{p.currentVerificationSteps.map(x=><tr key={x.id}><td>{x.id} — {x.name}</td><td>{x.state}</td><td>{x.basis}</td></tr>)}</tbody>
   </table></div>
  </details>
  <p className="p55-note"><strong>Cost Ownership:</strong> {p.noDoubleCountRule} · Historical USD values shown solely for cost benchmark, no approval or customer release.</p>
 </section>;
}
