# R80 — A/B/C quoted USD unit prices up to tens

Owner03Nov2026 requests quoted prices without dollar ones, rounding upward to tens, with updated Scope of Supply and actual Excel outputs. Applies to customer USD price columns, not supplier quotation/cost records or operational day/OT-rate clauses.

## Equations and price authority

- `NewUnitUSD = 10 * ceil(PreviousQuotedUnitUSD / 10)`.
- `NewLineUSD = Qty * NewUnitUSD`.
- `ParentUSD = sum(NewLineUSD)`; `A+B = sum(A parents) + sum(B parents)`.
- C1/C2 options remain outside A+B. No separate rounding charge, extra commercial factor or downward adjustment to force an old category total.
- Use the existing quoted allocation as seed, preserving the existing USD100 summary/whole-dollar allocation history. Final returned Official policy advertises USD10; `seedIncrementUSD` records the legacy seed policy. Rebuilding with the returned policy gives the same quote.
- Raw supplier prices, Working THB costs/sell budgets, FX31.5, quantities, identities, scope and commercial factors remain unchanged. This does not establish new independent supplier/OEM prices or technical approval.

## Selected prices

| Parent | Previous USD | Quoted USD |
| --- | ---: | ---: |
| A1 | 241,100 | 241,290 |
| A2 | 137,000 | 137,130 |
| A3 | 34,200 | 34,200 |
| A4 | 292,500 | 292,500 |
| B10 | 12,900 | 12,960 |
| B13 | 1,500 | 1,530 |
| C1 optional | 181,100 | 181,100 |
| C2 optional | 13,900 | 14,340 |
| Total A+B | 894,500 | 894,910 |

Other B summary prices already end in tens and remain unchanged. B4/B11/B12 remain N/A. RACON B10 functions remain excluded. A+B increase410 = A1 190 + A2 130 + B10 60 + B13 30. Optional C2 increase440 is separate.

B10 quoted MR kit units1830/920/720; kit quantities4/3/4 give7320/2760/2880, sum12960. All11 functional1LOT units are tens and reconcile to those same parents. B13 units160/130/370 ×4/4/1 give640/520/370, sum1530. C2 units990/590/5840/2500/370/570/10/20/30/40/50 retain quantities1/1/1/1/2/2/8/30/50/4/4, sum14340. C1 units were already multiples of100 and remain unchanged.

## Data flow

- Existing Official USD builder remains the customer quoted-price authority. It creates an immutable seed, rounds priced A child unit rates and B10/B13 unit rows, rolls parents upward and exposes the shared rounded breakdown. The raw A allocation algorithm was moved into a dependency-free core adapter to avoid a circular dependency; public breakdown API/default behavior and existing business/module IDs remain.
- Public breakdown validates current source key/quantity/THB/parent identity before returning the selected rounded rows. It does not reallocate new parent totals into fractional unit prices.
- C2 unit rounding is applied in the existing canonical option owner, preserving original THB references and previous USD rows as audit metadata. Source prepared option USD, current C2 review, Official summary and Annex agree on14340. C1 is unchanged.
- USD six-sheet native and ten-sheet Breakdown consume the same returned model. Scope summary rows, parent totals, priced unit amounts and formula caches are numeric values from that model. Original template geometry/identities are retained. Exporting a filled result again is byte-idempotent.
- Working THB export remains the unmodified source-budget currency view. The selected screenshot request concerns English/USD export. No rounded USD quote is falsely posted as a new Working THB cost.

## Verification and history

Saved immutable pre-change snapshot `0553-before-tens-rounding-20261103.json`. New end-to-end regression independently compares every priced child unit to its prior price, verifies exact ceil10/Qty×Unit/parent sums, all83 priced A rows and141 source identities, N/A/Included/unknown preservation, no source mutation, repeated build (including returned policy), actual six-/ten-sheet XLSX values/formulas and repeat export.

Older protected-price fixture checks normalize only authorized price-projection fields back to their pre-tens values; immutable fixtures and raw source assertions remain. The new regression explicitly validates the new pricing policy. Historical what-if remains superseded audit arithmetic, with its comparison labelled prior to USD10 rounding.

Draft PR only; no merge or customer transmission. Re-export English/USD and Breakdown after updating. Existing Rev03 immutable-manifest guard limitation is unchanged; full legacy build chain is not claimed.

Validation completed: all20 affected command-line checks passed, including numeric six-sheet/ten-sheet XLSX extraction and repeat-export idempotence, source controls, historical fixture protection, B10/B13/C2 review, registry and existing ownership checks. Dedicated `npm run build:0553` passed with three existing webpack size warnings. Browser automation was not run.
