# C1/C2 TAG Annex review preview - R73, 2-Nov-2026

Owner requested original Annex-style preview of the latest C1 scenario, keeping
item5, and authorized code changes plus C2 review. This is preview authorization;
it does not select USD181,100 as the revised Official/Excel commercial price.

## C1 view

Existing `c1SiTagBudget0553.js` derives eight-column `annexRows` directly from its
six current calculation rows. Each retains source row ID and exact MR/site/TAG
keys. The quantities and rates are unchanged. No new spare asset TAG is created.

| Item | Reference TAG/site | Description | QTY | Unit SELL USD | Total USD |
| --- | --- | --- | ---: | ---: | ---: |
| 1.1 | ZWP8 MR-502-003 | Base ODU/filter/capacity key | 1 set | 16503.84 | 16503.84 |
| 1.2 | ZWP22 MR-502-001 | Subscriber ODU/filter/capacity key | 1 set | 9076.48 | 9076.48 |
| 2 | ZWP8 MR-502-003A; ZWP22 MR-502-001A | PoE supply and cord | 2 sets | 872.65 | 1745.30 |
| 3 | ZWP20 LAN-502-001 | 8-copper/2-SFP Cisco + PSU/licence/support | 1 set | 15335.05 | 15335.05 |
| 4 | ZWP20 TCAB-508-002 | RFI BDA + WAROM, original RAD-508-001 requirement | 1 set | 40916.20 | 40916.20 |
| 5 | ZWP20 MAR-514-001 | Complete RACON + included control/DB-5P/accessories | 1 set | 97500.00 | 97500.00 |

Subtotal USD181076.87 + explicit rounding USD23.13 = USD181100. Existing release
rule is `ceil(totalUSD / 100) * 100`, once per category, not once per SKU. Rate
factor1.30 is already included. Every displayed Qty x unit reconciles to amount.
Current Official/native C1USD97500 stays separately labelled, unchanged. The C1
tab now shows the new review first; the old selected original-sheet comparator
is separately expandable. Original six-sheet Excel still exports selected data.

Columns: Item, Tag No./Reference site, Description, Detail Specification,
Materials, QTY, UNIT PRICE(USD), TOTAL PRICE(USD). English descriptions/specs
come from the referenced quote composition; no material alloy/certificate is
invented. Supplier sources/costs/SI audit remain behind a separate details panel.
R72 ADDVALUE FAT/field-cable/gland exclusions remain visible; quantities,
interchangeability and any additional cost scope still need independent review.

## C2 view and findings

New read-only `c2TagReview0553.js` and `C2TagReview0553.jsx` reuse the existing C2
parent, twelve historical source IDs/rates/quantities and installed MR/MTO/LAY
keys. No new business module or source ledger is introduced. C2USD23000 remains
unchanged; historical THB721806.60 is not a new current cost estimate.

- Seven C2 rows require B10 SKU/physical-stock reconciliation: PoE, Cisco PSU,
  RF surge, Ethernet surge, fuses, RF connectors and M20 glands.
- Three C2 rows require independent C1 stock review: PoE, Cisco PSU and DB-5P.
  Inclusion inside a C1 equipment package is not proof that all independent C2
  stock is unnecessary. No automatic subtraction or quantity reduction.
- Phone/sounder reference currently selected EXION parts `212-02-6008-510` and
  `DB3BDG048N2BNR`, rather than the unselected MGW -410 phone. EXION historical
  installed four-unit lot and expired quote do not establish a current one-spare
  price. Those references do not replace the C2 historical SELL rate.
- RF feeder review retains the original7/8-inch description/rate as evidence,
  references selected MGW UHF4 1/2-inch/50-ohm configuration and keeps exact SKU,
  technical acceptance and current per-metre price open.
- C2 DB-5P references only MR0004 TCAB-514-001, not control boxTCAB-514-002, and
  only ZWP20/21/22. Telephone/sounder includes ZWP23 per MR requirement.
- PoE references indoor-interface TAGs. Fuse/gland uses actual parent equipment
  or enclosure TAG; cable/connector uses candidate endpoint TAGs. A reference
  association is not proof of pooling, SKU compatibility or physical spare qty.
- The twelve historical rows do not by themselves prove all-system C2 coverage;
  existing C1/C2 evidence/quantity panel remains visible and required. An optional
  C1 purchase cannot silently satisfy unreviewed C2 obligations.

For an issued C2 schedule use Reference equipment TAG + site + OEM spare Part No.
For untagged subcomponents use parent equipment TAG; for cables use endpoints.
Do not manufacture a distinct client TAG for every small spare part.

Validation: new eight-column/identity/part/stock/nonmutation/rounding/SSR
integration validator passes, including exact selected C2 largest-remainder
allocation to USD23000 and Qty x four-decimal unit reconciliation. Existing C1
budget, C1/C2 evidence/quantity, owner-supply, protected financial fingerprints,
Official/native XLSX, source coverage/customer schedule and change-log validators
pass. Dedicated production build passes with three existing bundle warnings.
No interactive browser QA: Chromium remains unavailable. New internal review
views are excluded from printing; printing temporarily opens the current selected
C1 sheet and restores its prior collapse state. Original Excel bytes/layout are
unchanged by these preview-only additions.
