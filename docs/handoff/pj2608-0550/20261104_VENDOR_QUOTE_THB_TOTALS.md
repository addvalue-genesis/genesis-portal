# Original quotation totals in THB

4 November 2026, Asia/Bangkok. Parenta05a9fbf (concurrent C1 display preserved), existing Official Working branch,
Draft PR53, port3050. UI2026-11-04.14. Owner requested totals beside each collapsed
quotation, converted to THB regardless of original USD/EUR currency.

## Implementation and boundaries

Existing07.2 VendorOfferGroups shows each original quotation's base/net THB total
in its summary, with native amounts and saved project FX rate/source/date. THB
needs no conversion; USD/EUR use the current canonical fx record, including its
existing source/date/positive-rate requirements. No current market FX is fetched
or substituted. FX edits recalculate the display without changing source prices.

Options have a separate subtotal. Explicit unknown printed totals, including
Asactual, remain unknown even where a unit rate exists. A known subtotal is
labelled incomplete; missing FX is named rather than replaced with zero. Without
a printed total, known original quantity times original rate can be extended.
Native-source prices remain distinct from locally edited active offer prices.

One NET_PACKAGE owner takes precedence over its source components. The older PAGA
net has no supplierQuoteRow; its existing exact source locator `item NET` identifies
that original net summary. Multiple net identities produce OPEN. Included-reference
rows are non-additive. Source component rows take precedence over carried-forward
Working-rate references when no net exists. Separate combined Working-reference
groups have no fabricated quotation total.

Grouping retains full quotation entries by the existing vendor/reference/revision/
content identity. Every system view shows the same whole-quotation total, explicitly
labelled when wider than the visible system rows. Offer IDs are deduplicated.
No total across alternative quotations or system groups is created.

Decimal arithmetic uses precision40/half-up and rounds THB after source aggregation
and conversion. This read-only projection does not migrate the financial kernel.
Existing IDs, CopyID, family/owner colours, independent disclosures, terms, native
rows, edits/deletions, selected Working prices/quantities/FX, source/review records,
exports, Release gates and frozen history retain their existing ownership.

ADR0550-001 principles2,5,6,9–12 apply: source facts versus Working interpretation,
one net owner, explicit unknowns, revision identity, canonical projections,
preserved frozen outputs and readable existing controls. Full engineering scope,
commercial acceptance and customer issue remain separate work.

## Actual verification

- Extended existing Vendor logic/SSR tests pass: net versus components, legacy net
  locator, native versus edited rates, USD/EUR/THB, current FX edits, missing FX,
  source/date/rate requirements, Asactual, known partials, options, zero, duplicate
  IDs, ambiguous nets, full quotation across system views and exact input preservation.
- Both actual private PAGA quotation revisions reconcile their THB display against
  the original net owner at a synthetic QA FX. Separate option projections and
  read-only records pass. Private amounts/payloads are not committed or logged.
- Existing Vendor defaults/automatic loading, supplier revision and bidding
  validators pass, including financial/FX/frozen-history preservation controls.
- Production webpack passes with the existing asset-size warning. Extended existing
  Chromium test passes in an isolated profile: total visible while quote collapsed,
  THB/option headers, both hierarchies, controls/deep links, unchanged IndexedDB,
  reload and390px containment, zero page errors. This browser uses synthetic quotes.

Windows installation and the owner's saved workspace have not been observed.
Deliver through the existing branch; pull/restart the current3050 app to consume
the changed compiled UI. No private DATA rewrite or manual quote reimport is needed.
