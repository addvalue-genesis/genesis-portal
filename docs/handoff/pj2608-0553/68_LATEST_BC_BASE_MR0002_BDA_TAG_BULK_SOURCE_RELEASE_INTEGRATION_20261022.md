# PJ2608-0553 — Current B/C HEAD + MR0002 selected BDA exact TAG / BULK Source-to-Release Integration
**Date:** 2026-10-22
**Branch:** `integrate/pj2608-0553-bda-bulk-tag-rebased-20261022`
**Base:** `integrate/pj2608-0553-mgw-fat-financial-identity-20261021` @ `55892b7e3b43fab3687dd4845cc0ed54192a8d09` (rebased to include eight newer B5/B6/B7-linked logistics, validator and B/C navigation commits)
**Class:** controlled current-budget engineering & read-only cost trace, **NOT** customer approved release or accepted WIR/TER.

## Selected Engineering Design
Management 22-Oct-2026: **ONLY substitute original LNA with RFI BDA at the SAME original equipment location**. Keep installed donor Yagi ANT-508-001, service Omni ANT-508-002 and all enclosure/site equipment *positions* unchanged. The 5-Deviation List Rev00 item 1.1 says Omni beneath Lower Deck / YBSS6 relocation; those additional antenna changes remain recorded as historical **NOT ADOPTED** to our selected Working Design. Original Rev00 status Open and no Purchaser/Company replies; formal customer closure still pending but internal Budgetary Engineering proceeds at same position.

## Critical Canonical MR0002 Source Owner Fix
`frontend/src/project0553/data/mr0002WorkingBom0553.js` previously hardcoded `TCAB-508-001` at ALL WPs for RFI BDA, WAROM HRMD95-VIIIB enclosure, two M20 candidate gland entries, RF feedthrough, and `TCAB-508-002` as RF surge in included PolyPhaser source label.
Now `z1fTelLayoutIndex0553.js` provides **explicit functionRole**, not TAG numeric suffix:
| WP | Selected RFI BDA installed at original LNA TAG | Original RF Surge TAG |
|---|---|---|
| ZWP20 | TCAB-508-002 | TCAB-508-001 |
| ZWP21 | TCAB-508-001 | TCAB-508-002 |
| ZWP22 | TCAB-508-001 | TCAB-508-002 |

The same role-derived `bdaTag` governs actual `UHF-1` equipment/child enclosure/Glands/RF Feedthrough physical identity; `surgeTag` governs included UHF-2 PolyPhaser source evidence. The IDs `ZWP20-RFI-BDA`, etc, **stay stable**, preserving front-end Copy Module ID and working-to-release source refs. This is a TAG metadata correction, not a new invoice line or a vendor quote rewrite.
Selected `MGW P26-058_R2` USD31,474 UHF-1 + USD847 Yagi + USD21 Omni + USD846 FORLLER cable = **USD33,188/site**, **USD99,564 three sites**, unchanged. WAROM is included in UHF-1 and PolyPhaser in UHF-2, no double-post. Any estimated gland rate remains a historical/unapproved nonposted scenario.
OEM Ex assembly, connector/glands, actual feeder quantity and fire resistance remain unresolved.

## New read-only engineering evidence
Transferred ONLY controlled non-price sources from former BDA Same-Location work:
- `data/mr0002DeviationBdaRev00_0553.js`, `data/mr0002RfPhysicalRouteReconciliation0553.js`, `data/physicalCableEndRegister0553.js`
- `data/bulkMrLocationCoverage0553.js`, `data/bulkSourceToReleaseTrace0553.js`, `data/bulkModuleNavigator0553.js`, `data/z1fTelLayoutIndex0553.js` (correct ZWP20 role)
- UI: `BulkMrLocationCoverage0553.jsx`, `MR0002RfRouteReconciliation0553.jsx`, `BulkSourceToReleaseAudit0553.jsx`, `PhysicalCableEndRegister0553.jsx`, and carefully selected mounts in current `SimpleBom0553.jsx`, internal `CommercialWorkspace.jsx` and internal `ReleaseCustomerWorkbook0553.jsx`.
- 17 in-scope MR/site pairs; 61 **functional cable-end candidates**, not 61 measured installation cables; no manufactured buy Qty/rates. MR0004 one adapter+charging kit **per phase**.
- A5 existing source MTO seven rows 11,20,29,36,41,47,52 cost THB260232 **NON-ADDITIVE**; no new cost and no auto-release.

## Safeguards against updates in parallel B/C chat
Intentionally NOT copied the previous old Branch versions of:
- Rev03 pinned `LocationBomDetail0553.jsx` and protected manifest/ledger files;
- B1/B2/B3/B9/B10/B11/B13/C1/C2 price / cost evidence owners, `bcTurnkeyWorkingCost0553.js`;
- `workingBomAggregation0553.js` and `releaseCommercialModel0553.js`;
- `bartecGlandBulkSchedule0553.js` (current MGW WAROM vs historical BARTEC) and `spareEngineeringReconciliation0553.js` (MGW RACON USD75059 vs ORGA comparator USD75000);
- curated B/C `budgetChangeLog0553.js`, B5/B6/B7 linked logistics model/UI/validator, current 101-test npm diagnostic script. The Build receives only a new targeted source-to-release test; all previous validations are retained.

## Test status
- GitHub source read-back and role-based model execution with real current MGW quote and actual current LAY model passed: W20=002 BDA/001 surge; W21/W22=001 BDA/002 surge; USD33188/site, USD99564 MR2, no duplicate surge/WAROM amount, no antenna move, 7 original MTO bulk source rows.
- Existing `validate:0553-bulk-mr-location-coverage` unchanged. New `validate:0553-bulk-source-to-release` asserted current selected MR2 canonical TAG mapping/price and existing 17/61 Source-to-Release HOLD. Added after previous BULK validator before webpack production.
- **Native npm/Babel/React SSR/build/browser NOT EXECUTED ON WINDOWS.** Draft PR review only, NO merge until the build chain and module UI pass. The original customer documents and user Excel are untouched.
