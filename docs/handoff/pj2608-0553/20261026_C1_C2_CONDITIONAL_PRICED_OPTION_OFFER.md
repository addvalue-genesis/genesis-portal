# PJ2608-0553 — PRICED Part C Conditional Budgetary Options, 26-Oct-2026

## Owner instruction
User explicitly selected immediate C1/C2 bid amounts rather than the former NOT QUOTED-only Part C summary: **"ต้องให้เสนอราคามาเลย"**.

## Proposal, currency, commercial authority
| Category | Source reviewed Working / comparator THB | USD policy | Offered conditional budgetary option USD | Included Base A+B? |
|---|---:|---|---:|---|
| C1 Capital Spares, 1 set marine RACON | THB 3,071,250.00, installed MDS/ORGA FCA reference × existing 1.30 planning SELL factor | 31.5 THB/USD; upward USD100 summary | **97,500.00** | NO |
| C2 Two-Year Spares, original 12 Rev08 reference rows | THB 721,806.60 from superseded Rev08 USD rates ×31.5 | 31.5 THB/USD; upward USD100 summary | **23,000.00** | NO |
| **Additional conditional options only** | 3,793,056.60 THB underlying source review | | **120,500.00** | **Separate option, NOT in A+B** |

The C2 unrounded source review is approximately USD 22,914.50, so the rounded offer is USD 23,000. C1 source is installed RACON comparable USD75,000 FCA ×1.30. These are **owner-selected conditional budgetary prices**, not independently confirmed 2026 OEM spare item rates or firm DDP/CIF landed cost. No extra markup or second conversion applied.

## Code/source authority
- `data/optionBudgetaryOffer0553.js`: central price selection. Management conditional offer `C1=THB3071250→USD97500`; `C2=THB721806.60→USD23000`; no budget quote issued via software.
- `data/releaseCommercialModel0553.js`: the Release's two C rows now carry `budgetaryOptionOfferTHB/USD`, `budgetaryOfferStatus`, `budgetaryOfferSourceId`, prepared flags from this price source. The independently approved OEM Cost-derived `customerSellTHB` remains null. `cCostReady` and `releaseAllowed` remain false, so a budgetary bid cannot silently masquerade as a firm OEM spare supplier quote.
- `data/officialUsdRelease0553.js`: projects those same quoted budgetary USD prices into `c[].budgetaryOptionQuoteUSD`, checks the source THB/FX/upward100 rule, and preserves `c[].amountUSD===null` for unverified firm price authority.
- `data/otherSpareItemizedPresentation0553.js`: allocates the explicit C1/C2 quote parent totals into a 1-line C1 Annex and 12-line C2 Annex. Historical 7/8-inch feeder is replaced in the **proposed description** by an installed-feeder-compatible replacement cable; the original Rev08 7/8-inch source remains for audit only. All C2 rows retain historical source IDs, no invented original OEM SKU/lead time.
- `ReleaseCustomerWorkbook0553.jsx`: **10.3.3 Part C Summary** now shows numeric THB 3,071,250 and THB 721,806.60 with "CONDITIONAL BUDGETARY OFFER" tags, separated from A+B. Priced C1/C2 Annex displayed first; old 4 MR-level unpriced source rows remain accessible in a *collapsed engineering Source/Trace* table rather than visibly contradicting the new budget offer.
- `OfficialUsdRelease0553.jsx`: **10.3.4 Part C Summary** now shows C1 USD 97,500 and C2 USD 23,000 (Conditional Budgetary Offer), same per-line annex figures, no price hidden behind "NOT QUOTED" despite offer being explicit.
- `nativeWorkingDraft0553.js` `buildNativeOfficialRelease0553`: original six-sheet native Excel summary F41/G41 C1=97500 and F42/G42 C2=23000, H41/H42 show conditional/buyer technical qualifier. C1 I19=97500 and C2 I19=23000; 12 C2 unit rates are distributed proportionally from existing historical Working reference at 4 decimal precision and Qty×Unit rounds to exact total cents.
- `validate-0553-official-usd-release.cjs`: tests all option-stage assumptions, SSR customer summaries, exact native cells, total separation and source provenance.

## Engineering/commercial conditions REQUIRED to convert budgetary options into firm deliverables
1. **C1:** obtain independent OEM capital spare confirmation for a separate SeaBeacon-2-compatible unit, Ex type approval/configuration, accessories, lead time, actual CIF freight/insurance and price/validity confirmation. Installed FCA equipment cost is **not** a spare quotation.
2. **C2:** no firm supplier quote for 12 Rev08 reference rows; replace historical 7/8-inch feeder with selected-system-compatible cable diameter, finalize OEM SPIR quantity and part number, exclude same physical SKUs supplied under B10 pursuant to MR Attachment 7 para.6, verify technical ratings and vendor price.
3. Original purchaser form requests **DDP site**. Proposed **CIF Zhuhai Port** is a commercial deviation still requiring purchaser agreement.
4. **C1/C2 are options**: USD120,500 is excluded from the Base A+B amount, and no WBS financial posting, vendor PO or automatically issued customer offer occurs from these read-only previews.

## User-local regression
Use the actual Windows worktree:
```powershell
Set-Location "C:\Users\acer suriyapong\DEV\genesis-0553-20261024-122340\frontend"
git status --short
git pull --ff-only origin fix/pj2608-0553-urgent-thailand-cif-pricing-20261024
npm run validate:0553-official-usd-release
npm run validate:0553-spare-lifecycle-roundtrip
npm run validate:0553-budget-change-summary
npm run build
npm start
```
Check 10.3.3 Part C price THB, C1/C2 annex, 10.3.4 Part C price USD; Export Excel English USD and verify Scope row41/42; C1/C2 I19. **Run on the user's machine is still required; GitHub edits/static readbacks are not actual npm/build test passes.**

## Deliverable
A separate Part C conditional budgetary quote workbook is prepared from original six-sheet `4-Scope of Supply.xlsx`: `PJ2608-0553_C1_C2_Conditional_Budgetary_Option_Quotation_Rev01.xlsx`. Only Part C Source Summary/Annex fields are newly quoted; other four native template sheets retain their original content and are NOT a standalone complete live project price. This part-C workbook is suitable for internal quotation review, not a firm supplier quotation.

## Final historical C2 Release → Source → Release navigation closure
- Each of 12 C2 `C2-REV08-01..12` displayed Budgetary Option SKU-family rows retains **its true historical Rev08 source key** (`historicalSourceId`). It is **not** falsely mapped to any of the four new unquoted OEM MR C2 parent lines.
- `SparePricedBudgetReview0553.jsx` attaches a unique Working-only DOM Module ID `bid.budget.working.bc.c2.priced-budget-review.c2-rev08-##`.
- `OtherSpareOriginalAnnex0553.jsx` exact “↗ Rev08 Source” navigates to that Working reference row. `CommercialWorkspace.jsx` retains the historic source identity as a separate selection key; the Return action on Working leads to `ReleaseCustomerWorkbook0553.jsx`, which scrolls/highlights the matching `data-other-spare-source-id` C2 Budgetary Annex row.
- B11/B13 and C1 continue to use their *actual* working financial source row IDs. The 16 original MR financial source→Release traces remain immutable. Historical C2 items do not represent technically approved OEM SKU stock or a confirmed 2026 quotation.
- `validate-0553-official-usd-release.cjs` now checks historical C2 12/12 selection IDs and read-only exact roundtrip hooks.

## Independent execution and native preview artifact
A six-sheet **INTERNAL PRE-AWARD REVIEW**, `PJ2608-0553_ABC_Spares_PreAward_Priced_Native_6Sheets_Rev07_INTERNAL.xlsx`, has been generated from the original-format working spreadsheet and conditional Part C candidate workbook. All Annex Qty×Unit and summary totals reconcile: **B10 USD16,200; B11 USD5,100; B13 USD1,500; C1 USD97,500; C2 USD23,000**. The formula error scan reports zero results. Note that this standalone review workbook does not certify a complete issued Part A+B customer proposal. The GENESIS exporter code is independently updated to fill the original six-sheet template; however the user must still run Node/browser regression to confirm its actual output.

For additional confidence the core GitHub **actual JavaScript source functions** `selectSparePricedBudgetReview0553`, `selectOptionBudgetaryOffer0553`, `buildOtherSpareItemizedPresentation0553` and `buildOfficialUsdRelease0553` were dynamically executed in a sandboxed JS test harness with the documented 10.2 Working row values and original Rev08 item list, verifying C1 USD97,500 and C2 12 rows sum USD23,000 while the official A+B main total is independent. This is not the same as `npm run build` on the actual user's entire repository.
