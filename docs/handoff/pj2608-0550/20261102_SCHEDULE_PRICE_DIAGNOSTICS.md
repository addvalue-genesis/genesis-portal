# 0550 — Schedule price audit and deferred previews

Parent `4bcc87b47158b5f78c497e084d7602448de81328`, existing branch/port3050.
UI `2026-11-02.4-preview`. User requested continued MR/LIS ↔ supplier review,
a second performance check and the reason C2–C6/C8 have no prices.

## Verified cause in the actual available workspace

Read-only derivation used canonical Source Rev11 / preparation Rev07 (678 source
records, 1708 derived requirements). It is not a read of Windows IndexedDB.
The screenshots agree with the independently derived counts:

| Native Schedule | Existing destination / Working owner | Selected rows | Priced before change | Actual missing input |
|---|---|---:|---:|---|
| C2 commissioning/startup spares | B5 | 4 | 0 | quantities, spare list and sell/cost basis |
| C3 two-year spares | C3 | 4 | 0 | OEM spare list/quantities/prices; Base/Option qualification remains |
| C4 capital spares | C2 | 4 | 0 | distinct capital inventory and quantities/prices |
| C5 tools | B6 | 5 | 0 | handed-over tools/software/test equipment scope and rates |
| C6 fills/consumables | explicit 11.M allocation | 0 | 0 | no allocated owner; no automatic zero or N/A |
| C7 services/training | B3/B4/B7 | 23 | 19 | four owners missing prices; seven priced expenses were suggested as labour |
| C8 purchaser facilities | explicit 11.M allocation | 0 | 0 | purchaser facility applicability, resources and rate ownership |

All these suggested bindings have blank customer Incoterms. Native C2–C6 prices
are split into CIF/FOB columns; a known amount alone does not establish the right
column. C1/C7 can display known amounts without choosing a CIF/FOB column.
These 17 rows are project work headings, including reconciliation/deduction controls,
not 17 priced spare SKUs. There is no undisplayed complete price list to reveal
merely by changing CSS.
Historical lump-sum allowances exist but are not current SKU quantities or supplier
quotes and are not silently reactivated. No request for more documents is made.

## Actual native evidence reviewed in this pass

- MR B1 original SHA256 `5199bb61c01db86f7c971117ad5e54b7d04e70061d6ad999b72f858122a0de5a`:
  physical PDF8 / printed6 §2.0(n), PDF50 / printed48 Appendix10,
  PDF52 / printed50 Appendix12, PDF53 / printed51 Appendix13.
  Actual full pages were rendered and inspected. Spares require named parts,
  part numbers, prices/availability; Appendix12 requires an item price breakdown.
  Tools require names, prices, quantities/use and equipment/TAG identification,
  including configuration/monitoring/control software. Generic project headings
  are not complete procurement lists. These instructions do not supply SKU prices.
- MGW Q26-063 original SHA256 `6d11565391a0ca5760cdcc76e9f12e191de44004d59dd7865ae8237b1f2b2a31`:
  physical PDF24–25 inspected. Quote rows `MGW-Q26-063-LAN-008` (ACO, quantity1)
  and `MGW-Q26-063-LAN-021` (APF, quantity2) each describe one
  `PWR-C1-715WAC-P` spare PSU per Distribution Switch set. This is a candidate
  included component under the existing LAN package owner, not an additional
  priced C3 line or proof of the complete 19-system spare inventory. Installed
  redundancy/hot-spare capabilities and the words “tool less” elsewhere are not
  evidence of a separately delivered maintenance spare/tool kit.
- Existing source text for current Exhibit A rev1 and Exhibit C rev-1-nan was
  checked against the spares/tool/delivery/facility duties. Current Exhibit C text
  and its embedded tables have numbering inconsistencies relative to the supplied
  rev0 native forms. Existing explicit qualifications and fixed form IDs prevail;
  no semantic reclassification or new Schedule numbering was invented.

This pass adds a documented engineering audit, not a source import, accepted
mapping, complete CAL/RPT, new work package batch or formal issue. Rev07 is intact.
The missing itemized inventory cannot be replaced by invented zero, supplier
approval, arbitrary percentage or automatic use of a historical allowance.

## Code changes

- Existing native Schedule wrapper now shows source-owner count, known customer
  selling subtotal, missing quantity/price and separate CIF/FOB allocation gaps.
  Expanding the internal table opens the exact existing Working owner or 11.M
  editor, with the existing technical-equipment link. This replaces both redundant
  below-form source toolbars. It does not store a second price or copy supplier
  cost into selling cells.
- Empty C6/C8 explicitly distinguish no allocated row from zero or reviewed N/A.
  C8 explains the purchaser-facility boundary; SI travel/per diem is not a new
  purchaser charge just because the descriptions resemble travel facilities.
- Existing owner-authorised SI expense receipt identifies seven selected B4
  travel/transit/hotel/visa/per-diem/transfer/medical owners. New *unsaved*
  allocation suggestions put them in A1 Others, retaining the same amounts and
  one cost owner, rather than inventing C7 man-hour rates. Saved user allocations
  remain authoritative. Opening does not save the suggestions.
- 11.P mounts native HTML only for an expanded Schedule and unloads it on close.
  Nested detail toggles do not close the containing Schedule. Export-all still
  constructs every original form when explicitly requested.
- An individual native Schedule checks its own native issues, equivalent to the
  old global list filtered to that Schedule. Global release checks still inspect
  all forms. Native HTML is memoized only by React view/id lifetime; changing
  workspace/view recomputes it. Volume III does not derive unused Working previews.

No Module ID/schema, Working quantity/rate/selection/FX, source authority, review
stamp or issue authorization changes. Private records and paused earlier Volume I
navigation work are not published in this change.

## Verification

- New `validate:pj0550-schedule-diagnostics`: missing price vs known amount with
  unknown CIF/FOB; explicit zero vs empty schedules; single owner Base/Option
  projection; source targets; disabled navigation; equivalent per-form/global
  checks; closed forms do not render; no input mutation.
- Extended Working-Schedule model validation: expense suggestions use A1 Others,
  unchanged financial records, existing user C7 allocations retained.
- Actual full-workspace parity against parent: all 13 native HTML outputs and
  individual/full Word bytes match for the *same view*. Global native problems
  match; all active selected lines/prices and preview totals match; only seven
  unsaved expense suggestions change their document destination. Known subtotal
  remains THB143,636,781.25 / USD4,270,646.27, 272 selected /52 priced.
- Native Exhibit C, activity-budget, Working-Schedules and commercial-issue model
  validators passed. Frozen native Word/history and issue HOLD remain covered.
- Production compile passed with the existing ~3.2MiB chunk warning.
- Extended Working-Schedules browser and existing three-volume browser passed:
  real download content, Working/11.M targeting, nested details and deferred
  mounts, save/reload, dirty guards, exact frozen package exports, mobile containment
  and zero page errors.
- An isolated browser loaded the actual private canonical Rev07 workspace and
  checked all six requested Schedules. Counts and explanatory states match; no
  change to lines/offers/FX/calculations/source/SI/technical/volumes/control/history
  across navigation. Desktop and mobile C2 screenshots were inspected.
- In-page click → two animation frames, four warm samples on production public
  seeds, 1440px headless Chromium: 11.P median249.8ms →26.2ms. Closed preview
  DOM10610 →594 nodes; mounted native papers26 →0. Opening an individual form
  still renders it; explicit all-form exports retain all forms. These timings
  exclude automation/scroll overhead and do not measure Windows or total startup.

ADR-0550-001 principles **1–6,8–14** guided the source/interpretation audit,
non-additive package components, disclosure of gaps, single owner, shared Working,
revision/frozen-history protection and evidence-based UI. Runtime tests verify the
specific projections/navigation/issue preservation above, not project-wide source
semantics, engineering adequacy or purchaser acceptance. Release remains HOLD.
