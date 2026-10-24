# PJ2608-0553 — A1 SI internal review and source parity

Date: 2026-10-24
Source branch: fix/pj2608-0553-urgent-thailand-cif-pricing-20261024
Source commit: 232589a32360293d43b103d2d3b62d2268c1bf7d
Authority: Owner instruction in project chat on 24 October 2026: BOD, Data Sheet, MR, SPE, DWG, BLD and LAY govern customer requirements; First Principles and steps 1–8 are SI internal re-checks. Preserve compliant customer requirements when no comment is found. Correct upstream Working first and carry the same source through Budgetary and Release.

## Implemented behavior

- Add A1 internal-review results to the canonical MR0001 read projection through a new additive adapter. Approved Rev01–Rev03 sources, manifests and consumer bindings stay unchanged.
- Use the same reviewed projection in the 10.1 System × Location × MTO table, previous Budgetary workbook, Scope working amounts and Release commercial model.
- Carry each source identity (site + MTO row + TAG), per-step review, requirement references and comment IDs into the internal Release model.
- Display three explicit results: REVIEWED_NO_COMMENT, COMMENT and NOT_REVIEWED. Numeric cost, an empty comment list and OEM approval status cannot manufacture a no-comment result.
- Keep commercial price reconfirmation separate from the internal 1–8 result.
- Bind a no-comment record to source quantity, amount/currency, source locator, SKU, source status, policy revision and customer requirement-content fingerprint. Changed inputs invalidate that record. Open comments take precedence.
- Require closure evidence, reviewer and date to close a comment. Prevent duplicate source owners and duplicate review records.
- Link the existing 91 extracted customer requirement records and six indexed document revisions for inspection by site/TAG. These are extracted references; native-document review is not fabricated. LAY/DWG/current revision verification remains visible in A1-C07.
- Fix the Working quantity/unit display to read sourceQty/sourceUnit (and sourceScope fallback), matching the fields already used downstream.
- Render nested TAG detail when expanded, with bounded tables for mobile. The Release audit is internal-only.
- Add the R44 What's New entry and register the review module.

## Monetary reconciliation

All counted source lines are converted to THB and rounded once per line using the existing Release rule, then summed. Working, Budgetary, Scope and Release now use that same operation.

At planning FX 31.50 THB/USD:

| Measure | THB |
| --- | ---: |
| A1 canonical 55-line working cost | 5,840,703.18 |
| A1 Release Preview selling price | 7,592,914.13 |
| Included A5 bulk memorandum | 260,232.00 |

The older aggregate-before-conversion display was THB 5,840,703.15. The THB 0.03 difference is display reconciliation, not a change in selected equipment rates or Release selling prices. Preserve the historical Rev03 baseline reference exactly; do not regenerate its manifest for this display change. A5 remains included and non-additive. Other A equipment prices and B/C selections remain unchanged.

## Review work actually recorded

55/55 site/TAG source identities, source MTO quantities and single counted owners were cross-checked to MTO Rev04. Numerical cost allocation was reconciled to the existing A1 Release amount. The records explicitly state this limited scope; they are not signed acceptance of every functional requirement or every native document.

Current summary:

| Step | No comment | Comment | Not reviewed |
| --- | ---: | ---: | ---: |
| 1 RFQ / scope identity and ownership | 55 | 0 | 0 |
| 2 First Principles | 0 | 23 | 32 |
| 3 Architecture / constraints | 0 | 55 | 0 |
| 4 Documents / revision | 0 | 16 | 39 |
| 5 Physical BOM / bulk | 0 | 55 | 0 |
| 6 Execution WBS / resources | 0 | 0 | 55 |
| 7 Vendor / cost reconciliation | 39 | 16 | 0 |
| 8 Risk / change | 0 | 17 | 38 |

A1 internalReview.complete remains false. This implementation does not claim that final engineering review is complete and does not authorize customer issue.

## Evidence-backed items to resolve

The policy records A1-C01 through A1-C14. A1-C09 is commercial confirmation, separately classified.

Priority findings:
1. ZPQ MR-LQM-202-025B is labelled IDU in MR scope, while its current budget configuration uses B-1/B-2/B-3/B-5 radio functions. Confirm physical function/BLD and vendor composition before changing cost. Do not silently substitute the lower PoE price.
2. Several IDU TAGs are priced as an indoor PoE/power subset; full IDU or accepted functional equivalence remains to be shown.
3. GPS/time synchronization and expansion of existing ZPQ NMS/perpetual licences need explicit inclusion and cost ownership.
4. ZWP20 budget uses a 4ft antenna against the 6ft BOD/RPT baseline; link proof and a documented disposition are required.
5. DATO Ex quick-disconnect completeness, enclosure assembly/entries/thermal/earthing and surge interfaces remain open.
6. Bulk currently includes CAT6A 69m + one M20 gland per site, not all coax/grounding/entry functions named by the MTO lot.
7. BLD existing-link wording versus BOD/SPE/DTS new/additional ZPQ–ZWP8 link needs a controlled conflict disposition.
8. Native-document revisions, execution owner/WBS interface and risk disposition remain explicitly unreviewed where evidence is absent.

No guessed equipment, licence price, extra reserve or supplier charge was posted to make these issues disappear.

## Validation

- Dedicated A1 regression checks: passed, including cost/review parity across stages and FX scenarios, unchanged equipment selling prices, missing FX/currency, duplicate source/review records, stale quantity/price/SKU/source/status/customer revision, no-comment evidence and scoped comments.
- Rev01/Rev02 approved baseline and Rev03 pinned source/binding checks: passed.
- React server rendering of the review component: passed for Working, Budgetary and Release placements.
- Production build: npm run build passed, including 155 PASS validation outputs and webpack production compilation. Webpack reports the three standard bundle-size/performance warnings; no build error.
- Browser screenshot test was unavailable because the local Playwright browser executable is absent; no visual browser result is claimed.

## Implementation entry points

- frontend/src/project0553/data/a1InternalReviewPolicy0553.json — review policy, comments, recorded evidence
- frontend/src/project0553/data/a1InternalReview0553.js — pure review derivation
- frontend/src/project0553/data/workingBomReviewedProjection0553.js — additive canonical-source adapter and shared THB conversion
- frontend/src/project0553/A1InternalReview0553.jsx — internal review UI
- frontend/scripts/validate-0553-a1-internal-review.cjs — regression and negative fixtures
