# Working pricing status, source selection and all-system audit

5-Nov-2026 · UI2026-11-05.5 · parent5b92d9ae · existing branch / Draft PR53.

The owner reported the PAGA SELECTED / PROVISIONAL wording and repeated CAL/RPT
buttons, requested inspection across all systems, and supplied CCTV evidence
showing a long MGW source-basis string. The inspection covers the code and a local
reconstruction using the verified original project DATA SourceRev13/ARev09 and
PAGA, CERAGON, Master Tower and IDIE original Vendor registers. This is not a read
of the owner's Windows IndexedDB or a claim that saved Windows edits were loaded.
No private fixture, original rates or reconstructed workspace is committed.

## Findings and changes

- SELECTED follows the Working row's selection and inclusion rules. PROVISIONAL
  is a price-review context; it did not establish quotation age. The previous
  generic label called every provisional row an old price awaiting replacement,
  including current quotations and estimates. Working, Budget, Release preview,
  Vendor introduction and current draft XLSX wording now describe selected inputs
  and pending review. Actual date/validity/future-date/expiry warnings still come
  from the existing calculations. History labels remain historical.
- PAGA's original selected legacy owner still binds A20261632. A20261632-002 is
  registered source evidence, not an automatically adopted Working replacement.
  Each applicable row now identifies the bound Offer, source revision/filename
  where available and other same-vendor registered sources for that system. Other
  sources may have different scope; no lexical revision-order inference or price
  replacement is made. Navigation opens the existing canonical Vendor item.
- CCTV's selected MGW owner uses28 saved source rows, one Lot. The previous column
  printed all row IDs and the generated narrative inline. It now shows quote,
  source version and row count; a deferred list shows saved Working quantities,
  original quantities, active Offer rates and links. The exact saved source/hash
  and limitations remain inspectable. Calculations still read mgwDetailBasis.
- One price owner may legitimately support hundreds of distinct requirements.
  The previous renderer made identical buttons for every linked requirement.
  A pass-local index now feeds one collapsed trace with its exact count; expansion
  mounts named links with requirement ID, site and review state in a scrollable
  list. No requirements are truncated, merged, approved or written by inspection.
- Allocated native Working cost is labelled as allocated cost/estimate; it is not
  described as the full source quotation. Original Supplier totals, net/components,
  options and A/B/C allocation remain separate.
- The pre-change full build failed an old test expecting a64MiB paired HTTP bound.
  The runtime already has the documented80MiB+1024 paired bound and64MiB individual
  preparation bound for Rev09. Correct only that test's header boundary to one
  byte over80MiB+1024. No runtime input bound or source validation is weakened.

- A second pre-existing test still expected scope warnings to suppress a known
  provisional insurance estimate. The Nov4 pricing-process behavior already shows
  its six THB6000 inputs as THB36000 while retaining MR_CLARIFICATION. The test now
  verifies that arithmetic, the visible warning and strict Official null separately;
  update the dependent seed-browser total/count. No price or estimate is changed.

## Project-wide inspection

The reconstruction contains681 sources and1927 canonical/prepared requirements
(including retained/default records), seven original quote identities and all19
systems plus COMMON. It is distinct from the earlier saved fixture with1924 rows.

| Part | Selected financial owners | Owners with computed prices | Duplicate scope owners detected |
|---|---:|---:|---:|
| A | 21 | 21 | 0 |
| B | 57 | 57 | 0 |
| C | 10 | 10 | 0 |

All88 selected owners reconcile through Cost/Direct Sell/Markup/Margin, Prime and
saved FX. Base A+B excludes C; no unmapped financial owner or monetary requirement
gap remains in this reconstruction. These figures include pre-existing explicit
planning estimates and conditional non-additive price references. They do not
establish technical completeness, adequate spare lists, verified cable routes,
accepted interfaces, approved deviation or supplier quote validity.

Sixteen of20 source groups have directly registered original evidence. VSAT,
KU/C Internet, conferencing and AIS do not have a directly registered original
in this dataset. That absence does not create a zero-cost purchase or prove an
additional procurement: COMPANY responsibility, shared owners and estimates must
be read separately. MGW CCTV/LAN printed-versus-detail conflicts remain visible;
IDIE Asactual remains unknown. Original PAGA37/39 native rows, both15-row towers,
CERAGON option quantities and full shared-source totals retain their identities.

## Controls and validation

ADR0550-001 principles3/5/8/10/12 govern named many-to-many trace, single ownership,
source/Working navigation and existing module identities. Principles2/6/9/11
require truthful source versus interpretation, visible gaps, preserved saved
choices and frozen history. Principles13/14 keep project-wide scope and engineering
acceptance separate from numerical draft pricing. No architectural ID, financial
input, schema, persisted source/engineering record or customer authorization is
changed. Draft annotation text is intentionally corrected; issued output remains
on the existing frozen paths.

Validation completed so far:

- New Working trace/model/SSR regression: PASSED. All20 groups inspected; named
  links deferred without dropping records; saved MGW quantities drive cost;
  actual-date warnings and strict review gates retained.
- Available SourceRev13/ARev09/Vendor reconstruction: PASSED independent arithmetic
  across all88 selected owners, Base/Option sums, mapping and duplicate-scope
  diagnostics. Maximum329 linked requirements on one price owner.
- Before/after parent differential: PASSED exact workspace hash, every monetary
  row/quantity/selection/Offer/calculation identity, all aggregate totals and the
  complete strict Official projection. Current draft annotations intentionally differ.
- Existing supplier-cost separation and tower Working-price validators with the
  reconstructed data: PASSED. Seven source identities, full shared totals,
  PAGA37/39 native rows, IDIE Asactual, both15-row towers and22 disjoint quoted
  service allocations; financial/release projections unchanged.
- Production browser on both startup seeds and reconstructed private workspace:
  PASSED named requirement expansion/navigation (329 on PAGA), selected/other
  quote distinction and exact002 net-owner navigation,28 deferred CCTV source
  items,390px containment, reload, unchanged complete saved-workspace SHA-256
  and zero page errors. These are isolated browser origins, not Windows deployment.
- Focused activity-budget regression: PASSED, including numeric provisional
  insurance, retained MR_CLARIFICATION and strict Official withholding.
- Production webpack: PASSED, existing bundle-size advisory. Full repository build
  completion is recorded in the final entry below.

Windows installation and actual engineering acceptance remain unobserved. No
merge or customer issue.

## Final validation and delivery

- Full final `npm run build`: PASSED all chained validators and production webpack.
  The existing3.52MiB asset-size advisory remains. No validation assertion was
  removed; the two stale expectations above were reconciled to existing runtime
  behavior and strengthened with separate scope-warning/strict-review checks.
- Final focused Working trace/SSR after the source-caption cleanup: PASSED.
- Updated activity-budget browser: PASSED53 priced startup owners, corrected seed
  subtotal, source/Official/Release navigation, mobile, financial edits/deletions,
  intentional FX changes and reload with zero page errors. This seed subtotal is
  not the private DATA reconstruction's full draft price.
- Git whitespace checks: PASSED. Parent remote head rechecked as5b92d9ae before
  delivery. Publish only these code/test/checkpoint changes on the existing
  branch; retain Draft PR53, no merge/customer issue.

Pull/restart then inspect10.2 (`PJ2608-0550 / bid.budget.working.lines`), PAGA
`bid.budget.working.line.LINE-LEGACY-TEL-PAGA-1` and CCTV
`bid.budget.working.line.LINE-MGW-DETAIL-CCTV`. No new private JSON is required.
The displayed bound quotation and saved financial inputs must still be reviewed
against actual MR/engineering/commercial evidence before a fixed customer issue.
