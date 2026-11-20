import React from "react";
import { VENDOR_0553_SOURCES } from "./vendorEvidence";

// This view keeps source evidence, quotation and project selection separate.
// No cost, supplier quotation, BOM, or approval state is mutated.
const rows=[
 {mr:"MR-0002",party:"MOT → RFI",item:"RFI RX3852-2002-11 LNA",evidence:"DATASHEET ONLY (reported by project owner)",price:"MISSING",decision:"TECHNICAL REVIEW / RFQ PRICE REQUIRED",link:"https://drive.google.com/file/d/1dAnYkC2r2hyYEgUuN-xA0xAvq-zG2iTA/view"},
 {mr:"MR-0002 / REVIEW",party:"MGW Technologies",item:"UHF BDA (not automatically LNA)",evidence:"QUOTATION P26-058 · MULTI-SYSTEM",price:"QUOTED PACKAGE / LNA NOT CONFIRMED",decision:"ALTERNATIVE? TBE REQUIRED",link:"https://drive.google.com/file/d/1qR4fuRXnRbHI2hgj8BB9T1dztZTWiINc/view"}
];
export function VendorEvidenceReadiness0553(){
 return <section className="p55-section" style={{marginBottom:18}}>
  <h2>Vendor Offer Readiness — Quick Review</h2>
  <p>ดูให้ชัดว่าใครส่งเอกสารอะไรแล้ว และรายการใดยังไม่มีราคา ก่อนนำไป TBE หรือ Budget ข้อมูลนี้เป็น WORKING ไม่ใช่การอนุมัติหรือการเลือกสินค้า</p>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>MR</th><th>Vendor / Product</th><th>Received</th><th>Price</th><th>Next Action</th><th>Source</th></tr></thead><tbody>
   {rows.map(r=><tr key={r.party}><td>{r.mr}</td><td><strong>{r.party}</strong><div>{r.item}</div></td><td>{r.evidence}</td><td>{r.price}</td><td>{r.decision}</td><td><a href={r.link} target="_blank" rel="noreferrer">Open</a></td></tr>)}
  </tbody></table></div>
  <p className="p55-note">Other indexed vendor records: {VENDOR_0553_SOURCES.length} source entries in the existing Vendor/OEM Source Index below. An indexed source does not imply current quotation or approved compliance. MGW multi-system total must never be allocated to LNA without line-level evidence.</p>
 </section>;
}
