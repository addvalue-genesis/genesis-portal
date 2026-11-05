import React from 'react';
import {supplierItemSourceText0550} from './data/supplierCostProjection0550';

// One read-only view of existing Offer evidence in Working and Vendor.
export function SupplierItemSourceText0550({offer}){
 const texts=supplierItemSourceText0550(offer);
 return <div data-supplier-source-text={offer.id}>
  <small><strong>รายละเอียด / ข้อความ Supplier ที่บันทึก</strong></small>
  {texts.length?texts.map((text,i)=><p key={i} style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{text}</p>):<small>ยังไม่มีข้อความรายละเอียดต้นฉบับของ Item นี้ในข้อมูลที่โหลด · ตรวจใบเสนอราคาต้นฉบับ</small>}
  {offer.sourceRef&&<details data-supplier-source-ref={offer.id}><summary>แหล่งอ้างอิงที่บันทึก / Source reference</summary><p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{offer.sourceRef}</p></details>}
 </div>;
}
