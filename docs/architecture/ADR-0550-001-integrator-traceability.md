# ADR-0550-001 — System Integrator and Bidirectional Requirements Traceability

Date: 2026-10-28

Status: ACCEPTED DOMAIN PRINCIPLES / IMPLEMENTATION PARTIAL

Scope: PJ2608-0550. This decision records the user's explicit requirements in the
current architecture discussion. It does not approve engineering, quantities,
prices or a customer release. The audited application checkpoint was `1bb3d04`;
the live localhost application has not been proven to run that checkpoint.

## 1. บทบาทที่ผู้ใช้กำหนด

| ฝั่งซ้าย — A: Customer sources | ตรงกลาง — Web App / เราเป็น System Integrator | ฝั่งขวา — B: Supplier sources |
|---|---|---|
| RFQ, procurement/contract documents, MR, PHI, BOD, DTS, SPE, BLD, LAY, DWG, LIS, RPT, CAL, PTTEP/company STD, appendices, comments, installation/testing/document requirements | อ่าน คิด วิเคราะห์ ออกแบบ และจัดทำ CAL/RPT ของเราเพื่อพิสูจน์ความเพียงพอของข้อเสนอและการรวมระบบ จากนั้นกำหนดขอบเขต ปริมาณ ทรัพยากร เอกสาร และราคา | MGW/INDUSTRONIC quotations and technical offers, catalogs/datasheets already available in Drive, BOQ, compliance responses, licenses, services, personnel, deliverables, terms, inclusions/exclusions and clarifications |

ผู้ใช้ยืนยันว่ามีข้อมูลต้นทางทั้งสองฝั่งอยู่แล้ว งานหลักคือใช้ข้อมูลนั้นอ่านให้ถูก
และ map ให้ตรง ความพร้อมของแหล่งข้อมูลไม่เท่ากับอ่านเนื้อหา ตรวจ revision
หรือพิสูจน์ mapping ครบแล้ว ต้องใช้แหล่งที่มีอยู่ก่อนขอข้อมูลเดิมซ้ำ

Clarification recorded 2026-10-28: ผู้ใช้กำหนดให้ทำครบทุกระบบตามเอกสารฝั่งลูกค้า
และงานร่วม ไม่ลดขอบเขตเป็นเพียง CCTV pilot งานตรงกลางคือสมองของ System
Integrator ต้องอ่านแล้วคิดและตอบให้ตรงกับความต้องการ การจับคู่รายการเป็นเพียง
ส่วนหนึ่งของกระบวนการ ต้องมี engineering verification ว่าข้อเสนอใช้ได้จริงใน
บริบทโครงการ โดยใช้ catalog/datasheet และเอกสารที่มีอยู่ ไม่หยุดที่คำประกาศ comply
หรือรุ่นสินค้าตรงชื่อ

คำว่า A/B ในตารางเป็น **บทบาทข้อมูลใน domain** ปัจจุบันเมนู A คือ Original
RFQ, เมนู B คือ Engineering & Bid Preparation และเมนู C คือ Communications
& Submissions; เมนู B จึงยังรวมงาน Integrator และ Supplier อยู่ด้วย ส่วน
Part A/B/C ในแบบราคาลูกค้าเป็นอีก namespace หนึ่ง ห้ามเปลี่ยน labels, IDs,
schema หรือ cost ownership เพื่อให้ตรงกับภาพซ้าย/ขวาโดยไม่มี migration ชัดเจน

## 2. หลักการบังคับของ domain

1. **เอกสารต้องเป็นข้อมูลที่ใช้งานได้:** ทุกเอกสารของโครงการต้องได้รับการจัดประเภท
   ระบุฉบับ/authority และพิจารณาความเกี่ยวข้อง เนื้อหาที่ใช้ตัดสินใจต้องจัดเป็น
   structured requirements, interfaces, quantities, activities, deliverables หรือ
   terms ตามความหมาย พร้อมรักษาต้นฉบับและตำแหน่งอ้างอิง การมีลิงก์หรือ metadata
   ไม่เท่ากับการอ่าน วิเคราะห์ หรือยืนยันความครบถ้วน
2. **แยก source fact กับ interpretation:** เก็บข้อความ/ตาราง/รูปต้นฉบับแยกจาก
   คำตีความและการตัดสินใจของ Integrator ไม่เติมหน่วย ปริมาณ หรือ scope จากการเดา
   แบบ drawing ต้องตรวจภาพ สเกล หน่วย legend และ notes ที่เกี่ยวข้องด้วย
3. **Mapping รายข้อและสองทิศทาง:** ข้อกำหนดลูกค้าแต่ละข้อเชื่อม supplier evidence
   และงานของเราได้; offer line แต่ละรายการย้อนกลับได้ว่ารองรับข้อกำหนดใด
   หรือเป็นส่วนเพิ่ม/ทางเลือกด้วยเหตุผลอะไร Mapping เป็น many-to-many;
   ห้ามบังคับหนึ่ง requirement เท่ากับหนึ่ง supplier หรือหนึ่ง price row
4. **Integrator ปิดช่องว่างระหว่างฝ่าย:** ตรวจ equipment, software/license,
   firewall/security, ports/protocols, core network/interfaces, installation,
   integration, personnel, ITP/inspection/test records, VDRL/SDRL, manuals,
   training, spares, logistics และ commercial terms ตาม applicability ที่มีหลักฐาน
   แต่ละงานต้องระบุผู้จัดหา ผู้ทำ ผู้ตรวจ และขอบเขตค่าใช้จ่ายตามข้อมูลจริง
   ไม่ถือว่าทุกหัวข้อเป็น scope บังคับของทุกระบบโดยอัตโนมัติ
5. **งานร่วมคิดต้นทุนครั้งเดียว:** กำหนด cost owner ของขอบเขตที่คิดเงิน
   shared network, personnel, installation, testing และเอกสารอาจรองรับหลายระบบ
   แต่ component details และ coverage links ต้องไม่กลายเป็นต้นทุนซ้ำ
6. **ช่องว่างต้องเปิดเผย:** ข้อที่ยังจับคู่ไม่ได้ต้องมีสถานะและเหตุผล เช่น
   ไม่ได้อ่าน, ยังไม่วิเคราะห์, ขัดแย้ง, supplier ไม่รวม, ต้องจัดหาเพิ่ม หรือ
   ไม่เกี่ยวข้องโดยมีเหตุผล ห้ามถือว่ารายการที่หายไปคือไม่มี scope หรือมีราคาเป็นศูนย์
7. **Comments ต้องตรวจผลจริง:** แยกสถานะ CLOSED จากผู้ตอบเอกสารออกจาก
   การตรวจว่าแก้ในฉบับปัจจุบันจริง และการนำผลไปใช้ใน engineering/working
   หาก comment อ้างฉบับเก่าต้อง map ตำแหน่งไปฉบับใช้งาน ไม่คัดลอกเลขหน้าโดยเดา
8. **Source → Release → Source:** ใช้หลักฐานทั้งสองฝั่งผ่านการวิเคราะห์
   Working → Budgetary → Release แล้วจากแต่ละผลลัพธ์ต้องย้อนกลับถึง source/version
   และขั้นคำนวณ/การตัดสินใจที่รองรับได้ No skipped process หมายถึงไม่ข้าม
   หลักฐานหรือกระบวนการที่จำเป็น ไม่ใช่บังคับให้เปิดทุกแท็บตามลำดับ
9. **Revision impact:** เนื้อหา/ฉบับ/requirement/offer เปลี่ยนต้องระบุ affected
   mappings และขอทบทวนผลลัพธ์ที่เกี่ยวข้อง ไม่เขียนทับการตัดสินใจหรือราคาของผู้ใช้
   อัตโนมัติ เอกสารชื่อหรือ revision เดียวกันยังต้องตรวจความเหมือนของเนื้อหา
10. **หนึ่งข้อมูล หลายมุมมอง:** ใช้ canonical source/requirement/offer/working records
    ที่มี ID เดียวกัน การเปิดในหลายหน้าเป็น projection ไม่สร้างอีกชุดที่แก้ไข
    แยกกัน การโหลดหรือคำนวณร่วมต้องไม่ซ้ำเพราะการจัด UI
11. **Release และประวัติ:** ตรึง source versions, decisions, calculations,
    mappings และ commercial output ของแต่ละ issue; เก็บ authorization และ
    transmittal แยกให้ตรวจสอบได้ Working เปลี่ยนต้องไม่แก้ issued history
12. **UI ต้องช่วยตรวจตามหลักฐาน:** กลุ่มสีตามประเภทงาน มีหุบ/ขยาย Module ID
    คงที่และ Copy ID แสดงหลักการโมดูล และตามลิงก์ไปเปิดต้นทาง/ปลายทางได้
    สีหรือปุ่ม export ไม่ได้แทนสถานะการตรวจหรือการอนุมัติ
13. **ขอบเขตครบตามลูกค้า:** ใช้เอกสารฝั่งลูกค้ากำหนดขอบเขตระบบและงานร่วมทั้งหมด
    รวม optional scope ตาม applicability ที่พิสูจน์ได้ รายการระบบใน UI, working
    catalog เดิม หรือข้อเสนอ Supplier ไม่ใช่ตัวจำกัดขอบเขต การแบ่งงานเป็นลำดับ
    ภายในต้องรักษา coverage ของโครงการทั้งหมด ไม่ถือว่าตัวอย่างระบบเดียวเป็นผลสำเร็จ
14. **Integrator เป็นสมองวิศวกรรม:** อ่านและเชื่อมข้อกำหนดจากหลายเอกสาร ประเมิน
    สมรรถนะและ interfaces ของ MGW/INDUSTRONIC จากหลักฐาน technical offer/catalog/
    datasheet แล้วจัดทำ CAL/RPT ของเราเมื่อจำเป็นต่อการพิสูจน์ข้อกำหนด ระบุ method,
    สูตร/แบบจำลอง/เหตุผล, input พร้อมหน่วยและตำแหน่งต้นทาง, assumptions,
    เกณฑ์ยอมรับ, ผล, ข้อจำกัด และผู้ทบทวน ผลต้องนำไปกำหนด solution/quantity/
    activities/deliverables หรือแสดงช่องว่างให้ชัด หากข้อมูลที่ใช้พิสูจน์ยังไม่ได้
    อ่านหรือขัดกัน ให้เปิดประเด็นตามจริง ไม่เติมค่าหรือรับรองผลเอง

    CAL/RPT ต้นฉบับที่ได้รับเป็น **source evidence** ส่วน CAL/RPT ที่เราจัดทำเป็น
    **derived engineering proof** มี ID/version และ dependencies ของตัวเอง ห้าม
    เขียนทับต้นฉบับหรือทำให้ดูเป็นเอกสารรับรองจากลูกค้า การคำนวณผ่าน/design
    verification ต้องแยกจากผลทดสอบภาคสนาม/FAT/SAT ที่ยังไม่ได้เกิดขึ้น

## 3. Minimum mapping information — target contract

รายการต่อไปนี้เป็นข้อกำหนดสำหรับการพัฒนา schema ไม่ใช่ field ที่อ้างว่ามีครบแล้ว:

- Customer source/version + PDF page/printed page/clause/table or sheet/cell.
- Requirement ID, original meaning, system/site and applicability.
- Integrator interpretation, engineering basis and interface/activity allocation.
- Derived CAL/RPT ID/version, method, source-backed inputs/units, assumptions,
  acceptance criteria, outputs, limitations and verification/review state.
- Supplier, offer/version, line/locator and supporting technical evidence.
- Coverage, exceptions/conflicts and disposition with reason/reviewer/date.
- Supply/execution/review responsibility; personnel and deliverable references where applicable.
- Working/calculation IDs, quantity/unit basis, cost owner and customer price-row mapping.
- Review dependencies/change impact and frozen release/issue reference.

หนึ่ง requirement อาจมีหลาย mappings และบาง requirement ไม่เป็น price row
โดยตรง เช่น document control หรือ acceptance criterion แต่ต้องมี accountable
activity/deliverable หรือ disposition ที่ตรวจได้

## 4. Acceptance examples for subsequent implementation

- Coverage includes all customer-required systems and shared obligations. A verified
  example is not a substitute for project-wide completion. Missing catalog entries
  must not remove customer scope from the coverage denominator.
- Received customer CAL/RPT and integrator-generated CAL/RPT remain separate records.
  Derived proof ties applicable customer acceptance criteria to actual supplier
  characteristics and project inputs; a match/declaration alone does not close it.
- CCTV: trace applicable customer clauses to camera/VMS/license/storage/network/
  installation/personnel/ITP/document scope and the exact supplier evidence; assess
  applicability from project documents rather than treating this list as a proven BOM.
- A customer requirement omitted from the working catalog must remain visible as
  an uncovered requirement rather than disappear from the coverage denominator.
- A supplier exclusion has a recorded disposition and owner before scope is closed.
- Shared network supports several systems with one additive cost owner.
- A CLOSED review comment does not automatically approve current-revision compliance.
- A source change invalidates the affected reviews; unrelated requirements on the
  same long document are not automatically treated as conflicted.
- A price row opens the linked calculation, interpretation and both source sides;
  source navigation opens any collapsed parent modules.
- Unknown/TBC does not become zero; documentation/UI refactoring preserves figures,
  stable IDs, user edits and frozen history unless an explicit migration requires change.

## 5. When these principles must be used

This is the operational invocation contract. It directs developer review now;
runtime/test enforcement must be implemented and verified separately.

| Trigger | Principles to apply | Concrete evidence to inspect or produce |
|---|---|---|
| Start a 0550 change/new implementation session | Read this ADR via root AGENTS.md; identify relevant principles before editing | State relevant principles and current implementation boundaries |
| Import or replace customer/supplier evidence | 1, 2, 7, 9, 10 | Source/version/authority, exact locator, reviewed content ranges, duplicate/difference assessment and affected mappings |
| Map requirements, select offers or close coverage | 3, 4, 5, 6, 13, 14 | Customer clause ↔ supplier evidence ↔ integrator engineering proof/activity; project-wide coverage, gap dispositions, responsibility and cost ownership |
| Change engineering, quantity, personnel, installation, ITP or VDRL/SDRL | 2, 4, 5, 8, 9, 14 | Source-backed engineering/activity basis, separate received vs derived CAL/RPT, resources/deliverables, downstream quantity and cost impact |
| Derive Working/Budgetary or prepare a Release | 5, 6, 8, 9, 11, 13, 14 | Full applicable scope and engineering proof, conflicts, current review dependencies, calculation trace and frozen issue basis; enforce HOLD where required |
| Refactor modules, navigation or storage | 10, 11, 12 | Stable ID/migration plan, canonical data ownership, financial/history preservation and source-to-output navigation |
| Complete a change / prepare a PR | Relevant principles above | Report principles used, actual validation and remaining gaps; distinguish documentation from runtime enforcement |

The user's question "when will this record be used?" is addressed by these explicit
triggers and the completion-report instruction in AGENTS.md. A reference in a comment
or registry does not itself execute a check, nor does this table prove runtime gates.

## 6. Implementation boundary at recording

This ADR records the agreed direction. Existing code has a shared workspace and
calculation model, a source register and release HOLD, but complete clause-level
requirements/supplier mapping and dependency-aware review gates are not yet proven.
Do not claim the principles are enforced merely because they are documented here.

Keep the existing 15 module IDs and domain knowledge. Evolve their implementation
through controlled migration. PJ2608-0553 is methodology/reference only; its project
facts, WBS, quantities and prices must not be substituted into 0550.

Future changes to these principles must explain the decision and migration impact
in a superseding ADR; do not silently reinterpret A/B or remove traceability.

## 7. Implemented checkpoint — 29-Oct-2026

See [Working Preview 1–8 implementation and validation](../handoff/pj2608-0550/20261029_WORKING_PREVIEW_1_TO_8.md).
The shared integration records, requirement/proof/activity gates, multi-source
System Particular, full-page/notes/colour/appendix reading ledger and AVL/technical
deviation controls now execute in Working Preview and the live Official projection.
Stable IDs, historical outputs and financial input values are preserved.

These are software checks, not evidence that every project clause has been read
or that all supplier solutions are adequate. Private source review and actual
CAL/RPT completion remain engineering work. Method/input/criterion explanations
and visual references are reviewed records, not automatically authenticated facts.
Final release authorization remains HOLD. Principles 1–14 remain the governing
contract; this checkpoint changes implementation status, not their meaning.

## 8. SI equation / monetary display checkpoint — 29-Oct-2026

The reviewed [SI equation Rev03](PJ2608-0550_SI_Equation_Rev03.md) now has a shared
Architecture/Guide presentation with runtime diagnostics and links through existing
module IDs. [The implementation checkpoint](../handoff/pj2608-0550/20261029_SI_OPERATING_CONTROLS.md)
records decimal rounding at the existing monetary boundaries, policy-dependent
Official review invalidation, unit/amount reconciliation and actual checks run.
It preserves the selected INDUSTRONIC deviation work and distinguishes existing
checks from remaining impact-graph, schema and issue/transmittal work. Domain
principles, proof acceptance criteria, financial inputs, template and Release HOLD
remain controlled as described above.

## 9. Private SI draft package checkpoint — 29-Oct-2026

The [SI work-package checkpoint](../handoff/pj2608-0550/20261029_SI_WORK_PACKAGE.md)
records an additive intake into the existing canonical Integration workspace.
Source-version checks, unstamped DRAFT-only ingestion, preservation of existing
user records and financial/history invariants execute at import. Private source
reading and derived desk assessments are delivered separately; importing them
does not establish full clause coverage, adequate system design or issue approval.

## 10. Commercial issue recording checkpoint — 29-Oct-2026

The [commercial issue checkpoint](../handoff/pj2608-0550/20261029_COMMERCIAL_ISSUE_CONTROLS.md)
records elapsed-day binding, schematic dependencies, runtime readiness, explicit
authorization, append-only frozen issues and separate transmittal evidence. These
controls preserve recorded decisions and commercial snapshots. They do not prove
actual project engineering completion, authenticate an approver, or transmit a
proposal. Missing project inputs and approvals remain OPEN.

## 11. Repository pricing preparation checkpoint — 29-Oct-2026

The user directed continued pricing from the JSON/code already in GitHub.
The [repository preparation checkpoint](../handoff/pj2608-0550/20261029_REPOSITORY_PRICE_PREPARATION.md)
records one-time carry-forward of the original dated planning FX into wholly blank
FX fields, preserving saved values and deliberate later edits. Working and draft
Release continue from the canonical repository basis without requiring a browser
backup. Missing actual inputs and engineering/commercial acceptance remain OPEN;
source availability is not equivalent to a complete authorized project price.

## 12. MGW detail pricing / FX entry checkpoint — 29-Oct-2026

The [MGW detail and FX checkpoint](../handoff/pj2608-0550/20261029_MGW_DETAIL_PRICING_AND_FX.md)
records the user's chosen detailed-price basis, corrected MGW radio selection and
inclusion of known supplier other charges. Canonical source offers feed quoted-scope
Working packages, with overlap checks and review dependencies. Direct/cross FX entry
and preview execute independently of engineering approval. These are priced drafts,
not automatic MR coverage, system adequacy, customer acceptance or formal issue.
