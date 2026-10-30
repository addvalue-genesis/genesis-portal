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


## 2026-10-10 MR0001 direct blocker closure progress
- User demanded stop creating repeated OPEN/HOLD-only modules and close actionable BOM items. Updated original `mr0001RequiredBomDerivation.js` and `CommercialSystemBreakdown.jsx`: MTO source 1 Set/1 Lot is a recorded scope quantity (not approved SKU count); original Next G/Cisco/INNOVA quoted unit-price candidates now appear inline beside each MTO requirement. Rows identify specific blockers by category instead of one undifferentiated generic OPEN. No blanket OEM compliance acceptance or quantity guessing.
- Existing source quote registry remains canonical, and unit prices are quoted evidence; an unallocated SKU candidate must not be counted per site. Provisional extended cost remains HOLD where physical SKU count/compatibility unresolved; services still OPEN. The priority now is site-wise SKU composition / physical count closure, starting MR-502-001 (ZWP20) and LAN-502-001 (ZWP20).
- Added `validate:0553-closure-progress` static regression; local build pending. 0550 protected files untouched. No customer release.


## 2026-10-10 Working Priced BOM numeric deliverable pilot
- User required actual Engineering BOM results, not endless audit panels. Added `data/mr0001WorkingPricedBom.js` and `WorkingPricedBom0553.jsx` displayed FIRST in expanded MR0001 Breakdown. Source MTO Rev04 42 original rows now expanded into source tag/site records, with original 1 Set/1 Lot basis and preliminary split of 5 grouped-code source rows. Grouped splits remain subject to native Excel cell check, not silent OEM quantity acceptance.
- Quantitative pilot: `LAN-502-001` at ZWP20/21/22/23 and `LAN-502-002` at ZWP8 = five *MTO Set scope candidates*. Cisco VST A-0048/2026_Re1 contains 11 coded quote lines at Qty 5; per-set quote configuration priced THB 423,530 and five-set indicative budget THB 2,117,650 ex VAT, preserving all zero-price source tracking/licence parents. This is a WORKING package scenario, not confirmed device/port capacity, licence compliance or accepted supplier cost.
- No unsupported RF ODU/IDU SKU split, antenna diversity quantity, CAT6A route or RF gland quantity fabricated. Those remain itemized source requirements and engineering blockers, NOT zero-cost entries. Customer sell/release HOLD.
- `validate:0553-working-priced-bom` guards five actual LAN source rows and quote totals; local build/runtime pending. The legacy evidence tables remain for traceability but this deliverable appears before them. Protected 0550 untouched.


## 2026-10-10 Simple BOM default UX (user-requested simplification)
- Added `frontend/src/project0553/SimpleBom0553.jsx` for one table per site/MTO tag with Qty/Unit, unit source cost, preliminary extended cost and brief status. Site filter, priced-only subtotal THB and optional Cisco SKU drilldown. Original MTO source grouped splits and physical SKU acceptance remain as before.
- Made Simple BOM the first/default component in `CommercialSystemBreakdown.jsx`. All legacy engineering/quote/audit submodules are now in a collapsed `<details>` advanced section, not deleted. This stops the user having to navigate many repeated OPEN/HOLD tables just to see BOM.
- Only Cisco working bundle at five LAN MTO sets is currently numerically priced THB 2,117,650 before VAT; other requirements are UNPRICED, not zero. Never present the subtotal as total MR0001 cost. This is a preliminary quotation scenario only, not signed-off system design.
- Added `validate:0553-simple-bom` static guard. User-local build and UI runtime verification pending. Protected PJ2608-0550 unchanged.


## 2026-10-10 Governing-method cost-spine refactor (no new costing theory)
- User clarified the governing process: Executive, Architecture, First Principles and Commercial are cooperating views over the same controlled MR/engineering/vendor evidence, with the original 6-sheet `4-Scope of Supply.xlsx` as customer output contract. Eliminate separate mutually inconsistent financial truths.
- Added `frontend/src/project0553/data/bidCostSpine.js` as a thin read-only self-describing derivation over existing `mr0001WorkingPricedBom.js` and `supplierQuoteLines.js`: Cisco preliminary source-reconciled cost THB 2,117,650 before VAT; priced/unpriced MR0001 tag count; full equipment/services/A+B+C and customer sell NULL rather than phantom zero. Does NOT migrate 0550 costs or claim fully priced proposal.
- Bound the exact same cost spine to `executiveViewModel.js`, `architectureManifest.js`, `engineeringViewModel.js` and `CommercialWorkspace.jsx`. All older audit/code modules preserved for drilldown; no change to historical customer-issued workbook or release gates.
- Added `validate:0553-cost-spine` in build. Local build/runtime remains PENDING. Next deliverable is actual evidence-derived complete A+B+C estimate and 6-sheet customer output; not additional dashboard modules.


## 2026-10-10 Budget Working Preview location-driven BOM refactor
- User clarified definitive workflow: RFQ/MR/BOD/BLD/Standards evidence processed by Executive, Architecture, 4 MR Systems and First Principles; output displays directly in Budget > Working Preview as location-grouped equipment BOM. Source vendor rates from existing JSON/repository must be searchable by company and system. Excel 4-Scope of Supply is eventual output template, NOT the primary authoring UI.
- Added `data/workingBomByLocation.js`, a read-only projection of existing MR0001 MTO Working Priced BOM, Required Engineering BOM, and Supplier Quote Registry. Each location/physical object preserves source tags, scope quantity, quoted candidate SKU/vendor/currency/price, engineering approval separation and no vendor quote quantity multiplication.
- Refactored `SimpleBom0553.jsx` to Location > Item table, expand SKU price sources and filter Location/Vendor/System; MR0002–4 selections explicitly show data binding pending instead of invented BOM. Currency stays as quoted for quote candidates; only supported Cisco 5-set preliminary scenario is extended and summed (THB 2,117,650 pre-VAT), total project A+B+C still open.
- Moved location BOM to `CommercialWorkspace.jsx` as first direct child of Working Preview before the legacy breakdown. Legacy audit panels remain behind advanced details, preserving decisions/evidence. Updated `validate:0553-simple-bom` for new view location and source bindings. Local build/runtime PENDING user verification; protected 0550 untouched.


## 2026-10-10 MR0001 First Principles pipeline phase: RPT-derived site demand
- Refactored with `data/mr0001FirstPrinciplesDerivation.js`: source-linked per-location radio link endpoint functional roles and antenna reference demand derived from RPT-0001 Rev.C1 (five distinct links and explicit x2 diversity), distinct from OEM purchase quantities and MTO Set/Lot input. This creates an actual engineering-derived dimension, not a vendor-led quantity.
- `data/workingBomByLocation.js` consumes derived demand and `SimpleBom0553.jsx` shows these counts beside each location, clearly labelled NOT purchase qty. No selected SKU, accepted cost or customer release. BLD reuse, OEM PTMP sharing, antenna 60/90-degree conflict, licence and Ex remain unresolved engineering decisions.
- Added `validate:0553-first-principles-demand` to frontend build. Local user build not yet checked. Protected 0550 untouched; no new commercial calculation method introduced.


## 2026-10-10 JUTAL 6ft-to-4ft antenna requirement (preliminary engineering)
- User reports JUTAL requests reducing previously calculated 6ft dish to 4ft, subject to pre-OEM engineering calculation and controlled linked hierarchy Requirement→Method→Proof→Cost. Treat as user-reported engineering change until the written client TC/revision is linked.
- Added `data/mr0001AntennaDownsizeStudy.js` for the RPT C1 ZWP8→ZWP20 19.852km/5800MHz receive 6ft 40.9dBi reference. At constant aperture efficiency the 4ft aperture estimate changes gain by 20log10(4/6)=-3.5218dB, to 37.3782dBi; this is only one-end receiver-side sensitivity. Required Rx power, thresholds, fade/availability, tide/sea reflection, regulatory and OEM 4ft exact model remain unverified; no pass, price or BOM SKU allocation asserted.
- Working First Principles `MR0001RFProofPilot.jsx` now displays the change sensitivity for the affected link only; regression `validate:0553-antenna-downsize` added to build. User-local npm build pending. Do not apply downsize to 3ft or already-4ft paths automatically. Protected 0550 untouched.


## 2026-10-13 — ZWP20 MR-502-001 row4 MAP-04 source-join incident / correction
- **Observed:** UI `bid.budget.bom.zwp20.mr-502-001.4.mapping-audit` showed MAP-01..03 PASS, MAP-04 ERROR, MAP-05..10 SKIPPED. This is fail-closed downstream behavior, not evidence that source quote or cost is missing.
- **Root cause verified by inspecting exact joined functions for all 9 Next G quote codes:** B-1 SKU `CONN-OW-HAZ-4958ER-01` was expected as `RADIO_EQUIPMENT` by `controlledTagMappingPilot0553.js` but is classified as `RADIO_REMOTE` by `aviatTechnicalBidEvaluation.js`. All other 8 expected/technical function labels matched. `matchQuotedSourceLine()` requires exact function equality and raised `TECH_FUNCTION_MISMATCH`.
- **Approved semantic boundary / implemented change:** MAP-03 retains broad MR `RADIO_EQUIPMENT` required-function decomposition; the MAP-04 B-1 *supplier source-join* now uses the existing specific `RADIO_REMOTE` candidate function. This does NOT authorize OEM technical compliance, quantity allocation, new vendor selection, Myanmar region B-4 (source price NULL), or a cost change.
- **Diagnostic improvement:** MAP-04 prints offending Quote Code, SKU and source-join issues; downstream SKIPPED stages include the ID/reason of the failed prerequisite. The generic uninformative error text is no longer the only diagnosis.
- **Regression:** `frontend/scripts/validate-0553-controlled-tag-mapping.cjs` adds positive B-1 exact-function source match, all 9 no-issue joins, and negative quote-rate tamper test that must print specific B-1 mismatch and MAP-04 skipped-stage cause. Existing cross-owner cost invariants and customer-release HOLD remain.
- **Files touched:** `frontend/src/project0553/data/controlledTagMappingPilot0553.js`; `frontend/scripts/validate-0553-controlled-tag-mapping.cjs`. Source quote JSON, vendor register source, `aviatTechnicalBidEvaluation.js`, MTO, and locked `mr0001TagCostLedger0553.js` / `zwp20SiteCost0553.js` are unchanged.
- **Verification state:** GitHub source contract rechecked (9/9 function labels align after fix); user-local Node/Babel audit and production Webpack build, plus browser MAP-01..10 refresh, are **PENDING**. Do not represent static evidence as local build PASS. Run `npm run validate:0553-controlled-tag-mapping` then `npm run build` after pulling; explicit engineering qualification must remain visible at MAP-05 and customer release remains NO.
- **Architectural lesson:** Never rename technical taxonomy silently or relax exact joins to suppress ERROR; preserve requirement-level vs offered-role dimensions and store positive+negative cross-module contract tests.


## 2026-10-13 — Mandatory collapsible Module ID and nested-table visibility
- User reported screenshots: Equation Register and Vendor Quote Lines overflow beyond the right edge; TAG derivation and RFQ Particular modules lack immediately visible Copy IDs; RFQ showed TAG/Site/Common/Conflict counts but the Common and Conflict records were not rendered.
- Implemented `ControlledModuleSection0553.jsx`: reusable collapsible section with visible Copy ID in the header when collapsed, stable `data-component-key`, accessible disclosure semantics. Migrated nested sections in `LocationBomDetail0553.jsx`, `TagMappingAudit0553.jsx`, and directly related `SimpleBom0553.jsx` source/bulk/location modules.
- RFQ particular evidence now exposes TAG/Site, Common, and Conflict records with distinct collapsible subsections and their source-linked IDs; neither source clauses nor commercial ledger are modified.
- Scoped wrapping/scroll CSS in `project0553.css` constrains table cells and nested horizontal overflow. Each wide dataset remains visible through its own scrolling region rather than being clipped by nested tables.
- Added `validate-0553-nested-module-contract.cjs` to `npm run build` and aligned existing Location Overview/Detail regression assertions. The contract includes real React server-render markup test after dependencies are installed.
- Formal contract, scope boundary, acceptance and handoff: `docs/handoff/pj2608-0553/24_MODULE_DISCLOSURE_ID_CONTRACT_REV01.md`.
- **Status:** GitHub code committed and static identity/tag-balance inspected. No direct browser or full npm/Webpack runtime verification has been run on the user PC; execution and responsive browser acceptance PENDING. Focused coverage is Budget Working Preview/TAG audit, **not** an assertion that every module of 01–10 has been inventoried or migrated. Source prices and locked cost files unchanged.
- **Architectural action:** Inventory other L3 01–10 module trees and add module contracts in separate reviewed work; prevent future CSS/UI refactors from hiding IDs, clipping columns, or silently removing drilldowns.


## 2026-10-13 — Source-line / physical TAG cost-scope reconciliation: ZWP20 MR-502-001 row4
- User challenged why ZWP20 `bid.budget.bom.zwp20.mr-502-001.4` equals USD 7,288.65 while its `mapping-audit.vendor-quote-lines` shows nine Next G source lines. Investigation of original controlled `NG-260916-ADV-DAP1.full.json`, `engineeringOwnedCost0553.js`, `zwp20SiteCost0553.js`, and `controlledTagMappingPilot0553.js`: nine quote codes belong to **four different source MTO cost owners**, not one ODU.
- ZWP20 ODU `MR-502-001.4`: B-1 USD 3,456.50 + B-2 USD 2,348.19 + B-3 USD 1,177.22 + B-4 vendor rate NULL (management 0 incremental allowance, **not supplier-confirmed USD 0**) + B-5 USD 306.74 = **USD 7,288.65 provisional ODU-only**.
- ZWP20 IDU Power/PoE `MR-502-001A.5`: B-6 USD 667.67 + B-7 USD 3.60 = **USD 671.27**; this is explicitly NOT a complete verified IDU design.
- ZWP20 Surge `SA-502-001.10`: B-8 USD 614.20. Antenna `ANT-502-001.6`: B-12 USD 4,709.77 (4ft working alternative, CAL/OEM verification outstanding).
- Four-owner site-level subtotal for these nine functions: **USD 13,283.89**, not ODU-only USD 7,288.65. Other three tags sum USD 5,995.24. Original vendor quote-wide priced line totals among these nine = **USD 30,432.13** from original offered quantities (usually 3, antenna 1), **excluding unpriced B-4**; not comparable to single-site engineering quantity 1. No FX or customer sell calculation involved.
- Assessment: ODU $7,288.65 is **arithmetically reconciled for a restricted working scope**, not a complete/proven vendor package or final RFQ-compliant equipment cost. Vendor B-4 region 04 US/Canada/Oman not evidenced as acceptable Myanmar entitlement; price NULL. Power interface, surge and antenna are separately owned to prevent double counting; enclosure/bulk/services and OEM approval are additional scope. Previous vendor table displayed nine rows without a visible owner subtotal and could mislead users.
- Read-only corrective UI: created `data/zwp20TagCostComparison0553.js` to independently compare original quote unit/line totals and engineering-quantity extensions against four frozen ledger owners; added `.mapping-audit.cost-scope-comparison` with owner-level sums, source missing price warning, quote-wide vs single-site basis; expanded vendor evidence columns. Added original `sourceQuotedLineTotalUSD` field to `controlledTagMappingPilot0553.js` without altering quote or cost source, and positive/negative tests in controlled mapping validation plus nested-module identity test.
- No changes to protected `zwp20SiteCost0553.js`, `mr0001TagCostLedger0553.js`, `engineeringOwnedCost0553.js`, manufacturer quotation JSON or customer release gate. Source/build verification is not equivalent to OEM engineering acceptance.
- **Verification:** Source amounts and owner grouping checked from exact current GitHub quote JSON. Code committed, full local Babel/Node/Webpack and interactive screenshot verification **PENDING**. Required: `npm run validate:0553-controlled-tag-mapping`, `npm run validate:0553-nested-module-contract`, `npm run build`, inspect mapping-audit comparison and source-line totals in browser.


## 2026-10-13 — Four-Stage per-TAG Engineering BOM workbench (Required → Working → Vendor → Verify)
- User direction: supplier nine-line offer audit must not visually substitute for the real Engineering BOM of `bid.budget.bom.zwp20.mr-502-001.4`. User needs a comprehensible, consistent structure and visible/copyable IDs for all TAG stages.
- Implemented as **read-only presentation** on existing `LocationBomDetail0553.jsx` TAG `.derivation`; no new Cost Ledger/DB: `data/tagBomFourStageReadModel0553.js` joins existing MR0001 Required BOM, Functional Package Composition and canonical TAG cost ledger to source quotation evidence; `TagFourStageWorkbench0553.jsx` renders four ordered collapsible stages with stable `bid.budget.bom.<site>.<tag>.<row>.{required-bom,working-priced-bom,vendor-comparison,engineering-verification}`.
- Required: show original MR/MTO 1 Set separately from engineering required function count / approved physical SKU qty (still NULL). Working: show only functions owned by current TAG; state the separated owner/quantity and sum-vs-ledger delta. Vendor: show only current owner's exact priced quote lines with original offered qty, vendor currency/rates and quote-wide extensions; never treat quote qty as required qty. Verification: preserve all prior Mapping Audit, RFQ TAG/Site/Common/Conflict, recoveries, alternatives, CAL/technical evidence, working assumptions and release gates as nested diagnostic modules.
- Golden ZWP20 ODU row4: required 8 functional obligations; owner-scoped working B-1/B-2/B-3/B-4/B-5 subtotal USD 7,288.65. B-6/B-7 are IDU owner MR-502-001A.5 USD 671.27; antenna B-12 / surge B-8 remain separate. Vendor original B-4 is NULL (management zero incremental assumption, not vendor price or Myanmar entitlement proof). Product/SKU purchase quantities are still unapproved.
- New `validate-0553-tag-four-stage-bom.cjs` uses real existing Babel import-chain and source ledger to assert 8 functional requirements, no accepted SKU, ODU USD 7,288.65, B-6/B-7 separate, B-4 NULL, all five owner-only vendor code rows, zero cost mutation and four UI module IDs. Added to `npm run build`. Controlled module disclosure and mapping validations remain mandatory.
- Executive / SI guide: `docs/handoff/pj2608-0553/25_TAG_BOM_FOUR_STAGE_USER_GUIDE_REV01.md` includes definitions, paths, sample quantities/prices, known engineering gaps and exact Copy IDs. Original docs 20–24 remain retained.
- Scope limits: MR0001 TAGs rendered by current Location Workbench; this is not a new approved physical BOM and does not automatically extend MR0002/3/4 data mappings. Common UI method can be reused only after their distinct technical/source contracts are read.
- Verification: GitHub source inspected; isolated JavaScript four-stage model executed with current MTO row and Next G quotation (8 functions, 5 ODU quote lines, USD 7,288.65 with delta zero, B-6/B-7 separate, B-4 vendor NULL). Real imported module graph, local npm validation/build and browser acceptance remain **PENDING**; no vendor acceptance, frozen cost file mutation, 0550 changes or customer release.

- Final read-model hardening for 2026-10-13 four-stage TAG workbench:
  - ZWP20 IDU row5 B-6/B-7 (USD 671.27), Surge row10 B-8 (USD 614.20), Antenna row6 B-12 (USD 4,709.77) now read the existing independent MAP-09 Source Quote/COST OWNER audit only when its status is reconciled, owner identity matches and the unchanged frozen Ledger amount matches. Thus these physical TAGs can show source quote/function lines under their own TAG without additional pricing DB or double count.
  - Like-currency guard in four-stage projection rejects mixed or unverified component currencies before computing a function subtotal; regression includes a negative THB/USD mixed source case.
  - Pure read-model execution with controlled MTO and Next G source fixture yielded four owner subtotals exactly 7,288.65 / 671.27 / 4,709.77 / 614.20 (USD), delta zero for each. This is *not* a full Node/Babel local application/webpack/browser test; pending.


## 2026-10-13 — Expanded Location / Engineering Detail missing Module ID
- User screenshot of `bid.budget.bom.system-location-mto`, expanded ZWP8: the WP table row already had Copy ID `bid.budget.bom.zwp8` but its child label `ZWP8 / Engineering Detail` was a plain paragraph with no Copy ID/disclosure. This violates the approved universal Module Contract at the LOCATION DETAIL level.
- Fixed `frontend/src/project0553/SimpleBom0553.jsx` by wrapping all expanded per-WP engineering details inside existing `ControlledModuleSection0553` using a new stable hierarchical ID: `bid.budget.bom.<site>.engineering-detail`, e.g. `bid.budget.bom.zwp8.engineering-detail`. Disclosure starts open, shows the copyable ID in its header even when collapsed, and preserves child Cost Allocation / TAG / Vendor / RPT modules and original totals. All locations use one shared renderer; no separate database or cost calculations created.
- Enhanced `validate-0553-location-overview-layout.cjs` and `validate-0553-nested-module-contract.cjs` to require visible expanded Engineering Detail identity and containment. 10/10 static source/invariant checks passed in GitHub tool. User-local Babel/Node/Webpack and browser verification **PENDING**; no claims of QA acceptance or customer release.
- Architectural lesson: Parent location ID is NOT sufficient for an actionable child module; expanded content must have its own discoverable/copyable ID. If any future feature adds a heading for a substantive module, the header should carry ID and disclosure from the reusable component.


## 2026-10-13 — Corrected module attribution: master System–Location–MTO table, NOT ZWP8
- Clarification from user screenshot: the missing module-header/Copy ID is on the **master System–Location–MTO overview table** (`PJ2608-0553 / bid.budget.bom.system-location-mto`), NOT on its ZWP8 detail row. The previous `ZWP8 / Engineering Detail` diagnosis was incorrect and is superseded by this note.
- Root cause: the root Module ID was printed in an independent `BOM Working Table — Module ID` banner *above* the System/Location Filter; the actual overview table was outside a collapsible owner module. At the table viewport, users could not see/copy the root identity nor collapse the full table.
- Corrected `SimpleBom0553.jsx`: the canonical existing `bid.budget.bom.system-location-mto` is now a real `ControlledModuleSection0553` wrapping the entire conditional BOM table immediately **after the SmartFilterBar**. Its `summary` displays current System / Location and the Copy ID, independently of all row IDs; collapse/expand owns the whole table. Filter context retains System and Location IDs, not a duplicate master Copy ID. ZWP8 and all other location row IDs are unchanged; the mistaken extra `.engineering-detail` wrapper was removed. All existing cost/engineering/vendor/RPT read models are unchanged.
- Adjusted `validate-0553-location-overview-layout.cjs` and `validate-0553-nested-module-contract.cjs` to require the master table wrapper, placement before overview content, complete scope, and specifically guard against the misattributed ZWP child wrapper.
- Verification remains user-local Node/Babel, `npm run build` and actual browser UI check. Static source identity and nesting checked; no claims of full QA Pass, approved engineering BOM or customer release.


## 2026-10-13 — A / B / C working cost readiness in System-Location-MTO executive header
- User asked why `37/55 Items with Mapped Vendor Rate Evidence` is shown but no A/B/C numbers and `Select WP to see total`. Clarification: 37/55 is quoted/candidate PRICE-EVIDENCE coverage, not engineering approval and not the count of working-booked cost. Source `SimpleBom0553.jsx` uses `vendorCovered()` separately from `mr0001TagCostLedger0553.js` booked rows. Missing evidence may coexist with a working management budget/other allocated cost.
- Added **read-only** `frontend/src/project0553/data/abcWorkingReadiness0553.js`, based only on existing seven-location MR0001 TAG ledger `summarizeMR0001TagCost0553()` in original USD/THB, and separately the project-wide **Working SELL** `partBCWorkingWbs0553.js` Rev05. No new vendor rates, labour MH/MD, FX, or cost posting. UI `AbcCostReadiness0553.jsx` integrated into `SimpleBom0553.jsx` source facts/overview; all Part A/B/C and A+B+C lines visible without selecting WP; selected location scopes only Part A, while B WBS is project-wide and explicitly not allocated by WP.
- A displays known **MR0001** equipment/direct-attributable-bulk working cost in original USD+THB and planning-THB conversion only when FX is supplied; costed/unposted TAG counts and per-WP/source gaps. This is a **PARTIAL working cost**, NOT complete Part A across all four MR and not technical-approved.
- B displays current internal **B COST: NOT ESTABLISHED**, but independently displays recorded WBS Rev05 B1/B2/B3/B8/B9 working **SELL THB 3,804,160** (five of 14 lines), with all B1–B14 source driver/owner/status and missing sell lines. It must NOT be added to A equipment cost. WBS source uses B4 Painting, B5 Packing, B6 Logistics etc; the site's `lifecycleSpareScope0553.js` B4/B5/C2 labels differ and need a controlled contract CBS crosswalk before combining line-by-line.
- C displays **C COST: NOT ESTABLISHED** and C1/C2 required OEM spare inventories/rates and option status. Unknown cost is not THB 0.
- A+B+C shows **complete project total: NOT ESTABLISHED** plus a clearly scoped visible **A-only working allocated portion** (no false A+B+C sum). Other MR A costs, B internal labour/service costs and C spare costs still need accepted quantity/rate, owner and crosswalk before any real all-project total.
- 37/55 coverage now has a separate collapsible `.price-evidence-gaps` panel listing every uncovered current source TAG, source qty, canonical Copy ID and whether some working amount already exists from the separate controlled ledger. This avoids interpreting `unmatched vendor rate` as `unapproved product` or `zero cost`. Filtering vendor only changes visible coverage; A cost totals remain grounded to the unfiltered ledger and are labelled accordingly.
- New stable child module `bid.budget.bom.system-location-mto.abc-readiness` plus `.price-evidence-gaps`, `.part-a-gaps`, `.part-b-wbs`, `.part-c-spares`; all source rows retain individual Copy IDs. UI CSS scopes horizontal overflow/wrapping; both snapshots and Source Quotation unchanged.
- Mandatory regression `frontend/scripts/validate-0553-abc-readiness.cjs` added to `npm run build` with canonical 7-site subtotal comparisons, B Sell-versus-Cost, 14 B lines, C1/C2, original-currency/FX guard, null B/C and incomplete A+B+C, nonmutating ledger, source gap visibility and Babel JSX checks. GitHub code/static integration checks are not a substitute for user-local Node/Webpack/browser PASS.
- Existing `BID_COST_SPINE_0553.partA/B/C` stays null (it is a Cisco-only earlier general cost spine, not a fully priced 4-MR project). A/B/C UI is a scope-labelled read-only readiness projection and MUST NOT overwrite the production or historical customer price baseline.


## 2026-10-13 — Superseding UI decision: show ONLY one All-Locations total in original MTO summary card
- User clarified they do **not** want an additional A/B/C dashboard or separate B/C detail here. They want the original `All Locations — Allocated Total Equipment / A+B+C` **single summary card** to display a numeric total in place of `Select WP to see total`.
- In `frontend/src/project0553/SimpleBom0553.jsx`, calculate `allLocationAllocated` by summing **the exact same `wpSummary(g.site)` from `getMR0001LocationCost0553`** used by each of the seven canonical WP rows; sum USD and THB separately and use display FX only if valid. When a WP is selected, preserve existing `displaySiteTotal(site)` in the same card. Original parent `bid.budget.bom.system-location-mto`, WP rows/Module Copy IDs and nested TAG details stay unchanged.
- Display the 7-WP **allocated MR0001 Equipment/Attributable Bulk working subtotal** with its costed/pending TAG count. This amount is *not* complete full project A+B+C across four MRs; Part B labour/service internal cost, C spares, missing source rows, and other-MR A remain excluded. Do not add `partBCWorkingWbs0553.js` B1-B14 **SELL** to vendor Cost, duplicate bulk projection, alternative quotation totals or unverified price candidates. If FX unavailable show original USD + THB with `FX REQUIRED`, not a fabricated combined number.
- Remove UI mounting and imports of the recently added `AbcCostReadiness0553` detailed dashboard in `SimpleBom0553`, plus its unused summary calculations. The `abcWorkingReadiness0553.js` and `AbcCostReadiness0553.jsx` files may remain preserved as internal work products / regression references but **must not be mounted as a second competing Summary**.
- Updated `validate-0553-abc-readiness.cjs` and `validate-0553-location-overview-layout.cjs` to enforce one all-location total, ledger reuse, per-WP scope, no parallel ABC dashboard, and `full A+B+C NOT ESTABLISHED` qualification. Local `npm run build` / browser acceptance **PENDING**. This note supersedes the earlier instruction to show B1-B14/C1-C2 detailed dashboard on this main UI.


## 2026-10-13 — ZWP8 excessive working total: confirmed B-8 duplicate and wrong radio/IDU ownership
- User flagged ZWP8 `bid.budget.bom.zwp8` internal working THB 1,375,485.67 as materially higher than ZWP20 and other WPs; asked for First Principles + Telecom Constraint-Based Engineering review, not just figure matching.
- Confirmed MTO Rev04 ZWP8 grouped row43 contains 2 ODU, 2 IDU, 2 ANT; row45 has 2 Ethernet SA, row44 Cisco LAN 1, row46 TCAB 1, row47 field bulk 1 Lot. RPT C1 has two PTMP branches ZWP8→ZWP20 and ZWP8→ZWP22 plus PTP ZPQ→ZWP8, with BLD Brownfield reuse question and MTO/TC/CAL 4ft/6ft antenna conflicts. Management 2×radio+2×antenna is a working replacement scenario, not proven NEW procurement.
- Reconstructed CURRENT ledger at working FX 31.5: radio ODU two USD 17,148.24, 4ft antennas two USD 9,419.54, SA two USD 1,228.40 = USD 27,796.18; Cisco THB 423,530, enclosure THB 39,200, bulk THB 37,176 = THB 499,906. Total **THB 1,375,485.67** and 9/11 TAGs booked. This is a correct reproduction of CURRENT code, NOT evidence of valid non-overlapping scope.
- **Confirmed defect #1 (duplicate):** ZWP8 ODU `zwp8Row43CostTrace.js` source radio unit USD 8,574.12 includes Next G B-8 USD 614.20 each, while standalone SA-502-002/SA-502-003 both also book B-8. Double charge exactly **USD 1,228.40 = THB 38,694.60**. To avoid rebooking, physically assign B-8 only to SA owners.
- **Confirmed defect #2 (cost owner, not extra amount):** ODU bundle also includes B-6/B-7 industrial PoE/power cord USD 671.27 ×2 = USD 1,342.54 / THB 42,290.01 even though MR-502-003A/004A IDU TAGs remain unpriced. `selectMR0001TagCostRows0553` returns a grouped `selected` row before `deriveMR0001MissingBudget0553`, so later provisional IDU functional costing never runs for these two source rows. Reclassifying B6/B7 to IDU is a transfer, NOT a new amount and NOT standalone IDU compliance proof.
- The strictly illustrative one-cost-owner allocation is ODU 2×USD 7,288.65 + IDU PoE 2×USD 671.27 + SA 2×USD 614.20 + ANT 2×USD 4,709.77 = USD 26,567.78; add unchanged THB 499,906 => **THB 1,336,791.07** at unverified planning FX31.5. This is lower by THB 38,694.60; still exceeds ZWP20 due primarily to the management two-radio/two-antenna replacement allowance, not an alleged arithmetic multiplication bug.
- Another gate: original Next G B-12 global QUOTED quantity 1 while ZWP8 working scenario uses B-12 Qty2; region/NMS/Ex/capacity, PTMP sector and PTP parabolic, FSL/CAL/antenna diameter remain unverified. Do NOT adopt 4ft Qty2/OEM approval as physical design without source proof. BLD reused link quantity/ownership must be resolved before procurement.
- Implemented **read-only** `frontend/src/project0553/data/zwp8CostOwnershipAudit0553.js` + `ZWP8CostOwnershipAudit0553.jsx` at `bid.budget.bom.zwp8.cost-ownership-audit`; shown inside ZWP8 Location TAG screen, with issues and RPT 3-link proof, Copy IDs. Added ZWP8 overview warning without changing booked price. New regression `npm run validate:0553-zwp8-cost-ownership` wired into `npm run build` checks source bridge, duplicate, IDU misplaced cost, unchanged ledger, flags and no FX-unverified summation.
- **Thai/English audit decision memo**: `docs/handoff/pj2608-0553/27_ZWP8_COST_OWNERSHIP_FIRST_PRINCIPLES_AUDIT_REV01.md`. This audit is a controlled diagnosis only; original quote, cost ledger, `zwp8Row43CostTrace`, 4ft management scenario and all archived Baselines are UNCHANGED; corrective source-cost change requires explicit Engineering/Management decision and revisioned review. Static source checks done, user-local Node/Build/browser **PENDING**, customer release **NO**.


## 2026-10-13 — ZWP8 AFC role-based TAG reallocation / remove confirmed overlap
- User explicitly limited the scope to **ZWP8** and requested removal of excess/duplicate procurement; do **not** modify cable-gland quantities handled in another chat.
- Implemented MR0001 MTO row43 six separate cost owners in `zwp8Row43CostTrace.js` and `mr0001TagCostLedger0553.js`: MR-502-003 PTMP BS A1+A2+A4+A5 USD 13002; MR-502-003A PTMP PoE interface A6+A7 USD 671.27; ANT-502-002 ONE shared 90° sector A12 USD 602.69; MR-502-004 additional PTP candidate B1+B2+B3+B5 USD 7288.65; MR-502-004A PoE B6+B7 USD 671.27; ANT-502-003 one PTP parabolic B12 USD 4709.77. Both SA physical TAGs remain separately costed once (2×B8 USD 1228.40). All quote rates are source candidate, not OEM approval.
- New role-based amount including SA = **USD 28,174.05**; unchanged Cisco, new TCAB Ex e enclosure, and field bulk = THB 499,906; aggregate at planning FX31.5 = **THB 1,387,388.58**. This may be GREATER than old THB 1,375,485.67 since correct PTMP BS hardware and PMP/MAX licence cost more than the previously incorrectly used remote radio. `A-3/B-4` country-region licence rates NULL; incremental existing ZPQ NMS BS managed-node/port entitlement is unknown, not zero. Do not imply full cost completeness.
- `zwp8CostOwnershipAudit0553.js` and UI updated to check **current** cost-owner rows rather than retired legacy quote bundle; `validate-0553-zwp8-cost-ownership.cjs` asserts zero current surge overlap, IDU values allocated, 11/11 TAGs having working budget and old/actual currency totals. Existing PTP baseline remains existing; PTP additional physical endpoint is a separate qualified working candidate pending OEM proof.
- Enclosure is not a duplicated existing cabinet: BLD C1 Note8 requires **NEW Ex e enclosure** for new IDUs/surge, BOD C2 §8 wall-mounted enclosure and CAT6 tie-in to existing TCAB-WP8-500. Keep TCAB-500-003 NEW (THB 39,200 historical comparable), do not procure TCAB-WP8-500 as NEW. A Layer3 Switch appears in the new enclosure; separately verify switch Scope/Free-Issue before zeroing LAN-502-002 (currently THB 423,530 budget). No automatic deletion of current LAN amount.
- IMPORTANT: 11/11 budgetary amount does NOT mean final physical BOM OEM compliant, and tests are **not yet executed** on local webpack/Node. This source change is on `feat/pj2608-0553-tpp-bid-handoff`; `npm run validate:0553-zwp8-cost-ownership` and `npm run build` must be run and errors remedied before acceptance. The source RFQ/MTO, original vendor quote, other WPs, and cable glands unchanged.


## 29-Oct-2026 — B4/B12 exclusions and selected B14 insurance budget
- Working branch: `fix/pj2608-0553-b4-b12-b14-20261029`; Draft PR #54. Do not merge or issue customer documents automatically.
- Owner accepted B14 USD 25,000 as a pre-award Budgetary Allowance and requested commit/pull. Canonical Working SELL = THB 787,500 at unchanged FX 31.50. Verified insurer premium, Direct Cost, actual profit and final insurance coverage remain unconfirmed.
- Price source: `frontend/src/project0553/data/addvalueB14Insurance0553.js` (`ADDVALUE_B14_SELECTED_BUDGET_0553`) -> `bcTurnkeyWorkingCost0553.js` -> Scope / Release -> native THB/USD Excel. Preserve module `bid.budget.working.bc.b14`; detail `bid.budget.working.bc.b14.detail`.
- Historical reference: AIG CQ 004-23 (R), 7-Jun-2023, ADDVALUE/CPOC; CGL THB375,000 + WCEL THB132,500 = THB507,500 before VAT/stamp. Historical period2 months / 8 persons / USD1m liability limit is not a 0553 policy promise. THB280,000 difference is gross SELL planning headroom for commercial treatment, tax/territory/duration/scope uncertainty, not an insurer quote or verified profit.
- CPOC actual contract USD180,000 is an owner statement. AIG's historical estimated contract value USD250,000 remains separately preserved; do not silently replace it or scale premium linearly by project value/headcount.
- Original 0553 RFQ Contract Template Article18 pages33–34 specifies seller equipment onsite, WC/EL or statutory system, Cargo Institute Cargo Clauses(A), and statutory insurance; evidence/certificate within10 days after effective date, 60-day notice. This is a received template, not proof of signed final terms. Sources and CCL Rev05 item31 Yard18/Offshore45/Survey5 days are linked in B14 detail.
- Cargo stays B6; SAMTEL prime-contract bonds excluded from this selected ADDVALUE allowance. Additional insured names and ADDVALUE–SAMTEL–JUTAL–PTTEP coverage are subject to actual policy/contract confirmation. Historical CGL excludes property in care/custody/control and worked-upon property; do not claim complete goods cover.
- Existing B3/B9 insurance SELL allowances THB24,000 remain unchanged, with no automatic offset against B14 pending proof of identical coverage. Old Rev05 personnel-only THB55,800 remains historical/nonposting.
- B4/B12 use N/A with Not quoted; excluded from this offer. Null is retained; this is a commercial exclusion, not OEM technical applicability certification or proof of buyer acceptance. Reconcile B12 with CCL item30 before firm issue.
- Selected Part B Working SELL THB5,782,287.13; Source A+B THB27,979,839.36; rounded Official A+B USD888,900. C1 USD97,500 / C2 USD23,000 remain separate conditional options. All other selected prices and existing commercial-policy parameters stay unchanged.
- User must fetch/pull the exact review branch in an isolated review worktree if their current checkout is 0550; never pull this branch into 0550 as an implicit merge.
- Validation completed: all149 validator steps in the production build chain checked (failed legacy total guards corrected and resumed), production webpack passed with3 bundle-size warnings; Official USD/native THB/Excel repeat-export, price breakdown, current integration, scope and CFO checks passed. No customer issue or merge performed.


## 30-Oct-2026 — B1 full-project review, not a selected reprice
- User clarified B1 includes SI Engineering, PM, procurement, administration/finance and licensing until project completion; review the whole B1 budget, not only Instrument import licensing.
- Review branch `review/pj2608-0553-b1-lifecycle-20261030`, based on selected B14 commit `59190ad6`. Detailed assumptions: `20261030_B1_FULL_PROJECT_BUDGET_REVIEW.md`.
- Reused existing module `bid.budget.working.bc.b1.audit.engineering-review` (B1.A.3); no module IDs renamed. Added explicit non-posting duration comparison and source calculation.
- Current selected B1 THB421,180 / USD13,400 is unchanged. A+B USD888,900, B14 USD25,000, B4/B12 N/A, and C1/C2 USD97,500/23,000 unchanged in Source/Scope/Release/native XLSX.
- Six/nine/twelve-month cases with unverified residual SI block: candidate B1 USD20,700/24,300/27,900; increases USD7,300/10,900/14,500. PMO + existing licensing before the SI block: USD17,200/20,800/24,400. No duration is owner selected or a verified final project schedule.
- Weekly role assumptions replace existing milestone labour, not add to it: PM4h, Coordinator8h, Admin3h, Procurement2h, Accountant1h, FinanceManager0.5h. Nine-month case is39 weeks /721.5 combined support hours. Regulatory40h replaces old12h. Same existing monthly salary/load/GM assumptions.
- SI144h are six new estimator decision packages with unapproved RACI, using existing PM salary90k as a clearly labelled SI cost proxy. Do not present as a verified engineer rate or complete approved engineering scope. B2 already has963.76 MH/131 objects; all six packages need per-deliverable overlap checks with B2/A/OEM/B3/B9. Do not restore old964-MH B1 price.
- Existing Myanmar package Cost200k including96250 reserve remains once. Instrument Wireless Gateway/Antenna extra price stays NULL, and the earlier illustrative USD1600 is not added. Partner quote/models/quantities/serials/actual fee and validity period remain open. No assumption that reserves are all free.
- New model sensitivity/invalid inputs/nonmutation and existing B1 role/accordion validators passed; Official/native USD XLSX passed; production webpack passed with3 standard bundle warnings. Interactive browser QA could not run: Chromium absent and browser download returned invalid ZIP; server-rendered panel passed. No merge or customer issue.


### 30-Oct-2026 follow-up — Instrument licence allowance THB100,000
- Owner requested approximately THB100,000 for the new Instrument licence. Assistant explicitly interpreted this as incremental provisional SELL, replacing the prior illustrativeUSD1600, and recorded it in the existing non-posting B1 review. Actual partner cost/fee/quote remains NULL; no automatic10% uplift or reserve credit.
- Earlier review Instrument SELL=NULL statements above are superseded. Full-project duration/SI cases remain unselected; Working/Scope/Release/native prices unchanged.
- Combined6/9/12-month candidate B1 USD23,800/27,400/31,000. Nine-month THB862,675.74 is converted and rounded once; increaseUSD14,000 over original B1USD13,400, potential A+BUSD902,900. Never add separately rounded licenceUSD3200 to baseUSD24300.


### 30-Oct-2026 — Owner selects B1-only implementation and port3053
- User request: verify only B1 changes, apply the reviewed price and open0553 on3053. Nine-month B1 now selected at THB862,675.74 / USD27,400; A+B USD902,900; PartB THB6,223,782.87. Delta from previous selected B1 THB441,495.74 / OfficialUSD14,000.
- Source: b1ProjectSupportBudget0553.js uses existing lifecycle evaluator + user Instrument100k SELL. Prior24-Oct budget is isolated as b1ProjectSupportBaseline0553.js; no964-MH legacy price restoration. All prior B1 role/expense IDs retained, recurring roles replace old hours, SI144h budget appears within B1.1, Instrument SELL100k once in B1.6. Eight account IDs unchanged.
- Complete planning cost remains NULL due to Instrument cost unknown; known partial THB647,996.59 is labelled partial. Direct Cost/profit, SI actual rate/RACI, actual project schedule, partner quote/fees remain open despite owner budget selection. No automatic second reserve,1600USD,10% uplift or price-policy change.
- Snapshot fixture0553-before-b1-selection-20261030.json captures every other Source/Official A/B/C row and annex fingerprints. New B1-only validator must prove exact equivalence outside B1, correct rounded totals and preserved historical IDs.
- Dedicated command: npm run start:0553 uses3053; default start and all0550 commands unchanged. URL http://localhost:3053/projects/pj2608-0553 . Use this branch in the separate0553 worktree, never switch the0550 working folder for this change.
- Regression baseline changes outside B1 are updated aggregate expected totals only, not other item prices. Existing B14/C1/C2 values and exclusions remain locked. No merge or customer issue.

- Final validation for selected B1: all151 validator steps in the152-step build chain checked, updating only stale aggregate/B1 expectations and resuming failed steps; production webpack passed with3 standard bundle warnings. B1-only Source/Official/annex fingerprints pass; original B1 source IDs retained; native THB/USD XLSX passes. Dedicated npm run start:0553 compiled successfully and served http://localhost:3053/projects/pj2608-0553 with HTTP200/browser HTML Accept. Full interactive Chromium QA remains unavailable as previously recorded.
