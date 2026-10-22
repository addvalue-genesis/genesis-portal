# PJ2608-0553 — Selected Working Design: ONLY LNA → RFI BDA / All original locations retained
**Decision date:** 2026-10-22 (latest user instruction, overrides earlier design interpretation).
**Controlled branch:** `fix/pj2608-0553-bda-same-location-design-basis-20261022`.
**Scope:** MR0002 design basis and physical BULK takeoff ONLY; keeps MR0001–4 register structure and all A/B/C cost/sell unchanged.

## Critical decision
The project does not yet have an updated AFC drawing approving the modified RFI BDA arrangement, so **do not block internal budgetary engineering on customer approval**. For the current bid/Working Design, replace **ONLY the LNA with MGW-proposed RFI BDA** at the **exact same LNA equipment location** on each ZWP20/ZWP21/ZWP22 site. Preserve the reference layout positions of `ANT-508-001` donor Yagi, `ANT-508-002` service Omni, their elevations/decks, other enclosures and RF surge.

No selected transfer of the Omni beneath Lower Deck. Do NOT treat historical YBSS6 six-element/+21.100m antenna design as an additional adopted change by default; selected vendor parts must undergo separate requirements/compliance check without moving positions.

### Source reconciliation / distinction
- `MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1` and `...BLD-0001 Rev.C1` are the physical/function reference drawings (the source files have C1/AFC stamps for legacy scope), **NOT** an updated approved BDA-specific AFC.
- `5-Deviation List Rev00.xlsx`, original Item 1.1, Status **Open**, contains a wider historical proposal: RFI BDA + RFI YBSS6 six-element donor antenna and Omni relocated to **beneath Lower Deck +18.300m**. Keep that source row unchanged for traceability, but the latest manager-selected bid design **does not adopt** the antenna changes.
- `MM-ZTK-1F-GEN-SCADA-TEL-DWG-0001_All.pdf` Rev00 remains an internal check and is not a final cable-route WIR/TER.

## Exact site-specific placement mapping unchanged
| Site | RFI BDA physical position (original LNA TAG) | RF Surge Exd TAG |
|---|---|---|
| ZWP20 | TCAB-508-002 | TCAB-508-001 |
| ZWP21 | TCAB-508-001 | TCAB-508-002 |
| ZWP22 | TCAB-508-001 | TCAB-508-002 |
Yagi `ANT-508-001` and Omni `ANT-508-002` keep their original reference positions at each site. A site-reference TAG mapping is not formal modification approval.

## Source → engineering → Working → Release rule
- **10.1** `bid.budget.bom.physical-cable-end-register` current selected design flags: LNA→BDA only, all positions unchanged. 61 functional cable-end candidates (17 applicable MR/site pairs) remain; real route length, connector quantity and buy Qty are NULL until WIR/TER/GA/Ex.
- **MR0002** `mr0002RfPhysicalRouteReconciliation0553.js` maintains two concept RF paths/site; 9.144m grid + 3m proxy and 15% may remain a labeled **same-position budgetary sensitivity only**, not an approved physical installed length or a procurement quantity.
- **Vendor ownership:** MGW FORLLER 100m and 6 male RF connectors/site quoted and included in complete-system scope; shortages/qualification to vendor. ADDVALUE NEK is conditional optional spare only.
- **Existing cost/source A5:** THB 260232 partial reclassification non-additive; no additional posting. Working Sell and 10.3/10.5 monetary amounts unchanged.
- **Release gate:** internal engineering design selected now; formal customer technical/deviation closure still Open, and detailed Ex/RF isolation/actual cable ends unknown. Keep customer approval gating separate from ability to prepare budget estimate.

## Files changed
`data/mr0002DeviationBdaRev00_0553.js` adds `workingDesign` without altering original `proposed` historical row.
`data/physicalCableEndRegister0553.js` keeps existing decks for selected design; historical lower-deck relocation retained as **NOT ADOPTED** field.
`data/mr0002RfPhysicalRouteReconciliation0553.js` differentiates `selectedWorkingBdaMapsToOriginalLnaSitePosition=true` from customer acceptance `selectedMgWBdaFunctionMapsToOriginalAfcLna=false`.
`data/bulkSourceToReleaseTrace0553.js` surfaces status; two JSX views remove misleading "relocated Omni" current-design text.
Two native validators have corresponding new assertions.

**Artifact:** Separate revised internal Excel `PJ2608-0553_Physical_Cable-End_Register_MR0001-0004_BDA_Same-Location_Rev02_20261022.xlsx`, with new selected design sheet and original Rev00 quoted row preserved.

## Test status
Controlled source-model smoke (actual selected MGW quote and exact MR0001 Rev04 snapshot, mocked unrelated other bulk models) shows 17 scope pairs, 61 cable-function candidates, all 3 WP same-position endpoints, unchanged A5 THB260232, no new working amount and no customer release. Native npm/Babel/Webpack/Browser validation has NOT been run. Keep as Draft until clean-worktree tests. 
