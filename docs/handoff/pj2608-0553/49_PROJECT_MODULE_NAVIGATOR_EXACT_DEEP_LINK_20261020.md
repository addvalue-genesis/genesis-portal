# PJ2608-0553 — Project Module Navigator Exact Deep Links
Date: 2026-10-20
Branch: `fix/pj2608-0553-navigator-deep-link-module-ids-20261020`
Status: CODE + REGRESSION TEST ADDED; LOCAL `npm run build` / BROWSER ACCEPTANCE PENDING.

## Reported defect
Search `bid.budget.working.bc.b3.site` returned "ไม่พบ Module ที่ตรงกับคำค้น", although `bid.budget.working.bc.b3.site-mr-sat-matrix` exists inside 10.2/B3. Prior search registry indexed only base B/C parent/groups/rows (21) and did NOT contain nested B3 modules. Prior jump used raw `setNavTarget(m.id)` but scrolled to 10.2 parent when child was hidden by React state and nested `<details>` disclosures.

## Changes
1. `data/bcModuleNavigator0553.js` keeps 21 original parent/group/customer modules, adding nested B3 Module IDs from actual `selectB3RequirementWbsTrace0553()` and `selectB3SiteMrSatCoverage0553()` data selectors (19 Requirement IDs, 21 SAT Test IDs), source-backed 40-day budget ID, VeEX and current China FAT source lines. Registry entries carry an exact DOM anchor; no invented prices or TAG/SKU quantities.
2. `pages/PJ26080553.jsx` search accepts bare/copied project-qualified ID. Search `...b3.site` finds the SAT parent. Enter navigates to the first result; clicking a result opens that exact target. B9-owned RQM rows carry `navigationOwner=B9` while preserving the original B3 RQM source identifier.
3. `CommercialWorkspace.jsx` ensures Working view and the corresponding B3/B9 details are mounted, locates the exact `data-component-key`, opens all containing `<details>`, scrolls to the target and applies a visible focus border. Missing leaf IDs produce a visible warning instead of a silent jump to 10.2 parent. Parent B/C ID falls back to the rendered `.details` anchor when its ALL-list row is not mounted.
4. `BcCostEvidenceDetail0553.jsx` forwards requested leaf ID. `B3RequirementWbsTrace0553.jsx` reveals a cross-owner Requirement when explicitly requested. `data/moduleDeepLink0553.js` isolates the DOM-navigation helper for regression tests.
5. `validate:0553-project-module-deep-link` tests actual selector-derived index, partial/case-insensitive matching, leaf/parent IDs, React SSR and mocked nested disclosure-open behavior. Existing `validate:0553-bc-module-navigator` now separately checks the original 21 base IDs and extra B3 child IDs.
6. Working cost and releases remain untouched: B3 THB2,443,400 Current Working SELL; ZWP8 THB1,335,438.58 at planning FX; Rev02/Rev03 cost baselines, CFO Release and original XLSX are not rewritten.

## Acceptance steps — local
From `J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553-release\frontend`:
```powershell
git -C .. status --short
git -C .. fetch origin
git -C .. switch --detach origin/fix/pj2608-0553-navigator-deep-link-module-ids-20261020
npm run validate:0553-bc-module-navigator
npm run validate:0553-project-module-deep-link
npm run build
npm start
```
If status is dirty, stop before switching. Leave the webpack dev server running, note printed port (often localhost:3000 but may be different).

In the Project Module Navigator, search exactly:
`bid.budget.working.bc.b3.site-mr-sat-matrix` or partial `bid.budget.working.bc.b3.site`.
Press Enter or click the result. Expected: Budget / Working / 10.2 / B3 opened, collapsed SAT matrix expanded, screen centered on **B3 — Seven-Site / Four-MR SAT Test Coverage** with focus border.

Also test:
- `PJ2608-0553 / bid.budget.working.bc.b3.40-day-abc` → B3 Working SELL Breakdown, Offshore row
- `bid.budget.working.bc.b3.requirement-trace.rqm-19` → opens cross-owner register to RQM-19 (B1 owner) without new costs
- `bid.budget.working.bc.b3.requirement-trace.rqm-03` → B9 Yard crosswalk owning RQM-03
- `bid.budget.working.bc.b3.sat-matrix.sat-zwp20-mr0001` → opens exact SAT test row
- `bid.budget.working.bc.b3` → B3 parent working row or details
- Confirm other B/C parent links still work and 10.3 CFO / 10.5 Scope values unchanged.

Status stays DRAFT until local regression + webpack build + manual browser navigation confirmation.
