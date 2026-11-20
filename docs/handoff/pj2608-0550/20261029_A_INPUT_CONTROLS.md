# 0550 A — RFQ expected inputs and shared reading controls

UI `2026-10-29.14-preview`, based on `fe312f501ba04e5ec40c4448eaee407517534f0d`.
Integrated with `131c642f` (Volume II Technical Proposal).
Existing Official Working branch. This implements A coding; it is not an assertion
that the private project corpus is complete or that its engineering is approved.

## Existing modules, one canonical workspace

- `l3.original` / `bid.documents.controlled-source-inventory` now includes the
  expected-versus-received RFQ register, source bindings, additional expected inputs,
  reading and completeness review, diagnostics and internal JSON export. There is
  no new architectural module ID, customer column or financial owner.
- `rfqInputCatalog0550.json` contains expected-input metadata: 78 numbered
  document/revision entries from MR B1 Appendix 2 (PDF p31–35), embedded SDRL/ITR,
  and five procurement/contract/invitation/AVL/customer-form entries. These 85
  obligations are not 85 separate files. No private source text/email is bundled.
  The metadata records the inspected MR byte hash and reference locations.
- This is an initial denominator, not an automatic assertion of all project
  cross-references. Additional RFQ/contract/reference inputs can be added with the
  requirement and locator that defines them. Nothing removes baseline entries.
- Binding a source is explicit. The bulk action proposes only a unique current
  exact document/revision match, preserving existing bindings and leaving the
  manifest DRAFT. Named attachments, duplicate copies, different numbers and other
  revisions require investigation. 10006 is not normalized into 10008.
- Reading from A writes the same `integrationWorkspace.documentReviews` as B's
  existing Document reading ledger. Full pages, notes, colour, appendices, reviewer,
  date and source fingerprints remain prerequisites. This does not silently change
  intake TEXT_PARTIAL/METADATA_ONLY into TEXT_READ or alter source authority.
- Optional `sourceControl` stores bindings, extra expected inputs, catalog version
  and manifest review in the existing workspace/backup/revision store. Intake v1
  and SI work packages remain unchanged. Source updates retain bindings but stale
  the manifest review; the user must reconcile them again.

## Runtime boundaries

`deriveSourceReadiness0550` computes A_OPEN / A_STALE / A_READY_FOR_B from the
actual intake, explicit bindings, version/copy checks, derived document reading
states and current manifest review. All three denominator declarations (RFQ,
received sets/archives and cross-references) and a basis/reviewer/date are required.
A checkbox cannot override missing, wrong-version, unread or stale evidence.
Unbound supplier/history documents do not become prerequisites of A; B retains its
own wider Integration document/engineering checks. Catalog/denominator review is
still a recorded engineering judgement, not independent document certification.

B's Working Preview and existing SI controls show the same A readiness and link
back to A. Existing Working prices, seed preparation and manual edits remain drafts;
A does not approve CAL/RPT, topology, quantities, suppliers, costs or prices.
`sourceEvidenceForInput0550` returns bound canonical evidence plus readiness/gaps
and the review dependency key, rather than manufacturing an approved answer.

New commercial authorization is now `commercial-issue.v2` and requires A readiness
in addition to all existing Integration, customer scope, pricing, FX and findings
checks. The IndexedDB transaction recomputes this before accepting a new issue.
Old v1 issues remain immutable/readable and may be restored under their original
readiness policy. New authorization cannot be submitted as v1 to bypass A.
Both versions retain exact frozen customer rows and separate transmittals.

The source catalog version is pinned in sourceControl; future catalog revisions
must retain the old catalog reader and perform an explicit migration. Do not edit
this version's contents in place. Old backups without sourceControl remain valid
and unapproved for a new v2 authorization. New controls require this application
version; an older strict reader must use its existing raw-recovery path.

## Principles and validation

ADR-0550-001 **1–3, 5–6, 8–13**: usable source identity/locators, explicit scope
and missing input states, common records, version review, no repricing, stable
navigation and frozen history. Principle 14 remains in the existing SI CAL/RPT
controls; receipt/readiness does not certify engineering adequacy.

Model/SSR regression covers complete and missing synthetic inputs, all 78 numbered
entries, embedded sections, partial reading and checkbox bypass, exact version and
10006/10008 mismatch, duplicate candidates/copies, source-content staleness,
additional cross-references, future dates, strict field validation, read-only
financial preservation and canonical evidence lookup. Commercial issue tests also
cover mandatory A gating for v2 and preserved v1 restore policy.

Read-only check against the previously prepared private Rev07 intake: 675 source
records, 71/78 exact numbered matches, A_OPEN. No private corpus or actual Windows
workspace is bundled, written over or represented as complete. The user's actual
Drive Desktop sync and browser still require their normal pull/restart.

## Remaining project work

Resolve actual missing/mismatched inputs and duplicate/current-source decisions;
read remaining pages/drawings and update the controlled private intake; extend and
review the input denominator beyond MR and the procurement envelope. Then complete
SI 1–8, actual CAL/RPT, supplier/model/interface allocation, execution/deliverables,
commercial review and authorized customer issue. Per-page immutable artifacts,
sharded source transport, full transitive impact graph and richer shared
proof/activity cardinalities remain later architecture work. No 100% source or
engineering-completeness claim is made by this checkpoint.

## Verified final integration

- All **20 non-browser 0550 validators** passed after integration with `131c642f`,
  including the new A input contract, existing commercial issue/recovery controls
  and the concurrent Volume II model. No 0553 data or source files changed.
- Production webpack compilation passed on the integrated worktree, with the
  existing asset-size warning. The full unrelated-project build chain was not
  represented as rerun.
- **Four isolated browser suites passed:** A input readiness; commercial issue;
  workspace recovery; and Volume II Technical Proposal. These verify real
  IndexedDB saves/reloads, A binding/review/read-state transitions and canonical
  shared reading, B-to-A navigation, internal JSON download, native frozen XLSX,
  append-only history and old backup handling, preserved technical authoring and
  mobile containment with no page errors. No external submissions were sent.
- A's narrow viewport defect in existing file inputs was fixed with scoped
  source-area sizing. Expected-input tables scroll locally; inputs stay within
  the viewport. The A browser suite passed again against the final CSS.
- `git diff --check` passed. Actual Windows/browser data and Drive Desktop sync
  remain outside these isolated tests.
