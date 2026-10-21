# PJ2608-0553 — Management-selected MGW Purchased FAT Item 3/4 Working SELL (21 Oct 2026)

## Decision and sources
Management selects OEM Factory FAT at MGW Nantong, China. MGW 20-Oct-2026
P26-058_R2 Cover source specifies:
- Item **3** / SERV-2 — Internal iFAT + assembly/integration, **USD5,000**.
- Item **4** / SERV-4 — End-user FAT minimum 5-day facility, **USD2,500**.
- Purchased FAT services only = **USD7,500**; Working FX THB31.50/USD = **THB236,250**.
- Full MGW quote remains USD368,841, equipment detail USD350,341, total MGW services
  USD18,500. Item 2 (engineering/VDRL) USD8000 is NOT B3. Item 5 packing USD500
  is B5 scope check, Item 6 road freight USD2500 is B6 scope check.
- MGW supplied quotation is NOT proof of invoice paid nor approval of exchange rate.

## Commercial Pricing Policy & Cost Owner
**This is a purchased item currently selected within internal SOW-B3 Working SELL**, NOT
a second equipment price. Management instructions: supplier purchased quote cost
+ **SAMTEL 20% + ADDVALUE 5% + Omission Reserve 5%**, each calculated on THB
vendor quotation cost (1.30×, **cost markup**, not 30% gross margin).

| Calculation | THB |
|---|---:|
| MGW SERV-2 + SERV-4 USD7,500 × FX31.50 | 236,250.00 |
| SAMTEL 20% purchased cost | 47,250.00 |
| ADDVALUE 5% purchased cost | 11,812.50 |
| Omission Reserve 5% purchased cost | 11,812.50 |
| **MGW PURCHASED FAT SERVICE WS** | **307,125.00** |

10.2 B3.1 FAT = **THB704,525** = MGW WS **307,125** +
ADDVALUE FAT Witness / Travel original WS **397,400**.

Whole B3 10.2 = **THB2,750,525** = FAT **704,525** +
SAT/SIT labour **2,016,000** + VeEX temporary rental **30,000**.
Part B Base 10.2 total becomes **THB4,151,836.82**, up THB307,125 from prior
THB3,844,711.82. Other owners B1/B2/B5/B6/B8/B9 and C1/C2 unchanged.

## Strict SAMTEL non-duplication between Part A/C and Part B
Before this decision, 10.3 applied **SAMTEL 5% deduction to all Part B Working SELL**.
MGW Purchased FAT uses **SAMTEL 20% of vendor cost already included in B3 SELL**.
DO NOT charge another Part B 5% on the same purchased portion. New 10.3 equation:
- Remaining ordinary B3 SELL = THB2,443,400; old B standard SAMTEL 5% =
  **THB122,170**.
- MGW purchased component = THB307,125; SAMTEL already 20% quoted cost =
  **THB47,250**.
- Combined B3 SAMTEL attribution = **THB169,420**, NOT 5% of THB2,750,525
  plus SAMTEL20% again.
- B3 customer-price preview (not release) THB2,750,525, internal ADDVALUE
  expected receipt after SAMTEL shares THB2,581,105; actual payroll and vendor invoices
  missing so actual realized profit is **NOT ESTABLISHED**.
- Part B other line deductions 5% remain unchanged.

## Cost Ownership and evidence gates
- Selected MGW vendor services use unique VQ-MGW-SERV-2 and VQ-MGW-SERV-4 and
  financial identity IC-FAT-MGW-SERV-2-4 / WS-B3. CP-B3 is RESERVED/NOT ISSUED.
- Source authority P26-058_R2 MGW 20-Oct cover; equipment quoted
  USD350341. Reconcile Part A equipment pricing and ensure SERV-2/4 are not again
  priced as included Part A equipment/service. The vendor's quote remains unchanged.
- B3 actual Direct Cost NULL: a quotation is a quoted purchased cost reference, not
  paid invoice, verified tax, customs, FX or employer payroll.
- Confirm MGW 2-day internal iFAT + minimum 5-day facility vs ADDVALUE six-day paid
  witness schedule and ITP / witness location.
- Keep B3.4 Historical Bangkok FAT THB144,000 and B3/B8 7-day Scenario (ADDVALUE-only
  China FAT THB402,400, *excluding* fixed MGW purchase WS) as NON-POSTING audit.
- No automatic Customer Release; require CFO and procurement owner approval before
  submission.

## Technical changes
New:
- frontend/src/project0553/data/b3MgwPurchasedFatWorkingSell0553.js
- frontend/scripts/validate-0553-b3-mgw-purchased-fat-working-sell.cjs
Modified:
- bcTurnkeyWorkingCost0553.js selects MGW purchased WS; B3 total and Part B roll-up.
- b3WorkingSellBreakdown0553.js / B3WorkingSellBreakdown0553.jsx: 4 unique B3 active cost buckets.
- b3HierarchicalPriceTable0553.js and workingModulePriceTableContract0553.js:
  explicit PURCHASED_SERVICE_WORKING_SELL price class with quote USD source evidence
  and price THB, only one B3 line posting.
- B3WorkTypeAccordion0553.jsx and MgwR2CommercialCover0553.jsx: purchased source vs
  quoted THB cost vs 20/5/5 margin, visible in original nested B3.1.
- releaseCommercialModel0553.js: explicitly no second 5% B deduction on MGW purchased
  component; 5% only ordinary B3 activities.
- revKAbcOwnershipControl0553.js and dependent validation assertions synchronized.
- B3+B8 optional 7-day work programme inherits new B3 purchased WS in both current
  and scenario references, without adding vendor purchase twice.

## Test / release
npm run validate:0553-b3-mgw-purchased-fat-working-sell
npm run validate:0553-b3-hierarchical-price-table
npm run validate:0553-b3-b8-seven-day-identity
npm run validate:0553-current-commercial-integration
npm run validate:0553-mgw-r2-cover-20261020
npm run build

Do not merge/release the commercial quotation or claim local CI PASS until locally
running the validations and reviewing 10.2/B3, 10.3, 10.5 screens.
