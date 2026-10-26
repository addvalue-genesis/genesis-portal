# PJ2608-0553 | Handoff to New Chat — Complete B11/B13/C1/C2 Priced Source→Release→Source, Excel and Regression
**Checkpoint:** 2026-10-26 (Asia/Bangkok), previous remote HEAD `b4f3aba9592f1544e927177d1817ef1f63423f65`.
**Repository:** `addvalue-genesis/genesis-portal`.
**Branch:** `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024`.
**PR:** #39 (OPEN / DRAFT; DO NOT MERGE before validated).
**Real Windows frontend worktree:** `C:\Users\acer suriyapong\DEV\genesis-0553-20261024-122340\frontend`.
The older `...\DEV\genesis-0553\frontend` path DOES NOT EXIST. Do not append `cd frontend` when already in the real frontend directory.

## OWNER INTENT (DO NOT RE-ASK)
Finish the existing PJ2608-0553 live GENESIS implementation; keep original `4-Scope of Supply.xlsx` six-sheet layout and correct 10.3.3/10.3.4 and Export Excel **prices and Qty visible for B10, B11, B13, C1, C2**, working source trace and reverse Release→Source→Release, no duplicated Part A/B3/B5/B10/C2 amounts.
Owner explicitly directed: **"ต้องให้เสนอราคามาเลย"** (C1/C2 need prices offered now, not ONLY "NOT QUOTED"). Therefore the new owner-selected C1/C2 amounts are *CONDITIONAL BUDGETARY PRICED OPTIONS*, not just comparison references; clearly qualify that they are NOT verified firm 2026 OEM spare quotations. **Do not leave Part C Summary blank.** Do not invent OEM models, firm supplier DDP/CIF costs, technically accepted spare quantities or markup again.
Source evidence: MR0001 Rev.C1 `https://drive.google.com/file/d/1XMDolhzCvw2kQnahlFBwxTujkW22pQSm/view`; Attachment 5 (start-up commissioning spares), Attachment 7 (C2 excludes B10-listed stock), EXA-A8 minimum spares/special tools, BOD, SPE/DTS and project Required BOM. C2 old 7/8-inch feeder mismatch needs technically accepted substitution.

## PRICE AUTHORITIES — EXACT
| WBS | Selected Working/review THB | 10.3.4 USD | Authority and treatment |
|---|---:|---:|---|
| B10 | 509,827.50 | **16,200.00** | 4 existing MR kit financial parents (4/3/4/3), 14 staged function/1 LOT budget allocation rows. Working before USD100 official rounding = USD16,185. No 14 independent OEM SKU Qty/price proof. |
| B11 | 157,657.50 | **5,100.00** | 4 existing MR tool allowance parents, ExA-A8 has 5 telecom minimum functions to reconcile, OEM-included vs B3 test gear HOLD |
| B13 | 46,683.00 | **1,500.00** | 3 preservation/consumable allowance parents, exclude duplicate A5/B5 materials |
| C1 (OPTION) | 3,071,250.00 | **97,500.00** | One complete RACON comparable: MDS/ORGA installed FCA USD75,000 x31.5 x previous x1.30 planning sell; **conditional owner-selected budget offer, not separately confirmed spare/OEM CIF quote** |
| C2 (OPTION) | 721,806.60 | **23,000.00** | 12 superseded Rev08 historical item rates x FX31.5 then **upward USD100**; conditional owner-selected budget offer, not 2026 OEM firm quote |
| **Part C Options only** | 3,793,056.60 | **120,500.00** | C1+C2 SEPARATE, NEVER add to Base A+B |

**Price discipline:** C1/C2 `customerSellTHB` and official `c[].amountUSD` remain `null` for the *firm OEM cost-derived release lane*, while separate explicitly selected `budgetaryOptionOfferTHB/USD` and `budgetaryOptionQuoteUSD` must be numeric and visible as CONDITIONAL OFFER. These fields must not be conflated with unverified directCost or double-marked-up. `issued=false`, approval flags false, PR remains Draft. Proposed CIF Zhuhai Port, Incoterms 2020, needs buyer approval against original native DDP site.

## COMPLETED CODE, ALREADY REMOTELY COMMITTED (inspect latest HEAD)
- `frontend/src/project0553/data/optionBudgetaryOffer0553.js`: central C1/C2 owner-selected conditional amounts and source/evidence.
- `data/releaseCommercialModel0553.js`: separate `budgetaryOptionOfferTHB/USD`, `budgetaryOfferStatus`, source module ID; canonical 16 parent financial Source IDs remain unchanged, C firm-source sell still null.
- `data/officialUsdRelease0553.js`: USD option offer projection `c[].budgetaryOptionQuoteUSD`, separate from firm `amountUSD`; C1/C2 excluded Base.
- `data/otherSpareItemizedPresentation0553.js`: B11=4 selected, B13=3 selected, C1=1 conditional, C2=12 conditional. Each Qty×unitUSD rounded to item total, sums USD5100/1500/97500/23000. Historical C2 source IDs `C2-REV08-01..12` remain *historical*, not wrongly tagged as current 4 MR financial owner rows. 7/8-inch feeder in customer proposed description substituted with installed-size-compatible feeder requirement, actual vendor model open.
- `OfficialUsdRelease0553.jsx` and `OtherSpareOriginalAnnex0553.jsx`: Part C Summary numeric USD97,500 and USD23,000 with CONDITIONAL BUDGETARY OFFER label; original 8/9-column itemized annexes.
- `ReleaseCustomerWorkbook0553.jsx`: 10.3.3 Part C Summary numeric THB3,071,250 and THB721,806.60; C1/C2 priced annex first, old current 4 MR-level unquoted source table collapsed for audit. Preserve all 16 current source parent row links.
- `nativeWorkingDraft0553.js` `buildNativeOfficialRelease0553`: original six-sheet export; summary C1 F41/G41 USD97500, C2 F42/G42 USD23000; C1 I19=97500; C2 I19=23000; descriptions and Terms qualify as conditional. B10 now has 14 native priced LOT lines, Total I20, Remark B21 (one extra original native body row). No Part C addition to A+B G38.
- `SparePricedBudgetReview0553.jsx` adds 12 exact Working historical C2 row anchors; `OtherSpareOriginalAnnex0553.jsx` links to those; `CommercialWorkspace.jsx` preserves historic C2 sourceSelectionId for reverse navigation; `ReleaseCustomerWorkbook0553.jsx` focuses exact C2-REV08 row on return.
- `frontend/scripts/validate-0553-official-usd-release.cjs`: expanded source, SSR, native cell and totals assertions, and C2 historical navigation string checks.
- Changelog `2026-10-26-R62`; preceding handoff `docs/handoff/pj2608-0553/20261026_C1_C2_CONDITIONAL_PRICED_OPTION_OFFER.md`.

## IMPORTANT: WHAT REMAINS TO COMPLETE, IN PRIORITY ORDER
1. **RUN ACTUAL Node/webpack regression**: current remote has *NO Github Actions runs* for HEAD. Developer source/readback checks are NOT real `npm` passes. User's old webpack pass was from pre-change code. Run `npm run validate:0553-official-usd-release`, `validate:0553-spare-lifecycle-roundtrip`, `validate:0553-b10-release-sku-preview`, `validate:0553-b10-native-annex-map`, `validate:0553-budget-change-summary`, and `npm run build` in the user's Windows frontend worktree; fix each actual failure, commit and re-pull. In connector-only chat, you cannot claim locally run tests without logs.
2. **HIGH-RISK regression:** SSR `validate:0553-official-usd-release.cjs` must actually render all four annex components and both summary modes. Check type/format choices: `model.otherSpareItemizedAnnex`, `itemRows`, USD rounding C2 12x parts at Qty 1/2/4/8/30/50 (unit up to 4 decimals) and prices; original native numeric cells F41/G41/F42/G42, C1/C2 I19; six-sheet original geometry, blank historic cells and idempotent re-export.
3. **Check C2 exact navigation** end to end: 10.3.4 C2 item `C2-REV08-xx` -> 10.2 Working exact historical row -> back to 10.3.3 selected exact item `C2-REV08-xx` (not arbitrary first 4 MR parent) -> verify no duplicate source IDs. The most recent change `b4f3aba9` adds `historicalTarget` focus in Release UI and SSR test guards; NO actual browser test.
4. **10.3.3, 10.3.4 and native Excel parity:** Summary C1/C2 must say CONDITIONAL PRICED OPTION (not NOT QUOTED); Annex must have same numbers, Item/Tag/Description/Detail Specification/Materials/QTY/Unit USD/Total USD/ARO, customer-safe detail, and Source buttons. If 10.3.3 keeps old unquoted rows collapsed, verify no contradictory unquoted prominent footer.
5. **Commercial-source reconciliation checks**: C1 THB3,071,250 -> USD97,500; C2 THB721,806.60 -> official offer USD23,000; 12 item sums match C2 quote; options separately total USD120,500. Source 10.2 C2 historical evidence is superseded Rev08, not current OEM RF cable/spare list. Preserve original 4 C2 MR financial Source IDs and historical 12 reference IDs as distinct ledgers.
6. **Engineering delivery/acceptance limits**: Confirm independent RACON capital spare SKU/Ex/lead time and real CIF quote, C2 two-year SPIR/MTBF quantity and correct feeder size, B10/C2 actual shared SKU exclusions, any B11 OEM included tools/EXA-A8 5 functions vs 4 budget items, B13 A5/B5 nonduplicate. These cannot be honestly called **verified firm vendor quotations** without documents. Do not invent. This is an OPEN qualification gate but does not justify emptying the owner-directed conditional budget price.
7. **Do not merge PR #39** until user's local regression and original native XLSX review are green. Produce a concise final handoff closing checklist.

## POWER SHELL (REAL PATH — no nested frontend)
```powershell
Set-Location "C:\Users\acer suriyapong\DEV\genesis-0553-20261024-122340\frontend"
git status --short
git pull --ff-only origin fix/pj2608-0553-urgent-thailand-cif-pricing-20261024
npm run validate:0553-official-usd-release
npm run validate:0553-spare-lifecycle-roundtrip
npm run validate:0553-b10-release-sku-preview
npm run validate:0553-b10-native-annex-map
npm run validate:0553-budget-change-summary
npm run build
npm start
```
App: `http://localhost:3000/projects/pj2608-0553`.
For native export test: use **10.3.4 Official Release → Export Excel — English / USD**, inspect original `Scope of supply` C1/C2 F41:G42, B10 `B6:I19` + I20, C1 `B6:I6` and I19, C2 `B6:I17` and I19, and Summary A+B G38 unchanged.

## RESPONSE RULES FOR NEXT CHAT
Proceed without asking owner to repeat or approving routine changes. Use GitHub connector and exact remote branch, solve current actual validation errors first, commit fixes. Preserve the tender price chain Requirement → Installed TAG/Required BOM → Spare function → Working/source evidence → 10.3.3 → 10.3.4 → native XLSX → reverse Source links. Distinguish **conditional budgetary priced bid**, **current OEM verified quote**, **historical priced source**, and **actual Part A installed hardware**. Never turn Part A ODU/IDU/Cisco prices into fake B10 physical spare Qty. Do not promise background work.
