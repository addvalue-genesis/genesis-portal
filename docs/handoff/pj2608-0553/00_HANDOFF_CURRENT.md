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
