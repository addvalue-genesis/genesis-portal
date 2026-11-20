# 0550 A: focus one input and distinguish receipt from reading

3-Nov-2026. Parent `a58fff2a`; UI `2026-11-03.3-preview`.

## Problem and implemented behavior

The owner's local A search contained a copied full input address, which the old
text filter did not recognize. It produced an empty input table above a long
expanded reference/revision register and SI findings. Those sections are evidence
and historical context, not an instruction to manually complete every visible row.

The existing local filter now accepts raw RFQ IDs, full child addresses and
`PJ2608-0550 / <address>`. An exact input ID shows that input alone, including
when selected in global Module Search. The panel address shows all inputs;
unmatched filters offer a clear button. Existing source-open actions still open
all ancestor details, clear source filters and reveal the requested source.

Reference/comparison/revision/history tables start inside a collapsed wrapper.
SI findings have independent expansion state: opening the A input tools does not
expand them. Source/SI/finding navigation remains available. Nested toggle events
do not update the enclosing tools state. This is presentation state, not a new
module, source schema, stored preference or lazy-render performance claim.

A.4 now shows receipt-passed inputs and receipt-open inputs separately from exact
number/revision candidate matches and reviewed content. All counters use the
existing canonical readiness model; no acceptance rule changes.

## Actual available-data investigation

Read the controlled source Rev11 and preparation Rev07, using the existing paired
loader and canonical repository/AVL preparation. Rev11 SHA256 is
`538d3aa6f585a63331ba4f87949baf0765471c51a13c5140f2e9386610e4bc8f`,
matching the earlier native-audit checkpoint. No private JSON is committed.

The reconstruction has 678 sources, 1,708 derived requirements and 1,444 authored
requirements, matching the supplied screenshot totals. Of 107 expected inputs,
100 pass receipt, 7 have receipt problems, and 0 pass full reading. There are 95
unique current bound-document review gaps. The 73 exact candidate matches are a
different measure: the remaining 34 are not 34 proven missing documents, because
attachment/embedded bindings may satisfy receipt without that candidate match.
This is a controlled-data reconstruction, not a read or modification of Windows
IndexedDB or proof of installation on the owner's computer.

| Existing input | Expected reference | Receipt problem |
| --- | --- | --- |
| RFQ-012 | APF-TEL-SPE-0006 B1 | Number/revision mismatch |
| RFQ-026 | APF-TEL-DTS-0005 B1 | Number/revision mismatch |
| RFQ-044 | ACP-TEL-BLD-0001 C3 | No matched input |
| RFQ-063 | 10008-STD-6-TEL-006 R00 | No matched input |
| RFQ-070 | 10008-STD-6-ICT-003 R00 | Number/revision mismatch |
| RFQ-071 | 10008-STD-6-ICT-004 R00 | Number/revision mismatch |
| RFQ-072 | 10008-STD-6-ICT-007 R00 | Number/revision mismatch |

The owner's received-document basis already governs these gaps. Do not request
the same missing editions again, alias 10006 into 10008 or grant acceptance from
a folder/name match. Preserve existing proposed qualifications/deviations.

MR RFQ-001 has **no receipt problems**. Its bound current source is TEXT_PARTIAL;
the shared document review is DRAFT/OPEN with full-source, pages and
notes/colour/appendices review outstanding. A stale binding locator says copy
reconciliation remains OPEN; it is historical prose, not the current receipt
result. Do not rebind to a replaced TEXT_READ copy or stamp review to clear the
counter. This investigation did not semantically/visually review all 54 MR pages
and does not complete whole-project SI engineering.

## Contracts, validation and limits

ADR principles 6 and 8–12 apply: disclose the actual gap, keep source navigation,
canonical records, version/review/history boundaries, stable IDs and colours.
The 15 architectural modules, financial inputs/quantity/FX, source authority,
release authorization, saved edits/deletions and frozen outputs are unchanged.

Source-readiness, source-render, MR-reader and release-issue validators passed.
Tests cover copied-ID normalization, exact-row filtering and SSR navigation,
empty results, unchanged input bytes, independent collapsed references/SI, and
distinct 73/100/107/7/0 receipt/content counters. Existing stale/evidence/frozen
output checks remain. Production webpack passed with its existing approximately
3.22 MiB chunk-size warning. Context preflight/check and diff whitespace passed.

Browser clipboard, native details interaction, focus/scroll, mobile appearance
and Windows installation remain unverified; the browser host cannot connect to
the local server in this environment. Software checks are not engineering or
customer-issue approval. Continue native/semantic reading with the available
documents, then customer-to-supplier/Working coverage; do not make the owner
enumerate screenshots of every row.
