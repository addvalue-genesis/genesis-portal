# Reconcile the read-only0553 review with canonical records

**Date:** 4 November 2026 · **Review target:**
`397556f901c7fe6c8fd2960e9465932d7535ad1c`

Owner supplied an external read-only architectural/code review of that exact
commit. This note retains its useful observations and corrects claims against
the original canonical snapshots and functions. It does not reprice the project
or reinterpret the original source workbook. The later quotation-control work
is at `1e21b8a68626afb60addcc312a76fdadbf723567` in Draft PR56; it is a separate
implementation, not evidence that the older review inspected the newer feature.

## 1. Corrections before the review becomes an accepted basis

| Review statement | Canonical finding | Required wording/action |
|---|---|---|
| Rev03 B11 = USD0 / N/A; B12 = USD0 / N/A | Both snapshots use `amountUSD:null, priceText:"N/A"` for B12; Rev03 B11 is also null/N/A | Preserve null and treatment; do not store a known zero quote or infer scope solely from N/A |
| Rev02 B14 = N/A (in Base) | `submitted.samtel.rev02.20261030.json`: B14 amountUSD25000, source row37; Rev03 is also25000 | Correct the table to USD25,000 in both revisions; current allowance is not a verified premium |
| B11 proves necessary special tools are already included in vendor packages | Exact note says tools **expressly included** in equipment supply remain included; `technicalApplicabilityConfirmed:false` | Do not generalize to all required tools or confirmed package completeness; preserve specific inclusion evidence and unresolved scope |
| B12 excluded because telecom has no first-fill materials | Code records commercial exclusion by owner, with `technicalApplicabilityConfirmed:false` | Commercial N/A is confirmed; technical non-applicability across all equipment is not established by this flag |
| Current C1 is a whole RACON installed-equipment benchmark | Current selected C1 is six SI/TAG rows: SCADA ODU base/remote, indoor interfaces, L3 switch, BDA and RACON; prior RACON-only option is historical | Describe the current six-row mixed option and keep `firmOemQuote:false`; do not substitute its historical RACON-only composition |
| MGW SERV-2/SERV-4 purchased FAT is active in current B3 | `b3MgwPurchasedFatWorkingSell0553.js` records equipment-only correction, `selectedSupplierPurchase:false`, `selectedIncrementalWorkingSellTHB:0`, `vendorPurchasedQuoteTHB:0`, `includedInB3WorkingSell:false` | Treat the service quotation as withdrawn/nonposting history; do not add it back by citing the exception formula |
| ADDVALUE receivable subtracts only ordinary B5% when a purchased exception exists | `priceBWorkingSell0553` subtracts ordinary5% **plus** selected purchased SAMTEL share | Use the complete conditional equation in section3; current selected purchased component is0 |
| All current quoted child units are rounded upward from their previous quoted price | The reviewed397556f9 already holds A1/A2/A3 parent totals and uses largest-remainder USD10 allocation; A4 uses up-unit rollup | Record distinct policy modes; never apply the old universal ceil test to fixed-parent allocation |
| Cost×1.30 explains the current C1/C2 offer | `buildReleaseCommercialModel0553` only builds A/C cost-plus when directCostTHB is known; actual C options retain unverified direct costs and use `selectOptionBudgetaryOffer0553` | Generic A/C policy exists; conditional owner-selected option sell is not proof of direct cost or OEM price |
| B10 THB104,422.50 removal directly explains the entire USD16,200→12,960 change | Raw/Working decision and customer revision delta are different layers; at planning FX31.5 the THB figure is USD3,315, whereas the customer change is USD3,240 | Keep both true observations; reconcile the exact pricing/rounding/allocation revisions before assigning the entire difference to a single subtraction |
| Release detail changes only when a new Rev04 snapshot is created | Official10.3.4 archived cells are fixed; Release10.3.3 A1–A4 detail reads current Working, allocating selected parent targets | State which view and layer is being described. New immutable revision identity matters; its label need not mechanically be Rev04 |
| approval.releaseAllowed=false proves all outputs enforce approved issue | The staging model has HOLD flags; code also supports internal DRAFT exports | Inspect actual issue/export paths and authorization enforcement. A flag alone does not establish a universal release gate |
| Very high system safety follows from read-only source inspection | Revision separation is a useful control; the supplied review ran no scripts/browser/security checks | Keep conclusion limited to code inspection. Do not claim runtime, security or whole-engine math correctness from the flags |

The frozen Rev03 artifact is an Excel `.xlsx` opened through a Drive/Sheets URL,
not a reason to assume a native Google Sheets calculation model. Its exact
original bytes and cached cell snapshot are the archive authority.

## 2. Canonical comparison — USD, options outside base

| Code | Submitted Rev02 | Owner-selected Rev03 | Meaning |
|---|---:|---:|---|
| A1 | 241,100 | 241,290 | Owner-selected parent target |
| A2 | 137,000 | 137,130 | Owner-selected parent target |
| A3 | 34,200 | 34,200 | Owner-selected parent target |
| A4 | 292,500 | 292,500 | Current calculated group with preserved selected result |
| B10 | 16,200 | 12,960 | CurrentMR0001–0003 kits4/3/4; MR0004 RACON spares excluded by owner; original requirement retained |
| B11 | 5,100 | N/A (`null`) | Not separately quoted; expressly included equipment tools remain included |
| B12 | N/A (`null`) | N/A (`null`) | Owner commercial exclusion; technical applicability not automatically closed |
| B13 | 1,500 | 1,530 | Current three quoted consumable rows |
| B14 | 25,000 | 25,000 | Budgetary insurance SELL allowance, not firm insurer direct cost |
| **Total A+B** | **902,900** | **894,910** | **Delta −7,990** |
| C1 optional | 97,500 | 181,100 | Six current rows; outside base |
| C2 optional | 23,000 | 27,220 | Eleven current rows; outside base |

Base delta bridge from the frozen summary rows:

    +190 A1 +130 A2 -3240 B10 -5100 B11 +30 B13 = -7990 USD

Removal of the separately quoted B11 price is not a determination that the
equipment-included tools were removed. B14 excludes B6-owned cargo insurance
and SAMTEL bonds at the B14 line; that does not remove B6 cargo from the bid.

Rev03's canonical status is `CURRENT_PRICE_REFERENCE_NOT_ISSUED`, with
`ownerSelectedQuotation:true`, `issued:false`. The UI label “Agreed” alone is
not evidence of new transmission or customer acceptance. Use owner-selected
quotation unless the relevant bilateral agreement/transmission evidence is cited.
Rev02's submission metadata is preserved; this reconciliation did not reopen
the original email or independently verify delivery again.

## 3. Complete Part B equation and active versus historical selection

Let W_B denote total current B Working Sell; W_P the selected purchased-service
increment included inside it; C_P the selected vendor purchase quotation cost;
S_P the SAMTEL cost-based purchased share. All terms must have the same currency.

    Ordinary_B = W_B - W_P
    SAMTEL_total = R(Ordinary_B * 0.05) + S_P
    ADDVALUE_receivable = R(W_B - SAMTEL_total)

For the optional policy exception, if actually selected:

    W_P = R(C_P * 1.30)
    S_P = R(C_P * 0.20)
    ADDVALUE_receivable = R(W_B - R((W_B-W_P)*0.05) - R(C_P*0.20))

The percentages are **0553 PARTICULAR policy**, not default values for Common.
No standard5% is deducted against W_P in addition to its purchased share.
For the current withdrawn MGW service selection W_P=C_P=S_P=0, so the ordinary
service formula reduces to R(W_B-R(W_B*0.05)). The historical SERV-2/SERV-4
quotation remains evidence, not an active supplier award or new cost posting.

## 4. Precision, evidence and template limits still require work

The historical/read-only snapshots preserve values but do not prove every
calculation that produced them was mathematically or technically complete.
0553 legacy working/release paths still use binary floating point and EPSILON.
PR56 extracts decimal step/fixed-parent equations; it does not migrate all FX,
allocation, line and summary arithmetic. No blind repricing is authorized by
this review reconciliation. Freeze originals first and migrate mutable paths
with source-bound policy fixtures and explicit differences.

The model's null current insurer quote / `firmOemQuote:false` establish that the
current model does not carry a verified firm price. They do **not** establish
that a quotation document cannot exist elsewhere in Drive/email. Check existing
connected sources before requesting documents again or claiming a global absence.

B14 and C1/C2 commercial allowances/offer quantities are known in the frozen
quote. Insurer underwriting/OEM compatibility, procurement scope, actual supplier
rate and demand/stock quantities are separate verification questions. Do not
turn their unresolved engineering/cost basis into “no customer offer quantity.”

Native original-file integrity, generated formula/cell tests and visual/template
approval are separate checks. Generated exports may fit rows or add allowed
detail sheets; that needs a template change policy rather than a blanket claim
of identical geometry. Original archived bytes remain unchanged.

## 5. Evidence map and audit scope

Use function/field identities, not unverified line numbers that drift by commit:

- `frontend/src/project0553/data/snapshots/submitted.samtel.rev02.20261030.json`
- `frontend/src/project0553/data/snapshots/release.rev03.20261103.json`
- `frontend/src/project0553/data/bcTurnkeyWorkingCost0553.js` — offerTreatment,
  technical applicability, B10 owner decision and nonposting guards.
- `frontend/src/project0553/data/b3MgwPurchasedFatWorkingSell0553.js` — current
  selection0 and withdrawn service history.
- `frontend/src/project0553/data/releaseCommercialModel0553.js` —
  `priceAorCFromCost0553`, `priceBWorkingSell0553`, current option bridge and approval.
- `frontend/src/project0553/data/officialUsdRelease0553.js` —
  `PART_A_SUBMITTED_PRICE_HOLD_0553` and fixed-parent/up-unit branches.
- `frontend/src/project0553/data/optionBudgetaryOffer0553.js` / `c1SiTagBudget0553.js`
  — current six-row C1 selection, historical RACON-only reference and C2 offer.
- `frontend/src/project0553/data/addvalueB14Insurance0553.js` —
  selected allowance, current insurer quote null and coverage confirmation flags.
- `frontend/src/project0553/OfficialUsdRelease0553.jsx` and
  `ReleaseCustomerWorkbook0553.jsx` — exact snapshot versus live-detail views.

This follow-up reads canonical snapshots and code at the specified revision,
compares policy semantics and checks illustrative arithmetic. It is not a
whole-corpus engineering audit, insurer/OEM approval, security certification or
new Customer Release. Existing PR56 runtime/build tests remain separately
documented in its implementation guide. This update changes documentation only.

See [Common / Generic Bidding Principles](../../architecture/COMMON_BIDDING_PRINCIPLES.md)
for the reusable rules and [0553 implementation guide](../../handoff/pj2608-0553/20261104_COMMON_QUOTATION_BASELINE.md)
for the exact storage/workflow limits.
