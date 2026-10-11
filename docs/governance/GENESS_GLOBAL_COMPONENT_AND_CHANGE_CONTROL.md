# GENESS — Common Governance / Identity Contract

Scope: generic implementation in `frontend/src/common/governance/componentRegistry.js`. It contains **no project data** and does not mount itself in other projects.

## Naming
- Stable internal tab identity: `<PROJECT_ID>:<STAGE>-<AREA>:<ROUTE_KEY>` (for example `PJ2608-0553:L3-B:budget`).
- Display location: `L3-B-10` (position code; it may change on navigation re-order; do not use as the immutable database key).
- Subcomponent aliases for 0553: `L3-B-10.01` Budget Shortcut, `10.02` Simple BOM, `10.03` Bulk Take-off, `10.04` Scope/Commercial.
- Original client MR/DTS/MTO references remain independent of GENESS aliases.
- Workflow definitions for PJ2608-0553 remain in `frontend/src/project0553/workflowRegistry0553.js`, NOT global project facts.

## Change history and status
Git commits provide immutable technical history. `makeChangeRecord` defines a shared record contract, but this is **not yet** a persistent database, audit log, automatic git-log importer, or approval workflow. Use project checkpoint/handoff documents for decisions until persistence is introduced.

## Isolation
Only PJ2608-0553 currently imports the shared registry through `lifecycleNavigation.js`. Other projects, including PJ2608-0550, have not been migrated. Regression-build both project routes before any future shared UI changes.

## 2026-10-11 — Initial common layer
- Common identity factory and change-record validation added.
- All ten 0553 L3.B tab labels now show an internal position code.
- No routes, MR facts, BOM, cost, or vendor quotation values changed.
- Next: verify build, add explicit nested component registration and decision/change persistence after review.
