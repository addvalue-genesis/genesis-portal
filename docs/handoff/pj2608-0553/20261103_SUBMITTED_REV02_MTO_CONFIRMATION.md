# Submitted Rev02 is the Release default; MTO clarification does not reprice it

Owner supplied the authoritative workbook:
https://docs.google.com/spreadsheets/d/14WGYqVhcrqxL0CVvrcT95yQ8nosYwgMt/edit

File: 4-Scope of Supply Rev02.xlsx, 261,978 bytes, ten worksheets.
SHA-256: e5f044a5e309af29cd39395632dbefa6267daa722d5c16df79b4bf7c2189aa9f.
The raw download matches the previously extracted workbook byte for byte.
The original workbook and its exact cached cell values/merge ranges are now
preserved with the submitted summary and email provenance.

## Release selection

The existing `bid.budget.pricing.official` component defaults to Submitted Rev02,
30 October 2026, total A+B USD902,900. It renders the preserved worksheet values
and downloads the original workbook bytes. It does not call the live price
builder while this revision is selected. All ten original sheets are available.
History data is recursively frozen and the view has no price editing controls.

Working draft remains a separate explicit choice. Its internal calculations,
including the earlier USD894,590 commercial proposal under discussion, do not
replace or update the submitted workbook. This change does not issue a new
commercial revision, revise B10/B11/B13 or replace C1/C2 in submitted Rev02.

| Submitted Rev02 USD | Amount |
| --- | ---: |
| A1 | 241,100 |
| A2 | 137,000 |
| A3 | 34,200 |
| A4 | 292,500 |
| B10 | 16,200 |
| B11 | 5,100 |
| B13 | 1,500 |
| Total A+B | 902,900 |
| C1 optional, outside base | 97,500 |
| C2 optional, outside base | 23,000 |

## MTO reply

Gin's email asks whether the submitted price includes the materials and costs
marked Supplied by Telecom Vendor in MM-ZTK-1F-GEN-TEL-MTO-0001 Rev.C1.
The owner confirms commercial inclusion within the existing submitted budget,
with no price change. Record that decision separately from the frozen workbook.
Supplier cost and technical qualification work remains internal; it is not a
new customer price adjustment or proof of supplier package completeness.

Prepared reply only, not sent:

Dear Gin,

We confirm that our submitted commercial proposal includes all materials and
associated costs marked “Supplied by Telecom Vendor” in
MM-ZTK-1F-GEN-TEL-MTO-0001 Rev.C1.

The submitted total price remains unchanged.

Best regards,
Jack

## Verification

- Submitted Rev02 runtime: ten frozen worksheets, all summary prices, original
  XLSX hash/size, archived versus working independence and zero MTO price change.
- Release component hook harness: default revision, all ten sheets, original
  download, no live calculation in history mode, explicit Working selection.
- Existing Part A fixed-price/draft runtime still passes separately.
- JSX syntax checked. No full application build/browser or email send performed.

No new application module IDs are introduced. This is a verified single release
archive and selector; automatic capture of all future submitted revisions is
not claimed.
