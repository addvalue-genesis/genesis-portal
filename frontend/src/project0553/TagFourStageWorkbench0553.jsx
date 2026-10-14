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
   <p className="p55-note"><strong>Source identity:</strong> {m.sourceId||"MTO TAG not uniquely mapped"} · {m.sourceMatched?"Source TAG cross-reference found":"Source TAG identity needs review"}. <strong>Accepted Physical SKU BOM:</strong> {m.physicalSkuApproved?"PARTIAL / VERIFY PER FUNCTION":"NOT YET ENGINEERING APPROVED"}.</p>
   {m.bartecBulkRequired&&<div className="p55-panel" data-component-key={id+".required-bom.bartec-quantity"}>
    <p className="p55-note"><strong>BARTEC SCADA Enclosure — verified manufacturer GA quantities for this working design:</strong> 12 M20 top holes + 2 left + 2 right = <strong>{m.bartecBulkRequired.holeCount} M20 cable-entry holes</strong>. Initially supplied: <strong>{m.bartecBulkRequired.initialFactoryPlugs} M20 stopping plugs</strong> and 16 locknuts; one drain valve uses a separate hole. These components are within the BARTEC TCAB factory assembly, NOT 16 separately required cable glands.</p>
    <p className="p55-note"><strong>Actual active cable glands by OD / certified SKU:</strong> {m.bartecBulkRequired.installedGlandRequired??"CABLE-END TAKEOFF REQUIRED"} · <strong>Additional gland purchase:</strong> {m.bartecBulkRequired.netAdditionalGlandPurchase??"VENDOR INCLUSION / OD REQUIRED"} · <strong>Current separately booked working allowance:</strong> {m.bartecBulkRequired.recordedActiveGlandAllowance} M20 gland (provisional) + CAT6A 69m (budgetary route). Factory Included, Required, and Purchase quantities are different.</p>
    <p className="p55-note"><strong>GA evidence:</strong> {m.bartecBulkRequired.source}. <strong>Contractual conflict:</strong> {m.bartecBulkRequired.deviation}. <strong>Other system:</strong> {m.bartecBulkRequired.relatedOtherMr}</p>
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
   <p className="p55-note"><strong>07 Vendor is the original quotation source.</strong> This is a read-only owner-scoped comparison, NOT a supplier-driven Required BOM. Supplier offered quantity is quote-wide, not purchased ZWP20 quantity. <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.supplier" componentName="Vendor source and supplier quotation registry"/></p>
   <div className="p55-table-wrap p553-module-scroll"><table className="p55-table p55-table--compact">
    <thead><tr><th>Supplier Quote Line</th><th>Original Supplier SKU</th><th>Vendor Quoted Qty</th><th>Original Unit / Extended</th><th>TAG Working Qty / Amount</th><th>Difference / Technical Gate</th></tr></thead><tbody>
    {m.offered.map(r=><tr key={r.code}><td><strong>{r.code}</strong><small>{r.quotation||r.quoteId}</small>
      <ComponentCopyId projectId="PJ2608-0553" componentKey={id+".vendor-comparison."+r.code.toLowerCase()} componentName={r.code+" supplier comparison"}/></td>
     <td>{r.sku||"NOT FOUND"}<small>{r.description}</small></td><td>{r.offeredQty??"NOT QUOTED"}</td>
     <td>{sourcePrice(r.currency,r.quotedUnit)}<small>Original quote extension: {sourcePrice(r.currency,r.quotedTotal)}</small></td>
     <td>{r.workingQty??"NOT DERIVED"}<small>{sourcePrice(r.currency,r.workingExtended)}</small></td>
     <td>{r.sourceRateNull?"Vendor rate NULL; management zero incremental assumption is NOT a sourced vendor price":r.sourceStatus}<small>{r.costOwner}</small></td>
    </tr>)}
    {m.offered.length===0&&<tr><td colSpan={6}>{m.otherSupplierEvidence?"Current TAG has supplier/candidate evidence, but no uniquely matching Next G source row. Inspect the source reference below; do not equate the TAG total to a full supplier quotation.":"No uniquely mapped quoted vendor line for this TAG."}</td></tr>}
    </tbody></table></div>
   {m.otherSupplierEvidence&&<p className="p55-note">Existing ledger reference (not a second quotation): {m.working.selectedVendor||"Vendor pending"} · {m.working.selectedSku||"SKU pending"} · {m.working.source||"Source not indexed"}.</p>}
   <p className="p55-note">Full Next G quotation may contain other lines owned by IDU, surge, antenna, spares, or another site. Those must stay under their own Cost Owner or the 07 Vendor master. No quotation-wide amounts are added to this TAG.</p>
  </ControlledModuleSection0553>

  <ControlledModuleSection0553 moduleKey={id+".engineering-verification"} title="04 · Engineering Verification — RFQ / CAL-RPT / Scope / Audit">
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
