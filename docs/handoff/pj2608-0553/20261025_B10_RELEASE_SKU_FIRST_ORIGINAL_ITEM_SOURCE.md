# PJ2608-0553 — B10 10.3.3 SKU-FIRST PREVIEW / 25 October 2026

## Why the screenshot still showed MR kit not SKU
`ReleaseCustomerWorkbook0553.jsx` rendered `model.annex.B10` (four financial envelopes B10-PTTEP-01..04; qty 4/3/4/3 sets) as the primary 13-row original-customer workbook Annex. Quoted supplier SKU information was already attached as a **nonposting** `b10ItemizedPurchaseEvidence` object but only shown through a collapsed separate accordion *after* the price table. The giant 29-site/TAG list in the first kit row described **associated installed equipment** and not 29 spare part numbers. `Rev08` is historical and is not an OEM-selected purchase BOM.

## Approved *presentation* fix, without false price approval
New `frontend/src/project0553/B10ReleaseSkuSchedule0553.jsx` sits **before** the MR kit price summary in `frontend/src/project0553/ReleaseCustomerWorkbook0553.jsx` when B10 tab is selected. Display hierarchy:
- **Original Item / Source**: exact NextG D/E quote line, actual description, original quote identity in Internal mode.
- **SKU / Part No.**: exact part number in source quotation; does NOT certify interchangeable installed OEM spare.
- **Related Installed TAG**: up to two source site/TAG references and a bounded, expandable remainder. No multiplication of one spare by 29 tags.
- **Offered Qty**: quoted offered source quantity, separate from **B10 Purchase Qty** which remains `Not verified`.
- **Vendor Unit USD (expired)**, and **Review SELL USD/unit** visible only in Internal mode. The latter is sourced from nonposting price-to-win review for the 4 selected D/E quote lines, not from an approved customer quote.
- Customer mode shows item descriptions, candidate SKU, candidate TAG, Offered Qty and `Customer Unit USD = Not established`, hiding vendor USD quote and internal review SELL. This is still an unissued PRE-AWARD preview.
- 16 D/E original quote rows grouped by physical article classification: 6 accessories, 2 complete radios (capital/ownership review), 4 software/region licences and 4 warranty lines. Physical purchase stock not identified in MR0002/3/4 yet.
- The original **4 MR Kit** priced rows remain below as a **Kit price summary / reconciliation**, not the purchasable SKU schedule.
- `releaseWorkbook0553.css` caps expanded kit-level TAG lists at 148px scrolling and candidate SKU TAG lists at 128px so 29 source references cannot stretch a single financial cell to the full page height.
- `B10ItemizedPurchasingEvidence0553.jsx` labels are made consistent as `Original Item / Source`; `ReleaseCustomerWorkbook0553.jsx` explicitly clarifies **4/3/4/3 are kit counts, not SKU purchase quantities**.

Financial invariants: B10 Working SELL **THB 509,827.50** (four source kit lines), Existing Official B10 **USD 16,200** and Native customer Excel **unchanged**. No new SKU cost posting/approval; the source-to-release ledger, 16 original current Annex financial IDs and A/B/C totals remain intact. No SKU quantity, compatibility or new independent OEM quotation has been fabricated. The quote expired 1 Oct 2026. Price-to-Win scenario remains Internal/Nonposting.

New `frontend/scripts/validate-0553-b10-release-sku-preview.cjs` is added to `npm run build`. It tests 16 exact source quote SKU rows rendered, 14 vendor priced / 2 vendor dashes, visible original item/source headings and tag references, supplier/review prices masked in Customer mode, SKU table before parent kit, capped TAG lists, unmodified Official B10 USD16200 and no SKU evidence copied into Official DTO. GitHub source/static checks passed after write. **Node/webpack/browser actual execution not available** in current session, so validation pass must not be claimed until run by operator.

Command after stopping existing `npm start` with Ctrl+C:
```powershell
& {
 Set-Location "$env:USERPROFILE\DEV\genesis-0553\frontend" -ErrorAction Stop
 git pull --ff-only
 npm run validate:0553-b10-release-sku-preview
 npm run validate:0553-b10-itemized-purchase-evidence
 npm run validate:0553-official-usd-release
 npm run build
 npm start
}
```
Open http://localhost:3000/projects/pj2608-0553 → 10.3.3 → B10 CommSpares. Switch Internal/Customer to review the different sensitivity of the supplier-cost columns. The customer-form Excel remains the original four kit envelopes; full itemized customer issue still requires physically verified SKU, required purchase quantities, current unit selling prices, C2 de-dup and Annex overflow continuation.

No new MGW RFQ and no global DB/manual-input refactor. No unverified requirements 1–8.
