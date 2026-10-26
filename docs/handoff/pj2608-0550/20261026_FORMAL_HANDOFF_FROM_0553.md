# GENESIS — FORMAL HANDOFF: PJ2608-0553 methodology to PJ2608-0550

**Date:** 2026-10-26 (Asia/Bangkok)  
**Status:** Public-safe transfer of methodology and working instructions; NOT a merge of 0553 code or project data.  
**Project to open in ChatGPT:** **PJ2608-0550**. Do not continue 0550 development in the 0553 Project chat as if they share one financial source.

## A. Absolute baseline and decision precedence

- Repository: `addvalue-genesis/genesis-portal`.
- Target protected/reference development branch: `feat/pj2608-0550-tpp-ui-rev04` (at handoff branch creation, base commit `40aee8b5aa428cd2eb58701b35ad0b2f98d9d0cb`).
- This document is on the separate documentation-only branch `docs/pj2608-0550-handoff-20261026`; do not change the 0550 reference branch without a validated, reviewed PR.
- Independently measured 0550 performance branch: `perf/pj2608-0550-baseline-20261026`, Draft PR #44. CI passed: https://github.com/addvalue-genesis/genesis-portal/actions/runs/40340479212. **Not merged.**
- 0553 source of *methods only*: `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024`, Draft PR #39. The GENESIS architecture/equation documentation is Draft PR #42 (to a 0553 branch) and must NOT be presumed to be on 0550.
- 0553 PERF-00 is Draft PR #43, also separate. Do not cherry-pick financial Source/Release logic or project facts from it.
- The 0550 controlled dataset is `frontend/src/project0550/data/snapshots/pj2608-0550.rev07.json`, whose **internal dataset ID** is `PJ2608-0550_TPP_CONTROLLED_SNAPSHOT_REV10_BUDGETARY_20261008`; filename and data revision differ. **Neither should be changed by a documentation handoff.**
- 19 systems, five groups; separate 0550 project facts, vendor conditions, engineering source hierarchy and budgetary issue. The previously issued SAMTEL emergency budgetary snapshot is **FROZEN**. Overall 0550 final/base figures and selected PAGA conversion have HOLD/OPEN fields. `null` is never zero.
- Dolibarr/AGERP connector is currently unavailable; do not block read-only GitHub work or replace DB facts with guessed defaults.

## B. What is already implemented in 0550

| Layer | Canonical existing implementation | Treatment |
|---|---|---|
| Controlled source | `project0550/data/repository.js`, `data/adapters/controlledSnapshotAdapter.js` | Reuse, snapshot validated/cached; do not create second data source |
| 19 systems + UI | `pages/PJ26080550.jsx`, `project0550/data.js` | Reuse existing eight-tab view, system tokens, evidence and price display |
| 0550 mathematical methods | `project0550/serviceEquationModel.js` | E01–E18 already defined; bind to real 0550 work objects and calibrated inputs |
| Engineering knowledge | `project0550/knowledgeKernelBinding.js`, `knowledge-kernels/library` | Reuse existing eight engineering kernels; applicability is project-specific |
| Architecture registry | `project0550/moduleRegistry.js`, `architectureManifest.js` | Fifteen registered architecture modules; preserve IDs and lifecycle states |
| Native quote export | `project0550/exportOriginalPriceForm.js` | Preserve original template/source controls and immutable issued snapshots |
| Current test | `frontend/scripts/validate-pj2608-0550-data.cjs` | Run `npm run validate:pj0550-data` and `npm run build` |

## C. What crosses the project boundary (method) and what does not (facts)

1. **GEQ-001…033:** controlled common mathematical equation forms found in 0553's prior equation register. Treat these as a *method reference*. Do not replace the existing 0550 E01–E18 or import 0553 coefficient/rate/scenario values. Establish a row-by-row mapping and applicability/evidence status first.
2. **PEQ:** particular equations must be *rebound* to 0550 RFQ/MR/BOD/DTS/SPE, WBS service owners and source validity. A 0553 PEQ ID is not a validated 0550 parameter.
3. **GMR:** module ID, parent–child hierarchy, renderer, exact navigation, cost-owner display, read-only projection and Source→Release→Source→Release audit are reusable *architecture contracts*. Verify whether each contract is already implemented in 0550 before porting any 0553 UI code. The 0550 app is NOT automatically declared to have full 0553 row-roundtrip support.
4. **GKR:** recover relevant past chats into reviewed decision records: `decision_id, project_id, source_chat_reference, date, state, superseded_by, code_sha, evidence_ref`. Chat is evidence of instructions, not an automatically approved financial source. Keep private chat contents in ChatGPT/restricted records, NOT in this public GitHub repo.
5. **GPE:** performance equations proposed in the architecture documentation: revision-aware cache, acyclic compute dependency graph and minimal invalidation, indexed lookup, one canonical derivation consumed by read-only views, output-parity acceptance. Treat GPE IDs as documentation/control proposals, not as an already deployed common engine.
6. Code flow for each 0550 system: `Requirement → Applicability → Driver → Engineering Calculation → BOM/TAG/MTO → Cost/Service Owner → Working SELL → Budget/Release Preview → Original Export`. Preserve all existing 0550 authority and gate rules.

**Never transfer from 0553 to 0550:** vendor unit prices, selected supplier SKUs, location quantities, labor days/rates, FX assumptions, WBS totals, Rev08 historical commercial numbers, 0553 customer format, approvals or 0553 financial owner IDs.

## D. What PERF-00 confirmed (no code optimization yet)

- Independent 0550 Linux Node 24 CI: 19 systems, five groups, eight kernels, 15 registry modules, validation and production build all PASS.
- Warm median timings from 0550 CI: all-system search ~0.001 ms; PAGA search ~0.003 ms; existing grouping ~0.001 ms; kernel binding ~0.008 ms; Overview React SSR ~0.557 ms. These are **not** the owner's browser timings.
- **Decision:** 19-element grouping is not a demonstrated performance bottleneck. Do not refactor that loop first. Next profile PAGA detail, system views, budget/working switch, workbook export in an actual browser.
- On 0553, separate PERF-00 found repeated canonical B/C selector calls in a tested workbench sequence. This is a 0553 signal, **not** proof of the same issue in 0550.

## E. Next execution order in the 0550 ChatGPT Project

**0550-START-01 — Baseline and source authority**  
Read 0550 branch and controlled snapshot; verify 19 IDs and frozen issue are still unchanged; inspect existing older handoff/checkpoint files only if actually accessible. Historical local-only names included `11_NEW_CHAT_RESUME_PROMPT.md` and `00_HANDOFF_CURRENT.md`; they were NOT found at the 0550 GitHub branch root during this handoff.

**0550-START-02 — PAGA pilot**  
Use the current 0550 RFQ/BOD/MR/DTS/SPE, existing selected vendor evidence and `TEL-PAGA` bindings (ACOUSTIC, POWER, RELIABILITY). Build a **read-only evidence/requirement-to-equation/BOM/price coverage** before modifying the commercial ledger. PAGA amount/FX release stays HOLD until 0550 source authority closes it.

**0550-START-03 — 19-system coverage matrix**  
For each system token, capture: Requirement Source, Equipment/Functional SKU, Engineering Kernel, E01–E18 binding, TAG/site/quantity proof, WBS Cost Owner, Current Quote authority, OPEN gaps, output module, validation. Count missing source coverage explicitly.

**0550-START-04 — Reuse compatibility and display**  
Use existing 0550 components first. Bring reusable 0553 contracts only where a gap is proven. Preserve exact 0550 Module IDs, original customer native workbook and project-specific JSON/Data Adapter.

**0550-START-05 — Performance and controlled optimization**  
Profile real PAGA and multi-system UI; optimize proven repeated selectors before UI micro-loops; validate all existing results by baseline comparison. No business-rule or pricing changes to make timing tests pass.

**0550-START-06 — Rollout and Review**  
Expand validated pilot patterns system by system, keeping OPEN gates explicit and performing exact Source ↔ Output trace and commercial approval checks.

## F. Handoff acceptance definition

1. The new 0550 chat explicitly opens the **0550 project and protected reference branch**, not 0553.
2. New chat reads this handoff and `docs/architecture/GENESIS_0550_EQUATION_REUSE_MANIFEST_Rev00.md`.
3. First working artifact is **the 19-system coverage/equation/source ownership matrix**, focused on PAGA; not a rebuilt 19-system UI, new independent cost engine or premature vendor repricing.
4. Actual GitHub edits use isolated 0550 branches and draft PRs. Never merge 0553 PRs #39/#42/#43 into 0550 blindly.
5. Software tests must include 0550 controlled dataset PASS and compare outputs with the frozen source snapshot. Engineering/Commercial Release requires separate evidence and approval.
6. Reuse and audit statuses are recorded as `EXISTS_VERIFIED`, `REFERENCE_ONLY`, `OPEN`, `SUPERSEDED` or `NOT_IMPLEMENTED`—not assumed PASS.

## G. Exact copy/paste instruction for a new 0550 ChatGPT Project chat

> Continue **PJ2608-0550**, 19-system SAMTEL/PTTEPI ASK TEL, based on existing GitHub `addvalue-genesis/genesis-portal` branch `feat/pj2608-0550-tpp-ui-rev04`; reference approved source snapshot and frozen customer budgetary issue. Read the new handoff in branch `docs/pj2608-0550-handoff-20261026` and its Equation Reuse Manifest, then inspect 0550 code, `serviceEquationModel.js`, `moduleRegistry.js`, and `knowledgeKernelBinding.js`. Carry GEQ/PEQ/GMR/GKR/GPE from 0553 as reusable method/control only; do not copy 0553 financial facts/rates/FX/SKUs. Start PAGA requirements→equations→BOM→cost coverage and inventory the other 18 systems. Preserve `null`/HOLD, freeze the 0550 issued snapshot, and measure browser slowness before refactoring. Use isolated Branch/PR and actual validators; do not create a new GENESIS app or alter the 0550 reference baseline without reviewed evidence. Report what is implemented vs reference/proposed; proceed without repeating past questions.

**No code, customer prices, DB, public source documentation, or release status is authorized to change by this handoff.**
