# PJ2608-0553 — NEW CHAT HANDOFF 40
## CFO Cost Ownership, BOD × DTS × SPE × MR → Rev.K WBS, B1/B3/B9 Commercial Status
**Issued:** 2026-10-18  
**Project:** PJ2608-0553 SAMTEL–PTTEPI MM-ZTK Z1F–JUTAL  
**Repository:** `addvalue-genesis/genesis-portal`  
**Working branch:** `feat/pj2608-0553-sat-tools-compliance-revp-20261018`  
**Current scope:** INTERNAL estimating / pre-award, not signed CONTRACTOR–ADDVALUE RACI or PTTEPI-approved costs.  
**Resume priority:** Correct single-cost-owner commercial basis for B1, mandatory B3 and conditional B9. Validate Build and pricing views.

### 1. Instructions to the next assistant
Act as **Principal Telecom Systems Integration Lead + Project CFO**. Read this handoff, the latest GitHub branch code and source documents before further edits. Explain in Thai, present project cost in THB. Do not confuse PJ2608-0553 with PJ2601-0510 or PJ2608-0550.

**Foundational method:** BOD tells what technical functions/acceptance are required, DTS gives measurable equipment parameters/TAG interfaces, SPE/MR prescribe procedures, responsibilities, tools and evidence, **Rev.K WBS describes what actually has to be done**, and the CFO maps each activity to one and only one Cost Owner / expense event / quantity / rate / evidence:
```
BOD + DTS-0001..0004 + SPE + MR-0001..0004
 → Requirement ID + physical function / measurable criteria
 → Rev.K K00–K18 / site / TAG / Test ID / responsible party
 → labor, travel, tools, vendor resources + actual cost-owner
 → Verified Direct Cost vs Budgetary Working SELL vs Conditional vs Contingency
 → Compliance and single-owner reconciliation
```
A mandatory acceptance outcome does **not** imply ADDVALUE must execute every step. `VENDOR` or `CONTRACTOR` in the contract does not automatically mean ADDVALUE; inspect supply/subcontract RACI, MGW and JUTAL scope. Keep source contractual precedence and unresolved differences in evidence rather than inventing approvals.

### 2. Confirmed source documents, direct links
- [BOD `MM-ZTK-1F-GEN-TEL-BOD-0001 Rev.C2`](https://drive.google.com/file/d/1YPVUfUIy8X5lVOHbTcQ3i6J2zc4bLTFQ/view): especially §§10.2–10.5, §11.
- [SPE `MM-ZTK-1F-GEN-TEL-SPE-0001 Rev.C2`](https://drive.google.com/file/d/1pa5Tlqpu65Lv1HDkNSz3XvcDCkpjVGRn/view): §§7.3.1 Factory FAT, 7.3.2 Yard SAT, 7.3.3 Offshore Commissioning, 7.3.4 Site Support, 9 Training.
- [DTS-0001 SCADA Rev.C1](https://drive.google.com/file/d/1hOjBgaJ07PXF6rkep2dzkMXv-pnkQzix/view), [DTS-0002 Trunk/DMR Rev.C1](https://drive.google.com/file/d/1xfUFbik-uEB6cfX04a-opkfeBkZD7I6a/view), [DTS-0003 Ex Phone/Sounder Rev.C1](https://drive.google.com/file/d/1vHFKKvDtkNyXSzGOvKnVAr4azDjnl3WP/view), [DTS-0004 RACON Rev.C1](https://drive.google.com/file/d/1NhRRBC5iaYsAblJdcaZgzw5P1u63f5V8/view).
- [MR-0001 SCADA C1](https://drive.google.com/file/d/1UiabYMc178_X5_AkQsBe6kA0hUJAG5f8/view), [MR-0002 DMR C1](https://drive.google.com/file/d/1Vk8Jv8x9jDb7tMUNh1f7F4EtK6y5u6cm/view), [MR-0003 Ex Phone C1](https://drive.google.com/file/d/1RYFm75mMuLr5brbXjLNu8UWIDUptRP-Q/view), [MR-0004 RACON C1](https://drive.google.com/file/d/17oOEMjDVQy3PgOQYbPYyXyaxk3P_rrNC/view).
- `PJ2608-0553_Integrated_Yard_Precommissioning_Offshore_SAT_WBS_RevK_20261018.md` (uploaded in prior conversation; K00–K18).
- `PJ2608-0553_Yard_Bulk_MTO_Responsibility_MH_RevL_20261018.md` (RACI INSTALL/TEST remains open).
- `PJ2608-0553_Telecom_SAT_Gantt_RevJ_Zhuhai_FAT_DDP_Integrated_Workflow_20261018.xlsx` and SAT Rev.I two-person review; older alternatives 36 vs 40 calendar days conflict and are not man-day approvals.
- Rev.H SAT Procedure / Rev.M–P tool compliance registers from prior project conversation.
- [Legacy Rev05 detailed commercial WBS](https://docs.google.com/spreadsheets/d/1vXwV3py-FwdyvZaNq-OvsDyefZEJKPqz/edit) `19_CN_YARD_WBS`: 12 historical team-days included 2 travel days + 9.5 yard task days + 0.5 standby day. Preserve **as historical comparison only**, not required onsite duration.

**Verified clause nuances:** BOD §10.2 asks **≥30 calendar days** shop witness notification; SPE §7.3 asks **≥14 calendar days**; resolve controlling contractual notice (use stricter 30 provisionally subject to precedence). BOD §10.3 / SPE §7.3.1 make MGW/vendor responsible for FAT procedure, execution and printouts; ADDVALUE 2 paid witnesses + 1 unbilled standby in Rev.K. SPE §7.3.2 **requires Fabrication Yard SAT** using COMPANY-approved manufacturer's procedure and signed reports and mentions sending selected items to ZPQ for final configuration after Yard SAT; **who handles/removes/reinstalls and old TETRA terminology vs current RFI DMR BDA require TQ/RACI**. BOD §10.4–10.5 / SPE §7.3.3 require offshore performance and signed testing. SPE §7.3.4 says *installation excluded from VENDOR scope*, but onshore/offshore support **unit/man-day rates should be offered**; it is **not** mandatory 7/12 days ADDVALUE staff onsite.

### 3. Functional scope × site
- **MR0001 SCADA/WiMAX:** 5.5–5.8 GHz, IP/VLAN, NMS/PLC, throughput, RF measurements; Brownfield ZPQ/ZWP8/ZWP11 and Greenfield ZWP20–23. DTS1 measurement criteria and approved ITP govern, not WBS day counts.
- **MR0002 DMR / RFI BDA:** added BDA at ZWP20/21/22; **ZWP23 only existing radio coverage** (no new BDA). Test actual RF, talkgroup communication, gain/isolation per approved method; no new Motorola repeater in ADDVALUE supply.
- **MR0003 Ex Telephone/Sounder:** ZWP20/21/22/23, SIP/PABX/relay/DCDB/sounder/Ex. BOD/SPE specifically require CONTRACTOR's physical and basic functional tests at Yard before shipment, plus actual Offshore E2E tests.
- **MR0004 RACON:** ZWP20/21/22 only, X/S marine beacon. DTS4 calls D Morse 20s ON/40s OFF; approved marine/radar test per SPE/IALA R.101. Historical ORGA quotation Q vs DTS D needs TQ before acceptance. Never assume Yard self-test replaces vessel-radar offshore acceptance.

### 4. Single-owner bookkeeping, mandatory vs conditional
**Cost object has one accountable owner and is posted once.** Multi-WBS references and witness/execute responsibilities are not additive price.
- **Part A**: MGW/OEM equipment and included factory work/tools, after quote inclusion check.
- **B1**: residual project management, office/admin, lawful authority/regulatory coordination and real indirect expenses not already owned by B2–B14. If a new cost is not yet classifiable, put it in **`B1-PENDING-ALLOCATION` NON-POSTING suspense** only, with source and provisional cost owner; **do not automatically add it to B1 Working Sell**. Transfer to correct code when proven.
- **B2**: document control, VDRL/transmittal/revision/final dossier; not double-count test-team signed report generation.
- **B3**: MANDATORY ADDVALUE offshore SAT/SIT, access/readiness, test execution & temporary rental instruments, subject to contractual boundaries. Relevant Rev.K K14–K18 plus Brownfield survey if contracted.
- **B5** packing, **B6** cargo freight/customs (not crew tickets), **B7** storage, **B8** training, **B10** commissioning spares, **B11** deliverable permanent O&M tools, **B13** consumables, **B14** contract bonds/insurance; no cross-posting.
- **B9**: MGW China FAT **ADDVALUE Witness base** and any **ADDITIONALLY REQUESTED JUTAL Yard specialist assistance**. Yard SAT outcome is compulsory under SPE, but does not require ADDVALUE attend 7/12 days unless signed RACI or written request. No mandatory Yard-supervision price simply because JUTAL fabricates to AFC.
- B9 crew travel insurance/assignment-work cover stays with that crew trip, distinct from B14 contract bond/insurance; check policy scope.

### 5. Latest selected B9 commercial format
**Onshore rate selected by management 2026-10-18: USD 600 per PERSON/day**, working budget FX **31.50 THB/USD** => **THB 18,900/person-day**. Rate is SELL basis; not verified internal payroll cost, and FX is planning basis (not live BOT). **Do not display a separate Per Diem line.**

1. **B9 FAT BASE `THB 226,200` Working Sell pre-award**: 2 ADDVALUE witness staff × 2 estimated FAT days = THB 75,600; 2 people × 2 charged travel days = THB 75,600; two air tickets THB 30k; 6 room-nights THB 15k; visa/work permit reserve THB 8k; local transport THB 8k; travel cover THB 4k; occupational work cover THB 10k. One **BKK–MGW China–BKK trip**. FAT duration 2 days is **scenario only**. MGW executes FAT.
2. **B9 Yard Optional Call-out LS `THB 233,600`**, not in base: **1 Senior Telecom Systems Integration Engineer**, **7 Yard working days**, **2 separately priced travel days**, 9 hotel nights, one **separate BKK–Zhuhai–BKK trip**; THB132,300 professional services + THB37,800 paid travel days + airfare THB15,000 + hotel THB22,500 + local THB15,000 + conditional visa THB4,000 + travel/work insurance THB7,000 = THB233,600. Customer view: **one Lump Sum (1 LS)** inclusive of mobilisation, travel, accommodation and cover, triggered only upon written request/accepted subcontract RACI. The internal day-rate must remain for estimating or SPE §7.3.4 schedule, not detailed customer breakdown. Role is Engineering Configuration, Interface Integration, Troubleshooting, approved as-left changes, vendor liaison and Yard SAT technical support—not physical cable pulling/installation or routine reconfiguration after a passed FAT.
3. **FAT Base + optional separate Yard visit total `THB 459,800`**. Never add both when Yard not called, and reconcile flights/travel days if visits are combined.
4. Prior B9 `THB 574,560` based on 12 × two-person mixed-rate team-days is **SUPERSEDED** for current Rev.K candidate; not additive. Earlier `THB 671,200` combined-trip/12-Day Yard scenario also **SUPERSEDED** for current chosen optional 1-person 7-day LS.
5. **B3 current Working Sell `THB 1,965,600`** = historical Rev05 B3 `THB 2,109,600` minus old **Bangkok FAT `THB 144,000`**. Do not charge MGW China FAT again to B3.
6. **Canonical Part B BASE `THB 4,234,390.69`**, excludes Yard LS; **Part C `THB 4,771,156.05`**, so BASE B+C `THB 9,005,546.74` (historical other B/C figures still contain unresolved completeness issues, do not call approved final quote).
7. **B1 current canonical legacy engineering sell `THB 510,000` remains unchanged** (964 MH Rev05 benchmark, not newly verified PM overhead). New Rev.K office PM proxy 12 unique management events, 56 provisional MH, THB132,300 at USD600/day; NON-POSTING and not additive to B1 baseline.

### 6. Source-led reconciliation and technical hold points
- Confirm signed MGW FAT location, venue and FAT schedule; whether ADDVALUE two attendees actually required by subcontract. Scope handoff currently uses Rev.K MGW China FAT, **DDP Zhuhai Yard**, not older Bangkok FAT/Nantong routes. Avoid old text.
- **Very important:** Distinguish Mandatory **Yard SAT outcome** under SPE §7.3.2 (JUTAL/CONTRACTOR & OEM/vendor according to contracts) from **optional ADDVALUE specialist attendance** under SPE §7.3.4. Do not remove statutory/contractual test simply because FAT passed.
- **7-day Senior engineer LS is pricing proposal, not customer-approved dispatch nor guaranteed 7 required days.** Request written call-out / RACI; separate-trip budget. Senior rate is USD600; no per diem.
- Confirm the post-Yard SAT loose-equipment transfer to ZPQ in SPE §7.3.2 and current DMR vs old TETRA requirement; instrument and operator RACI.
- Confirm BOD 30d vs SPE 14d FAT notice; site acceptance criteria, ITP and witness/signatory.
- Confirm SCADA 5.5–5.8 GHz per DTS, RF analyzer calibration; DMR ETSI/talkgroups; IP sounder relay/acoustics; RACON IALA X/S radar/vessel and D-vs-Q; all test methods and OEM inclusions.
- External airfare/hotel/insurance/visa line rates currently CFO **budgetary sell allowances**, not supplier quotes or verified Direct Cost. Insurance must cover actual technical field work.
- Finance posting guard: one ExpenseID/TripID/PersonID; **B1 Pending Cost Owner suspense is not a release authorization**; no auto WBS sell migration, B9 Yard LS is separate conditional.

### 7. Code files already committed on branch
- `frontend/src/project0553/data/onshoreWorkingRate0553.js` — USD600 person-day authority.
- `frontend/src/project0553/data/b1IndirectCostLedger0553.js`, `b1RevKMilestoneCoverage0553.js`; `B1RevKMilestoneBudget0553.jsx`.
- `frontend/src/project0553/data/b3RequirementWbsTrace0553.js`, `B3RequirementWbsTrace0553.jsx` — 19 BOD/SPE/DTS/MR-to-RevK obligation rows; B9 Yard role conditional, no posting.
- `frontend/src/project0553/data/b3ChinaFatOwnership0553.js` — deduct Rev05 Bangkok FAT from current B3.
- `frontend/src/project0553/data/b9ChinaWorkingBudget0553.js` — B9 FAT base THB226,200 plus optional 1 Sr Telecom Engineer 7-day LS THB233,600, separate China trips.
- `frontend/src/project0553/B9ChinaBudgetDetail0553.jsx` — read-only detail/Module IDs, LS and conditional flag.
- `frontend/src/project0553/data/bcTurnkeyWorkingCost0553.js`, `BcWorkCostLines0553.jsx`, `BcCostEvidenceDetail0553.jsx`, `CommercialWorkspace.jsx` — canonical 10.2 routing, non-double posting and displays.
- Tests: `frontend/scripts/validate-0553-b9-china-budget.cjs`, `validate-0553-b3-requirement-wbs.cjs`, `validate-0553-b1-revk-milestone-budget.cjs`, `validate-0553-b1-cfo-ledger.cjs`.

**Validation status:** GitHub write and selected JS model/number cross-checks passed via isolated JS evaluation. **Webpack build, complete runtime UI and full npm validator suite were not independently run** at this latest tip. Review for stale labels/historical cost evidence in other 10.2/10.5 views. Other working-sell categories can still be incomplete.

### 8. Next chat execution checklist
1. Check `git status` before any pull. Never clean/reset/stash-pop unrelated work; user has a separate PJ2601-0510 branch/worktree.
2. Pull latest branch in dedicated local worktree. Then run tests and `npm run build`; ask for console output if local-only.
3. Check B9 call-out presentation: **customer 1 LS**, internal 7 working days + 2 travel days + cost assumptions, separate trips, 1 Senior Telecom Systems Integration Engineer; 7 days not mandatory.
4. Audit B3 mandatory test scope vs all BOD/DTS/SPE MR clauses and Rev.K WBS at TAG/Site/Test-ID level; incorporate source §7.3.2 Yard SAT RACI without duplicating B9 staffing.
5. Confirm user choice of customer price presentation vs internal sell and do not generate customer quotation until requested.
6. Reconcile B1 not-owned expenses through suspense → exact cost owner once; no duplication with B2–B14.
7. Review B9 7-day engineering work against JUTAL scope / OEM FAT as-left configuration / Yard SAT requests. **Do not manufacture a guaranteed claim that ADDVALUE must be present.**

### 9. Local safe pull and validation commands
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553
git status
git branch --show-current
git fetch origin
git pull --ff-only origin feat/pj2608-0553-sat-tools-compliance-revp-20261018
cd frontend
node scripts/validate-0553-b9-china-budget.cjs
node scripts/validate-0553-b3-requirement-wbs.cjs
node scripts/validate-0553-b1-revk-milestone-budget.cjs
node scripts/validate-0553-b1-cfo-ledger.cjs
npm run build
npm start
```
If checkout/worktree is on a different branch, **do not blindly pull**; first inspect `git status`, worktree list, and branch/upstream.

### 10. Ready-to-paste new-chat resume prompt
> Continue PJ2608-0553 as Telecom Integration Lead + Project CFO. First read `docs/handoff/pj2608-0553/40_NEW_CHAT_RESUME_B1_B3_B9_CFO_COST_SCOPE_20261018.md` from branch `feat/pj2608-0553-sat-tools-compliance-revp-20261018`, then inspect current 10.2 code. Follow BOD + DTS + SPE + MR → Rev.K WBS → Who/What/Where/How → Quantity/Rate/Cost Owner/Acceptance, with no duplicate cost posting. B3 is mandatory offshore SAT/SIT; Yard SAT contract outcome is mandatory under SPE §7.3.2, but ADDVALUE Yard attendance is not automatically mandatory. B9 Base FAT witness THB226,200; B9 Conditional Yard Support = **one Senior Telecom Systems Integration Engineer, 7 working days, separate BKK-China-BKK trip, 1 LS THB233,600** on written call-out. Approved Onshore labor SELL rate USD600/person-day (FX31.5); no separate per diem. Preserve B1 THB510,000 legacy baseline; unowned expenses go first to B1-PENDING-ALLOCATION NON-POSTING. B3 THB1,965,600 after removal of historical Bangkok FAT. Current Part B Base THB4,234,390.69 excluding conditional Yard. Validate source/price/UI/build and proceed with requirement-to-cost coverage reconciliation. Respond Thai and only claim tests actually run.
