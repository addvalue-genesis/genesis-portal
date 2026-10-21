# PJ2608-0553 / 10.2 — Hierarchical Price Table Standard (2026-10-21)

## Mandatory: READ EXISTING SOURCE CODE FIRST
Before adding any B1–B14/C1–C2 module, read the current Git branch and all of:
- frontend/src/project0553/data/bcTurnkeyWorkingCost0553.js (canonical owner/pricing)
- frontend/src/project0553/workstreamOwnership0553.js (owner/routing)
- frontend/src/project0553/CommercialWorkspace.jsx (10.2 rendering)
- frontend/src/project0553/data/releaseCommercialModel0553.js (10.3 projection)
- frontend/src/project0553/data/scopePartBcReadModel0553.js (10.5 projection)
- frontend/src/project0553/data/bcModuleNavigator0553.js (Module IDs/deep-links)
- The owner-specific vendor/requirements/WBS/read-model/rendered components before changes.

## Future Module Contract
Every module and submodule needs a STABLE unique Module ID, hierarchical number, source evidence,
exact Cost Owner, original Qty/Unit/Rate, display currency, Working SELL contribution,
separately displayed supplier/vendor quote and historical/audit references, Direct Cost status,
approval gate, Copy Module ID, native nested +/- plus Expand All/Collapse All.

Use frontend/src/project0553/data/workingModulePriceTableContract0553.js.
A future module must declare exactly one price class:
- INCLUDED_WORKING_SELL: appears ONCE as part of canonical owner Working SELL
- SUPPLIER_QUOTE_REFERENCE: vendor quote SOURCE only, never automatically added
- HISTORICAL_REFERENCE: superseded amount not summed
- NON_POSTING_AUDIT: mirrored total / requirement / scope / unknown input, not another line item

No number for an unknown input: use NULL and show an em dash / NOT ESTABLISHED.
Read-only references may show historic THB or original quoted USD but must NEVER be rolled up.
Every new module must be registered in Project Module Navigator, point to only one DOM
data-component-key, and support expanding ancestors from an exact deep-link.
Re-run SSR, 10.2/10.3/10.5 reconciliation, source-evidence audit, build and browser acceptance.
No automatic customer release, workbook export change, Cost Ledger mutation or PR merge.

## B3 Active price hierarchy (THB, no duplicate posting)
| Group | ID suffix | INCLUDED Working SELL | SOURCE REFERENCE / NON-ADDITIVE |
|---|---|---:|---|
| FAT B3.1 | fat | 397,400 | MGW supplier USD7,500, historic Bangkok THB144,000 |
| B3.1.1 | mgw-r2-cover-20261020 | — | MGW SERV-2 iFAT USD5,000 and SERV-4 facility USD2,500 |
| B3.1.2 | revk-china-budget | 397,400 | ADDVALUE 8 FAT witness/travel/insurance expense lines |
| B3.1.3 | fat-owner-transfer | — | Rev05 Bangkok FAT THB144,000 superseded |
| SAT B3.2 | sat | 2,016,000 | Offshore SAT 40 team-days / 80 person-days |
| B3.2.1 | 40-day-abc | 2,016,000 | USD800/person-day × FX31.5 |
| B3.2.2 | site-mr-sat-matrix | — | 21 coverage Test IDs not 21 priced jobs |
| Tools B3.3 | tools | 30,000 | VeEX rental |
| B3.3.1 | veex-mx100 | 30,000 | 30 rental-days × THB1,000 |
| B3.3.2 | test-tools-ownership | — | Permanent handover tools B11, no extra |
| Audit B3.4 | audit | — | B3 full THB2,443,400 is a mirror only |
| B3.4.1 | working-sell-breakdown | — | Mirror of 3 included sell buckets |
| B3.4.2 | requirement-crosswalk | — | 19 contract obligations |
| B3.4.3 | source-cost-audit | — | Historic / direct-cost gaps |
| TOTAL | b3 | 2,443,400 | supplier, historic, audit excluded |

## Commercial boundaries
MGW SERV-1 USD8,000 engineering/PM/VDRL is Part A/B1/B2 responsibility check, not B3.
SERV-2+4 USD7,500 MGW iFAT and facility is supplier PRICE EVIDENCE; actual payer/Part A
inclusion remains OPEN. B3.1.2 ADDVALUE witness budget is not supplier cost. 
SERV-3 USD500 packing B5 and SERV-5 USD2500 freight B6 may overlap;
do not deduct without vendor confirmation. B9 Yard service THB233,600 is conditional, excluded.
Resolve 2-day iFAT, min5-day facility, 6 ADDVALUE witness days, and OEM/ADDVALUE RACI before approval.

## Validation commands
npm run validate:0553-b3-hierarchical-price-table
npm run validate:0553-b3-breakdown-module-ids
npm run validate:0553-project-module-deep-link
npm run build
