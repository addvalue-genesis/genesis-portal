# Existing WP.1 responsibility / Vendor / Working overview

Starting branch HEAD: `650bce165e3b79d987679d629bdd5d6450730689`.
UI: `2026-11-04.10`. Same branch / draft PR53 / port3050.

## Behavior and canonical ownership

The existing WP.1 all-system scope table now separates TSI supply, COMPANY
responsibility, TSI services, unresolved responsibility/type and reviewed N/A.
Counts are requirement records, not equipment quantities or completeness scores.
All canonical systems, COMMON and additional authored scope remain visible.
Selected-system mode shows the same summary above the original constraint worklist.

Classification uses the current canonical requirement responsibility and linked
Working WBS (MR catalogue WBS only for its exact seed when no linked line is found).
Mixed or untyped work stays unresolved; title keywords do not decide scope.
Requirement groups open the existing record editor and materialize their record
lists only when expanded. Scope review/problems and its existing editor remain.

Offer presence uses the existing Vendor register projection, including exact
quotation system tokens and current requirement/Working bindings. Valid linked IDs,
missing references and canonical REVIEWED_MAPPING are separate counts. No link is
not evidence of no Vendor or an instruction to procure COMPANY equipment.

Working references use the existing MR owner-validation rule before accepting an
included owner, then deduplicate selected owners per system. Missing, deselected or
invalid owner references remain visible. Known-price counts use the existing finite
provisionalCustomerTHB (including zero), not Official/Release approval. COMMON or
shared owners are not allocated, added or summed across systems. COMPANY and
reviewed N/A records do not create TSI procurement-price gaps. Unlinked requirements
are shown separately. All navigation reuses original record/module IDs.

## Domain limits

VSAT retains COMPANY main equipment, TSI accessories/services and clarification;
AIS retains COMPANY supply and TSI engineering/testing. The two MGW Ku dishes
remain TEL-ES, not inferred TEL-VSAT-KU Internet. VCS catalogue requirements are
not treated as accepted MGW endpoints. MR is one source of requirements, not an
override of applicable PHI/DTS/SPE/drawings/standards/contracts.

ADR0550-001 principles1–6,8–14 guide the change: preserve source/requirement lineage,
separate supplier evidence from adequacy, preserve SI work and single cost ownership,
and distinguish received CAL/RPT from derived proof and frozen issues. This view is
read-only. It does not implement semantic document extraction, accept applicability,
resolve conflicts, prove capacities/quantity allocation, change AVL or pass Release.
Actual all-system engineering and owner Windows deployment remain unverified.

## Validation

- Extended system-constraints logic/SSR checks: VSAT/AIS split, VCS and Ku scope,
  exact MGW dish tokens, all/additional systems, exclusive record classification,
  valid/missing Offer IDs, zero/missing prices, valid/invalid/deselected/missing
  owners, mixed scope, reviewed N/A, no mutations and unchanged architectural IDs.
- Existing Working Preview and commercial Release-issue validators passed,
  including source staleness, unchanged financial inputs and immutable history.
- Existing context `--check` passed. `git diff --check` passed.
- Production webpack passed; one existing asset-size warning (105.bundle.js).
- Actual Source Rev11 / A Rev07 isolated browser:678 sources,20 scope options;
  VCS/VSAT/Ku/AIS/LAN/CCTV/COMMON, scope editor, requirement editor, source reverse
  navigation, search,1440/390 containment, reload, exact saved-workspace preservation
  and no page errors passed. Opening a lazily rendered responsibility group also
  navigated to the existing requirement editor without saving.

Private DATA is not bundled or changed. Git pull updates this view, not a browser
workspace backup. No financial adoption, customer issue, merge or deployment claim.

## Antigravity comment reviewed during this continuation

Owner supplied a report explicitly based on d641c9f0. Compared with branch650bce16
and the bounded WP.1 changes above; the report is evidence to evaluate, not an
instruction to replace the architecture or alter native customer forms.

- bidVolumes0550 derives active rows from model.official.lines (line81), and binding
  amount from line.customerUSD (line98). Bindings allocate scope/terms, not another
  editable price store. Missing allocations do produce HOLD. The existing synthetic
  validator reaches ready=true and equal baseAssigned/official.baseUSD; HOLD is not
  structurally permanent or proof of disconnection.
- Different WBS / Schedule code names do not change treatment or amounts. Existing
  scheduleAllocationPlan0550 is deterministic draft guidance and has an explicit
  saveScheduleAllocationDrafts0550 path preserving saved allocations. It remains
  deliberately unreviewed; this is not automatic semantic acceptance.
- B7/B8/B9 are absent from the reference customerForm rows. Real seed gap:4+5+4
  catalogue lines import with unmapped customerRowCode. Runtime mappingValid accepts
  any of these WBS under an existing Part B row (tested B1); that test is not a
  project allocation decision. Resolve default/allocation basis with the actual
  customer form, preserve saved decisions and shared owners; do not add native
  customer rows or reprice to silence the gate.
- nativePages uses chunks/continuation pages, including35 C1 rows across2 pages;
  native Word uses the same page projection, and the C1 versioned Word builder.
  Existing native/bid-volume/Working-schedule validators passed, including overflow,
  current-price propagation, canonical financial preservation and frozen exports.
- Current RFQ catalogue is85 expected inputs:78 DOCUMENT,2 EMBEDDED (both have
  excerpts),5 ATTACHMENT. Actual text is in private Source Intake (678 sources in
  the tested Rev11 pair); sourceReadiness checks bound sources, authority/revision,
  read state, embedded excerpts and document reviews. Expected-input metadata is
  not a claim of completed reading/engineering.
- PAGA/Master/IDIE/CERAGON private quotation/default/loader work is documented in
  prior checkpoints; MGW is not the only supported Vendor JSON. Detailed coverage
  for remaining legacy radio offers must still be checked individually.
- Discovery accepts GENESIS_0550_PROJECT_DIR and established Drive project/DATA
  paths. The report's Downloads/0550 listing cannot establish failure on the
  owner's Windows mount or prove private DATA absent. Do not claim Windows
  deployment from repository inspection or isolated browser tests.

Keep separate CUS sources, supplier evidence and authored SI mappings; do not use
Vendor quotations to rewrite the MR requirement catalogue. Follow canonical Working
pricing into both presenters, with explicit reviewed Schedule allocation and exact
reconciliation; do not delete HOLD controls or frozen-history protections.

## 7-Nov-2026. Working results by system

WP.1 `10.2.2.1.3` shows the existing Volume II draft and selected Working
owners for each system while CUS review is open. It displays THB subtotals for
Base A/B and Option C separately, retaining open owner rows and non-additive
references to other systems and COMMON. Existing CUS findings link back to
their source records. ADR §§4–6, 8–13 govern the projection.

The Rev.36 Drive pair combined with the reconstructed Working fixture produces
19 system drafts and COMMON. Selected Working owners appear once across those
rows. Hazardous Area Telephone references the existing PABX package and AIS
references COMMON activities. The two tower equipment prices remain open in
the tested fixture. The canonical reviews, quantities, prices and issue state
are unchanged. Context, system constraints and Working Preview validation and
the development webpack build passed. The owner's saved Windows workspace has
yet to be verified.
