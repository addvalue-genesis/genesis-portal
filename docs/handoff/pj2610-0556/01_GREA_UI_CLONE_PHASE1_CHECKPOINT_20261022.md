# PJ2610-0556 — GREA UI Clone Phase 1 Checkpoint (2026-10-22)

**Branch:** `feat/pj2610-0556-grea-ui-clone-20261022`  
**Source UI Master:** PJ2608-0553-BDA @ `2880c5a8` (UI and CSS comparison reference, not 0556 data authority)  
**Working origin:** `fc6f12d2`  
**Scope:** 0556 isolated UI baseline; **NOT complete 102-component parity**.

## Implemented
- `/projects/pj2610-0556` added to GENESIS, without changing existing 0550 / 0553 routes.
- 0553-style O&G lifecycle L1–L10, L3 A/B/C and semantic 10-tab group structure.
- Self-contained copy of the inherited 0550 visual primitives CSS and renamed 0553 stylesheet selectors (`p553` -> `p556`).
- Controlled 0556 JSON containing APP–AMA draft TOR terms and outstanding evidence, with **all cost authority absent/null**.
- New project-only Module Registry and 10.1–10.7 Budget structure, filters, expandable sections, Module Copy IDs and navigation.
- Working/Budgetary/Release view switching **read-only**, customer export disabled and release approval false.
- Independent static validator `node frontend/scripts/validate-pj2610-0556-isolation.cjs`.

## Not yet completed
- The 102 local `_ui_master_reference` files are user-side **reference only**, not active UI modules; not included in this Git commit.
- Full component-by-component parity for 0553 tables, B/C detail hierarchies, vendor search, CFO, export rendering, and all 0553 drill-down interactions.
- Project-specific RF / OEM proof, physical BOM, resource planning and 60-month cost calculations.
- Browser screenshot parity, automated click test, regression build and Release Snapshot.
- Commit-level build verification in user's Windows Worktree.

## Mandatory gate
Run local `node scripts/validate-pj2610-0556-isolation.cjs` in `frontend`, then `npx webpack --mode production` and compare two UI pages side-by-side. No merge/deploy or 0553 mutation; do not promote this baseline as customer-ready.

## Evidence
TOR source: `TOR_AMA_Microwave_5Years (for Aviat).docx` in 0556 / 00_NATIVE_ORIGINAL / SHAREPOINT.
Source geometry and technical levels remain subject to approved RF propagation/Pathloss/OEM analysis.
