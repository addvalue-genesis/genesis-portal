# PJ2608-0550 — Single Source Module Architecture & Revision Propagation Rev00

Status: CONTROLLED WORKING ARCHITECTURE  
Date: 2026-10-07

## 1. Core rule

No module owns an independent copy of project truth.

Canonical project state lives in controlled MariaDB objects with JSON snapshots/exchange representations. React modules are projections, policy/decision surfaces, method/engine surfaces, controls, or output renderers over the same state.

Graphs and charts are presentation projections only.

## 2. Module roles

| Module | Role | May own independent project truth? | Controlled write |
|---|---|---|---|
| 1.0 Bid Overview | Projection | No | None |
| 2.0 Executive Commercial Strategy | Policy / Authority | No | Approved commercial policy / decision only |
| 3.0 First Principles / CBE / Parametric Model | Engine / Method | No project facts | Method/equation definitions only |
| 4.0 Smart Engineering Control Spine | Orchestrator | No | Findings, proposals, readiness / impact state |
| 5.0 Bid Form Tracker | Controlled Projection | No | Bidder response / disposition state |
| 6.0 Scope / Compliance | Controlled Projection | No | Compliance / clarification / response disposition |
| 7.0 ASK-TSI Priced Breakdown | Output | No | None; render/export only |
| 8.0 Deviation Control | Output-Control | No | Deviation lifecycle linked to originating requirement |
| 9.0 VDRL / Document Production | Output-Control | No | Document occurrence/revision/issue state |
| 10.0 Submission Outputs | Output | No | Package assembly only |
| 11.0 Team Access | Governance | No | Access/permissions |
| 12.0 19-System Engineering | Controlled Workbench | No duplicate copy | Canonical engineering state |
| 13.0 Independent Review | Governance / Audit | No | Review findings/dispositions |

## 3. 1–6 are not a linear set of separate databases

They are different views/controls over one canonical state.

- 1.0 summarizes.
- 2.0 supplies approved commercial policy/authority.
- 3.0 supplies method/equations.
- 4.0 executes validation/orchestration over canonical dependencies.
- 5.0 projects requirements into bid-response form state.
- 6.0 projects the same requirements/evidence into scope/compliance/disposition state.

Therefore 5.0 and 6.0 must not duplicate requirement facts.

## 4. 7–10 are downstream output/output-control surfaces

7.0, 8.0, 9.0 and 10.0 all consume the same controlled state.

- 7.0 renders price schedule.
- 8.0 renders/manages exceptions/deviations that originate from controlled requirements.
- 9.0 manages document obligations/revisions that originate from source requirements and lifecycle obligations.
- 10.0 assembles already released outputs.

They are not independent calculation engines.

## 5. Revision propagation

Example: MR revision changes.

1. Register new etm_documents revision.
2. Preserve prior revision via supersedes_document_id.
3. Create etm_change_events.
4. Traverse the existing etm_trace_edges dependency graph.
5. Create etm_change_impacts for actually affected downstream objects.
6. Mark affected objects/actions: REVIEW / RECALCULATE / REGENERATE / INVALIDATE / INFORM.
7. Re-run First Principles / CBE / Parametric dependency gates.
8. Mark affected React projections/graphs STALE until rebuilt.
9. Regenerate affected outputs.
10. Store new etm_output_revisions with input snapshot hash and source revision snapshot.
11. Release only after mandatory gates close.

No source revision silently overwrites prior issued state.

## 6. Canonical dependency direction

Document Revision → Evidence → Requirement → Constraint / Interface / Input → CAL / Study / RPT / Proof → Architecture / Object / Quantity → Required MTO / Bulk → Vendor Reconciliation → Work / VDRL / Lifecycle → Cost / Risk / Schedule → Commercial Treatment → Bid Response / Deviation / Output Revision

Actual propagation follows registered trace edges, not a blanket assumption that every change affects everything.

## 7. Graph policy

A graph may show system/commercial group comparison, cost decomposition, labor/MH, vendor vs required, price source confidence, and revision/impact status.

But the graph reads canonical DB state, may persist UI preferences only, must not persist independent engineering/commercial facts, and becomes STALE when its input snapshot becomes stale.

## 8. Current implementation

- Project0550ModuleContract.js
- Project0550RevisionImpactModel.js
- useProject0550CanonicalState.js
- backend/api/etm/project-control-state.php
- 013_etm_revision_dependency_impact_control.sql

Existing etm_trace_edges remains the one dependency graph; no second dependency-graph table was created.

Modules already refactored to consume canonical DB state when available, with controlled code fallback:
- 5.0 Bid Form Tracker
- 6.0 Scope / Compliance
- 7.0 Price / graphs / ASK-TSI form
- 8.0 Deviation Control
- 9.0 VDRL / Document Production
- 10.0 Submission Outputs

Fallback data is a controlled development snapshot only and is not a second source of truth.
