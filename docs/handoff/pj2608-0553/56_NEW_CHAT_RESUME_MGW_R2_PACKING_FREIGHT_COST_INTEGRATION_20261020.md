# PJ2608-0553 — NEW CHAT HANDOFF 56 / MGW P26-058_R2 Selected BOM, Cover, Freight & Packing
Date: 2026-10-20 (Thailand)
Status: **WORK IN PROGRESS; unmerged Draft PR chain; latest integration branch NOT YET LOCALLY BUILT OR BROWSER ACCEPTED**.
Repo: `addvalue-genesis/genesis-portal`.
Latest branch: `feat/pj2608-0553-mgw-road-freight-packing-evidence-20261020`.
Working directory on user's PC: `J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553-release\frontend`.
Never automatically merge or issue a customer quote; cost baseline Rev02/Rev03 and B/C Working SELL frozen until separate management approval.

## Read first — exact source files
1. THIS handoff `docs/handoff/pj2608-0553/56_NEW_CHAT_RESUME_MGW_R2_PACKING_FREIGHT_COST_INTEGRATION_20261020.md`.
2. `55_MGW_NANTONG_ZHUHAI_JUTAL_ROAD_FREIGHT_PACKING_20261020.md` — latest WhatsApp evidence, potential USD500 packing overlap.
3. `54_MGW_R2_COVER_20261020_COMMERCIAL_DELTA_FAT_FREIGHT.md` — 20-Oct cover USD368,841.
4. `53_MGW_PAUL_EMAIL_20261020_RACON_FREIGHT_SPARES_CLARIFICATIONS.md` — Paul email details.
5. `52_MGW_P26_058_R2_SELECTED_MR0002_MR0003_MR0004_COST_SCOPE_20261020.md` — quote BOM/source mapping.
6. `41_APPROVED_COST_BASELINE_MANIFEST_REV03.json`, `32_APPROVED_COST_BASELINE_MANIFEST_REV02.json` and `20_APPROVED_ARCHITECTURE_BASELINE_MANIFEST_REV01.json` — immutable protected sources.

## Latest Google Drive source hierarchy (do not mix cover and details)
- [MGW P26-058_R2 **20-Oct-2026 Cover**](https://drive.google.com/file/d/1qOswXUq_gogU272zWDaLilRGdjhtLK7n/view) = **LATEST SUPPLIER COMMERCIAL PRICE**.
- [MGW P26-058_R2 **21-Sep-2026 Detailed PDF**](https://drive.google.com/file/d/1DLaku-mj2uYI-7A_E3z5QFZQgbz6OozA/view) = **SIX EQUIPMENT PACKAGES / OEM SKU AND QTY AUTHORITY**, no change in equipment prices.
- [Drive folder](https://drive.google.com/drive/folders/1PnJQwLVgAt8sScmiIyU53cYMAturokPO?usp=drive_link) contains both above PDFs.
- Paul Lee email **20-Oct 17:49** user Outlook screenshot = vendor confirms RACON programming kit included, road freight USD2500, promises 2-year/commissioning spares and special tools pending detailed John SPIR, free-issue RADWIN Thailand→Nantong staging, seeks Tideland/Pharos FAT example, says unspecified "BD comply", and claims Myanmar offshore zero duty (NOT certified).
- New WhatsApp screenshots user attached in preceding chat, **20-Oct**, message **"2500 usd road transport to Jutal site include packing"** plus **"Nantong to Jutal"**, Chinese map destination **珠海巨涛海洋石油服务有限公司** (JUTAL Zhuhai); driving map ~1,639km / 17h47m is passenger-car route only, not truck shipping evidence.

## Commercial arithmetic (USD, supplier price ≠ ADDVALUE Working SELL)
| Source | MR0002 UHF | MR0003 Ex Phone | MR0004 RACON | Equipment | Vendor services | Vendor TOTAL |
|---|---:|---:|---:|---:|---:|---:|
| 21-Sep MGW R2 details | 99,564 | 25,600 | 225,177 | 350,341 | 14,500 | 364,841 |
| 20-Oct MGW R2 Cover | 99,564 | 25,600 | 225,177 | 350,341 | 18,500 | **368,841** |
| Delta | 0 | 0 | 0 | 0 | +4,000 | **+4,000** |

Cover vendor service rows:
- `SERV-1` Engineering/PM/VDRL USD8,000 (unchanged).
- `SERV-2` Integration + INTERNAL iFAT **2 days** USD5,000 (vs old single FAT USD6,000, delta -1,000).
- `SERV-4` End-user and ADDVALUE FAT premises minimum **5 days** USD2,500 (new).
- `SERV-3` Packing/marking/preparation USD500 (unchanged).
- `SERV-5` Nantong→JUTAL road freight USD2,500 (new). Paul's email USD2500 and WhatsApp USD2500 are **same transport line**, NOT extra charges.

**LATEST PACKING CONFLICT:** WhatsApp says USD2,500 road freight **includes packing** but Cover independently bills USD500 `SERV-3`. This is a **POTENTIAL USD500 scope overlap**, not yet proved duplicate. **DO NOT** unilaterally change supplier total to USD368,341, deduct B5, or add freight twice. Ask vendor whether USD500 is distinct export packing/marking or duplicate within road freight, get revised signed cover if duplicate.
Cover also says **DAP Nantong China**, conflicting with road freight to JUTAL Zhuhai; earlier detail says EXW Nantong. Confirm named Incoterm delivery point, loading/unloading, exporter/importer of record and Myanmar onward shipment. Supplier zero-duty opinion is not an official customs ruling.
FAT: ADDVALUE 10.2/B3 budgets 6 paid witness days (two staff) but vendor now proposes 2-day iFAT + minimum 5-day facility; explicit agenda and travel-day reconciliation REQUIRED.

## Management-selected equipment and code modules
- **10.1 / MR0002 / A2**, 3 Sites ZWP20/21/22, quote USD99,564:
  - UHF-1 `BD4345-00N0-AC` RFI BDA + `HRMD95-VIIIB` WAROM enclosure, 3×USD31,474 = 94,422.
  - UHF-2 `YBSS6-99`+UNV2+PolyPhaser IS-B50LN-C2+Solexy RXNMS0200JX0, 3×USD847 = 2,541.
  - UHF-3 KBT `TQJ-400AD5`, 3×USD21 = 63.
  - UHF-4 FORLLER `RF LLF 1/2\" 50`, 100m cable + six connectors PER SET; 3×USD846 = 2,538.
  - **Do not add embedded enclosure, surge, coupler or feeder connectors again**. Technical Ex assembly/Frequency/Heat/Glands verification open.
- **10.1 / MR0003 / A3**, 4 Sites ZWP20/21/22/23, 4×USD6,400=USD25,600: Gai-Tronics Auteldac 6 `212-02-6008-410` + EATON `DB3B` horn + WAROM `BXJ-S` Ex e JB and quoted gland. EXION/PROSPER is historical; external PoE/sounder/BULK has NULL rates/qty pending. EATON exact 24VDC variant, cert, actual installed TAGs open.
- **10.1 / MR0004 / A4**, 3 Sites ZWP20/21/22, 3×USD75,059=USD225,177: Tideland SeaBeacon 2 System 6 RACON with DB-5P included; programming kit **now vendor-confirmed included** by email (SKU/qty pending). MGW separate control box TCAB-514-002, BFOU cable/glands, vessel/radar FAT/purge/charging items unconfirmed; ORGA/MDS alternate USD75,000 each is historical ONLY.

## Real code and downstream dependencies
Source supplier quote details: `frontend/src/project0553/data/mgwP26058R2Selected0553.js` (vendor six equipment lines + **OLD 21-Sep USD364841 quotation**; preserved as detailed-source context).
Latest commercial cover: `.../data/mgwP26058R2Cover20261020.js` (USD368841 including SERV-1/2/4/3/5) — never overwrite equipment source with cover.
New WhatsApp: `.../data/mgwRoadFreightPackingEvidence0553.js` — read-only, USD500 overlap `confirmedCreditUSD:null`, B5/B6 posting disabled.
Paul email: `.../data/mgwPaulEmailClarifications0553.js`, `MgwPaulVendorClarifications0553.jsx`.
10.1 Working BOM: `mr0002PriceRegistry0553.js`, `mr0002WorkingBom0553.js`, `mr0003MgwWorkingBom0553.js`, `mr0004WorkingBom0553.js`, `mgwR2SelectedFieldBulk0553.js`.
Aggregation: `siteSystemCostReconciliation.js` → `bomReadModel0553.js` → `workingBomAggregation0553.js`. 10.1 BOM UI `SimpleBom0553.jsx`; 10.5 Scope `ScopeSheetsDetail0553.jsx`. Review for outdated ORGA/PROSPER text/side ledgers before declaring acceptance.
Vendor Catalog `supplierQuoteLines.js` now shows **Oct20 Cover total USD368841** plus six unchanged equipment lines.
10.2 Cover `MgwR2CommercialCover0553.jsx` displayed through `BcCostEvidenceDetail0553.jsx`; latest B5/B6 submodule IDs:
- `bid.budget.working.bc.b5.mgw-road-freight-packing-inclusion`
- `bid.budget.working.bc.b6.mgw-road-freight-packing-inclusion`
Other IDs: `bid.budget.working.bc.b6.mgw-road-freight`, `bid.budget.working.bc.b3.mgw-racon-fat-evidence`, `bid.budget.working.bc.b10.mgw-commissioning-spares`, `bid.budget.working.bc.b11.mgw-special-tools`, `bid.budget.working.bc.c2.mgw-two-year-operation-spares`.

## Immutability / financial governance
- Rev02 `mr0001TagCostLedger0553.js` git blob `65e3a690e8bc04a4cf6b812f0fe07703972ff483`.
- Rev03 `mr0001Rev03CostOverlay0553.js` `bbb382451f24b28f0eb5e55db2ddef02d0876c2f`.
- Rev03 manifest `41_APPROVED_COST_BASELINE_MANIFEST_REV03.json` `15f48926504b2826d666fa80b62e8071f7bd368b`.
- `bcTurnkeyWorkingCost0553.js` and `releaseCommercialModel0553.js` unchanged against latest branch parent.
- B3 Working SELL **THB 2,443,400** = Offshore SAT 2,016,000 (2 engineers ×40 team working days =80 MD) + VeEX rental 30,000 + MGW China FAT witness/travel 397,400. B3 SELL is not supplier iFAT/facility COST. B6 Working SELL is historical budgetary and has NOT been altered by vendor freight evidence.
- Full project customer **RELEASE HOLD**; no automatic WBS Cost/Working SELL update, no new Rev04 Baseline, no automated PR merge.

## Pull request chain and integration risk
Feature PR sequence, each PR based on previous feature (not directly on release):
- PR #10 MGW combined R2 OEM selection MR0002/3/4.
- PR #11 Paul email clarification (programming kit, USD2500 freight and spares promise).
- PR #12 20-Oct MGW Cover USD368841 and split iFAT/facility/freight.
- **Latest PR may be #13** 20-Oct supplier WhatsApp packing-included road freight; verify PR number/status live before quoting it.
- Earlier B3 / navigation PRs #6/#7/#8/#9 and independent CFO Release branch `feat/pj2608-0553-release-cfo-native-template-20261020`. DO NOT simply merge stacked PRs onto the Release branch: reconcile commit ancestry, branch drift and newer CFO native-export validation first.

## NEXT ACTIONS (do in order)
1. **Inspect latest branch HEAD and repository state**. The code change was pushed via GitHub. On user's PC `...\\genesis-portal-0553-release\\frontend` verify clean worktree, fetch and switch to remote branch **without overwriting uncommitted work**.
2. **Run validation**: `npm run validate:0553-mgw-r2-cover-20261020`; `npm run validate:0553-mgw-paul-email-clarifications`; `npm run validate:0553-mgw-r2-selected-mr234`; `npm run validate:0553-bom-runtime-reconciliation`; **`npm run build`**. Current latest branch NOT yet confirmed PASS for any local build. Investigate failed tests, fix tests/source with true evidence; NEVER merely lower expectations to pass.
3. **Browser UI acceptance**: run `npm start`, use actual displayed localhost port. Open 10.1 MR0002/MR0003/MR0004; 10.2 B5/B6, B3, B10/B11/C2; 10.5 Scope; Vendor Catalog. Confirm Module IDs searchable/copyable, selected OEMs visible and costs not duplicated, parent disclosures open, current USD368841 supplier quote and B5 USD500 overlap warning visible. Search feature should deep-link nested module IDs.
4. **Full data-flow audit**: Supplier Quote → MR Working BOM → Site/MR MTO → Scope (10.5) → Pricing/CFO (10.3) → Customer Preview (HOLD). Identify stale parallel cost views especially historical ORGA cable credits and EXION/PROSPER phone selection; update only view/projection or a new read model without touching protected cost ledger. Keep supplier COST separate from ADDVALUE Working SELL.
5. **Clarify vendor commercially**: packing USD500 possible overlap, named Nantong/ Zhuhai DAP vs EXW, insurance/loading/driver/truck shipment, 2+5 iFAT/end-user FAT vs B3 6 witness days, required SPIR list for B10/B11/C2, RADWIN free-issue China import/re-export, RACON TCAB-514-002 and programming kit SKU.
6. **Refresh cost impact JSON using latest Cover**: vendor total USD368841, price delta USD4000 vs earlier detailed R2, USD500 only *potential* overlap (no deduction), track pending direct cost separately; do not imply customer sell changed.
7. Only **after validations/screenshots and user approval** prepare clean integration onto latest CFO release and merge appropriate Draft PRs. Do not make a new customer release.

## Local commands (PowerShell, already inside frontend directory)
```powershell
git -C .. status --short
git -C .. fetch origin
git -C .. switch --detach origin/feat/pj2608-0553-mgw-road-freight-packing-evidence-20261020
git -C .. log -1 --oneline
npm run validate:0553-mgw-r2-cover-20261020
npm run validate:0553-mgw-paul-email-clarifications
npm run validate:0553-mgw-r2-selected-mr234
npm run validate:0553-bom-runtime-reconciliation
npm run build
npm start
```
Stop before `switch` if `git -C .. status --short` is nonempty. Keep PowerShell `npm start` running and use the actual port printed. A webpack size warning is not necessarily a build failure; missing validations or error messages are.
