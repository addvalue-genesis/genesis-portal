# PJ2608-0553 — B1 NEW BASE ONLY / NO LEGACY ENGINEERING PRICE
Date: 2026-10-19

## Management decision (supersedes Handoff 44 price proposal)
**B1 current Working SELL is calculated ONLY from the newly constructed role-based and project-expense ledger.**
- Never carry THB 510,630.26 old Engineering activity sell into new B1.
- Never carry THB 113,400 old 48-MH / USD600-day PM allowance into new B1.
- Do not calculate B1 as THB 510,630.26 + THB 211,600, or THB 624,030.26 + any uplift.
- The original customer B1 line remains **Engineering and design — 1 Lot** and is not renamed by the internal CFO cost categories.
- ADDVALUE uses B1.1–B1.8 as the internal residual WBS project management, administration, accounting, procurement, lawful coordination and general expenses pool.

## New current B1 working budget (THB)
- New multi-role staff: **242 MH across 41 role allocations**, seven office resource roles, planning employer-loaded Working Cost **80,400** / Working Sell **100,500**.
- New project-specific non-labor Base expense Working Cost **101,000** / Working Sell **111,100**.
- **B1 Current Base Working Cost (planning): 181,400.00** (NOT verified payroll/actual cost).
- **B1 Current Base Working Sell: 211,600.00** (canonical current 10.2 and 10.5).
- Conditional legal/local consultant + statutory fee Working Cost **47,000.00** / Working Sell **51,700.00** (EXCLUDED FROM BASE, payer and source verification required).
- No general overhead or old engineering calibration factor is applied to these fresh resource and allowance line items. Labor sell factor is planning /0.80; nonlabor cost ×1.10; both pending CFO review.
- Verified Direct Cost, customer-released sell and actual supplier/payroll cost remain NULL.

## Engineering scope owner screening
Rev05 had 27 old Engineering activities / 964 historical role MH. The 27 **activity titles only** are now preserved in `engineeringScopeReview`; **all 27 quantities and prices are NULL; every record nonposting**. Screen each technical task (RF/Link Budget, NMS/IP Interface, DMR Talk Groups, Ex Interface, RACON hazardous/marine interface, requirement/design-basis review) against:
1. MGW OEM detailed design / included equipment Part A;
2. B2 VDRL final documentation and drawing production/revision;
3. B3 FAT/SAT/ITP preparation/execution;
4. Unique ADDVALUE technical design deliverables under customer B1.
Where ADDVALUE independently owns a required Engineering task, derive NEW resource hours and NEW role salary/cost rates with the approved deliverable, not historical 964 MH allocation or historical price. For current budget it remains an **unpriced engineering risk/coverage item**, not a claimed complete B1 Engineering tender price.

## Project reconciliation
| Code | Current Base Working Sell THB |
|---|---:|
| B1 new role project support | 211,600.00 |
| B2 VDRL / Documentation | 580,000.00 |
| B3 MGW FAT Witness + Offshore SAT/SIT + temporary VeEX | 2,443,400.00 |
| B9 Specialist Field Assistance Base | 0.00 |
| **Part B Base sum of all current owner codes** | **4,187,590.69** |

B9 7-day Yard Specialist remains THB 233,600 **conditional**, excluded from Part B base.
No B1.6/B1.7 conditional fees, C1/C2 optional spares or old B1 engineering value enter Part B Base.
The lower Part B amount is caused by the management decision to remove old B1 Engineering sell and old 48-MH PM allowance, **not** by removing B2, B3, B5, B6, B7 or B9 owner scope.

## Source/code change architecture
- `frontend/src/project0553/data/b1ProjectSupportBudget0553.js`: sole B1 canonical active price, 8 internal cost accounts and 27 old activity names as unpriced review.
- `frontend/src/project0553/data/bcTurnkeyWorkingCost0553.js`: B1 now reads `selectB1ProjectSupportBudget0553().baseWorkingSellTHB`; old `selectB1ActivityWorkingSell0553` import/execution removed. Direct B/C current sum reconciled from current owner-coded working sell lines, not old WBS subtotal arithmetic.
- `frontend/src/project0553/data/revKAbcOwnershipControl0553.js`: 41 B1 role lines and 9 expense allowances in CFO read-only bridge, old Engineering titles nonposting.
- `frontend/src/project0553/B1RevKMilestoneBudget0553.jsx`: current role-based B1 Base THB211600 and 27 Engineering scope owner review rows; old Engineering/PM sell omitted.
- `frontend/src/project0553/BcWorkCostLines0553.jsx`: new B1 roles and expenses displayed instead of legacy 27 historical engineering priced work lines, conditional labeled excluded.
- `frontend/src/project0553/BcCostEvidenceDetail0553.jsx`: hides old Engineering historical amount table for B1; kept separate audit data model.
- Validator expected sums and B1 scopes updated across Rev.K ABC, 10.2, 10.5, current commercial, spares, B1 role-plan, B1/B2, B3, B5, SAT strategy checks.
- `frontend/src/project0553/data/partBCWorkingWbs0553.js`, `bcCostEvidenceDerivation0553.js`: historical immutable audit only; not current B1 price inputs.

## Verification
Isolated actual-sources JS evaluation performed after code changes on 2026-10-19:
`selectB1ProjectSupportBudget0553()` -> B1 Cost 181400, Sell 211600, 27 Engineering titles unpriced, conditional 51700.
`selectRevKAbcOwnershipControl0553({...})` -> Part B Base 4187590.69, B1+B3+B9 2655000, 41 B1 role events, no historical B1 Engineering carryforward.
**Full npm/webpack build cannot be run on user's Windows local worktree by the assistant** and must be validated locally.

## Git and user validation
Repository: `addvalue-genesis/genesis-portal`
Branch: `feat/pj2608-0553-sat-tools-compliance-revp-20261018`
User's worktree tracks remote: `work/pj2608-0553-b3-fat-20261018`.
Do NOT pull when uncommitted local edits are present; preserve package-lock stash. Commands:
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553
git status
git pull --ff-only
cd frontend
npm run validate:0553-b1-role-support-plan
npm run validate:0553-revk-abc-ownership
npm run build
npm start
```
