# TEL-DMR Working sections

8 Nov 2026, Asia/Bangkok. Upstream baseline `6865faa9`; includes the scoped
R11 BOM from the rebased `a8c1ac27` work.

The existing 10.2 Part A TEL-DMR group opens the Working price table by default.
Its scope and downstream disclosures start closed. The scope disclosure reads
the four existing MR requirements and separates R11 checks, Proof and available
Working cost basis. WP.2, WP.7 and WP.8 links set the existing system filter to
TEL-DMR. A requirement link opens the existing record directly.

The price table puts the selected R11 package owner first and shows the existing
cost, ADDVALUE and customer prices there in native currency/USD alongside THB.
APF/ACP MR rows open their own CUS comparison and mapped R11 BoQ on demand.
The site/tag allocation remains separate from the price of the shared package.
The repeated group cost ledger, source quotation table and embedded Part B/C
scope tables are replaced by links to the original modules or Working rows.
The detailed DMR evidence view remains available in the existing Working editor.

Source links cover the MR, available DTS evidence and 07 Vendor. The downstream
links reach 10.3 A1-11, 11.M for the selected R11 owner, 11.C1, Volume II VDRL and
10.7 A1-11. Related Part B/C rows are deduplicated by existing Working Line ID.
The same navigation IDs, pricing basis, source records and release controls
apply. ADR-0550-001 principles 3, 5, 6, 10–12 and §13 govern this UI change.

Production webpack and the context, CERAGON, Working Trace, TAG Mapping,
Bidding, Vendor Register, C1 Appendix and Release Issue validators passed.

Chromium exercised the three disclosures, scoped MR BoQ, DMR WP.2/7/8
navigation, the R11 Offer, A1-11 in 10.3/10.7, the exact 11.M owner and C1.
The isolated test used E11 +50% and Prime +20%, checked the owner row values,
and found one USD 53,042.40 charge in the C1 draft. Mobile containment and
the unchanged browser-workspace hash were also checked. This is an isolated
test result, not a review of the live Windows data or an issued quotation.
