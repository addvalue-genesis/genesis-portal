# PJ2608-0553 — B1 Role-Based Project Management & General Expenses | 2026-10-19

## Purpose and contract boundary
The customer's native `4-Scope of Supply.xlsx` Part B B1 is **Engineering and design / 1 Lot**. Retain customer text and form. Internal ADDVALUE uses **B1.1–B1.8** as a residual allocation for specific PM, admin, accounting, procurement, regulatory and other project-specific indirect/support expenses that are not physically and uniquely owned by Part A/B2–B14/C. These internal expenses are NOT a separate customer bid code, verified payroll Direct Cost, or a pre-approved customer SELL.

## Implementation
- `frontend/src/project0553/data/b1ProjectSupportBudget0553.js`: role-based B1 working budget, 19 K00–K18 trace points, 12 unique coordination charge events (K03–K07 and K08–K11 group once), 41 distinct labor allocations / 242 MH, 8 cost accounts and nine non-labor allowances.
- `frontend/src/project0553/B1RevKMilestoneBudget0553.jsx`: replaces old single USD600/day PM edit panel with Thai THB role rates, B1.1–B1.8 rollup, unique expense IDs, Qty, cost rate, Working Cost, Working SELL, conditional rows, K milestones, and separate execution owners.
- `frontend/src/project0553/data/bcTurnkeyWorkingCost0553.js`: attaches new `b1SupportPlanningBudget` under canonical B1 as nonposting internal estimate. **Does not overwrite** current `workingSellTHB` before CFO allocation/overhead approval.
- `frontend/src/project0553/BcCostEvidenceDetail0553.jsx`: shows proposed B1 scenario versus existing canonical B1 and keeps 34 original expense provenance objects nonposting.
- `frontend/scripts/validate-0553-b1-role-support-plan.cjs` registered under `npm run validate:0553-b1-role-support-plan` and in `npm run build`.
- K01 original source direct physical owner corrected to **B3 FAT witness** (MGW OEM execution Part A), no B9 FAT.

## Planning salary role assumptions, Thailand 2026, THB / month
| Resource | Monthly salary THB |
|---|---:|
| Project Manager | 90,000 |
| Project Coordinator | 42,000 |
| Administration Officer | 25,000 |
| Accountant / Finance Officer | 35,000 |
| Procurement Officer | 38,000 |
| Regulatory Coordinator | 55,000 |
| Finance Manager | 85,000 |

Working Cost/MH = monthly salary × 1.20 employer burden / 176 planned working MH per month.
Labor Working Sell = loaded planned labor cost / 0.80 (provisional target 20% gross margin).
Non-labor Working Sell = 1.10 × planning expense (provisional handling uplift). No separate project general overhead factor is applied on top of this model. Rates are working assumptions from 2026 indicative Thailand salary data, **not** ADDVALUE actual payroll.

## B1.1–B1.8 base and conditional model
| Account | Base Working Cost THB | Base Working Sell THB | Conditional Sell THB |
|---|---:|---:|---:|
| B1.1 Project Management & Coordination | 59,836.36 | 74,795.47 | 0 |
| B1.2 Business Meetings & Representation | 10,000.00 | 11,000.00 | 0 |
| B1.3 Management Travel & Accommodation | 60,800.00 | 66,880.00 | 0 |
| B1.4 Admin / Procurement / Accounting | 31,063.64 | 36,579.53 | 0 |
| B1.5 Regulatory Coordination | 11,700.00 | 13,545.00 | 0 |
| B1.6 Legal & Local Consultant | 0 | 0 | 38,500.00 |
| B1.7 Official Licence / Permit Fees | 0 | 0 | 13,200.00 |
| B1.8 Other Project Expenses | 8,000.00 | 8,800.00 | 0 |
| **TOTAL** | **181,400.00** | **211,600.00** | **51,700.00** |

B1.2 meetings = 4 × 2,500; B1.3 management-only airfare 2 × 18,000, hotel 6 × 2,800, transport 2 × 4,000; B1.4 office 6 × 2,500 month allowance (not factual project duration); B1.5 application translation/courier 4 × 1,800; B1.6 conditional consultant 1 × 35,000; B1.7 conditional official fees 2 × 6,000; B1.8 miscellaneous 1 × 8,000.

### Reconciliation and decision gate
- B1 current canonical: **THB 624,030.26**, consisting of Engineering 27 WBS/964 MH THB 510,630.26 plus *old single-USD600/day 48-MH PM* THB 113,400. This is legacy active baseline, not cost evidence for Admin/Accounting.
- Proposed replacement B1 Base Working Sell: **510,630.26 + 211,600.00 = THB 722,230.26**.
- Proposed uplift vs old canonical: **THB 98,200.00**, by replacing legacy PM allowance; never add THB 211,600 on top of old THB 624,030.26.
- If approved later, Part B Base would move from **THB 4,600,020.95** to **THB 4,698,220.95**; this has **not** been posted.
- Conditional B1 Legal/Official fees **THB 47,000** planning cost / **THB 51,700** sell must remain outside base until responsible payer and written lawful cost evidence are established.
- Planning `workingCostTHB` is not actual verified Direct Cost; `directCostTHB` remains null. No customer release.
- No FAT witness/labor/flights from B3, VDRL B2, OEM item Part A, Packing B5, Freight/customs brokerage B6, Vendor storage B7, or optional Yard Specialist B9 duplicates.
- The existing role engineering factor ~2.8228 from Rev05 is historical SELL calibration and may include overhead; CFO must verify no general overhead twice before changing canonical 10.2/B1.
- No unofficial fee, facilitation payment or unverified commission.

## Test and pull
On worktree `J:\DEV\GitHub\addvalue-genesis\genesis-portal-0553` local branch tracking origin/feat/...:
```powershell
git status
git pull --ff-only
cd frontend
npm run validate:0553-b1-role-support-plan
npm run build
npm start
```
`npm run build` was **not run on the user's Windows host by the assistant**. Isolated JavaScript calculations using original 12 charge-event stage geometry were checked and reconciled: 242 MH, labor cost 80,400, 8 account cost 181,400 and base sell 211,600. The customer-visible acceptance still requires user local validation and review.
