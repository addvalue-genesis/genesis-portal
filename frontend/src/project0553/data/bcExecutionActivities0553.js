// Presentation/ownership registry. Prices come from existing canonical owners only.
const entries=[
 ["B1","Engineering & PMO / Myanmar Licensing",[
  "Engineering & PMO: ออกแบบ/ตรวจ Interface ที่ไม่รวม B2; บริหารโครงการ จัดซื้อ Admin, Accounting และ Logistics Coordination",
  "Myanmar: ตรวจใบเดิม จัดคำขอผ่านบริษัทเมียนมา ประสาน PTD/MOTC, MOC, MOE/MOGE, PTTEP และ Customs ตามที่เกี่ยวข้อง ติดตาม แก้ไข และส่งมอบเอกสารอนุมัติสำหรับ MR0001–MR0004"
 ],"ค่าแรงสำนักงานเดิมครั้งเดียว; งาน B2/A ที่รวมแล้วไม่เพิ่ม B1; ค่าจ้างบริษัท ค่าธรรมเนียม และเงินเผื่อแยกกัน; งานวิศวกรรมเฉพาะที่เหลือยังต้องปิด MH/RACI",
 "Engineering/interface coordination and PMO; Myanmar import and operating approvals for MR0001–MR0004, including local filing services and applicable government fee allowances."],
 ["B2","VDRL / Documentation",["จัดทำ ตรวจ และส่ง Drawing, Calculation, Datasheet, Procedure, Test Report, As-built และ Final Dossier ตาม VDRL"],"นับผู้จัดทำ/ตรวจเอกสารใน B2 ครั้งเดียว; แฟ้มยื่นใบอนุญาตอยู่ B1; เอกสารสอนเฉพาะอยู่ B8",
 "VDRL engineering documents, test procedures/reports, as-built and final dossier; no duplicate engineering charge."],
 ["B3","Inspection / FAT / SAT",["SAMTEL: เตรียม/Configure 4 วัน; FAT 2 วัน + เผื่อ 1 วัน รวมปิด Punch List; พื้นที่ เครื่องมือชั่วคราว และรับรองผู้ร่วม FAT","BF survey เพิ่มเติมตามเงื่อนไข และ Offshore SAT ตามฐานที่เลือก"],"เครื่องมือ/พื้นที่ร่วม FAT-Training จ่ายครั้งเดียว; Training อยู่ B8; Onshore JUTAL specialist อยู่ B9; deployment RACI ยังไม่ปิด",
 "SAMTEL preparation, FAT 2 days + 1 reserve, shared facilities/test tools and closeout; survey and SAT per service basis."],
 ["B4","Painting / Protective Coating",["สี ป้องกันการกัดกร่อน และ Touch-up ตามข้อกำหนดเฉพาะส่วนที่ Supplier ไม่รวม"],"ยังไม่ยืนยัน applicability/ราคา; ไม่ใช่ศูนย์โดยอัตโนมัติ",
 "Required protective coating and touch-up, net of supplier inclusion; applicability and price to be confirmed."],
 ["B5","Packing & Marking",["ตรวจ/ใช้ลังเดิม บรรจุใหม่หลัง FAT ป้องกันความชื้น Shipping Mark และแยก Spare/Tools"],"หักบรรจุภัณฑ์ที่ Supplier รวม; ไม่รวมค่าขนส่ง/คลัง",
 "Post-FAT export packing, preservation and shipping marks, reusing suitable OEM cases without duplicate packing."],
 ["B6","Transportation / Border Administration",["Supplier → ไทย/SAMTEL: ขนส่ง ตัวแทนออกของและเอกสารนำเข้า","SAMTEL → CIF Zhuhai: รถ/โหลด/Terminal ตัวแทนและเอกสารส่งออก ระวาง ประกันสินค้า และเอกสารสนับสนุน JUTAL"],"30,000 + 20,000 เป็น COST ค่าดำเนินการเท่านั้น; ส่วนราคาขายแทนวงเงินเดิมตาม reconciliation; ภาษี/อากรยังไม่ตั้ง; ใบอนุญาตเมียนมาอยู่ B1",
 "Supplier-to-Thailand logistics and import administration; Thai export documentation, freight and cargo insurance to CIF Zhuhai Port; JUTAL document support."],
 ["B7","Storage",["เก็บรักษาและเผื่อคลังเพิ่มหนึ่งเดือนเมื่อมีค่าใช้จ่ายนอกช่วงที่รวมไว้"],"ไม่ซ้ำพื้นที่ FAT/คลังฟรีในราคา Supplier; ยืนยันเงื่อนไขเก็บฟรีตามสัญญา",
 "Additional storage allowance only beyond included storage; no duplicate FAT facility charge."],
 ["B8","Training",["SAMTEL Training 1 วัน + เผื่อ 1 วัน; OEM online เป็นฐาน ADDVALUE ช่วยปฏิบัติ onsite","วิทยากร เนื้อหา/เอกสารอบรม ชุดสาธิต ระบบประชุม และค่าใช้จ่ายผู้ร่วมอบรม"],"คู่มือ VDRL ใน B2 ไม่คิดซ้ำ; demo/พื้นที่/เครื่องมือร่วมใน B3 ครั้งเดียว",
 "OEM online training with ADDVALUE onsite facilitation at SAMTEL: 1 day + 1 reserve, training materials and session expenses."],
 ["B9","Onshore Specialist Assistance",["JUTAL: Senior + Field 2 คน Configure/Integration/Onshore assistance; 7 วันทำงาน + 2 วันเดินทางต่อคน พร้อมค่าเดินทาง/ที่พักตามฐาน"],"Day/OT/Standby แสดง Release สำหรับส่วนเกินฐาน; ไม่คิดซ้ำ B3; ขอบเขต18/45วันใน CCL ยังต้อง reconcile",
 "Onshore JUTAL configuration/integration assistance and mobilisation per included days and additional-service basis."],
 ["B10","Commissioning / Start-up Spares",["อะไหล่ติดตั้ง Pre-commissioning, Commissioning และ Start-up แยกระบบ/TAG"],"ไม่ซ้ำ OEM included, B13 หรือ C1/C2; ตรวจ OEM SPIR",
 "Erection, pre-commissioning, commissioning and start-up spares per annex; OEM-included items counted once."],
 ["B11","O&M Special Tools",["เครื่องมือพิเศษส่งมอบลูกค้าสำหรับ Operation & Maintenance"],"เครื่องมือเช่าหรือเครื่องมือที่ ADDVALUE นำกลับเป็น B3/B9",
 "Special tools handed over for operation and maintenance; temporary contractor test tools excluded."],
 ["B12","First Filling",["วัสดุเติมครั้งแรกตามอุปกรณ์และคู่มือ OEM เมื่อจำเป็น"],"ตรวจ applicability; ยังไม่ยืนยันราคา ไม่ถือเป็นศูนย์",
 "Initial filling materials where required by the selected equipment; applicability and price to be confirmed."],
 ["B13","Consumables",["วัสดุสิ้นเปลืองสำหรับ Preservation, Operation และ Maintenance ตามขอบเขตส่งมอบ"],"ไม่ซ้ำ bulk A, packing B5 หรือวัสดุรวมในบริการ",
 "Preservation, operation and maintenance consumables per annex, excluding items already included elsewhere."],
 ["B14","Bonds & Insurance",["ค่าธรรมเนียมหลักประกันและประกันตามสัญญาที่ ADDVALUE รับผิดชอบ"],"Cargo Insurance อยู่ B6; ประกันทีมที่รวม B3/B9 แล้วไม่ซ้ำ; วงเงิน/เบี้ยยังต้องยืนยัน",
 "Contractual bonds and insurance; cargo and personnel cover allocated elsewhere is not duplicated. Price to be confirmed."]
];
export const BC_EXECUTION_ACTIVITIES_0553=Object.freeze(Object.fromEntries(entries.map(([code,title,activities,boundary,releaseText])=>[code,Object.freeze({
 code,title,activities:Object.freeze(activities),boundary,releaseText,
 sourceModuleId:"bid.budget.working.bc."+code.toLowerCase(),
 moduleId:"bid.budget.working.bc."+code.toLowerCase()+".execution-activities",
 independentPostingAllowed:false,customerAccepted:false
})])));
