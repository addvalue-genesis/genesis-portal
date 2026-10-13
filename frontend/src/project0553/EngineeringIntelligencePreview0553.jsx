import React,{useMemo} from "react";
import {SmartDataGroup} from "../common/ui/SmartDataExplorer";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {readProjectEngineeringIntelligence0553} from "./data/engineeringIntelligenceReadModel0553";

// Management/engineering diagnostic only. No approval, vendor choice or cost writing.
export function EngineeringIntelligencePreview0553(){
 const review=useMemo(()=>{
  try{return readProjectEngineeringIntelligence0553();}
  catch(error){return {ready:false,state:"READ_MODEL_ERROR",error:String(error?.message||error),sourceOnly:true};}
 },[]);
 return <SmartDataGroup projectId="PJ2608-0553" moduleKey="bid.vendor.products.engineering-intelligence-preview"
    title="Engineering Intelligence · Requirements ↔ Product / Package Proof (Preview)"
    defaultOpen={false}
    description="อ่านหลักฐานสินค้าจาก 07 Vendor และกฎส่วนกลางเพื่อเสนอประเด็นตรวจสอบวิศวกรรมเท่านั้น ไม่ใช่ OEM approval, AVL approval หรือราคา Budgetary">
    {!review.ready?<p role="alert" className="p55-note">SOURCE / ADAPTER INCOMPLETE — {review.state} {review.error||""}. Automatic selection disabled.</p>:<>
     <p className="p55-note"><strong>Review State:</strong> {review.state} · Rules: {review.ruleVersion} · Auto Selected: NO · Cost Posted: NO</p>
     <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
      <thead><tr><th>Engineering Case / Copy ID</th><th>Required vs Offered</th><th>Decision Support (NO APPROVAL)</th><th>Source / Next Proof</th></tr></thead>
      <tbody>
       <tr>
        <td><strong>ZWP20 / MR-502-001 · Country Region</strong>
         <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.engineering-intelligence-preview.region" componentName="Myanmar Region Licence Constraint"/></td>
        <td>Required: Myanmar entitlement
         <small>Offered: {review.region.offered.id}</small>
         <small>Claimed countries: {review.region.offered.properties.supportedCountries.value.join(", ")}</small></td>
        <td><strong>{review.region.evaluation.status}</strong>
         <small>{review.region.evaluation.conflicts.join(", ")||review.region.evaluation.unverified.join(", ")}</small></td>
        <td>Next G {review.region.offered.quotationRef}<small>Vendor rate: {review.region.vendorRate===null?"NULL / UNQUOTED":"SOURCE RATE PRESENT"}</small></td>
       </tr>
       <tr>
        <td><strong>MR-0003 / Ex IP Phone Package</strong>
         <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.vendor.products.engineering-intelligence-preview.phone-package" componentName="Compare Phone Package Included Scope"/></td>
        <td>MGW PHONE-1 vs EXION Current Quotation</td>
        <td><strong>MGW source claims: {review.phonePackages.mgw.rows.filter(x=>x.state==="INCLUDED_EVIDENCED").length} evidenced inclusions</strong>
         <small>EXION unproven standalone items: {review.phonePackages.exion.rows.filter(x=>x.state!=="INCLUDED_EVIDENCED").map(x=>x.functionId).join(", ")}</small></td>
        <td>MGW-P26-058 / PHONE-1 · EXION-1260576-R0
         <small>Compare Ex certificates, configurations, scope and costs; competing packages are alternatives</small></td>
       </tr>
      </tbody>
     </table></div>
     <p className="p55-note">Casebook precedents: {review.relevantDecisionCases.length}. They are historical guidance and require current RFQ reassessment; no previous choice is carried forward as approved.</p>
    </>}
 </SmartDataGroup>;
}
