# 0550 — Prices and identity in the actual 10.7 table

29-Oct-2026 (Asia/Bangkok). Base `1823717e`, existing Official Working branch.

The user's target is `bid.budget.release`, not the summary module or a row ID.
Its customer table now has a sticky identity strip with the existing Module ID,
Copy ID and explicit pricing state. Provisional known USD amount and priced/selected
owner count appear inside this module. Existing Unit Price/Sub-total cells still
read the canonical customer-row projection.

Internal Remark annotations explain each OPEN row using its actual Working or
Official problems. Incomplete Provisional Lots show their known child subtotal
and count separately from the still-OPEN full Lot. Native Customer prices remain
inspectable when USD is unavailable. Covered details link to the existing owner.

An MR row with an unallocated selected supplier package can open that candidate
and inspect its native Customer price. Same-system candidates are not verified
MR coverage: the UI explicitly leaves the MR amount OPEN and does not divide or
repeat the package price. Engineering allocation/review remains real project work.

No pricing equation, quantity, source offer, FX, selection, review, stable ID,
schema, authorization gate or frozen issue has been changed. The extra diagnostics
are screen-only; the same eight customer columns/cells and customer export are
preserved. Official never uses Provisional annotations as reviewed money.

ADR-0550-001 principles **5, 6, 8, 10–12** apply: single owner, explicit gaps,
reverse Source navigation, shared canonical projections, unchanged issue history
and visible copyable module identity. This is presentation and diagnostics, not
approval of the remaining engineering/mapping gaps or a customer submission.

## Verification

- Extended `validate:pj0550-price-summary`: canonical known USD prices in customer
  cells, incomplete Lot amounts, native FX diagnostics, unallocated package links,
  Official gating, actual zero versus missing, real React SSR and unchanged raw
  financial/history records and customer-row export projection.
- `npm run build`: 183 PASS markers and successful production compilation.
  The final sticky offset adjustment was recompiled with `build:portal`; the same
  existing asset-size warning remains. No pricing logic changed in that adjustment.
- Extended price-summary browser regression passed on the final compiled app:
  actual table price cells, full Module ID copy payload, sticky header clearance,
  package-to-Working navigation, desktop/mobile containment and unchanged IndexedDB
  record. Desktop/mobile screenshots inspected. The isolated Linux browser has
  no Thai font; Thai rendering on the user's Windows browser was not inspected.
- `git diff --check` passed. The user's private Windows saved workspace was not
  read or replaced; actual remaining MR allocation decisions are still required.
