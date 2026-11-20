# PJ2608-0553 — Five-category Spare/Tool/Consumables Customer Schedule (2026-10-16)

## User intent
Engineering Pre-Award Budget for **B10 / B11 / B13 / C1 / C2** covering MR0001–MR0004, source-linked TAG / BOM / quantity / THB unit and extended prices, matching customer schedule column layout. Use original code, GEQ/MAP and cost read-model rather than reimplementing equipment BOM or pricing engine. User points to `bid.budget.bom.mr0002.zwp20.zwp20-rfi-bda.evidence` as the current selected equipment basis.

## Implemented
- `unifiedSpareConsumables0553.js` includes B11 tools in the existing budget/read model; B10/B13/C1/C2 pricing unchanged.
- `spareCustomerSchedule0553.js` composes five-category customer rows from Rev08 source, installed TAG references from `spareCoverageEngineering0553.js`, actual quantity/source currency, THB planning conversion 31.5, B11 inclusions, functional duplicate flags and explicit readiness audit.
- `b11MinimumTools0553.js` sources **MMC25-5001 EXA-A8 Att-2, §5.0 Telecomunication**: SCADA radio config 1 lot, SCADA NMS 1 lot, TETRA voice gateway 1 lot (applicability to selected DMR OPEN), RACON config software 1 lot if applicable, RACON charging kit 1 set if applicable. Shared B11 Rev08 pricing is not fabricated/apportioned among those five.
- `spareRiskQuantity0553.js` now adds SPQ-003 activity-driven consumable quantity, with source evidence requirement. It stays OPEN_INPUT without evidence; historical B13 Qty remains a controllable pre-award provisional baseline.
- `spareCustomerSchedule0553.js` derives the **RFI BDA + WAROM Ex d** comparison from `MR0002_WORKING_BOM_0553.sites.ZWP20.items.ZWP20-RFI-BDA` and displays a **non-additive** 1 replacement full-package sensitivity at original USD31,474 × planning FX31.5 = **THB991,431**. This is a full kit Part A comparative unit, NOT independently quoted spare cost, accepted Working SELL, or double posting.
- Original ZWP20 parent/child BOM details (BDA, WAROM included, M20 gland, RF feedthrough, included surge if present) are shown with quotation evidence, quantity, price class and inclusion status.
- `ScopeBcAnnexDetail0553.jsx` now renders common customer columns for B10/B11/B13/C1/C2, ARO for C1/C2, B11 minimum tools, five-category engineering trace, overlap audit and RFI replacement sensitivity.
- `validate-0553-spare-customer-schedule.cjs` and `npm run validate:0553-spare-customer-schedule`, integrated into beginning of `npm run build`, safeguard data + display shape and unchanged total.

## Explicit limits: DO NOT falsely claim solved
- The central question *“Do we have a compatible replacement ready and is budget sufficient?”* remains **NOT_YET_DEMONSTRATED**. Historical price rows are not OEM SPIR or proven field-ready stock.
- Phase 1F EXA-A8 Att-1 has Instrumentation/Electrical/PLC SCADA minimum lines but no direct unambiguous quantity mandate for a complete RFI BDA/SCADA ODU. Do not transpose PLC-based thresholds onto RF/DMR without applicability proof.
- Mandatory B11 tools per EXA-A8 Att-2 5.0 are **distinct requirement drivers** from four priced historical B11 lines; TETRA vs DMR conflict is intentionally open.
- Do not book missing BDA replacement risk THB991,431 as current B10/C1 sell, and never add both categories for the same physical item.
- B13 desiccant/barrier/cleaning/labels must be separated from B5 shipment consumables. SPQ-003 consumption driver input not yet evidenced.
- C1/C2 optional are NOT base. An overlap between B10 and C2 is not double billing unless same physical delivered stock is counted twice without additional delivered quantity.
- Customer release requires SKU, site installation compatibility, Ex/ATEX, OEM tool license scope, procurement Qty, and DDP/CIF issue resolution.
- Current budgets B10 123024.37; B11 128314.11 historical non-posting candidate; B13 22484.21; C1 4049349.36 option; C2 721806.68 option (THB). WBS and base Working Sell remain as before.

## Validation
- Fetched and inspected current project sources and genuine Phase1F EXA-A8 Att-1/Att-2 from Drive.
- Static JavaScript syntax parse succeeded for new/updated JS models.
- Model-only source-based smoke check succeeded using original MTO Rev04, AFC layout, MR-0003/4 C1 and Rev08, with a mock RFI-BDA module import: 31 historical price rows over five categories; THB991431 major-spare comparative, six functional overlap families.
- **GitHub-to-user Windows Build/Browser test NOT EXECUTED in this turn.** User should pull and run `npm run validate:0553-spare-coverage`, `npm run validate:0553-spare-customer-schedule`, and `npm run build`. Do not claim PASS until output received.

## Next step
Resolve selected OEM spare part equivalence and quote for RFI BDA standalone vs full package, explicit Major Spares across four MRs, EXA-A8 quantity applicability, physical stock split B10 vs C1/C2, SPQ-003 preservation activity driver, B11 licensing and actual supplier inclusion. Then budget only justified incremental costs through controlled separate approvals.
