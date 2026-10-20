# PJ2608-0553 — Handoff 57 / MGW Rev.2 Cover Projection, Navigation and CI Gate
Date: 20-Oct-2026; status: **DRAFT / integration QA; no customer price release**.
Base: `feat/pj2608-0553-mgw-road-freight-packing-evidence-20261020`, PR #13 head `3bafa8e38af3f719eb723607f0a164e48a07e548`.
Working candidate: `feat/pj2608-0553-mgw-r2-cover-projection-nav-regression-20261020`. Do not merge until mandatory CI, manual UI acceptance, and separate engineering/commercial approval.

## Confirmed source and immutable pricing rules
- MGW P26-058_R2 detailed six equipment lines (21-Sep): MR0002 USD99,564; MR0003 USD25,600; MR0004 USD225,177; equipment USD350,341.
- Latest supplier 20-Oct cover: vendor services USD18,500; TOTAL USD368,841 (+USD4,000 from original detailed USD364,841).
- Packing SERV-3 USD500 versus supplier WhatsApp that freight SERV-5 USD2,500 includes packing: possible overlap, **no proved credit**. Do not deduct USD500 or book another USD2,500.
- Cover DAP Nantong vs trucking to JUTAL Zhuhai and earlier EXW Nantong unresolved.
- 2-day supplier iFAT and min 5-day end-user FAT premises must reconcile with ADDVALUE B3 six paid witness days, NOT added automatically to B3 SELL.
- Keep Rev02/Rev03 approved cost baseline untouched; 10.2 B3 Working SELL THB2,443,400 unchanged; Customer Release HOLD; B10/B11/C2 SPIR remains pending.
- New read-only JSON: `docs/audit/pj2608-0553/2026-10-20-mgw-r2-cost-impact-reconciliation.json`.

## Code changes / Module mapping
- **10.1 / `bid.budget.bom.mr0002`**: `MR0002_WORKING_BOM_0553` now takes quote-wide informational overall/services from current `MGW_R2_COVER_20261020_0553`. Its price-posting USD99,564 and non-additive included OEM children remain unchanged; prior detailed quote amounts still separately visible in metadata.
- **10.1 → 10.5 / `bid.budget.scope`**: `SITE_SYSTEM_COST_RECONCILIATION_0553` returns 20-Oct selected supplier overall USD368,841 and shared services USD18,500, explicitly non-posted; `bomReadModel0553` → `selectWorkingBomProjection0553` continues using only selected site equipment and qualified bulk, not the quote-wide services.
- **10.2 / `bid.budget.working.bc.b5.mgw-road-freight-packing-inclusion`**, **`bid.budget.working.bc.b6.mgw-road-freight-packing-inclusion`**, **`bid.budget.working.bc.b10.mgw-commissioning-spares`**, **`bid.budget.working.bc.b11.mgw-special-tools`**, **`bid.budget.working.bc.c2.mgw-two-year-operation-spares`**: registered nested searchable exact Module IDs derived from commercial cover, WhatsApp, Paul email read-only records in `buildBcModuleNavigator0553()`; actual UI anchor consumed by `CommercialWorkspace` via `findModuleElement0553/openModuleAncestors0553`.
- **10.2 / `bid.budget.working.bc.b3.site-mr-sat-matrix`**: restored explicit site-allocated "NOT per MR" copy to match cost anti-double-count presentation assertion; no change to labour/timeboxes/rates/SELL.
- **10.3 / `bid.budget.pricing.release`**: `buildReleaseCommercialModel0553()` unchanged, Customer Release remains HOLD.
- Regression scripts strengthened: `validate-0553-mgw-r2-selected-mr234.cjs`, `validate-0553-bom-runtime-reconciliation.cjs`, `validate-0553-mgw-r2-cover-20261020.cjs`, `validate-0553-module-navigator-bc.cjs`, `validate-0553-project-module-deep-link.cjs`.

## Validation required
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553-release\frontend
git -C .. status --short
git -C .. fetch origin
# STOP if uncommitted work; only then:
git -C .. switch --detach origin/feat/pj2608-0553-mgw-r2-cover-projection-nav-regression-20261020
npm run validate:0553-mgw-r2-selected-mr234
npm run validate:0553-mgw-r2-cover-20261020
npm run validate:0553-bom-runtime-reconciliation
npm run validate:0553-module-navigator-bc
npm run validate:0553-project-module-deep-link
npm run build
npm start
```
The parent branch GitHub Actions build #39436913617 failed at `validate:0553-b3-sat-matrix-price-trace` because the rendered UI omitted the literal phrase "NOT per MR". This branch fixes the UI evidence phrase without weakening its assertion; verify full CI and actual browser before declaring PASS.
