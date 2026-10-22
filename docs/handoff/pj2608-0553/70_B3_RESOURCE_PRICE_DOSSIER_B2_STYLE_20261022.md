# PJ2608-0553 / B3 detailed resource pricing dossier — 2026-10-22

## Request and layout
User requested the breakdown style of `10.2 / bid.budget.working.bc.b2.independent-recalculation.dossier.project-dossier.mr.mr-0001`: source-backed collapsible **Work Type → Location → Work Item / Role** with quantity, role, number of people, days, unit rate, extended cost/Working SELL, owner and evidence.

New module: `bid.budget.working.bc.b3.resource-price-dossier`, mounted at the top of the B3 pricing hierarchy and searchable in Project Module Navigator.

## Price authority: ONE selected owner WS-B3
| Work type | Detailed evidence rows | Vendor quotation / estimate basis | Selected B3 Working SELL (THB) |
| --- | ---: | --- | ---: |
| B3.R1 MGW purchased OEM iFAT / FAT Facility | 2 | SERV-2 USD5,000 + SERV-4 USD2,500, ×FX31.50 → vendor quote THB236,250; +SAMTEL20% / ADDVALUE5% / reserve5% cost-based | 307,125 |
| B3.R2 ADDVALUE MGW China FAT witnesses and travel | 8 | 2 witnesses ×6 FAT days; 4 total person travel-days; airfare, hotel, visa, ground transport and insurance estimated separately | 397,400 |
| B3.R3 SAT/SIT labour retained priced timeboxes | 18 | Nine 40-day timeboxes × 2 separately displayed roles. 80 person-days × USD800/person-day × FX31.5 = THB25,200/person-day | 2,016,000 |
| B3.R4 Temporary VeEX MX100+ rental | 1 | 30 rental days × THB1,000/day | 30,000 |
| **Canonical B3 Working SELL / 1 LS** | **29** | **NOT verified Direct Cost** | **2,750,525** |

**Critical:** 40 days/80 MD is the retained financial price driver, NOT approved deployment plan. The source role rate THB25,200/MD is **pre-award Working SELL**, not ADDVALUE actual payroll/direct cost. Vendor quote THB236,250 is a supplier cost basis, NOT paid actual Cost. Do not count the MGW supplier quote again or add markup twice.

## Unpriced stages — no invented costs
- B3.R5 BF prior survey (BOD-C2 §8), ZPQ/ZWP8/ZWP11: conditional revisit only. Independent labour illustrative reference 2 people × (3 site days + 2 travel team-days) × THB25,200 = THB252,000. **NOT POSTED**, Direct Cost null, written work order and POB/marine travel unknown.
- B3.R6 GF Fabrication Yard SAT (SPE-C2 §7.3.2), ZWP20/21/22/23 at JUTAL **Zhuhai**, not MGW Nantong OEM FAT; ADDVALUE crew, days, rate, ITP and RACI **NOT ESTABLISHED**.
- B3.R7 GF Offshore Commissioning (SPE-C2 §7.3.3) after platform installation. Vendor scope; ADDVALUE share, man-days, vessel/access and cost **NOT ESTABLISHED**.
- B3.R8 Shared integrated SIT and Punch, phase allocation unresolved.
- Earlier 28 productive +2 risk = 30 two-person team-days is a **legacy lean comparison only** not a stage-approved deployment plan; 2 more management-reserve days unposted.

## Dataflow and integrity
`b3FortyDayWorkingSell0553.js` / `b9ChinaWorkingBudget0553.js` / `b3MgwPurchasedFatWorkingSell0553.js`
→ `bcTurnkeyWorkingCost0553.js` (selected **WS-B3 2,750,525**)
→ `releaseCommercialModel0553.js` (B3 provisional customer Sell THB2,750,525, release HOLD)
→ `scopePartBcReadModel0553.js` (B3 Working SELL 2,750,525, CP-B3 NOT ISSUED).

The new `b3ResourcePriceDossier0553.js` reads the same selected owner and validates all 29 line totals without rewriting the canonical Working Sell. Other candidate phases/line items have `workingSellTHB:null`, `actualDirectCostTHB:null`, and are NONPOSTING. This is intentional: a detailed ledger must not fabricate payroll Cost or imply approval.

## Deliverables
- `frontend/src/project0553/data/b3ResourcePriceDossier0553.js`: financial identity, row quantity/rates, 8 work groups, 47 record objects, 29 selected-priced lines.
- `frontend/src/project0553/B3ResourcePriceDossier0553.jsx`: B2-style collapsible work-type/site/price dossier with actual cost gates.
- `frontend/src/project0553/B3WorkTypeAccordion0553.jsx`: mounts dossier above B3 selected Working SELL hierarchy.
- `frontend/src/project0553/data/bcModuleNavigator0553.js`: root and 8 groups, site-level and row-level deep links.
- `frontend/scripts/validate-0553-b3-resource-price-dossier.cjs`: exact Source→10.2→10.3→10.5 and React SSR checks.
- `frontend/package.json`: npm validation in full production build.

Run: `npm run validate:0553-b3-resource-price-dossier` then `npm run build`.

No price update, source equipment BOM mutation, native customer document change, or customer release. PR #35 DRAFT.
