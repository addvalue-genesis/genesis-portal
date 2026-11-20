# PJ2608-0550 — Handoff: Release UI, Full/Bid, MR และการเปิดงานล่าสุด

วันที่: 30 October 2026, Asia/Bangkok  
ผู้ใช้: Jack  
บทบาทที่ต้องทำต่อ: Principal Telecom Systems Integration Engineer & GENESIS Software Architect

> Latest navigation continuation: [20261030_COMMERCIAL_SECTION_ORDER.md](20261030_COMMERCIAL_SECTION_ORDER.md), UI `2026-10-30.5-preview`. This adds fixed section ordering on top of the historical baseline below. Check current GitHub HEAD before continuing.

## 1. เริ่มจากตรงนี้

- Repository: `addvalue-genesis/genesis-portal`
- Branch: `feat/pj2608-0550-official-working-20261028`
- Application baseline ที่อ่านจาก GitHub และตรวจซ้ำในแชตนี้: **`761ede233a75def2eef25b57e6fd2b16f6dc6158`**
- UI version: `2026-10-30.2-preview`
- URL ปัจจุบัน: `http://localhost:3050/projects/pj2608-0550`
- Branch นี้เปิดเฉพาะ 0550; ไม่ import หน้า 0553/0510 และ redirect URL อื่นเข้า 0550
- เอกสาร handoff นี้เป็น documentation-only บน baseline ดังกล่าว ไม่เปลี่ยน runtime/ราคา/ข้อมูล
- ก่อนทำงาน ให้ตรวจ GitHub HEAD ใหม่เสมอ หากมี commit ใหม่ให้ตรวจและรักษางานนั้นไว้ ไม่ย้อนกลับมาล็อกที่ baseline นี้

เป้าหมายถัดไปคือให้ผู้ใช้เปิดโค้ดและข้อมูลที่ถูกต้องได้ แล้วปิดช่องว่าง Source → SI/Working → ราคา → Release ตามหลักฐานจริง ไม่ต้องสร้างหน้า Release/Full-Bid ขึ้นมาใหม่

## 2. เอกสารที่ต้องอ่านตามหน้าที่

อ่าน `AGENTS.md` ที่ root ก่อน แล้วอ่าน:

1. `docs/architecture/ADR-0550-001-integrator-traceability.md`
2. `docs/architecture/PJ2608-0550_SI_Equation_Rev03.md`
3. `docs/handoff/pj2608-0550/20261029_RELEASE_TABLE_PRICES.md` — รายละเอียดงานในแชตนี้และ validation แต่ละช่วง
4. `docs/handoff/pj2608-0550/20261030_DEDICATED_0550_LAUNCH.md` — 0550-only / port 3050 / browser data
5. `docs/handoff/pj2608-0550/20261030_A_SOURCE_PREPARATION.md` — source search, linked import, native reading และ actual OPEN
6. `docs/handoff/pj2608-0550/20261029_A_INPUT_CONTROLS.md` — expected inputs, A readiness, issue v2
7. `docs/handoff/pj2608-0550/20261029_VOLUME_II_TECHNICAL_PROPOSAL.md`
8. `docs/handoff/pj2608-0550/20261029_SI_OPERATING_CONTROLS.md`
9. `docs/handoff/pj2608-0550/20261029_COMMERCIAL_ISSUE_CONTROLS.md`
10. `docs/handoff/pj2608-0550/00_HANDOFF_CURRENT.md` เป็นสารบัญเพิ่มเติม มีเนื้อหา historical อยู่ด้วย; ใช้วันที่/commit ของแต่ละ checkpoint แยกกัน

## 3. สิ่งที่ผู้ใช้ขอและทำแล้วในสายงาน Release

ผู้ใช้ต้องการแก้ตาราง **`bid.budget.release` / 10.7** ที่เสนอให้ลูกค้าโดยอ้างอิง MR ไม่ใช่แก้แค่ summary อีกหน้า:

| ความต้องการ | สิ่งที่มีในโค้ดแล้ว |
|---|---|
| เห็นราคาและ Module ID | แถบ Release identity พร้อม Copy ID, known provisional USD, จำนวน priced/selected owners และสถานะ HOLD/NOT ISSUED |
| หุบ/ขยายตามหมวด MR | Part → MR Appendix → system/customer Lot → site → item, ปุ่ม +/− และ expand/collapse all |
| Module ID บน A/B/C | `bid.budget.release.part.A`, `.B`, `.C` พร้อม Copy และ Module Search |
| ครบทุกระบบและขอบเขตที่ต้องเสนอ | Full/Bid inventory ภายใน Part A; ปัจจุบัน 19 systems + COMMON; scope union ไม่ถูกจำกัดไว้ที่ 15 commercial Lots |
| รู้ว่ามาจาก MR อะไร | คอลัมน์ MR document/revision/page/Appendix และ expandable references รายระบบ |
| กลับไปข้อมูลต้นทาง | Source/Working links ใช้ existing IDs; ค้นหาแถวที่ซ่อนแล้วเปิด parent hierarchy ให้ |
| เข้าใจรายการที่ยังไม่มีราคา | OPEN reasons, known partial Lot subtotal, native currency เมื่อ USD ยังใช้ไม่ได้ และ package candidates ที่ยังไม่ผ่าน mapping |

รายละเอียดสำคัญ:

- Full/Bid รักษา catalog requirements **264 records** รวม unmapped, unselected, COMPANY supply, missing Working และราคา OPEN
- แยก equipment Part A กับงาน B/C; AIS ยังต้องเห็นงาน TSI engineering/testing แม้อุปกรณ์หลักเป็น COMPANY supply
- Bid view รวม TSI และ unresolved scope; การมีราคา/selected ไม่ได้กำหนด applicability
- Full/Bid เรียงตามหน้า/ตำแหน่งแรกของ Part A ใน catalog รวมข้อกำหนด p07/p08 ก่อน Appendix equipment
- รายละเอียดราคาแบ่งตาม MR Appendix 1.1–1.8 และตำแหน่งใน catalog ไม่ใช่ alphabetical order
- Lot ที่คร่อม Appendix มี summary/amount/Module ID เดิมเพียงครั้งเดียว; continuation heading ไม่สร้างยอดเงินซ้ำ
- รายการ Working/package ที่ไม่ใช่ MR จัดไว้ท้าย Part A แยกให้ตรวจได้
- UI expansion เก็บใน localStorage: `GENESIS.PJ2608-0550.release.expanded.v1`; ไม่ใช่การแก้ financial IndexedDB
- MR ที่ catalog อ้างปัจจุบันคือ **`MM-ASK-1A-APF-TEL-MR-0001 Rev.B1`** ไม่ได้มีเลข MR ใหม่แยกให้แต่ละระบบ
- ระบบที่ไม่มี catalog record ต้องแสดง MR OPEN ไม่เติมเลขเอกสารเอง
- ตำแหน่งอ้างอิงมาจาก catalog; งานนี้ไม่ได้ยืนยันว่าเปิด PDF ต้นฉบับตรวจภาพใหม่ครบทุกข้อ

### ทำไม 15 Lots ไม่เท่ากับ 19 systems

Customer price form มี Lot ที่รวมหลายระบบ เช่น:

| Customer Lot | ระบบที่รวม |
|---|---|
| A1-01 | LAN + KU Band |
| A1-04 | PABX + Hazardous Telephone |
| A1-08 | Marine + AIS |
| A1-11 | Microwave + Tower |

การมีชื่อระบบใน Lot ไม่ใช่หลักฐานว่า MR coverage ครบ COMMON Part A มี 30 records ที่ต้องเห็นแม้ยังไม่ผูก Lot; Full/Bid แสดงไว้แล้ว

## 4. Commit history ที่เกี่ยวข้อง

| Commit | งาน |
|---|---|
| `58ea0e95` | ราคา/identity/OPEN diagnostics ในตาราง Release จริง |
| `ba9579a7` | MR hierarchy, +/−, saved expansion, hidden-row navigation |
| `be0f7d14` | Copyable/searchable Part A/B/C IDs |
| `07353620` | Full/Bid inventory ทุกระบบ + COMMON |
| `5664d0d4` | Dedicated MR document/revision/locator column |
| `12afc847` | งาน upstream: A source modules มี +/− ชัดเจน; รักษาไว้แล้ว |
| `fe312f50` | แก้ Windows component/model filename collision |
| `131c642f` | งาน upstream: Volume II Technical Proposal authoring |
| `730e0437` | งาน upstream: A expected inputs/shared reading/readiness และ commercial issue v2 |
| `f5cc9a75` | งาน upstream: canonical source evidence search, linked SI drafts, native reading units |
| `761ede23` | งาน upstream ล่าสุดที่ตรวจ: dedicated 0550 entrypoint, default port 3050 |

งาน upstream อ่านและรวมเข้าการตรวจล่าสุดแล้ว อย่าอ้างว่าแชต Release นี้เป็นผู้สร้างทุก feature ข้างต้น

## 5. ไฟล์หลักสำหรับทำต่อ

| เรื่อง | ไฟล์ |
|---|---|
| Release render/prices/+/− | `frontend/src/project0550/OfficialCustomerForm.jsx` |
| Full/Bid UI | `frontend/src/project0550/ReleaseFullBid0550.jsx` |
| Full/Bid pure model | `frontend/src/project0550/fullBidInventoryModel0550.js` |
| MR hierarchy | `frontend/src/project0550/releaseHierarchy0550.js` |
| OPEN/native/package diagnostics | `frontend/src/project0550/releasePricePresentation0550.js` |
| IDs/search/owner presentation | `frontend/src/project0550/bidPresentation0550.js` |
| B integration/navigation | `frontend/src/project0550/BidCommercialWorkspace.jsx` |
| Canonical customer rows/pricing | `frontend/src/project0550/data/officialPricing0550.js` |
| MR catalog | `frontend/src/project0550/data/mrWorkingCatalog0550.json` |
| Reference customer schedule | `frontend/src/project0550/data/customerForm0550.json` |
| Workspace validation/model | `frontend/src/project0550/data/bidWorkspaceModel.js` |
| Recovery/RAW backup | `frontend/src/project0550/BidDataControls.jsx`, `data/workspaceRecovery0550.js` |
| A source preparation | `SourceEvidenceSearch0550.jsx`, `data/sourceEvidence0550.js`, `SourceReadiness0550.jsx` ใน `frontend/src/project0550/` |
| Technical Proposal | `TechnicalProposalWorkspace0550.jsx`, `data/technicalProposal0550.js` ใน `frontend/src/project0550/` |
| Dedicated route/port | `frontend/src/App.jsx`, `frontend/webpack.config.js` |

### Windows import bug ที่แก้แล้ว

เดิม component `ReleaseFullBid0550.jsx` และ model `releaseFullBid0550.js` มี basename ต่างกันแค่ตัวพิมพ์ ทำให้ Windows เลือก `.js` ก่อน `.jsx` แล้วเตือน missing export

แก้โดยเปลี่ยน model เป็น **`fullBidInventoryModel0550.js`** และ import component แบบ explicit **`./ReleaseFullBid0550.jsx`** มี regression จำลอง case-insensitive resolver แล้ว ห้ามกลับไปใช้คู่ชื่อเดิม

## 6. Windows / local browser: สิ่งที่ยืนยันได้และยังยืนยันไม่ได้

Path ที่ผู้ใช้รันในแชตนี้:

`C:\Users\acer suriyapong\DEV\genesis-portal-0550-review`

ลำดับปัญหาที่พบโดยตรง:

1. HEAD อยู่ `ec436381` บน `feat/pj2608-0550-source-intake-20261027`; pull official-working ด้วย `--ff-only` จึง diverged และไม่ได้เปลี่ยน branch
2. ผู้ใช้เคยรัน npm ต่อหลัง pull ล้มเหลว ทำให้เปิดโค้ดเก่า
3. เปลี่ยน branch ติด local change `frontend/package-lock.json`
4. Stash เฉพาะ lockfile **สำเร็จแล้ว** ชื่อ `backup-0550-package-lock-before-switch`
5. จากนั้น `git switch --create ... --track origin/...` ติด `starting point ... is not a branch`; ใช้ exact remote ref และ `--no-track` เพื่อเลี่ยง tracking configuration ที่ยังใช้ไม่ได้
6. ส่งคำสั่งแบบ single PowerShell `& { ... }` พร้อมเช็ค `$LASTEXITCODE` ทุก native step แล้ว เพื่อไม่ให้ start โค้ดเก่าหลัง fetch/switch/merge ล้มเหลว

ไม่มี log สำเร็จในสายสนทนานี้ที่พิสูจน์ว่า Windows เปลี่ยน branch/อัปเดตเป็น HEAD ล่าสุดแล้ว การอัปเดตในแชตอื่นอาจเกิดขึ้นภายหลัง; ตรวจสถานะจริงก่อนสรุปหรือสั่งซ้ำ

**Port ล่าสุดคือ 3050** แทนคำสั่ง 3001 ที่ส่งไว้ก่อนหน้า:

- Port/hostname/protocol ที่ต่างกันมี browser storage แยกกัน
- Export full workspace backup จาก origin เดิมก่อนย้าย แล้ว import/review ที่ origin ใหม่ผ่าน UI ปกติ
- ห้าม clear IndexedDB/site data และห้ามอ้างว่าการเปลี่ยน port ย้ายข้อมูลให้เอง
- อย่าใช้ `localhost` กับ `127.0.0.1` สลับกันโดยคิดว่าเป็น workspace เดียวกัน
- ห้าม pop lockfile stash เก่ามาทับ branch ใหม่อัตโนมัติ
- ห้าม reset hard, force checkout หรือทิ้ง user changes เพื่อให้ pull ผ่าน
- ถ้า port ถูกใช้ ให้ตรวจ process/checkout ที่เกี่ยวข้อง; ห้าม kill Node ทุก process

### คำสั่งตรวจสถานะใน Windows ก่อนแก้ปัญหาเพิ่ม

```powershell
Set-Location "$env:USERPROFILE\DEV\genesis-portal-0550-review"
git status --short --branch
git branch --show-current
git log -1 --oneline
git worktree list
```

### Pattern อัปเดตเมื่อสำรอง browser data แล้วและ server ของ checkout นี้หยุดแล้ว

```powershell
& {
    $ErrorActionPreference = "Stop"
    Set-Location "$env:USERPROFILE\DEV\genesis-portal-0550-review"
    $branch0550 = "feat/pj2608-0550-official-working-20261028"
    $remoteRef0550 = "refs/remotes/origin/$branch0550"

    git fetch origin "+refs/heads/${branch0550}:${remoteRef0550}"
    if ($LASTEXITCODE -ne 0) { throw "Fetch ไม่สำเร็จ" }

    git show-ref --verify --quiet "refs/heads/$branch0550"
    if ($LASTEXITCODE -eq 0) {
        git switch $branch0550
    } else {
        git switch --no-track --create $branch0550 $remoteRef0550
    }
    if ($LASTEXITCODE -ne 0) { throw "เปลี่ยน branch ไม่สำเร็จ ให้หยุดและตรวจข้อความ" }

    git merge --ff-only $remoteRef0550
    if ($LASTEXITCODE -ne 0) { throw "อัปเดตไม่สำเร็จ ให้หยุดและตรวจข้อความ" }

    git branch --show-current
    git log -1 --oneline
    Set-Location frontend
    npm start -- --port 3050
}
```

Pattern นี้ไม่แก้ local changes/divergence โดยทิ้งข้อมูล หากชนให้ตรวจ actual output และรักษางานไว้ Dependency ของ navigation patch ไม่เปลี่ยน; ใช้ `npm ci` เมื่อจำเป็นต้องติดตั้งตาม lockfile ไม่ต้องทำซ้ำทุกครั้ง

### Unsupported workspace field

ภาพเก่าแสดง error รวม ๆ ขณะใช้โค้ดเก่า Current validator แสดง **ชื่อ unknown fields** พร้อม code `WORKSPACE_UNSUPPORTED_FIELDS`; Recovery UI มี app/build commit, Copy Diagnostics และ RAW backup

เมื่อโหลดข้อมูลผิด schema จะรักษา original raw record ไม่ strip fields ไม่สร้าง seed ทับ และไม่เขียน revision ใหม่จาก recovery ถ้ายังเจอบน build ล่าสุด ให้ใช้ diagnostics ของข้อมูลจริงก่อนแก้ validator ห้าม whitelist field โดยเดาความหมาย โดยเฉพาะ financial/approval records

## 7. งานที่มีใน upstream แล้ว แต่ยังเป็นงานโครงการที่ต้องทำต่อ

### A — RFQ/source preparation

- A และ B อ่าน canonical sources/document reviews ชุดเดียวกัน มี source fingerprint/locator และ linked SI-work-package v2 แบบ DRAFT
- ตาม checkpoint `f5cc9a75`: private Rev08 มี 676 sources; package preparation มี 107 input obligations, 100 receipt bindings, 249 reading jobs, 140 clause drafts; 69 drafts ยังเป็นข้อความบางช่วงและต้องอ่านต่อ
- ตัวเลขนี้มาจาก checkpoint upstream ไม่ใช่การอ่าน private corpus ใหม่ในแชต Release นี้ และไม่ใช่การยืนยันสถานะใน Windows ของผู้ใช้
- Private source corpus/drafts แยกจาก Git; อย่าบันเดิลข้อความส่วนตัวลง frontend หรือ handoff
- **A ยัง A_OPEN** และไม่มี imported completed-reading attestations
- Exact inputs ที่ checkpoint ยังไม่ปิด: SPE-0006 B1; DTS-0005 B1; ACP-TEL-BLD-0001 C3; 10008-STD-6-TEL-006 R00; 10008-STD-6-ICT-003/004/007 R00
- 10006 กับ 10008 ไม่ใช่หมายเลขเดียวกัน ห้าม normalize ให้ match เอง
- TEL-018 R00 สาม copies มี unreadable bytes เหมือนกัน; R01 อ่านได้แต่ยังแทน required R00 ไม่ได้โดยอัตโนมัติ
- Proprietary RF models ต้องมี compatible decoder หรือ controlled readable report
- Source search/OCR ช่วยค้น ไม่ยืนยัน meaning/coverage/drawing acceptance; AIS อาจหมายถึง switchgear ต้องวิเคราะห์ applicability

### SI / engineering / pricing

- อ่านข้อกำหนดจริงทุกระบบและ COMMON รวม drawings, notes, colour, tables, appendices และ cross-references
- ทำ customer clause ↔ supplier offer/catalog/datasheet ↔ derived CAL/RPT/activity mapping ให้ตรวจย้อนกลับได้
- ปิด supply/execution/review responsibility, interfaces, quantities/units, shared cost owner, VDRL/SDRL, testing, training, spares, logistics และ Early Building ตามเอกสารจริง
- ตรวจ supplier package allocation เข้า MR/Customer Lot; การมี candidate package ไม่ใช่ coverage และห้ามกระจายราคาให้ MR rows เอง
- ตรวจ missing costs/FX/current vendor validity/Official review ตาม actual gaps; อย่าปรับราคาเพื่อทำให้ยอดครบหรือบังคับเท่าราคาเก่า
- COMPANY hardware อาจยังมี TSI engineering/services จึงห้ามตัดทั้งระบบทิ้ง
- ราคาที่เห็นเป็น known provisional subset; **ยอดครบโครงการและ issue readiness ยังไม่ยืนยัน**

### Volume II Technical Proposal

- มี `bid.technical` และห้าหมวดจาก Invitation §4, Volume II item 3(1)–(5) แล้ว
- มี 19 systems + COMMON checklist, canonical links, physical equipment data และ printable HTML **DRAFT — NOT FOR SUBMISSION**
- ต้องใส่เนื้อหาจริง/technical parameters/weight-dimensions/delivery batches/deviations และตรวจ source/engineering dependencies
- ต้องตรวจ visual grid ของ MR Appendix 3 / With Bid = B เพิ่ม; five-section checklist ไม่แทนการตรวจแต่ละ deliverable
- ยังไม่มี technical issue authorization/transmittal workflow ใน feature นี้; draft review ไม่ใช่ customer approval

### Release และ UX

- Customer form JSON เป็น reference format ที่ยังต้องตรวจว่าใช้กับ tender ปัจจุบันได้ ไม่ถือว่า validated official authority โดยตัวมันเอง
- Commercial issue v2 ต้องผ่าน A readiness และ Integration/pricing/FX/scope gates เดิม; เก็บ v1 frozen history ตาม policy เดิม
- Authorization และ transmittal แยกกัน; โปรแกรมไม่ส่ง proposal/email อัตโนมัติ
- มี known horizontal overflow ใน default B view ที่ 390px ตาม dedicated-launch checkpoint; ยังไม่แก้ใน navigation patch
- Asset-size warning ยังอยู่; ไม่มีหลักฐานว่าเป็น missing export/runtime error

## 8. Validation: สิ่งที่รันจริงในแชตนี้

ล่าสุดบน application commit **761ede23**:

| Check | ผล |
|---|---|
| `node scripts/validate-pj2608-0550-price-summary.cjs` | PASS: Full/Bid union, 264 requirements, MR order/hierarchy, A/B/C IDs, Windows resolver simulation, actual React SSR, financial/export/history invariance |
| `node scripts/validate-pj2608-0550-workspace-recovery.cjs` | PASS: exact field diagnostics, retained RAW, strict save, zero recovery writes, private diagnostic redaction |
| `node scripts/validate-pj2608-0550-source-evidence.cjs` | PASS: literal search, locators, canonical DRAFT, stale/forged evidence rejection และ unchanged financial/source data |
| `npm run build:portal` | PASS; webpack 5.111.1; remaining asset-size warning, ไม่มี missing-export warning |

รันจาก `frontend/` ไม่ใช่ repo root Browser tests ของ Release/hierarchy/Full-Bid/Part IDs เคยผ่านใน implementation ช่วงก่อน ดูรายละเอียดตาม commit ใน `20261029_RELEASE_TABLE_PRICES.md` ไม่ได้รัน production app browser suites ใหม่ครบชุดบน 761ede23 ในแชตนี้

Full build ที่เคยรายงาน 183 PASS เป็น checkpoint ก่อนหน้า ไม่ใช่การอ้างว่า rerun chain นั้นบน HEAD ล่าสุด Upstream reports 21 validators/four browser suites สำหรับ A preparation และ dedicated-route browser checks แยกอยู่ในเอกสารของมัน

ไม่มีการทดสอบ native Windows และไม่มีการอ่าน/เขียน browser workspace จริงของผู้ใช้ในแชตนี้

## 9. พรีวิวที่แสดงในแชต

ทำ interactive preview สำหรับให้ดู +/−, A/B/C IDs, Full/Bid และ MR โดยดึง projection จาก repository seed/model ที่ baseline `730e0437` แล้วทำ presentation fragment แยกจากแอป

- เป็น conversation preview ไม่ใช่ production app, customer issue หรือ Windows workspace
- ตัวเลขใน preview ไม่ใช่การยืนยันราคาที่ผู้ใช้บันทึกอยู่จริง
- Preview interactions ทดสอบใน isolated Chromium แล้ว: 20 rows, Full/Bid, Part +/- / IDs, expand/collapse และ mobile containment; ไม่ใช่ production-app browser validation
- Scratch path ใน session นี้: `/workspace/pj0550-release-preview.html`; อาจหายเมื่อเปลี่ยน session ห้ามใช้เป็น source of truth หรืออ้างว่าบันทึกเข้า repository แล้ว
- หากผู้ใช้ต้องการ preview ล่าสุด ให้ render จาก current Git source หรือเปิดแอปจริง ไม่ใช้ preview แทนการ deploy/fix โค้ด

## 10. กติกาที่ต้องรักษา

1. ทำเฉพาะ 0550; 0553 ใช้ reuse methodology เท่านั้น ไม่เอา MR0001–0004/ราคา/FX/จำนวนของ 0553 มาปน
2. รักษา existing architectural/module/row IDs, user selections, rates, quantities, FX, margin และ frozen history
3. Canonical data ชุดเดียว หลาย views; shared/package cost มี additive owner ครั้งเดียว
4. Source facts, derived calculations, assumptions และ approvals แยกชัดเจน
5. OPEN/missing ไม่เป็นศูนย์ และ software PASS ไม่ใช่ engineering acceptance
6. Source → Working → Scope/Budgetary → Release → Source ต้องตามหลักฐาน/versions ได้
7. ห้าม merge customer release/issue โดยไม่มี validation และ authorization จริง
8. อย่าถาม permission ซ้ำสำหรับ routine reversible work ที่ผู้ใช้มอบหมายแล้ว; อ่าน current Git ก่อนแก้ และรักษางาน concurrent
9. ก่อน publish commit ตรวจ remote HEAD; update ด้วย expected-head guard ไม่ force ทับงานอื่น

ADR principles ที่เกี่ยวข้องกับงาน Release นี้: 2–3, 5–6, 8, 10–14 โดยเฉพาะ single cost owner, visible gaps, reverse navigation, canonical records, preserved history และครบทุกระบบ งาน handoff รอบนี้เป็นเอกสารเท่านั้น ไม่เพิ่ม runtime enforcement

## 11. ลำดับเริ่มงานสำหรับแชตใหม่

1. อ่าน handoff นี้กับ AGENTS/ADR แล้วตรวจ latest remote branch/head และ working tree
2. ถ้าผู้ใช้ยังมีปัญหาเปิดเว็บ ให้ใช้ actual branch/commit/URL/diagnostics ที่มีอยู่ ตรวจ origin เดิมและ backup ก่อนย้าย port; แก้เฉพาะ blocker ที่พบ
3. เปิด Release จริง ตรวจราคา known/OPEN, Copy IDs A/B/C, nested +/−, 20-system inventory/MR และ source navigation ด้วยข้อมูลจริงที่ผู้ใช้อนุญาตให้เข้าถึง
4. ตรวจ source intake/linked package ที่ active; ปิด missing/version/reading gaps ก่อนรายงาน A_READY_FOR_B
5. ทำ SI 1–8 และ actual clause/proof/supplier/cost-owner allocation ให้ครบทุกระบบ พร้อมพัฒนา Volume II จาก canonical records เดิม
6. ปิด commercial/engineering review และ issue gates ตามหลักฐาน; คง HOLD เมื่อยังไม่ครบ
7. หลัง code changes ให้รัน checks ที่ตรงงาน รายงานผลจริงและข้อจำกัด commit/push บน branch เดิมโดยรักษางานล่าสุด

อย่าเริ่มด้วยสร้าง Release หรือ Full/Bid ใหม่ งานส่วนแสดงผลทำแล้ว งานที่เหลือคือการยืนยัน installation/data และปิด source/engineering/commercial gaps จริง
