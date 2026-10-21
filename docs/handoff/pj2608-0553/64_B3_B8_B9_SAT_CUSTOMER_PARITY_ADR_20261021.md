# ADR 64 — B3/B8 China FAT Training, B9 conditional Yard, SAT Lean, Customer Source Parity
Date: 2026-10-21 ICT  
State: **PARTIALLY IMPLEMENTED / FINANCIAL POSTING NOT AUTHORIZED / CUSTOMER RELEASE HOLD**  
Owner: Project Owner (commercial policy), Engineering Software Architect (source/contract/validation)

## Context: inspect-before-change

- Previous integration Draft PR #30 HEAD `07b91458d05a`; B3 selected THB2,750,525, B8 THB30,000, B9 Base 0, Part B Base THB4,151,836.82.
- Five-day China FAT/Training policy and SAT Lean 28+2 WBS are **discussed/proposed**, but no signed activity-cost reallocation or selected revised amount.
- Original MGW `P26-058_R2` quote **SERV-2 USD5,000 iFAT + integration** and **SERV-4 USD2,500 FAT facility min five days**. Combined VQ USD7,500 × FX THB31.50 = quoted purchasing basis THB236,250. Current purchased WS THB307,125 (20% SAMTEL + 5% ADDVALUE + 5% omission reserve once); no invoice/actual cost proven.
- Current ADDVALUE six onsite witness days = twelve person-days × THB18,900; another four travel person-days + two flight tickets + fourteen hotel room-nights + visa/transport/two insurance lines. Eight source expense IDs aggregate to THB397,400 selected SELL. Rates already are SELL, **never markup 20+5+5 again**.
- Selected SAT remains 40 two-person team-days × THB50,400 per team-day plus separate THB30,000 VeEX rental. 21 Test IDs are engineering trace only.

## Decision D-64.1 — B9 empty Release is intentional, not missing vendor quotation

- `data/b9ChinaWorkingBudget0553.js::selectB9ChinaWorkingBudget0553` returns `b9BaseWorkingSellTHB:0` and `conditionalYardSellTHB:233600`.
- 10.2 `byCode.B9.workingSellTHB=0` → 10.3 B9 Base customer preview 0 → unchanged Native workbook G32 0.
- THB233,600 is the **1 LS conditional** package for one Senior Telecom Systems Integration Engineer, seven Yard workdays plus two travel workdays, separate China travel expense allowances and 9 room-nights, triggered by written JUTAL/SAMTEL request; not a FAT trip.
- Expose `conditionalOptionWorkingSellTHB` in 10.3 read model for INTERNAL audit, not as an independent customer row. **Management decision open:** (A) retain conditional 1 LS with Base zero; or (B) promote to B9 Base 1 LS only after explicit authorization and expense/overlap reconciliation at 10.2. No fabricated `233600` injection in Release or Native G32.
- Legacy Rev05 B9 THB574,560 stays superseded. Non-billable accompanying specialist cash risk THB48,500 noted at source; verify margin, travel party size and contractual allowance.

## Decision D-64.2 — Five-day B3/B8 schedule is an activity/expense allocation **AUDIT**, not a new offer

User operational sequence: Day1–2 FAT, Day3 spare, Day4 Training, Day5 Punch List. It is **not equal** to the OEM SERV-2 two iFAT days + SERV-4 minimum five days of facility. `data/b3B8FiveDaySourceAllocation0553.js` reads exactly the eight B3 expense IDs already present in 10.2 and supports one or two paid Training personnel as alternative activity assumptions.

- Reduces **illustrative onsite labour** from 12 historical person-days to 10 person-days = THB189,000 instead of THB226,800.
- Retains original seven other source expense quantities, including **14 hotel room-nights** pending itinerary proof, not because 14 is a validated five-day trip requirement. Other sources = THB170,600.
- Combined five-day source-trip **scenario** THB359,600 (=189,000+170,600), compared with current six-day China trip THB397,400; THB37,800 is a *proposed SELL effort reduction*, not verified cash-cost saving.
- Sharing rule for audit: Training day person-days / ten onsite person-days; labour allocated to actual activity, travel/airfare/hotel/visa/local transport/insurance allocated proportionally across the **same unique source expense IDs**, with two owner portions that sum to original scenario amount.

| Activity assumption | B3 allocated portion | B8 allocated portion | Total China trip |
|---|---:|---:|---:|
| 1 trainer on Day 4; second witness supports B3 | THB323,640 | THB35,960 | THB359,600 |
| 2 trainers on Day 4 | THB287,680 | THB71,920 | THB359,600 |

These are **alternative SOURCE ALLOCATION SCENARIOS**, not revised selected owner prices. The current B8 THB30,000/44 MH may fund preparation, materials and admin; source overlap with day-four training remains OPEN. Neither adding B8 allocation to THB30,000 nor deleting that THB30,000 is authorized. No owner-selected Working SELL is changed yet.

**Approval and technical gates:** 1 vs 2 Training personnel, hotel actual night count, fare/visa/insurance application and payer, facility witness itinerary, BOD training-before-formal-FAT vs Day4 sequence, two Yangon training batches per SPE, all four MR ITP (48 witness test-hours), punch-day ownership, vendor scope acceptance and supplier warranty obligations.

Vendor quote retains original VQ labels for SERV-2/4; purchased THB307,125 stays B3 once, and the entire iFAT component is represented under customer **B3 Inspection, Testing and Certification as per ITP (1 Lot)**, never separately priced in B8 or as a new customer iFAT row.

## Decision D-64.3 — Port SAT Lean without changing B3 current price or tests

- Ported prior branch `feat/pj2608-0553-b3-offshore-sat-lean-28plus2-scenario-20261020` `b3LeanSatScenario0553.js` into PR#30 with live `b3SiteMrSatCoverage0553` proof (19 Site/MR + 2 SIT/Punch Test IDs).
- 7 site shared team-day timeboxes: ZPQ2, ZWP8 2, ZWP11 2, ZWP20 5, ZWP21 5, ZWP22 5, ZWP23 3; integrated SIT3 and Punch1 = 28 productive two-person **TEAM**-days (56 MD).
- 2 internal risk team-days (4 MD) → 30-day indicative team labour THB1,512,000; extra **two management reserve team-days** are NONPOSTING/not included.
- Combined with selected MGW Purchased FAT THB307,125 + current ADDVALUE China witness THB397,400 + VeEX THB30,000, indicative **B3 THB2,246,525**, versus current B3 THB2,750,525, **illustrative WS delta THB504,000**. Prior branch's THB1,939,400 omitted MGW Purchased FAT and is **not an updated basis**.
- Source-based, nonposting `canonical.scenarioAudits.b3LeanSat28plus2`; do not modify `b3FortyDayWorkingSell0553.js`, 21 Test IDs, base budget, 10.3 or Native workbook.
- Marine/offshore access and POB, RACON vessel/radar/operator slot, MC/RFSAT readiness, approval of test procedures and true direct expense are **not established**. Deciding a WBS method ≠ authorizing selected Commercial Working SELL.

## Decision D-64.4 — Preserve 10.4 as a registry and add live parity verification

- `estimateToBidMapping.js` existing `validateEstimateToBid0553` has blank `estimateLineIds` and `allocationRule:null` for 21 customer targets, so *cost allocation evidence remains unverified*. This registry is **NOT** an active 10.3 price transformation.
- Added `auditCurrentCustomerProjection0553({canonical,release,scope})`: compares 21 A1–A5/B1–B14/C1–C2 targets for Source→Release/Scope parity with original workbook row and control semantics. A5 is a nonadditive 10.1 reclassification; B9 0 Base + 233600 conditional distinguished; C1/C2 remain unapproved reference without Direct Cost.
- Existing 10.3 Release Customer Workbook **Review / Export checks** now shows this read-only audit. It is not another screen, not a second calculator and does not erase estimate-line validation HOLD.
- Official B/C names use `officialWorkbookTemplate0553.js` instead of historical `REV08_BASELINE` in Customer Preview; the original workbook's native binary cell layout remains owner.
- Native source map: B1–B14 row 24–37; B3 G26, B8 G31, B9 G32. Original annex geometry, formulas and exact native binary **not exercised in this session**. Customer Release remains HOLD.

## Source authority / regression / exit criteria

| Contract | Canonical source | Test or check | Release gate |
|---|---|---|---|
| B3/B8 trip allocation | Original `IC-FAT-*` expense IDs | 8 unique, all owner splits equal source, no actual costs manufactured | Travel itinerary/Training/B8 overlap approval |
| MGW FAT | Original VQ SERV-2/4 → purchased WS B3 | quote USD7500, purchased WS THB307125 once, existing SAMTEL attribution unchanged | Supplier/ITP/service overlap accepted |
| SAT Test Coverage | existing 21 Test IDs | 28+2 scenario references all IDs, no posted test price | Marine access/tools/client ITP |
| B9 Specialist | 10.2 owner + optional Yard package | Base 0, conditional 233600, native G32 0 | User selects Base vs Conditional |
| Mapping | 10.1/10.2 → 10.3 / 10.5 → Native | 21 targets; A5 display only, no independent price | Original XLSX binary verification, full source/estimate line allocations |
| Pricing | `releaseCommercialModel0553.js` | B3 THB2750525, Part B THB4151836.82; correct purchased SAMTEL double-count protection | Management signed approval, Direct Cost and A/B/C source proof |

New regression: `npm run validate:0553-b3-b8-five-day-lean-parity`, included in `npm run build`. Prior targeted source selectors executed in a tool JS fixture and returned expected results; **not equivalent** to full Node/Babel/Webpack run. No local repo checkout is available in this connected session; full build is **NOT VERIFIED**, and no customer workbook is marked ready.

**Follow-up instructions:** Keep PR #30 DRAFT and UNMERGED. Run scoped and full Node build on a clean `frontend` checkout, check original native XLSX, reconcile 5-day attendance/travel, and obtain management release/owner policy approval before changing `WS-B3`, `WS-B8` or `WS-B9`.
