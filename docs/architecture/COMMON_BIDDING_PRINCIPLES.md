# Common / Generic Architectural Principles — EPC / Turnkey SI Bidding

**Revision:** R01 · 4 November 2026 · ข้อกำหนดร่วมจากข้อความของเจ้าของโครงการ

เอกสารนี้กำหนดกติกาและเกณฑ์ตรวจระบบร่วม ไม่ใช่หลักฐานว่าทุกเส้นทางในแอป
ทำตามครบแล้ว และไม่ใช่การอนุมัติราคา/วิศวกรรม/Customer Release
สถานะการรองรับจริงแสดงในหัวข้อ7 ไม่เพิ่ม architectural Module ID หรือเปลี่ยน ID เดิม

ฐานตรวจ0553: `1e21b8a68626afb60addcc312a76fdadbf723567` (Draft PR56)
ฐานอ่านวิธีการ0550: `d641c9f0e559abac3478cbbfab400f90eb8a300c`
0550 ใช้อ่านโครงสร้าง/กติกาเท่านั้น ไม่ใช่ต้นทางราคา จำนวน FX หรือ vendor ของ0553

## 1. Financial math และฐานราคาที่ตรวจสอบได้

### C01 — Parse เป็น Decimal ก่อนคำนวณ

ห้ามใช้ binary-float rounding + `Number.EPSILON` เป็นวิธีหลักสำหรับเงินในสัญญา
ใช้ Decimal library หรือ BigInt/scaled integers โดย parse จาก decimal string
ที่เก็บจากต้นทางก่อนคำนวณ ไม่ใช่ `Math.round(Number(text) * 100)`
และไม่อ้างว่าแปลง Number เป็น Decimal แล้วกู้ precision ที่สูญไปก่อนหน้าได้

ตัวอย่างที่รันจริง: สูตรเดิมให้10.075→10.07, 4.015→4.01, 128.015→128.01
ขณะที่ decimal HALF_UP ให้10.08, 4.02, 128.02 ตามลำดับ

    parseDecimal("10.075", scale=3) = 10075n
    HALF_UP(scale3 → scale2)        = 1008n = "10.08"

เก็บ intermediate precision เพียงพอสำหรับ source price, FX, discount และ markup
อย่าปัดต้นทุนทุกค่าเป็นเซนต์ก่อนถึงจุดตัดที่ policy กำหนด สกุลเงินไม่จำเป็นต้อง
มี2ตำแหน่งเสมอ; scale, rounding mode และขีดจำกัดต้องระบุ ถ้าใช้ Number เป็น
จำนวนเต็มต้องพิสูจน์ safe-integer bounds; BigInt ไม่ให้ overflow แบบ Number
นโยบายสำหรับ credit/ค่าลบต้องระบุแยก helper ปัจจุบันรองรับ nonnegative เท่านั้น

### C02 — กำหนดหน่วย FX และจุดตัดการปัด

กำหนด E = FX(THB/USD) หน่วยบาทต่อหนึ่งดอลลาร์ ดังนั้น:

    Value_USD = Value_THB / E
    Value_THB = Value_USD * E

การแปลง THB→USD จึงเป็นการหาร E ไม่ใช่คูณ E หากเก็บ inverse rate ต้องระบุ
หน่วยเป็น USD/THB ชัดเจน เก็บ rate/date/source/authority/revision และเก็บ input
ไว้กับฉบับที่ตรึง ห้ามเปลี่ยน FX เพื่อกลบ rounding variance

ให้ R เป็นการปัดตาม precision/mode ที่ประกาศ:

    V_line = sum_i R(C_i,THB / E)
    V_lot  = R(sum_i C_i,THB / E)
    Delta_rounding = V_line - V_lot

ทั้งสองค่าอาจต่างกันแม้ใช้ FX เดียวกัน เช่นตัวอย่างสมมติ C=[0.10,0.10] THB,
E=3 THB/USD, R=HALF_UP2 ให้ V_line=0.06, V_lot=0.07, Delta=-0.01 USD
นี่เป็นตัวอย่างสมการ ไม่ใช่ FX/ราคาของโครงการใด

หนึ่งโมเดลต้องใช้ **policy framework ที่สอดคล้องและ versioned** แต่ไม่จำเป็น
ต้องใช้ formula/rounding grain แบบเดียวทุกหมวด บางกลุ่มตรึงยอดเจรจา บางกลุ่ม
ปัด unit แล้วรวม; ทั้งสองต้องผูก policy ของตน ห้ามสลับกันเพื่อบังคับ test ผ่าน

### C03 — ระบุ price authority ต่อบรรทัด/กลุ่ม

| Mode | สมการ/เงื่อนไข | สิ่งที่ห้ามทำ |
|---|---|---|
| UNIT_AUTHORITATIVE | u=RoundStep(x,Theta); L=R(q*u); parent=sum(priced posting leaves) | ปัด parent ซ้ำหรือปรับ q เพื่อคืนยอดเก่า |
| AMOUNT_AUTHORITATIVE | L=T ที่เลือกไว้; u_exact=T/q; u_display เป็นค่าประมาณถ้าปัดแล้วไม่ลงตัว | แสดง0.33×3=1.00 เป็นสมการ exact โดยไม่บอกว่า unit เป็นค่าประมาณ |
| FIXED_PARENT_ALLOCATE | รักษา T; จัดสรรด้วยกติกาที่ตรึง, stable tie-break และข้อจำกัด Qty×Unit/step | ลด/เพิ่มราคาโดยเงียบเพื่อให้ sum ลงตัว |
| IMPORT_EXACT_ARTIFACT | เก็บค่ากับไฟล์เดิมและ hash; ไม่คำนวณแทน original | นำราคาที่ปัดแล้วไปปัด/แปลง FX ซ้ำ |

ตัวอย่าง T=1.00, q=3 และ unitแสดง2ตำแหน่ง ไม่มีค่า unit เท่ากันที่คูณแล้วได้
1.00 พอดี ถ้าแบบฟอร์มลูกค้าบังคับ exact Qty×Unit ต้องใช้วิธีที่ได้รับอนุญาต
(precision ที่มากขึ้น/โครงสร้าง Lot ตามแบบ/การจัดสรรที่อนุมัติ) หรือ HOLD
ห้ามสร้างค่าเศษปรับยอด/ย้ายคอลัมน์/เปลี่ยนจำนวนโดยไม่มีอำนาจรองรับ

ขั้นต่ำของ Theta: version, currency/scale, rounding mode/increment/stage/grain,
price authority, allocation method/tie-break, FX direction, original precision,
applicability ต่อกลุ่ม และเหตุผล/ผู้อนุมัติข้อยกเว้น

## 2. Quotation lifecycle และประวัติที่ไม่ถูกเขียนทับ

### C04 — แยกสถานะและหลักฐานคนละแกน

| สถานะ | หลักฐาน/พฤติกรรมที่ต้องมี |
|---|---|
| Live Working | ข้อมูลภายในที่แก้ได้; ห้ามถือว่าอนุญาต Customer Release; explicit HOLD/releaseAllowed:false ที่จุด gate |
| Owner-selected reference | เจ้าของเลือกฉบับอ้างอิงได้; ไม่แปลว่าลูกค้าตกลงหรือได้ส่งแล้ว |
| Agreed / Negotiated | มี agreement/decision reference และขอบเขตอำนาจของผู้ตกลง; เลือกเป็น default ได้ตาม register |
| Frozen | ตรึง inputs/policy/outputs/mapping/metadata และ exact files; hash ตรวจ identity/integrity |
| Owner-attested used | ผู้ใช้ระบุว่าใช้ฉบับใดจริง; occurredAt ที่ไม่ทราบเป็น null แยกจาก recordedAt |
| Download started | แอปเริ่มดาวน์โหลด artifact ใด; ไม่พิสูจน์ว่าดาวน์โหลดจบ/ใช้จริง/ส่งจริง |
| Submitted | มี transmission evidence ผูก exact revision/artifact hashes; ไม่ให้ live calculation เขียนทับ |
| Customer accepted | มีหลักฐานตอบรับของผู้มีอำนาจ; ไม่อนุมานจาก Submitted |

Git HEAD, modifiedTime, filename และยอดรวม ไม่ใช่ตัวระบุฉบับที่ใช้จริง
default UI ต้องอ่าน explicit selected pointer ของ project/proposal/recipient
ไม่เลือกไฟล์ล่าสุดเองและไม่เปลี่ยน business pointers เมื่อ git pull

    Snapshot_v = Freeze(inputs, policies, calculated details, source trace,
                        commercial scope/terms, template/engine versions)
    SnapshotHash_v = SHA256(CanonicalJSON_v1(Snapshot_v))
    FileHash_v,j = SHA256(exact file bytes_v,j)
    RevisionId_v = SHA256(canonical immutable record + file bindings)
    Used_v = explicit use event bound to RevisionId_v and SnapshotHash_v

SHA-256 ไม่ใช่ลายเซ็นผู้อนุมัติหรือหลักฐานการส่งด้วยตัวเอง ต้องเก็บผู้บันทึก
อำนาจ/อ้างอิงการอนุมัติและหลักฐานเหตุการณ์แยกกันตามที่เกิดขึ้นจริง

### C05 — Append-only + explicit correction

ออก/ตรึงฉบับใหม่เมื่อเปลี่ยนข้อมูล สูตร template หรือเงื่อนไขที่มีผล
ห้ามแก้ issued payload/ไฟล์เดิมหรือแก้ event เก่าย้อนหลัง การ supersede หรือ
ระบุใช้ผิดต้องเพิ่มเหตุการณ์แก้ไข/เลือกใหม่พร้อมเหตุผล คงรายการเก่าไว้
ใช้ expectedVersion/CAS กัน stale writes; retry ต้อง idempotent
backup/restore ต้องตรวจ snapshot/file hashes, scope และ history conflicts
browser cache/IndexedDB อย่างเดียวไม่ใช่ central authoritative storage

## 3. Single cost ownership และ commercial treatment

### C06 — Deduplicate วัตถุจริง ไม่ใช่ชื่อที่คล้ายกัน

    D_t = union_i O_i,t     (หลังยืนยัน physical identity และ applicability)
    Qty_t = mu_t(D_t)

mu_t ต้องระบุหน่วย/วิธีวัด เช่น count ของเครื่อง, ความยาวของช่วงสายที่ไม่ทับกัน,
หรือ event/person-hours ของกิจกรรม ห้ามรวมคนละหน่วย/รุ่น/ช่วงงาน/สถานที่
เพียงเพราะ description หรือ TAG คล้ายกัน Network switchตัวเดียวที่พิสูจน์แล้ว
ว่าแชร์3ระบบนับ1ตัว แต่ switchคนละไซต์ไม่ยุบเป็นตัวเดียว

กำหนด posting identity อย่างน้อยตาม project + physical/work object +
cost component + lifecycle/event + selected source revision โดยเก็บ Module/line
IDs เดิม ใช้ typed metadata/alias mapping ไม่เปลี่ยน ID เพื่อจัด namespace

    sum_k PostingOwner(o,c,k) = 1   สำหรับ cost component ที่ต้องบันทึกจริง
    DirectCost = sum(unique selected posting components)

parent/kit subtotal และ child detail ของต้นทุนเดียวกันต้องมี posting level เดียว
รายการอ้างอิง/scenario/historical/nonposting ไม่บวกเข้าต้นทุนอีกครั้ง
งาน FAT/Training/Travel ต้องนับ driver ของเหตุการณ์/คน/วันจริง ไม่ dedup ทุกงาน
ที่มีชื่อเหมือนกัน และต้องไม่คิด paid time เดียวกันซ้ำ

### C07 — แยก price treatment จาก scope disposition

| Treatment | ความหมายและเงื่อนไข |
|---|---|
| INCLUDED_IN_PACKAGE | มีหลักฐานว่าอยู่ใน selected package; incremental posting=0 แต่ต้นทุนจริงของวัตถุไม่ถูกอ้างว่าเป็น0 และยังต้องมี parent cost owner |
| SEPARATE_COST_ITEM | มี owner/source/qty/rate/currency และ posting ครั้งเดียว; ราคาขาดยังเป็น OPEN |
| SELL_LAYER | เป็นชั้นทางการค้า เช่น markup/management fee; ไม่ลง direct cost ซ้ำโดยอัตโนมัติ |
| NOT_QUOTED_EXCLUDED | มี explicit commercial exclusion authority; ไม่ใช่การยกเว้น technical requirement โดยอัตโนมัติ |
| NOT_SEPARATELY_QUOTED | ไม่มีราคาแยก แต่ scope ที่รวมอยู่ในอุปกรณ์ยังรวมอยู่; ห้ามเหมารวมว่า excluded ทั้งหมด |
| OPEN / UNPRICED | ยังไม่มีหลักฐาน/ราคา/การตัดสินใจครบ; value=null ไม่ใช่0หรือ N/A โดยปริยาย |

scopeDisposition แยกเป็น included/excluded/conditional/open ตามหลักฐานของ
แต่ละรายการ อย่าใช้คำว่า N/A อย่างเดียวเป็นสถานะข้อมูลที่กำหนด scope
ตัวอย่างบทเรียน B11: “not separately quoted; tools expressly included remain
included” ต้องรักษาข้อความนี้ ไม่ตีความเป็นตัดเครื่องมือทั้งหมดออกจาก scope
ห้ามเปลี่ยน status ของ canonical/historical records โดย bulk migration ที่ไม่มี review

### C08 — Direct Cost → Working Sell → Customer Sell

    Sell_markup = Cost * (1+m)
    Sell_margin = Cost / (1-g), 0 <= g < 1
    m = g/(1-g); g = m/(1+m)

สองสูตรเป็นวิธีแสดง price uplift คนละฐาน ไม่ใช่ให้ใช้ซ้อนกันโดยอัตโนมัติ
แต่ละ layer ต้องระบุ base, owner, currency, included/excluded และ policy
ส่วนเพิ่มที่รวมใน vendor price/Working Sell แล้วห้ามคิดอีกรอบ
ห้ามบวก cost + sell + customer sell เป็น “total cost” เดียวกัน

ไม่มี actual quote แต่มี owner-approved estimate ให้เก็บว่าเป็น budgetary estimate
พร้อมวิธีคำนวณ/authority/confidence ไม่เรียกว่า verified supplier cost
known subtotal แสดงได้เมื่อระบุรายการที่ยังขาด; full total/ready ไม่ถูกยืนยัน
จาก subtotal โดยตัดรายการไม่ทราบทิ้งเป็น0

## 4. Domain model / Common → Generic → Particular

### C09 — แยกบทบาทข้อมูลและชั้นความรู้

| Typed role | ความหมาย | ไม่ใช่ |
|---|---|---|
| Customer Sources / A | RFQ, PHI, MR, DTS, SPE, LIS, drawings, contract/amendments และ requirement provenance | Part A equipment price |
| Supplier Sources / S | quotation, package inclusions, data sheet, deviation, commercial terms | Part B services |
| F_SI / integrator process | reconcile, design, derive, CAL/RPT, scope/physical identity, WBS, cost/pricing | supplier claim ที่กด Comply |
| Commercial Part A/B/C | customer pricing classification ของ project นั้น | namespaces ของ Customer/Supplier/SI |

    Result_P = F_Common,Generic(CustomerSources_P, SupplierSources_P,
                               ParticularPolicy_P, EngineeringDecisions_P)

Common เก็บ pure equations, identity/immutability, units และกติกาทั่วไป
Generic เก็บ domain patterns ของ EPC/Turnkey เช่น evidence/constraint,
commercial lifecycle, posting/rollup และ adapters สำหรับ Native template
Particular เก็บ scope/quantity/TAG/vendor/FX/margins/contract ของโครงการ

Anti-corruption boundary ต้องตรวจ project/source scope และ current applicability
ไม่ import dataset ของโครงการอื่นเป็น default ไม่ carry numeric allowance,
supplier choice, old FX หรือ contractual exemption มาเพราะ code structureเหมือนกัน
ข้อมูลที่ไม่ครบใน project ใหม่ต้อง OPEN; Common ส่งคืน null/HOLD ได้

## 5. Engineering verification และ release gating

### C10 — Preserve the controlling predicate

    EQ: actual = required
    GTE: actual >= minimum
    LTE: actual <= maximum
    TOLERANCE: abs(actual-required) <= epsilon

operator ต้องมาจาก controlling requirement ไม่เปลี่ยน EQ→GTE/LTE เพื่อให้ PASS
Tolerance ต้องมีค่า/หน่วย, absoluteหรือrelative, operating conditions, source,
authority และวิธีเทียบที่ได้รับอนุมัติ Missing/unsupported/unit mismatch ต้อง OPEN
ห้ามใช้ finance rounding tolerance เป็น engineering acceptance tolerance

supplier property claim match หรือ model/part-name match เป็น evidence screening
ไม่ใช่ derived SI proof หรือ full system compliance ต้องมี proof ตามโจทย์จริง
เช่น interface/coverage/bandwidth/power/Ex configuration และ approved disposition
ที่ใช้กับ project/revision/requirement นั้น ไม่สร้างคำรับรองที่ไม่มีหลักฐาน

### C11 — Gate มีอำนาจแยกจากการคำนวณและ export draft

    Ready_v = sourceTraceSatisfied AND engineeringBasisSatisfied
              AND commercialScopeReconciled AND pricingReconciled
              AND nativeOutputVerified AND unresolvedCriticalBlocks=0
    IssueAllowed_v = Ready_v AND explicitAuthorizedIssueDecision_v

engineeringBasisSatisfied อาจประกอบด้วย verified proof หรือ qualification/
deviation ที่มี explicit authorized disposition ตาม bid policy ของโครงการ
ไม่เท่ากับอนุมัติ technical compliance ทั้งระบบโดยปริยาย
การอนุญาต internal export/freeze/download/use attestation ไม่ทำให้ IssueAllowed=true
Working modelคง HOLD; issue decision สร้าง frozen Release entity แยกกัน
ห้ามอนุมาน approval จากสี UI, hash, filename, received receipt, test PASS หรือ Git merge

## 6. Native Customer Template Integrity

### C12 — Fill the authorized template; do not redesign it to fit the code

ให้กำหนด template ID/revision/hash และ logical row roles เช่น GROUP_HEADER,
PRICED_LEAF, INCLUDED_DETAIL, SUBTOTAL, OPTION หรือ EXCLUDED แม้พิมพ์รวมใน
คอลัมน์เดียวกัน ระบบรวมเฉพาะ posting leaves ที่เป็นเจ้าของราคา ไม่บวก subtotalซ้ำ
ไม่ย้ายคอลัมน์/ลบแถว/ซ่อนข้อมูล/เพิ่ม rounding line เพื่อแก้การคำนวณให้ลงตัว

ถ้า template จำกัดจำนวนแถว/precision/การจัดกลุ่ม ต้อง HOLD หรือใช้ approved
template variant/annex ตามอำนาจที่ระบุ การปรับ row height, print settings,
เพิ่ม sheets หรือเปลี่ยนรูปแบบใดๆ ต้องมี explicit allowed-change policy และ review
ไม่อ้างว่าการปรับเพื่ออ่านง่ายได้รับอนุญาตจากลูกค้าแล้วโดยอัตโนมัติ

ตรวจ original names/order, cell mapping, column meanings/widths, row roles,
merges, formulas+cached values, number formats, print areas/defined names และ
pagination/visual render ตาม applicable template policy
original submitted artifact ต้องคง exact bytes และ hash เดิมเสมอ
generated artifact มี hash ใหม่ตามไฟล์จริง; การมี hash อย่างเดียวไม่ยืนยัน layout

## 7. Code evidence และช่องว่าง ณ ฐานตรวจที่ระบุ

| หลักการ | สิ่งที่พบจริง | สถานะ/สิ่งที่ยังต้องทำ |
|---|---|---|
| C01–C03 precision / policy | COMMON `frontend/src/common/cost/quotationRounding.js`: BigInt decimal step/line HALF_UP/fixed-parent qty1; 0553 A1–A3 และ quoted up-step เรียกใช้แล้ว | PARTIAL: `officialUsdRelease0553.js` ยังมี binary `round2`, seed FX conversion, legacy allocation และ rollups; `releaseCommercialModel0553.js` ยังมี EPSILON/Math.round; ไม่ได้ migrate ทั้ง engine |
| C01–C03 reference0550 | `money0550.js` ณ0550 d641c9f0 ใช้ decimal.js precision40/HALF_UP และ diagnostic unit check; commentยอมรับว่า upstream Number precisionกู้คืนไม่ได้ | Reference method only; ไม่ import ราคา/FX/vendor หรืออ้างว่าทุก upstream equation เป็น Decimal แล้ว |
| C04–C05 immutable/use | COMMON `quotationBaseline.js`, `quotationBaselineStore.js`; 0553 captures exact original/generated files, scoped append-only selection/use/download events, CAS + verified backup | IMPLEMENTED in Draft PR56; local IndexedDB + portable backup, ไม่ใช่ central sync; recorder typed nameไม่ใช่ authenticated identity; ไม่มีใหม่ transmission/acceptance workflow |
| C06–C08 ownership | 0553 `bcTurnkeyWorkingCost0553.js` มี owner/nonposting guards; `controlledTagMappingKernel.js` กระทบยอด owner; existing viewsแยก cost/sell | PARTIAL: ยังไม่ใช่ universal physical-object union + treatment contract ครบทุกระบบ; B11 legacy enumยังใช้ NOT_QUOTED_EXCLUDED คู่กับ notesว่าของที่รวมยังรวมอยู่ ห้าม bulk reinterpret |
| C09 isolation | common kernelsไม่ import particular rates; `validate-pj2608-0553-isolation.cjs` ตรวจ architecture boundary; existing Module IDsเดิม | Guard exists, ไม่แทนการตรวจ source applicability รายโครงการ |
| C10–C11 engineering | `engineeringIntelligenceCore.js` รักษาequals/min/max, rejectunknown/unit mismatch, ระบุ SOURCE_MATCHไม่ใช่ technical approval; `requiredOfferedReconciliation.js` คง REVIEW/HOLD | Screening controls exist; ไม่อ้างว่าพิสูจน์ทางวิศวกรรมครบหรือทุก output pathมี gateมาตรฐานเดียวแล้ว |
| C12 native forms | Original Rev03 archive SHA256 exact; native export testsตรวจ values/formulas/6–10 sheets; generated export codeมี fitted rows และบาง pathเพิ่มแถว/sheets | PARTIAL: ไม่อ้าง blanket native visual/geometry compliance หรือ approvalของทุกlayoutchange; ต้องผูก template allowed-change contract |

ตารางนี้ไม่ประกาศ PASS ทั้งระบบจาก grep หรือ testชุดเดียว และไม่ได้แก้ runtime/
ราคา/จำนวน/FX/ประวัติของ0550หรือ0553ในรอบจัดหลักการนี้

## 8. Audit checklist และลำดับแก้ไข

| ตรวจ | ต้องพบ | Red flag |
|---|---|---|
| Decimal ingress | source decimal text, precision/limits และ exact round tests | binary multiply100ก่อน parse/round หรือแค่เติมEPSILON |
| FX / rounding | typed rate, per-group versioned policy, Delta_rounding ที่อธิบายได้ | ปรับ FXหรือราคาเพื่อกลบเศษ |
| Unit / amount | explicit authority และการตรวจ native Qty×Unit | unitประมาณแต่แสดงเป็นexact; สร้างรายการเศษโดยไม่มีอนุมัติ |
| Revision identity | frozen details+file bytes+hashes, explicit selected/used/submitted evidence | ใช้ HEAD/filename/totalเป็นตัวเลือกอัตโนมัติ |
| History / storage | append-only corrections, CAS, verified backup/restore และstorage scope | browser-onlyแล้วอ้างcentral; overwriteบนconflict |
| Ownership | physical identity + unique posting level + treatment/scopeแยกกัน | package parent+childถูกบวกสองครั้ง; N/Aถูกตีความว่าexcludedทั้งหมด |
| Project isolation | Common/Genericไม่มี particular commercial defaults | copyราคา/FX/ข้อตกลงจากโครงการก่อน |
| Engineering gates | predicate+units+source+approved disposition และproofที่ต้องใช้ | supplier Comply = engineering PASS; EQถูกเปลี่ยนเพื่อผ่าน |
| Missing inputs | OPEN/HOLD/null หรือ explicit budgetary estimateที่ติดป้าย | unknown=0, known subtotal=full cost |
| Native template | authorized template/allowed-change rules + mapping/formula/visual checks | ย้าย/ลบคอลัมน์หรือแถวเพื่อเลี่ยงข้อจำกัด |

ลำดับทำงาน: (1) freeze selected/issued originals และ characterize current outputs;
(2) map price authority/policy และ remaining binary paths;
(3) migrate mutable calculationsทีละเส้นทางโดยใช้ exact decimalและreview diffs;
(4) normalize treatmentเป็นtyped adapterโดยรักษาraw notes/history;
(5) audit engineering gates/native template contractsก่อนยกสถานะ Issue

ไม่รัน recalculation/migration เขียนทับ frozen history เมื่อเปลี่ยน financial engine
ค่าที่เปลี่ยนจาก bug fix ต้องแสดง diff/เหตุผล/ผู้มีอำนาจตัดสินใจ และสร้าง revision ใหม่
การปรับ checklist นี้ไม่อนุมัติ repricing หรือ release ให้โครงการใด
