# A1 commissioning and operating spare pricing

## CUS basis for live C2

Current CUS records are STD `10008-STD-6-TEL-001` R00 §7.7.1 (printed p36 / PDF p40) and MR `MM-ASK-1A-APF-TEL-MR-0001` B1 §2.0(n) and Appendix 10 (printed p48 / PDF p50). STD requires separate commissioning/start-up and two-year spare lists. MR Appendix 10 requires itemized parts, numbers, prices, availability and installation/start-up coverage. The required quantities follow the applicable system documents and selected OEM parts list. PHI-0001 §6.11 terminal reserve and PAGA SPE-0004's 25% amplifier expansion are design capacity; CCTV DTS-0004's RAID hot spare is installed equipment. PAGA SPE-0004 §15.1 includes commissioning spares in tender supply and separately requests the two-year list. The clauses reviewed give no common percentage of equipment cost for C2.

Use the existing Working quantity × unit-cost path for B5. Track OEM Part No., quantity, quote price and package inclusion by system before allocating to 11.C2 via 11.M and A1 row 4. INDUSTRONIC A20261632-002 item 18020 (PDF p11) is one commissioning kit, gross EUR160, classified under Special Tools and contained in the net quotation. CERAGON RevA1 R12 is the C4 capital-spare package. Neither is evidence of an additional C2 charge. The priced OEM commissioning-spare list remains open in the checked workspace.

Live preparation retires the three untouched 2%/1%/1% B5 estimates and their active receipts. It preserves authored Working edits, deletions and the old derivation used to verify frozen issues. Initial preparation no longer creates the B5 percentages. 11.C2 shows the pricing basis and links to `l3.original`. The existing C3 option reference remains separate.

The Rev36 fixture plus the current MGW import confirmed three B5 owners reopen and an itemized quantity × unit rate reaches C2. Bid Completion, Working Schedules model, Native Exhibit, controlled issue, production webpack and a focused Chromium C2/CUS check passed. The broader Working Schedules browser test still fails at its existing `556,874.01` fixture assertion, reproduced on parent `680d43c`. These checks cover the prepared fixture. The owner's Windows IndexedDB and the missing OEM quantities and rates remain unverified.

## Earlier allowance refresh

Reproduced against the prepared 0550 Rev36 workspace with the current MGW LAN/PBX/FO register. After retiring the superseded MGW quote, the stale estimate guard held all three B5 prices and both C3 price owners OPEN. The A1 renderer left the C3 row blank because the existing C3 allocation is Option. The source Exhibit C rev-0 A1 note explicitly excludes two-year operation spares from the Base price. The MR still calls for an itemized operating-spare offer.

| A1 row | Working owner | Draft treatment |
| --- | --- | --- |
| 4 · Form C-2 | B5-D01/D02/D03 | Base. Existing 2% + 1% + 1% of known current Part A procurement cost |
| 5 · Form C-3 | C3-D02/D03 | Option. Existing 2% + 1% of the same cost basis. A1 Notes references the Option amount counted in A2 |

The refresh applies only to untouched, selected generated estimates under the MGW replacement guard, with a positive, calculated Part A cost basis. It uses the existing selling and FX equations. The old saved manual cost, receipt, vendor offers and user edits stay intact. The live calculation is a Working allowance and is held out of Official pricing. Other dependent allowances keep their existing review rules. Form C2/C3 and A2 show the known Working price even when the CIF/FOB price columns await allocation. The A1 notes and detail summaries are draft-only. The existing C4 capital-spare owner is separate.

ADR-0550-001 principles 2, 5, 6, 8–12 apply. A positive known procurement subtotal can still be incomplete. The estimate does not establish actual OEM SKU, quantity, delivery or availability, package inclusion or purchaser acceptance. Verify the OEM breakdown, deduct proven package overlap and record the customer delivery term before submitting. Frozen outputs, official review requirements and existing Module IDs remain in use.

Verified on the prepared project fixture after the real MGW import: all five owners calculate, the USD and THB amounts tie out to A1 and C2/C3, and Reviewed prices stay OPEN. Deselecting a Part A price owner updates the basis, no eligible cost leaves the price OPEN, and saved price edits and deletions are preserved. Production webpack and isolated Chromium passed. The browser checked both new shortcuts, the Base/Option presentation and the read-only 11.E/F regression. Bid Completion, Working Schedules model, Native Exhibit C, controlled issue and continuity checks passed. This is a prepared fixture, separate from the owner's Windows IndexedDB.

## Vendor trace and cost-only check

07.2 Vendor and the selected Working Part A records read the same canonical Offer IDs. The C2 form consumes the B5 lines via 11.M and adds their customer selling amounts to A1 row 4. It uses Working quantities and FX for the selected cost owners, rather than the vendor page's display subtotal. The 07.2 screen was reproduced with the current MGW register. The current quote's priced Base lines were matched by Offer ID to all 37 selected MGW price owners. Its Option stays outside that basis.

The initial refresh used the provisional customer-pricing projection as its cost gate. A missing selling margin or Prime input could therefore suppress otherwise known procurement cost. The revised refresh computes the spare procurement basis before selling validation, using the existing selection, quantity, source, scope and FX checks. Removing Prime from a known equipment line leaves its procurement cost in the B5/C3 basis and its selling price OPEN. Removing the owner from the selected scope removes its cost. No saved inputs, module IDs, official approval or historic outputs change. This follows ADR-0550-001 principles 5, 6, 8, 10 and 11.
