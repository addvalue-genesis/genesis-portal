// PJ2608-0553 — curated change notes ONLY. This file does not price anything.
// Update RELEASE_NOTES_0553 on each meaningful UI/data/pricing code change.
// An automatically embedded build Git SHA separately detects an unseen Pull.
// Do not claim a source-price change unless a canonical owner was actually updated.
export const CHANGE_LOG_VERSION_0553="2026-10-22-R26";
export const RELEASE_NOTES_0553=Object.freeze([
 Object.freeze({
  id:"P553-CHANGE-20261022-14",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"10.2 Cost-Line Module IDs: Canonical vs Preview Namespace Regression",
  detail:"Windows 101-test diagnostic reached 100 PASS / 1 FAIL, with bc-working-cost-lines assertion expecting obsolete static data-component-key={x.moduleId}. Actual BcWorkCostLines0553.jsx intentionally uses presentationNamespace cost-line-preview per row to avoid duplicate DOM IDs when embedded in owner audits; direct canonical render uses x.moduleId and Copy always retains componentKey=x.moduleId. Updated strict JSX source assertion to verify both anchor paths and Copy identity. No working cost/sell, source WBS, Scope, MGW routing or Customer Release mutation; final Node validation and webpack build must still pass.",
  moduleIds:Object.freeze(["bid.budget.working.bc.cost-lines","bid.budget.working.bc","bid.budget.working.bc.b2"]),
  priceImpact:"NO_PRICE_CHANGE",source:"User 2026-10-22 100 PASS / 1 FAIL Node.js v24.21.0 B/C cost-line anchor regression"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-13",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"Unified 101-Validator Repair: Source Authority, Rev03 Lock and Current 10.2 UI",
  detail:"User sequential diagnostic found 91 PASS and 10 FAIL in spare-onward build. Reconcile outdated B2/B3/B9 B5 test prices and legacy 10.2 inline cost/navigation assertions to current canonical hierarchy; keep B3 historical 39-team-day audit separate from selected 40-day plan. Restore LocationBomDetail0553.jsx exactly to locked Rev03 gitBlobSha 0f2d0a90af21fcde00898f71bd081eaade0c3589; keep independent BULK via SimpleBom, never regenerate manifest. MR0003 selected MGW PHONE-1/WAROM, BARTEC GA-1004 8-hole comparison is historical only with MGW actual entry count OPEN; no gland or extra equipment posting. Show VALIDATION change notes in What's New. Improve diagnostic to show failing stack/script line, not generic AssertionError only. Current Working SELL unchanged; full Node 101-test rerun and webpack verification still REQUIRED, Customer Release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc","bid.budget.working.bc.b1","bid.budget.working.bc.b2","bid.budget.working.bc.b3","bid.budget.bulk.bartec-gland-size-quantity","bid.budget.bom.system-location-mto"]),
  priceImpact:"NO_PRICE_CHANGE",source:"2026-10-22 Windows Node 101-test diagnostic (91 PASS, 10 FAIL) / approved Rev03 manifest and selected MGW R2"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-12",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"RACON quotation cost identity and 132-stage build validation diagnostic",
  detail:"Current MR0004 installed Part A MGW P26-058_R2 RACON-1 USD75059/unit is separated from superseded MDS/ORGA QTORG2609244 USD75000 FCA comparator; no quote-price replacement, cross-credit or vendor scope inheritance. C1 management-selected 1 LS budgetary nonposting remains historical ORGA USD75000 x FX31.50=THB2362500 with OEM spare equivalence unverified; MGW equipment is USD75059 x FX31.50=THB2364358.50 comparison ONLY. Correct 10.2 annex vendor labels and spare engineering test. Reconcile stale Part B THB4187590.69 assertions across spare obligations, spare coverage, spare customer schedule and B5 equation tests to controlled THB4385436.82; no Working SELL changes. Add independent sequential validate:0553-build-diagnostics with --from support and full local TEMP log, so remaining validation failures can be collected in ONE pass without altering npm run build. PR Draft / Customer Release HOLD.",
  moduleIds:Object.freeze(["bid.budget.bom.mr0004","bid.budget.working.bc","bid.budget.working.bc.b10","bid.budget.working.bc.b11","bid.budget.working.bc.b13","bid.budget.working.bc.c1"]),
  priceImpact:"NO_PRICE_CHANGE",source:"User Windows 2026-10-22 spare-engineering AssertionError 75059 !== 75000 / MGW P26-058_R2 RACON-1 / MDS-ORGA QTORG2609244 / existing current canonical B/C"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-11",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"Fix B2 Independent First-Principles No-Backsolve Test Comment False Positive",
  detail:"The Windows npm build B2 independent recalculation check failed because modelSrc.includes('580,000') matched ONLY the source comment stating that the legacy Rev05 THB580000 SELL is not an input. Test now excludes comment-only lines before checking quoted-price numerical literals in executable model code, asserts hasQuotedWorkingSellReference false and verifies changing employer load changes the independent scenario SELL. B2 131 WO, original 143 VDRL rows, selected B2 Working SELL THB237121.13, historical quote reference THB580000, actual Direct Cost NULL and Customer Release HOLD unchanged. No code path repriced or user-facing price changed.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b2.independent-recalculation","bid.budget.working.bc.b2.price-overview","bid.budget.working.bc.b2"]),
  priceImpact:"NO_PRICE_CHANGE",source:"2026-10-22 Windows Node.js 24.21.0 validate-0553-b2-independent-recalculation.cjs line72 AssertionError"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-10",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"B2 Rev05 Original Price Evidence Nested SSR Ownership Test Repair",
  detail:"The original B2 Rev05 price comparison is present under BcOwnerPriceTrace0553.jsx > the quote-comparison details, with B2WorkingPriceOverview0553 mounted exactly once, but validate-0553-b2-original-price-evidence.cjs line80 still asserted an obsolete direct inline code===B2 mount. Test now checks the actual nested B2 quote-comparison wrapper, unchanged module anchor, exactly one owner-local mount, one SSR B2 price-overview anchor, and no second BcCostEvidenceDetail mount. Source MH, 580000 historical SELL, 237121.13 current B2 Working SELL, Direct Cost null and release HOLD are unchanged.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b2.price-overview","bid.budget.working.bc.b2.quote-comparison","bid.budget.working.bc.b2.price-trace"]),
  priceImpact:"NO_PRICE_CHANGE",source:"User Windows Node.js 24.21.0 AssertionError at validate-0553-b2-original-price-evidence.cjs line80"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-09",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"B2 Original Price Evidence SSR — Rev00a 964.279 MH Rendering vs Full Source MH",
  detail:"User Windows Node.js 24.21 build failed validate-0553-b2-original-price-evidence.cjs on stale literal 964.278. Rev00a source five roles sum 964.2785625 MH (JS floating-point result may be 964.2785624999999), while B2WorkingPriceOverview0553.jsx renders total.toFixed(3) = 964.279 MH and separately two-decimal 964.28 MH. Fix test to assert source with tolerance, derive rendered expected MH from exact source and verify both Host and Standalone. B2 selected THB237121.13, Rev05 historical 580000, 20k historical gap and Direct Cost null unchanged. No reprice; Release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b2.price-overview","bid.budget.working.bc.b2.price-trace","bid.budget.working.bc.b2"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Windows npm build error validate-0553-b2-original-price-evidence.cjs:57 / Rev00a actual source 5-role MH"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-08",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"B1 SSR order test scoped to actual returned JSX, not B9 ownerPriceTrace pre-render",
  detail:"The first p55-metric-grid found after BcCostEvidenceDetail function declaration actually belongs to B9 ownerPriceTrace JSX initialized BEFORE the main JSX return. Thus even after updating expected B1 order, scanning from function declaration gives false ordering. Regression now starts at the exact BcCostEvidenceDetail returned section: B1 Quick Price → B1 Rev.K Accordion → generic evidence metric grid, plus SSR data-component-key order. No UI, working cost, working sell, contract label or customer release mutation. User B1 accordion has PASS; full build remains unverified.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b1.price-overview","bid.budget.working.bc.b1.revk-pm-milestones"]),
  priceImpact:"NO_PRICE_CHANGE",source:"2026-10-22 Windows npm build B1 visible-price-overview line62 / B9 JSX-before-return guard"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-07",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"B1 Visible Price SSR order aligned with post-TDZ accordion layout",
  detail:"Windows npm build validate-0553-b1-visible-price-overview failed outdated expectation detail>generic at line62. After the sharedEvidence TDZ repair, actual B1 JSX order is Quick B1WorkingPriceOverview → detailed B1RevKMilestoneBudget → generic evidence metric grid. Update regression to verify exactly that source order and actual SSR data-component-key placement, while retaining B1.1–B1.8 source/category checks, navigation anchors and B1 Working SELL THB211600, planning THB181400 and conditional THB51700. No UI or price mutation; Customer Release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b1.price-overview","bid.budget.working.bc.b1.revk-pm-milestones","bid.budget.working.bc.b1"]),
  priceImpact:"NO_PRICE_CHANGE",source:"2026-10-22 user Windows Node assert line62 / prior BcCostEvidenceDetail0553.jsx TDZ structural repair"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-06",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"B1 Visible Price Overview SSR Test: HTML-escaped Account Labels",
  detail:"Windows Node v24 Full Build halted in validate-0553-b1-visible-price-overview.cjs:45 at Missing category B1.1. Source contains all eight B1.1–B1.8 accounts, but React server HTML escapes '&' in account labels to '&amp;'. Update the regression to compare escaped <strong> label text for each actual B1 account, preserving module ID/navigation, B1 THB211600 selected Working SELL, THB181400 support planning cost and THB51700 conditional excluded. No source/account/price/UI mutation; Release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b1","bid.budget.working.bc.b1.price-overview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"2026-10-22 user Windows npm build B1 visible price overview AssertionError / B1 source account labels"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-05",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"B2 Working Price Overview React SSR defaultOpen Warning Fix",
  detail:"Windows Node v24.21.0 reports B1 SSR PASS and B2/B9 owner-price-trace PASS, but React development warns B2WorkingPriceOverview0553.jsx native details.defaultOpen unsupported. Replace BOTH role-cost-build and new-doc-build details with React-supported open, keep initial expansion unchanged, and add SSR/source guard in validate-0553-b2-b9-owner-price-trace.cjs. Historical Rev05 rates, selected B2/B9 Working SELL, release finance, native source and direct costs unchanged; Release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b2","bid.budget.working.bc.b2.price-overview","bid.budget.working.bc.b2.price-trace"]),
  priceImpact:"NO_PRICE_CHANGE",source:"2026-10-22 user Node B2 SSR warning, B2WorkingPriceOverview0553.jsx line 35"
 }),
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
