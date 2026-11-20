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


export const SATELLITE_REVIEW_FLAGS_0550 = [
 { id: 'REVIEW_FLAG_VSAT_ROUTER_INTERFACE', scope: 'APF / ACP / YANGON (1.2.1 / 1.2.2 / 1.2.6)', summary: 'Verify Cisco 8300 router interface boundaries, LAN handover, and COMPANY vs. TSI demarcation across APF, ACP, and Yangon.' },
 { id: 'REVIEW_FLAG_VSAT_PTD_LICENCE', scope: 'APF / ACP / YANGON (1.2.1–1.2.8)', summary: 'Verify separate Myanmar PTD Earth Station & frequency licensing for VSAT (COMPANY-supplied links) vs. Ku/C-Band Internet (APF & ACP).' },
 { id: 'REVIEW_FLAG_KU_BAND_AIRTIME', scope: 'APF / ACP (1.2.5 / 1.2.8)', summary: 'Verify Ku/C-Band Internet 12-month planning airtime (2–10 Mbps, 1:4–1:10 MIR) and post-12-month COMPANY operational handover.' },
];

export const APF_VSAT_1_BOM_0550 = [
 { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT System Cabinet (by TSI)', offeredEquipment: 'Rittal 42U 19" Floor-Mounted VSAT System Cabinet', description: 'Rittal 42U 19" Floor-Mounted VSAT System Cabinet', brand: 'Rittal', model: 'VX IT 42U 800x1000x2200', partNo: 'VX25 / VX IT', quantity: 2, unit: 'Set', remarks: 'Supplied by TSI (Base Scope)', weight: 80000 },
 { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT Antenna with LNB, BUC and RCU (by CPY)', offeredEquipment: 'Satellite VSAT Antenna Subsystem with LNB, BUC & RCU (COMPANY Free-Issue)', description: 'Satellite VSAT Antenna Subsystem with LNB, BUC & RCU (COMPANY Free-Issue)', brand: 'Supplied by Others', model: 'Per COMPANY Spec', partNo: 'CPY-VSAT-ANT', quantity: 2, unit: 'Set', remarks: 'COMPANY Scope (Free-Issued; TSI integration & installation)', weight: 0 },
 { itemNo: '3', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT Modem (by CPY)', offeredEquipment: 'Satellite VSAT Modem Unit (COMPANY Free-Issue)', description: 'Satellite VSAT Modem Unit (COMPANY Free-Issue)', brand: 'Supplied by Others', model: 'Per COMPANY Spec', partNo: 'CPY-VSAT-MOD', quantity: 2, unit: 'Ea.', remarks: 'COMPANY Scope (Free-Issued; TSI integration)', weight: 0 },
 { itemNo: '4', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Router : Cisco 8300 (by TSI)', offeredEquipment: 'Cisco Catalyst 8300 Series Edge Platform Router', description: 'Cisco Catalyst 8300 Series Edge Platform Router', brand: 'Cisco', model: 'Catalyst C8300-1N1S-4T2X', partNo: 'C8300-1N1S-4T2X', quantity: 2, unit: 'Set', remarks: 'Supplied by TSI (Base Scope)', weight: 700000 },
 { itemNo: '5', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Installation kit and Accessory (by TSI)', offeredEquipment: 'VSAT Cabinet Installation Kit, Patch Cords & Mounting Hardware', description: 'VSAT Cabinet Installation Kit, Patch Cords & Mounting Hardware', brand: 'Rittal / Panduit', model: 'VSAT-INST-KIT', partNo: 'VSAT-INST-KIT', quantity: 2, unit: 'Set', remarks: 'Supplied by TSI (Base Scope)', weight: 20000 },
 { itemNo: '6', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Etc. (by TSI) (per Appendix 2 Drawings)', offeredEquipment: 'Bulk Materials, Grounding & Labelling Accessories', description: 'Bulk Materials, Grounding & Labelling Accessories', brand: 'Panduit / Belden', model: 'VSAT-ACC-APF', partNo: 'VSAT-ACC-APF', quantity: 2, unit: 'Lot', remarks: 'Supplied by TSI (per Appendix 2 drawings)', weight: 10000 },
];

export const APF_VSAT_2_BOM_0550 = [
 { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT System Cabinet (by TSI)', offeredEquipment: 'Rittal 42U 19" Floor-Mounted VSAT System Cabinet', description: 'Rittal 42U 19" Floor-Mounted VSAT System Cabinet', brand: 'Rittal', model: 'VX IT 42U 800x1000x2200', partNo: 'VX25 / VX IT', quantity: 1, unit: 'Set', remarks: 'Supplied by TSI (Base Scope)', weight: 40000 },
 { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT Antenna with LNB, BUC and RCU (by CPY)', offeredEquipment: 'Satellite VSAT Antenna Subsystem with LNB, BUC & RCU (COMPANY Free-Issue)', description: 'Satellite VSAT Antenna Subsystem with LNB, BUC & RCU (COMPANY Free-Issue)', brand: 'Supplied by Others', model: 'Per COMPANY Spec', partNo: 'CPY-VSAT-ANT', quantity: 1, unit: 'Set', remarks: 'COMPANY Scope (Free-Issued; TSI integration & installation)', weight: 0 },
 { itemNo: '3', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT Modem (by CPY)', offeredEquipment: 'Satellite VSAT Modem Unit (COMPANY Free-Issue)', description: 'Satellite VSAT Modem Unit (COMPANY Free-Issue)', brand: 'Supplied by Others', model: 'Per COMPANY Spec', partNo: 'CPY-VSAT-MOD', quantity: 2, unit: 'Ea.', remarks: 'COMPANY Scope (Free-Issued; TSI integration)', weight: 0 },
 { itemNo: '4', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Splitter Combination (by CPY)', offeredEquipment: 'RF L-Band Splitter / Combiner Unit (COMPANY Free-Issue)', description: 'RF L-Band Splitter / Combiner Unit (COMPANY Free-Issue)', brand: 'Supplied by Others', model: 'Per COMPANY Spec', partNo: 'CPY-VSAT-SPL', quantity: 1, unit: 'Set', remarks: 'COMPANY Scope (Free-Issued; TSI integration)', weight: 0 },
 { itemNo: '5', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Router : Cisco 8300 (by TSI)', offeredEquipment: 'Cisco Catalyst 8300 Series Edge Platform Router', description: 'Cisco Catalyst 8300 Series Edge Platform Router', brand: 'Cisco', model: 'Catalyst C8300-1N1S-4T2X', partNo: 'C8300-1N1S-4T2X', quantity: 1, unit: 'Set', remarks: 'Supplied by TSI (Base Scope)', weight: 350000 },
 { itemNo: '6', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Installation kit and Accessory (by TSI)', offeredEquipment: 'VSAT Cabinet Installation Kit, Patch Cords & Mounting Hardware', description: 'VSAT Cabinet Installation Kit, Patch Cords & Mounting Hardware', brand: 'Rittal / Panduit', model: 'VSAT-INST-KIT', partNo: 'VSAT-INST-KIT', quantity: 1, unit: 'Set', remarks: 'Supplied by TSI (Base Scope)', weight: 10000 },
 { itemNo: '7', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Etc. (by TSI) (per Appendix 2 Drawings)', offeredEquipment: 'Bulk Materials, Grounding & Labelling Accessories', description: 'Bulk Materials, Grounding & Labelling Accessories', brand: 'Panduit / Belden', model: 'VSAT-ACC-APF', partNo: 'VSAT-ACC-APF', quantity: 1, unit: 'Lot', remarks: 'Supplied by TSI (per Appendix 2 drawings)', weight: 5000 },
];

export const YANGON_VSAT_BOM_0550 = [
 { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT System Cabinet (by TSI)', offeredEquipment: 'Rittal 42U 19" Floor-Mounted VSAT System Cabinet', description: 'Rittal 42U 19" Floor-Mounted VSAT System Cabinet', brand: 'Rittal', model: 'VX IT 42U 800x1000x2200', partNo: 'VX25 / VX IT', quantity: 1, unit: 'Set', remarks: 'Supplied by TSI (Base Scope)', weight: 40000 },
 { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT Antenna with LNB, BUC and RCU (by CPY)', offeredEquipment: 'Satellite VSAT Antenna Subsystem with LNB, BUC & RCU (COMPANY Free-Issue)', description: 'Satellite VSAT Antenna Subsystem with LNB, BUC & RCU (COMPANY Free-Issue)', brand: 'Supplied by Others', model: 'Per COMPANY Spec', partNo: 'CPY-VSAT-ANT', quantity: 1, unit: 'Set', remarks: 'COMPANY Scope (Free-Issued; TSI integration & installation)', weight: 0 },
 { itemNo: '3', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT Modem : 2 Ea. MIR (Contention 1:4 to 1:10) (by CPY)', offeredEquipment: 'Satellite VSAT Modem Unit, MIR 1:4–1:10 (COMPANY Free-Issue)', description: 'Satellite VSAT Modem Unit, MIR 1:4–1:10 (COMPANY Free-Issue)', brand: 'Supplied by Others', model: 'Per COMPANY Spec', partNo: 'CPY-VSAT-MOD', quantity: 2, unit: 'Ea.', remarks: 'COMPANY Scope (Free-Issued; TSI integration)', weight: 0 },
 { itemNo: '4', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Splitter Combination (by CPY)', offeredEquipment: 'RF L-Band Splitter / Combiner Unit (COMPANY Free-Issue)', description: 'RF L-Band Splitter / Combiner Unit (COMPANY Free-Issue)', brand: 'Supplied by Others', model: 'Per COMPANY Spec', partNo: 'CPY-VSAT-SPL', quantity: 1, unit: 'Set', remarks: 'COMPANY Scope (Free-Issued; TSI integration)', weight: 0 },
 { itemNo: '5', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Router : Cisco 8300 (by TSI)', offeredEquipment: 'Cisco Catalyst 8300 Series Edge Platform Router', description: 'Cisco Catalyst 8300 Series Edge Platform Router', brand: 'Cisco', model: 'Catalyst C8300-1N1S-4T2X', partNo: 'C8300-1N1S-4T2X', quantity: 1, unit: 'Set', remarks: 'Supplied by TSI (Base Scope)', weight: 350000 },
 { itemNo: '6', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Installation kit and Accessory (by TSI)', offeredEquipment: 'VSAT Cabinet Installation Kit, Patch Cords & Mounting Hardware', description: 'VSAT Cabinet Installation Kit, Patch Cords & Mounting Hardware', brand: 'Rittal / Panduit', model: 'VSAT-INST-KIT', partNo: 'VSAT-INST-KIT', quantity: 1, unit: 'Set', remarks: 'Supplied by TSI (Base Scope)', weight: 10000 },
 { itemNo: '7', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Etc. (by TSI) (per Appendix 2 Drawings)', offeredEquipment: 'Bulk Materials, Grounding & Labelling Accessories', description: 'Bulk Materials, Grounding & Labelling Accessories', brand: 'Panduit / Belden', model: 'VSAT-ACC-YGN', partNo: 'VSAT-ACC-YGN', quantity: 1, unit: 'Lot', remarks: 'Supplied by TSI (per Appendix 2 drawings)', weight: 5000 },
];

export const APF_VSAT_CABLE_BOM_0550 = [
 { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT Cable', offeredEquipment: 'Low-Loss Coaxial IFL Cable (RG-11 / LMR-400 Grade) for VSAT ODU-IDU Link', description: 'Low-Loss Coaxial IFL Cable (RG-11 / LMR-400 Grade) for VSAT ODU-IDU Link', brand: 'Belden / Times Microwave', model: 'LMR-400 / RG-11 Low-Loss', partNo: 'LMR-400-FR', quantity: 120, unit: 'm', remarks: 'Supplied by TSI (Base Scope, per Appendix 2 drawings)', weight: 36000 },
];

export const YANGON_VSAT_CABLE_BOM_0550 = [
 { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT Cable', offeredEquipment: 'Low-Loss Coaxial IFL Cable (RG-11 / LMR-400 Grade) for VSAT ODU-IDU Link', description: 'Low-Loss Coaxial IFL Cable (RG-11 / LMR-400 Grade) for VSAT ODU-IDU Link', brand: 'Belden / Times Microwave', model: 'LMR-400 / RG-11 Low-Loss', partNo: 'LMR-400-FR', quantity: 120, unit: 'm', remarks: 'Supplied by TSI (Base Scope, per Appendix 2 drawings)', weight: 36000 },
];

export const APF_VSAT_OFFSHORE_BOM_0550 = [
 { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT System to Offshore (Free Issued to WPAs)', offeredEquipment: 'VSAT Antenna (with LNB, BUC and RCU), Splitter Combiner and Modem for Offshore', description: 'VSAT Antenna (with LNB, BUC and RCU), Splitter Combiner and Modem for Offshore', brand: 'Supplied by Others', model: 'Per COMPANY Spec', partNo: 'CPY-VSAT-OFFSHORE', quantity: 2, unit: 'Lot', remarks: 'COMPANY Scope (Supplied by CPY and installed by offshore team)', weight: 0 },
];

export const APF_KU_BOM_0550 = [
 { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'KU/C Band Internet Antenna with LNB, BUC', offeredEquipment: '1.2m Ku/C-Band VSAT Dish Antenna c/w LNB, BUC & Non-Penetrating Roof/Tower Mount', description: '1.2m Ku/C-Band VSAT Dish Antenna c/w LNB, BUC & Non-Penetrating Roof/Tower Mount', brand: 'iDirect / Cobham', model: '1.2m Ku/C-Band Terminal Kit', partNo: 'KU-ANT-120', quantity: 1, unit: 'Set', remarks: 'Included in Base Scope of Supply', weight: 80000 },
 { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Satellite Modem (To be installed in VSAT Cabinet, MIR: Contention 1:4 to 1:10, Bandwidth 2-10 Mbps)', offeredEquipment: 'iDirect Evolution Satellite Router / Modem (2–10 Mbps, 1:4–1:10 MIR)', description: 'iDirect Evolution Satellite Router / Modem (2–10 Mbps, 1:4–1:10 MIR)', brand: 'iDirect', model: 'Evolution X7 / IQ 200', partNo: 'ID-IQ200', quantity: 1, unit: 'Ea.', remarks: 'Installed inside VSAT Cabinet; includes 12-month planning bandwidth allowance', weight: 260000 },
 { itemNo: '3', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Etc. (per Appendix 2 Drawings)', offeredEquipment: 'IFL Coaxial Cable, Weatherproofing & Mounting Accessories', description: 'IFL Coaxial Cable, Weatherproofing & Mounting Accessories', brand: 'Belden / Amphenol', model: 'KU-ACC-KIT', partNo: 'KU-ACC-KIT', quantity: 1, unit: 'Lot', remarks: 'Included in Base Scope of Supply (per Appendix 2 drawings)', weight: 20000 },
];

export const ACP_KU_BOM_0550 = [
 { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'KU/C Band Internet Antenna with LNB, BUC', offeredEquipment: '1.2m Ku/C-Band VSAT Dish Antenna c/w LNB, BUC & Non-Penetrating Roof/Tower Mount', description: '1.2m Ku/C-Band VSAT Dish Antenna c/w LNB, BUC & Non-Penetrating Roof/Tower Mount', brand: 'iDirect / Cobham', model: '1.2m Ku/C-Band Terminal Kit', partNo: 'KU-ANT-120', quantity: 1, unit: 'Set', remarks: 'Included in Base Scope of Supply', weight: 80000 },
 { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Satellite Modem (To be installed in VSAT Cabinet, MIR: Contention 1:4 to 1:10, Bandwidth 2-10 Mbps)', offeredEquipment: 'iDirect Evolution Satellite Router / Modem (2–10 Mbps, 1:4–1:10 MIR)', description: 'iDirect Evolution Satellite Router / Modem (2–10 Mbps, 1:4–1:10 MIR)', brand: 'iDirect', model: 'Evolution X7 / IQ 200', partNo: 'ID-IQ200', quantity: 1, unit: 'Ea.', remarks: 'Installed inside VSAT Cabinet; includes 12-month planning bandwidth allowance', weight: 260000 },
 { itemNo: '3', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Etc. (per Appendix 2 Drawings)', offeredEquipment: 'IFL Coaxial Cable, Weatherproofing & Mounting Accessories', description: 'IFL Coaxial Cable, Weatherproofing & Mounting Accessories', brand: 'Belden / Amphenol', model: 'KU-ACC-KIT', partNo: 'KU-ACC-KIT', quantity: 1, unit: 'Lot', remarks: 'Included in Base Scope of Supply (per Appendix 2 drawings)', weight: 20000 },
];
