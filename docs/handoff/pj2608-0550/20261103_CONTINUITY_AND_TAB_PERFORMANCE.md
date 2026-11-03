# 0550 continuity and tab performance

3-Nov-2026, Asia/Bangkok. Parent `99651ff3`, existing Official Working branch,
port3050. This checkpoint is developer context, not a read of the owner's browser.

## Why reopening did not reliably carry development context

The repository already had AGENTS, an accepted ADR, the architectural module
registry and presentation contracts. However `01_CURRENT_STATE.json` and
`11_NEW_CHAT_RESUME_PROMPT.md` still described the 9-Oct branch/PR2/port3000 and
staging task. Later checkpoints were prepended to a long living handoff. Reading
only those older machine-readable/resume files could therefore start the next
session from the wrong task. The browser does not execute developer handoff prose;
a new developer/agent must actually load it before choosing a change.

The existing startup separately loads saved IndexedDB data, validates it, preserves
edits/deletions and reconciles the existing paired source/preparation files. Git
contains code and governed reference/default data, not a backup of the user's
mutable browser workspace. IndexedDB belongs to its browser profile/origin
(scheme, hostname and port); private browsing, cleared site storage or another
profile/host/port can expose a different store. No missing Windows record or data
loss is established by this code audit. Unsaved form text is memory, not a saved
record and is not guaranteed across browser close/reload.

## Current entry point and module rules

`01_CURRENT_STATE.json` now describes the current branch, PR53/3050, canonical
contract paths and storage boundaries without copying prices/private evidence.
The resume prompt and top-level AGENTS point to it. From `frontend`, run
`npm run context:pj0550` before editing. It prints actual Git HEAD/dirty files,
recent commits and existing module/section contracts. Optional repository or
frontend-relative file arguments narrow architectural implementation-path matches;
missing matches are explicitly not proof of no impact. `--check` validates context
paths, IDs/contracts and existing colour lookups. The tool is read-only, runs no
network requests and does not access or import private DATA/browser records.

Sources of truth stay separate:

| Contract | Canonical source |
|---|---|
| Domain principles / source authority / single ownership / frozen outputs | ADR-0550-001 |
| Architectural ID, purpose, inputs/outputs and invariants | moduleRegistry.js / architectureManifest.js |
| Display ID, number, purpose, inputs, method, output, limits and downstream | bidPresentation0550.js |
| Header / Copy ID / module-principle display | BidModulePresentation.jsx / ComponentCopyId |
| Module-family colour versus WBS-owner colour | existing functions in bidPresentation0550.js; project0550.css |
| Explicit saved-record dependencies | changeImpact0550.js / existing 09.3 Input-Impact view |
| State/review/approval and frozen issues | canonical models / releaseIssue0550.js |

Colour is not engineering acceptance. Numbers R01/R02 are display order, not
record identity. Dependency traversal is not complete semantic engineering impact.
The preflight is a developer workflow check, not automatic proof every future
agent read/understood the ADR or that every requirement is covered.

## Performance changes and boundaries

The public-seed Working page rendered 65,252 HTML elements even with WP.1–8 closed.
All eight tables were built on every Working mount; the project switched away by
unmounting Working entirely. These are code/render observations, not a measured
Windows CPU profile or proof of the only source of latency.

- Only opt-in WP.1–8 bodies are deferred until first opened. Every existing header,
  ID, colour and Copy ID remains available. Direct step/requirement/proof/activity
  links materialize the appropriate original stage. Expand-all still renders all
  eight stages. Once visited, a stage retains its editor on collapse.
- The existing Working screen is retained while another top-level tab/area is
  active, under a native hidden wrapper. Memoized props/index keep ordinary tab
  clicks from rebuilding its tree. No second Working workspace is created.
  Context changes still update it; all original model/release checks remain.
- Retention preserves Working drafts and expanded panels between tabs. It is not
  a disk persistence feature or an automatic save. Other proposal forms retain
  their existing dirty guards and behaviour.

ADR §§5–6,8–12 apply. No financial calculations/input, quantity/FX, source authority,
module ID/colour mapping, review stamp, export or frozen history is intentionally
changed. Initial source transfer/validation, first opening a large all-system
stage, model recalculation after a save, PDFs and the development bundle remain
separate potential costs. Retained DOM uses memory; no whole-app speed guarantee.

## Verification

- Current-context command and its `--check` passed, including invocation from the
  repository root and frontend. Changed JSX and CLI parse, diff whitespace checks
  passed. No new dependency, model, module ID or colour map was added.
- Extended existing Working Preview and SI supplier-evidence validators passed.
  Real React SSR verifies unopened bodies are not evaluated, all stage headers/
  Copy IDs remain, direct WP.7 renders the original table and non-opt-in Modules
  retain eager behaviour. Controls rendered for every opened WP.1–8 stage compare
  byte-for-byte after DOM serialization to the parent content (public seeds).
- Four SSR renders per screen, final three warm samples, isolated Node24/React:

  | Fixture | Working elements before → after | Warm SSR median ms before → after |
  |---|---:|---:|
  | Public prepared seed,264 requirements | 65,252 →41,863 | 363.62 →238.49 |
  | Older available private snapshot,676 sources/424 prepared requirements | 126,571 →51,766 | 685.22 →420.15 |

  These are HTML render measurements, not native browser click-to-paint timings.
  The private fixture is not current Rev11/Rev07,1708 requirements or Windows
  IndexedDB. Workspace/price hashes match exactly before/after for each fixture;
  known seed THB143,636,781.25 and HOLD remain unchanged. Private JSON stays out
  of Git. Volume I/II markup size/content remains unchanged in those measurements;
  differences in their timings are run noise, not a claimed improvement.
- Production webpack passed with the existing3.21MiB chunk warning. Full build
  validation status is recorded below after completion.
- Browser interaction verification could not run: no usable local Chromium was
  available and the separate cloud browser could not connect to the isolated
  localhost server (`ERR_CONNECTION_REFUSED`). No Windows startup, measured tab
  latency, unsaved-draft interaction, desktop/mobile visual QA or IndexedDB
  navigation parity is claimed. Authored pre-existing browser regressions are
  not reported as passing. Do not remove or weaken these checks to claim speed.

Next browser checks: ordinary Budget ↔ Quotation/Technical/Supplier and A ↔ B;
retained Working inputs/expansion, deferred step open/collapse/expand-all;
requirement/proof/activity/WP.7 Module Search navigation after collapse; save and
reload with fresh-source invalidation; C1/C2/default/all-mode/exports; dirty guards;
unchanged database/prices/history across read-only navigation; mobile containment
and zero page errors. Browser-close persistence applies to saved records only.

Full `npm run build` completed successfully: all chained validators and production
webpack passed (3.21MiB existing chunk warning). It ran the standard script before
the new preflight prefix was added; the final preflight and extended Working
Preview checks passed separately afterwards. No application source changed after
that full build. This is software/model/SSR evidence, not the blocked browser
interaction checks above or completed project engineering.
