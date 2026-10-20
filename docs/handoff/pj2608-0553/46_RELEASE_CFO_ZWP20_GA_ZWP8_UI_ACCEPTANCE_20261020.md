# PJ2608-0553 — 10.1/10.3 Integration UI Acceptance and CFO Price Freeze
Date: 2026-10-20
Branch: `integrate/pj2608-0553-release-cfo-zwp8-bod-20261020`
Base: `feat/pj2608-0553-release-cfo-native-template-20261020` (commit `a85a151`).
Status: **CODE STATIC CHECKS COMPLETE — SERVER RENDER TEST AND BROWSER UI ACCEPTANCE PENDING LOCAL EXECUTION**.
Release class: INTERNAL WORKING ONLY; NO customer quotation approval, NO native XLSX release, NO Rev02/Rev03 re-pricing.

## Scope and acceptance contract

| Module ID | Verification when expanded in web UI | Frozen source/technical status |
|---|---|---|
| `bid.budget.bom.zwp20.tcab-500-001.9.required-bom` | GA 2026 Sheet13 10 M20 bottom vs 2022 BARTEC Type1 16 and Prosper 2024 top10; display all factory and customer-free-issue components; DTS 18 conflict | TAG Working TCAB THB 39,200; historical comparable ONLY |
| `bid.budget.bom.zwp20.bulk-material.11.required-bom` plus `.derivation` | 69m + one M20 gland only current allowance; installed active Ex gland Qty NULL; ODU 3/4 NPT, MCT, DC, RF, earth, cable/termination gaps shown with distinct owner | TAG Working Bulk THB 37,176; NOT complete physical procurement or technical approval |
| `bid.budget.bom.zwp8.mr-502-003.43.required-bom` | PTMP base ODU sourced Next G A1/A2/A4/A5, price USD 13,002.00 with THB from selected working FX; separate IDU/SA/Antenna | One booked ODU owner; A-4 PMP MAX USD 6,634.61 requires licence justification |
| `bid.budget.bom.zwp8.mr-502-004.43.required-bom` | Additional NEW ZPQ↔ZWP8 PTP radio, Next G B1/B2/B3/B5, USD 7,288.65; distinct from existing PTP and MR-502-003 | BOD Rev.C2 §7.2 mandates additional new link; OEM SKU/price verification open |
| `bid.budget.bom.zwp8.cost-ownership-audit` | Two ODU, two IDU, two antenna, two SA, ONE TCAB Row46; no duplicate surge/PoE posting | ZWP8 current THB 1,335,438.58 @ planning 31.5 THB/USD; 11/11 owner-covered |
| `bid.budget.pricing.cfo` | CFO internal-only A/B/C table, A/C cost ×1.30; B Working Sell unchanged with 5% SAMTEL deduction | A1 MR0001 working-cost origin seven locations THB 5,840,703.15; no silent extra GA/Bulk postings |
| `bid.budget.pricing.release.preview` | 6-tab native-format preview, TAG family grouping/overflow, no approved price and native export DISABLED | `approved:false`, `releaseAllowed:false`, `exportNativeAllowed:false` |

## Automation versus actual browser checks

### Automated test now added
`npm run validate:0553-release-ui-render-acceptance`:
- Executes real React 18 `renderToStaticMarkup` for four 10.1 Required BOM views, ZWP8 Cost Ownership and 10.3 CFO/Release components.
- Tests source values **as rendered markup**, not only static source-code substring assertions; verifies no change to Rev03 MR0001 ledger or 10.3 model after display.
- Guards GA 10/16/18 cable-entry distinction, factory free-issue separation, null physical gland Qty, two distinct ODU prices, BOD link status, one TCAB, A1 source mapping and Customer Release HOLD.
- **Not** a browser navigation/click/e2e test; only the user running the local app can verify actual click open/close, overflow navigation, print styling and responsive layout.
- This test must pass in the LOCAL worktree AFTER switching to this integration branch; last reported PASS of webpack predates this test.

### Human browser acceptance
1. Start dev server on this integration branch. Open `http://localhost:3000` and navigate PJ2608-0553 → 10.1 System/Location MTO.
2. Expand ZWP20 site. `TCAB-500-001.9` defaults to expanded: inspect 4 stages, 10-bottom-M20 2026 GA, 16-hole BARTEC historical, 2024 top10, 18-entry requirement; make sure GA factory parts are labeled INCLUDED and four customer-furnished items are cross-owner, not extra TCAB cost.
3. Open ZWP20 `Bulk Material.11`: inspect physical cable/gland/MCT gaps and ensure 69m and one gland remain *partial Working quantity* not certified final.
4. Expand ZWP8 site, row43 `MR-502-003` and row43 `MR-502-004` separately: check USD/THB and selected Next G codes and no combined Qty 2 on either TAG.
5. In `zwp8.cost-ownership-audit` verify BOD mandated additional PTP, retained existing link, one enclosure, two distinct radio price owners and licence A-4 review.
6. Go to 10.3 `bid.budget.pricing.cfo` and Customer Release preview: check A1 seven-site price basis, B original Working Sell and release blocked. Part A preview may exceed 15 rows: ensure OVERFLOW is surfaced, not silently omitted.
7. Verify ZWP20/8 MTO and GA screens show correct labels and Thai/English text when expanding/collapsing. Record screenshots/observed defects; do not claim UI acceptance until reviewed.

### Branch safety / regression
Check protected blob SHA:
- `mr0001TagCostLedger0553.js`: `65e3a690e8bc04a4cf6b812f0fe07703972ff483`
- `zwp20SiteCost0553.js`: `75efeff5b5b85665be5aab6088b7cf806fa8085a`
- `engineeringOwnedCost0553.js`: `f29b8d3705fd8bee0d72ddeb1349b80d9b28d760`
- `mr0001Rev03CostOverlay0553.js`: `bbb382451f24b28f0eb5e55db2ddef02d0876c2f`
- Rev03 manifest `41_APPROVED_COST_BASELINE_MANIFEST_REV03.json`: `15f48926504b2826d666fa80b62e8071f7bd368b`.
No original quotes, customer Selling Price, scope workbook or Rev02 manifest change in this integration.

## Local commands (from ...\genesis-portal-0553-release\frontend)
```powershell
git -C .. status --short
git -C .. fetch origin
git -C .. switch integrate/pj2608-0553-release-cfo-zwp8-bod-20261020
git -C .. pull --ff-only
npm run validate:0553-release-ui-render-acceptance
npm run validate:0553-zwp8-bod-mandatory-link
npm run validate:0553-scada-ga-zwp8-radio-evidence
npm run validate:0553-release-cfo
npm run build
npm start
```
If `git -C .. status --short` is nonempty, stop before switching. If currently detached and the integration branch is not a local branch, first use `git -C .. switch --track origin/integrate/pj2608-0553-release-cfo-zwp8-bod-20261020`. Do NOT reset or force switch.

## Merge recommendation
Keep PR as **DRAFT** pending new SSR acceptance PASS, full local build PASS and screenshots/manual acceptance of the 4 critical 10.1 Modules plus 10.3 Customer Preview. After that, approve PR merge into CFO Release branch. No direct automatic merge/financial release.
