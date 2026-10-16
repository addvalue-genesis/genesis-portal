# PJ2608-0553 — Phase 2 Document-Driven Spare Recalculation & Source Gaps (2026-10-16)

## Purpose / source hierarchy
Recompute obligations and audit five customer schedules B10/B11/B13/C1/C2 using original MR0001–0004 Rev.C1 §5 and Attachments 5, 7, 8, 9; SPE Rev.C2 §8.1; MMC25-5001 EXA-A8 Att-1 and Att-2; current OEM Working BOM, current MDS/ORGA quotation QTORG2609244 and Rev08 priced baseline. Reuse equations MAP-02/06/07/08/09 and Section 02 methodology; do not generate arbitrary spare parts or SKU counts.

## Actual document requirements established
- MR0001 SCADA: 4 platforms ZWP20–23, **4 commissioning SPARE KIT sets**; B11 tool requirement 1 set/phase; C2 2-year priced quotation.
- MR0002 DMR: 3 platforms ZWP20–22, **3 KIT sets**; tool 1 set/phase; C2 quotation.
- MR0003 Ex Phone: 4 platforms ZWP20–23, **4 KIT sets**; tool 1 set/phase; C2 quotation.
- MR0004 Marine RACON: 3 platforms ZWP20–22, **3 KIT sets**; tool 1 set/phase; C2 quotation. Repeated offshore commissioning 1-set/platform wording must not silently double kits.
- **14 contracted B10 commissioning KIT sets, four per-MR B11 tool phase requirements.** A kit's bill of component parts, complete equipment spare part and physical SKU count **cannot** be inferred from the one-set statement.
- MR **Attachment 5** requires original vendor prepared itemized OEM spare list with OEM part numbers, price, availability/lead time, drawings, installation, shipment/preservation, applicable lubricant/filter/gaskets, start-up procedure parts, shelf-life and technician support. Not yet supplied as verified machine-readable BOM in this working model.
- MR **Attachment 7 instruction 6** for **ALL FOUR MRs** expressly **excludes every Pre-Commissioning and Start-up Spare Parts List item from C2 2-year operating spares**. Same SKU crosswalk must be proved before removing historical candidates or reporting a C2 price as final. Attachment 7 requires per-item pricing and parts availability.
- MR **Attachment 8** special tool item descriptions/prices/quantities/use and equipment Tags. EXA-A8 Att2 §5 specifies SCADA radio software/NMS and conditional beacon tools. Include tools already quoted in Part A without duplicate additional owner.
- MR **Attachment 9** long-term shipping/preservation specifies quantities and recurring preservation intervals; B13 usage not independently derived from Rev08 source Qty.

## Confirmed price evidence vs unknowns
Original Rev08 THB working reference at budget conversion 31.5: B10 **123,024.37**, B11 **128,314.11** (non-posting budget candidate), B13 **22,484.21**, C1 **4,049,349.36** (option), C2 **721,806.68** (option). These are historical source priced items, **not proven corresponding kit-by-kit OEM SPIR**. User wants new cost and price, but new source-based unit price × independently established component quantities **remains null** until OEM itemized kit composition and price inputs exist. Do not portray source placeholder as zero cost.

Historical C1 RACON full spare priced **USD121,470.3158**/set; selected MDS/ORGA `QTORG2609244` currently quotes an INSTALLED one system package at **USD75,000 FCA** in Part A. This is *not* a spare-unit quote or equivalent scope. Its FYI comparative THB **2,362,500** vs historical C1 unit **THB3,826,314.95** cannot be automatically posted as saved cost/delta. The independent C1 spare quantity is NOT mandated by MR 1 Set/Platform.

## MDS/ORGA quote contradictions for review
`QTORG2609244` §1 includes BFOU cables, six CMP glands, purge kit, USB programming lead, and FAT, while §4 says cables/glands not included, and §3.2 says FAT cost excluded. §3.6 states 'No special tools required' while MR/EXA-A8 defines phase-tool and conditional beacon config/charging requirements. Source quote is FCA factory excluding VAT; C1 customer DDP yard pricing not proven. Explicit 10.2 reconciliation flags this; do not double count.

## Implemented in branch
- `frontend/src/project0553/data/spareEngineeringReconciliation0553.js`: source-linked 14 KIT rows (one per MR/platform), 4 Tool requirements, 11-item Attachment5 checklist, two historical C1 candidates with no mandatory full-unit assumption, selected ORGA comparison, vendor inclusion contradictions, five-category unverified direct-cost totals. All non-posting.
- `frontend/src/project0553/data/spareCustomerSchedule0553.js`: C2 source cross-category exclusions from Attachment7, retain all original historical rows as unverified candidates, no unverified silent deletion.
- `frontend/src/project0553/ScopeBcAnnexDetail0553.jsx`: 10.2/10.5 working views expose the 14-kit required schedule separately from original Rev08 priced rows; B11 phased sets, B13 Attachment9 gate, C1 source price comparison/optional gate, C2 Attachment7 exclusion, ORGA source conflicts, Attachment5 vendor checklist and current Working SELL caveats.
- `frontend/scripts/validate-0553-spare-engineering-reconciliation.cjs` integrated at start of `npm run build`, preserve existing Working Sell and options.

## Validation (honest)
GitHub update committed; no local user's Windows runtime `npm run build` or Browser run was executed in this session. Requires user pull and `npm run validate:0553-spare-engineering-reconciliation` followed by `npm run build`. Do not claim all tests pass.

## Remaining implementation/approval gates
Obtain true OEM kit contents/approved SPIR for each of fourteen B10 package requirements; use exact SKU+installed TAG/Location and proof of quantity and individual OEM rates. Reconcile B11 OEM included tool/license and EXA-A8 conditional items, B13 Actual Preservation Program, C1 OEM capital alternative (full vs module), C2 Attachment7 B10 item exclusion. Only then compute new itemized `Q × SourceRate` and Working SELL via existing MAP-08/canonical cost owner and customer DDP price basis. No forcing 31 historical lines to balance a newly invented 14-kit BOM.
