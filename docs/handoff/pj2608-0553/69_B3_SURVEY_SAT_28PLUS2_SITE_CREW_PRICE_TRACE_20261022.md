# PJ2608-0553 B3 — Readable Survey and Offshore SAT Execution Plan
Date: 2026-10-22 · Working integration: `integrate/pj2608-0553-bda-bulk-tag-rebased-20261022`

## Why the existing screen was misleading
- `bid.budget.working.bc.b3.site-mr-sat-matrix` displayed **40 team-days = 80 MD** as if current execution. This remains the **current financial Working SELL basis** only, not latest planned field days.
- `bid.budget.working.bc.b3.40-day-abc` displayed SAT pricing and omitted **Site Survey** physical visit/effort and nonposting price build.
- Latest lean execution evidence is `b3LeanSatScenario0553.js`: 28 productive two-person team-days + pooled 2 risk team-days = **30 team-days / 60 MD**. Two additional management-reserve team-days are NONPOSTING and not included automatically.
- The existing site survey source `b3SiteSurveyScope0553.js` recognizes seven required locations but **no actual approved work crew/day rate or separate physical survey price**.

## Field execution planning (ordered for explanation; NOT a booked calendar)
| Order | Location/Event | SAT productive team-days | Crew | Person-days | Systems |
|---|---|---:|---:|---:|---|
| 1 | ZPQ | 2 | 2 | 4 | NMS, PLC, PABX; MR1,2,3 host |
| 2 | ZWP8 | 2 | 2 | 4 | SCADA/WiMAX and interfaces |
| 3 | ZWP11 | 2 | 2 | 4 | SCADA/WiMAX and alarms |
| 4 | ZWP21 | 5 | 2 | 10 | MR1–MR4 |
| 5 | ZWP23 | 3 | 2 | 6 | MR1/MR3; no new BDA or RACON |
| 6 | ZWP22 | 5 | 2 | 10 | MR1–MR4 |
| 7 | ZWP20 | 5 | 2 | 10 | MR1–MR4 |
| 8 | SIT cross-site | 3 | 2 | 6 | E2E integration and recovery |
| 9 | Punch/retest | 1 | 2 | 2 | final as-left tests and sign-off |
| | Productive subtotal | **28** | 2 | **56** | 21 source Test IDs, no duplicate per-MR prices |
| | Pooled risk | **2** | 2 | **4** | not automatically allocated per site |
| | Execution planning | **30** | 2 | **60** | **excludes SAT MOB/DEMOB** |

Additional two management reserve team-days = four MD, nonposting and not automatic scheduled work.

## Proposed Site Survey, independent from SAT
- **Two Senior telecom/RF specialists**, one physical survey team-day/site at ZPQ, ZWP8, ZWP11, ZWP21, ZWP23, ZWP22 and ZWP20 = seven on-site team-days / 14 MD.
- Separate MOB/DEMOB labour assumption: two team-days / four MD. **Survey total = 9 team-days / 18 MD**, assuming a separate survey trip. Actual itinerary, marine transfer, POB, access, duration and even requirement for a new physical visit **require evidence and approval**.
- Survey deliverables: installed TAG/LIS/GA cross-check, RF/cable route and physical cable-end inspection, Ex, power/earthing and access checks, photos, punch list and SAT readiness records; B2 only formal VDRL/document control.
- *Labour Working SELL rate reference*, borrowed from the currently selected SAT Selling Rate (NOT payroll Direct Cost): USD 800/person-day × internal planning FX 31.50 = THB 25,200 per person-day; 2 persons = THB 50,400/team-day.
- Indicative survey field labour SELL = 7 × 50,400 = **THB 352,800**; survey travel-day labour SELL = 2 × 50,400 = **THB 100,800**; illustrative Survey labour SELL **THB 453,600**, **NOT POSTED**. Real direct cost, crew payroll, flight, boat, hotel, permits, insurance and specialist tool expenses remain unknown.
- This is a suggested parametric scenario, not approved site travel/attendance or a verified vendor quote. Survey/SAT travel could overlap if combined; require unique trip IDs before pricing.

## Price reconciliation
- SAT 28+2 labour SELL scenario: 30 × 2 × USD800 × 31.50 = **THB 1,512,000**, **NONPOSTING**.
- Existing VeEX provisional 30 rental-days THB 30,000; ADDVALUE China FAT witness THB 397,400; MGW iFAT/facility purchased WS THB 307,125.
- Proposed B3 including surveyed labour, SAT 28+2 and current FAT/tools (but **not unpriced trip cash costs**) = **THB 2,700,125**, scenario only, not approved or released.
- Canonical old 40-day priced B3 Working SELL remains **THB 2,750,525** (2,016,000 SAT labour + 30,000 VeEX + 397,400 FAT witness + 307,125 MGW purchased services).
- Difference is **THB -50,400 in incomplete illustrative SELL**, NOT a verified saving or available project margin. No 10.2/10.3/10.5 price change, no direct Cost generated, protected Rev03 untouched.

## New modules and test
- Data: `frontend/src/project0553/data/b3SurveySatExecutionPlan0553.js`
- Table: `B3SurveySatExecutionPlan0553.jsx`, full under `b3.site-mr-sat-matrix` and compact under `b3.40-day-abc`.
- 40-day old price table and individual 21 Test IDs collapsed for clarity, still available for engineering audit and deep-link navigation.
- Module root: `bid.budget.working.bc.b3.field-execution-plan`; children: `.survey.<site>` and `.sat.<timebox-id>`.
- `npm run validate:0553-b3-survey-sat-readable-plan` included in `npm run build`. Local Windows Node/webpack validation pending.
- No unapproved commercial release; **PR #35 remains DRAFT**.

---
## SUPERSEDING CONTRACT REVIEW — 22 OCT 2026 (BOD/SPE)
Previous seven-site Survey / offshore-only 28+2 modelling is NOT current execution authority. The original section above is retained for audit only.

1. BF: BOD-0001 Rev.C2 §8 already records previous ZPQ, ZWP8 and ZWP11 site-survey findings. Do NOT assume another visit. Optional ADDVALUE two-person x (3 site-days + 2 travel-days) = 5 team-days / 10 MD; THB252000 SELL labour reference, only if a written gap/call-out exists. NOT POSTED / Direct Cost OPEN.
2. GF Fabrication Yard SAT: SPE-0001 Rev.C2 §7.3.2 specifies CONTRACTOR/VENDOR test at Fabrication Site. Four GF ZWP20/ZWP21/ZWP22/ZWP23 at JUTAL Zhuhai, distinct from MGW Nantong Factory FAT. ADDVALUE crew/day/ITP/RACI NOT ESTABLISHED.
3. GF Offshore Commissioning: SPE-0001 Rev.C2 §7.3.3 specifies VENDOR commissioning after installation. Four GF offshore workfronts, but ADDVALUE crew/day, offshore permit, vessel/POB and RACI OPEN. Never duplicate GF Yard timeboxes.
4. Previous lean 28 productive +2 risk days = 30 team-days / 60 MD for two-person COMBINED historical planning only; never assert allocated GF Yard or Offshore days. Two management-reserve days nonposting. Old 40 team-days/80MD remains a historical-based internal price driver.
5. Do not use the previous 7-site THB453600 Survey price or THB2700125 B3 what-if as current. Controlled B3 Working SELL THB2750525 UNCHANGED; actual cost and release approval OPEN.

BOD: https://drive.google.com/file/d/1YPVUfUIy8X5lVOHbTcQ3i6J2zc4bLTFQ/view
SPE: https://drive.google.com/file/d/1pa5Tlqpu65Lv1HDkNSz3XvcDCkpjVGRn/view
New source model: frontend/src/project0553/data/b3SurveySatExecutionPlan0553.js
