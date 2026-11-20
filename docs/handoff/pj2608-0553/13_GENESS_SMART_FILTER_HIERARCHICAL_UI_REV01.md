# PJ2608-0553 — GENESS Smart Filter & Hierarchical Data Grid UI Refactor Rev01

Date: 2026-10-13
Branch: feat/pj2608-0553-tpp-bid-handoff
Objective: Reuse established UI patterns across existing 0553 tabs, rather than replace engineering/data models or create an alternate BOM.

## Fixed behaviour contract
1. One universal pattern: Search → Faceted Filter → Group → Expand/Collapse → Drill-down → Reference.
2. Every user-addressable module has a canonical project-scoped Copy ID. Optional Copy Name copies its displayed human-readable group/module name; canonical Copy ID remains `PJ2608-0553 / <existing module key>`.
3. Preserve existing root/module keys and canonical TAG / Quotation IDs. New nested IDs are additive and never rewrite source IDs.
4. Filters are locally controlled; Reset restores clear defaults; a Group header retains module copy controls while collapsed.
5. Data provenance, original currency/unit/source, pricing flags, engineering decisions and A/B/C remain owned by existing data and ledger. Shared UI never calculates a unit price, quantity, FX or compliance.
6. Default group display collapses crowded views and opens selected/search groups for discovery without hiding source records.
7. No semantic AI search claim. Current controls are exact field/value filtering + case-insensitive multi-field substring matching and grouping.

## Common code
- frontend/src/common/ui/SmartDataExplorer.jsx
  - `SmartFilterBar`: declarative controlled filters with optional counts/reset/copyable module
  - `SmartDataGroup`: native keyboard-accessible details with +/− and visible Copy ID / Copy Name
  - `moduleSegment`: deterministic URL/id-safe child segment only; does not replace source primary keys.
- frontend/src/common/ui/ComponentCopyId.jsx
  - added optional `componentName`, original Copy ID format untouched.
- frontend/src/project0553/project0553.css
  - scoped readability/spacing for new common controls; global 0550 styling unchanged.

## Applied now
- 04 Documents particular matrix: faceted Site/Document/Evidence/Keyword filter, source grouped by document, per-rule Copy ID and Copy Name, original 91 requirement records + qualification/conflict information untouched.
- 07 Vendor / Supplier Products: filter by company/quotation/product/MR/evidence; grouped rows for all matching original Supplier/Quotation/Datasheet/Historical records; full EXION & Next G commercial conditions retained; Copy ID for quotation, group and individual evidence.
- 10 Budgetary / BOM: reuse faceted system/site/vendor filters and module search, preserve 7-site collapsible location/tag drilldowns and original price ledgers, add Copy ID and Copy Name for module results, sites and TAGs.

## Rollout to further modules
After user verifies view and local build on 04/07/10, adopt the shared pattern in existing 05 Engineering, 08 Risk/Compliance and 09 Registry where it adds clarity, without a broad blind JSX rewrite. Other tabs retain working views until evidence-driven expansion is needed.

## Regression
`cd frontend && npm run validate:0553-smart-ui && npm run build`.
Full webpack build must be run locally and captured before claiming runtime validation; this GitHub connector action does not run code on ADDVALUE-I7.

## Preservation
New changes are UI-only. `documentParticularRequirements0553.json`, `vendorUnifiedCatalog0553.js`, `mr0001TagCostLedger0553.js`, A/B/C rates, approved decisions, user supplied source documents and compiled exports are not modified by this UI refactor.
