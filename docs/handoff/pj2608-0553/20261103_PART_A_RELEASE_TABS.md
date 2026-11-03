# A1–A4 tabs displayed in 10.3.3 Release

Owner request: move A1–A4 detail tabs out of 10.3.4 Official Release and into
10.3.3 Release. This is a UI placement change, not a commercial revision.

- 10.3.3 tab order: Scope of supply, B10, B11, B13, C1, C2, A1 MR0001,
  A2 MR0002, A3 MR0003, A4 MR0004.
- The four moved sheets use the exact frozen submitted Rev02 worksheet
  objects, cells, values, number formats and merged ranges. The revision and
  USD currency are labelled beside the selected sheet.
- 10.3.4 shows six Scope/B/C tabs. Part A summary totals remain in Scope of
  supply. The separate live Part A breakdown stays in 10.3.3, with source
  return navigation targeting Release.
- The original ten-sheet Rev02 download is unchanged. Live draft export
  routines, amounts, Working cost (including the restored JB allowance),
  quantities, FX, existing module IDs and approval gates are unchanged.

Verified with `validate-0553-submitted-release-view.cjs`: real component
render/click harness checks six Official tabs, ten Release tabs, all four
moved sheets, exact shared worksheet identities, one selected tab, source
snapshot immutability and original download link. Also ran
`validate-0553-submitted-release-rev02.cjs` to verify the full original
workbook hash and submitted/live price independence. No full app build or
browser validation is claimed.
