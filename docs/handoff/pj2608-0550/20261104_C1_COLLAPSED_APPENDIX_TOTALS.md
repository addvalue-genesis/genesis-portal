# C1 collapsed Appendix totals — 4 Nov 2026

Parent `b27fac6820ec65617fc43cf0a0d11374c0596311`; owner supplied Windows fast-forward evidence to that commit and screenshots requesting each Appendix result while collapsed. UI `2026-11-04.2`, existing branch/Draft PR53, port3050. No customer issue or merge.

## Behaviour

A collapsed Appendix header retains the existing coloured +/− control and places its USD amount in the actual Total Price column. It sums canonical owner amounts once, never unit rates, MR references or component amounts. Complete priced groups show Subtotal. Incomplete groups show their known amount labelled Priced items subtotal; no priced owner stays an em dash, and an explicit zero remains0.00. Explicit coverage charged in another Appendix is referenced rather than allocated or charged again.

The existing internal trace has a summary disclosure with priced/open owner counts and MR quantity/coverage gaps. It does not treat known subtotal visibility as issue readiness. Expanding the group restores the existing native MR rows, component controls and strict subtotal/footer. Native Word/HTML/Print/XLSX and every frozen v1/v2/v3 renderer retain their existing output; this is an interactive overview change only. No persisted schema/input, record/Module ID, canonical price/quantity/FX/selection, saved user work or frozen history changes.

## Implementation and validation

Uses the existing `scheduleRollup0550` through a read-only `c1AppendixOverview0550` helper and existing `C1Appendix0550` view. No architectural module, financial owner or price allocation is created. Existing module/owner colour functions and MR display order remain governed.

- `npm run validate:pj0550-c1-appendix`: PASS complete/partial/no-price/explicit-zero summaries, pending owners included in completeness, one shared owner counted once, duplicate-owner holds, explicit cross-Appendix references without amount splitting, unchanged projection inputs and all existing179-MR/trace/duplicate/numbering tests. Fixed hashes confirm current native v3 C1 HTML/Word/table bytes match b27fac68; existing v1/v2 parity checks still pass.
- `npm run build:portal`: PASS production webpack; existing3.30MiB chunk-size warning remains.
- Actual C1 production browser: PASS collapsed8-Appendix plus Other summary cells, known Entertainment amount reconciled to expanded canonical price rows, horizontal alignment with Total Price header, partial label, strict grand total remains unresolved, expanded native rows, internal count disclosure, all +/−/colours/IDs/links, actual Word download,390px containment and zero page errors. IndexedDB records remain deep-equal after navigation/export/reload in the isolated synthetic workspace.
- Inspected the collapsed screenshot: values are aligned and legible; no debug/status codes or supplier costs appear in the customer article.
- `npm run context:pj0550 -- --check` and `git diff --check`: PASS. No0553 implementation/data or native/frozen formatter was changed; no unrelated full repository test chain was repeated.

## Remaining work

Source authority, MR/vendor coverage, engineering, AVL/deviations and project financial approvals remain governed by the existing gates. A priced-items subtotal is not a complete contractual amount. Windows delivery of this follow-up is not inferred from prior pull/screenshots.
