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


## Windows review launch — existing Hub preserved

PR #53 is a Draft against the Hub, not a standalone 0550 application. The review
branch contains the same four-project navigation. Its home-page identifier is
`2026-10-28.2-preview · 0550 Official Working / Numbered Modules / Copy ID`.
GitHub reports no merge conflict as of 28 October 2026; no PR workflow run was
reported. Local validation results above remain the test evidence.

Before first opening the review version, use **Data and Trace → Export workspace
backup** on the existing localhost:3001 application. New review records extend
the persisted workspace schema; returning to older software requires the earlier
backup. Keep that file private. Stop the current server using Ctrl+C in its own
terminal. Do not change browser host/port or clear browser storage.

Run the following in PowerShell. It creates a detached review worktree beside the
existing Hub; local edits in the Hub (including package-lock.json) are preserved.
The script stops if the review folder already exists, rather than overwriting it.

```powershell
$repo = (Join-Path $env:USERPROFILE 'DEV\genesis-project-hub').Replace('\', '/')
$review = Join-Path $env:USERPROFILE 'DEV\genesis-hub-0550-official-review'
$branch = 'feat/pj2608-0550-official-working-20261028'
if (!(Test-Path (Join-Path $repo '.git'))) { throw "Repository not found: $repo" }
if (Test-Path $review) { throw "Review folder already exists: $review" }
git -c "safe.directory=$repo" -C "$repo" fetch origin "refs/heads/${branch}:refs/remotes/origin/${branch}"
if ($LASTEXITCODE -ne 0) { throw 'Git fetch failed' }
git -c "safe.directory=$repo" -C "$repo" worktree add --detach "$review" "origin/$branch"
if ($LASTEXITCODE -ne 0) { throw 'Review worktree creation failed' }
Set-Location (Join-Path $review 'frontend')
npm ci
if ($LASTEXITCODE -ne 0) { throw 'npm ci failed' }
npm start -- --port 3001
```

Open `http://localhost:3001/` to check the version, then
`http://localhost:3001/projects/pj2608-0550`. Select **10 Bidding / Commercial**:
OFF-03 and HIS-01 must be visible, and REL-04 is the Release Preview USD stage.
Use the existing browser profile to retain private data. If a custom Drive path
was configured in the old terminal, retain the same `GENESIS_0550_PROJECT_DIR`
setting in this terminal. The new software does not manufacture Official prices:
unreviewed inputs show OPEN until the user completes line and customer-scope
review against the actual RFQ and quotations.


## Module presentation correction — 28 October 2026

The presentation registry `bidPresentation0550.js` now supplies the human outline,
module search and stable existing IDs together. The 15 architectural modules,
price model, persisted input schema and export projection are unchanged.

- 10.0: structure and colour guide; 10.O / 10.O.1: Official context and totals;
  10.H: History. These are readable UI references, not financial WBS codes.
- 10.1: source inputs; 10.1.1 RFQ impact, 10.1.2 FX, 10.1.3 line editor.
- 10.2: A/B/C hierarchy; A has COMMON .00 and the existing 19-system order;
  B1–B9 and C1–C3 retain 0550 names. Row R01/R02 are display ordinals, not
  permanent identities. Copy the full Module ID to identify a row over time.
- 10.3.1: customer-scope review; 10.3.2: THB; 10.3.3: USD; 10.4: comparison;
  10.5: remaining gates. Existing Source ↔ Release IDs are unchanged.
- Every numbered module/group/row has its own project-qualified Copy ID. Search
  accepts that ID, the displayed number or the exact HIS/RFQ/OFF/REL tag; a match
  opens its ancestors and highlights the target. Copy does not toggle an accordion.
- Module principles explain purpose, inputs, method, outputs, limits and next view.
- Colours inherit from the nearest work group through its headings, tables and
  rollups. Individual rows retain their source-owner colour in THB/USD. A customer
  group with one owner uses that colour; a mixed group uses its Part colour.
  Labels remain authoritative; colours can repeat and never indicate approval.
- Colour/number/Copy ID chrome is internal UI only; native customer XLSX and
  frozen History output remain unchanged. Mobile IDs wrap and wide tables scroll.

The existing browser regression now checks group Copy ID without expansion,
full-ID/number navigation, module-specific principles, mobile containment,
source-owner colour continuity and Budget row copying in addition to the prior
pricing, persistence, navigation and export checks.


Validation of the presentation correction: full Hub build chain passed, followed
by final production compilation and 14 Chromium checks with no console errors.
The expanded checks exercise the user's copy/search/number/colour workflow and
390px containment. The data and bidding validators pass; the frozen History XLSX
still has the same SHA-256 recorded above. Price/equation/input/export source
files have no changes in this correction. Existing asset-size warnings remain.

## Module-level colour correction — preview 2026-10-28.3

The user's screenshot exposed a gap in preview .2: colour was attached to WBS
owners, so top-level Official, summary and workflow modules still appeared white.
The presentation registry now also assigns workflow families to existing module
IDs. Official/Working is blue; Source/RFQ/FX is teal; customer scope is purple;
Budget THB is orange; Release USD is mauve; History/comparison is olive-brown;
guide/gaps is slate. The colour guide explains both workflow and cost-owner colours.

Module headers use solid family colour with readable Copy IDs, principles and
summary cards use a light family tint, and inactive tabs retain their family tint.
Child source modules share the Source family. WBS row colours continue to override
workflow colours so Source-to-Release ownership remains traceable. Numbering,
module IDs, calculation inputs and customer exports are unchanged.

Browser coverage now reproduces the screenshot with an empty workspace, checks
Official/summary headers, Source children, inactive tabs and active THB/USD tab-to-
header colour consistency, plus mobile containment and the prior integration suite.

Validation: production build passed (existing asset-size warning); all 15 Chromium
integration checks passed with zero console errors. Desktop and mobile screenshots
were inspected. Frozen SAMTEL Rev00 XLSX SHA-256 remains
`2065bb70efa3e8b3bb90b4fbe64f099e02d1ae6c73a73d03b8e745987becafc6`.
