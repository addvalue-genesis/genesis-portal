# PERF-00 — Measured Baseline (read-only)
  
**Project scope:** PJ2608-0550 (19 telecom systems) and PJ2608-0553 (current four-MR working branch).
  
## Method

- Benchmark: `node frontend/scripts/perf-00-genesis-baseline.cjs` from `frontend/` after `npm ci`.
- GitHub Actions: `.github/workflows/genesis-perf-00.yml` runs the script with Node 24 on Ubuntu.
- Measures controlled 0550 snapshot cached-load, 19-system grouping (existing/reference indexed), Engineering Kernel binding, 0553 B/C canonical selector, Scope adapter, Release projection, B/C/BULK/Scope module indexes, and entire read-only workspace derived sequence.
- Each timing uses warm invocations with median/p95 of individual measured samples. Output is `GENESIS_PERF00_JSON=` on job log.
- Source-sensitive cost values, quotations and private project data are intentionally omitted from logs in this public repository.
- This is a **CI/Node selector measurement**. It is not a measurement of the owner's browser/PC, ChatGPT response latency, network/AGERP calls, native Excel export, or user-visible FPS.
- Performance numbers alone cannot authorize a code optimization that changes cost, quantity, Financial Source, Module ID, Source/Release trace, or Approval status.

## Required decision after first CI result

1. Verify runner, SHA and sample counts; record timing values (no prices).
2. Separate runtime model cost from module compilation/import warm-up.
3. Identify which selectors are recomputed during unrelated UI state changes, then instrument the browser separately.
4. Optimize only an evidenced high-cost path on a further isolated branch.
5. Run existing financial and exact Source→Release→Source regressions plus full build on the optimized change.
   
**Status:** Benchmark tooling committed; recorded run measurements are pending actual CI execution.
