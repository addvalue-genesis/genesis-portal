# A1–A4 tabs in 10.3.3 use current calculated Rev03 detail

Owner corrected the prior implementation: do not display archived Rev02 Part A
worksheets in Release. Uploaded `4-Scope of Supply Rev03.xlsx` is the current
commercial price reference, not evidence of customer issue or acceptance.

| Target | USD |
| --- | ---: |
| A1 | 241,290 |
| A2 | 137,130 |
| A3 | 34,200 |
| A4 | 292,500 |
| A+B | 894,910 |
| Optional C1 | 181,100 |
| Optional C2 | 27,220 |

Reference SHA-256:
`d350b023e3b24a2fbdbf2ed9285e55fc10d956235461edc906bc34e23fb6333e`.
Parsed reference is `data/snapshots/release.rev03.20261103.json` with exact
source cells and all 20 A/B/C amounts/N/A values. The original uploaded file
has six sheets; the A1–A4 detail is generated from current Source/Working.

10.3.3 retains A1–A4 tabs after C2, but now builds them from the same current
`buildCustomerPriceBreakdown0553(model, quotedRelease)` used by active Excel
export. Every current row preserves site, MR, TAG, source key, quantity and
price status. Qty × USD unit prices roll into the matching MR total with zero
variance. Internal Source links retain existing canonical module identities.
The existing fixed-total allocation uses the owner Rev03 targets without
changing vendor costs, FX31.5, markup, quantities or cost owners.

Four telephone JB allowances remain THB98,000 once in equipment Working
THB926,000. Positive new ZWP11 enclosure and superseded LNA nonposting
handling remain. Technical and final procurement gaps remain open. A3 JB rows
are correctly described as junction boxes rather than phone/sounder packages.

10.3.4 retains Scope/B/C tabs. Archived Rev02 USD902,900 remains separate and
immutable, with its original ten-sheet download. Active draft and A1–A4 use
Rev03 USD894,910; no new issued quotation or acceptance is asserted.

Verification: real Source → Working → calculated Release checks all20 uploaded
summary targets and four MR detail subtotals; actual ten-sheet XLSX generation
checks summary cell values, detail cached subtotals and parent formulas;
component click harness confirms all four tabs render current source rows and
Rev03 prices, with no archived Part A renderer. Historical workbook hash and
telephone cost/non-duplication checks also pass. No full app build/browser
validation is claimed.
