# PJ2608-0553 — A5 Scope of Supply Bulk Cost Attribution Rev01
Date: 2026-10-13. Branch: feat/pj2608-0553-tpp-bid-handoff.
Module ID: `PJ2608-0553 / bid.budget.scope.a5`.

## Problem and source-based correction
`ScopeSheetsDetail0553.jsx` previously displayed A5 `1 LS (unpriced scope)` because it looked only for newly additive field-bulk rows in `deriveWpSystemBulkBudget0553`. But all seven SCADA MTO `Bulk Material` source items already have working-priced cost rows in the authoritative MR0001 Tag Ledger and had been included inside A1. Treating mirrored SCADA CAT6A as additional would double count.

The correction is **attribution only**, not a new cost estimate, not customer sell pricing and NOT a modification to the frozen cost ledger.
Source documents: `PJ2608-0553_MTO_MR0001-0004_SUBMIT_Rev04_20261006-Update.xlsx` SCADA Radio sheet; historical INNOVA `QA24-0604` CAT6A THB 524/m and M20 gland THB 1,020 each; approved budgetary scenario 60m physical assumed run plus 15% procurement factor per recorded site; other interfaces remain unsized.

## Read-only equation
For each site s with *one unique source MTO Bulk Material row*, one source cost ledger owner and independent priced components:

```
purchase_CAT6A_m(s) = ceil(60m × (1 + 15%)) = 69m
CAT6A_budget_THB(s) = 69 × 524 = 36,156
M20_budget_THB(s) = 1 × 1,020 = 1,020
MTO_Bulk_2_of_many_priced_THB(s) = 37,176
A5_booked_cost_reclassified_THB = Σ7 site's source booked Bulk MTO rows = 260,232
A1_new_display_THB = A1_original_source_ledger_THB - 260,232
A1_new_display_THB + A5_display_THB = A1_original_source_ledger_THB (difference ≤ 0.01)
```

| Site | MTO snapshot index (not necessarily native Excel row) | Bulk source 1 Lot budget THB |
|---|---:|---:|
| ZWP20 | 11 | 37,176 |
| ZWP21 | 20 | 37,176 |
| ZWP22 | 29 | 37,176 |
| ZWP23 | 36 | 37,176 |
| ZPQ | 41 | 37,176 |
| ZWP8 | 47 | 37,176 |
| ZWP11 | 52 | 37,176 |
| **A5 partial priced working cost** | 7 lots | **260,232** |

Brownfield sites ZPQ/ZWP8/ZWP11 represent a **replacement-equivalent management budget scenario**, not approved physical new purchase. Assumed 69m is not dimensioned by drawing. `A5` as a customer worksheet still has 1 LS; 7 source bulk lots are its working engineering derivation, not seven customer LS.

## Source-to-data shape variation
ZWP20 Row11 stores priced children using `quantity/rateTHB` fields; other per-site working ledgers generally store `qty/unitPrice`. Only the **read-only A5 adapter** normalizes these two shapes and independently reconciles each child; it never rewrites original records. Any missing/duplicate TAG, mismatched currency/quantity, extra priced children, or mismatch between sum(children) and source Ledger row => `COST_OWNER_RECONCILIATION_FAILED`, with no A5 amount rather than invented price.

## Inclusion / double-count boundary
- A5 260,232 THB is **already contained in A1's original MR0001 source cost ledger**; the new A1/A5 presentation split is *not* an additional project cost.
- The independent `scadaBudgetEnvelope0553.js` is a separate sensitivity scenario and may contain incremental bulk projections not demonstrably unique to source MTO owners; do **not** sum its incremental Base back into A1/A5 without proof.
- Separate `wpSystemBulkBudget0553` projections `SCADA-CAT6A` mirror the booked MTO row; ZWP20 DATO Weidmüller plug is owned by DATO Row8 and cannot be counted again in A5.
- MGW phone included JB/sounder/accessories must not be duplicated as separately supplied without proof. RF/DTRS SMA/coax, RACON field BFOU/control cable, Ex phone external cables/glands, earthing, additional certified entries and SCADA other functions remain unpriced/scope review.
- A5 `priceComplete=false`, `customerUnitPriceApproved=false`, `ledgerMutation=false`. Vendor-source historic rates require current quote refresh for firm bid.
- In 10 Budgetary, displayed scope table shows A5 Working Priced Floor and a collapsible evidence/proof drill-down and unresolved list. The original MR0001 Cost Ledger and AGERP/Dolibarr/SQL remain untouched.

## Regression and evidence gates
`frontend/scripts/validate-0553-a5-bulk-attribution.cjs` is a runtime JS/Babel test that executes real controlled sources and asserts seven-source join, each child qty×rate, total 260232, original ledger immutable, A1+A5 reconciliation, and deliberately tampered/duplicate source-row failure.
It is part of `frontend/package.json` Production Build chain.
**GitHub static review is not local runtime PASS.** Run:
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal
git switch feat/pj2608-0553-tpp-bid-handoff
git pull --ff-only origin feat/pj2608-0553-tpp-bid-handoff
cd frontend
npm run validate:0553-a5-bulk-attribution
npm run validate:0553-approved-baseline
npm run build
npm start -- --port 3001
```
If any assertion fails, do not adjust ledger or source rates just to force a PASS; correct the mapping/provenance or flag the source gap.
