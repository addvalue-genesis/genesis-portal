# PJ2608-0553 — Controlled Release-Base BULK / Module Source Integration
**Date:** 2026-10-21  
**Integration branch:** `integrate/pj2608-0553-release-bulk-owner-module-20261021`  
**Base:** `fix/pj2608-0553-single-release-preview-temp-working-20261021`, commit `87f6c23a7a857fa2358b1a1f5947811ff60e6b4c`  
**Status:** Engineering/GUI code integration; **NOT** a released customer price, accepted BOM revision, or approved procurement.

## Rationale
The original `feat/pj2608-0553-bulk-mr-location-completeness-20261021` diverged from the updated Release Preview. Full branch merge would risk overwriting updates to B3/B8, Working/Release preview and the Budget Change Summary. This branch starts from the user's clean and fast-forwarded 0553 Release Worktree and selectively introduces the read-only MR/location BULK evidence files.

## Exact executable UI route
`frontend/src/App.jsx` → `pages/PJ26080553.jsx` (Project Navigator) → `project0553/CommercialWorkspace.jsx` (Working 10.1) → `project0553/SimpleBom0553.jsx` (`bid.budget.bom.filters` and `bid.budget.bom.system-location-mto`).

**Original canonical priced Equipment/MTO remains mounted** through `UnifiedMrLocationTable0553.jsx` (MR0002/3/4) and the original MR0001 MTO rows. The new read-only `BulkMrLocationCoverage0553.jsx` displays a *separate* vendor/field/spare reconciliation companion table. The MGW P26-058_R2 **Full Combined selected quote** is now used by `UnifiedMrLocationTable0553.jsx` for pricing and parent inclusion evidence rather than the outdated UHF-only revision.

## New source-derived Module identities
- `bid.budget.bom.system-location-mto.bulk-material` — standalone read model summary
- `bid.budget.bom.zwp20.mr0002.bulk-material`, similarly `zwp21` and `zwp22` — site MR2 BULK table
- `bid.budget.bom.zwp20.mr0002.bulk.feeder-kit` — MGW FORLLER, included system material
- `bid.budget.bom.zwp20.mr0002.bulk.addvalue-nek-field-feeder` — stable legacy item ID; NOW classified `BULK_RESERVE_CANDIDATE` (not installation purchase)
- `bid.budget.bom.zwp20.mr0002.rf-physical-routes` — donor/service routing evidence and unapproved scenario
- `bid.budget.bom.zwp20.mr0002.rf-route.rf-donor` and `...rf-service` — per-physical-function source details
- All MR0001–MR0004 applicable sites and item IDs are derived in `data/bulkModuleNavigator0553.js` directly from the same read models as the visible table. No manually copied module-ID list; input is normalized to MR + site by `SimpleBom0553`, then the group/row is expanded and focused by `BulkMrLocationCoverage0553`.

## Explicit Cost Owner
1. **MGW** — complete MR0002 system, installed FORLLER RF feeder (quoted UHF-4 100 m + six male connectors/site), and correction of vendor-installed shortages/noncompliance under agreed complete-system scope. RF routing takeoff measures MGW coverage, NOT automatic ADDVALUE material purchase.
2. **ADDVALUE** — optional NEK installation/damage/contingency BULK spare reserve only, quantity/rate/approval NULL, independent of MGW installed material. Do not count automatically as B10 commissioning spares or C2 long-term/capital spares.
3. **Technical hold** — NEK SM000111 Rev6 vs previously recorded Rev9 450 MHz attenuation conflict; Rev6 IEC60332 evidence alone does not establish IEC60331 fire resistance demanded for DMR coax. Require current manufacturer/OEM certificates and spare policy before pricing.
4. **Financial boundaries** — A5 original source THB260232 remains a non-additive source attribution, MGW included kits do not create incremental costs. No changes to B1–B14/C1–C2 ledgers, `workingBomAggregation0553.js`, `BOM_READ_MODEL_0553`, source `.json`/snapshot files, release commercial model or customer workbook.

## Data models and known remaining consolidation
- `data/bulkMrLocationCoverage0553.js` is an **engineering source/evidence projection**, NOT the canonical Working Cost or the entire existing `bid.budget.bulk.integrated-mr0001-0004` parametric model.
- `data/integratedBulkMaster0553.js` / `wpSystemBulkBudget0553.js` still contain historical scenario inputs; their outputs are **not** substituted as current MGW pricing authority and remain a separate governance/deprecation task.
- `data/mr0002WorkingBom0553.js` remains the canonical MR2 equipment working ledger using MGW Full Combined selected quote.
- There is no automatically authorized NEK quantity, procurement order, BOM source JSON write or customer sell/Release mutation from this integration.

## Verification and rollout
The new `npm run validate:0553-bulk-mr-location-coverage` validator is included before webpack in `npm run build`. The source-driven standalone smoke executed with mocked A5/SCADA/RACON projections passed 28 MR × Location groups, 17 active groups, original A5 THB260232, incremental THB0, 3 correct MGW/NEK source-owner splits, and unique navigator IDs. **Real workstation npm/webpack/browser runtime is pending.**

**Do not fast-forward the worktree to this integration branch as if it were an already validated release.** Check out this branch for testing only; preserve the release branch `87f6c23a` as a rollback reference. After passing the focused + regression build and confirming visual module navigation, promote through reviewed PR/merge.
