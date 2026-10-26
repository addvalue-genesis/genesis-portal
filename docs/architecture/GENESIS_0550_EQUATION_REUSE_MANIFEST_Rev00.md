# GENESIS Equation and Module Reuse Manifest — PJ2608-0550 Rev00

**Date:** 2026-10-26  
**Status:** GOVERNED REUSE PLAN / NOT EXECUTABLE MIGRATION.  
**Authority order:** current 0550 source documents and user-approved decisions > current controlled 0550 data/registered equation bindings > project methods verified in shared code > 0553 prior models (reference only). **No 0553 cost or RFQ source values may be copied.**

## 1. Already existing and callable in 0550

- `frontend/src/project0550/serviceEquationModel.js`: 18 project service/workload equation forms **E01–E18** (recovered from the earlier 0550 service-equation model). Existing method and commercial treatment must not be silently changed.
- `frontend/src/project0550/knowledgeKernelBinding.js`: eight Engineering Knowledge Kernels with particular bindings for 19 systems. Selected PAGA binding includes ACOUSTIC, POWER and RELIABILITY. An empty kernel list denotes `KERNEL_REVIEW_REQUIRED`, not `N/A` or `PASS`.
- `frontend/src/project0550/moduleRegistry.js`: 15 architecture Module records; module lifecycle states are separate from cost/engineering acceptance.
- `frontend/src/project0550/data/adapters/controlledSnapshotAdapter.js`: current controlled dataset validated and cached. Source revision/date and final HOLD status are immutable across this transfer.
- `frontend/src/pages/PJ26080550.jsx`: existing UI and 19-system filtering, grouping, engineering and budget views. Do not rebuild to implement this manifest.
- `frontend/src/project0550/exportOriginalPriceForm.js`: existing customer workbook export. Preserve native format and issued historical snapshot.

## 2. Controlled relationship: 0550 E01–E18 to 0553 GEQ method forms

This is **a method-family crosswalk to verify**, not proof that 0550 consumes the 0553 runtime code.

| 0550 E | Existing 0550 role | GEQ forms worth comparing as reference | Transfer decision |
|---|---|---|---|
| E01 | Applicability & role workload | GEQ-001/004/005/026 | Preserve 0550 particular drivers |
| E02 | Document lifecycle | GEQ-009/010/024 | Preserve VDRL issues/revisions; separate authoring vs DC |
| E03 | Project management | GEQ-005/008/020 | Preserve 0550 staffing/calendars |
| E04 | Interface engineering | GEQ-025 | Each controlled interface edge counted once |
| E05 | Event attendance | GEQ-005/006/023 | Do not equate productive time with paid attendance |
| E06 | Capacity and duration | GEQ-006/007 | Check crew/access/resource constraints |
| E07 | Internal labor cost | GEQ-008/018 | Cost rate != selling rate |
| E08 | Trip cost | GEQ-013/014/015/016/017 | One physical trip charged once |
| E09 | Direct service cost | GEQ-018/020/021 | Confirm cost owner; do not infer from Working SELL |
| E10 | Direct selling rates | GEQ-033 | 0550 commercial policy takes precedence |
| E11 | Cost-plus markup | GEQ-033 | Do not conflate markup with margin |
| E12 | Target gross margin | GEQ-033 | Do not conflate margin with markup |
| E13 | Prime-contractor layer | GEQ-033 | Never import 0553 customer/prime percentages |
| E14 | Shared cost allocation | GEQ-020/022 | Causal allocation, no uniform /19 split |
| E15 | Variation/retest | GEQ-024/027/028 | Entitlement and change authorisation separate |
| E16 | Training | GEQ-005/018/026 | Keep 0550 audience/session and instructor evidence |
| E17 | FX conversion | No dedicated GEQ FX equation verified; GEQ-033 is commercial treatment only | Retain 0550 E17 and controlled 0550 FX source/date; do not import 0553 FX |
| E18 | Material→installation MH driver | GEQ-002/004/005/032 | Purchase/spares do not automatically become installation MH |

**Note for E17:** There is no independently established dedicated GEQ FX equation in the 33-form register on this review. Do not invent a new GEQ ID. Retain 0550 E17 FX conversion under its own currency policy and evidence.

## 3. GMR — Module rendering and source loop (PROPOSED CONTRACT)

Each module record shall carry `projectId, moduleId, parentModuleId, sourceRowId, traceId, owner, canonicalSelector, viewId, testId, sourceRevision` where applicable.

- `GMR-001` identity and hierarchy; parent-child controlled.
- `GMR-003` source→read-only view binding; no duplicate price calculation inside JSX.
- `GMR-005` expand ancestors for exact module navigation.
- `GMR-008` `Source(row) -> Release(row) -> exact Source(row) -> exact Release(row)` audit roundtrip.
- `GMR-009` hierarchical price subtotal from **eligible unique owner lines**.
- `GMR-011` visible Release vs native export mapping validation.

These are **Architecture Acceptance Rules** originating from validated/partial 0553 patterns, not a claim that a complete 0550 implementation already exists. Track implementation by exact file/validator after verification.

## 4. GKR — Knowledge/Chat/Code recovery (PROPOSED GOVERNANCE)

`KnowledgeRecord = (ProjectID, RequirementID, DecisionID, EvidenceRef, Date, Authority, Status, Supersedes, CodeSHA, ValidatorID)`

Use explicit `APPROVED / WORKING / OPEN / SUPERSEDED` flags and cite original source documents. A chat suggestion is not automatically approved. GitHub public documentation must not contain private chat text or commercial secrets.

## 5. GPE — Performance control (PROPOSED, measured baseline exists)

- `GPE-001`: cache key = `Hash(ProjectID, SourceRevision, EquationRevision, PolicyRevision, MaterialInputHash)`.
- `GPE-002`: recompute descendants in an acyclic **compute** dependency graph after authorized source change.
- `GPE-003`: indexed source/TAG lookups where profiling proves repeated scans matter.
- `GPE-004`: derive canonical result once, read-only projected in Working, Scope, Release and Native Export.
- `GPE-005`: optimized output and baseline output must have exact Source/Module/Trace/financial identity, and same properly rounded amounts and nonposting states.

The Source→Release→Source→Release **navigation loop is required**; recursive Source–Release price recomputation is prohibited.

0550 PERF-00 run [40340479212](https://github.com/addvalue-genesis/genesis-portal/actions/runs/40340479212) measured very small time for the 19-item filter/group and an Overview SSR baseline. Focus on measured browser PAGA and heavy detail/excel work rather than premature micro-optimizations.

## 6. Minimum 19-system equation coverage record

`{projectId,systemToken,sourceRevision,requirementId,sourceRef,equationId,engineeringKernel,qtyDriver,bomTag,sourceRowId,costOwner,pricingAuthority,moduleId,releaseRowId,validatorId,status}`

Coverage shall be counted per applicable requirement, not inferred merely because a system appears in the UI. Formula presence or numeric calculator output is not proof of verified technical compliance, pricing authority or customer submission.

## 7. First work sequence

1. Inspect `serviceEquationModel.js` E01–E18, eight knowledge kernels, 15 existing Module Registry records and frozen 0550 Rev10 controlled JSON.
2. Build a read-only coverage table for all 19, first deeper review on PAGA.
3. For each desired 0553-derived capability, label `ALREADY_EXISTING_0550`, `METHOD_REFERENCE`, `ADAPT_TO_0550`, `REQUIRES_NEW_CODE` or `NOT_APPLICABLE_PROVED`.
4. Keep all source facts from 0550; correct controls only with evidence and management approval.
5. Run project 0550 baseline validators, browser profiling, exact output parity and separate engineering/commercial approval gates.
