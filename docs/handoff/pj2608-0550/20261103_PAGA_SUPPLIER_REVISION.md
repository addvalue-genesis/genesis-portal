# PAGA supplier revision continuation — 3 November 2026

Parent: `d34d8cb7`. Existing Official Working branch / PR53 draft / port3050.
Continue PAGA first, A → SI → B INDUSTRONIC, then existing Working/Scope/Release.
No new architecture/presentation Module ID, vendor selection or colour change.

## Evidence actually available

The attached ZIP is truncated after the local header for preparation Rev07;
its central directory, `state.json`, report folder and complete ancestor chain
are absent. Local-header recovery produced START_HERE, all listed PAGA PDFs /
page extractions / tag and quote-review JSON, complete Source Rev11 and the
complete **top-level** Rev07 integrationWorkspace/sourceControl. The recovered
preparation fields are not a valid complete v5 package: never substitute them
for the normal Rev07 DATA file or invent the missing ancestors/state.

Git branch HEAD matched the handoff. Existing PAGA95 authored drafts and217
site-qualified customer TAG candidates were used; no all-project restart.
Quote pricing/quantity evidence stays private, outside this repository.

## Actual implementation

The existing `bid.documents.si-work-package` importer accepts a private
`genesis.0550.supplier-revision.v1` package in addition to the unchanged SI
schemas. Preview is read-only; Apply recomputes against the current workspace
and uses the existing `change` / optimistic-revision IndexedDB adapter.

- Canonical source successor requires an exact reviewed predecessor; every
  original source and non-receipt register survives unchanged. Supplier evidence
  stays separate from CURRENT_TENDER authority. Old automatic Rev11 loads return
  LOCAL_NEWER after adoption, rather than reverting the source successor.
- New offers retain revision + item-code identity, quantity/original unit,
  classification and one parent NET_PACKAGE. Decimal gross/discountable/discount/
  net reconciliation excludes options and included references.
- One **unselected** net-package Working candidate is added. All saved offers,
  selected lines, quantities, FX, margins, source/preparation receipts and frozen
  outputs remain. Component gross prices/options are evidence: using them directly
  as Working owners has no additive cost and remains OPEN.
- Existing requirements update only against the exact expected draft fingerprint;
  saved edits and missing/deleted prior requirements are retained. New site/TAG
  requirements link supplier evidence and the candidate owner without asserting
  actual per-TAG allocation. OPEN review stamps stay blank.
- Optional `supplierRevisionImports` records batch identity; repeat import is a
  no-op, deletions are not refilled, changed consumed batches and financial ID
  collisions fail closed. Existing backup/export schema includes this optional
  receipt and optional offer `supplierQuoteRow`; old workspaces remain valid.
- Vendor07.2 shows the live quote revision, net package selection status and
  original row quantities/classification using its existing Module ID.

ADR-0550-001 §§1–6,8–11,14 affected this change: exact source facts versus
interpretation; many-to-many candidate links; single financial owner; explicit
engineering gaps; revision impact; shared records; preservation of history.
The importer is not an engineering approval or project-wide semantic audit.

## Private result and installation boundary

Actual reconstructed canonical transaction added40 offers (one net owner plus
18base /5option /16included rows),217 TAG drafts and26 OPEN particulars; it
updated95 exact prior PAGA drafts and added one unselected Working line. This
is a validated reconstruction from available evidence, **not Windows saved data**.

Use the separately delivered Canonical_Import JSON in the existing SI import
surface after pulling this code. Do not use a reconstructed full workspace backup
to replace the owner's current IndexedDB. Do not install the standalone source
successor over the existing paired DATA/preparation files. A changed predecessor
or vendor identity requires reconciliation; never remove guards to force import.
Normal A auto-loading remains unchanged; no new startup price seed was added.

## Remaining project work

Named-node/site allocation, speaker quantities/acoustics, beacon HAC/power/colour,
SPE Xenon conflict, OCU functions, licences, UPS/ESD applicability, I/O/expansion,
bulk/service/spares ownership, AVL/deviation and formal price adoption stay OPEN.
Legacy access-panel addition rationale is preserved; newly included beacon
control must not be charged twice. Same item5010 means different products in the
two quotes; revision identity is essential. Keep Release10.7 HOLD.

## Verification

Synthetic regression and the actual recovered private transaction passed:
source ancestor / existing financial preservation,95+217+26+40 counts,
Decimal totals, same-code/different-revision identity, edited/deleted records,
receipt idempotence/tampering, invalid/approved/foreign imports, non-additive
pricing and real SI/Vendor React SSR. Existing SI importer regression passed.
The full build result is recorded below after completion.

Browser interaction/real IndexedDB/Windows installation remain unverified: this
runtime has Playwright but lacks its Chromium executable. No claim that records
were written into Jack's browser or that all customer engineering is complete.

Final validation: full `npm run build` passed all chained repository validators
and production webpack (existing3.23MiB asset-size warning,15723ms webpack).
This invocation started before the new supplier-regression prefix was added;
that final regression ran separately afterwards, including the actual private
217 customer/supplier excerpt checks and Vendor07.2 SSR, and passed. Final
context `--check` and diff whitespace checks passed separately. No dependencies
were added. UI version is `2026-11-03.4-preview`.
