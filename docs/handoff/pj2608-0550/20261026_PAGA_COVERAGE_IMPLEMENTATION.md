# PJ2608-0550 — PAGA pilot and 19-system coverage implementation

Date: 2026-10-26 (Asia/Bangkok). Status: read-only software increment; engineering and commercial gates remain OPEN/HOLD.

## Baseline and authority

- Protected baseline: `feat/pj2608-0550-tpp-ui-rev04`, SHA `40aee8b5aa428cd2eb58701b35ad0b2f98d9d0cb`.
- Isolated implementation: `feat/pj2608-0550-paga-coverage-20261026`. No merge, deployment, financial posting or customer issue.
- Read [PR #45](https://github.com/addvalue-genesis/genesis-portal/pull/45): root AGENTS.md, Formal Handoff and Equation Reuse Manifest at `64bb422c3fc2b1dfb6cdae9893478c6447ef3122`.
- Read [PR #44](https://github.com/addvalue-genesis/genesis-portal/pull/44) PERF-00 code/results. Also inspected [PR #42](https://github.com/addvalue-genesis/genesis-portal/pull/42) architecture/control proposals as method references only.
- Source: `frontend/src/project0550/data/snapshots/pj2608-0550.rev07.json`; internal dataset ID `PJ2608-0550_TPP_CONTROLLED_SNAPSHOT_REV10_BUDGETARY_20261008`.
- Snapshot SHA-256: `78832b4ea11b3c2781d3fe10183db071967056966e908bd63b570475fb84ed41`.
- This increment inspects existing repository evidence. It does **not** claim to have re-read the current native RFQ/MR/BOD/SPE/TC/vendor files or validated changes after the snapshot date.

## Implemented versus still open

| Area | Result |
|---|---|
| Existing 0550 foundation | 19 systems, five groups, eight kernels, 18 service equation definitions, 15 unchanged Module IDs verified |
| New read-only projection | `coverageModel.js` consumes the existing controlled dataset; no new financial data source or arithmetic engine |
| UI | First Principles → Coverage Matrix, under existing `MOD-REQ-COMPLETENESS`; select a system, inspect source pointers, open engineering equations and service candidates |
| PAGA pilot | Ten existing component records become review threads, with ACOUSTIC / POWER / RELIABILITY references and existing B/C service equation candidates |
| Trace | All 19 systems resolve to the existing 15 equipment output rows via explicit S01–S19 markers in frozen `internalTrace`; combined output rows remain combined |
| Requirement extraction | OPEN for all 19: complete requirement denominator and clause-level IDs absent from this projection; coverage percent stays null |
| Installed quantity / TAG / unique cost owner | OPEN for all 19 in the projected component records; scope-owner text is not promoted to unique financial ownership |
| Quote records | One system has a linked structured quotation record in this dataset; 18 lack such links. This is not a claim that their quotes do not exist elsewhere |
| Kernel applicability | Four systems retain KERNEL_REVIEW_REQUIRED: TEL-IPP, TEL-ES, TEL-MET, TEL-AIS |
| Final release | HOLD unchanged; prior issued budgetary snapshot remains separately frozen |
| GMR navigation | Exact native Source → Release → Source → Release navigation is NOT_IMPLEMENTED; JSON pointers are audit addresses, not a substitute |

## 19-system matrix

Component records are an inventory, **not** extracted requirements, installed TAGs or confirmed SKUs. Output identity means the system-level mapping exists; it does not prove each component is priced. No requirement percentage or arbitrary allocation is produced.

| No. | System token | Component records | Kernel IDs | Existing output row | Requirement / TAG / cost-owner closure |
|---|---|---:|---|---|---|
| 01 | TEL-LAN | 7 | OPTICAL, POWER, NET-CAP, RELIABILITY | A1-01 | OPEN |
| 02 | TEL-LAN-VCS | 4 | NET-CAP | A1-03 | OPEN |
| 03 | TEL-VSAT | 6 | RF-PROP, RELIABILITY | A1-02 | OPEN |
| 04 | TEL-VSAT-KU | 4 | RF-PROP | A1-01 | OPEN |
| 05 | TEL-PABX | 4 | NET-CAP, RELIABILITY | A1-04 | OPEN |
| 06 | TEL-IPP | 4 | REVIEW REQUIRED | A1-04 | OPEN |
| 07 | TEL-PAGA | 10 | ACOUSTIC, POWER, RELIABILITY | A1-05 | OPEN |
| 08 | TEL-CCTV | 7 | VIDEO, POWER, NET-CAP, RELIABILITY | A1-06 | OPEN |
| 09 | TEL-RADIO-DTRS | 7 | RF-PROP, POWER, RELIABILITY, MECH | A1-07 | OPEN |
| 10 | TEL-RADIO-MARINE | 5 | RF-PROP, MECH | A1-08 | OPEN |
| 11 | TEL-RADIO-AERO | 5 | RF-PROP, MECH | A1-09 | OPEN |
| 12 | TEL-RADIO-SSB | 5 | RF-PROP | A1-10 | OPEN |
| 13 | TEL-DMR | 6 | RF-PROP, POWER, RELIABILITY, MECH | A1-11 | OPEN |
| 14 | TEL-ES | 6 | REVIEW REQUIRED | A1-12 | OPEN |
| 15 | TEL-FO | 7 | OPTICAL | A1-13 | OPEN |
| 16 | TEL-TELT | 6 | MECH | A1-11 | OPEN |
| 17 | TEL-MET | 4 | REVIEW REQUIRED | A1-14 | OPEN |
| 18 | TEL-NDB | 6 | RF-PROP, POWER, RELIABILITY | A1-15 | OPEN |
| 19 | TEL-AIS | 4 | REVIEW REQUIRED | A1-08 | OPEN |

## PAGA closure sequence

1. Recover current controlled requirements and the acoustic RPT-0005 evidence. Bind exact document/revision/clause and approved criteria; preserve unresolved conflicts.
2. Reconcile acoustic coverage, speaker tapping, amplifier loading, redundancy and loop integrity against existing kernels. Formula presence does not certify a calculation.
3. Reconcile cabinets/locations, access stations, beacons/monitoring, ACT-IP/interface licensing and UPS autonomy into installed TAG/MTO records. Vendor quotation quantities do not automatically become installed quantities.
4. Establish one cost owner per requirement/work object. Reconcile vendor inclusions with B1 engineering, B4 FAT/SAT, B5 startup spares, B6 tools, C2/C3 spares; cross-system training, logistics, permits and warranty remain separate review obligations.
5. Preserve the existing allowance, selected-quote evidence and FX gate until authorized normalization. No inferred exchange rate or added financial amount is introduced here.
6. Then implement exact source-row navigation and per-requirement export coverage with independent acceptance evidence.

The ten pilot entries are derived review candidates from existing component descriptions. Their `requirementId`, `qtyDriver`, `bomTag`, and `costOwner` remain null; status remains OPEN. `coverageId` is an audit identity, never a fabricated RFQ requirement ID. Existing source audit states remain untouched.

## Reuse compatibility

- E01–E18 remain canonical 0550 formula definitions. The full E↔GEQ crosswalk from PR #45 is displayed as REFERENCE_ONLY. E17 has no invented GEQ mapping. Runtime equivalence and parameter adoption are not established.
- Existing repository/facade and 15 registry IDs are verified. Full GMR hierarchy/source-row contracts remain OPEN; exact native roundtrip remains NOT_IMPLEMENTED.
- GKR reviewed decision-record store is not imported. GPE proposed cache/DAG controls are not represented as deployed functionality.
- No 0553 financial source, FX, vendor pricing, WBS or location records were imported.

## Validation and performance

`npm run build` now executes both the existing `validate:pj0550-data` and `validate:pj0550-coverage`. The latter checks immutable snapshot bytes, read-only/deterministic projection, 19 identities, PAGA ten threads, E references, source/output pointers, aggregated system mappings, missing/ambiguous trace fail-closed behavior, wrong-project rejection and rendered coverage/formulas.

Browser baseline was captured **before application edits**, using Chromium 131 headless, production build, 1440×1000. Timings measure click to two animation frames; they include frame scheduling and are not pure React commit times, a Windows benchmark or evidence of a speedup. Raw, public-safe metrics/digests are adjacent in `performance/`. React Profiler render counts and the owner's Windows/hardware behavior remain unmeasured.

The new First Principles content adds rendering work. No grouping/cache/financial selector optimization was made. The original 19-system page, Working, Budgetary and Release display digests and generated XLSX byte digest must match baseline. Engineering view intentionally gains the matrix.

Browser QA also selects AIS then PAGA, verifies ten PAGA rows, expands an acoustic equation and a service equation, and checks browser errors. Software PASS does not close engineering/commercial gates. Production webpack retains three bundle-size/performance warnings.

| Scenario | Before median ms | After median ms |
|---|---:|---:|
| 19 Systems | 28.6 | 27.3 |
| PAGA toggle | 31.3 | 31.6 |
| First Principles | 32.4 | 46.9 |
| Budget | 28.6 | 23.1 |
| Working Preview | 31.7 | 31.7 |
| Released Customer Output | 29.1 | 31.6 |
| Budgetary Submission | 28.2 | 33.1 |
| XLSX download | 52.0 | 61.0 |

First Principles includes the new audit content, so its increased render time is feature overhead, not a demonstrated optimization. XLSX has one sample per run; do not infer a speed change. Other timings vary with frame scheduling. Protected display hashes and XLSX bytes: PASS. Browser interaction assertions: PASS; JavaScript page errors: none.

### Reproduce

From `frontend`:

```sh
npm ci --no-audit --no-fund
npm run validate:pj0550-data
npm run build
```

Optional browser check requires Playwright and an installed Chromium executable. Set `PLAYWRIGHT_MODULE_PATH` if Playwright is outside normal Node resolution, and `CHROMIUM_EXECUTABLE_PATH` if not using Playwright's installed browser. No browser dependency was added to the application lockfile.

```sh
CHECK_COVERAGE=1 BASELINE_REPORT=../docs/handoff/pj2608-0550/performance/browser-before.json node scripts/profile-pj2608-0550-browser.cjs /tmp/0550-browser-check.json
```

For the unmodified baseline use the same profiling script without `CHECK_COVERAGE`, against a production build of baseline SHA. The script starts and closes a local-only HTTP server and browser, logs hashes rather than financial contents, and does not publish or issue the downloaded workbook.

## Next module

Continue `MOD-REQ-COMPLETENESS` PAGA clause extraction and `MOD-KNOWLEDGE-BINDING` approved calculation inputs, then unique ownership/row tracing to `MOD-BUDGET-WORKING`. Keep `MOD-RELEASED-SELL` HOLD and preserve the frozen issue. Do not treat this software increment as completion of all 19 engineering audits.
