# 0550 A — Received evidence to canonical B drafts

UI `2026-10-30.1-preview`, continuing the existing Official Working branch from
`730e0437`. This completes the source-preparation implementation below. It does
not declare the private RFQ corpus, engineering or a customer Release complete.

## Runtime changes

- Existing A `bid.documents.controlled-source-inventory` and B Working Preview
  search the same canonical source text. Results retain source ID/version,
  authority, actual text offsets and observed physical-page/native markers.
  Literal word/phrase search is discovery, not semantic applicability: AIS may
  also mean air-insulated switchgear; image/geometry-only requirements still need
  inspection. Metadata-only files cannot appear as read text.
- A current-source result can prepare an unstamped DRAFT in the existing
  `integrationWorkspace.requirements`. The user selects the applicable system.
  Source fingerprints and exact slices are rechecked when saving. Repeating a
  selection preserves the existing ID and edits. No quantity, price, supplier,
  cost owner, engineering acceptance or review is manufactured.
- Existing `bid.documents.si-work-package` accepts linked
  `genesis.0550.si-work-package.v2`: exact source batch/fingerprint, DRAFT
  sourceControl and Integration drafts, without duplicating the whole intake.
  v1 packages retain their original source-intake path. Wrong source bases,
  imported approvals/completed page attestations, unknown fields and foreign
  systems are rejected. Existing bindings, extra-input definitions, document
  reviews and authored requirements are preserved; conflicts are previewed.
  A differing existing extra-input definition cannot inherit its incoming binding.
  The workspace fingerprint is a change detector, not an approval signature;
  original-file SHA256 evidence is recorded separately in the private data.
- Optional `documentReviews.readingKind` supports SHEET, TEXT_BLOCK and
  ARCHIVE_MEMBER in addition to existing PDF coverage. Native counts derive from
  actual stored sheet markers, Word/message blocks or archive-member markers.
  Both A and B edit the same records. Old records without this optional field
  retain their existing policy/history; no automatic approval migration occurs.
  An older strict application should preserve unknown data through raw recovery.
- Offline `prepare-pj2608-0550-a-work-package.cjs` takes private intake, reading
  ledger and explicit receipt-map inputs. It prepares jobs and source-clause
  drafts only from contiguous passages present in current canonical sources.
  Page furniture is not silently removed to join an invented quote. Partial
  passages are labelled; unmatched findings stay visible in the report.

## Prepared private data — distributed separately, never bundled in Git

Rev08 contains 676 source records, preserving all earlier IDs, content, findings
and milestones, and adding the original customer ASK-TSI price form as evidence.
The original workbook is unchanged and is not a priced output. The official MSG
was re-fetched and all 22 substantive contract/invitation member identities
matched to the earlier recorded MD5 values; original SHA256 values and native
text were recorded. The two Word lock files remain inventory artifacts.

Sparse PDF pages received OCR discovery text: 53 unique pages / 75 physical
page copies, with 74 nonempty copies added. This is not drawing/visual acceptance.
Original copies were independently fetched to reconcile byte-identical receipt
aliases with explicit `replaces` lineage; IDs, original metadata and text remain
stored. Different revision numbers and 10006/10008 mismatches were not aliased.
LIS-0003 C3 is a current reference because current MR Appendix 2 explicitly names
that exact issue; its p3 title block was checked. Its older C2 comment sheet is
retained and does not approve any manufacturer/model or selected supplier.

The prepared linked package has 107 input obligations (85 baseline plus 22
explicit received official members), 100 passing receipt bindings, 249 reading
jobs and 140 source-clause drafts across all 19 system tokens plus COMMON.
69 drafts quote only a first contiguous passage and explicitly retain remaining
clause review as OPEN. These counts describe a clean preparation preview;
existing local user records/bindings are preserved and may yield other counts.
218 reference-code candidates are discovery work, not a certified denominator.

## Remaining actual project work

A remains **A_OPEN**, with zero imported completed reading attestations.
Seven exact inputs remain unmatched/mismatched: SPE-0006 B1; DTS-0005 B1;
ACP-TEL-BLD-0001 C3; 10008-STD-6-TEL-006 R00; 10008-STD-6-ICT-003/004/007 R00
(received reference numbers are 10006). Targeted Drive metadata search and the
available email response did not establish a current resolution. The three
TEL-018 R00 copies have identical unreadable bytes; R01 is readable, but its
applicability does not silently substitute the required R00. Proprietary RF model
inputs still require a compatible decoder/readable controlled report.

Complete full source/table/drawing/colour/appendix and cross-reference review,
then actual SI 1–8, CAL/RPT, supplier/interface allocation and commercial review.
New issue readiness still requires A and existing engineering/commercial gates.
Financial inputs, 0553 project code, frozen issues and transmittals are unchanged.
Actual user Windows/browser installation and Drive Desktop sync are not inferred
from isolated tests. Source intake remains within 16 MiB; sharding, immutable
per-page artifacts and the full dependency graph remain later architecture work.

## Principles and validation

ADR-0550-001 **1–3, 6–13** govern usable evidence, literal-versus-interpretation
separation, current copies, gaps, shared records, source/output navigation and
preserved history. Principles **5 and 14** bound this change: source preparation
does not add cost ownership or replace integrator engineering proof.

All 21 non-browser 0550 validators passed. Source-evidence/native-unit and linked
import tests cover exact/stale/forged evidence, literal search, current/history,
hidden sheets, typed coverage, DRAFT-only imports, conflicts/idempotency and
financial preservation. Four isolated browser suites passed: A inputs including
linked import and source-to-B creation; commercial issue; workspace recovery;
Volume II. Production webpack passed with its existing asset-size warning.
The separately recorded private-data browser validation verifies actual Rev08
and linked-package import, native customer-form coverage, B retrieval, persisted
drafts and preserved financial/history records. No customer issue was sent.
