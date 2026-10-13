# PJ2608-0553 — Documents vs 07 Vendor source registry and search
Date: 2026-10-13

## Why it changed
The 07 Vendor tab previously displayed two prominent tables:
1. Vendor / OEM Source Index driven by `VENDOR_0553_SOURCES` (13 source documents/folders, not all parsed into products)
2. Vendor Products · Datasheets · Quotations driven by `VENDOR_UNIFIED_CATALOG_0553`
These have overlapping references but different use cases. It incorrectly looked like duplicate databases, and original source-only records seemed missing from products.

## Architecture contract
- `bid.documents` is the source document register: source ID, filename, link, MR, status, provenance; an unparsed PDF remains in the register.
- `bid.vendor.products` is the normalized Company/Product/Quotation/Evidence index, linked to original evidence by source IDs/links.
- Reference from one source in multiple views does NOT mean independent document copies or duplicate source prices.
- Source document can reference multiple products and multiple quotes; manufacturer and retailer are different roles.
- Remove duplicate main source-index table above Product catalog; show Catalog first. A single collapsed `VendorSourceRegister0553` below Catalog offers all 13 original references, filter and Copy ID. Unmatched original files have not disappeared.

## 07 Vendor company search
- Supplier dropdown uses `Intl.Collator("en",{sensitivity:"base",numeric:true})` A–Z alphabetical order, not arbitrary insertion order.
- Add `Type company` search field: filter by canonical company, known aliases and original source labels, retaining current Company 360 identity rules.
- As user types, supplier picker options and Vendor evidence table filter together; clearing resets unrelated old selection.
- Quotation selector sorted by canonical company then original quotation number; source quote IDs untouched.
- All original quotation lines, commercial terms, datasheets, reference prices and historical evidence remain from existing registries.

## Module identity
- `bid.documents` — source documents
- `bid.documents.source.<sourceId>` — source original reference IDs
- `bid.vendor.products` — Company/Product Catalog
- `bid.vendor.products.search` — faceted filter controls
- `bid.vendor.products.datasheet.V-DATO-WEIDMULLER-DS` and `bid.vendor.products.datasheet.V-RFI-LNA` — preserved legacy individual evidence Copy IDs within main Vendor Registry (no separate datasheets table)

## Regression and local verification
- New `scripts/validate-0553-vendor-navigation.cjs` included in `npm run build`.
- Updated `validate-0553-company-identity.cjs` check for original source supplier label presentation.
- Commands:
  `cd frontend`
  `npm run validate:0553-vendor-navigation`
  `npm run validate:0553-company-identity`
  `npm run build`
- Browser: 07 Vendor -> type `CSS` or `MGW` and confirm automatic result filtering and alphabetized Supplier dropdown. Open collapsed `bid.documents` to review original 13 sources.
- No cost/BOM derivation, supplier quotation, current/legacy source document, source price, manufacturer identity, or customer MR/TAG modified in this navigation refactor.

## Limit
Source records remain read-only GitHub-controlled JS/JSON with no SQL/AGERP integration automatically asserted. GitHub code review is not a browser/build verification; do not mark runtime PASS before local npm run.
