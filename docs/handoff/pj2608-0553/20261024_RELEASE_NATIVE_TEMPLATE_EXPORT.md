# PJ2608-0553 — direct Release Excel export with original template

## Owner decisions

- Fix text overflow/font and row sizing in the actual Excel downloaded from Release.
- Export directly without repeatedly selecting an original file.
- Preserve the original template size: column widths, paper size, orientation, margins, print settings, merged cells, sheet names/order and cell addresses.
- For future CCL/MR/TC/TE, retain immutable Original by project/document/revision; export a new populated copy each time. This turn does not implement a general document registry or DB/manual-input refactor.

## Implementation

`nativeReleaseTemplate0553.json` embeds the original `4-Scope of Supply.xlsx` bytes, SHA256 `2d62a29f830c516fea6891fe1d7a63a9cef00487c777dcd0933dc72452f70701`. It is an original form asset, not another price ledger. The primary **Export Excel — WORKING DRAFT** button creates a browser File from this copy, then uses the existing source-derived exporter. No file chooser or template network request is needed. The secondary **Use another original template…** retains the original local-file workflow for the same six-sheet schema; arbitrary CCL/MR/TC formats are not supported by this mapping.

The exporter retains native ZIP parts, original sheet order, merges, column widths, page setup, formulas, borders, fills and number formats. It appends cloned body/header styles with Arial10, text wrapping and top alignment; numeric cells remain numeric/right-aligned. Original style definitions remain available to unaffected cells. Row heights grow conservatively to fit text, including merged description cells. Empty reserved rows retain their size. No shrinking-to-fit or clipped-text substitution. An explicit warning is returned if a future cell needs more than Excel's409pt maximum row height.

The source-derived B3/B9 compact cell wording is shared by preview and Excel through `serviceCommercialBasis0553.compactText`. Excel adds it to the existing description in B26/B32 with no extra row. A1–A4 D8:D11 show the same unique source Locations. This supersedes prior handoff statements that these UI details were not exported. B3/B9 amounts, day/rate proposals, all other prices, C unquoted status and final Release HOLD remain unchanged.

## Verification

- Native exporter validation runs against both synthetic edge cases and the embedded original by default. It verifies the template SHA, all16 annex row mappings, A/B prices, C unquoted status, source locations, same-cell service text, unchanged native structural XML/columns/page setup/formulas/merges and unrelated ZIP parts.
- Original fonts/XFs are retained and clone counts match actual XML elements. Re-exporting an already generated file is byte-identical: no repeated service notes or accumulating styles.
- Native export, service-basis, release-CFO, change-registry and spare-owner validators passed; production webpack passed with the existing3 size warnings.
- Browser verified direct download with zero filechooser events, valid success state and no page errors. Customer/Internal compact notes retained; four viewport checks passed.
- The downloaded native XLSX was imported and rendered using Artifact Tool, reviewing all six changed tables and the main service rows. This is not a claim of testing in desktop Microsoft Excel; exact pagination may vary with installed fonts. Layout sizing retains the original width/page setup while row growth can increase printed page count.
- Whole source/Working/Release snapshot remains equal after excluding only the added `compactText` presentation property.

No merge/deployment/customer submission. No MGW request, DB/global Manual Input changes or invented requirements1–8.
