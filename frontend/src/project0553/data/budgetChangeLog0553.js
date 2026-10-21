// PJ2608-0553 — curated change notes ONLY. This file does not price anything.
// Update RELEASE_NOTES_0553 on each meaningful UI/data/pricing code change.
// An automatically embedded build Git SHA separately detects an unseen Pull.
// Do not claim a source-price change unless a canonical owner was actually updated.
export const CHANGE_LOG_VERSION_0553="2026-10-21-R03";
export const RELEASE_NOTES_0553=Object.freeze([
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
