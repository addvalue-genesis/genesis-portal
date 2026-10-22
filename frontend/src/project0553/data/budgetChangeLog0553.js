// PJ2608-0553 — curated change notes ONLY. This file does not price anything.
// Update RELEASE_NOTES_0553 on each meaningful UI/data/pricing code change.
// An automatically embedded build Git SHA separately detects an unseen Pull.
// Do not claim a source-price change unless a canonical owner was actually updated.
export const CHANGE_LOG_VERSION_0553="2026-10-22-R16";
export const RELEASE_NOTES_0553=Object.freeze([
 Object.freeze({
  id:"P553-CHANGE-20261022-04",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"B2 Rev05 THB/MH precision and React details defaultOpen warnings resolved",
  detail:"Node SSR 10.2 B1 worktype PASS but React DOM warned about unsupported details.defaultOpen; B2 owner-price-trace failed historical rate 104.125 and 341.625 test since 2-decimal commercial THB formatter displayed 104.13/341.63. B2 Rev05 historical THB/MH rows now render actual source precision up to 3 decimals (NOT a rate reprice); native B1 and B2 details use supported open attribute with original initial expanded states preserved. B1/B2 SSR tests guard this behavior. B1/B2 current selected Working SELL and Part B unchanged; customer release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b1","bid.budget.working.bc.b2","bid.budget.working.bc.b2.price-trace"]),
  priceImpact:"NO_PRICE_CHANGE",source:"User Windows Node.js v24.21.0 SSR logs / Rev05 01_COMMERCIAL_BASIS historical role-rate seeds"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-03",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"Fix React SSR sharedEvidence initialization crash in 10.2 B/C Cost Evidence",
  detail:"BcCostEvidenceDetail0553.jsx had B1RevKMilestoneBudget JSX referencing {sharedEvidence} inside the sharedEvidence initializer. React evaluates JSX props eagerly, causing ReferenceError during B1 Server-Side Render. Move original B1RevKMilestoneBudget and its sourceLedger/sourceEvidence unchanged to the return section after sharedEvidence is initialized; preserve cost ownership and selected Working SELL. Add B1 runtime SSR and source ordering guard in validate-0553-b1-worktype-accordion.cjs. Also align obsolete B9 zero Base note with selected THB233600. No price or Customer Release policy change.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b1","bid.budget.working.bc.b2","bid.budget.working.bc.b9","bid.budget.working.bc"]),
  priceImpact:"NO_PRICE_CHANGE",source:"User Node.js v24.21.0 React SSR ReferenceError / existing 10.2 B/C owner evidence"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-02",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"Repair B9 FAT Cost Owner regression after Selected Base THB233600",
  detail:"Fix stale assert workingSellTHB===0 in validate-0553-fat-cost-owner-contract.cjs; approved B9 SOW/WS 1 LS THB233600 is selected Base once, conditional execution upon written call-out, direct cost remains NULL. Also correct stale Part B total 4187590.69 to 4385436.82 in SAMTEL Bangkok historical FAT evidence validation. No repricing, MGW FAT B3 remains separate and release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b9","bid.budget.working.bc.b3","bid.budget.working.bc","bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"ADR-65 / B9 source owner / 2026-10-22 user Windows Node.js v24 assertion evidence"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-01",date:"2026-10-22",kind:"DATA_FLOW",tone:"pricing",
  title:"B6 Approved MR0001 Shipping: NextG IDU/ODU + Antenna 5 Sets → MGW; Thai Enclosure+Cisco 4 Sets → MGW",
  detail:"Project Owner อนุมัติ Physical Route โดย NextG IDU4 / ODU4 / Greenfield Antenna5 ส่ง MGW Nantong ตรงทั้งหมด ไม่มีการแยก Antenna ไป JUTAL; ไทยประกอบ Enclosure+Cisco 4 Sets และตรวจ Wiring/Power ก่อนส่ง MGW. MR0002–0004 OEM เข้าจีน FAT ตามเดิม. Selected B6 Working SELL THB307584 และ Part B THB4385436.82 ไม่เปลี่ยน; NextG Quote DAP Ranong หมดอายุ ยังต้อง Requote ปลายทาง MGW, Freight Credit, Customs/Importer, Actual Direct Cost และ shipment booking. MGW SERV-5 USD2500 / SERV-3 USD500 ไม่คิดซ้ำ; Release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b6","bid.budget.working.bc","bid.budget.pricing.release.preview","bid.budget.scope"]),
  priceImpact:"NO_PRICE_CHANGE",source:"ADR-68 / Owner approval 22-Oct-2026 / NextG NG-260916-ADV-DAP1 / RQ2609-1182 / MGW P26-058_R2"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-15",date:"2026-10-21",kind:"DATA_FLOW",tone:"pricing",
  title:"B6 MR0001 NextG Direct-MGW Hybrid + MR0002–0004 Consolidated China FAT Route",
  detail:"ADDVALUE B6 historical Working SELL THB307584 remains selected, no source-level freight-by-MR price available. NG/260916 DAP Ranong (NOT DDP) quote USD191610.15 expired; NextG IDU/ODU direct China scenario, 4 Thailand-built Enclosure+Cisco cabinets to MGW, Greenfield RFQ 5 antennas may bypass MGW only with approved FAT ITP. MR0002–0004 MGW/OEM goods remain China-side, no Thai round trip. MGW SERV-5 USD2500 already quoted, SERV-3 USD500 packing could overlap, no invented credit. Earlier Thailand all-4-cabinet THB42797–72372 is narrow comparison only. 10.2/10.3/10.5 price unaffected; release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b6","bid.budget.working.bc","bid.budget.pricing.release.preview","bid.budget.scope"]),
  priceImpact:"NO_PRICE_CHANGE",source:"ADR-67 / NextG NG-260916-ADV-DAP1 / RQ2609-1182 / MGW P26-058_R2 SERV-5 / existing MGW freight packing evidence"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-14",date:"2026-10-21",kind:"DATA_FLOW",tone:"pricing",
  title:"B3 Site Survey / B6 MR0001 China Assembly Inbound / B7 3-month Free Storage Audit",
  detail:"B3 internal mapping shows Inspection / Site Survey / FAT / SAT; 7-site pre-SAT survey included in scope but survey cost/MD must be separately evidenced (no price posting). B6 SCADA 4 sets Enclosure + IDU + Cisco inbound to MGW Nantong scenario THB42797–72372, MGW SERV-5 USD2500 outbound already vendor quoted separately, no extra B6 price selected. B7 3 months FREE client requirement; MGW no dedicated storage charge/3-month guarantee, external pallet market reference and existing THB30000 one-month allowance kept; THB90000 full 3-month sensitivity nonposting. Current Part B THB4385436.82 unchanged; Release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3","bid.budget.working.bc.b6","bid.budget.working.bc.b7","bid.budget.mapping","bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"ADR-66 / MGW P26-058_R2 20-Oct-2026 / Original 4-Scope of Supply.xlsx / Flexport / China 3PL"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-13",date:"2026-10-21",kind:"PRICE",tone:"pricing",
  title:"B9 Specialist Assistance — Quoted Base 1 LS THB233600 ใน 10.3 Release Preview",
  detail:"ตามนโยบาย Project Owner ให้ B9 Specialist Assistance 1 Lot มีราคาใน Release; 10.2 เลือก Working SELL 233600 จาก source Yard package เดิม 7+2 วันและรายจ่ายร่วมเพียงครั้งเดียว. 10.3 และ 10.5/Native G32 รับยอดเดียวกัน Part B Base 4385436.82 (+233600), SAMTEL B9 5% =11680, ADDVALUE receivable 221920 ก่อนต้นทุนจริง. การเข้าทำงานที่ Yard ยังขึ้นกับ written call-out/RACI; ไม่สร้าง conditional line ซ้ำ ไม่บวก markup ของ ADDVALUE ซ้ำ Actual Direct Cost NULL และ Customer Release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b9","bid.budget.working.bc","bid.budget.pricing.release.preview","bid.budget.scope","bid.budget.mapping"]),
  priceImpact:"WORKING_SOURCE_CHANGED",source:"ADR-65 / Original 4-Scope of Supply.xlsx B9 1 Lot / Rev.K B9 Yard estimate"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-12",date:"2026-10-21",kind:"DATA_FLOW",tone:"pricing",
  title:"B3/B8 ห้าวัน + SAT Lean 28+2 + B9 Conditional + Customer Mapping Audit",
  detail:"เพิ่ม Nonposting Five-day China FAT/Training Allocation จาก 8 Expense IDs (1/2 trainer); SAT Lean 28+2 ผูก 21 Test IDs และรวม MGW Purchased FAT THB307125 ครั้งเดียว. 10.4 ตรวจ A/B/C Current Projection ไปยัง 10.3/10.5/Native; Preview ใช้ชื่อรายการจาก Original Workbook และ B9 THB233600 ยังเป็น Conditional, Base Zero. B3 2750525, B8 30000, B9 0 และ Part B 4151836.82 ไม่เปลี่ยน. Full npm build ยังไม่ยืนยัน; Release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3","bid.budget.working.bc.b8","bid.budget.working.bc.b9","bid.budget.mapping","bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"ADR-64 / MGW P26-058_R2 / original 4-Scope of Supply.xlsx / existing 10.2 price authority"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-11",date:"2026-10-21",kind:"DATA_FLOW",tone:"pricing",
  title:"B1 Role Support Regression: ตรวจยอด Part B หลัง B2 Reprice และ MGW FAT",
  detail:"แก้ validate-0553-b1-role-support-plan.cjs ที่ยังคาด 4,187,590.69 ก่อนเลือก B2 131-WO และ MGW Purchased FAT ให้ตรวจ Canonical B1 211600, B2 237121.13, B3 2750525, Part B 4151836.82 พร้อม Bridge จาก Historical (B2 580000→237121.13 และ B3 +307125). ทดสอบ B1 legacy Engineering carryforward 0 และห้ามเก็บ Rev05 เป็นราคา Working SELL ปัจจุบัน.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b1.revk-pm-milestones","bid.budget.working.bc.b2","bid.budget.working.bc.b3.mgw-r2-cover-20261020","bid.budget.working.bc"]),
  priceImpact:"NO_PRICE_CHANGE",source:"B1 role-plan regression / canonical B2/B3 price migration and owner-only roll-up"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-10",date:"2026-10-21",kind:"UI",tone:"navigation",
  title:"แก้ B3/B8 Seven-day SSR ราคาเก่าและ Warning ที่ B/C Owner Price Trace",
  detail:"ปรับ Regression Seven-day Scenario ให้เทียบราคาจาก Current Data Model หลัง MGW Purchased FAT: B3 proposed THB2755525, B8 THB37800, Combined THB2793325; เก็บ Non-posting และ Customer Release HOLD. แก้ Native details ใน BcOwnerPriceTrace ให้ใช้ open แทน defaultOpen โดยไม่เปลี่ยน Canonical Working SELL หรือค่า SAT.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.fat-training-7d-allocation","bid.budget.working.bc.b8.integrated-fat-training-7d","bid.budget.working.bc.b8.price-trace"]),
  priceImpact:"NO_PRICE_CHANGE",source:"validate-0553-b3-b8-seven-day-identity.cjs / BcOwnerPriceTrace0553.jsx"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-09",date:"2026-10-21",kind:"UI",tone:"navigation",
  title:"แก้ Warning details.defaultOpen และ Regression ลำดับ B3.1–B3.4",
  detail:"B3 hierarchical table ใช้ native <details open> ที่ React รองรับแทน defaultOpen; Regression ตรวจลำดับ FAT→SAT→Tools→Audit จาก data-component-key ของ Module จริง ไม่ใช้ indexOf ข้อความเกริ่น B3.1–B3.4 ที่ปรากฏก่อนแถวราคา การจัดสรร SAT, MGW Supplier Quote, Working SELL และ Historical Audit คงเดิม.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.worktype-accordion","bid.budget.working.bc.b3.fat","bid.budget.working.bc.b3.sat","bid.budget.working.bc.b3.tools","bid.budget.working.bc.b3.audit"]),
  priceImpact:"NO_PRICE_CHANGE",source:"B3WorkTypeAccordion0553.jsx / validate-0553-b3-breakdown-module-ids.cjs"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-08",date:"2026-10-21",kind:"UI",tone:"navigation",
  title:"SAT Matrix Regression: ข้อความ NOT 8 days per MR และ Caller B3.2",
  detail:"แก้เฉพาะ validate-0553-b3-sat-matrix-price-trace ที่เคยค้น NOT per MR และ Direct SAT Caller แบบเดิมให้ตรงกับข้อความจริง NOT 8 days per MR และ BcCostEvidenceDetail → B3WorkTypeAccordion → B3SiteMrSatCoverage; กฎ 40 team-days, 80 MD, 21 Test IDs nonposting, MGW FAT Purchased source pricing และความป้องกันคิดซ้ำไม่เปลี่ยน.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.site-mr-sat-matrix","bid.budget.working.bc.b3.sat","bid.budget.working.bc.b3.worktype-accordion"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Source-backed SAT matrix SSR and B3 hierarchical caller validation"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-07",date:"2026-10-21",kind:"UI",tone:"navigation",
  title:"แก้ Validation ให้ตรวจ Cost Owner B3/B9 ตาม Caller จริง",
  detail:"ปรับ validate-0553-fat-cost-owner-contract ให้ตรวจ B3.1 FAT ผ่าน B3WorkTypeAccordion ที่รับผิดชอบ Witness/Travel และ B9 conditional Yard ผ่าน BcCostEvidenceDetail. ยังคงตรวจ 8 FAT + 8 Yard rows, IC-FAT/IC-YARD, ไม่รวม B9 Base และไม่มี Actual Cost ที่พิสูจน์แล้ว; ปรับหน้าสรุป B3 FAT ให้รวม MGW Purchased THB307125 ครั้งเดียว.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.revk-china-budget","bid.budget.working.bc.b3.mgw-r2-cover-20261020","bid.budget.working.bc.b9.revk-china-budget"]),
  priceImpact:"NO_PRICE_CHANGE",source:"node:vm FAT Cost Owner regression / B3WorkTypeAccordion → B9ChinaBudgetDetail"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-06",date:"2026-10-21",kind:"DATA_FLOW",tone:"pricing",
  title:"แก้ SAT Matrix Runtime Reconciliation หลังเพิ่ม MGW Purchased FAT",
  detail:"แก้ B3SiteMrSatCoverage0553.jsx จากยอดเทียบ SAT+VeEX+FAT Witness เดิม ให้รวม MGW Purchased iFAT/Facility ที่อยู่ใน Canonical B3 แล้วครั้งเดียว (2046000+397400+307125=2750525). เพิ่ม Price Trace ในตาราง SAT และ Regression ตรวจการลืม/คิดซ้ำ; SAT 40 days, Test IDs และ Part B Working SELL ไม่เปลี่ยนอีก.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.site-mr-sat-matrix","bid.budget.working.bc.b3.mgw-r2-cover-20261020","bid.budget.working.bc.b3"]),
  priceImpact:"NO_PRICE_CHANGE",source:"B3 SAT runtime error regression / canonical Purchased FAT read model"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-05",date:"2026-10-21",kind:"PRICE",tone:"pricing",
  title:"MGW Purchased iFAT + FAT Facility now selected in B3 Working SELL",
  detail:"MGW P26-058_R2 SERV-2 USD5000 + SERV-4 USD2500 (FX THB31.50) quoted purchased base THB236250 × 1.30 (SAMTEL20% ADDVALUE5% omission5%) = WS-B3 Purchased THB307125. FAT incl ADDVALUE witness THB704525, B3 total THB2750525, Part B THB4151836.82. 10.3 protects purchased share against double SAMTEL5% deduction. 10.2 B1–B14/C1–C2 has SOW/VQ/IC/WS/CP table; 10.3 and 10.5 show financial IDs, no new source or customer release.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.mgw-r2-cover-20261020","bid.budget.working.bc.b3.fat","bid.budget.working.bc.b3.financial-identity","bid.budget.pricing.release.preview","bid.budget.scope"]),
  priceImpact:"WORKING_SOURCE_CHANGED",source:"MGW P26-058_R2 2026-10-20 cover Item 3/4 / management China FAT working-sell decision"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-04",date:"2026-10-21",kind:"UI",tone:"navigation",
  title:"เพิ่ม What's New / Change Summary ใน Budget Workspace",
  detail:"แสดงสิ่งที่เปลี่ยนพร้อมวันที่ ประเภทงาน Module ID ที่เกี่ยวข้อง และสถานะกระทบราคา ตรวจ Git revision ของ Build เพื่อแจ้งเมื่อ Pull รุ่นใหม่",
  moduleIds:Object.freeze(["bid.budget.changes","bid.budget"]),
  priceImpact:"NO_PRICE_CHANGE",source:"PJ2608-0553 Budget Workspace UI"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-03",date:"2026-10-21",kind:"UI",tone:"navigation",
  title:"คืนทางลัด 3 สี Working / Budgetary / Release",
  detail:"Working / Edit นำไป 10.2, Budgetary เปิดข้อมูลเดิมใน TEMP, Release เปิด Customer Excel Preview โดยไม่สร้างชุดราคาขายใหม่",
  moduleIds:Object.freeze(["bid.budget.pricing.single-release","bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"10.3 workflow navigation"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-02",date:"2026-10-21",kind:"UI",tone:"navigation",
  title:"Module ID คลิกถึงต้นทาง พร้อม Color-coded Nested Accordion",
  detail:"แยกสีงาน Engineering, SAT, Logistics, Spares/Options; มี Expand/Collapse และ Copy Module ID ใน Customer Release โดยไม่แก้ Working SELL",
  moduleIds:Object.freeze(["bid.budget.pricing.release.source-navigator","bid.budget.working.bc"]),
  priceImpact:"NO_PRICE_CHANGE",source:"10.3 Release Source Navigator"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261021-01",date:"2026-10-21",kind:"DATA_FLOW",tone:"pricing",
  title:"Release Preview อ่านราคาโดยตรงจาก 10.1/10.2; พรีวิวเก่าย้าย TEMP",
  detail:"Part A อ่าน BOM, Part B อ่าน Canonical Working SELL, Part C ยังรอต้นทุนจริง การย้าย Working/Budgetary Preview ไป TEMP ไม่ใช่การอนุมัติราคาใหม่; B3 เดิม 2,443,400 THB ยังไม่เปลี่ยน",
  moduleIds:Object.freeze(["bid.budget.pricing.release.preview","bid.budget.pricing.temp"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Single Release Commercial Model"
 })
]);
export const CHANGE_TYPES_0553=Object.freeze({
 UI:"UI / Navigation",
 DATA_FLOW:"Data Flow",
 ENGINEERING:"Engineering",
 COST:"Working Cost",
 PRICE:"Working SELL / Commercial",
 RELEASE:"Customer Release"
});
