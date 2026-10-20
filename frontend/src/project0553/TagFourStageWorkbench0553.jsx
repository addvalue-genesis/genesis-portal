import React,{useMemo} from "react";
import {bomPriceTHB0553} from "./bomPresentationContract0553";
import {ControlledModuleSection0553} from "./ControlledModuleSection0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {getTagBomFourStage0553} from "./data/tagBomFourStageReadModel0553";

const fmt=x=>Number.isFinite(x)?x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT VERIFIED";
const sourcePrice=(currency,amount)=>Number.isFinite(amount)?(currency||"UNVERIFIED")+" "+fmt(amount):"NOT QUOTED";
export function TagFourStageWorkbench0553({site,tagRow,moduleKey,fx=null,children}){
 const m=useMemo(()=>getTagBomFourStage0553(site,tagRow),[site,tagRow]);
 const id=moduleKey;
 const evidenceTHB=(r,kind)=>{
  const existing=kind==="rate"?r.rateEvidenceOriginal:r.amountEvidenceOriginal;
  const originalCurrency=r.currencyEvidenceOriginal;
  return Number.isFinite(existing)?bomPriceTHB0553(existing,originalCurrency,fx).label:null;
 };
 return <div className="p553-four-stage-workbench" data-component-key={id+".four-stage"}>
  <p className="p55-note"><strong>วิธีอ่าน:</strong> 1 Required = เราต้องใช้อะไร / 2 Working = เราคิดต้นทุนอะไร / 3 Vendor = ผู้ขายเสนออะไร / 4 Verify = พิสูจน์ว่าสอดคล้องข้อกำหนดหรือไม่. ทุกขั้นตอนอ่านจาก Data/Cost Ledger เดิม และไม่มีการอนุมัติสินค้าอัตโนมัติ</p>
  <ControlledModuleSection0553 moduleKey={id+".required-bom"} title="01 · Required Engineering BOM — สิ่งที่ Engineering ต้องการ" defaultOpen>
   <p className="p55-note"><strong>Requirement source:</strong> MR0001 MTO Rev04 → MR0001 Engineering Required BOM → Functional Package Composition. {m.site} / {m.tag} / source row {m.row} = {m.scopeQty??"REVIEW"} {m.scopeUnit||"Set/Lot"} · {m.packageFamily}. Physical SKU Qty is NOT equal to 1 MTO Set automatically.</p>
   {m.ciscoTc0001&&<p className="p55-note" data-component-key={id+".required-bom.tc0001"}>
    <strong>TC-0001 Item 13 — Revised 8-Port Required BOM:</strong> IE-3400-8P2S-E (8 RJ45 PoE + 2 built-in SFP slots), PWR-IE65W-PC-DC, main-switch SmartNet and DNA Essentials licence.
    IEM-3300-8T= and CON-SNT-IEM3308T are excluded from the working package.
    <strong> Site working unit reference: {sourcePrice("THB",m.ciscoTc0001.unitWorkingTHB)}.</strong>
    <small>{m.ciscoTc0001.engineeringGate} · Port assignment, PoE load/PSU rating and Layer 3 licence still require Engineering verification. No approved SKU quantity or customer sell release.</small>
   </p>}
   {m.ownerEvidence&&<p className="p55-note" data-component-key={id+".required-bom.owner-evidence"}>
    <strong>{m.site} / {m.tag} / MTO Row {m.row} — {m.ownerEvidence.category}:</strong> Working classification {m.ownerEvidence.siteRole}.
    <small>Source: {m.ownerEvidence.sourceEvidence}. All function/quantity/price rows below are read-only existing TAG evidence; they are not approved equipment counts, purchases or extra postings.</small>
    {m.ownerEvidence.category==="DATO"&&<small>RJ45 panel connector and field plug are distinct functions. Ex-certified disconnect equivalence is pending; RS retail is not an OEM/INNOVA quotation.</small>}
    {m.ownerEvidence.category==="SURGE"&&<small>Check PoE/RF suitability, Ex and earthing. Surge remains owned by its own SA TAG, not ODU/IDU.</small>}
    {m.ownerEvidence.category==="BULK"&&<small>CAT6A and M20 quantities are site-TAG budget allowances, not dimensioned cable-end takeoff; physical GA holes are not purchased glands.</small>}
    {m.ownerEvidence.category==="ENCLOSURE"&&<small>Enclosure base or reuse follows the local MTO/BLD. A historical BARTEC comparator is not a current Z1F quote. Existing ZWP11 panel is not new procurement.</small>}
   </p>}
   <p className="p55-note"><strong>Source identity:</strong> {m.sourceId||"MTO TAG not uniquely mapped"} · {m.sourceMatched?"Source TAG cross-reference found":"Source TAG identity needs review"}. <strong>Accepted Physical SKU BOM:</strong> {m.physicalSkuApproved?"PARTIAL / VERIFY PER FUNCTION":"NOT YET ENGINEERING APPROVED"}.</p>
   {m.gaEvidence&&<div className="p55-panel" data-component-key={id+".required-bom.ga-revision-comparison"}>
    <p className="p55-note"><strong>Ex Enclosure GA Revision / Model conflict — {m.site}:</strong> Z1F GA-0001 Sheet13 is <strong>{m.gaEvidence.z1f.partNumber}</strong> ({m.gaEvidence.z1f.entry.normalTotal} × bottom M20 + independent drain); BARTEC 2022 Type {m.gaEvidence.historicalType.id.replace("TYPE_","")} is <strong>{m.gaEvidence.historical.partNumber}</strong> ({m.gaEvidence.historical.entry.normalTotal} M20 = 12 top + 2 left + 2 right). Prosper 2024 historical THB {fmt(m.gaEvidence.quote.item1.unitPriceTHB)} is a different panel basis with {m.gaEvidence.quote.item1.normalEntryTop} TOP entries. <strong>DTS minimum {18} entries</strong> remains unresolved for all these patterns.</p>
    <p className="p55-note"><strong>{m.gaEvidence.isZwp8?"ZWP8 two radio branches / ONE enclosure":"ZWP20 one MTO enclosure Set"}:</strong> {m.gaEvidence.isZwp8?"BARTEC historical Type2 has two PoE injectors + two Ethernet surge protectors + two patch panels. Type1 and Z1F Sheet13 each show only one; Type2 is an engineering comparator, not selected OEM purchase or a second separate cabinet.":"Z1F Sheet13 contains a different factory BOM from historical Type1: compare all quantities and proposed installed equipment individually."} No selected model or site total is altered by this comparison.</p>
    {m.gaEvidence.factoryBom.length>0&&<ControlledModuleSection0553 moduleKey={id+".required-bom.z1f-ga-complete-factory-bom"} title={"Z1F GA Sheet13 — "+m.gaEvidence.factoryBom.length+" source component/assembly lines (NOT additive)"} defaultOpen>
      <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact"><thead><tr><th>Item</th><th>Exact GA SKU / Manufacturer</th><th>GA Qty</th><th>Factory / Customer / Cost owner</th></tr></thead><tbody>
      {m.gaEvidence.factoryBom.map(x=><tr key={x.id}><td><strong>{x.description}</strong></td><td>{x.partNumber||"ASSEMBLY / FIELD FITTING"}<small>{x.manufacturer||"—"}</small></td><td>{x.documentedQty} {x.unit}</td><td>{x.classification}<small>{x.costOwner} · No second posting</small></td></tr>)}
      </tbody></table></div>
    </ControlledModuleSection0553>}
    <p className="p55-note"><strong>Certified ACTIVE glands:</strong> NOT ESTABLISHED. Factory M20 holes and plugs do not become active gland Qty. Z1F GA marks switch/PoE/surge/patch-panel as <strong>customer supplied and installed</strong>; preserve distinct Cisco/IDU/SA/DATO TAG owners.</p>
    {(m.gaEvidence.deviations||[]).map((note,i)=><small key={i}>{i+1}. {note}</small>)}
   </div>}
   {m.zwp8RadioEvidence&&<div className="p55-panel" data-component-key={id+".required-bom.zwp8-priced-radio-owner"}>
    <p className="p55-note"><strong>{m.zwp8RadioEvidence.tag} / ZWP8 grouped Row43 — Working Price Evidence:</strong> {m.zwp8RadioEvidence.role}. <strong>USD {fmt(m.zwp8RadioEvidence.originalOwnerRateUSD)}</strong> · displayed {bomPriceTHB0553(m.zwp8RadioEvidence.originalOwnerRateUSD,"USD",fx).label}. One TAG 1 Set only; quote-wide Qty is not a site multiplier. Paired IDU {m.zwp8RadioEvidence.pairedIdU}, Antenna {m.zwp8RadioEvidence.associatedAntenna}, both separate cost owners.</p>
    <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact"><thead><tr><th>Next G quote function / SKU</th><th>Original USD rate</th><th>Cost already posted (USD)</th><th>Working THB at selected FX</th></tr></thead><tbody>
    {m.zwp8RadioEvidence.functions.map(r=><tr key={r.code}><td>{r.code}<small>{r.sku} / {r.description}</small></td><td>USD {fmt(r.quotedUnitUSD)}</td><td>USD {fmt(r.selectedExtendedUSD)}</td><td>{bomPriceTHB0553(r.selectedExtendedUSD,"USD",fx).label}<small>NON-ADDITIVE to ZWP8 Row43</small></td></tr>)}
    </tbody></table></div>
    <p className="p55-note"><strong>Role/procurement gate:</strong> {m.zwp8RadioEvidence.exclusions.join(" · ")}. Source rate is an internal budget allocation; current vendor offer does not prove OEM approval.</p>
   </div>}
   {m.tcabRequired&&<div className="p55-panel" data-component-key={id+".required-bom.tcab-assembly"}>
    <p className="p55-note"><strong>{m.site} / {m.tag} Row {m.row} — Required SCADA Ex e Assembly:</strong> MTO 1 Set, BARTEC working model <strong>{m.tcabRequired.selectedModel}</strong>, SS316L, {m.tcabRequired.sizeMm.join(" × ")} mm. Working TAG cost <strong>{sourcePrice("THB",m.working.extended)}</strong> from a historical Prosper budget reference, NOT a current confirmed supplier quotation or approved Ex design.</p>
    <p className="p55-note"><strong>GA capacity:</strong> {m.tcabRequired.entries.top} top + {m.tcabRequired.entries.left} left + {m.tcabRequired.entries.right} right = <strong>{m.tcabRequired.entryCount} M20 cable-entry holes</strong>; {m.tcabRequired.factoryStoppingPlugs} factory plugs, {m.tcabRequired.factoryLocknuts} locknuts and {m.tcabRequired.drainValveCount} drain valve in a separate hole. These are historical GA assembly counts, not separate material purchase quantities.</p>
    <p className="p55-note"><strong>Open engineering deviation:</strong> DTS requires at least {m.tcabRequired.requiredEntriesByDts} entries; selected GA basis has {m.tcabRequired.entryCount}. Client disposition, Ex/thermal arrangement and final cable-end/OD allocation remain open. Active field glands and final purchase quantity belong to Bulk Row 11, not another TCAB Row 9 charge.</p>
    <p className="p55-note"><strong>Source:</strong> {m.tcabRequired.source}. <strong>Cost ownership:</strong> {m.tcabRequired.includedCostOwner}; {m.tcabRequired.fieldBulkCostOwner}. No change to Working Sell.</p>
   </div>}
   {m.site==="ZWP20"&&m.row===11&&m.ownerEvidence?.category==="BULK"&&<p className="p55-note" data-component-key={id+".required-bom.ga-gland-reconciliation"}><strong>Ex entry correction:</strong> Z1F GA Sheet13 documents 10 BOTTOM M20 holes + 10 factory fitted stopping plugs, whereas 2022 BARTEC GA Type1 shows 16 holes and Prosper 2024 10 TOP holes. These are DIFFERENT reference configurations. Current 1 active M20 gland in Row11 is only a THB1,020 provisional cost allowance, not the final installed quantity. Confirm unique cable ends, E&I penetration, gland OD/armour/Ex, factory inclusion and DTS 18-hole deviation before procurement.</p>}
   {m.bartecBulkRequired&&<div className="p55-panel" data-component-key={id+".required-bom.bartec-quantity"}>
    <p className="p55-note"><strong>BARTEC GA manufacturer reference — physical assembly pattern, not confirmed new site procurement:</strong> 12 M20 top holes + 2 left + 2 right = <strong>{m.bartecBulkRequired.holeCount} M20 cable-entry holes</strong>. Initially supplied: <strong>{m.bartecBulkRequired.initialFactoryPlugs} M20 stopping plugs</strong> and 16 locknuts; one drain valve uses a separate hole. These components are within the BARTEC TCAB factory assembly, NOT 16 separately required cable glands.</p>
    <p className="p55-note"><strong>Actual active cable glands by OD / certified SKU:</strong> {m.bartecBulkRequired.installedGlandRequired??"CABLE-END TAKEOFF REQUIRED"} · <strong>Additional gland purchase:</strong> {m.bartecBulkRequired.netAdditionalGlandPurchase??"VENDOR INCLUSION / OD REQUIRED"} · <strong>Current separately booked working allowance:</strong> {m.bartecBulkRequired.recordedActiveGlandAllowance} M20 gland (provisional) + CAT6A 69m (budgetary route). Factory Included, Required, and Purchase quantities are different.</p>
    <p className="p55-note"><strong>GA evidence:</strong> {m.bartecBulkRequired.source}. <strong>Site gate:</strong> {m.ownerEvidence?.siteRole||"MTO SITE REVIEW"}; confirm site-specific enclosure model, active cable entry usage and NEW/REUSE before procurement. <strong>Contractual conflict:</strong> {m.bartecBulkRequired.deviation}. <strong>Other system:</strong> {m.bartecBulkRequired.relatedOtherMr}</p>
   </div>}

   {m.budgetBridge&&<p className="p55-note"><strong>ZWP20 Row11 internal budgetary scenario:</strong> THB {fmt(m.budgetBridge.scenarioTHB)} vs booked THB {fmt(m.budgetBridge.previousTHB)} (difference THB {fmt(m.budgetBridge.deltaTHB)}). F01 is the one-Lot subtotal/roll-up and must NOT be summed again with F03/F04. This is a priced partial scope, NOT final RFQ compliance or confirmed gland fit. Unpriced Earthing/Supports/MCT/other interfaces are risk exposure.</p>}
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
    <thead><tr><th>Required Engineering Function / ID</th><th>Quantity Driver & Proof</th><th>GA Documented Qty / Unit</th><th>Working Estimate Qty</th><th>Unit Rate THB</th><th>Working Budget THB</th><th>Approved SKU Qty</th><th>Technical / Selection State</th></tr></thead><tbody>
    {m.required.map(r=><tr key={r.id}><td><strong>{r.functionId}</strong><ComponentCopyId projectId="PJ2608-0553" componentKey={id+".required-bom.function."+r.id.toLowerCase()} componentName={r.functionId}/></td>
     <td>{r.quantityDriver}<small>{r.qtyProof}</small>{r.quantityEvidence&&<small>Evidence: {r.quantityEvidence}</small>}</td>
     <td>{r.documentedQty??"—"} {r.documentedQty!==null&&r.documentedQty!==undefined?r.documentedUnit||"":""}<small>{r.qtyClass==="GA_FACTORY_INCLUDED_ACCESSORY"?"FACTORY INCLUDED — BARTEC TCAB PACKAGE":r.qtyClass==="GA_CONFIRMED_ASSEMBLY_CAPACITY"?"ENCLOSURE CAPACITY — NOT EXTRA PURCHASE":r.qtyClass||"NOT YET DERIVED FROM SOURCE"}</small></td>
     <td>{r.derivedWorkingQty??"SOURCE QTY TO ASSESS"} {r.budgetUnit||""}<small>{r.qtyState}</small></td>
     <td>{r.qtyClass==="GA_FACTORY_INCLUDED_ACCESSORY"?"INCLUDED IN TCAB PACKAGE":r.qtyClass==="GA_CONFIRMED_ASSEMBLY_CAPACITY"?"N/A — PHYSICAL ENTRY":Number.isFinite(r.budgetRateTHB)?"THB "+fmt(r.budgetRateTHB):evidenceTHB(r,"rate")||"PRICE EVIDENCE REQUIRED"}<small>{r.budgetSource||r.quoteEvidenceLine||r.quantityEvidence||"Engineering source review"}</small>{Number.isFinite(r.rateEvidenceOriginal)&&<small>Original {r.currencyEvidenceOriginal||"UNKNOWN"} {fmt(r.rateEvidenceOriginal)} · Existing Ledger evidence only · Non-additive</small>}</td>
     <td>{r.qtyClass==="GA_FACTORY_INCLUDED_ACCESSORY"?"INCLUDED — NO EXTRA COST":r.qtyClass==="GA_CONFIRMED_ASSEMBLY_CAPACITY"?"INCLUDED IN ENCLOSURE":Number.isFinite(r.budgetAmountTHB)?"THB "+fmt(r.budgetAmountTHB):evidenceTHB(r,"amount")||"UNPRICED BULK EXPOSURE"}<small>{r.qtyClass==="GA_FACTORY_INCLUDED_ACCESSORY"?"Cost Owner: SCADA TCAB assembly; do not post again":r.budgetPosting||"Source not costed"} {r.budgetBasis||""}</small>{Number.isFinite(r.amountEvidenceOriginal)&&<small>Original {r.currencyEvidenceOriginal||"UNKNOWN"} {fmt(r.amountEvidenceOriginal)} · Non-additive · Existing TAG Ledger cost owner</small>}</td>
     <td>{r.approvedSkuQty??"OEM approval pending"}</td><td>{r.requirementState}<small>{r.selectionStatus}</small>{r.costOwner&&<small>Working owner: {r.costOwner}</small>}</td>
    </tr>)}
    {m.required.length===0&&<tr><td colSpan={8}>Functional decomposition has not been mapped to this MTO TAG. Preserve source scope and request engineering proof; do not infer a physical SKU BOM.</td></tr>}
    </tbody></table></div>
  </ControlledModuleSection0553>

  <ControlledModuleSection0553 moduleKey={id+".working-priced-bom"} title="02 · Working Priced BOM — รายการที่คิดต้นทุนของ TAG นี้" defaultOpen>
   <p><strong>TAG working subtotal: {sourcePrice(m.working.currency,m.working.extended)}</strong> · {m.working.status}</p>
   <p className="p55-note">Cost Owner = {m.owner}. Same controlled TAG Cost Ledger as the location summary; no independent amount is booked here. Selected working/budgetary item is NOT an OEM-approved material take-off.</p>
   {m.ownerEvidence&&<p className="p55-note"><strong>Source/Owner reconciliation:</strong> {m.ownerEvidence.category} — {m.working.completeness}. Working components belong to the same TAG; budgetary/GA and retailer references are display evidence only. {m.ownerEvidence.countedTagAmount===null?"No verified posted component total for this TAG; do not interpret unpriced scope as zero.":"One counted TAG posting already exists in the site ledger; no additional posting from this table."}</p>}
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
    <thead><tr><th>Costed Function / Quote Ref</th><th>Working SKU</th><th>Required Working Qty</th><th>Working Unit Rate</th><th>TAG Extended</th><th>Source / State</th></tr></thead><tbody>
    {m.working.functions.map(f=><tr key={f.id}><td><strong>{f.functionId}</strong><small>{f.quoteCode||"NO QUOTE CODE"}</small></td><td>{f.sku||"NOT SELECTED"}</td><td>{f.qty??"NOT DERIVED"}</td>
      <td>{f.includedWithoutExtra?"INCLUDED; NO EXTRA":sourcePrice(f.currency,f.unit)}</td><td>{f.includedWithoutExtra?"INCLUDED":sourcePrice(f.currency,f.extended)}</td><td>{f.sourceRateState}<small>{f.note}</small></td></tr>)}
    {m.working.functions.length===0&&<tr><td colSpan={6}>Function-level pricing is not separately reconciled for this TAG. Existing TAG Ledger subtotal and source evidence remain available; do not infer a complete SKU breakdown.</td></tr>}
    </tbody></table></div>
   {m.working.otherOwnerFunctions.length>0&&<p className="p55-note"><strong>Do not double count:</strong> {m.working.otherOwnerFunctions.map(f=>f.functionId+" → "+f.owner).join(" · ")} belong to separate physical TAG Cost Owners and are NOT part of this TAG total.</p>}
   <p className="p55-note"><strong>Function sum versus TAG Ledger:</strong> {m.working.completeness}. {Number.isFinite(m.working.deltaFromLedger)?"Difference "+sourcePrice(m.working.currency,m.working.deltaFromLedger):"A function-by-function reconciliation cannot yet be certified from current data."} {m.working.assumptions.length>0?"Further qualifications are recorded in Engineering Verification.":""}</p>
  </ControlledModuleSection0553>

  <ControlledModuleSection0553 moduleKey={id+".vendor-comparison"} title="03 · Vendor Offer Comparison — หลักฐานที่ผู้ขายเสนอ">
   <p className="p55-note"><strong>07 Vendor is the original quotation source.</strong> This read-only owner-scoped comparison is not a supplier-driven Required BOM. Vendor offered quantity is quote-wide; TAG working quantity is separately allocated. <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.supplier" componentName="Vendor source and supplier quotation registry"/></p>
   {m.ownerEvidence&&<p className="p55-note"><strong>{m.site} / {m.ownerEvidence.category} quotation boundary:</strong> Supplier quoted Qty belongs to the source quotation, not automatically to this site. Original N/A source rates remain N/A; retail working rates are separate evidence. An unselected alternative is not added to cost.</p>}
   {m.tcabRequired&&<p className="p55-note"><strong>BARTEC / Prosper historical quotation Q-PROSRY-24051:</strong> line 1 is the internal budgetary comparable for TCAB Row 9; line 2 is an unselected alternative. The original 2024 quoted quantities are not Z1F purchase quantities. Requotation and certificate/layout review remain required.</p>}
   {m.ciscoTc0001&&<p className="p55-note"><strong>Cisco VST A-0048/2026 Rev.1:</strong> original 11 quoted lines remain visible. The 9 retained quote codes feed the revised 8-port working TAG; expansion module and module SmartNet are audit-only (not charged). Quotation remains expired; engineering release is pending.</p>}
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
    <thead><tr><th>Supplier Quote Line</th><th>Original Supplier SKU</th><th>Vendor Quoted Qty</th><th>Original Unit / Extended</th><th>TAG Working Qty / Amount</th><th>Difference / Technical Gate</th></tr></thead><tbody>
    {m.offered.map(r=><tr key={r.code}><td><strong>{r.code}</strong><small>{r.quotation||r.quoteId}</small>
      <ComponentCopyId projectId="PJ2608-0553" componentKey={id+".vendor-comparison."+r.code.toLowerCase()} componentName={r.code+" supplier comparison"}/></td>
     <td>{r.sku||"NOT FOUND"}<small>{r.description}</small></td><td>{r.offeredQty??"NOT QUOTED"}</td>
     <td>{sourcePrice(r.currency,r.quotedUnit)}<small>Original quote extension: {sourcePrice(r.currency,r.quotedTotal)}</small></td>
     <td>{r.sourceStatus?.startsWith("TC0001_EXCLUDED")||r.sourceStatus?.startsWith("HISTORICAL_ALTERNATIVE")?"EXCLUDED":r.workingQty??"NOT DERIVED"}<small>{r.sourceStatus?.startsWith("TC0001_EXCLUDED")||r.sourceStatus?.startsWith("HISTORICAL_ALTERNATIVE")?"NOT INCLUDED IN WORKING COST":sourcePrice(r.currency,r.workingExtended)}</small></td>
     <td>{r.sourceRateNull?"Vendor rate NULL; management zero incremental assumption is NOT a sourced vendor price":r.sourceStatus}<small>{r.costOwner}</small></td>
    </tr>)}
    {m.offered.length===0&&<tr><td colSpan={6}>{m.otherSupplierEvidence?"Current TAG has supplier/candidate evidence, but no uniquely matching Next G source row. Inspect the source reference below; do not equate the TAG total to a full supplier quotation.":"No uniquely mapped quoted vendor line for this TAG."}</td></tr>}
    </tbody></table></div>
   {m.otherSupplierEvidence&&<p className="p55-note">Existing ledger reference (not a second quotation): {m.working.selectedVendor||"Vendor pending"} · {m.working.selectedSku||"SKU pending"} · {m.working.source||"Source not indexed"}.</p>}
   <p className="p55-note">{m.ciscoTc0001
    ?"Original VST quote is evidence only. Cisco TAG working amount comes from the shared 8-port MTO ledger; the excluded expansion codes are non-additive and no quoted quantity is multiplied into each site twice."
    :m.tcabRequired
    ?"Historical Prosper rates provide a Row9 budget reference only. BARTEC factory-installed parts and entry holes are non-additive; CAT6A, active field glands and other Bulk Row11 functions retain their own cost owners."
    :"Full Next G quotation may contain other lines owned by IDU, surge, antenna, spares, or another site. Those must stay under their own Cost Owner or the 07 Vendor master. No quotation-wide amounts are added to this TAG."}</p>
  </ControlledModuleSection0553>

  <ControlledModuleSection0553 moduleKey={id+".engineering-verification"} title="04 · Engineering Verification — RFQ / CAL-RPT / Scope / Audit">
   {m.ownerEvidence&&<p className="p55-note" data-component-key={id+".engineering-verification.owner-evidence"}>
     <strong>Site-specific source proof / non-duplication:</strong> {m.ownerEvidence.siteRole}.
     {(m.ownerEvidence.notes||[]).map((note,i)=><small key={i}>{i+1}. {note}</small>)}
     <small>Never change Rev02/Rev03 protected cost owners, A5 non-additive bulk, original quotations or customer Working Sell in this read-only workbench.</small>
   </p>}
   <p className="p55-note"><strong>Validation before approval:</strong> Original MR/BLD/LAY/STD/RPT, exact radio model, available throughput/NMS entitlement, Myanmar country region, Ex, power, mounting, cable interfaces, source revision and cost ownership. The diagnostic modules below preserve all prior audit/requirements data.</p>
   {m.working.assumptions.length>0&&<ControlledModuleSection0553 moduleKey={id+".engineering-verification.assumptions"} title={"Assumptions & technical qualifications ("+m.working.assumptions.length+")"}>
    <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact"><thead><tr><th>#</th><th>Existing TAG Ledger qualification</th></tr></thead><tbody>
     {m.working.assumptions.map((x,i)=><tr key={i}><td>{i+1}</td><td>{x}</td></tr>)}
    </tbody></table></div>
   </ControlledModuleSection0553>}
   {children}
   <p className="p55-note"><strong>Release Gate: NOT APPROVED.</strong> Vendor quote/source match and management budget decisions cannot independently certify Engineering compliance or customer sell.</p>
  </ControlledModuleSection0553>
 </div>;
}
