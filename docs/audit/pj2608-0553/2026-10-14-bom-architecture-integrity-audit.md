# PJ2608-0553 — Independent Architecture & BOM Integrity Audit (14 Oct 2026)
Status: **FAIL / NOT RELEASE READY**. Source review only; no local webpack/runtime test executed.

## Verified architecture
- `MR0002WorkingBom0553.jsx` reads `mr0002WorkingBom0553.js`.
- `UnifiedMrLocationTable0553.jsx` calls `workingBomAggregation0553.js` -> `BOM_READ_MODEL_0553` -> `MR0002_WORKING_BOM_0553`. Thus underlying MR0002 data is linked, but via separate projection/render chains.
- `LocationBomDetail0553.jsx` displays MR0001 via independent detailed component.
- `bomPresentationContract0553.js` offers common ID / currency / inclusion helpers, but is not a complete enforced MR/submodule schema or universal renderer.

## Findings
| ID | Severity | Finding | Evidence | Acceptance gate |
|----|----------|---------|----------|-----------------|
| A-01 | P0 | Presentation test not executed by `npm run build`; test exports a function but has no invocation in build chain | `frontend/package.json`, `bomPresentationContract0553.test.js` | Invoke automated tests in build; fail CI on broken ID/FX/inclusion |
| A-02 | P0 | Multiple renderers with inconsistent layout and detail fields remain for MR0001 versus MR0002/3/4 | `LocationBomDetail0553.jsx`, `MR0002WorkingBom0553.jsx`, `UnifiedMrLocationTable0553.jsx` | Shared table/row/evidence renderer, system-specific detail slots |
| A-03 | P0 | Presentation logic does not reconcile the total against all site-ledger, A1-A4, and A+B+C sources under same scope/FX | same above; `workingBomAggregation0553.js` | Deterministic cross-view currency-aware reconciliation without forced balance |
| A-04 | P1 | Working FX defaults to an explicitly unverified internal planning 31.5 THB/USD and can display numerical THB while source not verified | `CommercialWorkspace0553.jsx` | Distinguish planning FX from verified FX prominently; block release and approval claim |
| A-05 | P1 | Included supplier package value is displayed at child level; parent package and child lack universally enforced cost-ownership/price-inclusion identity contract | `mr0002WorkingBom0553.js`, `bomPresentationContract0553.js` | Child is always non-additive, parent package has sole monetary posting and evidence link |
| A-06 | P1 | Module IDs use item IDs incorporating site prefix; no central canonical registry enforcing cross-view stability and unique ID scope | `bomPresentationContract0553.js`, `UnifiedMrLocationTable0553.jsx` | ID uniqueness, exact path tests and all-MR audit |
| A-07 | P1 | MR0003 scenario evidence is counted when numeric in aggregation; scenario flags need explicit release/booking isolation | `workingBomAggregation0553.js` | Never confuse candidate/evidence total with booked cost |
| A-08 | P1 | Vendor quotation currency original USD retained, but some child rows still contain hard-coded USD displayPrice descriptions; central formatter only covers compatible UI paths | `mr0002WorkingBom0553.js`, `bomPresentationContract0553.js` | Every customer-facing price heading THB, original currency only in provenance |

## Requirements for PASS
1. Full canonical model across MR0001–MR0004: Project/MR/WP/Tag/line/parentPackage, qty/UOM, origin, currency/FX source/date, cost owner, posting status, source revision, technical compliance.
2. One shared price presenter; unit and extended THB with explicit provisional-vs-approved exchange-rate state, never invent FX.
3. Common package child non-additive rule with tests for MGW R2 UHF-1 WAROM, UHF-2 PolyPhaser, UHF-4 feeder and legacy EX-SURGE THB25000 allowance.
4. All WP/MR/Customer A1–A4 and A+B+C reconciliation of identical cost scope with no unexplained deltas.
5. Automated contract tests wired to `npm run build` and tested in real runtime UI.
6. Preserve RFQ technical compliance gates (Ex d enclosure certification, surge protection, RF feedthroughs) independently of purchase-price inclusion.

Audit owner: Principal Engineering Software Architect & Telecom Systems Integration Lead.
No claim of successful build, comprehensive reconciliation, customer release, or live UI test is made here.
