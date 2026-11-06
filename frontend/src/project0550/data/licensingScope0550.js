// Existing Part B owners. Use the same IDs in Working and Volume I.
export const LICENSING_SCOPE_0550 = [
 ["REQ-MR-ACT-B8-D01", "Frequency assignment / Radio & Operating Licence", "ตรวจคลื่นและทำ dossier สำหรับระบบส่ง RF ที่เข้าข่าย เช่น Microwave, DTRS, Marine/Aero VHF, MF/HF, NDB และ Satellite ตามขอบเขตจริง"],
 ["REQ-MR-ACT-B8-D02", "Equipment type approval", "ตรวจประเภทและรุ่นอุปกรณ์ตามบัญชีจัดหา พร้อมรวบรวม datasheet และหลักฐานที่ใช้ประกอบการยื่น"],
 ["REQ-MR-ACT-B8-D03", "Telecom Equipment Import Licence / Import Permit", "ตรวจรายการนำเข้าของทุกระบบตามอุปกรณ์และ shipment ที่อยู่ในขอบเขต รวมรายการวิทยุและอุปกรณ์เครือข่ายตามที่เข้าข่าย"],
 ["REQ-MR-ACT-B8-D04", "Permit application / Authority follow-up", "เตรียมและติดตามคำขอในส่วน TSI ประสาน COMPANY และหน่วยงาน Myanmar ที่ระบุในเอกสาร"],
 ["REQ-MR-ACT-B8-D05", "Authority / agent fee allowance", "วงเงินประมาณการแยกจากแรงงาน TSI ตรวจจำนวนคำขอ ผู้ชำระ และค่าธรรมเนียมจริงก่อนยืนยันราคา"],
];
const ids = new Set(LICENSING_SCOPE_0550.map(([id]) => id));
export const isLicensingCostLine0550 = id => ids.has(id);
