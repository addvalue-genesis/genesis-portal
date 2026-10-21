# PJ2608-0553 — 10.3 One Canonical Release Preview / TEMP Legacy Views
Date: 2026-10-21
Branch: `fix/pj2608-0553-single-release-preview-temp-working-20261021`
Status: CODE COMMITTED / GITHUB READ-BACK; local npm validators, Webpack and browser visual acceptance still required.

## Management request
- Updating a selected **upstream** price owner (10.1 equipment BOM or 10.2 B/C canonical Working SELL) must be reflected in 10.3 `bid.budget.pricing.release.preview` on subsequent render. Never re-key a second price in a view.
- Show one main 10.3 release-facing view. Historical/budgetary/duplicate Working previews which do not feed the selected price go under collapsed `TEMP`, not deleted.
- Keep the 10.1 Engineering BOM, 10.2 B/C workbench, 10.4 mapping and 10.5 Scope visible and usable independent of previous 10.3 mode buttons.
- Keep RELEASE HOLD, and do not silently turn a new B3 lean SAT scenario into the selected B3 price.

## Verified code source chain
```text
10.1 selectWorkingBomProjection0553() ----- A equipment BOM
                                            |
10.2 selectBcTurnkeyWorkingCost0553() ------ B1–B14 selected SELL / C1–C2 conditional
                                            |
10.3 buildReleaseCommercialModel0553() ----- ONE live customer-commercial read model
                                            |
bid.budget.pricing.release.preview -------- ReleaseCustomerWorkbook0553
```

`releaseCommercialModel0553.js` Part B uses `priceBWorkingSell0553`:
customer SELL = selected canonical 10.2 Working SELL, without an additional B markup; internal SAMTEL 5% deduction is separate. Part A uses working equipment cost and price-factor 1.30. Part C requires verified Direct Cost before a customer sell price exists. These policies are **unchanged**.

## UI change
- Remove the three confusing on-screen choices `10.3.1 Working / 10.3.2 Budgetary / 10.3.3 Release`; show one `10.3 — Single Customer Release Preview`.
- Visible read-only `bid.budget.pricing.release.source-trace` compares selected B3 Working SELL with customer-preview B3.
- Always mount and preserve `bid.budget.bom`, `bid.budget.working.bc`, `bid.budget.mapping`, `bid.budget.scope`, and their deep-link IDs.
- Move old Rev08 Working reference under `bid.budget.pricing.working`, old Budgetary workbook/snapshot under `bid.budget.pricing.budgetary`, and previous duplicate Customer Proposal Preview under `bid.budget.summary`, all inside collapsed `bid.budget.pricing.temp` section. TEMP content is audit/reference only and cannot post current price.
- Keep original 10.3 identifier registry entries for old link compatibility, but mark old modes TEMP; registry default now resolves to Release.

## Important limits
- A code/source revision appears in the one live preview after application reload/re-render; there is no independent saved mutable Budgetary price ledger and no frozen issued snapshot.
- 28+2 Lean SAT is a **nonposting option** on its own feature branch. This change does not merge or approve it and does not modify canonical B3 40-day source price. Expected current B3 in source is THB 2,443,400 unless selected upstream code is explicitly repriced/approved.
- No revision to 10.1/10.2 quantities, rates, working sell source or 10.3 commercial rate formula, 10.5 Scope source, native Excel template, or release approval logic.
- Customer Release remains HOLD, including direct cost and approval gates.
- Branch is based on `fix/pj2608-0553-b3-internal-ic-and-audit-separation-20261021`. This is not a direct fast-forward of the separate 28+2 scenario branch: reconcile before merge.

## Regression checks
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553
git status
git fetch origin
# Ensure clean worktree before switch:
git switch --track -c fix/pj2608-0553-single-release-preview-temp-working-20261021 origin/fix/pj2608-0553-single-release-preview-temp-working-20261021
cd frontend
npm run validate:0553-release-cfo
npm run validate:0553-current-commercial-integration
npm run validate:0553-project-module-deep-link
npm run validate:0553-working-fx-default
npm run build
npm start
```
Manual acceptance:
1. 10.1/10.2 detail still navigable.
2. Only one 10.3 Release Preview appears and B3 reads canonical selected `THB 2,443,400`.
3. `bid.budget.pricing.temp` starts collapsed; contains old 10.3.1/10.3.2/legacy proposal for audit.
4. `10.5 Scope` always accessible. `10.3 Release` still shows approval HOLD and C options not included in Base.
5. Explicitly changing the **selected** upstream price in a controlled development branch changes the preview via same `buildReleaseCommercialModel0553`, without editing the preview's prices directly. Revert after verification.

Do not describe all tests as passing until user local execution output is verified.


## 2026-10-21 UI follow-up — restore three original navigation groups
User requested that the three original visible groups must NOT disappear. Preserve three
**color-coded navigation shortcuts**, while retaining **one canonical commercial source**:
1. `10.3.1 · Working / Edit` (blue): navigate straight to live `10.2 bid.budget.working.bc` for review / approved source work.
2. `10.3.2 · Budgetary` (amber): expand `bid.budget.pricing.temp` then the **historical** budgetary/audit view. Still NO verified frozen budgetary snapshot.
3. `10.3.3 · Release` (green): navigate to the ONE live `bid.budget.pricing.release.preview`, still HOLD.
These are navigator buttons, **not** three independent price/cost models.

Added `ReleaseSourceNavigator0553.jsx` in 10.3 Internal view: table-first
Part A, Part B, Part C native nested accordion; category color distinguishes
Engineering (blue), Testing B3 (green), Logistics (orange), Spares/Options (purple),
Tools (teal), etc. Expand All / Collapse All, full Module ID and Copy ID are
available. Clicking a colored source Module ID opens exact 10.1/10.2 module
when mounted, otherwise opens and flags its parent; reverse 10.2 → 10.3
jump is also visible. In Internal Customer Excel, Module IDs now link in
one click; Trace detail is still available as an alternative.

NO sell/cost/markup change, NO B3 28+2 promotion, NO release approval.
New static regression assertions are in `validate-0553-release-cfo.cjs`.
Remote commit verified, but local Node validators/Webpack/visual QA must still run.
