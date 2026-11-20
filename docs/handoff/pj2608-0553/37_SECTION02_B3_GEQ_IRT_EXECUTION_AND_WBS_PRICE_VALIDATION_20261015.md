# PJ2608-0553 — B3 Existing GEQ/PEQ → 02 / 10.2 IRT, FAT, SAT, Commissioning Derivation
Date: 2026-10-15
Branch: `fix/pj2608-0553-scope-mgw-r2-integrated-20261015`
Status: **CODE WIRED / WBS & MR SOURCE RECONCILIATION PASS / INDEPENDENT DIRECT COST, APPROVED ITP, SAT/COMM PLAN OPEN / FULL LOCAL NPM BUILD NOT RUN BY ASSISTANT**

## Source and ownership
- Original MR0001 Rev.C1 §7–9 and Table 11 VDRL, user-uploaded PDF, original Drive MR1 https://drive.google.com/file/d/1XMDolhzCvw2kQnahlFBwxTujkW22pQSm/view
- MR0002 Rev.C1 §7–9 https://drive.google.com/file/d/1BbpBxKCuv0w8Khruw5flIhSPlIWXw6Mx/view
- MR0003 Rev.C1 §7–9 https://drive.google.com/file/d/1Y0Xh4BpfHZBV_MxOSuWmr-I9r-7DNkB1/view
- MR0004 Rev.C1 §7–9 https://drive.google.com/file/d/1Iq0DGmHlVP8dXvwKED-co00TGlM7NGp7/view
- BOD Rev.C2 §10, SPE-C2 §7, STD-6-INT-001 as separately referenced by MR §9.
- Rev05 approved *source working reference*, **not an approved physical offshore route**: https://docs.google.com/spreadsheets/d/1vXwV3py-FwdyvZaNq-OvsDyefZEJKPqz/edit, sheets `18_TH_FAT_WBS`, `23_SAT_TRIP_VALIDATION`, `10_B3_CAMPAIGN_PRICE`.
- Management FAT execution choice: `frontend/src/project0553/data/fatExecutionBasis0553.js` — integrated FAT at **SAMTEL Bangkok after OEM pretests**, MGW advisory, followed by JUTAL Nantong China yard supervision separate B9.
- **Section 02 method** from existing common `frontend/src/common/cost/derivationKernel.js`: GEQ-005, with GEQ-006/007/013/016/017/018/023 as planning/cost gates, `PEQ-B3-001…011` registry. No GEQ-034 or duplicate new Common Kernel.
- **Section 10.2 consumer**, not another calculator: `data/bcWorkCostLines0553.js`, `data/bcTurnkeyWorkingCost0553.js`, and `B3EquationAudit0553.jsx`. Section 02 also renders the SAME B3 proof.

## Newly source-locked test requirements
`frontend/src/project0553/data/bcB3IrtSourceLedger0553.json` stores raw **MR §9 IRT** source rows, **MR0001 28 + MR0002 27 + MR0003 27 + MR0004 27 = 109** unique inspection-requirement points; preserve source point numbers, inspection codes and source descriptions. Extraction stripped four repeated PDF page headers, with no renumbering.
**IRT=Inspection Requirement Table (RFQ-stage, prior to OEM-approved ITP)**: 109 source clauses are **not 109 physical tests, visits, independent chargeable events or approved inspection dates**. IRT detail for SCADA includes factory acceptance, certificates, function/performance tests, cyber security, 24-h endurance, 100% function, punch clearance and MRB; similar but technically different rows for DMR, Ex Telephone/Sounder and Marine RACON. All OEM factory test inclusions need current vendor quote & accepted RACI.
- **16 MR-stage obligation keys** = 4 MR × (OEM shop FAT, Bangkok integrated FAT requirement, offshore SAT requirement, offshore Commissioning requirement). These are *requirements*, not 16 independently chargeable sessions. All four Bangkok MR cases share one management-selected combined BKK FAT **campaign**.
- **20 source VDRL test-document slots** (5 per MR: ITP, FAT procedure, SAT procedure, FAT report, SAT report) link B2 document control with B3 physical test-evidence production. Do not add extra hours or charge twice based on one VDRL record.

## WBS Rev05 decomposition / source-price conservation
| Work plan | Source gross driver | Working sell THB | Direct cost status |
|---|---|---:|---|
| Combined SAMTEL Bangkok FAT | 8 team-days × (Senior THB12,000 + Engineer THB6,000)/team-day | **144,000** | OPEN |
| Offshore SAT + Commissioning | 5 trips, 39 team-days × 2 = 78 person-days × USD800/MD × working FX31.5 | **1,965,600** | OPEN |
| **B3 WBS Working SELL** | **144,000 + 1,965,600** | **2,109,600** | **NOT ESTABLISHED** |

**Site trip composition preserved from 23_SAT_TRIP_VALIDATION**:
- TRIP-01 ZWP20: 1 MOB + 5 technical + 1 DEMOB = 7 days (14 MD)
- TRIP-02 ZWP21: 1 + 5 + 1 = 7 days (14 MD)
- TRIP-03 ZWP22: 1 + 5 + 1 = 7 days (14 MD)
- TRIP-04 ZWP23: 1 + 3 + 1 = 5 days (10 MD), MR1/MR3 only in Rev05 scenario
- TRIP-05 ZPQ→ZWP8→ZWP11: 1 MOB + 8 technical + 1 intra-field transfer + 2 final integration + 1 DEMOB = 13 days (26 MD), MR1/MR2 scenario
- Total: 26 technical + 10 MOB/DEMOB + 2 integration/handover + 1 transfer = **39 team-days = 78 MD**. **MOB/DEMOB already included; never add 10 days again**. Old 44-day/88-MD model superseded.
- Per existing **GEQ-005**, using **8h Bangkok office/yard shift and 12h offshore shift** from project Particular time conventions, **8×8×2 = 128 gross Bangkok crew shift MH**, **78×12 = 936 gross offshore shift MH**. These are *working shift occupancy* proxies, NOT verified productive technical test MH, billable MH, overtime eligibility, payroll cost or approved resource calendar.
- Actual SAT vs COMM split, HUC/SIMOPS, POB, transfer, final itineraries, client witness, aircraft/boats, role rates, contracted pay basis, instruments and OEM prices are still open. Never relabel the USD800/MD *SELL* as Direct Cost.

## Eight B3 validation statuses
1. `B3-VAL-01 PASS_SOURCE_IRT_ONLY` 109 point source identities.
2. `B3-VAL-02 PASS_WORKING_PRICE_ONLY` THB2,109,600 source WBS reference arithmetic; not independent cost verification.
3. `B3-VAL-03 PASS_INCLUDED_MOB_NOT_ADDITIVE` 39-day decomposition/no double count.
4. `B3-VAL-04 OPEN_APPROVED_ITP_AND_TEST_EVENT_KEYS` true event grouping, OEM factory pretest and signed ITP.
5. `B3-VAL-05 OPEN_SAT_COM_SCHEDULE_AND_HUC` HUC/SIMOPS, SAT duration vs Commissioning duration, offshore transit/POB.
6. `B3-VAL-06 OPEN_INTERNAL_COST_AND_TRANSPORT` payroll, per diem, insurance, site/access and travel.
7. `B3-VAL-07 OPEN_WITNESS_NOTICE_30_VS_14` BOD 30 vs SPE 14 calendar day notice conflict; conservative 30 until contractual disposition.
8. `B3-VAL-08 TRACE_CROSS_OWNER_NON_ADDITIVE` B1 engineering, B2 document control, B3 physical test/evidence, B9 Nantong yard supervision.
Approved Direct Cost and customer release remain false.

## GitHub changes and local tests
- `frontend/src/project0553/data/bcB3IrtSourceLedger0553.json` 109 sourced points
- `frontend/src/project0553/data/bcB3EquationExecution0553.js` project adapter runs existing `deriveManHours` and `deriveLaborCost`; Direct Cost missing input returns `OPEN_INPUT`.
- `frontend/src/project0553/B3EquationAudit0553.jsx` read-only view on 02 and 10.2, per-trip breakdown, validation, 16 staged obligations, 20 VDRL test docs and 109 IRT raw rows.
- 10.2 canonical selectors imported B3 proof; no new additive cost lines: remains 105 cost/requirement records and 40 non-additive audit clauses.
- `frontend/scripts/validate-0553-b3-equation-execution.cjs`, command `npm run validate:0553-b3-equation-execution`, added to `npm run build`.
- Lightweight V8 dynamic verification of original GEQ-005 inputs, 109 source points, 128/936 gross MH, 39/78 occupancy, subtotal THB2,109,600 and 8 expected source validation statuses **PASS**.
- Full local `npm run build` **has not been executed in this connector-only turn**; user must run locally.

```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal
git pull --ff-only origin fix/pj2608-0553-scope-mgw-r2-integrated-20261015
cd frontend
npm run validate:0553-b1-b2-equation-execution
npm run validate:0553-b3-equation-execution
npm run validate:0553-bc-working-cost-lines
npm run build
npm start
```

## Next Gate
Detailed **B3 Independent Direct Cost** requires approved OEM ITP/Test Event Matrix, HUC/SIMOPS/POB physical plan and actual role-loaded labor/travel rates. Until source approved, retain the explicit `OPEN_INPUT` / no posting, not a fake cost estimate or calibrated industry standard. Review whether the WBS 5 trips and 8 BKK team-days are competitively necessary; not enough source evidence yet to reduce or increase them.
