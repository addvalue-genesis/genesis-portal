# PJ2608-0553 / 10.2 B3 — ZPQ MR0001–0003 Individual SAT Work Breakdowns
Date: 2026-10-20
Branch: `feat/pj2608-0553-b3-zpq-mr-subtask-estimate-trace-20261020`
Status: SOURCE/COMPONENT CHANGES COMMITTED — runtime/build/UI acceptance pending.
Price authority: only `b3FortyDayWorkingSell0553.js` + canonical `bcTurnkeyWorkingCost0553.js`.

## Why three ZPQ Test IDs showed the same THB 151,200
Source `b3FortyDayWorkingSell0553.js` contains one **BF-ZPQ** Site timebox of **3 two-person TEAM workdays**.
It does not contain individual durations or prices for `SAT-ZPQ-MR0001`, `SAT-ZPQ-MR0002` and `SAT-ZPQ-MR0003`.
The budget is top-down:
```
ZPQ site team days = 3 days
Assigned workforce = 2 specialists together
Person-days = 3 × 2 = 6 MD
Working SELL/MD = USD800 × planning FX31.5 = THB25,200
ZPQ shared Site Working SELL = 6 × THB25,200 = THB151,200
```
**THB151,200 is the ONE ZPQ site allowance shared by all three MR test scopes**; previously repeating THB151,200 in each Test-ID row made it appear to be three independent billable lines. There is *no source-backed formula* deriving 3 days from MR activities, and *no source-backed per-MR hour split*. Do not invent a price for each MR.

## New per-MR details
`b3SatMrWorkBreakdown0553.js` adds a read-only engineering function list:
- ZPQ / MR0001 SCADA/WiMAX: RF channel/link, IP/VLAN/NMS, PLC throughput, radio/alarm/recovery
- ZPQ / MR0002 DMR host: host radio/talkgroup plan, host↔remote call verification and host↔remote alarms. **No new installed ZPQ BDA assumed**; isolation at equipped WHP remains under actual site scope.
- ZPQ / MR0003 host telephony: PABX/SIP, host↔WHP end-to-end calls, remote ringing/sounder interface. **No new ZPQ Ex telephone or sounder assumed**.
- Same detailed workstep pattern, keyed by respective requirements, for other Site/MR SAT IDs plus SIT/Punch.

For EVERY individual MR Test module, fields stay:
`approvedMrSpecificTeamDays:null`, `approvedMrSpecificManDays:null`,
`approvedMrWorkingSellTHB:null`, `verifiedMrDirectCostTHB:null`.
Each subtask likewise has NULL team hours, MD and direct/sell prices until approved ITP and a measured activity/resource estimate exist.

## UI modules
- Test overview: `bid.budget.working.bc.b3.site-mr-sat-matrix`
- Example specific Test: `bid.budget.working.bc.b3.sat-matrix.sat-zpq-mr0001`
- Detail: `bid.budget.working.bc.b3.sat-matrix.sat-zpq-mr0001.work-breakdown`
- Subtask: `bid.budget.working.bc.b3.sat-matrix.sat-zpq-mr0001.task.rf-channel`
- Each Test-ID row has **View MR Breakdown / ดูรายละเอียดงานและที่มาของราคา**, which scrolls directly to the matching detailed module.
- Individual MR price is displayed **NOT ESTABLISHED / NOT SEPARATELY PRICED**, and only Site allowance THB151,200 is shown as a *non-additive reference*.
- The three ZPQ detailed modules are expanded by default to expose the difference between the three MR functions.

The 21 SAT Test IDs and their subtasks remain TECHNICAL COVERAGE records; none posts an extra Cost/Working SELL to B3, 10.3 CFO, or 10.5 Scope. Current B3 total THB2,443,400 is unchanged.

## Subsequent engineering approval required for true individual MR prices
1. Confirm exact ZPQ installed assets and remote-end TAG/LIS / ITP steps.
2. Allocate unique team hours per activity, explicitly separating shared setup, overlapping SAT execution, and witness effort.
3. Reconcile proposed ZPQ per-MR total productive team-days with currently selected ZPQ **3 team-day** budget or request an approved change.
4. Verify actual cost rate and conditional support (access, vessel/operator, calibrated test tools).
5. Only after approved schedule/rates create a cost/price revision, never by multiplying the shared Site allowance three times.

## Validation requested from local release worktree
```powershell
git -C .. status --short
git -C .. fetch origin
git -C .. switch --detach origin/feat/pj2608-0553-b3-zpq-mr-subtask-estimate-trace-20261020
npm run validate:0553-b3-sat-mr-work-breakdown
npm run validate:0553-project-module-deep-link
npm run validate:0553-b3-sat-matrix-price-trace
npm run build
npm start
```
Then in Project Module Navigator search `bid.budget.working.bc.b3.sat-matrix.sat-zpq-mr0001.work-breakdown` and compare MR0001/2/3. Check that each workstep has Copy Module ID, technical evidence and NULL individual price, and that shared ZPQ THB151,200 is not treated as three charges.
