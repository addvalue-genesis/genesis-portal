# PJ2608-0553 — Documents collapse + Company 360 multiple quotation hierarchy

Date: 2026-10-13. Branch: feat/pj2608-0553-tpp-bid-handoff.
Scope: UI presentation / source lookup only; no engineering / cost ledger / source quote values changed.

## Issue 1: bid.documents did not behave as a single standard module
Previously the VendorSourceRegister component was an isolated native <details>, and Evidence Classification was a sibling outside the document group. The Source register was searchable but its module and Copy ID were not consistently presented via the shared SmartDataGroup.

Remedy:
- The entire Document Evidence area uses `SmartDataGroup moduleKey="bid.documents"`, so the +/− and Copy ID/Copy Name stay visible even when closed.
- The inner `VendorSourceRegister0553` is an embedded `bid.documents.vendor-sources` record table with `SmartFilterBar` `bid.documents.source-filter`: free text source/company/MR/ID + Evidence Type + MR/System, with reset and counts.
- Evidence classification is nested under the same Documents group and remains individually expandable.
- All 13 original `VENDOR_0553_SOURCES` IDs and original file links remain preserved; those are indexed Vendor/OEM originals, **not an assertion of complete RFQ document coverage**.

## Issue 2: one supplier can have multiple quotations
Before, Company View grouped all source lines into a flat table; this was cumbersome for CSS Thai (5 historical quotations) or EXION (historical/current).

Remedy:
- Default Supplier view now displays the hierarchy `Company → Quotations (one expand/collapse group per original quote ID) → line items`.
- Unquoted material such as manufacturer datasheets, web reference price and historical ERP evidence appears under a distinct `Other evidence` group at the same company level, **not** as a fake quotation.
- Quotation groups show original number, source date, status and currency when supported by source; no fabricated quote total nor price aggregation.
- Quote selection from dropdown still filters to the chosen quote. The new `Inspect quotation & commercial conditions` button only opens read-only quotation terms, so the company's other quote groups remain visible.
- In product, quotation, MR and candidate-compare views the existing per-view grouping is retained and reuses a single table renderer to prevent duplicated source projection.
- Existing canonical Module IDs are unchanged: `bid.vendor.products.supplier.group.<company-id>`, `bid.vendor.products.quotation.<quote-id>`, `bid.vendor.products.quote-line.<line-id>`. New quote subgroup IDs append `.quotation.<quote-id>` under the company group, with Copy ID/Copy Name.

## Existing source evidence expected
- CSS Thai: 5 historical quotations with 17 source lines + separate ERP evidence.
- EXION: 2024 historical `1240515` and 2026 latest `1260576` kept separately.
- VST ECS (Thailand) / Cisco: existing group ID unchanged; as more quotations from that same canonical company are received, each becomes a separate quotation child group rather than a new company. Any *new alias spelling* must first be validated in Company Master rather than fuzzy-merged.

## Regression
- `frontend/scripts/validate-0553-vendor-navigation.cjs` updated for parent document accordion.
- `frontend/scripts/validate-0553-vendor-hierarchy.cjs` added and linked in `npm run build`.
- GitHub text/static verification passed. Local `npm run validate:0553-vendor-navigation && npm run validate:0553-vendor-hierarchy && npm run build` and live browser testing still required.

## Explicit preservation rules
- Never overwrite historical quote revisions, UOM, currency or validity.
- Never promote historical or web references into approved budget cost without engineering and commercial proof.
- Never treat supplier name containing manufacturer/customer as legal company identity without evidence.
- None of the A/B/C, TAG BOM, cost owner, FX or labor estimation modules was changed.
