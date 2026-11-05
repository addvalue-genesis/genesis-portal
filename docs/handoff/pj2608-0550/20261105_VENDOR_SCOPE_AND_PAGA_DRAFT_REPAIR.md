# Vendor quote scope and PAGA draft repair

5-Nov-2026, Asia/Bangkok. Parent `d5390c89`, existing Official Working branch and draft PR #53.

## Result

B07 groups original Offer rows by the systems identified in the quotation. Mapping and Working references remain visible at row level. Existing legacy rows without original quotation scope remain navigable as references. This addresses ADR-0550-001 principles 2, 3, 5, 8, 9, 10 and 12. Quote IDs, navigation, original quantities and currency totals retain their existing basis.

Item 22030 is documentation and project management in the PAGA package. The existing SI preparation and saved workspace reload repair only the exact untouched Drafts `REQDEF-MR-TEL-VSAT-ENG`, `REQDEF-MR-TEL-AIS-ENG`, and `REQDEF-MR-TEL-RADIO-DTRS-ENG` from A Rev09/10. The repair drops the PAGA Offer and matching trailing source, locator and excerpt, leaving other evidence and Working references attached. The A package and receipt fingerprints are retained. Reviewed and edited records remain user-owned. PAGA and COMMON evidence, the financial model, frozen issues and prices are outside this correction.

## Verification

Actual A Rev10 and INDUSTRONIC Vendor Register regression confirmed the three targeted repairs, idempotence, protection for reviewed/edited rows, COMMON trace, two quotes and 80 Offer IDs under PAGA in both grouping directions, unchanged quotation totals and unique Offer anchors. The full reconstruction matched all 88 priced owners, quantities, selected Offer IDs and Base/Option totals from the prior audit. Vendor register SSR, SI work package, automatic A source-workspace and developer context validators passed. No claim of owner Windows IndexedDB verification.

## AVL review workspace

UI `2026-11-05.17`, parent `a5534795`. The full all-system audit now renders only in 14.1 AVL / Technical (`bid.deviations.avl`). WP.7 renders a summary for the selected system or all systems, with a link to 14.1. Technical Export 14.3 links back to 14.1 and continues reading the same saved Deviation register for its preview and XLSX.

ADR-0550-001 principles 3, 8, 10 and 12 govern the shared Requirement, Working, Offer and review records. Context, Working Preview SSR, all-system AVL reconciliation and production compilation passed. The SSR check locates the full audit only in 14.1 and the compact view in WP.7. Export layout and saved record tests passed. Windows runtime was not observed. Engineering and acceptance follow their existing review rules.
