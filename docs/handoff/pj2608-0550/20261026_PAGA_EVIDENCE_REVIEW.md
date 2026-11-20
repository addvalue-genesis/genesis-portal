# PJ2608-0550 — PAGA native evidence review increment

This increment extends `MOD-REQ-COMPLETENESS` on PR #46. It adds a user-loaded evidence review to **First Principles**, retaining the existing 19-system coverage inventory, E01–E18 and engineering kernels. It does not close engineering acceptance, cost ownership or release coverage.

## Code and source boundaries

- `pagaEvidenceModel.js`: bounded, strict JSON parser and pure quantity/TAG reconciliation.
- `PagaEvidenceReview.jsx`: source revision/page references, requirement-to-existing-equation candidates, MR/TAG comparisons, source conflicts and a site-filtered TAG register.
- `PJ26080550.jsx`: keeps the imported review in page memory across tab changes. Refresh or leaving the project clears it. No server upload, browser storage, API persistence or financial posting is added.
- Module IDs remain the existing 15. The implementation list of `MOD-REQ-COMPLETENESS` gains the two new files.
- The public repository contains code and synthetic tests only. Native project documents, extracted source payloads, private source URLs and source screenshots are not bundled. The evidence package is delivered separately to the authorized user.

Use **First Principles → PAGA Evidence JSON** to load the separately supplied package. Existing Drive access still governs opening its source links. A fingerprint identifies the reviewed source bytes; it does not authenticate approval or determine which revision governs.

## Review contract

Schema: `genesis.0550.paga-evidence.v1`, project `PJ2608-0550`, system `TEL-PAGA`, exact controlled baseline snapshot. Maximum file size: 2 MiB. Unknown fields, financial fields, unresolved sources/pages, invalid IDs, mismatched component/category bindings and unsafe source URLs are rejected. Source quantities can be positive integers or `null`; unknown is never zero.

The package carries:

| Collection | Meaning |
|---|---|
| sources | Document ID, revision/date, PDF page count, Drive locator and SHA-256 |
| requirements | Extraction ID, native clause/page references, candidate component/kernel/E/service bindings, remaining evidence and source scope responsibility |
| quantityRows | Preliminary source quantities with site/category and native references |
| tags | Source TAG, site, equipment, building/location and native references |
| issues / observations | Document differences and bounded review findings; no automatic authority resolution |

Identity is `Project / Site / TAG`. Repeated labels across sites stay separate. A repeated identity within one site is a conflict. Quantity comparison sums source rows within a site/category and compares unique source TAGs. A missing side remains `OPEN`; a matching count is only `COUNT_AGREES_PRELIMINARY`.

Every extracted requirement remains `ENGINEERING OPEN`, with no financial owner and release `HOLD`. Every TAG has `installedQuantity: null`. The requirement denominator and coverage percentage remain `null`: this package is an extracted subset, not full contract coverage. Source scope wording such as Contractor/Vendor does not establish a selected OEM inclusion or ADDVALUE allocation.

The existing output identity remains `TEL-PAGA → Working Part A → A1-05` in frozen Budgetary and Released Output. This is not a verified requirement-level cost trace. The baseline inventory and private review are separate views; loading evidence does not rewrite historical requirements or decisions.

## Reuse and unresolved work

Uses existing ACOUSTIC, POWER and RELIABILITY kernels, existing service equations and service-line IDs. The GEQ/PEQ/GMR/GKR/GPE compatibility decisions from PR #46 are unchanged: method references and project bindings are reusable, but no 0553 financial sources, FX, vendor costs or WBS are imported. Full generic equation runtime, automatic native Source ↔ Release navigation and proven unique financial ownership remain incomplete.

Native MR/SPE/DTS/PHI documents were inspected in this review. Source differences, preliminary quantities and missing engineering inputs are recorded in the separate evidence package. No vendor quotation was re-audited in this increment. Next closure sequence remains: governing source decisions → approved acoustic/loop/power proof → final TAG/MTO and exact vendor BOM → inclusion/deduction evidence and unique cost owner → working-budget delta review → release coverage. The other systems still need native requirement extraction and proof; the 19-system inventory is not a claim of 19 completed audits.

## Validation and performance

- `npm run build`: existing data validator, coverage validator, new evidence validator and production build pass. The existing three webpack size/performance warnings remain; this is not a performance optimization claim.
- New synthetic regression checks cover cross-site labels, within-site duplicates, missing quantities, split source rows, invalid source/page/project/snapshot, unknown financial fields, unsafe URLs, HTML escaping and immutability.
- Separately supplied native evidence also passes the parser and non-posting invariants. It is not required or exposed in public CI.
- Chromium production-browser checks pass: import, quantity comparison, requirement expansion, TAG filter, tab persistence, invalid import clearing, explicit clear and reimport; no page errors.
- Existing 19 Systems, Working, frozen Budgetary and Released Output display hashes match the original browser baseline. Exported XLSX bytes match exactly, including after importing evidence.
- Snapshot SHA-256 stays `78832b4ea11b3c2781d3fe10183db071967056966e908bd63b570475fb84ed41`.

Browser evidence: [browser-evidence-after.json](performance/browser-evidence-after.json). Existing [browser-after.json](performance/browser-after.json) is the measured PR #46 starting implementation; [browser-before.json](performance/browser-before.json) is the original PERF-00 continuation baseline captured before application edits.

The new run uses Chromium 131 at 1440×1000, seven warm tab cycles plus evidence interactions. First Principles median was 46.1 ms versus 46.9 ms in the prior run; these different interaction mixes and single environment do not establish a speedup. Evidence import measured 77 ms wall-clock automation time in one sample. Two long tasks (63/53 ms) were recorded near initial rendering. No new bottleneck attribution or optimization is claimed. Memory is a coarse end-of-run sample and includes the loaded evidence. Thai glyphs were unavailable in this headless environment; English source/table layout was visually reviewed.

Reproduce from `frontend` with an available Playwright installation and Chromium:

```sh
PRIVATE_EVIDENCE_FILE=/absolute/private-evidence.json npm run build
PLAYWRIGHT_MODULE_PATH=/absolute/node_modules/playwright \
CHROMIUM_EXECUTABLE_PATH=/absolute/chromium \
BASELINE_REPORT=../docs/handoff/pj2608-0550/performance/browser-before.json \
CHECK_COVERAGE=1 PRIVATE_EVIDENCE_FILE=/absolute/private-evidence.json \
node scripts/profile-pj2608-0550-browser.cjs /tmp/paga-review-report.json
```

Draft review only. No merge, deployment, customer issue or financial source replacement.

## Windows checkout correction

A Windows checkout produced raw snapshot SHA-256 `acfc30a99bd963947765ea0fb4b8402f303cf6c7d8b419cb8a9c6c469a5834bc`. This is exactly the unchanged controlled LF source converted to CRLF by Git. The original coverage and evidence validators incorrectly rejected that checkout representation.

Both validators now use one integrity assertion which converts CRLF to LF in memory before comparing against the original controlled SHA-256. It does not rewrite the file, parse/reserialize JSON, trim whitespace, remove a BOM or relax the expected digest. All other source changes still fail. The new snapshot regression reproduces the reported Windows hash and checks LF/CRLF/mixed-line-ending acceptance plus state, numeric value, whitespace, BOM and project-change rejection. The build runs that regression first; CI now builds on both Ubuntu and Windows. Browser application code and financial source data are unchanged by this correction.
