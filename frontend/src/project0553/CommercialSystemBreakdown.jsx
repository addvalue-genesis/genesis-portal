import { SCADA_0553_RECONCILIATION } from "./data/scadaOfferReconciliation";
import { InnovaBudgetEvidence0553 } from "./InnovaBudgetEvidence";
import { AVIAT_0553_TECHNICAL_EVALUATION } from "./data/aviatTechnicalBidEvaluation";
import { MR0001_PACKAGE_COMPOSITION, summarizeMR0001Composition } from "./data/mr0001PackageComposition";
import { MR0001_TOPOLOGY_QUANTITY_AUDIT } from "./data/mr0001TopologyQuantityAudit";
import { MR0001_RADIO_ROLE_MATRIX } from "./data/mr0001RadioRoleMatrix";
import { MR0001_SCOPE_OWNERSHIP_AUDIT } from "./data/mr0001ScopeOwnershipAudit";
import { MR0001_OFFER_ALLOCATION_AUDIT } from "./data/mr0001OfferAllocationAudit";
import { MR0001_GAP_ASSESSMENT } from "./data/mr0001GapAssessment";
import { MR0001_REQUIREMENT_EVIDENCE_MATRIX } from "./data/mr0001RequirementEvidenceMatrix";
import { MR0001_ENGINEERING_REQUIRED_BOM, summarizeMR0001RequiredBom } from "./data/mr0001RequiredBomDerivation";
import { formatCommercialAmount } from "../common/cost/commercialCurrency";
import { getProject0553Dataset, getProject0553SupplierQuotes } from "./data/repository";
import React,{useState} from "react";
import {REV08_BASELINE} from "./data/rev08CommercialBaseline";

import {VENDOR_0553_SOURCES} from "./vendorEvidence";

const CODES={"MR-0001":"A1","MR-0002":"A2","MR-0003":"A3","MR-0004":"A4"};
// Presentation-only 0550-style budget drilldown. Do not distribute an A1-A4
// customer lump sum into fictional component costs or mark MTO families as priced.
export function CommercialSystemBreakdown0553({displayCurrency="USD",fx=null}){
 const shown=(amount,source="USD")=>formatCommercialAmount(amount,source,displayCurrency,fx);
 const [expanded,setExpanded]=useState(new Set());
 const [expandedPackages,setExpandedPackages]=useState(new Set());
 const togglePackage=id=>setExpandedPackages(old=>{const n=new Set(old);n.has(id)?n.delete(id):n.add(id);return n;});
 const toggle=id=>setExpanded(old=>{const n=new Set(old);n.has(id)?n.delete(id):n.add(id);return n;});
 const systems=getProject0553Dataset().mto.systems.map(s=>({
  ...s,code:CODES[s.mr],
  baseline:REV08_BASELINE.summary.find(x=>x[0]===CODES[s.mr]),
  sources:VENDOR_0553_SOURCES.filter(v=>v.mr===s.mr||v.mr==="MULTI")
 }));
 return <section className="p55-panel">
  <div className="p55-eyebrow">PART A INTERNAL DERIVATION · 0550 STRUCTURE REUSED / 0553 DATA ONLY</div>
  <div className="p55-budget-detail__head">
   <div><h3>4 MR Systems — Equipment / Vendor Evidence / Commercial Breakdown</h3>
   <p className="p55-note">แยกตาม MR และกด + เพื่อดู Equipment Families, Vendor Source และสถานะต้นทุนจริง ข้อมูล MTO Rev04 เป็น Summary ยังไม่ใช่ Itemized Take-off ที่ตรวจรับแล้ว</p></div>
   <div className="p55-segmented"><button type="button" onClick={()=>setExpanded(new Set(systems.map(s=>s.mr)))}>Expand all</button><button type="button" onClick={()=>setExpanded(new Set())}>Collapse all</button></div>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
  <thead><tr><th>+/−</th><th>No.</th><th>System / MR</th><th>Internal basis</th><th>Detail state</th><th>Rev08 Sell ({displayCurrency})</th></tr></thead>
  <tbody>{systems.map((s,i)=><React.Fragment key={s.mr}>
   <tr><td><button type="button" className="p55-row-toggle" aria-label={(expanded.has(s.mr)?"Collapse ":"Expand ")+s.name} aria-expanded={expanded.has(s.mr)} onClick={()=>toggle(s.mr)}>{expanded.has(s.mr)?"−":"+"}</button></td>
   <td>{String(i+1).padStart(2,"0")}</td><td><strong>{s.name}</strong><small>{s.mr} · {s.code}</small></td>
   <td>{s.facilities.join(" · ")}<small>{s.rowCount} MTO rows (summary count; not equipment qty)</small></td>
   <td><span className="p55-badge">WORKING / REVALIDATE</span></td>
   <td className="is-number"><strong>{shown(s.baseline?.[2])}</strong></td></tr>
   {expanded.has(s.mr)&&<tr className="p55-budget-detail-row"><td colSpan={6}><div className="p55-budget-detail">
    <div className="p55-budget-detail__head"><strong>{s.name} — detailed internal breakdown</strong><span>{s.equipmentFamilies.length} equipment families · {s.sources.length} vendor source records</span></div>
    <div className="p55-source-facts">
     <div><span>Source MTO</span><strong>Rev04 · WORKING</strong></div>
     <div><span>MR / Commercial Code</span><strong>{s.mr} / {s.code}</strong></div>
     <div><span>Customer Rev08 Sell</span><strong>{shown(s.baseline?.[2])}</strong></div>
     <div><span>Verified Direct Cost</span><strong>OPEN</strong></div>
    </div>
    <div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>Physical / equipment scope — source MTO Rev04</div>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>No.</th><th>Equipment family</th><th>Platform scope</th><th>Installed qty</th><th>Unit cost</th><th>State</th></tr></thead>
     <tbody>{s.equipmentFamilies.map((family,j)=><tr key={j}><td>{j+1}</td><td>{family}</td><td>{s.facilities.join(", ")}</td><td>UNVERIFIED</td><td>OPEN</td><td><span className="p55-badge">MTO FAMILY ONLY</span></td></tr>)}</tbody>
    </table></div>
    {s.mr==="MR-0001"&&<section className="p55-panel">
     <div className="p55-eyebrow">MR0001 · REQUIREMENT → PHYSICS/CONSTRAINT → REQUIRED BOM → SERVICES</div>
     <h4>Engineering-required scope from original MTO Rev04 (not vendor BOM)</h4>
     <p className="p55-note">ต้นทางคือ MTO จริง 42 แถว ครอบคลุมทั้ง Greenfield/Brownfield 7 Sites และอ้างอิง 5 Links จาก RPT Rev.C1. จำนวน Set/Lot จาก MR ไม่ใช่จำนวนชิ้นตาม SKU; ข้อมูลการรับรองวิศวกรรม, Cable/Bulk, Licence, Service MH และราคายัง OPEN</p>
     <div className="p55-source-facts">
      <div><span>Source item rows</span><strong>{summarizeMR0001RequiredBom().rowCount}</strong></div>
      <div><span>Locations</span><strong>{summarizeMR0001RequiredBom().siteCount}</strong></div>
      <div><span>Multi-code source rows</span><strong>{summarizeMR0001RequiredBom().groupedRowCount} · SPLIT OPEN</strong></div>
      <div><span>Accepted SKU/Cost/Sell</span><strong>OPEN / HOLD</strong></div>
     </div>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget">
      <thead><tr><th>Source row</th><th>Platform / link</th><th>MR item / requirement</th><th>MR Qty / source state</th><th>Required SKU Qty</th><th>Vendor Unit Price Evidence</th><th>Specific blocker</th><th>Services / Cost / Sell</th></tr></thead>
      <tbody>{MR0001_ENGINEERING_REQUIRED_BOM.rows.map(r=><tr key={r.id}>
       <td>{r.sourceRowIndex}<small><a href={r.sourceUrl} target="_blank" rel="noreferrer">MTO Rev04</a></small></td>
       <td><strong>{r.platform}</strong><small>{r.relatedLinks.join(" · ")||"SITE / NO LINK MAPPED"}</small></td>
       <td><strong>{r.sourcePartText}</strong><small>{r.sourceDescription}</small></td>
       <td><strong>{r.sourceQuantityText}</strong><small>{r.scopeQuantityState}</small></td>
       <td><strong>OPEN</strong><small>{r.groupedRow?"MULTI-CODE SPLIT REQUIRED":"SET ≠ OEM SKU QTY"}</small></td>
       <td>{r.vendorPriceCandidates.length?r.vendorPriceCandidates.map(q=><div key={q.quoteId+q.quoteLine}><strong>{q.sku}</strong><small>{q.vendor} · {q.quoteLine} · {Number.isFinite(q.sourceUnitPrice)?shown(q.sourceUnitPrice,q.currency):"N/A AS QUOTED"} / quoted unit · Qty {q.quotedQty} OFFER ONLY</small></div>):"VENDOR ITEM MATCH OPEN"}<small>Quote candidate ≠ accepted cost</small></td>
       <td><strong>{r.blockerCategory}</strong><small>{r.missing.join(" · ")}</small></td>
       <td>MH OPEN / EXTENDED COST HOLD / SELL HOLD</td>
      </tr>)}</tbody>
     </table></div>
     <p className="p55-note">RPT topology is a preliminary reference, not acceptance of antenna selection, radio compatibility, availability or Myanmar licence. NG/Cisco offers remain comparison evidence only. This table intentionally cannot produce customer pricing until required quantities, proof, WBS drivers and source-based rates are verified.</p>
    </section>}
    {s.mr==="MR-0001"&&<section className="p55-panel">
     <div className="p55-eyebrow">FIRST PRINCIPLES · RPT TOPOLOGY → PHYSICAL QUANTITY PROOF</div>
     <h4>SCADA Link Endpoint and Site Audit — Radio Quantity Not Yet Approved</h4>
     <p className="p55-note">The five RPT Rev.C1 paths give ten logical link endpoints at seven locations. This is a verified graph count from the registered report data, NOT ten radios, and NOT a purchase BOM. PTMP radio sharing, diversity, PTP roles and antenna options require engineering approval.</p>
     <div className="p55-source-facts">
      <div><span>RPT links</span><strong>{MR0001_TOPOLOGY_QUANTITY_AUDIT.linkCount}</strong></div>
      <div><span>Logical endpoints</span><strong>{MR0001_TOPOLOGY_QUANTITY_AUDIT.endpointCount} · NOT EQUIPMENT</strong></div>
      <div><span>Distinct sites</span><strong>{MR0001_TOPOLOGY_QUANTITY_AUDIT.siteCount}</strong></div>
      <div><span>Accepted radio qty</span><strong>OPEN</strong></div>
     </div>
     <div className="p55-table-wrap"><table className="p55-table p55-table--budget p55-table--compact">
     <thead><tr><th>Site</th><th>Link endpoints</th><th>RPT link IDs</th><th>Frequencies MHz</th><th>MTO package rows</th><th>Required base / remote / antenna</th></tr></thead>
     <tbody>{MR0001_TOPOLOGY_QUANTITY_AUDIT.sites.map(x=><tr key={x.site}><td><strong>{x.site}</strong></td><td>{x.linkEndpointCount}</td><td>{x.linkIds.join(" · ")}</td><td>{x.frequencyMHz.join(" / ")}</td><td>{x.mtoPackageRows}</td><td>OPEN / OPEN / OPEN</td></tr>)}</tbody></table></div>
     <h4>OEM role and quantity blockers</h4>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>ID</th><th>Missing engineering proof</th><th>Source</th><th>State</th></tr></thead><tbody>
     {MR0001_TOPOLOGY_QUANTITY_AUDIT.outstanding.map(x=><tr key={x.id}><td>{x.id}</td><td>{x.reason}</td><td>{x.source}</td><td>{x.state}</td></tr>)}
     </tbody></table></div>
    </section>}
    {s.mr==="MR-0001"&&<section className="p55-panel">
     <div className="p55-eyebrow">PHYSICAL RADIO ROLE MATRIX · SITE / LINK / MR / OEM OFFER</div>
     <h4>RPT inferred roles — not approved hardware quantities</h4>
     <p className="p55-note">PTMP FROM/TO roles below are directional interpretations of existing RPT links. PTP peers are kept separate. They cannot define a base station quantity without BLD/OEM validation; multiple links, antennas and shared sectors may alter physical counts.</p>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Site</th><th>RPT link / peer</th><th>Role candidate</th><th>RPT antenna</th><th>MTO source rows</th><th>Physical radio / antenna</th></tr></thead>
      <tbody>{MR0001_RADIO_ROLE_MATRIX.sites.flatMap(site=>site.roles.map(r=><tr key={r.id}>
       <td><strong>{r.site}</strong></td><td>{r.linkId}<small>Peer: {r.peer}, {r.frequencyMHz} MHz</small></td>
       <td>{r.inferredRole}</td><td>{r.antennaReference}</td>
       <td>{site.mtoRows.map(x=>x.sourceRowIndex).join(", ")}</td><td>OPEN / OEM HOLD</td>
      </tr>))}</tbody></table></div>
     <h4>Offered radio and antenna families — site allocation pending</h4>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Next G line</th><th>Role</th><th>Part Number</th><th>Offer total Qty</th><th>Site allocation</th></tr></thead>
      <tbody>{MR0001_RADIO_ROLE_MATRIX.quoteRoles.map(x=><tr key={x.quoteLine}>
       <td>{x.quoteLine}</td><td>{x.role}</td><td>{x.partNumber}</td><td>{x.offeredQty}</td><td>OPEN</td>
      </tr>)}</tbody></table></div>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Control</th><th>Engineering question</th><th>Status</th></tr></thead>
      <tbody>{MR0001_RADIO_ROLE_MATRIX.engineeringQuestions.map(x=><tr key={x.id}><td>{x.id}</td><td>{x.question}</td><td>{x.state}</td></tr>)}</tbody></table></div>
    </section>}
    {s.mr==="MR-0001"&&<section className="p55-panel">
     <div className="p55-eyebrow">BLD / MR REV.C1 · OWNERSHIP AND BROWNFIELD TIE-IN</div>
     <h4>New Supply vs Existing Reuse vs Interfaces — engineering controls</h4>
     <p className="p55-note">BLD drawing symbols require native diagram confirmation; existing ZWP8–ZPQ reuse does not establish that no added radio, licence, accessory or integration work is needed. Unknown reuse quantities are not zero.</p>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Gate / Site</th><th>Source evidence</th><th>Required engineering action</th><th>State</th></tr></thead>
      <tbody>{MR0001_SCOPE_OWNERSHIP_AUDIT.checks.map(x=><tr key={x.id}>
       <td><strong>{x.id}</strong><small>{x.site}</small></td>
       <td>{x.description}<small><a href={x.sourceUrl} target="_blank" rel="noreferrer">{x.source} · Read original</a></small></td>
       <td>{x.requiredDecision}</td><td>{x.state}</td>
      </tr>)}</tbody></table></div>
     <p className="p55-note"><strong>Supply Qty / Reused Qty / Installation MH:</strong> OPEN. Determine ownership from original BLD linework, MR and field verification before BOM allocation or sell pricing.</p>
    </section>}
    {s.mr==="MR-0001"&&<section className="p55-panel">
     <div className="p55-eyebrow">ENGINEERING PACKAGE COMPOSITION · MR ITEM → FUNCTIONS → QUOTE CANDIDATES</div>
     <h4>Required functional BOM and service work packages (source-first)</h4>
     <p className="p55-note">จำนวนใน MTO คือ Set/Lot; Quantity ที่ต้องซื้อจริงจะแยกตาม Functional Component และ Site/Link หลังตรวจ CAL, Layout, Power, RF and OEM. Vendor SKU เป็น candidate เท่านั้น; ไม่ใช้ vendor-offered quantity กำหนด Required Quantity.</p>
     <div className="p55-source-facts">
      <div><span>MR source packages</span><strong>{summarizeMR0001Composition().packages}</strong></div>
      <div><span>Functional component rows</span><strong>{summarizeMR0001Composition().functionRows}</strong></div>
      <div><span>Source quote candidates</span><strong>{summarizeMR0001Composition().candidateFunctionRows} functional rows</strong></div>
      <div><span>Accepted required BOM</span><strong>OPEN / HOLD</strong></div>
     </div>
     <div className="p55-table-wrap"><table className="p55-table p55-table--budget p55-table--compact">
      <thead><tr><th>+/−</th><th>Platform</th><th>MR Tag / Package</th><th>MR Qty</th><th>Functions</th><th>Required SKU Qty</th><th>Cost/Sell</th></tr></thead>
      <tbody>{MR0001_PACKAGE_COMPOSITION.packages.map(p=><React.Fragment key={p.id}>
       <tr><td><button type="button" className="p55-row-toggle" onClick={()=>togglePackage(p.id)} aria-expanded={expandedPackages.has(p.id)}>{expandedPackages.has(p.id)?"−":"+"}</button></td>
       <td>{p.platform}</td><td><strong>{p.sourceCodes.join(" / ")||"BULK / REVIEW"}</strong><small>{p.sourceDescription} · MTO row {p.sourceRowIndex}</small></td>
       <td>{p.sourceQuantityText}</td><td>{p.components.length}</td><td>OPEN / Engineering</td><td>HOLD</td></tr>
       {expandedPackages.has(p.id)&&<tr><td colSpan={7}><div className="p55-table-wrap"><table className="p55-table p55-table--compact">
        <thead><tr><th>Functional component</th><th>Quantity driver</th><th>Required qty</th><th>Next G possible SKU(s)</th><th>Vendor offered total</th><th>Engineering/Gap</th><th>Cost</th></tr></thead>
        <tbody>{p.components.map(x=><tr key={x.id}>
         <td><strong>{x.functionId}</strong></td><td>{x.quantityDriver}</td><td>OPEN</td>
         <td>{x.candidateQuotes.length?x.candidateQuotes.map(y=><div key={y.quoteLine}>{y.quoteLine} · {y.partNumber}</div>):"NOT MAPPED / OTHER SUPPLIER"}</td>
         <td>{x.candidateQuotes.map(y=>y.quoteLine+": "+y.offeredTotalQty).join(" · ")||"—"}<small>Quote-wide totals, NOT site allocated</small></td>
         <td>{x.gapState}<small>{x.technicalState}</small></td><td>HOLD</td>
        </tr>)}</tbody></table></div></td></tr>}
      </React.Fragment>)}</tbody></table></div>
     <h4>Services derived from WBS / engineering drivers — not quotation assumptions</h4>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Service</th><th>Quantity / workload driver</th><th>Equation</th><th>MH / Cost</th><th>Evidence</th></tr></thead>
     <tbody>{MR0001_PACKAGE_COMPOSITION.services.map(x=><tr key={x.id}><td>{x.name}</td><td>{x.driver}</td><td>{x.equation}</td><td>OPEN / HOLD</td><td>{x.source}</td></tr>)}</tbody></table></div>
     <p className="p55-note">Shared RF filters, power, surge and accessories may serve distinct physical interfaces. Their candidate appearance under several MR packages does not allocate or duplicate quote cost. Only an approved physical owner/interface can carry accepted quantities or cost.</p>
    </section>}
    {s.mr==="MR-0001"&&<><div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>FIRST PRINCIPLES → REQUIRED vs OFFERED → COST GATE</div>
     <div className="p55-table-wrap"><table className="p55-table p55-table--budget p55-table--compact">
      <thead><tr><th>Equipment family</th><th>Required Qty</th><th>NG quoted lines</th><th>Engineering decision</th><th>Cost readiness</th><th>Source</th></tr></thead>
      <tbody>{SCADA_0553_RECONCILIATION.rows.map(r=><tr key={r.equipmentFamily}><td>{r.equipmentFamily}</td><td>DERIVATION PENDING</td><td>{SCADA_0553_RECONCILIATION.unmappedOffered.filter(x=>x.description?.toLowerCase().includes(r.equipmentFamily.toLowerCase())).length} preliminary text matches (not approved)</td><td>{r.decision.state}<small>{r.decision.reason}</small></td><td>HOLD</td><td>MTO Rev04 → MR0001 CAL/DWG/OEM</td></tr>)}</tbody>
     </table></div><p className="p55-note">Vendor quote 53 lines are preserved as evidence. Required SKU, licence, enclosure and bulk quantities need full MR/DWG/MTO extraction before technical acceptance or repricing.</p></>}
    {s.mr==="MR-0001"&&<section className="p55-panel">
      <div className="p55-eyebrow">OEM-LEVEL TECHNICAL BID EVALUATION · NEXT G / AVIAT</div>
      <h4>Reverse vendor verification — quotation SKU → function → MR allocation → engineering decision</h4>
      <p className="p55-note">This audit covers all 53 Next G lines including separately identified spare groups D/E. Candidate matching is NOT an approved required BOM. Engineering must verify the exact installation allocation, frequency licence, OEM compatibility, power, antenna and duplicate/scope boundaries before acceptance.</p>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget">
      <thead><tr><th>Quote line / SKU</th><th>Engineering function</th><th>Qty offered</th><th>MR owner / allocation boundary</th><th>OEM/technical state</th><th>Required / accepted qty</th><th>Decision / proof</th></tr></thead>
      <tbody>{AVIAT_0553_TECHNICAL_EVALUATION.rows.map(r=><tr key={r.quoteLine}>
        <td><strong>{r.quoteLine}</strong><small>{r.partNumber}</small></td>
        <td><strong>{r.functionId}</strong><small>{r.functionRequirement}</small></td>
        <td>{r.sourceQty}<small>{r.offeredRole}</small></td>
        <td>{r.allocationBoundary}</td>
        <td><span className="p55-badge">{r.classification}</span></td>
        <td>OPEN / OPEN</td><td>{r.issues.join(" · ")||"OEM technical proof / MR mapping OPEN"}</td>
      </tr>)}</tbody></table></div>
      <h4>High-priority engineering queries / commercial exposure</h4>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>ID</th><th>Technical / scope gap</th><th>Required action</th><th>State</th></tr></thead>
      <tbody>{AVIAT_0553_TECHNICAL_EVALUATION.holds.map(g=><tr key={g.id}><td>{g.id}</td><td>{g.issue}</td><td>{g.decision}</td><td><span className="p55-badge">{g.state}</span></td></tr>)}</tbody>
      </table></div>
      <p className="p55-note">Financial exposure remains OPEN; no guessed cost or automatic acceptance. Vendor may be correct based on an incomplete RFQ — source omissions and bid deviations must be tracked separately.</p>
    </section>}
    {s.mr==="MR-0001"&&<section className="p55-panel">
     <div className="p55-eyebrow">SOURCE QUOTE → POSSIBLE MR CONSUMERS → VERIFIED ALLOCATION</div>
     <h4>Next G Quote Allocation Ledger — Prevent Shared SKU Double Counting</h4>
     <p className="p55-note">The quantities below are total quantities in the supplier quotation, never per-site assignments. The same SKU may appear for several MR functional packages. No site purchase quantity is accepted until engineering allocates it once, with BLD / MTO / OEM proof.</p>
     <div className="p55-source-facts">
      <div><span>Quote lines audited</span><strong>{MR0001_OFFER_ALLOCATION_AUDIT.sourceLineCount}</strong></div>
      <div><span>Base A/B/C</span><strong>{MR0001_OFFER_ALLOCATION_AUDIT.sourceBaseLines}</strong></div>
      <div><span>Spares D/E</span><strong>{MR0001_OFFER_ALLOCATION_AUDIT.sourceSpareLines} · ISOLATED</strong></div>
      <div><span>Accepted allocations / cost</span><strong>OPEN / HOLD</strong></div>
     </div>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget">
       <thead><tr><th>Quote line / SKU</th><th>Offered qty (quote total)</th><th>Possible MR sites/functions</th><th>Allocation state</th><th>Approved site qty</th><th>Cost use</th></tr></thead>
       <tbody>{MR0001_OFFER_ALLOCATION_AUDIT.candidates.map(q=><tr key={q.quoteLine}>
        <td><strong>{q.quoteLine}</strong><small>{q.partNumber}</small></td>
        <td>{q.offeredQty}<small>{q.group} · {q.offeredRole}</small></td>
        <td>{q.possibleConsumers.length?q.possibleConsumers.map(x=>x.site+" / "+x.functionId).filter((v,i,a)=>a.indexOf(v)===i).join(" · "):"NOT ALLOCATED / SPARE / OTHER SOURCE"}</td>
        <td>{q.state}</td><td>OPEN</td><td>HOLD</td>
       </tr>)}</tbody>
     </table></div>
     <p className="p55-note">Rule: sum of VERIFIED site allocations must not exceed a quote line's offered quantity. Repeated candidate consumers are not purchase quantities. Supplier offered qty, approved required qty and accepted cost remain separate.</p>
    </section>}
    {s.mr==="MR-0001"&&<section className="p55-panel">
     <div className="p55-eyebrow">REQUIRED ↔ OFFERED · QUANTITY GAP / OWNERSHIP / EXPOSURE</div>
     <h4>Requirement & Supplier Gap Register — source-driven, not a compliance approval</h4>
     <p className="p55-note">Missing vendor candidate is not evidence that a product is unnecessary; multiple possible consumers are not independent purchases. Accepted Qty, gap and exposure cannot be calculated until engineering proof, ownership, licence and allocations pass.</p>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget">
     <thead><tr><th>MTO / Site</th><th>Required function</th><th>Candidate quote lines</th><th>Required Qty</th><th>Allocated Offered Qty</th><th>Gap / Exposure</th><th>Decision</th></tr></thead>
     <tbody>{MR0001_GAP_ASSESSMENT.requirements.map(r=><tr key={r.id}>
      <td>{r.mtoRow} · {r.site}</td><td><strong>{r.functionId}</strong></td>
      <td>{r.offerLines.join(", ")||"NONE FOUND IN NEXT G"}</td>
      <td>OPEN</td><td>OPEN</td><td>OPEN / HOLD</td><td><span className="p55-badge">{r.issueStatus}</span></td>
     </tr>)}</tbody></table></div>
     <p className="p55-note">Unknown quantities stay null (not zero). The supplier-line ledger above holds 53 original quote quantities once each; this requirement view never multiplies them by possible consumers.</p>
    </section>}
    {s.mr==="MR-0001"&&<section className="p55-panel">
      <div className="p55-eyebrow">ENGINEERING PROOF · MR / BLD / RPT → REQUIRED FUNCTION</div>
      <h4>Requirement Evidence Matrix — source locators and unresolved proof</h4>
      <p className="p55-note">The linked excerpts support specific requirements, but are not OEM certificates or native drawing takeoff. MTO Set/Lot, installed/purchase qty, licence and price remain OPEN. An unmapped clause means review pending, not compliance.</p>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
       <thead><tr><th>Evidence ID</th><th>Document locator</th><th>Source-derived requirement</th><th>Next proof</th><th>Status</th></tr></thead>
       <tbody>{MR0001_REQUIREMENT_EVIDENCE_MATRIX.sources.map(e=><tr key={e.id}>
        <td><strong>{e.id}</strong></td><td><a href={e.url} target="_blank" rel="noreferrer">{e.locator}</a></td>
        <td>{e.fact}</td><td>{e.proof}</td><td>{e.state}</td>
       </tr>)}</tbody></table></div>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
       <thead><tr><th>MTO row / site</th><th>Required function</th><th>Evidence links</th><th>Exact clause proof</th><th>Approved Qty/Cost</th></tr></thead>
       <tbody>{MR0001_REQUIREMENT_EVIDENCE_MATRIX.requirementRows.map(r=><tr key={r.id}>
        <td>{r.mtoRow} · {r.site}</td><td>{r.functionId}</td><td>{r.evidenceIds.join(", ")||"UNMAPPED — REVIEW"}</td>
        <td>{r.exactClauseVerification}</td><td>OPEN / HOLD</td>
       </tr>)}</tbody></table></div>
     </section>}
    {s.mr==="MR-0001"&&<InnovaBudgetEvidence0553/>}
    <div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>Source quotation / evidence — vendor candidates and terms</div>
    <div className="p55-table-wrap"><table className="p55-table p55-table--budget p55-table--compact">
     <thead><tr><th>No.</th><th>Vendor / Supplier</th><th>Document / Scope</th><th>Type / Revision</th><th>Quoted Total ({displayCurrency})</th><th>Evidence Status</th><th>Source / Next Action</th></tr></thead>
     <tbody>{s.sources.map((v,i)=><tr key={v.id}>
      <td>{i+1}</td>
      <td><strong>{v.supplier}</strong></td>
      <td>{v.document}<small>{v.mr}</small></td>
      <td>{v.type}<small>Rev: {v.revision||"OPEN"}</small></td>
      <td className="is-number">{Number.isFinite(v.quotedTotal)?shown(v.quotedTotal,v.currency||"USD"):"NOT EXTRACTED"}{v.mr==="MULTI"&&<small>MULTI-MR / NOT ALLOCATED</small>}</td>
      <td><span className="p55-badge">{v.status}</span></td>
      <td><a href={v.url} target="_blank" rel="noreferrer">Open source</a><small>{v.next}</small></td>
     </tr>)}</tbody>
    </table></div>
    <div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>Detailed source quotation items — supplier price / currency as quoted</div>
    {getProject0553SupplierQuotes().filter(q=>q.mr.split("/").includes(s.mr)).map(q=><section key={q.id} className="p55-source-detail">
     <div className="p55-source-detail__head"><div><h4>{q.vendor} — {q.quotation}</h4><p>{q.source} · {q.scope}</p></div><span className="p55-badge">{q.status}</span></div>
     <div className="p55-source-facts">
      <div><span>Offer date</span><strong>{q.date}</strong></div>
      <div><span>Currency</span><strong>{q.currency}</strong></div>
      <div><span>Quoted total</span><strong>{shown(q.quotedTotal,q.currency)}</strong></div>
      <div><span>Valid through</span><strong>{q.validUntil||"HISTORICAL / EXPIRED"}</strong></div>
     </div>
     <p className="p55-note">{q.terms} · Price evidence only; verify site applicability, quote expiry, and whether lines are optional/spares before inclusion.</p>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--quoted p553-quoted-lines"><thead><tr><th>Code</th><th>Part Number</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Quoted Total</th></tr></thead>
     <tbody>{q.lines.map(([code,pn,description,qty,unitPrice,quotedTotal,group,page,pricingState])=><tr key={code}><td>{code}</td><td>{pn}</td><td>{description}</td><td className="is-number">{qty}</td><td className="is-number">{Number.isFinite(unitPrice)?shown(unitPrice,q.currency):"— (AS QUOTED)"}</td><td className="is-number">{Number.isFinite(quotedTotal)?shown(quotedTotal,q.currency):Number.isFinite(unitPrice)?shown(qty*unitPrice,q.currency):"— (AS QUOTED)"}</td></tr>)}</tbody></table></div>
     <p className="p55-note">{q.id==="NG-260916"?"All 53 original BOQ lines (A–E) preserved in JSON. Vendor quoted line totals reconcile to the PDF quote; Group D/E are spares and must not automatically enter base equipment.":"Document detail is historical/source evidence, not automatically required Z1F BOM."}</p>
    </section>)}
    <div className="p55-eyebrow" style={{marginTop:14,marginBottom:8}}>Internal budget bridge — no fabricated allocations</div>
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
     <thead><tr><th>Commercial line</th><th>Direct cost</th><th>Rev08 customer sell</th><th>New cost / sell</th><th>Evidence / control</th></tr></thead>
     <tbody><tr><td>{s.code} · {s.name}</td><td>OPEN</td><td>{shown(s.baseline?.[2])}</td><td>OPEN</td><td>Rev08 baseline · MTO Rev04 working · Vendor reconciliation required</td></tr></tbody>
    </table></div>
   </div></td></tr>}
  </React.Fragment>)}</tbody></table></div>
  <p className="p55-note">Source: MTO Rev04 (4 MRs), REV08 Customer Workbook, Vendor Evidence Registry. Unlike 0550's quoted PAGA item detail, 0553's vendor line items are not yet extracted into the controlled dataset; DO NOT treat equipment-family headings as priced BOM rows.</p>
 </section>;
}
