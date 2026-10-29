# 0550 — Private SI engineering draft intake

UI: `2026-10-29.6-preview`. Based on `de690d8d`, preserving the Deviation
Release and selected INDUSTRONIC work. This is an implementation checkpoint,
not a statement that the project's engineering or customer issue is complete.

## Behavior

`bid.documents.si-work-package`, under Original RFQ, previews and imports a private
`genesis.0550.si-work-package.v1` JSON. Working Preview links to this module, which
is searchable by its existing project/module ID convention.

The package contains a controlled source intake and unstamped Integration drafts.
Requirements, reports, activities and other supported records enter the existing
canonical Integration workspace. No separate editable data store is introduced.
Only missing IDs are added. Identical records are skipped; differing existing IDs
are preserved and listed in the preview. Reimport is idempotent. Source updates
use the existing batch/no-downgrade/history rules; an older package or a conflicting
same-batch source is rejected before saving. Applying recomputes the plan against
the current workspace; the existing revision lock prevents stale saves.

The source inventory initially displays 50 matching records, with additional
records available in groups of 50. Search covers the whole inventory; navigation
to a specific source reveals its row. Extracted text is rendered when its detail
is opened, avoiding eagerly rendering the entire private evidence corpus.

Imported records must be DRAFT without reviewer/date/basis stamps. Reports remain
OPEN; accepted deviation decisions and NOT_APPLICABLE requirements are rejected.
The package cannot contain pricing/FX/offer selection fields. Raw quantities,
rates, selected suppliers, calculations, topology, customer reviews and historical
outputs are preserved. Source changes still invalidate dependent existing reviews.
Final issue authorization remains HOLD.

The source bridge, source-file input, workspace-backup input and SI-package input
use a bounded 16 MiB limit to support the private extracted-evidence package.
The bridge remains loopback/same-origin only; private text is never bundled.

## Principles applied

ADR-0550-001 principles **1–6, 8–14**: preserve source facts separately from
interpretation and derived reports; retain all-system/common coverage and gaps;
keep single cost owners and existing decisions; use canonical shared records,
dependency review, stable navigation and immutable history. Principle 7 remains
part of source review: an import does not verify that a CLOSED comment was
incorporated into the controlled drawing/specification.

## Verification

- `validate:pj0550-si-work-package`: nonmutating canonical merge, idempotency,
  preserving user edits/financial fields/history, invalid/approved/foreign draft
  rejection, source conflicts/no-downgrade, OPEN readiness and real React UI.
- Existing source-Drive bridge, Working Preview, Bidding, selected INDUSTRONIC AVL,
  Deviation Release and SI monetary controls passed.
- Production webpack passed with the existing bundle-size warning.
- Isolated browser with the private package: preview/apply, preserved financial
  inputs and selected PAGA AVL, persisted canonical drafts, reload and idempotent
  preview passed. Architecture/Guide/navigation/mobile checks also passed, with no
  page errors. The browser fixture is isolated from the user's actual workspace.
- Private source-derived checks verified supplier worksheet totals, numerical
  reconciliations and populated customer excerpts. The private report records
  exact source/locator coverage, assumptions and remaining gaps separately.

## Remaining work

Private drafts are preparation, not approved mappings or full engineering proof.
Unread pages, drawing/colour/appendix review, source conflicts, engineering inputs,
offer/model allocation, resource quantities, costs and customer approvals remain
visible OPEN until supported. Received evidence and derived desk reports remain
distinct; product capability and supplier declaration do not prove site adequacy.
The broader impact graph and controlled issue/transmittal workflow are unchanged.

After pulling/restarting, use the private package supplied separately. This commit
does not claim to have installed it in the user's Windows browser or verified
their Drive Desktop synchronization.
