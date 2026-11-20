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
