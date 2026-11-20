# PJ2608-0553 — What's New / Change Summary in Budget Workspace
Date: 2026-10-21
Branch: `fix/pj2608-0553-single-release-preview-temp-working-20261021`
Status: committed to GitHub; local `npm run build`, exact UI render and navigation acceptance **not yet verified**.

## Management direction
Keep the NEW three-color workflow/navigation UI (Working / Edit, Budgetary, Release).
Do NOT revert to older 3 isolated price views.
Make visible change history so every code pull is clearly recognizable.
Maintain **Color-coded Hierarchical Nested Accordion**, Expand/Collapse controls,
FULL Module IDs, click-through source links, Copy ID, and TABLE-FIRST layout.

## Implementation
- `frontend/src/project0553/BudgetChangeSummary0553.jsx`
  Mounted just after Budget Workspace heading, before the RFQ/source gates.
  Displays current build revision, last curated update, NEW/REVIEW flag,
  nested UI/Data Flow change disclosures, and date/description/source Module ID/impact.
  Expand All, Collapse All, direct Module link and Copy ID.
- `frontend/src/project0553/data/budgetChangeLog0553.js`
  One source-controlled curated log. Every meaningful change needs an appended entry
  with ID, date, work type, user-visible description, affected Module IDs and price impact.
- `frontend/webpack.config.js`
  Embeds short Git HEAD revision into the UI at build / webpack-dev-server startup
  with `webpack.DefinePlugin`. After pulling, restart `npm start` or rebuild to
  see the new SHA. If Git not available, shows `UNAVAILABLE` rather than inventing a version.
- Browser `localStorage` at key `pj2608-0553-budget-changes-seen-v1`
  stores only `<git-short-sha>|<curated-change-log-version>` when user presses
  **Mark Reviewed**. Until reviewed, the change panel visibly shows NEW.
  A later build SHA changes the fingerprint and flags the code as new again.
- If an earlier SHA is recorded and both SHAs are valid, offer a link to the
  GitHub Compare page for actual per-commit diff. This link is separate from
  the curated summary and is a true comparison of Git revisions.

## Price and workflow governance
The Change Summary is READ ONLY and does not change:
- 10.1 equipment BOM,
- 10.2 B/C canonical Working Cost/SELL or B3 40-day selected price,
- 10.3 `buildReleaseCommercialModel0553()` and Part A/B/C policy,
- 10.3 `bid.budget.pricing.release.preview`,
- release approval HOLD, Excel export or historical/TEMP posting.

Categories are blue (UI/navigation) and amber (data/price governance).
Colors do not encode approval status.

## Maintenance contract
The Git revision **detects new code automatically** at restart after Pull,
but human-readable descriptions **must be maintained with each meaningful change**
in `budgetChangeLog0553.js`. Do not claim it automatically summarizes commits.
Update `CHANGE_LOG_VERSION_0553` for curated revisions, append new note ID and
include affected Module IDs and truthful price-impact classification.

## Validation
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553
git status
git fetch origin
git switch fix/pj2608-0553-single-release-preview-temp-working-20261021
git pull --ff-only
cd frontend
npm run validate:0553-budget-change-summary
npm run validate:0553-release-cfo
npm run validate:0553-current-commercial-integration
npm run build
npm start
```
Acceptance: new What's New visible at top; Module ID clicks; Expand/Collapse;
mark Reviewed persists in browser; new SHA after next pull revives NEW;
the same 3 workflow shortcut colors and 10.3 Release remain; B3 selected
Working SELL equals Release Preview THB 2,443,400 (until management changes
canonical source); approval HOLD remains.
