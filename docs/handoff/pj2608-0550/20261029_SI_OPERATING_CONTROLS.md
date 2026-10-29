# PJ2608-0550 — SI operating equation and monetary/display controls

Date: 29-Oct-2026 (Asia/Bangkok). UI `2026-10-29.4-preview`.
Initial base: `ac3e2391a78f75908719bc0dcf55f798198372a8`. Final integration follows
`f9cc7383e2267767c8528bef1fea00ef2559e803` (selected INDUSTRONIC deviation)
on the existing Official Working branch; that commit is preserved.

## User-visible changes

03 Architecture and the existing `bid.budget.guide` now explain
`R10.7 = CustomerForm(Review(F_SI(A, S; K, D, Θ)))`.
A is the customer's evidence, S the supplier's evidence and F_SI the integrator's
work inside menu B. Commercial Parts A/B/C remain independent namespaces.
Both views show the same runtime-derived checks and navigate through existing
module IDs to the source, WP.1–WP.8, equations, supplier offers, customer mapping
and release preview. The full Architecture table provides Copy ID for each target.
No new navigational module or duplicated project-data store is introduced.

The counters are diagnostics from the existing Integration/Official models.
They overlap and must not be summed. CLEAR means that diagnostic has no listed
problem; it does not prove all customer clauses were discovered. Integration
readiness and customer-scope review remain separate from release authorization.

## Monetary policy and migration behavior

`data/money0550.js` uses a private decimal.js 10.6.0 context, 40 significant
digits, HALF_UP rounding to two decimal places at the existing money boundaries.
It also sums displayed money using decimal addition. Invalid/missing or
unsupported-precision amounts return null, not zero.

Existing equations and their Number intermediates are preserved. This change
does not claim full decimal arithmetic upstream of those boundaries. It fixes
counterexamples such as 10.075, 4.015 and 128.015 at the rounding boundary and
uses the same helper for Working, Official and displayed export unit prices.

The rounding policy identifier is part of the Official line-review fingerprint.
Previously saved reviews therefore become STALE and require review again.
Raw saved quantities, rates, margin, Prime, FX, source records and decisions
are not rewritten or auto-approved. Issued snapshots and the original historical
XLSX path do not use the new mutable-money helper.

Official lines must reconcile their two-decimal displayed unit price × quantity
with the line amount (rounded to cents). A mismatch adds
`DISPLAY_UNIT_AMOUNT_MISMATCH`, withholding reviewed Official values. A reviewer
cannot remove this problem merely by stamping a review. Provisional previews and
draft files retain the candidate amount with a rounding-review warning; no rate,
FX or quantity is automatically adjusted. Review XLSX now uses the same rounded
unit-price basis as the customer draft. The eight-column customer template,
Lot/detail structure, Base/Option split and HOLD are preserved.

## Principles applied

ADR-0550-001 principles **5–6, 8–12 and 14** affected the implementation:
single cost ownership, visible gaps, source-to-output navigation, stale reviews
after policy changes, canonical shared models, frozen history, explicit module
purpose and engineering-acceptance separation. Proof criteria/operators,
supplier scope, schema cardinality and customer template layout are unchanged.

## Verification

- New synthetic `validate:pj0550-si-controls`: decimal ties/counterexamples,
  missing/overflow money, exact money sums, nonmutating derivation, unit/amount
  Official gate and Provisional warning, export unit-price consistency,
  eight-column customer form, stale review and real React SSR controls.
- Existing 0550 Bidding and Working Preview validations passed during implementation.
- Compared raw monetary projections before/after for all 273 tracked MR/vendor
  seed rows using explicitly **synthetic FX 40 THB/USD and 42 THB/EUR**: no
  differences in nine compared money fields; input bytes unchanged. This is not
  a check of the user's private browser workspace or actual project FX.
- Full `npm run build` on the initial base: 174 PASS markers and production webpack
  passed, with one existing bundle-size warning.
- After the mobile grid fix, production compilation and isolated browser checks
  passed: Architecture/Guide, all 15 target entries rendered, actual A/Supplier/10.7
  navigation and reverse Source navigation, Guide-to-Architecture, mobile containment
  and unchanged IndexedDB across navigation/reload. No page errors.
- After integrating `f9cc7383`: SI controls, Working Preview (including the selected
  INDUSTRONIC deviation regression), Bidding, production webpack and the isolated
  SI browser regression all passed again. The one bundle-size warning remains.
  The initial 174-marker full chain is not represented as a full rerun on this
  different base; the final rerun covers the changed 0550 behavior and compilation.
- `git diff --check` passed. No changes to 0553, common UI or controlled 0550
  snapshot files are included in this implementation commit.

## Remaining boundaries

Actual project-wide source reading, derived CAL/RPT and commercial review are
still engineering work. Full dependency-graph impact lists, shared proof/activity
schema migration, accepted numeric tolerances and controlled issue/transmittal
remain outstanding. The exact customer policy for unit-price/line-amount
rounding must be established from the controlled form before formal issue.
Release remains HOLD; this change creates neither issue approval nor transmittal.

The reviewed [SI equation Rev03](../../architecture/PJ2608-0550_SI_Equation_Rev03.md)
is retained as the design reference, including the previously observed gaps.
This checkpoint supersedes its description of the old rounding/display behavior
only for the implementation described above.
