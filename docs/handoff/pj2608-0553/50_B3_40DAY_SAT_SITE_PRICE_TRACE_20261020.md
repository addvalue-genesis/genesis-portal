# PJ2608-0553 — 10.2 B3 40-Day SAT Matrix: People × Days × Rate × Site Working SELL
Date: 2026-10-20
Branch: `feat/pj2608-0553-b3-sat-matrix-price-trace-20261020`
Status: Code committed / local regression and browser acceptance still required. Price release HOLD.

## Reported UI problem
`bid.budget.working.bc.b3.site-mr-sat-matrix` displayed 21 Test IDs before any crew/day/rate/price context. A user could not see how many people, how many days, whether price belongs to each MR or the Site, or the relationship between the 40-day budget and the 19 Site/MR + 2 SIT/Punch test IDs.

## Canonical arithmetic, not a reprice
- `b3FortyDayWorkingSell0553.js` remains the authority for *working sell*, not verified direct cost.
- One **two-person team**: Senior Telecom Systems Integration Engineer + Senior RF/Telecom Field Specialist.
- **40 team workdays × 2 people = 80 person-days / MD**. USD800 per person-day × planning 31.5 = THB25,200 per person-day, THB50,400 per two-person team-day.
- 9 site/integrated timeboxes total THB2,016,000 offshore *labour*:
  - ZPQ K15 3 team-days = 6 MD = THB151,200 (shared MR0001–0003)
  - ZWP8 K15 2 team-days = 4 MD = THB100,800 (MR0001)
  - ZWP11 K15 2 team-days = 4 MD = THB100,800 (MR0001)
  - ZWP20 K16 8 team-days = 16 MD = THB403,200 (shared MR0001–0004)
  - ZWP21 K16 7 team-days = 14 MD = THB352,800 (shared MR0001–0004)
  - ZWP22 K16 7 team-days = 14 MD = THB352,800 (shared MR0001–0004)
  - ZWP23 K16 5 team-days = 10 MD = THB252,000 (shared MR0001 and 0003)
  - Cross-site SIT K17 4 team-days = 8 MD = THB201,600
  - Offshore Punch/Retest K18 2 team-days = 4 MD = THB100,800
- VeEX MX100+ rental **THB30,000** = 30 rental-days × THB1,000. Not allocated to nine Site rows and not added per MR.
- MGW China FAT witnesses/travel **THB397,400** is a different B3 scope owner/timebox, not the 40 offshore team-days.
- Canonical B3 Working SELL **THB2,443,400** = offshore labour THB2,016,000 + VeEX THB30,000 + FAT THB397,400. Direct COST remains NULL.

## Module provenance and no duplicate pricing
`bid.budget.working.bc.b3.40-day-abc` is the budget basis. `b3SiteMrSatCoverage0553.js` reads the nine source day/timebox rows and maps all 21 Test IDs to exactly one Site/SIT/Punch timebox. It never assigns `workingSellTHB` to individual test IDs (remains null). New `priceProof` and `budgetTimeboxId` fields are read-only display trace.

`BcCostEvidenceDetail0553` passes canonical `workingRow` into `B3SiteMrSatCoverage0553.jsx` for full B3 subtotal proof. The matrix now shows:
1. Crew, team days, man-days, USD per person-day, planning FX, THB per two-person team-day
2. Site × Team Days × MD × Price, with explicitly shared Test-ID groups
3. Reconciliation to VeEX, MGW FAT and B3 total
4. Technical Test-ID details with `SHARED SITE PRICE — NO EXTRA MR TEST PRICE`, instruments, documents and acceptance gates.

Source `b3FortyDayWorkingSell0553.js`, B/C canonical `bcTurnkeyWorkingCost0553.js`, Price/CFO and Rev02/Rev03 pinned costs remain untouched.

## QA
From `J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553-release\frontend` after ensuring the working tree is clean:
```powershell
git -C .. fetch origin
git -C .. switch --detach origin/feat/pj2608-0553-b3-sat-matrix-price-trace-20261020
npm run validate:0553-b3-site-mr-sat
npm run validate:0553-b3-sat-matrix-price-trace
npm run validate:0553-b3-breakdown-module-ids
npm run build
npm start
```
In the Project Module Navigator search `bid.budget.working.bc.b3.site-mr-sat-matrix`, press Enter, inspect at top. The new first two tables MUST appear above Test IDs; confirm ZWP20 = **2 persons, 8 team workdays, 16 MD, THB403,200 shared across four MR tests**, not four times THB403,200. The total B3 must remain THB2,443,400 and show `Direct Cost NOT ESTABLISHED`. Do not promote this source price to released Customer XLSX until evidence/approval.
