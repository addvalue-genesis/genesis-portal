# ADR 65 — B9 Specialist Assistance must be priced in Customer Release
**Date:** 2026-10-21 (Asia/Bangkok)  
**Status:** Selected B9 Working SELL source updated; customer submission **NOT ISSUED / HOLD**  
**Decision owner:** Project Owner — "มันต้องมีเสนอราคา B9 ที่ release" (B9 is a priced 1 LS scope line)

## Supersedes ADR 64 D-64.1 (B9 only)
Previous selector retained THB233,600 as `conditionalYardSellTHB`, but returned B9 `b9BaseWorkingSellTHB=0`; therefore Release and native G32 were zero. This is **not** the intended commercial presentation: the original customer `4-Scope of Supply.xlsx` includes B9 "Specialist field assistance", **1 Lot**, and management requires a price in the Release preview.

**Decision:** Select **B9 1 LS Working SELL THB233,600** in customer Base Part B. This is the **existing** source-backed seven-working-day Senior Telecom Systems Integration Engineer package, including two travel working days, allowances for airfare/accommodation/visa/insurance/local movements. No new chargeable work, duplicate trip, or second option is created.

**Different meanings of "conditional":**
- **Commercial scope:** customer B9 1 LS is **priced and included ONCE** in Base Working SELL, in 10.3 Release Preview and in original native workbook F32/G32.
- **Operational execution:** actual Yard attendance/mobilization remains **conditional upon written JUTAL/SAMTEL call-out / agreed RACI**, as before. This does not mean customer quotation value should be zero.
- `conditionalYardSellTHB=233600` is **source evidence of that SAME B9 quotation** and MUST NOT be added again as a separate option.
- **Pricing state:** still provisional, not approved, not customer-issued, actual Direct Cost **NULL**. ADDVALUE labour/trip SELL already includes allowances; no additional MGW 20+5+5 applied.

## Source chain / numerical contract
`b9ChinaWorkingBudget0553.js` existing 8 Yard expense IDs → `bcTurnkeyWorkingCost0553.js` B9 selected `workingSellTHB=233600` → `releaseCommercialModel0553.js::priceBWorkingSell0553()` → `scopePartBcReadModel0553.js` → `ReleaseCustomerWorkbook0553.jsx` → `nativeWorkingDraft0553.js` original F32/G32.

| Line | Before | After |
|---|---:|---:|
| B3 selected Working SELL | THB2,750,525 | **unchanged** |
| B8 selected Working SELL | THB30,000 | **unchanged** |
| B9 selected Working SELL | THB0 | **THB233,600** |
| Part B selected Working SELL | THB4,151,836.82 | **THB4,385,436.82** |
| B9 SAMTEL deduction (normal Part B 5%) | THB0 | THB11,680 |
| B9 ADDVALUE receivable before cost | THB0 | THB221,920 |
| B9 actual Direct Cost | NULL | **NULL** |

MGW SERV-2/4 USD7,500 purchased FAT is in B3 only, not B9. No additional iFAT customer line. B9 quoted price is not ADDVALUE profit, and receivable less future actual cost is not established.

## Integration details and approvals
- Source file preserves original `B9-YARD-*` IDs, eight Qty × Working SELL rows and source financial identities. Their `optional` Boolean describes **conditional execution**, not addition of a second commercial option.
- `revKAbcOwnershipControl0553.js` audits the same B9 source as **INCLUDED_IN_CANONICAL_B9_1LS**; keeps `postedWorkingSellDeltaTHB=0` because no secondary posting occurs.
- 10.3 B9 selected `customerSellTHB=233600`, `executionConditional:true`, `conditionalOptionIncludedInBase:true`; B9 normal Part B SAMTEL 5% deduction THB11,680, ADDVALUE receivable THB221,920; still no Direct Cost/profit.
- 10.4 active read parity verifies 10.2 B9 ↔ 10.3 B9 ↔ 10.5 B9 ↔ original workbook `G32`; `estimateLineIds` and native actual-binary style/formula checks remain open.
- Native Excel `F32/G32` is fed from existing `model.b` B9 selected price. Customer text from original template. **No workbook template/style/extra dashboard/module added.**
- Test expectations and existing UI labels updated to differentiate **quoted Base** vs **conditional field attendance**.
- Future revisions to the staffing/travel package, if desired, must be source-level approved changes; cannot retrospectively label THB233600 as verified actual cost.

**Gate remains:** Do not merge PR#30, issue a proposal, or claim Full Build PASS until actual Node/Babel/Webpack tests, original native workbook reconciliation and management approval are completed. This ADR authorizes B9 selected **Working SELL** only, not customer issuance.
