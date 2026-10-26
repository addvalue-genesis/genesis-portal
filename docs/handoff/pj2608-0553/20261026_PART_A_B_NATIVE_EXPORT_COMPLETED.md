# PJ2608-0553 — Part A/B native Excel completion, R64

The owner supplied `4-Scope of Supply Rev00.xlsx` with `xxx` in A8, no A prices, only B10/B11/B13 priced in Part B, and no G38 subtotal. Its five spare annexes and conditional Part C prices were present. This was a partial derivative, not the complete output verified from the application's current embedded-template export. No assertion is made about which earlier process produced it.

Reusing the actual attachment exposed two compatibility failures in the existing exporter: prefixed SpreadsheetML (`x:worksheet`) was not recognized, and valid annex multiplication/SUM formulas were rejected. The exporter now canonicalizes the SpreadsheetML namespace, preserves supported original formulas and verifies their refreshed values against the existing canonical Release data. Unknown formulas still fail explicitly rather than being overwritten.

Both Working THB and Official USD now verify the completed summary before returning a download: four A groups, fourteen B rows, quantities, unit and extended prices, descriptions and A+B subtotal. Working also writes B identifiers and numeric quantities, fills missing headings and removes stale unused A rows. This check concerns export completeness; it does not invent prices for unpriced items or approve a firm commercial release.

The same 10.3.4 exporter is available without a browser:

```powershell
npm run export:0553-official-usd -- --output="C:\Temp\0553-Scope-USD.xlsx"
npm run export:0553-official-usd -- --template="C:\Temp\4-Scope of Supply Rev00.xlsx" --output="C:\Temp\0553-Scope-USD.xlsx"
```

The output must differ from the source path. The default uses the embedded original native template. The supplied partial file was repaired using the second route. Customer binary files are not committed.

| Scope | USD |
| --- | ---: |
| A1 / MR0001 | 241,100 |
| A2 / MR0002 | 137,000 |
| A3 / MR0003 | 34,200 |
| A4 / MR0004 | 292,500 |
| Part A | 704,800 |
| Priced Part B | 159,100 |
| A+B priced subtotal | 863,900 |
| Separate C1 conditional option | 97,500 |
| Separate C2 conditional option | 23,000 |

B4/B12/B14 remain “To be quoted” and excluded. C1/C2 remain conditional and excluded from A+B. Original source/trace data, price authorities and CIF commercial qualification remain unchanged. No merge or firm issue approval is implied.

Validation evidence:

- The final `npm run build` ran all 148 registered validators successfully and production webpack passed with three bundle-size/performance warnings. These include runtime and static checks, not 148 browser tests. Official USD and native Working runtime validators also passed separately.
- Regression cases reject missing A/B cells, missing/wrong G38, reordered/missing owners and Part C added to base. Prefixed namespace fixtures preserve multiplication/SUM formulas and reject unsupported formulas. A stale A12 equipment row is cleared and E7 recalculates to four MR lots.
- Actual Chromium export test downloaded both THB and USD files without a chooser or page errors. Downloaded USD A/B rows are compared to the visible Release; independent readback confirms four A and fourteen B rows and correct THB/USD totals.
- The actual supplied six-sheet workbook was repaired and independently read back: original merges, columns, page settings, row counts and every original formula preserved; all annex Qty × Unit/Total and Summary amounts reconcile. Artifact Tool rendered A/B/C summary regions and all five annexes. A disposable B11 Qty change recalculated the line and SUM correctly (verified to cents); the delivered file was not changed by that test. Desktop Excel itself was not run.

Prior OEM/stock/CIF qualification gates in the R63 handoff still apply.
