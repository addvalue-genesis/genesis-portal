# PJ2608-0550 — visible THB Working and authorised activity estimates

Parent: `87b2a44d2d3b01a38475a17d5f5567bbe793ca92`. UI `2026-11-01.9-preview`.
This is runtime pricing work, not documentation-only or completed engineering.

## Owner decisions in this session

The owner requested completion and visible prices, then chose:

- Convert PAGA/EUR to THB.
- Estimate additional TSI services from activities using the existing team rates.
- Estimate travel/site expenses separately.
- Cover the minimum 90 post-start-up calendar days with an assumed 10 MD remote
  and 10 MD on-site support; retain the full coverage duration and flag the
  proposed staffing/response basis for purchaser review.

Existing permission to publish to the same Working branch remains applicable.
The earlier `e5b68c8` approved source tree was already published as `87b2a44d`;
older handoff statements that publication was blocked are historical.

## Result from repository seeds

| Working priced subtotal | THB |
|---|---:|
| Part A supply with computable prices | 114,041,602.11 |
| Part B vendor services, TSI labour and expenses with computable prices | 29,595,179.14 |
| Known A+B | **143,636,781.25** |
| Part C optional | OPEN |

Known USD A+B: 4,270,646.27. These are partial, provisional amounts from the
repository seeds, not a readback of the owner's Windows saved prices. 52 of 258
selected Base owner rows have computable prices. A further 14 selected Option
rows remain unpriced. Many unpriced MR rows have candidate package prices but
unconfirmed coverage; these counts do not mean all those items need new purchase.
No missing scope is converted to zero, and the complete Base remains OPEN.

The existing commercial page now shows the live known A+B THB/USD headline,
opens 10.5 summary by default, lists priced owners with quantities, costs/sells,
source assumptions and reverse navigation, and lists missing inputs separately.
10.7 retains its USD eight-column form and shows the known THB counterpart in
its internal identity banner, explicitly including A+B+C with C separate from Base.
No new navigational module, parallel price store or external submission is added.

## Currency and resource basis

Only a missing EUR leg is filled once: **38.0127 THB/EUR**, Bank of Thailand
average commercial-bank selling rate dated **30-Oct-2026**, verified at
<https://www.bot.or.th/en/home.html> and
<https://app.bot.or.th/BTWS_STAT/statistics/ReportPage.aspx?language=eng&reportID=123>.
It is a Working reference, not a booked bank rate. Existing EUR values win.
Existing USD rate/source/date win; the fresh repository seed keeps 33.6335
THB/USD dated 8-Oct-2026. The FX source text records the mixed dates explicitly;
the schema's date field retains the original basis date. Later clearing is kept.

24 labour plans use E01/E02/E03/E04/E05/E16 and the existing CORE_TEAM protected
selling rates, 8 MH/MD and Professional Service Prime +5%. Internal labour cost
stays null. Examples: 840 MH system design verification across all 19 systems;
40 PM MD; 100 planning TSI submissions with two review cycles; separate TSI
acceptance/interface work, training, site tests, surveys, regulatory preparation
and the selected 20-MD staffing allowance over 90 calendar days. These are
explicit authored assumptions, not source facts or final manpower certification.
OEM/MGW package design, drawings, assembly/FAT and PAGA OEM inclusions remain
with their purchased owners. Proposed non-overlap needs engineering review.

The shared travel plan assumes 35 person-round-trips, 70 paid transit MD,
302 site/transit person-days, 267 room-nights and six rotating personnel. Remote
post-start-up support days are excluded from travel/per diem. Planning expense
rates are THB20,000/round-trip airfare; THB2,500/room-night; THB1,000/person-day
per diem; THB5,000/round-trip ground transfers; THB3,500/visa/permit processing;
THB4,500/person medical checks; THB6,000/person work/travel cover. Expense
allowances use 0% pending agreed pass-through treatment. They are editable
estimates, not quotations. The insurance MR responsibility remains CLARIFICATION,
so its entered THB36,000 allowance remains out of the priced subtotal.

Counts derive from the initial versioned plan. Editing an event/crew/day requires
re-estimating the shared expense counts; automatic dependency-driven reallocation
is not implemented. Combining visits may reduce the budget. This is Myanmar
onshore/site planning, with no inferred helicopter/offshore logistics.

## Preservation and remaining work

Preparation changes only exact untouched MR seed records. Full-record edits,
deselection, missing/deleted owners, conflicting calculation IDs, existing FX,
vendor offers, customer/source/integration/technical/volume records and frozen
issues are preserved. Once-only receipts are nested in the existing repository
preparation marker; later deletions/clearing do not regenerate. Fresh-start and
saved-workspace totals can differ because owner edits take precedence.

All source-native review, engineering proof, AVL/deviation acceptance, customer
coverage and Issue gates remain independent. Freight/Incoterms/customs, external
specialists/OEM training, startup spares/tools, authority fees, project/cargo/
medevac insurance, warranty coverage/extension and Option C still require sourced
pricing or explicit scope/budget decisions. Current INDUSTRONIC upstream warranty
terms do not automatically meet the customer's 24 months after last PAC.
No technical approval, source authority change, completed FAT/SAT or issue is
created. No THB580M historical estimate or 0553 commercial facts are adopted.

## Principles and verification

ADR-0550-001 principles 2, 4–6 and 8–14 affected this change: explicit derived
assumptions, single ownership, visible missing values, canonical shared inputs,
change-driven review, stable IDs and frozen outputs. Actual checks:

- New activity-budget regression: real repository seeds; currency/role/equation
  path; MH/MD; 90 calendar days versus 20 MD; shared trip/expense arithmetic;
  exact expected subtotals; strict CLARIFICATION exclusion; Base/Option split;
  edited/deselected/deleted records, conflicting IDs and FX overrides preserved;
  idempotent reload and read-only React rendering.
- Existing summary/release, repository basis, SI monetary controls, release issue,
  Working Preview, Working-to-Schedules, workspace recovery and bid-volume
  validators passed. Frozen export/history tests remain intact.
- Exact private Rev11/Rev05 workspace validates after the final preparation;
  1,444 canonical requirements and source/preparation/integration/technical/volume
  bytes remain unchanged. No private source JSON is committed.
- Production webpack compiles with the existing large-chunk warning (~3.18 MiB).

Isolated browser QA and final publication verification are recorded below after
completion. Project-wide clause/engineering completeness is not proven by these
software checks.

### Final browser result

The isolated browser regression passed on the production bundle: actual startup
creates the estimates and missing EUR conversion; the THB143,636,781.25 headline
and 52 priced owners render; Official remains HOLD; 10.7 shows the THB counterpart;
reverse navigation reaches the existing owner; price navigation performs no
IndexedDB writes. Reload preserves a changed TSI selling rate, deleted airfare
allowance, deliberate EUR clearing and a USD FX override, byte-for-byte. No page
errors. Desktop and 390px mobile screenshots were visually inspected with Thai
font rendering. The mobile price overview was tested with other top-level modules
collapsed; this is not certification of every combination of expanded modules.
An earlier combined expanded Source/Release diagnostic had a 425px document width
at a 390px viewport; its nested table overflow was not fully localised. Scoped
price-reference/banner wrapping is applied; no general UX redesign is claimed.

`git diff --check` passed. Publication uses the same authorised branch, compares
its current head with the parent above, and verifies the complete uploaded tree
against the staged local tree before advancing the ref. The commit/readback SHA
is reported in the user handoff; this file intentionally does not embed its own
future commit hash.
