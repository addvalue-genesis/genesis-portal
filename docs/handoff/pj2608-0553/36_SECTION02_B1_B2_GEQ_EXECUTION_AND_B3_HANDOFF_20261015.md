# PJ2608-0553 — Section 02 Common/Generic/Particular GEQ/PEQ wired to 10.2 B1/B2; B3 handoff
Date: 2026-10-15. Branch: `fix/pj2608-0553-scope-mgw-r2-integrated-20261015`.
Status: **CODE WIRED; INDEPENDENT MH/COST NOT VERIFIED; LOCAL NPM BUILD PENDING**.

## Ownership
- **Section 02**, displayed as `02 First Principles & Methodology`, `bid.engineering`, owns mathematical method / GEQ/PEQ documentation, source-bound engineering rules and the audit module `bid.engineering.equations.b1-b2`.
- Project-agnostic implementation remains `frontend/src/common/cost/derivationKernel.js`, **no new GEQ**. Controlled master register remains GEQ-001…033, PEQ-B1-001…007 and PEQ-B2-001…014 (master Google Drive workbook).
- **Section 10.2** is consumer/read model `bid.budget.working.bc`, source `data/bcWorkCostLines0553.js`, price and cost owner control. It must never fork a second equation system.
- Controlled source VDRL `frontend/src/project0553/data/bcVdrlSourceLedger0553.json`, 143 Table 11 source rows, source link https://docs.google.com/spreadsheets/d/1fet1uloSMrZvLUDbw1yNx3IC8OuBQYsF/edit.
- Execution adapter `frontend/src/project0553/data/bcB1B2EquationExecution0553.js`. UI `frontend/src/project0553/B1B2EquationAudit0553.jsx` renders the SAME selected proof under section 02 and section 10.2 B1/B2. No posting.

## Four validation doctrines executed
1. **Document identity**: MR + project document number is source requirement key; 143 keys, 38 title types, 102 A + 37 I + 4 source blank. Document title is not a unique issued document; Facility/Tag issues and recurring reports are not inferred.
2. **Cost owner**: B1 or OEM for technical contents, B2 for document lifecycle/transmittal and final dossier, B3 or OEM for actual test records; owner of each technical task requires subcontract/OEM scope binding. No double billing.
3. **Revision evidence**: COMPANY 10 working-day review and contractor 15 calendar-day response are **elapsed duration constraints** not MH. PTTEP STD does not prescribe a fixed N_rev. `reviewCycles` and `UMH` remain null -> Common `deriveDocumentHours` must return `OPEN_INPUT`. GEN003 R01 vs retrieved document internally marked R02 remains a contract precedence gate.
4. **Independent rederivation**: 27 B1 source activity lines reconcile to 964 WBS MH, but GEQ-005 `deriveManHours` returns `OPEN_INPUT` for unknown quantity/UMH/factors; do NOT assert the 964 result is productivity-verified.

## Verified by lightweight executable inspection during connector work (NOT full npm build)
- Source count: 37+36+35+35=143.
- Status counts: Approval A 102 / Info I 37 / blank 4.
- Source document keys 143; unique type titles 38.
- WBS role-MH lines: 27, sum=964.
- GEQ kernel calls 27 B1 rows and 143 document rows, each `OPEN_INPUT` until input evidence supplied.
- Dynamic model validation: 02 rules VAL-01 PASS_SOURCE_IDENTITY_ONLY, VAL-02 TRACE_BOUNDARY_PARTIAL, VAL-03 OPEN_REVIEW_CYCLES, VAL-04 OPEN_PRODUCTIVITY_AND_ROLE_RATES, VAL-05 PASS_SOURCE_RECONCILIATION.

## Protected pricing / baseline state untouched
- B1 Rev05 Engineering **964 MH / THB510,000 Working SELL**.
- B2 Rev05 Documentation **THB580,000 Working SELL**.
- Alternative B2 **THB200,000 MANAGEMENT SCENARIO**, not approved sell and never auto-promoted.
- B3 Rev05 Bangkok consolidated Integrated FAT plus offshore SAT/Commissioning **THB2,109,600 Working SELL**, remains exactly unchanged.
- Known ADDVALUE working SELL subtotal **THB3,804,160**; not overall A+B+C, not Direct Cost, no cross-basis additions.
- Direct Cost of B1/B2/B3 is **NOT ESTABLISHED**. No changes to protected Part A/B/C price manifest.

## Build / local proof
From repository branch root:
```powershell
git pull --ff-only origin fix/pj2608-0553-scope-mgw-r2-integrated-20261015
cd frontend
npm run validate:0553-b1-b2-equation-execution
npm run validate:0553-bc-working-cost-lines
npm run validate:0553-bc-turnkey-contract
npm run build
npm start
```
The new validator is part of `npm run build`. A GitHub connector-only static audit is not equivalent to running local npm.

## B3 NEXT — handoff checklist
1. Keep engineering and documentation scopes **non-additive** across B1/B2 and B3 test labor. FAT/SAT Reports are VDRL source slots B2 document control; actual physical test generation, signoff, punch & re-test are B3/OEM. Do not repurchase OEM factory test services already embedded in Part A.
2. Use sources MR0001–4 §7.2–7.5, §9 Inspection & Test Plan; BOD Rev.C2 §§10/11; SPE-C2; 10008-STD-6-INT-001. Reconcile test notification conflict 30 vs 14 calendar days by controlled contractual decision, not overwrite.
3. OEM factory pretest at its premises distinct from agreed integrated SAMTEL **Bangkok FAT** (WBS 8 team-days × THB18,000 = **THB144,000**).
4. Offshore **five trips, 39 team-days (two people = 78 person-days) × USD800 × working FX31.5 = THB1,965,600**. The 39 team-days ALREADY contain 10 MOB/DEMOB, 26 technical SAT/COMM, 2 integration, 1 Brownfield transfer, so never add them again.
5. Bind each independent ITP hold/witness/test point to Test Event Key (System/Equipment, FAT vs SAT vs COMM, location, date, approved procedure, responsible team, equipment, physical evidence, source); source status may be `OPEN`.
6. Apply existing `GEQ-005/006/007/013/016/017/018/023`, `PEQ-B3-001…011` and cost owner rules to derive independent duration, staff, cost and commercial treatment. Never infer actual staff salary or OEM external rates.
7. Separate OEM-attributable rework, customer variation, client witness, travel/permit and exceptional retesting. Validate exact B3 source price vs independent calculated budget side-by-side.
8. Publish B3 comparison as read-only until HUC/POB/ITP/SIMOPS/routes/actual internal cost rates are source confirmed.
