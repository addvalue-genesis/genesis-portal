# GENESIS project directory — 27 October 2026

The home page and top navigation now use the same project registry. One frontend serves the requested four entries; project data and pricing remain owned by each existing workspace.

| Entry | Route | Source | Availability |
|---|---|---|---|
| 0550 | `/projects/pj2608-0550` | `ec436381` — 27-Oct source intake / Drive Desktop / reference registers | Existing engineering / bidding workspace |
| 0553 | `/projects/pj2608-0553` | `021d7951` — fast release integrity | Existing engineering / bidding workspace |
| 0510 | `/projects/pj2601-0510/sat` | `6f87f192` — SAT workspace | Existing SAT editor; document generation needs its service and assets |
| 0541 | `/projects/0541` | No workspace located | Status page only; no invented full project ID, engineering data or price |

The 0541 search examined filenames in all 75 fetched branch tips and references in frontend source/docs. Older 0550 code mentions reuse of 0541 VDRS/methods but does not contain a 0541 page. Recovering that original workspace is still outstanding.

## Source preservation

- The 0550 project files and page come from `ec436381`; the integration adds explicit `projectId="PJ2608-0550"` at every Copy ID call. The shared component continues to serve 0553 without a 0550-specific default.
- All 0510 frontend/service files match `6f87f192` byte for byte.
- 0553 project files, its page and common engineering/cost code remain identical to `021d7951`.
- No source snapshots, selected prices or release permissions were edited by this integration.
- Browser IndexedDB/localStorage are origin-specific. Saved inputs on port 3001 do not automatically migrate to port 3002. Use the existing workspace export/import when moving private saved inputs.

## Open locally

From `frontend`, install with `npm ci`, then run `npm start -- --port 3001`. Open `http://localhost:3001/` for the four-entry directory. Keep the server terminal running. `/projects` redirects to the directory. Unrecognized URLs display a recovery link instead of an empty page.

For 0510 Word/PDF generation, follow `sat0510_service/README.md`. The original PTTEP DOCX and network image are not supplied by this integration; the local service and LibreOffice are separate requirements. The frontend explicitly displays this limitation.

## Validation

`npm run build` runs the existing validation chain plus the 0550 snapshot, coverage, evidence and bidding checks before the production compilation. `npm run build:portal` compiles the frontend only; it is not a commercial validation shortcut.

`npm run validate:project-hub-browser` uses Playwright (install it and Chromium in the test environment). It covers all four cards, navigation, direct reloads, same-tab switching, 0510 SAT tests, the truthful 0541 status, language switching, aliases, unknown URLs and mobile width. `GENESIS_HUB_TEST_URL` defaults to `http://127.0.0.1:3012`; `GENESIS_CHROMIUM_PATH` can specify an installed browser.

CSS compilation is explicitly configured and declared in package.json/lockfile so a clean checkout builds without local webpack patches. Each project is imported on demand. This change makes no benchmark or financial completeness claim.

Initial directory integration checks (before the source-intake update):
- Full `npm run build`: passed (150 validation-script invocations, followed by production compilation).
- Final `npm run build:portal`: passed after directory typography changes. Existing large project chunks produce an asset-size warning.
- Production-browser navigation checks: passed; no uncaught page errors on the tested routes.
- Source byte comparisons: 34 0550 files and 11 0510 files match their selected source commits; 0553/common paths have no diff from the integration baseline.
- 0510 document-service execution, private template rendering, and the missing 0541 workspace were not tested or represented as complete.

## Source intake update — version 2026-10-27.2

Continue on `feat/genesis-project-hub-20261027`, local Windows folder
`%USERPROFILE%\DEV\genesis-project-hub`. Do not switch to the standalone
0550 branch to open the portal. Read this file and the current branch/commit
before giving launch or update commands. `frontend/src/projectHubRelease.json`
records the integrated 0550 source; the home page displays the workspace version.

This update includes the reviewed source intake, first-vs-official package
comparison, revision table, correspondence/findings and JSON-backed project
references from the 0550 source branch. The existing hub CSS compiler, project
navigation, 0510 and 0553 sources remain in place. The webpack dev server now
mounts the read-only local Drive Desktop bridge. No private intake file is in git.

Run the existing Desktop shortcut after updating. If port 3001 is already in
use, open the existing page or stop its own server terminal with Ctrl+C before
restarting; do not terminate unknown processes. After pulling, restart the
server because webpack middleware changes require a restart.

Google Drive for Desktop must expose the controlled JSON under the project's
`90_SYSTEM_WORKING/DATA`. An alternate mount can be selected with the server
environment variable `GENESIS_0550_PROJECT_DIR`. An unavailable Drive retains
saved source evidence and working prices. It does not re-interpret new raw
files automatically. Existing browser data remains associated with its original
host/port; keep localhost:3001 for the Hub.

0550 source intake details and limitations:
`docs/handoff/pj2608-0550/20261027_SOURCE_INTAKE.md`.

### Validation of version 2026-10-27.2

- Existing full build chain: passed (167 PASS markers), production webpack passed
  with one existing asset-size warning. The added source-render/Copy ID check
  also passed separately after its final assertions were added.
- Source parity: 39 source/page files match `ec436381` after accounting for
  explicit 0550 Copy ID props. 0553, 0510, the shared component, frozen 0550
  snapshots and package-lock have no changes from the Hub baseline.
- Actual webpack development server with an isolated synthetic Drive fixture:
  JSON endpoint returned the expected source, Cache-Control no-store, foreign
  Origin rejected with 403; all project URL shells returned successfully.
  The private fixture sentinel was absent from the public entry bundle.
- Server-render checks cover project-qualified inventory/source Copy IDs, safe
  source links and escaped contents. The home page includes version 2026-10-27.2.
- Browser interaction was attempted but Chromium could not start in this
  environment. No new browser-navigation PASS is claimed. The user's actual
  Windows Drive mount remains to verify.

Update the existing checkout using `git pull --ff-only origin
feat/genesis-project-hub-20261027`, then restart the existing port-3001 server.
No new dependency installation is required for this update; package-lock is
unchanged. Never delete browser data to resolve a missing Drive load.


## 0553 breakdown integration — version 2026-10-28.1

The owner authorized integrating the reviewed 0553 work into this existing Hub
preview branch. Sources: Hub `6b3b7448` and 0553 `f0bc67dd` (Draft PR #52).
The merge includes the intervening 0553 spare-annex and conditional-option work
needed by the breakdown. It retains the Hub's incomplete priced-subtotal and
PRE-AWARD / NOT ISSUED safeguards in the screen and native workbook. Delivery
wording remains proposed CIF, subject to buyer approval against original DDP
terms. No commercial issue or deployment is implied by this code integration.

Open **0553 → 10.3.4 Official Release** (search Module ID
`bid.budget.pricing.official`). Customer shows 17 MR/location summaries;
Internal retains all 141 rows and exact Source roundtrips. Both show/hide
price modes retain the existing A1–A4 and priced A+B subtotal USD 863,900.
C1/C2 remain separate conditional options. The downloaded 10-sheet breakdown
is still a detailed draft, independent of the screen mode.

0550 project/page/source-intake files, 0510, shared navigation and webpack
Drive middleware are byte-identical to Hub `6b3b7448`; package-lock and
runtime dependencies are unchanged. The build command combines both branches'
validators. This integration does not absorb work on other unmerged 0550
branches or mark the originally submitted 0553 proposal as reconciled.

Use the same Windows checkout and port 3001. Stop that server using Ctrl+C,
then `git pull --ff-only origin feat/genesis-project-hub-20261027` and restart
from `frontend` with `npm start -- --port 3001`. No dependency installation is
required if the existing Hub installation is working. Do not reset/discard
local modifications or remove browser data. Homepage version: **2026-10-28.1**.


### Validation of version 2026-10-28.1

- Full combined `npm run build`: passed, 171 PASS markers, production webpack
  completed with one existing asset-size warning.
- Chromium: all four project cards and direct reloads, same-tab transitions,
  0510 SAT tests, truthful 0541 status, language/aliases/fallback/mobile width.
- Chromium 0553: Customer 17 rows, Internal 141 rows, both price modes, complete
  source-to-summary mapping, 13 sampled exact reverse roundtrips, four MR
  forward routes and actual draft workbook download; no page errors.
- Byte comparison: 0550, 0510, shared code/pages/routes, webpack middleware,
  package-lock and the 0510 service unchanged from Hub `6b3b7448`.
- Package build retains both branches' validation commands once each.
- Merged native-export tests preserve the Hub subtotal/NOT ISSUED safeguards
  and the 0553 conditional-option and itemized-annex controls. Workbook text
  therefore differs from the earlier standalone feature export; prices are
  unchanged. Submitted-proposal comparison and commercial issue remain open.


## Breakdown module identity fix — version 2026-10-28.2

Restore visible module identity on the breakdown parent and A1–A4 headers in
both Customer and Internal modes. Existing module IDs are not renamed. Ten
nested addresses under the existing pricing views are shared by the UI and
project search registry:

- Release parent: `bid.budget.pricing.release.preview.breakdown`
- Official parent: `bid.budget.pricing.official.breakdown`
- Each parent has `.a1`, `.a2`, `.a3`, `.a4` children.

The common Copy ID control copies `PJ2608-0553 / <id>`. Pasting it into the
project search opens and scrolls to that exact parent/group. Copy remains
available on collapsed headers and does not toggle the group. Headings show
10.3.3.A / 10.3.4.A and their A1–A4 subheadings; existing owner colours apply.
The controls are UI identifiers only and do not enter the native workbook.
Update the same Hub checkout and restart port 3001; no dependency changes.

Validation: targeted breakdown/native-export, Official USD, module navigation and
change-registry validators passed; production build passed with the existing
asset-size warning. Chromium verified all ten clipboard values, copying from
collapsed groups without toggling, project-qualified search reopening/scrolling,
13 source roundtrips and four MR forward routes. Downloaded XLSX is byte-identical
to Hub 2026-10-28.1. 0550/0510/shared code and dependencies are untouched.

## Sheet A Excel — version 2026-10-28.3

Official Release now includes **A Equipment / Export Excel** beside B10. Search
`PJ2608-0553 / bid.budget.pricing.official.sheet.a` to open it; the common Copy ID
control is visible on the sheet. The standard Official Excel button and the
Sheet A button export six unchanged native sheets plus `A Equipment`. The
existing 10-sheet Internal Breakdown export remains separate.

Sheet A has twelve display rows. A1 groups its 55 source rows into ODU 8 Set,
IDU/interface 8 Set, antenna 9 Set, L3 switch 5 Set, DATO 4 Set, new enclosures
5 Set, existing enclosure reuse 1 Set, surge protection 8 Set and bulk 7 Lot.
A2/A3/A4 use MR contractual quantities of 3 sets / 4 systems / 3 sets; package
components and the one-per-phase RACON adapter are not added as extra systems.
All 141 source identities map exactly once. Qty/Unit and prices are read-only.

The Sheet A price selector controls the actual exported values. Hidden mode
contains no item rate/amount values or formulas, and keeps linked A1–A4
subtotals. Other quotation sheets retain their existing prices. Visible mode
sums the existing allocated amounts; it supplies a unit rate only where common
source configuration/rates support it. Part A stays USD704800, priced A+B
USD863900. This does not verify the previously submitted quote or permit issue.
The ZPQ IDU specification conflict, unpriced field scope and existing technical
qualifications remain visible. No new equipment price or procurement decision.

Validation: `validate-0553-sheet-a.cjs` checks exact quantity/unit, source coverage,
price reconciliation, hidden-value omission and byte-preservation of the original
six worksheets. Existing price breakdown, Official USD, module deep-link and
budget change validators remain applicable. Browser coverage includes both new
downloads, Sheet A search and existing Source→Release→Source navigation.
