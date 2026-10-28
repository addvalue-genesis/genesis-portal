# PJ2608-0553 — B11 / B13 / C1 / C2 Priced Original Native Annex Review (25-Oct-2026)

## Owner request
Populate the four original `4-Scope of Supply.xlsx` customer-form Annex tabs with actual Qty / Unit Price / Extended Price, taking numbers from **Working** and sourced historical evidence, while preserving 10.2 → 10.3.3 and Release → Source → Release identities.

## Completed
A distinct **INTERNAL non-issued priced budgetary derivative** of the user's actual original `4-Scope of Supply.xlsx` was created at:
`PJ2608-0553_B11_B13_C1_C2_Native_Priced_Budgetary_INTERNAL_Rev01.xlsx`
- Imported from the actual original 6-sheet customer native XLSX, no changes to existing six sheet names.
- Populated original worksheet B–I item cells and J lead time where applicable. Preserves original title/header/total row positions, original merge and notes.
- I rows have Excel formulas `=G6*H6` etc. Totals use `=SUM(I6:I17)` / exact supported row ranges.
- B1 expressly labels non-issued budget status. Customer official DDP compliance is not falsely claimed.
- **B11 SpecialTool: 4 MR-phase tool sets** with source `B11-PTTEP-01..04`; Qty 1 each, unit THB 85,995 / 26,617.50 / 14,332.50 / 30,712.50; total THB 157,657.50. Their descriptions map EXA-A8 Att-2 five minimum telecom functions into the four existing envelopes, with TETRA vs DMR and OEM included licences HOLD. These 4 headings are NOT 5 individually verified purchasable SKUs.
- **B13 Consumerables: 3 current Working allowance stock sets** Qty 4/4/1 at Unit THB 4914 / 3890.25 / 11466; total THB 46,683.00; B5 packing/A5 permanent installation duplicate gate still pending.
- **C1 CapitalSpares: 1 marine RACON installed-equipment FCA commercial comparable** THB 3,071,250.00 (MDS historical FCA USD 75000 × FX31.5 × factor1.30), *not* OEM verified standalone spare or DDP. C1 currently NOT QUOTED, new number only budgetary review.
- **C2 Two-year spares: 12 historic Rev08 source items** Qty and original historical USD SELL ×31.5; estimated aggregate THB ~721,806.60. Potential B10 physical duplicates and 7/8-inch vs selected 1/2-inch feeder mismatch flagged in each line. Not independently priced OEM two-year SPIR; C2 currently NOT QUOTED and quote hold mandatory.
- No new hardcoded customer price was posted to `spareCustomerSchedule0553.js`, `bcTurnkeyWorkingCost0553.js`, `officialUsdRelease0553.js` or `nativeWorkingDraft0553.js`; original source remains unchanged.
- For the four original customer Annex worksheets, 4 / 3 / 1 / 12 rows fit their existing 13 physical row capacities. Expansion >13 would need safe native row insertion and all merged/formula/print-area adjustments; not required by this particular four-sheet review.

## Live GENESIS code
- New `data/sparePricedBudgetReview0553.js` aggregates same source values, tracks exact B11/B13 financial IDs, no invented mapping of Rev08 C2 candidate to current C2 MR-level financial parent.
- New `SparePricedBudgetReview0553.jsx` displays an original-annex-style 8/9 column breakdown on 10.2 Working and 10.3.3 **Internal Review** only. Qty × Unit THB × Total, evidence authority, status and optional parent Source link.
- `ReleaseCustomerWorkbook0553.jsx`: one read-only reviewer after native-like Annex for B11/B13/C1/C2 in internal mode; client preview unaffected.
- `ScopeBcAnnexDetail0553.jsx`: above source audit in 10.2 Working only.
- `validate-0553-spare-lifecycle-roundtrip.cjs`: additional guard for 4/3/1/12 review lines, B11/13 exact financial amount, C1 installed comparator, C2 historical rate and nonposting flag; bundled into `npm run build`.
- B10 and entire pre-existing 16/16 parent trace not changed.

## Known limitations — material!
- Original 2026 OEM prices and spare stock quantities for B11, B13, C1, C2 not all established. Existing B11 and B13 rates are parametric SELL planning assumptions, not contract-released DDP lines.
- The C1 installed MDS equipment quote does not prove a capital spare, and C2 historic source price does not establish a current supplier quotation nor two-year fixed price; customer annex has a 2-year fixed validity statement that is **NOT** supported.
- True delivered B10/C2 spare item deduplication requires exact OEM SKU, physical Qty, and usage/location; do not subtract by similar functional labels.
- The user's desire to update Official and native export directly from actual selected new SKU costs remains unresolved: must approve the new individual prices or risk issuing an incorrect statement.
- Source → Release → Source → Release parent financial navigation remains available; C2 historic 12 candidate rows are **not** falsely mapped as 12 current release line IDs.

## Test on user's Windows worktree
```powershell
Set-Location "C:\Users\acer suriyapong\DEV\genesis-0553\frontend"
git pull --ff-only origin fix/pj2608-0553-urgent-thailand-cif-pricing-20261024
npm run validate:0553-spare-lifecycle-roundtrip
npm run validate:0553-official-usd-release
npm run build
npm start
```
This session can commit/read remote GitHub and create/verify a standalone spreadsheet but CANNOT claim that Node/Webpack or live browser UX has executed. Client Release approval stays HOLD.
