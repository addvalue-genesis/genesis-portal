# PJ2608-0553 — Handoff 43 · Contract Scope Correction: MGW FAT Witness is B3, NOT B9
**Date:** 18 October 2026 · **Authority:** User identification of explicit native Scope of Supply B3 and B9 wording.
**Status:** INTERNAL PRE-AWARD Working SELL + Cost-Owner correction. Not verified Direct Cost or signed customer quotation.
**Branch:** `feat/pj2608-0553-sat-tools-compliance-revp-20261018`

## 1. Binding owner source — native customer Scope of Supply
[4-Scope of Supply.xlsx (native unpriced)](https://docs.google.com/spreadsheets/d/1FRYaHK7N0r4WAAdzrAOZAfdqw-uYej0p/edit)

- Part B Row 24 **B3** = `Inspection, Testing and Certification as per ITP`.
- Part B Row 30 **B9** = `Specialist field assistance as per specification`; accepts lump-sum or unit rates.
- Therefore MGW China FAT attendance by ADDVALUE's PM / Chief Telecom Engineer and Senior Telecom Systems Integration Engineer, two paid people for six provisionally time-boxed FAT witness days, plus unique associated travel/hotel/visa/occupational insurance **is B3 Inspection & Testing**.
- MGW's OEM FAT execution/factory tools remain OEM/Part A according to inclusion quote. They are NOT paid ADDVALUE witness Direct Cost.
- B9 belongs only to optional ADDVALUE specialist assistance at JUTAL Zhuhai Yard, seven workdays / one Senior Engineer billed, accompanied by unbilled Field Telecom Specialist; one THB233600 optional lump sum on written call-out.

## 2. Accounting rule: cost owner vs price basis
B3 is the **Direct Project Cost Category** for FAT Witness execution resources, but the numerical **THB397400 is pre-award Working SELL** calculated with management sell rate USD600/person-day and budgetary travel/insurance allowances. It is NOT verified internal payroll Direct Cost. The ACTUAL direct cost ledger must retain `directCostTHB:null` (not 0) until per-person salary/employer cost and travel invoices are evidenced.

The historical assumption 'China trips go to B9' was incorrect: expense purpose defined by contractual work, not geography. All eight FAT-related economic expense IDs are `costOwner:B3`, `costAccountingClass:B3_DIRECT_FAT_WITNESS_EXPENSE_UNVERIFIED`, `directCostTHB:null`. Yard optional's eight lines are `costOwner:B9`.

## 3. Reconciled 10.2 Working SELL — THB
| Code | Current Working SELL | Components / treatment |
|---|---:|---|
| B1 | 624,030.26 | 27 engineering activity WBS + 11 unique PM gates |
| **B3 Base** | **2,443,400.00** | Offshore SAT/SIT 40d × 2 specialists 2,016,000 + VeEX 30d 30,000 + MGW China FAT Witness 397,400 |
| **B9 Base** | **0.00** | No unconditional specialist assistance in Base. This is explicit absence of Base call-out, not a zero cost for real Yard SAT obligations |
| **B9 Conditional** | **233,600.00** | One customer optional LS Yard Senior Telecom Engineer 7 working days + travel and cover; second specialist unbilled but internal cost exposure tracked |
| **Part B Base** | **4,600,020.95** | **UNCHANGED** by B3/B9 reallocation |
| Part C Optional Spares | 4,771,156.05 | Separately optional |
| Part B Base + conditional B9 | 4,833,620.95 | Only if call-out occurs |

Difference against prior incorrect allocation:
- B3 prior 2,046,000 → 2,443,400: +397,400
- B9 Base prior 397,400 → 0: −397,400
- Part B Base net variance = **0**.
- MGW witness expense is posted once in B3 and never again in B9. The 233,600 conditional Yard LS remains separate.

## 4. Code changed / trace
- `frontend/src/project0553/data/b9ChinaWorkingBudget0553.js`: compatibility-named combined China cost register now assigns each economic line by its actual activity: B3 FAT / B9 Yard; `fatWorkingSellTHB=397400`, `b9BaseWorkingSellTHB=0`, `conditionalYardSellTHB=233600`. Both Direct Costs null.
- `frontend/src/project0553/data/bcTurnkeyWorkingCost0553.js`: Canonical 10.2 B3 includes FAT, B9 Base 0; Part B unchanged. B3 and B9 routes audited.
- `frontend/src/project0553/data/b1IndirectCostLedger0553.js`: FAT-CREW and FAT-TRAVEL owners changed B9→B3; Yard remains B9. No new postings.
- `frontend/src/project0553/data/b3RequirementWbsTrace0553.js`: RQM-01 FAT and RQM-02 witness notice now B3, RQM-03 Yard SAT optional B9 role unchanged.
- `frontend/src/project0553/data/revKAbcOwnershipControl0553.js`: costing reconciliation uses B3 FAT economic lines / B9 Yard optional only.
- `frontend/src/project0553/B9ChinaBudgetDetail0553.jsx`: historical filename retained; filtered separate B3 FAT view and B9 Yard support view.
- `frontend/src/project0553/BcCostEvidenceDetail0553.jsx` / `BcWorkCostLines0553.jsx` / `CommercialWorkspace.jsx`: updated current 10.2 text and cost-source mapping.
- `frontend/scripts/validate-0553-fat-cost-owner-contract.cjs`: new source-specific fail-closed regression; registered in build; previous validators expectations updated.

## 5. Verification
- Connected GitHub source read-back and isolated JS composite check passed: B3 2,443,400; B9 Base 0; Part B 4,600,020.95 unchanged; 8 B3 FAT lines, 8 B9 optional Yard lines, no extra post; actual Direct Cost null.
- Full Node/Babel validation suite and Webpack build remain **NOT RUN** here, so do not claim production CI pass.
- Still must close FAT 14/30d notification precedence, OEM FAT signed agenda/site/ITP, JUTAL Yard SAT contract RACI, post-Yard loose equipment to ZPQ, offshore ITP/POB and OEM test-tool inclusion.

## 6. Local verification commands
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553
git status
git branch --show-current
git fetch origin
git pull --ff-only origin feat/pj2608-0553-sat-tools-compliance-revp-20261018
cd frontend
npm run validate:0553-fat-cost-owner-contract
npm run validate:0553-revk-abc-ownership
npm run validate:0553-current-commercial-integration
npm run build
```
Before pulling, ensure 0553 worktree clean and correct branch; do not touch separate PJ2601-0510 worktree or unrelated stash.
