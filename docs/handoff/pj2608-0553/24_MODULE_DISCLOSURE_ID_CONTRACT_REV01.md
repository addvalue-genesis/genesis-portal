# PJ2608-0553 — Controlled Module Disclosure & Identity Contract Rev01
Date: 2026-10-13
Status: IMPLEMENTED FOR 10 BUDGETARY WORKING PREVIEW / TAG MAPPING PATH; OTHER WORKBENCHES REQUIRE A SEPARATE INVENTORY
Working branch: `feat/pj2608-0553-tpp-bid-handoff`

## Architectural decision (user requirement)
Every actionable engineering/UI MODULE must be independently referable while COLLAPSED, with a stable human-copyable `PJ2608-0553 / <module-key>` ID, a meaningful title, +/- disclosure affordance, and complete source-backed detail. A user must be able to communicate precisely with the SI/Software Architecture team by copying a visible ID. Hiding an ID only inside an expanded panel is a regression.

Mandatory invariants:
1. One canonical module ID per logical module. Hierarchical identity: project -> workspace -> system/MR -> site -> TAG + MTO source row -> function/derivation/requirements/quotation/proof.
2. Preserve existing externally referenced IDs (e.g. `bid.budget.bom.zwp20.mr-502-001.4`, `.derivation`, `.mapping-audit`, `.particular-evidence`, `.equation.map-01`). Any new child module gets a suffix; no silent rename.
3. Every module section has a collapse/expand control AND an always-visible Copy ID in its header, even when collapsed. Child components retain source, revision, assumption, proof, owner and status.
4. Every table must be readable on ordinary desktops: content MUST NOT be clipped to the right by a nested table. Give wide tables their own `overflow-x:auto` viewport, constrain nested row/cell width, wrap long equations/IDs, and preserve access to all original columns. Never hide/destroy source fields merely to shrink the UI.
5. No UI refactor may change selected vendor, quantity, original currency, cost-owner mapping, A/B/C ledger, compliance, or customer-release gate. Preserve `null` vendor rate versus managerial assumptions and do not duplicate quote/cost ownership.
6. Regression is mandatory: Babel JSX compilation + module-ID contract test + existing source/ledger cost tests + user-local Webpack build + interactive screen review (collapse/expand, Copy ID, scroll, readable columns, source details).
7. Do not state runtime PASS until local build and browser inspection have actually happened. Tests or source snapshots cannot by themselves prove browser behavior.

## Implemented Working Preview scope
- Reusable UI component: `frontend/src/project0553/ControlledModuleSection0553.jsx`.
- TAG view: `LocationBomDetail0553.jsx`: `<site>.<tag>.<mto-row>.derivation`, `.function-breakdown`, `.particular-evidence`, `.particular-evidence.direct-site`, `.particular-evidence.common`, `.particular-evidence.conflicts`, `.recovered-engineering`, `.vendor-alternatives`, `.scada-bulk`; field/function rows retain Copy IDs.
- MAP audit view: `TagMappingAudit0553.jsx`: `...mapping-audit`, `.stages`, `.equations`, `.vendor-quote-lines`, `.technical-constraints`, `.cost-owner-reconciliation`. Each quote line/equation/technical constraint has a child Copy ID.
- Parent Working Preview: `SimpleBom0553.jsx`: traceable `Cost Allocation`, `Vendor Rate Evidence`, `Unallocated Scenarios`, `RPT Link Budget` per WP; source layout, parametric bulk routes, radio RF/DC/alarm bulk, WP system bulk, RACON bulk, RFI RF feeder and B4/B5/C2 lifecycle sections have independent IDs.
- Scoped CSS: `frontend/src/project0553/project0553.css`.
- Regression guard: `frontend/scripts/validate-0553-nested-module-contract.cjs` wired into `npm run build`, beside the existing 0553 Mapping, Location, Shared Renderer and Approved Baseline validators.

## Verification & boundary
GitHub code changes committed. Static source and module tag-balance inspections were performed; browser responsiveness and local npm/Webpack remain PENDING until checked in user checkout. The 07 Vendor register and 10 Budget Ledger remain separate source-of-truth surfaces, not new duplicated data.
Other 0553 screens (Executive 01, Engineering 02, Architecture 03, MR 04, Schematic 05, Execution 06, Vendor 07, Risk 08, Registry 09 and other Budget 10 subsections) have NOT all been exhaustively audited for this UI invariant. Apply the same reusable component through isolated inventory-and-review changes; do not declare project-wide coverage based on this focused fix.

## Required handoff routine
Before editing: identify the module key, caller/callee, renderer, evidence source, existing UI/scroll behaviors and acceptance fixtures. During editing: protect keys and source-ledger separation. After editing: update current machine state and handoff, run validator/build, compare before/after screens, record exact commit and PASS/FAIL. No unrelated changes to protected 0550 or customer release.
