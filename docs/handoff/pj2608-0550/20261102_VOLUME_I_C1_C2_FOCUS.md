# PJ2608-0550 — Focus Volume I on Schedule C1 / C2

Date: 2-Nov-2026 (Asia/Bangkok).
Parent: `ec916e28a7b44965334dfc1f6d4ba0fa4d54b7a9`.
UI: `2026-11-02.6-preview`.

## Result

The owner requested that only C1 and C2 be displayed, then authorised implementation
and commit. Opening Volume I now starts at the existing `bid.quotation.C1`.
The Schedule tabs and lazy 11.P preview initially contain C1 and C2 only.
Overview, cover, 11.M allocation and 11.P remain available as existing tools.

The local "Schedules shown" selector can reveal every Schedule. Returning to C1/C2
from a hidden Schedule selects C1; utility panels and C2 stay selected.
Opening an existing hidden Schedule by its unchanged module ID reveals the full
list and opens that Schedule. An unsaved form disables scope changes and retains
the existing navigation guard. The display choice is component state, not saved
workspace data.

The selector does not filter the canonical price model, saved allocations,
customer scope, full-package exports or release checks. Per-Schedule export
buttons provide the existing C1/C2 documents; whole-package export buttons still
export the complete set, explicitly explained beside the selector. No new Module
ID, financial input, source record, engineering acceptance or release approval
is introduced. Native forms and their original notes are unchanged.

## Principles and implementation boundary

ADR-0550-001 principles **5, 6, 8, 10, 11, 12 and 13** apply: preserve single
cost ownership and visible gaps; retain existing source/output navigation;
use canonical data for several views; preserve frozen history, stable module IDs
and whole-project scope. The filter is presentation only and does not establish
SI mapping completeness or customer approval.

Only the Volume I UI, its existing validation scripts, release metadata and
operating notes change. The paused earlier navigation work, private Rev11/Rev07
and separate SI Rev02 package are not included.

## Validation actually performed

The execution environment was unavailable during this change. The exact
GitHub parent sources were read through the connected repository API.
A JavaScript harness executed the actual added filter function and extracted
scope/navigation handlers: default C1/C2; full registry; object identity and
registry preservation; C8-to-C1 fallback; C2/utility-panel retention; all-mode;
dirty guards; existing C7 and Working-owner deep links; unchanged Volume III
navigation. Source checks confirmed the preview uses the filtered registry
and canonical table/export calls are retained. Both updated browser scripts
parse as JavaScript. **21 checks passed** in that limited harness.

The existing bid-volumes validation now additionally asserts React SSR default
C1/C2 tabs, C1 module identity, no Volume III filter and unchanged workspace.
Existing browser regressions were updated to cover the focused tabs/preview,
all-mode, return-to-focus, read-only filtering, dirty guard and hidden-module
navigation.

**Not run here:** Node/Babel/React SSR suite, production webpack build,
Playwright/browser tests, private-workspace or Windows checks. The repository's
existing Frontend Build workflow runs on pushes to this feature branch; its
result must be checked separately. The added/updated checks are not reported as
passing merely because they were authored.

## First CI run and follow-up

[Frontend Build run 41483955935](https://github.com/addvalue-genesis/genesis-portal/actions/runs/41483955935)
on `4d062574` executed Node/Babel and React SSR. The changed bid-volumes suite
passed, including the new C1/C2 assertions; Working-to-Schedules and native
Exhibit C suites also passed. The run then stopped in the existing SI work-package
test at line 34: it still expected 32 MiB although the previously implemented
available-document continuation sets preparation to 40 MiB. The existing
available-document handoff explicitly documents that limit and its boundary
checks. The follow-up changes only that stale test expectation to 40 MiB; no
runtime limit is increased and no production guard is relaxed.

Full production build and browser verification remain unconfirmed at this point.
