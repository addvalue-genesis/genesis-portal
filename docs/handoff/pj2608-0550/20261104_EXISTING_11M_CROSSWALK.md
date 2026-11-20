# Improve existing11.M without new tabs/modules

Parent branch HEAD: `db64a240cc89bc7d7bb5e7780619e308d79f387f`.
UI `2026-11-04.11`, same branch / draft PR53 / port3050.

Owner asked to try the proposed crosswalk by improving existing screens, reading
the previous implementation first and avoiding more tabs/modules or duplicated work.

## Prior implementation inspected and reused

Read current state, ADR0550-001, SI equation Rev03/operating controls, architecture
and presentation contracts, BidVolumesWorkspace, WorkingSchedulePreview,
bidVolumes/Working-preview derivations, existing Working LineEditor/customer row,
MR catalogue, source-preparation path and existing validators.

Existing code already had canonical Working/Official prices, deterministic draft
Schedule suggestions, explicit DRAFT save, Schedule RecordEditor, Working LineEditor,
dirty guard, source/requirement reverse navigation and versioned native/frozen exports.
No replacement of these paths, schema, calculation model or customer template.

## Visible behavior

- Replace the existing11.M allocation grid, retaining its identity and existing
  selection/editor. Columns now show the same Working ID/owner, linked requirements
  and original references, responsibility/scope, Customer row, known Working USD
  versus reviewed10.7 USD, saved/suggested Schedule and reasons to inspect.
- Existing11.M filters: needs attention by default; B7–B9 (all13 records); all rows,
  including COMPANY/Included/unselected. Initial25-row limit with more on request.
  Filters and expansion are local display state, not persisted project decisions.
- Existing requirement/Working/VolumeII links open original records. Edit Schedule
  selects the original RecordEditor and scrolls it into view. Dirty/cancel/save
  behavior remains the existing optimistic authoring path.
- Two Base/Option diagnostic rows compare saved Schedule totals to reviewed10.7
  totals using existing decimal rounding. Unknown totals/differences stay OPEN;
  known zero is retained. AMOUNTS_MATCH is only equality of the two amounts, not
  engineering completeness, source acceptance or issue approval. Draft suggestions
  are not compared as though they were saved/reviewed allocations.
- Existing MR-catalogue annotations identify two CALL-OFF rows, authority/agent
  fees and CLARIFICATION scope. They prompt source/applicability review; they are
  not new contractual facts or automatic Base/Option/responsibility decisions.

## Invariants and remaining work

No tab/module ID, extra record store, migration, rate, quantity, FX, owner allocation,
customer-form row or approval added. Included/COMPANY/unselected rows carry no new
additive price. One Working record feeds all views; source authority and frozen
history remain intact. The existing full three-Volume and issue gates stay active.

Relevant ADR principles1–6,8–14: source/interpretation separation, explicit mapping,
SI responsibility, single cost ownership, visible gaps, reverse traceability,
dependency review, canonical data, immutable issues and evidence-based UI.
This change exposes the13 B7–B9 mapping/scope decisions; it does not close them,
invent customer rows, approve source clauses, finish PAGA engineering or issue a bid.
Windows consumption remains unverified. Continue actual contract-based13-row
allocation and PAGA multi-source/quantity/proof/AVL reconciliation in existing records.

## Actual checks

- Extended existing Working→Schedules validator:13 exact B7–B9 seed rows and source
  annotations; saved/suggested/known/reviewed price separation; null/zero/one-cent
  reconciliation; valid included owner; deleted lines not recreated; safe SSR;
  unchanged data and15 architectural identities. Existing MGW pricing propagation,
  package/components, DRAFT saves, partial totals/native Word and history checks pass.
- Extended existing browser validator: exact original tab list, original Schedule
  editor,13-row filter and advisory text, dirty guard/cancel, requirement reverse
  navigation,1440/390 containment, unchanged saved workspace and reload; zero page
  errors. Existing native C1/customer-price/Word/DRAFT-save regressions also pass.
- Actual private Source Rev11/A Rev07 isolated projection (legacy9-line seed,
  MR import and MGW Offer preparation before the existing paired loader):678 sources,
  1706 derived requirements,273 Working rows and all13 B7–B9 records. Explicit source
  bindings on those13 linked requirement records:0. Source/input SHA256 hashes are
  unchanged; reconciliation stays OPEN. This is not the owner's Windows workspace.
- Existing bid-volume, Release-issue and system-constraints validators pass.
- Context `--check` and `git diff --check` pass. Production webpack passes with
  the existing105.bundle.js asset-size warning. Internal screenshot inspected.

Additional source finding: the actual Rev11/Rev07 projection has all13 B7–B9 rows,
but their linked requirement records have no explicit Source IDs. Existing MR/JSON
reference text is preserved; the grid flags missing/unresolved source-file bindings
rather than treating those references as accepted clause evidence. This does not
establish missing original documents. Continue binding/reviewing the already
received sources through the original WP.4 requirement editor.

No private evidence or browser screenshots are bundled in Git.
