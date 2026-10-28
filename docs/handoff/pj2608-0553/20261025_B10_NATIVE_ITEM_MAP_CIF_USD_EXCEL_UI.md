# PJ2608-0553 — B10 Original Excel Annex B-I mapping, dynamic rows, CIF/USD commercial gate

Date: 25 October 2026. Repo: addvalue-genesis/genesis-portal.
Branch: fix/pj2608-0553-urgent-thailand-cif-pricing-20261024
Base remote HEAD confirmed 86cc0bc111c547af247b7ef93089cb7d233ed821; PR #39 draft/unmerged.

## User's correction
B10 must **display in the customer's original B10 CommSpares template** with B-I:
Item | Tag No | Description | Detail Specification | Materials | QTY | Unit Price (currency) | Total Price (currency).
Map from the read-only Working preview: Original Item/Source→Item & reference in Specification; Equipment/Spare Function→Description; OEM Make/PartNo→Specification; related installed TAG→Tag No; owner/material status→Materials; source offered Quantity (not B10 stock Qty)→QTY; source quoted USD and sourced line extension→reference columns H/I. **If >13 physical items, insert rows into the same sheet**, shift original merged footer, and retain original six sheets. The user asked whether DDP should be changed to CIF and unit currency USD.

## Implemented read-only mapping
`data/b10NativeAnnexReview0553.js` consumes exact `selectB10PhysicalComposition0553()` (21 installed/optional source candidate items + 14 MR Attachment-5 required spare function rows = 35 reference rows). There are no current OEM approved B10 Purchase Qty or spare Unit SELL entries, so these are **not 35 purchasable B10 SKU lines**. The rows contain source IDs, 4 MR financial parent source anchors, source quoted Qty, reference currency/rate, indicated original offer USD values, internal FX31.5 conversion for VST/EXION THB quoted equipment, exact PartNo only where source exists; all `customerIssueAllowed=false`. 4/3/4/3 kit quantity and existing selected THB509827.50 remain unchanged.
`B10NativeAnnexReview0553.jsx` now replaces secondary `B10CompositionBreakdown0553` in `B10KitPriceSummary0553` shared Budgetary/Scope/10.3.3/10.3.4. It renders the original eight B-I columns, 35 rows and 14 MR spare-function IDs in a contained scrollable table. An Internal mode shows supplier **SOURCE reference Qty/USD** (not CIF SELL); customer/official modes say To be quoted until approved B10 spare Qty and CIF selling price exist. Source→Release→Source parent IDs and four kit financial envelopes stay available in the same view.
`releaseWorkbook0553.css` added scoped responsive table.
`ReleaseCustomerWorkbook0553.jsx` adds a dedicated INTERNAL B10 native XLSX button. Does not touch unrelated Official Export.

## Native .xlsx output
`nativeWorkingDraft0553.js` exports **new independent function** `buildNativeB10ItemizedReview0553(originalXlsxFile,annex)`, not modifying existing `buildNativeWorkingDraft0553` nor `buildNativeOfficialRelease0553`.
- Read exact original six-sheet XLSX zip (preinstalled native base64 source).
- Shift sheet2 rows r19 onwards by extra row count, clone native styled body row18 for inserted item lines, update merge `B19:H19` to `B41:H41` and `B20:E20` to `B42:E42`, preserving all other original cells, six native sheets and ZIP entries.
- Populate B6:I40 with mapped Item/Tag/Description/Spec/Material/Source Offered Qty/Source Unit USD/Source USD amount.
- Mark header `CIF ZHUHAI PORT — PROPOSED / SOURCE PRICE NOT CIF`, `SOURCE UNIT USD (NOT CIF SELL)`, `SOURCE TOTAL USD (NOT CIF SELL)`.
- Move native Total to row41 with `NOT QUOTED` and detailed Internal legal/technical warning to row42.
- Do not post sum of Part A/Optional equipment quote prices as B10.
- This is deliberately **not** a customer-issued CIF spare-price workbook and does not invent new approved purchase/spare Qty/rates.

Also produced a standalone verified derivative (using spreadsheet artifact tooling), from the actual attached `4-Scope of Supply.xlsx`:
`PJ2608-0553_B10_Original_Annex_CIF_USD_Internal_Rev03.xlsx`.
It retains six original sheets, 35 mapped items, 18 supplied reference price lines, row-level source Qty*unit formula for reference-bearing rows, footer row41 and remark row42; ZIP test passed. Original user's source file is unchanged.

## Commercial Incoterm decision
Project Working pricing strategy selects **CIF Zhuhai Port, China, Incoterms 2020**, while the supplied customer original Excel labels DDP Purchaser's Yard. Never silently represent old NextG/EXION/VST/MDS mixed-source FCA/DDP-equipment quote unit references as a valid CIF offered spare unit SELL. Require customer acceptance/qualified deviation plus full CIF cost build incl. packaging/freight/insurance, stock and vendor guarantee. Official USD summary remains unchanged until selected validated financial source is approved.

## Testing
Added `scripts/validate-0553-b10-native-annex-map.cjs` to build gates, verifying:
- Native mapping 35 rows, 14 required spare functions, 4 MR source identifiers.
- Both Internal and customer React original 8-column DOM.
- >13 XLSX native row-insertion/merge preservation and unchanged five other sheets.
- Source USD reference never turns into accepted B10 spare CIF SELL.
- No 10.3.3 Official price, FX rounding, six-sheet customer native exporter or Working financial parent recalculation.

No CI/Node/Webpack has been run on owner's workstation yet. Run from owner's frontend worktree:
```powershell
git pull --ff-only origin fix/pj2608-0553-urgent-thailand-cif-pricing-20261024
npm run validate:0553-b10-native-annex-map
npm run validate:0553-b10-release-sku-preview
npm run validate:0553-native-working-export
npm run validate:0553-official-usd-release
npm run build
npm start
```
Customer Final Release still HOLD. Do not hide that 35 equipment/functional review rows do not yet give an approved B10 spare Qty*Unit SELL.

## Next separate scope
After OEM SPIR establishes actual B10 spare SKU/Qty and Vendor CIF cost, choose and approve newly itemized Working B10 stock owner/reprice; reconcile against Part A/C1/C2, derive USD Unit SELL with margin once, then replace parent B10 financial package Release/native original draft only via controlled source-to-release source IDs and tests. Final Excel needs customer approval of CIF vs DDP qualification.
