# PJ2608-0550 — live technical dossier, native SDRL and package AVL follow-through

Date: 1-Nov-2026 (Asia/Bangkok). UI `2026-11-01.1-preview`.
Base: `feddbbece772c6cabf51e52eb87276ab387e8d82`.
Branch: `feat/pj2608-0550-official-working-20261028`; existing 3050 origin.

## Completed software behavior

- **11.M ↔ 12.3:** each Working row opens its actual technical system; each
  equipment row returns to that row's Schedule allocation. Search/Copy references
  `bid.quotation.line.<WorkingID>` and `bid.technical.<section>.system.<token>`
  extend the existing modules, retaining all 15 architectural identities.
- **12.1–12.5:** the primary view is a readable document made from canonical
  customer requirements, SI proof/activity records, supplier technical descriptions,
  equipment quantities/physical evidence and deviations. Authored SI responses
  remain distinct from those facts. An expandable editor retains reference links,
  review controls and dirty navigation protection. Source/requirement/proof/offer/
  deviation buttons open the original records; no second editable BOM is created.
- **12.P:** the displayed document and downloaded HTML are identical. Open the
  HTML to print to PDF. Numeric cost/sell/FX fields are not selected. MGW's internal
  `sourceRef` contains quoted costs, so it is deliberately replaced by its native
  catalogue page/section/item locator in this technical projection. Explicitly
  authored technical narrative still requires human review before submission.
- **12.0:** an explicit preparation button creates only missing technical slots
  and missing system-level Invitation document plans, as unstamped DRAFTs. It
  preserves existing IDs/text, document metadata, physical details, VDRL decisions,
  financial inputs, sources and history. Opening pages never seeds records. An
  explicit later click may recreate deleted missing slots; there is no startup
  recreation or overwrite. Generated paragraphs identify preparation gaps and
  are not project engineering conclusions or completed supplier documents.
- **12.V:** searchable native Appendix 3 reference with **131 unique SDRL codes**,
  original titles/review/submission marks, red-text flags and PDF/printed pages.
  Preparing one native row opens an unsaved draft, preserves original relative
  timing in its basis, and leaves actual document number/date/owner/attachment
  OPEN. POST_AWARD is a preparation suggestion subject to applicability review.
- **13.0 and 13.1–13.11:** BIDDER qualification evidence checklist, scope/ownership
  guidance, current responses and explicit gaps; readable response/evidence before
  its expandable editor. Supplier evidence is not asserted to certify SAMTEL.
- **14 / AVL:** active MGW package component offers are checked as selected
  supplier references. Covered rows and COMPANY supply are excluded from active
  cost-owner selection. Changing OEM/quotation cannot reuse the old manufacturer's
  deviation merely because the Offer ID is unchanged; a distinct current DRAFT is
  prepared while old requests/decisions remain intact. The Deviation export scope
  check recognizes package components. This does not grant customer acceptance.
- Volume II review fingerprints include referenced MGW package offers, so package
  supplier changes invalidate prior technical reviews. Existing direct-offer,
  source/requirement and commercial review gates continue to run.

## Native evidence and limits

Reference: `MM-ASK-1A-APF-TEL-MR-0001 Rev.B1`,
[received PDF](https://drive.google.com/file/d/1KFCSSo3D50fAS6LUBz0IYKPG4NjGVcDS/view),
Appendix 3 physical PDF pages **39–42**, printed pages **37–40 of 52**.
SHA-256 `5199bb61c01db86f7c971117ad5e54b7d04e70061d6ad999b72f858122a0de5a`.
All four source table pages were rendered and visually checked.
`prepare-sdrl-reference-0550.py` reproduces the catalogue only from those exact
bytes; this hash check is not an authority selection for the live workspace.

**Every With Bid cell in this B1 table is unmarked.** No B marks are invented.
Invitation §4 Volume II 3(1)–(5) supplies the separate BID-plan basis. SDRL is a
plan/crosswalk, not proof that those five technical responses are complete.
Relative P+/D−/T±/W dates are retained rather than converted without their event
baseline. Native review code D appears in some rows and remains uninterpreted
pending clarification. Newer/selected customer evidence must still be reconciled
in A; the reference table does not replace it.

Original Exhibit C Word/HTML/print and the prior Working/MGW Schedule previews
remain in use. The old `technicalDraftHtml0550` frozen-issue renderer is retained;
this change adds a current Working dossier renderer rather than rewriting issued
Volume II bytes. Internal Volume I/II disagreements stay correction tasks;
a contractual exception requires its separate controlled Deviation record.

## Governing principles and actual verification

ADR-0550-001 **1–6 and 8–14** affected this change: source interpretation/authority,
project-wide scope, bidirectional references, single cost ownership, explicit gaps,
revision review, canonical records, frozen history and visible module purpose.

Passed targeted checks:

- New `validate:pj0550-live-dossier`: 19 systems + COMMON, native 131-code reference,
  unmarked With Bid, explicit idempotent DRAFT preparation/user preservation,
  package OEM amendments, package selection in Deviation export, source-stale review,
  escaped HTML, no automatic supplier-cost leakage and unchanged financial/source/
  history records.
- Existing Volume II, all-system AVL, three-volume readiness/frozen package, native
  Exhibit C/exact frozen Word, Working Schedule, commercial issue, workspace recovery,
  Working 1–8, SI work-package and automatic source-workspace loading checks.
- Production webpack; one existing asset-size warning (~3.02 MiB 0550 bundle).
- Isolated browser: native SDRL search/prefill without writes, 100-slot preparation
  preserving authored text, 11 qualification rows, per-row Volume I–II navigation,
  dirty guards, actual HTML download equal to screen, persistence/mobile containment,
  actual Working CCTV 28-row/native Word preview, v3 issue/frozen download/old-backup
  restoration and unchanged financial/history records. No page errors.
- Native reference reproduction from hash-checked PDF and `git diff --check`.

These use repository data and synthetic review/commercial fixtures. They do not
inspect or alter the user's Windows browser database. Actual source reading,
CAL/RPT conclusions, missing weights/dimensions, delivery commitments, company
qualification evidence and purchaser acceptance remain accountable project work;
blank inputs stay OPEN and release authorization is not inferred. Full monorepo
`npm run build` was not repeated; targeted 0550 suites and production compilation
were run. No unrelated 0553 project facts, dependency updates, customer messages,
merge or formal customer issue are included.

## Windows update

In the existing `genesis-portal-0550-review` checkout on the branch above, stop
that 0550 server with Ctrl+C. Run `git pull --ff-only origin
feat/pj2608-0550-official-working-20261028`, then `cd frontend` and `npm start`.
Open `http://localhost:3050/projects/pj2608-0550` and check UI
`2026-11-01.1-preview`. No new dependency installation or saved-data clearing is
needed. Windows installation remains unverified until its pull/start output is seen.
