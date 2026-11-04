# Full tower quotation cost versus Part-A allocation

5-Nov-2026, Asia/Bangkok. Parent0982c1b1, existing Official Working branch,
Draft PR53, port3050. UI2026-11-05.3.

## Owner correction and resulting behaviour

The owner correctly distinguished the full fifteen-item supplier net quotation
from the four supply items displayed under Cost. Putting the legacy aggregate
in the same item table as the two native MR rows also looked like another
purchase. The preceding price-detail implementation did not make that commercial
distinction sufficiently clear.

Each existing MR row now leads with the exact original supplier NET_PACKAGE
amount before VAT. Its cost cell explicitly separates the quoted A equipment
(items2–5), B services/survey/delivery(items1,6–8,14–15) and C erection/civil/
earthing/fencing/site finishing(items9–13) portions. ADDVALUE and Customer sell
columns are explicitly Part A only: they are not selling prices for the full
supplier package. Original quotation/Item1–15 text and PDF/Item links remain.

The main table has only the two MR rows. The original aggregate owner retains
its exact ID, data and navigation but moves below the table to a collapsed
Part-A legacy-basis section. It is labelled an existing equipment subtotal,
not another purchase or the total of both full supplier quotations.

## Boundaries and guards

This correction is a read-only source/price projection, not financial adoption
of the full turnkey quotation into Part A. Original B/C cost owners and option
treatment are preserved, preventing the same fifteen items from being charged
again. No source, price/quantity/FX, selection, review, calculation, financial
fingerprint, customer output or frozen history is changed.

The full net must be unique, in THB, finite and from the same source hash as
the supply detail. Complete B/C item sets must reconcile with A to that net;
partial B/C sets stay unknown rather than becoming zero. Previous supply/MR/
owner guards and strict Official separation still apply. Source totals do not
establish accepted engineering or approval of the Part-C scope boundary.

ADR0550-001 principles2/3/5/6/8/9/10/11/12 apply: exact source fact, visible
allocation, single financial ownership, explicit unknowns, canonical views,
existing IDs/navigation and immutable history. No new architectural module/tab.

## Verification

- Independent synthetic guard checks and actual private data: full original
  net versus source supply allocation, native B/C portions and exact A+B+C
  reconciliation; per-tower Part-A selling totals remain exact.
- Existing price-summary/Full-Bid/release and controlled issue/frozen-history
  validators passed. Full canonical JSON/model/export rows are unchanged.
- Production webpack passed with the existing large-chunk advisory.
- Production browser verifies the full net prominently in each existing row,
  two item rows, collapsed legacy basis outside the table, original IDs and
  owner/source navigation, strict Official separation, mobile containment,
  reload and unchanged IndexedDB; no page errors. Continuity/whitespace checked.

Isolated-fixture checks do not establish Windows consumption. Pull/restart the
same branch; no private JSON replacement is needed.
