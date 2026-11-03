# 0550 A input review: copyable existing-record addresses

Subsequent correction: [single-row local/global search, collapsed references and
actual receipt-versus-reading diagnosis](20261103_A_INPUT_FOCUS_AND_RECEIPT_COUNTS.md).
That checkpoint supersedes the filter-clearing behavior described below.

3-Nov-2026, Asia/Bangkok. Parent `b41f2d47`, existing branch/3050.
UI `2026-11-03.2-preview`.

## Request and result

The owner asked the assistant to inspect code/available JSON rather than ask for
screenshots of many input rows, and reported no Copy ID on the A expected-input
review. That view displayed existing `RFQ-*` IDs as text but had no copy controls
or row addresses in Project Module Search.

The same source module now exposes presentation child anchors:

- Panel: `bid.documents.controlled-source-inventory.inputs`.
- Existing record: `bid.documents.controlled-source-inventory.input.<inputId>`;
  e.g. `...input.RFQ-001` for the existing MR input.

Both use the shared project-qualified ComponentCopyId. Addresses use the saved
input ID, never row order/document title/revision. Extra RFQ inputs reuse their
existing IDs. Project Module Search indexes the panel/rows in area A; selecting a
row reveals the existing operating tools and clears readiness filters so the
addressed row is present. No data record/schema or architectural module is added.
The 15 architectural IDs, source inventory/source IDs and colour maps are intact.

## Reading the code versus the owner's saved data

`sourceReadiness0550.js` exposes expected inputs, exact/related candidates,
bindings, receiptProblems and contentProblems. `SourceReadiness0550.jsx` renders
those same records; this is the first place to investigate, not a request that
the owner click through every document. A code check explains the rules, but is
not a read of Windows IndexedDB. Use the actual available controlled intake and
preparation, preserving its version/basis; never substitute a historical/default
fixture and claim the owner's current row-specific results.

In the supplied screenshot the first MR is bound and labelled TEXT_PARTIAL /
READING_OPEN. The existing rule necessarily adds SOURCE_READING_OPEN when a bound
source is not TEXT_READ. DOCUMENT_REVIEW_OPEN is a separate check requiring the
actual shared reviewed-document result; do not infer that specific per-source
state solely from the aggregate zero. File availability, extracted pages,
clause completeness, reviewed mapping and issue authorization remain distinct.
No review or approval is created just to clear an OPEN counter.

## Change impact and checks

ADR §§6,8–12: disclose gaps, stable bidirectional navigation, canonical records,
source/review/frozen-history preservation, existing Copy ID and colours. Only
presentation metadata, search routing and current developer pointers change.
The row's source bindings, authority, revision, reading result, requirements,
quantities/prices/FX, existing release gates and frozen outputs do not change.

Focused readiness, source-render, MR-reader and controlled release-issue validators passed. Production webpack compiled successfully with the existing approximately3.22MiB chunk warning. The final context preflight and diff whitespace checks passed. The readiness test now checks every row Copy ID, unique addresses, canonical search destinations, extra-input stability, unchanged input bytes and the same15 architectural modules; existing missing/partial/revision/stale/frozen-output checks remain. Browser clipboard, filtered-row focus,
mobile visual layout and the owner's Windows saved workspace remain unverified
in this environment; do not claim the older blocked browser test ran here.
