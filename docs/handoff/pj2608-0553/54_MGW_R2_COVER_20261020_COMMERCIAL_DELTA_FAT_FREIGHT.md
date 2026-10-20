# PJ2608-0553 — MGW P26-058_R2 New Cover 20-Oct-2026 Commercial Reconciliation
Authority: MGW 20-Oct-2026 Cover sheet, NOT a new equipment BOQ revision
Cover: https://drive.google.com/file/d/1qOswXUq_gogU272zWDaLilRGdjhtLK7n/view
Detailed R2 quotation: https://drive.google.com/file/d/1DLaku-mj2uYI-7A_E3z5QFZQgbz6OozA/view
Previous vendor-email indication: Paul Lee, 20-Oct-2026 5:49 PM, user screenshot
Status: read-only vendor price evidence / no automatic Working Cost or Customer Sell modification.

## Source-derived commercial change
| Item | Detailed Sep21 R2 USD | Oct20 R2 Cover USD | Delta USD | Cost owner review |
|---|---:|---:|---:|---|
| MR0002 UHF / RFI | 99,564 | 99,564 | 0 | A2 vendor package |
| MR0003 Ex phone | 25,600 | 25,600 | 0 | A3 vendor package |
| MR0004 RACON / Tideland | 225,177 | 225,177 | 0 | A4 vendor package |
| Equipment | 350,341 | 350,341 | 0 | A2-A4 unchanged |
| Design/documents/PM | 8,000 | 8,000 | 0 | Supplier design; B1/B2 overlap check |
| Assembly / FAT | 6,000 | 5,000 iFAT 2 days | -1,000 | OEM supplier execution vs B3 paid witnesses |
| End-user FAT premises | not itemized | 2,500, min 5 days | +2,500 | Vendor facility, not ADDVALUE B3 automatic |
| Packing | 500 | 500 | 0 | B5 vendor-credit check |
| Road freight to JUTAL | not itemized | 2,500 | +2,500 | B6 quote rate, not another email surcharge |
| **Total vendor services** | **14,500** | **18,500** | **+4,000** | keep activity owners distinct |
| **Overall vendor offer** | **364,841** | **368,841** | **+4,000** | no approved customer price yet |

The old MGW R2 detailed PDF and new MGW R2 cover **share quotation number P26-058_R2** but have different issue dates and commercial details. Treat the Oct20 Cover as the newest supplier commercial evidence. The old detailed PDF remains the equipment BOM authority; do not edit SKU/quantities.

## Incoterm and delivery contradiction
Oct20 Cover says **Delivery Destination: DAP Nantong China** while a separate line says **ROAD FREIGHT TO JUTAL SITE USD2,500**. The earlier Sep21 detailed PDF says **EX WORKS Nantong China**. Thus the delivery point, importer/exporter, road route, risk transfer and whether any onward Myanmar transport/duty is included remain UNRECONCILED. JUTAL delivery receipt/DO stamping and Paul's claimed Myanmar offshore zero-rate duty are not authoritative customs evidence. Request explicit Incoterm place and consignee before pricing DDP.

## FAT work owner contradiction
Oct20 Cover separates **iFAT 2 days USD5,000** and **end-user FAT facility min 5 days USD2,500**. Current ADDVALUE 10.2/B3 books **6 MGW FAT witness days with 2 paid specialists + travel** as budgetary Working SELL. Six paid witness days is not automatically the same as 2-day internal FAT or 5-day end-user venue. Need FAT agenda and how/when customer joins; do not silently change working personnel or travel budget.

## Code routing and governance
- `data/mgwP26058R2Cover20261020.js`: latest Cover price evidence; references `mgwP26058R2Selected0553.js` Equipment BOM and earlier Paul email without booking same USD2500 twice.
- `supplierQuoteLines.js`: Vendor Registry selected MGW R2 quote uses Oct20 source/date/USD368841; equipment six packages from detail PDF, five services from latest Cover.
- `MgwR2CommercialCover0553.jsx`: displays owner-specific cover delta, priced scope and unsettled owner gates under `10.2 / bid.budget.working.bc.b1/b2/b3/b5/b6`.
- `BcCostEvidenceDetail0553.jsx`: inserts read-only Cover before earlier email evidence. Emails remain available for programming kit, free-issued RADWIN and spares follow-ups.
- `validate:0553-mgw-r2-cover-20261020`: reconciles vendor totals and verifies HTML source/owner displays, unchanged B/C working sell, no freight duplication and no customer release.

## Required confirmations
1. MGW written revision/endorsement confirming Oct20 Cover governs commercial offer while Sep21 attached equipment BOQ remains valid.
2. Itemized iFAT 2-day and end-user FAT min-5-day agendas, location, witness/standby logistics, facility/tool inclusion and extra-day rates.
3. Road freight item USD2500 truck/trip coverage, exact JUTAL receiver site and Incoterm, shipment charges to China/MYANMAR and import license/duties, timing and risk.
4. B1/B2 project/engineering/VDRL and B5 packing credit vs vendor line; do not double count.
5. Itemized two-year spares/B10/B11/C2 and RACON programming kit from John.

Local validation from `...genesis-portal-0553-release\\frontend`:
```powershell
git -C .. status --short
git -C .. fetch origin
git -C .. switch --detach origin/feat/pj2608-0553-mgw-r2-cover-20261020-commercial-reconcile
npm run validate:0553-mgw-r2-cover-20261020
npm run validate:0553-mgw-paul-email-clarifications
npm run validate:0553-mgw-r2-selected-mr234
npm run build
```
No source cost baseline changes, buyer Price Release or auto-merge. Local test/build execution still pending.
