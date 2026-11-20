# PJ2608-0553 — B5 Historical Price Recovery / Why 10.2 B5 Showed No Price
Date: 2026-10-15
Branch: `fix/pj2608-0553-scope-mgw-r2-integrated-20261015`
Status: **HISTORICAL PRICE RECOVERED / CURRENT DIRECT COST AND CURRENT WORKING SELL NOT ESTABLISHED**.

## Root cause
The Rev05 WBS data `frontend/src/project0553/data/partBCWorkingWbs0553.js` has B5 `sellTHB:null`, `qty:null`, owner `SAMTEL/OEM`. Accordingly the previous `bcB5EquationExecution0553.js` deliberately returned OPEN_INPUT in the absence of an approved Master Packing List, crate count, current pack quote and OEM included cost credit. The UI was not hiding a calculated 10.2 price: it had **never linked earlier legacy internal B5 priced records**.

## Recovered historical source
- Original 4-Scope: https://docs.google.com/spreadsheets/d/1KSfxvPfgS8XcvwaQUeacmgdX32yobwVk/edit shows B5 original customer PRICE **USD11,081.864661654135**.
- `PJ2608-0553_INTERNAL_Pricing_Rev09_20260908.xlsx`: https://docs.google.com/spreadsheets/d/1kmnY9WAiWeM-IIanARPfrzd4UNigv_QO/edit. At historical FX 31.5, original B5 customer SELL **THB349,078.7368421053**.
- Historical Rev09 exact line decomposition (input labelled as source-based direct/estimator costs, NOT verified current direct costs):
| Source line | Source qty/rate THB | Historical input proxy THB | Historical SELL THB | Correct scope classification |
|---|---|---:|---:|---|
| RC-PACK (MDS/BOQ row45, RACON sea packing) | 3 × THB62,118 | 186,354 | 235,394.53 | B5, supplier reference still requires quotation confirmation, avoid duplicating OEM included packing |
| B5-BUD (other export packing/marking) | 4 × THB15,000/system lot | 60,000 | 75,789.47 | B5, ESTIMATOR allowance not physical crate MTO |
| B7-BUD (90 day storage allowance) | 3 × THB10,000/month | 30,000 | 37,894.74 | **B7 storage cost previously allocated into historical B5**; should not be counted twice |
| TOTAL original historical B5 | | **276,354** | **349,078.74** | Historical reference only |
| Packing-only older source after removing B7 storage | | **246,354** | **311,184.00** | Historic packing-only comparator; not an approved current B5 price |

Historical spreadsheet formula is `P_legacy = source input × 1.20 / 0.95` (reproduces source). This is **not** adopted as new 10.2 Cost/SELL formula or current margin policy. The older MDS quote itself may be stale and other allowances are estimates.

## Changes made, without overwriting source baselines
- New `frontend/src/project0553/data/bcB5HistoricalPriceBridge0553.js`: read-only historical price bridge for 3 Rev09 priced source rows, arithmetic source reconciliation, scope split B5 packing vs B7 storage.
- `frontend/src/project0553/data/bcB5EquationExecution0553.js`: attaches `historicalPriceBridge` to existing source GEQ-based B5 adapter; current `DirectCost/SELL = null`.
- `frontend/src/project0553/B5EquationAudit0553.jsx`: shows historical original B5 **THB349,078.74** and packing-only **THB311,184.00**, with line-level Rev09 rates/source status and embedded B7 storage.
- `frontend/src/project0553/CommercialWorkspace.jsx`: adds selected B5 price reference at top of 10.2, labelled `HISTORICAL Rev09`, not Current Working SELL.
- `frontend/scripts/validate-0553-b5-equation-execution.cjs`: checks price splits, historical source lines, B5 current null and UI visibility. Already in `npm run build`.
- **No changes** to `partBCWorkingWbs0553.js` Rev05 B5 null, project protected Part A price manifest, B1/B2/B3 SELL, known Part B working sell subtotal **THB3,804,160**, B7 prices or customer released output.
- All B5 6 physical packing cost driver requirements remain OPEN_INPUT: no actual crate qty, vendor quote, post-Bangkok FAT repack volume or OEM included credit.

## Correct forward budget work
Use old numeric historical price as a **benchmark and source rate candidate**, not automatically as a new cost:
1. Validate RC-PACK three RACON packs × THB62,118 MDS/BOQ rate vs current vendor Rev and Part A packing included terms. Deduct duplicates.
2. Update four-system export packing allocation to new execution route **OEM → SAMTEL Bangkok FAT → China JUTAL yard**, quantify reusable vs new crates, physical packing materials and ISPM-15/IPPC marks; do not assume one crate per system or per site.
3. Reassign B7 storage allowance to B7 subject to inclusion/actual three-month need; do not add old 37,894.74 twice.
4. Separate B2 packing-list/document control, B5 physical packaging, B6 freight/customs/repack transport, B13 preservation **replacement** consumables (not desiccant consumed in B5 package).
5. Once source-backed package Qty/rate and package-inclusion credits are gathered, compute **B5 Budgetary Working Scenario** in 02 with existing GEQ, show 10.2; independently approve current Direct Cost and commercial SELL before release.

## User pull and validation
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal
git pull --ff-only origin fix/pj2608-0553-scope-mgw-r2-integrated-20261015
cd frontend
npm run validate:0553-b5-equation-execution
npm run validate:0553-bc-working-cost-lines
npm run build
npm start
```
**Full local npm build not run by assistant** via GitHub connector; only static and arithmetic checks here.
