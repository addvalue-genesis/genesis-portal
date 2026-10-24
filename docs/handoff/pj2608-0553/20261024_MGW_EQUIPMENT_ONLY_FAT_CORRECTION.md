# PJ2608-0553 — MGW equipment supply only / FAT correction

Owner correction on 24 October: MGW supplies MR0002 equipment only. It does not execute integration, FAT, witnessed FAT or provide the test facility. This supersedes the THB307,125 retained service reserve in the earlier urgent pricing review and commit c6699aca.

## Source change and exact effect

Removed the complete former SERV-2/SERV-4 service allocation from the existing canonical owner: USD5,000+2,500 ×31.50 ×1.30 = THB307,125. No replacement reserve was introduced. The raw supplier quotation remains immutable historical evidence, with no selected service rows. This is withdrawal of a budget selection, not a vendor-agreed credit or a statement that local facilities are free.

| Item | Previous working SELL THB | Corrected working SELL THB | Change |
|---|---:|---:|---:|
| MGW integration/FAT/facility reserve |307,125.00|Excluded|−307,125.00|
| ADDVALUE local FAT labour |245,700.00|245,700.00|Unchanged|
| Local transfers |8,000.00|8,000.00|Unchanged|
| Work insurance |10,000.00|10,000.00|Unchanged|
| FAT group total |570,825.00|263,700.00|−307,125.00|
| B3 including unchanged SAT, survey and VeEX |2,440,425.00|2,133,300.00|−307,125.00|
| Known Part B |4,884,182.13|4,577,057.13|−307,125.00|
| Known A+B selling preview |27,081,734.36|26,774,609.36|−307,125.00|

All A equipment prices, including MGW MR0002 RF, and every other B/C selected owner remain unchanged. B9 China yard assistance, offshore SAT and B8 training are preserved. CIF route and existing logistics allowances are unchanged.

Against the original verified 78db7925 baseline, A SELL increases20,831.85; B SELL decreases466,025.00; known A+B decreases445,193.15. B4/B12/B14 and C1/C2 remain unpriced. The known-price preview is not a complete customer quote.

## Financial and interface behavior

- Supplier-service allocation, quoted selected purchase base and associated 20%/5%/5% amounts are zero because the service is excluded. Historical USD7,500 quote is retained only in historicalQuoteLines.
- B3 ordinary 5% SAMTEL deduction is THB106,665.00; supplier-service 20% deduction is zero. B3 receivable is THB2,026,635.00. No special service tariff or additional deduction remains.
- Active FAT hierarchy no longer lists the supplier services or their quoted cost/markup table. The existing group.01.site.01 link resolves to a withdrawn, nonposting notice; it does not display a priced replacement service.
- Dossier, hierarchy, financial identity, Scope and Release no longer present the former service as selected. The old module IDs remain compatible for trace; identifiers do not select a supplier.
- Source → Working → Budget → Release → Scope/native remains one calculation path. No direct edits to Release totals or commercial formula were needed.

Warehouse facilities, any additional calibrated test equipment and any work beyond the existing six-day labour basis remain to be scoped and priced separately if needed. No free-use or complete-coverage claim. No MGW requotation, messages, DB/manual refactor, merge, deployment or customer release.

## Verification

Full local npm run build: PASS, 139 validators and production webpack (three bundle-size warnings). Following the exact withdrawn-link navigation adjustment, supplier-removal, project-navigation and dossier checks passed, and webpack rebuilt. Browser PASS: the exact requested group.01.site.01 resolves to the nonposting withdrawn notice; no307,125 or supplier-role row in the dossier; current B3 2,133,300; 16/16 annex source→release→source rows; customer/Scope prices, Final Release disabled, native browser download, zero page errors. Actual original six-sheet XLSX passed geometry/styles/merges and unrelated ZIP-part preservation. Browser native G26 is2133300. git diff --check PASS. New remote Windows CI result not claimed. The independent urgent-pricing check compares with the immutable reviewed c6699aca-equivalent snapshot, proving exactly307,125 removed only from B3, equipment A unchanged, B9 rows unchanged and supplier20% share reduced by47,250. Existing current-price guards were updated; raw quote/historical snapshot assertions remain intact.
