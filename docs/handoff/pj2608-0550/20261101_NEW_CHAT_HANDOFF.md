**Latest authored EPC/TSI continuation:** [source-bound A/SI drafts, recovered Oct29 work, bid decisions and actual QA](20261101_EPC_SI_DRAFT_CONTINUATION.md), UI `2026-11-01.6-preview`, starting HEAD `9301be02`. Reuse Rev09/v3 and existing records; private v4 adds controlled draft analysis after TC closure. No financial or approval changes; source/native and final engineering review remain open. Read this checkpoint before older status notes below.

> **Latest user launch confirmation:** [Windows pull to 524f31a8 and successful npm start/3050](20261101_WINDOWS_524F31A8_CONFIRMED.md). The supplied terminal log supersedes earlier unconfirmed Windows pull/start statements only; DATA receipt, browser state and SI completion remain distinct. Read this newer handoff first.

> **Later continuation:** application `2fb25eb`, UI `2026-11-01.5-preview`: read [system/COMMON SI audit](20261101_SYSTEM_CONSTRAINT_CONTINUATION.md) and [whole-document Invitation reconciliation / QA](20261101_ALL_DOCUMENTS_CONTINUATION_QA.md) before using the older baseline below. The user paused UX/UI redesign and requires MR, technical sources, standards and tender/contract documents to be analysed together.

> Subsequent implementation: [system constraint continuation / actual existing-work audit](20261101_SYSTEM_CONSTRAINT_CONTINUATION.md), UI `2026-11-01.5-preview`, extends existing WP.1 after `fad8a7bc`. The original handoff snapshot below retains its original baseline and DATA contract.

# PJ2608-0550 — ส่งต่องานเข้าแชตใหม่ / 1 November 2026

เอกสารนี้รวมสถานะที่ตรวจจาก GitHub โค้ด และ checkpoints ที่มีอยู่ เพื่อเริ่มทำงานต่อได้ทันทีโดยไม่สร้างระบบหรือข้อมูลเดิมซ้ำ เป็น **documentation-only handoff** ไม่ใช่การรับรองความครบถ้วนทางวิศวกรรม การปรับราคา หรือการออกข้อเสนอให้ลูกค้า

## 1. จุดเริ่มต้นที่ถูกต้อง

| รายการ | ค่าที่ตรวจยืนยัน |
|---|---|
| Repository | `addvalue-genesis/genesis-portal` |
| Branch ที่ใช้ต่อ | `feat/pj2608-0550-official-working-20261028` |
| Application baseline | `8eae7633badeb0c5e6081bc95796a673201abc62` |
| UI version | `2026-11-01.4-preview` |
| URL | `http://localhost:3050/projects/pj2608-0550` |
| Windows checkout ของผู้ใช้ | `C:\Users\acer suriyapong\DEV\genesis-portal-0550-review` |
| ขอบเขต | 0550 ทุกระบบที่ลูกค้ากำหนด รวมงาน COMMON และขอบเขตเพิ่มเติมตามหลักฐาน |
| การนำขึ้นเครื่องผู้ใช้ | ยังไม่ได้ยืนยันว่า Windows pull/restart, Drive sync และข้อมูลใน browser ของผู้ใช้เป็นชุดล่าสุด |

Commit ของ handoff นี้อาจใหม่กว่า application baseline เพราะแก้เอกสารเท่านั้น ไม่ต้อง bump UI version และ `source0550` ใน release metadata เป็น parent marker ไม่ใช่หลักฐานว่าโค้ดล่าสุดหายไป

อ่านตามลำดับนี้ก่อนแก้โค้ด:

1. [`AGENTS.md`](../../../AGENTS.md) และ [`ADR-0550-001`](../../architecture/ADR-0550-001-integrator-traceability.md): หลักการที่ผู้ใช้ตกลงและขอบเขตการบังคับใช้จริง
2. [`SI Equation Rev03`](../../architecture/PJ2608-0550_SI_Equation_Rev03.md) คู่กับ [`SI Operating Controls`](20261029_SI_OPERATING_CONTROLS.md): แยกสมการที่ออกแบบไว้กับ runtime ที่ทำแล้ว
3. [Whole-corpus A → SI](20261101_WHOLE_CORPUS_A_TO_SI.md): งานล่าสุด, DATA v3, parser และผลทดสอบจริง
4. [MR-driven A Reader](20261101_MR_DRIVEN_A_READER.md): โครงสร้าง A.1–A.4 และข้อควรระวังต้นฉบับ
5. [Existing-basis Audit / C1 → A1](20261101_EXISTING_BASIS_AUDIT_AND_A1.md): เงินที่รู้แล้ว, งบเก่า และ resource drivers
6. [Live Dossier / SDRL](20261101_LIVE_DOSSIER_AND_SDRL.md), [Working → Schedules](20261031_WORKING_TO_SCHEDULE_PREVIEW.md), [Native Exhibit C](20261031_NATIVE_EXHIBIT_C_FORMS.md), [Three Volumes](20261031_THREE_VOLUMES_VDRL_AND_IMPACT.md)
7. [`00_HANDOFF_CURRENT.md`](00_HANDOFF_CURRENT.md) เป็นดัชนีประวัติ; ข้อความเรื่อง branch/port/version รุ่นเก่าด้านล่างไม่ใช่คำสั่ง launch ปัจจุบัน

## 2. ความคิดของผู้ใช้ที่ต้องรักษา

ผู้ใช้ทำหน้าที่ SI: ต้องเข้าใจข้อกำหนดลูกค้า ประเมิน Supplier ออกแบบ/พิสูจน์ความเหมาะสม ระบุกิจกรรม คน ต้นทุน และตอบเป็นข้อเสนอที่ย้อนกลับถึงหลักฐานได้ ไม่ใช่เพียงย้ายราคา Supplier ลงตาราง

| บทบาท | ความหมายและการทำงาน |
|---|---|
| A / Customer evidence | MR เป็นทางเข้าอ่าน แต่เก็บข้อกำหนดจาก PHI/BOD/LIS/DTS/SPE, BLD/DWG/LAY/MTO, CAL/RPT ที่ได้รับ, PTTEP STD, เอกสารเก่า, contract, comments และ clarifications รวมเอกสารที่ถูกอ้างต่อ |
| Menu B / SI | สมองของ Integrator: ตีความข้อกำหนด ทำ CAL/RPT/interfaces/responsibility แล้วกำหนดสินค้า กิจกรรม เอกสาร ทรัพยากร ต้นทุน Working/Budget/Release |
| Supplier evidence / S | MGW, INDUSTRONIC และรายอื่น รวม quotation/catalog/datasheet/technical evidence ต้อง map กับข้อกำหนดจริงและการพิสูจน์ของ SI |
| Commercial Part A/B/C | หมวดแบบฟอร์มราคาอีก namespace หนึ่ง ห้ามนำไปสับสนกับเมนู A/B/C หรือเปลี่ยน IDs ตามภาพซ้าย/ขวา |

คำว่า “ซ้าย/ขวา” เป็นภาษาหน้าจอและเคยเปลี่ยนบริบท ให้ยึดบทบาทและ stable ID เสมอ ไม่ย้ายเจ้าของข้อมูลเพียงเพราะตำแหน่งหน้าจอ

- MR Appendix 1.0 ส่วนใหญ่เป็น Common/Generic แต่มีข้อเฉพาะ interface และ battery limits อยู่ด้วย
- Appendix 1.1–1.8 เป็น Particular groups และหนึ่งกลุ่มอาจครอบคลุมหลายระบบ
- Appendix 2–14 เพิ่มข้อกำหนดเอกสาร การตรวจทดสอบ spares/tools/logistics ฯลฯ ตาม applicability จริง
- Appendix 1.3 เป็น Network/PABX/CCTV/MET scope ไม่ใช่ตารางจำนวนคนหรือ MH ของ CCTV
- PHI/LIS/DTS/SPE/STD เสริมกัน ไม่ได้มีลำดับ override อัตโนมัติจากชนิดไฟล์ ชื่อ revision หรือวันที่ upload
- `LIS-0004` คือ Telecommunication Interface Matrix ต้องอ่านตามเนื้อหาจริง
- คง Source → SI → Working → Budget/Release → Source รายรายการแบบ many-to-many และ single cost owner
- “มีไฟล์”, “มีข้อความ”, “อ่าน”, “วิเคราะห์”, “map”, “พิสูจน์” และ “อนุมัติ” เป็นคนละสถานะ

## 3. งานที่ทำแล้ว: A อิง MR พร้อมอ่านเอกสารประกอบ

ทั้งหมดเป็น projection ภายใน source module เดิม ไม่ใช่ store หรือ architecture ใหม่

| มุมมอง | ผลที่มีแล้ว |
|---|---|
| A.1 อ่านตามต้นฉบับ | MR ตามลำดับ Appendix และ generic document selector สำหรับ source อื่น; เปิด native file/preview, physical page, printed marker, extraction pass, exact text และเตรียม canonical SI DRAFT |
| A.2 ดูตามระบบ | รวม Common/Particular, ข้อความต้นทาง, งาน/เกณฑ์ SI และ canonical links ครบ 19 ระบบ + COMMON; แยก reference context ที่ยังไม่ได้รับรอง applicability |
| A.3 เอกสารอ้างอิง | expected inputs + received sources + references ที่ค้นพบ; เห็นเลข/ฉบับที่อาจไม่ตรง และเปิดกลับ A.1 ได้ |
| A.4 ตรวจความครบถ้วน | แยก receipt/read/native-page/requirements/issue diagnostics ไม่ใช้จำนวนหน้าแทนเปอร์เซ็นต์ครบทุกข้อ |

MR มี 54 physical pages รวม cover/comments กับ 52 printed pages, 24 outline sections; MR catalogue 264 entries คงเดิม แสดงต้นฉบับเพื่ออ่านตาราง หน่วย สี หมายเหตุและขอบเขต parent/child โดยไม่ยุบความหมาย

แก้ปัญหาจาก DATA จริงแล้ว: marker `[PDF PAGE n; printed m]` และหลาย extraction passes ใน PHI/LIS ต้องแยก pass; ไม่ถือหน้าซ้ำทั้งเอกสารเป็นข้อมูลเสียทั้งหมด รองรับ locator หลายหน้า เช่น `PDF pages 37,38,39` และตรวจ exact offsets/fingerprints

ห้ามใช้ MR offset เดียวกับ PDF ทุกฉบับ: PHI physical 37 = printed 32; LIS physical 26 = printed 24 ส่วนเอกสารไม่มีเลขหน้าใช้ตำแหน่งข้อความจริง ไม่เดาหน้า

การอ่าน/search/export ไม่อนุมัติ source หรือแก้ราคา การเตรียม DRAFT ทำต่อได้แม้ global A ยัง HOLD โดยผูก canonical source เดิม ไม่สร้าง authored record ซ้ำหรือเลือก Supplier ให้เอง

ข้อที่ต้องคงจากการอ่าน MR:

- Appendix 1.0 ข้อ 1.3(h) มี Cisco/Avaya/firewall/Motorola specifics; 1.3(i) แยก tower foundation design/anchor bolts จาก construction; 1.3(j) optional ACS
- FCA ใน 2.0(h) ต้อง reconcile contract ไม่เขียนทับ saved Incoterm; 90-day support ใน 2.0(q) ไม่เท่ากับส่งคน onsite 90 วันอัตโนมัติ
- Appendix 2.2 แยกความรับผิดชอบ VSAT/DMR/AIS/FOC; ข้อความ FOC installation ต้อง reconcile
- logical Appendix 1.8 FOC/Cables แต่ physical 29–30 ใช้หัว Appendix 1.6 Entertainment ให้เก็บทั้งสองตำแหน่ง ไม่แก้ต้นฉบับให้ดูตรงกัน
- manuals ไม่เท่ากับค่าแรง maintenance ในอนาคต; storage procedure ≥1 year ไม่เท่ากับค่าเช่าโกดัง 1 ปี
- CLOSED comment ของ A2 เก่าไม่ใช่การยอมรับ B1 ปัจจุบัน; drawing ต้องตรวจภาพ geometry/notes/units ไม่สรุปปริมาณจาก text อย่างเดียว

## 4. DATA ที่มีแล้ว — ใช้ต่อ ไม่สร้างหรือให้ผู้ใช้ upload ใหม่ตามปกติ

ตรวจ folder ที่ผู้ใช้ให้ทั้งสามชุดรวม APF/ACP/ABV01 แล้ว: 143 unique files โดย 142 มี exact Drive IDs ใน Rev08 อยู่แล้ว อย่าอธิบายว่าเอกสารเหล่านี้หายทั้งหมด

- [Project/reference set 1](https://drive.google.com/drive/folders/1kuXgk_P7QHONYmsEvE7OWNJYZS3nYZes)
- [Project/reference set 2](https://drive.google.com/drive/folders/1u-zNlYa9bjVvrkzr4ulglUHDlTFvw2fh)
- [PTTEP standards set](https://drive.google.com/drive/folders/1qPUS1X8Bcdi-SVsDwmd_DvzjS9XJTAQB)

เก็บ derivative JSON ใหม่ใน DATA folder เดิม `1Rpl1RwxzniUQgz-Ma7rZMXyWqRH7zWnf` แล้ว upload/readback ตรวจ exact bytes ตรงกับไฟล์ที่ทดสอบ ไม่มีการแก้ PDF เดิม โครงสร้าง folder สิทธิ์ หรือแทนไฟล์เก่า

| ไฟล์ใช้ต่อ | รายละเอียด |
|---|---|
| [PJ2608-0550_Source_Intake_Rev09_20261101.json](https://drive.google.com/file/d/1Rjh58RGnj2KI7VR_J0_hSTb_PblcH2Mk/view?usp=drivesdk) | Drive ID `1Rjh58RGnj2KI7VR_J0_hSTb_PblcH2Mk`; 15,935,518 bytes; 677 source records; batch `PJ2608-0550-SOURCE-INTAKE-REV09-20261101` |
| [PJ2608-0550_A_Work_Package_20261101.json](https://drive.google.com/file/d/17L1POjMLRwA-k3ySrZbps34_0NKXv1p2/view?usp=drivesdk) | Drive ID `17L1POjMLRwA-k3ySrZbps34_0NKXv1p2`; 4,467,722 bytes; schema `genesis.0550.si-work-package.v3`; batch `PJ2608-0550-SI-A-CORPUS-20261101` |

SHA256 ของไฟล์ที่ตรวจแล้ว:

```text
Rev09 intake: ff0eb469c2322ad72635905cbbee5e3ddcd3892561083849bb59d5ed8e386bfd
A work package: dbce6e3cdd4ab48d19bcb3667496017fd9eea84a28e3090a69224208d8c8d233
```

- Rev09 คง source IDs เดิม 676 รายการ เพิ่ม TEL-018 R01 copy ที่พบเป็น UNCONFIRMED / METADATA_ONLY หนึ่งรายการ ไม่ alias เลข 10006/10008 หรือแทน R00/R01 เอง
- MR เก็บ text เดิมและต่อ native paginated text ใน source เดิม; readState ยัง partial และ dependent review ต้องทบทวนตาม fingerprint
- Package มี 724 DRAFT records = 140 PHI/LIS เดิม + 584 DTS/SPE technical text segments; คง 249 reading jobs และครอบคลุมทั้ง 19 ระบบ + COMMON
- 677 คือ source records ไม่ใช่จำนวน PDF ไม่ซ้ำ; 724 คือ prepared records ไม่ใช่จำนวน mandatory clauses ที่ยืนยันครบแล้ว
- clean model มี 988 requirements = 264 MR catalogue + 724 drafts ไม่ใช่ 988 ข้อที่ผ่าน engineering acceptance
- Package ใหม่ไม่ได้อนุมัติ proof/activity/crew/rate/FX/price ใด; workspace ของผู้ใช้อาจมี records ที่ทำเองเพิ่มแล้ว ต้องอ่านก่อนสร้างใหม่
- predecessor เดิม: Rev08 Drive ID `1e0nFnRtOIfoH6v37c9widJbo71KktF9G`; A package v2 `1bCbMSCT3uYiVTe8jXY7bZftyySRJKa0u` ยังเก็บไว้

V3 ฝัง exact v2 predecessor เพื่อรักษาการแก้ไขและการลบโดยตั้งใจเมื่อ receipt/audit ยืนยันว่าเคย consume แล้ว; clean install ได้ baseline เต็ม; เปิด v3 ซ้ำไม่เติมสิ่งที่ลบกลับ; predecessor hash ไม่ตรงให้ reject ไม่ถือว่าเป็น batch เดียวกัน

อย่าสร้าง v3 successor โดยเปลี่ยน predecessor/schema เงียบ ๆ และอย่านำ preparation tool ไปทำเป็น crawler/reprice อัตโนมัติ

Normal startup ใช้ DATA pair ผ่าน `/api/local/pj2608-0550/source-workspace` เข้า saved canonical workspace; loopback GET-only, 16 MiB ต่อไฟล์และ bounded paired response เดิม แอปเก่าปฏิเสธ v3 จึงต้อง pull/restart ก่อน ข้อมูลส่วนตัวไม่ bundle ลง Git

## 5. งานราคา สมการ และข้อเสนอที่ทำแล้ว

| ส่วน | ผลที่มีแล้วและขอบเขต |
|---|---|
| Working / B7 | ข้อมูล MGW/INDUSTRONIC เดิมใช้ได้; cost ภายในแยกจาก customer selling; included components เป็น references ไม่บวกซ้ำ |
| C1 → A1 S/N 1 GOODS | known customer-selling subtotal ส่งขึ้น A1 แล้ว พร้อมจำนวน priced/expected owners; missing บางรายการไม่ล้างยอดที่รู้แล้ว |
| ยอดสุดท้าย A1 | ยอด grand total/จำนวนเงินตัวอักษรยังไม่สรุปเป็นครบถ้าข้อมูลไม่ครบ; null ไม่แปลงเป็นศูนย์ |
| Draft prices | DIRECT Working SELL แสดงได้แม้ COST ยังไม่ยืนยัน; USD แสดงได้โดยไม่เดา FX ไป THB; strict Official/frozen outputs ยังแยกจาก provisional view |
| C7 | MD → MH ใช้ Hday จริงจาก E05 ที่ผูกไว้ ยอดเงินคงเดิม ไม่เขียนทับชั่วโมงที่ผู้ใช้บันทึกเอง |
| WP.6 / 11.M | แสดง lifecycle/resource driver context และลิงก์กลับข้อมูลเดิม ไม่ใช่ประกาศว่า rebind ทุกต้นทุนครบแล้ว |
| Volume I | native Exhibit C A/A1/A2/B/C/C1–C8 บนจอ, Word/HTML/print พร้อม headers/merged tables/notes; XLSX เป็น data worksheet ไม่ใช่ exact Word geometry |
| Volume II | live technical dossier 12.1–12.5, canonical trace, authoring และ 12.P export; แยก authored paragraphs จาก source facts และกัน internal supplier sourceRef ที่อาจมี cost ออกจาก customer projection |
| VDRL/SDRL | 12.V มี 131 native codes; With Bid ต้นฉบับว่างทั้งหมด ไม่สร้าง B เอง; Invitation §4 Volume II 3(1)–(5) เป็น BID basis อีกชุด; relative P+/D-/T±/W ไม่เดาวันปฏิทิน |
| Volume III | qualification checklist 11 ข้อ ไม่ถือ Supplier certificates เป็นคุณสมบัติ SAMTEL โดยอัตโนมัติ |
| AVL / Deviation | ตาม Working selection/OEM/offer; ข้อเสนอ non-AVL หรือ scope ต่างต้อง review/prepare DRAFT ที่ถูกเรื่อง ไม่ใช้ acceptance เก่ากับ OEM ใหม่; เอกสาร I/II ไม่ตรงให้แก้และประเมิน contractual deviation ตามจริง |
| Frozen release | รักษา legacy readers/frozen package และ exact issued output; การเปิด/export ไม่ออก issue ไม่ส่ง transmittal และไม่แก้ประวัติ |

Navigation ที่ผู้ใช้ใช้: main B tabs 01–10, **11 Volume I**, **12 Volume II**, **13 Volume III**, **14 AVL/Deviation**; WP.1–8 อยู่ซ้อนใน 10.2; 10.6 Budget THB / 10.7 Release Preview USD; 11.M allocation / 11.P export อย่าสับสน WP steps กับ main tabs

### สมการและงบเก่า

E01–E18 มีแล้ว: E05 `MD = events × days × crew`, `MH = MD × Hday`; E06 `elapsed days = MH / (crew × Hday × eta)`; E07 labour; E08 travel; E11 markup; E12 margin; E13 Prime; E14 shared pool; E17 FX ให้ตรวจ implementation/inputs/units ปัจจุบันก่อนใช้

แต่ละระบบและกิจกรรมมี MH ต่างกัน เพิ่มคนต้องดู fixed effort / attendance / duration / rate / trips / shared fixed charges จริง ไม่ใช้ตัวคูณ crew เดียวกับทุกรายการ

มีฐานเก่า Rev04: engineering 19 ระบบ 1,220 MH, interface 146.8 MH, VDRL lifecycle 2,093.6 MH, common 2,089.6 MH; CCTV engineering 96 MH / VDRL 136 MH; rates 7 roles / campaigns 7 ชุด ต้อง reconcile ไม่ประกาศว่าไม่มีข้อมูล และไม่ยกมาเป็น current default อัตโนมัติ

ผู้ใช้ยืนยันงบครั้งแรกประมาณ 500 ล้านผิดพลาด; controlled old Rev10 ระบุ THB580M เป็น **historical reference only** ห้าม back-solve หรือเติม sub-lines ให้ถึงยอดนี้ ใช้ 0553 เป็นหลักวิธีตรวจ ไม่คัดยอดเงิน/FX/Supplier/WBS ของ 0553 ลง 0550

MGW มี other charges ที่รู้แล้ว 5 กลุ่มรวม USD255,500: engineering/PM 120k, docs 50k, FAT/integration 80k, packing/delivery 5k, tag 500; on-site ยัง TBD จริง ตรวจ included scope/selected owner ก่อนเพิ่มงาน SI อีกครั้ง

**ยังไม่เสร็จ:** กลไกทั่วไปทุก field แบบ Chat-agreed Default / Manual Override / Reset พร้อม provenance การคุยใน chat ไม่ได้เปลี่ยน approved calculation ของแอปเอง ปัจจุบันมี JSON defaults/saved inputs/explicit draft preparation แต่ห้ามรายงานว่ากลไก default นี้ครบแล้ว

## 6. โค้ดเดิมที่ต้องอ่านและใช้ต่อ

Paths ด้านล่าง relative จาก `frontend/`:

| เรื่อง | ไฟล์หลัก |
|---|---|
| Page / existing workspace | `src/pages/PJ26080550.jsx`, `src/project0550/BidWorkspaceContext.jsx` |
| A UI | `src/project0550/ControlledSourceInventory.jsx`, `MrSourceReader0550.jsx`, `SourceDocumentReader0550.jsx`, `SourceReadiness0550.jsx`, `SourceEvidenceSearch0550.jsx` |
| Reading/corpus | `src/project0550/data/sourceReading0550.js`, `sourceCorpus0550.js`, `mrSourceReader0550.js`, `mrReaderProfile0550.js`, `sourceIntakeModel.js`, `sourceReadiness0550.js`, `sourceEvidence0550.js` |
| Canonical SI / load | `src/project0550/data/integrationWorkspace0550.js`, `siWorkPackage0550.js`, `sourceWorkspaceAuto0550.js`, `sourceAutoLoad.js`; `scripts/source-drive-0550.cjs` |
| Explicit DATA preparation | `scripts/prepare-pj2608-0550-source-corpus.cjs` |
| Pricing / Working | `src/project0550/data/bidWorkspaceModel.js`, `officialPricing0550.js`, `bidVolumeWorkingPreview0550.js`, `workingOffers0550.js`, `mgwDetailPricing0550.js` |
| Native schedule / volumes | `src/project0550/WorkingSchedulePreview0550.jsx`, `NativeExhibitC0550.jsx`, `exhibitCNative0550.js`, `BidVolumesWorkspace0550.jsx` |
| Technical / issue / deviation | `src/project0550/TechnicalProposalWorkspace0550.jsx`, `technicalDossierHtml0550.js`; `data/technicalDossier0550.js`, `bidVolumes0550.js`, `releaseIssue0550.js`, `avlReconciliation0550.js`, `deviationRelease0550.js` |

เก็บ stable 15 architectural module IDs; tabs/subviews ไม่ได้แปลว่าต้องเพิ่ม architecture ID

Stable row targets ที่มีแล้ว: `bid.documents.source.<id>`, `bid.documents.controlled-source-inventory.document.<id>`, `bid.working-preview.requirement.<id>`, `.proof.<id>`, `.activity.<id>`, `.particular.<id>`, `.step.1`–`.step.8`, `bid.vendor.offer.<id>`, `bid.engineering.calculation.<id>`, `bid.budget.working.line.<id>`, `bid.budget.budget-thb.line.<id>`, `bid.budget.release.line.<id>`, `bid.quotation.line.<id>`, `bid.technical.<section>.system.<token>`, `bid.deviations.record.<id>`

## 7. สิ่งที่ทดสอบแล้ว กับสิ่งที่ยังไม่ยืนยัน

ผลต่อไปนี้เป็น implementation checks ที่ผ่านมา ไม่ใช่คำสั่งให้รันทุกอย่างใหม่เพื่ออ่าน handoff:

- Corpus/model: annotated markers, extraction passes, multi-page locators, exact source hits, v1/v2 compatibility, v3 continuation, idempotency, predecessor tamper rejection, edits/deletions และ financial/history preservation
- Isolated browser: generic PHI page/pass + canonical DRAFT save, MR/Source/Release reverse navigation, all-system views, mobile/contrast, ไม่มี page errors
- **Actual private DATA browser:** โหลด Rev09/package v3 อัตโนมัติ 677 sources / 724 prepared records / 249 jobs; เปิด PHI/LIS/DTS/SPE/STD real pages; read-only navigation, preserve edits/deletions หลัง reload, wrong-basis atomic rejection และ financial/frozen invariants
- Source readiness/evidence/render/Drive/auto/SI package, controlled issue, native/frozen exports, Working schedules, bid volumes/live dossier regressions ที่เกี่ยวข้องผ่าน
- Production webpack ผ่าน; มี existing large chunk warning ประมาณ 3.13 MiB ไม่ใช่ compilation failure
- ไม่ได้รัน unrelated full 0553 suite; ไม่ได้ตรวจ session/browser database ของ Windows ผู้ใช้; ไม่ได้ merge main หรือออกข้อเสนอจริง

Validation files ที่เกี่ยวข้อง: `frontend/scripts/validate-pj2608-0550-source-corpus.cjs`, `validate-pj2608-0550-mr-reader-browser.cjs`, `validate-pj2608-0550-source-auto-browser.cjs` และ scripts ตาม checkpoints ของส่วนที่แก้ ให้รันจาก **frontend cwd** และตรวจ npm script ก่อนใช้

เครื่องมือ `/tmp` และ browser fixtures ในแชตเก่าเป็นของชั่วคราว ไม่ใช่ dependencies ของแชตใหม่ ใช้ GitHub กับ DATA links ด้านบนกู้สถานะ

## 8. งานถัดไปจริง — อย่าสร้าง A ใหม่

รอบล่าสุดเสร็จฐานข้อมูล/reader/transport/การเตรียม source-bound drafts เข้าสู่ B **ยังไม่ใช่ SI engineering ครบทั้งโครงการหรือราคาข้อเสนอสุดท้าย**

1. อ่าน baseline/checkpoints/DATA และสำรวจ canonical records ที่มีอยู่จริง รวม saved work ของผู้ใช้ ก่อนเพิ่ม requirement/proof/activity/calculation/technical draft ใด
2. รวม constraint set รายระบบจาก Common + Particular + PHI/LIS/DTS/SPE/drawings/STD และ references จริง ระบุ availability/read/analysis/applicability/conflict แยกกัน; all 19 + COMMON และ scope เพิ่มตามเอกสาร
3. ตรวจ technical adequacy ของ Supplier พร้อม exact evidence; ทำ derived CAL/RPT ของ SI เมื่อจำเป็น โดยมี method, units, assumptions, criteria, result/limitations/reviewer แยกจาก CAL/RPT ต้นฉบับและ FAT/SAT ที่ยังไม่เกิด
4. กำหนด equipment/software/interfaces/installation/integration/testing/docs/spares/logistics และผู้จัดหา/ทำ/ตรวจ/รับต้นทุน เช็ก Supplier included scope และ shared owner เพียงครั้งเดียว
5. ตรวจการผูกสมการของแต่ละ system/activity/role กับ crew/days/hours/rate/trips; reconcile ฐานเก่ากับ actual current source ไม่ปรับราคา/FX หรือคืนงบเก่าอัตโนมัติ
6. ติดตามผล Working → Budget → C1–C8 → A1/A2 และ Volume I ↔ II/VDRL/SDRL/AVL/Deviation รายรายการ; แยก known subtotal จาก complete issue total
7. หากพัฒนา Chat Default/Manual Override ให้กำหนด provenance/reset และ dependency impact อย่างชัดเจนใน canonical model เดิม พร้อมรักษา saved choices
8. ปิดเฉพาะ gaps/reviews ที่มีหลักฐานจริง การอนุมัติ/issue/transmittal ต้องเป็นการตัดสินใจที่ได้รับอนุญาต ไม่ถือ handoff เป็น approval

ห้าม: blanket OPEN ทั้งที่มีข้อมูล, unknown→0, เดาค่าเพื่อให้ยอดลงตัว, คิด parent+included child ซ้ำ, copy งบ/ราคาจาก 0553, สร้าง store/IDs/forms ใหม่ซ้ำของเดิม, รีเซ็ต local edits/deletions, แก้ frozen history หรือประกาศ CCTV ตัวอย่างเดียวเท่ากับเสร็จทุกระบบ

Review fingerprints/impact มีแล้ว แต่ complete transitive engineering dependency graph ทุก input→ทุก output ยังไม่พิสูจน์ครบ อย่ารายงานว่าปรับ A/B7 แล้วทุกอย่าง re-engineer/reprice/approve อัตโนมัติทั้งหมด

## 9. เปิดใช้งานต่อบน Windows

หาก prompt อยู่ใน `...\genesis-portal-0550-review\frontend>` อยู่แล้ว ให้หยุด server ด้วย Ctrl+C แล้วใช้:

```powershell
git pull --ff-only origin feat/pj2608-0550-official-working-20261028
npm start
```

เปิด `http://localhost:3050/projects/pj2608-0550` ตรวจ UI `2026-11-01.4-preview` และ DATA sync/receipt ถ้าจำเป็น ห้ามสั่ง `cd frontend` ซ้ำจาก frontend หรือให้ manual JSON import เป็นขั้นตอนปกติ ไม่มี dependency ใหม่ที่จำเป็นสำหรับชุดเปลี่ยนนี้

## 10. ข้อความวางในแชตใหม่

```text
ทำงานต่อ PJ2608-0550 จาก repository addvalue-genesis/genesis-portal
branch feat/pj2608-0550-official-working-20261028
อ่าน AGENTS.md และ docs/handoff/pj2608-0550/20261101_NEW_CHAT_HANDOFF.md ก่อน
Application baseline 8eae7633; UI 2026-11-01.4-preview; commit หลังจากนี้อาจเป็นเอกสาร handoff เท่านั้น
ใช้โค้ด/canonical workspace และ private DATA Rev09 + A work package v3 เดิมตาม links/IDs ใน handoff
A มี MR-driven reader พร้อม PHI/LIS/DTS/SPE/STD/drawings context แล้ว ไม่สร้างใหม่ ไม่ reset user work
งานต่อคือใช้ A ให้ SI/B ทำ requirement→supplier evidence→CAL/RPT→activities/resources→Working/Budget→Volumes/Deviation→Release→Source ให้ครบตามหลักฐานทุกระบบ
ตรวจ existing records และงานเดิมก่อนบอกว่าขาดข้อมูล; ไม่เอางบเก่า THB580M หรือราคา/FX ของ 0553 เป็น default
General Chat Default/Manual Override ยังไม่ครบ และการ review วิศวกรรม/ราคาสุดท้าย/การออก issue ยังไม่ถือว่าเสร็จ
เริ่มด้วยรายงานสิ่งที่มีและ gap จริงเทียบกับ handoff แล้วทำงานที่ค้างต่อภายในขอบเขตเดิม โดยรักษา stable IDs, edits/deletions, financial inputs และ frozen history
```
