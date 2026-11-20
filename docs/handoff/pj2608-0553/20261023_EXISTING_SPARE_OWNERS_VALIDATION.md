# PJ2608-0553 existing spare owners — implementation validation, 23 October 2026

## Source and scope

- Working branch: `fix/pj2608-0553-five-owner-first-principles-existing-modules-20261023`.
- Started from verified GitHub HEAD `75e75d80d0293f175bc6701c73d63704b25e3d76`, newer than handoff `3af8abc8`.
- Integration base remains `integrate/pj2608-0553-bda-bulk-tag-rebased-20261022`.
- PRs #36 and #37 were confirmed closed; their replacement-module approaches were not used.
- Existing B10/B11/B13/C1/C2 owners, source row IDs, 10.2/10.5/10.3 components and original six customer worksheets are retained. No new UI module, pricing ledger, dependency or branch was introduced.

## Changes

1. Fixed the C-option projection audit to accept explicit `null` on both source and projection, while rejecting zero, undefined or a different value. Original C1/C2 summary cells are G41/G42.
2. Strengthened the existing bidirectional Annex audit to check unit prices, customer prices, MR/site associations, evidence/price authority, source owner and exact native worksheet/row/cells. Corruption, orphan and duplicate-row negative tests remain fail-closed.
3. Removed duplicate Current C1 DOM anchors from its historical audit table. The historical table now renders the actual retained Rev08 audit rows; the Current C1 row occurs exactly once.
4. Connected the existing 10.5 summary and item rows to 10.2 Source and 10.3 Annex. The existing Scope table uses the current 4/4/3/1/4 row counts and clearly marks C1/C2 NOT QUOTED. Existing Customer Part C prices now say NOT QUOTED rather than a dash.
5. Corrected stale B11/B13 source descriptions without changing their quantities, rates or engineering assumptions.
6. Fixed native XML self-closing cell replacement: the old greedy match could consume the next cell, and failed on the real original file at B8. Empty-string writes now clear obsolete Annex cells. C1/C2 summary/Annex prices remain NOT QUOTED; old option lead times are cleared or replaced by OEM confirmation required.
7. Updated only the B1/B6 historical regression bridges affected by the authorized B10/B11/B13 checkpoint. Historical totals were preserved; the current spare delta is explicitly separated. Updated the two exact-component-prop assertions to require the new navigation callbacks.
8. Added rendered-component checks, unchanged-other-owner checks, corrupted-mapping tests, dirty-XLSX clearing tests, self-closing-cell and formula-protection tests to existing validators. The native validator optionally accepts `--template=...` for the private original workbook.

## Locked checkpoint — unchanged

| Owner | Current Working budgetary SELL THB |
|---|---:|
| B10 | 509,827.50 |
| B11 | 157,657.50 |
| B13 | 46,683.00 |
| C1 | NOT QUOTED / null |
| C2 | NOT QUOTED / null |

Part B priced-only subtotal: **THB 5,043,082.13**. FX **31.50 THB/USD**, pricing factor **1.30**. These remain unquoted engineering parametric estimates; no OEM cost/quotation certification is inferred. Complete A+B remains **NOT ESTABLISHED / INCOMPLETE**.

A deep comparison with a separate source snapshot of starting HEAD confirmed all `a`, `b`, `c`, `summary`, and all five Annex data arrays unchanged in value. This covers existing A/B/C quantities, prices and projections, including B1–B9, B12/B14 and the 16 Annex rows. `bcTurnkeyWorkingCost0553.js`, Rev08 baseline, package manifests and lockfile were not changed.

## Executed validation

| Check | Result |
|---|---|
| `npm run validate:0553-existing-spare-owners-2026` | PASS, including SSR unique anchors, five current owners, null-versus-zero checks and tampering tests |
| `npm run build` | PASS: all 138 validation commands, then production webpack 5.111.1; exit 0 |
| Webpack output | Three size/performance warnings; bundle.js 3.04 MiB, no compilation errors |
| Existing 10.2 Source → exact 10.3 Annex row → exact 10.2 Source | PASS: all 16 rows clicked in Chromium; reverse navigation focuses the same canonical row; no duplicate Current C1 anchor |
| Existing Customer Part B/C summary | PASS: B10/B11/B13 values, C1/C2 NOT QUOTED, incomplete A+B, disabled Final Customer Release |
| Existing 10.5 Scope | PASS: five owner values/current row counts and Source/Annex links; item-level B10 Scope → Source and Scope → exact Release row clicked |
| Actual original native XLSX | PASS: six sheets, 16 rows, exact values; all cell styles, row attributes, merges, columns and other XML geometry preserved; unrelated ZIP parts unchanged |
| Native export via browser file input/download | PASS: downloaded NOT_RELEASED workbook contents exactly equal the Node-tested native output |
| Baseline value comparison | PASS against starting GitHub HEAD; no repricing |
| `git diff --check` | PASS |

Execution host: Linux, Node v24.19.0, npm 11.9.0. Browser: headless Chromium 131.0.6778.0. Browser layout and numeric/status fields were visually inspected; this host lacks Thai/CJK fonts, so native Windows font rendering remains a local preview check. The user's Windows machine was not accessed or tested.

Actual source workbook: `4-Scope of Supply.xlsx`, 57,725 bytes, project original uploaded 16 October 2026.
SHA-256: `2d62a29f830c516fea6891fe1d7a63a9cef00487c777dcd0933dc72452f70701`.
The original workbook, downloaded test outputs and screenshots are not committed. Native export was a private test draft, not a customer issue.

Reproduce native verification after the normal build:

```powershell
npm run validate:0553-native-working-export -- "--template=C:\path\4-Scope of Supply.xlsx"
```

## Exact current row mapping

Every source row below remains under `bid.budget.working.bc.<owner>.spare-line.<source-id-lowercase>` and maps to `bid.budget.pricing.release.preview.annex.<owner>.<source-id-lowercase>`. The original native columns are C=TAG, D=description, E=specification, F=materials, G=qty, H=unit price, I=total; optional lead time remains J.

| Source row | Native worksheet | Row | Qty | Working SELL THB |
|---|---|---:|---:|---:|
| B10-PTTEP-01 | B10 CommSpares | 6 | 4 | 229,320.00 |
| B10-PTTEP-02 | B10 CommSpares | 7 | 3 | 85,995.00 |
| B10-PTTEP-03 | B10 CommSpares | 8 | 4 | 90,090.00 |
| B10-PTTEP-04 | B10 CommSpares | 9 | 3 | 104,422.50 |
| B11-PTTEP-01 | B11 SpecialTool | 6 | 1 | 85,995.00 |
| B11-PTTEP-02 | B11 SpecialTool | 7 | 1 | 26,617.50 |
| B11-PTTEP-03 | B11 SpecialTool | 8 | 1 | 14,332.50 |
| B11-PTTEP-04 | B11 SpecialTool | 9 | 1 | 30,712.50 |
| B13-PTTEP-01 | B13 Consumerables | 6 | 4 | 19,656.00 |
| B13-PTTEP-02 | B13 Consumerables | 7 | 4 | 15,561.00 |
| B13-PTTEP-03 | B13 Consumerables | 8 | 1 | 11,466.00 |
| C1-PTTEP-01 | C1 CapitalSpares | 6 | 1 | NOT QUOTED |
| C2-PTTEP-01 | C2 2Y-Spares | 6 | TBC | NOT QUOTED |
| C2-PTTEP-02 | C2 2Y-Spares | 7 | TBC | NOT QUOTED |
| C2-PTTEP-03 | C2 2Y-Spares | 8 | TBC | NOT QUOTED |
| C2-PTTEP-04 | C2 2Y-Spares | 9 | TBC | NOT QUOTED |

## Engineering and release holds retained

- B10: 14 contractual commissioning KIT obligations (MR 4/3/4/3) do not establish approved kit contents or 14 complete equipment spare units. OEM SPIR/SKU, Ex compatibility and independent supplier prices remain OPEN.
- B11: four phase tool sets and five EXA-A8 Telecom tool applicability checks remain distinct. Resolve Phase 1E/1F contractual precedence and TETRA gateway applicability against selected RFI BDA/DMR. Confirm and credit OEM/MGW included tools; do not duplicate B3 temporary testers.
- B13: preservation/reinspection activity and consumption evidence remain OPEN; exclude B5 packaging and A5 installed bulk. No additional quantities or prices were created.
- C1: optional capital spare requires OEM replacement/repair strategy and an independent spare quotation. MGW installed RACON USD75,059 remains a nonposting comparison.
- C2: optional two-year OEM SPIR requires parts/quantities/lead times and exact SKU exclusion against B10. Unquoted values remain null, never zero.
- DDP/inclusion/independent rate evidence and remaining Part A/B4/B12/B14 completeness gates remain OPEN.
- Customer Release, native FINAL export approval and merge are **not granted**. User preview/approval and engineering/commercial closure are still required. No merge or customer publication was performed.

## Continuation: current integration evidence and Windows validation

The continuation rechecked working HEAD `052a4d09` and found that the integration base was at `4c6ef6bbc668d4e28e5dc681e98863e01951ae37`, with 11 engineering-review commits not in the working branch. PR #38 reported conflicts in the spare schedule/release adapter. The existing CI did not run for this fix branch or its integration-base PR.

- Reconciled the base's existing 31-row Rev08 OEM risk review, MGW inclusion evidence and potential B10/C2 overlap screening. The 31 rows remain historical, nonposting evidence; they do not become current customer rows or prices.
- Added explicit evidence, unresolved issue and required OEM action to each of the **16 current source rows**, inside the existing source selector. The existing release adapter preserves these fields and audits value equality, including after serialization. No historical candidate is invented as an approved current kit SKU.
- The existing Working/Scope rows expose current OEM proof; the existing internal Release Trace shows the same evidence/action. Its return button uses the exact source row ID when available, with the existing owner fallback for non-row sources.
- Preserved the integration base's complete engineering reconciliation source file without modification. No new business module, replacement owner, pricing ledger, dependency or module registry entry was created.
- Extended the existing CI workflow to cover this exact working branch and integration-base PR, including a Windows Node 24 full-build job. No deployment or customer-release step was added.
- Actual Windows CI found two LF-only source-text assertions: vendor hierarchy and location overview. Both failed under a reproduced CRLF checkout. Normalizing only CRLF in the test readers made both pass without deleting or weakening the original layout/ownership assertions; application code and prices were unaffected.

### Executed cross-platform evidence

- Commit `12c90dc54fc27034161456eff5abeb19b83860d2`: [GitHub Actions run 39901438051](https://github.com/addvalue-genesis/genesis-portal/actions/runs/39901438051), **Windows and Linux jobs both SUCCESS**. Full `npm run build` executes all 138 validators and webpack. Windows additionally ran the explicit existing-spare-owners validator: 139 validator command executions in that job. Windows Server 2025 / Node 24.22.1; webpack completed with three size/performance warnings.
- First Windows attempt at `8b064e0a` failed on the CRLF assertion; it is not counted as a pass. Linux on that commit passed.
- Browser: the integrated model's **16 unique current rows** passed Source → exact Release row → exact Source row, including exact evidence/action in the internal Trace. A long combined browser run timed out waiting for a stable C2-03 Trace button after 14 passes; a fresh C2 run passed all four rows, the five customer-summary owners, five Scope owners and native file download with zero page errors.
- Original private native XLSX validation passed again: six sheets, 16 rows, unchanged styles/merges/geometry and unrelated ZIP parts. Browser-downloaded output matched the separately tested Node output for every ZIP part.
- Deep comparison against the pre-integration model confirmed all Part A/B/C prices, quantities, owners and totals unchanged, and every pre-existing field on the 16 current Annex rows unchanged. Only engineering-evidence metadata was added.
- Final local full build after the Trace return-button fix: **PASS**, all 138 validators and webpack; three bundle-size warnings, exit 0. The strengthened existing-owner validator also passed separately after that handler change.
- Final production-bundle browser check: Trace drawer displays the exact source row ID and its Go-to-Source button returns to that row for B10 and C2. Customer/Scope summaries for all five owners and native download passed again, with zero page errors. This supplements the 16-row direct-link coverage above.

The Windows result is from a real GitHub-hosted Windows runner; the user's own Windows installation, local configuration and fonts were not accessed. OEM/Commercial holds above remain OPEN. A green software build does not approve an OEM SPIR or customer issue. PR #38 remains a draft; integration-base synchronization in the working branch must not be confused with merging that PR into the integration branch.
