# PJ2608-0553 — MR0001–MR0004 BULK Physical Completeness / Source-to-Release Audit
**Date:** 2026-10-22  
**Project:** PJ2608-0553 SAMTEL–PTTEPI MM-ZTK Z1F-JUTAL  
**Controlled branch:** `audit/pj2608-0553-bulk-source-to-release-20261022`  
**Upstream parent:** latest integration of Release + BULK + B/C Financial Identity, PR #30 head `82afbbb4a11294c2d2ee63a9fa0135fc0bb03fc4`  
**Change class:** engineering-source/read-only Audit; NOT an approved OEM model, BOM procurement or customer quote.

## Source of truth and Scope (17 applicable MR × Location; 28 reviewed slots)
| MR | Location | Scope source | MTO / MR requirement |
|---|---|---|---|
| MR0001 | ZWP20, ZWP21, ZWP22, ZWP23, ZPQ, ZWP8, ZWP11 | `snapshots/mr0001.mto.rev04.sourceRows.json` extracted from `PJ2608-0553_MTO_MR0001-0004_SUBMIT_Rev04_20261006-Update.xlsx` | MTO displayed source index **11/20/29/36/41/47/52**, one Bulk Material Lot each; cable glands, coax, grounding and TC0001 Items 7–8 fire-performance references |
| MR0002 | ZWP20, ZWP21, ZWP22 | `MM-ZTK-1F-GEN-TEL-MR-0002 Rev.C1` pp10–11 and DMR MTO Rev04 | One Bulk Material Lot PER PLATFORM; fire-resistant RF coax, Ethernet, glands, grounding |
| MR0003 | ZWP20, ZWP21, ZWP22, ZWP23 | `MM-ZTK-1F-GEN-TEL-MR-0003 Rev.C1` pp10–11 | One Ex phone/sounder/JB System per platform; Special Cable **if required**. **NO** separate Bulk Material MTO Lot is authored. Trace distinct powered, control and PoE cables to WIR/TER. |
| MR0004 | ZWP20, ZWP21, ZWP22 | `MM-ZTK-1F-GEN-TEL-MR-0004 Rev.C1` p10 | One RACON system per platform plus **ONE Adapter and Charging Kit per PHASE**. The phase kit appears in all site source sections but is NOT three equipment purchases. Verify MGW package and B11 tools owner before cost adoption. |

**Source identity limitation:** `sourceRowIndex` values 11/20/29/36/41/47/52 are indexes from the existing Rev04 extraction; the native Excel physical cell row numbering must be checked before native-cell transmittal. Preserving the Source tag/row mapping does not make quantities AFC-certified.

## Engineering and Commercial Control
- **MR0001 A5**: existing 7 × THB37,176 source working-cost components = THB260,232 = 69m CAT6A × THB524 + 1 M20 historical THB1,020 / location; source ledger allocation remains partially budgetary. These are not approved installed quantities or a complete Bulk quote. 10.5 presents A5 only as a NON-ADDITIVE disclosure inside MR0001/A1 cost.
- **MR0002**: MGW P26-058_R2 full combined UHF-4 includes FORLLER 100m + six male RF connectors per site. MGW complete-system functional installed RF cable and corrective shortage/non-compliance remains vendor obligation under agreed scope. NEK SHF1 `SM000111.pdf` is an optional, unpriced ADDVALUE installation/damage BULK spare reserve, *not* a second base installation feeder, B10/B11/C2 or automatically added cost. Fire resistance under IEC60331 is NOT proven by the IEC60332 flame-retardant evidence.
- **MR0003**: MGW PHONE-1 includes Gai-Tronics phone, EATON DB3B and WAROM JB with gland. Source does NOT have a separate Bulk line; site cables, sounder control, PoE, external Ex glands and MCT require measured WIR/TER/OD/Ex/SPE review. No copied MR0001 prices.
- **MR0004**: MGW RACON-1 includes SeaBeacon 2 + DB-5P; different control box/programming kit/cables/Ex glands, plus MR one-per-phase Adapter/Charging Kit, require explicit vendor evidence. No ORGA quote assumed included; one phase kit not 3 × priced by site.

## Code / Reconciliation
1. `data/bulkMrLocationCoverage0553.js` maps original seven MTO rows dynamically to the exact Rev04 snapshot and fails if site/row/one-Lot identities diverge. Adds MR0002 one-Lot Scope anchor, MR0003 special-cable conditional, MR0004 one-shared-phase adapter/charger and MGW correction ownership for RF extension. All such new evidence rows are nonposting.
2. `data/bulkSourceToReleaseTrace0553.js` derives 17 applicable site/system scope pairs; checks minimum technical function identities; associates each with the authoritative MTO/MR source, Source MTO Row, canonical 10.1 Working projection and customer A1–A4, without generating prices. All unresolved material quantity/certification evidence leads to `SOURCE_TO_RELEASE_HOLD`.
3. `BulkSourceToReleaseAudit0553.jsx` shows source → engineering BULK → working cost → customer stage at 10.1.1.3 and internal 10.3. Different BOM/Release module IDs avoid duplicate DOM navigation. Audit can open source row via exact copied module ID.
4. `ReleaseCustomerWorkbook0553.jsx` has internal **`A-BULK` HOLD** gate. No customer-side internal cost disclosure; official six-sheet export/Release remains unchanged and HOLD.
5. `data/bulkModuleNavigator0553.js` derives new `bid.budget.bom.bulk-source-to-release` and site-level `...mr000X.bulk.source-to-release` navigation targets from the same source data model.
6. `frontend/scripts/validate-0553-bulk-source-to-release.cjs` plus required `npm run validate:0553-bulk-source-to-release` in `npm run build`: asserts exact seven original Rows, 7+3+4+3 scope, supplier owner, MR4 one phase shared kit, all required item identities present, no new A/B/C posting, unchanged A/B/C Release serialization before/after derivation.

## Source → Release Governance
`MR/MTO Rev & TC` → `Requirement and Functional Circuit` → `10.1 Engineering BULK evidence` → `approved Qty/SKU/Ex/Fire/OEM inclusions` → `canonical 10.1 Working Part A and 10.2 B/C` → `10.3 source-driven preview / Release HOLD` → `10.5 Scope read-only` → `approved signed customer XLSX (NOT ISSUED)`.

Cannot certify complete Bulk from source Lot pricing alone. Outstanding gates: full AFC cable route / actual cable end WIR/TER; approved cable OD and certified gland; fire-resistance certificate/technical deviations TC0001 Items7–8; complete MGW vendor included/excluded accessories and MR4 adapter/charging kit proof; cost owner and unit rates for any separately approved nonincluded base/conditional spare; procurement/spares B10/B11/C2 segregation; verification that no A5/MR quote was posted twice.

## Tests / Status
Readback source-model smoke with actual controlled MR0001 Rev04 JSON and actual MGW selected-quote JS passed: 28 total audit slots, 17 applicable (7/3/4/3), exact rows 11/20/29/36/41/47/52, A5 THB260232 unchanged, new posting 0, 1 shared MR4 kit, complete launch Release FALSE, and source-to-release root mounted in 10.1 and internal Release.
**NATIVE npm/Babel/React SSR/Webpack and interactive UI have NOT been run on user's workstation.** This branch must remain review-only until `npm run validate:0553-bulk-mr-location-coverage`, `npm run validate:0553-bulk-source-to-release`, selected MGW and Release/B/C tests, and full `npm run build` pass. No merge, no customer submission.
