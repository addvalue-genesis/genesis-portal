# PJ2608-0553 — 10.3.4 Official Release / English / USD

Owner requested a separate customer-only view derived from
`bid.budget.pricing.release.preview`, USD prices, simple hundred-dollar summary
amounts, and direct Excel generation from the original Scope of Supply template.

## Commercial presentation
- Module: `bid.budget.pricing.official`, navigation 10.3.4.
- Input: the exact releaseModel instance used by 10.3.3. No independent budget,
  source-price changes, database migration or Manual Input system.
- Quotation policy: 31.5 THB/USD, explicitly a fixed proposal assumption rather
  than a current bank quote. Each priced A1–A4/B1–B14/C1–C2 summary line rounds
  UP to the next USD100; exact multiples and zero are unchanged; null stays null.
- Current known A+B: THB27,192,339.36; unrounded USD863,248.87;
  rounded quotation subtotal USD863,900.00. Difference USD651.13.
- B4/B12/B14 and C options remain “To be quoted”, not free/included. A+B states
  its exclusions; C remains separate.
- B10/B11/B13 annex amounts allocate the rounded parent proportionally in cents,
  with deterministic largest-remainder distribution. Qty unchanged, unit prices
  up to four decimals; Qty × Unit rounded to cents equals line amount, and all
  lines sum exactly to the parent. No artificial balancing item.
- English customer descriptions are an allowlist; annex wording binds to stable
  PTTEP source IDs. A reordered source cannot silently select the wrong wording.
- B3/B9 included days, original USD day rates, proposed OT/standby and written
  agreement qualifications remain. These labour rates are not rounded to USD100.

## UI and workbook
Official view isolates customer content from the internal workspace. Navigation
back to 10.3.3 restores the unchanged THB preview. Project module search reaches
10.3.4. All six worksheet tabs are available; download has no file chooser.

The exporter reuses original template cells/styles, six sheets, column widths,
merged cells, logo, page/print geometry. It fills a new English workbook from a
customer field allowlist and formats USD values. It clears old cell contents and
unused shared strings, removes custom metadata and obsolete calcChain, and
writes only current customer values. It never edits the embedded original.
It does not copy internal source rows, cost/margin/FX/rounding notes, HOLD markers,
or internal module IDs. Filename: PJ2608-0553_ScopeOfSupply_USD.xlsx.

Creating/downloading the customer-format workbook does not record approval,
signature, issue, sending or customer acceptance; model.issued stays false.
Original 10.3.3 release readiness is unchanged.

## FX guidance
USD receipts converted to THB should be budgeted against bank TT Buying (or a
bank forward buying quote aligned to receipts). USD purchases use Selling.
31.5 is not a guaranteed future conversion. No live rate or hedging transaction
is applied automatically.
Primary references:
https://www.bangkokbank.com/en/personal/other-services/view-rates/foreign-exchange-rates
https://www.bangkokbank.com/en/Business-Banking/Protect-My-Business/FX-and-Interest-Rate-Risk-Management/Foreign-Exchange-Forward

## Validation
`npm run validate:0553-official-usd-release` verifies rounding boundaries,
source immutability and propagation, stable-ID annex wording, arithmetic, clean
English customer HTML and six-sheet native export, original geometry and cleared
metadata. Existing source/release tests are retained with four-view navigation
and the explicit quotation-rounding change classification.

Completed verification: existing build validators passed (updated the change-log
classification contract, then resumed remaining checks); production webpack
passed with the same three bundle-size warnings. Browser verified module-search
navigation, four-tab switching/back, English-only official content, USD863,900,
unchanged THB27,192,339.36 in 10.3.3, all six tabs, 1366/700/390px viewport
containment, direct download without file chooser, and zero page errors.
Rendered the summary, B3 service wording and all five annex sheets; original
column/page geometry remains. All workbook relationship targets resolve.
No desktop Microsoft Excel execution, customer submission or approval claimed.
