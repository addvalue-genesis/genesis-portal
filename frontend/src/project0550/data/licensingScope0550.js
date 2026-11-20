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

// Project evidence for the existing systems. Import applies to every imported
// goods line; the notes here identify the package or handoff to check.
export const LICENSING_INTERFACE_0550 = "https://drive.google.com/file/d/1AejPSsqHOk4t2GICNpQAbpRHTevGDIVh/view";
export const LICENSING_SYSTEM_REVIEW_0550 = {
 "TEL-LAN": {
  item:3, page:26, operation:"check",
  goods:"Switch, WLAN AP และอุปกรณ์เครือข่ายนำเข้าในชุด TSI",
  basis:"LAN แบบสายและ WLAN ต้องแยกกัน ตรวจรุ่น AP, ย่าน, กำลังส่งและการใช้งานภายใน/ภายนอก เพื่อยืนยันเงื่อนไขอนุญาตของ WLAN",
  fee:"WLAN ตรวจ band, EIRP, indoor/outdoor และการใช้งานเทียบ PTD SRD ตามรุ่น ค่าธรรมเนียมคลื่นรอยืนยันเมื่ออยู่นอกเงื่อนไขที่อนุญาต",
 },
 "TEL-LAN-VCS": {
  item:4, page:27, operation:"none",
  goods:"ชุดประชุมและอุปกรณ์ AV นำเข้าในชุด TSI",
  basis:"MS Teams เป็นบริการของ COMPANY ตรวจเฉพาะอุปกรณ์ที่เพิ่มวิทยุในตัวหรือมี WLAN แยกจาก LAN กลาง",
  fee:"N/A · ค่าคลื่นสำหรับชุด AV/LAN แบบสาย ตรวจ SRD และ type approval เพิ่มถ้ารุ่นมี Wi-Fi, Bluetooth หรือ wireless mic",
 },
 "TEL-VSAT": {
  item:1, page:24, operation:"check",
  goods:"ODU, modem, จานและอุปกรณ์ประกอบอยู่ฝั่ง COMPANY ตาม LIS แยกผู้ยื่นจากของ TSI R03 ระบุข้อห้ามนำเข้า Satellite Systems/Phones ในเส้นทางดังกล่าว ให้ยืนยันเส้นทางของ COMPANY",
  basis:"COMPANY ทำสัญญาบริการ ให้ตรวจผู้ถือสิทธิของสถานีส่ง VSAT และว่าใบอนุญาตของ COMPANY หรือผู้ให้บริการครอบคลุมทั้งสามลิงก์หรือไม่ TSI จัดข้อมูลลิงก์และ commissioning ตาม LIS",
  fee:"มีอัตรา VSAT อ้างอิงด้านบน รอยืนยันผู้ถือสิทธิและค่าใช้จ่ายที่รวมในสัญญาบริการ",
 },
 "TEL-VSAT-KU": {
  item:18, page:40, operation:"required",
  goods:"ตรวจผู้จัดหาและผู้นำเข้าของ terminal/จานจากขอบเขต COMPANY และผู้ให้บริการ ตรวจข้อห้ามของ Satellite ตาม R03 และยืนยันเส้นทางของ COMPANY/ผู้ให้บริการ",
  basis:"LIS ให้ TSI ตรวจใบอนุญาตที่ต้องใช้ และ COMPANY จัดหาสิทธิสำหรับ APF/ACP ตรวจว่า provider licence ครอบคลุม terminal/site หรือมีคำขอเพิ่มเติม",
  fee:"มีอัตรา VSAT อ้างอิงด้านบน รอยืนยันว่าครอบคลุมในค่าบริการของผู้ให้บริการหรือมีคำขอเพิ่ม",
 },
 "TEL-PABX": {
  item:6, page:28, operation:"none",
  goods:"PABX, IP phone และอุปกรณ์ประกอบนำเข้าในชุด TSI",
  basis:"ตรวจขอบเขต IP/PABX แบบสายและการเชื่อมผ่าน PABX Yangon ของ COMPANY ถ้าเพิ่ม gateway หรือ handset ที่ส่ง RF ให้ทบทวนเฉพาะรุ่น",
  fee:"N/A · ค่าคลื่นสำหรับ PABX/IP Phone แบบสาย ตรวจผู้ถือสิทธิ PSTN/SIP แยก และเปิดทบทวนถ้ามี DECT/Wi-Fi/cellular gateway",
 },
 "TEL-IPP": {
  item:6, page:28, operation:"none",
  goods:"Ex phone, sounder และอุปกรณ์ประกอบที่นำเข้าในชุด TSI",
  basis:"ตรวจ Ex certification และ type approval ตามรุ่นแยกจากใบอนุญาตใช้คลื่นของระบบโทรศัพท์แบบสาย",
  fee:"N/A · ค่าคลื่นสำหรับ Ex IP Phone/sounder แบบสาย ตรวจเอกสาร Ex และเงื่อนไขนำเข้าตามรุ่น",
 },
 "TEL-PAGA": {
  item:7, page:29, operation:"none",
  goods:"ตู้ PAGA, amplifier, loudspeaker และอุปกรณ์ประกอบนำเข้าในชุด TSI",
  basis:"ขอบเขตเครือข่าย PAGA แบบสาย ตรวจแยกถ้า BOM เพิ่ม wireless interface หรืออุปกรณ์ส่งคลื่น",
  fee:"N/A · ค่าคลื่นสำหรับ PAGA แบบสาย หากมี wireless paging/mic ให้ตรวจรุ่น ย่าน และสิทธิที่ใช้ร่วม",
 },
 "TEL-CCTV": {
  item:5, page:28, operation:"none",
  goods:"กล้อง, recorder และอุปกรณ์เครือข่ายนำเข้าในชุด TSI",
  basis:"ขอบเขต IP CCTV แบบสาย ตรวจแยกถ้าใช้ Wi-Fi หรือ radio backhaul และผูกกับใบอนุญาตของระบบเครือข่ายที่รับผิดชอบ",
  fee:"N/A · ค่าคลื่นสำหรับ CCTV แบบสาย/PoE ตรวจสิทธิของ Wi-Fi/cellular หรือ radio backhaul หากมี",
 },
 "TEL-RADIO-DTRS": {
  item:8, page:30, operation:"required",
  goods:"แยกอุปกรณ์ Onshore ของ TSI ออกจากชุด Offshore WPA01/WPA02",
  basis:"COMPANY ขอสิทธิใช้คลื่น TSI ยืนยันสถานี APF/ACP, repeater, channel plan และเทียบจำนวนปลายทางกับ DTS-0008 Rev.B1 ที่ยืนยันวิทยุมือถือ 98 เครื่อง ตรวจว่าเป็นสิทธิใหม่หรือขยายสิทธิเดิม",
  fee:"มีอัตรา Private Network อ้างอิงด้านบน รอ PTD ยืนยันหมวดและจำนวนเครื่อง/สถานีที่คิดจริง",
 },
 "TEL-RADIO-MARINE": {
  item:9, page:32, operation:"required",
  goods:"วิทยุ VHF-FM, เสาอากาศและอุปกรณ์ประกอบนำเข้าในชุด TSI",
  basis:"ตรวจใบอนุญาตวิทยุสถานี APF/ACP, channel และผู้ถือสิทธิ รวมขอบเขต Marine Authority ที่ LIS ระบุ",
  fee:"มีอัตรา Ship Station เทียบเคียง รอ PTD ระบุหมวด Coast/Shore Station ของ APF/ACP และอัตราที่ใช้จริง",
 },
 "TEL-RADIO-AERO": {
  item:10, page:33, operation:"required",
  goods:"วิทยุ VHF-AM, เสาอากาศและอุปกรณ์ประกอบนำเข้าในชุด TSI ตรวจหนังสืออนุมัติล่วงหน้าตาม R03",
  basis:"LIS ให้ TSI ตรวจข้อกำหนดใบอนุญาต และ COMPANY ขอจากหน่วยงานโทรคมนาคมและการบินพลเรือน ตรวจสถานี APF และรายการอนุมัติของ DCA",
  fee:"มีอัตรา Aircraft Station เทียบเคียง รอ PTD/DCA ยืนยันหมวด Ground Station APF และค่าอนุมัติแยก",
 },
 "TEL-RADIO-SSB": {
  item:11, page:34, operation:"required",
  goods:"วิทยุ MF/HF, เสาอากาศและอุปกรณ์ประกอบนำเข้าในชุด TSI",
  basis:"ตรวจสถานีและความถี่ MF/HF ตามแผนใช้งาน และขอบเขตสิทธิเดิมที่ COMPANY สามารถใช้ได้",
  fee:"รอ PTD ระบุหมวดสถานี MF/HF และขอบเขตสิทธิเดิมก่อนใช้อัตรา Private Network หรืออัตราหมวดอื่น",
 },
 "TEL-NDB": {
  item:17, page:39, operation:"required",
  goods:"NDB transmitter, เสาอากาศและอุปกรณ์ประกอบนำเข้าในชุด TSI ตรวจหนังสืออนุมัติล่วงหน้าตาม R03",
  basis:"LIS ให้ COMPANY ขอใบอนุญาตจากหน่วยงานโทรคมนาคมและการบินพลเรือน TSI ตรวจ frequency, station/site และเงื่อนไขเปิดใช้งาน",
  fee:"รอ PTD/DCA ยืนยันอัตราเฉพาะ NDB รวมค่า flight inspection ถ้าเข้าข่าย",
 },
 "TEL-AIS": {
  item:16, page:37, operation:"check",
  goods:"แยก AIS free issue และ workstation จาก Offshore ออกจากของนำเข้าเพิ่มโดย TSI",
  basis:"แยก software licence จากใบอนุญาตวิทยุ ตรวจว่าขอบเขต APF เป็น monitoring/รับข้อมูลเท่านั้น และมีการส่ง AIS ที่ WPA01 ภายใต้สิทธิของใคร",
  fee:"APF ตรวจว่าเป็น receive-only ก่อนลง N/A สำหรับภาคส่ง แยกสิทธิ/MMSI ของ Offshore WPA01 ถ้ามี transmitter",
 },
 "TEL-DMR": {
  item:12, page:34, operation:"required",
  goods:"Microwave radio/antenna และ WBB ที่นำเข้าในชุด TSI ตรวจเป็นคนละประเภทอุปกรณ์",
  basis:"LIS ให้ COMPANY ขอสิทธิใช้คลื่น และ SPE-0011 §7.1 ให้ TSI ดำเนินการในนาม COMPANY ตรวจลิงก์ Microwave 7 GHz APF–ACP และตรวจย่าน/สิทธิ WBB แยกกัน",
  fee:"มีตัวอย่าง PTD สำหรับ Microwave หนึ่งลิงก์ด้านบน ยอดจริงและ WBB รอยืนยัน",
 },
 "TEL-FO": {
  item:2, page:25, operation:"none",
  goods:"สายใยแก้ว, termination และอุปกรณ์ประกอบนำเข้าในชุด TSI",
  basis:"ขอบเขต Fiber แบบสาย ตรวจสิทธิผ่านพื้นที่และงานติดตั้งแยกตามเส้นทาง",
  fee:"N/A · ค่าคลื่นสำหรับ passive fiber แบบสาย ตรวจสิทธิผ่านพื้นที่และงานติดตั้งตามเส้นทางแยก",
 },
 "TEL-TELT": {
  item:14, page:36, operation:"none",
  goods:"เสา APF 60 ม. / ACP 30 ม. และอุปกรณ์โครงสร้าง ตรวจตามแหล่งผลิตและชุดนำเข้าจริง",
  basis:"ติดตามการอนุมัติตำแหน่งเสาและสิ่งกีดขวางตามที่เข้าข่าย ใบอนุญาตวิทยุผูกกับอุปกรณ์ของระบบที่ติดตั้งบนเสา",
  fee:"N/A · ค่าคลื่นสำหรับโครงสร้างเสา ตรวจ DCA/หน่วยงานพื้นที่เรื่องสิ่งกีดขวางและงานก่อสร้างตามตำแหน่งจริง อัตรารอยืนยัน",
 },
 "TEL-ES": {
  item:13, page:35, operation:"none",
  goods:"อุปกรณ์ AV/receiver ที่นำเข้า ตรวจ R03 เพิ่มหากใช้ satellite receiver",
  basis:"LIS ระบุ COMPANY รับผิดชอบ subscription ถ้ามี ตรวจลักษณะ receive-only และเปิดทบทวนถ้า BOM มีอุปกรณ์ส่งคลื่น",
  fee:"N/A · ค่าคลื่นสำหรับ AV แบบสาย ส่วน TVRO รอยืนยันหมวดอุปกรณ์รับอย่างเดียวและข้อจำกัดนำเข้าตาม R03",
 },
 "TEL-MET": {
  item:15, page:36, operation:"none",
  goods:"Weather sensor, logger และอุปกรณ์ประกอบนำเข้าในชุด TSI",
  basis:"ตรวจการต่อ sensor/logger และ telemetry ถ้า BOM มี wireless transmitter ให้ทวนย่านและใบอนุญาตของชุดส่งนั้น",
  fee:"N/A · ค่าคลื่นสำหรับ sensor/logger แบบสาย ตรวจย่านและสิทธิเมื่อมี LoRa, cellular หรือ satellite telemetry",
 },
};
