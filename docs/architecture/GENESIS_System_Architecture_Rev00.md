# GENESIS System Architecture & Integrity — Rev00

**Date:** 2026-10-26  
**Status:** PUBLIC-SAFE / READ-ONLY ARCHITECTURE PLAN. This is not a completed system-wide audit, a customer quotation, a current benchmark, or an authorization to modify financial ledgers.

## Purpose

Evolve validated GENESIS implementation rather than rebuild it. Recover relationships between source code, equation register, original customer requirements, module rendering, historical decisions, data adapters, release projections and tests. Project 0550 includes 19 telecom systems; 0553 includes four MR groupings. Reuse common functionality, **not another project's source facts**.

## Controlled flow

1. Authoritative requirements, MR/MTO, BOD, drawings, vendor evidence and approved decisions
2. Engineering GEQ kernel and project PEQ equation bindings
3. Canonical BOM, TAG, quantity and source evidence
4. WBS / direct cost evidence / selected Working SELL, each with exact authorized owner
5. Read-only Working, Scope, Release and Official Export projections
6. Exact Source ID, Trace ID and Module ID back-navigation with independent acceptance gates

## Architecture families

| Family | Purpose | Current interpretation |
|---|---|---|
| GEQ | Controlled mathematical engineering/cost forms | Existing GEQ-001…033 register; new IDs require controlled review |
| PEQ | Project-specific equation/source binding | Existing references; implementation completeness must be audited |
| GMR | Module identity, layout, hierarchy, visual state and routing | Several implementations exist; cross-project registry is proposed |
| GKR | Code/chat/document knowledge recovery and reuse | Governance proposal, not an autonomous approved decision engine |
| GPE | Dependency-aware performance control | Proposed controls; timing must be measured |

## Module contract (proposed record)

- Identity: projectId, moduleId, parentModuleId, moduleKind, version, status
- Trace: sourceRef/sourceRevision, Source ID, Trace ID, Equation IDs, selected Cost Owner
- Execution: canonical selector, dependency inputs and consumers, view/adapter component
- Verification: validator paths, approved state, source-to-output parity and change evidence

A registry record cannot be declared verified just because a matching UI link exists. Each ID must resolve to an actual rendered module and authoritative source.

## Source–Release–Source–Release roundtrip

For any source row S(i) and its release projection R(i):

S(i) -> read-only projection R(i) -> navigate back to exact S(i) -> return to exact R(i).

The navigation roundtrip is **not** a recursive calculation. Release must never edit canonical Source automatically. On an authorized source revision, recalculate affected downstream derivations and test Source/Release/Excel parity. Unknown remains null, never zero. Optional groups must not enter the base without explicit commercial authority.

## Controls against duplicate computation or posting

- A source financial line or physical stock line has one authorized financial owner.
- No independent price engine inside React renderer, scope adapter or native exporter.
- Do not derive verified direct COST from Working SELL or historical offer comparisons.
- Keep project namespace and data revision in lookup/cache keys.
- Reject compute-dependency cycles; an audit/navigation return link is not a compute dependency edge.

## Proposed audit and rollout sequence

1. Freeze exact repo SHA, dataset/equation revision and current output baselines.
2. Inventory existing modules, engineering equations, test scripts, sources and unresolved decisions.
3. Generate read-only dependency and Source-to-Release trace matrix.
4. Verify unique Module/Source/Trace IDs, existing GET adapters, and all project-specific bindings.
5. Measure performance before optimizing; preserve UI IDs, financial identity and original-format outputs.
6. Require separate software, engineering and commercial approvals before issue or deploy.

## Confidentiality and status

The repository was PUBLIC at inspection. Only general architecture and code-path references belong here. Commercial data, vendor quotations, detailed private source documents and full project chat histories belong in access-controlled systems. The detailed human-language guide is supplied separately as a PDF and does not become a legal or commercial approval record.