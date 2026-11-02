# C1 whole-unit commercial preview rounding - R74

Owner reported that R73 still displayed fractional unit rates despite category
rounding. The screenshot is correct: R73 rounded only the total, showing the
USD23.13 difference separately. R74 applies whole-USD100 unit prices within the
same USD181100 preview category. It does not select a new Official/Excel price.

| Item | Qty | Source unit USD | Rounded unit USD | Rounded amount USD | Row adjustment USD |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1.1 | 1 | 16503.84 | 16500 | 16500 | -3.84 |
| 1.2 | 1 | 9076.48 | 9100 | 9100 | 23.52 |
| 2 | 2 | 872.65 | 900 | 1800 | 54.70 |
| 3 | 1 | 15335.05 | 15300 | 15300 | -35.05 |
| 4 | 1 | 40916.20 | 40900 | 40900 | -16.20 |
| 5 | 1 | 97500 | 97500 | 97500 | 0 |
| Total | | | | 181100 | 23.13 |

`roundC1AnnexUnits0553` in the existing `c1SiTagBudget0553.js` starts with
`unit = round(sourceAmount / quantity / 100) * 100`. Amount is always
`quantity * roundedUnit`, not an independently rounded number. The target is
still derived from the original raw category SELL and once-only USD100 ceiling.
If initial rounded rows do not sum to target, adjust Qty1 rows by USD100 using
the smallest increase in absolute source-price deviation and stable row order.
An unreachable target, invalid quantity or non-USD100 target fails explicitly;
the function never alters quantity or silently inserts a mismatched line total.
All current rows already reconcile after nearest-unit rounding, so no extra
residual adjustment is needed in this actual scenario.

The eight-column primary table now has a single USD181100 total. It does not
add a second USD23.13 rounding charge. Source subtotalUSD181076.87, each raw
unit/amount, row adjustment and zero unallocated balance are retained in the
collapsed audit. Original supplier costs, THB SELL, factor1.30, FX31.5, quote
line IDs, MR/site/TAG identities and spare quantities stay untouched.

RACON item5 remains USD97500. C2 and all current selected financial/export
models remain unchanged (selected C1USD97500, C2USD23000, A+BUSD902900).
No new business module or source/quantity/price posting is introduced.

Validation: whole-unit/Qty x unit/category-sum/zero-residual audit assertions,
source nonmutation and residual/invalid-input tests pass. Existing C1 SI and
owner-supply tests pass. Protected financial fingerprints and Official/native
USD Excel assertions pass, including selected C1USD97500/C2USD23000/A+B902900.
Change-log validator passes. Dedicated production build passes with three
existing bundle warnings. No interactive browser QA; the supplied screenshot
was inspected and server-rendered main-table output is checked to exclude the
raw fractional rates and any second CATEGORY ROUNDING row.
