# 0550 satellite responsibility in current Working

Version: `2026-10-28.6-preview`. Continues PR #53 on
`feat/pj2608-0550-official-working-20261028`, from `66944984`.

The user requested removing inapplicable VSAT supply from the proposal after
reviewing MR Rev.B1. The system still has TSI equipment and services, so removing
the entire system/customer row would lose required scope. The review locators
are printed p07 §2.2(a) and p12–13 Appendix 1.2 (PDF pages 9, 14–15).
Native documents and private browser records are not included in this change.

## Findings and implemented behavior

- The frozen historical dataset includes complete-new-VSAT and recurring-service
  assumptions. It remains historical evidence, unchanged. The existing vendor
  import already excludes these allowances; it imports no VSAT quotation.
- Working rows under TEL-VSAT, TEL-VSAT-KU, or customer A1-02 now require an
  explicit responsibility split. An old unclassified/mixed package is OPEN in
  both provisional and reviewed pricing, including native amounts and exports.
  No component cost is guessed or subtracted pro rata from a package price.
- The existing line editor distinguishes COMPANY supply, TSI equipment, TSI
  services and clarification. A non-open classification requires the existing
  Requirement reference plus a scope-basis explanation. These are working inputs,
  not an automatic Official approval or a substitute for linked source review.
- Evidenced COMPANY-supplied lines have no effective selection or price in the
  canonical calculation, Budget, Official, provisional or customer exports.
  They remain in the source hierarchy with their stored inputs and IDs. Selecting
  COMPANY in the editor deselects the saved line; imported older selected records
  are also excluded by the projection without modifying the original data.
- TSI supporting equipment, relevant spares/tools and services retain the same
  calculation and pricing policies. Scope basis changes invalidate their review.
  Customer A1-02 remains OPEN if retained TSI scope has not been priced/reviewed.
- KU/C Internet equipment/service responsibility stays a clarification. No
  automatic COMPANY classification is made. Network equipment responsibility and
  the APF/ACP installation-location discrepancy also remain explicit questions.
- Entertainment is unaffected. Stable system, customer, module and line IDs,
  quantities, FX, margins, vendor prices and other projects are preserved.
- Excluded source rows navigate to their retained customer group, rather than a
  removed customer-detail row. Current scope notes appear in the 19-system view
  alongside clear identification of the older snapshot basis.

## Use and limits

Open 10.2.1 for a satellite row, record its responsibility and evidence basis,
then save. Split an existing mixed quote into independently supported components
before selecting TSI costs. Do not tag a whole mixed package as TSI equipment.
Retain engineering/installation/integration/testing/commissioning where required;
do not assume a COMPANY terminal removes related TSI work.

The current browser database on the user's PC is not accessible from GitHub.
Therefore this change does not establish a real bid reduction amount or claim
that the user's saved rows have been classified. Updating the code applies the
OPEN guard to existing unclassified satellite rows without changing their inputs.
No current-price defaults are read from History. Release remains HOLD / NOT ISSUED.

Optional line fields `satelliteScope` and `scopeBasis` are backward compatible
with existing saved data and backups when loaded by this version. A backup saved
with these fields requires this or a newer version; older strict validators do
not recognize them. No database rewrite or destructive migration is performed.

## Verification

Model tests use synthetic prices and cover old mixed packages, COMPANY exclusion
through all projections and customer XLSX, retained TSI equipment and services,
KU clarification, Entertainment, duplicate ownership, review staleness, immutable
inputs and backup roundtrips. Browser regression additionally exercises the editor,
source navigation, persisted reload, draft export and backup restore.

Validation completed: all validators in the build command passed; production
webpack compiled with the existing asset-size warning. Initial compilation used
an incomplete cached dependency set; clean `npm ci --ignore-scripts` restored the
locked dependencies and production compilation then passed. No dependency or lock
file changes were required. Chromium integration passed 19 checks with no page or
console errors, including the new satellite scenario. All test data were synthetic.
The frozen SAMTEL Rev00 XLSX remains byte-identical, SHA-256
`2065bb70efa3e8b3bb90b4fbe64f099e02d1ae6c73a73d03b8e745987becafc6`.

No merge, deployment, customer issue or review approval is performed.
