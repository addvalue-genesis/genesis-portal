# PJ2608-0553 — B13 equipment references remain internal

Owner decision, 3 November 2026: remove the confusing supplementary equipment-TAG table from customer outputs, retain its source mapping in code for internal use.

The five groups/62 exact installed-source keys remain derived in `selectB13TagPresentation0553`. Working displays them in a collapsed INTERNAL ONLY panel with print exclusion. The shared Annex defaults to customer visibility and requires explicit `internal` opt-in; a Source callback never grants visibility. Customer Scope, Release and Official views show only the three COMMON priced consumable rows.

USD/THB native exports and the ten-sheet Breakdown no longer write this reference block. Re-export clears old reference cells and removes only the previously added C:D / F:I reference-area merges. Original total merges, formulas, source quantities and workbook geometry remain.

No financial change: B13 quantities4/4/1; rawTHB46683; quoted unitsUSD160/130/370 and amounts640/520/370 total1530. C2USD14340, C1USD181100, A+BUSD894910 remain. USD10 rounding is retained. No new module, physical stock, source cost, supplier quote or customer issue.

Validation passed: B13 reference/source/SSR/customer-isolation tests; actual USD/THB/Breakdown values and reference omission; removal from a simulated previously filled workbook; native Working export; Official USD export; A/B/C tens rollup; budget change registry; dedicated build:0553. Build has three existing webpack size warnings. Browser QA and the full legacy validation chain were not run.
