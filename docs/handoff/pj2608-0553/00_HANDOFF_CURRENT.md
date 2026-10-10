# PJ2608-0553 — Living Handoff / Bid Delivery Checkpoint
**Status:** INITIAL HANDOFF / SOURCE VERIFICATION REQUIRED
**Project:** PJ2608-0553 — ZM169-RFQ-TE-001 Telecom Package (JUTAL)
**Working branch:** `feat/pj2608-0553-tpp-bid-handoff`
**Inherited code reference:** `feat/pj2608-0550-tpp-ui-rev04` at branch creation; do NOT merge PR #2 or modify 0550 merely to develop 0553.
**Mission:** Reuse proven GENESS/TPP architecture to produce controlled 0553 technical and priced bid deliverables rapidly, without leaking or importing 0550 facts.

## 1. Non-negotiable rules
1. Work on PJ2608-0553 PARTICULAR scope only. PJ2608-0550 is a reference implementation for methodology, UI patterns and generic modules, not an RFQ/quantity/price/vendor/commercial source for 0553.
2. Preserve 0550 code/evidence/history. Refactor shared capability carefully with regression checks; no blind clone-and-rename or redesign from scratch.
3. Evidence classes remain separate: source fact, approved clarification, derived result, assumed/TBC, conflict, superseded and model logic.
4. TBC/OPEN/missing source is NOT zero. Never fabricate quantities, engineering hours, rates, exchange rates, offers, manufacturer authorization or reconciliation lines.
5. Full cost lineage: Source → Requirement → Constraint → Proof/CAL-RPT → Work/Physical Object → Driver → Qty/MH/MD → Unit/Rate → Cost → Commercial Treatment → Risk/Confidence.
6. Keep COMMON/GENERIC knowledge and equations separate from PARTICULAR project facts. No 0550-to-0553 data cross-contamination.
7. Keep Working Preview, issued Budgetary and Released Customer Output as separate immutable revisioned states. Any issued artifact remains frozen.
8. No production/public deployment, no email submission, no PR merge, no customer release without explicit approval.
9. All bid outputs must be reproducible, source-linked and human-reviewed; don't claim compliance or specific lead times without controlling evidence.
10. Audit tables: visible borders, readable text, collapsible groups, full original source detail, TH/EN when useful, exports to Excel/Word/PDF as demanded.

## 2. Source-of-truth reading order
FIRST read:
1. `docs/handoff/pj2608-0553/11_NEW_CHAT_RESUME_PROMPT.md` (this handoff's starter)
2. `docs/handoff/pj2608-0553/00_HANDOFF_CURRENT.md` (this checkpoint)

THEN read inherited architecture from THE SAME 0553 working branch, in this exact order:
3. `docs/handoff/pj2608-0550/11_NEW_CHAT_RESUME_PROMPT.md`
4. `docs/handoff/pj2608-0550/00_HANDOFF_CURRENT.md`
5. `frontend/src/project0550/architectureManifest.js`
6. `frontend/src/project0550/moduleRegistry.js`
7. `frontend/src/project0550/projectFacts.js` (structure only; never carry facts into 0553)
8. `frontend/src/project0550/data/snapshots/pj2608-0550.rev07.json` (schema/control patterns only; never inherit values)
9. `frontend/src/project0550/serviceEquationModel.js`
10. `frontend/src/project0550/b1CostLineage.js` (audit design only; never use B1 amounts in 0553)
11. `frontend/src/knowledge-kernels/library.js`
12. `frontend/src/project0550/knowledgeKernelBinding.js`
13. `frontend/src/knowledge-kernels/regulatoryMyanmar.js` (country knowledge not automatically applicable to 0553)
14. `frontend/src/project0550/regulatoryBinding.js` (0550 particular facts—do not copy)
15. `frontend/src/pages/PJ26080550.jsx`
16. `frontend/src/project0550/data.js`
17. `frontend/src/App.jsx`, `frontend/package.json`, `frontend/webpack.config.js`, `frontend/src/project0550/project0550.css`, validation scripts and export code.

AFTER architecture: locate and read ORIGINAL 0553 RFQ and all active revisions (commercial instructions, MR, specs, PHI, BOD, drawings, MTO, technical bid templates, scope split, vendor quotations/TC, VDRL, bid clarifications/deviations and checkpoint state), from approved 0553 project sources. Link every factual entry to exact source ID/path/revision. Do not silently substitute 0550 documents.

## 3. Tender alert — from supplied email screenshot; verify original thread and tender attachments
JUTAL email concerning `ZM169-RFQ-TE-001 RFQ for Telecom Package` states:
- Closing: **14 Oct 2026, 17:00 Beijing time** (16:00 Thailand time).
- Submit **Priced Commercial Proposal** and **Technical Proposal (unpriced for TP)**.
- Send submission email **only** to tender inbox `Z1EASKbid@jutal.com` **without CC/BCC**; verify address and recipients against original email before sending.
- Only **one round of quotation** is permitted.
- After submitting, separately send a **formal notice without attachments** to purchasing engineer and CC named persons per original email instructions. Validate names/addresses from original email, not this paraphrase.
- Include payment arrangement, delivery period, delivery mode, detailed itemized quotation, spare-parts inventory, matching spare-parts quotation and manufacturer authorization letter. Use own supply-scope template as allowed.
- DO NOT assume a bid was already submitted. Verify tender time-zone and any amendments/extensions against latest written instructions.

## 4. Target architecture and project isolation
`COMMON Knowledge → GENERIC DOMAIN → PARTICULAR PJ2608-0553 → Evidence/Requirement → Proof → MTO/Quantity → Execution/WBS → A/B/C Estimate → Risk/Compliance → Budgetary/Release`

Reuse (after validation): engineering law kernels, service equations, calculation lineage, traceability schema, module registry principles, grid table/collapse/display patterns, document lifecycle model, cost/export approaches.

Implement isolated 0553 PARTICULAR modules, controlled data snapshot, repository facade, project facts, requirement registry, compliance/deviation register, vendor/authorization tracker, 0553 UI route and deliverable export controls. Prefer shared components rather than importing the 0550 entire screen/data facade. Proposal code location: `frontend/src/project0553/` and `frontend/src/pages/PJ26080553.jsx`; verify repository conventions before changes.

Retain 0550 `/projects/pj2608-0550` and existing module behavior. Implement distinct `/projects/pj2608-0553` only after isolation. For any COMMON extraction, run both-project regression/validation.

## 5. Urgent delivery workstream
P0 (immediate): RFQ ingestion & deadline control; scope/system index; authoritative amendment priority; responsibility / exclusions; technical vs commercial compliance; manufacturer authorization; bid packaging/gates.
P1: 0553 project dataset/evidence registry and original→requirement→system trace, including source location/version/owner/open items.
P2: Source-based A/B/C quantity and vendor estimates, calculate MH/MD only with grounded drivers; separate internal cost, customer unit/sell and contingencies; perform currency conversion from explicit rate/date/source only.
P3: technical proposal UNPRICED; priced commercial breakdown; spare inventory/pricing; delivery/payment/mode; deviation/clarification and final submission checklist.
P4: UI enhancement/exports, validation, review, local run, immutable customer release after explicit approval.

**Critical path:** maximize compliant deliverables before 14-Oct cutoff; defer cosmetic improvements or long refactor if they threaten bid readiness. A beautiful UI without signed-off bid documents is not completion.

## 6. Engineering/cost controls
- System count or make/model in 0553 must be verified from its RFQ; do not automatically inherit 0550's 19-system list or vendor selection.
- Use parametric methodology but do not inherit 0550 monetary allowances (e.g. B1 THB 24M), 0550 PAGA offer, or 0550 prices/FX.
- Scope ownership: bidder, EPC, customer, OEM, specialist, installers, field teams, subcontractors separately established by 0553 contract sources.
- Equipment vendor labor cannot be double-counted as ADDVALUE service; tie FAT/IFAT/SAT/precom/commissioning/training/logistics/spares to scopes and drivers.
- Keep C1 optional/TSI-scope decisions project-specific; no generic inference.
- Technical decisions must identify missing CAL/RPT/STD proofs, constraints, acceptance criteria and deviation exposure.
- Every estimate exposes quantities, unit price, cost, gross margin/markup treatment, currency, exchange source/date, revision, source and confidence.
- No unsupported line gets zero pricing or declared compliant.

## 7. Acceptance / quality gates
1. 0553 evidence and requirement manifest exists; all active RFQ package documents indexed, source gaps called out.
2. Scope matrix by system and bid ownership exists, with vendor/make evidence and unresolved items.
3. Technical proposal is genuinely unpriced (including appendices and hidden sheet content); commercial submission is price-controlled and reconciled.
4. Bid terms/delivery/spares/authorization/deviations have explicit owners and source records.
5. System/work/cost totals calculate without hidden forced balancing or 0550 fact leakage.
6. Existing 0550 validation/build/UI remain working after any shared-code changes.
7. React build and project-specific tests pass; terminal commands and commit SHA are recorded.
8. Any issued version has revision, release checklist and immutable source snapshot.
9. No merge, submission or deployment without explicit user approval.

## 8. Current known status / unknowns
- From GitHub check before handoff creation, no `docs/handoff/pj2608-0553/00_HANDOFF_CURRENT.md`, `11_NEW_CHAT_RESUME_PROMPT.md`, `frontend/src/pages/PJ26080553.jsx`, or `frontend/src/project0553/data.js` existed on source branch `feat/pj2608-0550-tpp-ui-rev04`.
- 0550 source branch is known functional at `localhost:3000/projects/pj2608-0550` based on user's screenshot, but 0553 runtime does NOT yet exist or claim validation.
- Existing 0553 Drive/RFQ and alternative GitHub branch states have not yet been comprehensively audited. First operation in new chat must inspect them and reconcile. Do not assert that all 0553 data is absent.
- The tender email screenshot is a working input, not a replacement for current authenticated original instructions.

## 9. New chat work instructions
Use `11_NEW_CHAT_RESUME_PROMPT.md`. Start with an audit that identifies exact reuse candidates, 0553 sources, deadline blockers, and specific next code edits. Prioritize submission deliverables. Keep architecture and history documented and update this handoff after material changes.


## 10-Oct-2026 Working Review Rev01 — new chat continuation
- Source root verified: https://drive.google.com/drive/folders/1TlSeRQuYAUjhYI3Yt7y47TdW7A9JSSiv
- Original JUTAL `0-Instruction to Bidder.docx` located at Drive ID `1dyMxfGxL7k9JvxeaRk2oN5HEdMtP44Rl`. It states 08-Sep-2026 17:00 deadline, TECHNICAL + UNPRICED FIRST, and priced hold pending further notice. Later tender screenshot summarized in this handoff says 14-Oct-2026 17:00 Beijing and priced + technical; original amendment/new email **NOT YET AUTHENTICATED**, so this conflict blocks release.
- Latest located working MTO: `PJ2608-0553_MTO_MR0001-0004_SUBMIT_Rev04_20261006-Update.xlsx` Drive ID `1o1UIsUw8JQtUt2yk4S8graNpIkNQCq8h`, four system tabs and delivery/FAT basis.
- Latest located SAMTEL TC follow-ups: TC-0001..0004 dated 05-Oct-2026 in Drive folder `1DC7PcYSgSkrISy_Q2055Nl93M3TxxS5g`.
- SAMTEL commercial checklist working file Drive ID `1yxRC5iCIKolXHHi_R0qsrE2_4wAJzzXT` contains 40-week overall delivery and CIF Zhuhai; MTO Rev04 contains per-MR DAP Nonthaburi and varying supplier lead times. This is a reconciliation item, not an assumed binding commitment.
- Existing Rev09 unpriced package is PREPARED NOT SENT; priced package HOLD DO NOT SEND. Internal pricing Rev09 remains estimate-only, no automatic customer release.
- Added isolated files `frontend/src/project0553/projectFacts.js`, `evidenceRegistry.js`, `bidReview.js`, `project0553.css`, `frontend/src/pages/PJ26080553.jsx`, and only additive 0553 route/nav in `frontend/src/App.jsx`.
- UI route: `/projects/pj2608-0553`; review gates G-01..G-12 show open/hold/conflict and source locators; no amounts or inferred compliance. Code readback verified, source-branch compare ahead/0 behind; local webpack build and end-to-end validation **NOT YET RUN**.
- Priorities: authenticate latest JUTAL email/amendment and submission routing; line-level MTO/TC/CCL reconcile; manufacturer authority and spare pricing; generate technically screened UNPRICED and controlled PRICED bid; execute validation and build before any release.
- Do not merge PR #2, submit email, deploy or release without approval.


---
## 2026-10-10 Living Handoff Update — ACTIVE CURRENT STATE (supersedes outdated status claims above)

**Branch:** `feat/pj2608-0553-tpp-bid-handoff`; **code baseline / last verified user build:** `73ffda7579e806d73e92ed1e21ecf8e703253912` (latest engineering reconciliation commit). The exact HEAD after this documentation update is a later commit; run `git rev-parse HEAD` after pull to capture it. **DO NOT** treat historic statements above such as "0553 UI not implemented" or "build not run" as current.

**User verification:** User ran `npm run build` on 10 Oct 2026, all 14 sequential validators reported PASS, webpack 5.111.1 compiled with 3 non-blocking bundle-size warnings; JS about 579 KiB and CSS about 29.8 KiB. This verifies code/test execution, NOT complete customer engineering compliance, all-vendor quotation completeness or customer-ready release.

### Architecture / module registry (actual paths on branch)
- UI: `frontend/src/pages/PJ26080553.jsx` -> `frontend/src/project0553/CommercialWorkspace.jsx` -> `CommercialSystemBreakdown.jsx`; 0550-style collapsible 4 MR groups and quote/equipment drilldown. Tabs via common project shell. 0553 at `/projects/pj2608-0553` (local Port 3001); 0550 independent Port 3000.
- Data read: `frontend/src/project0553/data/repository.js` -> `adapters/controlledSnapshotAdapter.js` -> `validateDataset.js` -> combined `data/controlledSnapshot.js`, `data/snapshots/pj2608-0553.working.json`, `mto.rev04.summary.json`, `data/supplierQuoteLines.js`, `data/quotes/NG-260916-ADV-DAP1.full.json`.
- The 0553 runtime is **CONTROLLED JSON + JS Snapshot**. `sql=NOT_YET_CONNECTED`, `agerp=NOT_YET_CONNECTED`. Never claim MariaDB persistence or sync. GitHub JSON is source-controlled; original PDF/Excel from project Drive remains authoritative evidence.
- COMMON calculations: `frontend/src/common/engineering/rfPropagation.js`, `seaReflection.js`, `lnaCascade.js`, `physicalBomDerivation.js`, `requiredOfferedReconciliation.js`; `frontend/src/common/cost/derivationKernel.js`, `commercialCurrency.js`, `serviceEquations.js`. Master inventory includes 27 engineering law definitions + 18 service equations, but execution coverage is partial.
- 0553 project bindings: `project0553/data/scadaLinkEvidence.js` (RPT Rev.C1 five links), `MR0001RFProofPilot.jsx`, `MR0002LNACalculation.jsx`, `MR0002PhysicalBom.jsx`, `data/layoutGeometryEvidence.js`, `data/scadaOfferReconciliation.js`.
- Commercial: `commercialWorkbookControl.js`, `data/rev08CommercialBaseline.js`, `CommercialWorkspace.jsx`; three-state doctrine WORKING/BUDGETARY/RELEASED + recipient separate. No JUTAL released offer, no live XLSX 6-sheet export yet.
- Reference 0550 architecture: `frontend/src/project0550/data/snapshots/pj2608-0550.rev07.json` (internal dataset ID Rev10), `data/adapters/controlledSnapshotAdapter.js`, `data/repository.js`, `data/validateDataset.js`, `data.js`; 0550 original branch MUST remain untouched. 0550 cost rates, pricing, PAGA vendor data, quantity and currency are forbidden as 0553 facts.

### Vendor / commercial source truth and decisions
- Next G quote `NG/260916-ADV-DAP1`, 16 Sep 2026, DAP Ranong, 100% advance, 22–24 weeks; quoted total USD **191,610.15**. All **53 BOQ rows** now in `NG-260916-ADV-DAP1.full.json` (groups A12/B13/C12/D8/E8). Group D/E spare, do not double count. Five Region Code prices are source dashes and stored as null, not zero. Quote validity expired 01 Oct 2026; refresh. Source PDF Drive ID `1dwU6mkjm0JOKvbw3fMeCH8alQtKufEyd`.
- VST ECS Cisco `A-0048/2026_Re1` dated 09 Sep 2026: THB **2,117,650 before VAT**; line source register presently partial. Quote validity ended Sep. PDF Drive ID `1uURv0sg0joJlnKXi3Wdv3cGmOB1fWVYC`.
- Prosper E&T `Q-PROSRY-24051`, THB 2,286,700 ex VAT; **Zawtika 1E 2024 historical reference only**, not 1F price. PDF `1QMh4V9S7FxnwkpRO7BQ_jThDlDS-qfpD`.
- Simplicity `ST2407073`, THB 11,750 ex VAT, MTL ZB24597; **2024 historical reference only**, PDF `1I1vNvzP3oSaOaD8Fn3bOSd6N8CVjcizi`.
- MGW cross-system P26-058 USD 273,519 is **multi-MR, unallocated**, cannot assign full price to any one MR. Additional MRs 0002–0004 vendor sourcing remains incomplete.
- `4-Scope of Supply.xlsx` Rev08 is customer-selling **historical baseline**, 6 sheets: Scope of supply, B10 CommSpares, B11 SpecialTool, B13 Consumerables, C1 CapitalSpares, C2 2Y-Spares. Base A+B USD **1,684,901.16**, optional C1+C2 USD **151,465.27**, not adopted current revised JUTAL selling price. Source Drive ID `1KSfxvPfgS8XcvwaQUeacmgdX32yobwVk`. Detail/summary controls presently preliminary, original SAMTEL-issued revision still must be authenticated.
- FX: USD/THB view implemented; conversion only when numeric THB/USD, date and attributed source exist. Original currency and quote line totals never overwritten. Unverified 31.5 is working-only, NOT certified BOT FX. Avoid applying 0550 FX to 0553.

### Engineering source and required decisions
- MR0001 SCADA radio: MTO Rev04 source Drive ID `1o1UIsUw8JQtUt2yk4S8graNpIkNQCq8h`; current repository has only **42-row summary / equipment families**, not full SKU/Tag quantities. Five paths from RPT-0001 Rev.C1 / Pathloss 6: ZWP8→ZWP20, ZWP11→ZWP21, ZWP8→ZWP22, ZPQ→ZWP23, ZPQ→ZWP8; independent FSPL and preliminary sea-tide geometry are NOT OEM Pathloss availability certifications. Check base/subscriber/PTP Qty, 90° vs 60° sector, antenna frequency/model, Myanmar region licence/options, 12/48-month warranties, Zone 2, enclosure, surge, feeder/cable/bulk, spares, brownfield ownership.
- `requiredOfferedReconciliation.js` + `scadaOfferReconciliation.js` only demonstrate controlled model/quantity comparison. Because required itemized MTO has NOT been extracted, requiredQty and accepted cost remain OPEN/HOLD. Test gates pass synthetically; do NOT advertise real SKU reconciliation.
- MR0002 DMR LNA: RFI RX3852 candidate 380–520 MHz, ≤2 dB NF and up to 40 dB gain; Friis calculation implemented but receiver/cable/filter inputs and vendor approval missing. LAY Rev.C1 has reference elevations 21.1/21.3 vs 18.3 m (2.8/3.0 m difference) only, NOT certified cable routes. Complete cable/connector/JB/gland/Ex certification and quantity derivation still pending.
- Engineering discipline: source 0553 project MR/BOD/SPE/DTS/RPT/CAL/BLD/LAY/MTO/TC first; reuse other projects as METHOD/reference only; use formulas, standards, OEM documentation and explicit uncertainty; never guess absent quantities or equate 'OPEN' to zero. Maintain Source→REQ→Constraint→CAL/Proof→Object/Interface→Required Qty→Offer Mapping→Cost→Sell→Workbook Cell.

### Urgent next tasks, in dependency order
1. Authenticate current JUTAL ITB amendments and closing/submission directions (original 08 Sep instruction conflicts with reported 14 Oct Beijing extension). No release without confirmation.
2. Parse ALL individual rows of 0553 MTO Rev04, MR0001 equipment and platform locations, BLD/LAY/STD for licences/enclosures/cable/bulk; create **Required BOM controlled JSON** and quantify with First Principles. No arbitrary required quantity.
3. Map all 53 NG BOQ rows and full Cisco (incl zero-price tracking/licence lines) and remaining supplier offers to required objects; audit include/exclude/alternate/spare/duplicate and technical licence, bands, Ex requirements.
4. Complete vendor quotation ingestion for MR0002–MR0004; verify expired quotes and external engineering cost. Reconcile engineering deliverables and scope ownership.
5. Derive costs using COMMON equations, trace FX source/date, scoped MH, transport and margins; isolate price Rev08 as history, calculate working revised sell without forced balancing.
6. Reconcile all six 0553 customer workbook sheets; implement validated six-sheet Excel customer export, preserve SAMTEL historical issue; explicit approval gate before JUTAL release.
7. Prioritize submission deliverables over UI polish. Standard display is bordered hierarchical tables with +/− and USD/THB; no long vendor card stacks.

### Validation / worktree
`J:\\DEV\\GitHub\\addvalue-genesis\\genesis-portal` uses 0553 branch and Port 3001; `genesis-portal-0550` uses 0550 branch and Port 3000. Latest user build after `73ffda7`: 14 validation scripts PASS and webpack compiled with 3 size warnings. Command: `cd frontend; npm run build`. Release gates not met. Commit and revalidate after edits.


---
## 2026-10-10 Resume Audit — code + Drive source re-verified

This audit is additive and controls where it is more specific than earlier historical notes.

### GitHub/runtime verification
- Working branch remains `feat/pj2608-0553-tpp-bid-handoff`; no 0550 branch was modified.
- Compared with checkpoint commit `5aa426762a932a86d0ec66f0fa7d69f6ef708122`, the branch is **ahead by 1 / behind by 0**. The only changed file reported by the compare was `docs/handoff/pj2608-0553/12_MACHINE_STATE.json`.
- Connector review confirms the active data path is still `repository.js -> controlledSnapshotAdapter.js -> validateDataset.js -> controlledSnapshot.js`, with `CONTROLLED_JSON_SNAPSHOT`; SQL and AGERP are not connected.
- `scadaOfferReconciliation.js` deliberately carries `requiredQty:null` and `selectedPartNumber:null` for MR0001 because the code snapshot still contains only MTO equipment-family summary. This is a fail-closed control, not missing logic to be replaced by guessed quantities.
- `CommercialSystemBreakdown.jsx` correctly displays Rev08 only as historical customer sell and keeps Verified Direct Cost = OPEN.
- `requiredOfferedReconciliation.js` blocks accepted quote cost until engineering state is `ACCEPTED_ENGINEERING` and technical approval is `VERIFIED`.

### Authoritative Drive evidence re-verified
- Original `0-Instruction to Bidder.docx` (Drive ID `1dyMxfGxL7k9JvxeaRk2oN5HEdMtP44Rl`) was re-read directly. It states closing **08-Sep-2026 17:00**, submit **technical bid including unpriced commercial bid**, and **do not submit priced bid until further notice**. It also requires DDP Zhuhai Jutal Yard pricing under Incoterms 2020, minimum 90-day price validity, four-year spare-price validity, site-service rates where required, explicit deviations, and manufacturer identification for non-self-produced items.
- This direct read does **not** authenticate the later reported **14-Oct-2026 17:00 Beijing** instruction. P0-ITB therefore remains OPEN and customer release remains blocked until the later email/amendment is authenticated from the original thread/attachment.
- `PJ2608-0553_MTO_MR0001-0004_SUBMIT_Rev04_20261006-Update.xlsx` (Drive ID `1o1UIsUw8JQtUt2yk4S8graNpIkNQCq8h`) was re-read directly. The workbook contains actual line-level/item rows and scope text beyond the source-controlled summary JSON; therefore the next engineering task is **ingestion/reconciliation of existing source rows**, not invention of quantities.
- The Rev04 delivery/FAT basis in the workbook is MR-specific: MR0001 22–24 weeks DAP Nonthaburi; MR0002 delivery TBC pending formal supplier quote; MR0003 16 weeks ARO DDP Nonthaburi subject to supplier shutdown condition; MR0004 8 weeks if stock / 28–30 weeks if not, FCA factory with onward freight separate. These are working supplier-backed bases and must not be silently replaced by the CCL 40-week/CIF-Zhuhai draft.
- The MTO scope text explicitly includes spares, special tools, inspection/testing, VDRL documentation, packing/transport, warranty, import/type approvals and licence responsibilities as applicable. These must be mapped through Requirement -> Physical Object/Work -> Qty -> Offer -> Cost -> workbook lines, not treated as generic zero-cost inclusions.

### Immediate resume point
1. Preserve the current fail-closed architecture.
2. Parse the complete Rev04 workbook rows for MR0001 first, retaining row/tag/platform/source references.
3. Build a controlled Required BOM JSON with explicit source lineage; derive quantities only from source rows + engineering constraints/proofs.
4. Reconcile NG 53 lines and complete Cisco quote ingestion against that Required BOM; keep alternatives/spares/licences separate.
5. Extend the same method to MR0002–MR0004.
6. Authenticate the later JUTAL amendment before changing release/submission rules.
7. Only after engineering reconciliation: derive current cost, sourced FX, margin/sell and the six-sheet workbook. No forced balancing, no phantom zero, no automatic release.


## 2026-10-10 P0-MTO MR0001 ingestion checkpoint
- Direct Drive Rev04 SCADA Radio worksheet text imported into `frontend/src/project0553/data/snapshots/mr0001.mto.rev04.sourceRows.json` as **42 actual source item rows**, with original item/quantity/description, site, delivery/licence/approvals metadata and source extraction row index. Platform breakdown: ZWP20 8, ZWP21 8, ZWP22 8, ZWP23 6, ZPQ 3, ZWP8 5, ZWP11 4.
- Source data is **not yet accepted Required SKU BOM**: set/lot counts do not certify physical component counts. Grouped multi-code source rows 31,39,43,45,49 require engineering split and validation against native workbook. In particular, keep every `skuRequiredQty:null`.
- Bound source rows to the existing controlled snapshot/repository; added fail-closed dataset checks (42 rows, source lineage, no guessed SKU quantities).
- No Next G/Cisco accepted allocation or current sell was created, no customer artefact released, no 0550 branch modification.
- Need user local `npm run build` after pull; do not claim build or validators were executed for this new commit.
- Next: native worksheet physical-row check, group split, requirement links/site/CAL/BLD/TC mapping, exact vendor quote reconciliation and gap approval.


## 2026-10-10 Commercial UI state separation refactor
- `CommercialWorkspace.jsx` now conditionally displays **Working** engineering/cost/Rev08 historical detail ONLY in Working Preview; **Budgetary** displays an explicit unverified/frozen-snapshot registry, not live Rev08 prices; **Released** displays G-01..G-12 release gates and HOLD, with working prices hidden.
- View-mode selection remains read-only; selecting Budgetary or Released does not issue a snapshot or invoke a commercial approval transition.
- No price, quote, FX, workbook release or customer-issued revision invented. The original 0553 commercial transition function remains intact for a later controlled approval workflow.
- 0550 branch and source data not modified. New commit requires user-local `npm run build`; no current-build PASS claimed for this change.


## 2026-10-10 JSX build failure hotfix
- User's `npm run build` on branch HEAD `4e731c3` ran all 14 validation scripts PASS but webpack **FAILED** on `CommercialWorkspace.jsx` line 85: unmatched JSX Fragment `<>` / section closing tag. This overrides any older claims of successful build for that commit.
- Hotfix commit `57db7b0e910d568a157bd1dce1f1cedbb31ea745` removes the premature `</section>` before `</>}` and closes the outer workspace section after the release checklist; no changes to prices, data, commercial states, or protected 0550 branch.
- Build for this hotfix is **PENDING LOCAL VERIFICATION**, not yet PASS. User has unrelated unstaged modification `frontend/package-lock.json`; do not discard it without inspection/approval.


## 2026-10-10 Commercial JSX correction (second hotfix)
- User's build log confirms the `CommercialWorkspace.jsx` line 85 parse failure persisted following first hotfix. GitHub readback proved the premature `</section>` was still present immediately before `</>}`. First hotfix `57db7b0` was insufficient.
- Corrected exact line by removing the stray closing `</section>` after the Workbook source paragraph, leaving `</>}` to close the Working fragment and the two legitimate closing sections at the end. Fix commit `87c92e1568ecc6fbbf4879d2400d7b0798516dd1`; GitHub readback verified the exact adjacent lines.
- Full webpack build after the second hotfix is **PENDING USER LOCAL RUN**. Do not assert PASS until tested. No protected 0550 changes, no commercial release or price changes.


## 2026-10-10 MR0001 Source-First Required BOM Derivation — Working Implementation
- Added `frontend/src/project0553/data/mr0001RequiredBomDerivation.js` to bind MTO Rev04 source item rows (42), seven platforms, RPT Rev.C1 five topology links, and explicit engineering proof/missing drivers. Output is **requirement/BOM candidates**, NOT accepted manufacturer SKU quantities.
- Added an expandable engineering requirement table in `CommercialSystemBreakdown.jsx` BEFORE vendor quote comparisons. Per-row source, original MR Set/Lot, platform/links, grouped multi-code flag, unresolved engineering proof, MH/Cost/Sell HOLD are exposed.
- Added `scripts/validate-0553-required-bom.cjs` and wired it into `frontend/package.json` build chain. This guard verifies source row count/platform count/multi-code markers and fail-closed cost/SKU semantics. It is not an RF engineering compliance test.
- Reused existing project-specific RF link evidence and shared methodology without modifying protected 0550 branch. No invented radio/antenna SKU selection, RF licence, service rate, MH, FX or price; NG/Cisco remains separate quoted evidence. The model does **not** yet prove complete MR compliance or enough scope for customer pricing.
- Next: authenticate native MTO row indices and split multi-code rows; link specific MR/SPE/DTS/BOD/STD/BLD/CAL/TC requirements with precedence; derive functional installed objects + full cable/connector/gland/Ex and service WBS quantities; reconcile quoted items and commercial rules, then release only after engineering and management signoff.
- GitHub readback only; new user's `npm run build` required before claiming validation PASS.

 
## 2026-10-10 Next G / AVIAT OEM-level bid evaluation checkpoint
- Added `data/aviatTechnicalBidEvaluation.js`: bidirectional technical-review candidates for all 53 original Next G lines, including function/possible scope owner, offered qty, spare separation, hold and missing approval. **No manufacturer compatibility verification has been claimed**; rows remain candidate mappings.
- Integrated reverse technical evaluation ahead of vendor priced BOQ in `CommercialSystemBreakdown.jsx`. Existing source-first MR0001 Required BOM remains authoritative; offered quantities cannot set required quantities.
- Key independent review flags: RPT 60-degree sector vs BOD / vendor 90-degree sector, region code Myanmar applicability, two base stations vs five links and capacity, site PoE/power, North America cord applicability, 12/48-month warranty overlap, RF filter/mount/surge/cable double-counting boundaries, expired quote and delivery term.
- `validate-0553-aviat-review.cjs` added to build chain: source quote line coverage and fail-closed statuses; **this is a static regression guard, not OEM acceptance**.
- Source: `NG-260916-ADV-DAP1.full.json`, `scadaLinkEvidence.js`, MR0001 MTO Rev04. Required qty, accepted equipment, services MH, internal cost and sell remain OPEN/HOLD. JUTAL technical and commercial release prohibited pending gates and written approval.
- User-local `npm run build` pending for this commit. Protected 0550 untouched.


## 2026-10-10 AVIAT D/E Spare Validation Hotfix
- User build failed in `validate:0553-aviat-review`: `Unclassified NG quotation line: D-1`. The prior validator incorrectly required a literal quote-line code in the base function map, while groups D/E intentionally represent spare copies of original A/B/C equipment.
- Corrected OEM evaluation to inherit *function labels* for 16 D/E spare lines by exact `partNumber` matching against the 37 A/B/C lines. Spare quantity, allocation, technical acceptance, and cost remain independent and HOLD; no base-cost double count.
- Corrected validator: explicitly checks the 37 base line codes and requires all 16 spare SKUs to match a base-source SKU; checks that classifier uses the exact-SKU approach. Connector-side data check: 53 total, 37 base, 16 spare, 0 unmapped spare SKUs, 0 unmapped base codes.
- Commit `75045be` corrects model and `71e2a38` corrects test. **Local npm build remains pending** for updated branch; no customer release or 0550 modification.

 
## 2026-10-10 MR0001 Equipment Package Composition phase
- Added `data/mr0001PackageComposition.js`: a 1:M functional-composition candidate model for each of the 42 MTO source rows, referencing existing source-first MR BOM and all Next G A/B/C candidate function labels. 1 MR Set/Lot is NOT 1 OEM SKU; no adopted selected offer, item quantity, cost or sell.
- `CommercialSystemBreakdown.jsx` now has a +/- MR Package Composition table before the older family-only reconciliation and supplier quotation. Site, source codes, source Set/Lot, engineering functional components, quantity drivers, possible Next G quote lines, quote-wide quantities and review gaps are visible.
- Component candidates are non-exclusive and intentionally **NOT allocated** to packages/site/interfaces; displaying a quote line more than once does not duplicate cost. Shared physical ownership and interface-level requirements remain OPEN.
- WBS service candidates cover RF engineering, interfaces, FAT/SAT and logistics/licences with equations and null MH/cost until evidence is confirmed.
- Added `validate:0553-package-composition` static guard to build; real OEM compliance and numeric engineering derivation remain open. This stage provides auditable FUNCTION candidates, not a complete engineered physical BOM or approved price.
- Next: verify native MTO grouped rows, one-to-many exact equipment composition, site-link-to-OEM role, CAL/RPT, antenna sizing, RF cables/interfaces, field/service MH/rates and supplier quotes; record gap, overlap, acceptance decisions with sources. No 0550 modification, release, deployment or submission. Build pending user's local verification.


## 2026-10-10 MR0001 topology quantity audit
- Added `data/mr0001TopologyQuantityAudit.js`, derived from five RPT-0001 Rev.C1 links: ten logical link endpoints at seven distinct sites. These are graph counts, NOT ten purchasable radios.
- Site table appears before package composition; radio, antenna, diversity, licence, cost and sell remain OPEN pending OEM/BLD/MTO/CAL proof. Four TOPO holds address PTMP sharing, multi-link sites, source grouping, 60/90-degree conflict.
- Added `validate:0553-topology` static guard to frontend build. Run local build before claiming PASS. No customer release, no protected 0550 changes.


## 2026-10-10 MR0001 radio physical-role matrix checkpoint
- Added `data/mr0001RadioRoleMatrix.js`: each of five RPT Rev.C1 links now has two *candidate functional endpoint roles*, PTMP base/remote (directional inference) or PTP peer. Ten endpoint roles at seven sites are NOT approved physical radio counts; sharing, diversity, resilience, frequency and roles require BLD/MR/OEM corroboration.
- Site view traces RPT role/link/peer/antenna reference to associated MR MTO rows and displays the relevant Next G radio/antenna offered quantity at quote-wide level, without any site or package allocation. No inference that an offered quantity is a required quantity.
- `CommercialSystemBreakdown.jsx` shows the new physical-radio role grid before package composition. Added `validate:0553-radio-roles` static fail-closed guard to build chain.
- Need to verify directional roles, especially PTMP base sharing and PTP peers, against original block diagram and OEM equipment design; confirm antenna size, RF margins, power/Ex and licence, then approve physical installed/purchase quantities. No commercial release. Local npm build for this commit pending.


## 2026-10-10 MR0001 BLD/MR scope ownership review
- Re-read actual project BLD-0001 Rev.C1 and MR-0001 Rev.C1 from Drive. BLD text references existing ZWP8–ZPQ link reused to communicate with ZWP20/ZWP22 and new IDU/surge protection in Ex 'e' enclosure; MR review comments clarify commissioning spares and special tools must be supplied, not merely listed.
- Added `data/mr0001ScopeOwnershipAudit.js` with 5 source-linked gates for existing reuse, new supply, owner/others, Ex enclosure, spares and vendor documentation. Original drawing symbols and site-specific equipment composition still require graphical/native engineering review; extracted PDF text alone cannot certify physical quantities.
- Added panel to `CommercialSystemBreakdown.jsx` before Package Composition and `validate:0553-scope-ownership` static build guard.
- New supply, reused equipment, interface MH, OEM accepted BOM and cost remain OPEN/HOLD. No quote or customer release and no 0550 branch modifications. Local production build PENDING.


## 2026-10-10 MR0001 Vendor Offer Allocation Ledger
- Added `data/mr0001OfferAllocationAudit.js` to preserve 53 original Next G quotation line quantities and map each line to multiple *possible* MR functional consumers without duplicating allocation/cost. 37 base A/B/C and 16 D/E spares are isolated. All approved site allocations, accepted costs and selling prices remain null.
- Added fail-closed `validateAllocatedQuoteLines` for approved allocation shape, nonnegative integer quantity, site/component/source engineering verification, total allocated qty not exceeding each quote line, and preventing spares from installed scope. This validator returns REVIEW_REQUIRED even when structural checks pass; it never itself authorizes customer release.
- Added visible expandable MR0001 Next G allocation ledger to Breakdown UI, before raw quotation evidence. This is candidate coverage not a fulfilled BOM, since physical owner, role, licence and Native BLD/MTO/CAL acceptance remain OPEN.
- Added `validate:0553-offer-allocation` static regression in build pipeline. Build after this commit pending local user verification. Protected 0550 branch untouched and no customer output released.


## 2026-10-10 MR0001 preliminary Required/Offered Gap Register
- Added `data/mr0001GapAssessment.js`, deriving requirement-function rows from the 42-source-row Package Composition and supplier-side rows from the 53-line Quote Allocation Ledger. Candidate matches are non-exclusive and not accepted BOM.
- New `CommercialSystemBreakdown.jsx` gap table shows MTO/site, functional requirement, possible supplier lines, source-independent required quantity OPEN, site-allocated offered quantity OPEN and exposure HOLD. Missing candidate, multiple consumers, separate spare, ownership and technical risk labels remain explicit.
- Function `assessApprovedQuantityGap` computes numeric shortfall/surplus ONLY when both integer quantities and engineering/scope approvals are VERIFIED. No automatic customer release or compliance declaration.
- Added `validate:0553-gap` static regression. This is a structural guard, not engineering certification. Build after current changes pending user's `npm run build`.
- Next substantive task: trace each candidate function to original MR/SPE/DTS/BOD/BLD/TC exact clauses, verify physical quantity drivers and supported equipment allocation, then derive numeric cost/services. No 0550 changes.


## 2026-10-10 MR0001 Phase 7 source-located requirement evidence
- Re-read Google Drive MR-0001 Rev.C1 and BLD-0001 Rev.C1 text. Evidence: MR review comments require supply (not only list) of commissioning spares/special tools; operating-country applicable laws at precedence; BLD notes identify dashed existing installation, reuse of ZWP8–ZPQ path for ZWP20 and new IDU/surge in Ex 'e' enclosure.
- Added `data/mr0001RequirementEvidenceMatrix.js` connecting these source locators plus RPT radio link references to each functional row in existing gap assessment. References identify potentially applicable proof; neither exact native symbol-to-row matching nor OEM certificates are asserted.
- Added evidence grid to `CommercialSystemBreakdown.jsx`, regression `validate:0553-requirement-evidence` to production build. Required qty, accepted part number/cost and customer release all HOLD. User-local build pending. No protected 0550 changes.


## 2026-10-10 vendor source-price evidence correction (partially integrated)
- Management observed original vendor prices in Source Quotation detail, but GAP and functional BOM show OPEN. Policy correction: quoted source unit/line total must be displayed even while engineering Qty, approved cost and sell HOLD. `NONE FOUND IN NEXT G` is not proof of no offer from Cisco/other vendors.
- Added `data/mr0001VendorPriceEvidence.js`: all 53 Next G source unit/line amounts, original currency, matching functional candidates and separate null approved cost. Added `validate-0553-vendor-price-evidence.cjs` static source regression.
- Important blocker: attempted GitHub UI replacement for `CommercialSystemBreakdown.jsx` rejected twice by tool safety checks. Thus **price evidence model is committed but NOT wired into UI**, and build pipeline does not yet include new validation. Do not claim UI changed or local Build PASS.
- Next: short-range safe UI edit or local patch; add original USD source-price fields to Gap and clear label SOURCE PRICE vs APPROVED COST. Display Cisco / other supplier original THB price evidence separately, no automatic cross-vendor price blending or wrong 2024 expired quote equivalence.


## 2026-10-10 INNOVA 2024 pricing user approval for provisional budget
- User explicitly instructed to use INNOVA 2024 prices for now. Added `data/innovaHistoricalBudgetPrices.js` and `InnovaBudgetEvidence.jsx` integrated into MR0001 Breakdown, with QA24-0604 THB 189,220 pre-VAT basket, QA24-0605 THB 46,000 pre-VAT 305m cable box, and QA24-0606 THB 2,705 pre-VAT (Hawke glands 690 / 2,015 THB each). Source quotation URLs, 2024 date and THB preserved.
- Treat as PROVISIONAL_BUDGET_REFERENCE_REQUOTE_PENDING for CAT6A / cable glands / bulk only; do not add overlapping alternative baskets, infer installed quantity, or accept technical compatibility by price. Customer release remains HOLD.
- Added `validate:0553-innova-budget` to frontend build. User-local build pending. No 0550 modification.


## 2026-10-10 INNOVA provisional functional cost bridge
- Created `frontend/src/project0553/data/mr0001InnovaCostBridge.js` for user-authorized budgetary rates: QA24-0605 CAT6A 305 m/box THB 46,000; QA24-0606 Hawke 501/421/B/M25 THB 690/set and 501/421/C2/M40 THB 2,015/set; all ex VAT. QA24-0604 THB 189,220 is a mixed basket, **NOT one per-SKU unit rate**. Original quotations remain 2024 and requote pending.
- Linked Glands and CAT6A cable function candidates to 42-MTO-row Package Composition without allocating prices to more than one site. CAT6A and RF coax are separate cable types; glands M25 and M40 require cable OD and certification evidence. Calculation function `calculateProvisionalInnovaLine` requires integer qty, identical verified purchase unit, and `ENGINEERING_QUANTITY_VERIFIED` scope state; result is always PROVISIONAL_BUDGET_ONLY, never accepted sell.
- `InnovaBudgetEvidence.jsx` now displays candidate functions, original rate and unit tables. Added `validate:0553-innova-cost-bridge` static guard. Local npm build pending user run. Protected 0550 untouched; no customer submission.


## 2026-10-10 Cisco/INNOVA complete quotation source registry correction
- User identified truncated Cisco source detail and missing INNOVA in Source quotation / evidence section. Verified original 2026 VST ECS Cisco `A-0048/2026_Re1` PDF in Drive `1U-OvphkfUk_OJWCgUmCxqG5ipnBquyR2`: eleven coded lines (six priced, five original 0 THB tracking/software/parent lines). The original quotation total THB 2,117,650 ex VAT remains unchanged.
- Re-checked original INNOVA PDFs QA24-0604/05/06. QA24-0604 has four source rows: TECKNIKABEL CAT6A 300m at 524/m, Weidmuller RJ45 1 at 1020, Hawke M20 N/A quoted, Crouse Hinds adaptor 10 at 3100; totals THB 189,220 ex VAT. QA24-0605 has one CAT6A 305m box THB 46,000. QA24-0606 has two RF glands THB 690/2015, total THB 2,705.
- Registered all 3 INNOVA offers in `data/supplierQuoteLines.js` so they appear with Cisco/Next G in Source Quotation Detailed Source Items; preserved N/A as null, zero-cost Cisco source items as 0. Registered INNOVA folder in `vendorEvidence.js` for source summary. Source working manifest `pj2608-0553.working.json` now validates Cisco 11 and INNOVA 4/1/2 line counts and original totals.
- Added `validate:0553-source-quote-completeness` structural regression to build pipeline. Price evidence remains 2024 user-authorized provisional, not engineering accepted or customer sell. Local npm build pending; protected 0550 untouched.


## 2026-10-10 18:xx Bangkok — 0553 blank page runtime hotfix
- Chrome Console exposed exact crash: `PJ2608-0553 controlled dataset invalid: quote total: VST-0048-RE1` at `validateDataset.js:43` before React renders. Port, HTML, JS bundle and webpack compilation were otherwise healthy.
- Root cause: Cisco 11 coded source lines were stored as 5-column `[code,sku,description,qty,unitPrice]`, whereas runtime `validateProject0553Dataset` only summed sixth-column quoted line totals, producing zero for Cisco against THB 2,117,650 manifest reference.
- Patched `validateDataset.js` to use explicit quoted line total when numeric, otherwise compute `qty * unitPrice` only when both numeric, while preserving null/N/A as unpriced. Added validator-string guard to `validate-0553-source-quote-completeness.cjs`.
- User should git pull and refresh running webpack dev server (or restart 0553 on 3001 if needed). Local runtime confirmation PENDING. No protected 0550 changes.


## 2026-10-10 Working Preview FX convenience default
- User requested working FX rate/date/source persist on tab switch and reopening. `CommercialWorkspace.jsx` now defaults display THB, 31.5 THB/USD, 2026-10-10, source `INTERNAL PLANNING ASSUMPTION — UNVERIFIED`; this is user screenshot working assumption and **NOT claimed as sourced BOT rate** or 0550 source fact.
- React state writes any edits to namespaced browser localStorage and reads them back when the component remounts/reopens in same browser; reset button restores working defaults. Browser clearing/private mode falls back to defaults. No source vendor currency mutation, server DB write, accepted cost or customer release.
- Added `validate:0553-working-fx-default` structural guard to build. Local build pending. Warning: release requires verified actual rate, date and source instead of unverified assumption.
