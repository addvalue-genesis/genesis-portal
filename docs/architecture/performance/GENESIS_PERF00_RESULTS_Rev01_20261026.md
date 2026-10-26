# GENESIS PERF-00 — Measured Baseline Results, Rev01

**Date:** 2026-10-26; status: **MEASURED / READ-ONLY / PASS**. Do not interpret these results as an approved optimization or an engineering/customer price release.

**Measured code:** PR #43, source branch `perf/genesis-perf-00-20261026` based on 0553's current working branch. Measured PR-check synthetic merge SHA: `c511b2b91602a50cd486c2d3be614056a216f634` (not the branch head). Runner: GitHub Actions Ubuntu Linux / Node v24.21.0 (not the owner's workstation).

**Reproducible evidence:** [GitHub Actions run 40339243478](https://github.com/addvalue-genesis/genesis-portal/actions/runs/40339243478), job `selector-baseline`. All job steps passed, including both read-only scripts.

## Source/shape assertions passed

- PJ2608-0550: 19 controlled systems across five system groups; source snapshot is cached after validation.
- PJ2608-0553: 16 B/C working cost-owner records, 14 customer Part B lines and 16 exact financial spare lifecycle trace rows.
- Indexed 0550 grouping reference produces *identical membership/order* to the existing implementation.
- No selected cost/price source, project snapshot, supplier quote, application JSX or customer workbook was changed.

## CI median measurements (warm calls)

| Phase | Median ms per invocation | p95 ms per invocation |
|---|---:|---:|
| 0550 controlled snapshot cached load | below reported 0.001 ms resolution | below reported 0.001 ms resolution |
| 0550 existing 19-system grouping | 0.003 | 0.025 |
| 0550 indexed grouping reference (not deployed) | 0.002 | 0.006 |
| 0550 knowledge-kernel system binding | 0.016 | 0.037 |
| 0553 canonical B/C selector | 11.982 | 21.432 |
| 0553 Scope adapter | 13.062 | 14.093 |
| 0553 Release projection | 16.109 | 23.229 |
| 0553 B/C module navigator | 14.688 | 19.229 |
| 0553 BULK module navigator | 8.921 | 11.139 |
| 0553 Scope module navigator | 9.653 | 10.700 |
| 0553 full read-only derivation sequence | **70.334** | **81.448** |

**Important:** Only a small number of warm samples were collected per operation. These are CI measurements, not stable service-level promises. A prior independent PR-check run 40338827321 gave 0553 full sequence median 51.375 ms and 0550 group median 0.001 ms, showing runner variability. Browser render, network, typing latency, Excel export and the user's hardware have NOT been measured here.

## Confirmed repeat-call signal

Instrumentation wrapped the **existing** `selectBcTurnkeyWorkingCost0553()` export in the benchmark process only. This did not change the app, source values or financial posting.

| Executed read-only phase | Calls of canonical B/C selector |
|---|---:|
| Canonical direct | 1 |
| Scope adapter | 1 |
| Scope price audit | 1 |
| Release projection | 1 |
| B/C module navigator | 1 |
| BULK module navigator | 0 |
| Scope module navigator | 1 |
| **Explicit full workbench derivation sequence** | **6** |

This **proves six invocations within the profiled explicit sequence**; it does not prove that React executes this sequence six times per keystroke or that these invocations alone explain the owner's perceived slowness. That requires browser/React Profiler evidence.

## Recommendation and next isolated change

1. **Do not optimize the 0550 19-item loop first**: measured single-grouping work is negligible versus 0553 selectors. Preserve the 0550 existing controlled JSON cache.
2. Start PERF-01 by reducing repeated canonical B/C derivation calls through an **optional, injected immutable canonical selector result** into read-only Scope, Release and Navigator adapters. Changes must be minimal and backward compatible, not a second financial engine.
3. Cache the result at a boundary with a complete Project/Source/Equation/Policy/Input revision key; do not cache under a mere UI tab or currency. Recompute dependent results after an authorized source update.
4. Run precise React/Browser measurements: 0550 page mount and expand PAGA; 0553 workbench mount, module search typing, B10/C2 roundtrip and native Excel export. Record machine/browser revision.
5. Require pre/post equality of all canonical identifiers, quantities, prices, Source→Release exact rows, null/HOLD states, no double counting, six-sheet original export and existing full validators. The optimization is not eligible to merge without these tests.

## Outside scope / safety

- The common code was inspected from the active 0553 branch; this measurement does **not** imply the current 0550 feature branch has been merged into 0553.
- No Dolibarr/AGERP connection was used.
- No production frontend code changed, no repricing, no source overwrite, no release or merge.
- Public repository: no customer costs, personal messages, vendor prices or private source files are logged in this report.
