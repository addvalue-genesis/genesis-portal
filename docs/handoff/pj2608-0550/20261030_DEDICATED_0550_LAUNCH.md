# Dedicated 0550 workspace

Date: 30-Oct-2026 (Asia/Bangkok). UI `2026-10-30.2-preview`.
Base: `f5cc9a759e7bcb0014d2e642efd86c3fc6557e4b`.

The owner requested that the current 0550 server show only 0550 to avoid opening
the older 0553/0510 copies retained on this branch. `App.jsx` now mounts only
`/projects/pj2608-0550`. Its header and recovery links target that workspace.
Home, directory, employee, foreign-project and unknown paths redirect there
with history replacement. The 0553 and 0510 page modules are no longer imported
by this entry point. Their files and the other Git branches are retained.

`npm start` on this branch now defaults to port **3050**; an explicit CLI port
override still works. Keep the 0553 checkout/server on 3053 and the historical
Hub checkout on 3001. Port separation alone does not select Git source.

Windows update, from the existing `genesis-portal-0550-review` checkout, while
on `feat/pj2608-0550-official-working-20261028`: stop its own server with Ctrl+C,
`git pull --ff-only origin feat/pj2608-0550-official-working-20261028`, then run
`npm start` from `frontend`. No dependency installation is needed for this
navigation change. Open `http://localhost:3050/projects/pj2608-0550`.
Existing private saved data must be exported/imported explicitly when changing
origin/port; this patch does not migrate or clear browser storage.

ADR-0550-001 principles **10, 11 and 12** apply: retain canonical 0550 data,
financial/history ownership, existing Module IDs and the A/B/C workflow while
removing cross-project entry points. This is a navigation/launcher change;
it does not complete source reading, engineering proof or release approval.

Validation: production `npm run build:portal` passed with the existing asset-size
warning. The isolated route browser check verifies the single-project header,
A/B/C, Release Module ID, seven root/foreign/unknown redirects, TH/EN, reload,
unchanged saved IndexedDB and the mobile header. The existing A source-readiness
browser suite passed, including linked import, shared B draft preparation and
unchanged financial/history records. Default webpack port 3050 was checked.
No full numerical-validation chain was rerun for this navigation-only change.

The mobile A suite passes; the default B view still exposes horizontal table
overflow at 390px, so this change makes no general mobile-table-layout claim.
Existing multi-project Hub browser expectations apply to the separate Hub
branch, not this dedicated entry point. Actual Windows installation remains
user-local. No engineering acceptance or customer issue is authorized.
