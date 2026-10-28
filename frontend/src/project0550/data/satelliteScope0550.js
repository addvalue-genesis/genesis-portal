// Current Working scope only. Never alter the frozen budgetary source or infer a
// financial allocation from a bundled satellite quotation's description/amount.
export const SATELLITE_SCOPE_VERSION = "0550-satellite-scope-20261028-1";
export const SATELLITE_SCOPE_OPTIONS = [
 ["OPEN", "OPEN · ยังไม่ได้แยกขอบเขต / ราคาเหมารวม"],
 ["COMPANY_SUPPLY", "COMPANY จัดหา · ไม่รวมในข้อเสนอ TSI"],
 ["TSI_EQUIPMENT", "TSI · Cabinet / Router / Cable / อุปกรณ์ประกอบ"],
 ["TSI_SERVICES", "TSI · Engineering / Installation / Testing / Commissioning"],
 ["CLARIFICATION", "CLARIFICATION · รอยืนยันผู้รับผิดชอบ"]
];
export function isSatelliteScope0550(line) {
 return ["TEL-VSAT", "TEL-VSAT-KU"].includes(line.systemToken) || line.customerRowCode === "A1-02";
}
export function satelliteScopeNote0550(token) {
 if(token === "TEL-VSAT") return "MR Rev.B1 p07 §2.2(a), p12–13 App.1.2: COMPANY จัดหาอุปกรณ์ VSAT หลักและบริการ 3 links; กลุ่มทำราคา TSI ใช้สำหรับ Cabinet / Installation Kit / Cable และงาน Engineering / Installation / Integration / Testing / Commissioning ที่เกี่ยวข้อง. Router / Network equipment และสถานที่ APF/ACP ยังรอยืนยันขอบเขต. อุปกรณ์หลักและบริการที่ COMPANY จัดหาอยู่ในข้อมูลอ้างอิง ไม่รวมข้อเสนอ TSI. แยกราคาเหมารวมก่อนใช้ใน Working.";
 if(token === "TEL-VSAT-KU") return "MR Rev.B1 p12–13 App.1.2: KU/C Band Internet ที่ APF / ACP ยังรอยืนยันผู้จัดหาอุปกรณ์หลักและค่าบริการ; ห้ามตัดทั้งระบบหรือถือว่า COMPANY จัดหาโดยอัตโนมัติ. แยกอุปกรณ์ประกอบและงาน TSI ออกจากส่วนรอ clarification.";
 return "";
}
export function satelliteScope0550(line) {
 if(!isSatelliteScope0550(line)) return {applicable:false,excluded:false,problems:[],label:""};
 const role = line.satelliteScope || "OPEN";
 const problems = [];
 const supported = Boolean(line.requirementRef?.trim() && line.scopeBasis?.trim());
 if(["OPEN", "CLARIFICATION"].includes(role)) problems.push("SATELLITE_SCOPE_OPEN: แยก COMPANY / TSI / ส่วนรอ clarification; ราคาเหมารวมยังใช้ไม่ได้");
 else if(!supported) problems.push("SATELLITE_SCOPE_BASIS: ระบุ Requirement reference และเหตุผลแบ่งขอบเขต");
 // A supply-only label on a service row (or vice versa) must not silently pass.
 if(role === "TSI_EQUIPMENT" && !["A","B5","B6","C2","C3"].includes(line.wbs)) problems.push("SATELLITE_SCOPE_WBS: อุปกรณ์ TSI ต้องอยู่หมวด Equipment / Spares / Tools");
 if(role === "TSI_SERVICES" && line.wbs === "A") problems.push("SATELLITE_SCOPE_WBS: งานบริการ TSI ต้องแยกจาก Part A");
 const excluded = role === "COMPANY_SUPPLY" && supported;
 if(excluded) problems.push("COMPANY_SUPPLY: ไม่รวมต้นทุนหรือราคาขายในข้อเสนอ TSI; เก็บแถวเพื่อย้อนตรวจ");
 return {applicable:true,role,excluded,problems,label:SATELLITE_SCOPE_OPTIONS.find(([key])=>key===role)?.[1]||"OPEN"};
}
