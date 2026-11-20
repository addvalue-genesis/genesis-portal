# 0550 — Whole-corpus A → SI → Release/Source continuation

UI `2026-11-01.4-preview`, follows `ba72c8932658b672691cd88884f8bcfc0c9aa1c8`.
The user clarified that MR is the reading entry, while PHI/BOD/LIS/DTS/SPE,
BLD/DWG/LAY, prior project sets, PTTEP standards and clarifications all provide
requirements. A retains the evidence; menu B is the integrator; supplier evidence
is a separate role. Physical left/right placement does not determine ownership.

## Actual evidence checked

- Read the supplied PHI-0001 B1 (67 physical pages), LIS-0004 B1 (40), DTS-0001 B1
  (15) and SPE-0001 B1 (42) snapshots, with targeted native/text inspection.
  LIS-0004 is the **Telecommunication Interface Matrix**, not a datasheet.
- Listed all three user-designated Drive sets and their nested APF/ACP/ABV01
  folders: 143 unique files, 142 already represented by exact Drive IDs in Rev08.
  Do not rebuild these files or describe them all as missing.
- Retrieved the existing DATA Rev08 intake and linked A preparation: 676 sources,
  140 PHI/LIS source-clause drafts and 249 reading jobs. Many records contain real
  partial/full text; METADATA_ONLY is a different state. No review/approval is
  inferred from receipt, text availability or a CLOSED earlier comment.
- The extra observed TEL-018 R01 copy is inventoried as **UNCONFIRMED metadata**,
  retaining the existing R00/R01 records. No edition substitution, 10006/10008
  alias or automatic contractual precedence is introduced.

Original PDFs, source folder structure and permissions are unchanged. Private
intake/preparation JSON is stored separately in the existing project DATA folder;
it is never bundled into Git.

## Implemented reader and SI connections

A.1 keeps the native MR outline and now also reads any canonical project source.
The document filter/selector includes actual titles, numbers, revisions and
authority. A.3 and original source rows open that reader through stable source IDs.
PDFs use native physical pages and source-specific printed markers; Word/email or
unpaginated text uses exact character positions without inventing PDF pages.
Native file/preview links remain available for visual table/drawing/colour checks.

The real intake exposed a defect missed by the earlier synthetic fixtures:
markers can be `[PDF PAGE n; printed m]`, and a source can contain several
extraction passes. The shared parser now accepts annotated markers and separates
passes rather than treating all repetitions as missing/ambiguous pages. The
generic reader explicitly selects a pass. Multi-page locators such as
`PDF pages 37,38,39` resolve properly. Literal source search shares the marker fix.
Offsets and source fingerprints still validate exact contiguous evidence.

A.2 now shows the actual source excerpts, SI tasks/criteria and canonical links
for each system, plus separately labelled transitive reference context. References
and a shared system are not accepted applicability or a completed supplier mapping.
MR/PHI/SPE/DTS/Interface/standards complement each other; file family/revision label
alone never decides which document overrides another. Clarification/deviation and
the actual contract precedence must resolve conflicts.

The trace retains the existing requirement, proof, activity, equation, offer,
Working owner, Budget, 10.7, 11.M, Volume II and Deviation IDs. Source-based draft
preparation works during global A HOLD. It does not approve engineering, select a
supplier, allocate a cost owner or change a quantity/rate/FX/price. All new facts
remain distinct from SI proof and from actual FAT/SAT acceptance.

## Private Rev09 preparation

`prepare-pj2608-0550-source-corpus.cjs` is an explicit offline preparation tool,
not startup magic or a network crawler. It validates the original intake/package,
preserves all original IDs and the 140 authored/prepared source-clause records,
retains the original 249 reading jobs and creates the following **new derivative
project data**, without modifying an original PDF:

- `PJ2608-0550_Source_Intake_Rev09_20261101.json`: 677 sources; 15,935,518 bytes.
  Prior MR text is retained; native paginated snapshot extraction is appended to
  the already supplied MR source, enabling exact page access without deleting old
  evidence or invalidating earlier excerpt containment. The reading state remains
  partial and dependent reviews become stale normally.
- `PJ2608-0550_A_Work_Package_20261101.json`: 724 source-backed draft records,
  comprising the retained 140 plus **584 DTS/SPE technical text segments** with
  source locators and SI review tasks. All 19 existing systems plus COMMON remain
  represented. Segments preserve contiguous text and native page furniture; long
  sections are split without dropping text. The count is not a certified number
  of all mandatory project clauses, and does not certify visual table reading.
  File size: 4,467,722 bytes, including its exact predecessor preparation.

No document completeness, authority, disposition, proof outcome, personnel
quantity, rate, calculation, offer selection, work-line allocation or price is
approved by this ingestion. Responsibility/supplier adequacy and shared cost
ownership remain explicit SI decisions. The existing 264 MR catalogue entries are
separate; the clean model contains 988 requirement records, not 988 verified claims.

## Safe continuation and deletion preservation

The new private package uses `genesis.0550.si-work-package.v3`. Existing v1/v2
packages remain readable and valid. V3 embeds the exact v2 predecessor, validated
against retained current source content after normalizing only its old source-basis
reference for validation. The predecessor itself remains unchanged for its hash.

If the user's workspace already consumed that predecessor, the new import retains
edits and intentional deletions of predecessor requirements, reading jobs,
bindings, expected-input extras and technical records. A matching batch receipt
with a different predecessor fingerprint is rejected. A clean install receives
the complete baseline plus new drafts. Reopening an already consumed v3 package
does not refill deleted records. Existing legacy explicit-import audit adoption is
preserved. This is the controlled v2→v3 continuation; later predecessor/schema
changes need their own validation, not an implicit reinterpretation.

The existing paired DATA loader chooses the exact new source batch/package. No
manual JSON upload/download step is required on normal startup. Old application
versions reject v3 rather than silently reimporting deleted baseline records;
pull and restart the server before using the new DATA pair. Existing per-file
16 MiB and paired-response limits, source fingerprint checks and atomic saved
workspace update remain enforced.

## Principles and actual validation

ADR **1–6 and 8–14**: usable evidence and separate interpretation, many-to-many
trace, integrator tasks, no duplicated cost, visible real gaps, canonical ownership,
revision impact, frozen outputs, readable system-wide coverage and separate proof.

- New corpus model validator: annotated/printed pages, separate extraction passes,
  exact generic hits and search, multi-page locators, v1/v2 compatibility, v3
  continuation, preserved prior deletions vs clean baseline, tampered predecessor
  rejection, idempotency and unchanged financial/history inputs.
- Expanded isolated browser: generic PHI page/pass reading and exact DRAFT saves,
  existing MR/source/Release reverse navigation, all systems, contrast and mobile
  containment; no page errors or changes to financial/approval/frozen data.
- **Actual Rev09 JSON browser:** automatic startup without import/file selection;
  677 sources, 724 prepared records and 249 reading jobs; PHI, LIS, DTS, SPE and STD
  readers opened on real physical pages (including PHI/LIS printed-page mapping),
  desktop/mobile containment, unchanged workspace during reading, saved edits and
  deletions after reload, rejected wrong-basis update and unchanged financial/history
  fields. This uses an isolated browser, not the user's Windows browser.
- Existing source readiness/evidence/render/Drive/auto/work-package regressions,
  controlled issue, native/frozen outputs, Working schedules and bid-volume checks
  passed during implementation. Production webpack passed with its existing large
  chunk warning. No unrelated full 0553 test run or Windows installation is claimed.

The full source-clause denominator, visual drawing/table verification, derived
CAL/RPT sufficiency, exact supplier technical compliance, activity/resource
allocation and formal issue approvals still need engineering decisions. The
implemented counts and reading projections must not be reported as their closure.
