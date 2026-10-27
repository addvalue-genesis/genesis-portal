# GENESIS project directory — 27 October 2026

The home page and top navigation now use the same project registry. One frontend serves the requested four entries; project data and pricing remain owned by each existing workspace.

| Entry | Route | Source | Availability |
|---|---|---|---|
| 0550 | `/projects/pj2608-0550` | `2a0ebef8` — 26-Oct bidding workflow | Existing engineering / bidding workspace |
| 0553 | `/projects/pj2608-0553` | `021d7951` — fast release integrity | Existing engineering / bidding workspace |
| 0510 | `/projects/pj2601-0510/sat` | `6f87f192` — SAT workspace | Existing SAT editor; document generation needs its service and assets |
| 0541 | `/projects/0541` | No workspace located | Status page only; no invented full project ID, engineering data or price |

The 0541 search examined filenames in all 75 fetched branch tips and references in frontend source/docs. Older 0550 code mentions reuse of 0541 VDRS/methods but does not contain a 0541 page. Recovering that original workspace is still outstanding.

## Source preservation

- All 0550 project files and its page match `2a0ebef8` byte for byte.
- All 0510 frontend/service files match `6f87f192` byte for byte.
- 0553 project files, its page and common engineering/cost code remain identical to `021d7951`.
- No source snapshots, selected prices or release permissions were edited by this integration.
- Browser IndexedDB/localStorage are origin-specific. Saved inputs on port 3001 do not automatically migrate to port 3002. Use the existing workspace export/import when moving private saved inputs.

## Open locally

From `frontend`, install with `npm ci`, then run `npm start -- --port 3002`. Open `http://localhost:3002/` for the four-entry directory. Keep the server terminal running. `/projects` redirects to the directory. Unrecognized URLs display a recovery link instead of an empty page.

For 0510 Word/PDF generation, follow `sat0510_service/README.md`. The original PTTEP DOCX and network image are not supplied by this integration; the local service and LibreOffice are separate requirements. The frontend explicitly displays this limitation.

## Validation

`npm run build` runs the existing validation chain plus the 0550 snapshot, coverage, evidence and bidding checks before the production compilation. `npm run build:portal` compiles the frontend only; it is not a commercial validation shortcut.

`npm run validate:project-hub-browser` uses Playwright (install it and Chromium in the test environment). It covers all four cards, navigation, direct reloads, same-tab switching, 0510 SAT tests, the truthful 0541 status, language switching, aliases, unknown URLs and mobile width. `GENESIS_HUB_TEST_URL` defaults to `http://127.0.0.1:3012`; `GENESIS_CHROMIUM_PATH` can specify an installed browser.

CSS compilation is explicitly configured and declared in package.json/lockfile so a clean checkout builds without local webpack patches. Each project is imported on demand. This change makes no benchmark or financial completeness claim.

Executed checks in the integration environment:
- Full `npm run build`: passed (150 validation-script invocations, followed by production compilation).
- Final `npm run build:portal`: passed after directory typography changes. Existing large project chunks produce an asset-size warning.
- Production-browser navigation checks: passed; no uncaught page errors on the tested routes.
- Source byte comparisons: 34 0550 files and 11 0510 files match their selected source commits; 0553/common paths have no diff from the integration baseline.
- 0510 document-service execution, private template rendering, and the missing 0541 workspace were not tested or represented as complete.
