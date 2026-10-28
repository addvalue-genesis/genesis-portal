# PJ2608-0550 — MR work process and inherited bases

UI version: `2026-10-28.4-preview`. Continue on
`feat/pj2608-0550-official-working-20261028`, draft PR #53.

This corrects the earlier handoff's UI ordering using the user's current instructions:
design the work top-down from the existing A/B/C customer form, use the attached
MM-ASK-1A-APF-TEL-MR-0001 Rev.B1 for scope, and reuse bases already present in 01–08.
Bottom-up cost arithmetic remains in the existing model.

## Display order and stable identities

| Display | Existing identity | Work |
|---|---|---|
| 10.1 | bid.budget.working.sources | MR, inherited bases, source impact and current FX |
| 10.2 | bid.budget.working.lines | Target customer rows, MR-ordered system breakdown, cost/sell |
| 10.2.1 | bid.budget.working.editor | Prepare/edit one line and its review |
| 10.3 | bid.budget.official.customer-scope | Check customer-row completeness |
| 10.4 | bid.budget.scope-gates | Resolve gaps |
| 10.5 | bid.budget.official.summary | Review totals/status |
| 10.6 | bid.budget.budget-thb | Budget THB stage |
| 10.7 | bid.budget.release | Existing customer USD form stage |
| 10.8 | bid.budget.official.history-comparison | Supporting history comparison |

Display numbers changed; stable module, line, customer and architecture IDs did not.
The 19 systems and COMMON appear exactly once. A uses MR Appendix 1.1–1.8 order;
tower/AIS/shared scope follows under Appendix 1.0 for detailed scope review.
System-to-appendix associations are working navigation mappings, not evidence review.
The source is the MR introduction, printed p02/52. Preserve the 24 existing customer
codes and the original Release/export order. Do not renumber customer codes to match
Appendix numbers. Customer rows spanning multiple systems show all relevant appendix
references. No MR attachment or private runtime inputs were committed.

## Reuse of existing bases

- 02 and Working show the same existing policy, FX-reference and resource basis.
- Preparing a target creates an unsaved draft, with the customer code and suitable
  existing goods/professional-service policy where applicable. No price is posted.
- Policy numbers are projected from the exact existing `commercialPolicy` formula;
  an unrecognised/open formula supplies no numeric defaults. No frozen dataset changed.
- 06 role selection uses `CORE_TEAM.protectedUsdDay` as a USD/MD selling rate, never
  as internal cost. Incompatible quote units/currencies or existing manual cost units
  block application; no silent currency reinterpretation or conversion.
- Saved calculations remain selectable by ID. Quantity units follow the central
  equation definition when there is no quote. Quote units remain authoritative and
  mismatches retain the existing gate.
- A new E17 editor draft inherits the current saved workspace FX. It does not read
  the historical snapshot as current FX or modify an existing calculation.
- The 01 FX reference (08-Oct snapshot) can be explicitly loaded into the FX draft
  with its original date/source. It is not saved on load and does not bypass review.
- Existing saved line values, empty-workspace FX, equation kernels, schema, review
  fingerprints and frozen History remain unchanged.

## Validation and limits

Production build and project-data/reference/model validation pass. Browser validation
adds work-order/target/preset checks and upstream E17 navigation to the prior workflow
checks (17 total). It covers mobile containment, stable IDs, source/release navigation,
staleness, concurrency, imports and duplicate ownership. Synthetic data only.

The historical SAMTEL XLSX remains byte-identical:
`2065bb70efa3e8b3bb90b4fbe64f099e02d1ae6c73a73d03b8e745987becafc6`.

The private browser workspace and actual Official price readiness were not inspected.
Defaults still require applicability review. User installation of this version is not
verified. Release stays HOLD / NOT ISSUED. No merge, deployment or customer issue.

Windows update uses the existing detached review worktree and original port 3001:
check for local changes, fetch the review branch, then switch detached to FETCH_HEAD.
Dependencies did not change; no `npm ci` is needed solely for this update.
