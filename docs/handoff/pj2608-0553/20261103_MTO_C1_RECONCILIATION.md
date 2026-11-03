# MTO C1 material/price reconciliation — 3 November 2026

Baseline: eb67cb2fd57650dea3e1e8d6b7877e242a35e1e1, after the owner-confirmed
ZWP11 new enclosure decision. Continue the existing Bulk view and module IDs.

## Corrected counted scope

MR0002's rate registry already marks the old LNA-BOX allowance unselected and
SUPERSEDED_LNA_ONLY, but its Working BOM still counted THB57,939.81 per site.
The selected RFI BDA replaces the original LNA at its function-defined position
and MGW UHF-1 already includes the WAROM enclosure. Preserve all three historical
row IDs as non-additive children of the BDA package; retain historical costs as
reference fields, without another procurement/price posting.

The separate RF surge enclosure and M25 gland requirements remain explicit
technical checks. This correction does not assert that all surge assembly
components or all MTO glands are included in MGW's quote.

| Price bridge, USD | Before | After |
| --- | ---: | ---: |
| A1 | 242,910 | 242,910 |
| A2 | 137,130 | 129,870 |
| A+B | 896,530 | 889,270 |

Direct cost removed: THB173,819.43; working sell removed: THB225,965.26.
Quoted difference: −USD7,260, comprising the former 3×USD2,400 allowance and
−USD60 from the existing seed allocation/unit-rounding policy (BDA and UHF-4
each fall USD10/site). Supplier rates, FX and margin are unchanged. A1/A3/A4,
Part B and Part C remain unchanged. Net change from the pre-ZWP11 USD894,910
baseline is −USD5,640; this is not a closed all-MTO cost impact.

## Remaining evidence gaps, now quantified

- EXION1260576 quotes four phone/sounder pairs only. Source each Telephone JB
  at one per site (four total) from MTO C1 A-3; keep its cost unposted.
- Existing Prosper24051 item4 is THB22,000, nominal 200×200×120mm, with three
  M20 cable entries plus a dedicated drain. MTO is 200×120×200mm and four
  entries plus one spare. Envelope axis order, exact GA/entries and current
  price are unresolved. Candidate four-box cost THB88,000 is not posted.
  Item3's THB24,500 300×300×160mm JB is a different configuration.
- Telephone gland requirements are 28 M20, five M20S and five M20 plugs;
  no inherited MGW phone-package credit is assigned to the selected EXION offer.
- MGW UHF-4 includes 300m feeder and 18 connectors overall. MTO's DMR 21
  connectors, 11 M20 and seven M25 require exact circuit/entry/type matching;
  do not automatically buy three connectors or treat BDA M20 as surge M25.
- A1's partial allocation already contains 483m CAT6A-equivalent and seven M20
  glands, THB260,232 total. MTO T6 is 400m, differently distributed: GF52,
  ZPQ60, ZWP8 192, ZWP11 96. No automatic 83m credit. T4 is 35m, T5 535m,
  bonding 16mm² five metres. No additional source contingency is applied.

## Existing Bulk view

Add the exact 57 Telecom Vendor source rows and all 18 original MTO columns to
a source snapshot. Expose a filter-aware table in the existing Bulk view.
GF aggregate quantities are never multiplied by four or silently divided.
Unknown matching inclusions, net purchases and costs remain NULL. This source
schedule does not post additional costs and its complete quantity coverage is
not described as complete price coverage.

## Validation performed

- `node frontend/scripts/validate-0553-mto-c1-reconciliation.cjs`
- `node frontend/scripts/validate-0553-zwp11-mto-c1-new-cabinet.cjs`
- Existing Rev03 cost reconciliation, using the runtime bundled Babel transformer.
- Existing Bulk JSX parsed with Babel; generated report tables/source counts checked.

The actual financial model, aggregation, USD release and customer breakdown run
in the validators. B/C and unrelated financial parts are preserved; nine A2
leaf quote changes are limited to three legacy allowances and six rounding
effects. Four unpriced JB rows receive sourced quantities only. No full app
build/browser or customer export was run. No supplier/customer message sent.

Sources: MTO Drive 16IAvn3WCO2CuJME8lpl6gUt3wfoDZ5us;
EXION 13iGJllNfjuw8iME2mXcddnmRTt4ov-mk;
MGW R2 1DLaku-mj2uYI-7A_E3z5QFZQgbz6OozA;
Prosper24051 19XSRRU_p8S-2JlSin82T4pdoOD4QOMGh.
