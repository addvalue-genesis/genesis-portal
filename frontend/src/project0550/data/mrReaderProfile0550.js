// Reading/navigation metadata, not a replacement RFQ, accepted engineering or price basis.
// Native B1 inspected: 54 physical pages including cover/comments; 52 numbered pages.
export const MR_READER_PROFILE_0550={
 version:'0550-mr-reader-b1-20261101-1',documentNo:'MM-ASK-1A-APF-TEL-MR-0001',revision:'B1',
 sha256:'5199bb61c01db86f7c971117ad5e54b7d04e70061d6ad999b72f858122a0de5a',physicalPages:54,printedPages:52,
};
// Page numbers are physical PDF numbers. System membership is a reading context,
// never a new allocation, mandatory common activity or cost owner.
const section=(id,title,thai,from,to,systems,kind='PARTICULAR')=>({id,title,thai,from,to,systems,kind});
export const MR_READER_SECTIONS_0550=[
 section('front','Cover / Review Comments','หน้าปกและข้อคิดเห็นฉบับก่อน',1,2,['COMMON'],'FRONT'),
 section('intro','Introduction','บทนำและสารบัญ',3,4,['COMMON'],'FRONT'),
 section('1.0','Scope of Work for TSI','หน้าที่ TSI / งานร่วม / ข้อเฉพาะ / Battery Limits',5,10,['COMMON'],'COMMON'),
 section('1.1','VHF and MF/HF','วิทยุและอุปกรณ์ประกอบ',11,13,['TEL-RADIO-DTRS','TEL-RADIO-MARINE','TEL-RADIO-SSB','TEL-RADIO-AERO','TEL-TELT']),
 section('1.2','Satellite Communication','VSAT และอุปกรณ์ / งานที่เกี่ยวข้อง',14,15,['TEL-VSAT','TEL-VSAT-KU']),
 section('1.3','Network / PABX / CCTV / MET','เครือข่าย โทรศัพท์ กล้อง และอุตุนิยมวิทยา',16,19,['TEL-LAN','TEL-IPP','TEL-PABX','TEL-CCTV','TEL-MET']),
 section('1.4','PAGA','ระบบเสียงประกาศและสัญญาณเตือน',20,22,['TEL-PAGA']),
 section('1.5','Microwave Communication','ไมโครเวฟและงานออกแบบลิงก์',23,24,['TEL-DMR']),
 section('1.6','Entertainment','ระบบบันเทิง',25,26,['TEL-ES','TEL-LAN-VCS']),
 section('1.7','Non-Directional Beacon','NDB และการพิสูจน์ Coverage',27,28,['TEL-NDB']),
 section('1.8','FOC and Cables','ไฟเบอร์ สาย และอุปกรณ์ประกอบ — ตามสารบัญ',29,30,['TEL-FO','TEL-LAN','TEL-PAGA']),
 section('2','Technical Requirements and Documentation','รายการเอกสารอ้างอิงตั้งต้น',31,35,['COMMON'],'REFERENCE'),
 section('3','Supplier Documentation Requirement Listing','SDRL / เอกสารที่ต้องจัดทำและเงื่อนไขส่ง',36,42,['COMMON'],'DELIVERABLE'),
 section('4','Inspection and Testing Requirements','ITR / กิจกรรมและจุดตรวจ',43,44,['COMMON'],'TEST'),
 section('5','Vendor Responsibility and Guarantee','ความรับผิดชอบและการรับประกัน',45,45,['COMMON'],'TERMS'),
 section('6','Engineering Documents and Drawings','รูปแบบและการควบคุมเอกสารวิศวกรรม',46,46,['COMMON'],'DELIVERABLE'),
 section('7','Bill of Material','ข้อมูลที่ต้องแสดงใน BOM',47,47,['COMMON'],'DELIVERABLE'),
 section('8','Manufactured Component Data','ข้อมูลชิ้นส่วนจากผู้ผลิต / Sub-vendor',48,48,['COMMON'],'DELIVERABLE'),
 section('9','Operating Manual','คู่มือ Pre-commissioning / Start-up / Operation',49,49,['COMMON'],'DELIVERABLE'),
 section('10','Commissioning and Start-up Spare Parts List','รายการอะไหล่และข้อมูลบริการประกอบ',50,50,['COMMON'],'SPARES'),
 section('11','Maintenance Manual','เนื้อหาคู่มือการบำรุงรักษา',51,51,['COMMON'],'DELIVERABLE'),
 section('12','Two Years Operating Spare Parts List','รายการและราคาย่อยอะไหล่สองปี',52,52,['COMMON'],'SPARES'),
 section('13','Special Tools','เครื่องมือพิเศษ รวม Software ที่กำหนด',53,53,['COMMON'],'TOOLS'),
 section('14','Shipping and Long Term Storage','คำแนะนำการขนส่งและเก็บรักษา',54,54,['COMMON'],'LOGISTICS'),
];
export const MR_READER_COMMON_HEADINGS_0550=[
 {title:'1.0 Purpose / 1.1 Language / 1.2 General / 1.3(a–c)',page:5},
 {title:'1.3(d–j) ประสบการณ์ / Interface / Tower / ACS; 2.0(a–b)',page:6},
 {title:'2.0(c–j) Integration / Procurement / Build / Test / Documents / Logistics',page:7},
 {title:'2.0(j–q) Commissioning / Cybersecurity / License / Training / Warranty; 2.1',page:8},
 {title:'2.1 Battery Limits ต่อเนื่อง; 2.2(a) VSAT',page:9},
 {title:'2.2(b–d) DTRS / AIS / Fiber Responsibility',page:10},
];
export const mrReaderPrintedPage0550=page=>page>=3?page-2:null;
// Thai interpretations stay explicitly separate from native source text. None of
// these notes stamps a source review or resolves a conflict in the canonical model.
export function mrReaderGuidance0550(page){
 const notes=[];
 if(page===2)notes.push('Review Comments อ้าง Rev.A2 และเลขหน้าเดิม: CLOSED ในตารางไม่ยืนยันว่าข้อกำหนด B1 ถูกนำไปใช้ครบ ต้องตรวจตำแหน่งใหม่');
 if(page===5)notes.push('หน้าที่ TSI รวมการค้นงานและอุปกรณ์ที่จำเป็น ห้ามถือว่ารายการที่ไม่มีราคาแยกเป็นขอบเขตที่ไม่ต้องทำ');
 if(page===6)notes.push('§1.3(h) มีข้อเฉพาะ Cisco / Avaya / Firewall / Motorola อยู่ภายใน Appendix 1.0','§1.3(i) แยกงานออกแบบฐานรากและ Anchor Bolts ออกจากการก่อสร้างฐานรากที่ระบุไม่รวม','§1.3(j) ACS เป็น Optional และให้เสนอราคาประเมินก่อน ไม่รวมเป็น Base อัตโนมัติ');
 if(page===7)notes.push('§2.0(h) ระบุ FCA ใน MR: ต้องตรวจร่วมกับเงื่อนไขประกวดราคาและสัญญาก่อนเลือกเงื่อนไขส่งมอบ ไม่แทนค่าที่บันทึกไว้');
 if(page===8)notes.push('§2.0(q) ระบุ Post-start-up support ขั้นต่ำ 90 วัน: เป็นระยะเวลาภาระงาน ไม่ใช่จำนวนคนหรือ 90 วัน On-site อัตโนมัติ');
 if(page===9)notes.push('§2.2(a) COMPANY จัดหา VSAT Hardware / Services แต่ SI ยังมีงานเอกสาร ติดตั้ง Integration และ Commissioning; ต้องตรวจชื่อไซต์ร่วมกับ Appendix 1.2');
 if(page===10)notes.push('AIS มีหน้าที่ของ COMPANY / EPC01 / TSI แยกกัน ไม่ใช่ไม่มีงานเพราะผู้อื่นจัดหาอุปกรณ์หลัก','FOC มีข้อความ Supply / Install และข้อแบ่งงาน CONTRACTOR / TSI ที่ต้องกระทบยอด ห้ามสรุปผู้ติดตั้งจากบรรทัดเดียว');
 if([11,12,14,16,17,18,20,21,23,25,27,29,30].includes(page))notes.push('คง Site / Item / Qty / Unit / รายการประกอบและ Notes ตามต้นฉบับ; 1 Lot ไม่เท่ากับอุปกรณ์หนึ่งชิ้น และไม่บวกแพ็กเกจซ้ำกับชิ้นส่วนที่รวมแล้ว');
 if(page===13)notes.push('ปริมาณวิทยุจาก FEED ต้องตรวจ Radio Coverage และผลต่ออุปกรณ์ สาย Power / Network และตำแหน่งติดตั้ง');
 if(page===15)notes.push('VSAT หลัก COMPANY จัดหา แต่งานและอุปกรณ์ประกอบอื่นตามข้อกำหนดยังเป็นขอบเขต Vendor; อ่านร่วมกับ §2.2(a)');
 if(page===19)notes.push('CCTV / Wi-Fi Coverage ใช้กำหนดจำนวนและตำแหน่งกล้องสุดท้าย แล้วตรวจ Switch / PoE / Patch Panel / Media Converter ที่ได้รับผล');
 if(page===22)notes.push('PAGA ต้องมี Acoustic / Noise Coverage รวม STI และปรับ Amplifier / Power / Zone Hardware ตามผลออกแบบ');
 if(page===24)notes.push('Microwave ต้องมี Path Study / Availability / Reliability; ปรับ Dish / Power / Elevation และอุปกรณ์ประกอบตามผลที่ยอมรับ');
 if(page===28)notes.push('NDB ต้องพิสูจน์ Coverage / Field Strength และเงื่อนไขการอนุญาตตาม MR; ไม่แทนการตรวจข้อกำหนดปัจจุบันหรือผลคำนวณของ SI');
 if([29,30].includes(page))notes.push('สารบัญระบุ Appendix 1.8 FOC and Cables แต่หัวหน้าพิมพ์จริงยังเป็น Appendix 1.6 Entertainment: แสดงทั้งสองอย่างและเก็บเป็นประเด็นตรวจเอกสาร ห้ามเปลี่ยนต้นฉบับเงียบ ๆ','VTA / ปริมาณที่ไม่ระบุหน่วยต้องตรวจต้นฉบับและแบบที่เกี่ยวข้อง ไม่เติมหน่วยหรือจำนวนจากการเดา');
 if(page>=31&&page<=35)notes.push('78 รายการเลขเอกสาร/ฉบับเป็นฐานเริ่มต้น ไม่ใช่เพดานของ A; ต้องตาม References ต่อ รวมเอกสารนอกชุดตั้งต้น');
 if(page>=36&&page<=42)notes.push('SDRL คือข้อกำหนดงานเอกสารส่งมอบ ไม่ใช่รายการไฟล์ลูกค้าที่ขาด; ช่อง With Bid ว่างไม่ถือว่าเป็น B อัตโนมัติ ใช้ร่วมกับ Invitation และคำชี้แจง');
 if([43,44].includes(page))notes.push('คงความหมาย Witness / Verify / Review / Documents / Hold Point ตาม ITR; ผลออกแบบไม่ใช่ผล FAT / SAT ที่เกิดขึ้นแล้ว');
 if(page===45)notes.push('ต้องเปิดเผย Deviation ในข้อเสนอ และตรวจความรับผิดชอบ / Guarantee กับสัญญา; Design life ไม่ใช่ระยะ Warranty โดยอัตโนมัติ');
 if([46,47,48].includes(page))notes.push('นำรายละเอียดรูปแบบ Title Block / Revision / BOM / Component Data ไปเป็นงานเอกสารที่มีผู้รับผิดชอบและต้นทุนไม่ซ้ำ');
 if([49,51].includes(page))notes.push('ข้อกำหนดเนื้อหาคู่มือไม่เท่ากับการว่าจ้างบริการบำรุงรักษาหน้างานทุกครั้งในอนาคต');
 if([50,52].includes(page))notes.push('แยก Commissioning / Start-up Spares กับ Two-year Operating Spares ตามฐานที่ใช้จริง ตรวจราคา Parts / Availability / Inclusion ไม่คิดซ้ำ');
 if(page===53)notes.push('Special Tools รวม Software สำหรับ Configure / Monitor / Control ตามข้อกำหนด ต้องตรวจสิ่งที่ Supplier รวมไว้แล้ว');
 if(page===54)notes.push('ขั้นตอนเก็บรักษาอย่างน้อยหนึ่งปี ไม่เท่ากับการคิดค่าเช่าโกดังหนึ่งปีอัตโนมัติ');
 return notes;
}
