# PJ2608-0553 — B10 Final Engineering Round (26 Oct 2026): Required BOM → Four Stages → Annex UI/XLSX → Source Return

## Engineering conclusion grounded in originals

1. MM-ZTK-1F-GEN-TEL-MR-0001 Rev.C1 §5 (user's direct document, dated 28-Aug-2026): ZWP20/21/22/23 each have **one Installed SCADA Radio System Set**, and **one Commissioning/Start-up Spare Kit per Platform**. Installed System BOM rows are ODU MR-502-001, IDU MR-502-001A, Antenna ANT-502-001, Cisco Layer3 LAN-502-001, Ex Ethernet socket DATO-507-001, TCAB-500-001 enclosure, SA-502-001 surge, and Bulk. This does not require one additional ODU/IDU/Cisco spare per site.
2. §5 identifies a separate B11 special tool set per phase, C2 two-year parts *quotation only*, FAT/SAT/Offshore commissioning requirements, and separately packed items to replace after final testing.
3. MR0001 Attachment 4 ¶7 requires all materials for pre-commissioning and start-up listed as spares. Attachment 5 ¶1–16 requires exact part name, all part numbers, availability/lead time, price, installation/assembly and storage materials, seals/gaskets, OEM procedure materials and site-technician contacts.
4. Attachment 7 ¶6 explicitly excludes all B10 items from C2 two-year operating spares. C2 must have part names, numbers, unit breakdown price and lead times. No automatic dedupe based on similar functional descriptions: exact SKU+physical delivered Qty required.
5. SPE0001 Rev.C2 §8.1 requires Company SPIR format and states MMC23-5025 EXA-A8; accessible attached minimum list is MMC25-5001 EXA-A8 — need check precedence. Annex-8 Attachment1 has **PLC Based SCADA / other electrical/navigation categories**, not a blanket SCADA WiMAX ODU/IDU/Cisco rule. Only formula `max(ceil(installedQuantity*percentage), listed minimum)` applies after *exact listed equipment category/rating applicability* and equipment SKU approval.
6. Exhibit A Annex-8 Attachment2 Special Tools belongs B11; five telecom tools include SCADA radio configuration and monitoring software, TETRA gateway (verify selected DMR applicability), RACON configuration/charging (if applicable).

## Delivered in this branch (codes)

- `data/b10StageSpareSelection0553.js` asserts the **original eight installed ZWP20 source BOM rows** from `mr0001WorkingPricedBom.js` / `mr0001.mto.rev04.sourceRows.json` and establishes 14 **engineering screening candidates** across 4 stages and 4 MR platform kit price owners. Nothing is posted.
- `data/b10NativeAnnexReview0553.js` now consumes those exact 14 pre-award **SPARE FUNCTIONS**, not 35 Part A/optional radio/installed quote rows. For all rows `b10PurchaseQty=null, b10UnitSellUSD=null`. Where NextG quote evidence exists, the proposed SKU and the expired optional offered Qty/rate remain **internal only**, not the B10 purchase Qty or customer CIF SELL.
- `B10NativeAnnexReview0553.jsx` renders those 14 spare functions in exactly 8 original columns: Item, Tag No., Description, Detail Specification/Part No., Materials, Qty, Unit USD, Total USD. Includes MR/stage justification, internal quote evidence, and per-function Working-source link.
- `B10StageSpareSelection0553.jsx` renders **Erection → Pre-commissioning → Commissioning → Start-up** matrix, exact source ID anchors and ZWP20 original eight installed functions.
- `CommercialWorkspace.jsx` plus `ReleaseCustomerWorkbook0553.jsx` extend 16/16 parent source↔release route with `sourceSelectionId` for exact 14 B10 article rows. Exact row focus and Return button work via source item ID; financial parent ID/traceId remain unchanged.
- `buildNativeB10ItemizedReview0553` in `nativeWorkingDraft0553.js` writes same 14 B10 rows into original 6-sheet embedded native Excel. Adds **1** styled row beyond original 13, moves Total from row19→20 and Remark row20→21, updates merges and preserves other sheets. Headers show proposed CIF Zhuhai Port/USD, but all B10 Qty and Unit/Total CIF SELL stay unquoted until OEM.
- The **Internal** B10 Export button first generates the **existing current 10.2 Working six-sheet export**, then replaces only B10 with the 14 stage spare function rows. Other five sheets use the same selected Working Source, not stale template rates. Does not change customer Official USD exporter.
- `validate-0553-b10-native-annex-map.cjs` asserts 14 stage candidate rows, 1 inserted native row, source selection, XML merges, preserved original six sheets and also chained Working→Native export.
- `validate-0553-b10-release-sku-preview.cjs` updated to reject old 35-part equipment rendering in B10 and assert 4 MR parent Kit prices, original source mapping and 14 as-yet-unpriced spare functions.
- `data/budgetChangeLog0553.js` Rev R59 reflects new controls.

## Controlled cost and category boundary

| Category | Selected Working | Customer status |
| --- | --- | --- |
| B10 | THB 509,827.50 / 4 financial MR parent rows / required 4+3+4+3 kit sets | Working budget only; itemized CIF Qty/rates UNQUOTED |
| B11 | THB 157,657.50 selected phase envelopes | OEM tool/license scope and included credits OPEN |
| B13 | THB 46,683.00 selected preservation kits | activity Qty and B5/A5 exclusion OPEN |
| C1 | Optional, NOT QUOTED | installed RACON comparable ≠ OEM spare quote |
| C2 | Optional, NOT QUOTED | 2-year OEM SPIR, maintenance interval, per-SKU units and B10 exact exclusion OPEN |

**No honest way to issue a final actual B10 CIF itemized quotation with proof currently provided.** Source-mapped 14 functions are not 14 approved spare SKUs and some may fall to B13/A5 after consumption ownership review. Supplier cost evidence is quotation-mismatched, expired or optional; do not divide the existing THB509,827.50 across the 14 candidate rows, or use 10% without applicability.

## Local verification (Node/Browser)

GitHub connected tools can modify remote source and perform static readback but cannot execute the owner's local Node/Webpack or browser. Need actual execution of:

```powershell
Set-Location "C:\Users\acer suriyapong\DEV\genesis-0553\frontend"
git status --short
git pull --ff-only origin fix/pj2608-0553-urgent-thailand-cif-pricing-20261024
npm run validate:0553-b10-native-annex-map
npm run validate:0553-b10-release-sku-preview
npm run validate:0553-spare-lifecycle-roundtrip
npm run validate:0553-native-working-export
npm run validate:0553-official-usd-release
npm run build
npm start
```

Browser:
- 10.3.3 → B10 → Internal → 14 rows in original Annex, Item→Tag→Description→Spec→Materials→Qty/Unit/Total, stages visible. No 35 installed SKU price list.
- Click Source on `B10-PTTEP-01-F02`, reach 10.2 B10 stage row, click Return to exact B10 spare function in 10.3.3. Same ID focuses.
- Export Internal Native B10; confirm six original sheets, B10 rows6–19, Total20, Remark21, no price leakage/false CIF SELL. The old 4 MR KIT parent current summary remains but is separate from actual OEM spare stock.
- Official USD still displays 4 financial kit projection, not itemized approved CIF price; customer issue remains HOLD.
- If test fails send exact terminal Error output; do not override locked Source financials to make tests green.

## Standalone B10 native Excel review companion
A separate **6-sheet** workbook was created in this conversation, based on the actual original `4-Scope of Supply.xlsx`, with B10 14 stage functions, formulas in I6:I19, total IF-complete guard in I20, Total20 and Remark21. File:
`PJ2608-0553_B10_RequiredBOM_StageSpare_OriginalNative_INTERNAL_Rev04.xlsx`.
This is an INTERNAL review file; does not substitute for final issued OEM SPIR and CIF commercial proposal.
