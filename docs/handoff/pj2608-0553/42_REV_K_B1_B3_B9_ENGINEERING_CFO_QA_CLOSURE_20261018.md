# PJ2608-0553 — Handoff 42: Rev.K Engineering / CFO QA Closure
**Date:** 2026-10-18  | **Branch:** `feat/pj2608-0553-sat-tools-compliance-revp-20261018`
**Project:** SAMTEL–PTTEPI MM-ZTK Z1F–JUTAL
**Status:** INTERNAL PRE-AWARD ENGINEERING / WORKING SELL INTEGRATED. NOT customer release or independently verified Direct Cost.

## 1. Current canonical Working SELL
| Code | Current THB | Source / posting |
|---|---:|---|
| B1 | 624,030.26 | 27 engineering activity WBS / 964 historical MH + unique 11 Rev.K PM gates / 48 MH; old 510k superseded |
| B3 | 2,046,000.00 | Two offshore specialists x 40 working days x USD800/day x FX31.5 = 2,016,000; VeEX MX100+ rental 30d x THB1,000 = 30,000 (ex VAT provisional pass-through) |
| B9 FAT BASE | 397,400.00 | Six estimated MGW China 4-MR FAT witness days, two paid ADDVALUE staff, two travel days and accommodation/flight/work cover allowances |
| B9 optional Yard LS | 233,600.00 | Not included in Base; one billed Sr Telecom Engineer 7 working days, 2 travel days, separate trip; one accompanying Field Telecom Specialist not charged extra |
| **Part B Base** | **4,600,020.95** | Existing other B categories retained, no optional Yard LS |
| **Part B Base + optional Yard** | **4,833,620.95** | Conditional scenario ONLY |
| **Part C options** | **4,771,156.05** | Optional spare inventory, not part of Part B base |
| **B+C including C options** | **9,371,177.00** | Scope reference only, not A+B+C project cost |

**Internal cash risk (non-posting):** second accompanying Yard field specialist flight/hotel/conditional visa/travel & occupational cover THB48,500 estimated; actual payroll/extra transport/policy quote pending. This is NOT an additional customer price.

## 2. Technical source → WBS → cost-owner coverage
- Factory FAT: BOD C2 §10.3 / SPE C2 §7.3.1 / MR1..4 and DTS1..4 → K01. MGW is OEM FAT executor (Part A inclusion), ADDVALUE 2 witnesses (B9 only). `data/fatWbsFourMr0553.js` defines 12 FAT test groups / 48 agenda hours / six provisional witness days. Third Field Telecom Specialist standby no FAT fee.
- Yard SAT: SPE §7.3.2 is required result, not automatically ADDVALUE execution. JUTAL main execute assumption remains unconfirmed signed RACI. Optional B9 Sr Telecom Engineer 1 LS THB233,600 offered; unbilled second specialist travels. NO JUTAL physical installation labour in B9.
- Offshore SAT/SIT: BOD §§10.4–10.5 / SPE §7.3.3 / MR/DTS → K15–K18, B3 only. `data/b3FortyDayWorkingSell0553.js` allocates 40 team working days across seven sites, SIT and punch; timebox not authorized POB calendar. `data/b3SiteMrSatCoverage0553.js` adds **19 per-site-MR acceptance functions + 2 integrated/punch records**. ZWP23 no new DMR BDA or RACON.
- Cost owner: `data/revKAbcOwnershipControl0553.js` linked 84 model objects, 0 additional price posting; B1 PM and B3/B9 labor time referenced once, B2 VDRL, B6 cargo, B11 O&M permanent tools independent.

## 3. GitHub files completed in this continuation
- `frontend/src/project0553/data/b3SiteMrSatCoverage0553.js`
- `frontend/src/project0553/B3SiteMrSatCoverage0553.jsx` mounted in `BcCostEvidenceDetail0553.jsx`
- `frontend/src/project0553/B3EquationAudit0553.jsx` now explicitly labels Rev05 SAMTEL BKK/39-day evidence as HISTORICAL and displays active 40-day B3.
- `frontend/src/project0553/B1RevKMilestoneBudget0553.jsx` now shows 11 charged events / 48 MH; duplicate K00 stage remains source evidence only.
- `frontend/scripts/validate-0553-b3-site-mr-sat.cjs`
- `frontend/scripts/validate-0553-current-commercial-integration.cjs`, tests actual canonical 10.2 selectors and Babel parses six JSX components.
- `frontend/package.json` build now gates on both new tests and prior B1/B3/B9 validators.
- Fixed ten legacy/initial validators which treated historical Rev05 total / B1 / B3 / B9 as current; raw historical source audit assertions retained where appropriate.
- Contract clarification draft: `docs/engineering/pj2608-0553/0553_TELECOM_CONTRACT_TQ_YARD_FAT_20261018.md` (5 questions, NOT SENT).

## 4. Verification evidence
- GitHub connector read-back confirms changes on designated branch.
- In-memory JS execution against the latest fetched branch's 10 source files passed 11/11 invariants: B1 624,030.26; B3 2,046,000; B9 FAT 397,400; optional Yard 233,600; Part B Base 4,600,020.95; six-day FAT; seven-site/21 group SAT; 40 days; ABC price increment 0; two physically deployed at Yard with one billed.
- Inspected `frontend/package.json` build's **95 pre-existing validator registrations** by provider fetch in 12-script batches, targeting stale old-price/bangkok/39-day references. Patched validators with conflicting *active* expected totals; source-only historical tests remain unchanged.
- **Full npm validator command / Webpack production build / React browser runtime have not been run in this execution environment**: the private repository is not mounted here and direct git network access is disabled. `.github/workflows/frontend-build.yml` has push trigger for `feat/**` and executes `npm run build`, but workflow result was not retrieved; do NOT claim CI pass.
- DO NOT commit/push directly in local Windows PJ2601-0510 worktree; GitHub branch writes already committed. Branch is not merged to main.

## 5. Outstanding third-party contractual approval gates (cannot be internally declared passed)
1. **BOD30 vs SPE14 calendar-day FAT notice:** 14d management schedule preference but explicit BOD 30d is a contract conflict. Written precedence/waiver needed before compliance assertion.
2. **MGW FAT:** facility address, 4-MR ITP, 12-test agenda repetitions per equipment TAG and actual six-day witness duration, vendor calibration / licensed software inclusion.
3. **JUTAL Yard SAT:** signed CONTRACTOR–MGW–ADDVALUE–COMPANY execute/witness/report signatory matrix and written call-out of optional B9 LS.
4. **SPE §7.3.2 post-Yard removal/loose dispatch to ZPQ** vs current as-installed WH interpretation; clarify current DMR versus legacy TETRA and assign reinstallation shipping costs only if required.
5. **Offshore B3:** PTTEPI-approved site/RFSAT Test IDs and ITP, RACON D-v-Q code test and marine vessel/radar/operator, POB/access/visa/insurance, calibrated RF/SPL tools. Direct costs and margin remain OPEN.
6. **B6 JUTAL import/export:** named legal importer/exporter of record, bonded/clearance scope, DDP contractual supplier boundary; no double billing OEM included freight.

## 6. Safe local build/verification (dedicated 0553 worktree only)
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553
git status
git branch --show-current
git fetch origin
git pull --ff-only origin feat/pj2608-0553-sat-tools-compliance-revp-20261018
cd frontend
npm run validate:0553-revk-abc-ownership
npm run validate:0553-b3-site-mr-sat
npm run validate:0553-current-commercial-integration
npm run build
```
If dirty/wrong branch: inspect first; do not reset/stash-pop unrelated work. Technical TQs need approval before issuing guaranteed contract compliance/true Direct Cost/margin.
