import React from "react";
import { buildReferenceRegister, assessReferenceReadiness, REFERENCE_STATES } from "../common/engineering/documentReferences";

// Transcribed from user-provided BOD-0001 Rev.C2 page 10, §4.1.
// This is evidence of citation, NOT confirmation that source PDFs are present or approved.
const bodSource = {documentNo:"MM-ZTK-1F-GEN-TEL-BOD-0001",revision:"C2",section:"4.1",page:10};
const cited = [
 ["ZGS-GEN-003","Zawtika Site Conditions"],
 ["MM-ZTK-1F-ZWPX-TEL-BLD-0001","Overall Telecommunication System Block Diagram"],
 ["MM-ZTK-1F-GEN-TEL-RPT-0001","Design Report for Communication Link"],
 ["MM-ZTK-1F-GEN-TEL-RPT-0002","Design Report for Overall Transmission Interface Requirement"],
 ["MM-ZTK-1F-ZWPX-TEL-LAY-0001","Telecommunication Equipment Layouts"],
 ["MM-ZTK-1F-GEN-TEL-LIS-0003","Telecommunication Equipment List"],
 ["MM-ZTK-1F-GEN-TEL-LIS-0005","Telecommunication Power Consumption and Heat Dissipation List"]
];
export const REFERENCES_0553 = buildReferenceRegister(cited.map(([documentNo,title]) => ({
 documentNo,title,referencedBy:bodSource,status:REFERENCE_STATES.REFERENCED_UNVERIFIED,
 project:"PJ2608-0553",scope:"SHARED / MR IMPACT TO REVIEW"
})));
export const REFERENCE_DOCUMENT_TYPES_0553 = ["BOD","MR-0001","MR-0002","MR-0003","MR-0004","DTS","SPE","CAL / RPT","DWG / LAY","LIS / MTO","TC / REVIEW COMMENTS"];
export function DocumentReferenceControl0553() {
 const result=assessReferenceReadiness(REFERENCES_0553);
 return <section className="p55-section" style={{marginTop:20}}>
   <h2>Document references / Notes / Comments — 0553</h2>
   <p>เอกสารอ้างอิงจาก BOD Rev.C2 §4.1 หน้า 10 จำนวน {result.total} รายการ ยังไม่ยืนยันว่าไฟล์ต้นฉบับหรือ Revision ที่ใช้ในสัญญาถูกต้องครบถ้วน</p>
   <details open><summary><strong>BOD §4 — Reference Documents ({result.total})</strong></summary>
   <div style={{overflowX:"auto"}}>
   <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
   <thead><tr>{["Document No.","Title","Source","Verification / Pricing Gate"].map(h=><th key={h} style={{border:"1px solid #b7c7d5",padding:9,textAlign:"left"}}>{h}</th>)}</tr></thead>
   <tbody>{REFERENCES_0553.map(row=><tr key={row.documentNo}>
    <td style={{border:"1px solid #ccd5de",padding:9}}>{row.documentNo}</td>
    <td style={{border:"1px solid #ccd5de",padding:9}}>{row.title}</td>
    <td style={{border:"1px solid #ccd5de",padding:9}}>BOD-0001 C2 §4.1 p.10</td>
    <td style={{border:"1px solid #ccd5de",padding:9}}>REFERENCED · FILE/REV UNVERIFIED</td>
   </tr>)}</tbody></table></div></details>
   <details style={{marginTop:12}}><summary><strong>Next document checks — MR / DTS / SPE / CAL / DWG / Comments</strong></summary>
    <p>Check reference lists, applicable documents, notes, review comments, revision and cost drivers separately in each original file. No extracted requirement is treated as approved without source verification.</p>
    <p>{REFERENCE_DOCUMENT_TYPES_0553.join(" · ")}</p>
   </details>
   <p><strong>Cost release gate:</strong> {result.unresolved} references remain unverified. BOM may be WORKING/PROVISIONAL only; do not finalize costs from reference titles alone.</p>
 </section>;
}
