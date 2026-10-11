# GENESS — Global Configuration / Revision History (working ledger)

**Scope:** GLOBAL governance and project-scoped implementations. This is a versioned human-readable change ledger, not a substitute for Git history, approved technical document revisions, or an immutable operational database audit trail.

**Record format:** Change ID | Date | Scope | Semantic / Workflow ID | Change and reason | Source commit | Validation / release status | Next action.

| Change ID | Date | Scope | Semantic / Workflow | Change / reason | Commit(s) | Validation | Next action |
|---|---|---|---|---|---|---|---|
| GNS-CHG-000001 | 2026-10-11 | PJ2608-0553 pilot | WF-01..12 / BID-GOV | Added 0553 workflow + component inventory and on-page navigator to make existing functions discoverable | 34d8740, b0c39f8, 3daaf8b | Source committed; specific post-change build not confirmed | Verify navigation and dependencies |
| GNS-CHG-000002 | 2026-10-11 | GLOBAL engine, used only by 0553 | BID-DAT | Created shared identity / change record contracts; 0553 adopted new internal position codes; other projects not migrated | e964ffd, c8de64c, db84cdf, c640dec | Committed; build not independently verified | Keep legacy route IDs and isolate 0550 |
| GNS-CHG-000003 | 2026-10-11 | GLOBAL naming contract, 0553 pilot mapping | BID-GOV, BID-FPR, BID-ARC, BID-REQ, BID-ENG-SCH, BID-EXE, BID-VEN, BID-RSK, BID-DAT, BID-BUD | Added explicit semantic IDs; stable human-readable tab names rather than numeric-only navigation. Original route IDs retained | 3a6c9d4, 879b005, 07b0fe2, e939be1 | Committed; local build/screens not yet reported for this change | Run `npm run build`; test 10 tabs and 05.3 route |
| GNS-CHG-000004 | 2026-10-11 | PJ2608-0553 pilot | BID-DAT / Validation | Fixed legacy validation assertions to match new Lifecycle/tab names and schematic site-group filter; no engineering data changed | 1fbd478, 0dac70d, 53fb48b, ec3c739, 6e20dcc | User reported subsequent `webpack compiled with 3 warnings` for earlier baseline, not latest semantic change | Keep tests aligned with stable functional contracts |
| GNS-CHG-000005 | 2026-10-11 | GLOBAL documentation | BID-DAT | Created this human-readable ledger to avoid repeating work and identify pending validations and decisions | This document's own Git commit | Documentation only | Add each future change with scoped ID, impact, evidence and commit |

## Configuration rules
1. **GLOBAL** contracts belong under `frontend/src/common/governance/` and `docs/governance/`. **Project 0553** registry and evidence stay under `frontend/src/project0553/`.
2. A globally reusable engine change is not an automatic rollout to every project. PJ2608-0550 remains not migrated.
3. Separate `Code Change`, `Engineering Document Revision`, `Commercial Revision`, `Decision` and `Build Validation` records. A successful build does not approve an engineering or commercial baseline.
4. Preserve identity and aliases even when navigation or display positions change. Never overwrite original RFQ/MR/MTO/DTS/vendor evidence.
5. Record all new changes in this ledger and reference their source commits and impacted semantic IDs. When the latest commit changes the ledger, Git file history captures its exact SHA.

## Outstanding
- Persistent global revision service/database, decision approvals, automatic Git sync and visual history UI: NOT IMPLEMENTED.
- Registration of `BID-BUD-*` child IDs and cross-component dependency mapping: PENDING.
- Verify the latest semantic naming refactor in local build, and smoke-test the 0553 UI.
