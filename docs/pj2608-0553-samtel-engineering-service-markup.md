# PJ2608-0553 ADDVALUE-to-SAMTEL engineering service markup

ADDVALUE cost (Item 7 VND) is ADDVALUE's actual selling price, which is the working sell from `priceBWorkingSell0553`. Release adds 5% for SAMTEL on top of that cost. The factor is never a deduction.

`SAMTEL_ENGINEERING_SERVICE_MARKUP_0553` in `frontend/src/project0553/data/samtelEngineeringServiceMarkup0553.js` is `1.05`.

`P_Release = C_Item7 × 1.05`

`C_Item7` is the current working sell in THB. Money is rounded to the nearest satang with `Math.round((n + Number.EPSILON) * 100) / 100` on each line. An unpriced service stays unpriced and receives the markup automatically once it has a working sell.

`PART_B_COMMERCIAL_CATEGORY_0553` tags every Part B line:

| Item | Category | Release |
| --- | --- | --- |
| B1 Engineering and Design | service | Item 7 × 1.05 |
| B2 VDRL / as-built | service | Item 7 × 1.05 |
| B3 Inspection / FAT / survey / SAT | service | Item 7 × 1.05 |
| B4 Painting | service | unpriced; × 1.05 when a working sell exists |
| B5 Packing | service | Item 7 × 1.05 |
| B6 Transport CIF Zhuhai | service | Item 7 × 1.05 |
| B7 Storage | service | Item 7 × 1.05 |
| B8 Training | service | Item 7 × 1.05 |
| B9 Specialist | service | Item 7 × 1.05 |
| B10 Commissioning spares | goods | working-sell customer price, unchanged |
| B11 Special tools | goods | unpriced, unchanged |
| B12 First filling | goods | unpriced, unchanged |
| B13 Consumables | goods | working-sell customer price, unchanged |
| B14 Bonds and insurance | service | Item 7 × 1.05 |

Goods stay on `priceBWorkingSell0553`: the customer price remains the working sell, and the existing 5% is still a deduction from that price for ADDVALUE's receivable. Service release no longer uses that deduction. For a service line, ADDVALUE's receivable is Item 7 and SAMTEL's 5% is `Release − Item 7`.

## Release B3

Base B3 Item 7 is the dossier working sell, not the B3-BF additional:

- China FAT witness 452,850
- Brownfield survey 252,000
- SAT 28 team-days 1,587,600
- VeEX 30,000
- Item 7 total 2,322,450
- SAMTEL 5% 116,122.50
- Release B3 2,438,572.50

B3-BF is a separate additional. Its own Item 7 is 636,300 and its release stays 668,115. That amount is not inside the 2,322,450, and the base B3 markup does not multiply it again.

Part A and equipment pricing are not marked by this factor.
