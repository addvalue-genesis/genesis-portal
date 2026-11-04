# Existing VND cost register: QO26163 and two grouping directions

4-Nov-2026, Asia/Bangkok. Parent 1d57c3a8, existing Official Working branch /
Draft PR53 / port3050. UI 2026-11-04.3.

## Exact authorised scope

The owner asked to register the newly supplied ID Industrial Engineering
QO26163 and switch the existing Vendor cost display between company → system
and system → company. Later instructions explicitly limited work to these two
items and improving the existing display without another screen/panel.

The existing 07.1 master and 07.2 offers keep their architectural and component
IDs. 07.2's old generic and per-MGW offer tables are replaced by one switchable
hierarchy, using the same saved offers. The original MGW reconciliation moves
inside the existing collapsed controlled-sources section; it is not duplicated.
Company, system and quotation groups retain independent +/−. System colours use
the original owner colour function. Shared offers are labelled references, have
one canonical navigation anchor per view, and never acquire another cost owner.
All source units/currencies remain visible; mixed currencies, time rates,
options and package references are not summed into an invented total.

## Registration and continuity

The existing bid.documents.si-work-package preview/apply surface additionally
accepts genesis.0550.vendor-register.v1. It adds vendors and standalone source
rates/options to the existing vendors / offers arrays, without a Working row
or financial adoption. Optional offer.quoteEvidence holds the explicit system
association, stated revision (empty if unstated), source ID/URL/SHA256/locator,
quoted quantity/unit/rate/currency, rate basis, classification and source terms.
The original quoted rate is retained separately from the editable current rate.
Old workspaces without this optional field stay valid.

The private prepared file is
PJ2608-0550_IDIE_QO26163_Vendor_Register_20261104.json. It adds one service
provider and four source rates/options, with no fixed commissioning duration or
trip quantity. Printed units are preserved; validity30days stays a source term,
not an invented expiry date. VAT, withholding/gross-up and payment-date FX are
terms to review, not new posted assumptions. The option stays explicitly marked.
Private prices/source payload are not committed to Git.

Apply recomputes against the current saved workspace through the existing
optimistic-revision change transaction. It preserves existing vendor/offer edits,
source/preparation work, selected Working lines, quantities, FX/margins and frozen
issues. The existing optional supplierRevisionImports receipt records batch
identity. A consumed identical batch is a no-op, including after deliberate
deletion; changed consumed content is rejected. Same content/quote-row under
another Drive copy is not another offer. Distinct quote revisions/versions retain
their own IDs; the new grouping never selects whichever date is newest.

System grouping uses explicit quote metadata, native MGW system associations and
saved SI/Working links; it does not infer engineering compatibility from names.
Unassociated offers remain visible in an unassigned group. Grouping is a read-only
projection and cannot approve MR mapping, price adoption or issue readiness.
Source pointers are retained on the offers; this bounded registration does not
replace/advance the customer's controlled source-intake batch.

## Verification

- Vendor registration/model/SSR checks passed, including the actual private JSON:
  preserved input, original rates/units/terms, edit/deletion retention, receipt
  idempotence/tampering, vendor reuse, source-copy dedupe, revision identity,
  invalid metadata rejection, both projections, unique anchors and escaping.
- Existing supplier-revision, SI-work-package, SI-controls, Working1–8 and native
  Exhibit-C validators passed. These exercise stale dependencies, financial and
  frozen-history preservation, legacy schemas and existing SI import controls.
- Production webpack passed with the existing asset-size warning (~3.32MiB).
- Actual production-browser/IndexedDB test passed with the private QO file: preview is read-only; Apply adds one vendor/four offers through the existing SI import; old financial/source/history records match; both hierarchy modes, original edit form, Copy IDs/deep links, 390px containment, reload and duplicate-import prevention pass. This is an isolated browser, not the owner's Windows store.

No full monorepo npm run build chain, Windows saved-data write, customer issue
or PR merge is claimed. Git pull installs code; the private register file is
applied using the existing import field to the owner's actual browser workspace.

ADR-0550-001 principles1–3,5–6,9–12 apply: preserve source facts versus
interpretation; distinguish system association from approved mapping; keep one
financial owner; disclose unknown duration/allocation; preserve revisions,
canonical identities and frozen history; reuse existing IDs/colours/navigation.
No full PAGA engineering closure or price allocation is added.

## Rev03 review feedback received during this task

The pasted six-point critique refers to an earlier code snapshot. Current
money0550.js already uses Decimal half-up (with upstream Number limits), and
releaseIssue0550.js already validates local frozen issue/output records and
append-only history. This does not establish an external SHA256/WORM archive or
authentication. Shared-proof dependencies and the three-currency limitation
remain governed by current code. No currency expansion, proof migration,
rounding-policy change, review reset or release-archive redesign was authorised
or implemented as part of this Vendor-only task.
