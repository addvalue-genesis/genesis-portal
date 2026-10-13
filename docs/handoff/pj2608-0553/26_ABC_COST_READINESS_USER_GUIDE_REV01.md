# PJ2608-0553 — คู่มืออ่าน A / B / C Cost Readiness (Internal Working) Rev01
วันที่ 13 October 2026 • เป็นคู่มือการอ่านข้อมูล ไม่ใช่การอนุมัติราคา

## เข้าใช้งาน
10 Budgetary → Working Preview → MR-0001 → เลือก All Locations (หรือ WP) → `PJ2608-0553 / bid.budget.bom.system-location-mto`.
ในหน้าสรุปจะเห็น A / B / C / A+B+C และกางหัวข้อ
`PJ2608-0553 / bid.budget.bom.system-location-mto.abc-readiness`.

## 37 / 55 หมายถึงอะไร?
โค้ด `SimpleBom0553.jsx` ใช้ `vendorCovered(x)`: พบราคาจาก Next G, Vendor Candidate หรือ Cisco Budgetary Source หรือไม่
- 37 = TAG ที่มีหลักฐานราคา/Price Candidate ตรงกับกติกาการค้นหา
- 18 = TAG ที่ยังไม่พบ Price Evidence ตามกติกานั้น (**ไม่ใช่ 18 รายการไม่ผ่านอนุมัติ**)
- ตัวเลขนี้ไม่ใช่ผล OEM Technical Compliance, Required SKU Approval หรือ TAG Cost Coverage. Working Budget จากหลักฐานแหล่งอื่นอาจมีแล้วแม้ยังไม่ Match Vendor Source ตามกติกา Price Evidence.
- กด `.abc-readiness.price-evidence-gaps` เพื่อดู TAG, MTO Row, ID, Working Cost Booked หรือยัง และสิ่งที่ต้องเช็กต่อ.

## วิธีอ่าน Summary แบบไม่ปนต้นทุนกับราคาขาย
| Part | ระบบแสดงอะไร | สถานะปัจจุบัน |
|---|---|---|
| A | Working **cost** จาก MR-0001 TAG Ledger ทั้ง 7 Locations ตามต้นฉบับ USD + THB; แสดง THB ได้เฉพาะกรณี FX เป็นตัวเลข | ราคาใน Ledger เป็นเพียง budgetary working allocation; ไม่ใช่ Final Part A ของ MR0001–MR0004 |
| B | Internal **cost** = ยังไม่สร้าง cost allocation ที่ตรวจได้; B1–B14 จาก Rev05 Project-Wide WBS มี **Working Sell** B1/B2/B3/B8/B9 รวม THB 3,804,160 แยกในหมายเหตุ | ห้ามนำ **SELL ของ B** ไปบวกกับ **COST ของ A** |
| C | Internal cost และ Current Working Sell ยังไม่มี OEM Qty × Unit Rate ที่เชื่อถือได้สำหรับ C1/C2 spares options | แสดง PENDING, ไม่ใช่ 0 |
| A+B+C | **Full Project Cost ยังไม่สามารถยืนยันได้**; แสดงเฉพาะ A Working Allocation ที่มีเป็น Known Portion เพื่อให้เห็นความคืบหน้า | ต้องตรวจ Part A ของ MR0002–0004, B internal cost, C spare prices, gaps, FX, scope owners และ release gate |

ค่า FX 31.5 THB/USD จาก Working UI เป็น `INTERNAL PLANNING ASSUMPTION — UNVERIFIED`, ไม่ใช่อัตรา BOT ที่ผ่านการตรวจสอบ
ยอด A ที่แสดงเป็น THB จึงต้องเก็บ USD/THB ต้นฉบับ และระบุ Source/Date ของ FX เมื่อจะออกราคา

## งานที่จะต้องทำต่อ (ไม่ข้าม Engineering Steps 1–8)
- **Part A:** เปิด `.abc-readiness.part-a-gaps` ตรวจรายการ MTO/Location ว่ายังไม่มี posted cost ใด แล้วตรวจ MR/BLD/RPT/CAL/STD → Physical Function → SKU/Qty → Vendor Quotation/Validity → Unique Cost Owner และ Ex/License/Regulatory Evidence. ครอบคลุม MR0002–MR0004 แยกต่างหากด้วย
- **Part B:** เปิด `.abc-readiness.part-b-wbs` จะเห็น B1–B14 ตาม Rev05 WBS พร้อม Source Driver, Owner, Working Sell และต้นทุนที่ยังไม่จัดสรร ต้องสร้าง Cost จาก MH/MD, ทีมงาน, Travel, Freight, Vendor Services, FAT/SAT/Commissioning ตามหลักฐานจริง แล้ว Reconcile เข้ากับ CBS ที่ลูกค้ากำหนด
- **Part C:** เปิด `.abc-readiness.part-c-spares` ขอรายการสแปร์จาก OEM, Qty/Installation Base, Price/Quote และ Scope Included/Option ก่อนสรุป C1/C2.
- **A+B+C:** เมื่อ Cost Owners ไม่ซ้ำ, Currency/FX ตรวจสอบได้, B/C ledger มี Cost จริง และทั้ง 4 MR มี coverage เพียงพอ จึงค่อยคำนวณ Total พร้อม Risk/Markup โดยแยก Cost กับ Sell

### ข้อควรระวังเรื่องเลขหมวด B
ต้นทาง `PART_BC_WBS_SOURCE_0553` (Rev05) มี B4 = Painting, B5 = Packing, B6 = Transport/Customs, B7 = Storage, B8 = Training, B9 = Yard Specialist. แต่ `lifecycleSpareScope0553.js` เป็น working lifecycle crosswalk ซึ่ง B4 = Commissioning, B5 = Startup Spares และ C2 = Capital Spares.
**ห้ามนำ B4/B5/C2 ของสอง Source นี้ไปรวมรายการแบบหนึ่งต่อหนึ่งจนกว่าจะมี CBS Crosswalk ตรวจสอบกับ RFQ / Template**. Summary ระดับ Part A/B/C จึงแยก Source Basis และไม่อ้างว่าราคาถูกจัดหมวดต้นทุนเสร็จแล้ว

## Architecture / Data Lineage
- `data/abcWorkingReadiness0553.js` = Read-only aggregator ใช้ `summarizeMR0001TagCost0553` และ `derivePartBcWorkingWbs0553` เท่านั้น
- `AbcCostReadiness0553.jsx` = UI ของ `.system-location-mto.abc-readiness`; มี Module ID และกาง/หุบ
- `SimpleBom0553.jsx` = MTO Price Evidence Coverage และ TAG location filters ใช้ Source Registry เดิม
- `scripts/validate-0553-abc-readiness.cjs` = ตรวจ 7 Source Ledgers, 14 B lines, 2 C lines, B Sell 3,804,160 แยกจาก Cost, Currency Guard, ไม่สร้าง Final A+B+C และไม่เปลี่ยน Ledger
- ห้ามสร้าง SQL/JSON Cost Ledger ใหม่เพื่อคัดลอกตัวเลขจากระบบนี้ และห้ามเปลี่ยน Partial เป็น Customer Approved จากการมีราคา Candidate เพียงอย่างเดียว

สถานะการตรวจ: Source Static Checks และ GitHub Commits เสร็จแล้ว; **Local npm build / Browser QA ยังต้องให้ผู้ใช้รัน** และตรวจตัวเลขที่แสดงจริงก่อนรับรอง
