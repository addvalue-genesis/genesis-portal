// PJ2608-0553 — curated change notes ONLY. This file does not price anything.
// Update RELEASE_NOTES_0553 on each meaningful UI/data/pricing code change.
// An automatically embedded build Git SHA separately detects an unseen Pull.
// Do not claim a source-price change unless a canonical owner was actually updated.
export const CHANGE_LOG_VERSION_0553="2026-10-21-R01";
export const RELEASE_NOTES_0553=Object.freeze([
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
