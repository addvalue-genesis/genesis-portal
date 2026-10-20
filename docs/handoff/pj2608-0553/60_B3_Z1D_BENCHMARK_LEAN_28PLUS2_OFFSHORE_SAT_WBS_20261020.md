# PJ2608-0553 — B3 Offshore SAT/SIT: Z1D-based Lean 28+2 Working Team-day Scenario
Date: 2026-10-20
Status: INTERNAL PRE-AWARD SCENARIO (WBS accepted for estimation; price not approved)
Module ID: `bid.budget.working.bc.b3.lean-sat-28plus2`
Branch: `feat/pj2608-0553-b3-offshore-sat-lean-28plus2-scenario-20261020`

## Source and method
- SAMTEL Z1D Daily Report: 13 Nov–7 Dec 2022, 25 elapsed calendar days; approximately 14 days technical/survey activity (20–28 Nov, 30 Nov–4 Dec), including configuration, installation, testing and retest. Not equivalent to complete signed Z1F SAT.
- Z1F Rev.K WBS K15–K18, MR0001–0004, SPE-C2 §7.3.3 offshore acceptance and 10.2 B3 existing 21 Test IDs.
- Current canonical 40-day price remains SOURCE/SELECTED; proposed 28 productive team-days are NOT 28 man-days.

## Lean work breakdown (same two-person team; not parallel teams)
| WBS | Location | Existing team-days | Proposed team-days | Included MR / work |
|---|---|---:|---:|---|
| K15.1 | ZPQ | 3 | 2 | MR1/2/3 Central NMS, PLC, PABX, host |
| K15.2 | ZWP8 | 2 | 2 | MR1 SCADA/WiMAX + host interface |
| K15.3 | ZWP11 | 2 | 2 | MR1 SCADA/WiMAX + host interface |
| K16.1 | ZWP21 | 7 | 5 | MR1/2/3/4, including marine RACON |
| K16.2 | ZWP23 | 5 | 3 | MR1/3, no new BDA/RACON |
| K16.3 | ZWP22 | 7 | 5 | MR1/2/3/4 |
| K16.4 | ZWP20 | 8 | 5 | MR1/2/3/4 |
| K17 | Cross-site SIT / ZPQ | 4 | 3 | NMS/PLC/voice/DMR/alarms/recovery |
| K18 | Punch/Retest | 2 | 1 | Minor retest / as-left / handover |
| **TOTAL** | 7 sites + SIT + Punch | **40** | **28** | **56 person-days @ two specialists** |

Sequence is a Rev.K planning sequence, NOT a confirmed vessel itinerary. MC/RFSAT and platform availability may change access order.

## Internal contingency, not extra priced customer schedule
- Base = 28 productive *team* workdays = 56 person-days.
- Internal risk allowance = 2 extra team-days (4 person-days). It is illustrative pricing coverage subject to management approval and only for authorized RF/BDA/RACON retest, witness, site access or SIT minor punch.
- Management reserve = 2 further team-days, not part of 28+2, and **excluded** from illustrative 1 LS and Current SELL until escalation approval.
- The actual offshore campaign's elapsed calendar days and payroll/payable standby may be greater because MOB/DEMOB, waiting, POB, marine transfers, offshore access, weather and route are NOT yet evidenced.

## Read-only Working SELL comparison (current B3 FAT witness unchanged)
| Component | Current | Lean Base + 2 comparison |
|---|---:|---:|
| Offshore productive Labour | 40 × 50,400 = THB 2,016,000 | 28 × 50,400 = THB 1,411,200 |
| Two extra team-day risk | n/a | 2 × 50,400 = THB 100,800 |
| VeEX 30-day rental | THB 30,000 | THB 30,000 (actual rental duration TBC) |
| MGW FAT Witness selected B3 source | THB 397,400 | THB 397,400 (separate new B3/B8 FAT/Training scenario remains unapproved) |
| **B3 Total** | **THB 2,443,400 Current Working SELL** | **THB 1,939,400 NONPOSTING comparison** |
| Difference | — | THB 504,000 below selected current |

The day-rate is **Working SELL**, USD800 per person-day × FX31.50, not verified personnel payroll/direct cost. Do not interpret the difference as cost saving. A new FAT/Training scenario proposes THB402,400 B3 FAT plus B8 training; do NOT mix that new proposal with this selected-price comparison before approval.

## Customer and risk governance
- Customer: B3 Inspection, Testing and Certification as per ITP — **1 LS only**; no separately priced standby/OT/MOB/DEMOB, site price, MR price or per-day line.
- Internal: keep Site/MR Test IDs and requirements fully intact; do not delete required ITP hold points or calibration gates.
- JUTAL/PTTEPI Offshore Logistics/POB/transfer/accommodation RACI unverified. Never assume automatic dedicated boat or free accommodation.
- RACON X/S-band vessel/radar/operator test window and COMPANY witnesses need confirmation in approved marine plan.
- Contractor-controlled site readiness/MC/RFSAT must be complete before ADDVALUE arrives; otherwise issue schedule/price risk review.
- Source code: `data/b3LeanSatScenario0553.js` → `B3LeanSatScenario0553.jsx` → `B3WorkTypeAccordion0553.jsx` under `B3.2.3`. This is a proposal **only**.
- Canonical source `data/b3FortyDayWorkingSell0553.js`, `data/b3SiteMrSatCoverage0553.js`, `data/bcTurnkeyWorkingCost0553.js`, `10.3 CFO`, `10.5 Scope`, Release and Customer XLSX remain unchanged.
- No direct cost is established or posted and no management reserve is marked zero-cost. Release HOLD.

## Required verification
Run from frontend:
```powershell
node scripts/validate-0553-b3-lean-sat-scenario.cjs
npm run validate:0553-b3-sat-matrix-price-trace
npm run validate:0553-b3-breakdown-module-ids
npm run validate:0553-b3-b8-integrated-training
npm run build
```
Until these run and UI is accepted, no PASS claimed. New feature branch is independent; check base against the target integration branch before merging.
