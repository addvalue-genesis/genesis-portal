# PJ2608-0553 — Company Identity CSS Thai Correction (Rev01)
Date: 2026-10-13
Scope: 07 Vendor, Company view, not a BOM cost change.

## Root cause
The supplier view grouped by vendor name string. Historical CSS documents stored different supplier strings that actually describe supplier + brand/manufacturer or supplier + customer context. Exact-string keys created separate supplier cards, and the quote dropdown only exposed exact-matching vendor strings.

## Source evidence preserved
Canonical supplier ID: `css thai`, display name `CSS Thai`, Legal/AVL status NOT VERIFIED.
- QT-H690009052 original label: CSS Thai / CommScope (manufacturer)
- QT-H670003342 original label: CSS Thai / Royaltec customer reference (customer context)
- QT-H670004188 original label: CSS Thai
- QT-H650044674 original label: CSS Thai / Phelps Dodge (brand)
- QT-H660039376 original label: CSS Thai / BCC (brand)
17 original quotation lines across five distinct source quotes; external historical ERP observations: CSS Thai / Royaltec and CSS Thai, 2 references.
Supplier brand, customer, and independent merchant identities (CommScope, Royaltec, RF Parts) are NOT merged into the CSS company.

## Files
- `src/project0553/data/companyMaster0553.json`: exact alias registry with source roles
- `src/project0553/data/companyIdentity0553.js`: canonical name resolver
- `src/project0553/data/vendorUnifiedCatalog0553.js`: read-only company projection preserving originalVendorId, sourceSupplierLabel, quote and product IDs, prices
- `src/project0553/VendorProductCatalog0553.jsx`: canonical supplier dropdown, quote selector, group labels, searches, and original context
- `scripts/validate-0553-company-identity.cjs`: regression checks; added to `npm run build`

## Acceptance
Selecting CSS Thai must show five historical quotations in the quotation dropdown and their 17 source lines under one company; 2 ERP refs appear in the same company under historical evidence when enabled.
Quote source texts, original Supplier name, validUntil, Source Class and UOM are untouched. No automatic BOM posting or AVL approval.
Do not use fuzzy substring company merging. Do not assume a brand/customer is a Supplier.
Local `npm run validate:0553-company-identity && npm run build` and browser check required. GitHub-only static/source checks are not equivalent to runtime validation.
