# PJ2608-0550 — Official working and customer-form review

This change extends the unified Hub (`feat/genesis-project-hub-20261027`) on the isolated branch `feat/pj2608-0550-official-working-20261028`. It does not merge, deploy, approve a commercial offer or record a customer submission.

## User-facing contexts

- **HIS-01** — `bid.budget.history`: immutable Rev10 / SAMTEL Rev00 views, with the existing issued XLSX export visible at the top.
- **RFQ-02** — `l3.original`: existing controlled intake, package comparison and revision register.
- **OFF-03** — `bid.budget.official`: default Official Tender context. Working Preview has A/B/C hierarchy, input editor, RFQ impact review, customer scope review and history comparison. Budget THB projects reviewed selected lines.
- **REL-04** — `bid.budget.release`: eight-column USD customer form and Draft XLSX. Per-line Source/Release IDs remain stable. Group source IDs are `bid.budget.working.customer.<code>`; output IDs are `bid.budget.release.customer.<code>`.

Module search accepts these tags and the original full module IDs. The fifteen architecture modules remain unchanged.

## Price contract

`deriveBidWorkspace` retains existing equations and exposes a separate `official` projection. A calculated candidate is inspectable in Working; it is not a reviewed Official price. No financial inputs are copied from History or 0553. The 0553 hierarchy/control approach is reused with 0550-specific WBS and customer mapping.

A line requires an explicit customer row, Current Tender evidence with read content, clause, reviewer/date, engineering/quantity/ownership basis, commercial/cost basis and KEEP/RECALCULATE/ADD/REMOVE decision. Recording a review fingerprints its inputs, offer, calculation, FX and referenced sources/comparison. Changing those inputs invalidates the review. Conflicting or unconfirmed revisions, metadata-only/replaced evidence and linked OPEN/CONFLICT findings block it even when a review record exists. Existing arithmetic/quote validity/duplicate ownership gates also remain active.

A customer Lot additionally requires completeness review of its selected children. EXCLUDED requires evidence and no selected child; it is not zero. Part C remains separate. A selected line with missing/invalid mapping blocks totals. Missing prices are OPEN. The customer form and XLSX share one row projection; details are included in parent Lot totals, never added twice. Customer exports contain no internal costs, vendors, reviewer names or calculation notes. Customer-facing remarks must be entered deliberately.

The reference form has 15 A rows, B1–B6 and C1–C3. Its 19→15 suggestion is only a suggestion; applicability/completeness must be reviewed for the current tender. Internal B7–B9 must be explicitly assigned to a valid B customer row. No 0553 WBS meanings or rates are imported.

HIS-01 versus OFF-03 differences use customer sell USD only after an explicit same-scope review against the historical snapshot ID. Otherwise the delta stays OPEN. This is not an RFQ-only price attribution; quantity, commercial terms and FX may also contribute.

## Persistence and limits

Optional `officialReview`/customer display fields on lines and `customerReviews` at workspace level extend the existing v1 schema. Old backups remain readable and initially unreviewed. New fields survive normal workspace backup/import. Export a backup before changing software versions; older software with strict validation cannot import the extended records.

Review fingerprints are change detectors, not authenticated signatures. They do not grant approval. The method-version string must be bumped when pricing/review semantics change. All final release authorization remains HOLD; XLSX is marked NOT ISSUED. Private source intake and current financial inputs remain runtime data; no new actual offer price is asserted by this code.

## Validation

- `npm run validate:pj0550-data`
- `npm run validate:pj0550-bidding` now includes synthetic Official gate, staleness, mapping, comparison and customer export cases.
- `npm run build` runs the full Hub validation chain and production compilation.
- Browser regression: `PLAYWRIGHT_MODULE_PATH=<playwright> CHROMIUM_EXECUTABLE_PATH=<chromium> node scripts/validate-pj2608-0550-bidding-browser.cjs <report.json>`.

The browser regression covers real form saves/reviews, Source/Release navigation, persistent stale state, backup/import, duplicate cost ownership, concurrent writes, schematic navigation and the historical issued XLSX SHA-256.

Validated on this branch: data validator, expanded bidding validator, full production build, Chromium 131 browser regression (12 checks; no console errors), and independent XLSX loading with openpyxl. The existing issued export SHA-256 remains `2065bb70efa3e8b3bb90b4fbe64f099e02d1ae6c73a73d03b8e745987becafc6`, including the new top History export button. Webpack retains an asset-size warning. These tests establish software behavior with synthetic fixtures, not correctness of unreviewed private project inputs.
