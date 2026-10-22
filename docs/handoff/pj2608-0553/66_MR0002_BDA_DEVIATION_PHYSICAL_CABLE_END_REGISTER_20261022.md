# PJ2608-0553 — BDA Deviation Rev00 Item 1.1 and Physical Cable-End Register
**Date:** 2026-10-22
**Branch:** `feat/pj2608-0553-bda-deviation-cable-end-register-20261022`
**Based on:** Source-to-Release Audit draft PR #31 + AFC Tag Role Crosscheck draft PR #32
**Customer release:** HOLD; **MGW base package:** unchanged; **Direct Cost and Working Sell:** unchanged

## Source evidence
User-provided `5-Deviation List Rev00.xlsx`, sheet `Deviation List`, row 13 `A13:K13`:
- MR0002 / Item **1.1**, `Status=Open`, **PURCHASER's Reply blank and COMPANY's Reply blank**.
- Original DTS/SPE/LAY customer requirement: LNA +22 dBm; gain 40 dB; 31 dB attenuator; 8-element Yagi 14–20 dB; original Yagi and Omni on Mezzanine E&I Rooftop.
- BIDDER proposed: **RFI offshore BDA**, composite output **+33–36 dBm**, adjustable gain **60–80 dB**, AGC, oscillation mute and selective DMR filters; RFI **YBSS6 six-element 11 dBi** donor Yagi `ANT-508-001` at **EL +21.100m**; move `ANT-508-002` Omni **beneath Lower Deck EL +18.300m**.
- Site-specific approved AFC `LAY-0001 Rev.C1` TAG identity preserved: ZWP20 Surge TCAB-508-001 / original LNA TCAB-508-002; ZWP21/22 Surge TCAB-508-002 / original LNA TCAB-508-001.
- **BID SELECTED != CUSTOMER APPROVED**. Deviation 1.1 is Open; no site relocation, replacement certification, cable length or procurement qty is approved.

## Physical Cable-End Register
`data/physicalCableEndRegister0553.js` provides 61 *FUNCTIONAL ENDPOINT CANDIDATES*, NOT 61 signed installed cable runs:
- MR0001 (7 sites × 4) 28: ODU Ethernet, outdoor RF jumper, power/PoE and grounding/glands; retain 7 source MTO bulk rows 11,20,29,36,41,47,52 and partial A5 existing price.
- MR0002 (3 sites × 4) 12: Donor RF, service RF, new BDA DC/alarm and RF bonding/Ex glands. Differentiates customer AFC rooftop Omni and proposed underside Lower Deck Omni. For ALL sites `verifiedInstalledLengthM=null`. FORLLER 100m/six connectors remain MGW bundled vendor base (under accepted supplier scope), not a proposed second purchase.
- MR0003 (4 sites × 3) 12: Phone network uplink, sounder control/power, Ex glands/earth. The source is 1 phone system/site, *Special Cable if required*, not a separate 1-Lot MTO record.
- MR0004 (3 sites × 3) 9: RACON/DB interface, RACON fault alarm to PCS (customer BLD note 4), power/Ex/earth. **One shared adapter and charging kit per Phase** remains a separate non-cable source requirement, never multiplied by 3 sites.
- Field set for every line: `fromTag`, `toTag`, AFC decks, proposed deck, cable family, quantity basis, termination/gland evidence, cost owner/vendor inclusion, supplier source, `verifiedInstalledLengthM=null`, `procurementQtyM=null`, `unitRateTHB=null`, `incrementalWorkingTHB=0`, approval false.

## UI + Single Source-of-Truth Bridge
- `PhysicalCableEndRegister0553.jsx` mounts under `BulkSourceToReleaseAudit0553.jsx` in `10.1.1.3`. It exposes the same 61 source candidates and gives copyable Module IDs (`bid.budget.bom.zwp20.mr0002.cable-end.dmr-service-rf`).
- `bulkModuleNavigator0553.js` derives the 61 cable-end Module IDs automatically (no manual duplicate register).
- `bulkSourceToReleaseTrace0553.js` reports 61 candidates and explicit `BDA_DEVIATION_REV00_ITEM_1_1_OPEN` evidence and remains `releaseAllowed=false`.
- `mr0002RfPhysicalRouteReconciliation0553.js` now labels the 9.144m grid+3m preliminary same-deck AFC scenario **INVALID for the Open BDA proposed relocated Omni**. The provisional 14m-per-path illustration is NOT a technical or commercial BDA quote.
- `MR0002RfRouteReconciliation0553.jsx` displays the exact BDA/RFI/YBSS6/Omni change and Open status next to AFC tags.

## XLSX Deliverable
A **new separate internal workbook**, not a modification of the customer's original deviation:
`PJ2608-0553_Physical_Cable-End_Register_MR0001-0004_BDA_Deviation_Rev01_20261022.xlsx`.
Sheets: CONTROL, CABLE_END_61, BDA_DEVIATION_1_1, MR_LOCATION_SCOPE, PHASE_SHARED_KIT, SOURCE_AUTHORITY. Original deviation row A13:K13 transcribed including Open and blank replies. Numeric approved quantities and rates left blank (NULL), gated approval formula does not extend cost without explicit approval.

## Mandatory close-out before customer submission
Client accepts BDA proposal and Omni relocation; OEM/RFI BDA GA and chosen Ex housing; RF isolation margin / actual channel RF link budget; YBSS6 mount clearance; 3D/EL coordinate of beneath Lower Deck Omni; WIR/TER Cable From-To and deck-to-deck tray route; current Fire Resistant IEC60331 and connector/gland/earth qualification; MGW cable-delivery kit trace and supplier included/excluded scope; independent NEK contingency/commissioning/long-term spare lifecycle; MR0004 phase-shared kit price owner.
Source-to-Release remains HOLD until accepted. No original LAY/BLD/Deviation PDF/XLSX files were edited. No customer sell/official workbook release changed.

## Validation
Direct attached workbook `artifact_tool` import confirmed item 1.1 Open and blank buyer/company replies. Local workbook exported with 61 rows and approval-gated cost formulas; automated scan found no Excel formula errors.
GitHub read-model smoke against current original MTO snapshot + selected MGW model passed: 17 scope pairs and 61 structural lines (28/12/12/9), W20/21/22 proposed Omni deck differs from AFC, no approved lengths, increment 0 and Release HOLD.
**Native Node/Babel/webpack/React/browser checks still need to be executed on user's workstation before PR merge.**
