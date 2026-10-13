# PJ2608-0553 — Datasheet Evidence Relocation into Vendor Products (Rev01)

Source basis reviewed on 2026-10-13:
- Weidmüller `IE-PS-RJ45-FH-BK` datasheet (order 1963600000): source PDF `V-DATO-WEIDMULLER-DS`, Cat6A tool-less RJ45, IP20, not Ex-certified by this datasheet.
- RFI `RX3852-2002-11` datasheet: source PDF `V-RFI-LNA`, 380–520MHz, 40dB gain, 11–28VDC, SMA(f), separate DC/alarm mating connectors A2671/A2881.
- RS Thailand retail evidence `WEB-RS-WEIDMULLER-1963600000` is THB 1,176.68/pc ex VAT indicative 12-Oct-2026, original RS item 7417317. This is NOT a supplier quotation and DOES NOT certify Ex usage.
- Management RFI LNA allowance THB 500,000/unit and supplier assignment MGW are separate from MGW quotation P26-058; MGW quotation DOES NOT include the RFI LNA SKU. Manufacturer remains RFI.

## Behavior
07 Vendor / Supplier View:
- RS Thailand: Weidmüller datasheet `V-DATO-WEIDMULLER-DS` plus separate web price evidence, both under product `IE-PS-RJ45-FH-BK`.
- MGW Technologies Pte Ltd: RFI datasheet `V-RFI-LNA` under MR-0002 with `NOT_QUOTED_DATASHEET`; do not treat it as part of MGW quote P26-058 or as RFI-manufactured by MGW.
- Removed duplicate `bid.vendor.products.datasheets` standalone list. Item IDs remain exactly `bid.vendor.products.datasheet.V-DATO-WEIDMULLER-DS` and `bid.vendor.products.datasheet.V-RFI-LNA` in Copy ID controls.

## Data architecture
- `vendorEvidence.js`: original source register, retains documents and legacy source labels
- `data/vendorDatasheetAssignments0553.json`: explicit company association (not quotation)
- `data/companyMaster0553.json`: company identity and relation roles
- `data/vendorUnifiedCatalog0553.js`: one product master with multiple distinct source evidence relationships
- `data/vendorExternalEvidence0553.js`: retail reference with nonbookable price status
- `VendorProductCatalog0553.jsx`: one faceted Supplier/Product table, no standalone datasheet section

## Controls
Technical Ex/DATO compliance still open. Current Project quotation, historical quote, datasheet, web reference, management allowance and AVL approval remain distinct classifications. No BOM or A/B/C cost-derivation file modified. Existing ZWP20/ DATO row-8 budget rate remains owned by the current cost ledger; no automatic repricing.
Local validations: `npm run validate:0553-datasheet-vendor-mapping`, `npm run validate:0553-vendor-refactor`, `npm run build`. GitHub verification covers source consistency only, not local browser/runtime.
