# Vendor Offers as the Working price source

12 November 2026 · PJ2608-0550 · Base `ccc4ad37`

In 10.2, open ALIE R2 Supplier source trace and select **เตรียม Working จาก Offer** on an eligible 07.2 source row. The existing Working editor receives the Offer ID, system, TAG, source, unit, currency and documented equipment quantity. Saving creates one canonical Working owner. The source rate stays on the Offer and the Working model calculates cost, ADDVALUE sell and the Prime selling layer. Service rates per day or trip require a Working workload. Priced option spares can start in Working C2 or C3 when the source explicitly identifies Schedule C4 or C3. Actual-cost, ambiguous option, included component and already allocated rows need review of their source or existing owner.

Working Preview in Volume I uses a compatible Vendor schedule tag for an unallocated selected owner. Existing saved allocations, special current-tender allocations and SI spare-equation rules retain priority. E/F draw from their existing A1 Others owners. Mapping remains available for MR evidence, scope review and exceptions. Official review and the frozen issue path continue to use their existing evidence and approval rules.

PAGA Working A1-05 can select INDUSTRONIC A20261632-005 as one discounted NET Lot on the existing owner. Choosing the Offer applies the project direct-supplier E11 markup and uses the recorded Prime rate, with the project goods default when no Prime rate is entered. Registering the quotation leaves the existing selected revision in place until the Working owner is edited. Item 25010 is the commissioning kit for -005. The included kit in -002/-003 remains Item 18020. Included quote detail stays non-additive.

## PAGA Appendix 1.4 selling policy

12 November 2026 · Follow-up to `ea134091`. The selected INDUSTRONIC Part A owner under A1-05 uses ADDVALUE 25% markup on its sourced cost (E11) and SAMTEL 20% markup on the ADDVALUE sell price (E13). The customer price is 1.50 times the sourced cost before currency conversion and rounding. The policy applies in the Working editor, on offer selection, at startup and when saving live Working. The existing offer, quantity, FX, Volume I binding and issue snapshots retain their own records. The earlier scope notes and checks below describe the initial Vendor intake implementation.

The change follows ADR-0550-001 principles 2, 5 and 8–11. The ALIE regression verifies migration from the earlier selling basis, idempotence, scope isolation and an updated Official review fingerprint. The private -005 check verifies the single NET owner and the common Working, draft Release and C1 amount. Source costs stay on the existing Offer. Official issue review follows the existing controls.

## Checks and scope

- ADR-0550-001 principles 2–6 and 8–13 guided the separation of quoted facts from working scope, one financial owner, transparent OPEN items, direct source trace, revision review and preserved issue history.
- The ALIE regression checks live Offer repricing, E11 and E13, duplicate and included-row protection, OPEN service workload, Base/Option routing and source-tagged Schedule preview. The private -005 register checks the actual NET owner, its included kit, 50% ADDVALUE and 20% SAMTEL in the fixture and duplicate NET suppression. No private source file is tracked in Git.
- Working Schedules, Bid Volumes, Bid Completion, Supplier Revision and controlled Release Issue validators passed. Development and production webpack compiled. Chromium launch is blocked by the execution environment's socket permissions, so browser interaction and the owner's Windows IndexedDB remain unverified.
- The parent repository-basis fixture expects 117 registered Offers and finds 116. The MGW detail validator on the parent also stops while checking a RADIO component inside a nested HTML table.

## 13 November · APF IP PBX Server

The existing APF MR 9.0 Working owner for A1-04 takes one Dell R660 server bundle at the registered CHEVALIER CITT-QT-392-2026 Rev.01 item 1.1.1 unit rate. The two-bundle Offer and package-level discount remain in 07.2. Working uses the MR quantity and the existing Goods selling basis. The draft still needs supplier confirmation of the one-bundle rate and SI review of the second server's role and placement.

The automatic 07.2 load and manual Vendor registration both use this source when the generated Working owner is eligible. 10.7 Draft and 11.C1 item 1.3.P1 use the same owner and price. The quoted NET package and the allocated server bundle cannot both charge the same source. The old MGW Offer remains traceable. Authored costs, reviewed allocations, and frozen issues retain their existing records.

ADR-0550-001 principles 2, 3, 5, 6 and 8–13 apply. The private CHEVALIER register test checks the MR and prior MGW paths, source quantity, repeated preparation, A1-04 Release and C1 price parity, competing NET, and protected Working and Schedule records. The Windows workspace must load the prepared CHEVALIER Vendor register through the existing source intake. Its saved state has not been observed.
