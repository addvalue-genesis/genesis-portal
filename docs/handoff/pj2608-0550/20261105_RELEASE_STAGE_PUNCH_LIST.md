# Existing 10.7 — stages connected to Common Bid Punch

5-Nov-2026 · UI 2026-11-05.8 · parent 473e0792 · existing branch / Draft PR53.

The owner requested clear stages and actionable work, then clarified that the
existing module must understand and connect the workflow. Improve existing
`PJ2608-0550 / bid.budget.release` (10.7). Reuse existing WP.8
`bid.working-preview.step.8`, its Common root-cause engine, IDs, basis keys,
severity assessment, plan editor and optional persisted `bidPunchPlans`.
No new architectural module ID, tab, workspace schema, store or migration.

## Existing module contract

Existing Source, requirements/Mapping, Working prices, Volume I/II/III, VDRL
and release controls are inputs. The same Common derivation serves WP.8 and
10.7; 10.7 adds Stage/system/search/paging and exposes the same plan editor.
A plan authored in either location appears in the other with the same identity
and stale-basis checks. Source actions use original B navigation and A source
navigation, not copies of the source records. Update the existing presentation
and MOD-RELEASED-SELL registry inputs/method/outputs/implementation boundaries.

`releasePunchList0550.js` is only a Release adapter over `deriveBidPunch0550`.
The existing Common `bidPunch.js` adds a pure `stageBidPunch` projection. It does
not change plan IDs or basis keys. There is no second grouping kernel or list
of independently saved punch records. All original financial, engineering,
review, issue authorization and delivery predicates remain authoritative.

## Stage and severity are separate

| View | Basis |
|---|---|
| Prepare scope and prices | Actual numeric blockers and known preparation tasks: Working commercial basis, input readiness, native ownership/quantity and price/mapping controls |
| Prepare With Bid | Explicit With-Bid obligation, package/technical responses, BID VDRL |
| Authorize / freeze / transmit | Existing actual Release readiness, issue and transmittal records; use the original forms below |
| Execute after PO | Explicit POST_AWARD phase recorded in canonical VDRL; still subject to its original review/problems |
| Needs stage determination | No explicit required phase: inspect the clause before deciding; keep unfamiliar controls visible |

Proposed plan phase does not move the required Stage. With-Bid remains Bid even
if a user proposes POST_AWARD. No phase is inferred from CAL/RPT titles, DRAFT,
Proof or OPEN. A recorded VDRL phase is not acceptance of deferral or proof of
actual delivery. Major/Minor is work priority, not permission to issue.
An empty Stage or a complete plan never means the engineering work is complete.

## Work and output

- Keep Common grouping by recorded source/system/cause and exact related MR
  identities. Shared source problems do not become extra purchases.
- Record action, owner, due date, price treatment and source/timing reference
  using the existing strict plan validation and normal revision/audit save.
- Preserve existing plan orphan/stale detection. Reading, filtering, searching,
  paging and exporting do not write canonical workspace records.
- Release mounts at most 25 task rows at a time. WP.8 retains its original
  default 40-row behavior. All roots remain searchable/exportable.
- Collapse raw control codes and compact PackageConsistency only in Release.
  Reuse the same derived volume view rather than recomputing it for that panel.
- Existing Internal Release Review JSON keeps `checks` and original `backlog`
  fields. Add `punchList` with shared root records, stages and raw gate rows.
  This is an internal review artifact, not a new customer issue/transmittal.

ADR-0550-001 including §§13/14 and SI Equation Rev03 §8 remain in effect.
Plans never close source OPEN, approve Proof/deviation, change prices/Qty/FX,
waive With-Bid, authorize a release or alter frozen history. Close work in its
original module, then recalculate readiness. Continue Working/Draft pricing
while resolving the actual scope, evidence and document tasks.

## Validation

The private fixture is an isolated reconstruction from available original DATA,
not the owner's Windows browser database. No customer issue or PR merge is
performed.

- Shared Stage/Release unit and SSR checks passed, including required Bid versus
  proposed POST_AWARD, unclassified unknown phase, pure rendering, shared plan
  identity/basis, stale FX and the 25-row initial Release bound.
- Actual-data Release and existing Common regression validators passed: 88/88
  selected owners have known draft costs/prices; zero numeric blockers. The
  same 1,166 Common roots appear in both views. Original 273 Release codes and
  2,432 legacy backlog records remain; source/financial/engineering/Release
  projections and saved fixture bytes stay unchanged by deriving the view.
- Those counts describe available reconstruction and grouping, not engineering
  closure or a complete accepted RFQ proposal. Stage counts: preparation 290,
  With-Bid 114, unclassified 762. No explicit POST_AWARD task is present in this
  reconstruction; this does not prove there are no post-order obligations.

- Full `npm run build` passed: 213 PASS output entries and production webpack
  compilation. The existing asset-size warning remains (0550 chunk 3.57 MiB).

- Isolated production-browser navigation checkpoints passed: five Stage cards,
  COMMON/code search, Stage/system filtering, 25-row paging, PAGA RPT → original
  Mapping editor, original A Source navigation, Internal Review JSON with legacy
  checks/backlog plus complete shared roots, 390px containment and unchanged
  canonical saved-state hash during reading/filtering/export/reload.
- Final focused production-browser plan regression passed after giving Release
  and WP.8 distinct accessible region labels: save in Release, read the same
  authored plan in WP.8, reload and read again in Release; only existing plans
  and normal revision/audit change. Source, prices, engineering and frozen
  records remain byte-equivalent; zero page errors. This focused run uses
  `PJ0550_PUNCH_PLAN_ONLY=1` with the existing private-fixture browser command.
- Final focused Stage unit/SSR and production webpack compilation passed after
  the region-label adjustment. Windows deployment remains unobserved.

## Concurrent source-link update

Retain parent473e0792 KU supplier pricing and canonical MR-link changes intact.
Stage/Punch is added on that latest tree; no overwrite of its shortcuts, source
applicability, MR/Offer links or manual-versus-quote distinctions. Final combined
checks passed: continuity/contracts, actual shared Release/Stage model, actual
all-system Supplier cost/MR-link regression, production compilation, and the
focused shared-plan browser save/WP.8/reload/canonical-preservation check. The
combined reconstruction retains the same 1,166 roots / 273 gates / 2,432 backlog
records. Final UI version is 2026-11-05.8.
