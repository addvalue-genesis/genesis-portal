# MGW Radio prices by main tender category

12 November 2026 · PJ2608-0550 · Base `adb7b9bc`

07 Vendor shows the 18 priced rows in MGW Q26-063 ver1.0, pp. 9–12, beside their Working owners and category codes. The quoted extensions reconcile to USD 700,501.

| Main category | MGW source cost (USD) | Source items |
| --- | ---: | --- |
| A1-07 VHF DMR / DTRS | 476,819 | 001, 009, 016 |
| A1-07 shared radio consoles and antenna cables | 13,902 | 004, 005, 007, 008, 014, 015, 018 |
| A1-08 VHF-FM Marine | 129,739 | 002, 006, 010, 017 |
| A1-09 VHF-AM Aeronautical | 28,724 | 012, 013 |
| A1-10 MF/HF SSB | 51,317 | 003, 011 |

The existing startup path registers the remaining source rows and assigns one Working A owner to each priced Offer. The existing Goods pricing policy and FX calculate the Draft selling amounts. The Working owners feed 10.7 and 11.C1 Appendix 1.1. On the C1 Working Preview, expand Appendix 1.1 to see system subtotals and the single shared-supply subtotal. Where an exact MR parent is available, the scope row can display the draft price. Otherwise the quote row appears under its system, with scope open. Native MR numbers still refer to the original MR rows.

WP.7 continues to carry the technical trace. The GTPL relocation and the unpriced Motorola option carry no Base charge. The four source rows with an omitted unit carry the original extension in the draft when the printed quantity and rate reconcile. The unit stays OPEN in Official and outside the startup spare cost basis until confirmed. APM site and MR coverage reviews remain open. Existing reviewed or visibly edited Working records retain their authored route. Earlier generated Radio owners on the old A1-07 route move to their system category when the remaining quote batch is first applied.

ADR-0550-001 principles 2, 3, 5, 6, 8–12 and 13 apply. The MGW validator reconciles source and draft owners, confirms the five category groups without MR or SI rows, checks an older workspace upgrade and an authored edit, and exercises duplicate, option, missing-unit and deletion cases. C1 Appendix, Bid Volumes, ALIE and controlled Release validators pass. Production webpack compiles with an asset-size warning. The repository-basis validator reports the existing 116/117 Offer fixture mismatch. The saved Windows workspace has not been observed.

## Quote details on the original MR rows

The Working Preview uses the same main-row and expandable Offer display as LAN. It shows the 10 priced source rows with a unique MR reference on six native Appendix 1.1 rows. APF Marine `1.1.2` carries RADIO-002 and RADIO-010 based on the supplier location and existing APF CUS TAG comparison. The source-lot quantities remain visible in the expandable details, with scope and quantity still under review. ACP Cable `1.1.12` and Console `1.1.13` carry RADIO-005 and RADIO-004 in the shared supply group. The Cable keeps the native 700 m MR quantity and the supplier's one Lot in the Offer details.

Eight source rows remain standalone because the MR or site allocation is open. In particular, APM source rows do not establish an ACP or ABV01 match. The APF 500 m cable has two possible MR rows, and the standalone APF console needs reconciliation against the RoIP scope. The interactive view labels these rows for review and places the native MR sites first. A competing price on the target MR keeps the quote price separate for review. The source and Working price records still carry all 18 owners.

The regression validates the six MR rows, the eight standalone quote rows, unchanged USD and system subtotals, THB, missing-unit handling, a competing MR price and the C1 React projection. The LAN private-register check also passes after reusing the quote-detail display. The Official and archived outputs retain their existing review basis.

## 13 November · Appendix 1.1 SI budget

Working A prepares the reviewed MR quantity gaps from `radioAppendix11Budget0550.json`. The draft adds 13 supply estimates at USD 137,136.22 cost and USD 181,019.81 customer sell using the standard Goods policy. It reuses the existing DTRS handheld owner if its saved generation receipt matches. The draft Release uses A1-07 and A1-09, and the same owners appear on their MR rows in C1 with Draft 11.M bindings. The original 18 MGW owners contribute once each.

The draft provisionally places the quoted APM console at APF, the RADIO-017 Marine lot at ACP and the two ambiguous feeder lots at APF and ABV01. The original quotation preserves its site labels. APF LAY-0001 C1 and LAY-0010 C4, ACP LAY-0001 C2 and LAY-0003 C1, and ABV01 LAY-0001 C1 support locations. MR feeder allowances of 500 + 500 / 700 / 150 m apply until an end-to-end cable takeoff is available. The Working and C1 panels show system notes. The model flags a changed reference rate or competing priced owner for review. Official review and archived issues retain their own approval paths.

ADR-0550-001 principles 2–6 and 8–14 govern the MR quantity basis, trace and separate budget treatment. The regression covers the 13 estimates, four provisional site allocations, duplicate prevention, deletion and changed rates. The saved Windows workspace was unavailable for validation.

## 14 November · CUS MR APF fixed radio quantity

CUS MR Rev.B1 Appendix 1.1 page 9 item 1.0 requires six APF VHF DMR fixed
radios. It gives no reuse credit for the GTPL move described in MGW Q26-063.
Working A1-07 holds six sets on the existing fixed-station allowance, using
USD 3,524 per set from RADIO-016 as a planning proxy. The targeted startup
migration updates the previous untouched five-set draft and its draft locator.
Authored and reviewed records retain their saved values.

The 13 Radio allowances total USD 140,660.22 at cost and USD 185,671.49
at draft customer sell. The fixed-station allowance adds USD 3,524 at cost
and USD 4,651.68 at sell compared with the preceding budget. MGW's USD
700,501 quotation and GTPL source reference retain their original amounts.
