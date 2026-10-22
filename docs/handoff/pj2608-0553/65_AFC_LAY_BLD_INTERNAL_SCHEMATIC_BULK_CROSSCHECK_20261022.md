# PJ2608-0553 — AFC LAY/BLD ↔ Internal SCADA SCH ↔ BULK Model Crosscheck
**Date:** 2026-10-22
**Source:** User-provided PDF copies directly reviewed; do not treat PDF page numbers as drawing sheet numbers.
**Based on:** draft PR #31 / branch `audit/pj2608-0553-bulk-source-to-release-rebased-20261022`, commit `51108a24`.
**Scope:** MR0001–MR0004 installation evidence and source-to-release audit; **NO** customer price / OEM quote / Working Cost posting.

## Source priority and limitations
1. Customer `MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1`: 13 drawing sheets in 15-page PDF; AFC 04 Sep 2026. Physical equipment/deck and drawing TAG authority for ZWP20–23, not cable routing length or final approved DMR vendor replacement.
2. Customer `MM-ZTK-1F-ZWPX-TEL-BLD-0001 Rev.C1`: 7 drawing sheets in 9-page PDF; AFC 25 Aug 2026; functional links for ZWP20/21/22/23/ZWP8 and referenced ZPQ/ZWP11 existing elements. Not an as-built cable schedule / cable end WIR-TER or vendor BDA approval.
3. ADDVALUE/SAMART internal `MM-ZTK-1F-GEN-SCADA-TEL-DWG-0001_All.pdf` (Rev00, Issued for Bidding, 05 Sep 2026): 4-page internal schematic and `BILL OF MATERIAL` / `CABLE DETAIL`. Engineering CHECK SOURCE only: many cables appear as one `LOT`, not actual run lengths or termination quantities, and earlier 16-port switch and original LNA configurations appear. **Never promote** internal drawing to customer AFC, current selected OEM SKU, measured qty or pricing authority.

## Critical AFC site-specific enclosure role exception (confirmed PDF right-hand TAG tables)
| Site | AFC Drawing Sheet / PDF page | TCAB-508-001 | TCAB-508-002 |
|---|---|---|---|
| ZWP20 | Sheet 4 / PDF page 6 | RF SURGE ENCLOSURE (Ex d) | RF LOW NOISE AMPLIFIER ENCLOSURE |
| ZWP21 | Sheet 7 / PDF page 9 | RF LOW NOISE AMPLIFIER ENCLOSURE | RF SURGE ENCLOSURE (Ex d) |
| ZWP22 | Sheet 10 / PDF page 12 | RF LOW NOISE AMPLIFIER ENCLOSURE | RF SURGE ENCLOSURE (Ex d) |

Previous `z1fTelLayoutIndex0553.js` and `mr0002RfPhysicalRouteReconciliation0553.js` incorrectly applied W21/W22 TCAB function to ZWP20 and hardcoded donor/service cable endpoints to 508-001 as the BDA-side. **Corrected** original AFC source roles and site-specific functional endpoint mapping. These are concept paths, NOT approved site routing or 100m/MGW insufficiency proof.

## AFC legacy LNA versus selected MGW RFI BDA
Customer BLD Rev.C1 shows the original LNA on the new wellhead DMR function; existing brownfield BDA also appears on ZWP8. Selected MGW Full P26-058_R2 UHF-1 has RFI BD4345-00N0-AC BDA with WAROM Ex d housing. **Do not equate original client LNA TAG with approved MGW BDA installation** until customer-approved revised BLD/GA, frequency/RF link budget, power/alarm wiring, Ex assembly certificate and technical deviation are supplied. The updated `MR0002` route model keeps `selectedMgWBdaFunctionMapsToOriginalAfcLna=false`.

## Other crosschecks / hold notes
- MR0001 original MTO source bulk rows 11/20/29/36/41/47/52 and THB260232 A5 historical partial 69m CAT6A + 1 gland per WP remain non-additive. The LAY does not establish measured route lengths. BLD notes include Ethernet new L3 uplink and existing LAN-outlet relocation, requiring E&I room ELE-LAY-0002 plus cable end / WIR/TER takeoff. Do not blindly use 69m as a physical route.
- Internal Rev00 schematic refers to legacy 16-port SCADA L3 switch and older LNA, versus current TC0001 8-port Cisco / selected MGW BDA. Reconcile technical ports/PoE and approval; do not overwrite approved selected vendor/cost from the internal drawing.
- MR0003 Ex telephone/sounder appears across lower deck/E&I boundary; verify separate power/trigger, PoE and protective glands rather than a standard cable length for all systems.
- MR0004 RACON, control box and distribution box appear on UPPER DECK and connect to PCS fault alarm (BLD note 4). MR Rev.C1 Adapter/Charging Kit is one shared set PER PHASE; use one shared scope identity and no three per-site purchases. The internal drawing is a useful control-box/cable-type checklist, not an approved vendor quote.
- Brownfield ZPQ/ZWP8/ZWP11 must not gain imaginary deck coordinates from ZWP20–23-only AFC LAY. BLD has existing-system functional references but not a complete measured cable route.

## Code / source-to-release controls changed in separate audited branch
- `data/z1fTelLayoutIndex0553.js`: corrected ZWP20 physical TAG roles and explicit role identifiers W20/W21/W22 with exception descriptions.
- `data/mr0002RfPhysicalRouteReconciliation0553.js`: donor/service endpoint TAG derived from site-specific AFC enclosure roles; routes remain provisional; hold BDA proposed substitution, Ex, cable ends and WIR/TER; INTERNAL schematic is only check evidence.
- `MR0002RfRouteReconciliation0553.jsx`: clearly visible site-specific LNA/Surge TAG and selected MGW BDA technical-change HOLD.
- `data/bulkSourceToReleaseTrace0553.js`: adds AFC role and internal-source-authority distinction to 17 scope site/MR audit pairs and explicit MR0002 source→release hold.
- `frontend/scripts/validate-0553-bulk-mr-location-coverage.cjs` and `validate-0553-bulk-source-to-release.cjs`: assert exact W20/W21/W22 role matrix and no BDA approval / no new cost.

## Validation limits
Controlled code/readback mock source-model test passed for W20/W21/W22 accurate roles, 28 total MR/site slots, 17 applicable, original A5 260232 THB, new cost 0, Release FALSE. This is **NOT** native npm, webpack, browser, full cross-file build or customer-approved AFC redesign.
**Keep PR as DRAFT, do not merge into the actively changing B/C release branch until all native validators and build pass, and check updated GitHub HEADs for conflicts.**
