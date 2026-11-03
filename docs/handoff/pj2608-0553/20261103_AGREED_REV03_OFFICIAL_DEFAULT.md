# Agreed Rev03 is the Official default

Owner source: https://docs.google.com/spreadsheets/d/1WH3MEJifWoSZ9R_CLLhg7GNu8fSK0dnA/edit

The prior change corrected live Working/A1–A4 prices, but 10.3.4 still defaulted
to the historical submitted Rev02 workbook. This reproduced an unwanted B11
USD5,100 offer and obsolete B/C contents. Matching only the live summary did
not verify the actual default displayed quote.

Official now defaults to the owner's exact selected Rev03 workbook, with six
Scope/B/C tabs. Snapshot cells, cached values, number formats and merged ranges
come from the downloaded linked XLSX. The original file is preserved under
`frontend/public/project0553/releases/Rev03/4-Scope-of-Supply-Rev03.xlsx`.
Its 146,675 bytes and SHA-256 are independently verified:
`d350b023e3b24a2fbdbf2ed9285e55fc10d956235461edc906bc34e23fb6333e`.
This is byte-identical to the earlier uploaded Rev03 file, so prices are not
changed by choosing the authoritative linked document.

| Annex | Offered rows | USD |
| --- | ---: | ---: |
| B10 | 11 | 12,960 |
| B11 | 0 | Not separately quoted |
| B13 | 3 | 1,530 |
| C1 optional | 6 | 181,100 |
| C2 optional | 11 | 27,220 |

B10 excludes RACON commissioning spares. B11's historical four candidate
source functions remain nonposting/internal; the quote offers no separately
priced tool rows. C1/C2 stay outside A+B USD894,910. Every offered line's item,
TAG, description, specification, materials, quantity, unit price, amount and
option lead time matches the linked file. The current calculated model and
generated export were checked as well as the exact read-only default view.

10.3.3 customer Annex tabs use the same agreed sheets. Internal source
navigation retains the canonical cost owners and row identities. A1–A4 remain
current calculated Source/Working detail in 10.3.3. Official has no A detail
tabs. Rev02 remains immutable under an explicit History button, with its own
source link/download. Working calculation is a third explicit choice; it does
not overwrite the agreed quote.

Verification includes real component click rendering for all five default
Annexes and Release tabs; explicit Rev02 history and return to Rev03; all
twenty summary values; exact detail contents; source-file hash; actual native
ten-sheet export; and unchanged internal JB cost. No new quote submission or
customer acceptance is asserted. No full app build/browser validation claimed.
