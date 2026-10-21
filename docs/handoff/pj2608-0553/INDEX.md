# PJ2608-0553 | Architecture & Decision Index (10.1–10.5)

**Updated:** 2026-10-21 ICT · **Latest B6 route decision: ADR-67; B9 remains ADR-65** · **Repository:** `addvalue-genesis/genesis-portal`  
**Integration branch:** `integrate/pj2608-0553-mgw-fat-financial-identity-20261021`  
**Draft PR:** #30 · **Customer Release:** HOLD / NOT ISSUED.

## Navigation / authoritative dependency spine

| Workflow | Technical module / actual implementation | Source authority | Downstream | Posting class |
|---|---|---|---|---|
| 10.1 A | `bid.budget.bom.system-location-mto` / `data/workingBomAggregation0553.js` | Original MR0001–0004 TAG, MTO, vendor costs/FX | 10.3 A1–A4; 10.5; native A row 8–11 | Working, partial |
| 10.1 A5 | `data/customerEquipmentDisplay0553.js` + `data/a5BulkAttribution0553.js` | A1 bulk transfer proof | Internal A1/A5 display reconciliation | NON-ADDITIVE A1 reclassification |
| 10.2 B/C | `bid.budget.working.bc` / `data/bcTurnkeyWorkingCost0553.js::selectBcTurnkeyWorkingCost0553` | selected `rows[].workingSellTHB`; OEM quote/source WBS | 10.3 B/C, 10.5, native Excel | **SINGLE SELECTED WS SOURCE** |
| 10.2 MGW FAT | `data/mgwP26058R2Cover20261020.js` → `data/b3MgwPurchasedFatWorkingSell0553.js` | VQ-MGW SERV-2/4 (USD7500) | B3 purchased WS THB307125 once | VQ quoted cost ≠ actual paid |
| 10.2 ADDVALUE FAT | `data/b9ChinaWorkingBudget0553.js` | eight original B3 expense source IDs, six-day witness | B3 current THB397400 | WS only, direct cost NULL |
| 10.2 B9 Yard | same China budget owner-separated B9 IDs | 7 Yard days + 2 travel days, separate call-out | B9 quoted Base THB233600 | Conditional EXECUTION; no separate option or actual cost |
| 10.2 B3 SAT | `data/b3FortyDayWorkingSell0553.js`; `data/b3SiteMrSatCoverage0553.js` | selected 40 team-day / 21 Test IDs | B3 selected offshore THB2016000 + VeEX THB30000 | Site MR Test IDs NONPOSTING |
| 10.2 scenarios | `data/b3LeanSatScenario0553.js`, `data/b3B8FiveDaySourceAllocation0553.js` | prior SAT lean branch + 5-day proposed activities | `canonical.scenarioAudits` | SC / audit ONLY |
| 10.4 | `estimateToBidMapping.js` and `commercialWorkbookControl.js` | Original customer workbook destination registry | `auditCurrentCustomerProjection0553` read parity | **Mapping validation, NOT pricing transformation** |
| 10.3 | `data/releaseCommercialModel0553.js` | **direct import of 10.1 BOM + 10.2 canonical** | CFO / Release preview + `ReleaseCustomerWorkbook0553.jsx` | gated customer preview, HOLD |
| 10.5 | `data/scopePartBcReadModel0553.js` | **direct import of 10.2 canonical** | `ScopeSheetsDetail0553.jsx` | read-only |
| Native 6 sheets | `nativeWorkingDraft0553.js` | 10.3 release preview + original browser-selected `4-Scope of Supply.xlsx` | original-style working draft only | **NOT FOR CUSTOMER SUBMISSION** |

### Native Excel mapping contract

- **Original six sheets (unchanged):** Scope of supply, B10 CommSpares, B11 SpecialTool, B13 Consumerables, C1 CapitalSpares, C2 2Y-Spares.
- Main Part B source entries **B1–B14 → workbook rows 24–37**. B3 = F26/G26, B8 = F31/G31, B9 = F32/G32 (specific annex-linked F cells preserved by original native writer). Amounts originate from 10.3 B rows, not from a UI input or historical Rev08.
- Annex detail B10/B11/B13/C1/C2 uses 10.3 `annexModels` sourced from 10.2 working schedules. Original 13-row capacity and formulas must be checked against the **actual binary XLSX**; no native workbook binary has been established as tested at this integration HEAD.
- A1–A4 → grouped MR rows 8–11. **A5 is nonadditive display reclassification** from A1 physical bulk, not a fifth separately added native MR priced row. Purchaser acceptance of grouped TAG line format remains OPEN.
- Native labels for B1–B14/C1/C2 must use `data/officialWorkbookTemplate0553.js`; Rev08 description may only be a historical fallback, never price authority.

## Module contracts / invariant checks

1. `SOW` customer code, `VQ` original quotation, `IC` activity/expense with actual Direct Cost **NULL**, `WS` selected internal Working SELL, `CP` not issued, `SC` scenario nonposting, `AU` audit nonposting.
2. `selectBcTurnkeyWorkingCost0553()` owns current B3=THB2750525, B8=THB30000, B9=THB233600, Part B Base=THB4385436.82. No automatic scenario promotion, no ERP posting.
3. MGW Purchased quote SERV-2 USD5000 + SERV-4 USD2500 quoted THB236250; WS THB307125 using 20+5+5 **once**. No separate customer iFAT line; internal iFAT remains traceable as vendor identity under customer B3 FAT.
4. `priceBWorkingSell0553` deducts SAMTEL 5% on ordinary B3 only, preserves vendor purchased SAMTEL 20% on quoted cost and excludes purchased portion from second 5% deduction. Receivable is not profit.
5. Scenario selector(s) are accessible under `canonical.scenarioAudits`; they are not included in `knownWorkingSellTHB`, C options, Release or native XLSX.
6. `auditCurrentCustomerProjection0553` checks 21 A/B/C targets for current value parity. Existing `validateEstimateToBid0553` remains an estimate-line allocation **HOLD**; passing projection parity is not source-cost or release certification.
7. No new Dashboard/Module, no change to B1–B14/C1–C2 IDs; exceptions can be exposed through **existing** Release Export Checks.

## Additional B3/B6/B7 scope and market audit (ADR-66)

- B3 working display **Inspection / Site Survey / FAT / SAT**: `data/b3SiteSurveyScope0553.js`, 7 unique locations, survey effort/cost NULL. B3 selected THB2750525 unchanged; native customer B3 wording original.
- B6 earlier all-Thailand **four-cabinet comparison only**: `data/b6Mr0001ChinaInboundScenario0553.js`, narrow pre-award THB42797–72372 **NONPOSTING**. Outbound MGW SERV-5 USD2500 = THB78750 quoted in original MGW cover, no duplicate posting. B6 selected THB307584 unchanged; actual net route difference and customs costs NULL.
- B7 `data/b7ThreeMonthStorageEvidence0553.js`: customer requires **3 months FREE**, MGW quote does NOT explicitly price or confirm the three-month term. Public 2026 rate scenario four pallets × 90d ≈ THB4527–8148.60 bare space; user prior THB30000/month ×3 = THB90000 sensitivity, extra THB60000 scenario-only; selected B7 THB30000 for 1-month management allowance unchanged.
- New automated contract `npm run validate:0553-b3-survey-b6-inbound-b7-storage` is in the frontend build chain; full Node/Webpack run **not confirmed**. No new UI module, price ledger, or customer-native cell overwrite.

## Current 4-MR shipment strategy (ADR-67, supersedes ADR-66 B6 routing assumption)

- Preferred `SC-B6-B-HYBRID-MGW` under existing `byCode.B6.b6FourMrRoutingEvidence`: **NextG IDU/ODU direct to MGW Nantong**, **Thai-built Enclosure+Cisco 4 protected sets → MGW**, **5 greenfield antennas to JUTAL direct only if ITP/FAT bypass accepted**, MR0002/3/4 OEM → MGW (no forced China→Thailand→China loop).
- NextG 2026 `NG/260916-ADV-DAP1` quote USD191610.15 is **DAP Ranong, NOT DDP Thailand**, expired 2026-10-01; source `data/quotes/NG-260916-ADV-DAP1.full.json`. Direct-China rerouting, freight cost/credit and actual cabinet freight quantities remain UNKNOWN.
- MGW commercial `SERV-5` USD2500 outbound Nantong→JUTAL is already in vendor quote and supplier states packing included. Cover `SERV-3` USD500 packing could overlap, **no signed USD500 credit**. One shared outbound cost event; no separate per-MR charge.
- B6 selected WS **THB307584 historical Rev08 based** unchanged, `netSavingOrIncreaseTHB:null`, no invented savings/posting. Validation: `npm run validate:0553-b6-four-mr-routing` included in build.
- `docs/handoff/pj2608-0553/67_B6_NEXTG_DIRECT_MGW_FOUR_MR_ROUTE_COST_IDENTITY_20261021.md` is authoritative for the new route; earlier all-Thailand cost range is NOT all-inclusive radio/antenna freight.

## Decisions, gates, test ownership

- **Latest B6 route ADR:** [67_B6_NEXTG_DIRECT_MGW_FOUR_MR_ROUTE_COST_IDENTITY_20261021.md](67_B6_NEXTG_DIRECT_MGW_FOUR_MR_ROUTE_COST_IDENTITY_20261021.md) (supersedes ADR-66 MR0001 all-Thailand routing assumption only)
- **Earlier B3/B6/B7 evidence ADR:** [66_B3_SURVEY_B6_MR1_CHINA_INBOUND_B7_STORAGE_ADR_20261021.md](66_B3_SURVEY_B6_MR1_CHINA_INBOUND_B7_STORAGE_ADR_20261021.md)
- **Latest B9 decision:** [65_B9_RELEASE_QUOTED_BASE_ADR_20261021.md](65_B9_RELEASE_QUOTED_BASE_ADR_20261021.md) (supersedes ADR-64 D-64.1 only)
- **Earlier ADR:** [64_B3_B8_B9_SAT_CUSTOMER_PARITY_ADR_20261021.md](64_B3_B8_B9_SAT_CUSTOMER_PARITY_ADR_20261021.md)
- PR#30 earlier integrated evidence: [63_RELEASE_BULK_B3_FAT_FINANCIAL_IDENTITY_INTEGRATION_20261021.md](63_RELEASE_BULK_B3_FAT_FINANCIAL_IDENTITY_INTEGRATION_20261021.md)
- Prior lean basis (not a canonical price): `60_B3_Z1D_BENCHMARK_LEAN_28PLUS2_OFFSHORE_SAT_WBS_20261020.md` on separate origin branch.
- New contract regression: `frontend/scripts/validate-0553-b3-b8-five-day-lean-parity.cjs` via `npm run validate:0553-b3-b8-five-day-lean-parity`; included in `npm run build`.
- **Build proof:** Full webpack + regression build **NOT VERIFIED IN CONNECTED GITHUB SESSION**. No local repository checkout/build runner is exposed to the connector; CI for prior SHA not found. A real `npm run build` on Windows worktree remains required before acceptance.
- **Decision owners:** Project Owner selected the B9 1 LS Base Working SELL price under ADR-65. Project Owner still controls five-day personnel/trip split, MGW facility/customer FAT acceptance, SAT 28+2 posting and final issue. Implementation must never infer that approval from an illustrative model.

Do not merge PR#30 or issue the customer native workbook until cost evidence, client approval, source-to-worksheet validation and regression/build gates are actually met.
