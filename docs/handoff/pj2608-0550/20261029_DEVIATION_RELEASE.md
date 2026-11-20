# PJ2608-0550 — Deviation Release preview and Excel export

29-Oct-2026 (Asia/Bangkok), UI `2026-10-29.5-preview`.
Base `56ba1f060b38fe54ba6c72ff137d0e2e9b5d70b5` on
`feat/pj2608-0550-official-working-20261028`; preserves the selected INDUSTRONIC
work and the concurrent SI/decimal/display controls.

## Result

`bid.deviations` has AVL / Working and Release tabs. New module
`bid.deviations.release` is explicitly requested by the user; existing IDs stay
unchanged. Search/Copy ID can reach Release. Users select saved deviations,
edit and save the five document-header fields, preview the English form and
click **Export Excel — Deviation List**. Output is genuine `.xlsx`, named
`PJ2608-0550_Deviation_List_DRAFT_R{revision}.xlsx`, not a renamed legacy `.xls`.
Selection survives moving between Working and Release within the workspace;
it is not a stored submission decision. An empty selection cannot export NONE.

The attachment `5-Deviation List.xls` is a native XLS (snapshot filename had a
misleading `.csv` suffix), SHA-256:
`1f55f7e0e7e63dc51b4ac4ed659d4ba7e105fc86201120ee638d5c8b3f3b525d`.
It was read without modification. The original ZM169 / Zawtika header is replaced
with editable ASK/PJ2608-0550 defaults; no 0553 project content is imported.

The single sheet **Deviation List** retains the source's eleven columns:
No.; Page No / Clause/Section; PURCHASER's Specification Requirement;
BIDDER's Clarification; BIDDER's Deviation; BIDDER's Proposal / Notification;
BIDDER's Technical Justification or Reason for Deviation; PURCHASER's Reply;
COMPANY's Reply; Status (Open / Closed); Remarks. It retains metadata/title/note,
document sections (1.0, 2.0) and item numbering (1.1, 2.1), original column widths,
wrapped bordered cells and A4 landscape fit-to-width printing. Arial replaces
source font 宋体 for portability. Repeating header rows and a draft footer are added.
The generic template is authored with Artifact Tool; runtime fills its OOXML.
The private native attachment itself is not copied into the repository.

## Canonical data and boundaries

Preview and XLSX consume the same pure `deriveDeviationRelease0550` projection
from saved integration deviations, requirements and selected Working offers.
Edits return to the original deviation, not a second editable release list.
Seven optional text fields on those same deviations support the new form:
`releaseDocument`, `releasePageRef`, `purchaserRequirement`, `bidderClarification`,
`bidderProposal`, `purchaserReply`, `releaseRemarks`. Optional root
`deviationRelease` stores only the five header fields. Old backups remain valid;
new optional fields are validated on load/save/import. Schema IDs are unchanged.

The seeded INDUSTRONIC / INTRON-X request defaults to the verified PAGA AVL
reference and Offer A20261632. Missing values on other records must be supplied.
Internal CONTRACTOR/VENDOR response notes are not copied into PURCHASER's Reply;
that explicit field starts blank. COMPANY reply uses the existing company-response
field. Remarks combines explicit release remarks, resolution and final closure.
Pending requests export **Open** (the customer's response status); this does not
mean that the already established manufacturer mismatch has not been analyzed.
**Closed** requires the existing derived `ACCEPTED_DEVIATION` evidence/review state,
not just a manually selected APPROVED label.

Export is blocked for missing document/reference/requirement/deviation/justification,
broken requirement/offer links, offers no longer selected for that system, empty
selection, unsupported XML controls or detail rows too tall for Excel. Unsaved
header changes also block export. These are draft-content checks, not an assertion
that every project source or technical attachment has been reviewed.

All files say **DRAFT / NOT ISSUED**. Export does not submit, send, approve or
change workflow status. Controlled issue snapshots, authorization and transmittal
are still outside this implementation. Existing approval gates and Release HOLD
remain. Quantities, rates, FX, margin, cost ownership and historical XLSX outputs
are unchanged. No additional automatic deviation is created for MASTER TOWER.

## Principles and verification

ADR-0550-001 principles **1–3, 5–6, 8–12, 13–14** informed source fidelity,
source/interpretation separation, shared mappings/projection, visible gaps,
current Working selection, preserved history and explicit draft/approval separation.
This implements export of recorded deviations, not project-wide engineering or a
claim that all systems have been assessed. SI Equation Rev03 §8 and its operating
checkpoint distinguish draft preview/export from authorized issue.

Validated on the integrated base:

- SI controls, 0550 Working Preview and 0550 Bidding regressions passed.
- Release regression checks eleven columns, numbering/grouping, header metadata,
  print settings, XML escaping/no formulas, old/new backup fields, missing/stale
  selection gates, internal-response isolation, unchanged input bytes, pending
  acceptance and actual React render.
- Production webpack passed (existing bundle-size warning).
- Actual populated export imported/rendered using Artifact Tool; independently
  parsed every XML part and checked cell values, string numbering, A4/landscape,
  print area and repeated headers using read-only verification.
- Browser: tab navigation, missing-record export block, selection, unsaved header
  block/save, source edit and shared preview, selection retained across tabs,
  Module-ID navigation, export-button generation and saved-data reload. No page errors.
  The browser automation download event timed out, so completed Chrome download
  delivery was not independently confirmed. File contents/format were verified
  from the same production generator in the regression harness, not from a
  captured browser download.
  Browser workspace is isolated QA data, not the user's Windows workspace.

Use `PJ0550_DEVIATION_QA_OUTPUT=/absolute/path.xlsx` with the Working validation
only when a scratch QA workbook is needed. No QA workbook is written by default.
Users pulling this branch should run `npm ci` because the preserved SI commit adds
`decimal.js`; then `npm start -- --port 3001`.
