# PJ2608-0553 — Non-destructive lifecycle refactor checkpoint (2026-10-10)

## Immutable project boundary
- Project: PJ2608-0553, JUTAL ZM169, MR-0001..MR-0004 only.
- PJ2608-0550 remains unchanged. Shared styling/UI is reused, not factual data.
- Master lifecycle is L1..L10; current activity is L3 Tendering & Bidding.
- L1/L2/L4..L10 are presently labels/placeholders, NOT completed workflows.

## Existing workbench preservation map (old ID -> new display position)
- overview -> L3/01 Executive & Project Governance. Existing ExecutiveView untouched.
- engineering -> L3/02 First Principles & Methodology. Existing EngineeringView, MR0001RFProofPilot, MR0002LNACalculation, MR0002PhysicalBom untouched. The label does not prove methodological coverage complete.
- architecture -> L3/03 System & Process Architecture. Existing ArchitectureView untouched.
- systems -> L3/04 MR Systems & Document Intelligence. Existing SystemsView + DocumentReferenceControl untouched.
- schematic -> L3/05.3 Schematic & System Drawings (legacy standalone workbench retained until safely nested under L3/05). Existing ScadaSchematic0553 untouched.
- execution -> L3/06 Execution & Resource Planning. Existing execution display untouched.
- documents -> L3/07 Vendor & Technical Evidence. Existing source/vendor/evidence tables untouched.
- risk -> L3/08 Risk, Assumptions & Change. Existing bid gates untouched.
- registry -> L3/09 Data, Code & Traceability. Existing DataCodeRegistry0553 untouched.
- budget -> L3/10 Budget & Commercial Analysis. Existing CommercialWorkspace0553 untouched.

## Migration guardrails
1. Never delete, overwrite, recalculate or silently reinterpret MTO, BOM, quotation, calculation, pricing or original source data as part of navigation refactor.
2. Keep old route keys and project-specific imports while introducing stage/position metadata.
3. Rehome components under new parent only in future isolated changes, with a before/after inventory and tests.
4. Changing a menu label is not evidence that a module satisfies its new Definition of Done.
5. Do not merge/deploy or release priced output without explicit review and approval.
6. Verify git diff, build and screens: 4 MR systems, schematic, evidence and budget. Record baseline compare and restore previous commit if regressions.

## New files/updated files in this initial phase
- frontend/src/project0553/lifecycleNavigation.js (new)
- frontend/src/pages/PJ26080553.jsx (stage switcher + L3 menu mapping)
- This checkpoint document (new)

## Pending phases
- Inventory all existing 0553 workbenches, file/data hashes and dependencies.
- Add actual module 05 wrapper and relocate schematic visually, while keeping underlying source imports.
- Fill modules 01-08's contracts and lifecycle scope matrix with verified evidence.
- Build automated regression checks and budget readiness gate, only after coverage is proven.

## Status
GitHub commit successful; local npm build and runtime validation still required.
