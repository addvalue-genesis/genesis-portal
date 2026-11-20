# PJ2608-0550 MGW quotation import — 2026-10-28.9-preview

MGW was absent from the current Vendor/Offer registry because the frozen 8-Oct budget snapshot predates its 9-Oct quotation. The existing source-intake document register did not itself extract quotation prices. This change imports the actual 0550 source into the current workspace and exposes rates by system without substituting selected vendors or changing MR quantities.

## Source and reconciliation

- Source: **Q26-063 Samtel_ASK Onshore_ver1.0.pdf**, MGW GROUP CO, LTD, dated 9-Oct-2026, 26 pages.
- Original: https://drive.google.com/file/d/1uWxdcJ6z1a7FFb0DV05es7YvRtnQApEQ/view
- The catalogue stores the PDF SHA-256, page/item references, original descriptions, quoted quantities, unit rates and extended amounts. No prices come from PJ2608-0553.
- 122 detailed equipment rows + 2 cover-only packages (MET/NDB) + 6 service/charge rows = **130 offers** under one MGW vendor. **129 numeric rates**; on-site service remains TBD.
- PAGA 22, Bulk 3, Radio 18, CCTV 28, Entertainment 13, PABX 6, LAN 32 detailed rows. Shared radio accessories are source candidates in multiple relevant systems, not multiple posted costs.
- CCTV cover: USD 133,072; detailed rows: USD 482,142. LAN cover: USD 891,222; detailed rows: USD 881,760. Both discrepancies are displayed and preserved. Every numeric row reconciles quantity × unit rate to its source extended amount.
- MET USD 34,316 and NDB USD 90,060 are cover totals represented explicitly as one package each; detailed BOMs are not present in this PDF.
- Ten source rows have no stated unit. Their prices remain visible, but using them requires unit confirmation with a source in the Offer editor. Internal placeholder U does not represent a confirmed unit.
- Validity is 30 days; 8-Nov-2026 is calculated from the source date. Terms are retained in the catalogue. Destination is unstated, not inferred. Delivery is 6–8 months after drawing/document approval.

## Where to work

Use existing Module IDs:

- `PJ2608-0550 / bid.vendor.master`: one MGW vendor and import status.
- `PJ2608-0550 / bid.vendor.offers`: reconciliation and ten source sections, with each quote row's original quantity, cost, page and details.
- `PJ2608-0550 / bid.budget.working.group.TEL-CCTV` (or another relevant system): expand **ราคาผู้ขาย MGW**, choose a target MR row, then **ใช้ราคาเข้าร่าง MR**.
- Individual source example: `PJ2608-0550 / bid.vendor.offer.OFFER-MGW-Q26-063-CCTV-011`.

Selecting a candidate opens the existing Working editor. It keeps the MR quantity, existing margins, saved manual cost and other line fields, selects the vendor rate and clears the rate-selection basis for fresh review. Record the model/site/scope/quantity comparison and any source-total discrepancy before that rate contributes to calculations. Save explicitly. Existing scope, FX, date, commercial and Official review gates still apply. The rate remains a supplier cost, not a customer selling price.

Example: source CCTV item 11 is 24 sets at USD 9,947. Selecting it for the MR APF outdoor camera row keeps MR quantity **20**, rather than importing 24. This example demonstrates the workflow; it is not engineering approval of that mapping.

PAGA BOSCH remains an alternative to the already selected INDUSTRONIC offer. No automatic supplier replacement, MR quantity overwrite, duplication of package costs or posting of cover totals is performed. Vendor prices are visible even while the corresponding customer Release row remains OPEN. The user's saved localhost database has not been inspected.

## Migration and controls

The additive migration follows existing vendor and MR migrations in one revision-guarded IndexedDB save. Existing offers/rates/FX/lines are preserved; repeated app loads do not duplicate imported offers. Stable source row IDs distinguish repeated descriptions. A uniquely matching existing MGW/Megaway vendor is reused; ambiguous identities and occupied IDs are reported. Exact uniquely named existing quote records receive only the source-row identity, keeping saved prices.

The frozen Rev10 snapshot, historical SAMTEL workbook, 19-system identities, customer codes and existing Module IDs are unchanged. Backup/restore supports the additive fields and requires this or a later version. No dependency changes. Release remains **HOLD / NOT ISSUED**; this draft PR is not merged or deployed.

## Validation

Model regressions cover all source records, amounts, discrepancies, undefined units/TBD, preservation, repeated imports, alias reuse, ID collisions, MR quantity preservation, explicit rate basis, cost/FX calculation and Official review staleness. Browser regression covers source-group visibility/search, 28 CCTV candidates and selecting a 24-set quote into a 20-set MR draft without modifying saved prices. Existing regression paths cover review gates, concurrency, backup, export and unchanged historical workbook.

Executed: bidding model regression, 0550 data/reference validation, 0553 isolation validation and production webpack all pass. Chromium 131 production integration passes **21 checks with zero page/console errors**. The existing webpack asset-size warning remains; the 0550 bundle is 855 KiB. Frozen SAMTEL XLSX SHA-256 remains `2065bb70efa3e8b3bb90b4fbe64f099e02d1ae6c73a73d03b8e745987becafc6`. Tests use isolated browser storage; test rate-selection bases are synthetic, not commercial approvals.
