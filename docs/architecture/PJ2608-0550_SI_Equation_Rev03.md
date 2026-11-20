# PJ2608-0550 — สมการจากข้อกำหนดลูกค้า ผ่าน System Integrator สู่ Release 10.7

**Revision:** Rev03 — ทบทวนข้อเสนอ Claude Rev02 ตรวจ Source เพิ่ม และแยกข้อที่ยอมรับ/ปรับ/ยังไม่ยืนยัน  
**วันที่:** 29 ตุลาคม 2026 — Asia/Bangkok  
**โครงการ:** PJ2608-0550  
**สถานะเอกสาร:** คำอธิบายสมการและหลักการทำงานจากข้อตกลงในบทสนทนาและ ADR-0550-001

เอกสารนี้อธิบายว่า เมื่อมีข้อกำหนดลูกค้าและข้อมูลผู้ขายแล้ว งานของเราใน Web App ต้องนำข้อมูลเหล่านั้นมาวิเคราะห์ ออกแบบ พิสูจน์ กำหนดขอบเขตและราคา จนได้ข้อเสนอที่ตอบลูกค้าในหัวข้อ 10.7 โดยตรวจย้อนกลับได้ เอกสารนี้ไม่ได้ยืนยันว่าโค้ดปัจจุบันหรือการตรวจข้อมูลโครงการเสร็จครบแล้ว และไม่ได้อนุมัติราคาใหม่หรือการออกเอกสารลูกค้า

Rev03 ยอมรับข้อค้นพบหลักใน Rev02 เช่น Prime Layer, ขอบเขตสกุลเงิน, ข้อจำกัดการเชื่อม Proof/Activity และความต่างระหว่าง Export โดยปรับคำแนะนำเรื่อง Acceptance Criteria, Shared Evidence, Layout และ Rounding ตาม §14.0 การตรวจครั้งนี้อ้างอิง Source Snapshot ที่ระบุเท่านั้น ไม่ยืนยันสถานะ HEAD ล่าสุด การติดตั้งจริง หรือข้อมูลโครงการ และไม่มีการแก้โค้ดแอป

## 1. แยกความหมายของ A และ B ให้ตรงกัน

คำว่า A/B มีหลายบริบท จึงกำหนดสัญลักษณ์เพื่ออธิบายสมการให้ชัด โดยไม่เปลี่ยนชื่อเมนูหรือ Module ID เดิม

| บริบท | ชื่อหรือสัญลักษณ์ | ความหมาย |
|---|---|---|
| เมนู A | Original RFQ | พื้นที่เอกสารและข้อกำหนดตั้งต้นของลูกค้า |
| เมนู B | Engineering & Bid Preparation | พื้นที่เตรียมคำตอบด้านวิศวกรรมและข้อเสนอ รวมทั้งการใช้ข้อมูลผู้ขาย |
| บทบาทข้อมูลฝั่งซ้าย | A หรือ Customer Sources | สิ่งที่ลูกค้าต้องการและหลักฐานต้นทาง |
| บทบาทข้อมูลฝั่งขวา | S หรือ Supplier Sources | ข้อเสนอและหลักฐานของผู้ขาย ใช้ S ตลอดเอกสารนี้ |
| งานตรงกลางใน Web App | F_SI | กระบวนการของเราในฐานะ System Integrator ภายในเมนู B |
| ผลลัพธ์หัวข้อ 10.7 | R_10.7 | Release Preview USD / แบบข้อเสนอลูกค้ารอบปัจจุบัน |
| หมวดราคา | Part A/B/C | หมวดอุปกรณ์ บริการ และ Options ตามโครงสร้างราคาที่ใช้งาน เป็นคนละความหมายกับบทบาทข้อมูลข้างต้น |

**เมนู B จึงครอบคลุมการทำงานของ Integrator และการนำข้อมูล Supplier มาใช้ ส่วน 10.7 เป็นมุมมองผลข้อเสนอจากกระบวนการนั้น**

ในสมการใช้ A = Customer Sources, S = Supplier Sources และ F_SI = งานของ Integrator เท่านั้น หากกล่าวถึงตัวอักษร B ให้เขียนว่า “เมนู B” เสมอ ไม่ใช้ B เป็นตัวแปรแทน Supplier หรือฟังก์ชันประมวลผล

## 2. สมการภาพรวม

$$
\boxed{R_{10.7}=F_{\mathrm{SI}}(A,S;K,D,\Theta)}
$$

| ตัวแปร | ความหมาย | ตัวอย่างข้อมูล |
|---|---|---|
| A | ข้อกำหนดและหลักฐานลูกค้าฉบับที่ใช้จริง | RFQ, MR, PHI, BOD, DTS, SPE, BLD, LAY, DWG, LIS, CAL/RPT ที่ได้รับ, มาตรฐาน, Appendix และ Comments |
| S | ข้อมูลและหลักฐาน Supplier | Quotation, Technical Offer, Catalog, Datasheet, BOQ, Compliance Response, Inclusion/Exclusion และ Terms |
| K | ความรู้และวิธีพิสูจน์ที่ใช้กับข้อกำหนดนั้น | First Principles, สมการวิศวกรรม, วิธีวิเคราะห์ และมาตรฐานที่เกี่ยวข้อง |
| D | การตีความและการตัดสินใจที่บันทึกได้ | เลือกวิธีออกแบบ เลือกผู้ขาย ยืนยันขอบเขต จัดการข้อขัดแย้ง พร้อมเหตุผลและผู้ทบทวน |
| Θ | ฐานคำนวณและเงื่อนไขรอบข้อเสนอ | Quantity, Unit, Cost/Rate, วิธีขาย, FX พร้อมวันที่และแหล่งอ้างอิง และเงื่อนไขที่เกี่ยวข้อง |
| F_SI | กระบวนการทำงานของ System Integrator | อ่าน วิเคราะห์ ออกแบบ พิสูจน์ จัดสรรงาน คำนวณ ตรวจ และรวมข้อเสนอ |
| R_10.7 | ผลข้อเสนอในแบบลูกค้า | ขอบเขต รายการ ปริมาณ หน่วย ราคา USD หมายเหตุ และสถานะ Preview |

เครื่องหมาย “A + ข้อมูล Supplier” ที่ใช้พูดคุย หมายถึงการนำข้อมูลทั้งสองฝั่งมาประกอบการวิเคราะห์ สมการที่ระบุหน้าที่ได้ชัดคือ F_SI ซึ่งต้องทำงานกับข้อมูลเหล่านั้นก่อนเกิดผลข้อเสนอ

ความเพียงพอของข้อมูลในสมการไม่ได้หมายถึงเพียงมีชื่อไฟล์หรือลิงก์ ต้องอ่านเนื้อหาที่เกี่ยวข้อง ตรวจฉบับ ตรวจความขัดแย้ง และระบุตำแหน่งอ้างอิงด้วย

### 2.1 นิยามฐานคำนวณ Θ ที่ใช้ต่อในสมการ

$$
\Theta=\{\mathrm{QtyBasis},\mathrm{Units},\mathrm{Rates},\mathrm{SellMethod},\mathrm{CommercialTreatment},\mathrm{FXSet},\mathrm{RoundingPolicy},\mathrm{BasisVersion},\mathrm{DatedSources}\}
$$

Θ เป็นชุดฐานที่ระบุฉบับและวันที่ของรอบข้อเสนอ ปริมาณใน §5.2 อ้าง QtyBasis และ Units; ต้นทุนใน §5.3 อ้าง Rates และ FXSet; ราคาขายใน §6 อ้าง SellMethod และ CommercialTreatment (รวม Prime Markup π_u ตาม §6.2); ผล §7 อ้าง FXSet และ RoundingPolicy ของ Θ ชุดเดียวกัน การเปลี่ยนองค์ประกอบที่มีผลต้องเข้าสู่กระบวนการทบทวนใหม่ตาม §9

## 3. สมการสร้างคำตอบจากข้อกำหนดลูกค้า

### 3.1 สร้างชุดข้อกำหนด

$$
Q=\operatorname{ExtractReview}(A)=\{q_1,q_2,\ldots,q_n\}
$$

Q คือชุดข้อกำหนดที่ผ่านการอ่านและตรวจจากเอกสาร A แล้ว ครอบคลุมทุกระบบและงานร่วมตามขอบเขตจริง จำนวน n ต้องเพิ่มได้เมื่อพบข้อกำหนดเพิ่มเติม รายการระบบหรือ Catalog ที่มีในแอปไม่ใช่ตัวจำกัดขอบเขตลูกค้า

แต่ละ q_i ต้องเก็บอย่างน้อย: ตัวตนข้อกำหนด ความหมายต้นฉบับ Source/Version ตำแหน่ง Clause/Page/Table/Cell ระบบหรือสถานที่ และ Applicability หากยังไม่ได้อ่านหรือยังขัดกัน ต้องแสดงประเด็นไว้

### 3.2 วิเคราะห์และพิสูจน์คำตอบ

$$
X_i=\operatorname{Engineer}(q_i,S_i;K_i,D_i,\Theta)
$$

X_i คือคำตอบของเราต่อข้อกำหนด q_i โดยใช้หลักฐาน Supplier ที่เกี่ยวข้อง S_i และวิธีพิสูจน์ K_i งานนี้อาจต้องเชื่อมหลายเอกสารและหลาย Supplier การจับคู่ชื่อรุ่นหรือคำประกาศ Comply เพียงอย่างเดียวไม่ยืนยันความเพียงพอของระบบ

เมื่อข้อกำหนดต้องพิสูจน์ด้วย CAL/RPT ให้เก็บ:

$$
p_k=(\text{Method},\text{Inputs},\text{Units},\text{Assumptions},\text{Criteria},\text{Results},\text{Limits},\text{Review})
$$

กำหนด P เป็นทะเบียน Proof ทั้งหมด และ P_i เป็นชุด Proof ที่เชื่อมกับ q_i โดย p_k เป็น Record หนึ่งในทะเบียน P จึงมี P_i ⊆ P ในแบบจำลองเป้าหมายหนึ่ง Proof อาจรองรับหลาย Requirement ได้โดยรักษาตัวตนหลักฐานเดียว แต่ Schema ปัจจุบันของ Proof และ Activity มี requirementId ค่าเดียวต่อ Record ขณะเดียวกัน Requirement หนึ่งข้อมี Proof/Activity หลาย Record ได้ จึงเป็นหลาย Proof/Activity ต่อหนึ่ง Requirement ไม่ใช่ข้อจำกัดหนึ่งต่อหนึ่ง

Requirement อ้าง offerIds และ workLineIds ได้หลายค่า จึงรองรับ Many-to-Many กับ Offer/Work Line ส่วน Particular ก็มี requirementIds หลายค่าเช่นกัน ไม่ควรสรุปว่าทั้ง Schema เป็น Many-to-Many เฉพาะ Offer และ Work Line

ถ้าใช้ Calculation เดียวตอบหลายข้อ ภายใต้ Schema เดิมสามารถมี Proof Review Record ต่อข้อที่อ้าง calculationId เดียวกันได้ แต่ต้องเก็บ Criteria, Interpretation และ Review ตามข้อกำหนดแต่ละข้อ ไม่คัดลอกผล PASS โดยอัตโนมัติ และไม่สร้างต้นทุนหรือกิจกรรมจริงซ้ำ หากต้องใช้ Derived Report/Activity ร่วมแบบ Record เดียว ควรเพิ่มความสัมพันธ์หรือขยาย Schema ด้วย Migration ที่ตรวจผลกระทบแล้ว ข้อกำหนดที่ไม่ต้องมี Proof แยกต้องมีเหตุผลและฐานทบทวนตาม Applicability

CAL/RPT ที่ได้รับจากลูกค้าหรือผู้ขายเป็น Source Evidence ส่วน CAL/RPT ที่เราจัดทำเป็น Derived Engineering Proof ต้องแยก ID/Version และ Dependencies กัน ผลคำนวณหรือ Design Verification ต้องแยกจาก FAT/SAT และผลทดสอบจริงที่ยังไม่เกิดขึ้น

เกณฑ์ผ่านของ Proof แบบ CAL ในโค้ดใช้ตัวดำเนินการ GTE, LTE หรือ EQ และหน่วยของเกณฑ์ต้องตรงกับหน่วยผลสมการ ตัวดำเนินการ EQ เทียบด้วย === กับตัวเลขทศนิยมแบบไบนารี ไม่มี Tolerance จึงมีโอกาสไม่ผ่านจากความคลาดเคลื่อนเล็กน้อย เช่น 0.1+0.2 ไม่เท่ากับ 0.3 แบบ Strict Equality

**ต้องรักษาความหมายเกณฑ์ลูกค้า:** ใช้ GTE/LTE เมื่อข้อกำหนดเป็นค่าขั้นต่ำ/สูงสุดจริง ห้ามเปลี่ยน EQ เป็นเกณฑ์ข้างเดียวเพียงเพื่อให้ผ่าน หากอนุญาต Tolerance ต้องระบุหน่วย วิธีเปรียบเทียบ ฐานอ้างอิง และการยอมรับก่อน เช่น |Result−Target| ≤ ε เมื่อมีเกณฑ์รองรับ สำหรับเกณฑ์ Exact Count ให้คงการเทียบตรงตามประเภทข้อมูล การเปรียบเทียบด้วย Tolerance ยังไม่ได้ถูกเพิ่มในโค้ดและต้องคง OPEN เมื่อยังพิสูจน์ไม่ได้

### 3.3 เปลี่ยนคำตอบเป็นขอบเขตที่รับผิดชอบได้

$$
W_i=\operatorname{Allocate}(q_i,X_i,P_i,D_i)
$$

W_i อาจเป็นอุปกรณ์ Software/License งานติดตั้ง งาน Integration บุคลากร การทดสอบ เอกสาร Training Spares หรือภาระผูกพันอื่นตาม Applicability ต้องระบุผู้จัดหา ผู้ทำ ผู้ตรวจ เจ้าของต้นทุน และ Deliverable/Acceptance ตามความจำเป็น

ข้อกำหนดบางข้อไม่ต้องมีราคาแยก แต่ต้องมีคำตอบ เช่น เกณฑ์ยอมรับอาจเชื่อมกับ Calculation และ Test Procedure ส่วนงานเอกสารอาจรวมอยู่ใน Package ที่มีเจ้าของต้นทุนแล้ว

## 4. Mapping หลายต่อหลายและการปิดช่องว่าง

$$
q_i\longleftrightarrow\{s_j,\ p_k,\ w_l\}
$$

ดัชนี i ใช้กับ Requirement q_i, j ใช้กับ Supplier Evidence s_j, k ใช้กับ Proof p_k และ l ใช้กับ Work Object w_l ส่วน S_i, P_i และ W_i เป็นชุด Record ของแต่ละประเภทที่เชื่อมกับ q_i ชุดเหล่านี้อาจมีสมาชิกซ้อนกันได้โดยไม่สร้าง Record ใหม่

หนึ่งข้อกำหนดอาจต้องใช้หลักฐานหลายรายการ และหลักฐานหรืองานหนึ่งรายการอาจรองรับหลายข้อกำหนดได้ จึงต้องใช้ Mapping แบบ Many-to-Many

สำหรับแต่ละข้อกำหนดให้มีผลตรวจที่แยกได้ เช่น:

| สภาพที่พบ | สิ่งที่ต้องบันทึก |
|---|---|
| มีคำตอบและหลักฐานเพียงพอ | Solution, หลักฐาน, ผลพิสูจน์ตามความจำเป็น และผลทบทวน |
| ข้อมูลยังไม่พอ | OPEN พร้อมข้อมูลที่ขาด ผลกระทบ และผู้รับผิดชอบติดตาม |
| หลักฐานขัดกัน | CONFLICT พร้อมแหล่งที่ขัดกันและแนวทางหาข้อสรุป |
| ข้อมูลฐานเปลี่ยนหลังตรวจ | STALE พร้อมรายการที่ต้องทบทวนใหม่ |
| เสนอแตกต่างจากข้อกำหนด | Deviation พร้อมเหตุผลและหลักฐานยอมรับตามอำนาจที่เกี่ยวข้อง |
| ไม่เกี่ยวข้องหรือเป็นขอบเขตผู้อื่น | เหตุผลและหลักฐานยืนยัน Applicability/Responsibility |

ตารางนี้อธิบายความหมายของสถานะ ไม่ได้กำหนด Enum ใหม่แทน Schema เดิม การยกเว้นข้อกำหนดต้องมีเหตุผลและหลักฐาน ไม่ใช้การลบรายการเพื่อทำให้ดูครบ

จากโค้ด สถานะ Requirement ที่ derive ได้มี OPEN, STALE, REVIEWED_MAPPING และ NOT_APPLICABLE ส่วน CONFLICT และ Deviation แสดงผ่านรหัสปัญหา เช่น PARTICULAR_SOURCE_CONFLICT, SOURCE_FINDING, TECHNICAL_DEVIATION_OPEN และ AVL_DEVIATION_REQUIRED ซึ่งทำให้สถานะคงเป็น OPEN จนกว่าจะปิด และ STALE มาจากรหัส STALE_DEPENDENCIES เมื่อ Fingerprint ของฐานเปลี่ยน ทั้งหมดนี้สอดคล้องกับตารางข้างต้นโดยไม่ต้องเพิ่ม Enum

## 5. สมการขอบเขต ปริมาณ และต้นทุนที่ไม่ซ้ำ

### 5.1 รวมเป็นชุดงานที่มีตัวตนเดียวกัน

$$
W=\operatorname{CanonicalUnion}(W_1,W_2,\ldots,W_n)
$$

CanonicalUnion หมายถึงรวมโดยอ้างอิงตัวตนงานจริงและ Stable ID งานร่วมที่รองรับหลายระบบต้องมี Record และ Cost Owner ที่ชัดเจน การแสดงหลายหน้าไม่สร้างต้นทุนอีกชุด

สำหรับ COMMON/shared scope ต้องรวมถึงการไม่ซ้ำของปริมาณจริงด้วย:

$$
\mathrm{Qty}_{\mathrm{COMMON},t}=\mu_t\left(\bigcup_i O_{i,t}\right)
$$

O_i,t คือชุดหน่วยงานหรือวัตถุจริงประเภท t ที่ระบบ i อ้างถึง และ μ_t คือการนับหรือการวัดตามหน่วยนั้น เช่น จำนวนอุปกรณ์ ความยาวสาย หรือคน–วันของกิจกรรมจริง ไม่ใช่การรวม Qty ของทุกระบบที่อ้างถึงงานเดียวกัน เช่น 3 ระบบใช้สวิตช์ตัวเดียวกัน จำนวนจัดหาคือ 1 ตัว หากหลักฐานระบุว่าต้องใช้คนละตัวจึงนับแยก งานที่อธิบายละเอียดขึ้นต้องคงการกระทบยอดกับเจ้าของเดิม ไม่เพิ่ม Qty ซ้ำจาก Coverage Links

### 5.2 ปริมาณและทรัพยากรต้องมาจากฐานงาน

$$
\mathrm{Qty}_l=f_l(\text{Requirement},\text{Design},\text{Site},\text{Activity},\text{Evidence};\Theta_{\mathrm{QtyBasis}})
$$

ตัวอย่างสมการทรัพยากรเมื่อเหมาะกับงาน:

$$
\mathrm{MD}=\mathrm{Events}\times\mathrm{DaysPerEvent}\times\mathrm{Crew}
$$

$$
\mathrm{MH}=\mathrm{MD}\times\mathrm{HoursPerDay}
$$

ในโค้ดสมการ E05 กำหนดให้ Events และ Crew เป็นจำนวนเต็ม ส่วน DaysPerEvent และ HoursPerDay เป็นจำนวนจริงไม่ติดลบ

ต้องระบุหน่วยของ Rate ให้ตรงกับ Quantity เช่น THB/MD ใช้กับ MD และ USD/Unit ใช้กับจำนวนหน่วยนั้น Purchase Quantity, Installed Quantity และ Spare Quantity อาจต่างกัน ห้ามนำมาคิดแรงงานติดตั้งเหมารวมโดยไม่มีฐาน

### 5.3 ต้นทุนคิดจากเจ้าของต้นทุนที่ไม่ซ้ำ

กำหนด U เป็นชุดรายการต้นทุนที่มีเจ้าของและขอบเขตไม่ซ้ำกัน โดยดัชนี u อ้างรายการต้นทุน และ c_u เป็นสกุลเงินต้นทางของรายการนั้น ต้องแปลงทุกต้นทุนเป็นสกุลเดียวกันก่อนรวม:

$$
C_{\mathrm{total,THB}}=\sum_{u\in U}\left(C_{u,c_u}\times\mathrm{FX}^{\Theta}_{\mathrm{THB}/c_u}\right)
$$

สำหรับรายการที่คิดแบบ Quantity × Rate:

$$
C_{u,c_u}=\mathrm{Qty}_u\times\mathrm{CostRate}_{u,c_u}
$$

FX ยกกำลัง Θ หมายถึงอัตราจาก FXSet ที่ระบุฉบับเดียวกันตลอดรอบข้อเสนอ โดย FX_THB/THB = 1 การใช้ USD→THB→USD ต้องใช้อัตรา THB/USD ค่าเดียวกันในชุดนี้ ห้ามใช้คนละชุดโดยไม่แสดง FX Impact และทบทวนใหม่ สำหรับ USD/EUR ถ้ายังไม่มีอัตรา วันที่ หรือแหล่งอ้างอิง ให้คงปัญหา FX OPEN ตามเส้นทางคำนวณที่เกี่ยวข้อง ค่า THB→THB ใช้ 1 ในโมเดล ไม่ต้องสร้างอัตราใหม่

โค้ดปัจจุบันรองรับสกุลเงินของ Offer/Working Line เฉพาะ THB, USD และ EUR และ FX Record มี thbPerUSD กับ thbPerEUR สกุลอื่นทำให้ validateBidWorkspace ปฏิเสธข้อมูล เช่น "Invalid offer currency/unit" แทนการนำรายการที่ไม่รองรับเข้าโมเดลเป็น OPEN ข้อผิดพลาด import ถูกจับใน BidWorkspaceContext และไม่นำเข้าข้อมูลนั้น

Rev03 อ่าน repository.js เพิ่มแล้วพบว่า loadProject0550Bid และ saveProject0550Bid ผ่าน validateBidWorkspace ด้วย จึงมีการตรวจ Schema ตอน Load/Save เช่นกัน นี่เป็นผลอ่าน Source ยังไม่ได้จำลอง Invalid Backup หรือ Browser Storage จริง การปฏิเสธสกุลที่ไม่รองรับเป็นขอบเขต Schema ไม่ใช่เหตุผลให้ผ่อน Validation ต้องเก็บหลักฐานต้นทางไว้และระบุประเด็นติดตาม การเพิ่มสกุลใหม่ต้องขยาย Schema/FX และตรวจ Migration อย่างชัดเจน ทั้งนี้ยอดแสดงเงินจริงต้องใช้ RoundingPolicy ใน §7 ร่วมด้วย

สูตรต้นทุนเชิงแนวคิดข้างต้นยังไม่แสดงการปัดเศษ หากนำยอดแสดงรายบรรทัดมารวมต้องรวมยอดรายบรรทัดตามนโยบายเดียวกัน ไม่สลับไปมาระหว่างยอดก่อนปัดและหลังปัดโดยไม่ระบุ

Package/Lump Sum ใช้ฐาน Package ที่ตรวจแล้ว รายการประกอบที่รวมอยู่ใน Package ใช้แสดง Coverage โดยไม่บวกซ้ำ ถ้า Supplier รวม OEM Engineering, FAT หรือ Packing แล้ว ต้องตรวจ Inclusion ก่อนเพิ่มต้นทุนอีกครั้ง

ค่าไม่ทราบเป็น OPEN ไม่ใช่ศูนย์ การมีราคาบางรายการไม่ทำให้ยอดนั้นเป็นราคารวมครบโครงการ

## 6. จากต้นทุนสู่ราคาขายและ Budget THB

ราคาขายของแต่ละรายการใช้วิธีที่เลือกและทบทวนไว้ในระบบเดิม ตัวอย่างความหมายทางคณิตศาสตร์:

ใน §6–§7 ดัชนี u หมายถึงรายการราคาที่มีฐานต้นทุนของตนเอง Cost_u ในตารางหมายถึงต้นทุนของรายการในสกุลเงินเดียวกับ Sell_u ก่อนแปลงตาม Θ

| วิธี | สมการ | ความหมาย |
|---|---|---|
| Direct selling rate | Sell_u = Qty_u × SellRate_u | ใช้เรตขายที่มีฐานอ้างอิง |
| Cost + Markup | Sell_u = Cost_u × (1 + m_u) | m_u เป็น Markup แบบทศนิยม เช่นเปอร์เซ็นต์ต้องหาร 100 ก่อน |
| Target Gross Margin | Sell_u = Cost_u / (1 − g_u) | g_u เป็น Gross Margin แบบทศนิยม สำหรับ Margin ไม่ติดลบให้ 0 ≤ g_u < 1 |

Markup และ Gross Margin เป็นคนละฐาน ต้องใช้วิธีที่บันทึกไว้ ไม่ใช้สองวิธีซ้อนกันโดยไม่มีนโยบายรองรับ Prime/Commercial Layer อื่นต้องเป็นไปตามฐานและสูตรเดิมที่เลือกจริง พร้อมตรวจไม่ให้คิดซ้ำ

เมื่อคิดจาก Cost/Sell คู่เดียวกันที่ Cost > 0 และ Sell > 0 ความสัมพันธ์คือ m = g/(1−g) และ g = m/(1+m) เช่น Gross Margin 20% เท่ากับ Markup 25% ตัวอย่างนี้อธิบายความสัมพันธ์ ไม่ได้กำหนด Margin ของโครงการ

### 6.1 ระบุ Cost Item และ Sell Layer เพื่อกันคิดซ้ำ

Freight, Duty, Insurance, Contingency, Bond และ Commercial Charges อื่นต้องมีบันทึก Treatment, Basis, Owner และ Inclusion ก่อนใช้ ไม่ถือว่าทุกหัวข้อเป็นต้นทุนบังคับของโครงการ

| Treatment | วิธีบันทึกและรวมราคา |
|---|---|
| INCLUDED_IN_PACKAGE | อ้างเจ้าของ Package และ Coverage; ไม่บวกเพิ่มอีก |
| SEPARATE_COST_ITEM | อยู่ใน U ครั้งเดียว พร้อม Quantity/Rate หรือฐาน Lump Sum |
| SELL_LAYER | ระบุสูตร ฐานที่ใช้คิด และลำดับ Layer; ไม่ลงยอดเดียวกันเป็น Cost Item ซ้ำ |
| COMPANY_SCOPE / EXCLUDED | มีหลักฐานความรับผิดชอบ/การยกเว้น และไม่รวมยอด TSI ตาม Disposition ที่ตรวจแล้ว |
| OPEN | ยังไม่ทราบ Inclusion หรือ Treatment ต้องเปิดประเด็นก่อนรับรองยอด |

ตัวอย่างเช่นต้นทุนค่าธรรมเนียม Bond กับส่วนเพิ่มเชิงพาณิชย์อาจเป็นคนละภาระได้ แต่ต้องอธิบายความต่าง ห้ามเรียกยอดเดียวกันสองชื่อแล้วคิดซ้ำ Contingency/Risk ต้องมีฐานและการตัดสินใจ ไม่เติมจากความเสี่ยงที่ระบุไว้โดยอัตโนมัติ

ตารางนี้เป็นข้อกำหนดเชิงออกแบบ ไม่ได้ยืนยันว่า Schema ปัจจุบันมี Treatment Field เหล่านี้ครบแล้ว

### 6.2 ราคาขายลูกค้าและชั้น Prime

โค้ดคำนวณราคาขายลูกค้าจาก Sell ของ ADDVALUE ด้วย Prime Markup อีกหนึ่งชั้น (สมการ E13) ทุกวิธีขายรวมทั้ง Direct:

$$
\mathrm{CustomerSell}_{u,c_u}=\mathrm{Sell}_{u,c_u}\times(1+\pi_u),\qquad \pi_u=\frac{\mathrm{primePct}_u}{100},\ \pi_u\ge 0
$$

π_u เป็น Markup บนฐาน Sell (ไม่ใช่ Margin) ต้องระบุค่าให้ชัด ศูนย์ใช้ได้แต่ค่าว่างหรือค่าไม่ถูกต้องทำให้รายการเป็น OPEN (Prime commercial treatment OPEN/invalid) ลำดับจึงเป็น Cost → Sell → CustomerSell

โค้ดปัดแต่ละชั้นอิสระกัน คือคำนวณจากค่าสกุลเดิมที่ยังไม่ปัด คูณ FX แล้วปัดเป็นบาทแยกกันสำหรับ Cost, Sell และ CustomerSell ดังนั้น Margin ที่คำนวณย้อนจากค่าที่แสดงอาจต่างจากค่าตั้งต้นได้ตามผลการปัด

### 6.3 การแปลงสกุลเงิน

การแปลงเป็นบาทสำหรับสกุลเงิน c:

$$
\mathrm{Value}_{\mathrm{THB}}=\mathrm{Value}_{c}\times\mathrm{FX}^{\Theta}_{\mathrm{THB}/c}
$$

FX ต้องมีวันที่และแหล่งอ้างอิงของรอบข้อเสนอ สมการในเอกสารนี้อธิบายหลักการ ไม่ใช่คำสั่งเปลี่ยน FX, Quantity, Rate, Margin หรือ Pricing Kernel ที่มีอยู่

**10.6 = Budget THB** เป็นมุมมองตรวจราคาสกุลบาทจากฐาน Working ที่เลือกตามสถานะการทบทวน ส่วน **10.7 = Release Preview USD** เป็นมุมมองแบบลูกค้าสกุลดอลลาร์ ทั้งสองต้องอ่านจาก Working Model เดียวกับ Source ไม่สร้างยอดอีกชุดที่แก้แยกกัน และแยก Base กับ Options ตามแบบลูกค้าที่ใช้งาน

## 7. สมการรวมเป็นแบบลูกค้าที่ 10.7

ให้ U_r เป็นชุดรายการราคาต้นทาง u ที่เลือกและจัดสรรเข้ารายการลูกค้า r แล้ว โดยไม่รวม Reference-only, Scope ที่ผู้อื่นจัดหา หรือ Component ที่มีเจ้าของราคารวมอยู่แล้ว

### 7.1 นโยบายปัดเศษและรวมยอด

กำหนด R2(x) เป็นการปัดจำนวนเงินเป็น 2 ตำแหน่ง สำหรับจำนวนเงินไม่ติดลบใช้ Half-up ในแบบจำลองนี้ วิธีจัดการ Credit/จำนวนเงินติดลบต้องกำหนดแยกเมื่อมีการใช้งานจริง ภายใต้การอ่านโค้ด Snapshot ที่อ้างใน §15 พบว่าลำดับหลักปัด THB ต่อบรรทัด แปลงเป็น USD ต่อบรรทัด แล้วรวม USD ของบรรทัดเหล่านั้นเป็น Lot จึงเขียนสมการให้ตรงลำดับดังกล่าว:

$$
T_u=R2\left(\mathrm{CustomerSell}_{u,c_u}\times\mathrm{FX}^{\Theta}_{\mathrm{THB}/c_u}\right)
$$

$$
D_u=R2\left(\frac{T_u}{\mathrm{FX}^{\Theta}_{\mathrm{THB}/\mathrm{USD}}}\right)
$$

$$
V_{r,\mathrm{THB}}=R2\left(\sum_{u\in U_r}T_u\right),\qquad
V_{r,\mathrm{USD}}=R2\left(\sum_{u\in U_r}D_u\right)
$$

ยอด Base รวมเฉพาะ Customer Lots ของ Base; Options รวมแยก และแถว INCLUDED ไม่นับเพิ่ม เงื่อนไขเหล่านี้ทำให้ยอด Lot ตรงกับผลรวม Amount ของบรรทัดที่เป็นเจ้าของราคาที่แสดง

สูตรเทียบแบบรวมก่อนแปลงคือ:

$$
\widehat V_{r,\mathrm{USD}}=R2\left(\frac{V_{r,\mathrm{THB}}}{\mathrm{FX}^{\Theta}_{\mathrm{THB}/\mathrm{USD}}}\right)
$$

แต่โดยทั่วไปไม่รับประกันว่าเท่ากับการรวม USD ที่ปัดต่อบรรทัด:

$$
V_{r,\mathrm{USD}}\ne\widehat V_{r,\mathrm{USD}}\quad\text{ได้จากผลการปัดเศษ}
$$

ตัวอย่างเพื่ออธิบายเท่านั้น: 3 บรรทัด บรรทัดละ 1 THB ที่อัตราสมมติ 3 THB/USD จะได้ USD บรรทัดละ 0.33 รวม 0.99 USD แต่รวม THB ก่อนแปลงจะได้ 1.00 USD ส่วนต่างนี้เป็น Rounding Difference ไม่ใช่ FX คนละอัตรา

**ขอบเขตการตรวจโค้ด:** ฟังก์ชัน round ที่อ่านใช้ JavaScript Number และ Math.round((x + Number.EPSILON) × 100) / 100 ไม่ใช่ Decimal Arithmetic ที่พิสูจน์ความถูกต้องทุกช่วงค่าแล้ว การตรวจครั้งนี้เป็นการอ่าน Source ไม่ใช่การทดสอบครบทั้งระบบหรือรับรองทุกกรณีปัดเศษ

Rev02 รายงานการทดสอบ Node กับ 9 ค่าที่ทศนิยมตำแหน่งที่ 3 เป็น 5 (1.005, 10.005, 2.675, 1.255, 100.005, 1234.565, 0.285, 8.345, 1.115) และ Rev03 ทดสอบซ้ำได้ผลปัดขึ้นทั้งหมดตามรายงาน แต่การเพิ่มตัวอย่างพบผลไม่ตรง Decimal Half-up ดังนี้:

| Input ในการทดสอบ | ผลฟังก์ชัน JavaScript ที่ใช้ | ค่าตาม Decimal Half-up 2 ตำแหน่ง |
|---|---|---|
| 10.075 | 10.07 | 10.08 |
| 4.015 | 4.01 | 4.02 |
| 128.015 | 128.01 | 128.02 |

ดังนั้นไม่รับรองว่าฟังก์ชันปัจจุบันทำตาม R2 แบบ Decimal Half-up ทุกค่า และยังไม่มีหลักฐานว่าค่าในโครงการจริงได้รับผลเท่าใด ต้องตรวจฐานตัวเลขจริงก่อนสรุปผลกระทบเชิงเงิน

ฟังก์ชัน round ประกาศแยกใน bidWorkspaceModel.js และ officialPricing0550.js โดยเนื้อหาใน Snapshot เหมือนกัน การรวม Utility ช่วยลดความต่างในอนาคตแต่ไม่แก้ Binary Rounding เอง ต้องเลือกวิธี Decimal/Scaled Integer ที่เหมาะกับ Precision ของ Quantity, Rate และ FX แล้วตรวจผลต่างกับข้อมูลเดิมก่อนใช้งานจริง การรวม Utility เป็นการปรับโครงสร้างที่ควรพิจารณาร่วมกับการแก้ตัวเลข ไม่ใช่หลักฐานว่ามีข้อผิดพลาดเพิ่มเพราะมีสองฟังก์ชัน และ Rev03 ยังไม่ได้เปลี่ยน Kernel

### 7.2 ราคาต่อหน่วยที่แสดงกับ Amount ต้องแยกฐานให้ชัด

โค้ด Customer Form ที่อ่านแสดง Unit Price โดยปัด Amount/Qty เป็น 2 ตำแหน่ง ซึ่งอาจทำให้ Unit Price ที่แสดง × Qty ไม่ตรง Amount เช่น Amount 1.00 USD, Qty 3 และ Unit Price 0.33 USD จะคูณได้ 0.99 USD

ข้อกำหนดเป้าหมายก่อนออกเอกสารคือ ต้องตรวจฐานที่แบบลูกค้ากำหนด:

- ถ้า **Line Amount เป็นฐาน** ให้รวมยอดจาก Line Amount และระบุ/แสดง Unit Price ด้วยความละเอียดที่เหมาะสมตามแบบที่ยอมรับ
- ถ้า **Unit Price × Qty เป็นฐาน** ต้องใช้ Unit Price ที่ตกลงแล้วคำนวณ Amount และรวมยอดใหม่ตามกติกาที่ได้รับอนุมัติ
- ถ้าแสดงได้เพียง 2 ตำแหน่งและยังไม่กระทบยอด ต้องเปิด Rounding Gap; ห้ามปรับ Margin, FX หรือเพิ่มรายการชดเชยโดยไม่มีเหตุผลและการอนุมัติ

**Unit Price ต่างกันระหว่าง Export:** แบบลูกค้า (officialCustomerRows) แสดง Unit Price = R2(Total/Qty) ส่วน Review XLSX (buildBidReviewXlsx) เขียน Total/Qty โดยไม่ปัด Excel แสดงสองตำแหน่งตามรูปแบบเซลล์แต่ค่าในเซลล์ละเอียดกว่า ผู้ตรวจจึงอาจเห็น Unit × Qty ตรงกับ Total ในไฟล์หนึ่งและไม่ตรงในอีกไฟล์ ต้องเลือกฐานเดียวสำหรับเอกสารที่ส่งลูกค้า และระบุว่า Review XLSX เป็นไฟล์ตรวจภายใน

**คอลัมน์ Sub-Total ในแบบลูกค้า:** ตัวเลขใน XLSX เป็นค่าตายตัว ไม่ใช่สูตร แถว Group (Qty 1 Lot), แถวรายการย่อย และแถวรวม Base/Options อยู่ในคอลัมน์ G เดียวกัน หาก SUM ทั้งคอลัมน์โดยไม่แยกระดับจะนับซ้ำ แต่สิ่งนี้ไม่พิสูจน์ว่า Base ที่โมเดลคำนวณผิด เพราะโมเดลรวมเฉพาะ Group ตามที่กำหนด

ต้องรักษา Native Customer Template และข้อกำหนดส่งมอบก่อน เลือกวิธีทำให้ระดับรวมชัด เช่น Labels, รูปแบบแถว, Outline ที่แบบรองรับ หรือรายละเอียดแยก Sheet เมื่อยอมรับได้ ไม่ย้ายคอลัมน์หรือเปลี่ยนแบบอัตโนมัติ ถ้าจะมีสูตรรวมให้รวมเฉพาะแถวที่เป็นเจ้าของยอดครั้งเดียว ต้องตรวจ Screen/Export ตามแบบจริงก่อนออกเอกสาร

การตรวจความสอดคล้องนี้เป็นข้อกำหนดที่ต้องตรวจ/พัฒนาต่อ ยังไม่ได้ยืนยันว่ามี Runtime Gate บังคับครบแล้ว และ Rev03 นี้ไม่เปลี่ยน Pricing Kernel หรือฐานราคาที่ผู้ใช้บันทึกไว้

สมการนี้ใช้เมื่อข้อมูลและฐานราคาของรายการครบ ถ้ามีต้นทางที่จำเป็นยัง OPEN ต้องแสดงความไม่ครบและระงับการรับรองยอดนั้น ไม่แทนค่าที่ขาดด้วยศูนย์

$$
R_{10.7}=\operatorname{CustomerFormProjection}(\text{Working},\text{Mapping},\text{Review};\Theta)
$$

10.7 คือการแสดงผลจากฐาน Working ที่เชื่อมและตรวจไว้ ในรูปแบบลูกค้า ต้องรักษาปริมาณ หน่วย รายการ ราคา หมายเหตุ และการแยก Options ตามแบบที่กำหนด หนึ่ง Customer Lot อาจรวมหลาย WBS ได้ แต่ห้ามบวกทั้ง Lot และรายละเอียดต้นทางซ้ำกัน

ใน UI ปัจจุบันที่อ้างถึง 10.7 เป็น **Release Preview USD / NOT ISSUED** ส่วนหลักฐานวิศวกรรม Compliance และเอกสารประกอบข้อเสนอเชื่อมจากกระบวนการเดียวกันตามสิ่งที่ RFQ ต้องการ การแสดงราคาที่ 10.7 ไม่ยืนยันว่าเอกสารประกอบทั้งหมดเสร็จแล้ว

## 8. สมการความพร้อมและการออก Release

$$
\mathrm{Ready}=\mathrm{ScopeComplete}\land\mathrm{EngineeringVerified}\land\mathrm{CommercialReviewed}\land\mathrm{Traceable}\land\mathrm{ReviewsCurrent}
$$

| เงื่อนไข | ความหมาย |
|---|---|
| ScopeComplete | ข้อกำหนดที่เกี่ยวข้องทั้งหมดมีคำตอบหรือ Disposition ที่ยอมรับได้ พร้อมงานและผู้รับผิดชอบ |
| EngineeringVerified | วิธีออกแบบและผลพิสูจน์เพียงพอต่อข้อกำหนดที่เกี่ยวข้อง |
| CommercialReviewed | ตรวจ Quote, Inclusion/Exclusion, Quantity, Unit, Rate, FX, Cost Owner และ Customer Mapping ตามความเกี่ยวข้อง |
| Traceable | จากผลข้อเสนอย้อนถึง Requirement, Source/Version และวิธีคิดได้ |
| ReviewsCurrent | ไม่มีการเปลี่ยนฐานที่กระทบผลแล้วค้างการทบทวน |

สัญลักษณ์ ∧ หมายถึง “และ” ต้องครบทุกเงื่อนไขที่ใช้กับขอบเขตการออกเอกสารนั้น

$$
\mathrm{AuthorizedIssue}=\mathrm{Ready}\land\mathrm{ReleaseAuthorization}
$$

เมื่ออนุมัติออกเอกสาร ต้องตรึงฉบับข้อมูล ข้อกำหนด การตัดสินใจ ผลคำนวณ Mapping และเอกสารส่งออกเป็น Issue Snapshot พร้อมบันทึก Issue/Transmittal ตามกระบวนการ การอนุมัติ การสร้างไฟล์ และการส่งจริงเป็นเหตุการณ์ที่ต้องแยกตรวจได้

Preview สามารถแสดงงานที่ยังไม่ครบเพื่อช่วยตรวจได้ แต่ปุ่ม Export หรือการคำนวณผ่านไม่ใช่หลักฐานอนุมัติออก Release

## 9. ตรวจย้อนกลับและผลกระทบเมื่อข้อมูลเปลี่ยน

$$
\text{Customer Source}\rightarrow\text{Requirement}\rightarrow\text{Engineering Proof / Allocation}\rightarrow\text{Working}\rightarrow\text{Budget}\rightarrow\text{10.7}
$$

$$
\text{10.7}\rightarrow\text{Working / Calculation / Decision}\rightarrow\text{Requirement}\rightarrow\text{Customer Source และ Supplier Evidence}
$$

แต่ละผลลัพธ์ต้องเปิดดูที่มาได้ถึงฉบับและตำแหน่งอ้างอิง งานที่ไม่ต้องมี CAL/RPT แยกยังต้องมีฐานการตัดสินใจตามความจำเป็น

เมื่อข้อมูล x เปลี่ยน:

$$
\mathrm{Affected}(x)=\{y\mid x\leadsto y\}=\operatorname{Descendants}_{E^{+}}(x)
$$

กำหนดกราฟ Dependency ให้เส้น a→b หมายถึง b ใช้ข้อมูล a และ E+ คือ Transitive Closure ที่ตามเส้นต่อเนื่องตั้งแต่หนึ่งชั้นขึ้นไป ดังนั้น x เปลี่ยนต้องตามผลกระทบหลายชั้น เช่น Source → Requirement → Proof → Qty/Activity → Working → Customer Lot → 10.7 จนไม่มี Record ที่ได้รับผลกระทบเพิ่ม ใช้ Stable ID/Version และติดตาม Record ที่เยี่ยมแล้วเพื่อไม่วนซ้ำเมื่อมีวงจร

รายการต้นเหตุ x ต้องบันทึกการเปลี่ยนของตนเองด้วย ส่วน Issued Snapshot ไม่ถูกแก้ย้อนหลัง แต่ต้องแสดงว่าฉบับใหม่กระทบสิ่งที่เคยออกอย่างไร นิยามนี้เป็นสัญญาการออกแบบ ไม่ใช่คำรับรองว่าโค้ดมี Graph Traversal ครบทุกความสัมพันธ์แล้ว

จากโค้ด ผลกระทบถูกตรวจด้วย basisKey (Fingerprint) ของ Record ซึ่งรวมข้อมูล Dependency ที่โปรแกรมเลือกไว้ เมื่อฐานเปลี่ยน ผลทบทวนอาจเป็น STALE หรือทำให้ Downstream กลับ OPEN ตามเส้นทางตรวจ โดยแถวราคามีฐานของ Requirement ที่เชื่อมและข้อมูลเกี่ยวข้องอยู่ด้วย จึงมีการส่งผลข้ามหลายชั้นตาม Wiring ที่กำหนด แต่ไม่ได้พิสูจน์ว่า Dependency ทุกประเภทถูกครอบคลุม หรือว่ามี Transitive Closure Engine ครบแล้ว

Fingerprint เป็น Change Detector ไม่ใช่ลายเซ็นอนุมัติหรือการเทียบ File Bytes ใช้ Hash 32 บิตสองชุดร่วมกับความยาวข้อความ ไม่ใช่ Cryptographic Hash และไม่รับรองว่าไม่มี Collision ไม่มีหลักฐานรายการ Affected(x) ที่แจกแจงเส้นทางครบจากโค้ดส่วนที่อ่าน การพัฒนารายการผลกระทบต้องตรวจการครอบคลุม Dependency ต่อ ไม่ถือว่า Hash ซ้อนแทน Impact Graph ได้ทั้งหมด

ต้องตรวจรายการที่พึ่งพา x และทำให้ผลทบทวนที่ได้รับผลกระทบต้องตรวจใหม่ เช่น เปลี่ยน Datasheet อาจกระทบ Proof, Quantity และ Price Mapping เอกสารชื่อหรือ Revision เดียวกันแต่เนื้อหาต่างกันก็ต้องตรวจ ผล Working ใหม่ต้องไม่เขียนทับประวัติที่ออกไปแล้ว

## 10. เชื่อมกับ Working Preview ขั้นตอน 1–8

| ขั้น | งานที่ต้องทำ | ผลที่ส่งต่อ |
|---|---|---|
| WP.1 | อ่านเอกสารลูกค้าและตรวจ Coverage ทุกระบบรวม COMMON | ชุดข้อกำหนดพร้อมแหล่งอ้างอิงและช่องว่าง |
| WP.2 | จัดทำ Derived CAL/RPT ด้วยวิธี Input และเกณฑ์ที่มีฐาน | ผลพิสูจน์ ข้อจำกัด และสถานะทบทวน |
| WP.3 | กำหนด Architecture, Interfaces และความรับผิดชอบ | Solution และขอบเขตเชื่อมต่อ |
| WP.4 | เชื่อม Clause, Customer Source, Supplier Evidence และ Allocation | Mapping ที่ตรวจย้อนกลับได้ |
| WP.5 | กำหนด BOM/Quantity และเจ้าของต้นทุน | รายการอุปกรณ์และปริมาณที่มีฐาน |
| WP.6 | กำหนด Installation, Integration, Personnel, ITP, VDRL/SDRL และ Deliverables | งานบริการ ทรัพยากร และภาระส่งมอบ |
| WP.7 | กระทบยอดลูกค้า–Integrator–Supplier และตรวจย้อน Offer | ขอบเขตที่ตกลงได้ พร้อมข้อยกเว้นและช่องว่าง |
| WP.8 | ตรวจ Gaps, Changed Dependencies และ Working Readiness | สิ่งที่พร้อมส่งต่อและสิ่งที่ยังต้องปิด |

ขั้นตอนเหล่านี้เป็นการใช้ข้อมูลร่วมกัน งานอาจย้อนกลับไปแก้และทบทวนได้ ไม่ได้หมายความว่าผู้ใช้ต้องเปิดทุกแท็บตามลำดับทุกครั้ง

## 11. ตัวอย่างเส้นทางของคำตอบหนึ่งข้อ

ตัวอย่างนี้เป็นคำอธิบายวิธีทำงาน ไม่ใช่ข้อกำหนดหรือราคาใหม่ของโครงการ

| ลำดับ | งาน | สิ่งที่ต้องได้ |
|---|---|---|
| 1 | ลูกค้าระบุสมรรถนะระบบในเอกสาร A | Requirement พร้อม Clause และเกณฑ์ยอมรับ |
| 2 | Supplier ส่งรุ่นและ Datasheet | หลักฐานคุณสมบัติของรุ่นที่เสนอ |
| 3 | เราตรวจคุณสมบัติร่วมกับข้อมูลพื้นที่และ Interfaces | CAL/RPT หรือ Engineering Basis ตามความจำเป็น |
| 4 | กำหนดอุปกรณ์และงานที่ยังต้องทำ | Qty, Unit, Activities, Deliverables และ Responsibilities |
| 5 | ตรวจสิ่งที่ Supplier รวมและไม่รวม | Cost Owner แต่ละงานที่ไม่ซ้ำ |
| 6 | ใช้ Quote/Rate และวิธีขายที่ทบทวน | Working Cost/Sell และ Budget THB |
| 7 | รวมเข้ารายการในแบบลูกค้า | 10.7 Preview USD พร้อมลิงก์ย้อนต้นทาง |
| 8 | ปิดประเด็นที่จำเป็นและอนุมัติ Issue | Frozen Release พร้อมบันทึกการออกเอกสาร |

ถ้า Input สำหรับพิสูจน์ยังขาด ต้องระบุชื่อ Input แหล่งที่ต้องติดตาม และผลกระทบต่อรายการนั้น การมี Quote แล้วไม่ทำให้ข้อกำหนดวิศวกรรมผ่านเอง

## 12. สมการสรุปสำหรับใช้อ้างอิง

$$
\boxed{(A,S;K,D,\Theta)\xrightarrow{F_{\mathrm{SI}}\ \text{ภายในเมนู B}}R_{10.7}}
$$

$$
\boxed{\text{อ่าน}\rightarrow\text{วิเคราะห์}\rightarrow\text{ออกแบบและพิสูจน์}\rightarrow\text{กำหนดขอบเขตและปริมาณ}\rightarrow\text{คำนวณราคา}\rightarrow\text{ตรวจครบ}\rightarrow\text{10.7}}
$$

$$
\boxed{\text{Ready}+\text{อนุมัติออกเอกสาร}\rightarrow\text{ตรึงฉบับและออก Release}}
$$

**มีข้อมูลแล้ว งาน F_SI ภายในเมนู B ต้องนำไปสร้างคำตอบให้ A จนถึง 10.7 ส่วนที่ยังทำไม่ได้ต้องเปิดเผยสิ่งที่ขาดและผลกระทบให้ตรวจได้**

## 13. การเชื่อมสมการกับโมดูลและจุดควบคุม

### 13.1 ตำแหน่งแสดงหลักการ

- **03 Architecture:** แสดงสมการหลัก บทบาท A/S/F_SI ตารางหน้าที่โมดูล และเงื่อนไขควบคุม เป็นคำอธิบายกลางของ Web App
- **bid.budget.guide:** แสดงฉบับย่อและลิงก์ไปโมดูลที่เกี่ยวข้อง โดยอ้างนิยามกลางเดียวกัน
- **หลักการของแต่ละโมดูล:** ระบุ Input, วิธีคิด, Output, Dependencies, ข้อจำกัด และรายการที่ต้องผ่านก่อนส่งต่อ

ทั้งหมดนี้เป็นข้อเสนอการแสดงผลใน UI เอกสาร Rev01 ยังไม่ได้แก้หน้าเว็บหรือสร้าง Module ID ใหม่

### 13.2 หน้าที่และการส่งต่อ

| โมดูล | งานในสมการ | ผลส่งต่อ/ฐานที่ต้องตรวจ |
|---|---|---|
| เมนู A · Original RFQ | ข้อมูล A | Source/Version, Authority, Content และ Locator |
| 01 Executive | ภาพรวม Scope และ Readiness | ระบบ งานร่วม และประเด็นที่ยังเปิด |
| 02 First Principles | Engineer / Proof | CAL/RPT, Inputs/Units, Criteria และ Review |
| 03 Architecture | หลักการโครงสร้าง Web App | หน้าที่โมดูลและขอบเขตการบังคับใช้จริง |
| 04 Systems / Requirements | ExtractReview / Mapping | Requirement, Applicability และการจัดสรรงาน |
| 05.3 Schematic | Solution / Interfaces | Topology, Interface Basis และความรับผิดชอบ |
| 06 Execution / Resources | Allocate | Activities, People, ITP, VDRL/SDRL และ Deliverables |
| 07 Vendors / Evidence | ข้อมูล S | Offer, Catalog/Datasheet, Terms และ Inclusions/Exclusions |
| 08 Risk / Gates | Gaps / Impact | ประเด็น ผลกระทบ เจ้าของ และการปิดประเด็น |
| 09 Data / Trace | Canonical Records / Trace | Stable ID, Version และลิงก์ตรวจย้อนกลับ |
| 10 Bidding / Commercial | Qty / Cost / Sell / Projection | Working → 10.6 Budget THB → 10.7 Preview USD |
| AVL / Deviation | Supplier Eligibility / Disposition | หลักฐาน AVL และการยอมรับ Deviation ตามความเกี่ยวข้อง |
| เมนู C · Communications & Submissions | Clarification / Issue Records | ฉบับที่ส่ง การตอบรับ และการชี้แจงที่นำกลับไปทบทวน |

ตารางเป็นความรับผิดชอบที่ต้องเชื่อม ไม่ใช่การรับรองว่าทุกแท็บมีความสามารถครบแล้ว ห้ามทำข้อมูลสำเนาอีกชุดเพื่อใช้แสดงในแต่ละหน้า

### 13.3 จุดควบคุมที่พบจากการอ่านโค้ด

Rev02 ระบุว่าอ่านจาก commit `ac3e239` และรายงานว่าเป็น HEAD ณ เวลาของผู้ตรวจ Rev03 ตรวจซ้ำโดยตรึง Snapshot เต็ม `ac3e2391a78f75908719bc0dcf55f798198372a8` ไม่อ้างว่าเป็น HEAD ปัจจุบัน อ่าน Source เพิ่มและทดสอบเฉพาะ Equation Runtime/ตัวอย่างตัวเลขที่ระบุใน §14.0 ไม่ได้รัน Browser Test, Build หรือใช้ข้อมูลโครงการจริง

| จุดในโค้ด | สิ่งที่อ่านพบ | ขอบเขตของข้อสรุป |
|---|---|---|
| BidWorkspaceContext / repository / IndexedDB adapter | Provider ส่ง Integration Model เข้า deriveBidWorkspace; reviewDate ใช้ Asia/Bangkok; Load/Save/Import ผ่าน Schema Validation; Adapter เทียบ expectedRevision ใน Readwrite Transaction และ abort ถ้าไม่ตรง พร้อมเก็บ revision record | เป็น Wiring/Transaction Logic ที่อ่าน ยังไม่ได้ทดสอบหลาย Browser Tabs หรือ IndexedDB จริง |
| integrationWorkspace0550 | ระบุในโค้ดว่า derive สถานะเท่านั้น ไม่เขียน Quantity, Price หรืออนุมัติ; ตรวจ Source/Excerpt, Proof, Activity, Particular, AVL, Deviation และการอ่านเอกสารครบหน้า; ใช้ basisKey ตรวจ STALE; ready ต้องทุก Scope ผ่านและไม่มี documentGaps; releaseAllowed:false; Proof/Activity อ้าง requirementId ค่าเดียว; เกณฑ์ EQ ใช้ === | มี Checks ใน Source ไม่ยืนยันว่าข้อมูลโครงการถูกอ่านและกรอกครบ |
| serviceEquationRuntime | E05, E10–E13, E17 ตรงกับสมการใน §5–§7; Margin จำกัด 0 ≤ g ≤ 0.999999; มีสมการวิศวกรรมอื่น เช่น RF, Fiber, Power และ CCTV ด้วย; ผลสมการมี engineeringAccepted:false | ทดสอบเฉพาะตัวอย่าง Runtime 10 Assertions ตาม §14.0 ผลคำนวณไม่ใช่การรับรอง Design/FAT/SAT |
| bidWorkspaceModel | คำนวณ Cost/Sell/Prime/FX; ปัด THB และ USD ต่อบรรทัด; ตรวจ scopeKey ซ้ำเป็น DUPLICATE_SCOPE_OWNER; แยกแถว INCLUDED และ COMPANY_SUPPLY; รองรับสกุล THB/USD/EUR; Provisional ข้ามปัญหา Quote ไม่มีวันที่/หมดอายุ/FX OPEN ในการคำนวณ แต่ยังต้องมี FX จึงคำนวณ THB ได้ | ตรวจซ้ำตาม Key/Mapping ไม่พิสูจน์ว่าเข้าใจงานร่วมทุกกรณี; Provisional ไม่ใช่ราคาที่ผ่านทบทวน |
| officialPricing0550 | ตรวจ Review, Source, Mapping, Integration และ STALE ก่อนรวมยอด; Lot = ผลรวมแถวย่อยที่ปัดแล้ว; sumOfficial คืน null ถ้ามีแถวใดไม่พร้อม; Base ใช้ Part A+B, Options ใช้ Part C | Official และ Provisional เป็นคนละสถานะ ห้ามเรียก Provisional ว่าผ่าน Review แล้ว |
| officialCustomerRows / Export | Unit Price แบบลูกค้า = R2(Total/Qty); Review XLSX ไม่ปัด; ตัวเลขเป็นค่าตายตัว | ตามที่ระบุใน §7.2 ยังต้องตรวจ Unit Price × Qty และไฟล์จริง |
| bidPresentation0550 | Registry นิยาม 10.0–10.8; 10.6 = Budget THB, 10.7 = Official customer form (REL-04) | ตรงกับ §6; เป็นข้อมูลแสดงผล ไม่ถูกใช้ในการคำนวณตามหมายเหตุในไฟล์ |
| Release State | releaseAllowed:false และ HOLD ในโมเดลต้นทาง, Official, Provisional และ Integration; ในไฟล์ที่อ่านไม่พบกลไก Issue Snapshot หรือ Transmittal | มีสถานะระงับ ยังไม่ใช่ระบบอนุมัติ/ส่งเอกสารที่ทำครบแล้ว |
| ADR-0550-001 และ Working Preview 1–8 | ADR มีสถานะ ACCEPTED DOMAIN PRINCIPLES / IMPLEMENTATION PARTIAL และระบุว่า 0553 ใช้เป็นแนวทางเท่านั้น ห้ามนำข้อเท็จจริงของ 0553 มาแทนข้อมูล 0550; รายงาน Working Preview ระบุผล Build/Test และข้อจำกัดของผู้พัฒนา | ผล Build/Test เป็นรายงานของผู้พัฒนา ยังไม่ได้รันซ้ำ |

หลักการใน ADR เป็นเกณฑ์ให้พัฒนาและตรวจสอบ ข้อความในเอกสาร/Guide ไม่ทำให้เกิด Runtime Gate เอง ทุกการรายงานผลต้องแยก “หลักการที่กำหนด”, “โค้ดที่อ่านพบ”, “ทดสอบแล้ว” และ “ข้อมูลโครงการที่ตรวจจริง”

### 13.4 ช่องว่างระหว่างเอกสารกับโค้ดที่ยังเหลือ

| # | รายการ | ประเภท | ตำแหน่ง |
|---|---|---|---|
| 1 | CustomerSell ต้องรวมชั้น Prime | แก้เอกสารแล้ว | §6.2 |
| 2 | Unit Price สองแบบระหว่าง Export | ระบุในเอกสารแล้ว ต้องเลือกฐานเดียวก่อนส่งลูกค้า | §7.2 |
| 3 | คอลัมน์ Sub-Total รวมหลายระดับ | ต้องตรวจการอ่าน/รวมยอดตาม Native Template; ไม่เปลี่ยน Layout จนกว่าจะยืนยันข้อกำหนดแบบ | §7.2 |
| 4 | สกุลเงินนอก THB/USD/EUR ถูกปฏิเสธ | เป็นขอบเขต Schema ที่อธิบายแล้ว; ขยายเฉพาะเมื่อมีความต้องการจริง ไม่ผ่อน Validation | §5.3 |
| 5 | Proof/Activity Record ผูก Requirement ได้หนึ่งค่า; Requirement มีหลาย Record ได้ | รองรับ Review ต่อข้อโดยอ้าง Calculation เดิม หรือวาง Migration สำหรับ Shared Mapping โดยไม่คิดงานซ้ำ | §3.2 |
| 6 | เกณฑ์ EQ ไม่มี Tolerance | ห้ามเปลี่ยนความหมายเกณฑ์เพื่อให้ผ่าน; พัฒนา Tolerance เมื่อมีฐานยอมรับ | §3.2 |
| 7 | Rounding บางค่าต่างจาก Decimal Half-up และ round อยู่สองไฟล์ | ยืนยัน Counterexamples แล้ว; ต้องตรวจผลกระทบและแนวทางตัวเลขก่อนแก้ Kernel; การรวม Utility เป็นเพียงส่วนหนึ่ง | §7.1 |
| 8 | ไม่มีรายการ Affected(x) ที่ระบุได้ล่วงหน้า | งานพัฒนาต่อ | §9 |
| 9 | ไม่พบ Issue Snapshot / Transmittal ในไฟล์ที่อ่าน | งานพัฒนาต่อ ต้องตรวจไฟล์อื่นก่อนสรุป | §8 |

## 14. บันทึกแก้ไข

### 14.0 Rev03 — ผลทบทวน Rev02 และการตัดสินใจ

| ประเด็น | ข้อสรุป Rev03 | สิ่งที่ปรับ |
|---|---|---|
| Prime CustomerSell และลำดับ Cost→Sell→CustomerSell | เห็นด้วย | คงสมการและตรวจ E13 ด้วย Runtime |
| Currency Validation, E05, Margin Bounds และ Hold | เห็นด้วยตาม Source Snapshot | เพิ่มข้อสรุป Load/Save Validation และ Revision Conflict จากไฟล์ที่อ่านเพิ่ม |
| Proof/Activity มี requirementId ค่าเดียว | เห็นด้วย แต่แก้คำอธิบาย Cardinality | หนึ่ง Requirement มีหลาย Proof ได้; หลักฐานร่วม/Calculation ไม่ต้องเพิ่มต้นทุนซ้ำ |
| ใช้ GTE/LTE แทน EQ | เห็นด้วยเฉพาะเมื่อเกณฑ์จริงเป็นข้างเดียว | ไม่ยอมรับการเปลี่ยนตัวดำเนินการเพื่อให้ผ่าน ต้องรักษาเกณฑ์และมีฐาน Tolerance |
| ผล round ผ่าน 9 ตัวอย่าง | ทดสอบซ้ำได้ แต่ไม่พอยืนยันนโยบาย | เพิ่ม 3 Counterexamples ที่ไม่ตรง Decimal Half-up |
| รวม round Utility | เห็นด้วยเป็นแนวปรับโครงสร้าง | ไม่ถือว่าการรวมฟังก์ชันแก้ปัญหาทศนิยม ต้องตรวจ Arithmetic/Precision และผลกระทบ |
| ต้องปรับ Layout Sub-Total | เห็นด้วยเรื่องความเสี่ยง แต่ไม่รับการเปลี่ยนแบบทันที | ให้รักษา Native Template และตรวจการรวมเฉพาะระดับที่เป็นเจ้าของยอด |
| Fingerprint เป็นกลไก Change Detection | เห็นด้วย | ระบุข้อจำกัด Dependency Coverage/Collision และไม่อ้าง Graph Traversal ครบ |
| Issue Snapshot / Transmittal | ยังไม่ยืนยัน Implementation ครบ | ไม่พบกลไกดังกล่าวในไฟล์ที่อ่าน; Revision History ที่มีไม่ใช่ Controlled Issue โดยอัตโนมัติ |

**การตรวจที่ทำจริงใน Rev03**

1. เทียบไฟล์ Claude Rev02 กับ Rev01 และอ่าน Source ที่อ้างโดยตรึง Commit รวม serviceEquationRuntime, integrationWorkspace, repository และ IndexedDB adapter เพิ่มจากส่วนราคาที่อ่านก่อนหน้า
2. ใช้ Source ของ evaluateServiceEquation จาก Commit ดังกล่าวทดสอบ 10 Assertions: MD/MH, Events เป็นจำนวนเต็ม, Days เป็นเศษได้, Markup, Margin, Prime, Prime ที่ขาด, FX และ Margin ที่ไม่ถูกต้อง ผ่านทั้งหมด ส่วน Import SERVICE_EQUATIONS ซึ่งใช้กับข้อความสูตรถูกแทนด้วยทะเบียนว่างเฉพาะ Harness ไม่ใช้ผลนี้อ้างการทำงานเต็มแอป
3. รันฟังก์ชัน round แบบเดียวกับ Source ซ้ำกับ 9 ตัวอย่างของ Claude และเพิ่ม 3 Counterexamples; ตรวจ Strict Equality ของ 0.1+0.2 กับ 0.3 แยกต่างหาก
4. ตรวจโครงสร้าง Markdown และความครบของบทแก้ไขก่อนส่งออก ไม่มี Full Build, Browser Test, Private Project Data Test หรือการแก้ Source Code ในรอบนี้

ผลทดสอบตัวอย่างยืนยันพฤติกรรมเฉพาะค่าที่ตรวจ ไม่ยกระดับ Conceptual Model ให้เป็นการรับรองความครบถ้วนของโครงการ ไม่เปลี่ยน Financial Inputs หรือ Release Authorization

### 14.1 Rev02 ตามผลตรวจโค้ด

| ข้อ | การแก้ไข | ตำแหน่ง |
|---|---|---|
| 1 — Prime layer | เพิ่ม CustomerSell = Sell × (1+π) และการปัดแยกชั้น | §2.1, §6.2 |
| 2 — สกุลเงิน | ระบุสกุลที่รองรับและพฤติกรรม throw ของ validateBidWorkspace | §5.3 |
| 3 — Unit Price และ Sub-Total | ระบุความต่างระหว่าง Export และความเสี่ยงนับซ้ำในคอลัมน์ G | §7.2 |
| 4 — Rounding | เพิ่มผลทดสอบ 9 ค่าและข้อเสนอรวม Utility | §7.1 |
| 5 — Proof/Activity | แก้ข้อความ Many-to-Many ให้ตรง Schema ปัจจุบัน และเพิ่มหมายเหตุเกณฑ์ EQ | §3.2, §4 |
| 6 — Affected(x) | อธิบายกลไก Fingerprint และข้อจำกัด | §9 |
| 7 — E05 | ระบุว่า Events และ Crew เป็นจำนวนเต็ม | §5.2 |
| 8 — §13.3 | ปิดรายการอ่านโค้ดครบทุกไฟล์ที่อ้าง และเพิ่ม §13.4 รายการค้าง | §13.3–§13.4 |

Rev02 แก้เอกสารและอ่านโค้ดผ่าน GitHub แบบอ่านอย่างเดียว ไม่มีการแก้ Source Code, Quantity, Rate, FX, Margin, Scope หรือ Release Authorization

### 14.2 Rev01 ตามข้อทบทวนเดิม (คงไว้)

| ข้อจาก Claude | การแก้ไข | ตำแหน่ง |
|---|---|---|
| 1 — สัญลักษณ์ B | ใช้ S กับ Supplier, F_SI กับกระบวนการ และ “เมนู B” กับ UI | §1, §12 |
| 2 — สกุลเงินต้นทุน | แสดง C_u,c และ FX ชุด Θ ก่อนรวมเป็น THB | §5.3, §6 |
| 3 — Qty งานร่วม | ใช้การนับ/วัดหน่วยงานจริงที่รวมไม่ซ้ำ | §5.1 |
| 4 — Rounding | แสดงลำดับปัดต่อบรรทัดก่อนรวม Lot พร้อม Unit Price Gap | §7.1–§7.2 |
| 5 — Θ | นิยามองค์ประกอบและเชื่อมเข้าปริมาณ ราคา FX และ Projection | §2.1, §3, §5–§7 |
| 6 — Commercial Layers | เพิ่ม Treatment Table ป้องกัน Cost/Sell Layer ซ้ำ | §6.1 |
| 7 — Affected(x) | นิยามผลกระทบหลายชั้นด้วย Transitive Closure | §9 |
| 8 — ดัชนีและ 10.6 | นิยาม Record/Set และดัชนีให้ชัด; นิยาม Budget THB | §3–§7 |

เพิ่ม §13 ตามคำถามเรื่องการเชื่อมสมการกับโมดูล Rev01 เป็นการแก้เอกสารและอ่านโค้ดเฉพาะส่วน ไม่มีการแก้ Source Code, Quantity, Rate, FX, Margin, Scope หรือ Release Authorization

## 15. แหล่งอ้างอิงและขอบเขตการใช้เอกสาร

- [ADR-0550-001 — System Integrator and Bidirectional Requirements Traceability](https://github.com/addvalue-genesis/genesis-portal/blob/ac3e2391a78f75908719bc0dcf55f798198372a8/docs/architecture/ADR-0550-001-integrator-traceability.md): บทบาทซ้าย–กลาง–ขวา หลักการ 1–14 และขอบเขตระหว่าง Source กับ Derived Proof
- [Working Preview 1–8 — Checkpoint 29-Oct-2026](https://github.com/addvalue-genesis/genesis-portal/blob/ac3e2391a78f75908719bc0dcf55f798198372a8/docs/handoff/pj2608-0550/20261029_WORKING_PREVIEW_1_TO_8.md): หน้าที่ WP.1–WP.8 และข้อจำกัดของผลตรวจที่บันทึกไว้
- [Bid Presentation Registry](https://github.com/addvalue-genesis/genesis-portal/blob/ac3e2391a78f75908719bc0dcf55f798198372a8/frontend/src/project0550/bidPresentation0550.js): ความหมายหัวข้อ 10.0–10.8 และ Module ID
- ข้อตกลงในบทสนทนาวันที่ 29 ตุลาคม 2026: A เป็นโจทย์ลูกค้า เมนู B รวมข้อมูล Supplier และงาน Integrator ส่วน 10.7 เป็นผลข้อเสนอ
- ข้อทบทวนจาก Claude ที่ผู้ใช้ส่งในบทสนทนาวันที่ 29 ตุลาคม 2026: ตรวจเฉพาะเอกสาร Rev00 และเสนอปรับ 8 ประเด็น ไม่ใช่การรับรองโค้ดหรือข้อมูลโครงการ
- [BidWorkspaceModel — Snapshot ที่อ่านสำหรับ Rev01](https://github.com/addvalue-genesis/genesis-portal/blob/ac3e2391a78f75908719bc0dcf55f798198372a8/frontend/src/project0550/data/bidWorkspaceModel.js): ลำดับ Cost/Sell/FX และการปัดรายบรรทัด
- [Official Pricing — Snapshot ที่อ่านสำหรับ Rev01](https://github.com/addvalue-genesis/genesis-portal/blob/ac3e2391a78f75908719bc0dcf55f798198372a8/frontend/src/project0550/data/officialPricing0550.js): การรวม Lot และ Unit Price ใน Customer Form
- [Customer Form Export — Snapshot ที่อ่านสำหรับ Rev01](https://github.com/addvalue-genesis/genesis-portal/blob/ac3e2391a78f75908719bc0dcf55f798198372a8/frontend/src/project0550/exportOriginalPriceForm.js): การใช้ Customer Row Projection ใน XLSX และ Unit Price ของ Review XLSX
- [Service Equation Runtime — Snapshot ที่อ่านสำหรับ Rev02](https://github.com/addvalue-genesis/genesis-portal/blob/ac3e2391a78f75908719bc0dcf55f798198372a8/frontend/src/project0550/serviceEquationRuntime.js): สมการ E05, E10–E13, E17 และช่วงค่าที่ยอมรับ
- [BidWorkspaceContext — Snapshot ที่อ่านสำหรับ Rev02](https://github.com/addvalue-genesis/genesis-portal/blob/ac3e2391a78f75908719bc0dcf55f798198372a8/frontend/src/project0550/BidWorkspaceContext.jsx): Wiring ของ Provider, เขตเวลา reviewDate และการ import
- [Integration Workspace — Snapshot ที่อ่านสำหรับ Rev02](https://github.com/addvalue-genesis/genesis-portal/blob/ac3e2391a78f75908719bc0dcf55f798198372a8/frontend/src/project0550/data/integrationWorkspace0550.js): Requirement/Proof/Activity/AVL/Deviation, basisKey และสถานะ ready
- ข้อทบทวนรอบที่สองจาก Claude (29 ตุลาคม 2026): ตรวจ Rev01 เทียบโค้ดที่อ่านจาก GitHub และทดสอบฟังก์ชัน round ด้วย Node ไม่ใช่การรับรองโค้ดหรือข้อมูลโครงการ
- [Data Repository — อ่านเพิ่มใน Rev03](https://github.com/addvalue-genesis/genesis-portal/blob/ac3e2391a78f75908719bc0dcf55f798198372a8/frontend/src/project0550/data/repository.js): Schema Validation ใน Load และ Save
- [IndexedDB Adapter — อ่านเพิ่มใน Rev03](https://github.com/addvalue-genesis/genesis-portal/blob/ac3e2391a78f75908719bc0dcf55f798198372a8/frontend/src/project0550/data/adapters/bidIndexedDbAdapter.js): expectedRevision, Transaction Abort และ Revision Records ซึ่งยังไม่เท่ากับการอนุมัติ Issue/Transmittal

สัญลักษณ์ในเอกสารเป็นแบบจำลองเพื่ออธิบายหน้าที่และเงื่อนไข ไม่ใช่ชื่อ Field/Function ใหม่ที่จะต้องสร้างในโค้ด การนำไปพัฒนาต้องใช้โครงสร้างเดิม รักษา Stable ID, Canonical Data, Cost Ownership และ Frozen History พร้อมตรวจ Implementation จริงก่อนรายงานว่าบังคับใช้ครบแล้ว
