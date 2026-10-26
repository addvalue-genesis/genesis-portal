# PJ2608-0553 — B10 compact commercial display and Source → Release → Source
Date: 25-Oct-2026  
Repository: addvalue-genesis/genesis-portal  
Branch: fix/pj2608-0553-urgent-thailand-cif-pricing-20261024  
Starting remote head (verified identical): 400b07ef90592bac5c929b629d5d3554c006ff29

## Problem from screenshots
The B10 tab in the 10.3.3 Release customer format was overloaded by:
- a new extra 16-row NextG quote-SKU evidence table,
- a redundant 4-row MR financial-kit annex,
- internal quoted-cost/Price-to-Win technical modules and Rev08 evidence accordions,
- 29 installed TAG references in a single kit cell,
- layout with CSS min-width 1240/1440px causing the document to extend beyond a browser viewport.

Customer Budgetary and Release should present a **clean B10 Kit price summary / reconciliation**. The full itemized SKU evidence and What-if remain available upstream in 10.2 Working, but are not themselves issued/sale-authorized physical purchase rows.

## UI decisions implemented
- Added a shared, minimal `B10KitPriceSummary0553.jsx` for all financial presentation stages:
  - 10.3.2 Budgetary: 4 MR kits, THB 509,827.50. The original template table and historical metadata controls are hidden **when B10 sheet is selected**; other sheets are unchanged.
  - 10.5 Scope: B10 compact financial summary instead of entire engineering detail/module collection. Source/Release navigation retained.
  - 10.3.3 Release: B10 compact financial summary replaces duplicated internal SKU tables, technical modules and long native-like 13-row grid. 4 MR rows 4/3/4/3 only. No internal module keys displayed in customer text.
  - 10.3.4 Official: B10 is a compact USD 4-row summary using the *existing* Official DTO, with USD 16,200 unchanged. No module or internal source data exported.
- Rows preserve exact `B10-PTTEP-01..04` source identities, quantities, amounts and source location mapping. In 10.3.3, each row has the same `data-component-key="bid.budget.pricing.release.preview.annex.b10.<sourceId>"` as before, so clicking from Working continues to highlight/open the target. Internally, `↗ 10.2 Source` passes the original `sourceRowModuleId`, ensuring **Source → Release → Source** navigation. The financial/Reverse trace model `auditAnnexBidirectionalTrace0553` remains unchanged.
- The four B10 price owner amounts, complete B/C financial ledger and calculated currency are NOT modified.
- Source technical evidence `B10ItemizedPurchasingEvidence0553`, `B10PriceToWinScenario0553` and historical SKU audits remain in 10.2 Working; their files/models are not deleted.
- Native 6-sheet XLSX engine/template and 13-row annex limitations are unchanged, since this turn fixes the browser presentation and does not pretend new approved SKU/Qty rates exist.
- Responsive table CSS: max-width 100%, no forced 1240/1440px on *displayed* B10 commercial table, internal horizontal scrolling on very narrow mobile screens, with no document-wide overflow.

## Price/ownership invariants
- B10 Working selected SELL = THB 509,827.50.
- Four source financial entries B10-PTTEP-01..04 with site counts 4,3,4,3.
- 10.3.4 Official B10 subtotal = USD 16,200, same original parent-rounding and annex allocation.
- Existing `Known B` = THB 4,994,787.13.
- Source/Working/Scope/Release/Official quantity/price link unchanged. No NextG expired source price posted as accepted spares. C1/C2 and A/B no-double-count protection retained.

## Relevant changed files
- `frontend/src/project0553/B10KitPriceSummary0553.jsx`
- `frontend/src/project0553/ReleaseCustomerWorkbook0553.jsx`
- `frontend/src/project0553/BudgetaryWorkbookPreview0553.jsx`
- `frontend/src/project0553/ScopeBcAnnexDetail0553.jsx`
- `frontend/src/project0553/ScopeSheetsDetail0553.jsx`
- `frontend/src/project0553/OfficialUsdRelease0553.jsx`
- `frontend/src/project0553/CommercialWorkspace.jsx`
- `frontend/src/project0553/releaseWorkbook0553.css`
- `frontend/scripts/validate-0553-b10-release-sku-preview.cjs` (changed to commercial-only bidirectional regression)
- Updated existing spare-owner, itemized-evidence and price-to-win validators to assert evidence stays upstream.
- `frontend/src/project0553/data/budgetChangeLog0553.js` updated.

## QA / remaining
Source was updated directly through connected GitHub and verified via remote ref. JS unit/webpack/browser tests are **not yet executed**, so do not claim a passing build. Run from correct frontend directory:

```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553-bda\frontend
git fetch origin
git pull --ff-only origin fix/pj2608-0553-urgent-thailand-cif-pricing-20261024
npm run validate:0553-b10-release-sku-preview
npm run validate:0553-existing-spare-owners-2026
npm run validate:0553-b10-itemized-purchase-evidence
npm run validate:0553-b10-price-to-win-review
npm run validate:0553-official-usd-release
npm run build
```

The example path may differ from the owner's worktree; run in the checked-out branch's actual path. Verify all three browser pricing stages and screen widths 1366px/700px/390px, plus detailed 10.2 B10, source-click round-trip, and native Excel totals.

If the owner later approves a *physical itemized* B10 release, it is a separate source-owner repricing task requiring approved actual Qty, SKU, unit price and Annex continuation; never inject the expired supplier evidence as Official quantities.
