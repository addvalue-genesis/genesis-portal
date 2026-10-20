# PJ2608-0553 / 10.2 B3 — Canonical Dependencies and Downstream Consumers
Date: 2026-10-20
Branch: `fix/pj2608-0553-b3-price-breakdown-module-ids-20261020`
Status: CODE-BASED DEPENDENCY READ / STATIC CHECK; runtime new build pending local execution.
Policy: distinguish SOURCE / CANONICAL PRICE OWNER / READ-ONLY RENDER / DOWNSTREAM PROJECTION.

## A. Actual call chain
1. `src/pages/PJ26080553.jsx` mounts `CommercialWorkspace0553` when `tab==="budget"`.
2. `CommercialWorkspace.jsx` calls `selectBcTurnkeyWorkingCost0553()` and selects `bcWorking.byCode.B3`. The selected B3 row passes as prop `workingRow` to `BcCostEvidenceDetail0553`; `BcWorkCostLines0553` receives `selectedCode` separately as audit-only cost lines.
3. `data/bcTurnkeyWorkingCost0553.js` is the **only active B3 Working SELL owner**:
    - `selectB3FortyDayWorkingSell0553()` returns THB2,046,000, from 40 productive offshore work team-days x two experts × USD800/person/day at FX31.5 = THB2,016,000 plus THB30,000 VeEX MX100+ 30-day rental.
    - `selectB9ChinaWorkingBudget0553()` returns `fatWorkingSellTHB=397400` for eight B3-owned MGW FAT witness expenses (staff, travel, accommodations, visa, insurance). It separately owns `conditionalYardSellTHB=233600` under B9 and `b9BaseWorkingSellTHB=0`, not included in B3 base.
    - `B3.workingSellTHB = round(b3Current.workingSellTHB + chinaB9.fatWorkingSellTHB) = 2443400`.
    - `directCostTHB:null` stays unverified. `B3_LEGACY_BKK_FAT_OWNER_TRANSFER` and `partBCWorkingWbs0553.js` are historical Rev05 evidence, not active B3 pricing.
4. `BcCostEvidenceDetail0553.jsx` hosts, in order:
    - `B3WorkingSellBreakdown0553` → `selectB3WorkingSellBreakdown0553(workingRow)`: one **read-only price decomposition**, no independent totals.
    - `B3RequirementWbsTrace0553` → `selectB3RequirementWbsTrace0553()`: 19 BOD/SPE/DTS/MR/Rev.K obligations, nine B3 owners and ten other owners, **every row price null and posting blocked**.
    - `B3SiteMrSatCoverage0553` → `selectB3SiteMrSatCoverage0553()`: 7 locations × 19 Site/MR groups + 2 SIT/Punch groups = 21 Test IDs, with **no per-test extra sell** and 40-day timebox based on same B3 source.
    - `B9ChinaBudgetDetail0553` with `selectedOwner="B3"`: FAT expense source detail only. It filters exactly eight B3-owned source rows.
    - `B3EquationAudit0553` appears separately through `BcWorkCostLines0553` (and 02 Engineering tab); this is historical Rev05 Bangkok FAT/39-day proof for audit only, not active price.
5. Read-only consumers of the canonical B3 amount:
    - `data/scopePartBcReadModel0553.js::selectScopePartBcWorking0553()` for 10.5 / `bid.budget.scope.b3`, `ScopeSheetsDetail0553` and `BudgetaryWorkbookPreview0553`.
    - `data/scopeBcPriceAudit0553.js::selectScopeBcPriceAudit0553()` for 10.5 historical-vs-current nonposting comparison.
    - `data/releaseCommercialModel0553.js::buildReleaseCommercialModel0553()` for 10.3 CFO and native customer-format preview. For Part B it calls `priceBWorkingSell0553` on canonical working sell: no 30% equipment-style cost markup on B3; 5% SAMTEL deduction is a commercial internal calculation, not a second B3 cost.
    - The 10.3 page receives model from `CommercialWorkspace.jsx`; no 10.3 component is allowed to change B3 source.
6. `data/bcWorkCostLines0553.js`, `data/bcCostEvidenceDerivation0553.js` and `B3EquationAudit0553.jsx` preserve Rev05 WBS source amounts (THB2,109,600; BKK FAT THB144,000 + 39 offshore team-days THB1,965,600) **only for traceability**. This historical engine must not be confused with Canonical Rev.K B3 THB2,443,400. Some historic metadata refers to Bangkok/Nantong; preserve it as historical and do not silently migrate it.

## B. Visible module identities
| Module ID | Source | Role and treatment |
|---|---|---|
| `bid.budget.working.bc.b3` | `bcTurnkeyWorkingCost0553.js` | Only B3 working-sell posting owner |
| `bid.budget.working.bc.b3.working-sell-breakdown` | New B3 read model | Display-only THB2,016,000+30,000+397,400 |
| `bid.budget.working.bc.b3.requirement-crosswalk` | `B3RequirementWbsTrace0553.jsx` | UI parent; Copy ID displayed |
| `bid.budget.working.bc.b3.requirement-trace` | `b3RequirementWbsTrace0553.js` | 19 source obligations, zero price |
| `bid.budget.working.bc.b3.site-mr-sat-matrix` | `b3SiteMrSatCoverage0553.js` | 21 site-MR test groups, 7 sites, zero extra sell |
| `bid.budget.working.bc.b3.revk-china-budget` | `B9ChinaBudgetDetail0553.jsx` | Existing canonical China FAT detail, not an additional B3 sell |
| `bid.budget.working.bc.cost-lines` | `BcWorkCostLines0553.jsx` | Evidence/history and physical drivers; never sum as current price twice |
| `bid.budget.scope.b3` | 10.5 scope projection | Downstream mirror of canonical B3 |
| `bid.budget.pricing.cfo` | 10.3 CFO | Commercial transformation of B3 working sell, not new B3 cost |
| `bid.budget.pricing.release.preview` | 10.3 pre-export staging | HOLD until user-approved release and native workbook fidelity |

## C. Important display-ID correction
The new breakdown mirrors source FAT expenses that are also shown by `B9ChinaBudgetDetail0553`. Both show the original canonical ID in `ComponentCopyId`, but the B3 display preview rows now have **separate presentation `data-component-key`** names:
- `bid.budget.working.bc.b3.working-sell-breakdown.component-preview.<group>`
- `bid.budget.working.bc.b3.working-sell-breakdown.fat-expense-preview.<expense>`
This avoids duplicate DOM anchor matches during navigation without changing the source Cost Owner ID or making another price posting. The original FAT expense ID is owned by its existing expense detail table.

## D. Required validation gates
`npm run validate:0553-b3-breakdown-module-ids`; `npm run validate:0553-b3-requirement-wbs`; `npm run validate:0553-b3-site-mr-sat`; `npm run build`.
The user has confirmed first three passes **before** the latest display-ID and historical label fixes; rerun after checkout. Browser interaction/visual acceptance remains separate, as automated SSR cannot simulate B3 click expand or validate print output.
