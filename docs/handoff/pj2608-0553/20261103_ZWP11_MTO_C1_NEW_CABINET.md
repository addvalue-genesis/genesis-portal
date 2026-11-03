# ZWP11 — MTO C1 new enclosure decision, 3 November 2026

MTO MM-ZTK-1F-GEN-TEL-MTO-0001 Rev.C1, dated 29 October 2026,
printed page 7 item A-1, requires one ZWP11 Telecom Enclosure:
SS316L, Ex eb, IP66, 600 × 210 × 400 mm, with certified terminals
and accessories. The project owner confirms this latest MTO as the working
supply basis, superseding the earlier BOD reuse treatment for this item.

The existing Rev03 working overlay now counts one new TCAB-500-003 at
ZWP11 source row 51. It uses the existing PROSPER-24051 historical reference
unit cost, THB 39,200. No new unit rate, FX or margin is introduced.
The immutable source ledger retains the former zero-procurement/zero-cost
reuse decision and its provenance. The current working row records the
superseding owner decision; no second physical item or cost owner is added.

| Result | Before | After |
| --- | ---: | ---: |
| ZWP11 new enclosure procurement | 0 | 1 Set |
| Counted cabinet cost, THB | 0 | 39,200 |
| Cabinet working sell, THB | 0 | 50,960 |
| Cabinet quoted price, USD | 0 | 1,620 |
| A1 quoted price, USD | 241,290 | 242,910 |
| A+B quoted total, USD | 894,910 | 896,530 |

All other 140 quoted equipment leaf prices, Part B, optional Part C,
quantities and pricing policies remain unchanged. Current OEM quotation
and technical verification remain open. No customer proposal is issued
by this change; remaining MTO scope/cost gaps are not resolved by this item.

## Validation

`node frontend/scripts/validate-0553-zwp11-mto-c1-new-cabinet.cjs`

Runs the actual source, working overlay, aggregation, Release model, USD
rounding and customer breakdown. Checks a single posting owner, protected
source immutability, historical rate reuse, exact +USD 1,620 impact,
parent/child reconciliation, and unchanged B/C and all other leaf prices.
The preservation fixture was generated from the actual baseline runtime
at commit 41208a9cc98c49738073410624bb0b36c44a8090 before the change.

The financial model and targeted validator were executed successfully.
The existing Rev03 cost-reconciliation validator also passed, including
seven-location totals, immutable sources, the A5 non-additive check and
negative fixtures; it used the runtime bundled Babel transformer.
No full application build or browser test was run in this session.
