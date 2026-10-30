# PJ2608-0550 — Fixed commercial section order

Date: 2026-10-30. UI: `2026-10-30.5-preview`.
Repository: `addvalue-genesis/genesis-portal`.
Branch: `feat/pj2608-0550-official-working-20261028`.
Verified starting GitHub HEAD: `2494e5692c633cb682ac4f209fc3227bec46e4f6`.
URL: `http://localhost:3050/projects/pj2608-0550`.

## Problem and resulting navigation

Working mode previously omitted 10.6 and 10.7 from the DOM, while Budget and
Release omitted other modules. WP.1–8 preceded 10.1 as peers. This made the
visible numbering appear incomplete despite existing Budget/Release functionality.

Within Official Tender, the headings now remain in one fixed reading order:

| Section | Role |
|---|---|
| 10.0 | Guide and module principles |
| 10.1 | Sources, inherited basis and FX |
| 10.2 | Particulars, WP.1–WP.8, A/B/C Working and line editor |
| 10.3 | Customer scope and customer-row mapping review |
| 10.4 | Coverage and remaining gaps |
| 10.5 | One shared price/status summary |
| 10.6 | Existing Budget THB projection/export |
| 10.7 | Existing Release USD form, Full/Bid and issue controls |
| 10.8 | Existing frozen-history comparison |

Top-level modules initially show their headings with details collapsed. Working,
Budget and Release buttons open and focus the existing target, without removing
other headings. Module Search and Source links open collapsed parents, including
Working children now nested inside 10.2. Repeating a search for the same module
also reopens it after manual collapse; the local target now clears when the
parent navigation target resets.

OFF-03 and HIS-01 are data contexts, displayed with those names rather than
numeric-looking context badges. Their existing IDs and `10.O` / `10.H` registry
metadata remain intact. Budget History remains its separate historical context.
WP.P and WP.1–WP.8 keep their existing IDs/numbers inside 10.2.

## Architecture and data preservation

ADR-0550-001 principles affecting this change: **5, 8, 10, 11, 12**.

- 5/10: existing canonical models and pricing/export kernels are reused. The
  duplicate summary markup is removed; FX is rendered once inside 10.1. No
  price rows or cost owners are created by the layout.
- 8/12: existing stable IDs, Copy ID, search, Source links and Release hierarchy
  are retained. Release gains optional initial disclosure state and a child slot
  for the existing Volume II navigation card.
- 11: no workspace schema, issue state, authorization, transmittal or frozen
  history migration. Navigation changes only component/disclosure UI state.

Automatic paired JSON A/B loading and optional Volume II draft loading remain
unchanged. IDs, selections, quantities, prices, FX, margin and user decisions
remain canonical. OPEN remains unknown; package/component prices are not added
again. No 0553 project data or implementation is introduced.

## Verification

Production webpack build passes with its existing large-asset warning.

Passed model/render validators: `validate:pj0550-price-summary`,
`validate:pj0550-bidding`, `validate:pj0550-working-preview`,
`validate:pj0550-source-auto`, `validate:pj0550-si-controls`,
`validate:pj0550-release-issue`, `validate:pj0550-workspace-recovery`,
`validate:pj0550-technical-proposal`.

Isolated production-browser checks cover:

- Exact top-level 10.0–10.8 order and visible headings across navigation
  shortcuts; one summary/FX module; Particulars and all eight WP modules inside
  10.2; repeated Module Search; desktop/mobile containment.
- Existing Release prices/OPEN explanations, MR hierarchy, keyboard toggles,
  package-to-Working navigation, stable Copy ID, Source navigation and persisted
  per-system expansion after reload.
- Architecture/Guide links to A, Supplier, Release and Source, and unchanged
  IndexedDB after navigation/reload.
- Separate existing Part A/B/C copy and Full/Bid browser modes.

The SI browser assertion previously expected 10 controls. The verified starting
HEAD already has 11, including A readiness. The assertion now requires 11 and
explicitly verifies the existing A readiness row; no runtime gate was added or
removed for this UI change.

Browser checks use isolated synthetic state, not the user's Windows browser.
The user's supplied Windows npm log confirms successful compilation on port
3050 before this change; the exact running Windows SHA and private DATA state
have not been independently read. Apply this commit there before expecting the
new layout. This update does not move ports or browser data.

Software PASS is not engineering approval, source-reading completeness, pricing
approval or customer issue. Actual source/SI/commercial gaps remain OPEN and
Release remains HOLD / NOT ISSUED under the existing evidence controls.
