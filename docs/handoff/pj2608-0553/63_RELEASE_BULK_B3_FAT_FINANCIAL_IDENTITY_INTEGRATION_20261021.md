# PJ2608-0553 — Integrate MGW China FAT purchased services into Release+BULK baseline (21-Oct-2026)

## SOURCE CODE IMPACT AUDIT / READ-BEFORE-WRITE
**Base commit**: `cb2a0c919dbac032cfd3c97006177995bb2cd0db` from
`integrate/pj2608-0553-release-bulk-owner-module-20261021`.
New integration branch: `integrate/pj2608-0553-mgw-fat-financial-identity-20261021`.
MGW FAT pricing policy/source came from Draft PR #29:
`feat/pj2608-0553-b3-mgw-purchased-fat-sell-20261021`.
All source files transplanted from PR #29 for B3 price math were verified to have
the same pre-PR blob SHA as the Release+BULK integration base; no overwriting
Release/BULK code under `CommercialWorkspace.jsx`, `ReleaseCustomerWorkbook0553.jsx`,
`SimpleBom0553.jsx`, `UnifiedMrLocationTable0553.jsx`, or BULK sources.
Existing Release/Commercial integration regression was retained and updated selectively.

## FINANCIAL AUTHORITY
China MGW FAT management-selected. MGW P26-058_R2 20-Oct Cover:
- SERV-2 — OEM Integration/Internal iFAT USD5,000;
- SERV-4 — FAT Facility end-user USD2,500;
- Combined VQ supplier USD7,500 × THB31.50 = THB236,250 **QUOTED**, not paid invoice.
- ADDVALUE internal Working SELL markup on vendor service quote base:
  SAMTEL 20% THB47,250 + ADDVALUE 5% THB11,812.50 +
  Omission 5% THB11,812.50 = additional selected Purchased-Service
  **WS-B3 THB307,125**.
- ADDVALUE original FAT staff/travel Working SELL THB397,400 unchanged and NOT
  marked up again. B3.1 FAT subtotal THB704,525. B3 SAT/SIT 40 team-day labour
  THB2,016,000, rental tools THB30,000. **B3 total THB2,750,525**.
- Base Part B total **THB4,151,836.82**; other B and C owner sums unchanged.
- In 10.3 price to SAMTEL, purchased MGW source has 20% SAMTEL share of
  quoted cost already in price. Normal Part B SAMTEL 5% applies only to
  the original B3 working amount THB2,443,400: THB122,170;
  purchased SAMTEL share is THB47,250. Total B3 SAMTEL allocation
  THB169,420; ADDVALUE expected cash receipt after shares THB2,581,105
  **before vendor/personnel costs** — NOT profit or approved customer Release.

## Financial identity and UI design
Contract B1–B14 and C1/C2 line codes and *technical Module IDs* are immutable.
No creating a separate sell/pricing ledger or new contract numbering.
All **16 B/C owner detail views** render one shared read-only
`BcFinancialIdentityMatrix0553.jsx` at `{owner.moduleId}.financial-identity`,
searchable via existing Project Navigator:
- `SOW-B3` contract / scope identity,
- `VQ-MGW-SERV-2` and `VQ-MGW-SERV-4` quoted supplier source cost,
- `IC-FAT-MGW-SERV-2-4` source cost activity, paid Direct Cost NULL,
- `WS-B3` selected Working SELL,
- `CP-B3` reserved, not issued,
- `SC-B3-FAT` and `AU-B3-FAT` scenario/audit NONPOSTING.
For non-B3 owners, the shared matrix shows only confirmed identities and their
source Working SELL. Missing actual IC/VQ stays NOT ESTABLISHED; no false zero or
invented vendor purchase. Original `SOW-B3` and technical Module IDs unchanged.
`10.3 ReleaseSourceNavigator0553.jsx` displays finance IDs in its existing
Module table and B3 purchased/samtel breakdown; still reads selected 10.2.
`10.5 ScopeSheetsDetail0553.jsx` displays finance IDs next to each B/C row
using `scopePartBcReadModel0553.js` derived from the exact same 10.2 selector.
`CommercialWorkspace.jsx` retains single 10.3 Release Preview, restored
three-color navigation, historical TEMP archive, What's New and read-only HOLD;
its Jump resolves B/C owner from exact nested financial Module ID where needed.

## Source→Screen impact
1. `mgwP26058R2Cover20261020.js` (unchanged VQ source).
2. `b3MgwPurchasedFatWorkingSell0553.js` (new source-backed Working SELL selector).
3. `bcTurnkeyWorkingCost0553.js` (one selected B3 canonical addition).
4. `b3HierarchicalPriceTable0553.js` + `B3WorkTypeAccordion0553.jsx`
   (B3.1.1 supplier cost USD/THB + markup THB, B3.1.2 ADDVALUE witness).
5. `BcCostEvidenceDetail0553.jsx` + `BcFinancialIdentityMatrix0553.jsx`
   (SOW/VQ/IC/WS/CP identity, all 16).
6. `releaseCommercialModel0553.js` + `ReleaseSourceNavigator0553.jsx`
   (10.3 shares/preview; no extra Posting).
7. `scopePartBcReadModel0553.js` + `ScopeSheetsDetail0553.jsx`
   (10.5 source trace only).
8. `budgetChangeLog0553.js` R02 records real price impact.
9. `bcModuleNavigator0553.js` registers 16 new presentation anchors.
10. `BULK`, `SimpleBom`, MGW Full Rev2 selected equipment and source native
    workbook remain untouched.

## Open cost/procurement gates
- Part A equipment/source service quote reconciliation to ensure SERV-2/4 not
  priced again as A equipment/service. MGW Cover total still USD368,841.
- Verify paid invoice/actual Direct Cost, vendor FX, ITP witness days, facility
  availability, venue and travel; source quote is not a paid cost.
- B8 China FAT seven-day scenario remains NONPOSTING pending contractual
  Yangon's training requirements/ITP approval. Historical Rev05 FAT remains audit.
- No approval to automatically export, issue or release customer price.

## Validation procedure — NOT CLAIMED PASS UNTIL RUN
```powershell
cd "J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553"
git fetch origin
# Check git status -sb and switch to a CLEAN worktree/branch before pulling
git switch -c integrate/pj2608-0553-mgw-fat-financial-identity-20261021 --track origin/integrate/pj2608-0553-mgw-fat-financial-identity-20261021
cd frontend
npm run validate:0553-b3-mgw-purchased-fat-working-sell
npm run validate:0553-bc-financial-identity-presentation
npm run validate:0553-project-module-deep-link
npm run validate:0553-current-commercial-integration
npm run validate:0553-release-cfo
npm run validate:0553-budget-change-summary
npm run validate:0553-bulk-mr-location-coverage
npm run build
npm start
```
Confirm 10.2 / B3.1 price/source, B3.2 SAT and B3.3 VeEX, 16 owner
financial identity matrices, 10.3 release source navigator, 10.5 Scope,
Navigator Jump, What's New R02, and Release HOLD on real browser.
Do not merge before CI/local build and management review.


## 2026-10-21 Local build blocker / targeted non-pricing fixes
- User local Node v24.21.0 `npm run build` failed at
  `frontend/scripts/validate-0553-b9-china-budget.cjs` with
  `ReferenceError: makeInternalCostLineId0553 is not defined`
  in `evalmachine.<anonymous>`. Cause: this validator strips `import`
  before `vm.runInNewContext`; the existing
  `b9ChinaWorkingBudget0553.js` now depends on
  `makeInternalCostLineId0553` from `workingCostCommercialIdentity0553.js`.
- Corrected **both** VM-based validation scripts:
  `validate-0553-b9-china-budget.cjs` and
  `validate-0553-fat-cost-owner-contract.cjs`, by including
  `workingCostCommercialIdentity0553.js` BEFORE
  `b9ChinaWorkingBudget0553.js` in concatenated VM sources.
  Added assertions `IC-FAT-STAFF-001` and `IC-YARD-STAFF-001`.
  No source financial amount, B3/B9 model, scope ID or customer price changed.
- Local `npm start` failed `EADDRINUSE :::3000`: an unrelated already-listening
  process owns port 3000. This is not a pricing/build defect. Check the PID
  with `Get-NetTCPConnection -LocalPort 3000 -State Listen`, inspect
  `Get-CimInstance Win32_Process -Filter "ProcessId = <PID>"`, reuse
  the current instance or run `npm start -- --port 3001`.
  Do not kill all `node.exe` processes or claim that the original server
  is running current branch.
- Remote code read-back confirms imports and source order; user must still
  execute `npm run validate:0553-b9-china-budget`,
  `npm run validate:0553-fat-cost-owner-contract` and `npm run build`
  on a clean, updated worktree. No unobserved PASS claims.
