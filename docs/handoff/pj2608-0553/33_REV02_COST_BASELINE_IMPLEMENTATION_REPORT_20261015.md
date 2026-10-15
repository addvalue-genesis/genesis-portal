# PJ2608-0553 — Rev02 Internal Budgetary Cost Baseline / Implementation

**Date:** 2026-10-15  
**Authority:** User conditionally approved ZWP8 cost-owner allocation and ZWP11 existing-enclosure reuse on the basis of the project's stages 1–8 and verified source/reconciliation principles.  
**Revision status:** **CONDITIONALLY APPROVED / FULL LOCAL BUILD AND NEW 7-SITE RUNTIME PENDING.**  
**Customer release status:** **BLOCKED**. This is NOT a final OEM selection/technical approval or a complete Turnkey A+B+C cost/sell.

## Change-control implementation

- Retained immutable **Rev01**: `20_APPROVED_ARCHITECTURE_BASELINE_MANIFEST_REV01.json`, Git blob `7b7516b446c4a4b9545e406b63177145eb664247`.
- Created separate **Rev02**: `32_APPROVED_COST_BASELINE_MANIFEST_REV02.json`, pinned by the baseline validator.
- Rev02 freezes current:
  - MR0001 TAG Cost Ledger `65e3a690e8bc04a4cf6b812f0fe07703972ff483` (ZWP8 unique radio/IDU/sector/antenna owner and ZWP11 enclosure reuse decision).
  - Engineering-Owned Cost `f29b8d3705fd8bee0d72ddeb1349b80d9b28d760` (unchanged from Rev01).
  - ZWP20 Site Cost `75efeff5b5b85665be5aab6088b7cf806fa8085a` (manager-approved Weidmüller `IE-PS-RJ45-FH-BK` THB1,176.68 + Phoenix THB1,900 = DATO THB3,076.68; no new cost posting).
- `validate-0553-approved-baseline.cjs` checks original Rev01 manifest immutability, pinned Rev02 manifest immutability and protected SHA for each source, including negative tamper checks. The old Rev01 SHA was not overwritten.
- `validate-0553-rev02-cost-reconciliation.cjs` now checks all 7 MR0001 Location TAG rows/ownership, native-currency rollup @ **planning FX 31.5 THB/USD**, 55/55 working allocations, ZWP20/ZWP8 controls, ZWP11 original MTO quantity 1 versus new enclosure purchase 0 only, and A5 reclassification non-additive.
- `frontend/package.json` executes the new seven-location gate **before** the protected baseline gate, while DATO/ZWP8/A5 independent validators remain active.

## User-reported local runtime evidence

The user ran and reported:
- `npm run validate:0553-dato-selected-cost`: **PASS** — ZWP20 THB921,425.22, selected Phoenix THB1,900 and Weidmüller THB1,176.68.
- `npm run validate:0553-zwp8-cost-ownership`: **PASS** — ZWP8 USD28,174.05 + THB499,906 = THB1,387,388.58, 11/11 working TAGs cost allocated, surge and IDU owners separated.
- `npm run validate:0553-a5-bulk-attribution`: **PASS** — A5 THB260,232 included in A1 across seven MTO bulk lots, no duplicate posting.

**New Rev02 seven-location regression, new Rev02 SHA gate and full Webpack Build have not yet been executed on the user's local checkout.** Static GitHub code/manifest comparison does not substitute for that local runtime result.

## Cost-basis contract

The currently controlled `MR0001 7 Location working baseline THB 6,100,453.15` is a cost-ledger projection at planning FX **not** RFQ completeness, accepted OEM configuration or customer pricing. A5 is a non-additive disclosure. If the new runtime check disagrees, stop and investigate actual native USD/THB ledger rows; do **not** change expected totals or prices simply to make the test pass.

ZWP11 modification, Ex integrity, cable/termination, FAT/SAT interfaces, licensing, NMS and long-term spares are still cost/engineering gaps. Rev02 does not convert unknown site work into zero cost. **Do not add Part B Rev05 Working SELL THB3,804,160 to Part A working COST.** Current B/C turnkey direct cost is still incomplete under 10.2.

## Required final local acceptance

```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal
git pull --ff-only origin fix/pj2608-0553-scope-mgw-r2-integrated-20261015
cd frontend
npm run validate:0553-rev02-cost-reconciliation
npm run validate:0553-approved-baseline
npm run build
```

Do not label **fully validated / build PASS** until these commands succeed in the local environment. The Build will also run DATO, ZWP8, A5 and the existing project validators. Preserve both manifests and the source evidence after successful validation. Any further protected ledger modification requires a new reviewed Rev03 change, not automatic SHA replacement.

**Next phase, after the gates pass:** derive evidence-backed Part B/C direct costs and risk/working-sell separately from the full RFQ, WBS and selected vendor rate sources. Report each customer A/B/C source and gap, not a fabricated grand total.
