# ALIE R2 in GENESIS

12 November 2026 · PJ2608-0550 · Base commit `662c0344`

- **07.2 Vendor Offers → ALIE R2 · Atomic Lines Intake** opens Drive folders, accepts a local PDF or Vendor/ALIE JSON, and previews changes before registration. Exact PDF SHA-256 selects the existing quote register. Review assigns the source system and LINE_CLASS to eligible rows. Rows without a verified CUS assignment receive a GENERATED TAG and an intended assignment. Original Offer IDs, source links, printed rates, quantities and package totals remain authoritative.
- **10.2 Working → ALIE R2 · Supplier source trace** filters registered atoms by system or Volume I. Each atom can open its source Offer and any already-linked Working line. Selected atoms export as ALIE R2 JSON with source Offer fingerprints and required parents.
- PDF extraction uses local Poppler layout text. A supported table becomes a draft only after every extension and the printed subtotal reconcile. Image-only PDFs report OCR required. Other layouts stay OPEN unless the PDF matches a registered source. The intake registers source evidence. Working continues to own selection, cost allocation, margin and customer pricing.

## Local setup

Start the existing GENESIS development server. To browse Drive directly, enable Drive API for a Google web OAuth client, authorize the GENESIS origin (for example `http://localhost:3050`), and set `GENESIS_0550_GOOGLE_CLIENT_ID` before starting webpack. `GENESIS_0550_ALIE_DRIVE_FOLDER` optionally pre-fills the quotation folder; it can also be entered in 07.2. Use the project quotation folder specified in the handoff and connect with a Google account that can read it. The OAuth token stays in page memory.

For PDFs without a registered SHA-256, install Poppler `pdftotext` on PATH or set `GENESIS_0550_PDFTOTEXT` to its local executable. A matched PDF and prepared JSON use the existing Vendor register and require no Poppler process.

## Verification and scope

- ADR-0550-001 principles 1–3, 5–6 and 8–12 guided source identity, visible gaps, separate Working ownership and use of the existing Vendor and Working modules.
- The ALIE regression checks canonical Offer enrichment, unchanged Working/FX, receipt idempotence, same-source hash validation, source-native money, JSON round-trip, renderer output and rejection of unreconciled PDF tables.
- The real JASON QT2026-160 PDF extracted 14 priced rows and reconciled to the printed subtotal. A real VERSED scan had no embedded text. The Drive inventory returned nine vendor folders. Private data stayed outside Git.
- The prepared CHEVALIER Rev.01 package reconciled all 51 source lines against the original PDF and registered source records, including 15 options. It passed fresh registration, enrichment of existing Offers, idempotent re-import and the R2 export round-trip. The printed NET summary retains the fixed product discount.
- Development and production webpack compiled. The full build stops at the same repository-basis assertion as the unmodified base commit (116 Offers versus 117 expected). Browser end-to-end testing could not launch Chromium in this environment. The owner's OAuth session and Windows runtime remain unverified.
- Other quotation layouts and OCR still require source review. A folder listing does not establish complete ALIE coverage.
