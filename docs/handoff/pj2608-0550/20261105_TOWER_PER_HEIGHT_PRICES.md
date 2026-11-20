# Per-height tower prices in the existing Working rows

5-Nov-2026, Asia/Bangkok. Parent7153fc10, existing Official Working branch,
Draft PR53, port3050. UI2026-11-05.2.

## Owner request and implementation

The owner asked that the existing APF60m and ACP30m MR rows show their own
quotation references, supply costs and selling prices, with the legacy aggregate
visibly a summary that does not double count. The preceding patch exposed source
rows and B/C links but left these two Working rows' price cells OPEN.

An internal read-only helper now reads original items2–5 of each separate supplier
quotation and uses the saved aggregate owner's E11/E12 and E13 policy. It displays
per-tower cost, ADDVALUE sell and customer sell THB in the two existing MR rows.
Each row names its quotation/items and opens the original PDF or existing Vendor
Item. The existing aggregate row is explicitly labelled a summary, with a single
financial contribution. Repeated native/candidate copies of the same THB number
are suppressed only for these three rows; the rest of Working is unchanged.

This is price detail inside the existing Working table, not a migration of
financial ownership: the two native records remain non-additive references and
the saved aggregate still contributes once. Header/status/editor notes explain
that distinction. No derived values are written into manualCost/sellRate, no
new Offer/Working/customer/module IDs exist, and the release/export projection
and existing frozen issues remain exact. B/C services/construction are unchanged.
Independent per-tower financial editing or exporting these as new financial
owners would require a separate explicit migration; this patch does not do that.

## Guards and principles

Only the provisional Working view receives this detail. Strict Official review
is not populated with unreviewed display money. Each MR must still be one native
Pc, explicitly included in the selected original one-Lot owner with no authored
per-row cost/sell/offer/calculation. Both quotations need four unique source items,
consistent source identity, native quantity/rate/total and unchanged active rates.
Original amounts must sum to the saved aggregate cost. Applying its actual saved
margin/markup and prime policy must reproduce its rounded cost/sell/customer THB
totals exactly. Unsupported DIRECT prices, partial/duplicate/deleted/changed
sources or owner/MR edits expose a reason instead of inventing an allocation or
rounding residual. No price is apportioned by tower height or arbitrary ratio.

ADR0550-001 principles2/3/5/6/8/9/10/11/12 apply: original facts and source links,
one financial owner, explicit gaps, unchanged canonical ownership and history,
and readable existing IDs/colours. Source/SI engineering acceptance stays DRAFT.

## Verification

- Independent synthetic prices with rounding plus missing/duplicate/edited source,
  native quantity/manual-zero/deselection, DIRECT and mismatched-total guards.
- Actual private fixture: source-derived prices for both native rows; exact
  reconciliation of cost/ADDVALUE/customer THB; only one selected financial owner;
  byte-identical canonical JSON, financial model and customer row projection.
- Existing price-summary/Full-Bid/release checks and controlled issue/frozen
  history checks passed. Production webpack passed with its existing chunk advisory.
- Production actual-data browser: both original MR rows show per-tower prices and
  source references, aggregate summary, strict Official separation, original
  source/owner navigation and disclosures, mobile containment, reload and exact
  IndexedDB preservation. No page errors. Continuity/whitespace checked at delivery.

Checks use an isolated profile, not the owner's Windows data. Pull/restart the
same branch; no private JSON replacement is required. Existing saved rates and
technical acceptance remain separate from this read-only price-detail view.
