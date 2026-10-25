// PJ2608-0553 — curated change notes ONLY. This file does not price anything.
// Update RELEASE_NOTES_0553 on each meaningful UI/data/pricing code change.
// An automatically embedded build Git SHA separately detects an unseen Pull.
// Do not claim a source-price change unless a canonical owner was actually updated.
export const CHANGE_LOG_VERSION_0553="2026-10-25-R54";
export const RELEASE_NOTES_0553=Object.freeze([
 Object.freeze({
  id:"P553-CHANGE-20261025-08",date:"2026-10-25",kind:"PRICING_REVIEW",tone:"caution",
  title:"Expose NEW B10 researched price vs unchanged 10.2 selected and 10.3 Release; no false repricing for B11/B13/C1/C2",
  detail:"Owner challenged unchanged B10/B11/B13/C1/C2 financial totals after lifecycle UI update. Cause: canonical Working price owner still uses 2026-10-23 parametric MR envelopes. Latest NextG sourced B10 Price-to-Win is 568083.85 THB scenario / 18100 USD equivalent, but only a nonposting What-if with 100% MR1 envelope credit and unapproved vendor offered quantities. New read-only five-category price comparison now appears in Internal Working and Internal Release (prominent B10 heading), separately from selected B10 THB509827.50, B11 THB157657.50, B13 THB46683; C1 FCA installed equipment comparator THB3071250 is NOT an independent capital spare quote; C2 no new supplier cost. No source ledger/official/native posting, no claim of newly issued price or approved physical SKU. New proposals require OEM SPIR, qty, exact spare price, supplier validity, stock owner and approval before selecting a price.",
  moduleIds:Object.freeze(["bid.budget.working.bc.spare-lifecycle-control","bid.budget.working.bc.b10.price-to-win-review","bid.budget.pricing.release.preview.spare-lifecycle"]),
  priceImpact:"NO_SELECTED_PRICE_CHANGE__NEW_NONPOSTING_PROPOSAL_VISIBLE",source:"Owner question 25-Oct: why unchanged legacy selected Working & Release instead of reworked budgetary prices"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261025-07",date:"2026-10-25",kind:"UI",tone:"navigation",
  title:"B10 / B11 / B13 / C1 / C2 — bidirectional Release→Source→Release and cross-category lifecycle",
  detail:"One nonposting, source-owned five-category spare lifecycle registry checks all 16 financial Working rows against 10.3.3 Release and native cell IDs. Adds collapsed trace/requirement/overlap reviewer to Working and internal Release, exact Return-to-10.3.3 row action on Working after Release source lookup, and category-level return when no exact row was selected. Seven controls cover B10/A installed, B10/C1 capital, B10/C2 2-year stock, B11/A licences, B11/B3 contractor test equipment, B13/B5 packing and B13/A5 bulk. Minimum requirements linked to MR Attachments 5/7, SPE, EXA-A8 and OEM. No new SKU/Qty/USD price or posting, no changes to B10 THB509827.50, B11 THB157657.50, B13 THB46683, C1/C2 unquoted, Official USD or native Excel. Build regression blocks incorrect source row mapping; customer release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.spare-lifecycle-control","bid.budget.pricing.release.preview.spare-lifecycle","bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner request: cross-category integration and exact Release to Source to Release"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261025-06",date:"2026-10-25",kind:"ENGINEERING",tone:"neutral",
  title:"B10 ODU/IDU/Cisco and all four telecom MR equipment composition → OEM SPIR coverage",
  detail:"New read-only original item/source physical composition for B10: actual NextG SCADA ODU Base/Remote quote lines, source-only IDU functional requirement, VST Cisco IE3400+PoE PSU+licence, MGW RFI BDA and included RF surge, EXION Ex phone/sounder, MDS RACON, and 14 original MR commissioning spare article functions. Visible below 4 financial kit rows in Budgetary/10.5/10.3.3/10.3.4. Explicitly distinguishes quoted Part A installed Qty and unit reference from unconfirmed B10 spare purchase Qty/rate; 4/3/4/3 MR kits remain B10 THB509827.50 / Official USD16200. Uses same parent sourceId/traceId for Release→Source→Release; document authority MR §5/Attachments 2,5,7, SPE §8.1, BOD §11.1. OEM-approved SPIR and original native XLSX 13-row itemization remain release HOLD. No double count.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b10.physical-composition","bid.budget.pricing.release.preview.annex.b10.kit-summary","bid.budget.pricing.official.b10.kit-summary"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner 25-Oct: show what B10 consists of — ODU, IDU, Cisco L3 and vendor SKUs, based on BOD/MR/DTS/SPE and native Excel"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261025-05",date:"2026-10-25",kind:"UI",tone:"neutral",
  title:"10.5 historical spare reference THB display / source-currency separation",
  detail:"Fix validate:0553-scope-bc-price-audit assertion 115: additional Rev08 item-candidate audit inadvertently displayed raw USD unit/extended prices in 10.5. These columns now use explicit historical THB conversion at the selected FX; if FX is absent no price is inferred. The original USD remains available as a 10.2 Working-only reference; source quote comparables stay in Working. B10 source→Budgetary→Scope→Release→Official and reverse IDs, THB509827.50 B10, USD16200 Official and all cost owners are unchanged. Targeted regression now checks THB columns and 10.2-only source currency.",
  moduleIds:Object.freeze(["bid.budget.scope","bid.budget.working.bc.b10","bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner validation console 25-Oct: Scope BC price audit failed line 115 on raw historical USD table cells"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261025-04",date:"2026-10-25",kind:"UI",tone:"navigation",
  title:"B10 Budgetary/Release/Official — four-kit commercial-only view, Source→Release→Source retained",
  detail:"Removed engineering SKU/evidence/Price-to-Win module panels from Budgetary B10, Scope B10, 10.3.3 B10 and 10.3.4 B10 customer-facing view; now shows compact source-controlled 4 MR kit price summary 4/3/4/3. Row sourceIds and sourceRowModuleIds remain unchanged and Internal 10.3.3 & Scope/Budgetary Source buttons navigate to canonical 10.2; Working keeps full SKU/TAG/vendor-cost review. Official DTO and native original six-sheet XLSX unchanged. THB509827.50 and Official USD16200 are unchanged. Responsive width constrained to container with internal scrolling under 720px. No double posting and final customer issue HOLD.",
  moduleIds:Object.freeze(["bid.budget.pricing.budgetary","bid.budget.scope.b10","bid.budget.pricing.release.preview","bid.budget.pricing.official"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner25-Oct screenshot: B10 release modules duplicative/overflow; preserve Source→Release→Source"
 }),

 Object.freeze({
  id:"P553-CHANGE-20261025-03",date:"2026-10-25",kind:"UI",tone:"navigation",
  title:"B10 10.3.3 Original Item / Source → SKU before MR Kit summary",
  detail:"10.3.3 B10 Annex now shows a prominent Original Item / Source → quoted Part No. → candidate installed TAG → offered Qty vs approved purchase Qty → vendor USD reference vs nonposting review SELL table ahead of four MR financial-kit rows. Both Customer/Internal preview modes show the item identification; only Internal shows supplier costs and scenario SELL. Huge related-TAG lists are capped with internal scrolling. The original 4/3/4/3 KIT financial lines and THB509827.50, Official USD16200, embedded native Excel, 16 existing financial annex trace IDs and approval gates remain untouched. Supplier quote expiry, unconfirmed spare quantity and Part A/B11/C1/C2 duplicate boundaries are explicit.",
  moduleIds:Object.freeze(["bid.budget.pricing.release.preview","bid.budget.pricing.release.preview.annex.b10.original-item-source","bid.budget.working.bc.b10.itemized-purchasing-evidence"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner screenshot25-Oct: B10 kit-level instead of SKU and rename evidence Original Item / Source"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261025-02",date:"2026-10-25",kind:"ENGINEERING",tone:"pricing",
  title:"B10 Price-to-Win what-if 30–50% and supplier market evidence",
  detail:"New nonposting B10 price-to-win scenario uses NextG expired D/E accessories priced line-by-line, replaces rather than adds historical MR0001 engineering cost USD5600, and retains clearly unitemized MR0002/3/4 cost envelopes USD6850. Default excludes US power cords and whole capital radios and gives optimistic 100% MR1 old-allowance credit (may omit other spares). Uncertain source overlap sensitivity 50% credit gives THB691563.85/USD22000, 0% gross coverage stress gives THB815043.85/USD25900 (may double count); none posts. 5% cost risk and 5% SAMTEL selling deduction with 20% target profit produces multiplier1.40; indicative source USD12881.72, Working-equivalent THB568083.85, USD100-rounded 10.3.4 equivalent USD18100. Source→10.2→10.5→Internal10.3.3 only. Actual B10 Working THB509827.50 and USD16200 Official, known A+B and native customer XLSX are unchanged; no quote issued. Published PolyPhaser/Hawke/Eaton prices are flagged nonposting comparables.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b10","bid.budget.working.bc.b10.price-to-win-review","bid.budget.scope.b10","bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner25-Oct: test retail O&G bid markup and answer missing prices from evidence before approving B10 quote"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261025-01",date:"2026-10-25",kind:"ENGINEERING",tone:"neutral",
  title:"B10 deep spare part and supplier quote itemization — nonposting audit",
  detail:"MR0001–0004 4/3/4/3 commissioning-kit financial envelopes retained. B10 now separates 14 source-derived physical article families (unapproved Part No./physical Qty/cost) from 16 NextG Rev16Sep2026 separately quoted D/E SKU offer rows (14 priced, two dashed), with related installed site/TAG candidates and matched base A/B/C quote SKU links. Six accessory candidates, two major radio assemblies and eight software/licence/warranty lines are separated; physical stock and B10/C1/C2 ownership require approval. Working B10 THB509827.50, Known B THB4994787.13, Official USD B10 16200, native 6-sheet customer workbook unchanged; candidate prices never posted or exported to customer. Final release remains HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b10","bid.budget.working.bc.b10.itemized-purchasing-evidence","bid.budget.scope.b10","bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner25-Oct: B10 purchasable SKU/TAG/Quantity/Unit Price source audit; NextG 16-Sep-2026 D/E separately quoted spares"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-15",date:"2026-10-24",kind:"UI",tone:"navigation",
  title:"10.3.4 Official Release — English / USD",
  detail:"Customer-only view from 10.3.3; quotation FX31.5, round up each priced summary item to USD100. Annex allocations reconcile. English native-template Excel with no internal notes; missing prices stay to be quoted. Working THB and issue status unchanged.",
  moduleIds:Object.freeze(["bid.budget.pricing.official","bid.budget.pricing.release.preview"]),
  priceImpact:"QUOTATION_FX_ROUNDING_ONLY",source:"Owner24-Oct: English official USD release and native Excel export"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-14",date:"2026-10-24",kind:"UI",tone:"navigation",
  title:"Release แสดงยอด A+B เฉพาะรายการที่มีราคา",
  detail:"แสดงยอดรวมจาก Source เดิมทั้ง Customer/Internal Preview และ Native Excel G38 พร้อมระบุรายการยังไม่มีราคา ยอดราคาไม่เปลี่ยน Final Release ยัง HOLD.",
  moduleIds:Object.freeze(["bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner24-Oct: show available quotation total"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-13",date:"2026-10-24",kind:"PRICE",tone:"pricing",
  title:"B1–B14 activities + Thailand / CIF / Myanmar operations",
  detail:"Owner-selected cost250000: B6 import30000/export20000 and B1 Myanmar200000. Remove B1 filing7200; supersede old conditional47000 without base credit. Official fee25000 has no uplift; services/reserves factor1.10. B1 cost374200/SELL421180. B6 import SELL12000 replaced33000; old mixed export25000 newly split service15000/physical10000, service replaced22000; B6 SELL335584. B1 two groups and all14 activity owners flow to Release/native. KnownB4994787.13; unpriced items/approvals remain open. Draft only.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b1","bid.budget.working.bc.b6","bid.budget.pricing.release.preview"]),
  priceImpact:"WORKING_SOURCE_CHANGED",source:"Owner24-Oct: approve operation estimate and B1–B14 activities"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-12",date:"2026-10-24",kind:"UI",tone:"navigation",
  title:"Release Excel export: ฟอนต์และช่องพอดีกับข้อความ",
  detail:"แก้ตัวส่งออก Native XLSX จริง: เนื้อหา Arial 10 pt, Wrap Text, คงขนาดคอลัมน์/กระดาษ/merged ตามต้นฉบับ และความสูงแถวตามข้อความ. คง 6 sheets, สูตร, ข้อมูล, border/fill และราคา; ปรับเฉพาะรูปแบบในสำเนาที่ส่งออก ไฟล์ต้นฉบับไม่เปลี่ยน. ปุ่ม Export Excel ใช้ template ต้นฉบับที่ฝังในระบบ กดแล้วดาวน์โหลดได้เลย ไม่ต้องเลือกไฟล์.",
  moduleIds:Object.freeze(["bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner24-Oct: exported Release Excel text overflows cells; check and fix font/column/row formatting"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-11",date:"2026-10-24",kind:"UI",tone:"navigation",
  title:"Release Main Specification แสดงชื่อ Locations",
  detail:"ช่อง Main Specification ของ A1–A4 แสดงชื่อ Location ไม่ซ้ำจาก sourceRows ของแต่ละ MR แทนจำนวน TAG/sites; ใช้ทั้ง Customer และ Internal. รายละเอียด TAG ยังเปิดดูได้ตามเดิม ตัวเลขและ source model ไม่เปลี่ยน.",
  moduleIds:Object.freeze(["bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner24-Oct: show actual locations such as ZPQ/ZWP20 in Main Specification"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-10",date:"2026-10-24",kind:"UI",tone:"navigation",
  title:"Release B3/B9: ข้อความสั้นในเซลล์คำอธิบายเดิม",
  detail:"ย่อวันทำงาน Day / OT / Standby เหลือข้อความ 5 บรรทัดในช่องคำอธิบาย B3/B9 เดิม ไม่มีแถวเพิ่มหรือกรอบใหญ่; รายละเอียดตรวจสอบอยู่ Working ตามเดิม. ใช้ฐานวันและอัตราล่าสุดจากต้นทาง ไม่ใช้ 18/45 วันจาก CCL เก่าที่ส่งมาเป็นตัวอย่างรูปแบบ. ราคาและ native XLSX ไม่เปลี่ยน.",
  moduleIds:Object.freeze(["bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner24-Oct: short text in the same Excel-style cell, not a separate service panel"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-09",date:"2026-10-24",kind:"UI",tone:"navigation",
  title:"หน้าพอดีจอ + Release Day / OT / Standby เป็นข้อความ",
  detail:"แก้กรอบ grid ที่ขยายตามตารางด้านใน; ตาราง BOM และ workbook เลื่อนภายในกรอบ ไม่ดันทั้งหน้าเกินจอ. เปลี่ยนรายละเอียด Day / OT / Standby ใต้ B3/B9 เป็นย่อหน้าตามตำแหน่ง พร้อมฐานจำนวนวัน อัตราทีม และข้อกำหนดเดิม แทนตารางซ้อน. คงสีเจ้าของงบและป้าย DRAFT/PROPOSED; ตัวเลข ต้นทาง และ native workbook ไม่เปลี่ยน.",
  moduleIds:Object.freeze(["bid.budget.bom.system-location-mto","bid.budget.pricing.release.preview"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner24-Oct screenshots: page wider than screen; show service terms as text like the actual document"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-08",date:"2026-10-24",kind:"UI",tone:"navigation",
  title:"สีต่อเนื่องถึงตารางชั้นใน + จัด Yard onshore group.06 ไว้กับ B9",
  detail:"ใช้สีเจ้าของงบ A/B/C และกลุ่มงานต่อเนื่องถึงหัวตาราง แถว และยอดรวม; ข้อกำหนดที่ไม่ลงราคาใช้เทาประ. ย้ายการแสดง group.06 พร้อม 14 Yard test rows ไปอยู่ B9 onshore และเก็บจุดเชื่อมจาก B3; Module IDs เดิมค้นหาได้และเปิด B9. งบ B9 480550 กับ B3 2322450 คงเดิม; ยังไม่ปิดประเด็นขอบเขตแรงงาน B3 SAT28 กับ B9 จนกว่าจะเทียบกิจกรรม/วัน/RACI. เพิ่มฐาน B9 7+2 วัน และ B3 SAT28 วัน พร้อม day rate จากต้นทาง; offshore OT เกิน12ชั่วโมง ข้อเสนอ OT1.5×/Standby100% ยังไม่เลือกใช้. Release/Scope รับคำอธิบายจากต้นทางเดียวกัน และแสดงตาราง Day/OT/Standby เปิดทันทีใน Release พร้อมป้าย DRAFT/PROPOSED ไม่ใช่เงื่อนไขที่ตกลง; OT onshore รอชั่วโมงปกติ. ยอดราคาและ native workbook คงเดิม.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.resource-price-dossier.group.06","bid.budget.working.bc.b9.price-trace.work-scope","bid.budget.working.bc"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner24-Oct: extend colours into every nested table; move incorrectly grouped work; Yard is onshore"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-07",date:"2026-10-24",kind:"UI",tone:"navigation",
  title:"B3 สีเดียวกันตลอดกลุ่ม พร้อมป้ายยอดรวม / รายละเอียดงาน / สถานที่",
  detail:"หัวข้อย่อยและสถานที่ใช้สีของกลุ่มแม่ทั้ง FAT, Survey, SAT/Commissioning และ Tools แทนสีฟ้าเริ่มต้นที่ทำให้เข้าใจว่าเป็นคนละกลุ่ม; เพิ่มป้ายระดับและชื่อกลุ่มต้นทาง พร้อมอธิบายว่ายอดด้านในแจกแจงยอดหัวกลุ่ม ไม่บวกซ้ำ. Module IDs, Source → Working → Budget/Scope → Release และราคา A/B/C คงเดิม.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.resource-price-dossier","bid.budget.working.bc.b3.resource-price-dossier.rollup.sat-commissioning"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner screenshot24-Oct: mismatched parent/child colours obscure the same work group"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-06",date:"2026-10-24",kind:"PRICE",tone:"neutral",
  title:"Owner duration: FAT2+1 / Training1+1; reserve days included once",
  detail:"Owner confirms +1 means reserve. FAT2 actual days81900 +1 reserve40950 replaces6-day crew245700; standalone closeout day merged into FAT2+1. Existing4 preparation days retained. Shared facility/transport window9 days, FAT meals3 days; no repeated reserve meal or closeout charge. Local B3 execution452850; full B3 2322450. B8 remains142550:1 teaching +1 reserve day, OEM online base8h +reserve8h, no duplicate trainer day. Combined local FAT/training595400 (-240150); known Part B4757207.13. Twelve FAT requirement IDs remain; earlier48h estimate split32h preparation +16h formal timebox, actual ITP/TAG repetition open. A/B9/spares/C and packing/CIF unchanged; source-derived Scope/Release/native only.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.resource-price-dossier.group.02.site.01","bid.budget.working.bc.b8.hybrid-training"]),
  priceImpact:"WORKING_SOURCE_CHANGED",source:"Owner correction24-Oct FAT2+1 Training1+1; explicitly confirmed reserve days"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-05",date:"2026-10-24",kind:"UI",tone:"neutral",
  title:"B8 Base confirmed by owner: OEM ONLINE + ADDVALUE onsite at SAMTEL",
  detail:"Owner selects OEM online as the base proposal method. B8 remains142550; onsite OEM615350 stays internal/nonposting and is not C1/C2. Source decision and proposal wording distinguish owner selection from customer acceptance and vendor fee confirmation. No A/B/C price change; all downstream totals unchanged.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b8.hybrid-training","bid.budget.working.bc.b8"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner 24-Oct: กำหนดไปเลย ผมจะเอา OEM online เป็นหลัก"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-04",date:"2026-10-24",kind:"PRICE",tone:"neutral",
  title:"SAMTEL lump sum: preparation, FAT, hosting, shared tools, training and CIF export allocation",
  detail:"Current local B3 execution allowance693000: 4 prep +6 FAT +1 closeout +1 retest, shared14-day facility/transport, tools, meals and OEM remote FAT support. Total B3 2562600 (+429300). B8 142550 (-9000): demo20000 transferred to B3, catering11000 added; six products/16h, prior content-prep day and separate D5–6 training. OEM onsite alternative615350 nonposting. B5 311184/B6 307584 retain existing envelopes with internal activity allocations, including SAMTEL dispatch/export25000; freight/tax/insurance adequacy not verified. A/B9/spares unchanged. Known Part B4997357.13, net change+420300; source flows to Scope/Release/native draft, no MGW service, no second travel credit. Historical5/7-day comparisons frozen to prior baseline; not current execution plans.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.resource-price-dossier.group.02.site.01","bid.budget.working.bc.b8.hybrid-training","bid.budget.working.bc.b6.price-trace.work-scope"]),
  priceImpact:"WORKING_SOURCE_CHANGED",source:"Owner 24-Oct full lump-sum execution scope; internal estimator assumptions explicitly unquoted"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-03",date:"2026-10-24",kind:"PRICE",tone:"neutral",
  title:"MGW supplies MR0002 equipment only — remove all B3 FAT services/reserve",
  detail:"Owner correction: no MGW integration, iFAT, facility or service reserve. Withdraw THB307125 from the existing B3 source, with no replacement allowance. Active supplier service rows removed; old Module ID returns a withdrawn nonposting notice. Local ADDVALUE FAT remains THB263700 (245700 labour +8000 local transfers +10000 work insurance); B3 THB2133300, Part B THB4577057.13. MR0002 equipment and all other A/B/C owners unchanged. Release/Scope/native values derive from source. Supplier20% deduction removed with its service base; ordinary B5% applies once. Warehouse/tool expenses remain unknown, not assumed free. Prior R33 reserve selection superseded.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.resource-price-dossier.group.01.site.01","bid.budget.working.bc.b3","bid.budget.pricing.release"]),
  priceImpact:"WORKING_SOURCE_CHANGED",source:"Owner 24-Oct: MGW เค้าแค่ supply ของ"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-02",date:"2026-10-24",kind:"PRICE",tone:"neutral",
  title:"Source pricing: EXION + MDS, SAMTEL Warehouse FAT/Training, CIF Zhuhai",
  detail:"A3 EXION phone/sounder THB828000; JB/glands remain unpriced. A4 MDS one quoted USD75000 system extrapolated to 3 required sites USD225000. A known SELL +THB20831.85. B3 removes only five foreign FAT travel rows THB158900; local labour THB245700, transfers8000, work cover10000 and integration/facility reserve307125 remain. Reserve is not selected MGW purchase or confirmed credit. B3 THB2440425; known B THB4884182.13. B8 training151550 receives no second travel deduction; B9 and offshore remain. B6 CIF eight-leg route has unknown cost adequacy; packing/storage allowances retained. All downstream views derive from source; C optional/unquoted; release HOLD. DB/manual-input work deferred. Original numbered requirements 1–8 not reconstructed.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3","bid.budget.working.bc.b6","bid.budget.pricing.release"]),
  priceImpact:"WORKING_SOURCE_CHANGED",source:"24-Oct owner handoff; EXION1260576R0; MDS QTORG2609244; CCL item12; COM-D02; Contract18.1(c)"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261024-01",date:"2026-10-24",kind:"UI",tone:"neutral",
  title:"10.1 Cost integrity: Color-coded Hierarchical Nested Accordion",
  detail:"Cost integrity now starts collapsed with its existing Module ID visible. Expand All / Collapse All and independent +/− controls reveal three color-coded table-first groups: verification gates, MR quote coverage, and vendor quote register. Each group exposes Copy ID and its evidence count or source status when collapsed. Tables retain all original fields and currencies with horizontal scrolling. Colors identify categories, not approval.",
  moduleIds:Object.freeze(["bid.budget.integrity","bid.budget.integrity.steps","bid.budget.integrity.mr-coverage","bid.budget.integrity.vendor-register"]),
  priceImpact:"NO_PRICE_CHANGE",
  source:"Owner UI request 2026-10-24; Controlled Module Disclosure & Identity Contract Rev01; existing costIntegrity0553 evidence"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-19",date:"2026-10-22",kind:"PRICE",tone:"neutral",
  title:"B3 Working Budget Selected SAT 28 Days + BF Site Survey 3+2, Not Historical 40 Days",
  detail:"Project Owner directs B3 current Working SELL to use SAT/SIT 28 productive two-person team-days (56 MD) at existing pre-award USD800/person-day and THB31.50/USD = THB1411200; plus separate BF Site Survey ZPQ/ZWP8/ZWP11 one team-day each (6 MD), and survey MOB/DEMOB two team-days (4 MD), total BF 5 team-days /10 MD / THB252000. SAT extra 2 risk team-days and additional 2 management-reserve team-days are NOT added to selected Working SELL. MGW purchased iFAT+facility THB307125, ADDVALUE FAT witness/travel THB397400, and VeEX rental THB30000 remain unchanged. Canonical WS-B3 changes from old THB2750525 to NEW THB2397725; Part B Base from THB4385436.82 to THB4032636.82. 10.3 Budget/Release Preview and 10.5 Scope read that selected B3 amount only once; Customer Release remains HOLD and Actual Direct Cost null. Previous 40 team-days /80 MD remain source-priced historical audit ONLY. B3 Resource Price Dossier now expands SAT28, BF Survey5, FAT and Vendor Quote source into individual role x people x days x rate rows. Visible MGW source quotation sum THB236250 is NOT extra SELL and purchase is not yet paid Actual Cost. BF revisit price is selected budget allowance only; physical revisit requires JUTAL written instruction and review of previous BOD section 8 survey evidence. GF Yard SAT / offshore commissioning still have unverified ADDVALUE RACI/person-days; no double posting into B9 or Part A.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.resource-price-dossier","bid.budget.working.bc.b3.40-day-abc","bid.budget.working.bc.b3.site-survey-price","bid.budget.pricing.release"]),
  priceImpact:"WORKING_SOURCE_CHANGED",
  source:"Owner decision 2026-10-22 SAT28 and BF3+travel2; BOD C2 section 8; SPE C2 sections 7.3.2/7.3.3; selected 10.2 b3SelectedSatSurveyPrice0553 and MGW P26-058_R2"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-18",date:"2026-10-22",kind:"UI",tone:"neutral",
  title:"B3 B2-style Detailed Resource Price Dossier: People × Days × Rate × Cost/SELL",
  detail:"Owner requested the same drilldown level as 10.2 b2.independent-recalculation.dossier.project-dossier.mr.mr-0001 for B3: Work Type → Site → itemized Qty/crew/working days, USD/THB rate, source and finance identity. New read-only b3.resource-price-dossier traces 29 selected-priced expense/resource lines plus 14 GF Yard and 14 GF Offshore separate Site/MR Test-ID requirements (not priced) without extra posting: MGW SERV-2/4 2 vendor-quote source lines THB236250 cost-basis ×1.30 = WS THB307125; ADDVALUE China FAT 8 original estimate lines THB397400; retained SAT/SIT 9 original timeboxes x 2 distinct role lines = 18 priced labour lines / 80 person-days × THB25200 SELL per day = THB2016000; VeEX 30 rental-days THB30000. All four combine exactly THB2750525 selected WS-B3, matching 10.3 Budget/Release and 10.5 Scope as ONE B3 1 LS, Customer Release HOLD. Actual payroll/paid Direct Cost remains NOT ESTABLISHED. Separate NONPOSTING site/crew/day task records show conditional BF ZPQ/ZWP8/ZWP11 re-visit illustrative labour THB252000 not posted; GF ZWP20–23 JUTAL Zhuhai Yard SAT and post-install offshore commissioning with ADDVALUE RACI, crew, days, rate and costs unknown; 28+2 combined lean is audit only, 40/80 retained for current SELL only. Full node regression and production Build on user's worktree required; no 10.2 canonical price, 10.3 release, 10.5 customer scope, Rev03 BOM or customer quote mutation.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.resource-price-dossier","bid.budget.working.bc.b3.40-day-abc","bid.budget.working.bc.b3.site-mr-sat-matrix"]),
  priceImpact:"NO_PRICE_CHANGE",
  source:"B2 Independent VDRL Dossier UI pattern; B3 selected WS owner source 40-Day SAT+MGW FAT+ADDVALUE FAT+VeEX; BOD C2 §8, SPE C2 §7.3.2/7.3.3, MGW P26-058_R2"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-17",date:"2026-10-22",kind:"ENGINEERING",tone:"neutral",
  title:"B3 BOD/SPE Correction: BF Conditional Visit, GF Zhuhai Yard SAT and Offshore Commissioning",
  detail:"Source correction to previous R28 B3 site-survey scenario: original MM-ZTK-1F-GEN-TEL-BOD-0001 Rev.C2 section 8 already records site survey findings for brownfield ZPQ, ZWP8 and ZWP11. No new separate 7-site physical visit is established by BOD or SPE. Previous THB453600 survey labour illustration is withdrawn as current planning candidate. Only if additional ADDVALUE brownfield physical checks are explicitly requested, a NONPOSTING 2-person 3 onsite +2 travel team-day THB252000 labour SELL illustration is shown; verified direct cost, approved crew/duration and work order are OPEN. MM-ZTK-1F-GEN-TEL-SPE-0001 Rev.C2 section 7.3.2 specifies Fabrication Yard SAT by CONTRACTOR/VENDOR (JUTAL Zhuhai), while section 7.3.3 requires distinct VENDOR offshore commissioning after installation at new GF ZWP20/21/22/23. No written ADDVALUE RACI or staff/day quantities for Yard/Offshore, so no combined execution-day total may be asserted. Old lean 28+2 team-day/60 MD is a NONPOSTING combined effort comparison only, not apportioned between phases. Previous 40-day/80 MD THB2016000 labour selected basis and total B3 Working SELL THB2750525 remain unchanged; B3/B9 and B2/B11 no double count, Customer Release HOLD. New UI shows stage-by-stage GF/BF workfronts with unknown persons/days instead of inventing numbers; old 28/40 lines are accessible under Audit.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.field-execution-plan","bid.budget.working.bc.b3.site-mr-sat-matrix","bid.budget.working.bc.b3.40-day-abc"]),
  priceImpact:"NO_PRICE_CHANGE",
  source:"BOD Rev.C2 section 8 and 10.4/10.5; SPE Rev.C2 section 7.3.2/7.3.3/7.3.4; owner BF-only survey clarification 2026-10-22"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-16",date:"2026-10-22",kind:"UI",tone:"neutral",
  title:"B3 Site Survey and Latest Offshore SAT 28+2-Day Readable Execution WBS",
  detail:"Owner reported 10.2 b3.site-mr-sat-matrix and b3.40-day-abc still show 40 team-days/80 MD as if current operational plan; seven-site Survey has no displayed price build. New source-linked B3 field-execution-plan uses existing 28 productive two-person SAT team-days (56 MD), pooled 2 risk team-days (4 MD), and 2 management-reserve team-days separately UNPOSTED. Nine site/SIT/PUNCH schedule rows link original 21 SAT Test IDs without duplicate per-MR day/price. Seven survey site visit-days plus two separate team travel-days (2 people x 9 days =18 MD) are a NEW estimator-only 1-day/site assumption; physical visit, cruise/weather/POB, crew days and direct rates NOT VERIFIED. Using original B3 SAT Working SELL reference rate USD800/person-day x FX31.5 gives onsite THB352800 plus transit labour THB100800 = survey illustrative THB453600; it is NOT payroll Direct COST, vendor quote, selected customer price or additive posting. New 28+2 SAT labour scenario THB1512000 and illustrative complete B3 incl Survey, FAT and VeEX THB2700125 are NONPOSTING until owner approves; selected B3 THB2750525 from 40-day/80-MD pricing remains unchanged. UI leads with Thai where/who/days/work and collapses original 40-day prices and 21 individual SAT Test-IDs for audit. 10.2/10.3/10.5 current totals, Rev03 immutable, commercial release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b3.field-execution-plan","bid.budget.working.bc.b3.site-mr-sat-matrix","bid.budget.working.bc.b3.40-day-abc"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner B3 survey and SAT staffing-day correction; source b3LeanSatScenario0553 Rev.K K15–K18 and b3SiteSurveyScope0553 seven locations"
 }),
 Object.freeze({
  id:"P553-CHANGE-20261022-15",date:"2026-10-22",kind:"VALIDATION",tone:"neutral",
  title:"B5–B6–B7 Linked Logistics Actual Route & Price Trace",
  detail:"Owner raised B5 physical packing and B6 freight / B7 storage sources mismatch. New nonposting 10.2 B5/B6/B7 linked ADR-68 breakdown documents Thai Enclosure+Cisco four preassembled sets, NextG 4 IDU/4 ODU/all 5 antennas direct MGW, MR0002–4 OEM to MGW Nantong, MGW FAT and onward JUTAL. Seven B5 packing, six B6 transport and three B7 storage lines show individual Cargo IDs, source equipment Qty vs UNKNOWN physical package Qty, quote/rate evidence and gates. MGW SERV-3 USD500 is THB15750 planning reference and SERV-5 USD2500 is THB78750 planning reference, with possible packing overlap and NO unverified USD500 vendor credit. Earlier Thai packing scenario THB6000–12000 is NONPOSTING once, not verified. Customer requires 3mo free MGW storage still unconfirmed, selected B7 1mo THB30000 remains conditional. JUTAL Nantong claim versus owner-approved Zhuhai named-yard conflict flagged; no silent route change. Rev09 historic B5 THB311184 is still selected 10.2/10.3 but NOT derived route cost. B6 THB307584 and B7 THB30000 selected unchanged; 3-owner THB648768 is selected SELL, not actual Cost. Historical B5 Bangkok FAT equation marked LEGACY; new 16-line Navigator/SSR regression included in build. No code-generated customer release approval or price mutation; PR remains draft and release HOLD.",
  moduleIds:Object.freeze(["bid.budget.working.bc.b5.price-trace.work-scope","bid.budget.working.bc.b6.price-trace.work-scope","bid.budget.working.bc.b7.price-trace.work-scope"]),
  priceImpact:"NO_PRICE_CHANGE",source:"Owner current MR0001 Thai Enclosure/Cisco and NextG direct China, MR0002–4 MGW FAT, ADR68, MGW 20-Oct P26-058_R2 SERV-3/5 and original B5 Rev09 historical source"
 }),
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
