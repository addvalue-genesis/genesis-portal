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

This intake contains 97 source records: 16 Gmail messages and 81 Drive entries. Text was extracted for 32 sources, one drawing has partial text only, and 64 remain metadata-only. There are 20 sourced findings and 8 milestones. Metadata listing, source-text extraction, native table/drawing review, engineering acceptance and commercial release are distinct. Outstanding detailed engineering and current contract-archive comparison are recorded in the private findings; do not promote them to closed.

## Validation

- `npm run build`: controlled snapshot, dataset, coverage, PAGA evidence, bidding and source-intake validators, production webpack.
- `node scripts/validate-pj2608-0550-source-intake.cjs [PRIVATE_JSON]`: strict IDs/references/project boundary, replacement DAG, safe URLs, read-state controls, unknown timezone preservation, backup compatibility, unchanged financial derivation.
- `node scripts/validate-pj2608-0550-source-render.cjs [PRIVATE_JSON]`: server rendering of the stable inventory, communications, deadlines and findings; unique rendered source IDs; escaped source content and safe links.
- Browser regression was attempted. The default browser binary was missing; the available Chromium could not start because this execution environment denies its process-singleton socket. No browser PASS or visual verification is claimed for this change. Run the existing bidding browser regression in a browser-capable environment before acceptance.
- Webpack retains three size warnings. No performance improvement is claimed.

## Next work

Load the private intake in the user's existing workspace without replacing working prices. Review current source revisions and OPEN/CONFLICT findings against native documents, then close requirement → engineering calculation → installed TAG/MTO → unique cost ownership per system. PAGA remains the first detailed system. This import alone cannot close technical/commercial release gates.
