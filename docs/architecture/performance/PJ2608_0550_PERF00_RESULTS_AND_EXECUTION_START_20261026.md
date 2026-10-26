# PJ2608-0550 — Start-of-Work and PERF-00 Baseline (2026-10-26)

**Status:** 0550 execution has started independently of 0553. PERFORMANCE MEASUREMENT DONE; optimization and new 19-system calculation implementation are NOT YET done.

**Source branch:** `feat/pj2608-0550-tpp-ui-rev04`  
**Isolated benchmark branch:** `perf/pj2608-0550-baseline-20261026`  
**Review:** Draft PR #44, not merged.  
**Verified CI:** [GitHub Actions run 40340479212](https://github.com/addvalue-genesis/genesis-portal/actions/runs/40340479212). Linux Node 24.21.0; snapshot validator, read-only benchmark and production webpack all successful. Webpack emitted three warnings, not build failures.

## Baseline shape

- **19 systems, 5 groups**, 8 engineering kernels, 15 registered architecture modules.
- Existing 0550 dataset is the controlled Rev10 budgetary snapshot dated 2026-10-08 (source filename still uses `rev07.json`; do not infer version from filename).
- The budgetary issued snapshot and selected PAGA proof/pricing HOLD are protected. `null` stays `null`.
- 0553 shares methodologies and common modules only; never auto-copy its financial facts or sources into 0550.

## Actual measured timings (CI, warm, not desktop browser)

| Function | Median ms | p95 ms |
|---|---:|---:|
| Search all 19 | 0.001 | 0.001 |
| Search PAGA | 0.003 | 0.019 |
| Group current algorithm | 0.001 | 0.003 |
| Group indexed reference | 0.001 | 0.002 |
| Kernel binding | 0.008 | 0.012 |
| React Overview SSR | 0.557 | 0.907 |

Initial load with Babel/module transpile ~216 ms; this is NOT production browser page load. Benchmark scopes, runner variance and code are in `frontend/scripts/perf-00-pj2608-0550.cjs`.

**Finding:** A 19-item filter is **not** a confirmed source of slowness. No grouping refactor is justified by these numbers. Browser navigation, heavy detail expansion and Excel output remain to profile separately.

## 0550 work now proceeds in parallel, without waiting for 0553 optimization

1. **PAGA pilot:** map exact RFQ/MR/BOD/DTS/SPE requirements and selected existing INDUSTRONIC vendor items into authoritative 0550 source rows; keep exchange-rate-dependent and unapproved amounts HOLD.
2. **19-system coverage:** build a read-only coverage inventory from the controlled dataset: source evidence, engineering kernel, working BOM/TAG, cost owner, vendor quote state, open issue and release gate. No new financial postings from historical references.
3. **Shared-engine reuse:** map proven common kernels and rendering/navigation contracts from 0553 into 0550 only after project-isolation/compatibility validation. Do not fork duplicate calculators.
4. **Browser/UI profiling:** measure PAGA opening and system focus, full 19-system group display, Working/Budget switching and native Excel, including render counts and browser memory.
5. **Minimal targeted refactor:** optimize only profiled hot functions, preserve all 19 module identities and original source/quote numbers, run existing validation and exact pre/post parity tests.
6. **Rollout:** complete one system at a time against explicit requirement coverage and supplier evidence; unknown source values do not become zero.

## Acceptance gates

- 19 distinct system tokens, 5 groups and correct subsystem/equation binding remain unchanged.
- All original 0550 snapshot, vendor selection, budgetary issue and PAGA HOLD states preserved.
- Source → Working → Customer Preview → source trace/back navigation deterministic (where implemented); do not mislabel the existing 0550 implementation as already full-featured 0553 parity.
- Performance gains are reported with measured before/after on the **same** work scenario and source revision.
- No changes to source facts, financial model, GitHub main, Dolibarr or customer Release before separate approval.

**Next active implementation task:** 0550 PAGA requirement-to-BOM/cost coverage and real browser performance profiling, not further speculative tuning of the 19-item loop.
