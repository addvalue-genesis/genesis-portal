# PJ2608-0553 — B10 10.3.4 Official Qty/Unit/Total + Original Native XLSX 14 rows (26 Oct 2026)

## User-reported blocker
User screenshot at `localhost:3000/projects/pj2608-0553` / 10.3.4 / B10 showed 14 clean spare-function lines, but **Qty = —, Unit Price = To be quoted, Total Price = To be quoted** even after 10.2 Working (THB 509,827.50) and internal 10.3.3 had budgetary 14-line Price allocation USD 16,185. Customer requested rows with Qty, Unit, Total and navigable Source → Release.

## Financial authority and hard boundary
`10.2 source working`: 4 B10 MR envelopes, 4/3/4/3 commissioning-kit sets, THB 229,320 / 85,995 / 90,090 / 104,422.50 = **THB 509,827.50**, converted @ planning FX 31.5 to **USD 16,185** *before* Official per-summary rounding.
`10.3.4 Official financial parent`: exactly 4 source-owned B10 rows, original reference and USD100 upward parent rounding, aggregate **USD 16,200**. No new Working price owner or financial posting.
`14 SPARE FUNCTION displayed rows`: correspond to MR Attachment 5 and the installed Required BOM. No actual approved OEM spare physical SKU/Qty or independently quoted CIF rate. **Each displayed 1 LOT is only a functional budget allocation**, not 1 physical spare piece. The 14 displayed rates are allocated directly from their *own respective 4 officially rounded MR parents*, with cent remainder distribution; amounts total USD 16,200. The USD15 incremental Official rounding never becomes a new underlying cost or extra additive charge.

## Implemented
1. `frontend/src/project0553/data/b10OfficialItemizedAnnex0553.js`: pure read-only allocator; exact 14 original B10 selection source IDs, associated 4 `sourceId`, `traceId`, `sourceRowModuleId` and MR parent Official Price. Reconcile each MR in cents; reject unsupported qty/duplicates, altered parent amounts or issued status. Supports reordered B10 MR parents by validating qty against immutable source IDs.
2. `frontend/src/project0553/data/officialUsdRelease0553.js`: attach `b10ItemizedAnnex` to the Official USD projection, computed once from the 4 source-owned official lines.
3. `B10KitPriceSummary0553.jsx` and `B10NativeAnnexReview0553.jsx`: in 10.3.4, each of the 14 item rows displays **Qty 1 LOT / Unit USD / Amount USD**, total **16,200.00**. No internal audit messages in Description/Specification/Materials; prominent **PRE-AWARD BUDGETARY / NOT OEM CIF QUOTE / NOT ISSUED** notice, and unit LOT explanation. Working/10.3.3 continue to show pre-rounded **16,185**. Official UI source button routes each B10 functional candidate back to its exact 10.2 stage Source via parent MR ID and selection ID; browser return action resolves existing 10.3.3 item row.
4. `OfficialUsdRelease0553.jsx` and `CommercialWorkspace.jsx`: wire official Source action to the canonical 10.2 source navigation with no price posting.
5. `frontend/src/project0553/nativeWorkingDraft0553.js` `buildNativeOfficialRelease0553`: generated original-format six-sheet USD workbook uses `model.b10ItemizedAnnex.rows` on B10. Clone original row18 style, move 19 Total → 20 and 20 Remark → 21, move corresponding merges, fill 14 actual financial LOT values, numeric Unit/Total; preserve other sheets, English-only output, original native geometry, and current summary amount USD 16,200. A repeat export does not double-insert. Footer makes clear budgetary financial allocation is NOT an independently quoted OEM Spare/CIF unit rate; customer issue still blocked.
6. `validate-0553-b10-native-annex-map.cjs`, `validate-0553-b10-release-sku-preview.cjs`, `validate-0553-official-usd-release.cjs`: updated assertions for 14 priced original-layout lines, exact two-stage USD16,185/16,200 distinction, source/roundtrip IDs, 14 native workbook row20 Total/row21 Remark, no mutation of source WBS and no supplier Cost/Technical Internal leakage.
7. `budgetChangeLog0553.js`: R61, new PRICE_REVIEW_REQUIRED, no source price posting.

## What is NOT established or approved
- Physical OEM B10 spare Qty or full Part Number list; the underlying 14 functional lines are not a fabricated issued SPIR.
- Actual USD unit cost/SELL by physical spare SKU or independently quoted CIF freight, insurance and supplier warranty; proposal CIF Zhuhai vs original purchaser DDP site remains subject to buyer acceptance.
- Final customer-issued quotation approval; `model.issued=false`, `model.b10ItemizedAnnex.customerIssued=false` and PR #39 remains Draft.
- Price-to-Win scenario THB568,083.85 is separate, nonposting research and is **not** part of this selected-source 10.3.4 B10 USD calculation.

## User-local validation
Run in the actual worktree (the old `C:\Users\acer suriyapong\DEV\genesis-0553\frontend` was missing):
```powershell
Set-Location "C:\Users\acer suriyapong\DEV\genesis-0553-20261024-122340\frontend"
git status --short
git pull --ff-only origin fix/pj2608-0553-urgent-thailand-cif-pricing-20261024
npm run validate:0553-b10-native-annex-map
npm run validate:0553-b10-release-sku-preview
npm run validate:0553-official-usd-release
npm run build
npm start
```
Then open `http://localhost:3000/projects/pj2608-0553` → 10.3.4 Official → B10. Check 14 physical-function budget rows, 1 LOT/unit, total USD16,200 and row buttons to Source. Click `Export Excel — English / USD`, inspect `B10 CommSpares` B6:I19, Total I20 and Remark B21, and other five original sheets.
**No Node/Webpack or browser regression execution was done in this connector-only edit session**; actual user-local PASS is required before claiming compile/functional test success.
