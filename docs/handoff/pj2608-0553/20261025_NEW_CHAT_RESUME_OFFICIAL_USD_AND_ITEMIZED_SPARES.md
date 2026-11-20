# PJ2608-0553 — NEW CHAT HANDOFF / 25 October 2026

## 1. อ่านก่อนเริ่ม และโจทย์ล่าสุดของ Jack

ผู้ใช้ขอส่งต่องานทั้งหมดไป new chat และให้ตอบ/ทำงานต่อเรื่องนี้เป็นลำดับแรก:

> ลูกค้าต้องการเห็นรายละเอียดลักษณะ `bid.budget.working.bc.b10.detail`
> ใน B10 หรือไม่ เพราะต้องรู้ว่าจะซื้อสินค้าอะไร โดยอ้างอิง TAG ไม่ใช่เห็นเพียง
> กลุ่ม kit; เช่นเดียวกับ B11, B13, C1, C2 และลูกค้าต้องการราคา C1/C2
> แต่ปัจจุบันเราไม่ได้เสนอราคา

คำถามนี้ยังต้องตอบจากเอกสารต้นฉบับและรายการปัจจุบัน ไม่ถือว่าตรวจจบแล้ว
อย่าเพียงทำสำเนาตารางภายในทั้งหมดไปหน้าลูกค้า และอย่าเปลี่ยนชื่อ kit ให้ดูเป็น
รายการสินค้าที่พร้อมซื้อโดยไม่มีรุ่น/Part No./จำนวน/หลักฐานรองรับ

เริ่มจากอ่าน handoff นี้ แล้วตรวจล่าสุดของ branch และอ่าน:
1. `20261024_OFFICIAL_ENGLISH_USD_RELEASE.md`
2. `20261024_B1_B14_IMPORT_OPERATIONAL_ACTIVITIES.md`
3. `20261024_B1_27_ACTIVITY_OWNER_AUDIT.md`
4. `20261024_URGENT_SAMTEL_CIF_PRICING_REVIEW.md`
5. `20261024_ONSHORE_OWNERSHIP_RELEASE_RATES.md`
6. `20261024_RELEASE_NATIVE_TEMPLATE_EXPORT.md`
ไฟล์ทั้งหมดอยู่โฟลเดอร์เดียวกับ handoff นี้

## 2. Repository / branch / สถานะจริง

- Repo: `addvalue-genesis/genesis-portal`
- Branch: `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024`
- PR: https://github.com/addvalue-genesis/genesis-portal/pull/39 — draft, not merged.
- ล่าสุดก่อน commit handoff นี้: remote `a6c21828b897df90f705cb97f90e670aadfd90a9`.
- Tested tree: `b53d4f46b51db106a1b8fb22fdd3dc4948617b92`.
- Local reconstructed commit `d0c9fb5b` has that SAME tree but different history.
  If resuming this agent workspace, do not blindly pull/reset over reconstructed
  history. Check remote head/tree; use a fresh remote checkout if needed.
- Local workspace: `/workspace/scratch/1dabc0bea514/genesis-portal`.
- The untracked `frontend/node_modules` symlink predates these changes. Do not commit it.
- No AGENTS.md was found during this work; check again if checkout differs.

Recent remote commits (all pushed):
- `4e10d218`: B1/B6 import operational budget + B1–B14 activities, source to Release.
- `b6f3313f`: visible priced A+B subtotal in Release and native Excel.
- `a6c21828`: 10.3.4 English USD customer quotation + clean native-template export.
- This handoff commit follows those changes and changes documentation only.

## 3. เครื่อง Windows / run / pull

ผู้ใช้ clone ใหม่สำเร็จและรัน webpack-dev-server แล้วที่:
`C:\Users\acer suriyapong\DEV\genesis-0553\frontend`

โฟลเดอร์เก่า `genesis-0553-20261024-122340` ไม่พบในเครื่องปัจจุบันแล้ว
อย่าให้ผู้ใช้รันจาก `C:\WINDOWS\system32` และอย่าแนะนำ path เก่าซ้ำ

URL: http://localhost:3000/projects/pj2608-0553
Server ต้องรันด้วย `npm start`; F5 ไม่ได้ pull โค้ดจาก GitHub

PowerShell — Ctrl+C หยุด dev server ก่อน จากนั้นรันทั้งบล็อก:

```powershell
& {
    Set-Location "$env:USERPROFILE\DEV\genesis-0553\frontend" -ErrorAction Stop
    git pull --ff-only
    if ($LASTEXITCODE -ne 0) { throw "Pull ไม่สำเร็จ" }
    npm start
}
```

เมื่อ compiled successfully ให้ F5; เปิด PowerShell ค้างไว้
`npm ci` ใช้ตอนติดตั้งใหม่ ไม่จำเป็นต้องสั่งทุกครั้งที่ pull

## 4. สิ่งที่ทำเสร็จและข้อกำหนดที่ยึดไว้

### Supplier / การดำเนินงาน
- MR0001: NextG/VST; MR0002: MGW เฉพาะ supply อุปกรณ์;
  MR0003: EXION; MR0004: MDS/ORGA.
- ไม่ใช้แผนเก่า MGW supply ทุกระบบ/DDP China มาทับแผนปัจจุบัน
- ADDVALUE เตรียม/configure, FAT และ Training ที่ SAMTEL Warehouse.
- Preparation 4 วันแยกไว้; FAT 2 วัน + reserve 1; Training 1 วัน + reserve 1.
- OEM ONLINE เป็นฐาน; ADDVALUE ช่วย onsite.
- OEM onsite alternative THB615,350 เป็น internal nonposting alternative;
  ไม่ใช่ C1/C2 และไม่บวกเข้าฐาน
- ส่งออก CIF Zhuhai Port; เอกสารสนับสนุน JUTAL และการนำเข้า/ใช้งานเมียนมา
  แยกเจ้าของต้นทุน; ไม่มีการยื่นใบอนุญาตจริงใน session นี้
- Onshore JUTAL อยู่ B9; Offshore SAT อยู่ B3. ใช้สีตามเจ้าของงบลงถึงตารางย่อย
  และ group accordion/Expand-Collapse เพื่อช่วยตรวจการซ้ำ

### B1 / B6 / B1–B14 activities
- B1 แบ่ง Engineering & PMO กับ Myanmar Import/Operating Licensing.
- คง office staff 242 MH; รวม admin/accounting/procurement/logistics coordination
  ตามฐานเดิม ไม่เพิ่มซ้ำเพราะตั้งแพ็กเกจใหม่
- ประเมิน operational cost 3 ช่วง: เข้าไทย30,000; ไทย→CIF/docs20,000;
  เมียนมา import/operating approvals200,000 THB.
- ทั้งหมดเป็น planning assumptions ไม่ใช่ vendor quote/official fee schedule
  หรือการรับประกันว่าจะได้ใบอนุญาต
- Myanmar200k: agency78,750; official-fee allowance25,000;
  additional approvals/mixed reserve75,000; rework reserve21,250.
- Fee allowance25,000 ไม่ uplift; service/reserves ×1.10.
  ไม่อ้างว่าทั้งแพ็กเกจเป็นเงินหน่วยงานรัฐ และไม่สร้างเงื่อนไขเบิกตามจริงที่ไม่ได้ตกลง
- B1 ลบ filing ซ้ำ cost7,200/SELL7,920; supersede conditional cost47,000
  ที่ไม่เคยอยู่ใน Base (ห้ามลบ47,000ออกจาก Base ซ้ำ).
- B1 cost374,200 / SELL421,180 THB.
- B6: import SELL12k แทนด้วย33k; mixed exportเดิม25k แบ่ง service15k +
  physical10k เป็นสมมติฐานใหม่ แล้วแทน service ด้วย22k → B6 SELL335,584.
  การแบ่ง25kไม่ใช่ใบแจ้งหนี้ที่ยืนยันแล้ว; adequacy physical10k ยังเปิดอยู่
- Thai duty/VAT ยังไม่ยืนยัน ห้ามถือเป็น0หรือ exemption อัตโนมัติ
- กิจกรรม14หมวดใช้ registry ร่วมไป Working/Scope/Release/Excel
- 27-title engineering audit ทำแล้ว; ไม่เพิ่ม legacy964MH/510,630.26 เข้าB1.
  Residual engineering บางส่วนยังต้องปิด MH/RACI; ไม่ได้ยืนยันว่าวิศวกรรมครบทั้งหมด

### วัน / rate / overtime
- B3 SAT: 28 team working days, 2 persons, proposed12h/day.
  SeniorUSD1,000 / FieldUSD800 per person-day.
- B9: 2 persons, 7 working +2 travel days/person;
  SeniorUSD700 / FieldUSD600 per person-day, 1 LS including selected travel/accom.
- Proposed offshore OT1.5× after12h →125/100USD per person-hour;
  standby proposed100% day rate. Onshore hours/OTยังTBC.
- คงคำว่าข้อเสนอ/ต้องตกลงเป็นลายลักษณ์อักษร ไม่แสดงว่าเป็นเงื่อนไขลูกค้ายอมรับแล้ว
- CCL18/45วันกับ allowance/deployment ยังต้อง reconcile

## 5. ยอดล่าสุด (THB Working SELL — ไม่ใช่ direct cost ทั้งหมด)

| Owner | THB |
|---|---:|
| A1 |7,592,914.13|
| A2 |4,314,488.10|
| A3 |1,076,400.00|
| A4 |9,213,750.00|
| A total |22,197,552.23|
| B1 |421,180.00|
| B2 |237,121.13|
| B3 |2,322,450.00|
| B4 |null|
| B5 |311,184.00|
| B6 |335,584.00|
| B7 |30,000.00|
| B8 |142,550.00|
| B9 |480,550.00|
| B10 |509,827.50|
| B11 |157,657.50|
| B12 |null|
| B13 |46,683.00|
| B14 |null|
| Known B |4,994,787.13|
| Known A+B |27,192,339.36|
| C1 / C2 |null / null|

A5 THB260,232 source-only / non-additive ไม่บวกซ้ำ
B3 = FAT/local452,850 + SAT1,587,600 + BFsurvey252,000 + VeEX30,000
ราคา B10/B11/B13 ยังเป็น parametric sell allowance ไม่ใช่ quotation รายอะไหล่

## 6. Release / Excel ที่แก้ล่าสุด

### 10.3.3 `bid.budget.pricing.release.preview`
- ยังเป็น source-linked THB preview พร้อม Internal/Customer mode
- แถวเหลืองและ Excel G38 แสดง27,192,339.36 แล้ว ไม่ซ่อนยอดด้วย NOT ESTABLISHED
- ระบุ subtotal เฉพาะรายการมีราคา และ exclude B4/B12/B14; unknownไม่ใช่0
- ไม่ได้เปลี่ยน Final Base completeness/approval gate หรือสร้างการส่งราคาจริง

### 10.3.4 `bid.budget.pricing.official`
- แท็บใหม่ Official Release — English / USD, หน้าลูกค้าแยกจาก internal workspace
- รับ releaseModel เดียวกับ10.3.3; ไม่ใช่ master ราคาใหม่
- FXเสนอราคา31.5 THB/USD แบบตรึง; ปัดขึ้นทีละUSD100ต่อรายการหลักที่มีราคา
- Known A+B ก่อนปัดUSD863,248.87; หลังปัดUSD863,900; ส่วนต่างUSD651.13
- ไม่ปัด day rate/OT หรืออะไหล่แต่ละชิ้นขึ้นUSD100
- B10/B11/B13 Annex กระจายยอด parent ที่ปัดแล้วตามสัดส่วนเดิมด้วยเศษสตางค์;
  unitUSDได้ถึง4ตำแหน่ง, round(qty×unit,2)=line total และ sum=parent
- หน้าลูกค้า/ไฟล์ไม่มี THB, margin, internal notes, Module IDs, HOLD/DRAFT notes
- B4/B12/B14 และ C1/C2 แสดง To be quoted; CแยกจากA+B
- B3/B9 แสดงวันและเสนอ Day/OT/Standby ในข้อความสั้นพร้อม commercial qualifications
- Export Excel จาก embedded native original template โดยไม่เปิด file chooser
- รูปแบบ6sheets, original column widths/merges/logo/page-print geometry;
  ล้างค่าเก่า/shared strings/custom metadata แล้วใส่ customer allowlist
- ไม่เปลี่ยน embedded template; filename `PJ2608-0553_ScopeOfSupply_USD.xlsx`
- ชื่อ Official ไม่ได้หมายความว่าระบบบันทึกลายเซ็น/อนุมัติ/ส่งออกให้ลูกค้าแล้ว;
  `issued:false`, ไม่ได้ส่งอีเมล/ยื่นราคา/merge/deploy
- FX guidance: รับUSD→THBใช้ bank TT Buying หรือ forward buyingตรงงวดรับเงิน;
  ซื้อUSDจ่ายsupplierใช้Selling. 31.5เป็นassumptionไม่ใช่current bank/guaranteedrate

## 7. งานแรกของแชตใหม่ — itemized B10/B11/B13/C1/C2 + C prices

### สิ่งที่ตรวจพบจริงจาก code แล้ว
- `ScopeBcAnnexDetail0553.jsx` สร้าง working ID `...bc.<code>.detail` จริง
- `spareCustomerSchedule0553.js` มี historical rows และ CURRENT rows คนละชุด
  ต้องตรวจ currentByCode ไม่ดึง historicalมาpostโดยอัตโนมัติ
- B10 current:4 MR kit lines qty4/3/4/3, ไม่ใช่14 SKU ที่อนุมัติแล้ว
- B11 current:4 MR-phase tool sets; B13 current:3 activity/project-stock allowances
- หลายแถว `tagNo:"SYSTEM SPARES / "+mr`, `relatedTagList:[]`,
  `installedTagKeys:[]`, OEM Part No./kit contentsยังไม่ยืนยัน
- Current internal unit COST assumptions USD: B10[1400,700,550,850],
  B11[2100,650,350,750], B13[120,95,280]; ×qty×31.5×1.30 เป็น SELL
  อย่าอ้างตัวเลขเหล่านี้ว่าเป็นราคาซื้อ supplier
- C1 current:1 project-pool RACON candidate, TAG MAR-514-001,
  selected MDS installed one-system comparableUSD75,000 แต่ sparecost/SELLnull
  ราคาinstalledpackageนี้ไม่ใช่ independent capital-spare quote
- C2 current:4 MR placeholder lines; qty/priceยังnullและต้องแยกออกจากB10 stock
- Release C mapperรับ verifiedDirectCostTHBแล้วคำนวณpriceAorCFromCost;
  ไม่เอา Working SELL มาคูณ30%ซ้ำ จึงยังnullในทั้ง10.3.3/10.3.4

### งานที่ต้องทำต่อ ไม่ใช่แค่จัดหน้า
1. ตรวจ B10/B11/B13/C1/C2 wording, annex instructions, MR attachments,
   SPE/BOD/DTS และ SPIR จาก original docs เพื่อแยกสิ่งที่ลูกค้าขอจริง
2. ตรวจ `...b10.detail` เทียบ current detail vs Release Annex ว่าอะไรหายไป
   และตอบ Jack ว่า TAGคืออุปกรณ์ที่รองรับ ไม่ใช่ spareSKU; ต้องมีทั้งสองส่วน
3. สร้าง/ตรวจ matrix: owner → MR/system → location → installed TAG →
   parent equipment make/model → spare/tool/consumable Part No./spec → qty/UOM →
   quantity basis → inclusion/exclusion → supplier/price source/currency/date →
   cost → SELL → Release/Excel row; shared stockหนึ่งชุดห้ามคูณซ้ำทุกTAG/site
4. แยก B10 commissioning/start-up stock, B11 handed-over O&M tools,
   B13 consumables, C1 capital spare option, C2 two-year operating spares
   ตรวจซ้ำกับA/OEMincluded, B3 temporary tools, B5packing และกันB10/C2ซ้ำ
5. ประเมินราคา C1/C2 ให้เดินหน้าได้จากหลักฐานที่มี; ใช้ quotationตรงรุ่นก่อน
   ถ้าไม่มีให้ใช้ comparable/parametric budget พร้อมฐานและข้อจำกัดชัดเจน
   อย่าหยุดแค่บอก“รอOEM” แต่ก็ห้ามเดาPart No./จำนวน/official quote
   ห้ามเอาinstalledpackageUSD75kมาประกาศเป็นราคาspareที่ยืนยันแล้ว
6. หากต้องเพิ่ม source status สำหรับ budgetary C ให้ทำที่ต้นทางอย่างเปิดเผย
   แล้วส่งต่อ Working→Budget/Scope→10.3.3→10.3.4→Excel→Source
   ไม่แก้เฉพาะcell/null gateที่ปลายทางเพื่อบังคับให้มีราคา
7. ลูกค้าเห็นรายการที่เข้าใจว่าจะซื้ออะไร + TAG/รุ่น/จำนวน/ราคา;
   ไม่เอาตารางinternalcost/margin/riskreviewทั้งหมดไปexport
8. ตรวจและปรับ validation ที่ผูก16แถวเดิมอย่างมีเหตุผลเมื่อมีitemizationใหม่
   อย่าเพียงลบassertionsเพื่อให้ผ่าน

### ข้อจำกัด code ที่ต้องแก้เมื่อเพิ่ม itemized rows
- Official DTO `officialUsdRelease0553.js` ตอนนี้มี English specification allowlist
  bindกับsourceID B10-PTTEP-01..04, B11-01..04, B13-01..03, C1-01, C2-01..04
  ตรวจจำนวนและIDอย่างเข้ม; sourceเพิ่มแถวจะ fail จนกว่าจะปรับmappingอย่างถูกต้อง
- Native templateแต่ละ Annexมี13physicalrows (6..18). ห้ามtruncateเมื่อเกิน
  วางแผน continuation page/sheet ให้ครบพร้อมsubtotal/printlayout โดยรักษาtemplate
- `buildNativeWorkingDraft0553` เดิมยังhardcode C F/G41/42 และ Annexเป็นNOT QUOTED;
  ถ้าCได้รับฐานราคาใหม่ต้องปรับprojectionนี้ด้วย ไม่ใช่เฉพาะOfficial exporter
- `buildNativeOfficialRelease0553` รองรับCamountจากDTO แต่ต้องปรับsourcepricebasis,
  annexallocationและtestsก่อนใช้จริง
- Existing `16 bidirectional rows` และknown totalsเป็นbaselineเก่า ต้องreconcile
  รายการเพิ่ม/ลด/ย้ายหมวดพร้อมเหตุผลและไม่ลงซ้ำ

## 8. ไฟล์สำคัญที่เริ่มตรวจ/แก้

Source/owners:
- `frontend/src/project0553/data/spareCustomerSchedule0553.js`
- `frontend/src/project0553/data/bcTurnkeyWorkingCost0553.js`
- `frontend/src/project0553/data/b11MinimumTools0553.js`
- `frontend/src/project0553/data/releaseCommercialModel0553.js`
- `frontend/src/project0553/data/scopePartBcReadModel0553.js`
- `frontend/src/project0553/data/officialUsdRelease0553.js`
- `frontend/src/project0553/data/importOperationalBudget0553.js`
- `frontend/src/project0553/data/b1ProjectSupportBudget0553.js`
- `frontend/src/project0553/data/b5B6B7LinkedLogistics0553.js`
- `frontend/src/project0553/data/bcExecutionActivities0553.js`
- `frontend/src/project0553/data/serviceCommercialBasis0553.js`

Views/export:
- `ScopeBcAnnexDetail0553.jsx`, `BcCostEvidenceDetail0553.jsx`
- `CommercialWorkspace.jsx`, `ReleaseCustomerWorkbook0553.jsx`
- `OfficialUsdRelease0553.jsx`, `nativeWorkingDraft0553.js`
- `pricingViewRegistry0553.js`, `data/budgetChangeLog0553.js`
- `data/nativeReleaseTemplate0553.json` — preserve original template bytes
  SHA256 `2d62a29f830c516fea6891fe1d7a63a9cef00487c777dcd0933dc72452f70701`

## 9. เอกสาร/หลักฐานและการทดสอบ

Local PDFs ที่อ่านในchatนี้ (ถ้าnewenvironmentไม่มีให้หาในrepo/connectedsource):
- `/workspace/scratch/1dabc0bea514/upload/01-10008-STD-6-TEL-001-R00-Design-Supply-Install-Telecom-System.pdf`
- `/workspace/scratch/1dabc0bea514/upload/02-10015-WIS-LOG-MM0001-R03_Myanmar-Logistics-Instruction-to-Contractors.pdf`
- `/workspace/scratch/1dabc0bea514/upload/Pasted markdown.md`
Claimsเก่าเรื่องMyanmarTypeApproval lifetime/reuse/Thai exemption/feesจากpastedtext
ยังไม่ใช่legalfactsที่ยืนยันครบ ห้ามนำไปประกาศเป็นข้อกำหนดแน่นอน

Validation (run inside frontend):
- `npm run validate:0553-official-usd-release`
- `npm run validate:0553-native-working-export`
- `npm run validate:0553-existing-spare-owners-2026`
- `npm run validate:0553-release-cfo`
- `npm run validate:0553-import-operational-budget`
- `npm run build` — full validation chain and webpack

ล่าสุด: validationsผ่านหลังปรับ4-viewและchange-logclassification;
webpackผ่าน มี3bundle-sizewarningsเดิม ไม่ใช่compileerror.
Browserตรวจ6tabs, search/navigation/back, 1366/700/390px, downloadไม่เปิดchooser,
zero pageerrors; renderedsummary/serviceและทั้ง5annexsheet; relationshiptargetsครบ.
ไม่ได้ทดสอบในMicrosoftExceldesktop และยังไม่ยืนยันcustomeracceptance

QA scratch scripts (อาจไม่อยู่ในnewenvironment; ไม่ใช่ส่วนrepo):
`qa-browser-official.cjs`, `qa-browser-subtotal.cjs`, `xlsx-qa/render-official.mjs`.
ใช้PlaywrightและembeddedChromium; artifactsทดสอบไม่ใช่ไฟล์ที่ส่งลูกค้า

## 10. Guardrails / งานที่ยังเปิด

- ห้ามขอ MGW เสนอราคาใหม่หรือส่งmessage supplier โดยไม่มีคำสั่งใหม่
- ห้ามแก้Budget/Releaseแยกจากsource; traceต้องกลับได้; ไม่สร้างdoubleposting
- ห้ามเดาfirst-principles/internal checksข้อ1–8ที่ยังหาไม่ครบ
- DB/globalManualInput refactorแยกไว้ภายหลัง
- B4/B12/B14, residualengineering, CCL18/45, OEMcompatibility/SPIR,
  permitapplicability/actualfees/dutyVAT, insurance/bondsยังไม่ปิดครบ
- ไม่เพิ่มcommissionให้เจ้าหน้าที่หรือซ่อนเป็นgovernmentfee;
  แพ็กเกจที่ตกลงคือlegitimateMyanmarcompanyservices + applicableofficialfees
- อย่าใช้memoryเก่าเกี่ยวกับ0550หรือ0553vendor/B-categorymappingมาทับcodeและhandoffนี้
- คงuserworkflowเดิม; ทำสิ่งที่ได้รับอนุญาตต่อได้ ไม่ถามยืนยันเรื่องเดิมซ้ำ
- handoffนี้ไม่ได้เพิ่มราคาC1/C2หรือitemizeSKUเสร็จแล้ว งานนั้นคือpriorityของnewchat
