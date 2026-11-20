# 0550 performance — source checks and input updates

2-Nov-2026, Asia/Bangkok. Parent1c1f4c9f; UI2026-11-02.3-preview.

## Observed cause

The actual Rev11/Rev07 canonical workspace contains1708 derived requirements.
A CPU profile found repeated whitespace normalization of the same long sources
and rebuilding of the same revision register within one SI pass. Normalization
and its regular expression accounted for most sampled integration CPU time.
The default production Working page also had61260 DOM nodes in the isolated
browser fixture. Each editor/search keystroke previously reconciled the large
parent page even though only one input value changed.

## Change

- Integration evidence checks create one synchronous pass-local reader. Effective
  source authority, normalized content and revision status are reused within that
  invocation, including its proof checks. No source cache survives a call/save.
- Official line/customer-row evidence checks reuse the same sources and revision
  register within a single pricing derivation. Existing dates, authority, finding,
  copy, excerpt and review checks are still evaluated with unchanged output.
- The Working LineEditor now owns its draft input state. Parent state selects a
  different row/new draft; keystrokes no longer rerender Working/SI siblings. A
  parent ref retains unsaved input when Official/History temporarily unmounts the
  editor, preserving the prior behaviour without parent state updates per key.
- Module Search owns its query state. The same index, match ordering, exact ID/
  number selection, dirty-document protection and jump handler are retained.
- No data schema, module ID, price equation, rate, quantity, FX, supplier selection,
  A/B cost ownership, source receipt, permission or release gate is changed. The
  separate supply drafts and reverse B activity links from1c1f4c9f remain present.

## Evidence

Actual private Rev11/Rev07 input was compared to the functions from1c1f4c9f in
three alternating Node runs. SI median was8368.65ms before and678.79ms after.
All1708 requirements, sources, states and nested results produced the same
structure/content Merkle SHA256 in all runs:
`38bacf3cfccf5c97915489ecf5a5f990a3500a4296b8ed17f8e197316512dc26`.
The digest traverses all object keys/array members and primitive values; memoizing
identical subtree hashes avoids flattening the shared model into a >512MiB JSON
string. It is parity evidence, not an approval signature.

Official output digest also matched:
`aceb6319f2b331be383818542713b76d7690b077f8d1705a5f34f1b4064012e8`.
Known THB143636781.25 /USD4270646.27, all source/engineering gaps and HOLD remained.
Private source text/workspace files are not included in this commit.

In isolated production Chromium, a final sequential before/after run used five
warm native input events per field, timed inside the page through two animation
frames. This excludes Playwright locator/scroll/IPC overhead, which made earlier
automation wall-clock timings substantially larger. The final medians were:

| Input | Before ms | After ms |
|---|---:|---:|
| Working description | 198.40 | 25.10 |
| Separate package draft | 269.40 | 24.60 |
| Module Search | 275.90 | 30.90 |

These are test-environment processing measurements, not user Windows timings or
a full application startup promise. The browser fixture lacks private sources;
DOM size stayed61258 for the same final query. No records/checks were removed.

## Verification and boundaries

- New evidence-pass validator covers repeated clauses and whitespace, same-object
  source text/authority/current-copy/replacement changes, missing sources, stale
  reviewed dependencies and fresh standalone-proof/Official checks. This guards
  against the unsafe alternative of retaining source caches between saves.
- Existing bidding, activity-budget, controlled-release, bid-volume, SI-controls,
  source-readiness and separate-supply-draft validators passed.
- Existing isolated supply/B browser passed save/reload/delete, A↔B navigation,
  blank price defaults, inclusion diagnostics, unchanged inputs and summary/10.7
  subtotal, desktop/mobile containment and no runtime errors. The added regression
  also verifies unsaved package/B allocation inputs survive Official→History→
  Official without writing canonical data.
- Final production compilation passed in17.7s with the existing 3.2MiB asset-size
  warning. Final browser benchmark had no page errors; the editor/context/A↔B
  persistence regression passed on the final code.

Relevant ADR-0550-001 §§1–3,5–6,8–12: preserve evidence meaning and every readiness
check, canonical single ownership, data-change invalidation, stable navigation,
read-only projections and frozen outputs. Performance validation is not actual
engineering completion. Large source JSON transfers, ancestor validation, initial
DOM construction and PDF rendering remain separate costs; this patch does not
claim to eliminate all possible latency.
