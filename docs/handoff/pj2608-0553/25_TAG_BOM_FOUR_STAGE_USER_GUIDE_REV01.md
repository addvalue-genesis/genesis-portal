# PJ2608-0553 — คู่มืออ่าน BOM ตาม TAG (Four-Stage Engineering BOM) Rev01
**วันที่:** 13 October 2026
**สาขา:** `feat/pj2608-0553-tpp-bid-handoff`
**ขอบเขต:** Working Preview / MR-0001 TAGs ตาม Location โดยใช้ข้อมูลเดิม ไม่สร้าง Cost Ledger หรือ OEM BOM ใหม่

## 1) จุดประสงค์สำหรับผู้บริหาร / Engineering Lead
ในงาน Offshore Oil & Gas ต้องแยกให้ได้ว่า **Engineering ต้องการอะไร (Required)**, **เราเลือกแนวทางต้นทุนชั่วคราวอะไร (Working)**, **ผู้ขายเสนออะไร (Offered)** และ **มีหลักฐานยืนยันความถูกต้องหรือไม่ (Verification)**

จึงแสดงผลทุก TAG แบบ 4 ขั้นตอนหลัก กาง/หุบได้ มี Copy Module ID สำหรับอ้างอิงกลับมาคุยกับทีม คุณไม่ต้องเข้าใจ Source Code ก็สามารถบอก TAG/Module ที่มีปัญหาได้

**เริ่มดู:** 10 Budgetary → Working Preview → Location (เช่น ZWP20) → Cost Allocation by TAG → กด + ที่ TAG (เช่น MR-502-001 Row 4) → Engineering Derivation → 01–04 ตามลำดับ

### 01 Required Engineering BOM — สิ่งที่ต้องมี
- แหล่งข้อมูล: MTO Rev04 → `mr0001RequiredBomDerivation.js` → `mr0001PackageComposition.js`
- สังเกต **Function / Quantity Driver / Evidence / Approved SKU Qty / Technical State**.
- **1 Set ใน MTO ไม่เท่ากับ 1 SKU เสมอไป**. Model ยังคง `approvedSkuQty = null` จนมี Engineering/OEM Proof.
- ข้อมูล Required คือสิ่งที่ต้องทำให้ครบตามหน้าที่ของระบบ ไม่ได้เลือกโดย Supplier แทนเรา
- Module ID: `bid.budget.bom.<site>.<tag>.<row>.required-bom`.

### 02 Working Priced BOM — ต้นทุนที่จัดสรรให้ TAG นี้
- แหล่งข้อมูล: `mr0001TagCostLedger0553.js` → `zwp20SiteCost0553.js` และ `engineeringOwnedCost0553.js` ตาม Site/TAG จริง.
- แสดงเฉพาะ Function ที่เป็น Cost Owner ของ TAG นี้; Cost Owner อื่นต้องแยกและมีหมายเหตุเพื่อหลีกเลี่ยง Double Count
- แสดง Working Qty × Working Rate และตรวจยอดรวมกับ TAG Ledger. ไม่แก้ยอดรวมใน Read Model.
- Module ID: `bid.budget.bom.<site>.<tag>.<row>.working-priced-bom`.

### 03 Vendor Offer Comparison — ข้อเสนอผู้ขาย
- Source of truth: `bid.vendor.products.supplier` และ `supplierQuoteLines.js`, original quotation JSON.
- เปรียบเทียบ **Quoted Qty (ทั้งใบเสนอราคา)** กับ **Engineering Working Qty (เฉพาะ Site/TAG)**. ไม่ใช่ค่าเดียวกัน
- แสดงราคาต้นฉบับแยกจาก Working Cost และระบุ Vendor `NULL` / Historical / Indicative / Status ไม่แทน `NULL` ด้วย zero quote.
- ตารางนี้ดึงเฉพาะ Quotation Line ที่จับคู่กับ Cost Owner ปัจจุบัน; บรรทัดของ TAG อื่นยังดูได้ผ่าน 07 Vendor และ Mapping Audit.
- Module ID: `bid.budget.bom.<site>.<tag>.<row>.vendor-comparison`.

### 04 Engineering Verification — การยืนยันทางวิศวกรรม
- รวม RFQ Particular (TAG/Site/Common/Conflict), Requirement→Evidence, CAL/RPT, Vendor Mapping Audit, assumptions, technical risks และแหล่งข้อมูลเดิมทั้งหมดไว้โดยไม่ลบ.
- การ Match Quote สำเร็จไม่เท่ากับผ่าน Standards/OEM/AVL/Ex/Country Licence หรือได้รับอนุญาตออก Customer Price.
- Module ID: `bid.budget.bom.<site>.<tag>.<row>.engineering-verification`.

## 2) ตัวอย่าง ZWP20 / MR-502-001.4 — Radio ODU

### Required functions (8):
`RADIO_EQUIPMENT`, `RF_FILTER`, `CAPACITY_KEY`, `REGION_KEY`, `POWER`, `POWER_CORD`, `MOUNT_FEEDER`, `WARRANTY`.

หลักฐานโครงการ: MTO Rev04 1 Set, RPT-0001 C1 ZWP8 → ZWP20 PTMP remote. ถึงมี 8 Function ก็ยังไม่ใช่ Final Physical BOM ที่อนุมัติ SKU/Qty แล้ว.

### Working cost (cost ownership):
| Next G Quote | Function / Allocation | Owner | Working Qty | Working USD |
|---|---|---|---:|---:|
| B-1 | Remote Radio | MR-502-001.4 | 1 | 3,456.50 |
| B-2 | RF Filter | MR-502-001.4 | 1 | 2,348.19 |
| B-3 | Throughput / Capacity Key | MR-502-001.4 | 1 | 1,177.22 |
| B-4 | Region Key — Vendor original price **NULL** | MR-502-001.4 | 1 | 0.00* |
| B-5 | Mounting Kit | MR-502-001.4 | 1 | 306.74 |
| **TOTAL** | **ODU TAG Working (not customer sell)** | **MR-502-001.4** | | **7,288.65** |

*USD 0 ใน B-4 เป็น **management assumed no incremental charge** เท่านั้น ไม่ใช่ Vendor Quote Rate และยังไม่มีหลักฐานว่า Region 04 ใช้ Myanmar ได้ ต้องขอ OEM confirm + Commercial clarification.*

**Cost Owner อื่น ไม่ให้นำมารวมซ้ำที่ ODU:**
- B-6 + B-7 = USD 671.27 → `MR-502-001A.5` (IDU Power Interface only; ไม่ได้ยืนยันครบ IDU).
- B-8 = USD 614.20 → `SA-502-001.10` (Surge).
- B-12 = USD 4,709.77 → `ANT-502-001.6` (4ft Working Antenna, pending RF proof).
- ดังนั้นเก้า Quote Lines ทั้งหมดใน Single-site Working Cost รวม **USD 13,283.89** แต่ ODU ของ `MR-502-001.4` ยังคง **USD 7,288.65**. Original Quote-Wide extension ที่มีราคาอยู่ใน 9 Lines = USD 30,432.13 เพราะผู้ขายเสนอจำนวนหลายชุด ไม่ได้แปลว่าต้องซื้อตามนั้นสำหรับ ZWP20.

### จุดที่ยังต้อง Verify
- B-4 Region 04: supplier price null / Myanmar entitlement proof absent.
- Radio throughput/capacity and existing ZPQ NMS software licences.
- Ex Zone 2 compliance, power/connector interface, IDU separate requirement, mounting/antenna gain, RF CAL/RPT/tidal reflection and cable/bulk boundaries.
- RFQ clauses, client deviation, source quote validity, warranty/spares, A/B/C related costs and customer release.

## 3) แหล่งข้อมูลและสมการที่ใช้
`MTO/MR/BLD/RPT → Required Function → Quantity Driver → Physical TAG Owner → Quotation Line → Working Qty × Unit Rate → Ledger TAG Total → Engineering Verification`

Implementation:
- `data/tagBomFourStageReadModel0553.js`: Read-only adapter; ไม่อนุมัติ SKU, แก้ราคา หรือโพสต์ Cost.
- `TagFourStageWorkbench0553.jsx`: 01–04 UI, controlled collapsible sections and Copy Module IDs.
- `LocationBomDetail0553.jsx`: หน้าต้นทาง TAG/DERIVATION เดิม; เก็บ legacy source/audit details ภายใต้ขั้น 04.
- `TagMappingAudit0553.jsx`: 9 original Next G lines across 4 owners (audit), ไม่ใช่เฉพาะ ODU.
- `validate-0553-tag-four-stage-bom.cjs`: ตรวจ Required 8 functions, ODU 5 quoted codes, IDU cost owner split, B-4 supplier NULL, unchanged frozen cost ledger, 4 stage IDs and JSX.
- โค้ดไปรันผ่าน `npm run validate:0553-tag-four-stage-bom` และ `npm run build` บนเครื่องผู้ใช้.

## 4) วิธีคุยกับทีมจากหน้าจอ
Copy ID ของ TAG หรือขั้นตอนย่อย เช่น:
- `PJ2608-0553 / bid.budget.bom.zwp20.mr-502-001.4.required-bom` — ต้องการตรวจ Required Physical Function/Qty
- `PJ2608-0553 / bid.budget.bom.zwp20.mr-502-001.4.working-priced-bom` — ต้องการตรวจ Working Cost
- `PJ2608-0553 / bid.budget.bom.zwp20.mr-502-001.4.vendor-comparison` — ถามว่าผู้ขายเสนออะไรและจำนวนเท่าไร
- `PJ2608-0553 / bid.budget.bom.zwp20.mr-502-001.4.engineering-verification` — ถามข้อกำหนด/ข้อขัดแย้ง/ผลพิสูจน์

## 5) Scope / Definition of Done
รอบนี้เป็นการจัดแสดง **MR0001 TAG ตาม Location ที่หน้าปัจจุบันใช้อยู่** โดยเรียก Source/Calculation/Cost Ledger เดิมเท่านั้น ไม่สร้างฐานข้อมูลสินค้าหรือ Required BOM ใหม่ ไม่แก้ 0550 ไม่แก้ Vendor Quotations และไม่ปล่อยราคา Customer. โมดูล MR0002/3/4 มี Working BOM คนละ Read Model อยู่แล้ว ต้องใช้แนวคิดเดียวกันหลังแยก Mapping/Quantity source และตรวจ Test ของแต่ละ MR ก่อน

**สถานะการรับรอง:** Code และเอกสาร GitHub Commit แล้ว; Runtime Node/Babel/Production Build และ Browser Acceptance บนเครื่องของผู้ใช้ต้องตรวจต่อก่อนอ้างว่า PASS. หากข้อผิดพลาดใดเกิดต้องแก้ Source Logic/UI ไม่ลดเงื่อนไข Validator เพื่อให้ผ่าน.
