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

## Follow-up — MR hierarchy and +/- controls

Base `58ea0e95`. The actual 10.7 table now groups Part A by MR App.1.1–1.8,
then system/customer Lot, then source site. Appendix and system placement use
the first actual catalog occurrence; item order within each site uses the same
catalog position, not alphabetic descriptions or the old customer-form numbering.
The original customer S.N, Lot codes and module IDs remain visible and unchanged.

A Lot spanning appendices has one original summary/amount/Module ID. Its detail
rows appear under their actual Appendix; continuation headers link back to that
summary and carry no additional amount or navigational Module ID. Non-MR Working
packages appear separately after the source Appendix sections. Services/Options
retain their customer-schedule grouping; this does not turn planning activities
into approved MR facts. Unselected/unmapped records retain their existing area.

Part, Appendix, system and site have native +/- buttons, plus expand/collapse all.
Systems initially collapse to an overview. Hidden descendants remain in the DOM;
the existing Module Search target opens their ancestor paths before focus/scroll.
The browser remembers independent expansion preferences in a project-scoped
localStorage key. This is UI state only; financial IndexedDB/revisions are untouched.

ADR principles **5, 8, 10–12** govern this change. The pure hierarchy regression
checks every original row/cell/ID exactly once, all eight Appendix sections, actual
MF/HF-before-Aeronautical order, site positions, one cross-Appendix Microwave/Tower
Lot, unchanged totals/export and no raw workspace mutation. Existing SI controls,
commercial issue/frozen history and Bidding regressions pass; production compilation
passes with the existing asset-size warning. No engineering/release gate is relaxed.
The extended browser regression also passes: nested +/- and keyboard toggles,
collapsed-row Module Search reveal, independent saved expansion after reload,
source/package navigation, desktop/mobile containment, unchanged IndexedDB and
no page errors. The collapsed desktop overview screenshot was visually inspected.

## Follow-up — Part A/B/C header IDs

Base `ba9579a7`. The prior hierarchy supplied +/- controls but omitted copyable
identities on the three Part headers. Added presentation child anchors
`bid.budget.release.part.A`, `.B`, `.C` to the existing Release and its search
index. Each collapsed header now exposes Copy ID; copying never toggles it.
Searching a Part opens that Part while preserving other expansion preferences.
Existing module/row IDs, financial records, customer cells/export and top-level
modules are unchanged. ADR principles **8, 10–12** apply. The pure hierarchy/SSR
regression checks all three unique searchable rendered IDs and copy controls,
along with canonical row/cell conservation. This does not close project scope,
engineering or pricing gaps or authorize issue.
Production compilation passed (existing size warning). The focused browser test
passed all three full-ID clipboard payloads on collapsed headers, independent
+/- operation, search-to-Part-B expansion, mobile copy visibility, unchanged
IndexedDB and no page errors. `git diff --check` passed.

## Follow-up — Full / Bid system inventory inside Part A

Base `be0f7d14`. The user requested all existing systems and what must be bid,
independently of the 15 commercial Lot headings. The existing Part A now contains
a read-only Full/Bid table. Full takes the union of system registry, MR catalog,
Working lines and structured Integration requirements (currently 19 systems plus
COMMON). It is not capped by the vendor quote or customer-form systems list.

Every catalog requirement remains inspectable, including the 30 Part-A COMMON
records without a Lot, COMPANY supply, unselected rows, missing/duplicate Working
records and records without prices. Source quantities/units and locators remain
source values. The table sorts by the first Part-A source page/position, including
the p07/p08 scope clauses before the Appendix equipment schedule. The existing
priced-detail hierarchy and customer export keep their prior ordering.

Equipment A and B/C obligations have separate TSI / COMPANY / CLARIFICATION / OPEN
counts. Bid keeps TSI obligations and unresolved scope; selection/price does not
define applicability. AIS remains in Bid for TSI engineering/testing even though
its main hardware is COMPANY supply. Entirely COMPANY-only systems with no extra
selected work are omitted only from Bid, not Full. No disposition or approval is
written. Reference Lot associations and actual Working Lot values are separate;
missing mapping is counted with the existing mapping validator. Price counts
use selected additive owners, not scope-detail rows or a copied package amount.

Existing Working group/line IDs provide Source navigation and Copy ID. No new
top-level module, financial data, source record, selection, quantity, rate, FX,
margin, review or customer XLSX is introduced or changed.

ADR principles **2–3, 5–6, 8, 10–14** apply. Tests cover the 20-row union, every
catalog requirement once, unresolved/new systems, missing/unselected COMMON,
COMPANY hardware with TSI services, COMPANY-only Bid filtering, source-page order,
real SSR and unchanged raw data/customer rows. SI controls, frozen commercial
issue regressions and production compilation pass (existing bundle-size warning).
The inventory exposes current evidence and gaps; it does not certify that every
customer document/clause has been read or that engineering/issue review is complete.
The focused browser regression passed Full/Bid switching, 20 system rows, AIS
equipment/services split, unmapped COMMON details and Source navigation, Part A
reveal, mobile scroll containment, unchanged IndexedDB and no page errors. The
desktop screenshot was inspected. A final mode label/highlight is presentation only.
