# Telephone JB allowance restored to active Working cost

Owner reconfirmed on 3 November 2026 that Telephone JB had already been
instructed and budgeted. Do not treat absence from the EXION quotation as proof
that no internal JB allowance exists.

## Existing evidence and cause

- `approvedBudgetBasis0553.js`: one JB per required telephone, historical
  PROSPER item 3 rate THB24,500, approved internal budget policy.
- `mr0003SelectedPrice0553.js`: EXION telephone/sounder plus PROSPER JB selected
  across ZWP20/21/22/23; equipment reference THB231,500/site, THB926,000 total.
- `mr0003ProductCostLedger0553.js`: already shows those four JB allowances.
- The active `mr0003MgwWorkingBom0553.js` retained only EXION phone/sounder
  THB828,000 and left its four stable JB rows nonposting. That disconnected the
  active Working/Release cost path from the existing selected budget ledger.

## Restored Working cost

| Cost | Qty | Unit THB | Total THB |
| --- | ---: | ---: | ---: |
| EXION phone | 4 | 145,000 | 580,000 |
| EXION sounder | 4 | 62,000 | 248,000 |
| Existing PROSPER JB allowance | 4 | 24,500 | 98,000 |
| Equipment budget | | | 926,000 |

Keep existing `ZWPxx-MGW-PHONE1-JB` identities and `TCAB-504-001`, one at each
required site. Reuse the selected rate rather than create another price owner.
The field-bulk JB mirror remains non-additive. PROSPER item 4 THB22,000 remains
an unselected alternate configuration, not a second posting or replacement.

The historical allowance is not a current supplier quotation or technical
approval: item 3's 300x300x160/four-entry comparable differs from the MTO
200x120x200/four-plus-one-entry requirement. Additional glands, final assembly,
certification and current procurement price remain open. The equipment budget
is not a complete turnkey system cost. No spare complete enclosure is added.

## Commercial independence

Hold A3 at the submitted USD34,200 despite restoration of internal cost.
Working cost-derived sell is a separate THB1,203,800 using the existing factor.
The immutable submitted Rev02 workbook remains byte-for-byte unchanged at
A+B USD902,900. The separate current draft remains USD894,590; no new revision
is issued, no email is sent, and no customer price increase is made.

## Verification

- `validate-0553-telephone-jb-working.cjs`: real active BOM -> Working ->
  Official data path, four stable JB rows, one posting each, product-ledger
  reconciliation, field-bulk non-addition, technical gates and fixed A3 price.
- `validate-0553-mto-c1-reconciliation.cjs`: 57 source rows and MTO mirror
  remain nonposting; alternative JB rate remains unselected.
- `validate-0553-submitted-part-a-price-hold.cjs`: source immutability and
  customer totals/child allocation reconcile after internal cost restoration.
- `validate-0553-submitted-release-rev02.cjs`: original workbook hash, all ten
  submitted worksheets and historical commercial amounts remain unchanged.

No full application build or browser inspection is claimed.
