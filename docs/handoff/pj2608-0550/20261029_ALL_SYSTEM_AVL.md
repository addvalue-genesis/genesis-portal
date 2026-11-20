# 0550 — All-system AVL reconciliation through canonical Working 1–8

29-Oct-2026 (Asia/Bangkok), UI `2026-10-29.8-preview`.
Base `d32de1a` on `feat/pj2608-0550-official-working-20261028`.
Preserves workspace load recovery, private SI draft ingestion, monetary controls and Deviation Release XLSX.

## Problem and result

The prior provider prepared only the explicitly selected INDUSTRONIC deviation.
It imported MGW offers but did not reconcile them across the system scopes or
expose why other systems had no deviation. Release showing one draft was not
proof that every other system complied. This change connects the existing
source, requirement, interface, proof, activity, Working and offer records to
one shared all-system AVL projection.

The same view appears inside existing WP.7, `bid.deviations.avl` and
`bid.deviations.release`; no architectural module IDs or editable stores are
added. It includes the 19 seeded systems, COMMON and any additional system scopes
from canonical requirements. Every system shows WP.1/4 requirements and linked
sources, WP.2 proof count, WP.3 interface basis, WP.5 Working count, WP.6 activity
count, WP.7 allocated/selected/proposed/alternative offers and WP.8 current gaps.
These counts describe recorded work, not engineering acceptance or full discovery
of every customer clause. Buttons navigate to the original requirement, offer,
source or deviation. Record navigation now opens its edit form in Working.

## Native facts and current findings

The bounded telecom manufacturer facts were checked in the actual Annex 2_1 PDF,
page 13 / printed 11 of 12, including a visual page check. Native SHA-256:
`a9ab36a654f10be48ad96b4001428ea690b7a5aa58e83bca63d9380afb79025d`.
They retain the existing source ID `ARC-c58c78bee91525a7d51265b1`; the private
source corpus is not bundled into application code. Categories cover PAGA,
Ex-Telephone, CCTV, IP Telephone, UHF/VHF repeater/base/trunking, fiber transmission,
fiber cable and fiber duct. This is a bounded manufacturer screening reference,
not a replacement for the full controlled AVL or all supplier-model qualifications.

On the carried-forward proposal catalogue:

- Selected PAGA INDUSTRONIC / A20261632 is outside the GAI-Tronics PAGA category;
  the existing user-editable draft and its stable IDs are preserved.
- MGW Q26-063 / ver1.0, page 22 item 5.0, proposes J&R Ex-Proof Telephone (IP Type),
  IP66. The Ex-Telephone category lists GAI-Tronics. One preparation draft is now
  recorded with requirement/AVL/offer/source references. This catalogue row is
  not selected in the seeded Working data, so it is explicitly proposal-stage;
  it is not reported as a confirmed final supplier choice or exported by default.
- Hikvision CCTV and AVAYA IP Telephone have listed manufacturer names; models,
  product applicability, origin and system adequacy still need review.
- BOSCH PAGA remains an alternative while INDUSTRONIC is chosen. CCTV media
  converters/switches/cabinets and DMR antenna cables are not falsely compared
  against the main camera/radio OEM category. Supplier labels MGW/local/domestic
  are unresolved OEMs, not automatically nonlisted manufacturers.
- MASTER TOWER and other systems without a matching category are explicitly
  unresolved for applicability; absence from this category set does not create a
  deviation or certify technical compliance. Shared and additional customer scope
  remain in the table even without a quote or category.

## Persistence, selection and source changes

After vendor/MR preparation, source load and canonical workspace saves, the provider
adds only missing preparation records for evidenced, nonlisted, non-alternative
manufacturer groups. Groups use system/category/manufacturer/quote; the ID is a
stable change-detector fingerprint, not an approval signature. Reopening or
reimporting does not duplicate records or replace user edits, previous decisions,
prices, quantities, FX, margin, cost ownership or historical output. Existing AVL
checks or related deviation records take precedence over generating another draft.
No supplier is selected and no price row is allocated by this preparation step.

New draft fields use the same validated Integration schema and Release fields.
They remain DRAFT/PENDING with no reviewer, review stamp or acceptance. Technical
justification is preparation text referencing the supplier offer; technical
compatibility and qualification attachments remain review work. The existing
integration review/approval gates still run and Release stays HOLD / NOT ISSUED.

The shared view checks the registered AVL's authority/replacement and, when marked
TEXT_READ, whether its text still contains the bounded category/manufacturer basis.
A conflict halts new automatic preparation and blocks generated-draft exports.
This is a conservative text/lineage consistency check, not file-byte authentication
or a parser for arbitrary new AVL revisions. Missing/partial content stays visible
as incomplete and never becomes an approved review.

Release initially selects only records passing its draft-content checks. All
records remain visible for selection/editing, including the unselected J&R draft.
Explicitly selecting an unallocated proposal blocks export until Working selection
is reconciled. Changes to an automated draft's OEM or quote reference also block
export until that draft is updated. Existing draft approval evidence rules remain.

## Principles, verification and limits

ADR-0550-001 principles **1–3, 5–6, 8–14** affected source/interpretation separation,
canonical bidirectional mapping, full-scope gap visibility, dependency changes,
preserved financial/history ownership and separation of screening from engineering
and customer approval. SI Equation Rev03 and its operating/import checkpoints
remain the process contract. This implements the AVL bridge; it does not declare
project-wide CAL/RPT, document reading or engineering verification complete.

Verified on this integrated base:

- New `validate:pj0550-avl-reconciliation` (included in the build chain): all seeded
  and additional scopes; canonical WP/source/offer links; correct INDUSTRONIC/J&R
  split; accessories/alternatives/category exclusion; proposal-stage export block;
  OEM/quote/source changes; user-check/edit preservation; idempotent records;
  unchanged non-Integration input bytes; actual React panel render.
- An optional QA content fixture checked the categories against actual native PDF
  page 13 text. It is not required or written by normal test runs.
- Existing Working Preview, selected INDUSTRONIC/Release regressions, SI work-package,
  SI monetary controls and Bidding validations passed. After integrating the
  concurrent workspace-recovery commit, AVL, Working/Release, SI package, recovery
  validation and production compilation passed again; final browser reload
  retained revision 11 and both manufacturer groups. Recovery tests now compare
  the running version metadata instead of pinning a previous version string.
  Production webpack passed
  with the existing bundle-size warning. No 0553 changes.
- Browser on the production build: automatic additive J&R draft, two manufacturer
  groups, original PAGA data, default export selection, block when J&R explicitly
  selected, edit-record navigation, A/source-register navigation and unchanged
  revision on repeated reload passed. The fixture has no private Drive intake;
  navigation to A was verified, not a successful read of a loaded private source.
- An additional source-file upload in QA was declined by the browser permission
  gate; it was not retried or bypassed. Native/source consistency is covered by
  read-only file inspection and the regression harness. This is not verification
  of the user's Windows data or Drive synchronization.

No final customer document was sent, issued, approved or merged. Native AVL copies,
new source revisions and unresolved product categories still require appropriate
source and engineering review; counts are not a compliance certificate.
