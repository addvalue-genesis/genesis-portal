# 0550 controlled source inventory — 27 October 2026

The existing `bid.documents.controlled-source-inventory` now accepts a private, reviewed GDrive/Gmail evidence package. The former table was bound only to the frozen source register and could not represent newer document revisions or distinguish forwarded email dates from original correspondence dates.

Base: `feat/pj2608-0550-bidding-workflow-20261026`, commit `2a0ebef`. Work continues in `feat/pj2608-0550-source-intake-20261027`; no merge, deployment or customer issue.

## What changed

- The exact inventory Module ID is preserved. Search, provider filters, source URLs, revisions, read state, authority, explicit replacement links and extracted source text are available in the same module.
- A private `sourceIntake` field extends the existing bidding workspace. Older backups without this field still load. Import previews the package and changes this field only; the existing revision-checked IndexedDB save and workspace backup retain it. No rates, FX, financial selections or historical records are imported by this route.
- Area C shows original correspondence date separately from forwarding date and a sourced deadline table. Historical-round deadlines remain distinct; an unknown timezone remains unknown. An elapsed date is a prompt to check submission evidence, not proof of a missed deadline.
- Source findings show system applicability, clause/page, downstream impact and SOURCE_SUPPORTED/OPEN/CONFLICT states. Risk also consumes these same findings. Source-supported means evidence of a requirement, never engineering acceptance or release approval.
- The prior facts and source register remain explicitly labelled historical reference. Fifteen architecture Module IDs, nineteen system tokens, controlled Rev10 and frozen customer export remain unchanged.

## Private data and use

The repository is public. Real document text, source IDs, correspondence and the project intake JSON are held outside git. The deliverable is `PJ2608-0550_Source_Intake_Rev00_20261027.json`, supplied privately in the task response. It is not included in the webpack bundle, commit or PR.

Open the 0550 route → A Original RFQ Documents, or search `PJ2608-0550 / bid.documents.controlled-source-inventory` in B. Choose **Import source intake**, review, then **Apply source intake**. Export the workspace backup after saving. Source import replaces only the current inventory package; prior workspace revisions are retained. The current package is a dated review snapshot, not live Drive/Gmail synchronization.

The initial intake contained 97 source records and 20 findings. The subsequent extracted-package recheck replaces the same private deliverable with batch `PJ2608-0550-SOURCE-INTAKE-REV01-20261027`: 156 sources (140 Drive / 16 Gmail), 33 findings and 8 milestones. Read states are 32 TEXT_READ, 29 TEXT_PARTIAL and 95 METADATA_ONLY. The latter two states deliberately retain incomplete clause/native-table review. The local filename remains stable for Library version continuity; use the batch ID to distinguish the updated content.

## Extracted-package revision recheck

- The inventory now includes a collapsible document-number comparison, grouped by document family. MR is expanded initially. Each row shows the explicit current-package source, issue purpose/date, cover revision history and earlier/replaced copies.
- Optional `packageName`, `issuePurpose`, and `revisionHistory` fields preserve compatibility with the initial intake schema and older backups. History rows require extracted document text, valid dates and unique revision labels. A cover history is not evidence of reading every earlier version.
- Current authority is never inferred from the largest revision letter or latest upload timestamp. Basic Engineering and EPC may reuse a document number with different revision conventions; older C-revisions must not displace an explicitly identified current B-revision. Multiple current revisions are surfaced as a conflict without choosing a winner. Same-revision copies remain visible, and explicit replacement links still control replaced-copy status.
- The private recheck covers 56 current technical document numbers: MR 1, PHI/LIS 5, SPE 14, DTS 13 and BLD/LAY 23. A same-revision replacement is retained separately. Three extracted locations agree by filename only; no byte-equivalence or exhaustive archive extraction is claimed. Earlier EPC and Basic Engineering copies were added for comparison, with recovered historical references and unresolved label inconsistencies kept distinct.
- Metadata listing, source-text extraction, selected review-comment reading, native table/drawing review, engineering acceptance and commercial release remain separate. Detailed engineering and current contract-archive comparison remain open. Real source contents and source URLs are private and are not committed.

## First issue versus Official package comparison

The latest private batch is `PJ2608-0550-SOURCE-INTAKE-REV02-20261027`, replacing the same private deliverable. It contains 334 sources (318 Drive/archive members and 16 Gmail), 33 findings, 8 milestones, 8 package groups and 15 comparison rows. Read states: 34 TEXT_READ, 43 TEXT_PARTIAL, 257 METADATA_ONLY. More registered physical copies does not mean more unique requirements or completed content reviews.

- The existing inventory now starts with a first-issue versus Official comparison table, including evidence links for each side. Optional `sourcePackages` and `packageComparisons` retain older-intake/backup compatibility. Package membership never changes source authority or financial values. Selected-text comparison requires read sources; inventory-only rows may cite metadata.
- Five user-specified folder trees were enumerated recursively. Private package groups retain their exact locations and every file ID, so the next review can return to the same roots without asking where they are. Stored first-issue files, intermediate updates, Official references and same-revision replacements are distinguished. Saved-folder counts are not a byte-verified original archive manifest.
- Two archives embedded in the supplied Official MSG were decoded, yielding 22 substantive members after excluding directories and Office lock files. Members link to their parent MSG and retain full member paths and checksums privately. The earlier note that these contract archives were not extracted is superseded. Selected DOCX sections have been compared; full native contract review remains open. Two older software ZIPs remain unopened and are explicitly labelled.
- The private table distinguishes changed revisions, earlier same-revision copies, later-phase documents and missing-in-package files. A missing item does not establish cancellation, and matching document number/revision does not establish byte equality.
- Keep the stable deliverable filename; inspect its batch ID for Rev02. After pulling code, import this latest private file at `bid.documents.controlled-source-inventory`; code changes alone do not populate the user's browser workspace. Launch from `frontend` with `npm start -- --port 3001`, then open `http://localhost:3001/projects/pj2608-0550`.

## Validation

Screenshot follow-up: a blank current inventory followed by an expanded historical register made the imported-data requirement easy to miss. The module now always shows its loaded batch/source/comparison count or missing-intake status. The comparison section remains visible when no comparison data is loaded, and the empty inventory has a file-picker button. Empty search results have a separate clear-filter action. Historical rows are explicitly labelled as the old register, not the latest review. This changes display guidance only; it does not auto-import private evidence or overwrite the user's workspace.

- `npm run build`: controlled snapshot, dataset, coverage, PAGA evidence, bidding and source-intake validators, production webpack.
- `node scripts/validate-pj2608-0550-source-intake.cjs [PRIVATE_JSON]`: strict IDs/references/project boundary, replacement DAG, safe URLs, read-state controls, unknown timezone preservation, backup compatibility, unchanged financial derivation.
- `node scripts/validate-pj2608-0550-source-render.cjs [PRIVATE_JSON]`: server rendering of the stable inventory, communications, deadlines and findings; unique rendered source IDs; escaped source content and safe links.
- Revision regression: current B vs historical C; multiple current revisions; missing current authority; same-revision copies; explicit replacement; malformed/duplicate history rows; old-package compatibility; escaped package/history fields and collapsed family tables. The updated private payload also passes the unchanged-financial-projection assertion.
- Package comparison regression: missing/duplicate source references, invalid package stage/URL, metadata-only text claims, inventory-only comparisons, old-intake compatibility, backup roundtrip, unchanged financial projection and server rendering of every comparison group. Production build and private Rev02 validation pass; browser interaction remains unverified in this environment.
- Browser regression was attempted. The default browser binary was missing; the available Chromium could not start because this execution environment denies its process-singleton socket. No browser PASS or visual verification is claimed for this change. Run the existing bidding browser regression in a browser-capable environment before acceptance.
- Webpack retains three size warnings. No performance improvement is claimed.

## Next work

Load the private intake in the user's existing workspace without replacing working prices. Review current source revisions and OPEN/CONFLICT findings against native documents, then close requirement → engineering calculation → installed TAG/MTO → unique cost ownership per system. PAGA remains the first detailed system. This import alone cannot close technical/commercial release gates.
