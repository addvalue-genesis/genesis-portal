# PJ2608-0550 — selected working version 0550-20261027.1

Base: `2a0ebef8c0dd3d2286a7a36e696d91c76d5c65b6`. Selected source branch: `fix/pj2608-0550-canonical-workspace-20261027`. This is a local working application update, not a customer issue, merge, ERP migration or hosted deployment.

## One entry point

Stop the older development server, open this branch, then double-click `START-0550.cmd` (Windows). Other platforms: run `npm ci --no-audit --no-fund` in `frontend`, then `npm run start:0550`. The launcher opens `/projects/pj2608-0550` on localhost port 3001 and fails if that port is occupied rather than silently choosing a different storage origin. Confirm the visible version badge. The Windows launcher itself has not been executed on Windows in this environment.

Back up the old browser Working workspace before switching source or origins. IndexedDB remains at the same database name and schema, with optional validated policy/category/basis fields. Existing backups load. A previous application version cannot read the new optional fields; keep a pre-update backup for rollback. No user-device browser data has been migrated remotely.

## UX changes

Retain the existing three work areas but label them by function (original RFQ, engineering/pricing, communication/submission) to avoid collision with commercial Parts A/B/C. Keep ten B tabs, number Schematic 05, link to the single RFQ register instead of embedding it twice, and link execution to the single equation workbench. History stays under its existing explicit panel.

Rename the active USD stage to **USD Review**. It is a live projection of Working, not a frozen approved issue. Stable module IDs and existing table accessibility names remain compatible. Area C explicitly states that forwarded Gmail correspondence is not yet synchronized; it does not invent a communication register or submission status.

## Private equipment policy

Use the existing canonical `deriveBidWorkspace` selector. Goods use the same selected quantity × unit cost as the base for three independent allocations: prime, ADDVALUE fee and ADDVALUE reserve. Service equations E10–E13 remain unchanged. No second pricing engine or JSX price arithmetic is introduced.

Project percentages are private workspace inputs, with decision source and date. Importing a policy file stages the values for inspection; pressing the apply button saves only the policy with an audit revision, preserving all existing vendor/offer/line data. The policy is included in workspace backup. Do not commit private policy JSON, quotes or forwarded emails to this public repository.

Part A defaults to equipment. For goods in another WBS, explicitly select Equipment / goods. Each equipment row must specify ACTUAL or ESTIMATE for the one selected cost source; changing basis does not add a second cost. Until policy and basis are supplied, equipment totals stay OPEN. Old per-line direct/markup/margin/prime fields are preserved but ignored for equipment; they still govern services. Updating costs or policy refreshes Working/Budget/USD Review; issued historical prices remain immutable.

Each cost/allocation is rounded to THB cents; customer line amount is their sum, so the displayed breakdown reconciles. E17 converts that customer amount to USD. Review XLSX uses the same selected amounts and excludes internal allocations and vendor costs. No new approved-price freeze mechanism is claimed.

## Validation

`npm run build` passes the protected snapshot, controlled data, 19-system/PAGA coverage, evidence, bidding equations/policy and production build. Synthetic tests cover noncompounding allocation, actual replacing estimate, service parity, backup roundtrip, missing/invalid policy, foreign-project policy rejection, existing ownership/FX/source controls and immutable Rev10. Existing webpack bundle-size warnings remain.

Cloud-browser inspection verified the new version badge, all three work areas, ten tabs, policy controls, goods/service selector and cost-basis selector. Full automated browser regression could not launch Chromium because the environment denied its socket operation. Policy upload end-to-end testing was interrupted and is not claimed PASS. Date entry via cloud automation remained blank and was correctly rejected; file import validation passes in the model tests. Windows launch, user-device migration and full end-to-end browser regression remain to verify.
