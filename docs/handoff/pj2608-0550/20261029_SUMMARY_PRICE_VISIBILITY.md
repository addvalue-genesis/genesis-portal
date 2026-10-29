# 0550 — Show known prices while complete totals remain OPEN

29-Oct-2026 (Asia/Bangkok). Base `0d212ddd`, UI `2026-10-29.12-preview`.

The user opened `bid.budget.official.summary` at Working R8 and saw 268 selected
rows, zero reviewed rows and OPEN subtotals. The summary only displayed complete
totals; a missing selected price made the complete subtotal null, concealing
the numeric prices already available for other rows. Review count alone is not
the reason that a Provisional subtotal is OPEN; missing prices/FX and scope are
independent from the Official review gates.

The existing module now also shows known customer prices by Part A/B/C in THB
and USD, plus priced/missing row counts. A second table shows native-currency
Cost, ADDVALUE Sell and Customer Sell separately, so native prices remain visible
when conversion is unavailable. A button opens the existing Working owner rows.
Working, Budget and Release views share the same display component.

This is a read-only projection of `model.provisional.selected`, including its
effective selection and ownership exclusions. It sums finite canonical amounts
with the existing decimal money helper. No record, rate, quantity, margin, FX,
review, issued snapshot or historical price is inserted or changed. Missing
amounts remain OPEN; explicit zero stays zero. Currency and Part C are kept
separate. These incomplete known-price sums are clearly labelled PROVISIONAL;
they do not complete Base A+B or promote Official/Release readiness.

ADR-0550-001 principles **5–6 and 10–12** apply: additive cost owners only,
visible gaps, canonical projections, frozen history and the existing module ID.
The existing Official/complete-total and commercial issue controls remain in place.

Validation: new canonical-seed and synthetic summary regression, including
missing FX/native prices, partial totals, zero versus unknown, A/B/C separation,
unselected rows and actual React rendering; existing MGW detail/FX and controlled
commercial issue regressions; production webpack compilation and diff checks.
Browser checks also cover numeric known prices alongside OPEN totals, Official/Provisional and Working/Release navigation, the source button, unchanged IndexedDB revision/prices/history, and no page errors. The summary fits the mobile viewport with local horizontal table scrolling; this is not a claim that every existing module avoids page overflow.

The user's Windows IndexedDB record has not been read by these fixtures.
