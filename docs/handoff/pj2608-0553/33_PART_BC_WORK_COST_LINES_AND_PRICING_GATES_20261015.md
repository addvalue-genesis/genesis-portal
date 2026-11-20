# PJ2608-0553 — Part B/C Working Cost-Line Ledger & Engineering-to-Commercial Gates
**Date:** 2026-10-15 (Thailand)  
**Current branch:** `fix/pj2608-0553-scope-mgw-r2-integrated-20261015`  
**Status:** Working Cost Drivers + WBS SELL evidence traced; **CURRENT DIRECT COST NOT ESTABLISHED** / no customer release.

## Non-negotiable source-of-truth controls
1. `10.1 / bid.budget.bom.system-location-mto` owns physical Part A Equipment/Bulk Cost, allocated by system/location/TAG; Part A approved working baseline Rev02 remains unchanged.
2. `10.2 / bid.budget.working.bc` owns Part B1–B14 + optional Part C1/C2 *working* requirements, Engineering Work/Cost Drivers and WBS Working SELL. Sub-module `bid.budget.working.bc.cost-lines` records individual source-linked resources. It **does not** authorize replacing actual payroll/subcontract/freight/OEM Direct Cost with WBS SELL.
3. `10.3` pricing, `10.4` bid mapping, `10.5` read-only Customer Scope, `10.6` export. Never sum Part A Direct COST and B Working SELL as “Total Project Direct Cost”. Customer Rev08 USD/THB prices are historical only.
4. Working SELL is source-backed for B1 THB510,000, B2 THB580,000, B3 THB2,109,600, B8 THB30,000, B9 THB574,560: **known subtotal THB3,804,160**, not complete B estimate. Other B/C SELL and cost rates remain unestablished, not zero.
5. **Factory testing:** OEM/manufacturer tests at manufacturer's facility, calibrated equipment, preserve client notice/ITP requirements; management-selected combined integrated FAT at SAMTEL Bangkok after OEM tests, but this cannot automatically waive factory FAT. China Partner MGW advisory only until separately contracted.
6. **Licensing:** any PTTEPI/JUTAL/SAMTEL representation to file import/operational radio licensing requires written authority and competent local importer/exporter. 4–5 months Myanmar telecom import permit guide is a *lead-time*, not a fee/rate.
7. **Physical spares:** reviewer comments of MR0001–MR0004 say supply actual commissioning spares/tools, not just a list. SPIR, OEM SKU, actual Qty/price, source inclusion must be verified before posting to B10/B11. C1/C2 remain optional.
8. **Freight:** Annex4/Annex4-2 mark/packing/inspection/release/14-day pre-alert requirements; B6 spans four MR cargo paths through Bangkok to JUTAL Nantong and onward handover. Legacy CIF port versus possible DDP yard boundary must be clarified with SAMTEL/JUTAL; do not invent broker/tax rate or destination address.
9. **Change control:** Annex6 change requests do not create approved customer variation money; record owner, technical/Schedule impact and signed acceptance.
10. **O&G engineering 01–08:** every Cost Work Object links original requirement, technical constraints, physical/resource Qty, actual rate evidence, single Cost Owner and Risk/Approval gates.

## New code / work product
| File / Module | Role |
|---|---|
| `frontend/src/project0553/data/bcExecutionComplianceAudit0553.js` | 40 numbered AUD requirements / 15 sourced files, BOD/SPE/DTS/MR reviewer notes, vendor/supplier logistics, permit, FAT/POB/SIMOPS gates |
| `frontend/src/project0553/data/bcWorkCostLines0553.js` | 105 Working Cost-Line rows: **65 physical WBS/resource work objects + 40 non-additive audit clauses**; all B1–B14 & C1/C2 have audit ownership; B1/B2/B3/B6/B9/B10/B11 have detailed first-priority work objects |
| `frontend/src/project0553/data/bcMobDemobEconomics0553.js` | Parametric cost comparison requires **verified** company cost rates, travel rates, all seven sites and approved HUC/POB/SIMOPS; no default posted cost |
| `frontend/src/project0553/data/bcTurnkeyWorkingCost0553.js` | Canonical cost contract exposes `workCostLines`, `workCostLineCount`, `workCostLineAuditCount`; existing cost and Working SELL untouched |
| `frontend/src/project0553/BcWorkCostLines0553.jsx` | 10.2 line-level Module IDs, COPY, Quantity, per-role MH, working SELL rates, source, owner and Cost Gaps |
| `frontend/src/project0553/BcExecutionComplianceAudit0553.jsx` | UI for obligations, offshore MOB source math and economic scenario gate |
| `frontend/scripts/validate-0553-bc-working-cost-lines.cjs` | Regression for 105 IDs, 40 clauses non-additive, B1 964 MH, B2 143 rows, B3 78 MD, B6 routing, B9 quantity and rate |
| `frontend/scripts/validate-0553-bc-execution-compliance-audit.cjs` | Regression source, permissions, mobilization, tools and counterfactual scenario guards |

## Actual source-derived economic / effort basis
- **B1:** 27 `08_B1_ENGINEERING` work objects = Common 188 MH + MR1 264 MH + MR2 216 MH + MR3 180 MH + MR4 116 MH = **964 MH**. Historical WBS cost proxy THB180,892.75 remains classified **Historical Proxy**, never current approved payroll rate. Quoted source Working SELL THB510,000.
- **B2:** 09_B2_DOCUMENTATION = MR1 37 + MR2 36 + MR3 35 + MR4 35 = **143 source VDRL rows**; 38 unique document titles. Source Working SELL THB580,000. VDRL source rows are not 143 independent newly authored documents.
- **B3 Thailand FAT:** 8 team-days × (Senior THB12,000/day + Engineer THB6,000/day) = **THB144,000 source Working SELL**. This is SELL and not current payroll expense. Approved *location*: SAMTEL Bangkok. Exact test facility/crew/schedule/customer FAT signoff not yet verified.
- **B3 Offshore active WBS:** `23_SAT_TRIP_VALIDATION` 5 physical trips / 39 Team-days / 78 MD at USD800/MD and planning FX THB31.5 = **THB1,965,600 Working SELL**. Site effort: ZWP20 7, ZWP21 7, ZWP22 7, ZWP23 5, Brownfield ZPQ→ZWP8→ZWP11 13. Breakdown **26 combined SAT/COMM technical + 10 already-included MOB/DEMOB (5 trips × 1+1) + 2 final integration + 1 Brownfield transfer = 39**. The separate older 44-day/88-MD scheme was superseded. No double-count MOB. **B3 total: THB2,109,600 WBS Working SELL**. Offshore actual trip count, SAT/COMM split, marine transfer/POB/SIMOPS not approved.
- **B6:** four MR freight routes Vendor → SAMTEL Bangkok FAT → JUTAL Nantong; China-origin MR0002 needs China→Thailand→China transport and export/re-import feasibility. No approved forwarding/broker/customs/permit cost yet.
- **B9:** 12 **Team-days** × THB47,880/team-day = **THB574,560 Working SELL**; **24 MD** is an included staff-resource driver and must not be multiplied again by the two-person team-day rate. Airfare/hotel/local transport are actual/reimbursable unless contracted included.
- **B10:** physical SPIR by MR0001–4, OEM Qty/SKU/lead time/price and Part A inclusion audit pending.
- **B11:** Annex8 telecom tool minima (SCADA radio config, SCADA NMS, TETRA voice gateway, RACON programming, RACON charge kit). TETRA versus current DMR applicability must be confirmed; programming entitlement and spare kits must not be duplicated with Part A.

## Next step — Direct Cost gate
For every actual work object requiring payment, collect a controlled `rateEvidence` record (source/dated quotation, native currency, controlled FX only when needed, commercial owner, authorized representative, Qty/unit/technical approval, supplier inclusion proof). Only then may an internal-only controlled Direct Cost calculation be performed. Never assume null rate = 0. Keep historical Rev08 audit and WBS SELL apart. After all needed lines reconcile with source, apply 10.3 risk + margin / 10.4 mapping; 10.5 remains display-only.

**Do not claim npm build passed** without actual user/local or CI result. Latest GitHub work contains runtime-readmodel checks and regression scripts; user must execute `npm run validate:0553-bc-working-cost-lines`, `npm run validate:0553-bc-execution-compliance-audit`, then `npm run build`.
