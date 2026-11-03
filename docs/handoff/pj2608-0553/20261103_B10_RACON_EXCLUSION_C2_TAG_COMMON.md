# R79 — owner removes RACON B10; C2 TAG descriptions and COMMON stock

## Decision and selected financial effect

Owner excludes unquoted RACON B10 spares4.01/4.02/4.03. All three functions belong to original source B10-PTTEP-04, Qty3 × unquoted parametric850USD cost ×1.30 ×31.5 = THB104,422.50 Working SELL. Remove this allowance once; do not move it into remaining rows.

| Value | Before | Selected |
| --- | ---: | ---: |
| B10 Working THB | 509,827.50 | 405,405.00 |
| B10 unrounded USD | 16,185 | 12,870 |
| B10 Official USD, existing category ceil100 | 16,200 | 12,900 |
| Known PartB Working THB | 6,066,125.37 | 5,961,702.87 |
| Total A+B USD | 897,800 | 894,500 |

All other A/B/C quoted parent amounts, FX31.5 and commercial factor remain unchanged. C1USD181,100, C2USD13,900, B13USD1,500, B11N/A. The source assertion remains four contractual MR envelopes/14 kit sets, distinct from the selected three/11; supplier omission does not waive customer MR requirements. Customer B10 summary remark and Annex explicitly exclude RACON commissioning spares. This is owner-authorized offer scope, not purchaser-approved compliance.

Original16 current source records, all original source/module IDs, RACON Qty/rate and three function rules remain auditable. `originalCurrentByCode` retains all four B10 parents; `currentByCode.B10` selects three. Active Source/Scope/Release trace contains15 selected parent rows. Source→Working→Scope→Release and exact reverse function/parent IDs remain.

## Rounding

B10 uses existing USD100 category roundup on remaining WorkingTHB, not subtraction of already-rounded child prices. The existing whole-USD rounding kernel is applied to MR-kit units first, then the1LOT functional split, so both levels have wholeUSD units. Rounded parent totals are USD7,296 /2,736 /2,868, summing12,900. Functional1LOT unit prices use wholeUSD: MR1 1,824/1,824/1,824/1,824; MR2 912/912/912; MR3 717/717/717/717. No extra fee, added margin or category residual line. Original THB source quantities/rates remain unchanged for selected rows. Equal allocations are budget disclosure, not independently quoted OEM physical parts.

C2 and B13 keep existing wholeUSD1 units, exact Qty×Unit and unchanged category totals. C1 keeps USD100 units. No rounding policy is applied to raw source quotations or THB audit figures.

## C2 technical presentation / COMMON

One read-only technical adapter feeds the selected C2 option, Official UI, native THB/USD and Breakdown exports. Each existing C2 ID now identifies reference installed equipment TAG/sites, what is purchased, known model/part references, specification and materials:

- SCADA DC-to-PoE module, PS-DCDC-HAZ-POE-IND-01 reference; MR-502-*A.
- Cisco switch PSU PWR-IE65W-PC-DC reference; LAN-502-*.
- GAI-TRONICS Auteldac6 telephone212-02-6008-510; TPH-504-001.
- Selected Eaton sounderDB3BDG048N2BNR; LSE-504-001.
- RF coaxial surge arresters for the DMR/BDA antenna path; reference actual RF-surge TCAB-508-* locations, not all SA/Ethernet TAGs. PolyPhaser installed-package evidence is not a standalone spare quote.
- Ethernet/PoE surge protection LP-POE-INL-IND-01 reference; SCADA SA equipment, distinct from RF protection.
- COMMON fuse stock: actual parent equipment references; exact rating/size/speed/breaking capacity still require wiring/BOM.
- BDA half-inch50-ohm feeder length, CAT6A SCADA data cable length, matching Type-N male connector stock.
- COMMON M20 Ex gland spare sets: telephoneJB TCAB-504-001 references; exact cable OD/thread/Ex variant still require approval.

TAGs identify installed reference equipment, not new spare asset tags or guaranteed universal compatibility. Shared quantities are project stock, not quantity per referenced TAG. All11 selected C2 quantities and prices are unchanged. Raw twelve-row history including excluded DB-5P remains immutable. Customer wording avoids internal rate/comparator terms. B13 tag cells read COMMON, with the existing five-system/site equipment-reference schedule beneath.

## Native files / validation

Original six sheets and ten-sheet Breakdown remain. Official B10 retains existing expanded template geometry with11 populated rows and three cleared surplus rows. THB Working retains three source MR envelopes in original13-slot layout. Internal function export supports11 rows in original template or a previous expanded file, clearing old RACON rows rather than leaving prices/formulas. Re-export downloaded files after updating.

`validate-0553-b10-exclusion-c2-tag.cjs` compares the saved pre-change financial snapshot, excludes only authorized B10 delta, verifies unchanged C2/B13 financial tuples, actual MTO TAG identities,11 wholeUSD B10 lines,15-row exact reverse trace, real USD/THB/native repeat export, and erasure of stale RACON rows. Older B11/C1 and C2 DB-5P fixture checks retain raw history and account for this subsequent authorized scope/text decision; immutable fixtures are not refreshed.

No new business module, merge or customer transmission. OEM spare SKU/quantity/current rate, purchaser exclusion acceptance and engineering completeness remain unconfirmed. Existing Rev03 baseline guard limitation is unchanged; full legacy build is not claimed.

Validation completed: 46 affected command-line checks passed (45 existing modified regressions plus the new owner-exclusion/export regression), with the six outdated selected-total expectations corrected and rerun. Dedicated `npm run build:0553` passed with three existing webpack size warnings. Customer and internal native exports, stale rows, original geometry, repeated exports and whole-unit arithmetic were checked. Browser automation was not run. No source/price changes were made after the final production build; subsequent edits affect validation expectations/documentation only.
