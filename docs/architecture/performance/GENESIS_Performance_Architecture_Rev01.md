# GENESIS Performance Architecture & Audit — Rev01

**Date:** 2026-10-26  
**Status:** Public-safe READ-ONLY code inspection and proposed optimization. No runtime benchmark or measured speedup is claimed.

## Scale and inspected implementation

- Project 0550 covers **19 telecom systems**. Its controlled JSON adapter already validates and caches a snapshot once; do not replace this established cache without evidence.
- The 0550 React page has approximately 2,113 lines, with filters, grouping, accordions and budget views. The systems view memoizes query filtering; repeated per-group filters are a candidate, but 19 rows alone are normally inexpensive.
- 0550 Knowledge Kernel Binding maps shared engineering law kernels to project systems; preindexing may help only when profiling confirms an issue.
- 0553 Commercial Workspace and Release Model can derive overlapping B/C information through selectors. Instrument call counts and invocation trees before introducing shared cache/state.
- The 0553 Module Search builds lists of navigable modules. Search indexing can be revision-bound; do not let typing a query trigger unnecessary financial calculations.
- Browser UI, computation, export, CI/test/build, remote service and Chat/retrieval latency are **different performance classes**.

## GPE controls (proposed)

**GPE-001: Revision-aware cache**

CacheKey = Hash(ProjectID, SourceRevision, EquationRevision, PolicyRevision, MaterialInputHash)

Use a cached immutable derived result only when the complete key still matches. Never cache across independent projects based only on Module ID.

**GPE-002: Dependency-graph invalidation**

Affected(SourceChange) = SourceChange UNION Descendants(VerifiedComputeDAG, SourceChange)

Recalculate affected nodes topologically. Reject compute-dependency cycles. The Source -> Release -> Source visual/audit loop is navigation, not a recursive compute dependency.

**GPE-003: Indexed lookups**

Replace repeated array scans with a stable lookup index where profiling shows enough repetitions. Index by project/data revision plus system/site/TAG/source row, preserving row order and source identity. For N systems and G groups: repeated full grouping may cost O(N*G), while a one-pass grouping costs O(N+G). At N=19, benchmarking is mandatory before claiming an improvement.

**GPE-004: Single canonical derivation**

Canonical = Compute(Source, Equations, Policy)

Working, Scope, Release and Native Export = ReadOnlyProjection(Canonical)

Avoid repeated invocation of expensive selectors for unrelated UI state changes. Cache invalidation must follow all material inputs and policy revisions.

**GPE-005: Output parity**

OptimizedOutput(item) == BaselineOutput(item)

Acceptance includes Source ID / Trace ID / Module ID, quantities, cost owner, selected financial amounts, unknown/null states, rounding, optional-vs-base separation and original native workbook structures. Accept only explicitly authorized rounding tolerances.

## PERF-00: measure first

1. Lock exact Git SHA, project snapshot/source revision, hardware, browser and build mode.
2. Measure initial page mount, search keypress, expansion of system/module details and navigation roundtrips.
3. Instrument canonical selectors with call counts, elapsed time, input counts and a full stack path when duplicate execution is suspected.
4. Profile native export with formula reconciliation and file-size/shape checks.
5. Measure Node validations and webpack separately; report memory usage.
6. Record top hot functions and baseline p50/p95 where repeat measurements are practical.

Do not change business formulas in PERF-00.

## Safe staged implementation

| Stage | Action | Acceptance |
|---|---|---|
| PERF-01 | Memoized/indexed 0550 search and grouping | All 19 systems, filters and order preserved |
| PERF-02 | Cached kernel-to-system map per revision | Same equations, applicability and evidence status |
| PERF-03 | Lazy-render measured heavy React views | Same Module IDs, view controls and deep-link behavior |
| PERF-04 | Shared immutable 0553 canonical selector results | Unchanged Working/Scope/Release price authority and trace |
| PERF-05 | Compute DAG and incremental recomputation | Exact parity against full fresh recalculation |
| PERF-06 | Export and CI optimization | All existing validators plus native output checks |

## Distinct change-loop contracts

- **Read-only UI loop:** Source → Release → exact Source → exact Release. Must work; never write backward.
- **Calculation pipeline:** Source revision → compute DAG → derived projections. Must be acyclic and invalidate correctly.
- **Development feedback loop:** profile → patch → tests → measured before/after. This loop is an engineering workflow, not runtime recursion.

## Required report

Baseline SHA | Tested project/data revision | Scenario and input count | Call count | Time p50/p95 | Memory | Changed functions | Parity & regression | Follow-up risks

This file is developer methodology, not an authorization to change source data, customer-approved pricing, frozen documents or release state. Do not add confidential proposals or vendor financial evidence to this public GitHub repository.