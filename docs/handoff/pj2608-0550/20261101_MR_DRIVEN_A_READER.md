# PJ2608-0550 — MR-driven A, canonical draft continuation and row trace

UI `2026-11-01.3-preview`, based on `6a3eea13b27fe8ad85fdbabb757567a091091d68`.
The user authorized implementation and publication on the existing Official Working
branch. This changes the actual app, not only the conversation mockup.

## Reading basis and source boundaries

Inspected the supplied native `MM-ASK-1A-APF-TEL-MR-0001 Rev.B1.pdf`, SHA-256
`5199bb61c01db86f7c971117ad5e54b7d04e70061d6ad999b72f858122a0de5a`.
It has 54 physical pages: cover, prior-revision review comments and 52 numbered
pages. The new profile covers these pages once, with 24 outline sections including
front matter, Introduction, Appendix 1.0–1.8 and 2–14.

The source PDF/full extracted private text is **not** distributed in Git. The
profile contains navigation metadata and explicitly separated Thai reading notes.
Actual text, source IDs/revisions, receipt and reviews come from the user's existing
canonical intake loaded through the existing paired JSON/Drive workflow. A source
must be current with the exact MR number and B1 revision. Duplicate copies require
a view choice unless the existing RFQ-001 binding identifies one. Choosing a copy
for reading does not bind it or approve its authority/completeness. A B2 document
is not silently interpreted as the B1 profile.

Physical text positions use explicit `[PDF PAGE n]` markers. Missing/duplicate
markers do not cause guessed page assignments. The full available text and native
file remain accessible. The original 264-row MR catalogue is visible with its
existing IDs even when local private text is unavailable, labelled as catalogue
context, not approved current engineering. No quantity/unit/price is inferred.

## Human-facing A views inside existing modules

- **A.1 Read by MR:** original-order nested outline, common section headings,
  physical/printed page selector, exact native file/optional Drive preview, separate
  Thai interpretation, existing parent/component catalogue and source text blocks.
  Existing source-bound Particular interpretations/impacts and their explicitly
  linked requirement IDs are reused, not replaced with new empty records.
- **A.2 Read by system:** all existing systems, COMMON and additional canonical
  scopes; Particular sections, Common/interface context, document/test/service
  obligations and source/engineering/working traces. Context is not an automatic
  requirement-to-system allocation or a charge to every system.
- **A.3 References:** existing expected-input catalogue plus document-number
  references discovered in current canonical text. Traversal follows references
  transitively with a visited set. Incoming source/locator is retained; finding a
  citation is not receipt of that file. Number differences such as 10006/10008 are
  never aliased. Manual extra-input/binding/review remains in the original tools.
  Additional received source records are also visible. Alternate numbers/revisions
  are shown for investigation rather than reported as no source or auto-substituted.
- **A.4 Completeness:** separate expected/received/read counts, available native
  page text, canonical recorded/reviewed requirements and issue status. It never
  invents a clause denominator or converts page availability to clause completeness.

`l3.original`, `bid.documents.controlled-source-inventory`, the existing 15
architectural modules and all engineering/working IDs are retained. A.1–A.4 are
numbered subviews of the existing source module. Their IDs and all 54 page IDs are
searchable/copyable. Existing Module Search now works in A and C as well as B.
Old receipt/revision/read controls, search/import and source finding tools are
collapsed progressively and auto-open on source/finding/import navigation. No old
control is removed. The project reading view/page is retained in session storage,
separate from engineering/financial records.

## Interpreting the MR accurately

The notes draw attention to actual native distinctions rather than treating
Appendix 1.0 as only generic cost:

- §1.3(h) contains specific Cisco/Avaya/firewall/Motorola interface requirements.
- §1.3(i) includes foundation design/anchor-bolt information while excluding
  foundation construction; §1.3(j) ACS is optional.
- §2.0(h) FCA must be reconciled with tender/contract terms; no saved Incoterm is changed.
- §2.0(q) minimum 90-day support does not specify automatic 90 on-site days or crew.
- §2.2 splits COMPANY/EPC01/TSI scope for VSAT/DTRS/AIS and contains FOC installation
  responsibility wording that needs reconciliation, not a guessed owner.
- Radio/CCTV/PAGA/Microwave/NDB FEED quantities require the specified engineering
  reports and downstream equipment checks. No automatic quantity/MH rewrite occurs.
- The Introduction calls FOC/Cables Appendix 1.8, but the actual printed headers on
  physical pages 29–30 say Appendix 1.6 Entertainment. Both facts are visible.
- SDRL stages/blank With Bid entries remain distinct from missing customer files;
  ITR marks are not fabricated completed tests. Manuals/storage instructions are
  not automatically future field-maintenance/one-year warehouse service charges.
- Prior A2 comments marked CLOSED are not treated as B1 engineering acceptance.

These notes are reading guidance, not newly resolved clarifications, accepted
deviations or source-review stamps. Existing source contradictions still require
the appropriate source/engineering decision.

## Work continuation and Source → Release → Source

Global A issue readiness and local draft usability are deliberately separate in
the UI. A CURRENT source with actual partial/full text can be read and used to
prepare a clause while other RFQ inputs remain unreceived/unreviewed. The explicit
button takes an exact source substring, source fingerprint, physical page/offset
and selected applicable system to the **existing** canonical requirement schema.
It creates an unstamped DRAFT through the same source-evidence validation as the
existing search workflow. It does not modify a source, price, reading approval,
engineering approval or allocation. Exact repeat/current authored records are
reused; stale/forged or non-current evidence is rejected before persistence.

The trace projects existing requirement IDs, CAL/RPT, activities, calculations,
supplier offers (including existing MGW grouped offers), Working owners, Budget,
10.7 Release Preview, 11.M, Volume II, Deviation and frozen issue membership.
Links open actual existing destinations; source links open the original register
and can return to the MR reader. Merely sharing a system does not fabricate a
line-level dependency. Catalogue associations remain labelled as such. An absent
link is shown as an allocation task, not converted into absent scope/zero cost.

No change to `deriveSourceReadiness0550` approval semantics, integration review,
Official authorization, persisted workspace schema or frozen renderer is made.
New formal issues retain all existing readiness checks. A source/requirement change
still invalidates affected existing reviews under their existing fingerprints.
This change does not claim a complete universal engineering dependency graph.

## Principles and verification

ADR-0550-001 **1–6 and 8–14** apply: usable sources, fact/interpretation separation,
row-level trace, visible real gaps, single cost ownership, canonical records,
revision impact, frozen history and readable, project-wide source navigation.

Validation completed during implementation:

- New model/SSR validator: all 54 native pages/24 sections, exact current-copy
  selection, physical offsets and partial text, idempotent canonical DRAFTs while
  global A is unready, existing Particular-to-requirement links, stale/forged input
  rejection, reference cycles and 10006/10008 separation, read-only projection.
- New isolated browser: all 19 systems + COMMON, actual Source→Release→Source row
  navigation, exact source preparation, restart/idempotency, no changed prices,
  calculations, reading approvals or frozen issues; desktop/tablet/mobile containment
  and selected-control contrast, collapsed mobile outline, no page errors.
- Existing model regressions passed: source readiness, source evidence, automatic
  source workspace, controlled commercial issue/frozen XLSX, Working schedules,
  live technical dossier, native Exhibit C/frozen Word, bid volumes, workspace
  recovery, SI controls, source server render, Working 1–8 and bidding/equations.
- Existing isolated browser suites passed: A binding/reading/preparation, automatic
  paired JSON startup/user edits and Working→Schedules with native Word export.
- Native MR text (all 54 physical pages) was also rendered through the actual app
  with an isolated synthetic commercial fixture for desktop/mobile visual QA. This
  was not a read or migration of the user's Windows workspace.
- Production webpack passed with the existing large-chunk warning (3.11 MiB).
  `git diff --check` passed. The unrelated full 0553 build/test chain is not claimed
  as rerun; no 0553 source, price or project data is changed.

Actual Windows Drive synchronization, private project-wide clause completeness and
engineering approval must not be inferred from these automated fixtures. Source
text extraction still requires visual table/colour/drawing checks. Complete
applicability, CAL/RPT adequacy and all transitive engineering impact relationships
remain engineering work, distinct from the implemented reference traversal and links.
